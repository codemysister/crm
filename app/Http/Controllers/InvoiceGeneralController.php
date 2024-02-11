<?php

namespace App\Http\Controllers;

use App\Http\Requests\InvoiceGeneralRequest;
use App\Jobs\GenerateInvoiceGeneralJob;
use App\Models\InvoiceGeneral;
use App\Models\InvoiceGeneralProducts;
use App\Models\Partner;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use PhpOffice\PhpWord\Element\Table;
use PhpOffice\PhpWord\SimpleType\TblWidth;

class InvoiceGeneralController extends Controller
{
    public function index()
    {
        return Inertia::render('InvoiceGeneral/Index');
    }

    public function create()
    {
        $partnersProp = Partner::with(
            'pics'
        )->get();
        $productsProp = Product::all();
        return Inertia::render('InvoiceGeneral/Create', compact('partnersProp', 'productsProp'));
    }

    public function generateInvoiceGeneral($invoice_general, $products)
    {
        $phpWord = new \PhpOffice\PhpWord\TemplateProcessor('assets/template/invoice_umum.docx');
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
            'xendit' => $invoice_general->xendit_link,
            'tanggal_dibuat' => Carbon::parse($invoice_general->created_at)->locale('id-ID')->isoFormat('D MMMM YYYY'),
            'atas_nama' => $invoice_general->signature_name,
        ]);


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
        $table->addCell(3000, ['bgColor' => '#674EA7', 'valign' => 'center'])->addText('Produk', ['color' => 'FFFFFF', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);
        $table->addCell(1500, ['bgColor' => '#674EA7', 'valign' => 'center'])->addText('Kuantitas', ['color' => 'FFFFFF', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);
        $table->addCell(2000, ['bgColor' => '#674EA7', 'valign' => 'center'])->addText('Harga', ['color' => 'FFFFFF', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);
        $table->addCell(2000, ['bgColor' => '#674EA7', 'valign' => 'center'])->addText('Total Harga', ['color' => 'FFFFFF', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);
        $table->addCell(2000, ['bgColor' => '#674EA7', 'valign' => 'center'])->addText('PPN', ['color' => 'FFFFFF', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);

        $values = collect($products)->map(function ($product) {
            return ['produk' => $product['name'], 'kuantitas' => $product['qty'], 'harga' => number_format($product['price'], 0, ',', '.'), 'total' => number_format($product['total'], 0, ',', '.'), 'ppn' => $product['total_ppn'] !== 0 ? number_format($product['total_ppn'], 0, ',', '.') : "0 "];
        });



        foreach ($values as $key => $value) {
            $table->addRow(400);

            if ($key % 2 == 0) {
                $table->addCell(null, ['valign' => 'center'])->addText($value['produk'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'left']);
                $table->addCell(null, ['valign' => 'center'])->addText($value['kuantitas'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'center']);
                $table->addCell(null, ['valign' => 'center'])->addText("Rp" . $value['harga'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'right']);
                $table->addCell(null, ['valign' => 'center'])->addText("Rp" . $value['total'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'right']);
                $table->addCell(null, ['valign' => 'center'])->addText("Rp" . $value['ppn'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'right']);
            } else {
                $table->addCell(null, ['bgColor' => '#F3F3F3', 'valign' => 'center'])->addText($value['produk'], ['name' => 'Inter', 'size' => 10], ['align' => 'left']);
                $table->addCell(null, ['bgColor' => '#F3F3F3', 'valign' => 'center'])->addText($value['kuantitas'], ['name' => 'Inter', 'size' => 10], ['align' => 'center']);
                $table->addCell(null, ['bgColor' => '#F3F3F3', 'valign' => 'center'])->addText("Rp" . $value['harga'], ['name' => 'Inter', 'size' => 10], ['align' => 'right']);
                $table->addCell(null, ['bgColor' => '#F3F3F3', 'valign' => 'center'])->addText("Rp" . $value['total'], ['name' => 'Inter', 'size' => 10], ['align' => 'right']);
                $table->addCell(null, ['bgColor' => '#F3F3F3', 'valign' => 'center'])->addText("Rp" . $value['ppn'], ['name' => 'Inter', 'size' => 10], ['align' => 'right']);
            }

        }
        $phpWord->setComplexBlock('table', $table);

        $phpWord->setImageValue('tanda_tangan', array('path' => public_path($invoice_general->signature_image)));
        $fileName = $invoice_general->uuid . '.docx';
        $phpWord->saveAs(storage_path('app/public/invoice_umum/' . $fileName));

    }

    public function store(InvoiceGeneralRequest $request)
    {
        $date = Carbon::parse($request->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
        $due_date = Carbon::parse($request->due_date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
        $date_now = Carbon::now()->setTimezone('GMT+7');
        $invoice_age = $date_now->diffInDays($date, false) + 1;

        $invoice_general = InvoiceGeneral::create([
            'uuid' => Str::uuid(),
            'code' => $request->code,
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
            'paid_off' => $request->paid_off,
            'rest_of_bill' => $request->rest_of_bill,
            'signature_name' => $request['signature']['name'],
            'signature_image' => $request['signature']['image'],
            'payment_metode' => $request->payment_metode,
            'xendit_link' => $request->xendit_link,
            'status' => 'unpaid',
            'invoice_general_doc' => '',
            'created_by' => Auth::user()->id
        ]);

        foreach ($request->products as $product) {
            InvoiceGeneralProducts::create([
                'uuid' => Str::uuid(),
                'invoice_general_id' => $invoice_general->id,
                'name' => $product['name'],
                'quantity' => $product['qty'],
                'price' => $product['price'],
                'total' => $product['total'],
                'total_ppn' => $product['total_ppn'],
                'ppn' => $product['ppn'],
            ]);
        }

        $this->generateInvoiceGeneral($invoice_general, $request->products);

    }



    public function apiGetInvoiceGenerals()
    {
        $invoiceGenerals = InvoiceGeneral::with('partner')->get();
        return response()->json($invoiceGenerals);
    }
}
