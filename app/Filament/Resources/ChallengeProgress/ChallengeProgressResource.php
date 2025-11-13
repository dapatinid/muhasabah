<?php

namespace App\Filament\Resources\ChallengeProgress;

use App\Filament\Resources\ChallengeProgress\Pages\CreateChallengeProgress;
use App\Filament\Resources\ChallengeProgress\Pages\EditChallengeProgress;
use App\Filament\Resources\ChallengeProgress\Pages\ListChallengeProgress;
use App\Filament\Resources\ChallengeProgress\Pages\ViewChallengeProgress;
use App\Filament\Resources\ChallengeProgress\Schemas\ChallengeProgressForm;
use App\Filament\Resources\ChallengeProgress\Schemas\ChallengeProgressInfolist;
use App\Filament\Resources\ChallengeProgress\Tables\ChallengeProgressTable;
use App\Models\ChallengeProgress;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ChallengeProgressResource extends Resource
{
    protected static ?string $model = ChallengeProgress::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::PresentationChartLine;

    protected static ?string $recordTitleAttribute = 'JurnalAmal';
    protected static ?string $navigationLabel = 'Jurnal Amal';
    protected ?string $heading = 'Jurnal Amal';
    protected static ?string $slug = 'jurnal-amal';

    public static function form(Schema $schema): Schema
    {
        return ChallengeProgressForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return ChallengeProgressInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ChallengeProgressTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListChallengeProgress::route('/'),
            'create' => CreateChallengeProgress::route('/create'),
            'view' => ViewChallengeProgress::route('/{record}'),
            'edit' => EditChallengeProgress::route('/{record}/edit'),
        ];
    }

    public static function getRecordRouteBindingEloquentQuery(): Builder
    {
        return parent::getRecordRouteBindingEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
