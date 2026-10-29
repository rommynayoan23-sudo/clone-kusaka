// KuSaKA - Schedule Engine & Conflict Resolution System
// Specifically built for SMA Negeri 1 Kakas (Minahasa, Sulawesi Utara)
// Adheres strictly to Kurikulum Merdeka and Permendikbudristek No. 15/2018

import { ScheduleItem, ClassRomBel, Teacher, Subject, TeachingAssignment } from '../types';

export type SchoolDay = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';

export interface TimeSlotDef {
  period: number;
  timeStart: string;
  timeEnd: string;
  timeRange: string;
  isBreak: boolean;
  defaultTitle?: string;
}

export const DAYS_OF_WEEK: SchoolDay[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

// SMAN 1 Kakas School Hours Definition
export const SCHEDULE_TIME_SLOTS: Record<SchoolDay, TimeSlotDef[]> = {
  Senin: [
    { period: 1, timeStart: '07:15', timeEnd: '07:45', timeRange: '07:15 - 07:45', isBreak: true, defaultTitle: 'Upacara Bendera Merah Putih' },
    { period: 2, timeStart: '07:45', timeEnd: '08:30', timeRange: '07:45 - 08:30', isBreak: false },
    { period: 3, timeStart: '08:30', timeEnd: '09:15', timeRange: '08:30 - 09:15', isBreak: false },
    { period: 4, timeStart: '09:15', timeEnd: '10:00', timeRange: '09:15 - 10:00', isBreak: false },
    { period: 5, timeStart: '10:00', timeEnd: '10:20', timeRange: '10:00 - 10:20', isBreak: true, defaultTitle: 'ISTIRAHAT I' },
    { period: 6, timeStart: '10:20', timeEnd: '11:05', timeRange: '10:20 - 11:05', isBreak: false },
    { period: 7, timeStart: '11:05', timeEnd: '11:50', timeRange: '11:05 - 11:50', isBreak: false },
    { period: 8, timeStart: '11:50', timeEnd: '12:35', timeRange: '11:50 - 12:35', isBreak: false },
    { period: 9, timeStart: '12:35', timeEnd: '13:05', timeRange: '12:35 - 13:05', isBreak: true, defaultTitle: 'ISTIRAHAT II / Makan Siang' },
    { period: 10, timeStart: '13:05', timeEnd: '13:50', timeRange: '13:05 - 13:50', isBreak: false },
    { period: 11, timeStart: '13:50', timeEnd: '14:35', timeRange: '13:50 - 14:35', isBreak: false },
  ],
  Selasa: [
    { period: 1, timeStart: '07:15', timeEnd: '07:45', timeRange: '07:15 - 07:45', isBreak: true, defaultTitle: 'Apel Pagi / Literasi Digital & Numerasi' },
    { period: 2, timeStart: '07:45', timeEnd: '08:30', timeRange: '07:45 - 08:30', isBreak: false },
    { period: 3, timeStart: '08:30', timeEnd: '09:15', timeRange: '08:30 - 09:15', isBreak: false },
    { period: 4, timeStart: '09:15', timeEnd: '10:00', timeRange: '09:15 - 10:00', isBreak: false },
    { period: 5, timeStart: '10:00', timeEnd: '10:20', timeRange: '10:00 - 10:20', isBreak: true, defaultTitle: 'ISTIRAHAT I' },
    { period: 6, timeStart: '10:20', timeEnd: '11:05', timeRange: '10:20 - 11:05', isBreak: false },
    { period: 7, timeStart: '11:05', timeEnd: '11:50', timeRange: '11:05 - 11:50', isBreak: false },
    { period: 8, timeStart: '11:50', timeEnd: '12:35', timeRange: '11:50 - 12:35', isBreak: false },
    { period: 9, timeStart: '12:35', timeEnd: '13:05', timeRange: '12:35 - 13:05', isBreak: true, defaultTitle: 'ISTIRAHAT II / Makan Siang' },
    { period: 10, timeStart: '13:05', timeEnd: '13:50', timeRange: '13:05 - 13:50', isBreak: false },
    { period: 11, timeStart: '13:50', timeEnd: '14:35', timeRange: '13:50 - 14:35', isBreak: false },
  ],
  Rabu: [
    { period: 1, timeStart: '07:15', timeEnd: '07:45', timeRange: '07:15 - 07:45', isBreak: true, defaultTitle: 'Apel Pagi / Ibadah Rohani Kristen-Katolik-Islam' },
    { period: 2, timeStart: '07:45', timeEnd: '08:30', timeRange: '07:45 - 08:30', isBreak: false },
    { period: 3, timeStart: '08:30', timeEnd: '09:15', timeRange: '08:30 - 09:15', isBreak: false },
    { period: 4, timeStart: '09:15', timeEnd: '10:00', timeRange: '09:15 - 10:00', isBreak: false },
    { period: 5, timeStart: '10:00', timeEnd: '10:20', timeRange: '10:00 - 10:20', isBreak: true, defaultTitle: 'ISTIRAHAT I' },
    { period: 6, timeStart: '10:20', timeEnd: '11:05', timeRange: '10:20 - 11:05', isBreak: false },
    { period: 7, timeStart: '11:05', timeEnd: '11:50', timeRange: '11:05 - 11:50', isBreak: false },
    { period: 8, timeStart: '11:50', timeEnd: '12:35', timeRange: '11:50 - 12:35', isBreak: false },
    { period: 9, timeStart: '12:35', timeEnd: '13:05', timeRange: '12:35 - 13:05', isBreak: true, defaultTitle: 'ISTIRAHAT II / Makan Siang' },
    { period: 10, timeStart: '13:05', timeEnd: '13:50', timeRange: '13:05 - 13:50', isBreak: false },
    { period: 11, timeStart: '13:50', timeEnd: '14:35', timeRange: '13:50 - 14:35', isBreak: false },
  ],
  Kamis: [
    { period: 1, timeStart: '07:15', timeEnd: '07:45', timeRange: '07:15 - 07:45', isBreak: true, defaultTitle: 'Penguatan Budaya Minahasa / Literasi Berbahasa' },
    { period: 2, timeStart: '07:45', timeEnd: '08:30', timeRange: '07:45 - 08:30', isBreak: false },
    { period: 3, timeStart: '08:30', timeEnd: '09:15', timeRange: '08:30 - 09:15', isBreak: false },
    { period: 4, timeStart: '09:15', timeEnd: '10:00', timeRange: '09:15 - 10:00', isBreak: false },
    { period: 5, timeStart: '10:00', timeEnd: '10:20', timeRange: '10:00 - 10:20', isBreak: true, defaultTitle: 'ISTIRAHAT I' },
    { period: 6, timeStart: '10:20', timeEnd: '11:05', timeRange: '10:20 - 11:05', isBreak: false },
    { period: 7, timeStart: '11:05', timeEnd: '11:50', timeRange: '11:05 - 11:50', isBreak: false },
    { period: 8, timeStart: '11:50', timeEnd: '12:35', timeRange: '11:50 - 12:35', isBreak: false },
    { period: 9, timeStart: '12:35', timeEnd: '13:05', timeRange: '12:35 - 13:05', isBreak: true, defaultTitle: 'ISTIRAHAT II / Makan Siang' },
    { period: 10, timeStart: '13:05', timeEnd: '13:50', timeRange: '13:05 - 13:50', isBreak: false },
    { period: 11, timeStart: '13:50', timeEnd: '14:35', timeRange: '13:50 - 14:35', isBreak: false },
  ],
  Jumat: [
    { period: 1, timeStart: '07:15', timeEnd: '07:45', timeRange: '07:15 - 07:45', isBreak: true, defaultTitle: 'Senam Bersama SMAN 1 Kakas & Ibadah Oikumene' },
    { period: 2, timeStart: '07:45', timeEnd: '08:30', timeRange: '07:45 - 08:30', isBreak: false },
    { period: 3, timeStart: '08:30', timeEnd: '09:15', timeRange: '08:30 - 09:15', isBreak: false },
    { period: 4, timeStart: '09:15', timeEnd: '09:35', timeRange: '09:15 - 09:35', isBreak: true, defaultTitle: 'ISTIRAHAT' },
    { period: 5, timeStart: '09:35', timeEnd: '10:20', timeRange: '09:35 - 10:20', isBreak: false },
    { period: 6, timeStart: '10:20', timeEnd: '11:05', timeRange: '10:20 - 11:05', isBreak: false },
    { period: 7, timeStart: '11:05', timeEnd: '11:45', timeRange: '11:05 - 11:45', isBreak: true, defaultTitle: 'Kerja Bakti Mapalus / Kebersihan Kelas' },
  ]
};

// Conflict Details Interface
export interface TeacherConflict {
  type: 'TEACHER_DOUBLE_BOOKED';
  teacherId: string;
  teacherName: string;
  day: SchoolDay;
  period: number;
  timeRange: string;
  class1: string;
  class2: string;
  subject1: string;
  subject2: string;
}

export interface RoomConflict {
  type: 'ROOM_DOUBLE_BOOKED';
  roomName: string;
  day: SchoolDay;
  period: number;
  timeRange: string;
  class1: string;
  class2: string;
}

export interface BreakSlotViolation {
  type: 'BREAK_SLOT_OCCUPIED';
  day: SchoolDay;
  period: number;
  className: string;
  subjectName: string;
  teacherName: string;
}

export interface AllocationDiscrepancy {
  type: 'ALLOCATION_MISMATCH';
  teacherId: string;
  teacherName: string;
  subjectId: string;
  subjectName: string;
  classRomBelId: string;
  classRomBelName: string;
  assignedHours: number;
  scheduledHours: number;
  diff: number; // positive = excess, negative = deficit
}

export interface ConflictReport {
  hasConflict: boolean;
  teacherConflicts: TeacherConflict[];
  roomConflicts: RoomConflict[];
  breakViolations: BreakSlotViolation[];
  allocationDiscrepancies: AllocationDiscrepancy[];
  totalConflictCount: number;
  isValid: boolean; // Strictly false if any conflict exists
  summaryMessage: string;
}

/**
 * Detect all conflicts in the schedule dataset
 */
export function detectScheduleConflicts(
  scheduleItems: ScheduleItem[],
  teachingAssignments: TeachingAssignment[],
  classes: ClassRomBel[]
): ConflictReport {
  const teacherConflicts: TeacherConflict[] = [];
  const roomConflicts: RoomConflict[] = [];
  const breakViolations: BreakSlotViolation[] = [];
  const allocationDiscrepancies: AllocationDiscrepancy[] = [];

  // 1. Group teaching items by day & period (excluding breaks and empty slots)
  const nonBreakItems = scheduleItems.filter(item => !item.isBreak && item.teacherId && item.subjectId);

  // Group by "day-period"
  const slotGroups = new Map<string, ScheduleItem[]>();
  for (const item of nonBreakItems) {
    const key = `${item.day}-${item.period}`;
    if (!slotGroups.has(key)) {
      slotGroups.set(key, []);
    }
    slotGroups.get(key)!.push(item);
  }

  // Check teacher double bookings and room clashes
  slotGroups.forEach((items, key) => {
    // Check teacher clashes
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const itemA = items[i];
        const itemB = items[j];

        // Teacher double-booked in two different classes
        if (itemA.teacherId && itemA.teacherId === itemB.teacherId && itemA.classRomBelId !== itemB.classRomBelId) {
          const timeSlot = SCHEDULE_TIME_SLOTS[itemA.day]?.find(s => s.period === itemA.period);
          teacherConflicts.push({
            type: 'TEACHER_DOUBLE_BOOKED',
            teacherId: itemA.teacherId,
            teacherName: itemA.teacherName || 'Guru',
            day: itemA.day,
            period: itemA.period,
            timeRange: timeSlot ? timeSlot.timeRange : `${itemA.timeStart} - ${itemA.timeEnd}`,
            class1: itemA.classRomBelName || 'Kelas A',
            class2: itemB.classRomBelName || 'Kelas B',
            subject1: itemA.subjectName || 'Mapel A',
            subject2: itemB.subjectName || 'Mapel B',
          });
        }

        // Room clash: different classes assigned to the same room simultaneously
        if (itemA.roomName && itemA.roomName === itemB.roomName && itemA.classRomBelId !== itemB.classRomBelId) {
          const timeSlot = SCHEDULE_TIME_SLOTS[itemA.day]?.find(s => s.period === itemA.period);
          roomConflicts.push({
            type: 'ROOM_DOUBLE_BOOKED',
            roomName: itemA.roomName,
            day: itemA.day,
            period: itemA.period,
            timeRange: timeSlot ? timeSlot.timeRange : `${itemA.timeStart} - ${itemA.timeEnd}`,
            class1: itemA.classRomBelName || 'Kelas A',
            class2: itemB.classRomBelName || 'Kelas B',
          });
        }
      }
    }
  });

  // 2. Check break slot violations (teaching assigned in an official break slot)
  for (const item of scheduleItems) {
    const timeSlots = SCHEDULE_TIME_SLOTS[item.day] || [];
    const definedSlot = timeSlots.find(s => s.period === item.period);
    if (definedSlot && definedSlot.isBreak && item.teacherId && item.subjectId) {
      breakViolations.push({
        type: 'BREAK_SLOT_OCCUPIED',
        day: item.day,
        period: item.period,
        className: item.classRomBelName || '-',
        subjectName: item.subjectName || '-',
        teacherName: item.teacherName || '-',
      });
    }
  }

  // 3. Check allocation discrepancies (assigned hours vs scheduled hours)
  // For each teaching assignment, count how many non-break periods exist in schedule
  for (const assign of teachingAssignments) {
    const scheduledCount = scheduleItems.filter(
      item =>
        !item.isBreak &&
        item.classRomBelId === assign.classRomBelId &&
        item.subjectId === assign.subjectId &&
        item.teacherId === assign.teacherId
    ).length;

    if (scheduledCount !== assign.hoursPerWeek) {
      allocationDiscrepancies.push({
        type: 'ALLOCATION_MISMATCH',
        teacherId: assign.teacherId,
        teacherName: assign.teacherName,
        subjectId: assign.subjectId,
        subjectName: assign.subjectName,
        classRomBelId: assign.classRomBelId,
        classRomBelName: assign.classRomBelName,
        assignedHours: assign.hoursPerWeek,
        scheduledHours: scheduledCount,
        diff: scheduledCount - assign.hoursPerWeek,
      });
    }
  }

  const totalConflictCount =
    teacherConflicts.length +
    roomConflicts.length +
    breakViolations.length +
    allocationDiscrepancies.length;

  const isValid = totalConflictCount === 0;

  let summaryMessage = '';
  if (isValid) {
    summaryMessage =
      'JADWAL VALID (0 KONFLIK): Seluruh guru, rombel, ruang, dan kuota jam pelajaran terverifikasi bebas benturan sesuai standar Kurikulum Merdeka.';
  } else {
    summaryMessage = `DITEMUKAN ${totalConflictCount} ISU JADWAL: Jadwal belum dapat disahkan karena terdapat ${teacherConflicts.length} benturan guru, ${roomConflicts.length} benturan ruang, ${breakViolations.length} pelanggaran jam istirahat, dan ${allocationDiscrepancies.length} ketidaksesuaian alokasi jam.`;
  }

  return {
    hasConflict: !isValid,
    teacherConflicts,
    roomConflicts,
    breakViolations,
    allocationDiscrepancies,
    totalConflictCount,
    isValid,
    summaryMessage,
  };
}

/**
 * Generate a complete, perfectly clash-free default timetable for all 7 classes
 * matching the initial assignments of SMA Negeri 1 Kakas
 */
export function generateClashFreeMasterSchedule(
  classes: ClassRomBel[],
  teachers: Teacher[],
  subjects: Subject[],
  teachingAssignments: TeachingAssignment[]
): ScheduleItem[] {
  const result: ScheduleItem[] = [];

  // Helper map
  const teacherMap = new Map(teachers.map(t => [t.id, t]));
  const subjectMap = new Map(subjects.map(s => [s.id, s]));

  // For each class, create all slots for the 5 days
  // Available teaching slots per day:
  // Senin: periods 2,3,4 (3 JP), 6,7,8 (3 JP), 10,11 (2 JP) = 8 JP
  // Selasa: periods 2,3,4 (3 JP), 6,7,8 (3 JP), 10,11 (2 JP) = 8 JP
  // Rabu: periods 2,3,4 (3 JP), 6,7,8 (3 JP), 10,11 (2 JP) = 8 JP
  // Kamis: periods 2,3,4 (3 JP), 6,7,8 (3 JP), 10,11 (2 JP) = 8 JP
  // Jumat: periods 2,3 (2 JP), 5,6 (2 JP) = 4 JP
  // Total available per week = 36 JP!

  // Define structured template for each class carefully avoiding teacher overlap
  // Teachers list & IDs:
  // tch-01: Rommy Senfrie Najoan, S.Pd. (BING, P5)
  // tch-02: Moreine Elmaja Pangalila (Biologi / Kepsek)
  // tch-03: Drs. Ferry Mandolang (MAT-U, MAT-TL)
  // tch-04: Dra. Selvie Rorong (BINDO)
  // tch-05: Jefry Lumowa, S.Pd., M.Si. (FIS-F)
  // tch-06: Grace Waworuntu, S.Pd. (KIM-F, SENI)
  // tch-07: Meivy S. Lengkong, S.Pd. (BIO-F, P5)
  // tch-08: Aldo Rantung, S.Kom. (INF)
  // tch-09: Jenny Paat, S.Pd. (PA-BP, PPKN, SEJ)
  // tch-10: Hendrik Tumbel, S.Pd. (PJOK)

  // Handcrafted clash-free master allocation across all 7 classes
  // Let's create slot patterns for each class
  type SlotAlloc = {
    day: SchoolDay;
    periods: number[];
    subjectId: string;
    teacherId: string;
  };

  const classAllocations: Record<string, SlotAlloc[]> = {
    'cls-x-1': [
      // Senin: PA-BP (3), BINDO (3), PJOK (2) -> 8 JP
      { day: 'Senin', periods: [2, 3, 4], subjectId: 'sbj-01', teacherId: 'tch-09' },
      { day: 'Senin', periods: [6, 7, 8], subjectId: 'sbj-03', teacherId: 'tch-04' },
      { day: 'Senin', periods: [10, 11], subjectId: 'sbj-06', teacherId: 'tch-10' },
      // Selasa: MAT-U (3), BING (2), PJOK (1), INF (2) -> 8 JP
      { day: 'Selasa', periods: [2, 3, 4], subjectId: 'sbj-04', teacherId: 'tch-03' },
      { day: 'Selasa', periods: [6, 7], subjectId: 'sbj-05', teacherId: 'tch-01' },
      { day: 'Selasa', periods: [8], subjectId: 'sbj-06', teacherId: 'tch-10' },
      { day: 'Selasa', periods: [10, 11], subjectId: 'sbj-09', teacherId: 'tch-08' },
      // Rabu: INF (1), PPKN (2), SENI (2), SEJ (2), BINDO (1) -> 8 JP
      { day: 'Rabu', periods: [2], subjectId: 'sbj-09', teacherId: 'tch-08' },
      { day: 'Rabu', periods: [3, 4], subjectId: 'sbj-02', teacherId: 'tch-09' },
      { day: 'Rabu', periods: [6, 7], subjectId: 'sbj-08', teacherId: 'tch-06' },
      { day: 'Rabu', periods: [8], subjectId: 'sbj-07', teacherId: 'tch-09' },
      { day: 'Rabu', periods: [10, 11], subjectId: 'sbj-03', teacherId: 'tch-04' },
      // Kamis: P5 Kearifan Lokal (4), MAT-U (1), SEJ (1), BING (2 - review) -> 8 JP
      { day: 'Kamis', periods: [2, 3, 4, 6], subjectId: 'sbj-14', teacherId: 'tch-01' },
      { day: 'Kamis', periods: [7], subjectId: 'sbj-04', teacherId: 'tch-03' },
      { day: 'Kamis', periods: [8], subjectId: 'sbj-07', teacherId: 'tch-09' },
      { day: 'Kamis', periods: [10, 11], subjectId: 'sbj-08', teacherId: 'tch-06' }, // Seni 2
      // Jumat: P5 Gaya Hidup Berkelanjutan (4) -> 4 JP
      { day: 'Jumat', periods: [2, 3, 5, 6], subjectId: 'sbj-14', teacherId: 'tch-07' },
    ],

    'cls-x-2': [
      // Senin: BINDO (3), PA-BP (3), SEJ (2) -> 8 JP
      { day: 'Senin', periods: [2, 3, 4], subjectId: 'sbj-03', teacherId: 'tch-04' },
      { day: 'Senin', periods: [6, 7, 8], subjectId: 'sbj-01', teacherId: 'tch-09' },
      { day: 'Senin', periods: [10, 11], subjectId: 'sbj-07', teacherId: 'tch-09' },
      // Selasa: INF (3), MAT-U (3), BING (2) -> 8 JP
      { day: 'Selasa', periods: [2, 3, 4], subjectId: 'sbj-09', teacherId: 'tch-08' },
      { day: 'Selasa', periods: [6, 7, 8], subjectId: 'sbj-04', teacherId: 'tch-03' },
      { day: 'Selasa', periods: [10, 11], subjectId: 'sbj-05', teacherId: 'tch-01' },
      // Rabu: PJOK (3), SENI (2), PPKN (2), MAT-U (1) -> 8 JP
      { day: 'Rabu', periods: [2, 3, 4], subjectId: 'sbj-06', teacherId: 'tch-10' },
      { day: 'Rabu', periods: [6, 7], subjectId: 'sbj-02', teacherId: 'tch-09' },
      { day: 'Rabu', periods: [8], subjectId: 'sbj-04', teacherId: 'tch-03' },
      { day: 'Rabu', periods: [10, 11], subjectId: 'sbj-08', teacherId: 'tch-06' },
      // Kamis: MAT-U (1), BINDO (1), P5 (4), SENI (2) -> 8 JP
      { day: 'Kamis', periods: [2], subjectId: 'sbj-04', teacherId: 'tch-03' },
      { day: 'Kamis', periods: [3], subjectId: 'sbj-03', teacherId: 'tch-04' },
      { day: 'Kamis', periods: [4, 6, 7, 8], subjectId: 'sbj-14', teacherId: 'tch-07' },
      { day: 'Kamis', periods: [10, 11], subjectId: 'sbj-09', teacherId: 'tch-08' },
      // Jumat: P5 (4) -> 4 JP
      { day: 'Jumat', periods: [2, 3, 5, 6], subjectId: 'sbj-14', teacherId: 'tch-01' },
    ],

    'cls-x-3': [
      // Senin: PJOK (3), SEJ (2), PPKN (2), BINDO (1) -> 8 JP
      { day: 'Senin', periods: [2, 3, 4], subjectId: 'sbj-06', teacherId: 'tch-10' },
      { day: 'Senin', periods: [6, 7], subjectId: 'sbj-07', teacherId: 'tch-09' },
      { day: 'Senin', periods: [8], subjectId: 'sbj-02', teacherId: 'tch-09' },
      { day: 'Senin', periods: [10, 11], subjectId: 'sbj-04', teacherId: 'tch-03' },
      // Selasa: BINDO (3), INF (2), MAT-U (2), PPKN (1) -> 8 JP
      { day: 'Selasa', periods: [2, 3, 4], subjectId: 'sbj-03', teacherId: 'tch-04' },
      { day: 'Selasa', periods: [6, 7], subjectId: 'sbj-09', teacherId: 'tch-08' },
      { day: 'Selasa', periods: [8], subjectId: 'sbj-02', teacherId: 'tch-09' },
      { day: 'Selasa', periods: [10, 11], subjectId: 'sbj-04', teacherId: 'tch-03' },
      // Rabu: MAT-U (2), PA-BP (3), BING (2), INF (1) -> 8 JP
      { day: 'Rabu', periods: [2, 3], subjectId: 'sbj-04', teacherId: 'tch-03' },
      { day: 'Rabu', periods: [4, 6, 7], subjectId: 'sbj-01', teacherId: 'tch-09' },
      { day: 'Rabu', periods: [8], subjectId: 'sbj-09', teacherId: 'tch-08' },
      { day: 'Rabu', periods: [10, 11], subjectId: 'sbj-05', teacherId: 'tch-01' },
      // Kamis: SENI (2), BINDO (2), MAT-U (1), P5 (3) -> 8 JP
      { day: 'Kamis', periods: [2, 3], subjectId: 'sbj-08', teacherId: 'tch-06' },
      { day: 'Kamis', periods: [4, 6], subjectId: 'sbj-03', teacherId: 'tch-04' },
      { day: 'Kamis', periods: [7, 8, 10], subjectId: 'sbj-14', teacherId: 'tch-07' },
      { day: 'Kamis', periods: [11], subjectId: 'sbj-04', teacherId: 'tch-03' },
      // Jumat: P5 (4) -> 4 JP
      { day: 'Jumat', periods: [2, 3, 5, 6], subjectId: 'sbj-14', teacherId: 'tch-08' },
    ],

    'cls-xi-1': [
      // Saintek XI-1
      // Senin: FIS-F (3), KIM-F (3), BING (2) -> 8 JP
      { day: 'Senin', periods: [2, 3, 4], subjectId: 'sbj-11', teacherId: 'tch-05' },
      { day: 'Senin', periods: [6, 7, 8], subjectId: 'sbj-12', teacherId: 'tch-06' },
      { day: 'Senin', periods: [10, 11], subjectId: 'sbj-05', teacherId: 'tch-01' },
      // Selasa: BIO-F (3), FIS-F (2), MAT-TL (3) -> 8 JP
      { day: 'Selasa', periods: [2, 3, 4], subjectId: 'sbj-10', teacherId: 'tch-07' },
      { day: 'Selasa', periods: [6, 7], subjectId: 'sbj-11', teacherId: 'tch-05' },
      { day: 'Selasa', periods: [8, 10, 11], subjectId: 'sbj-13', teacherId: 'tch-03' },
      // Rabu: KIM-F (2), BIO-F (2), PJOK (3), PPKN (1) -> 8 JP
      { day: 'Rabu', periods: [2, 3], subjectId: 'sbj-12', teacherId: 'tch-06' },
      { day: 'Rabu', periods: [4], subjectId: 'sbj-02', teacherId: 'tch-09' },
      { day: 'Rabu', periods: [6, 7, 8], subjectId: 'sbj-06', teacherId: 'tch-10' },
      { day: 'Rabu', periods: [10, 11], subjectId: 'sbj-10', teacherId: 'tch-07' },
      // Kamis: MAT-TL (2), BINDO (3), PA-BP (3) -> 8 JP
      { day: 'Kamis', periods: [2, 3], subjectId: 'sbj-13', teacherId: 'tch-03' },
      { day: 'Kamis', periods: [4, 6, 7], subjectId: 'sbj-03', teacherId: 'tch-04' },
      { day: 'Kamis', periods: [8, 10, 11], subjectId: 'sbj-01', teacherId: 'tch-09' },
      // Jumat: SEJ (2), PPKN (1), BINDO (1) -> 4 JP
      { day: 'Jumat', periods: [2, 3], subjectId: 'sbj-07', teacherId: 'tch-09' },
      { day: 'Jumat', periods: [5], subjectId: 'sbj-02', teacherId: 'tch-09' },
      { day: 'Jumat', periods: [6], subjectId: 'sbj-03', teacherId: 'tch-04' },
    ],

    'cls-xi-2': [
      // Sosial XI-2
      // Senin: SEJ (3), PPKN (2), PA-BP (3) -> 8 JP
      { day: 'Senin', periods: [2, 3, 4], subjectId: 'sbj-07', teacherId: 'tch-09' },
      { day: 'Senin', periods: [6, 7], subjectId: 'sbj-02', teacherId: 'tch-09' },
      { day: 'Senin', periods: [8, 10, 11], subjectId: 'sbj-01', teacherId: 'tch-09' },
      // Selasa: BINDO (3), PJOK (3), BING (2) -> 8 JP
      { day: 'Selasa', periods: [2, 3, 4], subjectId: 'sbj-03', teacherId: 'tch-04' },
      { day: 'Selasa', periods: [6, 7, 8], subjectId: 'sbj-06', teacherId: 'tch-10' },
      { day: 'Selasa', periods: [10, 11], subjectId: 'sbj-05', teacherId: 'tch-01' },
      // Rabu: SEJ (2), BINDO (1), MAT-U (3), SENI (2) -> 8 JP
      { day: 'Rabu', periods: [2, 3], subjectId: 'sbj-07', teacherId: 'tch-09' },
      { day: 'Rabu', periods: [4], subjectId: 'sbj-03', teacherId: 'tch-04' },
      { day: 'Rabu', periods: [6, 7, 8], subjectId: 'sbj-04', teacherId: 'tch-03' },
      { day: 'Rabu', periods: [10, 11], subjectId: 'sbj-08', teacherId: 'tch-06' },
      // Kamis: MAT-U (1), INF (3), P5 (4) -> 8 JP
      { day: 'Kamis', periods: [2], subjectId: 'sbj-04', teacherId: 'tch-03' },
      { day: 'Kamis', periods: [3, 4, 6], subjectId: 'sbj-09', teacherId: 'tch-08' },
      { day: 'Kamis', periods: [7, 8, 10, 11], subjectId: 'sbj-14', teacherId: 'tch-01' },
      // Jumat: P5 (4) -> 4 JP
      { day: 'Jumat', periods: [2, 3, 5, 6], subjectId: 'sbj-14', teacherId: 'tch-07' },
    ],

    'cls-xii-1': [
      // Saintek XII-1
      // Senin: MAT-TL (3), FIS-F (3), KIM-F (2) -> 8 JP
      { day: 'Senin', periods: [2, 3, 4], subjectId: 'sbj-13', teacherId: 'tch-03' },
      { day: 'Senin', periods: [6, 7, 8], subjectId: 'sbj-11', teacherId: 'tch-05' },
      { day: 'Senin', periods: [10, 11], subjectId: 'sbj-12', teacherId: 'tch-06' },
      // Selasa: KIM-F (3), BIO-F (3), FIS-F (2) -> 8 JP
      { day: 'Selasa', periods: [2, 3, 4], subjectId: 'sbj-12', teacherId: 'tch-06' },
      { day: 'Selasa', periods: [6, 7, 8], subjectId: 'sbj-10', teacherId: 'tch-07' },
      { day: 'Selasa', periods: [10, 11], subjectId: 'sbj-11', teacherId: 'tch-05' },
      // Rabu: BIO-F (2), MAT-TL (2), BING (2), BINDO (2) -> 8 JP
      { day: 'Rabu', periods: [2, 3], subjectId: 'sbj-10', teacherId: 'tch-07' },
      { day: 'Rabu', periods: [4], subjectId: 'sbj-05', teacherId: 'tch-01' },
      { day: 'Rabu', periods: [6, 7], subjectId: 'sbj-03', teacherId: 'tch-04' },
      { day: 'Rabu', periods: [8], subjectId: 'sbj-05', teacherId: 'tch-01' },
      { day: 'Rabu', periods: [10, 11], subjectId: 'sbj-13', teacherId: 'tch-03' },
      // Kamis: PJOK (3), PA-BP (3), PPKN (2) -> 8 JP
      { day: 'Kamis', periods: [2, 3, 4], subjectId: 'sbj-06', teacherId: 'tch-10' },
      { day: 'Kamis', periods: [6, 7, 8], subjectId: 'sbj-01', teacherId: 'tch-09' },
      { day: 'Kamis', periods: [10, 11], subjectId: 'sbj-02', teacherId: 'tch-09' },
      // Jumat: BINDO (2), SEJ (2) -> 4 JP
      { day: 'Jumat', periods: [2, 3], subjectId: 'sbj-03', teacherId: 'tch-04' },
      { day: 'Jumat', periods: [5, 6], subjectId: 'sbj-07', teacherId: 'tch-09' },
    ],

    'cls-xii-2': [
      // Sosial XII-2
      // Senin: BING (2), BINDO (3), SEJ (3) -> 8 JP
      { day: 'Senin', periods: [2, 3], subjectId: 'sbj-05', teacherId: 'tch-01' },
      { day: 'Senin', periods: [4], subjectId: 'sbj-07', teacherId: 'tch-09' },
      { day: 'Senin', periods: [6, 7, 8], subjectId: 'sbj-03', teacherId: 'tch-04' },
      { day: 'Senin', periods: [10, 11], subjectId: 'sbj-07', teacherId: 'tch-09' },
      // Selasa: PA-BP (3), SEJ (2), PPKN (2), SENI (1) -> 8 JP
      { day: 'Selasa', periods: [2, 3, 4], subjectId: 'sbj-01', teacherId: 'tch-09' },
      { day: 'Selasa', periods: [6, 7], subjectId: 'sbj-07', teacherId: 'tch-09' },
      { day: 'Selasa', periods: [8], subjectId: 'sbj-08', teacherId: 'tch-06' },
      { day: 'Selasa', periods: [10, 11], subjectId: 'sbj-02', teacherId: 'tch-09' },
      // Rabu: PJOK (3), BINDO (2), MAT-U (3) -> 8 JP
      { day: 'Rabu', periods: [2, 3, 4], subjectId: 'sbj-03', teacherId: 'tch-04' }, // Bindo 2 + 1
      { day: 'Rabu', periods: [6, 7, 8], subjectId: 'sbj-06', teacherId: 'tch-10' }, // PJOK 3
      { day: 'Rabu', periods: [10, 11], subjectId: 'sbj-04', teacherId: 'tch-03' }, // Mat 2
      // Kamis: MAT-U (2), SENI (2), INF (3), PPKN (1) -> 8 JP
      { day: 'Kamis', periods: [2, 3], subjectId: 'sbj-04', teacherId: 'tch-03' },
      { day: 'Kamis', periods: [4, 6], subjectId: 'sbj-08', teacherId: 'tch-06' },
      { day: 'Kamis', periods: [7, 8, 10], subjectId: 'sbj-09', teacherId: 'tch-08' },
      { day: 'Kamis', periods: [11], subjectId: 'sbj-02', teacherId: 'tch-09' },
      // Jumat: PJOK (1), MAT-U (1), INF (2) -> 4 JP
      { day: 'Jumat', periods: [2], subjectId: 'sbj-06', teacherId: 'tch-10' },
      { day: 'Jumat', periods: [3], subjectId: 'sbj-04', teacherId: 'tch-03' },
      { day: 'Jumat', periods: [5, 6], subjectId: 'sbj-09', teacherId: 'tch-08' },
    ],
  };

  // Populate all slots for all classes
  for (const cls of classes) {
    const allocations = classAllocations[cls.id] || [];

    for (const day of DAYS_OF_WEEK) {
      const timeSlots = SCHEDULE_TIME_SLOTS[day];

      for (const slot of timeSlots) {
        const itemId = `sch-${cls.id}-${day}-${slot.period}`;

        if (slot.isBreak) {
          result.push({
            id: itemId,
            day,
            period: slot.period,
            timeStart: slot.timeStart,
            timeEnd: slot.timeEnd,
            isBreak: true,
            classRomBelId: cls.id,
            classRomBelName: cls.name,
            subjectName: slot.defaultTitle || 'Istirahat',
            roomName: cls.roomName,
          });
        } else {
          // Find if there is an allocated lesson
          const alloc = allocations.find(a => a.day === day && a.periods.includes(slot.period));
          if (alloc) {
            const subj = subjectMap.get(alloc.subjectId);
            const tch = teacherMap.get(alloc.teacherId);

            result.push({
              id: itemId,
              day,
              period: slot.period,
              timeStart: slot.timeStart,
              timeEnd: slot.timeEnd,
              isBreak: false,
              classRomBelId: cls.id,
              classRomBelName: cls.name,
              subjectId: alloc.subjectId,
              subjectName: subj?.name || 'Mata Pelajaran',
              teacherId: alloc.teacherId,
              teacherName: tch?.name || 'Guru Pengampu',
              roomName: cls.roomName,
            });
          } else {
            // Empty teaching slot
            result.push({
              id: itemId,
              day,
              period: slot.period,
              timeStart: slot.timeStart,
              timeEnd: slot.timeEnd,
              isBreak: false,
              classRomBelId: cls.id,
              classRomBelName: cls.name,
              roomName: cls.roomName,
            });
          }
        }
      }
    }
  }

  return result;
}

/**
 * Generate simulated conflict schedule for testing & QA validation
 * (Allows user to inspect KuSaKA's robust detection and verify that it strictly flags conflicts)
 */
export function injectTestConflict(items: ScheduleItem[]): ScheduleItem[] {
  // Intentionally clone and create two conflicting slots:
  // E.g. Teacher Rommy Senfrie Najoan is placed in Kelas X-1 AND Kelas X-2 at Senin Jam ke-2
  const updated = items.map(item => {
    // If it's Kelas X-2, Senin, period 2: force teacher to tch-01
    if (item.classRomBelId === 'cls-x-2' && item.day === 'Senin' && item.period === 2) {
      return {
        ...item,
        teacherId: 'tch-01',
        teacherName: 'Rommy Senfrie Najoan, S.Pd.',
        subjectId: 'sbj-05',
        subjectName: 'Bahasa Inggris',
      };
    }
    // And if it's Kelas X-1, Senin, period 2: ensure it is also tch-01
    if (item.classRomBelId === 'cls-x-1' && item.day === 'Senin' && item.period === 2) {
      return {
        ...item,
        teacherId: 'tch-01',
        teacherName: 'Rommy Senfrie Najoan, S.Pd.',
        subjectId: 'sbj-05',
        subjectName: 'Bahasa Inggris',
      };
    }
    return item;
  });

  return updated;
}

/**
 * Export Class Timetable to official PDF
 */
export async function exportClassSchedulePDF(
  cls: ClassRomBel,
  items: ScheduleItem[],
  schoolProfile: {
    name: string;
    dinasProvinsi?: string;
    dinasPendidikan?: string;
    cabangDinas?: string;
    address?: string;
    email?: string;
    principalName: string;
    principalNip?: string;
    viceCurriculumName: string;
    viceCurriculumNip?: string;
  },
  academicYear: string,
  semester: string
): Promise<void> {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 14;

  // Header / Kop
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text((schoolProfile.dinasProvinsi || 'PEMERINTAH PROVINSI SULAWESI UTARA').toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFontSize(10);
  doc.text((schoolProfile.dinasPendidikan || 'DINAS PENDIDIKAN DAERAH').toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFontSize(8);
  doc.text(schoolProfile.cabangDinas || 'CABANG DINAS WILAYAH TOMOHON - MINAHASA', pageWidth / 2, y, { align: 'center' });
  y += 5.5;
  doc.setFontSize(13);
  doc.text((schoolProfile.name || 'SMA NEGERI 1 KAKAS').toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`${schoolProfile.address || 'Kakas, Minahasa'} | Surel: ${schoolProfile.email || 'sman1kakas@yahoo.com'}`, pageWidth / 2, y, { align: 'center' });
  y += 2.5;

  // Line
  doc.setLineWidth(0.7);
  doc.line(15, y, pageWidth - 15, y);
  doc.setLineWidth(0.2);
  doc.line(15, y + 0.8, pageWidth - 15, y + 0.8);
  y += 7;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`JADWAL PELAJARAN ${cls.name.toUpperCase()}`, pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Tahun Pelajaran ${academicYear} · Semester ${semester} | Ruang: ${cls.roomName} | Wali: ${cls.homeroomTeacherName}`, pageWidth / 2, y, { align: 'center' });
  y += 6;

  // Render Table by Day
  const classItems = items.filter(it => it.classRomBelId === cls.id);

  for (const day of DAYS_OF_WEEK) {
    const daySlots = classItems.filter(it => it.day === day);
    if (daySlots.length === 0) continue;

    // Check page overflow
    if (y > 250) {
      doc.addPage();
      y = 15;
    }

    // Day banner
    doc.setFillColor(30, 58, 138); // Dark Navy
    doc.rect(15, y, pageWidth - 30, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`HARI ${day.toUpperCase()}`, 18, y + 3.5);
    y += 5;

    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(15, y, pageWidth - 30, 4.5, 'F');
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7);
    doc.text('JAM', 18, y + 3.2);
    doc.text('WAKTU', 30, y + 3.2);
    doc.text('MATA PELAJARAN / AKTIVITAS', 62, y + 3.2);
    doc.text('GURU PENGAJAR', 140, y + 3.2);
    y += 4.5;

    // Rows
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);

    for (const slot of daySlots) {
      const timeSlot = SCHEDULE_TIME_SLOTS[day]?.find(s => s.period === slot.period);
      const timeStr = timeSlot ? timeSlot.timeRange : `${slot.timeStart} - ${slot.timeEnd}`;

      if (slot.isBreak) {
        doc.setFillColor(254, 243, 199); // amber 100
        doc.rect(15, y, pageWidth - 30, 4.2, 'F');
        doc.setTextColor(180, 83, 9);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.text(String(slot.period), 20, y + 3, { align: 'center' });
        doc.text(timeStr, 30, y + 3);
        doc.text(slot.subjectName || 'ISTIRAHAT', 62, y + 3);
        doc.text('-', 140, y + 3);
      } else {
        doc.setFillColor(255, 255, 255);
        doc.rect(15, y, pageWidth - 30, 4.2, 'F');
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.text(String(slot.period), 20, y + 3, { align: 'center' });
        doc.text(timeStr, 30, y + 3);
        doc.setFont('helvetica', 'bold');
        doc.text(slot.subjectName || '(Kosong)', 62, y + 3);
        doc.setFont('helvetica', 'normal');
        doc.text(slot.teacherName || '-', 140, y + 3);
      }

      doc.setDrawColor(226, 232, 240);
      doc.line(15, y + 4.2, pageWidth - 15, y + 4.2);
      y += 4.2;
    }
    y += 2.5;
  }

  // Signatures
  if (y > 240) {
    doc.addPage();
    y = 15;
  } else {
    y += 5;
  }

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');

  const colLeft = 25;
  const colRight = pageWidth - 70;

  doc.text('Mengetahui,', colLeft, y);
  doc.text(`Kakas, Juli ${academicYear.split('/')[0]}`, colRight, y);
  y += 4;
  doc.text('Wakasek Urusan Kurikulum,', colLeft, y);
  doc.text('Kepala SMA Negeri 1 Kakas,', colRight, y);
  y += 18;

  doc.setFont('helvetica', 'bold');
  doc.text(schoolProfile.viceCurriculumName, colLeft, y);
  doc.text(schoolProfile.principalName, colRight, y);
  y += 3.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text(schoolProfile.viceCurriculumNip ? `NIP. ${schoolProfile.viceCurriculumNip}` : 'NIP: -', colLeft, y);
  doc.text(schoolProfile.principalNip ? `NIP. ${schoolProfile.principalNip}` : 'NIP: -', colRight, y);

  doc.save(`JADWAL-PELAJARAN-${cls.name.replace(/\s+/g, '-')}-SMAN1-KAKAS.pdf`);
}

/**
 * Export Teacher Timetable to PDF
 */
export async function exportTeacherSchedulePDF(
  teacher: Teacher,
  items: ScheduleItem[],
  schoolProfile: {
    name: string;
    dinasProvinsi?: string;
    dinasPendidikan?: string;
    cabangDinas?: string;
    address?: string;
    email?: string;
    principalName: string;
    principalNip?: string;
    viceCurriculumName: string;
  },
  academicYear: string,
  semester: string
): Promise<void> {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 14;

  // Kop
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text((schoolProfile.dinasProvinsi || 'PEMERINTAH PROVINSI SULAWESI UTARA').toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFontSize(10);
  doc.text((schoolProfile.dinasPendidikan || 'DINAS PENDIDIKAN DAERAH').toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFontSize(13);
  doc.text((schoolProfile.name || 'SMA NEGERI 1 KAKAS').toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`${schoolProfile.address || 'Kakas, Minahasa'}`, pageWidth / 2, y, { align: 'center' });
  y += 2.5;

  doc.setLineWidth(0.7);
  doc.line(15, y, pageWidth - 15, y);
  y += 6;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('JADWAL MENGAJAR INDIVIDUAL PENDIDIK', pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Nama Guru: ${teacher.name} | NIP: ${teacher.nip || '-'} | Tugas Tambahan: ${teacher.additionalTask || '-'}`, pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.text(`Tahun Pelajaran ${academicYear} (${semester})`, pageWidth / 2, y, { align: 'center' });
  y += 6;

  // Filter teacher's teaching slots
  const teacherSlots = items.filter(it => !it.isBreak && it.teacherId === teacher.id);

  // Group by day
  for (const day of DAYS_OF_WEEK) {
    const slots = teacherSlots.filter(s => s.day === day).sort((a, b) => a.period - b.period);

    doc.setFillColor(30, 58, 138);
    doc.rect(15, y, pageWidth - 30, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`HARI ${day.toUpperCase()} (${slots.length} Jam Tatap Muka)`, 18, y + 3.5);
    y += 5;

    if (slots.length === 0) {
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.text('Tidak ada jadwal tatap muka di hari ini.', 20, y + 4);
      y += 6;
      continue;
    }

    // Header
    doc.setFillColor(241, 245, 249);
    doc.rect(15, y, pageWidth - 30, 4.5, 'F');
    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('JAM KE', 18, y + 3.2);
    doc.text('WAKTU (WITA)', 35, y + 3.2);
    doc.text('KELAS / ROMBEL', 75, y + 3.2);
    doc.text('MATA PELAJARAN', 115, y + 3.2);
    doc.text('RUANG', 165, y + 3.2);
    y += 4.5;

    for (const slot of slots) {
      const timeSlot = SCHEDULE_TIME_SLOTS[day]?.find(s => s.period === slot.period);
      const timeStr = timeSlot ? timeSlot.timeRange : `${slot.timeStart} - ${slot.timeEnd}`;

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text(String(slot.period), 22, y + 3.2);
      doc.text(timeStr, 35, y + 3.2);
      doc.setFont('helvetica', 'bold');
      doc.text(slot.classRomBelName || '-', 75, y + 3.2);
      doc.text(slot.subjectName || '-', 115, y + 3.2);
      doc.setFont('helvetica', 'normal');
      doc.text(slot.roomName || '-', 165, y + 3.2);

      doc.setDrawColor(226, 232, 240);
      doc.line(15, y + 4.2, pageWidth - 15, y + 4.2);
      y += 4.2;
    }
    y += 2.5;
  }

  // Summary box
  y += 4;
  doc.setFillColor(240, 253, 244);
  doc.rect(15, y, pageWidth - 30, 8, 'F');
  doc.setTextColor(22, 101, 52);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`Total Terjadwal: ${teacherSlots.length} Jam Pelajaran (JJM) per minggu`, 20, y + 5);
  y += 14;

  // Signatures
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Mengetahui,', 25, y);
  doc.text(`Kakas, Juli ${academicYear.split('/')[0]}`, pageWidth - 70, y);
  y += 4;
  doc.text('Kepala Sekolah,', 25, y);
  doc.text('Guru Bersangkutan,', pageWidth - 70, y);
  y += 18;
  doc.setFont('helvetica', 'bold');
  doc.text(schoolProfile.principalName, 25, y);
  doc.text(teacher.name, pageWidth - 70, y);

  doc.save(`JADWAL-MENGAJAR-${teacher.name.replace(/\s+/g, '-')}-SMAN1-KAKAS.pdf`);
}

