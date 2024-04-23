<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MemoRequest extends FormRequest
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
            'price_card' => 'required',
            'price_e_card' => 'required',
            'price_subscription' => 'required',
            'consideration' => 'required',

        ];
    }


    public function messages(): array
    {
        return [
            'partner.name' => 'Lembaga harus diisi',
            'price_card' => 'Harga kartu harus diisi',
            'price_e_card' => 'Harga E-Card harus diisi',
            'price_subscription' => 'Harga langganan harus diisi',
            'consideration' => 'Pertimbangan harus diisi',
        ];
    }
}
