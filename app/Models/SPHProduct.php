<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SPHProduct extends Model
{
    use HasFactory;

    protected $table = 'sph_products';
    protected $guarded = [];

    public function product()
    {
        return $this->belongsTo(SPH::class, 'id', 'sph_id');
    }
}
