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
                'bill' => 'Langganan Bulan',
                'total_ppn' => 50000,
                'nominal' => 500000,
                'ppn' => 10,
                'total_bill' => 550000,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        for ($i = 11; $i <= 20; $i++) {
            DB::table('partner_subscriptions')->insert([
                'uuid' => \Illuminate\Support\Str::uuid(),
                'partner_id' => $i,
                'bill' => 'Langganan Bulan',
                'total_ppn' => 70000,
                'nominal' => 700000,
                'ppn' => 10,
                'total_bill' => 770000,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        for ($i = 21; $i <= 30; $i++) {
            DB::table('partner_subscriptions')->insert([
                'uuid' => \Illuminate\Support\Str::uuid(),
                'partner_id' => $i,
                'bill' => 'Langganan Bulan',
                'total_ppn' => 80000,
                'nominal' => 800000,
                'ppn' => 10,
                'total_bill' => 880000,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
