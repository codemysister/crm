<?php

namespace App\Http\Controllers;

use App\Http\Requests\SLARequest;
use App\Jobs\GenerateSLAJob;
use App\Models\Partner;
use App\Models\SLA;
use App\Models\SlaActivity;
use App\Models\User;
use Carbon\Carbon;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SLAController extends Controller
{
    public function index()
    {
        return Inertia::render('SLA/Index');
    }

    public function apiGetSla()
    {
        $slas = SLA::with(['activities', 'partner', 'user'])->get();
        $roles = DB::table('roles')->distinct()->get("name");
        return response()->json(["sla" => $slas, "roles" => $roles]);
    }

    public function create()
    {
        $usersProp = User::with([
            'roles' => function ($query) {
                $query->latest();
            }
        ])->get();
        $usersProp->transform(function ($user) {
            $user->position = $user->roles->first()->name;
            $user->user_id = $user->id;
            unset($user->roles);
            return $user;
        });
        $partnersProp = Partner::with(
            'pics'
        )->get();
        $rolesProp = DB::table('roles')->distinct()->get("name");

        return Inertia::render('SLA/Create', compact('partnersProp', 'usersProp', 'rolesProp'));
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
        $latestData = SLA::latest()->first() ?? "#SLA/000/$romanMonth/$currentYear";
        $lastCode = $latestData ? explode('/', $latestData->code ?? $latestData)[1] : 0;
        $newCode = str_pad((int) $lastCode + 1, 3, '0', STR_PAD_LEFT);
        $newCode = "#SLA/$newCode/$romanMonth/$currentYear";
        return $newCode;
    }

    function updateActivities($sla, $oldData, $newData)
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

        SlaActivity::destroy($delete->pluck('id')->toArray());
        foreach ($update as $activity) {

            $product = SlaActivity::find($activity['id']);
            $product->update([
                "activity" => $activity['activity'],
                "cazh_pic" => $activity['cazh_pic']['name'],
                "duration" => $activity['duration'],
                "estimation_date" => $activity['estimation_date'],
                "realization_date" => $activity['realization_date'] ?? null
            ]);
        }
        foreach ($create as $activity) {
            SlaActivity::create([
                "sla_id" => $sla->id,
                "uuid" => Str::uuid(),
                "activity" => $activity['activity'],
                "cazh_pic" => $activity['cazh_pic']['name'],
                "duration" => $activity['duration'],
                "estimation_date" => $activity['estimation_date'],
                "realization_date" => $activity['realization_date'] ?? null
            ]);
        }


        return true;
    }

    public function store(SLARequest $request)
    {
        $pathSignaturePic = null;
        if ($request->hasFile('partner.pic_signature')) {
            $file = $request->file('partner.pic_signature');
            $filename = time() . '_' . rand() . '_' . $request->partner['id'] . '.' . $file->getClientOriginalExtension();
            $pathSignaturePic = 'images/tanda_tangan/' . $filename;
            Storage::putFileAs('public/images/tanda_tangan', $file, $filename);
        }
        $pathSignatureReferral = null;
        if ($request->hasFile('referral_signature')) {
            $file = $request->file('referral_signature');
            $filename = time() . '_' . rand() . '_' . $request->partner['id'] . '.' . $file->getClientOriginalExtension();
            $pathSignatureReferral = 'images/tanda_tangan/' . $filename;
            Storage::putFileAs('public/images/tanda_tangan', $file, $filename);
        }

        $code = $this->generateCode();
        $sla = SLA::create([
            "uuid" => Str::uuid(),
            "code" => $code,
            "partner_id" => $request->partner['id'],
            "partner_name" => $request->partner['name'],
            "partner_province" => $request->partner['province'],
            "partner_regency" => $request->partner['regency'],
            "partner_phone_number" => $request->partner['phone_number'],
            "partner_pic" => $request->partner['pic'],
            "partner_pic_email" => $request->partner['pic_email'],
            "partner_pic_number" => $request->partner['pic_number'],
            "partner_pic_signature" => $pathSignaturePic,
            "referral" => $request->referral,
            "referral_name" => $request->referral_name,
            "referral_signature" => $pathSignatureReferral,
            "created_by" => Auth::user()->id,
            "signature_name" => $request->signature['name'],
            "signature_image" => $request->signature['image'],
            "sla_doc" => "tes"
        ]);

        foreach ($request->activities as $activity) {
            SlaActivity::create([
                "sla_id" => $sla->id,
                "uuid" => Str::uuid(),
                "activity" => $activity['activity'],
                "cazh_pic" => $activity['cazh_pic']['name'],
                "duration" => $activity['duration'],
                "estimation_date" => $activity['estimation_date'],
                "realization_date" => $activity['realization_date'] ?? null
            ]);
        }

        GenerateSLAJob::dispatch($sla, $request->activities);
    }

    public function edit($uuid)
    {
        $usersProp = User::with([
            'roles' => function ($query) {
                $query->latest();
            }
        ])->get();
        $usersProp->transform(function ($user) {
            $user->position = $user->roles->first()->name;
            $user->user_id = $user->id;
            unset($user->roles);
            return $user;
        });
        $partnersProp = Partner::with(
            'pics'
        )->get();

        $sla = SLA::where('uuid', '=', $uuid)->with('activities')->first();

        $rolesProp = DB::table('roles')->distinct()->get("name");

        return Inertia::render('SLA/Edit', compact('partnersProp', 'usersProp', 'rolesProp', 'sla'));
    }

    public function update(SLARequest $request, $uuid)
    {
        $sla = SLA::with('activities')->where('uuid', '=', $uuid)->first();

        $pathSignaturePic = null;
        if ($request->hasFile('pic_signature')) {
            $file = $request->file('pic_signature');
            if ($file->getClientOriginalName() == 'blob') {
                $pathSignaturePic = $sla->partner_pic_signature;
            } else {
                if ($sla->partner_pic_signature) {
                    Storage::delete('public/' . $sla->partner_pic_signature);
                    $filename = time() . '_' . rand() . '_' . $request->partner['id'] . '.' . $file->getClientOriginalExtension();
                    $pathSignaturePic = "images/tanda_tangan/" . $filename;
                    Storage::putFileAs('public/images/tanda_tangan', $file, $filename);
                } else {
                    $filename = time() . '_' . rand() . '_' . $request->partner['id'] . '.' . $file->getClientOriginalExtension();
                    $pathSignaturePic = "images/tanda_tangan/" . $filename;
                    Storage::putFileAs('public/images/tanda_tangan', $file, $filename);

                }
            }
        } else {
            if ($sla->partner_pic_signature) {
                Storage::delete('public/' . $sla->partner_pic_signature);
                $pathSignaturePic = null;
            }
        }

        $pathSignatureReferral = null;

        if ($request->hasFile('referral_signature')) {
            $file = $request->file('referral_signature');
            if ($file->getClientOriginalName() == 'blob') {
                $pathSignatureReferral = $sla->referral_signature;
            } else {
                if ($sla->referral_signature) {
                    Storage::delete('public/' . $sla->referral_signature);
                    $filename = time() . '_' . rand() . '_' . $request->partner['id'] . '.' . $file->getClientOriginalExtension();
                    $pathSignatureReferral = "images/tanda_tangan/" . $filename;
                    Storage::putFileAs('public/images/tanda_tangan', $file, $filename);
                } else {
                    $filename = time() . '_' . rand() . '_' . $request->partner['id'] . '.' . $file->getClientOriginalExtension();
                    $pathSignatureReferral = "images/tanda_tangan/" . $filename;
                    Storage::putFileAs('public/images/tanda_tangan', $file, $filename);
                }
            }
        } else {
            if ($sla->referral_signature) {
                Storage::delete('public/' . $sla->referral_signature);
                $pathSignatureReferral = null;
            }
        }

        $sla->update([
            "partner_id" => $request->partner['id'],
            "partner_name" => $request->partner['name'],
            "partner_province" => $request->partner['province'],
            "partner_regency" => $request->partner['regency'],
            "partner_phone_number" => $request->partner['phone_number'],
            "partner_pic" => $request->partner['pic'],
            "partner_pic_email" => $request->partner['pic_email'],
            "partner_pic_number" => $request->partner['pic_number'],
            "partner_pic_signature" => $pathSignaturePic,
            "referral" => $request->referral,
            "referral_name" => $request->referral_name,
            "referral_signature" => $pathSignatureReferral,
            "signature_name" => $request->signature['name'],
            "signature_image" => $request->signature['image'],
        ]);

        $this->updateActivities($sla, $sla->activities, $request->activities);

        GenerateSLAJob::dispatch($sla, $request->activities);
    }

    public function activityUpdate(Request $request, $uuid)
    {
        $activity = SlaActivity::where('uuid', '=', $uuid)->first();

        $pathRealization = null;
        if ($request->hasFile('realization')) {
            $file = $request->file('realization');
            if ($file->getClientOriginalName() == 'blob') {
                $pathRealization = $activity->realization;
            } else {
                if ($activity->realization) {
                    Storage::delete('public/' . $activity->realization);
                    $pathRealization = null;
                }
                $filename = time() . '_' . $request['sla_id'] . '.' . $file->getClientOriginalExtension();
                $pathRealization = "sla/bukti/" . $filename;
                Storage::putFileAs('public/sla/bukti', $file, $filename);
            }
        } else {
            if ($activity->realization) {
                Storage::delete('public/' . $activity->realization);
                $pathRealization = null;
            }
        }
        $activity->update([
            "activity" => $request['activity'],
            "cazh_pic" => $request['cazh_pic'],
            "duration" => $request['duration'],
            "estimation_date" => $request['estimation_date'] !== null ? Carbon::parse($request['estimation_date'])->format('Y-m-d H:i:s') : null,
            "realization_date" => $request['realization_date'] !== null ? Carbon::parse($request['realization_date'])->format('Y-m-d H:i:s') : null,
            "realization" => $pathRealization,
            "information" => $request['information']
        ]);

        $sla = SLA::where('id', '=', $request['sla_id'])->with('activities')->first();

        GenerateSLAJob::dispatch($sla, $sla->activities);

    }

    public function destroy($uuid)
    {
        $sla = SLA::where('uuid', '=', $uuid)->first();
        unlink($sla->sla_doc);
        $sla->delete();
    }

    public function activityDestroy($uuid)
    {
        $activity = SlaActivity::where('uuid', '=', $uuid)->first();
        $sla = SLA::where('id', '=', $activity['sla_id'])->with('activities')->first();
        $activity->delete();
        GenerateSLAJob::dispatch($sla, $sla->activities);
    }
}
