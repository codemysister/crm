<?php

namespace App\Imports;

use App\Models\Partner;
use App\Models\PartnerAccountSetting;
use App\Models\PartnerBank;
use App\Models\PartnerPIC;
use App\Models\PartnerSubscription;
use App\Models\User;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
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
use Maatwebsite\Excel\Row;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class PartnerImport implements ToCollection, WithStartRow, WithHeadingRow, WithCalculatedFormulas, WithBatchInserts, WithChunkReading
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */

    private $partner;
    private $sales;
    private $account_managers;
    private $provinsi;
    private $kabupaten;

    public function __construct()
    {
        $this->sales = User::role('account executive')->get();
        $this->account_managers = User::role('account manager')->get();
        $this->provinsi = collect($this->provinsi());
        $this->kabupaten = collect($this->kabupaten());
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

    // public function rules(): array
    // {
    //     return [
    //         "tanggal_onboarding" => 'required',
    //         "tanggal_live" => 'required',
    //         "umur_onboarding_hari" => 'required',
    //         "umur_live_hari" => 'required',
    //         "tanggal_monitoring_3_bulan_after_live" => 'required',
    //         "nama_partner" => 'required',
    //         "nomor_telepon_lembaga" => 'required',
    //         "kabkota" => 'required',
    //         "provinsi" => 'required',
    //         "status" => 'required',
    //         "sales" => 'required',
    //         "after_sales" => 'required',
    //         "pic_partner" => 'required',
    //         "no_hp_pic_partner" => 'required',

    //     ];
    // }
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
        return 50;
    }

    public function chunkSize(): int
    {
        return 50;
    }


    public function collection(Collection $rows)
    {
        foreach ($rows as $key => $row) {
            $partnerExist = Partner::where('name', 'like', '%' . $row["nama_partner"] . '%')->first();
            if ($partnerExist) {
                return null;
            }
            $email = strtolower(str_replace(' ', '_', $row["sales"]) . "@gmail.com");

            $salesExist = User::where('email', $email)->orwhere('name', 'like', '%' . $row["sales"] . '%')->first();

            if ($salesExist == null) {
                $salesExist = User::create([
                    'name' => $row["sales"],
                    'email' => strtolower(str_replace(' ', '_', $row["sales"]) . "@gmail.com"),
                    'password' => Hash::make('user123')
                ]);
                $salesExist->assignRole("account executive");

            }
            $email = strtolower(str_replace(' ', '_', $row["sales"]) . "@gmail.com");
            $amExist = User::where('email', $email)->orWhere('name', 'like', '%' . $row["after_sales"] . '%')->first();
            if ($amExist == null) {
                $amExist = User::create([
                    'name' => $row["after_sales"],
                    'email' => strtolower(str_replace(' ', '_', $row["after_sales"]) . "@gmail.com"),
                    'password' => Hash::make('user123')
                ]);
                $amExist->assignRole("account manager");
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

            foreach ($regency as $code => $name) {
                $regency = ["code" => $code, "name" => ucwords(strtolower($name))];
            }
            foreach ($province as $code => $name) {
                $province = ["code" => $code, "name" => ucwords(strtolower($name))];
            }

            // dd(Carbon::parse(Date::excelToDateTimeObject($row[0]))->format('Y-m-d H:i:s'));
            $partner = Partner::create([
                'uuid' => Str::uuid(),
                'name' => $row["nama_partner"],
                'phone_number' => $row["nomor_telepon_lembaga"],
                'sales_id' => $salesExist->id,
                'account_manager_id' => $amExist->id,
                'onboarding_date' => Carbon::parse(Date::excelToDateTimeObject($row["tanggal_onboarding"]))->format('Y-m-d H:i:s'),
                'live_date' => $row["tanggal_live"] ? Carbon::parse(Date::excelToDateTimeObject($row["tanggal_live"]))->format('Y-m-d H:i:s') : null,
                'onboarding_age' => $row["umur_onboarding_hari"] ? explode(' ', $row["umur_onboarding_hari"])[0] : 0,
                'live_age' => $row["umur_onboarding_hari"] ? explode(' ', $row["umur_live_hari"])[0] : 0,
                'monitoring_date_after_3_month_live' => $row["tanggal_monitoring_3_bulan_after_live"] ? Carbon::parse(Date::excelToDateTimeObject($row["tanggal_monitoring_3_bulan_after_live"]))->format('Y-m-d H:i:s') : null,
                'regency' => json_encode($regency),
                'province' => json_encode($province),
                'period' => $row["per"],
                'status' => $row['status'] == 'CLBK' ? $row['status'] : ucwords(strtolower($row["status"]))
            ]);


            if ($row['bank'] && $row['nomor_rekening'] && $row['atas_nama']) {
                PartnerBank::create(['uuid' => Str::uuid(), 'partner_id' => $partner->id, 'bank' => $row["bank"], 'account_bank_number' => $row["nomor_rekening"], 'account_bank_name' => $row['atas_nama']]);
            }
            PartnerPIC::create(['uuid' => Str::uuid(), 'partner_id' => $partner->id, 'name' => $row["pic_partner"], 'number' => $row["no_hp_pic_partner"]]);
            partnerAccountSetting::create(['uuid' => Str::uuid(), 'partner_id' => $partner->id, 'subdomain' => $row["sub_domain"], 'email_super_admin' => $row["email_super_admin"], 'cas_link_partner' => $row["cas_link_partner"], 'card_number' => $row["no_kartu_8_digit"]]);
            PartnerSubscription::create(['uuid' => Str::uuid(), 'partner_id' => $partner->id, 'bill' => $row['tagihan'], 'nominal' => $row["nominal"], 'ppn' => $row["ppn"] / $row["nominal"] * 100, 'total_ppn' => $row["ppn"], 'total_bill' => $row["tagihan_ppn"]]);

        }
    }

    // public function model(array $row)
    // {
    //     if (!array_filter($row)) {
    //         return null;
    //     }


    //     // dd($row);
    //     // $regency = $this->kabupaten($row[6]);
    //     // dd($row[5]);
    //     // dd(str_replace('/', '', $row[21]));
    //     // dd(explode(' ', $row[3])[0]);

    //     return $partner;
    // }

    // public function onRow(Row $row)
    // {
    //     if (!array_filter($row->toArray())) {
    //         return null;
    //     }

    //     $row = $row->toArray();

    // }
}
