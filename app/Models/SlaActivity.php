<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SlaActivity extends Model
{
    use HasFactory;
    protected $table = "sla_activities";
    protected $guarded = [];

    public function sla()
    {
        return $this->belongsTo(SLA::class, 'sla_id', 'id');
    }


}
