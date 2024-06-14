<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\ActivityLogger;
use Spatie\Activitylog\Traits\LogsActivity;

class Status extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $guarded = [];
    protected static $recordEvents = ['restored', 'created', 'updated'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'color', 'category'])
            ->dontLogIfAttributesChangedOnly(['deleted_at', 'updated_at'])
            ->setDescriptionForEvent(function (string $eventName) {
                $modelName = strtolower(class_basename($this));
                if ($eventName === 'created') {
                    return "menambah data {$modelName} baru";
                } elseif ($eventName === 'updated') {
                    return "memperbarui data {$modelName}";
                } elseif ($eventName === 'deleted') {
                    return "menghapus data {$modelName}";
                } elseif ($eventName === 'restored') {
                    return "memulihkan data {$modelName}";
                } else {
                    return "melakukan aksi {$eventName} pada data {$modelName}";
                }
            });
    }

}
