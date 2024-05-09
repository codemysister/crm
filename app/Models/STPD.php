<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class STPD extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;
    protected $table = 'stpd';
    protected $guarded = [];

    protected static $recordEvents = ['created', 'updated', 'restored'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['code', 'institution_name', 'institution_npwp', 'departure_date', 'return_date', 'transportation', 'accommodation', 'signature_name'])
            ->dontLogIfAttributesChangedOnly(['deleted_at', 'updated_at'])
            ->setDescriptionForEvent(function (string $eventName) {
                $modelName = strtolower(class_basename($this));
                if ($eventName === 'created') {
                    return "menambah data surat keterangan perjalanan dinas baru";
                } elseif ($eventName === 'updated') {
                    return "memperbarui data surat keterangan perjalanan dinas";
                } elseif ($eventName === 'deleted') {
                    return "meng data surat keterangan perjalanan dinas";
                } elseif ($eventName === 'restored') {
                    return "memulihkan data surat keterangan perjalanan dinas";
                } else {
                    return "melakukan aksi {$eventName} pada data surat keterangan perjalanan";
                }
            });
    }

    public function employees()
    {
        return $this->hasMany(STPDEmployees::class, 'stpd_id', 'id');
    }

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }

    public function createdBy()
    {
        return $this->hasOne(User::class, 'id', 'created_by');
    }
}
