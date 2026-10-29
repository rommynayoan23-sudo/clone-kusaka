import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer } from './components/common/ToastContainer';

// Module Views
import { DashboardView } from './components/modules/DashboardView';
import { SchoolProfileView } from './components/modules/SchoolProfileView';
import { MasterDataView } from './components/modules/MasterDataView';
import { CurriculumPlanView } from './components/modules/CurriculumPlanView';
import { CurriculumKspView } from './components/modules/CurriculumKspView';
import { AcademicCalendarView } from './components/modules/AcademicCalendarView';
import { WorkProgramView } from './components/modules/WorkProgramView';
import { TeachingAssignmentView } from './components/modules/TeachingAssignmentView';
import { ScheduleGeneratorView } from './components/modules/ScheduleGeneratorView';
import { LearningDeviceView } from './components/modules/LearningDeviceView';
import { AssessmentView } from './components/modules/AssessmentView';
import { SupervisionView } from './components/modules/SupervisionView';
import { TeacherDevView } from './components/modules/TeacherDevView';
import { MonevView } from './components/modules/MonevView';
import { ReportsView } from './components/modules/ReportsView';
import { DigitalArchiveView } from './components/modules/DigitalArchiveView';
import { DocumentGeneratorView } from './components/modules/DocumentGeneratorView';
import { AiAssistantView } from './components/modules/AiAssistantView';
import { UserManagementView } from './components/modules/UserManagementView';
import { SystemDatabaseView } from './components/modules/SystemDatabaseView';
import { HelpGuideView } from './components/modules/HelpGuideView';

const MainLayout: React.FC = () => {
  const { activeMenu, schoolProfile, activeAcademicYear } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderModule = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardView />;
      case 'school_profile':
        return <SchoolProfileView />;
      case 'master_data':
        return <MasterDataView />;
      case 'curriculum_plan':
        return <CurriculumPlanView />;
      case 'curriculum_ksp':
        return <CurriculumKspView />;
      case 'academic_calendar':
        return <AcademicCalendarView />;
      case 'work_program':
        return <WorkProgramView />;
      case 'teaching_assignment':
        return <TeachingAssignmentView />;
      case 'schedule_generator':
        return <ScheduleGeneratorView />;
      case 'learning_device':
        return <LearningDeviceView />;
      case 'assessment':
        return <AssessmentView />;
      case 'supervision':
        return <SupervisionView />;
      case 'teacher_dev':
        return <TeacherDevView />;
      case 'monev':
        return <MonevView />;
      case 'reports':
        return <ReportsView />;
      case 'digital_archive':
        return <DigitalArchiveView />;
      case 'ai_generator':
        return <AiAssistantView />;
      case 'settings':
        return <SystemDatabaseView />;
      case 'user_management':
        return <UserManagementView />;
      case 'help_guide':
        return <HelpGuideView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar onOpenMobile={() => setMobileSidebarOpen(true)} />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderModule()}
          </div>
        </main>
      </div>

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
