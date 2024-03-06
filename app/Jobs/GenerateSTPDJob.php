<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Spatie\Browsershot\Browsershot;

class GenerateSTPDJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $stpd;
    protected $employees;

    /**
     * Create a new job instance.
     */
    public function __construct($stpd, $employees)
    {
        $this->stpd = $stpd;
        $this->employees = $employees;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $path = "stpd/stpd-" . $this->stpd->uuid . ".pdf";
        $this->stpd->update([
            "stpd_doc" => "storage/$path"
        ]);

        $html = view('pdf.stpd', ["stpd" => $this->stpd, "employees" => $this->employees])->render();

        $pdf = Browsershot::html($html)
            ->setIncludedPath(config('services.browsershot.included_path'))
            ->showBackground()
            ->pdf();


        Storage::put("public/$path", $pdf);


    }
}
