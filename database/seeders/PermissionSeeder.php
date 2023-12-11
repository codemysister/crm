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
        Permission::create(['name' => 'view_sph', 'group_name' => 'Surat Penawaran Harga (SPH)']);
        Permission::create(['name' => 'add_sph', 'group_name' => 'Surat Penawaran Harga (SPH)']);
        Permission::create(['name' => 'edit_sph', 'group_name' => 'Surat Penawaran Harga (SPH)']);
        Permission::create(['name' => 'delete_sph', 'group_name' => 'Surat Penawaran Harga (SPH)']);

        // MOU
        Permission::create(['name' => 'view_mou', 'group_name' => 'Mou']);
        Permission::create(['name' => 'add_mou', 'group_name' => 'Mou']);
        Permission::create(['name' => 'edit_mou', 'group_name' => 'Mou']);
        Permission::create(['name' => 'delete_mou', 'group_name' => 'Mou']);

        // General Invoice
        Permission::create(['name' => 'view_general_invoice', 'group_name' => 'Invoice Umum']);
        Permission::create(['name' => 'add_general_invoice', 'group_name' => 'Invoice Umum']);
        Permission::create(['name' => 'edit_general_invoice', 'group_name' => 'Invoice Umum']);
        Permission::create(['name' => 'delete_general_invoice', 'group_name' => 'Invoice Umum']);

        // Subscription Invoice
        Permission::create(['name' => 'view_subscription_invoice', 'group_name' => 'Invoice Langganan']);
        Permission::create(['name' => 'add_subscription_invoice', 'group_name' => 'Invoice Langganan']);
        Permission::create(['name' => 'edit_subscription_invoice', 'group_name' => 'Invoice Langganan']);
        Permission::create(['name' => 'delete_subscription_invoice', 'group_name' => 'Invoice Langganan']);

        // Receipt
        Permission::create(['name' => 'view_receipt', 'group_name' => 'Kwitansi']);
        Permission::create(['name' => 'add_receipt', 'group_name' => 'Kwitansi']);
        Permission::create(['name' => 'edit_receipt', 'group_name' => 'Kwitansi']);
        Permission::create(['name' => 'delete_receipt', 'group_name' => 'Kwitansi']);

        // Official travel letter / spd
        Permission::create(['name' => 'view_spd', 'group_name' => 'Surat Perjalanan Dinas (SPD)']);
        Permission::create(['name' => 'add_spd', 'group_name' => 'Surat Perjalanan Dinas (SPD)']);
        Permission::create(['name' => 'edit_spd', 'group_name' => 'Surat Perjalanan Dinas (SPD)']);
        Permission::create(['name' => 'delete_spd', 'group_name' => 'Surat Perjalanan Dinas (SPD)']);
             
    }
}
