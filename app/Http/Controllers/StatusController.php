<?php

namespace App\Http\Controllers;

use App\Http\Requests\StatusRequest;
use App\Models\Status;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

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
        $status->update([
            'name' => strtolower($request->name),
            'category' => strtolower($request->category),
            'color' => $request->color
        ]);
    }

    public function destroy($uuid)
    {
        $status = Status::where('uuid', '=', $uuid)->first();
        $status->delete();
    }

    public function apiGetStatus()
    {
        $statuses = Status::latest()->get();
        return response()->json($statuses);
    }

    public function apiGetStatusArsip()
    {
        $statuses = Status::withTrashed()->whereNotNull('deleted_at')->get();
        return response()->json($statuses);
    }
}
