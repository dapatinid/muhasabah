<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'whatsapp' => $input['whatsapp'],
            'negara' => $input['negara'] ?? 'Indonesia',
            'province_code' => $input['province_code'],
            'city_code' => $input['city_code'],
            'district_code' => $input['district_code'],
            'village_code' => $input['village_code'],
            'kode_pos' => $input['kode_pos'],
            'jalan' => $input['jalan'],
        ]);
    }
}
