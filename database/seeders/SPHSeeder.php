<?php

namespace Database\Seeders;

use App\Models\Lead;
use App\Models\SPH;
use App\Models\SPHProduct;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\Browsershot\Browsershot;

class SPHSeeder extends Seeder
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


        $lastDataCurrentMonth = SPH::withTrashed()->whereYear('created_at', $currentYear)
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
        $newCode = "SPH/$latestCode/$romanMonth/$currentYear";

        return $newCode;
    }

    public function generateSPH($sph, $products)
    {
        $path = "sph/sph-" . $sph->uuid . ".pdf";

        $sph->sph_doc = "storage/$path";

        $html = view('pdf.sph', ["sph" => $sph, 'products' => $products])->render();

        $pdf = Browsershot::html($html)
            ->margins("2.5", "2", "2.5", "2", "cm")
            ->setIncludedPath(config('services.browsershot.included_path'))
            ->showBackground()
            ->showBrowserHeaderAndFooter()
            ->headerHtml('<div></div>')
            ->footerHtml('<div style="text-align: left; font-size: 10px; width:100%; margin-left: 2.5cm; margin-bottom: 1cm;">*) Harga produk/layanan tidak termasuk biaya admin transaksi <span style="font-style:italic;">user</span> aplikasi <span style="font-style:italic;">mobile</span>.</div>')
            ->pdf();

        Storage::put("public/$path", $pdf);

        return $sph;
    }

    public function run(): void
    {
        $code = $this->generateCode();
        $sph = new SPH();
        $sph->uuid = Str::uuid();
        $sph->code = $code;
        $sph->date = Carbon::now();
        $sph->lead_id = 1;
        $sph->partner_name = "YAPSI Darul Amal";
        $sph->partner_pic = "Ribhi Barka";
        $sph->partner_province = '{"id":"13","code":"33","name":"Jawa Tengah","meta":{"lat":"-7.150975","long":"110.1402594"},"created_at":"2024-06-18 11:14:12","updated_at":"2024-06-18 11:14:12"}';
        $sph->partner_regency = '{"id":"189","code":"3302","province_code":"33","name":"Kabupaten Banyumas","meta":{"lat":"-7.4832133","long":"109.140438"},"created_at":"2024-06-18 11:14:12","updated_at":"2024-06-18 11:14:12"}';
        $sph->sales_name = "Kamil";
        $sph->sales_wa = "0851271846134";
        $sph->sales_email = "kamil@cazh.id";
        $sph->signature_name = "Muh Arif Mahmudin";
        $sph->signature_position = "CEO";
        $sph->signature_image = "/assets/img/signatures/ttd.png";
        $sph->created_by = 6;
        $products = [
            [
                "sph_id" => 1,
                "name" => "Kartu Digital",
                "qty" => 500,
                "detail" => "500 member* 25000/kartu",
                "price" => 25000,
                "total" => 12500000
            ],
            [
                "sph_id" => 1,
                "name" => "Langganan Sistem",
                "qty" => 500,
                "detail" => "langganan 1 bulan",
                "price" => 5000,
                "total" => 2500000
            ],
        ];
        $sph = $this->generateSPH($sph, $products);
        $sph->save();

        foreach ($products as $product) {
            SPHProduct::create([
                "sph_id" => $product['sph_id'],
                "name" => $product['name'],
                "qty" => $product['qty'],
                "price" => $product['price'],
                "detail" => $product['detail'],
                "total" => $product['total']
            ]);
        }



        $code = $this->generateCode();
        $sph = new SPH();
        $sph->uuid = Str::uuid();
        $sph->code = $code;
        $sph->date = Carbon::now();
        $sph->lead_id = 2;
        $sph->partner_name = "Yayasan Daarul Quran Alkautsar, Cibinong Bogor";
        $sph->partner_pic = "Admin";
        $sph->partner_province = '{"id":"13","code":"33","name":"Jawa Tengah","meta":{"lat":"-7.150975","long":"110.1402594"},"created_at":"2024-06-18 11:14:12","updated_at":"2024-06-18 11:14:12"}';
        $sph->partner_regency = '{"id":"189","code":"3302","province_code":"33","name":"Kabupaten Banyumas","meta":{"lat":"-7.4832133","long":"109.140438"},"created_at":"2024-06-18 11:14:12","updated_at":"2024-06-18 11:14:12"}';
        $sph->sales_name = "Kamil";
        $sph->sales_wa = "0851271846134";
        $sph->sales_email = "kamil@cazh.id";
        $sph->signature_name = "Muh Arif Mahmudin";
        $sph->signature_position = "CEO";
        $sph->signature_image = "/assets/img/signatures/ttd.png";
        $sph->created_by = 6;
        $products = [
            [
                "sph_id" => 2,
                "name" => "Kartu Digital",
                "qty" => 500,
                "detail" => "500 member* 25000/kartu",
                "price" => 25000,
                "total" => 12500000
            ],
            [
                "sph_id" => 2,
                "name" => "Langganan Sistem",
                "qty" => 500,
                "detail" => "langganan 1 bulan",
                "price" => 5000,
                "total" => 2500000
            ],
        ];
        $sph = $this->generateSPH($sph, $products);
        $sph->save();
        foreach ($products as $product) {
            SPHProduct::create([
                "sph_id" => $product['sph_id'],
                "name" => $product['name'],
                "qty" => $product['qty'],
                "price" => $product['price'],
                "detail" => $product['detail'],
                "total" => $product['total']
            ]);
        }


        $code = $this->generateCode();
        $sph = new SPH();
        $sph->uuid = Str::uuid();
        $sph->code = $code;
        $sph->date = Carbon::now();
        $sph->lead_id = 3;
        $sph->partner_name = "PP Darul Falah, Subang";
        $sph->partner_pic = "Linawati";
        $sph->partner_province = '{"id":"13","code":"33","name":"Jawa Tengah","meta":{"lat":"-7.150975","long":"110.1402594"},"created_at":"2024-06-18 11:14:12","updated_at":"2024-06-18 11:14:12"}';
        $sph->partner_regency = '{"id":"189","code":"3302","province_code":"33","name":"Kabupaten Banyumas","meta":{"lat":"-7.4832133","long":"109.140438"},"created_at":"2024-06-18 11:14:12","updated_at":"2024-06-18 11:14:12"}';
        $sph->sales_name = "Kamil";
        $sph->sales_wa = "0851271846134";
        $sph->sales_email = "kamil@cazh.id";
        $sph->signature_name = "Muh Arif Mahmudin";
        $sph->signature_position = "CEO";
        $sph->signature_image = "/assets/img/signatures/ttd.png";
        $sph->created_by = 6;
        $products = [
            [
                "sph_id" => 3,
                "name" => "Kartu Digital",
                "qty" => 500,
                "detail" => "500 member* 25000/kartu",
                "price" => 25000,
                "total" => 12500000
            ],
            [
                "sph_id" => 3,
                "name" => "Langganan Sistem",
                "qty" => 500,
                "detail" => "langganan 1 bulan",
                "price" => 5000,
                "total" => 2500000
            ],
        ];
        $sph = $this->generateSPH($sph, $products);
        $sph->save();
        foreach ($products as $product) {
            SPHProduct::create([
                "sph_id" => $product['sph_id'],
                "name" => $product['name'],
                "qty" => $product['qty'],
                "price" => $product['price'],
                "detail" => $product['detail'],
                "total" => $product['total']
            ]);
        }

    }
}
