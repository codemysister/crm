<?php

namespace App\Http\Controllers;

use App\Http\Requests\PartnerPICRequest;
use App\Models\Partner;
use App\Models\PartnerPIC;
use App\Models\Status;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PartnerPicController extends Controller
{

    public function index(Request $request)
    {
        $usersProp = User::with('roles')->get();
        $partnersProp = Partner::with(['status'])->get();
        return Inertia::render("Partner/Pic", compact('partnersProp', 'usersProp'));
    }
    public function apiGetPIC()
    {
        $pics = PartnerPIC::with('partner')
            ->orderBy('created_at', 'desc')->get();

        $pics->each(function ($pic) {
            if ($pic->partner->pics->isNotEmpty()) {
                $pic->partner->pics->first()->latest = true;
            }
        });

        return response()->json($pics);
    }

    public function store(PartnerPICRequest $request)
    {
        PartnerPIC::create([
            'uuid' => Str::uuid(),
            'partner_id' => $request["partner"]["id"],
            'name' => $request->name,
            'number' => $request->number,
            'email' => $request->email ?? null,
            'position' => $request->position,
            'created_by' => Auth::user()->id
        ]);
    }

    public function update(PartnerPICRequest $request, $uuid)
    {
        PartnerPIC::where('uuid', $uuid)->first()->update([
            'partner_id' => $request["partner"]["id"],
            'name' => $request->name,
            'number' => $request->number,
            'email' => $request->email ?? null,
            'position' => $request->position,
        ]);
    }

    public function destroy($uuid)
    {
        PartnerPIC::where('uuid', $uuid)->delete();
    }

    public function filter(Request $request)
    {
        $pics = PartnerPIC::with([
            'partner',
            'createdBy'
        ]);

        if ($request->user) {
            $pics->where('created_by', $request->user['id']);
        }

        if ($request->input_date['start'] && $request->input_date['end']) {
            $pics->whereBetween('created_at', [$request->input_date['start'], $request->input_date['end']]);
        }


        $pics = $pics->latest()->get();

        return response()->json($pics);
    }


}
