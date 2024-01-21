<?php

namespace App\Http\Controllers;

use App\Models\PartnerSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PartnerSubscriptionController extends Controller
{
    public function apiGetSubscription()
    {
        $subscriptions = PartnerSubscription::with([
            'partner.sales',
            'partner.account_manager',
            'partner.pics' => function ($query) {
                $query->latest();
            },
            'partner.subscription' => function ($query) {
                $query->latest();
            },
            'partner.banks' => function ($query) {
                $query->latest();
            }
        ])
            ->get();
        return response()->json($subscriptions);
    }

    public function store(Request $request)
    {
        PartnerSubscription::create([
            'uuid' => Str::uuid(),
            'partner_id' => $request["partner"]["id"],
            'nominal' => $request->nominal,
            'period' => $request->period,
            'price_card' => json_encode([
                'price' => $request['price_card']['price'],
                'type' => $request['price_card']['price'] !== null ? $request['price_card']['type']['name'] : null,
            ]),
            'price_lanyard' => $request['price_lanyard'],
            'price_subscription_system' => $request['price_subscription_system'],
            'price_training' => json_encode([
                'price' => $request['price_training']['price'],
                'type' => $request['price_training']['price'] !== null ? $request['price_training']['type']['name'] : null,
            ])
        ]);
    }

    public function update(Request $request, $uuid)
    {
        PartnerSubscription::where('uuid', $uuid)->first()->update([
            'uuid' => Str::uuid(),
            'partner_id' => $request["partner"]["id"],
            'nominal' => $request->nominal,
            'period' => $request->period,
            'price_card' => json_encode([
                'price' => $request['price_card']['price'],
                'type' => $request['price_card']['price'] !== null ? $request['price_card']['type'] : null,
            ]),
            'price_lanyard' => $request['price_lanyard'],
            'price_subscription_system' => $request['price_subscription_system'],
            'price_training' => json_encode([
                'price' => $request['price_training']['price'],
                'type' => $request['price_training']['price'] !== null ? $request['price_training']['type'] : null,
            ])
        ]);
    }

    public function destroy($uuid)
    {
        PartnerSubscription::where('uuid', $uuid)->delete();
    }
}
