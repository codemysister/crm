<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, SoftDeletes, HasFactory, Notifiable, HasRoles, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'number',
        'profile_picture',
        'signature'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected static $recordEvents = ['restored'];


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'email', 'number'])
            ->dontLogIfAttributesChangedOnly(['deleted_at', 'updated_at', 'password'])
            ->setDescriptionForEvent(function (string $eventName) {
                if ($eventName === 'created') {
                    return "menambah data user baru";
                } else if ($eventName === 'updated') {
                    return "memperbarui data user";
                } else if ($eventName === 'deleted') {
                    return "menghapus data user";
                } else if ($eventName === 'restored') {
                    return "memulihkan data user";
                } else {
                    return "melakukan aksi {$eventName} pada data user";
                }
            });
    }

    public function partners()
    {
        return $this->hasMany(Partner::class);
    }

    public function partnerProfiles()
    {
        return $this->hasOne(Partner::class);
    }

    public function slaActivity()
    {
        return $this->hasMany(SlaActivity::class, 'user_id', 'id');
    }

    public function position()
    {
        return $this->roles;
    }

}
