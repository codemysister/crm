<?php

namespace App\Http\Controllers;

use App\Models\Playlist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ElearningController extends Controller
{
    public function index()
    {
        $playlistsProp = Playlist::with('videos')->get();
        return Inertia::render('Elearning/Index', compact('playlistsProp'));
    }

    public function detail($slug)
    {
        $playlistProp = Playlist::with('videos')->where('slug', $slug)->first();
        return Inertia::render('Elearning/Detail', compact('playlistProp'));
    }
}
