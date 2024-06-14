<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LeadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $leads = [
            [
                'name' => 'YAPSI Darul Amal',
                'phone_number' => '85182951124',
                'address' => 'Kab. Sukabumi',
                'pic' => 'Ribhi Barka',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '12.345.678.9-123.456',
            ],
            [
                'name' => 'Yayasan Daarul Quran Alkautsar, Cibinong Bogor',
                'phone_number' => '85182951124',
                'address' => 'Kab. Bogor',
                'pic' => 'Admin',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '23.456.789.9-234.567',
            ],
            [
                'name' => 'PP Darul Falah, Subang',
                'phone_number' => '85182951124',
                'address' => 'Kab. Subang',
                'pic' => 'Linawati',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '34.567.890.9-345.678',
            ],
            [
                'name' => 'SMK Ma\'arif NU 1 Ajibarang, Banyumas',
                'phone_number' => '85182951124',
                'address' => 'Kab. Banyumas',
                'pic' => 'Imam',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '45.678.901.9-456.789',
            ],
            [
                'name' => 'PP Cendekia Amanah, Depok',
                'phone_number' => '85182951124',
                'address' => 'Kota Depok',
                'pic' => 'KH. M. Cholil Nafis, Lc., Ph.D',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '56.789.012.9-567.890',
            ],
            [
                'name' => 'PP Minhaajurrosyidiin, Jakarta',
                'phone_number' => '85182951124',
                'address' => 'Jakarta Timur',
                'pic' => 'K.H. Ir. H. Muhammad Asy\'ari Akbar',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '67.890.123.9-678.901',
            ],
            [
                'name' => 'Wanasuta, Banyumas',
                'phone_number' => '85182951124',
                'address' => 'Kab. Banyumas',
                'pic' => 'Bayu Nugroho',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '78.901.234.9-789.012',
            ],
            [
                'name' => 'PP Al Fattah Kikil, Pacitan',
                'phone_number' => '85182951124',
                'address' => 'Kab. Pacitan',
                'pic' => 'KH. Moch. Burhanudin HB',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '89.012.345.9-890.123',
            ],
            [
                'name' => 'PP Nurul Iman, Purwokerto',
                'phone_number' => '85182951124',
                'address' => 'Kab. Banyumas',
                'pic' => 'Gus Luqman',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '90.123.456.9-901.234',
            ],
            [
                'name' => 'SMK Muhammadiyah 1 Purwokerto',
                'phone_number' => '85182951124',
                'address' => 'Kab. Banyumas',
                'pic' => 'Pak Isa - Kepala TU',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '01.234.567.9-012.345',
            ],
            [
                'name' => 'SD UMP Purwokerto',
                'phone_number' => '85182951124',
                'address' => 'Kab. Banyumas',
                'pic' => 'Nofiyanto (Kepsek)',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '12.345.678.9-678.123',
            ],
            [
                'name' => 'PPTQ Al-Fatah Purbalingga',
                'phone_number' => '85182951124',
                'address' => 'Kab. Purbalingga',
                'pic' => 'Imam Jamal Sodik',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '23.456.789.9-789.234',
            ],
            [
                'name' => 'PP Miftahul Ulum, Bekasi',
                'phone_number' => '85182951124',
                'address' => 'Kab. Bekasi',
                'pic' => 'lisda',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '34.567.890.9-890.345',
            ],
            [
                'name' => 'BMT Syariah Al-Azhaar, Lubuklinggau',
                'phone_number' => '85182951124',
                'address' => 'Kota Lubuklinggau',
                'pic' => 'yeni',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '45.678.901.9-901.456',
            ],
            [
                'name' => 'MIM Patikraja, Banyumas',
                'phone_number' => '85182951124',
                'address' => 'Kab. Banyumas',
                'pic' => 'Indra Gunawan',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '56.789.012.9-012.567',
            ],
            [
                'name' => 'SD IT Khoiro Ummah Purwokerto',
                'phone_number' => '85182951124',
                'address' => 'Kab. Banyumas',
                'pic' => 'rima',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '67.890.123.9-123.678',
            ],
            [
                'name' => 'PP Syekh Ibrahim Kumpulan, Pasaman Sumbar',
                'phone_number' => '85182951124',
                'address' => 'Kab. Pasaman',
                'pic' => 'Dra Yusriarti',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '78.901.234.9-234.789',
            ],
            [
                'name' => 'SD Muhammadiyah Pati',
                'phone_number' => '85182951124',
                'address' => 'Kab. Pati',
                'pic' => 'Ahmad Sunarto',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '89.012.345.9-345.890',
            ],
            [
                'name' => 'SD Muhammadiyah Sudagaran, Wonosobo',
                'phone_number' => '85182951124',
                'address' => 'Kab. Wonosobo',
                'pic' => 'Sukaryo',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '90.123.456.9-456.901',
            ],
            [
                'name' => 'PP Al-Mahbubiyah, Sleman DIY',
                'phone_number' => '85182951124',
                'address' => 'Kab. Sleman',
                'pic' => 'Labib',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '01.234.567.9-567.012',
            ],
            [
                'name' => 'PP Jabal Rahmah, Gorontalo',
                'phone_number' => '85182951124',
                'address' => 'Kab. Gorontalo',
                'pic' => 'Abdullah Poiyo',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '12.345.678.9-789.345',
            ],
            [
                'name' => 'PP Kampung Quran, Sumedang',
                'phone_number' => '85182951124',
                'address' => 'Kab. Sumedang',
                'pic' => 'admin',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '23.456.789.9-890.456',
            ],
            [
                'name' => 'PP At-Tauhiid, Ogan Ilir Sumsel',
                'phone_number' => '85182951124',
                'address' => 'Kab. Ogan Ilir',
                'pic' => 'Rizky',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '34.567.890.9-901.567',
            ],
            [
                'name' => 'PP Mabda Islam, Sukabumi',
                'phone_number' => '85182951124',
                'address' => 'Kab. Sukabumi',
                'pic' => 'Ust Asep Sumarna',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '45.678.901.9-012.678',
            ],
            [
                'name' => 'PP Nurussathi Darul Falah',
                'phone_number' => '85182951124',
                'address' => 'Kab. Banjarnegara',
                'pic' => 'M Faozan',
                'total_members' => 100,
                'sales_id' => 6,
                'npwp' => '56.789.012.9-123.789',
            ],



        ];

        foreach ($leads as $lead) {
            DB::table('leads')->insert([
                'uuid' => Str::uuid(),
                'created_by' => 6,
                'status_id' => 4,
                'sales_id' => $lead['sales_id'],
                'name' => $lead['name'],
                'npwp' => $lead['npwp'],
                'total_members' => $lead['total_members'],
                'phone_number' => $lead['phone_number'],
                'address' => $lead['address'],
                'pic' => $lead['pic'],
                'note_status' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
