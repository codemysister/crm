<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SLARequest extends FormRequest
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
            "code" => "required",
            "logo" => "required",
            "partner.name" => "required",
            "partner.province" => "required",
            "partner.regency" => "required",
            "partner.phone_number" => "required",
            "partner.pic" => "required",
            "partner.pic_email" => "required",
            "partner.pic_number" => "required",
            "signature.image" => "required",
        ];
    }

    public function messages(): array
    {
        return [
            'partner.name.required' => 'Lembaga harus diiisi',
            'partner.province.required' => 'Provinsi harus diiisi',
            'partner.regency.required' => 'Kabupaten harus diiisi',
            'partner.pic.required' => 'PIC harus diiisi',
            'partner.pic_email.required' => 'Email PIC harus diiisi',
            'partner.pic_number.required' => 'Nomor PIC harus diiisi',
            'signature.image.required' => 'Tanda tangan harus diiisi',

        ];
    }

}
