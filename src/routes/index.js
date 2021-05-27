import Home from "../pages/dosen/home";
import Profile from "../pages/profile";
import JadwalSesi from "../pages/mahasiswa/jadwalsesi";
import SoalSesi from "../pages/mahasiswa/soalsesi";
import SoalShow from "../pages/mahasiswa/soalshow";
import StudiKasus from "../pages/dosen/studikasus";
import TableData from "../pages/dosen/studikasus/tabelsample/tabledata";
import Kelas from "../pages/dosen/kelas";
import MhsKelas from "../pages/dosen/kelas/mhskelas";
import SoalCreate from "../pages/dosen/soalcreate";
import { faBox, faCalendarAlt, faChalkboard, faChartBar, faDatabase, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import SoalPaket from "../pages/dosen/soalpaket";
import Jadwal from "../pages/dosen/jadwal";
import Nilai from "../pages/mahasiswa/nilai";
import NilaiMhs from "../pages/dosen/nilaimhs";
import SoalDetail from "../pages/dosen/soaldetail";
import SoalPaketDetail from "../pages/dosen/soalpaketdetail";
import SoalPaketDetailAdd from "../pages/dosen/soalpaketdetail/soalpaketdetailadd";
import TabelSample from "../pages/dosen/studikasus/tabelsample";
import NilaiDetail from "../pages/dosen/nilaimhs/nilaidetail";

const routes = [
    {
        component: Home,
        path: "/",
    },
    {
        component: JadwalSesi,
        path: "/jadwalsesi",
        visible: true,
        icon: faCalendarAlt,
        name: "Jadwal Sesi",
        role: "mahasiswa"
    },
    {
        component: SoalSesi,
        path: "/soalsesi/:id",
    },
    {
        component: SoalShow,
        path: "/soal/:id",
    },
    {
        component: Nilai,
        path: "/nilai",
        visible: true,
        icon: faChartBar,
        name: "Nilai",
        role: "mahasiswa"
    },
    {
        component: Profile,
        path: "/profile",
    },
    {
        component: Jadwal,
        path: "/jadwal",
        visible: true,
        icon: faCalendarAlt,
        name: "Jadwal",
        role: "dosen"
    },
    {
        component: Kelas,
        path: "/kelas",
        visible: true,
        icon: faChalkboard,
        name: "Kelas",
        role: "dosen"
    },
    {
        component: StudiKasus,
        path: "/studikasus",
        visible: true,
        icon: faDatabase,
        name: "Studi Kasus",
        role: "dosen"
    },
    {
        component: TabelSample,
        path: "/studikasus/:id",
    },
    {
        component: TableData,
        path: "/studikasus/:id/data/:table",
    },
    {
        component: SoalCreate,
        path: "/soal",
        visible: true,
        icon: faFileAlt,
        name: "Soal",
        role: "dosen"
    },
    {
        component: SoalDetail,
        path: "/soaldetail/:id",
    },
    {
        component: SoalPaket,
        path: "/paketsoal",
        visible: true,
        icon: faBox,
        name: "Paket Soal",
        role: "dosen"
    },
    {
        component: SoalPaketDetail,
        path: "/paketsoal/:id",
    },
    {
        component: SoalPaketDetailAdd,
        path: "/paketsoal/:id/add",
    },
    {
        component: MhsKelas,
        path: "/kelas/:id",
    },
    {
        component: NilaiMhs,
        path: "/nilaimhs",
        visible: true,
        icon: faChartBar,
        name: "Nilai Mahasiswa",
        role: "dosen"
    },
    {
        component: NilaiDetail,
        path: "/nilaimhs/:mhs/schedule/:jadwal",
    },
];

export default routes;
