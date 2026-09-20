import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  Edit2,
  Trash2,
  CreditCard,
  QrCode,
  Award,
  Phone,
  MessageSquare,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  DollarSign,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Mail,
  MapPin,
  FileCheck,
  KeyRound,
  Lock,
  EyeOff,
  ShieldCheck,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { Button, Card, Badge, Modal } from '../common/UIComponents';

export const StudentManagement: React.FC<{
  initialTab?: 'list' | 'add' | 'enquiries' | 'admit' | 'students' | string;
  setActiveSubView?: (view: string) => void;
}> = ({ initialTab = 'list', setActiveSubView }) => {
  const {
    students,
    courses,
    batches,
    addStudent,
    updateStudent,
    deleteStudent,
    selectedStudentId,
    setSelectedStudentId,
    setActiveIdCard,
    setActiveCertificate,
    setActiveReceipt,
    openWhatsAppDialog,
    payments,
    results,
    attendanceRecords,
    settings,
  } = useApp();

  // Mode: 'list' or 'add'
  const [viewMode, setViewMode] = useState<'list' | 'add'>(
    initialTab === 'add' || initialTab === 'admit' ? 'add' : 'list'
  );

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [batchFilter, setBatchFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [feesFilter, setFeesFilter] = useState('ALL');

  // Student Password & Credential Modal State
  const [passwordStudent, setPasswordStudent] = useState<Student | null>(null);
  const [credentialPassword, setCredentialPassword] = useState('');
  const [credentialUsername, setCredentialUsername] = useState('');
  const [credentialStudentId, setCredentialStudentId] = useState('');
  const [showPasswordInModal, setShowPasswordInModal] = useState(false);
  const [showPasswordInForm, setShowPasswordInForm] = useState(false);

  // Edit Student Modal state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Collect Fee Modal for specific student
  const [feeStudent, setFeeStudent] = useState<Student | null>(null);
  const [feeAmount, setFeeAmount] = useState(1000);
  const [feeMode, setFeeMode] = useState<'Cash' | 'Online (UPI/QR)' | 'Bank Transfer'>('Cash');
  const [feeRemarks, setFeeRemarks] = useState('Tuition fee payment');

  // New Student Form State
  const [formData, setFormData] = useState({
    studentId: '',
    username: '',
    password: 'Password@123',
    name: '',
    dob: '2005-06-15',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    fatherName: '',
    motherName: '',
    phone: '',
    whatsapp: '',
    email: '',
    village: 'Hurinan',
    postOffice: 'Joybalarampur',
    district: 'Purba Medinipur',
    state: 'West Bengal',
    pinCode: '721137',
    courseId: courses[0]?.id || '',
    batchId: batches[0]?.id || '',
    session: settings.currentSession,
    discount: 0,
    paidFee: 1000,
    referredBy: '',
  });

  const selectedCourse = courses.find((c) => c.id === formData.courseId) || courses[0];
  const selectedBatch = batches.find((b) => b.id === formData.batchId) || batches[0];
  const finalFee = Math.max(0, (selectedCourse?.totalFees || 0) - Number(formData.discount || 0));
  const dueFee = Math.max(0, finalFee - Number(formData.paidFee || 0));

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm);

    const matchesCourse = courseFilter === 'ALL' || s.courseId === courseFilter;
    const matchesBatch = batchFilter === 'ALL' || s.batchId === batchFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesFees =
      feesFilter === 'ALL' ||
      (feesFilter === 'Paid' && s.feesStatus === 'Paid') ||
      (feesFilter === 'Due' && s.feesStatus !== 'Paid');

    return matchesSearch && matchesCourse && matchesBatch && matchesStatus && matchesFees;
  });

  // Handle Add Student Submit
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Student Name and Phone Number are required.');
      return;
    }

    const finalStudentId = formData.studentId.trim() || undefined;
    const finalUsername = formData.username.trim() || formData.name.toLowerCase().replace(/\s+/g, '.');
    const finalPassword = formData.password.trim() || '123456';

    const newStudent = addStudent({
      studentId: finalStudentId,
      username: finalUsername,
      password: finalPassword,
      name: formData.name,
      dob: formData.dob,
      gender: formData.gender,
      photo:
        formData.gender === 'Female'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      phone: formData.phone,
      whatsapp: formData.whatsapp || formData.phone,
      email: formData.email,
      address: `${formData.village}, ${formData.postOffice}, ${formData.district}, ${formData.state} - ${formData.pinCode}`,
      village: formData.village,
      postOffice: formData.postOffice,
      district: formData.district,
      state: formData.state,
      pinCode: formData.pinCode,
      courseId: selectedCourse.id,
      courseName: selectedCourse.name,
      batchId: selectedBatch.id,
      batchName: selectedBatch.name,
      session: formData.session,
      admissionDate: new Date().toISOString().split('T')[0],
      totalFee: selectedCourse.totalFees,
      discount: Number(formData.discount),
      finalFee,
      paidFee: Number(formData.paidFee),
      dueFee,
      status: 'Active',
      feesStatus: dueFee <= 0 ? 'Paid' : 'Partial',
      referredBy: formData.referredBy,
    });

    // Clear form and view the newly created student profile
    setSelectedStudentId(newStudent.id);
    setViewMode('list');
  };

  // Profile Modal Tab state
  const [profileTab, setProfileTab] = useState<
    'overview' | 'personal' | 'academic' | 'fees' | 'attendance' | 'exams' | 'documents'
  >('overview');

  const profileStudent = students.find((s) => s.id === selectedStudentId);

  // Student specific data
  const studentPayments = payments.filter((p) => p.studentId === profileStudent?.studentId);
  const studentResults = results.filter((r) => r.studentId === profileStudent?.id);
  const studentAttendance = attendanceRecords.filter((a) => a.studentId === profileStudent?.id);
  const presentCount = studentAttendance.filter((a) => a.status === 'Present').length;
  const attendanceRate =
    studentAttendance.length > 0 ? Math.round((presentCount / studentAttendance.length) * 100) : 95;

  const handleWhatsAppFeeReminder = (st: Student) => {
    openWhatsAppDialog(
      st.phone,
      `Dear ${st.name},\n\nGreetings from RJ TECH (Computer Training & Digital Education Center).\n\nThis is a friendly reminder that your course fee for ${st.courseName} has a pending due of Rs. ${st.dueFee}.\nKindly deposit the amount at the institute office at Hurinan, Joybalarampur, Tamluk or via UPI.\n\nHelpline: 9635302734\nThank you,\nRJ TECH Administration`,
      `WhatsApp Due Fee Reminder - ${st.name}`
    );
  };

  // Export CSV mock
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Student ID,Name,Course,Batch,Phone,Total Fee,Paid Fee,Due Fee,Status']
        .concat(
          filteredStudents.map(
            (s) =>
              `${s.studentId},"${s.name}","${s.courseName}","${s.batchName}",${s.phone},${s.finalFee},${s.paidFee},${s.dueFee},${s.status}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RJ_TECH_Students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* View Switch Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
            {viewMode === 'list' ? 'Student Administration' : 'New Student Admission'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {viewMode === 'list'
              ? `Manage registered students, fees, attendance and credentials (${filteredStudents.length} showing)`
              : 'Enroll a new student into RJ TECH courses with auto-generated registration details'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === 'list' ? (
            <>
              <Button
                variant="outline"
                size="sm"
                icon={Download}
                onClick={handleExportCSV}
                className="text-xs"
              >
                Export CSV
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={UserPlus}
                onClick={() => setViewMode('add')}
              >
                + Add Student
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              icon={Users}
              onClick={() => setViewMode('list')}
            >
              Back to Student List
            </Button>
          )}
        </div>
      </div>

      {/* ======================= ADD STUDENT FORM ======================= */}
      {viewMode === 'add' && (
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleAddStudent} className="space-y-8">
            {/* Section 1: Academic */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">1. Academic Enrollment</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Course *</label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code} - {c.duration})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Batch *</label>
                  <select
                    value={formData.batchId}
                    onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.room})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Academic Session</label>
                  <input
                    type="text"
                    readOnly
                    value={formData.session}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course Total Fee</label>
                  <input
                    type="text"
                    readOnly
                    value={`₹${selectedCourse?.totalFees}`}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fee Discount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Paid Fee (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.paidFee}
                    onChange={(e) => setFormData({ ...formData, paidFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="mt-3 p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs font-semibold text-blue-900">
                <span>Final Course Fee: ₹{finalFee}</span>
                <span className={dueFee > 0 ? 'text-amber-800' : 'text-emerald-700'}>
                  Pending Due: ₹{dueFee}
                </span>
                <span>Auto Roll No & Reg No will be generated upon saving.</span>
              </div>
            </div>

            {/* Section 2: Personal Details */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">2. Personal & Family Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Joydeep Pal"
                    value={formData.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        name: val,
                        username: !prev.username || prev.username === prev.name.toLowerCase().replace(/\s+/g, '.')
                          ? val.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '')
                          : prev.username,
                      }));
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    placeholder="Father's name"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    placeholder="Mother's name"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">WhatsApp Phone</label>
                  <input
                    type="tel"
                    placeholder="WhatsApp number"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Referred By (Optional)</label>
                  <input
                    type="text"
                    placeholder="Referral Reg No"
                    value={formData.referredBy}
                    onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Village / Street</label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Post Office</label>
                  <input
                    type="text"
                    value={formData.postOffice}
                    onChange={(e) => setFormData({ ...formData, postOffice: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Student Login & Portal Credentials */}
            <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-200/80">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-amber-200/60">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    3. Student Portal Access Credentials (Student ID & Password)
                  </h3>
                </div>
                <span className="px-2.5 py-1 bg-amber-500 text-white font-bold rounded-lg text-[10px] uppercase tracking-wide">
                  Student Login Credentials • ছাত্রের আইডি ও পাসওয়ার্ড
                </span>
              </div>

              <div className="p-3.5 bg-white border border-amber-200 rounded-xl mb-4 flex items-start gap-2.5 text-xs text-amber-900 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-slate-900 mb-0.5">Student Login Account Creation (ছাত্রের লগইন অ্যাকাউন্ট)</span>
                  <span className="text-slate-600">
                    Assign a custom or automated Student ID, Portal Username, and secure Password. The student will use these credentials to log in to the RJ TECH Student Portal from any mobile or computer to view Marksheets, Certificates, Fee Receipts, and live exams.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">Student ID / Roll Prefix</label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          studentId: `${settings.studentIdPrefix || 'RJT-'}${1000 + students.length + 1}`,
                        })
                      }
                      className="text-[11px] text-blue-600 hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                    >
                      <RefreshCw className="w-2.5 h-2.5" /> Auto ID
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder={`e.g. RJT-${1000 + students.length + 1}`}
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono uppercase font-bold text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Optional: leave empty to auto-generate from institute prefix
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Portal Username / Login ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. joydeep.pal"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        username: e.target.value.toLowerCase().replace(/\s+/g, '.'),
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono font-medium"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Used by the student for website / app login
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">Login Password *</label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          password: 'RJT' + Math.floor(100000 + Math.random() * 900000),
                        })
                      }
                      className="text-[11px] text-blue-600 hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                    >
                      <Sparkles className="w-2.5 h-2.5" /> Random Pass
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPasswordInForm ? 'text' : 'password'}
                      required
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-3 pr-9 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono font-bold text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordInForm(!showPasswordInForm)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      title={showPasswordInForm ? 'Hide password' : 'Show password'}
                    >
                      {showPasswordInForm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Can be viewed or changed anytime by administrator
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="md"
                onClick={() => setViewMode('list')}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Complete Admission & Generate ID
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* ======================= STUDENT LIST ======================= */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {/* Action and Stats Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Registered Students ({filteredStudents.length})</h3>
                <p className="text-[11px] text-slate-500">Manage admissions, credentials, ID cards, and tuition fees</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {students.some(
                (s) =>
                  s.id === 's-1001' ||
                  s.id === 's-1002' ||
                  s.name.toLowerCase().includes('demo') ||
                  s.name.includes('Priya Roy') ||
                  s.name.includes('Rahul Sen')
              ) && (
                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={() => {
                    if (confirm('Delete all demo student records from database?')) {
                      const demoList = students.filter(
                        (s) =>
                          s.id === 's-1001' ||
                          s.id === 's-1002' ||
                          s.name.toLowerCase().includes('demo') ||
                          s.name.includes('Priya Roy') ||
                          s.name.includes('Rahul Sen')
                      );
                      demoList.forEach((d) => deleteStudent(d.id));
                    }
                  }}
                >
                  Clear Demo Students
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                icon={UserPlus}
                onClick={() => setViewMode('add')}
              >
                New Admission & Login
              </Button>
            </div>
          </div>

          {/* Filter Bar */}
          <Card className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by student name, ID, phone, reg no..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Course filter */}
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="ALL">All Courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>

              {/* Batch filter */}
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="ALL">All Batches</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              {/* Fees status filter */}
              <select
                value={feesFilter}
                onChange={(e) => setFeesFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="ALL">All Fee Status</option>
                <option value="Paid">Fee Paid</option>
                <option value="Due">Fee Pending / Due</option>
              </select>
            </div>
          </Card>

          {/* Students Data Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">ID & Reg No</th>
                    <th className="py-3 px-4">Course & Batch</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Paid / Due</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Student Name & Photo */}
                        <td className="py-3 px-4">
                          <div
                            onClick={() => setSelectedStudentId(st.id)}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <img
                              src={st.photo}
                              alt={st.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 group-hover:ring-2 ring-blue-500 transition-all"
                            />
                            <div>
                              <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {st.name}
                              </p>
                              <span className="text-[10px] text-slate-400">Roll: {st.rollNo}</span>
                            </div>
                          </div>
                        </td>

                        {/* ID & Reg No */}
                        <td className="py-3 px-4">
                          <p className="font-mono font-bold text-slate-800">{st.studentId}</p>
                          <p className="font-mono text-[10px] text-slate-400">{st.registrationNo}</p>
                        </td>

                        {/* Course & Batch */}
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-800 line-clamp-1">{st.courseName}</p>
                          <p className="text-[10px] text-slate-500">{st.batchName}</p>
                        </td>

                        {/* Phone */}
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-700">{st.phone}</p>
                          <button
                            onClick={() => handleWhatsAppFeeReminder(st)}
                            className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold hover:underline mt-0.5"
                          >
                            <MessageSquare className="w-3 h-3" />
                            WhatsApp
                          </button>
                        </td>

                        {/* Paid / Due Fees */}
                        <td className="py-3 px-4">
                          <div className="space-y-0.5">
                            <span className="font-bold text-emerald-600 block">₹{st.paidFee} Paid</span>
                            {st.dueFee > 0 ? (
                              <span className="font-bold text-rose-600 text-[11px] block">
                                ₹{st.dueFee} Due
                              </span>
                            ) : (
                              <span className="text-emerald-700 text-[10px] font-semibold">Cleared ✓</span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              st.status === 'Active'
                                ? 'success'
                                : st.status === 'Completed'
                                ? 'secondary'
                                : 'neutral'
                            }
                            size="sm"
                          >
                            {st.status}
                          </Badge>
                        </td>

                        {/* Action buttons */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelectedStudentId(st.id)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Full Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setFeeStudent(st)}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Collect Fee"
                            >
                              <CreditCard className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setActiveIdCard(st)}
                              className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                              title="Print ID Card"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setPasswordStudent(st);
                                setCredentialStudentId(st.studentId);
                                setCredentialUsername(st.username || st.studentId);
                                setCredentialPassword(st.password || '123456');
                                setShowPasswordInModal(false);
                              }}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                              title="Manage Student ID & Password (Portal Credentials)"
                            >
                              <KeyRound className="w-4 h-4 text-amber-600" />
                            </button>
                            <button
                              onClick={() => setEditingStudent(st)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit Student"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${st.name}?`)) {
                                  deleteStudent(st.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                        No students found matching current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ======================= DETAILED STUDENT PROFILE MODAL ======================= */}
      {profileStudent && (
        <Modal
          isOpen={Boolean(profileStudent)}
          onClose={() => setSelectedStudentId(null)}
          title={`Student Record: ${profileStudent.name}`}
          maxWidth="4xl"
        >
          <div className="space-y-6">
            {/* Top Profile Header Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/40 border border-blue-200/80">
              <div className="flex items-center gap-4">
                <img
                  src={profileStudent.photo}
                  alt={profileStudent.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900 font-heading">
                      {profileStudent.name}
                    </h2>
                    <Badge variant="success" size="sm">{profileStudent.status}</Badge>
                  </div>
                  <p className="text-xs font-semibold text-blue-700">{profileStudent.courseName}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    ID: {profileStudent.studentId} • Reg: {profileStudent.registrationNo} • Roll: {profileStudent.rollNo}
                  </p>
                </div>
              </div>

              {/* Quick Profile Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="success"
                  icon={CreditCard}
                  onClick={() => setFeeStudent(profileStudent)}
                >
                  Collect Fee
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={MessageSquare}
                  onClick={() => handleWhatsAppFeeReminder(profileStudent)}
                >
                  WhatsApp
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={QrCode}
                  onClick={() => setActiveIdCard(profileStudent)}
                >
                  ID Card
                </Button>
              </div>
            </div>

            {/* 7 Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-semibold text-slate-600">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'personal', label: 'Personal Information' },
                { id: 'academic', label: 'Academic Details' },
                { id: 'fees', label: 'Fees Details' },
                { id: 'attendance', label: 'Attendance' },
                { id: 'exams', label: 'Exams & Results' },
                { id: 'documents', label: 'Documents' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setProfileTab(t.id as any)}
                  className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    profileTab === t.id
                      ? 'bg-blue-50 text-[#155EEF] font-bold'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Overview */}
            {profileTab === 'overview' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Lab Attendance Rate</span>
                    <span className="text-lg font-black text-emerald-600">{attendanceRate}%</span>
                    <span className="text-[10px] text-slate-400 block">{presentCount} classes present</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Paid Tuition Fees</span>
                    <span className="text-lg font-black text-blue-600">₹{profileStudent.paidFee}</span>
                    <span className="text-[10px] text-slate-400 block">Total: ₹{profileStudent.finalFee}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Pending Balance</span>
                    <span
                      className={`text-lg font-black ${
                        profileStudent.dueFee > 0 ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      ₹{profileStudent.dueFee}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {profileStudent.dueFee > 0 ? 'Payment pending' : 'Zero balance'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Assigned Batch</span>
                    <span className="text-sm font-bold text-slate-800 block truncate">
                      {profileStudent.batchName}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Room: Lab 1</span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                      <KeyRound className="w-4 h-4 text-amber-600" />
                      <span>Student Portal Access Credentials</span>
                    </div>
                    <p className="text-[11px] text-amber-800 font-mono">
                      Student ID: <strong>{profileStudent.studentId}</strong> • Username: <strong>{profileStudent.username || profileStudent.studentId}</strong> • Password: <strong>{profileStudent.password || '123456'}</strong>
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    icon={KeyRound}
                    onClick={() => {
                      setPasswordStudent(profileStudent);
                      setCredentialStudentId(profileStudent.studentId);
                      setCredentialUsername(profileStudent.username || profileStudent.studentId);
                      setCredentialPassword(profileStudent.password || '123456');
                      setShowPasswordInModal(false);
                    }}
                  >
                    Change Password
                  </Button>
                </div>

                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-1">
                  <span className="text-xs font-bold text-blue-800">Institute Notice for Student</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Student is eligible for regular lab practice and typing speed monitoring. Make sure all tuition fees are cleared prior to semester examination.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Personal Information */}
            {profileTab === 'personal' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1">Personal Details</h4>
                  <p><span className="text-slate-500">Date of Birth:</span> <strong>{profileStudent.dob}</strong></p>
                  <p><span className="text-slate-500">Gender:</span> <strong>{profileStudent.gender}</strong></p>
                  <p><span className="text-slate-500">Father's Name:</span> <strong>{profileStudent.fatherName || 'N/A'}</strong></p>
                  <p><span className="text-slate-500">Mother's Name:</span> <strong>{profileStudent.motherName || 'N/A'}</strong></p>
                </div>

                <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1">Contact & Address</h4>
                  <p><span className="text-slate-500">Mobile Phone:</span> <strong>{profileStudent.phone}</strong></p>
                  <p><span className="text-slate-500">WhatsApp:</span> <strong>{profileStudent.whatsapp}</strong></p>
                  <p><span className="text-slate-500">Email:</span> <strong>{profileStudent.email || 'N/A'}</strong></p>
                  <p><span className="text-slate-500">Permanent Address:</span> <strong>{profileStudent.address}</strong></p>
                  <p><span className="text-slate-500">District & State:</span> <strong>{profileStudent.district}, {profileStudent.state} - {profileStudent.pinCode}</strong></p>
                </div>
              </div>
            )}

            {/* Tab 3: Academic Details */}
            {profileTab === 'academic' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 font-medium">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Course Enrolled:</span>
                  <span className="font-bold text-slate-900">{profileStudent.courseName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Assigned Batch:</span>
                  <span className="font-bold text-blue-700">{profileStudent.batchName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Academic Session:</span>
                  <span className="text-slate-800">{profileStudent.session}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Admission Date:</span>
                  <span className="text-slate-800">{profileStudent.admissionDate}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Registration Number:</span>
                  <span className="font-mono font-bold text-slate-900">{profileStudent.registrationNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Portal Username:</span>
                  <span className="font-mono text-emerald-700 font-bold">{profileStudent.username}</span>
                </div>
              </div>
            )}

            {/* Tab 4: Fees Details */}
            {profileTab === 'fees' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">Student Payment Receipts</h4>
                  <Button size="sm" variant="success" icon={CreditCard} onClick={() => setFeeStudent(profileStudent)}>
                    Collect New Payment
                  </Button>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Receipt No</th>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Mode</th>
                        <th className="py-2 px-3">Amount</th>
                        <th className="py-2 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentPayments.length > 0 ? (
                        studentPayments.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-mono font-bold text-blue-700">{p.receiptNo}</td>
                            <td className="py-2 px-3 text-slate-600">{p.date}</td>
                            <td className="py-2 px-3">{p.mode}</td>
                            <td className="py-2 px-3 font-bold text-emerald-600">₹{p.amount}</td>
                            <td className="py-2 px-3 text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setActiveReceipt(p)}
                                className="text-[11px] py-0.5 px-2"
                              >
                                Print Receipt
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-slate-400">
                            No payment records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 5: Attendance */}
            {profileTab === 'attendance' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-900">Total Recorded Classes: {studentAttendance.length}</span>
                  <Badge variant="success">Presence: {attendanceRate}%</Badge>
                </div>

                <div className="space-y-1 max-h-52 overflow-y-auto">
                  {studentAttendance.map((a) => (
                    <div key={a.id} className="p-2 rounded-lg bg-white border border-slate-100 flex items-center justify-between">
                      <span className="font-mono text-slate-600">{a.date}</span>
                      <span className="text-slate-500">{a.time}</span>
                      <Badge variant={a.status === 'Present' ? 'success' : 'danger'} size="sm">
                        {a.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 6: Exams */}
            {profileTab === 'exams' && (
              <div className="space-y-3 text-xs">
                {studentResults.length > 0 ? (
                  studentResults.map((r) => (
                    <div key={r.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{r.examTitle}</span>
                        <Badge variant="primary">Grade {r.grade}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-slate-600">
                        <span>Score: <strong>{r.obtainedMarks} / {r.totalMarks}</strong></span>
                        <span>Percentage: <strong>{r.percentage}%</strong></span>
                        <span className="text-emerald-600 font-bold">Status: {r.status}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-4 text-center text-slate-400">
                    No examination records published for this student yet.
                  </p>
                )}
              </div>
            )}

            {/* Tab 7: Documents */}
            {profileTab === 'documents' && (
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                  <p className="font-bold text-slate-800">Passport Photo</p>
                  <img src={profileStudent.photo} alt="Photo" className="w-24 h-24 rounded-xl mx-auto object-cover border" />
                  <span className="text-[10px] text-emerald-600 block">Verified Digital Image</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                  <p className="font-bold text-slate-800">Signature Specimen</p>
                  <div className="w-32 h-16 bg-white border border-slate-300 rounded mx-auto flex items-center justify-center font-serif italic text-slate-700 text-sm">
                    {profileStudent.name}
                  </div>
                  <span className="text-[10px] text-emerald-600 block">On Record</span>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ======================= COLLECT FEE MODAL ======================= */}
      {feeStudent && (
        <Modal
          isOpen={Boolean(feeStudent)}
          onClose={() => setFeeStudent(null)}
          title={`Collect Fees - ${feeStudent.name}`}
          maxWidth="md"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Update student paid and due
              const newPaid = feeStudent.paidFee + Number(feeAmount);
              const newDue = Math.max(0, feeStudent.finalFee - newPaid);
              updateStudent(feeStudent.id, {
                paidFee: newPaid,
                dueFee: newDue,
                feesStatus: newDue <= 0 ? 'Paid' : 'Partial',
              });

              // Create receipt
              const receiptNo = `RJT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
              const paymentRecord = {
                id: `pay-${Date.now()}`,
                receiptNo,
                studentId: feeStudent.studentId,
                studentName: feeStudent.name,
                courseName: feeStudent.courseName,
                amount: Number(feeAmount),
                mode: feeMode,
                date: new Date().toISOString().split('T')[0],
                collectedBy: 'RJ TECH Reception',
                remarks: feeRemarks,
              };

              // Close fee modal and trigger receipt print modal
              setFeeStudent(null);
              setActiveReceipt(paymentRecord);
            }}
            className="space-y-4 text-xs"
          >
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900">{feeStudent.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Due Amount:</span>
                <span className="font-bold text-rose-600">₹{feeStudent.dueFee}</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Amount to Collect (₹) *</label>
              <input
                type="number"
                required
                min="100"
                max={feeStudent.dueFee || feeStudent.finalFee}
                value={feeAmount}
                onChange={(e) => setFeeAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-bold text-emerald-700 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Mode *</label>
              <select
                value={feeMode}
                onChange={(e) => setFeeMode(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Cash">Cash at Counter</option>
                <option value="Online (UPI/QR)">Online (UPI / QR Code)</option>
                <option value="Bank Transfer">Direct Bank Transfer</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Remarks</label>
              <input
                type="text"
                value={feeRemarks}
                onChange={(e) => setFeeRemarks(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <Button variant="ghost" size="sm" onClick={() => setFeeStudent(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="success" size="md">
                Generate Official Receipt & Save
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ======================= MANAGE PASSWORD & CREDENTIALS MODAL ======================= */}
      {passwordStudent && (
        <Modal
          isOpen={Boolean(passwordStudent)}
          onClose={() => setPasswordStudent(null)}
          title={`Portal Credentials - ${passwordStudent.name}`}
          maxWidth="md"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateStudent(passwordStudent.id, {
                studentId: credentialStudentId.trim() || passwordStudent.studentId,
                username: credentialUsername.trim() || passwordStudent.username,
                password: credentialPassword.trim() || '123456',
              });
              setPasswordStudent(null);
            }}
            className="space-y-5 text-xs"
          >
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-200/80 rounded-2xl space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src={passwordStudent.photo}
                  alt={passwordStudent.name}
                  className="w-12 h-12 rounded-xl object-cover border border-white shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{passwordStudent.name}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    ID: {passwordStudent.studentId} • Reg: {passwordStudent.registrationNo}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-blue-700 pt-1 border-t border-blue-100">
                You can change the student ID, login username, or set a new password here. The student uses these credentials to log in to the Student Portal.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student ID (Roll / Prefix)</label>
                <input
                  type="text"
                  required
                  value={credentialStudentId}
                  onChange={(e) => setCredentialStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Login Username</label>
                <input
                  type="text"
                  required
                  value={credentialUsername}
                  onChange={(e) => setCredentialUsername(e.target.value.toLowerCase().replace(/\s+/g, '.'))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Login Password</label>
                  <button
                    type="button"
                    onClick={() => setCredentialPassword('RJT' + Math.floor(100000 + Math.random() * 900000))}
                    className="text-[11px] text-blue-600 hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                  >
                    <Sparkles className="w-3 h-3" /> Generate Random
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPasswordInModal ? 'text' : 'password'}
                    required
                    value={credentialPassword}
                    onChange={(e) => setCredentialPassword(e.target.value)}
                    className="w-full pl-3 pr-9 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono font-bold text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordInModal(!showPasswordInModal)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPasswordInModal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Current / New Password for portal access
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" type="button" onClick={() => setPasswordStudent(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" icon={KeyRound}>
                Save Credentials & Password
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ======================= EDIT STUDENT MODAL ======================= */}
      {editingStudent && (
        <Modal
          isOpen={Boolean(editingStudent)}
          onClose={() => setEditingStudent(null)}
          title={`Edit Student - ${editingStudent.name}`}
          maxWidth="2xl"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateStudent(editingStudent.id, {
                name: editingStudent.name,
                phone: editingStudent.phone,
                email: editingStudent.email,
                studentId: editingStudent.studentId,
                username: editingStudent.username,
                password: editingStudent.password,
                status: editingStudent.status,
                courseId: editingStudent.courseId,
                batchId: editingStudent.batchId,
              });
              setEditingStudent(null);
            }}
            className="space-y-4 text-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={editingStudent.phone}
                  onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student ID (Roll Prefix)</label>
                <input
                  type="text"
                  required
                  value={editingStudent.studentId}
                  onChange={(e) => setEditingStudent({ ...editingStudent, studentId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono uppercase font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Portal Username / Login ID</label>
                <input
                  type="text"
                  required
                  value={editingStudent.username || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, username: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Portal Password</label>
                <input
                  type="text"
                  required
                  value={editingStudent.password || '123456'}
                  onChange={(e) => setEditingStudent({ ...editingStudent, password: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Enrollment Status</label>
                <select
                  value={editingStudent.status}
                  onChange={(e) => setEditingStudent({ ...editingStudent, status: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Inactive">Inactive / Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" type="button" onClick={() => setEditingStudent(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit">
                Save Student Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
