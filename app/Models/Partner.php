<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Models\Activity;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Permission\Traits\HasRoles;

class Partner extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, LogsActivity;

    protected $guarded = [];

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($lead) {
            if ($lead->isForceDeleting()) {
                $lead->sph()->forceDelete();
                $lead->memo()->forceDelete();
                $lead->mou()->forceDelete();
            } else {
                $lead->sph()->delete();
                $lead->memo()->delete();
                $lead->mou()->delete();
            }
        });
    }

    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->note_status = $this->note_status;
    }


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'npwp', 'password', 'phone_number', 'status.name', 'status.color', 'sales.name', 'referral_name', 'account_manager.name', 'onboarding_date', 'live_date', 'monitoring_date_after_3_month_live', 'province', 'regency', 'address', 'payment_metode', 'period'])
            ->dontLogIfAttributesChangedOnly(['deleted_at', 'updated_at'])
            ->setDescriptionForEvent(function (string $eventName) {
                $modelName = class_basename($this);
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

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
    public function sales()
    {
        return $this->belongsTo(User::class, 'sales_id', 'id');
    }
    public function referral()
    {
        return $this->belongsTo(User::class, 'referral_id', 'id');
    }
    public function account_manager()
    {
        return $this->belongsTo(User::class, 'account_manager_id', 'id');
    }

    public function pics()
    {
        return $this->hasMany(PartnerPIC::class, 'partner_id', 'id');
    }

    public function banks()
    {
        return $this->hasMany(PartnerBank::class, 'partner_id', 'id');
    }

    public function accounts()
    {
        return $this->hasMany(PartnerAccountSetting::class, 'partner_id', 'id');
    }

    public function subscriptions()
    {
        return $this->hasMany(PartnerSubscription::class);
    }

    public function price_list()
    {
        return $this->hasOne(PartnerPriceList::class);
    }

    public function sph()
    {
        return $this->hasOne(SPH::class, 'lead_id', 'id')->withTrashed();
    }
    public function memo()
    {
        return $this->morphOne(Memo::class, 'memoable');
    }
    public function mou()
    {
        return $this->morphOne(MOU::class, 'mouable');
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function invoice_generals()
    {
        return $this->hasMany(InvoiceGeneral::class);
    }
    public function invoice_subscriptions()
    {
        return $this->hasMany(InvoiceSubscription::class);
    }
}
