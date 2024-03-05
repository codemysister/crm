<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SERVICE LEVEL AGREEMENT</title>
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
                    <img src="{{ public_path($sla->logo) }}" alt="" class="float-left w-full h-full"
                        style="width: 100%; height: 100%" />
                </div>
                <div class="w-full text-center">
                    <h2 class="font-bold">PT CAZH TEKNOLOGI INOVASI</h2>
                    <h2 class="font-bold">TIME LINE PROSES IMPLEMENTASI LAYANAN CAZH CARDS</h2>
                </div>
                <div class="w-[10%]" style="width:10%">
                @if($sla->referral_logo !== null)
                <img src="{{ public_path("storage/$sla->referral_logo") }}" alt="" class="float-left w-full h-full"
                        style="width: 100%; height: 100%" />
                @endif
                </div>
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
                        <td class="w-7/12">{{json_decode($sla->partner_regency)->name}},
                            {{json_decode($sla->partner_province)->name}}

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
                    <th class="border p-2 w-[30%] text-center" style="width:30%">Tahapan</th>
                    <th class="border p-2 w-[15%] text-center" style="width:15%">Penanggungjawab</th>
                    <th class="border p-2 w-[25%] text-center" style="width:20%">Estimasi Waktu</th>
                    <th class="border p-2 w-[15%] text-center" style="width:15%">Tanggal</th>
                    <th class="border p-2 w-[15%] text-center" style="width:15%">Realisasi</th>
                </thead>
                <tbody>

                    @foreach($activities as $activity)
                    <tr>
                        <td class="border text-center">{{$loop->index + 1}}</td>
                        <td class="border w-[30%] p-1" style="width:30%">{{$activity["activity"]}}</td>
                        <td class="border w-[15%] text-center italic p-1" style="width:15%">
                            {{ucwords($activity["cazh_pic"]['name'] ?? $activity["cazh_pic"])}}
                        </td>

                        <td class="border w-[25%] text-center p-1" style="width:20%">{{$activity["duration"]}}</td>
                        <td class="border w-[15%] text-right p-1" style="width:15%">
                            {{date('j M Y', strtotime($activity["estimation_date"]))}}
                        </td>
                        <td class="border w-[15%] text-right p-1" style="width:15%">{{$activity["realization_date"] ?
        date(
            'j M Y',
            strtotime($activity["realization_date"])
        ) : ''}}</td>

                    </tr>
                    @endforeach

                </tbody>
            </table>
            <p class="text-xs" style="font-size: 8px">*) Sosialiasi dapat dilakukan mandiri oleh Lembaga Partner</p>
        </div>


        <div class="flex flex-row mt-5 justify-between">
            <div class="w-[30%]" style="width: 30%; height: 30%;">
                <p>Pihak Pertama</p>
                <div style="width: 100px; height: 100px; overflow: hidden;">

                <img src="{{ public_path("storage/$sla->signature_image") }}" alt="" class="min-h-20 w-full"
                    style="object-fit: cover;" />
            </div>
                <p>{{$sla->signature_name}}</p>
            </div>
            <div class="w-[30%]" style="width: 30%; height: 30%;">
                <p>Pihak Kedua</p>
                @if($sla->partner_pic_signature)
                <div style="width: 100px; height: 100px; overflow: hidden;">
                <img src='{{ public_path("storage/$sla->partner_pic_signature") }}' alt="" class="min-h-20 w-full"
                    style="object-fit: cover;" />
                </div>
                @else
                <div style="min-height: 100px"></div>
                @endif

                <p>{{$sla->partner_pic}}</p>
            </div>
            @if($sla->referral)
            <div class="w-[30%]" style="width: 30%; height: 30%;">
                <p>Pihak Ketiga</p>
                @if($sla->referral_signature)
                <div style="width: 100px; height: 100px; overflow: hidden;">
                <img src='{{ public_path("storage/$sla->referral_signature") }}' alt="" class="min-h-20 w-full"
                style="object-fit: cover;" />
                </div>
                @else
                <div style="min-height: 100px"></div>
                @endif
                <p>{{$sla->referral_name}}</p>
            </div>
            @endif
        </div>
    </div>



</body>

</html>