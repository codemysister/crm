<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceGeneral extends Model
{
    use HasFactory;

    protected $table = 'invoice_generals';
    protected $guarded = [];

    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }

    public function products()
    {
        return $this->hasMany(InvoiceGeneralProducts::class);
    }

    public function transactions()
    {
        return $this->hasMany(InvoiceGeneralTransaction::class);
    }

}
