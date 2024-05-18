<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\InvoiceGeneral;
use App\Models\InvoiceGeneralTransaction;
use App\Models\MOU;
use App\Models\Partner;
use App\Models\SPH;
use App\Models\STPD;
use App\Models\STPDEmployees;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $pathProfilePicture = $request->profile_picture ?? null;
        if ($request->hasFile('profile_picture')) {
            if ($request->user()->profile_picture != null) {
                unlink($request->user()->profile_picture);
            }
            $file = $request->file('profile_picture');
            $filename = time() . '_' . Auth::user()->id . '.' . $file->getClientOriginalExtension();
            $pathProfilePicture = '/storage/images/profile/' . $filename;
            Storage::putFileAs('public/images/profile', $file, $filename);
        }
        $pathSignature = $request->signature ?? null;
        if ($request->hasFile('signature')) {
            if ($request->user()->signature != null) {
                unlink($request->user()->signature);
            }
            $file = $request->file('signature');
            $filename = time() . '_' . Auth::user()->id . '.' . $file->getClientOriginalExtension();
            $pathSignature = '/storage/images/tanda_tangan/' . $filename;
            Storage::putFileAs('public/images/tanda_tangan', $file, $filename);
        }

        $request->user()->fill([
            'name' => $request->name,
            'email' => $request->email,
            'number' => $request->number,
            'profile_picture' => $pathProfilePicture,
            'signature' => $pathSignature,
        ]);

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::back();
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
