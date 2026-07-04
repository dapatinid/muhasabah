<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\City;
use App\Models\District;
use App\Models\Province;
use App\Models\User;
use App\Models\Village;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UserAdminController extends Controller
{
public function index(Request $request)
{
    $users = User::query()->whereNotIn('id',[1,2])
        ->with([
            'province',
            'city',
            'district',
            'village',
        ])
        ->when($request->search, function ($q) use ($request) {
            $search = strtolower($request->search); // Normalisasi input

            $q->where(function ($qq) use ($search) {
                $qq->whereRaw('LOWER(name) like ?', ["%{$search}%"])
                ->orWhereRaw('LOWER(email) like ?', ["%{$search}%"])
                ->orWhereRaw('LOWER(whatsapp) like ?', ["%{$search}%"])

                // PROVINSI
                ->orWhereHas('province', function ($r) use ($search) {
                    $r->whereRaw('LOWER(name) like ?', ["%{$search}%"]);
                })

                // KABUPATEN / KOTA
                ->orWhereHas('city', function ($r) use ($search) {
                    $r->whereRaw('LOWER(name) like ?', ["%{$search}%"]);
                })

                // KECAMATAN
                ->orWhereHas('district', function ($r) use ($search) {
                    $r->whereRaw('LOWER(name) like ?', ["%{$search}%"]);
                })

                // DESA
                ->orWhereHas('village', function ($r) use ($search) {
                    $r->whereRaw('LOWER(name) like ?', ["%{$search}%"]);
                });
            });
        })

        ->latest()
        ->paginate(50)
        ->withQueryString();

    return Inertia::render('Admin/User/Index', [
        'users' => $users,
        'filters' => $request->only('search'),
        'breadcrumbs' => [
            ['title' => 'Kelola Pengguna', 'href' => '/admin/pengguna'],
        ],
    ]);
}



public function create(Request $request)
{
    // ===============================
    // PROVINCES (SELALU ADA)
    // ===============================
    $provinces = Province::select('code', 'name')
        ->orderBy('name')
        ->get();

    // ===============================
    // DEPENDENT CITIES, DISTRICTS, VILLAGES
    // ===============================
    $cities = $request->province_code
        ? City::where('province_code', $request->province_code)
            ->select('code', 'name')
            ->orderBy('name')
            ->get()
        : [];

    $districts = $request->city_code
        ? District::where('city_code', $request->city_code)
            ->select('code', 'name')
            ->orderBy('name')
            ->get()
        : [];

    $villages = $request->district_code
        ? Village::where('district_code', $request->district_code)
            ->select('code', 'name')
            ->orderBy('name')
            ->get()
        : [];

    // ===============================
    // RENDER CREATE INERTIA
    // ===============================
    return Inertia::render('Admin/User/Create', [
        'provinces' => $provinces,
        'cities' => $cities,
        'districts' => $districts,
        'villages' => $villages,
        'breadcrumbs' => [
            ['title' => 'Pengguna', 'href' => '/admin/pengguna'],
            ['title' => 'Buat Pengguna', 'href' => "/admin/pengguna/buat"],
        ],
    ]);
}

public function store(Request $request)
{
    $data = $request->validate([
        'name'          => 'required|string|max:255',
        'slug'          => 'nullable|string|max:255|unique:users,slug',
        'email'         => 'required|email|unique:users,email',
        'password'      => 'required|min:6',
        'whatsapp'      => 'nullable|string|max:20',
        'gender'        => 'nullable|string|in:L,P',
        'is_active'     => 'nullable|boolean',
        'is_admin'      => 'nullable|boolean',
        'level'         => 'nullable|string|in:Super Admin,Admin,Owner',
        'class'         => 'nullable|string|max:255', 
        'jalan'         => 'nullable|string',
        'kode_pos'      => 'nullable|string|max:10',
        'negara'        => 'nullable|string|max:100',
        'province_code' => 'nullable|string',
        'city_code'     => 'nullable|string',
        'district_code' => 'nullable|string',
        'village_code'  => 'nullable|string',
        'avatar'        => 'nullable|image|max:2048',
        'sampul'        => 'nullable|image|max:4096',
    ]);

    // =========================
    // PASSWORD
    // =========================
    $data['password'] = Hash::make($data['password']);

    // =========================
    // BOOLEAN NORMALIZATION
    // =========================
    $data['is_active'] = $request->boolean('is_active');
    $data['is_admin']  = $request->boolean('is_admin');

    // =========================
    // LEVEL SAFETY
    // =========================
    if (!$data['is_admin']) {
        $data['level'] = null;
    }

    // =========================
    // AVATAR
    // =========================
    if ($request->hasFile('avatar')) {
        $data['avatar'] = $request->file('avatar')->store('users/avatar', 'public');
    }

    // =========================
    // SAMPUL
    // =========================
    if ($request->hasFile('sampul')) {
        $data['sampul'] = $request->file('sampul')->store('users/sampul', 'public');
    }

    // Create record ke database
    User::create($data);

    return redirect()->route('admin.pengguna.index')
        ->with('success', 'Pengguna berhasil ditambahkan');
}




public function edit(Request $request, User $user)
    {   
        if (Auth::user()->id != 1 && $user->id == 1) {
            return redirect()->route('admin.pengguna.index');
        }

        // ===============================
        // PROVINCES (SELALU ADA)
        // ===============================
        // Tidak perlu di-alias as value/label, karena di Edit.vue kita pakai value-key="code" & label-key="name"
        $provinces = Province::select('code', 'name')
            ->orderBy('name')
            ->get();

        // ===============================
        // DEPENDENT CITIES
        // ===============================
        $cities = [];
        // UBAH: dari $user->state menjadi $user->province_code
        if ($request->province_code || $user->province_code) {
            $provinceCode = $request->province_code ?? $user->province_code;

            $cities = City::where('province_code', $provinceCode)
                ->select('code', 'name')
                ->orderBy('name')
                ->get();
        }

        // ===============================
        // DEPENDENT DISTRICTS
        // ===============================
        $districts = [];
        // UBAH: dari $user->city menjadi $user->city_code
        if ($request->city_code || $user->city_code) {
            $cityCode = $request->city_code ?? $user->city_code;

            $districts = District::where('city_code', $cityCode)
                ->select('code', 'name')
                ->orderBy('name')
                ->get();
        }

        // ===============================
        // DEPENDENT VILLAGES
        // ===============================
        $villages = [];
        // UBAH: dari $user->district menjadi $user->district_code
        if ($request->district_code || $user->district_code) {
            $districtCode = $request->district_code ?? $user->district_code;

            $villages = Village::where('district_code', $districtCode)
                ->select('code', 'name')
                ->orderBy('name')
                ->get();
        }

        // ===============================
        // RENDER INERTIA
        // ===============================
        // Catatan: Sesuaikan nama folder, jika di folder Pengguna, maka 'Admin/Pengguna/Edit'
        return Inertia::render('Admin/User/Edit', [
            'user' => $user,
            'provinces' => $provinces,
            'cities' => $cities,
            'districts' => $districts,
            'villages' => $villages,
        'breadcrumbs' => [
            ['title' => 'Pengguna', 'href' => '/admin/pengguna'],
            ['title' => 'Edit Pengguna', 'href' => "/admin/pengguna/{$user->id}/edit"],
        ],
        ]);
    }



public function update(Request $request, User $user) // Pastikan parameternya (User $user)
{
    // 1. VALIDASI
    $data = $request->validate([
        'name'          => 'required|string|max:255',
        // WAJIB tambahkan abaikan ID pada unique slug & email:
        'slug'          => ['required', 'string', Rule::unique('users', 'slug')->ignore($user->id)],
        'email'         => ['required', 'email', Rule::unique('users', 'email')->ignore($user->id)],
        
        'whatsapp'      => 'nullable|string|max:20',
        'gender'        => 'nullable|string|in:L,P',
        'password'      => 'nullable|string|min:8', // Password opsional saat update
        'is_active'     => 'boolean',
        'is_admin'      => 'boolean',
        'level'         => 'nullable|string',
        'class'         => 'nullable|string',
        'negara'        => 'nullable|string',
        'province_code' => 'nullable|string',
        'city_code'     => 'nullable|string',
        'district_code' => 'nullable|string',
        'village_code'  => 'nullable|string',
        'kode_pos'      => 'nullable|string',
        'jalan'         => 'nullable|string',
        'avatar'        => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'sampul'        => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    // 2. PENGECEKAN LEVEL & HAK AKSES
    if (!$data['is_admin']) {
        $data['level'] = null;
    }

    // 3. PENGECEKAN PASSWORD (Hanya ubah jika diisi)
    if ($request->filled('password')) {
        $data['password'] = Hash::make($data['password']);
    } else {
        unset($data['password']); // Hapus dari array jika kosong agar tidak tertimpa NULL
    }

    // 4. UPLOAD AVATAR
    if ($request->hasFile('avatar')) {
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }
        $data['avatar'] = $request->file('avatar')->store('users/avatar', 'public');
    }

    // 5. UPLOAD SAMPUL
    if ($request->hasFile('sampul')) {
        if ($user->sampul && Storage::disk('public')->exists($user->sampul)) {
            Storage::disk('public')->delete($user->sampul);
        }
        $data['sampul'] = $request->file('sampul')->store('users/sampul', 'public');
    }

    // 6. UPDATE DATA KE DB
    $user->update($data);

    // 7. REDIRECT + FLASH MESSAGE
    return redirect()->route('admin.pengguna.index')->with('success', 'Data pengguna berhasil diperbarui.');
}


}
