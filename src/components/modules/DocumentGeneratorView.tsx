import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OfficialDocument } from '../../types';
import { KopSurat } from '../common/KopSurat';
import {
  FileText,
  Printer,
  Save,
  CheckCircle2,
  Edit3,
  Award,
  Sparkles,
  FileCheck,
  Building,
  RotateCcw,
  Send
} from 'lucide-react';

export const DocumentGeneratorView: React.FC = () => {
  const {
    officialDocuments,
    addOfficialDocument,
    schoolProfile,
    activeAcademicYear,
    currentUser,
    showToast
  } = useApp();

  const [docType, setDocType] = useState<OfficialDocument['documentType']>('sk_kepala_sekolah');
  const [title, setTitle] = useState('SURAT KEPUTUSAN KEPALA SMA NEGERI 1 KAKAS TENTANG PEMBAGIAN TUGAS MENGAJAR TP 2026/2027');
  const [docNumber, setDocNumber] = useState(`${schoolProfile.letterNumberPrefix}042/VII/2026`);
  const [docDate, setDocDate] = useState('2026-07-11');
  const [signatoryRole, setSignatoryRole] = useState<'principal' | 'vice'>('principal');

  // SK Sections
  const [menimbang, setMenimbang] = useState([
    'Bahwa dalam rangka memperlancar jalannya Proses Belajar Mengajar di SMA Negeri 1 Kakas pada Tahun Pelajaran 2026/2027, perlu menetapkan pembagian tugas guru.',
    'Bahwa untuk menjamin kepastian hukum dan ketertiban administrasi, pembagian tugas tersebut perlu dituangkan dalam Surat Keputusan Kepala Sekolah.'
  ]);

  const [mengingat, setMengingat] = useState([
    'Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional.',
    'Undang-Undang Nomor 14 Tahun 2005 tentang Guru dan Dosen.',
    'Permendikbudristek Nomor 12 Tahun 2024 tentang Kurikulum pada PAUD, Dikdas, dan Dikmen.',
    'Kalender Pendidikan Dinas Pendidikan Daerah Provinsi Sulawesi Utara Tahun Pelajaran 2026/2027.'
  ]);

  const [memutuskan, setMemutuskan] = useState([
    'Menetapkan Pembagian Tugas Mengajar bagi Guru SMA Negeri 1 Kakas sebagaimana tercantum dalam Lampiran I keputusan ini.',
    'Menetapkan Pembagian Tugas Tambahan bagi Guru sebagaimana tercantum dalam Lampiran II keputusan ini.',
    'Masing-masing guru melaporkan pelaksanaan tugasnya secara berkala kepada Kepala Sekolah melalui Wakil Kepala Sekolah Bidang Kurikulum.'
  ]);

  const [previewMode, setPreviewMode] = useState(true);

  const signatoryName = signatoryRole === 'principal' ? schoolProfile.principalName : schoolProfile.viceCurriculumName;
  const signatoryTitle = signatoryRole === 'principal' ? 'Kepala Sekolah' : 'Wakil Kepala Sekolah Bidang Kurikulum';
  const signatoryNip = signatoryRole === 'principal' ? schoolProfile.principalNip : schoolProfile.viceCurriculumNip;

  const handleSaveToArchive = (status: OfficialDocument['status'] = 'established') => {
    addOfficialDocument({
      documentType: docType,
      title,
      documentNumber: docNumber,
      date: docDate,
      signatoryName,
      signatoryTitle,
      signatoryNip,
      academicYear: activeAcademicYear.year,
      semester: activeAcademicYear.activeSemester,
      status,
      version: 1,
      content: {
        menimbang,
        mengingat,
        memutuskan
      },
      createdBy: currentUser.name
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-blue-800" />
            <span>PUSAT GENERATOR TATA NASKAH DINAS RESMI</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mt-1">
            Generator Dokumen & SK Kurikulum
          </h2>
          <p className="text-xs text-slate-500">
            Penyusunan naskah dinas formal sekolah berbasis data induk tanpa mengarang nomor surat dan pejabat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{previewMode ? 'Mode Edit Formulir' : 'Pratinjau Kertas A4'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Dokumen</span>
          </button>

          <button
            onClick={() => handleSaveToArchive('established')}
            className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <Save className="w-4 h-4" />
            <span>Simpan ke Arsip Digital</span>
          </button>
        </div>
      </div>

      {/* Editor / Configuration */}
      {!previewMode ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Parameter Dokumen Resmi
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jenis Naskah Dinas *</label>
              <select
                value={docType}
                onChange={e => setDocType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
              >
                <option value="sk_kepala_sekolah">Surat Keputusan (SK) Kepala Sekolah</option>
                <option value="surat_tugas">Surat Tugas</option>
                <option value="surat_undangan">Surat Undangan Resmi</option>
                <option value="berita_acara">Berita Acara Rapat</option>
                <option value="notulen_rapat">Notulen Rapat Kurikulum</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor Surat Resmi *</label>
              <input
                type="text"
                value={docNumber}
                onChange={e => setDocNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Penetapan *</label>
              <input
                type="date"
                value={docDate}
                onChange={e => setDocDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Judul Lengkap Dokumen *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pejabat Penandatangan *</label>
              <select
                value={signatoryRole}
                onChange={e => setSignatoryRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
              >
                <option value="principal">Kepala Sekolah ({schoolProfile.principalName})</option>
                <option value="vice">Wakasek Kurikulum ({schoolProfile.viceCurriculumName})</option>
              </select>
            </div>
          </div>

          {/* Menimbang / Mengingat / Memutuskan */}
          <div className="space-y-4 pt-4 border-t border-slate-100 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Konsiderans Menimbang:</label>
              {menimbang.map((m, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <span className="font-mono font-bold text-slate-500 pt-2">{String.fromCharCode(97 + idx)}.</span>
                  <textarea
                    rows={2}
                    value={m}
                    onChange={e => {
                      const updated = [...menimbang];
                      updated[idx] = e.target.value;
                      setMenimbang(updated);
                    }}
                    className="flex-1 p-2 rounded-md border border-slate-300"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Konsiderans Mengingat:</label>
              {mengingat.map((mg, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <span className="font-mono font-bold text-slate-500 pt-2">{idx + 1}.</span>
                  <input
                    type="text"
                    value={mg}
                    onChange={e => {
                      const updated = [...mengingat];
                      updated[idx] = e.target.value;
                      setMengingat(updated);
                    }}
                    className="flex-1 px-3 py-2 rounded-md border border-slate-300"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Diktum Memutuskan:</label>
              {memutuskan.map((mp, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <span className="font-mono font-bold text-slate-500 pt-2">
                    {idx === 0 ? 'KESATU' : idx === 1 ? 'KEDUA' : idx === 2 ? 'KETIGA' : `KE-${idx + 1}`}:
                  </span>
                  <textarea
                    rows={2}
                    value={mp}
                    onChange={e => {
                      const updated = [...memutuskan];
                      updated[idx] = e.target.value;
                      setMemutuskan(updated);
                    }}
                    className="flex-1 p-2 rounded-md border border-slate-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* PRINTABLE A4 PREVIEW */
        <div className="bg-white p-8 sm:p-12 rounded-xl border border-slate-300 shadow-md max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 font-serif">
          <KopSurat />

          {/* Title decree */}
          <div className="text-center my-6 space-y-1">
            <h3 className="font-black text-sm uppercase text-slate-900 tracking-wider">
              KEPUTUSAN KEPALA SEKOLAH MENENGAH ATAS NEGERI 1 KAKAS
            </h3>
            <div className="text-xs font-mono font-bold text-slate-800">
              NOMOR : {docNumber}
            </div>
            <div className="text-xs font-bold uppercase text-slate-800 pt-1">
              TENTANG
            </div>
            <h4 className="font-black text-sm uppercase text-slate-900 max-w-2xl mx-auto">
              {title.replace('SURAT KEPUTUSAN KEPALA SMA NEGERI 1 KAKAS TENTANG ', '')}
            </h4>
            <div className="text-xs font-bold text-slate-800 pt-2 uppercase">
              KEPALA SMA NEGERI 1 KAKAS,
            </div>
          </div>

          {/* Menimbang */}
          <div className="space-y-4 text-xs text-justify leading-relaxed">
            <div className="flex items-start gap-4">
              <span className="w-24 font-bold text-slate-900">Menimbang</span>
              <span className="font-bold">:</span>
              <div className="flex-1 space-y-1.5">
                {menimbang.map((m, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-mono">{String.fromCharCode(97 + idx)}.</span>
                    <p>{m}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mengingat */}
            <div className="flex items-start gap-4">
              <span className="w-24 font-bold text-slate-900">Mengingat</span>
              <span className="font-bold">:</span>
              <div className="flex-1 space-y-1.5">
                {mengingat.map((mg, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-mono">{idx + 1}.</span>
                    <p>{mg}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Memutuskan */}
            <div className="text-center font-black tracking-widest uppercase pt-2">
              MEMUTUSKAN :
            </div>

            <div className="flex items-start gap-4">
              <span className="w-24 font-bold text-slate-900">Menetapkan</span>
              <span className="font-bold">:</span>
              <div className="flex-1 space-y-2">
                {memutuskan.map((mp, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-bold whitespace-nowrap">
                      {idx === 0 ? 'KESATU' : idx === 1 ? 'KEDUA' : idx === 2 ? 'KETIGA' : `KE-${idx + 1}`} :
                    </span>
                    <p>{mp}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Signature Block */}
          <div className="mt-12 flex justify-end">
            <div className="text-left w-64 space-y-16 text-xs">
              <div>
                Ditetapkan di : Kakas<br />
                Pada tanggal : {docDate}<br />
                {signatoryTitle} SMA Negeri 1 Kakas,
              </div>
              <div>
                <div className="font-black underline uppercase text-slate-900">
                  {signatoryName}
                </div>
                <div className="font-mono text-[10px] text-slate-700">
                  NIP. {signatoryNip || '....................................'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
