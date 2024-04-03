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

        // Receipt
        Permission::create(['name' => 'lihat kwitansi', 'group_name' => 'Kwitansi']);
        Permission::create(['name' => 'tambah kwitansi', 'group_name' => 'Kwitansi']);
        Permission::create(['name' => 'edit kwitansi', 'group_name' => 'Kwitansi']);
        Permission::create(['name' => 'hapus kwitansi', 'group_name' => 'Kwitansi']);

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

        // Role
        Permission::create(['name' => 'lihat role', 'group_name' => 'Role']);
        Permission::create(['name' => 'tambah role', 'group_name' => 'Role']);
        Permission::create(['name' => 'edit role', 'group_name' => 'Role']);
        Permission::create(['name' => 'hapus role', 'group_name' => 'Role']);

        // Permission
        Permission::create(['name' => 'lihat permission', 'group_name' => 'Permission']);
        Permission::create(['name' => 'tambah permission', 'group_name' => 'Permission']);
        Permission::create(['name' => 'edit permission', 'group_name' => 'Permission']);
        Permission::create(['name' => 'hapus permission', 'group_name' => 'Permission']);

        // Role & permission
        Permission::create(['name' => 'setting role permission', 'group_name' => 'Permission & Role']);


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

        // PIC
        Permission::create(['name' => 'lihat pic', 'group_name' => 'Partner PIC']);
        Permission::create(['name' => 'tambah pic', 'group_name' => 'Partner PIC']);
        Permission::create(['name' => 'edit pic', 'group_name' => 'Partner PIC']);
        Permission::create(['name' => 'hapus pic', 'group_name' => 'Partner PIC']);

        // Referral
        Permission::create(['name' => 'lihat referral', 'group_name' => 'Referral']);
        Permission::create(['name' => 'tambah referral', 'group_name' => 'Referral']);
        Permission::create(['name' => 'edit referral', 'group_name' => 'Referral']);
        Permission::create(['name' => 'hapus referral', 'group_name' => 'Referral']);

        // Status
        Permission::create(['name' => 'lihat status', 'group_name' => 'Status']);
        Permission::create(['name' => 'tambah status', 'group_name' => 'Status']);
        Permission::create(['name' => 'edit status', 'group_name' => 'Status']);
        Permission::create(['name' => 'hapus status', 'group_name' => 'Status']);

        // Tanda Tangan
        Permission::create(['name' => 'lihat tanda tangan', 'group_name' => 'Tanda Tangan']);
        Permission::create(['name' => 'tambah tanda tangan', 'group_name' => 'Tanda Tangan']);
        Permission::create(['name' => 'edit tanda tangan', 'group_name' => 'Tanda Tangan']);
        Permission::create(['name' => 'hapus tanda tangan', 'group_name' => 'Tanda Tangan']);

        // Akun
        Permission::create(['name' => 'lihat akun', 'group_name' => 'Partner Akun']);
        Permission::create(['name' => 'tambah akun', 'group_name' => 'Partner Akun']);
        Permission::create(['name' => 'edit akun', 'group_name' => 'Partner Akun']);
        Permission::create(['name' => 'hapus akun', 'group_name' => 'Partner Akun']);

        // Bank
        Permission::create(['name' => 'lihat bank', 'group_name' => 'Partner Bank']);
        Permission::create(['name' => 'tambah bank', 'group_name' => 'Partner Bank']);
        Permission::create(['name' => 'edit bank', 'group_name' => 'Partner Bank']);
        Permission::create(['name' => 'hapus bank', 'group_name' => 'Partner Bank']);

        // Langganan
        Permission::create(['name' => 'lihat langganan', 'group_name' => 'Partner Langganan']);
        Permission::create(['name' => 'tambah langganan', 'group_name' => 'Partner Langganan']);
        Permission::create(['name' => 'edit langganan', 'group_name' => 'Partner Langganan']);
        Permission::create(['name' => 'hapus langganan', 'group_name' => 'Partner Langganan']);

        // Harga
        Permission::create(['name' => 'lihat harga', 'group_name' => 'Partner Harga']);
        Permission::create(['name' => 'tambah harga', 'group_name' => 'Partner Harga']);
        Permission::create(['name' => 'edit harga', 'group_name' => 'Partner Harga']);
        Permission::create(['name' => 'hapus harga', 'group_name' => 'Partner Harga']);

        // Memo
        Permission::create(['name' => 'lihat memo', 'group_name' => 'Memo']);
        Permission::create(['name' => 'tambah memo', 'group_name' => 'Memo']);
        Permission::create(['name' => 'edit memo', 'group_name' => 'Memo']);
        Permission::create(['name' => 'hapus memo', 'group_name' => 'Memo']);

        // Transaction
        Permission::create(['name' => 'lihat transaksi', 'group_name' => 'Transaksi']);
        Permission::create(['name' => 'tambah transaksi', 'group_name' => 'Transaksi']);
        Permission::create(['name' => 'edit transaksi', 'group_name' => 'Transaksi']);
        Permission::create(['name' => 'hapus transaksi', 'group_name' => 'Transaksi']);


    }
}
