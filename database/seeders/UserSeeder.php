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
            "name"=> "Super Admin",
            "email"=> "super_admin@gmail.com",
            "password"=> bcrypt("admin123")
        ]);

        $super_admin->assignRole("super admin");

        // Sales
        for($i=1; $i <= 5; $i++){
            $sales = User::create([
                "name"=> "Sales $i",
                "email"=> "sales$i@gmail.com",
                "password"=> bcrypt("sales123")
            ]);

            $sales->assignRole("sales");
        }

        // Account Manager
        for($i=1; $i <= 5; $i++){
            $am = User::create([
                "name"=> "Account Manager $i",
                "email"=> "account_manager$i@gmail.com",
                "password"=> bcrypt("am123")
            ]);

            $am->assignRole("account manager");
        }


        // Admin
        $admin = User::create([
            "name"=> "Admin",
            "email"=> "admin@gmail.com",
            "password"=> bcrypt("admin123")
        ]);

        $admin->assignRole("admin");

        // DPD
        $dpd = User::create([
            "name"=> "Design Print Delivery",
            "email"=> "design_print_delivery@gmail.com",
            "password"=> bcrypt("dpd123")
        ]);
        $dpd->assignRole("design print delivery");
    }
}
