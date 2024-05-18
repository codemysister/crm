<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CardRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'partner.name' => 'required',
            'status.name' => 'required',
            'pcs' => 'required',
            'price' => 'required',
            'type' => 'required',
            'google_drive_link' => 'required',
            'total' => 'required',
        ];
    }

    public function messages(): array
    {
        return [
            'partner.name.required' => 'Lembaga harus diiisi',
            'status.name.required' => 'Status harus diiisi',
            'pcs.required' => 'Jumlah kartu harus diiisi',
            'price.required' => 'Harga kartu harus diiisi',
            'type.required' => 'Tipe kartu harus diiisi',
            'google_drive_link.required' => 'Link google drive harus diisi',
        ];
    }
}
