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
        $userClasses = is_array($user->class) ? $user->class : explode(',', $user->class);

        // Jika user memiliki salah satu class yang dibutuhkan, izinkan lewat
        if ($user && !empty(array_intersect($userClasses, $classes))) {
            return $next($request);
        }

        // 🔀 REDIRECT LOGIC: Jika ditolak, cek class apa yang sedang diminta rute tersebut
        if (in_array('penulis', $classes)) {
            return redirect()->route('pendaftaran.penulis');
        }

        if (in_array('penggalang-dana', $classes)) {
            return redirect()->route('pendaftaran.penggalang-dana');
        }

        if (in_array('penyelenggara-acara', $classes)) {
            return redirect()->route('pendaftaran.penyelenggara-acara');
        }

        // Fallback jika tidak memenuhi kriteria di atas
        return redirect()->route('dashboard')->with('error', 'Anda tidak memiliki akses.');
    }
}