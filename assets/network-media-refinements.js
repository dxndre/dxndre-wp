const initNetworkMedia = () => Promise.resolve(window.dxPageReady).then(() => {
 document.querySelectorAll('.dxf-story-media > figure').forEach(figure => {
  const media = figure.querySelector('img,video');
  if (!media) return;
  const paint = () => {
   const src = media.tagName === 'VIDEO' ? media.poster : media.currentSrc || media.src;
   if (src) figure.style.setProperty('--story-media-glow', `url(${JSON.stringify(src)})`);
  };
  paint(); media.addEventListener('load', paint);
 });
 const hero = document.querySelector('.dxb:not(.dxbus-app) .dxb-hero');
 const backdrop = hero?.closest('.dxb')?.querySelector('.dxb-hero-media');
 if (!hero || !backdrop || matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData) return;
 const mountVideo = (scene, surface) => {
 let video, visible = false, scheduled = false;
 const sync = () => {
  if (!video) return;
  if (visible && !document.hidden) video.play().catch(() => {});
  else video.pause();
 };
 const load = () => {
  if (!visible || video) { scheduled = false; return; }
  video = document.createElement('video');
  video.className = 'dxb-deferred-hero-video';
  video.muted = true; video.loop = true; video.playsInline = true;
  video.preload = 'none'; video.setAttribute('aria-hidden', 'true'); video.tabIndex = -1;
  video.addEventListener('playing', () => {
   const reveal = () => { video.classList.add('is-ready'); surface.classList.add('has-ready-video'); };
   if (video.requestVideoFrameCallback) video.requestVideoFrameCallback(reveal);
   else requestAnimationFrame(reveal);
  }, {once:true});
  const css = document.querySelector('link[href*="/themes/dxndre/build/"]');
  if (!css) return;
  video.src = new URL('../assets/video/buses-long.mp4', css.href).href;
  surface.append(video); sync();
 };
 const observer = new IntersectionObserver(entries => {
  visible = entries[0].isIntersecting;
  if (visible && !video && !scheduled) {
   scheduled = true;
   // Wait for the page entrance and an idle slot before requesting video bytes.
   setTimeout(() => window.requestIdleCallback ? requestIdleCallback(load, {timeout:2000}) : load(), 1200);
  }
  sync();
 }, {threshold:0});
 observer.observe(scene); document.addEventListener('visibilitychange', sync);
 };
 mountVideo(hero, backdrop);
 const interludes = [...document.querySelectorAll('.dxb-video-interlude')];
 interludes.forEach(scene => mountVideo(scene, scene));
 let parallaxFrame = 0;
 const paintParallax = () => {
  parallaxFrame = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  interludes.forEach(scene => {
   const bounds = scene.getBoundingClientRect();
   if (!reduced && (bounds.bottom < 0 || bounds.top > innerHeight)) return;
   const offset = reduced ? 0 : Math.max(-bounds.height * .12, Math.min(bounds.height * .12, (innerHeight / 2 - bounds.top - bounds.height / 2) * .2));
   scene.style.setProperty('--bus-film-offset', `${offset.toFixed(2)}px`);
  });
 };
 const scheduleParallax = () => { if (!parallaxFrame) parallaxFrame = requestAnimationFrame(paintParallax); };
 addEventListener('scroll', scheduleParallax, {passive:true});
 addEventListener('resize', scheduleParallax);
 matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', scheduleParallax);
 paintParallax();
});
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initNetworkMedia, {once:true});
else initNetworkMedia();
