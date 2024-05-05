<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class PartnerPriceList extends Model
{
    use HasFactory, LogsActivity;

    protected $table = "partner_price_lists";

    protected $guarded = [];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['price_card', 'price_lanyard', 'price_subscription_system', 'price_training_offline', 'price_training_online', 'fee_qris', 'fee_purchase_cazhpoin', 'fee_bill_cazhpoin', 'fee_topup_cazhpos', 'fee_withdraw_cazhpos', 'fee_bill_saldokartu'])
            ->dontLogIfAttributesChangedOnly(['deleted_at', 'updated_at'])
            ->setDescriptionForEvent(function (string $eventName) {
                if ($eventName === 'created') {
                    return "menambah data daftar harga baru";
                } else if ($eventName === 'updated') {
                    return "memperbarui data daftar harga";
                } else if ($eventName === 'deleted') {
                    return "menghapus data daftar harga";
                } else if ($eventName === 'restored') {
                    return "memulihkan data daftar harga";
                } else {
                    return "melakukan aksi {$eventName} pada data daftar harga";
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
