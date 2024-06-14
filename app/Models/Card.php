<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Models\Activity;
use Spatie\Activitylog\Traits\LogsActivity;

class Card extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $guarded = [];

    protected static $recordEvents = ['created', 'updated', 'restored'];

    protected static $logAttributes = [
        'partner.name',
        'status.name',
        'pcs',
        'price',
        'type',
        'total',
        'google_drive_link',
        'approval_date',
        'design_date',
        'print_date',
        'delivery_date',
        'arrive_date',
        'revision_detail'
    ];

    protected static $ignoreChangedAttributes = ['deleted_at', 'updated_at', 'thumbnail'];

    protected static $logOnlyDirty = true;

    protected static $logName = 'card';

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(static::$logAttributes)
            ->dontLogIfAttributesChangedOnly(static::$ignoreChangedAttributes)
            ->setDescriptionForEvent(function (string $eventName) {
                switch ($eventName) {
                    case 'created':
                        return "menambah data kartu baru";
                    case 'updated':
                        return "memperbarui data kartu";
                    case 'deleted':
                        return "menghapus data kartu";
                    case 'restored':
                        return "memulihkan data kartu";
                    default:
                        return "melakukan aksi {$eventName} pada data kartu";
                }
            });
    }

    public function tapActivity(Activity $activity, string $eventName)
    {
        $properties = $activity->properties->toArray();

        if ($eventName === 'updated') {
            $properties['old']['partner.name'] = $this->partner->name . " ";
            $properties['attributes']['partner.name'] = $this->partner->name;
        }

        $activity->properties = collect($properties);
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
