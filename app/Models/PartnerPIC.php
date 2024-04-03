<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class PartnerPIC extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $table = 'partner_pic';
    protected $guarded = [];


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'partner.name', 'number', 'email', 'position'])
            ->dontLogIfAttributesChangedOnly(['deleted_at', 'updated_at'])
            ->setDescriptionForEvent(function (string $eventName) {
                if ($eventName === 'created') {
                    return "menambah data pic baru";
                } elseif ($eventName === 'updated') {
                    return "memperbarui data pic";
                } elseif ($eventName === 'deleted') {
                    return "menghapus data pic";
                } elseif ($eventName === 'restored') {
                    return "memulihkan data pic";
                } else {
                    return "melakukan aksi {$eventName} pada data pic";
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
