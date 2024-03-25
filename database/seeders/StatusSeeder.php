<?php

namespace Database\Seeders;

use App\Models\Status;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Status::create([
            'uuid' => Str::uuid(),
            'name' => 'aktif',
            'category' => 'partner',
            'color' => 'DC2626'
        ]);

        Status::create([
            'uuid' => Str::uuid(),
            'name' => 'non aktif',
            'category' => 'partner',
            'color' => '4B5563'
        ]);

        Status::create([
            'uuid' => Str::uuid(),
            'name' => 'proses',
            'category' => 'partner',
            'color' => 'D97706'
        ]);

        Status::create([
            'uuid' => Str::uuid(),
            'name' => 'clbk',
            'category' => 'partner',
            'color' => '7C3AED'
        ]);

        Status::create([
            'uuid' => Str::uuid(),
            'name' => 'cancel',
            'category' => 'partner',
            'color' => 'D946EF'
        ]);
    }
}
