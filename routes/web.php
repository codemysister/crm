<?php

use App\Http\Controllers\PartnerBankController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\PartnerPicController;
use App\Http\Controllers\PartnerSubscriptionController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SignatureController;
use App\Http\Controllers\SPDController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::redirect('/', '/login', 301);

Route::get('/tes', function(){
    return Inertia::render('tes');
});


Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard/Index');
    })->name('dashboard');
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    

        
    // Roles
    Route::get('/role-permission', [RoleController::class, 'index'])->name('role-permission.view');
    Route::post('/roles', [RoleController::class, 'store'])->name('roles.store')->middleware(['can:tambah role']);
    Route::get('/api/roles', [RoleController::class, 'apiGetRole'])->name('api.roles');
    Route::put('/api/roles/{id}', [RoleController::class, 'apiUpdateRole'])->name('api.roles.update')->middleware(['can:edit role']);
    Route::delete('/api/roles/{id}', [RoleController::class, 'apiDeleteRole'])->name('api.roles.delete')->middleware(['can:hapus role']);
    
    
    // Permission
    Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.view')->middleware(['can:lihat permission']);
    Route::post('/permissions', [PermissionController::class, 'store'])->name('permissions.store')->middleware(['can:tambah permission']);
    Route::get('/api/permissions', [PermissionController::class, 'apiGetPermission'])->name('api.permissions');
    Route::put('/api/permissions/{id}', [PermissionController::class, 'apiUpdatePermission'])->name('api.permissions.update')->middleware(['can:edit permission']);
    Route::delete('/api/permissions/{id}', [PermissionController::class, 'apiDeletePermission'])->name('api.permissions.delete')->middleware(['can:hapus permission']);
    
    
    // Roles & Permission sync
    Route::put('/role-permission-sync/{id}', [PermissionController::class, 'permissionSync'])->name('permissions.sync')->middleware(['can:setting role permission']);
    
    // User
    Route::get('/users', [UserController::class, 'index'])->name('users.view')->middleware(['can:lihat user']);
    Route::get('api/users', [UserController::class, 'apiGetUsers'])->name('api.users');
    Route::post('/users', [UserController::class, 'store'])->name('users.store')->middleware(['can:tambah user']);
    Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update')->middleware(['can:edit user']);
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.delete')->middleware(['can:hapus user']);


    // Product
    Route::get('/products', [ProductController::class, 'index'])->name('products.view')->middleware(['can:lihat produk']);
    Route::post('/products', [ProductController::class, 'store'])->name('products.store')->middleware(['can:tambah produk']);
    Route::put('/products/{product:uuid}', [ProductController::class, 'update'])->name('products.update')->middleware(['can:edit produk']);
    Route::delete('/products/{product:uuid}', [ProductController::class, 'destroy'])->name('products.destroy')->middleware(['can:hapus produk']);
    Route::get('/api/products', [ProductController::class, 'apiGetProducts'])->name('api.products');
    
    // SPD
    Route::get('/spd', [SPDController::class, 'index'])->name('spd.view')->middleware(['can:lihat spd']);
    Route::get('/spd/create', [SPDController::class, 'create'])->name('spd.create');
    Route::post('/spd', [SPDController::class, 'store'])->name('spd.store')->middleware(['can:tambah produk']);
    Route::put('/spd/{spd:uuid}', [SPDController::class, 'update'])->name('spd.update')->middleware(['can:edit produk']);
    Route::delete('/spd/{spd:uuid}', [SPDController::class, 'destroy'])->name('spd.destroy')->middleware(['can:hapus produk']);
    Route::get('/api/spd', [SPDController::class, 'apiGetSPD'])->name('api.spd');

    Route::resource('signature', SignatureController::class);
    Route::get('/api/signature', [SignatureController::class, 'apiGetSignature'])->name('api.signature');

    // Partner
    Route::get('/partners', [PartnerController::class, 'index'])->name('partners.view')->middleware(['can:lihat partner']);
    Route::post('/partners', [PartnerController::class, 'store'])->name('partners.store')->middleware(['can:tambah partner']);
    Route::put('/partners/{partner:uuid}', [PartnerController::class, 'update'])->name('partners.update')->middleware(['can:edit partner']);
    Route::delete('/partners/{partner:uuid}', [PartnerController::class, 'destroy'])->name('partners.destroy')->middleware(['can:hapus partner']);
    Route::get('/api/partner/detail/{partner:uuid}', [PartnerController::class, 'apiGetPartner'])->name('api.partner');
    Route::get('/api/partners', [PartnerController::class, 'apiGetPartners'])->name('api.partners');
    
    // Partner PIC
    Route::post('/partners/pics', [PartnerPicController::class, 'store'])->name('partners.pics.store');
    Route::get('/api/partners/pics', [PartnerPicController::class, 'apiGetPIC'])->name('api.partners.pics');
    Route::put('/partners/pics/{uuid}', [PartnerPicController::class, 'update'])->name('partners.pics.update');
    Route::delete('/partners/pics/{uuid}', [PartnerPicController::class, 'destroy'])->name('partners.pics.destroy');
    
    // Partner Bank
    Route::post('/partners/banks', [PartnerBankController::class, 'store'])->name('partners.banks.store');
    Route::get('/api/partners/banks', [PartnerBankController::class, 'apiGetPIC'])->name('api.partners.banks');
    Route::put('/partners/banks/{uuid}', [PartnerBankController::class, 'update'])->name('partners.banks.update');
    Route::delete('/partners/banks/{uuid}', [PartnerBankController::class, 'destroy'])->name('partners.banks.destroy');
   
    // Partner Subscription
    Route::post('/partners/subscriptions', [PartnerSubscriptionController::class, 'store'])->name('partners.subscriptions.store');
    Route::get('/api/partners/subscriptions', [PartnerSubscriptionController::class, 'apiGetSubscription'])->name('api.partners.subscriptions');
    Route::put('/partners/subscriptions/{uuid}', [PartnerSubscriptionController::class, 'update'])->name('partners.subscriptions.update');
    Route::delete('/partners/subscriptions/{uuid}', [PartnerSubscriptionController::class, 'destroy'])->name('partners.subscriptions.destroy');


});

require __DIR__.'/auth.php';
