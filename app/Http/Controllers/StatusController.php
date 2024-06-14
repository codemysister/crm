<?php

namespace App\Http\Controllers;

use App\Http\Requests\StatusRequest;
use App\Models\Status;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class StatusController extends Controller
{

    public function index()
    {
        $usersProp = User::with('roles')->get();
        return Inertia::render('Status/Index', compact('usersProp'));
    }

    public function store(StatusRequest $request)
    {
        Status::create([
            'uuid' => Str::uuid(),
            'name' => strtolower($request->name),
            'category' => strtolower($request->category),
            'color' => $request->color
        ]);
    }

    public function update(StatusRequest $request, $uuid)
    {
        $status = Status::where('uuid', '=', $uuid)->first();
        $status->fill($request->except('id'))->save();
    }

    public function destroy($uuid)
    {
        $status = Status::where('uuid', '=', $uuid)->first();
        Activity::create([
            'log_name' => 'deleted',
            'description' => 'menghapus data status',
            'subject_type' => get_class($status),
            'subject_id' => $status->id,
            'causer_type' => get_class(Auth::user()),
            'causer_id' => Auth::user()->id,
            "event" => "deleted",
            'properties' => ["old" => ["name" => $status->name, "category" => $status->category, "color" => $status->color]]
        ]);
        $status->delete();
    }

    public function destroyForce($uuid)
    {
        $status = Status::withTrashed()->where('uuid', '=', $uuid)->first();
        Activity::create([
            'log_name' => 'force',
            'description' => 'menghapus permanen data status',
            'subject_type' => get_class($status),
            'subject_id' => $status->id,
            'causer_type' => get_class(Auth::user()),
            'causer_id' => Auth::user()->id,
            "event" => "force",
            'properties' => ["old" => ["name" => $status->name, "category" => $status->category, "color" => $status->color]]
        ]);
        $status->forceDelete();
    }

    public function restore($uuid)
    {
        $status = Status::withTrashed()->where('uuid', '=', $uuid)->first();
        $status->restore();
    }

    public function apiGetStatus()
    {
        $statuses = Status::withoutTrashed()->latest()->get();
        return response()->json($statuses);
    }

    public function apiGetLogs()
    {
        $logs = Activity::with(['causer', 'subject'])
            ->whereMorphedTo('subject', Status::class);

        $logs = $logs->latest()->get();

        return response()->json($logs);
    }

    public function destroyLogs(Request $request)
    {
        $ids = explode(",", $request->query('ids'));
        Activity::whereIn('id', $ids)->delete();
    }

    public function logFilter(Request $request)
    {
        $logs = Activity::with(['causer', 'subject'])->whereMorphedTo('subject', Status::class);

        if ($request->user) {
            $logs->whereMorphRelation('causer', Status::class, 'causer_id', '=', $request->user['id']);
        }

        if ($request->date['start'] && $request->date['end']) {
            $logs->whereBetween('created_at', [$request->date['start'], $request->date['end']]);
        }

        $logs = $logs->latest()->get();

        return response()->json($logs);
    }

    public function apiGetStatusArsip()
    {
        $statuses = Status::withTrashed()->whereNotNull('deleted_at')->latest()->get();
        return response()->json($statuses);
    }

    public function arsipFilter(Request $request)
    {
        $arsip = Status::withTrashed()->whereNotNull('deleted_at');

        if ($request->user) {
            $arsip->where('created_by', '=', $request->user['id']);
        }

        if ($request->delete_date['start'] && $request->delete_date['end']) {
            $arsip->whereBetween('deleted_at', [$request->delete_date['start'], $request->delete_date['end']]);
        }

        $arsip = $arsip->get();

        return response()->json($arsip);
    }
}
