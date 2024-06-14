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
            'color' => '00ff48'
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
            'name' => 'prospek',
            'category' => 'lead',
            'color' => '2196f3'
        ]);

        Status::create([
            'uuid' => Str::uuid(),
            'name' => 'loss',
            'category' => 'lead',
            'color' => '4f4f4f'
        ]);

        Status::create([
            'uuid' => Str::uuid(),
            'name' => 'pengajuan onboarding',
            'category' => 'lead',
            'color' => '00ff48'
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

        Status::create([
            'uuid' => Str::uuid(),
            'name' => 'pengajuan design',
            'category' => 'kartu',
            'color' => '2196f3'
        ]);

        Status::create([
            'uuid' => Str::uuid(),
            'name' => 'design',
            'category' => 'kartu',
            'color' => '4B5563'
        ]);

        Status::create([
            'uuid' => Str::uuid(),
            'name' => 'submit design',
            'category' => 'kartu',
            'color' => 'fbc02d'
        ]);

        Status::create([
            'uuid' => Str::uuid(),
            'name' => 'revisi',
            'category' => 'kartu',
            'color' => '2196f3'
        ]);


        Status::create([
            'uuid' => Str::uuid(),
            'name' => 'disetujui',
            'category' => 'kartu',
            'color' => '00ff48'
        ]);



        Status::create([
            'uuid' => Str::uuid(),
            'name' => 'print',
            'category' => 'kartu',
            'color' => 'D97706'
        ]);

        Status::create([
            'uuid' => Str::uuid(),
            'name' => 'dikirim',
            'category' => 'kartu',
            'color' => '7C3AED'
        ]);

        Status::create([
            'uuid' => Str::uuid(),
            'name' => 'sampai',
            'category' => 'kartu',
            'color' => '00ff48'
        ]);


    }
}
