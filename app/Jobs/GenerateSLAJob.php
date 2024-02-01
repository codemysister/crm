<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Spatie\Browsershot\Browsershot;

class GenerateSLAJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    protected $sla;
    protected $activities;

    public function __construct($sla, $activities)
    {
        $this->sla = $sla;
        $this->activities = $activities;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $path = "sla/sla-" . $this->sla->uuid . ".pdf";

        $this->sla->update([
            "sla_doc" => "storage/$path"
        ]);

        $html = view('pdf.sla', ["sla" => $this->sla, 'activities' => $this->activities])->render();

        $pdf = Browsershot::html($html)
            ->setIncludedPath(config('services.browsershot.included_path'))
            ->showBackground()
            ->pdf();

        Storage::put("public/$path", $pdf);
    }

}


