<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceSubscriptionBill extends Model
{
    use HasFactory;

    protected $table = 'invoice_subscription_bills';
    protected $guarded = [];

    public function invoice_subscription()
    {
        return $this->belongsTo(InvoiceSubscription::class);
    }
}
