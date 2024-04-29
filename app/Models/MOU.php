<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Models\Activity;
use Spatie\Activitylog\Traits\LogsActivity;

class MOU extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $table = "mous";

    protected $guarded = [];

    protected static $recordEvents = ['created', 'updated', 'restored'];


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['partner_name', 'partner_pic', 'url_subdomain', 'price_card', 'price_lanyard', 'price_subscription_system', 'period_subscription', 'price_training_offline', 'price_training_online', 'fee_qris', 'fee_purchase_cazhpoin', 'fee_bill_cazhpoin', 'fee_topup_cazhpos', 'fee_withdraw_cazhpos', 'fee_bill_saldokartu', 'bank', 'account_bank_number', 'account_bank_name', 'profit_sharing', 'signature_name'])
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


    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }
}
