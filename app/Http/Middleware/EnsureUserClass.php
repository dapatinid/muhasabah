<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserClass
{
    public function handle(Request $request, Closure $next, ...$classes): Response
    {
        $user = $request->user();

        // Cek apakah user login dan apakah salah satu dari $classes ada di dalam data user->class
        // Asumsi $user->class adalah string (misal: 'penulis,penggalang-dana') 
        // atau array. Jika di DB berupa string koma-koma, gunakan explode:
        
        $userClasses = is_array($user->class) ? $user->class : explode(',', $user->class);

        // Periksa apakah ada irisan (intersect) antara class yang diizinkan dan class user
        if ($user && !empty(array_intersect($userClasses, $classes))) {
            return $next($request);
        }

        // Jika tidak punya izin, arahkan ke dashboard atau beri error 403
        return redirect()->route('dashboard')->with('error', 'Anda tidak memiliki akses ke fitur ini.');
    }
}