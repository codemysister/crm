<?php

namespace App\Http\Controllers;

use App\Http\Requests\InvoiceGeneralRequest;
use App\Jobs\GenerateInvoiceGeneralJob;
use App\Models\InvoiceGeneral;
use App\Models\InvoiceGeneralProducts;
use App\Models\Partner;
use App\Models\Product;
use App\Models\Signature;
use App\Utils\ExtendedTemplateProcessor;
use Carbon\Carbon;
use Dipantry\Rupiah\RupiahService;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use PhpOffice\PhpWord\Element\Table;
use PhpOffice\PhpWord\SimpleType\TblWidth;

class InvoiceGeneralController extends Controller
{
    public function index()
    {
        $partnersProp = Partner::all();
        $signaturesProp = Signature::all();
        return Inertia::render('InvoiceGeneral/Index', compact('partnersProp', 'signaturesProp'));
    }

    public function create()
    {
        $partnersProp = Partner::with(
            'pics'
        )->get();
        $productsProp = Product::all();
        $signaturesProp = Signature::all();
        return Inertia::render('InvoiceGeneral/Create', compact('partnersProp', 'productsProp', 'signaturesProp'));
    }

    public function edit($uuid)
    {
        $partnersProp = Partner::with(
            'pics'
        )->get();
        $productsProp = Product::all();
        $signaturesProp = Signature::all();
        $invoiceGeneral = InvoiceGeneral::with('products', 'transactions', 'partner')->where('uuid', '=', $uuid)->first();
        return Inertia::render('InvoiceGeneral/Edit', compact('partnersProp', 'productsProp', 'invoiceGeneral', 'signaturesProp'));
    }

    public function generateInvoiceGeneral($invoice_general, $products)
    {
        $templateInvoice = 'assets/template/revisi/invoice_umum.docx';

        if ($invoice_general->total_all_ppn == 0) {
            // dd('oke');
            if ($invoice_general->payment_metode === "payment link") {
                $templateInvoice = 'assets/template/revisi/invoice_umum_tanpa_pajak_xendit.docx';
            } else if ($invoice_general->payment_metode === "cazhbox") {
                $templateInvoice = 'assets/template/revisi/invoice_umum_tanpa_pajak_cazhbox.docx';
            } else {
                $templateInvoice = 'assets/template/revisi/invoice_umum.docx';
            }
        } else {
            if ($invoice_general->payment_metode === "payment link") {
                // dd('oke');
                $templateInvoice = 'assets/template/revisi/invoice_umum_xendit.docx';
            } else if ($invoice_general->payment_metode === "cazhbox") {
                $templateInvoice = 'assets/template/revisi/invoice_umum_cazhbox.docx';
            } else {
                $templateInvoice = 'assets/template/revisi/invoice_umum.docx';
            }
        }

        $phpWord = new ExtendedTemplateProcessor($templateInvoice);
        $phpWord->setValues([
            'nomor_invoice' => $invoice_general->code,
            'tanggal_invoice' => Carbon::parse($invoice_general->date)->format('d-m-Y'),
            'jatuh_tempo' => Carbon::parse($invoice_general->due_date)->format('d-m-Y'),
            'nama_partner' => $invoice_general->partner_name,
            'provinsi' => json_decode($invoice_general->partner_province)->name,
            'kabupaten' => json_decode($invoice_general->partner_regency)->name,
            'nomor_hp' => $invoice_general->partner_phone_number,
            'sub_total' => "Rp" . number_format($invoice_general->total, 0, ',', '.'),
            'ppn' => "Rp" . number_format($invoice_general->total_all_ppn, 0, ',', '.'),
            'terbayar' => "Rp" . number_format($invoice_general->paid_off, 0, ',', '.'),
            'tagihan' => "Rp" . number_format($invoice_general->rest_of_bill, 0, ',', '.'),
            // 'xendit' => $invoice_general->xendit_link,
            'metode' => ucwords($invoice_general->payment_metode),
            'tanggal_dibuat' => Carbon::parse($invoice_general->created_at)->locale('id-ID')->isoFormat('D MMMM YYYY'),
            'atas_nama' => $invoice_general->signature_name,
        ]);

        $phpWord->setImageValue('tanda_tangan', array('path' => public_path($invoice_general->signature_image)));

        // $phpWord->setComplexValue('xendit', $linkTest);
        $linkVar = new \PhpOffice\PhpWord\Element\TextRun();
        $linkTest = $linkVar->addLink($invoice_general->xendit_link, $invoice_general->xendit_link, ['name' => 'Inter', 'size' => 10, 'color' => 'blue', 'underline' => \PhpOffice\PhpWord\Style\Font::UNDERLINE_SINGLE]);

        $phpWord->addLink($linkTest);
        $phpWord->setComplexValue('xendit', $linkVar);

        $table = new Table(
            array(
                'borderSize' => 8,
                'borderColor' => 'D9D2E9',
                'width' => 100 * 50,
                'alignment' => \PhpOffice\PhpWord\SimpleType\JcTable::CENTER,
                'layout' => \PhpOffice\PhpWord\Style\Table::LAYOUT_FIXED,
                'unit' => TblWidth::PERCENT
            )
        );
        $table->addRow(400);
        $pStyle = array('spaceAfter' => 20, 'align' => 'center');
        $table->addCell(1500, ['bgColor' => '#674EA7', 'valign' => 'center'])->addText('Produk', ['color' => 'FFFFFF', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);
        $table->addCell(3000, ['bgColor' => '#674EA7', 'valign' => 'center'])->addText('Deskripsi', ['color' => 'FFFFFF', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);
        $table->addCell(1500, ['bgColor' => '#674EA7', 'valign' => 'center'])->addText('Kuantitas', ['color' => 'FFFFFF', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);
        $table->addCell(2000, ['bgColor' => '#674EA7', 'valign' => 'center'])->addText('Harga', ['color' => 'FFFFFF', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);
        $table->addCell(2000, ['bgColor' => '#674EA7', 'valign' => 'center'])->addText('Total Harga', ['color' => 'FFFFFF', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);
        $table->addCell(2000, ['bgColor' => '#674EA7', 'valign' => 'center'])->addText('PPN', ['color' => 'FFFFFF', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);

        $values = collect($products)->map(function ($product) {
            return ['produk' => $product['name'], 'deskripsi' => $product['description'], 'kuantitas' => $product['quantity'], 'harga' => number_format($product['price'], 0, ',', '.'), 'total' => number_format($product['total'], 0, ',', '.'), 'ppn' => $product['total_ppn'] !== 0 ? number_format($product['total_ppn'], 0, ',', '.') : "0 "];
        });

        foreach ($values as $key => $value) {
            $table->addRow(400);

            if ($key % 2 == 0) {
                $table->addCell(null, ['valign' => 'center'])->addText($value['produk'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'left']);
                $table->addCell(null, ['valign' => 'center'])->addText($value['deskripsi'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'left']);
                $table->addCell(null, ['valign' => 'center'])->addText($value['kuantitas'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'center']);
                $table->addCell(null, ['valign' => 'center'])->addText("Rp" . $value['harga'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'right']);
                $table->addCell(null, ['valign' => 'center'])->addText("Rp" . $value['total'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'right']);
                $table->addCell(null, ['valign' => 'center'])->addText("Rp" . $value['ppn'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'right']);
            } else {
                $table->addCell(null, ['bgColor' => '#F3F3F3', 'valign' => 'center'])->addText($value['produk'], ['name' => 'Inter', 'size' => 10], ['align' => 'left']);
                $table->addCell(null, ['bgColor' => '#F3F3F3', 'valign' => 'center'])->addText($value['deskripsi'], ['name' => 'Inter', 'size' => 10], ['align' => 'left']);
                $table->addCell(null, ['bgColor' => '#F3F3F3', 'valign' => 'center'])->addText($value['kuantitas'], ['name' => 'Inter', 'size' => 10], ['align' => 'center']);
                $table->addCell(null, ['bgColor' => '#F3F3F3', 'valign' => 'center'])->addText("Rp" . $value['harga'], ['name' => 'Inter', 'size' => 10], ['align' => 'right']);
                $table->addCell(null, ['bgColor' => '#F3F3F3', 'valign' => 'center'])->addText("Rp" . $value['total'], ['name' => 'Inter', 'size' => 10], ['align' => 'right']);
                $table->addCell(null, ['bgColor' => '#F3F3F3', 'valign' => 'center'])->addText("Rp" . $value['ppn'], ['name' => 'Inter', 'size' => 10], ['align' => 'right']);
            }

        }
        $phpWord->setComplexBlock('table', $table);

        $phpWord->setImageValue('tanda_tangan', array('path' => public_path($invoice_general->signature_image)));
        $phpWord->setImageValue('tanda_tangan', array('path' => public_path($invoice_general->signature_image)));

        $fileName = $invoice_general->uuid . '.docx';
        $phpWord->saveAs(storage_path('app/public/invoice_umum/' . $fileName));
        $invoice_general->update(['invoice_general_doc' => 'invoice_umum/' . $fileName]);

    }

    public function generateCode()
    {
        $currentMonth = date('n');
        $currentYear = date('Y');

        $totalDataPerMonth = InvoiceGeneral::whereYear('created_at', $currentYear)
            ->whereMonth('created_at', $currentMonth)
            ->count();

        function intToRoman($number)
        {
            $map = array('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII');
            return $map[$number - 1];
        }

        $romanMonth = intToRoman($currentMonth);
        $latestData = "#INV/000/$romanMonth/$currentYear";
        $lastCode = $latestData ? explode('/', $latestData)[1] : 0;
        $newCode = str_pad((int) $lastCode + $totalDataPerMonth + 1, 3, '0', STR_PAD_LEFT);
        $newCode = "#INV/$newCode/$romanMonth/$currentYear";
        return $newCode;
    }

    public function store(InvoiceGeneralRequest $request)
    {
        $date = Carbon::parse($request->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
        $due_date = Carbon::parse($request->due_date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
        $date_now = Carbon::now()->setTimezone('GMT+7');
        $invoice_age = $date_now->diffInDays($date, false) + 1;

        $code = $this->generateCode();

        $invoice_general = InvoiceGeneral::create([
            'uuid' => Str::uuid(),
            'code' => $code,
            'partner_id' => $request['partner']['id'],
            'partner_name' => $request['partner']['name'],
            'partner_province' => $request['partner']['province'],
            'partner_regency' => $request['partner']['regency'],
            'partner_phone_number' => $request['partner']['number'],
            'date' => $date,
            'due_date' => $due_date,
            'invoice_age' => $invoice_age,
            'total' => $request->total,
            'total_all_ppn' => $request->total_all_ppn,
            'total_final_with_ppn' => $request->total_all_ppn + $request->total,
            'paid_off' => $request->paid_off,
            'rest_of_bill' => $request->rest_of_bill,
            'rest_of_bill_locked' => $request->rest_of_bill,
            'signature_name' => $request['signature']['name'],
            'signature_image' => $request['signature']['image'],
            'payment_metode' => $request->payment_metode,
            'xendit_link' => $request->xendit_link,
            'status' => 'belum terbayar',
            'invoice_general_doc' => '',
            'created_by' => Auth::user()->id
        ]);


        foreach ($request->products as $product) {
            InvoiceGeneralProducts::create([
                'uuid' => Str::uuid(),
                'invoice_general_id' => $invoice_general->id,
                'name' => $product['name'],
                'description' => $product['description'],
                'quantity' => $product['quantity'],
                'price' => $product['price'],
                'total' => $product['total'],
                'total_ppn' => $product['total_ppn'],
                'ppn' => $product['ppn'],
            ]);
        }

        // $this->generateInvoiceGeneral($invoice_general, $request->products);
        GenerateInvoiceGeneralJob::dispatch($invoice_general, $request->products);
    }

    public function calculateRestOfBill($invoice_general)
    {
        $rest_of_bill = $invoice_general->rest_of_bill_locked;

        $totalNominalTransaction = $invoice_general->transactions->reduce(function ($counter, $transaction) {
            return $counter + $transaction->nominal;
        });

        return $rest_of_bill - $totalNominalTransaction;
    }

    function updateProducts($invoice_general, $oldData, $newData)
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
        InvoiceGeneralProducts::destroy($delete->pluck('id')->toArray());

        foreach ($update as $key => $product) {
            $productExist = InvoiceGeneralProducts::where('id', $product['id'])->first();

            $productExist->update([
                'name' => $product['name'],
                'description' => $product['description'],
                'quantity' => $product['quantity'],
                'price' => $product['price'],
                'total' => $product['total'],
                'total_ppn' => $product['total_ppn'],
                'ppn' => $product['ppn'],
            ]);
        }
        foreach ($create as $product) {
            InvoiceGeneralProducts::create([
                'uuid' => Str::uuid(),
                'invoice_general_id' => $invoice_general->id,
                'name' => $product['name'],
                'description' => $product['description'],
                'quantity' => $product['quantity'],
                'price' => $product['price'],
                'total' => $product['total'],
                'total_ppn' => $product['total_ppn'],
                'ppn' => $product['ppn'],
            ]);
        }


        return true;
    }

    public function update(InvoiceGeneralRequest $request, $uuid)
    {

        $date = Carbon::parse($request->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
        $due_date = Carbon::parse($request->due_date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
        $date_now = Carbon::now()->setTimezone('GMT+7');
        $invoice_age = $date_now->diffInDays($date, false) + 1;

        $invoice_general = InvoiceGeneral::with('transactions', 'products')->where('uuid', '=', $uuid)->first();

        $rest_of_bill = $request->rest_of_bill;
        $paid_transaction = 0;

        // kalau sudah ada transaksi
        if (count($invoice_general->transactions) > 0) {
            // hitung jumlah yang sudah terbayar
            foreach ($invoice_general->transactions as $transaction) {
                $paid_transaction += $transaction->nominal;
            }
        } else {
            $rest_of_bill = $request->rest_of_bill;
        }

        if ($rest_of_bill < $paid_transaction) {
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


        $invoice_general->update([
            'partner_id' => $request['partner']['id'],
            'partner_name' => $request['partner']['name'],
            'partner_province' => $request['partner']['province'],
            'partner_regency' => $request['partner']['regency'],
            'partner_phone_number' => $request['partner']['number'],
            'date' => $date,
            'due_date' => $due_date,
            'invoice_age' => $invoice_age,
            'total' => $request->total,
            'total_all_ppn' => $request->total_all_ppn,
            'total_final_with_ppn' => $request->total_all_ppn + $request->total,
            'paid_off' => $request->paid_off,
            'rest_of_bill' => $request->rest_of_bill,
            'rest_of_bill_locked' => $request->rest_of_bill,
            'signature_name' => $request['signature']['name'],
            'signature_image' => $request['signature']['image'],
            'payment_metode' => $request->payment_metode,
            'xendit_link' => $request->xendit_link,
            'status' => 'belum terbayar',
            'invoice_general_doc' => '',
        ]);

        $results = $this->updateProducts($invoice_general, $invoice_general->products, $request->products);
        $rest_of_bill = $this->calculateRestOfBill($invoice_general);

        $invoice_general->update(['rest_of_bill' => $rest_of_bill, 'status' => $status]);

        // $this->generateInvoiceGeneral($invoice_general, $request->products);
        GenerateInvoiceGeneralJob::dispatch($invoice_general, $request->products);

    }

    public function apiGetInvoiceGenerals()
    {
        $invoiceGenerals = InvoiceGeneral::with(['partner', 'products', 'transactions.user'])->latest()->get();
        return response()->json($invoiceGenerals);
    }

    public function destroy($uuid)
    {
        $invoice_general = InvoiceGeneral::where('uuid', '=', $uuid)->first();
        Storage::disk('public')->delete($invoice_general->invoice_general_doc);
        $invoice_general->delete();
    }
}
