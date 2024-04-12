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

        Status::create([
            'uuid' => Str::uuid(),
            'name' => 'prospek',
            'category' => 'lead',
            'color' => '00ff48'
        ]);

        Status::create([
            'uuid' => Str::uuid(),
            'name' => 'loss',
            'category' => 'lead',
            'color' => '4f4f4f'
        ]);

        Status::create([
            'uuid' => Str::uuid(),
            'name' => 'belum bayar',
            'category' => 'invoice',
            'color' => 'fbc02d'
        ]);

        Status::create([
            'uuid' => Str::uuid(),
            'name' => 'sebagian',
            'category' => 'invoice',
            'color' => '2196f3'
        ]);

        Status::create([
            'uuid' => Str::uuid(),
            'name' => 'lunas',
            'category' => 'invoice',
            'color' => '689f38'
        ]);

    }
}
