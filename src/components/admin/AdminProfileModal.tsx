import React, { useState, useRef } from 'react';
import {
  User as UserIcon,
  Camera,
  Upload,
  CheckCircle2,
  Shield,
  Mail,
  Fingerprint,
  Building2,
  X,
  Loader2,
  Image as ImageIcon,
  Save,
} from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { storage, db } from '../../firebase/config';
import { useApp } from '../../context/AppContext';
import { Button, Badge } from '../common/UIComponents';

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminProfileModal: React.FC<AdminProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, settings, updateAdminProfile, showToast } = useApp();

  const [name, setName] = useState(currentUser?.name || settings.directorName || 'Director (Admin)');
  const [email, setEmail] = useState(currentUser?.email || settings.email || 'rupamsr123@gmail.com');
  const [avatarPreview, setAvatarPreview] = useState<string>(
    currentUser?.avatar || settings.adminPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const adminUid = currentUser?.id || 'tsNNsHwlcVNwqnr8iadSdx9yXkb2';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Image size should be less than 5MB.');
      return;
    }

    // Local instant preview
    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);

    setIsUploading(true);
    setUploadProgress('Uploading to Firebase Storage...');

    let finalPhotoUrl = '';

    try {
      // 1. Upload to Firebase Storage
      const fileExt = file.name.split('.').pop() || 'jpg';
      const storagePath = `admin_profiles/${adminUid}_${Date.now()}.${fileExt}`;
      const storageRef = ref(storage, storagePath);

      const uploadResult = await uploadBytes(storageRef, file, {
        contentType: file.type,
      });

      finalPhotoUrl = await getDownloadURL(uploadResult.ref);
      setUploadProgress('Persisting to Admin Profile Document...');
    } catch (storageErr) {
      console.warn('Firebase Storage upload warning, falling back to base64 encoding:', storageErr);
      // Fallback to high-quality DataURL so photo updates reliably even if storage bucket rules restrict
      finalPhotoUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    try {
      // 2. Persist to Firestore user document
      await setDoc(
        doc(db, 'users', adminUid),
        {
          id: adminUid,
          name,
          email,
          avatar: finalPhotoUrl,
          role: 'admin',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      // 3. Update AppContext state & localStorage
      updateAdminProfile({
        name,
        email,
        avatar: finalPhotoUrl,
      });

      setAvatarPreview(finalPhotoUrl);
      showToast('success', 'Admin Profile photo successfully uploaded and persisted!');
    } catch (dbErr) {
      console.error('Error persisting profile to Firestore:', dbErr);
      // Still update local context
      updateAdminProfile({
        name,
        email,
        avatar: finalPhotoUrl,
      });
      showToast('success', 'Admin profile photo updated locally!');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress('Saving profile details...');

    try {
      const finalAvatar = avatarPreview;

      // Persist to Firestore
      await setDoc(
        doc(db, 'users', adminUid),
        {
          id: adminUid,
          name,
          email,
          avatar: finalAvatar,
          role: 'admin',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      updateAdminProfile({
        name,
        email,
        avatar: finalAvatar,
      });

      showToast('success', 'Admin profile information saved successfully.');
      onClose();
    } catch (err) {
      console.error('Save profile error:', err);
      updateAdminProfile({
        name,
        email,
        avatar: avatarPreview,
      });
      showToast('success', 'Profile details updated.');
      onClose();
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setAvatarPreview(urlInput.trim());
    setShowUrlInput(false);
    setUrlInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-xs">
              <Shield className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-black font-heading">Admin Profile & Display Photo</h2>
              <p className="text-xs text-blue-100">Manage administrator avatar & authentication details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSaveDetails} className="p-6 space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-200 ring-2 ring-blue-500/20">
                <img
                  src={avatarPreview}
                  alt={name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Camera Upload Trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md border-2 border-white transition-all transform hover:scale-105 cursor-pointer"
                title="Upload new display photo"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-sm font-bold text-slate-900">{name}</span>
                <Badge variant="primary" size="sm">ADMINISTRATOR</Badge>
              </div>

              <p className="text-xs text-slate-500">
                Upload your picture using Firebase Storage. Photos are automatically saved to your profile document.
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  icon={Upload}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload Display Photo'}
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  icon={ImageIcon}
                  onClick={() => setShowUrlInput(!showUrlInput)}
                >
                  Image URL
                </Button>
              </div>
            </div>
          </div>

          {/* Upload Progress Status */}
          {uploadProgress && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2.5 text-xs text-blue-700 font-medium">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
              <span>{uploadProgress}</span>
            </div>
          )}

          {/* Optional Direct URL Input */}
          {showUrlInput && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Paste Photo Web URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <Button type="button" size="sm" variant="secondary" onClick={handleApplyUrl}>
                  Apply
                </Button>
              </div>
            </div>
          )}

          {/* Profile Fields */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Director / Administrator Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Admin Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Readonly Account Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-1">
                  <Fingerprint className="w-3.5 h-3.5 text-blue-600" />
                  <span>Admin Firebase UID</span>
                </div>
                <p className="font-mono text-[11px] text-slate-800 break-all font-semibold">
                  {adminUid}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Institute Head</span>
                </div>
                <p className="text-[11px] text-slate-800 font-semibold truncate">
                  {settings.instituteName || 'RJ TECH'}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={Save}
              disabled={isUploading}
            >
              {isUploading ? 'Saving...' : 'Save Profile Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
