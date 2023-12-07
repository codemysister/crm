<?php

namespace App\Http\Controllers;

use Defuse\Crypto\Crypto;
use Defuse\Crypto\Key;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Nullix\CryptoJsAes\CryptoJsAes;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::all();
        return Inertia::render("Role/Index", compact('roles'));
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Role::create([
            'name' => $request->name,
            'guard_name' => $request->guard_name
        ]);

    }

    public function apiGetRole()
    {
        $roles = Role::all();
       
        $rolesEncrypted = CryptoJsAes::encrypt($roles, env('VITE_ENCRYPTION_KEY'));
        return response()->json($rolesEncrypted);
    }

    public function apiUpdateRole(Request $request, $id)
    {
        $role = Role::find($id)->update(request()->all());
        return response()->json([
            "message" => "berhasil"
        ]);
    }


    public function apiDeleteRole($id){
        $role = Role::find($id)->delete();
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
