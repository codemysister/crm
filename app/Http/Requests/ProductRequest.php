<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
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
            'name' => 'required',
            'category' => 'required',
            'unit' => 'required',
            'price' => 'required',
            'description' => 'required',
        ];
    }



    public function messages(): array
    {
        return [
            'name.required' => 'Nama harus diiisi',
            'category.required' => 'Kategori harus diiisi',
            'unit.required' => 'Unit harus diiisi',
            'price.required' => 'Harga harus diiisi',
            'description.required' => 'Deskripsi harus diiisi',
        ];
    }
}
