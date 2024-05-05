<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class PartnerBank extends Model
{
    use HasFactory, LogsActivity;

    protected $guarded = [];


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['bank', 'account_bank_number', 'account_bank_name'])
            ->dontLogIfAttributesChangedOnly(['deleted_at', 'updated_at'])
            ->setDescriptionForEvent(function (string $eventName) {
                if ($eventName === 'created') {
                    return "menambah data bank baru";
                } else if ($eventName === 'updated') {
                    return "memperbarui data bank";
                } else if ($eventName === 'deleted') {
                    return "menghapus data bank";
                } else if ($eventName === 'restored') {
                    return "memulihkan data bank";
                } else {
                    return "melakukan aksi {$eventName} pada data bank";
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
