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

class GenerateMOUJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    protected $mou;

    public function __construct($mou)
    {
        $this->mou = $mou;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $path = "mou/mou-" . $this->mou->uuid . ".pdf";


            $this->mou->update([
                "mou_doc" => "storage/$path"
            ]);



            $html = view('pdf.mou', ["mou" => $this->mou])->render();

            $pdf = Browsershot::html($html)
                ->setIncludedPath(config('services.browsershot.included_path'))
                ->showBackground()
                ->headerHtml('<div></div>')
                ->footerHtml('<div style="text-align: right; font-style: italic; font-size: 10px; width:100%; margin-right: 2.5cm; margin-bottom: 1cm;">Perjanjian Kerjasama CAZH | <span class="pageNumber"></span>  </div>')
                ->showBrowserHeaderAndFooter()
                ->pdf();


            Storage::put("public/$path", $pdf);

        } catch (\Exception $exception) {
            // Tangkap pengecualian dan laporkan error
            $this->report($exception);
        }
    }

    public function report(\Exception $exception)
    {
        // Log error menggunakan Log::error atau metode lainnya
        Log::error('Error in the job: ' . $exception->getMessage());
    }
}


