<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class PartnerAccountSetting extends Model
{
    use HasFactory, LogsActivity;

    protected $table = 'partner_account_settings';
    protected $guarded = [];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['subdomain', 'email_super_admin', 'password'])
            ->dontLogIfAttributesChangedOnly(['deleted_at', 'updated_at'])
            ->setDescriptionForEvent(function (string $eventName) {
                if ($eventName === 'created') {
                    return "menambah data akun baru";
                } elseif ($eventName === 'updated') {
                    return "memperbarui data akun";
                } elseif ($eventName === 'deleted') {
                    return "menghapus data akun";
                } elseif ($eventName === 'restored') {
                    return "memulihkan data akun";
                } else {
                    return "melakukan aksi {$eventName} pada data akun";
                }
            });
    }

    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
}
