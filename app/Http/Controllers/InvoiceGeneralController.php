<?php

namespace App\Http\Controllers;

use App\Http\Requests\InvoiceGeneralRequest;
use App\Jobs\GenerateInvoiceGeneralJob;
use App\Models\InvoiceGeneral;
use App\Models\InvoiceGeneralTransaction;
use App\Models\InvoiceGeneralProducts;
use App\Models\Lead;
use App\Models\Partner;
use App\Models\Product;
use App\Models\Signature;
use App\Models\Status;
use App\Models\User;
use Spatie\Activitylog\Models\Activity;
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
use Spatie\Browsershot\Browsershot;

class InvoiceGeneralController extends Controller
{
    public function index()
    {
        $partnersProp = Partner::all();
        $usersProp = User::with('roles')->get();
        $statusProp = Status::where('category', 'invoice')->get();
        $signaturesProp = Signature::all();
        return Inertia::render('InvoiceGeneral/Index', compact('partnersProp', 'signaturesProp', 'usersProp', 'statusProp'));
    }

    public function create()
    {
        $partnersProp = Partner::with(
            'pic',
            'status'
        )->get();
        $productsProp = Product::all();
        $signaturesProp = Signature::all();
        return Inertia::render('InvoiceGeneral/Create', compact('partnersProp', 'productsProp', 'signaturesProp'));
    }

    public function edit($uuid)
    {
        $partnersProp = Partner::with(
            'pic',
            'status'
        )->get();
        $productsProp = Product::all();
        $signaturesProp = Signature::all();
        $invoiceGeneral = InvoiceGeneral::with('products', 'transactions', 'partner', 'lead')->where('uuid', '=', $uuid)->first();
        return Inertia::render('InvoiceGeneral/Edit', compact('partnersProp', 'productsProp', 'invoiceGeneral', 'signaturesProp'));
    }

    // public function generateInvoiceGeneral($invoice_general, $products)
    // {
    //     $templateInvoice = 'assets/template/revisi/invoice_umum.docx';

    //     if ($invoice_general->total_all_ppn == 0) {
    //         // dd('oke');
    //         if ($invoice_general->payment_metode === "payment link") {
    //             $templateInvoice = 'assets/template/revisi/invoice_umum_tanpa_pajak_xendit.docx';
    //         } else if ($invoice_general->payment_metode === "cazhbox") {
    //             $templateInvoice = 'assets/template/revisi/invoice_umum_tanpa_pajak_cazhbox.docx';
    //         } else {
    //             $templateInvoice = 'assets/template/revisi/invoice_umum.docx';
    //         }
    //     } else {
    //         if ($invoice_general->payment_metode === "payment link") {
    //             // dd('oke');
    //             $templateInvoice = 'assets/template/revisi/invoice_umum_xendit.docx';
    //         } else if ($invoice_general->payment_metode === "cazhbox") {
    //             $templateInvoice = 'assets/template/revisi/invoice_umum_cazhbox.docx';
    //         } else {
    //             $templateInvoice = 'assets/template/revisi/invoice_umum.docx';
    //         }
    //     }

    //     $phpWord = new ExtendedTemplateProcessor($templateInvoice);
    //     $phpWord->setValues([
    //         'nomor_invoice' => $invoice_general->code,
    //         'tanggal_invoice' => Carbon::parse($invoice_general->date)->format('d-m-Y'),
    //         'jatuh_tempo' => Carbon::parse($invoice_general->due_date)->format('d-m-Y'),
    //         'nama_partner' => $invoice_general->partner_name,
    //         'provinsi' => json_decode($invoice_general->partner_province)->name,
    //         'kabupaten' => json_decode($invoice_general->partner_regency)->name,
    //         'nomor_hp' => $invoice_general->partner_phone_number,
    //         'sub_total' => "Rp" . number_format($invoice_general->total, 0, ',', '.'),
    //         'ppn' => "Rp" . number_format($invoice_general->total_all_ppn, 0, ',', '.'),
    //         'terbayar' => "Rp" . number_format($invoice_general->paid_off, 0, ',', '.'),
    //         'tagihan' => "Rp" . number_format($invoice_general->rest_of_bill, 0, ',', '.'),
    //         // 'xendit' => $invoice_general->xendit_link,
    //         'metode' => ucwords($invoice_general->payment_metode),
    //         'tanggal_dibuat' => Carbon::parse($invoice_general->created_at)->locale('id-ID')->isoFormat('D MMMM YYYY'),
    //         'atas_nama' => $invoice_general->signature_name,
    //     ]);

    //     $phpWord->setImageValue('tanda_tangan', array('path' => public_path($invoice_general->signature_image)));

    //     // $phpWord->setComplexValue('xendit', $linkTest);
    //     $linkVar = new \PhpOffice\PhpWord\Element\TextRun();
    //     $linkTest = $linkVar->addLink($invoice_general->xendit_link, $invoice_general->xendit_link, ['name' => 'Inter', 'size' => 10, 'color' => 'blue', 'underline' => \PhpOffice\PhpWord\Style\Font::UNDERLINE_SINGLE]);

    //     $phpWord->addLink($linkTest);
    //     $phpWord->setComplexValue('xendit', $linkVar);

    //     $table = new Table(
    //         array(
    //             'borderSize' => 8,
    //             'borderColor' => 'D9D2E9',
    //             'width' => 100 * 50,
    //             'alignment' => \PhpOffice\PhpWord\SimpleType\JcTable::CENTER,
    //             'layout' => \PhpOffice\PhpWord\Style\Table::LAYOUT_FIXED,
    //             'unit' => TblWidth::PERCENT
    //         )
    //     );
    //     $table->addRow(400);
    //     $pStyle = array('spaceAfter' => 20, 'align' => 'center');
    //     $table->addCell(1500, ['bgColor' => '#674EA7', 'valign' => 'center'])->addText('Produk', ['color' => 'FFFFFF', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);
    //     $table->addCell(3000, ['bgColor' => '#674EA7', 'valign' => 'center'])->addText('Deskripsi', ['color' => 'FFFFFF', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);
    //     $table->addCell(1500, ['bgColor' => '#674EA7', 'valign' => 'center'])->addText('Kuantitas', ['color' => 'FFFFFF', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);
    //     $table->addCell(2000, ['bgColor' => '#674EA7', 'valign' => 'center'])->addText('Harga', ['color' => 'FFFFFF', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);
    //     $table->addCell(2000, ['bgColor' => '#674EA7', 'valign' => 'center'])->addText('Total Harga', ['color' => 'FFFFFF', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);
    //     $table->addCell(2000, ['bgColor' => '#674EA7', 'valign' => 'center'])->addText('PPN', ['color' => 'FFFFFF', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);

    //     $values = collect($products)->map(function ($product) {
    //         return ['produk' => $product['name'], 'deskripsi' => $product['description'], 'kuantitas' => $product['quantity'], 'harga' => number_format($product['price'], 0, ',', '.'), 'total' => number_format($product['total'], 0, ',', '.'), 'ppn' => $product['total_ppn'] !== 0 ? number_format($product['total_ppn'], 0, ',', '.') : "0 "];
    //     });

    //     foreach ($values as $key => $value) {
    //         $table->addRow(400);

    //         if ($key % 2 == 0) {
    //             $table->addCell(null, ['valign' => 'center'])->addText($value['produk'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'left']);
    //             $table->addCell(null, ['valign' => 'center'])->addText($value['deskripsi'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'left']);
    //             $table->addCell(null, ['valign' => 'center'])->addText($value['kuantitas'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'center']);
    //             $table->addCell(null, ['valign' => 'center'])->addText("Rp" . $value['harga'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'right']);
    //             $table->addCell(null, ['valign' => 'center'])->addText("Rp" . $value['total'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'right']);
    //             $table->addCell(null, ['valign' => 'center'])->addText("Rp" . $value['ppn'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'right']);
    //         } else {
    //             $table->addCell(null, ['bgColor' => '#F3F3F3', 'valign' => 'center'])->addText($value['produk'], ['name' => 'Inter', 'size' => 10], ['align' => 'left']);
    //             $table->addCell(null, ['bgColor' => '#F3F3F3', 'valign' => 'center'])->addText($value['deskripsi'], ['name' => 'Inter', 'size' => 10], ['align' => 'left']);
    //             $table->addCell(null, ['bgColor' => '#F3F3F3', 'valign' => 'center'])->addText($value['kuantitas'], ['name' => 'Inter', 'size' => 10], ['align' => 'center']);
    //             $table->addCell(null, ['bgColor' => '#F3F3F3', 'valign' => 'center'])->addText("Rp" . $value['harga'], ['name' => 'Inter', 'size' => 10], ['align' => 'right']);
    //             $table->addCell(null, ['bgColor' => '#F3F3F3', 'valign' => 'center'])->addText("Rp" . $value['total'], ['name' => 'Inter', 'size' => 10], ['align' => 'right']);
    //             $table->addCell(null, ['bgColor' => '#F3F3F3', 'valign' => 'center'])->addText("Rp" . $value['ppn'], ['name' => 'Inter', 'size' => 10], ['align' => 'right']);
    //         }

    //     }
    //     $phpWord->setComplexBlock('table', $table);

    //     $phpWord->setImageValue('tanda_tangan', array('path' => public_path($invoice_general->signature_image)));
    //     $phpWord->setImageValue('tanda_tangan', array('path' => public_path($invoice_general->signature_image)));

    //     $fileName = $invoice_general->uuid . '.docx';
    //     $phpWord->saveAs(storage_path('app/public/invoice_umum/' . $fileName));
    //     $invoice_general->update(['invoice_general_doc' => 'invoice_umum/' . $fileName]);

    // }

    public function generateCode()
    {
        $currentMonth = date('n');
        $currentYear = date('Y');

        function intToRoman($number)
        {
            $map = array('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII');
            return $map[$number - 1];
        }


        $lastDataCurrentMonth = InvoiceGeneral::withTrashed()->whereYear('created_at', $currentYear)
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

    public function generateInvoiceGeneral($invoice_general, $products)
    {
        $path = "invoice_umum/invoice_umum-" . $invoice_general->uuid . ".pdf";

        $invoice_general->invoice_general_doc = "storage/" . $path;

        $html = view('pdf.invoice_general', ["invoice_general" => $invoice_general, "products" => $products])->render();

        $pdf = Browsershot::html($html)
            ->setIncludedPath(config('services.browsershot.included_path'))
            ->showBackground()
            ->pdf();

        Storage::put("public/$path", $pdf);

        return $invoice_general;
    }

    public function store(InvoiceGeneralRequest $request)
    {
        $date = Carbon::parse($request->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
        $due_date = Carbon::parse($request->due_date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
        $date_now = Carbon::now()->setTimezone('GMT+7');
        $invoice_age = $date_now->diffInDays($date, false) + 1;

        DB::beginTransaction();

        try {
            $code = $this->generateCode();

            $statusBelumBayar = Status::where('name', 'belum bayar')->where('category', 'invoice')->first();

            $invoice_general = new InvoiceGeneral();
            $invoice_general->uuid = Str::uuid();
            $invoice_general->code = $code;
            if ($request['partner']['type'] == 'partner') {
                $partnerExist = Partner::where('uuid', $request['partner']["uuid"])->first();
                $invoice_general->partner_id = $partnerExist->id;
            } else {
                $leadExist = Lead::where('uuid', $request['partner']["uuid"])->first();
                $invoice_general->lead_id = $leadExist->id;
            }
            $invoice_general->status_id = $statusBelumBayar->id;
            $invoice_general->institution_name = $request['partner']['name'];
            $invoice_general->institution_province = $request['partner']['province'];
            $invoice_general->institution_regency = $request['partner']['regency'];
            $invoice_general->institution_phone_number = $request['partner']['phone_number'];
            $invoice_general->date = $date;
            $invoice_general->due_date = $due_date;
            $invoice_general->invoice_age = $invoice_age;
            $invoice_general->total = $request->total;
            $invoice_general->total_all_ppn = $request->total_all_ppn;
            $invoice_general->total_final_with_ppn = $request->total_all_ppn + $request->total;
            $invoice_general->paid_off = $request->paid_off;
            $invoice_general->rest_of_bill = $request->rest_of_bill;
            $invoice_general->rest_of_bill_locked = $request->rest_of_bill;
            $invoice_general->signature_name = $request['signature']['name'];
            $invoice_general->signature_image = $request['signature']['image'];
            $invoice_general->payment_metode = $request->payment_metode;
            $invoice_general->xendit_link = $request->xendit_link;
            $invoice_general->created_by = Auth::user()->id;
            $invoice_general = $this->generateInvoiceGeneral($invoice_general, $request->products);
            $invoice_general->save();

            $invoiceProductsLog = collect($request->products)->map(function ($product, $index) {
                return ($index + 1) . ". " . $product['name'] . "(" . $product['price'] . ")";
            })->implode(', ');

            Activity::create([
                'log_name' => 'created',
                'description' => ' menambah data Invoice Umum',
                'subject_type' => get_class($invoice_general),
                'subject_id' => $invoice_general->id,
                'causer_type' => get_class(Auth::user()),
                'causer_id' => Auth::user()->id,
                "event" => "created",
                'properties' => ["attributes" => ["code" => $invoice_general->code, "institution_name" => $invoice_general->institution_name, "date" => $invoice_general->date, "due_date" => $invoice_general->due_date, "invoice_age" => $invoice_general->invoice_age, "bill_date" => $invoice_general->bill_date, 'total' => $invoice_general->total, 'total_all_ppn' => $invoice_general->total_all_ppn, 'paid_off' => $invoice_general->paid_off, 'rest_of_bill' => $invoice_general->rest_of_bill, 'signature_name' => $invoice_general->signature_name, 'products' => $invoiceProductsLog]]
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

            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error tambah invoice umum: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
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

            $invoiceNewProductsLog = collect($request->products)->map(function ($product, $index) {
                return ($index + 1) . ". " . $product['name'] . "(" . $product['price'] . ")";
            })->implode(', ');
            $invoiceOldProductsLog = collect($invoice_general->products)->map(function ($product, $index) {
                return ($index + 1) . ". " . $product['name'] . "(" . $product['price'] . ")";
            })->implode(', ');


            Activity::create([
                'log_name' => 'updated',
                'description' => ' mengubah data invoice umum',
                'subject_type' => get_class($invoice_general),
                'subject_id' => $invoice_general->id,
                'causer_type' => get_class(Auth::user()),
                'causer_id' => Auth::user()->id,
                "event" => "updated",
                'properties' => ["attributes" => ["code" => $invoice_general->code, "institution_name" => $request['partner']['name'], "date" => $request->date, "due_date" => $request->due_date, "invoice_age" => $request->invoice_age, "bill_date" => $request->bill_date, 'total' => $request->total, 'total_all_ppn' => $request->total_all_ppn, 'paid_off' => $request->paid_off, 'rest_of_bill' => $request->rest_of_bill, 'signature_name' => $request->signature_name, 'products' => $invoiceNewProductsLog], "old" => ["code" => $invoice_general->code, "institution_name" => $invoice_general->institution_name, "institution_npwp" => $invoice_general->institution_npwp, "date" => $invoice_general->date, "due_date" => $invoice_general->due_date, "invoice_age" => $invoice_general->invoice_age, "bill_date" => $invoice_general->bill_date, 'total' => $invoice_general->total, 'total_all_ppn' => $invoice_general->total_all_ppn, 'paid_off' => $invoice_general->paid_off, 'rest_of_bill' => $invoice_general->rest_of_bill, 'signature_name' => $invoice_general->signature_name, 'products' => $invoiceOldProductsLog]]
            ]);

            if ($request['partner']['type'] == 'partner') {
                $partnerExist = Partner::where('uuid', $request['partner']["uuid"])->first();
                $invoice_general->partner_id = $partnerExist->id;
            } else {
                $leadExist = Lead::where('uuid', $request['partner']["uuid"])->first();
                $invoice_general->lead_id = $leadExist->id;
            }
            $invoice_general->status_id = $status->id;
            $invoice_general->institution_name = $request['partner']['name'];
            $invoice_general->institution_province = $request['partner']['province'];
            $invoice_general->institution_regency = $request['partner']['regency'];
            $invoice_general->institution_phone_number = $request['partner']['phone_number'];
            $invoice_general->date = $date;
            $invoice_general->due_date = $due_date;
            $invoice_general->invoice_age = $invoice_age;
            $invoice_general->total = $request->total;
            $invoice_general->total_all_ppn = $request->total_all_ppn;
            $invoice_general->total_final_with_ppn = $request->total_all_ppn + $request->total;
            $invoice_general->paid_off = $request->paid_off;
            $invoice_general->rest_of_bill = $request->rest_of_bill;
            $invoice_general->rest_of_bill_locked = $request->rest_of_bill;
            $invoice_general->signature_name = $request['signature']['name'];
            $invoice_general->signature_image = $request['signature']['image'];
            $invoice_general->payment_metode = $request->payment_metode;
            $invoice_general->xendit_link = $request->xendit_link;
            $invoice_general = $this->generateInvoiceGeneral($invoice_general, $request->products);
            $invoice_general->save();

            $this->updateProducts($invoice_general, $invoice_general->products, $request->products);
            $rest_of_bill = $this->calculateRestOfBill($invoice_general);
            $invoice_general->update(['rest_of_bill' => $rest_of_bill, 'status_id' => $status->id]);

            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error update invoice umum: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function filter(Request $request)
    {
        $invoice_generals = InvoiceGeneral::with(['partner', 'products', 'transactions.user', 'status']);

        if ($request->user) {
            $invoice_generals->where('created_by', $request->user['id']);
        }

        if ($request->status) {
            $invoice_generals->whereHas('status', function ($query) use ($request) {
                $query->where('status_id', $request->status['id']);
            });
        }

        if ($request->input_date['start'] && $request->input_date['end']) {
            $invoice_generals->whereBetween('created_at', [Carbon::parse($request->input_date['start'])->setTimezone('GMT+7')->startOfDay(), Carbon::parse($request->input_date['end'])->setTimezone('GMT+7')->endOfDay()]);
        }


        $invoice_generals = $invoice_generals->get();

        return response()->json($invoice_generals);
    }

    public function arsipFilter(Request $request)
    {
        $arsip = InvoiceGeneral::withTrashed()->with(['createdBy', 'lead', 'status', 'partner'])->whereNotNull('deleted_at');

        if ($request->user) {
            $arsip->where('created_by', '=', $request->user['id']);
        }

        if ($request->delete_date['start'] && $request->delete_date['end']) {
            $arsip->whereBetween('deleted_at', [Carbon::parse($request->delete_date['start'])->setTimezone('GMT+7')->startOfDay(), Carbon::parse($request->delete_date['end'])->setTimezone('GMT+7')->endOfDay()]);
        }

        $arsip = $arsip->get();

        return response()->json($arsip);
    }

    public function updateXendit(Request $request, $uuid)
    {
        $invoice_general = InvoiceGeneral::where('uuid', '=', $uuid)->first();
        $invoice_general->update([
            'xendit_link' => $request->xendit_link,
        ]);
        GenerateInvoiceGeneralJob::dispatch($invoice_general, $request->products);
    }

    public function apiGetInvoiceGenerals()
    {
        $invoiceGenerals = InvoiceGeneral::with(['partner', 'products', 'transactions.user', 'status', 'lead'])->latest()->get();
        return response()->json($invoiceGenerals);
    }

    public function destroy($uuid)
    {
        try {
            $invoice_general = InvoiceGeneral::where('uuid', '=', $uuid)->first();
            Activity::create([
                'log_name' => 'deleted',
                'description' => Auth::user()->name . ' menghapus data invoice umum',
                'subject_type' => get_class($invoice_general),
                'subject_id' => $invoice_general->id,
                'causer_type' => get_class(Auth::user()),
                'causer_id' => Auth::user()->id,
                "event" => "deleted",
                'properties' => ["old" => ["code" => $invoice_general->code, "institution_name" => $invoice_general->institution_name, "institution_npwp" => $invoice_general->institution_npwp, "date" => $invoice_general->date, "due_date" => $invoice_general->due_date, "invoice_age" => $invoice_general->invoice_age, "bill_date" => $invoice_general->bill_date, 'total' => $invoice_general->total, 'total_all_ppn' => $invoice_general->total_all_ppn, 'paid_off' => $invoice_general->paid_off, 'rest_of_bill' => $invoice_general->rest_of_bill, 'signature_name' => $invoice_general->signature_name]]
            ]);


            // Storage::disk('public')->delete($invoice_general->invoice_general_doc);
            $invoice_general->delete();

            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error hapus invoice umum: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }

    }

    public function restore($uuid)
    {
        $invoice_general = InvoiceGeneral::withTrashed()->where('uuid', '=', $uuid)->first();
        $invoice_general->restore();
    }

    public function destroyForce($uuid)
    {
        try {
            $invoice_general = InvoiceGeneral::withTrashed()->where('uuid', '=', $uuid)->first();
            Activity::create([
                'log_name' => 'force',
                'description' => Auth::user()->name . ' menghapus permanen data invoice umum',
                'subject_type' => get_class($invoice_general),
                'subject_id' => $invoice_general->id,
                'causer_type' => get_class(Auth::user()),
                'causer_id' => Auth::user()->id,
                "event" => "force",
                'properties' => ["old" => ["code" => $invoice_general->code, "institution_name" => $invoice_general->institution_name, "institution_npwp" => $invoice_general->institution_npwp, "date" => $invoice_general->date, "due_date" => $invoice_general->due_date, "invoice_age" => $invoice_general->invoice_age, "bill_date" => $invoice_general->bill_date, 'total' => $invoice_general->total, 'total_all_ppn' => $invoice_general->total_all_ppn, 'paid_off' => $invoice_general->paid_off, 'rest_of_bill' => $invoice_general->rest_of_bill, 'signature_name' => $invoice_general->signature_name]]
            ]);


            Storage::disk('public')->delete($invoice_general->invoice_general_doc);
            $invoice_general->forceDelete();

            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error hapus permanen invoice umum: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }

    }

    public function logFilter(Request $request)
    {
        $logs = Activity::with(['causer', 'subject'])->whereMorphedTo('subject', InvoiceGeneral::class);

        if ($request->user) {
            $logs->whereMorphRelation('causer', User::class, 'causer_id', '=', $request->user['id']);
        }

        if ($request->date['start'] && $request->date['end']) {
            $logs->whereBetween('created_at', [Carbon::parse($request->date['start'])->setTimezone('GMT+7')->startOfDay(), Carbon::parse($request->date['end'])->setTimezone('GMT+7')->endOfDay()]);
        }

        $logs = $logs->get();

        return response()->json($logs);
    }

    public function apiGetLogs()
    {
        $logs = Activity::with(['causer', 'subject'])
            ->whereMorphedTo('subject', InvoiceGeneral::class)->orWhereMorphedTo('subject', InvoiceGeneralTransaction::class);

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
        $arsip = InvoiceGeneral::withTrashed()->with(['createdBy', 'lead', 'status', 'partner'])->whereNotNull('deleted_at')->latest()->get();

        return response()->json($arsip);
    }

}
