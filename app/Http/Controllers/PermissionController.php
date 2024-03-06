<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Nullix\CryptoJsAes\CryptoJsAes;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionController extends Controller
{

    public function apiGetPermission()
    {
        $permissions = Permission::all();

        $permissionGroups = $permissions->pluck('group_name')->unique();

        $permissionGroups = $permissionGroups->values();

        $permissionGroups = $permissionGroups->map(function ($groupName) {
            return ['name' => $groupName];
        });


        return response()->json(['permissions' => $permissions, 'permissionGroups' => $permissionGroups]);
    }

    public function apiUpdatePermission(Request $request, $id)
    {
        $permission = Permission::find($id)->update(request()->all());
    }

    public function apiDeletePermission($id)
    {
        $permission = Permission::find($id)->delete();
    }

    public function permissionSync(Request $request, $id)
    {
        $role = Role::find($id);
        $role->syncPermissions($request->data);
    }

    public function store(Request $request)
    {
        Permission::create([
            'name' => $request->name,
            'group_name' => $request->group_name
        ]);
    }

}
