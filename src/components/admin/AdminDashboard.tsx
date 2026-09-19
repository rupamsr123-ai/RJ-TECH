import React from 'react';
import {
  Users,
  UserCheck,
  BookOpen,
  Calendar,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  MessageSquare,
  Plus,
  CreditCard,
  QrCode,
  FileCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Phone,
  Eye,
  Receipt,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard, Card, Button, Badge } from '../common/UIComponents';

export const AdminDashboard: React.FC<{ setActiveSubView?: (view: string) => void }> = ({
  setActiveSubView = () => {},
}) => {
  const {
    students,
    courses,
    batches,
    payments,
    enquiries,
    notices,
    exams,
    schedules,
    setSelectedStudentId,
    setActiveReceipt,
  } = useApp();

  // Calculations
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'Active').length;
  const totalCourses = courses.length;
  const activeBatches = batches.filter((b) => b.status === 'Active').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayPayments = payments.filter((p) => p.date === todayStr);
  const todayCollection = todayPayments.reduce((acc, curr) => acc + curr.amount, 0);

  const totalDue = students.reduce((acc, curr) => acc + (curr.dueFee || 0), 0);
  const newEnquiriesCount = enquiries.filter((e: any) => e.status === 'Pending' || e.status === 'New').length;

  // Monthly stats mock for visual bar indicators
  const months = [
    { month: 'Oct', admissions: 12, collection: 42000 },
    { month: 'Nov', admissions: 18, collection: 58000 },
    { month: 'Dec', admissions: 14, collection: 49000 },
    { month: 'Jan', admissions: 22, collection: 72000 },
    { month: 'Feb', admissions: 28, collection: 89000 },
    { month: 'Mar', admissions: 25, collection: 84000 },
  ];
  const maxCollection = Math.max(...months.map((m) => m.collection));

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
            Institute Operational Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time metrics, student admissions, fees, and academic activity for RJ TECH.
          </p>
        </div>

        {/* 5 Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            icon={Plus}
            onClick={() => setActiveSubView('add_student')}
          >
            Add Student
          </Button>
          <Button
            size="sm"
            variant="success"
            icon={CreditCard}
            onClick={() => setActiveSubView('collect_fees')}
          >
            Collect Fees
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon={QrCode}
            onClick={() => setActiveSubView('attendance_qr')}
          >
            QR Attendance
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={BookOpen}
            onClick={() => setActiveSubView('courses')}
          >
            Courses
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={FileCheck}
            onClick={() => setActiveSubView('exams')}
          >
            Exams
          </Button>
        </div>
      </div>

      {/* 8 Metric Stat Cards as requested in prompt */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={totalStudents}
          subtitle="All-time registered"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Students"
          value={activeStudents}
          subtitle="Currently attending"
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Total Courses"
          value={totalCourses}
          subtitle="Certified programs"
          icon={BookOpen}
          color="sky"
        />
        <StatCard
          title="Active Batches"
          value={activeBatches}
          subtitle="Running batches"
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Today's Attendance"
          value="94%"
          subtitle="Lab presence rate"
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Today's Collection"
          value={`₹${todayCollection.toLocaleString('en-IN')}`}
          subtitle={`${todayPayments.length} transactions today`}
          icon={DollarSign}
          color="sky"
        />
        <StatCard
          title="Total Due Fees"
          value={`₹${totalDue.toLocaleString('en-IN')}`}
          subtitle="Pending student balance"
          icon={AlertCircle}
          color="amber"
        />
        <StatCard
          title="New Enquiries"
          value={newEnquiriesCount}
          subtitle="Awaiting callback"
          icon={MessageSquare}
          color="rose"
        />
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Monthly Fees Collection & Admission Trend */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Monthly Fees Collection & Growth</h3>
                <p className="text-xs text-slate-500">Last 6 months revenue performance (₹)</p>
              </div>
              <Badge variant="success">Growing +18%</Badge>
            </div>

            {/* Custom Bar Graph */}
            <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100">
              {months.map((m, idx) => {
                const heightPercent = Math.round((m.collection / maxCollection) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{(m.collection / 1000).toFixed(0)}k
                    </span>
                    <div className="w-full max-w-[36px] bg-blue-100 rounded-t-lg relative flex items-end overflow-hidden h-32">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-blue-600 to-sky-500 rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600">{m.month}</span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 text-center text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Average Monthly</span>
                <span className="font-bold text-slate-800 text-sm">₹65,600</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Best Month</span>
                <span className="font-bold text-blue-600 text-sm">February (₹89,000)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">New Admissions</span>
                <span className="font-bold text-emerald-600 text-sm">119 Enrolled</span>
              </div>
            </div>
          </Card>

          {/* Recent Admissions Table */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Student Admissions</h3>
                <p className="text-xs text-slate-500">Newly registered students in RJ TECH</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon={ChevronRight}
                iconPosition="right"
                onClick={() => setActiveSubView('student_list')}
              >
                All Students
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-[11px] font-semibold text-slate-400 border-b border-slate-100 pb-2">
                    <th className="py-2.5">Student</th>
                    <th className="py-2.5">Student ID</th>
                    <th className="py-2.5">Course</th>
                    <th className="py-2.5">Batch</th>
                    <th className="py-2.5">Fee Status</th>
                    <th className="py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.slice(0, 5).map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5">
                        <div className="flex items-center gap-2.5">
                          <img src={s.photo} alt={s.name} className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <span className="font-bold text-slate-900 block">{s.name}</span>
                            <span className="text-[10px] text-slate-400">{s.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 font-mono text-slate-600 font-semibold">{s.studentId}</td>
                      <td className="py-2.5 text-slate-700">{s.courseName}</td>
                      <td className="py-2.5 text-slate-500">{s.batchName}</td>
                      <td className="py-2.5">
                        <Badge
                          variant={
                            s.feesStatus === 'Paid'
                              ? 'success'
                              : s.feesStatus === 'Partial'
                              ? 'warning'
                              : 'danger'
                          }
                          size="sm"
                        >
                          {s.feesStatus}
                        </Badge>
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedStudentId(s.id);
                            setActiveSubView('student_profile');
                          }}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Recent Payment Receipts */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Payment Receipts</h3>
                <p className="text-xs text-slate-500">Latest transactions & tuition fees collected</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon={ChevronRight}
                iconPosition="right"
                onClick={() => setActiveSubView('payment_history')}
              >
                Full Ledger
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-[11px] font-semibold text-slate-400 border-b border-slate-100">
                    <th className="py-2">Receipt No</th>
                    <th className="py-2">Student</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Payment Mode</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.slice(0, 4).map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80">
                      <td className="py-2 font-mono font-bold text-blue-700">{p.receiptNo}</td>
                      <td className="py-2 font-semibold text-slate-800">{p.studentName}</td>
                      <td className="py-2 text-slate-500">{p.date}</td>
                      <td className="py-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {p.mode}
                        </span>
                      </td>
                      <td className="py-2 font-bold text-emerald-600">₹{p.amount}</td>
                      <td className="py-2 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          icon={Receipt}
                          onClick={() => setActiveReceipt(p)}
                          className="text-[11px] py-0.5 px-2"
                        >
                          Print
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Upcoming Batches, Upcoming Exams, Notices */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Class Schedule / Timetable */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Today's Class Schedule</h3>
              <Badge variant="primary" size="sm">Lab 1 & 2</Badge>
            </div>

            <div className="space-y-3 text-xs">
              {schedules.map((sch: any) => (
                <div key={sch.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-700">{sch.batchName}</span>
                    <span className="font-mono text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-500" />
                      {sch.startTime} - {sch.endTime}
                    </span>
                  </div>
                  <p className="text-slate-800 font-medium">{sch.subject}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Trainer: {sch.teacherName}</span>
                    <span className="font-semibold text-slate-600">{sch.room}</span>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => setActiveSubView('schedule')}
            >
              Manage Full Timetable
            </Button>
          </Card>

          {/* Upcoming Exams Card */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Scheduled Exams</h3>
              <Badge variant="warning" size="sm">Active</Badge>
            </div>

            <div className="space-y-2.5 text-xs">
              {exams.map((ex) => (
                <div key={ex.id} className="p-3 rounded-xl bg-amber-50/50 border border-amber-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{ex.title || ex.name}</span>
                    <span className="font-mono text-[11px] text-amber-800 font-semibold">{ex.date}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{ex.courseName}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Total Marks: {ex.totalMarks}</span>
                    <span className="text-emerald-700 font-bold">Pass: {ex.passingMarks ?? ex.passMarks ?? 40}</span>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => setActiveSubView('exams')}
            >
              Enter Marks & View Results
            </Button>
          </Card>

          {/* Recent Notices */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Active Notice Board</h3>
              <Badge variant="secondary" size="sm">Public</Badge>
            </div>

            <div className="space-y-2 text-xs">
              {notices.slice(0, 3).map((n) => (
                <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-blue-600 uppercase">{n.type}</span>
                  <p className="font-bold text-slate-800 line-clamp-1 mt-0.5">{n.title}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{n.content}</p>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => setActiveSubView('notices')}
            >
              Post New Notice
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
