<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserRoleSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $super_admin = User::find(1);
        $super_admin->assignRole("super admin");
    }
}
