<!-- resources/views/spd.blade.php -->

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SURAT PENAWARAN HARGA</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">


    <style>
        @page {
            margin-left: 2.5cm;
            margin-top: 2cm;
            margin-right: 2.5cm;
            margin-bottom: 2cm;
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

<body class="text-base">

    <div class="flex justify-between items-center">
        <table>
            <tr>
                <td style="width:20%;">
                    <img src="{{ public_path('assets\img\cazh.png')}}" alt="Logo">
                </td>
                <td>
                    <div style="text-align:right">
                        <div class="font-bold" style="font-size: 8px; line-height: 10px">PT. CAZH TEKNOLOGI INOVASI
                        </div>
                        <div class="" style="font-size: 8px; line-height: 10px">Bonavida Park D1, Jl. Raya Karanggintung
                        </div>
                        <div class="" style="font-size: 8px; line-height: 10px">Kec. Sumbang, Kab. Banyumas, Jawa Tengah
                            53183</div>
                        <div class="" style="font-size: 8px; line-height: 10px">hello@cazh.id | https://cazh.id</div>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <div class="flex flex-col justify-center mt-10 text-center">
        <div class="font-bold underline text-2xl uppercase">Kwitansi</div>
        <div class="text-sm">Nomor : {{$receipt->code}}</div>
    </div>

    <div class="flex flex-col justify-start mt-6 text-left">

        <div class="flex w-full items-center my-1">
            <p class="text-sm" style="width:30%;">Telah Diterima Dari</p>
            <div class="w-full">
                <p class="text-sm py-1 pl-1">{{$receipt->partner_name}}</p>
                <hr class="bg-gray-50" style="height: 1px; width: 100%;" />
            </div>
        </div>

        <div class="flex w-full items-center my-1">
            <p class="text-sm" style="width:30%;">Uang Sebanyak</p>
            <div class="w-full">
                <p class="text-sm py-1 pl-1">{{$receipt->money}}</p>
                <hr class="bg-gray-50" style="height: 1px; width: 100%;" />
            </div>
        </div>
        <div class="flex w-full items-center my-1">
            <p class="text-sm" style="width:30%;">Untuk Pembayaran</p>
            <div class="w-full">
                <p class="text-sm py-1 pl-1">{{$receipt->payment_for}}</p>
                <hr class="bg-gray-50" style="height: 1px; width: 100%;" />
            </div>
        </div>

        <div class="flex w-full items-center my-1">
            <p class="text-sm" style="width:30%;">Metode Pembayaran</p>
            <div class="w-full">
                <p class="text-sm py-1 pl-1">{{$receipt->metode}}</p>
                <hr class="bg-gray-50" style="height: 1px; width: 100%;" />
            </div>
        </div>

    </div>

    <div class="flex justify-start mt-6 text-left">

        <div class="flex w-full flex-start my-1" style="width:24%">
            <p class="text-sm">Uang Sebanyak</p>
        </div>

        <div class="flex w-full flex-start my-1" style="width:40%">
            <p class="text-sm">Rp{{number_format($receipt->nominal, 0, ',', '.')}}</p>
        </div>

        <div class="flex w-full flex-start my-1" style="width: 40%">
            <div style="width: 100%">
                <p class="text-sm">Purwokerto, {{
    \Carbon\Carbon::parse(now())->locale('id')->isoFormat('D
                    MMMM YYYY',
        'Do MMMM YYYY'
    ) }}</p>
                <div style="width: 130px; height: 130px; overflow: hidden;">

                <img class="h-20 w-[15%]" style="width:100%; object-fit:cover;" src="{{ public_path("/storage/$receipt->signature_image")
                }}"
                alt="Signature">
            </div>
                <div class="text-sm">{{$receipt->signature_name}}</div>
                <div></div>
            </div>
        </div>
    </div>


</body>

</html>