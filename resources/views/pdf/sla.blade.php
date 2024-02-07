<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SERVICE LEVEL AGREEMENT</title>
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

        footer {
            position: fixed;
            bottom: 0cm;
            left: 0cm;
            right: 0cm;
            height: 2cm;
            text-align: right;
            line-height: 1.5cm;
        }
    </style>
</head>

<body style="font-size: 10px">

    <div>
        <header>
            <div class="flex justify-start items-center">
                <div class="w-[10%]" style="width:10%;">
                    <img src="{{ public_path('assets/img/logo/sla_logo.png') }}" alt="" class="float-left w-full h-full"
                        style="width: 100%; height: 100%" />
                </div>
                <div class="w-full text-center">
                    <h2 class="font-bold">PT CAZH TEKNOLOGI INOVASI</h2>
                    <h2 class="font-bold">TIME LINE PROSES IMPLEMENTASI LAYANAN CAZH CARDS</h2>
                </div>
                <div class="w-[10%]"></div>
            </div>
        </header>

        <hr class="h-[2px] my-2 bg-slate-400" />

        <div class="w-full mt-5">
            <table class="w-full">
                <tbody>
                    <tr>
                        <td class="w-1/6">Nama Lembaga</td>
                        <td style="width: 1%">:</td>
                        <td class="w-7/12">{{$sla->partner_name}}

                        </td>
                    </tr>
                    <tr>
                        <td class="w-1/6">Alamat Lembaga</td>
                        <td style="width: 1%">:</td>
                        <td class="w-7/12">{{$sla->partner_address}}

                        </td>
                    </tr>
                    <tr>
                        <td class="w-1/6">Nomor Telepon Lembaga</td>
                        <td style="width: 1%">:</td>
                        <td class="w-7/12">{{$sla->partner_phone_number}}

                        </td>
                    </tr>

                    <tr>
                        <td class="w-1/6">Penanggungjawab</td>
                        <td style="width: 1%">:</td>
                        <td class="w-7/12">{{$sla->partner_pic}}

                        </td>
                    </tr>
                    <tr>
                        <td class="w-1/6">Email Penanggungjawab</td>
                        <td style="width: 1%">:</td>
                        <td class="w-7/12">{{$sla->partner_pic_email}}

                        </td>
                    </tr>
                    <tr>
                        <td class="w-1/6">Nomor HP Penanggungjawab</td>
                        <td style="width: 1%">:</td>
                        <td class="w-7/12">{{$sla->partner_pic_number}}

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="w-full  mt-5">
            <table class="w-full border border-collapse" border="1">
                <thead class="text-left">
                    <th class="border p-2 text-center">No</th>
                    <th class="border p-2 text-center">Tahapan</th>
                    <th class="border p-2 text-center">Penanggungjawab</th>
                    <th class="border p-2 text-center">Estimasi Waktu</th>
                    <th class="border p-2 text-center">Tanggal</th>
                    <th class="border p-2 text-center">Realisasi</th>
                </thead>
                <tbody>

                    @foreach($activities as $activity)
                    <tr>
                        <td class="border text-center">{{$loop->index + 1}}</td>
                        <td class="border p-1">{{$activity["activity"]}}</td>
                        <td class="border p-1">{{ucwords($activity["cazh_pic"])}}</td>
                        <td class="border p-1">{{$activity["duration"]}}</td>
                        <td class="border p-1">
                            {{date('j M Y', strtotime($activity["estimation_date"]))}}
                        </td>
                        <td class="border p-1">{{$activity["realization_date"] ? date('j M Y',
                            strtotime($activity["realization_date"])) : ''}}</td>
                    </tr>
                    @endforeach

                </tbody>
            </table>
        </div>



        <div class="flex  flex-row mt-5 justify-between">
            <div class="w-[30%]" style="width: 30%;">
                <p>Pihak Pertama</p>
                <img src="{{ public_path($sla->signature_image) }}" alt="" class="min-h-20 w-full"
                    style="width:90%; height: 80px" />
                <p>{{$sla->signature_name}}</p>
            </div>
            <div class="w-[30%]" style="width: 30%;">
                <p>Pihak Kedua</p>
                <div style="min-height: 80px"></div>
                <p>{{$sla->partner_pic}}</p>
            </div>
            @if($sla->referral)
            <div class="w-[30%]" style="width: 30%;">
                <p>Pihak Ketiga</p>
                <div style="min-height: 80px"></div>
                <p>{{$sla->referral_name}}</p>
            </div>
            @endif
        </div>
    </div>



</body>

</html>