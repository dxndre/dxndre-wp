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

	// Duplicate Footnotes at runtime 

	document.addEventListener('DOMContentLoaded', () => {
		const track = document.querySelector('.footline-track');
		const item = track?.querySelector('.footline');

		if (!track || !item) return;

		const DUPLICATES = 2;

		for (let i = 0; i < DUPLICATES; i++) {
			track.appendChild(item.cloneNode(true));
		}
	});

	// Remove 'collapsing' class from navbar 

	document.addEventListener('DOMContentLoaded', () => {
		const navbar = document.getElementById('navbar');
		if (!navbar) return;

		navbar.addEventListener('show.bs.collapse', () => {
			requestAnimationFrame(() => {
				navbar.classList.remove('collapsing');
			});
		});
	});

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

				const modal = bootstrap.Modal.getOrCreateInstance(modalEl, {
					backdrop: 'static',
					focus: true
				});

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
	})
();

