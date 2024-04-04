<?php

namespace App\Imports;

use App\Models\Lead;
use App\Models\Status;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class LeadsImport implements ToCollection, SkipsEmptyRows, WithValidation, WithStartRow, WithHeadingRow, WithCalculatedFormulas, WithBatchInserts, WithChunkReading
{

    public function rules(): array
    {
        return [
            'lembaga' => [
                'required',
                'string',
            ],
            'pic_partner' => [
                'required',
                'string',
            ],
            'nomor_telepon_lembaga' => [
                'required',
            ],
            'alamat' => [
                'required',
            ],
            'jumlah_member' => [
                'required',
                'integer',
            ],
        ];
    }

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
            try {
                $leadExist = Lead::where('name', 'like', '%' . $row["lembaga"] . '%')->first();

                if ($leadExist) {
                    continue;
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

            } catch (Exception $e) {
                Log::error('Error import lead: ' . $e->getMessage());
            }

        }
    }
}
