<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'gender' => ['required', 'string', 'max:20'],
            'name' => ['required', 'string', 'max:255'],
            
            // 🌟 PERBAIKAN: Memperbaiki typo 'lowercase,' dan menambahkan format regex alfa-numerik
            'slug' => [
                'required', 
                'string', 
                'max:255', 
                'lowercase', 
                'alpha_dash', // Hanya mengizinkan huruf, angka, dash (-), dan underscore (_)
                Rule::unique(User::class)->ignore($this->user()->id)
            ],
            
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            
            // Aturan WhatsApp & Alamat lainnya tetap dibiarkan utuh...
            'whatsapp' => ['nullable', 'string', 'max:20'],
            'province_code' => ['nullable', 'string', 'exists:provinces,code'],
            'city_code' => ['nullable', 'string', 'exists:cities,code'],
            'district_code' => ['nullable', 'string', 'exists:districts,code'],
            'village_code' => ['nullable', 'string', 'exists:villages,code'],
            'jalan' => ['nullable', 'string'],
            'kode_pos' => ['nullable', 'string', 'max:10'],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'sampul' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ];
    }
}