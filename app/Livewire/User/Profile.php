<?php

namespace App\Livewire\User;

use App\Livewire\Traits\Alert;
use App\Models\User;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use Livewire\Attributes\Title;

class Profile extends Component
{
    use Alert;

    public User $user;

    #[Title('Profil')]
    public function mount(): void
    {
        $this->user = Auth::user();
    }

    public function render(): View
    {
        return view('livewire.user.profile');
    }

}
