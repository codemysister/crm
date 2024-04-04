<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartnerSubscription extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
}
