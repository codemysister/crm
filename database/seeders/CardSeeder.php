<?php

namespace Database\Seeders;

use App\Models\Card;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $card = Card::create([
            'uuid' => Str::uuid(),
            'partner_id' => 23,
            'status_id' => 11,
            'pcs' => 500,
            'type' => "cetak",
            'price' => 15000,
            'total' => 7500000,
            'google_drive_link' => "https://drive.google.com/drive/u/0/folders/1FdTIrLqbGd0-S6FYEo3x22mDrf8MEqSb",
            'address' => "Jl Kenanga, Bumiayu, Brebes",
            // 'approval_date' => Carbon::now(),
            'created_by' => 11
        ]);

        $card = Card::create([
            'uuid' => Str::uuid(),
            'partner_id' => 21,
            'status_id' => 14,
            'pcs' => 200,
            'type' => "cetak",
            'price' => 15000,
            'total' => 3000000,
            "design_date" => "2024-06-15",
            "approval_date" => "2024-06-18",
            'google_drive_link' => "https://drive.google.com/drive/u/0/folders/1FdTIrLqbGd0-S6FYEo3x22mDrf8MEqSb",
            'address' => "Jl Mawar, Bumiayu, Brebes",
            // 'approval_date' => Carbon::now(),
            'created_by' => 11
        ]);

        $card = Card::create([
            'uuid' => Str::uuid(),
            'partner_id' => 2,
            'status_id' => 15,
            'pcs' => 200,
            'type' => "cetak",
            'price' => 15000,
            'total' => 2250000,
            "design_date" => "2024-06-15",
            "approval_date" => "2024-06-18",
            "print_date" => "2024-06-19",
            'google_drive_link' => "https://drive.google.com/drive/u/0/folders/1FdTIrLqbGd0-S6FYEo3x22mDrf8MEqSb",
            'address' => "Jl Haji Slamet, Pekalongan",
            // 'approval_date' => Carbon::now(),
            'created_by' => 11
        ]);

        $card = Card::create([
            'uuid' => Str::uuid(),
            'partner_id' => 7,
            'status_id' => 16,
            'pcs' => 150,
            'type' => "cetak",
            'price' => 15000,
            'total' => 1800000,
            "design_date" => "2024-06-20",
            "approval_date" => "2024-06-22",
            "print_date" => "2024-06-23",
            "delivery_date" => "2024-06-24",
            'google_drive_link' => "https://drive.google.com/drive/u/0/folders/1FdTIrLqbGd0-S6FYEo3x22mDrf8MEqSb",
            'address' => "Jl mekarsari, Malang",
            // 'approval_date' => Carbon::now(),
            'created_by' => 11
        ]);
    }
}
