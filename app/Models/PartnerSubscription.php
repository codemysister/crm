<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class PartnerSubscription extends Model
{
    use HasFactory, LogsActivity;

    protected $guarded = [];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['bill', 'nominal', 'ppn', 'total_ppn', 'total_bill'])
            ->dontLogIfAttributesChangedOnly(['deleted_at', 'updated_at'])
            ->setDescriptionForEvent(function (string $eventName) {
                if ($eventName === 'created') {
                    return "menambah data langganan baru";
                } else if ($eventName === 'updated') {
                    return "memperbarui data langganan";
                } else if ($eventName === 'deleted') {
                    return "menghapus data langganan";
                } else if ($eventName === 'restored') {
                    return "memulihkan data langganan";
                } else {
                    return "melakukan aksi {$eventName} pada data langganan";
                }
            });
    }

    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
}
