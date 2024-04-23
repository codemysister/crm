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
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;
use Spatie\Browsershot\Browsershot;

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
        $partnersProp = Partner::with([
            'pics',
            'status'
        ])->get();
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

    public function generateSPH($sph, $products)
    {
        $path = "sph/sph-" . $sph->uuid . ".pdf";

        $sph->sph_doc = "storage/$path";

        $html = view('pdf.sph', ["sph" => $sph, 'products' => $products])->render();

        $pdf = Browsershot::html($html)
            ->setIncludedPath(config('services.browsershot.included_path'))
            ->showBackground()
            ->pdf();

        Storage::put("public/$path", $pdf);

        return $sph;
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

            $sph = new SPH();
            $sph->uuid = Str::uuid();
            $sph->code = $code;
            $sph->date = Carbon::now();
            $sph->sphable_id = $partnerExists->id;
            $sph->sphable_type = get_class($partnerExists);
            $sph->partner_name = $request['partner']['name'];
            $sph->partner_pic = $request['partner']['pic'];
            $sph->partner_province = $request['partner']['province'];
            $sph->partner_regency = $request['partner']['regency'];
            $sph->sales_name = $request['sales']['name'];
            $sph->sales_wa = $request['sales']['wa'];
            $sph->sales_email = $request['sales']['email'];
            $sph->signature_name = $request['signature']['name'] ?? null;
            $sph->signature_position = $request['signature']['position'] ?? null;
            $sph->signature_image = $request['signature']['image'] ?? null;
            $sph->created_by = Auth::user()->id;
            $sph = $this->generateSPH($sph, $request->products);
            $sph->save();

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
        $partnersProp = Partner::with([
            'pics',
            'status'
        ])->get();
        $productsProp = Product::all(['uuid', 'name', 'price', 'category']);
        $salesProp = User::role('account executive')->get();

        $sph = SPH::with('products', 'sphable')->where('uuid', '=', $uuid)->first();
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

            $sph = SPH::where('uuid', $uuid)->first();

            $sph->sphable_id = $partnerExists->id;
            $sph->sphable_type = get_class($partnerExists);
            $sph->partner_name = $request['partner']['name'];
            $sph->partner_pic = $request['partner']['pic'];
            $sph->partner_province = $request['partner']['province'];
            $sph->partner_regency = $request['partner']['regency'];
            $sph->sales_name = $request['sales']['name'];
            $sph->sales_wa = $request['sales']['wa'];
            $sph->sales_email = $request['sales']['email'];
            $sph->signature_name = $request['signature']['name'] ?? null;
            $sph->signature_position = $request['signature']['position'] ?? null;
            $sph->signature_image = $request['signature']['image'] ?? null;
            $sph = $this->generateSPH($sph, $request->products);
            $sph->save();


            $this->updateProducts($sph, $sph->products, $request->products);

            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error tambah sph: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }


    }

    public function filter(Request $request)
    {
        $sphs = SPH::with(['createdBy', 'sphable']);

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
        dd($sphs);

        return response()->json($sphs);
    }

    public function apiGetSPH()
    {
        $sphsDefault = SPH::with('createdBy', 'sphable')->latest()->get();
        return response()->json($sphsDefault);
    }

    public function destroy($uuid)
    {
        DB::beginTransaction();

        try {
            $sph = SPH::where('uuid', '=', $uuid)->first();
            Activity::create([
                'log_name' => 'deleted',
                'description' => 'hapus data sph',
                'subject_type' => get_class($sph),
                'subject_id' => $sph->id,
                'causer_type' => get_class(Auth::user()),
                'causer_id' => Auth::user()->id,
                "event" => "deleted",
                'properties' => ["old" => ["code" => $sph->code, "partner_name" => $sph->partner_name, "partner_pic" => $sph->partner_pic, "sales_name" => $sph->sales_name, "sales_wa" => $sph->sales_wa, "sales_email" => $sph->sales_email]]
            ]);
            $sph->delete();
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error hapus sph: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function logFilter(Request $request)
    {
        $logs = Activity::with(['causer', 'subject'])->whereMorphedTo('subject', SPH::class);

        if ($request->user) {
            $logs->whereMorphRelation('causer', User::class, 'causer_id', '=', $request->user['id']);
        }

        if ($request->date['start'] && $request->date['end']) {
            $logs->whereBetween('created_at', [$request->date['start'], $request->date['end']]);
        }

        $logs = $logs->get();

        return response()->json($logs);
    }

    public function apiGetLogs()
    {
        $logs = Activity::with(['causer', 'subject'])
            ->whereMorphedTo('subject', SPH::class);

        $logs = $logs->latest()->get();

        return response()->json($logs);
    }

    public function destroyLogs(Request $request)
    {
        $ids = explode(",", $request->query('ids'));
        Activity::whereIn('id', $ids)->delete();
    }

    public function apiGetArsip()
    {
        $arsip = SPH::withTrashed()->with(['createdBy', 'sphable'])->whereNotNull('deleted_at')->get();
        return response()->json($arsip);
    }

    public function arsipFilter(Request $request)
    {
        $arsip = SPH::withTrashed()->with(['createdBy', 'sphable'])->whereNotNull('deleted_at');

        if ($request->user) {
            $arsip->where('created_by', '=', $request->user['id']);
        }

        if ($request->delete_date['start'] && $request->delete_date['end']) {
            $arsip->whereBetween('deleted_at', [$request->delete_date['start'], $request->delete_date['end']]);
        }

        $arsip = $arsip->get();

        return response()->json($arsip);
    }

    public function restore($uuid)
    {
        DB::beginTransaction();
        try {
            $sph = SPH::withTrashed()->where('uuid', '=', $uuid)->first();
            $sph->restore();
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error restore sph: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }


    public function destroyForce($uuid)
    {
        DB::beginTransaction();
        try {
            $sph = SPH::withTrashed()->where('uuid', '=', $uuid)->first();
            unlink($sph->sph_doc);
            Activity::create([
                'log_name' => 'deleted_force',
                'description' => 'hapus permanen data sph',
                'subject_type' => get_class($sph),
                'subject_id' => $sph->id,
                'causer_type' => get_class(Auth::user()),
                'causer_id' => Auth::user()->id,
                "event" => "deleted_force",
                'properties' => ["old" => ["code" => $sph->code, "partner_name" => $sph->partner_name, "partner_pic" => $sph->partner_pic, "sales_name" => $sph->sales_name, "sales_wa" => $sph->sales_wa, "sales_email" => $sph->sales_email]]
            ]);
            $sph->forceDelete();
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error hapus sph: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }

    }

}
