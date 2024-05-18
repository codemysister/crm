<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $user = User::find(1)->first();

        Product::create([
            'uuid' => Str::uuid(),
            "created_by" => $user->id,
            "name" => "Kartu Digital",
            "category" => "Produk",
            "price" => 25000,
            "unit" => "kartu",
            "description" => "kartu digital transaksi lembaga pendidikan"
        ]);

        Product::create([
            'uuid' => Str::uuid(),
            "created_by" => $user->id,
            "name" => "Langganan Kartu Digital",
            "category" => "Layanan",
            "price" => 5000,
            "unit" => "kartu",
            "description" => "kartu digital transaksi lembaga pendidikan"
        ]);

    }
}
