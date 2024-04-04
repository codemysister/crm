<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LeadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|unique:leads',
            'phone_number' => 'required',
            'address' => 'required',
            'total_members' => 'required',
            'status' => 'required',
            'pic' => 'required',
        ];
    }


    public function messages(): array
    {
        return [
            'name.required' => 'Lembaga harus diisi',
            'name.unique' => 'Lembaga sudah ada',
            'phone_number' => 'Nomor telepon lembaga harus diisi',
            'address' => 'Alamat lembaga harus diisi',
            'total_members' => 'Total member harus diisi',
            'status' => 'Status harus diisi',
            'pic' => 'PIC lembaga harus diisi',

        ];
    }
}
