import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MonevRecord } from '../../types';
import {
  TrendingUp,
  Plus,
  Printer,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  X
} from 'lucide-react';

export const MonevView: React.FC = () => {
  const { monev, addMonev, updateMonev, deleteMonev, activeAcademicYear, schoolProfile, currentUser, showToast } = useApp();

  const [filterIRB, setFilterIRB] = useState<'all' | 'Identifikasi' | 'Refleksi' | 'Benahi'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'vice_curriculum';

  const [form, setForm] = useState<Omit<MonevRecord, 'id'>>({
    indicator: '',
    target: '100% Terlaksana',
    achievement: '85%',
    evidence: 'Dokumentasi arsip & lembar observasi',
    gapAnalysis: '',
    rootCause: '',
    recommendation: '',
    personInCharge: schoolProfile.viceCurriculumName,
    deadline: '2026-11-30',
    followUpStatus: 'Dalam Proses',
    cycleIRB: 'Refleksi'
  });

  const filtered = monev.filter(m => filterIRB === 'all' || m.cycleIRB === filterIRB);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addMonev(form);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-emerald-800" />
            <span>PENJAMINAN MUTU & SIKLUS PERBAIKAN BERKELANJUTAN</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mt-1">
            Monitoring, Evaluasi & Siklus IRB
          </h2>
          <p className="text-xs text-slate-500">
            Perencanaan Berbasis Data (PBD) dengan siklus Identifikasi Masalah, Refleksi Akar Masalah, dan Benahi Keterlaksanaan Kurikulum SMAN 1 Kakas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Indikator Monev</span>
            </button>
          )}
        </div>
      </div>

      {/* Cycle IRB Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs">
        {[
          { key: 'all', label: 'Semua Siklus IRB' },
          { key: 'Identifikasi', label: '1. Identifikasi (Capaian & Masalah)' },
          { key: 'Refleksi', label: '2. Refleksi (Akar Masalah)' },
          { key: 'Benahi', label: '3. Benahi (Rencana Perbaikan)' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterIRB(tab.key as any)}
            className={`px-4 py-2 font-semibold border-b-2 transition-all ${
              filterIRB === tab.key
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Monev Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="p-3 w-10">No</th>
                <th className="p-3">Siklus</th>
                <th className="p-3">Indikator Mutu Kurikulum</th>
                <th className="p-3">Target & Capaian Riil</th>
                <th className="p-3">Akar Masalah & Kesenjangan</th>
                <th className="p-3">Rekomendasi Benahi</th>
                <th className="p-3">PIC & Tenggat</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.cycleIRB === 'Identifikasi' ? 'bg-blue-100 text-blue-800' :
                      item.cycleIRB === 'Refleksi' ? 'bg-purple-100 text-purple-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.cycleIRB}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{item.indicator}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Bukti: {item.evidence}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-slate-500 text-[10px]">Target: {item.target}</div>
                    <div className="font-bold text-blue-900 text-xs">Capaian: {item.achievement}</div>
                  </td>
                  <td className="p-3 text-slate-700 max-w-xs">
                    <div className="text-[11px] leading-relaxed">{item.gapAnalysis}</div>
                    {item.rootCause && (
                      <div className="text-[10px] text-amber-800 font-medium mt-1">
                        Akar Masalah: {item.rootCause}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-slate-800 max-w-xs text-[11px] font-medium leading-relaxed">
                    {item.recommendation}
                  </td>
                  <td className="p-3 text-[11px] whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{item.personInCharge}</div>
                    <div className="font-mono text-slate-500 text-[10px]">{item.deadline}</div>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.followUpStatus === 'Selesai' ? 'bg-emerald-100 text-emerald-800' :
                      item.followUpStatus === 'Dalam Proses' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.followUpStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD MONEV ITEM */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Tambah Indikator Monitoring & Evaluasi</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Indikator Mutu Kurikulum *</label>
                <input
                  type="text"
                  required
                  value={form.indicator}
                  onChange={e => setForm({ ...form, indicator: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                  placeholder="misal: Ketertiban Jurnal Pembelajaran Guru & Kehadiran Kelas"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tahapan Siklus IRB</label>
                  <select
                    value={form.cycleIRB}
                    onChange={e => setForm({ ...form, cycleIRB: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                  >
                    <option value="Identifikasi">1. Identifikasi</option>
                    <option value="Refleksi">2. Refleksi</option>
                    <option value="Benahi">3. Benahi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Tindak Lanjut</label>
                  <select
                    value={form.followUpStatus}
                    onChange={e => setForm({ ...form, followUpStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                  >
                    <option value="Belum Ditindaklanjuti">Belum Ditindaklanjuti</option>
                    <option value="Dalam Proses">Dalam Proses</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target</label>
                  <input
                    type="text"
                    value={form.target}
                    onChange={e => setForm({ ...form, target: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    placeholder="100%"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Capaian Riil Saat Ini</label>
                  <input
                    type="text"
                    value={form.achievement}
                    onChange={e => setForm({ ...form, achievement: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    placeholder="misal: 92%"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Analisis Kesenjangan & Akar Masalah</label>
                <textarea
                  rows={2}
                  value={form.gapAnalysis}
                  onChange={e => setForm({ ...form, gapAnalysis: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  placeholder="Deskripsi kesenjangan antara target dan fakta di lapangan..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rekomendasi Benahi (Tindakan Nyata)</label>
                <textarea
                  rows={2}
                  value={form.recommendation}
                  onChange={e => setForm({ ...form, recommendation: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  placeholder="Langkah terukur yang akan diambil..."
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
                  Simpan Monev
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
