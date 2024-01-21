<!-- resources/views/spd.blade.php -->

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SURAT PENAWARAN HARGA</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <!-- @vite('resources/css/app.css') -->

    <style>
        @page {
            margin-left: 2.5cm;
            margin-top: 2cm;
            margin-right: 2.5cm;
            margin-bottom: 2cm;
        }

        @import url('https://fonts.googleapis.com/css2?family=Sen:wght@400;500;600;700;800&display=swap');


        body {
            margin: 0px;
            padding: 0px;
            box-sizing: border-box;
            font-family: 'Sen', sans-serif;
        }
    </style>
</head>

<body class="font-sen text-base">

    @php
    $partner = json_decode($sph->partner, true);
    $sales = json_decode($sph->sales, true);
    $signature = json_decode($sph->signature, true);
    @endphp

    <div class="flex justify-between items-center">
        <table>
            <tr>
                <td style="width:30%">
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
        <div class="font-bold underline text-sm">SURAT PENAWARAN HARGA</div>
        <div class="text-sm">Nomor : {{$sph->code}}</div>
    </div>

    <div class="flex flex-col justify-start mt-6 text-left">
        <p class="text-sm">Kepada Yth.</p>
        <p class="text-sm"><b>{{$partner['pic']}}</b></p>
        <p class="text-sm"><b>{{$partner['name']}}</b></p>
        <p class="text-sm">di {{$partner['address']}}</p>
    </div>

    <div class="mt-6 text-left">
        <p class="text-sm">Dengan hormat,</p>
    </div>

    <div class="mt-6 text-left">
        <p class="text-sm text-justify">Menindaklanjuti komunikasi yang telah dilakukan oleh tim marketing kami
            {{$sales['name']}}
            dengan perwakilan dari {{$partner['pic']}}, dengan ini kami sampaikan penawaran sebagai berikut:</p>
    </div>



    <div class="w-full mt-6">
        <table class="w-full text-sm">
            <thead style="background-color:#CFE2F3; padding: 5px 10px;">
                <tr>
                    <th style="width: 10%;">No.</th>
                    <th style="width: 30%;">Produk/Layanan</th>
                    <th style="width: 40%;">Rincian</th>
                    <th>Jumlah</th>
                </tr>
            </thead>
            <tbody>
                @foreach($products as $product)
                <tr>
                    <td style=" width: 10%; text-align: center;">{{$loop->index + 1}}</td>
                    <td style="width: 30%;">{{$product['name']}}</td>
                    <td style="width: 40%;">{{$product['detail']}}</td>
                    <td style="text-align: center;">{{$product['total']}}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="mt-6">
        <p class="text-sm">
            Untuk konfirmasi persetujuan silakan hubungi :
        </p>
        <p class="text-sm">
            <b>{{$sales['name']}}</b> via WA : <b>{{$sales['wa']}}</b>, email : <b>{{$sales['email']}}</b>
        </p>
    </div>

    <div class="mt-6">
        <p class="text-sm">
            Demikian surat penawaran harga ini kami sampaikan dengan sesungguhnya.
        </p>
        <p class="text-sm">
            Atas perhatian dan kerja sama yang baik, kami sampaikan terima kasih.
        </p>
    </div>


    <div class="flex flex-col justify-start mt-8 float-left">
        <p class="text-sm">Purwokerto, {{date("d/m/Y")}}</p>
        <img class="h-20 w-[15%]" src="{{ public_path($signature['signature']) }}" alt="Signature">
        <div>{{ $signature['name'] }}</div>
        <div>{{ $signature['position'] }}</div>
    </div>


</body>

</html>