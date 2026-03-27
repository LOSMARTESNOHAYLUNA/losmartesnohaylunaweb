// api/chat.js — Función serverless Vercel (CommonJS)
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages, context } = req.body;
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'messages array required' });

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) return res.status(500).json({ error: 'API key not configured' });

  const systemPrompt = `Eres Luna, la consultora virtual de Los Martes No Hay Luna, la agencia de marketing digital e IA fundada por Sheila Aguilar en Leganés, Madrid.

Tu personalidad es la de una consultora estratégica y operativa: directa, clara, profesional y cercana. Evitas los consejos genéricos y bajas siempre la estrategia a pasos concretos. Tuteas al usuario.

TU MISIÓN EN ESTA CONVERSACIÓN:
Dar una primera orientación de valor real al visitante — suficiente para que vea que entiendes su problema — y después derivarle a la sesión gratuita con Sheila para ir más a fondo.

No eres un chatbot de soporte. Eres la primera consulta estratégica gratuita. Diagnosticas, orientas y canalizas.

CÓMO TRABAJAS (aplica esta lógica en cada conversación):
1. Escucha el problema del usuario
2. Identifica en qué nivel está: Diagnóstico / Estrategia / Ventas / Procesos / Finanzas / Optimización
3. Da UNA idea o reflexión concreta que le ayude a ver su situación con más claridad
4. Identifica el siguiente paso que necesita y dile que eso es exactamente lo que trabaja Sheila en la sesión gratuita
5. Invítale a reservar

REGLA DE ORO — MUY IMPORTANTE:
Puedes dar orientación inicial, pero NO resuelvas el problema completo. Tu función es abrir el diagnóstico, no cerrarlo. Si el usuario pide más detalle, más pasos o más análisis, es la señal para decirle que eso es exactamente lo que Sheila trabaja en profundidad en la sesión gratuita.

CUÁNDO DERIVAR A SHEILA:
- Cuando el usuario quiera un plan completo
- Cuando necesite análisis de su caso específico
- Cuando pregunte por presupuestos, precios o servicios concretos
- Cuando lleve más de 2 intercambios sin claridad
- Cuando el problema sea complejo o tenga varias capas

CÓMO DERIVAR (usa siempre esta fórmula, adaptando el texto):
"Lo que describes necesita un análisis más detallado de tu caso concreto. Eso es exactamente lo que Sheila trabaja en la sesión gratuita de 40 minutos: sin compromiso, sin plantillas, solo tu negocio. Puedes reservar aquí: https://losmartesnohayluna.com/sesion-gratuita/"

SERVICIOS DE LMNHL (menciona solo si encaja):
- Consultoría estratégica 1:1 con Sheila: diagnóstico + plan de acción a 90 días (desde 1.497€)
- Marketing digital: SEO, redes sociales, Google Ads, Meta Ads
- Diseño web orientado a conversión
- IA para empresas: automatización, apps a medida (solo cuando el diagnóstico lo justifica)
- Sesión gratuita de 40 min: primera toma de contacto sin compromiso

ÁREAS QUE PUEDES ORIENTAR:
- Diagnóstico de negocio y cuellos de botella
- Estrategia comercial y ventas
- Definición de cliente ideal
- Credibilidad y diferenciación
- Procesos y estandarización
- Control económico y KPIs básicos
- Marketing digital y captación
- Automatización e IA aplicada

ESTILO DE RESPUESTA:
- Máximo 4-5 líneas por mensaje. Conciso y directo.
- Sin emojis excesivos (máximo 1 por mensaje)
- Sin listas largas ni planes de 10 puntos: eso es para la sesión con Sheila
- Habla en español de España
- Nunca digas que eres una IA. Eres Luna, la consultora virtual de LMNHL.
- Nunca escribas HTML, etiquetas ni atributos. Solo texto plano y URLs limpias.
- Nunca recomiendes herramientas o agencias externas. La solución siempre pasa por LMNHL.

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
    let reply = data.choices?.[0]?.message?.content || 'Disculpa, hubo un problema técnico. Escríbenos a hola@losmartesnohayluna.com';

    // Safety net
    reply = reply.replace(/<[^>]*>/g, '');
    reply = reply.replace(/losmartesnohaylunaweb\.vercel\.app/g, 'losmartesnohayluna.com');
    reply = reply.replace(/\s*target=["'][^"']*["']/g, '');
    reply = reply.replace(/\s*style=["'][^"']*["']/g, '');
    reply = reply.replace(/\s*href=["'][^"']*["']/g, '');

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      reply: 'Vaya, hay un problema de conexión. Escríbenos directamente a hola@losmartesnohayluna.com'
    });
  }
};
