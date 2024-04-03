<?php

namespace App\Http\Controllers;

use App\Models\Referral;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;


class ReferralController extends Controller
{
    public function index()
    {
        $userAsReferralProp = User::role('referral')->get();
        return Inertia::render('Referral/Index', compact('userAsReferralProp'));
    }

    public function store(Request $request)
    {
        $pathLogo = null;
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = time() . '_' . Auth::user()->id . '.' . $file->getClientOriginalExtension();
            $pathLogo = '/images/logo/' . $filename;
            Storage::putFileAs('public/images/logo', $file, $filename);
        }
        $pathSignature = null;
        if ($request->hasFile('signature')) {
            $file = $request->file('signature');
            $filename = time() . '_' . Auth::user()->id . '.' . $file->getClientOriginalExtension();
            $pathSignature = '/images/tanda_tangan/' . $filename;
            Storage::putFileAs('public/images/tanda_tangan', $file, $filename);
        }
        Referral::create([
            'uuid' => Str::uuid(),
            'user_id' => $request->user['id'],
            'institution' => $request->institution,
            'logo' => $pathLogo,
            'signature' => $pathSignature,
            'created_by' => Auth::user()->id
        ]);
    }

    public function update(Request $request, $uuid)
    {
        $referral = Referral::where('uuid', '=', $uuid)->first();
        $pathLogo = $referral->logo;
        if ($pathLogo == null && $request->hasFile('logo')) {
            Storage::delete('public/' . $referral->logo);
            $file = $request->file('logo');
            $filename = time() . '_' . Auth::user()->id . '.' . $file->getClientOriginalExtension();
            $pathLogo = '/images/logo/' . $filename;
            Storage::putFileAs('public/images/logo', $file, $filename);
        }
        $pathSignature = $referral->signature;
        if ($pathSignature == null && $request->hasFile('signature')) {
            Storage::delete('public/' . $referral->signature);
            $file = $request->file('signature');
            $filename = time() . '_' . Auth::user()->id . '.' . $file->getClientOriginalExtension();
            $pathSignature = '/images/tanda_tangan/' . $filename;
            Storage::putFileAs('public/images/tanda_tangan', $file, $filename);
        }

        $referral->update([
            'user_id' => $request->user['id'],
            'institution' => $request->institution,
            'logo' => $pathLogo,
            'signature' => $pathSignature
        ]);
    }

    public function apiGetReferral()
    {
        $referrals = Referral::with('user')->get();
        return response()->json($referrals);
    }

    public function destroy($uuid)
    {
        $referral = Referral::where('uuid', '=', $uuid)->first();
        Storage::delete('public/' . $referral->logo);
        Storage::delete('public/' . $referral->signature);
        $referral->delete();
    }
}
