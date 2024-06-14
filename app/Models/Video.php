<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Video extends Model
{
    use HasFactory, LogsActivity;

    // protected static $recordEvents = ['created', 'updated'];

    protected $guarded = [];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['title'])
            ->dontLogIfAttributesChangedOnly(['deleted_at', 'updated_at', 'video'])
            ->setDescriptionForEvent(function (string $eventName) {
                if ($eventName === 'created') {
                    return "menambah data video baru";
                } else if ($eventName === 'updated') {
                    return "memperbarui data video";
                } else if ($eventName === 'deleted') {
                    return "menghapus data video";
                } else if ($eventName === 'restored') {
                    return "memulihkan data video";
                } else {
                    return "melakukan aksi {$eventName} pada data video";
                }
            });
    }

    public function playlist()
    {
        return $this->belongsTo(Playlist::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
}
