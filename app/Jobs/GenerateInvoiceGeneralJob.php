<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpWord\Element\Table;
use PhpOffice\PhpWord\SimpleType\TblWidth;
use Spatie\Browsershot\Browsershot;

class GenerateInvoiceGeneralJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $invoice_general;
    protected $products;
    /**
     * Create a new job instance.
     */
    public function __construct($invoice_general, $products)
    {
        $this->invoice_general = $invoice_general;
        $this->products = $products;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $path = "invoice_umum/invoice_umum-" . $this->invoice_general->uuid . ".pdf";

            $this->invoice_general->update([
                "invoice_general_doc" => $path
            ]);

            $html = view('pdf.invoice_general', ["invoice_general" => $this->invoice_general, "products" => $this->products])->render();

            $pdf = Browsershot::html($html)
                ->setIncludedPath(config('services.browsershot.included_path'))
                ->showBackground()
                ->pdf();


            Storage::put("public/$path", $pdf);

        } catch (\Exception $exception) {
            $this->report($exception);
        }
    }
}
