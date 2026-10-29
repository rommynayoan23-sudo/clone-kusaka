import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  BookOpen,
  GraduationCap,
  FileCheck2,
  FileClock,
  AlertCircle,
  CalendarDays,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    schoolProfile,
    activeAcademicYear,
    teachers,
    subjects,
    classes,
    officialDocuments,
    calendarEvents,
    supervisions,
    workPrograms,
    setActiveMenu
  } = useApp();

  const totalTeachers = teachers.length;
  const totalSubjects = subjects.length;
  const totalClasses = classes.length;
  const totalDocuments = officialDocuments.length;

  const draftDocs = officialDocuments.filter(d => d.status === 'draft' || d.status === 'in_review');
  const reviewNeededDocs = officialDocuments.filter(d => d.status === 'waiting_approval' || d.status === 'revision_needed');
  const approvedDocs = officialDocuments.filter(d => d.status === 'approved' || d.status === 'established');

  // Upcoming agenda (sorted by date)
  const upcomingEvents = [...calendarEvents]
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 4);

  // Near supervisions
  const pendingSupervisions = supervisions
    .filter(s => s.status === 'terjadwal' || s.status === 'belum_direncanakan')
    .slice(0, 3);

  // Work programs progress
  const completedPrograms = workPrograms.filter(p => p.status === 'Selesai').length;
  const inProgressPrograms = workPrograms.filter(p => p.status === 'Sedang Berjalan').length;
  const progressPercent = workPrograms.length > 0 ? Math.round((completedPrograms / workPrograms.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Hero Banner with School Context */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-6 sm:p-8 shadow-md border border-blue-900/40">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold tracking-wide">
            <Building2 className="w-3.5 h-3.5" />
            <span>PORTAL RESMI KURIKULUM SATU PINTU</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Selamat Datang di KuSaKA
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Sistem tata kelola kurikulum terpadu <strong className="text-amber-300 font-semibold">{schoolProfile.name}</strong>, Kecamatan {schoolProfile.subdistrict}, Kabupaten {schoolProfile.regency}. 
            Mengintegrasikan seluruh siklus administrasi, pembagian tugas mengajar, jadwal, KSP, asesmen, supervisi, dan dokumen resmi dinas.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Kepala Sekolah:</span>
              <span className="font-semibold text-white">{schoolProfile.principalName}</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Waka Kurikulum:</span>
              <span className="font-semibold text-amber-300">{schoolProfile.viceCurriculumName}</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Periode:</span>
              <span className="font-semibold text-white">TP {activeAcademicYear.year} ({activeAcademicYear.activeSemester})</span>
            </div>
          </div>
        </div>

        {/* Official SMAN 1 Kakas Logo Badge in Hero Banner */}
        <div className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 w-28 h-28 lg:w-32 lg:h-32 rounded-2xl bg-white/10 backdrop-blur-xs p-2.5 items-center justify-center border border-white/20 shadow-xl">
          <img
            src="/assets/aistudio/WhatsApp_Image_2025-11-20_at_12.29.19-removebg-preview__1__c9a0a08a.png"
            alt="Logo SMA Negeri 1 Kakas"
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>
      </div>

      {/* Main KPI Statistic Cards (Clickable) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Guru */}
        <div
          onClick={() => setActiveMenu('master_data')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Guru & Pendidik</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalTeachers}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <span className="font-semibold text-blue-700">100%</span>
              <span>Terdata di Induk</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Mata Pelajaran */}
        <div
          onClick={() => setActiveMenu('master_data')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mata Pelajaran</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalSubjects}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <span>Fase E & F (Kurikulum Merdeka)</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Rombongan Belajar */}
        <div
          onClick={() => setActiveMenu('master_data')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rombel / Kelas</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalClasses}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <span>Kelas X, XI, XII Kakas</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Dokumen Tersimpan */}
        <div
          onClick={() => setActiveMenu('digital_archive')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Dokumen & SK</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalDocuments}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <span className="text-emerald-700 font-semibold">{approvedDocs.length} Ditetapkan</span>
              <span>·</span>
              <span className="text-amber-700 font-medium">{draftDocs.length} Draf</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Matrix for Waka Kurikulum */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-800" />
            Tindakan Cepat Administrasi Kurikulum
          </h3>
          <span className="text-[11px] text-slate-500">Akses Satu Pintu</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveMenu('official_documents')}
            className="p-3 bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-900 rounded-lg border border-slate-200 shadow-2xs text-left transition-all flex flex-col justify-between"
          >
            <FileClock className="w-5 h-5 text-blue-700 mb-2" />
            <div>
              <div className="font-bold text-xs">Pusat Naskah Dinas</div>
              <div className="text-[10px] text-slate-500">SK, Surat Tugas, Berita Acara</div>
            </div>
          </button>

          <button
            onClick={() => setActiveMenu('teaching_assignment')}
            className="p-3 bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-900 rounded-lg border border-slate-200 shadow-2xs text-left transition-all flex flex-col justify-between"
          >
            <Users className="w-5 h-5 text-amber-700 mb-2" />
            <div>
              <div className="font-bold text-xs">Beban Jam Mengajar</div>
              <div className="text-[10px] text-slate-500">Cek Beban & Deteksi &lt;24 JJM</div>
            </div>
          </button>

          <button
            onClick={() => setActiveMenu('schedule_generator')}
            className="p-3 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 rounded-lg border border-slate-200 shadow-2xs text-left transition-all flex flex-col justify-between"
          >
            <CalendarDays className="w-5 h-5 text-emerald-700 mb-2" />
            <div>
              <div className="font-bold text-xs">Jadwal Bebas Benturan</div>
              <div className="text-[10px] text-slate-500">Matriks Kelas & Guru</div>
            </div>
          </button>

          <button
            onClick={() => setActiveMenu('ai_generator')}
            className="p-3 bg-white hover:bg-purple-50 text-slate-800 hover:text-purple-900 rounded-lg border border-slate-200 shadow-2xs text-left transition-all flex flex-col justify-between"
          >
            <Sparkles className="w-5 h-5 text-purple-700 mb-2" />
            <div>
              <div className="font-bold text-xs">Asisten AI KuSaKA</div>
              <div className="text-[10px] text-slate-500">Draf Notulen & Evaluasi</div>
            </div>
          </button>
        </div>
      </div>

      {/* Grid: Academic Agenda & Supervision Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Agenda Akademik Mendatang */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-800" />
                Agenda Akademik Terdekat SMAN 1 Kakas
              </h3>
              <p className="text-xs text-slate-500">Berdasarkan kalender pendidikan resmi semester {activeAcademicYear.activeSemester}</p>
            </div>
            <button
              onClick={() => setActiveMenu('academic_calendar')}
              className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1"
            >
              <span>Buka Kalender</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map(event => (
              <div
                key={event.id}
                className="flex items-start gap-3.5 p-3 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
              >
                <div
                  className="w-2.5 h-10 rounded-full flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: event.color || '#1e3a8a' }}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{event.title}</span>
                    <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {event.startDate}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">{event.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="capitalize text-blue-800 font-medium">
                      {event.category.replace('_', ' ')}
                    </span>
                    {event.isOfficialVerified && (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Terverifikasi Resmi
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (1 Col): Supervisi & Program Kerja */}
        <div className="space-y-6">
          {/* Progress Program Kerja */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-800" />
                Capaian Program Kerja Kurikulum
              </h3>
              <span className="text-xs font-bold text-blue-800">{progressPercent}%</span>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-700 to-amber-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[10px]">Tuntas</span>
                <span className="font-bold text-slate-900">{completedPrograms} Kegiatan</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-500 block text-[10px]">Sedang Berjalan</span>
                <span className="font-bold text-amber-700">{inProgressPrograms} Kegiatan</span>
              </div>
            </div>

            <button
              onClick={() => setActiveMenu('work_program')}
              className="w-full text-center text-xs font-semibold text-blue-800 hover:text-blue-900 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Lihat Rincian Program Kerja
            </button>
          </div>

          {/* Jadwal Supervisi Terdekat */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-purple-700" />
                Jadwal Supervisi Guru
              </h3>
              <button
                onClick={() => setActiveMenu('supervision')}
                className="text-[11px] text-blue-700 hover:underline font-semibold"
              >
                Semua
              </button>
            </div>

            <div className="space-y-2.5">
              {pendingSupervisions.map(sup => (
                <div key={sup.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{sup.teacherName}</span>
                    <span className="text-[10px] font-mono text-slate-500">{sup.scheduledDate}</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {sup.subjectName} · {sup.className}
                  </div>
                  <div className="text-[10px] text-purple-800 font-medium">
                    Fokus: {sup.focusArea}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
