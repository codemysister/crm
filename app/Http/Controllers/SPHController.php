<?php

namespace App\Http\Controllers;

use App\Http\Requests\SPHRequest;
use App\Jobs\GenerateSPHJob;
use App\Models\Partner;
use App\Models\PartnerPIC;
use App\Models\Product;
use App\Models\Signature;
use App\Models\SPH;
use App\Models\SPHProduct;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SPHController extends Controller
{
    public function index()
    {
        $signaturesProp = Signature::all();
        return Inertia::render('SPH/Index', compact('signaturesProp'));
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
            unset ($user->roles);
            return $user;
        });
        $partnersProp = Partner::with(
            'pics'
        )->get();
        $productsProp = Product::all();
        $salesProp = User::role('account executive')->get();
        $signaturesProp = Signature::all();
        return Inertia::render('SPH/Create', compact('partnersProp', 'usersProp', 'productsProp', 'salesProp', 'signaturesProp'));
    }

    function updateProducts($sph, $oldData, $newData)
    {
        $oldIds = $oldData->pluck('id');
        $newIds = array_filter(Arr::pluck($newData, 'id'), 'is_numeric');

        $delete = collect($oldData)
            ->filter(function ($model) use ($newIds) {
                return !in_array($model->id, $newIds);
            });

        $update = collect($newData)
            ->filter(function ($model) use ($oldIds) {
                return array_key_exists('id', $model) && in_array($model['id'], $oldIds->toArray());
            });

        $create = collect($newData)
            ->filter(function ($model) use ($oldIds) {
                if (array_key_exists('id', $model)) {
                    return !in_array($model['id'], $oldIds->toArray());
                } else {
                    return true;
                }
            });

        SPHProduct::destroy($delete->pluck('id')->toArray());
        foreach ($update as $product) {
            $product = SPHProduct::where('id', $product['id'])->first();
            $product->update([
                "name" => $product['name'],
                "qty" => $product['qty'],
                "price" => $product['price'],
                "detail" => isset ($product['detail']) ? $product['detail'] : null,
                "total" => $product['total']
            ]);
        }
        foreach ($create as $product) {
            SPHProduct::create([
                "sph_id" => $sph->id,
                "name" => $product['name'],
                "qty" => $product['qty'],
                "price" => $product['price'],
                "detail" => isset ($product['detail']) ? $product['detail'] : null,
                "total" => $product['total']
            ]);
        }


        return true;
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

        $totalDataPerMonth = SPH::whereYear('created_at', $currentYear)
            ->whereMonth('created_at', $currentMonth)
            ->count();

        $romanMonth = intToRoman($currentMonth);
        $latestData = "SPH/0000/$romanMonth/$currentYear";
        $lastCode = $latestData ? explode('/', $latestData)[1] : 0;
        $newCode = str_pad((int) $lastCode + $totalDataPerMonth + 1, 4, '0', STR_PAD_LEFT);
        $newCode = "SPH/$newCode/$romanMonth/$currentYear";

        return $newCode;
    }

    public function store(SPHRequest $request)
    {
        $id_partner = $request['partner']['id'];

        if (!$id_partner) {
            $partnerExists = Partner::where('name', 'like', '%' . $request['partner']["name"] . '%')->first();
            if (!$partnerExists) {
                $partner = Partner::create([
                    'uuid' => Str::uuid(),
                    'name' => $request['partner']['name'],
                    'province' => $request['partner']['province'],
                    'regency' => $request['partner']['regency'],
                    'status' => "Prospek",
                ]);
                PartnerPIC::create([
                    'uuid' => Str::uuid(),
                    'partner_id' => $partner->id,
                    'name' => $request->partner['pic'],
                ]);
                $id_partner = $partner->id;
            } else {
                $id_partner = $partnerExists->id;
            }
        }

        $code = $this->generateCode();
        $sph = SPH::create([
            "uuid" => Str::uuid(),
            "code" => $code,
            'date' => Carbon::now(),
            "partner_id" => $id_partner,
            "partner_name" => $request['partner']['name'],
            "partner_pic" => $request['partner']['pic'],
            "partner_province" => $request['partner']['province'],
            "partner_regency" => $request['partner']['regency'],
            "sales_name" => $request['sales']['name'],
            "sales_wa" => $request['sales']['wa'],
            "sales_email" => $request['sales']['email'],
            "signature_name" => $request['signature']['name'],
            "signature_position" => $request['signature']['position'],
            "signature_image" => $request['signature']['image'],
            "sph_doc" => "",
            "created_by" => Auth::user()->id
        ]);

        foreach ($request->products as $product) {
            SPHProduct::create([
                "sph_id" => $sph->id,
                "name" => $product['name'],
                "qty" => $product['qty'],
                "price" => $product['price'],
                "detail" => isset ($product['detail']) ? $product['detail'] : null,
                "total" => $product['total']
            ]);
        }

        GenerateSPHJob::dispatch($sph, $request->products);
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
            unset ($user->roles);
            return $user;
        });
        $partnersProp = Partner::with(
            'pics'
        )->get();
        $productsProp = Product::all(['uuid', 'name', 'price', 'category']);
        $salesProp = User::role('account executive')->get();

        $sph = SPH::with('products')->where('uuid', '=', $uuid)->first();
        $signaturesProp = Signature::all();
        return Inertia::render('SPH/Edit', compact('usersProp', 'partnersProp', 'productsProp', 'salesProp', 'sph', 'signaturesProp'));
    }

    public function update(SPHRequest $request, $uuid)
    {
        $id_partner = $request['partner']['id'];

        if (!$id_partner) {

            $partnerExists = Partner::where('name', 'like', '%' . $request['partner']["name"] . '%')->first();
            if (!$partnerExists) {
                $partner = Partner::create([
                    'uuid' => Str::uuid(),
                    'name' => $request['partner']['name'],
                    'province' => $request['partner']['province'],
                    'regency' => $request['partner']['regency'],
                    'status' => "Prospek",
                ]);
                PartnerPIC::create([
                    'uuid' => Str::uuid(),
                    'partner_id' => $partner->id,
                    'name' => $request->partner['pic'],
                ]);
                $id_partner = $partner->id;
            } else {
                $id_partner = $partnerExists->id;
            }
        }

        $sph = SPH::where('uuid', '=', $uuid)->update([
            "partner_id" => $id_partner,
            "partner_name" => $request['partner']['name'],
            "partner_pic" => $request['partner']['pic'],
            "partner_province" => $request['partner']['province'],
            "partner_regency" => $request['partner']['regency'],
            "sales_name" => $request['sales']['name'],
            "sales_wa" => $request['sales']['wa'],
            "sales_email" => $request['sales']['email'],
            "signature_name" => $request['signature']['name'],
            "signature_position" => $request['signature']['position'],
            "signature_image" => $request['signature']['image'],
        ]);

        $sph = SPH::with('products')->where('uuid', '=', $uuid)->first();

        $this->updateProducts($sph, $sph->products, $request->products);

        GenerateSPHJob::dispatch($sph, $request->products);
    }

    public function apiGetSPH()
    {
        $sphsDefault = SPH::with('user', 'partner')->latest()->get();
        return response()->json($sphsDefault);
    }

    public function destroy($uuid)
    {
        $sph = SPH::where('uuid', '=', $uuid)->first();
        unlink($sph->sph_doc);
        $sph->delete();
    }
}
