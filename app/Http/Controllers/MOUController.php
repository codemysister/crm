<?php

namespace App\Http\Controllers;

use App\Http\Requests\MOURequest;
use App\Jobs\GenerateMOUJob;
use App\Models\MOU;
use App\Models\Partner;
use App\Models\Product;
use App\Models\User;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MOUController extends Controller
{
    public function index()
    {
        return Inertia::render('MOU/Index');
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
        return Inertia::render('MOU/Create', compact('partnersProp', 'usersProp'));
    }

    public function store(MOURequest $request)
    {

        $validated = $request->validated();
        $mou = MOU::create([
            "uuid" => Str::uuid(),
            "code" => $request->code,
            "day" => $request->day,
            "date" => (new DateTime($request->date))->format('Y-m-d H:i:s'),
            "partner_name" => $request->partner_name,
            "partner_pic" => $request->partner_pic,
            "partner_pic_position" => $request->partner_pic_position,
            "partner_address" => $request->partner_address,
            "url_subdomain" => $request->url_subdomain,
            "price_card" => $request->price_card,
            "price_lanyard" => $request->price_lanyard,
            "nominal_subscription" => $request->nominal_subscription,
            "period_subscription" => $request->period_subscription,
            "price_training_offline" => $request->price_training_offline,
            "price_training_online" => $request->price_training_online,
            "fee_purchase_cazhpoin" => $request->fee_purchase_cazhpoin,
            "fee_bill_cazhpoin" => $request->fee_bill_cazhpoin,
            "fee_topup_cazhpos" => $request->fee_topup_cazhpos,
            "fee_withdraw_cazhpos" => $request->fee_withdraw_cazhpos,
            "fee_bill_saldokartu" => $request->fee_bill_saldokartu,
            "bank" => $request->bank,
            "account_bank_number" => $request->account_bank_number,
            "account_bank_name" => $request->account_bank_name,
            "expired_date" => (new DateTime($request->expired_date))->format('Y-m-d H:i:s'),
            "profit_sharing" => $request->profit_sharing,
            "created_by" => Auth::user()->id,
            "signature_name" => $request->signature_name,
            "signature_position" => $request->signature_position,
            "signature_image" => $request->signature_image,
            "mou_doc" => "tes"
        ]);

        GenerateMOUJob::dispatch($mou);
    }

    public function edit($uuid)
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
        $mou = MOU::where('uuid', '=', $uuid)->first();
        return Inertia::render('MOU/Edit', compact('mou', 'usersProp', 'partnersProp'));
    }

    public function apiGetMou()
    {
        $mouProp = MOU::with('user')->get();
        return response()->json($mouProp);
    }
}
