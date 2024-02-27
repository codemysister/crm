<?php

namespace App\Http\Controllers;

use App\Jobs\GenerateSPHJob;
use App\Models\Partner;
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
            unset($user->roles);
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
            $product = SPHProduct::find($product['id'])->first();
            $product->update([
                "name" => $product['name'],
                "qty" => $product['qty'],
                "price" => $product['price'],
                "detail" => isset($product['detail']) ? $product['detail'] : null,
                "total" => $product['total']
            ]);
        }
        foreach ($create as $product) {
            SPHProduct::create([
                "sph_id" => $sph->id,
                "name" => $product['name'],
                "qty" => $product['qty'],
                "price" => $product['price'],
                "detail" => isset($product['detail']) ? $product['detail'] : null,
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

        $romanMonth = intToRoman($currentMonth);
        $latestData = SPH::latest()->first() ?? "SPH/0000/$romanMonth/$currentYear";
        $lastCode = $latestData ? explode('/', $latestData->code ?? $latestData)[1] : 0;
        $newCode = str_pad((int) $lastCode + 1, 4, '0', STR_PAD_LEFT);
        $newCode = "SPH/$newCode/$romanMonth/$currentYear";
        return $newCode;
    }

    public function store(Request $request)
    {
        $code = $this->generateCode();
        $sph = SPH::create([
            "uuid" => Str::uuid(),
            "code" => $code,
            "partner_id" => $request['partner']['id'],
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
                "detail" => isset($product['detail']) ? $product['detail'] : null,
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
            unset($user->roles);
            return $user;
        });
        $partnersProp = Partner::with(
            'pics'
        )->get();
        $productsProp = Product::all(['uuid', 'name', 'price', 'category']);
        $salesProp = User::role('account executive')->get();

        $sph = SPH::with('products')->where('uuid', '=', $uuid)->first();

        return Inertia::render('SPH/Edit', compact('usersProp', 'partnersProp', 'productsProp', 'salesProp', 'sph'));
    }

    public function update(Request $request, $uuid)
    {
        $sph = SPH::where('uuid', '=', $uuid)->update([
            "partner_id" => $request['partner']['id'],
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
