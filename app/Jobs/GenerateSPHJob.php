<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class GenerateSPHJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $sph;
    protected $products;
    /**
     * Create a new job instance.
     */
    public function __construct($sph, $products)
    {
        $this->sph = $sph;
        $this->products = $products;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $path = "sph/sph-" . $this->sph->uuid . ".pdf";
        $this->sph->update([
            "sph_doc" => "storage/$path"
        ]);

        $pdf = PDF::loadView('pdf.sph', [
            "sph" => $this->sph,
            "products" => $this->products
        ]);

        $pdf->setPaper('a4', 'portrait');

        $pdfContent = $pdf->stream()->getOriginalContent();

        Storage::put("public/$path", $pdfContent);

    }
}
