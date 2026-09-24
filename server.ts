import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API client on server side only
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  };

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'JK Coin Backend', time: new Date().toISOString() });
  });

  // AI Question Generator Endpoint (Server-Side Gemini API)
  app.post('/api/gemini/generate-questions', async (req, res) => {
    try {
      const { category, difficulty, count = 3, topic } = req.body;

      const ai = getAiClient();

      const prompt = `Generate ${count} engaging General Knowledge quiz questions for the category "${category || 'General Knowledge'}" with difficulty "${difficulty || 'Medium'}"${topic ? ` on the specific topic: "${topic}"` : ''}.
Ensure each question has 4 options, a 0-based correct answer index, a brief educational explanation, and a short hint.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an expert quiz question writer for a gamified mobile app named JK Coin. Return accurate, interesting, and well-structured quiz questions.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            description: 'List of generated quiz questions',
            items: {
              type: Type.OBJECT,
              properties: {
                questionText: { type: Type.STRING, description: 'The quiz question string' },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Exactly 4 multiple choice options'
                },
                correctAnswerIndex: { type: Type.INTEGER, description: 'Index 0, 1, 2, or 3 of the correct option' },
                explanation: { type: Type.STRING, description: 'A clear 1-2 sentence educational explanation of the answer' },
                hint: { type: Type.STRING, description: 'A helpful hint without giving away the direct answer' }
              },
              required: ['questionText', 'options', 'correctAnswerIndex', 'explanation', 'hint']
            }
          }
        }
      });

      const text = response.text || '[]';
      const questionsData = JSON.parse(text);

      res.json({ success: true, questions: questionsData });
    } catch (error: unknown) {
      console.error('Error generating questions:', error);
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message || 'Failed to generate questions' });
    }
  });

  // AI Admin Assistant Endpoint
  app.post('/api/gemini/ai-assistant', async (req, res) => {
    try {
      const { userMessage, context } = req.body;

      const ai = getAiClient();

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: userMessage,
        config: {
          systemInstruction: `You are the AI Assistant for the JK Coin Admin Panel. 
Context: ${JSON.stringify(context || {})}
Help the admin with quiz creation ideas, category balancing, user retention strategies, and gamification advice. Keep responses concise, professional, and directly actionable.`
        }
      });

      res.json({ success: true, reply: response.text });
    } catch (error: unknown) {
      console.error('Error in AI Assistant:', error);
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message || 'AI Assistant failed' });
    }
  });

  // Vite development middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
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
    console.log(`JK Coin Server running on http://localhost:${PORT}`);
  });
}

startServer();
