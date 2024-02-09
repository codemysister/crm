<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PartnerRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'province' => 'required',
            'regency' => 'required',
            'subdistrict' => 'required',
            'address' => 'nullable|string',
            'onboarding_date' => 'required|date',
            'live_date' => 'nullable|date',
            'onboarding_age' => 'nullable|integer',
            'live_age' => 'nullable|integer',
            'monitoring_date_after_3_month_live' => 'nullable|date',
            'status' => 'required',
        ];
    }
}
