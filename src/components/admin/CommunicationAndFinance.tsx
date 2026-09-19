import React, { useState } from 'react';
import {
  Bell,
  MessageSquare,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Calendar,
  Send,
  Share2,
  Users,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Notice, ExpenseRecord, Student } from '../../types';
import { Button, Card, Badge, Modal } from '../common/UIComponents';

export const CommunicationAndFinance: React.FC<{
  initialTab?: 'notices' | 'whatsapp' | 'finance' | 'referrals';
}> = ({ initialTab = 'notices' }) => {
  const {
    notices,
    expenses,
    payments,
    students,
    courses,
    addNotice,
    deleteNotice,
    addExpense,
    deleteExpense,
    openWhatsAppDialog,
    settings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'notices' | 'whatsapp' | 'finance' | 'referrals'>(
    initialTab
  );

  // New Notice Modal
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    type: 'General Notice' as 'General Notice' | 'Exam Notice' | 'Holiday' | 'Batch Update',
    content: '',
    targetAudience: 'All Students',
    isImportant: false,
  });

  // WhatsApp Center State
  const [targetStudentId, setTargetStudentId] = useState(students[0]?.id || '');
  const [selectedTemplate, setSelectedTemplate] = useState('due_fee');

  // New Expense Modal
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'Electricity' as 'Rent' | 'Electricity' | 'Internet' | 'Hardware' | 'Salaries' | 'Marketing' | 'Misc',
    amount: 1500,
    date: new Date().toISOString().split('T')[0],
    paidTo: 'WBSEDCL Electric Bill',
    paymentMode: 'Online (UPI)',
    description: 'Computer lab monthly commercial electricity bill',
  });

  // Calculations for Financial summary
  const totalIncome = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    addNotice({
      ...noticeForm,
      date: new Date().toISOString().split('T')[0],
    });
    setNoticeModalOpen(false);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      ...expenseForm,
      recordedBy: 'Accounts Dept',
    });
    setExpenseModalOpen(false);
  };

  // WhatsApp templates
  const targetStudent = students.find((s) => s.id === targetStudentId) || students[0];

  const getTemplateMessage = () => {
    if (!targetStudent) return '';
    switch (selectedTemplate) {
      case 'admission':
        return `Dear ${targetStudent.name},\n\nCongratulations on your successful admission at RJ TECH (Computer Training & Digital Education Center)!\n\nYour Details:\nCourse: ${targetStudent.courseName}\nStudent ID: ${targetStudent.studentId}\nBatch: ${targetStudent.batchName}\n\nAddress: Hurinan, Joybalarampur, Tamluk\nHelpline: 9635302734\nWelcome to practical digital learning!`;
      case 'due_fee':
        return `Dear ${targetStudent.name},\n\nGentle fee reminder from RJ TECH.\nYour outstanding course tuition due is Rs. ${targetStudent.dueFee}.\nKindly clear the payment at the center reception at your earliest convenience.\n\nHelpline: 9635302734\nRJ TECH Management`;
      case 'exam':
        return `Dear ${targetStudent.name},\n\nThis is an official exam alert from RJ TECH. Your semester examination for ${targetStudent.courseName} is scheduled. Please ensure 75% lab attendance and collect your Admit Card from the reception.\n\nBest of luck!\nRJ TECH Examination Cell`;
      case 'result':
        return `Dear ${targetStudent.name},\n\nYour examination marks and results for ${targetStudent.courseName} have been published on the RJ TECH Student Portal! Log in with your Student ID (${targetStudent.studentId}) to download your digital marksheet.\n\nRJ TECH`;
      case 'certificate':
        return `Dear ${targetStudent.name},\n\nGreat news! Your official, QR-verified diploma certificate for ${targetStudent.courseName} has been generated and signed. You can collect your hardcopy certificate from the RJ TECH center.\n\nHelpline: 9635302734\nRJ TECH`;
      default:
        return `Hello ${targetStudent.name},\n\nImportant notification from RJ TECH Computer Training Center.`;
    }
  };

  const handleDispatchWhatsApp = () => {
    openWhatsAppDialog(
      targetStudent.phone,
      getTemplateMessage(),
      `WhatsApp Notification - ${targetStudent.name}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
            Communication & Financial Operations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage circular notices, instant WhatsApp messaging, institute cash flow ledger, and student referrals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('notices')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'notices' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            Notices ({notices.length})
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'whatsapp' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            WhatsApp Messenger
          </button>
          <button
            onClick={() => setActiveTab('finance')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'finance' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            Income & Expense
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'referrals' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            Referral Program
          </button>
        </div>
      </div>

      {/* ===================== TAB 1: NOTICES ===================== */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setNoticeModalOpen(true)}
            >
              Post New Notice
            </Button>
          </div>

          <div className="space-y-3">
            {notices.map((n) => (
              <Card key={n.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        n.type === 'Exam Notice'
                          ? 'warning'
                          : n.type === 'Holiday'
                          ? 'danger'
                          : 'primary'
                      }
                    >
                      {n.type}
                    </Badge>
                    {n.isImportant && (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        Urgent Announcement
                      </span>
                    )}
                    <span className="text-xs text-slate-400">Audience: {n.targetAudience}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {n.date}
                    </span>
                    <button
                      onClick={() => deleteNotice(n.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{n.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 2: WHATSAPP MESSENGER ===================== */}
      {activeTab === 'whatsapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">RJ TECH WhatsApp Automation</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Recipient Student</label>
                  <select
                    value={targetStudentId}
                    onChange={(e) => setTargetStudentId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.phone} • {s.courseName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Choose Message Template</label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="due_fee">Due Fee Reminder</option>
                    <option value="admission">Admission Confirmation & Welcome</option>
                    <option value="exam">Upcoming Exam Notification</option>
                    <option value="result">Result Publication & Marksheet Ready</option>
                    <option value="certificate">Certificate Issued Notice</option>
                  </select>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                  Clicking "Dispatch via WhatsApp" will trigger the direct official WhatsApp Web or App link with formatted greetings.
                </div>

                <Button
                  variant="success"
                  size="md"
                  className="w-full"
                  icon={Send}
                  onClick={handleDispatchWhatsApp}
                >
                  Dispatch via WhatsApp to {targetStudent?.phone}
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column: Live Message Preview */}
          <div className="lg:col-span-6">
            <Card className="p-6 space-y-4 bg-slate-900 text-white">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-emerald-400">WhatsApp Message Preview</span>
                <span className="text-[11px] text-slate-400">Recipient: +91 {targetStudent?.phone}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 font-sans text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                {getTemplateMessage()}
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Sender: RJ TECH Institute Official</span>
                <span>Helpline: 9635302734</span>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ===================== TAB 3: INCOME & EXPENSE ===================== */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-3xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Total Income (Fees)</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-emerald-600 mt-2 font-heading">
                ₹{totalIncome.toLocaleString('en-IN')}
              </h2>
              <span className="text-[11px] text-slate-400">{payments.length} transactions</span>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Total Operating Expenses</span>
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <TrendingDown className="w-5 h-5" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-rose-600 mt-2 font-heading">
                ₹{totalExpenses.toLocaleString('en-IN')}
              </h2>
              <span className="text-[11px] text-slate-400">{expenses.length} expense items</span>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Net Operational Balance</span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-blue-700 mt-2 font-heading">
                ₹{netProfit.toLocaleString('en-IN')}
              </h2>
              <span className="text-[11px] text-slate-400">Profitable positive surplus</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Institute Expense Ledger</h3>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setExpenseModalOpen(true)}
            >
              Add Expense Entry
            </Button>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Expense Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Paid To</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{exp.title}</span>
                        <span className="text-[10px] text-slate-400">{exp.description}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" size="sm">{exp.category}</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{exp.paidTo}</td>
                      <td className="py-3 px-4 text-slate-500">{exp.date}</td>
                      <td className="py-3 px-4 text-slate-600">{exp.paymentMode}</td>
                      <td className="py-3 px-4 font-bold text-rose-600 text-sm">₹{exp.amount}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => deleteExpense(exp.id)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ===================== TAB 4: REFERRAL PROGRAM ===================== */}
      {activeTab === 'referrals' && (
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Student Referral & Reward Scheme
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1 font-heading">
                  Grow RJ TECH Through Word-of-Mouth
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-xl">
                  Enrolled students who refer peers receive a ₹500 fee concession or direct scholarship bonus when their referral takes admission.
                </p>
              </div>
              <Badge variant="success" className="text-sm py-1.5 px-3">
                Active Campaign
              </Badge>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm">Student Referral Codes & Referrals Log</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Personal Referral Code</th>
                    <th className="py-3 px-4">Referred By</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Reward Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{st.name}</span>
                        <span className="text-[10px] text-slate-400">{st.phone}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{st.registrationNo}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {st.referredBy ? (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                            {st.referredBy}
                          </span>
                        ) : (
                          'Direct Walk-in'
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700">{st.courseName}</td>
                      <td className="py-3 px-4">
                        {st.referredBy ? (
                          <Badge variant="success" size="sm">₹500 Reward Credited</Badge>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Modal: Create Notice */}
      {noticeModalOpen && (
        <Modal
          isOpen={noticeModalOpen}
          onClose={() => setNoticeModalOpen(false)}
          title="Post Notice to Notice Board"
          maxWidth="md"
        >
          <form onSubmit={handleCreateNotice} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Notice Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Special Bengali Typing Speed Contest"
                value={noticeForm.title}
                onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Category</label>
                <select
                  value={noticeForm.type}
                  onChange={(e) => setNoticeForm({ ...noticeForm, type: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="General Notice">General Notice</option>
                  <option value="Exam Notice">Exam Notice</option>
                  <option value="Holiday">Holiday Notification</option>
                  <option value="Batch Update">Batch Schedule Update</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                <select
                  value={noticeForm.targetAudience}
                  onChange={(e) => setNoticeForm({ ...noticeForm, targetAudience: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="All Students">All Students & Public</option>
                  <option value="ADCA Batch">ADCA Students Only</option>
                  <option value="DCA Batch">DCA Students Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Notice Content *</label>
              <textarea
                required
                rows={3}
                placeholder="Details of the announcement..."
                value={noticeForm.content}
                onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={noticeForm.isImportant}
                onChange={(e) => setNoticeForm({ ...noticeForm, isImportant: e.target.checked })}
                className="rounded border-slate-300 text-blue-600"
              />
              <span className="font-semibold">Mark as Urgent / Important Announcement</span>
            </label>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setNoticeModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Publish Notice
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Add Expense */}
      {expenseModalOpen && (
        <Modal
          isOpen={expenseModalOpen}
          onClose={() => setExpenseModalOpen(false)}
          title="Record Operating Expense"
          maxWidth="md"
        >
          <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Expense Item Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Lab 1 Optical Mouse & Headphone Replacements"
                value={expenseForm.title}
                onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Electricity">Electricity</option>
                  <option value="Internet">Internet / Broadband</option>
                  <option value="Hardware">Computer Hardware & Lab</option>
                  <option value="Rent">Premises Rent</option>
                  <option value="Salaries">Faculty & Staff Salaries</option>
                  <option value="Marketing">Brochures & Marketing</option>
                  <option value="Misc">Miscellaneous</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-rose-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Paid To *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tamluk Computer Store"
                  value={expenseForm.paidTo}
                  onChange={(e) => setExpenseForm({ ...expenseForm, paidTo: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
                <select
                  value={expenseForm.paymentMode}
                  onChange={(e) => setExpenseForm({ ...expenseForm, paymentMode: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Online (UPI)">Online (UPI / PhonePe)</option>
                  <option value="Cash">Cash at Store</option>
                  <option value="Bank NEFT">Bank NEFT</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setExpenseModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="danger" size="md">
                Save Expense Record
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
