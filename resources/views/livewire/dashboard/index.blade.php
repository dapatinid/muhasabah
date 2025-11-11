<div class="space-y-3 p-3">

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        @foreach ($challenge as $ja)
        <div
            wire:key="card-{{ $ja->id }}"
            @if ($ja->progresses->where('user_id',Auth::id())->sum('earned_score') != 0)                
            href="{{ route('jurnalamal.detail',  $ja->id )}}"  wire:navigate.hover class="cursor-pointer p-3 rounded-md select-none dark:text-white ring-0 shadow bg-white dark:bg-gray-900"
            @endif
            class="p-3 rounded-md select-none dark:text-white ring-0 shadow bg-white dark:bg-gray-900"
        >
            <div class="flex flex-nowrap justify-between items-center">
                <div class="flex items-center gap-2">
                    <div class="relative ">
                        <img class="bg-cover bg-center size-10" src="{{ isset($ja->image) ? Str::replace('%2F', '/',url('storage', $ja->image)) : asset('storage/files/circle.png') }}" alt="{{ $ja->title }}">
                    </div>
                    <div class="block items-center">
                        <input type="checkbox" value="{{ $ja->id }}" wire:model="selected" x-model="checked" class="hidden">
                        <div class="font-bold select-none leading-4">{{ $ja->title }}</div>                          
                        <div class="text-xs select-none">
                            {{ $ja->difficulty  }}
                        </div>
                    </div>
                </div>

                <div class="flex justify-end items-center">
                    {{-- <span class="me-2">{{ '✦' }}</span> --}}
                    <x-badge text="{{ $ja->progresses->where('user_id',Auth::id())->sum('earned_score') }}" color="{{ $ja->progresses->where('user_id',Auth::id())->sum('earned_score') == 0 ? 'red' : 'cyan' }}" light md/>
                </div>
            </div>
        </div>
        @endforeach
    </div>



</div>
