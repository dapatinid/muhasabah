<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'website_name',
        'phone',
        'info_event',
        'panduan_event',
        'grup_tercatat',
    ];

        protected $casts = [
        'grup_tercatat' => 'array',
    ];
}
