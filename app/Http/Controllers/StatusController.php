<?php

namespace App\Http\Controllers;

use App\Http\Requests\StatusRequest;
use App\Models\Status;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class StatusController extends Controller
{

    public function index()
    {
        return Inertia::render('Status/Index');
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
        $status->delete();
    }

    public function destroyForce($uuid)
    {
        $status = Status::withTrashed()->where('uuid', '=', $uuid)->first();
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

    public function apiGetStatusLog()
    {
        $logs = Activity::with('causer', 'subject')->latest()->get();

        return response()->json($logs);
    }

    public function apiGetStatusArsip()
    {
        $statuses = Status::withTrashed()->whereNotNull('deleted_at')->latest()->get();
        return response()->json($statuses);
    }
}
