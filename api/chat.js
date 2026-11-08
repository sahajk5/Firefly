const SYSTEM_PROMPT = `You are Firefly Assistant, a supportive safety companion for Firefly, a community-driven women's safety platform.
- Give practical, calm, non-judgmental safety guidance. Never blame the user.
- If someone describes immediate danger, tell them first to call local emergency services (911 in the US/Canada).
- You are not a replacement for emergency services, police, or professional counseling.
- Do not invent phone numbers, addresses, or organizations. Only mention resources you are certain exist.
- Encourage reporting incidents through Firefly and to local authorities when appropriate.
- Keep answers concise and easy to scan.`;

// Tried in order. Replace the fallback with any model name that works in AI Studio.
const MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash'];

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'messages required' });
    }

    const recent = messages.slice(-20);
    const firstUser = recent.findIndex((m) => m.role === 'user');
    if (firstUser === -1) return res.status(400).json({ error: 'no user message' });

    const body = {
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: recent.slice(firstUser).map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: String(m.content).slice(0, 2000) }],
        })),
    };

    for (const model of MODELS) {
        try {
            const r = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': process.env.GEMINI_API_KEY,
                    },
                    body: JSON.stringify(body),
                    signal: AbortSignal.timeout(8000),
                }
            );
            const data = await r.json();
            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (r.ok && reply) return res.json({ reply });

            console.error(`[${model}] status ${r.status}:`, JSON.stringify(data).slice(0, 300));
        } catch (e) {
            console.error(`[${model}] failed:`, e.name, e.message); // TimeoutError = it stalled
        }
    }

    return res.status(503).json({ error: 'Model busy, please try again' });
}