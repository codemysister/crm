<?php

namespace App\Http\Controllers;

use App\Jobs\GenerateSPHJob;
use App\Models\Partner;
use App\Models\Product;
use App\Models\SPH;
use App\Models\SPHProduct;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SPHController extends Controller
{
    public function index()
    {
        return Inertia::render('SPH/Index');
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
        $salesProp = User::role('sales')->get();
        return Inertia::render('SPH/Create', compact('partnersProp', 'usersProp', 'productsProp', 'salesProp'));
    }


    public function store(Request $request)
    {
        $sph = SPH::create([
            "uuid" => Str::uuid(),
            "code" => $request->code,
            "partner_id" => $request->partner_id,
            "partner_name" => $request->partner_name,
            "partner_pic" => $request->partner_pic,
            "partner_address" => $request->partner_address,
            "sales_name" => $request->sales_name,
            "sales_wa" => $request->sales_wa,
            "sales_email" => $request->sales_email,
            "signature_name" => $request->signature_name,
            "signature_position" => $request->signature_position,
            "signature_image" => $request->signature_image,
            "sph_doc" => "",
            "created_by" => Auth::user()->id
        ]);

        foreach ($request->products as $product) {
            SPHProduct::create([
                "sph_id" => $sph->id,
                "name" => $product['name'],
                "qty" => $product['qty'],
                "price" => $product['price'],
                "detail" => $product['detail'],
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
        $salesProp = User::role('sales')->get();

        $sph = SPH::with('products')->where('uuid', '=', $uuid)->first();

        return Inertia::render('SPH/Edit', compact('usersProp', 'partnersProp', 'productsProp', 'sph'));
    }

    public function update(Request $request, $uuid)
    {
        $sph = SPH::where('uuid', '=', $uuid)->update([
            "partner_id" => $request->partner_id,
            "partner_name" => $request->partner_name,
            "partner_pic" => $request->partner_pic,
            "partner_address" => $request->partner_address,
            "sales_name" => $request->sales_name,
            "sales_wa" => $request->sales_wa,
            "sales_email" => $request->sales_email,
            "signature_name" => $request->signature_name,
            "signature_position" => $request->signature_position,
            "signature_image" => $request->signature_image,
        ]);

        $sph = SPH::with('products')->where('uuid', '=', $uuid)->first();

        foreach ($request->products as $product) {
            SPHProduct::updateOrCreate(
                [
                    'id' => $product['id'] ?? null,
                ],
                [
                    'sph_id' => $sph->id,
                    'name' => $product['name'],
                    'qty' => $product['qty'],
                    'detail' => $product['detail'],
                    'price' => $product['price'],
                    'total' => $product['total'],
                ]
            );

        }

        GenerateSPHJob::dispatch($sph, $request->products);
    }

    public function apiGetSPH()
    {
        $sphsDefault = SPH::with('user')->get();
        return response()->json($sphsDefault);
    }

    public function destroy($uuid)
    {
        $sph = SPH::where('uuid', '=', $uuid)->first();
        unlink($sph->sph_doc);
        $sph->delete();
    }
}
