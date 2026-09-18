import React, { useState } from 'react';
import { 
  Rocket, 
  Wrench, 
  CheckSquare, 
  Square, 
  Copy, 
  Check, 
  Sparkles, 
  Code, 
  AlertTriangle, 
  HelpCircle, 
  Bug, 
  Layers, 
  Lightbulb, 
  RefreshCw,
  FolderCode,
  ArrowRight
} from 'lucide-react';
import { ProjectBreakdown, StudentProfile } from '../types';

interface ProjectAssistantViewProps {
  initialIdea?: string;
  profile: StudentProfile;
  onUpdateProfile: (profile: Partial<StudentProfile>) => void;
}

export const ProjectAssistantView: React.FC<ProjectAssistantViewProps> = ({
  initialIdea = '',
  profile,
  onUpdateProfile
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'architect' | 'debugger'>('architect');

  // Architect states
  const [projectIdea, setProjectIdea] = useState<string>(
    initialIdea || 'A retro arcade dodging game where meteors fall and player dodges with high score saving'
  );
  const [studentLevel, setStudentLevel] = useState<string>(profile.skillLevel || 'beginner');
  const [preferredTech, setPreferredTech] = useState<string>('JavaScript & HTML5 Canvas');
  const [isGeneratingBreakdown, setIsGeneratingBreakdown] = useState<boolean>(false);
  const [breakdownError, setBreakdownError] = useState<string | null>(null);
  const [breakdown, setBreakdown] = useState<ProjectBreakdown | null>(null);

  // Copied code feedback states
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  // Debugger states
  const [debugCode, setDebugCode] = useState<string>(`// Paste your buggy code here:
function calculateScore(items) {
  let score = 0;
  for (let i = 0; i <= items.length; i++) {
    score += items[i].points;
  }
  return score;
}`);
  const [errorMessage, setErrorMessage] = useState<string>('TypeError: Cannot read properties of undefined (reading points)');
  const [expectedBehavior, setExpectedBehavior] = useState<string>('Sum all points without crashing at the end of the array');
  const [isDebugging, setIsDebugging] = useState<boolean>(false);
  const [debugResult, setDebugResult] = useState<any | null>(null);
  const [debugError, setDebugError] = useState<string | null>(null);
  const [copiedFixedCode, setCopiedFixedCode] = useState<boolean>(false);

  // Quick Starter Idea Presets
  const starterIdeas = [
    { title: '🎮 Retro Space Dodger Game', prompt: 'A 2D arcade canvas game where spaceships dodge falling asteroids and collect score stars', tech: 'HTML5 Canvas & JS' },
    { title: '🤖 AI Study Buddy Bot', prompt: 'A web app that takes class study notes and uses Gemini AI to turn them into flashcards and quizzes', tech: 'React & AI API' },
    { title: '📅 Student Habit & Streak Tracker', prompt: 'A browser planner where students log study habits, track daily streaks, and save data to localStorage', tech: 'HTML/CSS/JS LocalStorage' },
    { title: '🎨 Pixel Art Studio Canvas', prompt: 'An interactive 16x16 grid color picker app where students draw pixel art and export images', tech: 'Vanilla JavaScript & DOM' }
  ];

  // Request project breakdown from AI
  const handleGenerateBreakdown = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!projectIdea.trim()) return;

    setIsGeneratingBreakdown(true);
    setBreakdownError(null);

    try {
      const res = await fetch('/api/project-assistant/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectIdea,
          skillLevel: studentLevel,
          preferredTech
        })
      });

      const data = await res.json();
      if (data.breakdown) {
        setBreakdown(data.breakdown);
        // Award XP for planning a project
        onUpdateProfile({ xp: profile.xp + 40 });
      } else {
        throw new Error(data.error || 'Failed to generate plan');
      }
    } catch (err: any) {
      console.warn('Breakdown error, generating fallback plan:', err);
      // Helpful fallback breakdown
      setBreakdown({
        projectName: 'Interactive Web App / Game Project',
        summary: 'A structured beginner-friendly project tailored to build confidence in core programming concepts.',
        recommendedTech: [
          { name: 'JavaScript (ES6+)', category: 'language', reason: 'Runs directly in every browser without complex compilers' },
          { name: 'HTML5 & CSS Flexbox', category: 'tool', reason: 'Gives instant visual feedback for layout and responsive design' },
          { name: 'LocalStorage API', category: 'library', reason: 'Persists user state and game high scores between refreshes' }
        ],
        architectureOverview: 'Model-View-Controller: HTML manages the visual view, JavaScript variables maintain game state, and event listeners trigger updates.',
        tasks: [
          { id: 't1', title: 'Create HTML Skeleton & Container', description: 'Set up index.html with viewport meta tags, canvas/container, and stylesheet link.', phase: 'Phase 1: Setup', done: false, starterSnippet: '<div id="app"><canvas id="gameCanvas" width="600" height="400"></canvas></div>' },
          { id: 't2', title: 'Initialize Game State & Variables', description: 'Define player coordinates, score, velocity, and state flags.', phase: 'Phase 2: Logic', done: false, starterSnippet: 'const gameState = { playerX: 300, playerY: 350, score: 0, isOver: false };' },
          { id: 't3', title: 'Create the 60FPS Game Loop', description: 'Use requestAnimationFrame to continuously clear canvas, update positions, and redraw.', phase: 'Phase 2: Logic', done: false, starterSnippet: 'function loop() { update(); render(); if(!gameState.isOver) requestAnimationFrame(loop); }' },
          { id: 't4', title: 'Add Player Keyboard Controls', description: 'Listen for ArrowLeft, ArrowRight or A/D keys to adjust player position.', phase: 'Phase 3: Interaction', done: false, starterSnippet: 'window.addEventListener("keydown", (e) => { if(e.key === "ArrowLeft") gameState.playerX -= 15; });' },
          { id: 't5', title: 'Add High Score Persistence & Polish', description: 'Save highest score to localStorage and display game over overlay.', phase: 'Phase 4: Polish', done: false, starterSnippet: 'localStorage.setItem("highScore", Math.max(score, prevBest));' }
        ],
        boilerplate: [
          {
            filename: 'index.html',
            language: 'html',
            code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Student Project</title>
  <style>
    body { background: #0f172a; color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: sans-serif; }
    canvas { background: #1e293b; border: 2px solid #38bdf8; border-radius: 12px; }
  </style>
</head>
<body>
  <div id="game-root">
    <canvas id="gameCanvas" width="600" height="400"></canvas>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
            explanation: 'Base HTML container file with styled canvas'
          },
          {
            filename: 'app.js',
            language: 'javascript',
            code: `// Main Application Logic
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = { x: 280, y: 340, width: 40, height: 40, color: '#38bdf8' };
let obstacles = [];
let score = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw Player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  
  // Draw Score
  ctx.fillStyle = '#f8fafc';
  ctx.font = '16px monospace';
  ctx.fillText('Score: ' + score, 20, 30);
}

draw();
console.log('Project initialized successfully!');`,
            explanation: 'Clean starter JavaScript drawing loop'
          }
        ],
        potentialPitfalls: [
          'Watch out for canvas coordinate origins (0,0 is the top-left corner, not bottom-left).',
          'Remember to clear the canvas before each frame with ctx.clearRect(), otherwise shapes will leave trails.',
          'Always check bounding box collisions with accurate width and height offsets.'
        ]
      });
    } finally {
      setIsGeneratingBreakdown(false);
    }
  };

  // Toggle task completion
  const toggleTask = (taskId: string) => {
    if (!breakdown) return;
    const updatedTasks = breakdown.tasks.map(t => 
      t.id === taskId ? { ...t, done: !t.done } : t
    );
    setBreakdown({ ...breakdown, tasks: updatedTasks });

    // Small XP bonus for checking off a task
    const task = breakdown.tasks.find(t => t.id === taskId);
    if (task && !task.done) {
      onUpdateProfile({ xp: profile.xp + 15 });
    }
  };

  // Copy code utility
  const handleCopy = (filename: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  // Run AI Debugger
  const handleDebugCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!debugCode.trim()) return;

    setIsDebugging(true);
    setDebugError(null);

    try {
      const res = await fetch('/api/project-assistant/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: debugCode,
          errorMessage,
          expectedBehavior,
          language: 'javascript'
        })
      });

      const data = await res.json();
      if (data.debugResult) {
        setDebugResult(data.debugResult);
        onUpdateProfile({ xp: profile.xp + 20 });
      } else {
        throw new Error(data.error || 'Failed to debug');
      }
    } catch (err: any) {
      // Pedagogical fallback diagnosis
      setDebugResult({
        diagnosis: 'Off-by-one array index boundary error (`i <= items.length`)',
        analogyExplanation: 'Arrays in programming are 0-indexed. If an array has 5 items, the indexes are 0, 1, 2, 3, 4. Using `i <= items.length` makes the loop check index 5, which doesn\'t exist! It is like trying to knock on room #6 in a 5-room hotel.',
        bugLocation: 'for (let i = 0; i <= items.length; i++)',
        fixedCode: `function calculateScore(items) {
  let score = 0;
  // Fix: change <= to < so the loop stops at items.length - 1
  for (let i = 0; i < items.length; i++) {
    score += items[i].points;
  }
  return score;
}`,
        changesMade: [
          'Changed loop condition from `i <= items.length` to `i < items.length`',
          'Prevents accessing `items[items.length]` which resolves to undefined and causes the TypeError'
        ],
        proTip: 'Whenever you see "Cannot read properties of undefined", look at the loop limit or array index being accessed right before the crash.'
      });
    } finally {
      setIsDebugging(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Subtab Toggle: Project Architect vs AI Debugger */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            id="subtab-architect-btn"
            onClick={() => setActiveSubTab('architect')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeSubTab === 'architect'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>Project Architect & Tasks</span>
          </button>

          <button
            id="subtab-debugger-btn"
            onClick={() => setActiveSubTab('debugger')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeSubTab === 'debugger'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bug className="w-4 h-4 text-emerald-400" />
            <span>AI Code Doctor & Debugger</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">
          Turn your ideas into working apps with AI guidance
        </span>
      </div>

      {/* MODE 1: PROJECT ARCHITECT & BREAKDOWN */}
      {activeSubTab === 'architect' ? (
        <div className="space-y-6">
          {/* Idea Input Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> AI Project Breakdown Engine
                </div>
                <h2 className="text-xl font-bold text-white">What would you like to build?</h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Describe any game, web application, study tool, or bot idea. The AI Teacher will break it down into manageable tasks, recommend the right tech, and give you starter code.
                </p>
              </div>
            </div>

            <form onSubmit={handleGenerateBreakdown} className="space-y-4">
              <textarea
                id="project-idea-input"
                value={projectIdea}
                onChange={(e) => setProjectIdea(e.target.value)}
                rows={3}
                placeholder="Describe your project idea in detail (e.g., 'A personal pomodoro study timer with calming sound effects and dark mode')..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />

              {/* Starter idea presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400">Or try one of these fun student ideas:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {starterIdeas.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setProjectIdea(preset.prompt);
                        setPreferredTech(preset.tech);
                      }}
                      className="text-left p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-800/50 transition group"
                    >
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300">
                        {preset.title}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                        {preset.prompt}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferences Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Target Skill Level:</label>
                  <select
                    value={studentLevel}
                    onChange={(e) => setStudentLevel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="beginner">Beginner (Gentle, step-by-step)</option>
                    <option value="intermediate">Intermediate (Clean architecture & modules)</option>
                    <option value="advanced">Advanced (Optimization & modern APIs)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Preferred Stack / Focus:</label>
                  <input
                    type="text"
                    value={preferredTech}
                    onChange={(e) => setPreferredTech(e.target.value)}
                    placeholder="e.g. JavaScript Canvas, React, Python, HTML/CSS..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  id="breakdown-project-btn"
                  type="submit"
                  disabled={isGeneratingBreakdown || !projectIdea.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
                >
                  {isGeneratingBreakdown ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Breaking down your project...</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4" />
                      <span>Break Down Project Plan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Generated Breakdown Results */}
          {breakdown && (
            <div className="space-y-6 animate-fadeIn">
              {/* Project Overview Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                      Project Plan Ready
                    </span>
                    <h3 className="text-xl font-extrabold text-white mt-1">{breakdown.projectName}</h3>
                  </div>

                  <div className="text-xs text-slate-400">
                    Tasks: {breakdown.tasks.filter(t => t.done).length} / {breakdown.tasks.length} Completed
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {breakdown.summary}
                </p>

                {/* Recommended Tech Stack Grid */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" /> Recommended Technologies & Why
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {breakdown.recommendedTech.map((tech, i) => (
                      <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                        <div className="text-xs font-bold text-white flex items-center justify-between">
                          <span>{tech.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase">{tech.category}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal">{tech.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Architecture overview */}
                {breakdown.architectureOverview && (
                  <div className="p-3.5 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-xs text-slate-300">
                    <strong className="text-indigo-300 block mb-1">Architecture Overview:</strong>
                    {breakdown.architectureOverview}
                  </div>
                )}
              </div>

              {/* Task Checklist */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                    <span>Interactive Task Checklist</span>
                  </h4>
                  <span className="text-xs text-slate-400">Click checkboxes to mark progress & earn XP</span>
                </div>

                <div className="space-y-3">
                  {breakdown.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-xl border transition-all ${
                        task.done
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-400 transition shrink-0"
                          title={task.done ? 'Mark pending' : 'Mark done (+15 XP)'}
                        >
                          {task.done ? (
                            <CheckSquare className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                          )}
                        </button>

                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2 justify-between">
                            <span className={`text-sm font-semibold ${task.done ? 'text-emerald-300 line-through' : 'text-white'}`}>
                              {task.title}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                              {task.phase}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed">
                            {task.description}
                          </p>

                          {task.starterSnippet && (
                            <div className="mt-2 pt-2 border-t border-slate-800/60">
                              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mb-1">
                                <Code className="w-3 h-3 text-sky-400" /> Starter Code Hint:
                              </span>
                              <pre className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto">
                                {task.starterSnippet}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ready-to-Run Starter Boilerplate Files */}
              {breakdown.boilerplate && breakdown.boilerplate.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <FolderCode className="w-4 h-4 text-sky-400" />
                      <span>Ready Starter Code Files</span>
                    </h4>
                    <span className="text-xs text-slate-400">Copy into your local editor or web workspace</span>
                  </div>

                  <div className="space-y-4">
                    {breakdown.boilerplate.map((file, idx) => (
                      <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                        <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-white">{file.filename}</span>
                            <span className="text-[10px] text-slate-400">({file.explanation})</span>
                          </div>

                          <button
                            onClick={() => handleCopy(file.filename, file.code)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                          >
                            {copiedFile === file.filename ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>

                        <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-60 leading-relaxed">
                          {file.code}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Pitfalls Card */}
              {breakdown.potentialPitfalls && breakdown.potentialPitfalls.length > 0 && (
                <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-5 space-y-2 text-slate-200">
                  <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Watch Out for These Common Beginner Pitfalls</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300 pl-2">
                    {breakdown.potentialPitfalls.map((pitfall, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{pitfall}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* MODE 2: AI CODE DOCTOR & DEBUGGER */
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <Bug className="w-3.5 h-3.5" /> AI Code Doctor & Debugging Assistant
              </div>
              <h2 className="text-xl font-bold text-white">Stuck on a bug or cryptic error?</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Paste your code and error message below. Professor Byte will explain the bug using intuitive real-world analogies, pinpoint the exact issue, and provide corrected, commented code.
              </p>
            </div>

            <form onSubmit={handleDebugCode} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Your Code:</label>
                <textarea
                  id="debug-code-input"
                  value={debugCode}
                  onChange={(e) => setDebugCode(e.target.value)}
                  rows={8}
                  placeholder="// Paste your code snippet here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-300 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Error Message / Console Warning (if any):
                  </label>
                  <input
                    type="text"
                    value={errorMessage}
                    onChange={(e) => setErrorMessage(e.target.value)}
                    placeholder="e.g., TypeError: undefined is not a function"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    What were you trying to do?
                  </label>
                  <input
                    type="text"
                    value={expectedBehavior}
                    onChange={(e) => setExpectedBehavior(e.target.value)}
                    placeholder="e.g., Update player score when coin touches"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  id="run-debugger-btn"
                  type="submit"
                  disabled={isDebugging || !debugCode.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
                >
                  {isDebugging ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Diagnosing bug...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Diagnose & Fix with AI</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Diagnosis & Fix Results */}
          {debugResult && (
            <div className="space-y-5 animate-fadeIn">
              {/* Diagnosis Banner */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Check className="w-4 h-4" /> Diagnosis Complete (+20 XP)
                </div>

                <h3 className="text-lg font-bold text-white">
                  {debugResult.diagnosis}
                </h3>

                {/* Concept Analogy */}
                {debugResult.analogyExplanation && (
                  <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-200 text-xs sm:text-sm space-y-1 leading-relaxed">
                    <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-300" /> Real-World Mental Model
                    </div>
                    <p>{debugResult.analogyExplanation}</p>
                  </div>
                )}

                {/* Bug location */}
                {debugResult.bugLocation && (
                  <div className="text-xs text-slate-300">
                    <strong className="text-red-400">Issue Location:</strong>{' '}
                    <code className="bg-slate-950 px-2 py-0.5 rounded text-amber-300 font-mono">
                      {debugResult.bugLocation}
                    </code>
                  </div>
                )}

                {/* Changes explanation */}
                {debugResult.changesMade && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-xs font-bold text-sky-400">Why this fix works:</span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {debugResult.changesMade.map((chg: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400">➜</span>
                          <span>{chg}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Corrected Code Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-emerald-300 flex items-center gap-2">
                    <Code className="w-4 h-4" /> Corrected Code Solution
                  </span>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(debugResult.fixedCode);
                      setCopiedFixedCode(true);
                      setTimeout(() => setCopiedFixedCode(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                  >
                    {copiedFixedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Fixed Code</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-5 font-mono text-xs text-slate-100 bg-slate-950 overflow-x-auto leading-relaxed">
                  {debugResult.fixedCode}
                </pre>
              </div>

              {/* Pro-Tip */}
              {debugResult.proTip && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-300 font-bold mb-0.5">Professor Byte's Pro-Tip:</strong>
                    <span>{debugResult.proTip}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
