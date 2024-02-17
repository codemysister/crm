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
            "name" => "Super Admin",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "Account Executive",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "Account Representative",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "Account Manager",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "General Admin",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "Graphics Designer",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "Service Manager",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "Bussines Development",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "Partner",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "CEO",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "CTO",
            "guard_name" => "web"
        ]);

        Role::create([
            "name" => "Sales Manager",
            "guard_name" => "web"
        ]);
    }
}
