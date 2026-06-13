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
            if ($user->level === 'Super Admin') return $next($request);

            // ==========================================
            // 1. KACAMATA KUDA
            // ==========================================

            $strictScope = function (Builder $builder) use ($user) {
                $builder->where('created_by', $user->id);
            };

            $flexibleScope = function (Builder $builder) use ($user) {
                $builder->where(function ($query) use ($user) {
                    $query->where('created_by', $user->id)
                          ->orWhereHas('users', function ($q) use ($user) {
                              $q->where('users.id', $user->id);
                          });
                });
            };

            Kalam::addGlobalScope('owner', $strictScope);
            Donasi::addGlobalScope('owner', $strictScope);
            Acara::addGlobalScope('owner', $strictScope);
            Lingkaran::addGlobalScope('owner', $flexibleScope);
            Masjid::addGlobalScope('owner', $flexibleScope);

            // ==========================================
            // 2. PENJAGA PINTU
            // ==========================================

            // Pengecekan A: Ketat (Kalam, Donasi, Acara)
            $strictModels = [
                'kalam'  => Kalam::class,
                'donasi' => Donasi::class,
                'acara'  => Acara::class,
            ];

            foreach ($strictModels as $paramName => $modelClass) {
                $model = $request->route($paramName);

                // Resolve manual jika masih string (slug), bypass global scope
                if ($model && is_string($model)) {
                    $model = $modelClass::withoutGlobalScope('owner')
                        ->where('slug', $model)
                        ->first();
                }

                if ($model instanceof \Illuminate\Database\Eloquent\Model) {
                    if ($model->created_by !== $user->id) {
                        abort(403);
                    }
                }
            }

            // Pengecekan B: Fleksibel (Lingkaran, Masjid — tidak ada created_by wajib)
            $flexibleModels = [
                'lingkaran' => Lingkaran::class,
                'masjid'    => Masjid::class,
            ];

            foreach ($flexibleModels as $paramName => $modelClass) {
                $model = $request->route($paramName);

                // Resolve manual jika masih string (slug), bypass global scope
                if ($model && is_string($model)) {
                    $model = $modelClass::withoutGlobalScope('owner')
                        ->where('slug', $model)
                        ->first();
                }

                if ($model instanceof \Illuminate\Database\Eloquent\Model) {
                    $isOwner = $model->created_by === $user->id;

                    // Query users() tanpa terkena global scope apapun
                    $isAttached = $model->users()
                        ->withoutGlobalScopes()
                        ->where('users.id', $user->id)
                        ->exists();

                    if (!$isOwner && !$isAttached) {
                        abort(403);
                    }
                }
            }
        }

        return $next($request);
    }
}