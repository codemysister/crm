<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Models\Activity;
use Spatie\Activitylog\Traits\LogsActivity;

class SPH extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;
    protected $table = 'sphs';
    protected $guarded = [];
    protected static $recordEvents = ['created', 'updated', 'restored'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['code', 'partner_name', 'partner_pic', 'sales_name', 'sales_wa', 'sales_email', 'signature_name'])
            ->dontLogIfAttributesChangedOnly(['deleted_at', 'updated_at'])
            ->setDescriptionForEvent(function (string $eventName) {
                $modelName = strtolower(class_basename($this));
                if ($eventName === 'created') {
                    return "menambah data {$modelName} baru";
                } elseif ($eventName === 'updated') {
                    return "memperbarui data {$modelName}";
                } elseif ($eventName === 'deleted') {
                    return "meng data {$modelName}";
                } elseif ($eventName === 'restored') {
                    return "memulihkan data {$modelName}";
                } else {
                    return "melakukan aksi {$eventName} pada data {$modelName}";
                }
            });
    }

    public function createdBy()
    {
        return $this->hasOne(User::class, 'id', 'created_by');
    }
    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }

    public function products()
    {
        return $this->hasMany(SPHProduct::class, 'sph_id', 'id');
    }
}

