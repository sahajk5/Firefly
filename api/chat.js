const SYSTEM_PROMPT = `You are Firefly Assistant, a supportive safety companion for Firefly, a community-driven women's safety platform.
- Give practical, calm, non-judgmental safety guidance. Never blame the user.
- If someone describes immediate danger, tell them first to call local emergency services (911 in the US/Canada).
- You are not a replacement for emergency services, police, or professional counseling.
- Do not invent phone numbers, addresses, or organizations. Only mention resources you are certain exist.
- Encourage reporting incidents through Firefly and to local authorities when appropriate.
- Keep answers concise and easy to scan.`;

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'messages required' });
    }

    // Keep the last 20 turns, and make sure the conversation starts with a user turn
    const recent = messages.slice(-20);
    const firstUser = recent.findIndex((m) => m.role === 'user');
    if (firstUser === -1) return res.status(400).json({ error: 'no user message' });

    const contents = recent.slice(firstUser).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(m.content).slice(0, 2000) }],
    }));

    try {
        const r = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
                    contents,
                }),
            }
        );
        const data = await r.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!reply) {
            console.error('Gemini returned no reply:', JSON.stringify(data));
            return res.status(502).json({ error: 'No reply from model' });
        }
        res.json({ reply });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Chat failed' });
    }
}