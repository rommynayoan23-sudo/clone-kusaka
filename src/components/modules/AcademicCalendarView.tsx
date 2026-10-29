import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarEvent } from '../../types';
import {
  CalendarDays,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Download,
  Trash2,
  Edit2,
  X,
  Clock,
  Calendar
} from 'lucide-react';

export const AcademicCalendarView: React.FC = () => {
  const {
    calendarEvents,
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    activeAcademicYear,
    schoolProfile,
    currentUser,
    showToast
  } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'vice_curriculum' || currentUser.role === 'curriculum_staff';

  const [form, setForm] = useState({
    title: '',
    category: 'kegiatan_belajar' as CalendarEvent['category'],
    startDate: '2026-09-01',
    endDate: '2026-09-01',
    semester: 'Ganjil' as 'Ganjil' | 'Genap',
    isOfficialVerified: true,
    description: '',
    color: '#1d4ed8'
  });

  const filteredEvents = calendarEvents.filter(ev => {
    return filterCategory === 'all' || ev.category === filterCategory;
  }).sort((a, b) => a.startDate.localeCompare(b.startDate));

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setForm({
      title: '',
      category: 'kegiatan_belajar',
      startDate: '2026-08-01',
      endDate: '2026-08-01',
      semester: activeAcademicYear.activeSemester,
      isOfficialVerified: true,
      description: '',
      color: '#1d4ed8'
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (ev: CalendarEvent) => {
    setEditingEvent(ev);
    setForm({
      title: ev.title,
      category: ev.category,
      startDate: ev.startDate,
      endDate: ev.endDate,
      semester: ev.semester,
      isOfficialVerified: ev.isOfficialVerified,
      description: ev.description,
      color: ev.color || '#1d4ed8'
    });
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      updateCalendarEvent({
        ...editingEvent,
        ...form
      });
    } else {
      addCalendarEvent({
        ...form
      });
    }
    setShowAddModal(false);
  };

  const exportCalendarCsv = () => {
    const header = 'Tanggal Mulai,Tanggal Selesai,Semester,Kategori,Nama Agenda Akademik,Status Verifikasi,Keterangan\n';
    const rows = filteredEvents.map(e =>
      `"${e.startDate}","${e.endDate}","${e.semester}","${e.category}","${e.title}","${e.isOfficialVerified ? 'Resmi Terverifikasi' : 'Perlu Verifikasi'}","${e.description}"`
    ).join('\n');

    const blob = new Blob(['\ufeff' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KALENDER-PENDIDIKAN-SMAN1-KAKAS-${activeAcademicYear.year.replace('/', '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Kalender pendidikan berhasil diekspor.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <CalendarDays className="w-4 h-4 text-blue-800" />
            <span>KALENDER AKADEMIK & HARI EFEKTIF SEKOLAH</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mt-1">
            Kalender Pendidikan SMA Negeri 1 Kakas
          </h2>
          <p className="text-xs text-slate-500">
            Tahun Pelajaran {activeAcademicYear.year} · Berdasarkan Kalender Resmi Dinas Pendidikan Daerah Prov. Sulut
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCalendarCsv}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-blue-700" />
            <span>Ekspor Kalender</span>
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
              <span>Tambah Agenda</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Categories */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 text-xs font-semibold mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Kategori:
        </span>
        {[
          { key: 'all', label: 'Semua Agenda' },
          { key: 'kegiatan_belajar', label: 'KBM Efektif' },
          { key: 'asesmen', label: 'Asesmen (ASTS/ASAS)' },
          { key: 'supervisi', label: 'Supervisi Akademik' },
          { key: 'pengembangan_guru', label: 'Pengembangan Guru' },
          { key: 'rapat', label: 'Rapat & Pleno' },
          { key: 'kokurikuler', label: 'Kokurikuler & MPLS' },
          { key: 'libur', label: 'Libur Sekolah' },
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setFilterCategory(cat.key)}
            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              filterCategory === cat.key
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Events Table / Timeline List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="p-3 w-10">No</th>
                <th className="p-3">Rentang Tanggal</th>
                <th className="p-3">Semester</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Uraian Kegiatan / Agenda Akademik</th>
                <th className="p-3 text-center">Status Verifikasi</th>
                {canEdit && <th className="p-3 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.map((ev, idx) => (
                <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                  <td className="p-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {ev.startDate === ev.endDate ? ev.startDate : `${ev.startDate} s/d ${ev.endDate}`}
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-slate-700">Sem. {ev.semester}</span>
                  </td>
                  <td className="p-3">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold text-white capitalize"
                      style={{ backgroundColor: ev.color || '#1e3a8a' }}
                    >
                      {ev.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-slate-900 text-sm">{ev.title}</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">{ev.description}</div>
                  </td>
                  <td className="p-3 text-center">
                    {ev.isOfficialVerified ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Resmi Terverifikasi
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-700 font-bold text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200" title="Belum diverifikasi surat keputusan resmi">
                        <AlertTriangle className="w-3.5 h-3.5" /> Perlu Verifikasi
                      </span>
                    )}
                  </td>
                  {canEdit && (
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(ev)}
                          className="p-1 text-blue-700 hover:text-blue-900 rounded hover:bg-blue-50"
                          title="Edit Agenda"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus agenda "${ev.title}"?`)) {
                              deleteCalendarEvent(ev.id);
                            }
                          }}
                          className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                          title="Hapus Agenda"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD/EDIT CALENDAR EVENT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingEvent ? 'Ubah Agenda Kalender' : 'Tambah Agenda Kalender Pendidikan'}
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
                <label className="block font-semibold text-slate-700 mb-1">Judul Kegiatan / Agenda *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                  placeholder="misal: Asesmen Sumatif Akhir Semester (ASAS) Ganjil"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Mulai *</label>
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={e => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Selesai *</label>
                  <input
                    type="date"
                    required
                    value={form.endDate}
                    onChange={e => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori Kegiatan *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                  >
                    <option value="kegiatan_belajar">KBM Efektif</option>
                    <option value="asesmen">Asesmen (ASTS/ASAS)</option>
                    <option value="supervisi">Supervisi Akademik</option>
                    <option value="pengembangan_guru">Pengembangan Guru / IHT</option>
                    <option value="rapat">Rapat Pleno Dewan Guru</option>
                    <option value="kokurikuler">Kokurikuler / P5 / MPLS</option>
                    <option value="libur">Libur Sekolah Resmi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                  <select
                    value={form.semester}
                    onChange={e => setForm({ ...form, semester: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="Ganjil">Semester Ganjil</option>
                    <option value="Genap">Semester Genap</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan Rinci</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 leading-relaxed"
                  placeholder="Tujuan, sasaran, dan deskripsi singkat agenda..."
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  id="isOfficialVerified"
                  checked={form.isOfficialVerified}
                  onChange={e => setForm({ ...form, isOfficialVerified: e.target.checked })}
                  className="w-4 h-4 text-blue-900 rounded"
                />
                <label htmlFor="isOfficialVerified" className="text-slate-800 font-semibold cursor-pointer">
                  Tandai sebagai Tanggal Resmi Terverifikasi (Dinas Sulut / SK Sekolah)
                </label>
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
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
