<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PartnerSubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 10; $i++) {
                DB::table('partner_subscriptions')->insert([
                    'uuid' => \Illuminate\Support\Str::uuid(),
                    'partner_id' => $i,
                    'nominal' => rand(1000000, 10000000),
                    'period' => 3,
                    'bank' => 'Bank ' . $i,
                    'account_bank_number' => '123456789' . $i,
                    'account_bank_name' => 'Anonymous ' . $i,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
    }
}
