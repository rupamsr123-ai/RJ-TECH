import React from 'react';
import { Printer, Download, Share2, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal, Button, QRCodeDisplay } from './UIComponents';

export const PrintableReceiptModal: React.FC = () => {
  const { activeReceipt, setActiveReceipt, settings, openWhatsAppDialog } = useApp();

  if (!activeReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const msg = `Hello ${activeReceipt.studentName},\n\nThank you for your fee payment of ₹${activeReceipt.amount} for course "${activeReceipt.courseName}".\nReceipt No: ${activeReceipt.receiptNo}\nRemaining Due: ₹${activeReceipt.remainingDue}\n\nThank you,\nRJ TECH\nComputer Training & Digital Education Center\nPhone: 9635302734`;
    openWhatsAppDialog('9635302734', msg, 'Share Fee Receipt on WhatsApp');
  };

  return (
    <Modal
      isOpen={Boolean(activeReceipt)}
      onClose={() => setActiveReceipt(null)}
      title="Official Money Receipt"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Actions header - hidden when printing */}
        <div className="no-print flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">
            Receipt: <strong className="text-slate-800">{activeReceipt.receiptNo}</strong>
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" icon={Share2} onClick={handleWhatsAppShare}>
              WhatsApp Share
            </Button>
            <Button size="sm" variant="primary" icon={Printer} onClick={handlePrint}>
              Print Receipt
            </Button>
          </div>
        </div>

        {/* The Receipt Canvas */}
        <div className="printable-area border-2 border-slate-800 rounded-2xl p-6 sm:p-8 bg-white shadow-sm text-slate-900">
          {/* Header */}
          <div className="text-center pb-4 border-b-2 border-slate-800">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl overflow-hidden border border-slate-300 bg-white p-0.5 mb-1 shadow-xs">
              <img
                src={settings.logoUrl || '/rj_tech_logo.jpg'}
                alt="RJ TECH Logo"
                className="w-full h-full object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              RJ TECH
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-blue-700 uppercase tracking-wider">
              {settings.tagline}
            </p>
            <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
              {settings.addressLine1}, {settings.addressLine2}, {settings.state} - {settings.pinCode}
            </p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">
              Phone: {settings.phone}
            </p>
          </div>

          <div className="flex items-center justify-between my-4 text-xs">
            <div className="bg-slate-100 font-bold px-3 py-1 rounded-md uppercase tracking-wider text-slate-800 border border-slate-300">
              MONEY RECEIPT
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-600">Receipt No: <span className="font-mono font-bold text-slate-900">{activeReceipt.receiptNo}</span></p>
              <p className="text-slate-500">Date: {activeReceipt.date}</p>
            </div>
          </div>

          {/* Student details grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
            <div>
              <span className="text-slate-500 block">Student Name</span>
              <span className="font-bold text-slate-900 text-sm">{activeReceipt.studentName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Registration Number</span>
              <span className="font-mono font-semibold text-slate-800">{activeReceipt.registrationNo}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Student ID</span>
              <span className="font-mono font-semibold text-slate-800">{activeReceipt.studentId}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Course Enrolled</span>
              <span className="font-semibold text-slate-800">{activeReceipt.courseName}</span>
            </div>
          </div>

          {/* Payment breakdown table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden mb-6 text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-700">
                <tr>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-center">Payment Mode</th>
                  <th className="p-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3">
                    <p className="font-semibold text-slate-800">Tuition / Installment Fee</p>
                    <p className="text-[11px] text-slate-500">{activeReceipt.remarks || 'Course payment received'}</p>
                  </td>
                  <td className="p-3 text-center font-medium">{activeReceipt.paymentMethod}</td>
                  <td className="p-3 text-right font-bold text-slate-900 text-sm">₹{activeReceipt.amount.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Dues summary */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-center text-xs mb-8">
            <div>
              <span className="text-slate-500 block">Previous Balance</span>
              <span className="font-bold text-slate-700 text-sm">₹{(activeReceipt.previousDue || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="border-x border-blue-200">
              <span className="text-blue-700 font-medium block">Paid Today</span>
              <span className="font-extrabold text-blue-700 text-base">₹{activeReceipt.amount.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Remaining Due</span>
              <span className={`font-bold text-sm ${(activeReceipt.remainingDue || 0) > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                ₹{(activeReceipt.remainingDue || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Footer signatures & QR */}
          <div className="flex items-end justify-between pt-4 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <QRCodeDisplay value={`RJTECH-RECEIPT:${activeReceipt.receiptNo}|AMT:${activeReceipt.amount}|STUDENT:${activeReceipt.studentName}`} size={70} />
              <div className="text-[10px] text-slate-500 max-w-[140px]">
                Scan to verify receipt digitally with RJ TECH records.
              </div>
            </div>

            <div className="text-right">
              <div className="w-36 border-b border-slate-400 mb-1"></div>
              <p className="text-xs font-bold text-slate-800">{activeReceipt.receivedBy || 'Authorized Officer'}</p>
              <p className="text-[10px] text-slate-500">RJ TECH Authorized Seal</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export const PrintableIDCardModal: React.FC = () => {
  const { activeIDCardStudent, setActiveIDCardStudent, settings } = useApp();

  if (!activeIDCardStudent) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={Boolean(activeIDCardStudent)}
      onClose={() => setActiveIDCardStudent(null)}
      title="Student Identity Card"
      maxWidth="lg"
    >
      <div className="space-y-6">
        <div className="no-print flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-600">Print or save standard PVC/Laminate identity card.</p>
          <Button size="sm" variant="primary" icon={Printer} onClick={handlePrint}>
            Print ID Card
          </Button>
        </div>

        {/* ID Card front & back display */}
        <div className="printable-area flex flex-col items-center justify-center p-2">
          <div className="w-full max-w-[340px] rounded-2xl overflow-hidden border-2 border-slate-900 shadow-xl bg-white text-slate-800">
            {/* Top header banner */}
            <div className="bg-gradient-to-r from-blue-700 to-sky-600 text-white p-3.5 text-center relative">
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg p-0.5 flex items-center justify-center shadow-sm overflow-hidden shrink-0">
                  <img
                    src={settings.logoUrl || '/rj_tech_logo.jpg'}
                    alt="RJ TECH Logo"
                    className="w-full h-full object-contain rounded-md"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-base font-extrabold tracking-wide leading-none uppercase">RJ TECH</h3>
                  <p className="text-[9px] text-blue-100 font-medium tracking-tight mt-0.5">
                    {settings.tagline}
                  </p>
                </div>
              </div>
            </div>

            {/* Content body */}
            <div className="p-4 text-center">
              <div className="relative mx-auto w-24 h-24 rounded-full p-1 border-2 border-blue-600 shadow-sm mb-3">
                <img
                  src={activeIDCardStudent.photo}
                  alt={activeIDCardStudent.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <h4 className="text-lg font-bold text-slate-900 leading-tight">
                {activeIDCardStudent.name}
              </h4>
              <p className="text-xs font-semibold text-blue-600 mb-3">{activeIDCardStudent.courseName}</p>

              <div className="text-left text-xs bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1.5 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student ID:</span>
                  <span className="font-mono font-bold text-slate-900">{activeIDCardStudent.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registration No:</span>
                  <span className="font-mono text-slate-800">{activeIDCardStudent.registrationNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Roll No:</span>
                  <span className="font-bold text-slate-800">{activeIDCardStudent.rollNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Batch:</span>
                  <span className="text-slate-800 truncate max-w-[160px]">{activeIDCardStudent.batchName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Emergency Phone:</span>
                  <span className="text-slate-800">{activeIDCardStudent.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Session:</span>
                  <span className="text-slate-800">{activeIDCardStudent.session}</span>
                </div>
              </div>

              {/* Bottom bar with QR */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <QRCodeDisplay
                  value={`RJTECH-ID:${activeIDCardStudent.studentId}|REG:${activeIDCardStudent.registrationNo}|NAME:${activeIDCardStudent.name}`}
                  size={55}
                />
                <div className="text-right">
                  <div className="w-24 border-b border-slate-400 mb-1 ml-auto"></div>
                  <p className="text-[10px] font-bold text-slate-800">Director Signature</p>
                  <p className="text-[8px] text-slate-500">RJ TECH Tamluk</p>
                </div>
              </div>
            </div>

            {/* Backstrip info */}
            <div className="bg-slate-900 text-slate-300 p-2 text-center text-[9px] leading-tight">
              Hurinan, Joybalarampur, Tamluk, Purba Medinipur - 721137 | Phone: 9635302734
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export const PrintableCertificateModal: React.FC = () => {
  const { activeCertificate, setActiveCertificate, settings } = useApp();

  if (!activeCertificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={Boolean(activeCertificate)}
      onClose={() => setActiveCertificate(null)}
      title="Certificate Preview & Print"
      maxWidth="3xl"
    >
      <div className="space-y-6">
        <div className="no-print flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-600">
            Certificate No: <strong className="text-slate-800">{activeCertificate.certificateNo}</strong>
          </p>
          <Button size="sm" variant="primary" icon={Printer} onClick={handlePrint}>
            Print Certificate
          </Button>
        </div>

        {/* Certificate Frame */}
        <div className="printable-area border-8 border-double border-amber-600/80 rounded-2xl p-8 sm:p-12 bg-[#FFFDF9] text-center shadow-lg relative overflow-hidden">
          {/* Decorative watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Award className="w-96 h-96 text-slate-900" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-300 bg-white p-1 shadow-md mb-2">
              <img
                src={settings.logoUrl || '/rj_tech_logo.jpg'}
                alt="RJ TECH Logo"
                className="w-full h-full object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-heading">
              RJ TECH
            </h1>
            <p className="text-xs sm:text-sm font-semibold tracking-widest text-blue-700 uppercase mt-1">
              {settings.tagline}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Hurinan, Joybalarampur, Tamluk, Purba Medinipur, West Bengal - 721137 | Phone: 9635302734
            </p>

            <div className="my-6">
              <span className="inline-block px-6 py-1.5 border-y-2 border-amber-600 text-amber-900 font-black tracking-widest text-base sm:text-lg uppercase">
                CERTIFICATE OF COMPLETION
              </span>
            </div>

            <p className="text-sm italic text-slate-600 font-serif">
              This is to proudly certify that
            </p>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 my-3 tracking-wide underline decoration-amber-400 decoration-2 underline-offset-8">
              {activeCertificate.studentName}
            </h2>

            <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              has successfully completed the prescribed course of study and practical training in
            </p>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 my-2">
              {activeCertificate.courseName}
            </h3>

            <p className="text-xs text-slate-600 mb-6">
              Course Duration: <strong className="text-slate-800">{activeCertificate.courseDuration}</strong> | Grade Secured:{' '}
              <strong className="text-emerald-700">{activeCertificate.grade} ({activeCertificate.percentage}%)</strong>
            </p>

            {/* Registration details bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left text-xs bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 mb-8 max-w-2xl mx-auto">
              <div>
                <span className="text-slate-500 text-[10px] block">Registration No:</span>
                <span className="font-mono font-bold text-slate-800">{activeCertificate.registrationNo}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Certificate No:</span>
                <span className="font-mono font-bold text-amber-900">{activeCertificate.certificateNo}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Issue Date:</span>
                <span className="font-semibold text-slate-800">{activeCertificate.issueDate}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Status:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="flex items-end justify-between pt-6 border-t border-slate-200 max-w-2xl mx-auto">
              <div className="text-left">
                <QRCodeDisplay value={activeCertificate.verificationUrl || `https://rjtech-institute.edu.in/verify?cert=${activeCertificate.certificateNo}`} size={70} />
                <p className="text-[9px] text-slate-400 mt-1">Scan to Verify Certificate Online</p>
              </div>

              {/* Institute Seal */}
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-700 text-amber-800 flex flex-col items-center justify-center text-[9px] font-bold uppercase tracking-tighter p-1 text-center shadow-xs">
                <span>★ RJ TECH ★</span>
                <span className="text-[7px]">GOVT. REG. PATTERN</span>
                <span>INSTITUTE SEAL</span>
              </div>

              <div className="text-right">
                <div className="w-36 border-b border-slate-500 mb-1 ml-auto"></div>
                <p className="text-xs font-bold text-slate-900">{activeCertificate.directorName || 'Director, RJ TECH'}</p>
                <p className="text-[10px] text-slate-500">Director & Academic Controller</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export const PrintableResultModal: React.FC = () => {
  const { activeExamResult, setActiveExamResult, settings } = useApp();

  if (!activeExamResult) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={Boolean(activeExamResult)}
      onClose={() => setActiveExamResult(null)}
      title="Official Marksheet & Academic Report"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        <div className="no-print flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-600">Marksheet verification & printable grade card.</p>
          <Button size="sm" variant="primary" icon={Printer} onClick={handlePrint}>
            Print Marksheet
          </Button>
        </div>

        <div className="printable-area border-2 border-slate-800 rounded-2xl p-6 sm:p-8 bg-white text-slate-900 shadow-sm">
          {/* Header */}
          <div className="text-center pb-4 border-b-2 border-slate-800">
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">RJ TECH</h1>
            <p className="text-xs font-semibold text-blue-700">{settings.tagline}</p>
            <p className="text-[11px] text-slate-600">{settings.addressLine1}, {settings.addressLine2} - {settings.pinCode}</p>
            <span className="inline-block mt-2 px-3 py-0.5 bg-slate-900 text-white rounded text-[11px] font-bold tracking-wider uppercase">
              STATEMENT OF MARKS
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 my-4">
            <div>
              <span className="text-slate-500 block">Candidate Name</span>
              <span className="font-bold text-slate-900 text-sm">{activeExamResult.studentName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Registration Number</span>
              <span className="font-mono font-semibold text-slate-800">{activeExamResult.registrationNo}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Roll Number</span>
              <span className="font-bold text-slate-800">{activeExamResult.rollNo}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Course & Batch</span>
              <span className="font-semibold text-slate-800">{activeExamResult.courseName} ({activeExamResult.batchName})</span>
            </div>
            <div>
              <span className="text-slate-500 block">Exam Name</span>
              <span className="text-slate-800 font-medium">{activeExamResult.examName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Exam Date</span>
              <span className="text-slate-800">{activeExamResult.examDate}</span>
            </div>
          </div>

          {/* Marks table */}
          <table className="w-full text-left text-xs border border-slate-300 rounded-xl overflow-hidden mb-4">
            <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
              <tr>
                <th className="p-3">Paper / Subject</th>
                <th className="p-3 text-center">Full Marks</th>
                <th className="p-3 text-center">Marks Obtained</th>
                <th className="p-3 text-center">Percentage</th>
                <th className="p-3 text-center">Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-3 font-semibold text-slate-800">{activeExamResult.subject}</td>
                <td className="p-3 text-center">{activeExamResult.fullMarks}</td>
                <td className="p-3 text-center font-bold text-slate-900 text-sm">{activeExamResult.obtainedMarks}</td>
                <td className="p-3 text-center font-bold">{activeExamResult.percentage}%</td>
                <td className="p-3 text-center font-black text-blue-700">{activeExamResult.grade}</td>
              </tr>
            </tbody>
          </table>

          {/* Result summary */}
          <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs mb-8">
            <div>
              <span className="text-emerald-800 block text-[11px] font-medium">Final Classification</span>
              <span className="text-base font-extrabold text-emerald-900">
                {activeExamResult.result.toUpperCase()} - {activeExamResult.grade}
              </span>
            </div>
            <div className="text-right">
              <span className="text-emerald-800 block text-[11px]">Total Score</span>
              <span className="text-lg font-black text-emerald-900">
                {activeExamResult.obtainedMarks} / {activeExamResult.fullMarks} ({activeExamResult.percentage}%)
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between pt-4 border-t border-slate-200">
            <QRCodeDisplay value={`RJTECH-RESULT:${activeExamResult.registrationNo}|MARKS:${activeExamResult.obtainedMarks}/${activeExamResult.fullMarks}`} size={60} />
            <div className="text-right">
              <div className="w-32 border-b border-slate-400 mb-1 ml-auto"></div>
              <p className="text-xs font-bold text-slate-800">{activeExamResult.evaluatedBy || 'Academic Examiner'}</p>
              <p className="text-[10px] text-slate-500">RJ TECH Examination Cell</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
