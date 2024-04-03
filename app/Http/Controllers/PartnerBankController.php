<?php

namespace App\Http\Controllers;

use App\Http\Requests\PartnerBankRequest;
use App\Models\Partner;
use App\Models\PartnerBank;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PartnerBankController extends Controller
{

    public function index(Request $request)
    {
        $usersProp = User::with('roles')->get();
        $partnersProp = Partner::with(['status'])->get();
        return Inertia::render("Partner/Bank/Index", compact('partnersProp', 'usersProp'));
    }

    public function apiGetPIC()
    {
        $partnerBanks = PartnerBank::with('partner')
            ->latest()->get();
        return response()->json($partnerBanks);
    }

    public function store(PartnerBankRequest $request)
    {
        PartnerBank::create([
            'uuid' => Str::uuid(),
            'partner_id' => $request["partner"]["id"],
            'bank' => $request->bank,
            'account_bank_number' => $request->account_bank_number,
            'account_bank_name' => $request->account_bank_name,
            'created_by' => Auth::user()->id
        ]);
    }

    public function update(PartnerBankRequest $request, $uuid)
    {
        PartnerBank::where('uuid', $uuid)->first()->update([
            'partner_id' => $request["partner"]["id"],
            'bank' => $request->bank,
            'account_bank_number' => $request->account_bank_number,
            'account_bank_name' => $request->account_bank_name
        ]);
    }

    public function filter(Request $request)
    {
        $banks = PartnerBank::with([
            'partner',
            'createdBy'
        ]);

        if ($request->user) {
            $banks->where('created_by', $request->user['id']);
        }

        if ($request->input_date['start'] && $request->input_date['end']) {
            $banks->whereBetween('created_at', [$request->input_date['start'], $request->input_date['end']]);
        }


        $banks = $banks->latest()->get();

        return response()->json($banks);
    }


    public function destroy($uuid)
    {
        PartnerBank::where('uuid', $uuid)->delete();
    }
}
