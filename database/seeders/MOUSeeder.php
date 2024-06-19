<?php

namespace Database\Seeders;

use App\Models\MOU;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\Browsershot\Browsershot;

class MOUSeeder extends Seeder
{

    function intToRoman($number)
    {
        $map = array('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII');
        return $map[$number - 1];
    }

    public function generateCode()
    {
        $currentMonth = date('n');
        $currentYear = date('Y');

        $lastDataCurrentMonth = MOU::withTrashed()->whereYear('created_at', $currentYear)
            ->whereMonth('created_at', $currentMonth)
            ->latest()->first();

        if ($lastDataCurrentMonth == null) {
            $code = "0000";
        } else {
            $parts = explode("/", $lastDataCurrentMonth->code);
            $code = $parts[1];
        }
        $codeInteger = intval($code) + 1;
        $latestCode = str_pad($codeInteger, strlen($code), "0", STR_PAD_LEFT);
        $romanMonth = $this->intToRoman($currentMonth);
        $newCode = "MOU/$latestCode/$romanMonth/$currentYear";
        return $newCode;
    }

    public function generateMOU($mou)
    {
        try {
            $path = "mou/mou-" . $mou->uuid . ".pdf";

            $mou->mou_doc = "storage/$path";

            $html = view('pdf.mou', ["mou" => $mou])->render();

            $pdf = Browsershot::html($html)
                ->setIncludedPath(config('services.browsershot.included_path'))
                ->showBackground()
                ->headerHtml('<div></div>')
                ->footerHtml('<div style="text-align: right; font-style: italic; font-size: 10px; width:100%; margin-right: 2.5cm; margin-bottom: 1cm;">Perjanjian Kerjasama CAZH | <span class="pageNumber"></span>  </div>')
                ->showBrowserHeaderAndFooter()
                ->pdf();


            Storage::put("public/$path", $pdf);

            return $mou;

        } catch (\Exception $exception) {
            $this->report($exception);
        }
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $code = $this->generateCode();

        $mou = new MOU();
        $mou->uuid = Str::uuid();
        $mou->code = $code;
        $mou->day = "Senin";
        $mou->date = Carbon::parse("2024-04-01")->setTimezone('GMT+7')->format('Y-m-d H:i:s');
        $mou->lead_id = 1;
        $mou->partner_name = "YAPSI Darul Amal";
        $mou->partner_pic = "Ribhi Barka";
        $mou->partner_pic_position = "Guru";
        $mou->partner_pic_signature = "/assets/img/signatures/ttd_cto.png";
        $mou->partner_province = '{"id":"13","code":"33","name":"Jawa Tengah","meta":{"lat":"-7.150975","long":"110.1402594"},"created_at":"2024-06-18 11:14:12","updated_at":"2024-06-18 11:14:12"}';
        $mou->partner_regency = '{"id":"189","code":"3302","province_code":"33","name":"Kabupaten Banyumas","meta":{"lat":"-7.4832133","long":"109.140438"},"created_at":"2024-06-18 11:14:12","updated_at":"2024-06-18 11:14:12"}';
        $mou->url_subdomain = "yapsidarulamal@cazh.id";
        $mou->price_card = 25000;
        $mou->price_lanyard = 5000;
        $mou->price_subscription_system = 5000;
        $mou->period_subscription = "bulan";
        $mou->price_training_offline = 15000000;
        $mou->price_training_online = 500000;
        $mou->fee_qris = "3% dari nominal";
        $mou->fee_purchase_cazhpoin = 1000;
        $mou->fee_bill_cazhpoin = 1000;
        $mou->fee_topup_cazhpos = 2000;
        $mou->fee_withdraw_cazhpos = 2000;
        $mou->fee_bill_saldokartu = 1000;
        $mou->bank = "BRI";
        $mou->account_bank_number = "3111112245";
        $mou->account_bank_name = "Ribhi Barka";
        $mou->expired_date = Carbon::parse("2025-04-01")->setTimezone('GMT+7')->format('Y-m-d H:i:s');
        $mou->profit_sharing = false;
        $mou->profit_sharing_detail = null;
        $mou->created_by = 6;
        $mou->signature_name = "Muh Arif Mahmudin";
        $mou->signature_position = "CEO";
        $mou->signature_image = "/assets/img/signatures/ttd.png";

        $mou = $this->generateMOU($mou);
        $mou->save();


        $code = $this->generateCode();

        $mou = new MOU();
        $mou->uuid = Str::uuid();
        $mou->code = $code;
        $mou->day = "Senin";
        $mou->date = Carbon::parse("2024-04-01")->setTimezone('GMT+7')->format('Y-m-d H:i:s');
        $mou->lead_id = 2;
        $mou->partner_name = "Yayasan Daarul Quran Alkautsar, Cibinong Bogor";
        $mou->partner_pic = "Denal";
        $mou->partner_pic_position = "Admin";
        $mou->partner_pic_signature = "/assets/img/signatures/ttd_cto.png";
        $mou->partner_province = '{"id":"13","code":"33","name":"Jawa Tengah","meta":{"lat":"-7.150975","long":"110.1402594"},"created_at":"2024-06-18 11:14:12","updated_at":"2024-06-18 11:14:12"}';
        $mou->partner_regency = '{"id":"189","code":"3302","province_code":"33","name":"Kabupaten Banyumas","meta":{"lat":"-7.4832133","long":"109.140438"},"created_at":"2024-06-18 11:14:12","updated_at":"2024-06-18 11:14:12"}';
        $mou->url_subdomain = "darulalkautsar@cazh.id";
        $mou->price_card = 25000;
        $mou->price_lanyard = 5000;
        $mou->price_subscription_system = 5000;
        $mou->period_subscription = "bulan";
        $mou->price_training_offline = 15000000;
        $mou->price_training_online = 500000;
        $mou->fee_qris = "3% dari nominal";
        $mou->fee_purchase_cazhpoin = 1000;
        $mou->fee_bill_cazhpoin = 1000;
        $mou->fee_topup_cazhpos = 2000;
        $mou->fee_withdraw_cazhpos = 2000;
        $mou->fee_bill_saldokartu = 1000;
        $mou->bank = "BRI";
        $mou->account_bank_number = "3111112245";
        $mou->account_bank_name = "Denal";
        $mou->expired_date = Carbon::parse("2025-04-01")->setTimezone('GMT+7')->format('Y-m-d H:i:s');
        $mou->profit_sharing = false;
        $mou->profit_sharing_detail = null;
        $mou->created_by = 6;
        $mou->signature_name = "Muh Arif Mahmudin";
        $mou->signature_position = "CEO";
        $mou->signature_image = "/assets/img/signatures/ttd.png";

        $mou = $this->generateMOU($mou);
        $mou->save();


        $code = $this->generateCode();

        $mou = new MOU();
        $mou->uuid = Str::uuid();
        $mou->code = $code;
        $mou->day = "Senin";
        $mou->date = Carbon::parse("2024-04-01")->setTimezone('GMT+7')->format('Y-m-d H:i:s');
        $mou->lead_id = 3;
        $mou->partner_name = "PP Darul Falah, Subang";
        $mou->partner_pic = "Linawati";
        $mou->partner_pic_position = "Pengurus";
        $mou->partner_pic_signature = "/assets/img/signatures/ttd_cto.png";
        $mou->partner_province = '{"id":"13","code":"33","name":"Jawa Tengah","meta":{"lat":"-7.150975","long":"110.1402594"},"created_at":"2024-06-18 11:14:12","updated_at":"2024-06-18 11:14:12"}';
        $mou->partner_regency = '{"id":"189","code":"3302","province_code":"33","name":"Kabupaten Banyumas","meta":{"lat":"-7.4832133","long":"109.140438"},"created_at":"2024-06-18 11:14:12","updated_at":"2024-06-18 11:14:12"}';
        $mou->url_subdomain = "darulfalah@cazh.id";
        $mou->price_card = 25000;
        $mou->price_lanyard = 5000;
        $mou->price_subscription_system = 5000;
        $mou->period_subscription = "bulan";
        $mou->price_training_offline = 15000000;
        $mou->price_training_online = 500000;
        $mou->fee_qris = "3% dari nominal";
        $mou->fee_purchase_cazhpoin = 1000;
        $mou->fee_bill_cazhpoin = 1000;
        $mou->fee_topup_cazhpos = 2000;
        $mou->fee_withdraw_cazhpos = 2000;
        $mou->fee_bill_saldokartu = 1000;
        $mou->bank = "BRI";
        $mou->account_bank_number = "3111112245";
        $mou->account_bank_name = "Linawati";
        $mou->expired_date = Carbon::parse("2025-04-01")->setTimezone('GMT+7')->format('Y-m-d H:i:s');
        $mou->profit_sharing = false;
        $mou->profit_sharing_detail = null;
        $mou->created_by = 6;
        $mou->signature_name = "Muh Arif Mahmudin";
        $mou->signature_position = "CEO";
        $mou->signature_image = "/assets/img/signatures/ttd.png";

        $mou = $this->generateMOU($mou);
        $mou->save();
    }
}
