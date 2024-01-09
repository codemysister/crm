<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use App\Models\PartnerBank;
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
        return Inertia::render("Partner/Index");
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

        $bank = PartnerBank::create([
            'uuid' => Str::uuid(),
            'partner_id' => $partner->id,
            'bank' => $request['bank']['bank'],
            'account_bank_number' => $request['bank']['account_bank_number'],
            'account_bank_name' => $request['bank']['account_bank_name']
        ]);

        $subscription = PartnerSubscription::create([
            'uuid' => Str::uuid(),
            'partner_id' => $partner->id,
            'nominal' => $request['subscription']['nominal'],
            'period' => $request['subscription']['period'],
            'price_card' => json_encode([
                'price' => $request['subscription']['price_card']['price'],
                'type' => $request['subscription']['price_card']['price'] !== null ?  $request['subscription']['price_card']['type']['name'] : '',
            ]),
            'price_lanyard' => $request['subscription']['price_lanyard'],
            'price_subscription_system' => $request['subscription']['price_subscription_system'],
            'price_training' => json_encode([
                'price' => $request['subscription']['price_training']['price'],
                'type' => $request['subscription']['price_training']['price'] !== null ? $request['subscription']['price_training']['type']['name'] : '' ,
            ])
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
        $partnersDefault = Partner::with(['sales', 'account_manager', 
        'pics'  => function($query) {
        $query->latest();
        }, 'subscription'  => function($query) {
            $query->latest();
        }, 'banks' => function($query) {
            $query->latest();
        }])->get();
        $salesDefault = User::role('sales')->get();
        $accountManagerDefault = User::role('account manager')->get();

        return response()->json([
            'partners' => $partnersDefault,
            'sales' => $salesDefault,
            'account_managers' => $accountManagerDefault
        ]);
    }

    public function apiGetPartner($uuid)
    {   
        $partner = Partner::with(['sales', 'account_manager', 
            'pics'  => function($query) {
            $query->latest();
        }, 'subscription'  => function($query) {
            $query->latest();
        }, 'banks' => function($query) {
            $query->latest();
        }])->where('uuid', $uuid)->get();
        
        return response()->json([
            'partner' => $partner
        ]);
    }
}
