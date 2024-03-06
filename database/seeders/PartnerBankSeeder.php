<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PartnerBankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 10; $i++) {
            DB::table('partner_banks')->insert([
                'uuid' => \Illuminate\Support\Str::uuid(),
                'partner_id' => $i,
                'bank' => 'Bank ' . $i,
                'account_bank_number' => '123456789' . $i,
                'account_bank_name' => 'PIC ' . $i,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
