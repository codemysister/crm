<?php

namespace App\Http\Controllers;

use App\Http\Requests\PartnerPriceListRequest;
use App\Models\PartnerPriceList;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PartnerPriceListController extends Controller
{
    public function apiGetPriceLists()
    {
        $priceLists = PartnerPriceList::with('partner')->latest()
            ->get();
        return response()->json($priceLists);
    }

    public function store(PartnerPriceListRequest $request)
    {
        PartnerPriceList::create([
            'uuid' => Str::uuid(),
            'partner_id' => $request["partner"]["id"],
            'price_card' => json_encode([
                'price' => $request['price_card']['price'],
                'type' => $request['price_card']['price'] !== null ? $request['price_card']['type']['name'] : '',
            ]),
            'price_lanyard' => $request['price_lanyard'],
            'price_subscription_system' => $request['price_subscription_system'],
            'price_training_offline' => $request['price_training_offline'],
            'price_training_online' => $request['price_training_online'],
            'fee_purchase_cazhpoin' => $request['fee_purchase_cazhpoin'],
            'fee_bill_cazhpoin' => $request['fee_bill_cazhpoin'],
            'fee_topup_cazhpos' => $request['fee_topup_cazhpos'],
            'fee_withdraw_cazhpos' => $request['fee_withdraw_cazhpos'],
            'fee_bill_saldokartu' => $request['fee_bill_saldokartu'],
        ]);
    }

    public function update(PartnerPriceListRequest $request, $uuid)
    {
        PartnerPriceList::where('uuid', $uuid)->first()->update([
            'uuid' => Str::uuid(),
            'partner_id' => $request["partner"]["id"],
            'price_card' => json_encode([
                'price' => $request['price_card']['price'],
                'type' => $request['price_card']['price'] !== null ? $request['price_card']['type'] : '',
            ]),
            'price_lanyard' => $request['price_lanyard'],
            'price_subscription_system' => $request['price_subscription_system'],
            'price_training_offline' => $request['price_training_offline'],
            'price_training_online' => $request['price_training_online'],
            'fee_purchase_cazhpoin' => $request['fee_purchase_cazhpoin'],
            'fee_bill_cazhpoin' => $request['fee_bill_cazhpoin'],
            'fee_topup_cazhpos' => $request['fee_topup_cazhpos'],
            'fee_withdraw_cazhpos' => $request['fee_withdraw_cazhpos'],
            'fee_bill_saldokartu' => $request['fee_bill_saldokartu'],
        ]);
    }

    public function destroy($uuid)
    {
        PartnerPriceList::where('uuid', $uuid)->delete();
    }
}
