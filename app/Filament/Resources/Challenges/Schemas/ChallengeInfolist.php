<?php

namespace App\Filament\Resources\Challenges\Schemas;

use App\Models\Challenge;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class ChallengeInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('title'),
                TextEntry::make('description')
                    ->columnSpanFull(),
                TextEntry::make('difficulty'),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('deleted_at')
                    ->dateTime()
                    ->visible(fn (Challenge $record): bool => $record->trashed()),
            ]);
    }
}
