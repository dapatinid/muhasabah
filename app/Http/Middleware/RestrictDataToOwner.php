<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Database\Eloquent\Builder;

use App\Models\Kalam;
use App\Models\Donasi;
use App\Models\Acara;
use App\Models\Lingkaran;
use App\Models\Masjid;
use Illuminate\Support\Facades\Log;

class RestrictDataToOwner
{
    public function handle(Request $request, Closure $next): Response
    {
        Log::info('RestrictDataToOwner fired', [
            'url'    => $request->url(),
            'method' => $request->method(),
            'user'   => $request->user()?->id,
            'route_params' => $request->route()->parameters(),
        ]);

        $user = $request->user();

        if ($user) {
            if ($user->level === 'Super Admin') return $next($request);

            // ==========================================
            // 1. KACAMATA KUDA
            // Semua model sekarang pakai pola sama:
            // created_by ATAU terdaftar di tabel relasi (users)
            // ==========================================

            $flexibleScope = function (Builder $builder) use ($user) {
                $builder->where(function ($query) use ($user) {
                    $query->where('created_by', $user->id)
                          ->orWhereHas('users', function ($q) use ($user) {
                              $q->where('users.id', $user->id);
                          });
                });
            };

            Kalam::addGlobalScope('owner', $flexibleScope);
            Donasi::addGlobalScope('owner', $flexibleScope);
            Acara::addGlobalScope('owner', $flexibleScope);
            Lingkaran::addGlobalScope('owner', $flexibleScope);
            Masjid::addGlobalScope('owner', $flexibleScope);

            // ==========================================
            // 2. PENJAGA PINTU
            // Semua model sekarang pakai pengecekan sama:
            // created_by SELALU boleh edit/hapus, terlepas isAttached atau tidak.
            // Selain created_by, hanya yang isAttached yang boleh.
            // ==========================================

            $models = [
                'kalam'     => Kalam::class,
                'donasi'    => Donasi::class,
                'acara'     => Acara::class,
                'lingkaran' => Lingkaran::class,
                'masjid'    => Masjid::class,
            ];

            foreach ($models as $paramName => $modelClass) {
                $model = $request->route($paramName);

                // Resolve manual jika masih string (slug), bypass global scope
                if ($model && is_string($model)) {
                    $model = $modelClass::withoutGlobalScope('owner')
                        ->where('slug', $model)
                        ->first();
                }

                if ($model instanceof \Illuminate\Database\Eloquent\Model) {
                    $isOwner = $model->created_by == $user->id;

                    if ($isOwner) {
                        continue;
                    }

                    // Bukan owner -> wajib ada di tabel relasi (isAttached)
                    $isAttached = $model->users()
                        ->withoutGlobalScopes()
                        ->where('users.id', $user->id)
                        ->exists();

                    if (!$isAttached) {
                        abort(403);
                    }
                }
            }
        }

        return $next($request);
    }
}