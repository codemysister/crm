<?php

namespace App\Http\Controllers;

use App\Http\Requests\SLARequest;
use App\Jobs\GenerateSLAJob;
use App\Models\Lead;
use App\Models\Referral;
use App\Models\Signature;
use App\Models\SLA;
use App\Models\SlaActivity;
use App\Models\User;
use Carbon\Carbon;
use DateTime;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;
use Spatie\Browsershot\Browsershot;

class SLAController extends Controller
{
    public function index()
    {
        return Inertia::render('SLA/Index');
    }

    public function apiGetSla()
    {
        $slas = SLA::with([
            'slaActivities' => function ($query) {
                $query->orderBy('id', 'asc');
            },
            'lead',
            'createdBy'
        ])->latest()->get();
        $roles = DB::table('roles')->distinct()->get("name");
        $users = User::all();
        return response()->json(["sla" => $slas, "roles" => $roles, "users" => $users]);
    }

    public function create()
    {
        $usersProp = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['account executive', 'account manager', 'graphics designer']);
        })->with([
                    'roles' => function ($query) {
                        $query->latest();
                    }
                ])->get();
        $usersProp->transform(function ($user) {
            $user->position = $user->roles->first()->name;
            $user->user_id = $user->id;
            unset ($user->roles);
            return $user;
        });
        $leadsProp = Lead::with(
            'status'
        )->get();

        $referralsProp = Referral::with('user')->get();
        $signaturesProp = Signature::all();
        return Inertia::render('SLA/Create', compact('leadsProp', 'usersProp', 'referralsProp', 'signaturesProp'));
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

        $lastDataCurrentMonth = SLA::withTrashed()->whereYear('created_at', $currentYear)
            ->whereMonth('created_at', $currentMonth)->latest()->first();

        $code = null;
        if ($lastDataCurrentMonth == null) {
            $code = "000";
        } else {
            $parts = explode("/", $lastDataCurrentMonth->code);
            $code = $parts[1];
        }
        $codeInteger = intval($code) + 1;
        $latestCode = str_pad($codeInteger, strlen($code), "0", STR_PAD_LEFT);

        $romanMonth = intToRoman($currentMonth);
        $newCode = "SLA/$latestCode/$romanMonth/$currentYear";

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
                "realization_date" => $activity['realization_date'] ?? null,
                "user_id" => $activity['cazh_pic']['id']
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
                "realization_date" => $activity['realization_date'] ?? null,
                "user_id" => $activity['cazh_pic']['id']
            ]);
        }


        return true;
    }

    public function generateSla($sla, $activities)
    {
        $path = "sla/sla-" . $sla->uuid . ".pdf";

        $sla->sla_doc = "storage/$path";

        $html = view('pdf.sla', ["sla" => $sla, 'activities' => $activities])->render();

        $pdf = Browsershot::html($html)
            ->setIncludedPath(config('services.browsershot.included_path'))
            ->showBackground()
            ->pdf();

        Storage::put("public/$path", $pdf);

        return $sla;
    }

    public function store(SLARequest $request)
    {
        $pathSignaturePic = null;
        if ($request->hasFile('lead.pic_signature')) {
            $file = $request->file('lead.pic_signature');
            $filename = time() . '_' . rand() . '_' . $request->lead['id'] . '.' . $file->getClientOriginalExtension();
            $pathSignaturePic = 'images/tanda_tangan/' . $filename;
            Storage::putFileAs('public/images/tanda_tangan', $file, $filename);
        }
        $logo = "/assets/img/logo/sla_logo.png";
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = time() . '_' . rand() . '_' . $request->lead['id'] . '.' . $file->guessExtension();
            $logo = '/storage/images/logo/' . $filename;

            Storage::putFileAs('public/images/logo/', $file, $filename);
        }

        DB::beginTransaction();

        try {

            $code = $this->generateCode();

            $sla = new SLA();
            $sla->uuid = Str::uuid();
            $sla->code = $code;
            $sla->logo = $logo;
            $sla->lead_id = $request->lead['id'];
            $sla->lead_name = $request->lead['name'];
            $sla->lead_province = $request->lead['province'];
            $sla->lead_regency = $request->lead['regency'];
            $sla->lead_phone_number = $request->lead['phone_number'];
            $sla->lead_pic = $request->lead['pic'];
            $sla->lead_pic_email = $request->lead['pic_email'];
            $sla->lead_pic_number = $request->lead['pic_number'];
            $sla->lead_pic_signature = $pathSignaturePic;
            $sla->referral = $request->referral;
            $sla->referral_logo = $request->referral_logo ?? null;
            $sla->referral_name = $request->referral_signature['name'] ?? null;
            $sla->referral_institution = $request->referral_signature['institution'] ?? null;
            $sla->referral_signature = $request->referral_signature['image'] ?? null;
            $sla->created_by = Auth::user()->id;
            $sla->signature_name = $request->signature['name'];
            $sla->signature_image = $request->signature['image'];
            $sla = $this->generateSla($sla, $request->activities);
            $sla->save();

            foreach ($request->activities as $activity) {
                SlaActivity::create([
                    "sla_id" => $sla->id,
                    "uuid" => Str::uuid(),
                    "activity" => $activity['activity'],
                    "cazh_pic" => $activity['cazh_pic']['name'],
                    "duration" => $activity['duration'],
                    "estimation_date" => $activity['estimation_date'],
                    "realization_date" => $activity['realization_date'] ?? null,
                    "user_id" => $activity['cazh_pic']['id'],
                ]);
            }

            $slaActivitiesLog = collect($request->activities)->map(function ($activity, $index) {
                return ($index + 1) . ". " . $activity['activity'];
            })->implode(', ');

            Activity::create([
                'log_name' => 'created',
                'description' => Auth::user()->name . ' menambah data SLA',
                'subject_type' => get_class($sla),
                'subject_id' => $sla->id,
                'causer_type' => get_class(Auth::user()),
                'causer_id' => Auth::user()->id,
                "event" => "created",
                'properties' => ["attributes" => ["code" => $sla->code, "lead_name" => $sla->lead_name, "lead_phone_number" => $sla->lead_phone_number, "lead_pic" => $sla->lead_pic, "lead_pic_email" => $sla->lead_pic_email, "lead_pic_number" => $sla->lead_pic_number, "signature_name" => $sla->signature_name, 'referral_name' => $sla->referral_name, 'activities' => $slaActivitiesLog]]
            ]);

            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error tambah sla: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function edit($uuid)
    {
        $usersProp = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['account executive', 'account manager', 'graphics designer']);
        })->with([
                    'roles' => function ($query) {
                        $query->latest();
                    }
                ])->get();

        $usersProp->transform(function ($user) {
            $user->position = $user->roles->first()->name;
            $user->user_id = $user->id;
            unset ($user->roles);
            return $user;
        });
        $leadsProp = lead::with(
            'status',
        )->get();

        $sla = SLA::with('slaActivities')->where('uuid', '=', $uuid)->first();
        $referralsProp = Referral::with('user')->get();
        $signaturesProp = Signature::all();
        return Inertia::render('SLA/Edit', compact('leadsProp', 'usersProp', 'sla', 'referralsProp', 'signaturesProp'));
    }

    public function update(SLARequest $request, $uuid)
    {
        $sla = SLA::with('slaActivities')->where('uuid', '=', $uuid)->first();

        $pathSignaturePic = $sla->lead_pic_signature;
        if ($request->hasFile('pic_signature')) {
            $file = $request->file('pic_signature');
            if ($file->getClientOriginalName() == 'blob') {
                $pathSignaturePic = $sla->lead_pic_signature;
            } else {
                if ($sla->lead_pic_signature) {
                    Storage::delete('public/' . $sla->lead_pic_signature);
                    $filename = time() . '_' . rand() . '_' . $request->lead['id'] . '.' . $file->getClientOriginalExtension();
                    $pathSignaturePic = "images/tanda_tangan/" . $filename;
                    Storage::putFileAs('public/images/tanda_tangan', $file, $filename);
                } else {
                    $filename = time() . '_' . rand() . '_' . $request->lead['id'] . '.' . $file->getClientOriginalExtension();
                    $pathSignaturePic = "images/tanda_tangan/" . $filename;
                    Storage::putFileAs('public/images/tanda_tangan', $file, $filename);

                }
            }
        }

        if ($request->pic_signature == null) {
            Storage::delete('public/' . $sla->lead_pic_signature);
            $pathSignaturePic = null;
        }

        $pathLogo = $sla->logo == null ? "/assets/img/logo/sla_logo.png" : $sla->logo;

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            if ($file->getClientOriginalName() == 'blob') {
                $pathLogo = $sla->logo;
            } else {
                if ($sla->logo) {
                    Storage::delete('public/' . $sla->logo);
                    $filename = time() . '_' . rand() . '_' . $request->lead['id'] . '.' . $file->getClientOriginalExtension();
                    $pathLogo = "/storage/images/logo/" . $filename;
                    Storage::putFileAs('public/images/logo', $file, $filename);
                } else {
                    $filename = time() . '_' . rand() . '_' . $request->lead['id'] . '.' . $file->getClientOriginalExtension();
                    $pathLogo = "/storage/images/logo/" . $filename;
                    Storage::putFileAs('public/images/logo', $file, $filename);
                }
            }
        }

        $slaOldActivitiesLog = collect($sla->slaActivities)->map(function ($activity, $index) {
            return ($index + 1) . ". " . $activity['activity'];
        })->implode(', ');
        $slaNewActivitiesLog = collect($request->activities)->map(function ($activity, $index) {
            return ($index + 1) . ". " . $activity['activity'];
        })->implode(', ');


        Activity::create([
            'log_name' => 'updated',
            'description' => Auth::user()->name . ' menambah data SLA',
            'subject_type' => get_class($sla),
            'subject_id' => $sla->id,
            'causer_type' => get_class(Auth::user()),
            'causer_id' => Auth::user()->id,
            "event" => "updated",
            'properties' => ["attributes" => ["code" => $sla->code, "lead_name" => $sla->lead_name, "lead_phone_number" => $sla->lead_phone_number, "lead_pic" => $sla->lead_pic, "lead_pic_email" => $sla->lead_pic_email, "lead_pic_number" => $sla->lead_pic_number, "signature_name" => $sla->signature_name, 'referral_name' => $sla->referral_name, 'activities' => $slaOldActivitiesLog], "old" => ["code" => $sla->code, "lead_name" => $request->lead['name'], "lead_phone_number" => $request->lead['phone_number'], "lead_pic" => $request->lead['pic'], "lead_pic_email" => $request->lead['pic_email'], "lead_pic_number" => $request->lead['pic_number'], "signature_name" => $request->signature['name'], 'referral_name' => $request->referral_signature['name'], 'activities' => $slaNewActivitiesLog]]
        ]);

        DB::beginTransaction();

        try {
            $sla->logo = $pathLogo;
            $sla->lead_id = $request->lead['id'];
            $sla->lead_name = $request->lead['name'];
            $sla->lead_province = $request->lead['province'];
            $sla->lead_regency = $request->lead['regency'];
            $sla->lead_phone_number = $request->lead['phone_number'];
            $sla->lead_pic = $request->lead['pic'];
            $sla->lead_pic_email = $request->lead['pic_email'];
            $sla->lead_pic_number = $request->lead['pic_number'];
            $sla->lead_pic_signature = $pathSignaturePic;
            $sla->referral = $request->referral;
            $sla->referral_logo = $request->referral_logo ?? null;
            $sla->referral_name = $request->referral_signature['name'] ?? null;
            $sla->referral_institution = $request->referral_signature['institution'] ?? null;
            $sla->referral_signature = $request->referral_signature['image'] ?? null;
            $sla->created_by = Auth::user()->id;
            $sla->signature_name = $request->signature['name'];
            $sla->signature_image = $request->signature['image'];
            $this->updateActivities($sla, $sla->activities, $request->activities);
            $sla = $this->generateSla($sla, $request->activities);
            $sla->save();

            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error update sla: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }

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
        $activity->activity = $request['activity'];
        $activity->cazh_pic = $request['cazh_pic'];
        $activity->duration = $request['duration'];
        $activity->estimation_date = $request['estimation_date'] !== null ? Carbon::parse($request['estimation_date'])->format('Y-m-d H:i:s') : null;
        $activity->realization_date = $request['realization_date'] !== null ? Carbon::parse($request['realization_date'])->format('Y-m-d H:i:s') : null;
        $activity->realization = $pathRealization;
        $activity->information = $request['information'];
        $activity->created_by = Auth::user()->id;
        $activity->save();

        $sla = SLA::where('id', '=', $request['sla_id'])->with('slaActivities')->first();


    }

    public function destroy($uuid)
    {
        DB::beginTransaction();

        try {
            $sla = SLA::with('slaActivities')->where('uuid', '=', $uuid)->first();
            $slaActivitiesLog = collect($sla->slaActivities)->map(function ($activity, $index) {
                return ($index + 1) . ". " . $activity['activity'];
            })->implode(', ');

            Activity::create([
                'log_name' => 'deleted',
                'description' => Auth::user()->name . ' menghapus data SLA',
                'subject_type' => get_class($sla),
                'subject_id' => $sla->id,
                'causer_type' => get_class(Auth::user()),
                'causer_id' => Auth::user()->id,
                "event" => "deleted",
                'properties' => ["old" => ["code" => $sla->code, "lead_name" => $sla->lead_name, "lead_phone_number" => $sla->lead_phone_number, "lead_pic" => $sla->lead_pic, "lead_pic_email" => $sla->lead_pic_email, "lead_pic_number" => $sla->lead_pic_number, "signature_name" => $sla->signature_name, 'referral_name' => $sla->referral_name, 'activities' => $slaActivitiesLog]]
            ]);
            $sla->delete();
            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error hapus sla: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function restore($uuid)
    {
        $sla = SLA::withTrashed()->with('slaActivities')->where('uuid', '=', $uuid)->first();
        $sla->restore();
    }

    public function destroyForce($uuid)
    {
        DB::beginTransaction();

        try {
            $sla = SLA::withTrashed()->with('slaActivities')->where('uuid', '=', $uuid)->first();
            $slaActivitiesLog = collect($sla->slaActivities)->map(function ($activity, $index) {
                return ($index + 1) . ". " . $activity['activity'];
            })->implode(', ');

            Activity::create([
                'log_name' => 'force',
                'description' => Auth::user()->name . ' menghapus permanen data SLA',
                'subject_type' => get_class($sla),
                'subject_id' => $sla->id,
                'causer_type' => get_class(Auth::user()),
                'causer_id' => Auth::user()->id,
                "event" => "force",
                'properties' => ["old" => ["code" => $sla->code, "lead_name" => $sla->lead_name, "lead_phone_number" => $sla->lead_phone_number, "lead_pic" => $sla->lead_pic, "lead_pic_email" => $sla->lead_pic_email, "lead_pic_number" => $sla->lead_pic_number, "signature_name" => $sla->signature_name, 'referral_name' => $sla->referral_name, 'activities' => $slaActivitiesLog]]
            ]);
            unlink($sla->sla_doc);
            $sla->forceDelete();
            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error hapus permanen sla: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function activityDestroy($uuid)
    {
        $activity = SlaActivity::where('uuid', '=', $uuid)->first();
        $sla = SLA::where('id', '=', $activity['sla_id'])->with('slaActivities')->first();
        $activity->delete();
        GenerateSLAJob::dispatch($sla, $sla->activities);
    }

    public function apiGetActivities($id)
    {
        $activities = SlaActivity::where('sla_id', '=', $id)->orderBy('id', 'asc')->get();
        return response()->json($activities);
    }

    public function filter(Request $request)
    {
        $slas = SLA::with([
            'slaActivities' => function ($query) {
                $query->orderBy('id', 'asc');
            },
            'lead',
            'createdBy'
        ]);

        if ($request->user) {
            $slas->where('created_by', $request->user['id']);
        }

        if ($request->input_date['start'] && $request->input_date['end']) {
            $slas->whereBetween('created_at', [Carbon::parse($request->input_date['start'])->setTimezone('GMT+7')->startOfDay(), Carbon::parse($request->input_date['end'])->setTimezone('GMT+7')->endOfDay()]);
        }


        $slas = $slas->latest()->get();

        return response()->json($slas);
    }


    public function logFilter(Request $request)
    {
        $logs = Activity::with(['causer', 'subject'])->whereMorphedTo('subject', SLA::class);

        if ($request->user) {
            $logs->whereMorphRelation('causer', User::class, 'causer_id', '=', $request->user['id']);
        }

        if ($request->date['start'] && $request->date['end']) {
            $logs->whereBetween('created_at', [Carbon::parse($request->date['start'])->setTimezone('GMT+7')->startOfDay(), Carbon::parse($request->date['end'])->setTimezone('GMT+7')->endOfDay()]);
        }

        $logs = $logs->latest()->get();

        return response()->json($logs);
    }

    public function apiGetLogs()
    {
        $logs = Activity::with(['causer', 'subject'])
            ->whereMorphedTo('subject', SLA::class);

        $logs = $logs->latest()->get();

        return response()->json($logs);
    }

    public function destroyLogs(Request $request)
    {
        $ids = explode(",", $request->query('ids'));
        Activity::whereIn('id', $ids)->delete();
    }

    public function apiGetArsip()
    {
        $arsip = SLA::withTrashed()->with(['createdBy', 'lead', 'activities'])->whereNotNull('deleted_at')->get();

        return response()->json($arsip);
    }

    public function arsipFilter(Request $request)
    {
        $arsip = SLA::withTrashed()->with(['createdBy', 'lead', 'activities'])->whereNotNull('deleted_at');

        if ($request->user) {
            $arsip->where('created_by', '=', $request->user['id']);
        }

        if ($request->delete_date['start'] && $request->delete_date['end']) {
            $arsip->whereBetween('deleted_at', [Carbon::parse($request->delete_date['start'])->setTimezone('GMT+7')->startOfDay(), Carbon::parse($request->delete_date['end'])->setTimezone('GMT+7')->endOfDay()]);
        }

        $arsip = $arsip->get();

        return response()->json($arsip);
    }


}
