import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarClock,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Users,
  Building2,
  Layers,
  Edit3,
  X,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Search,
  Check,
  ChevronDown,
  ChevronUp,
  AlertOctagon,
  Clock,
  UserCheck
} from 'lucide-react';
import {
  detectScheduleConflicts,
  exportClassSchedulePDF,
  exportTeacherSchedulePDF,
  SCHEDULE_TIME_SLOTS,
  DAYS_OF_WEEK,
  SchoolDay,
  TimeSlotDef
} from '../../services/scheduleEngine';
import { ScheduleItem } from '../../types';

export const ScheduleGeneratorView: React.FC = () => {
  const {
    classes,
    teachers,
    subjects,
    teachingAssignments,
    scheduleItems,
    updateScheduleItem,
    bulkSetScheduleItems,
    resetScheduleToDefault,
    injectTestScheduleConflict,
    activeAcademicYear,
    schoolProfile,
    currentUser,
    showToast
  } = useApp();

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'vice_curriculum' || currentUser.role === 'curriculum_staff';

  // Navigation states
  const [viewMode, setViewMode] = useState<'class' | 'teacher' | 'master'>('class');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-x-1');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || 'tch-01');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [masterDay, setMasterDay] = useState<SchoolDay>('Senin');

  // Conflict accordion toggle
  const [showConflictDetails, setShowConflictDetails] = useState<boolean>(true);

  // Manual Slot Editing Modal State
  const [editingSlot, setEditingSlot] = useState<ScheduleItem | null>(null);
  const [editForm, setEditForm] = useState({
    subjectId: '',
    teacherId: '',
    roomName: '',
    isBreak: false,
    breakTitle: ''
  });

  const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const selectedTeacher = teachers.find(t => t.id === selectedTeacherId) || teachers[0];

  // 1. DYNAMIC CONFLICT DETECTION ENGINE
  // Run live cross-validation across all schedule items, assignments, and rombels
  const conflictReport = useMemo(() => {
    return detectScheduleConflicts(scheduleItems, teachingAssignments, classes);
  }, [scheduleItems, teachingAssignments, classes]);

  // Set of slot IDs with active teacher clashes for visual highlight
  const clashingSlotIds = useMemo(() => {
    const set = new Set<string>();
    for (const conf of conflictReport.teacherConflicts) {
      // Find all slots matching this day, period, and teacherId
      scheduleItems.forEach(item => {
        if (!item.isBreak && item.teacherId === conf.teacherId && item.day === conf.day && item.period === conf.period) {
          set.add(item.id);
        }
      });
    }
    return set;
  }, [conflictReport.teacherConflicts, scheduleItems]);

  // Handle open edit slot modal
  const handleOpenEdit = (slot: ScheduleItem) => {
    if (!canEdit) {
      showToast('Akses ditolak: Hanya Staf Kurikulum atau Wakasek yang dapat mengubah jadwal.', 'error');
      return;
    }
    setEditingSlot(slot);
    setEditForm({
      subjectId: slot.subjectId || '',
      teacherId: slot.teacherId || '',
      roomName: slot.roomName || selectedClass?.roomName || '',
      isBreak: !!slot.isBreak,
      breakTitle: slot.subjectName || ''
    });
  };

  // Live clash check inside edit modal for selected teacher
  const modalLiveWarning = useMemo(() => {
    if (!editingSlot || editForm.isBreak || !editForm.teacherId) return null;
    // Check if the selected teacher is already teaching in another class at the same day & period
    const collision = scheduleItems.find(
      it =>
        it.id !== editingSlot.id &&
        !it.isBreak &&
        it.day === editingSlot.day &&
        it.period === editingSlot.period &&
        it.teacherId === editForm.teacherId &&
        it.classRomBelId !== editingSlot.classRomBelId
    );

    if (collision) {
      return `Peringatan Benturan: Guru ini telah dijadwalkan mengajar di ${collision.classRomBelName} pada ${editingSlot.day} Jam ke-${editingSlot.period}. Memilih guru ini akan menimbulkan benturan jadwal!`;
    }
    return null;
  }, [editingSlot, editForm.teacherId, editForm.isBreak, scheduleItems]);

  // Save edited slot
  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot) return;

    if (editForm.isBreak) {
      const updated: ScheduleItem = {
        ...editingSlot,
        isBreak: true,
        subjectId: undefined,
        subjectName: editForm.breakTitle || 'Istirahat / Kegiatan Khusus',
        teacherId: undefined,
        teacherName: undefined,
        roomName: editingSlot.roomName
      };
      updateScheduleItem(updated);
    } else {
      const subj = subjects.find(s => s.id === editForm.subjectId);
      const tch = teachers.find(t => t.id === editForm.teacherId);

      const updated: ScheduleItem = {
        ...editingSlot,
        isBreak: false,
        subjectId: subj?.id,
        subjectName: subj?.name,
        teacherId: tch?.id,
        teacherName: tch?.name,
        roomName: editForm.roomName || selectedClass?.roomName
      };
      updateScheduleItem(updated);
    }

    setEditingSlot(null);
  };

  // Clear slot to empty
  const handleClearSlot = () => {
    if (!editingSlot) return;
    const cleared: ScheduleItem = {
      ...editingSlot,
      isBreak: false,
      subjectId: undefined,
      subjectName: undefined,
      teacherId: undefined,
      teacherName: undefined
    };
    updateScheduleItem(cleared);
    setEditingSlot(null);
    showToast('Slot pembelajaran berhasil dikosongkan.', 'info');
  };

  // Export current class timetable to CSV
  const exportClassCsv = () => {
    const classSlots = scheduleItems.filter(it => it.classRomBelId === selectedClass?.id);
    let csv = `JADWAL PELAJARAN - ${selectedClass?.name.toUpperCase()}\n`;
    csv += `Tahun Pelajaran: ${activeAcademicYear.year} (${activeAcademicYear.activeSemester})\n`;
    csv += `Ruang: ${selectedClass?.roomName} | Wali Kelas: ${selectedClass?.homeroomTeacherName}\n\n`;
    csv += 'Hari,Jam Ke,Waktu Mulai,Waktu Selesai,Jenis Sesi,Kode Mapel,Mata Pelajaran,Guru Pengampu,Ruang\n';

    DAYS_OF_WEEK.forEach(day => {
      const daySlots = classSlots.filter(s => s.day === day).sort((a, b) => a.period - b.period);
      daySlots.forEach(s => {
        csv += `"${s.day}","${s.period}","${s.timeStart}","${s.timeEnd}","${s.isBreak ? 'Istirahat/Pembiasaan' : 'KBM Tatap Muka'}","${s.subjectId || '-'}","${s.subjectName || '(Kosong)'}","${s.teacherName || '-'}","${s.roomName || selectedClass?.roomName || '-'}"\n`;
      });
    });

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `JADWAL-PELAJARAN-${selectedClass?.name.replace(/\s+/g, '-')}-SMAN1-KAKAS.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Jadwal pelajaran ${selectedClass?.name} diekspor ke CSV.`, 'success');
  };

  // Export master school schedule to CSV
  const exportMasterCsv = () => {
    let csv = `MATRIKS JADWAL INDUK SELURUH KELAS - SMA NEGERI 1 KAKAS\n`;
    csv += `Tahun Pelajaran: ${activeAcademicYear.year} (${activeAcademicYear.activeSemester})\n\n`;
    csv += 'Hari,Jam Ke,Waktu,Rombel / Kelas,Status Sesi,Mata Pelajaran,Guru Pengampu,Ruang\n';

    DAYS_OF_WEEK.forEach(day => {
      classes.forEach(cls => {
        const slots = scheduleItems
          .filter(it => it.classRomBelId === cls.id && it.day === day)
          .sort((a, b) => a.period - b.period);

        slots.forEach(s => {
          csv += `"${s.day}","${s.period}","${s.timeStart}-${s.timeEnd}","${cls.name}","${s.isBreak ? 'Istirahat' : 'KBM'}","${s.subjectName || '-'}","${s.teacherName || '-'}","${s.roomName || cls.roomName}"\n`;
        });
      });
    });

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `JADWAL-INDUK-SMAN1-KAKAS-${activeAcademicYear.year.replace('/', '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Jadwal induk sekolah berhasil diekspor ke CSV.', 'success');
  };

  // Export PDF with official layout
  const handleExportPDF = async () => {
    if (viewMode === 'class' && selectedClass) {
      try {
        await exportClassSchedulePDF(
          selectedClass,
          scheduleItems,
          schoolProfile,
          activeAcademicYear.year,
          activeAcademicYear.activeSemester
        );
        showToast(`Dokumen PDF Jadwal ${selectedClass.name} berhasil diunduh.`, 'success');
      } catch (err) {
        console.error(err);
        showToast('Gagal membuat dokumen PDF jadwal.', 'error');
      }
    } else if (viewMode === 'teacher' && selectedTeacher) {
      try {
        await exportTeacherSchedulePDF(
          selectedTeacher,
          scheduleItems,
          schoolProfile,
          activeAcademicYear.year,
          activeAcademicYear.activeSemester
        );
        showToast(`Dokumen PDF Jadwal Guru ${selectedTeacher.name} berhasil diunduh.`, 'success');
      } catch (err) {
        console.error(err);
        showToast('Gagal membuat dokumen PDF jadwal guru.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <CalendarClock className="w-4 h-4 text-blue-900" />
            <span>SISTEM VALIDASI JADWAL PELAJARAN MULTI-ROMBEL</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
            Generator & Matriks Jadwal Pelajaran SMAN 1 Kakas
          </h2>
          <p className="text-xs text-slate-500">
            Tahun Pelajaran {activeAcademicYear.year} · Semester {activeAcademicYear.activeSemester} · Proteksi Real-Time Benturan Guru, Ruang, dan Kuota Alokasi JP
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {canEdit && (
            <>
              {/* QA Conflict Injection Tool for User Testing */}
              <button
                onClick={injectTestScheduleConflict}
                className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50/70 hover:bg-amber-100/70 text-amber-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Simulasi benturan guru untuk menguji verifikasi ketat KuSaKA"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-amber-700" />
                <span>Simulasi Benturan (QA)</span>
              </button>

              {/* Reset to Conflict-free */}
              <button
                onClick={resetScheduleToDefault}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Mengembalikan seluruh jadwal ke alokasi baku bebas konflik"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-800" />
                <span>Reset Baku (0 Benturan)</span>
              </button>
            </>
          )}

          <button
            onClick={viewMode === 'master' ? exportMasterCsv : exportClassCsv}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
            title="Ekspor tabel jadwal ke file CSV / Excel"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Ekspor Excel</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 text-blue-900 text-xs font-semibold flex items-center gap-1.5"
            title="Ekspor dokumen PDF resmi berkop surat SMAN 1 Kakas"
          >
            <FileText className="w-3.5 h-3.5 text-blue-700" />
            <span>Ekspor PDF</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-700" />
            <span>Cetak</span>
          </button>
        </div>
      </div>

      {/* CRITICAL: STRICT CONFLICT STATUS ALERT BANNER */}
      {/* Requirement: "Jangan menyatakan jadwal valid jika konflik masih ditemukan" */}
      {conflictReport.hasConflict ? (
        <div className="bg-rose-50 border-2 border-rose-400 rounded-xl p-5 shadow-xs text-rose-950 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-200/80 rounded-lg text-rose-800 flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base text-rose-900 uppercase tracking-tight">
                    STATUS JADWAL: TIDAK VALID — DITEMUKAN {conflictReport.totalConflictCount} ISU BENTURAN
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-600 text-white">
                    Perlu Revisi
                  </span>
                </div>
                <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                  Sesuai ketentuan integritas kurikulum SMAN 1 Kakas, jadwal pelajaran <strong>TIDAK BOLEH dinyatakan valid</strong> sebelum seluruh benturan guru, benturan ruang, dan ketidaksesuaian kuota jam diselesaikan secara tuntas.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {canEdit && (
                <button
                  onClick={resetScheduleToDefault}
                  className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Selesaikan Benturan Otomatis</span>
                </button>
              )}

              <button
                onClick={() => setShowConflictDetails(!showConflictDetails)}
                className="px-2.5 py-1.5 rounded-lg border border-rose-300 text-rose-800 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1"
              >
                <span>{showConflictDetails ? 'Sembunyikan Rincian' : 'Lihat Rincian'}</span>
                {showConflictDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Detailed conflict breakdown */}
          {showConflictDetails && (
            <div className="pt-3 border-t border-rose-200 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Teacher Conflicts */}
              {conflictReport.teacherConflicts.length > 0 && (
                <div className="bg-white p-3.5 rounded-lg border border-rose-200 space-y-2">
                  <span className="font-bold text-rose-900 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-rose-700" />
                    Benturan Guru Mengajar Bersamaan ({conflictReport.teacherConflicts.length}):
                  </span>
                  <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {conflictReport.teacherConflicts.map((c, i) => (
                      <li key={i} className="p-2 bg-rose-50/70 rounded text-[11px] border border-rose-100 leading-snug">
                        <strong className="text-rose-950 font-bold">{c.teacherName}</strong> dijadwalkan secara simultan di <strong>{c.class1}</strong> ({c.subject1}) dan <strong>{c.class2}</strong> ({c.subject2}) pada hari <strong>{c.day} Jam ke-{c.period}</strong> ({c.timeRange}).
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Room Conflicts */}
              {conflictReport.roomConflicts.length > 0 && (
                <div className="bg-white p-3.5 rounded-lg border border-rose-200 space-y-2">
                  <span className="font-bold text-rose-900 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-rose-700" />
                    Benturan Ruang Belajar Terisi Ganda ({conflictReport.roomConflicts.length}):
                  </span>
                  <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {conflictReport.roomConflicts.map((c, i) => (
                      <li key={i} className="p-2 bg-rose-50/70 rounded text-[11px] border border-rose-100 leading-snug">
                        Ruang <strong>{c.roomName}</strong> digunakan bersamaan oleh <strong>{c.class1}</strong> dan <strong>{c.class2}</strong> pada hari <strong>{c.day} Jam ke-{c.period}</strong> ({c.timeRange}).
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Break Violations */}
              {conflictReport.breakViolations.length > 0 && (
                <div className="bg-white p-3.5 rounded-lg border border-rose-200 space-y-2">
                  <span className="font-bold text-rose-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-rose-700" />
                    Pelanggaran Slot Istirahat / Upacara ({conflictReport.breakViolations.length}):
                  </span>
                  <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {conflictReport.breakViolations.map((c, i) => (
                      <li key={i} className="p-2 bg-rose-50/70 rounded text-[11px] border border-rose-100 leading-snug">
                        KBM <strong>{c.subjectName}</strong> ({c.teacherName}) di {c.className} dijadwalkan pada jam istirahat/upacara di hari <strong>{c.day} Jam ke-{c.period}</strong>.
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Allocation Discrepancies */}
              {conflictReport.allocationDiscrepancies.length > 0 && (
                <div className="bg-white p-3.5 rounded-lg border border-rose-200 space-y-2">
                  <span className="font-bold text-rose-900 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-rose-700" />
                    Ketidaksesuaian Alokasi Jam Mengajar ({conflictReport.allocationDiscrepancies.length}):
                  </span>
                  <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {conflictReport.allocationDiscrepancies.slice(0, 5).map((c, i) => (
                      <li key={i} className="p-2 bg-rose-50/70 rounded text-[11px] border border-rose-100 leading-snug">
                        <strong>{c.teacherName}</strong> · {c.subjectName} ({c.classRomBelName}): Alokasi SK <strong>{c.assignedHours} JP</strong>, namun terjadwal <strong>{c.scheduledHours} JP</strong> (Selisih {c.diff > 0 ? `+${c.diff}` : c.diff} JP).
                      </li>
                    ))}
                    {conflictReport.allocationDiscrepancies.length > 5 && (
                      <li className="text-[10px] text-slate-500 italic text-center">
                        ...dan {conflictReport.allocationDiscrepancies.length - 5} selisih alokasi lainnya.
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-emerald-50/90 border-2 border-emerald-400 rounded-xl p-5 shadow-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-200/80 rounded-lg text-emerald-800 flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-emerald-900 uppercase tracking-tight">
                  STATUS JADWAL: VALID & TERVERIFIKASI (0 BENTURAN)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-600 text-white">
                  Siap Ditetapkan
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                Seluruh 10 guru pengampu, 7 rombel kelas, ruang belajar, dan total 36 JP/minggu telah diverifikasi 100% bebas benturan dan sinkron dengan SK Pembagian Tugas Mengajar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-white/70 px-3.5 py-2 rounded-lg border border-emerald-200 self-end sm:self-auto">
            <UserCheck className="w-4 h-4 text-emerald-700" />
            <span>Disetujui Tim Kurikulum SMAN 1 Kakas</span>
          </div>
        </div>
      )}

      {/* Navigation View Switcher */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode('class')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              viewMode === 'class'
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>1. Jadwal Per Rombel (Kelas)</span>
          </button>

          <button
            onClick={() => setViewMode('teacher')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              viewMode === 'teacher'
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2. Jadwal Per Guru Pendidik</span>
          </button>

          <button
            onClick={() => setViewMode('master')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              viewMode === 'master'
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3. Matriks Induk Seluruh Sekolah</span>
          </button>
        </div>

        {/* View-specific selector controls */}
        {viewMode === 'class' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 hidden sm:inline">Pilih Rombel:</span>
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-blue-950 bg-slate-50 focus:ring-2 focus:ring-blue-800"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} (Fase {c.phase} · {c.roomName})
                </option>
              ))}
            </select>
          </div>
        )}

        {viewMode === 'teacher' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 hidden sm:inline">Pilih Guru:</span>
            <select
              value={selectedTeacherId}
              onChange={e => setSelectedTeacherId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-blue-950 bg-slate-50 focus:ring-2 focus:ring-blue-800"
            >
              {teachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.primarySubject})
                </option>
              ))}
            </select>
          </div>
        )}

        {viewMode === 'master' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 hidden sm:inline">Pilih Hari Matriks:</span>
            <select
              value={masterDay}
              onChange={e => setMasterDay(e.target.value as SchoolDay)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-blue-950 bg-slate-50 focus:ring-2 focus:ring-blue-800"
            >
              {DAYS_OF_WEEK.map(d => (
                <option key={d} value={d}>
                  Hari {d}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* VIEW MODE 1: PER ROMBEL (CLASS) */}
      {viewMode === 'class' && (
        <div className="space-y-4">
          {/* Class Summary Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Kelas Terpilih</span>
                <span className="font-extrabold text-blue-950 text-sm">{selectedClass?.name}</span>
              </div>
              <div className="h-7 w-px bg-slate-200" />
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Fase Kurikulum</span>
                <span className="font-bold text-amber-800">Fase {selectedClass?.phase}</span>
              </div>
              <div className="h-7 w-px bg-slate-200" />
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Ruang Belajar</span>
                <span className="font-bold text-slate-800">{selectedClass?.roomName}</span>
              </div>
              <div className="h-7 w-px bg-slate-200" />
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Wali Kelas</span>
                <span className="font-bold text-slate-800">{selectedClass?.homeroomTeacherName}</span>
              </div>
            </div>

            {/* Day Filter Tabs */}
            <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-1 bg-slate-50">
              <button
                onClick={() => setSelectedDay('all')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  selectedDay === 'all' ? 'bg-white text-blue-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua Hari
              </button>
              {DAYS_OF_WEEK.map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    selectedDay === d ? 'bg-white text-blue-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Days Grid */}
          <div className="space-y-5">
            {DAYS_OF_WEEK.filter(d => selectedDay === 'all' || selectedDay === d).map(day => {
              const daySlots = scheduleItems
                .filter(it => it.classRomBelId === selectedClass?.id && it.day === day)
                .sort((a, b) => a.period - b.period);

              return (
                <div key={day} className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="bg-slate-900 text-white px-5 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-amber-300">
                        HARI {day.toUpperCase()}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        · {daySlots.filter(s => !s.isBreak).length} Jam Tatap Muka
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-300">
                      {selectedClass?.name} · {selectedClass?.roomName}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                          <th className="p-3 w-16 text-center">Jam Ke</th>
                          <th className="p-3 w-32">Waktu (WITA)</th>
                          <th className="p-3">Mata Pelajaran / Aktivitas</th>
                          <th className="p-3">Guru Pendidik</th>
                          <th className="p-3 text-center">Ruang</th>
                          <th className="p-3 text-center">Status Sesi</th>
                          {canEdit && <th className="p-3 text-right w-24">Aksi</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {daySlots.map(slot => {
                          const isClashing = clashingSlotIds.has(slot.id);
                          const timeSlot = SCHEDULE_TIME_SLOTS[day]?.find(s => s.period === slot.period);
                          const timeRangeStr = timeSlot ? timeSlot.timeRange : `${slot.timeStart} - ${slot.timeEnd}`;

                          return (
                            <tr
                              key={slot.id}
                              className={`transition-colors ${
                                isClashing
                                  ? 'bg-rose-100/70 border-l-4 border-rose-600'
                                  : slot.isBreak
                                  ? 'bg-amber-50/50 font-medium text-amber-900'
                                  : 'hover:bg-slate-50/80'
                              }`}
                            >
                              <td className="p-3 text-center font-mono font-bold text-slate-700">
                                {slot.period}
                              </td>
                              <td className="p-3 font-mono font-medium text-slate-600 whitespace-nowrap">
                                {timeRangeStr}
                              </td>
                              <td className="p-3">
                                {slot.isBreak ? (
                                  <span className="font-bold text-amber-800">
                                    {slot.subjectName || 'Istirahat / Kegiatan'}
                                  </span>
                                ) : slot.subjectName ? (
                                  <div>
                                    <span className="font-bold text-slate-900">{slot.subjectName}</span>
                                    {isClashing && (
                                      <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-black text-rose-700 bg-rose-200/80 px-1.5 py-0.5 rounded">
                                        <AlertTriangle className="w-3 h-3" />
                                        BENTURAN GURU
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-slate-400 italic font-normal">
                                    (Belum dijadwalkan / Kosong)
                                  </span>
                                )}
                              </td>
                              <td className="p-3 font-medium text-slate-700">
                                {slot.teacherName || (slot.isBreak ? '-' : '—')}
                              </td>
                              <td className="p-3 text-center font-mono text-slate-600">
                                {slot.roomName || selectedClass?.roomName || '-'}
                              </td>
                              <td className="p-3 text-center">
                                {slot.isBreak ? (
                                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                                    Rehat / Pembiasaan
                                  </span>
                                ) : slot.subjectName ? (
                                  <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                    KBM Intrakurikuler
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                    Slot Kosong
                                  </span>
                                )}
                              </td>

                              {canEdit && (
                                <td className="p-3 text-right">
                                  <button
                                    onClick={() => handleOpenEdit(slot)}
                                    className="px-2.5 py-1 rounded border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-900 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                                    title="Edit slot pembelajaran"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>Edit</span>
                                  </button>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: PER GURU (INDIVIDUAL TEACHER SCHEDULE) */}
      {viewMode === 'teacher' && (
        <div className="space-y-4">
          {/* Teacher Summary Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-900">{selectedTeacher.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900">
                  {selectedTeacher.employmentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                NIP: {selectedTeacher.nip || '-'} · Pangkat: {selectedTeacher.rankAndGrade} · Mapel Utama: {selectedTeacher.primarySubject}
              </p>
              {selectedTeacher.additionalTask && (
                <p className="text-xs text-amber-800 font-semibold">
                  Tugas Tambahan: {selectedTeacher.additionalTask}
                </p>
              )}
            </div>

            {/* Weekly Load Stats */}
            {(() => {
              const teacherSlots = scheduleItems.filter(it => !it.isBreak && it.teacherId === selectedTeacher.id);
              return (
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Jam Terjadwal</span>
                    <span className="font-mono font-extrabold text-base text-blue-950">
                      {teacherSlots.length} JP
                    </span>
                  </div>
                  <div className="h-8 w-px bg-slate-200" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Target SK</span>
                    <span className="font-mono font-bold text-slate-700">
                      {selectedTeacher.totalHours} JJM
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Teacher Timetable Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {DAYS_OF_WEEK.map(day => {
              const slots = scheduleItems
                .filter(it => !it.isBreak && it.teacherId === selectedTeacher.id && it.day === day)
                .sort((a, b) => a.period - b.period);

              return (
                <div key={day} className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
                  <div className="bg-blue-950 text-white px-3 py-2 text-center">
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-300 block">
                      {day}
                    </span>
                    <span className="text-[10px] text-blue-200 font-medium">
                      {slots.length} Jam Tatap Muka
                    </span>
                  </div>

                  <div className="p-3 flex-1 space-y-2">
                    {slots.length === 0 ? (
                      <div className="h-32 flex items-center justify-center text-center p-2 text-slate-400 italic text-xs">
                        Tidak ada jam mengajar
                      </div>
                    ) : (
                      slots.map(s => {
                        const timeSlot = SCHEDULE_TIME_SLOTS[day]?.find(slot => slot.period === s.period);
                        const isClash = clashingSlotIds.has(s.id);

                        return (
                          <div
                            key={s.id}
                            className={`p-2.5 rounded-lg border text-xs space-y-1 transition-all ${
                              isClash
                                ? 'bg-rose-50 border-rose-400 text-rose-950'
                                : 'bg-slate-50 hover:bg-blue-50/50 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                              <span className="font-bold text-blue-900">Jam ke-{s.period}</span>
                              <span>{timeSlot?.timeRange || `${s.timeStart}-${s.timeEnd}`}</span>
                            </div>
                            <div className="font-extrabold text-slate-900">
                              {s.classRomBelName}
                            </div>
                            <div className="text-[11px] text-blue-950 font-medium line-clamp-1">
                              {s.subjectName}
                            </div>
                            <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-200/60">
                              <span>Ruang: {s.roomName}</span>
                              {canEdit && (
                                <button
                                  onClick={() => handleOpenEdit(s)}
                                  className="text-blue-700 hover:underline font-bold"
                                >
                                  Edit
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: MASTER SCHOOL MATRIX */}
      {viewMode === 'master' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-extrabold text-sm text-slate-900 block">
                Matriks Jadwal Pelajaran Serentak — Hari {masterDay.toUpperCase()}
              </span>
              <p className="text-slate-500 text-[11px]">
                Pemantauan komprehensif seluruh 7 rombel kelas SMA Negeri 1 Kakas pada hari {masterDay}.
              </p>
            </div>

            <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-1 bg-slate-50">
              {DAYS_OF_WEEK.map(d => (
                <button
                  key={d}
                  onClick={() => setMasterDay(d)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    masterDay === d ? 'bg-white text-blue-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[800px]">
              <thead>
                <tr className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-3 w-36 border-r border-slate-800">Rombel / Kelas</th>
                  {SCHEDULE_TIME_SLOTS[masterDay].map(slot => (
                    <th key={slot.period} className="p-2 text-center border-r border-slate-800">
                      <div>Jam {slot.period}</div>
                      <div className="text-[9px] text-slate-400 font-mono font-normal">{slot.timeRange}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {classes.map(cls => (
                  <tr key={cls.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900 bg-slate-50 border-r border-slate-200">
                      <div>{cls.name}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{cls.roomName}</div>
                    </td>

                    {SCHEDULE_TIME_SLOTS[masterDay].map(ts => {
                      const slot = scheduleItems.find(
                        it => it.classRomBelId === cls.id && it.day === masterDay && it.period === ts.period
                      );
                      const isClash = slot && clashingSlotIds.has(slot.id);

                      if (ts.isBreak) {
                        return (
                          <td key={ts.period} className="p-1 text-center bg-amber-50/60 border-r border-slate-200 text-amber-800 text-[10px] font-semibold">
                            {ts.defaultTitle?.includes('ISTIRAHAT') ? 'ISTIRAHAT' : 'KEGIATAN'}
                          </td>
                        );
                      }

                      return (
                        <td
                          key={ts.period}
                          onClick={() => slot && canEdit && handleOpenEdit(slot)}
                          className={`p-1.5 border-r border-slate-200 text-center transition-all cursor-pointer ${
                            isClash
                              ? 'bg-rose-100/90 text-rose-950 font-bold border-2 border-rose-500'
                              : slot?.subjectName
                              ? 'hover:bg-blue-50/60'
                              : 'bg-slate-50/50 hover:bg-slate-100'
                          }`}
                          title={slot ? `${slot.subjectName || 'Kosong'} · ${slot.teacherName || '-'}` : ''}
                        >
                          {slot?.subjectName ? (
                            <div className="space-y-0.5">
                              <div className="font-extrabold text-[11px] text-blue-950 truncate max-w-[110px] mx-auto">
                                {slot.subjectName}
                              </div>
                              <div className="text-[9.5px] text-slate-600 truncate max-w-[110px] mx-auto">
                                {slot.teacherName?.split(',')[0]}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Kosong</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: MANUAL EDIT SLOT */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-blue-950 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-amber-300">
                  Pengeditan Slot Pembelajaran Manual
                </h3>
                <p className="text-[11px] text-slate-300">
                  {editingSlot.classRomBelName} · Hari {editingSlot.day} Jam ke-{editingSlot.period}
                </p>
              </div>
              <button
                onClick={() => setEditingSlot(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="p-5 space-y-4 text-xs">
              {/* Live Collision Warning Banner inside Modal */}
              {modalLiveWarning && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-lg text-rose-900 flex items-start gap-2 text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" />
                  <span>{modalLiveWarning}</span>
                </div>
              )}

              {/* Toggle Break */}
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  id="chkBreak"
                  checked={editForm.isBreak}
                  onChange={e => setEditForm({ ...editForm, isBreak: e.target.checked })}
                  className="w-4 h-4 text-blue-900 rounded border-slate-300 focus:ring-blue-800"
                />
                <label htmlFor="chkBreak" className="font-bold text-slate-800 cursor-pointer">
                  Tandai sebagai Slot Istirahat / Upacara / Kegiatan Non-KBM
                </label>
              </div>

              {editForm.isBreak ? (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Nama Kegiatan / Keterangan Istirahat:
                  </label>
                  <input
                    type="text"
                    value={editForm.breakTitle}
                    onChange={e => setEditForm({ ...editForm, breakTitle: e.target.value })}
                    placeholder="misal: ISTIRAHAT I, Upacara Bendera, Ibadah Pagi"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold focus:ring-2 focus:ring-blue-800"
                  />
                </div>
              ) : (
                <>
                  {/* Select Subject */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Mata Pelajaran:
                    </label>
                    <select
                      value={editForm.subjectId}
                      onChange={e => {
                        const newSubjId = e.target.value;
                        // Auto-suggest teacher from teaching assignments if available
                        const assigned = teachingAssignments.find(
                          a => a.classRomBelId === editingSlot.classRomBelId && a.subjectId === newSubjId
                        );
                        setEditForm({
                          ...editForm,
                          subjectId: newSubjId,
                          teacherId: assigned ? assigned.teacherId : editForm.teacherId
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold focus:ring-2 focus:ring-blue-800"
                    >
                      <option value="">-- Pilih Mata Pelajaran --</option>
                      {subjects.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.code} · Fase {s.phase})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Teacher */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Guru Pengampu Pendidik:
                    </label>
                    <select
                      value={editForm.teacherId}
                      onChange={e => setEditForm({ ...editForm, teacherId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold focus:ring-2 focus:ring-blue-800"
                    >
                      <option value="">-- Pilih Guru Pengampu --</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.primarySubject})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Room */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Ruang Belajar:
                    </label>
                    <input
                      type="text"
                      value={editForm.roomName}
                      onChange={e => setEditForm({ ...editForm, roomName: e.target.value })}
                      placeholder="misal: Ruang Kelas 10A, Lab Komputer, Lapangan Olahraga"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold focus:ring-2 focus:ring-blue-800"
                    />
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleClearSlot}
                  className="px-3 py-2 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold"
                >
                  Kosongkan Slot
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingSlot(null)}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-950 text-white font-bold shadow-2xs"
                  >
                    Simpan Perubahan Slot
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
