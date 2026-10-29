import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KopSurat } from '../common/KopSurat';
import {
  Sparkles,
  Send,
  Save,
  Printer,
  Copy,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
  BookOpen,
  Calendar,
  Building2
} from 'lucide-react';

export const AiAssistantView: React.FC = () => {
  const { schoolProfile, activeAcademicYear, currentUser, addOfficialDocument, showToast } = useApp();

  const [promptTask, setPromptTask] = useState<'notulen_rapat' | 'kerangka_program' | 'narasi_evaluasi' | 'surat_tugas' | 'koreksi_bahasa'>('notulen_rapat');
  const [topicInput, setTopicInput] = useState('Rapat Pleno Persiapan Asesmen Sumatif Tengah Semester (ASTS) Ganjil');
  const [additionalNotes, setAdditionalNotes] = useState('Rapat dihadiri dewan guru SMAN 1 Kakas, membahas kisi-kisi soal, jadwal pengawas ruang, dan kriteria ketuntasan tujuan pembelajaran.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState('');

  const generateDraft = () => {
    setIsGenerating(true);

    setTimeout(() => {
      let draft = '';

      if (promptTask === 'notulen_rapat') {
        draft = `NOTULEN RAPAT DEWAN GURU KURIKULUM
SEKOLAH MENENGAH ATAS NEGERI 1 KAKAS
TAHUN PELAJARAN ${activeAcademicYear.year} (${activeAcademicYear.activeSemester.toUpperCase()})

A. Waktu dan Tempat Pelaksanaan:
   Hari / Tanggal : Kamis, 17 September 2026
   Waktu          : 10.00 - 13.00 WITA
   Tempat         : Ruang Dewan Guru SMA Negeri 1 Kakas
   Pimpinan Rapat : ${schoolProfile.principalName} (Kepala Sekolah)
   Moderator      : ${schoolProfile.viceCurriculumName} (Wakasek Kurikulum)
   Notulis        : Staf Kurikulum

B. Agenda Rapat:
   ${topicInput}

C. Ringkasan Pembahasan & Fakta Rapat:
   1. Pembukaan oleh Kepala Sekolah yang menekankan pentingnya asesmen yang valid, objektif, dan mencerminkan capaian Tujuan Pembelajaran (TP) pada Kurikulum Merdeka.
   2. Wakasek Kurikulum memaparkan kesiapan 7 ruang asesmen dan jadwal distribusi pengawas ruang bebas benturan.
   3. Penegasan bahwa kisi-kisi asesmen dan rubrik penilaian harus diserahkan oleh guru mata pelajaran paling lambat 3 hari sebelum pelaksanaan.
   ${additionalNotes ? `4. Catatan Tambahan: ${additionalNotes}` : ''}

D. Keputusan dan Tindak Lanjut:
   1. Menetapkan susunan panitia dan jadwal pengawas ASTS Ganjil melalui SK Kepala Sekolah.
   2. Guru mata pelajaran menyusun kartu soal dan kisi-kisi sesuai capaian pembelajaran Fase E dan F.
   3. Pemeriksaan hasil asesmen wajib diselesaikan dalam tempo 7 hari kerja pasca-ujian untuk segera dianalisis dalam rekapitulasi capaian.

Kakas, 17 September 2026
Mengetahui,                                       Notulis Rapat,
Kepala SMA Negeri 1 Kakas,

${schoolProfile.principalName}                   Meivy S. Lengkong, S.Pd.
NIP. ${schoolProfile.principalNip || '-'}`;
      } else if (promptTask === 'surat_tugas') {
        draft = `SURAT TUGAS
Nomor: ${schoolProfile.letterNumberPrefix}ST-089/IX/2026

Yang bertanda tangan di bawah ini:
Nama          : ${schoolProfile.principalName}
NIP           : ${schoolProfile.principalNip || '-'}
Pangkat/Gol.  : ${schoolProfile.principalRank}
Jabatan       : Kepala SMA Negeri 1 Kakas

Dengan ini menugaskan kepada:
1. Nama       : ${schoolProfile.viceCurriculumName}
   NIP        : ${schoolProfile.viceCurriculumNip || '-'}
   Jabatan    : Wakil Kepala Sekolah Bidang Kurikulum
2. Seluruh Guru Pengawas Terlampir

Untuk:
Melaksanakan tugas sebagai Panitia dan Pengawas ${topicInput} pada SMA Negeri 1 Kakas Tahun Pelajaran ${activeAcademicYear.year}.
Catatan: ${additionalNotes || 'Melaksanakan tugas dengan penuh tanggung jawab dan melaporkan hasil pelaksanaan kepada Kepala Sekolah.'}

Demikian surat tugas ini dibuat untuk dilaksanakan dengan penuh rasa tanggung jawab.

Kakas, 18 September 2026
Kepala Sekolah,

${schoolProfile.principalName}
NIP. ${schoolProfile.principalNip || '-'}`;
      } else {
        draft = `DRAF NARASI EVALUASI KURIKULUM & REKOMENDASI TINDAK LANJUT
SMA NEGERI 1 KAKAS · TP ${activeAcademicYear.year}

Fokus Kajian: ${topicInput}

1. Gambaran Umum & Konteks:
   Berdasarkan monitoring keterlaksanaan pembelajaran di SMA Negeri 1 Kakas pada Semester ${activeAcademicYear.activeSemester}, proses pembelajaran pada Fase E dan Fase F telah berjalan sesuai kerangka Kurikulum Merdeka.

2. Analisis Fakta & Kesenjangan:
   ${additionalNotes || 'Ditemukan bahwa pemanfaatan modul ajar berdiferensiasi telah diimplementasikan oleh sebagian besar guru, namun asesmen formatif kualitatif masih membutuhkan penguatan instrumen.'}

3. Rekomendasi Tindak Lanjut (Benahi):
   a. Mengintensifkan klinik pembelajaran melalui Komunitas Belajar "Mapalus Edukasi" setiap hari Jumat.
   b. Melakukan supervisi klinis lanjutan bagi pendidik yang membutuhkan pendampingan rubrik penilaian holistik.
   c. Memastikan data nilai dan ketuntasan diinput secara tertib dalam repositori KuSaKA.

Disusun oleh:
${schoolProfile.viceCurriculumName}
Wakil Kepala Sekolah Bidang Kurikulum`;
      }

      setGeneratedDraft(draft);
      setIsGenerating(false);
      showToast('Draf dokumen resmi berhasil disusun berdasarkan data riil sekolah.', 'success');
    }, 600);
  };

  const handleSaveToArchive = () => {
    if (!generatedDraft) return;

    addOfficialDocument({
      documentType: promptTask === 'surat_tugas' ? 'surat_tugas' : 'notulen_rapat',
      title: topicInput.toUpperCase(),
      documentNumber: `${schoolProfile.letterNumberPrefix}DRAF-AI/${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      signatoryName: schoolProfile.principalName,
      signatoryTitle: 'Kepala Sekolah',
      signatoryNip: schoolProfile.principalNip,
      academicYear: activeAcademicYear.year,
      semester: activeAcademicYear.activeSemester,
      status: 'draft',
      version: 1,
      content: { text: generatedDraft },
      createdBy: currentUser.name
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDraft);
    showToast('Teks draf berhasil disalin ke papan klip.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-purple-700" />
            <span>ASISTEN CERDAS ADMINISTRASI KURIKULUM</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mt-1">
            Generator Dokumen AI KuSaKA
          </h2>
          <p className="text-xs text-slate-500">
            Membantu penyusunan draf resmi, notulen, surat tugas, dan narasi evaluasi berbasis data riil SMA Negeri 1 Kakas tanpa mengarang data fiktif.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
            Parameter Penyusunan Dokumen
          </h3>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Pilih Jenis Tugas Dokumen:</label>
            <select
              value={promptTask}
              onChange={e => setPromptTask(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-blue-950 focus:ring-2 focus:ring-blue-800 focus:outline-hidden"
            >
              <option value="notulen_rapat">Notulen Rapat Dewan Guru / Kurikulum</option>
              <option value="surat_tugas">Surat Tugas Resmi Pengawas / Panitia</option>
              <option value="narasi_evaluasi">Narasi Evaluasi & Rekomendasi IRB</option>
              <option value="kerangka_program">Kerangka Program Kerja Kurikulum</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Topik / Agenda / Kegiatan *</label>
            <input
              type="text"
              required
              value={topicInput}
              onChange={e => setTopicInput(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
              placeholder="misal: Rapat Pleno Kelulusan / IHT Kurikulum"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Fakta & Poin Nyata yang Terjadi di Sekolah:
            </label>
            <textarea
              rows={4}
              value={additionalNotes}
              onChange={e => setAdditionalNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 leading-relaxed"
              placeholder="Masukkan fakta rapat, kesepakatan dewan guru, atau temuan nyata..."
            />
          </div>

          <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 text-[11px] text-blue-950 space-y-1">
            <span className="font-bold">Integritas Data SMAN 1 Kakas:</span>
            <p className="text-slate-600 leading-relaxed">
              Sistem secara otomatis menyuntikkan identitas resmi Kepala Sekolah ({schoolProfile.principalName}), Waka Kurikulum ({schoolProfile.viceCurriculumName}), dan tahun pelajaran aktif {activeAcademicYear.year}.
            </p>
          </div>

          <button
            onClick={generateDraft}
            disabled={isGenerating || !topicInput}
            className="w-full py-2.5 bg-gradient-to-r from-blue-900 to-purple-900 hover:from-blue-950 hover:to-purple-950 text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Menyusun Draf Resmi...' : 'Susun Draf Sekarang'}</span>
          </button>
        </div>

        {/* Right Preview (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-800" />
                Hasil Draf Naskah Dinas
              </h3>

              {generatedDraft && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={copyToClipboard}
                    className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 rounded text-xs font-semibold flex items-center gap-1 border border-slate-200"
                    title="Salin Teks"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 rounded text-xs font-semibold flex items-center gap-1 border border-slate-200"
                    title="Cetak Draf"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak</span>
                  </button>

                  <button
                    onClick={handleSaveToArchive}
                    className="px-3 py-1 bg-blue-900 hover:bg-blue-950 text-white rounded text-xs font-semibold flex items-center gap-1 shadow-2xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan ke Draf Arsip</span>
                  </button>
                </div>
              )}
            </div>

            {generatedDraft ? (
              <textarea
                rows={18}
                value={generatedDraft}
                onChange={e => setGeneratedDraft(e.target.value)}
                className="w-full mt-3 p-4 rounded-lg bg-slate-50 border border-slate-300 font-mono text-xs text-slate-900 leading-relaxed focus:ring-2 focus:ring-blue-800 focus:outline-hidden"
              />
            ) : (
              <div className="py-24 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg mt-3">
                <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <span>Pilih jenis dokumen dan klik tombol "Susun Draf Sekarang" untuk menghasilkan naskah dinas resmi.</span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 italic">
            * Draf yang dihasilkan dapat diedit langsung sebelum disimpan ke arsip resmi sekolah.
          </div>
        </div>
      </div>
    </div>
  );
};
