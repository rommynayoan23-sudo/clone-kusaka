import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  School,
  Database,
  Compass,
  FileText,
  CalendarDays,
  Briefcase,
  Users2,
  CalendarClock,
  BookOpenCheck,
  ClipboardCheck,
  Eye,
  GraduationCap,
  TrendingUp,
  FileBarChart2,
  Archive,
  Sparkles,
  Settings,
  ShieldCheck,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavSection {
  title: string;
  items: {
    key: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle, mobileOpen, onCloseMobile }) => {
  const { activeMenu, setActiveMenu, schoolProfile, activeAcademicYear } = useApp();

  const sections: NavSection[] = [
    {
      title: 'UTAMA',
      items: [
        { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { key: 'school_profile', label: 'Profil Sekolah', icon: School },
        { key: 'master_data', label: 'Data Induk Sekolah', icon: Database },
      ]
    },
    {
      title: 'PERENCANAAN KURIKULUM',
      items: [
        { key: 'curriculum_plan', label: 'Perencanaan Kurikulum', icon: Compass },
        { key: 'curriculum_ksp', label: 'Dokumen KSP', icon: FileText, badge: 'Merdeka' },
        { key: 'academic_calendar', label: 'Kalender Pendidikan', icon: CalendarDays },
        { key: 'work_program', label: 'Program Kerja Waka', icon: Briefcase },
      ]
    },
    {
      title: 'OPERASIONAL PEMBELAJARAN',
      items: [
        { key: 'teaching_assignment', label: 'Pembagian Tugas Mengajar', icon: Users2 },
        { key: 'schedule_generator', label: 'Jadwal Pelajaran', icon: CalendarClock },
        { key: 'learning_device', label: 'Perangkat Pembelajaran', icon: BookOpenCheck },
        { key: 'assessment', label: 'Asesmen & Penilaian', icon: ClipboardCheck },
      ]
    },
    {
      title: 'PENJAMINAN MUTU & GURU',
      items: [
        { key: 'supervision', label: 'Supervisi Akademik', icon: Eye },
        { key: 'teacher_dev', label: 'Pengembangan Guru', icon: GraduationCap },
        { key: 'monev', label: 'Monitoring & Evaluasi', icon: TrendingUp },
        { key: 'reports', label: 'Laporan Kurikulum', icon: FileBarChart2 },
      ]
    },
    {
      title: 'OTOMASI & ARSIP',
      items: [
        { key: 'digital_archive', label: 'Arsip Digital', icon: Archive },
        { key: 'ai_generator', label: 'Generator AI KuSaKA', icon: Sparkles, badge: 'AI' },
      ]
    },
    {
      title: 'SISTEM & BANTUAN',
      items: [
        { key: 'settings', label: 'Pengaturan & Basis Data', icon: Settings },
        { key: 'user_management', label: 'Manajemen Pengguna', icon: ShieldCheck },
        { key: 'help_guide', label: 'Bantuan & Panduan', icon: HelpCircle },
      ]
    }
  ];

  const handleSelect = (key: string) => {
    setActiveMenu(key);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900 text-slate-200 border-r border-slate-800 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-72'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-18 px-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-700 via-blue-800 to-amber-700 flex items-center justify-center text-white font-extrabold text-base shadow-md flex-shrink-0 border border-amber-500/30">
              K
            </div>
            {!collapsed && (
              <div className="leading-tight truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-white tracking-wide">KuSaKA</span>
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    SMA
                  </span>
                </div>
                <div className="text-xs text-slate-400 truncate">
                  SMAN 1 Kakas · Minahasa
                </div>
              </div>
            )}
          </div>
          <button
            onClick={onToggle}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Perluas Menu' : 'Persempit Menu'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Academic Year Active Indicator */}
        {!collapsed && (
          <div className="mx-3 mt-3 p-2.5 rounded-lg bg-blue-950/70 border border-blue-800/60 text-xs">
            <div className="flex items-center justify-between text-blue-200 font-semibold mb-1">
              <span>Tahun Ajaran Aktif</span>
              <span className="text-[10px] bg-blue-600/40 text-blue-300 px-1.5 py-0.2 rounded font-mono">
                {activeAcademicYear.activeSemester}
              </span>
            </div>
            <div className="text-amber-400 font-bold text-sm tracking-wide">
              TP {activeAcademicYear.year}
            </div>
          </div>
        )}

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-thin">
          {sections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!collapsed && (
                <div className="px-3 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                  {sec.title}
                </div>
              )}
              {sec.items.map(item => {
                const Icon = item.icon;
                const isActive = activeMenu === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleSelect(item.key)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-800 text-white shadow-sm font-semibold border-l-4 border-amber-400 pl-2'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    } ${collapsed ? 'justify-center px-0' : ''}`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                    {!collapsed && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        item.badge === 'AI' 
                          ? 'bg-purple-900/60 text-purple-200 border border-purple-500/40' 
                          : 'bg-slate-800 text-amber-300 border border-amber-500/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 text-xs text-slate-400">
          {!collapsed ? (
            <div className="space-y-1">
              <div className="font-semibold text-slate-300 truncate">
                {schoolProfile.principalName}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Waka: R. Najoan, S.Pd.</span>
                <span className="text-[10px] text-emerald-400 font-mono">v1.0 (Tahap 1)</span>
              </div>
            </div>
          ) : (
            <div className="text-center font-bold text-[10px] text-amber-400">
              SMAN 1
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
