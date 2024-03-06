<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;

class ApiWilayahController extends Controller
{
    public function provinsi()
    {
        $url = "https://sipedas.pertanian.go.id/api/wilayah/list_wilayah?thn=2024&lvl=10&lv2=11";
        try {

            $client = new Client();
            $response = $client->get($url);
            $data = json_decode($response->getBody(), true);
            return response()->json($data);
        } catch (\Exception $e) {

            dd($e->getMessage());
        }
    }
    public function kabupaten(Request $request)
    {
        if ($request->query('provinsi')) {
            $code = $request->query('provinsi');
            $url = "https://sipedas.pertanian.go.id/api/wilayah/list_kab?thn=2024&lvl=11&pro=$code";
        } else {
            $url = "https://sipedas.pertanian.go.id/api/wilayah/list_wilayah?thn=2024&lvl=10&lv2=12";
        }

        try {
            $client = new Client();
            $response = $client->get($url);
            $data = json_decode($response->getBody(), true);
            return response()->json($data);
        } catch (\Exception $e) {

            dd($e->getMessage());
        }
    }

    public function kecamatan(Request $request)
    {
        if ($request->query('kabupaten') && $request->query('provinsi')) {
            $kabupaten = $request->query('kabupaten');
            $provinsi = $request->query('provinsi');
            $url = "https://sipedas.pertanian.go.id/api/wilayah/list_wilayah?thn=2024&lvl=12&pro=$provinsi&kab=$kabupaten&lv2=13=";
        } else {
            $url = "https://sipedas.pertanian.go.id/api/wilayah/list_wilayah?thn=2024&lvl=10&lv2=13";
        }

        try {
            $client = new Client();
            $response = $client->get($url);
            $data = json_decode($response->getBody(), true);
            return response()->json($data);
        } catch (\Exception $e) {

            dd($e->getMessage());
        }
    }
}
