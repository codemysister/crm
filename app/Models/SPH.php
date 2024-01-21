<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SPH extends Model
{
    use HasFactory;
    protected $table = 'sphs';
    protected $guarded = [];

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'created_by');
    }

    public function products()
    {
        return $this->hasMany(SPHProduct::class, 'sph_id', 'id');
    }
}

