<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvoiceGeneralRequest extends FormRequest
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
            'partner.province' => 'required',
            'partner.regency' => 'required',
            'partner.number' => 'required',
            'date' => 'required',
            'due_date' => 'required',
            'total' => 'required',
            'total_all_ppn' => 'required',
            'paid_off' => 'required',
            'rest_of_bill' => 'required',
            'payment_metode' => 'required',
            'signature' => 'required',
        ];
    }
}
