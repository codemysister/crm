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
use Spatie\Browsershot\Browsershot;

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

        $html = view('pdf.sph', ["sph" => $this->sph, 'products' => $this->products])->render();

        $pdf = Browsershot::html($html)
            ->setIncludedPath(config('services.browsershot.included_path'))
            ->showBackground()
            ->showBackground()
                ->showBrowserHeaderAndFooter()
                ->headerHtml('<div></div>')
                ->footerHtml('<div style="text-align: left; font-size: 10px; width:100%; margin-left: 2.5cm; margin-bottom: 1cm;">*) Tarif produk/layanan tidak termasuk biaya admin transaksi <span style="font-style:italic;">user</span> aplikasi <span style="font-style:italic;">mobile</span>.</div>')
            ->pdf();


        Storage::put("public/$path", $pdf);

    }
}
