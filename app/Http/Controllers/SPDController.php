<?php

namespace App\Http\Controllers;

use App\Models\SPD;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SPDController extends Controller
{
    public function index()
    {
        $spdsDefault = SPD::all();
        return Inertia::render('SPD/Index', compact('spdsDefault'));
    }
}
