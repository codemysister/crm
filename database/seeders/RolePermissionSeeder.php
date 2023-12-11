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
        // $role->syncPermissions($permissions);
        $permissions = Permission::all();
        $role = Role::find(1);
        $role->syncPermissions([1,3,4,7,9,10]);
        $role = Role::find(2);
        $role->syncPermissions([5,6,12,21,16,11]);
        $role = Role::find(3);
        $role->syncPermissions([4,7,9,10,14,17]);
    }
}
