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
					// The case study page manages these with its own controller
					if (entry.target.classList.contains('story-section') || entry.target.classList.contains('story-hero')) {
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
		CASE STUDY: STORY CONTROLLER (FINAL)
		========================== */

		(() => {
			const hero = document.querySelector('.story-hero');
			const chaptersWrapper = document.querySelector('.chapters-wrapper');
			const storySections = [...document.querySelectorAll('.story-section')];
			const chapterWrap = document.querySelector('.chapter-selector');
			const chapterNav = chapterWrap?.querySelector('ul');

			// Safety exit
			if (!hero || !chaptersWrapper || !storySections.length || !chapterNav) return;

			/* --------------------------------
			1. Build chapter selector dynamically
			-------------------------------- */

			chapterNav.innerHTML = '';

			const chapters = storySections
				.map(section => section.querySelector('.cs-chapter'))
				.filter(Boolean);

			chapters.forEach(chapter => {
				const heading = chapter.querySelector('h2.chapter-title');
				if (!heading || !chapter.id) return;

				const li = document.createElement('li');
				li.dataset.target = chapter.id;
				li.innerHTML = `<span>${heading.textContent.trim()}</span>`;
				chapterNav.appendChild(li);
			});

			const chapterLinks = [...chapterNav.querySelectorAll('li')];

			if (chapterLinks.length <= 1) {
				chapterWrap.remove();
				return;
			}

			/* --------------------------------
			Progress indicator element
			-------------------------------- */

			const progress = document.createElement('div');
			progress.className = 'chapter-progress';
			progress.innerHTML = `<span></span>`;
			chapterWrap.appendChild(progress);

			const progressBar = progress.querySelector('span');

			/* --------------------------------
			2. State
			-------------------------------- */

			let activeIndex = 0;
			let activeSection = null;
			let isSnapping = false;
			let isLockedInChapters = false;
			let hasEnteredStory = false;

			const vh = () => window.innerHeight;

			const wrapperTop = () =>
				chaptersWrapper.getBoundingClientRect().top;

			const wrapperBottom = () =>
				chaptersWrapper.getBoundingClientRect().bottom;

			/* --------------------------------
			3. Activate section (single source of truth)
			-------------------------------- */

			const setActiveSection = (section) => {
				if (!section || activeSection === section) return;

				storySections.forEach(s => s.classList.remove('viewport-active'));
				section.classList.add('viewport-active');

				activeSection = section;
				activeIndex = Math.max(0, storySections.indexOf(section));

				const chapterEl = section.querySelector('.cs-chapter[id]');
				const id = chapterEl ? chapterEl.id : null;

				chapterLinks.forEach(link =>
					link.classList.toggle('is-active', link.dataset.target === id)
				);

				if (id && hasEnteredStory && document.body.classList.contains('is-in-story')) {
					history.replaceState(null, '', `#${id}`);
				}

				setActiveBackground(id);

				// Update progress bar
				const pct = ((activeIndex + 1) / storySections.length) * 100;
				progressBar.style.transform = `scaleY(${pct / 100})`;

				
			};

			/* --------------------------------
			4. Snap helper
			-------------------------------- */

			const snapTo = (index) => {
				const target = storySections[index];
				if (!target || isSnapping) return;

				isSnapping = true;
				target.scrollIntoView({ behavior: 'smooth', block: 'start' });

				setTimeout(() => {
					isSnapping = false;
				}, 850);
			};

			/* --------------------------------
			5. Active section observer (NO story state here)
			-------------------------------- */

			const visibilityMap = new Map();

			const storyObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach(entry => {
						visibilityMap.set(entry.target, entry.intersectionRatio);
					});

					let topSection = null;
					let topRatio = 0;

					visibilityMap.forEach((ratio, section) => {
						if (ratio > topRatio) {
							topRatio = ratio;
							topSection = section;
						}
					});

					// Always update active section when one is dominant
					if (topSection && topRatio > 0.5) {
						hasEnteredStory = true;
						setActiveSection(topSection);
					}
				},
				{ threshold: [0, 0.25, 0.5, 0.75, 0.9] }
			);

			storySections.forEach(section => storyObserver.observe(section));

			/* --------------------------------
			6. Wrapper lock observer
			-------------------------------- */

			const wrapperObserver = new IntersectionObserver(
				([entry]) => {
					isLockedInChapters = entry.intersectionRatio >= 0.9;
				},
				{ threshold: [0.9] }
			);

			wrapperObserver.observe(chaptersWrapper);

			/* ==========================
			STORY MODE — CONTAINER AWARE
			========================== */

			(() => {
				const scrollContainer =
					document.querySelector('#main') ||
					document.querySelector('.entry-content');

				const wrapper = document.querySelector('.chapters-wrapper');

				if (!scrollContainer || !wrapper) return;

				let inStory = false;

				const updateStoryState = () => {
					const containerRect = scrollContainer.getBoundingClientRect();
					const wrapperRect = wrapper.getBoundingClientRect();

					// wrapper top relative to container top
					const wrapperTopInContainer =
						wrapperRect.top - containerRect.top;

					const wrapperBottomInContainer =
						wrapperRect.bottom - containerRect.top;

					const nowInStory =
						wrapperTopInContainer <= 0 &&
						wrapperBottomInContainer > 0;

					if (nowInStory !== inStory) {
						inStory = nowInStory;
						document.body.classList.toggle('is-in-story', inStory);
					}
				};

				scrollContainer.addEventListener('scroll', updateStoryState, { passive: true });
				updateStoryState(); // run once
			})();

			/* --------------------------------
			7. Wheel locking logic
			-------------------------------- */

			window.addEventListener(
				'wheel',
				(e) => {
					if (!isLockedInChapters || isSnapping) return;
					if (Math.abs(e.deltaY) < 40) return;

					const goingDown = e.deltaY > 0;
					const goingUp = e.deltaY < 0;

					const atTopBoundary = wrapperTop() >= -10;
					const atBottomBoundary = wrapperBottom() <= vh() + 10;

					// Block escape unless boundary reached
					if (goingUp && !atTopBoundary) {
						e.preventDefault();
						snapTo(activeIndex - 1);
						return;
					}

					if (goingDown && !atBottomBoundary) {
						e.preventDefault();
						snapTo(activeIndex + 1);
						return;
					}
				},
				{ passive: false }
			);

			/* --------------------------------
			8. Keyboard navigation
			-------------------------------- */

			window.addEventListener('keydown', (e) => {
				if (!isLockedInChapters || isSnapping) return;

				// Ignore typing contexts
				const tag = document.activeElement?.tagName;
				if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;

				if (['ArrowDown', 'PageDown'].includes(e.key)) {
					e.preventDefault();
					if (activeIndex < storySections.length - 1) {
						snapTo(activeIndex + 1);
					}
				}

				if (['ArrowUp', 'PageUp'].includes(e.key)) {
					e.preventDefault();
					if (activeIndex > 0) {
						snapTo(activeIndex - 1);
					}
				}
			});

			/* --------------------------------
			9. Chapter click navigation
			-------------------------------- */

			chapterLinks.forEach(link => {
				link.addEventListener('click', () => {
					hasEnteredStory = true;

					const target = document.getElementById(link.dataset.target);
					if (!target) return;

					target.scrollIntoView({ behavior: 'smooth', block: 'start' });
				});
			});

			/* --------------------------------
			10. Chapter selector visibility (STABLE)
			-------------------------------- */

			let selectorVisible = false;

			const selectorObserver = new IntersectionObserver(
				(entries) => {
					const entry = entries[0];

					// Enter chapters once wrapper is meaningfully in view
					if (entry.intersectionRatio > 0.3) {
						if (!selectorVisible) {
							selectorVisible = true;
							document.body.classList.add('is-in-chapters');
						}
						return;
					}

					// Fully exit chapters only when wrapper is completely out of view
					if (entry.intersectionRatio === 0) {
						selectorVisible = false;
						document.body.classList.remove('is-in-chapters');
					}
				},
				{
					threshold: [0, 0.3]
				}
			);

			selectorObserver.observe(chaptersWrapper);

			/* --------------------------------
			11. Touch swipe navigation (mobile)
			-------------------------------- */

			let touchStartY = null;

			window.addEventListener('touchstart', (e) => {
				if (!isLockedInChapters) return;
				touchStartY = e.touches[0].clientY;
			}, { passive: true });

			window.addEventListener('touchend', (e) => {
				if (!isLockedInChapters || isSnapping || touchStartY === null) return;

				const endY = e.changedTouches[0].clientY;
				const deltaY = touchStartY - endY;

				// Require a meaningful swipe
				if (Math.abs(deltaY) < 60) return;

				if (deltaY > 0 && activeIndex < storySections.length - 1) {
					// swipe up → next
					snapTo(activeIndex + 1);
				}

				if (deltaY < 0 && activeIndex > 0) {
					// swipe down → previous
					snapTo(activeIndex - 1);
				}

				touchStartY = null;
			});

			/* --------------------------------
			BACKGROUND LAYERS (ROBUST)
			-------------------------------- */

			const getBgLayers = () => [...document.querySelectorAll('.story-backgrounds .bg')];

			const setActiveBackground = (chapterId) => {
				if (!chapterId) {
					// No id → nothing to set
					return;
				}

				const layers = getBgLayers();
				if (!layers.length) {
					console.warn('[BG] No background layers found. Expected .story-backgrounds .bg');
					return;
				}

				let matched = false;

				layers.forEach(bg => {
					const isActive = bg.dataset.bg === chapterId;
					bg.classList.toggle('is-active', isActive);
					if (isActive) matched = true;
				});

				if (!matched) {
					console.warn(
						`[BG] No bg matched chapterId "${chapterId}". Check .bg[data-bg="..."] values match your chapter IDs.`
					);
				}
			};

		})();
	})
();

