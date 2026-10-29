import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AssessmentPlan } from '../../types';
import {
  ClipboardCheck,
  Plus,
  Printer,
  Download,
  Users,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck2,
  X
} from 'lucide-react';

export const AssessmentView: React.FC = () => {
  const { assessments, addAssessment, updateAssessment, deleteAssessment, activeAcademicYear, schoolProfile, currentUser, showToast } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<Omit<AssessmentPlan, 'id'>>({
    title: '',
    type: 'Sumatif Tengah Semester',
    academicYear: activeAcademicYear.year,
    semester: activeAcademicYear.activeSemester,
    startDate: '2026-09-21',
    endDate: '2026-09-26',
    committeeDecreeNumber: `${schoolProfile.letterNumberPrefix}088/IX/2026`,
    totalRooms: 7,
    totalParticipants: 215,
    totalProctors: 14,
    status: 'Pelaksanaan'
  });

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'vice_curriculum';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addAssessment(form);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <ClipboardCheck className="w-4 h-4 text-blue-800" />
            <span>MANAJEMEN ASESMEN & EVALUASI HASIL BELAJAR</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mt-1">
            Asesmen Sumatif & Penilaian Belajar
          </h2>
          <p className="text-xs text-slate-500">
            Pengelolaan ASTS, ASAS, SK Panitia, alokasi ruang, dan pengawas ujian SMAN 1 Kakas TP {activeAcademicYear.year}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Program Asesmen Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Assessment Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessments.map(plan => (
          <div
            key={plan.id}
            className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200">
                  {plan.type}
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 mt-1">{plan.title}</h3>
                <div className="text-[11px] font-mono text-slate-500">
                  SK Panitia: {plan.committeeDecreeNumber}
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                plan.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' :
                plan.status === 'Pelaksanaan' ? 'bg-blue-100 text-blue-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {plan.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Ruang Asesmen</span>
                <span className="font-extrabold text-slate-900 text-sm">{plan.totalRooms} Ruang</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Peserta Didik</span>
                <span className="font-extrabold text-blue-900 text-sm">{plan.totalParticipants} Siswa</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Pengawas Ruang</span>
                <span className="font-extrabold text-amber-800 text-sm">{plan.totalProctors} Guru</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="font-mono text-[11px]">
                Jadwal: {plan.startDate} s/d {plan.endDate}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-1 text-slate-600 hover:text-slate-900"
                  title="Cetak Tata Tertib & SK Panitia"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADD ASSESSMENT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                Rencana Pelaksanaan Asesmen Baru
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
                <label className="block font-semibold text-slate-700 mb-1">Nama / Judul Asesmen *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                  placeholder="misal: Asesmen Bakat Minat (ABM) Kelas XII"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Asesmen *</label>
                  <select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                  >
                    <option value="Sumatif Tengah Semester">Sumatif Tengah Semester</option>
                    <option value="Sumatif Akhir Semester">Sumatif Akhir Semester</option>
                    <option value="Sumatif Akhir Fase">Sumatif Akhir Fase</option>
                    <option value="Asesmen Bakat Minat">Asesmen Bakat Minat</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor SK Panitia</label>
                  <input
                    type="text"
                    value={form.committeeDecreeNumber}
                    onChange={e => setForm({ ...form, committeeDecreeNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

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
                  Simpan Rencana Asesmen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
