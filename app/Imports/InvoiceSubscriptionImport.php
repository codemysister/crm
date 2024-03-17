<?php

namespace App\Imports;

use App\Jobs\GenerateInvoiceSubscriptionJob;
use App\Models\InvoiceSubscription;
use App\Models\InvoiceSubscriptionBill;
use App\Models\Partner;
use App\Utils\ExtendedTemplateProcessor;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
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

    public function __construct($signature)
    {
        $this->signature = $signature;
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


    public function generateInvoiceSubscription($invoice_subscription, $bundle_uuid = null)
    {
        $templateInvoice = 'assets/template/invoice_umum.docx';

        if ($invoice_subscription->payment_metode === 'payment link') {
            if ($invoice_subscription->total_ppn === 0) {
                $templateInvoice = 'assets/template/invoice_langganan_tanpa_pajak.docx';
            } else {
                $templateInvoice = 'assets/template/invoice_langganan.docx';
            }
        } else {
            $templateInvoice = 'assets/template/invoice_langganan_cazhbox.docx';
        }

        $phpWord = new ExtendedTemplateProcessor($templateInvoice);
        $phpWord->setValues([
            'code' => $invoice_subscription->code,
            'date' => Carbon::parse($invoice_subscription->date)->format('d/m/Y'),
            'due_date' => Carbon::parse($invoice_subscription->due_date)->format('d/m/Y'),
            'partner' => $invoice_subscription->partner_name,
            'province' => json_decode($invoice_subscription->partner_province)->name,
            'regency' => json_decode($invoice_subscription->partner_regency)->name,
            'paid_off' => "Rp" . number_format($invoice_subscription->paid_off, 0, ',', '.'),
            // 'xendit' => $invoice_subscription->xendit_link,
            'signature_name' => $invoice_subscription->signature_name,
        ]);

        $table = new Table(
            array(
                'width' => 100 * 50,
                'alignment' => \PhpOffice\PhpWord\SimpleType\JcTable::CENTER,
                'layout' => \PhpOffice\PhpWord\Style\Table::LAYOUT_FIXED,
                'unit' => TblWidth::PERCENT
            )
        );

        $phpWord->setImageValue('signature_image', array('path' => public_path("/storage/$invoice_subscription->signature_image")));

        // $phpWord->setComplexValue('xendit', $linkTest);
        $linkVar = new \PhpOffice\PhpWord\Element\TextRun();
        $linkTest = $linkVar->addLink($invoice_subscription->xendit_link, $invoice_subscription->xendit_link, ['name' => 'Inter', 'size' => 10, 'color' => 'blue', 'underline' => \PhpOffice\PhpWord\Style\Font::UNDERLINE_SINGLE]);

        $phpWord->addLink($linkTest);
        $phpWord->setComplexValue('xendit', $linkVar);

        $table->addRow(400);
        $pStyle = array('spaceAfter' => 20, 'align' => 'center');
        $table->addCell(500, [
            'bgColor' => '#D9D2E9',
            'valign' => 'center',
            'borderSize' => 8,
            'borderColor' => 'ded8ee',
        ])->addText('No', ['color' => '000000', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);
        $table->addCell(3000, [
            'bgColor' => '#D9D2E9',
            'valign' => 'center',
            'borderSize' => 8,
            'borderColor' => 'ded8ee',
        ])->addText('Tagihan', ['color' => '000000', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);
        $table->addCell(2000, [
            'bgColor' => '#D9D2E9',
            'valign' => 'center',
            'borderSize' => 8,
            'borderColor' => 'ded8ee',
        ])->addText('Harga', ['color' => '000000', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);
        $table->addCell(2000, [
            'bgColor' => '#D9D2E9',
            'valign' => 'center',
            'borderSize' => 8,
            'borderColor' => 'ded8ee',
        ])->addText('Pajak', ['color' => '000000', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);
        $table->addCell(2000, [
            'bgColor' => '#D9D2E9',
            'valign' => 'center',
            'borderSize' => 8,
            'borderColor' => 'ded8ee',
        ])->addText('Jumlah', ['color' => '000000', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);

        $values = collect($invoice_subscription->bills)->map(function ($bill) {
            return ['bill' => $bill['bill'], 'nominal' => number_format($bill['nominal'], 0, ',', '.'), 'total_ppn' => number_format($bill['total_ppn'], 0, ',', '.'), 'total_bill' => number_format($bill['total_bill'], 0, ',', '.')];
        });

        foreach ($values as $key => $value) {
            $table->addRow(400);
            $table->addCell(null, [
                'valign' => 'center',
                'borderSize' => 8,
                'borderColor' => 'ded8ee'
            ])->addText($key + 1, ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'center']);
            $table->addCell(null, [
                'valign' => 'center',
                'borderSize' => 8,
                'borderColor' => 'ded8ee'
            ])->addText($value['bill'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'left']);
            $table->addCell(null, [
                'valign' => 'center',
                'borderSize' => 8,
                'borderColor' => 'ded8ee'
            ])->addText("Rp" . $value['nominal'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'left']);
            $table->addCell(null, [
                'valign' => 'center',
                'borderSize' => 8,
                'borderColor' => 'ded8ee'
            ])->addText("Rp" . $value['total_ppn'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'left']);
            $table->addCell(null, [
                'valign' => 'center',
                'borderSize' => 8,
                'borderColor' => 'ded8ee'
            ])->addText("Rp" . $value['total_bill'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'left']);
        }

        $cellColSpan = [
            'gridSpan' => 4,
            'valign' => 'center',
            'align' => 'right',

        ];

        $table->addRow(400);
        $cell1 = $table->addCell(400, $cellColSpan);
        $cell1->addText('Sub Total', ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'right']);
        $table->addCell(400, [
            'valign' => 'center',
            'borderSize' => 8,
            'borderColor' => 'ded8ee'
        ])->addText("Rp" . number_format($invoice_subscription->total_bill, 0, ',', '.'), ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'left']);

        $table->addRow(400);
        $cell2 = $table->addCell(400, $cellColSpan);
        $cell2->addText('Diskon/Uang Muka', ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'right']);
        $table->addCell(400, [
            'valign' => 'center',
            'borderSize' => 8,
            'borderColor' => 'ded8ee'
        ])->addText("Rp" . number_format($invoice_subscription->paid_off, 0, ',', '.'), ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'left']);

        $table->addRow(400);
        $cell3 = $table->addCell(400, $cellColSpan);
        $cell3->addText('Total Tagihan', ['name' => 'Inter', 'size' => 10, 'bold' => true], ['spaceAfter' => 20, 'align' => 'right']);
        $table->addCell(400, [
            'valign' => 'center',
            'borderSize' => 8,
            'borderColor' => 'ded8ee'
        ])->addText("Rp" . number_format($invoice_subscription->total_bill, 0, ',', '.'), ['name' => 'Inter', 'size' => 10, 'bold' => true], ['spaceAfter' => 20, 'align' => 'left']);

        $phpWord->setComplexBlock('table', $table);


        $phpWord->setImageValue('signature_image', array('path' => public_path("/storage/$invoice_subscription->signature_image")));
        $phpWord->setImageValue('signature_image', array('path' => public_path("/storage/$invoice_subscription->signature_image")));
        $fileName = str_replace(' ', '_', $invoice_subscription->partner_name) . '_' . str_replace('/', '_', $invoice_subscription->code) . '.docx';

        $directoryPath = $bundle_uuid == null ? storage_path("app/public/invoice_langganan/") : storage_path("app/public/invoice_langganan/$bundle_uuid/");

        if (!File::isDirectory($directoryPath)) {
            File::makeDirectory($directoryPath, 0755, true, true);
        }

        $phpWord->saveAs($directoryPath . $fileName);
        $invoice_subscription->update(['invoice_subscription_doc' => 'invoice_langganan/' . $fileName]);

    }

    public function generateInvoiceSubscriptionPdf($invoice_subscription, $bundle_uuid = null)
    {
        $path = $bundle_uuid ? "invoice_langganan/$bundle_uuid/" . str_replace(' ', '_', $invoice_subscription->partner_name) . '_' . str_replace('/', '_', $invoice_subscription->code) . ".pdf" : "invoice_langganan/" . str_replace(' ', '_', $invoice_subscription->partner_name) . '_' . str_replace('/', '_', $invoice_subscription->code) . ".pdf";

        $invoice_subscription->update([
            "invoice_subscription_doc" => "$path"
        ]);

        $html = view('pdf.invoice_subscription', ["invoice_subscription" => $invoice_subscription])->render();

        $pdf = Browsershot::html($html)
            ->setIncludedPath(config('services.browsershot.included_path'))
            ->showBackground()
            ->pdf();

        Storage::disk('public')->put($path, $pdf);
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

    public function collection(Collection $rows)
    {


        // dd($this->signature);
        foreach ($rows as $key => $row) {

            // $partnerExist = Partner::where('name', 'like', '%' . $row["partner"] . '%')->first();
            $databaseType = config('database.default');
            dd($databaseType);
            if ($databaseType == 'pgsql') {
                $partnerExist = Partner::whereRaw("substring(name from '^[^,]*') LIKE ?", ['%' . explode(',', $row['partner'])[0] . '%'])->first();
            } else {
                $partnerExist = Partner::whereRaw("SUBSTRING_INDEX(name, ',', 1) LIKE ?", ['%' . explode(',', $row['partner'])[0] . '%'])->first();
            }

            $date_now = Carbon::now()->setTimezone('GMT+7');
            $invoice_age = $date_now->diffInDays($this->convertDate($row['tanggal']), false) + 1;

            if ($partnerExist == null) {
                return null;
            }

            $pajak1 = $row['pajak1'] ?? 0;
            $pajak2 = $row['pajak2'] ?? 0;
            $pajak3 = $row['pajak3'] ?? 0;
            $total_ppn = $this->convertInteger($pajak1) + $this->convertInteger($pajak2) + $this->convertInteger($pajak3);


            $invoice_subscription = InvoiceSubscription::create([
                'uuid' => Str::uuid(),
                'partner_id' => $partnerExist->id,
                'code' => $row['nomor'],
                'date' => $this->convertDate($row['tanggal']),
                'period' => $this->convertDate($row['tanggal']),
                'due_date' => $this->convertDate($row['expired']),
                'invoice_age' => $invoice_age,
                'partner_name' => $partnerExist->name,
                'partner_province' => $partnerExist->province,
                'partner_regency' => $partnerExist->regency,
                'signature_name' => $this->signature['name'],
                'signature_image' => $this->signature['image'],
                'total_nominal' => $this->convertInteger($row['sub_total']),
                'total_ppn' => $this->convertInteger($total_ppn),
                'total_bill' => $this->convertInteger($row['total']),
                'rest_of_bill' => $this->convertInteger($row['total']),
                'rest_of_bill_locked' => $this->convertInteger($row['total']),
                'paid_off' => $this->convertInteger($row['diskon']),
                'status' => "belum terbayar",
                'payment_metode' => $row['xendit'] ? 'payment link' : 'cazhbox',
                'xendit_link' => $row['xendit'] ? $row['xendit'] : null,
                'created_by' => Auth()->user()->id,
            ]);

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

            $invoice_subscription = InvoiceSubscription::with('bills')->where('uuid', '=', $invoice_subscription->uuid)->first();

            // dd($invoice_subscription);
            GenerateInvoiceSubscriptionJob::dispatch($invoice_subscription, $invoice_subscription->bills);

        }
    }
}
