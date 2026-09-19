import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  AlertCircle,
  Receipt,
  Search,
  MessageSquare,
  CheckCircle2,
  Calendar,
  Filter,
  Download,
  Printer,
  Users,
  Clock,
  Sparkles,
  Phone,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student, PaymentRecord } from '../../types';
import { Button, Card, Badge, Modal } from '../common/UIComponents';

export const FeesManagement: React.FC<{
  initialTab?: 'collect' | 'due' | 'history' | 'structure';
}> = ({ initialTab = 'collect' }) => {
  const {
    students,
    courses,
    payments,
    addPayment,
    updateStudent,
    setActiveReceipt,
    openWhatsAppDialog,
    settings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'collect' | 'due' | 'history' | 'structure'>(
    initialTab
  );

  // Collect Fees State
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [searchStudentTerm, setSearchStudentTerm] = useState('');
  const [payAmount, setPayAmount] = useState(1000);
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [payMode, setPayMode] = useState<'Cash' | 'Online (UPI/QR)' | 'Bank Transfer'>('Cash');
  const [payRemarks, setPayRemarks] = useState('Monthly Installment 2');

  // Due Fees Filter
  const [dueCourseFilter, setDueCourseFilter] = useState('ALL');
  const [dueSearch, setDueSearch] = useState('');

  // Payment History Filter
  const [historySearch, setHistorySearch] = useState('');
  const [historyModeFilter, setHistoryModeFilter] = useState('ALL');

  // Find currently selected student for Collect Fees
  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handleCollectFeesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudent) return;

    const receiptNo = `RJT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      receiptNo,
      studentId: activeStudent.studentId,
      studentName: activeStudent.name,
      courseName: activeStudent.courseName,
      amount: Number(payAmount),
      mode: payMode,
      date: payDate,
      collectedBy: 'RJ TECH Accounts',
      remarks: payRemarks,
    };

    addPayment(newPayment);

    // Update student balance
    const newPaid = activeStudent.paidFee + Number(payAmount);
    const newDue = Math.max(0, activeStudent.finalFee - newPaid);
    updateStudent(activeStudent.id, {
      paidFee: newPaid,
      dueFee: newDue,
      feesStatus: newDue <= 0 ? 'Paid' : 'Partial',
    });

    // Automatically trigger professional printable receipt modal
    setActiveReceipt(newPayment);
  };

  // Due students list
  const dueStudents = students.filter((s) => s.dueFee > 0);
  const filteredDueStudents = dueStudents.filter((s) => {
    const matchesCourse = dueCourseFilter === 'ALL' || s.courseId === dueCourseFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(dueSearch.toLowerCase()) ||
      s.studentId.toLowerCase().includes(dueSearch.toLowerCase()) ||
      s.phone.includes(dueSearch);
    return matchesCourse && matchesSearch;
  });

  const totalDueAmount = dueStudents.reduce((acc, curr) => acc + curr.dueFee, 0);

  // Send WhatsApp Reminder
  const handleSendReminder = (s: Student) => {
    openWhatsAppDialog(
      s.phone,
      `Dear ${s.name},\n\nThis is a friendly reminder from RJ TECH (Computer Training & Digital Education Center).\n\nYour course fee for ${s.courseName} has a pending balance of Rs. ${s.dueFee}.\nKindly deposit the amount at the institute office or pay via UPI.\n\nAddress: Hurinan, Joybalarampur, Tamluk\nHelpline: 9635302734\nThank you,\nRJ TECH Accounts`,
      `WhatsApp Due Fee Reminder - ${s.name}`
    );
  };

  // Bulk WhatsApp Reminder
  const handleBulkReminder = () => {
    if (confirm(`Send WhatsApp due fee notification to all ${filteredDueStudents.length} students?`)) {
      alert(`WhatsApp due fee queue generated for ${filteredDueStudents.length} students. Reminders dispatched.`);
    }
  };

  // Total collections
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTotal = payments.filter((p) => p.date === todayStr).reduce((acc, p) => acc + p.amount, 0);
  const totalAllTime = payments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
            Fees & Accounts Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Collect course tuition, print tax-compliant receipts, and track due fees with WhatsApp alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('collect')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'collect' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            Collect Fees
          </button>
          <button
            onClick={() => setActiveTab('due')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'due' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            Due Fees ({dueStudents.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'history' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            Payment History ({payments.length})
          </button>
          <button
            onClick={() => setActiveTab('structure')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'structure' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            Fee Structure
          </button>
        </div>
      </div>

      {/* ===================== TAB 1: COLLECT FEES ===================== */}
      {activeTab === 'collect' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8">
              <form onSubmit={handleCollectFeesSubmit} className="space-y-5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">Student Fee Collection</h3>
                  <Badge variant="primary">Instant Receipt Generator</Badge>
                </div>

                {/* Search / Select Student */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select Enrolled Student *
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => {
                      setSelectedStudentId(e.target.value);
                      const st = students.find((s) => s.id === e.target.value);
                      if (st && st.dueFee > 0) {
                        setPayAmount(st.dueFee);
                      }
                    }}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.studentId} • {s.courseName} • Due: ₹{s.dueFee})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount, Date, Mode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Paying Amount (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="100"
                      value={payAmount}
                      onChange={(e) => setPayAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm font-bold text-emerald-700 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Payment Date</label>
                    <input
                      type="date"
                      value={payDate}
                      onChange={(e) => setPayDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Payment Mode *</label>
                    <select
                      value={payMode}
                      onChange={(e) => setPayMode(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Cash">Cash at Reception</option>
                      <option value="Online (UPI/QR)">Online (UPI / QR Code)</option>
                      <option value="Bank Transfer">Direct Bank NEFT</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Receipt Remarks / Note
                  </label>
                  <input
                    type="text"
                    value={payRemarks}
                    onChange={(e) => setPayRemarks(e.target.value)}
                    placeholder="e.g. Monthly Fee / Advance installment"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="success" size="lg" className="w-full" icon={Receipt}>
                    Collect Fee & Print Official Receipt
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Right Column: Live Student Account Snapshot */}
          <div className="lg:col-span-5">
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                Student Account Ledger
              </h3>

              {activeStudent && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeStudent.photo}
                      alt={activeStudent.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{activeStudent.name}</h4>
                      <p className="text-xs text-blue-700 font-semibold">{activeStudent.courseName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        ID: {activeStudent.studentId} • Roll: {activeStudent.rollNo}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 font-medium">
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Total Course Fee:</span>
                      <span className="font-bold text-slate-800">₹{activeStudent.totalFee}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Special Concession:</span>
                      <span className="text-slate-800">₹{activeStudent.discount}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Final Net Fee:</span>
                      <span className="font-bold text-slate-900">₹{activeStudent.finalFee}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Total Deposited So Far:</span>
                      <span className="font-bold text-emerald-600">₹{activeStudent.paidFee}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-500 font-bold">Outstanding Balance:</span>
                      <span className="font-black text-rose-600 text-sm">₹{activeStudent.dueFee}</span>
                    </div>
                  </div>

                  {activeStudent.dueFee > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      icon={MessageSquare}
                      onClick={() => handleSendReminder(activeStudent)}
                    >
                      Send WhatsApp Due Alert to Student
                    </Button>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: DUE FEES DASHBOARD ===================== */}
      {activeTab === 'due' && (
        <div className="space-y-4">
          {/* Outstanding Banner */}
          <div className="bg-gradient-to-r from-amber-500 to-rose-600 p-6 rounded-3xl text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-amber-100">
                Total Pending Institutional Dues
              </span>
              <h2 className="text-3xl font-black font-heading mt-0.5">
                ₹{totalDueAmount.toLocaleString('en-IN')}
              </h2>
              <p className="text-xs text-amber-100 mt-1">
                {dueStudents.length} enrolled students currently have outstanding tuition installments.
              </p>
            </div>
            <Button
              variant="outline"
              size="md"
              className="bg-white text-rose-700 hover:bg-amber-50 border-white font-bold"
              icon={MessageSquare}
              onClick={handleBulkReminder}
            >
              Send Bulk WhatsApp Reminders
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="relative sm:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by student name, roll no, or phone..."
                  value={dueSearch}
                  onChange={(e) => setDueSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <select
                value={dueCourseFilter}
                onChange={(e) => setDueCourseFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="ALL">All Courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code}
                  </option>
                ))}
              </select>
            </div>
          </Card>

          {/* Due Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Course & Batch</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Total Fee</th>
                    <th className="py-3 px-4">Paid Fee</th>
                    <th className="py-3 px-4">Due Fee</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDueStudents.length > 0 ? (
                    filteredDueStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img src={s.photo} alt={s.name} className="w-7 h-7 rounded-full object-cover" />
                            <div>
                              <p className="font-bold text-slate-900">{s.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{s.studentId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-800">{s.courseName}</p>
                          <p className="text-[10px] text-slate-500">{s.batchName}</p>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700">{s.phone}</td>
                        <td className="py-3 px-4 text-slate-700 font-medium">₹{s.finalFee}</td>
                        <td className="py-3 px-4 text-emerald-600 font-bold">₹{s.paidFee}</td>
                        <td className="py-3 px-4 text-rose-600 font-black">₹{s.dueFee}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              icon={MessageSquare}
                              onClick={() => handleSendReminder(s)}
                              className="text-[11px] py-1 px-2 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                            >
                              WhatsApp
                            </Button>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => {
                                setSelectedStudentId(s.id);
                                setPayAmount(s.dueFee);
                                setActiveTab('collect');
                              }}
                              className="text-[11px] py-1 px-2.5"
                            >
                              Collect
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                        No students with pending dues matching the filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ===================== TAB 3: PAYMENT HISTORY ===================== */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <span className="text-slate-400 block text-xs font-semibold">Today's Collection</span>
              <span className="text-2xl font-black text-emerald-600">₹{todayTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <span className="text-slate-400 block text-xs font-semibold">Total Revenue Recorded</span>
              <span className="text-2xl font-black text-blue-600">₹{totalAllTime.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <span className="text-slate-400 block text-xs font-semibold">Total Issued Receipts</span>
              <span className="text-2xl font-black text-slate-800">{payments.length} Receipts</span>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Receipt No</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Payment Mode</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4 text-right">Receipt Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{p.receiptNo}</td>
                      <td className="py-3 px-4 text-slate-500">{p.date}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{p.studentName}</td>
                      <td className="py-3 px-4 text-slate-700">{p.courseName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {p.mode}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-600 text-sm">₹{p.amount}</td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          icon={Receipt}
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

      {/* ===================== TAB 4: FEES STRUCTURE ===================== */}
      {activeTab === 'structure' && (
        <Card className="overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Institutional Fee Matrix</h3>
              <p className="text-xs text-slate-500">Official tuition schedule for RJ TECH programs</p>
            </div>
            <Badge variant="primary">Session {settings.currentSession}</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Course Name</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Admission Fee</th>
                  <th className="py-3 px-4">Monthly Fee</th>
                  <th className="py-3 px-4">Exam Fee</th>
                  <th className="py-3 px-4">Certificate Fee</th>
                  <th className="py-3 px-4 font-bold text-blue-700">Total Course Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{c.code}</td>
                    <td className="py-3 px-4 text-slate-600">{c.duration}</td>
                    <td className="py-3 px-4 text-slate-700">₹{c.admissionFee}</td>
                    <td className="py-3 px-4 text-slate-700">₹{c.monthlyFee}</td>
                    <td className="py-3 px-4 text-slate-700">₹{c.examFee}</td>
                    <td className="py-3 px-4 text-slate-700">₹{c.certificateFee}</td>
                    <td className="py-3 px-4 font-black text-blue-700 text-sm">₹{c.totalFees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
