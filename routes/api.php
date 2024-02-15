<?php

use App\Http\Controllers\ApiConvertRupiah;
use App\Http\Controllers\ApiWilayahController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('wilayah/provinsi', [ApiWilayahController::class, 'provinsi']);
Route::get('wilayah/kabupaten', [ApiWilayahController::class, 'kabupaten']);
Route::get('wilayah/kecamatan', [ApiWilayahController::class, 'kecamatan']);
Route::get('convert/rupiah', [ApiConvertRupiah::class, 'convert']);
