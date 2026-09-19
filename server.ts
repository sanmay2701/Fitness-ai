import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Coach Chat endpoint
  app.post("/api/ai-coach", async (req, res) => {
    try {
      const { message, userProfile, recentActivities, readiness, conversationHistory } = req.body;
      const ai = getGeminiClient();

      const systemPrompt = `You are FitSync AI, an intelligent, empathetic, adaptive fitness coach.
Core Philosophy: Fitness improvement, sustainable habit consistency, participation, and progress visibility.
NEVER shame the user. If they are tired, overwhelmed, or busy, champion low-friction consistency (e.g. 2-minute reset, 5-minute walk).
CRITICAL SAFETY DIRECTIVES:
- Do NOT diagnose medical conditions, diseases, or injuries.
- Do NOT prescribe medical treatment or authoritatively evaluate medical symptoms.
- Encourage professional medical evaluation if the user reports acute, severe, or persistent physical pain/symptoms.
- Do NOT generate extreme, dangerous, or punishing workout prescriptions.
- Adapt exercise intensity when users report fatigue, muscle soreness, or poor sleep.

USER CONTEXT:
- Profile: ${JSON.stringify(userProfile || {})}
- Recent Workouts/Logs: ${JSON.stringify(recentActivities || [])}
- Current Readiness/Energy/Soreness: ${JSON.stringify(readiness || {})}

Respond in a warm, concise, actionable, and encouraging manner. Offer specific exercises, sets, reps, or mindset framing when relevant. Keep paragraphs digestible.`;

      if (!ai) {
        // Fallback intelligent response if API key is not provided yet
        const text = `I'm FitSync AI Coach! Based on your current profile (Goal: ${userProfile?.goals?.join(", ") || "General Fitness"}, Energy: ${readiness?.energy || "Moderate"}/5), here is my recommendation:

Focus on consistent, mindful movement today. If you have limited time, a 15-20 minute circuit (bodyweight squats, incline pushups, plank, and walking cool-down) will stimulate recovery and keep your momentum alive. Remember: doing something small today beats doing nothing!`;
        return res.json({ reply: text });
      }

      // Build contents
      const contents = [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }],
        },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `${systemPrompt}\n\nUser Question: ${message}`,
      });

      const reply = response.text || "Keep up the great momentum! Prioritize form, listen to your body, and take today one rep at a time.";
      res.json({ reply });
    } catch (error: any) {
      console.error("AI Coach error:", error);
      res.status(500).json({
        reply: "I'm experiencing a brief connection hiccup, but remember: consistency is your superpower! Take 5 deep breaths, do a quick mobility stretch, and stay hydrated today.",
      });
    }
  });

  // AI Personalized Plan Generator endpoint
  app.post("/api/generate-plan", async (req, res) => {
    try {
      const { userProfile, readiness, previousWeekVolume } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        // High quality deterministic plan fallback
        return res.json({
          planName: `${userProfile?.fitnessExperience || 'Balanced'} Adaptive Routine`,
          weeklyFocus: "Sustainable Consistency & Functional Mobility",
          sessions: [
            {
              day: "Day 1",
              title: "Full Body Mobility & Core Foundation",
              durationMinutes: userProfile?.availableWorkoutTime || 25,
              difficulty: "Moderate",
              focus: "Full Body",
              exercises: [
                { name: "Bodyweight Squats", sets: 3, reps: "12-15 reps", restSeconds: 45, tips: "Keep chest proud, drive through mid-foot" },
                { name: "Incline / Standard Push-ups", sets: 3, reps: "8-12 reps", restSeconds: 45, tips: "Elbows at 45 degrees, tight core" },
                { name: "Alternating Reverse Lunges", sets: 3, reps: "10 per leg", restSeconds: 45, tips: "Controlled descent, 90-degree knee bend" },
                { name: "Front Forearm Plank", sets: 3, reps: "30-45 sec hold", restSeconds: 60, tips: "Squeeze glutes, neutral cervical spine" },
                { name: "Cat-Cow & Child's Pose", sets: 2, reps: "60 sec each", restSeconds: 30, tips: "Deep diaphragmatic breathing" }
              ]
            },
            {
              day: "Day 2",
              title: "Aerobic Base & Active Recovery",
              durationMinutes: Math.min(30, userProfile?.availableWorkoutTime || 30),
              difficulty: "Light",
              focus: "Cardio & Recovery",
              exercises: [
                { name: "Brisk Walking / Easy Jog / Cycle", sets: 1, reps: "20 mins", restSeconds: 0, tips: "Conversational zone 2 pace" },
                { name: "World's Greatest Stretch", sets: 2, reps: "5 per side", restSeconds: 30, tips: "Open up thoracic spine and hip flexors" },
                { name: "Standing Hamstring Scoop", sets: 2, reps: "10 per side", restSeconds: 30, tips: "Dynamic flow, gentle stretch" }
              ]
            },
            {
              day: "Day 3",
              title: "Dynamic Strength & Stability",
              durationMinutes: userProfile?.availableWorkoutTime || 25,
              difficulty: "Moderate",
              focus: "Functional Strength",
              exercises: [
                { name: "Glute Bridges", sets: 3, reps: "15 reps", restSeconds: 45, tips: "Pause 2 seconds at peak contraction" },
                { name: "Pike Push-ups / Shoulder Taps", sets: 3, reps: "10 reps", restSeconds: 45, tips: "Maintain core bracing" },
                { name: "Bodyweight Good Mornings / Romanian Hinge", sets: 3, reps: "12 reps", restSeconds: 45, tips: "Push hips backward, flat back" },
                { name: "Side Plank Hold", sets: 2, reps: "25 sec per side", restSeconds: 45, tips: "Straight line from ankle to shoulder" }
              ]
            }
          ]
        });
      }

      const prompt = `Generate a personalized weekly adaptive workout plan in JSON for a user with:
- Goals: ${JSON.stringify(userProfile?.goals || ['General Fitness'])}
- Fitness Experience: ${userProfile?.fitnessExperience || 'Beginner'}
- Available Time: ${userProfile?.availableWorkoutTime || 30} minutes
- Equipment: ${JSON.stringify(userProfile?.availableEquipment || ['Bodyweight'])}
- Preferred Days: ${JSON.stringify(userProfile?.preferredWorkoutDays || ['Mon', 'Wed', 'Fri'])}
- Mobility Limitations: ${userProfile?.mobilityLimitations || 'None'}
- Current Readiness: Energy ${readiness?.energy || 3}/5, Soreness: ${readiness?.soreness || 'Low'}

Return ONLY clean valid JSON with no markdown wrapping:
{
  "planName": "string",
  "weeklyFocus": "string",
  "sessions": [
    {
      "day": "string",
      "title": "string",
      "durationMinutes": number,
      "difficulty": "Light" | "Moderate" | "Challenging",
      "focus": "string",
      "exercises": [
        { "name": "string", "sets": number, "reps": "string", "restSeconds": number, "tips": "string" }
      ]
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text?.trim() || "{}");
      res.json(parsed);
    } catch (err: any) {
      console.error("Plan generation error:", err);
      res.status(500).json({ error: "Failed to generate AI plan" });
    }
  });

  // AI Insights endpoint
  app.post("/api/analyze-insights", async (req, res) => {
    try {
      const { userProfile, history, readiness } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          insights: [
            {
              type: "consistency",
              headline: "Steady Consistency Detected",
              description: "You've been logging regular activity this week. Keep protecting this rhythm!",
              action: "Schedule your next 20-min session at a fixed morning or evening time.",
              tag: "Habit"
            },
            {
              type: "recovery",
              headline: "Readiness Check",
              description: "Your reported energy is balanced. A moderate intensity session will optimize adaptation without overreaching.",
              action: "Stay hydrated and incorporate a 5-minute dynamic warm-up before lifting.",
              tag: "Adaptation"
            }
          ]
        });
      }

      const prompt = `Analyze this user's recent fitness context:
- Profile: ${JSON.stringify(userProfile || {})}
- Activity History: ${JSON.stringify(history || [])}
- Readiness & Energy: ${JSON.stringify(readiness || {})}

Generate 2 to 3 actionable, empathetic, practical fitness insights in JSON:
{
  "insights": [
    {
      "type": "consistency" | "recovery" | "load" | "milestone",
      "headline": "string",
      "description": "string",
      "action": "string",
      "tag": "string"
    }
  ]
}
Return ONLY valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text?.trim() || "{}");
      res.json(parsed);
    } catch (err: any) {
      console.error("Insights error:", err);
      res.status(500).json({ error: "Failed to generate insights" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FitSync server running on http://localhost:${PORT}`);
  });
}

startServer();
