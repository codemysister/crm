<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PartnerGeneralRequest extends FormRequest
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
            'partner.name' => 'required|unique:partners,name|string|max:255',
            'partner.logo' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
            'partner.pic' => 'required|string|max:255',
            'partner.total_members' => 'required',
            'partner.npwp' => 'required',
            'partner.sales' => 'required',
            'partner.account_manager' => 'required',
            'partner.onboarding_date' => 'required',
            'partner.province' => 'required',
            'partner.regency' => 'required',
            'partner.period' => 'required',
            'partner.billing_date' => 'required',
            'partner.payment_metode' => 'required',
            'partner.status' => 'required',
            'partner.email' => 'required',
            'partner.password' => 'required',
        ];


    }

    public function messages(): array
    {
        return [
            'partner.name.required' => 'Nama lembaga harus diiisi',
            'partner.name.unique' => 'Lembaga sudah ada',
            'partner.logo.image' => 'File harus berupa gambar.',
            'partner.logo.mimes' => 'Tipe file harus jpg, png, atau jpeg.',
            'partner.logo.max' => 'Ukuran file tidak boleh melebihi 2 MB.',
            'partner.total_members.required' => 'Total member harus diiisi',
            'partner.npwp.required' => 'NPWP harus diiisi',
            'partner.pic.required' => 'PIC harus diiisi',
            'partner.sales.required' => 'Sales lembaga harus diiisi',
            'partner.account_manager.required' => 'Account Manager lembaga harus diiisi',
            'partner.status.required' => 'Status lembaga harus diiisi',
            'partner.province.required' => 'Provinsi lembaga harus diiisi',
            'partner.regency.required' => 'Kab/kota lembaga harus diiisi',
            'partner.payment_metode.required' => 'Metode pembayaran harus diiisi',
            'partner.period.required' => 'Periode langganan harus diiisi',
            'partner.billing_date.required' => 'Tanggal penagihan harus diisi',
            'partner.onboarding_date.required' => 'Tanggal onboarding harus diisi',
            'partner.email.required' => 'Email harus diisi',
            'partner.password.required' => 'Password harus diisi',
        ];
    }
}
