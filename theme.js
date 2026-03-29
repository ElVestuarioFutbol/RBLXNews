/*!
 * RBLXNews — theme.js
 * Sistema de Modo Oscuro/Claro con persistencia en localStorage
 * Incluir ANTES del </body> en todas las páginas:
 *   <script src="theme.js"></script>
 *
 * El script también aplica el tema guardado INMEDIATAMENTE (via
 * un snippet inline en <head>) para evitar el "flash" de modo claro.
 * Pega este snippet al final del <head> de cada página:
 *
 *   <script>
 *     (function(){
 *       var t = localStorage.getItem('rblxnews_theme');
 *       if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
 *         document.documentElement.classList.add('dark');
 *       }
 *     })();
 *   </script>
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'rblxnews_theme';
  var html        = document.documentElement;

  /* ── 1. Leer preferencia guardada (o del sistema) ── */
  function getPreference() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (saved === 'dark' || saved === 'light') return saved;
    // Fallback: preferencia del sistema operativo
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /* ── 2. Aplicar tema ── */
  function applyTheme(theme) {
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    updateToggles(theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
  }

  /* ── 3. Actualizar todos los botones de toggle en la página ── */
  function updateToggles(theme) {
    var labels  = document.querySelectorAll('.toggle-label');
    var isDark  = (theme === 'dark');
    labels.forEach(function (el) {
      el.textContent = isDark ? '☀️  Modo Claro' : '🌙  Modo Oscuro';
      el.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    });
  }

  /* ── 4. Handler del clic en el toggle ── */
  function handleToggleClick() {
    var current = html.classList.contains('dark') ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  /* ── 5. Inicializar al cargar el DOM ── */
  function init() {
    var pref = getPreference();
    applyTheme(pref);

    // Vincular todos los botones .theme-toggle
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', handleToggleClick);
      // Accesibilidad
      btn.setAttribute('role', 'button');
      btn.setAttribute('tabindex', '0');
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggleClick();
        }
      });
    });

    // Escuchar cambios del sistema operativo en tiempo real
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        // Solo responder si el usuario no tiene preferencia guardada
        var saved = null;
        try { saved = localStorage.getItem(STORAGE_KEY); } catch (err) {}
        if (!saved) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
