<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("Product/Index");
    }

    public function apiGetProducts()
    {
        $products = Product::all();

        return response()->json($products);
    }


    public function store(Request $request)
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
            "uuid" => Str::uuid(),
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
        $product->delete();
    }
}
