import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Student,
  Course,
  Batch,
  FeePayment,
  AttendanceRecord,
  Exam,
  ExamResult,
  Notice,
  StudyMaterial,
  Certificate,
  IncomeExpense,
  ReferralRecord,
  InstituteSettings,
  UserRole,
  StaffMember,
  Schedule,
} from '../types';
import {
  initialInstituteSettings,
  initialUsers,
  initialCourses,
  initialBatches,
  initialStudents,
  initialPayments,
  initialAttendance,
  initialExams,
  initialResults,
  initialCertificates,
  initialNotices,
  initialStudyMaterials,
  initialIncomeExpense,
  initialReferrals,
  initialSchedules,
  initialEnquiries,
} from '../data/mockData';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface AppContextType {
  // Auth
  currentUser: User | null;
  currentRole: UserRole | 'GUEST';
  setCurrentRole: (role: UserRole | 'GUEST' | string) => void;
  currentStudent: Student | null;
  setCurrentStudent: (student: Student | null) => void;
  login: (username: string, role: UserRole) => boolean;
  loginAsStudent: (studentIdentifier: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  // Institute Settings
  settings: InstituteSettings;
  updateSettings: (newSettings: Partial<InstituteSettings>) => void;

  // Data collections & CRUD
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'registrationNo' | 'studentId' | 'rollNo'> & Partial<Student>) => Student;
  updateStudent: (id: string, updated: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  courses: Course[];
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, updated: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  batches: Batch[];
  addBatch: (batch: Omit<Batch, 'id' | 'currentStudents'>) => void;
  updateBatch: (id: string, updated: Partial<Batch>) => void;
  deleteBatch: (id: string) => void;

  payments: FeePayment[];
  collectFee: (payment: Omit<FeePayment, 'id' | 'receiptNo'>) => FeePayment;
  addPayment: (payment: any) => FeePayment;

  attendance: AttendanceRecord[];
  attendanceRecords: AttendanceRecord[];
  markAttendance: (
    recordOrStudentId: any,
    status?: any,
    batchId?: string,
    date?: string
  ) => { success: boolean; message: string };

  exams: Exam[];
  addExam: (exam: any) => void;

  results: ExamResult[];
  addResult: (result: any) => void;

  certificates: Certificate[];
  issueCertificate: (certOrStudentId: any, grade?: string) => Certificate;
  generateCertificate: (certOrStudentId: any, grade?: string) => Certificate;
  verifyCertificate: (certNo: string) => Certificate | null;

  notices: Notice[];
  addNotice: (notice: any) => void;
  deleteNotice: (id: string) => void;

  studyMaterials: StudyMaterial[];
  addStudyMaterial: (material: Omit<StudyMaterial, 'id' | 'uploadDate'>) => void;
  deleteStudyMaterial: (id: string) => void;

  incomeExpenses: IncomeExpense[];
  expenses: IncomeExpense[];
  addIncomeExpense: (entry: Omit<IncomeExpense, 'id'>) => void;
  addExpense: (expense: any) => void;
  deleteExpense: (id: string) => void;

  referrals: ReferralRecord[];

  // Staff
  staff: StaffMember[];
  addStaff: (staffMember: Omit<StaffMember, 'id'>) => void;
  deleteStaff: (id: string) => void;
  resetToDemoData: () => void;

  // Schedules and Enquiries
  schedules: Schedule[];
  enquiries: any[];
  addEnquiry?: (enquiry: any) => void;

  // Navigation / View State
  activeView: string;
  setActiveView: (view: string) => void;
  activeSubView: string;
  setActiveSubView: (view: string) => void;
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;

  // Printable receipt state
  activeReceipt: FeePayment | null;
  setActiveReceipt: (receipt: FeePayment | null) => void;

  // Printable certificate state
  activeCertificate: Certificate | null;
  setActiveCertificate: (cert: Certificate | null) => void;

  // Printable ID card state
  activeIDCardStudent: Student | null;
  setActiveIDCardStudent: (student: Student | null) => void;
  activeIdCard: Student | null;
  setActiveIdCard: (student: Student | null) => void;

  // Printable Exam Result state
  activeExamResult: ExamResult | null;
  setActiveExamResult: (result: ExamResult | null) => void;
  activeResultModal: ExamResult | null;
  setActiveResultModal: (result: ExamResult | null) => void;

  // WhatsApp Modal state
  whatsAppDialog: { isOpen: boolean; phone: string; message: string; title: string } | null;
  setWhatsAppDialog: React.Dispatch<
    React.SetStateAction<{ isOpen: boolean; phone: string; message: string; title: string } | null>
  >;
  openWhatsAppDialog: (phone: string, message: string, title: string) => void;
  closeWhatsAppDialog: () => void;

  // Toasts
  toasts: Toast[];
  showToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load or use mock data
  const [settings, setSettings] = useState<InstituteSettings>(() => {
    const saved = localStorage.getItem('rjtech_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...initialInstituteSettings,
          ...parsed,
          logoUrl: parsed.logoUrl || '/rj_tech_logo.jpg',
        };
      } catch (e) {
        return initialInstituteSettings;
      }
    }
    return initialInstituteSettings;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('rjtech_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('rjtech_courses');
    return saved ? JSON.parse(saved) : initialCourses;
  });

  const [batches, setBatches] = useState<Batch[]>(() => {
    const saved = localStorage.getItem('rjtech_batches');
    return saved ? JSON.parse(saved) : initialBatches;
  });

  const [payments, setPayments] = useState<FeePayment[]>(() => {
    const saved = localStorage.getItem('rjtech_payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('rjtech_attendance');
    return saved ? JSON.parse(saved) : initialAttendance;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('rjtech_exams');
    return saved ? JSON.parse(saved) : initialExams;
  });

  const [results, setResults] = useState<ExamResult[]>(() => {
    const saved = localStorage.getItem('rjtech_results');
    return saved ? JSON.parse(saved) : initialResults;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('rjtech_certificates');
    return saved ? JSON.parse(saved) : initialCertificates;
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('rjtech_notices');
    return saved ? JSON.parse(saved) : initialNotices;
  });

  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem('rjtech_study_materials');
    return saved ? JSON.parse(saved) : initialStudyMaterials;
  });

  const [incomeExpenses, setIncomeExpenses] = useState<IncomeExpense[]>(() => {
    const saved = localStorage.getItem('rjtech_income_expense');
    return saved ? JSON.parse(saved) : initialIncomeExpense;
  });

  const [referrals, setReferrals] = useState<ReferralRecord[]>(() => {
    const saved = localStorage.getItem('rjtech_referrals');
    return saved ? JSON.parse(saved) : initialReferrals;
  });

  const [schedules, setSchedules] = useState<Schedule[]>(() => {
    const saved = localStorage.getItem('rjtech_schedules');
    return saved ? JSON.parse(saved) : initialSchedules;
  });

  const [enquiries, setEnquiries] = useState<any[]>(() => {
    const saved = localStorage.getItem('rjtech_enquiries');
    return saved ? JSON.parse(saved) : initialEnquiries;
  });

  // User auth state: default to public site ("public_home") or easily login
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('rjtech_user');
    return saved ? JSON.parse(saved) : null;
  });

  const initialStaffList: StaffMember[] = [
    {
      id: 'st-1',
      name: 'B. Maji',
      role: 'Admin',
      email: 'director@rjtech.edu',
      phone: '9635302734',
      specialization: 'Institute Director & Lead Coordinator',
      joinDate: '2020-01-15',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'st-2',
      name: 'R. K. Jana',
      role: 'Faculty',
      email: 'jana.faculty@rjtech.edu',
      phone: '9635302734',
      specialization: 'ADCA, DCA & Tally Prime Instructor',
      joinDate: '2021-04-10',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'st-3',
      name: 'S. Bera',
      role: 'Lab Assistant',
      email: 'bera.lab@rjtech.edu',
      phone: '9635302734',
      specialization: 'Lab Maintenance & Bengali/English Typing Master',
      joinDate: '2022-07-01',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'st-4',
      name: 'P. Samanta',
      role: 'Counselor',
      email: 'samanta.admissions@rjtech.edu',
      phone: '9635302734',
      specialization: 'Student Counseling, Admissions & Fee Desk',
      joinDate: '2023-02-15',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('rjtech_staff');
    return saved ? JSON.parse(saved) : initialStaffList;
  });

  // Current view controller
  const [activeView, setActiveView] = useState<string>('public_home');
  const [activeSubView, setActiveSubView] = useState<string>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Modals / Preview cards
  const [activeReceipt, setActiveReceipt] = useState<FeePayment | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  const [activeIDCardStudent, setActiveIDCardStudent] = useState<Student | null>(null);
  const [activeExamResult, setActiveExamResult] = useState<ExamResult | null>(null);
  const [whatsAppDialog, setWhatsAppDialog] = useState<{ isOpen: boolean; phone: string; message: string; title: string } | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('rjtech_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('rjtech_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('rjtech_batches', JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem('rjtech_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('rjtech_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('rjtech_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('rjtech_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('rjtech_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rjtech_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('rjtech_user');
    }
  }, [currentUser]);

  const showToast = (type: Toast['type'], message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth functions
  const login = (username: string, role: UserRole): boolean => {
    const existing = initialUsers.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.role === role
    );
    if (existing) {
      setCurrentUser(existing);
      showToast('success', `Welcome back, ${existing.name}!`);
      if (role === 'ADMIN' || role === 'STAFF') {
        setActiveView('admin_dashboard');
      } else {
        setActiveView('student_dashboard');
      }
      return true;
    }

    // Dynamic login fallback for any registered student
    if (role === 'STUDENT') {
      const studentMatch = students.find(
        (s) =>
          s.studentId.toLowerCase() === username.toLowerCase() ||
          s.username.toLowerCase() === username.toLowerCase() ||
          s.phone === username
      );
      if (studentMatch) {
        const studentUser: User = {
          id: `u-${studentMatch.studentId}`,
          username: studentMatch.username,
          name: studentMatch.name,
          email: studentMatch.email,
          role: 'STUDENT',
          studentId: studentMatch.studentId,
          avatar: studentMatch.photo,
        };
        setCurrentUser(studentUser);
        showToast('success', `Welcome, ${studentMatch.name}!`);
        setActiveView('student_dashboard');
        return true;
      }
    }

    // Default mock user if typed general credentials
    const newUser: User = {
      id: `u-${Date.now()}`,
      username,
      name: role === 'ADMIN' ? 'Director (Admin)' : role === 'STAFF' ? 'Staff Instructor' : 'Student',
      email: `${username}@rjtech.edu`,
      role,
      studentId: role === 'STUDENT' ? 'RJT-1001' : undefined,
    };
    setCurrentUser(newUser);
    showToast('success', `Logged in as ${newUser.name} (${role})`);
    setActiveView(role === 'STUDENT' ? 'student_dashboard' : 'admin_dashboard');
    return true;
  };

  const loginAsStudent = (studentIdentifier: string): boolean => {
    const student = students.find(
      (s) =>
        s.studentId.toLowerCase() === studentIdentifier.toLowerCase() ||
        s.username.toLowerCase() === studentIdentifier.toLowerCase() ||
        s.phone === studentIdentifier ||
        s.registrationNo.toLowerCase() === studentIdentifier.toLowerCase()
    );

    if (student) {
      const user: User = {
        id: `u-${student.studentId}`,
        username: student.username,
        name: student.name,
        email: student.email,
        role: 'STUDENT',
        studentId: student.studentId,
        avatar: student.photo,
      };
      setCurrentUser(user);
      showToast('success', `Welcome, ${student.name}!`);
      setActiveView('student_dashboard');
      return true;
    }

    showToast('error', 'Student ID or Registration number not found.');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('info', 'You have been safely logged out.');
    setActiveView('public_home');
  };

  const switchRole = (role: UserRole) => {
    if (role === 'ADMIN') {
      login('admin', 'ADMIN');
    } else if (role === 'STAFF') {
      login('staff', 'STAFF');
    } else {
      login('rahul.das', 'STUDENT');
    }
  };

  const currentRole: UserRole | 'GUEST' = currentUser ? currentUser.role : 'GUEST';

  const currentStudent =
    currentUser && currentUser.role === 'STUDENT'
      ? students.find((s) => s.studentId === currentUser.studentId) || students[0]
      : null;

  // Settings
  const updateSettings = (newSettings: Partial<InstituteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('success', 'Institute settings updated successfully.');
  };

  // Student CRUD
  const addStudent = (studentData: Omit<Student, 'id' | 'registrationNo' | 'studentId' | 'rollNo'> & Partial<Student>): Student => {
    const count = students.length + 1;
    const padded = String(count).padStart(3, '0');
    const newStudentId = studentData.studentId || `${settings.studentIdPrefix}${1000 + count}`;
    const newRegNo = studentData.registrationNo || `${settings.regPrefix}2026/${padded}`;
    const newRollNo = studentData.rollNo || `RJT-${String(count).padStart(2, '0')}`;
    const referralCode = `RJTECH${Math.floor(100000 + Math.random() * 900000)}`;

    const newStudent: Student = {
      id: `s-${Date.now()}`,
      studentId: newStudentId,
      registrationNo: newRegNo,
      rollNo: newRollNo,
      name: studentData.name,
      dob: studentData.dob || '2005-01-01',
      gender: studentData.gender || 'Male',
      photo:
        studentData.photo ||
        (studentData.gender === 'Female'
          ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'),
      fatherName: studentData.fatherName || '',
      motherName: studentData.motherName || '',
      phone: studentData.phone,
      whatsapp: studentData.whatsapp || studentData.phone,
      email: studentData.email || `${studentData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      address: studentData.address || `${studentData.village || ''}, ${studentData.postOffice || ''}`,
      village: studentData.village || 'Hurinan',
      postOffice: studentData.postOffice || 'Joybalarampur',
      district: studentData.district || 'Purba Medinipur',
      state: studentData.state || 'West Bengal',
      pinCode: studentData.pinCode || '721137',
      courseId: studentData.courseId,
      courseName: studentData.courseName,
      batchId: studentData.batchId,
      batchName: studentData.batchName,
      session: studentData.session || settings.currentSession,
      admissionDate: studentData.admissionDate || new Date().toISOString().split('T')[0],
      totalFee: studentData.totalFee,
      discount: studentData.discount || 0,
      finalFee: studentData.finalFee,
      paidFee: studentData.paidFee || 0,
      dueFee: studentData.finalFee - (studentData.paidFee || 0),
      status: 'Active',
      feesStatus: (studentData.paidFee || 0) >= studentData.finalFee ? 'Paid' : (studentData.paidFee || 0) > 0 ? 'Partial' : 'Overdue',
      referralCode,
      username: studentData.username || studentData.name.toLowerCase().replace(/\s+/g, '.') + String(count),
      referredBy: studentData.referredBy,
    };

    setStudents((prev) => [newStudent, ...prev]);

    // If initial fee was paid, auto-record payment
    if (newStudent.paidFee > 0) {
      const receiptNo = `${settings.receiptPrefix}${String(payments.length + 1).padStart(3, '0')}`;
      const newPayment: FeePayment = {
        id: `p-${Date.now()}`,
        receiptNo,
        studentId: newStudent.studentId,
        studentName: newStudent.name,
        registrationNo: newStudent.registrationNo,
        courseName: newStudent.courseName,
        amount: newStudent.paidFee,
        date: newStudent.admissionDate,
        paymentMethod: 'Cash',
        previousDue: newStudent.finalFee,
        remainingDue: newStudent.dueFee,
        receivedBy: currentUser?.name || 'Director, RJ TECH',
        remarks: 'Online / Admission Initial Fee',
      };
      setPayments((prev) => [newPayment, ...prev]);
    }

    // If referred by a code, register referral commission
    if (studentData.referredBy) {
      const referrer = students.find((s) => s.referralCode === studentData.referredBy);
      if (referrer) {
        const newRef: ReferralRecord = {
          id: `ref-${Date.now()}`,
          referrerStudentId: referrer.studentId,
          referrerName: referrer.name,
          referrerCode: referrer.referralCode || studentData.referredBy,
          applicantName: newStudent.name,
          applicantCourse: newStudent.courseName,
          date: newStudent.admissionDate,
          commission: settings.referralBonusAmount || 250,
          status: 'Approved',
        };
        setReferrals((prev) => [newRef, ...prev]);
      }
    }

    showToast('success', `Student ${newStudent.name} admitted successfully! ID: ${newStudent.studentId}`);
    return newStudent;
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((st) => {
        if (st.id === id) {
          const finalFee = updated.finalFee !== undefined ? updated.finalFee : st.finalFee;
          const paidFee = updated.paidFee !== undefined ? updated.paidFee : st.paidFee;
          const dueFee = finalFee - paidFee;
          const feesStatus = dueFee <= 0 ? 'Paid' : paidFee > 0 ? 'Partial' : 'Overdue';
          return {
            ...st,
            ...updated,
            finalFee,
            paidFee,
            dueFee,
            feesStatus,
          };
        }
        return st;
      })
    );
    showToast('success', 'Student record updated successfully.');
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    showToast('info', 'Student deleted.');
  };

  // Course CRUD
  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      id: `c-${Date.now()}`,
      ...courseData,
    };
    setCourses((prev) => [...prev, newCourse]);
    showToast('success', `Course "${courseData.name}" added successfully.`);
  };

  const updateCourse = (id: string, updated: Partial<Course>) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    showToast('success', 'Course details updated.');
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    showToast('info', 'Course removed.');
  };

  // Batch CRUD
  const addBatch = (batchData: Omit<Batch, 'id' | 'currentStudents'>) => {
    const newBatch: Batch = {
      id: `b-${Date.now()}`,
      ...batchData,
      currentStudents: 0,
    };
    setBatches((prev) => [...prev, newBatch]);
    showToast('success', `Batch "${batchData.name}" created.`);
  };

  const updateBatch = (id: string, updated: Partial<Batch>) => {
    setBatches((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
    showToast('success', 'Batch updated.');
  };

  const deleteBatch = (id: string) => {
    setBatches((prev) => prev.filter((b) => b.id !== id));
    showToast('info', 'Batch deleted.');
  };

  // Fee collection
  const collectFee = (paymentData: Omit<FeePayment, 'id' | 'receiptNo'>): FeePayment => {
    const receiptNo = `${settings.receiptPrefix}${String(payments.length + 1).padStart(3, '0')}`;
    const newPayment: FeePayment = {
      id: `p-${Date.now()}`,
      receiptNo,
      ...paymentData,
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Update student paid and due balances
    setStudents((prev) =>
      prev.map((s) => {
        if (s.studentId === paymentData.studentId) {
          const newPaid = s.paidFee + paymentData.amount;
          const newDue = Math.max(0, s.finalFee - newPaid);
          const feesStatus = newDue <= 0 ? 'Paid' : 'Partial';
          return {
            ...s,
            paidFee: newPaid,
            dueFee: newDue,
            feesStatus,
          };
        }
        return s;
      })
    );

    // Also record under income
    const newIncome: IncomeExpense = {
      id: `ie-${Date.now()}`,
      type: 'Income',
      category: 'Course Fees Collection',
      title: `Fee collection: ${paymentData.studentName} (${paymentData.courseName})`,
      amount: paymentData.amount,
      date: paymentData.date,
      paymentMethod: paymentData.paymentMethod || 'Cash',
      receiptOrVoucherNo: receiptNo,
    };
    setIncomeExpenses((prev) => [newIncome, ...prev]);

    showToast('success', `Payment of ₹${paymentData.amount} recorded. Receipt: ${receiptNo}`);
    return newPayment;
  };

  // Attendance
  const markAttendance = (
    first: any,
    maybeStatus?: string,
    maybeBatchId?: string,
    maybeDate?: string
  ): { success: boolean; message: string } => {
    let recordData: Omit<AttendanceRecord, 'id'>;

    if (typeof first === 'string') {
      const studentId = first;
      const st = students.find((s) => s.id === studentId || s.studentId === studentId);
      const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      recordData = {
        studentId: st ? st.studentId : studentId,
        studentName: st ? st.name : 'Student',
        registrationNo: st ? st.registrationNo : 'REG',
        courseName: st ? st.courseName : 'Course',
        batchName: st ? st.batchName : (maybeBatchId || 'Batch'),
        date: maybeDate || new Date().toISOString().split('T')[0],
        inTime: currentTime,
        time: currentTime,
        status: (maybeStatus as any) || 'Present',
        method: 'Manual',
      };
    } else {
      const currentTime = first.inTime || first.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      recordData = {
        ...first,
        inTime: currentTime,
        time: currentTime,
      };
    }

    // Check duplicate attendance for this student on this date
    const alreadyMarked = attendance.find(
      (a) => a.studentId === recordData.studentId && a.date === recordData.date
    );

    if (alreadyMarked) {
      if (recordData.outTime && !alreadyMarked.outTime) {
        // Update OUT time
        setAttendance((prev) =>
          prev.map((a) => (a.id === alreadyMarked.id ? { ...a, outTime: recordData.outTime } : a))
        );
        showToast('success', `Out-Time recorded for ${recordData.studentName} at ${recordData.outTime}`);
        return { success: true, message: `Out-Time marked at ${recordData.outTime}` };
      }
      showToast('warning', `Attendance already recorded for ${recordData.studentName} today at ${alreadyMarked.inTime || alreadyMarked.time}!`);
      return { success: false, message: `Duplicate entry! Already marked today.` };
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      ...recordData,
    };

    setAttendance((prev) => [newRecord, ...prev]);
    showToast('success', `Attendance marked for ${recordData.studentName} (${recordData.status})`);
    return { success: true, message: `Attendance marked successfully!` };
  };

  // Exams
  const addExam = (examData: any) => {
    const newExam: Exam = {
      id: `ex-${Date.now()}`,
      name: examData.name || examData.title || 'Exam',
      title: examData.title || examData.name || 'Exam',
      courseId: examData.courseId || '',
      courseName: examData.courseName || '',
      batchId: examData.batchId || '',
      batchName: examData.batchName || '',
      subject: examData.subject || examData.title || 'Computer Science',
      date: examData.date || new Date().toISOString().split('T')[0],
      time: examData.time || '10:00 AM',
      duration: examData.duration || '2 Hours',
      totalMarks: Number(examData.totalMarks || 100),
      passMarks: Number(examData.passMarks || examData.passingMarks || 40),
      passingMarks: Number(examData.passingMarks || examData.passMarks || 40),
      theoryMarks: Number(examData.theoryMarks || 50),
      practicalMarks: Number(examData.practicalMarks || 40),
      vivaMarks: Number(examData.vivaMarks || 10),
      status: examData.status || 'Upcoming',
    };
    setExams((prev) => [...prev, newExam]);
    showToast('success', `Exam "${newExam.name}" created.`);
  };

  // Results
  const addResult = (resultData: any) => {
    const fullMarks = Number(resultData.fullMarks || resultData.totalMarks || 100);
    const obtainedMarks = Number(resultData.obtainedMarks || 0);
    const percentage = resultData.percentage !== undefined ? resultData.percentage : Math.round((obtainedMarks / fullMarks) * 100);
    let grade = resultData.grade || 'F';
    let result: 'Pass' | 'Fail' = (resultData.result === 'Pass' || resultData.status === 'Pass' || percentage >= 40) ? 'Pass' : 'Fail';

    if (!resultData.grade) {
      if (percentage >= 90) grade = 'O (Outstanding)';
      else if (percentage >= 80) grade = 'A+';
      else if (percentage >= 70) grade = 'A';
      else if (percentage >= 60) grade = 'B+';
      else if (percentage >= 50) grade = 'B';
      else if (percentage >= 40) grade = 'C';
    }

    const newResult: ExamResult = {
      id: `res-${Date.now()}`,
      examId: resultData.examId || '',
      examName: resultData.examName || resultData.examTitle || 'Exam',
      examTitle: resultData.examTitle || resultData.examName || 'Exam',
      studentId: resultData.studentId || '',
      studentName: resultData.studentName || '',
      rollNo: resultData.rollNo || '',
      registrationNo: resultData.registrationNo || '',
      courseName: resultData.courseName || '',
      batchName: resultData.batchName || '',
      subject: resultData.subject || '',
      fullMarks,
      totalMarks: fullMarks,
      obtainedMarks,
      theoryMarks: resultData.theoryMarks,
      practicalMarks: resultData.practicalMarks,
      vivaMarks: resultData.vivaMarks,
      percentage,
      grade,
      result,
      status: result,
      examDate: resultData.examDate || resultData.date || new Date().toISOString().split('T')[0],
      date: resultData.date || resultData.examDate || new Date().toISOString().split('T')[0],
      evaluatedBy: resultData.evaluatedBy || 'RJ TECH Academic Council',
    };

    setResults((prev) => [newResult, ...prev]);
    showToast('success', `Result generated for ${newResult.studentName}: ${percentage}% (${grade}) - ${result}`);
  };

  // Certificates
  const issueCertificate = (certDataOrStudentId: any, maybeGrade?: string): Certificate => {
    let certPayload: Omit<Certificate, 'id' | 'certificateNo' | 'verificationUrl'>;
    if (typeof certDataOrStudentId === 'string') {
      const st = students.find((s) => s.id === certDataOrStudentId || s.studentId === certDataOrStudentId);
      const grade = maybeGrade || 'A+';
      const pctMap: Record<string, number> = { 'O (Outstanding)': 95, 'A+': 88, 'A': 78, 'B+': 68, 'B': 58, 'C': 48, 'F': 35 };
      certPayload = {
        studentId: st ? st.id : certDataOrStudentId,
        studentName: st ? st.name : 'Student',
        registrationNo: st ? st.registrationNo : 'RJ-REG',
        courseName: st ? st.courseName : 'Advanced Computer Training',
        courseDuration: '6 Months',
        duration: '6 Months',
        issueDate: new Date().toISOString().split('T')[0],
        grade,
        percentage: pctMap[grade] || 85,
        directorName: settings.directorName || 'Director, RJ TECH',
        status: 'Issued',
      };
    } else {
      certPayload = certDataOrStudentId;
    }

    const count = certificates.length + 1;
    const certNo = `${settings.certificatePrefix}${String(count).padStart(5, '0')}`;
    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      certificateNo: certNo,
      ...certPayload,
      verificationUrl: `${settings.website}/verify?cert=${certNo}`,
      status: 'Issued',
    };
    setCertificates((prev) => [newCert, ...prev]);
    showToast('success', `Certificate ${certNo} issued to ${newCert.studentName}`);
    return newCert;
  };

  const verifyCertificate = (certNo: string): Certificate | null => {
    const trimmed = certNo.trim().toUpperCase();
    return certificates.find((c) => c.certificateNo.toUpperCase() === trimmed) || null;
  };

  // Notices
  const addNotice = (noticeData: Omit<Notice, 'id' | 'date'>) => {
    const newNotice: Notice = {
      id: `not-${Date.now()}`,
      ...noticeData,
      date: new Date().toISOString().split('T')[0],
    };
    setNotices((prev) => [newNotice, ...prev]);
    showToast('success', 'New notice published.');
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    showToast('info', 'Notice removed.');
  };

  // Study Materials
  const addStudyMaterial = (data: Omit<StudyMaterial, 'id' | 'uploadDate'>) => {
    const newSM: StudyMaterial = {
      id: `sm-${Date.now()}`,
      ...data,
      uploadDate: new Date().toISOString().split('T')[0],
    };
    setStudyMaterials((prev) => [newSM, ...prev]);
    showToast('success', `Material "${data.title}" added for ${data.courseName}.`);
  };

  const deleteStudyMaterial = (id: string) => {
    setStudyMaterials((prev) => prev.filter((sm) => sm.id !== id));
    showToast('info', 'Study material deleted.');
  };

  // Income & Expenses
  const addIncomeExpense = (entryData: Omit<IncomeExpense, 'id'>) => {
    const newEntry: IncomeExpense = {
      id: `ie-${Date.now()}`,
      ...entryData,
    };
    setIncomeExpenses((prev) => [newEntry, ...prev]);
    showToast('success', `${entryData.type} entry of ₹${entryData.amount} recorded.`);
  };

  // WhatsApp dialog
  const openWhatsAppDialog = (phone: string, message: string, title: string) => {
    setWhatsAppDialog({
      isOpen: true,
      phone: phone.replace(/[^0-9]/g, ''),
      message,
      title,
    });
  };

  const closeWhatsAppDialog = () => {
    setWhatsAppDialog(null);
  };

  // Staff management
  const addStaff = (staffMember: Omit<StaffMember, 'id'>) => {
    const newStaff: StaffMember = {
      id: `st-${Date.now()}`,
      ...staffMember,
    };
    setStaff((prev) => [...prev, newStaff]);
    showToast('success', `Staff member "${staffMember.name}" added.`);
  };

  const deleteStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
    showToast('info', 'Staff member deleted.');
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setSettings(initialInstituteSettings);
    setStudents(initialStudents);
    setCourses(initialCourses);
    setBatches(initialBatches);
    setPayments(initialPayments);
    setAttendance(initialAttendance);
    setExams(initialExams);
    setResults(initialResults);
    setCertificates(initialCertificates);
    setNotices(initialNotices);
    setStudyMaterials(initialStudyMaterials);
    setIncomeExpenses(initialIncomeExpense);
    setReferrals(initialReferrals);
    setStaff(initialStaffList);
    showToast('info', 'Database reset to default institute demo records.');
  };

  const setCurrentStudent = (st: Student | null) => {
    if (st) {
      setCurrentUser({
        id: `u-${st.studentId}`,
        username: st.username,
        name: st.name,
        email: st.email,
        role: 'STUDENT',
        studentId: st.studentId,
        avatar: st.photo,
      });
    } else {
      setCurrentUser(null);
    }
  };

  const setCurrentRole = (role: UserRole | 'GUEST' | string) => {
    if (role === 'GUEST' || role === 'PUBLIC') {
      logout();
    } else {
      switchRole(role as UserRole);
    }
  };

  const expenses = incomeExpenses.filter((ie) => ie.type === 'Expense');
  const attendanceRecords = attendance;

  const addExpense = (expense: any) => {
    addIncomeExpense({
      type: 'Expense',
      category: expense.category || 'Operational Expense',
      title: expense.title || expense.description || 'Expense',
      amount: Number(expense.amount),
      date: expense.date || new Date().toISOString().split('T')[0],
      paymentMethod: expense.paymentMethod || expense.paymentMode || 'Cash',
      receiptOrVoucherNo: expense.receiptOrVoucherNo || expense.voucherNo || `VOUCH-${Date.now()}`,
      description: expense.description,
      paidTo: expense.paidTo,
      remarks: expense.remarks,
    });
  };

  const deleteExpense = (id: string) => {
    setIncomeExpenses((prev) => prev.filter((ie) => ie.id !== id));
    showToast('info', 'Expense entry removed.');
  };

  const addEnquiry = (enq: any) => {
    const newEnq = {
      id: `enq-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'New',
      ...enq,
    };
    setEnquiries((prev) => [newEnq, ...prev]);
    showToast('success', 'Enquiry recorded.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        currentStudent,
        setCurrentStudent,
        login,
        loginAsStudent,
        logout,
        switchRole,
        settings,
        updateSettings,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        batches,
        addBatch,
        updateBatch,
        deleteBatch,
        payments,
        collectFee,
        addPayment: collectFee,
        attendance,
        attendanceRecords,
        markAttendance,
        exams,
        addExam,
        results,
        addResult,
        certificates,
        issueCertificate,
        generateCertificate: issueCertificate,
        verifyCertificate,
        notices,
        addNotice,
        deleteNotice,
        studyMaterials,
        addStudyMaterial,
        deleteStudyMaterial,
        incomeExpenses,
        expenses,
        addIncomeExpense,
        addExpense,
        deleteExpense,
        referrals,
        staff,
        addStaff,
        deleteStaff,
        resetToDemoData,
        schedules,
        enquiries,
        addEnquiry,
        activeView,
        setActiveView,
        activeSubView,
        setActiveSubView,
        selectedStudentId,
        setSelectedStudentId,
        activeReceipt,
        setActiveReceipt,
        activeCertificate,
        setActiveCertificate,
        activeIDCardStudent,
        setActiveIDCardStudent,
        activeIdCard: activeIDCardStudent,
        setActiveIdCard: setActiveIDCardStudent,
        activeExamResult,
        setActiveExamResult,
        activeResultModal: activeExamResult,
        setActiveResultModal: setActiveExamResult,
        whatsAppDialog,
        setWhatsAppDialog,
        openWhatsAppDialog,
        closeWhatsAppDialog,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
