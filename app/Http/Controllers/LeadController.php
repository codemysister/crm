<?php

namespace App\Http\Controllers;

use App\Http\Requests\LeadRequest;
use App\Imports\LeadsImport;
use App\Models\Lead;
use App\Models\Partner;
use App\Models\Status;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\Activitylog\Models\Activity;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $usersProp = User::with('roles')->get();
        $statusProp = Status::where('category', 'lead')->get();
        return Inertia::render("Lead/Index", compact('usersProp', 'statusProp'));
    }

    public function store(LeadRequest $request)
    {
        $lead = Lead::create([
            'uuid' => Str::uuid(),
            'name' => $request->name,
            'pic' => $request->pic,
            'phone_number' => $request->phone_number,
            'address' => $request->address,
            'total_members' => $request->total_members,
            'status_id' => $request->status['id'],
            'created_by' => Auth::user()->id
        ]);
    }

    public function update(LeadRequest $request, $uuid)
    {
        $lead = Lead::where('uuid', $uuid)->first();

        $lead->update([
            'name' => $request->name,
            'pic' => $request->pic,
            'phone_number' => $request->phone_number,
            'address' => $request->address,
            'total_members' => $request->total_members,
            'status_id' => $request->status['id'],
            'note_status' => $request->note_status
        ]);
    }

    public function show($uuid)
    {
        $lead = Lead::with(['status', 'createdBy'])->where('uuid', $uuid)->first();
        return response()->json($lead);
    }

    public function destroy($uuid)
    {
        $lead = Lead::where('uuid', $uuid)->first();
        $lead->delete();
    }
    public function destroyLogs(Request $request)
    {
        $ids = explode(",", $request->query('ids'));
        Activity::whereIn('id', $ids)->delete();
    }

    public function apiGetLeads()
    {
        $leadsDefault = Lead::with([
            'status',
            'createdBy'
        ])->latest()->get();
        return response()->json(
            $leadsDefault
        );
    }

    public function import()
    {
        $imported = Excel::import(new LeadsImport, request()->file('excel'));
    }

    public function filter(Request $request)
    {
        $leads = Lead::with([
            'status',
            'createdBy'
        ]);

        if ($request->user) {
            $leads->where('created_by', $request->user['id']);
        }

        if ($request->address) {
            $leads->where('address', 'LIKE', "%$request->address%");
        }

        if ($request->status) {
            $leads->whereHas('status', function ($query) use ($request) {
                $query->where('status_id', $request->status['id']);
            });
        }

        if ($request->input_date['start'] && $request->input_date['end']) {
            $leads->whereBetween('input_date', [$request->input_date['start'], $request->input_date['end']]);
        }


        $leads = $leads->get();

        return response()->json($leads);
    }

    public function logFilter(Request $request)
    {
        $logs = Activity::with(['causer', 'subject'])->whereMorphedTo('subject', Lead::class);

        if ($request->user) {
            $logs->whereMorphRelation('causer', User::class, 'causer_id', '=', $request->user['id']);
        }

        if ($request->date['start'] && $request->date['end']) {
            $logs->whereBetween('created_at', [$request->date['start'], $request->date['end']]);
        }

        $logs = $logs->get();

        return response()->json($logs);
    }

    public function restore($uuid)
    {
        $lead = Lead::withTrashed()->where('uuid', '=', $uuid)->first();
        $lead->restore();
    }

    public function destroyForce($uuid)
    {
        $lead = Lead::withTrashed()->where('uuid', '=', $uuid)->first();
        $lead->forceDelete();
    }

    public function apiGetLeadLogs()
    {
        $logs = Activity::with(['causer', 'subject'])
            ->whereMorphedTo('subject', Lead::class)
            ->latest()
            ->get();

        return response()->json($logs);
    }

    public function apiGetLeadArsip()
    {
        $arsip = Lead::withTrashed()->with(['createdBy', 'status'])->whereNotNull('deleted_at')->get();
        return response()->json($arsip);
    }
}
