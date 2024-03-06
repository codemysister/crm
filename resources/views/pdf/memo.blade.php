<!-- resources/views/spd.blade.php -->

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SURAT KETERANGAN PERJALANAN DINAS</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <!-- @vite('resources/css/app.css') -->
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

<body class="text-sm">

<div class="flex justify-between items-center">
        <table>
            <tr>
                <td style="width:20%;">
                    <img src="{{ public_path('assets\img\cazh.png')}}" alt="Logo">
                </td>
                <td>
                    <div style="text-align:right">
                        <div class="font-bold" style="font-size: 10px; line-height: 14px">PT. CAZH TEKNOLOGI INOVASI
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

    <div class="flex flex-col justify-center mt-8 text-center">
        <div class="font-bold text-sm">
            MEMO INTERNAL
        </div>
        <div class="font-bold text-sm">
            PENGAJUAN DEVIASI HARGA
        </div>
        <div class="text-xs">No: {{$memo->code}}</div>
    </div>

    <hr style="height: 1px; margin: 1rem 0; background-color: #718096 !important; border: none;" />

    <div class="text-justify w-full mt-5">
        <p>Bersama memo ini, kami menyampaikan pengajuan deviasi harga Cetak kartu / E - Card / Biaya langganan* Standard Retail Price (SRP), untuk {{$memo->partner_name}} dengan detail sebagai berikut :</p>
    </div>

    <div class="w-full mt-5 mx-10">
        <ol class="list-decimal">
            <li class="w-full">
                <div class="flex w-full">
                <p style="width:20%">Harga cetak kartu</p>
                <p>{{$memo->price_card}}</p>
                </div>
            </li>
            <li class="w-full">
                <div class="flex w-full">
                <p style="width:20%">E-Card</p>
                <p>{{$memo->price_e_card}}</p>
                </div>
            </li>
            <li class="w-full">
                <div class="flex w-full">
                <p style="width:20%">Biaya Langganan</p>
                <p>{{$memo->price_subscription}}</p>
                </div>
            </li>
        </ol>
    </div>

    <div class="flex flex-col w-full mt-5">
        <p>Adapun pertimbangan pengajuan ini adalah :</p>
        <p class="text-justify indent-10" style="text-indent: 27px">{{$memo->consideration}}</p>
    </div>

    <div class="flex w-full mt-5 text-justify">
        <p>Demikian Memo Pengajuan deviasi kami sampaikan. Atas perhatian dan kerja samanya, kami ucapkan terima kasih.</p>
    </div>

    <div class="w-full text-center mt-5">
        <p>Purwokerto, {{\Carbon\Carbon::parse($memo->date)->locale('id')->isoFormat(
    'D MMMM YYYY',
    'Do MMMM YYYY'
)}}</p>
    </div>

    <div class="flex justify-around mt-5">
        <div class="text-center" style="width: 33%">

            @if($memo->signature_first_name)
            <p>Yang Mengajukan</p>
            <div style="width: 130px; height: 130px; overflow: hidden;" class="p-2">
            <img src="{{ public_path("storage/$memo->signature_first_image") }}" alt="" class="min-h-20 w-full"
            style="object-fit:cover;" />
            </div>
            <p>{{$memo->signature_first_name}}</p>
            @else
            <div style="height: 80px"></div>
            @endif
        </div>
        <div class="text-center" style="width: 33%">
       
            @if($memo->signature_second_name)
            <p>Mengetahui</p>
            <div style="width: 130px; height: 130px; overflow: hidden;" class="p-2">
            <img src="{{ public_path("storage/$memo->signature_second_image") }}" alt="" class="min-h-20 w-full"
            style="object-fit:cover;" />
            </div>
            <p>{{$memo->signature_second_name}}</p>
            @else
            <div style="height: 80px"></div>
            @endif
        </div>
        <div class="text-center" style="width: 33%">
 
            @if($memo->signature_third_name)
            <p>Menyetujui</p>
            <div style="width: 130px; height: 130px; overflow: hidden;" class="p-2">
            <img src="{{ public_path("storage/$memo->signature_third_image") }}" alt="" class="min-h-20 w-full"
            style="object-fit:cover;" />
            </div>
            <p>{{$memo->signature_third_name}}</p>
            @else
            <div style="height: 80px"></div>
            @endif
        </div>
    </div>
   
</body>

</html>