<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Card extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $guarded = [];

    protected static $recordEvents = ['created', 'updated', 'restored'];


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['partner.name', 'status.name', 'pcs', 'price', 'type', 'total', 'google_drive_link', 'approval_date', 'design_date', 'print_date', 'delivery_date'])
            ->dontLogIfAttributesChangedOnly(['deleted_at', 'updated_at', 'thumbnail'])
            ->setDescriptionForEvent(function (string $eventName) {
                if ($eventName === 'created') {
                    return "menambah data kartu baru";
                } else if ($eventName === 'updated') {
                    return "memperbarui data kartu";
                } else if ($eventName === 'deleted') {
                    return "menghapus data kartu";
                } else if ($eventName === 'restored') {
                    return "memulihkan data kartu";
                } else {
                    return "melakukan aksi {$eventName} pada data kartu";
                }
            });
    }

    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }
    public function createdBy()
    {
        return $this->belongsTo("App\\Models\User", 'created_by', 'id');
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }
}
