import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  Plus,
  Edit2,
  Trash2,
  FileText,
  Download,
  Users,
  CheckCircle2,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course, Batch, Schedule, StudyMaterial } from '../../types';
import { Button, Card, Badge, Modal } from '../common/UIComponents';

export const AcademicManagement: React.FC<{
  initialTab?: 'courses' | 'batches' | 'schedule' | 'study_materials';
}> = ({ initialTab = 'courses' }) => {
  const {
    courses,
    batches,
    schedules,
    studyMaterials,
    addCourse,
    updateCourse,
    deleteCourse,
    addBatch,
    updateBatch,
    deleteBatch,
    addStudyMaterial,
    deleteStudyMaterial,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'courses' | 'batches' | 'schedule' | 'study_materials'>(
    initialTab
  );

  // Add Course Modal
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courseForm, setCourseForm] = useState({
    name: '',
    code: '',
    duration: '6 Months',
    eligibility: '10th Standard / Higher',
    admissionFee: 500,
    monthlyFee: 500,
    examFee: 300,
    certificateFee: 200,
    totalFees: 3500,
    description: '',
    syllabus: 'Computer Fundamentals, MS Word, MS Excel, Internet & Email',
    status: 'Active' as 'Active' | 'Inactive',
  });

  // Add Batch Modal
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchForm, setBatchForm] = useState({
    name: '',
    courseId: courses[0]?.id || '',
    startTime: '08:00 AM',
    endTime: '10:00 AM',
    days: 'Mon, Wed, Fri',
    capacity: 20,
    room: 'Lab 1',
    trainer: 'B. Maji (Lead Faculty)',
    status: 'Active' as 'Active' | 'Completed' | 'Upcoming',
  });

  // Add Study Material Modal
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    title: '',
    courseId: courses[0]?.id || '',
    type: 'PDF' as 'PDF' | 'Notes' | 'Assignment',
    url: 'https://example.com/materials/rjt-notes.pdf',
    description: 'Comprehensive lab exercise notes & keyboard shortcuts.',
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    addCourse({
      ...courseForm,
      syllabus: courseForm.syllabus.split(',').map((s) => s.trim()),
    });
    setCourseModalOpen(false);
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const course = courses.find((c) => c.id === batchForm.courseId);
    addBatch({
      ...batchForm,
      courseName: course?.name || 'Computer Training',
    });
    setBatchModalOpen(false);
  };

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const course = courses.find((c) => c.id === materialForm.courseId);
    addStudyMaterial({
      ...materialForm,
      courseName: course?.name || 'General Computer',
      size: '2.4 MB',
    });
    setMaterialModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
            Academic Operations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage certified computer courses, training batches, lab schedules, and student notes.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'courses' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('batches')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'batches' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            Batches ({batches.length})
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'schedule' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('study_materials')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'study_materials' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            Study Notes ({studyMaterials.length})
          </button>
        </div>
      </div>

      {/* ===================== TAB 1: COURSES ===================== */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setCourseModalOpen(true)}
            >
              Add New Course
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => (
              <Card key={c.id} className="p-6 flex flex-col justify-between border-slate-200">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                      {c.code}
                    </span>
                    <Badge variant={c.status === 'Active' ? 'success' : 'neutral'} size="sm">
                      {c.status}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{c.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">{c.duration} • {c.eligibility}</p>
                  <p className="text-xs text-slate-600 line-clamp-3 mb-3">{c.description}</p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Admission Fee:</span>
                      <span className="font-semibold text-slate-800">₹{c.admissionFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Monthly Fee:</span>
                      <span className="font-semibold text-slate-800">₹{c.monthlyFee} / mo</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-blue-700">
                      <span>Total Course Fee:</span>
                      <span>₹{c.totalFees}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                  <span className="text-[11px] text-slate-400">
                    Syllabus: {c.syllabus?.length || 4} units
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => deleteCourse(c.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 2: BATCHES ===================== */}
      {activeTab === 'batches' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setBatchModalOpen(true)}
            >
              Create New Batch
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((b) => (
              <Card key={b.id} className="p-6 space-y-4 border-slate-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{b.name}</h3>
                    <p className="text-xs text-blue-600 font-medium">{b.courseName}</p>
                  </div>
                  <Badge variant={b.status === 'Active' ? 'success' : 'neutral'} size="sm">
                    {b.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>Time: <strong>{b.startTime} - {b.endTime}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-sky-500" />
                    <span>Days: <strong>{b.days || b.classDays?.join(', ') || 'Regular'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Laptop className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Location: <strong>{b.room}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-purple-500" />
                    <span>Capacity: <strong>{b.capacity || b.maxStudents || 25} Students</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">Trainer: <strong>{b.trainer || b.teacher || 'Senior Faculty'}</strong></span>
                  <button
                    onClick={() => deleteBatch(b.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: SCHEDULE / TIMETABLE ===================== */}
      {activeTab === 'schedule' && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Lab Timetable Matrix</h3>
              <p className="text-xs text-slate-500">Weekly lab system allocations for RJ TECH center</p>
            </div>
            <Badge variant="primary">Monday - Saturday</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timing Slot</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4">Subject / Module</th>
                  <th className="py-3 px-4">Days</th>
                  <th className="py-3 px-4">Room / Lab</th>
                  <th className="py-3 px-4">Instructor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schedules.map((sch: any) => (
                  <tr key={sch.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {sch.startTime} - {sch.endTime}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{sch.batchName}</td>
                    <td className="py-3 px-4 text-slate-700">{sch.subject}</td>
                    <td className="py-3 px-4 text-slate-500">{sch.days || sch.day}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-medium border border-blue-200">
                        {sch.room}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{sch.teacherName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ===================== TAB 4: STUDY MATERIALS ===================== */}
      {activeTab === 'study_materials' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setMaterialModalOpen(true)}
            >
              Upload Study Material
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyMaterials.map((m) => (
              <Card key={m.id} className="p-5 flex flex-col justify-between border-slate-200 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{m.type}</Badge>
                    <span className="text-[11px] text-slate-400 font-mono">{m.size}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{m.title}</h3>
                  <p className="text-xs text-blue-600 font-semibold">{m.courseName}</p>
                  <p className="text-xs text-slate-500">{m.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">{m.uploadDate}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      icon={Download}
                      onClick={() => alert(`Downloading ${m.title} from RJ TECH student cloud.`)}
                      className="text-xs py-1"
                    >
                      Download
                    </Button>
                    <button
                      onClick={() => deleteStudyMaterial(m.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Course */}
      {courseModalOpen && (
        <Modal
          isOpen={courseModalOpen}
          onClose={() => setCourseModalOpen(false)}
          title="Create Certified Course"
          maxWidth="lg"
        >
          <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diploma in Computer Application"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DCA-01"
                  value={courseForm.code}
                  onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Duration *</label>
                <select
                  value={courseForm.duration}
                  onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="1 Month">1 Month</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="12 Months">12 Months (1 Year)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Course Fee (₹) *</label>
                <input
                  type="number"
                  required
                  value={courseForm.totalFees}
                  onChange={(e) => setCourseForm({ ...courseForm, totalFees: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-blue-700"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Course Description</label>
              <textarea
                rows={2}
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Syllabus Modules (comma-separated)</label>
              <input
                type="text"
                value={courseForm.syllabus}
                onChange={(e) => setCourseForm({ ...courseForm, syllabus: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setCourseModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Save Course
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Add Batch */}
      {batchModalOpen && (
        <Modal
          isOpen={batchModalOpen}
          onClose={() => setBatchModalOpen(false)}
          title="Create New Batch"
          maxWidth="md"
        >
          <form onSubmit={handleCreateBatch} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Batch Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. DCA Morning Batch 2026-A"
                value={batchForm.name}
                onChange={(e) => setBatchForm({ ...batchForm, name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Course *</label>
              <select
                value={batchForm.courseId}
                onChange={(e) => setBatchForm({ ...batchForm, courseId: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Start Time</label>
                <input
                  type="text"
                  value={batchForm.startTime}
                  onChange={(e) => setBatchForm({ ...batchForm, startTime: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">End Time</label>
                <input
                  type="text"
                  value={batchForm.endTime}
                  onChange={(e) => setBatchForm({ ...batchForm, endTime: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Room</label>
                <select
                  value={batchForm.room}
                  onChange={(e) => setBatchForm({ ...batchForm, room: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Lab 1">Lab 1 (Primary)</option>
                  <option value="Lab 2">Lab 2 (Graphic Studio)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Trainer</label>
                <input
                  type="text"
                  value={batchForm.trainer}
                  onChange={(e) => setBatchForm({ ...batchForm, trainer: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setBatchModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Create Batch
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Add Study Material */}
      {materialModalOpen && (
        <Modal
          isOpen={materialModalOpen}
          onClose={() => setMaterialModalOpen(false)}
          title="Upload Course Study Material"
          maxWidth="md"
        >
          <form onSubmit={handleCreateMaterial} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Document Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. MS Word Complete Practical Workbook"
                value={materialForm.title}
                onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Course</label>
              <select
                value={materialForm.courseId}
                onChange={(e) => setMaterialForm({ ...materialForm, courseId: e.target.value })}
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
              <label className="block font-semibold text-slate-700 mb-1">Notes Description</label>
              <textarea
                rows={2}
                value={materialForm.description}
                onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setMaterialModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Publish to Students
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
