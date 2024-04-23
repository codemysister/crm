<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MOURequest extends FormRequest
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
            "code" => "required",
            "day" => "required",
            "date" => "required",
            "partner.name" => "required",
            "partner.province" => "required",
            "partner.regency" => "required",
            "partner.pic" => 'required',
            "partner.pic_position" => 'required',
            "url_subdomain" => "required",
            "price_card" => "required|integer",
            "price_lanyard" => "required|integer",
            "price_subscription_system" => "required|integer",
            "period_subscription" => "required",
            "price_training_offline" => "required|integer",
            "price_training_online" => "required|integer",
            "fee_qris" => "required",
            "fee_purchase_cazhpoin" => "required|integer",
            "fee_bill_cazhpoin" => "required|integer",
            "fee_topup_cazhpos" => "required|integer",
            "fee_withdraw_cazhpos" => "required|integer",
            "fee_bill_saldokartu" => "required|integer",
            "partner.bank" => "required",
            "partner.account_bank_number" => "required",
            "partner.account_bank_name" => "required",
            "expired_date" => "required",
            "profit_sharing" => "required",
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Kode harus diiisi',
            'date.required' => 'Tanggal kesepakatan harus diiisi',
            'partner.name.required' => 'Lembaga harus diiisi',
            'partner.province.required' => 'Provinsi lembaga harus diiisi',
            'partner.regency.required' => 'Kota lembaga harus diiisi',
            'partner.pic.required' => 'PIC lembaga harus diiisi',
            'partner.pic_position.required' => 'Jabatan PIC harus diiisi',
            'url_subdomain.required' => 'URL subdomain harus diiisi',
            'price_card.required' => 'Harga kartu harus diiisi',
            'price_lanyard.required' => 'Harga lanyard harus diiisi',
            'price_subscription_system.required' => 'Harga langganan sistem harus diiisi',
            'period_subscription.required' => 'Periode langganan harus diiisi',
            'price_training_offline.required' => 'Harga training offline harus diiisi',
            'price_training_online.required' => 'Harga training online harus diiisi',
            'fee_qris.required' => 'Harga QRIS harus diiisi',
            'fee_purchase_cazhpoin.required' => 'Harga isi kartu via cazhpoin harus diiisi',
            'fee_bill_cazhpoin.required' => 'Harga bayar tagihan via cazhpoin harus diiisi',
            'fee_topup_cazhpos.required' => 'Harga topup kartu via cazhpos harus diiisi',
            'fee_bill_saldokartu.required' => 'Harga bayar tagihan via saldokartu harus diiisi',
            'partner.bank.required' => 'Bank lembaga harus diiisi',
            'partner.account_bank_number.required' => 'Nomor rekening lembaga harus diiisi',
            'partner.account_bank_name.required' => 'Atas nama bank lembaga harus diiisi',
            'expired_date.required' => 'Tanggal kadaluarsa harus diiisi',
        ];
    }
}
