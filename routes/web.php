<?php

use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard/Index');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Roles
    Route::get('/role-permission', [RoleController::class, 'index'])->name('role-permission.view');
    Route::post('/role', [RoleController::class, 'store'])->name('role.store');
    Route::get('/api/role', [RoleController::class, 'apiGetRole'])->name('api.role');
    Route::put('/api/role/{id}', [RoleController::class, 'apiUpdateRole'])->name('api.role.update');
    Route::delete('/api/role/{id}', [RoleController::class, 'apiDeleteRole'])->name('api.role.delete');

    // Permission
    Route::get('/permission', [PermissionController::class, 'index'])->name('permission.view');
    Route::post('/permission', [PermissionController::class, 'store'])->name('permission.store');
    Route::get('/api/permission', [PermissionController::class, 'apiGetPermission'])->name('api.permission');
    Route::get('/api/permission', [PermissionController::class, 'apiGetPermission'])->name('api.permission');
    Route::put('/api/permission/{id}', [PermissionController::class, 'apiUpdatePermission'])->name('api.permission.update');
    Route::delete('/api/permission/{id}', [PermissionController::class, 'apiDeletePermission'])->name('api.permission.delete');
    
    // Roles & Permission sync
    Route::put('/role-permission-sync/{id}', [PermissionController::class, 'permissionSync'])->name('permission.sync');
    
    // Product
    Route::get('/product', [ProductController::class, 'index'])->name('product.view');
    Route::post('/product', [ProductController::class, 'store'])->name('product.store');
    Route::put('/product/{product:uuid}', [ProductController::class, 'update'])->name('product.update');
    Route::delete('/product/{product:uuid}', [ProductController::class, 'destroy'])->name('product.destroy');
    Route::get('/api/product', [ProductController::class, 'apiGetProducts'])->name('api.product');

});

require __DIR__.'/auth.php';
