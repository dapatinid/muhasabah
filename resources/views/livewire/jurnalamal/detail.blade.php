<div class="p-3 space-y-3">

    <x-card>
        <div class="flex gap-3 justify-between items-center">
            <span class="text-xl font-bold">Amalan {{ $progressDetail[0]->challenge->title }}</span>
            <span>
                <img class="bg-cover bg-center size-10" src="{{ isset($progressDetail[0]->challenge->image) ? Str::replace('%2F', '/',url('storage', $progressDetail[0]->challenge->image)) : asset('storage/files/circle.png') }}" alt="{{ $progressDetail[0]->challenge->title }}">
            </span>
        </div>
    </x-card>
    <x-card :class="'divide-y divide-secondary-500 space-y-3'">
        @foreach ($progressDetail as $progDet)
            <div class="flex justify-between pb-3">
                <div class="block">
                    <div>{{ Carbon\Carbon::parse($progDet->date)->translatedFormat('Y M d - l') }}</div>
                    <div>Note : {{ $progDet->note }}</div>
                </div>
                <div>
                    <x-badge :class="'text-center'">
                        <div class="block">
                            <div>score</div>
                            <div class="text-xl">{{ $progDet->earned_score }}</div>
                        </div>
                    </x-badge>
                </div>
            </div>
        @endforeach
    </x-card>
</div>
