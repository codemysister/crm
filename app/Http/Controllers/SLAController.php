<?php

namespace App\Http\Controllers;

use App\Http\Requests\SLARequest;
use App\Jobs\GenerateSLAJob;
use App\Models\Partner;
use App\Models\SLA;
use App\Models\SlaActivity;
use App\Models\User;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class SLAController extends Controller
{
    public function index()
    {
        return Inertia::render('SLA/Index');
    }

    public function create()
    {
        $usersProp = User::with([
            'roles' => function ($query) {
                $query->latest();
            }
        ])->get();
        $usersProp->transform(function ($user) {
            $user->position = $user->roles->first()->name;
            $user->user_id = $user->id;
            unset($user->roles);
            return $user;
        });
        $partnersProp = Partner::with(
            'pics'
        )->get();
        $rolesProp = DB::table('roles')->distinct()->get("name");
        return Inertia::render('SLA/Create', compact('partnersProp', 'usersProp', 'rolesProp'));
    }

    public function store(SLARequest $request)
    {
        $validated = $request->validated();
        $sla = SLA::create([
            "uuid" => Str::uuid(),
            "code" => $request->code,
            "partner_id" => $request->partner_id,
            "partner_name" => $request->partner_name,
            "partner_address" => $request->partner_address,
            "partner_phone_number" => $request->partner_phone_number,
            "partner_pic" => $request->partner_pic,
            "partner_pic_email" => $request->partner_pic_email,
            "partner_pic_number" => $request->partner_pic_number,
            "referral" => $request->referral,
            "referral_name" => $request->referral_name,
            "created_by" => Auth::user()->id,
            "signature_name" => $request->signature_name,
            "signature_image" => $request->signature_image,
            "sla_doc" => "tes"
        ]);

        foreach ($request->activities as $activity) {
            SlaActivity::create([
                "sla_id" => $sla->id,
                "activity" => $activity['activity'],
                "cazh_pic" => $activity['cazh_pic'],
                "duration" => $activity['duration'],
                "estimation_date" => (new DateTime($activity['estimation_date']))->format('Y-m-d H:i:s'),
                "realization" => $activity['realization']
            ]);
        }

        GenerateSLAJob::dispatch($sla, $request->activities);
    }
}
