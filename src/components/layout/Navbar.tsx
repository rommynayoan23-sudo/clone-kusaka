import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Bell,
  Search,
  UserCheck,
  ChevronDown,
  Calendar,
  Download,
  Printer,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

interface NavbarProps {
  onOpenMobile: () => void;
}

const MENU_LABELS: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard Kurikulum', subtitle: 'Pusat pantauan operasional & dokumen akademik SMAN 1 Kakas' },
  school_profile: { title: 'Profil & Identitas Sekolah', subtitle: 'Informasi resmi, legalitas, kepala sekolah, dan data institusi' },
  master_data: { title: 'Data Induk Sekolah', subtitle: 'Basis data guru, rombel, mata pelajaran, dan beban jam mengajar' },
  curriculum_plan: { title: 'Perencanaan Kurikulum', subtitle: 'Karakteristik satuan pendidikan, visi, misi, dan analisis konteks' },
  curriculum_ksp: { title: 'Dokumen KSP (Kurikulum Merdeka)', subtitle: 'Penyusunan & pengesahan Kurikulum Satuan Pendidikan 2026/2027' },
  academic_calendar: { title: 'Kalender Pendidikan & Agenda', subtitle: 'Jadwal hari efektif, asesmen, supervisi, dan kegiatan akademik' },
  work_program: { title: 'Program Kerja Waka Kurikulum', subtitle: 'Rencana kerja tahunan dan semesteran Rommy Senfrie Najoan, S.Pd.' },
  teaching_assignment: { title: 'Pembagian Tugas Mengajar', subtitle: 'Distribusi beban kerja guru, ekuivalensi, dan SK pembagian tugas' },
  schedule_generator: { title: 'Generator Jadwal Pelajaran', subtitle: 'Matriks jam belajar berbasis kendala bebas benturan jam & ruang' },
  learning_device: { title: 'Perangkat Pembelajaran', subtitle: 'Modul ajar, CP, TP, ATP, kisi-kisi, dan instrumen asesmen mendalam' },
  assessment: { title: 'Asesmen & Penilaian', subtitle: 'Pengelolaan ASTS, ASAS, SK Panitia, berita acara, dan rekapitulasi' },
  supervision: { title: 'Supervisi Akademik', subtitle: 'Observasi kelas, refleksi pendidik, dan coaching tindak lanjut' },
  teacher_dev: { title: 'Pengembangan Profesional Guru', subtitle: 'IHT, lokakarya, MGMP, dan komunitas belajar Mapalus Edukasi' },
  monev: { title: 'Monitoring & Evaluasi (IRB)', subtitle: 'Siklus Identifikasi, Refleksi, Benahi dan keterlaksanaan kurikulum' },
  reports: { title: 'Laporan Kurikulum Otomatis', subtitle: 'Laporan berkala, semesteran, dan tahunan siap cetak/arsip' },
  official_documents: { title: 'Generator Dokumen Resmi', subtitle: 'Penyusunan SK, Surat Tugas, Undangan, Berita Acara, dan Notulen terintegrasi data induk' },
  digital_archive: { title: 'Arsip Digital Kurikulum', subtitle: 'Repositori terstruktur dokumen resmi, SK, dan naskah dinas' },
  ai_generator: { title: 'Generator AI KuSaKA', subtitle: 'Asisten cerdas perumusan draf naskah dinas dan telaah dokumen' },
  settings: { title: 'Pengaturan & Status Basis Data', subtitle: 'Status penyimpanan, skema data, integrasi cloud, dan pencadangan' },
  user_management: { title: 'Manajemen Pengguna & Otorisasi', subtitle: 'Pengaturan peran (RBAC), hak akses, dan log aktivitas' },
  help_guide: { title: 'Bantuan & Panduan KuSaKA', subtitle: 'Petunjuk teknis operasional bagi wakasek, guru, dan tim kurikulum' },
};

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobile }) => {
  const {
    activeMenu,
    setActiveMenu,
    schoolProfile,
    activeAcademicYear,
    academicYears,
    setActiveAcademicYear,
    setActiveSemester,
    currentUser,
    users,
    setCurrentUser,
    notifications,
    markNotificationRead,
    exportBackupJson
  } = useApp();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const menuInfo = MENU_LABELS[activeMenu] || { title: 'KuSaKA', subtitle: 'SMA Negeri 1 Kakas' };
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-18 px-4 lg:px-6 bg-white border-b border-slate-200/80 shadow-xs">
        {/* Left: Mobile menu toggle + Page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobile}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base lg:text-lg font-bold text-slate-900 tracking-tight">
                {menuInfo.title}
              </h1>
              <span className="hidden sm:inline-flex text-[11px] font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200">
                SMAN 1 Kakas
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block truncate max-w-md">
              {menuInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Actions, Academic Year Pill, Notifications, User Switcher */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Academic Year Quick Button */}
          <button
            onClick={() => setShowYearModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
            title="Klik untuk mengubah Tahun Pelajaran atau Semester"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-800" />
            <span className="font-semibold text-slate-900">TP {activeAcademicYear.year}</span>
            <span className="text-slate-400">·</span>
            <span className="text-blue-700 font-bold">{activeAcademicYear.activeSemester}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Quick Print current view */}
          <button
            onClick={() => window.print()}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
            title="Cetak tampilan dokumen"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak</span>
          </button>

          {/* Quick Backup Export */}
          <button
            onClick={exportBackupJson}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
            title="Unduh Cadangan Basis Data (JSON)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Cadangan</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Pemberitahuan sistem"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Pemberitahuan Akademik</span>
                  <span className="text-[11px] text-blue-700 font-medium">{unreadCount} belum dibaca</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.linkMenu) {
                          setActiveMenu(notif.linkMenu);
                          setShowNotifMenu(false);
                        }
                      }}
                      className={`p-3.5 hover:bg-slate-50 cursor-pointer flex gap-3 ${
                        !notif.isRead ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                        {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {notif.type === 'info' && <Info className="w-4 h-4 text-blue-600" />}
                        {notif.type === 'alert' && <ShieldAlert className="w-4 h-4 text-red-600" />}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="font-semibold text-slate-900">{notif.title}</div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 block pt-1">{notif.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Active User Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleModal(!showRoleModal)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 rounded-lg hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-900 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-400 shadow-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <div className="font-bold text-xs text-slate-900 truncate max-w-[130px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] font-medium text-amber-800 truncate max-w-[130px]">
                  {currentUser.roleTitle}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Role Switcher Dropdown */}
            {showRoleModal && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Beralih Pengguna / Peran (Simulasi RBAC)
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setCurrentUser(u.id);
                        setShowRoleModal(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors flex items-center justify-between ${
                        currentUser.id === u.id ? 'bg-blue-50/70 border-l-4 border-blue-800' : ''
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs text-slate-900">{u.name}</div>
                        <div className="text-[11px] text-slate-500">{u.roleTitle}</div>
                      </div>
                      {currentUser.id === u.id && (
                        <CheckCircle2 className="w-4 h-4 text-blue-800" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="px-4 pt-2 pb-1 border-t border-slate-100 mt-1">
                  <p className="text-[10px] text-slate-400">
                    Otorisasi server-ready membatasi tindakan sesuai wewenang jabatan.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Year & Semester Modal */}
      {showYearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-800" />
                Pengaturan Periode Kurikulum
              </h3>
              <button
                onClick={() => setShowYearModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pilih Tahun Pelajaran Aktif:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {academicYears.map(ay => (
                  <button
                    key={ay.id}
                    onClick={() => setActiveAcademicYear(ay.id)}
                    className={`p-3 rounded-lg border text-left text-xs transition-all ${
                      ay.isActive
                        ? 'border-blue-700 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-700/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-sm">TP {ay.year}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {ay.isActive ? 'Sedang Aktif' : 'Arsip Riwayat'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pilih Semester Aktif:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Ganjil', 'Genap'] as const).map(sem => (
                  <button
                    key={sem}
                    onClick={() => setActiveSemester(sem)}
                    className={`p-3 rounded-lg border text-center text-xs font-bold transition-all ${
                      activeAcademicYear.activeSemester === sem
                        ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-600/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    Semester {sem}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Minggu Efektif Ganjil:</span>
                <span className="font-semibold text-slate-900">{activeAcademicYear.effectiveWeeksGanjil} Minggu</span>
              </div>
              <div className="flex justify-between">
                <span>Minggu Efektif Genap:</span>
                <span className="font-semibold text-slate-900">{activeAcademicYear.effectiveWeeksGenap} Minggu</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowYearModal(false)}
                className="px-4 py-2 bg-blue-900 text-white text-xs font-semibold rounded-lg hover:bg-blue-950 transition-colors"
              >
                Tutup & Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
