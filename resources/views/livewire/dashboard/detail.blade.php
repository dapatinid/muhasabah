<div class="p-3 space-y-3">

    <x-card>
        <div class="flex gap-3 justify-between items-center">
            <div class="block">
                <div class="text-xl font-bold">{{ $progressDetail[0]->challenge->title }}</div>
                <div>Total Score <span class="font-bold text-primary-500">{{ Illuminate\Support\Number::abbreviate($progressDetail->sum('earned_score')) }}</span></div>
            </div>
            <span>
                <img class="bg-cover bg-center size-10" src="{{ isset($progressDetail[0]->challenge->image) ? Str::replace('%2F', '/',url('storage', $progressDetail[0]->challenge->image)) : asset('storage/files/circle.png') }}" alt="{{ $progressDetail[0]->challenge->title }}">
            </span>
        </div>
    </x-card>    

    <x-tab selected="Jurnal Amal" scroll-on-mobile>
        <x-tab.items tab="Jurnal Amal">
            <x-slot:left>
                <x-icon name="book-open" class="w-5 h-5" />
            </x-slot:left>
                <div class="divide-y divide-gray-300 dark:divide-gray-800">
                @foreach ($progressDetail as $progDet)
                    <div class="flex justify-between items-center pt-2.5 pb-3">
                        <div class="block me-3">
                            <div class="flex gap-2 items-center"><span>{{ Carbon\Carbon::parse($progDet->date)->translatedFormat('Y M d • l') }}</span> <a wire:navigate.hover href="/jurnal-amal?datesort={{ Carbon\Carbon::parse($progDet->date)->translatedFormat('Y-m-d') }}"><x-icon name="arrow-top-right-on-square" class="size-5"/></a></div>
                            <div class="text-sm">{{ $progDet->challengeVariant->is_manual_input == true ? Illuminate\Support\Number::format($progDet->submitted_value, locale: 'de'). " " . $progDet->challengeVariant->name : $progDet->challengeVariant->name }}. {{ $progDet->note ? 'Note : '.$progDet->note : '' }}</div>
                        </div>
                        <div>
                            <x-badge :class="'text-center'">
                                <div class="block">
                                    <div>score</div>
                                    <div class="text-xl">{{ Illuminate\Support\Number::format($progDet->earned_score, locale: 'de') }}</div>
                                </div>
                            </x-badge>
                        </div>
                    </div>
                @endforeach
                </div>
        </x-tab.items>
        <x-tab.items tab="Deskripsi">
            <x-slot:left>
                <x-icon name="question-mark-circle" class="w-5 h-5" />
            </x-slot:left>
                <div class="text-sm">{{ $progressDetail[0]->challenge->description }}</div>
        </x-tab.items>
    </x-tab>




</div>
