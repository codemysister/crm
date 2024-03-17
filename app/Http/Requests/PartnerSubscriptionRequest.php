<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PartnerSubscriptionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'partner' => 'required',
            'bill' => 'required',
            'nominal' => 'required',
            'ppn' => 'required',
            'total_ppn' => 'required',
            'total_bill' => 'required',
        ];
    }


    public function messages(): array
    {
        return [
            'partner.required' => 'Lembaga harus diiisi',
            'bill.required' => 'Tagihan harus diiisi',
            'nominal.required' => 'Nominal tagihan harus diiisi',
            'ppn.required' => 'Pajak harus diiisi',
            'total_ppn.required' => 'Total pajak harus diiisi',
            'total_bill.required' => 'Total tagihan harus diiisi',
        ];
    }
}
