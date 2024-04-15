<?php

namespace App\Http\Controllers;

use App\Http\Requests\SPHRequest;
use App\Jobs\GenerateSPHJob;
use App\Models\Lead;
use App\Models\Partner;
use App\Models\PartnerPIC;
use App\Models\Product;
use App\Models\Signature;
use App\Models\SPH;
use App\Models\SPHProduct;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SPHController extends Controller
{
    public function index()
    {
        $signaturesProp = Signature::all();
        $usersProp = User::with('roles')->get();
        return Inertia::render('SPH/Index', compact('signaturesProp', 'usersProp'));
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

        DB::beginTransaction();

        try {
            if ($request['partner']['type'] == 'partner') {
                $partnerExists = Partner::where('uuid', $request['partner']["uuid"])->first();
            } else {
                $partnerExists = Lead::where('uuid', $request['partner']["uuid"])->first();
            }

            $code = $this->generateCode();
            $sph = SPH::create([
                "uuid" => Str::uuid(),
                "code" => $code,
                'date' => Carbon::now(),
                "sphable_id" => $partnerExists->id,
                "sphable_type" => get_class($partnerExists),
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

            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error tambah sph: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
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
        DB::beginTransaction();

        try {

            if ($request['partner']['type'] == 'partner') {
                $partnerExists = Partner::where('uuid', $request['partner']["uuid"])->first();
            } else {
                $partnerExists = Lead::where('uuid', $request['partner']["uuid"])->first();
            }

            $sph = SPH::where('uuid', '=', $uuid)->update([
                "sphable_id" => $partnerExists->id,
                "sphable_type" => get_class($partnerExists),
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

            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error tambah sph: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
        GenerateSPHJob::dispatch($sph, $request->products);
    }

    public function filter(Request $request)
    {
        $sphs = SPH::with(['user', 'sphable']);

        if ($request->user) {
            $sphs->where('created_by', $request->user['id']);
        }
        if ($request->institution_type == 'Lead') {
            $sphs->whereMorphedTo('sphable', Lead::class);
        } else if ($request->institution_type == 'Partner') {
            $sphs->whereMorphedTo('sphable', Partner::class);
        }

        if ($request->input_date['start'] && $request->input_date['end']) {
            $sphs->whereBetween('created_at', [$request->input_date['start'], $request->input_date['end']]);
        }

        $sphs = $sphs->get();

        return response()->json($sphs);
    }

    public function apiGetSPH()
    {
        $sphsDefault = SPH::with('user', 'sphable')->latest()->get();
        return response()->json($sphsDefault);
    }

    public function destroy($uuid)
    {
        DB::beginTransaction();

        try {
            $sph = SPH::where('uuid', '=', $uuid)->first();
            unlink($sph->sph_doc);
            $sph->delete();
        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error hapus sph: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }
}
