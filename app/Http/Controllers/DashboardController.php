<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use App\Models\Status;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {

        $partners = Partner::with('sales', 'account_manager', 'status')->get();
        $usersProp = User::whereHas('roles', function ($query) {
            $query->where('name', 'account executive')->orWhere('name', 'account manager');
        })->get();
        $partnersByProvince = DB::table('partners')
            ->select('province->name as province_name', DB::raw('count(*) as total'))
            ->groupBy('province_name')
            ->get();

        $statusNames = ['proses', 'aktif', 'non aktif'];
        $statuses = Status::whereIn('name', $statusNames)->get()->keyBy('name');

        $totalPartner = Partner::count();
        $counts = Partner::select('status_id', DB::raw('count(*) as total'))
            ->groupBy('status_id')
            ->get()
            ->pluck('total', 'status_id')
            ->toArray();

        $totalProses = $counts[$statuses['proses']->id] ?? 0;
        $totalAktif = $counts[$statuses['aktif']->id] ?? 0;
        $totalNonaktif = $counts[$statuses['non aktif']->id] ?? 0;

        $statisticGeneralProp = [
            "partners" => $partners,
            "totalPartner" => $totalPartner,
            "totalProses" => $totalProses,
            "totalAktif" => $totalAktif,
            "totalNonaktif" => $totalNonaktif,
            "partnersByProvince" => $partnersByProvince
        ];

        return Inertia::render('Dashboard/Index', compact('statisticGeneralProp', 'usersProp'));
    }

    public function getPartnerByUser($id)
    {
        $partners = Partner::with('sales', 'account_manager', 'createdBy', 'status')->where('sales_id', $id)->orWhere('account_manager_id', $id)->orwhere('created_by', $id)->get();
        $partnersByProvince = DB::table('partners')
            ->select('province->name as province_name', DB::raw('count(*) as total'))
            ->groupBy('province_name')->where('sales_id', $id)->orWhere('account_manager_id', $id)->orwhere('created_by', $id)
            ->get();

        $statusNames = ['proses', 'aktif', 'non aktif'];
        $statuses = Status::whereIn('name', $statusNames)->get()->keyBy('name');

        $counts = Partner::where('sales_id', $id)->orWhere('account_manager_id', $id)->orwhere('created_by', $id)
            ->select('status_id', DB::raw('count(*) as total'))
            ->groupBy('status_id')
            ->get()
            ->pluck('total', 'status_id')
            ->toArray();

        $totalPartner = array_sum($counts);

        $totalProses = $counts[$statuses['proses']->id] ?? 0;
        $totalAktif = $counts[$statuses['aktif']->id] ?? 0;
        $totalNonaktif = $counts[$statuses['non aktif']->id] ?? 0;

        $statisticAM = [
            "partners" => $partners,
            "totalPartner" => $totalPartner,
            "totalProses" => $totalProses,
            "totalAktif" => $totalAktif,
            "totalNonaktif" => $totalNonaktif,
            "partnersByProvince" => $partnersByProvince
        ];

        return response()->json([$statisticAM]);
    }

    public function apiGetStatGeneral()
    {

        $partners = Partner::with('sales', 'account_manager', 'status')->get();
        $partnersByProvince = DB::table('partners')
            ->select('province->name as province_name', DB::raw('count(*) as total'))
            ->groupBy('province_name')
            ->get();

        $statusNames = ['proses', 'aktif', 'non aktif'];
        $statuses = Status::whereIn('name', $statusNames)->get()->keyBy('name');

        $totalPartner = Partner::count();
        $counts = Partner::select('status_id', DB::raw('count(*) as total'))
            ->groupBy('status_id')
            ->get()
            ->pluck('total', 'status_id')
            ->toArray();

        $totalProses = $counts[$statuses['proses']->id] ?? 0;
        $totalAktif = $counts[$statuses['aktif']->id] ?? 0;
        $totalNonaktif = $counts[$statuses['non aktif']->id] ?? 0;

        $statisticGeneral = [
            "partners" => $partners,
            "totalPartner" => $totalPartner,
            "totalProses" => $totalProses,
            "totalAktif" => $totalAktif,
            "totalNonaktif" => $totalNonaktif,
            "partnersByProvince" => $partnersByProvince
        ];

        // return Inertia::render('Dashboard/Index', compact('statisticGeneralProp', 'usersProp'));
        return response()->json($statisticGeneral);
    }
}
