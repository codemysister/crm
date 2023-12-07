<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // Quotation letter / sph
        Permission::create(['name' => 'view_sph']);
        Permission::create(['name' => 'add_sph']);
        Permission::create(['name' => 'edit_sph']);
        Permission::create(['name' => 'delete_sph']);

        // MOU
        Permission::create(['name' => 'view_mou']);
        Permission::create(['name' => 'add_mou']);
        Permission::create(['name' => 'edit_mou']);
        Permission::create(['name' => 'delete_mou']);

        // General Inovice
        Permission::create(['name' => 'view_general_invoice']);
        Permission::create(['name' => 'add_general_invoice']);
        Permission::create(['name' => 'edit_general_invoice']);
        Permission::create(['name' => 'delete_general_invoice']);

        // Subscription Inovice
        Permission::create(['name' => 'view_subscription_invoice']);
        Permission::create(['name' => 'add_subscription_invoice']);
        Permission::create(['name' => 'edit_subscription_invoice']);
        Permission::create(['name' => 'delete_subscription_invoice']);

        // Receipt
        Permission::create(['name' => 'view_receipt']);
        Permission::create(['name' => 'add_receipt']);
        Permission::create(['name' => 'edit_receipt']);
        Permission::create(['name' => 'delete_receipt']);

        // Official travel letter / spd
        Permission::create(['name' => 'view_spd']);
        Permission::create(['name' => 'add_spd']);
        Permission::create(['name' => 'edit_spd']);
        Permission::create(['name' => 'delete_spd']);

        
    }
}
