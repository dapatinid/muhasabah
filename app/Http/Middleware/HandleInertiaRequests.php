<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
                // 🔒 Sinkronisasi Logika dengan Middleware CanAccessControlPanel
                'can_access_control_panel' => $user 
                    && $user->is_admin 
                    && !is_null($user->level) 
                    && $user->level !== '',
                
                // 🏷️ Konversi field class string/comma-separated menjadi array untuk Vue
                'classes' => $user 
                    ? (is_array($user->class) ? $user->class : explode(',', $user->class)) 
                    : [],
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success'            => fn () => $request->session()->get('success'),
                'error'              => fn () => $request->session()->get('error'),
                'info'               => fn () => $request->session()->get('info'),
                'uploaded_image_url' => fn () => $request->session()->get('uploaded_image_url'),
            ],      
        ];
    }
}