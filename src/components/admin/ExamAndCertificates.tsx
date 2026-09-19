import React, { useState } from 'react';
import {
  FileCheck,
  Award,
  QrCode,
  Search,
  Plus,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Eye,
  FileText,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Exam, ExamResult, Certificate, Student } from '../../types';
import { Button, Card, Badge, Modal } from '../common/UIComponents';

export const ExamAndCertificates: React.FC<{
  initialTab?: 'exams' | 'marks' | 'results' | 'id_cards' | 'certificates' | 'verify';
}> = ({ initialTab = 'exams' }) => {
  const {
    students,
    courses,
    exams,
    results,
    certificates,
    addExam,
    addResult,
    generateCertificate,
    verifyCertificate,
    setActiveIdCard,
    setActiveCertificate,
    setActiveResultModal,
    settings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'exams' | 'marks' | 'results' | 'id_cards' | 'certificates' | 'verify'>(
    initialTab
  );

  // Create Exam Modal
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [examForm, setExamForm] = useState({
    title: '',
    courseId: courses[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    duration: '2 Hours',
    totalMarks: 100,
    passingMarks: 40,
    theoryMarks: 50,
    practicalMarks: 40,
    vivaMarks: 10,
  });

  // Marks Entry State
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || '');
  const [marksData, setMarksData] = useState<
    Record<string, { theory: number; practical: number; viva: number }>
  >({});
  const [marksSaved, setMarksSaved] = useState(false);

  // Certificate Generator Form
  const [certStudentId, setCertStudentId] = useState(students[0]?.id || '');
  const [certGrade, setCertGrade] = useState<'A+' | 'A' | 'B' | 'C'>('A+');

  // Certificate Verification input
  const [verifyInput, setVerifyInput] = useState('RJTECH-2026-00001');
  const [verifiedCert, setVerifiedCert] = useState<any>(null);
  const [hasVerified, setHasVerified] = useState(false);

  const selectedExam = exams.find((e) => e.id === selectedExamId) || exams[0];
  const examStudents = students.filter((s) => s.courseId === selectedExam?.courseId);

  // Auto grade computation
  const calculateGrade = (pct: number) => {
    if (pct >= 85) return 'A+';
    if (pct >= 70) return 'A';
    if (pct >= 55) return 'B';
    if (pct >= 40) return 'C';
    return 'F';
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    const course = courses.find((c) => c.id === examForm.courseId);
    addExam({
      ...examForm,
      courseName: course?.name || 'Computer Training',
    });
    setExamModalOpen(false);
  };

  const handleSaveMarks = () => {
    examStudents.forEach((st) => {
      const studentMarks = marksData[st.id] || { theory: 42, practical: 36, viva: 8 };
      const obtained = studentMarks.theory + studentMarks.practical + studentMarks.viva;
      const totalMarks = selectedExam.totalMarks || 100;
      const passingMarks = selectedExam.passingMarks || selectedExam.passMarks || 40;
      const pct = Math.round((obtained / totalMarks) * 100);
      const grade = calculateGrade(pct);
      const status = obtained >= passingMarks ? 'Pass' : 'Fail';

      addResult({
        examId: selectedExam.id,
        examTitle: selectedExam.title,
        studentId: st.id,
        studentName: st.name,
        rollNo: st.rollNo,
        registrationNo: st.registrationNo,
        courseName: selectedExam.courseName,
        theoryMarks: studentMarks.theory,
        practicalMarks: studentMarks.practical,
        vivaMarks: studentMarks.viva,
        obtainedMarks: obtained,
        totalMarks: selectedExam.totalMarks,
        percentage: pct,
        grade,
        status,
        date: selectedExam.date,
      });
    });

    setMarksSaved(true);
    setTimeout(() => setMarksSaved(false), 3000);
  };

  const handleGenerateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === certStudentId);
    if (!student) return;

    const cert = generateCertificate(student.id, certGrade);
    setActiveCertificate(cert);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const res = verifyCertificate(verifyInput);
    setVerifiedCert(res);
    setHasVerified(true);
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
            Examinations & Certifications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Conduct exams, grade student performance, issue official QR certificates and printable ID cards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'exams' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            Exams ({exams.length})
          </button>
          <button
            onClick={() => setActiveTab('marks')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'marks' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            Marks Entry
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'results' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            Result Sheet ({results.length})
          </button>
          <button
            onClick={() => setActiveTab('id_cards')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'id_cards' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            Student ID Cards
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'certificates' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            Certificates ({certificates.length})
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'verify' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            Verification
          </button>
        </div>
      </div>

      {/* ===================== TAB 1: EXAMS & SCHEDULE ===================== */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setExamModalOpen(true)}
            >
              Schedule New Examination
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((ex) => (
              <Card key={ex.id} className="p-6 space-y-3 border-slate-200">
                <div className="flex items-start justify-between">
                  <Badge variant="primary">{ex.duration}</Badge>
                  <span className="text-xs font-mono font-semibold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    {ex.date}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{ex.title}</h3>
                <p className="text-xs text-blue-700 font-semibold">{ex.courseName}</p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Marks Breakdown:</span>
                    <span className="font-semibold text-slate-800">
                      T:{ex.theoryMarks} | P:{ex.practicalMarks} | V:{ex.vivaMarks}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Marks:</span>
                    <span className="font-bold text-slate-900">{ex.totalMarks}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Passing Threshold:</span>
                    <span>{ex.passingMarks} Marks (40%)</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs"
                    onClick={() => {
                      setSelectedExamId(ex.id);
                      setActiveTab('marks');
                    }}
                  >
                    Enter Student Marks →
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 2: MARKS ENTRY ===================== */}
      {activeTab === 'marks' && (
        <Card className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Marks Entry: {selectedExam?.title}
              </h3>
              <p className="text-xs text-slate-500">
                Course: {selectedExam?.courseName} • Theory ({selectedExam?.theoryMarks}) + Practical ({selectedExam?.practicalMarks}) + Viva ({selectedExam?.vivaMarks})
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-semibold"
              >
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Roll</th>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4 text-center">Theory (/{selectedExam?.theoryMarks})</th>
                  <th className="py-2.5 px-4 text-center">Practical (/{selectedExam?.practicalMarks})</th>
                  <th className="py-2.5 px-4 text-center">Viva (/{selectedExam?.vivaMarks})</th>
                  <th className="py-2.5 px-4 text-center">Total / Grade</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {examStudents.map((st) => {
                  const studentMarks = marksData[st.id] || { theory: 42, practical: 36, viva: 8 };
                  const total = studentMarks.theory + studentMarks.practical + studentMarks.viva;
                  const totalMarks = selectedExam?.totalMarks || 100;
                  const passingMarks = selectedExam?.passingMarks || selectedExam?.passMarks || 40;
                  const pct = Math.round((total / totalMarks) * 100);
                  const grade = calculateGrade(pct);
                  const isPass = total >= passingMarks;

                  return (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">{st.rollNo}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <img src={st.photo} alt={st.name} className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <span className="font-bold text-slate-900 block">{st.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{st.studentId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          min="0"
                          max={selectedExam?.theoryMarks}
                          value={studentMarks.theory}
                          onChange={(e) =>
                            setMarksData({
                              ...marksData,
                              [st.id]: { ...studentMarks, theory: Number(e.target.value) },
                            })
                          }
                          className="w-16 px-2 py-1 text-center font-bold text-xs rounded-lg border border-slate-300"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          min="0"
                          max={selectedExam?.practicalMarks}
                          value={studentMarks.practical}
                          onChange={(e) =>
                            setMarksData({
                              ...marksData,
                              [st.id]: { ...studentMarks, practical: Number(e.target.value) },
                            })
                          }
                          className="w-16 px-2 py-1 text-center font-bold text-xs rounded-lg border border-slate-300"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          min="0"
                          max={selectedExam?.vivaMarks}
                          value={studentMarks.viva}
                          onChange={(e) =>
                            setMarksData({
                              ...marksData,
                              [st.id]: { ...studentMarks, viva: Number(e.target.value) },
                            })
                          }
                          className="w-16 px-2 py-1 text-center font-bold text-xs rounded-lg border border-slate-300"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-bold text-slate-900 text-sm">
                          {total} ({pct}%)
                        </span>
                        <span className="text-[11px] block font-bold text-blue-600">
                          Grade {grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={isPass ? 'success' : 'danger'} size="sm">
                          {isPass ? 'Pass' : 'Fail'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2">
            {marksSaved ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Official exam results published to student portal!
              </span>
            ) : (
              <div />
            )}

            <Button variant="primary" size="md" onClick={handleSaveMarks}>
              Save & Publish Examination Results
            </Button>
          </div>
        </Card>
      )}

      {/* ===================== TAB 3: RESULTS SHEET ===================== */}
      {activeTab === 'results' && (
        <Card className="overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Published Marksheet Records</h3>
              <p className="text-xs text-slate-500">Semester exam scores and official grades</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Exam Title</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Percentage</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4 text-right">Marksheet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{r.studentName}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{r.rollNo}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{r.examTitle}</td>
                    <td className="py-3 px-4 text-slate-600">{r.courseName}</td>
                    <td className="py-3 px-4 font-bold text-blue-700">
                      {r.obtainedMarks} / {r.totalMarks}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{r.percentage}%</td>
                    <td className="py-3 px-4">
                      <Badge variant="primary" size="sm">Grade {r.grade}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        icon={FileText}
                        onClick={() => setActiveResultModal(r)}
                        className="text-[11px] py-1 px-2.5"
                      >
                        Print Marksheet
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ===================== TAB 4: STUDENT ID CARDS ===================== */}
      {activeTab === 'id_cards' && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Student ID Card Generator</h3>
              <p className="text-xs text-slate-500">
                Print QR-enabled, laminated identity cards for enrolled students at RJ TECH.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={Printer}
              onClick={() => {
                if (students[0]) setActiveIdCard(students[0]);
              }}
            >
              Preview Sample Card
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((st) => (
              <div
                key={st.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={st.photo}
                    alt={st.name}
                    className="w-12 h-12 rounded-xl object-cover border"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{st.name}</h4>
                    <p className="text-[11px] text-blue-700 font-semibold">{st.courseName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      ID: {st.studentId} • Roll: {st.rollNo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-slate-500">Batch: {st.batchName}</span>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={Printer}
                    onClick={() => setActiveIdCard(st)}
                    className="text-[11px] py-1 px-2.5"
                  >
                    Print ID Card
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ===================== TAB 5: CERTIFICATES ===================== */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 mb-2">Issue Certified Diploma</h3>
            <p className="text-xs text-slate-500 mb-4">
              Select completed student to generate registered certificate with serial number and verification QR.
            </p>

            <form onSubmit={handleGenerateCertificate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Student</label>
                <select
                  value={certStudentId}
                  onChange={(e) => setCertStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.courseName} - {s.studentId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Final Performance Grade</label>
                <select
                  value={certGrade}
                  onChange={(e) => setCertGrade(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="A+">Grade A+ (Exemplary - 85%+)</option>
                  <option value="A">Grade A (Distinction - 70-84%)</option>
                  <option value="B">Grade B (First Division - 55-69%)</option>
                  <option value="C">Grade C (Pass - 40-54%)</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button type="submit" variant="primary" size="md" className="w-full" icon={Award}>
                  Generate & View Certificate
                </Button>
              </div>
            </form>
          </Card>

          {/* List of Issued Certificates */}
          <Card className="overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Registry of Issued Certificates</h3>
                <p className="text-xs text-slate-500">Official diplomas recognized for employment</p>
              </div>
              <Badge variant="primary">{certificates.length} Issued</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Certificate No</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Registration No</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Issue Date</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4 text-right">Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {certificates.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-amber-900">{c.certificateNo}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{c.studentName}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{c.registrationNo}</td>
                      <td className="py-3 px-4 text-slate-700">{c.courseName}</td>
                      <td className="py-3 px-4 text-slate-500">{c.issueDate}</td>
                      <td className="py-3 px-4">
                        <Badge variant="primary" size="sm">{c.grade}</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          icon={Award}
                          onClick={() => setActiveCertificate(c)}
                          className="text-[11px] py-1 px-2.5"
                        >
                          Print Certificate
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

      {/* ===================== TAB 6: VERIFICATION ===================== */}
      {activeTab === 'verify' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Search Institutional Registry</h3>
            <form onSubmit={handleVerify} className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">Enter Certificate Number</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. RJTECH-2026-00001"
                  value={verifyInput}
                  onChange={(e) => setVerifyInput(e.target.value)}
                  className="flex-1 px-3 py-2.5 text-xs font-mono uppercase rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <Button type="submit" variant="primary" icon={Search}>
                  Verify
                </Button>
              </div>
            </form>

            {hasVerified && (
              <div className="pt-4 border-t border-slate-100">
                {verifiedCert ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 font-semibold">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Valid & Authenticated Certificate</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                      <p><span className="text-slate-500">Student:</span> <strong>{verifiedCert.studentName}</strong></p>
                      <p><span className="text-slate-500">Course:</span> <strong>{verifiedCert.courseName}</strong></p>
                      <p><span className="text-slate-500">Certificate No:</span> <strong className="font-mono text-amber-900">{verifiedCert.certificateNo}</strong></p>
                      <p><span className="text-slate-500">Issued On:</span> <strong>{verifiedCert.issueDate}</strong></p>
                      <p><span className="text-slate-500">Grade:</span> <strong>{verifiedCert.grade}</strong></p>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveCertificate(verifiedCert)}
                    >
                      Open Full Printable Certificate
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-center text-xs text-rose-800">
                    No certificate record found for "{verifyInput}".
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
