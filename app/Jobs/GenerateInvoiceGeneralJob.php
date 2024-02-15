<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use PhpOffice\PhpWord\Element\Table;
use PhpOffice\PhpWord\SimpleType\TblWidth;

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
        $templateInvoice = 'assets/template/invoice_umum.docx';
        if ($this->invoice_general->total_all_ppn === 0) {
            if ($this->invoice_general->payment_metode === 'payment link') {
                $templateInvoice = 'assets/template/invoice_umum_tanpa_pajak_xendit.docx';
            } else if ($this->invoice_general->payment_metode === 'cazhbox') {
                $templateInvoice = 'assets/template/invoice_umum_tanpa_pajak_cazhbox.docx';
            } else {
                $templateInvoice = 'assets/template/invoice_umum_tanpa_pajak.docx';
            }
        } else {
            if ($this->invoice_general->payment_metode === 'payment link') {
                $templateInvoice = 'assets/template/invoice_umum_xendit.docx';
            } else if ($this->invoice_general->payment_metode === 'cazhbox') {
                $templateInvoice = 'assets/template/invoice_umum_cazhbox.docx';
            } else {
                $templateInvoice = 'assets/template/invoice_umum.docx';
            }
        }
        $phpWord = new \PhpOffice\PhpWord\TemplateProcessor($templateInvoice);
        $phpWord->setValues([
            'nomor_invoice' => $this->invoice_general->code,
            'tanggal_invoice' => $this->invoice_general->date->format('d-m-y H:i:s'),
            'jatuh_tempo' => $this->invoice_general->due_date->format('d-m-y H:i:s'),
            'nama_partner' => $this->invoice_general->partner_name,
            'provinsi' => $this->invoice_general->partner_province,
            'kabupaten' => $this->invoice_general->partner_regency,
            'nomor_hp' => $this->invoice_general->partner_phone_number,
            'sub_total' => $this->invoice_general->total,
            'ppn' => $this->invoice_general->total_all_ppn,
            'terbayar' => $this->invoice_general->paid_off,
            'tagihan' => $this->invoice_general->rest_of_bill,
            'xendit' => $this->invoice_general->xendit_link,
            'tanggal_dibuat' => $this->invoice_general->created_at->format('Y-m-d H:i:s'),
            'atas_nama' => $this->invoice_general->signature_name,
        ]);

        $table = new Table(
            array(
                'borderSize' => 8,
                'borderColor' => 'D9D2E9',
                'width' => 100 * 50,
                'alignment' => \PhpOffice\PhpWord\SimpleType\JcTable::CENTER,
                'layout' => \PhpOffice\PhpWord\Style\Table::LAYOUT_FIXED,
                'unit' => TblWidth::PERCENT
            )
        );
        $table->addRow(400);
        $pStyle = array('spaceAfter' => 20, 'align' => 'center');
        $table->addCell(3000, ['bgColor' => '#674EA7', 'valign' => 'center'])->addText('Produk', ['color' => 'FFFFFF', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);
        $table->addCell(1500, ['bgColor' => '#674EA7', 'valign' => 'center'])->addText('Kuantitas', ['color' => 'FFFFFF', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);
        $table->addCell(2000, ['bgColor' => '#674EA7', 'valign' => 'center'])->addText('Harga', ['color' => 'FFFFFF', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);
        $table->addCell(2000, ['bgColor' => '#674EA7', 'valign' => 'center'])->addText('Total Harga', ['color' => 'FFFFFF', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);
        $table->addCell(2000, ['bgColor' => '#674EA7', 'valign' => 'center'])->addText('PPN', ['color' => 'FFFFFF', 'name' => 'Inter', 'size' => 10, 'bold' => true], $pStyle);

        $values = $this->products->map(function ($product) {
            return ['produk' => $product->name, 'kuantitas' => $product->qty, 'harga' => $product->price, 'total' => $product->total, 'ppn' => $product->ppn !== 0 ? $product->ppn : "0 "];
        });


        foreach ($values as $key => $value) {
            $table->addRow(400);

            if ($key % 2 == 0) {
                $table->addCell(null, ['valign' => 'center'])->addText($value['produk'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'left']);
                $table->addCell(null, ['valign' => 'center'])->addText($value['kuantitas'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'center']);
                $table->addCell(null, ['valign' => 'center'])->addText("Rp" . $value['harga'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'right']);
                $table->addCell(null, ['valign' => 'center'])->addText("Rp" . $value['total'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'right']);
                $table->addCell(null, ['valign' => 'center'])->addText("Rp" . $value['ppn'], ['name' => 'Inter', 'size' => 10], ['spaceAfter' => 20, 'align' => 'right']);
            } else {
                $table->addCell(null, ['bgColor' => '#F3F3F3', 'valign' => 'center'])->addText($value['produk'], ['name' => 'Inter', 'size' => 10], ['align' => 'left']);
                $table->addCell(null, ['bgColor' => '#F3F3F3', 'valign' => 'center'])->addText($value['kuantitas'], ['name' => 'Inter', 'size' => 10], ['align' => 'center']);
                $table->addCell(null, ['bgColor' => '#F3F3F3', 'valign' => 'center'])->addText("Rp" . $value['harga'], ['name' => 'Inter', 'size' => 10], ['align' => 'right']);
                $table->addCell(null, ['bgColor' => '#F3F3F3', 'valign' => 'center'])->addText("Rp" . $value['total'], ['name' => 'Inter', 'size' => 10], ['align' => 'right']);
                $table->addCell(null, ['bgColor' => '#F3F3F3', 'valign' => 'center'])->addText("Rp" . $value['ppn'], ['name' => 'Inter', 'size' => 10], ['align' => 'right']);
            }

        }
        $phpWord->setComplexBlock('table', $table);

        $phpWord->setImageValue('tanda_tangan', array('path' => public_path($this->invoice_general->signature_image)));
        $fileName = $this->invoice_general->uuid . '.docx';
        $phpWord->saveAs(storage_path('invoice_umum/' . $fileName));
    }
}
