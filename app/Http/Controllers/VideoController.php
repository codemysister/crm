<?php

namespace App\Http\Controllers;

use App\Http\Requests\VideoRequest;
use App\Models\Video;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class VideoController extends Controller
{
    public function store(VideoRequest $request)
    {
        DB::beginTransaction();

        try {

            $pathVideo = null;
            if ($request->hasFile('video')) {
                $file = $request->file('video');
                $filename = time() . '.' . $file->getClientOriginalExtension();
                $pathVideo = "storage/video/" . $filename;
                Storage::putFileAs('public/video', $file, $filename);

            }

            $video = Video::create([
                'uuid' => Str::uuid(),
                'playlist_id' => $request->playlist_id,
                'title' => $request->title,
                'slug' => Str::slug($request->title),
                'video' => $pathVideo,
                'created_by' => Auth::user()->id
            ]);

            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error tambah video: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function update(VideoRequest $request, $uuid)
    {
        DB::beginTransaction();

        try {
            $video = Video::where('uuid', '=', $uuid)->first();

            if ($request->hasFile('video')) {
                Storage::delete('public/' . $video->video);
                $file = $request->file('video');
                $filename = time() . '_' . Auth::user()->id . '.' . $file->guessExtension();
                $pathVideo = 'storage/video/' . $filename;
                Storage::putFileAs('public/video', $file, $filename);
            } else {
                if ($request->video !== null) {
                    $pathVideo = $video->video;
                }
            }

            $video->update([
                'title' => $request->title,
                'slug' => Str::slug($request->title),
                'video' => $pathVideo,
            ]);
            DB::commit();

        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error update video: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function destroy($uuid)
    {
        $video = Video::where('uuid', $uuid)->first();
        unlink($video->video);
        $video->delete();
    }
}
