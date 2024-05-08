<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class InvoiceGeneral extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $table = 'invoice_generals';
    protected $guarded = [];

    protected static $recordEvents = ['restored'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['code', 'institution_name', 'institution_npwp', 'date', 'due_date', 'invoice_age', 'bill_date', 'total', 'total_all_ppn', 'paid_off', 'rest_of_bill', 'signature_name'])
            ->dontLogIfAttributesChangedOnly(['deleted_at', 'updated_at'])
            ->setDescriptionForEvent(function (string $eventName) {
                $modelName = strtolower(class_basename($this));
                if ($eventName === 'created') {
                    return "menambah data invoice umum baru";
                } elseif ($eventName === 'updated') {
                    return "memperbarui data invoice umum";
                } elseif ($eventName === 'deleted') {
                    return "meng data invoice umum";
                } elseif ($eventName === 'restored') {
                    return "memulihkan data invoice umum";
                } else {
                    return "melakukan aksi {$eventName} pada data invoice umum";
                }
            });
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
        return $this->hasMany(InvoiceGeneralProducts::class);
    }

    public function transactions()
    {
        return $this->hasMany(InvoiceGeneralTransaction::class);
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }
    public function createdBy()
    {
        return $this->hasOne(User::class, 'id', 'created_by');
    }

}
