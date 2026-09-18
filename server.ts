import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

const MODEL_NAME = 'gemini-3.8-flash';

// --- API Health ---
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// --- Helper for Gemini prompt execution with error handling ---
async function askGemini(prompt: string, systemInstruction?: string): Promise<string> {
  const ai = getGemini();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please check .env or Settings.');
  }

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: systemInstruction ? { systemInstruction } : undefined,
  });

  return response.text || '';
}

// --- 1. PERSONALIZED LEARNING PATH GENERATOR ---
app.post('/api/learning-path/generate', async (req, res) => {
  try {
    const { name, skillLevel, goal, interests, hoursPerWeek } = req.body;

    const studentName = name || 'Student';
    const levelStr = skillLevel || 'beginner';
    const goalStr = goal || 'web_dev';
    const interestsStr = (interests || []).join(', ') || 'coding apps, building games, problem solving';
    const hours = hoursPerWeek || 4;

    const systemPrompt = `You are Professor Byte, an inspiring, patient, and pedagogical AI Computer Science Teacher.
Your mission is to design custom, engaging, free learning paths for students that turn abstract concepts into fun, hands-on micro-lessons and real-world projects.
Always format output strictly as valid JSON matching the exact schema requested, without markdown wrap if possible (or inside clean json codeblock).`;

    const prompt = `Generate a personalized coding learning path for:
Student Name: ${studentName}
Skill Level: ${levelStr} (options: beginner [no prior code], some_blocks [Scratch/block-based], intermediate [knows basic Python/JS], advanced)
Core Goal: ${goalStr} (options: web_dev, game_dev, ai_data, automation_python, cs_fundamentals)
Interests/Passions: ${interestsStr}
Available Time: ${hours} hours per week

Create 3 distinct progressive milestones (Milestone 1, Milestone 2, Milestone 3).
Each milestone MUST contain:
- "id": string (e.g. "m1")
- "phase": number (1, 2, 3)
- "title": string (catchy milestone title)
- "description": string (what the student will achieve)
- "lessons": array of 2 to 3 lessons, where each lesson has:
    - "id": unique string (e.g. "l1-1")
    - "title": lesson title
    - "estimatedMinutes": number (e.g. 20-35)
    - "summary": 2 sentences explaining the lesson
    - "keyConcepts": array of 2 to 4 key terms
    - "sampleCode": short beginner-friendly code snippet illustrating the concept
    - "practicePrompt": brief mini-challenge prompt
- "project": 1 practical project for the milestone with:
    - "id": unique string (e.g. "p1")
    - "title": project title
    - "difficulty": "Beginner" | "Intermediate" | "Advanced"
    - "description": 2-3 sentences describing the project
    - "technologies": array of tech (e.g. ["JavaScript", "HTML", "Canvas"])
    - "starterCode": starter template code snippet
    - "learningOutcomes": array of 3 bullet points

Return a JSON object with this exact structure:
{
  "id": "custom-path-${Date.now()}",
  "title": "...",
  "overview": "...",
  "targetGoal": "${goalStr}",
  "estimatedTotalHours": ${hours * 4},
  "milestones": [ ... ],
  "aiNotes": "Personalized welcoming message and motivational study tip from Professor Byte"
}`;

    const ai = getGemini();
    if (!ai) {
      // Fallback if no API key yet
      return res.json({
        fallback: true,
        message: 'No API key detected. Using default curriculum.',
        path: null
      });
    }

    const raw = await askGemini(prompt, systemPrompt);
    const cleaned = raw.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(cleaned);
    res.json({ success: true, path: parsed });
  } catch (err: any) {
    console.error('Error generating learning path:', err);
    res.status(500).json({ error: err.message || 'Failed to generate path' });
  }
});

// --- Dynamic Path Adjustment ---
app.post('/api/learning-path/adjust', async (req, res) => {
  try {
    const { currentPath, feedback, completedMilestoneIds } = req.body;
    
    const prompt = `You are Professor Byte, the AI Coding Tutor.
A student wants to adjust their existing learning path:
Current Path Title: "${currentPath?.title || 'Coding Path'}"
Student's Adjustment Feedback: "${feedback}"
Completed Milestones: ${(completedMilestoneIds || []).join(', ') || 'None yet'}

Current Path Milestones Summary:
${JSON.stringify(currentPath?.milestones?.map((m: any) => ({ phase: m.phase, title: m.title, lessons: m.lessons?.map((l: any) => l.title) })))}

Please recalibrate the learning path to adapt to their request (e.g., provide gentler pacing, pivot to a different focus, or add more challenges).
Return a JSON object with:
{
  "adjustedPath": { ...full adjusted learning path with updated milestones, lessons, projects... },
  "explanation": "Professor Byte's cheerful explanation of how and why the path was customized for them"
}`;

    const raw = await askGemini(prompt);
    const cleaned = raw.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(cleaned);
    res.json({ success: true, ...parsed });
  } catch (err: any) {
    console.error('Error adjusting learning path:', err);
    res.status(500).json({ error: err.message || 'Failed to adjust path' });
  }
});

// --- 2. AI PROJECT ASSISTANT (Breakdown & Debugging) ---
app.post('/api/project-assistant/breakdown', async (req, res) => {
  try {
    const { projectIdea, skillLevel, preferredTech } = req.body;

    const systemPrompt = `You are the Lead Student Project Architect & AI Coding Tutor.
When a student has a project dream, you break it down into approachable, exciting, non-intimidating building blocks.
Explain the 'Why' behind every tech choice.
Format response strictly as valid JSON.`;

    const prompt = `The student wants to build this project:
"${projectIdea}"
Student Level: ${skillLevel || 'beginner'}
Preferred Tech (if any): ${preferredTech || 'standard beginner web or python'}

Break down this project into actionable tasks and provide ready-to-use boilerplate.
Return a JSON object with this exact shape:
{
  "projectName": "Catchy Project Title",
  "summary": "2-3 sentences summarizing the vision and what makes it fun to code",
  "recommendedTech": [
    { "name": "e.g. JavaScript (ES6)", "category": "language", "reason": "why this is great for this project" },
    { "name": "e.g. HTML5 Canvas", "category": "tool", "reason": "allows smooth 2D graphics" }
  ],
  "architectureOverview": "High-level description of how the parts connect (UI, State, Logic)",
  "tasks": [
    {
      "id": "t1",
      "title": "e.g. Set up HTML container and canvas layout",
      "description": "Clear step instructions for what to create",
      "phase": "Phase 1: Setup & UI",
      "suggestedTech": "HTML/CSS",
      "starterSnippet": "// Small helpful starter snippet",
      "done": false
    },
    ... (at least 4 to 6 bite-sized progressive tasks across Phase 1, Phase 2: Core Logic, Phase 3: Interactions, Phase 4: Polish)
  ],
  "boilerplate": [
    {
      "filename": "index.html",
      "language": "html",
      "code": "<!DOCTYPE html>...",
      "explanation": "What this file does"
    },
    {
      "filename": "app.js",
      "language": "javascript",
      "code": "// Clean starter javascript code with helpful comments",
      "explanation": "Core logic starter"
    }
  ],
  "potentialPitfalls": [
    "Common beginner mistake 1 and how to avoid it",
    "Common mistake 2"
  ]
}`;

    const raw = await askGemini(prompt, systemPrompt);
    const cleaned = raw.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(cleaned);
    res.json({ success: true, breakdown: parsed });
  } catch (err: any) {
    console.error('Error in project breakdown:', err);
    res.status(500).json({ error: err.message || 'Failed to breakdown project' });
  }
});

app.post('/api/project-assistant/debug', async (req, res) => {
  try {
    const { code, errorMessage, expectedBehavior, language } = req.body;

    const systemPrompt = `You are Professor Byte, an expert pedagogical debugger and supportive AI coding teacher.
Students often get frustrated with bugs. You do not just fix the code silently; you:
1. Validate their effort and reduce frustration.
2. Explain the bug conceptually with a memorable real-life analogy (e.g., 'Off-by-one errors are like fence posts...').
3. Pinpoint the exact line or block.
4. Provide the clean, fixed code with comments highlighting the fix.
5. Offer a 'Pro-Tip' or diagnostic habit so they become an independent coder.
Format strictly as JSON.`;

    const prompt = `Please debug this student code:
Language: ${language || 'javascript'}
Error Message / Symptom: ${errorMessage || 'Not working as intended'}
What the student wanted to happen: ${expectedBehavior || 'Run successfully'}

Student's Code:
\`\`\`${language || 'javascript'}
${code}
\`\`\`

Return JSON in this format:
{
  "diagnosis": "Short 1-line clear statement of what went wrong",
  "analogyExplanation": "Student-friendly explanation using a fun analogy or visual concept",
  "bugLocation": "Line or construct where the issue occurred",
  "fixedCode": "Full corrected code snippet",
  "changesMade": [
    "Changed X to Y because...",
    "Added Z..."
  ],
  "proTip": "A golden rule or habit for debugging this in the future"
}`;

    const raw = await askGemini(prompt, systemPrompt);
    const cleaned = raw.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(cleaned);
    res.json({ success: true, debugResult: parsed });
  } catch (err: any) {
    console.error('Error in debug helper:', err);
    res.status(500).json({ error: err.message || 'Failed to debug code' });
  }
});

// --- 3. INTERACTIVE CHALLENGES AI ASSISTANT ---
app.post('/api/challenge/hint', async (req, res) => {
  try {
    const { challengeTitle, challengeDescription, currentCode, hintNumber } = req.body;

    const systemPrompt = `You are Professor Byte, an AI Coding Tutor using the Socratic Method.
Do NOT reveal the full answer directly.
Give a progressive hint that nudges the student towards the solution based on their current code.
Be encouraging, brief, and educational.`;

    const prompt = `Challenge: "${challengeTitle}"
Description: ${challengeDescription}
Student's Current Attempt:
\`\`\`javascript
${currentCode}
\`\`\`
Hint Level: #${hintNumber || 1} (1 is gentle direction, 2 is specific syntax guidance, 3 is near-solution pseudo-code).

Provide:
1. A warm, Socratic hint (2-3 sentences).
2. A tiny 1-line code clue if needed.`;

    const reply = await askGemini(prompt, systemPrompt);
    res.json({ success: true, hint: reply });
  } catch (err: any) {
    console.error('Error generating hint:', err);
    res.status(500).json({ error: err.message || 'Failed to generate hint' });
  }
});

app.post('/api/challenge/explain', async (req, res) => {
  try {
    const { challengeTitle, challengeDescription, solutionCode, studentCode } = req.body;

    const systemPrompt = `You are Professor Byte, an expert coding educator.
Explain the concept, logic, and solution cleanly for a student.
Format response in clear sections:
1. Core Concept in Plain English
2. Step-by-Step Logic Breakdown
3. Annotated Solution Walkthrough
4. Common Pitfalls & Why They Happen`;

    const prompt = `Challenge: "${challengeTitle}"
Description: ${challengeDescription}
Reference Solution:
\`\`\`javascript
${solutionCode}
\`\`\`
Student's Attempt:
\`\`\`javascript
${studentCode || '// None submitted yet'}
\`\`\`

Give a comprehensive, welcoming, student-friendly explanation of how and why this solution works.`;

    const explanation = await askGemini(prompt, systemPrompt);
    res.json({ success: true, explanation });
  } catch (err: any) {
    console.error('Error in challenge explanation:', err);
    res.status(500).json({ error: err.message || 'Failed to explain challenge' });
  }
});

app.post('/api/challenge/review', async (req, res) => {
  try {
    const { challengeTitle, studentCode, passedAllTests } = req.body;

    const systemPrompt = `You are Professor Byte, an encouraging AI code reviewer for students.
Review their submitted code for readability, clean style, best practices, and celebrate their success!
Return JSON:
{
  "rating": "Mastery" | "Great Job" | "Good Effort",
  "praise": "Specific positive feedback on what they did well",
  "styleTips": ["Tip 1", "Tip 2"],
  "xpBonus": number (between 10 and 50)
}`;

    const prompt = `Student submitted code for "${challengeTitle}":
Tests Passed: ${passedAllTests ? 'YES (All passed!)' : 'Partial/Failed'}
Code:
\`\`\`javascript
${studentCode}
\`\`\`
Review this code pedagogically for a student.`;

    const raw = await askGemini(prompt, systemPrompt);
    const cleaned = raw.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(cleaned);
    res.json({ success: true, review: parsed });
  } catch (err: any) {
    console.error('Error reviewing code:', err);
    res.status(500).json({ error: err.message || 'Failed to review code' });
  }
});

// --- 4. GENERAL AI TUTOR CHAT ---
app.post('/api/teacher/chat', async (req, res) => {
  try {
    const { message, context, history } = req.body;

    const systemPrompt = `You are Professor Byte, a world-class AI Coding Teacher dedicated to free, accessible, and high-impact education for students.
Your personality is:
- Extremely warm, positive, enthusiastic about coding, and never condescending.
- Uses vivid real-world analogies (e.g., variables = labeled boxes; loops = running laps on a track; functions = recipe blenders; conditionals = fork in the road).
- When sharing code snippets, keep them short, well-commented, and runnable.
- If a student feels overwhelmed, remind them that every great engineer started by learning to print 'Hello World!'.`;

    const formattedHistory = (history || [])
      .map((h: any) => `${h.role === 'user' ? 'Student' : 'Professor Byte'}: ${h.content}`)
      .join('\n');

    const prompt = `Current Learning Context: ${context || 'General Coding Education'}
Previous Conversation:
${formattedHistory}

Student says:
"${message}"

Respond as Professor Byte directly to the student.`;

    const reply = await askGemini(prompt, systemPrompt);
    res.json({ success: true, reply });
  } catch (err: any) {
    console.error('Error in teacher chat:', err);
    res.status(500).json({ error: err.message || 'Failed to chat with teacher' });
  }
});

// --- Vite Middleware for Development / Static in Production ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI CodeAcademy server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
