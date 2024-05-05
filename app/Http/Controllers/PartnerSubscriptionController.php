<?php

namespace App\Http\Controllers;

use App\Http\Requests\PartnerSubscriptionRequest;
use App\Models\Partner;
use App\Models\PartnerSubscription;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class PartnerSubscriptionController extends Controller
{
    public function index(Request $request)
    {
        $usersProp = User::with('roles')->get();
        $partnersProp = Partner::with(['status'])->get();
        return Inertia::render("Partner/Subscription/Index", compact('partnersProp', 'usersProp'));
    }
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
            'created_by' => Auth::user()->id
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

    public function filter(Request $request)
    {
        $subscriptions = PartnerSubscription::with([
            'partner',
            'createdBy'
        ]);

        if ($request->user) {
            $subscriptions->where('created_by', $request->user['id']);
        }

        if ($request->input_date['start'] && $request->input_date['end']) {
            $subscriptions->whereBetween('created_at', [$request->input_date['start'], $request->input_date['end']]);
        }


        $subscriptions = $subscriptions->latest()->get();

        return response()->json($subscriptions);
    }


    public function apiGetLogs($partner_id)
    {
        $logs = Activity::with(['causer', 'subject'])
            ->whereHasMorph('subject', [PartnerSubscription::class], function ($query) use ($partner_id) {
                $query->where('partner_id', $partner_id);
            })
            ->latest()
            ->get();

        return response()->json($logs);
    }

    public function destroy($uuid)
    {
        PartnerSubscription::where('uuid', $uuid)->delete();
    }
}
