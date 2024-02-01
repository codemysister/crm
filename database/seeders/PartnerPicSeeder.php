<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PartnerPicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 10; $i++) {
            DB::table('partner_pic')->insert([
                'uuid' => \Illuminate\Support\Str::uuid(),
                'partner_id' => $i,
                'name' => 'PIC ' . $i,
                'number' => '123456789' . $i,
                'email' => 'pic' . $i . '@gmail.com',
                'position' => 'Position ' . $i,
                'address' => 'Address ' . $i,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
