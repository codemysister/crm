<?php

namespace App\Http\Controllers;

use App\Http\Requests\PartnerPICRequest;
use App\Models\PartnerPIC;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PartnerPicController extends Controller
{
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

}
