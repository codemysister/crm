<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Nullix\CryptoJsAes\CryptoJsAes;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

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

        return response()->json($permissions);
    }

    public function apiUpdatePermission(Request $request, $id)
    {
        $permission = Permission::find($id)->update(request()->all());
    }

    public function apiDeletePermission($id){
        $permission = Permission::find($id)->delete();    
    }
    
    public function permissionSync(Request $request, $id){
        $role = Role::find($id);
        $role->syncPermissions($request->data);   
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
            'group_name' => $request->group_name
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
