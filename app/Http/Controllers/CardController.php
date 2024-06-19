<?php

namespace App\Http\Controllers;

use App\Http\Requests\CardRequest;
use App\Models\Card;
use App\Models\Partner;
use App\Models\Status;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class CardController extends Controller
{
    public function index()
    {
        $partnersProp = Partner::with('price_list', 'createdBy')->whereHas('status', function ($query) {
            $query->where('name', 'aktif')->orWhere('name', 'proses');
        })->latest()->get();
        $statusesProp = Status::where('category', 'kartu')->orderBy('id', 'asc')->get();
        return Inertia::render('Card/Index', compact('statusesProp', 'partnersProp'));
    }


    public function store(CardRequest $request)
    {
        DB::beginTransaction();

        try {

            $status = Status::where('name', 'pengajuan design')->first();

            $card = Card::create([
                'uuid' => Str::uuid(),
                'partner_id' => $request->partner['id'],
                'status_id' => $status->id,
                'pcs' => $request->pcs,
                'type' => $request->type,
                'price' => $request->price,
                'total' => $request->total,
                'google_drive_link' => $request->google_drive_link,
                'address' => $request->address,
                // 'approval_date' => Carbon::now(),
                'created_by' => Auth::user()->id
            ]);

            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error tambah kartu: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function update(CardRequest $request, $uuid)
    {
        DB::beginTransaction();

        try {
            $card = Card::where('uuid', '=', $uuid)->first();

            if ($request->status['name'] == 'disetujui') {
                $approval_date = Carbon::now();
            } else if ($request->status['name'] == 'design') {
                $design_date = Carbon::now();
            } else if ($request->status['name'] == 'print') {
                $print_date = Carbon::now();
            } else if ($request->status['name'] == 'dikirim') {
                $delivery_date = Carbon::now();
            } else if ($request->status['name'] == 'sampai') {
                $arrive_date = Carbon::now();
            }

            $card->update([
                'partner_id' => $request->partner['id'],
                'status_id' => $request->status['id'],
                'pcs' => $request->pcs,
                'price' => $request->price,
                'type' => $request->type,
                'revision_detail' => $request->revision_detail,
                'google_drive_link' => $request->google_drive_link,
                'address' => $request->address,
                'total' => $request->total,
                'approval_date' => $approval_date ?? $card->approval_date,
                'design_date' => $design_date ?? $card->design_date,
                'print_date' => $print_date ?? $card->print_date,
                'delivery_date' => $delivery_date
                    ?? $card->delivery_date,
                'arrive_date' => $arrive_date
                    ?? $card->arrive_date,
            ]);
            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error update kartu: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function destroy($uuid)
    {
        DB::beginTransaction();

        try {
            $card = Card::with('partner', 'status')->where('uuid', $uuid)->first();
            Activity::create([
                'log_name' => 'deleted',
                'description' => 'hapus data kartu',
                'subject_type' => get_class($card),
                'subject_id' => $card->id,
                'causer_type' => get_class(Auth::user()),
                'causer_id' => Auth::user()->id,
                "event" => "deleted",
                'properties' => ["old" => ["partner.name" => $card->partner->name, "status.name" => $card->status->name, 'pcs' => $card->pcs, 'price' => $card->price, 'total' => $card->total, 'google_drive_link' => $card->google_drive_link, 'type' => $card->type, 'approval_date' => $card->approval_date, 'design_date' => $card->design_date, 'print_date' => $card->print_date, 'delivery' => $card->delivery]]
            ]);
            $card->delete();
            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error hapus kartu: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function restore($uuid)
    {
        DB::beginTransaction();
        try {
            $card = Card::withTrashed()->where('uuid', '=', $uuid)->first();
            $card->restore();
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error restore card: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function destroyForce($uuid)
    {
        DB::beginTransaction();

        try {
            $card = Card::withTrashed()->with('partner', 'status')->where('uuid', $uuid)->first();
            Activity::create([
                'log_name' => 'force',
                'description' => 'hapus permanen data kartu',
                'subject_type' => get_class($card),
                'subject_id' => $card->id,
                'causer_type' => get_class(Auth::user()),
                'causer_id' => Auth::user()->id,
                "event" => "force",
                'properties' => ["old" => ["partner.name" => $card->partner->name, "status.name" => $card->status->name, 'pcs' => $card->pcs, 'price' => $card->price, 'total' => $card->total, 'google_drive_link' => $card->google_drive_link, 'type' => $card->type, 'approval_date' => $card->approval_date, 'design_date' => $card->design_date, 'print_date' => $card->print_date, 'delivery' => $card->delivery]]
            ]);
            $card->forceDelete();
            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error hapus permanen kartu: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function apiGetCards()
    {
        $cards = Card::with('partner', 'createdBy', 'status')->latest()->get();
        return response()->json($cards);
    }

    public function logFilter(Request $request)
    {
        $logs = Activity::with(['causer', 'subject'])->whereMorphedTo('subject', Card::class);

        if ($request->user) {
            $logs->whereMorphRelation('causer', User::class, 'causer_id', '=', $request->user['id']);
        }

        if ($request->date['start'] && $request->date['end']) {
            $logs->whereBetween('created_at', [$request->date['start'], $request->date['end']]);
        }

        $logs = $logs->latest()->get();

        return response()->json($logs);
    }

    public function apiGetLogs()
    {
        $logs = Activity::with(['causer', 'subject'])
            ->whereMorphedTo('subject', Card::class);

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
        $arsip = Card::withTrashed()->with(['partner', 'status', 'createdBy'])->whereNotNull('deleted_at')->latest()->get();
        return response()->json($arsip);
    }

    public function arsipFilter(Request $request)
    {
        $arsip = Card::withTrashed()->with(['partner', 'status'])->whereNotNull('deleted_at');

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
