import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Layers, 
  Code, 
  FolderGit2, 
  Clock, 
  SlidersHorizontal, 
  RefreshCw, 
  BookOpen, 
  AlertCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { LearningPath, Milestone, LessonItem, StudentProfile, SkillLevel, LearningGoal } from '../types';
import { STARTER_LEARNING_PATHS } from '../data/curricula';

interface LearningPathViewProps {
  currentPath: LearningPath;
  onUpdatePath: (path: LearningPath) => void;
  profile: StudentProfile;
  onUpdateProfile: (profile: Partial<StudentProfile>) => void;
  onOpenProjectIdea: (idea: string) => void;
  onOpenChallenge: (challengeCategory?: string) => void;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({
  currentPath,
  onUpdatePath,
  profile,
  onUpdateProfile,
  onOpenProjectIdea,
  onOpenChallenge
}) => {
  // Modal states
  const [showGenerator, setShowGenerator] = useState<boolean>(false);
  const [showAdjustModal, setShowAdjustModal] = useState<boolean>(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonItem | null>(null);

  // Generator form states
  const [studentName, setStudentName] = useState<string>(profile.name || 'Alex');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(profile.skillLevel || 'beginner');
  const [learningGoal, setLearningGoal] = useState<LearningGoal>(profile.goal || 'web_dev');
  const [interestInput, setInterestInput] = useState<string>('building interactive web games and AI assistants');
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(profile.hoursPerWeek || 4);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Dynamic adjustment states
  const [adjustFeedback, setAdjustFeedback] = useState<string>('');
  const [isAdjusting, setIsAdjusting] = useState<boolean>(false);
  const [adjustError, setAdjustError] = useState<string | null>(null);

  // Handle Generating Path with AI
  const handleGeneratePath = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const res = await fetch('/api/learning-path/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: studentName,
          skillLevel,
          goal: learningGoal,
          interests: interestInput.split(',').map(s => s.trim()).filter(Boolean),
          hoursPerWeek
        })
      });

      const data = await res.json();
      if (data.path) {
        onUpdatePath(data.path);
        onUpdateProfile({
          name: studentName,
          skillLevel,
          goal: learningGoal,
          hoursPerWeek
        });
        setShowGenerator(false);
      } else if (data.fallback) {
        // Fallback to high quality pre-built curated path
        const fallbackPath = STARTER_LEARNING_PATHS[learningGoal] || STARTER_LEARNING_PATHS.web_dev;
        onUpdatePath(fallbackPath);
        onUpdateProfile({
          name: studentName,
          skillLevel,
          goal: learningGoal,
          hoursPerWeek
        });
        setShowGenerator(false);
      } else {
        throw new Error(data.error || 'Could not generate path');
      }
    } catch (err: any) {
      console.warn('AI generation error, using curated track:', err);
      const fallbackPath = STARTER_LEARNING_PATHS[learningGoal] || STARTER_LEARNING_PATHS.web_dev;
      onUpdatePath(fallbackPath);
      setShowGenerator(false);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Dynamic Path Adjustment
  const handleAdjustPath = async () => {
    if (!adjustFeedback.trim()) return;
    setIsAdjusting(true);
    setAdjustError(null);

    try {
      const res = await fetch('/api/learning-path/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPath,
          feedback: adjustFeedback,
          completedMilestoneIds: currentPath.milestones
            .filter(m => m.lessons.every(l => profile.completedLessonIds.includes(l.id)))
            .map(m => m.id)
        })
      });

      const data = await res.json();
      if (data.adjustedPath) {
        onUpdatePath(data.adjustedPath);
        setShowAdjustModal(false);
        setAdjustFeedback('');
      } else {
        throw new Error(data.error || 'Failed to adjust');
      }
    } catch (err: any) {
      setAdjustError('Could not connect to AI service. Using current path.');
    } finally {
      setIsAdjusting(false);
    }
  };

  // Toggle lesson completion
  const toggleLesson = (lessonId: string) => {
    const isCompleted = profile.completedLessonIds.includes(lessonId);
    let newCompleted: string[];
    let xpGain = 0;

    if (isCompleted) {
      newCompleted = profile.completedLessonIds.filter(id => id !== lessonId);
    } else {
      newCompleted = [...profile.completedLessonIds, lessonId];
      xpGain = 30; // 30 XP per completed lesson
    }

    onUpdateProfile({
      completedLessonIds: newCompleted,
      xp: Math.max(0, profile.xp + xpGain)
    });
  };

  // Calculate overall progress percentage
  const allLessons = currentPath.milestones.flatMap(m => m.lessons);
  const completedCount = allLessons.filter(l => profile.completedLessonIds.includes(l.id)).length;
  const progressPercent = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Hero / Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI-Personalized Learning Roadmap</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentPath.title}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {currentPath.overview}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              id="adjust-path-btn"
              onClick={() => setShowAdjustModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-sky-400" />
              <span>Adjust with AI</span>
            </button>

            <button
              id="recalibrate-path-btn"
              onClick={() => setShowGenerator(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white text-sm font-semibold shadow-md shadow-indigo-600/30 transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>New AI Path Generator</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Stat Pills */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
              <span>Overall Roadmap Progress</span>
              <span className="text-indigo-300 font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-300">
            <Clock className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Est. {currentPath.estimatedTotalHours || 20} hrs total at {profile.hoursPerWeek || 4} hrs/wk</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{completedCount} of {allLessons.length} micro-lessons mastered</span>
          </div>
        </div>
      </div>

      {/* Professor Byte's Personal Note */}
      {currentPath.aiNotes && (
        <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent border border-amber-500/20 rounded-2xl p-4 sm:p-5 flex items-start gap-4 text-slate-200">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-300">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              Professor Byte's Advice for {profile.name || 'You'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentPath.aiNotes}
            </p>
          </div>
        </div>
      )}

      {/* Milestones Road Map */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Curriculum Milestones</span>
          </h2>
          <span className="text-xs text-slate-400">Click any lesson to view code examples and practice</span>
        </div>

        <div className="space-y-6">
          {currentPath.milestones.map((milestone, mIdx) => {
            const milestoneLessonsDone = milestone.lessons.filter(l => profile.completedLessonIds.includes(l.id)).length;
            const isMilestoneComplete = milestoneLessonsDone === milestone.lessons.length;

            return (
              <div 
                key={milestone.id || mIdx}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 transition shadow-lg"
              >
                {/* Milestone Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold border ${
                      isMilestoneComplete 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                        : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                    }`}>
                      {milestone.phase || mIdx + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-white">{milestone.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-400">{milestone.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {milestoneLessonsDone} / {milestone.lessons.length} Completed
                    </span>
                  </div>
                </div>

                {/* Lessons in this milestone */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {milestone.lessons.map(lesson => {
                    const isDone = profile.completedLessonIds.includes(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        className={`rounded-xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                          isDone 
                            ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50' 
                            : 'bg-slate-800/60 border-slate-700/70 hover:border-indigo-500/50 hover:bg-slate-800'
                        }`}
                        onClick={() => setSelectedLesson(lesson)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className={`text-sm font-semibold leading-snug ${isDone ? 'text-emerald-300 line-through' : 'text-slate-100'}`}>
                              {lesson.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLesson(lesson.id);
                              }}
                              className="shrink-0 text-slate-400 hover:text-emerald-400 transition"
                              title={isDone ? 'Mark uncompleted' : 'Mark completed (+30 XP)'}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                              )}
                            </button>
                          </div>

                          <p className="text-xs text-slate-300 line-clamp-2">
                            {lesson.summary}
                          </p>

                          {/* Key concepts chips */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {lesson.keyConcepts.map((kc, i) => (
                              <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700/60">
                                {kc}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-700/40 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {lesson.estimatedMinutes} min
                          </span>
                          <span className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-0.5">
                            Open Lesson <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Capstone Project for Milestone */}
                {milestone.project && (
                  <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 to-slate-800/80 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="w-4 h-4 text-sky-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Capstone Project</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                          {milestone.project.difficulty}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{milestone.project.title}</h4>
                      <p className="text-xs text-slate-300">{milestone.project.description}</p>
                      
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {milestone.project.technologies.map((t, idx) => (
                          <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-900/80 text-sky-300 border border-sky-500/20">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenProjectIdea(milestone.project.title + ': ' + milestone.project.description)}
                      className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition"
                    >
                      <span>Build in Project Assistant</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lesson Details Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Micro-Lesson • {selectedLesson.estimatedMinutes} min
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">{selectedLesson.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedLesson(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-200">
              <div>
                <h4 className="font-semibold text-sky-400 mb-1">Lesson Summary</h4>
                <p className="text-slate-300 leading-relaxed">{selectedLesson.summary}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sky-400 mb-1">Key Concepts You Learn</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedLesson.keyConcepts.map((c, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200">
                      ✓ {c}
                    </span>
                  ))}
                </div>
              </div>

              {selectedLesson.sampleCode && (
                <div>
                  <h4 className="font-semibold text-sky-400 mb-1 flex items-center gap-1.5">
                    <Code className="w-4 h-4" /> Code Example
                  </h4>
                  <pre className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto">
                    {selectedLesson.sampleCode}
                  </pre>
                </div>
              )}

              {selectedLesson.practicePrompt && (
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-200">
                  <h4 className="font-bold text-indigo-300 flex items-center gap-1.5 mb-1">
                    <Lightbulb className="w-4 h-4" /> Try It Mini-Challenge
                  </h4>
                  <p className="text-xs sm:text-sm">{selectedLesson.practicePrompt}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  toggleLesson(selectedLesson.id);
                  setSelectedLesson(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  profile.completedLessonIds.includes(selectedLesson.id)
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {profile.completedLessonIds.includes(selectedLesson.id) ? 'Mark Incomplete' : 'Complete & Earn +30 XP'}
              </button>

              <button
                onClick={() => {
                  setSelectedLesson(null);
                  onOpenChallenge();
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition flex items-center gap-1.5"
              >
                <span>Practice in Challenge Sandbox</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Adjustment Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <SlidersHorizontal className="w-5 h-5 text-sky-400" />
                <span>Adjust Learning Path with AI</span>
              </div>
              <button onClick={() => setShowAdjustModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300">
              Tell Professor Byte how you're feeling! The AI Teacher will dynamically recalibrate your milestones and lessons.
            </p>

            {adjustError && (
              <div className="p-3 bg-red-950/50 border border-red-500/50 rounded-lg text-xs text-red-200">
                {adjustError}
              </div>
            )}

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300">Your Feedback or Request:</label>
              <textarea
                value={adjustFeedback}
                onChange={(e) => setAdjustFeedback(e.target.value)}
                rows={3}
                placeholder="e.g., 'The loops were a bit fast, please give me more beginner-friendly repetition' or 'I want to build a Discord bot next' or 'Make it more advanced'..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />

              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  'More beginner practice',
                  'Focus more on games',
                  'Faster pace',
                  'More real-world projects'
                ].map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAdjustFeedback(sug)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowAdjustModal(false)}
                className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjustPath}
                disabled={isAdjusting || !adjustFeedback.trim()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-2 shadow-md shadow-indigo-600/30"
              >
                {isAdjusting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Recalibrating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Recalibrate Path</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Personalized Path Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                  <Compass className="w-4 h-4" /> Personalized AI Assessment
                </div>
                <h3 className="text-xl font-bold text-white mt-1">Design Your Custom AI Curriculum</h3>
              </div>
              <button onClick={() => setShowGenerator(false)} className="text-slate-400 hover:text-white text-lg">✕</button>
            </div>

            <form onSubmit={handleGeneratePath} className="space-y-4 text-sm">
              {/* Student Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">What should Professor Byte call you?</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Your Name (e.g. Alex, Sam)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
                  required
                />
              </div>

              {/* Prior Coding Experience */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">What is your current coding experience?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'beginner', label: '🌱 Complete Beginner', desc: 'Never written a line of code' },
                    { id: 'some_blocks', label: '🧩 Visual / Blocks', desc: 'Used Scratch or Lego Mindstorms' },
                    { id: 'intermediate', label: '⚡ Some Text Code', desc: 'Familiar with basic Python or JS' },
                    { id: 'advanced', label: '🚀 Intermediate+', desc: 'Want advanced AI & full projects' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSkillLevel(opt.id as SkillLevel)}
                      className={`text-left p-3 rounded-xl border transition ${
                        skillLevel === opt.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-semibold text-xs">{opt.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Learning Goal */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">What is your primary learning goal?</label>
                <div className="space-y-2">
                  {[
                    { id: 'web_dev', title: '🌐 Web & AI Apps', desc: 'Build interactive websites, web tools, and connect to AI' },
                    { id: 'game_dev', title: '🎮 2D Game Development', desc: 'Create arcade games, physics, and canvas animations' },
                    { id: 'ai_data', title: '🤖 AI & Data Science', desc: 'Learn prompt engineering, machine learning basics, and NLP' },
                    { id: 'automation_python', title: '🐍 Python & Automation', desc: 'Write practical scripts to automate tasks and solve puzzles' },
                    { id: 'cs_fundamentals', title: '🧠 CS Fundamentals & Prep', desc: 'Master algorithms, data structures, and prepare for school' }
                  ].map(g => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setLearningGoal(g.id as LearningGoal)}
                      className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between transition ${
                        learningGoal === g.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-xs">{g.title}</div>
                        <div className="text-[11px] text-slate-400">{g.desc}</div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${learningGoal === g.id ? 'text-indigo-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests & Passions */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Specific topics, games, or hobbies you love:
                </label>
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  placeholder="e.g. Minecraft, space exploration, music, making bots..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              {/* Hours per week */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Study Commitment:</span>
                  <span className="text-indigo-300">{hoursPerWeek} hours / week</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowGenerator(false)}
                  className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating Path with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Personalized Path</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
