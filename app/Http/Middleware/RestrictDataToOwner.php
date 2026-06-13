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

class RestrictDataToOwner
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            // (Opsional) Jika super admin boleh lihat semua
            if ($user->level === 'Super Admin') return $next($request);

            // ==========================================
            // 1. KACAMATA KUDA (Untuk list/index & query)
            // ==========================================
            
            // Scope A: Ketat (Hanya Pembuat)
            $strictScope = function (Builder $builder) use ($user) {
                $builder->where('created_by', $user->id); 
            };

            // Scope B: Fleksibel (Pembuat ATAU Anggota/Pengelola di tabel pivot)
            $flexibleScope = function (Builder $builder) use ($user) {
                $builder->where(function ($query) use ($user) {
                    $query->where('created_by', $user->id)
                          ->orWhereHas('users', function ($q) use ($user) {
                              // Memeriksa apakah user ini ada di tabel pivot (lingkaran_user / masjid_user)
                              $q->where('users.id', $user->id); 
                          });
                });
            };

            // Terapkan Scope Ketat
            Kalam::addGlobalScope('owner', $strictScope);
            Donasi::addGlobalScope('owner', $strictScope);
            Acara::addGlobalScope('owner', $strictScope);

            // Terapkan Scope Fleksibel
            Lingkaran::addGlobalScope('owner', $flexibleScope);
            Masjid::addGlobalScope('owner', $flexibleScope);


            // ==========================================
            // 2. PENJAGA PINTU (Mencegah Akses URL Langsung)
            // ==========================================
            
            // Pengecekan A: Ketat (Kalam, Donasi, Acara)
            $strictModels = [
                'kalam'  => \App\Models\Kalam::class,
                'donasi' => \App\Models\Donasi::class,
                'acara'  => \App\Models\Acara::class,
            ];

            foreach ($strictModels as $paramName => $modelClass) {
                $model = $request->route($paramName);

                if ($model && is_string($model)) {
                    $model = $modelClass::where('slug', $model)->first();
                }

                if ($model && $model instanceof \Illuminate\Database\Eloquent\Model) {
                    if ($model->created_by !== $user->id) {
                        abort(404);
                    }
                }
            }

            // Pengecekan B: Fleksibel (Lingkaran, Masjid)
            $flexibleParamsToCheck = [
                'lingkaran' => Lingkaran::class,
                'masjid'    => Masjid::class,
            ];

            foreach ($flexibleParamsToCheck as $paramName => $modelClass) {
                $model = $request->route($paramName);

                // Jika belum di-resolve (masih string), ambil manual pakai slug
                if ($model && is_string($model)) {
                    $model = $modelClass::where('slug', $model)->first();
                }

                if ($model && $model instanceof \Illuminate\Database\Eloquent\Model) {
                    $isOwner    = $model->created_by === $user->id;
                    $isAttached = $model->users()->where('users.id', $user->id)->exists();

                    if (!$isOwner && !$isAttached) {
                        abort(404);
                    }
                }
            }
        }

        return $next($request);
    }
}