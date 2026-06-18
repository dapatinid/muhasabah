<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use App\Models\Province;
use App\Models\City;
use App\Models\District;
use App\Models\Village;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

#[Fillable(['gender', 'name', 'slug', 'email', 'password', 'is_active', 'class', 'is_admin', 'level', 'last_seen_at', 'whatsapp', 'negara', 'province_code', 'city_code', 'district_code', 'village_code', 'kode_pos', 'jalan', 'avatar', 'sampul'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->name) . '-' . uniqid(); 
                // uniqid() ditambahkan agar jika ada nama user yang sama (misal "Budi"), slug-nya tidak bentrok
            }
        });
    }    

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'last_seen_at' => 'datetime',
        ];
    }

    public function kalams()
    {
        return $this->belongsToMany(Kalam::class)->withTimestamps();
    }    

    public function donasis() 
    {
        return $this->belongsToMany(Donasi::class)->withTimestamps();
    }
    
    public function acaras()
    {
        return $this->belongsToMany(Acara::class)->withTimestamps();
    }    

    public function lingkarans()
    {
        return $this->belongsToMany(Lingkaran::class)->withTimestamps();
    }
    public function masjids()
    {
        return $this->belongsToMany(Masjid::class)->withTimestamps();
    }
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }  

    public function province() { return $this->belongsTo(Province::class, 'province_code', 'code'); }
    public function city() { return $this->belongsTo(City::class, 'city_code', 'code'); }
    public function district() { return $this->belongsTo(District::class, 'district_code', 'code'); }
    public function village() { return $this->belongsTo(Village::class, 'village_code', 'code'); }    

/**
     * Relasi ke tabel Uji Kelayakan (Satu user bisa mengisi banyak kategori/kuesioner)
     */
    public function ujiKelayakans(): HasMany
    {
        return $this->hasMany(UjiKelayakan::class);
    }    

    public function getIsOnlineAttribute(): bool
    {
        return $this->last_seen_at && $this->last_seen_at->gt(now()->subMinutes(5));
    }    

    /**
     * Relasi One-to-One ke profil data TentangSaya
     */
    public function tentangSaya(): HasOne
    {
        return $this->hasOne(TentangSaya::class, 'user_id');
    }    
}
