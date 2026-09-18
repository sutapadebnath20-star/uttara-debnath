/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LearningPathView } from './components/LearningPathView';
import { ChallengesView } from './components/ChallengesView';
import { ProjectAssistantView } from './components/ProjectAssistantView';
import { AiTeacherModal } from './components/AiTeacherModal';
import { PaymentEnrollmentModal } from './components/PaymentEnrollmentModal';
import { StudentProfile, LearningPath, PaymentReceipt } from './types';
import { STARTER_LEARNING_PATHS } from './data/curricula';
import { Sparkles, MessageSquareCode, Award, BookOpen, Code2, Rocket, Trophy, Flame } from 'lucide-react';

const STORAGE_KEY_PROFILE = 'ai_codeacademy_student_profile';
const STORAGE_KEY_PATH = 'ai_codeacademy_student_path';

export default function App() {
  // Current tab navigation
  const [currentTab, setCurrentTab] = useState<'path' | 'challenges' | 'projects' | 'tutor'>('path');

  // Student Profile state
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      name: 'Alex',
      skillLevel: 'beginner',
      goal: 'web_dev',
      interests: ['making web games', 'coding with AI'],
      hoursPerWeek: 4,
      xp: 120,
      streakDays: 3,
      completedLessonIds: ['l1-1'],
      completedChallengeIds: [],
      isEnrolled: false,
      enrollmentFeePaid: 0
    };
  });

  // Current Active Learning Path
  const [currentPath, setCurrentPath] = useState<LearningPath>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PATH);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return STARTER_LEARNING_PATHS.web_dev;
  });

  // Project assistant prefilled idea
  const [initialProjectIdea, setInitialProjectIdea] = useState<string>('');

  // AI Teacher modal state
  const [isTeacherOpen, setIsTeacherOpen] = useState<boolean>(false);
  const [teacherContext, setTeacherContext] = useState<string>('General AI Coding');

  // 500 RS Enrollment Payment Modal state
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState<boolean>(false);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PATH, JSON.stringify(currentPath));
    } catch (e) {
      console.error(e);
    }
  }, [currentPath]);

  // Update profile helper
  const handleUpdateProfile = (updated: Partial<StudentProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
  };

  // Payment completed handler for 500 RS charge
  const handlePaymentSuccess = (receipt: PaymentReceipt) => {
    setProfile(prev => ({
      ...prev,
      isEnrolled: true,
      enrollmentFeePaid: 500,
      paymentReceipt: receipt,
      xp: prev.xp + 100 // Bonus XP for formal course enrollment!
    }));
  };

  // Switch to Project Assistant with prefilled idea from Capstone Project
  const handleOpenProjectIdea = (idea: string) => {
    setInitialProjectIdea(idea);
    setCurrentTab('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch to Challenges from a lesson
  const handleOpenChallenge = (category?: string) => {
    setCurrentTab('challenges');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Teacher with custom context
  const handleOpenTeacherWithContext = (context: string) => {
    setTeacherContext(context);
    setIsTeacherOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'tutor') {
            setIsTeacherOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        profile={profile}
        onOpenTeacher={() => setIsTeacherOpen(true)}
        onOpenEnrollment={() => setIsEnrollmentOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'path' && (
          <LearningPathView
            currentPath={currentPath}
            onUpdatePath={setCurrentPath}
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onOpenProjectIdea={handleOpenProjectIdea}
            onOpenChallenge={handleOpenChallenge}
            onOpenEnrollment={() => setIsEnrollmentOpen(true)}
          />
        )}

        {currentTab === 'challenges' && (
          <ChallengesView
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onAskTeacher={handleOpenTeacherWithContext}
          />
        )}

        {currentTab === 'projects' && (
          <ProjectAssistantView
            initialIdea={initialProjectIdea}
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </main>

      {/* Floating AI Teacher Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="floating-ai-teacher-btn"
          onClick={() => setIsTeacherOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all group"
          title="Open Professor Byte AI Teacher"
        >
          <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
          <span>Ask Professor Byte</span>
        </button>
      </div>

      {/* Professor Byte Chat Dialog */}
      <AiTeacherModal
        isOpen={isTeacherOpen}
        onClose={() => setIsTeacherOpen(false)}
        profile={profile}
        activeContext={teacherContext}
      />

      {/* 500 RS Course Enrollment & Tax Invoice Modal */}
      <PaymentEnrollmentModal
        isOpen={isEnrollmentOpen}
        onClose={() => setIsEnrollmentOpen(false)}
        profile={profile}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 text-xs text-slate-400 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">AI CodeAcademy</span>
            <span>• Certified AI Coding Track (Course Fee: ₹500 INR)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini AI</span>
            <span>•</span>
            <span>Tax Invoicing & Socratic Learning</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
