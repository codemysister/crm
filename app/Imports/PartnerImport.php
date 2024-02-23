<?php

namespace App\Imports;

use App\Models\Partner;
use App\Models\PartnerAccountSetting;
use App\Models\PartnerPIC;
use App\Models\PartnerSubscription;
use App\Models\User;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\PersistRelations;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Row;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class PartnerImport implements ToModel, WithStartRow, PersistRelations, OnEachRow, WithHeadingRow
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */

    private $partner;
    private $provinsi;
    private $kabupaten;

    public function __construct()
    {
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


    public function model(array $row)
    {
        // $regency = $this->kabupaten($row[6]);
        // dd($row[5]);
        // dd(str_replace('/', '', $row[21]));
        // dd(explode(' ', $row[3])[0]);

        $salesExist = User::role('account executive')->where('name', 'like', '%' . $row["sales"] . '%')->first();
        if ($salesExist == null) {

            $salesExist = User::create([
                'name' => $row["sales"],
                'email' => $row["email_sales"],
                'number' => $row["nomor_sales"],
                'password' => Hash::make('user123')
            ]);
        }
        $amExist = User::role('account manager')->where('name', 'like', '%' . $row["after_sales"] . '%')->first();
        if ($amExist == null) {
            $amExist = User::create([
                'name' => $row["after_sales"],
                'email' => $row["email_am"],
                'number' => $row["nomor_am"],
                'password' => Hash::make('user123')
            ]);
        }

        $regency = $this->kabupaten->filter(function ($kabupaten) use ($row) {
            return $kabupaten === strtoupper($row["kabkota"]);
        });
        $province = $this->provinsi->filter(function ($provinsi) use ($row) {
            return $provinsi === strtoupper($row["provinsi"]);
        });

        foreach ($regency as $code => $name) {
            $regency = ["code" => $code, "name" => ucwords(strtolower($name))];
        }
        foreach ($province as $code => $name) {
            $province = ["code" => $code, "name" => ucwords(strtolower($name))];
        }

        // dd(Carbon::parse(Date::excelToDateTimeObject($row[0]))->format('Y-m-d H:i:s'));
        $partner = new Partner([
            'uuid' => Str::uuid(),
            'name' => $row["nama_partner"],
            'phone_number' => $row["nomor_telepon_lembaga"],
            'sales_id' => $salesExist->id,
            'account_manager_id' => $amExist->id,
            'onboarding_date' => Carbon::parse(Date::excelToDateTimeObject($row["tanggal_onboarding"]))->format('Y-m-d H:i:s'),
            'live_date' => Carbon::parse(Date::excelToDateTimeObject($row["tanggal_live"]))->format('Y-m-d H:i:s'),
            'onboarding_age' => explode(' ', $row["umur_onboarding_hari"])[0],
            'live_age' => explode(' ', $row["umur_live_hari"])[0],
            'monitoring_date_after_3_month_live' => Carbon::parse(Date::excelToDateTimeObject($row["tanggal_monitoring_3_bulan_after_live"]))->format('Y-m-d H:i:s'),
            'regency' => json_encode($regency),
            'province' => json_encode($province),
            'period' => $row["per"],
            'status' => $row["status"]
        ]);

        // dd($partner);
        $this->partner = $partner;
        // $partner->setRelation('pics', new PartnerPIC(['name' => $row[16], 'number' => $row[17], 'email' => $row[18]]));
        // $partner->setRelation('accounts', new PartnerAccountSetting(['subdomain' => $row[19], 'email_super_admin' => $row[20], 'cas_link_partner' => $row[21], 'card_number' => $row[22]]));
        // $partner->setRelation('subscriptions', new PartnerSubscription(['nominal' => $row[23], 'total_ppn' => $row[24], 'total_bill' => $row[25]]));


        return $partner;
    }

    public function onRow(Row $row)
    {
        $row = $row->toArray();
        PartnerPIC::create(['uuid' => Str::uuid(), 'partner_id' => $this->partner->id, 'name' => $row["pic_partner"], 'number' => $row["no_hp_pic_partner"], 'email' => $row["email_pic"]]);
        partnerAccountSetting::create(['uuid' => Str::uuid(), 'partner_id' => $this->partner->id, 'subdomain' => $row["sub_domain"], 'email_super_admin' => $row["email_super_admin"], 'cas_link_partner' => $row["cas_link_partner"], 'card_number' => $row["no_kartu_8_digit"]]);
        PartnerSubscription::create(['uuid' => Str::uuid(), 'partner_id' => $this->partner->id, 'bill' => $row['tagihan'], 'nominal' => $row["nominal"], 'ppn' => $row["ppn"] / $row["nominal"] * 100, 'total_ppn' => $row["ppn"], 'total_bill' => $row["tagihan_ppn"]]);


    }
}
