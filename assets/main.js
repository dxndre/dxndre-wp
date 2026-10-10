// Overall scores use /10 internally; the five middle bands span 14% each.
const gymOverallBands = [
	{tone:'maroon', label:'Diabolical', range:'0–<15%', min:0, width:15, color:'#8c354b', emoji:'💩'},
	{tone:'bad', label:'Bad', range:'15–<29%', min:1.5, width:14, color:'#d85b70', emoji:'😡'},
	{tone:'red', label:'Poor', range:'29–<43%', min:2.9, width:14, color:'#ef8585', emoji:'👎🏾'},
	{tone:'amber', label:'Mixed', range:'43–<57%', min:4.3, width:14, color:'#e5a653', emoji:'🤷🏽‍♂️'},
	{tone:'green', label:'Positive', range:'57–<71%', min:5.7, width:14, color:'#82c995', emoji:'👍🏾'},
	{tone:'great', label:'Excellent', range:'71–<85%', min:7.1, width:14, color:'#6ed9c5', emoji:'🤩'},
	{tone:'diamond', label:'Outstanding', range:'85–100%', min:8.5, width:15, color:'#b9eaff', emoji:'💎'}
];

const gymOverallBand = percentage => [...gymOverallBands].reverse().find(band => percentage >= band.min * 10) || gymOverallBands[0];

// Progressive enhancement: original review content remains usable without JavaScript.
function initGymLeague(archive, cards) {
 const make = (tag, cls, text) => { const el=document.createElement(tag); el.className=cls; if(text) el.textContent=text; return el; };
 const tone = value => { const n=Number(value); return value==='' || !Number.isFinite(n) || n<0 ? 'unrated' : n>=9?'diamond':n>=7?'green':n>=5?'amber':n>=3?'red':'maroon'; };
 const bands = gymOverallBands;
 const overallBand = value => { const n=Number(value); return value==='' || !Number.isFinite(n) || n<0 ? {tone:'unrated',label:'Not assessed',emoji:''} : [...bands].reverse().find(band=>n>=band.min); };
 const overallTone = value => overallBand(value).tone;
 const ratingEmoji = Object.fromEntries(bands.map(band=>[band.tone,band.emoji]));
 ratingEmoji.unrated='';
 const grid=archive.querySelector('[data-gyms-grid]');
 const header=make('header','league-heading');
 header.append(make('p','league-eyebrow',`THE GYM LEAGUE · ${cards.length} BRANCHES LOGGED`),make('h2','','The full field.'),make('p','league-intro','Personally visited. Honestly rated. Find your next place to train.'));
 const watermark=make('span','league-watermark',String(cards.length)); watermark.setAttribute('aria-hidden','true'); header.append(watermark);
 const legend=make('div','league-legend');
 [...bands].reverse().forEach(band=>{const item=make('span','',`${band.range} ${band.label}`);item.dataset.tone=band.tone;legend.append(item);});
 legend.append(make('span','','— Not assessed / N/A Unavailable'));
 header.append(legend);
 const method=make('button','league-method-trigger','How I score gyms');
 method.type='button';method.setAttribute('aria-haspopup','dialog');method.setAttribute('aria-controls','league-scoring-guide');
 const guide=make('dialog','league-scoring-guide');guide.id='league-scoring-guide';guide.setAttribute('aria-labelledby','league-scoring-title');
 const close=make('button','league-scoring-close','Close ×');close.type='button';close.setAttribute('aria-label','Close scoring guide');
 const title=make('h2','','How I score gyms');title.id='league-scoring-title';
 guide.append(close,title,make('p','','Ratings reflect my visits, membership tier and personal experience. The latest dated visit sets each branch’s league rating.'));
 guide.append(make('p','','The overall percentage is a weighted average: gym ×2, wetside ×1.5, spa ×2, café / work ×1, cleanliness ×2.5 and parking ×1. Unassessed and unavailable facilities are excluded; zero is a scored result.'));
 guide.append(make('h3','','Overall rating scale'));
 const scale=make('div','league-scale');scale.setAttribute('aria-hidden','true');
 bands.forEach(band=>{const segment=make('span','');segment.style.width=`${band.width}%`;segment.style.backgroundColor=band.color;scale.append(segment);});
 const axis=make('div','league-scale-axis');axis.setAttribute('aria-hidden','true');
 [0,25,50,75,100].forEach(value=>{const tick=make('span','',`${value}%`);tick.style.left=`${value}%`;axis.append(tick);});
 const key=make('ul','league-scale-key');
 [...bands].reverse().forEach(band=>{const row=make('li','');const swatch=make('span','league-scale-swatch');swatch.style.backgroundColor=band.color;swatch.setAttribute('aria-hidden','true');row.append(swatch,make('span','',`${band.emoji} ${band.label}`),make('span','league-scale-range',band.range));key.append(row);});
 guide.append(scale,axis,key,make('p','league-scoring-note','Individual category scores retain their own scale: Outstanding 9–10, Positive 7–<9, Mixed 5–<7, Poor 3–<5, Diabolical below 3.'));
 document.body.append(guide);
 method.addEventListener('click',()=>guide.showModal());
 close.addEventListener('click',()=>guide.close());
 guide.addEventListener('click',event=>{if(event.target!==guide)return;const bounds=guide.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)guide.close();});
 guide.addEventListener('close',()=>method.focus({preventScroll:true}));
 header.append(method); archive.prepend(header);
 archive.querySelector('.gym-view-toggle')?.remove();
 archive.querySelectorAll('.gym-filter-buttons button').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('is-active'))));
 const tray=archive.querySelector('[data-gym-compare-bar]'); if(tray)archive.append(tray);
 const layout=make('div','league-layout'); grid.before(layout);
 const left=make('div','league-list-pane'); layout.append(left); left.append(grid);
 archive.querySelector('.gym-pagination')?.remove();
 const panel=make('aside','league-detail'); panel.id='gym-branch-detail'; panel.setAttribute('aria-label','Selected branch details');
 layout.append(panel);
 // Map assets load only when requested; list browsing needs no external map requests.
 const mapPane = make('div', 'league-map-pane');
 const mapStatus = make('p', 'league-map-status');
 mapStatus.setAttribute('role', 'status');
 const mapCanvas = make('div', 'league-map-canvas');
 mapCanvas.setAttribute('aria-label', 'Gym review locations');
 const mapChoices = make('div', 'league-map-choices');
 const mapChoiceCards = new Map();
 mapChoices.setAttribute('aria-label', 'Matching gym reviews');
 mapPane.append(mapStatus, mapCanvas, mapChoices);
 mapPane.hidden = true;
 left.append(mapPane);
 const switcher = make('div', 'league-view-switch');
 switcher.setAttribute('role', 'group');
 switcher.setAttribute('aria-label', 'Gym view');
 const listButton = make('button', '', 'List');
 const mapButton = make('button', '', 'Map');
 [listButton, mapButton].forEach(button => { button.type = 'button'; switcher.append(button); });
 archive.querySelector('.filter-inputs').append(switcher);
 let mapView = false, mapInstance, mapMarkers, mapAssets, mapCards = [];
 const coordinates = card => {
  const lat = Number(card.dataset.lat), lng = Number(card.dataset.lng);
  return card.dataset.lat?.trim() && card.dataset.lng?.trim() && Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? [lat, lng] : null;
 };
 const loadMapAssets = () => {
  if (window.L) return Promise.resolve();
  if (mapAssets) return mapAssets;
  mapAssets = new Promise((resolve, reject) => {
   const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.append(css);
   const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
   script.onload = resolve; script.onerror = reject; document.head.append(script);
  });
  return mapAssets;
 };
 function renderLeagueMap() {
  if (!mapView) return;
  mapStatus.textContent = 'Loading map…';
  return loadMapAssets().then(() => {
   if (!mapView) return;
   if (!mapInstance) {
    mapInstance = window.L.map(mapCanvas, {scrollWheelZoom: false}).setView([54, -2], 5);
    const baseTiles = window.L.tileLayer('https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=cb1_49v4_1_6f4e11cc72c4a39104c6f6c9', {
     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>', maxZoom: 19
    }).addTo(mapInstance);
    baseTiles.on('tileerror', () => {
     mapStatus.textContent = 'Map background could not load. Check the CARTO key’s website restrictions; gym pins and reviews are still available.';
    });
    mapMarkers = window.L.layerGroup().addTo(mapInstance);
   }
   mapMarkers.clearLayers(); mapChoices.replaceChildren(); mapChoiceCards.clear();
   const points = [];
   mapCards.forEach(card => {
    const point = coordinates(card);
    const choice = make('button', 'league-map-choice');
    const info = make('span', 'league-map-choice-info');
    info.append(make('strong', '', card.dataset.branchLabel), make('small', '', `${card.dataset.chainLabel}${point ? '' : ' · Pin unavailable'}`));
    const score = make('span', 'league-map-choice-score', card.dataset.overallLabel);
    score.dataset.tone = overallTone(card.dataset.overall);
    choice.append(info, score);
    choice.setAttribute('aria-pressed', String(card === selected));
    mapChoiceCards.set(choice, card);
    choice.type = 'button';
    choice.addEventListener('click', () => { select(card); if (point) mapInstance.setView(point, 13); });
    mapChoices.append(choice);
    if (!point) return;
    points.push(point);
    const pin = make('span', 'league-map-pin', card.dataset.overallLabel);
    pin.dataset.tone = overallTone(card.dataset.overall);
    const marker = window.L.marker(point, {
     title: `${card.dataset.chainLabel} · ${card.dataset.branchLabel}: ${card.dataset.overallLabel}`,
     icon: window.L.divIcon({className: 'league-map-marker', html: pin.outerHTML, iconSize: [66, 30], iconAnchor: [33, 30]})
    }).addTo(mapMarkers);
    marker.bindTooltip(document.createTextNode(`${card.dataset.chainLabel} · ${card.dataset.branchLabel}`));
    marker.on('click', () => { select(card); if (!media.matches) panel.scrollIntoView({block: 'start', behavior: reducedMotion.matches ? 'instant' : 'smooth'}); });
   });
   const missing = mapCards.length - points.length;
   mapStatus.textContent = `${points.length} gyms on the map${missing ? ` · ${missing} without a pin` : ''}. Select a pin or branch below.`;
   mapInstance.invalidateSize();
   if (points.length) mapInstance.fitBounds(points, {padding: [35, 35], maxZoom: 13});
  }).catch(() => {
   mapStatus.textContent = 'The map could not load. Please use List view and try again later.';
   mapAssets = null;
  });
 }
 function setLeagueView(useMap) {
  mapView = useMap;
  archive.classList.toggle('is-map-view', mapView);
  listButton.setAttribute('aria-pressed', String(!mapView)); mapButton.setAttribute('aria-pressed', String(mapView));
  grid.hidden = mapView; mapPane.hidden = !mapView;
  place(); renderLeagueMap();
 }
 listButton.addEventListener('click', () => { setLeagueView(false); archive.dispatchEvent(new Event('league-view-change')); });
 mapButton.addEventListener('click', () => { setLeagueView(true); archive.dispatchEvent(new Event('league-view-change')); });
 listButton.setAttribute('aria-pressed', 'true'); mapButton.setAttribute('aria-pressed', 'false');
 const count=make('p','league-result-count'); count.setAttribute('role','status'); layout.before(count);
 const columns=make('div','league-columns'); columns.setAttribute('aria-hidden','true'); ['POS','BRANCH','OVERALL','COMPARE'].forEach(s=>columns.append(make('span','',s))); grid.prepend(columns);
 let selected=null;
 const media=window.matchMedia('(min-width: 992px)');
 const details=new Map();
 const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
 let animationFrame=0;
 let pendingAnimation=null;
 const animationObserver=new IntersectionObserver(entries=>{
  if(entries.some(entry=>entry.isIntersecting)&&pendingAnimation){
   animationObserver.disconnect();
   const start=pendingAnimation; pendingAnimation=null; start();
  }
 },{threshold:0.15});
 function stopAnimation(){cancelAnimationFrame(animationFrame);animationObserver.disconnect();pendingAnimation=null;}
 function animateDetails(card){
  stopAnimation();
  const total=panel.querySelector('.league-total');
  const target=Number(card.dataset.overall);
  const rated=card.dataset.overall!==''&&Number.isFinite(target)&&target>=0;
  const bars=[...panel.querySelectorAll('.dx-score-block[data-score] .dx-score-bar span')];
  const paint=progress=>{
   if(rated){
    const current=target*progress;
    total.querySelector('.league-total-number').textContent=progress===1?card.dataset.overallLabel:`${(current*10).toFixed(1)}%`;
    total.dataset.tone=overallTone(current);
    total.querySelector('.league-total-emoji').textContent=overallBand(current).emoji;
    total.querySelector('.league-total-rating-label').textContent=overallBand(current).label;
   }
   bars.forEach(bar=>{
    const block=bar.closest('[data-score]');
    const value=Number(block.dataset.score);
    block.dataset.tone=tone(value*progress);
				const label = block.querySelector('.dx-score-value');
				if (label) {
					label.setAttribute('aria-label', `${value}/10`);
					label.textContent = `${progress === 1 ? value : Math.floor(value * progress)}/10`;
				}
    bar.style.transform=`scaleX(${Math.max(0,Math.min(1,value/10))*progress})`;
   });
  };
  if(reducedMotion.matches){paint(1);return;}
  paint(0);
  pendingAnimation=()=>{
   let started;
   const tick=now=>{
    if(reducedMotion.matches){paint(1);return;}
    started??=now;
    const fraction=Math.min(1,(now-started)/1200);
    paint(1-Math.pow(1-fraction,3));
    if(fraction<1)animationFrame=requestAnimationFrame(tick);
   };
   animationFrame=requestAnimationFrame(tick);
  };
  animationObserver.observe(total);
 }
 // Hidden overflow on WordPress cover wrappers would otherwise capture sticky positioning.
 for(let parent=archive.parentElement;parent&&parent!==document.documentElement;parent=parent.parentElement){
  const style=getComputedStyle(parent);
  if(style.overflowX==='hidden'||style.overflowY==='hidden')parent.classList.add('league-sticky-ancestor');
 }
 const stickyHeaders=[...document.querySelectorAll('.navbar, #wpadminbar')];
 const updateStickyOffset=()=>{
  const bottom=stickyHeaders.reduce((offset,el)=>{
   const position=getComputedStyle(el).position;
   return position==='fixed'||position==='sticky'?Math.max(offset,el.getBoundingClientRect().bottom):offset;
  },0);
  const safeTop=Math.max(16,bottom+16);
  archive.style.setProperty('--league-sticky-safe-top',`${safeTop}px`);
  const height=panel.getBoundingClientRect().height;
  const available=Math.max(0,window.innerHeight-safeTop-16);
  const centered=safeTop+Math.max(0,(available-height)/2);
  archive.style.setProperty('--league-sticky-top',`${centered}px`);
 };
 const headerObserver=new ResizeObserver(updateStickyOffset);
 stickyHeaders.forEach(el=>headerObserver.observe(el));
 headerObserver.observe(panel);
 window.addEventListener('resize',updateStickyOffset,{passive:true});
 updateStickyOffset();
 const ranks=new Map([...cards].sort((a,b)=>Number(b.dataset.overall)-Number(a.dataset.overall)||a.dataset.branch.localeCompare(b.dataset.branch)).map((c,i)=>[c,i+1]));
 cards.forEach(card=>{
  const content=make('div','league-detail-content');
		if (card.dataset.featuredImage) {
			const image = make('img', 'league-detail-image');
			image.alt = '';
			image.setAttribute('aria-hidden', 'true');
			image.loading = 'lazy';
			image.decoding = 'async';
			image.src = card.dataset.featuredImage;
			const frame = make('div', 'league-detail-image-frame');
			frame.append(image);
			content.append(frame);
		}
  content.append(make('p','league-eyebrow','BRANCH DETAILS'),make('h3','',card.dataset.branchLabel),make('p','league-detail-chain',card.dataset.chainLabel));
  const loc=card.querySelector('.dx-gym-card__subtitle');
		if (loc) {
			const location = loc.cloneNode(true);
			const link = location.querySelector('a');
			if (link) {
				link.href = card.dataset.mapsUrl || link.href;
				link.target = '_blank';
				link.rel = 'noopener noreferrer';
				link.addEventListener('click', event => event.stopPropagation());
			}
			content.append(location);
		}
  const score=make('div','league-total');score.dataset.tone=overallTone(card.dataset.overall);
  const number=make('span','league-total-number',card.dataset.overallLabel);
  const emoji=make('span','league-total-emoji',ratingEmoji[overallTone(card.dataset.overall)]);emoji.setAttribute('aria-hidden','true');const badge=make('span','league-total-rating');badge.setAttribute('aria-hidden','true');badge.append(emoji,make('span','league-total-rating-label',overallBand(card.dataset.overall).label));score.append(number,badge);score.setAttribute('role','img');score.setAttribute('aria-label',`${card.dataset.overallLabel} overall rating, ${overallBand(card.dataset.overall).label}`);content.append(score,make('p','league-total-label','OVERALL RATING'));
  const awards=make('div','league-awards'); card.querySelectorAll('.dx-badge--rank,.dx-badge--category').forEach(b=>awards.append(b.cloneNode(true)));content.append(awards);
  const scores=card.querySelector('.dx-gym-card__scores')?.cloneNode(true);
  if(scores){scores.querySelectorAll('.dx-score-block').forEach(block=>{block.dataset.tone=tone(block.dataset.score??'');});content.append(scores);}
  content.append(make('h4','league-notes-title','Field notes'));
  const notes=make('div','league-notes');const original=card.querySelector('[data-notes-panel]');if(original)notes.innerHTML=original.innerHTML; content.append(notes);
  content.append(make('p','league-visit',`Visited ${card.dataset.visitedLabel} · ${card.dataset.membership}`));
  let history=[];
  try { history=JSON.parse(card.dataset.visitHistory||'[]'); } catch { history=[]; }
  if(history.length){
   const visits=make('details','league-history');
   visits.append(make('summary','',`Visit history · ${history.length+1} reviews`));
   visits.append(make('p','league-visit','The latest dated visit sets the league rating. Earlier visits are retained below.'));
   history.forEach(visit=>{
    const entry=make('article','league-history-entry');
    entry.append(make('h4','',visit.date||'Date not recorded'));
    const overall=make('strong','',visit.overall===null?'Not assessed':`${(visit.overall*10).toFixed(1)}%`);
    overall.dataset.tone=overallTone(visit.overall===null?'':visit.overall);entry.append(overall);
    const list=make('dl','league-history-scores');
    Object.entries(visit.scores).forEach(([label,value])=>{
     list.append(make('dt','',label),make('dd','',value===null?'Not assessed':value==='unavailable'?'Unavailable':`${value}/10`));
    });
    entry.append(list,make('p','',visit.notes));
    const link=make('a','','Read this visit ↗');link.href=visit.url;entry.append(link);visits.append(entry);
   });
   content.append(visits);
  }
  const review=make('a','league-review','Read full review ↗');review.href=card.dataset.link;content.append(review);details.set(card,content);
  const btn=make('button','league-select');btn.type='button';btn.setAttribute('aria-controls',panel.id);btn.setAttribute('aria-expanded','false');
  const info=make('span','league-row-info');info.append(make('strong','',card.dataset.branchLabel),make('small','',`${card.dataset.chainLabel}${loc?' · '+loc.textContent.replace('📍','').trim():''}`));
  const value=make('strong','league-row-score',card.dataset.overallLabel);value.dataset.tone=overallTone(card.dataset.overall);
  btn.append(make('span','league-rank',String(ranks.get(card)).padStart(2,'0')),info,value);
  btn.addEventListener('click',()=>{if(selected===card&&!media.matches){stopAnimation();selected=null;panel.hidden=true;syncSelection();}else select(card, true);});
  const compare=card.querySelector('[data-gym-compare-toggle]');if(compare){compare.setAttribute('aria-label',`Compare ${card.dataset.branchLabel}`);compare.querySelector('.label-add').textContent='+';compare.querySelector('.label-remove').textContent='✓';}
  card.prepend(btn);
 });
 function syncSelection(){mapChoiceCards.forEach((card, button) => button.setAttribute('aria-pressed', String(card === selected)));cards.forEach(c=>{c.classList.toggle('is-current',c===selected);c.querySelector('.league-select').setAttribute('aria-expanded',String(c===selected&&!panel.hidden));});}
 function place(){if(selected&&!panel.hidden){if(media.matches||mapView)layout.append(panel);else selected.after(panel);}else layout.append(panel);}
	// Wait for the photograph before fading it in, including cached images.
	function revealDetailImage() {
		const image = panel.querySelector('.league-detail-image');
		if (!image) return;
		image.getAnimations().forEach(animation => animation.cancel());
		image.style.opacity = '0';
		image.decode().then(() => {
			if (!panel.contains(image)) return;
			image.style.removeProperty('opacity');
			if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
				image.animate(
					[
						{ opacity: 0, transform: 'scale(1)' },
						{ opacity: 0.66, transform: 'scale(1.04)' }
					],
					{ duration: 400, easing: 'ease-out' }
				);
			}
		}).catch(() => {
			// Keep the gold background when the photograph cannot load.
		});
	}
 function select(card, scrollToRow = false) {
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
			requestAnimationFrame(() => {
				if (selected !== card || panel.hidden) return;
				updateStickyOffset();
				const offset = parseFloat(archive.style.getPropertyValue('--league-sticky-safe-top')) || 16;
				window.scrollTo({
					top: Math.max(0, window.scrollY + card.getBoundingClientRect().top - offset),
					behavior: reducedMotion.matches ? 'instant' : 'smooth'
				});
			});
		}
	}
 media.addEventListener('change',place);
 archive.classList.add('is-premium-league');
 return { update(ordered, visibleCount){ mapCards=ordered;renderLeagueMap();const shown=mapView?ordered:ordered.slice(0,visibleCount);count.textContent=`${shown.length} of ${ordered.length} branches shown`; if(!shown.length){stopAnimation();selected=null;panel.hidden=true;syncSelection();place();}else if(!selected||!shown.includes(selected))select(shown[0]);else place(); } };
}

// Webpack Imports
import * as bootstrap from 'bootstrap';

(function () {
	'use strict';

	// n
	// Navbar scroll state toggle
	function initNavbarScrolled() {
	const nav = document.querySelector('.navbar');
	if (!nav) return;

	const onScroll = () => {
		nav.classList.toggle('scrolled', window.scrollY > 10);
	};

	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();
	}

	document.addEventListener('DOMContentLoaded', initNavbarScrolled);

	// Focus input if Searchform is empty
	[].forEach.call(document.querySelectorAll('.search-form'), (el) => {
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
		return new bootstrap.Popover(popoverTriggerEl, {
			trigger: 'focus',
		});
	});

	document.addEventListener('DOMContentLoaded', () => {

		/* ==========================
		   VIEWPORT-ACTIVE SECTIONS
		========================== */

		const sections = document.querySelectorAll('section');

		const sectionObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach(entry => {
					if (
						entry.target.classList.contains('story-section') ||
						entry.target.classList.contains('story-hero') ||
						entry.target.querySelector('[data-gyms-archive]')
					) {
						return;
					}

					if (entry.isIntersecting) {
						entry.target.classList.add('viewport-active');
					} else {
						entry.target.classList.remove('viewport-active');
					}
				});
			},
			{ 
				threshold: 0.1,
  				rootMargin: '-20% 0px -20% 0px'
			}
		);

		sections.forEach(section => sectionObserver.observe(section));

		/* ==========================
		   STAT COUNTER ANIMATION
		========================== */
		const counters = document.querySelectorAll('.stat-figure');

		const animateCounter = (el) => {
			const raw = el.textContent.trim();

			const match = raw.match(/^(\d+(?:\.\d+)?)(.*)$/);
			if (!match) return;

			const target = parseFloat(match[1]);
			const suffix = match[2].trim(); // e.g. "KG", "+", "kg", etc.

			let startTime = null;
			const duration = 1800;

			const tick = (timestamp) => {
				if (!startTime) startTime = timestamp;

				const progress = Math.min((timestamp - startTime) / duration, 1);
				const value = Math.floor(progress * target);

				el.textContent = `${value}${suffix ? suffix : ''}`;

				if (progress < 1) {
					requestAnimationFrame(tick);
				} else {
					el.textContent = `${target}${suffix ? suffix : ''}`;
				}
			};

			requestAnimationFrame(tick);
		};

		const counterObserver = new IntersectionObserver(
			(entries, obs) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						animateCounter(entry.target);
						obs.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.4 }
		);

		counters.forEach(counter => counterObserver.observe(counter));

		/* ==========================
		   BODY STATE: CLIENT JOURNEY
		========================== */
		const body = document.body;
		const journeySection = document.querySelector('.client-journey');
		const techStackSection = document.querySelector('.tech-stack');

		if (journeySection) {
			const journeyObserver = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						body.classList.add('client-journey-section');
					} else {
						body.classList.remove('client-journey-section');
					}
				},
				{ threshold: 0.35 }
			);

			journeyObserver.observe(journeySection);
		}

		if (techStackSection) {
			const techStackObserver = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						body.classList.add('tech-stack-section');
					} else {
						body.classList.remove('tech-stack-section');
					}
				},
				{ threshold: 0.35 }
			);

			techStackObserver.observe(techStackSection);
		}
	});

	/* ==========================
	PROCESS STEP CYCLER (DEBUG MODE)
	========================== */

	const processSteps = document.querySelectorAll('.process-step');

	if (processSteps.length) {
		let currentIndex = 0;

		// Clear any existing state
		processSteps.forEach(step => step.classList.remove('is-active'));

		// Activate first step
		processSteps[0].classList.add('is-active');

		setInterval(() => {
			// Remove active from current
			processSteps[currentIndex].classList.remove('is-active');

			// Move to next
			currentIndex = (currentIndex + 1) % processSteps.length;

			// Add active to next
			processSteps[currentIndex].classList.add('is-active');
		}, 5000);
	}

	const processTrack = document.querySelector('.process-area > .wp-block-group__inner-container');

	if (processTrack && processSteps.length) {
		const stepDistance = 400 + 160; // 400px step + ~10em gap
		let currentOffset = 0;

		setInterval(() => {
			currentOffset = (currentOffset + 1) % processSteps.length;

			processTrack.style.transform = `translateX(-${currentOffset * stepDistance}px)`;
		}, 5000);
	}

	// Duplicate Footnotes at runtime 

	document.addEventListener('DOMContentLoaded', () => {
		const tracks = document.querySelectorAll('.footline-track');
		if (!tracks.length) return;

		const DUPLICATES = 2;

		tracks.forEach(track => {
			const item = track.querySelector('.footline');
			if (!item) return;

			for (let i = 0; i < DUPLICATES; i++) {
				track.appendChild(item.cloneNode(true));
			}
		});
	});

	/* ==========================================================
	DXNDRE — CINEMATIC NAVIGATION CONTROLLER
	========================================================== */

	function initDxndreNavigation() {

		const menu = document.getElementById('navbar');
		const toggle = document.getElementById('dx-menu-toggle');

		if (!menu || !toggle) return;

		// Prevent duplicate initialisation.
		if (menu.dataset.dxInitialized === 'true') return;

		menu.dataset.dxInitialized = 'true';

		const body = document.body;

		const focusableSelector = [
			'a[href]',
			'button:not([disabled])',
			'input:not([disabled])',
			'select:not([disabled])',
			'textarea:not([disabled])',
			'[tabindex]:not([tabindex="-1"])'
		].join(',');

		let previouslyFocused = null;
		let isOpen = false;

		const getFocusable = () => {

			const controls = [
				...menu.querySelectorAll(focusableSelector),
				...document.querySelectorAll(
					'#header .dxndre-nav-left a, ' +
					'#header .dxndre-nav-left button, ' +
					'#header .dxndre-nav-left input, ' +
					'#header .dxndre-navbar-brand-centered'
				),
				toggle
			];

			return [...new Set(controls)].filter(element => {

				const style = window.getComputedStyle(element);

				return (
					element.getClientRects().length > 0 &&
					style.visibility !== 'hidden' &&
					style.display !== 'none' &&
					!element.closest('[inert]')
				);
			});
		};

		const lockScroll = () => {
			body.classList.add('nav-open');
		};

		const unlockScroll = () => {
			body.classList.remove('nav-open');
		};

		// Bootstrap starts opening.
		menu.addEventListener('show.bs.collapse', () => {

			previouslyFocused = document.activeElement;

			isOpen = true;

			lockScroll();

			menu.removeAttribute('inert');
			menu.setAttribute('aria-hidden', 'false');

		});

		// Bootstrap completes opening.
		menu.addEventListener('shown.bs.collapse', () => {

			isOpen = true;

			const currentLink = menu.querySelector(
				'.current-menu-item > a, ' +
				'.current_page_item > a'
			);

			const firstLink = menu.querySelector(
				'.dx-menu__list > li > a'
			);

			const target = currentLink || firstLink;

			if (target) {
				target.focus({ preventScroll: true });
			}

		});

		// Bootstrap starts closing.
		menu.addEventListener('hide.bs.collapse', () => {

			isOpen = false;

			// Keep focus away from disappearing menu items.
			if (menu.contains(document.activeElement)) {
				toggle.focus({ preventScroll: true });
			}

		});

		// Bootstrap completes closing.
		menu.addEventListener('hidden.bs.collapse', () => {

			isOpen = false;

			unlockScroll();

			menu.setAttribute('inert', '');
			menu.setAttribute('aria-hidden', 'true');

			const restoreFocus = previouslyFocused;

			if (
				restoreFocus &&
				restoreFocus.isConnected &&
				typeof restoreFocus.focus === 'function'
			) {
				restoreFocus.focus({ preventScroll: true });
			} else {
				toggle.focus({ preventScroll: true });
			}

			previouslyFocused = null;

		});

		// Handle keyboard accessibility.
		document.addEventListener('keydown', event => {

			if (!isOpen) return;

			// Escape closes the menu.
			if (event.key === 'Escape') {

				event.preventDefault();

				const instance = bootstrap.Collapse.getOrCreateInstance(
					menu,
					{ toggle: false }
				);

				instance.hide();

				return;
			}

			// Trap focus inside navigation controls.
			if (event.key !== 'Tab') return;

			const focusable = getFocusable();

			if (!focusable.length) return;

			const first = focusable[0];
			const last = focusable[focusable.length - 1];

			const currentIndex = focusable.indexOf(
				document.activeElement
			);

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
		menu.querySelectorAll('a[href]').forEach(link => {

			link.addEventListener('click', () => {

				const destination = new URL(
					link.href,
					window.location.href
				);

				const current = new URL(window.location.href);

				const samePage = (
					destination.origin === current.origin &&
					destination.pathname === current.pathname &&
					destination.search === current.search
				);

				if (!samePage) return;

				const instance = bootstrap.Collapse.getOrCreateInstance(
					menu,
					{ toggle: false }
				);

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
		window.addEventListener('pageshow', () => {

			if (!menu.classList.contains('show')) {

				isOpen = false;
				unlockScroll();

				menu.setAttribute('inert', '');
				menu.setAttribute('aria-hidden', 'true');

			}
		});
	}

	document.addEventListener(
		'DOMContentLoaded',
		initDxndreNavigation
	);

	// Client Dashboard Loading Test

	document.addEventListener('DOMContentLoaded', () => {
		if (!document.body.classList.contains('page-dashboard')) return;

		// Dashboard-specific JS here
		console.log('Client dashboard loaded');
	});

	console.log('DX DASHBOARD JS LOADED');

	// Client Dashboard Request Update

	document.addEventListener('DOMContentLoaded', () => {
		if (!document.body.classList.contains('page-dashboard')) return;

		// UX: if modal fails / Bootstrap not present, send them to fallback page
		const newTicketBtn = document.querySelector('[data-bs-target="#newTicketModal"]');
		if (newTicketBtn && typeof window.bootstrap === 'undefined') {
			newTicketBtn.addEventListener('click', (e) => {
				e.preventDefault();
				window.location.href = '/submit-ticket/';
			});
		}

		// Request update button UX-only (you can wire AJAX later)
		const requestBtn = document.querySelector('.request-update');
		if (requestBtn) {
			requestBtn.addEventListener('click', () => {
				requestBtn.textContent = 'Request Sent ✓';
				requestBtn.disabled = true;
				requestBtn.classList.add('is-disabled');
			});
		}
	});

	// AJAX Message posting for Client Portal status update agent

	const form = document.querySelector('.ticket-reply-form');

	if (form) {
		form.addEventListener('submit', async (e) => {
			e.preventDefault();

			const data = new FormData(form);

			const res = await fetch(form.action, {
				method: 'POST',
				body: data
			});

			const html = await res.text();

			document.querySelector('.ticket-thread')
				.insertAdjacentHTML('beforeend', html);

			form.reset();
		});
	}

	// Add image button for client portal support ticket form 

	document.addEventListener('DOMContentLoaded', () => {
		const addBtn = document.querySelector('.add-image-btn');
		const fields = document.querySelectorAll('.ticket-image-field');

		if (!addBtn || !fields.length) return;

		let visibleCount = 1;

		addBtn.addEventListener('click', () => {
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

	document.addEventListener('click', (e) => {
		const link = e.target.closest('.js-ticket-link');
		if (!link) return;

		e.preventDefault();

		console.log('Ticket clicked', link.dataset.ticketId);

		const ticketId = link.dataset.ticketId;
		const panel = document.querySelector('.dashboard-panel');

		console.log('Sending AJAX for ticket', ticketId);

		panel.classList.add('is-loading');

		const formData = new FormData();
		formData.append('action', 'dx_load_ticket_panel');
		formData.append('ticket_id', ticketId);
		formData.append('nonce', DX_DASHBOARD.nonce);

		fetch(DX_DASHBOARD.ajax_url, {
			method: 'POST',
			credentials: 'same-origin',
			body: formData
		})
		.then(res => res.json())
		.then(res => {
			if (!res.success || !res.data.html) {
				panel.innerHTML = '<p>Unable to load ticket.</p>';
				return;
			}

			panel.innerHTML = res.data.html;
			panel.classList.remove('is-loading');

			document.querySelectorAll('.ticket')
				.forEach(t => t.classList.remove('is-active'));

			link.closest('.ticket').classList.add('is-active');
		})
		.catch(err => {
			console.error('FETCH FAILED', err);
			panel.classList.remove('is-loading');
		});
	});

	// Tab JS for Client Portal

	document.addEventListener('click', e => {
		const tab = e.target.closest('.dashboard-tab[data-status]');
		if (!tab) return;

		const status = tab.dataset.status;

		document.querySelectorAll('.dashboard-tab')
			.forEach(t => t.classList.remove('is-active'));
		tab.classList.add('is-active');

		document.querySelectorAll('.ticket').forEach(ticket => {
			const ticketStatus = ticket.dataset.status;

			if (status === 'open') {
				ticket.style.display =
					(ticketStatus !== 'resolved' && ticketStatus !== 'cancelled')
						? ''
						: 'none';
			} else {
				ticket.style.display =
					ticketStatus === status ? '' : 'none';
			}
		});
	});

	// Cancel Ticket 

	document.addEventListener('click', (e) => {
		const btn = e.target.closest('.js-cancel-ticket');
		if (!btn) return;

		const ticketId = btn.dataset.ticketId;
		const input = document.getElementById('cancel-ticket-id');

		if (input) {
			input.value = ticketId;
		}
	});

	// Tab Switching using keyboard

	document.addEventListener('keydown', e => {
		if (!document.body.classList.contains('page-dashboard')) return;

		const tickets = [...document.querySelectorAll('.ticket')];
		const active = document.querySelector('.ticket.is-active');
		if (!active) return;

		let index = tickets.indexOf(active);

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
	document.addEventListener('DOMContentLoaded', () => {
		const first = document.querySelector('.js-ticket-link');
		if (first) {
			first.click();
		}
	});

	// Converting Gallery into carousel
	document.querySelectorAll('.wp-block-group.gallery').forEach(gallery => {
		const track = gallery.querySelector('.wp-block-gallery');
		if (!track) return;

		// Prevent double-init
		if (track.dataset.cloned) return;
		track.dataset.cloned = 'true';

		const slides = [...track.children];

		slides.forEach(slide => {
			track.appendChild(slide.cloneNode(true));
		});
	});

	// Duplicating Gallery Carousel 

	document.querySelectorAll('.wp-block-group.gallery').forEach(gallery => {
		const track = gallery.querySelector('.wp-block-gallery');
		if (!track) return;

		// Prevent double backdrop creation
		if (gallery.querySelector('.gallery-backdrop')) return;

		// Clone the gallery
		const backdrop = track.cloneNode(true);

		// Mark + style hook
		backdrop.classList.add('gallery-backdrop');
		backdrop.setAttribute('aria-hidden', 'true');

		// Insert backdrop before the original
		track.parentNode.insertBefore(backdrop, track);

		// Ensure stacking context
		gallery.style.position = 'relative';
	});

	// Adding glowing backgrounds to all images via duplication and class additions
	document.querySelectorAll('#main section.about figure').forEach(figure => {
		const img = figure.querySelector('img');
		if (!img) return;

		// Prevent double cloning
		if (figure.dataset.backdrop === 'true') return;
		figure.dataset.backdrop = 'true';

		// Ensure positioning context
		figure.style.position = 'relative';

		// Clone image
		const backdrop = img.cloneNode(true);
		backdrop.classList.add('image-backdrop');
		backdrop.setAttribute('aria-hidden', 'true');

		// Insert behind original
		figure.insertBefore(backdrop, img);
	});

	// Homepage Bootstrap Modal (for identifying client) 
	document.addEventListener('DOMContentLoaded', () => {
		const hireBtn = document.querySelector('.js-hire-me');
		if (!hireBtn) return;

		const hireModal      = new bootstrap.Modal('#hireMeModal');
		const clientModal    = new bootstrap.Modal('#clientModal');
		const recruiterModal = new bootstrap.Modal('#recruiterModal');

		hireBtn.addEventListener('click', e => {
			e.preventDefault();
			hireModal.show();
		});

		document.querySelector('.js-client-path')?.addEventListener('click', () => {
			hireModal.hide();
			setTimeout(() => clientModal.show(), 200);
		});

		document.querySelector('.js-recruiter-path')?.addEventListener('click', () => {
			hireModal.hide();
			setTimeout(() => recruiterModal.show(), 200);
		});
	});

	// Auto-rotation of services tabs

	document.addEventListener('DOMContentLoaded', () => {
		const tabs = document.querySelectorAll('.services-nav .nav-link');
		if (!tabs.length) return;

		let index = 0;
		let interval = null;
		const ROTATION_DELAY = 8000; // 8s feels premium

		const activateTab = (i) => {
			tabs[i].click();
		};

		const startRotation = () => {
			interval = setInterval(() => {
			index = (index + 1) % tabs.length;
			activateTab(index);
			}, ROTATION_DELAY);
		};

		const stopRotation = () => {
			clearInterval(interval);
			interval = null;
		};

		// Start rotation
		startRotation();

		// Pause on hover / interaction
		tabs.forEach((tab, i) => {
			tab.addEventListener('mouseenter', stopRotation);
			tab.addEventListener('focus', stopRotation);

			tab.addEventListener('mouseleave', () => {
			index = i;
			startRotation();
			});

			tab.addEventListener('click', () => {
			index = i;
			});
		});

		// const isTouch = window.matchMedia('(pointer: coarse)').matches;

		// if (!isTouch) {
		// startRotation();
		// }

		// Duplicating Services Tab images for glowing backdrop effect

		document.querySelectorAll('.service-image.foreground').forEach(img => {
			// Prevent duplicate cloning
			if (img.dataset.hasBackdrop) return;

			const clone = img.cloneNode(true);

			clone.classList.remove('foreground');
			clone.classList.add('background');
			clone.setAttribute('aria-hidden', 'true');
			clone.loading = 'eager';

			img.dataset.hasBackdrop = 'true';

			img.parentNode.insertBefore(clone, img);
		});
	});

	// Projects Marquee

	(() => {
		const marquee = document.querySelector('.projects-marquee');
		const track = marquee?.querySelector('.marquee-track');
		if (!track) return;

		// Duplicate content for seamless loop
		const items = [...track.children];
		items.forEach(item => track.appendChild(item.cloneNode(true)));

		let position = 0;
		let speed = 0.6;          // base speed
		let targetSpeed = speed;

		function animate() {
			position -= targetSpeed;
			const resetPoint = track.scrollWidth / 2;

			if (Math.abs(position) >= resetPoint) {
			position = 0;
			}

			track.style.transform = `translate3d(${position}px,0,0)`;

			// Smooth easing toward target speed
			targetSpeed += (speed - targetSpeed) * 0.08;

			requestAnimationFrame(animate);
		}

		marquee.addEventListener('mouseenter', () => {
			speed = 0.05; // slow glide instead of stop
		});

		marquee.addEventListener('mouseleave', () => {
			speed = 0.6;
		});

		animate();
	})();


	// Previous modal back button functionality

	document.addEventListener('click', (e) => {
		const backBtn = e.target.closest('.modal-back');
		if (!backBtn) return;

		const targetModal = backBtn.dataset.backTo;
		const currentModal = backBtn.closest('.modal');

		if (!targetModal || !currentModal) return;

		const currentInstance = bootstrap.Modal.getInstance(currentModal);
		currentInstance.hide();

		const nextModalEl = document.querySelector(targetModal);
		const nextInstance = new bootstrap.Modal(nextModalEl);
		nextInstance.show();
	});

	// Make sure only mone modal is open at a time

	document.addEventListener('DOMContentLoaded', () => {

		// -----------------------------
		// Modal controller
		// -----------------------------
		function showModalSafely(targetSelector) {
			const openModals = document.querySelectorAll('.modal.show');

			if (openModals.length) {
				let remaining = openModals.length;

				openModals.forEach((modal) => {
					const instance = bootstrap.Modal.getInstance(modal);
					if (!instance) {
						remaining--;
						return;
					}

					modal.addEventListener(
						'hidden.bs.modal',
						() => {
							remaining--;
							if (remaining === 0) {
								openTargetModal(targetSelector);
							}
						},
						{ once: true }
					);

					instance.hide();
				});
			} else {
				openTargetModal(targetSelector);
			}
		}

		function openTargetModal(targetSelector) {
			const modalEl = document.querySelector(targetSelector);
			if (!modalEl) return;

			// 👇 Check if this is YOUR gym modal
			const isGymModal = modalEl.classList.contains('dx-gym-share-modal');

			const modal = bootstrap.Modal.getOrCreateInstance(modalEl, {
				backdrop: isGymModal ? false : 'static',
				focus: true
			});

			// 🔥 ONLY run custom backdrop logic for gym modal
			if (isGymModal) {
				const archiveSection = document.querySelector('[data-gyms-archive]');

				if (archiveSection) {
					archiveSection.querySelectorAll('.modal-backdrop').forEach(el => el.remove());

					const backdrop = document.createElement('div');
					backdrop.className = 'modal-backdrop fade show';

					archiveSection.appendChild(backdrop);

					backdrop.addEventListener('click', () => modal.hide());
				}

				modalEl.addEventListener('hidden.bs.modal', () => {
					document
						.querySelectorAll('[data-gyms-archive] .modal-backdrop')
						.forEach(el => el.remove());
				}, { once: true });
			}

			modal.show();
		}

		// -----------------------------
		// Step 2: Navigation bindings
		// -----------------------------

		// Client path
		document.querySelector('.js-client-path')?.addEventListener('click', () => {
			showModalSafely('#clientModal');
		});

		// Recruiter path
		document.querySelector('.js-recruiter-path')?.addEventListener('click', () => {
			showModalSafely('#recruiterModal');
		});

		// Back buttons (delegated)
		document.addEventListener('click', (e) => {
			const backBtn = e.target.closest('.modal-back');
			if (!backBtn) return;

			const target = backBtn.dataset.backTo;
			if (!target) return;

			showModalSafely(target);
		});

		// -----------------------------
		// Step 3: Cleanup safety net
		// -----------------------------
		document.addEventListener('hidden.bs.modal', () => {
			document.body.classList.remove('modal-open');
			document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
		});

	});

	// Gallery marquee for Portfolio page

	document.querySelectorAll('.gallery-marquee').forEach(marquee => {
		const track = marquee.querySelector('.gallery-track');
		if (!track) return;

		const galleries = track.querySelectorAll('.wp-block-gallery');
		if (galleries.length < 2) return;

		let position = 0;
		let speed = 0.5; // gallery pace (slower than projects)
		let paused = false;

		const galleryWidth = galleries[0].offsetWidth;

		function animate() {
			if (!paused) {
				position -= speed;

				// seamless loop
				if (Math.abs(position) >= galleryWidth) {
					position += galleryWidth;
				}

				track.style.transform = `translate3d(${position}px, 0, 0)`;
			}

			requestAnimationFrame(animate);
		}

		// Pause on hover
		marquee.addEventListener('mouseenter', () => paused = true);
		marquee.addEventListener('mouseleave', () => paused = false);

		// Pause when off-screen
		const observer = new IntersectionObserver(entries => {
			paused = !entries[0].isIntersecting;
		}, { threshold: 0.15 });

		observer.observe(marquee);

		animate();
	});

	function initSmartSearchSuggestions() {
		const suggestionsEl = document.querySelector('.search-suggestions');
		if (!suggestionsEl || suggestionsEl.dataset.enhance !== 'true') return;

		const searchInput = document.querySelector('input[type="search"]');

		const params = new URLSearchParams(window.location.search);
		const query =
			searchInput?.value.trim() ||
			params.get('s')?.trim();

		if (!query) return;

		fetch(`/wp-json/wp/v2/search?search=${encodeURIComponent(query)}`)
			.then(res => res.json())
			.then(results => {
				if (!Array.isArray(results) || !results.length) return;

				const seen = new Set();
				const fragment = document.createDocumentFragment();

				results.slice(0, 6).forEach((item, index) => {
					if (!item.title || seen.has(item.title)) return;
					seen.add(item.title);

					const li = document.createElement('li');
					li.style.setProperty('--delay', index);

					li.innerHTML = `
						<a href="${item.url}" class="search-suggestion">
							<span class="suggestion-type">
								${item.subtype.replace('-', ' ')}
							</span>
							<div class="suggestion-content">
								<span class="suggestion-label">${item.title}</span>
								<span class="suggestion-arrow">→</span>
							</div>
						</a>
					`;

					fragment.appendChild(li);
				});

				if (!fragment.childNodes.length) return;

				suggestionsEl.innerHTML = '';
				suggestionsEl.appendChild(fragment);
				suggestionsEl.classList.add('is-visible');
			})
			.catch(() => {
				// silent fail
			});
	}

	document.addEventListener('DOMContentLoaded', () => {
		// Initialise search suggestions
		initSmartSearchSuggestions();

		// Visibility listener for Homepage Hero inner content
		const hero = document.querySelector('.cover-content');
		if (!hero) return;

		requestAnimationFrame(() => {
			hero.classList.add('is-revealed');
		});
	});

	/* ==========================
	CASE STUDY: STORY CONTROLLER (SIMPLIFIED)
	========================== */

function initStoryController() {
  const wrapper = document.querySelector('.chapters-wrapper');
  const sections = [...document.querySelectorAll('.story-section')];
  const nav = document.querySelector('.chapter-selector');
  const list = nav?.querySelector('ul');
  if (!wrapper || !sections.length || !list) return;
  // Only mark successful initialisation; pageshow reuses the existing listeners.
  if (document.body.dataset.storyInit === 'true') return;
  const chapters = sections.map(section => {
    const chapter = section.querySelector('.cs-chapter[id]');
    const title = chapter?.querySelector('h2.chapter-title');
    return chapter && title ? {section, id: chapter.id, title: title.textContent.trim()} : null;
  }).filter(Boolean);
  if (!chapters.length) return;
  document.body.dataset.storyInit = 'true';
  document.documentElement.classList.add('case-study-document');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let activeIndex = -1;
  let entered = false;
  let pendingIndex = null;
  let userInteracted = false;
  let settleTimer = 0;
  // CSS and explicit navigation share exactly the same landing offset.
  const offset = () => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const destination = index => Math.max(0, window.scrollY + chapters[index].section.getBoundingClientRect().top - offset());
  const readHash = () => {
    try { return decodeURIComponent(window.location.hash.slice(1)); }
    catch { return ''; }
  };
  const initialIndex = chapters.findIndex(chapter => chapter.id === readHash());
  const links = chapters.map(({id, title}) => {
    const li = document.createElement('li');
    li.dataset.target = id;
    const link = document.createElement('a');
    link.href = '#' + encodeURIComponent(id);
    const label = document.createElement('span');
    label.textContent = title;
    link.appendChild(label);
    li.appendChild(link);
    return {li, link};
  });
  list.replaceChildren(...links.map(item => item.li));
  let progress = nav.querySelector('.chapter-progress span');
  if (!progress) {
    const track = document.createElement('div');
    track.className = 'chapter-progress';
    progress = document.createElement('span');
    track.appendChild(progress);
    nav.appendChild(track);
  }
  const controls = document.createElement('div');
  controls.className = 'chapter-step-controls';
  const previous = document.createElement('button');
  const next = document.createElement('button');
  previous.type = next.type = 'button';
  previous.textContent = '← Previous';
  next.textContent = 'Next →';
  previous.setAttribute('aria-label', 'Previous chapter');
  next.setAttribute('aria-label', 'Next chapter');
  controls.append(previous, next);
  nav.appendChild(controls);
  const backgrounds = [...document.querySelectorAll('.story-backgrounds .bg')];
  const setActive = index => {
    if (index === activeIndex) return;
    activeIndex = index;
    previous.disabled = index === 0;
    next.disabled = index === chapters.length - 1;
    const chapter = chapters[index];
    sections.forEach(section => section.classList.toggle('viewport-active', section === chapter.section));
    links.forEach(({li, link}, i) => {
      li.classList.toggle('is-active', i === index);
      if (i === index) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    backgrounds.forEach(bg => bg.classList.toggle('is-active', bg.dataset.bg === chapter.id));
    progress.style.transform = 'scaleY(' + ((index + 1) / chapters.length) + ')';
  };
  const update = () => {
    frame = 0;
    const top = 0;
    const height = window.innerHeight;
    if (!height) return;
    const rect = wrapper.getBoundingClientRect();
    const line = height * .35;
    // Controls only appear once the hero has cleared their reading position.
    const inChapters = rect.top <= offset() + 1 && rect.bottom > height * .5;
    document.body.classList.toggle('is-in-chapters', inChapters);
    nav.inert = !inChapters || chapters.length < 2;
    nav.setAttribute('aria-hidden', String(!inChapters || chapters.length < 2));
    if (!inChapters) return;
    // Use a viewport reading line, not a percentage of the entire chapter.
    // A very tall chapter can never meet a high intersection-ratio threshold.

    let index = 0;
    chapters.forEach((chapter, i) => {
      if (chapter.section.getBoundingClientRect().top <= line) index = i;
    });
    backgrounds.forEach(bg => bg.classList.toggle('is-active', bg.dataset.bg === chapters[index].id));
    if (pendingIndex === null) setActive(index);
    // Do not rewrite the URL merely because chapter 1 peeks under the hero.
    if (rect.top <= line) entered = true;
  };
  const finishScroll = () => {
    clearTimeout(settleTimer);
    // If interrupted, settle on the chapter actually reached.
    pendingIndex = null;
    update();
    const currentHash = readHash();
    const isChapterHash = chapters.some(chapter => chapter.id === currentHash);
    if (entered && document.body.classList.contains('is-in-chapters') &&
        (!currentHash || isChapterHash) && currentHash !== chapters[activeIndex].id) {
      const url = new URL(window.location.href);
      url.hash = chapters[activeIndex].id;
      history.replaceState(history.state, '', url);
    }
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  const goTo = (index, smooth = true) => {
    pendingIndex = index;
    setActive(index);
    const top = destination(index);
    window.scrollTo({top: Math.max(0, top),
      behavior: smooth && !reducedMotion.matches ? 'smooth' : 'instant'});
    schedule();
    clearTimeout(settleTimer);
    // Also handles clicking the current chapter (no scroll event).
    settleTimer = setTimeout(finishScroll, 220);
  };
  previous.addEventListener('click', () => { userInteracted = true; entered = true; goTo(Math.max(0, activeIndex - 1)); });
  next.addEventListener('click', () => { userInteracted = true; entered = true; goTo(Math.min(chapters.length - 1, activeIndex + 1)); });
  links.forEach(({link}, index) => link.addEventListener('click', event => {
    // Preserve modified clicks and opening a chapter in a new tab.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    userInteracted = true;
    entered = true;
    goTo(index);
    // Selection stays on the destination; backgrounds follow the visible chapter.
  }));
  const onHashChange = () => {
    const index = chapters.findIndex(chapter => chapter.id === readHash());
    if (index >= 0) { entered = true; goTo(index, false); }
  };
  window.addEventListener('scroll', () => {
    schedule();
    clearTimeout(settleTimer);
    settleTimer = setTimeout(finishScroll, 180);
  }, {passive: true});
  // Native completion where available; the debounce remains a fallback.
  document.addEventListener('scrollend', finishScroll);
  const releaseNavigation = () => { userInteracted = true; pendingIndex = null; schedule(); };
  window.addEventListener('wheel', releaseNavigation, {passive: true});
  window.addEventListener('touchstart', releaseNavigation, {passive: true});
  window.addEventListener('keydown', event => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) releaseNavigation();
  });
  window.addEventListener('resize', schedule, {passive: true});
  window.addEventListener('pageshow', event => {
    if (!event.persisted && initialIndex >= 0 && !userInteracted) goTo(initialIndex, false);
    else schedule();
  });
  window.addEventListener('hashchange', onHashChange);
  // Native wheel, touch and keyboard scrolling remain uninterrupted.
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(schedule);
    observer.observe(wrapper);
    chapters.forEach(chapter => observer.observe(chapter.section));
  }
  wrapper.addEventListener('load', schedule, true);
  document.fonts?.ready.then(schedule);
  setActive(initialIndex >= 0 ? initialIndex : 0);
  if (chapters.length < 2) nav.hidden = true;
  update();
  if (initialIndex >= 0) {
    entered = true;
    requestAnimationFrame(() => goTo(initialIndex, false));
    const eagerImages = [...document.querySelectorAll('.story-hero img')].map(img =>
      img.complete ? Promise.resolve() : new Promise(resolve => {
        img.addEventListener('load', resolve, {once: true});
        img.addEventListener('error', resolve, {once: true});
      }));
    Promise.all([document.fonts?.ready, ...eagerImages]).then(() => {
      if (!userInteracted) goTo(initialIndex, false);
    });
  }
}

	document.addEventListener('DOMContentLoaded', initStoryController);
	window.addEventListener('pageshow', initStoryController);

	/* ==========================
	PROJECTS ARCHIVE
	========================== */

	(() => {
		const archive = document.querySelector('[data-projects-archive]');
		if (!archive) return;

		const grid = archive.querySelector('[data-projects-grid]');
		const search = archive.querySelector('[data-project-search]');
		const filterButtons = [...archive.querySelectorAll('.project-filter-buttons button')];
		const titleEl = archive.querySelector('[data-projects-state-title]');
		const emptyEl = archive.querySelector('[data-projects-empty]');

		if (!grid) return;

		const allCards = [...grid.querySelectorAll('.project-card')];

		let activeMode = 'filter';
		let activeValue = 'all';

		const LABELS = {
			all: 'All',
			design: 'Design',
			development: 'WordPress',
			static: 'Static',
			shopify: 'Shopify',
			freelance: 'Freelance',
			commercial: 'Commercial',
		};

		const updateTitle = () => {
			if (!titleEl) return;
			titleEl.textContent = LABELS[activeValue] || 'All';
		};

		const matchesFilter = (card) => {
			if (activeValue === 'all') return true;

			if (activeMode === 'filter') {
				const types = (card.getAttribute('data-type') || '')
					.split(/\s+/)
					.map(value => value.trim())
					.filter(Boolean);

				return types.includes(activeValue);
			}

			if (activeMode === 'context') {
				return (card.getAttribute('data-context') || '') === activeValue;
			}

			return true;
		};



		const update = () => {
			const q = (search?.value || '').trim().toLowerCase();

			let visibleCount = 0;

			allCards.forEach(card => {
				const haystack = (card.getAttribute('data-search') || '').toLowerCase();
				const searchOk = !q || haystack.includes(q);
				const filterOk = matchesFilter(card);
				const show = searchOk && filterOk;

				card.hidden = !show;

				if (show) {
					visibleCount++;
				}
			});

			if (emptyEl) {
				emptyEl.hidden = visibleCount !== 0;
			}

			const count = archive.querySelector('[data-projects-count]');
			if (count) count.textContent = String(visibleCount);
			const countLabel = archive.querySelector('[data-projects-count-label]');
			if (countLabel) countLabel.textContent = visibleCount === 1 ? 'project' : 'projects';
			filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.classList.contains('is-active'))));
			updateTitle();
		};

		filterButtons.forEach(button => {
			button.addEventListener('click', () => {
				filterButtons.forEach(btn => btn.classList.remove('is-active'));
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

		search?.addEventListener('input', update);

		update();
	})();

	/* ==========================
	GYMS ARCHIVE
	========================== */

	(() => {
		const archive = document.querySelector('[data-gyms-archive]');
		if (!archive) return;

		const grid = archive.querySelector('[data-gyms-grid]');
		const search = archive.querySelector('[data-gym-search]');
		const sortSel = archive.querySelector('[data-gym-sort]');
		const buttons = [...archive.querySelectorAll('.gym-filter-buttons button')];
		const viewBtns = [...archive.querySelectorAll('[data-gym-view]')];
		const titleEl = archive.querySelector('[data-gyms-state-title]');
		const emptyEl = archive.querySelector('[data-gyms-empty]');
		const loadMore = archive.querySelector('[data-gyms-load-more]');

		const compareBar = archive.querySelector('[data-gym-compare-bar]');
		const compareCount = archive.querySelector('[data-gym-compare-count]');
		const compareSelected = archive.querySelector('[data-gym-compare-selected]');
		const compareTrigger = archive.querySelector('[data-gym-compare-trigger]');
		const compareClear = archive.querySelector('[data-gym-compare-clear]');
		const compareShareButtons = [...archive.querySelectorAll('[data-gym-compare-share]')];
		const comparison = archive.querySelector('[data-gym-comparison]');
		const comparisonTable = archive.querySelector('[data-gym-comparison-table]');
		const comparisonClose = archive.querySelector('[data-gym-compare-close]');
		const comparisonMapEl = archive.querySelector('[data-gym-comparison-map]');

		const sharePanel = archive.querySelector('[data-gym-share-panel]');
		const shareInput = archive.querySelector('[data-gym-share-input]');
		const shareStatus = archive.querySelector('[data-gym-share-status]');
		const shareCopyBtn = archive.querySelector('[data-gym-share-copy]');
		const shareCloseBtn = archive.querySelector('[data-gym-share-close]');

		if (!grid) return;

		const allCards = [...grid.querySelectorAll('[data-gym-card]')];
		const league = initGymLeague(archive, allCards);

		const LABELS = {
			all: 'All',
			davidlloyds: 'David Lloyd',
			puregym: 'PureGym',
			fitnessfirst: 'Fitness First',
			gymbox: 'Gymbox',
			virginactive: 'Virgin Active',
			bodyworks: 'Bodyworks Gym',
			thegymgroup: 'The Gym Group',
			other: 'Other',
		};

		const assessedAmenities = new Set();
		const amenities = document.createElement('fieldset');
		amenities.className = 'league-amenity-filters';
		const amenityLegend = document.createElement('legend');
		amenityLegend.textContent = 'Assessed amenities';
		amenities.append(amenityLegend);
		const amenityOptions = [
			['gymScore', 'Gym'],
			['swimScore', 'Swimming & Wetside Facilities'],
			['cafeScore', 'Café & Work Area'],
			['spaScore', 'Spa Retreat / Sauna Facilities'],
		];
		amenityOptions.forEach(([key, label]) => {
			const option = document.createElement('label');
			const input = document.createElement('input');
			input.type = 'checkbox';
			input.value = key;
			input.addEventListener('change', () => {
				if (input.checked) assessedAmenities.add(key);
				else assessedAmenities.delete(key);
				visibleCount = 10;
				update();
			});
			option.append(input, document.createTextNode(label));
			amenities.append(option);
		});
		const toolbar = archive.querySelector('.filter-inputs');
		const filterDisclosure = document.createElement('details');
		filterDisclosure.className = 'league-filter-disclosure';
		const filterSummary = document.createElement('summary');
		filterSummary.textContent = 'Filters';
		const filterPanel = document.createElement('div');
		filterPanel.className = 'league-filter-panel';
		const chainTitle = document.createElement('p');
		chainTitle.textContent = 'Gym chains';
		const resetFilters = document.createElement('button');
		resetFilters.type = 'button';
		resetFilters.textContent = 'Clear filters';
		resetFilters.addEventListener('click', () => {
			assessedAmenities.clear();
			amenities.querySelectorAll('input').forEach(input => { input.checked = false; });
			buttons.find(button => button.dataset.chain === 'all')?.click();
		});
		filterPanel.append(chainTitle, archive.querySelector('.gym-filter-buttons'), amenities, resetFilters);
		filterDisclosure.append(filterSummary, filterPanel);
		toolbar.append(filterDisclosure);
		filterDisclosure.addEventListener('keydown', event => {
			if (event.key === 'Escape') { filterDisclosure.open = false; filterSummary.focus(); }
		});
		document.addEventListener('click', event => {
			if (!filterDisclosure.contains(event.target)) filterDisclosure.open = false;
		});

		let activeChain = buttons.find((btn) => btn.classList.contains('is-active'))?.dataset.chain || 'all';
		let visibleCount = 10;
		let selectedGyms = [];
		let compareMap = null;
		let compareMarkers = [];

		const getBranch = (el) => (el.getAttribute('data-branch') || '').trim().toLowerCase();
		const getOverall = (el) => parseFloat(el.getAttribute('data-overall')) || 0;
		const getVisitedTs = (el) => parseInt(el.getAttribute('data-visited-ts'), 10) || 0;

		const updateTitle = () => {
			if (!titleEl) return;
			const label = LABELS[activeChain] || 'All';
			const signature = `${label}|${search?.value || ''}|${[...assessedAmenities].join(',')}`;
			if (titleEl.dataset.filterSignature !== signature) {
				titleEl.textContent = label;
				titleEl.dataset.filterSignature = signature;
				if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
					titleEl.animate([{backgroundSize: '0% 2px'}, {backgroundSize: '100% 2px'}], {duration: 450, easing: 'ease-out'});
				}
			} 
		};

		const sortCards = (cards) => {
			const mode = sortSel?.value || 'overall_desc';
			const sorted = [...cards];

			sorted.sort((a, b) => {
				const aBranch = getBranch(a);
				const bBranch = getBranch(b);
				const aOverall = getOverall(a);
				const bOverall = getOverall(b);
				const aDate = getVisitedTs(a);
				const bDate = getVisitedTs(b);

				switch (mode) {
					case 'overall_desc':
						return (bOverall - aOverall) || aBranch.localeCompare(bBranch);
					case 'overall_asc':
						return (aOverall - bOverall) || aBranch.localeCompare(bBranch);
					case 'date_desc':
						return (bDate - aDate) || aBranch.localeCompare(bBranch);
					case 'date_asc':
						return (aDate - bDate) || aBranch.localeCompare(bBranch);
					case 'za':
						return bBranch.localeCompare(aBranch);
					case 'az':
					default:
						return aBranch.localeCompare(bBranch);
				}
			});

			return sorted;
		};

		const getCardData = (card) => {
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
					parking: card.getAttribute('data-parking-score') || '',
				},
			};
		};

		const scoreLabel = (value) => {
			if (value === '' || value === null || value === undefined) return '—';
			return `${value}/10`;
		};

		const getWinnerIdsForMetric = (items, getter) => {
			let best = null;
			const ids = [];

			items.forEach((item) => {
				const value = getter(item);

				if (value === '' || value === null || value === undefined || Number.isNaN(Number(value))) {
					return;
				}

				const numeric = Number(value);

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

		const getShareUrl = () => {
			const url = new URL(window.location.href);
			if (selectedGyms.length) {
				url.searchParams.set('compare', selectedGyms.join(','));
			} else {
				url.searchParams.delete('compare');
			}
			return url.toString();
		};

		const syncShareUrl = () => {
			const url = new URL(window.location.href);
			if (selectedGyms.length) {
				url.searchParams.set('compare', selectedGyms.join(','));
			} else {
				url.searchParams.delete('compare');
			}
			window.history.replaceState({}, '', url.toString());
		};

		const openSharePanel = () => {
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

		const closeSharePanel = () => {
			if (!sharePanel) return;
			sharePanel.hidden = true;

			if (shareStatus) {
				shareStatus.textContent = '';
			}
		};

		const copyShareLink = () => {
			const url = shareInput?.value;
			if (!url || !shareCopyBtn) return;

			const originalText = shareCopyBtn.dataset.originalText || shareCopyBtn.textContent;
			shareCopyBtn.dataset.originalText = originalText;

			const resetButtonState = () => {
				window.setTimeout(() => {
					shareCopyBtn.textContent = originalText;
					shareCopyBtn.classList.remove('is-success', 'is-error');
				}, 2000);
			};

			const setButtonState = (text, className) => {
				shareCopyBtn.textContent = text;
				shareCopyBtn.classList.remove('is-success', 'is-error');
				shareCopyBtn.classList.add(className);
				resetButtonState();
			};

			const fallbackCopy = () => {
				const tempInput = document.createElement('textarea');
				tempInput.value = url;
				tempInput.setAttribute('readonly', 'readonly');
				tempInput.style.position = 'fixed';
				tempInput.style.top = '-9999px';
				tempInput.style.left = '-9999px';
				document.body.appendChild(tempInput);
				tempInput.focus();
				tempInput.select();

				let copied = false;

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
					shareInput?.focus();
					shareInput?.select();
				}
			};

			if (
				typeof navigator !== 'undefined' &&
				navigator.clipboard &&
				typeof navigator.clipboard.writeText === 'function' &&
				window.isSecureContext
			) {
				navigator.clipboard.writeText(url)
					.then(() => {
						setButtonState('Link copied', 'is-success');
					})
					.catch(() => {
						fallbackCopy();
					});
				return;
			}

			fallbackCopy();
		};

		const initComparisonMap = () => {
			if (!comparisonMapEl || typeof L === 'undefined') return null;
			if (compareMap) return compareMap;

			compareMap = L.map(comparisonMapEl, {
				scrollWheelZoom: false,
				zoomControl: true,
			});

			L.tileLayer('https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=cb1_49v4_1_6f4e11cc72c4a39104c6f6c9', {
				attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
				subdomains: 'abcd',
				maxZoom: 20,
			}).addTo(compareMap);

			return compareMap;
		};

		const renderComparisonMap = (items) => {
			if (!comparisonMapEl) return;

			const mappable = items.filter((item) => !Number.isNaN(item.lat) && !Number.isNaN(item.lng));

			comparisonMapEl.hidden = mappable.length === 0;
			if (!mappable.length) return;

			const map = initComparisonMap();
			if (!map) return;

			compareMarkers.forEach((marker) => marker.remove());
			compareMarkers = [];

			const points = [];

			mappable.forEach((item) => {
				const point = [item.lat, item.lng];
				points.push(point);

				const marker = L.marker(point)
					.addTo(map)
					.bindPopup(`<strong>${item.branch}</strong><br>${item.chain}${item.overallLabel ? `<br>${item.overallLabel}` : ''}`);

				compareMarkers.push(marker);
			});

			window.setTimeout(() => {
				map.invalidateSize();
				if (points.length === 1) {
					map.setView(points[0], 12);
				} else {
					map.fitBounds(points, { padding: [40, 40] });
				}
			}, 100);
		};

		const renderComparison = () => {
			if (!comparison || !comparisonTable) return;

			if (selectedGyms.length < 2) {
				comparison.hidden = true;
				comparisonTable.innerHTML = '';
				if (comparisonMapEl) comparisonMapEl.hidden = true;
				return;
			}

			const items = selectedGyms
				.map((id) => allCards.find((card) => card.getAttribute('data-gym-id') === id))
				.filter(Boolean)
				.map(getCardData)
				.filter(Boolean);

			if (items.length < 2) {
				comparison.hidden = true;
				comparisonTable.innerHTML = '';
				if (comparisonMapEl) comparisonMapEl.hidden = true;
				return;
			}

			const rows = [
				{ label: 'Overall', format: (item) => item.overallLabel, winners: getWinnerIdsForMetric(items, (item) => item.overall) },
				{ label: 'Gym', format: (item) => scoreLabel(item.scores.gym), winners: getWinnerIdsForMetric(items, (item) => item.scores.gym) },
				{ label: 'Swimming & Wetside Facilities', format: (item) => scoreLabel(item.scores.swim), winners: getWinnerIdsForMetric(items, (item) => item.scores.swim) },
				{ label: 'Spa Retreat', format: (item) => `${item.chain.toLowerCase() === 'gymbox' ? 'Sauna Facilities: ' : ''}${scoreLabel(item.scores.spa)}`, winners: getWinnerIdsForMetric(items, (item) => item.scores.spa) },
				{ label: 'Café & Work Area', format: (item) => `${item.chain.toLowerCase().startsWith('david lloyd') ? 'Clubroom: ' : ''}${scoreLabel(item.scores.cafe)}`, winners: getWinnerIdsForMetric(items, (item) => item.scores.cafe) },
				{ label: 'Cleanliness & Maintenance', format: (item) => scoreLabel(item.scores.clean), winners: getWinnerIdsForMetric(items, (item) => item.scores.clean) },
				{ label: 'Parking', format: (item) => scoreLabel(item.scores.parking), winners: getWinnerIdsForMetric(items, (item) => item.scores.parking) },
				{ label: 'Membership', format: (item) => item.membership || '—', winners: [] },
				{ label: 'Visited', format: (item) => item.visited || '—', winners: [] },
			];

			comparisonTable.innerHTML = `
				<div class="dx-gym-comparison__table">
					<div class="dx-gym-comparison__row dx-gym-comparison__row--head ${items.length === 2 ? 'is-two-up' : ''}">
						<div class="dx-gym-comparison__metric">Metric</div>
						${items.map((item) => `
							<div class="dx-gym-comparison__cell dx-gym-comparison__cell--gym">
								<h3 class="branch-name">${item.branch}</h3>
								<span>${item.chain}</span>
							</div>
						`).join('')}
					</div>
					${rows.map((row) => `
						<div class="dx-gym-comparison__row ${items.length === 2 ? 'is-two-up' : ''}">
							<div class="dx-gym-comparison__metric">${row.label}</div>
							${items.map((item) => `
								<div class="dx-gym-comparison__cell ${row.winners.includes(item.id) ? 'is-winner' : ''}">
									${row.format(item)}
								</div>
							`).join('')}
						</div>
					`).join('')}
				</div>
			`;

			renderComparisonMap(items);
		};

		const updateCompareBar = () => {
			if (!compareBar || !compareCount || !compareSelected || !compareTrigger || !compareClear) return;

			const atLimit = selectedGyms.length >= 3;
			const hasEnoughToCompare = selectedGyms.length >= 2;

			compareBar.hidden = selectedGyms.length === 0;
			compareBar.classList.toggle('is-visible', selectedGyms.length > 0);
			compareCount.textContent = String(selectedGyms.length);
			compareTrigger.disabled = !hasEnoughToCompare;
			compareClear.disabled = selectedGyms.length === 0;

			compareShareButtons.forEach((button) => {
				button.disabled = !hasEnoughToCompare;
			});

			compareSelected.innerHTML = selectedGyms.map((id) => {
				const card = allCards.find((item) => item.getAttribute('data-gym-id') === id);
				const label = card?.getAttribute('data-branch-label') || 'Gym';
				const chip = document.createElement('button');
				chip.type = 'button'; chip.className = 'dx-gym-compare-chip'; chip.dataset.removeGym = id;
				chip.textContent = label + ' ×'; chip.setAttribute('aria-label', 'Remove ' + label + ' from comparison');
				return chip.outerHTML;
			}).join('');

			allCards.forEach((card) => {
				const id = card.getAttribute('data-gym-id');
				const toggle = card.querySelector('[data-gym-compare-toggle]');
				if (!toggle) return;

				const isSelected = selectedGyms.includes(id);
				const shouldDisable = atLimit && !isSelected;

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

        let observedLast = null;
        const moreObserver = new IntersectionObserver(entries => {
            if (!entries.some(entry => entry.isIntersecting && entry.target === observedLast)) return;
            moreObserver.disconnect();
            observedLast = null;
            visibleCount += 10;
            update();
        }, { rootMargin: '0px 0px 180px 0px', threshold: 0 });

		const update = () => {
			const activeFilters = assessedAmenities.size + (activeChain === 'all' ? 0 : 1);
			filterSummary.textContent = activeFilters ? `Filters (${activeFilters})` : 'Filters';
			const q = (search?.value || '').trim().toLowerCase();

			const eligible = allCards.filter((card) => {
				const chain = card.getAttribute('data-chain') || 'unknown';
				const chainOk = activeChain === 'all' || chain === activeChain || (activeChain === 'other' && !Object.prototype.hasOwnProperty.call(LABELS, chain));

				const haystack = (card.getAttribute('data-search') || '').toLowerCase();
				const searchOk = !q || haystack.includes(q);

				const amenitiesOk = [...assessedAmenities].every(key => {
					const value = card.dataset[key];
					return value !== undefined && value.trim() !== '' && Number.isFinite(Number(value)) && Number(value) >= 0;
				});
				return chainOk && searchOk && amenitiesOk;
			});

			const ordered = sortCards(eligible);

			ordered.forEach((card) => grid.appendChild(card));

			allCards.forEach((card) => {
				card.hidden = true;
			});

			ordered.slice(0, visibleCount).forEach((card) => {
				card.hidden = false;
			});

			if (emptyEl) {
				emptyEl.hidden = ordered.length !== 0;
			}

			moreObserver.disconnect();
            observedLast = ordered.length > visibleCount ? ordered[Math.min(visibleCount, ordered.length)-1] : null;
            if (observedLast) moreObserver.observe(observedLast);

			updateTitle();
			league.update(ordered, visibleCount);
		};

		buttons.forEach((btn) => {
			btn.addEventListener('click', () => {
				buttons.forEach((b) => { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
				btn.setAttribute('aria-pressed', 'true');
				btn.classList.add('is-active');

				activeChain = btn.dataset.chain || 'all';
				visibleCount = 10;
				update();
			});
		});

		archive.addEventListener('league-view-change', update);
		search?.addEventListener('input', () => {
			visibleCount = 10;
			update();
		});

		sortSel?.addEventListener('change', () => {
			visibleCount = 10;
			update();
		});



		viewBtns.forEach((btn) => {
			btn.addEventListener('click', () => {
				viewBtns.forEach((b) => b.classList.remove('is-active'));
				btn.classList.add('is-active');

				const view = btn.getAttribute('data-gym-view') || 'cards';
				archive.setAttribute('data-view', view);
			});
		});

		grid?.addEventListener('click', (e) => {
			const toggle = e.target.closest('[data-notes-toggle]');
			if (!toggle) return;

			const card = toggle.closest('[data-gym-card]');
			const panel = card?.querySelector('[data-notes-panel]');
			if (!card || !panel) return;

			const isOpen = card.classList.contains('is-notes-open');
			card.classList.toggle('is-notes-open', !isOpen);
			toggle.setAttribute('aria-expanded', String(!isOpen));
		});

		grid?.addEventListener('click', (e) => {
			const compareBtn = e.target.closest('[data-gym-compare-toggle]');
			if (!compareBtn || compareBtn.disabled) return;

			const card = compareBtn.closest('[data-gym-card]');
			if (!card) return;

			const id = card.getAttribute('data-gym-id');
			if (!id) return;

			if (selectedGyms.includes(id)) {
				selectedGyms = selectedGyms.filter((item) => item !== id);
			} else {
				if (selectedGyms.length >= 3) return;
				selectedGyms = [...selectedGyms, id];
			}

			updateCompareBar();
			renderComparison();
		});

		compareTrigger?.addEventListener('click', () => {
			renderComparison();
			comparison?.removeAttribute('hidden');
			comparison?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		});

		compareSelected?.addEventListener('click', (event) => {
			const button = event.target.closest('[data-remove-gym]');
			if (!button) return;
			selectedGyms = selectedGyms.filter(id => id !== button.dataset.removeGym);
			updateCompareBar(); renderComparison();
		});

		compareClear?.addEventListener('click', () => {
			selectedGyms = [];
			updateCompareBar();
			renderComparison();
		});

		compareShareButtons.forEach((btn) => {
			btn.addEventListener('click', openSharePanel);
		});

		shareCopyBtn?.addEventListener('click', copyShareLink);
		shareCloseBtn?.addEventListener('click', closeSharePanel);

		comparisonClose?.addEventListener('click', () => {
			if (comparison) {
				comparison.hidden = true;
			}
		});

		const compareParam = new URLSearchParams(window.location.search).get('compare');
		if (compareParam) {
			selectedGyms = compareParam
				.split(',')
				.map((id) => id.trim())
				.filter((id) => allCards.some((card) => card.getAttribute('data-gym-id') === id))
				.slice(0, 3);

			if (selectedGyms.length >= 2) {
				renderComparison();
				comparison?.removeAttribute('hidden');

				window.setTimeout(() => {
					comparison?.scrollIntoView({
						behavior: 'smooth',
						block: 'start',
					});
				}, 100);
			}
		}

		const initialViewBtn = viewBtns.find((btn) => btn.classList.contains('is-active'));
		archive.setAttribute('data-view', initialViewBtn?.getAttribute('data-gym-view') || 'cards');

		const animatedCards = new WeakSet();

		const animateCardBars = (card) => {
			if (!card || animatedCards.has(card)) return;

			const bars = [...card.querySelectorAll('.dx-score-bar span')];
			if (!bars.length) return;

			animatedCards.add(card);

			bars.forEach((bar, index) => {
				const pct = getComputedStyle(bar).getPropertyValue('--pct').trim() || '0';
				bar.style.transform = 'scaleX(0)';

				window.setTimeout(() => {
					bar.style.transform = `scaleX(${pct})`;
				}, index * 100);
			});
		};

		const cardObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						animateCardBars(entry.target);
						cardObserver.unobserve(entry.target);
					}
				});
			},
			{
				threshold: 0.2,
				rootMargin: '0px 0px -10% 0px',
			}
		);

		allCards.forEach((card) => {
			cardObserver.observe(card);
		});

		updateCompareBar();
		renderComparison();
		update();
		archive.classList.remove('is-loading');
		archive.removeAttribute('aria-busy');
		archive.querySelector('.league-loading')?.remove();
	})();

	/* ==========================
	GYM VIEWPORT-ACTIVE (DEDICATED)
	========================== */

	// The league can be taller than the viewport; do not gate it on scroll ratios.
	document.querySelector('[data-gyms-archive]')?.closest('section')?.classList.add('viewport-active');

	/* ==========================
	BUS DIARY
	========================== */

	document.addEventListener('DOMContentLoaded', () => {
		const busEntry = document.querySelector('.bus-diary-entry');
		if (!busEntry) return;

		const mapEl = busEntry.querySelector('[data-bus-map]');
		const dock = busEntry.querySelector('[data-bus-dock]');
		const paneStage = busEntry.querySelector('[data-bus-pane-stage]');
		const toggleButtons = dock ? [...dock.querySelectorAll('[data-view-toggle]')] : [];
		const paneViews = paneStage ? [...paneStage.querySelectorAll('.bus-pane-view[data-pane-view]')] : [];

		/* ==========================
		BUS MAP
		========================== */

		if (mapEl) {
			const route = mapEl.dataset.route || '';
			const startName = mapEl.dataset.startName || 'Start';
			const endName = mapEl.dataset.endName || 'End';

			console.log('Bus map ready:', {
				route,
				start: startName,
				end: endName
			});

			if (typeof L !== 'undefined') {
				const startLat = parseFloat(mapEl.dataset.startLat);
				const startLng = parseFloat(mapEl.dataset.startLng);
				const endLat = parseFloat(mapEl.dataset.endLat);
				const endLng = parseFloat(mapEl.dataset.endLng);

				const hasStart = !Number.isNaN(startLat) && !Number.isNaN(startLng);
				const hasEnd = !Number.isNaN(endLat) && !Number.isNaN(endLng);

				if (!hasStart && !hasEnd) {
					mapEl.innerHTML = '<div class="bus-map__empty">No journey coordinates added yet.</div>';
				} else {
					const map = L.map(mapEl, {
						scrollWheelZoom: false,
						zoomControl: true
					});

					L.tileLayer('https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_49v4_1_6f4e11cc72c4a39104c6f6c9', {
						attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
						subdomains: 'abcd',
						maxZoom: 20
					}).addTo(map);

					const points = [];

					const startIcon = L.divIcon({
						className: 'bus-map-marker bus-map-marker--start',
						html: '<span></span>',
						iconSize: [18, 18],
						iconAnchor: [9, 9]
					});

					const endIcon = L.divIcon({
						className: 'bus-map-marker bus-map-marker--end',
						html: '<span></span>',
						iconSize: [18, 18],
						iconAnchor: [9, 9]
					});

					if (hasStart) {
						const startPoint = [startLat, startLng];
						points.push(startPoint);

						L.marker(startPoint, { icon: startIcon })
							.addTo(map)
							.bindPopup(`<strong>${startName}</strong>${route ? `<br>Route ${route}` : ''}`);
					}

					if (hasEnd) {
						const endPoint = [endLat, endLng];
						points.push(endPoint);

						L.marker(endPoint, { icon: endIcon })
							.addTo(map)
							.bindPopup(`<strong>${endName}</strong>${route ? `<br>Route ${route}` : ''}`);
					}

					if (hasStart && hasEnd) {
						L.polyline(
							[
								[startLat, startLng],
								[endLat, endLng]
							],
							{
								color: '#ffffff',
								weight: 4,
								opacity: 0.85
							}
						).addTo(map);
					}

					if (points.length === 1) {
						map.setView(points[0], 13);
					} else {
						map.fitBounds(points, {
							padding: [40, 40]
						});
					}

					window.addEventListener('resize', () => {
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
			const setActivePane = (viewName) => {
				paneViews.forEach((view) => {
					view.classList.toggle('is-active', view.dataset.paneView === viewName);
				});

				toggleButtons.forEach((button) => {
					const isActive = button.dataset.viewToggle === viewName;
					button.classList.toggle('is-active', isActive);
					button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
				});

				if (viewName === 'map') {
					window.dispatchEvent(new Event('resize'));
				}
			};

			toggleButtons.forEach((button) => {
				button.addEventListener('click', () => {
					const viewName = button.dataset.viewToggle;
					if (!viewName) return;
					setActivePane(viewName);
				});
			});

			const activeButton = dock.querySelector('[data-view-toggle].is-active');
			setActivePane(activeButton?.dataset.viewToggle || 'map');
		}

		/* ==========================
		BUS PANEL TOGGLES
		========================== */

		const panelToggleButtons = [...busEntry.querySelectorAll('[data-bus-panel-toggle]')];
		const panels = [...busEntry.querySelectorAll('[data-bus-panel]')];

		if (panelToggleButtons.length && panels.length) {
			panelToggleButtons.forEach((btn) => {
				btn.addEventListener('click', () => {
					const key = btn.dataset.busPanelToggle;
					if (!key) return;

					const panel = busEntry.querySelector(`[data-bus-panel="${key}"]`);
					if (!panel) return;

					const isHidden = panel.hasAttribute('hidden');

					panels.forEach((p) => p.setAttribute('hidden', 'hidden'));

					if (isHidden) {
						panel.removeAttribute('hidden');
					}
				});
			});
		}

		/* ==========================
		TFL DEPARTURES NEAR YOU
		========================== */

		const departuresRoot = busEntry.querySelector('[data-bus-departures]');
		if (!departuresRoot) return;

		const locateBtn = departuresRoot.querySelector('[data-bus-locate]');
		const statusEl = departuresRoot.querySelector('[data-bus-status]');
		const stopsEl = departuresRoot.querySelector('[data-bus-stops]');
		const resultsEl = departuresRoot.querySelector('[data-bus-results]');

		if (!locateBtn || !statusEl || !stopsEl || !resultsEl) return;
		if (locateBtn.dataset.busLocateBound === 'true') return;
		locateBtn.dataset.busLocateBound = 'true';

		const hasBusConfig = typeof DX_BUS_DIARY !== 'undefined' && DX_BUS_DIARY && DX_BUS_DIARY.rest_url;
		const restBase = hasBusConfig ? DX_BUS_DIARY.rest_url.replace(/\/$/, '') : '';

		const setStatus = (message) => {
			statusEl.textContent = message;
		};

		const minsLabel = (seconds) => {
			if (seconds === null || seconds === undefined) return '—';
			const mins = Math.round(seconds / 60);
			if (mins <= 0) return 'Due';
			return `${mins} min`;
		};

		const renderArrivals = (arrivals) => {
			if (!arrivals.length) {
				resultsEl.innerHTML = `
					<div class="bus-arrival-card">
						<div class="bus-arrival-main">No live departures found.</div>
					</div>
				`;
				return;
			}

			resultsEl.innerHTML = arrivals.map((item) => `
				<div class="bus-arrival-card">
					<div class="bus-arrival-main">
						<div class="bus-arrival-line">${item.lineName || 'Bus'}</div>
						<div class="bus-arrival-destination">${item.destinationName || 'Unknown destination'}</div>
						<div class="bus-arrival-meta">${item.towards || ''}</div>
					</div>
					<div class="bus-arrival-time">${minsLabel(item.timeToStation)}</div>
				</div>
			`).join('');
		};

		const loadArrivals = async (stopId, stopName) => {
			setStatus(`Loading departures for ${stopName}…`);
			resultsEl.innerHTML = '';

			try {
				const res = await fetch(
					`${restBase}/tfl-stop-arrivals?stop_id=${encodeURIComponent(stopId)}`,
					{
						headers: {
							'X-WP-Nonce': DX_BUS_DIARY.nonce
						}
					}
				);

				const data = await res.json();

				if (!data.success) {
					throw new Error(data.message || 'Could not load arrivals.');
				}

				setStatus(`Showing live departures for ${stopName}`);
				renderArrivals(data.arrivals || []);
			} catch (err) {
				setStatus('Unable to load live departures right now.');
				resultsEl.innerHTML = `
					<div class="bus-arrival-card">
						<div class="bus-arrival-main">${err.message}</div>
					</div>
				`;
			}
		};

		const renderStops = (stops) => {
			if (!stops.length) {
				stopsEl.innerHTML = `
					<div class="bus-stop-card">
						<p>No nearby bus stops found.</p>
					</div>
				`;
				resultsEl.innerHTML = '';
				return;
			}

			stopsEl.innerHTML = stops.map((stop, index) => `
				<button
					type="button"
					class="bus-stop-card ${index === 0 ? 'is-active' : ''}"
					data-stop-id="${stop.id}"
					data-stop-name="${stop.name}"
				>
					<h4>${stop.name}</h4>
					<p>${stop.distance ?? '—'}m away ${stop.indicator ? `• Stop ${stop.indicator}` : ''}</p>
				</button>
			`).join('');

			const stopButtons = [...stopsEl.querySelectorAll('[data-stop-id]')];

			stopButtons.forEach((btn) => {
				btn.addEventListener('click', () => {
					stopButtons.forEach((b) => b.classList.remove('is-active'));
					btn.classList.add('is-active');
					loadArrivals(btn.dataset.stopId, btn.dataset.stopName);
				});
			});

			loadArrivals(stops[0].id, stops[0].name);
		};

		locateBtn.addEventListener('click', () => {
			if (!hasBusConfig) {
				setStatus('Live departures are not configured yet.');
				resultsEl.innerHTML = '';
				stopsEl.innerHTML = `
					<div class="bus-stop-card">
						<p>DX_BUS_DIARY is missing or not localised into the page.</p>
					</div>
				`;
				console.warn('DX_BUS_DIARY is missing from the page.');
				return;
			}

			setStatus('Getting your location…');
			stopsEl.innerHTML = '';
			resultsEl.innerHTML = '';

			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const { latitude, longitude } = position.coords;

					try {
						const res = await fetch(
							`${restBase}/tfl-nearby-stops?lat=${encodeURIComponent(latitude)}&lng=${encodeURIComponent(longitude)}&radius=600`,
							{
								headers: {
									'X-WP-Nonce': DX_BUS_DIARY.nonce
								}
							}
						);

						const data = await res.json();

						if (!data.success) {
							throw new Error(data.message || 'Could not load nearby stops.');
						}

						setStatus('Nearby stops found.');
						renderStops(data.stops || []);
					} catch (err) {
						setStatus('Unable to find nearby stops right now.');
						stopsEl.innerHTML = `
							<div class="bus-stop-card">
								<p>${err.message}</p>
							</div>
						`;
					}
				},
				(error) => {
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
				},
				{
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 60000
				}
			);
		});
	});

	/* ==========================
	GEO RESTRICTION
	========================== */

	(() => {
		'use strict';

		const BLOCKED_COUNTRIES = [
			'IL',
		];

		const RESTRICTED_PATH = '/access-restricted/';
		const BODY_CLASS = 'error405';
		const DEV_PARAM = 'geo';

		const normaliseCountryCode = (value) => {
			if (!value || typeof value !== 'string') return '';
			return value.trim().toUpperCase();
		};

		const getCountryCode = () => {
			const params = new URLSearchParams(window.location.search);
			const override = normaliseCountryCode(params.get(DEV_PARAM));

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
			const bodyCountry = normaliseCountryCode(document.body?.dataset?.country);
			if (bodyCountry) {
				return bodyCountry;
			}

			return '';
		};

		const isRestrictedPage = () => {
			const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
			const restrictedPath = RESTRICTED_PATH.replace(/\/+$/, '') || '/';
			return currentPath === restrictedPath;
		};

		const shouldBlockCountry = (countryCode) => {
			if (!countryCode) return false;
			return BLOCKED_COUNTRIES.includes(countryCode);
		};

		const applyBlockedState = () => {
			document.body.classList.add(BODY_CLASS);
			document.documentElement.classList.add(BODY_CLASS);
		};

		const redirectToRestrictedPage = (countryCode) => {
			const url = new URL(RESTRICTED_PATH, window.location.origin);

			// Optional: pass through debug info for testing/inspection
			url.searchParams.set('geo', countryCode);

			window.location.replace(url.toString());
		};

		const initGeoRestriction = () => {
			const countryCode = getCountryCode();
			const blocked = shouldBlockCountry(countryCode);
			const onRestrictedPage = isRestrictedPage();

			// Debug helpers
			window.DX_GEO_DEBUG = {
				countryCode,
				blocked,
				onRestrictedPage,
				blockedCountries: [...BLOCKED_COUNTRIES],
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

	document.addEventListener('DOMContentLoaded', () => {
		const calendlyButtons = document.querySelectorAll('.js-calendly-popup');

		if (!calendlyButtons.length) return;

		calendlyButtons.forEach((button) => {
			button.addEventListener('click', (e) => {
				e.preventDefault();

				if (typeof Calendly === 'undefined' || typeof Calendly.initPopupWidget !== 'function') {
					console.warn('Calendly widget script is not loaded yet.');
					return;
				}

				Calendly.initPopupWidget({
					url: 'https://calendly.com/dxndre/30min',
				});
			});
		});

		console.log('Calendly popup initialized for buttons:', calendlyButtons);
	});

	/* ==========================
		BUS NFS ARCHIVE
	========================== */

	(() => {
		const archive = document.querySelector('[data-bus-nfs]');
		if (!archive) return;

		const slides = [...archive.querySelectorAll('[data-bus-slide]')];
		const prevBtn = archive.querySelector('[data-bus-prev]');
		const nextBtn = archive.querySelector('[data-bus-next]');
		const currentEl = archive.querySelector('[data-bus-current]');

		if (!slides.length) return;

		let currentIndex = 0;
		let locked = false;

		const pad = (number) => String(number).padStart(2, '0');

		const setActiveSlide = (index) => {
			currentIndex = Math.max(0, Math.min(index, slides.length - 1));

			slides.forEach((slide, slideIndex) => {
				slide.classList.toggle('is-active', slideIndex === currentIndex);
				slide.classList.toggle('is-before', slideIndex < currentIndex);
				slide.classList.toggle('is-after', slideIndex > currentIndex);
			});

			if (currentEl) {
				currentEl.textContent = pad(currentIndex + 1);
			}
		};

		const next = () => {
			if (currentIndex >= slides.length - 1) return;
			setActiveSlide(currentIndex + 1);
		};

		const prev = () => {
			if (currentIndex <= 0) return;
			setActiveSlide(currentIndex - 1);
		};

		nextBtn?.addEventListener('click', next);
		prevBtn?.addEventListener('click', prev);

		window.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
			if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev();
		});

		archive.addEventListener('wheel', (e) => {
			e.preventDefault();

			if (locked) return;
			locked = true;

			if (e.deltaY > 0) {
				next();
			} else {
				prev();
			}

			setTimeout(() => {
				locked = false;
			}, 850);
		}, { passive: false });

		setActiveSlide(0);
	})();

	(() => {

	'use strict';


	// ================================================================
	// GUARD
	// ================================================================

	const body = document.body;

	if (!body || !body.classList.contains('single-gym-review')) {
		return;
	}


	const reduceMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;


	// ================================================================
	// HELPERS
	// ================================================================

	const clamp = (value, min, max) => {
		return Math.min(Math.max(value, min), max);
	};


	const parseScore = (value) => {

		if (
			value === null ||
			value === undefined ||
			value === '' ||
			value === 'unavailable'
		) {
			return null;
		}

		const parsed = parseFloat(value);

		return Number.isFinite(parsed)
			? parsed
			: null;
	};


	const escapeAttribute = (value = '') => {

		return String(value)
			.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	};


	// ================================================================
	// SCROLL REVEAL
	// ================================================================

	const initialiseRevealAnimations = () => {

		const selectors = [

			'.gym-review-overview__grid',
			'.gym-review-section-heading',
			'.gym-review-score',
			'.gym-review-panel',
			'.gym-review-gallery figure',
			'.gym-review-content__grid',
			'.gym-review-final .container'

		];

		const elements = document.querySelectorAll(
			selectors.join(',')
		);


		elements.forEach((element) => {

			if (!element.hasAttribute('data-gym-reveal')) {

				element.setAttribute(
					'data-gym-reveal',
					''
				);
			}
		});


		if (
			reduceMotion ||
			!('IntersectionObserver' in window)
		) {

			elements.forEach((element) => {

				element.classList.add(
					'is-visible'
				);
			});

			return;
		}


		const observer = new IntersectionObserver(

			(entries) => {

				entries.forEach((entry) => {

					if (!entry.isIntersecting) {
						return;
					}

					entry.target.classList.add(
						'is-visible'
					);

					observer.unobserve(
						entry.target
					);
				});
			},

			{
				threshold: 0.12,
				rootMargin: '0px 0px -40px 0px'
			}

		);


		elements.forEach((element) => {

			observer.observe(element);
		});
	};


	// ================================================================
	// HERO PARALLAX
	// ================================================================

	const initialiseHeroParallax = () => {

		if (reduceMotion) {
			return;
		}


		const hero = document.querySelector(
			'.gym-review-hero'
		);

		const image = document.querySelector(
			'.gym-review-hero__image'
		);


		if (!hero || !image) {
			return;
		}


		let ticking = false;


		const update = () => {

			const rect =
				hero.getBoundingClientRect();

			const viewportHeight =
				window.innerHeight;

			if (
				rect.bottom < 0 ||
				rect.top > viewportHeight
			) {

				ticking = false;
				return;
			}


			const progress = clamp(
				-window.scrollY / 1200,
				-1,
				0
			);


			const translate =
				window.scrollY * 0.08;


			image.style.transform =
				`translate3d(0, ${translate}px, 0) scale(1.035)`;


			ticking = false;
		};


		const requestUpdate = () => {

			if (ticking) {
				return;
			}

			ticking = true;

			window.requestAnimationFrame(
				update
			);
		};


		window.addEventListener(
			'scroll',
			requestUpdate,
			{
				passive: true
			}
		);

		requestUpdate();
	};


	// ================================================================
	// SCORE BARS
	// ================================================================

	const initialiseScores = () => {

		const scoreItems =
			document.querySelectorAll(
				'.gym-review-score'
			);


		if (!scoreItems.length) {
			return;
		}


		scoreItems.forEach((item) => {

			const scoreValue =
				parseScore(
					item.dataset.score
				);

			const fill =
				item.querySelector(
					'.gym-review-score__fill'
				);

			const display =
				item.querySelector(
					'.gym-review-score__value'
				) ||
				item.querySelector(
					'.gym-review-score__meta strong'
				);


			if (scoreValue === null) {

				item.classList.add(
					'is-unavailable'
				);

				if (display) {

					display.textContent =
						'Unavailable';
				}

				return;
			}


			const percentage =
				clamp(
					scoreValue * 10,
					0,
					100
				);


			if (fill) {

				fill.dataset.width =
					`${percentage}%`;

				fill.style.width =
					'0';
			}


			if (display) {

				display.textContent =
					`${scoreValue}/10`;
			}
		});


		const animate = (item) => {

			const fill =
				item.querySelector(
					'.gym-review-score__fill'
				);

			if (!fill) {
				return;
			}


			const width =
				fill.dataset.width;

			if (!width) {
				return;
			}


			requestAnimationFrame(() => {

				fill.style.width =
					width;
			});
		};


		if (
			reduceMotion ||
			!('IntersectionObserver' in window)
		) {

			scoreItems.forEach(animate);

			return;
		}


		const observer =
			new IntersectionObserver(

				(entries) => {

					entries.forEach(
						(entry) => {

							if (
								!entry.isIntersecting
							) {
								return;
							}


							animate(
								entry.target
							);

							observer.unobserve(
								entry.target
							);
						}
					);
				},

				{
					threshold: 0.35
				}
			);


		scoreItems.forEach((item) => {

			if (
				!item.classList.contains(
					'is-unavailable'
				)
			) {

				observer.observe(item);
			}
		});
	};


	// ================================================================
	// OVERALL SCORE COUNT-UP
	// ================================================================

	const initialiseOverallScore = () => {

		const scoreElements =
			document.querySelectorAll(
				'[data-overall-score]'
			);


		if (!scoreElements.length) {
			return;
		}


		const animateScore = (element) => {

			const target =
				parseFloat(
					element.dataset.overallScore
				);


			if (!Number.isFinite(target)) {
				return;
			}


			element.style.color = gymOverallBand(target).color;

			if (reduceMotion) {

				element.textContent =
					`${target.toFixed(1)}%`;

				return;
			}


			const duration =
				1100;

			const start =
				performance.now();


			const frame = (time) => {

				const elapsed =
					time - start;

				const progress =
					clamp(
						elapsed / duration,
						0,
						1
					);


				const eased =
					1 -
					Math.pow(
						1 - progress,
						3
					);


				const current =
					target * eased;


				element.textContent =
					`${current.toFixed(1)}%`;
				element.style.color = gymOverallBand(current).color;


				if (progress < 1) {

					requestAnimationFrame(
						frame
					);
				}
			};


			requestAnimationFrame(frame);
		};


		if (
			!('IntersectionObserver' in window)
		) {

			scoreElements.forEach(
				animateScore
			);

			return;
		}


		const observer =
			new IntersectionObserver(

				(entries) => {

					entries.forEach(
						(entry) => {

							if (
								!entry.isIntersecting
							) {
								return;
							}


							animateScore(
								entry.target
							);

							observer.unobserve(
								entry.target
							);
						}
					);
				},

				{
					threshold: 0.4
				}
			);


		scoreElements.forEach(
			(element) => {

				observer.observe(element);
			}
		);
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

	const initialiseMap = () => {

		const maps =
			document.querySelectorAll(
				'.gym-review-map'
			);


		if (!maps.length) {
			return;
		}


		maps.forEach((map) => {

			const location =
				map.dataset.location ||
				map.dataset.address ||
				'';


			if (!location) {
				return;
			}


			const loading =
				document.createElement(
					'div'
				);

			loading.className =
				'gym-review-map__loading';

			loading.textContent =
				'Loading map';


			map.appendChild(
				loading
			);


			const iframe =
				document.createElement(
					'iframe'
				);


			iframe.title =
				`Map showing ${location}`;

			iframe.loading =
				'lazy';

			iframe.referrerPolicy =
				'no-referrer-when-downgrade';

			iframe.setAttribute(
				'allowfullscreen',
				''
			);


			iframe.src =
				'https://www.google.com/maps?' +
				'q=' +
				encodeURIComponent(location) +
				'&output=embed';


			iframe.addEventListener(
				'load',
				() => {

					loading.remove();
				}
			);


			map.appendChild(
				iframe
			);
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

	const initialiseDirections = () => {

		const links =
			document.querySelectorAll(
				'[data-map-url]'
			);


		links.forEach((link) => {

			const url =
				link.dataset.mapUrl;


			if (!url) {
				return;
			}


			link.href =
				url;

			link.target =
				'_blank';

			link.rel =
				'noopener noreferrer';
		});
	};


	// ================================================================
	// GALLERY LIGHTBOX
	// ================================================================

	const initialiseGalleryLightbox = () => {

		const images =
			Array.from(
				document.querySelectorAll(
					'.gym-review-gallery figure img'
				)
			);


		if (!images.length) {
			return;
		}


		const lightbox =
			document.createElement(
				'div'
			);

		lightbox.className =
			'gym-review-lightbox';

		lightbox.setAttribute(
			'aria-hidden',
			'true'
		);

		lightbox.setAttribute(
			'role',
			'dialog'
		);

		lightbox.setAttribute(
			'aria-modal',
			'true'
		);


		lightbox.innerHTML = `
			<button
				type="button"
				class="gym-review-lightbox__close"
				aria-label="Close image"
			>
				×
			</button>

			<button
				type="button"
				class="gym-review-lightbox__prev"
				aria-label="Previous image"
			>
				←
			</button>

			<img
				class="gym-review-lightbox__image"
				src=""
				alt=""
			>

			<button
				type="button"
				class="gym-review-lightbox__next"
				aria-label="Next image"
			>
				→
			</button>
		`;


		document.body.appendChild(
			lightbox
		);


		const lightboxImage =
			lightbox.querySelector(
				'.gym-review-lightbox__image'
			);

		const closeButton =
			lightbox.querySelector(
				'.gym-review-lightbox__close'
			);

		const previousButton =
			lightbox.querySelector(
				'.gym-review-lightbox__prev'
			);

		const nextButton =
			lightbox.querySelector(
				'.gym-review-lightbox__next'
			);


		let currentIndex =
			0;


		const getFullSource = (image) => {

			return (
				image.dataset.full ||
				image.currentSrc ||
				image.src
			);
		};


		const render = () => {

			const image =
				images[currentIndex];


			lightboxImage.src =
				getFullSource(image);

			lightboxImage.alt =
				image.alt || '';
		};


		const open = (index) => {

			currentIndex =
				index;

			render();


			lightbox.classList.add(
				'is-open'
			);

			lightbox.setAttribute(
				'aria-hidden',
				'false'
			);

			body.classList.add(
				'gym-lightbox-open'
			);


			closeButton.focus();
		};


		const close = () => {

			lightbox.classList.remove(
				'is-open'
			);

			lightbox.setAttribute(
				'aria-hidden',
				'true'
			);

			body.classList.remove(
				'gym-lightbox-open'
			);
		};


		const previous = () => {

			currentIndex =
				(
					currentIndex -
					1 +
					images.length
				) %
				images.length;

			render();
		};


		const next = () => {

			currentIndex =
				(
					currentIndex +
					1
				) %
				images.length;

			render();
		};


		images.forEach(
			(image, index) => {

				const figure =
					image.closest(
						'figure'
					);


				if (!figure) {
					return;
				}


				figure.tabIndex =
					0;

				figure.setAttribute(
					'role',
					'button'
				);

				figure.setAttribute(
					'aria-label',
					`View image ${index + 1} of ${images.length}`
				);


				figure.addEventListener(
					'click',
					() => {

						open(index);
					}
				);


				figure.addEventListener(
					'keydown',
					(event) => {

						if (
							event.key === 'Enter' ||
							event.key === ' '
						) {

							event.preventDefault();

							open(index);
						}
					}
				);
			}
		);


		closeButton.addEventListener(
			'click',
			close
		);

		previousButton.addEventListener(
			'click',
			previous
		);

		nextButton.addEventListener(
			'click',
			next
		);


		lightbox.addEventListener(
			'click',
			(event) => {

				if (
					event.target ===
					lightbox
				) {

					close();
				}
			}
		);


		document.addEventListener(
			'keydown',
			(event) => {

				if (
					!lightbox.classList.contains(
						'is-open'
					)
				) {
					return;
				}


				switch (
					event.key
				) {

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
			}
		);
	};


	// ================================================================
	// MOBILE GALLERY DOTS
	// ================================================================

	const initialiseGalleryProgress = () => {

		const viewport =
			document.querySelector(
				'.gym-review-gallery__viewport'
			);


		if (!viewport) {
			return;
		}


		const slides =
			Array.from(
				viewport.querySelectorAll(
					'figure'
				)
			);


		if (slides.length < 2) {
			return;
		}


		let controls =
			document.querySelector(
				'.gym-review-gallery__controls'
			);


		if (!controls) {

			controls =
				document.createElement(
					'div'
				);

			controls.className =
				'gym-review-gallery__controls';

			viewport.insertAdjacentElement(
				'afterend',
				controls
			);
		}


		controls.innerHTML =
			'';


		const dots =
			slides.map(
				(_, index) => {

					const button =
						document.createElement(
							'button'
						);

					button.type =
						'button';

					button.className =
						'gym-review-gallery__dot';

					button.setAttribute(
						'aria-label',
						`Go to image ${index + 1}`
					);


					if (index === 0) {

						button.classList.add(
							'is-active'
						);
					}


					button.addEventListener(
						'click',
						() => {

							slides[index]
								.scrollIntoView(
									{
										behavior:
											reduceMotion
												? 'auto'
												: 'smooth',

										inline:
											'start',

										block:
											'nearest'
									}
								);
						}
					);


					controls.appendChild(
						button
					);


					return button;
				}
			);


		if (
			!('IntersectionObserver' in window)
		) {
			return;
		}


		const observer =
			new IntersectionObserver(

				(entries) => {

					const visible =
						entries
							.filter(
								(entry) =>
									entry.isIntersecting
							)
							.sort(
								(a, b) =>
									b.intersectionRatio -
									a.intersectionRatio
							);


					if (!visible.length) {
						return;
					}


					const index =
						slides.indexOf(
							visible[0].target
						);


					dots.forEach(
						(dot, dotIndex) => {

							dot.classList.toggle(
								'is-active',
								dotIndex === index
							);
						}
					);
				},

				{
					root: viewport,
					threshold: [
						0.45,
						0.6,
						0.75
					]
				}
			);


		slides.forEach(
			(slide) => {

				observer.observe(slide);
			}
		);
	};


	// ================================================================
	// SCORE LABELS
	// ================================================================

	const getScoreLabel = score => gymOverallBand(score).label;


	const initialiseScoreLabels = () => {

		const containers =
			document.querySelectorAll(
				'[data-score-label-source]'
			);


		containers.forEach(
			(element) => {

				const score =
					parseFloat(
						element.dataset
							.scoreLabelSource
					);


				if (!Number.isFinite(score)) {
					return;
				}


				element.textContent =
					getScoreLabel(score);
				element.style.color = gymOverallBand(score).color;
			}
		);
	};


	// ================================================================
	// INITIALISE
	// ================================================================

	const initialise = () => {

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


	if (
		document.readyState ===
		'loading'
	) {

		document.addEventListener(
			'DOMContentLoaded',
			initialise,
			{
				once: true
			}
		);

	} else {

		initialise();
	}

})();

})();


// Homepage only: one entrance, then gentle pointer depth while in view.
function initHomepageHeroMotion() {
  if (!document.body.matches('.is-frontend.page-template-page-homepage')) return;
  const hero = document.querySelector('#main .hero-background');
  const background = hero?.querySelector(':scope > img');
  const portrait = hero?.querySelector('.hero-foreground > img');
  if (!hero || !background || !portrait || hero.dataset.motionInit) return;
  hero.dataset.motionInit = 'true';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 992px) and (hover: hover) and (pointer: fine)');
  let visible = false;
  let entered = false;
  let frame = 0;
  let lastTime = 0;
  let scrollFrame = 0;
  let x = 0, y = 0, targetX = 0, targetY = 0;
  const animations = new Set();

  const enabled = () => entered && visible && !document.hidden && !reduced.matches && desktop.matches;
  const paint = () => {
    background.style.setProperty('--hero-depth-x', `${(x * 6).toFixed(3)}px`);
    background.style.setProperty('--hero-depth-y', `${(y * 6).toFixed(3)}px`);
    portrait.style.setProperty('--hero-depth-x', `${(x * 2).toFixed(3)}px`);
    portrait.style.setProperty('--hero-depth-y', `${(y * 2).toFixed(3)}px`);
  };
  const paintScroll = () => {
    scrollFrame = 0;
    const rect = hero.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height)));
    const offset = visible && !document.hidden && !reduced.matches
      ? -progress * (desktop.matches ? 160 : 36) : 0;
    portrait.style.setProperty('--hero-scroll-y', `${offset.toFixed(3)}px`);
    const glowOffset = visible && !document.hidden && !reduced.matches
      ? progress * (desktop.matches ? 70 : 24) : 0;
    hero.style.setProperty('--hero-glow-y', `${glowOffset.toFixed(3)}px`);
  };
  const scheduleScroll = () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(paintScroll);
  };
  const reset = () => {
    cancelAnimationFrame(frame);
    frame = lastTime = 0;
    x = y = targetX = targetY = 0;
    paint();
    hero.classList.remove('hero-depth-active');
  };
  const tick = time => {
    frame = 0;
    if (!enabled()) { reset(); return; }
    const dt = lastTime ? Math.min(64, time - lastTime) : 16;
    lastTime = time;
    const smoothing = 1 - Math.exp(-dt / 160);
    x += (targetX - x) * smoothing;
    y += (targetY - y) * smoothing;
    paint();
    if (Math.abs(targetX - x) + Math.abs(targetY - y) > .001) {
      frame = requestAnimationFrame(tick);
    } else {
      x = targetX; y = targetY; paint(); lastTime = 0;
      if (!targetX && !targetY) hero.classList.remove('hero-depth-active');
    }
  };
  const schedule = () => {
    if (enabled() && !frame) frame = requestAnimationFrame(tick);
  };
  const stopEntrance = () => {
    animations.forEach(animation => animation.cancel());
    animations.clear();
    entered = true;
    hero.classList.remove('hero-entering');
    scheduleScroll();
  };
  const entrance = () => {
    if (entered || hero.classList.contains('hero-entering')) return;
    if (reduced.matches || typeof portrait.animate !== 'function') { entered = true; return; }
    hero.classList.add('hero-entering');
    const opacity = getComputedStyle(portrait).opacity;
    const bgAnimation = background.animate([
      {filter: 'brightness(.38)'}, {filter: 'brightness(.55)'}
    ], {duration: 1800, easing: 'cubic-bezier(.22,1,.36,1)'});
    const portraitAnimation = portrait.animate([
      {opacity: 0, translate: '0 12px'},
      {opacity, translate: '0 0'}
    ], {duration: 1200, delay: 100, fill: 'backwards', easing: 'cubic-bezier(.22,1,.36,1)'});
    animations.add(bgAnimation); animations.add(portraitAnimation);
    Promise.allSettled([bgAnimation.finished, portraitAnimation.finished]).then(stopEntrance);
  };

  // Wait for actual image pixels, without ever hiding essential hero copy.
  Promise.allSettled([background, portrait].map(img => img.decode?.())).then(() => {
    hero.classList.add('hero-motion-ready');
    if (visible && !document.hidden) entrance();
  });
  hero.addEventListener('pointermove', event => {
    if (!enabled() || event.pointerType !== 'mouse') return;
    const rect = hero.getBoundingClientRect();
    targetX = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    targetY = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    hero.classList.add('hero-depth-active');
    schedule();
  }, {passive: true});
  hero.addEventListener('pointerleave', () => { targetX = targetY = 0; schedule(); }, {passive: true});
  const refresh = () => {
    scheduleScroll();
    if (!enabled()) reset();
    if (reduced.matches || document.hidden) stopEntrance();
    if (visible && !document.hidden && hero.classList.contains('hero-motion-ready')) entrance();
  };
  reduced.addEventListener('change', refresh);
  desktop.addEventListener('change', refresh);
  document.addEventListener('visibilitychange', refresh);
  window.addEventListener('scroll', scheduleScroll, {passive: true});
  window.addEventListener('resize', () => { reset(); scheduleScroll(); }, {passive: true});
  window.addEventListener('pagehide', () => { reset(); stopEntrance(); cancelAnimationFrame(scrollFrame); scrollFrame = 0; portrait.style.setProperty('--hero-scroll-y', '0px'); hero.style.setProperty('--hero-glow-y', '0px'); });
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    refresh();
  }, {threshold: 0});
  observer.observe(hero);
}
document.addEventListener('DOMContentLoaded', initHomepageHeroMotion);
