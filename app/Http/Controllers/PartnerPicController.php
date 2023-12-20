<?php

namespace App\Http\Controllers;

use App\Models\PartnerPIC;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PartnerPicController extends Controller
{
    public function apiGetPIC()
    {
        $pics = PartnerPIC::with(['partner' => ['sales', 'account_manager']])->get();
        return response()->json($pics);
    }

    public function store(Request $request)
    {
        PartnerPIC::create([
            'uuid' => Str::uuid(),
            'partner_id'=> $request["partner"]["id"],
            'name' => $request->name,
            'number' => $request->number,
            'position' => $request->position,
            'address' => $request->address
        ]);
    }

    public function update(Request $request, $uuid)
    {
        PartnerPIC::where('uuid', $uuid)->first()->update([
            'partner_id'=> $request["partner"]["id"],
            'name' => $request->name,
            'number' => $request->number,
            'position' => $request->position,
            'address' => $request->address
        ]);
    }

    public function destroy($uuid)
    {
        PartnerPIC::where('uuid', $uuid)->delete();
    }

}
