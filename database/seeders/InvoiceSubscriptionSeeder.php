<?php

namespace Database\Seeders;

use App\Models\InvoiceSubscription;
use App\Models\InvoiceSubscriptionBill;
use App\Models\Status;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\Browsershot\Browsershot;

class InvoiceSubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    function intToRoman($number)
    {
        $map = array('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII');
        return $map[$number - 1];
    }

    public function generateCode()
    {
        $currentMonth = date('n');
        $currentYear = date('Y');

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
        $romanMonth = $this->intToRoman($currentMonth);

        $newCode = "#INV/$latestCode/$romanMonth/$currentYear";

        return $newCode;
    }

    public function generateInvoiceSubscription($invoice_subscription, $bills)
    {
        $path = "invoice_langganan/invoice_langganan-" . $invoice_subscription->uuid . ".pdf";

        $invoice_subscription->invoice_subscription_doc = $path;

        $html = view('pdf.invoice_subscription', ["invoice_subscription" => $invoice_subscription, "bills" => $bills])->render();

        $pdf = Browsershot::html($html)
            ->setIncludedPath(config('services.browsershot.included_path'))
            ->showBackground()
            ->pdf();

        Storage::put("public/$path", $pdf);

        return $invoice_subscription;
    }
    public function run(): void
    {
        $lastCode = $this->generateCode();
        $date = "2024-06-19";
        $due_date = "2024-06-25";
        $date_now = Carbon::now();
        $invoice_age = $date_now->diffInDays($date, false) + 1;
        $rest_of_bill = 550000;
        $statusBelumBayar = Status::where('name', 'belum bayar')->where('category', 'invoice')->first();
        $invoice_subscription = new InvoiceSubscription();
        $invoice_subscription->uuid = Str::uuid();
        $invoice_subscription->partner_id = 2;
        $invoice_subscription->status_id = $statusBelumBayar->id;
        $invoice_subscription->code = $lastCode;
        $invoice_subscription->date = $date;
        $invoice_subscription->period = Carbon::parse($date)->locale('id')->isoFormat('DD MMMM YYYY');
        $invoice_subscription->due_date = $due_date;
        $invoice_subscription->invoice_age = $invoice_age;
        $invoice_subscription->partner_name = "PP Fathul Ulum, Pekalongan";
        $invoice_subscription->partner_province = '{"id":"13","code":"33","name":"JAWA TENGAH","meta":{"lat":"-7.150975","long":"110.1402594"},"created_at":"2024-06-19 09:08:42","updated_at":"2024-06-19 09:08:42"}';
        $invoice_subscription->partner_regency = '{"id":"213","code":"3326","province_code":"33","name":"KABUPATEN PEKALONGAN","meta":{"lat":"-7.0517128","long":"109.6163185"},"created_at":"2024-06-19 09:08:42","updated_at":"2024-06-19 09:08:42"}';
        $invoice_subscription->signature_name = 'Hari Yuliawan';
        $invoice_subscription->signature_image = '/assets/img/signatures/ttd_cto.png';
        $invoice_subscription->total_nominal = 550000;
        $invoice_subscription->total_ppn = 50000;
        $invoice_subscription->total_bill = 550000;
        $invoice_subscription->rest_of_bill = 550000;
        $invoice_subscription->rest_of_bill_locked = 550000;
        $invoice_subscription->paid_off = 0;
        $invoice_subscription->payment_metode = "payment link";
        $invoice_subscription->xendit_link = "https://checkout.xendit.co/web/12412";
        $invoice_subscription->created_by = 11;
        $bills = [
            [
                "bill" => "Tagihan Bulan",
                "nominal" => 500000,
                "ppn" => 10,
                "total_ppn" => 50000,
                "total_bill" => 550000
            ]
        ];
        $invoice_subscription = $this->generateInvoiceSubscription($invoice_subscription, $bills);
        $invoice_subscription->save();

        foreach ($bills as $bill) {
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
    }
}
