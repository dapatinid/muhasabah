<?php

namespace App\Livewire\Jurnalamal;

use App\Livewire\Traits\Alert;
use App\Models\ChallengeProgress;
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

    #[Title('Progress Detail')]
    public function mount($id){
        $this->cha_id = $id;
    }

    public function render(): View {
        $progressDetail = ChallengeProgress::query()->whereChallengeId($this->cha_id)->whereUserId(Auth::id())->get();
        return view('livewire.jurnalamal.detail',compact('progressDetail'));
    }

}