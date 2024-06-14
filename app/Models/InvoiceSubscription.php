<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class InvoiceSubscription extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $guarded = [];

    protected static $recordEvents = ['created', 'updated', 'restored'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['code', 'partner_name', 'partner_npwp', 'date', 'due_date', 'invoice_age', 'bill_date', 'total', 'total_all_ppn', 'paid_off', 'rest_of_bill', 'signature_name'])
            ->dontLogIfAttributesChangedOnly(['deleted_at', 'updated_at'])
            ->setDescriptionForEvent(function (string $eventName) {
                $modelName = strtolower(class_basename($this));
                if ($eventName === 'created') {
                    return "menambah data invoice langganan baru";
                } elseif ($eventName === 'updated') {
                    return "memperbarui data invoice langganan";
                } elseif ($eventName === 'deleted') {
                    return "meng data invoice langganan";
                } elseif ($eventName === 'restored') {
                    return "memulihkan data invoice langganan";
                } else {
                    return "melakukan aksi {$eventName} pada data invoice langganan";
                }
            });
    }

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

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function createdBy()
    {
        return $this->hasOne(User::class, 'id', 'created_by');
    }
}
