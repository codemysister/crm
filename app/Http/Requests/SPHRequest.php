<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SPHRequest extends FormRequest
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
            'products' => 'required',
            'partner.name' => 'required|unique:sphs,partner_name',
            'partner.province' => 'required',
            'partner.regency' => 'required',
            'partner.pic' => 'required',
            'sales.name' => 'required',
            'sales.email' => 'required',
            'sales.wa' => 'required',
        ];
    }


    public function messages(): array
    {
        return [
            'partner.name.required' => 'Lembaga harus diiisi',
            'partner.name.unique' => 'Lembaga sudah memiliki SPH',
            'partner.province.required' => 'Provinsi harus diiisi',
            'partner.regency.required' => 'Kabupaten harus diiisi',
            'partner.pic.required' => 'PIC harus diiisi',
            'products.required' => 'Produk harus diiisi',
            'sales.name.required' => 'Sales harus diiisi',
            'sales.email.required' => 'Email Sales harus diiisi',
            'sales.wa.required' => 'WA Sales harus diiisi',
        ];
    }
}
