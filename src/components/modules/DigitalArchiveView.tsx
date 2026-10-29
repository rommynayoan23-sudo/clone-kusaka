import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DigitalArchiveItem } from '../../types';
import {
  Archive,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit2,
  FileText,
  CheckCircle2,
  FileCheck2,
  Clock,
  Tag,
  X,
  ExternalLink
} from 'lucide-react';

export const DigitalArchiveView: React.FC = () => {
  const {
    digitalArchives,
    addDigitalArchive,
    updateDigitalArchive,
    deleteDigitalArchive,
    activeAcademicYear,
    currentUser,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewItem, setPreviewItem] = useState<DigitalArchiveItem | null>(null);

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'vice_curriculum' || currentUser.role === 'curriculum_staff';

  const [form, setForm] = useState<Omit<DigitalArchiveItem, 'id' | 'createdAt'>>({
    title: '',
    documentNumber: '',
    category: 'Surat Keputusan',
    academicYear: activeAcademicYear.year,
    semester: activeAcademicYear.activeSemester,
    creatorName: currentUser.name,
    status: 'established',
    version: '1.0',
    description: '',
    keywords: ['Kurikulum', 'SMAN 1 Kakas'],
    fileSize: '1.2 MB',
    fileFormat: 'PDF'
  });

  const categories = [
    'all',
    'KSP',
    'Program Kerja',
    'Kalender Pendidikan',
    'Pembagian Tugas Mengajar',
    'Jadwal Pelajaran',
    'Perangkat Pembelajaran',
    'Asesmen',
    'Supervisi Akademik',
    'Pengembangan Guru',
    'Monitoring dan Evaluasi',
    'Surat Keputusan',
    'Surat Tugas',
    'Laporan'
  ];

  const filteredArchives = digitalArchives.filter(item => {
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.documentNumber && item.documentNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;

    return matchSearch && matchCategory && matchStatus;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addDigitalArchive({
      ...form,
      keywords: typeof form.keywords === 'string' ? (form.keywords as string).split(',').map(s => s.trim()) : form.keywords
    });
    setShowAddModal(false);
  };

  const handleDownloadArchive = (item: DigitalArchiveItem) => {
    // Generate text/markdown export of archive metadata
    const content = `ARSIP DIGITAL KURIKULUM SMAN 1 KAKAS\n\nJudul: ${item.title}\nNomor Dokumen: ${item.documentNumber || '-'}\nKategori: ${item.category}\nTahun Pelajaran: ${item.academicYear} (${item.semester})\nVersi: ${item.version}\nStatus: ${item.status}\nPembuat: ${item.creatorName}\nTanggal Arsip: ${item.createdAt}\nDeskripsi: ${item.description}\nKata Kunci: ${item.keywords.join(', ')}\n\n[Dokumen resmi terverifikasi tersimpan dalam repositori satu pintu KuSaKA]`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ARSIP-${item.title.replace(/[\s\/]/g, '_')}.${item.fileFormat.toLowerCase() === 'intern' ? 'txt' : item.fileFormat.toLowerCase()}`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Dokumen arsip "${item.title}" berhasil diunduh.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <Archive className="w-4 h-4 text-blue-800" />
            <span>REPOSITORI DOKUMEN & NASKAH RESMI TERPUSAT</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mt-1">
            Arsip Digital KuSaKA
          </h2>
          <p className="text-xs text-slate-500">
            Penyimpanan terstruktur dokumen KSP, SK, Kalender, Jadwal, Supervisi, dan Laporan Kurikulum SMAN 1 Kakas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Unggah / Tambah Arsip</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari judul, nomor SK, kata kunci, atau deskripsi..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-800 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 text-xs self-start sm:self-auto">
            <span className="text-slate-500 text-[11px] font-semibold">Status Dokumen:</span>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 font-medium"
            >
              <option value="all">Semua Status</option>
              <option value="draft">Draf</option>
              <option value="in_review">Dalam Pemeriksaan</option>
              <option value="approved">Disetujui</option>
              <option value="established">Ditetapkan</option>
              <option value="archived">Diarsipkan</option>
            </select>
          </div>
        </div>

        {/* Categories pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold mr-1 flex items-center gap-1 whitespace-nowrap">
            <Filter className="w-3 h-3" /> Kategori:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Archive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArchives.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3 flex flex-col justify-between hover:border-blue-300 hover:shadow-xs transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200">
                  {item.category}
                </span>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  item.status === 'established' ? 'bg-emerald-100 text-emerald-800' :
                  item.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {item.status === 'established' ? 'Ditetapkan' :
                   item.status === 'approved' ? 'Disetujui' :
                   item.status === 'draft' ? 'Draf' : item.status}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                {item.title}
              </h3>

              {item.documentNumber && (
                <div className="text-[11px] font-mono text-slate-500">
                  No: {item.documentNumber}
                </div>
              )}

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1 pt-1">
                {item.keywords.slice(0, 3).map((kw, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="space-y-0.5 text-[10px]">
                <div>Versi {item.version} · {item.fileFormat}</div>
                <div>{item.createdAt} oleh {item.creatorName.split(',')[0]}</div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDownloadArchive(item)}
                  className="p-1.5 text-blue-700 hover:text-blue-900 rounded hover:bg-blue-50"
                  title="Unduh Berkas Arsip"
                >
                  <Download className="w-4 h-4" />
                </button>

                {canEdit && (
                  <button
                    onClick={() => {
                      if (confirm(`Yakin hapus arsip "${item.title}"?`)) {
                        deleteDigitalArchive(item.id);
                      }
                    }}
                    className="p-1.5 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                    title="Hapus Arsip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADD ARCHIVE ITEM */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                Tambah Dokumen ke Arsip Digital
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
                <label className="block font-semibold text-slate-700 mb-1">Judul Dokumen *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                  placeholder="misal: Laporan Supervisi Akademik Guru Semester Ganjil"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                  >
                    {categories.filter(c => c !== 'all').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Dokumen (Opsional)</label>
                  <input
                    type="text"
                    value={form.documentNumber}
                    onChange={e => setForm({ ...form, documentNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                    placeholder="421/045/SMAN1-KKS/2026"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Dokumen</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                  >
                    <option value="draft">Draf</option>
                    <option value="approved">Disetujui</option>
                    <option value="established">Ditetapkan Resmi</option>
                    <option value="archived">Diarsipkan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Format Berkas</label>
                  <select
                    value={form.fileFormat}
                    onChange={e => setForm({ ...form, fileFormat: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="PDF">PDF (Portable Document)</option>
                    <option value="DOCX">DOCX (Microsoft Word)</option>
                    <option value="XLSX">XLSX (Microsoft Excel)</option>
                    <option value="INTERN">Format Digital KuSaKA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi Singkat Dokumen</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  placeholder="Tujuan, ringkasan isi, dan catatan arsip..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kata Kunci (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={Array.isArray(form.keywords) ? form.keywords.join(', ') : form.keywords}
                  onChange={e => setForm({ ...form, keywords: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  placeholder="KSP, Kurikulum Merdeka, Evaluasi, Kakas"
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
                  Simpan ke Arsip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
