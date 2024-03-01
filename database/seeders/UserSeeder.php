<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // Super Admin
        $super_admin = User::create([
            "name" => "Super Admin",
            "email" => "super_admin@gmail.com",
            "number" => "085178612434",
            "password" => bcrypt("admin123")
        ]);

        $super_admin->assignRole("Super Admin");

        // AE
        for ($i = 1; $i <= 5; $i++) {
            $sales = User::create([
                "name" => "Account Executive $i",
                "email" => "account_executive$i@gmail.com",
                "number" => "085178612434",
                "password" => bcrypt("ae123")
            ]);

            $sales->assignRole("Account Executive");
        }

        // Account Manager
        for ($i = 1; $i <= 5; $i++) {
            $am = User::create([
                "name" => "Account Manager $i",
                "email" => "account_manager$i@gmail.com",
                "number" => "085178612434",
                "password" => bcrypt("am123")
            ]);

            $am->assignRole("Account Manager");
        }

        // Account Representative
        for ($i = 1; $i <= 2; $i++) {
            $am = User::create([
                "name" => "Account Representative $i",
                "email" => "account_representative$i@gmail.com",
                "number" => "085178612434",
                "password" => bcrypt("ar123")
            ]);

            $am->assignRole("Account Representative");
        }


        // Admin
        $admin = User::create([
            "name" => "Admin",
            "email" => "admin@gmail.com",
            "number" => "085178612434",
            "password" => bcrypt("admin123")
        ]);

        $admin->assignRole("General Admin");

        // DPD
        $designer = User::create([
            "name" => "Graphics Designer",
            "email" => "graphic_designer@gmail.com",
            "number" => "085178612434",
            "password" => bcrypt("designer123")
        ]);
        $designer->assignRole("Graphics Designer");
    }
}
