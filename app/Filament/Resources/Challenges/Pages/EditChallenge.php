<?php

namespace App\Filament\Resources\Challenges\Pages;

use App\Filament\Resources\Challenges\ChallengeResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditChallenge extends EditRecord
{
    protected static string $resource = ChallengeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }

    // protected function beforeValidate(): void
    // {
    //     $record = $this->record;
    //     dd($record->image);
    // }
}
