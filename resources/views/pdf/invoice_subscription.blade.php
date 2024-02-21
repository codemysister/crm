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

<body style="font-size: 10pt">

    @php
    use Carbon\Carbon;
    @endphp
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

    <hr style="height: 1px; margin: 1.5rem 0; background-color: #718096 !important; border: none;" />

    <div class="flex flex-col justify-center mt-10 text-center">
        <div class="font-bold text-purple-800" style="font-size: 18pt">INVOICE LANGGANAN</div>
    </div>

    <div class="flex justify-between items-center mt-10">
        <div style="width: 60%;">
            <p class="underline">Ditagihkan Kepada:</p>
            <p class="font-bold">{{$invoice_subscription->partner_name}}</p>
            <p class="font-bold">{{json_decode($invoice_subscription->partner_regency)->name}},
                {{json_decode($invoice_subscription->partner_province)->name}}</p>
        </div>
        <div style="width: 40%;">
            <div class="flex flex-row">
                <p style="width: 40%">Nomor</p>
                <p style="width: 3%">:</p>
                <p class="font-bold">{{$invoice_subscription->code}}</p>
            </div>
            <div class="flex flex-row">
                <p style="width: 40%">Tanggal</p>
                <p style="width: 3%">:</p>
                <p>{{Carbon::parse($invoice_subscription->date)->format('d/m/Y')}}</p>
            </div>
            <div class="flex flex-row">
                <p style="width: 40%">Jatuh Tempo</p>
                <p style="width: 3%">:</p>
                <p>{{Carbon::parse($invoice_subscription->due_date)->format('d/m/Y')}}</p>
            </div>
        </div>
    </div>

    <div class="w-full mt-10">
        <table class="w-full" style="border-collapse: collapse; width: 100%;">
            <thead style="background-color:#D9D2E9; padding: 10px 10px;">
                <tr>
                    <th class="p-2" style="width: 5%; border: 1px solid #ded8ee; padding: 8px; text-align: center;">No.
                    </th>
                    <th class="p-2" style="width: 35%; border: 1px solid #ded8ee; padding: 8px; text-align: left;">
                        Tagihan
                    </th>
                    <th class="p-2" style="width: 20%; border: 1px solid #ded8ee; padding: 8px; text-align: left;">Harga
                    </th>
                    <th class="p-2" style="width: 20%; border: 1px solid #ded8ee; padding: 8px; text-align: left;">Pajak
                    </th>
                    <th class="p-2" style="width: 20%; border: 1px solid #ded8ee; padding: 8px; text-align: left;">
                        Jumlah
                    </th>
                </tr>
            </thead>
            <tbody>

                @foreach($invoice_subscription->bills as $key => $bill)
                <tr>
                    <td class="p-1" style="width: 5%; text-align: center; border: 1px solid #ded8ee; padding: 8px;">
                        {{++$key}}
                    </td>
                    <td class="p-1" style="width: 35%; border: 1px solid #ded8ee; padding: 8px;">
                        {{$bill->bill}}</td>
                    <td class="p-1" style="width: 20%; border: 1px solid #ded8ee; padding: 8px;">
                        Rp{{number_format($bill->nominal, 0, ',','.')}}</td>
                    <td class="p-1" style="width: 20%; border: 1px solid #ded8ee; padding: 8px;">
                        Rp{{number_format($bill->total_ppn, 0, ',','.')}}</td>
                    <td class="p-1" style="width: 20%; border: 1px solid #ded8ee; padding: 8px;">
                        Rp{{number_format($bill->total_bill, 0, ',','.')}}</td>
                </tr>
                @endforeach

                <tr>
                    <td class="p-1" colspan="4" style="text-align: right; padding: 8px;">Sub Total
                    </td>
                    <td class="p-1" style="width: 35%; border: 1px solid #ded8ee; padding: 8px;">
                        Rp{{number_format($invoice_subscription->total_bill, 0, ',','.')}}</td>

                </tr>
                <tr>
                    <td class="p-1" colspan="4" style="text-align: right; padding: 8px;">Diskon/Uang Muka
                    </td>
                    <td class="p-1" style="width: 35%; border: 1px solid #ded8ee; padding: 8px;">Rp0</td>
                </tr>
                <tr>
                    <td class="p-1 font-bold" colspan="4" style="text-align: right; padding: 8px;">Total Tagihan
                    </td>
                    <td class="p-1 font-bold" style="width: 35%; border: 1px solid #ded8ee; padding: 8px;">
                        Rp{{number_format($invoice_subscription->total_bill, 0, ',','.')}}</td>
                </tr>
            </tbody>
        </table>

    </div>

    <div class="flex flex-row mt-10 justify-between items-center">
        <div style="width: 50%;">
            <p class="font-bold underline">Payment</p>
            <p>Pembayaran akan dilakukan dengan</p>
            <p>mengurangi <b>CazhBOX</b> lembaga Anda</p>
        </div>
        <div class="w-[30%]" style="width: 30%;">
            <p>Hormat Kami,</p>
            <img src="{{ public_path("/storage/$invoice_subscription->signature_image") }}" alt="" class="min-h-20
            w-full"
            style="width:90%; height: 80px" />
            <!-- <div style="min-height: 80px"></div> -->
            <p class="font-bold">{{$invoice_subscription->signature_name}}</p>
        </div>

    </div>


</body>

</html>