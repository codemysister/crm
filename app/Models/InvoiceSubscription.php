<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceSubscription extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function bills()
    {
        return $this->hasMany(InvoiceSubscriptionBill::class);
    }

    public function partner()
    {
        return $this->belongsTo(Partner::class, 'partner_id', 'id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    public function transactions()
    {
        return $this->hasMany(InvoiceSubscriptionTransaction::class, 'invoice_id', 'id');
    }
}
