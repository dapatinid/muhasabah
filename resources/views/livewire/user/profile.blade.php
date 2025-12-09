<div @updated="$dispatch('name-updated', { name: $event.detail.name })" class="space-y-3 p-3 pt-6">
    
    <div class="relative mb-14">
        @if ($user->image != null)
            <a wire:navigate.hover href="/user/profile-akun" >
            <img src="{{ url('storage/'.$user->image) }}" alt="avatar" class="absolute z-20 left-1/2 transform -translate-x-1/2 object-cover text-center mx-auto size-[120px] rounded-full">
            </a>
        @else
            <a wire:navigate.hover href="/user/profile-akun" >
            <img src="{{ url('storage/avatar/user.png') }}" alt="avatar" class="absolute z-20 left-1/2 transform -translate-x-1/2 object-cover text-center mx-auto size-[120px] rounded-full">
            </a>
        @endif
    </div>

    <div class="mx-auto max-w-lg mb-4">
    <x-card>
        <div class="flex justify-end">
            <x-button href="/user/profile-akun" icon="pencil" wire:navigate.hover sm color="white">
                {{-- @lang('Edit') --}}
            </x-button>
        </div>  
        <div class="flex justify-center mt-6 text-2xl font-bold">
            {{ Auth::user()->name }}
        </div>      
        <div class="flex justify-center">
            {{ Auth::user()->email }}
        </div>      
        <div class="flex justify-center text-xs">
            {{ Auth::user()->phone }}
        </div>
        <div class="grid grid-cols-2 gap-3 mt-3">
            <x-badge color="blue">
                <div class="block p-1">
                    <div><span>Bergabung </span><span>📅</span></div>
                    <div class="text-base">{{ Carbon\Carbon::parse(Illuminate\Support\Facades\Auth::user()->created_at, 0, 10)->format('Y M d') }}</div>
                </div>
            </x-badge>
            <x-badge color="green" href="/dashboard" wire:navigate.hover class="cursor-pointer">
                <div class="block p-1">
                    <div><span>Total Catatan </span><span>📜</span></div>
                    <div class="text-xl">{{ App\Models\ChallengeProgress::where('user_id',Auth::id())->count() }}</div>
                </div>
            </x-badge>
        </div>  
    </x-card>
    </div>

    <div class="mx-auto max-w-lg mb-4">
    <x-card color="primary">
        <x-slot:header>
            <div class="flex justify-between px-3 py-2">
                <span class="pt-1">@lang('Data Diri')</span>
                <x-button href="/user/profile-data-diri" icon="pencil" wire:navigate.hover sm>
                    @lang('Edit')
                </x-button>
            </div>
        </x-slot:header>
        <div class="divide-y divide-dark-400">
            <div class="flex justify-between items-center gap-3 pb-2">
                <span>Gender</span>
                <span class="text-end">{{ Auth::user()->gender === 'P' ? 'Perempuan' : 'Laki-Laki' }}</span>
            </div>
            <div class="flex justify-between items-center gap-3 py-2">
                <span>Tempat Lahir</span>
                <span class="text-end">{{ Auth::user()->tempat_lahir }}</span>
            </div>
            <div class="flex justify-between items-center gap-3 py-2">
                <span>Tanggal Lahir</span>
                <span class="text-end">{{ Str::substr(Auth::user()->tanggal_lahir, 8, 2) }}-{{ Str::substr(Auth::user()->tanggal_lahir, 5, 2) }}-{{ Str::substr(Auth::user()->tanggal_lahir, 0, 4) }}</span>
            </div>
            <div class="flex justify-between items-center gap-3 py-2">
                <span>Golongan Darah</span>
                <span class="text-end">{{ Auth::user()->golongan_darah }}</span>
            </div>
            <div class="flex justify-between items-center gap-3 py-2">
                <span>Grup</span>
                <span class="text-end">{{ Auth::user()->grup ? Auth::user()->grup : '-'}}</span>
            </div>
            <div class="flex justify-between items-center gap-3 py-2">
                <span>No. ID</span>
                <span class="text-end">{{ Auth::user()->no_id ? Auth::user()->no_id : '-'}}</span>
            </div>
            <div class="flex justify-between items-center gap-3 py-2">
                <span>Foto ID</span>
                <span class="text-end">{{ Auth::user()->image_id ? '✅' : '-' }}</span>
            </div>
            <div class="flex justify-between items-center gap-3 pt-2">
                <span>Foto Profil</span>
                <span class="text-end">{{ Auth::user()->image ? '✅' : '-' }}</span>
            </div>
        </div>
    </x-card>
    </div>

    <div class="mx-auto max-w-lg mb-4">
    <x-card color="primary">
        <x-slot:header>
            <div class="flex justify-between px-3 py-2">
                <span class="pt-1">@lang('Alamat')</span>
                <x-button href="/user/profile-alamat" icon="pencil" wire:navigate.hover sm>
                    @lang('Edit')
                </x-button>
            </div>
        </x-slot:header>        
        <div class="divide-y divide-dark-400">
            <div class="flex justify-between items-center pb-2 gap-3">
                <span>Provinsi</span>
                <span class="text-end text-xs">{{ App\Models\Province::where('code',Auth::user()->state)->value('name') }}</span>
            </div>
            <div class="flex justify-between items-center py-2 gap-3">
                <span>Kabupaten</span>
                <span class="text-end text-xs">{{ App\Models\City::where('code',Auth::user()->city)->value('name') }}</span>
            </div>
            <div class="flex justify-between items-center py-2 gap-3">
                <span>Kecamatan</span>
                <span class="text-end text-xs">{{ App\Models\District::where('code',Auth::user()->district)->value('name') }}</span>
            </div>
            <div class="flex justify-between items-center py-2 gap-3">
                <span>Desa</span>
                <span class="text-end text-xs">{{ App\Models\Village::where('code',Auth::user()->village)->value('name') }}</span>
            </div>
            <div class="flex justify-between items-center py-2 gap-3">
                <span>Detail</span>
                <span class="text-end text-xs">{{ Auth::user()->street }}</span>
            </div>
            <div class="flex justify-between items-center pt-2 gap-3">
                <span>Kode Pos</span>
                <span class="text-end text-xs">{{ Auth::user()->zip_code ? Auth::user()->zip_code : '-'}}</span>
            </div>
        </div>
    </x-card>
    </div>
</div>
