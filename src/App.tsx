import React, { useState } from 'react';
import {
  Printer,
  Download,
  Share2,
  Copy,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  Award,
  QrCode,
  FileCheck,
  X,
  Phone,
} from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { PublicWebsite } from './components/public/PublicWebsite';
import { PublicLogin } from './components/public/PublicLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentManagement } from './components/admin/StudentManagement';
import { AcademicManagement } from './components/admin/AcademicManagement';
import { AttendanceManagement } from './components/admin/AttendanceManagement';
import { FeesManagement } from './components/admin/FeesManagement';
import { ExamAndCertificates } from './components/admin/ExamAndCertificates';
import { CommunicationAndFinance } from './components/admin/CommunicationAndFinance';
import { StaffAndSettings } from './components/admin/StaffAndSettings';
import { ReportManagement } from './components/admin/ReportManagement';
import { StudentPortal } from './components/student/StudentPortal';
import { Button, Modal } from './components/common/UIComponents';

const AppContent: React.FC = () => {
  const {
    activeView,
    setActiveView,
    activeSubView,
    setActiveSubView,
    currentRole,
    settings,
    activeReceipt,
    setActiveReceipt,
    activeIdCard,
    setActiveIdCard,
    activeCertificate,
    setActiveCertificate,
    activeResultModal,
    setActiveResultModal,
    whatsAppDialog,
    setWhatsAppDialog,
  } = useApp();

  const [copiedMessage, setCopiedMessage] = useState(false);

  // Render appropriate admin sub-views based on activeSubView
  const renderAdminContent = () => {
    switch (activeSubView) {
      case 'dashboard':
        return <AdminDashboard />;

      // Student / Admissions
      case 'admission_enquiry':
        return <StudentManagement initialTab="enquiries" />;
      case 'online_admission_admin':
        return <StudentManagement initialTab="enquiries" />;
      case 'add_student':
        return <StudentManagement initialTab="admit" />;
      case 'student_list':
        return <StudentManagement initialTab="students" />;

      // Academic
      case 'courses':
        return <AcademicManagement initialTab="courses" />;
      case 'batches':
        return <AcademicManagement initialTab="batches" />;
      case 'schedule':
        return <AcademicManagement initialTab="schedule" />;
      case 'study_materials':
        return <AcademicManagement initialTab="study_materials" />;

      // Attendance
      case 'attendance_qr':
        return <AttendanceManagement initialTab="qr" />;
      case 'attendance_manual':
        return <AttendanceManagement initialTab="manual" />;
      case 'attendance_report':
        return <AttendanceManagement initialTab="report" />;

      // Fees & Accounts
      case 'fees_structure':
        return <FeesManagement initialTab="structure" />;
      case 'collect_fees':
        return <FeesManagement initialTab="collect" />;
      case 'due_fees':
        return <FeesManagement initialTab="due" />;
      case 'payment_history':
        return <FeesManagement initialTab="history" />;
      case 'income_expense':
        return <CommunicationAndFinance initialTab="finance" />;

      // Examination
      case 'exams':
        return <ExamAndCertificates initialTab="exams" />;
      case 'marks_entry':
        return <ExamAndCertificates initialTab="marks" />;
      case 'results':
        return <ExamAndCertificates initialTab="results" />;

      // Certificates & IDs
      case 'id_cards':
        return <ExamAndCertificates initialTab="id_cards" />;
      case 'certificates':
        return <ExamAndCertificates initialTab="certificates" />;
      case 'certificate_verify':
        return <ExamAndCertificates initialTab="verify" />;

      // Communication
      case 'notices':
        return <CommunicationAndFinance initialTab="notices" />;
      case 'whatsapp_center':
        return <CommunicationAndFinance initialTab="whatsapp" />;
      case 'referrals':
        return <CommunicationAndFinance initialTab="referrals" />;

      // Reports
      case 'report_students':
        return <ReportManagement initialTab="report_students" />;
      case 'report_fees':
        return <ReportManagement initialTab="report_fees" />;
      case 'report_attendance':
        return <ReportManagement initialTab="report_attendance" />;
      case 'report_finance':
        return <ReportManagement initialTab="report_finance" />;

      // Staff & Settings
      case 'staff':
        return <StaffAndSettings initialTab="staff" />;
      case 'settings':
        return <StaffAndSettings initialTab="settings" />;

      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-slate-800 antialiased font-sans">
      {/* Primary Route Selector */}
      {activeView === 'public' || activeView === 'public_home' ? (
        <PublicWebsite />
      ) : activeView === 'login' ? (
        <PublicLogin />
      ) : activeView === 'student' ? (
        <StudentPortal />
      ) : activeView === 'admin' ? (
        <AdminLayout activeSubView={activeSubView} setActiveSubView={setActiveSubView}>
          {renderAdminContent()}
        </AdminLayout>
      ) : (
        <PublicWebsite />
      )}

      {/* ===================== MODAL 1: OFFICIAL FEE RECEIPT ===================== */}
      {activeReceipt && (
        <Modal
          isOpen={Boolean(activeReceipt)}
          onClose={() => setActiveReceipt(null)}
          title="Official Fee Payment Receipt"
          maxWidth="lg"
        >
          <div className="space-y-6">
            {/* Printable Receipt Container */}
            <div
              id="printable-receipt"
              className="p-8 bg-white border-2 border-slate-300 rounded-2xl shadow-xs space-y-6 text-slate-800 print:border-none print:shadow-none print:p-0"
            >
              {/* Receipt Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-300 bg-white p-0.5 shrink-0 shadow-xs">
                    <img
                      src={settings.logoUrl || '/rj_tech_logo.jpg'}
                      alt="RJ TECH Logo"
                      className="w-full h-full object-contain rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black font-heading tracking-tight text-blue-700">
                      RJ TECH
                    </h2>
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-0.5">
                      {settings.tagline}
                    </p>
                    <p className="text-[11px] text-slate-500 max-w-sm mt-1">
                      {settings.address}
                    </p>
                    <p className="text-[11px] text-slate-600 font-semibold mt-0.5">
                      Helpline: {settings.mobile} • Email: {settings.email}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-800 text-xs font-mono font-bold rounded-lg uppercase tracking-wider mb-2 border border-slate-200">
                    MONEY RECEIPT
                  </span>
                  <p className="text-xs font-mono font-bold text-slate-900">
                    Receipt No: <span className="text-blue-700">{activeReceipt.receiptNo}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Date: {activeReceipt.date}</p>
                </div>
              </div>

              {/* Student & Payment Breakdown */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">Received with thanks from:</span>
                  <span className="font-bold text-slate-900 text-sm">{activeReceipt.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Enrolled Course:</span>
                  <span className="font-bold text-slate-900">{activeReceipt.courseName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Payment Mode:</span>
                  <span className="font-semibold text-slate-800">{activeReceipt.mode}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Purpose / Description:</span>
                  <span className="font-semibold text-slate-800">{activeReceipt.remarks}</span>
                </div>
              </div>

              {/* Big Amount Row */}
              <div className="flex items-center justify-between p-4 bg-blue-50/70 border border-blue-200 rounded-xl">
                <div>
                  <span className="text-xs text-blue-900 font-semibold block">Total Amount Received:</span>
                  <span className="text-xs text-slate-500 italic">
                    (Rupees {activeReceipt.amount} Only)
                  </span>
                </div>
                <div className="text-2xl font-black text-blue-700 font-heading">
                  ₹{activeReceipt.amount.toLocaleString('en-IN')}/-
                </div>
              </div>

              {/* Seal & Signatures */}
              <div className="pt-8 flex items-end justify-between text-xs text-slate-500">
                <div className="text-center">
                  <div className="w-24 h-12 mx-auto border-b border-dashed border-slate-400 flex items-center justify-center font-serif text-[11px] text-slate-400 italic">
                    RJ TECH Seal
                  </div>
                  <span className="mt-1 block text-[11px]">Institute Stamp</span>
                </div>

                <div className="text-center">
                  <div className="w-36 h-12 mx-auto border-b border-dashed border-slate-400 flex items-center justify-center font-serif text-xs text-slate-700 italic">
                    B. Maji
                  </div>
                  <span className="mt-1 block text-[11px] font-semibold text-slate-800">
                    Authorized Signatory
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                System generated official receipt • Non-transferable
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveReceipt(null)}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Printer}
                  onClick={() => window.print()}
                >
                  Print Receipt
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ===================== MODAL 2: STUDENT ID CARD ===================== */}
      {activeIdCard && (
        <Modal
          isOpen={Boolean(activeIdCard)}
          onClose={() => setActiveIdCard(null)}
          title="Student Identity Card Preview"
          maxWidth="md"
        >
          <div className="space-y-6">
            <div className="flex justify-center p-4 bg-slate-100 rounded-2xl">
              {/* Vertical Laminated Card Frame */}
              <div className="w-72 bg-white rounded-3xl border-2 border-slate-300 shadow-xl overflow-hidden flex flex-col justify-between text-slate-800">
                {/* ID Header */}
                <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 p-3 text-center text-white flex items-center justify-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white p-0.5 overflow-hidden shrink-0 shadow-sm flex items-center justify-center">
                    <img
                      src={settings.logoUrl || '/rj_tech_logo.jpg'}
                      alt="RJ TECH Logo"
                      className="w-full h-full object-contain rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="font-black text-base font-heading tracking-tight leading-none">
                      RJ TECH
                    </h3>
                    <p className="text-[8px] font-semibold uppercase tracking-wider text-blue-100 mt-0.5">
                      Computer Training Center
                    </p>
                    <p className="text-[7.5px] text-blue-200">HURINAN, JOYBALARAMPUR, TAMLUK</p>
                  </div>
                </div>

                {/* Body & Photo */}
                <div className="p-4 text-center space-y-3">
                  <div className="relative inline-block">
                    <img
                      src={activeIdCard.photo}
                      alt={activeIdCard.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-600 shadow-sm mx-auto"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-0.5 border border-white">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                      {activeIdCard.name}
                    </h4>
                    <p className="text-[11px] font-bold text-blue-700 mt-0.5">
                      {activeIdCard.courseName}
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-left text-[10px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Student ID:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {activeIdCard.studentId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Roll Number:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {activeIdCard.rollNo}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Batch Time:</span>
                      <span className="font-semibold text-slate-800">
                        {activeIdCard.batchName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Emergency Mobile:</span>
                      <span className="font-semibold text-slate-800">{activeIdCard.phone}</span>
                    </div>
                  </div>

                  {/* Barcode / QR Section */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <div className="text-left">
                      <QrCode className="w-8 h-8 text-slate-700" />
                      <span className="text-[8px] font-mono text-slate-400">SCAN VERIFY</span>
                    </div>

                    <div className="text-right">
                      <div className="w-16 border-b border-slate-400 pb-0.5 font-serif text-[9px] italic text-slate-600">
                        Director
                      </div>
                      <span className="text-[8px] text-slate-400">RJ TECH Signature</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Strip */}
                <div className="bg-slate-900 text-slate-300 text-[8px] py-1 text-center font-medium">
                  Valid for Academic Session {settings.currentSession} • Ph: 9635302734
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setActiveIdCard(null)}>
                Close
              </Button>
              <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>
                Print Identity Card
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ===================== MODAL 3: OFFICIAL CERTIFICATE ===================== */}
      {activeCertificate && (
        <Modal
          isOpen={Boolean(activeCertificate)}
          onClose={() => setActiveCertificate(null)}
          title="Official Diploma Certificate"
          maxWidth="xl"
        >
          <div className="space-y-6">
            {/* Certificate Canvas */}
            <div className="p-8 sm:p-12 bg-[#FFFDF9] border-[10px] border-double border-[#D4AF37] rounded-3xl shadow-2xl relative text-center text-slate-800 space-y-6 overflow-hidden">
              {/* Watermark Logo */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <span className="text-9xl font-black font-heading">RJ TECH</span>
              </div>

              {/* Certificate Header */}
              <div className="space-y-1">
                <div className="w-20 h-20 rounded-2xl border-2 border-[#D4AF37] bg-white p-1 overflow-hidden shadow-md mx-auto mb-3 flex items-center justify-center">
                  <img
                    src={settings.logoUrl || '/rj_tech_logo.jpg'}
                    alt="RJ TECH Logo"
                    className="w-full h-full object-contain rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h1 className="text-3xl sm:text-4xl font-black font-heading tracking-tight text-slate-900">
                  RJ TECH
                </h1>
                <p className="text-xs sm:text-sm font-bold text-[#996515] uppercase tracking-widest">
                  Computer Training & Digital Education Center
                </p>
                <p className="text-[11px] text-slate-500">
                  HURINAN, JOYBALARAMPUR, TAMLUK, PURBA MEDINIPUR, WEST BENGAL - 721137
                </p>
                <p className="text-[10px] font-mono text-slate-400">
                  Govt. Registered & ISO 9001:2015 Certified Educational Institution
                </p>
              </div>

              <div className="py-2">
                <span className="inline-block px-6 py-1.5 bg-[#FFF9E6] border-2 border-[#D4AF37] text-[#996515] font-serif text-base sm:text-lg font-bold rounded-full tracking-widest uppercase shadow-xs">
                  CERTIFICATE OF COMPLETION
                </span>
              </div>

              {/* Certificate Award Body Text */}
              <div className="max-w-xl mx-auto space-y-3 font-serif text-slate-700 text-sm sm:text-base leading-relaxed">
                <p className="text-xs text-slate-500 italic">This is proudly awarded to</p>
                <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 underline decoration-[#D4AF37] underline-offset-8">
                  {activeCertificate.studentName}
                </h3>
                <p className="pt-2 text-xs sm:text-sm">
                  Registration No: <strong className="font-mono text-slate-900">{activeCertificate.registrationNo}</strong>
                </p>
                <p className="text-xs sm:text-sm">
                  having successfully completed the prescribed curriculum and practical examinations for
                </p>
                <h4 className="text-lg sm:text-xl font-bold font-heading text-blue-900">
                  {activeCertificate.courseName}
                </h4>
                <p className="text-xs text-slate-600">
                  Duration: <strong>{activeCertificate.duration}</strong> • Performance Grade: <strong className="text-emerald-700 text-base">Grade {activeCertificate.grade}</strong>
                </p>
              </div>

              {/* Certificate Footer with Verification QR & Signatures */}
              <div className="pt-8 border-t border-amber-200/80 flex items-end justify-between text-xs">
                <div className="text-left space-y-1">
                  <QrCode className="w-14 h-14 text-slate-800" />
                  <p className="text-[9px] font-mono font-bold text-[#996515]">
                    {activeCertificate.certificateNo}
                  </p>
                  <p className="text-[9px] text-slate-400">Verify: rjtech.edu/verify</p>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-20 h-20 rounded-full border-2 border-amber-600/40 mx-auto flex items-center justify-center text-[10px] font-serif text-amber-900 font-bold uppercase p-1 leading-tight">
                    Official Gold Seal
                  </div>
                  <p className="text-[10px] text-slate-400">Issue Date: {activeCertificate.issueDate}</p>
                </div>

                <div className="text-right space-y-1">
                  <div className="w-32 border-b-2 border-slate-700 pb-1 font-serif text-sm italic font-bold text-slate-900">
                    B. Maji
                  </div>
                  <p className="text-[11px] font-bold text-slate-800">Director / Head</p>
                  <p className="text-[9px] text-slate-500">RJ TECH Center</p>
                </div>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 font-mono">
                Certificate ID: {activeCertificate.certificateNo}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setActiveCertificate(null)}>
                  Close
                </Button>
                <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>
                  Print Certificate
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ===================== MODAL 4: MARKSHEET ===================== */}
      {activeResultModal && (
        <Modal
          isOpen={Boolean(activeResultModal)}
          onClose={() => setActiveResultModal(null)}
          title="Official Marksheet & Academic Report"
          maxWidth="lg"
        >
          <div className="space-y-6">
            <div className="p-8 bg-white border-2 border-slate-300 rounded-2xl space-y-6 text-slate-800">
              <div className="text-center border-b border-slate-200 pb-4 space-y-1">
                <div className="w-14 h-14 rounded-xl border border-slate-300 bg-white p-0.5 overflow-hidden shadow-xs mx-auto mb-2 flex items-center justify-center">
                  <img
                    src={settings.logoUrl || '/rj_tech_logo.jpg'}
                    alt="RJ TECH Logo"
                    className="w-full h-full object-contain rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h2 className="text-2xl font-black text-slate-900 font-heading">RJ TECH</h2>
                <p className="text-xs font-bold text-blue-700 uppercase">
                  Examination & Academic Assessment Cell
                </p>
                <p className="text-[11px] text-slate-500">
                  {settings.address} • Mobile: {settings.mobile}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">Candidate Name:</span>
                  <span className="font-bold text-slate-900 text-sm">{activeResultModal.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Exam / Semester:</span>
                  <span className="font-bold text-slate-900">{activeResultModal.examTitle}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Roll No / Registration:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {activeResultModal.rollNo} / {activeResultModal.registrationNo}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Course Name:</span>
                  <span className="font-semibold text-slate-800">{activeResultModal.courseName}</span>
                </div>
              </div>

              {/* Marks Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Evaluation Module</th>
                      <th className="py-2.5 px-4 text-center">Max Marks</th>
                      <th className="py-2.5 px-4 text-center">Marks Obtained</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2.5 px-4 font-semibold">Theory & Objective Test</td>
                      <td className="py-2.5 px-4 text-center">50</td>
                      <td className="py-2.5 px-4 text-center font-bold text-slate-900">
                        {activeResultModal.theoryMarks}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold">Practical Lab Examination</td>
                      <td className="py-2.5 px-4 text-center">40</td>
                      <td className="py-2.5 px-4 text-center font-bold text-slate-900">
                        {activeResultModal.practicalMarks}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold">Viva Voce & Project Presentation</td>
                      <td className="py-2.5 px-4 text-center">10</td>
                      <td className="py-2.5 px-4 text-center font-bold text-slate-900">
                        {activeResultModal.vivaMarks}
                      </td>
                    </tr>
                    <tr className="bg-blue-50/60 font-bold text-slate-900">
                      <td className="py-3 px-4">GRAND TOTAL</td>
                      <td className="py-3 px-4 text-center">{activeResultModal.totalMarks}</td>
                      <td className="py-3 px-4 text-center text-blue-700 text-sm">
                        {activeResultModal.obtainedMarks}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Result Summary Banner */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500">Aggregate Percentage:</span>
                  <span className="font-bold text-slate-900 ml-1 text-sm">
                    {activeResultModal.percentage}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Awarded Grade:</span>
                  <span className="font-bold text-blue-700 ml-1 text-sm">
                    Grade {activeResultModal.grade}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Final Result:</span>
                  <span className="font-bold text-emerald-600 ml-1 text-sm">
                    {activeResultModal.status}
                  </span>
                </div>
              </div>

              <div className="pt-6 flex justify-between items-end text-xs text-slate-500">
                <span>Date of Declaration: {activeResultModal.date}</span>
                <div className="text-center">
                  <div className="w-32 border-b border-slate-400 pb-1 italic">Controller of Exams</div>
                  <span className="text-[10px]">RJ TECH</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setActiveResultModal(null)}>
                Close
              </Button>
              <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>
                Print Marksheet
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ===================== MODAL 5: WHATSAPP DISPATCHER ===================== */}
      {whatsAppDialog && (
        <Modal
          isOpen={whatsAppDialog.isOpen}
          onClose={() => setWhatsAppDialog(null)}
          title={whatsAppDialog.title || 'WhatsApp Message Dispatcher'}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-900">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-700" />
                <span className="font-bold">Recipient Mobile: +91 {whatsAppDialog.phone}</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                Official RJ TECH
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Formatted WhatsApp Message Content:
              </label>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-sans text-xs whitespace-pre-line leading-relaxed text-slate-800 max-h-56 overflow-y-auto">
                {whatsAppDialog.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(whatsAppDialog.message);
                  setCopiedMessage(true);
                  setTimeout(() => setCopiedMessage(false), 2000);
                }}
                className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer font-medium"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedMessage ? 'Copied to Clipboard!' : 'Copy Text'}</span>
              </button>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setWhatsAppDialog(null)}>
                  Close
                </Button>
                <a
                  href={`https://wa.me/91${whatsAppDialog.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    whatsAppDialog.message
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
                >
                  <span>Open in WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
