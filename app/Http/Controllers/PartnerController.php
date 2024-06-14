<?php

namespace App\Http\Controllers;

use App\Http\Requests\PartnerGeneralRequest;
use App\Imports\PartnerImport;
use App\Models\Lead;
use App\Models\Partner;
use App\Models\PartnerPIC;
use App\Models\Status;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\Activitylog\Models\Activity;

class PartnerController extends Controller
{
    public function index(Request $request)
    {
        $uuid = $request->query('detail');
        $usersProp = User::with('roles')->get();
        $leadOnboardingProp = Lead::with('status', 'sales')->whereHas('status', function ($query) {
            return $query->where('name', 'pengajuan onboarding');
        })->get();
        $partner = null;
        if ($uuid) {
            $partner = Partner::with([
                'sales',
                'status',
                'account_manager',
                'pic',
                'subscription',
                'bank',
                'price_list',
                'account',
                'createdBy'
            ])->where('uuid', '=', $uuid)->first();
        }

        $queryParamsProp = $request->all(['onboarding']);

        $statusProp = Status::where('category', 'partner')->get();
        return Inertia::render("Partner/Index", compact('partner', 'usersProp', 'leadOnboardingProp', 'statusProp', 'queryParamsProp'));
    }

    public function filter(Request $request)
    {
        $partners = Partner::with([
            'sales',
            'status',
            'account_manager',
            'pic',
            'account',
            'subscription',
            'bank',
            'price_list',
            'createdBy'
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
    }

    public function store(PartnerGeneralRequest $request)
    {
        $pathLogo = null;
        if ($request->hasFile('partner.logo')) {
            $file = $request->file('partner.logo');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $pathLogo = "images/logo/" . $filename;
            Storage::putFileAs('public/images/logo', $file, $filename);
        }

        $request->merge(['request_method' => 'store']);

        DB::beginTransaction();

        try {

            $user = User::create([
                'name' => $request['partner']['name'],
                'email' => $request['partner']['email'],
                'password' => Hash::make($request['partner']['password']),
            ]);
            $user->assignRole('partner');

            $partner = Partner::create([
                'uuid' => Str::uuid(),
                'user_id' => $user->id,
                'name' => $request['partner']['name'],
                'logo' => $pathLogo ?? null,
                'npwp' => $request['partner']['npwp'] ?? null,
                'password' => $request['partner']['password'] ?? null,
                'email' => $request['partner']['email'] ?? null,
                'phone_number' => $request['partner']['phone_number'] ?? null,
                'total_members' => $request['partner']['total_members'] ?? null,
                'status_id' => $request['partner']['status']['id'],
                'sales_id' => $request['partner']['sales']['id'] ?? null,
                'account_manager_id' => $request['partner']['account_manager']['id'] ?? null,
                'onboarding_date' => $request['partner']['onboarding_date'] !== null ? Carbon::parse($request['partner']['onboarding_date'])->setTimezone('GMT+7')->format('Y-m-d H:i:s') : null,
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
            if ($request['partner']['uuid_lead'] && $request['partner']['onboarding']) {

                $leadExist = Lead::with('status')->where('uuid', $request['partner']['uuid_lead'])->first();

                Activity::create([
                    'log_name' => 'onboarding',
                    'description' => 'onboardingkan partner baru',
                    'subject_type' => get_class($leadExist),
                    'subject_id' => $leadExist->id,
                    'causer_type' => get_class(Auth::user()),
                    'causer_id' => Auth::user()->id,
                    "event" => "onboarding",
                    'properties' => ["attributes" => ["name" => $leadExist->name, "status.name" => $leadExist->status->name, "status.color" => $leadExist->status->color, "phone_number" => $leadExist->phone_number, "total_members" => $leadExist->total_members, "address" => $leadExist->address, "pic" => $leadExist->pic]]
                ]);

                $leadExist->forceDelete();
            }

            PartnerPIC::create([
                'uuid' => Str::uuid(),
                'partner_id' => $partner->id,
                'name' => $request['partner']['pic'],
                'created_by' => Auth::user()->id
            ]);

            if (isset($request['partner']['lead_id'])) {
                $lead = Lead::with('status')->where('id', $request['partner']['lead_id'])->first();
                Activity::create([
                    'log_name' => 'onboarding',
                    'description' => ' onboardingkan lead',
                    'subject_type' => get_class($lead),
                    'subject_id' => $lead->id,
                    'causer_type' => "App\Models\User",
                    'causer_id' => $request['partner']['sales']['id'],
                    "event" => "onboarding",
                    'properties' => ["attributes" => ['name' => $lead->name, 'address' => $lead->address, 'pic' => $lead->pic, 'total_members' => $lead->total_members, 'status.name' => $lead->status->name, 'status.color' => $lead->status->color]]
                ]);
                $lead->forceDelete();
            }

            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error tambah partner: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }

    }


    public function update(Request $request, $uuid)
    {
        $validator = Validator::make($request->all(), [
            'partner.name' => 'required|string|max:255',
            'partner.pic' => 'required|string|max:255',
            'partner.total_members' => 'required',
            'partner.logo' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
            'partner.province' => 'required',
            'partner.regency' => 'required',
            'partner.status' => 'required',
        ], [
            'partner.name.required' => 'Nama lembaga harus diiisi',
            'partner.total_members.required' => 'Total member harus diiisi',
            'partner.pic.required' => 'PIC harus diiisi',
            'partner.status.required' => 'Status lembaga harus diiisi',
            'partner.province.required' => 'Provinsi lembaga harus diiisi',
            'partner.regency.required' => 'Kab/kota lembaga harus diiisi',
            'partner.logo.image' => 'File harus berupa gambar.',
            'partner.logo.mimes' => 'Tipe file harus jpg, png, atau jpeg.',
            'partner.logo.max' => 'Ukuran file tidak boleh melebihi 2 MB.',
        ]);

        $partner = Partner::with([
            'pic'
        ])->where('uuid', $uuid)->first();
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

        DB::beginTransaction();

        try {
            $partner->update([
                'name' => $request['partner']['name'],
                'logo' => $pathLogo,
                'npwp' => $request['partner']['npwp'] ?? null,
                'password' => $request['partner']['password'] ?? null,
                'phone_number' => $request['partner']['phone_number'] ?? null,
                'status_id' => $request['partner']['status']['id'],
                'sales_id' => $request['partner']['sales']['id'] ?? null,
                'account_manager_id' => $request['partner']['account_manager']['id'] ?? null,
                'onboarding_date' => $request['partner']['onboarding_date'] !== null ? Carbon::parse($request['partner']['onboarding_date'])->setTimezone('GMT+7')->format('Y-m-d H:i:s') : null,
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
                'billing_date' => $request['partner']['billing_date'] != null ? Carbon::parse($request['partner']['billing_date'])->setTimezone('GMT+7')->format('Y-m-d H:i:s') : null,
                'note_status' => $request['partner']['note_status'],
                'created_at' => now()
            ]);

            $partner->pic->first()->update([
                'name' => $request['partner']['pic']
            ]);

            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error update partner: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }

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
        $partner = Partner::with([
            'sales',
            'status',
            'account_manager',
            'pic',
            'subscription',
            'bank',
            'price_list',
            'account',
            'createdBy'
        ])->where('uuid', $uuid)->first();

        Activity::create([
            'log_name' => 'deleted',
            'description' => 'menghapus data partner',
            'subject_type' => get_class($partner),
            'subject_id' => $partner->id,
            'causer_type' => get_class(Auth::user()),
            'causer_id' => Auth::user()->id,
            "event" => "deleted",
            'properties' => ["old" => ['name' => $partner->name, 'npwp' => $partner->npwp, 'password' => $partner->password, 'phone_number' => $partner->phone_number, 'status.name' => $partner->status->name, 'status.color' => $partner->status->color, 'pic.name' => $partner->pic->name, 'bank.bank' => $partner->bank ? $partner->bank->bank : null, 'bank.account_bank_name' => $partner->bank ? $partner->bank->account_bank_name : null, 'bank.account_bank_number' => $partner->bank ? $partner->bank->account_bank_number : null, 'sales.name' => $partner->sales->name, 'account_manager.name' => $partner->account_manager ? $partner->account_manager->name : null, 'onboarding_date' => $partner->onboarding_date, 'live_date' => $partner->live_date, 'monitoring_date_after_3_month_live' => $partner->monitoring_date_after_3_month_live, 'province' => $partner->province, 'regency' => $partner->regency, 'address' => $partner->address, 'payment_metode' => $partner->payment_metode, 'period' => $partner->period]]
        ]);
        $partner->delete();
    }

    public function restore($uuid)
    {
        $partner = Partner::withTrashed()->where('uuid', '=', $uuid)->first();
        $partner->restore();
    }

    public function destroyForce($uuid)
    {
        $partner = Partner::withTrashed()->with([
            'sales',
            'status',
            'account_manager',
            'pic',
            'subscription',
            'bank',
            'account',
            'price_list',
            'createdBy'
        ])->where('uuid', $uuid)->first();

        Activity::create([
            'log_name' => 'force',
            'description' => 'menghapus data partner',
            'subject_type' => get_class($partner),
            'subject_id' => $partner->id,
            'causer_type' => get_class(Auth::user()),
            'causer_id' => Auth::user()->id,
            "event" => "force",
            'properties' => ["old" => ['name' => $partner->name, 'npwp' => $partner->npwp, 'password' => $partner->password, 'phone_number' => $partner->phone_number, 'status.name' => $partner->status->name, 'status.color' => $partner->status->color, 'pic.name' => $partner->pic->name, 'bank.bank' => $partner->bank ? $partner->bank->bank : null, 'bank.account_bank_name' => $partner->bank ? $partner->bank->account_bank_name : null, 'bank.account_bank_number' => $partner->bank ? $partner->bank->account_bank_number : null, 'sales.name' => $partner->sales->name, 'account_manager.name' => $partner->account_manager ? $partner->account_manager->name : null, 'onboarding_date' => $partner->onboarding_date, 'live_date' => $partner->live_date, 'monitoring_date_after_3_month_live' => $partner->monitoring_date_after_3_month_live, 'province' => $partner->province, 'regency' => $partner->regency, 'address' => $partner->address, 'payment_metode' => $partner->payment_metode, 'period' => $partner->period]]
        ]);
        $partner->forceDelete();
    }

    public function apiGetPartners()
    {
        $partnersDefault = Partner::with([
            'sales',
            'status',
            'account_manager',
            'pic',
            'subscription',
            'bank',
            'account',
            'price_list',
            'createdBy'
        ])->latest()->get();
        $salesDefault = User::role('account executive')->get();
        $accountManagerDefault = User::role('account manager')->get();

        return response()->json([
            'partners' => $partnersDefault,
            'sales' => $salesDefault,
            'account_managers' => $accountManagerDefault
        ]);
    }

    public function apiGetSubscriptionPartners(Request $request)
    {
        $partner = Partner::with(['subscription'])->where('period', $request->period['name'])->whereHas('status', function ($query) {
            return $query->where('name', 'aktif');
        })->get();
        return response()->json(['partner' => $partner]);
    }

    public function show($uuid)
    {
        $partner = Partner::with([
            'sales',
            'status',
            'account_manager',
            'pic',
            'subscription',
            'account',
            'bank',
            'sph' => function ($query) {
                $query->with(['user', 'products'])->latest();
            },
            'price_list',
            'createdBy'

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

    public function logFilter(Request $request)
    {
        $logs = Activity::with(['causer', 'subject'])->whereMorphedTo('subject', Partner::class);

        if ($request->user) {
            $logs->whereMorphRelation('causer', User::class, 'causer_id', '=', $request->user['id']);
        }

        if ($request->date['start'] && $request->date['end']) {
            $logs->whereBetween('created_at', [$request->date['start'], $request->date['end']]);
        }

        $logs = $logs->latest()->get();

        return response()->json($logs);
    }

    public function destroyLogs(Request $request)
    {
        $ids = explode(",", $request->query('ids'));
        Activity::whereIn('id', $ids)->delete();
    }

    public function apiGetStatusLogs()
    {

        $logs = Activity::with(['causer', 'subject'])
            ->whereMorphedTo('subject', Partner::class)
            ->whereMorphRelation('subject', Partner::class, 'subject_id', '=', request()->query('partner'))
            ->where('event', 'updated')
            ->where('note_status', '!=', null)
            ->latest()
            ->get();
        return response()->json($logs);
    }


    public function apiGetArsip()
    {
        $arsip = Partner::withTrashed()->with(
            'sales',
            'status',
            'account_manager',
            'pic',
            'subscription',
            'bank',
            'account',
            'price_list',
            'createdBy'
        )->whereNotNull('deleted_at')->get();
        return response()->json($arsip);
    }

    public function arsipFilter(Request $request)
    {
        $arsip = Partner::withTrashed()->with(
            'sales',
            'status',
            'account_manager',
            'pic',
            'subscription',
            'bank',
            'account',
            'price_list',
            'createdBy'
        )->whereNotNull('deleted_at');

        if ($request->user) {
            $arsip->where('created_by', '=', $request->user['id']);
        }

        if ($request->delete_date['start'] && $request->delete_date['end']) {
            $arsip->whereBetween('deleted_at', [Carbon::parse($request->delete_date['start'])->setTimezone('GMT+7')->startOfDay(), Carbon::parse($request->delete_date['end'])->setTimezone('GMT+7')->endOfDay()]);
        }

        $arsip = $arsip->get();

        return response()->json($arsip);
    }


}
