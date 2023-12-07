<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Role::create([
            "name"=> "super_admin",
            "guard_name" => "web"
        ]);

        Role::create([
            "name"=> "admin",
            "guard_name" => "web"
        ]);

        Role::create([
            "name"=> "sales",
            "guard_name" => "web"
        ]);

        Role::create([
            "name"=> "account_manager",
            "guard_name" => "web"
        ]);

        Role::create([
            "name"=> "design_print_delivery",
            "guard_name" => "web"
        ]);
    }
}
