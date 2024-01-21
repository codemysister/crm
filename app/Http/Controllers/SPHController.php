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
        $usersDefault = User::with([
            'roles' => function ($query) {
                $query->latest();
            }
        ])->get();
        $usersDefault->transform(function ($user) {
            $user->position = $user->roles->first()->name;
            $user->user_id = $user->id;
            unset($user->roles);
            return $user;
        });
        $partnersDefault = Partner::with(
            'pics'
        )->get();
        $productsDefault = Product::all();
        $salesDefault = User::role('sales')->get();
        return Inertia::render('SPH/Create', compact('partnersDefault', 'usersDefault', 'productsDefault', 'salesDefault'));
    }


    public function store(Request $request)
    {
        $sph = SPH::create([
            "uuid" => Str::uuid(),
            "code" => $request->code,
            "partner_id" => $request->partner['id'],
            "partner" => json_encode([
                "name" => $request->partner['name'],
                "address" => $request->partner['address'],
                "pic" => $request->partner['pic']
            ]),
            "sales" => json_encode([
                "name" => $request->sales['name'],
                "wa" => $request->sales['wa'],
                "email" => $request->sales['email']
            ]),
            "signature" => json_encode([
                "signature" => $request->signature['signature'],
                "name" => $request->signature['name'],
                "position" => $request->signature['position'],
            ]),
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
        $usersDefault = User::with([
            'roles' => function ($query) {
                $query->latest();
            }
        ])->get();
        $usersDefault->transform(function ($user) {
            $user->position = $user->roles->first()->name;
            $user->user_id = $user->id;
            unset($user->roles);
            return $user;
        });
        $partnersDefault = Partner::with(
            'pics'
        )->get();
        $productsDefault = Product::all(['uuid', 'name', 'price', 'category']);
        $salesDefault = User::role('sales')->get();

        $sph = SPH::with('products')->where('uuid', '=', $uuid)->first();

        return Inertia::render('SPH/Edit', compact('usersDefault', 'partnersDefault', 'productsDefault', 'sph'));
    }

    public function update(Request $request, $uuid)
    {


        $sph = SPH::where('uuid', '=', $uuid)->update([
            "partner_id" => $request->partner_id,
            "partner" => json_encode([
                "name" => $request->partner['name'],
                "address" => $request->partner['address'],
                "pic" => $request->partner['pic']
            ]),
            "sales" => json_encode([
                "name" => $request->sales['name'],
                "wa" => $request->sales['wa'],
                "email" => $request->sales['email']
            ]),
            "signature" => json_encode([
                "signature" => $request->signature['signature'],
                "name" => $request->signature['name'],
                "position" => $request->signature['position'],
            ])
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
