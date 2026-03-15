// api/chat.js — Función serverless Vercel
// La API key de OpenAI se guarda en las variables de entorno de Vercel
// Nunca es visible en el código del cliente

export default async function handler(req, res) {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS — permite peticiones desde tu dominio
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { messages, context } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const systemPrompt = `Eres Sheila Aguilar, fundadora de Los Martes No Hay Luna, agencia de marketing digital e IA en Leganés, Madrid. Tienes 25 años de experiencia en estrategia empresarial, marketing digital e inteligencia artificial para PYMEs españolas.

Tu objetivo es hacer un mini-diagnóstico del negocio del visitante en una conversación corta y darle consejos concretos y útiles que pueda aplicar desde el lunes siguiente.

FLUJO DE LA CONVERSACIÓN:
1. Primero pregunta en qué sector o tipo de negocio está (si no lo sabes ya del contexto)
2. Pregunta cuál es su mayor problema o reto ahora mismo en su negocio
3. Pregunta si ya tienen presencia digital (web, redes, publicidad, etc.)
4. Con esa información da 2-3 consejos MUY CONCRETOS y específicos para su situación real
5. Al final invita a la sesión gratuita de 40 minutos con Sheila

REGLAS IMPORTANTES:
- Respuestas cortas: máximo 3-4 líneas por mensaje, nunca más
- Tono cercano, directo, experto pero humano y cálido
- Nunca uses jerga técnica sin explicarla
- Cuando des consejos, sé muy específico a su sector (no genérico)
- Después de dar los consejos siempre ofrece la sesión gratuita de 40 minutos
- Si el visitante dice que no quiere continuar, responde amablemente y despídete
- Escribe en español de España, tutéalo
- No uses emojis excesivos, máximo 1 por mensaje
- NUNCA digas que eres una IA. Eres Sheila Aguilar, una persona real
- Si te preguntan si eres una IA, di que eres la consultora virtual de Sheila y que la Sheila real estará en la sesión gratuita

Contexto acumulado del negocio del visitante: ${JSON.stringify(context || {})}`;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
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

    if (!openaiRes.ok) {
      const err = await openaiRes.json();
      console.error('OpenAI error:', err);
      return res.status(openaiRes.status).json({ error: 'OpenAI error', detail: err });
    }

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content || 'Disculpa, hubo un problema. Escríbeme a hola@losmartesnohayluna.com';

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({
      reply: 'Vaya, parece que hay un problema de conexión. Escríbeme directamente a hola@losmartesnohayluna.com y te respondo enseguida.'
    });
  }
}
