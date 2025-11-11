<?php

namespace App\Filament\Resources\Challenges\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Repeater\TableColumn;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Auth;

class ChallengeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required(),
                Textarea::make('description')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('difficulty')
                    ->required()
                    ->default('easy'),

                FileUpload::make('image')
                    ->image()
                    ->imageEditor()
                    ->maxSize(4000)
                    ->disk('public')
                    ->directory('challenge'),

                Hidden::make('created_by')
                    ->default(fn() => Auth::user()->id),
                Hidden::make('updated_by')
                    ->default(fn() => Auth::user()->id),


                    Repeater::make('challengevariant')
                        ->hiddenLabel()
                        ->relationship()
                        ->schema([

                            Grid::make([
                                'default' => 2,
                                'sm' => 4,
                            ])
                            ->schema([
                                    TextInput::make('name')
                                        ->required(),
                                    Toggle::make('is_manual_input')
                                        ->extraAttributes([
                                            'class' => 'flex justify-center', // Centers the toggle horizontally
                                        ])
                                        ->label('Open Value?'),
                                    TextInput::make('minimum_value')
                                        ->default(null),
                                    TextInput::make('score')
                                        ->default(0),                
                                    Hidden::make('created_by')
                                        ->required()
                                        ->default(Auth::id()),
                                    Hidden::make('updated_by')
                                        ->required()
                                        ->default(Auth::id()),
                            ])
                            
                        ])
                        ->columnSpanFull()


            ]);
    }
}
