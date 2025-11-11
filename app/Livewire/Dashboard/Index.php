<?php

namespace App\Livewire\Dashboard;

use App\Livewire\Traits\Alert;
use App\Models\Challenge;
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

class Index extends Component
{
    use WithPagination, Alert;

    public function render(): View
    {
        
        $challenge = Challenge::query()->orderBy('id','asc')->get();
        return view('livewire.dashboard.index',compact('challenge'));
    }

}
