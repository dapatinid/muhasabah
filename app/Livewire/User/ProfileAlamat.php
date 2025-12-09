<?php

namespace App\Livewire\User;

use App\Livewire\Traits\Alert;
use App\Models\City;
use App\Models\District;
use App\Models\Province;
use App\Models\User;
use App\Models\Village;
use Illuminate\Contracts\View\View;
use Illuminate\Validation\Rule;
use Livewire\Attributes\Validate;
use Livewire\Component;
use Livewire\WithFileUploads;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Title;
use Livewire\Attributes\Url;

class ProfileAlamat extends Component
{
    use Alert, WithFileUploads;

    public User $user;
    public $state;
    public $city;
    public $district;
    public $village;
    public $street;
    public $zip_code;

    #[Title('Edit Alamat')]
    public function mount()
    {
        $this->user = User::find(Auth::user()->id);
        $userEdit = User::find(Auth::user()->id);
        $this->state = $userEdit->state;
        $this->city = $userEdit->city;
        $this->district = $userEdit->district;
        $this->village = $userEdit->village;
        $this->street = $userEdit->street;
        $this->zip_code = $userEdit->zip_code;
    }
    public function updatedState()
    {
        $this->user->state = $this->state;
        $this->user->city = null;
        $this->user->district = null;
        $this->user->village = null;
        $this->user->update();
        $this->redirect('/user/profile-alamat', navigate: true);
    }
    public function updatedCity()
    {
        $this->user->city = $this->city;
        $this->user->district = null;
        $this->user->village = null;
        $this->user->update();
        $this->redirect('/user/profile-alamat', navigate: true);
    }
    public function updatedDistrict()
    {

        $this->user->district = $this->district;
        $this->user->village = null;
        $this->user->update();
        $this->redirect('/user/profile-alamat', navigate: true);
    }
    public function updatedVillage()
    {

        $this->user->village = $this->village;
        $this->user->update();
        $this->redirect('/user/profile-alamat', navigate: true);
    }
    // public function updatedStreet()
    // {
    //     $this->user->street = $this->street;
    //     $this->user->update();
    //     $this->redirect('/user/profile-alamat', navigate: true);
    // }
    public function render()
    {
        // PROVINSI selalu load
        $provinsi = Province::query()
            ->orderBy('name')
            ->get()
            ->map(fn(Province $provinsi) => [
                'label' => $provinsi->name,
                'value' => $provinsi->code,
            ]);

        // KOTA hanya load kalau provinsi dipilih
        $kota = collect();
        if ($this->state) {
            $kota = City::query()
                ->where('province_code', $this->state)
                ->orderBy('name')
                ->get()
                ->map(fn(City $kota) => [
                    'label' => $kota->name,
                    'value' => $kota->code,
                ]);
        }

        // KECAMATAN hanya load kalau kota dipilih
        $kecamatan = collect();
        if ($this->city) {
            $kecamatan = District::query()
                ->where('city_code', $this->city)
                ->orderBy('name')
                ->get()
                ->map(fn(District $kecamatan) => [
                    'label' => $kecamatan->name,
                    'value' => $kecamatan->code,
                ]);
        }

        // DESA hanya load kalau kecamatan dipilih
        $desa = collect();
        if ($this->district) {
            $desa = Village::query()
                ->where('district_code', $this->district)
                ->orderBy('name')
                ->get()
                ->map(fn(Village $desa) => [
                    'label' => $desa->name,
                    'value' => $desa->code,
                ]);
        }

        return view('livewire.user.profile-alamat', [
            'provinsi' => $provinsi,
            'kota' => $kota,
            'kecamatan' => $kecamatan,
            'desa' => $desa,
        ]);
    }


    public function save_alamat(): void
    {
        // $this->validate();

        // $this->user->state = $this->state;
        // $this->user->city = $this->city;
        // $this->user->district = $this->district;
        // $this->user->village = $this->village;
        $this->user->street = $this->street;
        $this->user->zip_code = $this->zip_code;

        $this->user->update();

        $this->toast()
            // ->persistent()
            ->position('top-right')
            ->success('Berhasil', 'Perubahan alamat disimpan')
            // ->flash()
            ->send();

        if (Auth::user()->image == null || Auth::user()->gender == null || Auth::user()->tempat_lahir == null || Auth::user()->tanggal_lahir == null || Auth::user()->golongan_darah == null || Auth::user()->grup == null) {
            $this->redirect('/user/profile-data-diri', navigate: true);
        } else {
            $this->redirect('/user/profile', navigate: true);
        }
    }
}
