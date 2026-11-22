import "./network-media-refinements";
import "./pulse-scenes";
/** Scoped scenes and one-time entrances; all essential content is visible without JS. */
function editorialRefinements() {
	Promise.resolve(window.dxPageReady).then(() => {
		const reduced = matchMedia('(prefers-reduced-motion: reduce)');
		const reveal = elements => {
			if (!('IntersectionObserver' in window) || reduced.matches) return;
			const observer = new IntersectionObserver(entries => entries.forEach(entry => {
				if (!entry.isIntersecting) return;
				observer.unobserve(entry.target);
				if (entry.target.dataset.editorialEntered) return;
				entry.target.dataset.editorialEntered = 'true';
				if (reduced.matches) return;
				entry.target.animate([{ opacity: 0, translate: '0 28px' }, { opacity: 1, translate: '0 0' }], { duration: 850, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
			}), { threshold: .08 });
			elements.forEach(el => observer.observe(el));
		};
		reveal(document.querySelectorAll('.dx-fitness .dxf-story-media > figure, .dx-app-entry .dx-app-teaser__art'));
		// An embed can resize after arriving in view. Keep essential Instagram content
		// visible throughout its entrance rather than fading an already visible section out.
		if ('IntersectionObserver' in window && !reduced.matches) {
			const instagramEntrance = new IntersectionObserver(entries => entries.forEach(entry => {
				if (!entry.isIntersecting) return;
				instagramEntrance.unobserve(entry.target);
				if (reduced.matches) return;
				entry.target.querySelector('.dx-instagram__intro')?.animate(
					[{ translate: '0 20px' }, { translate: '0 0' }],
					{ duration: 850, easing: 'cubic-bezier(.22,1,.36,1)' }
				);
			}), { threshold: 0 });
			document.querySelectorAll('.dx-instagram').forEach(section => instagramEntrance.observe(section));
		}

		reveal(document.querySelectorAll('.dx-pulse .dx-pulse-hero .dx-pulse-wrap > *, .dx-pulse .dx-pulse-feature, .dx-pulse .dx-pulse-card, .dx-pulse .dx-pulse-section-heading, .dx-pulse .dx-pulse-filters, .dx-pulse .dx-pulse-empty, .dx-pulse-teaser-heading > *, .dx-pulse-teaser-invite > *, .dx-pulse-teaser-art'));
		document.addEventListener('dx:pulse-results', event => reveal(event.target.querySelectorAll('.dx-pulse-card, .dx-pulse-empty')));
		const heroes = [...document.querySelectorAll('.dx-pulse-hero')];
		if (heroes.length) {
			let frame;
			const paint = () => {
				frame = 0;
				heroes.forEach(hero => {
					const rect = hero.getBoundingClientRect();
					if (rect.bottom < 0 || rect.top > innerHeight) return;
					hero.style.setProperty('--pulse-parallax', reduced.matches ? '0px' : `${Math.min(100, Math.max(-50, -rect.top * .16))}px`);
				});
			};
			const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
			addEventListener('scroll', schedule, { passive: true });
			addEventListener('resize', schedule, { passive: true });
			reduced.addEventListener('change', schedule);
			paint();
		}

		const stage = document.querySelector('body.home .services-tabs');
		if (stage && !stage.dataset.blendedScenes) {
			stage.dataset.blendedScenes = 'true';
			const scene = document.createElement('div');
			scene.className = 'dx-service-scene';
			scene.setAttribute('aria-hidden', 'true');
			const layers = new Map();
			stage.querySelectorAll('.tab-pane').forEach(pane => {
				const source = pane.querySelector('img.foreground');
				if (!source) return;
				const image = source.cloneNode();
				image.className = 'dx-service-scene-layer';
				image.alt = '';
				image.removeAttribute('id');
				image.loading = 'lazy';
				image.sizes = '100vw';
				image.classList.toggle('is-active', pane.classList.contains('active'));
				layers.set(pane.id, image);
				scene.append(image);
			});
			stage.prepend(scene);
			stage.addEventListener('show.bs.tab', event => {
				const id = event.target.getAttribute('data-bs-target')?.slice(1);
				layers.forEach((layer, key) => layer.classList.toggle('is-active', key === id));
			});
		}
	});
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', editorialRefinements, { once: true });
else editorialRefinements();
