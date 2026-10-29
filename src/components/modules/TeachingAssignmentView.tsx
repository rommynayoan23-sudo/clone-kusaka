import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TeachingAssignment } from '../../types';
import { KopSurat } from '../common/KopSurat';
import {
  Users2,
  Plus,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  Printer,
  Download,
  Trash2,
  Edit2,
  X,
  FileSpreadsheet,
  Award,
  Filter,
  Search,
  BookOpen,
  Building,
  Briefcase,
  AlertCircle,
  FileText
} from 'lucide-react';
import jsPDF from 'jspdf';

export const TeachingAssignmentView: React.FC = () => {
  const {
    teachingAssignments,
    addTeachingAssignment,
    updateTeachingAssignment,
    deleteTeachingAssignment,
    teachers,
    subjects,
    classes,
    schoolProfile,
    activeAcademicYear,
    currentUser,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'matrix' | 'recap' | 'curriculum_audit' | 'print_decree'>('matrix');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<TeachingAssignment | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTeacher, setFilterTeacher] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  const [filterPhase, setFilterPhase] = useState('all');

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'vice_curriculum' || currentUser.role === 'curriculum_staff';

  const [form, setForm] = useState({
    teacherId: teachers[0]?.id || '',
    subjectId: subjects[0]?.id || '',
    classRomBelId: classes[0]?.id || '',
    hoursPerWeek: 2,
    notes: 'Intrakurikuler Fase E'
  });

  // Calculate JJM summary for each teacher based on Permendikbud 15/2018
  const teacherRecap = useMemo(() => {
    return teachers.map(teacher => {
      const assignments = teachingAssignments.filter(a => a.teacherId === teacher.id);
      const directHours = assignments.reduce((sum, a) => sum + a.hoursPerWeek, 0);

      // Ekuivalensi tugas tambahan sesuai regulasi Kemendikbudristek
      let additionalEquivalentHours = 0;
      const task = teacher.additionalTask?.toLowerCase() || '';

      if (task.includes('kepala sekolah')) {
        additionalEquivalentHours = 24;
      } else if (task.includes('wakil kepala sekolah')) {
        additionalEquivalentHours = 12;
      } else if (task.includes('wali kelas')) {
        additionalEquivalentHours = 2;
      } else if (task.includes('kepala perpustakaan') || task.includes('kepala lab')) {
        additionalEquivalentHours = 12;
      } else if (task.includes('pembina osis') || task.includes('koordinator uks')) {
        additionalEquivalentHours = 2;
      } else if (task.includes('koordinator p5')) {
        additionalEquivalentHours = 2;
      }

      const totalCalculatedHours = directHours + additionalEquivalentHours;
      const isMeetsRequirement = totalCalculatedHours >= 24;
      const isOverload = totalCalculatedHours > 40;

      return {
        teacher,
        assignments,
        directHours,
        additionalEquivalentHours,
        totalCalculatedHours,
        isMeetsRequirement,
        isOverload,
        shortage: Math.max(0, 24 - totalCalculatedHours)
      };
    });
  }, [teachers, teachingAssignments]);

  // Curriculum allocation audit per class (36 JP standard)
  const classCurriculumAudit = useMemo(() => {
    return classes.map(cls => {
      const classAssignments = teachingAssignments.filter(a => a.classRomBelId === cls.id);
      const totalAllocatedJp = classAssignments.reduce((acc, a) => acc + a.hoursPerWeek, 0);
      const targetJp = 36; // 36 JP weekly intrakurikuler & P5 block
      const diff = totalAllocatedJp - targetJp;

      return {
        cls,
        classAssignments,
        totalAllocatedJp,
        targetJp,
        diff,
        isComplete: totalAllocatedJp === targetJp
      };
    });
  }, [classes, teachingAssignments]);

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    return teachingAssignments.filter(a => {
      if (filterTeacher !== 'all' && a.teacherId !== filterTeacher) return false;
      if (filterClass !== 'all' && a.classRomBelId !== filterClass) return false;
      if (filterPhase !== 'all' && a.phase !== filterPhase) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTeacher = a.teacherName.toLowerCase().includes(q);
        const matchesSubject = a.subjectName.toLowerCase().includes(q);
        const matchesClass = a.classRomBelName.toLowerCase().includes(q);
        if (!matchesTeacher && !matchesSubject && !matchesClass) return false;
      }
      return true;
    });
  }, [teachingAssignments, filterTeacher, filterClass, filterPhase, searchQuery]);

  const handleOpenAdd = () => {
    setEditingAssignment(null);
    setForm({
      teacherId: teachers[0]?.id || '',
      subjectId: subjects[0]?.id || '',
      classRomBelId: classes[0]?.id || '',
      hoursPerWeek: 2,
      notes: 'Intrakurikuler'
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (a: TeachingAssignment) => {
    setEditingAssignment(a);
    setForm({
      teacherId: a.teacherId,
      subjectId: a.subjectId,
      classRomBelId: a.classRomBelId,
      hoursPerWeek: a.hoursPerWeek,
      notes: a.notes || ''
    });
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const selTeacher = teachers.find(t => t.id === form.teacherId);
    const selSubject = subjects.find(s => s.id === form.subjectId);
    const selClass = classes.find(c => c.id === form.classRomBelId);

    if (!selTeacher || !selSubject || !selClass) return;

    if (editingAssignment) {
      updateTeachingAssignment({
        ...editingAssignment,
        teacherId: selTeacher.id,
        teacherName: selTeacher.name,
        subjectId: selSubject.id,
        subjectName: selSubject.name,
        classRomBelId: selClass.id,
        classRomBelName: selClass.name,
        phase: selClass.phase,
        hoursPerWeek: form.hoursPerWeek,
        notes: form.notes
      });
      showToast('Penugasan mengajar berhasil diperbarui.', 'success');
    } else {
      // Check existing assignment
      const existing = teachingAssignments.find(
        a => a.classRomBelId === form.classRomBelId && a.subjectId === form.subjectId
      );
      if (existing) {
        if (!confirm(`Peringatan: ${selClass.name} untuk mapel ${selSubject.name} sudah diampu oleh ${existing.teacherName}. Tetap tambahkan (misal sebagai tim teaching)?`)) {
          return;
        }
      }

      addTeachingAssignment({
        academicYear: activeAcademicYear.year,
        semester: activeAcademicYear.activeSemester,
        teacherId: selTeacher.id,
        teacherName: selTeacher.name,
        subjectId: selSubject.id,
        subjectName: selSubject.name,
        classRomBelId: selClass.id,
        classRomBelName: selClass.name,
        phase: selClass.phase,
        hoursPerWeek: form.hoursPerWeek,
        notes: form.notes
      });
      showToast('Penugasan mengajar baru berhasil ditambahkan.', 'success');
    }

    setShowAddModal(false);
  };

  // Export Recap to CSV
  const exportRecapCsv = () => {
    const header = 'Nama Guru,NIP,Tugas Tambahan,Jam Tatap Muka (Intra),Ekuivalensi Tambahan,Total JJM,Status Pemenuhan Beban (Min 24)\n';
    const rows = teacherRecap.map(r =>
      `"${r.teacher.name}","${r.teacher.nip}","${r.teacher.additionalTask || '-'}","${r.directHours}","${r.additionalEquivalentHours}","${r.totalCalculatedHours}","${r.isMeetsRequirement ? 'Memenuhi' : `Defisit ${r.shortage} JP`}"`
    ).join('\n');

    const blob = new Blob(['\ufeff' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `REKAP-BEBAN-MENGAJAR-SMAN1-KAKAS-${activeAcademicYear.year.replace('/', '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Rekapitulasi beban kerja guru berhasil diekspor ke CSV.', 'success');
  };

  // Export Detailed Assignment List to CSV
  const exportAssignmentsCsv = () => {
    let csv = `LAMPIRAN SK PEMBAGIAN TUGAS MENGAJAR - SMA NEGERI 1 KAKAS\n`;
    csv += `Tahun Pelajaran: ${activeAcademicYear.year} (${activeAcademicYear.activeSemester})\n\n`;
    csv += 'No,Nama Guru,NIP,Mata Pelajaran,Kelas,Fase,Alokasi JP/Minggu,Keterangan\n';

    teachingAssignments.forEach((a, i) => {
      const tch = teachers.find(t => t.id === a.teacherId);
      csv += `"${i + 1}","${a.teacherName}","${tch?.nip || '-'}","${a.subjectName}","${a.classRomBelName}","Fase ${a.phase}","${a.hoursPerWeek}","${a.notes || '-'}"\n`;
    });

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DAFTAR-PEMBAGIAN-TUGAS-MENGAJAR-SMAN1-KAKAS-${activeAcademicYear.year.replace('/', '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Daftar pembagian tugas mengajar berhasil diekspor ke CSV.', 'success');
  };

  // Export SK Lampiran to PDF via jsPDF
  const exportDecreePDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 14;

    // Kop Surat
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text((schoolProfile.dinasProvinsi || 'PEMERINTAH PROVINSI SULAWESI UTARA').toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 5;
    doc.setFontSize(11);
    doc.text((schoolProfile.dinasPendidikan || 'DINAS PENDIDIKAN DAERAH').toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 5;
    doc.setFontSize(13);
    doc.text((schoolProfile.name || 'SMA NEGERI 1 KAKAS').toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`${schoolProfile.address || 'Kakas, Minahasa'} | Surel: ${schoolProfile.email || 'sman1kakas@yahoo.com'}`, pageWidth / 2, y, { align: 'center' });
    y += 3;

    doc.setLineWidth(0.7);
    doc.line(15, y, pageWidth - 15, y);
    doc.setLineWidth(0.2);
    doc.line(15, y + 0.8, pageWidth - 15, y + 0.8);
    y += 7;

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('LAMPIRAN SURAT KEPUTUSAN KEPALA SMA NEGERI 1 KAKAS', pageWidth / 2, y, { align: 'center' });
    y += 4.5;
    doc.setFontSize(9);
    doc.text(`Nomor: ${schoolProfile.letterNumberPrefix || '421/SMAN1-KKS/'}088/SK-KUR/${activeAcademicYear.year.split('/')[0]}`, pageWidth / 2, y, { align: 'center' });
    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`TENTANG PEMBAGIAN TUGAS GURU DALAM PROSES PEMBELAJARAN SEMESTER ${activeAcademicYear.activeSemester.toUpperCase()} TAHUN PELAJARAN ${activeAcademicYear.year}`, pageWidth / 2, y, { align: 'center' });
    y += 6;

    // Table Header
    doc.setFillColor(30, 58, 138); // Navy
    doc.rect(15, y, pageWidth - 30, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);

    doc.text('NO', 18, y + 4.2);
    doc.text('NAMA LENGKAP & NIP', 28, y + 4.2);
    doc.text('MATA PELAJARAN', 95, y + 4.2);
    doc.text('KELAS', 155, y + 4.2);
    doc.text('FASE', 190, y + 4.2);
    doc.text('JJM', 215, y + 4.2);
    doc.text('KETERANGAN', 235, y + 4.2);
    y += 6;

    // Rows
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);

    teachingAssignments.forEach((a, i) => {
      if (y > 185) {
        doc.addPage();
        y = 15;
      }

      const isEven = i % 2 === 0;
      doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
      doc.rect(15, y, pageWidth - 30, 5, 'F');

      const tch = teachers.find(t => t.id === a.teacherId);
      doc.setFontSize(7);
      doc.text(String(i + 1), 19, y + 3.5);
      doc.text(`${a.teacherName} (${tch?.nip || '-'})`, 28, y + 3.5);
      doc.text(a.subjectName, 95, y + 3.5);
      doc.text(a.classRomBelName, 155, y + 3.5);
      doc.text(`Fase ${a.phase}`, 190, y + 3.5);
      doc.text(`${a.hoursPerWeek} JP`, 216, y + 3.5);
      doc.text(a.notes || '-', 235, y + 3.5);

      doc.setDrawColor(226, 232, 240);
      doc.line(15, y + 5, pageWidth - 15, y + 5);
      y += 5;
    });

    // Signature Block
    if (y > 170) {
      doc.addPage();
      y = 20;
    } else {
      y += 8;
    }

    const signX = pageWidth - 80;
    doc.setFontSize(8);
    doc.text(`Ditetapkan di: Kakas`, signX, y);
    y += 4;
    doc.text(`Pada tanggal: 15 Juli ${activeAcademicYear.year.split('/')[0]}`, signX, y);
    y += 4;
    doc.text(`Kepala SMA Negeri 1 Kakas,`, signX, y);
    y += 20;
    doc.setFont('helvetica', 'bold');
    doc.text(schoolProfile.principalName, signX, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(schoolProfile.principalNip ? `NIP. ${schoolProfile.principalNip}` : 'NIP: -', signX, y);
    doc.text(schoolProfile.principalRank || 'Pembina Tk. I / IV b', signX, y + 3.5);

    doc.save(`SK-PEMBAGIAN-TUGAS-SMAN1-KAKAS-${activeAcademicYear.year.replace('/', '-')}.pdf`);
    showToast('Lampiran SK Pembagian Tugas Mengajar berhasil diunduh (PDF).', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users2 className="w-5 h-5 text-blue-900" />
            Pembagian Tugas Mengajar & Beban Kerja Guru
          </h2>
          <p className="text-xs text-slate-500">
            Tahun Pelajaran {activeAcademicYear.year} ({activeAcademicYear.activeSemester}) · Parameter Permendikbudristek No. 15/2018 (Beban Kerja Minimal 24 JJM)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportAssignmentsCsv}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
            title="Ekspor daftar penugasan ke CSV"
          >
            <Download className="w-3.5 h-3.5 text-blue-700" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={exportDecreePDF}
            className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 text-blue-900 text-xs font-semibold flex items-center gap-1.5"
            title="Ekspor Lampiran SK ke PDF"
          >
            <FileText className="w-3.5 h-3.5 text-blue-800" />
            <span>Ekspor SK PDF</span>
          </button>

          <button
            onClick={() => setActiveTab('print_decree')}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-700" />
            <span>Pratinjau Cetak</span>
          </button>

          {canEdit && (
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Tugas Mengajar</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'matrix'
              ? 'border-blue-900 text-blue-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          1. Matriks Penugasan Rombel & Mapel ({teachingAssignments.length})
        </button>

        <button
          onClick={() => setActiveTab('recap')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'recap'
              ? 'border-blue-900 text-blue-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          2. Rekap Beban Kerja Guru (Validasi 24 JJM)
        </button>

        <button
          onClick={() => setActiveTab('curriculum_audit')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'curriculum_audit'
              ? 'border-blue-900 text-blue-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          3. Audit Alokasi JP Per Kelas (36 JP)
        </button>

        <button
          onClick={() => setActiveTab('print_decree')}
          className={`px-4 py-2 font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'print_decree'
              ? 'border-blue-900 text-blue-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          4. Lampiran SK Resmi
        </button>
      </div>

      {/* TAB 1: MATRIX TABLE */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {/* Search */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Cari guru, mapel, atau kelas..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-800"
                />
              </div>

              {/* Filter Teacher */}
              <select
                value={filterTeacher}
                onChange={e => setFilterTeacher(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-slate-50"
              >
                <option value="all">Semua Guru ({teachers.length})</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>

              {/* Filter Class */}
              <select
                value={filterClass}
                onChange={e => setFilterClass(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-slate-50"
              >
                <option value="all">Semua Rombel ({classes.length})</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Filter Phase */}
              <select
                value={filterPhase}
                onChange={e => setFilterPhase(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-slate-50"
              >
                <option value="all">Semua Fase</option>
                <option value="E">Fase E (Kelas X)</option>
                <option value="F">Fase F (Kelas XI - XII)</option>
              </select>
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              Menampilkan {filteredAssignments.length} dari {teachingAssignments.length} alokasi
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                    <th className="p-3 w-10 text-center">No</th>
                    <th className="p-3">Nama Guru</th>
                    <th className="p-3">Mata Pelajaran</th>
                    <th className="p-3">Rombel / Kelas</th>
                    <th className="p-3 text-center">Fase</th>
                    <th className="p-3 text-center">Alokasi JJM</th>
                    <th className="p-3">Keterangan</th>
                    {canEdit && <th className="p-3 text-right w-24">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssignments.map((a, idx) => (
                    <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono text-slate-400 text-center">{idx + 1}</td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{a.teacherName}</span>
                      </td>
                      <td className="p-3 font-semibold text-blue-900">{a.subjectName}</td>
                      <td className="p-3 font-semibold text-slate-800">{a.classRomBelName}</td>
                      <td className="p-3 text-center font-bold text-amber-800">Fase {a.phase}</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-900 bg-slate-50/70">
                        {a.hoursPerWeek} Jam
                      </td>
                      <td className="p-3 text-slate-500 text-[11px]">{a.notes || '-'}</td>
                      {canEdit && (
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEdit(a)}
                              className="p-1 text-slate-500 hover:text-blue-900 rounded hover:bg-slate-100"
                              title="Edit alokasi penugasan"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Hapus penugasan ${a.teacherName} untuk ${a.subjectName} di ${a.classRomBelName}?`)) {
                                  deleteTeachingAssignment(a.id);
                                }
                              }}
                              className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                              title="Hapus penugasan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                  {filteredAssignments.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 italic">
                        Tidak ada penugasan mengajar yang cocok dengan filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RECAP WITH 24 JJM VALIDATION */}
      {activeTab === 'recap' && (
        <div className="space-y-4">
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-950 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Ketentuan Dasar Validasi Beban Kerja (Permendikbud No. 15 Tahun 2018):</span>
              <p className="text-[11px] leading-relaxed">
                Guru bersertifikasi pendidik wajib memenuhi beban kerja minimal 24 jam tatap muka ekuivalensi per minggu (maksimal 40 jam). Ekuivalensi tugas tambahan: Kepala Sekolah (24 JP), Wakasek (12 JP), Kepala Perpustakaan/Lab (12 JP), Wali Kelas (2 JP), Pembina OSIS (2 JP), Koordinator P5 (2 JP).
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                    <th className="p-3 w-10 text-center">No</th>
                    <th className="p-3">Nama Lengkap & NIP</th>
                    <th className="p-3">Tugas Tambahan</th>
                    <th className="p-3 text-center">Tatap Muka (Intra)</th>
                    <th className="p-3 text-center">Ekuivalensi Tugas</th>
                    <th className="p-3 text-center">Total Beban</th>
                    <th className="p-3 text-center">Status Pemenuhan (Min 24)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teacherRecap.map((r, idx) => (
                    <tr key={r.teacher.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono text-slate-400 text-center">{idx + 1}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{r.teacher.name}</div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {r.teacher.nip && r.teacher.nip !== '-' ? `NIP. ${r.teacher.nip}` : 'NIP: -'} · {r.teacher.employmentStatus}
                        </div>
                      </td>
                      <td className="p-3 text-slate-700 font-medium">
                        {r.teacher.additionalTask || '-'}
                      </td>
                      <td className="p-3 text-center font-mono font-semibold text-slate-800">
                        {r.directHours} JJM
                      </td>
                      <td className="p-3 text-center font-mono text-slate-600">
                        {r.additionalEquivalentHours > 0 ? `+${r.additionalEquivalentHours} JJM` : '-'}
                      </td>
                      <td className="p-3 text-center font-mono font-extrabold text-blue-950 bg-slate-50/60">
                        {r.totalCalculatedHours} JJM
                      </td>
                      <td className="p-3 text-center">
                        {r.isMeetsRequirement ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Memenuhi ({r.totalCalculatedHours} JJM)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Defisit {r.shortage} JJM</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CURRICULUM ALLOCATION AUDIT PER CLASS */}
      {activeTab === 'curriculum_audit' && (
        <div className="space-y-4">
          <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-4 text-xs text-blue-950 flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-800 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Standar Jam Kurikulum Merdeka SMA Negeri 1 Kakas:</span>
              <p className="text-[11px] leading-relaxed">
                Setiap rombongan belajar dialokasikan 36 JP intrakurikuler dan projek P5 per minggu. Indikator di bawah ini mengevaluasi apakah seluruh rombel telah terisi penuh atau masih memiliki kekurangan alokasi jam.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classCurriculumAudit.map(item => (
              <div
                key={item.cls.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900">{item.cls.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                    Fase {item.cls.phase}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Target Kurikulum:</span>
                    <span className="font-bold">{item.targetJp} JP/minggu</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Terisi Saat Ini:</span>
                    <span className="font-bold text-blue-900">{item.totalAllocatedJp} JP</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Wali Kelas:</span>
                    <span className="font-medium truncate max-w-[150px]">{item.cls.homeroomTeacherName}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      item.totalAllocatedJp >= item.targetJp ? 'bg-emerald-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, (item.totalAllocatedJp / item.targetJp) * 100)}%` }}
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    {item.classAssignments.length} Mata Pelajaran
                  </span>
                  {item.isComplete ? (
                    <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Lengkap (100%)
                    </span>
                  ) : item.diff < 0 ? (
                    <span className="text-amber-700 font-bold text-[11px]">
                      Kurang {Math.abs(item.diff)} JP
                    </span>
                  ) : (
                    <span className="text-blue-700 font-bold text-[11px]">
                      Lebih {item.diff} JP
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: OFFICIAL DECREE PRINT PREVIEW */}
      {activeTab === 'print_decree' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-8 max-w-4xl mx-auto space-y-6 text-slate-900">
          <KopSurat />

          {/* Decree Title */}
          <div className="text-center space-y-1">
            <h3 className="text-sm font-bold tracking-wide uppercase">
              LAMPIRAN SURAT KEPUTUSAN KEPALA SMA NEGERI 1 KAKAS
            </h3>
            <p className="text-xs font-mono font-medium text-slate-700">
              NOMOR: {schoolProfile.letterNumberPrefix || '421/SMAN1-KKS/'}088/SK-KUR/{activeAcademicYear.year.split('/')[0]}
            </p>
            <p className="text-xs font-bold text-slate-800 uppercase pt-1">
              TENTANG PEMBAGIAN TUGAS GURU DALAM PROSES PEMBELAJARAN SEMESTER {activeAcademicYear.activeSemester.toUpperCase()} TAHUN PELAJARAN {activeAcademicYear.year}
            </p>
          </div>

          {/* Official Decree Table */}
          <div className="overflow-x-auto border border-slate-300 rounded">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold text-[11px]">
                  <th className="p-2.5 w-10 text-center border-r border-slate-300">No</th>
                  <th className="p-2.5 border-r border-slate-300">Nama Guru / NIP</th>
                  <th className="p-2.5 border-r border-slate-300">Mata Pelajaran</th>
                  <th className="p-2.5 border-r border-slate-300">Kelas</th>
                  <th className="p-2.5 text-center border-r border-slate-300">Fase</th>
                  <th className="p-2.5 text-center border-r border-slate-300">JJM</th>
                  <th className="p-2.5">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {teachingAssignments.map((a, idx) => {
                  const tch = teachers.find(t => t.id === a.teacherId);
                  return (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="p-2 text-center font-mono border-r border-slate-200">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-200 font-medium">
                        <div>{a.teacherName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{tch?.nip || '-'}</div>
                      </td>
                      <td className="p-2 border-r border-slate-200">{a.subjectName}</td>
                      <td className="p-2 border-r border-slate-200 font-semibold">{a.classRomBelName}</td>
                      <td className="p-2 text-center border-r border-slate-200 font-bold">Fase {a.phase}</td>
                      <td className="p-2 text-center border-r border-slate-200 font-mono font-bold">{a.hoursPerWeek} JP</td>
                      <td className="p-2 text-[11px] text-slate-600">{a.notes || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Signature Block */}
          <div className="pt-6 flex justify-between text-xs text-slate-800">
            <div className="space-y-1">
              <p>Mengetahui,</p>
              <p className="font-semibold">Wakil Kepala Sekolah Bidang Kurikulum,</p>
              <div className="h-20" />
              <p className="font-bold underline">{schoolProfile.viceCurriculumName}</p>
              <p className="text-[11px] font-mono">NIP. {schoolProfile.viceCurriculumNip || '-'}</p>
            </div>

            <div className="space-y-1 text-right">
              <p>Ditetapkan di: Kakas</p>
              <p>Pada tanggal: 15 Juli {activeAcademicYear.year.split('/')[0]}</p>
              <p className="font-semibold">Kepala SMA Negeri 1 Kakas,</p>
              <div className="h-20" />
              <p className="font-bold underline">{schoolProfile.principalName}</p>
              <p className="text-[11px] font-mono">NIP. {schoolProfile.principalNip || '-'}</p>
              <p className="text-[11px]">{schoolProfile.principalRank || 'Pembina Tk. I / IV b'}</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT ASSIGNMENT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-blue-950 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-amber-300">
                  {editingAssignment ? 'Edit Penugasan Mengajar' : 'Tambah Penugasan Mengajar Baru'}
                </h3>
                <p className="text-[11px] text-slate-300">
                  SMAN 1 Kakas · Tahun Pelajaran {activeAcademicYear.year} ({activeAcademicYear.activeSemester})
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              {/* Teacher */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Guru Pendidik:
                </label>
                <select
                  value={form.teacherId}
                  onChange={e => setForm({ ...form, teacherId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold focus:ring-2 focus:ring-blue-800"
                  required
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} (Tugas: {t.additionalTask || 'Guru Mapel'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Mata Pelajaran:
                </label>
                <select
                  value={form.subjectId}
                  onChange={e => setForm({ ...form, subjectId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold focus:ring-2 focus:ring-blue-800"
                  required
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code} · Standar {s.weeklyHours} JP)
                    </option>
                  ))}
                </select>
              </div>

              {/* Class */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Rombongan Belajar (Kelas):
                </label>
                <select
                  value={form.classRomBelId}
                  onChange={e => setForm({ ...form, classRomBelId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold focus:ring-2 focus:ring-blue-800"
                  required
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Fase {c.phase} · {c.roomName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Hours per Week */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Alokasi Jam Tatap Muka Per Minggu (JP):
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={form.hoursPerWeek}
                  onChange={e => setForm({ ...form, hoursPerWeek: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-blue-800"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Keterangan / Beban Khusus:
                </label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="misal: Intrakurikuler Fase E, Koordinator P5"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold focus:ring-2 focus:ring-blue-800"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-950 text-white font-bold shadow-2xs"
                >
                  {editingAssignment ? 'Simpan Perubahan' : 'Tambahkan Penugasan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
