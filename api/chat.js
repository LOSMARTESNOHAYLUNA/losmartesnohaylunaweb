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
- Consultoría estratégica: Diagnóstico personal del negocio + plan de acción a 90 días. Trabajo directo con Sheila. Desde 1.497€.
- SEO: Posicionamiento en Google para que te encuentren cuando buscan lo que ofreces.
- Redes sociales: Gestión estratégica de Instagram, LinkedIn. Contenido que genera autoridad.
- Google Ads y Meta Ads: Publicidad de pago orientada a generar leads y ventas reales.
- Diseño web: Webs profesionales orientadas a convertir visitas en clientes.
- IA para empresas: Apps de IA personalizadas, automatización de procesos. Solo cuando el diagnóstico lo justifica.
- Sesión gratuita de 40 min: Primera toma de contacto sin compromiso.

FLUJO DE LA CONVERSACIÓN:
1. Saluda y pregunta en qué tipo de negocio o sector está
2. Pregunta cuál es su mayor reto o problema ahora mismo
3. Según su respuesta, explica qué servicio de LMNHL encaja mejor con su situación y por qué
4. Invita a la sesión gratuita de 40 minutos con Sheila

REGLAS CRÍTICAS — LÉELAS DESPACIO:
- NUNCA escribas código HTML. Ni etiquetas, ni atributos, ni corchetes angulares < >. SOLO texto plano.
- NUNCA escribas: <a href="...">, style="...", target="...", ni nada parecido.
- Cuando quieras poner un enlace escribe SOLO la URL limpia, sin nada más alrededor.
- Para la sesión gratuita escribe EXACTAMENTE esta frase, sin cambiar nada:
  "Puedes reservar tu sesión aquí: https://losmartesnohayluna.com/sesion-gratuita/"
- NUNCA recomiendes herramientas externas. La solución siempre la ofrece LMNHL.
- NUNCA des consejos genéricos que el visitante pueda hacer solo.
- Respuestas cortas: máximo 3-4 líneas por mensaje.
- Tono cercano, directo, experto pero humano. Tutéalo.
- Escribe en español de España.
- No uses emojis excesivos, máximo 1 por mensaje.
- NUNCA digas que eres una IA. Eres la consultora virtual de Sheila Aguilar.

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
        temperature: 0.7,
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
    let reply = data.choices?.[0]?.message?.content || 'Disculpa, hubo un problema. Escríbeme a hola@losmartesnohayluna.com';

    // Safety net: strip any HTML tags the model may have output anyway
    reply = reply.replace(/<[^>]*>/g, '');
    // Fix any vercel.app URLs to production domain
    reply = reply.replace(/https?:\/\/losmartesnohaylunaweb\.vercel\.app\/sesion-gratuita\.html["']?/g, 'https://losmartesnohayluna.com/sesion-gratuita/');
    reply = reply.replace(/losmartesnohaylunaweb\.vercel\.app/g, 'losmartesnohayluna.com');
    // Strip any leftover HTML attribute fragments
    reply = reply.replace(/\s*target=["'][^"']*["']/g, '');
    reply = reply.replace(/\s*style=["'][^"']*["']/g, '');
    reply = reply.replace(/\s*href=["'][^"']*["']/g, '');

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      reply: 'Vaya, hay un problema de conexión. Escríbeme directamente a hola@losmartesnohayluna.com'
    });
  }
};
