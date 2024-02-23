<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $partners = Partner::with('sales', 'account_manager')->get();

        $partnersByProvince = DB::table('partners')
            ->select('province->name as province_name', DB::raw('count(*) as total'))
            ->groupBy('province_name')
            ->get();

        $totalPartner = Partner::count();
        $totalProses = Partner::where('status', 'proses')->count();
        $totalAktif = Partner::where('status', 'aktif')->count();
        $totalCLBK = Partner::where('status', 'clbk')->count();
        $totalCancel = Partner::where('status', 'cancel')->count();
        $totalNonaktif = Partner::where('status', 'non aktif')->count();
        $accountManagers = User::role('account manager')->get();

        $statisticGeneral = [
            "partners" => $partners,
            "totalPartner" => $totalPartner,
            "totalProses" => $totalProses,
            "totalAktif" => $totalAktif,
            "totalCLBK" => $totalCLBK,
            "totalCancel" => $totalCancel,
            "totalNonaktif" => $totalNonaktif,
            "partnersByProvince" => $partnersByProvince
        ];

        return Inertia::render('Dashboard/Index', compact('statisticGeneral', 'accountManagers'));
    }

    public function getPartnerByUser($id)
    {
        $partners = Partner::with('sales', 'account_manager')->where('account_manager_id', $id)->get();
        $partnersByProvince = DB::table('partners')
            ->select('province->name as province_name', DB::raw('count(*) as total'))
            ->groupBy('province_name')->where('account_manager_id', $id)
            ->get();
        $totalPartner = Partner::where('account_manager_id', $id)->count();
        $totalProses = Partner::where('account_manager_id', $id)->where('status', 'proses')->count();
        $totalAktif = Partner::where('account_manager_id', $id)->where('status', 'aktif')->count();
        $totalCLBK = Partner::where('account_manager_id', $id)->where('status', 'clbk')->count();
        $totalCancel = Partner::where('account_manager_id', $id)->where('status', 'cancel')->count();
        $totalNonaktif = Partner::where('account_manager_id', $id)->where('status', 'non aktif')->count();
        $statisticAM = [
            "partners" => $partners,
            "totalPartner" => $totalPartner,
            "totalProses" => $totalProses,
            "totalAktif" => $totalAktif,
            "totalCLBK" => $totalCLBK,
            "totalCancel" => $totalCancel,
            "totalNonaktif" => $totalNonaktif,
            "partnersByProvince" => $partnersByProvince
        ];

        return response()->json([$statisticAM]);
    }
}
