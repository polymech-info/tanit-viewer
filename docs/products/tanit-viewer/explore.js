(function () {
  var DATA = JSON.parse(document.getElementById('data').textContent);
  var ICONS = JSON.parse(document.getElementById('icons').textContent);
  var product = DATA.product;
  var features = DATA.features;
  var selected = 0;
  /** Per-feature slide index (stack mode keeps each card independent). */
  var slideByFeat = {};
  var IMAGE_MS = 4000;
  var IDLE_MS = 2000;
  var TOUR_KEY = 'tv-explore-tour';
  /**
   * Zoom by CSS pixel width on the <img> (not CSS scale, not % ladders).
   * zoomW === 0 → fit (max-width/height contain). Wheel step = ZOOM_STEP_PX.
   */
  var ZOOM_STEP_PX = 30;
  var ZOOM_MAX_FACTOR = 8;
  function zoomMediaEl(root) {
    return root ? root.querySelector('img.media-el, video.media-el, img.tv-lb-el, video.tv-lb-el') : null;
  }
  function mediaNaturalSize(el) {
    if (!el) return { w: 0, h: 0 };
    if (el.tagName === 'VIDEO') return { w: el.videoWidth || 0, h: el.videoHeight || 0 };
    return { w: el.naturalWidth || 0, h: el.naturalHeight || 0 };
  }
  function zoomMaxW(natW) {
    return Math.round(Math.max(0, natW) * ZOOM_MAX_FACTOR);
  }
  /** Display width → badge percent vs natural (fit shows actual scale). */
  function zoomBadgeText(el, zoomW) {
    var nat = mediaNaturalSize(el);
    if (!nat.w) return '100%';
    var w = zoomW > 0 ? zoomW : (el && el.offsetWidth) || 0;
    if (!w) return '100%';
    return Math.round((w * 100) / nat.w) + '%';
  }
  /**
   * Step display width by ±ZOOM_STEP_PX.
   * @returns {{ zoomW: number, fitW: number }}
   */
  function stepZoomW(el, zoomW, fitW, direction) {
    var nat = mediaNaturalSize(el);
    var cur = zoomW > 0 ? zoomW : (el && el.offsetWidth) || 0;
    var fit = fitW > 0 ? fitW : cur;
    if (!(cur > 0)) return { zoomW: zoomW, fitW: fit };
    var next = cur + direction * ZOOM_STEP_PX;
    var maxW = zoomMaxW(nat.w);
    if (next <= fit) return { zoomW: 0, fitW: fit };
    return { zoomW: Math.min(maxW, next), fitW: fit };
  }
  /** Snap width onto fitW + n×ZOOM_STEP_PX grid (pinch end). */
  function snapZoomW(w, fitW, maxW) {
    var fit = fitW > 0 ? fitW : 0;
    if (!(w > fit)) return 0;
    var n = Math.round((w - fit) / ZOOM_STEP_PX);
    var snapped = fit + n * ZOOM_STEP_PX;
    if (snapped <= fit) return 0;
    return Math.min(maxW > 0 ? maxW : snapped, snapped);
  }
  function panAfterZoomW(p, prevW, nextW, fitW) {
    if (!(nextW > 0)) return { x: 0, y: 0 };
    if (!(prevW > 0) || nextW >= prevW) return p;
    var base = fitW > 0 ? fitW : 0;
    var denom = prevW - base;
    if (!(denom > 0)) return { x: 0, y: 0 };
    var t = (nextW - base) / denom;
    return { x: p.x * t, y: p.y * t };
  }
  /**
   * Zoom by resizing the media element (not CSS scale).
   * Fit (zoomW≤0): clear inline size → CSS contain.
   * Zoomed: exact CSS px width; height:auto; pan via translate3d only.
   */
  function applyMediaZoom(xform, zoomW, pan, onNeedsLoad) {
    var el = zoomMediaEl(xform);
    if (!(zoomW > 0)) {
      xform.style.transform = '';
      if (el) {
        el.style.width = '';
        el.style.height = '';
        el.style.maxWidth = '';
        el.style.maxHeight = '';
      }
      return;
    }
    if (el) {
      var size = mediaNaturalSize(el);
      if (size.w > 0 && size.h > 0) {
        el.style.maxWidth = 'none';
        el.style.maxHeight = 'none';
        el.style.width = Math.round(zoomW) + 'px';
        el.style.height = 'auto';
      } else if (typeof onNeedsLoad === 'function') {
        onNeedsLoad(el);
      }
    }
    xform.style.transform =
      'translate3d(' + Math.round(pan.x) + 'px,' + Math.round(pan.y) + 'px,0)';
  }
  /** Hard stop only is persisted; soft pause does not survive reload. */
  function readTourMode() {
    try {
      if (localStorage.getItem(TOUR_KEY) === 'stopped') return 'stopped';
    } catch (_) {}
    return 'playing';
  }
  function persistTourMode(mode) {
    try {
      if (mode === 'stopped') localStorage.setItem(TOUR_KEY, 'stopped');
      else if (mode === 'playing') localStorage.removeItem(TOUR_KEY);
    } catch (_) {}
  }
  var tourMode = readTourMode(); // playing | paused | stopped
  var tourGen = 0;
  var tourTimer = null;
  var idleTimer = null;
  var suppressIdle = false;

  var elBrandLogo = document.getElementById('brandLogo');
  var elBrandTitle = document.getElementById('brandTitle');
  var elNav = document.getElementById('sideNav');
  var elStage = document.getElementById('stage');
  var themeBtn = document.getElementById('themeBtn');
  elBrandTitle.textContent = product.title || 'Tanit Viewer';
  elBrandLogo.innerHTML = ICONS.avatar || '';

  function setTourHints(text) {
    document.querySelectorAll('.tour-hint').forEach(function (el) { el.textContent = text; });
  }

  /** Optional CDN/base from build: window.TV_ASSET_URL (e.g. https://cdn.example.com/tanit/) */
  function assetUrl(path) {
    if (!path) return path;
    if (/^(https?:|data:|blob:|\/\/)/i.test(path)) return path;
    var base = typeof TV_ASSET_URL === 'string' ? TV_ASSET_URL : '';
    if (!base) return path;
    return base.replace(/\/?$/, '/') + String(path).replace(/^\.\//, '').replace(/^\//, '');
  }

  var clickSfxPool = [];
  var clickSfxIdx = 0;
  function playClick() {
    try {
      if (!clickSfxPool.length) {
        for (var i = 0; i < 4; i++) {
          var a = new Audio(assetUrl('sfx/selected.mp3'));
          a.preload = 'auto';
          a.volume = 0.55;
          clickSfxPool.push(a);
        }
      }
      var snd = clickSfxPool[clickSfxIdx % clickSfxPool.length];
      clickSfxIdx += 1;
      snd.currentTime = 0;
      var p = snd.play();
      if (p && p.catch) p.catch(function () {});
    } catch (_) {}
  }

  function tourControlsHtml(extraClass) {
    return '<div class="tour-controls' + (extraClass ? ' ' + extraClass : '') + '" data-mode="' + tourMode + '">' +
      '<div class="tour-btns">' +
        '<button type="button" class="tour-btn" data-act="play" aria-label="Play tour" title="Play" aria-pressed="' + (tourMode === 'playing' ? 'true' : 'false') + '">' +
          '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button>' +
        '<button type="button" class="tour-btn" data-act="pause" aria-label="Pause tour" title="Pause" aria-pressed="' + (tourMode === 'paused' ? 'true' : 'false') + '">' +
          '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg></button>' +
        '<button type="button" class="tour-btn" data-act="stop" aria-label="Stop tour" title="Stop" aria-pressed="' + (tourMode === 'stopped' ? 'true' : 'false') + '">' +
          '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"/></svg></button>' +
      '</div>' +
      '<div class="tour-meta"><b class="tour-label">Auto</b><span class="tour-hint">Images 4s · videos to end</span></div>' +
    '</div>';
  }

  function esc(s) {
    return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function icon(name) {
    return ICONS[name] || ICONS.command || '';
  }
  function feat() { return features[selected]; }
  function isEnabled(item) {
    if (!item) return false;
    if (item.enabled === false || item.enable === false) return false;
    return true;
  }
  function slidesOf(fi) {
    var raw = (features[fi] && features[fi].slides) || [];
    return raw.filter(isEnabled);
  }
  function slideIndex(fi) {
    if (fi == null) fi = selected;
    var n = slidesOf(fi).length;
    if (!n) return 0;
    var v = slideByFeat[fi];
    if (v == null || v < 0 || isNaN(v)) return 0;
    return Math.min(Math.floor(v), n - 1);
  }
  function setSlideIndex(fi, i) {
    if (fi == null) fi = selected;
    slideByFeat[fi] = i;
  }
  function slides() { return slidesOf(selected); }
  function slide() { return slidesOf(selected)[slideIndex(selected)] || null; }
  function slideOf(fi) { return slidesOf(fi)[slideIndex(fi)] || null; }
  function visibleFeatures() {
    return features.filter(isEnabled);
  }
  /** Mobile / narrow: all features stacked for page scroll; slides stay in-card. */
  function isStackMode() {
    try { return window.matchMedia('(max-width:900px)').matches; } catch (e) { return false; }
  }

  function slideMediaKind(s) {
    var m = s && s.media;
    var src = m && (m.src || (typeof m === 'string' ? m : ''));
    if (!src && m && Array.isArray(m) && m[0]) src = m[0].src || m[0];
    if (!src) return 'image';
    return isVideoSrc(src) || (m && m.type === 'video') ? 'video' : 'image';
  }

  function clearTourTimer() {
    if (tourTimer) { clearTimeout(tourTimer); tourTimer = null; }
  }
  function clearIdleTimer() {
    if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
  }

  function syncTourUi() {
    var f = feat();
    var label = f ? f.label : '';
    var modeLabel = tourMode === 'playing' ? 'Auto' : (tourMode === 'paused' ? 'Paused' : 'Stopped');
    var hint;
    if (tourMode === 'playing') hint = (label ? label + ' · ' : '') + 'rotating';
    else if (tourMode === 'paused') hint = idleTimer ? 'Resumes in 2s if idle' : 'Paused · press play';
    else hint = 'Tour off · press play';

    document.querySelectorAll('.tour-controls').forEach(function (elTour) {
      elTour.setAttribute('data-mode', tourMode);
      elTour.querySelectorAll('[data-act]').forEach(function (btn) {
        var act = btn.getAttribute('data-act');
        var on = (act === 'play' && tourMode === 'playing') ||
          (act === 'pause' && tourMode === 'paused') ||
          (act === 'stop' && tourMode === 'stopped');
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      var elTourLabel = elTour.querySelector('.tour-label');
      var elTourHint = elTour.querySelector('.tour-hint');
      if (elTourLabel) elTourLabel.textContent = modeLabel;
      if (elTourHint) elTourHint.textContent = hint;
    });
  }

  function navItemHtml(f, i, mediaKind) {
    var on = i === selected;
    var tourAttr = on && tourMode !== 'stopped'
      ? ' data-tour="' + tourMode + '" data-media="' + mediaKind + '" style="--tour-ms:' + IMAGE_MS + 'ms"'
      : '';
    return '<button type="button" class="side-item" data-i="' + i + '" aria-current="' + (on ? 'true' : 'false') + '"' + tourAttr + '>' +
      '<span class="si">' + icon(f.icon) + '</span><span class="sl">' + esc(f.label) + '</span>' +
      '<span class="tour-mark" aria-hidden="true"></span>' +
      '<span class="tour-bar" aria-hidden="true"><i></i></span></button>';
  }

  function renderNav() {
    var mediaKind = slideMediaKind(slide());
    var html = '';
    var cats = product.categories || [];
    var visible = visibleFeatures();
    if (cats.length) {
      cats.forEach(function (cat) {
        var items = visible.filter(function (f) { return f.categoryId === cat.id; });
        if (!items.length) return;
        html += '<div class="side-sec">' + esc(cat.label) + '</div>';
        items.forEach(function (f) {
          html += navItemHtml(f, features.indexOf(f), mediaKind);
        });
      });
    } else {
      visible.forEach(function (f) {
        html += navItemHtml(f, features.indexOf(f), mediaKind);
      });
    }
    elNav.innerHTML = html || '<div class="side-sec">No matches</div>';
    syncTourUi();
  }

  function themeRoot() {
    return document.querySelector('.tv-explore[data-theme]') || document.documentElement;
  }
  function themeName() {
    return themeRoot().getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }
  function applyTheme(next, persist) {
    var n = next === 'light' ? 'light' : 'dark';
    var root = themeRoot();
    root.setAttribute('data-theme', n);
    if (lb && lb.el) lb.el.setAttribute('data-theme', n);
    if (persist !== false) localStorage.setItem('tv-explore-theme', n);
    // Rebuild media so _light / _dark assets swap with the theme
    if (typeof paint === 'function') paint();
    if (lb && lb.open && typeof renderLightboxContent === 'function') renderLightboxContent();
  }
  /** True when hosted in pm iframe-widget (?embed=1 or nested). */
  function isEmbed() {
    try {
      if (window.parent !== window) return true;
      return new URLSearchParams(location.search).get('embed') === '1';
    } catch (e) { return window.parent !== window; }
  }
  function enableEmbedLayout() {
    if (!isEmbed()) return;
    document.documentElement.setAttribute('data-pm-embed', '1');
    var explore = document.querySelector('.tv-explore');
    if (explore) explore.setAttribute('data-pm-embed', '1');
  }
  /**
   * Measure CONTENT height, not the clipped iframe viewport.
   * getBoundingClientRect is wrong when parent height < content (classic mobile clip).
   */
  function measureHeight() {
    enableEmbedLayout();
    var doc = document.documentElement;
    var body = document.body;
    var root = document.querySelector('.tv-explore') || body;
    var shell = document.querySelector('.shell');
    var h = Math.max(
      root.scrollHeight || 0,
      root.offsetHeight || 0,
      shell ? shell.scrollHeight : 0,
      shell ? shell.offsetHeight : 0,
      body ? body.scrollHeight : 0,
      body ? body.offsetHeight : 0,
      doc ? doc.scrollHeight : 0,
      doc ? doc.offsetHeight : 0
    );
    // Sum in-flow children if shell collapsed under a previous clip
    if (shell && h < 200) {
      var sum = 0;
      for (var i = 0; i < shell.children.length; i++) {
        sum += shell.children[i].getBoundingClientRect().height;
      }
      h = Math.max(h, Math.ceil(sum + 24));
    }
    return Math.ceil(h);
  }
  var _heightReportTimer = null;
  function reportHeight() {
    if (window.parent === window) return;
    try {
      var h = measureHeight();
      if (h > 0) window.parent.postMessage({ type: 'pm-iframe-height', height: h }, '*');
    } catch (e) { /* ignore */ }
  }
  function reportHeightSoon() {
    if (_heightReportTimer) clearTimeout(_heightReportTimer);
    _heightReportTimer = setTimeout(function () {
      _heightReportTimer = null;
      reportHeight();
      // second pass after layout/fonts
      requestAnimationFrame(function () { reportHeight(); });
    }, 16);
  }

  function isVideoSrc(src) {
    var s = String(src || '').split('?')[0].toLowerCase();
    return s.endsWith('.mp4') || s.endsWith('.webm') || s.endsWith('.ogg') || s.endsWith('.mov');
  }

  /**
   * Probe theme variants from catalog `src` (images only):
   *   ./shot.png → ./shot_<theme>.png, ./shot_<other>.png, then ./shot.png
   * Videos: declared `src` only. No alternate-extension inventing.
   */
  function mediaCandidates(media) {
    var m = media;
    if (!m) return [];
    if (typeof m === 'string') m = { src: m };
    var src = m.src;
    if (!src) return [];
    var theme = themeName();
    var other = theme === 'dark' ? 'light' : 'dark';
    var ordered = [];
    function add(s) {
      if (!s || typeof s !== 'string' || ordered.indexOf(s) !== -1) return;
      ordered.push(s);
    }
    function withTheme(path, t) {
      var q = path.indexOf('?');
      var base = q === -1 ? path : path.slice(0, q);
      var query = q === -1 ? '' : path.slice(q);
      var dot = base.lastIndexOf('.');
      if (dot === -1) return path;
      var name = base.slice(0, dot);
      var ext = base.slice(dot);
      if (name.endsWith('_dark')) name = name.slice(0, -5);
      else if (name.endsWith('_light')) name = name.slice(0, -6);
      return name + '_' + t + ext + query;
    }

    if (isVideoSrc(src)) {
      add(src);
    } else {
      // Theme first — bare src last (often absent when only _light/_dark exist)
      add(withTheme(src, theme));
      add(withTheme(src, other));
      add(src);
    }
    return ordered.map(assetUrl);
  }

  function mediaHtml(m) {
    if (!m || !m.src) return '<div class="empty-media">No media</div>';
    var cands = mediaCandidates(m);
    var first = cands[0];
    var type = m.type || (isVideoSrc(first) ? 'video' : 'image');
    var data = esc(JSON.stringify(cands));
    var el;
    if (type === 'video' || isVideoSrc(first)) {
      var auto = tourMode === 'playing' ? ' autoplay muted' : '';
      // preload=metadata so a bad first URL fires `error` and fallback can advance.
      // (preload=none often never errors until play — stuck on missing _light.mp4.)
      el = '<video class="media-el" data-fallback="' + data + '" data-i="0" src="' + esc(first) + '" controls playsinline preload="metadata"' + auto + '></video>';
    } else {
      el = '<img class="media-el" data-fallback="' + data + '" data-i="0" src="' + esc(first) + '" alt="" draggable="false" loading="lazy" decoding="async"/>';
    }
    return '<div class="media-surface"><div class="media-xform">' + el + '</div></div><div class="zoom-badge">100%</div>';
  }

  function hydrateMedia(el) {
    if (!el) return;
    var pending = el.getAttribute('data-src');
    if (pending) {
      el.src = pending;
      el.removeAttribute('data-src');
    }
  }

  var lazyIo = null;
  function ensureLazyIo() {
    if (lazyIo || typeof IntersectionObserver === 'undefined') return lazyIo;
    lazyIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        hydrateMedia(entry.target);
        if (lazyIo) lazyIo.unobserve(entry.target);
      });
    }, { root: null, rootMargin: '280px 0px', threshold: 0.01 });
    return lazyIo;
  }

  /** Legacy: hydrate videos that still use data-src (older markup). */
  function bindLazyMedia(scope) {
    var root = scope || elStage;
    var vids = root.querySelectorAll('video.media-el[data-src]');
    if (!vids.length) return;
    var io = ensureLazyIo();
    vids.forEach(function (el) {
      var card = el.closest('.feature-card');
      var fi = card ? Number(card.getAttribute('data-feat')) : selected;
      var eager = !isStackMode() || fi === selected;
      if (eager || !io) {
        hydrateMedia(el);
        if (io) io.unobserve(el);
        return;
      }
      io.observe(el);
    });
  }

  function bindMediaFallback(scope) {
    (scope || elStage).querySelectorAll('.media-el').forEach(function (el) {
      var cands;
      try { cands = JSON.parse(el.getAttribute('data-fallback') || '[]'); } catch (e) { return; }
      function tryNext() {
        var i = Number(el.getAttribute('data-i') || 0) + 1;
        if (i >= cands.length) {
          var wrap = el.closest('.media-surface') || el.parentNode;
          if (wrap) wrap.innerHTML = '<div class="empty-media">Media unavailable</div>';
          return;
        }
        var next = cands[i];
        var wantVideo = isVideoSrc(next);
        var curVideo = el.tagName === 'VIDEO';
        if (wantVideo !== curVideo) {
          var neu = document.createElement(wantVideo ? 'video' : 'img');
          neu.className = 'media-el';
          neu.setAttribute('data-fallback', el.getAttribute('data-fallback'));
          neu.setAttribute('data-i', String(i));
          if (wantVideo) {
            neu.controls = true;
            neu.playsInline = true;
            neu.preload = 'metadata';
          } else {
            neu.alt = '';
            neu.draggable = false;
            neu.loading = 'lazy';
            neu.decoding = 'async';
          }
          neu.src = next;
          neu.addEventListener('error', tryNext);
          el.replaceWith(neu);
          el = neu;
          return;
        }
        el.setAttribute('data-i', String(i));
        el.removeAttribute('data-src');
        el.src = next;
        if (el.tagName === 'VIDEO' && typeof el.load === 'function') el.load();
      }
      el.addEventListener('error', tryNext);
    });
  }

  /** Wheel zoom (±ZOOM_STEP_PX) + pinch + pan. Zoom resizes <img>, never CSS scale. */
  function bindMediaZoom(scope) {
    var root = (scope || elStage).querySelector('.stage-media');
    var xform = root ? root.querySelector('.media-xform') : null;
    var badge = root ? root.querySelector('.zoom-badge') : null;
    if (!root || !xform) return;

    var zoomW = 0; // 0 = fit; else CSS px width
    var fitW = 0;
    var pan = { x: 0, y: 0 };
    var pointers = new Map();
    var pinch = null;
    var drag = null;
    var panning = false;

    function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
    function isChrome(t) {
      if (!(t instanceof Element)) return false;
      return Boolean(t.closest('button, a, input, select, textarea, video::-webkit-media-controls'));
    }
    function apply() {
      applyMediaZoom(xform, zoomW, pan, function (el) {
        if (el._tvZoomWait) return;
        el._tvZoomWait = true;
        var retry = function () { el._tvZoomWait = false; apply(); };
        el.addEventListener('load', retry, { once: true });
        el.addEventListener('loadeddata', retry, { once: true });
      });
      if (!(zoomW > 0)) root.removeAttribute('data-zoomed');
      else root.setAttribute('data-zoomed', '');
      if (panning) root.setAttribute('data-panning', '');
      else root.removeAttribute('data-panning');
      if (badge) badge.textContent = zoomBadgeText(zoomMediaEl(xform), zoomW);
    }
    function resetView() {
      zoomW = 0;
      pan = { x: 0, y: 0 };
      apply();
    }

    // Wheel zoom is lightbox-only — stage keeps page scroll / slide gestures.

    // Native <img> drag-and-drop steals the gesture — kill it.
    root.addEventListener('dragstart', function (e) { e.preventDefault(); });

    root.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (isChrome(e.target)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size >= 2) {
        drag = null;
        var pts = Array.from(pointers.values());
        var el = zoomMediaEl(xform);
        var startW = zoomW > 0 ? zoomW : (el && el.offsetWidth) || 0;
        if (!(fitW > 0) && startW > 0) fitW = startW;
        pinch = { distance: Math.max(1, dist(pts[0], pts[1])), zoomW: startW, fitW: fitW };
        e.preventDefault();
        try { root.setPointerCapture(e.pointerId); } catch (_) {}
        return;
      }
      // Desktop: allow drag-pan once zoomed; track click for lightbox open
      if (zoomW > 0) {
        e.preventDefault();
        try { root.setPointerCapture(e.pointerId); } catch (_) {}
        drag = { pointerId: e.pointerId, x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y, moved: false };
      } else {
        drag = { pointerId: e.pointerId, x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y, moved: false, clickCandidate: true };
      }
    });

    root.addEventListener('pointermove', function (e) {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size >= 2 && pinch) {
        e.preventDefault();
        panning = true;
        var pts = Array.from(pointers.values());
        var distance = Math.max(1, dist(pts[0], pts[1]));
        var prev = zoomW > 0 ? zoomW : pinch.zoomW;
        var el = zoomMediaEl(xform);
        var nat = mediaNaturalSize(el);
        zoomW = Math.min(zoomMaxW(nat.w), Math.max(0, pinch.zoomW * (distance / pinch.distance)));
        if (zoomW <= (pinch.fitW || 0)) zoomW = 0;
        pan = panAfterZoomW(pan, prev, zoomW, pinch.fitW || fitW);
        apply();
        return;
      }
      if (!drag || drag.pointerId !== e.pointerId) return;
      var dx = e.clientX - drag.x;
      var dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) < 3) return;
      drag.moved = true;
      if (drag.clickCandidate && !(zoomW > 0)) {
        // not zoomed — don't pan, just mark as moved so click won't open lightbox after a drag
        return;
      }
      panning = true;
      e.preventDefault();
      pan = { x: drag.panX + dx, y: drag.panY + dy };
      apply();
    });

    function endPointer(e) {
      if (!pointers.has(e.pointerId)) return;
      pointers.delete(e.pointerId);
      var wasClick = drag && drag.pointerId === e.pointerId && drag.clickCandidate && !drag.moved;
      if (drag && drag.pointerId === e.pointerId) drag = null;
      if (pointers.size < 2 && pinch) {
        var prev = zoomW;
        var el = zoomMediaEl(xform);
        var nat = mediaNaturalSize(el);
        var baseFit = pinch.fitW || fitW;
        zoomW = snapZoomW(zoomW > 0 ? zoomW : 0, baseFit, zoomMaxW(nat.w));
        if (zoomW > 0) fitW = baseFit;
        pan = panAfterZoomW(pan, prev, zoomW, fitW);
        pinch = null;
      }
      if (pointers.size === 0) panning = false;
      if (pointers.size === 1 && zoomW > 0) {
        var entry = pointers.entries().next().value;
        if (entry) {
          drag = { pointerId: entry[0], x: entry[1].x, y: entry[1].y, panX: pan.x, panY: pan.y, moved: false };
        }
      }
      apply();
      // Click image (not zoomed) → lightbox
      if (wasClick && root.querySelector('img.media-el')) {
        var card = root.closest('.feature-card');
        var fi = card ? Number(card.getAttribute('data-feat')) : selected;
        openLightbox(fi);
      }
    }
    root.addEventListener('pointerup', endPointer);
    root.addEventListener('pointercancel', endPointer);

    root.addEventListener('dblclick', function (e) {
      if (isChrome(e.target)) return;
      if (zoomW > 0) {
        e.preventDefault();
        resetView();
      } else if (root.querySelector('img.media-el')) {
        e.preventDefault();
        var card = root.closest('.feature-card');
        openLightbox(card ? Number(card.getAttribute('data-feat')) : selected);
      }
    });

    apply();
  }

  // ── Lightbox (desktop-first; title/desc overlay + slide nav / swipe / wheel zoom) ──
  var lb = { el: null, open: false, fi: 0, zoomW: 0, fitW: 0, pan: { x: 0, y: 0 }, pointers: null, drag: null, pinch: null };

  function ensureLightbox() {
    if (lb.el) return lb.el;
    var el = document.createElement('div');
    el.className = 'tv-lightbox';
    el.hidden = true;
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('data-theme', themeName());
    el.innerHTML =
      '<button type="button" class="tv-lb-close" aria-label="Close">×</button>' +
      '<div class="tv-lb-stage">' +
        '<div class="tv-lb-media">' +
          '<div class="tv-lb-xform"></div>' +
          '<div class="tv-lb-badge">100%</div>' +
        '</div>' +
        '<div class="tv-lb-footer">' +
          '<div class="tv-lb-caption-row">' +
            '<button type="button" class="tv-lb-prev tv-lb-card" aria-label="Previous">‹</button>' +
            '<div class="tv-lb-caption tv-lb-card">' +
              '<b class="tv-lb-title"></b>' +
              '<p class="tv-lb-desc"></p>' +
              '<span class="tv-lb-count"></span>' +
            '</div>' +
            '<button type="button" class="tv-lb-next tv-lb-card" aria-label="Next">›</button>' +
          '</div>' +
          '<div class="tv-lb-tour tv-lb-card">' + tourControlsHtml('tv-lb-tour-controls') + '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(el);
    lb.el = el;
    lb.pointers = new Map();

    el.querySelector('.tv-lb-close').addEventListener('click', function (e) { e.stopPropagation(); closeLightbox(); });
    el.querySelector('.tv-lb-prev').addEventListener('click', function (e) {
      e.stopPropagation();
      noteInteraction();
      lightboxNav(-1);
    });
    el.querySelector('.tv-lb-next').addEventListener('click', function (e) {
      e.stopPropagation();
      noteInteraction();
      lightboxNav(1);
    });
    el.querySelector('.tv-lb-tour').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-act]');
      if (!btn) return;
      e.stopPropagation();
      playClick();
      var act = btn.getAttribute('data-act');
      suppressIdle = true;
      if (act === 'play') setTourMode('playing');
      else if (act === 'pause') setTourMode('paused');
      else if (act === 'stop') setTourMode('stopped');
      suppressIdle = false;
    });
    el.addEventListener('click', function (e) {
      if (e.target === el) closeLightbox();
    });

    var media = el.querySelector('.tv-lb-media');
    media.addEventListener('wheel', function (e) {
      e.preventDefault();
      lightboxZoomBy(e.deltaY < 0 ? 1 : -1);
    }, { passive: false });
    media.addEventListener('dragstart', function (e) { e.preventDefault(); });
    media.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.target.closest('button, a, video')) return;
      lb.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (lb.pointers.size >= 2) {
        lb.drag = null;
        var pts = Array.from(lb.pointers.values());
        var xform = el.querySelector('.tv-lb-xform');
        var mediaEl = zoomMediaEl(xform);
        var startW = lb.zoomW > 0 ? lb.zoomW : (mediaEl && mediaEl.offsetWidth) || 0;
        if (!(lb.fitW > 0) && startW > 0) lb.fitW = startW;
        lb.pinch = {
          distance: Math.max(1, Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)),
          zoomW: startW,
          fitW: lb.fitW,
        };
        try { media.setPointerCapture(e.pointerId); } catch (_) {}
        return;
      }
      lb.drag = {
        id: e.pointerId, x: e.clientX, y: e.clientY,
        panX: lb.pan.x, panY: lb.pan.y, moved: false, t: Date.now(),
      };
      if (lb.zoomW > 0) {
        try { media.setPointerCapture(e.pointerId); } catch (_) {}
      }
    });
    media.addEventListener('pointermove', function (e) {
      if (!lb.pointers.has(e.pointerId)) return;
      lb.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (lb.pointers.size >= 2 && lb.pinch) {
        var pts = Array.from(lb.pointers.values());
        var distance = Math.max(1, Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y));
        lightboxSetZoomW(lb.pinch.zoomW * (distance / lb.pinch.distance), true);
        return;
      }
      if (!lb.drag || lb.drag.id !== e.pointerId) return;
      var dx = e.clientX - lb.drag.x;
      var dy = e.clientY - lb.drag.y;
      if (!lb.drag.moved && Math.hypot(dx, dy) < 4) return;
      lb.drag.moved = true;
      if (lb.zoomW > 0) {
        lb.pan = { x: lb.drag.panX + dx, y: lb.drag.panY + dy };
        lightboxApplyTransform();
      }
    });
    function lbEnd(e) {
      if (!lb.pointers.has(e.pointerId)) return;
      var drag = lb.drag && lb.drag.id === e.pointerId ? lb.drag : null;
      lb.pointers.delete(e.pointerId);
      if (lb.pointers.size < 2 && lb.pinch) {
        lightboxSetZoomW(lb.zoomW, false); // snap to ±30px grid
        lb.pinch = null;
      }
      if (drag && !(lb.zoomW > 0)) {
        var sdx = e.clientX - drag.x;
        var sdy = e.clientY - drag.y;
        if (drag.moved && Math.abs(sdx) > 50 && Math.abs(sdy) < 100) {
          lightboxNav(sdx < 0 ? 1 : -1);
        } else if (!drag.moved && Date.now() - drag.t < 400) {
          lightboxNav(1); // click → next (ImageLightbox-style)
        }
      }
      if (lb.drag && lb.drag.id === e.pointerId) lb.drag = null;
    }
    media.addEventListener('pointerup', lbEnd);
    media.addEventListener('pointercancel', function (e) {
      lb.pointers.delete(e.pointerId);
      lb.drag = null;
      lb.pinch = null;
    });
    media.addEventListener('dblclick', function () {
      if (lb.zoomW > 0) {
        lb.zoomW = 0;
        lb.pan = { x: 0, y: 0 };
        lightboxApplyTransform();
      } else {
        // Jump toward ~2× natural width
        var xform = el.querySelector('.tv-lb-xform');
        var mediaEl = zoomMediaEl(xform);
        var nat = mediaNaturalSize(mediaEl);
        if (!(lb.fitW > 0) && mediaEl) lb.fitW = mediaEl.offsetWidth || 0;
        lightboxSetZoomW(nat.w * 2, false);
      }
    });

    return el;
  }

  /** @param {number} w CSS px width  @param {boolean} [live] continuous pinch — skip 30px snap */
  function lightboxSetZoomW(w, live) {
    var xform = lb.el && lb.el.querySelector('.tv-lb-xform');
    var el = zoomMediaEl(xform);
    var nat = mediaNaturalSize(el);
    var prev = lb.zoomW > 0 ? lb.zoomW : (el && el.offsetWidth) || 0;
    var maxW = zoomMaxW(nat.w);
    var fit = lb.fitW > 0 ? lb.fitW : (el && el.offsetWidth) || 0;
    if (!(lb.fitW > 0) && fit > 0) lb.fitW = fit;
    var next = Math.round(Number(w) || 0);
    if (!live) next = snapZoomW(next, lb.fitW, maxW);
    else {
      next = Math.min(maxW, Math.max(0, next));
      if (next <= lb.fitW) next = 0;
    }
    lb.zoomW = next;
    if (!(lb.zoomW > 0)) { lb.zoomW = 0; lb.pan = { x: 0, y: 0 }; }
    else lb.pan = panAfterZoomW(lb.pan, prev, lb.zoomW, lb.fitW);
    lightboxApplyTransform();
  }
  function lightboxZoomBy(direction) {
    var xform = lb.el && lb.el.querySelector('.tv-lb-xform');
    var el = zoomMediaEl(xform);
    var prev = lb.zoomW > 0 ? lb.zoomW : (el && el.offsetWidth) || 0;
    var stepped = stepZoomW(el, lb.zoomW, lb.fitW, direction);
    if (stepped.zoomW === lb.zoomW && lb.zoomW > 0) return;
    if (!(stepped.zoomW > 0) && !(lb.zoomW > 0)) return;
    lb.fitW = stepped.fitW;
    lb.zoomW = stepped.zoomW;
    lb.pan = panAfterZoomW(lb.pan, prev, lb.zoomW, lb.fitW);
    lightboxApplyTransform();
  }
  function lightboxApplyTransform() {
    if (!lb.el) return;
    var xform = lb.el.querySelector('.tv-lb-xform');
    var badge = lb.el.querySelector('.tv-lb-badge');
    var media = lb.el.querySelector('.tv-lb-media');
    if (xform) {
      applyMediaZoom(xform, lb.zoomW, lb.pan, function (el) {
        if (el._tvZoomWait) return;
        el._tvZoomWait = true;
        var retry = function () { el._tvZoomWait = false; lightboxApplyTransform(); };
        el.addEventListener('load', retry, { once: true });
        el.addEventListener('loadeddata', retry, { once: true });
      });
    }
    if (badge) {
      badge.textContent = zoomBadgeText(zoomMediaEl(xform), lb.zoomW);
      badge.style.opacity = lb.zoomW > 0 ? '1' : '0';
    }
    if (media) {
      if (lb.zoomW > 0) media.setAttribute('data-zoomed', '');
      else media.removeAttribute('data-zoomed');
    }
  }

  function lightboxNav(dir) {
    if (!lb.open) return;
    // Same wrapping as desktop stepSlide — update stage first, then lightbox media.
    var fi = lb.fi;
    var list = slidesOf(fi);
    var next = slideIndex(fi) + dir;
    if (next >= 0 && next < list.length) {
      setSlideIndex(fi, next);
      selected = fi;
      lb.fi = fi;
      syncTourUi();
      if (isStackMode()) refreshFeatureCard(fi);
      else { renderNav(); renderStage(); }
      renderLightboxContent();
      if (tourMode === 'playing') scheduleAdvance();
      return;
    }
    var visible = visibleFeatures();
    if (!visible.length) return;
    var vi = visible.indexOf(features[fi] || feat());
    if (vi < 0) vi = 0;
    var ni = (vi + dir + visible.length) % visible.length;
    var nfi = features.indexOf(visible[ni]);
    var nSlides = slidesOf(nfi).length;
    setSlideIndex(nfi, dir < 0 ? Math.max(0, nSlides - 1) : 0);
    selected = nfi;
    lb.fi = nfi;
    syncTourUi();
    if (isStackMode()) { refreshFeatureCard(nfi); scrollSelectedCard(true); }
    else paint();
    renderLightboxContent();
    if (tourMode === 'playing') scheduleAdvance();
  }

  /** Stage may have advanced past catalog[0] via theme fallback — lightbox must follow. */
  function stageMediaEl(fi) {
    if (!elStage) return null;
    if (isStackMode()) {
      var card = elStage.querySelector('.feature-card[data-feat="' + fi + '"]');
      return card ? card.querySelector('.media-el') : null;
    }
    if (fi === selected) return elStage.querySelector('.stage-media .media-el');
    return null;
  }

  function pickLightboxMedia(m, fi) {
    var cands = m ? mediaCandidates(m) : [];
    var startI = 0;
    var src = '';
    // Reuse stage asset only when it belongs to THIS slide's candidates.
    // (lightboxNav used to render before the stage refreshed → sticky previous media.)
    var stageEl = stageMediaEl(fi);
    if (stageEl && cands.length) {
      var stageSrc = stageEl.currentSrc || stageEl.getAttribute('src') || '';
      var leaf = stageSrc.split('?')[0].split('/').pop();
      if (leaf) {
        for (var j = 0; j < cands.length; j++) {
          if ((cands[j].split('?')[0].split('/').pop()) === leaf) {
            startI = j;
            src = cands[j];
            break;
          }
        }
      }
    }
    if (!src && cands.length) {
      src = cands[0];
      startI = 0;
    }
    return { cands: cands, src: src, startI: startI };
  }

  /** Keep lightbox + stage on the same feature/slide. */
  function syncLightboxFromState() {
    if (!lb.open) return;
    lb.fi = selected;
    renderLightboxContent();
  }

  function renderLightboxContent() {
    ensureLightbox();
    var fi = lb.fi;
    var f = features[fi];
    var s = slideOf(fi);
    var list = slidesOf(fi);
    var si = slideIndex(fi);
    var xform = lb.el.querySelector('.tv-lb-xform');
    var title = lb.el.querySelector('.tv-lb-title');
    var desc = lb.el.querySelector('.tv-lb-desc');
    var count = lb.el.querySelector('.tv-lb-count');
    var prev = lb.el.querySelector('.tv-lb-prev');
    var next = lb.el.querySelector('.tv-lb-next');
    if (!f || !s || !xform) return;

    var m = s.media || {};
    var pick = pickLightboxMedia(m, fi);
    var src = pick.src;
    var isVid = src && (isVideoSrc(src) || m.type === 'video');
    var data = esc(JSON.stringify(pick.cands));
    var di = String(pick.startI || 0);
    if (isVid) {
      xform.innerHTML = '<video class="media-el tv-lb-el" data-fallback="' + data + '" data-i="' + di + '" src="' + esc(src) + '" controls playsinline autoplay preload="auto"></video>';
    } else if (src) {
      xform.innerHTML = '<img class="media-el tv-lb-el" data-fallback="' + data + '" data-i="' + di + '" src="' + esc(src) + '" alt="" draggable="false" decoding="async"/>';
    } else {
      xform.innerHTML = '<div class="empty-media">No media</div>';
    }
    bindMediaFallback(xform);

    var t = s.title || f.label || '';
    var d = s.description || f.description || '';
    title.textContent = t;
    desc.textContent = d;
    desc.hidden = !d;
    count.textContent = (si + 1) + ' / ' + Math.max(1, list.length) + (f.label ? ' · ' + f.label : '');

    var vis = visibleFeatures();
    var canNav = list.length > 1 || vis.length > 1;
    prev.hidden = !canNav;
    next.hidden = !canNav;

    lb.zoomW = 0;
    lb.fitW = 0;
    lb.pan = { x: 0, y: 0 };
    lightboxApplyTransform();
    syncTourUi();
    syncLightboxPlayback();
  }

  function syncLightboxPlayback() {
    if (!lb.open || !lb.el) return;
    var vid = lb.el.querySelector('video.tv-lb-el');
    if (!vid) return;
    if (tourMode === 'playing') {
      vid.muted = true;
      var p = vid.play();
      if (p && p.catch) p.catch(function () {});
    } else {
      try { vid.pause(); } catch (_) {}
    }
  }

  function openLightbox(fi) {
    if (fi == null || isNaN(fi)) fi = selected;
    lb.fi = fi;
    selected = fi;
    ensureLightbox();
    lb.el.setAttribute('data-theme', themeName());
    lb.open = true;
    lb.el.hidden = false;
    document.documentElement.classList.add('tv-lb-open');
    renderLightboxContent();
    syncTourUi();
    if (tourMode === 'playing') scheduleAdvance();
    playClick();
  }

  function closeLightbox() {
    if (!lb.open) return;
    lb.open = false;
    if (lb.el) lb.el.hidden = true;
    document.documentElement.classList.remove('tv-lb-open');
    lb.pointers && lb.pointers.clear();
    lb.drag = null;
    lb.pinch = null;
    syncTourUi();
    if (tourMode === 'playing') scheduleAdvance();
    else syncMediaPlayback();
  }

  function resolveThumbSlide(list, h, i) {
    if (typeof h.slide === 'number' && !isNaN(h.slide)) {
      return Math.max(0, Math.min(list.length - 1, h.slide));
    }
    if (h.slide != null && h.slide !== '') {
      var byId = list.findIndex(function (sl) { return sl.id === h.slide; });
      if (byId >= 0) return byId;
    }
    if (list.length <= 1) return 0;
    return Math.min(i, list.length - 1);
  }

  function featureBodyHtml(f, fi, opts) {
    opts = opts || {};
    var stack = !!opts.stack;
    var list = slidesOf(fi);
    var si = slideIndex(fi);
    var s = list[si] || list[0];
    if (!s) {
      return '<div class="stage-below"><p class="lead">No slides</p></div>';
    }
    var acts = s.actions || [];
    var catalogHl = list[0] && list[0].highlights;
    var thumbSource = (catalogHl && catalogHl.length)
      ? catalogHl.filter(isEnabled)
      : list.map(function (sl) {
          return { title: sl.title || f.label, text: sl.description || '', icon: f.icon, slide: sl.id };
        });
    var hl = thumbSource.map(function (h, i) {
      var target = resolveThumbSlide(list, h, i);
      var on = target === si;
      return '<button type="button" class="hl" data-feat="' + fi + '" data-slide="' + target + '" aria-current="' + (on ? 'true' : 'false') + '">' +
        '<span class="hl-ico" aria-hidden="true">' + icon(h.icon || f.icon) + '</span>' +
        '<span class="hl-body">' +
          '<strong>' + esc(h.title || '') + '</strong>' +
          (h.text ? '<span>' + esc(h.text) + '</span>' : '') +
        '</span></button>';
    }).join('');
    var btns = acts.map(function (a) {
      var cls = a.primary ? 'btn btn-primary' : 'btn btn-ghost';
      var href = a.href || '#';
      return '<a class="' + cls + '" href="' + esc(href) + '">' + esc(a.label || 'Action') + '</a>';
    }).join('');
    var slideTitle = s.title || '';
    var slideDesc = s.description || '';
    var mediaHeading = (f.label || slideTitle || slideDesc)
      ? '<div class="media-heading">' +
          (f.label ? '<div class="media-section">' + esc(f.label) + '</div>' : '') +
          (slideTitle ? '<h2 class="media-title">' + esc(slideTitle) + '</h2>' : '') +
          (slideDesc ? '<p class="media-desc">' + esc(slideDesc) + '</p>' : '') +
        '</div>'
      : '';
    var below = (f.description || hl)
      ? '<div class="stage-below">' +
          (f.description ? '<p class="lead">' + esc(f.description) + '</p>' : '') +
          (hl ? '<div class="highlights">' + hl + '</div>' : '') +
        '</div>'
      : '';
    var metrics = s.metrics || f.metrics || [];
    var metricsHtml = metrics.length
      ? '<div class="metrics">' + metrics.map(function (m) {
          return '<div class="metric"><b>' + esc(m.title || m.label || '') + '</b><span>' + esc(m.text || m.description || '') + '</span></div>';
        }).join('') + '</div>'
      : '';
    var prevLabel = stack ? '← Prev' : '← Previous';
    var nextLabel = 'Next →';
    var dots = list.length > 1
      ? '<div class="slide-dots">' + list.map(function (_, i) {
          return '<button type="button" data-feat="' + fi + '" data-slide="' + i + '" aria-current="' + (i === si ? 'true' : 'false') + '" aria-label="Slide ' + (i + 1) + '"></button>';
        }).join('') + '</div>'
      : '';
    var nav =
      '<div class="slide-nav">' +
        '<button type="button" data-feat-step="-1" data-feat="' + fi + '"' + (si <= 0 ? ' disabled' : '') + '>' + prevLabel + '</button>' +
        dots +
        '<button type="button" data-feat-step="1" data-feat="' + fi + '"' + (si >= list.length - 1 ? ' disabled' : '') + '>' + nextLabel + '</button>' +
      '</div>';
    var foot =
      '<div class="stage-foot">' +
        (stack ? '' : tourControlsHtml()) +
        nav +
      '</div>';
    return (
      '<div class="stage-body">' +
        '<div class="stage-main">' +
          mediaHeading +
          '<div class="stage-media">' + mediaHtml(s.media) + '</div>' +
          (btns ? '<div class="media-ctas"><div class="actions">' + btns + '</div></div>' : '') +
          below +
          metricsHtml +
        '</div>' +
      '</div>' +
      foot
    );
  }

  function renderStage() {
    var f = feat();
    if (!f) {
      elStage.innerHTML = '<div class="stage-below"><p class="lead">Select a feature</p></div>';
      return;
    }
    elStage.classList.remove('is-stack');
    elStage.innerHTML = featureBodyHtml(f, selected, { stack: false });
    syncTourUi();
    bindMediaFallback(elStage);
    bindLazyMedia(elStage);
    bindMediaZoom(elStage);
    if (tourMode === 'playing') scheduleAdvance();
    else syncMediaPlayback();
  }

  /** All visible features as scrollable cards; slides via buttons/swipe only. */
  function renderStack() {
    var visible = visibleFeatures();
    elStage.classList.add('is-stack');
    if (!visible.length) {
      elStage.innerHTML = '<div class="stack-empty"><p class="lead">No matches</p></div>';
      return;
    }
    var cards = visible.map(function (f) {
      var fi = features.indexOf(f);
      var cat = f.categoryLabel ? '<div class="feature-cat">' + esc(f.categoryLabel) + '</div>' : '';
      return (
        '<article class="feature-card" data-feat="' + fi + '" id="feature-' + fi + '">' +
          cat +
          featureBodyHtml(f, fi, { stack: true }) +
        '</article>'
      );
    }).join('');
    elStage.innerHTML =
      '<div class="stack-tour">' + tourControlsHtml() + '</div>' +
      '<div class="feature-stack">' + cards + '</div>';
    syncTourUi();
    elStage.querySelectorAll('.feature-card').forEach(function (card) {
      bindMediaFallback(card);
      bindLazyMedia(card);
      bindMediaZoom(card);
    });
    syncStackSelection();
    syncMediaPlayback();
    if (tourMode === 'playing') scheduleAdvance();
    scrollSelectedCard(false);
  }

  function syncStackSelection() {
    if (!isStackMode()) return;
    elStage.querySelectorAll('.feature-card').forEach(function (card) {
      var fi = Number(card.getAttribute('data-feat'));
      card.setAttribute('aria-current', fi === selected ? 'true' : 'false');
    });
  }

  function scrollSelectedCard(smooth) {
    if (!isStackMode()) return;
    syncStackSelection();
    var card = elStage.querySelector('.feature-card[data-feat="' + selected + '"]');
    if (!card) return;
    try {
      card.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'nearest' });
    } catch (e) {
      card.scrollIntoView(true);
    }
  }

  /** Patch one stack card after a slide change (keeps scroll position). */
  function refreshFeatureCard(fi) {
    var card = elStage.querySelector('.feature-card[data-feat="' + fi + '"]');
    var f = features[fi];
    if (!card || !f) return;
    var cat = f.categoryLabel ? '<div class="feature-cat">' + esc(f.categoryLabel) + '</div>' : '';
    card.innerHTML = cat + featureBodyHtml(f, fi, { stack: true });
    bindMediaFallback(card);
    bindLazyMedia(card);
    bindMediaZoom(card);
    if (fi === selected) syncMediaPlayback();
    reportHeightSoon();
  }

  function syncMediaPlayback() {
    // Pause all videos; play selected feature's video when touring
    elStage.querySelectorAll('video.media-el').forEach(function (vid) {
      var card = vid.closest('.feature-card');
      var fi = card ? Number(card.getAttribute('data-feat')) : selected;
      var active = fi === selected;
      if (tourMode === 'playing' && active) {
        hydrateMedia(vid);
        vid.muted = true;
        var p = vid.play();
        if (p && p.catch) p.catch(function () {});
      } else if (active) {
        hydrateMedia(vid);
      } else {
        try { vid.pause(); } catch (_) {}
      }
    });
  }

  function advanceTour() {
    if (tourMode !== 'playing') return;
    var list = slides();
    var si = slideIndex(selected);
    if (si < list.length - 1) {
      setSlideIndex(selected, si + 1);
      if (isStackMode()) refreshFeatureCard(selected);
      else if (!lb.open) paint();
      else { renderNav(); renderStage(); }
      syncLightboxFromState();
      if (tourMode === 'playing') scheduleAdvance();
      return;
    }
    var visible = visibleFeatures();
    if (!visible.length) return;
    var cur = feat();
    var vi = visible.indexOf(cur);
    var nextF = visible[(vi < 0 ? 0 : vi + 1) % visible.length];
    selected = features.indexOf(nextF);
    setSlideIndex(selected, 0);
    if (isStackMode()) {
      refreshFeatureCard(selected);
      scrollSelectedCard(true);
      syncTourUi();
      syncLightboxFromState();
      if (tourMode === 'playing') scheduleAdvance();
    } else if (!lb.open) {
      paint();
    } else {
      renderNav();
      renderStage();
      syncTourUi();
      syncLightboxFromState();
      if (tourMode === 'playing') scheduleAdvance();
    }
  }

  function scheduleAdvance() {
    clearTourTimer();
    if (tourMode !== 'playing') return;
    var gen = ++tourGen;
    var s = slide();
    if (!s) return;
    var kind = slideMediaKind(s);
    syncMediaPlayback();
    syncLightboxPlayback();

    if (kind === 'video') {
      var vid = null;
      if (lb.open && lb.el) vid = lb.el.querySelector('video.tv-lb-el');
      if (!vid) {
        var scope = elStage.querySelector('.feature-card[data-feat="' + selected + '"]') || elStage;
        vid = scope.querySelector('video.media-el');
      }
      if (!vid) {
        tourTimer = setTimeout(function () {
          if (gen !== tourGen || tourMode !== 'playing') return;
          advanceTour();
        }, IMAGE_MS);
        return;
      }
      hydrateMedia(vid);
      var onEnded = function () {
        vid.removeEventListener('ended', onEnded);
        if (gen !== tourGen || tourMode !== 'playing') return;
        advanceTour();
      };
      vid.addEventListener('ended', onEnded);
      if (vid.ended) {
        tourTimer = setTimeout(function () {
          if (gen !== tourGen || tourMode !== 'playing') return;
          advanceTour();
        }, 250);
      }
      return;
    }

    tourTimer = setTimeout(function () {
      if (gen !== tourGen || tourMode !== 'playing') return;
      advanceTour();
    }, IMAGE_MS);
  }

  function setTourMode(mode, opts) {
    if (mode !== 'playing' && mode !== 'paused' && mode !== 'stopped') return;
    clearIdleTimer();
    clearTourTimer();
    tourGen += 1;
    tourMode = mode;
    // Remember hard stop across reloads; play clears it. Pause is session-only.
    if (mode === 'stopped' || mode === 'playing') persistTourMode(mode);
    syncTourUi();
    if (!isStackMode()) renderNav();
    syncMediaPlayback();
    syncLightboxPlayback();
    if (mode === 'playing') scheduleAdvance();
    if (mode === 'paused' && opts && opts.idleResume) {
      setTourHints('Resumes in 2s if idle');
      idleTimer = setTimeout(function () {
        idleTimer = null;
        if (tourMode === 'paused') setTourMode('playing');
      }, IDLE_MS);
    } else if (mode === 'paused') {
      setTourHints('Paused · press play');
    }
  }

  function noteInteraction() {
    if (suppressIdle) return;
    if (tourMode === 'stopped') return;
    // Soft-pause on interaction; resume after idle. Stop stays off.
    setTourMode('paused', { idleResume: true });
  }

  function selectFeature(i, fromTour) {
    if (i < 0 || i >= features.length) return;
    if (!isEnabled(features[i])) return;
    selected = i;
    setSlideIndex(i, 0);
    if (!fromTour) noteInteraction();
    if (isStackMode()) {
      syncStackSelection();
      scrollSelectedCard(true);
      syncTourUi();
      syncMediaPlayback();
      if (tourMode === 'playing') scheduleAdvance();
    } else {
      paint();
    }
    syncLightboxFromState();
  }

  function setSlide(i, fromTour, fi) {
    if (fi == null) fi = selected;
    var n = slidesOf(fi).length;
    if (i < 0 || i >= n) return;
    setSlideIndex(fi, i);
    if (!fromTour) {
      selected = fi;
      noteInteraction();
    }
    if (isStackMode()) {
      refreshFeatureCard(fi);
      syncTourUi();
      if (tourMode === 'playing' && fi === selected) scheduleAdvance();
    } else {
      renderNav();
      renderStage();
    }
    syncLightboxFromState();
  }

  function paint() {
    document.documentElement.classList.toggle('tv-stack', isStackMode());
    var explore = document.querySelector('.tv-explore');
    if (explore) explore.classList.toggle('tv-stack', isStackMode());
    if (isStackMode()) {
      if (elNav) elNav.innerHTML = '';
      renderStack();
    } else {
      renderNav();
      renderStage();
    }
    reportHeightSoon();
  }

  elNav.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-i]');
    if (!btn) return;
    playClick();
    selectFeature(Number(btn.getAttribute('data-i')));
  });

  /** Step slides; in stack mode stay inside the feature. Desktop wraps to next/prev feature. */
  function stepSlide(dir, fi) {
    if (fi == null) fi = selected;
    var list = slidesOf(fi);
    if (!list.length) return;
    var next = slideIndex(fi) + dir;
    if (next >= 0 && next < list.length) {
      setSlide(next, false, fi);
      return;
    }
    if (isStackMode()) return; // clamp — scroll the page for other features
    var visible = visibleFeatures();
    if (!visible.length) return;
    var vi = visible.indexOf(features[fi] || feat());
    if (vi < 0) vi = 0;
    var ni = (vi + dir + visible.length) % visible.length;
    var nfi = features.indexOf(visible[ni]);
    var nSlides = slidesOf(nfi).length;
    setSlideIndex(nfi, dir < 0 ? Math.max(0, nSlides - 1) : 0);
    selected = nfi;
    noteInteraction();
    paint();
    syncLightboxFromState();
  }

  /**
   * Horizontal swipe → prev/next slide on that feature card only.
   * Vertical = page scroll. Skip when media zoomed.
   */
  function bindStageSwipe() {
    var THRESH = 56;
    var swipe = null;
    var axis = null;

    function ignoreTarget(t) {
      if (!(t instanceof Element)) return true;
      return Boolean(t.closest('button, a, input, select, textarea, .tour-controls, .slide-nav, .media-ctas, video'));
    }

    elStage.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (ignoreTarget(e.target)) return;
      if (e.target.closest('.stage-media[data-zoomed]')) return;
      var card = e.target.closest('.feature-card') || elStage;
      var fiAttr = card.getAttribute && card.getAttribute('data-feat');
      var fi = fiAttr != null ? Number(fiAttr) : selected;
      swipe = { id: e.pointerId, x: e.clientX, y: e.clientY, fi: fi, target: card };
      axis = null;
    });

    elStage.addEventListener('pointermove', function (e) {
      if (!swipe || e.pointerId !== swipe.id) return;
      var dx = e.clientX - swipe.x;
      var dy = e.clientY - swipe.y;
      if (!axis) {
        if (Math.hypot(dx, dy) < 12) return;
        axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
      }
      if (axis === 'x' && Math.abs(dx) > 8) {
        try { elStage.setPointerCapture(e.pointerId); } catch (_) {}
      }
    });

    function endSwipe(e) {
      if (!swipe || e.pointerId !== swipe.id) return;
      var dx = e.clientX - swipe.x;
      var dy = e.clientY - swipe.y;
      var fi = swipe.fi;
      var locked = axis;
      swipe = null;
      axis = null;
      try { elStage.releasePointerCapture(e.pointerId); } catch (_) {}
      if (locked === 'y') return;
      if (Math.abs(dx) < THRESH || Math.abs(dx) < Math.abs(dy) * 1.15) return;
      playClick();
      stepSlide(dx < 0 ? 1 : -1, fi);
    }

    elStage.addEventListener('pointerup', endSwipe);
    elStage.addEventListener('pointercancel', function (e) {
      if (swipe && e.pointerId === swipe.id) { swipe = null; axis = null; }
    });
  }
  bindStageSwipe();

  elStage.addEventListener('click', function (e) {
    var tourBtn = e.target.closest('.tour-controls [data-act]');
    if (tourBtn) {
      playClick();
      var act = tourBtn.getAttribute('data-act');
      suppressIdle = true;
      if (act === 'play') setTourMode('playing');
      else if (act === 'pause') setTourMode('paused');
      else if (act === 'stop') setTourMode('stopped');
      suppressIdle = false;
      return;
    }
    var stepBtn = e.target.closest('[data-feat-step]');
    if (stepBtn) {
      playClick();
      stepSlide(Number(stepBtn.getAttribute('data-feat-step')), Number(stepBtn.getAttribute('data-feat')));
      return;
    }
    var slideBtn = e.target.closest('[data-slide]');
    if (slideBtn) {
      playClick();
      var fi = slideBtn.getAttribute('data-feat');
      setSlide(Number(slideBtn.getAttribute('data-slide')), false, fi != null ? Number(fi) : selected);
      return;
    }
    if (e.target.closest('.stage-media')) noteInteraction();
  });

  elStage.addEventListener('wheel', function (e) {
    if (e.target.closest('.stage-media')) noteInteraction();
  }, { passive: true });

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      playClick();
      applyTheme(themeName() === 'dark' ? 'light' : 'dark', true);
    });
  }

  // Host iframe (pm-pics iframe-widget): embed layout + theme + height pump
  enableEmbedLayout();
  /** Host ThemeProvider toggles html.light / html.dark (TopNavigation). */
  function hostDocumentTheme() {
    try {
      var cl = document.documentElement.classList;
      if (cl.contains('dark')) return 'dark';
      if (cl.contains('light')) return 'light';
    } catch (e) { /* ignore */ }
    return null;
  }
  try {
    var qTheme = new URLSearchParams(location.search).get('theme');
    if (qTheme === 'light' || qTheme === 'dark') applyTheme(qTheme, false);
    else {
      var hostT = hostDocumentTheme();
      if (hostT) applyTheme(hostT, false);
    }
  } catch (e) { /* ignore */ }
  window.addEventListener('message', function (ev) {
    var d = ev && ev.data;
    if (!d || typeof d !== 'object') return;
    if (d.type === 'pm-theme' && (d.theme === 'light' || d.theme === 'dark')) {
      applyTheme(d.theme, false);
      reportHeightSoon();
    }
    if (d.type === 'pm-iframe-height-request') {
      reportHeightSoon();
    }
  });
  // Same-document HtmlWidget embed: follow host class changes without waiting on postMessage
  if (window.parent === window && typeof MutationObserver !== 'undefined') {
    var hostThemeMo = new MutationObserver(function () {
      var t = hostDocumentTheme();
      if (t && t !== themeName()) {
        applyTheme(t, false);
        reportHeightSoon();
      }
    });
    hostThemeMo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }
  if (typeof ResizeObserver !== 'undefined') {
    var roRoot = document.querySelector('.shell') || document.querySelector('.tv-explore') || document.body;
    if (roRoot) {
      var ro = new ResizeObserver(function () { reportHeightSoon(); });
      ro.observe(roRoot);
    }
  }
  window.addEventListener('load', reportHeightSoon);
  window.addEventListener('orientationchange', reportHeightSoon);
  try {
    var mqStack = window.matchMedia('(max-width:900px)');
    var onStackMq = function () { paint(); };
    if (mqStack.addEventListener) mqStack.addEventListener('change', onStackMq);
    else if (mqStack.addListener) mqStack.addListener(onStackMq);
  } catch (e) { /* ignore */ }
  // Images/videos settling after first paint
  document.querySelectorAll('img,video').forEach(function (el) {
    el.addEventListener('load', reportHeightSoon);
    el.addEventListener('loadeddata', reportHeightSoon);
  });

  document.addEventListener('keydown', function (e) {
    if (e.target.matches('input,textarea,select')) return;
    if (lb.open) {
      if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); noteInteraction(); lightboxNav(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); noteInteraction(); lightboxNav(1); }
      else if (e.key === ' ') {
        e.preventDefault();
        playClick();
        suppressIdle = true;
        if (tourMode === 'playing') setTourMode('paused');
        else setTourMode('playing');
        suppressIdle = false;
      }
      return;
    }
    // Don't steal page scroll/keys when embed is not focused
    var root = document.querySelector('.tv-explore');
    if (root && !root.contains(e.target) && !(document.activeElement && root.contains(document.activeElement))) {
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault(); playClick();
      if (isStackMode()) {
        var vis = visibleFeatures();
        var vi = vis.indexOf(feat());
        if (vi >= 0 && vi < vis.length - 1) selectFeature(features.indexOf(vis[vi + 1]));
      } else {
        selectFeature(Math.min(features.length - 1, selected + 1));
      }
    }
    else if (e.key === 'ArrowUp') {
      e.preventDefault(); playClick();
      if (isStackMode()) {
        var visU = visibleFeatures();
        var viU = visU.indexOf(feat());
        if (viU > 0) selectFeature(features.indexOf(visU[viU - 1]));
      } else {
        selectFeature(Math.max(0, selected - 1));
      }
    }
    else if (e.key === 'ArrowRight') { e.preventDefault(); playClick(); stepSlide(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); playClick(); stepSlide(-1); }
    else if (e.key === ' ') {
      e.preventDefault();
      playClick();
      if (tourMode === 'playing') setTourMode('paused');
      else setTourMode('playing');
    }
  });

  // default: first enabled feature in product.json order
  var prefer = features.findIndex(isEnabled);
  selected = prefer >= 0 ? prefer : 0;
  paint();
})();
