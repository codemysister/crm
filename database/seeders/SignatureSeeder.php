<?php

namespace Database\Seeders;

use App\Models\Signature;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SignatureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Signature::create([
            'uuid' => Str::uuid(),
            'user_id' => 2,
            'name' => 'Muh Arif Mahfudin',
            'position' => "ceo",
            'image' => 'images/tanda_tangan/tanda_tangan.png'
        ]);
    }
}
