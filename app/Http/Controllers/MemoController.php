<?php

namespace App\Http\Controllers;

use App\Models\Memo;
use App\Models\Partner;
use App\Models\Signature;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MemoController extends Controller
{
    public function index()
    {
        return Inertia::render('Memo/Index');
    }

    public function create()
    {
        $signaturesProp = Signature::all();
        $partnersProp = Partner::all();
        return Inertia::render('Memo/Create', compact('signaturesProp', 'partnersProp'));
    }

    public function generateCode()
    {
        $currentMonth = date('n');
        $currentYear = date('Y');

        function intToRoman($number)
        {
            $map = array('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII');
            return $map[$number - 1];
        }

        $totalDataPerMonth = Memo::whereYear('date', $currentYear)
            ->whereMonth('date', $currentMonth)
            ->count();
        $romanMonth = intToRoman($currentMonth);
        $latestData = "MDH/000/$romanMonth/$currentYear";
        $lastCode = $latestData ? explode('/', $latestData)[1] : 0;
        $newCode = str_pad((int) $lastCode + $totalDataPerMonth + 1, 3, '0', STR_PAD_LEFT);
        $newCode = "MDH/$newCode/$romanMonth/$currentYear";
        return $newCode;
    }

    public function store(Request $request)
    {
        $id_partner = $request['partner']['id'];

        if (!$id_partner) {
            $partnerExists = Partner::where('name', 'like', '%' . $request['partner']["name"] . '%')->first();
            if (!$partnerExists) {
                $partner = Partner::create([
                    'uuid' => Str::uuid(),
                    'name' => $request['partner']['name'],
                    'status' => "Proses",
                ]);
                $id_partner = $partner->id;
            } else {
                $id_partner = $partnerExists->id;
            }
        }
        Memo::create([
            'uuid' => Str::uuid(),
            'code' => $this->generateCode(),
            'partner_id' => $id_partner,
            'partner_name' => $request['partner']['name'],
            'date' => Carbon::now(),
            'price_card' => $request['price_card'],
            'price_e_card' => $request['price_e_card'],
            'price_subscription' => $request['price_subscription'],
            'consideration' => $request['consideration'],
            'signature_first_name' => $request['signature_first']['name'],
            'signature_first_image' => $request['signature_first']['image'],
            'signature_second_name' => $request['signature_second']['name'],
            'signature_second_image' => $request['signature_second']['image'],
            'signature_third_name' => $request['signature_third']['name'],
            'signature_third_image' => $request['signature_third']['image'],
            'created_by' => Auth::user()->id,
        ]);

    }

    public function apiGetMemo()
    {
        $memo = Memo::all();
        return response()->json($memo);
    }
}
