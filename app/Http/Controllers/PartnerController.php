<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use App\Models\PartnerPIC;
use App\Models\PartnerSubscription;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PartnerController extends Controller
{
    public function index()
    {   
        $partnersDefault = Partner::with(['sales', 'account_manager', 'pics'])->get();
        $picsDefault = PartnerPIC::with('partner')->get();
        $salesDefault = User::role('sales')->get();
        $accountManagerDefault = User::role('account manager')->get();

        return Inertia::render("Partner/Index", compact("partnersDefault", "salesDefault", 'accountManagerDefault', 'picsDefault'));
    }

    public function store(Request $request)
    {
        $partner = Partner::create([
            'uuid' => Str::uuid(),
            'name'=> $request['partner']['name'],
            'sales_id' => $request['partner']['sales']['id'],
            'account_manager_id' => $request['partner']['account_manager']['id'],
            'register_date' => $request['partner']['register_date'],
            'live_date' => $request['partner']['live_date'],
            'address' => $request['partner']['address'],
            'status' => $request['partner']['status']['name']
        ]);

        $pic = PartnerPIC::create([
            'uuid' => Str::uuid(),
            'partner_id' => $partner->id,
            'name' => $request['pic']['name'],
            'number' => $request['pic']['number'],
            'position' => $request['pic']['position'],
            'address' => $request['pic']['address']
        ]);

        $subscription = PartnerSubscription::create([
            'uuid' => Str::uuid(),
            'partner_id' => $partner->id,
            'nominal' => $request['subscription']['nominal'],
            'period' => $request['subscription']['period'],
            'bank' => $request['subscription']['bank'],
            'account_bank_number' => $request['subscription']['account_bank_number'],
            'account_bank_name' => $request['subscription']['account_bank_name']
        ]);
    }

    public function update(Request $request, $uuid)
    {

        Partner::where('uuid', $uuid)->first()->update([
            'name'=> $request['partner']['name'],
            'sales_id' => $request['partner']['sales']['id'],
            'account_manager_id' => $request['partner']['account_manager']['id'],
            'register_date' => $request['partner']['register_date'],
            'live_date' => $request['partner']['live_date'],
            'address' => $request['partner']['address'],
            'status' => $request['partner']['status']
        ]);
    }

    public function destroy($uuid)
    {
        Partner::where('uuid', $uuid)->delete();
    }

    public function apiGetPartners()
    {   
        $partnersDefault = Partner::with(['sales', 'account_manager'])->get();
        $salesDefault = User::role('sales')->get();
        $accountManagerDefault = User::role('account manager')->get();

        return response()->json([
            'partners' => $partnersDefault,
            'sales' => $salesDefault,
            'account_managers' => $accountManagerDefault
        ]);
    }
}
