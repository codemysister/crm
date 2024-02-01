<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SLA extends Model
{
    use HasFactory;

    protected $table = "slas";
    protected $guarded = [];

    public function partner()
    {
        return $this->belongsTo(Partner::class, 'partner_id', 'id');
    }

    public function activities()
    {
        return $this->hasMany(SlaActivity::class, 'sla_id', 'id');
    }
}
