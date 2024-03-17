<?php

namespace App\Http\Controllers;

use App\Http\Requests\InvoiceGeneralTransactionRequest;
use App\Jobs\GenerateReceiptJob;
use App\Models\InvoiceGeneral;
use App\Models\InvoiceGeneralTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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

        $romanMonth = intToRoman($currentMonth);
        $latestData = InvoiceGeneralTransaction::latest()->first() ?? "#KW/000/$romanMonth/$currentYear";
        $lastCode = $latestData ? explode('/', $latestData->code ?? $latestData)[1] : 0;
        $newCode = str_pad((int) $lastCode + 1, 3, '0', STR_PAD_LEFT);
        $newCode = "#KW/$newCode/$romanMonth/$currentYear";
        return $newCode;
    }

    public function store(InvoiceGeneralTransactionRequest $request)
    {

        $invoice_general = InvoiceGeneral::with('transactions')->where('uuid', '=', $request->invoice_general)->first();

        $rest_of_bill = $this->calculateRestOfBill($invoice_general);


        if ($rest_of_bill < $request->nominal) {
            return response()->json(['error' => 'Pembayaran melebihi sisa tagihan']);
        }
        $rest_of_bill = $rest_of_bill - $request->nominal;
        $status = "belum terbayar";
        if ($rest_of_bill !== 0) {
            $status = "sebagian";
        } else {
            $status = "lunas";
        }

        $transaction = InvoiceGeneralTransaction::create([
            'uuid' => Str::uuid(),
            'code' => $this->generateCode(),
            'invoice_general_id' => $invoice_general->id,
            'partner_id' => $request['partner']['id'],
            'partner_name' => $request['partner']['name'],
            'date' => Carbon::parse($request->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s'),
            'nominal' => $request->nominal,
            'money' => $request->money,
            'metode' => $request->metode['name'],
            'payment_for' => $request->payment_for,
            'receipt_doc' => '',
            'signature_name' => $request->signature['name'],
            'signature_image' => $request->signature['image'],
            'created_by' => Auth::user()->id
        ]);


        $invoice_general->update(['rest_of_bill' => $rest_of_bill, 'status' => $status, 'bill_date' => Carbon::parse($request->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s')]);

        GenerateReceiptJob::dispatch($transaction);
        return response()->json(['rest_of_bill' => $rest_of_bill]);

    }
    public function update(InvoiceGeneralTransactionRequest $request, $uuid)
    {

        DB::beginTransaction();

        try {
            $transaction = InvoiceGeneralTransaction::where('uuid', '=', $uuid)->first();
            $transaction->update([
                'invoice_general_id' => $request->invoice_general_id,
                'partner_id' => $request['partner']['id'],
                'partner_name' => $request['partner']['name'],
                'date' => Carbon::parse($request->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s'),
                'nominal' => $request->nominal,
                'money' => $request->money,
                'metode' => $request->metode['name'] ?? $request->metode,
                'payment_for' => $request->payment_for,
                'receipt_doc' => '',
                'signature_name' => $request->signature['name'],
                'signature_image' => $request->signature['image'],
                'created_by' => Auth::user()->id
            ]);

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

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }


        $status = "belum terbayar";
        if ($rest_of_bill !== 0 && count($invoice_general->transactions) > 0) {
            $status = "sebagian";
        } else {
            $status = "lunas";
        }


        $invoice_general->update(['rest_of_bill' => $rest_of_bill, 'status' => $status, 'bill_date' => Carbon::parse($invoice_general->transactions->first()->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s')]);

        GenerateReceiptJob::dispatch($transaction);

        return response()->json(['rest_of_bill' => $rest_of_bill]);

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
        $status = "belum terbayar";


        if ($rest_of_bill !== 0 && count($invoice_general->transactions) > 0) {
            $status = "sebagian";
        } else {
            $status = "lunas";
        }

        $invoice_general->update(['rest_of_bill' => $rest_of_bill, 'status' => $status, 'bill_date' => count($invoice_general->transactions) > 0 ? Carbon::parse($invoice_general->transactions()->latest()->first()->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s') : null]);
        return response()->json(['rest_of_bill' => $rest_of_bill]);
    }
}
