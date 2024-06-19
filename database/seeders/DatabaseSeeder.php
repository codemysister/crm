<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Status;
use Illuminate\Database\Seeder;
use Laravolt\Indonesia\Seeds\ProvincesSeeder;
use Laravolt\Indonesia\Seeds\CitiesSeeder;
use Laravolt\Indonesia\Seeds\DistrictsSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);
        $this->call(PermissionSeeder::class);
        $this->call(RolePermissionSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(ProductSeeder::class);
        $this->call(StatusSeeder::class);
        $this->call(ProvincesSeeder::class);
        $this->call(CitiesSeeder::class);
        $this->call(DistrictsSeeder::class);
        $this->call(LeadSeeder::class);
        $this->call(PartnerSeeder::class);
        $this->call(SPHSeeder::class);
        $this->call(MOUSeeder::class);
        $this->call(SLASeeder::class);
        $this->call(InvoiceGeneralSeeder::class);
        $this->call(InvoiceSubscriptionSeeder::class);
        $this->call(STPDSeeder::class);
        $this->call(CardSeeder::class);
        // $this->call(PartnerSeeder::class);
        // $this->call(PartnerPicSeeder::class);
        // $this->call(PartnerBankSeeder::class);
        // $this->call(PartnerAccountSeeder::class);
        // $this->call(PartnerSubscriptionSeeder::class);
        // $this->call(PartnerPriceListSeeder::class);
        // $this->call(SignatureSeeder::class);
    }
}
