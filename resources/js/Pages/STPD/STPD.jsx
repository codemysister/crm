import React from "react";
import {
    Page,
    Document,
    Image,
    StyleSheet,
    View,
    Text,
    Font,
} from "@react-pdf/renderer";

import logo from "./cazh.png";
import ttd from "./ttd.png";
import Sen from "./Sen-Regular.ttf";
import SenBold from "./Sen-Bold.ttf";
// Font.register({
//     family: "Sen",
//     fonts: [{ src: Sen }, { src: SenBold, fontWeight: "bold" }],
//     format: "truetype",
// });
Font.register({
    family: "Sen",
    fonts: [
        { src: Sen }, // font-style: normal, font-weight: normal
        { src: SenBold, fontWeight: "600", fontStyle: "bold" },
    ],
});
const borderColor = "#90e5fc";
const styles = StyleSheet.create({
    page: {
        fontFamily: "Sen",
        fontSize: 11,
        paddingTop: 30,
        paddingLeft: 60,
        paddingRight: 60,
        lineHeight: 1.5,
        flexDirection: "column",
    },
    logo: {
        width: "50%",
    },
    heading: {
        fontWeight: "bold",
        fontStyle: "bold",
    },
    paragraf: {
        fontWeight: "normal",
        fontSize: "9px",
    },
    titleContainer: {
        display: "flex",
        flexDirection: "row",
        marginTop: 24,
        justifyContent: "between",
    },
    reportTitle: {
        color: "#61dafb",
        letterSpacing: 4,
        fontSize: 25,
        textAlign: "center",
        textTransform: "uppercase",
    },
    invoiceNoContainer: {
        flexDirection: "row",
        marginTop: 36,
        justifyContent: "flex-end",
    },
    invoiceDateContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    invoiceDate: {
        fontSize: 12,
        fontStyle: "bold",
    },
    label: {
        width: 60,
    },
    headerContainer: {
        marginTop: 36,
    },
    billTo: {
        marginTop: 20,
        paddingBottom: 3,
        fontFamily: "Helvetica-Oblique",
    },
    tableContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 15,
    },
    container: {
        flexDirection: "row",
        backgroundColor: "#CFE2F3",
        fontStyle: "bold",
        flexGrow: 1,
        paddingHorizontal: "6px",
        paddingTop: "2px",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        height: 24,
        fontSize: 12,
        paddingHorizontal: "6px",
    },

    total: {
        width: "15%",
        textAlign: "right",
        paddingRight: 8,
    },
    titleContainer: {
        flexDirection: "row",
        marginTop: 12,
        alignItems: "center",
        backgroundColor: "purple",
    },
    reportTitle: {
        fontSize: 12,
        textAlign: "center",
        textTransform: "uppercase",
    },
});

const SPD = ({ data, staff, ubahFormatTanggal }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Image style={{ width: "30%", height: "50%" }} src={logo} />
                    <View
                        style={{
                            lineHeight: "1px",
                            width: "50%",
                            textAlign: "right",
                        }}
                    >
                        <Text style={styles.heading}>
                            PT. CAZH TEKNOLOGI INOVASI
                        </Text>
                        <Text style={styles.paragraf}>
                            Bonavida Park D1, Jl. Raya Karanggintung
                        </Text>
                        <Text style={styles.paragraf}>
                            Kec. Sumbang, Kab. Banyumas,
                        </Text>
                        <Text style={styles.paragraf}>Jawa Tengah 53183</Text>
                        <Text style={styles.paragraf}>hello@cazh.id</Text>
                    </View>
                </View>
                <View
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "30px",
                        textAlign: "center",
                    }}
                >
                    <Text
                        style={{
                            fontStyle: "bold",
                            textDecoration: "underline",
                        }}
                    >
                        SURAT KETERANGAN PERJALANAN DINAS
                    </Text>
                    <Text>Nomor : 001/CAZH-SPJ/X/2023</Text>
                </View>
                <View style={{ marginTop: "15px" }}>
                    <Text>
                        Dengan ini kami memberikan tugas kepada karyawan yang
                        disebutkan dibawah ini:
                    </Text>
                </View>
                <View style={styles.tableContainer}>
                    <View style={styles.container}>
                        <Text style={{ width: "10%", textAlign: "center" }}>
                            No.
                        </Text>
                        <Text style={{ width: "50%", textAlign: "left" }}>
                            Nama Karyawan
                        </Text>
                        <Text style={{ width: "40%", textAlign: "left" }}>
                            Jabatan
                        </Text>
                    </View>
                    {staff?.map((item, i) => (
                        <View style={styles.row} key={item.name + i}>
                            <Text style={{ width: "10%", textAlign: "center" }}>
                                {++i}
                            </Text>
                            <Text style={{ width: "50%", textAlign: "left" }}>
                                {item.name}
                            </Text>
                            <Text style={{ width: "40%", textAlign: "left" }}>
                                {item.roles[0].name}
                            </Text>
                        </View>
                    ))}
                </View>
                <View style={{ marginTop: "30px" }}>
                    <Text>
                        Untuk melaksanakan tugas melakukan perjalanan dinas
                        dengan ketentuan sebagai berikut:
                    </Text>
                </View>
                <View style={{ marginTop: "15px" }}>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={{ width: "25%" }}>Lembaga Tujuan</Text>
                        <Text style={{ width: "1%" }}>:</Text>
                        <Text style={{ fontStyle: "bold" }}>
                            {/* {data?.destination_institution ?? "N/A"} */}
                            {typeof data?.destination_institution === "object"
                                ? data.destination_institution.name
                                : data.destination_institution}
                        </Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={{ width: "25%" }}>Lokasi</Text>
                        <Text style={{ width: "1%" }}>:</Text>
                        <Text style={{ fontStyle: "bold" }}>
                            {data?.location ?? "N/A"}
                        </Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={{ width: "25%" }}>Berangkat</Text>
                        <Text style={{ width: "1%" }}>:</Text>
                        <Text style={{ fontStyle: "bold" }}>
                            {data?.departure_date !== ""
                                ? ubahFormatTanggal(
                                      new Date(data.departure_date)
                                  )
                                : "N/A"}
                        </Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={{ width: "25%" }}>Kembali</Text>
                        <Text style={{ width: "1%" }}>:</Text>
                        <Text style={{ fontStyle: "bold" }}>
                            {data?.return_date !== ""
                                ? ubahFormatTanggal(new Date(data.return_date))
                                : "N/A"}
                        </Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={{ width: "25%" }}>Kendaraan</Text>
                        <Text style={{ width: "1%" }}>:</Text>
                        <Text style={{ fontStyle: "bold" }}>
                            {data?.transportation ?? "N/A"}
                        </Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={{ width: "25%" }}>Akomodasi</Text>
                        <Text style={{ width: "1%" }}>:</Text>
                        <Text style={{ fontStyle: "bold" }}>
                            {data?.accommodation ?? "N/A"}
                        </Text>
                    </View>
                </View>
                <View style={{ marginTop: "15px", textAlign: "justify" }}>
                    <Text>
                        Semua biaya dalam perjalanan dinas, konsumsi, serta
                        akomodasi dalam rangka perjalanan dinas ini akan menjadi
                        tanggung jawab PT Cazh Teknologi Inovasi sesuai
                        peraturan perjalanan dinas yang berlaku
                    </Text>
                </View>
                <View style={{ marginTop: "15px", textAlign: "justify" }}>
                    <Text>
                        Demikian surat ini dibuat agar dapat dilaksanakan dengan
                        baik dan penuh tanggung jawab. Kepada semua pihak yang
                        terlibat dimohon kerja sama yang baik agar perjalanan
                        dinas ini dapat terlaksana dengan lancar.
                    </Text>
                </View>
                <View
                    style={{
                        width: "30%",
                        marginTop: "15px",
                        display: "flex",
                        justifyContent: "flex-start",
                    }}
                >
                    <Text>Purwokerto, {ubahFormatTanggal(new Date())}</Text>
                    <Image style={{ height: "50px" }} src={ttd} />
                    <Text>Muh Arif Mahfudin</Text>
                    <Text>CEO</Text>
                </View>
                <View
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "-30px",
                    }}
                >
                    <View
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            width: "40%",
                            textAlign: "left",
                            alignSelf: "flex-end",
                        }}
                    >
                        <Text>
                            ..........................,
                            ..........................
                        </Text>
                        <Text>Mengetahui*,</Text>

                        <Text style={{ marginTop: "50px" }}>
                            (....................................................)
                        </Text>
                        <Text style={{ fontSize: "8px" }}>
                            *)Tanda Tangan dan stempel lembaga tujuan
                        </Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default SPD;
