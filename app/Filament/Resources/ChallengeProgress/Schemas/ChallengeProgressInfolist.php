<?php

namespace App\Filament\Resources\ChallengeProgress\Schemas;

use App\Models\ChallengeProgress;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class ChallengeProgressInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('user.name')
                    ->numeric(),
                TextEntry::make('challenge_id')
                    ->numeric(),
                TextEntry::make('challenge_variant_id')
                    ->numeric(),
                TextEntry::make('submitted_value')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('earned_score')
                    ->numeric(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('deleted_at')
                    ->dateTime()
                    ->visible(fn (ChallengeProgress $record): bool => $record->trashed()),
            ]);
    }
}
