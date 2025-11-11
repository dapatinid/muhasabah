<?php

namespace App\Filament\Resources\ChallengeProgress\Pages;

use App\Filament\Resources\ChallengeProgress\ChallengeProgressResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListChallengeProgress extends ListRecords
{
    protected static string $resource = ChallengeProgressResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
