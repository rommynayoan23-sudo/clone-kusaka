import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TeachingAssignment } from '../../types';
import { KopSurat } from '../common/KopSurat';
import {
  Users2,
  Plus,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  Printer,
  Download,
  Trash2,
  X,
  FileSpreadsheet,
  Award
} from 'lucide-react';

export const TeachingAssignmentView: React.FC = () => {
  const {
    teachingAssignments,
    addTeachingAssignment,
    deleteTeachingAssignment,
    teachers,
    subjects,
    classes,
    schoolProfile,
    activeAcademicYear,
    currentUser,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'matrix' | 'recap' | 'print_decree'>('matrix');
  const [showAddModal, setShowAddModal] = useState(false);

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'vice_curriculum';

  const [form, setForm] = useState({
    teacherId: teachers[0]?.id || '',
    subjectId: subjects[0]?.id || '',
    classRomBelId: classes[0]?.id || '',
    hoursPerWeek: 2,
    notes: 'Intrakurikuler Fase E'
  });

  // Calculate JJM summary for each teacher
  const teacherRecap = teachers.map(teacher => {
    const assignments = teachingAssignments.filter(a => a.teacherId === teacher.id);
    const directHours = assignments.reduce((sum, a) => sum + a.hoursPerWeek, 0);

    // Ekuivalensi tugas tambahan
    let additionalEquivalentHours = 0;
    if (teacher.additionalTask?.toLowerCase().includes('kepala sekolah')) {
      additionalEquivalentHours = 24;
    } else if (teacher.additionalTask?.toLowerCase().includes('wakil kepala sekolah')) {
      additionalEquivalentHours = 12;
    } else if (teacher.additionalTask?.toLowerCase().includes('wali kelas')) {
      additionalEquivalentHours = 2;
    } else if (teacher.additionalTask?.toLowerCase().includes('kepala perpustakaan') || teacher.additionalTask?.toLowerCase().includes('kepala lab')) {
      additionalEquivalentHours = 12;
    }

    const totalCalculatedHours = directHours + additionalEquivalentHours;
    const isMeetsRequirement = totalCalculatedHours >= 24;

    return {
      teacher,
      assignments,
      directHours,
      additionalEquivalentHours,
      totalCalculatedHours,
      isMeetsRequirement
    };
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const selTeacher = teachers.find(t => t.id === form.teacherId);
    const selSubject = subjects.find(s => s.id === form.subjectId);
    const selClass = classes.find(c => c.id === form.classRomBelId);

    if (!selTeacher || !selSubject || !selClass) return;

    // Check conflict: already assigned this class and subject to someone else?
    const existing = teachingAssignments.find(
      a => a.classRomBelId === form.classRomBelId && a.subjectId === form.subjectId
    );
    if (existing) {
      if (!confirm(`Peringatan: ${selClass.name} untuk mapel ${selSubject.name} sudah diampu oleh ${existing.teacherName}. Tetap tambahkan (misal sebagai tim teaching)?`)) {
        return;
      }
    }

    addTeachingAssignment({
      academicYear: activeAcademicYear.year,
      semester: activeAcademicYear.activeSemester,
      teacherId: selTeacher.id,
      teacherName: selTeacher.name,
      subjectId: selSubject.id,
      subjectName: selSubject.name,
      classRomBelId: selClass.id,
      classRomBelName: selClass.name,
      phase: selClass.phase,
      hoursPerWeek: form.hoursPerWeek,
      notes: form.notes
    });

    setShowAddModal(false);
  };

  const exportRecapCsv = () => {
    const header = 'Nama Guru,NIP,Tugas Tambahan,Jam Tatap Muka (Intra),Ekuivalensi Tambahan,Total JJM,Status Pemenuhan Beban (Min 24)\n';
    const rows = teacherRecap.map(r =>
      `"${r.teacher.name}","${r.teacher.nip}","${r.teacher.additionalTask || '-'}","${r.directHours}","${r.additionalEquivalentHours}","${r.totalCalculatedHours}","${r.isMeetsRequirement ? 'Memenuhi' : 'Belum Memenuhi'}"`
    ).join('\n');

    const blob = new Blob(['\ufeff' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `REKAP-BEBAN-MENGAJAR-SMAN1-KAKAS-${activeAcademicYear.year.replace('/', '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Rekapitulasi beban kerja guru berhasil diekspor ke CSV.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users2 className="w-5 h-5 text-blue-800" />
            Pembagian Tugas Mengajar & Beban Kerja Guru
          </h2>
          <p className="text-xs text-slate-500">
            Tahun Pelajaran {activeAcademicYear.year} ({activeAcademicYear.activeSemester}) · Parameter Permendikbudristek No. 15/2018 (Beban Kerja Minimal 24 JJM)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportRecapCsv}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-blue-700" />
            <span>Ekspor Rekap</span>
          </button>

          <button
            onClick={() => setActiveTab('print_decree')}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-700" />
            <span>Lampiran SK</span>
          </button>

          {canEdit && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Tugas Mengajar</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'matrix'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          1. Matriks Penugasan Kelas & Mapel ({teachingAssignments.length})
        </button>

        <button
          onClick={() => setActiveTab('recap')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'recap'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          2. Rekapitulasi Beban Guru (Validasi 24 JJM)
        </button>

        <button
          onClick={() => setActiveTab('print_decree')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'print_decree'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          3. Pratinjau Cetak Lampiran SK Resmi
        </button>
      </div>

      {/* TAB 1: MATRIX TABLE */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-3 w-10">No</th>
                  <th className="p-3">Nama Guru</th>
                  <th className="p-3">Mata Pelajaran</th>
                  <th className="p-3">Rombel / Kelas</th>
                  <th className="p-3 text-center">Fase</th>
                  <th className="p-3 text-center">Alokasi JJM</th>
                  <th className="p-3">Keterangan</th>
                  {canEdit && <th className="p-3 text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachingAssignments.map((a, idx) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-900">{a.teacherName}</td>
                    <td className="p-3 font-semibold text-blue-900">{a.subjectName}</td>
                    <td className="p-3 font-semibold text-slate-800">{a.classRomBelName}</td>
                    <td className="p-3 text-center font-bold text-amber-800">Fase {a.phase}</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-900 bg-slate-50/70">
                      {a.hoursPerWeek} Jam
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">{a.notes || '-'}</td>
                    {canEdit && (
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            if (confirm('Hapus penugasan mengajar ini?')) {
                              deleteTeachingAssignment(a.id);
                            }
                          }}
                          className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                          title="Hapus penugasan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RECAP WITH 24 JJM VALIDATION */}
      {activeTab === 'recap' && (
        <div className="space-y-4">
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-950 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Ketentuan Dasar Perhitungan Beban Kerja:</span>
              <p className="text-[11px] leading-relaxed">
                Berdasarkan ketentuan Permendikbud Nomor 15 Tahun 2018, guru sertifikasi wajib memenuhi beban kerja minimal 24 jam tatap muka ekuivalensi per minggu (maksimum 40 jam). Guru dengan tanda peringatan merah perlu diverifikasi kembali tugas tambahan atau alokasi rombelnya sebelum SK ditetapkan.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                    <th className="p-3 w-10">No</th>
                    <th className="p-3">Nama Lengkap & NIP</th>
                    <th className="p-3">Tugas Tambahan</th>
                    <th className="p-3 text-center">Tatap Muka (Intra)</th>
                    <th className="p-3 text-center">Ekuivalensi Tambahan</th>
                    <th className="p-3 text-center">Total Beban</th>
                    <th className="p-3 text-center">Status Pemenuhan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teacherRecap.map((r, idx) => (
                    <tr key={r.teacher.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{r.teacher.name}</div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {r.teacher.nip && r.teacher.nip !== '-' ? `NIP. ${r.teacher.nip}` : 'NIP: -'}
                        </div>
                      </td>
                      <td className="p-3 text-slate-700 font-medium">
                        {r.teacher.additionalTask || '-'}
                      </td>
                      <td className="p-3 text-center font-mono font-semibold text-slate-800">
                        {r.directHours} JJM
                      </td>
                      <td className="p-3 text-center font-mono text-blue-800 font-semibold">
                        +{r.additionalEquivalentHours} JJM
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-md font-mono font-bold text-xs ${
                          r.isMeetsRequirement
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-red-100 text-red-900'
                        }`}>
                          {r.totalCalculatedHours} JJM
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {r.isMeetsRequirement ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Memenuhi
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600 font-bold text-[11px]" title="Kurang dari 24 jam tatap muka ekuivalensi">
                            <AlertTriangle className="w-3.5 h-3.5" /> Kurang ({24 - r.totalCalculatedHours} Jam)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRINTABLE DECREE ATTACHMENT */}
      {activeTab === 'print_decree' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-100 p-3 rounded-lg text-xs">
            <span className="text-slate-600">
              Format lampiran resmi siap cetak / PDF untuk Surat Keputusan Kepala SMA Negeri 1 Kakas.
            </span>
            <button
              onClick={() => window.print()}
              className="px-4 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-md font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Dokumen Sekarang</span>
            </button>
          </div>

          <div className="bg-white p-8 rounded-lg border border-slate-300 shadow-md max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
            <KopSurat />

            <div className="text-center mb-6 space-y-1">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                LAMPIRAN I : SURAT KEPUTUSAN KEPALA SMA NEGERI 1 KAKAS
              </h3>
              <div className="text-xs font-mono text-slate-700">
                NOMOR : {schoolProfile.letterNumberPrefix}042/VII/2026
              </div>
              <div className="text-xs font-mono text-slate-700">
                TANGGAL : 11 Juli 2026
              </div>
              <h4 className="font-extrabold text-sm uppercase text-slate-900 pt-2">
                PEMBAGIAN TUGAS MENGAJAR DAN BEBAN KERJA GURU DALAM PROSES BELAJAR MENGAJAR TAHUN PELAJARAN {activeAcademicYear.year}
              </h4>
              <div className="text-xs text-slate-600">
                SEMESTER : {activeAcademicYear.activeSemester.toUpperCase()}
              </div>
            </div>

            <table className="w-full text-left border-collapse border border-slate-800 text-[11px] mb-8">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-800 text-center font-bold">
                  <th className="border border-slate-800 p-1.5 w-8">NO</th>
                  <th className="border border-slate-800 p-1.5">NAMA LENGKAP & NIP</th>
                  <th className="border border-slate-800 p-1.5">GOL</th>
                  <th className="border border-slate-800 p-1.5">MATA PELAJARAN</th>
                  <th className="border border-slate-800 p-1.5">ROMBEL</th>
                  <th className="border border-slate-800 p-1.5 w-12">JJM</th>
                  <th className="border border-slate-800 p-1.5">TUGAS TAMBAHAN</th>
                  <th className="border border-slate-800 p-1.5 w-14">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {teacherRecap.map((r, i) => (
                  <tr key={r.teacher.id} className="border-b border-slate-800">
                    <td className="border border-slate-800 p-1.5 text-center font-mono">{i + 1}</td>
                    <td className="border border-slate-800 p-1.5 font-bold">
                      {r.teacher.name}
                      <div className="font-normal font-mono text-[9px] text-slate-600">
                        NIP. {r.teacher.nip || '-'}
                      </div>
                    </td>
                    <td className="border border-slate-800 p-1.5 text-center font-mono">
                      {r.teacher.rankAndGrade.split('/')[1]?.trim() || '-'}
                    </td>
                    <td className="border border-slate-800 p-1.5 font-medium">
                      {r.teacher.primarySubject}
                    </td>
                    <td className="border border-slate-800 p-1.5">
                      {r.assignments.map(a => a.classRomBelName.replace('Kelas ', '')).join(', ') || '-'}
                    </td>
                    <td className="border border-slate-800 p-1.5 text-center font-mono font-bold">
                      {r.directHours}
                    </td>
                    <td className="border border-slate-800 p-1.5">
                      {r.teacher.additionalTask || '-'}
                    </td>
                    <td className="border border-slate-800 p-1.5 text-center font-mono font-black">
                      {r.totalCalculatedHours}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signature Area */}
            <div className="flex justify-between items-start text-xs pt-4">
              <div className="text-left w-64 space-y-16">
                <div>
                  Mengetahui,<br />
                  Wakil Kepala Sekolah Bidang Kurikulum,
                </div>
                <div>
                  <div className="font-bold underline uppercase">{schoolProfile.viceCurriculumName}</div>
                  <div className="text-[10px] font-mono text-slate-700">NIP. {schoolProfile.viceCurriculumNip}</div>
                </div>
              </div>

              <div className="text-left w-64 space-y-16">
                <div>
                  Ditetapkan di : Kakas<br />
                  Pada tanggal : 11 Juli 2026<br />
                  Kepala SMA Negeri 1 Kakas,
                </div>
                <div>
                  <div className="font-bold underline uppercase">{schoolProfile.principalName}</div>
                  <div className="text-[10px] font-mono text-slate-700">NIP. {schoolProfile.principalNip}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD TEACHING ASSIGNMENT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                Tambah Penugasan Mengajar Guru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Guru *</label>
                <select
                  value={form.teacherId}
                  onChange={e => setForm({ ...form, teacherId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.primarySubject})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Mata Pelajaran *</label>
                <select
                  value={form.subjectId}
                  onChange={e => setForm({ ...form, subjectId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name} ({s.weeklyHours} Jam)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Rombongan Belajar (Kelas) *</label>
                <select
                  value={form.classRomBelId}
                  onChange={e => setForm({ ...form, classRomBelId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Fase {c.phase})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alokasi JJM Tatap Muka per Minggu *</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={form.hoursPerWeek}
                  onChange={e => setForm({ ...form, hoursPerWeek: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Penugasan</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  placeholder="misal: Intrakurikuler Fase E / P5 Tema Kearifan Lokal"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-950"
                >
                  Simpan Penugasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
