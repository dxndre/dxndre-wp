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
})();