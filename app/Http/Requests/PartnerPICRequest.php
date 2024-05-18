<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PartnerPICRequest extends FormRequest
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
            'partner' => 'required',
            'name' => 'required',
            'position' => 'required'
        ];
    }

    public function messages(): array
    {
        return [
            'partner.required' => 'Lembaga PIC harus diiisi',
            'name.required' => 'Nama PIC harus diiisi',
            'position.required' => 'Jabatan PIC harus diiisi'
        ];
    }
}
