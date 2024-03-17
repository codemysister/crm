<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SURAT PENAWARAN HARGA</title>
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

<body style="font-size: 13px">

    <div>
        <header style="text-align: center;">
            <div style="">
                <h1 style="font-weight: bold;">
                    PERJANJIAN KERJA SAMA
                </h1>
                <h1 style="font-weight: bold;">
                    KEMITRAAN PT CAZH TEKNOLOGI INOVASI
                </h1>
                <h1 style="font-weight: bold;">
                    DENGAN <span style="text-transform: uppercase">{{$mou["partner_name"]}}</span>
                </h1>
            </div>
        </header>

        <hr style="height: 1px; margin: 1.5rem 0; background-color: #718096 !important; border: none;" />

        <div style="text-align: center; line-height: 1.5;">
            <h1 style="font-weight: bold; text-decoration: underline; margin: 0 auto;">
                BERITA ACARA KEMITRAAN
            </h1>
            <p style="font-weight: bold;">Nomor : {{$mou["code"]}}</p>
        </div>

        <div style="margin-top: 1.25rem;">
            <p>
                Pada hari ini {{$mou["day"]}}, Tanggal {{
    \Carbon\Carbon::parse($mou['date'])->locale('id')->isoFormat(
        'D MMMM YYYY',
        'Do MMMM YYYY'
    ) }}
                telah disepakati
                kerja sama antara:
            </p>
        </div>


        <div style="padding: 0 2rem;">
            <table style="border-collapse: separate; border-spacing: 0 15px; width: 100%; ">
                <tbody>
                    <tr style="">
                        <td style="vertical-align: top; width: 4%; padding-top:2px">1.</td>
                        <td style="">
                            <table style="width: 100%;">
                                <tr>
                                    <td style="width: 20%;">Nama</td>
                                    <td>: <b>MUH ARIF MAHFUDIN</b></td>
                                </tr>
                                <tr>
                                    <td style="width: 20%;">Jabatan</td>
                                    <td>: <b>Direktur Utama</b></td>
                                </tr>
                                <tr>
                                    <td style="width: 20%;">Lembaga</td>
                                    <td>: <b>PT CAZH TEKNOLOGI INOVASI</b></td>
                                </tr>
                                <tr>
                                    <td style="width: 20%;">Lokasi</td>
                                    <td>: <b>Kab. Banyumas, Jawa Tengah</b></td>
                                </tr>
                                <tr>
                                    <td colspan="2">Selanjutnya disebut sebagai “Pihak Pertama”.</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr style="">
                        <td style="vertical-align: top; width: 4%;">2.</td>
                        <td style="">
                            <table style="width: 100%;">
                                <tr>
                                    <td style="width: 20%;">Nama</td>
                                    <td class="uppercase">: <b>{{$mou["partner_pic"]}}</b></td>
                                </tr>
                                <tr>
                                    <td style="width: 20%;">Jabatan</td>
                                    <td>: <b>{{ucwords($mou["partner_pic_position"])}}</b></td>
                                </tr>
                                <tr>
                                    <td style="width: 20%;">Lembaga</td>
                                    <td class="uppercase">: <b>{{$mou["partner_name"]}}</b></td>
                                </tr>
                                <tr>
                                    <td style="width: 20%;">Lokasi</td>
                                    <td>: <b>{{json_decode($mou->partner_regency)->name}},
                                            {{json_decode($mou->partner_province)->name}}</b></td>
                                </tr>
                                <tr>
                                    <td colspan="2">Selanjutnya disebut sebagai “Pihak Pertama”.</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr style="">
                        <td style="vertical-align: top;"></td>
                        <td style="">
                            <p>
                                Pihak Pertama dan Pihak Kedua secara bersama-sama disebut “Para Pihak”.
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="margin-top: 1rem">
            <p>
                Para Pihak menyepakati kerjasama dengan
                ketentuan sebagai berikut:
            </p>
            <div style="padding-left: 2rem">
                <table style="border-collapse: separate; border-spacing: 0 15px;">
                    <tbody>
                        <tr>
                            <td style="font-weight: bold; vertical-align: top; width: 4%;">
                                1.
                            </td>
                            <td>
                                <p style="font-weight: bold;">
                                    Produk
                                </p>
                                <p style="text-align: justify;">
                                    Pihak Pertama memberikan hak kepada Pihak Kedua untuk menggunakan perangkat lunak
                                    sebagai berikut:
                                </p>
                                <div style="padding-left: 6px;">
                                    <table>
                                        <tbody style="text-align: justify;">
                                            <tr>
                                                <td style="vertical-align: top; width: 4%;">
                                                    a.
                                                </td>
                                                <td>
                                                    Aplikasi Web Dashboard Sistem Manajemen Lembaga, yang dapat diakses
                                                    dengan alamat URL <b>{{$mou->url_subdomain}}</b> menggunakan
                                                    peramban web <i>(web
                                                        browser)</i> apa pun yang terhubung dengan jaringan internet.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top; width: 4%;">
                                                    b.
                                                </td>
                                                <td>
                                                    Aplikasi <i>Mobile</i> Kartu Digital bernama <b>“CARDS Kartu Digital”</b>
                                                    yang
                                                    dapat diunduh untuk pengguna sistem operasi Android maupun iOS.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top; width: 4%;">
                                                    c.
                                                </td>
                                                <td>
                                                    Aplikasi <i>Mobile</i> Kasir Digital bernama <b>“CAZH POS”</b> dan/atau
                                                    “CAZH POS
                                                    Lite” yang dapat diunduh untuk pengguna sistem operasi Android.
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td style="font-weight: bold; vertical-align: top; width: 4%; padding-top:5px">
                                2.
                            </td>
                            <td>
                                <p style="font-weight: bold;">
                                    Definisi
                                </p>
                                <p style="text-align: justify;">
                                    Pihak Pertama menggunakan beberapa istilah untuk diketahui dan disepakati dengan
                                    Pihak Kedua dengan ketentuan sebagai berikut:
                                </p>
                                <div style="padding-left: 6px;">
                                    <table>
                                        <tbody style="text-align: justify;">
                                            <tr style="page-break-after: always;">
                                                <td style="vertical-align: top; width: 4%;">
                                                    a.
                                                </td>
                                                <td>
                                                    CazhBox adalah saldo milik Pihak Kedua pada aplikasi Web Dashboard
                                                    dan aplikasi mobile Kasir Digital
                                                </td>
                                            </tr>

                                            <tr>
                                                <td style="vertical-align: top; width: 4%; ">
                                                    b.
                                                </td>
                                                <td style="">
                                                    CazhPOIN adalah saldo milik user aplikasi <i>mobile</i> Kartu
                                                    Digital
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top; width: 4%; ">
                                                    c.
                                                </td>
                                                <td style="">
                                                    <i>Top-up</i> adalah proses pengisian saldo
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top; width: 4%; ">
                                                    d.
                                                </td>
                                                <td style="">
                                                    <i>Withdraw</i> adalah proses penarikan saldo
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top; width: 4%; ">
                                                    e.
                                                </td>
                                                <td style="">
                                                    <i>Virtual Account</i> adalah metode pembayaran melalui fasilitas
                                                    bank yang
                                                    dapat dilakukan dari ATM, <i>Internet banking</i> maupun
                                                    <i>m-banking</i>.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top; width: 4%; ">
                                                    f.
                                                </td>
                                                <td style="">
                                                    QRIS adalah metode pembayaran menggunakan standar QR yang diatur
                                                    oleh Bank Indonesia, baik melalui aplikasi <i>e-wallet</i> maupun
                                                    <i>m-banking</i>.
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td style="font-weight: bold; vertical-align: top; width: 4%;">
                                3.
                            </td>
                            <td>
                                <p style="font-weight: bold;">
                                    Harga Layanan
                                </p>
                                <p style="text-align: justify;">
                                    Pihak Pertama memiliki hak untuk menerima pembayaran dari Pihak Kedua untuk layanan
                                    yang dikenakan PPN 11% sesuai dengan peraturan perpajakan yang berlaku. Hak ini
                                    diberikan dengan ketentuan sebagai berikut:
                                </p>
                                <div style="padding-left: 6px;">
                                    <table style="width: 100%; border-collapse: separate; border-spacing: 0 15px;">
                                        <tbody>
                                            <tr>
                                                <td style="vertical-align: top; width: 4%;">
                                                    a.
                                                </td>
                                                <td style="width: 100%;">
                                                    <p style="margin-bottom: 5px">
                                                        Harga produk kartu
                                                    </p>
                                                    <table style="width: 100%; border: 1px solid #000000;">
                                                        <thead
                                                            style="font-weight: bold; background-color: #efefef !important;">
                                                            <th
                                                                style="width: 5%; border: 1px solid #000000; padding: 5px">
                                                                No
                                                            </th>
                                                            <th
                                                                style="width: 50%; border: 1px solid #000000; padding: 5px">
                                                                Produk
                                                            </th>
                                                            <th style="border: 1px solid #000000; padding: 5px">
                                                                Harga
                                                            </th>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td
                                                                    style="text-align: center; border: 1px solid #000000; padding: 5px">
                                                                    1
                                                                </td>
                                                                <td
                                                                    style="width: 50%; border: 1px solid #000000; padding: 5px">
                                                                    Kartu Tercetak
                                                                </td>
                                                                <td style="border: 1px solid #000000; padding: 5px">
                                                                    Rp{{number_format(
        $mou->price_card,
        0,
        ',',
        '.'
    )}}/kartu
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="text-align: center; border: 1px solid #000000; padding: 5px">
                                                                    2
                                                                </td>
                                                                <td
                                                                    style="width: 50%; border: 1px solid #000000; padding: 5px">
                                                                    Lanyard (Tali gantungan kartu)
                                                                </td>
                                                                <td style="border: 1px solid #000000; padding: 5px">
                                                                    Rp{{number_format(
        $mou->price_lanyard,
        0,
        ',',
        '.'
    )}}/lanyard
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top; width: 4%;">
                                                    b.
                                                </td>
                                                <td style="width: 100%;">
                                                    <p style="margin-bottom: 5px">
                                                        Harga langganan sistem
                                                    </p>
                                                    <table style="width: 100%;">
                                                        <thead style="font-weight: bold; background-color: #efefef">
                                                            <th
                                                                style="width: 5%; border: 1px solid #000000; padding: 5px">
                                                                No
                                                            </th>
                                                            <th
                                                                style="width: 50%; border: 1px solid #000000; padding: 5px">
                                                                Layanan
                                                            </th>
                                                            <th style="border: 1px solid #000000; padding: 5px">
                                                                Harga
                                                            </th>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td
                                                                    style="text-align: center; border: 1px solid #000000; padding: 5px">
                                                                    1
                                                                </td>
                                                                <td
                                                                    style="width: 50%; border: 1px solid #000000; padding: 5px">
                                                                    Langganan sistem
                                                                </td>
                                                                <td style="border: 1px solid #000000; padding: 5px">
                                                                    Rp{{number_format(
        $mou->price_subscription_system,
        0,
        ',',
        '.'
    )}} per-{{$mou->period_subscription}}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top; width: 4%;">
                                                    c.
                                                </td>
                                                <td style="width: 100%;">
                                                    <p>
                                                        Harga implementasi
                                                    </p>
                                                    <p style="text-align: justify;">
                                                        Pihak Kedua berhak atas layanan gratis terkait pelatihan
                                                        dan/atau sosialisasi secara daring sebanyak 3 kali sesi. Di luar
                                                        dari ketiga sesi tersebut, Pihak Kedua akan dikenakan biaya
                                                        layanan untuk setiap pertemuan.
                                                    </p>
                                                    <table style="width: 100%; border: 1px solid #000000;">
                                                        <thead style="font-weight: bold; background-color: #efefef">
                                                            <th
                                                                style="width: 5%; border: 1px solid #000000; padding: 5px">
                                                                No
                                                            </th>
                                                            <th
                                                                style="width: 50%; border: 1px solid #000000; padding: 5px">
                                                                Layanan
                                                            </th>
                                                            <th style="border: 1px solid #000000; padding: 5px">
                                                                Harga
                                                            </th>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td
                                                                    style="text-align: center; border: 1px solid #000000; padding: 5px">
                                                                    1
                                                                </td>
                                                                <td
                                                                    style="width: 50%; border: 1px solid #000000; padding: 5px">
                                                                    Training dan/atau sosialisasi di lokasi
                                                                </td>
                                                                <td style="border: 1px solid #000000; padding: 5px">
                                                                    Rp{{number_format(
        $mou->price_training_offline,
        0,
        ',',
        '.'
    )}} sekali bayar
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="text-align: center; border: 1px solid #000000; padding: 5px">
                                                                    2
                                                                </td>
                                                                <td
                                                                    style="width: 50%; border: 1px solid #000000; padding: 5px">
                                                                    Training dan/atau sosialisasi secara daring.
                                                                </td>
                                                                <td style="border: 1px solid #000000; padding: 5px">
                                                                    Rp{{number_format(
        $mou->price_training_online,
        0,
        ',',
        '.'
    )}}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td style="font-weight: bold; vertical-align: top; width: 4%;">
                                4.
                            </td>
                            <td>
                                <p style="font-weight: bold;">
                                    Pembayaran
                                </p>
                                <p style="text-align: justify;">
                                    Pihak Pertama berhak mengirimkan tagihan berupa <i>invoice</i> digital maupun
                                    tercetak
                                    untuk dibayar oleh Pihak Kedua dengan ketentuan sebagai berikut:
                                </p>
                                <div style="padding-left: 6px;">
                                    <table>
                                        <tbody style="text-align: justify;">
                                            <tr>
                                                <td style="vertical-align: top; width: 4%;">
                                                    a.
                                                </td>
                                                <td>
                                                    Pembayaran melalui tautan <i>(link)</i> atau cara lain yang
                                                    ditentukan
                                                    Pihak Pertama;
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top; width: 4%;">
                                                    b.
                                                </td>
                                                <td>
                                                    Sebelum batas waktu pembayaran yang ditentukan pada <i>invoice</i>.
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td style="font-weight: bold; vertical-align: top; width: 4%">
                                5
                            </td>
                            <td>
                                <p style="font-weight: bold">
                                    Harga Transaksi
                                </p>
                                <p style="text-align: justify">
                                    Pihak Pertama berhak
                                    menerima pembayaran dari
                                    penggunaan aplikasi untuk
                                    layanan yang diberikan
                                    dengan ketentuan sebagai
                                    berikut:
                                </p>
                                <div style="padding-left: 6px">
                                    <table style="border-collapse: separate; border-spacing: 0 15px">
                                        <tbody>
                                            <tr>
                                                <td style="vertical-align: top; width: 4%;">
                                                    a.
                                                </td>
                                                <td style="width: 100%;">
                                                    <p style="margin-bottom: 5px">
                                                        Aplikasi Kartu Digital
                                                    </p>
                                                    <table style="width: 100%; border: 1px solid #000000;">
                                                        <thead style="font-weight: bold; background-color: #efefef">
                                                            <th
                                                                style="width: 5%; border: 1px solid #000000; padding: 5px">
                                                                No
                                                            </th>
                                                            <th
                                                                style="width: 35%; border: 1px solid #000000; padding: 5px">
                                                                Produk
                                                            </th>
                                                            <th
                                                                style="width: 35%; border: 1px solid #000000; padding: 5px">
                                                                Metode Pembayaran
                                                            </th>
                                                            <th style="border: 1px solid #000000; padding: 5px">
                                                                Harga
                                                            </th>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td
                                                                    style="text-align: center; vertical-align: top; border: 1px solid #000000; padding: 5px">
                                                                    1
                                                                </td>
                                                                <td
                                                                    style="width: 35%; vertical-align: top; border: 1px solid #000000; padding: 5px">
                                                                    Beli CazhPOIN nominal 10.000-249.999
                                                                </td>
                                                                <td style="border: 1px solid #000000; padding: 5px">
                                                                    <ul
                                                                        style="list-style-type: disc; list-style-position: inside;">
                                                                        <li>
                                                                            Virtual Account Bank
                                                                        </li>
                                                                        <li>
                                                                            Minimarket
                                                                        </li>
                                                                        <li>
                                                                            QRIS
                                                                        </li>
                                                                    </ul>
                                                                </td>
                                                                <td style="border: 1px solid #000000; padding: 5px">
                                                                    <ul>
                                                                        <li>
                                                                            Rp5.000
                                                                        </li>
                                                                        <li>
                                                                            Rp5.000
                                                                        </li>
                                                                        <li>
                                                                            {{$mou->fee_qris}}
                                                                        </li>
                                                                    </ul>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="text-align: center; vertical-align: top; border: 1px solid #000000; padding: 5px">
                                                                    2
                                                                </td>
                                                                <td
                                                                    style="width: 35%; vertical-align: top; border: 1px solid #000000; padding: 5px">
                                                                    Beli CazhPOIN nominal 250.000 dan/atau lebih
                                                                </td>
                                                                <td style="border: 1px solid #000000; padding: 5px">
                                                                    <ul
                                                                        style="list-style-type: disc; list-style-position: inside;">
                                                                        <li>
                                                                            Virtual Account Bank
                                                                        </li>
                                                                        <li>
                                                                            Minimarket
                                                                        </li>
                                                                        <li>
                                                                            QRIS
                                                                        </li>
                                                                    </ul>
                                                                </td>
                                                                <td style="border: 1px solid #000000; padding: 5px">
                                                                    <ul>
                                                                        <li>
                                                                            Gratis
                                                                        </li>
                                                                        <li>
                                                                            Gratis
                                                                        </li>
                                                                        <li>
                                                                            {{$mou->fee_qris}}
                                                                        </li>
                                                                    </ul>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="text-align: center; vertical-align: top; border: 1px solid #000000; padding: 5px">
                                                                    3
                                                                </td>
                                                                <td
                                                                    style="width: 35%; vertical-align: top; border: 1px solid #000000; padding: 5px">
                                                                    Isi Kartu
                                                                </td>
                                                                <td style="border: 1px solid #000000; padding: 5px">
                                                                    <ul
                                                                        style="list-style-type: disc; list-style-position: inside;">
                                                                        <li>
                                                                            Virtual Account Bank
                                                                        </li>
                                                                        <li>
                                                                            Minimarket
                                                                        </li>
                                                                        <li>
                                                                            QRIS
                                                                        </li>
                                                                        <li>
                                                                            Dana
                                                                        </li>
                                                                        <li>
                                                                            CazhPOIN
                                                                        </li>
                                                                    </ul>
                                                                </td>
                                                                <td style="border: 1px solid #000000; padding: 5px">
                                                                    <ul>
                                                                        <li>
                                                                            Rp7.500
                                                                        </li>
                                                                        <li>
                                                                            Rp7.500
                                                                        </li>
                                                                        <li>
                                                                            {{$mou->fee_qris}}
                                                                        </li>
                                                                        <li>
                                                                            2% dari nominal
                                                                        </li>
                                                                        <li>
                                                                            Rp{{number_format(
        $mou->fee_purchase_cazhpoin,
        0,
        ',',
        '.'
    )}}
                                                                        </li>
                                                                    </ul>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="text-align: center; vertical-align: top; border: 1px solid #000000; padding: 5px">
                                                                    4
                                                                </td>
                                                                <td
                                                                    style="width: 35%; vertical-align: top; border: 1px solid #000000; padding: 5px">
                                                                    Pembayaran Tagihan
                                                                </td>
                                                                <td style="border: 1px solid #000000; padding: 5px">
                                                                    <ul
                                                                        style="list-style-type: disc; list-style-position: inside;">
                                                                        <li>
                                                                            Virtual Account Bank
                                                                        </li>
                                                                        <li>
                                                                            Minimarket
                                                                        </li>
                                                                        <li>
                                                                            QRIS
                                                                        </li>
                                                                        <li>
                                                                            CazhPOIN
                                                                        </li>
                                                                    </ul>
                                                                </td>
                                                                <td style="border: 1px solid #000000; padding: 5px">
                                                                    <ul>
                                                                        <li>
                                                                            Rp7.500
                                                                        </li>
                                                                        <li>
                                                                            Rp7.500
                                                                        </li>
                                                                        <li>
                                                                            {{$mou->fee_qris}}
                                                                        </li>
                                                                        <li>
                                                                            Rp{{number_format(
        $mou->fee_bill_cazhpoin,
        0,
        ',',
        '.'
    )}}
                                                                        </li>
                                                                    </ul>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top; width: 4%;">
                                                    b.
                                                </td>
                                                <td style="width: 100%;">
                                                    <p style="margin-bottom: 5px">
                                                        Aplikasi Kasir Digital
                                                    </p>
                                                    <table style="width: 100%; border: 1px solid #000000;">
                                                        <thead style="font-weight: bold; background-color: #efefef">
                                                            <th
                                                                style="width: 5%; border: 1px solid #000000; padding: 5px">
                                                                No
                                                            </th>
                                                            <th
                                                                style="width: 60%; border: 1px solid #000000; padding: 5px">
                                                                Transaksi
                                                            </th>
                                                            <th style="border: 1px solid #000000; padding: 5px">
                                                                Harga per-transaksi
                                                            </th>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td
                                                                    style="text-align: center; border: 1px solid #000000; padding: 5px">
                                                                    1
                                                                </td>
                                                                <td
                                                                    style="width: 50%; border: 1px solid #000000; padding: 5px">
                                                                    Top-up kartu
                                                                </td>
                                                                <td style="border: 1px solid #000000; padding: 5px">
                                                                    Rp{{number_format(
        $mou->fee_topup_cazhpos,
        0,
        ',',
        '.'
    )}}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="text-align: center; border: 1px solid #000000; padding: 5px">
                                                                    2
                                                                </td>
                                                                <td
                                                                    style="width: 50%; border: 1px solid #000000; padding: 5px">
                                                                    Withdraw kartu
                                                                </td>
                                                                <td style="border: 1px solid #000000; padding: 5px">
                                                                    Rp{{number_format(
        $mou->fee_withdraw_cazhpos,
        0,
        ',',
        '.'
    )}}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="text-align: center; border: 1px solid #000000; padding: 5px">
                                                                    3
                                                                </td>
                                                                <td
                                                                    style="width: 50%; border: 1px solid #000000; padding: 5px">
                                                                    Transaksi pembelian produk
                                                                </td>
                                                                <td style="border: 1px solid #000000; padding: 5px">
                                                                    Rp0
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="text-align: center; border: 1px solid #000000; padding: 5px">
                                                                    4
                                                                </td>
                                                                <td
                                                                    style="width: 50%; border: 1px solid #000000; padding: 5px">
                                                                    Penarikan CazhBox dari Aplikasi Kasir
                                                                </td>
                                                                <td style="border: 1px solid #000000; padding: 5px">
                                                                    Rp7.500/transaksi
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td style="vertical-align: top; width: 4%;">
                                                    c.
                                                </td>
                                                <td style="width: 100%;">
                                                    <p style="margin-bottom: 5px">
                                                        Aplikasi Web Dashboard Sistem Manajemen Lembaga
                                                    </p>
                                                    <table style="width: 100%; border: 1px solid #000000;">
                                                        <thead style="background-color: #efefef; font-weight: bold;">
                                                            <th
                                                                style="width: 5%; border: 1px solid #000000; padding: 5px">
                                                                No
                                                            </th>
                                                            <th
                                                                style="width: 30%; border: 1px solid #000000; padding: 5px">
                                                                Transaksi
                                                            </th>
                                                            <th
                                                                style="width: 30%; border: 1px solid #000000; padding: 5px">
                                                                Jenis Transaksi
                                                            </th>
                                                            <th
                                                                style="width: 30%; border: 1px solid #000000; padding: 5px">
                                                                Harga per-transaksi
                                                            </th>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td
                                                                    style="text-align: center; vertical-align: top; border: 1px solid #000000; padding: 5px">
                                                                    1
                                                                </td>
                                                                <td
                                                                    style="width: 30%; vertical-align: top; border: 1px solid #000000; padding: 5px">
                                                                    Top-up saldo kartu
                                                                </td>
                                                                <td
                                                                    style="width: 30%; border: 1px solid #000000; padding: 5px">
                                                                    <ul
                                                                        style="list-style-type: disc; list-style-position: inside;">
                                                                        <li>
                                                                            Pengisian Tunai
                                                                        </li>
                                                                    </ul>
                                                                </td>
                                                                <td
                                                                    style="width: 30%; border: 1px solid #000000; padding: 5px">
                                                                    <ul>
                                                                        <li>
                                                                            Rp1.000
                                                                        </li>
                                                                    </ul>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="text-align: center; vertical-align: top; border: 1px solid #000000; padding: 5px">
                                                                    2
                                                                </td>
                                                                <td
                                                                    style="width: 30%; vertical-align: top; border: 1px solid #000000; padding: 5px">
                                                                    Pembayaran tagihan
                                                                </td>
                                                                <td
                                                                    style="width: 30%; border: 1px solid #000000; padding: 5px">
                                                                    <ul
                                                                        style="list-style-type: disc; list-style-position: inside;">
                                                                        <li>
                                                                            Tunai
                                                                        </li>
                                                                        <li>
                                                                            Saldo Kartu
                                                                        </li>
                                                                        <li>
                                                                            Cetak <i>invoice</i> untuk dibayar via bank
                                                                            atau minimarket
                                                                        </li>
                                                                    </ul>
                                                                </td>
                                                                <td
                                                                    style="width: 30%; border: 1px solid #000000; padding: 5px; vertical-align: top">
                                                                    <ul>
                                                                        <li>
                                                                            Rp0
                                                                        </li>
                                                                        <li>
                                                                            Rp{{number_format(
        $mou->fee_bill_saldokartu,
        0,
        ',',
        '.'
    )}}
                                                                        </li>
                                                                        <li>
                                                                            Rp7.500/transaksi
                                                                        </li>
                                                                    </ul>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="text-align: center; vertical-align: top; border: 1px solid #000000; padding: 5px">
                                                                    3
                                                                </td>
                                                                <td style="width: 30%; vertical-align: top; border: 1px solid #000000; padding: 5px"
                                                                    colspan=2>
                                                                    Penarikan CazhBox dari Dashboard
                                                                </td>

                                                                <td
                                                                    style="width: 30%; border: 1px solid #000000; padding: 5px">
                                                                    Rp7.500/transaksi
                                                                </td>
                                                            </tr>

                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>


                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td style="font-weight: bold; vertical-align: top; width: 4%;">
                                6.
                            </td>
                            <td>
                                <p style="font-weight: bold;">
                                    CazhBox
                                </p>
                                <div style="padding-left: 1.5rem;">
                                    <table>
                                        <tbody style="text-align: justify;">
                                            <tr>
                                                <td style="vertical-align: top; width: 4%;">
                                                    a.
                                                </td>
                                                <td>
                                                    Pihak Kedua menyetujui penampungan sementara semua hasil transaksi
                                                    non-tunai yang ditentukan Pihak Pertama dengan nama CazhBox;
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top; width: 4%;">
                                                    b.
                                                </td>
                                                <td>
                                                    Pencairan saldo CazhBox dapat dilakukan oleh Pihak Kedua kapan saja
                                                    dengan nominal minimal 10.000 tanpa batasan jumlah maksimal
                                                    pencairan;
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top; width: 4%;">
                                                    c.
                                                </td>
                                                <td>
                                                    Pihak Kedua harus mengkonfirmasi setiap pencairan saldo CazhBox;
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top; width: 4%;">
                                                    d.
                                                </td>
                                                <td>
                                                    Rekening bank milik Pihak Kedua adalah sebagai berikut:
                                                    <table style="width: 100%;">
                                                        <tbody>
                                                            <tr>
                                                                <td style="width: 20%;">
                                                                    Nama Bank
                                                                </td>
                                                                <td>
                                                                    : <b>{{$mou->bank}}</b>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="width: 20%;">
                                                                    Nomor Rekening
                                                                </td>
                                                                <td>
                                                                    : <b>{{$mou->account_bank_number}}</b>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="width: 20%;">
                                                                    Atas Nama
                                                                </td>
                                                                <td>
                                                                    : <b>{{$mou->account_bank_name}}</b>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top; width: 4%;">
                                                    e.
                                                </td>
                                                <td>
                                                    Pihak Kedua dapat mengajukan perubahan nomor rekening bank kapan
                                                    saja kepada Pihak Pertama dengan prioritas rekening bank atas nama
                                                    lembaga;
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td style="font-weight: bold; vertical-align: top; width: 4%;">
                                7.
                            </td>
                            <td>
                                <p style="font-weight: bold;">
                                    Bagi Hasil
                                </p>
                                <div style="padding-left: 1.5rem;">
                                    <table>
                                        <tbody style="text-align: justify;">
                                            <tr>
                                                <td style="vertical-align: top; width: 4%;">
                                                    a.
                                                </td>
                                                <td>
                                                    Pihak Kedua {{ $mou->profit_sharing ? "mendapatkan" : "tidak
                                                    mendapatkan" }} bagi hasil.
                                                    {{ $mou->profit_sharing ? $mou->profit_sharing_detail : "" }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td style="font-weight: bold; vertical-align: top; width: 3%;">
                                8.
                            </td>
                            <td>
                                <p style="font-weight: bold;">
                                    Masa Berlaku dan Ketentuan Lain
                                </p>
                                <div style="padding-left: 1.5rem;">
                                    <table>
                                        <tbody style="text-align: justify;">
                                            <tr>
                                                <td style="vertical-align: top; width: 3%;">
                                                    a.
                                                </td>
                                                <td>
                                                    Perjanjian ini mulai berlaku pada tanggal ditandatanganinya oleh
                                                    Para Pihak, sampai dengan <b>{{
    \Carbon\Carbon::parse($mou['expired_date'])->locale('id')->isoFormat('D
                                                        MMMM YYYY',
        'Do MMMM YYYY'
    ) }}</b>;
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top; width: 3%;">
                                                    b.
                                                </td>
                                                <td>
                                                    Dalam hal terjadi penghentian Perjanjian Kerja Sama oleh Pihak Kedua
                                                    sebelum tanggal perjanjian ini berakhir, Pihak Kedua tetap
                                                    berkewajiban membayar biaya langganan sesuai periode kerja sama yang
                                                    disepakati pada huruf (a);
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top; width: 3%;">
                                                    c.
                                                </td>
                                                <td>
                                                    Dalam hal terdapat perubahan, Para Pihak berhak mengajukan perubahan
                                                    dan menyepakatinya dalam Perjanjian Kerjasama baru;
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top; width: 3%;">
                                                    d.
                                                </td>
                                                <td>
                                                    Hal-hal lain yang belum tercantum di dalam Berita Acara Kesepakatan
                                                    ini disampaikan dalam addendum terpisah kemudian hari.
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>


            </div>
            <div class="px-8 flex flex-row mt-5 justify-between">
    <div  style="width:40%; height: 30%;">
        <p>
            Pihak Pertama,
        </p>
        <div style="width: 130px; height: 130px; overflow: hidden;" class="py-2">
            <img class="w-full h-full object-fit-cover" style="object-fit: cover; width:100%; height:100%;" src='{{ public_path("/storage/$mou->signature_image") }}' />
        </div>
        <p><b>{{$mou->signature_name}}</b></p>
    </div>
    <div  style="width:40%; height: 30%;">
        <p>Pihak Kedua</p>
        @if($mou->partner_pic_signature)
        <div style="width: 130px; height: 130px; overflow: hidden;" class="py-2">
            <img src='{{ public_path("storage/$mou->partner_pic_signature") }}' alt="" class="min-h-20 w-full h-full object-fit-cover" style="object-fit: cover; width:100%; height:100%;" />
            </div>
        @else
        <div style="min-height: 80px"></div>
        @endif
        <p><b>{{$mou->partner_pic}}</b></p>
    </div>
</div>



        </div>

    </div>



    </div>


</body>

</html>
