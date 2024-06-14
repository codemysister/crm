<?php

namespace App\Imports;

use App\Jobs\GenerateInvoiceSubscriptionJob;
use App\Models\InvoiceSubscription;
use App\Models\InvoiceSubscriptionBill;
use App\Models\Partner;
use App\Models\Status;
use App\Utils\ExtendedTemplateProcessor;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithStartRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Spatie\Browsershot\Browsershot;
use PhpOffice\PhpWord\Element\Table;
use PhpOffice\PhpWord\SimpleType\TblWidth;

class InvoiceSubscriptionImport implements ToCollection, WithStartRow, WithHeadingRow, WithCalculatedFormulas, WithBatchInserts, WithChunkReading
{
    /**
     * @param Collection $collection
     */
    protected $signature;

    public function __construct()
    {
        $this->signature = ['name' => 'Hari Yuliawan', 'image' => '/assets/img/signatures/ttd_cto.png'];
    }
    public function startRow(): int
    {
        return 2;
    }

    public function batchSize(): int
    {
        return 50;
    }

    public function chunkSize(): int
    {
        return 50;
    }

    function intToRoman($number)
    {
        $map = array('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII');
        return $map[$number - 1];
    }
    public function generateCode()
    {
        $currentMonth = date('n');
        $currentYear = date('Y');

        $lastDataCurrentMonth = InvoiceSubscription::withTrashed()
            ->whereYear('created_at', $currentYear)
            ->whereMonth('created_at', $currentMonth)
            ->orderBy('id', 'desc')
            ->first();
        $code = null;
        if ($lastDataCurrentMonth == null) {
            $code = "0000";
        } else {
            $parts = explode("/", $lastDataCurrentMonth->code);
            $code = $parts[1];
        }
        $codeInteger = intval($code) + 1;
        $latestCode = str_pad($codeInteger, strlen($code), "0", STR_PAD_LEFT);
        $romanMonth = $this->intToRoman($currentMonth);

        $newCode = "#INV/$latestCode/$romanMonth/$currentYear";

        return $newCode;
    }

    public function convertDate($date)
    {
        if (gettype($date) == 'string') {
            return Carbon::createFromFormat('d/m/Y', $date)->toDate();
        } else {
            return Carbon::parse(Date::excelToDateTimeObject($date))->format('Y-m-d H:i:s');
        }
    }

    public function convertInteger($price)
    {
        return intval(preg_replace('/[^0-9]/', '', str_replace('Rp', '', $price)));
    }

    public function generateInvoiceSubscription($invoice_subscription, $bills)
    {
        $path = "invoice_langganan/invoice_langganan-" . $invoice_subscription->uuid . ".pdf";

        $invoice_subscription->invoice_subscription_doc = $path;

        $html = view('pdf.invoice_subscription', ["invoice_subscription" => $invoice_subscription, "bills" => $bills])->render();

        $pdf = Browsershot::html($html)
            ->setIncludedPath(config('services.browsershot.included_path'))
            ->showBackground()
            ->pdf();

        Storage::put("public/$path", $pdf);

        return $invoice_subscription;
    }

    public function collection(Collection $rows)
    {
        foreach ($rows as $key => $row) {

            try {
                // $partnerExist = Partner::where('name', 'like', '%' . $row["partner"] . '%')->first();
                $databaseType = config('database.default');
                if ($databaseType == 'pgsql') {
                    $partnerExist = Partner::whereRaw("substring(name from '^[^,]*') LIKE ?", ['%' . explode(',', $row['partner'])[0] . '%'])->first();
                } else {
                    $partnerExist = Partner::whereRaw("SUBSTRING_INDEX(name, ',', 1) LIKE ?", ['%' . explode(',', $row['partner'])[0] . '%'])->first();
                }

                $date_now = Carbon::now()->setTimezone('GMT+7');
                $invoice_age = $date_now->diffInDays($this->convertDate($row['tanggal']), false) + 1;

                if ($partnerExist == null) {
                    return redirect()->back()->withErrors([
                        'error' => "Lembaga " . $row['partner'] . " belum terdaftar"
                    ]);
                }

                $pajak1 = $row['pajak1'] ?? 0;
                $pajak2 = $row['pajak2'] ?? 0;
                $pajak3 = $row['pajak3'] ?? 0;
                $total_ppn = $this->convertInteger($pajak1) + $this->convertInteger($pajak2) + $this->convertInteger($pajak3);

                $statusBelumBayar = Status::where('name', 'belum bayar')->where('category', 'invoice')->first();

                $bills = [];
                $bills[] = [
                    'bill' => $row['tagihan1'],
                    'nominal' => $this->convertInteger($row['harga1']),
                    'total_ppn' => $this->convertInteger($row['pajak1']),
                    'ppn' => $this->convertInteger($row["pajak1"]) / $this->convertInteger($row["harga1"]) * 100,
                    'total_bill' => $this->convertInteger($row['jumlah1']),
                ];

                if ($row['tagihan2'] && $row['harga2'] && $row['pajak2'] && $row['jumlah2']) {
                    $bills[] = [
                        'bill' => $row['tagihan2'],
                        'nominal' => $this->convertInteger($row['harga2']),
                        'total_ppn' => $this->convertInteger($row['pajak2']),
                        'ppn' => $this->convertInteger($row["pajak2"]) / $this->convertInteger($row["harga2"]) * 100,
                        'total_bill' => $this->convertInteger($row['jumlah2']),
                    ];
                }

                if ($row['tagihan3'] && $row['harga3'] && $row['pajak3'] && $row['jumlah3']) {
                    $bills[] = [
                        'bill' => $row['tagihan3'],
                        'nominal' => $this->convertInteger($row['harga3']),
                        'total_ppn' => $this->convertInteger($row['pajak3']),
                        'ppn' => $this->convertInteger($row["pajak3"]) / $this->convertInteger($row["harga3"]) * 100,
                        'total_bill' => $this->convertInteger($row['jumlah3']),
                    ];
                }


                $invoice_subscription = new InvoiceSubscription();
                $invoice_subscription->uuid = Str::uuid();
                $invoice_subscription->partner_id = $partnerExist->id;
                $invoice_subscription->status_id = $statusBelumBayar->id;
                $invoice_subscription->code = $this->generateCode();
                $invoice_subscription->date = $this->convertDate($row['tanggal']);
                $invoice_subscription->period = $this->convertDate($row['tanggal']);
                $invoice_subscription->due_date = $this->convertDate($row['expired']);
                $invoice_subscription->invoice_age = $invoice_age;
                $invoice_subscription->partner_name = $partnerExist->name;
                $invoice_subscription->partner_province = $partnerExist->province;
                $invoice_subscription->partner_regency = $partnerExist->regency;
                $invoice_subscription->signature_name = $this->signature['name'];
                $invoice_subscription->signature_image = $this->signature['image'];
                $invoice_subscription->total_nominal = $this->convertInteger($row['sub_total']);
                $invoice_subscription->total_ppn = $this->convertInteger($total_ppn);
                $invoice_subscription->total_bill = $this->convertInteger($row['total']);
                $invoice_subscription->rest_of_bill = $this->convertInteger($row['total']);
                $invoice_subscription->rest_of_bill_locked = $this->convertInteger($row['total']);
                $invoice_subscription->paid_off = $this->convertInteger($row['diskon']);
                $invoice_subscription->payment_metode = $row['xendit'] ? 'payment link' : 'cazhbox';
                $invoice_subscription->xendit_link = $row['xendit'] ? $row['xendit'] : null;
                $invoice_subscription->created_by = Auth()->user()->id;
                $invoice_subscription = $this->generateInvoiceSubscription($invoice_subscription, $bills);
                $invoice_subscription->save();



                InvoiceSubscriptionBill::create([
                    'uuid' => Str::uuid(),
                    'invoice_subscription_id' => $invoice_subscription->id,
                    'bill' => $row['tagihan1'],
                    'nominal' => $this->convertInteger($row['harga1']),
                    'total_ppn' => $this->convertInteger($row['pajak1']),
                    'ppn' => $this->convertInteger($row["pajak1"]) / $this->convertInteger($row["harga1"]) * 100,
                    'total_bill' => $this->convertInteger($row['jumlah1']),
                ]);

                if ($row['tagihan2'] && $row['harga2'] && $row['pajak2'] && $row['jumlah2']) {
                    InvoiceSubscriptionBill::create([
                        'uuid' => Str::uuid(),
                        'invoice_subscription_id' => $invoice_subscription->id,
                        'bill' => $row['tagihan2'],
                        'nominal' => $this->convertInteger($row['harga2']),
                        'total_ppn' => $this->convertInteger($row['pajak2']),
                        'ppn' => $this->convertInteger($row["pajak2"]) / $this->convertInteger($row["harga2"]) * 100,
                        'total_bill' => $this->convertInteger($row['jumlah2']),
                    ]);
                }

                if ($row['tagihan3'] && $row['harga3'] && $row['pajak3'] && $row['jumlah3']) {
                    InvoiceSubscriptionBill::create([
                        'uuid' => Str::uuid(),
                        'invoice_subscription_id' => $invoice_subscription->id,
                        'bill' => $row['tagihan3'],
                        'nominal' => $this->convertInteger($row['harga3']),
                        'total_ppn' => $this->convertInteger($row['pajak3']),
                        'ppn' => $this->convertInteger($row["pajak3"]) / $this->convertInteger($row["harga3"]) * 100,
                        'total_bill' => $this->convertInteger($row['jumlah3']),
                    ]);
                }


                DB::commit();

            } catch (Exception $e) {
                DB::rollback();
                Log::error('Error import invoice langganan: ' . $e->getMessage());
                return redirect()->back()->withErrors([
                    'error' => $e->getMessage()
                ]);
            }
        }
    }
}
