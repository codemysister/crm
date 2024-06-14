<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Models\Activity;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Permission\Traits\HasRoles;

class Partner extends Authenticatable
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $guarded = [];

    protected static $recordEvents = ['created', 'updated', 'restored'];

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($lead) {

            if ($lead->isForceDeleting()) {
                $lead->sph()->get()->each(function ($sph) {
                    unlink($sph->sph_doc);
                    Activity::create([
                        'log_name' => 'force',
                        'description' => 'menghapus permanen data sph',
                        'subject_type' => get_class($sph),
                        'subject_id' => $sph->id,
                        'causer_type' => get_class(Auth::user()),
                        'causer_id' => Auth::user()->id,
                        "event" => "force",
                        'properties' => ["old" => ["code" => $sph->code, "partner_name" => $sph->partner_name, "partner_pic" => $sph->partner_pic, "sales_name" => $sph->sales_name, "sales_wa" => $sph->sales_wa, "sales_email" => $sph->sales_email]]
                    ]);
                    $sph->forceDelete();
                });

                $lead->mou()->get()->each(function ($mou) {
                    $mou->forceDelete();
                });
            } else {
                $lead->sph()->get()->each(function ($sph) {
                    Activity::create([
                        'log_name' => 'deleted',
                        'description' => 'menghapus data sph',
                        'subject_type' => get_class($sph),
                        'subject_id' => $sph->id,
                        'causer_type' => get_class(Auth::user()),
                        'causer_id' => Auth::user()->id,
                        "event" => "deleted",
                        'properties' => ["old" => ["code" => $sph->code, "partner_name" => $sph->partner_name, "partner_pic" => $sph->partner_pic, "sales_name" => $sph->sales_name, "sales_wa" => $sph->sales_wa, "sales_email" => $sph->sales_email]]
                    ]);

                    $sph->delete();
                });

                $lead->mou()->get()->each(function ($mou) {
                    $mou->delete();
                });
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
            ->logOnly(['name', 'npwp', 'password', 'phone_number', 'status.name', 'pic.name', 'bank.bank', 'bank.account_bank_name', 'bank.account_bank_number', 'sales.name', 'account_manager.name', 'onboarding_date', 'live_date', 'monitoring_date_after_3_month_live', 'province', 'regency', 'address', 'payment_metode', 'period'])
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

    public function account_manager()
    {
        return $this->belongsTo(User::class, 'account_manager_id', 'id');
    }


    public function pic()
    {
        return $this->hasOne(PartnerPIC::class);
    }

    public function bank()
    {
        return $this->hasOne(PartnerBank::class);
    }

    public function account()
    {
        return $this->hasOne(PartnerAccountSetting::class);
    }

    public function subscription()
    {
        return $this->hasOne(PartnerSubscription::class);
    }

    public function price_list()
    {
        return $this->hasOne(PartnerPriceList::class);
    }

    public function sph()
    {
        return $this->hasOne(SPH::class)->withTrashed();
    }

    public function mou()
    {
        return $this->hasOne(MOU::class)->withTrashed();
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
