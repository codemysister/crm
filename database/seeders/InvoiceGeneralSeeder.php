<?php

namespace Database\Seeders;

use App\Models\InvoiceGeneral;
use App\Models\InvoiceGeneralProducts;
use App\Models\Status;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\Browsershot\Browsershot;

class InvoiceGeneralSeeder extends Seeder
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

        $romanMonth = $this->intToRoman($currentMonth);
        $newCode = "#INV/$latestCode/$romanMonth/$currentYear";
        return $newCode;
    }

    public function rangeBetweenDate($firstDate, $secondDate)
    {
        $firstDate = Carbon::create($firstDate);
        $secondDate = Carbon::create($secondDate);

        $diffInDays = $firstDate->diffInDays($secondDate);

        return $diffInDays;
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

    public function run(): void
    {
        $code = $this->generateCode();

        $statusBelumBayar = Status::where('name', 'belum bayar')->where('category', 'invoice')->first();

        $invoice_general = new InvoiceGeneral();
        $invoice_general->uuid = Str::uuid();
        $invoice_general->code = $code;
        $invoice_general->lead_id = 1;
        $invoice_general->status_id = $statusBelumBayar->id;
        $invoice_general->institution_name = "YAPSI Darul Amal";
        $invoice_general->institution_province = '{"id":"13","code":"33","name":"Jawa Tengah","meta":{"lat":"-7.150975","long":"110.1402594"},"created_at":"2024-06-19 02:45:15","updated_at":"2024-06-19 02:45:15"}';
        $invoice_general->institution_regency = '{"id":"189","code":"3302","province_code":"33","name":"Kabupaten Banyumas","meta":{"lat":"-7.4832133","long":"109.140438"},"created_at":"2024-06-19 02:45:15","updated_at":"2024-06-19 02:45:15"}';
        $invoice_general->institution_phone_number = '85182951124';
        $invoice_general->date = "2024-06-18";
        $invoice_general->due_date = "2024-06-27";
        $invoice_general->invoice_age = $this->rangeBetweenDate("2024-06-18", Carbon::now());
        $invoice_general->total = 29000000;
        $invoice_general->total_all_ppn = 0;
        $invoice_general->total_final_with_ppn = 29000000;
        $invoice_general->paid_off = 0;
        $invoice_general->rest_of_bill = 29000000;
        $invoice_general->rest_of_bill_locked = 29000000;
        $invoice_general->signature_name = "Hari Yuliawan";
        $invoice_general->signature_image = "/assets/img/signatures/ttd_cto.png";
        $invoice_general->payment_metode = "cazhbox";
        $invoice_general->xendit_link = null;
        $invoice_general->created_by = 6;
        $products = [
            [
                "invoice_general_id" => 1,
                "name" => "Kartu cetak",
                "quantity" => 120,
                "description" => "kartu untuk transaksi lembaga pendidikan",
                "price" => 25000,
                "total" => 3000000,
                "total_ppn" => 0,
                "ppn" => 0
            ],
            [
                "invoice_general_id" => 1,
                "name" => "Paket Presensi (tablet, scanner, box)",
                "quantity" => 4,
                "description" => "alat keperluan presensi",
                "price" => 6500000,
                "total" => 26000000,
                "total_ppn" => 0,
                "ppn" => 0
            ]
        ];
        $invoice_general = $this->generateInvoiceGeneral($invoice_general, $products);
        $invoice_general->save();
        foreach ($products as $product) {
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

        $code = $this->generateCode();

        $statusBelumBayar = Status::where('name', 'belum bayar')->where('category', 'invoice')->first();

        $invoice_general = new InvoiceGeneral();
        $invoice_general->uuid = Str::uuid();
        $invoice_general->code = $code;
        $invoice_general->lead_id = 3;
        $invoice_general->status_id = $statusBelumBayar->id;
        $invoice_general->institution_name = "PP Darul Falah, Subang";
        $invoice_general->institution_province = '{"id":"13","code":"33","name":"Jawa Tengah","meta":{"lat":"-7.150975","long":"110.1402594"},"created_at":"2024-06-19 02:45:15","updated_at":"2024-06-19 02:45:15"}';
        $invoice_general->institution_regency = '{"id":"189","code":"3302","province_code":"33","name":"Kabupaten Banyumas","meta":{"lat":"-7.4832133","long":"109.140438"},"created_at":"2024-06-19 02:45:15","updated_at":"2024-06-19 02:45:15"}';
        $invoice_general->institution_phone_number = '85182951124';
        $invoice_general->date = "2024-06-18";
        $invoice_general->due_date = "2024-06-27";
        $invoice_general->invoice_age = $this->rangeBetweenDate("2024-06-18", Carbon::now());
        $invoice_general->total = 29000000;
        $invoice_general->total_all_ppn = 0;
        $invoice_general->total_final_with_ppn = 29000000;
        $invoice_general->paid_off = 0;
        $invoice_general->rest_of_bill = 29000000;
        $invoice_general->rest_of_bill_locked = 29000000;
        $invoice_general->signature_name = "Hari Yuliawan";
        $invoice_general->signature_image = "/assets/img/signatures/ttd_cto.png";
        $invoice_general->payment_metode = "cazhbox";
        $invoice_general->xendit_link = null;
        $invoice_general->created_by = 6;
        $products = [
            [
                "invoice_general_id" => 1,
                "name" => "Kartu cetak",
                "quantity" => 120,
                "description" => "kartu untuk transaksi lembaga pendidikan",
                "price" => 25000,
                "total" => 3000000,
                "total_ppn" => 0,
                "ppn" => 0
            ],
            [
                "invoice_general_id" => 1,
                "name" => "Paket Presensi (tablet, scanner, box)",
                "quantity" => 4,
                "description" => "alat keperluan presensi",
                "price" => 6500000,
                "total" => 26000000,
                "total_ppn" => 0,
                "ppn" => 0
            ]
        ];
        $invoice_general = $this->generateInvoiceGeneral($invoice_general, $products);
        $invoice_general->save();
        foreach ($products as $product) {
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
    }
}
