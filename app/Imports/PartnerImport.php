<?php

namespace App\Imports;

use App\Models\Partner;
use App\Models\PartnerAccountSetting;
use App\Models\PartnerBank;
use App\Models\PartnerPIC;
use App\Models\PartnerSubscription;
use App\Models\Status;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\PersistRelations;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Row;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class PartnerImport implements ToCollection, WithValidation, SkipsEmptyRows, WithStartRow, WithHeadingRow, WithCalculatedFormulas, WithBatchInserts, WithChunkReading
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */

    private $partner;
    private $sales;
    private $account_managers;
    private $status;
    private $provinsi;
    private $kabupaten;


    public function __construct()
    {
        $this->sales = User::role('account executive')->get();
        $this->account_managers = User::role('account manager')->get();
        $this->status = collect(Status::where('category', 'partner')->get(['id', 'name']));
        $this->provinsi = collect($this->provinsi());
        $this->kabupaten = collect($this->kabupaten());
    }

    public function rules(): array
    {
        return [

            'nama_partner' => [
                'required',
            ],
            'npwp' => [
                'required',
            ],
            'password' => [
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

    public function provinsi()
    {
        $url = "https://sipedas.pertanian.go.id/api/wilayah/list_wilayah?thn=2024&lvl=10&lv2=11";
        try {

            $client = new Client();
            $response = $client->get($url);
            $data = json_decode($response->getBody(), true);

            return $data;
        } catch (\Exception $e) {

            dd($e->getMessage());
        }
    }

    public function kabupaten()
    {

        $url = "https://sipedas.pertanian.go.id/api/wilayah/list_wilayah?thn=2024&lvl=10&lv2=12";


        try {
            $client = new Client();
            $response = $client->get($url);
            $data = json_decode($response->getBody(), true);

            return $data;
        } catch (\Exception $e) {

            dd($e->getMessage());
        }
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


    public function collection(Collection $rows)
    {
        foreach ($rows as $key => $row) {
            DB::beginTransaction();

            try {
                $partnerExist = Partner::where('name', 'like', '%' . $row["nama_partner"] . '%')->first();
                if ($partnerExist) {
                    continue;
                }

                $regency = $this->kabupaten->filter(function ($kabupaten) use ($row) {
                    if ($row['kabkota'] === 'Kab. OKU Timur') {
                        $row['kabkota'] = 'KAB. OGAN KOMERING ULU TIMUR';
                    } else if ($row['kabkota'] === 'Kab. Kep. Meranti') {
                        $row['kabkota'] = 'KAB. KEPULAUAN MERANTI';
                    } else if ($row['kabkota'] == 'Kota Bintan') {
                        $row['kabkota'] = 'Kab. Bintan';
                    } else if ($row['kabkota'] == 'Kec. Kebumen') {
                        $row['kabkota'] = 'Kab. Kebumen';
                    }
                    return stripos(str_replace(' ', '', $kabupaten), str_replace(' ', '', $row['kabkota'])) !== false;
                });

                $province = $this->provinsi->filter(function ($provinsi) use ($row) {
                    if ($row['provinsi'] == 'NTB') {
                        $row['provinsi'] = 'Nusa Tenggara Barat';
                    }
                    return stripos(str_replace(' ', '', $provinsi), str_replace(' ', '', $row['provinsi'])) !== false;
                });


                $status = $this->status->filter(function ($status) use ($row) {
                    return strtolower($row['status']) === strtolower($status['name']);
                });

                foreach ($regency as $code => $name) {
                    $regency = ["code" => $code, "name" => ucwords(strtolower($name))];
                }
                foreach ($province as $code => $name) {
                    $province = ["code" => $code, "name" => ucwords(strtolower($name))];
                }

                $tanggal_live = $row["tanggal_live"] ? Carbon::parse(Date::excelToDateTimeObject($row["tanggal_live"]))->format('Y-m-d H:i:s') : null;
                $tanggal_onboarding = $row["tanggal_onboarding"] ? Carbon::parse(Date::excelToDateTimeObject($row["tanggal_onboarding"]))->format('Y-m-d H:i:s') : null;
                $partner = Partner::create([
                    'uuid' => Str::uuid(),
                    'name' => $row["nama_partner"],
                    'phone_number' => $row["nomor_telepon_lembaga"],
                    'npwp' => $row['npwp'],
                    'password' => $row['password'],
                    'onboarding_date' => $tanggal_onboarding,
                    'live_date' => $tanggal_live,
                    'onboarding_age' => $this->calculateOnboardingAge($tanggal_live, $tanggal_onboarding),
                    'live_age' => $this->calculateLiveAge($tanggal_live),
                    'monitoring_date_after_3_month_live' => $row["tanggal_monitoring_3_bulan_after_live"] ? Carbon::parse(Date::excelToDateTimeObject($row["tanggal_monitoring_3_bulan_after_live"]))->format('Y-m-d H:i:s') : null,
                    'regency' => json_encode($regency),
                    'province' => json_encode($province),
                    'status_id' => $status->first()->id,
                    'created_by' => Auth::user()->id
                ]);

                PartnerPIC::create(['uuid' => Str::uuid(), 'partner_id' => $partner->id, 'name' => $row["pic_partner"], 'number' => $row["no_hp_pic_partner"] ?? null, 'created_by' => Auth::user()->id]);
                DB::commit();

            } catch (Exception $e) {
                DB::rollback();
                Log::error('Error import partner: ' . $e->getMessage());
                return redirect()->back()->withErrors([
                    'error' => $e->getMessage()
                ]);
            }
        }
    }
}
