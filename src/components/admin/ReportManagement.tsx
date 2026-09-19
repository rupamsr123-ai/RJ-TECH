import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Users,
  CreditCard,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button, Card, Badge } from '../common/UIComponents';

export const ReportManagement: React.FC<{
  initialTab?: 'report_students' | 'report_fees' | 'report_attendance' | 'report_finance';
}> = ({ initialTab = 'report_students' }) => {
  const {
    students,
    courses,
    payments,
    expenses,
    attendanceRecords,
    settings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'report_students' | 'report_fees' | 'report_attendance' | 'report_finance'
  >(initialTab);

  // Print Report helper
  const handlePrint = () => {
    window.print();
  };

  // Calculations
  const totalIncome = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalExpense = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalDue = students.reduce((acc, s) => acc + s.dueFee, 0);

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
            Institute Analytics & Audit Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional summaries, financial balance sheets, and audit registers for RJ TECH.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('report_students')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'report_students' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setActiveTab('report_fees')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'report_fees' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
              }`}
            >
              Fees & Dues
            </button>
            <button
              onClick={() => setActiveTab('report_attendance')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'report_attendance' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
              }`}
            >
              Attendance
            </button>
            <button
              onClick={() => setActiveTab('report_finance')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'report_finance' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
              }`}
            >
              Balance Sheet
            </button>
          </div>

          <Button variant="outline" size="sm" icon={Printer} onClick={handlePrint}>
            Print Report
          </Button>
        </div>
      </div>

      {/* ===================== TAB 1: STUDENT & ADMISSION REPORT ===================== */}
      {activeTab === 'report_students' && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Enrollment Register</h3>
              <p className="text-xs text-slate-500">Session {settings.currentSession} Breakdown</p>
            </div>
            <Badge variant="primary">{students.length} Total Enrolled</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {courses.map((c) => {
              const enrolled = students.filter((s) => s.courseId === c.id).length;
              return (
                <div key={c.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="font-bold text-slate-800 block text-sm">{c.code}</span>
                  <span className="text-slate-500 text-xs">{c.name}</span>
                  <div className="mt-2 text-xl font-black text-blue-700">{enrolled} Students</div>
                </div>
              );
            })}
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Reg No</th>
                  <th className="py-2.5 px-4">Student Name</th>
                  <th className="py-2.5 px-4">Phone</th>
                  <th className="py-2.5 px-4">Course</th>
                  <th className="py-2.5 px-4">Batch</th>
                  <th className="py-2.5 px-4">Admission Date</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-700">
                      {st.registrationNo}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{st.name}</td>
                    <td className="py-2.5 px-4 text-slate-600">{st.phone}</td>
                    <td className="py-2.5 px-4 text-slate-800 font-medium">{st.courseName}</td>
                    <td className="py-2.5 px-4 text-slate-500">{st.batchName}</td>
                    <td className="py-2.5 px-4 text-slate-500">{st.admissionDate}</td>
                    <td className="py-2.5 px-4">
                      <Badge variant="success" size="sm">{st.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ===================== TAB 2: FEES & DUE REPORT ===================== */}
      {activeTab === 'report_fees' && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Tuition Revenue & Due Analysis</h3>
              <p className="text-xs text-slate-500">Comprehensive collection metrics</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="success">Collected: ₹{totalIncome.toLocaleString('en-IN')}</Badge>
              <Badge variant="danger">Pending Due: ₹{totalDue.toLocaleString('en-IN')}</Badge>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4">Course</th>
                  <th className="py-2.5 px-4">Total Tuition</th>
                  <th className="py-2.5 px-4">Paid So Far</th>
                  <th className="py-2.5 px-4">Outstanding Due</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4">
                      <p className="font-bold text-slate-900">{st.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{st.studentId}</p>
                    </td>
                    <td className="py-2.5 px-4 text-slate-700">{st.courseName}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-800">₹{st.finalFee}</td>
                    <td className="py-2.5 px-4 font-bold text-emerald-600">₹{st.paidFee}</td>
                    <td className="py-2.5 px-4 font-black text-rose-600">₹{st.dueFee}</td>
                    <td className="py-2.5 px-4">
                      <Badge
                        variant={st.dueFee <= 0 ? 'success' : 'warning'}
                        size="sm"
                      >
                        {st.dueFee <= 0 ? 'Fully Paid' : 'Pending Installment'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ===================== TAB 3: ATTENDANCE REPORT ===================== */}
      {activeTab === 'report_attendance' && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Attendance Audit Register</h3>
              <p className="text-xs text-slate-500">
                Compliance list: Minimum 75% attendance mandatory for diploma eligibility
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4">Course & Batch</th>
                  <th className="py-2.5 px-4">Attendance Percentage</th>
                  <th className="py-2.5 px-4">Exam Qualification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => {
                  const records = attendanceRecords.filter((a) => a.studentId === st.id);
                  const present = records.filter((a) => a.status === 'Present').length;
                  const rate = records.length > 0 ? Math.round((present / records.length) * 100) : 95;
                  const qualified = rate >= 75;

                  return (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-slate-900">{st.name}</td>
                      <td className="py-2.5 px-4 text-slate-600">
                        {st.courseName} ({st.batchName})
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold">
                        <span className={qualified ? 'text-emerald-700' : 'text-rose-600'}>
                          {rate}%
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <Badge variant={qualified ? 'success' : 'danger'} size="sm">
                          {qualified ? 'Qualified for Exam' : 'Disqualified (Below 75%)'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ===================== TAB 4: FINANCIAL BALANCE SHEET ===================== */}
      {activeTab === 'report_finance' && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4 text-center">
            <h2 className="text-xl font-black text-slate-900 font-heading">
              RJ TECH - FINANCIAL STATEMENT & BALANCE SHEET
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {settings.address} • Mobile: {settings.mobile}
            </p>
            <p className="text-xs font-bold text-blue-700 mt-0.5">
              Academic Session: {settings.currentSession}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Income Side */}
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
              <h4 className="font-bold text-emerald-900 text-sm flex items-center justify-between">
                <span>INCOME LEDGER (A)</span>
                <span className="font-mono">₹{totalIncome.toLocaleString('en-IN')}</span>
              </h4>
              <div className="space-y-1.5 divide-y divide-emerald-100">
                <div className="flex justify-between pt-1">
                  <span className="text-slate-600">Course Tuition Fees ({payments.length} receipts)</span>
                  <span className="font-bold text-slate-900">₹{totalIncome}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-600">Admission Registration Charges</span>
                  <span className="font-bold text-slate-900">Included</span>
                </div>
              </div>
            </div>

            {/* Expense Side */}
            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-3">
              <h4 className="font-bold text-rose-900 text-sm flex items-center justify-between">
                <span>EXPENDITURE LEDGER (B)</span>
                <span className="font-mono">₹{totalExpense.toLocaleString('en-IN')}</span>
              </h4>
              <div className="space-y-1.5 divide-y divide-rose-100">
                {expenses.map((exp) => (
                  <div key={exp.id} className="flex justify-between pt-1">
                    <span className="text-slate-600">{exp.title} ({exp.category})</span>
                    <span className="font-bold text-slate-900">₹{exp.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Net Surplus Card */}
          <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-blue-900 block text-sm">
                NET OPERATIONAL SURPLUS (A - B)
              </span>
              <span className="text-slate-600">Total surplus generated after operational costs</span>
            </div>
            <div className="text-2xl font-black text-blue-700 font-heading">
              ₹{(totalIncome - totalExpense).toLocaleString('en-IN')}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
