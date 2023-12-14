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
            "name"=> "super admin",
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
            "name"=> "account manager",
            "guard_name" => "web"
        ]);

        Role::create([
            "name"=> "design print delivery",
            "guard_name" => "web"
        ]);
    }
}
