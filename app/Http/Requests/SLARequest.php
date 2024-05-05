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
            "lead.name" => "required",
            "lead.province" => "required",
            "lead.regency" => "required",
            "lead.phone_number" => "required",
            "lead.pic" => "required",
            "lead.pic_email" => "required",
            "lead.pic_number" => "required",
            "referral" => "required",
        ];
    }
}
