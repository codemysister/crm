<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MOU extends Model
{
    use HasFactory;

    protected $table = "mous";

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
}
