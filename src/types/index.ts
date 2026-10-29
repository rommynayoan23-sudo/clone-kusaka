// KuSaKA - Kurikulum Satu Pintu SMA Negeri 1 Kakas
// Type Definitions for Entire Curriculum Management System

export type UserRole = 
  | 'admin'
  | 'principal'        // Kepala Sekolah (Moreine Elmaja Pangalila)
  | 'vice_curriculum'  // Wakasek Kurikulum (Rommy Senfrie Najoan, S.Pd.)
  | 'curriculum_staff' // Staf Kurikulum
  | 'teacher'          // Guru Mata Pelajaran
  | 'read_only';       // Peninjau / Pengawas

export interface User {
  id: string;
  name: string;
  email: string;
  nip?: string;
  role: UserRole;
  roleTitle: string;
  avatarUrl?: string;
  phone?: string;
}

export type DocumentStatus = 
  | 'draft'               // Draf
  | 'in_review'           // Dalam pemeriksaan
  | 'revision_needed'     // Perlu revisi
  | 'waiting_approval'    // Menunggu persetujuan
  | 'approved'            // Disetujui
  | 'established'         // Ditetapkan atau diterbitkan
  | 'archived';           // Diarsipkan

export type Phase = 'E' | 'F';

export interface SchoolProfile {
  name: string;              // SMA Negeri 1 Kakas
  appName: string;          // KuSaKA
  appFullName: string;      // Kurikulum Satu Pintu SMA Negeri 1 Kakas
  npsn: string;              // 40100895
  subdistrict: string;       // Kakas
  regency: string;           // Minahasa
  province: string;          // Sulawesi Utara
  address: string;           // Jl. Raya Kakas - Remboken, Kakas
  postalCode: string;        // 95684
  phone: string;             // (0431) 321xxx
  email: string;             // sman1kakas@yahoo.com
  website: string;           // sman1kakas.sch.id
  principalName: string;     // Moreine Elmaja Pangalila
  principalNip: string;      // 1968xxxxxxxxxxxxxx
  principalRank: string;     // Pembina Tk. I / IV b
  viceCurriculumName: string;// Rommy Senfrie Najoan, S.Pd.
  viceCurriculumNip: string; // 1982xxxxxxxxxxxxxx
  viceCurriculumRank: string;// Penata Tk. I / III d
  accreditation: string;     // A (Unggul)
  curriculumType: string;    // Kurikulum Merdeka
  phases: Phase[];           // ['E', 'F']
  letterNumberPrefix: string;// 421/SMAN1-KKS/
  logoUrl?: string;
  dinasProvinsi: string;     // PEMERINTAH PROVINSI SULAWESI UTARA
  dinasPendidikan: string;   // DINAS PENDIDIKAN DAERAH
  cabangDinas: string;       // CABANG DINAS PENDIDIKAN WILAYAH TOMOHON - MINAHASA
}

export interface AcademicYear {
  id: string;
  year: string;              // e.g. "2026/2027"
  isActive: boolean;
  activeSemester: 'Ganjil' | 'Genap';
  startDateGanjil: string;
  endDateGanjil: string;
  startDateGenap: string;
  endDateGenap: string;
  effectiveWeeksGanjil: number;
  effectiveWeeksGenap: number;
}

export interface Teacher {
  id: string;
  nip: string;
  name: string;
  title: string;             // Gelar akademik
  gender: 'L' | 'P';
  rankAndGrade: string;      // Pangkat / Golongan (e.g. Pembina / IV.a)
  employmentStatus: 'PNS' | 'PPPK' | 'GTT' | 'Honor Sekolah';
  subjectsTaught: string[];  // Nama-nama mata pelajaran
  primarySubject: string;
  additionalTask?: string;   // misal: Wali Kelas X-1, Pembina OSIS, Kepala Lab
  totalHours: number;        // Total JJM per minggu
  phone: string;
  email: string;
  isCertified: boolean;      // Sertifikasi Pendidik
  availabilityNote?: string;
}

export interface Subject {
  id: string;
  code: string;              // misal: MAT-E, BIO-F
  name: string;              // Matematika, Biologi, dll
  category: 'Umum' | 'Pilihan' | 'Muatan Lokal' | 'P5';
  phase: Phase | 'E/F';
  weeklyHours: number;       // Jumlah jam pelajaran intrakurikuler per minggu
  kokurikulerHours: number;  // Jam P5 per minggu/tahun
  coordinatorName: string;
  description?: string;
}

export interface ClassRomBel {
  id: string;
  name: string;              // Kelas X-1, X-2, XI-1, XII-1 dll
  phase: Phase;
  gradeLevel: 'X' | 'XI' | 'XII';
  homeroomTeacherId: string; // ID Wali Kelas
  homeroomTeacherName: string;
  totalStudents: number;
  maleStudents: number;
  femaleStudents: number;
  roomName: string;
}

export interface TeachingAssignment {
  id: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  teacherId: string;
  teacherName: string;
  subjectId: string;
  subjectName: string;
  classRomBelId: string;
  classRomBelName: string;
  phase: Phase;
  hoursPerWeek: number;
  notes?: string;
}

export interface ScheduleItem {
  id: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';
  period: number;            // Jam ke- 1 s.d 10
  timeStart: string;         // e.g. "07:30"
  timeEnd: string;           // e.g. "08:15"
  isBreak?: boolean;
  classRomBelId?: string;
  classRomBelName?: string;
  teacherId?: string;
  teacherName?: string;
  subjectId?: string;
  subjectName?: string;
  roomName?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  category: 
    | 'kegiatan_belajar'
    | 'asesmen'
    | 'supervisi'
    | 'pengembangan_guru'
    | 'libur'
    | 'rapat'
    | 'kokurikuler';
  startDate: string;
  endDate: string;
  semester: 'Ganjil' | 'Genap';
  isOfficialVerified: boolean;
  description: string;
  color?: string;
}

export interface WorkProgram {
  id: string;
  activityName: string;
  background: string;
  legalBasis: string;
  objective: string;
  targetAudience: string;
  successIndicator: string;
  stages: string;
  schedulePeriod: string;
  personInCharge: string;     // Penanggung Jawab
  implementer: string;        // Pelaksana
  budgetResources?: string;
  physicalEvidence: string;   // Bukti Fisik
  target: string;
  realization: string;
  obstacles?: string;
  followUp?: string;
  status: 'Belum Mulai' | 'Sedang Berjalan' | 'Selesai' | 'Tertunda';
  semester: 'Ganjil' | 'Genap' | 'Tahunan';
}

export interface OfficialDocument {
  id: string;
  documentType: 
    | 'sk_kepala_sekolah'
    | 'surat_tugas'
    | 'surat_undangan'
    | 'berita_acara'
    | 'notulen_rapat'
    | 'daftar_hadir'
    | 'laporan_kegiatan';
  title: string;
  documentNumber: string;
  date: string;
  signatoryName: string;
  signatoryTitle: string;
  signatoryNip: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  status: DocumentStatus;
  version: number;
  content: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface DigitalArchiveItem {
  id: string;
  title: string;
  documentNumber?: string;
  category: 
    | 'KSP'
    | 'Program Kerja'
    | 'Kalender Pendidikan'
    | 'Pembagian Tugas Mengajar'
    | 'Jadwal Pelajaran'
    | 'Perangkat Pembelajaran'
    | 'Asesmen'
    | 'Supervisi Akademik'
    | 'Pengembangan Guru'
    | 'Monitoring dan Evaluasi'
    | 'Surat Keputusan'
    | 'Surat Tugas'
    | 'Laporan'
    | 'Dokumen Lainnya';
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  createdAt: string;
  creatorName: string;
  status: DocumentStatus;
  version: string;
  description: string;
  keywords: string[];
  fileSize?: string;
  fileFormat: 'DOCX' | 'PDF' | 'XLSX' | 'INTERN';
}

export interface SupervisionRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  subjectName: string;
  className: string;
  scheduledDate: string;
  completedDate?: string;
  supervisorName: string;
  status: 
    | 'belum_direncanakan'
    | 'terjadwal'
    | 'terlaksana'
    | 'menunggu_tindak_lanjut'
    | 'selesai';
  focusArea: string;
  observationNotes?: string;
  strengths?: string;
  growthAreas?: string;
  constructiveFeedback?: string;
  teacherReflection?: string;
  actionPlan?: string;
  score?: number; // Nilai observasi 0-100 jika dinilai
}

export interface AssessmentPlan {
  id: string;
  title: string;
  type: 'Sumatif Tengah Semester' | 'Sumatif Akhir Semester' | 'Sumatif Akhir Fase' | 'Asesmen Bakat Minat';
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  startDate: string;
  endDate: string;
  committeeDecreeNumber: string;
  totalRooms: number;
  totalParticipants: number;
  totalProctors: number;
  status: 'Perencanaan' | 'Persiapan' | 'Pelaksanaan' | 'Pengolahan Nilai' | 'Selesai';
}

export interface TeacherDevActivity {
  id: string;
  title: string;
  type: 'IHT' | 'Workshop' | 'Komunitas Belajar' | 'MGMP' | 'Pelatihan Mandiri' | 'Berbagi Praktik Baik';
  date: string;
  speaker: string;
  venue: string;
  participantsCount: number;
  summary: string;
  followUpPlan: string;
  status: 'Direncanakan' | 'Terlaksana' | 'Laporan Selesai';
}

export interface MonevRecord {
  id: string;
  indicator: string;
  target: string;
  achievement: string;
  evidence: string;
  gapAnalysis: string;
  rootCause: string;
  recommendation: string;
  personInCharge: string;
  deadline: string;
  followUpStatus: 'Belum Ditindaklanjuti' | 'Dalam Proses' | 'Selesai';
  cycleIRB: 'Identifikasi' | 'Refleksi' | 'Benahi';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  targetEntity: string;
  details: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  isRead: boolean;
  linkMenu?: string;
}
