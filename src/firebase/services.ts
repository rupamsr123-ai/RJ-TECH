import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut as secondarySignOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage, firebaseConfig } from './config';
import {
  Student,
  FeePayment,
  AttendanceRecord,
  Course,
  Batch,
  Exam,
  ExamResult,
  Certificate,
  StudyMaterial,
  InstituteSettings,
} from '../types';

/**
 * Creates a student Firebase Authentication account using a secondary app instance.
 * This ensures the currently logged-in Super Admin or Staff member is NOT logged out!
 */
export async function createStudentAuthUser(email: string, pass: string): Promise<string> {
  const secondaryAppName = `student_auth_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, pass);
    const uid = cred.user.uid;
    await secondarySignOut(secondaryAuth);
    return uid;
  } catch (error: any) {
    console.error('Error creating student auth user:', error);
    throw error;
  }
}

/**
 * Uploads a file with progress tracking.
 * Falls back to base64 Data URL if Firebase Storage is unavailable or blocked by CORS.
 */
export async function uploadFileWithProgress(
  file: File,
  storagePath: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  try {
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return await new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          if (onProgress) onProgress(progress);
        },
        async (error) => {
          console.warn('Firebase Storage upload failed, falling back to DataURL:', error);
          // Fallback to Data URL
          try {
            const dataUrl = await readFileAsDataURL(file);
            if (onProgress) onProgress(100);
            resolve(dataUrl);
          } catch (readErr) {
            reject(error);
          }
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) onProgress(100);
            resolve(downloadUrl);
          } catch (urlErr) {
            console.warn('Could not get download URL, falling back to DataURL:', urlErr);
            const dataUrl = await readFileAsDataURL(file);
            resolve(dataUrl);
          }
        }
      );
    });
  } catch (err) {
    console.warn('Direct upload error, reading as DataURL:', err);
    return await readFileAsDataURL(file);
  }
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

// ================= FIRESTORE CRUD HELPERS =================

// Students
export const STUDENTS_COLLECTION = 'students';
export const USERS_COLLECTION = 'users';
export const PAYMENTS_COLLECTION = 'payments';
export const ATTENDANCE_COLLECTION = 'attendance';
export const COURSES_COLLECTION = 'courses';
export const BATCHES_COLLECTION = 'batches';
export const EXAMS_COLLECTION = 'exams';
export const MARKS_COLLECTION = 'marks';
export const CERTIFICATES_COLLECTION = 'certificates';
export const MARKSHEETS_COLLECTION = 'marksheets';
export const STUDY_MATERIALS_COLLECTION = 'studyMaterials';
export const STAFF_PERMISSIONS_COLLECTION = 'staffPermissions';
export const SETTINGS_COLLECTION = 'settings';

export async function saveStudentToFirestore(student: Student): Promise<void> {
  const docRef = doc(db, STUDENTS_COLLECTION, student.id);
  await setDoc(docRef, {
    ...student,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function deleteStudentAndRelatedData(studentId: string, id: string): Promise<void> {
  // Delete student doc
  await deleteDoc(doc(db, STUDENTS_COLLECTION, id));

  // Query and delete payments
  const paymentsQuery = query(collection(db, PAYMENTS_COLLECTION), where('studentId', '==', studentId));
  const paymentsSnap = await getDocs(paymentsQuery);
  for (const d of paymentsSnap.docs) {
    await deleteDoc(d.ref);
  }

  // Query and delete attendance
  const attQuery = query(collection(db, ATTENDANCE_COLLECTION), where('studentId', '==', studentId));
  const attSnap = await getDocs(attQuery);
  for (const d of attSnap.docs) {
    await deleteDoc(d.ref);
  }

  // Query and delete marks
  const marksQuery = query(collection(db, MARKS_COLLECTION), where('studentId', '==', studentId));
  const marksSnap = await getDocs(marksQuery);
  for (const d of marksSnap.docs) {
    await deleteDoc(d.ref);
  }

  // Query and delete certificates
  const certQuery = query(collection(db, CERTIFICATES_COLLECTION), where('studentId', '==', studentId));
  const certSnap = await getDocs(certQuery);
  for (const d of certSnap.docs) {
    await deleteDoc(d.ref);
  }

  // Query and delete marksheets
  const msQuery = query(collection(db, MARKSHEETS_COLLECTION), where('studentId', '==', studentId));
  const msSnap = await getDocs(msQuery);
  for (const d of msSnap.docs) {
    await deleteDoc(d.ref);
  }
}
