import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkProgram } from '../../types';
import {
  Briefcase,
  Plus,
  Download,
  Printer,
  Trash2,
  Edit2,
  X,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

export const WorkProgramView: React.FC = () => {
  const {
    workPrograms,
    addWorkProgram,
    updateWorkProgram,
    deleteWorkProgram,
    schoolProfile,
    activeAcademicYear,
    currentUser,
    showToast
  } = useApp();

  const [activeSemesterTab, setActiveSemesterTab] = useState<'all' | 'Ganjil' | 'Genap' | 'Tahunan'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<WorkProgram | null>(null);

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'vice_curriculum';

  const [form, setForm] = useState<Omit<WorkProgram, 'id'>>({
    activityName: '',
    background: '',
    legalBasis: 'Permendikbudristek No. 12 Tahun 2024 tentang Kurikulum Merdeka.',
    objective: '',
    targetAudience: 'Dewan Guru dan Peserta Didik SMAN 1 Kakas',
    successIndicator: '',
    stages: '',
    schedulePeriod: 'Juli - Desember 2026',
    personInCharge: 'Wakasek Kurikulum (Rommy Senfrie Najoan, S.Pd.)',
    implementer: 'Tim Kurikulum SMAN 1 Kakas',
    physicalEvidence: 'Daftar Hadir, Notulen, Laporan Pelaksanaan, SK.',
    target: '100% Terlaksana',
    realization: 'Sedang Berjalan',
    status: 'Sedang Berjalan',
    semester: 'Tahunan'
  });

  const filteredPrograms = workPrograms.filter(p => {
    return activeSemesterTab === 'all' || p.semester === activeSemesterTab;
  });

  const handleOpenAdd = () => {
    setEditingProgram(null);
    setForm({
      activityName: '',
      background: '',
      legalBasis: 'Permendikbudristek No. 12 Tahun 2024 tentang Kurikulum Merdeka.',
      objective: '',
      targetAudience: 'Dewan Guru dan Peserta Didik SMAN 1 Kakas',
      successIndicator: '',
      stages: '',
      schedulePeriod: 'Semester Ganjil 2026/2027',
      personInCharge: 'Wakasek Kurikulum (Rommy Senfrie Najoan, S.Pd.)',
      implementer: 'Tim Kurikulum SMAN 1 Kakas',
      physicalEvidence: 'Daftar Hadir, Berita Acara, Laporan Kegiatan.',
      target: '100% Terlaksana',
      realization: 'Dalam Proses',
      status: 'Sedang Berjalan',
      semester: 'Ganjil'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p: WorkProgram) => {
    setEditingProgram(p);
    setForm({
      activityName: p.activityName,
      background: p.background,
      legalBasis: p.legalBasis,
      objective: p.objective,
      targetAudience: p.targetAudience,
      successIndicator: p.successIndicator,
      stages: p.stages,
      schedulePeriod: p.schedulePeriod,
      personInCharge: p.personInCharge,
      implementer: p.implementer,
      physicalEvidence: p.physicalEvidence,
      target: p.target,
      realization: p.realization,
      status: p.status,
      semester: p.semester
    });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProgram) {
      updateWorkProgram({
        ...editingProgram,
        ...form
      });
    } else {
      addWorkProgram({
        ...form
      });
    }
    setShowModal(false);
  };

  const exportWorkProgramCsv = () => {
    const header = 'Nama Kegiatan,Tujuan,Indikator Keberhasilan,Jadwal,Penanggung Jawab,Pelaksana,Bukti Fisik,Target,Realisasi,Status\n';
    const rows = filteredPrograms.map(p =>
      `"${p.activityName}","${p.objective}","${p.successIndicator}","${p.schedulePeriod}","${p.personInCharge}","${p.implementer}","${p.physicalEvidence}","${p.target}","${p.realization}","${p.status}"`
    ).join('\n');

    const blob = new Blob(['\ufeff' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PROGRAM-KERJA-WAKA-KURIKULUM-SMAN1-KAKAS-${activeAcademicYear.year.replace('/', '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Tabel program kerja berhasil diekspor ke format Excel/CSV.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <Briefcase className="w-4 h-4 text-blue-800" />
            <span>RENCANA KERJA WAKASEK BIDANG KURIKULUM</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mt-1">
            Program Kerja Kurikulum TP {activeAcademicYear.year}
          </h2>
          <p className="text-xs text-slate-500">
            Penanggung Jawab: {schoolProfile.viceCurriculumName} · Mengetahui: {schoolProfile.principalName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportWorkProgramCsv}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-blue-700" />
            <span>Ekspor Excel</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-700" />
            <span>Cetak</span>
          </button>

          {canEdit && (
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Program</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {[
          { key: 'all', label: `Semua Program (${workPrograms.length})` },
          { key: 'Tahunan', label: 'Program Tahunan' },
          { key: 'Ganjil', label: 'Semester Ganjil' },
          { key: 'Genap', label: 'Semester Genap' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveSemesterTab(tab.key as any)}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeSemesterTab === tab.key
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Program Work List */}
      <div className="space-y-4">
        {filteredPrograms.map((prog, idx) => (
          <div
            key={prog.id}
            className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4 hover:border-blue-300 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-blue-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">{prog.activityName}</h3>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Periode: {prog.schedulePeriod} · Periode {prog.semester}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                  prog.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' :
                  prog.status === 'Sedang Berjalan' ? 'bg-amber-100 text-amber-800' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {prog.status}
                </span>

                {canEdit && (
                  <div className="inline-flex items-center gap-1 ml-2">
                    <button
                      onClick={() => handleOpenEdit(prog)}
                      className="p-1 text-blue-700 hover:text-blue-900 rounded hover:bg-blue-50"
                      title="Edit Program"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus program "${prog.activityName}"?`)) {
                          deleteWorkProgram(prog.id);
                        }
                      }}
                      className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                      title="Hapus Program"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Grid Detail Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div>
                  <span className="font-bold text-slate-700 block">Tujuan & Sasaran:</span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{prog.objective}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block">Indikator Keberhasilan:</span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{prog.successIndicator}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block">Dasar Pelaksanaan / Regulasi:</span>
                  <p className="text-slate-500 text-[10px] italic">{prog.legalBasis}</p>
                </div>
              </div>

              <div className="space-y-2 bg-slate-50/60 p-3 rounded-lg border border-slate-100 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Penanggung Jawab:</span>
                  <span className="font-semibold text-slate-900">{prog.personInCharge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pelaksana:</span>
                  <span className="font-semibold text-slate-900">{prog.implementer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bukti Fisik:</span>
                  <span className="font-semibold text-slate-900">{prog.physicalEvidence}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Kinerja:</span>
                  <span className="font-bold text-blue-900">{prog.target}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1">
                  <span className="text-slate-500">Realisasi Lapangan:</span>
                  <span className="font-bold text-emerald-800">{prog.realization}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADD/EDIT WORK PROGRAM */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingProgram ? 'Ubah Rincian Program Kerja' : 'Tambah Program Kerja Kurikulum'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Kegiatan Program *</label>
                <input
                  type="text"
                  required
                  value={form.activityName}
                  onChange={e => setForm({ ...form, activityName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                  placeholder="misal: Pelaksanaan Supervisi Akademik & Observasi Kelas Pendidik"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jadwal / Rentang Waktu *</label>
                  <input
                    type="text"
                    required
                    value={form.schedulePeriod}
                    onChange={e => setForm({ ...form, schedulePeriod: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                    placeholder="Oktober - November 2026"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Keterlaksanaan</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                  >
                    <option value="Belum Mulai">Belum Mulai</option>
                    <option value="Sedang Berjalan">Sedang Berjalan</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Tertunda">Tertunda</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tujuan Kegiatan *</label>
                <textarea
                  rows={2}
                  required
                  value={form.objective}
                  onChange={e => setForm({ ...form, objective: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  placeholder="Meningkatkan mutu proses belajar mengajar dengan pendekatan coaching..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Indikator Keberhasilan *</label>
                <textarea
                  rows={2}
                  required
                  value={form.successIndicator}
                  onChange={e => setForm({ ...form, successIndicator: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  placeholder="100% guru terobservasi dengan tindak lanjut terukur..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bukti Fisik Administrasi</label>
                  <input
                    type="text"
                    value={form.physicalEvidence}
                    onChange={e => setForm({ ...form, physicalEvidence: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    placeholder="Instrumen Supervisi, Catatan Observasi, Berita Acara"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Kinerja</label>
                  <input
                    type="text"
                    value={form.target}
                    onChange={e => setForm({ ...form, target: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                    placeholder="100% Guru"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-950"
                >
                  Simpan Program Kerja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
