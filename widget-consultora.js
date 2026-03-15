/* =====================================================
   LMNHL — Widget de Consultoría Interactiva con IA
   Archivo: widget-consultora.js
   Incluir en todas las páginas antes de </body>
   ===================================================== */

(function() {
  'use strict';

  // ── ESTILOS ──────────────────────────────────────────
  const styles = `
    #lmnhl-widget-btn {
      position: fixed; bottom: 2rem; right: 2rem; z-index: 9999;
      width: 64px; height: 64px; border-radius: 50%;
      background: linear-gradient(135deg, #582D81, #87B229);
      border: none; cursor: pointer;
      box-shadow: 0 8px 32px rgba(88,45,129,.45);
      display: flex; align-items: center; justify-content: center;
      transition: transform .2s, box-shadow .2s;
      animation: lmnhl-pulse 3s ease infinite;
    }
    #lmnhl-widget-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 12px 40px rgba(88,45,129,.6);
    }
    #lmnhl-widget-btn svg { width: 28px; height: 28px; fill: #fff; }
    #lmnhl-widget-badge {
      position: absolute; top: -4px; right: -4px;
      width: 20px; height: 20px; border-radius: 50%;
      background: #e72078; border: 2px solid #fff;
      font-size: 10px; font-weight: 800; color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Poppins', sans-serif;
    }
    @keyframes lmnhl-pulse {
      0%, 100% { box-shadow: 0 8px 32px rgba(88,45,129,.45); }
      50% { box-shadow: 0 8px 48px rgba(88,45,129,.7), 0 0 0 8px rgba(88,45,129,.08); }
    }

    #lmnhl-widget-panel {
      position: fixed; bottom: 6rem; right: 2rem; z-index: 9998;
      width: 380px; max-height: 580px;
      background: #fff; border-radius: 0;
      box-shadow: 0 24px 80px rgba(42,31,56,.25);
      display: flex; flex-direction: column;
      font-family: 'Poppins', sans-serif;
      transform: scale(.9) translateY(20px);
      opacity: 0; pointer-events: none;
      transition: transform .3s cubic-bezier(.34,1.56,.64,1), opacity .25s;
      overflow: hidden;
    }
    #lmnhl-widget-panel.open {
      transform: scale(1) translateY(0);
      opacity: 1; pointer-events: all;
    }

    .lmnhl-header {
      background: linear-gradient(135deg, #3a1c57, #582D81);
      padding: 1.2rem 1.4rem;
      display: flex; align-items: center; gap: .9rem;
      border-bottom: 2px solid #87B229;
      flex-shrink: 0;
    }
    .lmnhl-avatar {
      width: 42px; height: 42px; border-radius: 50%; overflow: hidden;
      border: 2px solid #87B229; flex-shrink: 0;
      background: #582D81; display: flex; align-items: center; justify-content: center;
    }
    .lmnhl-avatar img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
    .lmnhl-header-info { flex: 1; }
    .lmnhl-name { font-size: .78rem; font-weight: 700; color: #fff; line-height: 1.2; }
    .lmnhl-role { font-size: .62rem; color: rgba(255,255,255,.55); letter-spacing: .06em; }
    .lmnhl-status {
      display: flex; align-items: center; gap: .35rem;
      font-size: .58rem; color: #87B229; letter-spacing: .08em; text-transform: uppercase; font-weight: 600;
    }
    .lmnhl-status::before {
      content: ''; width: 6px; height: 6px; border-radius: 50%; background: #87B229;
      animation: lmnhl-blink 2s ease infinite;
    }
    @keyframes lmnhl-blink { 0%,100%{opacity:1} 50%{opacity:.3} }
    .lmnhl-close {
      background: none; border: none; cursor: pointer;
      color: rgba(255,255,255,.4); font-size: 1.2rem; line-height: 1;
      padding: .2rem; transition: color .2s;
    }
    .lmnhl-close:hover { color: #fff; }

    .lmnhl-messages {
      flex: 1; overflow-y: auto; padding: 1.2rem;
      display: flex; flex-direction: column; gap: .8rem;
      scroll-behavior: smooth;
      background: #f8f6f2;
    }
    .lmnhl-messages::-webkit-scrollbar { width: 4px; }
    .lmnhl-messages::-webkit-scrollbar-track { background: transparent; }
    .lmnhl-messages::-webkit-scrollbar-thumb { background: rgba(88,45,129,.2); border-radius: 2px; }

    .lmnhl-msg {
      display: flex; gap: .6rem; align-items: flex-end;
      animation: lmnhl-fadein .3s ease;
    }
    @keyframes lmnhl-fadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    .lmnhl-msg.user { flex-direction: row-reverse; }
    .lmnhl-msg-avatar {
      width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
      background: #582D81; display: flex; align-items: center; justify-content: center;
      font-size: .55rem; font-weight: 700; color: #fff; overflow: hidden;
    }
    .lmnhl-msg-avatar img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
    .lmnhl-bubble {
      max-width: 75%; padding: .7rem .9rem;
      font-size: .78rem; line-height: 1.6; font-weight: 300;
      border-radius: 0;
    }
    .lmnhl-msg.bot .lmnhl-bubble {
      background: #fff; color: #2a1f38;
      border-left: 3px solid #87B229;
      box-shadow: 0 2px 8px rgba(0,0,0,.06);
    }
    .lmnhl-msg.user .lmnhl-bubble {
      background: #582D81; color: #fff;
    }
    .lmnhl-typing {
      display: flex; gap: 4px; align-items: center; padding: .7rem .9rem;
      background: #fff; border-left: 3px solid #87B229; max-width: 60px;
    }
    .lmnhl-typing span {
      width: 6px; height: 6px; border-radius: 50%; background: #87B229;
      animation: lmnhl-typing .8s ease infinite;
    }
    .lmnhl-typing span:nth-child(2) { animation-delay: .15s; }
    .lmnhl-typing span:nth-child(3) { animation-delay: .3s; }
    @keyframes lmnhl-typing { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }

    .lmnhl-options {
      display: flex; flex-wrap: wrap; gap: .5rem;
      padding: .3rem 0 .5rem;
      animation: lmnhl-fadein .3s ease;
    }
    .lmnhl-opt {
      font-size: .7rem; font-weight: 500; padding: .45rem .9rem;
      border: 1px solid #582D81; color: #582D81; background: #fff;
      cursor: pointer; font-family: 'Poppins', sans-serif;
      transition: background .15s, color .15s;
    }
    .lmnhl-opt:hover { background: #582D81; color: #fff; }

    .lmnhl-input-area {
      padding: .9rem 1rem; border-top: 1px solid rgba(88,45,129,.1);
      display: flex; gap: .6rem; align-items: center;
      background: #fff; flex-shrink: 0;
    }
    #lmnhl-input {
      flex: 1; border: 1px solid rgba(88,45,129,.2); padding: .6rem .8rem;
      font-family: 'Poppins', sans-serif; font-size: .78rem; color: #2a1f38;
      outline: none; font-weight: 300; background: #f8f6f2;
      transition: border-color .2s;
    }
    #lmnhl-input:focus { border-color: #582D81; }
    #lmnhl-input::placeholder { color: #7a6f85; }
    #lmnhl-send {
      width: 36px; height: 36px; border-radius: 50%; background: #582D81;
      border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: background .2s; flex-shrink: 0;
    }
    #lmnhl-send:hover { background: #87B229; }
    #lmnhl-send svg { width: 16px; height: 16px; stroke: #fff; fill: none; stroke-width: 2; }

    .lmnhl-cta-msg {
      background: linear-gradient(135deg, #3a1c57, #582D81);
      padding: 1rem 1.2rem; margin-top: .3rem;
      border-left: 3px solid #87B229;
    }
    .lmnhl-cta-msg p { font-size: .75rem; color: rgba(255,255,255,.8); margin-bottom: .7rem; font-weight: 300; }
    .lmnhl-cta-link {
      display: inline-flex; align-items: center; gap: .5rem;
      background: #87B229; color: #2a1f38;
      font-size: .65rem; letter-spacing: .1em; text-transform: uppercase;
      font-weight: 700; padding: .55rem 1.1rem; text-decoration: none;
      transition: background .2s;
    }
    .lmnhl-cta-link:hover { background: #9ecf30; }

    @media (max-width: 480px) {
      #lmnhl-widget-panel { width: calc(100vw - 2rem); right: 1rem; bottom: 5.5rem; }
      #lmnhl-widget-btn { bottom: 1.2rem; right: 1.2rem; }
    }
  `;

  // ── INJECT STYLES ──────────────────────────────────
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // ── BUILD HTML ──────────────────────────────────────
  const hasPhoto = document.querySelector('img[src*="sheila"]') !== null;
  const photoSrc = 'img/sheila-about.png';

  document.body.insertAdjacentHTML('beforeend', `
    <button id="lmnhl-widget-btn" aria-label="Habla con nuestra consultora">
      <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      <div id="lmnhl-widget-badge">1</div>
    </button>

    <div id="lmnhl-widget-panel" role="dialog" aria-label="Consultora virtual LMNHL">
      <div class="lmnhl-header">
        <div class="lmnhl-avatar">
          <img src="${photoSrc}" alt="Sheila Aguilar" onerror="this.parentElement.innerHTML='<span style=font-size:.8rem;font-weight:700;color:#fff>SA</span>'">
        </div>
        <div class="lmnhl-header-info">
          <div class="lmnhl-name">Sheila Aguilar</div>
          <div class="lmnhl-role">Consultora · Los Martes No Hay Luna</div>
          <div class="lmnhl-status">En línea ahora</div>
        </div>
        <button class="lmnhl-close" id="lmnhl-close" aria-label="Cerrar">✕</button>
      </div>
      <div class="lmnhl-messages" id="lmnhl-messages"></div>
      <div class="lmnhl-input-area">
        <input type="text" id="lmnhl-input" placeholder="Escribe tu respuesta..." autocomplete="off">
        <button id="lmnhl-send" aria-label="Enviar">
          <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  `);

  // ── STATE ───────────────────────────────────────────
  const state = {
    open: false,
    history: [],
    context: {},
    waiting: false,
    started: false
  };

  // ── DOM REFS ────────────────────────────────────────
  const btn    = document.getElementById('lmnhl-widget-btn');
  const panel  = document.getElementById('lmnhl-widget-panel');
  const msgs   = document.getElementById('lmnhl-messages');
  const input  = document.getElementById('lmnhl-input');
  const send   = document.getElementById('lmnhl-send');
  const close  = document.getElementById('lmnhl-close');
  const badge  = document.getElementById('lmnhl-widget-badge');

  // ── TOGGLE ──────────────────────────────────────────
  function togglePanel() {
    state.open = !state.open;
    panel.classList.toggle('open', state.open);
    badge.style.display = 'none';
    if (state.open && !state.started) {
      state.started = true;
      setTimeout(startConversation, 400);
    }
    if (state.open) input.focus();
  }

  btn.addEventListener('click', togglePanel);
  close.addEventListener('click', togglePanel);

  // ── MESSAGE HELPERS ─────────────────────────────────
  function addMsg(role, text, isHTML = false) {
    const div = document.createElement('div');
    div.className = `lmnhl-msg ${role}`;
    const avatarHTML = role === 'bot'
      ? `<div class="lmnhl-msg-avatar"><img src="${photoSrc}" alt="SA" onerror="this.parentElement.innerHTML='SA'"></div>`
      : `<div class="lmnhl-msg-avatar" style="background:#87B229;font-size:.6rem;">Tú</div>`;
    div.innerHTML = `
      ${avatarHTML}
      <div class="lmnhl-bubble">${role === 'bot' ? renderBotText(text) : escHtml(text)}</div>
    `;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  function addOptions(options) {
    const div = document.createElement('div');
    div.className = 'lmnhl-options';
    options.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'lmnhl-opt';
      b.textContent = opt;
      b.addEventListener('click', () => {
        div.remove();
        handleUserMessage(opt);
      });
      div.appendChild(b);
    });
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'lmnhl-msg bot';
    div.id = 'lmnhl-typing-indicator';
    div.innerHTML = `
      <div class="lmnhl-msg-avatar"><img src="${photoSrc}" alt="SA" onerror="this.parentElement.innerHTML='SA'"></div>
      <div class="lmnhl-typing"><span></span><span></span><span></span></div>
    `;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('lmnhl-typing-indicator');
    if (t) t.remove();
  }

  function addCTA() {
    const div = document.createElement('div');
    div.className = 'lmnhl-msg bot';
    div.innerHTML = `
      <div class="lmnhl-msg-avatar"><img src="${photoSrc}" alt="SA" onerror="this.parentElement.innerHTML='SA'"></div>
      <div class="lmnhl-cta-msg">
        <p>¿Quieres que analicemos todo esto juntos en profundidad? Tengo plazas para una sesión gratuita de 40 minutos contigo.</p>
        <a class="lmnhl-cta-link" href="sesion-gratuita.html">Reservar sesión gratuita →</a>
      </div>
    `;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function escHtml(t) {
    return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
  }

  function renderBotText(t) {
    // Escape HTML first, then make URLs clickable
    let safe = t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
    safe = safe.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" style="color:#87B229;text-decoration:underline;word-break:break-all;">$1</a>');
    return safe;
  }

  // ── CONVERSATION START ───────────────────────────────
  function startConversation() {
    addMsg('bot', '¡Hola! Soy Sheila 👋 Consultora de marketing digital e IA.');
    setTimeout(() => {
      addMsg('bot', 'En 3 preguntas rápidas te doy un consejo concreto para hacer crecer tu negocio. ¿Empezamos?');
      setTimeout(() => {
        addOptions(['¡Sí, vamos!', 'Ahora no, gracias']);
      }, 600);
    }, 800);
  }

  // ── MAIN AI CALL ─────────────────────────────────────
  async function callClaude(userMessage) {
    state.history.push({ role: 'user', content: userMessage });

    const systemPrompt = `Eres Sheila Aguilar, fundadora de Los Martes No Hay Luna, agencia de marketing digital e IA en Leganés, Madrid. Tienes 25 años de experiencia en estrategia empresarial, marketing digital e inteligencia artificial para PYMEs.

Tu objetivo es hacer un mini-diagnóstico del negocio del visitante en una conversación corta y darle consejos concretos y útiles.

FLUJO DE LA CONVERSACIÓN:
1. Primero pregunta en qué sector o tipo de negocio está (si no lo sabes ya)
2. Pregunta cuál es su mayor problema o reto ahora mismo
3. Pregunta si ya tienen presencia digital (web, redes, etc.)
4. Con esa información da 2-3 consejos MUY CONCRETOS y específicos para su situación
5. Invita a la sesión gratuita de 40 minutos

REGLAS:
- Respuestas cortas: máximo 3-4 líneas por mensaje
- Tono cercano, directo, experto pero humano
- Nunca uses jerga técnica sin explicarla
- Cuando des consejos, sé muy específico (no genérico)
- Después de dar los consejos, siempre ofrece la sesión gratuita
- Si el visitante dice que no quiere continuar, responde amablemente y despídete
- Escribe en español de España
- No uses emojis excesivos, máximo 1 por mensaje

Contexto acumulado del negocio del visitante: ${JSON.stringify(state.context)}`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: state.history
        })
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || 'Disculpa, hubo un problema. Escríbeme directamente a hola@losmartesnohayluna.com';
      state.history.push({ role: 'assistant', content: reply });

      // Detect if this is a good moment to show CTA
      const showCTA = state.history.length >= 8 ||
        reply.toLowerCase().includes('sesión') ||
        reply.toLowerCase().includes('reserva') ||
        reply.toLowerCase().includes('llamada');

      return { reply, showCTA };
    } catch (err) {
      return {
        reply: 'Vaya, parece que hay un problema de conexión. Puedes escribirme directamente a hola@losmartesnohayluna.com',
        showCTA: true
      };
    }
  }

  // ── HANDLE USER MESSAGE ───────────────────────────────
  async function handleUserMessage(text) {
    if (state.waiting) return;
    if (!text.trim()) return;

    // Special case: user says no
    if (text === 'Ahora no, gracias') {
      addMsg('user', text);
      setTimeout(() => {
        addMsg('bot', 'Sin problema. Cuando quieras estoy aquí. ¡Mucho éxito con tu negocio! 💪');
      }, 400);
      return;
    }

    addMsg('user', text);
    input.value = '';
    state.waiting = true;

    showTyping();

    const { reply, showCTA } = await callClaude(text);

    hideTyping();
    addMsg('bot', reply);

    if (showCTA) {
      setTimeout(addCTA, 600);
    }

    state.waiting = false;
  }

  // ── INPUT EVENTS ─────────────────────────────────────
  send.addEventListener('click', () => handleUserMessage(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserMessage(input.value);
    }
  });

  // ── SHOW BADGE AFTER 5 SECONDS ───────────────────────
  setTimeout(() => {
    if (!state.open) {
      badge.style.display = 'flex';
      badge.textContent = '1';
    }
  }, 5000);

})();
