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
		// Prevent double-init (bfcache / partial reload)
		if (document.body.dataset.storyInit === 'true') return;
		document.body.dataset.storyInit = 'true';

		const chaptersWrapper = document.querySelector('.chapters-wrapper');
		const storySections   = [...document.querySelectorAll('.story-section')];
		const chapterWrap     = document.querySelector('.chapter-selector');
		const chapterNav      = chapterWrap?.querySelector('ul');

		// Safety exit
		if (!chaptersWrapper || !storySections.length || !chapterNav) return;

		// -----------------------------
		// URL hash control (prevents auto #chapter-1 on load)
		// -----------------------------
		let hasUserEnteredStory = false;
		const hadInitialHash = !!window.location.hash;

		// -----------------------------
		// 1) Build chapter selector
		// -----------------------------
		chapterNav.innerHTML = '';

		const chapterMeta = storySections
			.map(section => {
				const chapterEl = section.querySelector('.cs-chapter[id]');
				const titleEl   = chapterEl?.querySelector('h2.chapter-title');
				if (!chapterEl || !titleEl) return null;
				return { section, id: chapterEl.id, title: titleEl.textContent.trim() };
			})
			.filter(Boolean);

		// If only 1 chapter, remove selector UI
		if (chapterMeta.length <= 1) {
			chapterWrap?.remove();
			return;
		}

		chapterMeta.forEach(({ id, title }) => {
			const li = document.createElement('li');
			li.dataset.target = id;
			li.innerHTML = `<span>${title}</span>`;
			chapterNav.appendChild(li);
		});

		const chapterLinks = [...chapterNav.querySelectorAll('li')];

		// Progress bar (optional)
		let progressBar = chapterWrap.querySelector('.chapter-progress span');
		if (!progressBar) {
			const progress = document.createElement('div');
			progress.className = 'chapter-progress';
			progress.innerHTML = `<span></span>`;
			chapterWrap.appendChild(progress);
			progressBar = progress.querySelector('span');
		}

		// -----------------------------
		// Helpers
		// -----------------------------
		const getBgLayers = () => [...document.querySelectorAll('.story-backgrounds .bg')];

		const setActiveBackground = (id) => {
			if (!id) return;
			const layers = getBgLayers();
			if (!layers.length) return;

			layers.forEach(bg => {
				bg.classList.toggle('is-active', bg.dataset.bg === id);
			});
		};

		const setActive = (index) => {
			const item = chapterMeta[index];
			if (!item) return;

			// section highlight
			storySections.forEach(s => s.classList.remove('viewport-active'));
			item.section.classList.add('viewport-active');

			// selector highlight
			chapterLinks.forEach(link => {
				link.classList.toggle('is-active', link.dataset.target === item.id);
			});

			document.body.classList.add('is-in-chapters');

			// URL hash (only update after the user reaches the story,
			// OR if they landed directly on a hash)
			if ((hasUserEnteredStory || hadInitialHash) && window.location.hash !== `#${item.id}`) {
				history.replaceState(null, '', `#${item.id}`);
			}

			// backgrounds
			setActiveBackground(item.id);

			// progress
			const pct = ((index + 1) / chapterMeta.length);
			progressBar.style.transform = `scaleY(${pct})`;
		};

		const snapTo = (index) => {
			const item = chapterMeta[index];
			if (!item) return;
			item.section.scrollIntoView({ behavior: 'smooth', block: 'start' });
		};

		// -----------------------------
		// 2) Simple "in story" state (10vh scroll trigger)
		// Uses #main as the scroll container on single project pages
		// -----------------------------
		const scrollContainer = document.querySelector('#main') || window;

		const getScrollTop = () => {
			if (scrollContainer === window) {
				return window.scrollY || window.pageYOffset || 0;
			}

			return scrollContainer.scrollTop || 0;
		};

		const getViewportHeight = () => {
			if (scrollContainer === window) {
				return window.innerHeight;
			}

			return scrollContainer.clientHeight || window.innerHeight;
		};

		const updateStoryState = () => {
			const threshold = getViewportHeight() * 0.10; // 10vh
			const inStory = getScrollTop() >= threshold;

			document.body.classList.toggle('is-in-story', inStory);

			if (inStory) {
				hasUserEnteredStory = true;
			}
		};

		scrollContainer.addEventListener('scroll', updateStoryState, { passive: true });
		window.addEventListener('resize', updateStoryState, { passive: true });

		// Run once on load
		updateStoryState();

				// -----------------------------
				// 2b) Chapter selector visibility
				// -----------------------------
				const updateChapterSelectorState = () => {
					const rect = chaptersWrapper.getBoundingClientRect();
					const viewportH = window.innerHeight;

					const isVisible =
						rect.top < viewportH * 0.85 &&
						rect.bottom > viewportH * 0.15;

					document.body.classList.toggle('is-in-chapters', isVisible);
				};

				window.addEventListener('scroll', updateChapterSelectorState, { passive: true });
				window.addEventListener('resize', updateChapterSelectorState, { passive: true });

				// Run once on load
				updateChapterSelectorState();

		// -----------------------------
		// 3) Active section detection (single observer)
		// -----------------------------
		let activeIndex = 0;

		const ratioMap = new Map();

		const activeObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach(entry => {
					ratioMap.set(entry.target, entry.intersectionRatio);
				});

				let best = null;
				let bestRatio = 0;

				ratioMap.forEach((ratio, el) => {
					if (ratio > bestRatio) {
						bestRatio = ratio;
						best = el;
					}
				});

				if (!best || bestRatio < 0.35) return;

				const idx = chapterMeta.findIndex(x => x.section === best);
				if (idx !== -1 && idx !== activeIndex) {
					activeIndex = idx;
					setActive(activeIndex);
				}
			},
			{ threshold: [0, 0.25, 0.35, 0.5, 0.75] }
		);

		storySections.forEach(section => activeObserver.observe(section));

		// -----------------------------
		// 4) Click navigation
		// -----------------------------
		chapterLinks.forEach((link, idx) => {
			link.addEventListener('click', () => {
				activeIndex = idx;
				setActive(activeIndex);
				snapTo(activeIndex);
			});
		});

		// -----------------------------
		// 5) Optional wheel/keyboard snapping (kept simple)
		// -----------------------------
		let isSnapping = false;

		const doSnap = (nextIdx) => {
			if (isSnapping) return;
			if (nextIdx < 0 || nextIdx >= chapterMeta.length) return;

			isSnapping = true;
			activeIndex = nextIdx;
			setActive(activeIndex);
			snapTo(activeIndex);

			setTimeout(() => { isSnapping = false; }, 700);
		};

		window.addEventListener('wheel', (e) => {
			if (!document.body.classList.contains('is-in-story')) return;
			if (Math.abs(e.deltaY) < 40) return;
			if (isSnapping) return;

			const rect = chaptersWrapper.getBoundingClientRect();
			if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;

			const nextIdx = e.deltaY > 0 ? activeIndex + 1 : activeIndex - 1;

			// Let normal page scrolling continue if we're at the boundaries
			if (nextIdx < 0 || nextIdx >= chapterMeta.length) return;

			e.preventDefault();
			doSnap(nextIdx);
		}, { passive: false });

		window.addEventListener('keydown', (e) => {
			if (!document.body.classList.contains('is-in-story')) return;

			const tag = document.activeElement?.tagName;
			if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;

			if (['ArrowDown', 'PageDown'].includes(e.key)) {
				e.preventDefault();
				doSnap(activeIndex + 1);
			}
			if (['ArrowUp', 'PageUp'].includes(e.key)) {
				e.preventDefault();
				doSnap(activeIndex - 1);
			}
		});

		// -----------------------------
		// 6) Initial state
		// -----------------------------
		// If you land on a hash, start there.
		// Otherwise: do NOT force-set active (prevents #chapter-1 on load).
		const startId = window.location.hash?.replace('#', '');
		const startIdx = startId
			? chapterMeta.findIndex(x => x.id === startId)
			: 0;

		activeIndex = startIdx >= 0 ? startIdx : 0;

		if (hadInitialHash) {
			setActive(activeIndex);
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

		const grid     = archive.querySelector('[data-gyms-grid]');
		const search   = archive.querySelector('[data-gym-search]');
		const sortSel  = archive.querySelector('[data-gym-sort]');
		const buttons  = [...archive.querySelectorAll('.gym-filter-buttons button')];
		const viewBtns = [...archive.querySelectorAll('[data-gym-view]')];
		const titleEl  = archive.querySelector('[data-gyms-state-title]');
		const emptyEl  = archive.querySelector('[data-gyms-empty]');
		const loadMore = archive.querySelector('[data-gyms-load-more]');
		const notesCb  = archive.querySelector('[data-gym-toggle-notes]');

		if (!grid) return;

		const allCards = [...grid.querySelectorAll('[data-gym-card]')];

		const LABELS = {
			all: 'All',
			davidlloyds: 'David Lloyd',
			puregym: 'PureGym',
			virginactive: 'Virgin Active',
			bodyworks: 'Bodyworks Gym',
			thegymgroup: 'The Gym Group',
			other: 'Other',
		};

		let activeChain = buttons.find(btn => btn.classList.contains('is-active'))?.dataset.chain || 'all';
		let visibleCount = 6;

		const getBranch = (el) =>
			(el.getAttribute('data-branch') || '').trim().toLowerCase();

		const getOverall = (el) =>
			parseFloat(el.getAttribute('data-overall')) || 0;

		const getVisitedTs = (el) =>
			parseInt(el.getAttribute('data-visited-ts'), 10) || 0;

		const updateTitle = () => {
			if (!titleEl) return;
			titleEl.textContent = LABELS[activeChain] || 'All';
		};

		const sortCards = (cards) => {
			const mode = sortSel?.value || 'overall_desc';
			const sorted = [...cards];

			sorted.sort((a, b) => {
				const aBranch  = getBranch(a);
				const bBranch  = getBranch(b);
				const aOverall = getOverall(a);
				const bOverall = getOverall(b);
				const aDate    = getVisitedTs(a);
				const bDate    = getVisitedTs(b);

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

		const update = () => {
			const q = (search?.value || '').trim().toLowerCase();

			const eligible = allCards.filter(card => {
				const chain = card.getAttribute('data-chain') || 'unknown';
				const chainOk = activeChain === 'all' || chain === activeChain;

				const haystack = (card.getAttribute('data-search') || '').toLowerCase();
				const searchOk = !q || haystack.includes(q);

				return chainOk && searchOk;
			});

			const ordered = sortCards(eligible);

			ordered.forEach(card => grid.appendChild(card));

			allCards.forEach(card => {
				card.hidden = true;
			});

			ordered.slice(0, visibleCount).forEach(card => {
				card.hidden = false;
			});

			if (emptyEl) {
				emptyEl.hidden = ordered.length !== 0;
			}

			if (loadMore) {
				loadMore.hidden = ordered.length <= visibleCount;
			}

			updateTitle();
		};

		buttons.forEach(btn => {
			btn.addEventListener('click', () => {
				buttons.forEach(b => b.classList.remove('is-active'));
				btn.classList.add('is-active');

				activeChain = btn.dataset.chain || 'all';
				visibleCount = 6;
				update();
			});
		});

		search?.addEventListener('input', () => {
			visibleCount = 6;
			update();
		});

		sortSel?.addEventListener('change', () => {
			visibleCount = 6;
			update();
		});

		loadMore?.addEventListener('click', () => {
			visibleCount += 6;
			update();
		});

		viewBtns.forEach(btn => {
			btn.addEventListener('click', () => {
				viewBtns.forEach(b => b.classList.remove('is-active'));
				btn.classList.add('is-active');

				const view = btn.getAttribute('data-gym-view') || 'cards';
				archive.setAttribute('data-view', view);
			});
		});

		// Notes toggle
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

		const initialViewBtn = viewBtns.find(btn => btn.classList.contains('is-active'));
		archive.setAttribute('data-view', initialViewBtn?.getAttribute('data-gym-view') || 'cards');

		update();
	})();

	/* ==========================
	GYM VIEWPORT-ACTIVE (DEDICATED)
	========================== */

	document.addEventListener('DOMContentLoaded', () => {
		const archive = document.querySelector('[data-gyms-archive]');
		if (!archive) return;

		// Use nearest section as the thing we toggle
		const section = archive.closest('section') || archive;

		const observer = new IntersectionObserver(
			([entry]) => {
				section.classList.toggle('viewport-active', entry.isIntersecting);
			},
			{
				threshold: 0.05,
				rootMargin: '-10% 0px -10% 0px'
			}
		);

		observer.observe(archive);
	});

})();

