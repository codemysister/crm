<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class STPD extends Model
{
    use HasFactory;
    protected $table = 'stpd';
    protected $guarded = [];
    public function employees()
    {
        return $this->hasMany(STPDEmployees::class, 'stpd_id', 'id');
    }
}
