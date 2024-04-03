<?php

namespace App\Http\Controllers;

use App\Http\Requests\PartnerAccountSettingRequest;
use App\Models\PartnerAccountSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class PartnerAccountSettingController extends Controller
{
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
            'cas_link_partner' => $request->cas_link_partner,
            'card_number' => $request->card_number,
            'created_by' => Auth::user()->id
        ]);
    }

    public function update(PartnerAccountSettingRequest $request, $uuid)
    {
        PartnerAccountSetting::where('uuid', $uuid)->first()->update([
            'partner_id' => $request["partner"]["id"],
            'subdomain' => $request->subdomain,
            'email_super_admin' => $request->email_super_admin,
            'cas_link_partner' => $request->cas_link_partner,
            'card_number' => $request->card_number,
        ]);
    }

    public function destroy($uuid)
    {
        PartnerAccountSetting::where('uuid', $uuid)->delete();
    }
}
