<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class STPDEmployees extends Model
{
    use HasFactory;

    protected $table = 'stpd_employees';
    protected $guarded = [];
    public function stpd()
    {
        return $this->belongsTo(STPD::class);
    }
}
