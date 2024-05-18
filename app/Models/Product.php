<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Product extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $guarded = [];

    protected static $recordEvents = ['created', 'updated', 'restored'];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'category', 'price', 'unit', 'description'])
            ->dontLogIfAttributesChangedOnly(['deleted_at', 'updated_at', 'thumbnail'])
            ->setDescriptionForEvent(function (string $eventName) {
                if ($eventName === 'created') {
                    return "menambah data produk baru";
                } else if ($eventName === 'updated') {
                    return "memperbarui data produk";
                } else if ($eventName === 'deleted') {
                    return "menghapus data produk";
                } else if ($eventName === 'restored') {
                    return "memulihkan data produk";
                } else {
                    return "melakukan aksi {$eventName} pada data produk";
                }
            });
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
}
