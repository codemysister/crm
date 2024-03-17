<?php

namespace App\Http\Controllers;

use App\Http\Requests\PartnerSubscriptionRequest;
use App\Models\PartnerSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PartnerSubscriptionController extends Controller
{
    public function apiGetSubscription()
    {
        $subscriptions = PartnerSubscription::with('partner')->latest()
            ->get();
        return response()->json($subscriptions);
    }

    public function store(PartnerSubscriptionRequest $request)
    {
        PartnerSubscription::create([
            'uuid' => Str::uuid(),
            'partner_id' => $request["partner"]["id"],
            'bill' => $request['bill'],
            'nominal' => $request['nominal'],
            'total_ppn' => $request['total_ppn'],
            'ppn' => $request['ppn'],
            'total_bill' => $request['total_bill'],
        ]);
    }

    public function update(PartnerSubscriptionRequest $request, $uuid)
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
