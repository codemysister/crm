<?php

namespace App\Http\Controllers;

use App\Http\Requests\SignatureRequest;
use App\Models\Signature;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SignatureController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $usersProp = User::with([
            'roles' => function ($query) {
                $query->latest();
            }
        ])->get();
        $usersProp->transform(function ($user) {
            $user->position = $user->roles->first()->name;
            $user->user_id = $user->id;
            unset ($user->roles);
            return $user;
        });
        $rolesProp = DB::table('roles')->distinct()->get("name");
        return Inertia::render("Signature/Index", compact('usersProp', 'rolesProp'));
    }

    public function store(SignatureRequest $request)
    {
        $pathSignature = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . Auth::user()->id . '.' . $file->getClientOriginalExtension();
            $pathSignature = '/images/tanda_tangan/' . $filename;
            Storage::putFileAs('public/images/tanda_tangan', $file, $filename);
        }

        Signature::create([
            'uuid' => Str::uuid(),
            'user_id' => $request->user['id'],
            'name' => $request->user['name'],
            'image' => $pathSignature,
            'position' => $request->position
        ]);
    }

    public function update(SignatureRequest $request, string $uuid)
    {
        $signature = Signature::where('uuid', '=', $uuid)->first();

        if ($request->hasFile('image')) {
            Storage::delete('public/' . $signature->image);
            $file = $request->file('image');
            $filename = time() . '_' . Auth::user()->id . '.' . $file->guessExtension();
            $pathSignature = '/images/tanda_tangan/' . $filename;
            Storage::putFileAs('public/images/tanda_tangan', $file, $filename);
        } else {
            if ($request->image !== null) {
                $pathSignature = $signature->image;
            }
        }


        $signature->update([
            'user_id' => $request->user['id'],
            'name' => $request->user['name'],
            'image' => $pathSignature,
            'position' => $request->position
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $uuid)
    {
        $signature = Signature::where('uuid', '=', $uuid)->first();
        Storage::delete('public/' . $signature->image);
        $signature->delete();
    }

    public function apiGetSignatures()
    {
        $signatures = Signature::all();
        return response()->json($signatures);
    }
}
