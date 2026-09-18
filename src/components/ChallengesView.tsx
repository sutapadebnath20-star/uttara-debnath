import React, { useState } from 'react';
import { 
  Play, 
  Lightbulb, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Terminal, 
  Sparkles, 
  ChevronRight, 
  AlertCircle,
  HelpCircle,
  Check,
  Code2
} from 'lucide-react';
import { CodingChallenge, StudentProfile } from '../types';
import { CODING_CHALLENGES } from '../data/challenges';
import { executeChallengeCode, RunResult } from '../utils/codeRunner';

interface ChallengesViewProps {
  profile: StudentProfile;
  onUpdateProfile: (profile: Partial<StudentProfile>) => void;
  onAskTeacher: (context: string) => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({
  profile,
  onUpdateProfile,
  onAskTeacher
}) => {
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(CODING_CHALLENGES[0].id);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  
  // Active challenge state
  const currentChallenge = CODING_CHALLENGES.find(c => c.id === selectedChallengeId) || CODING_CHALLENGES[0];
  const [code, setCode] = useState<string>(currentChallenge.starterCode);
  const [activeTab, setActiveTab] = useState<'tests' | 'console'>('tests');

  // Execution result
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // AI Hint state
  const [hintIndex, setHintIndex] = useState<number>(0);
  const [currentAiHint, setCurrentAiHint] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState<boolean>(false);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);

  // AI Explanation state
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState<boolean>(false);
  const [showExplanationModal, setShowExplanationModal] = useState<boolean>(false);

  // AI Code Review state
  const [aiReview, setAiReview] = useState<any | null>(null);
  const [isLoadingReview, setIsLoadingReview] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);

  // Switch challenge handler
  const handleSelectChallenge = (challenge: CodingChallenge) => {
    setSelectedChallengeId(challenge.id);
    setCode(challenge.starterCode);
    setRunResult(null);
    setCurrentAiHint(null);
    setHintIndex(0);
    setAiExplanation(null);
    setAiReview(null);
  };

  // Run the code against test cases
  const handleRunCode = () => {
    setIsRunning(true);
    // Slight tick to show execution feedback
    setTimeout(() => {
      const result = executeChallengeCode(code, currentChallenge.functionName, currentChallenge.testCases);
      setRunResult(result);
      setIsRunning(false);

      if (result.allPassed) {
        // Award XP if not already completed
        if (!profile.completedChallengeIds.includes(currentChallenge.id)) {
          const newCompleted = [...profile.completedChallengeIds, currentChallenge.id];
          onUpdateProfile({
            completedChallengeIds: newCompleted,
            xp: profile.xp + currentChallenge.xpReward
          });
        }
      }
    }, 120);
  };

  // Reset starter code
  const handleResetCode = () => {
    setCode(currentChallenge.starterCode);
    setRunResult(null);
  };

  // Fetch Socratic AI Hint
  const handleGetAiHint = async () => {
    setShowHintModal(true);
    setIsLoadingHint(true);
    const nextHintNum = hintIndex + 1;

    try {
      const res = await fetch('/api/challenge/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeTitle: currentChallenge.title,
          challengeDescription: currentChallenge.description,
          currentCode: code,
          hintNumber: nextHintNum
        })
      });

      const data = await res.json();
      if (data.hint) {
        setCurrentAiHint(data.hint);
        setHintIndex(nextHintNum);
      } else {
        // Fallback to pre-packaged hint
        const fallbackHint = currentChallenge.hints[Math.min(hintIndex, currentChallenge.hints.length - 1)];
        setCurrentAiHint(fallbackHint);
        setHintIndex(nextHintNum);
      }
    } catch (err) {
      const fallbackHint = currentChallenge.hints[Math.min(hintIndex, currentChallenge.hints.length - 1)];
      setCurrentAiHint(fallbackHint);
    } finally {
      setIsLoadingHint(false);
    }
  };

  // Fetch AI Explanation & Solution
  const handleGetAiExplanation = async () => {
    setShowExplanationModal(true);
    if (aiExplanation) return; // already loaded

    setIsLoadingExplanation(true);
    try {
      const res = await fetch('/api/challenge/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeTitle: currentChallenge.title,
          challengeDescription: currentChallenge.description,
          solutionCode: currentChallenge.solutionCode,
          studentCode: code
        })
      });

      const data = await res.json();
      if (data.explanation) {
        setAiExplanation(data.explanation);
      } else {
        setAiExplanation(`**Concept Walkthrough**:\n\n${currentChallenge.conceptExplainer}\n\n**Solution Code:**\n\`\`\`javascript\n${currentChallenge.solutionCode}\n\`\`\``);
      }
    } catch {
      setAiExplanation(`**Concept Walkthrough**:\n\n${currentChallenge.conceptExplainer}\n\n**Solution Code:**\n\`\`\`javascript\n${currentChallenge.solutionCode}\n\`\`\``);
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  // Fetch AI Code Review
  const handleGetAiReview = async () => {
    setShowReviewModal(true);
    setIsLoadingReview(true);

    try {
      const res = await fetch('/api/challenge/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeTitle: currentChallenge.title,
          studentCode: code,
          passedAllTests: Boolean(runResult?.allPassed)
        })
      });

      const data = await res.json();
      if (data.review) {
        setAiReview(data.review);
        if (data.review.xpBonus) {
          onUpdateProfile({ xp: profile.xp + data.review.xpBonus });
        }
      } else {
        setAiReview({
          rating: 'Great Job',
          praise: 'Your solution clearly solves the challenge with structured syntax and clean logic!',
          styleTips: ['Keep variable names descriptive', 'Consider checking edge cases'],
          xpBonus: 25
        });
        onUpdateProfile({ xp: profile.xp + 25 });
      }
    } catch {
      setAiReview({
        rating: 'Great Job',
        praise: 'Your solution is well formatted and passes all required test cases!',
        styleTips: ['Clean code layout', 'Readable return statement'],
        xpBonus: 20
      });
      onUpdateProfile({ xp: profile.xp + 20 });
    } finally {
      setIsLoadingReview(false);
    }
  };

  // Categories
  const categories = ['All', 'Variables', 'Conditionals', 'Loops', 'Functions', 'Arrays', 'Algorithms'];
  const filteredChallenges = categoryFilter === 'All'
    ? CODING_CHALLENGES
    : CODING_CHALLENGES.filter(c => c.category === categoryFilter);

  const isChallengeDone = profile.completedChallengeIds.includes(currentChallenge.id);

  return (
    <div className="space-y-6">
      {/* Category filter tabs */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-medium shrink-0">
          {profile.completedChallengeIds.length} of {CODING_CHALLENGES.length} Completed
        </div>
      </div>

      {/* Main Split Layout: Left side Challenge selector & Instructions, Right side Code Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Challenge list drawer + Challenge description */}
        <div className="lg:col-span-5 space-y-5">
          {/* Challenge Selector Pills */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-2 max-h-48 overflow-y-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Select Challenge:
            </span>
            <div className="space-y-1">
              {filteredChallenges.map(ch => {
                const isDone = profile.completedChallengeIds.includes(ch.id);
                const isSelected = ch.id === currentChallenge.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleSelectChallenge(ch)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                        : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 border border-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                      )}
                      <span className="truncate">{ch.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-900 text-slate-400'
                      }`}>
                        {ch.difficulty}
                      </span>
                      <span className={`text-[10px] font-bold ${
                        isSelected ? 'text-amber-200' : 'text-amber-400'
                      }`}>
                        +{ch.xpReward} XP
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Challenge Description Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                    {currentChallenge.category}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                    {currentChallenge.difficulty}
                  </span>
                  {isChallengeDone && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Solved
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  {currentChallenge.title}
                </h2>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-slate-400 block">Reward</span>
                <span className="text-sm font-bold text-amber-300">+{currentChallenge.xpReward} XP</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 text-sm text-slate-300">
              <div className="whitespace-pre-line leading-relaxed">
                {currentChallenge.description}
              </div>

              {/* Concept explainer box */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                <span className="font-bold text-sky-400 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> Concept Note:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {currentChallenge.conceptExplainer}
                </p>
              </div>

              {/* Expected test cases preview */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-semibold text-slate-400">Example Inputs & Outputs:</span>
                <div className="space-y-1">
                  {currentChallenge.testCases.slice(0, 3).map((tc, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800/80 font-mono">
                      <span className="text-slate-400">{currentChallenge.functionName}{tc.inputDescription}</span>
                      <span className="text-emerald-400">➜ {tc.expectedOutput}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Teacher Assistance Action Bar */}
            <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2">
              <button
                id="get-hint-btn"
                onClick={handleGetAiHint}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
              >
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Get AI Hint</span>
              </button>

              <button
                id="explain-solution-btn"
                onClick={handleGetAiExplanation}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold transition"
              >
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>Explain Solution</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Test Results Sandbox */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-full">
            {/* Editor Top Bar */}
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-mono text-slate-300 font-medium">
                  solution.js ({currentChallenge.functionName})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetCode}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
                  title="Reset to starter code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  id="run-code-btn"
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                </button>
              </div>
            </div>

            {/* Code Input Area */}
            <div className="relative p-3 bg-slate-950 font-mono text-xs text-slate-100 flex-1 min-h-[280px]">
              <textarea
                id="code-editor-textarea"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full min-h-[260px] bg-transparent border-0 text-slate-100 font-mono text-xs leading-relaxed focus:outline-none resize-none"
                placeholder="// Write your code here..."
              />
            </div>

            {/* Test Results / Console Terminal Panel */}
            <div className="bg-slate-900 border-t border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('tests')}
                    className={`text-xs font-semibold pb-1 transition flex items-center gap-1.5 ${
                      activeTab === 'tests'
                        ? 'text-indigo-400 border-b-2 border-indigo-500'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>Test Cases</span>
                    {runResult && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        runResult.allPassed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {runResult.results.filter(r => r.passed).length}/{runResult.results.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('console')}
                    className={`text-xs font-semibold pb-1 transition flex items-center gap-1.5 ${
                      activeTab === 'console'
                        ? 'text-indigo-400 border-b-2 border-indigo-500'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Console Log</span>
                    {runResult && runResult.consoleLogs.length > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                        {runResult.consoleLogs.length}
                      </span>
                    )}
                  </button>
                </div>

                {runResult?.allPassed && (
                  <button
                    onClick={handleGetAiReview}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-indigo-600 text-white text-xs font-bold shadow-sm hover:opacity-90 transition animate-pulse"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>AI Code Review</span>
                  </button>
                )}
              </div>

              {/* Tab Content */}
              {activeTab === 'tests' ? (
                <div className="space-y-2">
                  {!runResult ? (
                    <div className="text-xs text-slate-500 py-4 text-center">
                      Click <strong className="text-emerald-400">"Run Code"</strong> above to test your function against all inputs.
                    </div>
                  ) : runResult.runtimeError ? (
                    <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl text-xs text-red-200 space-y-1">
                      <div className="font-bold flex items-center gap-1 text-red-300">
                        <AlertCircle className="w-4 h-4" /> Runtime Error:
                      </div>
                      <p className="font-mono text-[11px]">{runResult.runtimeError}</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {runResult.allPassed && (
                        <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center justify-between text-xs text-emerald-300 font-semibold mb-2">
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Outstanding! All test cases passed!
                          </span>
                          <span className="text-amber-300">+{currentChallenge.xpReward} XP Earned</span>
                        </div>
                      )}

                      {runResult.results.map((r, i) => (
                        <div 
                          key={i} 
                          className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between ${
                            r.passed 
                              ? 'bg-slate-950/50 border-slate-800 text-slate-300' 
                              : 'bg-red-950/30 border-red-500/30 text-red-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {r.passed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                            )}
                            <span>Input: {currentChallenge.functionName}{r.inputDescription}</span>
                          </div>

                          <div className="text-right text-[11px]">
                            {r.passed ? (
                              <span className="text-emerald-400">Passed: {r.actualOutput}</span>
                            ) : (
                              <span className="text-red-300">Expected {r.expectedOutput}, got {r.actualOutput}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Console Log Tab */
                <div className="bg-slate-950 rounded-xl p-3 font-mono text-xs text-slate-300 min-h-[90px] max-h-48 overflow-y-auto">
                  {!runResult || runResult.consoleLogs.length === 0 ? (
                    <span className="text-slate-600 italic">No console logs captured. Use console.log(...) in your code to inspect variables.</span>
                  ) : (
                    runResult.consoleLogs.map((log, idx) => (
                      <div key={idx} className="leading-relaxed text-sky-300 border-b border-slate-900/50 py-0.5">
                        ➜ {log}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Socratic Hint Modal */}
      {showHintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <span>AI Socratic Hint (Level {hintIndex})</span>
              </div>
              <button onClick={() => setShowHintModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {isLoadingHint ? (
              <div className="py-6 text-center space-y-2 text-sm text-slate-400">
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin mx-auto" />
                <p>Professor Byte is formulating a helpful hint for you...</p>
              </div>
            ) : (
              <div className="space-y-4 text-sm text-slate-200">
                <p className="leading-relaxed">{currentAiHint}</p>
                
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
                  💡 <em>Socratic teaching tip: Try reading your code line by line and track what each variable holds after every line!</em>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <button
                onClick={handleGetAiHint}
                disabled={isLoadingHint}
                className="text-xs text-amber-400 hover:text-amber-300 underline"
              >
                Need another hint?
              </button>
              <button
                onClick={() => setShowHintModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Got It, Back to Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Explanation & Solution Modal */}
      {showExplanationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-lg">
                <BookOpen className="w-5 h-5" />
                <span>Concept & Solution Walkthrough</span>
              </div>
              <button onClick={() => setShowExplanationModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {isLoadingExplanation ? (
              <div className="py-8 text-center space-y-2 text-sm text-slate-400">
                <Sparkles className="w-6 h-6 text-sky-400 animate-spin mx-auto" />
                <p>Professor Byte is preparing a complete step-by-step breakdown...</p>
              </div>
            ) : (
              <div className="space-y-4 text-sm text-slate-200">
                <div className="whitespace-pre-line leading-relaxed text-slate-300">
                  {aiExplanation}
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Reference Solution:
                    </span>
                    <button
                      onClick={() => {
                        setCode(currentChallenge.solutionCode);
                        setShowExplanationModal(false);
                      }}
                      className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
                    >
                      Copy into Editor
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-emerald-300 p-2 overflow-x-auto">
                    {currentChallenge.solutionCode}
                  </pre>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowExplanationModal(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md"
              >
                Close & Practice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Code Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Professor Byte's Code Review</span>
              </div>
              <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {isLoadingReview ? (
              <div className="py-6 text-center space-y-2 text-sm text-slate-400">
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin mx-auto" />
                <p>Analyzing your code craftsmanship and efficiency...</p>
              </div>
            ) : aiReview ? (
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-amber-200">
                  <span className="font-bold text-xs uppercase tracking-wide">Rating: {aiReview.rating}</span>
                  <span className="text-xs font-bold text-amber-400">+{aiReview.xpBonus || 25} Bonus XP!</span>
                </div>

                <p className="text-slate-200 leading-relaxed">{aiReview.praise}</p>

                {aiReview.styleTips && aiReview.styleTips.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-sky-400">Pro-Tips for Mastery:</span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {aiReview.styleTips.map((tip: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
              >
                Awesome! Next Challenge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
