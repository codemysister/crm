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
            'partner.sales' => 'required|array',
            'partner.account_manager.name' => 'nullable|string',
            'partner.account_manager.id' => 'nullable|exists:users,id',
            'partner.name' => 'required|string|max:255',
            'partner.phone_number' => 'required|string|max:20',
            'partner.province' => 'required',
            'partner.regency' => 'required',
            'partner.subdistrict' => 'required',
            'partner.address' => 'nullable|string',
            'partner.onboarding_date' => 'required|date',
            'partner.onboarding_age' => 'nullable|integer',
            'partner.live_date' => 'nullable|date',
            'partner.live_age' => 'nullable|integer',
            'partner.monitoring_date_after_3_month_live' => 'nullable|date',
            'partner.status' => 'required',

            'pic.name' => 'required|string|max:255',
            'pic.number' => 'required|string|max:20',
            'pic.position' => 'required|string|max:255',
            'pic.email' => 'required|email|max:255',

            'bank.bank' => 'required|string',
            'bank.account_bank_number' => 'required|string',
            'bank.account_bank_name' => 'required|string',

            'subscription.nominal' => 'required|numeric',
            'subscription.period' => 'required',
            'subscription.price_card' => 'required',
            'subscription.ppn' => 'required|numeric',
            'subscription.total_bill' => 'required|numeric',
            'subscription.price_training_online' => 'nullable|numeric',
            'subscription.price_training_offline' => 'nullable|numeric',
            'subscription.price_lanyard' => 'nullable|numeric',
            'subscription.price_subscription_system' => 'nullable|numeric',
            'subscription.fee_purchase_cazhpoin' => 'nullable|numeric',
            'subscription.fee_bill_cazhpoin' => 'nullable|numeric',
            'subscription.fee_topup_cazhpos' => 'nullable|numeric',
            'subscription.fee_withdraw_cazhpos' => 'nullable|numeric',
            'subscription.fee_bill_saldokartu' => 'nullable|numeric',
        ];
    }
}
