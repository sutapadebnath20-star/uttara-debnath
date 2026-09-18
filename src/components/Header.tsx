import React from 'react';
import { Sparkles, Trophy, Flame, Code2, BookOpen, Rocket, MessageSquareCode, GraduationCap, CheckCircle2, CreditCard } from 'lucide-react';
import { StudentProfile } from '../types';

interface HeaderProps {
  currentTab: 'path' | 'challenges' | 'projects' | 'tutor';
  onSelectTab: (tab: 'path' | 'challenges' | 'projects' | 'tutor') => void;
  profile: StudentProfile;
  onOpenTeacher: () => void;
  onOpenEnrollment: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  profile,
  onOpenTeacher,
  onOpenEnrollment,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Platform identity */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent">
                  AI CodeAcademy
                </span>
                {profile.isEnrolled ? (
                  <button
                    onClick={onOpenEnrollment}
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 flex items-center gap-1 transition"
                    title="View ₹500 Tax Invoice & Enrollment Receipt"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>₹500 Enrolled</span>
                  </button>
                ) : (
                  <button
                    onClick={onOpenEnrollment}
                    className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 text-emerald-300 border border-emerald-500/40 hover:scale-105 transition"
                    title="All-Access Course Pass: ₹500"
                  >
                    Fee: ₹500
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Interactive Coding & AI Learning with Your Personal AI Teacher
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              id="tab-path-btn"
              onClick={() => onSelectTab('path')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'path'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">Learning Path</span>
            </button>

            <button
              id="tab-challenges-btn"
              onClick={() => onSelectTab('challenges')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'challenges'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span className="hidden md:inline">Challenges</span>
            </button>

            <button
              id="tab-projects-btn"
              onClick={() => onSelectTab('projects')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'projects'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Rocket className="w-4 h-4" />
              <span className="hidden md:inline">Project Assistant</span>
            </button>

            <button
              id="tab-tutor-btn"
              onClick={onOpenTeacher}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-all ml-1"
              title="Talk to Professor Byte"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">Ask AI Teacher</span>
            </button>
          </nav>

          {/* Student Gamification Stats & Enrollment Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {profile.isEnrolled ? (
              <button
                id="header-view-receipt-btn"
                onClick={onOpenEnrollment}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition"
                title="View ₹500 Tax Invoice & Receipt"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>₹500 Paid Receipt</span>
              </button>
            ) : (
              <button
                id="header-enroll-btn"
                onClick={onOpenEnrollment}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20"
                title="Enroll for ₹500 - All Access Pass"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Enroll (₹500)</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-amber-300">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{profile.xp} XP</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-orange-300">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>{profile.streakDays}d</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
