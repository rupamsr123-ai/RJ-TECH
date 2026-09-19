import React, { useState } from 'react';
import {
  LayoutDashboard,
  User,
  Calendar,
  CreditCard,
  FileCheck,
  Award,
  BookOpen,
  Bell,
  LogOut,
  Download,
  Printer,
  QrCode,
  Clock,
  Laptop,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button, Card, Badge, Modal } from '../common/UIComponents';

export const StudentPortal: React.FC = () => {
  const {
    currentStudent,
    setCurrentStudent,
    setCurrentRole,
    setActiveView,
    attendanceRecords,
    payments,
    results,
    certificates,
    studyMaterials,
    notices,
    settings,
    setActiveReceipt,
    setActiveIdCard,
    setActiveCertificate,
    setActiveResultModal,
  } = useApp();

  const [studentTab, setStudentTab] = useState<
    'dashboard' | 'profile' | 'attendance' | 'fees' | 'exams' | 'certificate' | 'materials' | 'notices'
  >('dashboard');

  // UPI Pay Modal state
  const [upiPayModalOpen, setUpiPayModalOpen] = useState(false);

  // If no student is logged in, fallback gracefully
  if (!currentStudent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="p-8 text-center max-w-md">
          <p className="text-slate-600 mb-4 text-sm">No active student session detected.</p>
          <Button
            variant="primary"
            onClick={() => {
              setCurrentRole('PUBLIC');
              setActiveView('public');
            }}
          >
            Back to Public Portal
          </Button>
        </Card>
      </div>
    );
  }

  // Student's personal records
  const myAttendance = attendanceRecords.filter((a) => a.studentId === currentStudent.id);
  const myPresentCount = myAttendance.filter((a) => a.status === 'Present').length;
  const myAttendancePct =
    myAttendance.length > 0 ? Math.round((myPresentCount / myAttendance.length) * 100) : 92;

  const myPayments = payments.filter((p) => p.studentId === currentStudent.studentId);
  const myResults = results.filter((r) => r.studentId === currentStudent.id);
  const myCertificate = certificates.find((c) => c.studentId === currentStudent.id);
  const myMaterials = studyMaterials.filter(
    (m) => m.courseName.toLowerCase() === currentStudent.courseName.toLowerCase()
  );

  const handleLogout = () => {
    setCurrentStudent(null);
    setCurrentRole('PUBLIC');
    setActiveView('public');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 bg-white p-0.5 shrink-0 shadow-xs flex items-center justify-center">
              <img
                src={settings.logoUrl || '/rj_tech_logo.jpg'}
                alt="RJ TECH Logo"
                className="w-full h-full object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-slate-900 tracking-tight text-sm sm:text-base">
                  RJ TECH
                </span>
                <Badge variant="primary" size="sm">Student Portal</Badge>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Digital Education & Institute Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl py-1 px-2.5">
              <img
                src={currentStudent.photo}
                alt={currentStudent.name}
                className="w-8 h-8 rounded-xl object-cover border border-white"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {currentStudent.name}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {currentStudent.studentId}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={LogOut}
              onClick={handleLogout}
              className="text-xs"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Tab Sub-header */}
        <div className="bg-slate-100/80 border-t border-slate-200 px-4 sm:px-6 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5 text-xs font-semibold text-slate-600">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'profile', label: 'My Profile & ID', icon: User },
              { id: 'attendance', label: 'Attendance', icon: Calendar },
              { id: 'fees', label: 'Fees & Receipts', icon: CreditCard },
              { id: 'exams', label: 'Exams & Marksheet', icon: FileCheck },
              { id: 'certificate', label: 'Certificate', icon: Award },
              { id: 'materials', label: 'Study Notes', icon: BookOpen },
              { id: 'notices', label: 'Notice Board', icon: Bell },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = studentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStudentTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Student Portal Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ===================== TAB: DASHBOARD ===================== */}
        {studentTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <img
                    src={currentStudent.photo}
                    alt={currentStudent.name}
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-white/20 shadow-md"
                  />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                      Enrolled Student Portal
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black font-heading mt-0.5">
                      Welcome, {currentStudent.name}!
                    </h1>
                    <p className="text-xs text-blue-100 mt-1">
                      {currentStudent.courseName} • Roll: {currentStudent.rollNo} • ID: {currentStudent.studentId}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
                    icon={Printer}
                    onClick={() => setActiveIdCard(currentStudent)}
                  >
                    View Student ID Card
                  </Button>
                  {currentStudent.dueFee > 0 && (
                    <Button
                      variant="success"
                      size="sm"
                      icon={CreditCard}
                      onClick={() => setUpiPayModalOpen(true)}
                      className="text-xs font-bold"
                    >
                      Pay Due Fee (₹{currentStudent.dueFee})
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-5">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Attendance</span>
                  <Calendar className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 font-heading">
                  {myAttendancePct}%
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  {myAttendancePct >= 75 ? 'Qualified for Exams' : 'Low Attendance Alert'}
                </span>
              </Card>

              <Card className="p-5">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Tuition Due</span>
                  <CreditCard className="w-4 h-4 text-amber-500" />
                </div>
                <div
                  className={`text-2xl font-black font-heading ${
                    currentStudent.dueFee > 0 ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  ₹{currentStudent.dueFee}
                </div>
                <span className="text-[11px] text-slate-400">
                  {currentStudent.dueFee > 0 ? 'Payment pending' : 'All fees cleared'}
                </span>
              </Card>

              <Card className="p-5">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Course Progress</span>
                  <Laptop className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 font-heading">78%</div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-blue-600 h-full w-[78%] rounded-full" />
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Certifications</span>
                  <Award className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 font-heading">
                  {myCertificate ? '1 Verified' : 'In Progress'}
                </div>
                <span className="text-[11px] text-blue-600 font-medium">
                  {myCertificate ? 'Ready for Download' : 'Awaiting Final Exam'}
                </span>
              </Card>
            </div>

            {/* Batch & Lab Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6 lg:col-span-2 space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Your Enrolled Schedule & Lab Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <p className="text-slate-400 text-[11px]">Enrolled Course</p>
                    <p className="font-bold text-slate-900 text-sm">{currentStudent.courseName}</p>
                    <p className="text-slate-600">Batch: {currentStudent.batchName}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <p className="text-slate-400 text-[11px]">Assigned Lab & Trainer</p>
                    <p className="font-bold text-slate-900 text-sm">Lab 1 (Practical Workstation)</p>
                    <p className="text-slate-600">Faculty: B. Maji (Lead Faculty)</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-slate-800">
                      Standard Batch Timings: 08:00 AM - 10:00 AM (Mon, Wed, Fri)
                    </span>
                  </div>
                  <Badge variant="primary" size="sm">Active Session</Badge>
                </div>
              </Card>

              {/* Latest Important Notice */}
              <Card className="p-6 space-y-3">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span>Important Notices</span>
                </h3>
                {notices.slice(0, 2).map((n) => (
                  <div key={n.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <span className="font-bold text-slate-900 block mb-1">{n.title}</span>
                    <p className="text-slate-500 text-[11px] line-clamp-2">{n.content}</p>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setStudentTab('notices')}
                >
                  View All Notices
                </Button>
              </Card>
            </div>
          </div>
        )}

        {/* ===================== TAB: PROFILE & ID CARD ===================== */}
        {studentTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6 text-center space-y-4">
              <img
                src={currentStudent.photo}
                alt={currentStudent.name}
                className="w-28 h-28 rounded-3xl object-cover mx-auto border-4 border-slate-100 shadow-md"
              />
              <div>
                <h3 className="text-lg font-black text-slate-900 font-heading">
                  {currentStudent.name}
                </h3>
                <p className="text-xs text-blue-700 font-bold">{currentStudent.courseName}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Registration: {currentStudent.registrationNo}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Button
                  variant="primary"
                  size="md"
                  icon={Printer}
                  className="w-full text-xs"
                  onClick={() => setActiveIdCard(currentStudent)}
                >
                  Generate Official Student ID Card
                </Button>
              </div>
            </Card>

            <Card className="p-6 lg:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Registered Academic & Personal Records
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Father / Guardian Name:</span>
                  <span className="font-bold text-slate-800">{currentStudent.fatherName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Date of Birth / Gender:</span>
                  <span className="font-bold text-slate-800">
                    {currentStudent.dob} ({currentStudent.gender})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Contact Mobile:</span>
                  <span className="font-bold text-slate-800">{currentStudent.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Email Address:</span>
                  <span className="font-bold text-slate-800">{currentStudent.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Admission Date:</span>
                  <span className="font-bold text-slate-800">{currentStudent.admissionDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Academic Roll No:</span>
                  <span className="font-bold text-slate-800">{currentStudent.rollNo}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block text-[11px]">Permanent Address:</span>
                  <span className="font-bold text-slate-800">{currentStudent.address}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ===================== TAB: ATTENDANCE ===================== */}
        {studentTab === 'attendance' && (
          <Card className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Lab Attendance Journal</h3>
                <p className="text-xs text-slate-500">
                  Recorded daily via student QR barcode ID scanning at RJ TECH lab entrance.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-600">
                  Overall Ratio: <strong className="text-blue-700">{myAttendancePct}%</strong>
                </span>
                <Badge variant={myAttendancePct >= 75 ? 'success' : 'danger'}>
                  {myAttendancePct >= 75 ? 'Eligible for Exams' : 'Attendance Below 75%'}
                </Badge>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Time Recorded</th>
                    <th className="py-2.5 px-4">Batch</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myAttendance.length > 0 ? (
                    myAttendance.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                          {rec.date}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{rec.time}</td>
                        <td className="py-3 px-4 text-slate-600">{currentStudent.batchName}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={rec.status === 'Present' ? 'success' : 'danger'}
                            size="sm"
                          >
                            {rec.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400">
                        No previous attendance records on file for this session.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ===================== TAB: FEES & RECEIPTS ===================== */}
        {studentTab === 'fees' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-5">
                <span className="text-slate-400 block text-xs font-semibold">Total Program Fee</span>
                <span className="text-2xl font-black text-slate-900">₹{currentStudent.finalFee}</span>
              </Card>
              <Card className="p-5">
                <span className="text-slate-400 block text-xs font-semibold">Total Deposited</span>
                <span className="text-2xl font-black text-emerald-600">₹{currentStudent.paidFee}</span>
              </Card>
              <Card className="p-5 flex flex-col justify-between">
                <div>
                  <span className="text-slate-400 block text-xs font-semibold">Outstanding Due</span>
                  <span className="text-2xl font-black text-rose-600">₹{currentStudent.dueFee}</span>
                </div>
                {currentStudent.dueFee > 0 && (
                  <Button
                    variant="success"
                    size="sm"
                    className="mt-3 text-xs"
                    onClick={() => setUpiPayModalOpen(true)}
                  >
                    Pay Online via UPI QR
                  </Button>
                )}
              </Card>
            </div>

            <Card className="overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Official Payment Receipts</h3>
                <Badge variant="primary">{myPayments.length} Receipts</Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Receipt No</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Remarks</th>
                      <th className="py-3 px-4">Mode</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">{p.receiptNo}</td>
                        <td className="py-3 px-4 text-slate-500">{p.date}</td>
                        <td className="py-3 px-4 text-slate-700">{p.remarks}</td>
                        <td className="py-3 px-4 text-slate-600">{p.mode}</td>
                        <td className="py-3 px-4 font-black text-emerald-600">₹{p.amount}</td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            icon={Download}
                            onClick={() => setActiveReceipt(p)}
                            className="text-[11px] py-1 px-2.5"
                          >
                            Print Receipt
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ===================== TAB: EXAMS & RESULTS ===================== */}
        {studentTab === 'exams' && (
          <Card className="p-6 space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Examination Results & Performance</h3>
              <p className="text-xs text-slate-500">Official scored marksheets for semester tests</p>
            </div>

            <div className="space-y-4">
              {myResults.length > 0 ? (
                myResults.map((r) => (
                  <div
                    key={r.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="primary" size="sm">Score: {r.percentage}%</Badge>
                        <Badge variant="success" size="sm">Grade {r.grade}</Badge>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">{r.examTitle}</h4>
                      <p className="text-xs text-slate-500">
                        Theory: {r.theoryMarks} | Practical: {r.practicalMarks} | Viva: {r.vivaMarks}
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      icon={Printer}
                      onClick={() => setActiveResultModal(r)}
                    >
                      View & Print Marksheet
                    </Button>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Your upcoming exam schedule will appear here. No past semester results on file.
                </div>
              )}
            </div>
          </Card>
        )}

        {/* ===================== TAB: CERTIFICATE ===================== */}
        {studentTab === 'certificate' && (
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Certificate of Completion</h3>
              <p className="text-xs text-slate-500">
                Government-compliant certificate with tamper-proof QR code verification
              </p>
            </div>

            {myCertificate ? (
              <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-700" />
                    <span className="font-mono text-xs font-bold text-amber-900">
                      {myCertificate.certificateNo}
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900">
                    Official Diploma in {myCertificate.courseName}
                  </h4>
                  <p className="text-xs text-slate-600">
                    Issued on {myCertificate.issueDate} • Final Grade: <strong>{myCertificate.grade}</strong>
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  icon={Printer}
                  onClick={() => setActiveCertificate(myCertificate)}
                >
                  Open Official Certificate
                </Button>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                <Award className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-600">
                  Certificate will be available after course completion and exam clearance.
                </p>
                <p className="text-[11px] text-slate-400">
                  Maintain at least 75% attendance and complete your final project evaluation.
                </p>
              </div>
            )}
          </Card>
        )}

        {/* ===================== TAB: STUDY NOTES ===================== */}
        {studentTab === 'materials' && (
          <Card className="p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Course Materials & Downloads</h3>
              <p className="text-xs text-slate-500">
                Download PDF guides, keyboard shortcuts, and lab practice files
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studyMaterials.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <Badge variant="secondary" size="sm">{m.type}</Badge>
                      <span className="text-[11px] font-mono text-slate-400">{m.size}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{m.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{m.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">{m.uploadDate}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      icon={Download}
                      onClick={() => alert(`Downloading ${m.title}`)}
                      className="text-xs py-1"
                    >
                      Download PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ===================== TAB: NOTICE BOARD ===================== */}
        {studentTab === 'notices' && (
          <div className="space-y-4">
            {notices.map((n) => (
              <Card key={n.id} className="p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={n.type === 'Holiday' ? 'danger' : 'primary'} size="sm">
                      {n.type}
                    </Badge>
                    {n.isImportant && (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        Urgent
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{n.date}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{n.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* UPI Payment Modal */}
      {upiPayModalOpen && (
        <Modal
          isOpen={upiPayModalOpen}
          onClose={() => setUpiPayModalOpen(false)}
          title="Online UPI Fee Payment - RJ TECH"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs text-center">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block mx-auto">
              {/* QR Code Graphic */}
              <div className="w-48 h-48 bg-white p-2 border-2 border-slate-800 rounded-xl mx-auto flex flex-col items-center justify-center">
                <QrCode className="w-36 h-36 text-slate-900" />
                <span className="text-[10px] font-mono font-bold text-blue-700">Scan to Pay via UPI</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-slate-900 text-sm">UPI ID: 9635302734@okaxis</p>
              <p className="text-slate-500">Payee Name: RJ TECH DIGITAL EDUCATION</p>
              <p className="text-emerald-700 font-bold text-sm">
                Due Amount: ₹{currentStudent.dueFee}
              </p>
            </div>

            <div className="p-3 bg-blue-50 text-blue-900 rounded-xl text-[11px] text-left leading-relaxed">
              <strong>Instructions:</strong> After completing the UPI transfer on GPay, PhonePe, or Paytm, please WhatsApp your payment screenshot to <strong>9635302734</strong> with your Roll No (<strong>{currentStudent.rollNo}</strong>) to receive your digital receipt.
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => setUpiPayModalOpen(false)}
            >
              Done / Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
