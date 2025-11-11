<?php

namespace App\Filament\Resources\ChallengeProgress\Pages;

use App\Filament\Resources\ChallengeProgress\ChallengeProgressResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditChallengeProgress extends EditRecord
{
    protected static string $resource = ChallengeProgressResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }
}
