import React, { useState, useRef } from 'react';
import {
  UserCheck,
  Settings,
  Shield,
  Phone,
  Mail,
  MapPin,
  Plus,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  Building,
  Save,
  Image as ImageIcon,
  Camera,
  Link as LinkIcon,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StaffMember } from '../../types';
import { Button, Card, Badge, Modal } from '../common/UIComponents';

export const StaffAndSettings: React.FC<{
  initialTab?: 'staff' | 'settings' | 'backup';
}> = ({ initialTab = 'staff' }) => {
  const {
    staff,
    settings,
    updateSettings,
    addStaff,
    deleteStaff,
    resetToDemoData,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'staff' | 'settings' | 'backup'>(initialTab);

  // Logo upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customLogoUrl, setCustomLogoUrl] = useState('');
  const [isProcessingLogo, setIsProcessingLogo] = useState(false);

  // Add Staff Modal
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: 'Trainer' as 'Admin' | 'Trainer' | 'Receptionist' | 'Accountant',
    phone: '',
    email: '',
    qualification: 'MCA / B.Tech Computer Science',
    salary: 15000,
    joiningDate: new Date().toISOString().split('T')[0],
    address: 'Tamluk, Purba Medinipur',
    status: 'Active' as 'Active' | 'Inactive',
  });

  // Settings form state
  const [instituteForm, setInstituteForm] = useState({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handle Logo file upload (reads as Data URL and saves)
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please choose a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast('error', 'Image file is too large. Please select an image under 2MB.');
      return;
    }

    setIsProcessingLogo(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setInstituteForm((prev) => ({ ...prev, logoUrl: dataUrl }));
        updateSettings({ logoUrl: dataUrl });
        showToast('success', 'New RJ TECH logo successfully uploaded and applied system-wide!');
      }
      setIsProcessingLogo(false);
    };
    reader.onerror = () => {
      showToast('error', 'Failed to read the selected image.');
      setIsProcessingLogo(false);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyLogoUrl = () => {
    if (!customLogoUrl.trim()) {
      showToast('error', 'Please enter a valid image web URL.');
      return;
    }
    const cleanUrl = customLogoUrl.trim();
    setInstituteForm((prev) => ({ ...prev, logoUrl: cleanUrl }));
    updateSettings({ logoUrl: cleanUrl });
    showToast('success', 'Custom logo URL applied successfully!');
    setCustomLogoUrl('');
  };

  const handleResetLogoToDefault = () => {
    const defaultLogo = '/rj_tech_logo.jpg';
    setInstituteForm((prev) => ({ ...prev, logoUrl: defaultLogo }));
    updateSettings({ logoUrl: defaultLogo });
    showToast('info', 'Institute logo reset to default official RJ TECH badge.');
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    addStaff(staffForm);
    setStaffModalOpen(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(instituteForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const data = localStorage.getItem('rjtech_institute_db_v2');
    if (!data) return;
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RJ_TECH_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        JSON.parse(json); // Validate JSON
        localStorage.setItem('rjtech_institute_db_v2', json);
        alert('Database backup restored successfully! Reloading...');
        window.location.reload();
      } catch (err) {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
            Faculty & System Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure institute profile, manage trainers & staff access, and perform JSON database backups.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'staff' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            Faculty & Staff ({staff.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            Institute Profile
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'backup' ? 'bg-white text-blue-600 shadow-xs font-bold' : ''
            }`}
          >
            Backup & Reset
          </button>
        </div>
      </div>

      {/* ===================== TAB 1: FACULTY & STAFF ===================== */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setStaffModalOpen(true)}
            >
              Add Faculty / Staff Member
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((st) => (
              <Card key={st.id} className="p-6 space-y-3 border-slate-200">
                <div className="flex items-start justify-between">
                  <Badge
                    variant={st.role === 'Admin' ? 'primary' : 'secondary'}
                    size="sm"
                  >
                    {st.role}
                  </Badge>
                  <Badge variant={st.status === 'Active' ? 'success' : 'neutral'} size="sm">
                    {st.status}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{st.name}</h3>
                  <p className="text-xs text-blue-700 font-semibold">{st.qualification}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{st.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{st.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{st.address}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Joined: {st.joiningDate}</span>
                  <button
                    onClick={() => deleteStaff(st.id)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 2: INSTITUTE SETTINGS ===================== */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-4xl">
          {/* Institute Logo & Branding Card */}
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Institute Logo & Branding</h3>
                  <Badge variant="primary" size="sm">Live Brand Asset</Badge>
                </div>
                <p className="text-slate-500 text-xs mt-0.5">
                  Change the official logo anytime. Updates immediately reflect on the website header, student portal, fee receipts, student ID cards, and certificates.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={RotateCcw}
                onClick={handleResetLogoToDefault}
              >
                Reset Default Logo
              </Button>
            </div>

            <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Logo Preview Box */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-white border-2 border-slate-200 shadow-md p-1.5 flex items-center justify-center group">
                  <img
                    src={instituteForm.logoUrl || settings.logoUrl || '/rj_tech_logo.jpg'}
                    alt="Institute Logo Preview"
                    className="w-full h-full object-contain rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                  {isProcessingLogo && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold rounded-xl">
                      Saving...
                    </div>
                  )}
                </div>
                <span className="mt-3 text-[11px] font-bold text-slate-700 block">
                  Current Active Logo
                </span>
                <span className="text-[10px] text-slate-400">
                  Visible across all portals & printouts
                </span>
              </div>

              {/* Upload & URL Controls */}
              <div className="md:col-span-8 space-y-4">
                {/* Upload Button */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Upload New Logo File
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                    onChange={handleLogoFileUpload}
                    className="hidden"
                  />
                  <div className="flex flex-wrap gap-2.5 items-center">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      icon={Upload}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessingLogo}
                    >
                      {isProcessingLogo ? 'Uploading...' : 'Choose Logo Image from Computer'}
                    </Button>
                    <span className="text-[11px] text-slate-400">
                      Supports PNG, JPG, SVG, WebP (Max 2MB)
                    </span>
                  </div>
                </div>

                {/* Web URL input */}
                <div className="pt-3 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Or Enter Image Web URL
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="url"
                        placeholder="https://example.com/logo.png"
                        value={customLogoUrl}
                        onChange={(e) => setCustomLogoUrl(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleApplyLogoUrl}
                    >
                      Apply URL
                    </Button>
                  </div>
                </div>

                {/* Feature checklist */}
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    Automatic Logo Propagation:
                  </p>
                  <p className="text-slate-600 pl-5 leading-tight">
                    Any logo uploaded here will instantly be used in Money Receipts, Student Laminated ID Cards, Official Completion Certificates, Website Header & Footer, and Student Portal.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Institute Details Form Card */}
          <Card className="p-6 sm:p-8">
            <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900">Official Institute Information</h3>
              <p className="text-slate-500 text-xs">
                This information appears on all student ID cards, receipts, certificates, and website footers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Institute Name</label>
                <input
                  type="text"
                  required
                  value={instituteForm.instituteName}
                  onChange={(e) =>
                    setInstituteForm({ ...instituteForm, instituteName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  required
                  value={instituteForm.tagline}
                  onChange={(e) =>
                    setInstituteForm({ ...instituteForm, tagline: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Mobile / Helpline</label>
                <input
                  type="text"
                  required
                  value={instituteForm.mobile}
                  onChange={(e) =>
                    setInstituteForm({ ...instituteForm, mobile: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={instituteForm.email}
                  onChange={(e) =>
                    setInstituteForm({ ...instituteForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Postal Address</label>
              <textarea
                rows={2}
                required
                value={instituteForm.address}
                onChange={(e) =>
                  setInstituteForm({ ...instituteForm, address: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Director / Principal Name</label>
                <input
                  type="text"
                  value={instituteForm.directorName}
                  onChange={(e) =>
                    setInstituteForm({ ...instituteForm, directorName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Registration / ISO Number</label>
                <input
                  type="text"
                  value={instituteForm.registrationNo}
                  onChange={(e) =>
                    setInstituteForm({ ...instituteForm, registrationNo: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Academic Session</label>
                <input
                  type="text"
                  value={instituteForm.currentSession}
                  onChange={(e) =>
                    setInstituteForm({ ...instituteForm, currentSession: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {saveSuccess ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Settings successfully saved!
                </span>
              ) : (
                <div />
              )}

              <Button type="submit" variant="primary" size="md" icon={Save}>
                Save Institute Configuration
              </Button>
            </div>
          </form>
        </Card>
        </div>
      )}

      {/* ===================== TAB 3: BACKUP & RESET ===================== */}
      {activeTab === 'backup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Database Backup & Export</h3>
            <p className="text-xs text-slate-500">
              Download a complete JSON backup of all registered students, fees, attendance marks, certificates, and academic schedules.
            </p>
            <Button
              variant="primary"
              size="md"
              icon={Download}
              onClick={handleExportBackup}
              className="w-full"
            >
              Download Full Database JSON
            </Button>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Restore or Reset System</h3>
            <p className="text-xs text-slate-500">
              Restore from an existing JSON file or reset back to default RJ TECH demo dataset.
            </p>

            <div className="space-y-3">
              <label className="block">
                <span className="text-xs font-semibold text-slate-700 block mb-1">
                  Upload JSON Backup File:
                </span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </label>

              <div className="pt-3 border-t border-slate-100">
                <Button
                  variant="danger"
                  size="sm"
                  icon={RefreshCw}
                  onClick={() => {
                    if (confirm('Reset entire application to initial RJ TECH sample database?')) {
                      resetToDemoData();
                    }
                  }}
                  className="w-full"
                >
                  Reset to Fresh Sample Dataset
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Modal: Add Staff */}
      {staffModalOpen && (
        <Modal
          isOpen={staffModalOpen}
          onClose={() => setStaffModalOpen(false)}
          title="Add Faculty / Staff Member"
          maxWidth="md"
        >
          <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Staff Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. B. Maji"
                value={staffForm.name}
                onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role / Designation *</label>
                <select
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Trainer">Faculty / Trainer</option>
                  <option value="Admin">System Administrator</option>
                  <option value="Receptionist">Front Desk / Receptionist</option>
                  <option value="Accountant">Accountant</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="9635302734"
                  value={staffForm.phone}
                  onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="faculty@rjtech.edu"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Academic Qualification</label>
                <input
                  type="text"
                  placeholder="e.g. MCA, B.Sc Computer Sc."
                  value={staffForm.qualification}
                  onChange={(e) => setStaffForm({ ...staffForm, qualification: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
              <input
                type="text"
                placeholder="HURINAN, JOYBALARAMPUR, TAMLUK"
                value={staffForm.address}
                onChange={(e) => setStaffForm({ ...staffForm, address: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setStaffModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Save Staff
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
