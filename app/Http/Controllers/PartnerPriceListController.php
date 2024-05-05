<?php

namespace App\Http\Controllers;

use App\Http\Requests\PartnerPriceListRequest;
use App\Models\Partner;
use App\Models\PartnerPriceList;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class PartnerPriceListController extends Controller
{

    public function index()
    {
        $usersProp = User::with('roles')->get();
        $partnersProp = Partner::with(['status'])->get();
        return Inertia::render("Partner/Price/Index", compact('partnersProp', 'usersProp'));
    }

    public function apiGetPriceLists()
    {
        $priceLists = PartnerPriceList::with(['partner', 'createdBy'])->latest()
            ->get();
        return response()->json($priceLists);
    }

    public function store(PartnerPriceListRequest $request)
    {
        PartnerPriceList::create([
            'uuid' => Str::uuid(),
            'partner_id' => $request["partner"]["id"],
            'price_card' => json_encode([
                'price' => $request['price_card']['price'],
                'type' => $request['price_card']['price'] !== null ? $request['price_card']['type'] : '',
            ]),
            'price_lanyard' => $request['price_lanyard'],
            'price_subscription_system' => $request['price_subscription_system'],
            'price_training_offline' => $request['price_training_offline'],
            'price_training_online' => $request['price_training_online'],
            'fee_qris' => $request['fee_qris'],
            'fee_purchase_cazhpoin' => $request['fee_purchase_cazhpoin'],
            'fee_bill_cazhpoin' => $request['fee_bill_cazhpoin'],
            'fee_topup_cazhpos' => $request['fee_topup_cazhpos'],
            'fee_withdraw_cazhpos' => $request['fee_withdraw_cazhpos'],
            'fee_bill_saldokartu' => $request['fee_bill_saldokartu'],
            'created_by' => Auth::user()->id
        ]);
    }

    public function update(PartnerPriceListRequest $request, $uuid)
    {
        PartnerPriceList::where('uuid', $uuid)->first()->update([
            'uuid' => Str::uuid(),
            'partner_id' => $request["partner"]["id"],
            'price_card' => json_encode([
                'price' => $request['price_card']['price'],
                'type' => $request['price_card']['price'] !== null ? $request['price_card']['type'] : '',
            ]),
            'price_lanyard' => $request['price_lanyard'],
            'price_subscription_system' => $request['price_subscription_system'],
            'price_training_offline' => $request['price_training_offline'],
            'price_training_online' => $request['price_training_online'],
            'fee_qris' => $request['fee_qris'],
            'fee_purchase_cazhpoin' => $request['fee_purchase_cazhpoin'],
            'fee_bill_cazhpoin' => $request['fee_bill_cazhpoin'],
            'fee_topup_cazhpos' => $request['fee_topup_cazhpos'],
            'fee_withdraw_cazhpos' => $request['fee_withdraw_cazhpos'],
            'fee_bill_saldokartu' => $request['fee_bill_saldokartu'],
        ]);
    }

    public function apiGetLogs($partner_id)
    {
        $logs = Activity::with(['causer', 'subject'])
            ->whereHasMorph('subject', [PartnerPriceList::class], function ($query) use ($partner_id) {
                $query->where('partner_id', $partner_id);
            })
            ->latest()
            ->get();

        return response()->json($logs);
    }

    public function destroy($uuid)
    {
        PartnerPriceList::where('uuid', $uuid)->delete();
    }

    public function filter(Request $request)
    {
        $priceLists = PartnerPriceList::with([
            'partner',
            'createdBy'
        ]);

        if ($request->user) {
            $priceLists->where('created_by', $request->user['id']);
        }

        if ($request->input_date['start'] && $request->input_date['end']) {
            $priceLists->whereBetween('created_at', [$request->input_date['start'], $request->input_date['end']]);
        }


        $priceLists = $priceLists->latest()->get();

        return response()->json($priceLists);
    }
}
