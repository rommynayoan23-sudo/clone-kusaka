// KuSaKA AppContext - Central State & Event Management
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  SchoolProfile,
  AcademicYear,
  User,
  Teacher,
  Subject,
  ClassRomBel,
  TeachingAssignment,
  CalendarEvent,
  WorkProgram,
  OfficialDocument,
  DigitalArchiveItem,
  SupervisionRecord,
  AssessmentPlan,
  TeacherDevActivity,
  MonevRecord,
  AuditLog,
  AppNotification
} from '../types';
import { StorageService } from '../services/storage';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  schoolProfile: SchoolProfile;
  updateSchoolProfile: (profile: SchoolProfile) => void;

  academicYears: AcademicYear[];
  activeAcademicYear: AcademicYear;
  setActiveAcademicYear: (yearId: string) => void;
  setActiveSemester: (semester: 'Ganjil' | 'Genap') => void;

  users: User[];
  currentUser: User;
  setCurrentUser: (userId: string) => void;

  teachers: Teacher[];
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (teacher: Teacher) => void;
  deleteTeacher: (id: string) => void;

  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (subject: Subject) => void;
  deleteSubject: (id: string) => void;

  classes: ClassRomBel[];
  addClass: (cls: Omit<ClassRomBel, 'id'>) => void;
  updateClass: (cls: ClassRomBel) => void;
  deleteClass: (id: string) => void;

  teachingAssignments: TeachingAssignment[];
  addTeachingAssignment: (assignment: Omit<TeachingAssignment, 'id'>) => void;
  updateTeachingAssignment: (assignment: TeachingAssignment) => void;
  deleteTeachingAssignment: (id: string) => void;

  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (event: CalendarEvent) => void;
  deleteCalendarEvent: (id: string) => void;

  workPrograms: WorkProgram[];
  addWorkProgram: (prog: Omit<WorkProgram, 'id'>) => void;
  updateWorkProgram: (prog: WorkProgram) => void;
  deleteWorkProgram: (id: string) => void;

  officialDocuments: OfficialDocument[];
  addOfficialDocument: (doc: Omit<OfficialDocument, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOfficialDocument: (doc: OfficialDocument) => void;
  deleteOfficialDocument: (id: string) => void;

  digitalArchives: DigitalArchiveItem[];
  addDigitalArchive: (item: Omit<DigitalArchiveItem, 'id' | 'createdAt'>) => void;
  updateDigitalArchive: (item: DigitalArchiveItem) => void;
  deleteDigitalArchive: (id: string) => void;

  supervisions: SupervisionRecord[];
  addSupervision: (record: Omit<SupervisionRecord, 'id'>) => void;
  updateSupervision: (record: SupervisionRecord) => void;
  deleteSupervision: (id: string) => void;

  assessments: AssessmentPlan[];
  addAssessment: (plan: Omit<AssessmentPlan, 'id'>) => void;
  updateAssessment: (plan: AssessmentPlan) => void;
  deleteAssessment: (id: string) => void;

  teacherDev: TeacherDevActivity[];
  addTeacherDev: (act: Omit<TeacherDevActivity, 'id'>) => void;
  updateTeacherDev: (act: TeacherDevActivity) => void;
  deleteTeacherDev: (id: string) => void;

  monev: MonevRecord[];
  addMonev: (mon: Omit<MonevRecord, 'id'>) => void;
  updateMonev: (mon: MonevRecord) => void;
  deleteMonev: (id: string) => void;

  auditLogs: AuditLog[];
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;

  activeMenu: string;
  setActiveMenu: (menu: string) => void;

  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  exportBackupJson: () => void;
  importBackupJson: (content: string) => boolean;
  resetAllData: () => void;

  storageStats: {
    mode: string;
    isCloudReady: boolean;
    totalRecords: number;
    approxSizeKb: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => StorageService.getSchoolProfile());
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(() => StorageService.getAcademicYears());
  const [users, setUsers] = useState<User[]>(() => StorageService.getUsers());
  const [currentUserId, setCurrentUserId] = useState<string>(() => StorageService.getActiveUserId());

  const [teachers, setTeachers] = useState<Teacher[]>(() => StorageService.getTeachers());
  const [subjects, setSubjects] = useState<Subject[]>(() => StorageService.getSubjects());
  const [classes, setClasses] = useState<ClassRomBel[]>(() => StorageService.getClasses());
  const [teachingAssignments, setTeachingAssignments] = useState<TeachingAssignment[]>(() => StorageService.getTeachingAssignments());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => StorageService.getCalendarEvents());
  const [workPrograms, setWorkPrograms] = useState<WorkProgram[]>(() => StorageService.getWorkPrograms());
  const [officialDocuments, setOfficialDocuments] = useState<OfficialDocument[]>(() => StorageService.getOfficialDocuments());
  const [digitalArchives, setDigitalArchives] = useState<DigitalArchiveItem[]>(() => StorageService.getDigitalArchives());
  const [supervisions, setSupervisions] = useState<SupervisionRecord[]>(() => StorageService.getSupervisions());
  const [assessments, setAssessments] = useState<AssessmentPlan[]>(() => StorageService.getAssessments());
  const [teacherDev, setTeacherDev] = useState<TeacherDevActivity[]>(() => StorageService.getTeacherDev());
  const [monev, setMonev] = useState<MonevRecord[]>(() => StorageService.getMonev());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => StorageService.getAuditLogs());

  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Tahun Pelajaran 2026/2027 Aktif',
      message: 'Semester Ganjil telah ditetapkan sebagai periode kurikulum aktif.',
      timestamp: 'Baru saja',
      type: 'info',
      isRead: false,
      linkMenu: 'academic_year'
    },
    {
      id: 'notif-2',
      title: 'Draf KSP Memerlukan Review',
      message: 'Dokumen KSP SMAN 1 Kakas tahap analisis konteks telah siap diverifikasi dewan guru.',
      timestamp: '1 jam lalu',
      type: 'warning',
      isRead: false,
      linkMenu: 'curriculum_ksp'
    },
    {
      id: 'notif-3',
      title: 'Jadwal Supervisi Akademik',
      message: 'Supervisi Dra. Selvie Rorong telah terlaksana dengan catatan observasi lengkap.',
      timestamp: '1 hari lalu',
      type: 'success',
      isRead: true,
      linkMenu: 'supervision'
    }
  ]);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const activeAcademicYear = academicYears.find(ay => ay.isActive) || academicYears[0];

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const logAction = (action: string, entity: string, details: string) => {
    StorageService.addAuditLog(currentUser.name, currentUser.roleTitle, action, entity, details);
    setAuditLogs(StorageService.getAuditLogs());
  };

  // Profile
  const updateSchoolProfile = (profile: SchoolProfile) => {
    setSchoolProfile(profile);
    StorageService.saveSchoolProfile(profile);
    logAction('Pembaruan Profil', 'Profil Sekolah', `Memperbarui profil ${profile.name}`);
    showToast('Profil sekolah berhasil disimpan.', 'success');
  };

  // Academic Year
  const setActiveAcademicYear = (yearId: string) => {
    const updated = academicYears.map(ay => ({
      ...ay,
      isActive: ay.id === yearId
    }));
    setAcademicYears(updated);
    StorageService.saveAcademicYears(updated);
    const target = updated.find(y => y.id === yearId);
    logAction('Perubahan Tahun Pelajaran', 'Tahun Pelajaran', `Mengaktifkan tahun ajaran ${target?.year}`);
    showToast(`Tahun pelajaran aktif diubah ke ${target?.year}`, 'success');
  };

  const setActiveSemester = (semester: 'Ganjil' | 'Genap') => {
    const updated = academicYears.map(ay => {
      if (ay.isActive) {
        return { ...ay, activeSemester: semester };
      }
      return ay;
    });
    setAcademicYears(updated);
    StorageService.saveAcademicYears(updated);
    logAction('Perubahan Semester', 'Semester', `Mengaktifkan Semester ${semester}`);
    showToast(`Semester aktif diubah ke ${semester}`, 'success');
  };

  const setCurrentUser = (userId: string) => {
    setCurrentUserId(userId);
    StorageService.saveActiveUserId(userId);
    const target = users.find(u => u.id === userId);
    if (target) {
      showToast(`Beralih peran sebagai ${target.name} (${target.roleTitle})`, 'info');
    }
  };

  // Teachers
  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = { ...teacher, id: 'tch-' + Date.now() };
    const updated = [newTeacher, ...teachers];
    setTeachers(updated);
    StorageService.saveTeachers(updated);
    logAction('Penambahan Guru', 'Data Guru', `Menambahkan guru ${newTeacher.name}`);
    showToast(`Guru ${newTeacher.name} berhasil ditambahkan.`, 'success');
  };

  const updateTeacher = (teacher: Teacher) => {
    const updated = teachers.map(t => t.id === teacher.id ? teacher : t);
    setTeachers(updated);
    StorageService.saveTeachers(updated);
    logAction('Pengeditan Guru', 'Data Guru', `Memperbarui data guru ${teacher.name}`);
    showToast(`Data ${teacher.name} berhasil diperbarui.`, 'success');
  };

  const deleteTeacher = (id: string) => {
    const target = teachers.find(t => t.id === id);
    const updated = teachers.filter(t => t.id !== id);
    setTeachers(updated);
    StorageService.saveTeachers(updated);
    logAction('Penghapusan Guru', 'Data Guru', `Menghapus guru ${target?.name}`);
    showToast(`Guru ${target?.name} berhasil dihapus.`, 'info');
  };

  // Subjects
  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject: Subject = { ...subject, id: 'sbj-' + Date.now() };
    const updated = [...subjects, newSubject];
    setSubjects(updated);
    StorageService.saveSubjects(updated);
    logAction('Penambahan Mapel', 'Mata Pelajaran', `Menambahkan mapel ${newSubject.name}`);
    showToast(`Mata pelajaran ${newSubject.name} berhasil ditambahkan.`, 'success');
  };

  const updateSubject = (subject: Subject) => {
    const updated = subjects.map(s => s.id === subject.id ? subject : s);
    setSubjects(updated);
    StorageService.saveSubjects(updated);
    logAction('Pengeditan Mapel', 'Mata Pelajaran', `Memperbarui mapel ${subject.name}`);
    showToast(`Mapel ${subject.name} diperbarui.`, 'success');
  };

  const deleteSubject = (id: string) => {
    const target = subjects.find(s => s.id === id);
    const updated = subjects.filter(s => s.id !== id);
    setSubjects(updated);
    StorageService.saveSubjects(updated);
    logAction('Penghapusan Mapel', 'Mata Pelajaran', `Menghapus mapel ${target?.name}`);
    showToast(`Mapel ${target?.name} dihapus.`, 'info');
  };

  // Classes
  const addClass = (cls: Omit<ClassRomBel, 'id'>) => {
    const newClass: ClassRomBel = { ...cls, id: 'cls-' + Date.now() };
    const updated = [...classes, newClass];
    setClasses(updated);
    StorageService.saveClasses(updated);
    logAction('Penambahan Rombel', 'Rombongan Belajar', `Menambahkan rombel ${newClass.name}`);
    showToast(`Rombel ${newClass.name} berhasil ditambahkan.`, 'success');
  };

  const updateClass = (cls: ClassRomBel) => {
    const updated = classes.map(c => c.id === cls.id ? cls : c);
    setClasses(updated);
    StorageService.saveClasses(updated);
    logAction('Pengeditan Rombel', 'Rombongan Belajar', `Memperbarui rombel ${cls.name}`);
    showToast(`Rombel ${cls.name} diperbarui.`, 'success');
  };

  const deleteClass = (id: string) => {
    const target = classes.find(c => c.id === id);
    const updated = classes.filter(c => c.id !== id);
    setClasses(updated);
    StorageService.saveClasses(updated);
    logAction('Penghapusan Rombel', 'Rombongan Belajar', `Menghapus rombel ${target?.name}`);
    showToast(`Rombel ${target?.name} dihapus.`, 'info');
  };

  // Teaching Assignments
  const addTeachingAssignment = (assignment: Omit<TeachingAssignment, 'id'>) => {
    const newAss: TeachingAssignment = { ...assignment, id: 'ta-' + Date.now() };
    const updated = [newAss, ...teachingAssignments];
    setTeachingAssignments(updated);
    StorageService.saveTeachingAssignments(updated);
    logAction('Penugasan Mengajar', 'Beban Kerja', `Menugaskan ${newAss.teacherName} pada ${newAss.subjectName} (${newAss.classRomBelName})`);
    showToast(`Penugasan mengajar berhasil ditambahkan.`, 'success');
  };

  const updateTeachingAssignment = (assignment: TeachingAssignment) => {
    const updated = teachingAssignments.map(a => a.id === assignment.id ? assignment : a);
    setTeachingAssignments(updated);
    StorageService.saveTeachingAssignments(updated);
    logAction('Pengeditan Tugas Mengajar', 'Beban Kerja', `Memperbarui penugasan ${assignment.teacherName}`);
    showToast('Tugas mengajar diperbarui.', 'success');
  };

  const deleteTeachingAssignment = (id: string) => {
    const updated = teachingAssignments.filter(a => a.id !== id);
    setTeachingAssignments(updated);
    StorageService.saveTeachingAssignments(updated);
    logAction('Penghapusan Tugas Mengajar', 'Beban Kerja', 'Menghapus penugasan mengajar');
    showToast('Penugasan mengajar dihapus.', 'info');
  };

  // Calendar
  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEv: CalendarEvent = { ...event, id: 'cal-' + Date.now() };
    const updated = [newEv, ...calendarEvents];
    setCalendarEvents(updated);
    StorageService.saveCalendarEvents(updated);
    logAction('Penambahan Agenda', 'Kalender Pendidikan', `Menambahkan agenda ${newEv.title}`);
    showToast('Agenda kalender berhasil ditambahkan.', 'success');
  };

  const updateCalendarEvent = (event: CalendarEvent) => {
    const updated = calendarEvents.map(e => e.id === event.id ? event : e);
    setCalendarEvents(updated);
    StorageService.saveCalendarEvents(updated);
    logAction('Pengeditan Agenda', 'Kalender Pendidikan', `Memperbarui agenda ${event.title}`);
    showToast('Agenda kalender diperbarui.', 'success');
  };

  const deleteCalendarEvent = (id: string) => {
    const updated = calendarEvents.filter(e => e.id !== id);
    setCalendarEvents(updated);
    StorageService.saveCalendarEvents(updated);
    logAction('Penghapusan Agenda', 'Kalender Pendidikan', 'Menghapus agenda kalender');
    showToast('Agenda kalender dihapus.', 'info');
  };

  // Work Programs
  const addWorkProgram = (prog: Omit<WorkProgram, 'id'>) => {
    const newP: WorkProgram = { ...prog, id: 'wp-' + Date.now() };
    const updated = [newP, ...workPrograms];
    setWorkPrograms(updated);
    StorageService.saveWorkPrograms(updated);
    logAction('Penambahan Program Kerja', 'Program Kerja Kurikulum', `Menambahkan program ${newP.activityName}`);
    showToast('Program kerja berhasil ditambahkan.', 'success');
  };

  const updateWorkProgram = (prog: WorkProgram) => {
    const updated = workPrograms.map(p => p.id === prog.id ? prog : p);
    setWorkPrograms(updated);
    StorageService.saveWorkPrograms(updated);
    logAction('Pengeditan Program Kerja', 'Program Kerja Kurikulum', `Memperbarui program ${prog.activityName}`);
    showToast('Program kerja diperbarui.', 'success');
  };

  const deleteWorkProgram = (id: string) => {
    const updated = workPrograms.filter(p => p.id !== id);
    setWorkPrograms(updated);
    StorageService.saveWorkPrograms(updated);
    logAction('Penghapusan Program Kerja', 'Program Kerja Kurikulum', 'Menghapus butir program kerja');
    showToast('Program kerja dihapus.', 'info');
  };

  // Official Documents
  const addOfficialDocument = (doc: Omit<OfficialDocument, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newDoc: OfficialDocument = {
      ...doc,
      id: 'doc-' + Date.now(),
      createdAt: now,
      updatedAt: now
    };
    const updated = [newDoc, ...officialDocuments];
    setOfficialDocuments(updated);
    StorageService.saveOfficialDocuments(updated);
    logAction('Penerbitan Dokumen Resmi', 'Dokumen Resmi', `Membuat dokumen ${newDoc.title} (${newDoc.documentNumber})`);
    showToast('Dokumen resmi berhasil disimpan ke arsip.', 'success');
  };

  const updateOfficialDocument = (doc: OfficialDocument) => {
    const updated = officialDocuments.map(d => d.id === doc.id ? { ...doc, updatedAt: new Date().toISOString(), version: doc.version + 1 } : d);
    setOfficialDocuments(updated);
    StorageService.saveOfficialDocuments(updated);
    logAction('Revisi Dokumen Resmi', 'Dokumen Resmi', `Memperbarui dokumen ${doc.title} ke versi ${doc.version + 1}`);
    showToast('Dokumen resmi berhasil diperbarui.', 'success');
  };

  const deleteOfficialDocument = (id: string) => {
    const updated = officialDocuments.filter(d => d.id !== id);
    setOfficialDocuments(updated);
    StorageService.saveOfficialDocuments(updated);
    logAction('Penghapusan Dokumen', 'Dokumen Resmi', 'Menghapus dokumen resmi dari daftar');
    showToast('Dokumen dihapus.', 'info');
  };

  // Digital Archives
  const addDigitalArchive = (item: Omit<DigitalArchiveItem, 'id' | 'createdAt'>) => {
    const newItem: DigitalArchiveItem = {
      ...item,
      id: 'arc-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newItem, ...digitalArchives];
    setDigitalArchives(updated);
    StorageService.saveDigitalArchives(updated);
    logAction('Pengarsipan Dokumen', 'Arsip Digital', `Menambahkan arsip ${newItem.title}`);
    showToast('Dokumen berhasil diarsipkan.', 'success');
  };

  const updateDigitalArchive = (item: DigitalArchiveItem) => {
    const updated = digitalArchives.map(a => a.id === item.id ? item : a);
    setDigitalArchives(updated);
    StorageService.saveDigitalArchives(updated);
    logAction('Pengeditan Arsip', 'Arsip Digital', `Memperbarui arsip ${item.title}`);
    showToast('Data arsip diperbarui.', 'success');
  };

  const deleteDigitalArchive = (id: string) => {
    const updated = digitalArchives.filter(a => a.id !== id);
    setDigitalArchives(updated);
    StorageService.saveDigitalArchives(updated);
    logAction('Penghapusan Arsip', 'Arsip Digital', 'Menghapus dokumen arsip');
    showToast('Dokumen arsip dihapus.', 'info');
  };

  // Supervisions
  const addSupervision = (record: Omit<SupervisionRecord, 'id'>) => {
    const newR: SupervisionRecord = { ...record, id: 'sup-' + Date.now() };
    const updated = [newR, ...supervisions];
    setSupervisions(updated);
    StorageService.saveSupervisions(updated);
    logAction('Jadwal Supervisi Baru', 'Supervisi Akademik', `Menjadwalkan supervisi untuk ${newR.teacherName}`);
    showToast('Jadwal supervisi berhasil dicatat.', 'success');
  };

  const updateSupervision = (record: SupervisionRecord) => {
    const updated = supervisions.map(s => s.id === record.id ? record : s);
    setSupervisions(updated);
    StorageService.saveSupervisions(updated);
    logAction('Pembaruan Catatan Supervisi', 'Supervisi Akademik', `Memperbarui supervisi ${record.teacherName}`);
    showToast('Catatan supervisi disimpan.', 'success');
  };

  const deleteSupervision = (id: string) => {
    const updated = supervisions.filter(s => s.id !== id);
    setSupervisions(updated);
    StorageService.saveSupervisions(updated);
    logAction('Penghapusan Supervisi', 'Supervisi Akademik', 'Menghapus catatan supervisi');
    showToast('Catatan supervisi dihapus.', 'info');
  };

  // Assessments
  const addAssessment = (plan: Omit<AssessmentPlan, 'id'>) => {
    const newP: AssessmentPlan = { ...plan, id: 'asm-' + Date.now() };
    const updated = [newP, ...assessments];
    setAssessments(updated);
    StorageService.saveAssessments(updated);
    logAction('Penyusunan Asesmen Baru', 'Asesmen & Penilaian', `Menambahkan asesmen ${newP.title}`);
    showToast('Rencana asesmen disimpan.', 'success');
  };

  const updateAssessment = (plan: AssessmentPlan) => {
    const updated = assessments.map(a => a.id === plan.id ? plan : a);
    setAssessments(updated);
    StorageService.saveAssessments(updated);
    logAction('Pengeditan Asesmen', 'Asesmen & Penilaian', `Memperbarui asesmen ${plan.title}`);
    showToast('Rencana asesmen diperbarui.', 'success');
  };

  const deleteAssessment = (id: string) => {
    const updated = assessments.filter(a => a.id !== id);
    setAssessments(updated);
    StorageService.saveAssessments(updated);
    logAction('Penghapusan Asesmen', 'Asesmen & Penilaian', 'Menghapus rencana asesmen');
    showToast('Rencana asesmen dihapus.', 'info');
  };

  // Teacher Development
  const addTeacherDev = (act: Omit<TeacherDevActivity, 'id'>) => {
    const newA: TeacherDevActivity = { ...act, id: 'tdev-' + Date.now() };
    const updated = [newA, ...teacherDev];
    setTeacherDev(updated);
    StorageService.saveTeacherDev(updated);
    logAction('Kegiatan Pengembangan Guru', 'Pengembangan Guru', `Menambahkan kegiatan ${newA.title}`);
    showToast('Kegiatan pengembangan guru dicatat.', 'success');
  };

  const updateTeacherDev = (act: TeacherDevActivity) => {
    const updated = teacherDev.map(a => a.id === act.id ? act : a);
    setTeacherDev(updated);
    StorageService.saveTeacherDev(updated);
    logAction('Pengeditan Pengembangan Guru', 'Pengembangan Guru', `Memperbarui kegiatan ${act.title}`);
    showToast('Kegiatan diperbarui.', 'success');
  };

  const deleteTeacherDev = (id: string) => {
    const updated = teacherDev.filter(a => a.id !== id);
    setTeacherDev(updated);
    StorageService.saveTeacherDev(updated);
    logAction('Penghapusan Kegiatan', 'Pengembangan Guru', 'Menghapus kegiatan pengembangan guru');
    showToast('Kegiatan dihapus.', 'info');
  };

  // Monev
  const addMonev = (mon: Omit<MonevRecord, 'id'>) => {
    const newM: MonevRecord = { ...mon, id: 'mon-' + Date.now() };
    const updated = [newM, ...monev];
    setMonev(updated);
    StorageService.saveMonev(updated);
    logAction('Pencatatan Monev', 'Monev & IRB', `Menambahkan butir monev ${newM.indicator}`);
    showToast('Indikator monev berhasil ditambahkan.', 'success');
  };

  const updateMonev = (mon: MonevRecord) => {
    const updated = monev.map(m => m.id === mon.id ? mon : m);
    setMonev(updated);
    StorageService.saveMonev(updated);
    logAction('Pengeditan Monev', 'Monev & IRB', `Memperbarui indikator monev ${mon.indicator}`);
    showToast('Indikator monev diperbarui.', 'success');
  };

  const deleteMonev = (id: string) => {
    const updated = monev.filter(m => m.id !== id);
    setMonev(updated);
    StorageService.saveMonev(updated);
    logAction('Penghapusan Monev', 'Monev & IRB', 'Menghapus butir indikator monev');
    showToast('Indikator monev dihapus.', 'info');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Backup & Restore
  const exportBackupJson = () => {
    const dataString = StorageService.exportAllData();
    const blob = new Blob([dataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CADANGAN-KuSaKA-SMAN1-KAKAS-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    logAction('Ekspor Cadangan', 'Sistem & Basis Data', 'Mengunduh salinan berkas cadangan JSON lengkap.');
    showToast('Berkas cadangan basis data berhasil diunduh.', 'success');
  };

  const importBackupJson = (content: string): boolean => {
    const success = StorageService.importAllData(content);
    if (success) {
      setSchoolProfile(StorageService.getSchoolProfile());
      setAcademicYears(StorageService.getAcademicYears());
      setTeachers(StorageService.getTeachers());
      setSubjects(StorageService.getSubjects());
      setClasses(StorageService.getClasses());
      setTeachingAssignments(StorageService.getTeachingAssignments());
      setCalendarEvents(StorageService.getCalendarEvents());
      setWorkPrograms(StorageService.getWorkPrograms());
      setOfficialDocuments(StorageService.getOfficialDocuments());
      setDigitalArchives(StorageService.getDigitalArchives());
      setSupervisions(StorageService.getSupervisions());
      setAssessments(StorageService.getAssessments());
      setTeacherDev(StorageService.getTeacherDev());
      setMonev(StorageService.getMonev());
      setAuditLogs(StorageService.getAuditLogs());
      showToast('Cadangan data berhasil dipulihkan ke sistem.', 'success');
      return true;
    } else {
      showToast('Gagal memulihkan cadangan. Pastikan format JSON sesuai.', 'error');
      return false;
    }
  };

  const resetAllData = () => {
    StorageService.resetToInitialData();
    setSchoolProfile(StorageService.getSchoolProfile());
    setAcademicYears(StorageService.getAcademicYears());
    setTeachers(StorageService.getTeachers());
    setSubjects(StorageService.getSubjects());
    setClasses(StorageService.getClasses());
    setTeachingAssignments(StorageService.getTeachingAssignments());
    setCalendarEvents(StorageService.getCalendarEvents());
    setWorkPrograms(StorageService.getWorkPrograms());
    setOfficialDocuments(StorageService.getOfficialDocuments());
    setDigitalArchives(StorageService.getDigitalArchives());
    setSupervisions(StorageService.getSupervisions());
    setAssessments(StorageService.getAssessments());
    setTeacherDev(StorageService.getTeacherDev());
    setMonev(StorageService.getMonev());
    logAction('Reset Sistem', 'Basis Data', 'Mengembalikan seluruh data ke kondisi awal resmi SMAN 1 Kakas.');
    showToast('Data sistem telah dikembalikan ke kondisi awal resmi.', 'info');
  };

  // Stats
  const totalRecords = 
    teachers.length + 
    subjects.length + 
    classes.length + 
    teachingAssignments.length + 
    calendarEvents.length + 
    workPrograms.length + 
    officialDocuments.length + 
    digitalArchives.length + 
    supervisions.length + 
    assessments.length + 
    teacherDev.length + 
    monev.length;

  const approxSizeKb = Math.round((JSON.stringify({
    teachers, subjects, classes, teachingAssignments, calendarEvents, workPrograms, officialDocuments, digitalArchives, supervisions, assessments, teacherDev, monev
  }).length * 2) / 1024);

  const storageStats = {
    mode: 'Mode Lokal Persisten (Peramban)',
    isCloudReady: true,
    totalRecords,
    approxSizeKb
  };

  return (
    <AppContext.Provider
      value={{
        schoolProfile,
        updateSchoolProfile,
        academicYears,
        activeAcademicYear,
        setActiveAcademicYear,
        setActiveSemester,
        users,
        currentUser,
        setCurrentUser,
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
        teachingAssignments,
        addTeachingAssignment,
        updateTeachingAssignment,
        deleteTeachingAssignment,
        calendarEvents,
        addCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,
        workPrograms,
        addWorkProgram,
        updateWorkProgram,
        deleteWorkProgram,
        officialDocuments,
        addOfficialDocument,
        updateOfficialDocument,
        deleteOfficialDocument,
        digitalArchives,
        addDigitalArchive,
        updateDigitalArchive,
        deleteDigitalArchive,
        supervisions,
        addSupervision,
        updateSupervision,
        deleteSupervision,
        assessments,
        addAssessment,
        updateAssessment,
        deleteAssessment,
        teacherDev,
        addTeacherDev,
        updateTeacherDev,
        deleteTeacherDev,
        monev,
        addMonev,
        updateMonev,
        deleteMonev,
        auditLogs,
        notifications,
        markNotificationRead,
        activeMenu,
        setActiveMenu,
        toasts,
        showToast,
        removeToast,
        exportBackupJson,
        importBackupJson,
        resetAllData,
        storageStats
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
