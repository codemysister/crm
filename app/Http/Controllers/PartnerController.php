<?php

namespace App\Http\Controllers;

use App\Http\Requests\PartnerGeneralRequest;
use App\Http\Requests\PartnerRequest;
use App\Models\Partner;
use App\Models\PartnerAccountSetting;
use App\Models\PartnerBank;
use App\Models\PartnerPIC;
use App\Models\PartnerPriceList;
use App\Models\PartnerSubscription;
use App\Models\User;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
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
                },
                'sph' => function ($query) {
                    $query->with(['user', 'products'])->latest();
                },
            ])->where('uuid', '=', $uuid)->first();
        }
        return Inertia::render("Partner/Index", compact('partner'));
    }

    public function store(PartnerGeneralRequest $request)
    {
        $pathLogo = '';
        if ($request->hasFile('partner.logo')) {
            $file = $request->file('partner.logo');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $pathLogo = "images/logo/" . $filename;
            Storage::putFileAs('public/images/logo', $file, $filename);

        }

        $partner = Partner::create([
            'uuid' => Str::uuid(),
            'name' => $request['partner']['name'],
            'logo' => $pathLogo,
            'phone_number' => $request['partner']['phone_number'],
            'sales_id' => $request['partner']['sales']['id'],
            'account_manager_id' => $request['partner']['account_manager']['id'],
            'onboarding_date' => (new DateTime($request['partner']['onboarding_date']))->format('Y-m-d H:i:s'),
            'live_date' => $request['partner']['live_date'] !== null ? (new DateTime($request['partner']['live_date']))->format('Y-m-d H:i:s') : null,
            'onboarding_age' => $request['partner']['onboarding_age'],
            'live_age' => $request['partner']['live_age'],
            'monitoring_date_after_3_month_live' => (new DateTime($request['partner']['monitoring_date_after_3_month_live']))->format('Y-m-d H:i:s'),
            'province' => $request['partner']['province'],
            'regency' => $request['partner']['regency'],
            'subdistrict' => $request['partner']['subdistrict'],
            'address' => $request['partner']['address'],
            'status' => $request['partner']['status']['name'],
            'payment_metode' => $request['partner']['payment_metode'],
            'period' => $request['partner']['period']['name'],

        ]);

        $pic = PartnerPIC::create([
            'uuid' => Str::uuid(),
            'partner_id' => $partner->id,
            'name' => $request['pic']['name'],
            'number' => $request['pic']['number'],
            'email' => $request['pic']['email'],
            'position' => $request['pic']['position'],
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
            'bill' => $request['subscription']['bill'],
            'nominal' => $request['subscription']['nominal'],
            'ppn' => $request['subscription']['ppn'],
            'total_ppn' => $request['subscription']['total_ppn'],
            'total_bill' => $request['subscription']['total_bill'],
        ]);

        $price_list = PartnerPriceList::create([
            'uuid' => Str::uuid(),
            'partner_id' => $partner->id,
            'price_card' => json_encode([
                'price' => $request['price_list']['price_card']['price'],
                'type' => $request['price_list']['price_card']['price'] !== null ? $request['price_list']['price_card']['type']['name'] : '',
            ]),
            'price_lanyard' => $request['price_list']['price_lanyard'],
            'price_subscription_system' => $request['price_list']['price_subscription_system'],
            'price_training_offline' => $request['price_list']['price_training_offline'],
            'price_training_online' => $request['price_list']['price_training_online'],
            'fee_purchase_cazhpoin' => $request['price_list']['fee_purchase_cazhpoin'],
            'fee_bill_cazhpoin' => $request['price_list']['fee_bill_cazhpoin'],
            'fee_topup_cazhpos' => $request['price_list']['fee_topup_cazhpos'],
            'fee_withdraw_cazhpos' => $request['price_list']['fee_withdraw_cazhpos'],
            'fee_bill_saldokartu' => $request['price_list']['fee_bill_saldokartu'],
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
            'province' => $request['partner']['province'],
            'regency' => $request['partner']['regency'],
            'subdistrict' => $request['partner']['subdistrict'],
            'address' => $request['partner']['address'],
            'status' => $request['partner']['status']
        ]);
    }

    public function updateDetailPartner(Request $request, $uuid)
    {
        $partner = Partner::where('uuid', $uuid)->first();
        $pathLogo = null;
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            if ($file->getClientOriginalName() == 'blob') {
                $pathLogo = $partner->logo;
            } else {
                Storage::delete('public/' . $partner->logo);
                $filename = time() . '.' . $file->getClientOriginalExtension();
                $pathLogo = "images/logo/" . $filename;
                Storage::putFileAs('public/images/logo', $file, $filename);
            }
        } else {
            if (!$partner->logo) {
                Storage::delete('public/' . $partner->logo);
                $pathLogo = null;
            }
        }

        $partner->update([
            'name' => $request['name'],
            'phone_number' => $request['phone_number'],
            'logo' => $pathLogo,
            'sales_id' => $request['sales']['id'],
            'account_manager_id' => $request['account_manager'] ? $request['account_manager']['id'] : null,
            'onboarding_date' => (new DateTime($request['onboarding_date']))->format('Y-m-d H:i:s'),
            'live_date' => (new DateTime($request['live_date']))->format('Y-m-d H:i:s'),
            'onboarding_age' => $request['onboarding_age'],
            'live_age' => $request['live_age'],
            'monitoring_date_after_3_month_live' => (new DateTime($request['monitoring_date_after_3_month_live']))->format('Y-m-d H:i:s'),
            'province' => $request['province'],
            'regency' => $request['regency'],
            'subdistrict' => $request['subdistrict'],
            'address' => $request['address'],
            'status' => $request['status']
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
            },

        ])->latest()->get();
        $salesDefault = User::role('account executive')->get();
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
            },
            'sph' => function ($query) {
                $query->with(['user', 'products'])->latest();
            },


        ])->where('uuid', '=', $uuid)->first();
        return response()->json($partner);
    }

    // public function apiGetPartner($uuid)
    // {
    //     dd('oke');
    //     $partner = Partner::with([
    //         'sales',
    //         'account_manager',
    //         'pics' => function ($query) {
    //             $query->latest();
    //         },
    //         'subscription' => function ($query) {
    //             $query->latest();
    //         },
    //         'banks' => function ($query) {
    //             $query->latest();
    //         },
    //         'accounts' => function ($query) {
    //             $query->latest();
    //         }
    //     ])->where('uuid', $uuid)->get();

    //     return response()->json([
    //         'partner' => $partner
    //     ]);
    // }
}
