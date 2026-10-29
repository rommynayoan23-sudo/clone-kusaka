import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Teacher, Subject, ClassRomBel } from '../../types';
import {
  Users,
  BookOpen,
  GraduationCap,
  Clock,
  Search,
  Plus,
  Download,
  Upload,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  X,
  Filter
} from 'lucide-react';

export const MasterDataView: React.FC = () => {
  const {
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    classes,
    addClass,
    updateClass,
    deleteClass,
    showToast,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'teachers' | 'subjects' | 'classes' | 'schedule_settings'>('teachers');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Modals state
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRomBel | null>(null);

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'vice_curriculum' || currentUser.role === 'curriculum_staff';

  // TEACHER FORM STATE
  const [tForm, setTForm] = useState({
    nip: '',
    name: '',
    title: 'S.Pd.',
    gender: 'L' as 'L' | 'P',
    rankAndGrade: 'Penata Muda / III a',
    employmentStatus: 'PNS' as 'PNS' | 'PPPK' | 'GTT' | 'Honor Sekolah',
    primarySubject: 'Matematika',
    additionalTask: '',
    totalHours: 24,
    phone: '',
    email: '',
    isCertified: true
  });

  // SUBJECT FORM STATE
  const [sForm, setSForm] = useState({
    code: '',
    name: '',
    category: 'Umum' as 'Umum' | 'Pilihan' | 'Muatan Lokal' | 'P5',
    phase: 'E/F' as 'E' | 'F' | 'E/F',
    weeklyHours: 3,
    kokurikulerHours: 1,
    coordinatorName: '',
    description: ''
  });

  // CLASS FORM STATE
  const [cForm, setCForm] = useState({
    name: '',
    phase: 'E' as 'E' | 'F',
    gradeLevel: 'X' as 'X' | 'XI' | 'XII',
    homeroomTeacherId: '',
    homeroomTeacherName: '',
    totalStudents: 32,
    maleStudents: 15,
    femaleStudents: 17,
    roomName: 'Ruang 101'
  });

  // FILTERED TEACHERS
  const filteredTeachers = teachers.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.primarySubject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === 'all' || t.employmentStatus === filterCategory;
    return matchSearch && matchCat;
  });

  // FILTERED SUBJECTS
  const filteredSubjects = subjects.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === 'all' || s.category === filterCategory;
    return matchSearch && matchCat;
  });

  // FILTERED CLASSES
  const filteredClasses = classes.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.homeroomTeacherName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === 'all' || c.gradeLevel === filterCategory;
    return matchSearch && matchCat;
  });

  // EXPORT CSV HANDLERS
  const exportTeachersCsv = () => {
    const header = 'NIP,Nama Lengkap,Pangkat/Golongan,Status,Mata Pelajaran Utama,Tugas Tambahan,JJM,Kontak\n';
    const rows = teachers.map(t =>
      `"${t.nip}","${t.name}","${t.rankAndGrade}","${t.employmentStatus}","${t.primarySubject}","${t.additionalTask || '-'}","${t.totalHours}","${t.phone}"`
    ).join('\n');
    downloadCsv(header + rows, `DATA-GURU-SMAN1-KAKAS-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportSubjectsCsv = () => {
    const header = 'Kode,Nama Mata Pelajaran,Kategori,Fase,Jam Intrakurikuler,Jam P5,Koordinator\n';
    const rows = subjects.map(s =>
      `"${s.code}","${s.name}","${s.category}","${s.phase}","${s.weeklyHours}","${s.kokurikulerHours}","${s.coordinatorName}"`
    ).join('\n');
    downloadCsv(header + rows, `DATA-MAPEL-SMAN1-KAKAS-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const downloadCsv = (content: string, filename: string) => {
    const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Berkas ${filename} berhasil diunduh.`, 'success');
  };

  // DOWNLOAD TEMPLATE CSV
  const downloadTemplateCsv = (type: string) => {
    if (type === 'teachers') {
      const sample = 'NIP,Nama Lengkap,Pangkat/Golongan,Status (PNS/PPPK/GTT),Mata Pelajaran,Tugas Tambahan,JJM,No HP\n' +
        '"19820419 200801 1 008","Rommy Senfrie Najoan, S.Pd.","Penata Tk. I / III d","PNS","Bahasa Inggris","Wakasek Kurikulum","24","081244556677"\n';
      downloadCsv(sample, 'TEMPLAT-IMPOR-GURU-SMAN1-KAKAS.csv');
    } else {
      const sample = 'Kode,Nama Mapel,Kategori (Umum/Pilihan/P5),Fase (E/F),Jam Intrakurikuler,Jam P5,Koordinator\n' +
        '"MAT-E","Matematika","Umum","E","4","1","Drs. Ferry Mandolang"\n';
      downloadCsv(sample, 'TEMPLAT-IMPOR-MAPEL-SMAN1-KAKAS.csv');
    }
  };

  // TEACHER MODAL OPEN
  const openAddTeacher = () => {
    setEditingTeacher(null);
    setTForm({
      nip: '',
      name: '',
      title: 'S.Pd.',
      gender: 'L',
      rankAndGrade: 'Penata Muda / III a',
      employmentStatus: 'PNS',
      primarySubject: subjects[0]?.name || 'Matematika',
      additionalTask: '',
      totalHours: 24,
      phone: '',
      email: '',
      isCertified: true
    });
    setShowTeacherModal(true);
  };

  const openEditTeacher = (t: Teacher) => {
    setEditingTeacher(t);
    setTForm({
      nip: t.nip,
      name: t.name,
      title: t.title,
      gender: t.gender,
      rankAndGrade: t.rankAndGrade,
      employmentStatus: t.employmentStatus,
      primarySubject: t.primarySubject,
      additionalTask: t.additionalTask || '',
      totalHours: t.totalHours,
      phone: t.phone,
      email: t.email,
      isCertified: t.isCertified
    });
    setShowTeacherModal(true);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeacher) {
      updateTeacher({
        ...editingTeacher,
        ...tForm,
        subjectsTaught: [tForm.primarySubject]
      });
    } else {
      addTeacher({
        ...tForm,
        subjectsTaught: [tForm.primarySubject]
      });
    }
    setShowTeacherModal(false);
  };

  // SUBJECT MODAL OPEN
  const openAddSubject = () => {
    setEditingSubject(null);
    setSForm({
      code: '',
      name: '',
      category: 'Umum',
      phase: 'E/F',
      weeklyHours: 3,
      kokurikulerHours: 0,
      coordinatorName: teachers[0]?.name || '',
      description: ''
    });
    setShowSubjectModal(true);
  };

  const openEditSubject = (s: Subject) => {
    setEditingSubject(s);
    setSForm({
      code: s.code,
      name: s.name,
      category: s.category,
      phase: s.phase,
      weeklyHours: s.weeklyHours,
      kokurikulerHours: s.kokurikulerHours,
      coordinatorName: s.coordinatorName,
      description: s.description || ''
    });
    setShowSubjectModal(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSubject) {
      updateSubject({
        ...editingSubject,
        ...sForm
      });
    } else {
      addSubject({
        ...sForm
      });
    }
    setShowSubjectModal(false);
  };

  // CLASS MODAL OPEN
  const openAddClass = () => {
    setEditingClass(null);
    setCForm({
      name: '',
      phase: 'E',
      gradeLevel: 'X',
      homeroomTeacherId: teachers[0]?.id || '',
      homeroomTeacherName: teachers[0]?.name || '',
      totalStudents: 32,
      maleStudents: 15,
      femaleStudents: 17,
      roomName: 'Ruang Kelas'
    });
    setShowClassModal(true);
  };

  const openEditClass = (c: ClassRomBel) => {
    setEditingClass(c);
    setCForm({
      name: c.name,
      phase: c.phase,
      gradeLevel: c.gradeLevel,
      homeroomTeacherId: c.homeroomTeacherId,
      homeroomTeacherName: c.homeroomTeacherName,
      totalStudents: c.totalStudents,
      maleStudents: c.maleStudents,
      femaleStudents: c.femaleStudents,
      roomName: c.roomName
    });
    setShowClassModal(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    const targetTeacher = teachers.find(t => t.id === cForm.homeroomTeacherId);
    const updatedName = targetTeacher ? targetTeacher.name : cForm.homeroomTeacherName;

    if (editingClass) {
      updateClass({
        ...editingClass,
        ...cForm,
        homeroomTeacherName: updatedName
      });
    } else {
      addClass({
        ...cForm,
        homeroomTeacherName: updatedName
      });
    }
    setShowClassModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Tab Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-800" />
              Pengelolaan Data Induk Sekolah Terpadu
            </h2>
            <p className="text-xs text-slate-500">
              Satu sumber data resmi untuk SK pembagian tugas, jadwal pelajaran, KSP, dan laporan dinas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'teachers' && (
              <>
                <button
                  onClick={() => downloadTemplateCsv('teachers')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
                  title="Unduh format tabel CSV untuk impor data"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Templat CSV</span>
                </button>
                <button
                  onClick={exportTeachersCsv}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-blue-700" />
                  <span>Ekspor CSV</span>
                </button>
                {canEdit && (
                  <button
                    onClick={openAddTeacher}
                    className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Guru</span>
                  </button>
                )}
              </>
            )}

            {activeTab === 'subjects' && (
              <>
                <button
                  onClick={() => downloadTemplateCsv('subjects')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Templat CSV</span>
                </button>
                <button
                  onClick={exportSubjectsCsv}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-blue-700" />
                  <span>Ekspor CSV</span>
                </button>
                {canEdit && (
                  <button
                    onClick={openAddSubject}
                    className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Mapel</span>
                  </button>
                )}
              </>
            )}

            {activeTab === 'classes' && canEdit && (
              <button
                onClick={openAddClass}
                className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Rombel</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          <button
            onClick={() => { setActiveTab('teachers'); setSearchQuery(''); setFilterCategory('all'); }}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'teachers'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Guru & Tenaga Pendidik ({teachers.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('subjects'); setSearchQuery(''); setFilterCategory('all'); }}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'subjects'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mata Pelajaran Kurikulum ({subjects.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('classes'); setSearchQuery(''); setFilterCategory('all'); }}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'classes'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Rombongan Belajar ({classes.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('schedule_settings'); }}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'schedule_settings'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Struktur Jam Pelajaran & Ruang</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        {activeTab !== 'schedule_settings' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={
                  activeTab === 'teachers' ? 'Cari guru, NIP, atau mata pelajaran...' :
                  activeTab === 'subjects' ? 'Cari kode atau nama mata pelajaran...' :
                  'Cari kelas atau wali kelas...'
                }
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-800 focus:outline-hidden"
              />
            </div>

            {/* Filter Pill Tabs */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto text-xs">
              <span className="text-slate-400 text-[11px] font-medium mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              {activeTab === 'teachers' && (
                <>
                  {['all', 'PNS', 'PPPK', 'GTT'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                        filterCategory === cat
                          ? 'bg-blue-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat === 'all' ? 'Semua Status' : cat}
                    </button>
                  ))}
                </>
              )}
              {activeTab === 'subjects' && (
                <>
                  {['all', 'Umum', 'Pilihan', 'P5'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                        filterCategory === cat
                          ? 'bg-blue-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat === 'all' ? 'Semua Kategori' : cat}
                    </button>
                  ))}
                </>
              )}
              {activeTab === 'classes' && (
                <>
                  {['all', 'X', 'XI', 'XII'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                        filterCategory === cat
                          ? 'bg-blue-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat === 'all' ? 'Semua Tingkat' : `Kelas ${cat}`}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: TEACHERS TABLE */}
      {activeTab === 'teachers' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-3 w-10">No</th>
                  <th className="p-3">Nama Lengkap & NIP</th>
                  <th className="p-3">Pangkat / Golongan</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Mata Pelajaran Diampu</th>
                  <th className="p-3">Tugas Tambahan</th>
                  <th className="p-3 text-center">Beban (JJM)</th>
                  <th className="p-3 text-center">Sertifikasi</th>
                  {canEdit && <th className="p-3 text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {t.nip && t.nip !== '-' ? `NIP. ${t.nip}` : 'NIP: Belum terdaftar'}
                      </div>
                    </td>
                    <td className="p-3 text-slate-700 font-medium">{t.rankAndGrade || '-'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.employmentStatus === 'PNS' ? 'bg-blue-100 text-blue-800' :
                        t.employmentStatus === 'PPPK' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {t.employmentStatus}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">
                      {t.primarySubject}
                    </td>
                    <td className="p-3 text-slate-600">
                      {t.additionalTask ? (
                        <span className="font-medium text-slate-800">{t.additionalTask}</span>
                      ) : (
                        <span className="text-slate-400 italic">-</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md font-mono font-bold text-xs ${
                        t.totalHours >= 24
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {t.totalHours} JJM
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {t.isCertified ? (
                        <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Sudah
                        </span>
                      ) : (
                        <span className="text-slate-400">Belum</span>
                      )}
                    </td>
                    {canEdit && (
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditTeacher(t)}
                            className="p-1 text-blue-700 hover:text-blue-900 rounded hover:bg-blue-50"
                            title="Edit Data Guru"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus guru ${t.name}?`)) {
                                deleteTeacher(t.id);
                              }
                            }}
                            className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                            title="Hapus Data Guru"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SUBJECTS TABLE */}
      {activeTab === 'subjects' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-3 w-10">No</th>
                  <th className="p-3">Kode</th>
                  <th className="p-3">Nama Mata Pelajaran</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Fase</th>
                  <th className="p-3 text-center">Intra (JJM)</th>
                  <th className="p-3 text-center">P5 (Jam)</th>
                  <th className="p-3">Koordinator Mapel</th>
                  {canEdit && <th className="p-3 text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubjects.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-mono font-bold text-blue-900">{s.code}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      {s.description && (
                        <div className="text-[11px] text-slate-500">{s.description}</div>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.category === 'Umum' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                        s.category === 'Pilihan' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        'bg-purple-50 text-purple-800 border border-purple-200'
                      }`}>
                        {s.category}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-700">Fase {s.phase}</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-900">
                      {s.weeklyHours} Jam
                    </td>
                    <td className="p-3 text-center font-mono text-slate-600">
                      {s.kokurikulerHours > 0 ? `${s.kokurikulerHours} Jam` : '-'}
                    </td>
                    <td className="p-3 text-slate-700">{s.coordinatorName || '-'}</td>
                    {canEdit && (
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditSubject(s)}
                            className="p-1 text-blue-700 hover:text-blue-900 rounded hover:bg-blue-50"
                            title="Edit Mata Pelajaran"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus mapel ${s.name}?`)) {
                                deleteSubject(s.id);
                              }
                            }}
                            className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                            title="Hapus Mapel"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CLASSES TABLE */}
      {activeTab === 'classes' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-3 w-10">No</th>
                  <th className="p-3">Nama Rombel</th>
                  <th className="p-3">Tingkat & Fase</th>
                  <th className="p-3">Wali Kelas</th>
                  <th className="p-3 text-center">Laki-Laki</th>
                  <th className="p-3 text-center">Perempuan</th>
                  <th className="p-3 text-center">Total Siswa</th>
                  <th className="p-3">Ruang Belajar</th>
                  {canEdit && <th className="p-3 text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClasses.map((c, idx) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-extrabold text-blue-950 text-sm">{c.name}</td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-800">Kelas {c.gradeLevel}</span>
                      <span className="text-slate-400"> · </span>
                      <span className="text-amber-800 font-bold">Fase {c.phase}</span>
                    </td>
                    <td className="p-3 font-medium text-slate-900">{c.homeroomTeacherName}</td>
                    <td className="p-3 text-center font-mono text-slate-600">{c.maleStudents}</td>
                    <td className="p-3 text-center font-mono text-slate-600">{c.femaleStudents}</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-900 bg-slate-50">
                      {c.totalStudents} Siswa
                    </td>
                    <td className="p-3 text-slate-600">{c.roomName}</td>
                    {canEdit && (
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditClass(c)}
                            className="p-1 text-blue-700 hover:text-blue-900 rounded hover:bg-blue-50"
                            title="Edit Rombel"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus rombel ${c.name}?`)) {
                                deleteClass(c.id);
                              }
                            }}
                            className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                            title="Hapus Rombel"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SCHEDULE & PERIOD STRUCTURE */}
      {activeTab === 'schedule_settings' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">
              Struktur Jam Pelajaran Harian (Kurikulum Merdeka SMA Negeri 1 Kakas)
            </h3>
            <p className="text-xs text-slate-500">
              Durasi standar 45 menit per jam pelajaran dengan 2 sesi istirahat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 font-bold text-xs text-slate-800 border-b border-slate-200">
                Alokasi Waktu Jam Belajar (Senin - Kamis)
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {[
                  { jam: '07:15 - 07:45', ket: 'Apel Pagi & Literasi / Ibadah Pagi SMAN 1 Kakas' },
                  { jam: '07:45 - 08:30', ket: 'Jam Ke-1 (45 Menit)' },
                  { jam: '08:30 - 09:15', ket: 'Jam Ke-2 (45 Menit)' },
                  { jam: '09:15 - 10:00', ket: 'Jam Ke-3 (45 Menit)' },
                  { jam: '10:00 - 10:20', ket: 'ISTIRAHAT I (20 Menit)', isBreak: true },
                  { jam: '10:20 - 11:05', ket: 'Jam Ke-4 (45 Menit)' },
                  { jam: '11:05 - 11:50', ket: 'Jam Ke-5 (45 Menit)' },
                  { jam: '11:50 - 12:35', ket: 'Jam Ke-6 (45 Menit)' },
                  { jam: '12:35 - 13:05', ket: 'ISTIRAHAT II / Makan Siang (30 Menit)', isBreak: true },
                  { jam: '13:05 - 13:50', ket: 'Jam Ke-7 (45 Menit)' },
                  { jam: '13:50 - 14:35', ket: 'Jam Ke-8 (45 Menit)' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-2 flex items-center justify-between ${
                      item.isBreak ? 'bg-amber-50 font-bold text-amber-900' : ''
                    }`}
                  >
                    <span className="font-mono text-slate-700">{item.jam}</span>
                    <span className="font-medium text-slate-900">{item.ket}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="border border-slate-200 rounded-lg p-4 bg-blue-50/40 text-xs space-y-2">
                <h4 className="font-bold text-blue-950">Ketentuan Hari Belajar & Ruang Kelas:</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed">
                  <li>Hari belajar efektif: 5 Hari Sekolah (Senin s.d. Jumat).</li>
                  <li>Hari Jumat: KBM berakhir pukul 11.30 WITA dilanjutkan Pengembangan Diri / Komunitas Belajar / Ibadah bersama.</li>
                  <li>Ketersediaan Ruang Teori: 7 Ruang Kelas Utama (10A, 10B, 10C, 11A, 11B, 12A, 12B).</li>
                  <li>Ruang Khusus: Lab IPA Fisika/Kimia/Biologi, Lab Komputer Informatika, Perpustakaan, Lapangan Olahraga.</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Kaidah Penjadwalan Bebas Benturan:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Sistem menjamin satu guru tidak dapat dijadwalkan pada dua rombel sekaligus pada jam pelajaran yang sama, dan ruang kelas khusus (seperti Lab Komputer) diproteksi dari tabrakan jadwal antar-fase.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD/EDIT TEACHER */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingTeacher ? 'Ubah Data Pendidik' : 'Tambah Pendidik / Guru Baru'}
              </h3>
              <button
                onClick={() => setShowTeacherModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    value={tForm.name}
                    onChange={e => setTForm({ ...tForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                    placeholder="misal: Rommy Senfrie Najoan, S.Pd."
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIP (Kosongkan jika belum ada)</label>
                  <input
                    type="text"
                    value={tForm.nip}
                    onChange={e => setTForm({ ...tForm, nip: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                    placeholder="19820419 200801 1 008"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Kepegawaian *</label>
                  <select
                    value={tForm.employmentStatus}
                    onChange={e => setTForm({ ...tForm, employmentStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="PNS">PNS</option>
                    <option value="PPPK">PPPK</option>
                    <option value="GTT">GTT (Guru Tidak Tetap)</option>
                    <option value="Honor Sekolah">Honor Sekolah</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pangkat / Golongan</label>
                  <input
                    type="text"
                    value={tForm.rankAndGrade}
                    onChange={e => setTForm({ ...tForm, rankAndGrade: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    placeholder="Pembina / IV a"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran Utama *</label>
                  <input
                    type="text"
                    required
                    value={tForm.primarySubject}
                    onChange={e => setTForm({ ...tForm, primarySubject: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                    placeholder="Bahasa Inggris"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tugas Tambahan</label>
                  <input
                    type="text"
                    value={tForm.additionalTask}
                    onChange={e => setTForm({ ...tForm, additionalTask: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    placeholder="Wali Kelas X-1 / Pembina OSIS"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alokasi JJM per Minggu</label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={tForm.totalHours}
                    onChange={e => setTForm({ ...tForm, totalHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Kontak / WhatsApp</label>
                  <input
                    type="text"
                    value={tForm.phone}
                    onChange={e => setTForm({ ...tForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    placeholder="081244556677"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Surel (Email)</label>
                  <input
                    type="email"
                    value={tForm.email}
                    onChange={e => setTForm({ ...tForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    placeholder="guru@sman1kakas.sch.id"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTeacherModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-950"
                >
                  Simpan Data Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD/EDIT SUBJECT */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingSubject ? 'Ubah Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
              </h3>
              <button
                onClick={() => setShowSubjectModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode Mapel *</label>
                  <input
                    type="text"
                    required
                    value={sForm.code}
                    onChange={e => setSForm({ ...sForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono uppercase"
                    placeholder="MAT-E"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori *</label>
                  <select
                    value={sForm.category}
                    onChange={e => setSForm({ ...sForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="Umum">Umum</option>
                    <option value="Pilihan">Pilihan</option>
                    <option value="Muatan Lokal">Muatan Lokal</option>
                    <option value="P5">P5</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Nama Mata Pelajaran *</label>
                  <input
                    type="text"
                    required
                    value={sForm.name}
                    onChange={e => setSForm({ ...sForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                    placeholder="Matematika (Umum)"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fase Belajar *</label>
                  <select
                    value={sForm.phase}
                    onChange={e => setSForm({ ...sForm, phase: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="E/F">Fase E & F</option>
                    <option value="E">Fase E (Kelas X)</option>
                    <option value="F">Fase F (Kelas XI - XII)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Intrakurikuler / Minggu</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={sForm.weeklyHours}
                    onChange={e => setSForm({ ...sForm, weeklyHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Koordinator Mata Pelajaran</label>
                  <input
                    type="text"
                    value={sForm.coordinatorName}
                    onChange={e => setSForm({ ...sForm, coordinatorName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    placeholder="Nama guru koordinator"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-950"
                >
                  Simpan Mapel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD/EDIT CLASS */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingClass ? 'Ubah Rombongan Belajar' : 'Tambah Rombongan Belajar Baru'}
              </h3>
              <button
                onClick={() => setShowClassModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Nama Rombel *</label>
                  <input
                    type="text"
                    required
                    value={cForm.name}
                    onChange={e => setCForm({ ...cForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                    placeholder="Kelas X-4"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tingkat Kelas</label>
                  <select
                    value={cForm.gradeLevel}
                    onChange={e => setCForm({ ...cForm, gradeLevel: e.target.value as any, phase: e.target.value === 'X' ? 'E' : 'F' })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="X">Kelas X (Fase E)</option>
                    <option value="XI">Kelas XI (Fase F)</option>
                    <option value="XII">Kelas XII (Fase F)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ruang Kelas</label>
                  <input
                    type="text"
                    value={cForm.roomName}
                    onChange={e => setCForm({ ...cForm, roomName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    placeholder="Ruang 10D"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Wali Kelas *</label>
                  <select
                    value={cForm.homeroomTeacherId}
                    onChange={e => setCForm({ ...cForm, homeroomTeacherId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.primarySubject})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Siswa Laki-laki</label>
                  <input
                    type="number"
                    min="0"
                    value={cForm.maleStudents}
                    onChange={e => setCForm({ ...cForm, maleStudents: Number(e.target.value), totalStudents: Number(e.target.value) + cForm.femaleStudents })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Siswa Perempuan</label>
                  <input
                    type="number"
                    min="0"
                    value={cForm.femaleStudents}
                    onChange={e => setCForm({ ...cForm, femaleStudents: Number(e.target.value), totalStudents: cForm.maleStudents + Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-950"
                >
                  Simpan Rombel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
