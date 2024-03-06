<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ApiConvertRupiah extends Controller
{
    public function convert(Request $request)
    {
        $converted = \Rupiah::of($request->query('nominal'))->toWords();
        return response()->json($converted);
    }
}
