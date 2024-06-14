<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PlaylistRequest extends FormRequest
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
            'title' => 'required',
            'description' => 'required',
            'thumbnail' => 'required'
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul harus diiisi',
            'description.required' => 'Deskripsi harus diisi',
            'thumbnail.required' => 'Thumbnail harus diisi'
        ];
    }
}
