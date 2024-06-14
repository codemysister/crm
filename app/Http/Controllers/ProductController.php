<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;
use Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $usersProp = User::all();
        return Inertia::render("Product/Index", compact('usersProp'));
    }

    public function apiGetProducts()
    {
        $products = Product::with('createdBy')->latest()->get();

        return response()->json($products);
    }


    public function store(ProductRequest $request)
    {

        Product::create([
            "uuid" => Str::uuid(),
            "name" => $request->name,
            "category" => $request->category['name'],
            "price" => $request->price,
            "description" => $request->description,
            "unit" => $request->unit,
            'created_by' => Auth::user()->id
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $uuid)
    {
        Product::where('uuid', $uuid)->first()->update([
            "name" => $request->name,
            "category" => $request->category,
            "price" => $request->price,
            "description" => $request->description,
            "unit" => $request->unit,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        DB::beginTransaction();

        try {
            Activity::create([
                'log_name' => 'deleted',
                'description' => ' hapus data produk',
                'subject_type' => get_class($product),
                'subject_id' => $product->id,
                'causer_type' => get_class(Auth::user()),
                'causer_id' => Auth::user()->id,
                "event" => "deleted",
                'properties' => ["old" => ["name" => $product->name, "category" => $product->category, "unit" => $product->unit, "price" => $product->price, "description" => $product->description]]
            ]);
            $product->delete();
            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error hapus produk: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }
    public function destroyForce($uuid)
    {
        DB::beginTransaction();

        try {
            $product = Product::withTrashed()->where('uuid', $uuid)->first();

            Activity::create([
                'log_name' => 'force',
                'description' => ' hapus permanen data produk',
                'subject_type' => get_class($product),
                'subject_id' => $product->id,
                'causer_type' => get_class(Auth::user()),
                'causer_id' => Auth::user()->id,
                "event" => "force",
                'properties' => ["old" => ["name" => $product->name, "category" => $product->category, "unit" => $product->unit, "price" => $product->price, "description" => $product->description]]
            ]);
            $product->forceDelete();
            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error hapus permanen produk: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function restore($uuid)
    {
        DB::beginTransaction();
        try {
            $product = Product::withTrashed()->where('uuid', '=', $uuid)->first();
            $product->restore();
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error restore produk: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function logFilter(Request $request)
    {
        $logs = Activity::with(['causer', 'subject'])->whereMorphedTo('subject', Playlist::class)->orWhereMorphedTo('subject', Video::class);

        if ($request->user) {
            $logs->whereMorphRelation('causer', User::class, 'causer_id', '=', $request->user['id']);
        }

        if ($request->date['start'] && $request->date['end']) {
            $logs->whereBetween('created_at', [$request->date['start'], $request->date['end']]);
        }

        $logs = $logs->latest()->get();

        return response()->json($logs);
    }

    public function apiGetLogs()
    {
        $logs = Activity::with(['causer', 'subject'])
            ->whereMorphedTo('subject', Product::class);

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
        $arsip = Product::withTrashed()->with(['createdBy'])->whereNotNull('deleted_at')->latest()->get();
        return response()->json($arsip);
    }

}
