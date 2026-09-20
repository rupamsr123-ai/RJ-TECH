import React, { useState } from 'react';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  QrCode,
  CreditCard,
  AlertCircle,
  FileCheck,
  Award,
  Bell,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  DollarSign,
  Share2,
  CheckCircle2,
  HelpCircle,
  Shield,
  Layers,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button, Badge, Modal } from '../common/UIComponents';
import { AdminProfileModal } from './AdminProfileModal';

export const AdminLayout: React.FC<{
  activeSubView: string;
  setActiveSubView: (view: string) => void;
  children: React.ReactNode;
}> = ({ activeSubView, setActiveSubView, children }) => {
  const {
    currentUser,
    currentRole,
    logout,
    settings,
    students,
    courses,
    payments,
    certificates,
    notices,
    setActiveReceipt,
    setActiveCertificate,
    setSelectedStudentId,
    setActiveView,
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminProfileOpen, setAdminProfileOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    admission: true,
    academic: false,
    attendance: false,
    fees: true,
    exam: false,
    certificates: false,
    communication: false,
    reports: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Search filtering across multiple entities
  const searchResults = searchQuery.trim()
    ? {
        students: students.filter(
          (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.registrationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.phone.includes(searchQuery)
        ),
        courses: courses.filter(
          (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.code.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        payments: payments.filter(
          (p) =>
            p.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.studentName.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        certificates: certificates.filter(
          (c) =>
            c.certificateNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.studentName.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }
    : null;

  const navGroups = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      view: 'dashboard',
    },
    {
      id: 'admission',
      label: 'Admission',
      icon: UserPlus,
      children: [
        { label: 'Admission Enquiry', view: 'admission_enquiry' },
        { label: 'Online Admission', view: 'online_admission_admin' },
        { label: 'Add Student', view: 'add_student' },
        { label: 'Student List', view: 'student_list' },
      ],
    },
    {
      id: 'academic',
      label: 'Academic',
      icon: BookOpen,
      children: [
        { label: 'Courses', view: 'courses' },
        { label: 'Batches', view: 'batches' },
        { label: 'Class Schedule', view: 'schedule' },
        { label: 'Study Materials', view: 'study_materials' },
      ],
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: QrCode,
      children: [
        { label: 'QR Attendance Scanner', view: 'attendance_qr' },
        { label: 'Manual Attendance', view: 'attendance_manual' },
        { label: 'Attendance Report', view: 'attendance_report' },
      ],
    },
    {
      id: 'fees',
      label: 'Fees & Accounts',
      icon: CreditCard,
      children: [
        { label: 'Fees Structure', view: 'fees_structure' },
        { label: 'Collect Fees', view: 'collect_fees' },
        { label: 'Due Fees & Reminders', view: 'due_fees' },
        { label: 'Payment History', view: 'payment_history' },
        { label: 'Income & Expense', view: 'income_expense' },
      ],
    },
    {
      id: 'exam',
      label: 'Examination',
      icon: FileCheck,
      children: [
        { label: 'Exams & Schedule', view: 'exams' },
        { label: 'Marks Entry', view: 'marks_entry' },
        { label: 'Results Sheet', view: 'results' },
      ],
    },
    {
      id: 'certificates',
      label: 'Certificates & IDs',
      icon: Award,
      children: [
        { label: 'Student ID Cards', view: 'id_cards' },
        { label: 'Certificate Generator', view: 'certificates' },
        { label: 'Certificate Verification', view: 'certificate_verify' },
      ],
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: Bell,
      children: [
        { label: 'Notices & Circulars', view: 'notices' },
        { label: 'WhatsApp Messenger', view: 'whatsapp_center' },
        { label: 'Referral Program', view: 'referrals' },
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      children: [
        { label: 'Student & Admission Report', view: 'report_students' },
        { label: 'Fees & Due Report', view: 'report_fees' },
        { label: 'Attendance & Exam Report', view: 'report_attendance' },
        { label: 'Financial Balance Sheet', view: 'report_finance' },
      ],
    },
    {
      id: 'settings',
      label: 'Institute Settings',
      icon: Settings,
      view: 'settings',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col antialiased">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-xs h-16 flex items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle Navigation Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActiveSubView('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs shrink-0 flex items-center justify-center p-0.5">
              <img
                src={settings.logoUrl || '/rj_tech_logo.jpg'}
                alt="RJ TECH Logo"
                className="w-full h-full object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-base text-slate-900 tracking-tight font-heading">
                  RJ TECH
                </span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  {currentRole}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate max-w-[170px] sm:max-w-none">
                Management System
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Global Search trigger */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <button
            onClick={() => setGlobalSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-slate-400 bg-slate-100/80 hover:bg-slate-100 rounded-xl border border-slate-200/80 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search student, reg no, course, receipt, certificate...</span>
            </span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-500 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Add Dropdown */}
          <div className="relative">
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setQuickAddOpen(!quickAddOpen)}
              className="text-xs px-2.5 sm:px-3"
            >
              <span className="hidden sm:inline">Quick Add</span>
            </Button>

            {quickAddOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    setActiveSubView('add_student');
                    setQuickAddOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 font-medium text-slate-700"
                >
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  <span>Add New Student</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSubView('collect_fees');
                    setQuickAddOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 font-medium text-slate-700"
                >
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Collect Fees</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSubView('attendance_qr');
                    setQuickAddOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 font-medium text-slate-700"
                >
                  <QrCode className="w-4 h-4 text-sky-600" />
                  <span>Mark QR Attendance</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSubView('courses');
                    setQuickAddOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 font-medium text-slate-700"
                >
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>Add Course</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSubView('exams');
                    setQuickAddOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 font-medium text-slate-700"
                >
                  <FileCheck className="w-4 h-4 text-purple-600" />
                  <span>Create Exam</span>
                </button>
              </div>
            )}
          </div>

          {/* Search icon for mobile */}
          <button
            onClick={() => setGlobalSearchOpen(true)}
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notices.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="font-bold text-slate-900">Institute Notifications</span>
                  <Badge variant="primary" size="sm">{notices.length} Total</Badge>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {notices.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-semibold text-blue-600">{n.type}</span>
                        <span>{n.date}</span>
                      </div>
                      <p className="font-bold text-slate-800 line-clamp-1">{n.title}</p>
                      <p className="text-slate-500 text-[11px] line-clamp-2 mt-0.5">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* View Website Shortcut */}
          <button
            onClick={() => setActiveView('public_home')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
            title="View Public Website"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Admin Profile Section */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <button
              onClick={() => setAdminProfileOpen(true)}
              className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-slate-100 transition-all text-left group cursor-pointer"
              title="Admin Profile: Upload photo & manage profile"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-blue-500/40 ring-2 ring-blue-500/10 group-hover:ring-blue-500/30 group-hover:scale-105 transition-all">
                <img
                  src={currentUser?.avatar || settings.adminPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={currentUser?.name || 'Director (Admin)'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden md:block">
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 block leading-tight">
                  {currentUser?.name || 'Director (Admin)'}
                </span>
                <span className="text-[10px] font-semibold text-blue-600 flex items-center gap-0.5">
                  <Shield className="w-2.5 h-2.5" /> Admin Profile
                </span>
              </div>
            </button>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 transform transition-transform duration-200 lg:translate-x-0 lg:static flex flex-col justify-between ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Mobile sidebar header */}
          <div className="lg:hidden p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-white p-0.5 shrink-0 flex items-center justify-center">
                <img
                  src={settings.logoUrl || '/rj_tech_logo.jpg'}
                  alt="RJ TECH Logo"
                  className="w-full h-full object-contain rounded-md"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-bold text-sm text-slate-900">RJ TECH Menu</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 text-xs">
            {navGroups.map((item) => {
              const Icon = item.icon;
              const hasChildren = Boolean(item.children);
              const isOpen = openSections[item.id];
              const isDirectActive = activeSubView === item.view;
              const hasActiveChild = item.children?.some((c) => c.view === activeSubView);

              if (!hasChildren) {
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSubView(item.view!);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                      isDirectActive
                        ? 'bg-blue-50 text-[#155EEF] font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isDirectActive ? 'text-[#155EEF]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <div key={item.id} className="space-y-0.5">
                  <button
                    onClick={() => toggleSection(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                      hasActiveChild
                        ? 'text-blue-700 bg-blue-50/50 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${hasActiveChild ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pl-9 pr-2 py-1 space-y-1 border-l-2 border-slate-100 ml-4">
                      {item.children?.map((child) => (
                        <button
                          key={child.view}
                          onClick={() => {
                            setActiveSubView(child.view);
                            setSidebarOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                            activeSubView === child.view
                              ? 'bg-blue-100/70 text-blue-700 font-bold'
                              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
                          }`}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sidebar Footer: Institute info */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/60 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">RJ TECH</span>
              <Badge variant="success" size="sm">Online</Badge>
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              {settings.addressLine1}, Tamluk
            </p>
            <p className="text-[10px] text-slate-400">
              Session: {settings.currentSession}
            </p>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Global Search Modal */}
      {globalSearchOpen && (
        <Modal
          isOpen={globalSearchOpen}
          onClose={() => {
            setGlobalSearchOpen(false);
            setSearchQuery('');
          }}
          title="Instant Academic Search"
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Type student name, student ID, roll no, receipt no, course, or certificate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto space-y-4 text-xs">
              {searchResults ? (
                <>
                  {/* Students */}
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1.5">
                      Students ({searchResults.students.length})
                    </h4>
                    {searchResults.students.length > 0 ? (
                      <div className="space-y-1">
                        {searchResults.students.map((s) => (
                          <div
                            key={s.id}
                            onClick={() => {
                              setSelectedStudentId(s.id);
                              setActiveSubView('student_profile');
                              setGlobalSearchOpen(false);
                            }}
                            className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <img src={s.photo} alt={s.name} className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <p className="font-bold text-slate-900">{s.name}</p>
                                <p className="text-[11px] text-slate-500">
                                  ID: {s.studentId} • Reg: {s.registrationNo} • {s.courseName}
                                </p>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-blue-600">View Profile →</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic">No matching students.</p>
                    )}
                  </div>

                  {/* Receipts */}
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1.5">
                      Receipts ({searchResults.payments.length})
                    </h4>
                    {searchResults.payments.length > 0 ? (
                      <div className="space-y-1">
                        {searchResults.payments.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => {
                              setActiveReceipt(p);
                              setGlobalSearchOpen(false);
                            }}
                            className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer"
                          >
                            <div>
                              <p className="font-bold text-slate-900">
                                Receipt: {p.receiptNo} (₹{p.amount})
                              </p>
                              <p className="text-[11px] text-slate-500">
                                Student: {p.studentName} • Date: {p.date}
                              </p>
                            </div>
                            <Button size="sm" variant="outline">
                              View Receipt
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic">No matching payment receipts.</p>
                    )}
                  </div>

                  {/* Certificates */}
                  <div>
                    <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1.5">
                      Certificates ({searchResults.certificates.length})
                    </h4>
                    {searchResults.certificates.length > 0 ? (
                      <div className="space-y-1">
                        {searchResults.certificates.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => {
                              setActiveCertificate(c);
                              setGlobalSearchOpen(false);
                            }}
                            className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer"
                          >
                            <div>
                              <p className="font-bold text-slate-900">{c.certificateNo}</p>
                              <p className="text-[11px] text-slate-500">
                                Issued to: {c.studentName} ({c.courseName})
                              </p>
                            </div>
                            <Button size="sm" variant="outline">
                              View Certificate
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic">No matching certificates.</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-slate-400">
                  Type to search across active records in RJ TECH.
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Admin Profile & Avatar Upload Modal */}
      <AdminProfileModal
        isOpen={adminProfileOpen}
        onClose={() => setAdminProfileOpen(false)}
      />
    </div>
  );
};
