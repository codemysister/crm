<?php

namespace App\Http\Controllers;

use App\Models\PartnerSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PartnerSubscriptionController extends Controller
{
    public function apiGetSubscription()
    {
        $subscriptions = PartnerSubscription::with('partner')
            ->get();
        return response()->json($subscriptions);
    }

    public function store(Request $request)
    {
        PartnerSubscription::create([
            'uuid' => Str::uuid(),
            'partner_id' => $request["partner"]["id"],
            'bill' => $request['bill'],
            'nominal' => $request['nominal'],
            'total_ppn' => $request['total_ppn'],
            'ppn' => $request['ppn'],
            'total_bill' => $request['total_bill'],
            // 'period' => $request['period'],
            // 'price_card' => json_encode([
            //     'price' => $request['price_card']['price'],
            //     'type' => $request['price_card']['price'] !== null ? $request['price_card']['type'] : '',
            // ]),
            // 'price_lanyard' => $request['price_lanyard'],
            // 'price_subscription_system' => $request['price_subscription_system'],
            // 'price_training_offline' => $request['price_training_offline'],
            // 'price_training_online' => $request['price_training_online'],
            // 'fee_purchase_cazhpoin' => $request['fee_purchase_cazhpoin'],
            // 'fee_bill_cazhpoin' => $request['fee_bill_cazhpoin'],
            // 'fee_topup_cazhpos' => $request['fee_topup_cazhpos'],
            // 'fee_withdraw_cazhpos' => $request['fee_withdraw_cazhpos'],
            // 'fee_bill_saldokartu' => $request['fee_bill_saldokartu'],
        ]);
    }

    public function update(Request $request, $uuid)
    {
        PartnerSubscription::where('uuid', $uuid)->first()->update([
            'uuid' => Str::uuid(),
            'partner_id' => $request["partner"]["id"],
            'bill' => $request['bill'],
            'nominal' => $request['nominal'],
            'total_ppn' => $request['total_ppn'],
            'ppn' => $request['ppn'],
            'total_bill' => $request['total_bill'],
        ]);
    }

    public function destroy($uuid)
    {
        PartnerSubscription::where('uuid', $uuid)->delete();
    }
}
