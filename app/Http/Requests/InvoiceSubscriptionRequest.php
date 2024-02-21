<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvoiceSubscriptionRequest extends FormRequest
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
            'date' => 'required',
            'due_date' => 'required',
            'partner' => 'required',
            'bills' => 'required',
            'signature' => 'required',
            'total_nominal' => 'required',
            'total_ppn' => 'required',
            'paid_off' => 'required',
            'payment_metode' => 'required',
        ];
    }
}
