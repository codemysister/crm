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
            'name' => 'Muh Arif Mahfudin',
            'position' => "CEO",
            'image' => 'images/tanda_tangan/tanda_tangan.png'
        ]);
    }
}
