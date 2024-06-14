<?php

namespace App\Http\Controllers;

use App\Http\Requests\PartnerAccountSettingRequest;
use App\Models\Partner;
use App\Models\PartnerAccountSetting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class PartnerAccountSettingController extends Controller
{
    public function index(Request $request)
    {
        $usersProp = User::with('roles')->get();
        $partnersProp = Partner::with(['status'])->get();
        return Inertia::render("Partner/Account/Index", compact('partnersProp', 'usersProp'));
    }

    public function apiGetAccounts()
    {
        $partnerAccount = PartnerAccountSetting::with('partner')->latest()->get();
        return response()->json($partnerAccount);
    }

    public function store(PartnerAccountSettingRequest $request)
    {
        PartnerAccountSetting::create([
            'uuid' => Str::uuid(),
            'partner_id' => $request["partner"]["id"],
            'subdomain' => $request->subdomain,
            'email_super_admin' => $request->email_super_admin,
            'password' => $request->password,
            'created_by' => Auth::user()->id
        ]);
    }

    public function update(PartnerAccountSettingRequest $request, $uuid)
    {
        $partner = PartnerAccountSetting::where('uuid', $uuid)->first();
        $partner->update([
            // 'partner_id' => $request["partner"]["id"],
            'subdomain' => $request->subdomain,
            'email_super_admin' => $request->email_super_admin,
            'password' => $request->password,
        ]);
    }

    public function filter(Request $request)
    {
        $accounts = PartnerAccountSetting::with([
            'partner',
            'createdBy'
        ]);

        if ($request->user) {
            $accounts->where('created_by', $request->user['id']);
        }

        if ($request->input_date['start'] && $request->input_date['end']) {
            $accounts->whereBetween('created_at', [$request->input_date['start'], $request->input_date['end']]);
        }


        $accounts = $accounts->latest()->get();

        return response()->json($accounts);
    }

    public function apiGetLogs($partner_id)
    {
        $logs = Activity::with(['causer', 'subject'])
            ->whereHasMorph('subject', [PartnerAccountSetting::class], function ($query) use ($partner_id) {
                $query->where('partner_id', $partner_id);
            })
            ->latest()
            ->get();

        return response()->json($logs);
    }



    public function destroy($uuid)
    {
        PartnerAccountSetting::where('uuid', $uuid)->delete();
    }
}
