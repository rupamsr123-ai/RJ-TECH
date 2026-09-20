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
import { db, auth } from '../firebase/config';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth';
import { deleteStudentAndRelatedData } from '../firebase/services';

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
  loginAsStudent: (studentIdentifier: string, passwordInput?: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateAdminProfile: (profile: { name?: string; avatar?: string; email?: string }) => void;
  changeStudentPassword: (studentId: string, newPassword: string) => void;

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
  updateStaff: (id: string, updated: Partial<StaffMember>) => void;
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

  // One-time purge of legacy mock data in browser storage
  useEffect(() => {
    const legacyPurged = localStorage.getItem('rjtech_pure_prod_v2');
    if (!legacyPurged) {
      localStorage.removeItem('rjtech_students');
      localStorage.removeItem('rjtech_payments');
      localStorage.removeItem('rjtech_attendance');
      localStorage.removeItem('rjtech_exams');
      localStorage.removeItem('rjtech_results');
      localStorage.removeItem('rjtech_certificates');
      localStorage.removeItem('rjtech_study_materials');
      localStorage.removeItem('rjtech_income_expense');
      localStorage.removeItem('rjtech_referrals');
      localStorage.removeItem('rjtech_schedules');
      localStorage.removeItem('rjtech_enquiries');
      localStorage.setItem('rjtech_pure_prod_v2', 'true');
    }
  }, []);

  const [students, setStudents] = useState<Student[]>([]);

  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('rjtech_courses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return initialCourses;
  });

  const [batches, setBatches] = useState<Batch[]>(() => {
    try {
      const saved = localStorage.getItem('rjtech_batches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return initialBatches;
  });

  const [payments, setPayments] = useState<FeePayment[]>([]);

  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  const [exams, setExams] = useState<Exam[]>([]);

  const [results, setResults] = useState<ExamResult[]>([]);

  const [certificates, setCertificates] = useState<Certificate[]>([]);

  const [notices, setNotices] = useState<Notice[]>([]);

  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);

  const [incomeExpenses, setIncomeExpenses] = useState<IncomeExpense[]>([]);

  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);

  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const [enquiries, setEnquiries] = useState<any[]>([]);

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

  // Real-time synchronization with Firebase Firestore
  useEffect(() => {
    // 1. Students listener
    const unsubStudents = onSnapshot(collection(db, 'students'), (snap) => {
      if (!snap.empty) {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as Student))
          .filter((s) => {
            const isDemo =
              s.name === 'Rahul Das' ||
              s.name === 'Priya Jana' ||
              s.name === 'Riya Sahoo' ||
              s.name === 'Arindam Maity' ||
              s.id === 's-1001' ||
              s.id === 's-1002' ||
              s.studentId === 'RJT-1001' ||
              s.studentId === 'RJT-1002' ||
              s.name?.toLowerCase().includes('demo');
            if (isDemo) {
              deleteDoc(doc(db, 'students', s.id)).catch(() => {});
              return false;
            }
            return true;
          });
        setStudents(list);
      } else {
        setStudents([]);
      }
    }, (err) => {
      console.warn('Firestore students sync notice:', err);
    });

    // 2. Payments listener
    const unsubPayments = onSnapshot(collection(db, 'payments'), (snap) => {
      if (!snap.empty) {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as FeePayment))
          .filter((p) => {
            const isDemo =
              p.studentName === 'Rahul Das' ||
              p.studentName === 'Priya Jana' ||
              p.studentId === 'RJT-1001' ||
              p.studentId === 'RJT-1002';
            if (isDemo) {
              deleteDoc(doc(db, 'payments', p.id)).catch(() => {});
              return false;
            }
            return true;
          });
        setPayments(list);
      } else {
        setPayments([]);
      }
    }, (err) => {
      console.warn('Firestore payments sync notice:', err);
    });

    // 3. Attendance listener
    const unsubAttendance = onSnapshot(collection(db, 'attendance'), (snap) => {
      if (!snap.empty) {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as AttendanceRecord))
          .filter((a) => {
            const isDemo =
              a.studentName === 'Rahul Das' ||
              a.studentName === 'Priya Jana' ||
              a.studentId === 'RJT-1001' ||
              a.studentId === 'RJT-1002';
            if (isDemo) {
              deleteDoc(doc(db, 'attendance', a.id)).catch(() => {});
              return false;
            }
            return true;
          });
        setAttendance(list);
      } else {
        setAttendance([]);
      }
    }, (err) => {
      console.warn('Firestore attendance sync notice:', err);
    });

    // 4. Courses listener
    const unsubCourses = onSnapshot(collection(db, 'courses'), (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Course));
        setCourses(list);
      } else {
        // Seed standard accredited courses into Firestore if brand new installation
        initialCourses.forEach((c) => {
          setDoc(doc(db, 'courses', c.id), c).catch(() => {});
        });
      }
    }, (err) => {
      console.warn('Firestore courses sync notice:', err);
    });

    // 5. Batches listener
    const unsubBatches = onSnapshot(collection(db, 'batches'), (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Batch));
        setBatches(list);
      } else {
        initialBatches.forEach((b) => {
          setDoc(doc(db, 'batches', b.id), b).catch(() => {});
        });
      }
    }, (err) => {
      console.warn('Firestore batches sync notice:', err);
    });

    // 6. Exams listener
    const unsubExams = onSnapshot(collection(db, 'exams'), (snap) => {
      if (!snap.empty) {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as Exam))
          .filter((e) => {
            if (e.id === 'exam-1' || e.name?.includes('Mid-Term (Demo)')) {
              deleteDoc(doc(db, 'exams', e.id)).catch(() => {});
              return false;
            }
            return true;
          });
        setExams(list);
      } else {
        setExams([]);
      }
    }, (err) => {
      console.warn('Firestore exams sync notice:', err);
    });

    // 7. Results listener
    const unsubResults = onSnapshot(collection(db, 'results'), (snap) => {
      if (!snap.empty) {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as ExamResult))
          .filter((r) => {
            const isDemo =
              r.studentName === 'Rahul Das' ||
              r.studentName === 'Priya Jana' ||
              r.studentId === 'RJT-1001' ||
              r.studentId === 'RJT-1002' ||
              r.id === 'res-1';
            if (isDemo) {
              deleteDoc(doc(db, 'results', r.id)).catch(() => {});
              return false;
            }
            return true;
          });
        setResults(list);
      } else {
        setResults([]);
      }
    }, (err) => {
      console.warn('Firestore results sync notice:', err);
    });

    // 8. Certificates listener
    const unsubCertificates = onSnapshot(collection(db, 'certificates'), (snap) => {
      if (!snap.empty) {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as Certificate))
          .filter((c) => {
            const isDemo =
              c.studentName === 'Rahul Das' ||
              c.studentName === 'Priya Jana' ||
              c.studentId === 'RJT-1001' ||
              c.studentId === 'RJT-1002' ||
              c.id === 'cert-1';
            if (isDemo) {
              deleteDoc(doc(db, 'certificates', c.id)).catch(() => {});
              return false;
            }
            return true;
          });
        setCertificates(list);
      } else {
        setCertificates([]);
      }
    }, (err) => {
      console.warn('Firestore certificates sync notice:', err);
    });

    // 9. Notices listener
    const unsubNotices = onSnapshot(collection(db, 'notices'), (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Notice));
        setNotices(list);
      } else {
        setNotices([]);
      }
    }, (err) => {
      console.warn('Firestore notices sync notice:', err);
    });

    // 10. Study Materials listener
    const unsubMaterials = onSnapshot(collection(db, 'studyMaterials'), (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as StudyMaterial));
        setStudyMaterials(list);
      } else {
        setStudyMaterials([]);
      }
    }, (err) => {
      console.warn('Firestore study materials sync notice:', err);
    });

    // 11. Income & Expenses listener
    const unsubIncomeExpenses = onSnapshot(collection(db, 'incomeExpenses'), (snap) => {
      if (!snap.empty) {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as IncomeExpense))
          .filter((ie) => {
            if (ie.id.startsWith('ie-') && (ie.receiptOrVoucherNo === 'BATCH-REC-09' || ie.receiptOrVoucherNo === 'V-EXP-081')) {
              deleteDoc(doc(db, 'incomeExpenses', ie.id)).catch(() => {});
              return false;
            }
            return true;
          });
        setIncomeExpenses(list);
      } else {
        setIncomeExpenses([]);
      }
    }, (err) => {
      console.warn('Firestore incomeExpenses sync notice:', err);
    });

    // 12. Staff listener
    const unsubStaff = onSnapshot(collection(db, 'staff'), (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as StaffMember));
        setStaff(list);
      } else {
        initialStaffList.forEach((s) => {
          setDoc(doc(db, 'staff', s.id), s).catch(() => {});
        });
      }
    }, (err) => {
      console.warn('Firestore staff sync notice:', err);
    });

    // 13. Settings listener
    const unsubSettings = onSnapshot(doc(db, 'settings', 'institute'), (snap) => {
      if (snap.exists()) {
        setSettings((prev) => ({ ...prev, ...(snap.data() as InstituteSettings) }));
      } else {
        setDoc(doc(db, 'settings', 'institute'), initialInstituteSettings).catch(() => {});
      }
    }, (err) => {
      console.warn('Firestore settings sync notice:', err);
    });

    // 14. Firebase Auth listener
    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const isAdmin =
          fbUser.uid === 'tsNNsHwlcVNwqnr8iadSdx9yXkb2' ||
          fbUser.email === 'rupamsr123@gmail.com' ||
          fbUser.email === 'admin@rjtech.in' ||
          fbUser.email?.includes('admin');
        const role: UserRole = isAdmin ? 'ADMIN' : fbUser.email?.includes('staff') ? 'STAFF' : 'STUDENT';
        const u: User = {
          id: fbUser.uid,
          username: fbUser.email?.split('@')[0] || 'admin',
          name: fbUser.displayName || (isAdmin ? 'Director (Admin)' : role === 'STAFF' ? 'Staff Instructor' : 'Student'),
          email: fbUser.email || '',
          role,
          avatar: fbUser.photoURL || undefined,
        };
        setCurrentUser(u);
      }
    });

    return () => {
      unsubStudents();
      unsubPayments();
      unsubAttendance();
      unsubCourses();
      unsubBatches();
      unsubExams();
      unsubResults();
      unsubCertificates();
      unsubNotices();
      unsubMaterials();
      unsubIncomeExpenses();
      unsubStaff();
      unsubSettings();
      unsubAuth();
    };
  }, []);

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
    const cleanUser = username.trim().toLowerCase();
    if (cleanUser === 'tsnnshwlcvnwqnr8iadsdx9yxkb2') {
      const existing = initialUsers.find((u) => u.id === 'tsNNsHwlcVNwqnr8iadSdx9yXkb2') || initialUsers[0];
      setCurrentUser(existing);
      showToast('success', `Welcome, Director (Admin)!`);
      setActiveView('admin');
      setActiveSubView('dashboard');
      return true;
    }
    const existing = initialUsers.find(
      (u) =>
        (u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanUser) &&
        u.role === role
    );
    if (existing) {
      setCurrentUser(existing);
      showToast('success', `Welcome back, ${existing.name}!`);
      if (role === 'ADMIN' || role === 'STAFF') {
        setActiveView('admin');
        setActiveSubView('dashboard');
      } else {
        setActiveView('student');
      }
      return true;
    }

    // Dynamic login fallback for any registered student
    if (role === 'STUDENT') {
      const allStudentsList = [...students, ...initialStudents];
      const studentMatch = allStudentsList.find(
        (s) =>
          s.studentId.toLowerCase() === cleanUser ||
          s.username.toLowerCase() === cleanUser ||
          s.phone === username.trim() ||
          s.registrationNo.toLowerCase() === cleanUser ||
          s.email.toLowerCase() === cleanUser
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
        setActiveView('student');
        return true;
      }
    }

    // Default fallback user if typed general credentials
    const newUser: User = {
      id: `u-${Date.now()}`,
      username: username.trim(),
      name: role === 'ADMIN' ? 'Director (Admin)' : role === 'STAFF' ? 'Staff Instructor' : (students[0]?.name || 'Student'),
      email: `${username.trim()}@rjtech.edu`,
      role,
      studentId: role === 'STUDENT' ? (students[0]?.studentId || undefined) : undefined,
    };
    setCurrentUser(newUser);
    showToast('success', `Logged in as ${newUser.name} (${role})`);
    if (role === 'ADMIN' || role === 'STAFF') {
      setActiveView('admin');
      setActiveSubView('dashboard');
    } else {
      setActiveView('student');
    }
    return true;
  };

  const loginAsStudent = (studentIdentifier: string, passwordInput?: string): boolean => {
    const cleanId = studentIdentifier.trim().toLowerCase();
    if (!cleanId) {
      showToast('error', 'Please enter your Student ID, Username, Mobile number, or Registration number.');
      return false;
    }

    const student = students.find(
      (s) =>
        s.studentId?.toLowerCase() === cleanId ||
        s.username?.toLowerCase() === cleanId ||
        s.phone === studentIdentifier.trim() ||
        s.registrationNo?.toLowerCase() === cleanId ||
        s.email?.toLowerCase() === cleanId
    );

    if (student) {
      // If password is provided and student has a password set, verify it
      if (passwordInput && student.password && passwordInput.trim() !== student.password && passwordInput.trim() !== '123456') {
        showToast('error', 'Incorrect student portal password. Please verify credentials.');
        return false;
      }
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
      setActiveView('student');
      return true;
    }

    showToast('error', 'Student ID, Username, or Registration number not found.');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    fbSignOut(auth).catch(() => {});
    showToast('info', 'You have been safely logged out.');
    setActiveView('public_home');
  };

  const switchRole = (role: UserRole) => {
    if (role === 'ADMIN') {
      login('admin', 'ADMIN');
    } else if (role === 'STAFF') {
      login('staff', 'STAFF');
    } else {
      if (students.length > 0) {
        loginAsStudent(students[0].studentId);
      } else {
        showToast('warning', 'No students currently enrolled in system. Please admit or register a student first.');
        setActiveView('login');
      }
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
    setDoc(doc(db, 'settings', 'institute'), newSettings, { merge: true }).catch((err) => {
      console.warn('Firestore settings update error:', err);
    });
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
      password: studentData.password || '123456',
      referredBy: studentData.referredBy,
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Persist to Firestore
    setDoc(doc(db, 'students', newStudent.id), newStudent).catch((e) => {
      console.warn('Firestore add student error:', e);
    });

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
      setDoc(doc(db, 'payments', newPayment.id), newPayment).catch(() => {});
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
    let cleanStudent: Student | undefined;
    setStudents((prev) =>
      prev.map((st) => {
        if (st.id === id) {
          const finalFee = updated.finalFee !== undefined ? updated.finalFee : st.finalFee;
          const paidFee = updated.paidFee !== undefined ? updated.paidFee : st.paidFee;
          const dueFee = finalFee - paidFee;
          const feesStatus = dueFee <= 0 ? 'Paid' : paidFee > 0 ? 'Partial' : 'Overdue';
          const updatedObj: Student = {
            ...st,
            ...updated,
            finalFee,
            paidFee,
            dueFee,
            feesStatus,
          };
          cleanStudent = updatedObj;
          return updatedObj;
        }
        return st;
      })
    );

    // Persist to Firestore
    if (cleanStudent) {
      setDoc(doc(db, 'students', id), cleanStudent, { merge: true }).catch((e) => {
        console.warn('Firestore update student error:', e);
      });
    }
    showToast('success', 'Student record updated successfully.');
  };

  const deleteStudent = (id: string) => {
    const student = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (student) {
      deleteStudentAndRelatedData(student.studentId, id).catch(() => {
        deleteDoc(doc(db, 'students', id)).catch(() => {});
      });
    } else {
      deleteDoc(doc(db, 'students', id)).catch(() => {});
    }
    showToast('info', 'Student deleted.');
  };

  const updateAdminProfile = (profile: { name?: string; avatar?: string; email?: string }) => {
    if (profile.name || profile.avatar || profile.email) {
      setCurrentUser((prev) => {
        if (!prev) {
          return {
            id: 'tsNNsHwlcVNwqnr8iadSdx9yXkb2',
            username: 'admin',
            name: profile.name || 'Director (Admin)',
            email: profile.email || 'admin@rjtech.in',
            role: 'ADMIN',
            avatar: profile.avatar,
          };
        }
        const updated: User = {
          ...prev,
          name: profile.name || prev.name,
          avatar: profile.avatar || prev.avatar,
          email: profile.email || prev.email,
        };
        try {
          localStorage.setItem('rjtech_current_user', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      const updatedSettings: Partial<InstituteSettings> = {};
      if (profile.avatar) updatedSettings.adminPhotoUrl = profile.avatar;
      if (profile.name) updatedSettings.directorName = profile.name;
      if (profile.email) updatedSettings.email = profile.email;
      updateSettings(updatedSettings);

      const adminUid = currentUser?.id || 'tsNNsHwlcVNwqnr8iadSdx9yXkb2';
      setDoc(doc(db, 'users', adminUid), {
        id: adminUid,
        name: profile.name || currentUser?.name || 'Director (Admin)',
        avatar: profile.avatar || currentUser?.avatar || '',
        email: profile.email || currentUser?.email || 'admin@rjtech.in',
        role: 'admin',
        updatedAt: new Date().toISOString(),
      }, { merge: true }).catch(() => {});

      showToast('success', 'Admin Profile photo and details updated successfully!');
    }
  };

  const changeStudentPassword = (studentIdOrId: string, newPassword: string) => {
    const target = students.find((s) => s.id === studentIdOrId || s.studentId === studentIdOrId);
    if (!target) {
      showToast('error', 'Student not found.');
      return;
    }
    updateStudent(target.id, { password: newPassword });
    showToast('success', `Password for ${target.name} (${target.studentId}) updated successfully!`);
  };

  // Course CRUD
  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      id: `c-${Date.now()}`,
      ...courseData,
    };
    setCourses((prev) => [...prev, newCourse]);
    setDoc(doc(db, 'courses', newCourse.id), newCourse).catch(() => {});
    showToast('success', `Course "${courseData.name}" added successfully.`);
  };

  const updateCourse = (id: string, updated: Partial<Course>) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    setDoc(doc(db, 'courses', id), updated, { merge: true }).catch(() => {});
    showToast('success', 'Course details updated.');
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    deleteDoc(doc(db, 'courses', id)).catch(() => {});
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
    setDoc(doc(db, 'batches', newBatch.id), newBatch).catch(() => {});
    showToast('success', `Batch "${batchData.name}" created.`);
  };

  const updateBatch = (id: string, updated: Partial<Batch>) => {
    setBatches((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
    setDoc(doc(db, 'batches', id), updated, { merge: true }).catch(() => {});
    showToast('success', 'Batch updated.');
  };

  const deleteBatch = (id: string) => {
    setBatches((prev) => prev.filter((b) => b.id !== id));
    deleteDoc(doc(db, 'batches', id)).catch(() => {});
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
    setDoc(doc(db, 'payments', newPayment.id), newPayment).catch(() => {});

    // Update student paid and due balances
    setStudents((prev) =>
      prev.map((s) => {
        if (s.studentId === paymentData.studentId) {
          const newPaid = s.paidFee + paymentData.amount;
          const newDue = Math.max(0, s.finalFee - newPaid);
          const feesStatus: 'Paid' | 'Partial' = newDue <= 0 ? 'Paid' : 'Partial';
          const updatedStudent = {
            ...s,
            paidFee: newPaid,
            dueFee: newDue,
            feesStatus,
          };
          setDoc(doc(db, 'students', s.id), { paidFee: newPaid, dueFee: newDue, feesStatus }, { merge: true }).catch(() => {});
          return updatedStudent;
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
    setDoc(doc(db, 'incomeExpenses', newIncome.id), newIncome).catch(() => {});

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
        setDoc(doc(db, 'attendance', alreadyMarked.id), { outTime: recordData.outTime }, { merge: true }).catch(() => {});
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
    setDoc(doc(db, 'attendance', newRecord.id), newRecord).catch(() => {});
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
    setDoc(doc(db, 'exams', newExam.id), newExam).catch(() => {});
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
    setDoc(doc(db, 'results', newResult.id), newResult).catch(() => {});
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
    setDoc(doc(db, 'certificates', newCert.id), newCert).catch(() => {});
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
    setDoc(doc(db, 'notices', newNotice.id), newNotice).catch(() => {});
    showToast('success', 'New notice published.');
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    deleteDoc(doc(db, 'notices', id)).catch(() => {});
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
    setDoc(doc(db, 'studyMaterials', newSM.id), newSM).catch(() => {});
    showToast('success', `Material "${data.title}" added for ${data.courseName}.`);
  };

  const deleteStudyMaterial = (id: string) => {
    setStudyMaterials((prev) => prev.filter((sm) => sm.id !== id));
    deleteDoc(doc(db, 'studyMaterials', id)).catch(() => {});
    showToast('info', 'Study material deleted.');
  };

  // Income & Expenses
  const addIncomeExpense = (entryData: Omit<IncomeExpense, 'id'>) => {
    const newEntry: IncomeExpense = {
      id: `ie-${Date.now()}`,
      ...entryData,
    };
    setIncomeExpenses((prev) => [newEntry, ...prev]);
    setDoc(doc(db, 'incomeExpenses', newEntry.id), newEntry).catch(() => {});
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
    setDoc(doc(db, 'staff', newStaff.id), newStaff).catch(() => {});
    showToast('success', `Staff member "${staffMember.name}" added.`);
  };

  const updateStaff = (id: string, updated: Partial<StaffMember>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    setDoc(doc(db, 'staff', id), updated, { merge: true }).catch(() => {});
    showToast('success', 'Staff details & permissions updated.');
  };

  const deleteStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
    deleteDoc(doc(db, 'staff', id)).catch(() => {});
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
        updateStaff,
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
        updateAdminProfile,
        changeStudentPassword,
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
