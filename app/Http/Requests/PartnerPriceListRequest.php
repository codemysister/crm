<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PartnerPriceListRequest extends FormRequest
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
            'price_card' => 'required',
            'price_lanyard' => 'required',
            'price_subscription_system' => 'required',
            'price_training_offline' => 'required',
            'price_training_online' => 'required',
            'fee_purchase_cazhpoin' => 'required',
            'fee_bill_cazhpoin' => 'required',
            'fee_topup_cazhpos' => 'required',
            'fee_withdraw_cazhpos' => 'required',
            'fee_bill_saldokartu' => 'required',
        ];
    }


    public function messages(): array
    {
        return [
            'partner.required' => 'Lembaga harus diiisi',
            'price_card.required' => 'Harga kartu harus diiisi',
            'price_lanyard.required' => 'Harga lanyard harus diiisi',
            'price_subscription_system.required' => 'Harga langganan sistem harus diiisi',
            'price_training_offline.required' => 'Harga pelatihan offline harus diiisi',
            'price_training_online.required' => 'Harga pelatihan online harus diiisi',
            'fee_purchase_cazhpoin.required' => 'Harga isi cazhpoin harus diiisi',
            'fee_bill_cazhpoin.required' => 'Harga bayar tagihan cazhpoin harus diiisi',
            'fee_topup_cazhpos.required' => 'Harga topup cazhpos harus diiisi',
            'fee_withdraw_cazhpos.required' => 'Harga withdraw cazhpos harus diiisi',
            'fee_bill_saldokartu.required' => 'Harga bayar tagihan saldokartu harus diiisi',
        ];
    }
}
