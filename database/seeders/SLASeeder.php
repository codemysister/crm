<?php

namespace Database\Seeders;

use App\Models\SLA;
use App\Models\SlaActivity;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\Browsershot\Browsershot;

class SLASeeder extends Seeder
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


        $lastDataCurrentMonth = SLA::withTrashed()->whereYear('created_at', $currentYear)
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

        $romanMonth = $this->intToRoman($currentMonth);
        $newCode = "SLA/$latestCode/$romanMonth/$currentYear";

        return $newCode;
    }

    public function generateSla($sla, $activities)
    {
        $path = "sla/sla-" . $sla->uuid . ".pdf";

        $sla->sla_doc = "storage/$path";

        $html = view('pdf.sla', ["sla" => $sla, 'activities' => $activities])->render();

        $pdf = Browsershot::html($html)
            ->setIncludedPath(config('services.browsershot.included_path'))
            ->showBackground()
            ->pdf();

        Storage::put("public/$path", $pdf);

        return $sla;
    }

    public function run(): void
    {
        $code = $this->generateCode();

        $sla = new SLA();
        $sla->uuid = Str::uuid();
        $sla->code = $code;
        $sla->logo = "/assets/img/logo/sla_logo.png";
        $sla->partner_id = 2;
        $sla->partner_name = "PP Fathul Ulum, Pekalongan";
        $sla->partner_province = '{"id":"13","code":"33","name":"JAWA TENGAH","meta":{"lat":"-7.150975","long":"110.1402594"},"created_at":"2024-06-19 00:06:10","updated_at":"2024-06-19 00:06:10"}';
        $sla->partner_regency = '{"id":"213","code":"3326","province_code":"33","name":"KABUPATEN PEKALONGAN","meta":{"lat":"-7.0517128","long":"109.6163185"},"created_at":"2024-06-19 00:06:10","updated_at":"2024-06-19 00:06:10"}';
        $sla->partner_phone_number = "85182951124";
        $sla->partner_pic = "M. Baitul ilmi";
        $sla->partner_pic_email = "ilmi@gmail.com";
        $sla->partner_pic_number = "085211641461";
        $sla->partner_pic_signature = "/assets/img/signatures/ttd_cto.png";
        $sla->created_by = 6;
        $sla->signature_name = "Kamil";
        $sla->signature_image = "/assets/img/signatures/ttd.png";
        $activities = [
            [
                "sla_id" => 1,
                "user_id" => 6,
                "cazh_pic" => "Kamil",
                "activity" => "Pembuatan WA Group Sales-lead",
                "duration" => "1 hari",
                "estimation_date" => "2024-06-19",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 6,
                "cazh_pic" => "Kamil",
                "activity" => "Perjanjian Kerja Sama",
                "duration" => "1 - 3 hari",
                "estimation_date" => "2024-06-20",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 6,
                "cazh_pic" => "Kamil",
                "activity" => "Pengumpulan Data (data siswa, foto siswa)",
                "duration" => "1 - 3 hari",
                "estimation_date" => "2024-06-20",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 6,
                "cazh_pic" => "Kamil",
                "activity" => "Pembuatan dan Pengiriman Invoice",
                "duration" => "1 - 5 hari",
                "estimation_date" => "2024-06-20",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 6,
                "cazh_pic" => "Kamil",
                "activity" => "Pembayaran invoice",
                "duration" => "1 - 5 hari",
                "estimation_date" => "2024-06-21",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 6,
                "cazh_pic" => "Kamil",
                "activity" => "Pendaftaran partner",
                "duration" => "1 hari",
                "estimation_date" => "2024-06-20",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 11,
                "cazh_pic" => "Dita",
                "activity" => "Persiapan Sistem",
                "duration" => "1 hari",
                "estimation_date" => "2024-06-20",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 11,
                "cazh_pic" => "Dita",
                "activity" => "Introduction Meeting AM",
                "duration" => "1 hari",
                "estimation_date" => "2024-06-20",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 14,
                "cazh_pic" => "Febrian",
                "activity" => "Desain Kartu (versi digital dan cetak)",
                "duration" => "3 hari",
                "estimation_date" => "2024-06-23",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 14,
                "cazh_pic" => "Febrian",
                "activity" => "Cetak Kartu (jika dicetak)",
                "duration" => "4 hari",
                "estimation_date" => "2024-06-27",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 14,
                "cazh_pic" => "Febrian",
                "activity" => "Pengiriman kartu dan device (bila ada)",
                "duration" => "7 hari",
                "estimation_date" => "2024-07-04",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 11,
                "cazh_pic" => "Dita",
                "activity" => "Training Cazh School App (Staf Admin/Keu)",
                "duration" => "1 hari",
                "estimation_date" => "2024-07-11",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 11,
                "cazh_pic" => "Dita",
                "activity" => "Training CARDS Kartu Digital (Staf Admin/Keu)",
                "duration" => "1 hari",
                "estimation_date" => "2024-07-12",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 11,
                "cazh_pic" => "Dita",
                "activity" => "Training CazhPOS dan CPA (Kasir/Manager)",
                "duration" => "1 hari",
                "estimation_date" => "2024-07-13",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 11,
                "cazh_pic" => "Dita",
                "activity" => "Sosialisasi User (Orang Tua/Wali) - optional*",
                "duration" => "1 hari",
                "estimation_date" => "2024-07-14",
                "realization_date" => null
            ],
        ];
        $sla = $this->generateSla($sla, $activities);
        $sla->save();

        foreach ($activities as $activity) {
            SlaActivity::create([
                "sla_id" => $sla->id,
                "uuid" => Str::uuid(),
                "activity" => $activity['activity'],
                "cazh_pic" => $activity['cazh_pic'],
                "duration" => $activity['duration'],
                "estimation_date" => $activity['estimation_date'],
                "user_id" => $activity['user_id'],
            ]);
        }



        $code = $this->generateCode();

        $sla = new SLA();
        $sla->uuid = Str::uuid();
        $sla->code = $code;
        $sla->logo = "/assets/img/logo/sla_logo.png";
        $sla->partner_id = 13;
        $sla->partner_name = "PP Fathul Ulum, Pekalongan";
        $sla->partner_province = '{"id":"13","code":"33","name":"JAWA TENGAH","meta":{"lat":"-7.150975","long":"110.1402594"},"created_at":"2024-06-19 02:21:32","updated_at":"2024-06-19 02:21:32"}';
        $sla->partner_regency = '{"id":"189","code":"3302","province_code":"33","name":"KABUPATEN BANYUMAS","meta":{"lat":"-7.4832133","long":"109.140438"},"created_at":"2024-06-19 02:21:32","updated_at":"2024-06-19 02:21:32"}';
        $sla->partner_phone_number = "85182951124";
        $sla->partner_pic = "Ustadz Muhidin";
        $sla->partner_pic_email = "muhidin@gmail.com";
        $sla->partner_pic_number = "085211641461";
        $sla->partner_pic_signature = "/assets/img/signatures/ttd_cto.png";
        $sla->created_by = 6;
        $sla->signature_name = "Kamil";
        $sla->signature_image = "/assets/img/signatures/ttd.png";
        $activities = [
            [
                "sla_id" => 1,
                "user_id" => 6,
                "cazh_pic" => "Kamil",
                "activity" => "Pembuatan WA Group Sales-lead",
                "duration" => "1 hari",
                "estimation_date" => "2024-06-19",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 6,
                "cazh_pic" => "Kamil",
                "activity" => "Perjanjian Kerja Sama",
                "duration" => "1 - 3 hari",
                "estimation_date" => "2024-06-20",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 6,
                "cazh_pic" => "Kamil",
                "activity" => "Pengumpulan Data (data siswa, foto siswa)",
                "duration" => "1 - 3 hari",
                "estimation_date" => "2024-06-20",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 6,
                "cazh_pic" => "Kamil",
                "activity" => "Pembuatan dan Pengiriman Invoice",
                "duration" => "1 - 5 hari",
                "estimation_date" => "2024-06-20",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 6,
                "cazh_pic" => "Kamil",
                "activity" => "Pembayaran invoice",
                "duration" => "1 - 5 hari",
                "estimation_date" => "2024-06-21",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 6,
                "cazh_pic" => "Kamil",
                "activity" => "Pendaftaran partner",
                "duration" => "1 hari",
                "estimation_date" => "2024-06-20",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 11,
                "cazh_pic" => "Dita",
                "activity" => "Persiapan Sistem",
                "duration" => "1 hari",
                "estimation_date" => "2024-06-20",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 11,
                "cazh_pic" => "Dita",
                "activity" => "Introduction Meeting AM",
                "duration" => "1 hari",
                "estimation_date" => "2024-06-20",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 14,
                "cazh_pic" => "Febrian",
                "activity" => "Desain Kartu (versi digital dan cetak)",
                "duration" => "3 hari",
                "estimation_date" => "2024-06-23",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 14,
                "cazh_pic" => "Febrian",
                "activity" => "Cetak Kartu (jika dicetak)",
                "duration" => "4 hari",
                "estimation_date" => "2024-06-27",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 14,
                "cazh_pic" => "Febrian",
                "activity" => "Pengiriman kartu dan device (bila ada)",
                "duration" => "7 hari",
                "estimation_date" => "2024-07-04",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 11,
                "cazh_pic" => "Dita",
                "activity" => "Training Cazh School App (Staf Admin/Keu)",
                "duration" => "1 hari",
                "estimation_date" => "2024-07-11",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 11,
                "cazh_pic" => "Dita",
                "activity" => "Training CARDS Kartu Digital (Staf Admin/Keu)",
                "duration" => "1 hari",
                "estimation_date" => "2024-07-12",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 11,
                "cazh_pic" => "Dita",
                "activity" => "Training CazhPOS dan CPA (Kasir/Manager)",
                "duration" => "1 hari",
                "estimation_date" => "2024-07-13",
                "realization_date" => null
            ],
            [
                "sla_id" => 1,
                "user_id" => 11,
                "cazh_pic" => "Dita",
                "activity" => "Sosialisasi User (Orang Tua/Wali) - optional*",
                "duration" => "1 hari",
                "estimation_date" => "2024-07-14",
                "realization_date" => null
            ],
        ];
        $sla = $this->generateSla($sla, $activities);
        $sla->save();

        foreach ($activities as $activity) {
            SlaActivity::create([
                "sla_id" => $sla->id,
                "uuid" => Str::uuid(),
                "activity" => $activity['activity'],
                "cazh_pic" => $activity['cazh_pic'],
                "duration" => $activity['duration'],
                "estimation_date" => $activity['estimation_date'],
                "user_id" => $activity['user_id'],
            ]);
        }
    }
}
