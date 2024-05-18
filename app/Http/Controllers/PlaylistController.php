<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlaylistRequest;
use App\Models\Playlist;
use App\Models\User;
use App\Models\Video;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class PlaylistController extends Controller
{
    public function index()
    {
        $playlists = Playlist::with(['createdBy', 'videos'])->latest()->get();
        $usersProp = User::all();
        return Inertia::render('Playlist/Index', compact('playlists', 'usersProp'));
    }

    public function store(PlaylistRequest $request)
    {
        DB::beginTransaction();

        try {
            $pathThumbnail = null;
            if ($request->hasFile('thumbnail')) {
                $file = $request->file('thumbnail');
                $filename = time() . '.' . $file->getClientOriginalExtension();
                $pathThumbnail = "storage/images/thumbnail/" . $filename;
                Storage::putFileAs('public/images/thumbnail', $file, $filename);

            }

            $playlist = Playlist::create([
                'uuid' => Str::uuid(),
                'title' => $request->title,
                'slug' => Str::slug($request->title),
                'description' => $request->description,
                'thumbnail' => $pathThumbnail,
                'created_by' => Auth::user()->id
            ]);

            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error tambah playlist: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function update(PlaylistRequest $request, $uuid)
    {
        DB::beginTransaction();

        try {
            $playlist = Playlist::where('uuid', '=', $uuid)->first();

            if ($request->hasFile('thumbnail')) {
                Storage::delete('public/' . $playlist->thumbnail);
                $file = $request->file('thumbnail');
                $filename = time() . '_' . Auth::user()->id . '.' . $file->guessExtension();
                $pathThumbnail = 'storage/images/thumbnail/' . $filename;
                Storage::putFileAs('public/images/thumbnail', $file, $filename);
            } else {
                if ($request->thumbnail !== null) {
                    $pathThumbnail = $playlist->thumbnail;
                }
            }

            $playlist->update([
                'title' => $request->title,
                'slug' => Str::slug($request->title),
                'description' => $request->description,
                'thumbnail' => $pathThumbnail,
            ]);
            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error update playlist: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }



    public function destroy($uuid)
    {
        DB::beginTransaction();

        try {
            $playlist = Playlist::where('uuid', $uuid)->first();
            Activity::create([
                'log_name' => 'deleted',
                'description' => Auth::user()->name . ' hapus data playlist',
                'subject_type' => get_class($playlist),
                'subject_id' => $playlist->id,
                'causer_type' => get_class(Auth::user()),
                'causer_id' => Auth::user()->id,
                "event" => "deleted",
                'properties' => ["old" => ["title" => $playlist->title, "description" => $playlist->description]]
            ]);
            $playlist->delete();
            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error hapus playlist: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }
    public function destroyForce($uuid)
    {
        DB::beginTransaction();

        try {
            $playlist = Playlist::withTrashed()->with('videos')->where('uuid', $uuid)->first();
            Activity::create([
                'log_name' => 'force',
                'description' => Auth::user()->name . ' hapus data permanen playlist',
                'subject_type' => get_class($playlist),
                'subject_id' => $playlist->id,
                'causer_type' => get_class(Auth::user()),
                'causer_id' => Auth::user()->id,
                "event" => "force",
                'properties' => ["old" => ["title" => $playlist->title, "description" => $playlist->description]]
            ]);
            unlink($playlist->thumbnail);
            if (count($playlist->videos) > 0) {
                foreach ($playlist->videos as $video) {
                    unlink($video->video);
                }
            }
            $playlist->forceDelete();
            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error hapus permanen playlist: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function apiGetPlaylists()
    {
        $playlists = Playlist::with(['createdBy', 'videos.createdBy'])->latest()->get();
        return response()->json($playlists);
    }

    public function logFilter(Request $request)
    {
        $logs = Activity::with(['causer', 'subject'])->whereMorphedTo('subject', Playlist::class)->orWhereMorphedTo('subject', Video::class);

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
            ->whereMorphedTo('subject', Playlist::class)->orWhereMorphedTo('subject', Video::class);

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
        $arsip = Playlist::withTrashed()->with(['createdBy', 'videos'])->whereNotNull('deleted_at')->latest()->get();
        return response()->json($arsip);
    }

    public function arsipFilter(Request $request)
    {
        $arsip = Playlist::withTrashed()->with(['createdBy', 'videos'])->whereNotNull('deleted_at');

        if ($request->user) {
            $arsip->where('created_by', '=', $request->user['id']);
        }

        if ($request->delete_date['start'] && $request->delete_date['end']) {
            $arsip->whereBetween('deleted_at', [$request->delete_date['start'], $request->delete_date['end']]);
        }

        $arsip = $arsip->get();

        return response()->json($arsip);
    }

    public function restore($uuid)
    {
        DB::beginTransaction();
        try {
            $playlist = Playlist::withTrashed()->where('uuid', '=', $uuid)->first();
            $playlist->restore();
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error restore playlist: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

}
