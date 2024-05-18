<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class SLA extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $table = "slas";
    protected $guarded = [];
    protected static $recordEvents = ['restored'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['code', 'partner_name', 'partner_phone_number', 'partner_pic', 'partner_pic_email', 'partner_pic_email', 'signature_name'])
            ->dontLogIfAttributesChangedOnly(['deleted_at', 'updated_at'])
            ->setDescriptionForEvent(function (string $eventName) {
                $modelName = strtoupper(class_basename($this));
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

    public function partner()
    {
        return $this->belongsTo(Partner::class, 'partner_id', 'id');
    }

    public function createdBy()
    {
        return $this->hasOne(User::class, 'id', 'created_by');
    }

    public function slaActivities()
    {
        return $this->hasMany(SlaActivity::class, 'sla_id', 'id');
    }
}
