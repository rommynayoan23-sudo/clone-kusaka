import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpenCheck,
  Search,
  Plus,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Filter,
  Sparkles,
  Layers,
  X
} from 'lucide-react';

interface DeviceItem {
  id: string;
  type: 'Modul Ajar' | 'ATP' | 'Capaian Pembelajaran (CP)' | 'Program Semester' | 'Kisi-kisi Asesmen' | 'LKPD';
  title: string;
  subjectName: string;
  phase: 'E' | 'F';
  grade: 'X' | 'XI' | 'XII';
  teacherName: string;
  status: 'Terverifikasi Waka' | 'Perlu Revisi' | 'Draf Pengajuan';
  updatedAt: string;
}

export const LearningDeviceView: React.FC = () => {
  const { teachers, subjects, activeAcademicYear, schoolProfile, currentUser, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const [devices, setDevices] = useState<DeviceItem[]>([
    {
      id: 'dev-01',
      type: 'Modul Ajar',
      title: 'Modul Ajar Bahasa Inggris: Analytical Exposition on Minahasa Local Tourism',
      subjectName: 'Bahasa Inggris',
      phase: 'E',
      grade: 'X',
      teacherName: 'Rommy Senfrie Najoan, S.Pd.',
      status: 'Terverifikasi Waka',
      updatedAt: '2026-07-20'
    },
    {
      id: 'dev-02',
      type: 'ATP',
      title: 'Alur Tujuan Pembelajaran Matematika Fase E SMA Negeri 1 Kakas',
      subjectName: 'Matematika (Umum)',
      phase: 'E',
      grade: 'X',
      teacherName: 'Drs. Ferry Mandolang',
      status: 'Terverifikasi Waka',
      updatedAt: '2026-07-15'
    },
    {
      id: 'dev-03',
      type: 'Modul Ajar',
      title: 'Modul Ajar Biologi: Ekologi dan Keanekaragaman Hayati Danau Tondano',
      subjectName: 'Biologi',
      phase: 'F',
      grade: 'XI',
      teacherName: 'Meivy S. Lengkong, S.Pd.',
      status: 'Terverifikasi Waka',
      updatedAt: '2026-07-25'
    },
    {
      id: 'dev-04',
      type: 'Modul Ajar',
      title: 'Modul Ajar Fisika: Energi Terbarukan & Pemanfaatan Geotermal Minahasa',
      subjectName: 'Fisika',
      phase: 'F',
      grade: 'XI',
      teacherName: 'Jefry Lumowa, S.Pd., M.Si.',
      status: 'Draf Pengajuan',
      updatedAt: '2026-08-05'
    },
    {
      id: 'dev-05',
      type: 'Kisi-kisi Asesmen',
      title: 'Kisi-Kisi Asesmen Sumatif Tengah Semester (ASTS) Bahasa Indonesia',
      subjectName: 'Bahasa Indonesia',
      phase: 'E',
      grade: 'X',
      teacherName: 'Dra. Selvie Rorong',
      status: 'Terverifikasi Waka',
      updatedAt: '2026-09-10'
    }
  ]);

  const [form, setForm] = useState<Omit<DeviceItem, 'id' | 'updatedAt'>>({
    type: 'Modul Ajar',
    title: '',
    subjectName: subjects[0]?.name || 'Matematika',
    phase: 'E',
    grade: 'X',
    teacherName: currentUser.name,
    status: 'Draf Pengajuan'
  });

  const filtered = devices.filter(d => {
    const matchSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.teacherName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === 'all' || d.type === filterType;
    return matchSearch && matchType;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: DeviceItem = {
      ...form,
      id: 'dev-' + Date.now(),
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setDevices([newItem, ...devices]);
    setShowAddModal(false);
    showToast('Perangkat ajar berhasil diajukan ke kurikulum.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <BookOpenCheck className="w-4 h-4 text-blue-800" />
            <span>PORTAL ADMINISTRASI & PERANGKAT PEMBELAJARAN</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mt-1">
            Perangkat Pembelajaran Pendidik
          </h2>
          <p className="text-xs text-slate-500">
            Modul ajar berdiferensiasi, CP, ATP, prota, promes, dan rubrik penilaian mendalam guru SMA Negeri 1 Kakas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Unggah Perangkat Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari modul ajar, guru, atau mata pelajaran..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-800 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-slate-400 text-[11px] font-semibold mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Jenis:
            </span>
            {['all', 'Modul Ajar', 'ATP', 'Kisi-kisi Asesmen', 'Program Semester'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap ${
                  filterType === type
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type === 'all' ? 'Semua Dokumen' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Device Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3 flex flex-col justify-between hover:border-blue-300 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200">
                  {item.type}
                </span>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  item.status === 'Terverifikasi Waka' ? 'bg-emerald-100 text-emerald-800' :
                  item.status === 'Draf Pengajuan' ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                {item.title}
              </h3>

              <div className="text-xs text-slate-600 space-y-0.5">
                <div>{item.subjectName} · Kelas {item.grade} (Fase {item.phase})</div>
                <div className="text-slate-500 font-medium">Penyusun: {item.teacherName}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[10px] font-mono">Ditinjau: {item.updatedAt}</span>
              <button
                onClick={() => showToast(`Mengunduh berkas ${item.title}...`, 'info')}
                className="p-1 text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="text-[11px]">Unduh</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADD LEARNING DEVICE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Unggah / Daftarkan Perangkat Ajar</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Dokumen Perangkat *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                  placeholder="misal: Modul Ajar Kimia: Ikatan Kimia Berbasis Konteks Air Danau Kakas"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Perangkat</label>
                  <select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                  >
                    <option value="Modul Ajar">Modul Ajar</option>
                    <option value="ATP">Alur Tujuan Pembelajaran (ATP)</option>
                    <option value="Capaian Pembelajaran (CP)">Capaian Pembelajaran (CP)</option>
                    <option value="Program Semester">Program Semester</option>
                    <option value="Kisi-kisi Asesmen">Kisi-kisi Asesmen</option>
                    <option value="LKPD">Lembar Kerja Peserta Didik (LKPD)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={form.subjectName}
                    onChange={e => setForm({ ...form, subjectName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tingkat Kelas & Fase</label>
                  <select
                    value={form.grade}
                    onChange={e => setForm({ ...form, grade: e.target.value as any, phase: e.target.value === 'X' ? 'E' : 'F' })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="X">Kelas X (Fase E)</option>
                    <option value="XI">Kelas XI (Fase F)</option>
                    <option value="XII">Kelas XII (Fase F)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Guru Penyusun</label>
                  <input
                    type="text"
                    required
                    value={form.teacherName}
                    onChange={e => setForm({ ...form, teacherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
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
                  Ajukan Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
