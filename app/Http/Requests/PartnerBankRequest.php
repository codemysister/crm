<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PartnerBankRequest extends FormRequest
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
            'bank' => 'required',
            'account_bank_number' => 'required',
            'account_bank_name' => 'required'
        ];
    }


    public function messages(): array
    {
        return [
            'partner.required' => 'Lembaga harus diiisi',
            'bank.required' => 'Bank harus diiisi',
            'account_bank_number.required' => 'Nomor rekening harus diiisi',
            'account_bank_name.required' => 'Atas nama bank harus diiisi'
        ];
    }
}
