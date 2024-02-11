<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceGeneralProducts extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function invoiceGeneral()
    {
        return $this->belongsTo(InvoiceGeneral::class);
    }
}
