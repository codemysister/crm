<?php

namespace App\Http\Controllers;

use App\Http\Requests\InvoiceSubscriptionRequest;
use App\Imports\InvoiceSubscriptionImport;
use App\Jobs\GenerateInvoiceGeneralJob;
use App\Jobs\GenerateInvoiceSubscriptionJob;
use App\Models\InvoiceSubscription;
use App\Models\InvoiceSubscriptionBill;
use App\Models\InvoiceSubscriptionBundle;
use App\Models\InvoiceSubscriptionTransaction;
use App\Models\Partner;
use App\Models\Signature;
use App\Models\Status;
use App\Models\User;
use App\Utils\ExtendedTemplateProcessor;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\File;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpWord\Element\TextRun;
use Spatie\Activitylog\Models\Activity;
use Spatie\Browsershot\Browsershot;
use PhpOffice\PhpWord\Element\Table;
use PhpOffice\PhpWord\SimpleType\TblWidth;
use Maatwebsite\Excel\Excel as ExcelExcel;

class InvoiceSubscriptionController extends Controller
{

    public function editInvoice(Request $request, $uuid)
    {
        $invoiceSubscriptionProp = InvoiceSubscription::with('bills', 'partner', 'status')->where('uuid', '=', $uuid)->first();
        $partnersProp = Partner::with('sales', 'account_manager', 'status', 'subscription')->get();
        $signaturesProp = Signature::all();
        return Inertia::render('InvoiceSubscription/Edit', compact('invoiceSubscriptionProp', 'partnersProp', 'signaturesProp'));

    }

    public function index()
    {
        $partnersProp = Partner::with('sales', 'account_manager', 'status')->get();
        $usersProp = User::with('roles')->get();
        $signaturesProp = Signature::all();
        return Inertia::render('InvoiceSubscription/InvoiceSubscription', compact('partnersProp', 'signaturesProp', 'usersProp'));
    }

    public function create()
    {
        $partnersProp = Partner::with('sales', 'account_manager', 'status', 'subscription')->get();
        $signaturesProp = Signature::all();
        return Inertia::render('InvoiceSubscription/Create', compact('partnersProp', 'signaturesProp'));
    }

    public function generateInvoiceSubscriptionWord($invoice_subscription, $bundle_uuid = null)
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

    public function generateInvoiceSubscription($invoice_subscription, $bills)
    {
        $path = "invoice_langganan/invoice_langganan-" . $invoice_subscription->uuid . ".pdf";

        $invoice_subscription->invoice_subscription_doc = 'storage/' . $path;

        $html = view('pdf.invoice_subscription', ["invoice_subscription" => $invoice_subscription, "bills" => $bills])->render();

        $pdf = Browsershot::html($html)
            ->setIncludedPath(config('services.browsershot.included_path'))
            ->showBackground()
            ->pdf();

        Storage::put("public/$path", $pdf);

        return $invoice_subscription;
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

    public function intToRoman($number)
    {
        $map = array('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII');
        return $map[$number - 1];
    }

    public function generateCode()
    {
        $currentMonth = date('n');
        $currentYear = date('Y');

        function intToRoman($number)
        {
            $map = array('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII');
            return $map[$number - 1];
        }

        $lastDataCurrentMonth = InvoiceSubscription::withTrashed()->whereYear('created_at', $currentYear)
            ->whereMonth('created_at', $currentMonth)->latest()->first();

        $code = null;
        if ($lastDataCurrentMonth == null) {
            $code = "0000";
        } else {
            $parts = explode("/", $lastDataCurrentMonth->code);
            $code = $parts[1];
        }
        $codeInteger = intval($code) + 1;
        $latestCode = str_pad($codeInteger, strlen($code), "0", STR_PAD_LEFT);
        $romanMonth = intToRoman($currentMonth);

        $newCode = "#INV/$latestCode/$romanMonth/$currentYear";

        return $newCode;
    }


    public function store(InvoiceSubscriptionRequest $request)
    {
        DB::beginTransaction();

        try {
            $lastCode = $this->generateCode();

            $date = Carbon::parse($request->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
            $due_date = Carbon::parse($request->due_date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
            $date_now = Carbon::now()->setTimezone('GMT+7');
            $invoice_age = $date_now->diffInDays($date, false) + 1;

            $rest_of_bill = $request->total_bill - $request->paid_off;

            $statusBelumBayar = Status::where('name', 'belum bayar')->where('category', 'invoice')->first();

            $invoice_subscription = new InvoiceSubscription();
            $invoice_subscription->uuid = Str::uuid();
            $invoice_subscription->partner_id = $request->partner['id'];
            $invoice_subscription->status_id = $statusBelumBayar->id;
            $invoice_subscription->code = $lastCode;
            $invoice_subscription->date = $date;
            $invoice_subscription->period = Carbon::parse($date)->locale('id')->isoFormat('DD MMMM YYYY');
            $invoice_subscription->due_date = $due_date;
            $invoice_subscription->invoice_age = $invoice_age;
            $invoice_subscription->partner_name = $request->partner['name'];
            $invoice_subscription->partner_province = $request->partner['province'];
            $invoice_subscription->partner_regency = $request->partner['regency'];
            $invoice_subscription->signature_name = $request->signature['name'];
            $invoice_subscription->signature_image = $request->signature['image'];
            $invoice_subscription->total_nominal = $request->total_nominal;
            $invoice_subscription->total_ppn = $request->total_ppn;
            $invoice_subscription->total_bill = $request->total_bill;
            $invoice_subscription->rest_of_bill = $rest_of_bill;
            $invoice_subscription->rest_of_bill_locked = $rest_of_bill;
            $invoice_subscription->paid_off = $request->paid_off;
            $invoice_subscription->payment_metode = $request['payment_metode'];
            $invoice_subscription->xendit_link = $request->xendit_link;
            $invoice_subscription->created_by = Auth()->user()->id;
            $invoice_subscription = $this->generateInvoiceSubscription($invoice_subscription, $request->bills);
            $invoice_subscription->save();


            foreach ($request->bills as $bill) {

                if (strpos(strtolower($bill['bill']), 'langganan bulan') !== false) {
                    $date = new \DateTime();
                    $monthIndex = $date->format('n') - 1;
                    $monthNames = [
                        "Januari",
                        "Februari",
                        "Maret",
                        "April",
                        "Mei",
                        "Juni",
                        "Juli",
                        "Agustus",
                        "September",
                        "Oktober",
                        "November",
                        "Desember",
                    ];
                    $monthName = $monthNames[$monthIndex];

                    $year = $date->format('Y');

                    $bill['bill'] .= " " . $monthName . " " . $year;
                }

                InvoiceSubscriptionBill::create([
                    'uuid' => Str::uuid(),
                    'invoice_subscription_id' => $invoice_subscription->id,
                    'bill' => $bill['bill'],
                    'nominal' => $bill['nominal'],
                    'total_ppn' => $bill['total_ppn'],
                    'ppn' => $bill['ppn'],
                    'total_bill' => $bill['total_bill'],
                ]);
            }

            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error tambah invoice langganan: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }

    }

    function updateBills($invoice_subscription, $oldData, $newData)
    {
        $oldIds = $oldData->pluck('id');
        $newIds = array_filter(Arr::pluck($newData, 'id'), 'is_numeric');

        $delete = collect($oldData)
            ->filter(function ($model) use ($newIds) {
                return !in_array($model->id, $newIds);
            });

        $update = collect($newData)
            ->filter(function ($model) use ($oldIds) {
                return array_key_exists('id', $model) && in_array($model['id'], $oldIds->toArray());
            });

        $create = collect($newData)
            ->filter(function ($model) use ($oldIds) {
                if (array_key_exists('id', $model)) {
                    return !in_array($model['id'], $oldIds->toArray());
                } else {
                    return true;
                }
            });

        InvoiceSubscriptionBill::destroy($delete->pluck('id')->toArray());
        foreach ($update as $bill) {
            $oldBill = InvoiceSubscriptionBill::where('id', $bill['id'])->first();

            $oldBill->update([
                'bill' => $bill['bill'],
                'nominal' => $bill['nominal'],
                'total_ppn' => $bill['total_ppn'],
                'ppn' => $bill['ppn'],
                'total_bill' => $bill['total_bill'],
            ]);
        }
        foreach ($create as $bill) {
            InvoiceSubscriptionBill::create([
                'uuid' => Str::uuid(),
                'invoice_subscription_id' => $invoice_subscription->id,
                'bill' => $bill['bill'],
                'nominal' => $bill['nominal'],
                'total_ppn' => $bill['total_ppn'],
                'ppn' => $bill['ppn'],
                'total_bill' => $bill['total_bill'],
            ]);
        }

        return true;
    }

    public function update(InvoiceSubscriptionRequest $request, $uuid)
    {
        $date = Carbon::parse($request->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
        $due_date = Carbon::parse($request->due_date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
        $date_now = Carbon::now()->setTimezone('GMT+7');
        $invoice_age = $date_now->diffInDays($date, false) + 1;

        $invoice_subscription = InvoiceSubscription::with('bills', 'transactions')->where('uuid', '=', $uuid)->first();

        $rest_of_bill = 0;
        $paid_transaction = 0;

        if (count($invoice_subscription->transactions) > 0) {
            foreach ($invoice_subscription->transactions as $transaction) {
                $paid_transaction += $transaction->nominal;
            }
            $rest_of_bill = $request->total_bill - $paid_transaction;
        } else {
            $rest_of_bill = $request->total_bill;
        }


        if ($request->total_bill < $paid_transaction) {
            return redirect()->back()->withErrors([
                'error' => 'Nominal harus lebih kecil dari jumlah yang telah terbayar'
            ]);
        }

        $status = Status::where('category', 'invoice');
        if ($rest_of_bill == 0) {
            $status = $status->where('name', 'lunas')->first();
        } else if ($paid_transaction == 0) {
            $status = $status->where('name', 'belum bayar')->first();
        } else {
            $status = $status->where('name', 'sebagian')->first();
        }

        DB::beginTransaction();

        try {

            $invoice_subscription->date = $date;
            $invoice_subscription->status_id = $status->id;
            $invoice_subscription->period = Carbon::parse($date)->locale('id')->isoFormat('DD MMMM YYYY');
            $invoice_subscription->due_date = $due_date;
            $invoice_subscription->invoice_age = $invoice_age;
            $invoice_subscription->partner_name = $request->partner['name'];
            $invoice_subscription->partner_province = $request->partner['province'];
            $invoice_subscription->partner_regency = $request->partner['regency'];
            $invoice_subscription->signature_name = $request->signature['name'];
            $invoice_subscription->signature_image = $request->signature['image'];
            $invoice_subscription->total_nominal = $request->total_nominal;
            $invoice_subscription->total_ppn = $request->total_ppn;
            $invoice_subscription->total_bill = $request->total_bill;
            $invoice_subscription->rest_of_bill = $rest_of_bill;
            $invoice_subscription->rest_of_bill_locked = $request->total_bill;
            $invoice_subscription->paid_off = $request->paid_off;
            $invoice_subscription->payment_metode = $request['payment_metode'];
            $invoice_subscription->xendit_link = $request->xendit_link;
            $invoice_subscription = $this->generateInvoiceSubscription($invoice_subscription, $request->bills);
            $invoice_subscription->save();

            $invoice_subscription = InvoiceSubscription::with('bills')->where('uuid', '=', $uuid)->first();

            $this->updateBills($invoice_subscription, $invoice_subscription->bills, $request->bills);
            if ($invoice_subscription->invoice_subscription_doc !== null) {
                Storage::delete('public/' . $invoice_subscription->invoice_subscription_doc);
            }

            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error update invoice langganan: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }

    }

    public function storeBatch(Request $request)
    {
        $imported = Excel::import(new InvoiceSubscriptionImport($request['partner']['signature']), request()->file('partner.excell'), null, ExcelExcel::CSV);
    }

    public function edit($uuid)
    {
        $invoiceSubscriptionProp = InvoiceSubscription::with('bills', 'partner')->where('uuid', '=', $uuid)->first();
        $partnersProp = Partner::with('sales', 'account_manager', 'status', 'subscriptions')->get();
        $signaturesProp = Signature::all();
        return Inertia::render('InvoiceSubscription/Editjal', compact('invoiceSubscriptionProp', 'partnersProp', 'signaturesProp'));

    }

    public function zipAll(Request $request)
    {
        $zip_file = 'invoice_langganan.zip';
        $zip = new \ZipArchive();
        $zip->open($zip_file, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);
        // dd($request->all());
        foreach ($request->selectedInvoices as $invoice_subscription) {
            $relativePath = $invoice_subscription['invoice_subscription_doc'];
            $absolutePath = storage_path("app/public/" . $relativePath);

            if (file_exists($absolutePath)) {
                $zip->addFile($absolutePath, $relativePath);
            }
        }
        $zip->close();
        $zipContent = file_get_contents($zip_file);
        $base64Zip = base64_encode($zipContent);

        return response()->json(['zip_blob' => $base64Zip]);
    }

    public function restore($uuid)
    {
        $invoice_subscription = InvoiceSubscription::withTrashed()->where('uuid', '=', $uuid)->first();
        $invoice_subscription->restore();
    }

    public function destroy($uuid)
    {
        try {
            $invoice_subscription = InvoiceSubscription::where('uuid', '=', $uuid)->first();
            Activity::create([
                'log_name' => 'deleted',
                'description' => Auth::user()->name . ' menghapus data invoice langganan',
                'subject_type' => get_class($invoice_subscription),
                'subject_id' => $invoice_subscription->id,
                'causer_type' => get_class(Auth::user()),
                'causer_id' => Auth::user()->id,
                "event" => "deleted",
                'properties' => ["old" => ["code" => $invoice_subscription->code, "partner_name" => $invoice_subscription->partner_name, "partner_npwp" => $invoice_subscription->partner_npwp, "date" => $invoice_subscription->date, "due_date" => $invoice_subscription->due_date, "invoice_age" => $invoice_subscription->invoice_age, "bill_date" => $invoice_subscription->bill_date, 'total' => $invoice_subscription->total, 'total_all_ppn' => $invoice_subscription->total_all_ppn, 'paid_off' => $invoice_subscription->paid_off, 'rest_of_bill' => $invoice_subscription->rest_of_bill, 'signature_name' => $invoice_subscription->signature_name]]
            ]);
            $invoice_subscription->delete();
            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error hapus invoice langganan: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function destroyForce($uuid)
    {
        try {
            $invoice_subscription = InvoiceSubscription::withTrashed()->where('uuid', '=', $uuid)->first();
            Activity::create([
                'log_name' => 'force',
                'description' => Auth::user()->name . ' menghapus permanen data invoice langganan',
                'subject_type' => get_class($invoice_subscription),
                'subject_id' => $invoice_subscription->id,
                'causer_type' => get_class(Auth::user()),
                'causer_id' => Auth::user()->id,
                "event" => "force",
                'properties' => ["old" => ["code" => $invoice_subscription->code, "partner_name" => $invoice_subscription->partner_name, "partner_npwp" => $invoice_subscription->partner_npwp, "date" => $invoice_subscription->date, "due_date" => $invoice_subscription->due_date, "invoice_age" => $invoice_subscription->invoice_age, "bill_date" => $invoice_subscription->bill_date, 'total' => $invoice_subscription->total, 'total_all_ppn' => $invoice_subscription->total_all_ppn, 'paid_off' => $invoice_subscription->paid_off, 'rest_of_bill' => $invoice_subscription->rest_of_bill, 'signature_name' => $invoice_subscription->signature_name]]
            ]);

            unlink($invoice_subscription->invoice_subscription_doc);
            $invoice_subscription->forceDelete();

            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error hapus invoice langganan: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }

    }

    public function filter(Request $request)
    {
        $invoice_subscriptions = InvoiceSubscription::with(['bills', 'user', 'partner', 'transactions.user', 'status']);

        if ($request->user) {
            $invoice_subscriptions->where('created_by', $request->user['id']);
        }

        if ($request->status) {
            $invoice_subscriptions->whereHas('status', function ($query) use ($request) {
                $query->where('status_id', $request->status['id']);
            });
        }

        if ($request->input_date['start'] && $request->input_date['end']) {
            $invoice_subscriptions->whereBetween('created_at', [$request->input_date['start'], $request->input_date['end']]);
        }


        $invoice_subscriptions = $invoice_subscriptions->orderBy('code', 'desc')->get();

        return response()->json($invoice_subscriptions);
    }

    public function apiGetInvoiceSubscriptions()
    {
        $invoice_subscriptions = InvoiceSubscription::with('bills', 'user', 'partner', 'transactions.user', 'status')->orderBy('code', 'desc')->get();

        return response()->json($invoice_subscriptions);
    }

    public function logFilter(Request $request)
    {
        $logs = Activity::with(['causer', 'subject'])->whereMorphedTo('subject', InvoiceSubscription::class);

        if ($request->user) {
            $logs->whereMorphRelation('causer', User::class, 'causer_id', '=', $request->user['id']);
        }

        if ($request->date['start'] && $request->date['end']) {
            $logs->whereBetween('created_at', [Carbon::parse($request->date['start'])->setTimezone('GMT+7')->startOfDay(), Carbon::parse($request->date['end'])->setTimezone('GMT+7')->endOfDay()]);
        }

        $logs = $logs->latest()->get();

        return response()->json($logs);
    }

    public function apiGetLogs()
    {
        $logs = Activity::with(['causer', 'subject'])
            ->whereMorphedTo('subject', InvoiceSubscription::class)->orWhereMorphedTo('subject', InvoiceSubscriptionTransaction::class);

        $logs = $logs->latest()->get();

        return response()->json($logs);
    }

    public function destroyLogs(Request $request)
    {
        $ids = explode(",", $request->query('ids'));
        Activity::whereIn('id', $ids)->delete();
    }

    public function apiGetArsip()
    {
        $arsip = InvoiceSubscription::withTrashed()->with(['bills', 'user', 'partner', 'transactions.user', 'status'])->whereNotNull('deleted_at')->latest()->get();

        return response()->json($arsip);
    }

    public function arsipFilter(Request $request)
    {
        $arsip = InvoiceSubscription::withTrashed()->with(['bills', 'user', 'partner', 'transactions.user', 'status'])->whereNotNull('deleted_at');

        if ($request->user) {
            $arsip->where('created_by', '=', $request->user['id']);
        }

        if ($request->delete_date['start'] && $request->delete_date['end']) {
            $arsip->whereBetween('deleted_at', [Carbon::parse($request->delete_date['start'])->setTimezone('GMT+7')->startOfDay(), Carbon::parse($request->delete_date['end'])->setTimezone('GMT+7')->endOfDay()]);
        }

        $arsip = $arsip->get();

        return response()->json($arsip);
    }

}
