<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PartnerAccountSettingRequest extends FormRequest
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
            'subdomain' => 'required',
            'email_super_admin' => 'required',
            'cas_link_partner' => 'required',
            'card_number' => 'required'
        ];
    }


    public function messages(): array
    {
        return [
            'partner.required' => 'Lembaga harus diiisi',
            'subdomain.required' => 'Subdomain harus diiisi',
            'email_super_admin.required' => 'Email super admin harus diiisi',
            'cas_link_partner.required' => 'CAS link partner harus diiisi',
            'card_number.required' => 'Nomor kartu harus diiisi'
        ];
    }
}
