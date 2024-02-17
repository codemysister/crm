<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;


class RolePermissionSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $permissions = Permission::all();
        $role = Role::find(1);
        $role->syncPermissions($permissions);
        $role = Role::find(2);
        $role->syncPermissions($permissions);
        $role = Role::find(3);
        $role->syncPermissions($permissions);
        $role = Role::find(4);
        $role->syncPermissions($permissions);
        $role = Role::find(5);
        $role->syncPermissions($permissions);
        $role = Role::find(6);
        $role->syncPermissions($permissions);
    }
}
