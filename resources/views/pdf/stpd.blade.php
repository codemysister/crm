<!-- resources/views/spd.blade.php -->

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SURAT KETERANGAN PERJALANAN DINAS</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    {{--@vite('resources/css/app.css')--}}

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
        <div class="font-bold underline text-sm">SURAT KETERANGAN PERJALANAN DINAS</div>
        <div class="text-sm">Nomor : {{$stpd->code}}</div>
    </div>

    <div class="mt-4">
        <div>Dengan ini kami memberikan tugas kepada karyawan yang disebutkan dibawah ini:</div>
    </div>

    <div class="w-full mt-6">
        <table class="w-full">
            <thead style="background-color:#CFE2F3;">
                <tr>
                    <th style="text-align:left; width:5%;" class="p-2 pl-2">No.</th>
                    <th style="text-align:left;" class="p-2">Karyawan</th>
                    <th style="text-align:left;" class="p-2">Jabatan</th>
                </tr>
            </thead>
            <tbody>
                @foreach($employees as $employee)
                    <tr>
                        <td style="text-align:left; width:5%;" class="p-2 pl-2">{{ $loop->index + 1 }}</td>
                        <td style="text-align:left;" class="p-2">{{ $employee['name'] }}</td>
                        <td style="text-align:left;" class="p-2">{{ ucwords($employee['position']) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="mt-8">
        <div>Untuk melaksanakan tugas melakukan perjalanan dinas dengan ketentuan sebagai berikut:</div>
    </div>

    <div class="mt-4">
        <div class="flex w-full">
            <table style="width:100%">
                <tr>
                    <td style="width:20%;">Lembaga Tujuan</td>
                    <td style="width:1%">:</td>
                    <td style="font-weight:bold">{{$stpd->institution_name}}</td>
                </tr>
                <tr>
                    <td style="width:20%;">Lokasi</td>
                    <td style="width:1%">:</td>
                    <td style="font-weight:bold">{{ucwords(json_decode($stpd->institution_regency)->name)}},
                        {{ucwords(json_decode($stpd->institution_province)->name)}}
                    </td>
                </tr>
                <br />
                <tr>
                    <td style="width:20%;">Berangkat</td>
                    <td style="width:1%">:</td>
                    <td style="font-weight:bold">{{(new DateTime($stpd->departure_date))->format('d/m/Y')}}</td>
                </tr>
                <tr>
                    <td style="width:20%;">Kembali</td>
                    <td style="width:1%">:</td>
                    <td style="font-weight:bold">{{(new DateTime($stpd->return_date))->format('d/m/Y')}}</td>
                </tr>
                <tr>
                    <td style="width:20%;">Kendaraan</td>
                    <td style="width:1%">:</td>
                    <td style="font-weight:bold">{{$stpd->transportation}}</td>
                </tr>
                <tr>
                    <td style="width:20%;">Akomodasi</td>
                    <td style="width:1%">:</td>
                    <td style="font-weight:bold">{{$stpd->accommodation}}</td>
                </tr>
            </table>
        </div>

        <div class="mt-4 text-justify">
            <div>
                Semua biaya dalam perjalanan dinas, konsumsi, serta akomodasi dalam rangka perjalanan
                dinas ini akan menjadi tanggung jawab PT Cazh Teknologi Inovasi sesuai peraturan perjalanan
                dinas yang berlaku.
            </div>
        </div>

        <div class="mt-4 text-justify">
            <div>
                Demikian surat ini dibuat agar dapat dilaksanakan dengan baik dan penuh tanggung jawab. Kepada semua
                pihak yang terlibat dimohon kerja sama yang baik agar perjalanan dinas ini dapat terlaksana dengan
                lancar.
            </div>
        </div>

        <div class="flex flex-col justify-start mt-8 float-left">
            <div>Purwokerto, {{date("d/m/Y")}}</div>
            <div style="width: 170px; height: 100px; overflow: hidden;" class="py-2">
                <img class="h-20 w-[15%]" src='{{ public_path("/storage/$stpd->signature_image") }}'
                    style="object-fit:fill; width:100%; height:100%;" alt="Signature">
            </div>
            <div>{{ ucwords($stpd->signature_name) }}</div>
            <div>{{ $stpd->signature_position }}</div>
        </div>

        <div class="flex justify-end mt-8">
            <div class="self-start text-left">
                <div>.........................., ..........................</div>
                <div>Mengetahui*,</div>
                <div style="margin-top: 100px;">(....................................................)</div>
                <div style="font-size: 8px;">*)Tanda Tangan dan stempel lembaga tujuan</div>
            </div>
        </div>
    </div>


</body>

</html>