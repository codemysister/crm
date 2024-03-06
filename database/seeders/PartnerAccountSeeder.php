<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PartnerAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 10; $i++) {
            DB::table('partner_account_settings')->insert([
                'uuid' => \Illuminate\Support\Str::uuid(),
                'partner_id' => $i,
                'subdomain' => 'partner' . $i . '.cazh.id',
                'email_super_admin' => 'superadmin' . $i . '@example.com',
                'cas_link_partner' => 'https://cazh/partner' . $i . '.com',
                'card_number' => str_pad(rand(1, 99999999), 8, '0', STR_PAD_LEFT),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
