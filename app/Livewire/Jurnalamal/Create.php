<?php

namespace App\Livewire\Jurnalamal;

use App\Livewire\Traits\Alert;
use Illuminate\Database\Eloquent\Builder;
use App\Models\Challenge;
use App\Models\ChallengeProgress;
use App\Models\ChallengeVariant;
use Carbon\Carbon;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Livewire\Attributes\On;
use Livewire\Attributes\Url;
use Livewire\Component;

class Create extends Component
{
    use Alert;

    public ChallengeProgress $jurnalamal;

    public bool $modal = false;
    public $date;
    public $challenge;
    public $challenge_variant;
    public $submitted_value;
    public $earned_score;
    public $note;
    public $hiddenValue = 'hidden';
    public $deskripsi;

    public function mount(): void
    {
        $this->jurnalamal = new ChallengeProgress();
        // $this->date = now()->format('Y-m-d');
    }

    #[On('open::createjurnalamal')]
    public function setDate($date)
    {
        $inputDate = substr($date, -11);

        $bulanIndo = [
            'Jan' => 'Jan',
            'Feb' => 'Feb',
            'Mar' => 'Mar',
            'Apr' => 'Apr',
            'Mei' => 'May',
            'Jun' => 'Jun',
            'Jul' => 'Jul',
            'Agu' => 'Aug',
            'Sep' => 'Sep',
            'Okt' => 'Oct',
            'Nov' => 'Nov',
            'Des' => 'Dec',
        ];

        foreach ($bulanIndo as $indo => $eng) {
            $inputDate = str_replace($indo, $eng, $inputDate);
        }

        $carbonDate = Carbon::createFromFormat('d M Y', $inputDate);

        $carbonDate->toDateString();


        $rawFormat = $carbonDate->format('Y-m-d');

        $this->date = $rawFormat ?? today();
        // $this->modal = true;
    }

    public function resetForm()
    {
        $this->challenge = '';
        $this->challenge_variant = '';
        $this->submitted_value = '';
        $this->earned_score = '';
        $this->note = '';
    }


    public function render(): View
    {
        $tantangan = Challenge::query()
            // ->when($search, fn(Builder $query) => $query->where('name', 'like', "%{$search}%"))
            // ->unless($search, fn(Builder $query) => $query->limit(100))
            // ->whereDoesntHave('progresses', function ($query) {
            //     $query->whereDate('date', $this->date);
            // })
            ->get()
            ->map(fn(Challenge $tantangan): array => [
                'value' => $tantangan->id,
                'label' => $tantangan->title    
            ]);
        $variant = ChallengeVariant::query()
            ->when($this->challenge, fn(Builder $query) => $query->where('challenge_id', $this->challenge))
            // ->unless($search, fn(Builder $query) => $query->limit(100))
            ->get()
            ->map(fn(ChallengeVariant $variant): array => [
                'value' => $variant->id,
                'label' => $variant->name
            ]);
        return view('livewire.jurnalamal.create', compact('tantangan','variant'));
    }

    // public function onDateChange()
    // {
    //     $this->challenge = '';
    //     $this->challenge_variant = '';
    // }
    public function clearVariant()
    {
        $this->challenge_variant = '';
        $this->deskripsi = Challenge::find($this->challenge)->description;
    }
    public function cekInputManual()
    {
        $isOpenValue = ChallengeVariant::find($this->challenge_variant)->is_manual_input;
        $this->hiddenValue = ($isOpenValue == true) ? '' : 'hidden' ;
        $this->submitted_value = ($isOpenValue == true) ? '0' : ChallengeVariant::find($this->challenge_variant)->score;
        $this->earned_score = ($isOpenValue == true) ? $this->submitted_value : ChallengeVariant::find($this->challenge_variant)->score;
        
    }
    public function updatedSubmittedValue()
    {
        $isOpenValue = ChallengeVariant::find($this->challenge_variant)->is_manual_input;
        $this->earned_score = ($isOpenValue == true) ? $this->submitted_value : ChallengeVariant::find($this->challenge_variant)->score;
    }

    public function rules(): array
    {
        return [
            'challenge' => [
                'required',
            ],
            'challenge_variant' => [
                'required',
            ],
            'submitted_value' => [
                'required',
            ],
            'earned_score' => [
                'required',
            ],
        ];
    }

    public function save(): void
    {
        $cekTantangan = ChallengeProgress::whereDate('date', $this->date)->where('challenge_id',$this->challenge)->whereUserId(Auth::id())->count();
        
        if ($cekTantangan > 0) {
            $this->modal = false;
            $this->info('Ganti amalan di tanggal terpilih', 'Amalan sudah dilakukan');
        } else {
            $this->validate();

            $this->jurnalamal->date = $this->date;
            $this->jurnalamal->challenge_id = $this->challenge;
            $this->jurnalamal->challenge_variant_id = $this->challenge_variant;
            $this->jurnalamal->submitted_value = $this->submitted_value;
            $this->jurnalamal->earned_score = $this->earned_score;
            $this->jurnalamal->note = $this->note;
            $this->jurnalamal->user_id = Auth::id();
            $this->jurnalamal->save();

            $this->dispatch('created');

            $this->resetExcept('date');
            $this->jurnalamal = new ChallengeProgress();

            // $this->toast()->success('Berhasil', 'Semangat Amal Ibadah !!!')->send();
        }
        


    }
}
