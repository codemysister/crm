<?php

namespace App\Http\Controllers;

use App\Models\PartnerSubscription;
use Illuminate\Http\Request;

class PartnerSubscriptionController extends Controller
{
    public function apiGetSubscription()
    {
        $subscriptions = PartnerSubscription::with('partner')->get();
        return response()->json($subscriptions);
    }
}
