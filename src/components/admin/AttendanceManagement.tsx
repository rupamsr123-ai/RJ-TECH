import React, { useState, useEffect } from 'react';
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  Camera,
  Volume2,
  Calendar,
  Clock,
  Users,
  Search,
  MessageSquare,
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button, Card, Badge, Modal } from '../common/UIComponents';

export const AttendanceManagement: React.FC<{
  initialTab?: 'qr' | 'manual' | 'report';
}> = ({ initialTab = 'qr' }) => {
  const {
    students,
    courses,
    batches,
    attendanceRecords,
    markAttendance,
    openWhatsAppDialog,
    settings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'qr' | 'manual' | 'report'>(initialTab);

  // QR Scanner State
  const [scannerActive, setScannerActive] = useState(false);
  const [lastScannedResult, setLastScannedResult] = useState<any>(null);
  const [manualCodeInput, setManualCodeInput] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [scanMessage, setScanMessage] = useState<{ type: 'success' | 'warning' | 'error'; text: string } | null>(
    null
  );

  // Manual Attendance State
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || '');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceSheet, setAttendanceSheet] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Report State
  const [reportSearch, setReportSearch] = useState('');

  // Audio tone helper
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880; // A5 note
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (err) {
      // Audio not permitted in some browsers without user interaction
    }
  };

  // Process a QR Scan or manual code entry
  const handleProcessScan = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    // Find student matching studentId or registrationNo or username
    const student = students.find(
      (s) =>
        s.studentId.toUpperCase() === trimmed ||
        s.registrationNo.toUpperCase() === trimmed ||
        s.username.toUpperCase() === trimmed ||
        s.phone === trimmed
    );

    if (!student) {
      setScanMessage({
        type: 'error',
        text: `Student record not found for code "${code}". Please check student ID or register student first.`,
      });
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Check if already marked for today
    const existing = attendanceRecords.find(
      (a) => a.studentId === student.id && a.date === todayStr
    );

    if (existing) {
      setScanMessage({
        type: 'warning',
        text: `Attendance ALREADY marked for ${student.name} today at ${existing.time}. Duplicate entry prevented.`,
      });
      setLastScannedResult({
        student,
        time: existing.time,
        status: existing.status,
        alreadyMarked: true,
      });
      return;
    }

    // Mark attendance
    markAttendance(student.id, 'Present', student.batchId);
    playBeep();

    setScanMessage({
      type: 'success',
      text: `Attendance marked successfully for ${student.name} at ${nowTimeStr}!`,
    });

    setLastScannedResult({
      student,
      time: nowTimeStr,
      status: 'Present',
      alreadyMarked: false,
    });
    setManualCodeInput('');
  };

  // Setup batch students for manual attendance
  const batchStudents = students.filter(
    (s) => s.courseId === selectedCourseId || s.batchId === selectedBatchId
  );

  const markAll = (status: 'Present' | 'Absent') => {
    const next: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    batchStudents.forEach((s) => {
      next[s.id] = status;
    });
    setAttendanceSheet(next);
  };

  const handleSaveManualAttendance = () => {
    batchStudents.forEach((s) => {
      const status = attendanceSheet[s.id] || 'Present';
      markAttendance(s.id, status, s.batchId, manualDate);
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Warning WhatsApp for low attendance
  const sendLowAttendanceWarning = (s: any, rate: number) => {
    openWhatsAppDialog(
      s.phone,
      `Dear Parent / Student (${s.name}),\n\nThis is an official academic notice from RJ TECH (Computer Training & Digital Education Center).\n\nYour current practical lab attendance is only ${rate}%, which is below the mandatory 75% required for final certification and examinations.\nKindly maintain regular attendance in your assigned batch (${s.batchName}).\n\nHelpline: 9635302734\nRJ TECH Administration`,
      `Low Attendance Warning WhatsApp - ${s.name}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
            Attendance Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time QR barcode scanner, manual batch roster, and attendance analytics for RJ TECH.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('qr')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'qr' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            QR Scanner
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'manual' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            Manual Batch Entry
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'report' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            Attendance Report
          </button>
        </div>
      </div>

      {/* ===================== TAB 1: QR ATTENDANCE SCANNER ===================== */}
      {activeTab === 'qr' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Scanner View / Simulator */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">Lab Gate QR Scanner</h3>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                    <Volume2 className={`w-4 h-4 ${soundEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>Beep Sound</span>
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 ml-1"
                    />
                  </label>
                  <Button
                    size="sm"
                    variant={scannerActive ? 'danger' : 'primary'}
                    onClick={() => setScannerActive(!scannerActive)}
                  >
                    {scannerActive ? 'Pause Scanner' : 'Start Camera Scanner'}
                  </Button>
                </div>
              </div>

              {/* Viewfinder Window */}
              <div className="relative h-64 rounded-2xl bg-slate-900 overflow-hidden flex flex-col items-center justify-center text-white border-4 border-slate-800 shadow-inner">
                {scannerActive ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                    {/* Pulsing scanning frame */}
                    <div className="w-48 h-48 border-2 border-dashed border-sky-400 rounded-2xl relative flex items-center justify-center animate-pulse">
                      <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-bounce" />
                      <QrCode className="w-16 h-16 text-sky-400/40" />
                    </div>
                    <span className="text-[11px] text-sky-200 mt-3 font-medium bg-slate-800/80 px-3 py-1 rounded-full">
                      Point student ID card barcode or QR towards camera
                    </span>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <QrCode className="w-12 h-12 text-slate-600 mx-auto" />
                    <p className="text-xs font-semibold text-slate-300">
                      Camera scanner is currently paused.
                    </p>
                    <p className="text-[11px] text-slate-500 max-w-xs">
                      Click "Start Camera Scanner" or test by choosing quick demo student barcodes below.
                    </p>
                  </div>
                )}
              </div>

              {/* Manual Barcode / Student ID Input fallback */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Manual Code Entry (If Scanner Camera is Busy / Barcode Gun Reader)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Student ID, Roll No, or Reg No (e.g. RJT-1001)"
                    value={manualCodeInput}
                    onChange={(e) => setManualCodeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleProcessScan(manualCodeInput);
                    }}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono uppercase"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleProcessScan(manualCodeInput)}
                  >
                    Mark Present
                  </Button>
                </div>
              </div>

              {/* Instant 1-Click Scan Simulator */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  1-Click Test Scanners (Simulate ID Card Scan):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {students.slice(0, 4).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleProcessScan(s.studentId)}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Scan {s.name.split(' ')[0]} ({s.studentId})
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Instant Scan Feedback Card */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                Scanner Terminal Response
              </h3>

              {scanMessage && (
                <div
                  className={`p-3.5 rounded-2xl text-xs font-medium flex items-start gap-2.5 ${
                    scanMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : scanMessage.type === 'warning'
                      ? 'bg-amber-50 text-amber-900 border border-amber-200'
                      : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  {scanMessage.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <p className="leading-snug">{scanMessage.text}</p>
                </div>
              )}

              {lastScannedResult ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={lastScannedResult.student.photo}
                      alt={lastScannedResult.student.name}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {lastScannedResult.student.name}
                      </h4>
                      <p className="text-xs text-blue-700 font-semibold">
                        {lastScannedResult.student.courseName}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        ID: {lastScannedResult.student.studentId} • Roll: {lastScannedResult.student.rollNo}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Batch Name:</span>
                      <span className="font-bold text-slate-800">{lastScannedResult.student.batchName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Time Recorded:</span>
                      <span className="font-mono font-bold text-emerald-700">{lastScannedResult.time}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Status:</span>
                      <Badge variant="success" size="sm">Present</Badge>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Fee Balance:</span>
                      <span className="font-semibold text-slate-800">
                        {lastScannedResult.student.dueFee > 0 ? `₹${lastScannedResult.student.dueFee} Due` : 'Cleared'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Scan an ID card or enter student ID to view attendance record.
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: MANUAL BATCH ATTENDANCE ===================== */}
      {activeTab === 'manual' && (
        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Course</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Batch</label>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Attendance Date</label>
              <input
                type="date"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-semibold">
              Roster: {batchStudents.length} Students in batch
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => markAll('Present')}>
                Mark All Present
              </Button>
              <Button size="sm" variant="outline" onClick={() => markAll('Absent')}>
                Mark All Absent
              </Button>
            </div>
          </div>

          {/* Roster Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Roll</th>
                  <th className="py-2.5 px-4">Student Name</th>
                  <th className="py-2.5 px-4">Student ID</th>
                  <th className="py-2.5 px-4 text-center">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batchStudents.map((st) => {
                  const currentStatus = attendanceSheet[st.id] || 'Present';
                  return (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">{st.rollNo}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <img src={st.photo} alt={st.name} className="w-7 h-7 rounded-full object-cover" />
                          <span className="font-bold text-slate-900">{st.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">{st.studentId}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                          <button
                            type="button"
                            onClick={() => setAttendanceSheet({ ...attendanceSheet, [st.id]: 'Present' })}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => setAttendanceSheet({ ...attendanceSheet, [st.id]: 'Absent' })}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                              currentStatus === 'Absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            type="button"
                            onClick={() => setAttendanceSheet({ ...attendanceSheet, [st.id]: 'Late' })}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                              currentStatus === 'Late'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Late
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Batch attendance saved successfully!
              </span>
            ) : (
              <div />
            )}

            <Button variant="primary" size="md" onClick={handleSaveManualAttendance}>
              Save Batch Attendance
            </Button>
          </div>
        </Card>
      )}

      {/* ===================== TAB 3: ATTENDANCE REPORT & WARNINGS ===================== */}
      {activeTab === 'report' && (
        <Card className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Attendance Analytics</h3>
              <p className="text-xs text-slate-500">
                Minimum 75% attendance mandatory for exam qualification.
              </p>
            </div>
            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Search student in report..."
                value={reportSearch}
                onChange={(e) => setReportSearch(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4">Course</th>
                  <th className="py-2.5 px-4">Batch</th>
                  <th className="py-2.5 px-4">Presence Rate</th>
                  <th className="py-2.5 px-4">Status & Warning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students
                  .filter((s) => s.name.toLowerCase().includes(reportSearch.toLowerCase()))
                  .map((st) => {
                    // Calculate student attendance
                    const stRecords = attendanceRecords.filter((a) => a.studentId === st.id);
                    const presentCnt = stRecords.filter((a) => a.status === 'Present').length;
                    const rate =
                      stRecords.length > 0 ? Math.round((presentCnt / stRecords.length) * 100) : 94;
                    const isLow = rate < 75;

                    return (
                      <tr key={st.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img src={st.photo} alt={st.name} className="w-7 h-7 rounded-full object-cover" />
                            <div>
                              <p className="font-bold text-slate-900">{st.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{st.studentId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{st.courseName}</td>
                        <td className="py-3 px-4 text-slate-500">{st.batchName}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div
                                style={{ width: `${rate}%` }}
                                className={`h-full rounded-full ${
                                  isLow ? 'bg-rose-500' : rate > 85 ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}
                              />
                            </div>
                            <span
                              className={`font-bold font-mono ${
                                isLow ? 'text-rose-600' : 'text-slate-800'
                              }`}
                            >
                              {rate}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {isLow ? (
                            <div className="flex items-center gap-2">
                              <Badge variant="danger" size="sm">Low Attendance</Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                icon={MessageSquare}
                                onClick={() => sendLowAttendanceWarning(st, rate)}
                                className="text-[10px] py-0.5 px-2 border-rose-300 text-rose-700 hover:bg-rose-50"
                              >
                                Send Warning WhatsApp
                              </Button>
                            </div>
                          ) : (
                            <Badge variant="success" size="sm">Good Standing</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
