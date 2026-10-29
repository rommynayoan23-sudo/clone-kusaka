import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TeacherDevActivity } from '../../types';
import {
  GraduationCap,
  Plus,
  Printer,
  Download,
  Users,
  MapPin,
  Calendar,
  CheckCircle2,
  X
} from 'lucide-react';

export const TeacherDevView: React.FC = () => {
  const { teacherDev, addTeacherDev, currentUser, schoolProfile, activeAcademicYear } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Omit<TeacherDevActivity, 'id'>>({
    title: '',
    type: 'Komunitas Belajar',
    date: '2026-09-18',
    speaker: 'Rommy Senfrie Najoan, S.Pd.',
    venue: 'Lab Komputer SMAN 1 Kakas',
    participantsCount: 22,
    summary: '',
    followUpPlan: '',
    status: 'Direncanakan'
  });

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'vice_curriculum';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addTeacherDev(form);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-blue-800" />
            <span>PENGEMBANGAN PROFESIONAL & KOMUNITAS BELAJAR</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mt-1">
            Pengembangan Guru & Komunitas Belajar "Mapalus Edukasi"
          </h2>
          <p className="text-xs text-slate-500">
            Administrasi IHT, lokakarya, MGMP, pelatihan kurikulum merdeka, dan berbagi praktik baik SMAN 1 Kakas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              onClick={() => setShowModal(true)}
              className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kegiatan</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teacherDev.map(act => (
          <div
            key={act.id}
            className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3 flex flex-col justify-between hover:border-blue-300 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                  {act.type}
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {act.status}
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900">{act.title}</h3>

              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-800" />
                  <span className="font-mono">{act.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>Narasumber: {act.speaker} ({act.participantsCount} Peserta)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tempat: {act.venue}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                <span className="font-bold text-slate-800 block text-[11px]">Ringkasan & Rencana Tindak Lanjut:</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">{act.summary}</p>
                {act.followUpPlan && (
                  <p className="text-blue-900 text-[11px] font-medium pt-1">
                    Tindak Lanjut: {act.followUpPlan}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[10px]">Dokumentasi, Notulen & Daftar Hadir Terarsip</span>
              <button
                onClick={() => window.print()}
                className="p-1 text-slate-600 hover:text-slate-900"
                title="Cetak Berita Acara Kegiatan"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Catat Kegiatan Pengembangan Guru</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Kegiatan *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                  placeholder="misal: Lokakarya Penyusunan Modul Projek P5 Kearifan Lokal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kegiatan</label>
                  <select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                  >
                    <option value="IHT">In-House Training (IHT)</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Komunitas Belajar">Komunitas Belajar</option>
                    <option value="MGMP">MGMP</option>
                    <option value="Pelatihan Mandiri">Pelatihan Mandiri</option>
                    <option value="Berbagi Praktik Baik">Berbagi Praktik Baik</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Narasumber / Fasilitator</label>
                  <input
                    type="text"
                    required
                    value={form.speaker}
                    onChange={e => setForm({ ...form, speaker: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    placeholder="Nama narasumber"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jumlah Peserta</label>
                  <input
                    type="number"
                    min="1"
                    value={form.participantsCount}
                    onChange={e => setForm({ ...form, participantsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ringkasan Materi & Hasil</label>
                <textarea
                  rows={2}
                  value={form.summary}
                  onChange={e => setForm({ ...form, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  placeholder="Uraian hasil kegiatan..."
                />
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
                  Simpan Kegiatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
