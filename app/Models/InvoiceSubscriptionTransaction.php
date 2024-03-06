<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceSubscriptionTransaction extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function invoice_subscription()
    {
        return $this->belongsTo(InvoiceSubscription::class);
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'created_by');
    }
}
