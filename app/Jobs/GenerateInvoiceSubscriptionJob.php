<?php

namespace App\Jobs;

use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Spatie\Browsershot\Browsershot;

class GenerateInvoiceSubscriptionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $invoice_subscription;
    protected $bills;

    /**
     * Create a new job instance.
     */
    public function __construct($invoice_subscription, $bills)
    {
        $this->invoice_subscription = $invoice_subscription;
        $this->bills = $bills;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $path = "invoice_langganan/invoice_langganan-" . $this->invoice_subscription->uuid . ".pdf";

            $this->invoice_subscription->update([
                "invoice_subscription_doc" => $path
            ]);

            $html = view('pdf.invoice_subscription', ["invoice_subscription" => $this->invoice_subscription, "bills" => $this->bills])->render();

            $pdf = Browsershot::html($html)
                ->setIncludedPath(config('services.browsershot.included_path'))
                ->showBackground()
                ->pdf();

            Storage::put("public/$path", $pdf);
        } catch (Exception $exception) {
            info($exception->getMessage());
        }
    }
}
