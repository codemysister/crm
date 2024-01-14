<?php

namespace App\Http\Controllers;

use App\Jobs\GenerateSTPDJob;
use App\Models\Partner;
use App\Models\STPD;
use App\Models\STPDEmployees;
use App\Models\User;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class STPDController extends Controller
{
    public function index()
    {

        $STPDsDefault = STPD::all();
        return Inertia::render('STPD/Index', compact('STPDsDefault'));
    }

    public function create()
    {
        $usersDefault = User::with([
            'roles' => function ($query) {
                $query->latest();
            }
        ])->get();
        $usersDefault->transform(function ($user) {
            $user->position = $user->roles->first()->name;
            $user->user_id = $user->id;
            unset($user->roles);
            return $user;
        });
        $partnersDefault = Partner::all();
        return Inertia::render('STPD/Create', compact('usersDefault', 'partnersDefault'));
    }

    public function edit($uuid)
    {
        $usersDefault = User::with('roles')->get();
        $usersDefault->transform(function ($user) {
            $user->position = $user->roles->first()->name;
            $user->user_id = $user->id;
            unset($user->roles);
            return $user;
        });

        $partnersDefault = Partner::all(["id", "name", "address"]);
        $stpd = STPD::with([
            'employees' => function ($query) {
                $query->get();
            }
        ])->where('uuid', $uuid)->first();

        return Inertia::render('STPD/Edit', compact('usersDefault', 'partnersDefault', 'stpd'));
    }

    public function store(Request $request)
    {

        $stpd = STPD::create([
            "uuid" => Str::uuid(),
            "code" => $request->code,
            "institution" => $request->institution['name'],
            "location" => $request->location,
            "departure_date" => (new DateTime($request->departure_date))->format('Y-m-d H:i:s'),
            "return_date" => (new DateTime($request->return_date))->format('Y-m-d H:i:s'),
            "transportation" => $request->transportation,
            "accommodation" => $request->accommodation,
            "signature" => json_encode([
                "signature" => $request->signature['signature'],
                "name" => $request->signature['name'],
                "position" => $request->signature['position'],
            ]),
            "stpd_doc" => "",
        ]);
        foreach ($request->employees as $employee) {
            STPDEmployees::create([
                "stpd_id" => $stpd->id,
                "user_id" => $employee['id'],
                "name" => $employee['name'],
                "position" => $employee['position']
            ]);
        }

        GenerateSTPDJob::dispatch($stpd, $request->employees);
    }
    public function update(Request $request, $uuid)
    {

        $stpd = STPD::where('uuid', '=', $uuid)->update([
            // "uuid" => Str::uuid(),
            // "code" => $request->code,
            "institution" => is_array($request->institution) ? $request->institution['name'] : $request->institution,
            "location" => $request->location,
            "departure_date" => (new DateTime($request->departure_date))->format('Y-m-d'),
            "return_date" => (new DateTime($request->return_date))->format('Y-m-d'),
            "transportation" => $request->transportation,
            "accommodation" => $request->accommodation,
            "signature" => json_encode([
                "signature" => $request->signature['signature'],
                "name" => $request->signature['name'],
                "position" => $request->signature['position'],
            ]),
            "stpd_doc" => "",
        ]);

        $stpd = STPD::with('employees')->where('uuid', '=', $uuid)->first();


        STPDEmployees::where('stpd_id', $stpd->id)->delete();

        foreach ($request->employees as $employee) {

            STPDEmployees::create(
                [
                    "stpd_id" => $stpd->id,
                    'user_id' => $employee['user_id'],
                    "name" => $employee['name'],
                    "position" => $employee['position']
                ]
            );
        }

        GenerateSTPDJob::dispatch($stpd, $request->employees);
    }

    public function destroy($uuid)
    {
        $stpd = STPD::where('uuid', '=', $uuid)->first();
        unlink($stpd->stpd_doc);
        $stpd->delete();
    }

    public function apiGetSTPD()
    {
        $stpd = STPD::all();
        return response()->json($stpd);
    }
}
