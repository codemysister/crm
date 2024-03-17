<?php

namespace App\Http\Controllers;

use App\Http\Requests\InvoiceSubscriptionRequest;
use App\Imports\InvoiceSubscriptionImport;
use App\Jobs\GenerateInvoiceGeneralJob;
use App\Jobs\GenerateInvoiceSubscriptionJob;
use App\Models\InvoiceSubscription;
use App\Models\InvoiceSubscriptionBill;
use App\Models\InvoiceSubscriptionBundle;
use App\Models\Partner;
use App\Models\Signature;
use App\Utils\ExtendedTemplateProcessor;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\File;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpWord\Element\TextRun;
use Spatie\Browsershot\Browsershot;
use PhpOffice\PhpWord\Element\Table;
use PhpOffice\PhpWord\SimpleType\TblWidth;
use Maatwebsite\Excel\Excel as ExcelExcel;

class InvoiceSubscriptionController extends Controller
{

    public function editInvoice(Request $request, $uuid)
    {
        $invoiceSubscriptionProp = InvoiceSubscription::with('bills', 'partner')->where('uuid', '=', $uuid)->first();
        $partnersProp = Partner::with('subscriptions')->whereHas('subscriptions', function ($query) {
            $query->where(function ($query) {
                $query->where('period', 'like', '%bulan%');
            });

        })->where('status', '=', 'Aktif')->orWhere('status', '=', 'Proses')->get();
        $signaturesProp = Signature::all();

        // return Inertia::render('InvoiceSubscription/Edit', compact('invoiceSubscriptionProp', 'partnersProp', 'signaturesProp'));
        return Inertia::render('InvoiceSubscription/Edit', compact('invoiceSubscriptionProp', 'partnersProp', 'signaturesProp'));

    }

    public function index()
    {
        $partnersProp = Partner::with('subscriptions')->whereHas('subscriptions', function ($query) {
            $query->where(function ($query) {
                $query->where('period', 'like', '%bulan%');
            });
        })->where('status', '=', 'Aktif')->orWhere('status', '=', 'Proses')->latest()->get();


        $signaturesProp = Signature::all();
        return Inertia::render('InvoiceSubscription/InvoiceSubscription', compact('partnersProp', 'signaturesProp'));
    }

    public function create()
    {
        $partnersProp = Partner::with('subscriptions')->whereHas('subscriptions', function ($query) {
            $query->where('period', 'lembaga/bulan')->orWhere('period', 'kartu/bulan');
        })->where('status', '=', 'Aktif')->orWhere('status', '=', 'Proses')->get();
        $signaturesProp = Signature::all();
        return Inertia::render('InvoiceSubscription/Create', compact('partnersProp', 'signaturesProp'));
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

    public function intToRoman($number)
    {
        $map = array('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII');
        return $map[$number - 1];
    }

    public function generateCode()
    {
        $currentMonth = date('n');
        $currentYear = date('Y');

        // $romanMonth = $this->intToRoman($currentMonth);
        // $latestData = InvoiceSubscription::latest()->first() ?? "$currentYear/$romanMonth/INV/0000";
        // $lastCode = $latestData ? explode('/', $latestData->code ?? $latestData)[3] : 0;

        $totalDataPerMonth = InvoiceSubscription::whereYear('created_at', $currentYear)
            ->whereMonth('created_at', $currentMonth)
            ->count();
        $romanMonth = intToRoman($currentMonth);
        $latestData = "$currentYear/$romanMonth/INV/0000";
        $lastCode = $latestData ? explode('/', $latestData)[3] : 0;
        $newCode = str_pad((int) $lastCode + $totalDataPerMonth + 1, 4, '0', STR_PAD_LEFT);
        $newCode = "$currentYear/$romanMonth/INV/$newCode";

        return $lastCode;
    }


    public function store(InvoiceSubscriptionRequest $request)
    {
        $lastCode = $this->generateCode();
        $currentMonth = date('n');
        $currentYear = date('Y');
        $romanMonth = $this->intToRoman($currentMonth);

        $newCode = str_pad((int) $lastCode + 1, 4, '0', STR_PAD_LEFT);
        $newCode = "$currentYear/$romanMonth/INV/$newCode";
        $date = Carbon::parse($request->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
        $due_date = Carbon::parse($request->due_date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
        $date_now = Carbon::now()->setTimezone('GMT+7');
        $invoice_age = $date_now->diffInDays($date, false) + 1;

        $rest_of_bill = $request->total_bill - $request->paid_off;

        $invoice_subscription = InvoiceSubscription::create([
            'uuid' => Str::uuid(),
            'partner_id' => $request->partner['id'],
            'code' => $newCode,
            'date' => $date,
            'period' => Carbon::parse($date)->locale('id')->isoFormat('DD MMMM YYYY'),
            'due_date' => $due_date,
            'invoice_age' => $invoice_age,
            'partner_name' => $request->partner['name'],
            'partner_province' => $request->partner['province'],
            'partner_regency' => $request->partner['regency'],
            'signature_name' => $request->signature['name'],
            'signature_image' => $request->signature['image'],
            'total_nominal' => $request->total_nominal,
            'total_ppn' => $request->total_ppn,
            'total_bill' => $request->total_bill,
            'rest_of_bill' => $rest_of_bill,
            'rest_of_bill_locked' => $rest_of_bill,
            'paid_off' => $request->paid_off,
            'status' => "belum terbayar",
            'payment_metode' => $request['payment_metode'],
            'xendit_link' => $request->xendit_link,
            'created_by' => Auth()->user()->id,
        ]);

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


        GenerateInvoiceSubscriptionJob::dispatch($invoice_subscription, $request->bills);

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
            $bill = InvoiceSubscriptionBill::where('id', $bill['id'])->first();
            $bill->update([
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

        $status = null;
        if ($rest_of_bill == 0) {
            $status = "lunas";
        } else if ($paid_transaction == 0) {
            $status = "belum terbayar";
        } else {
            $status = "sebagian";
        }


        $invoice_subscription->update([
            'date' => $date,
            'period' => Carbon::parse($date)->locale('id')->isoFormat('DD MMMM YYYY'),
            'due_date' => $due_date,
            'invoice_age' => $invoice_age,
            'partner_name' => $request->partner['name'],
            'partner_province' => $request->partner['province'],
            'partner_regency' => $request->partner['regency'],
            'signature_name' => $request->signature['name'],
            'signature_image' => $request->signature['image'],
            'total_nominal' => $request->total_nominal,
            'total_ppn' => $request->total_ppn,
            'total_bill' => $request->total_bill,
            'rest_of_bill' => $rest_of_bill,
            'rest_of_bill_locked' => $request->total_bill,
            'paid_off' => $request->paid_off,
            'status' => $status,
            'payment_metode' => $request['payment_metode'],
            'xendit_link' => $request->xendit_link,
        ]);

        $invoice_subscription = InvoiceSubscription::with('bills')->where('uuid', '=', $uuid)->first();

        $this->updateBills($invoice_subscription, $invoice_subscription->bills, $request->bills);
        if ($invoice_subscription->invoice_subscription_doc !== null) {
            Storage::delete('public/' . $invoice_subscription->invoice_subscription_doc);
        }
        if ($invoice_subscription->payment_metode === 'payment link') {
            $this->generateInvoiceSubscription($invoice_subscription);
        } else {
            $this->generateInvoiceSubscriptionPdf($invoice_subscription);
        }
    }

    public function storeBatch(Request $request)
    {
        $imported = Excel::import(new InvoiceSubscriptionImport($request['partner']['signature']), request()->file('partner.excell'), null, ExcelExcel::CSV);
    }

    public function edit($uuid)
    {
        $invoiceSubscriptionProp = InvoiceSubscription::with('bills', 'partner')->where('uuid', '=', $uuid)->first();
        $partnersProp = Partner::with('subscriptions')->whereHas('subscriptions', function ($query) {
            $query->where('period', 'lembaga/bulan')->orWhere('period', 'kartu/bulan');
        })->where('status', '=', 'Aktif')->orWhere('status', '=', 'Proses')->get();
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

    public function destroy($uuid)
    {
        $invoice_subscription = InvoiceSubscription::where('uuid', '=', $uuid)->first();
        Storage::delete('public/' . $invoice_subscription->invoice_subscription_doc);
        $invoice_subscription->delete();
    }

    public function apiGetInvoiceSubscriptions()
    {
        $invoice_subscriptions = InvoiceSubscription::with('bills', 'user', 'partner', 'transactions.user')->latest()->get();

        return response()->json($invoice_subscriptions);
    }

}
