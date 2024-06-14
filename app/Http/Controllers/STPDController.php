<?php

namespace App\Http\Controllers;

use App\Jobs\GenerateSTPDJob;
use App\Models\Lead;
use App\Models\Partner;
use App\Models\Signature;
use App\Models\STPD;
use App\Models\STPDEmployees;
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

class STPDController extends Controller
{
    public function index()
    {

        $STPDsDefault = STPD::latest()->get();
        $usersProp = User::with('roles')->get();
        return Inertia::render('STPD/Index', compact('STPDsDefault', 'usersProp'));
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
        $partnersDefault = Partner::with([
            'pic',
            'status'
        ])->get();
        $signaturesProp = Signature::all();
        return Inertia::render('STPD/Create', compact('usersDefault', 'partnersDefault', 'signaturesProp'));
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

        $partnersDefault = Partner::with([
            'pic',
            'status'
        ])->get();
        $stpd = STPD::with([
            'employees' => function ($query) {
                $query->get();
            },
            'lead',
            'partner'
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

        $lastDataCurrentMonth = STPD::withTrashed()->whereYear('created_at', $currentYear)
            ->whereMonth('created_at', $currentMonth)->latest()->first();

        $code = null;
        if ($lastDataCurrentMonth == null) {
            $code = "0000";
        } else {
            $parts = explode("/", $lastDataCurrentMonth->code);
            $code = $parts[1];
        }
        $codeInteger = intval($code) + 1;
        $latestCode = str_pad($codeInteger, strlen($code), "0", STR_PAD_LEFT);
        $romanMonth = intToRoman($currentMonth);
        $newCode = "$latestCode/CAZH-SPJ/$romanMonth/$currentYear";
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

    public function generateSTPD($stpd, $employees)
    {
        $path = "stpd/stpd-" . $stpd->uuid . ".pdf";

        $stpd->stpd_doc = "storage/$path";

        $html = view('pdf.stpd', ["stpd" => $stpd, "employees" => $employees])->render();

        $pdf = Browsershot::html($html)
            ->setIncludedPath(config('services.browsershot.included_path'))
            ->showBackground()
            ->pdf();

        Storage::put("public/$path", $pdf);

        return $stpd;

    }

    public function store(Request $request)
    {

        DB::beginTransaction();

        try {
            $stpd = new STPD();

            $stpd->uuid = Str::uuid();
            $stpd->code = $this->generateCode();
            if ($request['partner']['type'] == 'partner') {
                $partnerExist = Partner::where('uuid', $request['partner']["uuid"])->first();
                $stpd->partner_id = $partnerExist->id;
            } else {
                $leadExist = Lead::where('uuid', $request['partner']["uuid"])->first();
                $stpd->lead_id = $leadExist->id;
            }
            $stpd->institution_name = $request->partner['name'];
            $stpd->institution_province = $request->partner['province'];
            $stpd->institution_regency = $request->partner['regency'];
            $stpd->departure_date = Carbon::parse($request->departure_date)->setTimezone('GMT+7');
            $stpd->return_date = Carbon::parse($request->return_date)->setTimezone('GMT+7');
            $stpd->transportation = $request->transportation;
            $stpd->accommodation = $request->accommodation;
            $stpd->signature_name = $request->signature['name'];
            $stpd->signature_image = $request->signature['image'];
            $stpd->signature_position = $request->signature['position'];
            $stpd->created_by = Auth::user()->id;
            $stpd = $this->generateSTPD($stpd, $request->employees);
            $stpd->save();

            foreach ($request->employees as $employee) {
                STPDEmployees::create([
                    "stpd_id" => $stpd->id,
                    "user_id" => $employee['id'],
                    "name" => $employee['name'],
                    "position" => $employee['position']
                ]);
            }

            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error tambah stpd: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }
    public function update(Request $request, $uuid)
    {

        DB::beginTransaction();

        try {
            $stpd = STPD::where('uuid', '=', $uuid)->first();
            if ($request['partner']['type'] == 'partner') {
                $partnerExist = Partner::where('uuid', $request['partner']["uuid"])->first();
                $stpd->partner_id = $partnerExist->id;
            } else {
                $leadExist = Lead::where('uuid', $request['partner']["uuid"])->first();
                $stpd->lead_id = $leadExist->id;
            }
            $stpd->institution_name = $request->partner['name'];
            $stpd->institution_province = $request->partner['province'];
            $stpd->institution_regency = $request->partner['regency'];
            $stpd->departure_date = Carbon::parse($request->departure_date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
            $stpd->return_date = Carbon::parse($request->return_date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
            $stpd->transportation = $request->transportation;
            $stpd->accommodation = $request->accommodation;
            $stpd->signature_name = $request->signature['name'];
            $stpd->signature_image = $request->signature['image'];
            $stpd->signature_position = $request->signature['position'];
            $stpd = $this->generateSTPD($stpd, $request->employees);
            $stpd->save();

            $stpd = STPD::with('employees')->where('uuid', '=', $uuid)->first();

            $this->updateEmployees($stpd, $stpd->employees, $request->employees);
            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error update stpd: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function destroy($uuid)
    {
        $stpd = STPD::where('uuid', '=', $uuid)->first();
        Activity::create([
            'log_name' => 'deleted',
            'description' => 'menghapus permanen data stpd',
            'subject_type' => get_class($stpd),
            'subject_id' => $stpd->id,
            'causer_type' => get_class(Auth::user()),
            'causer_id' => Auth::user()->id,
            "event" => "deleted",
            'properties' => ["old" => ["code" => $stpd->code, "institution_name" => $stpd->institution_name, "departure_date" => $stpd->departure_date, "return_date" => $stpd->return_date, "transportation" => $stpd->transportation, "accommodation" => $stpd->accommodation]]
        ]);
        $stpd->delete();
    }

    public function apiGetSTPD()
    {
        $stpd = STPD::with('partner', 'lead', 'createdBy')->latest()->get();
        return response()->json($stpd);
    }

    public function filter(Request $request)
    {
        $stpd = STPD::with(['createdBy', 'lead', 'partner']);

        if ($request->user) {
            $stpd->where('created_by', $request->user['id']);
        }
        if ($request->institution_type == 'Lead') {
            $stpd->orWhereHas('lead');
        } else if ($request->institution_type == 'Partner') {
            $stpd->orWhereHas('partner');
        }


        if ($request->input_date['start'] && $request->input_date['end']) {
            $stpd->whereBetween('created_at', [Carbon::parse($request->input_date['start'])->setTimezone('GMT+7')->startOfDay(), Carbon::parse($request->input_date['end'])->setTimezone('GMT+7')->endOfDay()]);
        }

        $stpd = $stpd->latest()->get();

        return response()->json($stpd);
    }

    public function logFilter(Request $request)
    {
        $logs = Activity::with(['causer', 'subject'])->whereMorphedTo('subject', STPD::class);

        if ($request->user) {
            $logs->whereMorphRelation('causer', User::class, 'causer_id', '=', $request->user['id']);
        }

        if ($request->date['start'] && $request->date['end']) {
            $logs->whereBetween('created_at', [Carbon::parse($request->date['start'])->setTimezone('GMT+7')->startOfDay(), Carbon::parse($request->date['end'])->setTimezone('GMT+7')->endOfDay()]);
        }

        $logs = $logs->get();

        return response()->json($logs);
    }

    public function apiGetLogs()
    {
        $logs = Activity::with(['causer', 'subject'])
            ->whereMorphedTo('subject', STPD::class);

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
        $arsip = STPD::withTrashed()->with(['createdBy', 'lead', 'partner'])->whereNotNull('deleted_at')->get();

        return response()->json($arsip);
    }

    public function arsipFilter(Request $request)
    {
        $arsip = STPD::withTrashed()->with(['createdBy', 'lead', 'partner'])->whereNotNull('deleted_at');

        if ($request->user) {
            $arsip->where('created_by', '=', $request->user['id']);
        }

        if ($request->delete_date['start'] && $request->delete_date['end']) {
            $arsip->whereBetween('deleted_at', [Carbon::parse($request->delete_date['start'])->setTimezone('GMT+7')->startOfDay(), Carbon::parse($request->delete_date['end'])->setTimezone('GMT+7')->endOfDay()]);
        }

        $arsip = $arsip->get();

        return response()->json($arsip);
    }

    public function restore($uuid)
    {
        DB::beginTransaction();
        try {
            $stpd = STPD::withTrashed()->where('uuid', '=', $uuid)->first();
            $stpd->restore();
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error restore surat perjalanan dinas: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }


    public function destroyForce($uuid)
    {
        DB::beginTransaction();
        try {
            $stpd = STPD::withTrashed()->where('uuid', '=', $uuid)->first();
            Activity::create([
                'log_name' => 'force',
                'description' => 'menghapus permanen data stpd',
                'subject_type' => get_class($stpd),
                'subject_id' => $stpd->id,
                'causer_type' => get_class(Auth::user()),
                'causer_id' => Auth::user()->id,
                "event" => "force",
                'properties' => ["old" => ["code" => $stpd->code, "institution_name" => $stpd->institution_name, "departure_date" => $stpd->departure_date, "return_date" => $stpd->return_date, "transportation" => $stpd->transportation, "accommodation" => $stpd->accommodation]]
            ]);
            unlink($stpd->stpd_doc);
            $stpd->forceDelete();
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error hapus stpd: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }

    }

}
