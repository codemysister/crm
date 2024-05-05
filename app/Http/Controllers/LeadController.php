<?php

namespace App\Http\Controllers;

use App\Http\Requests\LeadRequest;
use App\Imports\LeadsImport;
use App\Models\Lead;
use App\Models\Partner;
use App\Models\Status;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
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
        $salesProp = User::role('account executive')->get();
        $referralProp = User::role('referral')->get();

        $uuid = $request->query('detail');
        $leadDetail = null;
        if ($uuid) {
            $leadDetail = Lead::with(['status', 'createdBy', 'sales', 'referral'])->where('uuid', '=', $uuid)->first();
        }
        return Inertia::render("Lead/Index", compact('usersProp', 'leadDetail', 'statusProp', 'salesProp', 'referralProp'));
    }

    public function store(LeadRequest $request)
    {
        try {
            $lead = Lead::create([
                'uuid' => Str::uuid(),
                'name' => $request->name,
                'sales_id' => $request->sales['id'],
                'referral_id' => $request->referral['id'] ?? null,
                'pic' => $request->pic,
                'phone_number' => $request->phone_number,
                'address' => $request->address,
                'total_members' => $request->total_members,
                'status_id' => $request->status['id'],
                'created_by' => Auth::user()->id
            ]);
        } catch (Exception $e) {
            Log::error('Error tambah lead: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function update(Request $request, $uuid)
    {
        $lead = Lead::where('uuid', $uuid)->first();

        $lead->update([
            'name' => $request->name,
            'sales_id' => $request->sales['id'] ?? null,
            'referral_id' => $request->referral['id'] ?? null,
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
        $lead = Lead::with('status')->where('uuid', $uuid)->first();
        Activity::create([
            'log_name' => 'deleted',
            'description' => Auth::user()->name . ' menghapus data lead',
            'subject_type' => get_class($lead),
            'subject_id' => $lead->id,
            'causer_type' => get_class(Auth::user()),
            'causer_id' => Auth::user()->id,
            "event" => "deleted",
            'properties' => ["old" => ['name' => $lead->name, 'address' => $lead->address, 'pic' => $lead->pic, 'total_members' => $lead->total_members, 'status.name' => $lead->status->name, 'status.color' => $lead->status->color]]
        ]);
        $lead->delete();
    }
    public function destroyLogs(Request $request)
    {
        $ids = explode(",", $request->query('ids'));
        Activity::whereIn('id', $ids)->delete();
    }

    public function apiGetLeads()
    {
        $leads = Lead::with(['status', 'createdBy', 'sales', 'referral'])
            ->latest()
            ->get();

        return response()->json([
            'leads' => $leads,
        ]);

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
            $leads->whereBetween('created_at', [Carbon::parse($request->input_date['start'])->setTimezone('GMT+7')->startOfDay(), Carbon::parse($request->input_date['end'])->setTimezone('GMT+7')->endOfDay()]);
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
            $logs->whereBetween('created_at', [Carbon::parse($request->date['start'])->setTimezone('GMT+7')->startOfDay(), Carbon::parse($request->date['end'])->setTimezone('GMT+7')->endOfDay()]);
        }

        $logs = $logs->latest()->get();

        return response()->json($logs);
    }

    public function restore($uuid)
    {
        $lead = Lead::withTrashed()->where('uuid', '=', $uuid)->first();
        $lead->restore();
    }

    public function destroyForce($uuid)
    {
        $lead = Lead::withTrashed()->with('status')->where('uuid', '=', $uuid)->first();
        Activity::create([
            'log_name' => 'force',
            'description' => Auth::user()->name . ' menghapus permanen data lead',
            'subject_type' => get_class($lead),
            'subject_id' => $lead->id,
            'causer_type' => get_class(Auth::user()),
            'causer_id' => Auth::user()->id,
            "event" => "force",
            'properties' => ["old" => ['name' => $lead->name, 'address' => $lead->address, 'pic' => $lead->pic, 'total_members' => $lead->total_members, 'status.name' => $lead->status->name, 'status.color' => $lead->status->color]]
        ]);
        $lead->forceDelete();
    }

    public function apiGetLeadLogs()
    {
        $logs = Activity::with(['causer', 'subject'])
            ->whereMorphedTo('subject', Lead::class);

        if (request()->query('lead')) {
            $logs->whereMorphRelation('subject', Lead::class, 'subject_id', '=', request()->query('lead'));
        }

        $logs = $logs->latest()->get();

        return response()->json($logs);
    }

    public function apiGetLeadArsip()
    {
        $arsip = Lead::withTrashed()->with(['createdBy', 'status', 'sales', 'referral'])->whereNotNull('deleted_at')->get();
        return response()->json($arsip);
    }

    public function arsipFilter(Request $request)
    {
        $arsip = Lead::withTrashed()->with(['createdBy', 'status', 'sales', 'referral'])->whereNotNull('deleted_at');

        if ($request->user) {
            $arsip->where('created_by', '=', $request->user['id']);
        }

        if ($request->delete_date['start'] && $request->delete_date['end']) {
            $arsip->whereBetween('deleted_at', [Carbon::parse($request->delete_date['start'])->setTimezone('GMT+7')->startOfDay(), Carbon::parse($request->delete_date['end'])->setTimezone('GMT+7')->endOfDay()]);
        }

        $arsip = $arsip->get();

        return response()->json($arsip);
    }

    public function apiGetStatusLogs()
    {
        $logs = Activity::with(['causer', 'subject'])
            ->whereMorphedTo('subject', Lead::class)
            ->whereMorphRelation('subject', Lead::class, 'subject_id', '=', request()->query('lead'))
            ->where('event', 'updated')
            ->where('note_status', '!=', null)
            ->latest()
            ->get();
        return response()->json($logs);
    }
}
