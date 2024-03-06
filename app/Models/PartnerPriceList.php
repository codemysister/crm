<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartnerPriceList extends Model
{
    use HasFactory;

    protected $table = "partner_price_lists";

    protected $guarded = [];
    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }
}
