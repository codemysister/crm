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
            "partner_name" => "required",
            "partner_pic" => "required",
            "partner_pic_position" => "required",
            "partner_address" => "required",
            "url_subdomain" => "required",
            "price_card" => "required|integer",
            "price_lanyard" => "required|integer",
            "nominal_subscription" => "required|integer",
            "period_subscription" => "required",
            "price_training_offline" => "required|integer",
            "price_training_online" => "required|integer",
            "fee_purchase_cazhpoin" => "required|integer",
            "fee_bill_cazhpoin" => "required|integer",
            "fee_topup_cazhpos" => "required|integer",
            "fee_withdraw_cazhpos" => "required|integer",
            "fee_bill_saldokartu" => "required|integer",
            "bank" => "required",
            "account_bank_number" => "required",
            "account_bank_name" => "required",
            "expired_date" => "required",
            "profit_sharing" => "required",
            "signature_name" => "required",
            "signature_position" => "required",
            "signature_image" => "required",
        ];
    }
}
