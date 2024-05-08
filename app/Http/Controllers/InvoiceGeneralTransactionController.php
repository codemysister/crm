<?php

namespace App\Http\Controllers;

use App\Http\Requests\InvoiceGeneralTransactionRequest;
use App\Jobs\GenerateReceiptJob;
use App\Models\InvoiceGeneral;
use App\Models\InvoiceGeneralTransaction;
use App\Models\Status;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\Activitylog\Models\Activity;
use Spatie\Browsershot\Browsershot;

class InvoiceGeneralTransactionController extends Controller
{

    public function calculateRestOfBill($invoice_general)
    {
        $rest_of_bill = $invoice_general->rest_of_bill_locked;
        $totalNominalTransaction = $invoice_general->transactions->reduce(function ($counter, $transaction) {
            return $counter + $transaction->nominal;
        });
        return $rest_of_bill - $totalNominalTransaction;
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

        $lastDataCurrentMonth = InvoiceGeneralTransaction::whereYear('created_at', $currentYear)
            ->whereMonth('created_at', $currentMonth)->latest()->first();

        $code = null;
        if ($lastDataCurrentMonth == null) {
            $code = "000";
        } else {
            $parts = explode("/", $lastDataCurrentMonth->code);
            $code = $parts[1];
        }
        $codeInteger = intval($code) + 1;
        $latestCode = str_pad($codeInteger, strlen($code), "0", STR_PAD_LEFT);
        $romanMonth = intToRoman($currentMonth);

        $newCode = "#KW/$latestCode/$romanMonth/$currentYear";
        return $newCode;
    }

    public function generateReceipt($receipt)
    {
        $path = "kwitansi/kwitansi-" . $receipt->uuid . ".pdf";

        $receipt->receipt_doc = $path;

        $html = view('pdf.receipt', ["receipt" => $receipt])->render();

        $pdf = Browsershot::html($html)
            ->setIncludedPath(config('services.browsershot.included_path'))
            ->showBackground()
            ->showBrowserHeaderAndFooter()
            ->headerHtml('<div></div>')
            ->footerHtml('<div style="text-align: left; font-size: 10px; width:100%; margin-left: 2.5cm; margin-bottom: 1cm;">*) Harga produk/layanan tidak termasuk biaya admin transaksi <span style="font-style:italic;">user</span> aplikasi <span style="font-style:italic;">mobile</span>.</div>')
            ->pdf();


        Storage::put("public/$path", $pdf);

        return $receipt;
    }

    public function store(InvoiceGeneralTransactionRequest $request)
    {

        try {
            $invoice_general = InvoiceGeneral::with('transactions')->where('uuid', '=', $request->invoice_general)->first();

            $rest_of_bill = $this->calculateRestOfBill($invoice_general);

            if ($rest_of_bill < $request->nominal) {
                return response()->json(['error' => 'Pembayaran melebihi sisa tagihan']);
            }
            $rest_of_bill = $rest_of_bill - $request->nominal;

            $status = Status::where('category', 'invoice');
            if ($rest_of_bill != 0) {
                $status = $status->where('name', 'sebagian')->first();
            } else {
                $status = $status->where('name', 'lunas')->first();
            }

            $transaction = new InvoiceGeneralTransaction();
            $transaction->uuid = Str::uuid();
            $transaction->code = $this->generateCode();
            $transaction->invoice_general_id = $invoice_general->id;
            $transaction->partner_id = $request['partner']['id'];
            $transaction->partner_name = $request['partner']['name'];
            $transaction->date = Carbon::parse($request->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
            $transaction->nominal = $request->nominal;
            $transaction->money = $request->money;
            $transaction->metode = $request->metode['name'];
            $transaction->payment_for = $request->payment_for;
            $transaction->signature_name = $request->signature['name'];
            $transaction->signature_image = $request->signature['image'];
            $transaction->created_by = Auth::user()->id;
            $transaction = $this->generateReceipt($transaction);
            $transaction->save();

            Activity::create([
                'log_name' => 'payment',
                'description' => Auth::user()->name . ' menambah pembayaran Invoice Umum',
                'subject_type' => get_class($transaction),
                'subject_id' => $transaction->id,
                'causer_type' => get_class(Auth::user()),
                'causer_id' => Auth::user()->id,
                "event" => "payment",
                'properties' => ["attributes" => ["code" => $invoice_general->code, "partner_name" => $transaction->partner_name, "date" => $transaction->date, "nominal" => $transaction->nominal, "money" => $transaction->money, 'method' => $transaction->method, 'payment_for' => $transaction->payment_for, 'signature_name' => $transaction->signature_name]]
            ]);

            $invoice_general->update(['rest_of_bill' => $rest_of_bill, 'status_id' => $status->id, 'bill_date' => Carbon::parse($request->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s')]);

            DB::commit();
            return response()->json(['rest_of_bill' => $rest_of_bill]);

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error tambah pembayaran invoice umum: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }

    }
    public function update(InvoiceGeneralTransactionRequest $request, $uuid)
    {

        DB::beginTransaction();

        try {
            $transaction = InvoiceGeneralTransaction::where('uuid', '=', $uuid)->first();
            $transaction->invoice_general_id = $request->invoice_general_id;
            $transaction->partner_id = $request['partner']['id'];
            $transaction->partner_name = $request['partner']['name'];
            $transaction->date = Carbon::parse($request->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
            $transaction->nominal = $request->nominal;
            $transaction->money = $request->money;
            $transaction->metode = $request->metode['name'] ?? $request->metode;
            $transaction->payment_for = $request->payment_for;
            $transaction->receipt_doc = '';
            $transaction->signature_name = $request->signature['name'];
            $transaction->signature_image = $request->signature['image'];
            $transaction->created_by = Auth::user()->id;
            $transaction = $this->generateReceipt($transaction);
            $transaction->save();

            $transaction = InvoiceGeneralTransaction::where('uuid', '=', $uuid)->first();

            $invoice_general = InvoiceGeneral::with([
                'transactions' => function ($query) {
                    $query->latest();
                }
            ])->where('id', '=', $request->invoice_general_id)->first();

            $rest_of_bill = $this->calculateRestOfBill($invoice_general);

            if ($rest_of_bill < 0) {
                DB::rollBack();
                return response()->json(['error' => 'Pembayaran melebihi sisa tagihan']);
            }

            $status = Status::where('category', 'invoice');
            if ($rest_of_bill !== 0 && count($invoice_general->transactions) > 0) {
                $status = $status->where('name', 'sebagian')->first();
            } else {
                $status = $status->where('name', 'lunas')->first();
            }

            $invoice_general->update(['rest_of_bill' => $rest_of_bill, 'status_id' => $status->id, 'bill_date' => Carbon::parse($invoice_general->transactions->first()->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s')]);

            DB::commit();

            return response()->json(['rest_of_bill' => $rest_of_bill]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }

    }

    public function destroy($uuid)
    {
        $transaction = InvoiceGeneralTransaction::where('uuid', '=', $uuid)->first();

        Storage::disk('public')->delete($transaction->receipt_doc);
        $transaction->delete();
        $invoice_general_id = $transaction->invoice_general_id;
        $invoice_general = InvoiceGeneral::with([
            'transactions' => function ($query) {
                $query->latest();
            }
        ])->where('id', '=', $invoice_general_id)->first();
        $rest_of_bill = $this->calculateRestOfBill($invoice_general);

        $status = Status::where('category', 'invoice');
        if ($rest_of_bill !== 0 && count($invoice_general->transactions) > 0) {
            $status = $status->where('name', 'sebagian')->first();
        } else {
            $status = $status->where('name', 'lunas')->first();
        }

        $invoice_general->update(['rest_of_bill' => $rest_of_bill, 'status_id' => $status->id, 'bill_date' => count($invoice_general->transactions) > 0 ? Carbon::parse($invoice_general->transactions()->latest()->first()->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s') : null]);
        return response()->json(['rest_of_bill' => $rest_of_bill]);
    }
}
