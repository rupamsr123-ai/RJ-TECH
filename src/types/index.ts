export type UserRole = 'ADMIN' | 'STAFF' | 'STUDENT' | 'PUBLIC';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  studentId?: string; // If role is STUDENT
}

export interface Course {
  id: string;
  code: string;
  name: string;
  duration: string;
  description: string;
  totalFees: number;
  admissionFee: number;
  monthlyFee: number;
  examFee: number;
  certificateFee: number;
  status: 'Active' | 'Inactive';
  syllabus?: string[];
  eligibility?: string;
  icon?: string;
}

export interface Batch {
  id: string;
  name: string;
  courseId: string;
  courseName: string;
  startDate?: string;
  endDate?: string;
  classDays?: string[];
  days?: string;
  startTime: string;
  endTime: string;
  teacher?: string;
  trainer?: string;
  room?: string;
  maxStudents?: number;
  capacity?: number;
  currentStudents?: number;
  status: 'Active' | 'Upcoming' | 'Completed' | string;
}

export interface Schedule {
  id: string;
  batchId?: string;
  batchName: string;
  courseName?: string;
  subject: string;
  teacherName?: string;
  trainer?: string;
  room?: string;
  startTime: string;
  endTime: string;
  days?: string;
}

export interface Student {
  id: string;
  studentId: string;
  registrationNo: string;
  rollNo: string;
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  photo: string;
  fatherName: string;
  motherName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  village: string;
  postOffice: string;
  district: string;
  state: string;
  pinCode: string;
  courseId: string;
  courseName: string;
  batchId: string;
  batchName: string;
  session: string;
  admissionDate: string;
  totalFee: number;
  discount: number;
  finalFee: number;
  paidFee: number;
  dueFee: number;
  status: 'Active' | 'Completed' | 'Suspended';
  feesStatus: 'Paid' | 'Partial' | 'Overdue';
  referralCode?: string;
  referredBy?: string;
  username: string;
  idDocumentUrl?: string;
  signatureUrl?: string;
}

export interface FeePayment {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  registrationNo?: string;
  courseName: string;
  amount: number;
  date: string;
  paymentMethod?: 'Cash' | 'UPI' | 'Bank Transfer' | 'Card' | 'Other' | string;
  mode?: string; // Alias for paymentMethod
  previousDue?: number;
  remainingDue?: number;
  receivedBy?: string;
  collectedBy?: string;
  remarks?: string;
}

export type PaymentRecord = FeePayment;

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  registrationNo: string;
  courseName: string;
  batchName: string;
  date: string; // YYYY-MM-DD
  inTime: string;
  outTime?: string;
  time?: string; // Compatibility alias
  status: 'Present' | 'Absent' | 'Late';
  method: 'QR' | 'Manual';
}

export interface Exam {
  id: string;
  name?: string;
  title?: string;
  courseId?: string;
  courseName?: string;
  batchId?: string;
  batchName?: string;
  subject?: string;
  date: string;
  time?: string;
  duration?: string;
  totalMarks: number;
  passMarks?: number;
  passingMarks?: number;
  theoryMarks?: number;
  practicalMarks?: number;
  vivaMarks?: number;
  status?: 'Upcoming' | 'Completed' | 'Graded' | string;
}

export interface ExamResult {
  id: string;
  examId: string;
  examName: string;
  examTitle?: string; // Compatibility alias
  studentId: string;
  studentName: string;
  registrationNo: string;
  rollNo: string;
  courseName: string;
  batchName: string;
  subject: string;
  fullMarks: number;
  totalMarks?: number; // Compatibility alias
  obtainedMarks: number;
  theoryMarks?: number;
  practicalMarks?: number;
  vivaMarks?: number;
  percentage: number;
  grade: string;
  result: 'Pass' | 'Fail';
  status?: string; // Compatibility alias
  examDate: string;
  date?: string; // Compatibility alias
  evaluatedBy: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'Notice' | 'Announcement' | 'Holiday' | 'Exam Notice' | 'Fee Reminder' | 'Class Notice' | string;
  date: string;
  target?: 'All' | 'Students' | 'Staff' | 'Course' | string;
  targetAudience?: string; // Compatibility alias
  courseId?: string;
  isImportant?: boolean;
}

export interface StudyMaterial {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  subject?: string;
  description: string;
  fileType?: 'PDF' | 'Video' | 'Image' | 'Notes' | 'ZIP' | string;
  type?: string; // Compatibility alias
  fileUrl?: string;
  url?: string; // Compatibility alias
  fileSize?: string;
  size?: string; // Compatibility alias
  uploadDate?: string;
}

export interface Certificate {
  id: string;
  certificateNo: string;
  studentId: string;
  studentName: string;
  registrationNo: string;
  courseName: string;
  courseDuration: string;
  duration?: string; // Compatibility alias
  issueDate: string;
  grade: string;
  percentage: number;
  directorName: string;
  verificationUrl: string;
  status: 'Issued' | 'Pending';
}

export interface IncomeExpense {
  id: string;
  type: 'Income' | 'Expense';
  category: string;
  title: string;
  amount: number;
  date: string;
  paymentMethod: string;
  paymentMode?: string; // Compatibility alias
  receiptOrVoucherNo?: string;
  description?: string; // Compatibility alias
  paidTo?: string; // Compatibility alias
  remarks?: string;
}

export type ExpenseRecord = IncomeExpense;

export interface ReferralRecord {
  id: string;
  referrerStudentId: string;
  referrerName: string;
  referrerCode: string;
  applicantName: string;
  applicantCourse: string;
  date: string;
  commission: number;
  status: 'Approved' | 'Pending' | 'Paid';
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Faculty' | 'Counselor' | 'Lab Assistant' | 'Admin' | 'Accountant' | 'Trainer' | 'Receptionist' | string;
  email: string;
  phone: string;
  specialization?: string;
  qualification?: string;
  salary?: number;
  joinDate?: string;
  joiningDate?: string;
  address?: string;
  status: 'Active' | 'On Leave' | 'Inactive' | string;
  avatar?: string;
}

export interface InstituteSettings {
  instituteName: string;
  tagline: string;
  logoUrl?: string;
  phone: string;
  mobile?: string; // Alias
  whatsapp: string;
  email: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  address?: string; // Combined full address
  district: string;
  state: string;
  pinCode: string;
  directorName: string;
  currentSession: string;
  regPrefix: string;
  studentIdPrefix: string;
  receiptPrefix: string;
  certificatePrefix: string;
  referralBonusAmount: number;
  registrationNo?: string;
}
