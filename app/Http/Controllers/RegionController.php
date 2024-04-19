<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RegionController extends Controller
{
    public function provinces()
    {
        $provinces = \Indonesia::allProvinces();
        return $provinces;
    }
    public function regencys(Request $request)
    {
        $regencys = null;
        if ($request->query('province')) {
            $regencys = \Indonesia::search($request->query('province'))->allCities();
        } else {
            $regencys = \Indonesia::allCities();
        }
        return $regencys;
    }

    public function subdistricts(Request $request)
    {
        $subdistricts = null;
        if ($request->query('regency')) {
            $subdistricts = \Indonesia::search($request->query('regency'))->allDistricts();
        } else {
            $subdistricts = \Indonesia::allDistricts();
        }
        return $subdistricts;
    }
}
