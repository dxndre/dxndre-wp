// Webpack Imports
import * as bootstrap from 'bootstrap';

(function () {
	'use strict';

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

	// Toggle `.scrolled` on `.navbar`
	function updateNavbarScrolled() {
		var nav = document.querySelector('.navbar');
		if (!nav) return;

		if (window.scrollY > 10) {
			nav.classList.add('scrolled');
		} else {
			nav.classList.remove('scrolled');
		}
	}

	document.addEventListener('scroll', updateNavbarScrolled, { passive: true });
	updateNavbarScrolled();

	document.addEventListener('DOMContentLoaded', () => {
		/* ==========================
		   NAVBAR OPEN STATE
		========================== */
		const navbar = document.getElementById('navbar');

		if (navbar) {
			navbar.addEventListener('shown.bs.collapse', () => {
				document.body.classList.add('nav-open');
			});

			navbar.addEventListener('hidden.bs.collapse', () => {
				document.body.classList.remove('nav-open');
			});
		}

		/* ==========================
		   VIEWPORT-ACTIVE SECTIONS
		========================== */
		const sections = document.querySelectorAll('section');

		const sectionObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						entry.target.classList.add('viewport-active');
					} else {
						entry.target.classList.remove('viewport-active');
					}
				});
			},
			{ threshold: 0.35 }
		);

		sections.forEach(section => sectionObserver.observe(section));

		/* ==========================
		   STAT COUNTER ANIMATION
		========================== */
		const counters = document.querySelectorAll('.stat-figure');

		const animateCounter = (el) => {
			const raw = el.textContent.trim();
			const hasPlus = raw.includes('+');
			const target = parseInt(raw.replace(/\D/g, ''), 10);

			let startTime = null;
			const duration = 1800;

			const tick = (timestamp) => {
				if (!startTime) startTime = timestamp;
				const progress = Math.min((timestamp - startTime) / duration, 1);
				const value = Math.floor(progress * target);

				el.textContent = value + (hasPlus ? '+' : '');

				if (progress < 1) {
					requestAnimationFrame(tick);
				} else {
					el.textContent = target + (hasPlus ? '+' : '');
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
	});
})();