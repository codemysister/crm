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
                    'nominal' => rand(1000000, 10000000),
                    'period' => 3,
                    'price_card' => json_encode(['price' => rand(1000000, 10000000), 'type' => 'cetak']),
                    'price_lanyard' => rand(1000000, 10000000),
                    'price_subscription_system' => rand(1000000, 10000000),
                    'price_training' => json_encode(['price' => rand(1000000, 10000000), 'type' => 'online']),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
    }
}
