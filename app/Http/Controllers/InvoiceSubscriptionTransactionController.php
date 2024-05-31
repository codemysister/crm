<?php

namespace App\Http\Controllers;

use App\Jobs\GenerateReceiptJob;
use App\Models\InvoiceSubscription;
use App\Models\InvoiceSubscriptionTransaction;
use App\Models\Status;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;
use Spatie\Browsershot\Browsershot;

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

        $lastDataCurrentMonth = InvoiceSubscriptionTransaction::whereYear('created_at', $currentYear)
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

    public function store(Request $request)
    {
        try {
            $invoice_subscription = InvoiceSubscription::with('transactions')->where('uuid', '=', $request->invoice_subscription)->first();
            $rest_of_bill = $this->calculateRestOfBill($invoice_subscription);
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

            $pathProofImage = null;
            if ($request->hasFile('proof_of_transaction')) {
                $file = $request->file('proof_of_transaction');
                $filename = time() . '_' . Auth::user()->id . '.' . $file->getClientOriginalExtension();
                $pathProofImage = 'storage/images/transaksi/' . $filename;
                Storage::putFileAs('public/images/transaksi', $file, $filename);
            }


            $transaction = new InvoiceSubscriptionTransaction();
            $transaction->uuid = Str::uuid();
            $transaction->code = $this->generateCode();
            $transaction->invoice_id = $invoice_subscription->id;
            $transaction->partner_id = $request->partner['id'];
            $transaction->partner_name = $request->partner['name'];
            $transaction->date = Carbon::parse($request->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
            $transaction->nominal = $request->nominal;
            $transaction->money = $request->money;
            $transaction->metode = $request->metode['name'];
            $transaction->payment_for = $request->payment_for;
            $transaction->receipt_doc = '';
            $transaction->proof_of_transaction = $pathProofImage;
            $transaction->signature_name = "Muh Arif Mahfudin";
            $transaction->signature_image = "/assets/img/signatures/ttd.png";
            $transaction->created_by = Auth::user()->id;
            $transaction = $this->generateReceipt($transaction);
            $transaction->save();

            Activity::create([
                'log_name' => 'payment',
                'description' => Auth::user()->name . ' menambah pembayaran invoice langganan',
                'subject_type' => get_class($transaction),
                'subject_id' => $transaction->id,
                'causer_type' => get_class(Auth::user()),
                'causer_id' => Auth::user()->id,
                "event" => "payment",
                'properties' => ["attributes" => ["code" => $invoice_subscription->code, "partner_name" => $transaction->partner_name, "date" => $transaction->date, "nominal" => $transaction->nominal, "money" => $transaction->money, 'method' => $transaction->method, 'payment_for' => $transaction->payment_for, 'signature_name' => $transaction->signature_name]]
            ]);

            $invoice_subscription->update(['rest_of_bill' => $rest_of_bill, 'status_id' => $status->id, 'bill_date' => Carbon::parse($request->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s')]);

            DB::commit();
            return response()->json(['rest_of_bill' => $rest_of_bill]);

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error tambah pembayaran invoice langganan: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function update(Request $request, $uuid)
    {
        DB::beginTransaction();
        try {
            $transaction = InvoiceSubscriptionTransaction::where('uuid', '=', $uuid)->first();

            $pathProofImage = $transaction->proof_of_transaction;
            if ($request->hasFile('proof_of_transaction')) {
                unlink($transaction->proof_of_transaction);
                $file = $request->file('proof_of_transaction');
                $filename = time() . '_' . Auth::user()->id . '.' . $file->guessExtension();
                $pathProofImage = 'storage/images/transaksi/' . $filename;
                Storage::putFileAs('public/images/transaksi', $file, $filename);
            } else {
                if ($request->proof_of_transaction !== null) {
                    $pathProofImage = $transaction->proof_of_transaction;
                }
            }

            $transaction->invoice_id = $request->invoice_subscription;
            $transaction->partner_id = $request->partner['id'];
            $transaction->partner_name = $request->partner['name'];
            $transaction->date = Carbon::parse($request->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
            $transaction->nominal = $request->nominal;
            $transaction->money = $request->money;
            $transaction->metode = $request->metode['name'] ?? $request->metode;
            $transaction->payment_for = $request->payment_for;
            $transaction->receipt_doc = '';
            $transaction->proof_of_transaction = $pathProofImage;
            $transaction->signature_name = $request->signature['name'];
            $transaction->signature_image = $request->signature['image'];
            $transaction->created_by = Auth::user()->id;
            $transaction = $this->generateReceipt($transaction);
            $transaction->save();

            $transaction = InvoiceSubscriptionTransaction::where('uuid', '=', $uuid)->first();
            $invoice_subscription = InvoiceSubscription::with([
                'transactions' => function ($query) {
                    $query->latest();
                }
            ])->where('id', '=', $request->invoice_subscription)->first();

            $rest_of_bill = $this->calculateRestOfBill($invoice_subscription);

            if ($rest_of_bill < 0) {
                DB::rollBack();
                return response()->json([
                    'error' => 'Pembayaran melebihi sisa tagihan'
                ]);
            }

            $status = Status::where('category', 'invoice');
            if ($rest_of_bill != 0 && count($invoice_subscription->transactions) > 0) {
                $status = $status->where('name', 'sebagian')->first();
            } else {
                $status = $status->where('name', 'lunas')->first();
            }

            Storage::delete('public/' . $transaction->receipt_doc);

            $invoice_subscription->update(['rest_of_bill' => $rest_of_bill, 'status_id' => $status->id, 'bill_date' => Carbon::parse($invoice_subscription->transactions->first()->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s')]);

            DB::commit();

            return response()->json(['rest_of_bill' => $rest_of_bill]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }


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

        $invoice_subcription->update(['rest_of_bill' => $rest_of_bill, 'status_id' => $status, 'bill_date' => count($invoice_subcription->transactions) > 0 ? Carbon::parse($invoice_subcription->transactions->first()->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s') : null]);
        return response()->json(['rest_of_bill' => $rest_of_bill]);

    }
}
