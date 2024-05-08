<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;

class InvoiceGeneralTransaction extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected static $recordEvents = ['restored'];

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'created_by');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['invoiceGeneral.code', 'code', 'partner_name', 'date', 'due_date', 'nominal', 'money', 'method', 'payment_for', 'signature_name'])
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

    public function invoiceGeneral()
    {
        return $this->belongsTo(InvoiceGeneral::class);
    }
}
