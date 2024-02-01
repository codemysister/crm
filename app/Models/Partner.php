<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class Partner extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $guarded = [];

    public function sales()
    {
        return $this->belongsTo(User::class, 'sales_id', 'id');
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

    public function subscription()
    {
        return $this->hasOne(PartnerSubscription::class);
    }
}
