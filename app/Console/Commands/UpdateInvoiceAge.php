<?php

namespace App\Console\Commands;

use App\Models\InvoiceGeneral;
use Illuminate\Console\Command;

class UpdateInvoiceAge extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-invoice-age';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update umur invoice';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $invoices = InvoiceGeneral::where('status', '!=', 'lunas')->get();
        foreach ($invoices as $invoice) {
            $age = $invoice->invoice_age + 1;
            if (now()->gt($invoice->due_date)) {
                $invoice->update(['invoice_age' => $age, 'status' => 'telat']);
            } else {
                $invoice->update(['invoice_age' => $age]);
            }
        }

        $this->info('Invoice age updated successfully.');
    }
}
