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

        // Lead
        Permission::create(['name' => 'lihat lead', 'group_name' => 'Lead']);
        Permission::create(['name' => 'tambah lead', 'group_name' => 'Lead']);
        Permission::create(['name' => 'edit lead', 'group_name' => 'Lead']);
        Permission::create(['name' => 'hapus lead', 'group_name' => 'Lead']);

        // Partner
        Permission::create(['name' => 'lihat partner', 'group_name' => 'Partner']);
        Permission::create(['name' => 'tambah partner', 'group_name' => 'Partner']);
        Permission::create(['name' => 'edit partner', 'group_name' => 'Partner']);
        Permission::create(['name' => 'hapus partner', 'group_name' => 'Partner']);
        Permission::create(['name' => 'tambah bank partner', 'group_name' => 'Partner']);
        Permission::create(['name' => 'tambah langganan partner', 'group_name' => 'Partner']);
        Permission::create(['name' => 'tambah harga partner', 'group_name' => 'Partner']);
        Permission::create(['name' => 'tambah akun partner', 'group_name' => 'Partner']);


        // Quotation letter / sph
        Permission::create(['name' => 'lihat sph', 'group_name' => 'Surat Penawaran Harga (SPH)']);
        Permission::create(['name' => 'tambah sph', 'group_name' => 'Surat Penawaran Harga (SPH)']);
        Permission::create(['name' => 'edit sph', 'group_name' => 'Surat Penawaran Harga (SPH)']);
        Permission::create(['name' => 'hapus sph', 'group_name' => 'Surat Penawaran Harga (SPH)']);

        // MOU
        Permission::create(['name' => 'lihat mou', 'group_name' => 'Mou']);
        Permission::create(['name' => 'tambah mou', 'group_name' => 'Mou']);
        Permission::create(['name' => 'edit mou', 'group_name' => 'Mou']);
        Permission::create(['name' => 'hapus mou', 'group_name' => 'Mou']);

        // SLA
        Permission::create(['name' => 'lihat sla', 'group_name' => 'SLA']);
        Permission::create(['name' => 'tambah sla', 'group_name' => 'SLA']);
        Permission::create(['name' => 'edit sla', 'group_name' => 'SLA']);
        Permission::create(['name' => 'hapus sla', 'group_name' => 'SLA']);
        Permission::create(['name' => 'edit aktifitas sla', 'group_name' => 'SLA']);

        // General Invoice
        Permission::create(['name' => 'lihat invoice umum', 'group_name' => 'Invoice Umum']);
        Permission::create(['name' => 'tambah invoice umum', 'group_name' => 'Invoice Umum']);
        Permission::create(['name' => 'edit invoice umum', 'group_name' => 'Invoice Umum']);
        Permission::create(['name' => 'hapus invoice umum', 'group_name' => 'Invoice Umum']);

        // Subscription Invoice
        Permission::create(['name' => 'lihat invoice langganan', 'group_name' => 'Invoice Langganan']);
        Permission::create(['name' => 'tambah invoice langganan', 'group_name' => 'Invoice Langganan']);
        Permission::create(['name' => 'edit invoice langganan', 'group_name' => 'Invoice Langganan']);
        Permission::create(['name' => 'hapus invoice langganan', 'group_name' => 'Invoice Langganan']);

        // Transaction
        Permission::create(['name' => 'lihat transaksi', 'group_name' => 'Transaksi']);
        Permission::create(['name' => 'tambah transaksi', 'group_name' => 'Transaksi']);
        Permission::create(['name' => 'edit transaksi', 'group_name' => 'Transaksi']);
        Permission::create(['name' => 'hapus transaksi', 'group_name' => 'Transaksi']);

        // Official travel letter / stpd
        Permission::create(['name' => 'lihat stpd', 'group_name' => 'Surat Perjalanan Dinas (stpd)']);
        Permission::create(['name' => 'tambah stpd', 'group_name' => 'Surat Perjalanan Dinas (stpd)']);
        Permission::create(['name' => 'edit stpd', 'group_name' => 'Surat Perjalanan Dinas (stpd)']);
        Permission::create(['name' => 'hapus stpd', 'group_name' => 'Surat Perjalanan Dinas (stpd)']);

        // Product
        Permission::create(['name' => 'lihat produk', 'group_name' => 'Produk']);
        Permission::create(['name' => 'tambah produk', 'group_name' => 'Produk']);
        Permission::create(['name' => 'edit produk', 'group_name' => 'Produk']);
        Permission::create(['name' => 'hapus produk', 'group_name' => 'Produk']);

        // User
        Permission::create(['name' => 'lihat user', 'group_name' => 'User']);
        Permission::create(['name' => 'tambah user', 'group_name' => 'User']);
        Permission::create(['name' => 'edit user', 'group_name' => 'User']);
        Permission::create(['name' => 'hapus user', 'group_name' => 'User']);


        // Role & permission
        Permission::create(['name' => 'setting role permission', 'group_name' => 'Permission & Role']);

        // Status
        Permission::create(['name' => 'lihat status', 'group_name' => 'Status']);
        Permission::create(['name' => 'tambah status', 'group_name' => 'Status']);
        Permission::create(['name' => 'edit status', 'group_name' => 'Status']);
        Permission::create(['name' => 'hapus status', 'group_name' => 'Status']);

        // Kartu
        Permission::create(['name' => 'lihat kartu', 'group_name' => 'Kartu']);
        Permission::create(['name' => 'tambah kartu', 'group_name' => 'Kartu']);
        Permission::create(['name' => 'edit kartu', 'group_name' => 'Kartu']);
        Permission::create(['name' => 'hapus kartu', 'group_name' => 'Kartu']);

        // Video
        Permission::create(['name' => 'lihat video', 'group_name' => 'Video']);
        Permission::create(['name' => 'tambah video', 'group_name' => 'Video']);
        Permission::create(['name' => 'edit video', 'group_name' => 'Video']);
        Permission::create(['name' => 'hapus video', 'group_name' => 'Video']);

        // Log
        Permission::create(['name' => 'hapus log', 'group_name' => 'Log']);

        // e-learning
        Permission::create(['name' => 'akses e-learning', 'group_name' => 'E-learning']);

    }
}
