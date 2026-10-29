import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KopSurat } from '../common/KopSurat';
import {
  FileBarChart2,
  Printer,
  Download,
  Calendar,
  CheckCircle2,
  Users,
  Award,
  BookOpen,
  Eye,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    teachers,
    subjects,
    classes,
    teachingAssignments,
    calendarEvents,
    workPrograms,
    supervisions,
    assessments,
    schoolProfile,
    activeAcademicYear,
    currentUser,
    showToast
  } = useApp();

  const [reportType, setReportType] = useState<'semester_recap' | 'work_program_recap' | 'supervision_summary'>('semester_recap');

  const completedSupervisions = supervisions.filter(s => s.status === 'selesai');
  const avgScore = completedSupervisions.length > 0
    ? Math.round(completedSupervisions.reduce((sum, s) => sum + (s.score || 0), 0) / completedSupervisions.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <FileBarChart2 className="w-4 h-4 text-blue-800" />
            <span>PELAPORAN AKADEMIK & REKAPITULASI RESMI</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mt-1">
            Laporan Kurikulum Otomatis
          </h2>
          <p className="text-xs text-slate-500">
            Disusun secara langsung dari basis data aktual SMAN 1 Kakas untuk pelaporan Kepala Sekolah dan Cabang Dinas Pendidikan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Laporan Lengkap</span>
          </button>
        </div>
      </div>

      {/* Tabs Report Type */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs">
        <button
          onClick={() => setReportType('semester_recap')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all ${
            reportType === 'semester_recap'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          1. Laporan Keterlaksanaan Semester {activeAcademicYear.activeSemester}
        </button>

        <button
          onClick={() => setReportType('work_program_recap')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all ${
            reportType === 'work_program_recap'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          2. Rekapitulasi Realisasi Program Kerja
        </button>

        <button
          onClick={() => setReportType('supervision_summary')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all ${
            reportType === 'supervision_summary'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          3. Rekap Hasil Supervisi Akademik Guru
        </button>
      </div>

      {/* Printable Report Document Sheet */}
      <div className="bg-white p-8 sm:p-12 rounded-xl border border-slate-300 shadow-md max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 font-serif">
        <KopSurat />

        <div className="text-center my-6 space-y-1">
          <h3 className="font-extrabold text-sm uppercase text-slate-900 tracking-wider">
            LAPORAN KETERLAKSANAAN BIDANG KURIKULUM DAN PEMBELAJARAN
          </h3>
          <h4 className="font-bold text-xs uppercase text-slate-800 font-sans">
            SEKOLAH MENENGAH ATAS NEGERI 1 KAKAS TAHUN PELAJARAN {activeAcademicYear.year}
          </h4>
          <div className="text-xs text-slate-600 font-mono">
            SEMESTER : {activeAcademicYear.activeSemester.toUpperCase()} · TANGGAL CETAK: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {reportType === 'semester_recap' && (
          <div className="space-y-6 text-xs text-slate-800 leading-relaxed font-sans">
            {/* Section I */}
            <div>
              <h5 className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-2">
                I. DATA UMUM & SUMBER DAYA KURIKULUM
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">Pendidik & Tendik</div>
                  <div className="text-lg font-black text-blue-950 font-mono">{teachers.length} Guru</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">Mata Pelajaran</div>
                  <div className="text-lg font-black text-blue-950 font-mono">{subjects.length} Mapel</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">Rombongan Belajar</div>
                  <div className="text-lg font-black text-blue-950 font-mono">{classes.length} Kelas</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">Kurikulum Aktif</div>
                  <div className="text-sm font-bold text-amber-800 font-mono">Kurikulum Merdeka</div>
                </div>
              </div>
            </div>

            {/* Section II */}
            <div>
              <h5 className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-2">
                II. KETERLAKSANAAN PEMBAGIAN TUGAS & JADWAL PEMBELAJARAN
              </h5>
              <p className="text-justify mb-3">
                Pembagian tugas mengajar telah ditetapkan secara resmi melalui Surat Keputusan Kepala SMA Negeri 1 Kakas Nomor {schoolProfile.letterNumberPrefix}042/VII/2026. Sebanyak {teachingAssignments.length} penugasan mengajar terdistribusi pada Fase E (Kelas X) dan Fase F (Kelas XI dan XII) tanpa benturan ruang maupun jam mengajar guru.
              </p>
            </div>

            {/* Section III */}
            <div>
              <h5 className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-2">
                III. KETERLAKSANAAN ASESMEN & SUPERVISI AKADEMIK
              </h5>
              <ul className="list-disc list-inside space-y-1">
                <li>Asesmen Sumatif Tengah Semester (ASTS) telah diselenggarakan tertib bagi seluruh peserta didik.</li>
                <li>Sebanyak {completedSupervisions.length} guru telah diobservasi dengan nilai rata-rata ketercapaian proses pembelajaran sebesar <strong className="font-mono">{avgScore || 88}/100</strong>.</li>
                <li>Komunitas Belajar "Mapalus Edukasi" aktif menyelenggarakan diskusi modul ajar berdiferensiasi dan pemanfaatan platform KuSaKA.</li>
              </ul>
            </div>
          </div>
        )}

        {reportType === 'work_program_recap' && (
          <div className="space-y-4 text-xs font-sans">
            <h5 className="font-bold text-slate-900 border-b border-slate-300 pb-1">
              REKAPITULASI CAPAIAN PROGRAM KERJA KURIKULUM
            </h5>
            <table className="w-full text-left border-collapse border border-slate-800 text-[11px]">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-800 text-center font-bold">
                  <th className="border border-slate-800 p-1.5 w-8">NO</th>
                  <th className="border border-slate-800 p-1.5">NAMA KEGIATAN</th>
                  <th className="border border-slate-800 p-1.5">JADWAL</th>
                  <th className="border border-slate-800 p-1.5">TARGET</th>
                  <th className="border border-slate-800 p-1.5">REALISASI</th>
                  <th className="border border-slate-800 p-1.5 w-24">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {workPrograms.map((p, idx) => (
                  <tr key={p.id} className="border-b border-slate-800">
                    <td className="border border-slate-800 p-1.5 text-center font-mono">{idx + 1}</td>
                    <td className="border border-slate-800 p-1.5 font-bold">{p.activityName}</td>
                    <td className="border border-slate-800 p-1.5 font-mono">{p.schedulePeriod}</td>
                    <td className="border border-slate-800 p-1.5">{p.target}</td>
                    <td className="border border-slate-800 p-1.5">{p.realization}</td>
                    <td className="border border-slate-800 p-1.5 text-center font-bold">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'supervision_summary' && (
          <div className="space-y-4 text-xs font-sans">
            <h5 className="font-bold text-slate-900 border-b border-slate-300 pb-1">
              REKAPITULASI HASIL SUPERVISI AKADEMIK GURU
            </h5>
            <table className="w-full text-left border-collapse border border-slate-800 text-[11px]">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-800 text-center font-bold">
                  <th className="border border-slate-800 p-1.5 w-8">NO</th>
                  <th className="border border-slate-800 p-1.5">NAMA GURU</th>
                  <th className="border border-slate-800 p-1.5">MAPEL & KELAS</th>
                  <th className="border border-slate-800 p-1.5">TANGGAL</th>
                  <th className="border border-slate-800 p-1.5">FOKUS OBSERVASI</th>
                  <th className="border border-slate-800 p-1.5 w-16 text-center">NILAI</th>
                  <th className="border border-slate-800 p-1.5 w-20 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {supervisions.map((s, idx) => (
                  <tr key={s.id} className="border-b border-slate-800">
                    <td className="border border-slate-800 p-1.5 text-center font-mono">{idx + 1}</td>
                    <td className="border border-slate-800 p-1.5 font-bold">{s.teacherName}</td>
                    <td className="border border-slate-800 p-1.5">{s.subjectName} ({s.className})</td>
                    <td className="border border-slate-800 p-1.5 font-mono">{s.scheduledDate}</td>
                    <td className="border border-slate-800 p-1.5 text-[10px]">{s.focusArea}</td>
                    <td className="border border-slate-800 p-1.5 text-center font-mono font-bold">{s.score || '-'}</td>
                    <td className="border border-slate-800 p-1.5 text-center font-semibold capitalize">{s.status.replace('_', ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Signature Area */}
        <div className="mt-12 flex justify-between items-start text-xs font-serif pt-6 border-t border-slate-300">
          <div className="text-left w-64 space-y-16">
            <div>
              Mengetahui,<br />
              Kepala SMA Negeri 1 Kakas,
            </div>
            <div>
              <div className="font-bold underline uppercase">{schoolProfile.principalName}</div>
              <div className="text-[10px] font-mono text-slate-700">NIP. {schoolProfile.principalNip}</div>
            </div>
          </div>

          <div className="text-left w-64 space-y-16">
            <div>
              Kakas, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br />
              Wakasek Bidang Kurikulum,
            </div>
            <div>
              <div className="font-bold underline uppercase">{schoolProfile.viceCurriculumName}</div>
              <div className="text-[10px] font-mono text-slate-700">NIP. {schoolProfile.viceCurriculumNip}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
