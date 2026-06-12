<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\Province; // 🌟 Tambahkan import Model Province
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/Profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            // 🌟 Kirim data provinsi langsung dari controller agar lebih cepat
            'provinces' => Province::orderBy('name')->get(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        // Cegah penimpaan data null jika user tidak update gambar
        unset($validated['avatar'], $validated['sampul']);

        // Logika Upload Avatar
        if ($request->hasFile('avatar')) {
            if ($user->avatar) { Storage::disk('public')->delete($user->avatar); }
            $validated['avatar'] = $request->file('avatar')->store('users/avatar', 'public');
        }

        // Logika Upload Sampul
        if ($request->hasFile('sampul')) {
            if ($user->sampul) { Storage::disk('public')->delete($user->sampul); }
            $validated['sampul'] = $request->file('sampul')->store('users/sampul', 'public');
        }

        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}