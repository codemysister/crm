<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use App\Models\PartnerAccountSetting;
use App\Models\PartnerBank;
use App\Models\PartnerPIC;
use App\Models\PartnerSubscription;
use App\Models\User;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PartnerController extends Controller
{
    public function index(Request $request)
    {
        $uuid = $request->query('uuid');
        $partner = null;
        if ($uuid) {
            $partner = Partner::with([
                'sales',
                'account_manager',
                'pics' => function ($query) {
                    $query->latest();
                },
                'subscription' => function ($query) {
                    $query->latest();
                },
                'banks' => function ($query) {
                    $query->latest();
                }
            ])->where('uuid', '=', $uuid)->first();
        }
        return Inertia::render("Partner/Index", compact('partner'));
    }

    public function store(Request $request)
    {

        $partner = Partner::create([
            'uuid' => Str::uuid(),
            'name' => $request['partner']['name'],
            'phone_number' => $request['partner']['phone_number'],
            'sales_id' => $request['partner']['sales']['id'],
            'account_manager_id' => $request['partner']['account_manager']['id'],
            'onboarding_date' => (new DateTime($request['partner']['onboarding_date']))->format('Y-m-d H:i:s'),
            'live_date' => (new DateTime($request['partner']['live_date']))->format('Y-m-d H:i:s'),
            'onboarding_age' => $request['partner']['onboarding_age'],
            'live_age' => $request['partner']['live_age'],
            'monitoring_date_after_3_month_live' => (new DateTime($request['partner']['monitoring_date_after_3_month_live']))->format('Y-m-d H:i:s'),
            'address' => $request['partner']['address'],
            'status' => $request['partner']['status']['name']
        ]);

        $pic = PartnerPIC::create([
            'uuid' => Str::uuid(),
            'partner_id' => $partner->id,
            'name' => $request['pic']['name'],
            'number' => $request['pic']['number'],
            'email' => $request['pic']['email'],
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

        $account = PartnerAccountSetting::create([
            'uuid' => Str::uuid(),
            'partner_id' => $partner->id,
            'subdomain' => $request['account_setting']['subdomain'],
            'email_super_admin' => $request['account_setting']['email_super_admin'],
            'cas_link_partner' => $request['account_setting']['cas_link_partner'],
            'card_number' => $request['account_setting']['card_number']
        ]);

        $subscription = PartnerSubscription::create([
            'uuid' => Str::uuid(),
            'partner_id' => $partner->id,
            'nominal' => $request['subscription']['nominal'],
            'ppn' => $request['subscription']['ppn'],
            'total_bill' => $request['subscription']['total_bill'],
            'period' => $request['subscription']['period']['name'],
            'price_card' => json_encode([
                'price' => $request['subscription']['price_card']['price'],
                'type' => $request['subscription']['price_card']['price'] !== null ? $request['subscription']['price_card']['type']['name'] : '',
            ]),
            'price_lanyard' => $request['subscription']['price_lanyard'],
            'price_subscription_system' => $request['subscription']['price_subscription_system'],
            'price_training_offline' => $request['subscription']['price_training_offline'],
            'price_training_online' => $request['subscription']['price_training_online'],
            'fee_purchase_cazhpoin' => $request['subscription']['fee_purchase_cazhpoin'],
            'fee_bill_cazhpoin' => $request['subscription']['fee_bill_cazhpoin'],
            'fee_topup_cazhpos' => $request['subscription']['fee_topup_cazhpos'],
            'fee_withdraw_cazhpos' => $request['subscription']['fee_withdraw_cazhpos'],
            'fee_bill_saldokartu' => $request['subscription']['fee_bill_saldokartu'],
        ]);
    }

    public function update(Request $request, $uuid)
    {

        Partner::where('uuid', $uuid)->first()->update([
            'name' => $request['partner']['name'],
            'phone_number' => $request['partner']['phone_number'],
            'sales_id' => $request['partner']['sales']['id'],
            'account_manager_id' => $request['partner']['account_manager']['id'],
            'onboarding_date' => (new DateTime($request['partner']['onboarding_date']))->format('Y-m-d H:i:s'),
            'live_date' => (new DateTime($request['partner']['live_date']))->format('Y-m-d H:i:s'),
            'onboarding_age' => $request['partner']['onboarding_age'],
            'live_age' => $request['partner']['live_age'],
            'monitoring_date_after_3_month_live' => (new DateTime($request['partner']['monitoring_date_after_3_month_live']))->format('Y-m-d H:i:s'),
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
        $partnersDefault = Partner::with([
            'sales',
            'account_manager',
            'pics' => function ($query) {
                $query->latest();
            },
            'subscription' => function ($query) {
                $query->latest();
            },
            'banks' => function ($query) {
                $query->latest();
            }
        ])->get();
        $salesDefault = User::role('sales')->get();
        $accountManagerDefault = User::role('account manager')->get();

        return response()->json([
            'partners' => $partnersDefault,
            'sales' => $salesDefault,
            'account_managers' => $accountManagerDefault
        ]);
    }

    public function show($uuid)
    {
        $partner = Partner::with([
            'sales',
            'account_manager',
            'pics' => function ($query) {
                $query->latest();
            },
            'subscription' => function ($query) {
                $query->latest();
            },
            'banks' => function ($query) {
                $query->latest();
            }
        ])->where('uuid', '=', $uuid)->first();
        return response()->json($partner);
    }

    public function apiGetPartner($uuid)
    {
        $partner = Partner::with([
            'sales',
            'account_manager',
            'pics' => function ($query) {
                $query->latest();
            },
            'subscription' => function ($query) {
                $query->latest();
            },
            'banks' => function ($query) {
                $query->latest();
            }
        ])->where('uuid', $uuid)->get();

        return response()->json([
            'partner' => $partner
        ]);
    }
}
