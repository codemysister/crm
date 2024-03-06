<?php

namespace App\Http\Controllers;

use App\Models\PartnerBank;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PartnerBankController extends Controller
{
    public function apiGetPIC()
    {
        $partnerBanks = PartnerBank::with('partner')
            ->get();
        return response()->json($partnerBanks);
    }

    public function store(Request $request)
    {
        PartnerBank::create([
            'uuid' => Str::uuid(),
            'partner_id' => $request["partner"]["id"],
            'bank' => $request->bank,
            'account_bank_number' => $request->account_bank_number,
            'account_bank_name' => $request->account_bank_name
        ]);
    }

    public function update(Request $request, $uuid)
    {
        PartnerBank::where('uuid', $uuid)->first()->update([
            'partner_id' => $request["partner"]["id"],
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
