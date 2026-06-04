<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Database\Eloquent\Builder;

use App\Models\Kalam;
use App\Models\Donasi;
use App\Models\Acara;

class RestrictDataToOwner
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            // (Opsional) Jika super admin boleh lihat semua, uncomment baris di bawah ini:
            if ($user->level === 'Super Admin') return $next($request);

            // ==========================================
            // 1. KACAMATA KUDA (Untuk list/index & query)
            // ==========================================
            $scope = function (Builder $builder) use ($user) {
                // Pastikan 'user_id' sesuai dengan nama kolom di tabel Anda (bisa jadi 'created_by')
                $builder->where('created_by', $user->id); 
            };

            Kalam::addGlobalScope('owner', $scope);
            Donasi::addGlobalScope('owner', $scope);
            Acara::addGlobalScope('owner', $scope);


            // ==========================================
            // 2. PENJAGA PINTU (Mencegah Akses URL Langsung)
            // ==========================================
            // Kita cek data model yang sudah terlanjur di-bind oleh URL
            $routeParamsToCheck = ['kalam', 'donasi', 'acara'];

            foreach ($routeParamsToCheck as $paramName) {
                $model = $request->route($paramName); // Mengambil data dari parameter URL
                
                // 🌟 PERBAIKAN DI SINI: Ubah user_id menjadi created_by
                if ($model && $model->created_by !== $user->id) {
                    // Munculkan Error 404 (Not Found) seolah-olah datanya tidak pernah ada
                    abort(404); 
                }
            }
        }

        return $next($request);
    }
}