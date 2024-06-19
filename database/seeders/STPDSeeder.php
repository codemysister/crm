<?php

namespace Database\Seeders;

use App\Models\STPD;
use App\Models\STPDEmployees;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\Browsershot\Browsershot;

class STPDSeeder extends Seeder
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

        $lastDataCurrentMonth = STPD::withTrashed()->whereYear('created_at', $currentYear)
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
        $newCode = "$latestCode/CAZH-SPJ/$romanMonth/$currentYear";
        return $newCode;
    }

    public function generateSTPD($stpd, $employees)
    {
        $path = "stpd/stpd-" . $stpd->uuid . ".pdf";

        $stpd->stpd_doc = "storage/$path";

        $html = view('pdf.stpd', ["stpd" => $stpd, "employees" => $employees])->render();

        $pdf = Browsershot::html($html)
            ->setIncludedPath(config('services.browsershot.included_path'))
            ->showBackground()
            ->pdf();

        Storage::put("public/$path", $pdf);

        return $stpd;

    }


    public function run(): void
    {
        $stpd = new STPD();

        $stpd->uuid = Str::uuid();
        $stpd->code = $this->generateCode();
        $stpd->lead_id = 1;
        $stpd->institution_name = "YAPSI Darul Amal";
        $stpd->institution_province = '{"id":"13","code":"33","name":"Jawa Tengah","meta":{"lat":"-7.150975","long":"110.1402594"},"created_at":"2024-06-19 09:25:41","updated_at":"2024-06-19 09:25:41"}';
        $stpd->institution_regency = '{"id":"189","code":"3302","province_code":"33","name":"Kabupaten Banyumas","meta":{"lat":"-7.4832133","long":"109.140438"},"created_at":"2024-06-19 09:25:41","updated_at":"2024-06-19 09:25:41"}';
        $stpd->departure_date = "2024-06-19";
        $stpd->return_date = "2024-06-25";
        $stpd->transportation = "Kereta Api";
        $stpd->accommodation = "Hotel";
        $stpd->signature_name = "Muh Arif Mahmudin";
        $stpd->signature_image = "/assets/img/signatures/ttd.png";
        $stpd->signature_position = "CEO";
        $stpd->created_by = 13;
        $employees = [
            [
                "user_id" => 6,
                "name" => "Kamil",
                "position" => "account executive"
            ],
            [
                "user_id" => 3,
                "name" => "Soep",
                "position" => "account executive"
            ],
            [
                "user_id" => 12,
                "name" => "Imam",
                "position" => "account executive"
            ],
        ];
        $stpd = $this->generateSTPD($stpd, $employees);
        $stpd->save();

        foreach ($employees as $employee) {
            STPDEmployees::create([
                "stpd_id" => $stpd->id,
                "user_id" => $employee['user_id'],
                "name" => $employee['name'],
                "position" => $employee['position']
            ]);
        }

    }
}
