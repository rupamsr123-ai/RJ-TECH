import React, { useState } from 'react';
import {
  Monitor,
  CheckCircle2,
  BookOpen,
  Award,
  Users,
  ShieldCheck,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Search,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Layers,
  GraduationCap,
  MessageSquare,
  FileText,
  Lock,
  UserCheck,
  Briefcase,
  Laptop,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import { Button, Card, Badge, Modal } from '../common/UIComponents';

export const PublicNavbar: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({
  activeTab,
  setActiveTab,
}) => {
  const { settings, setActiveView } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'courses', label: 'Courses' },
    { id: 'admission', label: 'Admission' },
    { id: 'verify', label: 'Verify Certificate' },
    { id: 'notices', label: 'Notice' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top micro-bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-4 text-[11px] sm:text-xs">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            Hurinan, Joybalarampur, Tamluk, WB - 721137
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            Helpline: 9635302734
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-amber-300 font-medium">Session: {settings.currentSession}</span>
          <span className="text-slate-500">|</span>
          <button
            onClick={() => setActiveView('public_login_admin')}
            className="text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Staff / Admin Login
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-200 bg-white p-0.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
            <img
              src={settings.logoUrl || '/rj_tech_logo.jpg'}
              alt="RJ TECH Logo"
              className="w-full h-full object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-slate-900 font-heading">
                RJ TECH
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 bg-blue-50 text-[#155EEF] text-[10px] font-bold rounded-full uppercase border border-blue-200">
                Govt Reg.
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium tracking-tight">
              Computer Training & Digital Education Center
            </p>
          </div>
        </div>

        {/* Desktop navigation items */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer ${
                activeTab === item.id
                  ? 'bg-blue-50 text-[#155EEF] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Header Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveView('public_login_student')}
            className="border-slate-300 hover:border-blue-300"
          >
            Student Login
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveTab('admission')}
            className="shadow-sm shadow-blue-500/20"
          >
            Apply for Admission
          </Button>
        </div>

        {/* Mobile menu hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveView('public_login_student')}
            className="text-xs px-2.5"
          >
            Login
          </Button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
            aria-label="Toggle navigation menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`h-0.5 bg-current rounded-full transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`h-0.5 bg-current rounded-full transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 bg-current rounded-full transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-xl font-medium ${
                activeTab === item.id ? 'bg-blue-50 text-[#155EEF] font-bold' : 'text-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setActiveTab('admission');
                setMobileMenuOpen(false);
              }}
            >
              Apply for Admission
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export const PublicFooter: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const { settings, setActiveView } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Institute */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white border border-slate-700 overflow-hidden flex items-center justify-center p-0.5 shrink-0 shadow-sm">
                <img
                  src={settings.logoUrl || '/rj_tech_logo.jpg'}
                  alt="RJ TECH Logo"
                  className="w-full h-full object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">RJ TECH</h3>
                <p className="text-xs text-slate-400">{settings.tagline}</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Leading computer training & digital skills institute in Purba Medinipur. Dedicated to practical lab mastery, verified certificates, and career advancement for students.
            </p>
            <div className="pt-2 text-xs text-slate-300">
              <p className="font-semibold text-white">Director & Academic Head:</p>
              <p>{settings.directorName}</p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">
                  Home & Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-white transition-colors">
                  About RJ TECH
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('courses')} className="hover:text-white transition-colors">
                  All Certified Courses
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admission')} className="hover:text-white transition-colors">
                  Online Admission Portal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('verify')} className="hover:text-white transition-colors">
                  Public Certificate Verification
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('notices')} className="hover:text-white transition-colors">
                  Notice Board & Exam Alerts
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Courses */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Popular Programs</h4>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-300 hover:text-white cursor-pointer" onClick={() => setActiveTab('courses')}>
                • ADCA (Advance Diploma - 12 Mo)
              </li>
              <li className="text-slate-300 hover:text-white cursor-pointer" onClick={() => setActiveTab('courses')}>
                • DCA (Diploma in Computer Applications)
              </li>
              <li className="text-slate-300 hover:text-white cursor-pointer" onClick={() => setActiveTab('courses')}>
                • Graphic Design (Photoshop / CorelDRAW)
              </li>
              <li className="text-slate-300 hover:text-white cursor-pointer" onClick={() => setActiveTab('courses')}>
                • Computer Typing (English & Bengali)
              </li>
              <li className="text-slate-300 hover:text-white cursor-pointer" onClick={() => setActiveTab('courses')}>
                • MS Office Specialist (Word / Excel / PPT)
              </li>
              <li className="text-slate-300 hover:text-white cursor-pointer" onClick={() => setActiveTab('courses')}>
                • CCA (Certificate in Computer Applications)
              </li>
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Visit Campus</h4>
            <div className="flex items-start gap-2 text-xs">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                {settings.addressLine1},<br />
                {settings.addressLine2},<br />
                {settings.state} - {settings.pinCode}, INDIA
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold text-white">Call / WhatsApp: 9635302734</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Mon - Sat: 8:00 AM - 7:30 PM</span>
            </div>

            <div className="pt-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                onClick={() => setActiveView('public_login_admin')}
              >
                Admin & Staff Portal Login
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <p>© 2026 RJ TECH - Computer Training & Digital Education Center. All rights reserved.</p>
          <p className="text-slate-500">
            Registered Education Provider • Tamluk, Purba Medinipur
          </p>
        </div>
      </div>
    </footer>
  );
};

export const PublicHomeView: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const { courses, setActiveView } = useApp();

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-[#F5F7FB] pt-12 lg:pt-20 pb-16 lg:pb-24 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-[#155EEF] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Admissions Open for 2026-2027 Session</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] font-heading">
                RJ TECH
                <span className="block text-xl sm:text-2xl lg:text-3xl font-semibold text-[#155EEF] mt-2 font-sans">
                  Computer Training & Digital Education Center
                </span>
              </h1>

              <p className="text-xl sm:text-2xl font-bold text-slate-800">
                Learn Computer Skills. <span className="text-[#0EA5E9]">Build Your Future.</span>
              </p>

              <p className="text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Empowering students, job seekers, and professionals with 100% practical lab-based training, accredited certificate diplomas, high-speed typing, and career digital competencies.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Button
                  size="lg"
                  variant="primary"
                  icon={GraduationCap}
                  onClick={() => setActiveTab('admission')}
                  className="shadow-md shadow-blue-500/25"
                >
                  Apply for Admission
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  icon={BookOpen}
                  onClick={() => setActiveTab('courses')}
                >
                  View Courses
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  icon={UserCheck}
                  onClick={() => setActiveView('public_login_student')}
                  className="text-slate-700 bg-white border border-slate-200"
                >
                  Student Login
                </Button>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-2xl font-bold text-slate-900 font-heading">100%</p>
                  <p className="text-xs text-slate-500 font-medium">Practical Lab Work</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 font-heading">1500+</p>
                  <p className="text-xs text-slate-500 font-medium">Certified Students</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 font-heading">ISO / Reg</p>
                  <p className="text-xs text-slate-500 font-medium">Recognized Diplomas</p>
                </div>
              </div>
            </div>

            {/* Right Card / Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-xl border border-slate-200/90 overflow-hidden">
                <div className="relative h-60 rounded-2xl overflow-hidden mb-5 bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
                    alt="Students in Computer Lab"
                    className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold uppercase">
                      Active Lab Session
                    </span>
                    <p className="text-sm font-bold mt-1">Hands-on Individual Systems & High-Speed WiFi</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-[#155EEF] flex items-center justify-center">
                        <Monitor className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">1 Student = 1 Computer</p>
                        <p className="text-[11px] text-slate-500">Unrestricted daily practice</p>
                      </div>
                    </div>
                    <Badge variant="success" size="sm">Guaranteed</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">QR-Verified Certificates</p>
                        <p className="text-[11px] text-slate-500">Govt job valid format</p>
                      </div>
                    </div>
                    <Badge variant="secondary" size="sm">Accredited</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Helpline: 9635302734</p>
                        <p className="text-[11px] text-slate-500">Tamluk, West Bengal</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">Open Now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#155EEF] text-xs font-semibold mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Job-Ready Curriculums</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Our Certified Computer Programs
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Affordable diploma and certificate courses designed for industry requirements.
            </p>
          </div>
          <Button variant="outline" size="sm" icon={ChevronRight} iconPosition="right" onClick={() => setActiveTab('courses')}>
            View All Courses ({courses.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 6).map((c) => (
            <Card key={c.id} className="p-6 hover:shadow-lg hover:border-blue-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge variant="secondary">{c.code}</Badge>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    {c.duration}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">{c.name}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">{c.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Total Fees</span>
                  <span className="text-lg font-extrabold text-blue-600">₹{c.totalFees.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setActiveTab('admission')}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Choose RJ TECH Section */}
      <section className="bg-white py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Why Join RJ TECH Computer Center?
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              We focus on practical competency, personal attention, and real career development.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#155EEF] flex items-center justify-center">
                <Monitor className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Quality Computer Education</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Structured step-by-step syllabus aligning with modern industry tools: MS Office, Tally Prime GST, Graphic Designing, and Internet technology.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Practical Lab Training</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No boring theoretical lectures. Dedicated 1:1 computer setup for every student in air-cooled labs with continuous hands-on typing and software drills.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Experienced Faculty Guidance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Learn under certified instructors who provide patient doubt-clearing sessions, live project corrections, and interview preparation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Affordable & Transparent Fees</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nominal course fees with flexible monthly installments, early-bird fee concessions, and zero hidden charges for rural and urban learners alike.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Certificate Based Courses</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Official certificates with QR code digital verification and registration numbers, valid for employment, PSC, SSC, and private sector requirements.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Digital Skills & AI Readiness</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Master digital payments, online government services (e-District, DigiLocker), modern AI search, email etiquette, and cloud office workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Admission Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <Badge variant="neutral" className="bg-white/20 text-white border-white/30">
              New Batches Starting Soon
            </Badge>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Ready to Upgrade Your Computer Skills?
            </h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              Complete your online registration in 4 easy steps or visit our center at Hurinan, Joybalarampur, Tamluk. Call us directly at <strong>9635302734</strong>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-blue-700 hover:bg-blue-50 border-white font-bold"
              onClick={() => setActiveTab('admission')}
            >
              Start Online Admission
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => setActiveTab('contact')}
            >
              Contact Center
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export const PublicAboutView: React.FC = () => {
  const { settings } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="primary">About Our Institute</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
          RJ TECH
        </h1>
        <p className="text-lg font-semibold text-blue-600">{settings.tagline}</p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Founded with a commitment to democratize digital literacy and practical IT training in Purba Medinipur, West Bengal.
        </p>
      </div>

      {/* Address & Contact Banner */}
      <Card className="p-6 sm:p-8 bg-blue-50/50 border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider block">Institute Location</span>
            <p className="font-bold text-slate-900">{settings.addressLine1}</p>
            <p className="text-slate-600">{settings.addressLine2}</p>
            <p className="text-slate-600">{settings.state} - {settings.pinCode}, INDIA</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider block">Direct Helpline</span>
            <p className="font-bold text-slate-900 text-lg text-emerald-700">{settings.phone}</p>
            <p className="text-xs text-slate-500">Available Mon-Sat (8:00 AM - 7:30 PM)</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider block">Academic Session</span>
            <p className="font-bold text-slate-900">{settings.currentSession}</p>
            <p className="text-xs text-slate-500">Batches running: Morning, Afternoon, Evening</p>
          </div>
        </div>
      </Card>

      {/* 6 Core Pillars from user specification */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 text-center font-heading">
          Our Educational Philosophy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">01</div>
            <h3 className="text-base font-bold text-slate-900">Quality Computer Education</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We design every curriculum from the fundamentals of computer logic up to practical application software, guaranteeing clear concept mastery for beginners.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">02</div>
            <h3 className="text-base font-bold text-slate-900">Practical Training</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real learning happens on the keyboard. Students spend 80%+ of course time working on actual machines, creating spreadsheets, posters, and code.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">03</div>
            <h3 className="text-base font-bold text-slate-900">Experienced Guidance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our faculty members possess deep pedagogical and technical training, ensuring personalized guidance for each student regardless of educational background.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">04</div>
            <h3 className="text-base font-bold text-slate-900">Affordable Courses</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We maintain minimal, student-friendly fee structures with zero admission exploitation, ensuring computer education is within reach of every family.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">05</div>
            <h3 className="text-base font-bold text-slate-900">Certificate Based Courses</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Each student who passes the formal theoretical and practical exams is awarded a registered certificate with a permanent verification number.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">06</div>
            <h3 className="text-base font-bold text-slate-900">Digital Skills</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Beyond basic typing, we teach modern digital citizenship, online government portals, secure banking, and essential AI productivity tools.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const PublicCoursesView: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const { courses } = useApp();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <Badge variant="primary">Course Catalog</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
          Certified Computer Training Programs
        </h1>
        <p className="text-sm text-slate-500">
          Choose from short-term certificate courses to advance 1-year diplomas at RJ TECH.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="p-6 flex flex-col justify-between hover:shadow-lg transition-all border-slate-200">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                  {course.code}
                </span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  {course.duration}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">{course.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{course.description}</p>

              {course.syllabus && course.syllabus.length > 0 && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 mb-4">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Key Topics:
                  </span>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {course.syllabus.slice(0, 3).map((topic, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        <span className="truncate">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Complete Course Fee</span>
                  <span className="text-xl font-extrabold text-blue-600">₹{course.totalFees.toLocaleString('en-IN')}</span>
                </div>
                <span className="text-xs text-slate-500">
                  Admission: ₹{course.admissionFee}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCourse(course)}
                >
                  View Details
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveTab('admission')}
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <Modal
          isOpen={Boolean(selectedCourse)}
          onClose={() => setSelectedCourse(null)}
          title={selectedCourse.name}
          description={`Course Code: ${selectedCourse.code} • Duration: ${selectedCourse.duration}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">About This Course</h4>
              <p className="text-xs text-slate-700 leading-relaxed">{selectedCourse.description}</p>
            </div>

            {selectedCourse.eligibility && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Eligibility</h4>
                <p className="text-xs text-slate-800 font-semibold">{selectedCourse.eligibility}</p>
              </div>
            )}

            {selectedCourse.syllabus && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Complete Syllabus Modules</h4>
                <ul className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedCourse.syllabus.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fees Structure Breakdown</h4>
              <div className="grid grid-cols-2 gap-2 text-xs bg-blue-50/60 p-3 rounded-xl border border-blue-200">
                <div>
                  <span className="text-slate-500 block">Total Course Fee:</span>
                  <span className="font-bold text-blue-700 text-sm">₹{selectedCourse.totalFees}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Admission Fee:</span>
                  <span className="font-semibold text-slate-800">₹{selectedCourse.admissionFee}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Monthly Fee:</span>
                  <span className="font-semibold text-slate-800">₹{selectedCourse.monthlyFee} / mo</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Exam & Certificate:</span>
                  <span className="font-semibold text-slate-800">₹{selectedCourse.examFee + selectedCourse.certificateFee}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedCourse(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedCourse(null);
                  setActiveTab('admission');
                }}
              >
                Proceed to Online Admission
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export const PublicOnlineAdmissionView: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const { courses, batches, addStudent, settings, setActiveView } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Academic
    courseId: courses[0]?.id || '',
    batchId: batches[0]?.id || '',
    session: settings.currentSession,
    discount: 0,
    paidFee: 1000,
    referredBy: '',

    // Step 2: Personal
    name: '',
    dob: '2005-01-15',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    fatherName: '',
    motherName: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    village: 'Hurinan',
    postOffice: 'Joybalarampur',
    district: 'Purba Medinipur',
    state: 'West Bengal',
    pinCode: '721137',

    // Step 3: Documents
    photo: '',
    signature: '',
    idDocument: '',

    // Step 4: Account
    username: '',
    password: '',
  });

  const [submittedStudent, setSubmittedStudent] = useState<any>(null);

  const selectedCourse = courses.find((c) => c.id === formData.courseId) || courses[0];
  const selectedBatch = batches.find((b) => b.id === formData.batchId) || batches[0];
  const finalFee = Math.max(0, (selectedCourse?.totalFees || 0) - Number(formData.discount || 0));

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!formData.name.trim() || !formData.phone.trim()) {
        alert('Please fill in Student Name and Phone Number.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      // Auto-suggest username if empty
      if (!formData.username) {
        const cleanName = formData.name.toLowerCase().replace(/\s+/g, '.');
        setFormData((prev) => ({ ...prev, username: cleanName }));
      }
      setStep(4);
    } else if (step === 4) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const newStudent = addStudent({
      name: formData.name,
      dob: formData.dob,
      gender: formData.gender,
      photo:
        formData.photo ||
        (formData.gender === 'Female'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'),
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      phone: formData.phone,
      whatsapp: formData.whatsapp || formData.phone,
      email: formData.email,
      address: `${formData.village}, ${formData.postOffice}, ${formData.district}, ${formData.state} - ${formData.pinCode}`,
      village: formData.village,
      postOffice: formData.postOffice,
      district: formData.district,
      state: formData.state,
      pinCode: formData.pinCode,
      courseId: selectedCourse.id,
      courseName: selectedCourse.name,
      batchId: selectedBatch.id,
      batchName: selectedBatch.name,
      session: formData.session,
      admissionDate: new Date().toISOString().split('T')[0],
      totalFee: selectedCourse.totalFees,
      discount: Number(formData.discount),
      finalFee,
      paidFee: Number(formData.paidFee),
      dueFee: Math.max(0, finalFee - Number(formData.paidFee)),
      status: 'Active',
      feesStatus: Number(formData.paidFee) >= finalFee ? 'Paid' : 'Partial',
      username: formData.username || formData.name.toLowerCase().replace(/\s+/g, '.'),
      referredBy: formData.referredBy,
    });

    setSubmittedStudent(newStudent);
  };

  if (submittedStudent) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Card className="p-8 space-y-6 border-emerald-200 bg-white shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Online Admission Confirmed
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-heading">
              Welcome to RJ TECH!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Your enrollment has been successfully recorded in the RJ TECH academic system.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2.5 font-medium">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Student Name:</span>
              <span className="font-bold text-slate-900">{submittedStudent.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Registration Number:</span>
              <span className="font-mono font-bold text-blue-700">{submittedStudent.registrationNo}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Student ID:</span>
              <span className="font-mono font-bold text-slate-900">{submittedStudent.studentId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Roll Number:</span>
              <span className="font-bold text-slate-900">{submittedStudent.rollNo}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Course & Batch:</span>
              <span className="text-slate-800">{submittedStudent.courseName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Student Username:</span>
              <span className="font-mono text-emerald-700 font-bold">{submittedStudent.username}</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 text-blue-800 rounded-xl text-xs text-left">
            💡 <strong>Next Step:</strong> You can now use your Student ID (<strong>{submittedStudent.studentId}</strong>) or Username to log in to the Student Portal, view your ID card, attendance calendar, and class schedule.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => setActiveView('public_login_student')}
            >
              Login to Student Portal
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => setActiveTab('home')}
            >
              Return to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <Badge variant="primary">Online Registration</Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
          RJ TECH Online Admission Form
        </h1>
        <p className="text-xs text-slate-500">
          Session {settings.currentSession} • Quick & Paperless Admission Flow
        </p>
      </div>

      {/* 4-Step Progress Indicator */}
      <div className="flex items-center justify-between relative max-w-xl mx-auto">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
        {[
          { num: 1, label: 'Academic' },
          { num: 2, label: 'Personal' },
          { num: 3, label: 'Documents' },
          { num: 4, label: 'Account' },
        ].map((s) => (
          <div key={s.num} className="relative z-10 flex flex-col items-center gap-1">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= s.num ? 'bg-[#155EEF] text-white shadow' : 'bg-white border-2 border-slate-300 text-slate-500'
              }`}
            >
              {s.num}
            </div>
            <span
              className={`text-[11px] font-semibold ${
                step >= s.num ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <Card className="p-6 sm:p-8">
        {/* Step 1: Academic Details */}
        {step === 1 && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 1: Academic Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Course *</label>
                <select
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code} - {c.duration})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Batch *</label>
                <select
                  value={formData.batchId}
                  onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.room})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Session</label>
                <input
                  type="text"
                  readOnly
                  value={formData.session}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Referral Code (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. RJTECH230360"
                  value={formData.referredBy}
                  onChange={(e) => setFormData({ ...formData, referredBy: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase font-mono"
                />
              </div>
            </div>

            {/* Fee summary banner */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Course Fee:</span>
                <span className="font-bold text-slate-800 text-sm">₹{selectedCourse?.totalFees}</span>
              </div>
              <div>
                <label className="text-slate-500 block">Discount (₹):</label>
                <input
                  type="number"
                  min="0"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                  className="w-24 px-2 py-0.5 rounded border border-slate-300 text-xs font-bold"
                />
              </div>
              <div>
                <span className="text-slate-500 block">Final Fee:</span>
                <span className="font-extrabold text-blue-700 text-sm">₹{finalFee}</span>
              </div>
              <div>
                <label className="text-slate-500 block">Initial Paid (₹):</label>
                <input
                  type="number"
                  min="0"
                  value={formData.paidFee}
                  onChange={(e) => setFormData({ ...formData, paidFee: Number(e.target.value) })}
                  className="w-24 px-2 py-0.5 rounded border border-slate-300 text-xs font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Personal Details */}
        {step === 2 && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 2: Personal Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Soumen Roy"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Father's Name</label>
                <input
                  type="text"
                  placeholder="Father's Name"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mother's Name</label>
                <input
                  type="text"
                  placeholder="Mother's Name"
                  value={formData.motherName}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="10 digit mobile number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  placeholder="WhatsApp number"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Village / Street</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Post Office</label>
                <input
                  type="text"
                  value={formData.postOffice}
                  onChange={(e) => setFormData({ ...formData, postOffice: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">PIN Code</label>
                <input
                  type="text"
                  value={formData.pinCode}
                  onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {step === 3 && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 3: Documents Upload
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl text-center hover:bg-slate-50 cursor-pointer">
                <p className="font-bold text-slate-800">Passport Size Student Photo</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Click or drag & drop (JPG, PNG max 2MB)</p>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-xs">
                  <span>Photo Ready / Default Avatar Enabled</span>
                </div>
              </div>

              <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl text-center hover:bg-slate-50 cursor-pointer">
                <p className="font-bold text-slate-800">Student Signature Specimen</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Required for Student ID and Certificate</p>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-1">✓ Digital Specimen Prepared</span>
              </div>

              <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl text-center hover:bg-slate-50 cursor-pointer">
                <p className="font-bold text-slate-800">Government ID Document (Aadhaar / Voter / School ID)</p>
                <p className="text-slate-500 text-[11px] mt-0.5">For age and address verification</p>
                <span className="text-[11px] text-blue-600 font-semibold block mt-1">✓ Verified during lab onboarding</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Account Details */}
        {step === 4 && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Step 4: Student Portal Account
            </h3>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
              Your login credentials allow you to access the student portal, check QR attendance, download class notes, and view exam results.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Username *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. rahul.das"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Create Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
          {step > 1 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep((s) => (s - 1) as any)}
            >
              Previous
            </Button>
          ) : (
            <div />
          )}

          <Button variant="primary" size="md" onClick={handleNext}>
            {step === 4 ? 'Confirm & Complete Admission' : 'Continue'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export const PublicCertificateVerificationView: React.FC = () => {
  const { verifyCertificate, setActiveCertificate, settings } = useApp();
  const [certInput, setCertInput] = useState('RJTECH-2026-00001');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certInput.trim()) return;

    const cert = verifyCertificate(certInput);
    setSearchResult(cert);
    setSearched(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <Badge variant="primary">Online Verification</Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
          Certificate Verification Portal
        </h1>
        <p className="text-xs text-slate-500">
          Verify authentic certificates issued by RJ TECH Computer Training & Digital Education Center.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Enter Certificate Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. RJTECH-2026-00001"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm font-mono uppercase tracking-wider rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <Button type="submit" variant="primary" icon={Search}>
                Verify
              </Button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Try demo certificate numbers: <strong>RJTECH-2026-00001</strong> or <strong>RJTECH-2026-00002</strong>
            </p>
          </div>
        </form>

        {/* Verification Result */}
        {searched && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            {searchResult ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-emerald-900">
                      ✓ Certificate Verified Genuine
                    </h3>
                    <p className="text-xs text-emerald-700">
                      This certificate is registered in the official records of RJ TECH.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2 font-medium">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Student Name:</span>
                    <span className="font-bold text-slate-900">{searchResult.studentName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Course:</span>
                    <span className="font-bold text-blue-700">{searchResult.courseName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Duration:</span>
                    <span className="text-slate-800">{searchResult.courseDuration}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Registration Number:</span>
                    <span className="font-mono text-slate-800">{searchResult.registrationNo}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Certificate Number:</span>
                    <span className="font-mono font-bold text-amber-900">{searchResult.certificateNo}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Issue Date:</span>
                    <span className="text-slate-800">{searchResult.issueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Issuing Authority:</span>
                    <span className="font-semibold text-slate-900">RJ TECH ({settings.tagline})</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveCertificate(searchResult)}
                  >
                    View & Print Full Certificate
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                  ✕
                </div>
                <h3 className="text-base font-bold text-rose-900">Certificate Not Found</h3>
                <p className="text-xs text-rose-700 max-w-sm mx-auto">
                  No registered certificate was found with number "{certInput}". Please verify the certificate number or contact RJ TECH center.
                </p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export const PublicNoticesView: React.FC = () => {
  const { notices } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <Badge variant="primary">Official Updates</Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
          RJ TECH Notice Board
        </h1>
        <p className="text-xs text-slate-500">
          Important announcements, exam schedules, and holiday circulars.
        </p>
      </div>

      <div className="space-y-4">
        {notices.map((notice) => (
          <Card key={notice.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    notice.type === 'Exam Notice'
                      ? 'warning'
                      : notice.type === 'Holiday'
                      ? 'danger'
                      : 'primary'
                  }
                >
                  {notice.type}
                </Badge>
                {notice.isImportant && (
                  <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    Important
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                {notice.date}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2">{notice.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{notice.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const PublicGalleryView: React.FC = () => {
  const galleryItems = [
    {
      title: 'State-of-the-Art Computer Lab 1',
      desc: 'Individual high-configuration workstations with Windows 11 & Gigabit LAN.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Graphic Design Studio Workstation',
      desc: 'Color-calibrated displays for Adobe Photoshop & CorelDRAW practicals.',
      image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Touch Typing Practice Lab',
      desc: 'High-speed Bengali & English typing drills and weekly speed competitions.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Faculty Mentorship & Guidance',
      desc: 'Individual attention, project reviews, and exam preparation sessions.',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Certificate Award Convocation',
      desc: 'Celebrating successful completion of ADCA & DCA courses with proud students.',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Digital Skills & Internet Lab',
      desc: 'Practical training on online portals, digital payments, and modern AI tools.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <Badge variant="primary">Campus Life</Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
          RJ TECH Campus & Labs Gallery
        </h1>
        <p className="text-xs text-slate-500">
          A glimpse into our high-tech labs, student workstations, and hands-on learning environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item, idx) => (
          <Card key={idx} className="overflow-hidden group hover:shadow-lg transition-all">
            <div className="h-52 overflow-hidden relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const PublicContactView: React.FC = () => {
  const { settings, openWhatsAppDialog } = useApp();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleWhatsAppContact = () => {
    openWhatsAppDialog(
      settings.phone,
      `Hello RJ TECH,\n\nI am interested in taking admission in your computer training center. Please share course details and batch timings.\n\nThank you!`,
      'Contact RJ TECH on WhatsApp'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <Badge variant="primary">Get in Touch</Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
          Contact RJ TECH
        </h1>
        <p className="text-xs text-slate-500">
          We welcome you to visit our center or connect directly for admission guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact info cards */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Institute Headquarters</h3>

            <div className="flex items-start gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Address:</p>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  {settings.addressLine1},<br />
                  {settings.addressLine2},<br />
                  {settings.state} - {settings.pinCode}, INDIA
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Direct Phone & WhatsApp:</p>
                <p className="text-slate-900 font-bold text-sm mt-0.5">{settings.phone}</p>
                <Button
                  variant="success"
                  size="sm"
                  className="mt-2 text-xs"
                  onClick={handleWhatsAppContact}
                >
                  Message on WhatsApp
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Lab & Office Hours:</p>
                <p className="text-slate-600 mt-0.5">Monday to Saturday: 8:00 AM - 7:30 PM</p>
                <p className="text-slate-500 text-[11px]">Sunday: Special batches only</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Message Received!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Thank you for reaching out to RJ TECH. Our academic coordinator will call you back shortly at your provided mobile number.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="text-base font-bold text-slate-900 mb-2">Send Admission Inquiry</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Joydeep Pal"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9800000000"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Interested Course</label>
                  <select className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option>ADCA (Advance Diploma - 12 Months)</option>
                    <option>DCA (Diploma - 6 Months)</option>
                    <option>Graphic Design</option>
                    <option>Computer Typing (English & Bengali)</option>
                    <option>MS Office Specialist</option>
                    <option>CCA (Certificate Course)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Message or Query</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your educational qualification, preferred batch timing (morning/evening)..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <Button type="submit" variant="primary" size="md">
                  Submit Admission Inquiry
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export const PublicWebsite: React.FC<{ initialTab?: string }> = ({ initialTab = 'home' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FB] text-slate-800 font-sans">
      <PublicNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">
        {activeTab === 'home' && <PublicHomeView setActiveTab={setActiveTab} />}
        {activeTab === 'about' && <PublicAboutView />}
        {activeTab === 'courses' && <PublicCoursesView setActiveTab={setActiveTab} />}
        {activeTab === 'admission' && <PublicOnlineAdmissionView setActiveTab={setActiveTab} />}
        {activeTab === 'verify' && <PublicCertificateVerificationView />}
        {activeTab === 'notices' && <PublicNoticesView />}
        {activeTab === 'gallery' && <PublicGalleryView />}
        {activeTab === 'contact' && <PublicContactView />}
      </main>
      <PublicFooter setActiveTab={setActiveTab} />
    </div>
  );
};

