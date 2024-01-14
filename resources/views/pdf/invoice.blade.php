<!-- resources/views/spd.blade.php -->

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SURAT KETERANGAN PERJALANAN DINAS</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <!-- @vite('resources/css/app.css') -->

</head>

<body class="font-sen text-base">

    <div class="flex justify-between items-center bg-red-500">
        <table>
            <tr>
                <td style="width:30%">
                    <img src="{{ public_path('assets\img\cazh.png')}}" alt="Logo">
                </td>
                <td>
                    <div style="text-align:right">
                        <div class="font-bold text-xs">PT. CAZH TEKNOLOGI INOVASI</div>
                        <div class="text-xs">Bonavida Park D1, Jl. Raya Karanggintung</div>
                        <div class="text-xs">Kec. Sumbang, Kab. Banyumas, Jawa Tengah 53183</div>
                        <div class="text-xs">hello@cazh.id | https://cazh.id</div>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <div class="flex flex-col justify-center mt-8 text-center">
        <div class="font-bold underline text-sm">SURAT KETERANGAN PERJALANAN DINAS</div>
        <div class="text-sm">Nomor : 001/CAZH-SPJ/X/2023</div>
    </div>

    <div class="mt-4">
        <div>Dengan ini kami memberikan tugas kepada karyawan yang disebutkan dibawah ini:</div>
    </div>

    <div class="w-full mt-6">
        <table class="w-full">
            <thead style="background-color:#CFE2F3;">
                <tr>
                    <th style="text-align:left; padding-left: 20px; width:5%;">No.</th>
                    <th style="text-align:left; padding-left: 20px;">Karyawan</th>
                    <th style="text-align:left; padding-left: 20px;">Jabatan</th>
                </tr>
            </thead>
            <tbody>
                @foreach($employees as $employee)

                <tr>
                    <td style="text-align:left; padding-left: 20px; width:5%;">{{ $loop->index + 1 }}</td>
                    <td style="text-align:left; padding-left: 20px;">{{ $employee['name'] }}</td>
                    <td style="text-align:left; padding-left: 20px;">{{ ucwords($employee['position']) }}</td>
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
                    <td style="font-weight:bold">{{$stpd->institution}}</td>
                </tr>
                <tr>
                    <td style="width:20%;">Lokasi</td>
                    <td style="width:1%">:</td>
                    <td style="font-weight:bold">{{$stpd->location}}</td>
                </tr>
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


        <div class="mt-4">
            <div>
                Semua biaya dalam perjalanan dinas, konsumsi, serta akomodasi dalam rangka perjalanan
                dinas ini akan menjadi tanggung jawab PT Cazh Teknologi Inovasi sesuai peraturan perjalanan
                dinas yang berlaku.
            </div>
        </div>

        <div class="mt-4">
            <div>
                Demikian surat ini dibuat agar dapat dilaksanakan dengan baik dan penuh tanggung jawab. Kepada semua
                pihak yang terlibat dimohon kerja sama yang baik agar perjalanan dinas ini dapat terlaksana dengan
                lancar.
            </div>
        </div>


        @php
        $decodedSignature = json_decode($stpd->signature, true);
        @endphp

        <div class="flex flex-col justify-start mt-8 float-left">
            <div>Purwokerto, {{date("d/m/Y")}}</div>
            <img class="h-20 w-[15%]" src="{{ public_path($decodedSignature['signature']) }}" alt="Signature">
            <div>{{ $decodedSignature['name'] }}</div>
            <div>{{ $decodedSignature['position'] }}</div>
        </div>

        <div class="flex justify-end mt-28 float-right">
            <div class="w-2/5 text-left self-end">
                <div>.........................., ..........................</div>
                <div>Mengetahui*,</div>
                <div style="margin-top: 50px;">(....................................................)</div>
                <div style="font-size: 8px;">*)Tanda Tangan dan stempel lembaga tujuan</div>
            </div>
        </div>





</body>

</html>