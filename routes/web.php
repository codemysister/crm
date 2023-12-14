<?php

use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
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
    

    Route::middleware(['role:super admin'])->group(function(){
        // Roles
        Route::get('/role-permission', [RoleController::class, 'index'])->name('role-permission.view');
        Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
        Route::get('/api/roles', [RoleController::class, 'apiGetRole'])->name('api.roles');
        Route::put('/api/roles/{id}', [RoleController::class, 'apiUpdateRole'])->name('api.roles.update');
        Route::delete('/api/roles/{id}', [RoleController::class, 'apiDeleteRole'])->name('api.roles.delete');
    });
    

    // User
    Route::get('/users', [UserController::class, 'index'])->name('users.view');
    Route::get('api/users', [UserController::class, 'apiGetUsers'])->name('api.users');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.delete');


    // Permission
    Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.view');
    Route::post('/permissions', [PermissionController::class, 'store'])->name('permissions.store');
    Route::get('/api/permissions', [PermissionController::class, 'apiGetPermission'])->name('api.permissions');
    Route::get('/api/permissions', [PermissionController::class, 'apiGetPermission'])->name('api.permissions');
    Route::put('/api/permissions/{id}', [PermissionController::class, 'apiUpdatePermission'])->name('api.permissions.update');
    Route::delete('/api/permissions/{id}', [PermissionController::class, 'apiDeletePermission'])->name('api.permissions.delete');
    
    
    // Roles & Permission sync
    Route::put('/role-permission-sync/{id}', [PermissionController::class, 'permissionSync'])->name('permissions.sync');
    
    // Product
    Route::get('/products', [ProductController::class, 'index'])->name('products.view');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::put('/products/{product:uuid}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product:uuid}', [ProductController::class, 'destroy'])->name('products.destroy');
    Route::get('/api/products', [ProductController::class, 'apiGetProducts'])->name('api.products');


});

require __DIR__.'/auth.php';
