import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  HelpCircle,
  Compass,
  FileText,
  Users2,
  CalendarClock,
  ClipboardCheck,
  Eye,
  Archive,
  Sparkles,
  BookOpenCheck,
  ShieldCheck
} from 'lucide-react';

export const HelpGuideView: React.FC = () => {
  const { schoolProfile, activeAcademicYear, setActiveMenu } = useApp();

  const guides = [
    {
      title: '1. Alur Awal Tahun Pelajaran',
      icon: Compass,
      desc: 'Pastikan profil sekolah di menu "Profil Sekolah" sudah lengkap (Nama Kepala Sekolah, Waka Kurikulum, NPSN, dan Alamat). Selanjutnya tetapkan tahun pelajaran aktif pada menu "Pengaturan" atau bilah atas.'
    },
    {
      title: '2. Pemutakhiran Data Guru & Rombel',
      icon: Users2,
      desc: 'Perbarui data pendidik, status sertifikasi, tugas tambahan (seperti Wali Kelas atau Kepala Lab), serta jumlah rombel kelas X, XI, dan XII di menu "Data Induk Sekolah".'
    },
    {
      title: '3. Pembagian Tugas & Beban Mengajar (24 JJM)',
      icon: BookOpenCheck,
      desc: 'Input penugasan guru di menu "Pembagian Tugas Mengajar". Sistem otomatis menghitung total JJM langsung dan ekuivalensi tugas tambahan untuk memvalidasi pemenuhan syarat 24 jam mengajar.'
    },
    {
      title: '4. Penyusunan Jadwal Bebas Benturan',
      icon: CalendarClock,
      desc: 'Gunakan modul "Jadwal Pelajaran" untuk melihat matriks belajar harian. Sistem memastikan tidak ada guru yang bentrok mengajar di dua kelas sekaligus.'
    },
    {
      title: '5. Pengesahan KSP & Tata Naskah Dinas',
      icon: FileText,
      desc: 'KSP, SK Pembagian Tugas, SK Panitia Asesmen, dan Berita Acara dapat langsung dicetak atau disimpan ke arsip dengan KOP SURAT resmi SMA Negeri 1 Kakas.'
    },
    {
      title: '6. Penggunaan Asisten AI KuSaKA',
      icon: Sparkles,
      desc: 'Gunakan Generator Dokumen AI untuk merumuskan draf notulen rapat, surat tugas pengawas, atau analisis evaluasi pembelajaran berbasis fakta riil tanpa mengarang data.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-blue-800" />
            <span>PANDUAN OPERASIONAL & BANTUAN TEKNIS</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mt-1">
            Buku Petunjuk Aplikasi KuSaKA
          </h2>
          <p className="text-xs text-slate-500">
            Panduan lengkap tata kelola satu pintu bagi Wakil Kepala Sekolah Bidang Kurikulum, Staf, dan Dewan Guru SMAN 1 Kakas.
          </p>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {guides.map((g, idx) => {
          const Icon = g.icon;
          return (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">{g.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{g.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Support Info Card */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 space-y-3">
        <h3 className="font-bold text-sm text-amber-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Dukungan Teknis & Integritas Data Kurikulum
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Aplikasi KuSaKA dibangun khusus untuk menunjang tugas dan fungsi Wakil Kepala Sekolah Bidang Kurikulum ({schoolProfile.viceCurriculumName}) di bawah pengawasan Kepala Sekolah ({schoolProfile.principalName}) pada {schoolProfile.name}, Kecamatan Kakas, Kabupaten Minahasa, Sulawesi Utara. Segala format dokumen resmi telah mematuhi pedoman tata naskah dinas pendidikan daerah yang berlaku.
        </p>
      </div>
    </div>
  );
};
