<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UserRequest extends FormRequest
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
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => 'required'
        ];
    }

    public function messages(): array
    {
        return [
            'name' => 'Nama harus diiisi',
            'email' => 'Email harus diiisi',
            'password.required' => 'Password harus diiisi',
            'password.confirmed' => 'Konfirmasi password tidak sesuai',
            'role.required' => 'Role harus diiisi',
        ];
    }
}
