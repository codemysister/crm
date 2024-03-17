<?php

namespace App\Http\Controllers;

use App\Jobs\GenerateSTPDJob;
use App\Models\Partner;
use App\Models\Signature;
use App\Models\STPD;
use App\Models\STPDEmployees;
use App\Models\User;
use Carbon\Carbon;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class STPDController extends Controller
{
    public function index()
    {

        $STPDsDefault = STPD::latest()->get();
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
            unset ($user->roles);
            return $user;
        });
        $partnersDefault = Partner::all();
        $signaturesProp = Signature::all();
        return Inertia::render('STPD/Create', compact('usersDefault', 'partnersDefault', 'signaturesProp'));
    }

    public function edit($uuid)
    {
        $usersDefault = User::with('roles')->get();
        $usersDefault->transform(function ($user) {
            $user->position = $user->roles->first()->name;
            $user->user_id = $user->id;
            unset ($user->roles);
            return $user;
        });

        $partnersDefault = Partner::all();
        $stpd = STPD::with([
            'employees' => function ($query) {
                $query->get();
            }
        ])->where('uuid', $uuid)->first();
        $signaturesProp = Signature::all();

        return Inertia::render('STPD/Edit', compact('usersDefault', 'partnersDefault', 'stpd', 'signaturesProp'));
    }

    public function generateCode()
    {
        $currentMonth = date('n');
        $currentYear = date('Y');

        function intToRoman($number)
        {
            $map = array('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII');
            return $map[$number - 1];
        }

        $romanMonth = intToRoman($currentMonth);
        $latestData = STPD::latest()->first() ?? "000/CAZH-SPJ/$romanMonth/$currentYear";
        $lastCode = $latestData ? explode('/', $latestData->code ?? $latestData)[0] : 0;
        $newCode = str_pad((int) $lastCode + 1, 3, '0', STR_PAD_LEFT);
        $newCode = "$newCode/CAZH-SPJ/$romanMonth/$currentYear";
        return $newCode;
    }

    function updateEmployees($stpd, $oldData, $newData)
    {
        $oldIds = $oldData->pluck('id');
        $newIds = array_filter(Arr::pluck($newData, 'id'), 'is_numeric');

        $delete = collect($oldData)
            ->filter(function ($model) use ($newIds) {
                return !in_array($model->id, $newIds);
            });

        $update = collect($newData)
            ->filter(function ($model) use ($oldIds) {
                return array_key_exists('id', $model) && in_array($model['id'], $oldIds->toArray());
            });

        $create = collect($newData)
            ->filter(function ($model) use ($oldIds) {
                if (array_key_exists('id', $model)) {
                    return !in_array($model['id'], $oldIds->toArray());
                } else {
                    return true;
                }
            });

        STPDEmployees::destroy($delete->pluck('id')->toArray());
        foreach ($update as $employee) {

            $product = STPDEmployees::where('id', '=', $employee['id'])->first();
            $product->update([
                "stpd_id" => $stpd->id,
                "user_id" => $employee['id'],
                "name" => $employee['name'],
                "position" => $employee['position']
            ]);
        }
        foreach ($create as $employee) {
            STPDEmployees::create([
                "stpd_id" => $stpd->id,
                "user_id" => $employee['id'],
                "name" => $employee['name'],
                "position" => $employee['position']
            ]);
        }


        return true;
    }
    public function store(Request $request)
    {

        $id_partner = $request['partner']['id'];

        if (!$id_partner) {
            $partnerExists = Partner::where('name', 'like', '%' . $request['partner']["name"] . '%')->first();
            if (!$partnerExists) {
                $partner = Partner::create([
                    'uuid' => Str::uuid(),
                    'name' => $request['partner']['name'],
                    'province' => $request['partner']['province'],
                    'regency' => $request['partner']['regency'],
                    'status' => "Prospek",
                ]);
                $id_partner = $partner->id;
            } else {
                $id_partner = $partnerExists->id;
            }
        }

        $stpd = STPD::create([
            "uuid" => Str::uuid(),
            "code" => $this->generateCode(),
            "partner_name" => $request->partner['name'],
            "partner_province" => $request->partner['province'],
            "partner_regency" => $request->partner['regency'],
            "departure_date" => Carbon::parse($request->departure_date)->setTimezone('GMT+7')->format('Y-m-d H:i:s'),
            "return_date" => Carbon::parse($request->return_date)->setTimezone('GMT+7')->format('Y-m-d H:i:s'),
            "transportation" => $request->transportation,
            "accommodation" => $request->accommodation,
            "signature_name" => $request->signature['name'],
            "signature_image" => $request->signature['image'],
            "signature_position" => $request->signature['position'],
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

        $id_partner = $request['partner']['id'] ?? null;

        if (!$id_partner) {
            $partnerExists = Partner::where('name', 'like', '%' . $request['partner']["name"] . '%')->first();
            if (!$partnerExists) {
                $partner = Partner::create([
                    'uuid' => Str::uuid(),
                    'name' => $request['partner']['name'],
                    'province' => $request['partner']['province'],
                    'regency' => $request['partner']['regency'],
                    'status' => "Prospek",
                ]);
                $id_partner = $partner->id;
            } else {
                $id_partner = $partnerExists->id;
            }
        }

        $stpd = STPD::where('uuid', '=', $uuid)->update([
            // "uuid" => Str::uuid(),
            // "code" => $request->code,
            "partner_name" => $request->partner['name'],
            "partner_province" => $request->partner['province'],
            "partner_regency" => $request->partner['regency'],
            "departure_date" => Carbon::parse($request->departure_date)->setTimezone('GMT+7')->format('Y-m-d H:i:s'),
            "return_date" => Carbon::parse($request->return_date)->setTimezone('GMT+7')->format('Y-m-d H:i:s'),
            "transportation" => $request->transportation,
            "accommodation" => $request->accommodation,
            "signature_name" => $request->signature['name'],
            "signature_image" => $request->signature['image'],
            "signature_position" => $request->signature['position'],
            "stpd_doc" => "",
        ]);

        $stpd = STPD::with('employees')->where('uuid', '=', $uuid)->first();

        $this->updateEmployees($stpd, $stpd->employees, $request->employees);


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
        $stpd = STPD::latest()->get();
        return response()->json($stpd);
    }
}
