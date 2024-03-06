<?php

namespace App\Http\Controllers;

use App\Jobs\GenerateReceiptJob;
use App\Models\InvoiceSubscription;
use App\Models\InvoiceSubscriptionTransaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class InvoiceSubscriptionTransactionController extends Controller
{
    public function calculateRestOfBill($invoice_subscription)
    {
        $rest_of_bill = $invoice_subscription->rest_of_bill_locked;

        $totalNominalTransaction = $invoice_subscription->transactions->reduce(function ($counter, $transaction) {
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
        $latestData = InvoiceSubscriptionTransaction::latest()->first() ?? "#KW/000/$romanMonth/$currentYear";
        $lastCode = $latestData ? explode('/', $latestData->code ?? $latestData)[1] : 0;
        $newCode = str_pad((int) $lastCode + 1, 3, '0', STR_PAD_LEFT);
        $newCode = "#KW/$newCode/$romanMonth/$currentYear";
        return $newCode;
    }

    public function store(Request $request)
    {
        $invoice_subscription = InvoiceSubscription::with('transactions')->where('uuid', '=', $request->dataTransaction['invoice_subscription'])->first();
        $rest_of_bill = $this->calculateRestOfBill($invoice_subscription);

        // dd($rest_of_bill);
        // dd($rest_of_bill < $request->dataTransaction['nominal']);
        if ($rest_of_bill < $request->dataTransaction['nominal']) {

            return response()->json(['error' => 'Pembayaran melebihi sisa tagihan']);

        }
        $rest_of_bill = $rest_of_bill - $request->dataTransaction['nominal'];
        $status = "belum terbayar";
        if ($rest_of_bill !== 0) {
            $status = "sebagian";
        } else {
            $status = "lunas";
        }

        $transaction = InvoiceSubscriptionTransaction::create([
            'uuid' => Str::uuid(),
            'code' => $this->generateCode(),
            'invoice_id' => $invoice_subscription->id,
            'partner_id' => $request->dataTransaction['partner']['id'],
            'partner_name' => $request->dataTransaction['partner']['name'],
            'date' => Carbon::parse($request->dataTransaction['date'])->setTimezone('GMT+7')->format('Y-m-d H:i:s'),
            'nominal' => $request->dataTransaction['nominal'],
            'money' => $request->dataTransaction['money'],
            'metode' => $request->dataTransaction['metode']['name'],
            'payment_for' => $request->dataTransaction['payment_for'],
            'receipt_doc' => '',
            'signature_name' => $request->dataTransaction['signature']['name'],
            'signature_image' => $request->dataTransaction['signature']['image'],
            'created_by' => Auth::user()->id
        ]);


        $invoice_subscription->update(['rest_of_bill' => $rest_of_bill, 'status' => $status, 'bill_date' => Carbon::now()->format('Y-m-d H:i:s')]);

        GenerateReceiptJob::dispatch($transaction);

        return response()->json(['rest_of_bill' => $rest_of_bill]);
    }

    public function update(Request $request, $uuid)
    {
        DB::beginTransaction();
        try {
            $transaction = InvoiceSubscriptionTransaction::where('uuid', '=', $uuid)->first();
            $transaction->update([
                'invoice_id' => $request->dataTransaction['invoice_subscription'],
                'partner_id' => $request->dataTransaction['partner']['id'],
                'partner_name' => $request->dataTransaction['partner']['name'],
                'date' => Carbon::parse($request->dataTransaction['date'])->setTimezone('GMT+7')->format('Y-m-d H:i:s'),
                'nominal' => $request->dataTransaction['nominal'],
                'money' => $request->dataTransaction['money'],
                'metode' => $request->dataTransaction['metode']['name'] ?? $request->dataTransaction['metode'],
                'payment_for' => $request->dataTransaction['payment_for'],
                'receipt_doc' => '',
                'signature_name' => $request->dataTransaction['signature']['name'],
                'signature_image' => $request->dataTransaction['signature']['image'],
                'created_by' => Auth::user()->id
            ]);

            $transaction = InvoiceSubscriptionTransaction::where('uuid', '=', $uuid)->first();
            $invoice_subscription = InvoiceSubscription::with([
                'transactions' => function ($query) {
                    $query->latest();
                }
            ])->where('id', '=', $request->dataTransaction['invoice_subscription'])->first();


            $rest_of_bill = $this->calculateRestOfBill($invoice_subscription);

            if ($rest_of_bill < 0) {
                DB::rollBack();
                return response()->json([
                    'error' => 'Pembayaran melebihi sisa tagihan'
                ]);
            }

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }


        $status = "belum terbayar";
        if ($rest_of_bill !== 0 && count($invoice_subscription->transactions) > 0) {
            $status = "sebagian";
        } else {
            $status = "lunas";
        }

        Storage::delete('public/' . $transaction->receipt_doc);

        $invoice_subscription->update(['rest_of_bill' => $rest_of_bill, 'status' => $status, 'bill_date' => Carbon::parse($invoice_subscription->transactions->first()->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s')]);

        GenerateReceiptJob::dispatch($transaction);

        // return Inertia::render('InvoiceSubscription/InvoiceSubscription', [
        //     'rest_of_bill' => $rest_of_bill
        //   ]);
        return response()->json(['rest_of_bill' => $rest_of_bill]);

    }

    public function destroy($uuid)
    {
        $transaction = InvoiceSubscriptionTransaction::where('uuid', '=', $uuid)->first();
        Storage::disk('public')->delete($transaction->receipt_doc);
        $transaction->delete();
        $invoice_subcription_id = $transaction->invoice_id;
        $invoice_subcription = InvoiceSubscription::with([
            'transactions' => function ($query) {
                $query->latest();
            }
        ])->where('id', '=', $invoice_subcription_id)->first();
        $rest_of_bill = $this->calculateRestOfBill($invoice_subcription);
        $status = "belum terbayar";

        if ($rest_of_bill !== 0 && count($invoice_subcription->transactions) > 0) {
            $status = "sebagian";
        } else if ($rest_of_bill !== 0 && count($invoice_subcription->transactions) == 0) {
            $status = "belum terbayar";
        } else {
            $status = "lunas";
        }

        $invoice_subcription->update(['rest_of_bill' => $rest_of_bill, 'status' => $status, 'bill_date' => count($invoice_subcription->transactions) > 0 ? Carbon::parse($invoice_subcription->transactions->first()->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s') : null]);
        return response()->json(['rest_of_bill' => $rest_of_bill]);

    }
}
