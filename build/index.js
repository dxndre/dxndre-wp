/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/main.js":
/*!************************!*\
  !*** ./assets/main.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! bootstrap */ "./node_modules/bootstrap/dist/js/bootstrap.esm.js");




function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }

// Overall scores use /10 internally; the five middle bands span 14% each.
var gymOverallBands = [{
  tone: 'maroon',
  label: 'Diabolical',
  range: '0–<15%',
  min: 0,
  width: 15,
  color: '#8c354b',
  emoji: '💩'
}, {
  tone: 'bad',
  label: 'Bad',
  range: '15–<29%',
  min: 1.5,
  width: 14,
  color: '#d85b70',
  emoji: '😡'
}, {
  tone: 'red',
  label: 'Poor',
  range: '29–<43%',
  min: 2.9,
  width: 14,
  color: '#ef8585',
  emoji: '👎🏾'
}, {
  tone: 'amber',
  label: 'Mixed',
  range: '43–<57%',
  min: 4.3,
  width: 14,
  color: '#e5a653',
  emoji: '🤷🏽‍♂️'
}, {
  tone: 'green',
  label: 'Positive',
  range: '57–<71%',
  min: 5.7,
  width: 14,
  color: '#82c995',
  emoji: '👍🏾'
}, {
  tone: 'great',
  label: 'Excellent',
  range: '71–<85%',
  min: 7.1,
  width: 14,
  color: '#6ed9c5',
  emoji: '🤩'
}, {
  tone: 'diamond',
  label: 'Outstanding',
  range: '85–100%',
  min: 8.5,
  width: 15,
  color: '#b9eaff',
  emoji: '💎'
}];
var gymOverallBand = function gymOverallBand(percentage) {
  return [].concat(gymOverallBands).reverse().find(function (band) {
    return percentage >= band.min * 10;
  }) || gymOverallBands[0];
};

// Progressive enhancement: original review content remains usable without JavaScript.
function initGymLeague(archive, cards) {
  var _archive$querySelecto, _archive$querySelecto2;
  var make = function make(tag, cls, text) {
    var el = document.createElement(tag);
    el.className = cls;
    if (text) el.textContent = text;
    return el;
  };
  var tone = function tone(value) {
    var n = Number(value);
    return value === '' || !Number.isFinite(n) || n < 0 ? 'unrated' : n >= 9 ? 'diamond' : n >= 7 ? 'green' : n >= 5 ? 'amber' : n >= 3 ? 'red' : 'maroon';
  };
  var bands = gymOverallBands;
  var overallBand = function overallBand(value) {
    var n = Number(value);
    return value === '' || !Number.isFinite(n) || n < 0 ? {
      tone: 'unrated',
      label: 'Not assessed',
      emoji: ''
    } : [].concat(bands).reverse().find(function (band) {
      return n >= band.min;
    });
  };
  var overallTone = function overallTone(value) {
    return overallBand(value).tone;
  };
  var ratingEmoji = Object.fromEntries(bands.map(function (band) {
    return [band.tone, band.emoji];
  }));
  ratingEmoji.unrated = '';
  var grid = archive.querySelector('[data-gyms-grid]');
  var header = make('header', 'league-heading');
  header.append(make('p', 'league-eyebrow', "THE GYM LEAGUE \xB7 ".concat(cards.length, " BRANCHES LOGGED")), make('h2', '', 'The full field.'), make('p', 'league-intro', 'Personally visited. Honestly rated. Find your next place to train.'));
  var watermark = make('span', 'league-watermark', String(cards.length));
  watermark.setAttribute('aria-hidden', 'true');
  header.append(watermark);
  var legend = make('div', 'league-legend');
  [].concat(bands).reverse().forEach(function (band) {
    var item = make('span', '', "".concat(band.range, " ").concat(band.label));
    item.dataset.tone = band.tone;
    legend.append(item);
  });
  legend.append(make('span', '', '— Not assessed / N/A Unavailable'));
  header.append(legend);
  var method = make('button', 'league-method-trigger', 'How I score gyms');
  method.type = 'button';
  method.setAttribute('aria-haspopup', 'dialog');
  method.setAttribute('aria-controls', 'league-scoring-guide');
  var guide = make('dialog', 'league-scoring-guide');
  guide.id = 'league-scoring-guide';
  guide.setAttribute('aria-labelledby', 'league-scoring-title');
  var close = make('button', 'league-scoring-close', 'Close ×');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close scoring guide');
  var title = make('h2', '', 'How I score gyms');
  title.id = 'league-scoring-title';
  guide.append(close, title, make('p', '', 'Ratings reflect my visits, membership tier and personal experience. The latest dated visit sets each branch’s league rating.'));
  guide.append(make('p', '', 'The overall percentage is a weighted average: gym ×2, wetside ×1.5, spa ×2, café / work ×1, cleanliness ×2.5 and parking ×1. Unassessed and unavailable facilities are excluded; zero is a scored result.'));
  guide.append(make('h3', '', 'Overall rating scale'));
  var scale = make('div', 'league-scale');
  scale.setAttribute('aria-hidden', 'true');
  bands.forEach(function (band) {
    var segment = make('span', '');
    segment.style.width = "".concat(band.width, "%");
    segment.style.backgroundColor = band.color;
    scale.append(segment);
  });
  var axis = make('div', 'league-scale-axis');
  axis.setAttribute('aria-hidden', 'true');
  [0, 25, 50, 75, 100].forEach(function (value) {
    var tick = make('span', '', "".concat(value, "%"));
    tick.style.left = "".concat(value, "%");
    axis.append(tick);
  });
  var key = make('ul', 'league-scale-key');
  [].concat(bands).reverse().forEach(function (band) {
    var row = make('li', '');
    var swatch = make('span', 'league-scale-swatch');
    swatch.style.backgroundColor = band.color;
    swatch.setAttribute('aria-hidden', 'true');
    row.append(swatch, make('span', '', "".concat(band.emoji, " ").concat(band.label)), make('span', 'league-scale-range', band.range));
    key.append(row);
  });
  guide.append(scale, axis, key, make('p', 'league-scoring-note', 'Individual category scores retain their own scale: Outstanding 9–10, Positive 7–<9, Mixed 5–<7, Poor 3–<5, Diabolical below 3.'));
  document.body.append(guide);
  method.addEventListener('click', function () {
    return guide.showModal();
  });
  close.addEventListener('click', function () {
    return guide.close();
  });
  guide.addEventListener('click', function (event) {
    if (event.target !== guide) return;
    var bounds = guide.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) guide.close();
  });
  guide.addEventListener('close', function () {
    return method.focus({
      preventScroll: true
    });
  });
  header.append(method);
  archive.prepend(header);
  (_archive$querySelecto = archive.querySelector('.gym-view-toggle')) === null || _archive$querySelecto === void 0 || _archive$querySelecto.remove();
  archive.querySelectorAll('.gym-filter-buttons button').forEach(function (b) {
    return b.setAttribute('aria-pressed', String(b.classList.contains('is-active')));
  });
  var tray = archive.querySelector('[data-gym-compare-bar]');
  if (tray) archive.append(tray);
  var layout = make('div', 'league-layout');
  grid.before(layout);
  var left = make('div', 'league-list-pane');
  layout.append(left);
  left.append(grid);
  (_archive$querySelecto2 = archive.querySelector('.gym-pagination')) === null || _archive$querySelecto2 === void 0 || _archive$querySelecto2.remove();
  var panel = make('aside', 'league-detail');
  panel.id = 'gym-branch-detail';
  panel.setAttribute('aria-label', 'Selected branch details');
  layout.append(panel);
  // Map assets load only when requested; list browsing needs no external map requests.
  var mapPane = make('div', 'league-map-pane');
  var mapStatus = make('p', 'league-map-status');
  mapStatus.setAttribute('role', 'status');
  var mapCanvas = make('div', 'league-map-canvas');
  mapCanvas.setAttribute('aria-label', 'Gym review locations');
  var mapChoices = make('div', 'league-map-choices');
  var mapChoiceCards = new Map();
  mapChoices.setAttribute('aria-label', 'Matching gym reviews');
  mapPane.append(mapStatus, mapCanvas, mapChoices);
  mapPane.hidden = true;
  left.append(mapPane);
  var switcher = make('div', 'league-view-switch');
  switcher.setAttribute('role', 'group');
  switcher.setAttribute('aria-label', 'Gym view');
  var listButton = make('button', '', 'List');
  var mapButton = make('button', '', 'Map');
  [listButton, mapButton].forEach(function (button) {
    button.type = 'button';
    switcher.append(button);
  });
  archive.querySelector('.filter-inputs').append(switcher);
  var mapView = false,
    mapInstance,
    mapMarkers,
    mapAssets,
    mapCards = [];
  var coordinates = function coordinates(card) {
    var _card$dataset$lat, _card$dataset$lng;
    var lat = Number(card.dataset.lat),
      lng = Number(card.dataset.lng);
    return (_card$dataset$lat = card.dataset.lat) !== null && _card$dataset$lat !== void 0 && _card$dataset$lat.trim() && (_card$dataset$lng = card.dataset.lng) !== null && _card$dataset$lng !== void 0 && _card$dataset$lng.trim() && Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? [lat, lng] : null;
  };
  var loadMapAssets = function loadMapAssets() {
    if (window.L) return Promise.resolve();
    if (mapAssets) return mapAssets;
    mapAssets = new Promise(function (resolve, reject) {
      var css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.append(css);
      var script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
    return mapAssets;
  };
  function renderLeagueMap() {
    if (!mapView) return;
    mapStatus.textContent = 'Loading map…';
    return loadMapAssets().then(function () {
      if (!mapView) return;
      if (!mapInstance) {
        mapInstance = window.L.map(mapCanvas, {
          scrollWheelZoom: false
        }).setView([54, -2], 5);
        var baseTiles = window.L.tileLayer('https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=cb1_49v4_1_6f4e11cc72c4a39104c6f6c9', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19
        }).addTo(mapInstance);
        baseTiles.on('tileerror', function () {
          mapStatus.textContent = 'Map background could not load. Check the CARTO key’s website restrictions; gym pins and reviews are still available.';
        });
        mapMarkers = window.L.layerGroup().addTo(mapInstance);
      }
      mapMarkers.clearLayers();
      mapChoices.replaceChildren();
      mapChoiceCards.clear();
      var points = [];
      mapCards.forEach(function (card) {
        var point = coordinates(card);
        var choice = make('button', 'league-map-choice');
        var info = make('span', 'league-map-choice-info');
        info.append(make('strong', '', card.dataset.branchLabel), make('small', '', "".concat(card.dataset.chainLabel).concat(point ? '' : ' · Pin unavailable')));
        var score = make('span', 'league-map-choice-score', card.dataset.overallLabel);
        score.dataset.tone = overallTone(card.dataset.overall);
        choice.append(info, score);
        choice.setAttribute('aria-pressed', String(card === selected));
        mapChoiceCards.set(choice, card);
        choice.type = 'button';
        choice.addEventListener('click', function () {
          select(card);
          if (point) mapInstance.setView(point, 13);
        });
        mapChoices.append(choice);
        if (!point) return;
        points.push(point);
        var pin = make('span', 'league-map-pin', card.dataset.overallLabel);
        pin.dataset.tone = overallTone(card.dataset.overall);
        var marker = window.L.marker(point, {
          title: "".concat(card.dataset.chainLabel, " \xB7 ").concat(card.dataset.branchLabel, ": ").concat(card.dataset.overallLabel),
          icon: window.L.divIcon({
            className: 'league-map-marker',
            html: pin.outerHTML,
            iconSize: [66, 30],
            iconAnchor: [33, 30]
          })
        }).addTo(mapMarkers);
        marker.bindTooltip(document.createTextNode("".concat(card.dataset.chainLabel, " \xB7 ").concat(card.dataset.branchLabel)));
        marker.on('click', function () {
          select(card);
          if (!media.matches) panel.scrollIntoView({
            block: 'start',
            behavior: reducedMotion.matches ? 'instant' : 'smooth'
          });
        });
      });
      var missing = mapCards.length - points.length;
      mapStatus.textContent = "".concat(points.length, " gyms on the map").concat(missing ? " \xB7 ".concat(missing, " without a pin") : '', ". Select a pin or branch below.");
      mapInstance.invalidateSize();
      if (points.length) mapInstance.fitBounds(points, {
        padding: [35, 35],
        maxZoom: 13
      });
    }).catch(function () {
      mapStatus.textContent = 'The map could not load. Please use List view and try again later.';
      mapAssets = null;
    });
  }
  function setLeagueView(useMap) {
    mapView = useMap;
    archive.classList.toggle('is-map-view', mapView);
    listButton.setAttribute('aria-pressed', String(!mapView));
    mapButton.setAttribute('aria-pressed', String(mapView));
    grid.hidden = mapView;
    mapPane.hidden = !mapView;
    place();
    renderLeagueMap();
  }
  listButton.addEventListener('click', function () {
    setLeagueView(false);
    archive.dispatchEvent(new Event('league-view-change'));
  });
  mapButton.addEventListener('click', function () {
    setLeagueView(true);
    archive.dispatchEvent(new Event('league-view-change'));
  });
  listButton.setAttribute('aria-pressed', 'true');
  mapButton.setAttribute('aria-pressed', 'false');
  var count = make('p', 'league-result-count');
  count.setAttribute('role', 'status');
  layout.before(count);
  var columns = make('div', 'league-columns');
  columns.setAttribute('aria-hidden', 'true');
  ['POS', 'BRANCH', 'OVERALL', 'COMPARE'].forEach(function (s) {
    return columns.append(make('span', '', s));
  });
  grid.prepend(columns);
  var selected = null;
  var media = window.matchMedia('(min-width: 992px)');
  var details = new Map();
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var animationFrame = 0;
  var pendingAnimation = null;
  var animationObserver = new IntersectionObserver(function (entries) {
    if (entries.some(function (entry) {
      return entry.isIntersecting;
    }) && pendingAnimation) {
      animationObserver.disconnect();
      var start = pendingAnimation;
      pendingAnimation = null;
      start();
    }
  }, {
    threshold: 0.15
  });
  function stopAnimation() {
    cancelAnimationFrame(animationFrame);
    animationObserver.disconnect();
    pendingAnimation = null;
  }
  function animateDetails(card) {
    stopAnimation();
    var total = panel.querySelector('.league-total');
    var target = Number(card.dataset.overall);
    var rated = card.dataset.overall !== '' && Number.isFinite(target) && target >= 0;
    var bars = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(panel.querySelectorAll('.dx-score-block[data-score] .dx-score-bar span'));
    var paint = function paint(progress) {
      if (rated) {
        var current = target * progress;
        total.querySelector('.league-total-number').textContent = progress === 1 ? card.dataset.overallLabel : "".concat((current * 10).toFixed(1), "%");
        total.dataset.tone = overallTone(current);
        total.querySelector('.league-total-emoji').textContent = overallBand(current).emoji;
        total.querySelector('.league-total-rating-label').textContent = overallBand(current).label;
      }
      bars.forEach(function (bar) {
        var block = bar.closest('[data-score]');
        var value = Number(block.dataset.score);
        block.dataset.tone = tone(value * progress);
        var label = block.querySelector('.dx-score-value');
        if (label) {
          label.setAttribute('aria-label', "".concat(value, "/10"));
          label.textContent = "".concat(progress === 1 ? value : Math.floor(value * progress), "/10");
        }
        bar.style.transform = "scaleX(".concat(Math.max(0, Math.min(1, value / 10)) * progress, ")");
      });
    };
    if (reducedMotion.matches) {
      paint(1);
      return;
    }
    paint(0);
    pendingAnimation = function pendingAnimation() {
      var started;
      var _tick = function tick(now) {
        if (reducedMotion.matches) {
          paint(1);
          return;
        }
        started !== null && started !== void 0 ? started : started = now;
        var fraction = Math.min(1, (now - started) / 1200);
        paint(1 - Math.pow(1 - fraction, 3));
        if (fraction < 1) animationFrame = requestAnimationFrame(_tick);
      };
      animationFrame = requestAnimationFrame(_tick);
    };
    animationObserver.observe(total);
  }
  // Hidden overflow on WordPress cover wrappers would otherwise capture sticky positioning.
  for (var parent = archive.parentElement; parent && parent !== document.documentElement; parent = parent.parentElement) {
    var style = getComputedStyle(parent);
    if (style.overflowX === 'hidden' || style.overflowY === 'hidden') parent.classList.add('league-sticky-ancestor');
  }
  var stickyHeaders = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(document.querySelectorAll('.navbar, #wpadminbar'));
  var updateStickyOffset = function updateStickyOffset() {
    var bottom = stickyHeaders.reduce(function (offset, el) {
      var position = getComputedStyle(el).position;
      return position === 'fixed' || position === 'sticky' ? Math.max(offset, el.getBoundingClientRect().bottom) : offset;
    }, 0);
    var safeTop = Math.max(16, bottom + 16);
    archive.style.setProperty('--league-sticky-safe-top', "".concat(safeTop, "px"));
    var height = panel.getBoundingClientRect().height;
    var available = Math.max(0, window.innerHeight - safeTop - 16);
    var centered = safeTop + Math.max(0, (available - height) / 2);
    archive.style.setProperty('--league-sticky-top', "".concat(centered, "px"));
  };
  var headerObserver = new ResizeObserver(updateStickyOffset);
  stickyHeaders.forEach(function (el) {
    return headerObserver.observe(el);
  });
  headerObserver.observe(panel);
  window.addEventListener('resize', updateStickyOffset, {
    passive: true
  });
  updateStickyOffset();
  var ranks = new Map((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(cards).sort(function (a, b) {
    return Number(b.dataset.overall) - Number(a.dataset.overall) || a.dataset.branch.localeCompare(b.dataset.branch);
  }).map(function (c, i) {
    return [c, i + 1];
  }));
  cards.forEach(function (card) {
    var _card$querySelector;
    var content = make('div', 'league-detail-content');
    if (card.dataset.featuredImage) {
      var image = make('img', 'league-detail-image');
      image.alt = '';
      image.setAttribute('aria-hidden', 'true');
      image.loading = 'lazy';
      image.decoding = 'async';
      image.src = card.dataset.featuredImage;
      var frame = make('div', 'league-detail-image-frame');
      frame.append(image);
      content.append(frame);
    }
    content.append(make('p', 'league-eyebrow', 'BRANCH DETAILS'), make('h3', '', card.dataset.branchLabel), make('p', 'league-detail-chain', card.dataset.chainLabel));
    var loc = card.querySelector('.dx-gym-card__subtitle');
    if (loc) {
      var _location = loc.cloneNode(true);
      var link = _location.querySelector('a');
      if (link) {
        link.href = card.dataset.mapsUrl || link.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.addEventListener('click', function (event) {
          return event.stopPropagation();
        });
      }
      content.append(_location);
    }
    var score = make('div', 'league-total');
    score.dataset.tone = overallTone(card.dataset.overall);
    var number = make('span', 'league-total-number', card.dataset.overallLabel);
    var emoji = make('span', 'league-total-emoji', ratingEmoji[overallTone(card.dataset.overall)]);
    emoji.setAttribute('aria-hidden', 'true');
    var badge = make('span', 'league-total-rating');
    badge.setAttribute('aria-hidden', 'true');
    badge.append(emoji, make('span', 'league-total-rating-label', overallBand(card.dataset.overall).label));
    score.append(number, badge);
    score.setAttribute('role', 'img');
    score.setAttribute('aria-label', "".concat(card.dataset.overallLabel, " overall rating, ").concat(overallBand(card.dataset.overall).label));
    content.append(score, make('p', 'league-total-label', 'OVERALL RATING'));
    var awards = make('div', 'league-awards');
    card.querySelectorAll('.dx-badge--rank,.dx-badge--category').forEach(function (b) {
      return awards.append(b.cloneNode(true));
    });
    content.append(awards);
    var scores = (_card$querySelector = card.querySelector('.dx-gym-card__scores')) === null || _card$querySelector === void 0 ? void 0 : _card$querySelector.cloneNode(true);
    if (scores) {
      scores.querySelectorAll('.dx-score-block').forEach(function (block) {
        var _block$dataset$score;
        block.dataset.tone = tone((_block$dataset$score = block.dataset.score) !== null && _block$dataset$score !== void 0 ? _block$dataset$score : '');
      });
      content.append(scores);
    }
    content.append(make('h4', 'league-notes-title', 'Field notes'));
    var notes = make('div', 'league-notes');
    var original = card.querySelector('[data-notes-panel]');
    if (original) notes.innerHTML = original.innerHTML;
    content.append(notes);
    content.append(make('p', 'league-visit', "Visited ".concat(card.dataset.visitedLabel, " \xB7 ").concat(card.dataset.membership)));
    var history = [];
    try {
      history = JSON.parse(card.dataset.visitHistory || '[]');
    } catch (_unused) {
      history = [];
    }
    if (history.length) {
      var visits = make('details', 'league-history');
      visits.append(make('summary', '', "Visit history \xB7 ".concat(history.length + 1, " reviews")));
      visits.append(make('p', 'league-visit', 'The latest dated visit sets the league rating. Earlier visits are retained below.'));
      history.forEach(function (visit) {
        var entry = make('article', 'league-history-entry');
        entry.append(make('h4', '', visit.date || 'Date not recorded'));
        var overall = make('strong', '', visit.overall === null ? 'Not assessed' : "".concat((visit.overall * 10).toFixed(1), "%"));
        overall.dataset.tone = overallTone(visit.overall === null ? '' : visit.overall);
        entry.append(overall);
        var list = make('dl', 'league-history-scores');
        Object.entries(visit.scores).forEach(function (_ref) {
          var _ref2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_ref, 2),
            label = _ref2[0],
            value = _ref2[1];
          list.append(make('dt', '', label), make('dd', '', value === null ? 'Not assessed' : value === 'unavailable' ? 'Unavailable' : "".concat(value, "/10")));
        });
        entry.append(list, make('p', '', visit.notes));
        var link = make('a', '', 'Read this visit ↗');
        link.href = visit.url;
        entry.append(link);
        visits.append(entry);
      });
      content.append(visits);
    }
    var review = make('a', 'league-review', 'Read full review ↗');
    review.href = card.dataset.link;
    content.append(review);
    details.set(card, content);
    var btn = make('button', 'league-select');
    btn.type = 'button';
    btn.setAttribute('aria-controls', panel.id);
    btn.setAttribute('aria-expanded', 'false');
    var info = make('span', 'league-row-info');
    info.append(make('strong', '', card.dataset.branchLabel), make('small', '', "".concat(card.dataset.chainLabel).concat(loc ? ' · ' + loc.textContent.replace('📍', '').trim() : '')));
    var value = make('strong', 'league-row-score', card.dataset.overallLabel);
    value.dataset.tone = overallTone(card.dataset.overall);
    btn.append(make('span', 'league-rank', String(ranks.get(card)).padStart(2, '0')), info, value);
    btn.addEventListener('click', function () {
      if (selected === card && !media.matches) {
        stopAnimation();
        selected = null;
        panel.hidden = true;
        syncSelection();
      } else select(card, true);
    });
    var compare = card.querySelector('[data-gym-compare-toggle]');
    if (compare) {
      compare.setAttribute('aria-label', "Compare ".concat(card.dataset.branchLabel));
      compare.querySelector('.label-add').textContent = '+';
      compare.querySelector('.label-remove').textContent = '✓';
    }
    card.prepend(btn);
  });
  function syncSelection() {
    mapChoiceCards.forEach(function (card, button) {
      return button.setAttribute('aria-pressed', String(card === selected));
    });
    cards.forEach(function (c) {
      c.classList.toggle('is-current', c === selected);
      c.querySelector('.league-select').setAttribute('aria-expanded', String(c === selected && !panel.hidden));
    });
  }
  function place() {
    if (selected && !panel.hidden) {
      if (media.matches || mapView) layout.append(panel);else selected.after(panel);
    } else layout.append(panel);
  }
  // Wait for the photograph before fading it in, including cached images.
  function revealDetailImage() {
    var image = panel.querySelector('.league-detail-image');
    if (!image) return;
    image.getAnimations().forEach(function (animation) {
      return animation.cancel();
    });
    image.style.opacity = '0';
    image.decode().then(function () {
      if (!panel.contains(image)) return;
      image.style.removeProperty('opacity');
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        image.animate([{
          opacity: 0,
          transform: 'scale(1)'
        }, {
          opacity: 0.66,
          transform: 'scale(1.04)'
        }], {
          duration: 400,
          easing: 'ease-out'
        });
      }
    }).catch(function () {
      // Keep the gold background when the photograph cannot load.
    });
  }
  function select(card) {
    var scrollToRow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    selected = card;
    panel.replaceChildren(details.get(card));
    panel.hidden = false;
    panel.scrollTop = 0;
    syncSelection();
    place();
    updateStickyOffset();
    animateDetails(card);
    revealDetailImage();
    if (scrollToRow && !media.matches && !mapView) {
      requestAnimationFrame(function () {
        if (selected !== card || panel.hidden) return;
        updateStickyOffset();
        var offset = parseFloat(archive.style.getPropertyValue('--league-sticky-safe-top')) || 16;
        window.scrollTo({
          top: Math.max(0, window.scrollY + card.getBoundingClientRect().top - offset),
          behavior: reducedMotion.matches ? 'instant' : 'smooth'
        });
      });
    }
  }
  media.addEventListener('change', place);
  archive.classList.add('is-premium-league');
  return {
    update: function update(ordered, visibleCount) {
      mapCards = ordered;
      renderLeagueMap();
      var shown = mapView ? ordered : ordered.slice(0, visibleCount);
      count.textContent = "".concat(shown.length, " of ").concat(ordered.length, " branches shown");
      if (!shown.length) {
        stopAnimation();
        selected = null;
        panel.hidden = true;
        syncSelection();
        place();
      } else if (!selected || !shown.includes(selected)) select(shown[0]);else place();
    }
  };
}

// Webpack Imports

(function (_document$querySelect5) {
  'use strict';

  // n
  // Navbar scroll state toggle
  function initNavbarScrolled() {
    var nav = document.querySelector('.navbar');
    if (!nav) return;
    var onScroll = function onScroll() {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    onScroll();
  }
  document.addEventListener('DOMContentLoaded', initNavbarScrolled);

  // Focus input if Searchform is empty
  [].forEach.call(document.querySelectorAll('.search-form'), function (el) {
    el.addEventListener('submit', function (e) {
      var search = el.querySelector('input');
      if (search.value.length < 1) {
        e.preventDefault();
        search.focus();
      }
    });
  });

  // Initialize Popovers
  var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap__WEBPACK_IMPORTED_MODULE_5__.Popover(popoverTriggerEl, {
      trigger: 'focus'
    });
  });
  document.addEventListener('DOMContentLoaded', function () {
    /* ==========================
       VIEWPORT-ACTIVE SECTIONS
    ========================== */

    var sections = document.querySelectorAll('section');
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.target.classList.contains('story-section') || entry.target.classList.contains('story-hero') || entry.target.querySelector('[data-gyms-archive]')) {
          return;
        }
        if (entry.isIntersecting) {
          entry.target.classList.add('viewport-active');
        } else {
          entry.target.classList.remove('viewport-active');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '-20% 0px -20% 0px'
    });
    sections.forEach(function (section) {
      return sectionObserver.observe(section);
    });

    /* ==========================
       STAT COUNTER ANIMATION
    ========================== */
    var counters = document.querySelectorAll('.stat-figure');
    var animateCounter = function animateCounter(el) {
      var raw = el.textContent.trim();
      var match = raw.match(/^(\d+(?:\.\d+)?)(.*)$/);
      if (!match) return;
      var target = parseFloat(match[1]);
      var suffix = match[2].trim(); // e.g. "KG", "+", "kg", etc.

      var startTime = null;
      var duration = 1800;
      var _tick2 = function tick(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var value = Math.floor(progress * target);
        el.textContent = "".concat(value).concat(suffix ? suffix : '');
        if (progress < 1) {
          requestAnimationFrame(_tick2);
        } else {
          el.textContent = "".concat(target).concat(suffix ? suffix : '');
        }
      };
      requestAnimationFrame(_tick2);
    };
    var counterObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.4
    });
    counters.forEach(function (counter) {
      return counterObserver.observe(counter);
    });

    /* ==========================
       BODY STATE: CLIENT JOURNEY
    ========================== */
    var body = document.body;
    var journeySection = document.querySelector('.client-journey');
    var techStackSection = document.querySelector('.tech-stack');
    if (journeySection) {
      var journeyObserver = new IntersectionObserver(function (_ref3) {
        var _ref4 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_ref3, 1),
          entry = _ref4[0];
        if (entry.isIntersecting) {
          body.classList.add('client-journey-section');
        } else {
          body.classList.remove('client-journey-section');
        }
      }, {
        threshold: 0.35
      });
      journeyObserver.observe(journeySection);
    }
    if (techStackSection) {
      var techStackObserver = new IntersectionObserver(function (_ref5) {
        var _ref6 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_ref5, 1),
          entry = _ref6[0];
        if (entry.isIntersecting) {
          body.classList.add('tech-stack-section');
        } else {
          body.classList.remove('tech-stack-section');
        }
      }, {
        threshold: 0.35
      });
      techStackObserver.observe(techStackSection);
    }
  });

  /* ==========================
  PROCESS STEP CYCLER (DEBUG MODE)
  ========================== */

  var processSteps = document.querySelectorAll('.process-step');
  if (processSteps.length) {
    var currentIndex = 0;

    // Clear any existing state
    processSteps.forEach(function (step) {
      return step.classList.remove('is-active');
    });

    // Activate first step
    processSteps[0].classList.add('is-active');
    setInterval(function () {
      // Remove active from current
      processSteps[currentIndex].classList.remove('is-active');

      // Move to next
      currentIndex = (currentIndex + 1) % processSteps.length;

      // Add active to next
      processSteps[currentIndex].classList.add('is-active');
    }, 5000);
  }
  var processTrack = document.querySelector('.process-area > .wp-block-group__inner-container');
  if (processTrack && processSteps.length) {
    var stepDistance = 400 + 160; // 400px step + ~10em gap
    var currentOffset = 0;
    setInterval(function () {
      currentOffset = (currentOffset + 1) % processSteps.length;
      processTrack.style.transform = "translateX(-".concat(currentOffset * stepDistance, "px)");
    }, 5000);
  }

  // Duplicate Footnotes at runtime

  document.addEventListener('DOMContentLoaded', function () {
    var tracks = document.querySelectorAll('.footline-track');
    if (!tracks.length) return;
    var DUPLICATES = 2;
    tracks.forEach(function (track) {
      var item = track.querySelector('.footline');
      if (!item) return;
      for (var i = 0; i < DUPLICATES; i++) {
        track.appendChild(item.cloneNode(true));
      }
    });
  });

  /* ==========================================================
  DXNDRE — CINEMATIC NAVIGATION CONTROLLER
  ========================================================== */

  function initDxndreNavigation() {
    var menu = document.getElementById('navbar');
    var toggle = document.getElementById('dx-menu-toggle');
    if (!menu || !toggle) return;

    // Prevent duplicate initialisation.
    if (menu.dataset.dxInitialized === 'true') return;
    menu.dataset.dxInitialized = 'true';
    var body = document.body;
    var focusableSelector = ['a[href]', 'button:not([disabled])', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])'].join(',');
    var previouslyFocused = null;
    var isOpen = false;
    var getFocusable = function getFocusable() {
      var controls = [].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(menu.querySelectorAll(focusableSelector)), (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(document.querySelectorAll('#header .dxndre-nav-left a, ' + '#header .dxndre-nav-left button, ' + '#header .dxndre-nav-left input, ' + '#header .dxndre-navbar-brand-centered')), [toggle]);
      return (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(new Set(controls)).filter(function (element) {
        var style = window.getComputedStyle(element);
        return element.getClientRects().length > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !element.closest('[inert]');
      });
    };
    var lockScroll = function lockScroll() {
      body.classList.add('nav-open');
    };
    var unlockScroll = function unlockScroll() {
      body.classList.remove('nav-open');
    };

    // Bootstrap starts opening.
    menu.addEventListener('show.bs.collapse', function () {
      delete menu.dataset.dxClosing;
      previouslyFocused = document.activeElement;
      isOpen = true;
      lockScroll();
      menu.removeAttribute('inert');
      menu.setAttribute('aria-hidden', 'false');
    });

    // Bootstrap completes opening.
    menu.addEventListener('shown.bs.collapse', function () {
      isOpen = true;
      var currentLink = menu.querySelector('.current-menu-item > a, ' + '.current_page_item > a');
      var firstLink = menu.querySelector('.dx-menu__list > li > a');
      var target = currentLink || firstLink;
      if (target) {
        target.focus({
          preventScroll: true
        });
      }
    });

    // Bootstrap starts closing.
    menu.addEventListener('hide.bs.collapse', function () {
      menu.dataset.dxClosing = 'true';
      isOpen = false;

      // Keep focus away from disappearing menu items.
      if (menu.contains(document.activeElement)) {
        toggle.focus({
          preventScroll: true
        });
      }
    });

    // Bootstrap completes closing.
    menu.addEventListener('hidden.bs.collapse', function () {
      isOpen = false;
      unlockScroll();
      menu.setAttribute('inert', '');
      menu.setAttribute('aria-hidden', 'true');
      var restoreFocus = previouslyFocused;
      if (restoreFocus && restoreFocus.isConnected && typeof restoreFocus.focus === 'function') {
        restoreFocus.focus({
          preventScroll: true
        });
      } else {
        toggle.focus({
          preventScroll: true
        });
      }
      previouslyFocused = null;
    });

    // Handle keyboard accessibility.
    document.addEventListener('keydown', function (event) {
      if (!isOpen) return;

      // Escape closes the menu.
      if (event.key === 'Escape') {
        event.preventDefault();
        var instance = bootstrap__WEBPACK_IMPORTED_MODULE_5__.Collapse.getOrCreateInstance(menu, {
          toggle: false
        });
        instance.hide();
        return;
      }

      // Trap focus inside navigation controls.
      if (event.key !== 'Tab') return;
      var focusable = getFocusable();
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      var currentIndex = focusable.indexOf(document.activeElement);
      if (event.shiftKey) {
        if (currentIndex <= 0) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (currentIndex === focusable.length - 1) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    // Close when navigating to a section on the same page.
    menu.querySelectorAll('a[href]').forEach(function (link) {
      link.addEventListener('click', function () {
        var destination = new URL(link.href, window.location.href);
        var current = new URL(window.location.href);
        var samePage = destination.origin === current.origin && destination.pathname === current.pathname && destination.search === current.search;
        if (!samePage) return;
        var instance = bootstrap__WEBPACK_IMPORTED_MODULE_5__.Collapse.getOrCreateInstance(menu, {
          toggle: false
        });
        instance.hide();
      });
    });

    // Ensure overlay is inaccessible while closed.
    if (!menu.classList.contains('show')) {
      menu.setAttribute('inert', '');
      menu.setAttribute('aria-hidden', 'true');
    } else {
      isOpen = true;
      lockScroll();
      menu.removeAttribute('inert');
      menu.setAttribute('aria-hidden', 'false');
    }

    // Safety net for returning from browser history.
    window.addEventListener('pageshow', function () {
      if (!menu.classList.contains('show')) {
        isOpen = false;
        unlockScroll();
        menu.setAttribute('inert', '');
        menu.setAttribute('aria-hidden', 'true');
      }
    });
  }
  document.addEventListener('DOMContentLoaded', initDxndreNavigation);

  // Client Dashboard Loading Test

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.body.classList.contains('page-dashboard')) return;

    // Dashboard-specific JS here
    console.log('Client dashboard loaded');
  });
  console.log('DX DASHBOARD JS LOADED');

  // Client Dashboard Request Update

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.body.classList.contains('page-dashboard')) return;

    // UX: if modal fails / Bootstrap not present, send them to fallback page
    var newTicketBtn = document.querySelector('[data-bs-target="#newTicketModal"]');
    if (newTicketBtn && typeof window.bootstrap === 'undefined') {
      newTicketBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = '/submit-ticket/';
      });
    }

    // Request update button UX-only (you can wire AJAX later)
    var requestBtn = document.querySelector('.request-update');
    if (requestBtn) {
      requestBtn.addEventListener('click', function () {
        requestBtn.textContent = 'Request Sent ✓';
        requestBtn.disabled = true;
        requestBtn.classList.add('is-disabled');
      });
    }
  });

  // AJAX Message posting for Client Portal status update agent

  var form = document.querySelector('.ticket-reply-form');
  if (form) {
    form.addEventListener('submit', /*#__PURE__*/function () {
      var _ref7 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee(e) {
        var data, res, html;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function (_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              e.preventDefault();
              data = new FormData(form);
              _context.next = 1;
              return fetch(form.action, {
                method: 'POST',
                body: data
              });
            case 1:
              res = _context.sent;
              _context.next = 2;
              return res.text();
            case 2:
              html = _context.sent;
              document.querySelector('.ticket-thread').insertAdjacentHTML('beforeend', html);
              form.reset();
            case 3:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function (_x) {
        return _ref7.apply(this, arguments);
      };
    }());
  }

  // Add image button for client portal support ticket form

  document.addEventListener('DOMContentLoaded', function () {
    var addBtn = document.querySelector('.add-image-btn');
    var fields = document.querySelectorAll('.ticket-image-field');
    if (!addBtn || !fields.length) return;
    var visibleCount = 1;
    addBtn.addEventListener('click', function () {
      if (visibleCount < fields.length) {
        fields[visibleCount].classList.remove('is-hidden');
        visibleCount++;
      }
      if (visibleCount >= fields.length) {
        addBtn.disabled = true;
        addBtn.textContent = 'Maximum images added';
      }
    });
  });

  // AJAX Tab Switching

  document.addEventListener('click', function (e) {
    var link = e.target.closest('.js-ticket-link');
    if (!link) return;
    e.preventDefault();
    console.log('Ticket clicked', link.dataset.ticketId);
    var ticketId = link.dataset.ticketId;
    var panel = document.querySelector('.dashboard-panel');
    console.log('Sending AJAX for ticket', ticketId);
    panel.classList.add('is-loading');
    var formData = new FormData();
    formData.append('action', 'dx_load_ticket_panel');
    formData.append('ticket_id', ticketId);
    formData.append('nonce', DX_DASHBOARD.nonce);
    fetch(DX_DASHBOARD.ajax_url, {
      method: 'POST',
      credentials: 'same-origin',
      body: formData
    }).then(function (res) {
      return res.json();
    }).then(function (res) {
      if (!res.success || !res.data.html) {
        panel.innerHTML = '<p>Unable to load ticket.</p>';
        return;
      }
      panel.innerHTML = res.data.html;
      panel.classList.remove('is-loading');
      document.querySelectorAll('.ticket').forEach(function (t) {
        return t.classList.remove('is-active');
      });
      link.closest('.ticket').classList.add('is-active');
    }).catch(function (err) {
      console.error('FETCH FAILED', err);
      panel.classList.remove('is-loading');
    });
  });

  // Tab JS for Client Portal

  document.addEventListener('click', function (e) {
    var tab = e.target.closest('.dashboard-tab[data-status]');
    if (!tab) return;
    var status = tab.dataset.status;
    document.querySelectorAll('.dashboard-tab').forEach(function (t) {
      return t.classList.remove('is-active');
    });
    tab.classList.add('is-active');
    document.querySelectorAll('.ticket').forEach(function (ticket) {
      var ticketStatus = ticket.dataset.status;
      if (status === 'open') {
        ticket.style.display = ticketStatus !== 'resolved' && ticketStatus !== 'cancelled' ? '' : 'none';
      } else {
        ticket.style.display = ticketStatus === status ? '' : 'none';
      }
    });
  });

  // Cancel Ticket

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.js-cancel-ticket');
    if (!btn) return;
    var ticketId = btn.dataset.ticketId;
    var input = document.getElementById('cancel-ticket-id');
    if (input) {
      input.value = ticketId;
    }
  });

  // Tab Switching using keyboard

  document.addEventListener('keydown', function (e) {
    if (!document.body.classList.contains('page-dashboard')) return;
    var tickets = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(document.querySelectorAll('.ticket'));
    var active = document.querySelector('.ticket.is-active');
    if (!active) return;
    var index = tickets.indexOf(active);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      index = Math.min(index + 1, tickets.length - 1);
      tickets[index].querySelector('.js-ticket-link').click();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      index = Math.max(index - 1, 0);
      tickets[index].querySelector('.js-ticket-link').click();
    }
  });

  // Make the panel load once
  document.addEventListener('DOMContentLoaded', function () {
    var first = document.querySelector('.js-ticket-link');
    if (first) {
      first.click();
    }
  });

  // Converting Gallery into carousel
  document.querySelectorAll('.wp-block-group.gallery').forEach(function (gallery) {
    var track = gallery.querySelector('.wp-block-gallery');
    if (!track) return;

    // Prevent double-init
    if (track.dataset.cloned) return;
    track.dataset.cloned = 'true';
    var slides = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(track.children);
    slides.forEach(function (slide) {
      track.appendChild(slide.cloneNode(true));
    });
  });

  // Duplicating Gallery Carousel

  document.querySelectorAll('.wp-block-group.gallery').forEach(function (gallery) {
    var track = gallery.querySelector('.wp-block-gallery');
    if (!track) return;

    // Prevent double backdrop creation
    if (gallery.querySelector('.gallery-backdrop')) return;

    // Clone the gallery
    var backdrop = track.cloneNode(true);

    // Mark + style hook
    backdrop.classList.add('gallery-backdrop');
    backdrop.setAttribute('aria-hidden', 'true');

    // Insert backdrop before the original
    track.parentNode.insertBefore(backdrop, track);

    // Ensure stacking context
    gallery.style.position = 'relative';
  });

  // Adding glowing backgrounds to all images via duplication and class additions
  document.querySelectorAll('#main section.about figure').forEach(function (figure) {
    var img = figure.querySelector('img');
    if (!img) return;

    // Prevent double cloning
    if (figure.dataset.backdrop === 'true') return;
    figure.dataset.backdrop = 'true';

    // Ensure positioning context
    figure.style.position = 'relative';

    // Clone image
    var backdrop = img.cloneNode(true);
    backdrop.classList.add('image-backdrop');
    backdrop.setAttribute('aria-hidden', 'true');

    // Insert behind original
    figure.insertBefore(backdrop, img);
  });

  // Homepage Bootstrap Modal (for identifying client)
  document.addEventListener('DOMContentLoaded', function () {
    var _document$querySelect, _document$querySelect2;
    var hireBtn = document.querySelector('.js-hire-me');
    if (!hireBtn) return;
    var hireModal = new bootstrap__WEBPACK_IMPORTED_MODULE_5__.Modal('#hireMeModal');
    var clientModal = new bootstrap__WEBPACK_IMPORTED_MODULE_5__.Modal('#clientModal');
    var recruiterModal = new bootstrap__WEBPACK_IMPORTED_MODULE_5__.Modal('#recruiterModal');
    hireBtn.addEventListener('click', function (e) {
      e.preventDefault();
      hireModal.show();
    });
    (_document$querySelect = document.querySelector('.js-client-path')) === null || _document$querySelect === void 0 || _document$querySelect.addEventListener('click', function () {
      hireModal.hide();
      setTimeout(function () {
        return clientModal.show();
      }, 200);
    });
    (_document$querySelect2 = document.querySelector('.js-recruiter-path')) === null || _document$querySelect2 === void 0 || _document$querySelect2.addEventListener('click', function () {
      hireModal.hide();
      setTimeout(function () {
        return recruiterModal.show();
      }, 200);
    });
  });

  // Auto-rotation of services tabs

  document.addEventListener('DOMContentLoaded', function () {
    var tabs = document.querySelectorAll('.services-nav .nav-link');
    if (!tabs.length) return;
    var index = 0;
    var interval = null;
    var ROTATION_DELAY = 8000; // 8s feels premium

    var activateTab = function activateTab(i) {
      tabs[i].click();
    };
    var startRotation = function startRotation() {
      interval = setInterval(function () {
        index = (index + 1) % tabs.length;
        activateTab(index);
      }, ROTATION_DELAY);
    };
    var stopRotation = function stopRotation() {
      clearInterval(interval);
      interval = null;
    };

    // Start rotation
    startRotation();

    // Pause on hover / interaction
    tabs.forEach(function (tab, i) {
      tab.addEventListener('mouseenter', stopRotation);
      tab.addEventListener('focus', stopRotation);
      tab.addEventListener('mouseleave', function () {
        index = i;
        startRotation();
      });
      tab.addEventListener('click', function () {
        index = i;
      });
    });

    // const isTouch = window.matchMedia('(pointer: coarse)').matches;

    // if (!isTouch) {
    // startRotation();
    // }

    // Duplicating Services Tab images for glowing backdrop effect

    document.querySelectorAll('.service-image.foreground').forEach(function (img) {
      // Prevent duplicate cloning
      if (img.dataset.hasBackdrop) return;
      var clone = img.cloneNode(true);
      clone.classList.remove('foreground');
      clone.classList.add('background');
      clone.setAttribute('aria-hidden', 'true');
      clone.loading = 'eager';
      img.dataset.hasBackdrop = 'true';
      img.parentNode.insertBefore(clone, img);
    });
  });

  // Projects Marquee

  (function () {
    var marquee = document.querySelector('.projects-marquee');
    var track = marquee === null || marquee === void 0 ? void 0 : marquee.querySelector('.marquee-track');
    if (!track) return;

    // Duplicate content for seamless loop
    var items = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(track.children);
    items.forEach(function (item) {
      return track.appendChild(item.cloneNode(true));
    });
    var position = 0;
    var speed = 0.6; // base speed
    var targetSpeed = speed;
    function animate() {
      position -= targetSpeed;
      var resetPoint = track.scrollWidth / 2;
      if (Math.abs(position) >= resetPoint) {
        position = 0;
      }
      track.style.transform = "translate3d(".concat(position, "px,0,0)");

      // Smooth easing toward target speed
      targetSpeed += (speed - targetSpeed) * 0.08;
      requestAnimationFrame(animate);
    }
    marquee.addEventListener('mouseenter', function () {
      speed = 0.05; // slow glide instead of stop
    });
    marquee.addEventListener('mouseleave', function () {
      speed = 0.6;
    });
    animate();
  })();

  // Previous modal back button functionality

  document.addEventListener('click', function (e) {
    var backBtn = e.target.closest('.modal-back');
    if (!backBtn) return;
    var targetModal = backBtn.dataset.backTo;
    var currentModal = backBtn.closest('.modal');
    if (!targetModal || !currentModal) return;
    var currentInstance = bootstrap__WEBPACK_IMPORTED_MODULE_5__.Modal.getInstance(currentModal);
    currentInstance.hide();
    var nextModalEl = document.querySelector(targetModal);
    var nextInstance = new bootstrap__WEBPACK_IMPORTED_MODULE_5__.Modal(nextModalEl);
    nextInstance.show();
  });

  // Make sure only mone modal is open at a time

  document.addEventListener('DOMContentLoaded', function () {
    var _document$querySelect3, _document$querySelect4;
    // -----------------------------
    // Modal controller
    // -----------------------------
    function showModalSafely(targetSelector) {
      var openModals = document.querySelectorAll('.modal.show');
      if (openModals.length) {
        var remaining = openModals.length;
        openModals.forEach(function (modal) {
          var instance = bootstrap__WEBPACK_IMPORTED_MODULE_5__.Modal.getInstance(modal);
          if (!instance) {
            remaining--;
            return;
          }
          modal.addEventListener('hidden.bs.modal', function () {
            remaining--;
            if (remaining === 0) {
              openTargetModal(targetSelector);
            }
          }, {
            once: true
          });
          instance.hide();
        });
      } else {
        openTargetModal(targetSelector);
      }
    }
    function openTargetModal(targetSelector) {
      var modalEl = document.querySelector(targetSelector);
      if (!modalEl) return;

      // 👇 Check if this is YOUR gym modal
      var isGymModal = modalEl.classList.contains('dx-gym-share-modal');
      var modal = bootstrap__WEBPACK_IMPORTED_MODULE_5__.Modal.getOrCreateInstance(modalEl, {
        backdrop: isGymModal ? false : 'static',
        focus: true
      });

      // 🔥 ONLY run custom backdrop logic for gym modal
      if (isGymModal) {
        var archiveSection = document.querySelector('[data-gyms-archive]');
        if (archiveSection) {
          archiveSection.querySelectorAll('.modal-backdrop').forEach(function (el) {
            return el.remove();
          });
          var backdrop = document.createElement('div');
          backdrop.className = 'modal-backdrop fade show';
          archiveSection.appendChild(backdrop);
          backdrop.addEventListener('click', function () {
            return modal.hide();
          });
        }
        modalEl.addEventListener('hidden.bs.modal', function () {
          document.querySelectorAll('[data-gyms-archive] .modal-backdrop').forEach(function (el) {
            return el.remove();
          });
        }, {
          once: true
        });
      }
      modal.show();
    }

    // -----------------------------
    // Step 2: Navigation bindings
    // -----------------------------

    // Client path
    (_document$querySelect3 = document.querySelector('.js-client-path')) === null || _document$querySelect3 === void 0 || _document$querySelect3.addEventListener('click', function () {
      showModalSafely('#clientModal');
    });

    // Recruiter path
    (_document$querySelect4 = document.querySelector('.js-recruiter-path')) === null || _document$querySelect4 === void 0 || _document$querySelect4.addEventListener('click', function () {
      showModalSafely('#recruiterModal');
    });

    // Back buttons (delegated)
    document.addEventListener('click', function (e) {
      var backBtn = e.target.closest('.modal-back');
      if (!backBtn) return;
      var target = backBtn.dataset.backTo;
      if (!target) return;
      showModalSafely(target);
    });

    // -----------------------------
    // Step 3: Cleanup safety net
    // -----------------------------
    document.addEventListener('hidden.bs.modal', function () {
      document.body.classList.remove('modal-open');
      document.querySelectorAll('.modal-backdrop').forEach(function (b) {
        return b.remove();
      });
    });
  });

  // Gallery marquee for Portfolio page

  document.querySelectorAll('.gallery-marquee').forEach(function (marquee) {
    var track = marquee.querySelector('.gallery-track');
    if (!track) return;
    var galleries = track.querySelectorAll('.wp-block-gallery');
    if (galleries.length < 2) return;
    var position = 0;
    var speed = 0.5; // gallery pace (slower than projects)
    var paused = false;
    var galleryWidth = galleries[0].offsetWidth;
    function animate() {
      if (!paused) {
        position -= speed;

        // seamless loop
        if (Math.abs(position) >= galleryWidth) {
          position += galleryWidth;
        }
        track.style.transform = "translate3d(".concat(position, "px, 0, 0)");
      }
      requestAnimationFrame(animate);
    }

    // Pause on hover
    marquee.addEventListener('mouseenter', function () {
      return paused = true;
    });
    marquee.addEventListener('mouseleave', function () {
      return paused = false;
    });

    // Pause when off-screen
    var observer = new IntersectionObserver(function (entries) {
      paused = !entries[0].isIntersecting;
    }, {
      threshold: 0.15
    });
    observer.observe(marquee);
    animate();
  });
  function initSmartSearchSuggestions() {
    var _params$get;
    var suggestionsEl = document.querySelector('.search-suggestions');
    if (!suggestionsEl || suggestionsEl.dataset.enhance !== 'true') return;
    var searchInput = document.querySelector('input[type="search"]');
    var params = new URLSearchParams(window.location.search);
    var query = (searchInput === null || searchInput === void 0 ? void 0 : searchInput.value.trim()) || ((_params$get = params.get('s')) === null || _params$get === void 0 ? void 0 : _params$get.trim());
    if (!query) return;
    fetch("/wp-json/wp/v2/search?search=".concat(encodeURIComponent(query))).then(function (res) {
      return res.json();
    }).then(function (results) {
      if (!Array.isArray(results) || !results.length) return;
      var seen = new Set();
      var fragment = document.createDocumentFragment();
      results.slice(0, 6).forEach(function (item, index) {
        if (!item.title || seen.has(item.title)) return;
        seen.add(item.title);
        var li = document.createElement('li');
        li.style.setProperty('--delay', index);
        li.innerHTML = "\n\t\t\t\t\t\t<a href=\"".concat(item.url, "\" class=\"search-suggestion\">\n\t\t\t\t\t\t\t<span class=\"suggestion-type\">\n\t\t\t\t\t\t\t\t").concat(item.subtype.replace('-', ' '), "\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<div class=\"suggestion-content\">\n\t\t\t\t\t\t\t\t<span class=\"suggestion-label\">").concat(item.title, "</span>\n\t\t\t\t\t\t\t\t<span class=\"suggestion-arrow\">\u2192</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t");
        fragment.appendChild(li);
      });
      if (!fragment.childNodes.length) return;
      suggestionsEl.innerHTML = '';
      suggestionsEl.appendChild(fragment);
      suggestionsEl.classList.add('is-visible');
    }).catch(function () {
      // silent fail
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    // Initialise search suggestions
    initSmartSearchSuggestions();

    // Visibility listener for Homepage Hero inner content
    var hero = document.querySelector('.cover-content');
    if (!hero) return;
    requestAnimationFrame(function () {
      hero.classList.add('is-revealed');
    });
  });

  /* ==========================
  CASE STUDY: STORY CONTROLLER (SIMPLIFIED)
  ========================== */

  function initStoryController() {
    var _nav$querySelector;
    var sections = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(document.querySelectorAll('.story-section'));
    var nav = document.querySelector('.chapter-selector');
    if (!sections.length || !nav || document.body.dataset.storyInit) return;
    document.body.dataset.storyInit = 'true';
    document.documentElement.classList.add('case-study-document');
    var backgrounds = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(document.querySelectorAll('.story-backgrounds .bg'));
    var links = sections.map(function (section, i) {
      var _chapter$querySelecto;
      var chapter = section.querySelector('.cs-chapter');
      if (!chapter.id) chapter.id = 'chapter-' + (i + 1);
      var li = document.createElement('li'),
        a = document.createElement('a');
      a.href = '#' + chapter.id;
      a.textContent = String(i + 1).padStart(2, '0');
      a.setAttribute('aria-label', ((_chapter$querySelecto = chapter.querySelector('h2')) === null || _chapter$querySelecto === void 0 ? void 0 : _chapter$querySelecto.textContent) || 'Chapter ' + (i + 1));
      a.title = a.getAttribute('aria-label');
      a.addEventListener('click', function (event) {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        section.scrollIntoView({
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
        });
        history.replaceState(null, '', a.hash);
      });
      li.append(a);
      return {
        li: li,
        a: a,
        id: chapter.id
      };
    });
    (_nav$querySelector = nav.querySelector('ul')).replaceChildren.apply(_nav$querySelector, (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(links.map(function (link) {
      return link.li;
    })));
    sections.forEach(function (section) {
      return section.querySelectorAll('.cs-panel-track').forEach(function (track) {
        var hint = document.createElement('p');
        hint.className = 'cs-card-hint';
        hint.textContent = 'Swipe or scroll across to explore →';
        track.before(hint);
        track.tabIndex = 0;
        track.setAttribute('role', 'region');
        track.setAttribute('aria-label', 'Chapter cards — scroll horizontally to explore');
      });
    });
    var queued = false;
    function update() {
      queued = false;
      var active = sections.findIndex(function (section) {
        var r = section.getBoundingClientRect();
        return r.top <= innerHeight / 2 && r.bottom > innerHeight / 2;
      });
      document.body.classList.toggle('is-in-chapters', active >= 0);
      nav.inert = active < 0;
      nav.setAttribute('aria-hidden', String(active < 0));
      if (active < 0) return;
      sections.forEach(function (section, i) {
        return section.classList.toggle('viewport-active', i === active);
      });
      links.forEach(function (_ref8, i) {
        var li = _ref8.li,
          a = _ref8.a;
        li.classList.toggle('is-active', i === active);
        if (i === active) a.setAttribute('aria-current', 'location');else a.removeAttribute('aria-current');
      });
      backgrounds.forEach(function (bg) {
        return bg.classList.toggle('is-active', bg.dataset.bg === links[active].id);
      });
    }
    var schedule = function schedule() {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', schedule, {
      passive: true
    });
    window.addEventListener('resize', schedule, {
      passive: true
    });
    window.addEventListener('pageshow', schedule);
    update();
  }
  document.addEventListener('DOMContentLoaded', initStoryController);
  window.addEventListener('pageshow', initStoryController);

  /* ==========================
  PROJECTS ARCHIVE
  ========================== */

  (function () {
    var archive = document.querySelector('[data-projects-archive]');
    if (!archive) return;
    var grid = archive.querySelector('[data-projects-grid]');
    var search = archive.querySelector('[data-project-search]');
    var filterButtons = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(archive.querySelectorAll('.project-filter-buttons button'));
    var titleEl = archive.querySelector('[data-projects-state-title]');
    var emptyEl = archive.querySelector('[data-projects-empty]');
    if (!grid) return;
    var allCards = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(grid.querySelectorAll('.project-card'));
    var activeMode = 'filter';
    var activeValue = 'all';
    var LABELS = {
      all: 'All',
      design: 'Design',
      development: 'WordPress',
      static: 'Static',
      shopify: 'Shopify',
      freelance: 'Freelance',
      commercial: 'Commercial'
    };
    var updateTitle = function updateTitle() {
      if (!titleEl) return;
      titleEl.textContent = LABELS[activeValue] || 'All';
    };
    var matchesFilter = function matchesFilter(card) {
      if (activeValue === 'all') return true;
      if (activeMode === 'filter') {
        var types = (card.getAttribute('data-type') || '').split(/\s+/).map(function (value) {
          return value.trim();
        }).filter(Boolean);
        return types.includes(activeValue);
      }
      if (activeMode === 'context') {
        return (card.getAttribute('data-context') || '') === activeValue;
      }
      return true;
    };
    var update = function update() {
      var q = ((search === null || search === void 0 ? void 0 : search.value) || '').trim().toLowerCase();
      var visibleCount = 0;
      allCards.forEach(function (card) {
        var haystack = (card.getAttribute('data-search') || '').toLowerCase();
        var searchOk = !q || haystack.includes(q);
        var filterOk = matchesFilter(card);
        var show = searchOk && filterOk;
        card.hidden = !show;
        if (show) {
          visibleCount++;
        }
      });
      if (emptyEl) {
        emptyEl.hidden = visibleCount !== 0;
      }
      var count = archive.querySelector('[data-projects-count]');
      if (count) count.textContent = String(visibleCount);
      var countLabel = archive.querySelector('[data-projects-count-label]');
      if (countLabel) countLabel.textContent = visibleCount === 1 ? 'project' : 'projects';
      filterButtons.forEach(function (button) {
        return button.setAttribute('aria-pressed', String(button.classList.contains('is-active')));
      });
      updateTitle();
    };
    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        filterButtons.forEach(function (btn) {
          return btn.classList.remove('is-active');
        });
        button.classList.add('is-active');
        if (button.hasAttribute('data-filter')) {
          activeMode = 'filter';
          activeValue = button.getAttribute('data-filter') || 'all';
        } else if (button.hasAttribute('data-context')) {
          activeMode = 'context';
          activeValue = button.getAttribute('data-context') || 'all';
        }
        update();
      });
    });
    search === null || search === void 0 || search.addEventListener('input', update);
    update();
  })();

  /* ==========================
  GYMS ARCHIVE
  ========================== */

  (function (_buttons$find2, _archive$querySelecto3) {
    var archive = document.querySelector('[data-gyms-archive]');
    if (!archive) return;
    var grid = archive.querySelector('[data-gyms-grid]');
    var search = archive.querySelector('[data-gym-search]');
    var sortSel = archive.querySelector('[data-gym-sort]');
    var buttons = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(archive.querySelectorAll('.gym-filter-buttons button'));
    var viewBtns = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(archive.querySelectorAll('[data-gym-view]'));
    var titleEl = archive.querySelector('[data-gyms-state-title]');
    var emptyEl = archive.querySelector('[data-gyms-empty]');
    var loadMore = archive.querySelector('[data-gyms-load-more]');
    var compareBar = archive.querySelector('[data-gym-compare-bar]');
    var compareCount = archive.querySelector('[data-gym-compare-count]');
    var compareSelected = archive.querySelector('[data-gym-compare-selected]');
    var compareTrigger = archive.querySelector('[data-gym-compare-trigger]');
    var compareClear = archive.querySelector('[data-gym-compare-clear]');
    var compareShareButtons = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(archive.querySelectorAll('[data-gym-compare-share]'));
    var comparison = archive.querySelector('[data-gym-comparison]');
    var comparisonTable = archive.querySelector('[data-gym-comparison-table]');
    var comparisonClose = archive.querySelector('[data-gym-compare-close]');
    var comparisonMapEl = archive.querySelector('[data-gym-comparison-map]');
    var sharePanel = archive.querySelector('[data-gym-share-panel]');
    var shareInput = archive.querySelector('[data-gym-share-input]');
    var shareStatus = archive.querySelector('[data-gym-share-status]');
    var shareCopyBtn = archive.querySelector('[data-gym-share-copy]');
    var shareCloseBtn = archive.querySelector('[data-gym-share-close]');
    if (!grid) return;
    var allCards = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(grid.querySelectorAll('[data-gym-card]'));
    var league = initGymLeague(archive, allCards);
    var LABELS = {
      all: 'All',
      davidlloyds: 'David Lloyd',
      puregym: 'PureGym',
      fitnessfirst: 'Fitness First',
      gymbox: 'Gymbox',
      virginactive: 'Virgin Active',
      bodyworks: 'Bodyworks Gym',
      thegymgroup: 'The Gym Group',
      other: 'Other'
    };
    var assessedAmenities = new Set();
    var amenities = document.createElement('fieldset');
    amenities.className = 'league-amenity-filters';
    var amenityLegend = document.createElement('legend');
    amenityLegend.textContent = 'Assessed amenities';
    amenities.append(amenityLegend);
    var amenityOptions = [['gymScore', 'Gym'], ['swimScore', 'Swimming & Wetside Facilities'], ['cafeScore', 'Café & Work Area'], ['spaScore', 'Spa Retreat / Sauna Facilities']];
    amenityOptions.forEach(function (_ref9) {
      var _ref0 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_ref9, 2),
        key = _ref0[0],
        label = _ref0[1];
      var option = document.createElement('label');
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.value = key;
      input.addEventListener('change', function () {
        if (input.checked) assessedAmenities.add(key);else assessedAmenities.delete(key);
        visibleCount = 10;
        update();
      });
      option.append(input, document.createTextNode(label));
      amenities.append(option);
    });
    var toolbar = archive.querySelector('.filter-inputs');
    var filterDisclosure = document.createElement('details');
    filterDisclosure.className = 'league-filter-disclosure';
    var filterSummary = document.createElement('summary');
    filterSummary.textContent = 'Filters';
    var filterPanel = document.createElement('div');
    filterPanel.className = 'league-filter-panel';
    var chainTitle = document.createElement('p');
    chainTitle.textContent = 'Gym chains';
    var resetFilters = document.createElement('button');
    resetFilters.type = 'button';
    resetFilters.textContent = 'Clear filters';
    resetFilters.addEventListener('click', function () {
      var _buttons$find;
      assessedAmenities.clear();
      amenities.querySelectorAll('input').forEach(function (input) {
        input.checked = false;
      });
      (_buttons$find = buttons.find(function (button) {
        return button.dataset.chain === 'all';
      })) === null || _buttons$find === void 0 || _buttons$find.click();
    });
    filterPanel.append(chainTitle, archive.querySelector('.gym-filter-buttons'), amenities, resetFilters);
    filterDisclosure.append(filterSummary, filterPanel);
    toolbar.append(filterDisclosure);
    filterDisclosure.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        filterDisclosure.open = false;
        filterSummary.focus();
      }
    });
    document.addEventListener('click', function (event) {
      if (!filterDisclosure.contains(event.target)) filterDisclosure.open = false;
    });
    var activeChain = ((_buttons$find2 = buttons.find(function (btn) {
      return btn.classList.contains('is-active');
    })) === null || _buttons$find2 === void 0 ? void 0 : _buttons$find2.dataset.chain) || 'all';
    var visibleCount = 10;
    var selectedGyms = [];
    var compareMap = null;
    var compareMarkers = [];
    var getBranch = function getBranch(el) {
      return (el.getAttribute('data-branch') || '').trim().toLowerCase();
    };
    var getOverall = function getOverall(el) {
      return parseFloat(el.getAttribute('data-overall')) || 0;
    };
    var getVisitedTs = function getVisitedTs(el) {
      return parseInt(el.getAttribute('data-visited-ts'), 10) || 0;
    };
    var updateTitle = function updateTitle() {
      if (!titleEl) return;
      var label = LABELS[activeChain] || 'All';
      var signature = "".concat(label, "|").concat((search === null || search === void 0 ? void 0 : search.value) || '', "|").concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(assessedAmenities).join(','));
      if (titleEl.dataset.filterSignature !== signature) {
        titleEl.textContent = label;
        titleEl.dataset.filterSignature = signature;
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          titleEl.animate([{
            backgroundSize: '0% 2px'
          }, {
            backgroundSize: '100% 2px'
          }], {
            duration: 450,
            easing: 'ease-out'
          });
        }
      }
    };
    var sortCards = function sortCards(cards) {
      var mode = (sortSel === null || sortSel === void 0 ? void 0 : sortSel.value) || 'overall_desc';
      var sorted = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(cards);
      sorted.sort(function (a, b) {
        var aBranch = getBranch(a);
        var bBranch = getBranch(b);
        var aOverall = getOverall(a);
        var bOverall = getOverall(b);
        var aDate = getVisitedTs(a);
        var bDate = getVisitedTs(b);
        switch (mode) {
          case 'overall_desc':
            return bOverall - aOverall || aBranch.localeCompare(bBranch);
          case 'overall_asc':
            return aOverall - bOverall || aBranch.localeCompare(bBranch);
          case 'date_desc':
            return bDate - aDate || aBranch.localeCompare(bBranch);
          case 'date_asc':
            return aDate - bDate || aBranch.localeCompare(bBranch);
          case 'za':
            return bBranch.localeCompare(aBranch);
          case 'az':
          default:
            return aBranch.localeCompare(bBranch);
        }
      });
      return sorted;
    };
    var getCardData = function getCardData(card) {
      if (!card || typeof card.getAttribute !== 'function') {
        return null;
      }
      return {
        id: card.getAttribute('data-gym-id') || '',
        branch: card.getAttribute('data-branch-label') || '',
        chain: card.getAttribute('data-chain-label') || '',
        link: card.getAttribute('data-link') || '',
        visited: card.getAttribute('data-visited-label') || '—',
        overall: parseFloat(card.getAttribute('data-overall')),
        overallLabel: card.getAttribute('data-overall-label') || 'No rating',
        membership: card.getAttribute('data-membership') || '—',
        lat: parseFloat(card.getAttribute('data-lat')),
        lng: parseFloat(card.getAttribute('data-lng')),
        scores: {
          gym: card.getAttribute('data-gym-score') || '',
          swim: card.getAttribute('data-swim-score') || '',
          spa: card.getAttribute('data-spa-score') || '',
          cafe: card.getAttribute('data-cafe-score') || '',
          clean: card.getAttribute('data-clean-score') || '',
          parking: card.getAttribute('data-parking-score') || ''
        }
      };
    };
    var scoreLabel = function scoreLabel(value) {
      if (value === '' || value === null || value === undefined) return '—';
      return "".concat(value, "/10");
    };
    var getWinnerIdsForMetric = function getWinnerIdsForMetric(items, getter) {
      var best = null;
      var ids = [];
      items.forEach(function (item) {
        var value = getter(item);
        if (value === '' || value === null || value === undefined || Number.isNaN(Number(value))) {
          return;
        }
        var numeric = Number(value);
        if (best === null || numeric > best) {
          best = numeric;
          ids.length = 0;
          ids.push(item.id);
        } else if (numeric === best) {
          ids.push(item.id);
        }
      });
      return ids;
    };
    var getShareUrl = function getShareUrl() {
      var url = new URL(window.location.href);
      if (selectedGyms.length) {
        url.searchParams.set('compare', selectedGyms.join(','));
      } else {
        url.searchParams.delete('compare');
      }
      return url.toString();
    };
    var syncShareUrl = function syncShareUrl() {
      var url = new URL(window.location.href);
      if (selectedGyms.length) {
        url.searchParams.set('compare', selectedGyms.join(','));
      } else {
        url.searchParams.delete('compare');
      }
      window.history.replaceState({}, '', url.toString());
    };
    var openSharePanel = function openSharePanel() {
      if (!sharePanel || selectedGyms.length < 2) return;
      sharePanel.hidden = false;
      if (shareInput) {
        shareInput.value = getShareUrl();
        shareInput.focus();
        shareInput.select();
      }
      if (shareStatus) {
        shareStatus.textContent = '';
      }
      sharePanel.hidden = false;
    };
    var closeSharePanel = function closeSharePanel() {
      if (!sharePanel) return;
      sharePanel.hidden = true;
      if (shareStatus) {
        shareStatus.textContent = '';
      }
    };
    var copyShareLink = function copyShareLink() {
      var url = shareInput === null || shareInput === void 0 ? void 0 : shareInput.value;
      if (!url || !shareCopyBtn) return;
      var originalText = shareCopyBtn.dataset.originalText || shareCopyBtn.textContent;
      shareCopyBtn.dataset.originalText = originalText;
      var resetButtonState = function resetButtonState() {
        window.setTimeout(function () {
          shareCopyBtn.textContent = originalText;
          shareCopyBtn.classList.remove('is-success', 'is-error');
        }, 2000);
      };
      var setButtonState = function setButtonState(text, className) {
        shareCopyBtn.textContent = text;
        shareCopyBtn.classList.remove('is-success', 'is-error');
        shareCopyBtn.classList.add(className);
        resetButtonState();
      };
      var fallbackCopy = function fallbackCopy() {
        var tempInput = document.createElement('textarea');
        tempInput.value = url;
        tempInput.setAttribute('readonly', 'readonly');
        tempInput.style.position = 'fixed';
        tempInput.style.top = '-9999px';
        tempInput.style.left = '-9999px';
        document.body.appendChild(tempInput);
        tempInput.focus();
        tempInput.select();
        var copied = false;
        try {
          copied = document.execCommand('copy');
        } catch (error) {
          copied = false;
        }
        document.body.removeChild(tempInput);
        if (copied) {
          setButtonState('Link copied', 'is-success');
        } else {
          setButtonState('Copy failed', 'is-error');
          shareInput === null || shareInput === void 0 || shareInput.focus();
          shareInput === null || shareInput === void 0 || shareInput.select();
        }
      };
      if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function' && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(function () {
          setButtonState('Link copied', 'is-success');
        }).catch(function () {
          fallbackCopy();
        });
        return;
      }
      fallbackCopy();
    };
    var initComparisonMap = function initComparisonMap() {
      if (!comparisonMapEl || typeof L === 'undefined') return null;
      if (compareMap) return compareMap;
      compareMap = L.map(comparisonMapEl, {
        scrollWheelZoom: false,
        zoomControl: true
      });
      L.tileLayer('https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=cb1_49v4_1_6f4e11cc72c4a39104c6f6c9', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(compareMap);
      return compareMap;
    };
    var renderComparisonMap = function renderComparisonMap(items) {
      if (!comparisonMapEl) return;
      var mappable = items.filter(function (item) {
        return !Number.isNaN(item.lat) && !Number.isNaN(item.lng);
      });
      comparisonMapEl.hidden = true;
      comparisonMapEl.parentElement.hidden = true;
      if (!mappable.length || typeof L === 'undefined') return;
      var map = initComparisonMap();
      if (!map) return;
      comparisonMapEl.hidden = false;
      comparisonMapEl.parentElement.hidden = false;
      compareMarkers.forEach(function (marker) {
        return marker.remove();
      });
      compareMarkers = [];
      var points = [];
      mappable.forEach(function (item) {
        var point = [item.lat, item.lng];
        points.push(point);
        var marker = L.marker(point).addTo(map).bindPopup("<strong>".concat(item.branch, "</strong><br>").concat(item.chain).concat(item.overallLabel ? "<br>".concat(item.overallLabel) : ''));
        compareMarkers.push(marker);
      });
      window.setTimeout(function () {
        map.invalidateSize();
        if (points.length === 1) {
          map.setView(points[0], 12);
        } else {
          map.fitBounds(points, {
            padding: [40, 40]
          });
        }
      }, 100);
    };
    var renderComparison = function renderComparison() {
      if (!comparison || !comparisonTable) return;
      if (selectedGyms.length < 2) {
        comparison.hidden = true;
        comparisonTable.innerHTML = '';
        if (comparisonMapEl) comparisonMapEl.hidden = true;
        return;
      }
      var items = selectedGyms.map(function (id) {
        return allCards.find(function (card) {
          return card.getAttribute('data-gym-id') === id;
        });
      }).filter(Boolean).map(getCardData).filter(Boolean);
      if (items.length < 2) {
        comparison.hidden = true;
        comparisonTable.innerHTML = '';
        if (comparisonMapEl) comparisonMapEl.hidden = true;
        return;
      }
      var rows = [{
        label: 'Overall',
        format: function format(item) {
          return item.overallLabel;
        },
        winners: getWinnerIdsForMetric(items, function (item) {
          return item.overall;
        })
      }, {
        label: 'Gym',
        format: function format(item) {
          return scoreLabel(item.scores.gym);
        },
        winners: getWinnerIdsForMetric(items, function (item) {
          return item.scores.gym;
        })
      }, {
        label: 'Swimming & Wetside Facilities',
        format: function format(item) {
          return scoreLabel(item.scores.swim);
        },
        winners: getWinnerIdsForMetric(items, function (item) {
          return item.scores.swim;
        })
      }, {
        label: 'Spa Retreat',
        format: function format(item) {
          return "".concat(item.chain.toLowerCase() === 'gymbox' ? 'Sauna Facilities: ' : '').concat(scoreLabel(item.scores.spa));
        },
        winners: getWinnerIdsForMetric(items, function (item) {
          return item.scores.spa;
        })
      }, {
        label: 'Café & Work Area',
        format: function format(item) {
          return "".concat(item.chain.toLowerCase().startsWith('david lloyd') ? 'Clubroom: ' : '').concat(scoreLabel(item.scores.cafe));
        },
        winners: getWinnerIdsForMetric(items, function (item) {
          return item.scores.cafe;
        })
      }, {
        label: 'Cleanliness & Maintenance',
        format: function format(item) {
          return scoreLabel(item.scores.clean);
        },
        winners: getWinnerIdsForMetric(items, function (item) {
          return item.scores.clean;
        })
      }, {
        label: 'Parking',
        format: function format(item) {
          return scoreLabel(item.scores.parking);
        },
        winners: getWinnerIdsForMetric(items, function (item) {
          return item.scores.parking;
        })
      }, {
        label: 'Membership',
        format: function format(item) {
          return item.membership || '—';
        },
        winners: []
      }, {
        label: 'Visited',
        format: function format(item) {
          return item.visited || '—';
        },
        winners: []
      }];
      comparisonTable.innerHTML = "\n\t\t\t\t<div class=\"dx-gym-comparison__table\" role=\"table\" aria-label=\"Gym comparison\">\n\t\t\t\t\t<div role=\"row\" class=\"dx-gym-comparison__row dx-gym-comparison__row--head ".concat(items.length === 2 ? 'is-two-up' : '', "\">\n\t\t\t\t\t\t<div role=\"columnheader\" class=\"dx-gym-comparison__metric\">Metric</div>\n\t\t\t\t\t\t").concat(items.map(function (item) {
        return "\n\t\t\t\t\t\t\t<div role=\"columnheader\" class=\"dx-gym-comparison__cell dx-gym-comparison__cell--gym\">\n\t\t\t\t\t\t\t\t<h3 class=\"branch-name\">".concat(item.branch, "</h3>\n\t\t\t\t\t\t\t\t<span>").concat(item.chain, "</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t");
      }).join(''), "\n\t\t\t\t\t</div>\n\t\t\t\t\t").concat(rows.map(function (row) {
        return "\n\t\t\t\t\t\t<div role=\"row\" class=\"dx-gym-comparison__row ".concat(items.length === 2 ? 'is-two-up' : '', "\">\n\t\t\t\t\t\t\t<div role=\"rowheader\" class=\"dx-gym-comparison__metric\">").concat(row.label, "</div>\n\t\t\t\t\t\t\t").concat(items.map(function (item) {
          return "\n\t\t\t\t\t\t\t\t<div role=\"cell\" class=\"dx-gym-comparison__cell ".concat(row.winners.includes(item.id) ? 'is-winner' : '', "\">\n\t\t\t\t\t\t\t\t\t").concat(row.format(item), "\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t");
        }).join(''), "\n\t\t\t\t\t\t</div>\n\t\t\t\t\t");
      }).join(''), "\n\t\t\t\t</div>\n\t\t\t");
      renderComparisonMap(items);
    };
    var updateCompareBar = function updateCompareBar() {
      if (!compareBar || !compareCount || !compareSelected || !compareTrigger || !compareClear) return;
      var atLimit = selectedGyms.length >= 3;
      var hasEnoughToCompare = selectedGyms.length >= 2;
      compareBar.hidden = selectedGyms.length === 0;
      compareBar.classList.toggle('is-visible', selectedGyms.length > 0);
      compareCount.textContent = String(selectedGyms.length);
      compareTrigger.disabled = !hasEnoughToCompare;
      compareClear.disabled = selectedGyms.length === 0;
      compareShareButtons.forEach(function (button) {
        button.disabled = !hasEnoughToCompare;
      });
      compareSelected.innerHTML = selectedGyms.map(function (id) {
        var card = allCards.find(function (item) {
          return item.getAttribute('data-gym-id') === id;
        });
        var label = (card === null || card === void 0 ? void 0 : card.getAttribute('data-branch-label')) || 'Gym';
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'dx-gym-compare-chip';
        chip.dataset.removeGym = id;
        chip.textContent = label + ' ×';
        chip.setAttribute('aria-label', 'Remove ' + label + ' from comparison');
        return chip.outerHTML;
      }).join('');
      allCards.forEach(function (card) {
        var id = card.getAttribute('data-gym-id');
        var toggle = card.querySelector('[data-gym-compare-toggle]');
        if (!toggle) return;
        var isSelected = selectedGyms.includes(id);
        var shouldDisable = atLimit && !isSelected;
        toggle.classList.toggle('is-active', isSelected);
        toggle.classList.toggle('is-disabled', shouldDisable);
        toggle.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        toggle.disabled = shouldDisable;
      });
      if (selectedGyms.length < 2) {
        closeSharePanel();
      }
      syncShareUrl();
    };
    var observedLast = null;
    var moreObserver = new IntersectionObserver(function (entries) {
      var _archive$closest;
      if (((_archive$closest = archive.closest('.dx-fitness')) === null || _archive$closest === void 0 ? void 0 : _archive$closest.dataset.sectionNavigating) === 'true') return;
      if (!entries.some(function (entry) {
        return entry.isIntersecting && entry.target === observedLast;
      })) return;
      moreObserver.disconnect();
      observedLast = null;
      visibleCount += 10;
      update();
    }, {
      rootMargin: '0px 0px 180px 0px',
      threshold: 0
    });
    var update = function update() {
      var activeFilters = assessedAmenities.size + (activeChain === 'all' ? 0 : 1);
      filterSummary.textContent = activeFilters ? "Filters (".concat(activeFilters, ")") : 'Filters';
      var q = ((search === null || search === void 0 ? void 0 : search.value) || '').trim().toLowerCase();
      var eligible = allCards.filter(function (card) {
        var chain = card.getAttribute('data-chain') || 'unknown';
        var chainOk = activeChain === 'all' || chain === activeChain || activeChain === 'other' && !Object.prototype.hasOwnProperty.call(LABELS, chain);
        var haystack = (card.getAttribute('data-search') || '').toLowerCase();
        var searchOk = !q || haystack.includes(q);
        var amenitiesOk = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(assessedAmenities).every(function (key) {
          var value = card.dataset[key];
          return value !== undefined && value.trim() !== '' && Number.isFinite(Number(value)) && Number(value) >= 0;
        });
        return chainOk && searchOk && amenitiesOk;
      });
      var ordered = sortCards(eligible);
      ordered.forEach(function (card) {
        return grid.appendChild(card);
      });
      allCards.forEach(function (card) {
        card.hidden = true;
      });
      ordered.slice(0, visibleCount).forEach(function (card) {
        card.hidden = false;
      });
      if (emptyEl) {
        emptyEl.hidden = ordered.length !== 0;
      }
      moreObserver.disconnect();
      observedLast = ordered.length > visibleCount ? ordered[Math.min(visibleCount, ordered.length) - 1] : null;
      if (observedLast) moreObserver.observe(observedLast);
      updateTitle();
      league.update(ordered, visibleCount);
    };
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.setAttribute('aria-pressed', 'true');
        btn.classList.add('is-active');
        activeChain = btn.dataset.chain || 'all';
        visibleCount = 10;
        update();
      });
    });
    archive.addEventListener('league-view-change', update);
    search === null || search === void 0 || search.addEventListener('input', function () {
      visibleCount = 10;
      update();
    });
    sortSel === null || sortSel === void 0 || sortSel.addEventListener('change', function () {
      visibleCount = 10;
      update();
    });
    viewBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        viewBtns.forEach(function (b) {
          return b.classList.remove('is-active');
        });
        btn.classList.add('is-active');
        var view = btn.getAttribute('data-gym-view') || 'cards';
        archive.setAttribute('data-view', view);
      });
    });
    grid === null || grid === void 0 || grid.addEventListener('click', function (e) {
      var toggle = e.target.closest('[data-notes-toggle]');
      if (!toggle) return;
      var card = toggle.closest('[data-gym-card]');
      var panel = card === null || card === void 0 ? void 0 : card.querySelector('[data-notes-panel]');
      if (!card || !panel) return;
      var isOpen = card.classList.contains('is-notes-open');
      card.classList.toggle('is-notes-open', !isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
    grid === null || grid === void 0 || grid.addEventListener('click', function (e) {
      var compareBtn = e.target.closest('[data-gym-compare-toggle]');
      if (!compareBtn || compareBtn.disabled) return;
      var card = compareBtn.closest('[data-gym-card]');
      if (!card) return;
      var id = card.getAttribute('data-gym-id');
      if (!id) return;
      if (selectedGyms.includes(id)) {
        selectedGyms = selectedGyms.filter(function (item) {
          return item !== id;
        });
      } else {
        if (selectedGyms.length >= 3) return;
        selectedGyms = [].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(selectedGyms), [id]);
      }
      updateCompareBar();
      renderComparison();
    });
    compareTrigger === null || compareTrigger === void 0 || compareTrigger.addEventListener('click', function () {
      renderComparison();
      comparison === null || comparison === void 0 || comparison.removeAttribute('hidden');
      comparison === null || comparison === void 0 || comparison.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
    compareSelected === null || compareSelected === void 0 || compareSelected.addEventListener('click', function (event) {
      var button = event.target.closest('[data-remove-gym]');
      if (!button) return;
      selectedGyms = selectedGyms.filter(function (id) {
        return id !== button.dataset.removeGym;
      });
      updateCompareBar();
      renderComparison();
    });
    compareClear === null || compareClear === void 0 || compareClear.addEventListener('click', function () {
      selectedGyms = [];
      updateCompareBar();
      renderComparison();
    });
    compareShareButtons.forEach(function (btn) {
      btn.addEventListener('click', openSharePanel);
    });
    shareCopyBtn === null || shareCopyBtn === void 0 || shareCopyBtn.addEventListener('click', copyShareLink);
    shareCloseBtn === null || shareCloseBtn === void 0 || shareCloseBtn.addEventListener('click', closeSharePanel);
    comparisonClose === null || comparisonClose === void 0 || comparisonClose.addEventListener('click', function () {
      if (comparison) {
        comparison.hidden = true;
      }
    });
    var compareParam = new URLSearchParams(window.location.search).get('compare');
    if (compareParam) {
      selectedGyms = compareParam.split(',').map(function (id) {
        return id.trim();
      }).filter(function (id) {
        return allCards.some(function (card) {
          return card.getAttribute('data-gym-id') === id;
        });
      }).slice(0, 3);
      if (selectedGyms.length >= 2) {
        renderComparison();
        comparison === null || comparison === void 0 || comparison.removeAttribute('hidden');
        window.setTimeout(function () {
          comparison === null || comparison === void 0 || comparison.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    }
    var initialViewBtn = viewBtns.find(function (btn) {
      return btn.classList.contains('is-active');
    });
    archive.setAttribute('data-view', (initialViewBtn === null || initialViewBtn === void 0 ? void 0 : initialViewBtn.getAttribute('data-gym-view')) || 'cards');
    var animatedCards = new WeakSet();
    var animateCardBars = function animateCardBars(card) {
      if (!card || animatedCards.has(card)) return;
      var bars = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(card.querySelectorAll('.dx-score-bar span'));
      if (!bars.length) return;
      animatedCards.add(card);
      bars.forEach(function (bar, index) {
        var pct = getComputedStyle(bar).getPropertyValue('--pct').trim() || '0';
        bar.style.transform = 'scaleX(0)';
        window.setTimeout(function () {
          bar.style.transform = "scaleX(".concat(pct, ")");
        }, index * 100);
      });
    };
    var cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCardBars(entry.target);
          cardObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px'
    });
    allCards.forEach(function (card) {
      cardObserver.observe(card);
    });
    updateCompareBar();
    renderComparison();
    update();
    archive.classList.remove('is-loading');
    archive.removeAttribute('aria-busy');
    (_archive$querySelecto3 = archive.querySelector('.league-loading')) === null || _archive$querySelecto3 === void 0 || _archive$querySelecto3.remove();
  })();

  /* ==========================
  GYM VIEWPORT-ACTIVE (DEDICATED)
  ========================== */

  // The league can be taller than the viewport; do not gate it on scroll ratios.
  (_document$querySelect5 = document.querySelector('[data-gyms-archive]')) === null || _document$querySelect5 === void 0 || (_document$querySelect5 = _document$querySelect5.closest('section')) === null || _document$querySelect5 === void 0 || _document$querySelect5.classList.add('viewport-active');

  /* ==========================
  BUS DIARY
  ========================== */

  document.addEventListener('DOMContentLoaded', function () {
    var busEntry = document.querySelector('.bus-diary-entry');
    if (!busEntry) return;
    var mapEl = busEntry.querySelector('[data-bus-map]');
    var dock = busEntry.querySelector('[data-bus-dock]');
    var paneStage = busEntry.querySelector('[data-bus-pane-stage]');
    var toggleButtons = dock ? (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(dock.querySelectorAll('[data-view-toggle]')) : [];
    var paneViews = paneStage ? (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(paneStage.querySelectorAll('.bus-pane-view[data-pane-view]')) : [];

    /* ==========================
    BUS MAP
    ========================== */

    if (mapEl) {
      var route = mapEl.dataset.route || '';
      var startName = mapEl.dataset.startName || 'Start';
      var endName = mapEl.dataset.endName || 'End';
      console.log('Bus map ready:', {
        route: route,
        start: startName,
        end: endName
      });
      if (typeof L !== 'undefined') {
        var startLat = parseFloat(mapEl.dataset.startLat);
        var startLng = parseFloat(mapEl.dataset.startLng);
        var endLat = parseFloat(mapEl.dataset.endLat);
        var endLng = parseFloat(mapEl.dataset.endLng);
        var hasStart = !Number.isNaN(startLat) && !Number.isNaN(startLng);
        var hasEnd = !Number.isNaN(endLat) && !Number.isNaN(endLng);
        if (!hasStart && !hasEnd) {
          mapEl.innerHTML = '<div class="bus-map__empty">No journey coordinates added yet.</div>';
        } else {
          var map = L.map(mapEl, {
            scrollWheelZoom: false,
            zoomControl: true
          });
          L.tileLayer('https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_49v4_1_6f4e11cc72c4a39104c6f6c9', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 20
          }).addTo(map);
          var points = [];
          var startIcon = L.divIcon({
            className: 'bus-map-marker bus-map-marker--start',
            html: '<span></span>',
            iconSize: [18, 18],
            iconAnchor: [9, 9]
          });
          var endIcon = L.divIcon({
            className: 'bus-map-marker bus-map-marker--end',
            html: '<span></span>',
            iconSize: [18, 18],
            iconAnchor: [9, 9]
          });
          if (hasStart) {
            var startPoint = [startLat, startLng];
            points.push(startPoint);
            L.marker(startPoint, {
              icon: startIcon
            }).addTo(map).bindPopup("<strong>".concat(startName, "</strong>").concat(route ? "<br>Route ".concat(route) : ''));
          }
          if (hasEnd) {
            var endPoint = [endLat, endLng];
            points.push(endPoint);
            L.marker(endPoint, {
              icon: endIcon
            }).addTo(map).bindPopup("<strong>".concat(endName, "</strong>").concat(route ? "<br>Route ".concat(route) : ''));
          }
          if (hasStart && hasEnd) {
            L.polyline([[startLat, startLng], [endLat, endLng]], {
              color: '#ffffff',
              weight: 4,
              opacity: 0.85
            }).addTo(map);
          }
          if (points.length === 1) {
            map.setView(points[0], 13);
          } else {
            map.fitBounds(points, {
              padding: [40, 40]
            });
          }
          window.addEventListener('resize', function () {
            map.invalidateSize();
          });
        }
      }
    }

    /* ==========================
    BUS DIARY STATE SWITCHING
    Only the left pane changes state
    ========================== */

    if (dock && paneStage && toggleButtons.length && paneViews.length) {
      var setActivePane = function setActivePane(viewName) {
        paneViews.forEach(function (view) {
          view.classList.toggle('is-active', view.dataset.paneView === viewName);
        });
        toggleButtons.forEach(function (button) {
          var isActive = button.dataset.viewToggle === viewName;
          button.classList.toggle('is-active', isActive);
          button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        if (viewName === 'map') {
          window.dispatchEvent(new Event('resize'));
        }
      };
      toggleButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          var viewName = button.dataset.viewToggle;
          if (!viewName) return;
          setActivePane(viewName);
        });
      });
      var activeButton = dock.querySelector('[data-view-toggle].is-active');
      setActivePane((activeButton === null || activeButton === void 0 ? void 0 : activeButton.dataset.viewToggle) || 'map');
    }

    /* ==========================
    BUS PANEL TOGGLES
    ========================== */

    var panelToggleButtons = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(busEntry.querySelectorAll('[data-bus-panel-toggle]'));
    var panels = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(busEntry.querySelectorAll('[data-bus-panel]'));
    if (panelToggleButtons.length && panels.length) {
      panelToggleButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var key = btn.dataset.busPanelToggle;
          if (!key) return;
          var panel = busEntry.querySelector("[data-bus-panel=\"".concat(key, "\"]"));
          if (!panel) return;
          var isHidden = panel.hasAttribute('hidden');
          panels.forEach(function (p) {
            return p.setAttribute('hidden', 'hidden');
          });
          if (isHidden) {
            panel.removeAttribute('hidden');
          }
        });
      });
    }

    /* ==========================
    TFL DEPARTURES NEAR YOU
    ========================== */

    var departuresRoot = busEntry.querySelector('[data-bus-departures]');
    if (!departuresRoot) return;
    var locateBtn = departuresRoot.querySelector('[data-bus-locate]');
    var statusEl = departuresRoot.querySelector('[data-bus-status]');
    var stopsEl = departuresRoot.querySelector('[data-bus-stops]');
    var resultsEl = departuresRoot.querySelector('[data-bus-results]');
    if (!locateBtn || !statusEl || !stopsEl || !resultsEl) return;
    if (locateBtn.dataset.busLocateBound === 'true') return;
    locateBtn.dataset.busLocateBound = 'true';
    var hasBusConfig = typeof DX_BUS_DIARY !== 'undefined' && DX_BUS_DIARY && DX_BUS_DIARY.rest_url;
    var restBase = hasBusConfig ? DX_BUS_DIARY.rest_url.replace(/\/$/, '') : '';
    var setStatus = function setStatus(message) {
      statusEl.textContent = message;
    };
    var minsLabel = function minsLabel(seconds) {
      if (seconds === null || seconds === undefined) return '—';
      var mins = Math.round(seconds / 60);
      if (mins <= 0) return 'Due';
      return "".concat(mins, " min");
    };
    var renderArrivals = function renderArrivals(arrivals) {
      if (!arrivals.length) {
        resultsEl.innerHTML = "\n\t\t\t\t\t<div class=\"bus-arrival-card\">\n\t\t\t\t\t\t<div class=\"bus-arrival-main\">No live departures found.</div>\n\t\t\t\t\t</div>\n\t\t\t\t";
        return;
      }
      resultsEl.innerHTML = arrivals.map(function (item) {
        return "\n\t\t\t\t<div class=\"bus-arrival-card\">\n\t\t\t\t\t<div class=\"bus-arrival-main\">\n\t\t\t\t\t\t<div class=\"bus-arrival-line\">".concat(item.lineName || 'Bus', "</div>\n\t\t\t\t\t\t<div class=\"bus-arrival-destination\">").concat(item.destinationName || 'Unknown destination', "</div>\n\t\t\t\t\t\t<div class=\"bus-arrival-meta\">").concat(item.towards || '', "</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"bus-arrival-time\">").concat(minsLabel(item.timeToStation), "</div>\n\t\t\t\t</div>\n\t\t\t");
      }).join('');
    };
    var loadArrivals = /*#__PURE__*/function () {
      var _ref1 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee2(stopId, stopName) {
        var res, data, _t;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function (_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              setStatus("Loading departures for ".concat(stopName, "\u2026"));
              resultsEl.innerHTML = '';
              _context2.prev = 1;
              _context2.next = 2;
              return fetch("".concat(restBase, "/tfl-stop-arrivals?stop_id=").concat(encodeURIComponent(stopId)), {
                headers: {
                  'X-WP-Nonce': DX_BUS_DIARY.nonce
                }
              });
            case 2:
              res = _context2.sent;
              _context2.next = 3;
              return res.json();
            case 3:
              data = _context2.sent;
              if (data.success) {
                _context2.next = 4;
                break;
              }
              throw new Error(data.message || 'Could not load arrivals.');
            case 4:
              setStatus("Showing live departures for ".concat(stopName));
              renderArrivals(data.arrivals || []);
              _context2.next = 6;
              break;
            case 5:
              _context2.prev = 5;
              _t = _context2["catch"](1);
              setStatus('Unable to load live departures right now.');
              resultsEl.innerHTML = "\n\t\t\t\t\t<div class=\"bus-arrival-card\">\n\t\t\t\t\t\t<div class=\"bus-arrival-main\">".concat(_t.message, "</div>\n\t\t\t\t\t</div>\n\t\t\t\t");
            case 6:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[1, 5]]);
      }));
      return function loadArrivals(_x2, _x3) {
        return _ref1.apply(this, arguments);
      };
    }();
    var renderStops = function renderStops(stops) {
      if (!stops.length) {
        stopsEl.innerHTML = "\n\t\t\t\t\t<div class=\"bus-stop-card\">\n\t\t\t\t\t\t<p>No nearby bus stops found.</p>\n\t\t\t\t\t</div>\n\t\t\t\t";
        resultsEl.innerHTML = '';
        return;
      }
      stopsEl.innerHTML = stops.map(function (stop, index) {
        var _stop$distance;
        return "\n\t\t\t\t<button\n\t\t\t\t\ttype=\"button\"\n\t\t\t\t\tclass=\"bus-stop-card ".concat(index === 0 ? 'is-active' : '', "\"\n\t\t\t\t\tdata-stop-id=\"").concat(stop.id, "\"\n\t\t\t\t\tdata-stop-name=\"").concat(stop.name, "\"\n\t\t\t\t>\n\t\t\t\t\t<h4>").concat(stop.name, "</h4>\n\t\t\t\t\t<p>").concat((_stop$distance = stop.distance) !== null && _stop$distance !== void 0 ? _stop$distance : '—', "m away ").concat(stop.indicator ? "\u2022 Stop ".concat(stop.indicator) : '', "</p>\n\t\t\t\t</button>\n\t\t\t");
      }).join('');
      var stopButtons = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(stopsEl.querySelectorAll('[data-stop-id]'));
      stopButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          stopButtons.forEach(function (b) {
            return b.classList.remove('is-active');
          });
          btn.classList.add('is-active');
          loadArrivals(btn.dataset.stopId, btn.dataset.stopName);
        });
      });
      loadArrivals(stops[0].id, stops[0].name);
    };
    locateBtn.addEventListener('click', function () {
      if (!hasBusConfig) {
        setStatus('Live departures are not configured yet.');
        resultsEl.innerHTML = '';
        stopsEl.innerHTML = "\n\t\t\t\t\t<div class=\"bus-stop-card\">\n\t\t\t\t\t\t<p>DX_BUS_DIARY is missing or not localised into the page.</p>\n\t\t\t\t\t</div>\n\t\t\t\t";
        console.warn('DX_BUS_DIARY is missing from the page.');
        return;
      }
      setStatus('Getting your location…');
      stopsEl.innerHTML = '';
      resultsEl.innerHTML = '';
      navigator.geolocation.getCurrentPosition(/*#__PURE__*/function () {
        var _ref10 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee3(position) {
          var _position$coords, latitude, longitude, res, data, _t2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function (_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                _position$coords = position.coords, latitude = _position$coords.latitude, longitude = _position$coords.longitude;
                _context3.prev = 1;
                _context3.next = 2;
                return fetch("".concat(restBase, "/tfl-nearby-stops?lat=").concat(encodeURIComponent(latitude), "&lng=").concat(encodeURIComponent(longitude), "&radius=600"), {
                  headers: {
                    'X-WP-Nonce': DX_BUS_DIARY.nonce
                  }
                });
              case 2:
                res = _context3.sent;
                _context3.next = 3;
                return res.json();
              case 3:
                data = _context3.sent;
                if (data.success) {
                  _context3.next = 4;
                  break;
                }
                throw new Error(data.message || 'Could not load nearby stops.');
              case 4:
                setStatus('Nearby stops found.');
                renderStops(data.stops || []);
                _context3.next = 6;
                break;
              case 5:
                _context3.prev = 5;
                _t2 = _context3["catch"](1);
                setStatus('Unable to find nearby stops right now.');
                stopsEl.innerHTML = "\n\t\t\t\t\t\t\t<div class=\"bus-stop-card\">\n\t\t\t\t\t\t\t\t<p>".concat(_t2.message, "</p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t");
              case 6:
              case "end":
                return _context3.stop();
            }
          }, _callee3, null, [[1, 5]]);
        }));
        return function (_x4) {
          return _ref10.apply(this, arguments);
        };
      }(), function (error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setStatus('Location access was denied.');
            break;
          case error.POSITION_UNAVAILABLE:
            setStatus('Your location is currently unavailable.');
            break;
          case error.TIMEOUT:
            setStatus('Location request timed out.');
            break;
          default:
            setStatus('Unable to get your location right now.');
        }
      }, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      });
    });
  });

  /* ==========================
  GEO RESTRICTION
  ========================== */

  (function () {
    'use strict';

    var BLOCKED_COUNTRIES = ['IL'];
    var RESTRICTED_PATH = '/access-restricted/';
    var BODY_CLASS = 'error405';
    var DEV_PARAM = 'geo';
    var normaliseCountryCode = function normaliseCountryCode(value) {
      if (!value || typeof value !== 'string') return '';
      return value.trim().toUpperCase();
    };
    var getCountryCode = function getCountryCode() {
      var _document$body;
      var params = new URLSearchParams(window.location.search);
      var override = normaliseCountryCode(params.get(DEV_PARAM));

      // Local/dev testing: ?geo=US
      if (override) {
        return override;
      }

      // Optional global value if you expose it elsewhere
      if (typeof window.CF_IPCountry !== 'undefined') {
        return normaliseCountryCode(window.CF_IPCountry);
      }

      // Cloudflare header values are not directly readable in frontend JS
      // unless you expose them yourself server-side.
      var bodyCountry = normaliseCountryCode((_document$body = document.body) === null || _document$body === void 0 || (_document$body = _document$body.dataset) === null || _document$body === void 0 ? void 0 : _document$body.country);
      if (bodyCountry) {
        return bodyCountry;
      }
      return '';
    };
    var isRestrictedPage = function isRestrictedPage() {
      var currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
      var restrictedPath = RESTRICTED_PATH.replace(/\/+$/, '') || '/';
      return currentPath === restrictedPath;
    };
    var shouldBlockCountry = function shouldBlockCountry(countryCode) {
      if (!countryCode) return false;
      return BLOCKED_COUNTRIES.includes(countryCode);
    };
    var applyBlockedState = function applyBlockedState() {
      document.body.classList.add(BODY_CLASS);
      document.documentElement.classList.add(BODY_CLASS);
    };
    var redirectToRestrictedPage = function redirectToRestrictedPage(countryCode) {
      var url = new URL(RESTRICTED_PATH, window.location.origin);

      // Optional: pass through debug info for testing/inspection
      url.searchParams.set('geo', countryCode);
      window.location.replace(url.toString());
    };
    var initGeoRestriction = function initGeoRestriction() {
      var countryCode = getCountryCode();
      var blocked = shouldBlockCountry(countryCode);
      var onRestrictedPage = isRestrictedPage();

      // Debug helpers
      window.DX_GEO_DEBUG = {
        countryCode: countryCode,
        blocked: blocked,
        onRestrictedPage: onRestrictedPage,
        blockedCountries: [].concat(BLOCKED_COUNTRIES)
      };
      if (!blocked) {
        return;
      }
      applyBlockedState();
      if (!onRestrictedPage) {
        redirectToRestrictedPage(countryCode);
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initGeoRestriction);
    } else {
      initGeoRestriction();
    }
  })();

  /* ==========================
  CALENDLY POPUP
  ========================== */

  document.addEventListener('DOMContentLoaded', function () {
    var calendlyButtons = document.querySelectorAll('.js-calendly-popup');
    if (!calendlyButtons.length) return;
    calendlyButtons.forEach(function (button) {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        if (typeof Calendly === 'undefined' || typeof Calendly.initPopupWidget !== 'function') {
          console.warn('Calendly widget script is not loaded yet.');
          return;
        }
        Calendly.initPopupWidget({
          url: 'https://calendly.com/dxndre/30min'
        });
      });
    });
    console.log('Calendly popup initialized for buttons:', calendlyButtons);
  });

  /* ==========================
  	BUS NFS ARCHIVE
  ========================== */

  (function () {
    var archive = document.querySelector('[data-bus-nfs]');
    if (!archive) return;
    var slides = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(archive.querySelectorAll('[data-bus-slide]'));
    var prevBtn = archive.querySelector('[data-bus-prev]');
    var nextBtn = archive.querySelector('[data-bus-next]');
    var currentEl = archive.querySelector('[data-bus-current]');
    if (!slides.length) return;
    var currentIndex = 0;
    var locked = false;
    var pad = function pad(number) {
      return String(number).padStart(2, '0');
    };
    var setActiveSlide = function setActiveSlide(index) {
      currentIndex = Math.max(0, Math.min(index, slides.length - 1));
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === currentIndex);
        slide.classList.toggle('is-before', slideIndex < currentIndex);
        slide.classList.toggle('is-after', slideIndex > currentIndex);
      });
      if (currentEl) {
        currentEl.textContent = pad(currentIndex + 1);
      }
    };
    var next = function next() {
      if (currentIndex >= slides.length - 1) return;
      setActiveSlide(currentIndex + 1);
    };
    var prev = function prev() {
      if (currentIndex <= 0) return;
      setActiveSlide(currentIndex - 1);
    };
    nextBtn === null || nextBtn === void 0 || nextBtn.addEventListener('click', next);
    prevBtn === null || prevBtn === void 0 || prevBtn.addEventListener('click', prev);
    window.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev();
    });
    archive.addEventListener('wheel', function (e) {
      e.preventDefault();
      if (locked) return;
      locked = true;
      if (e.deltaY > 0) {
        next();
      } else {
        prev();
      }
      setTimeout(function () {
        locked = false;
      }, 850);
    }, {
      passive: false
    });
    setActiveSlide(0);
  })();
  (function () {
    'use strict';

    // ================================================================
    // GUARD
    // ================================================================
    var body = document.body;
    if (!body || !body.classList.contains('single-gym-review')) {
      return;
    }
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ================================================================
    // HELPERS
    // ================================================================

    var clamp = function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    };
    var parseScore = function parseScore(value) {
      if (value === null || value === undefined || value === '' || value === 'unavailable') {
        return null;
      }
      var parsed = parseFloat(value);
      return Number.isFinite(parsed) ? parsed : null;
    };
    var escapeAttribute = function escapeAttribute() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    // ================================================================
    // SCROLL REVEAL
    // ================================================================

    var initialiseRevealAnimations = function initialiseRevealAnimations() {
      var selectors = ['.gym-review-overview__grid', '.gym-review-section-heading', '.gym-review-score', '.gym-review-panel', '.gym-review-gallery figure', '.gym-review-content__grid', '.gym-review-final .container'];
      var elements = document.querySelectorAll(selectors.join(','));
      elements.forEach(function (element) {
        if (!element.hasAttribute('data-gym-reveal')) {
          element.setAttribute('data-gym-reveal', '');
        }
      });
      if (reduceMotion || !('IntersectionObserver' in window)) {
        elements.forEach(function (element) {
          element.classList.add('is-visible');
        });
        return;
      }
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });
      elements.forEach(function (element) {
        observer.observe(element);
      });
    };

    // ================================================================
    // HERO PARALLAX
    // ================================================================

    var initialiseHeroParallax = function initialiseHeroParallax() {
      if (reduceMotion) {
        return;
      }
      var hero = document.querySelector('.gym-review-hero');
      var image = document.querySelector('.gym-review-hero__image');
      if (!hero || !image) {
        return;
      }
      var ticking = false;
      var update = function update() {
        var rect = hero.getBoundingClientRect();
        var viewportHeight = window.innerHeight;
        if (rect.bottom < 0 || rect.top > viewportHeight) {
          ticking = false;
          return;
        }
        var progress = clamp(-window.scrollY / 1200, -1, 0);
        var translate = window.scrollY * 0.08;
        image.style.transform = "translate3d(0, ".concat(translate, "px, 0) scale(1.035)");
        ticking = false;
      };
      var requestUpdate = function requestUpdate() {
        if (ticking) {
          return;
        }
        ticking = true;
        window.requestAnimationFrame(update);
      };
      window.addEventListener('scroll', requestUpdate, {
        passive: true
      });
      requestUpdate();
    };

    // ================================================================
    // SCORE BARS
    // ================================================================

    var initialiseScores = function initialiseScores() {
      var scoreItems = document.querySelectorAll('.gym-review-score');
      if (!scoreItems.length) {
        return;
      }
      scoreItems.forEach(function (item) {
        var scoreValue = parseScore(item.dataset.score);
        var fill = item.querySelector('.gym-review-score__fill');
        var display = item.querySelector('.gym-review-score__value') || item.querySelector('.gym-review-score__meta strong');
        if (scoreValue === null) {
          item.classList.add('is-unavailable');
          if (display) {
            display.textContent = 'Unavailable';
          }
          return;
        }
        var percentage = clamp(scoreValue * 10, 0, 100);
        if (fill) {
          fill.dataset.width = "".concat(percentage, "%");
          fill.style.width = '0';
        }
        if (display) {
          display.textContent = "".concat(scoreValue, "/10");
        }
      });
      var animate = function animate(item) {
        var fill = item.querySelector('.gym-review-score__fill');
        if (!fill) {
          return;
        }
        var width = fill.dataset.width;
        if (!width) {
          return;
        }
        requestAnimationFrame(function () {
          fill.style.width = width;
        });
      };
      if (reduceMotion || !('IntersectionObserver' in window)) {
        scoreItems.forEach(animate);
        return;
      }
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          animate(entry.target);
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.35
      });
      scoreItems.forEach(function (item) {
        if (!item.classList.contains('is-unavailable')) {
          observer.observe(item);
        }
      });
    };

    // ================================================================
    // OVERALL SCORE COUNT-UP
    // ================================================================

    var initialiseOverallScore = function initialiseOverallScore() {
      var scoreElements = document.querySelectorAll('[data-overall-score]');
      if (!scoreElements.length) {
        return;
      }
      var animateScore = function animateScore(element) {
        var target = parseFloat(element.dataset.overallScore);
        if (!Number.isFinite(target)) {
          return;
        }
        element.style.color = gymOverallBand(target).color;
        if (reduceMotion) {
          element.textContent = "".concat(target.toFixed(1), "%");
          return;
        }
        var duration = 1100;
        var start = performance.now();
        var _frame = function frame(time) {
          var elapsed = time - start;
          var progress = clamp(elapsed / duration, 0, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = target * eased;
          element.textContent = "".concat(current.toFixed(1), "%");
          element.style.color = gymOverallBand(current).color;
          if (progress < 1) {
            requestAnimationFrame(_frame);
          }
        };
        requestAnimationFrame(_frame);
      };
      if (!('IntersectionObserver' in window)) {
        scoreElements.forEach(animateScore);
        return;
      }
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          animateScore(entry.target);
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.4
      });
      scoreElements.forEach(function (element) {
        observer.observe(element);
      });
    };

    // ================================================================
    // MAP
    //
    // Expected markup:
    //
    // <div
    //   class="gym-review-map"
    //   data-location="Notting Hill, London"
    // ></div>
    //
    // Your ACF gym_location can populate data-location.
    // ================================================================

    var initialiseMap = function initialiseMap() {
      var maps = document.querySelectorAll('.gym-review-map');
      if (!maps.length) {
        return;
      }
      maps.forEach(function (map) {
        var location = map.dataset.location || map.dataset.address || '';
        if (!location) {
          return;
        }
        var loading = document.createElement('div');
        loading.className = 'gym-review-map__loading';
        loading.textContent = 'Loading map';
        map.appendChild(loading);
        var iframe = document.createElement('iframe');
        iframe.title = "Map showing ".concat(location);
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        iframe.setAttribute('allowfullscreen', '');
        iframe.src = 'https://www.google.com/maps?' + 'q=' + encodeURIComponent(location) + '&output=embed';
        iframe.addEventListener('load', function () {
          loading.remove();
        });
        map.appendChild(iframe);
      });
    };

    // ================================================================
    // GOOGLE MAPS / DIRECTIONS LINK
    //
    // Existing ACF google_maps_url can be output as:
    //
    // <a
    //   class="gym-review-location__directions"
    //   data-map-url="..."
    // >
    // ================================================================

    var initialiseDirections = function initialiseDirections() {
      var links = document.querySelectorAll('[data-map-url]');
      links.forEach(function (link) {
        var url = link.dataset.mapUrl;
        if (!url) {
          return;
        }
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      });
    };

    // ================================================================
    // GALLERY LIGHTBOX
    // ================================================================

    var initialiseGalleryLightbox = function initialiseGalleryLightbox() {
      var images = Array.from(document.querySelectorAll('.gym-review-gallery figure img'));
      if (!images.length) {
        return;
      }
      var lightbox = document.createElement('div');
      lightbox.className = 'gym-review-lightbox';
      lightbox.setAttribute('aria-hidden', 'true');
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.innerHTML = "\n\t\t\t<button\n\t\t\t\ttype=\"button\"\n\t\t\t\tclass=\"gym-review-lightbox__close\"\n\t\t\t\taria-label=\"Close image\"\n\t\t\t>\n\t\t\t\t\xD7\n\t\t\t</button>\n\n\t\t\t<button\n\t\t\t\ttype=\"button\"\n\t\t\t\tclass=\"gym-review-lightbox__prev\"\n\t\t\t\taria-label=\"Previous image\"\n\t\t\t>\n\t\t\t\t\u2190\n\t\t\t</button>\n\n\t\t\t<img\n\t\t\t\tclass=\"gym-review-lightbox__image\"\n\t\t\t\tsrc=\"\"\n\t\t\t\talt=\"\"\n\t\t\t>\n\n\t\t\t<button\n\t\t\t\ttype=\"button\"\n\t\t\t\tclass=\"gym-review-lightbox__next\"\n\t\t\t\taria-label=\"Next image\"\n\t\t\t>\n\t\t\t\t\u2192\n\t\t\t</button>\n\t\t";
      document.body.appendChild(lightbox);
      var lightboxImage = lightbox.querySelector('.gym-review-lightbox__image');
      var closeButton = lightbox.querySelector('.gym-review-lightbox__close');
      var previousButton = lightbox.querySelector('.gym-review-lightbox__prev');
      var nextButton = lightbox.querySelector('.gym-review-lightbox__next');
      var currentIndex = 0;
      var getFullSource = function getFullSource(image) {
        return image.dataset.full || image.currentSrc || image.src;
      };
      var render = function render() {
        var image = images[currentIndex];
        lightboxImage.src = getFullSource(image);
        lightboxImage.alt = image.alt || '';
      };
      var open = function open(index) {
        currentIndex = index;
        render();
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        body.classList.add('gym-lightbox-open');
        closeButton.focus();
      };
      var close = function close() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        body.classList.remove('gym-lightbox-open');
      };
      var previous = function previous() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        render();
      };
      var next = function next() {
        currentIndex = (currentIndex + 1) % images.length;
        render();
      };
      images.forEach(function (image, index) {
        var figure = image.closest('figure');
        if (!figure) {
          return;
        }
        figure.tabIndex = 0;
        figure.setAttribute('role', 'button');
        figure.setAttribute('aria-label', "View image ".concat(index + 1, " of ").concat(images.length));
        figure.addEventListener('click', function () {
          open(index);
        });
        figure.addEventListener('keydown', function (event) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            open(index);
          }
        });
      });
      closeButton.addEventListener('click', close);
      previousButton.addEventListener('click', previous);
      nextButton.addEventListener('click', next);
      lightbox.addEventListener('click', function (event) {
        if (event.target === lightbox) {
          close();
        }
      });
      document.addEventListener('keydown', function (event) {
        if (!lightbox.classList.contains('is-open')) {
          return;
        }
        switch (event.key) {
          case 'Escape':
            close();
            break;
          case 'ArrowLeft':
            previous();
            break;
          case 'ArrowRight':
            next();
            break;
        }
      });
    };

    // ================================================================
    // MOBILE GALLERY DOTS
    // ================================================================

    var initialiseGalleryProgress = function initialiseGalleryProgress() {
      var viewport = document.querySelector('.gym-review-gallery__viewport');
      if (!viewport) {
        return;
      }
      var slides = Array.from(viewport.querySelectorAll('figure'));
      if (slides.length < 2) {
        return;
      }
      var controls = document.querySelector('.gym-review-gallery__controls');
      if (!controls) {
        controls = document.createElement('div');
        controls.className = 'gym-review-gallery__controls';
        viewport.insertAdjacentElement('afterend', controls);
      }
      controls.innerHTML = '';
      var dots = slides.map(function (_, index) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'gym-review-gallery__dot';
        button.setAttribute('aria-label', "Go to image ".concat(index + 1));
        if (index === 0) {
          button.classList.add('is-active');
        }
        button.addEventListener('click', function () {
          slides[index].scrollIntoView({
            behavior: reduceMotion ? 'auto' : 'smooth',
            inline: 'start',
            block: 'nearest'
          });
        });
        controls.appendChild(button);
        return button;
      });
      if (!('IntersectionObserver' in window)) {
        return;
      }
      var observer = new IntersectionObserver(function (entries) {
        var visible = entries.filter(function (entry) {
          return entry.isIntersecting;
        }).sort(function (a, b) {
          return b.intersectionRatio - a.intersectionRatio;
        });
        if (!visible.length) {
          return;
        }
        var index = slides.indexOf(visible[0].target);
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === index);
        });
      }, {
        root: viewport,
        threshold: [0.45, 0.6, 0.75]
      });
      slides.forEach(function (slide) {
        observer.observe(slide);
      });
    };

    // ================================================================
    // SCORE LABELS
    // ================================================================

    var getScoreLabel = function getScoreLabel(score) {
      return gymOverallBand(score).label;
    };
    var initialiseScoreLabels = function initialiseScoreLabels() {
      var containers = document.querySelectorAll('[data-score-label-source]');
      containers.forEach(function (element) {
        var score = parseFloat(element.dataset.scoreLabelSource);
        if (!Number.isFinite(score)) {
          return;
        }
        element.textContent = getScoreLabel(score);
        element.style.color = gymOverallBand(score).color;
      });
    };

    // ================================================================
    // INITIALISE
    // ================================================================

    var initialise = function initialise() {
      initialiseRevealAnimations();
      initialiseHeroParallax();
      initialiseScores();
      initialiseOverallScore();
      initialiseMap();
      initialiseDirections();
      initialiseGalleryLightbox();
      initialiseGalleryProgress();
      initialiseScoreLabels();
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initialise, {
        once: true
      });
    } else {
      initialise();
    }
  })();
})();

// Homepage only: one entrance, then gentle pointer depth while in view.
function initHomepageHeroMotion() {
  if (!document.body.matches('.is-frontend.page-template-page-homepage')) return;
  var hero = document.querySelector('#main .hero-background');
  var background = hero === null || hero === void 0 ? void 0 : hero.querySelector(':scope > img');
  var portrait = hero === null || hero === void 0 ? void 0 : hero.querySelector('.hero-foreground > img');
  if (!hero || !background || !portrait || hero.dataset.motionInit) return;
  hero.dataset.motionInit = 'true';
  var reduced = matchMedia('(prefers-reduced-motion: reduce)');
  var desktop = matchMedia('(min-width: 992px) and (hover: hover) and (pointer: fine)');
  var visible = false;
  var entered = false;
  var frame = 0;
  var lastTime = 0;
  var scrollFrame = 0;
  var x = 0,
    y = 0,
    targetX = 0,
    targetY = 0;
  var animations = new Set();
  var enabled = function enabled() {
    return entered && visible && !document.hidden && !reduced.matches && desktop.matches;
  };
  var paint = function paint() {
    background.style.setProperty('--hero-depth-x', "".concat((x * 6).toFixed(3), "px"));
    background.style.setProperty('--hero-depth-y', "".concat((y * 6).toFixed(3), "px"));
    portrait.style.setProperty('--hero-depth-x', "".concat((x * 2).toFixed(3), "px"));
    portrait.style.setProperty('--hero-depth-y', "".concat((y * 2).toFixed(3), "px"));
  };
  var paintScroll = function paintScroll() {
    scrollFrame = 0;
    var rect = hero.getBoundingClientRect();
    var progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height)));
    var offset = visible && !document.hidden && !reduced.matches ? -progress * (desktop.matches ? 160 : 36) : 0;
    portrait.style.setProperty('--hero-scroll-y', "".concat(offset.toFixed(3), "px"));
    var glowOffset = visible && !document.hidden && !reduced.matches ? progress * (desktop.matches ? 70 : 24) : 0;
    hero.style.setProperty('--hero-glow-y', "".concat(glowOffset.toFixed(3), "px"));
  };
  var scheduleScroll = function scheduleScroll() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(paintScroll);
  };
  var reset = function reset() {
    cancelAnimationFrame(frame);
    frame = lastTime = 0;
    x = y = targetX = targetY = 0;
    paint();
    hero.classList.remove('hero-depth-active');
  };
  var _tick3 = function tick(time) {
    frame = 0;
    if (!enabled()) {
      reset();
      return;
    }
    var dt = lastTime ? Math.min(64, time - lastTime) : 16;
    lastTime = time;
    var smoothing = 1 - Math.exp(-dt / 160);
    x += (targetX - x) * smoothing;
    y += (targetY - y) * smoothing;
    paint();
    if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.001) {
      frame = requestAnimationFrame(_tick3);
    } else {
      x = targetX;
      y = targetY;
      paint();
      lastTime = 0;
      if (!targetX && !targetY) hero.classList.remove('hero-depth-active');
    }
  };
  var schedule = function schedule() {
    if (enabled() && !frame) frame = requestAnimationFrame(_tick3);
  };
  var stopEntrance = function stopEntrance() {
    animations.forEach(function (animation) {
      return animation.cancel();
    });
    animations.clear();
    entered = true;
    hero.classList.remove('hero-entering');
    scheduleScroll();
  };
  var entrance = function entrance() {
    if (entered || hero.classList.contains('hero-entering')) return;
    if (reduced.matches || typeof portrait.animate !== 'function') {
      entered = true;
      return;
    }
    hero.classList.add('hero-entering');
    var opacity = getComputedStyle(portrait).opacity;
    var bgAnimation = background.animate([{
      filter: 'brightness(.38)'
    }, {
      filter: 'brightness(.55)'
    }], {
      duration: 1800,
      easing: 'cubic-bezier(.22,1,.36,1)'
    });
    var portraitAnimation = portrait.animate([{
      opacity: 0,
      translate: '0 12px'
    }, {
      opacity: opacity,
      translate: '0 0'
    }], {
      duration: 1200,
      delay: 100,
      fill: 'backwards',
      easing: 'cubic-bezier(.22,1,.36,1)'
    });
    animations.add(bgAnimation);
    animations.add(portraitAnimation);
    Promise.allSettled([bgAnimation.finished, portraitAnimation.finished]).then(stopEntrance);
  };

  // Wait for actual image pixels, without ever hiding essential hero copy.
  Promise.allSettled([background, portrait].map(function (img) {
    var _img$decode;
    return (_img$decode = img.decode) === null || _img$decode === void 0 ? void 0 : _img$decode.call(img);
  })).then(function () {
    hero.classList.add('hero-motion-ready');
    if (visible && !document.hidden) entrance();
  });
  hero.addEventListener('pointermove', function (event) {
    if (!enabled() || event.pointerType !== 'mouse') return;
    var rect = hero.getBoundingClientRect();
    targetX = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    targetY = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    hero.classList.add('hero-depth-active');
    schedule();
  }, {
    passive: true
  });
  hero.addEventListener('pointerleave', function () {
    targetX = targetY = 0;
    schedule();
  }, {
    passive: true
  });
  var refresh = function refresh() {
    scheduleScroll();
    if (!enabled()) reset();
    if (reduced.matches || document.hidden) stopEntrance();
    if (visible && !document.hidden && hero.classList.contains('hero-motion-ready')) entrance();
  };
  reduced.addEventListener('change', refresh);
  desktop.addEventListener('change', refresh);
  document.addEventListener('visibilitychange', refresh);
  window.addEventListener('scroll', scheduleScroll, {
    passive: true
  });
  window.addEventListener('resize', function () {
    reset();
    scheduleScroll();
  }, {
    passive: true
  });
  window.addEventListener('pagehide', function () {
    reset();
    stopEntrance();
    cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
    portrait.style.setProperty('--hero-scroll-y', '0px');
    hero.style.setProperty('--hero-glow-y', '0px');
  });
  var observer = new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    refresh();
  }, {
    threshold: 0
  });
  observer.observe(hero);
}
document.addEventListener('DOMContentLoaded', initHomepageHeroMotion);

// Search
(function () {
  var root = document.querySelector('[data-dx-search]');
  if (!root) return;
  var input = root.querySelector('input[name="s"]');
  var clear = root.querySelector('.dx-search__clear');
  var sync = function sync() {
    clear.hidden = input.value.length === 0;
  };
  clear.addEventListener('click', function () {
    input.value = '';
    sync();
    input.focus();
  });
  input.addEventListener('input', sync);
  window.addEventListener('pageshow', sync);
  sync();
})();

// CV
(function () {
  var cv = document.querySelector('.cv-experience');
  if (!cv || !('IntersectionObserver' in window)) return;
  var links = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(cv.querySelectorAll('.cv-nav a[href^="#"]'));
  var sections = links.map(function (link) {
    return document.querySelector(link.getAttribute('href'));
  }).filter(Boolean);
  var update = function update() {
    var position = window.innerHeight * 0.35;
    var active = sections[0];
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= position) active = section;
    });
    links.forEach(function (link) {
      if (link.hash === '#' + active.id) link.setAttribute('aria-current', 'location');else link.removeAttribute('aria-current');
    });
  };
  var observer = new IntersectionObserver(update, {
    rootMargin: '-15% 0px -55% 0px',
    threshold: 0
  });
  sections.forEach(function (section) {
    return observer.observe(section);
  });
  window.addEventListener('hashchange', update);
  update();
})();

// Fitness
(function () {
  var root = document.querySelector('.dx-fitness');
  if (!root) return;
  var nav = root.querySelector('.dxf-nav');
  var links = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(nav.querySelectorAll('a[href^="#"]'));
  var sections = links.map(function (link) {
    return document.getElementById(link.hash.slice(1));
  }).filter(Boolean);
  var reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  var frame = 0;
  var scheduled = false;
  var offset = function offset() {
    return Math.max(parseFloat(getComputedStyle(nav).top) || 0, document.querySelector('#header').getBoundingClientRect().bottom) + nav.offsetHeight + 24;
  };
  var destination = function destination(target) {
    // On mobile the story photograph precedes its copy. Land on the story itself.
    var anchor = target.id === 'fitness-story' ? target.querySelector('.dxf-story-copy') : target;
    return Math.max(0, window.scrollY + anchor.getBoundingClientRect().top - offset());
  };
  var update = function update() {
    scheduled = false;
    var active = sections[0];
    var _iterator = _createForOfIteratorHelper(sections),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var section = _step.value;
        if (section.getBoundingClientRect().top <= offset() + 50) active = section;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    links.forEach(function (link) {
      if (link.hash === '#' + active.id) link.setAttribute('aria-current', 'location');else link.removeAttribute('aria-current');
    });
  };
  var cancel = function cancel() {
    cancelAnimationFrame(frame);
    frame = 0;
    delete root.dataset.sectionNavigating;
  };
  var navigate = function navigate(target) {
    cancel();
    root.dataset.sectionNavigating = 'true';
    var start = window.scrollY;
    var started = performance.now();
    var duration = reducedMotion.matches ? 0 : 850;
    var _step2 = function step(now) {
      var progress = duration ? Math.min(1, (now - started) / duration) : 1;
      var eased = 1 - Math.pow(1 - progress, 4);
      window.scrollTo({
        top: start + (destination(target) - start) * eased,
        behavior: 'instant'
      });
      if (progress < 1) frame = requestAnimationFrame(_step2);else {
        cancel();
        update();
      }
    };
    frame = requestAnimationFrame(_step2);
  };
  window.addEventListener('scroll', function () {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  }, {
    passive: true
  });
  window.addEventListener('resize', update);
  window.addEventListener('wheel', cancel, {
    passive: true
  });
  window.addEventListener('touchstart', cancel, {
    passive: true
  });
  window.addEventListener('keydown', function (event) {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Escape', ' '].includes(event.key)) cancel();
  });
  root.querySelectorAll('a[href^="#"]').forEach(function (link) {
    if (!sections.some(function (section) {
      return '#' + section.id === link.hash;
    })) return;
    link.addEventListener('click', function (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (location.hash !== link.hash) history.pushState(null, '', link.hash);
      navigate(document.getElementById(link.hash.slice(1)));
    });
  });
  window.addEventListener('hashchange', function () {
    var target = sections.find(function (section) {
      return '#' + section.id === location.hash;
    });
    if (target) navigate(target);
  });
  update();
})();

// Site presentation
(function () {
  var reduced = matchMedia('(prefers-reduced-motion: reduce)');
  var cards = document.querySelectorAll('.dx-principle');
  if (cards.length && !reduced.matches && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      return entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('dx-reveal-pending');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12
    });
    cards.forEach(function (card, i) {
      card.style.transitionDelay = "".concat(i % 3 * 90, "ms");
      card.classList.add('dx-reveal-pending');
      observer.observe(card);
    });
  }
  var nav = document.querySelector('.dx-section-nav');
  if (!nav) return;
  // A measured fixed bar avoids Safari's overflow/sticky ancestor inconsistencies.
  var slot = document.createElement('div');
  slot.className = 'dx-section-nav-slot';
  nav.before(slot);
  slot.append(nav);
  nav.style.marginBottom = '0';
  var dock = function dock() {
    var header = document.querySelector('#header');
    var top = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
    var rect = slot.getBoundingClientRect();
    if (!nav.classList.contains('is-docked')) {
      var natural = nav.getBoundingClientRect();
      slot.dataset.inset = String(natural.left - rect.left);
      slot.dataset.width = String(natural.width);
    }
    slot.style.height = nav.offsetHeight + 'px';
    var fixed = rect.top <= top;
    nav.classList.toggle('is-docked', fixed);
    nav.style.top = top + 'px';
    nav.style.left = fixed ? rect.left + Number(slot.dataset.inset) + 'px' : '';
    nav.style.width = fixed ? slot.dataset.width + 'px' : '';
  };
  window.addEventListener('resize', function () {
    nav.classList.remove('is-docked');
    nav.style.width = '';
    nav.style.left = '';
    dock();
  });
  var links = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(nav.querySelectorAll('a'));
  var targets = links.map(function (link) {
    return document.querySelector(link.hash);
  });
  var ticking = false;
  var update = function update() {
    ticking = false;
    dock();
    var edge = (parseFloat(getComputedStyle(nav).top) || 0) + nav.offsetHeight + 40;
    var index = 0;
    targets.forEach(function (target, i) {
      if (target.getBoundingClientRect().top <= edge) index = i;
    });
    links.forEach(function (link, i) {
      return i === index ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current');
    });
  };
  links.forEach(function (link, i) {
    return link.addEventListener('click', function (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      history.pushState(null, '', link.hash);
      var top = window.scrollY + targets[i].getBoundingClientRect().top - (parseFloat(nav.style.top) || 0) - nav.offsetHeight - 24;
      window.scrollTo({
        top: Math.max(0, top),
        behavior: reduced.matches ? 'instant' : 'smooth'
      });
    });
  });
  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, {
    passive: true
  });
  update();
})();

// Project enquiries
(function () {
  var form = document.querySelector('.enquiry-form');
  if (!form) return;
  var steps = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(form.querySelectorAll('[data-step]')),
    progress = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(form.querySelectorAll('.enquiry-progress li')),
    error = form.querySelector('.enquiry-error'),
    next = form.querySelector('[data-next]'),
    back = form.querySelector('[data-back]'),
    submit = form.querySelector('[type="submit"]');
  var step = 0,
    sending = false;
  var labels = {
    'design-build': 'What would you like to create?',
    wordpress: 'What do you need your WordPress website to do?',
    'custom-web': 'What would you like your website or application to do?',
    fixes: 'What’s not working, or what would you like improved?',
    support: 'What kind of ongoing help do you need?',
    unsure: 'Tell me about your idea or challenge.'
  };
  var storageKey = 'dxndre-project-enquiry';
  var save = function save() {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(new FormData(form))));
    } catch (_) {}
  };
  var review = function review() {
    var data = new FormData(form),
      selected = form.querySelector('[name="service"]:checked');
    form.querySelector('[data-brief-label]').textContent = labels[data.get('service')] || labels['design-build'];
    var target = form.querySelector('[data-review]');
    target.replaceChildren();
    for (var _i = 0, _arr = [['Service', selected === null || selected === void 0 ? void 0 : selected.parentElement.querySelector('strong').textContent], ['Project', data.get('brief')], ['Website', data.get('website')], ['Budget', data.get('budget')], ['Timing', data.get('timing')]]; _i < _arr.length; _i++) {
      var _arr$_i = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_arr[_i], 2),
        label = _arr$_i[0],
        value = _arr$_i[1];
      if (!value) continue;
      var row = document.createElement('p'),
        title = document.createElement('strong'),
        text = document.createElement('span');
      title.textContent = label;
      text.textContent = value;
      row.append(title, text);
      target.append(row);
    }
  };
  var show = function show(number) {
    var focus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    step = number;
    error.hidden = true;
    steps.forEach(function (el, index) {
      el.hidden = index !== step;
    });
    progress.forEach(function (el, index) {
      el.removeAttribute('aria-current');
      if (index === step) el.setAttribute('aria-current', 'step');
      el.classList.toggle('is-complete', index < step);
    });
    back.hidden = step === 0;
    next.hidden = step === 2;
    submit.hidden = step !== 2;
    review();
    if (focus) {
      var legend = steps[step].querySelector('legend');
      legend.tabIndex = -1;
      legend.focus();
    }
  };
  var validate = function validate(number) {
    var invalid = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(steps[number].querySelectorAll('input,select,textarea')).find(function (el) {
      return !el.checkValidity();
    });
    if (!invalid) return true;
    error.textContent = number === 0 ? 'Choose a service to continue.' : 'Please complete the required fields and check their format.';
    error.hidden = false;
    invalid.focus();
    invalid.reportValidity();
    return false;
  };
  try {
    var saved = JSON.parse(sessionStorage.getItem(storageKey) || '{}');
    var _loop = function _loop() {
      var _Object$entries$_i = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_Object$entries[_i2], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];
      var field = form.elements.namedItem(key);
      if (!field || key === 'company_url') return 1; // continue
      if (key === 'service') {
        (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(form.querySelectorAll('[name="service"]')).forEach(function (el) {
          return el.checked = el.value === value;
        });
      } else field.value = value;
    };
    for (var _i2 = 0, _Object$entries = Object.entries(saved); _i2 < _Object$entries.length; _i2++) {
      if (_loop()) continue;
    }
  } catch (_) {}
  if (new URLSearchParams(location.search).get('from_calculator') === '1') {
    try {
      var quote = JSON.parse(sessionStorage.getItem('dxndre-calculator-handoff') || 'null');
      if (quote && Number.isFinite(quote.total) && quote.total >= 0 && Array.isArray(quote.summary)) {
        var mapping = {
          design: 'design-build',
          landing_page: 'custom-web',
          development: 'custom-web',
          wp_development: 'wordpress',
          comprehensive: 'design-build',
          retainer: 'support',
          one_off: 'fixes'
        };
        (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(form.querySelectorAll('[name="service"]')).forEach(function (el) {
          return el.checked = el.value === (mapping[quote.service] || 'unsure');
        });
        if (!form.elements.brief.value) form.elements.brief.value = 'Calculator project outline:\n' + quote.summary.join('\n') + (quote.reference ? '\nEstimate reference: ' + quote.reference : '') + '\n\nIndicative estimate: ' + new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: 'GBP'
        }).format(quote.total) + (quote.monthly ? ' per month' : '') + ' (subject to confirming the brief).';
        if (!form.elements.name.value) form.elements.name.value = quote.name || '';
        if (!form.elements.company.value) form.elements.company.value = quote.company || '';
        if (!form.elements.budget.value) form.elements.budget.value = quote.total < 1000 ? 'Under £1,000' : quote.total < 3000 ? '£1,000–£3,000' : quote.total < 5000 ? '£3,000–£5,000' : quote.total < 10000 ? '£5,000–£10,000' : '£10,000+';
        save();
      }
    } catch (_) {}
  }
  var incoming = new URLSearchParams(location.search).get('enquiry_service');
  if (incoming && Object.hasOwn(labels, incoming)) (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(form.querySelectorAll('[name="service"]')).forEach(function (el) {
    return el.checked = el.value === incoming;
  });
  form.addEventListener('input', save);
  form.addEventListener('change', function () {
    save();
    review();
  });
  next.addEventListener('click', function () {
    if (validate(step)) show(step + 1);
  });
  back.addEventListener('click', function () {
    return show(step - 1);
  });
  form.querySelectorAll('[data-edit]').forEach(function (button) {
    return button.addEventListener('click', function () {
      return show(Number(button.dataset.edit));
    });
  });
  form.addEventListener('submit', /*#__PURE__*/function () {
    var _ref11 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee4(event) {
      var n, body, _result$data, response, result, success, _t3;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function (_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            event.preventDefault();
            if (!sending) {
              _context4.next = 1;
              break;
            }
            return _context4.abrupt("return");
          case 1:
            if (!(step < 2)) {
              _context4.next = 2;
              break;
            }
            if (validate(step)) show(step + 1);
            return _context4.abrupt("return");
          case 2:
            n = 0;
          case 3:
            if (!(n < 3)) {
              _context4.next = 5;
              break;
            }
            if (validate(n)) {
              _context4.next = 4;
              break;
            }
            show(n, false);
            validate(n);
            return _context4.abrupt("return");
          case 4:
            n++;
            _context4.next = 3;
            break;
          case 5:
            sending = true;
            submit.disabled = true;
            submit.textContent = 'Sending…';
            form.querySelector('.enquiry-status').textContent = 'Sending your enquiry…';
            error.hidden = true;
            body = new FormData(form);
            body.append('action', 'dx_project_enquiry');
            body.append('nonce', DX_ENQUIRY.nonce);
            _context4.prev = 6;
            _context4.next = 7;
            return fetch(DX_ENQUIRY.url, {
              method: 'POST',
              body: body,
              credentials: 'same-origin'
            });
          case 7:
            response = _context4.sent;
            _context4.next = 8;
            return response.json();
          case 8:
            result = _context4.sent;
            if (!(!response.ok || !result.success)) {
              _context4.next = 9;
              break;
            }
            throw new Error(((_result$data = result.data) === null || _result$data === void 0 ? void 0 : _result$data.message) || 'Please try again.');
          case 9:
            form.hidden = true;
            success = document.querySelector('.enquiry-success');
            success.hidden = false;
            success.focus();
            try {
              sessionStorage.removeItem(storageKey);
            } catch (_) {}
            _context4.next = 11;
            break;
          case 10:
            _context4.prev = 10;
            _t3 = _context4["catch"](6);
            error.textContent = _t3.message === 'Failed to fetch' ? 'Connection interrupted. Your answers are preserved; please try again.' : _t3.message;
            error.hidden = false;
            error.tabIndex = -1;
            error.focus();
          case 11:
            _context4.prev = 11;
            sending = false;
            submit.disabled = false;
            submit.textContent = 'Send project enquiry ↗';
            form.querySelector('.enquiry-status').textContent = '';
            return _context4.finish(11);
          case 12:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[6, 10, 11, 12]]);
    }));
    return function (_x5) {
      return _ref11.apply(this, arguments);
    };
  }());
  show(0, false);
})();

// London by bus
(function () {
  'use strict';

  var root = document.querySelector('.dxb');
  if (!root || !window.DXB) return;
  var $ = function $(s) {
    return root.querySelector(s);
  };
  var $$ = function $$(s) {
    return Array.from(root.querySelectorAll(s));
  };
  var input = $('#dxb-route-input'),
    status = $('#dxb-status'),
    result = $('#dxb-result');
  var initialPhoto = {
    src: $('#dxb-route-photo').src,
    alt: $('#dxb-route-photo').alt,
    caption: $('#dxb-route-caption').textContent
  };
  var controller,
    arrivalsController,
    debounce,
    timer,
    retryTicker,
    sequence = 0,
    current = null,
    tab = 'overview',
    failures = 0;
  var text = function text(tag, value, className) {
    var el = document.createElement(tag);
    el.textContent = value;
    if (className) el.className = className;
    return el;
  };
  var readSaved = function readSaved(key) {
    try {
      var v = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(v) ? v.filter(function (x) {
        return typeof x === 'string' && /^[A-Z0-9]{1,12}$/.test(x);
      }).slice(0, 12) : [];
    } catch (_unused2) {
      return [];
    }
  };
  var saveList = function saveList(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_unused3) {}
  };
  var recent = readSaved('dxb-recent-routes'),
    marked = readSaved('dxb-marked-vehicles'),
    arrivalRows = [];
  var recentBox = $('.dxb-recent');
  function routeSpacing(value) {
    return /^(?:[0-9]{1,3}|[A-Z][0-9]|[0-9][A-Z])$/i.test(value) ? 'tight' : 'normal';
  }
  input.addEventListener('input', function () {
    input.dataset.spacing = routeSpacing(input.value.trim());
  });
  function renderRecent() {
    recentBox.replaceChildren();
    recentBox.hidden = !recent.length;
    recent.forEach(function (route) {
      var _current;
      var b = text('button', route);
      b.type = 'button';
      b.dataset.route = route;
      b.dataset.spacing = routeSpacing(route);
      b.setAttribute('aria-pressed', String(((_current = current) === null || _current === void 0 ? void 0 : _current.name) === route));
      recentBox.append(b);
    });
  }
  recentBox.addEventListener('click', function (e) {
    var b = e.target.closest('[data-route]');
    if (b) search(b.dataset.route);
  });
  renderRecent();
  function remember(route) {
    recent = [route].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(recent.filter(function (r) {
      return r !== route;
    }))).slice(0, 12);
    saveList('dxb-recent-routes', recent);
    renderRecent();
  }
  function renderMarked() {
    var box = $('#dxb-marked');
    var expanded = new Set(Array.from(box.querySelectorAll('details[open]')).map(function (el) {
      return el.dataset.reg;
    }));
    box.replaceChildren();
    $('#dxb-tracking').replaceChildren();
    if (!marked.length) return;
    box.append(text('p', 'PINNED BUSES', 'dxb-pins-heading'), text('p', 'Saved on this browser · expand a bus for its latest arrivals.', 'dxb-small'));
    marked.forEach(function (reg) {
      var item = text('details', '', 'dxb-pinned-bus');
      item.dataset.reg = reg;
      var summary = text('summary', '📌 ' + formatRegistration(reg));
      summary.append(text('span', 'Arrivals +', 'dxb-pin-toggle'));
      var content = text('div', '', 'dxb-pin-content');
      var actions = text('div', '', 'dxb-pin-actions');
      var refresh = text('button', 'Refresh arrivals');
      refresh.type = 'button';
      var results = text('div', '', 'dxb-pin-results');
      results.setAttribute('aria-live', 'polite');
      refresh.addEventListener('click', function () {
        return trackVehicle(reg, results);
      });
      var remove = text('button', 'Dismiss pin ×');
      remove.type = 'button';
      remove.setAttribute('aria-label', 'Dismiss pin for ' + formatRegistration(reg));
      remove.addEventListener('click', function () {
        marked = marked.filter(function (v) {
          return v !== reg;
        });
        saveList('dxb-marked-vehicles', marked);
        renderMarked();
        if ($('#dxb-arrivals') && !$('#panel-arrivals').hidden) renderArrivals();
      });
      actions.append(refresh, remove);
      content.append(results, actions);
      item.append(summary, content);
      box.append(item);
      item.addEventListener('toggle', function () {
        summary.lastChild.textContent = item.open ? 'Collapse −' : 'Arrivals +';
        if (item.open) trackVehicle(reg, results);
      });
      item.open = expanded.has(reg);
    });
  }
  var trackingSequence = 0;
  function trackVehicle(_x6, _x7) {
    return _trackVehicle.apply(this, arguments);
  }
  function _trackVehicle() {
    _trackVehicle = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee8(reg, box) {
      var token, data, live, _t8;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function (_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            token = ++trackingSequence;
            box.dataset.request = String(token);
            box.replaceChildren(text('p', 'Checking ' + reg + '…', 'dxb-small'));
            _context8.prev = 1;
            _context8.next = 2;
            return request('vehicle/' + encodeURIComponent(reg) + '/arrivals');
          case 2:
            data = _context8.sent;
            if (!(!box.isConnected || box.dataset.request !== String(token))) {
              _context8.next = 3;
              break;
            }
            return _context8.abrupt("return");
          case 3:
            box.replaceChildren();
            live = data.arrivals.filter(function (a) {
              return Date.parse(a.expected) > Date.now() - 15000;
            });
            if (!live.length) box.append(text('p', 'No current TfL predictions for this vehicle. It may be off service or not reporting.', 'dxb-small'));
            live.forEach(function (a) {
              return box.append(text('p', "".concat(a.route, " \xB7 ").concat(a.stop, " \xB7 towards ").concat(a.destination, " \xB7 ").concat(new Date(a.expected).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit'
              })), 'dxb-small'));
            });
            box.append(text('small', 'Checked ' + new Date().toLocaleTimeString('en-GB') + ' · arrival predictions, not a GPS location'));
            _context8.next = 5;
            break;
          case 4:
            _context8.prev = 4;
            _t8 = _context8["catch"](1);
            if (box.isConnected && box.dataset.request === String(token)) box.replaceChildren(text('p', 'Vehicle predictions are temporarily unavailable. Try again shortly.', 'dxb-small'));
          case 5:
          case "end":
            return _context8.stop();
        }
      }, _callee8, null, [[1, 4]]);
    }));
    return _trackVehicle.apply(this, arguments);
  }
  var formatRegistration = function formatRegistration(reg) {
    return reg.replace(/^([A-Z]{2}\d{2})([A-Z]{3})$/, '$1 $2');
  };
  var vehicleCache = new Map();
  function deckType(value) {
    var v = String(value || '').toLowerCase();
    if (/single/.test(v) && /double/.test(v)) return null;
    if (/double[ -]?decker/.test(v)) return 'double';
    if (/single[ -]?decker/.test(v)) return 'single';
    return null;
  }
  function unusualAllocation(vehicle, profile) {
    if (!(vehicle !== null && vehicle !== void 0 && vehicle.found) || vehicle.withdrawn || !profile || profile.error) return null;
    var actual = deckType(vehicle.type),
      usual = deckType(profile.vehicle);
    return actual && usual && actual !== usual ? {
      actual: actual,
      usual: usual
    } : null;
  }
  function trackingBreakdown(_x8, _x9, _x0, _x1) {
    return _trackingBreakdown.apply(this, arguments);
  }
  function _trackingBreakdown() {
    _trackingBreakdown = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee0(data, profile, host, token) {
      var fleet, counts, ids, cursor, finished, summary, render;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function (_context1) {
        while (1) switch (_context1.prev = _context1.next) {
          case 0:
            render = function _render() {
              summary.replaceChildren();
              var _loop2 = function _loop2() {
                var type = _arr2[_i3];
                var unusual = counts[type] > 0 && deckType(profile.vehicle) && deckType(profile.vehicle) !== type;
                var pill = text('button', "".concat(unusual ? '⚠ ' : '').concat(counts[type], " ").concat(type.toUpperCase(), " ").concat(counts[type] === 1 ? 'DECKER' : 'DECKERS'), 'dxb-deck-total' + (unusual ? ' is-unusual' : ''));
                if (unusual) pill.title = "Unusual allocation \xB7 this route usually uses ".concat(deckType(profile.vehicle), " deckers");
                pill.type = 'button';
                pill.addEventListener('click', function () {
                  var _current3;
                  return openFleet(type, fleet[type], (_current3 = current) === null || _current3 === void 0 ? void 0 : _current3.name);
                });
                summary.append(pill);
              };
              for (var _i3 = 0, _arr2 = ['single', 'double']; _i3 < _arr2.length; _i3++) {
                _loop2();
              }
              if (counts.unknown) summary.append(text('span', "".concat(counts.unknown, " TYPE UNCONFIRMED"), 'dxb-deck-total'));
              if (finished < ids.length) summary.append(text('small', "Checking vehicle types \xB7 ".concat(finished, " of ").concat(ids.length), 'dxb-deck-progress'));else if (ids.length !== data.count) summary.append(text('small', 'Vehicle breakdown unavailable', 'dxb-deck-progress'));else if (ids.length) summary.append(text('small', 'Vehicle types · bustimes.org', 'dxb-deck-progress'));
            };
            fleet = {
              single: [],
              double: []
            };
            counts = {
              single: 0,
              double: 0,
              unknown: 0
            }, ids = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(new Set(data.vehicles || []));
            cursor = 0, finished = 0;
            summary = text('div', '', 'dxb-tracking-breakdown');
            host.append(summary);
            render();
            _context1.next = 1;
            return Promise.all(Array.from({
              length: Math.min(4, ids.length)
            }, /*#__PURE__*/(0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee9() {
              var _loop3;
              return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function (_context0) {
                while (1) switch (_context0.prev = _context0.next) {
                  case 0:
                    _loop3 = /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _loop3() {
                      var reg, type, vehicle, _t9;
                      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function (_context9) {
                        while (1) switch (_context9.prev = _context9.next) {
                          case 0:
                            reg = ids[cursor++];
                            type = null;
                            _context9.prev = 1;
                            if (!vehicleCache.has(reg)) vehicleCache.set(reg, request('vehicle/' + encodeURIComponent(reg)).catch(function (e) {
                              vehicleCache.delete(reg);
                              throw e;
                            }));
                            _context9.next = 2;
                            return vehicleCache.get(reg);
                          case 2:
                            vehicle = _context9.sent;
                            if (vehicle.found && !vehicle.withdrawn) type = deckType(vehicle.type);
                            if (type) fleet[type].push(_objectSpread(_objectSpread({}, vehicle), {}, {
                              registration: reg
                            }));
                            _context9.next = 4;
                            break;
                          case 3:
                            _context9.prev = 3;
                            _t9 = _context9["catch"](1);
                          case 4:
                            counts[type || 'unknown']++;
                            finished++;
                            if (token === sequence && host.isConnected) render();
                          case 5:
                          case "end":
                            return _context9.stop();
                        }
                      }, _loop3, null, [[1, 3]]);
                    });
                  case 1:
                    if (!(cursor < ids.length && token === sequence && host.isConnected)) {
                      _context0.next = 3;
                      break;
                    }
                    return _context0.delegateYield(_loop3(), "t0", 2);
                  case 2:
                    _context0.next = 1;
                    break;
                  case 3:
                  case "end":
                    return _context0.stop();
                }
              }, _callee9);
            }))));
          case 1:
          case "end":
            return _context1.stop();
        }
      }, _callee0);
    }));
    return _trackingBreakdown.apply(this, arguments);
  }
  function openFleet(type, vehicles, route) {
    var dialog = text('dialog', '', 'dxb-fleet-modal');
    dialog.setAttribute('aria-label', "".concat(type, " deckers tracking on route ").concat(route));
    var heading = text('h2', "".concat(type === 'single' ? 'Single' : 'Double', " Deckers \xB7 Route ").concat(route));
    var close = text('button', 'Close ×', 'dxb-mark-button');
    close.type = 'button';
    close.addEventListener('click', function () {
      return dialog.close();
    });
    dialog.append(close, heading);
    if (!vehicles.length) dialog.append(text('p', 'No confirmed vehicles of this type are currently tracking.'));
    vehicles.forEach(function (vehicle) {
      var card = text('article', '', 'dxb-fleet-item');
      var identity = text('header', '', 'dxb-fleet-identity');
      identity.append(text('h3', vehicle.model || 'Model unconfirmed'), text('p', formatRegistration(vehicle.registration) + (vehicle.fleet ? ' · ' + vehicle.fleet : ''), 'dxb-fleet-registration'));
      card.append(identity);
      var position = text('div', 'Checking destination and position…', 'dxb-fleet-position');
      card.append(position);
      var mark = text('button', '', 'dxb-mark-button');
      mark.type = 'button';
      var update = function update() {
        mark.textContent = (marked.includes(vehicle.registration) ? '📌 Pinned ' : '📌 Pin ') + formatRegistration(vehicle.registration);
        mark.setAttribute('aria-pressed', String(marked.includes(vehicle.registration)));
      };
      update();
      mark.addEventListener('click', function () {
        var reg = vehicle.registration;
        if (marked.includes(reg)) marked = marked.filter(function (item) {
          return item !== reg;
        });else if (marked.length < 12) marked.push(reg);else {
          mark.textContent = '12 buses pinned · remove one first';
          return;
        }
        saveList('dxb-marked-vehicles', marked);
        renderMarked();
        update();
        if ($('#dxb-arrivals') && !$('#panel-arrivals').hidden) renderArrivals();
      });
      card.append(mark);
      dialog.append(card);
      request('vehicle/' + encodeURIComponent(vehicle.registration) + '/arrivals').then(function (data) {
        var _data$arrivals;
        if (!dialog.isConnected) return;
        var next = (_data$arrivals = data.arrivals) === null || _data$arrivals === void 0 ? void 0 : _data$arrivals.find(function (item) {
          return item.route.toUpperCase() === String(route).toUpperCase();
        });
        position.replaceChildren();
        if (next) {
          position.append(vehicleField('Destination', next.destination), vehicleField(next.location ? 'Current location' : 'Next predicted stop', next.location || next.stop));
        } else position.textContent = 'Destination and current position unavailable.';
      }).catch(function () {
        position.textContent = 'Vehicle position temporarily unavailable.';
      });
    });
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) {
        var r = dialog.getBoundingClientRect();
        if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
      }
    });
    dialog.addEventListener('close', function () {
      return dialog.remove();
    }, {
      once: true
    });
    root.append(dialog);
    dialog.showModal();
  }

  // Animate native details while preserving keyboard activation and open state.
  root.addEventListener('click', function (event) {
    var summary = event.target.closest('.dxb-details > summary');
    if (!summary) return;
    var detail = summary.parentElement;
    event.preventDefault();
    if (detail.dataset.animating) return;
    var opening = !detail.open;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      detail.open = opening;
      return;
    }
    var start = detail.getBoundingClientRect().height;
    if (opening) detail.open = true;
    var end = opening ? detail.getBoundingClientRect().height : summary.getBoundingClientRect().height + parseFloat(getComputedStyle(detail).paddingTop) + parseFloat(getComputedStyle(detail).paddingBottom) + 2;
    detail.dataset.animating = 'true';
    detail.style.overflow = 'hidden';
    var animation = detail.animate([{
      height: start + 'px'
    }, {
      height: end + 'px'
    }], {
      duration: 300,
      easing: 'ease-in-out'
    });
    animation.onfinish = function () {
      detail.open = opening;
      detail.style.overflow = '';
      delete detail.dataset.animating;
    };
  });
  function vehicleField(label, value) {
    var kind = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var field = text('div', '', 'dxb-vehicle-field ' + kind);
    field.append(text('span', label, 'dxb-field-label'), text('strong', value, 'dxb-field-value'));
    return field;
  }
  function plateAge(reg) {
    var now = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
    var m = /^[A-Z]{2}(\d{2})[A-Z]{3}$/.exec(reg);
    if (!m) return null;
    var n = Number(m[1]);
    if (n === 0 || n === 50) return null;
    var year = 2000 + (n >= 51 ? n - 50 : n),
      start = new Date(year, n >= 51 ? 8 : 2, 1);
    if (start > now) return null;
    var months = (now.getFullYear() - year) * 12 + now.getMonth() - start.getMonth();
    return {
      label: months < 6 ? 'NEW · PLATE ESTIMATE' : '≈ ' + Math.floor(months / 12) + ' YEARS · PLATE ESTIMATE',
      kind: months < 6 ? 'is-new' : months >= 120 ? 'is-vintage' : 'is-age'
    };
  }
  function fillVehicle(_x10, _x11, _x12, _x13, _x14) {
    return _fillVehicle.apply(this, arguments);
  }
  function _fillVehicle() {
    _fillVehicle = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee1(reg, box, card, route, token) {
      var _current4, v, types, pills, age, pill, footer, link, surprise, note, _t0;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function (_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            box.replaceChildren(vehicleField('Registration', formatRegistration(reg), 'is-registration'), text('p', 'Loading fleet details…', 'dxb-small'));
            _context10.prev = 1;
            if (!vehicleCache.has(reg)) vehicleCache.set(reg, request('vehicle/' + encodeURIComponent(reg)).catch(function (e) {
              vehicleCache.delete(reg);
              throw e;
            }));
            _context10.next = 2;
            return vehicleCache.get(reg);
          case 2:
            v = _context10.sent;
            if (!(!box.isConnected || token !== sequence)) {
              _context10.next = 3;
              break;
            }
            return _context10.abrupt("return");
          case 3:
            box.replaceChildren(vehicleField('Registration', formatRegistration(reg), 'is-registration'), vehicleField('Fleet number', v.fleet || 'Not available'));
            types = text('div', '', 'dxb-vehicle-field');
            types.append(text('span', 'Vehicle type', 'dxb-field-label'));
            pills = text('div', '', 'dxb-vehicle-pills');
            [v.type, v.fuel].filter(Boolean).forEach(function (value) {
              var fuel = value === v.fuel,
                label = String(value).toUpperCase();
              var emoji = fuel ? /hydrogen/i.test(value) ? '💧' : /hybrid/i.test(value) ? '🌿' : /electric/i.test(value) ? '⚡️' : /diesel/i.test(value) ? '⛽' : '' : '🚌';
              var kind = fuel ? /hydrogen/i.test(value) ? 'hydrogen' : /hybrid/i.test(value) ? 'hybrid' : /electric/i.test(value) ? 'electric' : /diesel/i.test(value) ? 'diesel' : '' : deckType(value);
              var pill = text('span', '', 'dxb-vehicle-pill' + (kind ? ' is-' + kind : ''));
              if (emoji) {
                var icon = text('span', emoji, 'dxb-propulsion-icon');
                icon.setAttribute('aria-hidden', 'true');
                pill.append(icon);
              }
              pill.append(text('span', label));
              pills.append(pill);
            });
            if (!pills.childNodes.length) pills.append(text('span', 'Not available'));
            types.append(pills);
            box.append(types);
            age = plateAge(reg);
            if (age) {
              pill = text('span', age.label, 'dxb-vehicle-pill ' + age.kind);
              pill.title = 'Estimated from the original UK registration period; transferred plates may differ.';
              pills.append(pill);
            }
            box.append(vehicleField('USB charging', v.usb === true ? 'Available' : v.usb === false ? 'Not fitted' : 'Not confirmed'));
            footer = card.querySelector('.dxb-arrival-footer');
            footer.prepend(vehicleField('Make / model', v.model || 'Not available', 'is-model'));
            if (v.source) {
              link = sourceLink('View vehicle details ↗', v.source);
              link.classList.add('dxb-vehicle-source');
              link.title = 'Fleet information from bustimes.org';
              footer.insertBefore(link, footer.lastChild);
            }
            surprise = unusualAllocation(v, (_current4 = current) === null || _current4 === void 0 ? void 0 : _current4.profile);
            if (surprise) {
              card.classList.add('is-surprise');
              note = text('div', '', 'dxb-route-surprise');
              note.append(text('span', '✦ Route surprise', 'dxb-surprise-badge'), text('p', "A ".concat(surprise.actual, "-decker on the ").concat(route, "? Usually a ").concat(surprise.usual, "-decker route. \uD83D\uDC40")));
              card.prepend(note);
            }
            if (v.withdrawn) card.append(text('p', 'Fleet source lists this vehicle as withdrawn; live identification may need checking.', 'dxb-small dxb-fleet-warning'));
            _context10.next = 5;
            break;
          case 4:
            _context10.prev = 4;
            _t0 = _context10["catch"](1);
            if (box.isConnected) box.replaceChildren(vehicleField('Registration', formatRegistration(reg), 'is-registration'), text('p', 'Fleet number, type and model are temporarily unavailable.', 'dxb-small'));
          case 5:
          case "end":
            return _context10.stop();
        }
      }, _callee1, null, [[1, 4]]);
    }));
    return _fillVehicle.apply(this, arguments);
  }
  function renderArrivals() {
    var list = $('#dxb-arrivals');
    list.replaceChildren();
    var advanced = $('#dxb-advanced').checked;
    arrivalRows.forEach(function (a) {
      var _a$destinationStops;
      var card = text('div', '', 'dxb-arrival-card'),
        row = text('div', '', 'dxb-arrival-row');
      var minutes = Math.max(0, Math.ceil((Date.parse(a.expected) - Date.now()) / 60000));
      row.append(text('span', '⌖ ' + a.destination, 'dxb-arrival-destination'), text('strong', minutes < 1 ? 'Due' : minutes + ' min', 'dxb-arrival-time'));
      card.append(row);
      if (a.shortWorking) {
        var warning = text('span', '⚠ TERMINATES EARLY', 'dxb-short-working');
        warning.title = 'This bus terminates before the full route destination for this direction.';
        row.firstChild.append(warning);
      }
      var stopSelect = $('#dxb-stop');
      var options = Array.from((stopSelect === null || stopSelect === void 0 ? void 0 : stopSelect.options) || []).filter(function (option) {
        return option.value;
      });
      var selectedIndex = options.findIndex(function (option) {
        return option.value === (stopSelect === null || stopSelect === void 0 ? void 0 : stopSelect.value);
      });
      var fallbackStops = selectedIndex >= 0 ? options.length - selectedIndex - 1 : null;
      var destinationStops = (_a$destinationStops = a.destinationStops) !== null && _a$destinationStops !== void 0 ? _a$destinationStops : fallbackStops;
      if (destinationStops != null) {
        var fallback = a.destinationStops == null;
        var distance = text('small', destinationStops + (destinationStops === 1 ? ' STOP' : ' STOPS') + (fallback ? ' TO ROUTE END' : ''), 'dxb-stop-distance');
        if (fallback) distance.title = 'Counted from the selected stop to the final stop in this direction. A bus terminating early may serve fewer stops.';
        row.firstChild.append(distance);
      } else if (advanced) {
        row.firstChild.append(text('small', 'STOP COUNT UNAVAILABLE', 'dxb-stop-distance'));
      }
      var meta = text('div', '', 'dxb-arrival-meta'),
        position = text('div', '', 'dxb-arrival-position');
      if (a.location || a.nextStop) position.append(text('p', a.location ? 'Current location · ' + a.location : 'Next predicted stop · ' + a.nextStop, 'dxb-bus-position'));
      if (minutes < 1 || a.stopsAway != null) {
        var arriving = minutes < 1 || a.stopsAway === 0;
        var _distance = text('span', arriving ? 'ARRIVING' : '≈ ' + a.stopsAway + ' STOPS AWAY', 'dxb-stop-distance');
        _distance.style.opacity = String(arriving ? 1 : Math.max(0.45, 1 - a.stopsAway * 0.035));
        position.append(_distance);
      }
      if (position.childNodes.length) meta.append(position);
      if (advanced && a.trip) {
        var trip = text('p', '', 'dxb-trip');
        trip.append(text('span', 'TRIP', 'dxb-trip-label'), text('span', String(a.trip), 'dxb-trip-number'));
        meta.append(trip);
      }
      if (meta.childNodes.length) card.append(meta);
      var reg = (a.vehicle || '').replace(/\s/g, '').toUpperCase();
      if (advanced) {
        card.classList.add('has-details');
        var details = text('div', '', 'dxb-vehicle-details'),
          footer = text('div', '', 'dxb-arrival-footer');
        card.append(details, footer);
        if (/^[A-Z0-9]{3,12}$/.test(reg)) {
          var _current2;
          var button = text('button', marked.includes(reg) ? '📌 Pinned ' + formatRegistration(reg) : '📌 Pin ' + formatRegistration(reg), 'dxb-mark-button');
          button.type = 'button';
          button.setAttribute('aria-pressed', String(marked.includes(reg)));
          button.addEventListener('click', function () {
            if (marked.includes(reg)) marked = marked.filter(function (v) {
              return v !== reg;
            });else if (marked.length < 12) marked.push(reg);else {
              button.textContent = '12 buses pinned · remove one first';
              return;
            }
            saveList('dxb-marked-vehicles', marked);
            renderMarked();
            renderArrivals();
          });
          footer.append(button);
          fillVehicle(reg, details, card, ((_current2 = current) === null || _current2 === void 0 ? void 0 : _current2.name) || input.value, sequence);
        } else {
          details.append(text('p', 'Vehicle registration not supplied by TfL.', 'dxb-small'));
          footer.remove();
        }
      }
      list.append(card);
    });
    if (!arrivalRows.length) list.append(text('p', $('#dxb-stop').value ? 'No upcoming predictions for this route at this stop.' : 'Choose a stop for live arrival predictions.', 'dxb-small'));
  }
  function celebrateEnthusiastMode() {
    var _document$querySelect6;
    (_document$querySelect6 = document.querySelector('.dxb-confetti')) === null || _document$querySelect6 === void 0 || _document$querySelect6.remove();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var rect = $('#dxb-advanced').getBoundingClientRect(),
      burst = text('div', '', 'dxb-confetti');
    burst.setAttribute('aria-hidden', 'true');
    var colors = ['#d5ad63', '#ffdc91', '#ff6a00', '#ee0979', '#2657eb', '#de6161'];
    for (var i = 0; i < 38; i++) {
      var particle = document.createElement('i'),
        angle = Math.PI + i / 37 * Math.PI,
        distance = 70 + Math.random() * 150;
      particle.style.left = rect.left + rect.width / 2 + 'px';
      particle.style.top = rect.top + rect.height / 2 + 'px';
      particle.style.setProperty('--confetti-color', colors[i % colors.length]);
      particle.style.setProperty('--confetti-x', Math.cos(angle) * distance + 'px');
      particle.style.setProperty('--confetti-y', Math.sin(angle) * distance + 65 + 'px');
      particle.style.setProperty('--confetti-turn', Math.random() * 720 - 360 + 'deg');
      particle.style.animationDelay = Math.random() * 0.12 + 's';
      burst.append(particle);
    }
    document.body.append(burst);
    setTimeout(function () {
      return burst.remove();
    }, 1400);
  }
  $('#dxb-advanced').addEventListener('change', function () {
    var _document$querySelect7;
    if (!$('.dxb-arrival-retry') && !$('.dxb-schedule-state')) renderArrivals();
    if ($('#dxb-advanced').checked) celebrateEnthusiastMode();else (_document$querySelect7 = document.querySelector('.dxb-confetti')) === null || _document$querySelect7 === void 0 || _document$querySelect7.remove();
  });
  renderMarked();
  var aside = $('.dxb-explorer-aside'),
    main = $('.dxb-explorer-main');
  if (window.ResizeObserver) {
    new ResizeObserver(function () {
      aside.style.height = matchMedia('(max-width:700px)').matches ? '310px' : Math.ceil(main.getBoundingClientRect().height) + 'px';
    }).observe(main);
  }
  function request(_x15, _x16) {
    return _request.apply(this, arguments);
  }
  function _request() {
    _request = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee10(path, signal) {
      var response, data, error;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function (_context11) {
        while (1) switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 1;
            return fetch(DXB.api + path, {
              signal: signal,
              credentials: 'same-origin'
            });
          case 1:
            response = _context11.sent;
            _context11.next = 2;
            return response.json();
          case 2:
            data = _context11.sent;
            if (response.ok) {
              _context11.next = 3;
              break;
            }
            error = new Error(data.message || 'Information is temporarily unavailable. Please try again.');
            error.code = data.code;
            throw error;
          case 3:
            return _context11.abrupt("return", data);
          case 4:
          case "end":
            return _context11.stop();
        }
      }, _callee10);
    }));
    return _request.apply(this, arguments);
  }
  function announce(message) {
    var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    status.textContent = message;
    status.classList.toggle('is-error', error);
  }
  function stopArrivals() {
    var _arrivalsController;
    clearTimeout(timer);
    clearInterval(retryTicker);
    (_arrivalsController = arrivalsController) === null || _arrivalsController === void 0 || _arrivalsController.abort();
  }
  function activateTab(name) {
    tab = name;
    root.dataset.routeTab = name;
    $$('[data-tab]').forEach(function (button) {
      var active = button.dataset.tab === name;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    $$('[role=tabpanel]').forEach(function (panel) {
      return panel.hidden = panel.id !== "panel-".concat(name);
    });
    stopArrivals();
    if (name === 'news' && current) loadNews();
    if (name === 'discussion' && current) loadDiscussion();
    if (name === 'arrivals' && $('#dxb-stop').value && current) refreshArrivals();
  }
  $$('[data-tab]').forEach(function (button, i, buttons) {
    button.addEventListener('click', function () {
      return activateTab(button.dataset.tab);
    });
    button.addEventListener('keydown', function (event) {
      var next;
      if (event.key === 'ArrowRight') next = (i + 1) % buttons.length;
      if (event.key === 'ArrowLeft') next = (i + buttons.length - 1) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        buttons[next].focus();
        activateTab(buttons[next].dataset.tab);
      }
    });
  });
  function loadDiscussion() {
    return _loadDiscussion.apply(this, arguments);
  }
  function _loadDiscussion() {
    _loadDiscussion = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee11() {
      var token, box, data, _t1;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function (_context12) {
        while (1) switch (_context12.prev = _context12.next) {
          case 0:
            token = sequence, box = $('#dxb-comments');
            box.replaceChildren(text('p', 'Loading discussion…', 'dxb-small'));
            $('#dxb-comment-form').reset();
            $('#dxb-comment-status').textContent = '';
            _context12.prev = 1;
            _context12.next = 2;
            return request('discussion/' + encodeURIComponent(current.name));
          case 2:
            data = _context12.sent;
            if (!(token !== sequence)) {
              _context12.next = 3;
              break;
            }
            return _context12.abrupt("return");
          case 3:
            box.replaceChildren();
            if (!data.items.length) box.append(text('p', 'Start the conversation for this route.', 'dxb-small'));
            data.items.forEach(function (c) {
              var item = text('article', '', 'dxb-comment');
              item.append(text('strong', c.name), text('small', c.date), text('p', c.body));
              box.append(item);
            });
            _context12.next = 5;
            break;
          case 4:
            _context12.prev = 4;
            _t1 = _context12["catch"](1);
            if (token === sequence) box.replaceChildren(text('p', 'Discussion is temporarily unavailable.', 'dxb-small'));
          case 5:
          case "end":
            return _context12.stop();
        }
      }, _callee11, null, [[1, 4]]);
    }));
    return _loadDiscussion.apply(this, arguments);
  }
  $('#dxb-comment-form').addEventListener('submit', /*#__PURE__*/function () {
    var _ref12 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee5(e) {
      var form, button, token, response, data, _t4;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function (_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            e.preventDefault();
            if (current) {
              _context5.next = 1;
              break;
            }
            return _context5.abrupt("return");
          case 1:
            form = e.currentTarget, button = form.querySelector('button'), token = sequence;
            button.disabled = true;
            _context5.prev = 2;
            _context5.next = 3;
            return fetch(DXB.api + 'discussion/' + encodeURIComponent(current.name), {
              method: 'POST',
              credentials: 'same-origin',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(Object.fromEntries(new FormData(form)))
            });
          case 3:
            response = _context5.sent;
            _context5.next = 4;
            return response.json();
          case 4:
            data = _context5.sent;
            if (response.ok) {
              _context5.next = 5;
              break;
            }
            throw new Error(data.message);
          case 5:
            if (token === sequence) {
              form.reset();
              $('#dxb-comment-status').textContent = data.message;
            }
            _context5.next = 7;
            break;
          case 6:
            _context5.prev = 6;
            _t4 = _context5["catch"](2);
            if (token === sequence) $('#dxb-comment-status').textContent = _t4.message || 'Your comment could not be sent.';
          case 7:
            _context5.prev = 7;
            button.disabled = false;
            return _context5.finish(7);
          case 8:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[2, 6, 7, 8]]);
    }));
    return function (_x17) {
      return _ref12.apply(this, arguments);
    };
  }());
  var newsController, profileController, consultationController, consultationData;
  function sourceLink(label, url) {
    var a = text('a', label);
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    return a;
  }
  function dateLabel(raw) {
    if (!raw) return 'Date to be confirmed';
    var formatted = raw.replace(/\b(\d{1,2})[ .-]+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[ .-]+(\d{4}|\d{2})\b/gi, function (_, d, m, y) {
      var month = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(m.slice(0, 3).toLowerCase());
      var year = y.length === 2 ? 2000 + Number(y) : Number(y),
        dt = new Date(Date.UTC(year, month, Number(d), 12));
      return new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Europe/London'
      }).format(dt);
    });
    return formatted === raw && /\d/.test(raw) && !/\b\d{4}\b/.test(raw) ? raw + ' · year not supplied' : formatted;
  }
  function consultationCards() {
    var box = text('div', '', 'dxb-consultations');
    box.append(text('h3', 'Consultations'));
    if (!consultationData) {
      box.append(text('p', 'Checking the TfL consultation hub…', 'dxb-small'));
      return box;
    }
    if (consultationData.error) box.append(text('p', 'The consultation hub is temporarily unavailable.', 'dxb-small'));else if (!consultationData.items.length) box.append(text('p', 'No matching route mentions were found in the current hub listings.', 'dxb-small'));else consultationData.items.forEach(function (item) {
      var card = text('article', '', 'dxb-news-item');
      card.append.apply(card, [text('span', item.status, 'dxb-news-badge'), text('p', item.title)].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(item.published && Number.isFinite(Date.parse(item.published)) ? [text('small', 'Published ' + new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/London',
        timeZoneName: 'short'
      }).format(new Date(item.published)))] : []), [sourceLink('Read the proposal and check its status ↗', item.url)]));
      box.append(card);
    });
    if (consultationData.stale) box.append(text('p', 'Showing a saved consultation update.', 'dxb-small'));
    box.append(sourceLink('TfL Have Your Say ↗', 'https://haveyoursay.tfl.gov.uk/hub-page/londons-buses-taxis-and-phvs'));
    return box;
  }
  function loadConsultations(_x18, _x19) {
    return _loadConsultations.apply(this, arguments);
  }
  function _loadConsultations() {
    _loadConsultations = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee12(route, token) {
      var _consultationControll;
      var notice, data, button, old, _t10;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function (_context13) {
        while (1) switch (_context13.prev = _context13.next) {
          case 0:
            (_consultationControll = consultationController) === null || _consultationControll === void 0 || _consultationControll.abort();
            consultationController = new AbortController();
            consultationData = null;
            notice = $('#dxb-consultation-notice');
            notice.replaceChildren();
            _context13.prev = 1;
            _context13.next = 2;
            return request('consultations/' + encodeURIComponent(route), consultationController.signal);
          case 2:
            data = _context13.sent;
            if (!(token !== sequence)) {
              _context13.next = 3;
              break;
            }
            return _context13.abrupt("return");
          case 3:
            consultationData = data;
            if (data.items.length) {
              button = text('button', "".concat(data.items.length, " related TfL consultation").concat(data.items.length === 1 ? '' : 's', " \xB7 View in News \u2197"));
              button.type = 'button';
              button.addEventListener('click', function () {
                return activateTab('news');
              });
              notice.append(button);
            }
            _context13.next = 6;
            break;
          case 4:
            _context13.prev = 4;
            _t10 = _context13["catch"](1);
            if (!(token !== sequence || _t10.name === 'AbortError')) {
              _context13.next = 5;
              break;
            }
            return _context13.abrupt("return");
          case 5:
            consultationData = {
              error: true
            };
          case 6:
            old = $('#panel-news .dxb-consultations');
            if (old) old.replaceWith(consultationCards());
          case 7:
          case "end":
            return _context13.stop();
        }
      }, _callee12, null, [[1, 4]]);
    }));
    return _loadConsultations.apply(this, arguments);
  }
  function displayWorkings(workings) {
    var key = function key(w) {
      return w.destinations.trim().replace(/\s+/g, ' ').toLowerCase();
    };
    var main = new Set(workings.filter(function (w) {
      return w.label === 'Main service';
    }).map(key));
    var night = new Set(workings.filter(function (w) {
      return w.label === 'Night service';
    }).map(key));
    var combined = new Set((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(main).filter(function (k) {
      return night.has(k);
    }));
    var seen = new Set();
    return workings.flatMap(function (w) {
      var item = combined.has(key(w)) && ['Main service', 'Night service'].includes(w.label) ? _objectSpread(_objectSpread({}, w), {}, {
        label: 'Complete service · 24 hours'
      }) : w;
      var identity = key(item) + '|' + item.label;
      if (seen.has(identity)) return [];
      seen.add(identity);
      return [item];
    });
  }
  function applyProfile(profile, token) {
    var _profile$operators, _profile$garages, _profile$garages2, _profile$serviceNotes, _profile$workings;
    if (token !== sequence || !current) return;
    current.profile = profile;
    if (arrivalRows.length) renderArrivals();
    var box = $('#dxb-route-facts');
    box.replaceChildren();
    var unavailable = profile.error;
    box.append(text('p', "Operator \xB7 ".concat(((_profile$operators = profile.operators) === null || _profile$operators === void 0 ? void 0 : _profile$operators.join(' / ')) || 'Not confirmed').concat((_profile$garages = profile.garages) !== null && _profile$garages !== void 0 && _profile$garages.length ? ' – ' + profile.garages.join(' / ') : ''), 'dxb-overview-only dxb-operator-fact'), text('p', "Vehicles \xB7 ".concat((deckType(profile.vehicle) ? profile.vehicle + ' (usually)' : profile.vehicle) || 'Not confirmed'), 'dxb-vehicle-fact'));
    if (profile.frequency) {
      var frequency = text('div', '', 'dxb-fact-pills dxb-overview-only');
      profile.frequency.split(' · ').forEach(function (value) {
        return frequency.append(text('span', value, 'dxb-fact-pill'));
      });
      frequency.setAttribute('aria-label', 'Typical frequency');
      box.append(frequency);
    }
    if ((_profile$garages2 = profile.garages) !== null && _profile$garages2 !== void 0 && _profile$garages2.length || profile.frequency) {
      var _profile$garages3;
      var sources = text('small', '', 'dxb-fact-sources dxb-overview-only');
      if ((_profile$garages3 = profile.garages) !== null && _profile$garages3 !== void 0 && _profile$garages3.length) sources.append(sourceLink('Garage allocations ↗', 'http://www.londonbusroutes.net/garages.htm'));
      if (profile.frequency) sources.append(sourceLink('Typical frequencies ↗', 'http://www.londonbusroutes.net/details.htm'));
      box.append(sources);
    }
    if (profile.crossBoundary) {
      var badge = sourceLink('Cross-Boundary Route ↗', profile.crossBoundarySource);
      badge.className = 'dxb-pattern-badge is-boundary';
      box.append(badge);
    }
    if (profile.record) {
      var _badge = sourceLink('🏆 ' + profile.record, profile.recordSource);
      _badge.className = 'dxb-pattern-badge is-record';
      _badge.title = 'Community route records · February 2026 snapshot';
      box.append(_badge);
    }
    if (!current.archive) {
      var live = text('p', 'Checking live tracking…', 'dxb-live-count dxb-fact-pill');
      var trackingRow = text('div', '', 'dxb-tracking-row');
      trackingRow.append(live);
      box.append(trackingRow);
      request('running/' + encodeURIComponent(current.name)).then(function (data) {
        if (token === sequence && live.isConnected) {
          live.setAttribute('aria-label', data.count === 0 ? 'No buses are tracking' : data.count === 1 ? '1 bus is tracking' : data.count + ' buses are tracking');
          var total = text('strong', String(data.count), 'dxb-tracking-number'),
            label = text('span', data.count === 0 ? 'NO BUSES ARE TRACKING' : data.count === 1 ? 'BUS TRACKING' : 'BUSES TRACKING', 'dxb-tracking-label');
          live.replaceChildren(total, label);
          live.append(text('small', new Date(data.checked).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
          }) + ' · TFL PREDICTIONS', 'dxb-tracking-source'));
          trackingBreakdown(data, profile, trackingRow, token);
        }
      }).catch(function () {
        if (live.isConnected) live.textContent = 'Live bus count temporarily unavailable';
      });
    }
    if (profile.source) box.append(sourceLink("Route directory \xB7 ".concat(profile.updated), profile.source));
    if (profile.listingSource && current.archive) box.append(sourceLink('Route status source ↗', profile.listingSource));
    if (unavailable) box.append(text('small', 'Route directory temporarily unavailable.'));
    if (profile.circular || (_profile$serviceNotes = profile.serviceNotes) !== null && _profile$serviceNotes !== void 0 && _profile$serviceNotes.length) {
      var _profile$serviceNotes2, _profile$serviceNotes3;
      var patterns = text('div', '', 'dxb-service-patterns');
      if (profile.circular) patterns.append(text('span', '↻ Circular route', 'dxb-pattern-badge is-circular'));
      if ((_profile$serviceNotes2 = profile.serviceNotes) !== null && _profile$serviceNotes2 !== void 0 && _profile$serviceNotes2.length) {
        patterns.append(text('span', 'Limited service', 'dxb-pattern-badge is-limited'));
        profile.serviceNotes.forEach(function (note) {
          return patterns.append(text('p', note, 'dxb-pattern-note'));
        });
      }
      if (profile.name === 'SL6' && (_profile$serviceNotes3 = profile.serviceNotes) !== null && _profile$serviceNotes3 !== void 0 && _profile$serviceNotes3.length) patterns.append(text('p', 'Northbound AM · Southbound PM · Weekdays only', 'dxb-pattern-note'));
      box.append(patterns);
    }
    if (profile.badgeType === 'former' && profile.history) {
      var h = profile.history,
        _history = text('div', '', 'dxb-route-history');
      _history.append(text('strong', h.tenure ? 'In service · ' + h.tenure : 'Operating history'));
      if (h.start) _history.append(text('p', 'Introduced · ' + h.start));
      if (h.end) _history.append(text('p', 'Withdrawn · ' + h.end));
      if (!h.tenure) _history.append(text('p', 'Full tenure not confirmed: the introduction date is not available in the linked source.', 'dxb-muted'));
      if (h.source) _history.append(sourceLink('Route history ↗', h.source));
      box.append(_history);
    }
    var type = profile.badgeType === 'regular' && current.serviceType === '24hour' ? '24hour' : profile.badgeType || current.serviceType || 'regular';
    $('#dxb-route-number').dataset.serviceType = type;
    if ((profile.allDay || current.serviceType === '24hour') && !$('#dxb-route-type').textContent.includes('24-hour')) $('#dxb-route-type').append(' · 24-hour service');
    var labels = {
      mobility: 'Mobility route',
      former: 'Former route',
      future: 'Future route',
      temporary: 'Temporary route',
      carnival: 'Notting Hill Carnival special',
      shuttle: 'Silvertown Tunnel cycle shuttle'
    };
    if (labels[type]) $('#dxb-route-type').textContent = labels[type];
    if (profile.listingNotes && current.archive) $('#dxb-route-description').textContent = profile.listingNotes;
    if ((_profile$workings = profile.workings) !== null && _profile$workings !== void 0 && _profile$workings.length && !current.archive) {
      var endpoints = $('#dxb-endpoints');
      endpoints.replaceChildren();
      var seen = new Set();
      displayWorkings(profile.workings).forEach(function (w) {
        var key = w.destinations + '|' + w.label;
        if (seen.has(key)) return;
        seen.add(key);
        var row = text('div', w.circular ? w.destinations.split(' ↔ ')[0] + ' circular' : w.oneWay ? w.destinations.replace(' ↔ ', ' → ') : w.destinations, 'dxb-endpoint');
        row.append(text('span', w.label, 'dxb-working-badge' + (w.label === 'School variant' ? ' is-school' : '')));
        endpoints.append(row);
      });
      (profile.workingNotes || []).forEach(function (note) {
        var row = text('p', note, 'dxb-small dxb-muted');
        if (/school/i.test(note)) row.append(text('span', 'School variant', 'dxb-working-badge is-school'));else if (/short working/i.test(note)) row.append(text('span', 'Short working', 'dxb-working-badge'));
        endpoints.append(row);
      });
      var pairs = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(new Set(current.branches || []));
      if (pairs.length > 1) {
        var detail = document.createElement('details');
        detail.className = 'dxb-details';
        detail.append(text('summary', 'TfL destination pairs'));
        pairs.forEach(function (pair) {
          return detail.append(text('p', pair, 'dxb-small'));
        });
        endpoints.append(detail);
      }
    }
  }
  function loadProfile(_x20, _x21) {
    return _loadProfile.apply(this, arguments);
  }
  function _loadProfile() {
    _loadProfile = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee13(route, token) {
      var _profileController;
      var _t11, _t12, _t13;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function (_context14) {
        while (1) switch (_context14.prev = _context14.next) {
          case 0:
            (_profileController = profileController) === null || _profileController === void 0 || _profileController.abort();
            profileController = new AbortController();
            $('#dxb-route-facts').replaceChildren(text('p', 'Checking operator and vehicle details…'));
            _context14.prev = 1;
            _t11 = applyProfile;
            _t12 = current.profile;
            if (_t12) {
              _context14.next = 3;
              break;
            }
            _context14.next = 2;
            return request('profile/' + encodeURIComponent(route), profileController.signal);
          case 2:
            _t12 = _context14.sent;
          case 3:
            _t11(_t12, token);
            _context14.next = 5;
            break;
          case 4:
            _context14.prev = 4;
            _t13 = _context14["catch"](1);
            if (_t13.name !== 'AbortError') applyProfile({
              error: true
            }, token);
          case 5:
          case "end":
            return _context14.stop();
        }
      }, _callee13, null, [[1, 4]]);
    }));
    return _loadProfile.apply(this, arguments);
  }
  function loadNews() {
    return _loadNews.apply(this, arguments);
  }
  function _loadNews() {
    _loadNews = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee14() {
      var _newsController;
      var token, panel, data, source, link, _t14;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function (_context15) {
        while (1) switch (_context15.prev = _context15.next) {
          case 0:
            (_newsController = newsController) === null || _newsController === void 0 || _newsController.abort();
            newsController = new AbortController();
            token = sequence, panel = $('#panel-news');
            panel.replaceChildren(text('p', 'Checking route news…'));
            _context15.prev = 1;
            _context15.next = 2;
            return request('news/' + encodeURIComponent(current.name), newsController.signal);
          case 2:
            data = _context15.sent;
            if (!(token !== sequence)) {
              _context15.next = 3;
              break;
            }
            return _context15.abrupt("return");
          case 3:
            panel.replaceChildren(text('h3', 'Service changes'));
            panel.append(text('p', "".concat(data.stale ? 'Saved update · ' : '', "Source updated ").concat(data.updated, ". Planned changes are provisional."), 'dxb-small dxb-muted'));
            if (!data.items.length) panel.append(text('p', 'No entries for this route are listed in the current source. This is not a live disruption report.'));
            data.items.forEach(function (item) {
              var card = text('article', '', 'dxb-news-item');
              var meta = text('div', '', 'dxb-news-meta');
              meta.append(text('span', item.category, 'dxb-news-badge'), text('small', dateLabel(item.date)));
              card.append(meta, text('p', item.summary));
              var link = text('a', 'Read the full update ↗');
              link.href = item.url;
              link.target = '_blank';
              link.rel = 'noopener noreferrer';
              card.append(link);
              panel.append(card);
            });
            source = text('a', 'Source: London Bus Routes ↗');
            source.href = data.source;
            source.target = '_blank';
            source.rel = 'noopener noreferrer';
            panel.append(source, text('p', 'Dates are shown as supplied by the source; times are not published for date-only entries.', 'dxb-small dxb-muted'), consultationCards());
            _context15.next = 5;
            break;
          case 4:
            _context15.prev = 4;
            _t14 = _context15["catch"](1);
            if (_t14.name !== 'AbortError' && token === sequence) {
              panel.replaceChildren(text('p', 'Route news is temporarily unavailable. Please try the News tab again shortly.'));
              link = text('a', 'View London Bus Routes ↗');
              link.href = 'http://www.londonbusroutes.net/changes.htm';
              panel.append(link, consultationCards());
            }
          case 5:
          case "end":
            return _context15.stop();
        }
      }, _callee14, null, [[1, 4]]);
    }));
    return _loadNews.apply(this, arguments);
  }
  var hero = $('.dxb-hero-media'),
    baseHero = hero.querySelector('img');
  var routeLayers = [new Image(), new Image()];
  var activeLayer = 0,
    heroToken = 0,
    heroUrl = '';
  routeLayers.forEach(function (image) {
    image.alt = '';
    image.className = 'dxb-route-hero-image';
    hero.append(image);
  });
  function setHero(photo) {
    var token = ++heroToken;
    if (!photo) {
      heroUrl = '';
      root.classList.remove('has-route-photo');
      routeLayers.forEach(function (image) {
        return image.classList.remove('is-visible');
      });
      return;
    }
    if (heroUrl === photo.image) {
      updateScene();
      return;
    }
    var preload = new Image();
    preload.onload = /*#__PURE__*/(0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee6() {
      var next, layer, _t5, _t6;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function (_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 1;
            return preload.decode();
          case 1:
            _context6.next = 3;
            break;
          case 2:
            _context6.prev = 2;
            _t5 = _context6["catch"](0);
          case 3:
            if (!(token !== heroToken)) {
              _context6.next = 4;
              break;
            }
            return _context6.abrupt("return");
          case 4:
            next = 1 - activeLayer, layer = routeLayers[next];
            layer.classList.remove('is-visible');
            layer.src = preload.src;
            _context6.prev = 5;
            _context6.next = 6;
            return layer.decode();
          case 6:
            _context6.next = 8;
            break;
          case 7:
            _context6.prev = 7;
            _t6 = _context6["catch"](5);
          case 8:
            if (!(token !== heroToken)) {
              _context6.next = 9;
              break;
            }
            return _context6.abrupt("return");
          case 9:
            void layer.offsetWidth;
            requestAnimationFrame(function () {
              if (token !== heroToken) return;
              layer.classList.add('is-visible');
              routeLayers[activeLayer].classList.remove('is-visible');
              activeLayer = next;
              heroUrl = photo.image;
              root.classList.add('has-route-photo');
              updateScene();
            });
          case 10:
          case "end":
            return _context6.stop();
        }
      }, _callee6, null, [[0, 2], [5, 7]]);
    }));
    preload.onerror = function () {
      if (token === heroToken) setHero(null);
    };
    preload.src = photo.image;
  }
  function sizeHero() {
    root.style.setProperty('--hero-fade-height', $('#routes').offsetTop + 'px');
  }
  new ResizeObserver(sizeHero).observe($('.dxb-hero'));
  window.addEventListener('resize', sizeHero);
  sizeHero();
  function updateScene() {
    var nav = $('.dxb-nav'),
      diary = $('#bus-diary');
    if (nav) nav.classList.toggle('is-stuck', nav.getBoundingClientRect().top <= parseFloat(getComputedStyle(nav).top) + 1);
    var pastDiary = diary && diary.getBoundingClientRect().top <= window.innerHeight * 0.5;
    root.classList.toggle('has-route-photo', Boolean(heroUrl) && !pastDiary);
    if (!root.classList.contains('has-route-photo')) return;
    var number = $('#dxb-route-number');
    root.style.setProperty('--route-glow', getComputedStyle(number).backgroundColor);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) hero.style.setProperty('--parallax', Math.min(180, Math.max(0, -root.getBoundingClientRect().top) * 0.12) + 'px');
  }
  new MutationObserver(updateScene).observe($('#dxb-route-number'), {
    attributes: true,
    attributeFilter: ['data-service-type']
  });
  window.addEventListener('scroll', function () {
    return requestAnimationFrame(updateScene);
  }, {
    passive: true
  });
  window.addEventListener('resize', updateScene);
  updateScene();
  function related(route) {
    var photos = DXB.photos.map(function (p, i) {
      return _objectSpread(_objectSpread({}, p), {}, {
        index: i
      });
    }).filter(function (p) {
      return p.route.toUpperCase() === route;
    });
    var stories = DXB.journeys.filter(function (j) {
      return j.route.toUpperCase() === route;
    });
    var panel = $('#panel-photos');
    panel.replaceChildren();
    if (photos.length) {
      var grid = document.createElement('div');
      grid.className = 'dxb-route-photos';
      photos.forEach(function (p) {
        var button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-label', "Open ".concat(p.title));
        var img = new Image();
        img.src = p.image;
        img.alt = p.alt;
        button.append(img);
        button.addEventListener('click', function () {
          return openPhoto(p.index);
        });
        grid.append(button);
      });
      panel.append(grid);
    } else panel.append(text('p', "No photographs of ".concat(route, " in the archive yet."), 'dxb-small dxb-muted'));
    var storyPanel = $('#panel-stories');
    storyPanel.replaceChildren();
    if (stories.length) stories.forEach(function (j) {
      var a = document.createElement('a');
      a.href = j.url;
      a.className = 'dxb-route-story';
      a.append(text('span', "".concat(j.route, " \xB7 Journey notes \u2197")), text('small', "".concat(j.start, " \u2192 ").concat(j.end)));
      storyPanel.append(a);
    });else storyPanel.append(text('p', "This route's story is still to come. Explore the diary below.", 'dxb-small dxb-muted'));
    var photo = photos[0];
    setHero(photo);
    $('#dxb-route-photo').src = photo ? photo.image : initialPhoto.src;
    $('#dxb-route-photo').alt = photo ? photo.alt : initialPhoto.alt;
    $('#dxb-route-caption').textContent = photo ? "".concat(photo.title).concat(photo.date ? ' · ' + photo.date : '') : "From the wider archive \xB7 ".concat(initialPhoto.caption);
  }
  function search(_x22) {
    return _search.apply(this, arguments);
  }
  function _search() {
    _search = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee15(value) {
      var _controller2;
      var direction,
        preserveTab,
        token,
        route,
        _data$branches,
        data,
        directionSelect,
        serviceType,
        descriptions,
        description,
        number,
        stops,
        endpoints,
        branches,
        select,
        url,
        state,
        _args16 = arguments,
        _t15;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function (_context16) {
        while (1) switch (_context16.prev = _context16.next) {
          case 0:
            direction = _args16.length > 1 && _args16[1] !== undefined ? _args16[1] : 'inbound';
            preserveTab = _args16.length > 2 && _args16[2] !== undefined ? _args16[2] : false;
            clearTimeout(debounce);
            (_controller2 = controller) === null || _controller2 === void 0 || _controller2.abort();
            stopArrivals();
            token = ++sequence, route = value.trim().toUpperCase().replace(/\s+/g, '');
            ++heroToken;
            $('#dxb-route-state').hidden = true;
            result.hidden = true;
            current = null;
            $('#dxb-arrivals').replaceChildren(text('p', 'Choose a stop for live arrival predictions.', 'dxb-small'));
            $('#dxb-updated').textContent = '';
            $$('[data-route]').forEach(function (b) {
              return b.setAttribute('aria-pressed', String(b.dataset.route === route));
            });
            if (route) {
              _context16.next = 1;
              break;
            }
            setHero(null);
            announce('Choose a route to explore the London bus network.');
            return _context16.abrupt("return");
          case 1:
            if (/^[A-Z0-9]{1,6}$/.test(route)) {
              _context16.next = 2;
              break;
            }
            setHero(null);
            announce('Enter a route number such as 8, N8 or H32.', true);
            return _context16.abrupt("return");
          case 2:
            controller = new AbortController();
            announce("Finding route ".concat(route, "\u2026"));
            $('#routes').setAttribute('aria-busy', 'true');
            _context16.prev = 3;
            _context16.next = 4;
            return request("route/".concat(encodeURIComponent(route), "?direction=").concat(direction), controller.signal);
          case 4:
            data = _context16.sent;
            if (!(token !== sequence)) {
              _context16.next = 5;
              break;
            }
            return _context16.abrupt("return");
          case 5:
            current = data;
            input.value = route;
            remember(route);
            arrivalRows = [];
            directionSelect = $('#dxb-direction');
            directionSelect.replaceChildren(new Option('Loading destination…', data.direction));
            if (!data.archive) request('directions/' + encodeURIComponent(route), controller.signal).then(function (labels) {
              if (token !== sequence) return;
              directionSelect.replaceChildren();
              Object.entries(labels).forEach(function (_ref16) {
                var _ref17 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_ref16, 2),
                  key = _ref17[0],
                  label = _ref17[1];
                return directionSelect.add(new Option(label.replace(/^Towards\s+/i, 'to '), key));
              });
              directionSelect.value = data.direction;
              directionSelect.disabled = directionSelect.options.length < 2;
            }).catch(function () {
              if (token === sequence) {
                var _data$stops;
                directionSelect.replaceChildren(new Option('to ' + (((_data$stops = data.stops) === null || _data$stops === void 0 || (_data$stops = _data$stops.at(-1)) === null || _data$stops === void 0 ? void 0 : _data$stops.name) || 'destination'), data.direction));
                directionSelect.disabled = true;
              }
            });
            $('#dxb-route-number').textContent = data.name;
            input.dataset.spacing = routeSpacing(data.name);
            $('#dxb-route-number').dataset.spacing = /^(?:[0-9]{1,3}|[A-Z][0-9]|[0-9][A-Z])$/i.test(data.name) ? 'tight' : 'normal';
            serviceType = data.serviceType || (/^N\d+$/.test(route) ? 'night' : /^6\d{2}$/.test(route) && route !== '607' ? 'school' : 'regular');
            descriptions = {
              eastlondon: ['East London Transit', 'Connecting communities across east London.'],
              superloop: ['Superloop', 'Express connections across London.'],
              bakerloop: ['Bakerloop', 'A connection across south London.'],
              night: ['Night bus', 'Explore the route after dark.'],
              '24hour': ['24-hour bus', 'Discover the route, day and night.'],
              school: ['School bus', 'A route for the school-day journey.'],
              regular: ['London bus route', 'Another way to see the city.']
            }; // EL1 keeps the East London Transit identity alongside its all-day service.
            description = route === 'EL1' ? ['East London Transit · 24-hour service', 'Connecting east London, day and night.'] : descriptions[serviceType] || ['London bus route', 'Route directory information.'];
            $('#dxb-route-type').textContent = description[0];
            $('#dxb-route-description').textContent = description[1];
            number = $('#dxb-route-number');
            number.dataset.serviceType = 'regular';
            input.dataset.serviceType = serviceType;
            stops = data.stops || [];
            endpoints = $('#dxb-endpoints');
            endpoints.replaceChildren();
            branches = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_3__["default"])(new Set(((_data$branches = data.branches) === null || _data$branches === void 0 ? void 0 : _data$branches.filter(Boolean)) || []));
            if (!branches.length) branches.push(stops.length ? "".concat(stops[0].name, " \u2192 ").concat(stops[stops.length - 1].name) : 'Stop information is not available for this direction.');
            branches.forEach(function (branch) {
              return endpoints.append(text('div', branch, 'dxb-endpoint'));
            });
            $('#dxb-route-detail').textContent = data.archive ? 'Current TfL stop information is not available for this route identifier. See the directory source for its status.' : "".concat(stops.length, " stops returned for the ").concat(data.direction, " direction. Select Stops & arrivals to choose a stop.");
            $('#dxb-direction').value = data.direction;
            $('.dxb-selects').hidden = Boolean(data.archive);
            if (data.archive) $('#dxb-arrivals').replaceChildren(text('p', 'Live arrivals are unavailable for this route identifier. See Overview for its listed status.', 'dxb-small'));
            select = $('#dxb-stop');
            select.replaceChildren(new Option('Choose a stop', ''));
            stops.forEach(function (s) {
              return select.add(new Option(s.name, s.id));
            });
            consultationData = null;
            $('#dxb-consultation-notice').replaceChildren();
            loadProfile(route, token);
            loadConsultations(route, token);
            related(route);
            result.hidden = false;
            activateTab(preserveTab ? tab : 'overview');
            // Commit the neutral colour before beginning the gradual transition.
            void number.offsetWidth;
            requestAnimationFrame(function () {
              if (token === sequence) number.dataset.serviceType = serviceType;
            });
            announce("Route ".concat(route, " \xB7 ").concat(data.archive ? data.profile ? 'route directory information' : 'from the personal archive' : 'information from TfL'));
            url = new URL(location.href);
            url.searchParams.set('route', route);
            history.replaceState(null, '', url);
            _context16.next = 7;
            break;
          case 6:
            _context16.prev = 6;
            _t15 = _context16["catch"](3);
            if (_t15.name !== 'AbortError' && token === sequence) {
              setHero(null);
              announce(_t15.message, true);
              state = $('#dxb-route-state');
              state.replaceChildren(text('h3', _t15.code === 'route_not_found' ? 'Route Not Found' : 'Route Temporarily Unavailable'), text('p', _t15.message));
              state.hidden = false;
            }
          case 7:
            _context16.prev = 7;
            if (token === sequence) $('#routes').removeAttribute('aria-busy');
            return _context16.finish(7);
          case 8:
          case "end":
            return _context16.stop();
        }
      }, _callee15, null, [[3, 6, 7, 8]]);
    }));
    return _search.apply(this, arguments);
  }
  $('#dxb-search').addEventListener('submit', function (event) {
    event.preventDefault();
    search(input.value);
  });
  input.addEventListener('input', function () {
    var _controller;
    input.dataset.serviceType = 'regular';
    clearTimeout(debounce);
    (_controller = controller) === null || _controller === void 0 || _controller.abort();
    stopArrivals();
    ++sequence;
    current = null;
    result.hidden = true;
    $('#routes').removeAttribute('aria-busy');
    announce(input.value.trim() ? 'Searching…' : 'Choose a route to explore the London bus network.');
    debounce = setTimeout(function () {
      return search(input.value);
    }, 350);
  });
  $('#dxb-direction').addEventListener('change', function (event) {
    if (current) search(current.name, event.target.value, true);
  });
  $('#dxb-stop').addEventListener('change', function () {
    failures = 0;
    arrivalRows = [];
    stopArrivals();
    $('#dxb-arrivals').replaceChildren(text('p', 'Choose a stop for live arrival predictions.', 'dxb-small'));
    $('#dxb-updated').textContent = '';
    if ($('#dxb-stop').value) refreshArrivals();
  });
  function showScheduledArrival(_x23, _x24, _x25) {
    return _showScheduledArrival.apply(this, arguments);
  }
  function _showScheduledArrival() {
    _showScheduledArrival = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee16(route, stop, signal) {
      var host, box, _current5, data, _t16;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function (_context17) {
        while (1) switch (_context17.prev = _context17.next) {
          case 0:
            host = $('#dxb-arrivals'), box = text('div', '', 'dxb-schedule-state');
            box.append(text('strong', 'No live arrivals currently showing'), text('p', 'Checking the published timetable…'));
            host.replaceChildren(box);
            _context17.prev = 1;
            _context17.next = 2;
            return request("timetable/".concat(encodeURIComponent(route), "/").concat(encodeURIComponent(stop)), signal);
          case 2:
            data = _context17.sent;
            if (!(!box.isConnected || ((_current5 = current) === null || _current5 === void 0 ? void 0 : _current5.id) !== route || $('#dxb-stop').value !== stop)) {
              _context17.next = 3;
              break;
            }
            return _context17.abrupt("return");
          case 3:
            box.replaceChildren(text('span', 'TIMETABLE', 'dxb-schedule-label'));
            if (data.available) {
              box.append(text('strong', data.ended ? 'Last scheduled departure has passed' : 'Next scheduled bus'));
              if (data.ended) box.append(text('p', "The last bus was timetabled here at ".concat(data.last, " today.")));
              box.append(text('p', new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Europe/London',
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
              }).format(new Date(data.next)), 'dxb-schedule-time'));
              box.append(text('small', 'Timetabled, not a live prediction. Actual running and special services may differ.'));
            } else {
              box.append(text('strong', 'No live predictions available'), text('p', 'The next scheduled bus could not be confirmed. This does not necessarily mean service has finished.'));
            }
            if (data.source) box.append(sourceLink('View timetable ↗', data.source));
            _context17.next = 5;
            break;
          case 4:
            _context17.prev = 4;
            _t16 = _context17["catch"](1);
            if (_t16.name !== 'AbortError' && box.isConnected) box.replaceChildren(text('strong', 'No live predictions available'), text('p', 'The timetable is temporarily unavailable. Please check again shortly.'));
          case 5:
          case "end":
            return _context17.stop();
        }
      }, _callee16, null, [[1, 4]]);
    }));
    return _showScheduledArrival.apply(this, arguments);
  }
  function arrivalRetryState(delay) {
    var deadline = Date.now() + delay,
      box = text('div', '', 'dxb-arrival-retry');
    var icon = text('span', '↻', 'dxb-retry-icon');
    icon.setAttribute('aria-hidden', 'true');
    var body = text('div', '', 'dxb-retry-body');
    body.append(text('strong', 'Arrival predictions temporarily unavailable', 'dxb-retry-title'), text('p', 'We’ll try again automatically.', 'dxb-retry-description'));
    var countdown = text('span', '', 'dxb-retry-countdown');
    countdown.setAttribute('role', 'timer');
    countdown.setAttribute('aria-live', 'off');
    var track = text('div', '', 'dxb-retry-track'),
      fill = text('span', '', 'dxb-retry-fill');
    track.setAttribute('aria-hidden', 'true');
    track.append(fill);
    body.append(countdown, track);
    box.append(icon, body);
    $('#dxb-arrivals').replaceChildren(box);
    function tick() {
      if (!box.isConnected) {
        clearInterval(retryTicker);
        return;
      }
      var remaining = Math.max(0, deadline - Date.now());
      countdown.textContent = remaining ? 'Retrying in ' + Math.ceil(remaining / 1000) + 's' : 'Retrying now…';
      fill.style.width = 100 * (1 - remaining / delay) + '%';
    }
    tick();
    retryTicker = setInterval(tick, 250);
  }
  function refreshArrivals() {
    return _refreshArrivals.apply(this, arguments);
  }
  function _refreshArrivals() {
    _refreshArrivals = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee17() {
      var _current8;
      var route, stop, retry, _current6, data, _current7, delay, _t17;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function (_context18) {
        while (1) switch (_context18.prev = _context18.next) {
          case 0:
            stopArrivals();
            if (!(!current || tab !== 'arrivals' || document.hidden || !$('#dxb-stop').value)) {
              _context18.next = 1;
              break;
            }
            return _context18.abrupt("return");
          case 1:
            route = current.id, stop = $('#dxb-stop').value;
            arrivalsController = new AbortController();
            $('#dxb-updated').textContent = 'Updating arrival predictions…';
            retry = $('.dxb-arrival-retry');
            if (retry) {
              retry.classList.add('is-fetching');
              retry.querySelector('.dxb-retry-title').textContent = 'Fetching arrival predictions';
              retry.querySelector('.dxb-retry-description').textContent = 'Connecting to TfL…';
              retry.querySelector('.dxb-retry-countdown').textContent = 'Retrying now…';
            }
            _context18.prev = 2;
            _context18.next = 3;
            return request("arrivals/".concat(encodeURIComponent(route), "/").concat(encodeURIComponent(stop)), arrivalsController.signal);
          case 3:
            data = _context18.sent;
            if (!(((_current6 = current) === null || _current6 === void 0 ? void 0 : _current6.id) !== route || $('#dxb-stop').value !== stop)) {
              _context18.next = 4;
              break;
            }
            return _context18.abrupt("return");
          case 4:
            arrivalRows = data.arrivals.filter(function (a) {
              return Number.isFinite(Date.parse(a.expected)) && Date.parse(a.expected) >= Date.now() - 15000;
            });
            renderArrivals();
            if (!arrivalRows.length) showScheduledArrival(route, stop, arrivalsController.signal);
            $('#dxb-updated').textContent = "Updated ".concat(new Date().toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }), " \xB7 TfL predictions \xB7 refreshes every 30 seconds");
            failures = 0;
            _context18.next = 8;
            break;
          case 5:
            _context18.prev = 5;
            _t17 = _context18["catch"](2);
            if (!(_t17.name === 'AbortError')) {
              _context18.next = 6;
              break;
            }
            return _context18.abrupt("return");
          case 6:
            if (!(((_current7 = current) === null || _current7 === void 0 ? void 0 : _current7.id) !== route || tab !== 'arrivals' || $('#dxb-stop').value !== stop)) {
              _context18.next = 7;
              break;
            }
            return _context18.abrupt("return");
          case 7:
            $('#dxb-updated').textContent = '';
            failures++;
          case 8:
            if (((_current8 = current) === null || _current8 === void 0 ? void 0 : _current8.id) === route && tab === 'arrivals' && $('#dxb-stop').value === stop) {
              delay = Math.min(120000, 30000 * (failures + 1));
              if (failures) arrivalRetryState(delay);
              timer = setTimeout(refreshArrivals, delay);
            }
          case 9:
          case "end":
            return _context18.stop();
        }
      }, _callee17, null, [[2, 5]]);
    }));
    return _refreshArrivals.apply(this, arguments);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopArrivals();else if (tab === 'arrivals') refreshArrivals();
  });
  $('#dxb-share').addEventListener('click', /*#__PURE__*/(0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().mark(function _callee7() {
    var button, _t7;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_4___default().wrap(function (_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          button = $('#dxb-share');
          _context7.prev = 1;
          _context7.next = 2;
          return navigator.clipboard.writeText(location.href);
        case 2:
          button.textContent = 'Route link copied ✓';
          _context7.next = 4;
          break;
        case 3:
          _context7.prev = 3;
          _t7 = _context7["catch"](1);
          button.textContent = 'Copy the route URL from your address bar';
        case 4:
          setTimeout(function () {
            return button.textContent = 'Copy route link ↗';
          }, 4000);
        case 5:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[1, 3]]);
  })));
  var indexReady = request('routes').then(function (routes) {
    var list = $('#dxb-route-options');
    routes.forEach(function (route) {
      return list.append(new Option(route.name, route.name));
    });
  }).catch(function () {});
  var initialRoute = new URL(location.href).searchParams.get('route') || 'N8';
  indexReady.finally(function () {
    if (sequence === 0) search(initialRoute);
  });
  var photoFilter = 'all',
    photoIndex = 0,
    lastFocus = null;
  var lightbox = $('#dxb-lightbox');
  function filterPhotos() {
    var query = $('#dxb-photo-search').value.trim().toLowerCase();
    var count = 0;
    $$('#dxb-gallery [data-photo]').forEach(function (card) {
      var show = (photoFilter === 'all' || card.dataset.photoRoute === photoFilter) && card.dataset.photoSearch.includes(query);
      card.hidden = !show;
      if (show) count++;
    });
    $('#dxb-gallery-empty').hidden = count > 0;
  }
  $$('[data-photo-filter]').forEach(function (button) {
    return button.addEventListener('click', function () {
      photoFilter = button.dataset.photoFilter;
      $$('[data-photo-filter]').forEach(function (b) {
        return b.setAttribute('aria-pressed', String(b === button));
      });
      filterPhotos();
    });
  });
  $('#dxb-photo-search').addEventListener('input', filterPhotos);
  function renderPhoto() {
    var p = DXB.photos[photoIndex];
    if (!p) return;
    $('#dxb-lightbox-image').src = p.full;
    $('#dxb-lightbox-image').alt = p.alt;
    $('#dxb-lightbox-route').textContent = p.route ? "Route ".concat(p.route) : 'Bus photography';
    $('#dxb-lightbox-title').textContent = p.title;
    $('#dxb-lightbox-caption').textContent = p.caption;
    $('#dxb-lightbox-meta').textContent = [p.vehicle, p.operator, p.location, p.date].filter(Boolean).join(' · ');
    $('#dxb-lightbox-count').textContent = "".concat(photoIndex + 1, " / ").concat(DXB.photos.length);
  }
  function openPhoto(index) {
    photoIndex = index;
    renderPhoto();
    if (!lightbox.open) {
      lastFocus = document.activeElement;
      lightbox.showModal();
      document.body.classList.add('dxb-lightbox-open');
    }
  }
  $$('#dxb-gallery [data-photo]').forEach(function (card) {
    return card.addEventListener('click', function (event) {
      event.preventDefault();
      openPhoto(Number(card.dataset.photo));
    });
  });
  function movePhoto(delta) {
    photoIndex = (photoIndex + delta + DXB.photos.length) % DXB.photos.length;
    renderPhoto();
  }
  $('[data-lightbox-prev]').addEventListener('click', function () {
    return movePhoto(-1);
  });
  $('[data-lightbox-next]').addEventListener('click', function () {
    return movePhoto(1);
  });
  $('.dxb-close').addEventListener('click', function () {
    return lightbox.close();
  });
  lightbox.addEventListener('close', function () {
    var _lastFocus;
    document.body.classList.remove('dxb-lightbox-open');
    (_lastFocus = lastFocus) === null || _lastFocus === void 0 || _lastFocus.focus();
  });
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) {
      var r = lightbox.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) lightbox.close();
    }
  });
  lightbox.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') movePhoto(-1);
    if (event.key === 'ArrowRight') movePhoto(1);
  });
  var navLinks = $$('.dxb-nav a');
  var scrollScheduled = false;
  function updateNavigation() {
    var active = 'buses-overview';
    ['routes', 'bus-diary', 'photography', 'news'].forEach(function (id) {
      if (document.getElementById(id).getBoundingClientRect().top <= 145) active = id;
    });
    navLinks.forEach(function (a) {
      if (a.hash === "#".concat(active)) a.setAttribute('aria-current', 'location');else a.removeAttribute('aria-current');
    });
    scrollScheduled = false;
  }
  window.addEventListener('scroll', function () {
    if (!scrollScheduled) {
      scrollScheduled = true;
      requestAnimationFrame(updateNavigation);
    }
  }, {
    passive: true
  });
  updateNavigation();
})();

/***/ }),

/***/ "./assets/main.scss":
/*!**************************!*\
  !*** ./assets/main.scss ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _arrayLikeToArray; }
/* harmony export */ });
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _arrayWithHoles; }
/* harmony export */ });
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _arrayWithoutHoles; }
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(r);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _asyncToGenerator; }
/* harmony export */ });
function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
    });
  };
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/defineProperty.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _defineProperty; }
/* harmony export */ });
/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toPropertyKey.js */ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js");

function _defineProperty(e, r, t) {
  return (r = (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _iterableToArray; }
/* harmony export */ });
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _iterableToArrayLimit; }
/* harmony export */ });
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _nonIterableRest; }
/* harmony export */ });
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _nonIterableSpread; }
/* harmony export */ });
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _slicedToArray; }
/* harmony export */ });
/* harmony import */ var _arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js");
/* harmony import */ var _iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArrayLimit.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableRest.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js");




function _slicedToArray(r, e) {
  return (0,_arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(r) || (0,_iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__["default"])(r, e) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(r, e) || (0,_nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _toConsumableArray; }
/* harmony export */ });
/* harmony import */ var _arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithoutHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js");
/* harmony import */ var _iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableSpread.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js");




function _toConsumableArray(r) {
  return (0,_arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(r) || (0,_iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(r) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(r) || (0,_nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ toPrimitive; }
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");

function toPrimitive(t, r) {
  if ("object" != (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ toPropertyKey; }
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toPrimitive.js */ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js");


function toPropertyKey(t) {
  var i = (0,_toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__["default"])(t, "string");
  return "symbol" == (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(i) ? i : i + "";
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _typeof; }
/* harmony export */ });
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _unsupportedIterableToArray; }
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(r, a) : void 0;
  }
}


/***/ }),

/***/ "./node_modules/@popperjs/core/lib/createPopper.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/createPopper.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPopper: function() { return /* binding */ createPopper; },
/* harmony export */   detectOverflow: function() { return /* reexport safe */ _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_7__["default"]; },
/* harmony export */   popperGenerator: function() { return /* binding */ popperGenerator; }
/* harmony export */ });
/* harmony import */ var _dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom-utils/getCompositeRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dom-utils/listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/orderModifiers.js */ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js");
/* harmony import */ var _utils_debounce_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/debounce.js */ "./node_modules/@popperjs/core/lib/utils/debounce.js");
/* harmony import */ var _utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/mergeByName.js */ "./node_modules/@popperjs/core/lib/utils/mergeByName.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");









var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: (0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_8__.isElement)(reference) ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_2__["default"])(reference) : reference.contextElement ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_2__["default"])(reference.contextElement) : [],
          popper: (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_2__["default"])(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = (0,_utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_4__["default"])((0,_utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_6__["default"])([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: (0,_dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(reference, (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_3__["default"])(popper), state.options.strategy === 'fixed'),
          popper: (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_1__["default"])(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: (0,_utils_debounce_js__WEBPACK_IMPORTED_MODULE_5__["default"])(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref) {
        var name = _ref.name,
            _ref$options = _ref.options,
            options = _ref$options === void 0 ? {} : _ref$options,
            effect = _ref.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}
var createPopper = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/contains.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/contains.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ contains; }
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getBoundingClientRect; }
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isLayoutViewport.js */ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js");




function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }

  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (includeScale && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    scaleX = element.offsetWidth > 0 ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(clientRect.height) / element.offsetHeight || 1 : 1;
  }

  var _ref = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element) : window,
      visualViewport = _ref.visualViewport;

  var addVisualOffsets = !(0,_isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_3__["default"])() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width: width,
    height: height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x: x,
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getClippingRect; }
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _getViewportRect_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getViewportRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js");
/* harmony import */ var _getDocumentRect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js");
/* harmony import */ var _listScrollParents_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _getOffsetParent_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../utils/rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");















function getInnerBoundingClientRect(element, strategy) {
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_8__["default"])(element, false, strategy === 'fixed');
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === _enums_js__WEBPACK_IMPORTED_MODULE_0__.viewport ? (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_12__["default"])((0,_getViewportRect_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element, strategy)) : (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_7__.isElement)(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_12__["default"])((0,_getDocumentRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__["default"])(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = (0,_listScrollParents_js__WEBPACK_IMPORTED_MODULE_3__["default"])((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_9__["default"])(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_6__["default"])(element).position) >= 0;
  var clipperElement = canEscapeClipping && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_7__.isHTMLElement)(element) ? (0,_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_4__["default"])(element) : element;

  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_7__.isElement)(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_7__.isElement)(clippingParent) && (0,_contains_js__WEBPACK_IMPORTED_MODULE_10__["default"])(clippingParent, clipperElement) && (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_11__["default"])(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.top, accRect.top);
    accRect.right = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.right, accRect.right);
    accRect.bottom = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.bottom, accRect.bottom);
    accRect.left = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getCompositeRect; }
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getNodeScroll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getNodeScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");









function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_7__.round)(rect.width) / element.offsetWidth || 1;
  var scaleY = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_7__.round)(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_3__.isHTMLElement)(offsetParent);
  var offsetParentIsScaled = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_3__.isHTMLElement)(offsetParent) && isElementScaled(offsetParent);
  var documentElement = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__["default"])(offsetParent);
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_2__["default"])(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_6__["default"])(documentElement)) {
      scroll = (0,_getNodeScroll_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent);
    }

    if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_3__.isHTMLElement)(offsetParent)) {
      offsets = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_4__["default"])(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getComputedStyle; }
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getComputedStyle(element) {
  return (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element).getComputedStyle(element);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getDocumentElement; }
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return (((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getDocumentRect; }
/* harmony export */ });
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");




 // Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var winScroll = (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_4__.max)(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_4__.max)(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element);
  var y = -winScroll.scrollTop;

  if ((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(body || html).direction === 'rtl') {
    x += (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_4__.max)(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getHTMLElementScroll; }
/* harmony export */ });
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getLayoutRect; }
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
 // Returns the layout rect of an element relative to its offsetParent. Layout
// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getNodeName; }
/* harmony export */ });
function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getNodeScroll; }
/* harmony export */ });
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getHTMLElementScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js");




function getNodeScroll(node) {
  if (node === (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(node) || !(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(node)) {
    return (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node);
  } else {
    return (0,_getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node);
  }
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getOffsetParent; }
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _isTableElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./isTableElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _utils_userAgent_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/userAgent.js */ "./node_modules/@popperjs/core/lib/utils/userAgent.js");








function getTrueOffsetParent(element) {
  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_3__.isHTMLElement)(element) || // https://github.com/popperjs/popper-core/issues/837
  (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = /firefox/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_6__["default"])());
  var isIE = /Trident/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_6__["default"])());

  if (isIE && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_3__.isHTMLElement)(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = (0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_5__["default"])(element);

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_3__.isShadowRoot)(currentNode)) {
    currentNode = currentNode.host;
  }

  while ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_3__.isHTMLElement)(currentNode) && ['html', 'body'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(currentNode)) < 0) {
    var css = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_2__["default"])(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && (0,_isTableElement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_2__["default"])(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent) === 'html' || (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent) === 'body' && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_2__["default"])(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getParentNode; }
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");



function getParentNode(element) {
  if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_2__.isShadowRoot)(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element) // fallback

  );
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getScrollParent; }
/* harmony export */ });
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");




function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_3__.isHTMLElement)(node) && (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_1__["default"])(node)) {
    return node;
  }

  return getScrollParent((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getViewportRect; }
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isLayoutViewport.js */ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js");




function getViewportRect(element, strategy) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = (0,_isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_3__["default"])();

    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element),
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js":
/*!****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindow.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getWindow; }
/* harmony export */ });
function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getWindowScroll; }
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getWindowScroll(node) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getWindowScrollBarX; }
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");



function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)).left + (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element).scrollLeft;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isElement: function() { return /* binding */ isElement; },
/* harmony export */   isHTMLElement: function() { return /* binding */ isHTMLElement; },
/* harmony export */   isShadowRoot: function() { return /* binding */ isShadowRoot; }
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");


function isElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ isLayoutViewport; }
/* harmony export */ });
/* harmony import */ var _utils_userAgent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/userAgent.js */ "./node_modules/@popperjs/core/lib/utils/userAgent.js");

function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_0__["default"])());
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ isScrollParent; }
/* harmony export */ });
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ isTableElement; }
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element)) >= 0;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js":
/*!************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ listScrollParents; }
/* harmony export */ });
/* harmony import */ var _getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");




/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = (0,_getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_3__["default"])(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_1__["default"])(target)));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/enums.js":
/*!**************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/enums.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   afterMain: function() { return /* binding */ afterMain; },
/* harmony export */   afterRead: function() { return /* binding */ afterRead; },
/* harmony export */   afterWrite: function() { return /* binding */ afterWrite; },
/* harmony export */   auto: function() { return /* binding */ auto; },
/* harmony export */   basePlacements: function() { return /* binding */ basePlacements; },
/* harmony export */   beforeMain: function() { return /* binding */ beforeMain; },
/* harmony export */   beforeRead: function() { return /* binding */ beforeRead; },
/* harmony export */   beforeWrite: function() { return /* binding */ beforeWrite; },
/* harmony export */   bottom: function() { return /* binding */ bottom; },
/* harmony export */   clippingParents: function() { return /* binding */ clippingParents; },
/* harmony export */   end: function() { return /* binding */ end; },
/* harmony export */   left: function() { return /* binding */ left; },
/* harmony export */   main: function() { return /* binding */ main; },
/* harmony export */   modifierPhases: function() { return /* binding */ modifierPhases; },
/* harmony export */   placements: function() { return /* binding */ placements; },
/* harmony export */   popper: function() { return /* binding */ popper; },
/* harmony export */   read: function() { return /* binding */ read; },
/* harmony export */   reference: function() { return /* binding */ reference; },
/* harmony export */   right: function() { return /* binding */ right; },
/* harmony export */   start: function() { return /* binding */ start; },
/* harmony export */   top: function() { return /* binding */ top; },
/* harmony export */   variationPlacements: function() { return /* binding */ variationPlacements; },
/* harmony export */   viewport: function() { return /* binding */ viewport; },
/* harmony export */   write: function() { return /* binding */ write; }
/* harmony export */ });
var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/index.js":
/*!**************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/index.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   afterMain: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterMain; },
/* harmony export */   afterRead: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterRead; },
/* harmony export */   afterWrite: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterWrite; },
/* harmony export */   applyStyles: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.applyStyles; },
/* harmony export */   arrow: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.arrow; },
/* harmony export */   auto: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.auto; },
/* harmony export */   basePlacements: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements; },
/* harmony export */   beforeMain: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeMain; },
/* harmony export */   beforeRead: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeRead; },
/* harmony export */   beforeWrite: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeWrite; },
/* harmony export */   bottom: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom; },
/* harmony export */   clippingParents: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.clippingParents; },
/* harmony export */   computeStyles: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.computeStyles; },
/* harmony export */   createPopper: function() { return /* reexport safe */ _popper_js__WEBPACK_IMPORTED_MODULE_4__.createPopper; },
/* harmony export */   createPopperBase: function() { return /* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_2__.createPopper; },
/* harmony export */   createPopperLite: function() { return /* reexport safe */ _popper_lite_js__WEBPACK_IMPORTED_MODULE_5__.createPopper; },
/* harmony export */   detectOverflow: function() { return /* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_3__["default"]; },
/* harmony export */   end: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.end; },
/* harmony export */   eventListeners: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.eventListeners; },
/* harmony export */   flip: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.flip; },
/* harmony export */   hide: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.hide; },
/* harmony export */   left: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.left; },
/* harmony export */   main: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.main; },
/* harmony export */   modifierPhases: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.modifierPhases; },
/* harmony export */   offset: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.offset; },
/* harmony export */   placements: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.placements; },
/* harmony export */   popper: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper; },
/* harmony export */   popperGenerator: function() { return /* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_2__.popperGenerator; },
/* harmony export */   popperOffsets: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.popperOffsets; },
/* harmony export */   preventOverflow: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.preventOverflow; },
/* harmony export */   read: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.read; },
/* harmony export */   reference: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.reference; },
/* harmony export */   right: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.right; },
/* harmony export */   start: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.start; },
/* harmony export */   top: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.top; },
/* harmony export */   variationPlacements: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements; },
/* harmony export */   viewport: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.viewport; },
/* harmony export */   write: function() { return /* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.write; }
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/index.js */ "./node_modules/@popperjs/core/lib/modifiers/index.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _popper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./popper.js */ "./node_modules/@popperjs/core/lib/popper.js");
/* harmony import */ var _popper_lite_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./popper-lite.js */ "./node_modules/@popperjs/core/lib/popper-lite.js");

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/applyStyles.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

 // This modifier takes the styles prepared by the `computeStyles` modifier
// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect,
  requires: ['computeStyles']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/arrow.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/arrow.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dom-utils/contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");








 // eslint-disable-next-line import/no-unused-modules

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return (0,_utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_6__["default"])(typeof padding !== 'number' ? padding : (0,_utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_7__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_8__.basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state.placement);
  var axis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(basePlacement);
  var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_8__.left, _enums_js__WEBPACK_IMPORTED_MODULE_8__.right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arrowElement);
  var minProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_8__.top : _enums_js__WEBPACK_IMPORTED_MODULE_8__.left;
  var maxProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_8__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_8__.right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_3__["default"])(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_5__.within)(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (!(0,_dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state.elements.popper, arrowElement)) {
    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/computeStyles.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mapToStyles: function() { return /* binding */ mapToStyles; }
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");







 // eslint-disable-next-line import/no-unused-modules

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref, win) {
  var x = _ref.x,
      y = _ref.y;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_7__.round)(x * dpr) / dpr || 0,
    y: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_7__.round)(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = _enums_js__WEBPACK_IMPORTED_MODULE_0__.left;
  var sideY = _enums_js__WEBPACK_IMPORTED_MODULE_0__.top;
  var win = window;

  if (adaptive) {
    var offsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_1__["default"])(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(popper)) {
      offsetParent = (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(popper);

      if ((0,_dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_0__.top || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_0__.left || placement === _enums_js__WEBPACK_IMPORTED_MODULE_0__.right) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_0__.end) {
      sideY = _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_0__.left || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_0__.top || placement === _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_0__.end) {
      sideX = _enums_js__WEBPACK_IMPORTED_MODULE_0__.right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }, (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(popper)) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_5__["default"])(state.placement),
    variation: (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/eventListeners.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
 // eslint-disable-next-line import/no-unused-modules

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/flip.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/flip.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getOppositePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getOppositeVariationPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/computeAutoPlacement.js */ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");






 // eslint-disable-next-line import/no-unused-modules

function getExpandedFallbackPlacements(placement) {
  if ((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_5__.auto) {
    return [];
  }

  var oppositePlacement = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);
  return [(0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(placement), oppositePlacement, (0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [(0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_5__.auto ? (0,_utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement);

    var isStartVariation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_6__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start;
    var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_5__.top, _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_3__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.right : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left : isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(mainVariationSide);
    }

    var altVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/hide.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/hide.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");



function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom, _enums_js__WEBPACK_IMPORTED_MODULE_0__.left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/index.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyStyles: function() { return /* reexport safe */ _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__["default"]; },
/* harmony export */   arrow: function() { return /* reexport safe */ _arrow_js__WEBPACK_IMPORTED_MODULE_1__["default"]; },
/* harmony export */   computeStyles: function() { return /* reexport safe */ _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"]; },
/* harmony export */   eventListeners: function() { return /* reexport safe */ _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__["default"]; },
/* harmony export */   flip: function() { return /* reexport safe */ _flip_js__WEBPACK_IMPORTED_MODULE_4__["default"]; },
/* harmony export */   hide: function() { return /* reexport safe */ _hide_js__WEBPACK_IMPORTED_MODULE_5__["default"]; },
/* harmony export */   offset: function() { return /* reexport safe */ _offset_js__WEBPACK_IMPORTED_MODULE_6__["default"]; },
/* harmony export */   popperOffsets: function() { return /* reexport safe */ _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"]; },
/* harmony export */   preventOverflow: function() { return /* reexport safe */ _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__["default"]; }
/* harmony export */ });
/* harmony import */ var _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _arrow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _flip_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _hide_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _offset_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");










/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/offset.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/offset.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   distanceAndSkiddingToXY: function() { return /* binding */ distanceAndSkiddingToXY; }
/* harmony export */ });
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");

 // eslint-disable-next-line import/no-unused-modules

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);
  var invertDistance = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = _enums_js__WEBPACK_IMPORTED_MODULE_1__.placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");


function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = (0,_utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getAltAxis.js */ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils/getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");












function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_7__["default"])(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state.placement);
  var variation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_8__["default"])(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(basePlacement);
  var altAxis = (0,_utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_3__["default"])(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.top : _enums_js__WEBPACK_IMPORTED_MODULE_0__.left;
    var altSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_0__.right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min = offset + overflow[mainSide];
    var max = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_0__.start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_0__.start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : (0,_utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_9__["default"])();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_4__.within)(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_4__.within)(tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.min)(min, tetherMin) : min, offset, tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.max)(max, tetherMax) : max);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.top : _enums_js__WEBPACK_IMPORTED_MODULE_0__.left;

    var _altSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_0__.right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_4__.withinMaxClamp)(_tetherMin, _offset, _tetherMax) : (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_4__.within)(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper-lite.js":
/*!********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper-lite.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPopper: function() { return /* binding */ createPopper; },
/* harmony export */   defaultModifiers: function() { return /* binding */ defaultModifiers; },
/* harmony export */   detectOverflow: function() { return /* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_1__["default"]; },
/* harmony export */   popperGenerator: function() { return /* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_0__.popperGenerator; }
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");





var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_3__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_4__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_5__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_0__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper.js":
/*!***************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyStyles: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.applyStyles; },
/* harmony export */   arrow: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.arrow; },
/* harmony export */   computeStyles: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.computeStyles; },
/* harmony export */   createPopper: function() { return /* binding */ createPopper; },
/* harmony export */   createPopperLite: function() { return /* reexport safe */ _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__.createPopper; },
/* harmony export */   defaultModifiers: function() { return /* binding */ defaultModifiers; },
/* harmony export */   detectOverflow: function() { return /* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_1__["default"]; },
/* harmony export */   eventListeners: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.eventListeners; },
/* harmony export */   flip: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.flip; },
/* harmony export */   hide: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.hide; },
/* harmony export */   offset: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.offset; },
/* harmony export */   popperGenerator: function() { return /* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_0__.popperGenerator; },
/* harmony export */   popperOffsets: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.popperOffsets; },
/* harmony export */   preventOverflow: function() { return /* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.preventOverflow; }
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modifiers/offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modifiers/flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modifiers/preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");
/* harmony import */ var _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./modifiers/arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./modifiers/hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./popper-lite.js */ "./node_modules/@popperjs/core/lib/popper-lite.js");
/* harmony import */ var _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./modifiers/index.js */ "./node_modules/@popperjs/core/lib/modifiers/index.js");










var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_3__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_4__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_5__["default"], _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_6__["default"], _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_7__["default"], _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__["default"], _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_9__["default"], _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_10__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_0__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ computeAutoPlacement; }
/* harmony export */ });
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");




function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.placements : _options$allowedAutoP;
  var variation = (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);
  var placements = variation ? flipVariations ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.variationPlacements : _enums_js__WEBPACK_IMPORTED_MODULE_1__.variationPlacements.filter(function (placement) {
    return (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === variation;
  }) : _enums_js__WEBPACK_IMPORTED_MODULE_1__.basePlacements;
  var allowedPlacements = placements.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements;
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = (0,_detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[(0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeOffsets.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ computeOffsets; }
/* harmony export */ });
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");




function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? (0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) : null;
  var variation = placement ? (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case _enums_js__WEBPACK_IMPORTED_MODULE_3__.top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_3__.bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_3__.right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_3__.left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? (0,_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case _enums_js__WEBPACK_IMPORTED_MODULE_3__.start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case _enums_js__WEBPACK_IMPORTED_MODULE_3__.end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;

      default:
    }
  }

  return offsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/debounce.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/debounce.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ debounce; }
/* harmony export */ });
function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/detectOverflow.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ detectOverflow; }
/* harmony export */ });
/* harmony import */ var _dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/getClippingRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dom-utils/getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _computeOffsets_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");
/* harmony import */ var _rectToClientRect_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _expandToHashMap_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");








 // eslint-disable-next-line import/no-unused-modules

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$strategy = _options.strategy,
      strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = (0,_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_7__["default"])(typeof padding !== 'number' ? padding : (0,_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_8__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_5__.basePlacements));
  var altContext = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_5__.popper ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.reference : _enums_js__WEBPACK_IMPORTED_MODULE_5__.popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = (0,_dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_6__.isElement)(element) ? element : element.contextElement || (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = (0,_dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state.elements.reference);
  var popperOffsets = (0,_computeOffsets_js__WEBPACK_IMPORTED_MODULE_3__["default"])({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = (0,_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_4__["default"])(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_5__.popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_5__.popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [_enums_js__WEBPACK_IMPORTED_MODULE_5__.right, _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [_enums_js__WEBPACK_IMPORTED_MODULE_5__.top, _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/expandToHashMap.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ expandToHashMap; }
/* harmony export */ });
function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getAltAxis.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getAltAxis; }
/* harmony export */ });
function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getBasePlacement.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getBasePlacement; }
/* harmony export */ });

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getFreshSideObject; }
/* harmony export */ });
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getMainAxisFromPlacement; }
/* harmony export */ });
function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getOppositePlacement; }
/* harmony export */ });
var hash = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getOppositeVariationPlacement; }
/* harmony export */ });
var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getVariation.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getVariation.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getVariation; }
/* harmony export */ });
function getVariation(placement) {
  return placement.split('-')[1];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/math.js":
/*!*******************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/math.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   max: function() { return /* binding */ max; },
/* harmony export */   min: function() { return /* binding */ min; },
/* harmony export */   round: function() { return /* binding */ round; }
/* harmony export */ });
var max = Math.max;
var min = Math.min;
var round = Math.round;

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergeByName.js":
/*!**************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergeByName.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ mergeByName; }
/* harmony export */ });
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ mergePaddingObject; }
/* harmony export */ });
/* harmony import */ var _getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");

function mergePaddingObject(paddingObject) {
  return Object.assign({}, (0,_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(), paddingObject);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/orderModifiers.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ orderModifiers; }
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
 // source: https://stackoverflow.com/questions/49875255

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return _enums_js__WEBPACK_IMPORTED_MODULE_0__.modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/rectToClientRect.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ rectToClientRect; }
/* harmony export */ });
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/userAgent.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/userAgent.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getUAString; }
/* harmony export */ });
function getUAString() {
  var uaData = navigator.userAgentData;

  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function (item) {
      return item.brand + "/" + item.version;
    }).join(' ');
  }

  return navigator.userAgent;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/within.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/within.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   within: function() { return /* binding */ within; },
/* harmony export */   withinMaxClamp: function() { return /* binding */ withinMaxClamp; }
/* harmony export */ });
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");

function within(min, value, max) {
  return (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.max)(min, (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.min)(value, max));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}

/***/ }),

/***/ "./node_modules/bootstrap/dist/js/bootstrap.esm.js":
/*!*********************************************************!*\
  !*** ./node_modules/bootstrap/dist/js/bootstrap.esm.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Alert: function() { return /* binding */ Alert; },
/* harmony export */   Button: function() { return /* binding */ Button; },
/* harmony export */   Carousel: function() { return /* binding */ Carousel; },
/* harmony export */   Collapse: function() { return /* binding */ Collapse; },
/* harmony export */   Dropdown: function() { return /* binding */ Dropdown; },
/* harmony export */   Modal: function() { return /* binding */ Modal; },
/* harmony export */   Offcanvas: function() { return /* binding */ Offcanvas; },
/* harmony export */   Popover: function() { return /* binding */ Popover; },
/* harmony export */   ScrollSpy: function() { return /* binding */ ScrollSpy; },
/* harmony export */   Tab: function() { return /* binding */ Tab; },
/* harmony export */   Toast: function() { return /* binding */ Toast; },
/* harmony export */   Tooltip: function() { return /* binding */ Tooltip; }
/* harmony export */ });
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/index.js");
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/popper.js");
/*!
  * Bootstrap v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */


/**
 * --------------------------------------------------------------------------
 * Bootstrap dom/data.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * Constants
 */

const elementMap = new Map();
const Data = {
  set(element, key, instance) {
    if (!elementMap.has(element)) {
      elementMap.set(element, new Map());
    }
    const instanceMap = elementMap.get(element);

    // make it clear we only want one instance per element
    // can be removed later when multiple key/instances are fine to be used
    if (!instanceMap.has(key) && instanceMap.size !== 0) {
      // eslint-disable-next-line no-console
      console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
      return;
    }
    instanceMap.set(key, instance);
  },
  get(element, key) {
    if (elementMap.has(element)) {
      return elementMap.get(element).get(key) || null;
    }
    return null;
  },
  remove(element, key) {
    if (!elementMap.has(element)) {
      return;
    }
    const instanceMap = elementMap.get(element);
    instanceMap.delete(key);

    // free up element references if there are no instances left for an element
    if (instanceMap.size === 0) {
      elementMap.delete(element);
    }
  }
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/index.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

const MAX_UID = 1000000;
const MILLISECONDS_MULTIPLIER = 1000;
const TRANSITION_END = 'transitionend';

/**
 * Properly escape IDs selectors to handle weird IDs
 * @param {string} selector
 * @returns {string}
 */
const parseSelector = selector => {
  if (selector && window.CSS && window.CSS.escape) {
    // document.querySelector needs escaping to handle IDs (html5+) containing for instance /
    selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
  }
  return selector;
};

// Shout-out Angus Croll (https://goo.gl/pxwQGp)
const toType = object => {
  if (object === null || object === undefined) {
    return `${object}`;
  }
  return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
};

/**
 * Public Util API
 */

const getUID = prefix => {
  do {
    prefix += Math.floor(Math.random() * MAX_UID);
  } while (document.getElementById(prefix));
  return prefix;
};
const getTransitionDurationFromElement = element => {
  if (!element) {
    return 0;
  }

  // Get transition-duration of the element
  let {
    transitionDuration,
    transitionDelay
  } = window.getComputedStyle(element);
  const floatTransitionDuration = Number.parseFloat(transitionDuration);
  const floatTransitionDelay = Number.parseFloat(transitionDelay);

  // Return 0 if element or transition duration is not found
  if (!floatTransitionDuration && !floatTransitionDelay) {
    return 0;
  }

  // If multiple durations are defined, take the first
  transitionDuration = transitionDuration.split(',')[0];
  transitionDelay = transitionDelay.split(',')[0];
  return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
};
const triggerTransitionEnd = element => {
  element.dispatchEvent(new Event(TRANSITION_END));
};
const isElement = object => {
  if (!object || typeof object !== 'object') {
    return false;
  }
  if (typeof object.jquery !== 'undefined') {
    object = object[0];
  }
  return typeof object.nodeType !== 'undefined';
};
const getElement = object => {
  // it's a jQuery object or a node element
  if (isElement(object)) {
    return object.jquery ? object[0] : object;
  }
  if (typeof object === 'string' && object.length > 0) {
    return document.querySelector(parseSelector(object));
  }
  return null;
};
const isVisible = element => {
  if (!isElement(element) || element.getClientRects().length === 0) {
    return false;
  }
  const elementIsVisible = getComputedStyle(element).getPropertyValue('visibility') === 'visible';
  // Handle `details` element as its content may falsie appear visible when it is closed
  const closedDetails = element.closest('details:not([open])');
  if (!closedDetails) {
    return elementIsVisible;
  }
  if (closedDetails !== element) {
    const summary = element.closest('summary');
    if (summary && summary.parentNode !== closedDetails) {
      return false;
    }
    if (summary === null) {
      return false;
    }
  }
  return elementIsVisible;
};
const isDisabled = element => {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return true;
  }
  if (element.classList.contains('disabled')) {
    return true;
  }
  if (typeof element.disabled !== 'undefined') {
    return element.disabled;
  }
  return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
};
const findShadowRoot = element => {
  if (!document.documentElement.attachShadow) {
    return null;
  }

  // Can find the shadow root otherwise it'll return the document
  if (typeof element.getRootNode === 'function') {
    const root = element.getRootNode();
    return root instanceof ShadowRoot ? root : null;
  }
  if (element instanceof ShadowRoot) {
    return element;
  }

  // when we don't find a shadow root
  if (!element.parentNode) {
    return null;
  }
  return findShadowRoot(element.parentNode);
};
const noop = () => {};

/**
 * Trick to restart an element's animation
 *
 * @param {HTMLElement} element
 * @return void
 *
 * @see https://www.harrytheo.com/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
 */
const reflow = element => {
  element.offsetHeight; // eslint-disable-line no-unused-expressions
};
const getjQuery = () => {
  if (window.jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
    return window.jQuery;
  }
  return null;
};
const DOMContentLoadedCallbacks = [];
const onDOMContentLoaded = callback => {
  if (document.readyState === 'loading') {
    // add listener on the first call when the document is in loading state
    if (!DOMContentLoadedCallbacks.length) {
      document.addEventListener('DOMContentLoaded', () => {
        for (const callback of DOMContentLoadedCallbacks) {
          callback();
        }
      });
    }
    DOMContentLoadedCallbacks.push(callback);
  } else {
    callback();
  }
};
const isRTL = () => document.documentElement.dir === 'rtl';
const defineJQueryPlugin = plugin => {
  onDOMContentLoaded(() => {
    const $ = getjQuery();
    /* istanbul ignore if */
    if ($) {
      const name = plugin.NAME;
      const JQUERY_NO_CONFLICT = $.fn[name];
      $.fn[name] = plugin.jQueryInterface;
      $.fn[name].Constructor = plugin;
      $.fn[name].noConflict = () => {
        $.fn[name] = JQUERY_NO_CONFLICT;
        return plugin.jQueryInterface;
      };
    }
  });
};
const execute = (possibleCallback, args = [], defaultValue = possibleCallback) => {
  return typeof possibleCallback === 'function' ? possibleCallback.call(...args) : defaultValue;
};
const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
  if (!waitForTransition) {
    execute(callback);
    return;
  }
  const durationPadding = 5;
  const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
  let called = false;
  const handler = ({
    target
  }) => {
    if (target !== transitionElement) {
      return;
    }
    called = true;
    transitionElement.removeEventListener(TRANSITION_END, handler);
    execute(callback);
  };
  transitionElement.addEventListener(TRANSITION_END, handler);
  setTimeout(() => {
    if (!called) {
      triggerTransitionEnd(transitionElement);
    }
  }, emulatedDuration);
};

/**
 * Return the previous/next element of a list.
 *
 * @param {array} list    The list of elements
 * @param activeElement   The active element
 * @param shouldGetNext   Choose to get next or previous element
 * @param isCycleAllowed
 * @return {Element|elem} The proper element
 */
const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
  const listLength = list.length;
  let index = list.indexOf(activeElement);

  // if the element does not exist in the list return an element
  // depending on the direction and if cycle is allowed
  if (index === -1) {
    return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
  }
  index += shouldGetNext ? 1 : -1;
  if (isCycleAllowed) {
    index = (index + listLength) % listLength;
  }
  return list[Math.max(0, Math.min(index, listLength - 1))];
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap dom/event-handler.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
const stripNameRegex = /\..*/;
const stripUidRegex = /::\d+$/;
const eventRegistry = {}; // Events storage
let uidEvent = 1;
const customEvents = {
  mouseenter: 'mouseover',
  mouseleave: 'mouseout'
};
const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);

/**
 * Private methods
 */

function makeEventUid(element, uid) {
  return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
}
function getElementEvents(element) {
  const uid = makeEventUid(element);
  element.uidEvent = uid;
  eventRegistry[uid] = eventRegistry[uid] || {};
  return eventRegistry[uid];
}
function bootstrapHandler(element, fn) {
  return function handler(event) {
    hydrateObj(event, {
      delegateTarget: element
    });
    if (handler.oneOff) {
      EventHandler.off(element, event.type, fn);
    }
    return fn.apply(element, [event]);
  };
}
function bootstrapDelegationHandler(element, selector, fn) {
  return function handler(event) {
    const domElements = element.querySelectorAll(selector);
    for (let {
      target
    } = event; target && target !== this; target = target.parentNode) {
      for (const domElement of domElements) {
        if (domElement !== target) {
          continue;
        }
        hydrateObj(event, {
          delegateTarget: target
        });
        if (handler.oneOff) {
          EventHandler.off(element, event.type, selector, fn);
        }
        return fn.apply(target, [event]);
      }
    }
  };
}
function findHandler(events, callable, delegationSelector = null) {
  return Object.values(events).find(event => event.callable === callable && event.delegationSelector === delegationSelector);
}
function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
  const isDelegated = typeof handler === 'string';
  // TODO: tooltip passes `false` instead of selector, so we need to check
  const callable = isDelegated ? delegationFunction : handler || delegationFunction;
  let typeEvent = getTypeEvent(originalTypeEvent);
  if (!nativeEvents.has(typeEvent)) {
    typeEvent = originalTypeEvent;
  }
  return [isDelegated, callable, typeEvent];
}
function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
  if (typeof originalTypeEvent !== 'string' || !element) {
    return;
  }
  let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);

  // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
  // this prevents the handler from being dispatched the same way as mouseover or mouseout does
  if (originalTypeEvent in customEvents) {
    const wrapFunction = fn => {
      return function (event) {
        if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
          return fn.call(this, event);
        }
      };
    };
    callable = wrapFunction(callable);
  }
  const events = getElementEvents(element);
  const handlers = events[typeEvent] || (events[typeEvent] = {});
  const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
  if (previousFunction) {
    previousFunction.oneOff = previousFunction.oneOff && oneOff;
    return;
  }
  const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ''));
  const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
  fn.delegationSelector = isDelegated ? handler : null;
  fn.callable = callable;
  fn.oneOff = oneOff;
  fn.uidEvent = uid;
  handlers[uid] = fn;
  element.addEventListener(typeEvent, fn, isDelegated);
}
function removeHandler(element, events, typeEvent, handler, delegationSelector) {
  const fn = findHandler(events[typeEvent], handler, delegationSelector);
  if (!fn) {
    return;
  }
  element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
  delete events[typeEvent][fn.uidEvent];
}
function removeNamespacedHandlers(element, events, typeEvent, namespace) {
  const storeElementEvent = events[typeEvent] || {};
  for (const [handlerKey, event] of Object.entries(storeElementEvent)) {
    if (handlerKey.includes(namespace)) {
      removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
    }
  }
}
function getTypeEvent(event) {
  // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
  event = event.replace(stripNameRegex, '');
  return customEvents[event] || event;
}
const EventHandler = {
  on(element, event, handler, delegationFunction) {
    addHandler(element, event, handler, delegationFunction, false);
  },
  one(element, event, handler, delegationFunction) {
    addHandler(element, event, handler, delegationFunction, true);
  },
  off(element, originalTypeEvent, handler, delegationFunction) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return;
    }
    const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
    const inNamespace = typeEvent !== originalTypeEvent;
    const events = getElementEvents(element);
    const storeElementEvent = events[typeEvent] || {};
    const isNamespace = originalTypeEvent.startsWith('.');
    if (typeof callable !== 'undefined') {
      // Simplest case: handler is passed, remove that listener ONLY.
      if (!Object.keys(storeElementEvent).length) {
        return;
      }
      removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
      return;
    }
    if (isNamespace) {
      for (const elementEvent of Object.keys(events)) {
        removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
      }
    }
    for (const [keyHandlers, event] of Object.entries(storeElementEvent)) {
      const handlerKey = keyHandlers.replace(stripUidRegex, '');
      if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
        removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
      }
    }
  },
  trigger(element, event, args) {
    if (typeof event !== 'string' || !element) {
      return null;
    }
    const $ = getjQuery();
    const typeEvent = getTypeEvent(event);
    const inNamespace = event !== typeEvent;
    let jQueryEvent = null;
    let bubbles = true;
    let nativeDispatch = true;
    let defaultPrevented = false;
    if (inNamespace && $) {
      jQueryEvent = $.Event(event, args);
      $(element).trigger(jQueryEvent);
      bubbles = !jQueryEvent.isPropagationStopped();
      nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
      defaultPrevented = jQueryEvent.isDefaultPrevented();
    }
    const evt = hydrateObj(new Event(event, {
      bubbles,
      cancelable: true
    }), args);
    if (defaultPrevented) {
      evt.preventDefault();
    }
    if (nativeDispatch) {
      element.dispatchEvent(evt);
    }
    if (evt.defaultPrevented && jQueryEvent) {
      jQueryEvent.preventDefault();
    }
    return evt;
  }
};
function hydrateObj(obj, meta = {}) {
  for (const [key, value] of Object.entries(meta)) {
    try {
      obj[key] = value;
    } catch (_unused) {
      Object.defineProperty(obj, key, {
        configurable: true,
        get() {
          return value;
        }
      });
    }
  }
  return obj;
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap dom/manipulator.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

function normalizeData(value) {
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  if (value === Number(value).toString()) {
    return Number(value);
  }
  if (value === '' || value === 'null') {
    return null;
  }
  if (typeof value !== 'string') {
    return value;
  }
  try {
    return JSON.parse(decodeURIComponent(value));
  } catch (_unused) {
    return value;
  }
}
function normalizeDataKey(key) {
  return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
}
const Manipulator = {
  setDataAttribute(element, key, value) {
    element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
  },
  removeDataAttribute(element, key) {
    element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
  },
  getDataAttributes(element) {
    if (!element) {
      return {};
    }
    const attributes = {};
    const bsKeys = Object.keys(element.dataset).filter(key => key.startsWith('bs') && !key.startsWith('bsConfig'));
    for (const key of bsKeys) {
      let pureKey = key.replace(/^bs/, '');
      pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1);
      attributes[pureKey] = normalizeData(element.dataset[key]);
    }
    return attributes;
  },
  getDataAttribute(element, key) {
    return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
  }
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/config.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Class definition
 */

class Config {
  // Getters
  static get Default() {
    return {};
  }
  static get DefaultType() {
    return {};
  }
  static get NAME() {
    throw new Error('You have to implement the static method "NAME", for each component!');
  }
  _getConfig(config) {
    config = this._mergeConfigObj(config);
    config = this._configAfterMerge(config);
    this._typeCheckConfig(config);
    return config;
  }
  _configAfterMerge(config) {
    return config;
  }
  _mergeConfigObj(config, element) {
    const jsonConfig = isElement(element) ? Manipulator.getDataAttribute(element, 'config') : {}; // try to parse

    return {
      ...this.constructor.Default,
      ...(typeof jsonConfig === 'object' ? jsonConfig : {}),
      ...(isElement(element) ? Manipulator.getDataAttributes(element) : {}),
      ...(typeof config === 'object' ? config : {})
    };
  }
  _typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
    for (const [property, expectedTypes] of Object.entries(configTypes)) {
      const value = config[property];
      const valueType = isElement(value) ? 'element' : toType(value);
      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
      }
    }
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap base-component.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const VERSION = '5.3.8';

/**
 * Class definition
 */

class BaseComponent extends Config {
  constructor(element, config) {
    super();
    element = getElement(element);
    if (!element) {
      return;
    }
    this._element = element;
    this._config = this._getConfig(config);
    Data.set(this._element, this.constructor.DATA_KEY, this);
  }

  // Public
  dispose() {
    Data.remove(this._element, this.constructor.DATA_KEY);
    EventHandler.off(this._element, this.constructor.EVENT_KEY);
    for (const propertyName of Object.getOwnPropertyNames(this)) {
      this[propertyName] = null;
    }
  }

  // Private
  _queueCallback(callback, element, isAnimated = true) {
    executeAfterTransition(callback, element, isAnimated);
  }
  _getConfig(config) {
    config = this._mergeConfigObj(config, this._element);
    config = this._configAfterMerge(config);
    this._typeCheckConfig(config);
    return config;
  }

  // Static
  static getInstance(element) {
    return Data.get(getElement(element), this.DATA_KEY);
  }
  static getOrCreateInstance(element, config = {}) {
    return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
  }
  static get VERSION() {
    return VERSION;
  }
  static get DATA_KEY() {
    return `bs.${this.NAME}`;
  }
  static get EVENT_KEY() {
    return `.${this.DATA_KEY}`;
  }
  static eventName(name) {
    return `${name}${this.EVENT_KEY}`;
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap dom/selector-engine.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

const getSelector = element => {
  let selector = element.getAttribute('data-bs-target');
  if (!selector || selector === '#') {
    let hrefAttribute = element.getAttribute('href');

    // The only valid content that could double as a selector are IDs or classes,
    // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
    // `document.querySelector` will rightfully complain it is invalid.
    // See https://github.com/twbs/bootstrap/issues/32273
    if (!hrefAttribute || !hrefAttribute.includes('#') && !hrefAttribute.startsWith('.')) {
      return null;
    }

    // Just in case some CMS puts out a full URL with the anchor appended
    if (hrefAttribute.includes('#') && !hrefAttribute.startsWith('#')) {
      hrefAttribute = `#${hrefAttribute.split('#')[1]}`;
    }
    selector = hrefAttribute && hrefAttribute !== '#' ? hrefAttribute.trim() : null;
  }
  return selector ? selector.split(',').map(sel => parseSelector(sel)).join(',') : null;
};
const SelectorEngine = {
  find(selector, element = document.documentElement) {
    return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
  },
  findOne(selector, element = document.documentElement) {
    return Element.prototype.querySelector.call(element, selector);
  },
  children(element, selector) {
    return [].concat(...element.children).filter(child => child.matches(selector));
  },
  parents(element, selector) {
    const parents = [];
    let ancestor = element.parentNode.closest(selector);
    while (ancestor) {
      parents.push(ancestor);
      ancestor = ancestor.parentNode.closest(selector);
    }
    return parents;
  },
  prev(element, selector) {
    let previous = element.previousElementSibling;
    while (previous) {
      if (previous.matches(selector)) {
        return [previous];
      }
      previous = previous.previousElementSibling;
    }
    return [];
  },
  // TODO: this is now unused; remove later along with prev()
  next(element, selector) {
    let next = element.nextElementSibling;
    while (next) {
      if (next.matches(selector)) {
        return [next];
      }
      next = next.nextElementSibling;
    }
    return [];
  },
  focusableChildren(element) {
    const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector}:not([tabindex^="-"])`).join(',');
    return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el));
  },
  getSelectorFromElement(element) {
    const selector = getSelector(element);
    if (selector) {
      return SelectorEngine.findOne(selector) ? selector : null;
    }
    return null;
  },
  getElementFromSelector(element) {
    const selector = getSelector(element);
    return selector ? SelectorEngine.findOne(selector) : null;
  },
  getMultipleElementsFromSelector(element) {
    const selector = getSelector(element);
    return selector ? SelectorEngine.find(selector) : [];
  }
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/component-functions.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

const enableDismissTrigger = (component, method = 'hide') => {
  const clickEvent = `click.dismiss${component.EVENT_KEY}`;
  const name = component.NAME;
  EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }
    if (isDisabled(this)) {
      return;
    }
    const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}`);
    const instance = component.getOrCreateInstance(target);

    // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method
    instance[method]();
  });
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$f = 'alert';
const DATA_KEY$a = 'bs.alert';
const EVENT_KEY$b = `.${DATA_KEY$a}`;
const EVENT_CLOSE = `close${EVENT_KEY$b}`;
const EVENT_CLOSED = `closed${EVENT_KEY$b}`;
const CLASS_NAME_FADE$5 = 'fade';
const CLASS_NAME_SHOW$8 = 'show';

/**
 * Class definition
 */

class Alert extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME$f;
  }

  // Public
  close() {
    const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);
    if (closeEvent.defaultPrevented) {
      return;
    }
    this._element.classList.remove(CLASS_NAME_SHOW$8);
    const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);
    this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
  }

  // Private
  _destroyElement() {
    this._element.remove();
    EventHandler.trigger(this._element, EVENT_CLOSED);
    this.dispose();
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Alert.getOrCreateInstance(this);
      if (typeof config !== 'string') {
        return;
      }
      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config](this);
    });
  }
}

/**
 * Data API implementation
 */

enableDismissTrigger(Alert, 'close');

/**
 * jQuery
 */

defineJQueryPlugin(Alert);

/**
 * --------------------------------------------------------------------------
 * Bootstrap button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$e = 'button';
const DATA_KEY$9 = 'bs.button';
const EVENT_KEY$a = `.${DATA_KEY$9}`;
const DATA_API_KEY$6 = '.data-api';
const CLASS_NAME_ACTIVE$3 = 'active';
const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;

/**
 * Class definition
 */

class Button extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME$e;
  }

  // Public
  toggle() {
    // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
    this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Button.getOrCreateInstance(this);
      if (config === 'toggle') {
        data[config]();
      }
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, event => {
  event.preventDefault();
  const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
  const data = Button.getOrCreateInstance(button);
  data.toggle();
});

/**
 * jQuery
 */

defineJQueryPlugin(Button);

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/swipe.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$d = 'swipe';
const EVENT_KEY$9 = '.bs.swipe';
const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$9}`;
const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$9}`;
const EVENT_TOUCHEND = `touchend${EVENT_KEY$9}`;
const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$9}`;
const EVENT_POINTERUP = `pointerup${EVENT_KEY$9}`;
const POINTER_TYPE_TOUCH = 'touch';
const POINTER_TYPE_PEN = 'pen';
const CLASS_NAME_POINTER_EVENT = 'pointer-event';
const SWIPE_THRESHOLD = 40;
const Default$c = {
  endCallback: null,
  leftCallback: null,
  rightCallback: null
};
const DefaultType$c = {
  endCallback: '(function|null)',
  leftCallback: '(function|null)',
  rightCallback: '(function|null)'
};

/**
 * Class definition
 */

class Swipe extends Config {
  constructor(element, config) {
    super();
    this._element = element;
    if (!element || !Swipe.isSupported()) {
      return;
    }
    this._config = this._getConfig(config);
    this._deltaX = 0;
    this._supportPointerEvents = Boolean(window.PointerEvent);
    this._initEvents();
  }

  // Getters
  static get Default() {
    return Default$c;
  }
  static get DefaultType() {
    return DefaultType$c;
  }
  static get NAME() {
    return NAME$d;
  }

  // Public
  dispose() {
    EventHandler.off(this._element, EVENT_KEY$9);
  }

  // Private
  _start(event) {
    if (!this._supportPointerEvents) {
      this._deltaX = event.touches[0].clientX;
      return;
    }
    if (this._eventIsPointerPenTouch(event)) {
      this._deltaX = event.clientX;
    }
  }
  _end(event) {
    if (this._eventIsPointerPenTouch(event)) {
      this._deltaX = event.clientX - this._deltaX;
    }
    this._handleSwipe();
    execute(this._config.endCallback);
  }
  _move(event) {
    this._deltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this._deltaX;
  }
  _handleSwipe() {
    const absDeltaX = Math.abs(this._deltaX);
    if (absDeltaX <= SWIPE_THRESHOLD) {
      return;
    }
    const direction = absDeltaX / this._deltaX;
    this._deltaX = 0;
    if (!direction) {
      return;
    }
    execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback);
  }
  _initEvents() {
    if (this._supportPointerEvents) {
      EventHandler.on(this._element, EVENT_POINTERDOWN, event => this._start(event));
      EventHandler.on(this._element, EVENT_POINTERUP, event => this._end(event));
      this._element.classList.add(CLASS_NAME_POINTER_EVENT);
    } else {
      EventHandler.on(this._element, EVENT_TOUCHSTART, event => this._start(event));
      EventHandler.on(this._element, EVENT_TOUCHMOVE, event => this._move(event));
      EventHandler.on(this._element, EVENT_TOUCHEND, event => this._end(event));
    }
  }
  _eventIsPointerPenTouch(event) {
    return this._supportPointerEvents && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
  }

  // Static
  static isSupported() {
    return 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap carousel.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$c = 'carousel';
const DATA_KEY$8 = 'bs.carousel';
const EVENT_KEY$8 = `.${DATA_KEY$8}`;
const DATA_API_KEY$5 = '.data-api';
const ARROW_LEFT_KEY$1 = 'ArrowLeft';
const ARROW_RIGHT_KEY$1 = 'ArrowRight';
const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

const ORDER_NEXT = 'next';
const ORDER_PREV = 'prev';
const DIRECTION_LEFT = 'left';
const DIRECTION_RIGHT = 'right';
const EVENT_SLIDE = `slide${EVENT_KEY$8}`;
const EVENT_SLID = `slid${EVENT_KEY$8}`;
const EVENT_KEYDOWN$1 = `keydown${EVENT_KEY$8}`;
const EVENT_MOUSEENTER$1 = `mouseenter${EVENT_KEY$8}`;
const EVENT_MOUSELEAVE$1 = `mouseleave${EVENT_KEY$8}`;
const EVENT_DRAG_START = `dragstart${EVENT_KEY$8}`;
const EVENT_LOAD_DATA_API$3 = `load${EVENT_KEY$8}${DATA_API_KEY$5}`;
const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$8}${DATA_API_KEY$5}`;
const CLASS_NAME_CAROUSEL = 'carousel';
const CLASS_NAME_ACTIVE$2 = 'active';
const CLASS_NAME_SLIDE = 'slide';
const CLASS_NAME_END = 'carousel-item-end';
const CLASS_NAME_START = 'carousel-item-start';
const CLASS_NAME_NEXT = 'carousel-item-next';
const CLASS_NAME_PREV = 'carousel-item-prev';
const SELECTOR_ACTIVE = '.active';
const SELECTOR_ITEM = '.carousel-item';
const SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM;
const SELECTOR_ITEM_IMG = '.carousel-item img';
const SELECTOR_INDICATORS = '.carousel-indicators';
const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
const KEY_TO_DIRECTION = {
  [ARROW_LEFT_KEY$1]: DIRECTION_RIGHT,
  [ARROW_RIGHT_KEY$1]: DIRECTION_LEFT
};
const Default$b = {
  interval: 5000,
  keyboard: true,
  pause: 'hover',
  ride: false,
  touch: true,
  wrap: true
};
const DefaultType$b = {
  interval: '(number|boolean)',
  // TODO:v6 remove boolean support
  keyboard: 'boolean',
  pause: '(string|boolean)',
  ride: '(boolean|string)',
  touch: 'boolean',
  wrap: 'boolean'
};

/**
 * Class definition
 */

class Carousel extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._interval = null;
    this._activeElement = null;
    this._isSliding = false;
    this.touchTimeout = null;
    this._swipeHelper = null;
    this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
    this._addEventListeners();
    if (this._config.ride === CLASS_NAME_CAROUSEL) {
      this.cycle();
    }
  }

  // Getters
  static get Default() {
    return Default$b;
  }
  static get DefaultType() {
    return DefaultType$b;
  }
  static get NAME() {
    return NAME$c;
  }

  // Public
  next() {
    this._slide(ORDER_NEXT);
  }
  nextWhenVisible() {
    // FIXME TODO use `document.visibilityState`
    // Don't call next when the page isn't visible
    // or the carousel or its parent isn't visible
    if (!document.hidden && isVisible(this._element)) {
      this.next();
    }
  }
  prev() {
    this._slide(ORDER_PREV);
  }
  pause() {
    if (this._isSliding) {
      triggerTransitionEnd(this._element);
    }
    this._clearInterval();
  }
  cycle() {
    this._clearInterval();
    this._updateInterval();
    this._interval = setInterval(() => this.nextWhenVisible(), this._config.interval);
  }
  _maybeEnableCycle() {
    if (!this._config.ride) {
      return;
    }
    if (this._isSliding) {
      EventHandler.one(this._element, EVENT_SLID, () => this.cycle());
      return;
    }
    this.cycle();
  }
  to(index) {
    const items = this._getItems();
    if (index > items.length - 1 || index < 0) {
      return;
    }
    if (this._isSliding) {
      EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
      return;
    }
    const activeIndex = this._getItemIndex(this._getActive());
    if (activeIndex === index) {
      return;
    }
    const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;
    this._slide(order, items[index]);
  }
  dispose() {
    if (this._swipeHelper) {
      this._swipeHelper.dispose();
    }
    super.dispose();
  }

  // Private
  _configAfterMerge(config) {
    config.defaultInterval = config.interval;
    return config;
  }
  _addEventListeners() {
    if (this._config.keyboard) {
      EventHandler.on(this._element, EVENT_KEYDOWN$1, event => this._keydown(event));
    }
    if (this._config.pause === 'hover') {
      EventHandler.on(this._element, EVENT_MOUSEENTER$1, () => this.pause());
      EventHandler.on(this._element, EVENT_MOUSELEAVE$1, () => this._maybeEnableCycle());
    }
    if (this._config.touch && Swipe.isSupported()) {
      this._addTouchEventListeners();
    }
  }
  _addTouchEventListeners() {
    for (const img of SelectorEngine.find(SELECTOR_ITEM_IMG, this._element)) {
      EventHandler.on(img, EVENT_DRAG_START, event => event.preventDefault());
    }
    const endCallBack = () => {
      if (this._config.pause !== 'hover') {
        return;
      }

      // If it's a touch-enabled device, mouseenter/leave are fired as
      // part of the mouse compatibility events on first tap - the carousel
      // would stop cycling until user tapped out of it;
      // here, we listen for touchend, explicitly pause the carousel
      // (as if it's the second time we tap on it, mouseenter compat event
      // is NOT fired) and after a timeout (to allow for mouse compatibility
      // events to fire) we explicitly restart cycling

      this.pause();
      if (this.touchTimeout) {
        clearTimeout(this.touchTimeout);
      }
      this.touchTimeout = setTimeout(() => this._maybeEnableCycle(), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
    };
    const swipeConfig = {
      leftCallback: () => this._slide(this._directionToOrder(DIRECTION_LEFT)),
      rightCallback: () => this._slide(this._directionToOrder(DIRECTION_RIGHT)),
      endCallback: endCallBack
    };
    this._swipeHelper = new Swipe(this._element, swipeConfig);
  }
  _keydown(event) {
    if (/input|textarea/i.test(event.target.tagName)) {
      return;
    }
    const direction = KEY_TO_DIRECTION[event.key];
    if (direction) {
      event.preventDefault();
      this._slide(this._directionToOrder(direction));
    }
  }
  _getItemIndex(element) {
    return this._getItems().indexOf(element);
  }
  _setActiveIndicatorElement(index) {
    if (!this._indicatorsElement) {
      return;
    }
    const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
    activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
    activeIndicator.removeAttribute('aria-current');
    const newActiveIndicator = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);
    if (newActiveIndicator) {
      newActiveIndicator.classList.add(CLASS_NAME_ACTIVE$2);
      newActiveIndicator.setAttribute('aria-current', 'true');
    }
  }
  _updateInterval() {
    const element = this._activeElement || this._getActive();
    if (!element) {
      return;
    }
    const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);
    this._config.interval = elementInterval || this._config.defaultInterval;
  }
  _slide(order, element = null) {
    if (this._isSliding) {
      return;
    }
    const activeElement = this._getActive();
    const isNext = order === ORDER_NEXT;
    const nextElement = element || getNextActiveElement(this._getItems(), activeElement, isNext, this._config.wrap);
    if (nextElement === activeElement) {
      return;
    }
    const nextElementIndex = this._getItemIndex(nextElement);
    const triggerEvent = eventName => {
      return EventHandler.trigger(this._element, eventName, {
        relatedTarget: nextElement,
        direction: this._orderToDirection(order),
        from: this._getItemIndex(activeElement),
        to: nextElementIndex
      });
    };
    const slideEvent = triggerEvent(EVENT_SLIDE);
    if (slideEvent.defaultPrevented) {
      return;
    }
    if (!activeElement || !nextElement) {
      // Some weirdness is happening, so we bail
      // TODO: change tests that use empty divs to avoid this check
      return;
    }
    const isCycling = Boolean(this._interval);
    this.pause();
    this._isSliding = true;
    this._setActiveIndicatorElement(nextElementIndex);
    this._activeElement = nextElement;
    const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
    const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
    nextElement.classList.add(orderClassName);
    reflow(nextElement);
    activeElement.classList.add(directionalClassName);
    nextElement.classList.add(directionalClassName);
    const completeCallBack = () => {
      nextElement.classList.remove(directionalClassName, orderClassName);
      nextElement.classList.add(CLASS_NAME_ACTIVE$2);
      activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
      this._isSliding = false;
      triggerEvent(EVENT_SLID);
    };
    this._queueCallback(completeCallBack, activeElement, this._isAnimated());
    if (isCycling) {
      this.cycle();
    }
  }
  _isAnimated() {
    return this._element.classList.contains(CLASS_NAME_SLIDE);
  }
  _getActive() {
    return SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
  }
  _getItems() {
    return SelectorEngine.find(SELECTOR_ITEM, this._element);
  }
  _clearInterval() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }
  _directionToOrder(direction) {
    if (isRTL()) {
      return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
    }
    return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
  }
  _orderToDirection(order) {
    if (isRTL()) {
      return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Carousel.getOrCreateInstance(this, config);
      if (typeof config === 'number') {
        data.to(config);
        return;
      }
      if (typeof config === 'string') {
        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      }
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, function (event) {
  const target = SelectorEngine.getElementFromSelector(this);
  if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
    return;
  }
  event.preventDefault();
  const carousel = Carousel.getOrCreateInstance(target);
  const slideIndex = this.getAttribute('data-bs-slide-to');
  if (slideIndex) {
    carousel.to(slideIndex);
    carousel._maybeEnableCycle();
    return;
  }
  if (Manipulator.getDataAttribute(this, 'slide') === 'next') {
    carousel.next();
    carousel._maybeEnableCycle();
    return;
  }
  carousel.prev();
  carousel._maybeEnableCycle();
});
EventHandler.on(window, EVENT_LOAD_DATA_API$3, () => {
  const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);
  for (const carousel of carousels) {
    Carousel.getOrCreateInstance(carousel);
  }
});

/**
 * jQuery
 */

defineJQueryPlugin(Carousel);

/**
 * --------------------------------------------------------------------------
 * Bootstrap collapse.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$b = 'collapse';
const DATA_KEY$7 = 'bs.collapse';
const EVENT_KEY$7 = `.${DATA_KEY$7}`;
const DATA_API_KEY$4 = '.data-api';
const EVENT_SHOW$6 = `show${EVENT_KEY$7}`;
const EVENT_SHOWN$6 = `shown${EVENT_KEY$7}`;
const EVENT_HIDE$6 = `hide${EVENT_KEY$7}`;
const EVENT_HIDDEN$6 = `hidden${EVENT_KEY$7}`;
const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$7}${DATA_API_KEY$4}`;
const CLASS_NAME_SHOW$7 = 'show';
const CLASS_NAME_COLLAPSE = 'collapse';
const CLASS_NAME_COLLAPSING = 'collapsing';
const CLASS_NAME_COLLAPSED = 'collapsed';
const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
const CLASS_NAME_HORIZONTAL = 'collapse-horizontal';
const WIDTH = 'width';
const HEIGHT = 'height';
const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing';
const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
const Default$a = {
  parent: null,
  toggle: true
};
const DefaultType$a = {
  parent: '(null|element)',
  toggle: 'boolean'
};

/**
 * Class definition
 */

class Collapse extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._isTransitioning = false;
    this._triggerArray = [];
    const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);
    for (const elem of toggleList) {
      const selector = SelectorEngine.getSelectorFromElement(elem);
      const filterElement = SelectorEngine.find(selector).filter(foundElement => foundElement === this._element);
      if (selector !== null && filterElement.length) {
        this._triggerArray.push(elem);
      }
    }
    this._initializeChildren();
    if (!this._config.parent) {
      this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
    }
    if (this._config.toggle) {
      this.toggle();
    }
  }

  // Getters
  static get Default() {
    return Default$a;
  }
  static get DefaultType() {
    return DefaultType$a;
  }
  static get NAME() {
    return NAME$b;
  }

  // Public
  toggle() {
    if (this._isShown()) {
      this.hide();
    } else {
      this.show();
    }
  }
  show() {
    if (this._isTransitioning || this._isShown()) {
      return;
    }
    let activeChildren = [];

    // find active children
    if (this._config.parent) {
      activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES).filter(element => element !== this._element).map(element => Collapse.getOrCreateInstance(element, {
        toggle: false
      }));
    }
    if (activeChildren.length && activeChildren[0]._isTransitioning) {
      return;
    }
    const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$6);
    if (startEvent.defaultPrevented) {
      return;
    }
    for (const activeInstance of activeChildren) {
      activeInstance.hide();
    }
    const dimension = this._getDimension();
    this._element.classList.remove(CLASS_NAME_COLLAPSE);
    this._element.classList.add(CLASS_NAME_COLLAPSING);
    this._element.style[dimension] = 0;
    this._addAriaAndCollapsedClass(this._triggerArray, true);
    this._isTransitioning = true;
    const complete = () => {
      this._isTransitioning = false;
      this._element.classList.remove(CLASS_NAME_COLLAPSING);
      this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
      this._element.style[dimension] = '';
      EventHandler.trigger(this._element, EVENT_SHOWN$6);
    };
    const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
    const scrollSize = `scroll${capitalizedDimension}`;
    this._queueCallback(complete, this._element, true);
    this._element.style[dimension] = `${this._element[scrollSize]}px`;
  }
  hide() {
    if (this._isTransitioning || !this._isShown()) {
      return;
    }
    const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$6);
    if (startEvent.defaultPrevented) {
      return;
    }
    const dimension = this._getDimension();
    this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
    reflow(this._element);
    this._element.classList.add(CLASS_NAME_COLLAPSING);
    this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
    for (const trigger of this._triggerArray) {
      const element = SelectorEngine.getElementFromSelector(trigger);
      if (element && !this._isShown(element)) {
        this._addAriaAndCollapsedClass([trigger], false);
      }
    }
    this._isTransitioning = true;
    const complete = () => {
      this._isTransitioning = false;
      this._element.classList.remove(CLASS_NAME_COLLAPSING);
      this._element.classList.add(CLASS_NAME_COLLAPSE);
      EventHandler.trigger(this._element, EVENT_HIDDEN$6);
    };
    this._element.style[dimension] = '';
    this._queueCallback(complete, this._element, true);
  }

  // Private
  _isShown(element = this._element) {
    return element.classList.contains(CLASS_NAME_SHOW$7);
  }
  _configAfterMerge(config) {
    config.toggle = Boolean(config.toggle); // Coerce string values
    config.parent = getElement(config.parent);
    return config;
  }
  _getDimension() {
    return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
  }
  _initializeChildren() {
    if (!this._config.parent) {
      return;
    }
    const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE$4);
    for (const element of children) {
      const selected = SelectorEngine.getElementFromSelector(element);
      if (selected) {
        this._addAriaAndCollapsedClass([element], this._isShown(selected));
      }
    }
  }
  _getFirstLevelChildren(selector) {
    const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
    // remove children if greater depth
    return SelectorEngine.find(selector, this._config.parent).filter(element => !children.includes(element));
  }
  _addAriaAndCollapsedClass(triggerArray, isOpen) {
    if (!triggerArray.length) {
      return;
    }
    for (const element of triggerArray) {
      element.classList.toggle(CLASS_NAME_COLLAPSED, !isOpen);
      element.setAttribute('aria-expanded', isOpen);
    }
  }

  // Static
  static jQueryInterface(config) {
    const _config = {};
    if (typeof config === 'string' && /show|hide/.test(config)) {
      _config.toggle = false;
    }
    return this.each(function () {
      const data = Collapse.getOrCreateInstance(this, _config);
      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      }
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function (event) {
  // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
  if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
    event.preventDefault();
  }
  for (const element of SelectorEngine.getMultipleElementsFromSelector(this)) {
    Collapse.getOrCreateInstance(element, {
      toggle: false
    }).toggle();
  }
});

/**
 * jQuery
 */

defineJQueryPlugin(Collapse);

/**
 * --------------------------------------------------------------------------
 * Bootstrap dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$a = 'dropdown';
const DATA_KEY$6 = 'bs.dropdown';
const EVENT_KEY$6 = `.${DATA_KEY$6}`;
const DATA_API_KEY$3 = '.data-api';
const ESCAPE_KEY$2 = 'Escape';
const TAB_KEY$1 = 'Tab';
const ARROW_UP_KEY$1 = 'ArrowUp';
const ARROW_DOWN_KEY$1 = 'ArrowDown';
const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

const EVENT_HIDE$5 = `hide${EVENT_KEY$6}`;
const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$6}`;
const EVENT_SHOW$5 = `show${EVENT_KEY$6}`;
const EVENT_SHOWN$5 = `shown${EVENT_KEY$6}`;
const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$6}${DATA_API_KEY$3}`;
const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$6}${DATA_API_KEY$3}`;
const CLASS_NAME_SHOW$6 = 'show';
const CLASS_NAME_DROPUP = 'dropup';
const CLASS_NAME_DROPEND = 'dropend';
const CLASS_NAME_DROPSTART = 'dropstart';
const CLASS_NAME_DROPUP_CENTER = 'dropup-center';
const CLASS_NAME_DROPDOWN_CENTER = 'dropdown-center';
const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)';
const SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE$3}.${CLASS_NAME_SHOW$6}`;
const SELECTOR_MENU = '.dropdown-menu';
const SELECTOR_NAVBAR = '.navbar';
const SELECTOR_NAVBAR_NAV = '.navbar-nav';
const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
const PLACEMENT_TOPCENTER = 'top';
const PLACEMENT_BOTTOMCENTER = 'bottom';
const Default$9 = {
  autoClose: true,
  boundary: 'clippingParents',
  display: 'dynamic',
  offset: [0, 2],
  popperConfig: null,
  reference: 'toggle'
};
const DefaultType$9 = {
  autoClose: '(boolean|string)',
  boundary: '(string|element)',
  display: 'string',
  offset: '(array|string|function)',
  popperConfig: '(null|object|function)',
  reference: '(string|element|object)'
};

/**
 * Class definition
 */

class Dropdown extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._popper = null;
    this._parent = this._element.parentNode; // dropdown wrapper
    // TODO: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.3/forms/input-group/
    this._menu = SelectorEngine.next(this._element, SELECTOR_MENU)[0] || SelectorEngine.prev(this._element, SELECTOR_MENU)[0] || SelectorEngine.findOne(SELECTOR_MENU, this._parent);
    this._inNavbar = this._detectNavbar();
  }

  // Getters
  static get Default() {
    return Default$9;
  }
  static get DefaultType() {
    return DefaultType$9;
  }
  static get NAME() {
    return NAME$a;
  }

  // Public
  toggle() {
    return this._isShown() ? this.hide() : this.show();
  }
  show() {
    if (isDisabled(this._element) || this._isShown()) {
      return;
    }
    const relatedTarget = {
      relatedTarget: this._element
    };
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$5, relatedTarget);
    if (showEvent.defaultPrevented) {
      return;
    }
    this._createPopper();

    // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
    if ('ontouchstart' in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.on(element, 'mouseover', noop);
      }
    }
    this._element.focus();
    this._element.setAttribute('aria-expanded', true);
    this._menu.classList.add(CLASS_NAME_SHOW$6);
    this._element.classList.add(CLASS_NAME_SHOW$6);
    EventHandler.trigger(this._element, EVENT_SHOWN$5, relatedTarget);
  }
  hide() {
    if (isDisabled(this._element) || !this._isShown()) {
      return;
    }
    const relatedTarget = {
      relatedTarget: this._element
    };
    this._completeHide(relatedTarget);
  }
  dispose() {
    if (this._popper) {
      this._popper.destroy();
    }
    super.dispose();
  }
  update() {
    this._inNavbar = this._detectNavbar();
    if (this._popper) {
      this._popper.update();
    }
  }

  // Private
  _completeHide(relatedTarget) {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$5, relatedTarget);
    if (hideEvent.defaultPrevented) {
      return;
    }

    // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.off(element, 'mouseover', noop);
      }
    }
    if (this._popper) {
      this._popper.destroy();
    }
    this._menu.classList.remove(CLASS_NAME_SHOW$6);
    this._element.classList.remove(CLASS_NAME_SHOW$6);
    this._element.setAttribute('aria-expanded', 'false');
    Manipulator.removeDataAttribute(this._menu, 'popper');
    EventHandler.trigger(this._element, EVENT_HIDDEN$5, relatedTarget);
  }
  _getConfig(config) {
    config = super._getConfig(config);
    if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
      // Popper virtual elements require a getBoundingClientRect method
      throw new TypeError(`${NAME$a.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
    }
    return config;
  }
  _createPopper() {
    if (typeof _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ === 'undefined') {
      throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org/docs/v2/)');
    }
    let referenceElement = this._element;
    if (this._config.reference === 'parent') {
      referenceElement = this._parent;
    } else if (isElement(this._config.reference)) {
      referenceElement = getElement(this._config.reference);
    } else if (typeof this._config.reference === 'object') {
      referenceElement = this._config.reference;
    }
    const popperConfig = this._getPopperConfig();
    this._popper = _popperjs_core__WEBPACK_IMPORTED_MODULE_1__.createPopper(referenceElement, this._menu, popperConfig);
  }
  _isShown() {
    return this._menu.classList.contains(CLASS_NAME_SHOW$6);
  }
  _getPlacement() {
    const parentDropdown = this._parent;
    if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
      return PLACEMENT_RIGHT;
    }
    if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
      return PLACEMENT_LEFT;
    }
    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP_CENTER)) {
      return PLACEMENT_TOPCENTER;
    }
    if (parentDropdown.classList.contains(CLASS_NAME_DROPDOWN_CENTER)) {
      return PLACEMENT_BOTTOMCENTER;
    }

    // We need to trim the value because custom properties can also include spaces
    const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';
    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
      return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
    }
    return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
  }
  _detectNavbar() {
    return this._element.closest(SELECTOR_NAVBAR) !== null;
  }
  _getOffset() {
    const {
      offset
    } = this._config;
    if (typeof offset === 'string') {
      return offset.split(',').map(value => Number.parseInt(value, 10));
    }
    if (typeof offset === 'function') {
      return popperData => offset(popperData, this._element);
    }
    return offset;
  }
  _getPopperConfig() {
    const defaultBsPopperConfig = {
      placement: this._getPlacement(),
      modifiers: [{
        name: 'preventOverflow',
        options: {
          boundary: this._config.boundary
        }
      }, {
        name: 'offset',
        options: {
          offset: this._getOffset()
        }
      }]
    };

    // Disable Popper if we have a static display or Dropdown is in Navbar
    if (this._inNavbar || this._config.display === 'static') {
      Manipulator.setDataAttribute(this._menu, 'popper', 'static'); // TODO: v6 remove
      defaultBsPopperConfig.modifiers = [{
        name: 'applyStyles',
        enabled: false
      }];
    }
    return {
      ...defaultBsPopperConfig,
      ...execute(this._config.popperConfig, [undefined, defaultBsPopperConfig])
    };
  }
  _selectMenuItem({
    key,
    target
  }) {
    const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(element => isVisible(element));
    if (!items.length) {
      return;
    }

    // if target isn't included in items (e.g. when expanding the dropdown)
    // allow cycling to get the last item in case key equals ARROW_UP_KEY
    getNextActiveElement(items, target, key === ARROW_DOWN_KEY$1, !items.includes(target)).focus();
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Dropdown.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
  static clearMenus(event) {
    if (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY$1) {
      return;
    }
    const openToggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE_SHOWN);
    for (const toggle of openToggles) {
      const context = Dropdown.getInstance(toggle);
      if (!context || context._config.autoClose === false) {
        continue;
      }
      const composedPath = event.composedPath();
      const isMenuTarget = composedPath.includes(context._menu);
      if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
        continue;
      }

      // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu
      if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
        continue;
      }
      const relatedTarget = {
        relatedTarget: context._element
      };
      if (event.type === 'click') {
        relatedTarget.clickEvent = event;
      }
      context._completeHide(relatedTarget);
    }
  }
  static dataApiKeydownHandler(event) {
    // If not an UP | DOWN | ESCAPE key => not a dropdown command
    // If input/textarea && if key is other than ESCAPE => not a dropdown command

    const isInput = /input|textarea/i.test(event.target.tagName);
    const isEscapeEvent = event.key === ESCAPE_KEY$2;
    const isUpOrDownEvent = [ARROW_UP_KEY$1, ARROW_DOWN_KEY$1].includes(event.key);
    if (!isUpOrDownEvent && !isEscapeEvent) {
      return;
    }
    if (isInput && !isEscapeEvent) {
      return;
    }
    event.preventDefault();

    // TODO: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.3/forms/input-group/
    const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.next(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.findOne(SELECTOR_DATA_TOGGLE$3, event.delegateTarget.parentNode);
    const instance = Dropdown.getOrCreateInstance(getToggleButton);
    if (isUpOrDownEvent) {
      event.stopPropagation();
      instance.show();
      instance._selectMenuItem(event);
      return;
    }
    if (instance._isShown()) {
      // else is escape and we check if it is shown
      event.stopPropagation();
      instance.hide();
      getToggleButton.focus();
    }
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
  event.preventDefault();
  Dropdown.getOrCreateInstance(this).toggle();
});

/**
 * jQuery
 */

defineJQueryPlugin(Dropdown);

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/backdrop.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$9 = 'backdrop';
const CLASS_NAME_FADE$4 = 'fade';
const CLASS_NAME_SHOW$5 = 'show';
const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$9}`;
const Default$8 = {
  className: 'modal-backdrop',
  clickCallback: null,
  isAnimated: false,
  isVisible: true,
  // if false, we use the backdrop helper without adding any element to the dom
  rootElement: 'body' // give the choice to place backdrop under different elements
};
const DefaultType$8 = {
  className: 'string',
  clickCallback: '(function|null)',
  isAnimated: 'boolean',
  isVisible: 'boolean',
  rootElement: '(element|string)'
};

/**
 * Class definition
 */

class Backdrop extends Config {
  constructor(config) {
    super();
    this._config = this._getConfig(config);
    this._isAppended = false;
    this._element = null;
  }

  // Getters
  static get Default() {
    return Default$8;
  }
  static get DefaultType() {
    return DefaultType$8;
  }
  static get NAME() {
    return NAME$9;
  }

  // Public
  show(callback) {
    if (!this._config.isVisible) {
      execute(callback);
      return;
    }
    this._append();
    const element = this._getElement();
    if (this._config.isAnimated) {
      reflow(element);
    }
    element.classList.add(CLASS_NAME_SHOW$5);
    this._emulateAnimation(() => {
      execute(callback);
    });
  }
  hide(callback) {
    if (!this._config.isVisible) {
      execute(callback);
      return;
    }
    this._getElement().classList.remove(CLASS_NAME_SHOW$5);
    this._emulateAnimation(() => {
      this.dispose();
      execute(callback);
    });
  }
  dispose() {
    if (!this._isAppended) {
      return;
    }
    EventHandler.off(this._element, EVENT_MOUSEDOWN);
    this._element.remove();
    this._isAppended = false;
  }

  // Private
  _getElement() {
    if (!this._element) {
      const backdrop = document.createElement('div');
      backdrop.className = this._config.className;
      if (this._config.isAnimated) {
        backdrop.classList.add(CLASS_NAME_FADE$4);
      }
      this._element = backdrop;
    }
    return this._element;
  }
  _configAfterMerge(config) {
    // use getElement() with the default "body" to get a fresh Element on each instantiation
    config.rootElement = getElement(config.rootElement);
    return config;
  }
  _append() {
    if (this._isAppended) {
      return;
    }
    const element = this._getElement();
    this._config.rootElement.append(element);
    EventHandler.on(element, EVENT_MOUSEDOWN, () => {
      execute(this._config.clickCallback);
    });
    this._isAppended = true;
  }
  _emulateAnimation(callback) {
    executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/focustrap.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$8 = 'focustrap';
const DATA_KEY$5 = 'bs.focustrap';
const EVENT_KEY$5 = `.${DATA_KEY$5}`;
const EVENT_FOCUSIN$2 = `focusin${EVENT_KEY$5}`;
const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$5}`;
const TAB_KEY = 'Tab';
const TAB_NAV_FORWARD = 'forward';
const TAB_NAV_BACKWARD = 'backward';
const Default$7 = {
  autofocus: true,
  trapElement: null // The element to trap focus inside of
};
const DefaultType$7 = {
  autofocus: 'boolean',
  trapElement: 'element'
};

/**
 * Class definition
 */

class FocusTrap extends Config {
  constructor(config) {
    super();
    this._config = this._getConfig(config);
    this._isActive = false;
    this._lastTabNavDirection = null;
  }

  // Getters
  static get Default() {
    return Default$7;
  }
  static get DefaultType() {
    return DefaultType$7;
  }
  static get NAME() {
    return NAME$8;
  }

  // Public
  activate() {
    if (this._isActive) {
      return;
    }
    if (this._config.autofocus) {
      this._config.trapElement.focus();
    }
    EventHandler.off(document, EVENT_KEY$5); // guard against infinite focus loop
    EventHandler.on(document, EVENT_FOCUSIN$2, event => this._handleFocusin(event));
    EventHandler.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
    this._isActive = true;
  }
  deactivate() {
    if (!this._isActive) {
      return;
    }
    this._isActive = false;
    EventHandler.off(document, EVENT_KEY$5);
  }

  // Private
  _handleFocusin(event) {
    const {
      trapElement
    } = this._config;
    if (event.target === document || event.target === trapElement || trapElement.contains(event.target)) {
      return;
    }
    const elements = SelectorEngine.focusableChildren(trapElement);
    if (elements.length === 0) {
      trapElement.focus();
    } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
      elements[elements.length - 1].focus();
    } else {
      elements[0].focus();
    }
  }
  _handleKeydown(event) {
    if (event.key !== TAB_KEY) {
      return;
    }
    this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/scrollBar.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
const SELECTOR_STICKY_CONTENT = '.sticky-top';
const PROPERTY_PADDING = 'padding-right';
const PROPERTY_MARGIN = 'margin-right';

/**
 * Class definition
 */

class ScrollBarHelper {
  constructor() {
    this._element = document.body;
  }

  // Public
  getWidth() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
    const documentWidth = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - documentWidth);
  }
  hide() {
    const width = this.getWidth();
    this._disableOverFlow();
    // give padding to element to balance the hidden scrollbar width
    this._setElementAttributes(this._element, PROPERTY_PADDING, calculatedValue => calculatedValue + width);
    // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth
    this._setElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, calculatedValue => calculatedValue + width);
    this._setElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, calculatedValue => calculatedValue - width);
  }
  reset() {
    this._resetElementAttributes(this._element, 'overflow');
    this._resetElementAttributes(this._element, PROPERTY_PADDING);
    this._resetElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING);
    this._resetElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN);
  }
  isOverflowing() {
    return this.getWidth() > 0;
  }

  // Private
  _disableOverFlow() {
    this._saveInitialAttribute(this._element, 'overflow');
    this._element.style.overflow = 'hidden';
  }
  _setElementAttributes(selector, styleProperty, callback) {
    const scrollbarWidth = this.getWidth();
    const manipulationCallBack = element => {
      if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
        return;
      }
      this._saveInitialAttribute(element, styleProperty);
      const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty);
      element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`);
    };
    this._applyManipulationCallback(selector, manipulationCallBack);
  }
  _saveInitialAttribute(element, styleProperty) {
    const actualValue = element.style.getPropertyValue(styleProperty);
    if (actualValue) {
      Manipulator.setDataAttribute(element, styleProperty, actualValue);
    }
  }
  _resetElementAttributes(selector, styleProperty) {
    const manipulationCallBack = element => {
      const value = Manipulator.getDataAttribute(element, styleProperty);
      // We only want to remove the property if the value is `null`; the value can also be zero
      if (value === null) {
        element.style.removeProperty(styleProperty);
        return;
      }
      Manipulator.removeDataAttribute(element, styleProperty);
      element.style.setProperty(styleProperty, value);
    };
    this._applyManipulationCallback(selector, manipulationCallBack);
  }
  _applyManipulationCallback(selector, callBack) {
    if (isElement(selector)) {
      callBack(selector);
      return;
    }
    for (const sel of SelectorEngine.find(selector, this._element)) {
      callBack(sel);
    }
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap modal.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$7 = 'modal';
const DATA_KEY$4 = 'bs.modal';
const EVENT_KEY$4 = `.${DATA_KEY$4}`;
const DATA_API_KEY$2 = '.data-api';
const ESCAPE_KEY$1 = 'Escape';
const EVENT_HIDE$4 = `hide${EVENT_KEY$4}`;
const EVENT_HIDE_PREVENTED$1 = `hidePrevented${EVENT_KEY$4}`;
const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$4}`;
const EVENT_SHOW$4 = `show${EVENT_KEY$4}`;
const EVENT_SHOWN$4 = `shown${EVENT_KEY$4}`;
const EVENT_RESIZE$1 = `resize${EVENT_KEY$4}`;
const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$4}`;
const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$4}`;
const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$4}`;
const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$4}${DATA_API_KEY$2}`;
const CLASS_NAME_OPEN = 'modal-open';
const CLASS_NAME_FADE$3 = 'fade';
const CLASS_NAME_SHOW$4 = 'show';
const CLASS_NAME_STATIC = 'modal-static';
const OPEN_SELECTOR$1 = '.modal.show';
const SELECTOR_DIALOG = '.modal-dialog';
const SELECTOR_MODAL_BODY = '.modal-body';
const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
const Default$6 = {
  backdrop: true,
  focus: true,
  keyboard: true
};
const DefaultType$6 = {
  backdrop: '(boolean|string)',
  focus: 'boolean',
  keyboard: 'boolean'
};

/**
 * Class definition
 */

class Modal extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
    this._backdrop = this._initializeBackDrop();
    this._focustrap = this._initializeFocusTrap();
    this._isShown = false;
    this._isTransitioning = false;
    this._scrollBar = new ScrollBarHelper();
    this._addEventListeners();
  }

  // Getters
  static get Default() {
    return Default$6;
  }
  static get DefaultType() {
    return DefaultType$6;
  }
  static get NAME() {
    return NAME$7;
  }

  // Public
  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget);
  }
  show(relatedTarget) {
    if (this._isShown || this._isTransitioning) {
      return;
    }
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) {
      return;
    }
    this._isShown = true;
    this._isTransitioning = true;
    this._scrollBar.hide();
    document.body.classList.add(CLASS_NAME_OPEN);
    this._adjustDialog();
    this._backdrop.show(() => this._showElement(relatedTarget));
  }
  hide() {
    if (!this._isShown || this._isTransitioning) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4);
    if (hideEvent.defaultPrevented) {
      return;
    }
    this._isShown = false;
    this._isTransitioning = true;
    this._focustrap.deactivate();
    this._element.classList.remove(CLASS_NAME_SHOW$4);
    this._queueCallback(() => this._hideModal(), this._element, this._isAnimated());
  }
  dispose() {
    EventHandler.off(window, EVENT_KEY$4);
    EventHandler.off(this._dialog, EVENT_KEY$4);
    this._backdrop.dispose();
    this._focustrap.deactivate();
    super.dispose();
  }
  handleUpdate() {
    this._adjustDialog();
  }

  // Private
  _initializeBackDrop() {
    return new Backdrop({
      isVisible: Boolean(this._config.backdrop),
      // 'static' option will be translated to true, and booleans will keep their value,
      isAnimated: this._isAnimated()
    });
  }
  _initializeFocusTrap() {
    return new FocusTrap({
      trapElement: this._element
    });
  }
  _showElement(relatedTarget) {
    // try to append dynamic modal
    if (!document.body.contains(this._element)) {
      document.body.append(this._element);
    }
    this._element.style.display = 'block';
    this._element.removeAttribute('aria-hidden');
    this._element.setAttribute('aria-modal', true);
    this._element.setAttribute('role', 'dialog');
    this._element.scrollTop = 0;
    const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);
    if (modalBody) {
      modalBody.scrollTop = 0;
    }
    reflow(this._element);
    this._element.classList.add(CLASS_NAME_SHOW$4);
    const transitionComplete = () => {
      if (this._config.focus) {
        this._focustrap.activate();
      }
      this._isTransitioning = false;
      EventHandler.trigger(this._element, EVENT_SHOWN$4, {
        relatedTarget
      });
    };
    this._queueCallback(transitionComplete, this._dialog, this._isAnimated());
  }
  _addEventListeners() {
    EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, event => {
      if (event.key !== ESCAPE_KEY$1) {
        return;
      }
      if (this._config.keyboard) {
        this.hide();
        return;
      }
      this._triggerBackdropTransition();
    });
    EventHandler.on(window, EVENT_RESIZE$1, () => {
      if (this._isShown && !this._isTransitioning) {
        this._adjustDialog();
      }
    });
    EventHandler.on(this._element, EVENT_MOUSEDOWN_DISMISS, event => {
      // a bad trick to segregate clicks that may start inside dialog but end outside, and avoid listen to scrollbar clicks
      EventHandler.one(this._element, EVENT_CLICK_DISMISS, event2 => {
        if (this._element !== event.target || this._element !== event2.target) {
          return;
        }
        if (this._config.backdrop === 'static') {
          this._triggerBackdropTransition();
          return;
        }
        if (this._config.backdrop) {
          this.hide();
        }
      });
    });
  }
  _hideModal() {
    this._element.style.display = 'none';
    this._element.setAttribute('aria-hidden', true);
    this._element.removeAttribute('aria-modal');
    this._element.removeAttribute('role');
    this._isTransitioning = false;
    this._backdrop.hide(() => {
      document.body.classList.remove(CLASS_NAME_OPEN);
      this._resetAdjustments();
      this._scrollBar.reset();
      EventHandler.trigger(this._element, EVENT_HIDDEN$4);
    });
  }
  _isAnimated() {
    return this._element.classList.contains(CLASS_NAME_FADE$3);
  }
  _triggerBackdropTransition() {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED$1);
    if (hideEvent.defaultPrevented) {
      return;
    }
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
    const initialOverflowY = this._element.style.overflowY;
    // return if the following background transition hasn't yet completed
    if (initialOverflowY === 'hidden' || this._element.classList.contains(CLASS_NAME_STATIC)) {
      return;
    }
    if (!isModalOverflowing) {
      this._element.style.overflowY = 'hidden';
    }
    this._element.classList.add(CLASS_NAME_STATIC);
    this._queueCallback(() => {
      this._element.classList.remove(CLASS_NAME_STATIC);
      this._queueCallback(() => {
        this._element.style.overflowY = initialOverflowY;
      }, this._dialog);
    }, this._dialog);
    this._element.focus();
  }

  /**
   * The following methods are used to handle overflowing modals
   */

  _adjustDialog() {
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
    const scrollbarWidth = this._scrollBar.getWidth();
    const isBodyOverflowing = scrollbarWidth > 0;
    if (isBodyOverflowing && !isModalOverflowing) {
      const property = isRTL() ? 'paddingLeft' : 'paddingRight';
      this._element.style[property] = `${scrollbarWidth}px`;
    }
    if (!isBodyOverflowing && isModalOverflowing) {
      const property = isRTL() ? 'paddingRight' : 'paddingLeft';
      this._element.style[property] = `${scrollbarWidth}px`;
    }
  }
  _resetAdjustments() {
    this._element.style.paddingLeft = '';
    this._element.style.paddingRight = '';
  }

  // Static
  static jQueryInterface(config, relatedTarget) {
    return this.each(function () {
      const data = Modal.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config](relatedTarget);
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
  const target = SelectorEngine.getElementFromSelector(this);
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  EventHandler.one(target, EVENT_SHOW$4, showEvent => {
    if (showEvent.defaultPrevented) {
      // only register focus restorer if modal will actually get shown
      return;
    }
    EventHandler.one(target, EVENT_HIDDEN$4, () => {
      if (isVisible(this)) {
        this.focus();
      }
    });
  });

  // avoid conflict when clicking modal toggler while another one is open
  const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR$1);
  if (alreadyOpen) {
    Modal.getInstance(alreadyOpen).hide();
  }
  const data = Modal.getOrCreateInstance(target);
  data.toggle(this);
});
enableDismissTrigger(Modal);

/**
 * jQuery
 */

defineJQueryPlugin(Modal);

/**
 * --------------------------------------------------------------------------
 * Bootstrap offcanvas.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$6 = 'offcanvas';
const DATA_KEY$3 = 'bs.offcanvas';
const EVENT_KEY$3 = `.${DATA_KEY$3}`;
const DATA_API_KEY$1 = '.data-api';
const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$3}${DATA_API_KEY$1}`;
const ESCAPE_KEY = 'Escape';
const CLASS_NAME_SHOW$3 = 'show';
const CLASS_NAME_SHOWING$1 = 'showing';
const CLASS_NAME_HIDING = 'hiding';
const CLASS_NAME_BACKDROP = 'offcanvas-backdrop';
const OPEN_SELECTOR = '.offcanvas.show';
const EVENT_SHOW$3 = `show${EVENT_KEY$3}`;
const EVENT_SHOWN$3 = `shown${EVENT_KEY$3}`;
const EVENT_HIDE$3 = `hide${EVENT_KEY$3}`;
const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$3}`;
const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$3}`;
const EVENT_RESIZE = `resize${EVENT_KEY$3}`;
const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$3}${DATA_API_KEY$1}`;
const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$3}`;
const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
const Default$5 = {
  backdrop: true,
  keyboard: true,
  scroll: false
};
const DefaultType$5 = {
  backdrop: '(boolean|string)',
  keyboard: 'boolean',
  scroll: 'boolean'
};

/**
 * Class definition
 */

class Offcanvas extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._isShown = false;
    this._backdrop = this._initializeBackDrop();
    this._focustrap = this._initializeFocusTrap();
    this._addEventListeners();
  }

  // Getters
  static get Default() {
    return Default$5;
  }
  static get DefaultType() {
    return DefaultType$5;
  }
  static get NAME() {
    return NAME$6;
  }

  // Public
  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget);
  }
  show(relatedTarget) {
    if (this._isShown) {
      return;
    }
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) {
      return;
    }
    this._isShown = true;
    this._backdrop.show();
    if (!this._config.scroll) {
      new ScrollBarHelper().hide();
    }
    this._element.setAttribute('aria-modal', true);
    this._element.setAttribute('role', 'dialog');
    this._element.classList.add(CLASS_NAME_SHOWING$1);
    const completeCallBack = () => {
      if (!this._config.scroll || this._config.backdrop) {
        this._focustrap.activate();
      }
      this._element.classList.add(CLASS_NAME_SHOW$3);
      this._element.classList.remove(CLASS_NAME_SHOWING$1);
      EventHandler.trigger(this._element, EVENT_SHOWN$3, {
        relatedTarget
      });
    };
    this._queueCallback(completeCallBack, this._element, true);
  }
  hide() {
    if (!this._isShown) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);
    if (hideEvent.defaultPrevented) {
      return;
    }
    this._focustrap.deactivate();
    this._element.blur();
    this._isShown = false;
    this._element.classList.add(CLASS_NAME_HIDING);
    this._backdrop.hide();
    const completeCallback = () => {
      this._element.classList.remove(CLASS_NAME_SHOW$3, CLASS_NAME_HIDING);
      this._element.removeAttribute('aria-modal');
      this._element.removeAttribute('role');
      if (!this._config.scroll) {
        new ScrollBarHelper().reset();
      }
      EventHandler.trigger(this._element, EVENT_HIDDEN$3);
    };
    this._queueCallback(completeCallback, this._element, true);
  }
  dispose() {
    this._backdrop.dispose();
    this._focustrap.deactivate();
    super.dispose();
  }

  // Private
  _initializeBackDrop() {
    const clickCallback = () => {
      if (this._config.backdrop === 'static') {
        EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
        return;
      }
      this.hide();
    };

    // 'static' option will be translated to true, and booleans will keep their value
    const isVisible = Boolean(this._config.backdrop);
    return new Backdrop({
      className: CLASS_NAME_BACKDROP,
      isVisible,
      isAnimated: true,
      rootElement: this._element.parentNode,
      clickCallback: isVisible ? clickCallback : null
    });
  }
  _initializeFocusTrap() {
    return new FocusTrap({
      trapElement: this._element
    });
  }
  _addEventListeners() {
    EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
      if (event.key !== ESCAPE_KEY) {
        return;
      }
      if (this._config.keyboard) {
        this.hide();
        return;
      }
      EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
    });
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Offcanvas.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config](this);
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
  const target = SelectorEngine.getElementFromSelector(this);
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  if (isDisabled(this)) {
    return;
  }
  EventHandler.one(target, EVENT_HIDDEN$3, () => {
    // focus on trigger when it is closed
    if (isVisible(this)) {
      this.focus();
    }
  });

  // avoid conflict when clicking a toggler of an offcanvas, while another is open
  const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);
  if (alreadyOpen && alreadyOpen !== target) {
    Offcanvas.getInstance(alreadyOpen).hide();
  }
  const data = Offcanvas.getOrCreateInstance(target);
  data.toggle(this);
});
EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
  for (const selector of SelectorEngine.find(OPEN_SELECTOR)) {
    Offcanvas.getOrCreateInstance(selector).show();
  }
});
EventHandler.on(window, EVENT_RESIZE, () => {
  for (const element of SelectorEngine.find('[aria-modal][class*=show][class*=offcanvas-]')) {
    if (getComputedStyle(element).position !== 'fixed') {
      Offcanvas.getOrCreateInstance(element).hide();
    }
  }
});
enableDismissTrigger(Offcanvas);

/**
 * jQuery
 */

defineJQueryPlugin(Offcanvas);

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/sanitizer.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

// js-docs-start allow-list
const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
const DefaultAllowlist = {
  // Global attributes allowed on any supplied element below.
  '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
  a: ['target', 'href', 'title', 'rel'],
  area: [],
  b: [],
  br: [],
  col: [],
  code: [],
  dd: [],
  div: [],
  dl: [],
  dt: [],
  em: [],
  hr: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  i: [],
  img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
  li: [],
  ol: [],
  p: [],
  pre: [],
  s: [],
  small: [],
  span: [],
  sub: [],
  sup: [],
  strong: [],
  u: [],
  ul: []
};
// js-docs-end allow-list

const uriAttributes = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);

/**
 * A pattern that recognizes URLs that are safe wrt. XSS in URL navigation
 * contexts.
 *
 * Shout-out to Angular https://github.com/angular/angular/blob/15.2.8/packages/core/src/sanitization/url_sanitizer.ts#L38
 */
const SAFE_URL_PATTERN = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i;
const allowedAttribute = (attribute, allowedAttributeList) => {
  const attributeName = attribute.nodeName.toLowerCase();
  if (allowedAttributeList.includes(attributeName)) {
    if (uriAttributes.has(attributeName)) {
      return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue));
    }
    return true;
  }

  // Check if a regular expression validates the attribute.
  return allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp).some(regex => regex.test(attributeName));
};
function sanitizeHtml(unsafeHtml, allowList, sanitizeFunction) {
  if (!unsafeHtml.length) {
    return unsafeHtml;
  }
  if (sanitizeFunction && typeof sanitizeFunction === 'function') {
    return sanitizeFunction(unsafeHtml);
  }
  const domParser = new window.DOMParser();
  const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
  const elements = [].concat(...createdDocument.body.querySelectorAll('*'));
  for (const element of elements) {
    const elementName = element.nodeName.toLowerCase();
    if (!Object.keys(allowList).includes(elementName)) {
      element.remove();
      continue;
    }
    const attributeList = [].concat(...element.attributes);
    const allowedAttributes = [].concat(allowList['*'] || [], allowList[elementName] || []);
    for (const attribute of attributeList) {
      if (!allowedAttribute(attribute, allowedAttributes)) {
        element.removeAttribute(attribute.nodeName);
      }
    }
  }
  return createdDocument.body.innerHTML;
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/template-factory.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$5 = 'TemplateFactory';
const Default$4 = {
  allowList: DefaultAllowlist,
  content: {},
  // { selector : text ,  selector2 : text2 , }
  extraClass: '',
  html: false,
  sanitize: true,
  sanitizeFn: null,
  template: '<div></div>'
};
const DefaultType$4 = {
  allowList: 'object',
  content: 'object',
  extraClass: '(string|function)',
  html: 'boolean',
  sanitize: 'boolean',
  sanitizeFn: '(null|function)',
  template: 'string'
};
const DefaultContentType = {
  entry: '(string|element|function|null)',
  selector: '(string|element)'
};

/**
 * Class definition
 */

class TemplateFactory extends Config {
  constructor(config) {
    super();
    this._config = this._getConfig(config);
  }

  // Getters
  static get Default() {
    return Default$4;
  }
  static get DefaultType() {
    return DefaultType$4;
  }
  static get NAME() {
    return NAME$5;
  }

  // Public
  getContent() {
    return Object.values(this._config.content).map(config => this._resolvePossibleFunction(config)).filter(Boolean);
  }
  hasContent() {
    return this.getContent().length > 0;
  }
  changeContent(content) {
    this._checkContent(content);
    this._config.content = {
      ...this._config.content,
      ...content
    };
    return this;
  }
  toHtml() {
    const templateWrapper = document.createElement('div');
    templateWrapper.innerHTML = this._maybeSanitize(this._config.template);
    for (const [selector, text] of Object.entries(this._config.content)) {
      this._setContent(templateWrapper, text, selector);
    }
    const template = templateWrapper.children[0];
    const extraClass = this._resolvePossibleFunction(this._config.extraClass);
    if (extraClass) {
      template.classList.add(...extraClass.split(' '));
    }
    return template;
  }

  // Private
  _typeCheckConfig(config) {
    super._typeCheckConfig(config);
    this._checkContent(config.content);
  }
  _checkContent(arg) {
    for (const [selector, content] of Object.entries(arg)) {
      super._typeCheckConfig({
        selector,
        entry: content
      }, DefaultContentType);
    }
  }
  _setContent(template, content, selector) {
    const templateElement = SelectorEngine.findOne(selector, template);
    if (!templateElement) {
      return;
    }
    content = this._resolvePossibleFunction(content);
    if (!content) {
      templateElement.remove();
      return;
    }
    if (isElement(content)) {
      this._putElementInTemplate(getElement(content), templateElement);
      return;
    }
    if (this._config.html) {
      templateElement.innerHTML = this._maybeSanitize(content);
      return;
    }
    templateElement.textContent = content;
  }
  _maybeSanitize(arg) {
    return this._config.sanitize ? sanitizeHtml(arg, this._config.allowList, this._config.sanitizeFn) : arg;
  }
  _resolvePossibleFunction(arg) {
    return execute(arg, [undefined, this]);
  }
  _putElementInTemplate(element, templateElement) {
    if (this._config.html) {
      templateElement.innerHTML = '';
      templateElement.append(element);
      return;
    }
    templateElement.textContent = element.textContent;
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap tooltip.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$4 = 'tooltip';
const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
const CLASS_NAME_FADE$2 = 'fade';
const CLASS_NAME_MODAL = 'modal';
const CLASS_NAME_SHOW$2 = 'show';
const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
const EVENT_MODAL_HIDE = 'hide.bs.modal';
const TRIGGER_HOVER = 'hover';
const TRIGGER_FOCUS = 'focus';
const TRIGGER_CLICK = 'click';
const TRIGGER_MANUAL = 'manual';
const EVENT_HIDE$2 = 'hide';
const EVENT_HIDDEN$2 = 'hidden';
const EVENT_SHOW$2 = 'show';
const EVENT_SHOWN$2 = 'shown';
const EVENT_INSERTED = 'inserted';
const EVENT_CLICK$1 = 'click';
const EVENT_FOCUSIN$1 = 'focusin';
const EVENT_FOCUSOUT$1 = 'focusout';
const EVENT_MOUSEENTER = 'mouseenter';
const EVENT_MOUSELEAVE = 'mouseleave';
const AttachmentMap = {
  AUTO: 'auto',
  TOP: 'top',
  RIGHT: isRTL() ? 'left' : 'right',
  BOTTOM: 'bottom',
  LEFT: isRTL() ? 'right' : 'left'
};
const Default$3 = {
  allowList: DefaultAllowlist,
  animation: true,
  boundary: 'clippingParents',
  container: false,
  customClass: '',
  delay: 0,
  fallbackPlacements: ['top', 'right', 'bottom', 'left'],
  html: false,
  offset: [0, 6],
  placement: 'top',
  popperConfig: null,
  sanitize: true,
  sanitizeFn: null,
  selector: false,
  template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
  title: '',
  trigger: 'hover focus'
};
const DefaultType$3 = {
  allowList: 'object',
  animation: 'boolean',
  boundary: '(string|element)',
  container: '(string|element|boolean)',
  customClass: '(string|function)',
  delay: '(number|object)',
  fallbackPlacements: 'array',
  html: 'boolean',
  offset: '(array|string|function)',
  placement: '(string|function)',
  popperConfig: '(null|object|function)',
  sanitize: 'boolean',
  sanitizeFn: '(null|function)',
  selector: '(string|boolean)',
  template: 'string',
  title: '(string|element|function)',
  trigger: 'string'
};

/**
 * Class definition
 */

class Tooltip extends BaseComponent {
  constructor(element, config) {
    if (typeof _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ === 'undefined') {
      throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org/docs/v2/)');
    }
    super(element, config);

    // Private
    this._isEnabled = true;
    this._timeout = 0;
    this._isHovered = null;
    this._activeTrigger = {};
    this._popper = null;
    this._templateFactory = null;
    this._newContent = null;

    // Protected
    this.tip = null;
    this._setListeners();
    if (!this._config.selector) {
      this._fixTitle();
    }
  }

  // Getters
  static get Default() {
    return Default$3;
  }
  static get DefaultType() {
    return DefaultType$3;
  }
  static get NAME() {
    return NAME$4;
  }

  // Public
  enable() {
    this._isEnabled = true;
  }
  disable() {
    this._isEnabled = false;
  }
  toggleEnabled() {
    this._isEnabled = !this._isEnabled;
  }
  toggle() {
    if (!this._isEnabled) {
      return;
    }
    if (this._isShown()) {
      this._leave();
      return;
    }
    this._enter();
  }
  dispose() {
    clearTimeout(this._timeout);
    EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
    if (this._element.getAttribute('data-bs-original-title')) {
      this._element.setAttribute('title', this._element.getAttribute('data-bs-original-title'));
    }
    this._disposePopper();
    super.dispose();
  }
  show() {
    if (this._element.style.display === 'none') {
      throw new Error('Please use show on visible elements');
    }
    if (!(this._isWithContent() && this._isEnabled)) {
      return;
    }
    const showEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOW$2));
    const shadowRoot = findShadowRoot(this._element);
    const isInTheDom = (shadowRoot || this._element.ownerDocument.documentElement).contains(this._element);
    if (showEvent.defaultPrevented || !isInTheDom) {
      return;
    }

    // TODO: v6 remove this or make it optional
    this._disposePopper();
    const tip = this._getTipElement();
    this._element.setAttribute('aria-describedby', tip.getAttribute('id'));
    const {
      container
    } = this._config;
    if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
      container.append(tip);
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_INSERTED));
    }
    this._popper = this._createPopper(tip);
    tip.classList.add(CLASS_NAME_SHOW$2);

    // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.on(element, 'mouseover', noop);
      }
    }
    const complete = () => {
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOWN$2));
      if (this._isHovered === false) {
        this._leave();
      }
      this._isHovered = false;
    };
    this._queueCallback(complete, this.tip, this._isAnimated());
  }
  hide() {
    if (!this._isShown()) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDE$2));
    if (hideEvent.defaultPrevented) {
      return;
    }
    const tip = this._getTipElement();
    tip.classList.remove(CLASS_NAME_SHOW$2);

    // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.off(element, 'mouseover', noop);
      }
    }
    this._activeTrigger[TRIGGER_CLICK] = false;
    this._activeTrigger[TRIGGER_FOCUS] = false;
    this._activeTrigger[TRIGGER_HOVER] = false;
    this._isHovered = null; // it is a trick to support manual triggering

    const complete = () => {
      if (this._isWithActiveTrigger()) {
        return;
      }
      if (!this._isHovered) {
        this._disposePopper();
      }
      this._element.removeAttribute('aria-describedby');
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDDEN$2));
    };
    this._queueCallback(complete, this.tip, this._isAnimated());
  }
  update() {
    if (this._popper) {
      this._popper.update();
    }
  }

  // Protected
  _isWithContent() {
    return Boolean(this._getTitle());
  }
  _getTipElement() {
    if (!this.tip) {
      this.tip = this._createTipElement(this._newContent || this._getContentForTemplate());
    }
    return this.tip;
  }
  _createTipElement(content) {
    const tip = this._getTemplateFactory(content).toHtml();

    // TODO: remove this check in v6
    if (!tip) {
      return null;
    }
    tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
    // TODO: v6 the following can be achieved with CSS only
    tip.classList.add(`bs-${this.constructor.NAME}-auto`);
    const tipId = getUID(this.constructor.NAME).toString();
    tip.setAttribute('id', tipId);
    if (this._isAnimated()) {
      tip.classList.add(CLASS_NAME_FADE$2);
    }
    return tip;
  }
  setContent(content) {
    this._newContent = content;
    if (this._isShown()) {
      this._disposePopper();
      this.show();
    }
  }
  _getTemplateFactory(content) {
    if (this._templateFactory) {
      this._templateFactory.changeContent(content);
    } else {
      this._templateFactory = new TemplateFactory({
        ...this._config,
        // the `content` var has to be after `this._config`
        // to override config.content in case of popover
        content,
        extraClass: this._resolvePossibleFunction(this._config.customClass)
      });
    }
    return this._templateFactory;
  }
  _getContentForTemplate() {
    return {
      [SELECTOR_TOOLTIP_INNER]: this._getTitle()
    };
  }
  _getTitle() {
    return this._resolvePossibleFunction(this._config.title) || this._element.getAttribute('data-bs-original-title');
  }

  // Private
  _initializeOnDelegatedTarget(event) {
    return this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
  }
  _isAnimated() {
    return this._config.animation || this.tip && this.tip.classList.contains(CLASS_NAME_FADE$2);
  }
  _isShown() {
    return this.tip && this.tip.classList.contains(CLASS_NAME_SHOW$2);
  }
  _createPopper(tip) {
    const placement = execute(this._config.placement, [this, tip, this._element]);
    const attachment = AttachmentMap[placement.toUpperCase()];
    return _popperjs_core__WEBPACK_IMPORTED_MODULE_1__.createPopper(this._element, tip, this._getPopperConfig(attachment));
  }
  _getOffset() {
    const {
      offset
    } = this._config;
    if (typeof offset === 'string') {
      return offset.split(',').map(value => Number.parseInt(value, 10));
    }
    if (typeof offset === 'function') {
      return popperData => offset(popperData, this._element);
    }
    return offset;
  }
  _resolvePossibleFunction(arg) {
    return execute(arg, [this._element, this._element]);
  }
  _getPopperConfig(attachment) {
    const defaultBsPopperConfig = {
      placement: attachment,
      modifiers: [{
        name: 'flip',
        options: {
          fallbackPlacements: this._config.fallbackPlacements
        }
      }, {
        name: 'offset',
        options: {
          offset: this._getOffset()
        }
      }, {
        name: 'preventOverflow',
        options: {
          boundary: this._config.boundary
        }
      }, {
        name: 'arrow',
        options: {
          element: `.${this.constructor.NAME}-arrow`
        }
      }, {
        name: 'preSetPlacement',
        enabled: true,
        phase: 'beforeMain',
        fn: data => {
          // Pre-set Popper's placement attribute in order to read the arrow sizes properly.
          // Otherwise, Popper mixes up the width and height dimensions since the initial arrow style is for top placement
          this._getTipElement().setAttribute('data-popper-placement', data.state.placement);
        }
      }]
    };
    return {
      ...defaultBsPopperConfig,
      ...execute(this._config.popperConfig, [undefined, defaultBsPopperConfig])
    };
  }
  _setListeners() {
    const triggers = this._config.trigger.split(' ');
    for (const trigger of triggers) {
      if (trigger === 'click') {
        EventHandler.on(this._element, this.constructor.eventName(EVENT_CLICK$1), this._config.selector, event => {
          const context = this._initializeOnDelegatedTarget(event);
          context._activeTrigger[TRIGGER_CLICK] = !(context._isShown() && context._activeTrigger[TRIGGER_CLICK]);
          context.toggle();
        });
      } else if (trigger !== TRIGGER_MANUAL) {
        const eventIn = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSEENTER) : this.constructor.eventName(EVENT_FOCUSIN$1);
        const eventOut = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSELEAVE) : this.constructor.eventName(EVENT_FOCUSOUT$1);
        EventHandler.on(this._element, eventIn, this._config.selector, event => {
          const context = this._initializeOnDelegatedTarget(event);
          context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
          context._enter();
        });
        EventHandler.on(this._element, eventOut, this._config.selector, event => {
          const context = this._initializeOnDelegatedTarget(event);
          context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
          context._leave();
        });
      }
    }
    this._hideModalHandler = () => {
      if (this._element) {
        this.hide();
      }
    };
    EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
  }
  _fixTitle() {
    const title = this._element.getAttribute('title');
    if (!title) {
      return;
    }
    if (!this._element.getAttribute('aria-label') && !this._element.textContent.trim()) {
      this._element.setAttribute('aria-label', title);
    }
    this._element.setAttribute('data-bs-original-title', title); // DO NOT USE IT. Is only for backwards compatibility
    this._element.removeAttribute('title');
  }
  _enter() {
    if (this._isShown() || this._isHovered) {
      this._isHovered = true;
      return;
    }
    this._isHovered = true;
    this._setTimeout(() => {
      if (this._isHovered) {
        this.show();
      }
    }, this._config.delay.show);
  }
  _leave() {
    if (this._isWithActiveTrigger()) {
      return;
    }
    this._isHovered = false;
    this._setTimeout(() => {
      if (!this._isHovered) {
        this.hide();
      }
    }, this._config.delay.hide);
  }
  _setTimeout(handler, timeout) {
    clearTimeout(this._timeout);
    this._timeout = setTimeout(handler, timeout);
  }
  _isWithActiveTrigger() {
    return Object.values(this._activeTrigger).includes(true);
  }
  _getConfig(config) {
    const dataAttributes = Manipulator.getDataAttributes(this._element);
    for (const dataAttribute of Object.keys(dataAttributes)) {
      if (DISALLOWED_ATTRIBUTES.has(dataAttribute)) {
        delete dataAttributes[dataAttribute];
      }
    }
    config = {
      ...dataAttributes,
      ...(typeof config === 'object' && config ? config : {})
    };
    config = this._mergeConfigObj(config);
    config = this._configAfterMerge(config);
    this._typeCheckConfig(config);
    return config;
  }
  _configAfterMerge(config) {
    config.container = config.container === false ? document.body : getElement(config.container);
    if (typeof config.delay === 'number') {
      config.delay = {
        show: config.delay,
        hide: config.delay
      };
    }
    if (typeof config.title === 'number') {
      config.title = config.title.toString();
    }
    if (typeof config.content === 'number') {
      config.content = config.content.toString();
    }
    return config;
  }
  _getDelegateConfig() {
    const config = {};
    for (const [key, value] of Object.entries(this._config)) {
      if (this.constructor.Default[key] !== value) {
        config[key] = value;
      }
    }
    config.selector = false;
    config.trigger = 'manual';

    // In the future can be replaced with:
    // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
    // `Object.fromEntries(keysWithDifferentValues)`
    return config;
  }
  _disposePopper() {
    if (this._popper) {
      this._popper.destroy();
      this._popper = null;
    }
    if (this.tip) {
      this.tip.remove();
      this.tip = null;
    }
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Tooltip.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
}

/**
 * jQuery
 */

defineJQueryPlugin(Tooltip);

/**
 * --------------------------------------------------------------------------
 * Bootstrap popover.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$3 = 'popover';
const SELECTOR_TITLE = '.popover-header';
const SELECTOR_CONTENT = '.popover-body';
const Default$2 = {
  ...Tooltip.Default,
  content: '',
  offset: [0, 8],
  placement: 'right',
  template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>',
  trigger: 'click'
};
const DefaultType$2 = {
  ...Tooltip.DefaultType,
  content: '(null|string|element|function)'
};

/**
 * Class definition
 */

class Popover extends Tooltip {
  // Getters
  static get Default() {
    return Default$2;
  }
  static get DefaultType() {
    return DefaultType$2;
  }
  static get NAME() {
    return NAME$3;
  }

  // Overrides
  _isWithContent() {
    return this._getTitle() || this._getContent();
  }

  // Private
  _getContentForTemplate() {
    return {
      [SELECTOR_TITLE]: this._getTitle(),
      [SELECTOR_CONTENT]: this._getContent()
    };
  }
  _getContent() {
    return this._resolvePossibleFunction(this._config.content);
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Popover.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
}

/**
 * jQuery
 */

defineJQueryPlugin(Popover);

/**
 * --------------------------------------------------------------------------
 * Bootstrap scrollspy.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$2 = 'scrollspy';
const DATA_KEY$2 = 'bs.scrollspy';
const EVENT_KEY$2 = `.${DATA_KEY$2}`;
const DATA_API_KEY = '.data-api';
const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
const EVENT_CLICK = `click${EVENT_KEY$2}`;
const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$2}${DATA_API_KEY}`;
const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
const CLASS_NAME_ACTIVE$1 = 'active';
const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
const SELECTOR_TARGET_LINKS = '[href]';
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
const SELECTOR_NAV_LINKS = '.nav-link';
const SELECTOR_NAV_ITEMS = '.nav-item';
const SELECTOR_LIST_ITEMS = '.list-group-item';
const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`;
const SELECTOR_DROPDOWN = '.dropdown';
const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
const Default$1 = {
  offset: null,
  // TODO: v6 @deprecated, keep it for backwards compatibility reasons
  rootMargin: '0px 0px -25%',
  smoothScroll: false,
  target: null,
  threshold: [0.1, 0.5, 1]
};
const DefaultType$1 = {
  offset: '(number|null)',
  // TODO v6 @deprecated, keep it for backwards compatibility reasons
  rootMargin: 'string',
  smoothScroll: 'boolean',
  target: 'element',
  threshold: 'array'
};

/**
 * Class definition
 */

class ScrollSpy extends BaseComponent {
  constructor(element, config) {
    super(element, config);

    // this._element is the observablesContainer and config.target the menu links wrapper
    this._targetLinks = new Map();
    this._observableSections = new Map();
    this._rootElement = getComputedStyle(this._element).overflowY === 'visible' ? null : this._element;
    this._activeTarget = null;
    this._observer = null;
    this._previousScrollData = {
      visibleEntryTop: 0,
      parentScrollTop: 0
    };
    this.refresh(); // initialize
  }

  // Getters
  static get Default() {
    return Default$1;
  }
  static get DefaultType() {
    return DefaultType$1;
  }
  static get NAME() {
    return NAME$2;
  }

  // Public
  refresh() {
    this._initializeTargetsAndObservables();
    this._maybeEnableSmoothScroll();
    if (this._observer) {
      this._observer.disconnect();
    } else {
      this._observer = this._getNewObserver();
    }
    for (const section of this._observableSections.values()) {
      this._observer.observe(section);
    }
  }
  dispose() {
    this._observer.disconnect();
    super.dispose();
  }

  // Private
  _configAfterMerge(config) {
    // TODO: on v6 target should be given explicitly & remove the {target: 'ss-target'} case
    config.target = getElement(config.target) || document.body;

    // TODO: v6 Only for backwards compatibility reasons. Use rootMargin only
    config.rootMargin = config.offset ? `${config.offset}px 0px -30%` : config.rootMargin;
    if (typeof config.threshold === 'string') {
      config.threshold = config.threshold.split(',').map(value => Number.parseFloat(value));
    }
    return config;
  }
  _maybeEnableSmoothScroll() {
    if (!this._config.smoothScroll) {
      return;
    }

    // unregister any previous listeners
    EventHandler.off(this._config.target, EVENT_CLICK);
    EventHandler.on(this._config.target, EVENT_CLICK, SELECTOR_TARGET_LINKS, event => {
      const observableSection = this._observableSections.get(event.target.hash);
      if (observableSection) {
        event.preventDefault();
        const root = this._rootElement || window;
        const height = observableSection.offsetTop - this._element.offsetTop;
        if (root.scrollTo) {
          root.scrollTo({
            top: height,
            behavior: 'smooth'
          });
          return;
        }

        // Chrome 60 doesn't support `scrollTo`
        root.scrollTop = height;
      }
    });
  }
  _getNewObserver() {
    const options = {
      root: this._rootElement,
      threshold: this._config.threshold,
      rootMargin: this._config.rootMargin
    };
    return new IntersectionObserver(entries => this._observerCallback(entries), options);
  }

  // The logic of selection
  _observerCallback(entries) {
    const targetElement = entry => this._targetLinks.get(`#${entry.target.id}`);
    const activate = entry => {
      this._previousScrollData.visibleEntryTop = entry.target.offsetTop;
      this._process(targetElement(entry));
    };
    const parentScrollTop = (this._rootElement || document.documentElement).scrollTop;
    const userScrollsDown = parentScrollTop >= this._previousScrollData.parentScrollTop;
    this._previousScrollData.parentScrollTop = parentScrollTop;
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        this._activeTarget = null;
        this._clearActiveClass(targetElement(entry));
        continue;
      }
      const entryIsLowerThanPrevious = entry.target.offsetTop >= this._previousScrollData.visibleEntryTop;
      // if we are scrolling down, pick the bigger offsetTop
      if (userScrollsDown && entryIsLowerThanPrevious) {
        activate(entry);
        // if parent isn't scrolled, let's keep the first visible item, breaking the iteration
        if (!parentScrollTop) {
          return;
        }
        continue;
      }

      // if we are scrolling up, pick the smallest offsetTop
      if (!userScrollsDown && !entryIsLowerThanPrevious) {
        activate(entry);
      }
    }
  }
  _initializeTargetsAndObservables() {
    this._targetLinks = new Map();
    this._observableSections = new Map();
    const targetLinks = SelectorEngine.find(SELECTOR_TARGET_LINKS, this._config.target);
    for (const anchor of targetLinks) {
      // ensure that the anchor has an id and is not disabled
      if (!anchor.hash || isDisabled(anchor)) {
        continue;
      }
      const observableSection = SelectorEngine.findOne(decodeURI(anchor.hash), this._element);

      // ensure that the observableSection exists & is visible
      if (isVisible(observableSection)) {
        this._targetLinks.set(decodeURI(anchor.hash), anchor);
        this._observableSections.set(anchor.hash, observableSection);
      }
    }
  }
  _process(target) {
    if (this._activeTarget === target) {
      return;
    }
    this._clearActiveClass(this._config.target);
    this._activeTarget = target;
    target.classList.add(CLASS_NAME_ACTIVE$1);
    this._activateParents(target);
    EventHandler.trigger(this._element, EVENT_ACTIVATE, {
      relatedTarget: target
    });
  }
  _activateParents(target) {
    // Activate dropdown parents
    if (target.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
      SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, target.closest(SELECTOR_DROPDOWN)).classList.add(CLASS_NAME_ACTIVE$1);
      return;
    }
    for (const listGroup of SelectorEngine.parents(target, SELECTOR_NAV_LIST_GROUP)) {
      // Set triggered links parents as active
      // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
      for (const item of SelectorEngine.prev(listGroup, SELECTOR_LINK_ITEMS)) {
        item.classList.add(CLASS_NAME_ACTIVE$1);
      }
    }
  }
  _clearActiveClass(parent) {
    parent.classList.remove(CLASS_NAME_ACTIVE$1);
    const activeNodes = SelectorEngine.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE$1}`, parent);
    for (const node of activeNodes) {
      node.classList.remove(CLASS_NAME_ACTIVE$1);
    }
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = ScrollSpy.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => {
  for (const spy of SelectorEngine.find(SELECTOR_DATA_SPY)) {
    ScrollSpy.getOrCreateInstance(spy);
  }
});

/**
 * jQuery
 */

defineJQueryPlugin(ScrollSpy);

/**
 * --------------------------------------------------------------------------
 * Bootstrap tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$1 = 'tab';
const DATA_KEY$1 = 'bs.tab';
const EVENT_KEY$1 = `.${DATA_KEY$1}`;
const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}`;
const EVENT_KEYDOWN = `keydown${EVENT_KEY$1}`;
const EVENT_LOAD_DATA_API = `load${EVENT_KEY$1}`;
const ARROW_LEFT_KEY = 'ArrowLeft';
const ARROW_RIGHT_KEY = 'ArrowRight';
const ARROW_UP_KEY = 'ArrowUp';
const ARROW_DOWN_KEY = 'ArrowDown';
const HOME_KEY = 'Home';
const END_KEY = 'End';
const CLASS_NAME_ACTIVE = 'active';
const CLASS_NAME_FADE$1 = 'fade';
const CLASS_NAME_SHOW$1 = 'show';
const CLASS_DROPDOWN = 'dropdown';
const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
const SELECTOR_DROPDOWN_MENU = '.dropdown-menu';
const NOT_SELECTOR_DROPDOWN_TOGGLE = `:not(${SELECTOR_DROPDOWN_TOGGLE})`;
const SELECTOR_TAB_PANEL = '.list-group, .nav, [role="tablist"]';
const SELECTOR_OUTER = '.nav-item, .list-group-item';
const SELECTOR_INNER = `.nav-link${NOT_SELECTOR_DROPDOWN_TOGGLE}, .list-group-item${NOT_SELECTOR_DROPDOWN_TOGGLE}, [role="tab"]${NOT_SELECTOR_DROPDOWN_TOGGLE}`;
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]'; // TODO: could only be `tab` in v6
const SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE}`;
const SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="pill"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="list"]`;

/**
 * Class definition
 */

class Tab extends BaseComponent {
  constructor(element) {
    super(element);
    this._parent = this._element.closest(SELECTOR_TAB_PANEL);
    if (!this._parent) {
      return;
      // TODO: should throw exception in v6
      // throw new TypeError(`${element.outerHTML} has not a valid parent ${SELECTOR_INNER_ELEM}`)
    }

    // Set up initial aria attributes
    this._setInitialAttributes(this._parent, this._getChildren());
    EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
  }

  // Getters
  static get NAME() {
    return NAME$1;
  }

  // Public
  show() {
    // Shows this elem and deactivate the active sibling if exists
    const innerElem = this._element;
    if (this._elemIsActive(innerElem)) {
      return;
    }

    // Search for active tab on same parent to deactivate it
    const active = this._getActiveElem();
    const hideEvent = active ? EventHandler.trigger(active, EVENT_HIDE$1, {
      relatedTarget: innerElem
    }) : null;
    const showEvent = EventHandler.trigger(innerElem, EVENT_SHOW$1, {
      relatedTarget: active
    });
    if (showEvent.defaultPrevented || hideEvent && hideEvent.defaultPrevented) {
      return;
    }
    this._deactivate(active, innerElem);
    this._activate(innerElem, active);
  }

  // Private
  _activate(element, relatedElem) {
    if (!element) {
      return;
    }
    element.classList.add(CLASS_NAME_ACTIVE);
    this._activate(SelectorEngine.getElementFromSelector(element)); // Search and activate/show the proper section

    const complete = () => {
      if (element.getAttribute('role') !== 'tab') {
        element.classList.add(CLASS_NAME_SHOW$1);
        return;
      }
      element.removeAttribute('tabindex');
      element.setAttribute('aria-selected', true);
      this._toggleDropDown(element, true);
      EventHandler.trigger(element, EVENT_SHOWN$1, {
        relatedTarget: relatedElem
      });
    };
    this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
  }
  _deactivate(element, relatedElem) {
    if (!element) {
      return;
    }
    element.classList.remove(CLASS_NAME_ACTIVE);
    element.blur();
    this._deactivate(SelectorEngine.getElementFromSelector(element)); // Search and deactivate the shown section too

    const complete = () => {
      if (element.getAttribute('role') !== 'tab') {
        element.classList.remove(CLASS_NAME_SHOW$1);
        return;
      }
      element.setAttribute('aria-selected', false);
      element.setAttribute('tabindex', '-1');
      this._toggleDropDown(element, false);
      EventHandler.trigger(element, EVENT_HIDDEN$1, {
        relatedTarget: relatedElem
      });
    };
    this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
  }
  _keydown(event) {
    if (![ARROW_LEFT_KEY, ARROW_RIGHT_KEY, ARROW_UP_KEY, ARROW_DOWN_KEY, HOME_KEY, END_KEY].includes(event.key)) {
      return;
    }
    event.stopPropagation(); // stopPropagation/preventDefault both added to support up/down keys without scrolling the page
    event.preventDefault();
    const children = this._getChildren().filter(element => !isDisabled(element));
    let nextActiveElement;
    if ([HOME_KEY, END_KEY].includes(event.key)) {
      nextActiveElement = children[event.key === HOME_KEY ? 0 : children.length - 1];
    } else {
      const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(event.key);
      nextActiveElement = getNextActiveElement(children, event.target, isNext, true);
    }
    if (nextActiveElement) {
      nextActiveElement.focus({
        preventScroll: true
      });
      Tab.getOrCreateInstance(nextActiveElement).show();
    }
  }
  _getChildren() {
    // collection of inner elements
    return SelectorEngine.find(SELECTOR_INNER_ELEM, this._parent);
  }
  _getActiveElem() {
    return this._getChildren().find(child => this._elemIsActive(child)) || null;
  }
  _setInitialAttributes(parent, children) {
    this._setAttributeIfNotExists(parent, 'role', 'tablist');
    for (const child of children) {
      this._setInitialAttributesOnChild(child);
    }
  }
  _setInitialAttributesOnChild(child) {
    child = this._getInnerElement(child);
    const isActive = this._elemIsActive(child);
    const outerElem = this._getOuterElement(child);
    child.setAttribute('aria-selected', isActive);
    if (outerElem !== child) {
      this._setAttributeIfNotExists(outerElem, 'role', 'presentation');
    }
    if (!isActive) {
      child.setAttribute('tabindex', '-1');
    }
    this._setAttributeIfNotExists(child, 'role', 'tab');

    // set attributes to the related panel too
    this._setInitialAttributesOnTargetPanel(child);
  }
  _setInitialAttributesOnTargetPanel(child) {
    const target = SelectorEngine.getElementFromSelector(child);
    if (!target) {
      return;
    }
    this._setAttributeIfNotExists(target, 'role', 'tabpanel');
    if (child.id) {
      this._setAttributeIfNotExists(target, 'aria-labelledby', `${child.id}`);
    }
  }
  _toggleDropDown(element, open) {
    const outerElem = this._getOuterElement(element);
    if (!outerElem.classList.contains(CLASS_DROPDOWN)) {
      return;
    }
    const toggle = (selector, className) => {
      const element = SelectorEngine.findOne(selector, outerElem);
      if (element) {
        element.classList.toggle(className, open);
      }
    };
    toggle(SELECTOR_DROPDOWN_TOGGLE, CLASS_NAME_ACTIVE);
    toggle(SELECTOR_DROPDOWN_MENU, CLASS_NAME_SHOW$1);
    outerElem.setAttribute('aria-expanded', open);
  }
  _setAttributeIfNotExists(element, attribute, value) {
    if (!element.hasAttribute(attribute)) {
      element.setAttribute(attribute, value);
    }
  }
  _elemIsActive(elem) {
    return elem.classList.contains(CLASS_NAME_ACTIVE);
  }

  // Try to get the inner element (usually the .nav-link)
  _getInnerElement(elem) {
    return elem.matches(SELECTOR_INNER_ELEM) ? elem : SelectorEngine.findOne(SELECTOR_INNER_ELEM, elem);
  }

  // Try to get the outer element (usually the .nav-item)
  _getOuterElement(elem) {
    return elem.closest(SELECTOR_OUTER) || elem;
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Tab.getOrCreateInstance(this);
      if (typeof config !== 'string') {
        return;
      }
      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  if (isDisabled(this)) {
    return;
  }
  Tab.getOrCreateInstance(this).show();
});

/**
 * Initialize on focus
 */
EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE_ACTIVE)) {
    Tab.getOrCreateInstance(element);
  }
});
/**
 * jQuery
 */

defineJQueryPlugin(Tab);

/**
 * --------------------------------------------------------------------------
 * Bootstrap toast.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME = 'toast';
const DATA_KEY = 'bs.toast';
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const CLASS_NAME_FADE = 'fade';
const CLASS_NAME_HIDE = 'hide'; // @deprecated - kept here only for backwards compatibility
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_SHOWING = 'showing';
const DefaultType = {
  animation: 'boolean',
  autohide: 'boolean',
  delay: 'number'
};
const Default = {
  animation: true,
  autohide: true,
  delay: 5000
};

/**
 * Class definition
 */

class Toast extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._timeout = null;
    this._hasMouseInteraction = false;
    this._hasKeyboardInteraction = false;
    this._setListeners();
  }

  // Getters
  static get Default() {
    return Default;
  }
  static get DefaultType() {
    return DefaultType;
  }
  static get NAME() {
    return NAME;
  }

  // Public
  show() {
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);
    if (showEvent.defaultPrevented) {
      return;
    }
    this._clearTimeout();
    if (this._config.animation) {
      this._element.classList.add(CLASS_NAME_FADE);
    }
    const complete = () => {
      this._element.classList.remove(CLASS_NAME_SHOWING);
      EventHandler.trigger(this._element, EVENT_SHOWN);
      this._maybeScheduleHide();
    };
    this._element.classList.remove(CLASS_NAME_HIDE); // @deprecated
    reflow(this._element);
    this._element.classList.add(CLASS_NAME_SHOW, CLASS_NAME_SHOWING);
    this._queueCallback(complete, this._element, this._config.animation);
  }
  hide() {
    if (!this.isShown()) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);
    if (hideEvent.defaultPrevented) {
      return;
    }
    const complete = () => {
      this._element.classList.add(CLASS_NAME_HIDE); // @deprecated
      this._element.classList.remove(CLASS_NAME_SHOWING, CLASS_NAME_SHOW);
      EventHandler.trigger(this._element, EVENT_HIDDEN);
    };
    this._element.classList.add(CLASS_NAME_SHOWING);
    this._queueCallback(complete, this._element, this._config.animation);
  }
  dispose() {
    this._clearTimeout();
    if (this.isShown()) {
      this._element.classList.remove(CLASS_NAME_SHOW);
    }
    super.dispose();
  }
  isShown() {
    return this._element.classList.contains(CLASS_NAME_SHOW);
  }

  // Private
  _maybeScheduleHide() {
    if (!this._config.autohide) {
      return;
    }
    if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
      return;
    }
    this._timeout = setTimeout(() => {
      this.hide();
    }, this._config.delay);
  }
  _onInteraction(event, isInteracting) {
    switch (event.type) {
      case 'mouseover':
      case 'mouseout':
        {
          this._hasMouseInteraction = isInteracting;
          break;
        }
      case 'focusin':
      case 'focusout':
        {
          this._hasKeyboardInteraction = isInteracting;
          break;
        }
    }
    if (isInteracting) {
      this._clearTimeout();
      return;
    }
    const nextElement = event.relatedTarget;
    if (this._element === nextElement || this._element.contains(nextElement)) {
      return;
    }
    this._maybeScheduleHide();
  }
  _setListeners() {
    EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
    EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
    EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
    EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
  }
  _clearTimeout() {
    clearTimeout(this._timeout);
    this._timeout = null;
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Toast.getOrCreateInstance(this, config);
      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config](this);
      }
    });
  }
}

/**
 * Data API implementation
 */

enableDismissTrigger(Toast);

/**
 * jQuery
 */

defineJQueryPlugin(Toast);


//# sourceMappingURL=bootstrap.esm.js.map


/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = "object" === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof __webpack_require__.g === "object" ? __webpack_require__.g :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);


/***/ }),

/***/ "@babel/runtime/regenerator":
/*!*************************************!*\
  !*** external "regeneratorRuntime" ***!
  \*************************************/
/***/ (function(module) {

"use strict";
module.exports = window["regeneratorRuntime"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
!function() {
"use strict";
/*!*************************!*\
  !*** ./assets/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! regenerator-runtime/runtime.js */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _main_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./main.scss */ "./assets/main.scss");
/* harmony import */ var _main_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./main.js */ "./assets/main.js");



}();
/******/ })()
;
//# sourceMappingURL=index.js.map