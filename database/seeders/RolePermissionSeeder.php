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

        // Set permission account executive
        $permissionsAccountExecutive = Permission::where('group_name', 'Lead')->orWhere('group_name', 'Surat Penawaran Harga (SPH)')->orWhere('group_name', 'Mou')->orWhere('group_name', 'Invoice Umum')->orWhere('name', 'edit aktifitas sla')->get();
        $accountExecutive = Role::find(2);
        $accountExecutive->syncPermissions($permissionsAccountExecutive);


        // Set permission account manager
        $permissionsAccountManager = Permission::where('name', 'tambah bank partner')->orWhere('name', 'tambah langganan partner')->orWhere('name', 'tambah harga partner')->orWhere('name', 'tambah akun partner')->orWhere('name', 'edit aktifitas sla')->orWhere('group_name', 'invoice langganan')->orWhere('group_name', 'kartu')->get();
        $accountManager = Role::find(3);
        $accountManager->syncPermissions($permissionsAccountManager);


        // Set permission admin
        $permissionsAdmin = Permission::where('group_name', 'Partner')->orWhere('group_name', 'status')->orWhere('group_name', 'produk')->orWhere('group_name', 'video')->orWhere('group_name', 'user')->orWhere('group_name', 'SLA')->orWhere('group_name', 'Surat Perjalanan Dinas (stpd)')->get();
        $admin = Role::find(4);
        $admin->syncPermissions($permissionsAdmin);


        // Set permission design
        $permissionsDesign = Permission::where('name', 'edit kartu')->orWhere('name', 'lihat kartu')->get();
        $design = Role::find(5);
        $design->syncPermissions($permissionsDesign);

        $permissionsPartner = Permission::where('name', 'akses e-learning')->get();
        $partner = Role::find(6);
        $partner->syncPermissions($permissionsPartner);
    }
}
