<?php

namespace App\Imports;

use App\Http\Controllers\RegionController;
use App\Models\Partner;
use App\Models\PartnerPIC;
use App\Models\Status;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class PartnerImport implements ToCollection, WithValidation, SkipsEmptyRows, WithStartRow, WithHeadingRow, WithCalculatedFormulas, WithBatchInserts, WithChunkReading
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */

    private $regionController;
    private $partner;
    private $sales;
    private $account_managers;
    private $status;
    private $provinsi;
    private $kabupaten;


    public function __construct()
    {
        $this->regionController = new RegionController;
        $this->sales = User::role('account executive')->get();
        $this->account_managers = User::role('account manager')->get();
        $this->status = collect(Status::where('category', 'partner')->get(['id', 'name']));
        $this->provinsi = $this->regionController->provinces();
        $this->kabupaten = $this->regionController->regencys();
    }

    public function rules(): array
    {
        return [

            'nama_partner' => [
                'required',
            ],
            'nomor_telepon_lembaga' => [
                'required',
            ],
            'kabkota' => [
                'required',
            ],
            'provinsi' => [
                'required',
            ],
            'status' => [
                'required',
            ],
            'pic_partner' => [
                'required',
            ],
        ];
    }

    public function startRow(): int
    {
        return 2;
    }

    public function batchSize(): int
    {
        return 300;
    }

    public function chunkSize(): int
    {
        return 300;
    }

    function calculateOnboardingAge($liveDate, $onboardingDate)
    {
        if ($liveDate == 0) {
            return 0;
        }
        $onboardingAge = abs(ceil((strtotime($onboardingDate)) - strtotime($liveDate)) / (60 * 60 * 24));
        return $onboardingAge;
    }

    function calculateLiveAge($liveDate)
    {
        if ($liveDate == 0) {
            return 0;
        }
        $liveAge = abs(ceil((strtotime($liveDate) - strtotime(date("Y-m-d"))) / (60 * 60 * 24)));
        return $liveAge;
    }

    public static function partnerNameToEmail($string)
    {
        // Ambil substring sebelum koma
        $string = explode(',', $string)[0];

        // Hilangkan karakter selain huruf, angka, dan spasi
        $string = preg_replace('/[^A-Za-z0-9\s]/', '', $string);

        // Ganti spasi dengan underscore
        $string = str_replace(' ', '_', $string);

        // Ubah ke huruf kecil
        $string = strtolower($string);

        return $string;
    }


    public function collection(Collection $rows)
    {
        foreach ($rows as $key => $row) {

            $partnerExist = Partner::where('name', 'like', '%' . $row["nama_partner"] . '%')->first();
            if ($partnerExist) {
                continue;
            }

            $sales = User::where('name', $row['sales'])->first();
            $account_manager = User::where('name', $row['after_sales'])->first();

            $regency = $this->kabupaten->filter(function ($kabupaten) use ($row) {
                if ($row['kabkota'] === 'Kab. OKU Timur') {
                    $row['kabkota'] = 'KAB. OGAN KOMERING ULU TIMUR';
                } else if ($row['kabkota'] === 'Kab. Kep. Meranti') {
                    $row['kabkota'] = 'KAB. KEPULAUAN MERANTI';
                } else if ($row['kabkota'] == 'Kota Bintan') {
                    $row['kabkota'] = 'Kab. Bintan';
                } else if ($row['kabkota'] == 'Kec. Kebumen') {
                    $row['kabkota'] = 'Kab. Kebumen';
                } else if ($row['kabkota'] == 'Kab. Batubara') {
                    $row['kabkota'] = 'Kab. Batu Bara';
                }


                if (preg_match("/kab\.\s/i", $row['kabkota'])) {
                    $row['kabkota'] = strtolower(preg_replace("/\bkab\.\s*\b/i", "", $row['kabkota']));
                }
                if (preg_match("/kec\.\s/i", $row['kabkota'])) {
                    $row['kabkota'] = strtolower(preg_replace("/\bkec\.\s*\b/i", "", $row['kabkota']));
                }


                return str_contains(str_replace(' ', '', strtolower($kabupaten->name)), str_replace(' ', '', strtolower($row['kabkota'])));
            });

            $province = $this->provinsi->filter(function ($provinsi) use ($row) {
                if ($row['provinsi'] == 'NTB') {
                    $row['provinsi'] = 'Nusa Tenggara Barat';
                } else if ($row['provinsi'] == 'DI Yogyakarta') {
                    $row['provinsi'] = 'DAERAH ISTIMEWA YOGYAKARTA';
                }
                return stripos(str_replace(' ', '', $provinsi), str_replace(' ', '', $row['provinsi'])) !== false;
            });


            $status = $this->status->filter(function ($status) use ($row) {
                return strtolower($row['status']) === strtolower($status['name']);
            });

            $province = collect($province->first());
            $regency = collect($regency->first());

            $tanggal_live = $row["tanggal_live"] ? Carbon::parse(Date::excelToDateTimeObject($row["tanggal_live"]))->format('Y-m-d H:i:s') : null;
            $tanggal_onboarding = $row["tanggal_onboarding"] ? Carbon::parse(Date::excelToDateTimeObject($row["tanggal_onboarding"]))->format('Y-m-d H:i:s') : null;
            $user = User::create([
                'name' => $row['nama_partner'],
                'email' => $this->partnerNameToEmail($row['nama_partner']) . '@cazh.id',
                'number' => $row['nomor_telepon_lembaga'],
                'password' => Hash::make('partner123')
            ]);
            $user->assignRole('partner');
            $partner = Partner::create([
                'uuid' => Str::uuid(),
                'user_id' => $user->id,
                'name' => $row["nama_partner"],
                'phone_number' => $row["nomor_telepon_lembaga"],
                'npwp' => $row['npwp'],
                'sales_id' => $sales ? $sales->id : null,
                'account_manager_id' => $account_manager ? $account_manager->id : null,
                'password' => $row['password'],
                'onboarding_date' => $tanggal_onboarding,
                'live_date' => $tanggal_live,
                'onboarding_age' => $this->calculateOnboardingAge($tanggal_live, $tanggal_onboarding),
                'live_age' => $this->calculateLiveAge($tanggal_live),
                'monitoring_date_after_3_month_live' => $row["tanggal_monitoring_3_bulan_after_live"] ? Carbon::parse(Date::excelToDateTimeObject($row["tanggal_monitoring_3_bulan_after_live"]))->format('Y-m-d H:i:s') : null,
                'regency' => $regency,
                'province' => $province,
                'status_id' => $status->first()->id,
                'created_by' => Auth::user()->id
            ]);

            PartnerPIC::create(['uuid' => Str::uuid(), 'partner_id' => $partner->id, 'name' => $row["pic_partner"], 'number' => $row["no_hp_pic_partner"] ?? null, 'created_by' => Auth::user()->id]);

        }
    }
}
