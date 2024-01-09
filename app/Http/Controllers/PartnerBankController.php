<?php

namespace App\Http\Controllers;

use App\Models\PartnerBank;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PartnerBankController extends Controller
{
    public function apiGetPIC()
    {
        $partnerBanks = PartnerBank::with(['partner.sales', 'partner.account_manager', 
        'partner.pics' => function ($query) {
            $query->latest();
        }, 'partner.subscription' => function ($query) {
            $query->latest();
        }, 'partner.banks' => function ($query) {
            $query->latest();
        }])
        ->get();
        return response()->json($partnerBanks);
    }

    public function store(Request $request)
    {
        PartnerBank::create([
            'uuid' => Str::uuid(),
            'partner_id'=> $request["partner"]["id"],
            'bank' => $request->bank,
            'account_bank_number' => $request->account_bank_number,
            'account_bank_name' => $request->account_bank_name
        ]);
    }

    public function update(Request $request, $uuid)
    {
        PartnerBank::where('uuid', $uuid)->first()->update([
            'uuid' => Str::uuid(),
            'partner_id'=> $request["partner"]["id"],
            'bank' => $request->bank,
            'account_bank_number' => $request->account_bank_number,
            'account_bank_name' => $request->account_bank_name
        ]);
    }

    public function destroy($uuid)
    {
        PartnerBank::where('uuid', $uuid)->delete();
    }
}
