/** Fixed poll atmosphere and server-rendered archive filtering. */
function startPulseScenes() {
	Promise.resolve(window.dxPageReady).then(() => {
		const root = document.querySelector('.dx-pulse[data-pulse-stats]');
		if (!root) return;
		const motion = matchMedia('(prefers-reduced-motion: reduce)');
		const sections = [...root.querySelectorAll('.dx-pulse-hero, .dx-pulse-feature, .dx-pulse-section')];
		const palette = [['#54344245', '#28515c45'], ['#64433250', '#294b4f50'], ['#50334c48', '#23534d48'], ['#2e3c5e48', '#5c423248'], ['#4e355348', '#28585248']];
		const canvas = document.createElement('div');
		canvas.className = 'dx-pulse-scenes';
		canvas.setAttribute('aria-hidden', 'true');
		const layers = sections.map((_, index) => {
			const layer = document.createElement('div');
			layer.className = 'dx-pulse-scene';
			const colours = palette[index % palette.length];
			layer.style.setProperty('--pulse-scene-a', colours[0]);
			layer.style.setProperty('--pulse-scene-b', colours[1]);
			canvas.append(layer);
			return layer;
		});
		root.prepend(canvas);
		let frame = 0;
		let active = -1;
		const paint = () => {
			frame = 0;
			const bounds = root.getBoundingClientRect();
			canvas.style.visibility = bounds.bottom <= 0 || bounds.top >= innerHeight ? 'hidden' : 'visible';
			let next = 0;
			sections.forEach((section, index) => { if (section.getBoundingClientRect().top <= innerHeight * .5) next = index; });
			if (next === active) return;
			active = next;
			root.dataset.pulseScene = String(next);
			layers.forEach((layer, index) => layer.classList.toggle('is-active', index === next));
		};
		const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
		addEventListener('scroll', schedule, { passive: true });
		addEventListener('resize', schedule, { passive: true });
		paint();

		const hero = root.querySelector('.dx-pulse-hero');
		const bus = hero?.querySelector('.dx-pulse-hero-image img');
		if (bus) {
			const enter = async () => {
				if (bus.dataset.entrancePlayed) return;
				bus.dataset.entrancePlayed = 'true';
				try { await bus.decode(); } catch (_) { /* Keep the available image visible. */ }
				if (!motion.matches) bus.animate([{ opacity: 0, transform: 'translate3d(55px, 24px, 0) scale(.94)' }, { opacity: .85, transform: 'none' }], { duration: 1450, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
			};
			if ('IntersectionObserver' in window) {
				const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); enter(); } }, { threshold: .1 });
				observer.observe(hero);
			} else enter();
		}

		const archive = root.querySelector('#pulse-archive');
		const form = archive?.querySelector('.dx-pulse-filters');
		const results = archive?.querySelector('[data-pulse-archive-results]');
		if (!form || !results) return;
		// Restore server-selected defaults rather than stale browser-restored controls.
		form.reset();
		const submit = form.querySelector('[type=submit]');
		const feedback = document.createElement('p');
		feedback.className = 'dx-pulse-filter-feedback';
		feedback.setAttribute('role', 'status');
		feedback.hidden = true;
		form.append(feedback);
		let controller;
		const load = async (url, push = true, restore = false) => {
			controller?.abort();
			const request = new AbortController();
			controller = request;
			results.setAttribute('aria-busy', 'true');
			submit.disabled = true;
			feedback.classList.remove('screen-reader-text');
			feedback.hidden = false;
			feedback.textContent = 'Finding polls…';
			try {
				const response = await fetch(url, { signal: request.signal, credentials: 'same-origin', cache: 'no-store', headers: { Accept: 'text/html' } });
				if (!response.ok) throw new Error('The filters could not be updated. Please try again.');
				const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
				const next = doc.querySelector('[data-pulse-archive-results]');
				if (!next || request.signal.aborted) throw new Error('The filters could not be updated. Please try again.');
				results.replaceChildren(...next.childNodes);
				if (restore) ['pulse_status', 'pulse_category', 'pulse_search'].forEach(name => { form.elements.namedItem(name).value = doc.querySelector(`.dx-pulse-filters [name="${name}"]`)?.value || ''; });
				if (push) history.pushState(null, '', url);
				feedback.textContent = archive.querySelector('.dx-pulse-archive-count')?.textContent || 'Polls updated.';
				feedback.classList.add('screen-reader-text');
				archive.dispatchEvent(new CustomEvent('dx:pulse-results', { bubbles: true }));
				schedule();
			} catch (error) {
				if (error.name !== 'AbortError') feedback.textContent = error.message || 'Unable to update polls. Please try again.';
			} finally {
				if (controller === request) { submit.disabled = false; results.removeAttribute('aria-busy'); }
			}
		};
		form.addEventListener('submit', event => {
			event.preventDefault();
			const url = new URL(form.action);
			url.search = new URLSearchParams(new FormData(form)).toString();
			load(url);
		});
		form.addEventListener('change', event => { if (event.target.matches('select')) form.requestSubmit(); });
		archive.addEventListener('click', event => {
			const link = event.target.closest('.dx-pulse-pagination a, .dx-pulse-empty a');
			if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
			event.preventDefault();
			load(new URL(link.href), true, true);
		});
		addEventListener('popstate', () => load(new URL(location.href), false, true));
	});
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startPulseScenes, { once: true });
else startPulseScenes();
