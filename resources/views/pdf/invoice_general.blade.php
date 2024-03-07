<!-- resources/views/spd.blade.php -->

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>INVOICE LANGGANAN</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">


    <style>
        @page {
            margin-left: 1.5cm;
            margin-top: 1.5cm;
            margin-right: 1.5cm;
            margin-bottom: 1.5cm;
        }

        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');


        body {
            margin: 0px;
            padding: 0px;
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;

        }
    </style>
</head>

<body style="font-size: 10pt">

    @php
use Carbon\Carbon;
    @endphp
    <div class="flex justify-between items-center">
                    <header>
                            <div class="flex justify-between items-center" >
                                <div class="w-full flex flex-col text-purple-700">
                                    <img
                                        src="{{ public_path('assets\img\cazh.png')}}"
                                        alt=""
                                        class="float-left"
                                        style="width:40%; height: 40%"
                                    />

                                    <p class="mt-3">
                                        PT CAZH TEKNOLOGI INOVASI
                                    </p>
                                    <div class="leading-2 mt-2" style="width:80%; font-size: 8pt">
                                        Bonavida Park D1, Jl. Raya
                                        Karanggintung, Sumbang Banyumas, Jawa
                                        Tengah, 53183 | hello@cazh.id
                                    </div>
                                </div>
                                <div class="w-full text-right" >
                                    <h1 class="font-bold text-xl text-purple-800">
                                        INVOICE
                                    </h1>

                                    <div class="mt-4" style="font-size: 10pt; color: #666666">
                                        <p>{{$invoice_general->code}}</p>
                                        <p>
                                            Tanggal {{Carbon::parse($invoice_general->date)->format('d-m-Y')}}
                                            
                                        </p>
                                        <p>
                                            Jatuh Tempo {{Carbon::parse($invoice_general->due_date)->format('d-m-Y')}}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </header>
    </div>

    
    <hr style="height: 1px; margin: 1rem 0; background-color: #718096 !important; border: none;" />

    <div class="w-full text-left mt-5 leading-7" style="font-size: 10pt">
        <p>Ditagihkan Kepada:</p>
        <p class="font-bold">{{$invoice_general->partner_name}}</p>
        <p>{{json_decode($invoice_general->partner_regency)->name}},{{json_decode($invoice_general->partner_province)->name}}</p>
     
    </div>

                <div class="w-full mt-5">
                            <table class="w-full border" style="font-size: 8pt">
                                <thead class=" text-white text-center border" style="background-color: #674EA7">
                                    <th class="p-1 border" style="width: 15%">Produk</th>
                                    <th class="p-1 border" style="width: 25%">Deskripsi</th>
                                    <th class="p-1 border" style="width: 10%">Kuantitas</th>
                                    <th class="p-1 border" style="width: 15%">Harga Satuan</th>
                                    <th class="p-1 border" style="width: 15%">Jumlah Harga</th>
                                    <th class="p-1 border" style="width: 15%">Pajak</th>
                                </thead>
                                <tbody>
                                   

                                @foreach($products as $product)
                                            <tr  
                                                class="border p-1"
                                            >
                                                <td class="border p-1" style="width:15%">
                                                    {{ucwords($product['name'])}}
                                                </td>
                                                <td class="border p-1" style="width:25%">
                                                {{ucwords($product['description'])}}
                                                </td>
                                                <td class="border p-1 text-center" style="width:10%">
                                                {{$product['quantity']}}
                                                </td>
                                                <td class="border p-1 text-right" style="width:15%">
                                                    Rp{{number_format($product['price'], 0, ',', '.')}}
                                                </td>
                                                <td class="border p-1 text-right" style="width:15%">
                                                    Rp{{number_format($product['total'], 0, ',', '.')}}
                                                </td>
                                                <td class="border p-1 text-right" style="width:15%">
                                                    Rp{{number_format($product['total_ppn'], 0, ',', '.')}}
                                                </td>
                                            </tr>
                                        @endforeach
                                       
                                </tbody>
                            </table>
                        </div>

                        <div class="mt-5 w-full">
                                
                            <div class="flex flex-col leading-9 text-right">
                                <div class="flex justify-end">
                                    <p style="width: 20%">Total</p>
                                    <p style="width: 25%">Rp{{number_format($invoice_general['total_final_with_ppn'], 0, ',', '.')}}</p>
                                </div>
                                <div class="flex justify-end">
                                    <p style="width: 20%">PPN</p>
                                    <p style="width: 25%">Rp{{number_format($invoice_general['total_all_ppn'], 0, ',', '.')}}</p>
                                </div>
                                <div class="flex justify-end leading-6">
                                    <p style="width: 20%">Terbayar</p>
                                    <div style="width: 25%">
                                        <p>Rp{{number_format($invoice_general['paid_off'], 0, ',', '.')}}</p>
                                        <hr>
                                    </div>
                                </div>
                                <div class="flex justify-end font-bold">
                                    <p style="width: 20%">Sisa Tagihan</p>
                                    <p style="width: 25%">Rp{{number_format($invoice_general['rest_of_bill'], 0, ',', '.')}}</p>
                                </div>
                                </div>
                        </div>

                        @if($invoice_general->total_all_ppn == 0)
                        <div class="flex flex-col mt-5">
                            <p class="font-bold underline">Catatan</p>
                            <p>Catatan Pajak akan ditanggung dan dibayarkan oleh lembaga</p>
                            <p>secara mandiri.</p>
                        </div>
                        @endif

                        <div class="flex flex-row mt-10 justify-between items-center">
        <div style="width: 50%;" class="leading-6">
            
            @if($invoice_general->payment_metode == 'payment link')
            <p class="font-bold underline">Payment Link</p>
            <p>Pembayaran online* via link berikut:</p>
            <p><a href="{{$invoice_general->xendit_link}}" class="text-blue-600">{{$invoice_general->xendit_link}}</a></p>
            <p style="font-size: 8pt">*melalui m-Banking, ATM, QRIS, Minimarket dll.</p>
            @elseif($invoice_general->payment_metode == 'cazhbox')
            <p class="font-bold underline">Payment</p>
            <p>Pembayaran akan dilakukan dengan</p>
            <p>mengurangi <b>CazhBOX</b> lembaga Anda</p>
            @else
            <p class="font-bold underline">Payment</p>
            <p>Pembayaran akan dilakukan dengan {{$invoice_general->payment_metode}}</p>
            @endif

        </div>


        <div class="w-[30%]" style="width: 30%;">
            <p>{{\Carbon\Carbon::parse(now())->locale('id')->isoFormat(
    'D MMMM YYYY',
    'Do MMMM YYYY'
) }}</p>
            <div style="width: 130px; height: 130px; overflow: hidden;" class="py-2">

            <img src="{{ public_path("storage/$invoice_general->signature_image") }}" alt="" class="min-h-20 w-full"
            style="object-fit: cover; width:100%; height:100%;" />
            </div>
            <!-- <div style="min-height: 80px"></div> -->
            <p class="font-bold">{{$invoice_general->signature_name}}</p>
        </div>

    </div>


</body>

</html>