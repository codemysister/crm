<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Validation\Rules;
use Spatie\Activitylog\Models\Activity;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('User/Index');
    }

    public function apiGetUsers()
    {
        $usersDefault = User::with('roles')->latest()->get();
        $rolesDefault = Role::all();
        $usersDefault = $usersDefault->map(function ($user) {
            $role = $user->roles->first();
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'number' => $user->number,
                'role' => $role->name,
                'role_id' => $role->id,
                'created_at' => $user->created_at
            ];
        });

        return response()->json([
            'users' => $usersDefault,
            'roles' => $rolesDefault
        ]);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'number' => $request->number ? $request->number : null,
            'password' => Hash::make($request->password),
        ]);
        $user->assignRole($request->role["name"]);

        Activity::create([
            'log_name' => 'created',
            'description' => 'menambahkan data user',
            'subject_type' => get_class($user),
            'subject_id' => $user->id,
            'causer_type' => get_class(Auth::user()),
            'causer_id' => Auth::user()->id,
            "event" => "created",
            'properties' => ["attributes" => ["name" => $user->name, "email" => $user->email, "phone_number" => $user->phone_number, "role" => $request->role["name"]]]
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = User::with('roles')->findOrFail($id);
        if ($request->new_password) {
            $user->update(['password' => Hash::make($request->new_password)]);
        }
        Activity::create([
            'log_name' => 'updated',
            'description' => 'memperbaharui data user',
            'subject_type' => get_class($user),
            'subject_id' => $user->id,
            'causer_type' => get_class(Auth::user()),
            'causer_id' => Auth::user()->id,
            "event" => "updated",
            'properties' => ["old" => ["name" => $user->name, "email" => $user->email, "phone_number" => $user->phone_number, "role" => $user->roles->first()->name], "attributes" => ["name" => $request->name, "email" => $request->email, "phone_number" => $request->phone_number, "role" => $request->role]]
        ]);
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'number' => $request->number ? $request->number : null,
        ]);
        $user->syncRoles($request->role);


    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = User::with('roles')->find($id);
        Activity::create([
            'log_name' => 'deleted',
            'description' => 'menghapus data user',
            'subject_type' => get_class($user),
            'subject_id' => $user->id,
            'causer_type' => get_class(Auth::user()),
            'causer_id' => Auth::user()->id,
            "event" => "deleted",
            'properties' => ["old" => ["name" => $user->name, "email" => $user->email, "phone_number" => $user->phone_number, "role" => $user->roles->first()->name]]
        ]);
        $user->delete();
    }

    public function destroyForce($id)
    {
        $user = User::withTrashed()->with('roles')->where('id', $id)->first();

        Activity::create([
            'log_name' => 'force',
            'description' => 'menghapus permanen data user',
            'subject_type' => get_class($user),
            'subject_id' => $user->id,
            'causer_type' => get_class(Auth::user()),
            'causer_id' => Auth::user()->id,
            "event" => "force",
            'properties' => ["old" => ["name" => $user->name, "email" => $user->email, "phone_number" => $user->phone_number, "role" => $user->roles->first()->name]]
        ]);
        $user->forceDelete();
    }

    public function filter(Request $request)
    {
        $users = User::with('roles');

        if ($request->role) {
            $users->whereHas('roles', function ($query) use ($request) {
                $query->where('name', $request->role['name']);
            });
        }

        if ($request->input_date['start'] && $request->input_date['end']) {
            $users->whereBetween('created_at', [Carbon::parse($request->input_date['start'])->setTimezone('GMT+7')->startOfDay(), Carbon::parse($request->input_date['end'])->setTimezone('GMT+7')->endOfDay()]);
        }

        $users = $users->latest()->get();

        $users = $users->map(function ($user) {
            $role = $user->roles->first();
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'number' => $user->number,
                'role' => $role->name,
                'role_id' => $role->id,
                'created_at' => $user->created_at
            ];
        });

        return response()->json($users);
    }


    public function logFilter(Request $request)
    {
        $logs = Activity::with(['causer', 'subject'])->whereMorphedTo('subject', User::class);

        if ($request->user) {
            $logs->whereMorphRelation('causer', User::class, 'causer_id', '=', $request->user['id']);
        }

        if ($request->date['start'] && $request->date['end']) {
            $logs->whereBetween('created_at', [$request->date['start'], $request->date['end']]);
        }

        $logs = $logs->latest()->get();

        return response()->json($logs);
    }

    public function apiGetLogs()
    {
        $logs = Activity::with(['causer', 'subject'])
            ->whereMorphedTo('subject', User::class);

        $logs = $logs->latest()->get();

        return response()->json($logs);
    }

    public function destroyLogs(Request $request)
    {
        $ids = explode(",", $request->query('ids'));
        Activity::whereIn('id', $ids)->delete();
    }

    public function apiGetArsip()
    {
        $arsip = User::withTrashed()->with('roles')->whereNotNull('deleted_at')->latest()->get();
        $arsip = $arsip->map(function ($user) {
            $role = $user->roles->first();
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'number' => $user->number,
                'role' => $role->name,
                'role_id' => $role->id,
                'created_at' => $user->created_at
            ];
        });
        return response()->json($arsip);
    }

    public function arsipFilter(Request $request)
    {
        $arsip = User::withTrashed()->whereNotNull('deleted_at');

        if ($request->user) {
            $arsip->where('created_by', '=', $request->user['id']);
        }

        if ($request->delete_date['start'] && $request->delete_date['end']) {
            $arsip->whereBetween('deleted_at', [$request->delete_date['start'], $request->delete_date['end']]);
        }

        $arsip = $arsip->get();

        return response()->json($arsip);
    }

    public function restore($id)
    {
        DB::beginTransaction();
        try {
            $user = User::withTrashed()->where('id', '=', $id)->first();
            $user->restore();
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error restore user: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }
}
