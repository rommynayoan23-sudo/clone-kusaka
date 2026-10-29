// KuSaKA Storage & Persistence Service
import {
  SchoolProfile,
  AcademicYear,
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
  User,
  ScheduleItem
} from '../types';

import {
  INITIAL_SCHOOL_PROFILE,
  INITIAL_ACADEMIC_YEARS,
  INITIAL_USERS,
  INITIAL_TEACHERS,
  INITIAL_SUBJECTS,
  INITIAL_CLASSES,
  INITIAL_TEACHING_ASSIGNMENTS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_WORK_PROGRAMS,
  INITIAL_OFFICIAL_DOCUMENTS,
  INITIAL_DIGITAL_ARCHIVES,
  INITIAL_SUPERVISIONS,
  INITIAL_ASSESSMENTS,
  INITIAL_TEACHER_DEV,
  INITIAL_MONEV
} from '../data/initialData';

const STORAGE_KEYS = {
  SCHOOL_PROFILE: 'kusaka_school_profile',
  ACADEMIC_YEARS: 'kusaka_academic_years',
  USERS: 'kusaka_users',
  ACTIVE_USER_ID: 'kusaka_active_user_id',
  TEACHERS: 'kusaka_teachers',
  SUBJECTS: 'kusaka_subjects',
  CLASSES: 'kusaka_classes',
  TEACHING_ASSIGNMENTS: 'kusaka_teaching_assignments',
  SCHEDULE_ITEMS: 'kusaka_schedule_items',
  CALENDAR_EVENTS: 'kusaka_calendar_events',
  WORK_PROGRAMS: 'kusaka_work_programs',
  OFFICIAL_DOCUMENTS: 'kusaka_official_documents',
  DIGITAL_ARCHIVES: 'kusaka_digital_archives',
  SUPERVISIONS: 'kusaka_supervisions',
  ASSESSMENTS: 'kusaka_assessments',
  TEACHER_DEV: 'kusaka_teacher_dev',
  MONEV: 'kusaka_monev',
  AUDIT_LOGS: 'kusaka_audit_logs',
};

function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Gagal membaca ${key} dari penyimpanan:`, error);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Gagal menyimpan ${key} ke penyimpanan:`, error);
  }
}

export const StorageService = {
  getSchoolProfile(): SchoolProfile {
    return safeGet<SchoolProfile>(STORAGE_KEYS.SCHOOL_PROFILE, INITIAL_SCHOOL_PROFILE);
  },
  saveSchoolProfile(profile: SchoolProfile): void {
    safeSet(STORAGE_KEYS.SCHOOL_PROFILE, profile);
  },

  getAcademicYears(): AcademicYear[] {
    return safeGet<AcademicYear[]>(STORAGE_KEYS.ACADEMIC_YEARS, INITIAL_ACADEMIC_YEARS);
  },
  saveAcademicYears(years: AcademicYear[]): void {
    safeSet(STORAGE_KEYS.ACADEMIC_YEARS, years);
  },

  getUsers(): User[] {
    return safeGet<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },
  saveUsers(users: User[]): void {
    safeSet(STORAGE_KEYS.USERS, users);
  },

  getActiveUserId(): string {
    return safeGet<string>(STORAGE_KEYS.ACTIVE_USER_ID, 'user-waka');
  },
  saveActiveUserId(id: string): void {
    safeSet(STORAGE_KEYS.ACTIVE_USER_ID, id);
  },

  getTeachers(): Teacher[] {
    return safeGet<Teacher[]>(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);
  },
  saveTeachers(teachers: Teacher[]): void {
    safeSet(STORAGE_KEYS.TEACHERS, teachers);
  },

  getSubjects(): Subject[] {
    return safeGet<Subject[]>(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
  },
  saveSubjects(subjects: Subject[]): void {
    safeSet(STORAGE_KEYS.SUBJECTS, subjects);
  },

  getClasses(): ClassRomBel[] {
    return safeGet<ClassRomBel[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
  },
  saveClasses(classes: ClassRomBel[]): void {
    safeSet(STORAGE_KEYS.CLASSES, classes);
  },

  getTeachingAssignments(): TeachingAssignment[] {
    return safeGet<TeachingAssignment[]>(STORAGE_KEYS.TEACHING_ASSIGNMENTS, INITIAL_TEACHING_ASSIGNMENTS);
  },
  saveTeachingAssignments(assignments: TeachingAssignment[]): void {
    safeSet(STORAGE_KEYS.TEACHING_ASSIGNMENTS, assignments);
  },

  getScheduleItems(): ScheduleItem[] {
    return safeGet<ScheduleItem[]>(STORAGE_KEYS.SCHEDULE_ITEMS, []);
  },
  saveScheduleItems(items: ScheduleItem[]): void {
    safeSet(STORAGE_KEYS.SCHEDULE_ITEMS, items);
  },

  getCalendarEvents(): CalendarEvent[] {
    return safeGet<CalendarEvent[]>(STORAGE_KEYS.CALENDAR_EVENTS, INITIAL_CALENDAR_EVENTS);
  },
  saveCalendarEvents(events: CalendarEvent[]): void {
    safeSet(STORAGE_KEYS.CALENDAR_EVENTS, events);
  },

  getWorkPrograms(): WorkProgram[] {
    return safeGet<WorkProgram[]>(STORAGE_KEYS.WORK_PROGRAMS, INITIAL_WORK_PROGRAMS);
  },
  saveWorkPrograms(programs: WorkProgram[]): void {
    safeSet(STORAGE_KEYS.WORK_PROGRAMS, programs);
  },

  getOfficialDocuments(): OfficialDocument[] {
    return safeGet<OfficialDocument[]>(STORAGE_KEYS.OFFICIAL_DOCUMENTS, INITIAL_OFFICIAL_DOCUMENTS);
  },
  saveOfficialDocuments(documents: OfficialDocument[]): void {
    safeSet(STORAGE_KEYS.OFFICIAL_DOCUMENTS, documents);
  },

  getDigitalArchives(): DigitalArchiveItem[] {
    return safeGet<DigitalArchiveItem[]>(STORAGE_KEYS.DIGITAL_ARCHIVES, INITIAL_DIGITAL_ARCHIVES);
  },
  saveDigitalArchives(archives: DigitalArchiveItem[]): void {
    safeSet(STORAGE_KEYS.DIGITAL_ARCHIVES, archives);
  },

  getSupervisions(): SupervisionRecord[] {
    return safeGet<SupervisionRecord[]>(STORAGE_KEYS.SUPERVISIONS, INITIAL_SUPERVISIONS);
  },
  saveSupervisions(supervisions: SupervisionRecord[]): void {
    safeSet(STORAGE_KEYS.SUPERVISIONS, supervisions);
  },

  getAssessments(): AssessmentPlan[] {
    return safeGet<AssessmentPlan[]>(STORAGE_KEYS.ASSESSMENTS, INITIAL_ASSESSMENTS);
  },
  saveAssessments(assessments: AssessmentPlan[]): void {
    safeSet(STORAGE_KEYS.ASSESSMENTS, assessments);
  },

  getTeacherDev(): TeacherDevActivity[] {
    return safeGet<TeacherDevActivity[]>(STORAGE_KEYS.TEACHER_DEV, INITIAL_TEACHER_DEV);
  },
  saveTeacherDev(activities: TeacherDevActivity[]): void {
    safeSet(STORAGE_KEYS.TEACHER_DEV, activities);
  },

  getMonev(): MonevRecord[] {
    return safeGet<MonevRecord[]>(STORAGE_KEYS.MONEV, INITIAL_MONEV);
  },
  saveMonev(records: MonevRecord[]): void {
    safeSet(STORAGE_KEYS.MONEV, records);
  },

  getAuditLogs(): AuditLog[] {
    return safeGet<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, [
      {
        id: 'log-01',
        timestamp: new Date().toISOString(),
        userName: 'Rommy Senfrie Najoan, S.Pd.',
        userRole: 'Wakasek Kurikulum',
        action: 'Inisialisasi Sistem',
        targetEntity: 'Aplikasi KuSaKA',
        details: 'Sistem KuSaKA versi 1.0 berhasil dimuat dengan data resmi SMA Negeri 1 Kakas.'
      }
    ]);
  },
  addAuditLog(userName: string, userRole: string, action: string, targetEntity: string, details: string): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      userName,
      userRole,
      action,
      targetEntity,
      details
    };
    safeSet(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs.slice(0, 99)]); // Keep last 100 logs
  },

  // Export full JSON Backup
  exportAllData(): string {
    const fullBackup = {
      appName: 'KuSaKA',
      school: 'SMA Negeri 1 Kakas',
      exportedAt: new Date().toISOString(),
      version: '1.0-tahap1',
      data: {
        schoolProfile: this.getSchoolProfile(),
        academicYears: this.getAcademicYears(),
        users: this.getUsers(),
        teachers: this.getTeachers(),
        subjects: this.getSubjects(),
        classes: this.getClasses(),
        teachingAssignments: this.getTeachingAssignments(),
        scheduleItems: this.getScheduleItems(),
        calendarEvents: this.getCalendarEvents(),
        workPrograms: this.getWorkPrograms(),
        officialDocuments: this.getOfficialDocuments(),
        digitalArchives: this.getDigitalArchives(),
        supervisions: this.getSupervisions(),
        assessments: this.getAssessments(),
        teacherDev: this.getTeacherDev(),
        monev: this.getMonev(),
        auditLogs: this.getAuditLogs()
      }
    };
    return JSON.stringify(fullBackup, null, 2);
  },

  // Import JSON Backup
  importAllData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.data) throw new Error('Format berkas cadangan tidak valid.');
      const d = parsed.data;
      if (d.schoolProfile) this.saveSchoolProfile(d.schoolProfile);
      if (d.academicYears) this.saveAcademicYears(d.academicYears);
      if (d.teachers) this.saveTeachers(d.teachers);
      if (d.subjects) this.saveSubjects(d.subjects);
      if (d.classes) this.saveClasses(d.classes);
      if (d.teachingAssignments) this.saveTeachingAssignments(d.teachingAssignments);
      if (d.scheduleItems) this.saveScheduleItems(d.scheduleItems);
      if (d.calendarEvents) this.saveCalendarEvents(d.calendarEvents);
      if (d.workPrograms) this.saveWorkPrograms(d.workPrograms);
      if (d.officialDocuments) this.saveOfficialDocuments(d.officialDocuments);
      if (d.digitalArchives) this.saveDigitalArchives(d.digitalArchives);
      if (d.supervisions) this.saveSupervisions(d.supervisions);
      if (d.assessments) this.saveAssessments(d.assessments);
      if (d.teacherDev) this.saveTeacherDev(d.teacherDev);
      if (d.monev) this.saveMonev(d.monev);
      this.addAuditLog('Sistem', 'Admin', 'Pemulihan Cadangan', 'Basis Data', 'Berhasil memulihkan cadangan data.');
      return true;
    } catch (err) {
      console.error('Pemulihan gagal:', err);
      return false;
    }
  },

  // Reset to default seed data
  resetToInitialData(): void {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  }
};
