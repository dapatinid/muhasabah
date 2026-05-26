<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    protected $fillable = [
        'paymentable_id', 'paymentable_type', 'status', 'link', 'image', 'notes', 
        'mutation_type', 'debit_akun', 'kredit_akun', 'payment_method',
        'currency', 'nominal_plus', 'nominal_mins', 'nominal', 'rekening', 'no_wa',
        'sapaan', 'atas_nama', 'user_id', 'created_by', 'updated_by', 'branch_id', 'date'
    ];

    protected $casts = [
        'date' => 'datetime',
    ];

    public function paymentable(): MorphTo
    {
        return $this->morphTo();
    }
    
}