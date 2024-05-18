<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Playlist extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $guarded = [];

    protected static $recordEvents = ['created', 'updated', 'restored'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['title', 'description'])
            ->dontLogIfAttributesChangedOnly(['deleted_at', 'updated_at', 'thumbnail'])
            ->setDescriptionForEvent(function (string $eventName) {
                if ($eventName === 'created') {
                    return "menambah data playlist baru";
                } else if ($eventName === 'updated') {
                    return "memperbarui data playlist";
                } else if ($eventName === 'deleted') {
                    return "menghapus data playlist";
                } else if ($eventName === 'restored') {
                    return "memulihkan data playlist";
                } else {
                    return "melakukan aksi {$eventName} pada data playlist";
                }
            });
    }
    public function videos()
    {
        return $this->hasMany(Video::class);
    }


    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }


}
