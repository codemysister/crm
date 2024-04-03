<?php

namespace App\Http\Controllers;

use App\Http\Requests\PartnerGeneralRequest;
use App\Http\Requests\PartnerRequest;
use App\Imports\PartnerImport;
use App\Models\Partner;
use App\Models\PartnerAccountSetting;
use App\Models\PartnerBank;
use App\Models\PartnerPIC;
use App\Models\PartnerPriceList;
use App\Models\PartnerSubscription;
use App\Models\Status;
use App\Models\User;
use Carbon\Carbon;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\Activitylog\Models\Activity;

class PartnerController extends Controller
{
    public function index(Request $request)
    {
        $uuid = $request->query('uuid');
        $usersProp = User::with('roles')->get();
        $partner = null;
        if ($uuid) {
            $partner = Partner::with([
                'sales',
                'referral',
                'status',
                'account_manager',
                'pics' => function ($query) {
                    $query->latest();
                },
                'subscriptions' => function ($query) {
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

        $statusProp = Status::where('category', 'partner')->get();
        return Inertia::render("Partner/Index", compact('partner', 'usersProp', 'statusProp'));
    }

    public function filter(Request $request)
    {
        $partners = Partner::with([
            'sales',
            'referral',
            'status',
            'account_manager',
            'pics' => function ($query) {
                $query->latest();
            },
            'subscriptions' => function ($query) {
                $query->latest();
            },
            'banks' => function ($query) {
                $query->latest();
            },
            'price_list',
        ]);

        if ($request->user) {
            $partners->where('created_by', $request->user['id']);
        }

        if ($request->status) {
            $partners->whereHas('status', function ($query) use ($request) {
                $query->where('status_id', $request->status['id']);
            });
        }

        if ($request->account_manager) {
            $partners->where('account_manager_id', $request->account_manager['id']);
        }

        if ($request->sales) {
            $partners->where('sales_id', $request->sales['id']);
        }

        if ($request->referral) {
            $partners->where('referral_id', $request->referral['id']);
        }

        if ($request->onboarding_date['start'] && $request->onboarding_date['end']) {
            $partners->whereBetween('onboarding_date', [$request->onboarding_date['start'], $request->onboarding_date['end']]);
        }

        if ($request->live_date['start'] && $request->live_date['end']) {
            $partners->whereBetween('live_date', [$request->live_date['start'], $request->live_date['end']]);
        }

        if ($request->province) {
            $partners->whereJsonContains('province->name', json_decode($request->province)->name);
        }


        $partners = $partners->get();

        return response()->json($partners);
    }

    public function import()
    {

        $imported = Excel::import(new PartnerImport, request()->file('partner.excell'));
        // Excel::queueImport(new PartnerImport, request()->file('partner.excell'));

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

        Partner::create([
            'uuid' => Str::uuid(),
            'name' => $request['partner']['name'],
            'logo' => $pathLogo,
            'npwp' => $request['partner']['npwp'] ?? null,
            'password' => $request['partner']['password'] ?? null,
            'phone_number' => $request['partner']['phone_number'] ?? null,
            'status_id' => $request['partner']['status']['id'],
            'sales_id' => $request['partner']['sales']['id'] ?? null,
            'referral_id' => $request['partner']['referral']['id'] ?? null,
            'account_manager_id' => $request['partner']['account_manager']['id'] ?? null,
            'onboarding_date' => Carbon::parse($request['partner']['onboarding_date'])->setTimezone('GMT+7')->format('Y-m-d H:i:s'),
            'live_date' => $request['partner']['live_date'] !== null ? Carbon::parse($request['partner']['live_date'])->setTimezone('GMT+7')->format('Y-m-d H:i:s') : null,
            'onboarding_age' => $request['partner']['onboarding_age'],
            'live_age' => $request['partner']['live_age'],
            'monitoring_date_after_3_month_live' => $request['partner']['monitoring_date_after_3_month_live'] !== null ? Carbon::parse($request['partner']['monitoring_date_after_3_month_live'])->setTimezone('GMT+7')->format('Y-m-d H:i:s') : null,
            'province' => $request['partner']['province'],
            'regency' => $request['partner']['regency'],
            'subdistrict' => $request['partner']['subdistrict'],
            'address' => $request['partner']['address'],
            'payment_metode' => $request['partner']['payment_metode'],
            'period' => $request['partner']['period']['name'] ?? $request['partner']['period'],
            'created_by' => Auth::user()->id
        ]);

    }


    public function update(PartnerGeneralRequest $request, $uuid)
    {
        $partner = Partner::where('uuid', $uuid)->first();
        $pathLogo = null;

        if ($request->hasFile('partner.logo')) {
            $file = $request->file('partner.logo');
            if ($file->getClientOriginalName() == 'blob') {
                $pathLogo = $partner->logo;
            } else {
                if ($partner->logo) {
                    Storage::delete('public/' . $partner->logo);
                    $filename = time() . '_' . rand() . '_' . $partner->id . '.' . $file->getClientOriginalExtension();
                    $pathLogo = "images/logo/" . $filename;
                    Storage::putFileAs('public/images/logo', $file, $filename);
                } else {
                    $filename = time() . '_' . rand() . '_' . $partner->id . '.' . $file->getClientOriginalExtension();
                    $pathLogo = "images/logo/" . $filename;
                    Storage::putFileAs('public/images/logo', $file, $filename);
                }
            }
        } else {
            if ($partner->logo) {
                Storage::delete('public/' . $partner->logo);
                $pathLogo = null;
            }
        }

        $partner->update([
            'name' => $request['partner']['name'],
            'logo' => $pathLogo,
            'npwp' => $request['partner']['npwp'] ?? null,
            'password' => $request['partner']['password'] ?? null,
            'phone_number' => $request['partner']['phone_number'] ?? null,
            'status_id' => $request['partner']['status']['id'],
            'sales_id' => $request['partner']['sales']['id'] ?? null,
            'referral_id' => $request['partner']['referral']['id'] ?? null,
            'account_manager_id' => $request['partner']['account_manager']['id'] ?? null,
            'onboarding_date' => Carbon::parse($request['partner']['onboarding_date'])->setTimezone('GMT+7')->format('Y-m-d H:i:s'),
            'live_date' => $request['partner']['live_date'] !== null ? Carbon::parse($request['partner']['live_date'])->setTimezone('GMT+7')->format('Y-m-d H:i:s') : null,
            'onboarding_age' => $request['partner']['onboarding_age'],
            'live_age' => $request['partner']['live_age'],
            'monitoring_date_after_3_month_live' => $request['partner']['monitoring_date_after_3_month_live'] !== null ? Carbon::parse($request['partner']['monitoring_date_after_3_month_live'])->setTimezone('GMT+7')->format('Y-m-d H:i:s') : null,
            'province' => $request['partner']['province'],
            'regency' => $request['partner']['regency'],
            'subdistrict' => $request['partner']['subdistrict'],
            'address' => $request['partner']['address'],
            'payment_metode' => $request['partner']['payment_metode'],
            'period' => $request['partner']['period']['name'] ?? $request['partner']['period'],
            'note_status' => $request['partner']['note_status']
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
                if ($partner->logo) {
                    Storage::delete('public/' . $partner->logo);
                    $filename = time() . '_' . rand() . '_' . $partner->id . '.' . $file->getClientOriginalExtension();
                    $pathLogo = "images/logo/" . $filename;
                    Storage::putFileAs('public/images/logo', $file, $filename);
                } else {
                    $filename = time() . '_' . rand() . '_' . $partner->id . '.' . $file->getClientOriginalExtension();
                    $pathLogo = "images/logo/" . $filename;
                    Storage::putFileAs('public/images/logo', $file, $filename);

                }
            }
        } else {
            if ($partner->logo) {
                Storage::delete('public/' . $partner->logo);
                $pathLogo = null;
            }
        }


        $partner->update([
            'name' => $request['name'],
            'logo' => $pathLogo,
            'npwp' => $request['npwp'] ?? null,
            'password' => $request['password'] ?? null,
            'phone_number' => $request['phone_number'] ?? null,
            'status_id' => $request['status']['id'],
            'sales_id' => $request['sales']['id'] ?? null,
            'referral_id' => $request['referral']['id'] ?? null,
            'account_manager_id' => $request['account_manager']['id'] ?? null,
            'onboarding_date' => Carbon::parse($request['onboarding_date'])->setTimezone('GMT+7')->format('Y-m-d H:i:s'),
            'live_date' => $request['live_date'] !== null ? Carbon::parse($request['live_date'])->setTimezone('GMT+7')->format('Y-m-d H:i:s') : null,
            'onboarding_age' => $request['onboarding_age'],
            'live_age' => $request['live_age'],
            'monitoring_date_after_3_month_live' => $request['monitoring_date_after_3_month_live'] !== null ? Carbon::parse($request['monitoring_date_after_3_month_live'])->setTimezone('GMT+7')->format('Y-m-d H:i:s') : null,
            'province' => $request['province'],
            'regency' => $request['regency'],
            'subdistrict' => $request['subdistrict'],
            'address' => $request['address'],
            'payment_metode' => $request['payment_metode'],
            'period' => $request['period']['name'] ?? $request['period'],
            'note_status' => $request['note_status']
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
            'referral',
            'status',
            'account_manager',
            'pics' => function ($query) {
                $query->latest();
            },
            'subscriptions' => function ($query) {
                $query->latest();
            },
            'banks' => function ($query) {
                $query->latest();
            },
            'price_list',

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
            'referral',
            'status',
            'account_manager',
            'pics' => function ($query) {
                $query->latest();
            },
            'subscriptions'
            ,
            'banks' => function ($query) {
                $query->latest();
            },
            'sph' => function ($query) {
                $query->with(['user', 'products'])->latest();
            },
            'price_list'


        ])->where('uuid', '=', $uuid)->first();
        return response()->json($partner);
    }

    public function apiGetLogs()
    {
        $logs = Activity::with(['causer', 'subject'])
            ->whereMorphedTo('subject', Partner::class);

        if (request()->query('partner')) {
            $logs->whereMorphRelation('subject', Partner::class, 'subject_id', '=', request()->query('partner'));
        }

        $logs = $logs->latest()->get();

        return response()->json($logs);
    }

    public function apiGetStatusLogs()
    {
        $logs = Activity::with(['causer', 'subject'])
            ->where('subject_type', 'App\Models\Partner')
            ->where('event', 'updated')
            ->where('note_status', '!=', null)
            ->latest()
            ->get();
        return response()->json($logs);
    }


}
