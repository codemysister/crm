<?php

namespace Database\Seeders;

use App\Http\Controllers\RegionController;
use App\Models\Partner;
use App\Models\PartnerAccountSetting;
use App\Models\PartnerBank;
use App\Models\PartnerPIC;
use App\Models\PartnerPriceList;
use App\Models\PartnerSubscription;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PartnerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */


    private $regionController;

    private $provinsi;
    private $kabupaten;

    public function __construct()
    {
        $this->regionController = new RegionController;
        $this->provinsi = $this->regionController->provinces();
        $this->kabupaten = $this->regionController->regencys();
    }

    public function rangeBetweenDate($firstDate, $secondDate)
    {
        $firstDate = Carbon::create($firstDate);
        $secondDate = Carbon::create($secondDate);

        $diffInDays = $firstDate->diffInDays($secondDate);

        return $diffInDays;
    }

    public static function partnerNameToEmail($string)
    {

        // Hilangkan karakter selain huruf, angka, dan spasi
        $string = preg_replace('/[^A-Za-z0-9\s]/', '', $string);

        // Ganti spasi dengan underscore
        $string = str_replace(' ', '_', $string);

        // Ubah ke huruf kecil
        $string = strtolower($string);

        return $string;
    }

    public function run(): void
    {
        $partners = [
            [
                'onboarding_date' => '2021-11-15',
                'live_date' => '2022-01-14',
                'monitoring_date_after_3_month_live' => '2022-04-14',
                'name' => "PPTQ YAPID At-Taubah, Polewali Mandar",
                'npwp' => "67.890.123.9-234.567",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Polewali Mandar",
                'province' => "Sulawesi Barat",
                'status_id' => 2, // NON AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Nurul Burhan",
                'pic_phone_number' => "082324070501",
            ],
            [
                'onboarding_date' => '2021-11-15',
                'live_date' => '2022-03-15',
                'monitoring_date_after_3_month_live' => '2022-06-13',
                'name' => "PP Fathul Ulum, Pekalongan",
                'npwp' => "78.901.234.9-345.678",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Pekalongan",
                'province' => "Jawa Tengah",
                'status_id' => 1, // AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "M. Baitul ilmi",
                'pic_phone_number' => "085211641461",
            ],
            [
                'onboarding_date' => '2021-11-15',
                'live_date' => '2022-03-14',
                'monitoring_date_after_3_month_live' => '2022-06-14',
                'name' => "PP YHM Bina Insan Madani, Sukabumi",
                'npwp' => "89.012.345.9-456.789",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Sukabumi",
                'province' => "Jawa Barat",
                'status_id' => 1, // AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Kyai Luthfi",
                'pic_phone_number' => "628996433333",
            ],
            [
                'onboarding_date' => '2021-11-26',
                'live_date' => '2022-02-06',
                'monitoring_date_after_3_month_live' => '2022-05-07',
                'name' => "PP Darurridwan, Banyuwangi",
                'npwp' => "90.123.456.9-567.890",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Banyuwangi",
                'province' => "Jawa Timur",
                'status_id' => 1, // AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "KH. Ahmad Abdul Ghofur Al-Masyhad",
                'pic_phone_number' => "62812257906990",
            ],
            [
                'onboarding_date' => '2021-11-26',
                'live_date' => '2022-03-02',
                'monitoring_date_after_3_month_live' => '2022-05-31',
                'name' => "PP El Jasmeen, Malang",
                'npwp' => "01.234.567.9-678.901",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Malang",
                'province' => "Jawa Timur",
                'status_id' => 1, // AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Didin",
                'pic_phone_number' => "6283156969123",
            ],
            [
                'onboarding_date' => '2021-11-26',
                'live_date' => '2022-03-16',
                'monitoring_date_after_3_month_live' => '2022-06-14',
                'name' => "PP Sunan Giri Al Bajury",
                'npwp' => "12.345.678.9-789.012",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Sarolangun",
                'province' => "Jambi",
                'status_id' => 1, // AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Syaidun",
                'pic_phone_number' => "081325325545",
            ],
            [
                'onboarding_date' => '2021-12-13',
                'live_date' => '2022-02-21',
                'monitoring_date_after_3_month_live' => '2022-05-22',
                'name' => "PP Nurul Huda 2, OKU Timur, Sumsel",
                'npwp' => "23.456.789.9-890.123",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. OKU Timur",
                'province' => "Sumatera Selatan",
                'status_id' => 2, // NON AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Admin",
                'pic_phone_number' => "6282225348894",
            ],
            [
                'onboarding_date' => '2021-12-13',
                'live_date' => '2022-02-21',
                'monitoring_date_after_3_month_live' => '2022-05-22',
                'name' => "PPTQ Al-Hidayah, Subang",
                'npwp' => "34.567.890.9-901.234",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Subang",
                'province' => "Jawa Barat",
                'status_id' => 2, // NON AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Nasoh",
                'pic_phone_number' => "6285229963126",
            ],
            [
                'onboarding_date' => '2021-12-20',
                'live_date' => '2022-02-28',
                'monitoring_date_after_3_month_live' => '2022-05-29',
                'name' => "Ma'had Aisyah Binti Abu Bakar, Malang",
                'npwp' => "45.678.901.9-012.345",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => 'Kab. Malang',
                'province' => "Jawa Timur",
                'status_id' => 2, // NON AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Laelatul Janah",
                'pic_phone_number' => "6281931805761",
            ],
            [
                'onboarding_date' => '2021-12-27',
                'live_date' => '2022-03-07',
                'monitoring_date_after_3_month_live' => '2022-06-05',
                'name' => "Tahfizh Azhar Centre, Labuhanbatu Utara",
                'npwp' => "56.789.012.9-123.456",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Labuhan Batu Utara",
                'province' => "Sumatera Utara",
                'status_id' => 2, // NON AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Usman",
                'pic_phone_number' => "6285747541662",
            ],
            [
                'onboarding_date' => '2022-01-21',
                'live_date' => '2022-04-01',
                'monitoring_date_after_3_month_live' => '2022-06-30',
                'name' => "Yayasan Darussholihin, Sleman D.I.Y",
                'npwp' => "67.890.123.9-789.012",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Sleman",
                'province' => "DI Yogyakarta",
                'status_id' => 2, // NON AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Mukhlis",
                'pic_phone_number' => "6285846904118",
            ],
            [
                'onboarding_date' => '2022-01-21',
                'live_date' => '2022-04-01',
                'monitoring_date_after_3_month_live' => '2022-06-30',
                'name' => "Dayah Perbatasan Darul Amin, Aceh Tenggara",
                'npwp' => "78.901.234.9-890.123",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Aceh Tenggara",
                'province' => "Aceh",
                'status_id' => 2, // NON AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Titin Maslihah",
                'pic_phone_number' => "085336517408",
            ],
            [
                'onboarding_date' => '2022-02-02',
                'live_date' => '2022-04-13',
                'monitoring_date_after_3_month_live' => '2022-07-12',
                'name' => "BRIMAS, Banyumas",
                'npwp' => "89.012.345.9-901.234",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Banyumas",
                'province' => "Jawa Tengah",
                'status_id' => 2, // NON AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Ustadz Muhidin",
                'pic_phone_number' => "089652250908",
            ],
            [
                'onboarding_date' => '2022-02-25',
                'live_date' => '2022-05-06',
                'monitoring_date_after_3_month_live' => '2022-08-04',
                'name' => "PP Ishlahul Aulad, Kab. Banjar, Kalsel",
                'npwp' => "90.123.456.9-012.345",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Banjar",
                'province' => "Kalimantan Selatan",
                'status_id' => 2, // NON AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Ritongua Mountai",
                'pic_phone_number' => "082217707398",
            ],
            [
                'onboarding_date' => '2022-02-25',
                'live_date' => '2022-05-06',
                'monitoring_date_after_3_month_live' => '2022-08-04',
                'name' => "PP Darul Mubarokah, Lampung Selatan",
                'npwp' => "01.234.567.9-123.456",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Lampung Selatan",
                'province' => "Lampung",
                'status_id' => 2, // NON AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Anis Fatkhurrohman",
                'pic_phone_number' => "6285184861411",
            ],
            [
                'onboarding_date' => '2022-02-25',
                'live_date' => '2022-05-06',
                'monitoring_date_after_3_month_live' => '2022-08-04',
                'name' => "Ma'had Al Qur'an Wal Lughah (MQL) Bogor",
                'npwp' => "12.345.678.9-234.567",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Bogor",
                'province' => "Jawa Barat",
                'status_id' => 2, // NON AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Rudi",
                'pic_phone_number' => "6285694214476",
            ],
            [
                'onboarding_date' => '2022-02-25',
                'live_date' => '2022-05-06',
                'monitoring_date_after_3_month_live' => '2022-08-04',
                'name' => "PP Roudlotus Sholihin, Lampung Barat",
                'npwp' => "23.456.789.9-345.678",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Lampung Tengah",
                'province' => "Lampung",
                'status_id' => 2, // NON AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Fatimah",
                'pic_phone_number' => "6281284365759",
            ],
            [
                'onboarding_date' => '2022-02-25',
                'live_date' => '2022-05-26',
                'monitoring_date_after_3_month_live' => '2022-08-24',
                'name' => "PP Nurul Jadid, Duripoku Pasangkayu",
                'npwp' => "34.567.890.9-456.789",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Pasangkayu",
                'province' => "Sulawesi Barat",
                'status_id' => 1, // AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Indra",
                'pic_phone_number' => "6281347602171",
            ],
            [
                'onboarding_date' => '2022-03-07',
                'live_date' => '2022-06-05',
                'monitoring_date_after_3_month_live' => '2022-09-03',
                'name' => 'PP Al-Inaaroh, Batang',
                'npwp' => "45.678.901.9-567.890",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Batang",
                'province' => "Jawa Tengah",
                'status_id' => 1, // AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Umi",
                'pic_phone_number' => "6281363007860",
            ],
            [
                'onboarding_date' => '2022-03-07',
                'live_date' => '2022-05-06',
                'monitoring_date_after_3_month_live' => '2022-08-04',
                'name' => "PP Roudlotul Maghfurin, Halmahera Timur",
                'npwp' => "56.789.012.9-678.901",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Halmahera Timur",
                'province' => "Maluku Utara",
                'status_id' => 2, // NON AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Siti",
                'pic_phone_number' => "6282351094297",
            ],
            [
                'onboarding_date' => '2022-03-25',
                'live_date' => '2022-07-13',
                'monitoring_date_after_3_month_live' => '2022-10-11',
                'name' => "SMP IT Al-Marwat, Cirebon",
                'npwp' => "67.890.123.9-901.234",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Cirebon",
                'province' => "Jawa Barat",
                'status_id' => 1, // AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Ridwan",
                'pic_phone_number' => "6285807044165",
            ],
            [
                'onboarding_date' => '2022-03-28',
                'live_date' => '2022-07-26',
                'monitoring_date_after_3_month_live' => '2022-10-24',
                'name' => "PP Assalam, Kradenan Grobogan",
                'npwp' => "78.901.234.9-012.345",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Grobogan",
                'province' => "Jawa Tengah",
                'status_id' => 2, // NON AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Ruslan",
                'pic_phone_number' => "6285883120566",
            ],
            [
                'onboarding_date' => '2022-03-28',
                'live_date' => '2022-06-26',
                'monitoring_date_after_3_month_live' => '2022-09-24',
                'name' => "PP Miftahul Manan, Bumiayu Brebes",
                'npwp' => "89.012.345.9-123.456",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Brebes",
                'province' => "Jawa Tengah",
                'status_id' => 2, // NON AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Sulis",
                'pic_phone_number' => "6285899469487",
            ],
            [
                'onboarding_date' => '2022-03-28',
                'live_date' => '2022-10-03',
                'monitoring_date_after_3_month_live' => '2023-01-01',
                'name' => "PP Al-Bukhori, Tanjung Brebes",
                'npwp' => "90.123.456.9-234.567",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Brebes",
                'province' => "Jawa Tengah",
                'status_id' => 2, // NON AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Fitri",
                'pic_phone_number' => "6285720518919",
            ],
            [
                'onboarding_date' => '2022-04-20',
                'live_date' => '2022-07-19',
                'monitoring_date_after_3_month_live' => '2022-08-24',
                'name' => "SD Muhammadiyah Kemantran, Tegal",
                'npwp' => "01.234.567.9-345.678",
                'password' => "partner123",
                'phone_number' => "85182951124",
                'regency' => "Kab. Tegal",
                'province' => "Jawa Tengah",
                'status_id' => 1, // AKTIF
                'sales_id' => 6,
                'account_manager_id' => 11,
                'pic' => "Lina",
                'pic_phone_number' => "6281378923341",
            ],
        ];


        foreach ($partners as $partner) {
            $regency = $this->kabupaten->filter(function ($kabupaten) use ($partner) {
                if ($partner['regency'] === 'Kab. OKU Timur') {
                    $partner['regency'] = 'KAB. OGAN KOMERING ULU TIMUR';
                } else if ($partner['regency'] === 'Kab. Kep. Meranti') {
                    $partner['regency'] = 'KAB. KEPULAUAN MERANTI';
                } else if ($partner['regency'] == 'Kota Bintan') {
                    $partner['regency'] = 'Kab. Bintan';
                } else if ($partner['regency'] == 'Kec. Kebumen') {
                    $partner['regency'] = 'Kab. Kebumen';
                } else if ($partner['regency'] == 'Kab. Batubara') {
                    $partner['regency'] = 'Kab. Batu Bara';
                }


                if (preg_match("/kab\.\s/i", $partner['regency'])) {
                    $partner['regency'] = strtolower(preg_replace("/\bkab\.\s*\b/i", "", $partner['regency']));
                }
                if (preg_match("/kec\.\s/i", $partner['regency'])) {
                    $partner['regency'] = strtolower(preg_replace("/\bkec\.\s*\b/i", "", $partner['regency']));
                }


                return str_contains(str_replace(' ', '', strtolower($kabupaten->name)), str_replace(' ', '', strtolower($partner['regency'])));
            });

            $province = $this->provinsi->filter(function ($provinsi) use ($partner) {
                if ($partner['province'] == 'NTB') {
                    $partner['province'] = 'Nusa Tenggara Barat';
                } else if ($partner['province'] == 'DI Yogyakarta') {
                    $partner['province'] = 'DAERAH ISTIMEWA YOGYAKARTA';
                }
                return stripos(str_replace(' ', '', $provinsi), str_replace(' ', '', $partner['province'])) !== false;
            });

            $province = collect($province->first());
            $regency = collect($regency->first());

            $partnerCreated = Partner::create([
                'uuid' => Str::uuid(),
                'onboarding_date' => Carbon::parse($partner['onboarding_date']),
                'live_date' => Carbon::parse($partner['live_date']),
                'monitoring_date_after_3_month_live' => Carbon::parse($partner['monitoring_date_after_3_month_live']),
                'onboarding_age' => $this->rangeBetweenDate($partner['onboarding_date'], $partner['live_date']),
                'live_age' => $this->rangeBetweenDate($partner['live_date'], now()),
                'name' => $partner['name'],
                'npwp' => $partner['npwp'],
                'password' => $partner['password'],
                'phone_number' => $partner['phone_number'],
                'total_members' => 500,
                'regency' => $regency,
                'province' => $province,
                'status_id' => $partner['status_id'],
                'sales_id' => $partner['sales_id'],
                'account_manager_id' => $partner['account_manager_id'],
                'period' => 'bulan',
                'billing_date' => rand(1, 31),
                'created_by' => 13,
            ]);

            // PIC
            PartnerPIC::create([
                'uuid' => Str::uuid(),
                'partner_id' => $partnerCreated->id,
                'name' => $partner['pic'],
                'number' => $partner['pic_phone_number'],
                'created_by' => 13
            ]);

            // Bank
            PartnerBank::create([
                'uuid' => Str::uuid(),
                'partner_id' => $partnerCreated->id,
                'bank' => "BRI",
                'account_bank_number' => "31112324" . rand(1, 9999),
                'account_bank_name' => $partner['pic'],
                'created_by' => 13
            ]);

            // Akun
            PartnerAccountSetting::create([
                'uuid' => Str::uuid(),
                'partner_id' => $partnerCreated->id,
                'subdomain' => $this->partnerNameToEmail($partner['name']) . '@cazh.id',
                'email_super_admin' => $this->partnerNameToEmail($partner['name']) . '@mail.cazh.id',
                'password' => 'partner123',
                'created_by' => 13
            ]);

            // Tarif
            PartnerPriceList::create([
                'uuid' => Str::uuid(),
                'partner_id' => $partnerCreated->id,
                'price_card' => json_encode([
                    'price' => 15000,
                    'type' => 'cetak',
                ]),
                'price_lanyard' => 7500,
                'price_subscription_system' => 15000,
                'price_training_offline' => 25000000,
                'price_training_online' => 2500000,
                'fee_qris' => "3% dari nominal",
                'fee_purchase_cazhpoin' => 2500,
                'fee_bill_cazhpoin' => 2500,
                'fee_topup_cazhpos' => 2500,
                'fee_withdraw_cazhpos' => 2500,
                'fee_bill_saldokartu' => 2500,
                'created_by' => 13
            ]);

            PartnerSubscription::create([
                'uuid' => Str::uuid(),
                'partner_id' => $partnerCreated->id,
                'bill' => "Tagihan bulan",
                'nominal' => 500000,
                'total_ppn' => 50000,
                'ppn' => 10,
                'total_bill' => 550000,
                'created_by' => 13
            ]);

        }
    }
}
