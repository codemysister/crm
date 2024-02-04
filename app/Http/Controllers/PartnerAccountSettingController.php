<?php

namespace App\Http\Controllers;

use App\Models\PartnerAccountSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PartnerAccountSettingController extends Controller
{
    public function apiGetAccounts()
    {
        $partnerAccount = PartnerAccountSetting::with([
            'partner.sales',
            'partner.account_manager',
            'partner.pics' => function ($query) {
                $query->latest();
            },
            'partner.subscription' => function ($query) {
                $query->latest();
            },
            'partner.banks' => function ($query) {
                $query->latest();
            }
        ])->get();
        return response()->json($partnerAccount);
    }

    public function store(Request $request)
    {
        PartnerAccountSetting::create([
            'uuid' => Str::uuid(),
            'partner_id' => $request["partner"]["id"],
            'subdomain' => $request->subdomain,
            'email_super_admin' => $request->email_super_admin,
            'cas_link_partner' => $request->cas_link_partner,
            'card_number' => $request->card_number,
        ]);
    }

    public function update(Request $request, $uuid)
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
