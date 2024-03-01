<?php

namespace App\Jobs;

use App\Imports\PartnerImport;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class PartnerImportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    protected $file_excel;
    public function __construct($path)
    {
        $this->file_excel = $path;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Your import logic here...
            Excel::import(new PartnerImport, Storage::disk('public')->get($this->file_excel));
        } catch (\Exception $e) {
            // Log the exception details
            \Log::error('Error processing PartnerImportJob: ' . $e->getMessage());
            // Rethrow the exception to mark the job as failed
            throw $e;
        }
    }
}
