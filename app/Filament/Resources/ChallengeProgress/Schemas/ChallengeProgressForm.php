<?php

namespace App\Filament\Resources\ChallengeProgress\Schemas;

use App\Models\ChallengeVariant;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Illuminate\Support\Collection;

class ChallengeProgressForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                DateTimePicker::make('date')
                    ->default(now())
                    ->required(),
                Select::make('user_id')
                    ->relationship(name: 'user', titleAttribute: 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                Select::make('challenge_id')
                    ->relationship(name: 'challenge', titleAttribute: 'title')
                    ->searchable()
                    ->preload()
                    ->required()
                    ->live(),
                Select::make('challenge_variant_id')
                    ->options(function (Get $get): Collection {
                        return ChallengeVariant::query()->orderBy('name', 'ASC')->where('challenge_id', $get('challenge_id'))->pluck('name', 'score');
                    })
                    ->searchable()
                    ->preload()
                    ->required(),
                TextInput::make('submitted_value')
                    ->numeric(),
                TextInput::make('earned_score')
                    ->required()
                    ->numeric(),
                TextInput::make('note'),
            ]);
    }
}
