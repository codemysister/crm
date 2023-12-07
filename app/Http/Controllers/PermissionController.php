<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Nullix\CryptoJsAes\CryptoJsAes;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function apiGetPermission(){
        $permissions = Permission::all();
     
        $permissionsEncrypted = CryptoJsAes::encrypt($permissions, env('VITE_ENCRYPTION_KEY'));
        return response()->json($permissionsEncrypted);
    }

    public function apiUpdatePermission(Request $request, $id)
    {
        $permission = Permission::find($id)->update(request()->all());

        return response()->json([
            "message" => "berhasil"
        ]);
    }

    public function apiDeletePermission($id){
        $permission = Permission::find($id)->delete();
        return response()->json([
            "message" => "berhasil"
        ]);      
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Permission::create([
            'name' => $request->name,
            'guard_name' => $request->guard_name
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
