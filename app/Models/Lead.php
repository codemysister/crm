<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Models\Activity;
use Spatie\Activitylog\Traits\LogsActivity;

class Lead extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $guarded = [];
    protected static $recordEvents = ['created', 'restored'];


    // protected static function boot()
    // {
    //     parent::boot();

    //     static::deleting(function ($lead) {

    //         if ($lead->isForceDeleting()) {
    //             $lead->sph()->get()->each(function ($sph) {
    //                 unlink($sph->sph_doc);
    //                 Activity::create([
    //                     'log_name' => 'force',
    //                     'description' => 'menghapus permanen data sph',
    //                     'subject_type' => get_class($sph),
    //                     'subject_id' => $sph->id,
    //                     'causer_type' => get_class(Auth::user()),
    //                     'causer_id' => Auth::user()->id,
    //                     "event" => "force",
    //                     'properties' => ["old" => ["code" => $sph->code, "partner_name" => $sph->partner_name, "partner_pic" => $sph->partner_pic, "sales_name" => $sph->sales_name, "sales_wa" => $sph->sales_wa, "sales_email" => $sph->sales_email]]
    //                 ]);
    //                 $sph->forceDelete();
    //             });

    //             $lead->mou()->get()->each(function ($mou) {
    //                 $mou->forceDelete();
    //             });
    //         } else {
    //             $lead->sph()->get()->each(function ($sph) {
    //                 Activity::create([
    //                     'log_name' => 'deleted',
    //                     'description' => 'menghapus data sph',
    //                     'subject_type' => get_class($sph),
    //                     'subject_id' => $sph->id,
    //                     'causer_type' => get_class(Auth::user()),
    //                     'causer_id' => Auth::user()->id,
    //                     "event" => "deleted",
    //                     'properties' => ["old" => ["code" => $sph->code, "partner_name" => $sph->partner_name, "partner_pic" => $sph->partner_pic, "sales_name" => $sph->sales_name, "sales_wa" => $sph->sales_wa, "sales_email" => $sph->sales_email]]
    //                 ]);

    //                 $sph->delete();
    //             });

    //             $lead->mou()->get()->each(function ($mou) {
    //                 $mou->delete();
    //             });
    //         }
    //     });
    // }


    public function tapActivity(Activity $activity, string $eventName)
    {
        $properties = $activity->properties->toArray();

        if ($eventName === 'updated') {
            $properties['old']['name'] = $this->name . " ";
            $properties['attributes']['name'] = $this->name;
            $properties['attributes']['note_status'] = $this->note_status;
        }

        $activity->properties = collect($properties);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'npwp', 'address', 'pic', 'total_members', 'status.name', 'status.color'])
            ->dontLogIfAttributesChangedOnly(['deleted_at', 'updated_at'])
            ->setDescriptionForEvent(function (string $eventName) {
                $modelName = strtolower(class_basename($this));
                if ($eventName === 'created') {
                    return "menambah data {$modelName} baru";
                } else if ($eventName === 'updated') {
                    return "memperbarui data {$modelName}";
                } else if ($eventName === 'deleted') {
                    return "menghapus data {$modelName}";
                } else if ($eventName === 'restored') {
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


    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function sph()
    {
        return $this->hasOne(SPH::class, 'lead_id', 'id')->withTrashed();
    }


    public function mou()
    {
        return $this->hasOne(MOU::class, 'lead_id', 'id')->withTrashed();
    }
}
