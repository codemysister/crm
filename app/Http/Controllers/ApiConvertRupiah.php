<?php

namespace App\Http\Controllers;

use Dipantry\Rupiah\RupiahService;
use Illuminate\Http\Request;

class ApiConvertRupiah extends Controller
{
    public function convert(Request $request)
    {
        $rupiah = new RupiahService();
        $converted = $rupiah->of($request->query('nominal'))->toWords();
        return response()->json($converted);
    }
}
