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
        Permission::create(['name' => 'lihat_sph', 'group_name' => 'Surat Penawaran Harga (SPH)']);
        Permission::create(['name' => 'tambah_sph', 'group_name' => 'Surat Penawaran Harga (SPH)']);
        Permission::create(['name' => 'edit_sph', 'group_name' => 'Surat Penawaran Harga (SPH)']);
        Permission::create(['name' => 'hapus_sph', 'group_name' => 'Surat Penawaran Harga (SPH)']);

        // MOU
        Permission::create(['name' => 'lihat_mou', 'group_name' => 'Mou']);
        Permission::create(['name' => 'tambah_mou', 'group_name' => 'Mou']);
        Permission::create(['name' => 'edit_mou', 'group_name' => 'Mou']);
        Permission::create(['name' => 'hapus_mou', 'group_name' => 'Mou']);

        // General Invoice
        Permission::create(['name' => 'lihat_invoice_umum', 'group_name' => 'Invoice Umum']);
        Permission::create(['name' => 'tambah_invoice_umum', 'group_name' => 'Invoice Umum']);
        Permission::create(['name' => 'edit_invoice_umum', 'group_name' => 'Invoice Umum']);
        Permission::create(['name' => 'hapus_invoice_umum', 'group_name' => 'Invoice Umum']);

        // Subscription Invoice
        Permission::create(['name' => 'lihat_invoice_langganan', 'group_name' => 'Invoice Langganan']);
        Permission::create(['name' => 'tambah_invoice_langganan', 'group_name' => 'Invoice Langganan']);
        Permission::create(['name' => 'edit_invoice_langganan', 'group_name' => 'Invoice Langganan']);
        Permission::create(['name' => 'hapus_invoice_langganan', 'group_name' => 'Invoice Langganan']);

        // Receipt
        Permission::create(['name' => 'lihat_kwitansi', 'group_name' => 'Kwitansi']);
        Permission::create(['name' => 'tambah_kwitansi', 'group_name' => 'Kwitansi']);
        Permission::create(['name' => 'edit_kwitansi', 'group_name' => 'Kwitansi']);
        Permission::create(['name' => 'hapus_kwitansi', 'group_name' => 'Kwitansi']);
        
        // Official travel letter / spd
        Permission::create(['name' => 'lihat_spd', 'group_name' => 'Surat Perjalanan Dinas (SPD)']);
        Permission::create(['name' => 'tambah_spd', 'group_name' => 'Surat Perjalanan Dinas (SPD)']);
        Permission::create(['name' => 'edit_spd', 'group_name' => 'Surat Perjalanan Dinas (SPD)']);
        Permission::create(['name' => 'hapus_spd', 'group_name' => 'Surat Perjalanan Dinas (SPD)']);
        
        // Product
        Permission::create(['name' => 'lihat_produk', 'group_name' => 'Produk']);
        Permission::create(['name' => 'tambah_produk', 'group_name' => 'Produk']);
        Permission::create(['name' => 'edit_produk', 'group_name' => 'Produk']);
        Permission::create(['name' => 'hapus_produk', 'group_name' => 'Produk']);
             
    }
}
