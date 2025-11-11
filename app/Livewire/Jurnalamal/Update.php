<?php

namespace App\Livewire\Jurnalamal;

use App\Livewire\Traits\Alert;
use Illuminate\Database\Eloquent\Builder;
use App\Models\Challenge;
use App\Models\ChallengeProgress;
use App\Models\ChallengeVariant;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Livewire\Attributes\On;
use Livewire\Component;

class Update extends Component
{
    use Alert;

    public ?ChallengeProgress $jurnalamal;

    public bool $modal = false;
    public $variant = [];
    public $hiddenValuenya;
    public $deskripsinya;

    public function render(): View
    {
        $tantangan = Challenge::query()
            ->get()
            ->map(fn(Challenge $tantangan): array => [
                'value' => $tantangan->id,
                'label' => $tantangan->title
            ]);

        return view('livewire.jurnalamal.update', [
            'tantangan' => $tantangan,
        ]);
    }

    #[On('load::jurnalamal')]
    public function load(ChallengeProgress $jurnalamal): void
    {
        $this->jurnalamal = $jurnalamal;
        $this->modal = true;
        $this->loadVariant();
        $this->deskripsinya = Challenge::find($this->jurnalamal->challenge_id)->description;
        $this->hiddenValuenya = (ChallengeVariant::find($this->jurnalamal->challenge_variant_id)->is_manual_input == true) ? '' : 'hidden' ;
    }

    public function loadVariant(): void
    {
        if (!$this->jurnalamal?->challenge_id) {
            $this->variant = [];
            return;
        }

        $this->variant = ChallengeVariant::query()
            ->where('challenge_id', $this->jurnalamal->challenge_id)
            ->get()
            ->map(fn(ChallengeVariant $variant): array => [
                'value' => $variant->id,
                'label' => $variant->name,
            ])
            ->toArray();
    }

    public function updatedjurnalamalChallengeId()
    {
        $this->clearVariant();
        $this->loadVariant();
        $this->hiddenValuenya = 'hidden' ;
    }

    public function clearVariant()
    {
        $this->jurnalamal->challenge_variant_id = '';
        $this->jurnalamal->submitted_value = '';
        $this->jurnalamal->earned_score = '';
        $this->deskripsinya = Challenge::find($this->jurnalamal->challenge_id)->description;
    }
    public function cekInputManual()
    {
        $isOpenValue = ChallengeVariant::find($this->jurnalamal->challenge_variant_id)->is_manual_input;
        $this->hiddenValuenya = ($isOpenValue == true) ? '' : 'hidden' ;
        $this->jurnalamal->submitted_value = ($isOpenValue == true) ? '0' : ChallengeVariant::find($this->jurnalamal->challenge_variant_id)->score;
        $this->jurnalamal->earned_score = ($isOpenValue == true) ? $this->jurnalamal->submitted_value : ChallengeVariant::find($this->jurnalamal->challenge_variant_id)->score;
    }
    public function updatedjurnalamalSubmittedValue()
    {
        $isOpenValue = ChallengeVariant::find($this->jurnalamal->challenge_variant_id)->is_manual_input;
        $this->jurnalamal->earned_score = ($isOpenValue == true) ? $this->jurnalamal->submitted_value : ChallengeVariant::find($this->jurnalamal->challenge_variant)->score;
    }


    public function rules(): array
    {
        return [
            'jurnalamal.date' => [
                'required',
            ],
            'jurnalamal.challenge_id' => [
                'required',
            ],
            'jurnalamal.challenge_variant_id' => [
                'required',
            ],
            'jurnalamal.submitted_value' => [
                'required',
            ],
            'jurnalamal.earned_score' => [
                'required',
            ],
            'jurnalamal.note' => [
                'nullable',
            ],
        ];
    }

    public function save(): void
    {
        $cekTantangan = ChallengeProgress::whereDate('date', $this->jurnalamal->date)
            ->where('challenge_id',$this->jurnalamal->challenge_id)
            ->whereUserId(Auth::id())
            ->whereNot('id', $this->jurnalamal->id)
            ->count();

        if ($cekTantangan > 0) {
            $this->modal = false;
            $this->info('Cek ulang di daftar tanggal ini.', 'Amalan sudah dilakukan');
        } else {
            $this->validate();

            $this->jurnalamal->user_id = Auth::id();
            $this->jurnalamal->save();

            $this->dispatch('updated');

            $this->resetExcept('date');

            $this->success('Data berhasil diubah', 'Sukses Edit');
        }
    }
}
