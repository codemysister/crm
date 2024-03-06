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
            "name" => "super admin",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "account executive",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "account representative",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "account manager",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "general admin",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "graphics designer",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "service manager",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "bussines development",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "partner",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "ceo",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "cto",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "sales manager",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "referral",
            "guard_name" => "web"
        ]);
    }
}
