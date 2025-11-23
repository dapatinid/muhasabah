<?php

namespace App\Livewire\Raport;

use App\Livewire\Traits\Alert;
use App\Models\Challenge;
use App\Models\ChallengeProgress;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Renderless;
use Livewire\Attributes\Title;
use Livewire\Attributes\Url;
use Livewire\Component;
use Livewire\WithPagination;
use Illuminate\Support\Arr;

class Index extends Component
{
    use WithPagination, Alert;

    // #[Url()]
    public $pengguna_id = 3;

    // public function mount() {
    //     if ($this->pengguna_id == null || $this->pengguna_id === '') {
    //         $this->pengguna_id == 3 ;
    //     }
    // }

    public function render(): View
    {
        $userList = User::query()
            ->whereNotIn('id', [1,2])
            ->where('grup','like', '%'.Auth::user()->grup.'%')
            ->get()
            ->map(fn(User $userList): array => [
                'value' => $userList->id,
                'label' => $userList->name
            ]);
        $challenge = Challenge::query()->orderBy('id','asc')->get();
        return view('livewire.raport.index',compact('challenge','userList'));
    }

}
