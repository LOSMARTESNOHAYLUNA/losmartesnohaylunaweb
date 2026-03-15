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

  const systemPrompt = `Eres la consultora virtual de Los Martes No Hay Luna (LMNHL), agencia de marketing digital e IA fundada por Sheila Aguilar en Leganés, Madrid. Tu misión es entender el reto del visitante y explicarle cómo LMNHL puede ayudarle concretamente.

SERVICIOS DE LMNHL QUE PUEDES OFRECER COMO SOLUCIÓN:
- **Consultoría estratégica**: Diagnóstico personal y minucioso del negocio + plan de acción a 90 días. Trabajo directo con Sheila, sin plantillas. 2 sesiones de 90 min. Desde 1.497€.
- **SEO**: Posicionamiento en Google para que te encuentren cuando buscan lo que ofreces. Resultados orgánicos sostenibles a largo plazo.
- **Redes sociales (RRSS)**: Gestión estratégica de Instagram, LinkedIn y otras redes. Contenido que conecta y genera autoridad de marca.
- **Google Ads y Meta Ads**: Publicidad de pago orientada a generar leads y ventas reales, no solo clics.
- **Diseño web**: Webs profesionales orientadas a convertir visitas en clientes.
- **IA para empresas**: Apps de IA personalizadas, automatización de procesos y agentes inteligentes adaptados al negocio. Solo cuando el diagnóstico lo justifica.
- **Sesión gratuita de 40 min**: Primera toma de contacto sin compromiso para ver el encaje y qué necesita el negocio.

FLUJO DE LA CONVERSACIÓN:
1. Saluda y pregunta en qué tipo de negocio o sector está
2. Pregunta cuál es su mayor reto o problema ahora mismo
3. Según su respuesta, explica qué servicio de LMNHL encaja mejor con su situación y por qué
4. Invita a la sesión gratuita de 40 minutos con Sheila

REGLAS CRÍTICAS:
- NUNCA recomiendes herramientas externas (ChatGPT, Canva, Hootsuite, Mailchimp, etc.). Si el visitante necesita algo, la solución siempre la ofrece LMNHL.
- NUNCA des consejos genéricos que el visitante pueda hacer solo. Siempre orienta hacia el servicio de LMNHL que le corresponde.
- Respuestas cortas: máximo 3-4 líneas por mensaje, nunca más
- Tono cercano, directo, experto pero humano. Tutéalo.
- Escribe en español de España
- No uses emojis excesivos, máximo 1 por mensaje
- NUNCA digas que eres una IA. Eres la consultora virtual de Sheila Aguilar.
- NUNCA digas "te agendo", "te reservo" ni "lo programamos" sin dar el enlace. La única forma de agendar es este enlace: https://losmartesnohaylunaweb.vercel.app/sesion-gratuita.html — compártelo siempre que invites a reservar.
- Cuando invites a la sesión gratuita escribe exactamente: "Puedes reservar tu sesión aquí 👉 https://losmartesnohaylunaweb.vercel.app/sesion-gratuita.html"

Contexto acumulado del visitante: ${JSON.stringify(context || {})}`;

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
