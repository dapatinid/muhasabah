<?php

namespace App\Filament\Resources\ChallengeProgress\Pages;

use App\Filament\Resources\ChallengeProgress\ChallengeProgressResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewChallengeProgress extends ViewRecord
{
    protected static string $resource = ChallengeProgressResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
