import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { OfficialDocument, DocumentStatus } from '../../types';
import { KopSurat } from '../common/KopSurat';
import { DocExportService } from '../../services/docExportService';
import {
  FileText,
  FileCheck2,
  Printer,
  Download,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit3,
  Eye,
  CheckCircle2,
  AlertTriangle,
  History,
  Send,
  Building2,
  Users,
  Award,
  Layers,
  FileSpreadsheet,
  FileCode,
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';

type TemplatePreset = 
  | 'sk_pembagian_tugas'
  | 'sk_panitia_asesmen'
  | 'sk_tpk_ksp'
  | 'surat_tugas_pengawas'
  | 'surat_undangan_rapat'
  | 'berita_acara_ksp'
  | 'notulen_kurikulum'
  | 'surat_pengantar_cabdin';

export const DocumentGeneratorView: React.FC = () => {
  const {
    officialDocuments,
    addOfficialDocument,
    updateOfficialDocument,
    deleteOfficialDocument,
    addDigitalArchive,
    teachers,
    subjects,
    classes,
    teachingAssignments,
    schoolProfile,
    activeAcademicYear,
    currentUser,
    showToast
  } = useApp();

  const [selectedPreset, setSelectedPreset] = useState<TemplatePreset>('sk_pembagian_tugas');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'saved_docs'>('preview');
  const [editorSubTab, setEditorSubTab] = useState<'general' | 'clauses' | 'personnel' | 'workflow'>('general');

  // Currently editing document state
  const [docId, setDocId] = useState<string | null>(null);
  const [docType, setDocType] = useState<OfficialDocument['documentType']>('sk_kepala_sekolah');
  const [title, setTitle] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [docDate, setDocDate] = useState('2026-07-11');
  const [signatoryRole, setSignatoryRole] = useState<'principal' | 'vice_curriculum'>('principal');
  const [status, setStatus] = useState<DocumentStatus>('draft');
  const [version, setVersion] = useState<number>(1);
  const [revisionNotes, setRevisionNotes] = useState<string>('');

  // Structured content state
  const [menimbang, setMenimbang] = useState<string[]>([]);
  const [mengingat, setMengingat] = useState<string[]>([]);
  const [memutuskan, setMemutuskan] = useState<string[]>([]);
  
  // Specific fields for assignment/invitation/minutes
  const [assignedTeachers, setAssignedTeachers] = useState<{ id: string; name: string; nip: string; role: string }[]>([]);
  const [eventPurpose, setEventPurpose] = useState('');
  const [eventDateStr, setEventDateStr] = useState('Senin, 21 September 2026');
  const [eventTimeStr, setEventTimeStr] = useState('07.30 - 13.00 WITA');
  const [eventVenue, setEventVenue] = useState('SMA Negeri 1 Kakas');
  const [meetingResults, setMeetingResults] = useState('');

  const [isExporting, setIsExporting] = useState(false);

  // Auto-generate document number prefix
  const getAutoNumber = (type: TemplatePreset): string => {
    const prefix = schoolProfile.letterNumberPrefix || '421/SMAN1-KKS/';
    const monthRoman = 'VII';
    const year = '2026';
    switch (type) {
      case 'sk_pembagian_tugas':
        return `${prefix}042/${monthRoman}/${year}`;
      case 'sk_panitia_asesmen':
        return `${prefix}088/IX/${year}`;
      case 'sk_tpk_ksp':
        return `${prefix}015/VI/${year}`;
      case 'surat_tugas_pengawas':
        return `${prefix}ST-092/IX/${year}`;
      case 'surat_undangan_rapat':
        return `${prefix}UND-031/VII/${year}`;
      case 'berita_acara_ksp':
        return `${prefix}BA-012/VII/${year}`;
      case 'notulen_kurikulum':
        return `${prefix}NOT-007/VII/${year}`;
      case 'surat_pengantar_cabdin':
        return `${prefix}PENG-022/VII/${year}`;
      default:
        return `${prefix}${Date.now().toString().slice(-3)}/${monthRoman}/${year}`;
    }
  };

  // Load preset template with data induk auto-fill
  const applyPresetTemplate = (preset: TemplatePreset) => {
    setSelectedPreset(preset);
    setDocId(null);
    setVersion(1);
    setStatus('draft');
    setDocumentNumber(getAutoNumber(preset));

    if (preset === 'sk_pembagian_tugas') {
      setDocType('sk_kepala_sekolah');
      setTitle(`SURAT KEPUTUSAN KEPALA SMA NEGERI 1 KAKAS TENTANG PEMBAGIAN TUGAS GURU DALAM PROSES BELAJAR MENGAJAR DAN TUGAS TAMBAHAN TAHUN PELAJARAN ${activeAcademicYear.year}`);
      setDocDate('2026-07-11');
      setSignatoryRole('principal');
      setMenimbang([
        `Bahwa dalam rangka memperlancar jalannya Proses Belajar Mengajar di SMA Negeri 1 Kakas pada Tahun Pelajaran ${activeAcademicYear.year}, perlu menetapkan pembagian tugas guru.`,
        'Bahwa untuk menjamin kepastian hukum, tertib administrasi, dan pemenuhan beban kerja minimal 24 jam tatap muka per minggu, pembagian tugas perlu dituangkan dalam Surat Keputusan Kepala Sekolah.'
      ]);
      setMengingat([
        'Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional.',
        'Undang-Undang Nomor 14 Tahun 2005 tentang Guru dan Dosen.',
        'Peraturan Pemerintah Nomor 74 Tahun 2008 tentang Guru sebagaimana telah diubah dengan PP Nomor 19 Tahun 2017.',
        'Permendikbud Nomor 15 Tahun 2018 tentang Pemenuhan Beban Kerja Guru, Kepala Sekolah, dan Pengawas Sekolah.',
        'Permendikbudristek Nomor 12 Tahun 2024 tentang Kurikulum pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah.',
        `Kalender Pendidikan Dinas Pendidikan Daerah Provinsi Sulawesi Utara Tahun Pelajaran ${activeAcademicYear.year}.`
      ]);
      setMemutuskan([
        `Menetapkan Pembagian Tugas Mengajar bagi Guru SMA Negeri 1 Kakas Tahun Pelajaran ${activeAcademicYear.year} Semester ${activeAcademicYear.activeSemester} sebagaimana tercantum dalam Lampiran I keputusan ini.`,
        'Menetapkan Pembagian Tugas Tambahan bagi Guru (Wakil Kepala Sekolah, Wali Kelas, Kepala Laboratorium, dan Pembina) sebagaimana tercantum dalam Lampiran II keputusan ini.',
        'Masing-masing guru wajib melaporkan pelaksanaan tugasnya secara berkala kepada Kepala Sekolah melalui Wakil Kepala Sekolah Bidang Kurikulum.',
        'Segala biaya yang timbul akibat ditetapkannya keputusan ini dibebankan pada anggaran yang sesuai.',
        'Keputusan ini mulai berlaku sejak tanggal ditetapkan, dengan ketentuan apabila terdapat kekeliruan akan diperbaiki sebagaimana mestinya.'
      ]);
    } else if (preset === 'sk_panitia_asesmen') {
      setDocType('sk_kepala_sekolah');
      setTitle(`SURAT KEPUTUSAN KEPALA SMA NEGERI 1 KAKAS TENTANG PEMBENTUKAN PANITIA DAN PENGAWAS ASESMEN SUMATIF TENGAH SEMESTER (ASTS) GANJIL TP ${activeAcademicYear.year}`);
      setDocDate('2026-09-08');
      setSignatoryRole('principal');
      setMenimbang([
        'Bahwa untuk mengukur ketercapaian Tujuan Pembelajaran (TP) peserta didik Fase E dan F secara objektif dan akuntabel, perlu diselenggarakan Asesmen Sumatif Tengah Semester (ASTS).',
        'Bahwa demi kelancaran dan ketertiban administrasi pelaksanaan asesmen, perlu dibentuk Panitia Pelaksana dan Pengawas Ruang.'
      ]);
      setMengingat([
        'Permendikbudristek Nomor 21 Tahun 2022 tentang Standar Penilaian Pendidikan.',
        'Panduan Pembelajaran dan Asesmen Kurikulum Merdeka Kemendikbudristek.',
        `Program Kerja Bidang Kurikulum SMA Negeri 1 Kakas Tahun Pelajaran ${activeAcademicYear.year}.`
      ]);
      setMemutuskan([
        `Membentuk Panitia Asesmen Sumatif Tengah Semester (ASTS) Ganjil TP ${activeAcademicYear.year} dengan susunan: Penanggung Jawab: ${schoolProfile.principalName}, Ketua: ${schoolProfile.viceCurriculumName}, Sekretaris: Meivy S. Lengkong, S.Pd., Bendahara: Grace Waworuntu, S.Pd.`,
        'Menetapkan daftar nama Guru Pengawas Ruang Asesmen sebanyak 14 orang untuk 7 ruang ujian sebagaimana tercantum pada lampiran keputusan ini.',
        'Panitia dan Pengawas bertanggung jawab penuh atas kerahasiaan, ketertiban, dan pelaporan hasil asesmen kepada Kepala Sekolah.'
      ]);
      // Pull sample teachers
      setAssignedTeachers(
        teachers.slice(0, 6).map((t, i) => ({
          id: t.id,
          name: t.name,
          nip: t.nip,
          role: i === 0 ? 'Ketua Panitia' : i === 1 ? 'Sekretaris' : i === 2 ? 'Bendahara' : 'Pengawas Ruang'
        }))
      );
    } else if (preset === 'sk_tpk_ksp') {
      setDocType('sk_kepala_sekolah');
      setTitle(`SURAT KEPUTUSAN KEPALA SMA NEGERI 1 KAKAS TENTANG TIM PENGEMBANG KURIKULUM SATUAN PENDIDIKAN (TPK) TAHUN PELAJARAN ${activeAcademicYear.year}`);
      setDocDate('2026-06-25');
      setSignatoryRole('principal');
      setMenimbang([
        'Bahwa dalam rangka mengembangkan dan mengimplementasikan Kurikulum Satuan Pendidikan (KSP) yang kontekstual dengan karakteristik lingkungan Danau Tondano-Kakas, perlu dibentuk Tim Pengembang Kurikulum.',
        'Bahwa nama-nama yang tercantum dipandang cakap dan mampu melaksanakan tugas pengembangan kurikulum sekolah.'
      ]);
      setMengingat([
        'Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional.',
        'Permendikbudristek Nomor 12 Tahun 2024 tentang Kurikulum pada PAUD, Dikdas, dan Dikmen.',
        'Panduan Pengembangan Kurikulum Satuan Pendidikan BSKAP Kemendikbudristek.'
      ]);
      setMemutuskan([
        `Membentuk Tim Pengembang Kurikulum (TPK) SMA Negeri 1 Kakas Tahun Pelajaran ${activeAcademicYear.year} dengan susunan: Pembina: Pengawas Cabdin, Penanggung Jawab: ${schoolProfile.principalName}, Ketua: ${schoolProfile.viceCurriculumName}, Anggota: Koordinator MGMP Sekolah & Komite Sekolah.`,
        'Tim bertugas menyusun analisis konteks, visi, misi, tujuan, pengorganisasian pembelajaran Fase E dan F, serta rencana asesmen mendalam.',
        'Keputusan ini berlaku sejak tanggal ditetapkan.'
      ]);
    } else if (preset === 'surat_tugas_pengawas') {
      setDocType('surat_tugas');
      setTitle(`SURAT TUGAS PENGAWAS ASESMEN SUMATIF SMA NEGERI 1 KAKAS TP ${activeAcademicYear.year}`);
      setDocDate('2026-09-18');
      setSignatoryRole('principal');
      setEventPurpose(`Melaksanakan tugas pengawasan ruang pada Asesmen Sumatif Tengah Semester (ASTS) Ganjil Tahun Pelajaran ${activeAcademicYear.year} secara tertib dan berintegritas.`);
      setEventDateStr('21 s/d 26 September 2026');
      setEventTimeStr('07.30 - 12.30 WITA');
      setEventVenue('Ruang 01 s/d 07 SMA Negeri 1 Kakas');
      setAssignedTeachers(
        teachers.slice(2, 7).map(t => ({
          id: t.id,
          name: t.name,
          nip: t.nip,
          role: 'Pengawas Ruang'
        }))
      );
    } else if (preset === 'surat_undangan_rapat') {
      setDocType('surat_undangan');
      setTitle(`SURAT UNDANGAN RAPAT PLENO PENYELARASAN DOKUMEN KURIKULUM SATUAN PENDIDIKAN`);
      setDocDate('2026-07-05');
      setSignatoryRole('principal');
      setEventPurpose('Rapat Pleno Pembahasan dan Finalisasi Draf Kurikulum Satuan Pendidikan (KSP) SMA Negeri 1 Kakas Tahun Pelajaran 2026/2027.');
      setEventDateStr('Rabu, 8 Juli 2026');
      setEventTimeStr('09.00 - 14.30 WITA');
      setEventVenue('Ruang Guru / Aula SMA Negeri 1 Kakas');
      setMeetingResults('Menghadirkan seluruh Dewan Guru, Tenaga Kependidikan, Pengurus Komite Sekolah, dan Pengawas Pembina.');
    } else if (preset === 'berita_acara_ksp') {
      setDocType('berita_acara');
      setTitle(`BERITA ACARA RAPAT PENYELARASAN DAN VERIFIKASI KURIKULUM SATUAN PENDIDIKAN`);
      setDocDate('2026-07-08');
      setSignatoryRole('vice_curriculum');
      setEventDateStr('Rabu, 8 Juli 2026');
      setEventTimeStr('09.00 - 14.30 WITA');
      setEventVenue('Ruang Dewan Guru SMA Negeri 1 Kakas');
      setMeetingResults('Pada hari ini Rabu tanggal Delapan bulan Juli tahun Dua Ribu Dua Puluh Enam, bertempat di SMA Negeri 1 Kakas telah dilaksanakan Rapat Penyelarasan KSP. Seluruh peserta rapat secara mufakat menyetujui struktur jam belajar Fase E (46 JJM) dan Fase F, alokasi Projek P5 bertema kearifan lokal Danau Kakas, serta instrumen asesmen mendalam.');
    } else if (preset === 'notulen_kurikulum') {
      setDocType('notulen_rapat');
      setTitle(`NOTULEN RAPAT KOORDINASI KURIKULUM TENTANG PEMBAGIAN TUGAS MENGAJAR`);
      setDocDate('2026-07-09');
      setSignatoryRole('vice_curriculum');
      setEventDateStr('Kamis, 9 Juli 2026');
      setEventTimeStr('10.00 - 12.30 WITA');
      setEventVenue('Ruang Rapat Kurikulum SMAN 1 Kakas');
      setMeetingResults(`Rapat dipimpin oleh Wakasek Kurikulum (${schoolProfile.viceCurriculumName}). Dihadiri oleh seluruh guru mata pelajaran. Hasil pembahasan: Seluruh guru telah memperoleh distribusi beban mengajar minimal 24 JJM ekuivalensi, jadwal pelajaran telah disimulasikan bebas benturan jam dan ruang kelas.`);
    } else if (preset === 'surat_pengantar_cabdin') {
      setDocType('surat_undangan'); // or official notification
      setTitle(`SURAT PENGANTAR PENYERAHAN DOKUMEN KSP UNTUK PENGESAHAN CABANG DINAS`);
      setDocDate('2026-07-14');
      setSignatoryRole('principal');
      setEventPurpose('Penyampaian Dokumen Kurikulum Satuan Pendidikan (KSP) SMA Negeri 1 Kakas Tahun Pelajaran 2026/2027 untuk diverifikasi dan disahkan oleh Kepala Cabang Dinas Pendidikan Daerah Wilayah Tomohon - Minahasa.');
      setEventDateStr('Selasa, 14 Juli 2026');
      setEventVenue('Kantor Cabang Dinas Pendidikan Wilayah Tomohon - Minahasa');
    }

    showToast(`Templat ${preset.replace(/_/g, ' ').toUpperCase()} berhasil dimuat dengan data induk riil sekolah.`, 'info');
  };

  // Initial load
  useEffect(() => {
    applyPresetTemplate('sk_pembagian_tugas');
  }, []);

  // Signatory details
  const currentSignatory = signatoryRole === 'principal' ? {
    name: schoolProfile.principalName,
    title: 'Kepala Sekolah',
    nip: schoolProfile.principalNip,
    rank: schoolProfile.principalRank
  } : {
    name: schoolProfile.viceCurriculumName,
    title: 'Wakil Kepala Sekolah Bidang Kurikulum',
    nip: schoolProfile.viceCurriculumNip,
    rank: schoolProfile.viceCurriculumRank
  };

  // Save Document to State & DB
  const handleSaveDocument = (targetStatus?: DocumentStatus) => {
    const docStatus = targetStatus || status;
    const documentPayload: Omit<OfficialDocument, 'id' | 'createdAt' | 'updatedAt'> = {
      documentType: docType,
      title,
      documentNumber,
      date: docDate,
      signatoryName: currentSignatory.name,
      signatoryTitle: currentSignatory.title,
      signatoryNip: currentSignatory.nip || '',
      academicYear: activeAcademicYear.year,
      semester: activeAcademicYear.activeSemester,
      status: docStatus,
      version: docId ? version + 1 : 1,
      content: {
        menimbang,
        mengingat,
        memutuskan,
        assignedTeachers,
        purpose: eventPurpose,
        schedule: eventDateStr,
        hariTanggal: eventDateStr,
        waktu: eventTimeStr,
        tempat: eventVenue,
        agenda: title,
        hasilRapat: meetingResults,
        revisionNotes
      },
      createdBy: currentUser.name
    };

    if (docId) {
      updateOfficialDocument({
        ...documentPayload,
        id: docId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setVersion(prev => prev + 1);
      showToast(`Dokumen revisi versi ${version + 1} berhasil disimpan (Status: ${docStatus.toUpperCase()}).`, 'success');
    } else {
      addOfficialDocument(documentPayload);
      showToast(`Dokumen baru berhasil disimpan ke repositori resmi (Status: ${docStatus.toUpperCase()}).`, 'success');
    }

    // Auto archive if established/approved
    if (docStatus === 'established' || docStatus === 'approved') {
      addDigitalArchive({
        title,
        documentNumber,
        category: docType === 'sk_kepala_sekolah' ? 'Surat Keputusan' : docType === 'surat_tugas' ? 'Surat Tugas' : 'Dokumen Lainnya',
        academicYear: activeAcademicYear.year,
        semester: activeAcademicYear.activeSemester,
        creatorName: currentUser.name,
        status: docStatus,
        version: `${docId ? version + 1 : 1}.0`,
        description: `Ditetapkan secara resmi untuk keperluan kurikulum SMAN 1 Kakas TP ${activeAcademicYear.year}.`,
        keywords: ['Naskah Dinas', 'Kurikulum', 'SMAN 1 Kakas', docType],
        fileSize: '1.4 MB',
        fileFormat: 'DOCX'
      });
    }

    setStatus(docStatus);
  };

  // Load existing document into editor
  const handleLoadDocument = (doc: OfficialDocument) => {
    setDocId(doc.id);
    setDocType(doc.documentType);
    setTitle(doc.title);
    setDocumentNumber(doc.documentNumber);
    setDocDate(doc.date);
    setSignatoryRole(doc.signatoryTitle.toLowerCase().includes('wakil') ? 'vice_curriculum' : 'principal');
    setStatus(doc.status);
    setVersion(doc.version || 1);

    const c = doc.content || {};
    setMenimbang(Array.isArray(c.menimbang) ? c.menimbang : []);
    setMengingat(Array.isArray(c.mengingat) ? c.mengingat : []);
    setMemutuskan(Array.isArray(c.memutuskan) ? c.memutuskan : []);
    setAssignedTeachers(Array.isArray(c.assignedTeachers) ? c.assignedTeachers : []);
    setEventPurpose(c.purpose || '');
    setEventDateStr(c.schedule || c.hariTanggal || '');
    setEventTimeStr(c.waktu || '');
    setEventVenue(c.tempat || '');
    setMeetingResults(c.hasilRapat || c.text || '');
    setRevisionNotes(c.revisionNotes || '');

    setActiveTab('preview');
    showToast(`Dokumen "${doc.title}" berhasil dibuka untuk ditinjau / direvisi.`, 'info');
  };

  // Export to Real DOCX
  const handleExportDocx = async () => {
    try {
      setIsExporting(true);
      const currentDocObj: OfficialDocument = {
        id: docId || 'doc-temp',
        documentType: docType,
        title,
        documentNumber,
        date: docDate,
        signatoryName: currentSignatory.name,
        signatoryTitle: currentSignatory.title,
        signatoryNip: currentSignatory.nip || '',
        academicYear: activeAcademicYear.year,
        semester: activeAcademicYear.activeSemester,
        status,
        version,
        content: {
          menimbang,
          mengingat,
          memutuskan,
          assignedTeachers,
          purpose: eventPurpose,
          schedule: eventDateStr,
          hariTanggal: eventDateStr,
          waktu: eventTimeStr,
          tempat: eventVenue,
          hasilRapat: meetingResults
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: currentUser.name
      };

      await DocExportService.exportToDocx(currentDocObj, schoolProfile);
      showToast('Berkas Microsoft Word (.docx) berhasil dibuat dan diunduh.', 'success');
    } catch (err) {
      console.error('Gagal ekspor docx:', err);
      showToast('Terjadi kendala saat mengekspor ke DOCX.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Export to Real PDF
  const handleExportPdf = () => {
    try {
      const currentDocObj: OfficialDocument = {
        id: docId || 'doc-temp',
        documentType: docType,
        title,
        documentNumber,
        date: docDate,
        signatoryName: currentSignatory.name,
        signatoryTitle: currentSignatory.title,
        signatoryNip: currentSignatory.nip || '',
        academicYear: activeAcademicYear.year,
        semester: activeAcademicYear.activeSemester,
        status,
        version,
        content: {
          menimbang,
          mengingat,
          memutuskan,
          assignedTeachers,
          purpose: eventPurpose,
          schedule: eventDateStr,
          hariTanggal: eventDateStr,
          waktu: eventTimeStr,
          tempat: eventVenue,
          hasilRapat: meetingResults
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: currentUser.name
      };

      DocExportService.exportToPdf(currentDocObj, schoolProfile);
      showToast('Berkas PDF resmi berhasil dibuat dan diunduh.', 'success');
    } catch (err) {
      console.error('Gagal ekspor PDF:', err);
      showToast('Terjadi kendala saat mengekspor ke PDF.', 'error');
    }
  };

  // Check user permission
  const canApprove = currentUser.role === 'principal' || currentUser.role === 'admin';
  const canEdit = currentUser.role === 'admin' || currentUser.role === 'vice_curriculum' || currentUser.role === 'curriculum_staff';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <FileCheck2 className="w-4 h-4 text-blue-800" />
            <span>GENERATOR TATA NASKAH DINAS & DOKUMEN RESMI</span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mt-1">
            Pusat Pembuatan Dokumen Resmi KuSaKA
          </h2>
          <p className="text-xs text-slate-500">
            Terintegrasi langsung dengan Data Induk Guru, Rombel, Jam Pelajaran, dan Profil Sekolah SMAN 1 Kakas TP {activeAcademicYear.year}.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Export to Word .docx */}
          <button
            onClick={handleExportDocx}
            disabled={isExporting}
            className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
            title="Unduh berkas dokumen Microsoft Word asli (.docx)"
          >
            <FileText className="w-3.5 h-3.5 text-blue-700" />
            <span>{isExporting ? 'Memproses...' : 'Ekspor DOCX'}</span>
          </button>

          {/* Export to PDF */}
          <button
            onClick={handleExportPdf}
            className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-900 hover:bg-red-100 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
            title="Unduh berkas PDF resmi"
          >
            <Download className="w-3.5 h-3.5 text-red-700" />
            <span>Ekspor PDF</span>
          </button>

          {/* Native Print Dialog */}
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
            title="Cetak langsung / Save as PDF melalui browser"
          >
            <Printer className="w-3.5 h-3.5 text-slate-700" />
            <span>Cetak A4</span>
          </button>

          {/* Save / Establish */}
          {canEdit && (
            <button
              onClick={() => handleSaveDocument()}
              className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Draf</span>
            </button>
          )}

          {canApprove && status !== 'established' && (
            <button
              onClick={() => handleSaveDocument('established')}
              className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              title="Tetapkan dokumen secara sah dan terbitkan ke arsip resmi"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Tetapkan Resmi</span>
            </button>
          )}
        </div>
      </div>

      {/* Preset Selector Carousel & Active Status Indicator */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Pilih Templat Resmi Naskah Dinas:
          </span>

          {/* Workflow Status Badge */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Status Dokumen:</span>
            <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase font-mono ${
              status === 'established' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
              status === 'approved' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
              status === 'waiting_approval' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
              'bg-slate-800 text-slate-300 border border-slate-700'
            }`}>
              {status.replace(/_/g, ' ')} · v{version}.0
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            { key: 'sk_pembagian_tugas', label: 'SK Pembagian Tugas', sub: 'Tugas Mengajar & JJM' },
            { key: 'sk_panitia_asesmen', label: 'SK Panitia Asesmen', sub: 'ASTS / ASAS' },
            { key: 'sk_tpk_ksp', label: 'SK Tim Kurikulum (TPK)', sub: 'Pengembang KSP' },
            { key: 'surat_tugas_pengawas', label: 'Surat Tugas Pengawas', sub: 'Ujian & Asesmen' },
            { key: 'surat_undangan_rapat', label: 'Surat Undangan Rapat', sub: 'Dewan Guru / Komite' },
            { key: 'berita_acara_ksp', label: 'Berita Acara Rapat', sub: 'Verifikasi Kurikulum' },
            { key: 'notulen_kurikulum', label: 'Notulen Rapat', sub: 'Risalah Rapat' },
            { key: 'surat_pengantar_cabdin', label: 'Surat Pengantar', sub: 'Berkas KSP ke Cabdin' },
          ].map(tpl => (
            <button
              key={tpl.key}
              onClick={() => applyPresetTemplate(tpl.key as TemplatePreset)}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                selectedPreset === tpl.key
                  ? 'border-amber-400 bg-amber-500/10 text-white font-bold ring-1 ring-amber-400/40'
                  : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="font-bold text-xs truncate">{tpl.label}</div>
              <div className="text-[10px] text-slate-400 truncate">{tpl.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>1. Pratinjau Kertas A4 Sah</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'editor'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>2. Formulir Dinamis & Klausul</span>
          </button>

          <button
            onClick={() => setActiveTab('saved_docs')}
            className={`px-4 py-2 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'saved_docs'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>3. Dokumen Tersimpan & Revisi ({officialDocuments.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PREVIEW A4 SAH */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Pratinjau naskah dinas resmi siap cetak sesuai tata letak A4 (Kop dobel logo, konsiderans, diktum, dan tanda tangan).
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('editor')}
                className="text-blue-800 hover:underline font-bold text-xs"
              >
                Ubah Isi / Parameter Dokumen →
              </button>
            </div>
          </div>

          {/* Realistic A4 Paper Simulation */}
          <div className="bg-white p-8 sm:p-14 rounded-xl border border-slate-300 shadow-md max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 font-serif text-slate-900">
            {/* Kop Surat Resmi dengan 2 Logo: Provinsi Sulut (Kiri) & SMAN 1 Kakas (Kanan) */}
            <KopSurat />

            {/* Document Title & Number Header */}
            <div className="text-center my-6 space-y-1">
              <h3 className="font-black text-sm uppercase tracking-wider text-slate-900">
                {docType === 'sk_kepala_sekolah'
                  ? 'KEPUTUSAN KEPALA SEKOLAH MENENGAH ATAS NEGERI 1 KAKAS'
                  : docType === 'surat_tugas'
                  ? 'SURAT TUGAS'
                  : docType === 'surat_undangan'
                  ? 'SURAT UNDANGAN'
                  : docType === 'berita_acara'
                  ? 'BERITA ACARA'
                  : 'NOTULEN RAPAT'}
              </h3>
              <div className="text-xs font-mono font-bold text-slate-800">
                NOMOR : {documentNumber}
              </div>
              <div className="text-xs font-bold uppercase text-slate-800 pt-1">
                TENTANG
              </div>
              <h4 className="font-black text-sm uppercase text-slate-900 max-w-2xl mx-auto leading-snug">
                {title.replace('SURAT KEPUTUSAN KEPALA SMA NEGERI 1 KAKAS TENTANG ', '')}
              </h4>
              {docType === 'sk_kepala_sekolah' && (
                <div className="text-xs font-bold text-slate-800 pt-2 uppercase">
                  KEPALA SMA NEGERI 1 KAKAS,
                </div>
              )}
            </div>

            {/* Content Body: SK */}
            {docType === 'sk_kepala_sekolah' && (
              <div className="space-y-4 text-xs text-justify leading-relaxed">
                {/* Menimbang */}
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
                <div className="text-center font-black tracking-widest uppercase pt-3">
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
            )}

            {/* Content Body: Surat Tugas */}
            {docType === 'surat_tugas' && (
              <div className="space-y-4 text-xs leading-relaxed">
                <p>Yang bertanda tangan di bawah ini:</p>
                <div className="pl-6 space-y-1 font-mono text-[11px]">
                  <div className="grid grid-cols-4">
                    <span className="font-bold">Nama</span>
                    <span className="col-span-3">: {currentSignatory.name}</span>
                  </div>
                  <div className="grid grid-cols-4">
                    <span className="font-bold">NIP</span>
                    <span className="col-span-3">: {currentSignatory.nip || '-'}</span>
                  </div>
                  <div className="grid grid-cols-4">
                    <span className="font-bold">Pangkat / Gol</span>
                    <span className="col-span-3">: {currentSignatory.rank || '-'}</span>
                  </div>
                  <div className="grid grid-cols-4">
                    <span className="font-bold">Jabatan</span>
                    <span className="col-span-3">: {currentSignatory.title}</span>
                  </div>
                </div>

                <p className="pt-2 font-bold">Dengan ini menugaskan kepada:</p>
                <div className="border border-slate-300 rounded-sm overflow-hidden my-2 font-sans text-[11px]">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-2 w-8">No</th>
                        <th className="p-2">Nama Guru / Pegawai</th>
                        <th className="p-2">NIP</th>
                        <th className="p-2">Tugas / Peran</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {assignedTeachers.length > 0 ? (
                        assignedTeachers.map((t, i) => (
                          <tr key={i}>
                            <td className="p-2 font-mono">{i + 1}</td>
                            <td className="p-2 font-bold">{t.name}</td>
                            <td className="p-2 font-mono">{t.nip || '-'}</td>
                            <td className="p-2">{t.role}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-3 text-center text-slate-400 italic">
                            Belum ada guru yang ditugaskan. Pilih guru di tab editor.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-1 pt-2 font-serif">
                  <div><strong>Untuk :</strong> {eventPurpose}</div>
                  <div><strong>Hari / Tanggal :</strong> {eventDateStr}</div>
                  <div><strong>Waktu :</strong> {eventTimeStr}</div>
                  <div><strong>Tempat :</strong> {eventVenue}</div>
                </div>

                <p className="pt-2 text-justify">
                  Demikian surat tugas ini diberikan kepada yang bersangkutan untuk dilaksanakan dengan penuh rasa tanggung jawab dan menyampaikan laporan hasil pelaksanaan kepada Kepala Sekolah.
                </p>
              </div>
            )}

            {/* Content Body: Undangan & Berita Acara */}
            {(docType === 'surat_undangan' || docType === 'berita_acara' || docType === 'notulen_rapat') && (
              <div className="space-y-4 text-xs leading-relaxed font-serif">
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-sm space-y-1 text-[11px]">
                  <div className="grid grid-cols-4">
                    <span className="font-bold">Hari / Tanggal</span>
                    <span className="col-span-3">: {eventDateStr}</span>
                  </div>
                  <div className="grid grid-cols-4">
                    <span className="font-bold">Waktu</span>
                    <span className="col-span-3">: {eventTimeStr}</span>
                  </div>
                  <div className="grid grid-cols-4">
                    <span className="font-bold">Tempat</span>
                    <span className="col-span-3">: {eventVenue}</span>
                  </div>
                  <div className="grid grid-cols-4">
                    <span className="font-bold">Agenda / Acara</span>
                    <span className="col-span-3 font-bold text-slate-900">: {title}</span>
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-slate-900 mb-1">Uraian / Hasil Pembahasan:</h5>
                  <p className="text-justify leading-relaxed whitespace-pre-line">
                    {meetingResults || eventPurpose}
                  </p>
                </div>
              </div>
            )}

            {/* Signature Block */}
            <div className="mt-12 flex justify-between items-start text-xs pt-4 font-serif">
              {docType === 'berita_acara' || docType === 'notulen_rapat' ? (
                <div className="text-left w-64 space-y-16">
                  <div>
                    Mengetahui,<br />
                    Wakil Kepala Sekolah Bidang Kurikulum,
                  </div>
                  <div>
                    <div className="font-bold underline uppercase">{schoolProfile.viceCurriculumName}</div>
                    <div className="text-[10px] font-mono text-slate-700">NIP. {schoolProfile.viceCurriculumNip || '-'}</div>
                  </div>
                </div>
              ) : (
                <div className="text-left w-64">
                  {/* Empty spacer for alignment */}
                </div>
              )}

              <div className="text-left w-64 space-y-16">
                <div>
                  Ditetapkan di : Kakas<br />
                  Pada tanggal  : {docDate}<br />
                  {currentSignatory.title} SMA Negeri 1 Kakas,
                </div>
                <div>
                  <div className="font-bold underline uppercase">{currentSignatory.name}</div>
                  <div className="text-[10px] font-mono text-slate-700">NIP. {currentSignatory.nip || '-'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DYNAMIC EDITOR & CLAUSES */}
      {activeTab === 'editor' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Formulir Parameter & Klausul Naskah Dinas
              </h3>
              <p className="text-xs text-slate-500">
                Data dinamis terhubung langsung dengan Data Induk Guru dan Pengaturan Sekolah.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('preview')}
                className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Lihat Pratinjau Kertas A4</span>
              </button>
            </div>
          </div>

          {/* Subtabs Editor */}
          <div className="flex items-center gap-2 border-b border-slate-100 text-xs">
            <button
              onClick={() => setEditorSubTab('general')}
              className={`px-3 py-1.5 font-bold border-b-2 transition-all ${
                editorSubTab === 'general' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500'
              }`}
            >
              Identitas Surat & Pejabat
            </button>
            {docType === 'sk_kepala_sekolah' && (
              <button
                onClick={() => setEditorSubTab('clauses')}
                className={`px-3 py-1.5 font-bold border-b-2 transition-all ${
                  editorSubTab === 'clauses' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500'
                }`}
              >
                Konsiderans & Diktum (Menimbang, Mengingat, Memutuskan)
              </button>
            )}
            {docType === 'surat_tugas' && (
              <button
                onClick={() => setEditorSubTab('personnel')}
                className={`px-3 py-1.5 font-bold border-b-2 transition-all ${
                  editorSubTab === 'personnel' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500'
                }`}
              >
                Personil Guru Ditugaskan ({assignedTeachers.length})
              </button>
            )}
            <button
              onClick={() => setEditorSubTab('workflow')}
              className={`px-3 py-1.5 font-bold border-b-2 transition-all ${
                editorSubTab === 'workflow' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500'
              }`}
            >
              Alur Persetujuan & Status
            </button>
          </div>

          {/* SUBTAB 1: GENERAL */}
          {editorSubTab === 'general' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Dokumen Resmi *</label>
                  <select
                    value={docType}
                    onChange={e => setDocType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-blue-950"
                  >
                    <option value="sk_kepala_sekolah">Surat Keputusan (SK) Kepala Sekolah</option>
                    <option value="surat_tugas">Surat Tugas</option>
                    <option value="surat_undangan">Surat Undangan Resmi</option>
                    <option value="berita_acara">Berita Acara</option>
                    <option value="notulen_rapat">Notulen Rapat</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Dokumen Resmi *</label>
                  <input
                    type="text"
                    required
                    value={documentNumber}
                    onChange={e => setDocumentNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold text-slate-900"
                    placeholder="421/042/SMAN1-KKS/VII/2026"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Penetapan Dokumen *</label>
                  <input
                    type="date"
                    required
                    value={docDate}
                    onChange={e => setDocDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Judul Lengkap Dokumen / Naskah Dinas *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pejabat Penandatangan Sah *</label>
                  <select
                    value={signatoryRole}
                    onChange={e => setSignatoryRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                  >
                    <option value="principal">Kepala Sekolah ({schoolProfile.principalName})</option>
                    <option value="vice_curriculum">Wakasek Kurikulum ({schoolProfile.viceCurriculumName})</option>
                  </select>
                </div>
              </div>

              {(docType === 'surat_tugas' || docType === 'surat_undangan' || docType === 'berita_acara' || docType === 'notulen_rapat') && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Hari / Tanggal Kegiatan</label>
                    <input
                      type="text"
                      value={eventDateStr}
                      onChange={e => setEventDateStr(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                      placeholder="Rabu, 8 Juli 2026"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Waktu Pelaksanaan</label>
                    <input
                      type="text"
                      value={eventTimeStr}
                      onChange={e => setEventTimeStr(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                      placeholder="09.00 - Selesai WITA"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tempat / Lokasi</label>
                    <input
                      type="text"
                      value={eventVenue}
                      onChange={e => setEventVenue(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                      placeholder="SMA Negeri 1 Kakas"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block font-semibold text-slate-700 mb-1">Maksud / Uraian Tugas / Hasil</label>
                    <textarea
                      rows={3}
                      value={docType === 'surat_tugas' ? eventPurpose : meetingResults}
                      onChange={e => {
                        if (docType === 'surat_tugas') setEventPurpose(e.target.value);
                        else setMeetingResults(e.target.value);
                      }}
                      className="w-full p-2.5 rounded-lg border border-slate-300 leading-relaxed"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUBTAB 2: CLAUSES */}
          {editorSubTab === 'clauses' && docType === 'sk_kepala_sekolah' && (
            <div className="space-y-5 text-xs">
              {/* Menimbang */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">Konsiderans Menimbang (Alasan Penetapan):</label>
                  <button
                    onClick={() => setMenimbang([...menimbang, ''])}
                    className="text-blue-800 hover:text-blue-900 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Poin Menimbang
                  </button>
                </div>
                {menimbang.map((m, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-6 font-mono font-bold text-slate-500 pt-2 text-center">{String.fromCharCode(97 + idx)}.</span>
                    <textarea
                      rows={2}
                      value={m}
                      onChange={e => {
                        const copy = [...menimbang];
                        copy[idx] = e.target.value;
                        setMenimbang(copy);
                      }}
                      className="flex-1 p-2 rounded-md border border-slate-300 leading-relaxed"
                    />
                    <button
                      onClick={() => setMenimbang(menimbang.filter((_, i) => i !== idx))}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded mt-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Mengingat */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">Konsiderans Mengingat (Dasar Hukum Resmi):</label>
                  <button
                    onClick={() => setMengingat([...mengingat, ''])}
                    className="text-blue-800 hover:text-blue-900 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Dasar Hukum
                  </button>
                </div>
                {mengingat.map((mg, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-6 font-mono font-bold text-slate-500 pt-2 text-center">{idx + 1}.</span>
                    <textarea
                      rows={1}
                      value={mg}
                      onChange={e => {
                        const copy = [...mengingat];
                        copy[idx] = e.target.value;
                        setMengingat(copy);
                      }}
                      className="flex-1 p-2 rounded-md border border-slate-300 leading-relaxed"
                    />
                    <button
                      onClick={() => setMengingat(mengingat.filter((_, i) => i !== idx))}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded mt-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Memutuskan */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">Diktum Memutuskan / Menetapkan:</label>
                  <button
                    onClick={() => setMemutuskan([...memutuskan, ''])}
                    className="text-blue-800 hover:text-blue-900 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Diktum
                  </button>
                </div>
                {memutuskan.map((mp, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-16 font-mono font-bold text-slate-600 pt-2 text-xs">
                      {idx === 0 ? 'KESATU' : idx === 1 ? 'KEDUA' : idx === 2 ? 'KETIGA' : `KE-${idx + 1}`} :
                    </span>
                    <textarea
                      rows={2}
                      value={mp}
                      onChange={e => {
                        const copy = [...memutuskan];
                        copy[idx] = e.target.value;
                        setMemutuskan(copy);
                      }}
                      className="flex-1 p-2 rounded-md border border-slate-300 leading-relaxed"
                    />
                    <button
                      onClick={() => setMemutuskan(memutuskan.filter((_, i) => i !== idx))}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded mt-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBTAB 3: PERSONNEL INTEGRATION */}
          {editorSubTab === 'personnel' && docType === 'surat_tugas' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Pilih Guru Dari Data Induk SMAN 1 Kakas:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border border-slate-200 rounded-lg">
                {teachers.map(t => {
                  const isChecked = assignedTeachers.some(a => a.id === t.id);
                  return (
                    <label
                      key={t.id}
                      className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors ${
                        isChecked ? 'bg-blue-50 border-blue-300 font-bold text-blue-950' : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => {
                          if (e.target.checked) {
                            setAssignedTeachers([
                              ...assignedTeachers,
                              { id: t.id, name: t.name, nip: t.nip, role: 'Pengawas Ruang' }
                            ]);
                          } else {
                            setAssignedTeachers(assignedTeachers.filter(a => a.id !== t.id));
                          }
                        }}
                        className="w-4 h-4 text-blue-800 rounded"
                      />
                      <div className="text-[11px] truncate">
                        <div>{t.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">NIP: {t.nip || '-'}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUBTAB 4: WORKFLOW & STATUS */}
          {editorSubTab === 'workflow' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <span className="font-bold text-slate-900 block">Siklus Status Naskah Dinas:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['draft', 'in_review', 'revision_needed', 'waiting_approval', 'approved', 'established'] as DocumentStatus[]).map(st => (
                    <button
                      key={st}
                      onClick={() => setStatus(st)}
                      className={`p-2.5 rounded-lg border text-left font-bold capitalize transition-all ${
                        status === st
                          ? 'bg-blue-900 text-white border-blue-900 ring-2 ring-blue-700/30'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Revisi / Riwayat Perubahan:</label>
                <textarea
                  rows={3}
                  value={revisionNotes}
                  onChange={e => setRevisionNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 leading-relaxed"
                  placeholder="misal: Penyesuaian nomor SK setelah arahan Kepala Sekolah, penambahan dasar hukum Permendikbud 15/2018..."
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-[11px] text-slate-400">
              Versi Dokumen: <strong>v{version}.0</strong> · Disusun oleh: {currentUser.name}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSaveDocument()}
                className="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-lg text-xs shadow-2xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SAVED DOCUMENTS LIST */}
      {activeTab === 'saved_docs' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              Daftar Naskah Dinas Terdaftar & Arsip Versi
            </span>
            <span className="text-slate-500 font-mono">
              {officialDocuments.length} Dokumen Tersimpan
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {officialDocuments.map((doc, idx) => (
              <div key={doc.id} className="p-4 hover:bg-slate-50 flex items-center justify-between gap-4 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200 font-mono">
                      {doc.documentNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      doc.status === 'established' ? 'bg-emerald-100 text-emerald-800' :
                      doc.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {doc.status.toUpperCase().replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">v{doc.version || 1}.0</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{doc.title}</h4>
                  <div className="text-[11px] text-slate-500">
                    Penandatangan: {doc.signatoryName} ({doc.signatoryTitle}) · Tanggal: {doc.date} · Oleh: {doc.createdBy}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleLoadDocument(doc)}
                    className="px-3 py-1.5 bg-blue-900 text-white rounded-md font-semibold text-xs flex items-center gap-1 shadow-2xs"
                    title="Buka untuk melihat pratinjau dan edit"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Buka Naskah</span>
                  </button>

                  <button
                    onClick={() => {
                      DocExportService.exportToDocx(doc, schoolProfile);
                      showToast('Mengunduh berkas DOCX...', 'info');
                    }}
                    className="p-1.5 text-blue-800 hover:bg-blue-50 border border-slate-200 rounded-md"
                    title="Unduh DOCX"
                  >
                    <FileText className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      DocExportService.exportToPdf(doc, schoolProfile);
                      showToast('Mengunduh berkas PDF...', 'info');
                    }}
                    className="p-1.5 text-red-700 hover:bg-red-50 border border-slate-200 rounded-md"
                    title="Unduh PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {canEdit && (
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus dokumen "${doc.title}"?`)) {
                          deleteOfficialDocument(doc.id);
                        }
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                      title="Hapus Dokumen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
