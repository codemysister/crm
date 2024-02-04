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
        // $table->json('price_card')->nullable();
        // $table->bigInteger('price_lanyard')->nullable();
        // $table->bigInteger('price_subscription_system')->nullable();
        // $table->json('price_training')->nullable();

        for ($i = 1; $i <= 10; $i++) {
            DB::table('partner_subscriptions')->insert([
                'uuid' => \Illuminate\Support\Str::uuid(),
                'partner_id' => $i,
                'nominal' => rand(500000, 2000000),
                'ppn' => rand(5, 15),
                'total_bill' => rand(550000, 2200000),
                'period' => 'lembaga/tahun',
                'price_card' => json_encode(['price' => rand(10000, 20000), 'type' => 'cetak']),
                'price_lanyard' => 12000,
                'price_subscription_system' => rand(100000, 300000),
                'price_training_offline' => 25000000,
                'price_training_online' => rand(120000, 350000),
                'fee_purchase_cazhpoin' => 2000,
                'fee_bill_cazhpoin' => 2000,
                'fee_topup_cazhpos' => 2000,
                'fee_withdraw_cazhpos' => 2000,
                'fee_bill_saldokartu' => 2000,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
