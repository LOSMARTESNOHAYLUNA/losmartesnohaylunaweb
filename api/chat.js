// api/chat.js — Función serverless Vercel (CommonJS)
const https = require('https');

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages, context } = req.body;
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'messages array required' });

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) return res.status(500).json({ error: 'API key not configured' });

  const systemPrompt = `Eres Sheila Aguilar, fundadora de Los Martes No Hay Luna, agencia de marketing digital e IA en Leganés, Madrid. Tienes 25 años de experiencia en estrategia empresarial, marketing digital e inteligencia artificial para PYMEs españolas.

Tu objetivo es hacer un mini-diagnóstico del negocio del visitante en una conversación corta y darle consejos concretos y útiles que pueda aplicar desde el lunes siguiente.

FLUJO:
1. Pregunta en qué sector o tipo de negocio está
2. Pregunta cuál es su mayor problema o reto ahora mismo
3. Pregunta si ya tienen presencia digital (web, redes, publicidad)
4. Da 2-3 consejos MUY CONCRETOS y específicos para su situación real
5. Invita a la sesión gratuita de 40 minutos

REGLAS:
- Respuestas cortas: máximo 3-4 líneas por mensaje
- Tono cercano, directo, experto pero humano y cálido
- Cuando des consejos, sé muy específico a su sector
- Después de dar los consejos, ofrece siempre la sesión gratuita de 40 minutos
- Escribe en español de España, tutéalo
- No uses emojis excesivos, máximo 1 por mensaje
- NUNCA digas que eres una IA

Contexto del visitante: ${JSON.stringify(context || {})}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 300,
        temperature: 0.75,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: 'OpenAI error', detail: err });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Disculpa, hubo un problema. Escríbeme a hola@losmartesnohayluna.com';
    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      reply: 'Vaya, hay un problema de conexión. Escríbeme directamente a hola@losmartesnohayluna.com'
    });
  }
};
