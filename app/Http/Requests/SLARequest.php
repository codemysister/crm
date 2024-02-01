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
            "partner_name" => "required",
            "partner_address" => "required",
            "partner_phone_number" => "required",
            "partner_pic" => "required",
            "partner_pic_email" => "required",
            "partner_pic_number" => "required",
            "referral" => "required",
            "signature_name" => "required",
            "signature_image" => "required",
        ];
    }
}
