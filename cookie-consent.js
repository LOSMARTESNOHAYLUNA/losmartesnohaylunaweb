/**
 * RGPD Cookie Consent — Los Martes No Hay Luna
 * Cumple con RGPD / LOPDGDD española
 * Sin dependencias externas. Se autoinyecta.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'lmnhl_cookie_consent';
  const VERSION = '1.0';

  // ── CSS ─────────────────────────────────────────────────────
  const CSS = `
#lmnhl-cc-overlay {
  position: fixed; inset: 0; background: rgba(42,31,56,.55);
  z-index: 99998; display: flex; align-items: flex-end;
  justify-content: center; padding: 0;
  animation: lmnhl-fadein .3s ease;
}
@keyframes lmnhl-fadein { from { opacity: 0 } to { opacity: 1 } }

#lmnhl-cc-banner {
  background: #fff; width: 100%; max-width: 100%;
  padding: 2rem 2.5rem; box-shadow: 0 -4px 40px rgba(88,45,129,.15);
  font-family: 'Poppins', sans-serif; position: relative;
  border-top: 4px solid #582D81;
  animation: lmnhl-slidein .35s ease;
}
@keyframes lmnhl-slidein { from { transform: translateY(40px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }

#lmnhl-cc-banner * { box-sizing: border-box; margin: 0; padding: 0; }

.lmnhl-cc-top {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 2rem; flex-wrap: wrap;
}
.lmnhl-cc-logo {
  font-size: .6rem; letter-spacing: .18em; text-transform: uppercase;
  font-weight: 700; color: #582D81; margin-bottom: .6rem; display: block;
}
.lmnhl-cc-title {
  font-size: 1rem; font-weight: 700; color: #2a1f38;
  letter-spacing: -.02em; margin-bottom: .4rem;
}
.lmnhl-cc-text {
  font-size: .78rem; color: #7a6f85; line-height: 1.7; font-weight: 300;
  max-width: 680px;
}
.lmnhl-cc-text a {
  color: #582D81; text-decoration: underline;
}
.lmnhl-cc-actions {
  display: flex; gap: .6rem; flex-wrap: wrap; align-items: center;
  margin-top: 1.2rem; flex-shrink: 0;
}
.lmnhl-btn {
  font-family: 'Poppins', sans-serif; cursor: pointer; border: none;
  font-size: .65rem; letter-spacing: .1em; text-transform: uppercase;
  font-weight: 600; padding: .7rem 1.4rem; transition: all .2s;
  white-space: nowrap;
}
.lmnhl-btn-accept {
  background: #87B229; color: #2a1f38;
}
.lmnhl-btn-accept:hover { background: #9ecf30; }
.lmnhl-btn-reject {
  background: transparent; color: #582D81;
  border: 1px solid rgba(88,45,129,.3);
}
.lmnhl-btn-reject:hover { background: #f4f0fa; }
.lmnhl-btn-settings {
  background: transparent; color: #7a6f85;
  border: 1px solid rgba(122,111,133,.25); font-size: .62rem;
}
.lmnhl-btn-settings:hover { color: #582D81; border-color: rgba(88,45,129,.4); }

/* Panel de preferencias */
#lmnhl-cc-prefs {
  display: none; margin-top: 1.4rem; padding-top: 1.4rem;
  border-top: 1px solid rgba(88,45,129,.1);
}
#lmnhl-cc-prefs.open { display: block; }
.lmnhl-pref-row {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 1rem; padding: .9rem 0; border-bottom: 1px solid rgba(88,45,129,.07);
}
.lmnhl-pref-row:last-child { border-bottom: none; }
.lmnhl-pref-info h4 {
  font-size: .8rem; font-weight: 600; color: #2a1f38; margin-bottom: .2rem;
}
.lmnhl-pref-info p {
  font-size: .72rem; color: #7a6f85; line-height: 1.5; font-weight: 300;
}
/* Toggle switch */
.lmnhl-toggle {
  position: relative; width: 44px; height: 24px; flex-shrink: 0; margin-top: 2px;
}
.lmnhl-toggle input { opacity: 0; width: 0; height: 0; }
.lmnhl-toggle-track {
  position: absolute; inset: 0; background: #ddd;
  border-radius: 12px; cursor: pointer; transition: background .2s;
}
.lmnhl-toggle input:checked + .lmnhl-toggle-track { background: #87B229; }
.lmnhl-toggle input:disabled + .lmnhl-toggle-track { background: #87B229; cursor: not-allowed; opacity: .7; }
.lmnhl-toggle-track::after {
  content: ''; position: absolute; top: 3px; left: 3px;
  width: 18px; height: 18px; background: #fff; border-radius: 50%;
  transition: transform .2s; box-shadow: 0 1px 3px rgba(0,0,0,.2);
}
.lmnhl-toggle input:checked + .lmnhl-toggle-track::after { transform: translateX(20px); }

.lmnhl-cc-save {
  margin-top: 1rem; display: flex; gap: .6rem; flex-wrap: wrap;
}

@media (max-width: 600px) {
  #lmnhl-cc-banner { padding: 1.4rem 1.2rem; }
  .lmnhl-cc-top { flex-direction: column; gap: .8rem; }
  .lmnhl-cc-actions { margin-top: .8rem; }
  .lmnhl-btn { padding: .65rem 1rem; font-size: .62rem; }
}
`;

  // ── HTML ─────────────────────────────────────────────────────
  function buildBanner() {
    return `
<div id="lmnhl-cc-overlay" role="dialog" aria-modal="true" aria-labelledby="lmnhl-cc-title">
  <div id="lmnhl-cc-banner">
    <div class="lmnhl-cc-top">
      <div style="flex:1;min-width:260px">
        <span class="lmnhl-cc-logo">Los Martes No Hay Luna</span>
        <div class="lmnhl-cc-title" id="lmnhl-cc-title">Tu privacidad, tu decisión</div>
        <p class="lmnhl-cc-text">
          Usamos cookies propias necesarias para el funcionamiento del sitio y, con tu consentimiento, cookies analíticas y de marketing para mejorar tu experiencia y mostrarte contenido relevante. Puedes aceptarlas todas, rechazarlas o personalizar tu elección en cualquier momento. Más información en nuestra <a href="/privacidad/">Política de Privacidad</a> y <a href="/cookies/">Política de Cookies</a>.
        </p>
        <div class="lmnhl-cc-actions">
          <button class="lmnhl-btn lmnhl-btn-accept" id="lmnhl-accept-all">Aceptar todas</button>
          <button class="lmnhl-btn lmnhl-btn-reject" id="lmnhl-reject-all">Solo necesarias</button>
          <button class="lmnhl-btn lmnhl-btn-settings" id="lmnhl-open-prefs">Personalizar ▾</button>
        </div>
      </div>
    </div>

    <!-- Panel de preferencias -->
    <div id="lmnhl-cc-prefs">
      <div class="lmnhl-pref-row">
        <div class="lmnhl-pref-info">
          <h4>Cookies necesarias</h4>
          <p>Imprescindibles para el funcionamiento básico del sitio. No se pueden desactivar.</p>
        </div>
        <label class="lmnhl-toggle" aria-label="Cookies necesarias">
          <input type="checkbox" checked disabled>
          <span class="lmnhl-toggle-track"></span>
        </label>
      </div>
      <div class="lmnhl-pref-row">
        <div class="lmnhl-pref-info">
          <h4>Cookies analíticas</h4>
          <p>Nos ayudan a entender cómo se usa el sitio para mejorarlo (Google Analytics).</p>
        </div>
        <label class="lmnhl-toggle" aria-label="Cookies analíticas">
          <input type="checkbox" id="lmnhl-analytics">
          <span class="lmnhl-toggle-track"></span>
        </label>
      </div>
      <div class="lmnhl-pref-row">
        <div class="lmnhl-pref-info">
          <h4>Cookies de marketing</h4>
          <p>Permiten mostrar anuncios personalizados y medir el rendimiento de campañas.</p>
        </div>
        <label class="lmnhl-toggle" aria-label="Cookies de marketing">
          <input type="checkbox" id="lmnhl-marketing">
          <span class="lmnhl-toggle-track"></span>
        </label>
      </div>
      <div class="lmnhl-cc-save">
        <button class="lmnhl-btn lmnhl-btn-accept" id="lmnhl-save-prefs">Guardar preferencias</button>
        <button class="lmnhl-btn lmnhl-btn-reject" id="lmnhl-accept-all-2">Aceptar todas</button>
      </div>
    </div>

  </div>
</div>`;
  }

  // ── BOTÓN FLOTANTE (reabre el panel) ─────────────────────────
  function buildFloatingBtn() {
    return `<button id="lmnhl-cc-reopen" aria-label="Gestionar cookies" title="Gestionar cookies" style="
      position:fixed;bottom:1.2rem;left:1.2rem;z-index:9999;
      background:#582D81;color:#fff;border:none;border-radius:50%;
      width:40px;height:40px;cursor:pointer;display:flex;align-items:center;
      justify-content:center;box-shadow:0 2px 12px rgba(88,45,129,.4);
      font-size:18px;transition:background .2s;font-family:sans-serif;
    ">🍪</button>`;
  }

  // ── LÓGICA ───────────────────────────────────────────────────
  function getConsent() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
  }

  function saveConsent(analytics, marketing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      v: VERSION, ts: Date.now(), necessary: true, analytics, marketing
    }));
  }

  function applyConsent(consent) {
    if (!consent) return;
    // Google Analytics: activar/desactivar
    if (consent.analytics) {
      window['ga-disable-G-XXXXXXXXXX'] = false;
    } else {
      window['ga-disable-G-XXXXXXXXXX'] = true;
    }
    // Aquí se pueden añadir más callbacks según las herramientas activas
    document.dispatchEvent(new CustomEvent('lmnhl:consent', { detail: consent }));
  }

  function removeBanner() {
    const overlay = document.getElementById('lmnhl-cc-overlay');
    if (overlay) overlay.remove();
    // Añadir botón flotante para poder reabrir
    if (!document.getElementById('lmnhl-cc-reopen')) {
      document.body.insertAdjacentHTML('beforeend', buildFloatingBtn());
      document.getElementById('lmnhl-cc-reopen').addEventListener('click', showBanner);
    }
  }

  function showBanner() {
    // Quitar si ya existe
    const old = document.getElementById('lmnhl-cc-overlay');
    if (old) old.remove();

    document.body.insertAdjacentHTML('beforeend', buildBanner());

    const existing = getConsent();
    if (existing) {
      const a = document.getElementById('lmnhl-analytics');
      const m = document.getElementById('lmnhl-marketing');
      if (a) a.checked = existing.analytics;
      if (m) m.checked = existing.marketing;
    }

    // Eventos
    document.getElementById('lmnhl-accept-all').addEventListener('click', () => {
      saveConsent(true, true);
      applyConsent({ necessary: true, analytics: true, marketing: true });
      removeBanner();
    });

    document.getElementById('lmnhl-reject-all').addEventListener('click', () => {
      saveConsent(false, false);
      applyConsent({ necessary: true, analytics: false, marketing: false });
      removeBanner();
    });

    document.getElementById('lmnhl-open-prefs').addEventListener('click', () => {
      const prefs = document.getElementById('lmnhl-cc-prefs');
      prefs.classList.toggle('open');
      document.getElementById('lmnhl-open-prefs').textContent =
        prefs.classList.contains('open') ? 'Personalizar ▴' : 'Personalizar ▾';
    });

    document.getElementById('lmnhl-save-prefs').addEventListener('click', () => {
      const analytics = document.getElementById('lmnhl-analytics').checked;
      const marketing = document.getElementById('lmnhl-marketing').checked;
      saveConsent(analytics, marketing);
      applyConsent({ necessary: true, analytics, marketing });
      removeBanner();
    });

    document.getElementById('lmnhl-accept-all-2').addEventListener('click', () => {
      saveConsent(true, true);
      applyConsent({ necessary: true, analytics: true, marketing: true });
      removeBanner();
    });
  }

  // ── INIT ─────────────────────────────────────────────────────
  function init() {
    // Inyectar CSS
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    const consent = getConsent();
    if (!consent) {
      // Primera visita: mostrar banner
      showBanner();
    } else {
      // Ya consintió: aplicar preferencias y mostrar botón flotante
      applyConsent(consent);
      document.body.insertAdjacentHTML('beforeend', buildFloatingBtn());
      document.getElementById('lmnhl-cc-reopen').addEventListener('click', showBanner);
    }
  }

  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
