import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { KopSurat } from '../common/KopSurat';
import {
  FileBarChart2,
  Printer,
  Download,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Users,
  Award,
  BookOpen,
  Sparkles,
  FileText,
  FileCheck2,
  RotateCcw,
  Save,
  Clock,
  ShieldCheck,
  Building2,
  Layers,
  ChevronRight,
  History,
  Archive,
  Info,
  Check,
  X
} from 'lucide-react';
import {
  generateCurriculumReport,
  auditCurriculumData,
  ReportPeriodType,
  GeneratedReportResult
} from '../../services/aiReportService';
import { DocExportService } from '../../services/docExportService';

export const ReportsView: React.FC = () => {
  const {
    teachers,
    subjects,
    classes,
    teachingAssignments,
    calendarEvents,
    workPrograms,
    supervisions,
    assessments,
    teacherDev,
    monev,
    schoolProfile,
    activeAcademicYear,
    currentUser,
    addOfficialDocument,
    addDigitalArchive,
    showToast
  } = useApp();

  // Role permissions
  const canGenerate = ['admin', 'principal', 'vice_curriculum', 'curriculum_staff'].includes(currentUser.role);
  const canApprove = ['admin', 'principal', 'vice_curriculum'].includes(currentUser.role);

  // Report configuration
  const [reportPeriod, setReportPeriod] = useState<ReportPeriodType>('semester');
  const [selectedMonth, setSelectedMonth] = useState<string>('Oktober');
  const [selectedSemester, setSelectedSemester] = useState<'Ganjil' | 'Genap'>(activeAcademicYear.activeSemester);
  const [customInstructions, setCustomNotes] = useState<string>('');

  // Generation states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentReport, setCurrentReport] = useState<GeneratedReportResult | null>(null);
  const [editableContent, setEditableContent] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);

  // Revision & saving modal
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [revisionNotes, setRevisionNotes] = useState<string>('Draf laporan resmi terverifikasi data KuSaKA');
  const [docVersion, setDocVersion] = useState<number>(1);
  const [documentStatus, setDocumentStatus] = useState<'draft' | 'in_review' | 'waiting_approval' | 'approved' | 'established'>('draft');

  // Live Audit of database completeness
  const liveAudit = useMemo(() => {
    return auditCurriculumData(teachers, teachingAssignments, supervisions, workPrograms, assessments, classes);
  }, [teachers, teachingAssignments, supervisions, workPrograms, assessments, classes]);

  const monthOptions = [
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'
  ];

  // Generate Report Handler (AI or Deterministic)
  const handleGenerate = async (useAi: boolean = true) => {
    setIsGenerating(true);
    showToast('Sedang memproses laporan berdasarkan basis data aktual SMAN 1 Kakas...', 'info');

    const periodLabel = reportPeriod === 'monthly'
      ? selectedMonth
      : reportPeriod === 'semester'
      ? selectedSemester
      : activeAcademicYear.year;

    try {
      const result = await generateCurriculumReport(
        reportPeriod,
        periodLabel,
        schoolProfile,
        activeAcademicYear,
        teachers,
        subjects,
        classes,
        teachingAssignments,
        supervisions,
        workPrograms,
        assessments,
        teacherDev,
        monev,
        customInstructions
      );

      setCurrentReport(result);
      setEditableContent(result.content);
      setIsGenerating(false);

      if (result.isAiGenerated) {
        showToast('Laporan berhasil disusun cerdas dengan AI Gemini.', 'success');
      } else {
        showToast('Laporan disusun berdasarkan sintesis data faktual KuSaKA.', 'success');
      }
    } catch (err: any) {
      console.error(err);
      setIsGenerating(false);
      showToast('Gagal memproses laporan: ' + (err.message || 'Error'), 'error');
    }
  };

  // Initial generation on first mount
  useEffect(() => {
    handleGenerate(false);
  }, []);

  // Save to Official Documents & Digital Archive
  const handleSaveDocument = () => {
    if (!editableContent || !currentReport) return;

    const docNumber = `${schoolProfile.letterNumberPrefix}LAP-KUR/${Date.now().toString().slice(-4)}/${activeAcademicYear.year.split('/')[0]}`;

    // 1. Save to Official Documents
    addOfficialDocument({
      documentType: 'laporan_kegiatan',
      title: currentReport.title,
      documentNumber: docNumber,
      date: new Date().toISOString().split('T')[0],
      signatoryName: schoolProfile.principalName,
      signatoryTitle: 'Kepala Sekolah',
      signatoryNip: schoolProfile.principalNip,
      academicYear: activeAcademicYear.year,
      semester: activeAcademicYear.activeSemester,
      status: documentStatus,
      version: docVersion,
      content: {
        text: editableContent,
        revisionNotes,
        auditPercentage: liveAudit.completenessPercentage,
        incompleteItemsCount: liveAudit.incompleteItems.length,
        savedBy: currentUser.name,
        role: currentUser.roleTitle
      },
      createdBy: currentUser.name
    });

    // 2. Also register in Digital Archive
    addDigitalArchive({
      title: currentReport.title,
      documentNumber: docNumber,
      category: 'Laporan',
      academicYear: activeAcademicYear.year,
      semester: activeAcademicYear.activeSemester,
      creatorName: currentUser.name,
      status: documentStatus,
      version: `v${docVersion}.0`,
      description: `Laporan resmi kurikulum periode ${currentReport.periodLabel}. Catatan revisi: ${revisionNotes}`,
      keywords: ['Laporan Kurikulum', 'Evaluasi KBM', 'SMAN 1 Kakas', 'Supervisi', activeAcademicYear.year],
      fileFormat: 'DOCX'
    });

    setShowSaveModal(false);
    setDocVersion(prev => prev + 1);
    showToast(`Laporan resmi berhasil disimpan (Versi v${docVersion}) & terdaftar di Arsip Digital.`, 'success');
  };

  // Export handlers
  const handleExportDocx = async () => {
    if (!editableContent || !currentReport) return;
    try {
      await DocExportService.exportReportToDocx(currentReport.title, editableContent, schoolProfile);
      showToast('Dokumen laporan resmi berhasil diunduh dalam format .DOCX.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal membuat file DOCX.', 'error');
    }
  };

  const handleExportPDF = () => {
    if (!editableContent || !currentReport) return;
    try {
      DocExportService.exportReportToPDF(currentReport.title, editableContent, schoolProfile);
      showToast('Dokumen laporan resmi berhasil diunduh dalam format .PDF.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal membuat file PDF.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <FileBarChart2 className="w-4 h-4 text-blue-900" />
            <span>SISTEM PELAPORAN KURIKULUM & GENERATOR DOKUMEN AI</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
            Laporan Otomatis & Analisis Keterlaksanaan Kurikulum
          </h2>
          <p className="text-xs text-slate-500">
            Disusun faktual berdasarkan basis data tersimpan SMAN 1 Kakas · Transparansi Sumber Data & Penandaan Ketidaklengkapan
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {canGenerate && (
            <>
              <button
                onClick={() => handleGenerate(true)}
                disabled={isGenerating}
                className="px-3.5 py-1.5 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-950 hover:to-indigo-950 text-white rounded-lg text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                title="Susun analisis laporan komprehensif menggunakan model AI Gemini"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{isGenerating ? 'Menyusun Laporan...' : 'Generate Laporan AI'}</span>
              </button>

              <button
                onClick={() => handleGenerate(false)}
                disabled={isGenerating}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Sintesis terstruktur deterministik langsung dari database"
              >
                <RotateCcw className="w-3.5 h-3.5 text-blue-800" />
                <span>Sintesis Data Faktual</span>
              </button>
            </>
          )}

          <button
            onClick={handleExportDocx}
            disabled={!editableContent}
            className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/60 hover:bg-blue-100/60 text-blue-900 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
            title="Unduh laporan dalam format Microsoft Word (.docx)"
          >
            <Download className="w-3.5 h-3.5 text-blue-700" />
            <span>Ekspor DOCX</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={!editableContent}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
            title="Unduh laporan dalam format PDF resmi berkop surat"
          >
            <FileText className="w-3.5 h-3.5 text-rose-700" />
            <span>Ekspor PDF</span>
          </button>

          <button
            onClick={() => window.print()}
            disabled={!editableContent}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5 text-slate-700" />
            <span>Cetak</span>
          </button>

          {canGenerate && (
            <button
              onClick={() => setShowSaveModal(true)}
              disabled={!editableContent}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-2xs flex items-center gap-1.5 disabled:opacity-50"
              title="Simpan draf laporan resmi dengan nomor versi dan riwayat revisi"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Dokumen</span>
            </button>
          )}
        </div>
      </div>

      {/* PARAMETER SELECTOR BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Period Mode Selector */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Jenis Periode Laporan:</span>
            <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-1 bg-slate-50">
              <button
                onClick={() => setReportPeriod('monthly')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  reportPeriod === 'monthly' ? 'bg-white text-blue-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Laporan Bulanan
              </button>
              <button
                onClick={() => setReportPeriod('semester')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  reportPeriod === 'semester' ? 'bg-white text-blue-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Laporan Semester
              </button>
              <button
                onClick={() => setReportPeriod('annual')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  reportPeriod === 'annual' ? 'bg-white text-blue-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3. Laporan Akhir Tahun
              </button>
            </div>
          </div>

          {/* Conditional Sub-selectors */}
          {reportPeriod === 'monthly' && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Pilih Bulan:</span>
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-blue-950 bg-slate-50 focus:ring-2 focus:ring-blue-800"
              >
                {monthOptions.map(m => (
                  <option key={m} value={m}>
                    Bulan {m}
                  </option>
                ))}
              </select>
            </div>
          )}

          {reportPeriod === 'semester' && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Pilih Semester:</span>
              <select
                value={selectedSemester}
                onChange={e => setSelectedSemester(e.target.value as 'Ganjil' | 'Genap')}
                className="px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-blue-950 bg-slate-50 focus:ring-2 focus:ring-blue-800"
              >
                <option value="Ganjil">Semester Ganjil (Juli - Desember)</option>
                <option value="Genap">Semester Genap (Januari - Juni)</option>
              </select>
            </div>
          )}

          {reportPeriod === 'annual' && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Tahun Pelajaran:</span>
              <span className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-950 font-bold font-mono">
                {activeAcademicYear.year} (Penuh)
              </span>
            </div>
          )}
        </div>

        {/* Optional Custom Notes Input */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
          <label className="text-slate-600 font-medium whitespace-nowrap">
            Petunjuk Khusus / Catatan Tambahan Laporan:
          </label>
          <input
            type="text"
            value={customInstructions}
            onChange={e => setCustomNotes(e.target.value)}
            placeholder="misal: Berikan penekanan pada tindak lanjut supervisi klinis dan persiapan asesmen sumatif..."
            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-800"
          />
        </div>
      </div>

      {/* STRICT AUDIT: INVENTARISASI DATA BELUM LENGKAP & INTEGRITAS DATA */}
      {/* Requirement: "AI harus menggunakan data yang benar-benar tersimpan, menyebutkan data yang belum lengkap, dan tidak mengarang fakta" */}
      <div className={`p-4 rounded-xl border-2 text-xs space-y-2 ${
        liveAudit.hasIncompleteData ? 'bg-amber-50/90 border-amber-300 text-amber-950' : 'bg-emerald-50 border-emerald-300 text-emerald-950'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            {liveAudit.hasIncompleteData ? (
              <>
                <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0" />
                <span>Audit Kelengkapan Data Riil: {liveAudit.completenessPercentage}% Terisi ({liveAudit.incompleteItems.length} Hal Perlu Dilengkapi)</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <span>Audit Kelengkapan Data Riil: 100% Lengkap & Siap Audit Dinas</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] font-semibold">
            <span className="text-slate-500">Prinsip Integritas:</span>
            <span className="px-2 py-0.5 rounded bg-white/80 border text-slate-800">
              Zero Hallucination (Tanpa Karangan Data)
            </span>
          </div>
        </div>

        {liveAudit.hasIncompleteData ? (
          <div className="space-y-1.5 pt-1">
            <p className="text-[11px] text-amber-900 leading-relaxed">
              Sesuai instruksi ketat, sistem <strong>tidak mengarang fakta atau nilai</strong>. Daftar data yang belum lengkap berikut secara otomatis dicantumkan pada Bab Khusus dalam laporan dinas untuk ditindaklanjuti:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 pt-1">
              {liveAudit.incompleteItems.map((item, idx) => (
                <li key={idx} className="p-2 bg-white/80 rounded border border-amber-200/80 text-[11px] flex items-start gap-1.5">
                  <span className="font-bold text-amber-800">[{idx + 1}]</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-[11px] text-emerald-800">
            Seluruh komponen data pendidik, penugasan 24 JJM, instrumen supervisi akademik, dan program kerja tersimpan dengan parameter valid tanpa kekurangan data.
          </p>
        )}
      </div>

      {/* DATA LINEAGE & SOURCE ATTRIBUTION PILL BAR */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-slate-700 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-blue-800" />
          Sumber Data Faktual:
        </span>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
          Pendidik ({teachers.length} Guru)
        </span>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
          Penugasan SK ({teachingAssignments.length} Alokasi)
        </span>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
          Rombel ({classes.length} Kelas · {classes.reduce((sum, c) => sum + c.totalStudents, 0)} Siswa)
        </span>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
          Supervisi ({supervisions.length} Observasi)
        </span>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
          Program Kerja ({workPrograms.length} Kegiatan)
        </span>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
          Asesmen ({assessments.length} Paket)
        </span>
      </div>

      {/* REPORT VIEWER & EDITOR CARD */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Document Action Toolbar */}
        <div className="bg-slate-900 text-white px-5 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-bold text-xs uppercase tracking-wider text-amber-300">
              PRATINJAU DOKUMEN LAPORAN RESMI
            </span>
            {currentReport?.isAiGenerated ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Dianalisis AI Gemini
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/40">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                Sintesis Faktual Database
              </span>
            )}
            <span className="text-slate-400 text-xs hidden sm:inline">
              · Versi Draf: v{docVersion}.0
            </span>
          </div>

          <div className="flex items-center gap-2">
            {canGenerate && (
              <button
                onClick={() => setEditMode(!editMode)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  editMode
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <span>{editMode ? 'Selesai Mengedit' : 'Edit Teks Laporan'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Document Sheet Presentation */}
        <div className="p-8 sm:p-12 max-w-4xl mx-auto space-y-6 text-slate-900 font-serif">
          <KopSurat />

          {editMode ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                <span className="font-bold">Mode Editor Aktif:</span>
                <span>Anda dapat menyesuaikan kalimat atau menambahkan catatan sebelum disimpan/dicetak.</span>
              </div>
              <textarea
                value={editableContent}
                onChange={e => setEditableContent(e.target.value)}
                rows={35}
                className="w-full p-4 font-mono text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 leading-relaxed"
              />
            </div>
          ) : (
            <div className="space-y-6 font-sans text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
              {editableContent ? (
                <div className="bg-slate-50/50 p-6 rounded-lg border border-slate-200 font-mono text-[11.5px] leading-relaxed select-text">
                  {editableContent}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Memuat draf laporan...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL: SIMPAN LAPORAN KE DOKUMEN RESMI & ARSIP */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-blue-950 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-amber-300">
                  Simpan Laporan & Registrasi Riwayat Revisi
                </h3>
                <p className="text-[11px] text-slate-300">
                  Tersimpan di Dokumen Resmi, Arsip Digital, dan Log Audit SMAN 1 Kakas
                </p>
              </div>
              <button
                onClick={() => setShowSaveModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Judul Dokumen Laporan:
                </label>
                <input
                  type="text"
                  value={currentReport?.title || ''}
                  readOnly
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Versi Dokumen:
                  </label>
                  <input
                    type="text"
                    value={`v${docVersion}.0`}
                    readOnly
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-mono font-bold text-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Status Alur Kerja:
                  </label>
                  <select
                    value={documentStatus}
                    onChange={e => setDocumentStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-800"
                  >
                    <option value="draft">Draf Awal</option>
                    <option value="in_review">Dalam Peninjauan</option>
                    <option value="waiting_approval">Menunggu Pengesahan</option>
                    {canApprove && (
                      <>
                        <option value="approved">Disetujui (Approved)</option>
                        <option value="established">Ditetapkan Resmi</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Catatan Riwayat Revisi / Perubahan:
                </label>
                <textarea
                  value={revisionNotes}
                  onChange={e => setRevisionNotes(e.target.value)}
                  rows={3}
                  placeholder="misal: Verifikasi beban kerja 24 JJM, input catatan supervisi klinis dewan guru..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium focus:ring-2 focus:ring-blue-800"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] space-y-1">
                <span className="font-bold text-slate-800 block">Metadata Pengesahan:</span>
                <div className="flex justify-between text-slate-600">
                  <span>Penyusun (Editor):</span>
                  <span className="font-semibold text-slate-900">{currentUser.name} ({currentUser.roleTitle})</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Penanggung Jawab:</span>
                  <span className="font-semibold text-slate-900">{schoolProfile.principalName}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveDocument}
                  className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-2xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan & Registrasi Versi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
