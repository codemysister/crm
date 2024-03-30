<?php

namespace App\Imports;

use App\Models\Lead;
use App\Models\Status;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithStartRow;

class LeadsImport implements ToCollection, WithStartRow, WithHeadingRow, WithCalculatedFormulas, WithBatchInserts, WithChunkReading
{

    public function startRow(): int
    {
        return 2;
    }

    public function batchSize(): int
    {
        return 300;
    }

    public function chunkSize(): int
    {
        return 300;
    }


    public function collection(Collection $rows)
    {
        foreach ($rows as $key => $row) {
            $leadExist = Lead::where('name', 'like', '%' . $row["lembaga"] . '%')->first();
            if ($leadExist) {
                return null;
            }
            $prospekStatus = Status::where('name', 'prospek')->first();
            $lead = Lead::create([
                'uuid' => Str::uuid(),
                'name' => $row['lembaga'],
                'pic' => $row['pic_partner'],
                'phone_number' => $row['nomor_telepon_lembaga'],
                'address' => $row['alamat'],
                'total_members' => $row['jumlah_member'],
                'status_id' => $prospekStatus['id'],
                'created_by' => Auth::user()->id
            ]);

        }
    }
}
