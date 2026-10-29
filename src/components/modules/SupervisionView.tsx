import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SupervisionRecord } from '../../types';
import { Eye, Plus, Edit2, Trash2, CheckCircle2, Clock, Printer, X, Download, Star } from 'lucide-react';

export const SupervisionView: React.FC = () => {
  const { supervisions, addSupervision, updateSupervision, deleteSupervision, teachers, classes, schoolProfile, activeAcademicYear, currentUser, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'terjadwal' | 'selesai'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingSupervision, setEditingSupervision] = useState<SupervisionRecord | null>(null);

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'vice_curriculum' || currentUser.role === 'principal';

  const [form, setForm] = useState<Omit<SupervisionRecord, 'id'>>({
    teacherId: teachers[0]?.id || '',
    teacherName: teachers[0]?.name || '',
    subjectName: 'Matematika',
    className: 'Kelas X-1',
    scheduledDate: '2026-10-20',
    completedDate: '',
    supervisorName: schoolProfile.viceCurriculumName,
    status: 'terjadwal',
    focusArea: 'Penerapan Pembelajaran Berdiferensiasi & Pembelajaran Mendalam (Deep Learning)',
    observationNotes: '',
    strengths: '',
    growthAreas: '',
    constructiveFeedback: '',
    teacherReflection: '',
    actionPlan: '',
    score: 88
  });

  const filtered = supervisions.filter(s => {
    if (activeTab === 'terjadwal') return s.status === 'terjadwal' || s.status === 'belum_direncanakan';
    if (activeTab === 'selesai') return s.status === 'selesai' || s.status === 'terlaksana';
    return true;
  });

  const handleOpenAdd = () => {
    setEditingSupervision(null);
    setForm({
      teacherId: teachers[0]?.id || '',
      teacherName: teachers[0]?.name || '',
      subjectName: teachers[0]?.primarySubject || 'Matematika',
      className: classes[0]?.name || 'Kelas X-1',
      scheduledDate: '2026-10-25',
      completedDate: '',
      supervisorName: schoolProfile.viceCurriculumName,
      status: 'terjadwal',
      focusArea: 'Pembelajaran Berdiferensiasi & Pemanfaatan Media Kontekstual',
      observationNotes: '',
      strengths: '',
      growthAreas: '',
      constructiveFeedback: '',
      teacherReflection: '',
      actionPlan: '',
      score: 85
    });
    setShowModal(true);
  };

  const handleOpenEdit = (rec: SupervisionRecord) => {
    setEditingSupervision(rec);
    setForm({
      teacherId: rec.teacherId,
      teacherName: rec.teacherName,
      subjectName: rec.subjectName,
      className: rec.className,
      scheduledDate: rec.scheduledDate,
      completedDate: rec.completedDate || '',
      supervisorName: rec.supervisorName,
      status: rec.status,
      focusArea: rec.focusArea,
      observationNotes: rec.observationNotes || '',
      strengths: rec.strengths || '',
      growthAreas: rec.growthAreas || '',
      constructiveFeedback: rec.constructiveFeedback || '',
      teacherReflection: rec.teacherReflection || '',
      actionPlan: rec.actionPlan || '',
      score: rec.score || 85
    });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const selTeacher = teachers.find(t => t.id === form.teacherId);
    const teacherName = selTeacher ? selTeacher.name : form.teacherName;

    if (editingSupervision) {
      updateSupervision({
        ...editingSupervision,
        ...form,
        teacherName
      });
    } else {
      addSupervision({
        ...form,
        teacherName
      });
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
            <Eye className="w-4 h-4 text-purple-700" />
            <span>PENGELOLAAN SUPERVISI AKADEMIK & OBSERVASI KELAS</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mt-1">
            Supervisi Akademik Pembelajaran
          </h2>
          <p className="text-xs text-slate-500">
            Pendampingan pendidik SMAN 1 Kakas dengan pendekatan coaching, refleksi mendalam, dan tindak lanjut terukur.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Jadwalkan Supervisi</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all ${
            activeTab === 'all'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Semua Sasaran Guru ({supervisions.length})
        </button>
        <button
          onClick={() => setActiveTab('terjadwal')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all ${
            activeTab === 'terjadwal'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Terjadwal Mendatang
        </button>
        <button
          onClick={() => setActiveTab('selesai')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all ${
            activeTab === 'selesai'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Selesai & Ada Rekomendasi
        </button>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(rec => (
          <div
            key={rec.id}
            className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3 flex flex-col justify-between hover:border-purple-300 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">{rec.teacherName}</h3>
                  <div className="text-xs text-slate-500">{rec.subjectName} · {rec.className}</div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  rec.status === 'selesai' ? 'bg-emerald-100 text-emerald-800' :
                  rec.status === 'terjadwal' ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {rec.status.toUpperCase().replace('_', ' ')}
                </span>
              </div>

              <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-100 text-xs space-y-1">
                <span className="font-bold text-purple-950 block">Fokus Observasi:</span>
                <p className="text-slate-700 text-[11px] leading-relaxed">{rec.focusArea}</p>
              </div>

              {rec.status === 'selesai' && rec.observationNotes && (
                <div className="space-y-1.5 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-md border border-slate-100">
                    <span className="font-bold text-slate-800 text-[11px] block">Catatan Observasi Supervisor:</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed mt-0.5">{rec.observationNotes}</p>
                  </div>
                  {rec.constructiveFeedback && (
                    <div className="p-2.5 bg-emerald-50/50 rounded-md border border-emerald-100">
                      <span className="font-bold text-emerald-900 text-[11px] block">Umpan Balik Konstruktif:</span>
                      <p className="text-slate-700 text-[11px] leading-relaxed mt-0.5">{rec.constructiveFeedback}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="text-[11px]">
                <span>Tgl: {rec.scheduledDate} · Supervisor: {rec.supervisorName.split(',')[0]}</span>
                {rec.score && rec.score > 0 ? (
                  <span className="ml-2 font-mono font-bold text-purple-800">Skor: {rec.score}</span>
                ) : null}
              </div>

              {canEdit && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(rec)}
                    className="p-1 text-blue-700 hover:text-blue-900 rounded hover:bg-blue-50"
                    title="Ubah & Masukkan Catatan Observasi"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus data supervisi ${rec.teacherName}?`)) {
                        deleteSupervision(rec.id);
                      }
                    }}
                    className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                    title="Hapus Supervisi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: EDIT/OBSERVE SUPERVISION */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingSupervision ? 'Catatan & Hasil Observasi Supervisi' : 'Jadwalkan Supervisi Guru Baru'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Pilih Guru Sasaran *</label>
                  <select
                    value={form.teacherId}
                    onChange={e => {
                      const t = teachers.find(item => item.id === e.target.value);
                      setForm({
                        ...form,
                        teacherId: e.target.value,
                        teacherName: t ? t.name : form.teacherName,
                        subjectName: t ? t.primarySubject : form.subjectName
                      });
                    }}
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
                  <label className="block font-semibold text-slate-700 mb-1">Rombel / Kelas *</label>
                  <select
                    value={form.className}
                    onChange={e => setForm({ ...form, className: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Rencana Observasi *</label>
                  <input
                    type="date"
                    required
                    value={form.scheduledDate}
                    onChange={e => setForm({ ...form, scheduledDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Supervisor</label>
                  <input
                    type="text"
                    value={form.supervisorName}
                    onChange={e => setForm({ ...form, supervisorName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Supervisi</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                  >
                    <option value="terjadwal">Terjadwal</option>
                    <option value="terlaksana">Terlaksana (Menunggu Refleksi)</option>
                    <option value="selesai">Selesai (Ada Rekomendasi)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fokus Area Observasi *</label>
                <input
                  type="text"
                  required
                  value={form.focusArea}
                  onChange={e => setForm({ ...form, focusArea: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  placeholder="misal: Pembelajaran Berdiferensiasi & Pembelajaran Mendalam"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Hasil Observasi di Kelas</label>
                <textarea
                  rows={2}
                  value={form.observationNotes}
                  onChange={e => setForm({ ...form, observationNotes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  placeholder="Deskripsikan fakta interaksi belajar yang diobservasi..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Umpan Balik Konstruktif kepada Guru</label>
                <textarea
                  rows={2}
                  value={form.constructiveFeedback}
                  onChange={e => setForm({ ...form, constructiveFeedback: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  placeholder="Rekomendasi perbaikan proses pembelajaran..."
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
                  Simpan Supervisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
