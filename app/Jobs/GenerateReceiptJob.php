<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Spatie\Browsershot\Browsershot;

class GenerateReceiptJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */

    protected $receipt;

    public function __construct($receipt)
    {
        $this->receipt = $receipt;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $path = "kwitansi/kwitansi-" . $this->receipt->uuid . ".pdf";
        $this->receipt->update([
            "receipt_doc" => $path
        ]);

        $html = view('pdf.receipt', ["receipt" => $this->receipt])->render();

        $pdf = Browsershot::html($html)
            ->setIncludedPath(config('services.browsershot.included_path'))
            ->showBackground()
            ->showBrowserHeaderAndFooter()
            ->headerHtml('<div></div>')
            ->footerHtml('<div style="text-align: left; font-size: 10px; width:100%; margin-left: 2.5cm; margin-bottom: 1cm;">*) Tarif produk/layanan tidak termasuk biaya admin transaksi <span style="font-style:italic;">user</span> aplikasi <span style="font-style:italic;">mobile</span>.</div>')
            ->pdf();


        Storage::put("public/$path", $pdf);
    }
}
