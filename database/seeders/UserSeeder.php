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

        $super_admin->assignRole("super admin");


        // AE
        $sales = User::create([
            "name" => "Hari",
            "email" => "hari@cazh.id",
            "number" => "085178612434",
            "password" => bcrypt("sales123")
        ]);
        $sales->assignRole("account executive");

        $sales = User::create([
            "name" => "Soep",
            "email" => "soep@cazh.id",
            "number" => "085178612434",
            "password" => bcrypt("sales123")
        ]);
        $sales->assignRole("account executive");

        $sales = User::create([
            "name" => "Roni",
            "email" => "roni@cazh.id",
            "number" => "085178612434",
            "password" => bcrypt("sales123")
        ]);
        $sales->assignRole("account executive");

        $sales = User::create([
            "name" => "Wida",
            "email" => "wida@cazh.id",
            "number" => "085178612434",
            "password" => bcrypt("sales123")
        ]);
        $sales->assignRole("account executive");

        $sales = User::create([
            "name" => "Kamil",
            "email" => "kamil@cazh.id",
            "number" => "085178612434",
            "password" => bcrypt("sales123")
        ]);
        $sales->assignRole("account executive");

        $sales = User::create([
            "name" => "Yoga",
            "email" => "yoga@cazh.id",
            "number" => "085178612434",
            "password" => bcrypt("sales123")
        ]);
        $sales->assignRole("account executive");

        $sales = User::create([
            "name" => "Meta",
            "email" => "meta@cazh.id",
            "number" => "085178612434",
            "password" => bcrypt("sales123")
        ]);
        $sales->assignRole("account executive");

        $sales = User::create([
            "name" => "Prihtin",
            "email" => "prihtin@cazh.id",
            "number" => "085178612434",
            "password" => bcrypt("sales123")
        ]);
        $sales->assignRole("account executive");

        $sales = User::create([
            "name" => "Damas",
            "email" => "damas@cazh.id",
            "number" => "085178612434",
            "password" => bcrypt("sales123")
        ]);
        $sales->assignRole("account executive");



        // Account Manager
        $am = User::create([
            "name" => "Dita",
            "email" => "dita@cazh.id",
            "number" => "085178612434",
            "password" => bcrypt("am123")
        ]);
        $am->assignRole("account manager");

        $am = User::create([
            "name" => "Imam",
            "email" => "imam@cazh.id",
            "number" => "085178612434",
            "password" => bcrypt("am123")
        ]);
        $am->assignRole("account manager");


        // Account Representative
        $am = User::create([
            "name" => "Account Representative",
            "email" => "account_representative@gmail.com",
            "number" => "085178612434",
            "password" => bcrypt("ar123")
        ]);

        $am->assignRole("account representative");



        // Admin
        $admin = User::create([
            "name" => "Admin",
            "email" => "admin@gmail.com",
            "number" => "085178612434",
            "password" => bcrypt("admin123")
        ]);

        $admin->assignRole("general admin");

        // DPD
        $designer = User::create([
            "name" => "Febrian",
            "email" => "graphic_designer@gmail.com",
            "number" => "085178612434",
            "password" => bcrypt("designer123")
        ]);
        $designer->assignRole("graphics designer");

    }
}
