<?php

namespace App\Livewire\Raport;

use App\Livewire\Traits\Alert;
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

class Detail extends Component
{

    public $cha_id;
    public $user_id;

    #[Title('Progress Detail')]
    public function mount($cha_id, $user_id) {
        if (strtolower(Auth::user()->grup) != strtolower(User::find($user_id)->grup)) {
            $this->redirect('/raport', navigate: true);
        }
        $this->cha_id = $cha_id;
        $this->user_id = $user_id;
    }

    public function render(): View {
        $progressDetail = ChallengeProgress::query()->orderBy('date', 'desc')
        ->whereChallengeId($this->cha_id)
        ->whereUserId($this->user_id)
        ->get();
        return view('livewire.raport.detail',compact('progressDetail'));
    }

}