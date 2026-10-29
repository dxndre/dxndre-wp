// Theme entry: emitted as build/index.js and build/index.css.
import "regenerator-runtime/runtime.js";
import "./main.scss";
import * as bootstrap from "bootstrap";

// faq-motion — private module scope.
const { initFaqMotion } = (() => {
	/** Smooth native FAQ disclosure motion, including interrupted closing transitions. */
	function initFaqMotion() {
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

		document.querySelectorAll(".dx-faq-item").forEach((detail) => {
			const summary = detail.querySelector(":scope > summary");
			const answer = detail.querySelector(":scope > .dx-faq-answer");
			if (!summary || !answer || detail.dataset.faqMotionBound) return;
			detail.dataset.faqMotionBound = "true";
			detail.classList.add("is-faq-motion");

			let expanded = detail.open;
			let heightMotion = null;
			let answerMotion = null;
			let revision = 0;
			detail.dataset.faqExpanded = String(expanded);

			const cancelMotion = () => {
				if (heightMotion) {
					heightMotion.onfinish = null;
					heightMotion.cancel();
					heightMotion = null;
				}
				answerMotion?.cancel();
				answerMotion = null;
			};

			const settle = () => {
				cancelMotion();
				detail.open = expanded;
				detail.style.height = "";
				detail.style.overflow = "";
				delete detail.dataset.faqAnimating;
			};

			const animateTo = (nextExpanded) => {
				expanded = nextExpanded;
				detail.dataset.faqExpanded = String(expanded);
				const currentRevision = ++revision;
				if (reducedMotion.matches || typeof detail.animate !== "function") {
					settle();
					return;
				}

				// Read the current painted state before cancelling so repeated clicks reverse smoothly.
				const startHeight = detail.getBoundingClientRect().height;
				const startOpacity = detail.open
					? Number.parseFloat(getComputedStyle(answer).opacity)
					: 0;
				cancelMotion();
				detail.open = true;
				detail.style.height = "auto";
				const expandedHeight = detail.getBoundingClientRect().height;
				const style = getComputedStyle(detail);
				const inset = [
					"borderTopWidth",
					"borderBottomWidth",
					"paddingTop",
					"paddingBottom",
				].reduce(
					(total, property) =>
						total + (Number.parseFloat(style[property]) || 0),
					0,
				);
				const collapsedHeight = summary.getBoundingClientRect().height + inset;
				const endHeight = expanded ? expandedHeight : collapsedHeight;
				const distance = Math.abs(endHeight - startHeight);
				const duration = Math.max(
					140,
					Math.min(
						380,
						(380 * distance) / Math.max(1, expandedHeight - collapsedHeight),
					),
				);

				detail.style.height = `${startHeight}px`;
				detail.style.overflow = "hidden";
				detail.dataset.faqAnimating = "true";
				const timing = {
					duration,
					easing: "cubic-bezier(0.22, 1, 0.36, 1)",
					fill: "both",
				};
				heightMotion = detail.animate(
					[{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
					timing,
				);
				answerMotion = answer.animate(
					[{ opacity: startOpacity }, { opacity: expanded ? 1 : 0 }],
					timing,
				);
				heightMotion.onfinish = () => {
					if (currentRevision === revision) settle();
				};
			};

			summary.addEventListener("click", (event) => {
				if (event.target.closest("a, button, input, select, textarea")) return;
				event.preventDefault();
				animateTo(!expanded);
			});

			// Keep the native open state in sync with external attribute changes.
			detail.addEventListener("toggle", () => {
				if (heightMotion) return;
				expanded = detail.open;
				detail.dataset.faqExpanded = String(expanded);
			});

			if (typeof ResizeObserver === "function") {
				const contentSize = new ResizeObserver(() => {
					if (heightMotion) animateTo(expanded);
				});
				contentSize.observe(summary);
				contentSize.observe(answer);
			}
			reducedMotion.addEventListener("change", () => {
				if (reducedMotion.matches) settle();
			});
		});
	}
	return { initFaqMotion };
})();

// motion-refinements — private module scope.
const { initFooterScrollMotion, initN118PortraitMotion } = (() => {
	/** Horizontal footer lettering follows scroll direction without an idle animation loop. */
	function initFooterScrollMotion() {
		const wordmark = document.querySelector(".dx-footer-wordmark");
		const track = wordmark?.querySelector(".dx-footer-wordmark-track");
		if (!track || track.dataset.motionReady) return;
		track.dataset.motionReady = "true";
		const reduced = matchMedia("(prefers-reduced-motion: reduce)");
		let period = 0,
			phase = 0,
			lastY = scrollY,
			pending = 0,
			frame = 0,
			inView = false;
		const paint = () => {
			frame = 0;
			if (reduced.matches) {
				pending = 0;
				track.style.setProperty("--dx-wordmark-x", "0px");
				return;
			}
			if (period) {
				phase = (((phase - pending * 0.45) % period) + period) % period;
				track.style.setProperty(
					"--dx-wordmark-x",
					(-period + phase).toFixed(2) + "px",
				);
			}
			pending = 0;
		};
		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(paint);
		};
		const measure = () => {
			const first = track.firstElementChild;
			if (!first) return;
			const normalized = period ? phase / period : 0;
			period =
				first.getBoundingClientRect().width +
				(parseFloat(getComputedStyle(track).columnGap) || 0);
			if (!period) return;
			phase = normalized * period;
			const copies = Math.max(3, Math.ceil(wordmark.clientWidth / period) + 3);
			while (track.children.length < copies)
				track.append(first.cloneNode(true));
			while (track.children.length > copies) track.lastElementChild.remove();
			schedule();
		};
		const visibility = new IntersectionObserver(
			(entries) => {
				inView = entries[0].isIntersecting;
				lastY = scrollY;
			},
			{ rootMargin: "120px" },
		);
		visibility.observe(wordmark.closest("footer") || wordmark);
		addEventListener(
			"scroll",
			() => {
				const current = scrollY,
					delta = current - lastY;
				lastY = current;
				if (reduced.matches || !inView || delta === 0) return;
				wordmark.dataset.scrollDirection = delta > 0 ? "down" : "up";
				pending += Math.max(-180, Math.min(180, delta));
				schedule();
			},
			{ passive: true },
		);
		const sizeObserver = new ResizeObserver(measure);
		sizeObserver.observe(wordmark);
		document.fonts?.ready.then(measure);
		reduced.addEventListener("change", () => {
			phase = 0;
			pending = 0;
			lastY = scrollY;
			schedule();
		});
		measure();
	}

	/** Let the N118 portrait travel more slowly than the hero while scrolling. */
	function initN118PortraitMotion() {
		const portrait = document.querySelector(".dx-n118 .dx-about-portrait");
		const hero = portrait?.closest(".dx-about-hero");
		if (!hero || portrait.dataset.parallaxReady) return;
		portrait.dataset.parallaxReady = "true";
		const reduced = matchMedia("(prefers-reduced-motion: reduce)");
		let visible = true,
			frame = 0;
		const paint = () => {
			frame = 0;
			if (!visible && !reduced.matches) return;
			const phone = innerWidth <= 767;
			const offset = reduced.matches
				? 0
				: Math.max(
						-16,
						Math.min(
							phone ? 36 : 90,
							-hero.getBoundingClientRect().top * (phone ? 0.075 : 0.15),
						),
				  );
			portrait.style.setProperty(
				"--dx-n118-portrait-y",
				offset.toFixed(2) + "px",
			);
		};
		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(paint);
		};
		new IntersectionObserver(
			(entries) => {
				visible = entries[0].isIntersecting;
				if (visible) schedule();
			},
			{ rootMargin: "120px" },
		).observe(hero);
		addEventListener("scroll", schedule, { passive: true });
		addEventListener("resize", schedule, { passive: true });
		reduced.addEventListener("change", schedule);
		paint();
	}
	return { initFooterScrollMotion, initN118PortraitMotion };
})();

// photo-orbit — private module scope.
const { initPhotoOrbit } = (() => {
	const SVG_NS = "http://www.w3.org/2000/svg";

	/** A photo's own EXIF engraving follows the hero's slideshow and scroll position. */
	function initPhotoOrbit() {
		const heroes = document.querySelectorAll(
			".service-detail--photography .service-detail-hero,.dx-photo-hero",
		);
		if (!heroes.length) return;
		const reduced = matchMedia("(prefers-reduced-motion: reduce)");
		const photoKey = (source) => {
			try {
				return new URL(source, location.href).pathname
					.replace(/-\d+x\d+(?=\.[^.]+$)/, "")
					.replace(/-scaled(?=\.[^.]+$)/, "");
			} catch {
				return "";
			}
		};
		const gallery = new Map();
		(window.DXB?.photos || []).forEach((photo) => {
			[photo.full, photo.image].filter(Boolean).forEach((src) => {
				gallery.set(photoKey(src), photo.technical || {});
			});
		});
		const svgElement = (tag, attributes = {}) => {
			const node = document.createElementNS(SVG_NS, tag);
			Object.entries(attributes).forEach(([key, value]) =>
				node.setAttribute(key, value),
			);
			return node;
		};
		const engraving = (technical) => {
			const fields = [
				"Camera",
				"Focal length",
				"Aperture",
				"ISO",
				"Shutter",
				"Dimensions",
			];
			const values = fields
				.filter((key) => technical[key] && typeof technical[key] !== "object")
				.map((key) => `${key} ${technical[key]}`.toUpperCase());
			if (!values.length) return "";
			const phrase = values.join(" · ") + " · ";
			return phrase.repeat(Math.max(1, Math.ceil(115 / phrase.length)));
		};
		const irisPath = (radius) => {
			const point = (angle) => `${(250 + Math.cos(angle * Math.PI / 180) * radius).toFixed(2)} ${(250 + Math.sin(angle * Math.PI / 180) * radius).toFixed(2)}`;
			return `M250 105A145 145 0 0 1 375.57 177.5L${point(5)}L${point(-55)}Z`;
		};
		const instances = [];
		heroes.forEach((hero, index) => {
			if (hero.dataset.photoOrbitReady) return;
			hero.dataset.photoOrbitReady = "true";
			const orbit = document.createElement("div");
			orbit.className = "dx-photo-orbit";
			orbit.setAttribute("aria-hidden", "true");
			const svg = svgElement("svg", {
				viewBox: "0 0 500 500",
				focusable: "false",
			});
			const defs = svgElement("defs");
			const pathId = `dx-photo-orbit-path-${index}`;
			defs.append(
				svgElement("path", {
					id: pathId,
					d: "M250,28 a222,222 0 1,1 0,444 a222,222 0 1,1 0,-444",
				}),
			);
			svg.append(defs);
			const shell = svgElement("g", { class: "dx-lens-shell" });
			[248, 241, 235, 208, 201, 192, 154, 144].forEach((r) =>
				shell.append(svgElement("circle", { cx: 250, cy: 250, r })),
			);
			svg.append(shell);
			const ticks = svgElement("g", { class: "dx-lens-ticks" });
			for (let tick = 0; tick < 120; tick++) {
				const angle = (tick * 3 * Math.PI) / 180,
					outside = 248,
					inside = tick % 5 === 0 ? 239 : 244;
				ticks.append(
					svgElement("path", {
						d: `M${250 + Math.sin(angle) * inside} ${
							250 - Math.cos(angle) * inside
						}L${250 + Math.sin(angle) * outside} ${
							250 - Math.cos(angle) * outside
						}`,
					}),
				);
			}
			svg.append(ticks);
			const focus = svgElement("g", { class: "dx-lens-focus" });
			focus.append(
				svgElement("circle", {
					class: "dx-lens-shell",
					cx: 250,
					cy: 250,
					r: 184,
					"stroke-dasharray": "1 10",
				}),
			);
			const marker = svgElement("path", {
				class: "dx-lens-marker",
				d: "M250 60l-4 8h8Z",
			});
			focus.append(marker);
			["FOCUS / ∞", "DX / OPTICS"].forEach((value, i) => {
				const label = svgElement("text", {
					class: "dx-lens-label",
					x: 250,
					y: i ? 426 : 82,
					"text-anchor": "middle",
				});
				label.textContent = value;
				focus.append(label);
			});
			svg.append(
				focus,
				svgElement("circle", {
					class: "dx-lens-glass",
					cx: 250,
					cy: 250,
					r: 145,
				}),
			);
			const aperture = svgElement("g", { class: "dx-lens-aperture" });
			for (let blade = 0; blade < 6; blade++)
				aperture.append(
					svgElement("path", {
						d: irisPath(92),
						transform: `rotate(${blade * 60} 250 250)`,
					}),
				);
			svg.append(aperture);

			const layers = [0, 1].map(() => {
				const layer = svgElement("g", { class: "dx-photo-orbit__layer" });
				const text = svgElement("text", {
					textLength: "1370",
					lengthAdjust: "spacing",
				});
				const path = svgElement("textPath", {
					href: `#${pathId}`,
					startOffset: "0",
				});
				text.append(path);
				layer.append(text);
				svg.append(layer);
				return { layer, text, path };
			});
			orbit.append(svg);
			hero.append(orbit);
			let current = "",
				active = 1,
				syncFrame = 0;
			const sourceImage = () => {
				if (hero.classList.contains("dx-photo-hero")) {
					return hero.querySelector(".dx-page-hero-art:not(.dx-slide-hidden)");
				}
				return (
					hero.querySelector(".dx-service-slides img.is-visible") ||
					hero.querySelector(".service-detail-art img")
				);
			};
			const syncPhoto = () => {
				syncFrame = 0;
				const image = sourceImage();
				if (!image) return;
				let technical =
					gallery.get(photoKey(image.currentSrc || image.src)) || {};
				if (image.dataset.photoTechnical) {
					try {
						technical = JSON.parse(image.dataset.photoTechnical);
					} catch {
						/* No invented camera values. */
					}
				}
				const value = engraving(technical);
				if (value === current) return;
				current = value;
				if (!value) {
					orbit.classList.remove("is-ready");
					return;
				}
				const next = 1 - active;
				layers[next].path.textContent = value;
				layers[next].text.style.fontSize = `${Math.min(
					16,
					1370 / (value.length * 0.7),
				).toFixed(2)}px`;
				layers[active].layer.classList.remove("is-active");
				layers[next].layer.classList.add("is-active");
				active = next;
				orbit.classList.add("is-ready");
			};
			const scheduleSync = () => {
				if (!syncFrame) syncFrame = requestAnimationFrame(syncPhoto);
			};
			new MutationObserver((records) => {
				if (records.some((record) => !orbit.contains(record.target)))
					scheduleSync();
			}).observe(hero, {
				subtree: true,
				childList: true,
				attributes: true,
				attributeFilter: ["class", "src", "srcset", "data-photo-technical"],
			});
			hero.addEventListener("load", scheduleSync, true);
			instances.push({ hero, orbit, aperture, visible: true, radius: -1 });
			syncPhoto();
		});
		if (!instances.length) return;
		let frame = 0;
		const paint = () => {
			frame = 0;
			instances.forEach((instance) => {
				const { hero, orbit, aperture, visible } = instance;
				if (!visible && !reduced.matches) return;
				const rect = hero.getBoundingClientRect();
				const travel = reduced.matches ? 0 : -rect.top;
				const progress = Math.max(0, Math.min(1, travel / Math.max(320, rect.height * 0.75)));
				const eased = progress * progress * (3 - 2 * progress);
				const radius = Math.round((92 - 87 * eased) * 100) / 100;
				if (radius !== instance.radius) {
					[...aperture.children].forEach((blade) => blade.setAttribute("d", irisPath(radius)));
					instance.radius = radius;
					orbit.style.setProperty("--dx-lens-opening", `${radius}`);
				}
				orbit.style.setProperty(
					"--dx-lens-focus-turn",
					`${(travel * -0.035).toFixed(2)}deg`,
				);
				orbit.style.setProperty(
					"--dx-lens-aperture-turn",
					`${(travel * 0.025).toFixed(2)}deg`,
				);
				orbit.style.setProperty(
					"--dx-lens-aperture-scale",
					"1",
				);
				orbit.style.setProperty(
					"--dx-photo-orbit-turn",
					`${(-24 + travel * 0.065).toFixed(2)}deg`,
				);
				orbit.style.setProperty(
					"--dx-photo-orbit-y",
					`${Math.max(-35, Math.min(35, travel * 0.09)).toFixed(2)}px`,
				);
			});
		};
		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(paint);
		};
		const visibility = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const instance = instances.find(({ hero }) => hero === entry.target);
					if (instance) instance.visible = entry.isIntersecting;
				});
				schedule();
			},
			{ rootMargin: "100px" },
		);
		instances.forEach(({ hero }) => visibility.observe(hero));
		addEventListener("scroll", schedule, { passive: true });
		addEventListener("resize", schedule);
		reduced.addEventListener("change", schedule);
		schedule();
	}
	return { initPhotoOrbit };
})();

// instagram — private module scope.
const { initInstagramProfiles } = (() => {
	/** Use Instagram's own public-profile renderer; retain profile links if unavailable. */
	function initInstagramProfiles() {
		const sections = [...document.querySelectorAll("[data-instagram-profile]")];
		if (!sections.length) return;
		let scriptPromise;
		const loadRenderer = () => {
			if (window.instgrm?.Embeds) return Promise.resolve();
			if (scriptPromise) return scriptPromise;
			scriptPromise = new Promise((resolve, reject) => {
				let script = document.querySelector(
					'script[src="https://www.instagram.com/embed.js"]',
				);
				if (!script) {
					script = document.createElement("script");
					script.src = "https://www.instagram.com/embed.js";
					script.async = true;
					script.dataset.dxInstagram = "true";
					document.head.append(script);
				}
				script.addEventListener("load", resolve, { once: true });
				script.addEventListener("error", reject, { once: true });
			});
			return scriptPromise;
		};
		const start = (section) => {
			if (section.dataset.instagramReady) return;
			section.dataset.instagramReady = "true";
			const feed = section.querySelector("[data-instagram-feed]");
			const embed = section.querySelector("[data-instagram-embed]");
			const message = section.querySelector("[data-instagram-message]");
			let timeout;
			const setState = (state) => {
				feed.dataset.state = state;
				message.textContent =
					state === "loading"
						? "Loading Instagram…"
						: state === "loaded"
						? "On Instagram"
						: "Open Instagram to see the latest posts.";
				if (state !== "loading") clearTimeout(timeout);
			};
			setState("loading");
			const observer = new MutationObserver(() => {
				const frame = embed.querySelector("iframe");
				if (!frame) return;
				frame.title = `Instagram profile: @${section.dataset.instagramProfile}`;
				frame.setAttribute("loading", "lazy");
				// The iframe remains the official Instagram UI; a loaded embed can still
				// show an account's privacy/embedding restriction, so keep the profile link.
				frame.addEventListener("load", () => setState("loaded"), {
					once: true,
				});
				observer.disconnect();
			});
			observer.observe(embed, { childList: true, subtree: true });
			timeout = setTimeout(() => setState("unavailable"), 14000);
			loadRenderer()
				.then(() => window.instgrm?.Embeds?.process())
				.catch(() => setState("unavailable"));
		};
		if (!("IntersectionObserver" in window)) {
			sections.forEach(start);
			return;
		}
		const visibility = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;
					visibility.unobserve(entry.target);
					start(entry.target);
				});
			},
			{ rootMargin: "350px" },
		);
		sections.forEach((section) => visibility.observe(section));
	}
	return { initInstagramProfiles };
})();

// contact-canvas — private module scope.
const { initContactCanvas } = (() => {
	// The page owns its artwork so the form shares the same full-width canvas.
	function initContactCanvas() {
		const page = document.querySelector(".dx-contact-page");
		if (!page || page.dataset.contactCanvasReady) return;
		page.dataset.contactCanvasReady = "true";
		const reduced = matchMedia("(prefers-reduced-motion: reduce)");
		let scheduled = false;
		let visible = true;
		const paint = () => {
			scheduled = false;
			if (reduced.matches) {
				page.style.setProperty("--dx-contact-drift", "0px");
				return;
			}
			if (!visible) return;
			const rect = page.getBoundingClientRect();
			const strength = innerWidth < 768 ? 0.04 : 0.07;
			const drift = Math.max(-60, Math.min(60, -rect.top * strength));
			page.style.setProperty("--dx-contact-drift", `${drift.toFixed(1)}px`);
		};
		const schedule = () => {
			if (scheduled) return;
			scheduled = true;
			requestAnimationFrame(paint);
		};
		if ("IntersectionObserver" in window) {
			const observer = new IntersectionObserver(([entry]) => {
				visible = entry.isIntersecting;
				if (visible) schedule();
			});
			observer.observe(page);
		}
		addEventListener("scroll", schedule, { passive: true });
		addEventListener("resize", schedule, { passive: true });
		reduced.addEventListener("change", schedule);
		schedule();
	}
	return { initContactCanvas };
})();

// services-hover — private module scope.
const { initServicesHover } = (() => {
	/** Decorative previews behind the existing Beyond digital service layout. */
	function initServicesHover() {
		const section = document.querySelector(
			"#physical-services.dx-physical-services",
		);
		if (!section || section.dataset.servicesHoverReady) return;
		const articles = [...section.querySelectorAll(":scope > div > article")];
		const links = articles.map((article) => article.querySelector("a.dx-cta"));
		if (links.length < 2 || links.some((link) => !link)) return;
		section.dataset.servicesHoverReady = "true";

		const stylesheet = document.querySelector("link#dxndre-theme-css");
		const themeBase = stylesheet
			? new URL("../", stylesheet.href)
			: new URL("/wp-content/themes/dxndre/", location.href);
		const sources = [
			new URL("../../uploads/2026/01/on-the-gym-floor.jpeg", themeBase).href,
			new URL("assets/img/photography-portrait-illustrated.webp", themeBase)
				.href,
		];
		const backdrop = document.createElement("figure");
		backdrop.className = "dx-services-preview";
		backdrop.setAttribute("aria-hidden", "true");
		const layers = sources.map((source, index) => {
			const layer = document.createElement("div");
			layer.className = "dx-services-preview__layer";
			layer.dataset.preview = index === 0 ? "fitness" : "photography";
			const image = document.createElement("img");
			image.alt = "";
			image.loading = "lazy";
			image.decoding = "async";
			image.src = source;
			layer.append(image);
			backdrop.append(layer);
			return { layer, image };
		});
		section.prepend(backdrop);
		section.classList.add("has-services-preview");

		const touch = matchMedia("(hover: none), (pointer: coarse)");
		let pointerIndex = -1;
		let focusIndex = -1;
		let touchIndex = 0;
		let requestedIndex = -1;
		let visibleIndex = -1;

		const paint = () => {
			// Keep the current photograph visible until the replacement has decoded.
			if (
				requestedIndex >= 0 &&
				(!layers[requestedIndex].image.complete ||
					!layers[requestedIndex].image.naturalWidth)
			)
				return;
			visibleIndex = requestedIndex;
			layers.forEach(({ layer }, index) =>
				layer.classList.toggle("is-active", index === visibleIndex),
			);
			section.dataset.servicePreview =
				visibleIndex < 0
					? "none"
					: visibleIndex === 0
					? "fitness"
					: "photography";
		};
		const update = () => {
			requestedIndex =
				pointerIndex >= 0
					? pointerIndex
					: focusIndex >= 0
					? focusIndex
					: touch.matches
					? touchIndex
					: -1;
			paint();
		};
		layers.forEach(({ image }) => image.addEventListener("load", paint));
		links.forEach((link, index) => {
			link.addEventListener("pointerenter", (event) => {
				if (event.pointerType === "touch") return;
				pointerIndex = index;
				update();
			});
			link.addEventListener("pointerleave", () => {
				pointerIndex = -1;
				update();
			});
			link.addEventListener("focus", () => {
				focusIndex = index;
				update();
			});
			link.addEventListener("blur", () => {
				focusIndex = -1;
				update();
			});
		});

		// Touch visitors see a preview for the card currently in view, with no extra tap.
		if ("IntersectionObserver" in window) {
			const visibility = new Map();
			const cardObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) =>
						visibility.set(entry.target, entry.intersectionRatio),
					);
					if (!touch.matches) return;
					const candidate = articles
						.map((article, index) => ({
							index,
							ratio: visibility.get(article) || 0,
							distance: Math.abs(
								article.getBoundingClientRect().top +
									article.getBoundingClientRect().height / 2 -
									innerHeight / 2,
							),
						}))
						.sort((a, b) => b.ratio - a.ratio || a.distance - b.distance)[0];
					if (candidate?.ratio > 0) touchIndex = candidate.index;
					update();
				},
				{ threshold: [0, 0.25, 0.5, 0.75, 1] },
			);
			articles.forEach((article) => cardObserver.observe(article));
		}
		touch.addEventListener("change", update);
		update();
	}
	return { initServicesHover };
})();

// service-index-motion — private module scope.
const { initServiceIndexMotion } = (() => {
	// Keep each link row in the same place while its surface opens to full width.
	function initServiceIndexMotion() {
		const bars = [...document.querySelectorAll(
			".dx-service-index,.dxf-nav,.dxb-nav,.dx-section-nav,.cv-nav",
		)];
		const header = document.getElementById("header");
		if (!bars.length || !header || header.dataset.serviceIndexMotionReady) return;
		header.dataset.serviceIndexMotionReady = "true";
		const root = document.documentElement;
		const reduced = matchMedia("(prefers-reduced-motion: reduce)");
		let frame = 0;
		let followUntil = 0;
		let needsMeasure = true;
		let lastOffset = "";
		const entries = bars.map((bar) => {
			let slot = bar.parentElement;
			if (!slot.matches(".dx-section-nav-slot,.dx-secondary-nav-slot")) {
				slot = document.createElement("div");
				bar.before(slot);
				slot.append(bar);
			}
			slot.classList.add("dx-secondary-nav-slot");
			const inner = document.createElement("div");
			inner.className = "dx-secondary-nav__inner";
			while (bar.firstChild) inner.append(bar.firstChild);
			bar.append(inner);
			bar.dataset.secondaryDockReady = "true";
			inner.tabIndex = -1;
			return {
				bar, slot, inner,
				limit: bar.closest(".dx-services-editorial,.dx-fitness,.dxb,.cv-experience,#main"),
				marginTop: 0, marginBottom: 0, inset: 0, width: 0, height: 0,
			};
		});
		const measure = (entry) => {
			const { bar, slot } = entry;
			const stuck = bar.classList.contains("dx-secondary-nav-stuck");
			const nativeStates = ["is-stuck", "is-docked"].filter((name) => bar.classList.contains(name));
			bar.classList.remove("dx-secondary-nav", "dx-secondary-nav-stuck", ...nativeStates);
			bar.style.removeProperty("left");
			bar.style.removeProperty("width");
			const style = getComputedStyle(bar);
			const natural = bar.getBoundingClientRect();
			const slotRect = slot.getBoundingClientRect();
			const padding = ["Top", "Right", "Bottom", "Left"].map((side) => style[`padding${side}`]);
			entry.marginTop = parseFloat(style.marginTop) || 0;
			entry.marginBottom = parseFloat(style.marginBottom) || 0;
			entry.inset = natural.left - slotRect.left;
			entry.width = natural.width;
			bar.style.setProperty("--dx-secondary-row-gap", style.columnGap);
			bar.style.setProperty("--dx-secondary-row-padding", padding.join(" "));
			bar.style.setProperty("--dx-secondary-row-padding-top", padding[0]);
			bar.style.setProperty("--dx-secondary-top-border", style.borderTopWidth);
			bar.classList.add("dx-secondary-nav", ...nativeStates);
			entry.height = bar.getBoundingClientRect().height;
			if (stuck) bar.classList.add("dx-secondary-nav-stuck");
		};
		const paint = () => {
			frame = 0;
			if (needsMeasure) {
				entries.forEach(measure);
				needsMeasure = false;
			}
			// Read the transformed bottom every frame of the header's own transition.
			// A hidden header therefore leaves no empty strip above the secondary nav.
			const offset = Math.max(0, header.getBoundingClientRect().bottom);
			const value = `${offset.toFixed(2)}px`;
			if (lastOffset !== value) {
				root.style.setProperty("--dx-service-index-offset", value);
				lastOffset = value;
			}
			entries.forEach((entry) => {
				const { bar, slot } = entry;
				const slotRect = slot.getBoundingClientRect();
				const left = slotRect.left + entry.inset;
				bar.style.setProperty("--dx-secondary-native-left", `${left.toFixed(2)}px`);
				bar.style.setProperty("--dx-secondary-native-width", `${entry.width.toFixed(2)}px`);
				bar.style.setProperty("--dx-secondary-bleed-left", `${(-left).toFixed(2)}px`);
				bar.style.setProperty("--dx-secondary-bleed-right", `${(-((root.clientWidth || innerWidth) - left - entry.width)).toFixed(2)}px`);
				const height = bar.getBoundingClientRect().height || entry.height;
				entry.height = height;
				const stuck = slotRect.top + entry.marginTop <= offset + 0.5;
				// This slot has the same height before, during and after the hand-off.
				slot.style.height = stuck ? `${height + entry.marginTop + entry.marginBottom}px` : "";
				bar.classList.toggle("dx-secondary-nav-stuck", stuck);
				const end = (entry.limit || slot.parentElement).getBoundingClientRect().bottom;
				const top = stuck ? Math.min(offset, end - height) : offset;
				bar.style.setProperty("--dx-secondary-nav-top", `${top.toFixed(2)}px`);
				bar.style.top = `${top.toFixed(2)}px`;
				const cv = bar.closest(".cv-experience");
				if (cv) cv.style.setProperty("--cv-nav-height", `${height.toFixed(2)}px`);
			});
			if (!reduced.matches && performance.now() < followUntil) frame = requestAnimationFrame(paint);
		};
		const schedule = (duration = 0) => {
			if (!reduced.matches) followUntil = Math.max(followUntil, performance.now() + duration);
			if (!frame) frame = requestAnimationFrame(paint);
		};
		new MutationObserver(() => schedule(600)).observe(header, {
			attributes: true, attributeFilter: ["class", "style"],
		});
		new MutationObserver(() => schedule(600)).observe(document.body, {
			attributes: true, attributeFilter: ["class"],
		});
		const toggle = document.getElementById("dx-menu-toggle");
		if (toggle) new MutationObserver(() => schedule(600)).observe(toggle, {
			attributes: true, attributeFilter: ["aria-expanded"],
		});
		if ("ResizeObserver" in window) {
			new ResizeObserver(() => schedule(100)).observe(header);
			const rows = new ResizeObserver(() => schedule());
			entries.forEach(({ inner }) => rows.observe(inner));
		}
		const isHeaderMotion = (event) => event.target === header &&
			["transform", "padding-top", "padding-bottom", "height"].includes(event.propertyName);
		header.addEventListener("transitionrun", (event) => { if (isHeaderMotion(event)) schedule(600); });
		header.addEventListener("transitionend", (event) => { if (isHeaderMotion(event)) schedule(); });
		header.addEventListener("transitioncancel", (event) => { if (isHeaderMotion(event)) schedule(); });
		addEventListener("scroll", () => schedule(), { passive: true });
		addEventListener("resize", () => { needsMeasure = true; schedule(600); }, { passive: true });
		addEventListener("pageshow", () => schedule(600));
		reduced.addEventListener("change", () => { followUntil = 0; schedule(); });
		paint();
	}
	return { initServiceIndexMotion };
})();

// fitness-story — private module scope.
const { initFitnessStory } = (() => {
	/** Keep the long-form story index aligned with the visible navigation stack. */
	function initFitnessStory() {
		const story = document.querySelector("#fitness-story.dxf-story--longform");
		const contents = story?.querySelector(".dxf-story-contents");
		if (!story || !contents || story.dataset.fitnessStoryReady) return;
		const chapters = [
			...story.querySelectorAll(".dxf-story-article .dxf-story-chapter[id]"),
		];
		const byId = new Map(chapters.map((chapter) => [chapter.id, chapter]));
		const links = [...contents.querySelectorAll('a[href^="#"]')].filter(
			(link) => byId.has(link.hash.slice(1)),
		);
		const jumpLinks = [
			...story.querySelectorAll('a[href^="#fitness-story-"]'),
		].filter((link) => byId.has(link.hash.slice(1)));
		if (!chapters.length || !links.length) return;
		story.dataset.fitnessStoryReady = "true";
		const header = document.getElementById("header");
		const fitnessNav = document.querySelector(".dx-fitness .dxf-nav");
		const reduced = matchMedia("(prefers-reduced-motion: reduce)");
		let frame = 0;
		let followUntil = 0;
		let lastOffset = "";
		let navigation = 0;
		const stackOffset = () => {
			let bottom = Math.max(0, header?.getBoundingClientRect().bottom || 0);
			if (fitnessNav) {
				const rect = fitnessNav.getBoundingClientRect();
				// Count only the portion docked beside the visible main header.
				if (rect.height && rect.top <= bottom + 1 && rect.bottom > 0)
					bottom = Math.max(bottom, rect.bottom);
			}
			return bottom + 24;
		};
		const paint = () => {
			frame = 0;
			const offset = stackOffset();
			const value = `${offset.toFixed(2)}px`;
			if (value !== lastOffset) {
				story.style.setProperty("--dxf-story-nav-offset", value);
				lastOffset = value;
			}
			let active = chapters[0];
			for (const chapter of chapters) {
				if (chapter.getBoundingClientRect().top <= offset + 8) active = chapter;
				else break;
			}
			links.forEach((link) => {
				if (link.hash === `#${active.id}`)
					link.setAttribute("aria-current", "location");
				else link.removeAttribute("aria-current");
			});
			if (!reduced.matches && performance.now() < followUntil)
				frame = requestAnimationFrame(paint);
		};
		const schedule = (duration = 0) => {
			if (!reduced.matches)
				followUntil = Math.max(followUntil, performance.now() + duration);
			if (!frame) frame = requestAnimationFrame(paint);
		};
		const cancelNavigation = () => {
			if (navigation) cancelAnimationFrame(navigation);
			navigation = 0;
		};
		jumpLinks.forEach((link) => {
			link.addEventListener("click", (event) => {
				if (
					event.button ||
					event.metaKey ||
					event.ctrlKey ||
					event.shiftKey ||
					event.altKey
				)
					return;
				const chapter = byId.get(link.hash.slice(1));
				if (!chapter) return;
				event.preventDefault();
				cancelNavigation();
				history.replaceState(history.state, "", link.hash);
				const destination = () =>
					Math.max(
						0,
						scrollY + chapter.getBoundingClientRect().top - stackOffset(),
					);
				if (reduced.matches) {
					window.scrollTo({ top: destination(), behavior: "auto" });
					schedule();
					return;
				}
				const start = scrollY;
				const started = performance.now();
				const duration = Math.min(
					900,
					Math.max(500, Math.abs(destination() - start) * 0.18),
				);
				const step = (now) => {
					const progress = Math.min(1, (now - started) / duration);
					const eased = 1 - Math.pow(1 - progress, 4);
					// Follow a hiding/showing header during the same smooth scroll.
					window.scrollTo({
						top: start + (destination() - start) * eased,
						behavior: "instant",
					});
					if (progress < 1) navigation = requestAnimationFrame(step);
					else {
						navigation = 0;
						schedule();
					}
				};
				navigation = requestAnimationFrame(step);
			});
		});
		const stateChanged = () => schedule(600);
		const observeState = (element, attributes) => {
			if (!element) return;
			new MutationObserver(stateChanged).observe(element, {
				attributes: true,
				attributeFilter: attributes,
			});
		};
		observeState(header, ["class", "style"]);
		observeState(fitnessNav, ["class"]);
		observeState(document.body, ["class"]);
		if (header) {
			header.addEventListener("transitionrun", (event) => {
				if (event.target === header) schedule(600);
			});
			header.addEventListener("transitionend", (event) => {
				if (event.target === header) schedule();
			});
		}
		if ("ResizeObserver" in window) {
			const observer = new ResizeObserver(() => schedule());
			[header, fitnessNav, story]
				.filter(Boolean)
				.forEach((element) => observer.observe(element));
		}
		addEventListener("scroll", () => schedule(), { passive: true });
		addEventListener("resize", () => schedule(600), { passive: true });
		addEventListener("pageshow", () => schedule(600));
		addEventListener("hashchange", () => schedule());
		addEventListener("wheel", cancelNavigation, { passive: true });
		addEventListener("touchstart", cancelNavigation, { passive: true });
		addEventListener("keydown", (event) => {
			if (
				[
					"ArrowUp",
					"ArrowDown",
					"PageUp",
					"PageDown",
					"Home",
					"End",
					"Escape",
					" ",
				].includes(event.key)
			)
				cancelNavigation();
		});
		reduced.addEventListener("change", () => {
			cancelNavigation();
			followUntil = 0;
			schedule();
		});
		paint();
	}
	return { initFitnessStory };
})();

// calculator-experience — private module scope.
const { initCalculatorExperience } = (() => {
	/** Decorate the existing proposal theme control without replacing its behaviour. */
	function initCalculatorExperience() {
		const toggle = document.querySelector("[data-proposal-theme]");
		if (!toggle || toggle.dataset.dxThemeIconBound) return;
		toggle.dataset.dxThemeIconBound = "true";
		const svgNamespace = "http://www.w3.org/2000/svg";

		const decorate = () => {
			const label = /dark mode/i.test(toggle.textContent)
				? "Dark mode"
				: "Light mode";
			const mode = label === "Dark mode" ? "dark" : "light";
			const currentIcon = toggle.querySelector(".dx-theme-toggle-icon");
			const currentLabel = toggle.querySelector(".dx-theme-toggle-label");
			if (
				currentIcon?.dataset.mode === mode &&
				currentLabel?.textContent === label
			)
				return;

			const icon = document.createElementNS(svgNamespace, "svg");
			icon.classList.add("dx-theme-toggle-icon");
			icon.dataset.mode = mode;
			icon.setAttribute("width", "18");
			icon.setAttribute("height", "18");
			icon.setAttribute("viewBox", "0 0 24 24");
			icon.setAttribute("fill", "none");
			icon.setAttribute("stroke", "currentColor");
			icon.setAttribute("stroke-width", "1.7");
			icon.setAttribute("stroke-linecap", "round");
			icon.setAttribute("stroke-linejoin", "round");
			icon.setAttribute("aria-hidden", "true");
			icon.setAttribute("focusable", "false");

			if (mode === "light") {
				const circle = document.createElementNS(svgNamespace, "circle");
				circle.setAttribute("cx", "12");
				circle.setAttribute("cy", "12");
				circle.setAttribute("r", "4");
				const rays = document.createElementNS(svgNamespace, "path");
				rays.setAttribute(
					"d",
					"M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42",
				);
				icon.append(circle, rays);
			} else {
				const moon = document.createElementNS(svgNamespace, "path");
				moon.setAttribute(
					"d",
					"M20.5 13.3A8.7 8.7 0 0 1 10.7 3.5a8.8 8.8 0 1 0 9.8 9.8Z",
				);
				icon.append(moon);
			}
			const labelElement = document.createElement("span");
			labelElement.className = "dx-theme-toggle-label";
			labelElement.textContent = label;
			toggle.replaceChildren(icon, labelElement);
		};

		// Both the plugin and the theme fallback update textContent on mode changes.
		// Reapply the decorative icon after either existing handler, without rebinding it.
		const observer = new MutationObserver(decorate);
		observer.observe(toggle, {
			childList: true,
			characterData: true,
			subtree: true,
		});
		decorate();
	}
	return { initCalculatorExperience };
})();

// account-sky — private module scope.
const { initAccountSky } = (() => {
	/** Atmospheric decoration; the account clock remains the sole time-period source. */
	function initAccountSky() {
		const svgNS = "http://www.w3.org/2000/svg";
		const makeSvg = (className, viewBox, path) => {
			const svg = document.createElementNS(svgNS, "svg");
			svg.setAttribute("class", className);
			svg.setAttribute("viewBox", viewBox);
			svg.setAttribute("aria-hidden", "true");
			svg.setAttribute("focusable", "false");
			const shape = document.createElementNS(svgNS, "path");
			shape.setAttribute("d", path);
			svg.append(shape);
			return svg;
		};
		const add = (parent, className) => {
			const element = document.createElement("span");
			element.className = className;
			parent.append(element);
			return element;
		};
		const reduced = matchMedia("(prefers-reduced-motion: reduce)");

		document.querySelectorAll(".auth.dx-account-photo").forEach((auth) => {
			const graphic = auth.querySelector(".graphic-content");
			if (!graphic || graphic.querySelector(".dx-account-sky")) return;
			const sky = document.createElement("div");
			sky.className = "dx-account-sky";
			sky.setAttribute("aria-hidden", "true");
			sky.inert = true;
			graphic.prepend(sky);

			const daytime = add(sky, "dx-account-sky__daytime");
			add(daytime, "dx-account-sky__sun-glare");
			add(daytime, "dx-account-sky__flare dx-account-sky__flare--one");
			add(daytime, "dx-account-sky__flare dx-account-sky__flare--two");

			[
				[17, 24, 38, -11],
				[22, 42, 49, -28],
				[25, 16, 61, -42],
			].forEach(([width, top, duration, delay]) => {
				const flight = add(daytime, "dx-account-sky__bird-flight");
				flight.style.setProperty("--bird-width", `${width}px`);
				flight.style.setProperty("--flight-top", `${top}%`);
				flight.style.setProperty("--flight-duration", `${duration}s`);
				flight.style.setProperty("--flight-delay", `${delay}s`);
				flight.append(
					makeSvg(
						"dx-account-sky__bird",
						"0 0 25 14",
						"M1 8C5 3 9 4 12.5 8C16 4 20 3 24 8C19 5.5 16 7 12.5 10C9 7 6 5.5 1 8Z",
					),
				);
			});
			const planeFlight = add(daytime, "dx-account-sky__plane-flight");
			planeFlight.append(
				makeSvg(
					"dx-account-sky__plane",
					"0 0 32 32",
					"M30 14.5 19 10V4a3 3 0 0 0-6 0v6L2 14.5V18l11-3v9l-4 3v3l7-2 7 2v-3l-4-3v-9l11 3Z",
				),
			);

			const moon = add(sky, "dx-account-sky__moon");
			moon.append(
				makeSvg(
					"dx-account-sky__moon-disc",
					"0 0 64 64",
					"M42 4A27 27 0 1 0 59 48A25 25 0 0 1 42 4Z",
				),
			);
			const nighttime = add(sky, "dx-account-sky__nighttime");
			const positions = [
				[47, 12],
				[61, 22],
				[76, 9],
				[90, 18],
				[56, 35],
				[84, 41],
				[95, 32],
				[68, 49],
				[40, 29],
				[73, 31],
				[87, 57],
				[50, 58],
				[59, 67],
				[96, 68],
				[78, 71],
				[35, 17],
				[65, 11],
				[92, 81],
				[46, 77],
				[69, 82],
				[80, 51],
				[38, 53],
				[92, 8],
				[57, 6],
			];
			positions.forEach(([left, top], index) => {
				const star = add(
					nighttime,
					"dx-account-sky__star" + (index % 3 === 0 ? " is-twinkling" : ""),
				);
				star.style.left = `${left}%`;
				star.style.top = `${top}%`;
				star.style.setProperty(
					"--star-size",
					`${index % 7 === 0 ? 4 : 1.3 + (index % 3) * 0.65}px`,
				);
				star.style.setProperty(
					"--twinkle-duration",
					`${4 + (index % 5) * 0.8}s`,
				);
				star.style.setProperty("--twinkle-delay", `${index * -1.7}s`);
			});
			add(
				nighttime,
				"dx-account-sky__shooting-star dx-account-sky__shooting-star--one",
			);
			add(
				nighttime,
				"dx-account-sky__shooting-star dx-account-sky__shooting-star--two",
			);

			let visible = true;
			const syncPause = () => {
				sky.dataset.skyPaused = String(
					document.hidden || !visible || reduced.matches,
				);
			};
			const syncPeriod = () => {
				const period = ["day", "dawn", "dusk", "night"].includes(
					auth.dataset.londonPeriod,
				)
					? auth.dataset.londonPeriod
					: "night";
				if (sky.dataset.skyPeriod !== period) sky.dataset.skyPeriod = period;
			};
			new MutationObserver(syncPeriod).observe(auth, {
				attributes: true,
				attributeFilter: ["data-london-period"],
			});
			if ("IntersectionObserver" in window) {
				new IntersectionObserver(
					([entry]) => {
						visible = entry.isIntersecting;
						syncPause();
					},
					{ rootMargin: "50px" },
				).observe(auth);
			}
			document.addEventListener("visibilitychange", syncPause);
			reduced.addEventListener("change", syncPause);
			syncPeriod();
			syncPause();
		});
	}
	return { initAccountSky };
})();

// photo-watermark — private module scope.
const { initPhotoWatermarks } = (() => {
	/** Use only a photo's capture metadata, never upload dates or today's year. */
	function photoCaptureYear(photo = {}) {
		const taken = photo.technical?.Taken || photo.technical?.taken;
		for (const value of [photo.captured, taken, photo.date]) {
			if (typeof value !== "string") continue;
			const match = value.match(/(?:^|\D)([12]\d{3})(?=\D|$)/);
			if (match) return match[1];
		}
		return "";
	}

	/** Add presentation-only marks; the original media files are never modified. */
	function initPhotoWatermarks() {
		const gallery = document.querySelector(".dxb");
		if (!gallery || gallery.dataset.photoWatermarksReady) return;
		gallery.dataset.photoWatermarksReady = "true";
		const photos = window.DXB?.photos || [];
		const bySource = new Map();
		const sourceKey = (source) => {
			if (!source) return "";
			try {
				const url = new URL(source, location.href);
				return (
					url.origin +
					url.pathname
						.replace(/-\d+x\d+(?=\.[^.]+$)/, "")
						.replace(/-scaled(?=\.[^.]+$)/, "")
				);
			} catch {
				return "";
			}
		};
		photos.forEach((photo) => {
			[photo.full, photo.image].filter(Boolean).forEach((source) => {
				bySource.set(sourceKey(source), photo);
			});
		});
		const marks = new WeakMap();
		const mark = (host, photo) => {
			let label = marks.get(host);
			if (!label) {
				label = document.createElement("span");
				label.className = "dx-photo-watermark";
				label.setAttribute("aria-hidden", "true");
				host.classList.add("dx-photo-watermark-frame");
				host.append(label);
				marks.set(host, label);
			}
			const year = photoCaptureYear(photo);
			const text = `© ${year ? `${year} ` : ""}DXNDRE`;
			if (label.textContent !== text) label.textContent = text;
			label.dataset.captureYear = year;
			return label;
		};
		const decorateCard = (card) => {
			const image = card.querySelector("img");
			if (!image) return;
			const photo =
				photos[Number(card.dataset.photo)] ||
				bySource.get(sourceKey(image.currentSrc || image.src)) ||
				{};
			mark(card, photo);
		};
		gallery.querySelectorAll("#dxb-gallery [data-photo]").forEach(decorateCard);
		const related = gallery.querySelector("#panel-photos");
		if (related) {
			const decorateRelated = () => {
				related
					.querySelectorAll(".dxb-route-photos button")
					.forEach((button) => {
						const image = button.querySelector("img");
						if (image)
							mark(
								button,
								bySource.get(sourceKey(image.currentSrc || image.src)) || {},
							);
					});
			};
			new MutationObserver(decorateRelated).observe(related, {
				childList: true,
				subtree: true,
			});
			decorateRelated();
		}
		const lightbox = gallery.querySelector("#dxb-lightbox");
		const image = lightbox?.querySelector("#dxb-lightbox-image");
		const viewport = image?.closest(".dxb-photo-viewport");
		if (!lightbox || !image || !viewport) return;
		let label;
		let frame = 0;
		const align = () => {
			frame = 0;
			if (!label || !image.naturalWidth || !image.naturalHeight) return;
			const width = viewport.clientWidth;
			const height = viewport.clientHeight;
			const fit = Math.min(
				width / image.naturalWidth,
				height / image.naturalHeight,
			);
			const zoomed = lightbox.classList.contains("is-zoomed");
			// In fit mode the mark sits on the photograph, including portrait images.
			// In zoom mode keep the mark visible inside the pan area.
			label.style.right = `${
				zoomed ? 12 : Math.max(12, (width - image.naturalWidth * fit) / 2 + 12)
			}px`;
			label.style.bottom = `${
				zoomed
					? 12
					: Math.max(12, (height - image.naturalHeight * fit) / 2 + 12)
			}px`;
		};
		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(align);
		};
		const syncLightbox = () => {
			const source = image.getAttribute("src");
			if (!source) return;
			label = mark(viewport, bySource.get(sourceKey(source)) || {});
			schedule();
		};
		new MutationObserver(syncLightbox).observe(image, {
			attributes: true,
			attributeFilter: ["src"],
		});
		new MutationObserver(schedule).observe(lightbox, {
			attributes: true,
			attributeFilter: ["class", "open"],
		});
		image.addEventListener("load", syncLightbox);
		if ("ResizeObserver" in window)
			new ResizeObserver(schedule).observe(viewport);
		addEventListener("resize", schedule, { passive: true });
		syncLightbox();
	}
	return { initPhotoWatermarks };
})();

function dxOnPageReady(callback) {
	const run = () => Promise.resolve(window.dxPageReady).then(callback);
	if (document.readyState === "loading")
		document.addEventListener("DOMContentLoaded", run, { once: true });
	else run();
}
// Overall scores use /10 internally; the five middle bands span 14% each.
const gymOverallBands = [
	{
		tone: "maroon",
		label: "Diabolical",
		range: "0–<15%",
		min: 0,
		width: 15,
		color: "#8c354b",
		emoji: "💩",
	},
	{
		tone: "bad",
		label: "Bad",
		range: "15–<29%",
		min: 1.5,
		width: 14,
		color: "#d85b70",
		emoji: "😡",
	},
	{
		tone: "red",
		label: "Poor",
		range: "29–<43%",
		min: 2.9,
		width: 14,
		color: "#ef8585",
		emoji: "👎🏾",
	},
	{
		tone: "amber",
		label: "Mixed",
		range: "43–<57%",
		min: 4.3,
		width: 14,
		color: "#e5a653",
		emoji: "🤷🏽‍♂️",
	},
	{
		tone: "green",
		label: "Positive",
		range: "57–<71%",
		min: 5.7,
		width: 14,
		color: "#82c995",
		emoji: "👍🏾",
	},
	{
		tone: "great",
		label: "Excellent",
		range: "71–<85%",
		min: 7.1,
		width: 14,
		color: "#6ed9c5",
		emoji: "🤩",
	},
	{
		tone: "diamond",
		label: "Outstanding",
		range: "85–100%",
		min: 8.5,
		width: 15,
		color: "#b9eaff",
		emoji: "💎",
	},
];

const gymOverallBand = (percentage) =>
	[...gymOverallBands].reverse().find((band) => percentage >= band.min * 10) ||
	gymOverallBands[0];

// Progressive enhancement: original review content remains usable without JavaScript.
function initGymLeague(archive, cards) {
	const make = (tag, cls, text) => {
		const el = document.createElement(tag);
		el.className = cls;
		if (text) el.textContent = text;
		return el;
	};
	const tone = (value) => {
		const n = Number(value);
		return value === "" || !Number.isFinite(n) || n < 0
			? "unrated"
			: n >= 9
			? "diamond"
			: n >= 7
			? "green"
			: n >= 5
			? "amber"
			: n >= 3
			? "red"
			: "maroon";
	};
	const bands = gymOverallBands;
	const overallBand = (value) => {
		const n = Number(value);
		return value === "" || !Number.isFinite(n) || n < 0
			? { tone: "unrated", label: "Not assessed", emoji: "" }
			: [...bands].reverse().find((band) => n >= band.min);
	};
	const overallTone = (value) => overallBand(value).tone;
	const ratingEmoji = Object.fromEntries(
		bands.map((band) => [band.tone, band.emoji]),
	);
	ratingEmoji.unrated = "";
	const grid = archive.querySelector("[data-gyms-grid]");
	const header = make("header", "league-heading");
	header.append(
		make(
			"p",
			"league-eyebrow",
			`THE GYM LEAGUE · ${cards.length} BRANCHES LOGGED`,
		),
		make("h2", "", "The full field."),
		make(
			"p",
			"league-intro",
			"Personally visited. Honestly rated. Find your next place to train.",
		),
	);
	const watermark = make("span", "league-watermark", String(cards.length));
	watermark.setAttribute("aria-hidden", "true");
	header.append(watermark);
	watermark.textContent = "0";
	const countObserver = new IntersectionObserver(
		(entries) => {
			if (!entries.some((e) => e.isIntersecting)) return;
			countObserver.disconnect();
			const start = performance.now();
			const tick = (now) => {
				const progress = matchMedia("(prefers-reduced-motion: reduce)").matches
					? 1
					: Math.min(1, (now - start) / 1500);
				watermark.textContent = String(
					Math.round(cards.length * (1 - Math.pow(1 - progress, 3))),
				);
				if (progress < 1) requestAnimationFrame(tick);
			};
			requestAnimationFrame(tick);
		},
		{ threshold: 0.1 },
	);
	countObserver.observe(grid);
	// Rating bands are presented in the scoring guide, keeping the league header compact.
	const method = make("button", "league-method-trigger", "How I score gyms");
	method.type = "button";
	method.setAttribute("aria-haspopup", "dialog");
	method.setAttribute("aria-controls", "league-scoring-guide");
	const guide = make("dialog", "league-scoring-guide");
	guide.id = "league-scoring-guide";
	guide.setAttribute("aria-labelledby", "league-scoring-title");
	const close = make("button", "league-scoring-close", "Close ×");
	close.type = "button";
	close.setAttribute("aria-label", "Close scoring guide");
	const title = make("h2", "", "How I score gyms");
	title.id = "league-scoring-title";
	guide.append(
		close,
		title,
		make(
			"p",
			"",
			"Ratings reflect my visits, membership tier and personal experience. The latest dated visit sets each branch’s league rating.",
		),
	);
	guide.append(
		make(
			"p",
			"",
			"The overall percentage is a weighted average: gym ×2, wetside ×1.5, spa ×2, café / work ×1, cleanliness ×2.5 and parking ×1. Unassessed and unavailable facilities are excluded; zero is a scored result.",
		),
	);
	guide.append(make("h3", "", "Overall rating scale"));
	const scale = make("div", "league-scale");
	scale.setAttribute("aria-hidden", "true");
	bands.forEach((band) => {
		const segment = make("span", "");
		segment.style.width = `${band.width}%`;
		segment.style.backgroundColor = band.color;
		scale.append(segment);
	});
	const axis = make("div", "league-scale-axis");
	axis.setAttribute("aria-hidden", "true");
	[0, 25, 50, 75, 100].forEach((value) => {
		const tick = make("span", "", `${value}%`);
		tick.style.left = `${value}%`;
		axis.append(tick);
	});
	const key = make("ul", "league-scale-key");
	[...bands].reverse().forEach((band) => {
		const row = make("li", "");
		const swatch = make("span", "league-scale-swatch");
		swatch.style.backgroundColor = band.color;
		swatch.setAttribute("aria-hidden", "true");
		row.append(
			swatch,
			make("span", "", `${band.emoji} ${band.label}`),
			make("span", "league-scale-range", band.range),
		);
		key.append(row);
	});
	guide.append(
		scale,
		axis,
		key,
		make(
			"p",
			"league-scoring-note",
			"Individual category scores retain their own scale: Outstanding 9–10, Positive 7–<9, Mixed 5–<7, Poor 3–<5, Diabolical below 3.",
		),
	);
	document.body.append(guide);
	method.addEventListener("click", () => guide.showModal());
	close.addEventListener("click", () => guide.close());
	guide.addEventListener("click", (event) => {
		if (event.target !== guide) return;
		const bounds = guide.getBoundingClientRect();
		if (
			event.clientX < bounds.left ||
			event.clientX > bounds.right ||
			event.clientY < bounds.top ||
			event.clientY > bounds.bottom
		)
			guide.close();
	});
	guide.addEventListener("close", () => method.focus({ preventScroll: true }));
	header.append(method);
	archive.prepend(header);
	archive.querySelector(".gym-view-toggle")?.remove();
	archive
		.querySelectorAll(".gym-filter-buttons button")
		.forEach((b) =>
			b.setAttribute("aria-pressed", String(b.classList.contains("is-active"))),
		);
	const tray = archive.querySelector("[data-gym-compare-bar]");
	if (tray) archive.append(tray);
	const layout = make("div", "league-layout");
	grid.before(layout);
	const left = make("div", "league-list-pane");
	layout.append(left);
	left.append(grid);
	archive.querySelector(".gym-pagination")?.remove();
	const panel = make("aside", "league-detail");
	panel.id = "gym-branch-detail";
	panel.setAttribute("aria-label", "Selected branch details");
	layout.append(panel);
	// Map assets load only when requested; list browsing needs no external map requests.
	const mapPane = make("div", "league-map-pane");
	const mapStatus = make("p", "league-map-status");
	mapStatus.setAttribute("role", "status");
	const mapCanvas = make("div", "league-map-canvas");
	mapCanvas.setAttribute("aria-label", "Gym review locations");
	const mapChoices = make("div", "league-map-choices");
	const mapChoiceCards = new Map();
	mapChoices.setAttribute("aria-label", "Matching gym reviews");
	mapPane.append(mapStatus, mapCanvas, mapChoices);
	mapPane.hidden = true;
	left.append(mapPane);
	const switcher = make("div", "league-view-switch");
	switcher.setAttribute("role", "group");
	switcher.setAttribute("aria-label", "Gym view");
	const listButton = make("button", "", "List");
	const mapButton = make("button", "", "Map");
	const gridButton = make("button", "", "Grid");
	const mosaic = make("div", "league-mosaic");
	mosaic.hidden = true;
	layout.after(mosaic);
	let gridView = false;
	[listButton, gridButton, mapButton].forEach((button) => {
		button.type = "button";
		switcher.append(button);
	});
	archive.querySelector(".filter-inputs").append(switcher);
	let mapView = false,
		mapInstance,
		mapMarkers,
		mapAssets,
		mapCards = [];
	const coordinates = (card) => {
		const lat = Number(card.dataset.lat),
			lng = Number(card.dataset.lng);
		return card.dataset.lat?.trim() &&
			card.dataset.lng?.trim() &&
			Number.isFinite(lat) &&
			Number.isFinite(lng) &&
			Math.abs(lat) <= 90 &&
			Math.abs(lng) <= 180
			? [lat, lng]
			: null;
	};
	const loadMapAssets = () => {
		if (window.L) return Promise.resolve();
		if (mapAssets) return mapAssets;
		mapAssets = new Promise((resolve, reject) => {
			const css = document.createElement("link");
			css.rel = "stylesheet";
			css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
			document.head.append(css);
			const script = document.createElement("script");
			script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
			script.onload = resolve;
			script.onerror = reject;
			document.head.append(script);
		});
		return mapAssets;
	};
	function renderLeagueMap() {
		if (!mapView) return;
		mapStatus.textContent = "Loading map…";
		return loadMapAssets()
			.then(() => {
				if (!mapView) return;
				if (!mapInstance) {
					mapInstance = window.L.map(mapCanvas, {
						scrollWheelZoom: false,
					}).setView([54, -2], 5);
					const baseTiles = window.L.tileLayer(
						"https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=cb1_49v4_1_6f4e11cc72c4a39104c6f6c9",
						{
							attribution:
								'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
							maxZoom: 19,
						},
					).addTo(mapInstance);
					baseTiles.on("tileerror", () => {
						mapStatus.textContent =
							"Map background could not load. Check the CARTO key’s website restrictions; gym pins and reviews are still available.";
					});
					mapMarkers = window.L.layerGroup().addTo(mapInstance);
				}
				mapMarkers.clearLayers();
				mapChoices.replaceChildren();
				mapChoiceCards.clear();
				const points = [];
				mapCards.forEach((card) => {
					const point = coordinates(card);
					const choice = make("button", "league-map-choice");
					const info = make("span", "league-map-choice-info");
					info.append(
						make("strong", "", card.dataset.branchLabel),
						make(
							"small",
							"",
							`${card.dataset.chainLabel}${point ? "" : " · Pin unavailable"}`,
						),
					);
					const score = make(
						"span",
						"league-map-choice-score",
						card.dataset.overallLabel,
					);
					score.dataset.tone = overallTone(card.dataset.overall);
					choice.append(info, score);
					choice.setAttribute("aria-pressed", String(card === selected));
					mapChoiceCards.set(choice, card);
					choice.type = "button";
					choice.addEventListener("click", () => {
						select(card);
						if (point) mapInstance.setView(point, 13);
					});
					mapChoices.append(choice);
					if (!point) return;
					points.push(point);
					const pin = make("span", "league-map-pin", card.dataset.overallLabel);
					pin.dataset.tone = overallTone(card.dataset.overall);
					const marker = window.L.marker(point, {
						title: `${card.dataset.chainLabel} · ${card.dataset.branchLabel}: ${card.dataset.overallLabel}`,
						icon: window.L.divIcon({
							className: "league-map-marker",
							html: pin.outerHTML,
							iconSize: [66, 30],
							iconAnchor: [33, 30],
						}),
					}).addTo(mapMarkers);
					marker.bindTooltip(
						document.createTextNode(
							`${card.dataset.chainLabel} · ${card.dataset.branchLabel}`,
						),
					);
					marker.on("click", () => {
						select(card);
						if (!media.matches)
							panel.scrollIntoView({
								block: "start",
								behavior: reducedMotion.matches ? "instant" : "smooth",
							});
					});
				});
				const missing = mapCards.length - points.length;
				mapStatus.textContent = `${points.length} gyms on the map${
					missing ? ` · ${missing} without a pin` : ""
				}. Select a pin or branch below.`;
				mapInstance.invalidateSize();
				if (points.length)
					mapInstance.fitBounds(points, { padding: [35, 35], maxZoom: 13 });
			})
			.catch(() => {
				mapStatus.textContent =
					"The map could not load. Please use List view and try again later.";
				mapAssets = null;
			});
	}
	function setLeagueView(useMap, useGrid = false) {
		mapView = useMap;
		gridView = useGrid;
		layout.hidden = gridView;
		mosaic.hidden = !gridView;
		gridButton.setAttribute("aria-pressed", String(gridView));
		archive.classList.toggle("is-map-view", mapView);
		listButton.setAttribute("aria-pressed", String(!mapView && !gridView));
		mapButton.setAttribute("aria-pressed", String(mapView));
		grid.hidden = mapView;
		mapPane.hidden = !mapView;
		place();
		renderLeagueMap();
	}
	listButton.addEventListener("click", () => {
		setLeagueView(false);
		archive.dispatchEvent(new Event("league-view-change"));
	});
	mapButton.addEventListener("click", () => {
		setLeagueView(true);
		archive.dispatchEvent(new Event("league-view-change"));
	});
	gridButton.addEventListener("click", () => {
		setLeagueView(false, true);
		archive.dispatchEvent(new Event("league-view-change"));
	});
	gridButton.setAttribute("aria-pressed", "false");
	listButton.setAttribute("aria-pressed", "true");
	mapButton.setAttribute("aria-pressed", "false");
	const count = make("p", "league-result-count");
	count.setAttribute("role", "status");
	layout.before(count);
	const columns = make("div", "league-columns");
	columns.setAttribute("aria-hidden", "true");
	["POS", "BRANCH", "OVERALL", "READ", "COMPARE"].forEach((s) =>
		columns.append(make("span", "", s)),
	);
	grid.prepend(columns);
	let selected = null;
	const media = window.matchMedia("(min-width: 992px)");
	const details = new Map();
	const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
	let animationFrame = 0;
	let pendingAnimation = null;
	const animationObserver = new IntersectionObserver(
		(entries) => {
			if (entries.some((entry) => entry.isIntersecting) && pendingAnimation) {
				animationObserver.disconnect();
				const start = pendingAnimation;
				pendingAnimation = null;
				start();
			}
		},
		{ threshold: 0.15 },
	);
	function stopAnimation() {
		cancelAnimationFrame(animationFrame);
		animationObserver.disconnect();
		pendingAnimation = null;
	}
	function animateDetails(card) {
		stopAnimation();
		const total = panel.querySelector(".league-total");
		const target = Number(card.dataset.overall);
		const rated =
			card.dataset.overall !== "" && Number.isFinite(target) && target >= 0;
		const bars = [
			...panel.querySelectorAll(
				".dx-score-block[data-score] .dx-score-bar span",
			),
		];
		const paint = (progress) => {
			if (rated) {
				const current = target * progress;
				total.querySelector(".league-total-number").textContent =
					progress === 1
						? card.dataset.overallLabel
						: `${(current * 10).toFixed(1)}%`;
				total.dataset.tone = overallTone(current);
				total.querySelector(".league-total-emoji").textContent =
					overallBand(current).emoji;
				total.querySelector(".league-total-rating-label").textContent =
					overallBand(current).label;
			}
			bars.forEach((bar) => {
				const block = bar.closest("[data-score]");
				const value = Number(block.dataset.score);
				block.dataset.tone = tone(value * progress);
				const label = block.querySelector(".dx-score-value");
				if (label) {
					label.setAttribute("aria-label", `${value}/10`);
					label.textContent = `${
						progress === 1 ? value : Math.floor(value * progress)
					}/10`;
				}
				bar.style.transform = `scaleX(${
					Math.max(0, Math.min(1, value / 10)) * progress
				})`;
			});
		};
		if (reducedMotion.matches) {
			paint(1);
			return;
		}
		paint(0);
		pendingAnimation = () => {
			let started;
			const tick = (now) => {
				if (reducedMotion.matches) {
					paint(1);
					return;
				}
				started ??= now;
				const fraction = Math.min(1, (now - started) / 1200);
				paint(1 - Math.pow(1 - fraction, 3));
				if (fraction < 1) animationFrame = requestAnimationFrame(tick);
			};
			animationFrame = requestAnimationFrame(tick);
		};
		animationObserver.observe(total);
	}
	// Hidden overflow on WordPress cover wrappers would otherwise capture sticky positioning.
	for (
		let parent = archive.parentElement;
		parent && parent !== document.documentElement;
		parent = parent.parentElement
	) {
		const style = getComputedStyle(parent);
		if (style.overflowX === "hidden" || style.overflowY === "hidden")
			parent.classList.add("league-sticky-ancestor");
	}
	const stickyHeaders = [...document.querySelectorAll(".navbar, #wpadminbar")];
	const updateStickyOffset = () => {
		const bottom = stickyHeaders.reduce((offset, el) => {
			const position = getComputedStyle(el).position;
			return position === "fixed" || position === "sticky"
				? Math.max(offset, el.getBoundingClientRect().bottom)
				: offset;
		}, 0);
		const safeTop = Math.max(16, bottom + 16);
		archive.style.setProperty("--league-sticky-safe-top", `${safeTop}px`);
		const height = panel.getBoundingClientRect().height;
		const available = Math.max(0, window.innerHeight - safeTop - 16);
		const centered = safeTop + Math.max(0, (available - height) / 2);
		archive.style.setProperty("--league-sticky-top", `${centered}px`);
	};
	const headerObserver = new ResizeObserver(updateStickyOffset);
	stickyHeaders.forEach((el) => headerObserver.observe(el));
	headerObserver.observe(panel);
	window.addEventListener("resize", updateStickyOffset, { passive: true });
	updateStickyOffset();
	const ranks = new Map(
		[...cards]
			.sort(
				(a, b) =>
					Number(b.dataset.overall) - Number(a.dataset.overall) ||
					a.dataset.branch.localeCompare(b.dataset.branch),
			)
			.map((c, i) => [c, i + 1]),
	);
	cards.forEach((card) => {
		const content = make("div", "league-detail-content");
		if (card.dataset.featuredImage) {
			const image = make("img", "league-detail-image");
			image.alt = "";
			image.setAttribute("aria-hidden", "true");
			image.loading = "lazy";
			image.decoding = "async";
			image.src = card.dataset.featuredImage;
			const frame = make("div", "league-detail-image-frame");
			frame.append(image);
			content.append(frame);
		}
		content.append(
			make("p", "league-eyebrow", "BRANCH DETAILS"),
			make("h3", "", card.dataset.branchLabel),
			make("p", "league-detail-chain", card.dataset.chainLabel),
		);
		const loc = card.querySelector(".dx-gym-card__subtitle");
		if (loc) {
			const location = loc.cloneNode(true);
			const link = location.querySelector("a");
			if (link) {
				link.href = card.dataset.mapsUrl || link.href;
				link.target = "_blank";
				link.rel = "noopener noreferrer";
				link.addEventListener("click", (event) => event.stopPropagation());
			}
			content.append(location);
		}
		const score = make("div", "league-total");
		score.dataset.tone = overallTone(card.dataset.overall);
		const number = make(
			"span",
			"league-total-number",
			card.dataset.overallLabel,
		);
		const emoji = make(
			"span",
			"league-total-emoji",
			ratingEmoji[overallTone(card.dataset.overall)],
		);
		emoji.setAttribute("aria-hidden", "true");
		const badge = make("span", "league-total-rating");
		badge.setAttribute("aria-hidden", "true");
		badge.append(
			emoji,
			make(
				"span",
				"league-total-rating-label",
				overallBand(card.dataset.overall).label,
			),
		);
		score.append(number, badge);
		score.setAttribute("role", "img");
		score.setAttribute(
			"aria-label",
			`${card.dataset.overallLabel} overall rating, ${
				overallBand(card.dataset.overall).label
			}`,
		);
		content.append(score, make("p", "league-total-label", "OVERALL RATING"));
		const awards = make("div", "league-awards");
		card
			.querySelectorAll(".dx-badge--rank,.dx-badge--category")
			.forEach((b) => awards.append(b.cloneNode(true)));
		content.append(awards);
		const scores = card.querySelector(".dx-gym-card__scores")?.cloneNode(true);
		if (scores) {
			scores.querySelectorAll(".dx-score-block").forEach((block) => {
				block.dataset.tone = tone(block.dataset.score ?? "");
			});
			content.append(scores);
		}
		content.append(make("h4", "league-notes-title", "Field notes"));
		const notes = make("div", "league-notes");
		const original = card.querySelector("[data-notes-panel]");
		if (original) notes.innerHTML = original.innerHTML;
		content.append(notes);
		content.append(
			make(
				"p",
				"league-visit",
				`Visited ${card.dataset.visitedLabel} · ${card.dataset.membership}`,
			),
		);
		let history = [];
		try {
			history = JSON.parse(card.dataset.visitHistory || "[]");
		} catch {
			history = [];
		}
		if (history.length) {
			const visits = make("details", "league-history");
			visits.append(
				make("summary", "", `Visit history · ${history.length + 1} reviews`),
			);
			visits.append(
				make(
					"p",
					"league-visit",
					"The latest dated visit sets the league rating. Earlier visits are retained below.",
				),
			);
			history.forEach((visit) => {
				const entry = make("article", "league-history-entry");
				entry.append(make("h4", "", visit.date || "Date not recorded"));
				const overall = make(
					"strong",
					"",
					visit.overall === null
						? "Not assessed"
						: `${(visit.overall * 10).toFixed(1)}%`,
				);
				overall.dataset.tone = overallTone(
					visit.overall === null ? "" : visit.overall,
				);
				entry.append(overall);
				const list = make("dl", "league-history-scores");
				Object.entries(visit.scores).forEach(([label, value]) => {
					list.append(
						make("dt", "", label),
						make(
							"dd",
							"",
							value === null
								? "Not assessed"
								: value === "unavailable"
								? "Unavailable"
								: `${value}/10`,
						),
					);
				});
				entry.append(list, make("p", "", visit.notes));
				const link = make("a", "", "Read this visit ↗");
				link.href = visit.url;
				entry.append(link);
				visits.append(entry);
			});
			content.append(visits);
		}
		const review = make("a", "league-review", "Read full review ↗");
		review.href = card.dataset.link;
		content.append(review);
		details.set(card, content);
		const btn = make("button", "league-select");
		btn.type = "button";
		btn.setAttribute("aria-controls", panel.id);
		btn.setAttribute("aria-expanded", "false");
		const info = make("span", "league-row-info");
		info.append(
			make("strong", "", card.dataset.branchLabel),
			make(
				"small",
				"",
				`${card.dataset.chainLabel}${
					loc ? " · " + loc.textContent.replace("📍", "").trim() : ""
				}`,
			),
		);
		const value = make("strong", "league-row-score", card.dataset.overallLabel);
		value.dataset.tone = overallTone(card.dataset.overall);
		btn.append(
			make("span", "league-rank", String(ranks.get(card)).padStart(2, "0")),
			info,
			value,
		);
		btn.addEventListener("click", () => {
			if (selected === card && !media.matches) {
				stopAnimation();
				selected = null;
				panel.hidden = true;
				syncSelection();
			} else select(card, true);
		});
		const compare = card.querySelector("[data-gym-compare-toggle]");
		if (compare) {
			compare.setAttribute("aria-label", `Compare ${card.dataset.branchLabel}`);
			compare.querySelector(".label-add").textContent = "+";
			compare.querySelector(".label-remove").textContent = "✓";
		}
		card.prepend(btn);
	});
	function syncSelection() {
		mapChoiceCards.forEach((card, button) =>
			button.setAttribute("aria-pressed", String(card === selected)),
		);
		cards.forEach((c) => {
			c.classList.toggle("is-current", c === selected);
			c.querySelector(".league-select").setAttribute(
				"aria-expanded",
				String(c === selected && !panel.hidden),
			);
		});
	}
	function place() {
		if (selected && !panel.hidden) {
			if (media.matches || mapView) layout.append(panel);
			else selected.after(panel);
		} else layout.append(panel);
	}
	// Wait for the photograph before fading it in, including cached images.
	function revealDetailImage() {
		const image = panel.querySelector(".league-detail-image");
		if (!image) return;
		image.getAnimations().forEach((animation) => animation.cancel());
		image.style.opacity = "0";
		image
			.decode()
			.then(() => {
				if (!panel.contains(image)) return;
				image.style.removeProperty("opacity");
				if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
					image.animate(
						[
							{ opacity: 0, transform: "scale(1)" },
							{ opacity: 0.66, transform: "scale(1.04)" },
						],
						{ duration: 400, easing: "ease-out" },
					);
				}
			})
			.catch(() => {
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
				const offset =
					parseFloat(
						archive.style.getPropertyValue("--league-sticky-safe-top"),
					) || 16;
				window.scrollTo({
					top: Math.max(
						0,
						window.scrollY + card.getBoundingClientRect().top - offset,
					),
					behavior: reducedMotion.matches ? "instant" : "smooth",
				});
			});
		}
	}
	media.addEventListener("change", place);
	archive.classList.add("is-premium-league");
	if (matchMedia("(max-width: 767.98px)").matches) setLeagueView(false, true);
	return {
		update(ordered, visibleCount) {
			mapCards = ordered;
			renderLeagueMap();
			const shown =
				mapView || gridView ? ordered : ordered.slice(0, visibleCount);
			mosaic.replaceChildren();
			if (gridView)
				shown.forEach((card) => {
					const tile = make("a", "league-mosaic-tile");
					tile.href = card.dataset.link;
					if (card.dataset.featuredImage) {
						const image = make("img", "");
						image.src = card.dataset.featuredImage;
						image.alt = card.dataset.branchLabel;
						image.loading = "lazy";
						tile.append(image);
					} else {
						tile.classList.add("has-no-image");
						const image = make("img", "");
						image.src =
							"/wp-content/themes/dxndre/assets/img/gym-placeholder.svg";
						image.alt = "Gym photograph coming soon";
						image.loading = "lazy";
						tile.append(image);
					}
					const caption = make("span", "league-mosaic-caption");
					caption.append(
						make("strong", "", card.dataset.branchLabel),
						make("small", "", card.dataset.chainLabel),
					);
					const score = make(
						"span",
						"league-mosaic-score",
						card.dataset.overallLabel,
					);
					const band = overallBand(card.dataset.overall);
					score.style.color = band.color || "#bcbcb7";
					tile.append(caption, score);
					mosaic.append(tile);
				});
			count.textContent = `${shown.length} of ${ordered.length} branches shown`;
			if (!shown.length) {
				stopAnimation();
				selected = null;
				panel.hidden = true;
				syncSelection();
				place();
			} else if (!selected || !shown.includes(selected)) select(shown[0]);
			else place();
		},
	};
}

// Page interactions and shared controllers.

(function () {
	"use strict";

	// n
	// Navbar scroll state toggle
	function initNavbarScrolled() {
		const nav = document.querySelector(".navbar");
		if (!nav) return;

		let previous = window.scrollY;
		const onScroll = () => {
			const y = Math.max(0, window.scrollY),
				delta = y - previous;
			nav.classList.toggle("scrolled", y > 10);
			if (Math.abs(delta) > 6 || y < 80) {
				const open = document.querySelector(
					'#dx-menu-toggle[aria-expanded="true"]',
				);
				nav.classList.toggle(
					"dx-nav-hidden",
					y > 140 &&
						delta > 0 &&
						!open &&
						!nav.contains(document.activeElement),
				);
				previous = y;
			}
		};
		nav.addEventListener("focusin", () =>
			nav.classList.remove("dx-nav-hidden"),
		);

		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
	}

	dxOnPageReady(initNavbarScrolled);

	// Focus input if Searchform is empty
	[].forEach.call(document.querySelectorAll(".search-form"), (el) => {
		el.addEventListener("submit", function (e) {
			var search = el.querySelector("input");
			if (search.value.length < 1) {
				e.preventDefault();
				search.focus();
			}
		});
	});

	// Initialize Popovers
	var popoverTriggerList = [].slice.call(
		document.querySelectorAll('[data-bs-toggle="popover"]'),
	);
	popoverTriggerList.map(function (popoverTriggerEl) {
		return new bootstrap.Popover(popoverTriggerEl, {
			trigger: "focus",
		});
	});

	dxOnPageReady(() => {
		/* ==========================
		   VIEWPORT-ACTIVE SECTIONS
		========================== */

		const sections = document.querySelectorAll("section");

		const sectionObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (
						entry.target.classList.contains("story-section") ||
						entry.target.classList.contains("story-hero") ||
						entry.target.querySelector("[data-gyms-archive]")
					) {
						return;
					}

					if (entry.isIntersecting) {
						entry.target.classList.add("viewport-active");
					} else {
						entry.target.classList.remove("viewport-active");
					}
				});
			},
			{
				threshold: 0.1,
				rootMargin: "-20% 0px -20% 0px",
			},
		);

		sections.forEach((section) => sectionObserver.observe(section));

		/* ==========================
		   STAT COUNTER ANIMATION
		========================== */
		const counters = document.querySelectorAll(".stat-figure");

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

				el.textContent = `${value}${suffix ? suffix : ""}`;

				if (progress < 1) {
					requestAnimationFrame(tick);
				} else {
					el.textContent = `${target}${suffix ? suffix : ""}`;
				}
			};

			requestAnimationFrame(tick);
		};

		const counterObserver = new IntersectionObserver(
			(entries, obs) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						animateCounter(entry.target);
						obs.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.4 },
		);

		counters.forEach((counter) => counterObserver.observe(counter));

		/* ==========================
		   BODY STATE: CLIENT JOURNEY
		========================== */
		const body = document.body;
		const journeySection = document.querySelector(".client-journey");
		const techStackSection = document.querySelector(".tech-stack");

		if (journeySection) {
			const journeyObserver = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						body.classList.add("client-journey-section");
					} else {
						body.classList.remove("client-journey-section");
					}
				},
				{ threshold: 0.35 },
			);

			journeyObserver.observe(journeySection);
		}

		if (techStackSection) {
			const techStackObserver = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						body.classList.add("tech-stack-section");
					} else {
						body.classList.remove("tech-stack-section");
					}
				},
				{ threshold: 0.35 },
			);

			techStackObserver.observe(techStackSection);
		}
	});

	/* ==========================
	PROCESS STEP CYCLER (DEBUG MODE)
	========================== */

	const processSteps = document.querySelectorAll(".process-step");

	if (processSteps.length) {
		let currentIndex = 0;

		// Clear any existing state
		processSteps.forEach((step) => step.classList.remove("is-active"));

		// Activate first step
		processSteps[0].classList.add("is-active");

		setInterval(() => {
			// Remove active from current
			processSteps[currentIndex].classList.remove("is-active");

			// Move to next
			currentIndex = (currentIndex + 1) % processSteps.length;

			// Add active to next
			processSteps[currentIndex].classList.add("is-active");
		}, 5000);
	}

	const processTrack = document.querySelector(
		".process-area > .wp-block-group__inner-container",
	);

	if (processTrack && processSteps.length) {
		const stepDistance = 400 + 160; // 400px step + ~10em gap
		let currentOffset = 0;

		setInterval(() => {
			currentOffset = (currentOffset + 1) % processSteps.length;

			processTrack.style.transform = `translateX(-${
				currentOffset * stepDistance
			}px)`;
		}, 5000);
	}

	// Duplicate Footnotes at runtime

	dxOnPageReady(() => {
		const tracks = document.querySelectorAll(".footline-track");
		if (!tracks.length) return;

		const DUPLICATES = 2;

		tracks.forEach((track) => {
			const item = track.querySelector(".footline");
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
		const menu = document.getElementById("navbar");
		const toggle = document.getElementById("dx-menu-toggle");

		if (!menu || !toggle) return;

		// Prevent duplicate initialisation.
		if (menu.dataset.dxInitialized === "true") return;

		menu.dataset.dxInitialized = "true";

		const body = document.body;

		const focusableSelector = [
			"a[href]",
			"button:not([disabled])",
			"input:not([disabled])",
			"select:not([disabled])",
			"textarea:not([disabled])",
			'[tabindex]:not([tabindex="-1"])',
		].join(",");

		let previouslyFocused = null;
		let isOpen = false;

		const getFocusable = () => {
			const controls = [
				...menu.querySelectorAll(focusableSelector),
				...document.querySelectorAll(
					"#header .dxndre-nav-left a, " +
						"#header .dxndre-nav-left button, " +
						"#header .dxndre-nav-left input, " +
						"#header .dxndre-navbar-brand-centered",
				),
				toggle,
			];

			return [...new Set(controls)].filter((element) => {
				const style = window.getComputedStyle(element);

				return (
					element.getClientRects().length > 0 &&
					style.visibility !== "hidden" &&
					style.display !== "none" &&
					!element.closest("[inert]")
				);
			});
		};

		const lockScroll = () => {
			body.classList.add("nav-open");
		};

		const unlockScroll = () => {
			body.classList.remove("nav-open");
		};

		// Bootstrap starts opening.
		menu.addEventListener("show.bs.collapse", () => {
			delete menu.dataset.dxClosing;

			previouslyFocused = document.activeElement;

			isOpen = true;

			lockScroll();

			menu.removeAttribute("inert");
			menu.setAttribute("aria-hidden", "false");
		});

		// Bootstrap completes opening.
		menu.addEventListener("shown.bs.collapse", () => {
			isOpen = true;

			const currentLink = menu.querySelector(
				".current-menu-item > a, " + ".current_page_item > a",
			);

			const firstLink = menu.querySelector(".dx-menu__list > li > a");

			const target = currentLink || firstLink;

			if (target) {
				target.focus({ preventScroll: true });
			}
		});

		// Bootstrap starts closing.
		menu.addEventListener("hide.bs.collapse", () => {
			menu.dataset.dxClosing = "true";

			isOpen = false;

			// Keep focus away from disappearing menu items.
			if (menu.contains(document.activeElement)) {
				toggle.focus({ preventScroll: true });
			}
		});

		// Bootstrap completes closing.
		menu.addEventListener("hidden.bs.collapse", () => {
			isOpen = false;

			unlockScroll();

			menu.setAttribute("inert", "");
			menu.setAttribute("aria-hidden", "true");

			const restoreFocus = previouslyFocused;

			if (
				restoreFocus &&
				restoreFocus.isConnected &&
				typeof restoreFocus.focus === "function"
			) {
				restoreFocus.focus({ preventScroll: true });
			} else {
				toggle.focus({ preventScroll: true });
			}

			previouslyFocused = null;
		});

		// Handle keyboard accessibility.
		document.addEventListener("keydown", (event) => {
			if (!isOpen) return;

			// Escape closes the menu.
			if (event.key === "Escape") {
				event.preventDefault();

				const instance = bootstrap.Collapse.getOrCreateInstance(menu, {
					toggle: false,
				});

				instance.hide();

				return;
			}

			// Trap focus inside navigation controls.
			if (event.key !== "Tab") return;

			const focusable = getFocusable();

			if (!focusable.length) return;

			const first = focusable[0];
			const last = focusable[focusable.length - 1];

			const currentIndex = focusable.indexOf(document.activeElement);

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
		menu.querySelectorAll("a[href]").forEach((link) => {
			link.addEventListener("click", () => {
				const destination = new URL(link.href, window.location.href);

				const current = new URL(window.location.href);

				const samePage =
					destination.origin === current.origin &&
					destination.pathname === current.pathname &&
					destination.search === current.search;

				if (!samePage) return;

				const instance = bootstrap.Collapse.getOrCreateInstance(menu, {
					toggle: false,
				});

				instance.hide();
			});
		});

		// Ensure overlay is inaccessible while closed.
		if (!menu.classList.contains("show")) {
			menu.setAttribute("inert", "");
			menu.setAttribute("aria-hidden", "true");
		} else {
			isOpen = true;
			lockScroll();

			menu.removeAttribute("inert");
			menu.setAttribute("aria-hidden", "false");
		}

		// Safety net for returning from browser history.
		window.addEventListener("pageshow", () => {
			if (!menu.classList.contains("show")) {
				isOpen = false;
				unlockScroll();

				menu.setAttribute("inert", "");
				menu.setAttribute("aria-hidden", "true");
			}
		});
	}

	dxOnPageReady(initDxndreNavigation);

	// Client Dashboard Loading Test

	dxOnPageReady(() => {
		if (!document.body.classList.contains("page-dashboard")) return;

		// Dashboard-specific JS here
		console.log("Client dashboard loaded");
	});

	console.log("DX DASHBOARD JS LOADED");

	// Client Dashboard Request Update

	dxOnPageReady(() => {
		if (!document.body.classList.contains("page-dashboard")) return;

		// UX: if modal fails / Bootstrap not present, send them to fallback page
		const newTicketBtn = document.querySelector(
			'[data-bs-target="#newTicketModal"]',
		);
		if (newTicketBtn && typeof window.bootstrap === "undefined") {
			newTicketBtn.addEventListener("click", (e) => {
				e.preventDefault();
				window.location.href = "/submit-ticket/";
			});
		}

		// Request update button UX-only (you can wire AJAX later)
		const requestBtn = document.querySelector(".request-update");
		if (requestBtn) {
			requestBtn.addEventListener("click", () => {
				requestBtn.textContent = "Request Sent ✓";
				requestBtn.disabled = true;
				requestBtn.classList.add("is-disabled");
			});
		}
	});

	// AJAX Message posting for Client Portal status update agent

	const form = document.querySelector(".ticket-reply-form");

	if (form) {
		form.addEventListener("submit", async (e) => {
			e.preventDefault();

			const data = new FormData(form);

			const res = await fetch(form.action, {
				method: "POST",
				body: data,
			});

			const html = await res.text();

			document
				.querySelector(".ticket-thread")
				.insertAdjacentHTML("beforeend", html);

			form.reset();
		});
	}

	// Add image button for client portal support ticket form

	dxOnPageReady(() => {
		const addBtn = document.querySelector(".add-image-btn");
		const fields = document.querySelectorAll(".ticket-image-field");

		if (!addBtn || !fields.length) return;

		let visibleCount = 1;

		addBtn.addEventListener("click", () => {
			if (visibleCount < fields.length) {
				fields[visibleCount].classList.remove("is-hidden");
				visibleCount++;
			}

			if (visibleCount >= fields.length) {
				addBtn.disabled = true;
				addBtn.textContent = "Maximum images added";
			}
		});
	});

	// AJAX Tab Switching

	document.addEventListener("click", (e) => {
		const link = e.target.closest(".js-ticket-link");
		if (!link) return;

		e.preventDefault();

		console.log("Ticket clicked", link.dataset.ticketId);

		const ticketId = link.dataset.ticketId;
		const panel = document.querySelector(".dashboard-panel");

		console.log("Sending AJAX for ticket", ticketId);

		panel.classList.add("is-loading");

		const formData = new FormData();
		formData.append("action", "dx_load_ticket_panel");
		formData.append("ticket_id", ticketId);
		formData.append("nonce", DX_DASHBOARD.nonce);

		fetch(DX_DASHBOARD.ajax_url, {
			method: "POST",
			credentials: "same-origin",
			body: formData,
		})
			.then((res) => res.json())
			.then((res) => {
				if (!res.success || !res.data.html) {
					panel.innerHTML = "<p>Unable to load ticket.</p>";
					return;
				}

				panel.innerHTML = res.data.html;
				panel.classList.remove("is-loading");

				document
					.querySelectorAll(".ticket")
					.forEach((t) => t.classList.remove("is-active"));

				link.closest(".ticket").classList.add("is-active");
			})
			.catch((err) => {
				console.error("FETCH FAILED", err);
				panel.classList.remove("is-loading");
			});
	});

	// Tab JS for Client Portal

	document.addEventListener("click", (e) => {
		const tab = e.target.closest(".dashboard-tab[data-status]");
		if (!tab) return;

		const status = tab.dataset.status;

		document
			.querySelectorAll(".dashboard-tab")
			.forEach((t) => t.classList.remove("is-active"));
		tab.classList.add("is-active");

		document.querySelectorAll(".ticket").forEach((ticket) => {
			const ticketStatus = ticket.dataset.status;

			if (status === "open") {
				ticket.style.display =
					ticketStatus !== "resolved" && ticketStatus !== "cancelled"
						? ""
						: "none";
			} else {
				ticket.style.display = ticketStatus === status ? "" : "none";
			}
		});
	});

	// Cancel Ticket

	document.addEventListener("click", (e) => {
		const btn = e.target.closest(".js-cancel-ticket");
		if (!btn) return;

		const ticketId = btn.dataset.ticketId;
		const input = document.getElementById("cancel-ticket-id");

		if (input) {
			input.value = ticketId;
		}
	});

	// Tab Switching using keyboard

	document.addEventListener("keydown", (e) => {
		if (!document.body.classList.contains("page-dashboard")) return;

		const tickets = [...document.querySelectorAll(".ticket")];
		const active = document.querySelector(".ticket.is-active");
		if (!active) return;

		let index = tickets.indexOf(active);

		if (e.key === "ArrowDown") {
			e.preventDefault();
			index = Math.min(index + 1, tickets.length - 1);
			tickets[index].querySelector(".js-ticket-link").click();
		}

		if (e.key === "ArrowUp") {
			e.preventDefault();
			index = Math.max(index - 1, 0);
			tickets[index].querySelector(".js-ticket-link").click();
		}
	});

	// Make the panel load once
	dxOnPageReady(() => {
		const first = document.querySelector(".js-ticket-link");
		if (first) {
			first.click();
		}
	});

	// Converting Gallery into carousel
	document.querySelectorAll(".wp-block-group.gallery").forEach((gallery) => {
		const track = gallery.querySelector(".wp-block-gallery");
		if (!track) return;

		// Prevent double-init
		if (track.dataset.cloned) return;
		track.dataset.cloned = "true";

		const slides = [...track.children];

		slides.forEach((slide) => {
			track.appendChild(slide.cloneNode(true));
		});
	});

	// Duplicating Gallery Carousel

	document.querySelectorAll(".wp-block-group.gallery").forEach((gallery) => {
		const track = gallery.querySelector(".wp-block-gallery");
		if (!track) return;

		// Prevent double backdrop creation
		if (gallery.querySelector(".gallery-backdrop")) return;

		// Clone the gallery
		const backdrop = track.cloneNode(true);

		// Mark + style hook
		backdrop.classList.add("gallery-backdrop");
		backdrop.setAttribute("aria-hidden", "true");

		// Insert backdrop before the original
		track.parentNode.insertBefore(backdrop, track);

		// Ensure stacking context
		gallery.style.position = "relative";
	});

	// Adding glowing backgrounds to all images via duplication and class additions
	document.querySelectorAll("#main section.about figure").forEach((figure) => {
		const img = figure.querySelector("img");
		if (!img) return;

		// Prevent double cloning
		if (figure.dataset.backdrop === "true") return;
		figure.dataset.backdrop = "true";

		// Ensure positioning context
		figure.style.position = "relative";

		// Clone image
		const backdrop = img.cloneNode(true);
		backdrop.classList.add("image-backdrop");
		backdrop.setAttribute("aria-hidden", "true");

		// Insert behind original
		figure.insertBefore(backdrop, img);
	});

	// Homepage Bootstrap Modal (for identifying client)
	dxOnPageReady(() => {
		const hireBtn = document.querySelector(".js-hire-me");
		if (!hireBtn) return;

		const hireModal = new bootstrap.Modal("#hireMeModal");
		const clientModal = new bootstrap.Modal("#clientModal");
		const recruiterModal = new bootstrap.Modal("#recruiterModal");

		hireBtn.addEventListener("click", (e) => {
			e.preventDefault();
			hireModal.show();
		});

		document.querySelector(".js-client-path")?.addEventListener("click", () => {
			hireModal.hide();
			setTimeout(() => clientModal.show(), 200);
		});

		document
			.querySelector(".js-recruiter-path")
			?.addEventListener("click", () => {
				hireModal.hide();
				setTimeout(() => recruiterModal.show(), 200);
			});
	});

	// Auto-rotation of services tabs

	dxOnPageReady(() => {
		const tabs = document.querySelectorAll(".services-nav .nav-link");
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
			tab.addEventListener("mouseenter", stopRotation);
			tab.addEventListener("focus", stopRotation);

			tab.addEventListener("mouseleave", () => {
				index = i;
				startRotation();
			});

			tab.addEventListener("click", () => {
				index = i;
			});
		});

		// const isTouch = window.matchMedia('(pointer: coarse)').matches;

		// if (!isTouch) {
		// startRotation();
		// }

		// Duplicating Services Tab images for glowing backdrop effect

		document.querySelectorAll(".service-image.foreground").forEach((img) => {
			// Prevent duplicate cloning
			if (img.dataset.hasBackdrop) return;

			const clone = img.cloneNode(true);

			clone.classList.remove("foreground");
			clone.classList.add("background");
			clone.setAttribute("aria-hidden", "true");
			clone.loading = "eager";

			img.dataset.hasBackdrop = "true";

			img.parentNode.insertBefore(clone, img);
		});
	});

	// Projects Marquee

	(() => {
		const marquee = document.querySelector(".projects-marquee");
		const track = marquee?.querySelector(".marquee-track");
		if (!track) return;

		// Duplicate content for seamless loop
		const items = [...track.children];
		items.forEach((item) => track.appendChild(item.cloneNode(true)));

		let position = 0;
		let speed = 0.6; // base speed
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

		marquee.addEventListener("mouseenter", () => {
			speed = 0.05; // slow glide instead of stop
		});

		marquee.addEventListener("mouseleave", () => {
			speed = 0.6;
		});

		animate();
	})();

	// Previous modal back button functionality

	document.addEventListener("click", (e) => {
		const backBtn = e.target.closest(".modal-back");
		if (!backBtn) return;

		const targetModal = backBtn.dataset.backTo;
		const currentModal = backBtn.closest(".modal");

		if (!targetModal || !currentModal) return;

		const currentInstance = bootstrap.Modal.getInstance(currentModal);
		currentInstance.hide();

		const nextModalEl = document.querySelector(targetModal);
		const nextInstance = new bootstrap.Modal(nextModalEl);
		nextInstance.show();
	});

	// Make sure only mone modal is open at a time

	dxOnPageReady(() => {
		// -----------------------------
		// Modal controller
		// -----------------------------
		function showModalSafely(targetSelector) {
			const openModals = document.querySelectorAll(".modal.show");

			if (openModals.length) {
				let remaining = openModals.length;

				openModals.forEach((modal) => {
					const instance = bootstrap.Modal.getInstance(modal);
					if (!instance) {
						remaining--;
						return;
					}

					modal.addEventListener(
						"hidden.bs.modal",
						() => {
							remaining--;
							if (remaining === 0) {
								openTargetModal(targetSelector);
							}
						},
						{ once: true },
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
			const isGymModal = modalEl.classList.contains("dx-gym-share-modal");

			const modal = bootstrap.Modal.getOrCreateInstance(modalEl, {
				backdrop: isGymModal ? false : "static",
				focus: true,
			});

			// 🔥 ONLY run custom backdrop logic for gym modal
			if (isGymModal) {
				const archiveSection = document.querySelector("[data-gyms-archive]");

				if (archiveSection) {
					archiveSection
						.querySelectorAll(".modal-backdrop")
						.forEach((el) => el.remove());

					const backdrop = document.createElement("div");
					backdrop.className = "modal-backdrop fade show";

					archiveSection.appendChild(backdrop);

					backdrop.addEventListener("click", () => modal.hide());
				}

				modalEl.addEventListener(
					"hidden.bs.modal",
					() => {
						document
							.querySelectorAll("[data-gyms-archive] .modal-backdrop")
							.forEach((el) => el.remove());
					},
					{ once: true },
				);
			}

			modal.show();
		}

		// -----------------------------
		// Step 2: Navigation bindings
		// -----------------------------

		// Client path
		document.querySelector(".js-client-path")?.addEventListener("click", () => {
			showModalSafely("#clientModal");
		});

		// Recruiter path
		document
			.querySelector(".js-recruiter-path")
			?.addEventListener("click", () => {
				showModalSafely("#recruiterModal");
			});

		// Back buttons (delegated)
		document.addEventListener("click", (e) => {
			const backBtn = e.target.closest(".modal-back");
			if (!backBtn) return;

			const target = backBtn.dataset.backTo;
			if (!target) return;

			showModalSafely(target);
		});

		// -----------------------------
		// Step 3: Cleanup safety net
		// -----------------------------
		document.addEventListener("hidden.bs.modal", () => {
			document.body.classList.remove("modal-open");
			document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());
		});
	});

	// Gallery marquee for Portfolio page

	document.querySelectorAll(".gallery-marquee").forEach((marquee) => {
		const track = marquee.querySelector(".gallery-track");
		if (!track) return;

		const galleries = track.querySelectorAll(".wp-block-gallery");
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
		marquee.addEventListener("mouseenter", () => (paused = true));
		marquee.addEventListener("mouseleave", () => (paused = false));

		// Pause when off-screen
		const observer = new IntersectionObserver(
			(entries) => {
				paused = !entries[0].isIntersecting;
			},
			{ threshold: 0.15 },
		);

		observer.observe(marquee);

		animate();
	});

	function initSmartSearchSuggestions() {
		const suggestionsEl = document.querySelector(".search-suggestions");
		if (!suggestionsEl || suggestionsEl.dataset.enhance !== "true") return;

		const searchInput = document.querySelector('input[type="search"]');

		const params = new URLSearchParams(window.location.search);
		const query = searchInput?.value.trim() || params.get("s")?.trim();

		if (!query) return;

		fetch(`/wp-json/wp/v2/search?search=${encodeURIComponent(query)}`)
			.then((res) => res.json())
			.then((results) => {
				if (!Array.isArray(results) || !results.length) return;

				const seen = new Set();
				const fragment = document.createDocumentFragment();

				results.slice(0, 6).forEach((item, index) => {
					if (!item.title || seen.has(item.title)) return;
					seen.add(item.title);

					const li = document.createElement("li");
					li.style.setProperty("--delay", index);

					li.innerHTML = `
						<a href="${item.url}" class="search-suggestion">
							<span class="suggestion-type">
								${item.subtype.replace("-", " ")}
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

				suggestionsEl.innerHTML = "";
				suggestionsEl.appendChild(fragment);
				suggestionsEl.classList.add("is-visible");
			})
			.catch(() => {
				// silent fail
			});
	}

	dxOnPageReady(() => {
		// Initialise search suggestions
		initSmartSearchSuggestions();

		// Visibility listener for Homepage Hero inner content
		const hero = document.querySelector(".cover-content");
		if (!hero) return;

		requestAnimationFrame(() => {
			hero.classList.add("is-revealed");
		});
	});

	/* ==========================
	CASE STUDY: STORY CONTROLLER (SIMPLIFIED)
	========================== */

	function initStoryController() {
		const sections = [...document.querySelectorAll(".story-section")];
		const nav = document.querySelector(".chapter-selector");
		if (!sections.length || !nav || document.body.dataset.storyInit) return;
		document.body.dataset.storyInit = "true";
		document.documentElement.classList.add("case-study-document");
		const backgrounds = [
			...document.querySelectorAll(".story-backgrounds .bg"),
		];
		const links = sections.map((section, i) => {
			const chapter = section.querySelector(".cs-chapter");
			if (!chapter.id) chapter.id = "chapter-" + (i + 1);
			const li = document.createElement("li"),
				a = document.createElement("a");
			a.href = "#" + chapter.id;
			a.textContent = String(i + 1).padStart(2, "0");
			a.setAttribute(
				"aria-label",
				chapter.querySelector("h2")?.textContent || "Chapter " + (i + 1),
			);
			a.title = a.getAttribute("aria-label");
			const chapterName = document.createElement("span");
			chapterName.className = "chapter-name";
			chapterName.textContent = a.title;
			a.append(chapterName);
			a.addEventListener("click", (event) => {
				if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
					return;
				event.preventDefault();
				section.scrollIntoView({
					behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
						? "instant"
						: "smooth",
				});
				history.replaceState(null, "", a.hash);
			});
			li.append(a);
			return { li, a, id: chapter.id };
		});
		nav.querySelector("ul").replaceChildren(...links.map((link) => link.li));
		sections.forEach((section) =>
			section.querySelectorAll(".cs-panel-track").forEach((track) => {
				const hint = document.createElement("p");
				hint.className = "cs-card-hint";
				hint.textContent = "Swipe or scroll across to explore →";
				track.before(hint);
				track.tabIndex = 0;
				track.setAttribute("role", "region");
				track.setAttribute(
					"aria-label",
					"Chapter cards — scroll horizontally to explore",
				);
			}),
		);
		let queued = false;
		function update() {
			queued = false;
			const active = sections.findIndex((section) => {
				const r = section.getBoundingClientRect();
				return r.top <= innerHeight / 2 && r.bottom > innerHeight / 2;
			});
			document.body.classList.toggle("is-in-chapters", active >= 0);
			nav.inert = active < 0;
			nav.setAttribute("aria-hidden", String(active < 0));
			if (active < 0) return;
			sections.forEach((section, i) =>
				section.classList.toggle("viewport-active", i === active),
			);
			links.forEach(({ li, a }, i) => {
				li.classList.toggle("is-active", i === active);
				if (i === active) a.setAttribute("aria-current", "location");
				else a.removeAttribute("aria-current");
			});
			backgrounds.forEach((bg) =>
				bg.classList.toggle("is-active", bg.dataset.bg === links[active].id),
			);
		}
		const schedule = () => {
			if (!queued) {
				queued = true;
				requestAnimationFrame(update);
			}
		};
		window.addEventListener("scroll", schedule, { passive: true });
		window.addEventListener("resize", schedule, { passive: true });
		window.addEventListener("pageshow", schedule);
		update();
	}

	dxOnPageReady(initStoryController);
	window.addEventListener("pageshow", initStoryController);

	/* ==========================
	PROJECTS ARCHIVE
	========================== */

	(() => {
		const archive = document.querySelector("[data-projects-archive]");
		if (!archive) return;

		const grid = archive.querySelector("[data-projects-grid]");
		const search = archive.querySelector("[data-project-search]");
		const filterButtons = [
			...archive.querySelectorAll(".project-filter-buttons button"),
		];
		const titleEl = archive.querySelector("[data-projects-state-title]");
		const emptyEl = archive.querySelector("[data-projects-empty]");

		if (!grid) return;

		const allCards = [...grid.querySelectorAll(".project-card")];

		let activeMode = "filter";
		let activeValue = "all";

		const LABELS = {
			all: "All",
			design: "Design",
			development: "WordPress",
			static: "Static",
			shopify: "Shopify",
			freelance: "Freelance",
			commercial: "Commercial",
		};

		const updateTitle = () => {
			if (!titleEl) return;
			titleEl.textContent = LABELS[activeValue] || "All";
		};

		const matchesFilter = (card) => {
			if (activeValue === "all") return true;

			if (activeMode === "filter") {
				const types = (card.getAttribute("data-type") || "")
					.split(/\s+/)
					.map((value) => value.trim())
					.filter(Boolean);

				return types.includes(activeValue);
			}

			if (activeMode === "context") {
				return (card.getAttribute("data-context") || "") === activeValue;
			}

			return true;
		};

		const update = () => {
			const q = (search?.value || "").trim().toLowerCase();

			let visibleCount = 0;

			allCards.forEach((card) => {
				const haystack = (card.getAttribute("data-search") || "").toLowerCase();
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

			const count = archive.querySelector("[data-projects-count]");
			if (count) count.textContent = String(visibleCount);
			const countLabel = archive.querySelector("[data-projects-count-label]");
			if (countLabel)
				countLabel.textContent = visibleCount === 1 ? "project" : "projects";
			filterButtons.forEach((button) =>
				button.setAttribute(
					"aria-pressed",
					String(button.classList.contains("is-active")),
				),
			);
			updateTitle();
		};

		filterButtons.forEach((button) => {
			button.addEventListener("click", () => {
				filterButtons.forEach((btn) => btn.classList.remove("is-active"));
				button.classList.add("is-active");

				if (button.hasAttribute("data-filter")) {
					activeMode = "filter";
					activeValue = button.getAttribute("data-filter") || "all";
				} else if (button.hasAttribute("data-context")) {
					activeMode = "context";
					activeValue = button.getAttribute("data-context") || "all";
				}

				update();
			});
		});

		search?.addEventListener("input", update);

		update();
	})();

	/* ==========================
	GYMS ARCHIVE
	========================== */

	(() => {
		const archive = document.querySelector("[data-gyms-archive]");
		if (!archive) return;

		const grid = archive.querySelector("[data-gyms-grid]");
		const search = archive.querySelector("[data-gym-search]");
		const sortSel = archive.querySelector("[data-gym-sort]");
		const buttons = [...archive.querySelectorAll(".gym-filter-buttons button")];
		const viewBtns = [...archive.querySelectorAll("[data-gym-view]")];
		const titleEl = archive.querySelector("[data-gyms-state-title]");
		const emptyEl = archive.querySelector("[data-gyms-empty]");
		const loadMore = archive.querySelector("[data-gyms-load-more]");

		const compareBar = archive.querySelector("[data-gym-compare-bar]");
		const compareCount = archive.querySelector("[data-gym-compare-count]");
		const compareSelected = archive.querySelector(
			"[data-gym-compare-selected]",
		);
		const compareTrigger = archive.querySelector("[data-gym-compare-trigger]");
		const compareClear = archive.querySelector("[data-gym-compare-clear]");
		const compareShareButtons = [
			...archive.querySelectorAll("[data-gym-compare-share]"),
		];
		const comparison = archive.querySelector("[data-gym-comparison]");
		const comparisonTable = archive.querySelector(
			"[data-gym-comparison-table]",
		);
		const comparisonClose = archive.querySelector("[data-gym-compare-close]");
		const comparisonMapEl = archive.querySelector("[data-gym-comparison-map]");

		const sharePanel = archive.querySelector("[data-gym-share-panel]");
		const shareInput = archive.querySelector("[data-gym-share-input]");
		const shareStatus = archive.querySelector("[data-gym-share-status]");
		const shareCopyBtn = archive.querySelector("[data-gym-share-copy]");
		const shareCloseBtn = archive.querySelector("[data-gym-share-close]");

		if (!grid) return;

		const allCards = [...grid.querySelectorAll("[data-gym-card]")];
		const league = initGymLeague(archive, allCards);

		const LABELS = {
			all: "All",
			davidlloyds: "David Lloyd",
			puregym: "PureGym",
			fitnessfirst: "Fitness First",
			gymbox: "Gymbox",
			virginactive: "Virgin Active",
			bodyworks: "Bodyworks Gym",
			thegymgroup: "The Gym Group",
			other: "Other",
		};

		const assessedAmenities = new Set();
		const amenities = document.createElement("fieldset");
		amenities.className = "league-amenity-filters";
		const amenityLegend = document.createElement("legend");
		amenityLegend.textContent = "Assessed amenities";
		amenities.append(amenityLegend);
		const amenityOptions = [
			["gymScore", "Gym"],
			["swimScore", "Swimming & Wetside Facilities"],
			["cafeScore", "Café & Work Area"],
			["spaScore", "Spa Retreat / Sauna Facilities"],
		];
		amenityOptions.forEach(([key, label]) => {
			const option = document.createElement("label");
			const input = document.createElement("input");
			input.type = "checkbox";
			input.value = key;
			input.addEventListener("change", () => {
				if (input.checked) assessedAmenities.add(key);
				else assessedAmenities.delete(key);
				visibleCount = 10;
				update();
			});
			option.append(input, document.createTextNode(label));
			amenities.append(option);
		});
		const toolbar = archive.querySelector(".filter-inputs");
		const filterDisclosure = document.createElement("details");
		filterDisclosure.className = "league-filter-disclosure";
		const filterSummary = document.createElement("summary");
		filterSummary.textContent = "Filters";
		const filterPanel = document.createElement("div");
		filterPanel.className = "league-filter-panel";
		const chainTitle = document.createElement("p");
		chainTitle.textContent = "Gym chains";
		const resetFilters = document.createElement("button");
		resetFilters.type = "button";
		resetFilters.textContent = "Clear filters";
		resetFilters.addEventListener("click", () => {
			assessedAmenities.clear();
			amenities.querySelectorAll("input").forEach((input) => {
				input.checked = false;
			});
			buttons.find((button) => button.dataset.chain === "all")?.click();
		});
		filterPanel.append(
			chainTitle,
			archive.querySelector(".gym-filter-buttons"),
			amenities,
			resetFilters,
		);
		filterDisclosure.append(filterSummary, filterPanel);
		toolbar.append(filterDisclosure);
		filterDisclosure.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				filterDisclosure.open = false;
				filterSummary.focus();
			}
		});
		document.addEventListener("click", (event) => {
			if (!filterDisclosure.contains(event.target))
				filterDisclosure.open = false;
		});

		let activeChain =
			buttons.find((btn) => btn.classList.contains("is-active"))?.dataset
				.chain || "all";
		let visibleCount = 10;
		let selectedGyms = [];
		let compareMap = null;
		let compareMarkers = [];

		const getBranch = (el) =>
			(el.getAttribute("data-branch") || "").trim().toLowerCase();
		const getOverall = (el) => parseFloat(el.getAttribute("data-overall")) || 0;
		const getVisitedTs = (el) =>
			parseInt(el.getAttribute("data-visited-ts"), 10) || 0;

		const updateTitle = () => {
			if (!titleEl) return;
			const label = LABELS[activeChain] || "All";
			const signature = `${label}|${search?.value || ""}|${[
				...assessedAmenities,
			].join(",")}`;
			if (titleEl.dataset.filterSignature !== signature) {
				titleEl.textContent = label;
				titleEl.dataset.filterSignature = signature;
				if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
					titleEl.animate(
						[{ backgroundSize: "0% 2px" }, { backgroundSize: "100% 2px" }],
						{ duration: 450, easing: "ease-out" },
					);
				}
			}
		};

		const sortCards = (cards) => {
			const mode = sortSel?.value || "overall_desc";
			const sorted = [...cards];

			sorted.sort((a, b) => {
				const aBranch = getBranch(a);
				const bBranch = getBranch(b);
				const aOverall = getOverall(a);
				const bOverall = getOverall(b);
				const aDate = getVisitedTs(a);
				const bDate = getVisitedTs(b);

				switch (mode) {
					case "overall_desc":
						return bOverall - aOverall || aBranch.localeCompare(bBranch);
					case "overall_asc":
						return aOverall - bOverall || aBranch.localeCompare(bBranch);
					case "date_desc":
						return bDate - aDate || aBranch.localeCompare(bBranch);
					case "date_asc":
						return aDate - bDate || aBranch.localeCompare(bBranch);
					case "za":
						return bBranch.localeCompare(aBranch);
					case "az":
					default:
						return aBranch.localeCompare(bBranch);
				}
			});

			return sorted;
		};

		const getCardData = (card) => {
			if (!card || typeof card.getAttribute !== "function") {
				return null;
			}

			return {
				id: card.getAttribute("data-gym-id") || "",
				branch: card.getAttribute("data-branch-label") || "",
				chain: card.getAttribute("data-chain-label") || "",
				link: card.getAttribute("data-link") || "",
				visited: card.getAttribute("data-visited-label") || "—",
				overall: parseFloat(card.getAttribute("data-overall")),
				overallLabel: card.getAttribute("data-overall-label") || "No rating",
				membership: card.getAttribute("data-membership") || "—",
				lat: parseFloat(card.getAttribute("data-lat")),
				lng: parseFloat(card.getAttribute("data-lng")),
				scores: {
					gym: card.getAttribute("data-gym-score") || "",
					swim: card.getAttribute("data-swim-score") || "",
					spa: card.getAttribute("data-spa-score") || "",
					cafe: card.getAttribute("data-cafe-score") || "",
					clean: card.getAttribute("data-clean-score") || "",
					parking: card.getAttribute("data-parking-score") || "",
				},
			};
		};

		const scoreLabel = (value) => {
			if (value === "" || value === null || value === undefined) return "—";
			return `${value}/10`;
		};

		const getWinnerIdsForMetric = (items, getter) => {
			let best = null;
			const ids = [];

			items.forEach((item) => {
				const value = getter(item);

				if (
					value === "" ||
					value === null ||
					value === undefined ||
					!Number.isFinite(Number(value)) ||
					Number(value) < 0 ||
					Number(value) > 10
				) {
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
				url.searchParams.set("compare", selectedGyms.join(","));
			} else {
				url.searchParams.delete("compare");
			}
			return url.toString();
		};

		const syncShareUrl = () => {
			const url = new URL(window.location.href);
			if (selectedGyms.length) {
				url.searchParams.set("compare", selectedGyms.join(","));
			} else {
				url.searchParams.delete("compare");
			}
			window.history.replaceState({}, "", url.toString());
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
				shareStatus.textContent = "";
			}

			sharePanel.hidden = false;
		};

		const closeSharePanel = () => {
			if (!sharePanel) return;
			sharePanel.hidden = true;

			if (shareStatus) {
				shareStatus.textContent = "";
			}
		};

		const copyShareLink = () => {
			const url = shareInput?.value;
			if (!url || !shareCopyBtn) return;

			const originalText =
				shareCopyBtn.dataset.originalText || shareCopyBtn.textContent;
			shareCopyBtn.dataset.originalText = originalText;

			const resetButtonState = () => {
				window.setTimeout(() => {
					shareCopyBtn.textContent = originalText;
					shareCopyBtn.classList.remove("is-success", "is-error");
				}, 2000);
			};

			const setButtonState = (text, className) => {
				shareCopyBtn.textContent = text;
				shareCopyBtn.classList.remove("is-success", "is-error");
				shareCopyBtn.classList.add(className);
				resetButtonState();
			};

			const fallbackCopy = () => {
				const tempInput = document.createElement("textarea");
				tempInput.value = url;
				tempInput.setAttribute("readonly", "readonly");
				tempInput.style.position = "fixed";
				tempInput.style.top = "-9999px";
				tempInput.style.left = "-9999px";
				document.body.appendChild(tempInput);
				tempInput.focus();
				tempInput.select();

				let copied = false;

				try {
					copied = document.execCommand("copy");
				} catch (error) {
					copied = false;
				}

				document.body.removeChild(tempInput);

				if (copied) {
					setButtonState("Link copied", "is-success");
				} else {
					setButtonState("Copy failed", "is-error");
					shareInput?.focus();
					shareInput?.select();
				}
			};

			if (
				typeof navigator !== "undefined" &&
				navigator.clipboard &&
				typeof navigator.clipboard.writeText === "function" &&
				window.isSecureContext
			) {
				navigator.clipboard
					.writeText(url)
					.then(() => {
						setButtonState("Link copied", "is-success");
					})
					.catch(() => {
						fallbackCopy();
					});
				return;
			}

			fallbackCopy();
		};

		const initComparisonMap = () => {
			if (!comparisonMapEl || typeof L === "undefined") return null;
			if (compareMap) return compareMap;

			compareMap = L.map(comparisonMapEl, {
				scrollWheelZoom: false,
				zoomControl: true,
			});

			L.tileLayer(
				"https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=cb1_49v4_1_6f4e11cc72c4a39104c6f6c9",
				{
					attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
					subdomains: "abcd",
					maxZoom: 20,
				},
			).addTo(compareMap);

			return compareMap;
		};

		const renderComparisonMap = (items) => {
			if (!comparisonMapEl) return;

			const mappable = items.filter(
				(item) => !Number.isNaN(item.lat) && !Number.isNaN(item.lng),
			);

			comparisonMapEl.hidden = true;
			comparisonMapEl.parentElement.hidden = true;
			if (!mappable.length || typeof L === "undefined") return;

			const map = initComparisonMap();
			if (!map) return;
			comparisonMapEl.hidden = false;
			comparisonMapEl.parentElement.hidden = false;

			compareMarkers.forEach((marker) => marker.remove());
			compareMarkers = [];

			const points = [];

			mappable.forEach((item) => {
				const point = [item.lat, item.lng];
				points.push(point);

				const marker = L.marker(point)
					.addTo(map)
					.bindPopup(
						`<strong>${item.branch}</strong><br>${item.chain}${
							item.overallLabel ? `<br>${item.overallLabel}` : ""
						}`,
					);

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
				comparisonTable.innerHTML = "";
				if (comparisonMapEl) comparisonMapEl.hidden = true;
				return;
			}

			const items = selectedGyms
				.map((id) =>
					allCards.find((card) => card.getAttribute("data-gym-id") === id),
				)
				.filter(Boolean)
				.map(getCardData)
				.filter(Boolean);

			if (items.length < 2) {
				comparison.hidden = true;
				comparisonTable.innerHTML = "";
				if (comparisonMapEl) comparisonMapEl.hidden = true;
				return;
			}

			const rows = [
				{
					label: "Overall",
					format: (item) => item.overallLabel,
					winners: getWinnerIdsForMetric(items, (item) => item.overall),
				},
				{
					label: "Gym",
					format: (item) => scoreLabel(item.scores.gym),
					winners: getWinnerIdsForMetric(items, (item) => item.scores.gym),
				},
				{
					label: "Swimming & Wetside Facilities",
					format: (item) => scoreLabel(item.scores.swim),
					winners: getWinnerIdsForMetric(items, (item) => item.scores.swim),
				},
				{
					label: "Spa Retreat / Sauna Facilities",
					format: (item) =>
						`${
							item.chain.toLowerCase() === "gymbox" ? "Sauna Facilities: " : ""
						}${scoreLabel(item.scores.spa)}`,
					winners: getWinnerIdsForMetric(items, (item) => item.scores.spa),
				},
				{
					label: "Café & Work Area",
					format: (item) =>
						`${
							item.chain.toLowerCase().startsWith("david lloyd")
								? "Clubroom: "
								: ""
						}${scoreLabel(item.scores.cafe)}`,
					winners: getWinnerIdsForMetric(items, (item) => item.scores.cafe),
				},
				{
					label: "Cleanliness & Maintenance",
					format: (item) => scoreLabel(item.scores.clean),
					winners: getWinnerIdsForMetric(items, (item) => item.scores.clean),
				},
				{
					label: "Parking",
					format: (item) => scoreLabel(item.scores.parking),
					winners: getWinnerIdsForMetric(items, (item) => item.scores.parking),
				},
				{
					label: "Membership",
					format: (item) => item.membership || "—",
					winners: [],
				},
				{
					label: "Visited",
					format: (item) => item.visited || "—",
					winners: [],
				},
			];

			comparisonTable.innerHTML = `
				<div class="dx-gym-comparison__table" role="table" aria-label="Gym comparison">
					<div role="row" class="dx-gym-comparison__row dx-gym-comparison__row--head ${
						items.length === 2 ? "is-two-up" : ""
					}">
						<div role="columnheader" class="dx-gym-comparison__metric">Metric</div>
						${items
							.map(
								(item) => `
							<div role="columnheader" class="dx-gym-comparison__cell dx-gym-comparison__cell--gym">
								<h3 class="branch-name">${item.branch}</h3>
								<span>${item.chain}</span>
							</div>
						`,
							)
							.join("")}
					</div>
					${rows
						.map(
							(row) => `
						<div role="row" class="dx-gym-comparison__row ${
							items.length === 2 ? "is-two-up" : ""
						}">
							<div role="rowheader" class="dx-gym-comparison__metric">${row.label}</div>
							${items
								.map(
									(item) => `
								<div role="cell" class="dx-gym-comparison__cell ${
									row.winners.includes(item.id) ? "is-winner" : ""
								}">
									${row.format(item)}
								</div>
							`,
								)
								.join("")}
						</div>
					`,
						)
						.join("")}
				</div>
			`;

			renderComparisonMap(items);
		};

		const updateCompareBar = () => {
			if (
				!compareBar ||
				!compareCount ||
				!compareSelected ||
				!compareTrigger ||
				!compareClear
			)
				return;

			const atLimit = selectedGyms.length >= 3;
			const hasEnoughToCompare = selectedGyms.length >= 2;

			compareBar.hidden = selectedGyms.length === 0;
			compareBar.classList.toggle("is-visible", selectedGyms.length > 0);
			compareCount.textContent = String(selectedGyms.length);
			compareTrigger.disabled = !hasEnoughToCompare;
			compareClear.disabled = selectedGyms.length === 0;

			compareShareButtons.forEach((button) => {
				button.disabled = !hasEnoughToCompare;
			});

			compareSelected.innerHTML = selectedGyms
				.map((id) => {
					const card = allCards.find(
						(item) => item.getAttribute("data-gym-id") === id,
					);
					const label = card?.getAttribute("data-branch-label") || "Gym";
					const chip = document.createElement("button");
					chip.type = "button";
					chip.className = "dx-gym-compare-chip";
					chip.dataset.removeGym = id;
					chip.textContent = label + " ×";
					chip.setAttribute(
						"aria-label",
						"Remove " + label + " from comparison",
					);
					return chip.outerHTML;
				})
				.join("");

			allCards.forEach((card) => {
				const id = card.getAttribute("data-gym-id");
				const toggle = card.querySelector("[data-gym-compare-toggle]");
				if (!toggle || toggle.dataset.bound) return;

				const isSelected = selectedGyms.includes(id);
				const shouldDisable = atLimit && !isSelected;

				toggle.classList.toggle("is-active", isSelected);
				toggle.classList.toggle("is-disabled", shouldDisable);
				toggle.setAttribute("aria-pressed", isSelected ? "true" : "false");
				toggle.disabled = shouldDisable;
			});

			if (selectedGyms.length < 2) {
				closeSharePanel();
			}

			syncShareUrl();
		};

		let observedLast = null;
		const moreObserver = new IntersectionObserver(
			(entries) => {
				if (
					archive.closest(".dx-fitness")?.dataset.sectionNavigating === "true"
				)
					return;
				if (
					!entries.some(
						(entry) => entry.isIntersecting && entry.target === observedLast,
					)
				)
					return;
				moreObserver.disconnect();
				observedLast = null;
				visibleCount += 10;
				update();
			},
			{ rootMargin: "0px 0px 180px 0px", threshold: 0 },
		);

		const update = () => {
			const activeFilters =
				assessedAmenities.size + (activeChain === "all" ? 0 : 1);
			filterSummary.textContent = activeFilters
				? `Filters (${activeFilters})`
				: "Filters";
			const q = (search?.value || "").trim().toLowerCase();

			const eligible = allCards.filter((card) => {
				const chain = card.getAttribute("data-chain") || "unknown";
				const chainOk =
					activeChain === "all" ||
					chain === activeChain ||
					(activeChain === "other" &&
						!Object.prototype.hasOwnProperty.call(LABELS, chain));

				const haystack = (card.getAttribute("data-search") || "").toLowerCase();
				const searchOk = !q || haystack.includes(q);

				const amenitiesOk = [...assessedAmenities].every((key) => {
					const value = card.dataset[key];
					return (
						value !== undefined &&
						value.trim() !== "" &&
						Number.isFinite(Number(value)) &&
						Number(value) >= 0
					);
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
			observedLast =
				ordered.length > visibleCount
					? ordered[Math.min(visibleCount, ordered.length) - 1]
					: null;
			if (observedLast) moreObserver.observe(observedLast);

			updateTitle();
			league.update(ordered, visibleCount);
		};

		buttons.forEach((btn) => {
			btn.addEventListener("click", () => {
				buttons.forEach((b) => {
					b.classList.remove("is-active");
					b.setAttribute("aria-pressed", "false");
				});
				btn.setAttribute("aria-pressed", "true");
				btn.classList.add("is-active");

				activeChain = btn.dataset.chain || "all";
				visibleCount = 10;
				update();
			});
		});

		archive.addEventListener("league-view-change", update);
		search?.addEventListener("input", () => {
			visibleCount = 10;
			update();
		});

		sortSel?.addEventListener("change", () => {
			visibleCount = 10;
			update();
		});

		viewBtns.forEach((btn) => {
			btn.addEventListener("click", () => {
				viewBtns.forEach((b) => b.classList.remove("is-active"));
				btn.classList.add("is-active");

				const view = btn.getAttribute("data-gym-view") || "cards";
				archive.setAttribute("data-view", view);
			});
		});

		grid?.addEventListener("click", (e) => {
			const toggle = e.target.closest("[data-notes-toggle]");
			if (!toggle || toggle.dataset.bound) return;

			const card = toggle.closest("[data-gym-card]");
			const panel = card?.querySelector("[data-notes-panel]");
			if (!card || !panel) return;

			const isOpen = card.classList.contains("is-notes-open");
			card.classList.toggle("is-notes-open", !isOpen);
			toggle.setAttribute("aria-expanded", String(!isOpen));
		});

		grid?.addEventListener("click", (e) => {
			const compareBtn = e.target.closest("[data-gym-compare-toggle]");
			if (!compareBtn || compareBtn.disabled) return;

			const card = compareBtn.closest("[data-gym-card]");
			if (!card) return;

			const id = card.getAttribute("data-gym-id");
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

		compareTrigger?.addEventListener("click", () => {
			renderComparison();
			comparison?.removeAttribute("hidden");
			comparison?.scrollIntoView({ behavior: "smooth", block: "start" });
		});

		compareSelected?.addEventListener("click", (event) => {
			const button = event.target.closest("[data-remove-gym]");
			if (!button) return;
			selectedGyms = selectedGyms.filter(
				(id) => id !== button.dataset.removeGym,
			);
			updateCompareBar();
			renderComparison();
		});

		compareClear?.addEventListener("click", () => {
			selectedGyms = [];
			updateCompareBar();
			renderComparison();
		});

		compareShareButtons.forEach((btn) => {
			btn.addEventListener("click", openSharePanel);
		});

		shareCopyBtn?.addEventListener("click", copyShareLink);
		shareCloseBtn?.addEventListener("click", closeSharePanel);

		comparisonClose?.addEventListener("click", () => {
			if (comparison) {
				comparison.hidden = true;
			}
		});

		const compareParam = new URLSearchParams(window.location.search).get(
			"compare",
		);
		if (compareParam) {
			selectedGyms = compareParam
				.split(",")
				.map((id) => id.trim())
				.filter((id) =>
					allCards.some((card) => card.getAttribute("data-gym-id") === id),
				)
				.slice(0, 3);

			if (selectedGyms.length >= 2) {
				renderComparison();
				comparison?.removeAttribute("hidden");

				window.setTimeout(() => {
					comparison?.scrollIntoView({
						behavior: "smooth",
						block: "start",
					});
				}, 100);
			}
		}

		const initialViewBtn = viewBtns.find((btn) =>
			btn.classList.contains("is-active"),
		);
		archive.setAttribute(
			"data-view",
			initialViewBtn?.getAttribute("data-gym-view") || "cards",
		);

		const animatedCards = new WeakSet();

		const animateCardBars = (card) => {
			if (!card || animatedCards.has(card)) return;

			const bars = [...card.querySelectorAll(".dx-score-bar span")];
			if (!bars.length) return;

			animatedCards.add(card);

			bars.forEach((bar, index) => {
				const pct =
					getComputedStyle(bar).getPropertyValue("--pct").trim() || "0";
				bar.style.transform = "scaleX(0)";

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
				rootMargin: "0px 0px -10% 0px",
			},
		);

		allCards.forEach((card) => {
			cardObserver.observe(card);
		});

		updateCompareBar();
		renderComparison();
		update();
		archive.classList.remove("is-loading");
		archive.removeAttribute("aria-busy");
		archive.querySelector(".league-loading")?.remove();
	})();

	/* ==========================
	GYM VIEWPORT-ACTIVE (DEDICATED)
	========================== */

	// The league can be taller than the viewport; do not gate it on scroll ratios.
	document
		.querySelector("[data-gyms-archive]")
		?.closest("section")
		?.classList.add("viewport-active");

	/* ==========================
	BUS DIARY
	========================== */

	dxOnPageReady(() => {
		const busEntry = document.querySelector(".bus-diary-entry");
		if (!busEntry) return;

		const mapEl = busEntry.querySelector("[data-bus-map]");
		const dock = busEntry.querySelector("[data-bus-dock]");
		const paneStage = busEntry.querySelector("[data-bus-pane-stage]");
		const toggleButtons = dock
			? [...dock.querySelectorAll("[data-view-toggle]")]
			: [];
		const paneViews = paneStage
			? [...paneStage.querySelectorAll(".bus-pane-view[data-pane-view]")]
			: [];

		/* ==========================
		BUS MAP
		========================== */

		if (mapEl) {
			const route = mapEl.dataset.route || "";
			const startName = mapEl.dataset.startName || "Start";
			const endName = mapEl.dataset.endName || "End";

			console.log("Bus map ready:", {
				route,
				start: startName,
				end: endName,
			});

			if (typeof L !== "undefined") {
				const startLat = parseFloat(mapEl.dataset.startLat);
				const startLng = parseFloat(mapEl.dataset.startLng);
				const endLat = parseFloat(mapEl.dataset.endLat);
				const endLng = parseFloat(mapEl.dataset.endLng);

				const hasStart = !Number.isNaN(startLat) && !Number.isNaN(startLng);
				const hasEnd = !Number.isNaN(endLat) && !Number.isNaN(endLng);

				if (!hasStart && !hasEnd) {
					mapEl.innerHTML =
						'<div class="bus-map__empty">No journey coordinates added yet.</div>';
				} else {
					const map = L.map(mapEl, {
						scrollWheelZoom: false,
						zoomControl: true,
					});

					L.tileLayer(
						"https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=cb1_49v4_1_6f4e11cc72c4a39104c6f6c9",
						{
							attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
							subdomains: "abcd",
							maxZoom: 20,
						},
					).addTo(map);

					const points = [];

					const startIcon = L.divIcon({
						className: "bus-map-marker bus-map-marker--start",
						html: "<span></span>",
						iconSize: [18, 18],
						iconAnchor: [9, 9],
					});

					const endIcon = L.divIcon({
						className: "bus-map-marker bus-map-marker--end",
						html: "<span></span>",
						iconSize: [18, 18],
						iconAnchor: [9, 9],
					});

					if (hasStart) {
						const startPoint = [startLat, startLng];
						points.push(startPoint);

						L.marker(startPoint, { icon: startIcon })
							.addTo(map)
							.bindPopup(
								`<strong>${startName}</strong>${
									route ? `<br>Route ${route}` : ""
								}`,
							);
					}

					if (hasEnd) {
						const endPoint = [endLat, endLng];
						points.push(endPoint);

						L.marker(endPoint, { icon: endIcon })
							.addTo(map)
							.bindPopup(
								`<strong>${endName}</strong>${
									route ? `<br>Route ${route}` : ""
								}`,
							);
					}

					if (hasStart && hasEnd) {
						L.polyline(
							[
								[startLat, startLng],
								[endLat, endLng],
							],
							{
								color: "#ffffff",
								weight: 4,
								opacity: 0.85,
							},
						).addTo(map);
					}

					if (points.length === 1) {
						map.setView(points[0], 13);
					} else {
						map.fitBounds(points, {
							padding: [40, 40],
						});
					}

					window.addEventListener("resize", () => {
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
					view.classList.toggle(
						"is-active",
						view.dataset.paneView === viewName,
					);
				});

				toggleButtons.forEach((button) => {
					const isActive = button.dataset.viewToggle === viewName;
					button.classList.toggle("is-active", isActive);
					button.setAttribute("aria-pressed", isActive ? "true" : "false");
				});

				if (viewName === "map") {
					window.dispatchEvent(new Event("resize"));
				}
			};

			toggleButtons.forEach((button) => {
				button.addEventListener("click", () => {
					const viewName = button.dataset.viewToggle;
					if (!viewName) return;
					setActivePane(viewName);
				});
			});

			const activeButton = dock.querySelector("[data-view-toggle].is-active");
			setActivePane(activeButton?.dataset.viewToggle || "map");
		}

		/* ==========================
		BUS PANEL TOGGLES
		========================== */

		const panelToggleButtons = [
			...busEntry.querySelectorAll("[data-bus-panel-toggle]"),
		];
		const panels = [...busEntry.querySelectorAll("[data-bus-panel]")];

		if (panelToggleButtons.length && panels.length) {
			panelToggleButtons.forEach((btn) => {
				btn.addEventListener("click", () => {
					const key = btn.dataset.busPanelToggle;
					if (!key) return;

					const panel = busEntry.querySelector(`[data-bus-panel="${key}"]`);
					if (!panel) return;

					const isHidden = panel.hasAttribute("hidden");

					panels.forEach((p) => p.setAttribute("hidden", "hidden"));

					if (isHidden) {
						panel.removeAttribute("hidden");
					}
				});
			});
		}

		/* ==========================
		TFL DEPARTURES NEAR YOU
		========================== */

		const departuresRoot = busEntry.querySelector("[data-bus-departures]");
		if (!departuresRoot) return;

		const locateBtn = departuresRoot.querySelector("[data-bus-locate]");
		const statusEl = departuresRoot.querySelector("[data-bus-status]");
		const stopsEl = departuresRoot.querySelector("[data-bus-stops]");
		const resultsEl = departuresRoot.querySelector("[data-bus-results]");

		if (!locateBtn || !statusEl || !stopsEl || !resultsEl) return;
		if (locateBtn.dataset.busLocateBound === "true") return;
		locateBtn.dataset.busLocateBound = "true";

		const hasBusConfig =
			typeof DX_BUS_DIARY !== "undefined" &&
			DX_BUS_DIARY &&
			DX_BUS_DIARY.rest_url;
		const restBase = hasBusConfig
			? DX_BUS_DIARY.rest_url.replace(/\/$/, "")
			: "";

		const setStatus = (message) => {
			statusEl.textContent = message;
		};

		const minsLabel = (seconds) => {
			if (seconds === null || seconds === undefined) return "—";
			const mins = Math.round(seconds / 60);
			if (mins <= 0) return "Due";
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

			resultsEl.innerHTML = arrivals
				.map(
					(item) => `
				<div class="bus-arrival-card">
					<div class="bus-arrival-main">
						<div class="bus-arrival-line">${item.lineName || "Bus"}</div>
						<div class="bus-arrival-destination">${
							item.destinationName || "Unknown destination"
						}</div>
						<div class="bus-arrival-meta">${item.towards || ""}</div>
					</div>
					<div class="bus-arrival-time">${minsLabel(item.timeToStation)}</div>
				</div>
			`,
				)
				.join("");
		};

		const loadArrivals = async (stopId, stopName) => {
			setStatus(`Loading departures for ${stopName}…`);
			resultsEl.innerHTML = "";

			try {
				const res = await fetch(
					`${restBase}/tfl-stop-arrivals?stop_id=${encodeURIComponent(stopId)}`,
					{
						headers: {
							"X-WP-Nonce": DX_BUS_DIARY.nonce,
						},
					},
				);

				const data = await res.json();

				if (!data.success) {
					throw new Error(data.message || "Could not load arrivals.");
				}

				setStatus(`Showing live departures for ${stopName}`);
				renderArrivals(data.arrivals || []);
			} catch (err) {
				setStatus("Unable to load live departures right now.");
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
				resultsEl.innerHTML = "";
				return;
			}

			stopsEl.innerHTML = stops
				.map(
					(stop, index) => `
				<button
					type="button"
					class="bus-stop-card ${index === 0 ? "is-active" : ""}"
					data-stop-id="${stop.id}"
					data-stop-name="${stop.name}"
				>
					<h4>${stop.name}</h4>
					<p>${stop.distance ?? "—"}m away ${
						stop.indicator ? `• Stop ${stop.indicator}` : ""
					}</p>
				</button>
			`,
				)
				.join("");

			const stopButtons = [...stopsEl.querySelectorAll("[data-stop-id]")];

			stopButtons.forEach((btn) => {
				btn.addEventListener("click", () => {
					stopButtons.forEach((b) => b.classList.remove("is-active"));
					btn.classList.add("is-active");
					loadArrivals(btn.dataset.stopId, btn.dataset.stopName);
				});
			});

			loadArrivals(stops[0].id, stops[0].name);
		};

		locateBtn.addEventListener("click", () => {
			if (!hasBusConfig) {
				setStatus("Live departures are not configured yet.");
				resultsEl.innerHTML = "";
				stopsEl.innerHTML = `
					<div class="bus-stop-card">
						<p>DX_BUS_DIARY is missing or not localised into the page.</p>
					</div>
				`;
				console.warn("DX_BUS_DIARY is missing from the page.");
				return;
			}

			setStatus("Getting your location…");
			stopsEl.innerHTML = "";
			resultsEl.innerHTML = "";

			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const { latitude, longitude } = position.coords;

					try {
						const res = await fetch(
							`${restBase}/tfl-nearby-stops?lat=${encodeURIComponent(
								latitude,
							)}&lng=${encodeURIComponent(longitude)}&radius=600`,
							{
								headers: {
									"X-WP-Nonce": DX_BUS_DIARY.nonce,
								},
							},
						);

						const data = await res.json();

						if (!data.success) {
							throw new Error(data.message || "Could not load nearby stops.");
						}

						setStatus("Nearby stops found.");
						renderStops(data.stops || []);
					} catch (err) {
						setStatus("Unable to find nearby stops right now.");
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
							setStatus("Location access was denied.");
							break;
						case error.POSITION_UNAVAILABLE:
							setStatus("Your location is currently unavailable.");
							break;
						case error.TIMEOUT:
							setStatus("Location request timed out.");
							break;
						default:
							setStatus("Unable to get your location right now.");
					}
				},
				{
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 60000,
				},
			);
		});
	});

	/* ==========================
	GEO RESTRICTION
	========================== */

	(() => {
		"use strict";

		const BLOCKED_COUNTRIES = ["IL"];

		const RESTRICTED_PATH = "/access-restricted/";
		const BODY_CLASS = "error405";
		const DEV_PARAM = "geo";

		const normaliseCountryCode = (value) => {
			if (!value || typeof value !== "string") return "";
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
			if (typeof window.CF_IPCountry !== "undefined") {
				return normaliseCountryCode(window.CF_IPCountry);
			}

			// Cloudflare header values are not directly readable in frontend JS
			// unless you expose them yourself server-side.
			const bodyCountry = normaliseCountryCode(document.body?.dataset?.country);
			if (bodyCountry) {
				return bodyCountry;
			}

			return "";
		};

		const isRestrictedPage = () => {
			const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
			const restrictedPath = RESTRICTED_PATH.replace(/\/+$/, "") || "/";
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
			url.searchParams.set("geo", countryCode);

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

		if (document.readyState === "loading") {
			dxOnPageReady(initGeoRestriction);
		} else {
			initGeoRestriction();
		}
	})();

	/* ==========================
	CALENDLY POPUP
	========================== */

	dxOnPageReady(() => {
		const calendlyButtons = document.querySelectorAll(".js-calendly-popup");

		if (!calendlyButtons.length) return;

		calendlyButtons.forEach((button) => {
			button.addEventListener("click", (e) => {
				e.preventDefault();

				if (
					typeof Calendly === "undefined" ||
					typeof Calendly.initPopupWidget !== "function"
				) {
					console.warn("Calendly widget script is not loaded yet.");
					return;
				}

				Calendly.initPopupWidget({
					url: "https://calendly.com/dxndre/30min",
				});
			});
		});

		console.log("Calendly popup initialized for buttons:", calendlyButtons);
	});

	/* ==========================
		BUS NFS ARCHIVE
	========================== */

	(() => {
		const archive = document.querySelector("[data-bus-nfs]");
		if (!archive) return;

		const slides = [...archive.querySelectorAll("[data-bus-slide]")];
		const prevBtn = archive.querySelector("[data-bus-prev]");
		const nextBtn = archive.querySelector("[data-bus-next]");
		const currentEl = archive.querySelector("[data-bus-current]");

		if (!slides.length) return;

		let currentIndex = 0;
		let locked = false;

		const pad = (number) => String(number).padStart(2, "0");

		const setActiveSlide = (index) => {
			currentIndex = Math.max(0, Math.min(index, slides.length - 1));

			slides.forEach((slide, slideIndex) => {
				slide.classList.toggle("is-active", slideIndex === currentIndex);
				slide.classList.toggle("is-before", slideIndex < currentIndex);
				slide.classList.toggle("is-after", slideIndex > currentIndex);
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

		nextBtn?.addEventListener("click", next);
		prevBtn?.addEventListener("click", prev);

		window.addEventListener("keydown", (e) => {
			if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
			if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
		});

		archive.addEventListener(
			"wheel",
			(e) => {
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
			},
			{ passive: false },
		);

		setActiveSlide(0);
	})();

	(() => {
		"use strict";

		// ================================================================
		// GUARD
		// ================================================================

		const body = document.body;

		if (!body || !body.classList.contains("single-gym-review")) {
			return;
		}

		const reduceMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
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
				value === "" ||
				value === "unavailable"
			) {
				return null;
			}

			const parsed = parseFloat(value);

			return Number.isFinite(parsed) ? parsed : null;
		};

		const escapeAttribute = (value = "") => {
			return String(value)
				.replace(/&/g, "&amp;")
				.replace(/"/g, "&quot;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;");
		};

		// ================================================================
		// SCROLL REVEAL
		// ================================================================

		const initialiseRevealAnimations = () => {
			const selectors = [
				".gym-review-overview__grid",
				".gym-review-section-heading",
				".gym-review-score",
				".gym-review-panel",
				".gym-review-gallery figure",
				".gym-review-content__grid",
				".gym-review-final .container",
			];

			const elements = document.querySelectorAll(selectors.join(","));

			elements.forEach((element) => {
				if (!element.hasAttribute("data-gym-reveal")) {
					element.setAttribute("data-gym-reveal", "");
				}
			});

			if (reduceMotion || !("IntersectionObserver" in window)) {
				elements.forEach((element) => {
					element.classList.add("is-visible");
				});

				return;
			}

			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (!entry.isIntersecting) {
							return;
						}

						entry.target.classList.add("is-visible");

						observer.unobserve(entry.target);
					});
				},

				{
					threshold: 0.12,
					rootMargin: "0px 0px -40px 0px",
				},
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

			const hero = document.querySelector(".gym-review-hero");

			const image = document.querySelector(".gym-review-hero__image");

			if (!hero || !image) {
				return;
			}

			let ticking = false;

			const update = () => {
				const rect = hero.getBoundingClientRect();

				const viewportHeight = window.innerHeight;

				if (rect.bottom < 0 || rect.top > viewportHeight) {
					ticking = false;
					return;
				}

				const progress = clamp(-window.scrollY / 1200, -1, 0);

				const translate = window.scrollY * 0.08;

				image.style.transform = `translate3d(0, ${translate}px, 0) scale(1.035)`;

				ticking = false;
			};

			const requestUpdate = () => {
				if (ticking) {
					return;
				}

				ticking = true;

				window.requestAnimationFrame(update);
			};

			window.addEventListener("scroll", requestUpdate, {
				passive: true,
			});

			requestUpdate();
		};

		// ================================================================
		// SCORE BARS
		// ================================================================

		const initialiseScores = () => {
			const scoreItems = document.querySelectorAll(".gym-review-score[data-score]");

			if (!scoreItems.length) {
				return;
			}

			scoreItems.forEach((item) => {
				const scoreValue = parseScore(item.dataset.score);

				const fill = item.querySelector(".gym-review-score__fill");

				const display =
					item.querySelector(".gym-review-score__value") ||
					item.querySelector(".gym-review-score__meta strong");

				if (scoreValue === null) {
					item.classList.add("is-unavailable");

					if (display) {
						display.textContent = "Unavailable";
					}

					return;
				}

				const percentage = clamp(scoreValue * 10, 0, 100);

				if (fill) {
					fill.dataset.width = `${percentage}%`;

					fill.style.width = "0";
				}

				if (display) {
					display.textContent = `${scoreValue}/10`;
				}
			});

			const animate = (item) => {
				const fill = item.querySelector(".gym-review-score__fill");

				if (!fill) {
					return;
				}

				const width = fill.dataset.width;

				if (!width) {
					return;
				}

				requestAnimationFrame(() => {
					fill.style.width = width;
				});
			};

			if (reduceMotion || !("IntersectionObserver" in window)) {
				scoreItems.forEach(animate);

				return;
			}

			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (!entry.isIntersecting) {
							return;
						}

						animate(entry.target);

						observer.unobserve(entry.target);
					});
				},

				{
					threshold: 0.35,
				},
			);

			scoreItems.forEach((item) => {
				if (!item.classList.contains("is-unavailable")) {
					observer.observe(item);
				}
			});
		};

		// ================================================================
		// OVERALL SCORE COUNT-UP
		// ================================================================

		const initialiseOverallScore = () => {
			const scoreElements = document.querySelectorAll("[data-overall-score]");

			if (!scoreElements.length) {
				return;
			}

			const animateScore = (element) => {
				const target = parseFloat(element.dataset.overallScore);

				if (!Number.isFinite(target)) {
					return;
				}

				element.style.color = gymOverallBand(target).color;

				if (reduceMotion) {
					element.textContent = `${target.toFixed(1)}%`;

					return;
				}

				const duration = 1100;

				const start = performance.now();

				const frame = (time) => {
					const elapsed = time - start;

					const progress = clamp(elapsed / duration, 0, 1);

					const eased = 1 - Math.pow(1 - progress, 3);

					const current = target * eased;

					element.textContent = `${current.toFixed(1)}%`;
					element.style.color = gymOverallBand(current).color;

					if (progress < 1) {
						requestAnimationFrame(frame);
					}
				};

				requestAnimationFrame(frame);
			};

			if (!("IntersectionObserver" in window)) {
				scoreElements.forEach(animateScore);

				return;
			}

			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (!entry.isIntersecting) {
							return;
						}

						animateScore(entry.target);

						observer.unobserve(entry.target);
					});
				},

				{
					threshold: 0.4,
				},
			);

			scoreElements.forEach((element) => {
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

		const initialiseMap = () => {
			const maps = document.querySelectorAll(".gym-review-map");

			if (!maps.length) {
				return;
			}

			maps.forEach((map) => {
				const location =
					map.dataset.title || map.dataset.location || "this gym";
				const embed = map.dataset.mapEmbed;

				if (!embed) {
					const unavailable = document.createElement("p");
					unavailable.className = "gym-review-map__unavailable";
					unavailable.textContent =
						"A map is not available for this branch yet.";
					map.appendChild(unavailable);
					return;
				}

				const loading = document.createElement("div");

				loading.className = "gym-review-map__loading";

				loading.textContent = "Loading map";

				map.appendChild(loading);

				const iframe = document.createElement("iframe");

				iframe.title = `Map showing ${location}`;

				iframe.loading = "lazy";

				iframe.referrerPolicy = "strict-origin-when-cross-origin";

				iframe.setAttribute("allowfullscreen", "");

				iframe.src = embed;

				iframe.addEventListener("load", () => {
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

		const initialiseDirections = () => {
			const links = document.querySelectorAll("[data-map-url]");

			links.forEach((link) => {
				const url = link.dataset.mapUrl;

				if (!url) {
					return;
				}

				link.href = url;

				link.target = "_blank";

				link.rel = "noopener noreferrer";
			});
		};

		// ================================================================
		// GALLERY LIGHTBOX
		// ================================================================

		const initialiseGalleryLightbox = () => {
			const images = Array.from(
				document.querySelectorAll(".gym-review-gallery figure img"),
			);

			if (!images.length) {
				return;
			}

			const lightbox = document.createElement("div");

			lightbox.className = "gym-review-lightbox";

			lightbox.setAttribute("aria-hidden", "true");

			lightbox.setAttribute("role", "dialog");

			lightbox.setAttribute("aria-modal", "true");

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

			document.body.appendChild(lightbox);

			const lightboxImage = lightbox.querySelector(
				".gym-review-lightbox__image",
			);

			const closeButton = lightbox.querySelector(".gym-review-lightbox__close");

			const previousButton = lightbox.querySelector(
				".gym-review-lightbox__prev",
			);

			const nextButton = lightbox.querySelector(".gym-review-lightbox__next");

			let currentIndex = 0;

			const getFullSource = (image) => {
				return image.dataset.full || image.currentSrc || image.src;
			};

			const render = () => {
				const image = images[currentIndex];

				lightboxImage.src = getFullSource(image);

				lightboxImage.alt = image.alt || "";
			};

			const open = (index) => {
				currentIndex = index;

				render();

				lightbox.classList.add("is-open");

				lightbox.setAttribute("aria-hidden", "false");

				body.classList.add("gym-lightbox-open");

				closeButton.focus();
			};

			const close = () => {
				lightbox.classList.remove("is-open");

				lightbox.setAttribute("aria-hidden", "true");

				body.classList.remove("gym-lightbox-open");
			};

			const previous = () => {
				currentIndex = (currentIndex - 1 + images.length) % images.length;

				render();
			};

			const next = () => {
				currentIndex = (currentIndex + 1) % images.length;

				render();
			};

			images.forEach((image, index) => {
				const figure = image.closest("figure");

				if (!figure) {
					return;
				}

				figure.tabIndex = 0;

				figure.setAttribute("role", "button");

				figure.setAttribute(
					"aria-label",
					`View image ${index + 1} of ${images.length}`,
				);

				figure.addEventListener("click", () => {
					open(index);
				});

				figure.addEventListener("keydown", (event) => {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();

						open(index);
					}
				});
			});

			closeButton.addEventListener("click", close);

			previousButton.addEventListener("click", previous);

			nextButton.addEventListener("click", next);

			lightbox.addEventListener("click", (event) => {
				if (event.target === lightbox) {
					close();
				}
			});

			document.addEventListener("keydown", (event) => {
				if (!lightbox.classList.contains("is-open")) {
					return;
				}

				switch (event.key) {
					case "Escape":
						close();

						break;

					case "ArrowLeft":
						previous();

						break;

					case "ArrowRight":
						next();

						break;
				}
			});
		};

		// ================================================================
		// MOBILE GALLERY DOTS
		// ================================================================

		const initialiseGalleryProgress = () => {
			const viewport = document.querySelector(".gym-review-gallery__viewport");

			if (!viewport) {
				return;
			}

			const slides = Array.from(viewport.querySelectorAll("figure"));

			if (slides.length < 2) {
				return;
			}

			let controls = document.querySelector(".gym-review-gallery__controls");

			if (!controls) {
				controls = document.createElement("div");

				controls.className = "gym-review-gallery__controls";

				viewport.insertAdjacentElement("afterend", controls);
			}

			controls.innerHTML = "";

			const dots = slides.map((_, index) => {
				const button = document.createElement("button");

				button.type = "button";

				button.className = "gym-review-gallery__dot";

				button.setAttribute("aria-label", `Go to image ${index + 1}`);

				if (index === 0) {
					button.classList.add("is-active");
				}

				button.addEventListener("click", () => {
					slides[index].scrollIntoView({
						behavior: reduceMotion ? "auto" : "smooth",

						inline: "start",

						block: "nearest",
					});
				});

				controls.appendChild(button);

				return button;
			});

			if (!("IntersectionObserver" in window)) {
				return;
			}

			const observer = new IntersectionObserver(
				(entries) => {
					const visible = entries
						.filter((entry) => entry.isIntersecting)
						.sort((a, b) => b.intersectionRatio - a.intersectionRatio);

					if (!visible.length) {
						return;
					}

					const index = slides.indexOf(visible[0].target);

					dots.forEach((dot, dotIndex) => {
						dot.classList.toggle("is-active", dotIndex === index);
					});
				},

				{
					root: viewport,
					threshold: [0.45, 0.6, 0.75],
				},
			);

			slides.forEach((slide) => {
				observer.observe(slide);
			});
		};

		// ================================================================
		// SCORE LABELS
		// ================================================================

		const getScoreLabel = (score) => gymOverallBand(score).label;

		const initialiseScoreLabels = () => {
			const containers = document.querySelectorAll("[data-score-label-source]");

			containers.forEach((element) => {
				const score = parseFloat(element.dataset.scoreLabelSource);

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

		if (document.readyState === "loading") {
			dxOnPageReady(initialise, {
				once: true,
			});
		} else {
			initialise();
		}
	})();
})();

// Homepage only: one entrance, then gentle pointer depth while in view.
function initHomepageHeroMotion() {
	if (!document.body.matches(".is-frontend.page-template-page-homepage"))
		return;
	const hero = document.querySelector("#main .hero-background");
	const background = hero?.querySelector(":scope > img");
	const portrait = hero?.querySelector(".hero-foreground > img");
	if (!hero || !background || !portrait || hero.dataset.motionInit) return;
	hero.dataset.motionInit = "true";

	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const desktop = matchMedia(
		"(min-width: 992px) and (hover: hover) and (pointer: fine)",
	);
	let visible = false;
	let entered = false;
	let frame = 0;
	let lastTime = 0;
	let scrollFrame = 0;
	let x = 0,
		y = 0,
		targetX = 0,
		targetY = 0;
	const animations = new Set();

	const enabled = () =>
		entered &&
		visible &&
		!document.hidden &&
		!reduced.matches &&
		desktop.matches;
	const paint = () => {
		background.style.setProperty("--hero-depth-x", `${(x * 6).toFixed(3)}px`);
		background.style.setProperty("--hero-depth-y", `${(y * 6).toFixed(3)}px`);
		portrait.style.setProperty("--hero-depth-x", `${(x * 2).toFixed(3)}px`);
		portrait.style.setProperty("--hero-depth-y", `${(y * 2).toFixed(3)}px`);
	};
	const paintScroll = () => {
		scrollFrame = 0;
		const rect = hero.getBoundingClientRect();
		const progress = Math.max(
			0,
			Math.min(1, -rect.top / Math.max(1, rect.height)),
		);
		const offset =
			visible && !document.hidden && !reduced.matches
				? -progress * (desktop.matches ? 160 : 36)
				: 0;
		portrait.style.setProperty("--hero-scroll-y", `${offset.toFixed(3)}px`);
		const glowOffset =
			visible && !document.hidden && !reduced.matches
				? progress * (desktop.matches ? 70 : 24)
				: 0;
		hero.style.setProperty("--hero-glow-y", `${glowOffset.toFixed(3)}px`);
	};
	const scheduleScroll = () => {
		if (!scrollFrame) scrollFrame = requestAnimationFrame(paintScroll);
	};
	const reset = () => {
		cancelAnimationFrame(frame);
		frame = lastTime = 0;
		x = y = targetX = targetY = 0;
		paint();
		hero.classList.remove("hero-depth-active");
	};
	const tick = (time) => {
		frame = 0;
		if (!enabled()) {
			reset();
			return;
		}
		const dt = lastTime ? Math.min(64, time - lastTime) : 16;
		lastTime = time;
		const smoothing = 1 - Math.exp(-dt / 160);
		x += (targetX - x) * smoothing;
		y += (targetY - y) * smoothing;
		paint();
		if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.001) {
			frame = requestAnimationFrame(tick);
		} else {
			x = targetX;
			y = targetY;
			paint();
			lastTime = 0;
			if (!targetX && !targetY) hero.classList.remove("hero-depth-active");
		}
	};
	const schedule = () => {
		if (enabled() && !frame) frame = requestAnimationFrame(tick);
	};
	const stopEntrance = () => {
		animations.forEach((animation) => animation.cancel());
		animations.clear();
		entered = true;
		hero.classList.remove("hero-entering");
		scheduleScroll();
	};
	const entrance = () => {
		if (entered || hero.classList.contains("hero-entering")) return;
		if (reduced.matches || typeof portrait.animate !== "function") {
			entered = true;
			return;
		}
		hero.classList.add("hero-entering");
		const opacity = getComputedStyle(portrait).opacity;
		const bgAnimation = background.animate(
			[{ filter: "brightness(.38)" }, { filter: "brightness(.55)" }],
			{ duration: 1800, easing: "cubic-bezier(.22,1,.36,1)" },
		);
		const portraitAnimation = portrait.animate(
			[
				{ opacity: 0, translate: "0 12px" },
				{ opacity, translate: "0 0" },
			],
			{
				duration: 1200,
				delay: 100,
				fill: "backwards",
				easing: "cubic-bezier(.22,1,.36,1)",
			},
		);
		animations.add(bgAnimation);
		animations.add(portraitAnimation);
		Promise.allSettled([bgAnimation.finished, portraitAnimation.finished]).then(
			stopEntrance,
		);
	};

	// Wait for actual image pixels, without ever hiding essential hero copy.
	Promise.allSettled([background, portrait].map((img) => img.decode?.())).then(
		() => {
			hero.classList.add("hero-motion-ready");
			if (visible && !document.hidden) entrance();
		},
	);
	hero.addEventListener(
		"pointermove",
		(event) => {
			if (!enabled() || event.pointerType !== "mouse") return;
			const rect = hero.getBoundingClientRect();
			targetX = Math.max(
				-1,
				Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1),
			);
			targetY = Math.max(
				-1,
				Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1),
			);
			hero.classList.add("hero-depth-active");
			schedule();
		},
		{ passive: true },
	);
	hero.addEventListener(
		"pointerleave",
		() => {
			targetX = targetY = 0;
			schedule();
		},
		{ passive: true },
	);
	const refresh = () => {
		scheduleScroll();
		if (!enabled()) reset();
		if (reduced.matches || document.hidden) stopEntrance();
		if (
			visible &&
			!document.hidden &&
			hero.classList.contains("hero-motion-ready")
		)
			entrance();
	};
	reduced.addEventListener("change", refresh);
	desktop.addEventListener("change", refresh);
	document.addEventListener("visibilitychange", refresh);
	window.addEventListener("scroll", scheduleScroll, { passive: true });
	window.addEventListener(
		"resize",
		() => {
			reset();
			scheduleScroll();
		},
		{ passive: true },
	);
	window.addEventListener("pagehide", () => {
		reset();
		stopEntrance();
		cancelAnimationFrame(scrollFrame);
		scrollFrame = 0;
		portrait.style.setProperty("--hero-scroll-y", "0px");
		hero.style.setProperty("--hero-glow-y", "0px");
	});
	const observer = new IntersectionObserver(
		(entries) => {
			visible = entries[0].isIntersecting;
			refresh();
		},
		{ threshold: 0 },
	);
	observer.observe(hero);
}
dxOnPageReady(initHomepageHeroMotion);

// Search
(() => {
	const root = document.querySelector("[data-dx-search]");
	if (!root) return;
	const input = root.querySelector('input[name="s"]');
	const clear = root.querySelector(".dx-search__clear");
	const sync = () => {
		clear.hidden = input.value.length === 0;
	};
	clear.addEventListener("click", () => {
		input.value = "";
		sync();
		input.focus();
	});
	input.addEventListener("input", sync);
	window.addEventListener("pageshow", sync);
	sync();
})();

// CV
(() => {
	const cv = document.querySelector(".cv-experience");
	if (!cv) return;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const portrait = cv.querySelector(".cv-hero__portrait");
	const image = portrait?.querySelector("img");
	const revealPortrait = () => {
		if (!portrait || portrait.dataset.cvPortraitReady) return;
		portrait.dataset.cvPortraitReady = "true";
		if (reduced.matches || !portrait.animate) return;
		const wide = matchMedia("(min-width: 701px)").matches;
		portrait.animate([
			{ opacity: 0, transform: wide ? "translate3d(4%,0,0) scale(1.06)" : "translate3d(0,24px,0) scale(1.04)", clipPath: "inset(0 0 0 10%)" },
			{ opacity: 1, transform: "none", clipPath: "inset(0)" },
		], { duration: 1400, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" });
	};
	if (image?.complete) revealPortrait();
	else if (image) {
		image.addEventListener("load", revealPortrait, { once: true });
		image.addEventListener("error", revealPortrait, { once: true });
	}
	const nav = cv.querySelector(".cv-nav");
	const links = [...cv.querySelectorAll('.cv-nav a[href^="#"]')];
	const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
	if (!sections.length) return;
	let frame = 0;
	const update = () => {
		frame = 0;
		const position = Math.max(window.innerHeight * 0.3,
			Math.max(0, document.getElementById("header")?.getBoundingClientRect().bottom || 0) + (nav?.offsetHeight || 0) + 32);
		let active = sections[0];
		sections.forEach((section) => { if (section.getBoundingClientRect().top <= position) active = section; });
		links.forEach((link) => {
			if (link.hash === "#" + active.id) link.setAttribute("aria-current", "location");
			else link.removeAttribute("aria-current");
		});
	};
	const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
	if ("IntersectionObserver" in window) {
		const observer = new IntersectionObserver(schedule, { rootMargin: "-15% 0px -55% 0px", threshold: 0 });
		sections.forEach((section) => observer.observe(section));
	}
	window.addEventListener("scroll", schedule, { passive: true });
	window.addEventListener("resize", schedule, { passive: true });
	window.addEventListener("hashchange", schedule);
	update();
})();

// Fitness
(() => {
	const root = document.querySelector(".dx-fitness");
	if (!root) return;
	const nav = root.querySelector(".dxf-nav");
	const links = [...nav.querySelectorAll('a[href^="#"]')];
	const sections = links
		.map((link) => document.getElementById(link.hash.slice(1)))
		.filter(Boolean);
	const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
	let frame = 0;
	let scheduled = false;
	const offset = () =>
		Math.max(
			parseFloat(getComputedStyle(nav).top) || 0,
			document.querySelector("#header").getBoundingClientRect().bottom,
		) +
		nav.offsetHeight +
		24;
	const destination = (target) => {
		// On mobile the story photograph precedes its copy. Land on the story itself.
		const anchor =
			target.id === "fitness-story"
				? target.querySelector(".dxf-story-copy")
				: target;
		return Math.max(
			0,
			window.scrollY + anchor.getBoundingClientRect().top - offset(),
		);
	};
	const update = () => {
		scheduled = false;
		nav.classList.toggle(
			"is-stuck",
			nav.getBoundingClientRect().top <=
				(parseFloat(getComputedStyle(nav).top) || 0) + 1,
		);
		let active = sections[0];
		for (const section of sections)
			if (section.getBoundingClientRect().top <= offset() + 50)
				active = section;
		links.forEach((link) => {
			if (link.hash === "#" + active.id)
				link.setAttribute("aria-current", "location");
			else link.removeAttribute("aria-current");
		});
	};
	const cancel = () => {
		cancelAnimationFrame(frame);
		frame = 0;
		delete root.dataset.sectionNavigating;
	};
	const navigate = (target) => {
		cancel();
		root.dataset.sectionNavigating = "true";
		const start = window.scrollY;
		const started = performance.now();
		const duration = reducedMotion.matches ? 0 : 850;
		const step = (now) => {
			const progress = duration ? Math.min(1, (now - started) / duration) : 1;
			const eased = 1 - Math.pow(1 - progress, 4);
			window.scrollTo({
				top: start + (destination(target) - start) * eased,
				behavior: "instant",
			});
			if (progress < 1) frame = requestAnimationFrame(step);
			else {
				cancel();
				update();
			}
		};
		frame = requestAnimationFrame(step);
	};
	window.addEventListener(
		"scroll",
		() => {
			if (!scheduled) {
				scheduled = true;
				requestAnimationFrame(update);
			}
		},
		{ passive: true },
	);
	window.addEventListener("resize", update);
	window.addEventListener("wheel", cancel, { passive: true });
	window.addEventListener("touchstart", cancel, { passive: true });
	window.addEventListener("keydown", (event) => {
		if (
			[
				"ArrowUp",
				"ArrowDown",
				"PageUp",
				"PageDown",
				"Home",
				"End",
				"Escape",
				" ",
			].includes(event.key)
		)
			cancel();
	});
	root.querySelectorAll('a[href^="#"]').forEach((link) => {
		if (!sections.some((section) => "#" + section.id === link.hash)) return;
		link.addEventListener("click", (event) => {
			if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
				return;
			event.preventDefault();
			if (location.hash !== link.hash) history.pushState(null, "", link.hash);
			navigate(document.getElementById(link.hash.slice(1)));
		});
	});
	window.addEventListener("hashchange", () => {
		const target = sections.find(
			(section) => "#" + section.id === location.hash,
		);
		if (target) navigate(target);
	});
	update();
})();

// Site presentation
(() => {
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const cards = document.querySelectorAll(".dx-principle");
	if (cards.length && !reduced.matches && "IntersectionObserver" in window) {
		const observer = new IntersectionObserver(
			(entries) =>
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;
					entry.target.classList.remove("dx-reveal-pending");
					observer.unobserve(entry.target);
				}),
			{ threshold: 0.12 },
		);
		cards.forEach((card, i) => {
			card.style.transitionDelay = `${(i % 3) * 90}ms`;
			card.classList.add("dx-reveal-pending");
			observer.observe(card);
		});
	}
	// Separate the physical cards from the digital service listing.
	if (document.body.classList.contains("page-services")) {
		const training = document.querySelector(".service-training-card");
		if (training) {
			const list = training.parentElement,
				section = document.createElement("section");
			section.id = "service-physical";
			section.className = "physical-services container";
			const heading = document.createElement("h2");
			heading.textContent = "Physical Services";
			section.append(heading);
			const physical = document.createElement("ul");
			physical.className = "physical-services-list";
			section.append(physical);
			list.closest("#service-options").after(section);
			Array.from(list.querySelectorAll(".service-training-card")).forEach(
				(card) => physical.append(card),
			);
		}
	}
	const nav = document.querySelector(".dx-section-nav");
	if (!nav) return;
	// A measured fixed bar avoids Safari's overflow/sticky ancestor inconsistencies.
	const slot = document.createElement("div");
	slot.className = "dx-section-nav-slot";
	nav.before(slot);
	slot.append(nav);
	nav.style.marginBottom = "0";
	const dock = () => {
		// The shared controller owns geometry once all page modules are ready.
		if (nav.dataset.secondaryDockReady === "true") return;
		const header = document.querySelector("#header");
		const top =
			(header ? Math.max(0, header.getBoundingClientRect().bottom) : 90) + 36;
		const rect = slot.getBoundingClientRect();
		if (!nav.classList.contains("is-docked")) {
			const natural = nav.getBoundingClientRect();
			slot.dataset.inset = String(natural.left - rect.left);
			slot.dataset.width = String(natural.width);
		}
		slot.style.height = nav.offsetHeight + "px";
		const fixed = rect.top <= top;
		nav.classList.toggle("is-docked", fixed);
		nav.style.top = top + "px";
		nav.style.left = fixed ? rect.left + Number(slot.dataset.inset) + "px" : "";
		nav.style.width = fixed ? slot.dataset.width + "px" : "";
	};
	window.addEventListener("resize", () => {
		nav.classList.remove("is-docked");
		nav.style.width = "";
		nav.style.left = "";
		dock();
	});
	const links = [...nav.querySelectorAll("a")];
	const targets = links.map((link) => document.querySelector(link.hash));
	let ticking = false;
	const update = () => {
		ticking = false;
		dock();
		const edge =
			(parseFloat(getComputedStyle(nav).top) || 0) + nav.offsetHeight + 40;
		let index = 0;
		targets.forEach((target, i) => {
			if (target.getBoundingClientRect().top <= edge) index = i;
		});
		links.forEach((link, i) =>
			i === index
				? link.setAttribute("aria-current", "location")
				: link.removeAttribute("aria-current"),
		);
	};
	links.forEach((link, i) =>
		link.addEventListener("click", (event) => {
			if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
				return;
			event.preventDefault();
			history.pushState(null, "", link.hash);
			const top =
				window.scrollY +
				targets[i].getBoundingClientRect().top -
				(parseFloat(nav.style.top) || 0) -
				nav.offsetHeight -
				24;
			window.scrollTo({
				top: Math.max(0, top),
				behavior: reduced.matches ? "instant" : "smooth",
			});
		}),
	);
	window.addEventListener(
		"scroll",
		() => {
			if (!ticking) {
				ticking = true;
				requestAnimationFrame(update);
			}
		},
		{ passive: true },
	);
	update();
})();

// Project enquiries
(() => {
	const form = document.querySelector(".enquiry-form");
	if (!form) return;
	const steps = [...form.querySelectorAll("[data-step]")],
		progress = [...form.querySelectorAll(".enquiry-progress li")],
		error = form.querySelector(".enquiry-error"),
		next = form.querySelector("[data-next]"),
		back = form.querySelector("[data-back]"),
		submit = form.querySelector('[type="submit"]');
	const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)"),
		stage = document.createElement("div"),
		progressList = form.querySelector(".enquiry-progress");
	stage.className = "enquiry-step-stage";
	steps[0].before(stage);
	steps.forEach((fieldset) => stage.append(fieldset));
	let step = 0,
		sending = false,
		transitioning = false,
		finishTransition = null;
	const labels = {
		photography: "What would you like captured, and where?",
		"design-build": "What would you like to create?",
		wordpress: "What do you need your WordPress website to do?",
		"custom-web": "What would you like your website or application to do?",
		fixes: "What’s not working, or what would you like improved?",
		support: "What kind of ongoing help do you need?",
		unsure: "Tell me about your idea or challenge.",
	};
	const storageKey = "dxndre-project-enquiry";
	const save = () => {
		try {
			sessionStorage.setItem(
				storageKey,
				JSON.stringify(Object.fromEntries(new FormData(form))),
			);
		} catch (_) {}
	};
	const review = () => {
		const data = new FormData(form),
			selected = form.querySelector('[name="service"]:checked');
		form.querySelector("[data-brief-label]").textContent =
			labels[data.get("service")] || labels["design-build"];
		const target = form.querySelector("[data-review]");
		target.replaceChildren();
		for (const [label, value] of [
			["Service", selected?.parentElement.querySelector("strong").textContent],
			["Project", data.get("brief")],
			["Website", data.get("website")],
			["Budget", data.get("budget")],
			["Timing", data.get("timing")],
			[
				"Photo delivery",
				data.get("service") === "photography"
					? data.get("photography_delivery") === "express"
						? "24 hours (+£10)"
						: "48 hours (included)"
					: "",
			],
		]) {
			if (!value) continue;
			const row = document.createElement("p"),
				title = document.createElement("strong"),
				text = document.createElement("span");
			title.textContent = label;
			text.textContent = value;
			row.className = 'enquiry-review__item';
			row.dataset.reviewField = label.toLowerCase().replace(/\s+/g, '-');
			row.append(title, text);
			target.append(row);
		}
	};
	const show = (number, focus = true) => {
		if (transitioning || number < 0 || number >= steps.length)
			return Promise.resolve(false);
		const previous = step,
			outgoing = steps[previous],
			incoming = steps[number],
			animate =
				focus &&
				number !== previous &&
				!reducedMotion.matches &&
				typeof incoming.animate === "function",
			startHeight = stage.getBoundingClientRect().height,
			direction = number > previous ? 1 : -1;
		step = number;
		error.hidden = true;
		progress.forEach((el, index) => {
			el.removeAttribute("aria-current");
			if (index === step) el.setAttribute("aria-current", "step");
			el.classList.toggle("is-complete", index < step);
		});
		progressList.style.setProperty(
			"--enquiry-progress",
			(step + 1) / steps.length,
		);
		back.hidden = step === 0;
		next.hidden = step === steps.length - 1;
		submit.hidden = step !== steps.length - 1;
		review();
		const focusHeading = () => {
			if (!focus) return;
			const legend = incoming.querySelector("legend");
			legend.tabIndex = -1;
			legend.focus();
		};
		if (!animate) {
			steps.forEach((el, index) => {
				el.hidden = index !== step;
			});
			focusHeading();
			return Promise.resolve(true);
		}
		transitioning = true;
		stage.setAttribute("aria-busy", "true");
		form.classList.add("is-enquiry-transitioning");
		stage.style.height = `${startHeight}px`;
		stage.style.overflow = "hidden";
		steps.forEach((el, index) => {
			el.hidden = index !== number && index !== previous;
			el.inert = true;
			if (index !== number) el.setAttribute("aria-hidden", "true");
		});
		outgoing.style.position = "absolute";
		outgoing.style.inset = "0";
		outgoing.style.width = "100%";
		const endHeight = incoming.getBoundingClientRect().height,
			easing = "cubic-bezier(.22, .68, 0, 1)",
			animations = [
				stage.animate(
					[{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
					{
						duration: 440,
						easing,
						fill: "both",
					},
				),
				outgoing.animate(
					[
						{ opacity: 1, transform: "translateY(0)" },
						{ opacity: 0, transform: `translateY(${-12 * direction}px)` },
					],
					{ duration: 180, easing: "ease-out", fill: "both" },
				),
				incoming.animate(
					[
						{ opacity: 0, transform: `translateY(${18 * direction}px)` },
						{ opacity: 1, transform: "translateY(0)" },
					],
					{ duration: 320, delay: 100, easing, fill: "both" },
				),
			];
		return new Promise((resolve) => {
			let finished = false;
			const finish = () => {
				if (finished) return;
				finished = true;
				animations.forEach((animation) => animation.cancel());
				steps.forEach((el, index) => {
					el.hidden = index !== step;
					el.inert = false;
					el.removeAttribute("aria-hidden");
					el.style.removeProperty("position");
					el.style.removeProperty("inset");
					el.style.removeProperty("width");
				});
				stage.style.removeProperty("height");
				stage.style.removeProperty("overflow");
				stage.removeAttribute("aria-busy");
				form.classList.remove("is-enquiry-transitioning");
				transitioning = false;
				finishTransition = null;
				focusHeading();
				resolve(true);
			};
			finishTransition = finish;
			Promise.all(animations.map((animation) => animation.finished)).then(
				finish,
				finish,
			);
		});
	};
	window.addEventListener("resize", () => finishTransition?.(), {
		passive: true,
	});
	reducedMotion.addEventListener("change", () => {
		if (reducedMotion.matches) finishTransition?.();
	});
	const validate = (number, focus = true) => {
		const invalid = [
			...steps[number].querySelectorAll("input,select,textarea"),
		].find((el) => !el.checkValidity());
		if (!invalid) return true;
		error.textContent =
			number === 0
				? "Choose a service to continue."
				: "Please complete the required fields and check their format.";
		error.hidden = false;
		if (focus) {
			invalid.focus();
			invalid.reportValidity();
		}
		return false;
	};
	try {
		const saved = JSON.parse(sessionStorage.getItem(storageKey) || "{}");
		for (const [key, value] of Object.entries(saved)) {
			const field = form.elements.namedItem(key);
			if (!field || key === "company_url") continue;
			if (key === "service") {
				[...form.querySelectorAll('[name="service"]')].forEach(
					(el) => (el.checked = el.value === value),
				);
			} else field.value = value;
		}
	} catch (_) {}
	let calculatorBriefReady = false;
	if (new URLSearchParams(location.search).get("from_calculator") === "1") {
		try {
			const quote = JSON.parse(
				sessionStorage.getItem("dxndre-calculator-handoff") || "null",
			);
			if (
				quote &&
				Number.isFinite(quote.total) &&
				quote.total >= 0 &&
				Array.isArray(quote.summary)
			) {
				calculatorBriefReady = true;
				const timingLabels = {
					no_rush: "No rush — 12+ weeks",
					flexible: "Standard — 5–12 weeks",
					priority: "Priority — 1–4 weeks",
					urgent: "Urgent — under 7 days",
				};
				if (timingLabels[quote.timeline] && form.elements.timing) {
					form.elements.timing.value = timingLabels[quote.timeline];
				}
				const mapping = {
					design: "design-build",
					landing_page: "custom-web",
					development: "custom-web",
					wp_development: "wordpress",
					comprehensive: "design-build",
					retainer: "support",
					one_off: "fixes",
				};
				[...form.querySelectorAll('[name="service"]')].forEach(
					(el) =>
						(el.checked = el.value === (mapping[quote.service] || "unsure")),
				);
				if (!form.elements.brief.value)
					form.elements.brief.value =
						"Calculator project outline:\n" +
						quote.summary.join("\n") +
						(quote.reference
							? "\nEstimate reference: " + quote.reference
							: "") +
						"\n\nIndicative estimate: " +
						new Intl.NumberFormat("en-GB", {
							style: "currency",
							currency: "GBP",
						}).format(quote.total) +
						(quote.monthly ? " per month" : "") +
						" (subject to confirming the brief).";
				if (!form.elements.name.value)
					form.elements.name.value = quote.name || "";
				if (!form.elements.company.value)
					form.elements.company.value = quote.company || "";
				if (!form.elements.budget.value)
					form.elements.budget.value =
						quote.total < 1000
							? "Under £1,000"
							: quote.total < 3000
							? "£1,000–£3,000"
							: quote.total < 5000
							? "£3,000–£5,000"
							: quote.total < 10000
							? "£5,000–£10,000"
							: "£10,000+";
				save();
			}
		} catch (_) {}
	}
	if (new URLSearchParams(location.search).get("from_calculator") === "1") {
		const note = document.createElement("p");
		note.className = "enquiry-calculator-note";
		note.setAttribute("role", "status");
		note.textContent = calculatorBriefReady
			? "Your calculator brief is ready. Your service is selected — press Continue to review your project details."
			: "You’ve come from the calculator. Choose your service, then press Continue to add your project details.";
		form.querySelector(".enquiry-progress").after(note);
	}
	const incoming = new URLSearchParams(location.search).get("enquiry_service");
	if (incoming && Object.hasOwn(labels, incoming))
		[...form.querySelectorAll('[name="service"]')].forEach(
			(el) => (el.checked = el.value === incoming),
		);
	form.addEventListener("input", save);
	form.addEventListener("change", () => {
		save();
		review();
	});
	next.addEventListener("click", () => {
		if (!transitioning && validate(step)) show(step + 1);
	});
	back.addEventListener("click", () => show(step - 1));
	form
		.querySelectorAll("[data-edit]")
		.forEach((button) =>
			button.addEventListener("click", () => show(Number(button.dataset.edit))),
		);
	form.addEventListener("submit", async (event) => {
		event.preventDefault();
		if (sending || transitioning) return;
		if (step < 2) {
			if (validate(step)) show(step + 1);
			return;
		}
		for (let n = 0; n < 3; n++) {
			if (!validate(n, false)) {
				await show(n, false);
				validate(n);
				return;
			}
		}
		sending = true;
		submit.disabled = true;
		submit.textContent = "Sending…";
		form.querySelector(".enquiry-status").textContent = "Sending your enquiry…";
		error.hidden = true;
		const body = new FormData(form);
		body.append("action", "dx_project_enquiry");
		body.append("nonce", DX_ENQUIRY.nonce);
		try {
			const response = await fetch(DX_ENQUIRY.url, {
				method: "POST",
				body,
				credentials: "same-origin",
			});
			const result = await response.json();
			if (!response.ok || !result.success)
				throw new Error(result.data?.message || "Please try again.");
			form.hidden = true;
			if (form.closest(".enquiry-layout"))
				form.closest(".enquiry-layout").hidden = true;
			const success = document.querySelector(".enquiry-success");
			success.hidden = false;
			success.focus();
			try {
				sessionStorage.removeItem(storageKey);
			} catch (_) {}
		} catch (err) {
			error.textContent =
				err.message === "Failed to fetch"
					? "Connection interrupted. Your answers are preserved; please try again."
					: err.message;
			error.hidden = false;
			error.tabIndex = -1;
			error.focus();
		} finally {
			sending = false;
			submit.disabled = false;
			submit.textContent = "Send project enquiry ↗";
			form.querySelector(".enquiry-status").textContent = "";
		}
	});
	show(0, false);
})();

// A lightweight directory lookup shared by the Buses landing page and app switcher.
(() => {
	const config = window.DXB;
	if (!config?.api) return;
	let directoryPromise;
	const getDirectory = () => directoryPromise ||= fetch(config.api + 'routes', { credentials: 'same-origin' })
		.then(async (response) => {
			const data = await response.json();
			if (!response.ok || !Array.isArray(data)) throw new Error(data.message || 'The route directory is temporarily unavailable.');
			return data;
		}).catch((error) => { directoryPromise = null; throw error; });
	const normalise = (value) => String(value || '').trim().toUpperCase();
	const destination = (route) => new URL(encodeURIComponent(route.toLowerCase()) + '/', config.dashboardBase || new URL('/buses/routes/', location.origin)).href;
	const recentRoutes = () => {
		try { return JSON.parse(localStorage.getItem('dxb-recent-routes') || '[]').filter((value) => typeof value === 'string' && /^[A-Z0-9]{1,6}$/.test(value)).slice(0, 12); }
		catch { return []; }
	};
	const remember = (route) => {
		try { localStorage.setItem('dxb-recent-routes', JSON.stringify([route, ...recentRoutes().filter((item) => item !== route)].slice(0, 12))); }
		catch {}
	};
	document.querySelectorAll('#dxbus-lookup,[data-dxbus-route-switcher]').forEach((root, instance) => {
		const form = root.querySelector('[data-dxbus-lookup-form],#dxbus-lookup-form,form') || (root.matches('form') ? root : null);
		const input = root.querySelector('[data-dxbus-route-input],#dxbus-lookup-input,input[name=route]');
		if (!form || !input) return;
		let list = root.querySelector('[data-dxbus-suggestions],#dxbus-lookup-options');
		let status = root.querySelector('[data-dxbus-lookup-status],#dxbus-lookup-status');
		if (!list) { list = document.createElement('ul'); list.className = 'dxbus-lookup__options'; list.hidden = true; input.after(list); }
		if (!status) { status = document.createElement('p'); status.className = 'dxbus-lookup__status'; status.setAttribute('role', 'status'); form.after(status); }
		list.id ||= 'dxbus-route-options-' + instance;
		list.setAttribute('role', 'listbox');
		list.setAttribute('aria-label', 'Matching London bus routes');
		input.setAttribute('role', 'combobox');
		input.setAttribute('aria-autocomplete', 'list');
		input.setAttribute('aria-controls', list.id);
		input.setAttribute('aria-expanded', 'false');
		input.removeAttribute('list');
		input.setAttribute('autocomplete', 'off');
		input.setAttribute('spellcheck', 'false');
		const appRoot = root.closest('.dxbus-app');
		let directory = [], selected = -1, matches = [], busy = false, requestId = 0, automaticTimer = 0, composing = false;
		const setStatus = (message, error = false) => {
			status.textContent = message; status.classList.toggle('is-error', error);
			if (appRoot) { status.classList.toggle('dxbus-sr', !error); status.classList.toggle('dxbus-lookup__status', error); }
		};
		const close = () => { list.hidden = true; root.classList.remove('has-suggestions'); selected = -1; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); };
		const select = (index) => {
			selected = index;
			[...list.children].forEach((option, i) => { option.setAttribute('aria-selected', String(i === index)); option.classList.toggle('is-selected', i === index); });
			if (index >= 0) { input.setAttribute('aria-activedescendant', list.children[index].id); list.children[index].scrollIntoView({ block: 'nearest' }); }
			else input.removeAttribute('aria-activedescendant');
		};
		const cancelAutomatic = () => { clearTimeout(automaticTimer); automaticTimer = 0; };
		const openRoute = async (route) => {
			cancelAutomatic(); close();
			if (!appRoot?.dxNavigateRoute) { remember(route); location.assign(destination(route)); return; }
			const token = ++requestId;
			busy = true; form.setAttribute('aria-busy', 'true'); setStatus(`Loading route ${route}…`);
			try {
				if (await appRoot.dxNavigateRoute(route)) { if (token === requestId) setStatus(`Route ${route} loaded.`); }
			} catch (error) { if (token === requestId) setStatus(error.message || 'Route information is temporarily unavailable. Please try again.', true); }
			finally { if (token === requestId) { busy = false; form.removeAttribute('aria-busy'); } }
		};
		const scheduleAutomatic = () => {
			cancelAutomatic();
			if (!appRoot || composing || document.activeElement !== input) return;
			const route = normalise(input.value), token = requestId;
			// Complete identifiers load automatically; unmatched entries also check the archive.
            const exact = directory.some(item => normalise(item.name) === route);
            if (!/^[A-Z0-9]{1,6}$/.test(route) || route === normalise(appRoot.dataset.route) || (!exact && directory.some(item => normalise(item.name).startsWith(route)))) return;
			automaticTimer = setTimeout(() => {
				if (token === requestId && document.activeElement === input && normalise(input.value) === route && !composing) openRoute(route);
			}, exact ? 550 : 900);
		};
		const suggest = () => {
			const value = normalise(input.value);
			input.dataset.routeType = /^N\d/.test(value) ? 'night' : 'day';
			input.classList.toggle('is-night', /^N\d/.test(value));
			list.replaceChildren(); selected = -1; matches = []; input.removeAttribute('aria-activedescendant');
			if (!value) { close(); setStatus(appRoot ? 'Type a route number to load its dashboard automatically.' : 'Search by route number. Choose a suggestion or press Enter.'); return; }
			if (!/^[A-Z0-9]{1,6}$/.test(value)) { close(); setStatus('Use a route number such as 112, N118 or 18.', true); return; }
			matches = directory.filter((route) => normalise(route.name).startsWith(value)).slice(0, 8);
			matches.forEach((route, i) => {
				const option = document.createElement('li'); option.id = list.id + '-' + i; option.setAttribute('role', 'option'); option.setAttribute('aria-selected', 'false');
				const button = document.createElement('button'); button.type = 'button'; button.tabIndex = -1;
				const badge = document.createElement('strong'); badge.className = 'dxbus-lookup__route'; badge.dataset.type = /^N\d/i.test(route.name) ? 'night' : 'day'; badge.textContent = route.name;
				const label = document.createElement('span'); label.textContent = /^N\d/i.test(route.name) ? 'Night bus dashboard' : 'Route dashboard';
				const arrow = document.createElement('span'); arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true');
				button.append(badge, label, arrow); button.addEventListener('click', () => openRoute(normalise(route.name))); option.append(button); list.append(option);
			});
			list.hidden = !matches.length; root.classList.toggle('has-suggestions', matches.length > 0); input.setAttribute('aria-expanded', String(matches.length > 0));
			setStatus(matches.length ? `${matches.length} matching route${matches.length === 1 ? '' : 's'}. Use the arrow keys to choose.` : directory.length ? appRoot ? 'Checking this route and its archive automatically…' : 'No directory suggestions. Press Enter to check this route and its archive.' : 'Loading the route directory…');
		};
		const load = async () => {
			try { directory = await getDirectory(); if (document.activeElement === input) { suggest(); scheduleAutomatic(); } }
			catch { setStatus('Suggestions are unavailable. Checking your route directly.', true); scheduleAutomatic(); }
		};
		input.addEventListener('focus', () => { if (!directory.length) load(); else suggest(); });
		input.addEventListener('input', () => {
			requestId++; busy = false; form.removeAttribute('aria-busy'); cancelAutomatic(); appRoot?.dxCancelRouteRequest?.();
			suggest(); if (!directory.length) load(); else scheduleAutomatic();
		});
		input.addEventListener('compositionstart', () => { composing = true; cancelAutomatic(); });
		input.addEventListener('compositionend', () => { composing = false; scheduleAutomatic(); });
		input.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') { cancelAutomatic(); close(); }
			if (['ArrowDown', 'ArrowUp'].includes(event.key) && matches.length) {
				event.preventDefault(); cancelAutomatic(); list.hidden = false; root.classList.add('has-suggestions'); input.setAttribute('aria-expanded', 'true'); select(event.key === 'ArrowDown' ? (selected + 1) % matches.length : (selected - 1 + matches.length) % matches.length);
			}
			if (event.key === 'Enter' && selected >= 0 && !list.hidden) { event.preventDefault(); openRoute(normalise(matches[selected].name)); }
		});
		root.addEventListener('focusout', (event) => { if (!root.contains(event.relatedTarget)) { cancelAutomatic(); close(); } });
		document.addEventListener('click', (event) => { if (!root.contains(event.target)) close(); });
		form.addEventListener('submit', async (event) => {
			event.preventDefault(); cancelAutomatic(); if (busy) return;
			const route = normalise(input.value);
			if (!/^[A-Z0-9]{1,6}$/.test(route)) { setStatus('Enter a route number such as 112, N118 or 18.', true); input.focus(); return; }
			if (appRoot || directory.some((item) => normalise(item.name) === route)) { openRoute(route); return; }
			const token = ++requestId; busy = true; form.setAttribute('aria-busy', 'true'); setStatus(`Checking route ${route}…`); close();
			try {
				const response = await fetch(config.api + 'route/' + encodeURIComponent(route), { credentials: 'same-origin' });
				const data = await response.json();
				if (token !== requestId) return;
				if (!response.ok || !data.id) throw new Error(data.message || 'This route could not be found. Try another route number.');
				openRoute(route);
			} catch (error) { if (token === requestId) setStatus(error.message || 'Route information is temporarily unavailable. Please try again.', true); }
			finally { busy = false; form.removeAttribute('aria-busy'); }
		});
		const recents = root.querySelector('[data-dxbus-recent],#dxbus-lookup-recent');
		if (recents) {
			recents.replaceChildren(); recents.hidden = !recentRoutes().length;
			recentRoutes().forEach((route) => { const link = document.createElement('a'); link.href = destination(route); link.textContent = route; link.className = 'dxbus-lookup__recent-route'; link.dataset.type = /^N\d/.test(route) ? 'night' : 'day'; recents.append(link); });
		}
		if (root.id === 'dxbus-lookup') load();
	});
})();

// Reuse the established photographic viewer on the landing page and route app.
window.dxInitBusGallery = (root) => {
	if (root.dxOpenBusPhoto) return root.dxOpenBusPhoto;
	const $ = (selector) => root.querySelector(selector);
	const $$ = (selector) => [...root.querySelectorAll(selector)];
	const text = (tag, value, className = '') => { const element = document.createElement(tag); element.textContent = value; element.className = className; return element; };
	if (!$('#dxb-lightbox') || !window.DXB) return () => {};
	let photoFilter = "all",
		photoIndex = 0,
		lastFocus = null;
	const lightbox = $("#dxb-lightbox");
	function matchesPhoto(card, filter) {
		const route = card.dataset.photoRoute.toUpperCase(),
			scenery = card.dataset.photoScenery || "";
		if (filter === "all") return true;
		if (filter === "buses") return Boolean(route);
		if (filter === "scenery") return !route;
		if (filter.startsWith("scenery-"))
			return !route && scenery === filter.slice(8);
		if (filter === "night") return /^N\d/.test(route);
		if (filter === "lettered")
			return /[A-Z]/.test(route) && !/^N\d/.test(route);
		if (filter.startsWith("range-")) {
			const min = Number(filter.slice(6));
			return (
				/^\d+$/.test(route) &&
				Number(route) >= min &&
				(min === 401 || Number(route) < min + 100)
			);
		}
		return route === filter;
	}

	function filterPhotos() {
		const query = ($("#dxb-photo-search")?.value || "").trim().toLowerCase();
		let count = 0;
		$$("#dxb-gallery [data-photo]").forEach((card) => {
			const show =
				matchesPhoto(card, photoFilter) &&
				card.dataset.photoSearch.includes(query);
			card.hidden = !show;
			if (show) count++;
		});
		if ($("#dxb-gallery-empty")) $("#dxb-gallery-empty").hidden = count > 0;
	}
	$$("[data-photo-filter]").forEach((button) =>
		button.addEventListener("click", () => {
			photoFilter = button.dataset.photoFilter;
			const group =
				photoFilter === "all"
					? ""
					: photoFilter.startsWith("scenery")
					? "scenery"
					: "buses";
			document
				.querySelectorAll("[data-photo-group]")
				.forEach((el) => (el.hidden = el.dataset.photoGroup !== group));
			$$("[data-photo-filter]").forEach((b) =>
				b.setAttribute("aria-pressed", String(b === button)),
			);
			filterPhotos();
		}),
	);
	$("#dxb-photo-search")?.addEventListener("input", filterPhotos);
	function renderPhoto() {
		const p = DXB.photos[photoIndex];
		if (!p) return;
		if (window.dxSetPhoto) window.dxSetPhoto($("#dxb-lightbox-image"), p);
		else { $("#dxb-lightbox-image").src = p.full || p.image; $("#dxb-lightbox-image").alt = p.alt || p.title; }
		$("#dxb-lightbox-route").textContent = p.route
			? `Route ${p.route}`
			: "Bus photography";
		$("#dxb-lightbox-title").textContent = p.title;
		$("#dxb-lightbox-caption").textContent = p.caption;
		$("#dxb-lightbox-meta").textContent = [
			p.vehicle,
			p.operator,
			p.location,
			p.date,
		]
			.filter(Boolean)
			.join(" · ");
		const technical = $("#dxb-photo-technical"),
			map = $("#dxb-photo-map");
		technical.replaceChildren();
		map.replaceChildren();
		$("#dxb-bad-photo").hidden = !p.bad;
		lightbox.classList.remove("is-zoomed");
		lightbox.querySelector("#dxb-lightbox-image").style.transform = "";
		photoImage.setAttribute("aria-pressed", "false");
		photoImage.setAttribute("aria-label", "Zoom photograph");
		const rawDate = p.captured || p.date;
		const captured = new Date(rawDate),
			cutoff = new Date();
		cutoff.setFullYear(cutoff.getFullYear() - 5);
		cutoff.setHours(0, 0, 0, 0);
		let old = $("#dxb-old-photo");
		if (!old) {
			old = text("span", "◷ Old Photo");
			old.id = "dxb-old-photo";
			$("#dxb-bad-photo").after(old);
		}
		old.hidden = !(Number.isFinite(captured.getTime()) && captured < cutoff);
		old.title = "Photographed more than five calendar years ago.";

		Object.entries(p.technical || {}).forEach(([label, value]) => {
			if (label !== "gps") {
				technical.append(text("dt", label), text("dd", String(value)));
			}
		});
		const gps = p.technical?.gps;
		if (gps) {
			window.dxRenderPhotoMap?.(map, gps, p);
		} else if (p.location) {
			const label = text("p", "📍 " + p.location);
			label.className = "dx-photo-location";
			map.append(label);
		}
		$("#dxb-lightbox-count").textContent = `${root.matches(".dxbus-app") ? DXB.photos.filter((item, index) => index <= photoIndex && String(item.route).toUpperCase() === String(DXB.route).toUpperCase()).length : photoIndex + 1} / ${root.matches(".dxbus-app") ? DXB.photos.filter((item) => String(item.route).toUpperCase() === String(DXB.route).toUpperCase()).length : DXB.photos.length}`;
	}
	function openPhoto(index) {
		photoIndex = index;
		renderPhoto();
		if (!lightbox.open) {
			lastFocus = document.activeElement;
			lightbox.showModal();
			document.body.classList.add("dxb-lightbox-open");
		}
	}
	root.addEventListener("click", (event) => {
		const card = event.target.closest('[data-photo]');
		if (!card || !root.contains(card)) return;
		event.preventDefault();
		openPhoto(Number(card.dataset.photo));
	});
	const photoImage = $("#dxb-lightbox-image");
	const photoViewport = document.createElement("div");
	photoViewport.className = "dxb-photo-viewport";
	photoImage.before(photoViewport);
	photoViewport.append(photoImage);

	photoImage.tabIndex = 0;
	photoImage.setAttribute("role", "button");
	photoImage.setAttribute("aria-label", "Zoom photograph");
	let panX = 0,
		panY = 0,
		drag = null,
		moved = false;
	const paintPan = () => {
		photoImage.style.transform = lightbox.classList.contains("is-zoomed")
			? `translate(${panX}px, ${panY}px) scale(2)`
			: "";
	};
	const toggleZoom = (event) => {
		if (moved) {
			moved = false;
			return;
		}
		const zoomed = lightbox.classList.toggle("is-zoomed");
		const r = photoViewport.getBoundingClientRect();
		panX = event?.clientX ? r.left + r.width / 2 - event.clientX : 0;
		panY = event?.clientY ? r.top + r.height / 2 - event.clientY : 0;
		paintPan();
		photoImage.setAttribute(
			"aria-label",
			zoomed ? "Fit photograph. Drag to explore." : "Zoom photograph",
		);
		photoImage.setAttribute("aria-pressed", String(zoomed));
	};
	photoViewport.addEventListener("click", toggleZoom);
	photoViewport.addEventListener("pointerdown", (e) => {
		if (!lightbox.classList.contains("is-zoomed")) return;
		drag = { x: e.clientX, y: e.clientY, px: panX, py: panY };
		moved = false;
		photoImage.style.transition = "none";
		photoViewport.setPointerCapture(e.pointerId);
	});
	photoViewport.addEventListener("pointermove", (e) => {
		if (!drag) return;
		const dx = e.clientX - drag.x,
			dy = e.clientY - drag.y;
		if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;
		panX = Math.max(
			-photoViewport.clientWidth / 2,
			Math.min(photoViewport.clientWidth / 2, drag.px + dx),
		);
		panY = Math.max(
			-photoViewport.clientHeight / 2,
			Math.min(photoViewport.clientHeight / 2, drag.py + dy),
		);
		paintPan();
	});
	["pointerup", "pointercancel"].forEach((type) =>
		photoViewport.addEventListener(type, () => {
			drag = null;
			photoImage.style.transition = "";
		}),
	);
	photoImage.addEventListener("keydown", (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			toggleZoom();
		}
	});
	function movePhoto(delta) {
		const choices = root.matches(".dxbus-app") ? DXB.photos.map((item, index) => String(item.route).toUpperCase() === String(DXB.route).toUpperCase() ? index : -1).filter((index) => index >= 0) : DXB.photos.map((_, index) => index);
		photoIndex = choices[(choices.indexOf(photoIndex) + delta + choices.length) % choices.length] ?? photoIndex;
		renderPhoto();
	}
	$("[data-lightbox-prev]").addEventListener("click", () => movePhoto(-1));
	$("[data-lightbox-next]").addEventListener("click", () => movePhoto(1));
	$(".dxb-close").addEventListener("click", () => lightbox.close());
	lightbox.addEventListener("close", () => {
		document.body.classList.remove("dxb-lightbox-open");
		lastFocus?.focus();
	});
	lightbox.addEventListener("click", (event) => {
		if (event.target === lightbox) {
			const r = lightbox.getBoundingClientRect();
			if (
				event.clientX < r.left ||
				event.clientX > r.right ||
				event.clientY < r.top ||
				event.clientY > r.bottom
			)
				lightbox.close();
		}
	});
	lightbox.addEventListener("keydown", (event) => {
		if (event.key === "ArrowLeft") movePhoto(-1);
		if (event.key === "ArrowRight") movePhoto(1);
	});
	root.dxOpenBusPhoto = openPhoto;
	return openPhoto;
};

// London by bus
(() => {
	"use strict";
	const root = document.querySelector(".dxbus-app,.dxb");
	if (!root || !window.DXB) return;
	const app = root.matches('.dxbus-app');
	const openPhoto = (app || root.querySelector("#dxbus-lookup,#dxb-route-input")) ? window.dxInitBusGallery(root) : () => {};
	if (!root.querySelector('#dxb-route-input')) {
		// Quick Lookup deliberately has no old route panels. Keep the journal navigation.
		const links = [...root.querySelectorAll('.dxb-nav a')];
		const update = () => {
			let active = 'buses-overview';
			['routes','bus-diary','news','bus-models','photography'].forEach((id) => { const section = document.getElementById(id); if (section && section.getBoundingClientRect().top <= 145) active = id; });
			links.forEach((link) => { if (link.hash === '#' + active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
			const nav = root.querySelector('.dxb-nav'); if (nav) nav.classList.toggle('is-stuck', nav.getBoundingClientRect().top <= parseFloat(getComputedStyle(nav).top) + 1);
		};
		window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true }); update();
		return;
	}
	const $ = (s) => root.querySelector(s);
	const $$ = (s) => Array.from(root.querySelectorAll(s));
	const inFlightRequests = new Map();
	const input = $("#dxb-route-input"),
		status = $("#dxb-status"),
		result = $("#dxb-result");
	const initialPhoto = {
		src: $("#dxb-route-photo")?.src || "",
		alt: $("#dxb-route-photo")?.alt || "",
		caption: $("#dxb-route-caption")?.textContent || "",
	};
	let controller,
		arrivalsController,
		debounce,
		timer,
		retryTicker,
		sequence = 0,
		current = null,
		tab = "overview",
		failures = 0;
	const text = (tag, value, className) => {
		const el = document.createElement(tag);
		el.textContent = value;
		if (className) el.className = className;
		return el;
	};
	const pinIcon = () => {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("viewBox", "0 0 24 24");
		svg.setAttribute("class", "dxb-pin-icon");
		svg.setAttribute("fill", "currentColor");
		svg.setAttribute("aria-hidden", "true");
		svg.setAttribute("focusable", "false");
		const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttribute(
			"d",
			"M16 9V4h1V2H7v2h1v5c0 1.66-1.34 3-3 3v2h6v8h2v-8h6v-2c-1.66 0-3-1.34-3-3Z",
		);
		svg.append(path);
		return svg;
	};
	const setPinLabel = (button, label) => {
		button.replaceChildren(pinIcon(), document.createTextNode(label));
	};
	const readSaved = (key) => {
		try {
			const v = JSON.parse(localStorage.getItem(key) || "[]");
			return Array.isArray(v)
				? v
						.filter((x) => typeof x === "string" && /^[A-Z0-9]{1,12}$/.test(x))
						.slice(0, 12)
				: [];
		} catch {
			return [];
		}
	};
	const saveList = (key, value) => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch {}
	};
	let recent = readSaved("dxb-recent-routes"),
		marked = readSaved("dxb-marked-vehicles"),
		arrivalRows = [];
	const recentBox = $(".dxb-recent");
	function routeSpacing(value) {
		return /^(?:[0-9]{1,3}|[A-Z][0-9]|[0-9][A-Z])$/i.test(value)
			? "tight"
			: "normal";
	}
	input.addEventListener("input", () => {
		input.dataset.spacing = routeSpacing(input.value.trim());
	});
	function renderRecent() {
		recentBox.replaceChildren();
		recentBox.hidden = !recent.length;
		(app ? recent.slice(0, 4) : recent).forEach((route) => {
			const b = text(app ? "a" : "button", route);
			if (app) b.href = new URL(encodeURIComponent(route.toLowerCase()) + "/", DXB.dashboardBase || new URL("/buses/routes/", location.origin)).href;
			b.type = "button";
			b.dataset.route = route;
			b.dataset.spacing = routeSpacing(route);
			b.setAttribute("aria-pressed", String(current?.name === route));
			recentBox.append(b);
		});
	}
	recentBox.addEventListener("click", (e) => {
		const b = e.target.closest("[data-route]");
		if (b && app && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) {
			e.preventDefault(); root.dxCancelRouteRequest();
			root.dxNavigateRoute(b.dataset.route).catch((error) => announce(error.message, true));
		} else if (b && !app) search(b.dataset.route);
	});
	renderRecent();
	function remember(route) {
		recent = [route, ...recent.filter((r) => r !== route)].slice(0, 12);
		saveList("dxb-recent-routes", recent);
		renderRecent();
	}
	function renderMarked() {
		const box = $("#dxb-marked");
		const expanded = new Set(
			Array.from(box.querySelectorAll("details[open]")).map(
				(el) => el.dataset.reg,
			),
		);
		box.replaceChildren();
		$("#dxb-tracking").replaceChildren();
		const pinTab = $("#tab-pinned");
		if (pinTab) pinTab.hidden = app ? false : !marked.length;
		if (app) updatePinnedCount();
		if (!marked.length) {
			if (app) box.append(text("p", "No buses pinned yet. Pin a vehicle in Live Tracking or Route Explorer to keep it here on this browser.", "dxbus-widget-empty"));
			else if (tab === "pinned") activateTab("overview");
			return;
		}
		box.append(
			text("p", "PINNED BUSES", "dxb-pins-heading"),
			text(
				"p",
				"Saved on this browser · expand a bus for its latest arrivals.",
				"dxb-small",
			),
		);
		marked.forEach((reg) => {
			const item = text("details", "", "dxb-pinned-bus");
			item.dataset.reg = reg;
			const summary = text("summary", "");
			summary.append(
				pinIcon(),
				text("strong", formatRegistration(reg), "dxb-pin-registration"),
			);
			const fleetLabel = text("span", "", "dxb-pin-fleet");
			summary.append(fleetLabel);
            const modelLabel = text('span', 'Checking vehicle details…', 'dxb-pin-model');
            const routeLabel = text('span', 'Checking current route…', 'dxb-pin-route');
            summary.append(modelLabel, routeLabel);
            request('vehicle/' + encodeURIComponent(reg) + '/arrivals').then(data => {
                if (!summary.isConnected) return;
                const routes = [...new Set((data.arrivals || []).filter(row => Date.parse(row.expected) > Date.now() - 15000).map(row => row.route).filter(Boolean))];
                routeLabel.textContent = routes.length ? 'Route ' + routes.join(' / ') : 'No current route predictions';
            }).catch(() => { if (summary.isConnected) routeLabel.textContent = 'Current route unavailable'; });
			getVehicle(reg)
				.then((v) => {
					if (summary.isConnected) {
						fleetLabel.textContent = v.fleet ? "· " + v.fleet : "";
                        modelLabel.textContent = v.model || "Model unconfirmed";
						if (v.source) { const link = sourceLink("Full vehicle details ↗", v.source); link.className = "dxb-vehicle-source"; content.append(link); }
					}
				})
				.catch(() => { if (summary.isConnected) modelLabel.textContent = "Vehicle details unavailable"; });
			summary.append(text("span", "Arrivals +", "dxb-pin-toggle"));
			const content = text("div", "", "dxb-pin-content");
			const actions = text("div", "", "dxb-pin-actions");
			const refresh = text("button", "Refresh arrivals");
			refresh.type = "button";
			const results = text("div", "", "dxb-pin-results");
			results.setAttribute("aria-live", "polite");
			refresh.addEventListener("click", () => trackVehicle(reg, results));
			const remove = text("button", "Dismiss pin ×");
			remove.type = "button";
			remove.setAttribute(
				"aria-label",
				"Dismiss pin for " + formatRegistration(reg),
			);
			remove.addEventListener("click", () => {
				marked = marked.filter((v) => v !== reg);
				saveList("dxb-marked-vehicles", marked);
				renderMarked();
				if ($("#dxb-arrivals") && !$("#panel-arrivals").hidden)
					renderArrivals();
			});
			actions.append(refresh, remove);
			content.append(results, actions);
			item.append(summary, content);
			let disclosureAnimation = null;
			summary.addEventListener("click", (e) => {
				if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
				e.preventDefault();
				if (disclosureAnimation) return;
				const opening = !item.open;
				if (opening) item.open = true;
				disclosureAnimation = content.animate(
					[
						{
							height: opening ? "0px" : content.scrollHeight + "px",
							opacity: opening ? 0 : 1,
						},
						{
							height: opening ? content.scrollHeight + "px" : "0px",
							opacity: opening ? 1 : 0,
						},
					],
					{ duration: 320, easing: "cubic-bezier(.22,1,.36,1)" },
				);
				content.style.overflow = "hidden";
				disclosureAnimation.onfinish = () => {
					if (!opening) item.open = false;
					content.style.overflow = "";
					disclosureAnimation = null;
				};
			});
			box.append(item);
			item.addEventListener("toggle", () => {
				summary.lastChild.textContent = item.open ? "Collapse −" : "Arrivals +";
				if (item.open) trackVehicle(reg, results);
			});
			item.open = expanded.has(reg);
		});
	}
	let trackingSequence = 0;
	async function trackVehicle(reg, box) {
		const token = ++trackingSequence;
		box.dataset.request = String(token);
		box.replaceChildren(text("p", "Checking " + reg + "…", "dxb-small"));
		try {
			const data = await request(
				"vehicle/" + encodeURIComponent(reg) + "/arrivals",
			);
			if (!box.isConnected || box.dataset.request !== String(token)) return;
			box.replaceChildren();
			const live = data.arrivals.filter(
				(a) => Date.parse(a.expected) > Date.now() - 15000,
			);
			if (!live.length)
				box.append(
					text(
						"p",
						"No current TfL predictions for this vehicle. It may be off service or not reporting.",
						"dxb-small",
					),
				);
			live.sort((a, b) => Date.parse(a.expected) - Date.parse(b.expected));
			const badge = (route) => {
				const el = text("span", route, "dx-route-badge");
				el.dataset.type = /^N/i.test(route)
					? "night"
					: /^SL/i.test(route)
					? "superloop"
					: "day";
				return el;
			};
			if (live.length) {
				const first = live[0],
					summary = text(
						"p",
						formatRegistration(reg) + " is currently running on the ",
						"dxb-pin-summary",
					);
				summary.append(
					badge(first.route),
					document.createTextNode(" towards " + first.destination + "."),
				);
				box.append(summary);
				const table = text("table", "", "dxb-pin-table"),
					head = text("thead"),
					row = text("tr");
				["Route", "Bus stop", "Towards", "Expected"].forEach((label) => {
					const th = text("th", label);
					th.scope = "col";
					row.append(th);
				});
				head.append(row);
				table.append(head);
				const body = text("tbody");
				live.forEach((a) => {
					const row = text("tr"),
						route = text("td");
					route.append(badge(a.route));
					row.append(
						route,
						text("td", a.stop),
						text("td", a.destination),
						text(
							"td",
							new Date(a.expected).toLocaleTimeString("en-GB", {
								timeZone: "Europe/London",
								hour: "2-digit",
								minute: "2-digit",
							}),
						),
					);
					body.append(row);
				});
				table.append(body);
				box.append(table);
			}

			box.append(
				text(
					"small",
					"Checked " +
						new Date().toLocaleTimeString("en-GB") +
						" · arrival predictions, not a GPS location",
				),
			);
		} catch {
			if (box.isConnected && box.dataset.request === String(token))
				box.replaceChildren(
					text(
						"p",
						"Vehicle predictions are temporarily unavailable. Try again shortly.",
						"dxb-small",
					),
				);
		}
	}
	const formatRegistration = (reg) =>
		reg.replace(/^([A-Z]{2}\d{2})([A-Z]{3})$/, "$1 $2");
	const vehicleCache = new Map();
	function deckType(value) {
		const v = String(value || "").toLowerCase();
		if (/single/.test(v) && /double/.test(v)) return null;
		if (/double[ -]?decker/.test(v)) return "double";
		if (/single[ -]?decker/.test(v)) return "single";
		return null;
	}
	function unusualAllocation(vehicle, profile) {
		if (!vehicle?.found || vehicle.withdrawn || !profile || profile.error)
			return null;
		const actual = deckType(vehicle.type),
			usual = deckType(profile.vehicle);
		return actual && usual && actual !== usual ? { actual, usual } : null;
	}
	async function trackingBreakdown(data, profile, host, token) {
		const fleet = { single: [], double: [], unknown: [] };
		const counts = { single: 0, double: 0, unknown: 0 },
			ids = [...new Set(data.vehicles || [])];
		let cursor = 0,
			finished = 0;
		const summary = text("div", "", "dxb-tracking-breakdown");
		host.append(summary);
		function render() {
			summary.replaceChildren();
			summary.classList.toggle("is-checking", finished < ids.length);
			summary.setAttribute("aria-busy", String(finished < ids.length));
			for (const type of ["single", "double", "unknown"]) {
				if (type === "unknown" && counts.unknown === 0) continue;
				const unusual =
					type !== "unknown" &&
					counts[type] > 0 &&
					deckType(profile.vehicle) &&
					deckType(profile.vehicle) !== type;
				const pill = text(
					"button",
					type === "unknown"
						? `${counts.unknown} TYPE UNCONFIRMED`
						: `${unusual ? "⚠ " : ""}${counts[type]} ${type.toUpperCase()} ${
								counts[type] === 1 ? "DECKER" : "DECKERS"
						  }`,
					"dxb-deck-total" + (unusual ? " is-unusual" : ""),
				);
				if (unusual)
					pill.title = `Unusual allocation · this route usually uses ${deckType(
						profile.vehicle,
					)} deckers`;
				pill.type = "button";
				pill.disabled = finished < ids.length;
				pill.addEventListener("click", () =>
					openFleet(type, fleet[type], current?.name),
				);
				summary.append(pill);
			}
			if (finished < ids.length)
				summary.append(
					text(
						"small",
						`Checking vehicle types · ${finished} of ${ids.length}`,
						"dxb-deck-progress",
					),
				);
			else if (ids.length !== data.count)
				summary.append(
					text("small", "Vehicle breakdown unavailable", "dxb-deck-progress"),
				);
			else if (ids.length)
				summary.append(
					text("small", "Vehicle types · bustimes.org", "dxb-deck-progress"),
				);
		}
		render();
		await Promise.all(
			Array.from({ length: Math.min(4, ids.length) }, async () => {
				while (cursor < ids.length && token === sequence && host.isConnected) {
					const reg = ids[cursor++];
					let type = null;
					try {
						if (!vehicleCache.has(reg))
							vehicleCache.set(
								reg,
								request("vehicle/" + encodeURIComponent(reg)).catch((e) => {
									vehicleCache.delete(reg);
									throw e;
								}),
							);
						const vehicle = await vehicleCache.get(reg);
						if (vehicle.found && !vehicle.withdrawn)
							type = deckType(vehicle.type);
						fleet[type || "unknown"].push({ ...vehicle, registration: reg });
					} catch {
						fleet.unknown.push({ registration: reg });
					}
					counts[type || "unknown"]++;
					finished++;
					if (token === sequence && host.isConnected) render();
				}
			}),
		);
	}
	function sentenceCase(value) {
		return String(value).replace(/^\w/, (c) => c.toUpperCase());
	}
	function openFleet(type, vehicles, route) {
		const dialog = text("dialog", "", "dxb-fleet-modal");
		dialog.setAttribute(
			"aria-label",
			`${type} deckers tracking on route ${route}`,
		);
		const heading = text(
			"h2",
			type === "vehicle"
				? `Bus details on route ${route}`
				: type === "unknown"
				? `Type unconfirmed on Route ${route}`
				: `${
						type === "single" ? "Single" : "Double"
				  } deckers on Route ${route}`,
		);
		const close = text("button", "Close ×", "dxb-mark-button");
		close.type = "button";
		close.addEventListener("click", () => dialog.close());
		const modalHeader = text("header", "", "dxb-fleet-header");
		modalHeader.append(heading, close);
		dialog.append(modalHeader);
        const fleetGrid = text("div", "", "dxb-fleet-grid"); dialog.append(fleetGrid);
		if (!vehicles.length)
			dialog.append(
				text("p", "No confirmed vehicles of this type are currently tracking."),
			);
		vehicles.forEach((vehicle) => {
			const card = text("article", "", "dxb-fleet-item");
			const identity = text("header", "", "dxb-fleet-identity");
			identity.append(text("h3", vehicle.model || "Model unconfirmed"));
			const identifiers = text("div", "", "dxb-fleet-identifiers");
			identifiers.append(
				vehicleField("Registration", formatRegistration(vehicle.registration)),
				vehicleField("Fleet number", vehicle.fleet || "Unconfirmed"),
			);
			identity.append(identifiers);
			card.append(identity);
			if (type === "vehicle") {
				const detail = text("div", "", "dxb-line-detail");
				detail.append(
					vehicleField(
						"Vehicle type",
						sentenceCase(vehicle.type || "Unconfirmed"),
					),
					vehicleField("Fuel", sentenceCase(vehicle.fuel || "Unconfirmed")),
					vehicleField(
						"USB charging",
						vehicle.usb === true ? "Available" : "Not confirmed",
					),
					vehicleField("Garage", vehicle.garage || "Not confirmed"),
				);
				card.append(detail);
			}
			const position = text(
				"div",
				"Checking destination and position…",
				"dxb-fleet-position",
			);
			card.append(position);
			const mark = text("button", "", "dxb-mark-button");
			mark.type = "button";
			const update = () => {
				setPinLabel(
					mark,
					(marked.includes(vehicle.registration) ? "Pinned " : "Pin ") +
						formatRegistration(vehicle.registration),
				);
				mark.setAttribute(
					"aria-pressed",
					String(marked.includes(vehicle.registration)),
				);
			};
			update();
			mark.addEventListener("click", () => {
				const reg = vehicle.registration;
				if (marked.includes(reg))
					marked = marked.filter((item) => item !== reg);
				else if (marked.length < 12) marked.push(reg);
				else {
					mark.textContent = "12 buses pinned · remove one first";
					return;
				}
				saveList("dxb-marked-vehicles", marked);
				renderMarked();
				update();
				if ($("#dxb-arrivals") && !$("#panel-arrivals").hidden)
					renderArrivals();
			});
			const actions = text("div", "", "dxbus-vehicle-actions");
			actions.append(mark);
			if (vehicle.source) actions.append(sourceLink("Open full vehicle details ↗", vehicle.source));
			card.append(actions);
			fleetGrid.append(card);
			request(
				"vehicle/" + encodeURIComponent(vehicle.registration) + "/arrivals",
			)
				.then((data) => {
					if (!dialog.isConnected) return;
					const next = data.arrivals?.find(
						(item) => item.route.toUpperCase() === String(route).toUpperCase(),
					);
					position.replaceChildren();
					if (next) {
						position.append(
							vehicleField(
								"Final destination",
								next.destination || vehicle.destination || "Unconfirmed",
							),
							vehicleField(
								next.location ? "Current location" : "Next predicted stop",
								next.location || next.stop,
							),
						);
					} else {
						position.textContent =
							"⚠ Destination and current position unavailable.";
						position.classList.add("is-warning");
					}
				})
				.catch(() => {
					position.textContent = "⚠ Vehicle position temporarily unavailable.";
					position.classList.add("is-warning");
				});
		});
		dialog.addEventListener("click", (event) => {
			if (event.target === dialog) {
				const r = dialog.getBoundingClientRect();
				if (
					event.clientX < r.left ||
					event.clientX > r.right ||
					event.clientY < r.top ||
					event.clientY > r.bottom
				)
					dialog.close();
			}
		});
		dialog.addEventListener("close", () => dialog.remove(), { once: true });
		root.append(dialog);
		dialog.showModal();
	}

	// Animate native details while preserving keyboard activation and open state.
	root.addEventListener("click", (event) => {
		const summary = event.target.closest(".dxb-details > summary");
		if (!summary) return;
		const detail = summary.parentElement;
		event.preventDefault();
		if (detail.dataset.animating) return;
		const opening = !detail.open;
		if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
			detail.open = opening;
			return;
		}
		const start = detail.getBoundingClientRect().height;
		if (opening) detail.open = true;
		const end = opening
			? detail.getBoundingClientRect().height
			: summary.getBoundingClientRect().height +
			  parseFloat(getComputedStyle(detail).paddingTop) +
			  parseFloat(getComputedStyle(detail).paddingBottom) +
			  2;
		detail.dataset.animating = "true";
		detail.style.overflow = "hidden";
		const animation = detail.animate(
			[{ height: start + "px" }, { height: end + "px" }],
			{ duration: 300, easing: "ease-in-out" },
		);
		animation.onfinish = () => {
			detail.open = opening;
			detail.style.overflow = "";
			delete detail.dataset.animating;
		};
	});
	function vehicleField(label, value, kind = "") {
		const field = text("div", "", "dxb-vehicle-field " + kind);
		field.append(
			text("span", label, "dxb-field-label"),
			text("strong", value, "dxb-field-value"),
		);
		return field;
	}
	function plateAge(reg, now = new Date()) {
		const m = /^[A-Z]{2}(\d{2})[A-Z]{3}$/.exec(reg);
		if (!m) return null;
		const n = Number(m[1]);
		if (n === 0 || n === 50) return null;
		const year = 2000 + (n >= 51 ? n - 50 : n),
			start = new Date(year, n >= 51 ? 8 : 2, 1);
		if (start > now) return null;
		const months =
			(now.getFullYear() - year) * 12 + now.getMonth() - start.getMonth();
		return {
			label:
				months < 6
					? "NEW · PLATE ESTIMATE"
					: "≈ " + Math.floor(months / 12) + " YEARS · PLATE ESTIMATE",
			kind: months < 6 ? "is-new" : months >= 120 ? "is-vintage" : "is-age",
		};
	}
	async function fillVehicle(reg, box, card, route, token) {
		box.replaceChildren(
			vehicleField("Registration", formatRegistration(reg), "is-registration"),
			text("p", "Loading fleet details…", "dxb-small"),
		);
		try {
			if (!vehicleCache.has(reg))
				vehicleCache.set(
					reg,
					request("vehicle/" + encodeURIComponent(reg)).catch((e) => {
						vehicleCache.delete(reg);
						throw e;
					}),
				);
			const v = await vehicleCache.get(reg);
			if (!box.isConnected || token !== sequence) return;
			box.replaceChildren(
				vehicleField(
					"Registration",
					formatRegistration(reg),
					"is-registration",
				),
				vehicleField("Fleet number", v.fleet || "Not available"),
			);
			const types = text("div", "", "dxb-vehicle-field");
			types.append(text("span", "Vehicle type", "dxb-field-label"));
			const pills = text("div", "", "dxb-vehicle-pills");
			[v.type, v.fuel].filter(Boolean).forEach((value) => {
				const fuel = value === v.fuel,
					label = String(value).toUpperCase();
				const emoji = fuel
					? /hydrogen/i.test(value)
						? "💧"
						: /hybrid/i.test(value)
						? "🌿"
						: /electric/i.test(value)
						? "⚡️"
						: /diesel/i.test(value)
						? "⛽"
						: ""
					: "🚌";
				const kind = fuel
					? /hydrogen/i.test(value)
						? "hydrogen"
						: /hybrid/i.test(value)
						? "hybrid"
						: /electric/i.test(value)
						? "electric"
						: /diesel/i.test(value)
						? "diesel"
						: ""
					: deckType(value);
				const pill = text(
					"span",
					"",
					"dxb-vehicle-pill" + (kind ? " is-" + kind : ""),
				);
				if (emoji) {
					const icon = text("span", emoji, "dxb-propulsion-icon");
					icon.setAttribute("aria-hidden", "true");
					pill.append(icon);
				}
				pill.append(text("span", label));
				pills.append(pill);
			});
			if (!pills.childNodes.length) pills.append(text("span", "Not available"));
			types.append(pills);
			box.append(types);
			const age = plateAge(reg);
			if (age) {
				const pill = text("span", age.label, "dxb-vehicle-pill " + age.kind);
				pill.title =
					"Estimated from the original UK registration period; transferred plates may differ.";
				pills.append(pill);
			}
			box.append(
				vehicleField(
					"USB charging",
					v.usb === true
						? "Available"
						: v.usb === false
						? "Not fitted"
						: "Not confirmed",
				),
			);

			box.append(vehicleField("Garage", v.garage || "Not confirmed"));
			const footer = card.querySelector(".dxb-arrival-footer");
			footer.prepend(
				vehicleField("Make / model", v.model || "Not available", "is-model"),
			);
			if (v.source) {
				const link = sourceLink("View vehicle details ↗", v.source);
				link.classList.add("dxb-vehicle-source");
				link.title = "Fleet information from bustimes.org";
				footer.insertBefore(link, footer.lastChild);
			}
			const surprise = unusualAllocation(v, current?.profile);
			if (surprise) {
				card.classList.add("is-surprise");
				const note = text("div", "", "dxb-route-surprise");
				note.append(
					text("span", "✦ Route surprise", "dxb-surprise-badge"),
					text(
						"p",
						`A ${surprise.actual}-decker on the ${route}? Usually a ${surprise.usual}-decker route. 👀`,
					),
				);
				card.prepend(note);
			}
			if (v.withdrawn)
				card.append(
					text(
						"p",
						"Fleet source lists this vehicle as withdrawn; live identification may need checking.",
						"dxb-small dxb-fleet-warning",
					),
				);
		} catch {
			if (box.isConnected)
				box.replaceChildren(
					vehicleField(
						"Registration",
						formatRegistration(reg),
						"is-registration",
					),
					text(
						"p",
						"Fleet number, type and model are temporarily unavailable.",
						"dxb-small",
					),
				);
		}
	}
	function renderArrivals() {
		const list = $("#dxb-arrivals");
		list.replaceChildren();
		const advanced = $("#dxb-advanced").checked;
		arrivalRows.forEach((a) => {
			const card = text("div", "", "dxb-arrival-card"),
				row = text("div", "", "dxb-arrival-row");
			const minutes = Math.max(
				0,
				Math.ceil((Date.parse(a.expected) - Date.now()) / 60000),
			);
			row.append(
				text("span", "⌖ " + a.destination, "dxb-arrival-destination"),
				text(
					"strong",
					minutes < 1 ? "Due" : minutes + " min",
					"dxb-arrival-time",
				),
			);
			card.append(row);
			if (a.shortWorking) {
				const warning = text(
					"span",
					"⚠ TERMINATES EARLY",
					"dxb-short-working",
				);
				warning.title =
					"This bus terminates before the full route destination for this direction.";
				row.firstChild.append(warning);
			}
			const stopSelect = $("#dxb-stop");
			const options = Array.from(stopSelect?.options || []).filter(
				(option) => option.value,
			);
			const selectedIndex = options.findIndex(
				(option) => option.value === stopSelect?.value,
			);
			const fallbackStops =
				selectedIndex >= 0 ? options.length - selectedIndex - 1 : null;
			const destinationStops = a.destinationStops ?? fallbackStops;
			if (destinationStops != null) {
				const fallback = a.destinationStops == null;
				const distance = text(
					"small",
					destinationStops +
						(destinationStops === 1 ? " STOP" : " STOPS") +
						(fallback ? " TO ROUTE END" : ""),
					"dxb-stop-distance",
				);
				if (fallback)
					distance.title =
						"Counted from the selected stop to the final stop in this direction. A bus terminating early may serve fewer stops.";
				row.firstChild.append(distance);
			} else if (advanced) {
				row.firstChild.append(
					text("small", "STOP COUNT UNAVAILABLE", "dxb-stop-distance"),
				);
			}
			const meta = text("div", "", "dxb-arrival-meta"),
				position = text("div", "", "dxb-arrival-position");
			if (a.location || a.nextStop)
				position.append(
					text(
						"p",
						a.location
							? "Current location · " + a.location
							: "Next predicted stop · " + a.nextStop,
						"dxb-bus-position",
					),
				);
			if (minutes < 1 || a.stopsAway != null) {
				const arriving = minutes < 1 || a.stopsAway === 0;
				const distance = text(
					"span",
					arriving ? "ARRIVING" : "≈ " + a.stopsAway + " STOPS AWAY",
					"dxb-stop-distance",
				);
				distance.style.opacity = String(
					arriving ? 1 : Math.max(0.45, 1 - a.stopsAway * 0.035),
				);
				position.append(distance);
			}
			if (position.childNodes.length) meta.append(position);
			if (advanced && a.trip) {
				const trip = text("p", "", "dxb-trip");
				trip.append(
					text("span", "TRIP", "dxb-trip-label"),
					text("span", String(a.trip), "dxb-trip-number"),
				);
				meta.append(trip);
			}
			if (meta.childNodes.length) card.append(meta);
			const reg = (a.vehicle || "").replace(/\s/g, "").toUpperCase();
			if (advanced) {
				card.classList.add("has-details");
				const details = text("div", "", "dxb-vehicle-details"),
					footer = text("div", "", "dxb-arrival-footer");
				card.append(details, footer);
				if (/^[A-Z0-9]{3,12}$/.test(reg)) {
					const button = text("button", "", "dxb-mark-button");
					setPinLabel(
						button,
						(marked.includes(reg) ? "Pinned " : "Pin ") +
							formatRegistration(reg),
					);
					button.type = "button";
					button.setAttribute("aria-pressed", String(marked.includes(reg)));
					button.addEventListener("click", () => {
						if (marked.includes(reg)) marked = marked.filter((v) => v !== reg);
						else if (marked.length < 12) marked.push(reg);
						else {
							button.textContent = "12 buses pinned · remove one first";
							return;
						}
						saveList("dxb-marked-vehicles", marked);
						renderMarked();
						renderArrivals();
					});
					footer.append(button);
					fillVehicle(
						reg,
						details,
						card,
						current?.name || input.value,
						sequence,
					);
				} else {
					details.append(
						text("p", "Vehicle registration not supplied by TfL.", "dxb-small"),
					);
					footer.remove();
				}
			}
			list.append(card);
		});
		if (!arrivalRows.length)
			list.append(
				text(
					"p",
					$("#dxb-stop").value
						? "No upcoming predictions for this route at this stop."
						: "Choose a stop for live arrival predictions.",
					"dxb-small",
				),
			);
	}
	function celebrateEnthusiastMode() {
		document.querySelector(".dxb-confetti")?.remove();
		if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const rect = $("#dxb-advanced").getBoundingClientRect(),
			burst = text("div", "", "dxb-confetti");
		burst.setAttribute("aria-hidden", "true");
		const colors = [
			"#d5ad63",
			"#ffdc91",
			"#ff6a00",
			"#ee0979",
			"#2657eb",
			"#de6161",
		];
		for (let i = 0; i < 38; i++) {
			const particle = document.createElement("i"),
				angle = Math.PI + (i / 37) * Math.PI,
				distance = 70 + Math.random() * 150;
			if (i % 3 === 0) {
				particle.textContent = ["🥦", "🥕", "🥬", "🍆", "🥸"][i % 5];
				particle.classList.add("is-emoji");
			}
			particle.style.left = rect.left + rect.width / 2 + "px";
			particle.style.top = rect.top + rect.height / 2 + "px";
			particle.style.setProperty("--confetti-color", colors[i % colors.length]);
			particle.style.setProperty(
				"--confetti-x",
				Math.cos(angle) * distance + "px",
			);
			particle.style.setProperty(
				"--confetti-y",
				Math.sin(angle) * distance + 65 + "px",
			);
			particle.style.setProperty(
				"--confetti-turn",
				Math.random() * 720 - 360 + "deg",
			);
			particle.style.animationDelay = Math.random() * 0.12 + "s";
			burst.append(particle);
		}
		document.body.append(burst);
		setTimeout(() => burst.remove(), 1400);
	}
	try { $('#dxb-advanced').checked = localStorage.getItem('dxb-enthusiast-mode') === '1'; } catch {}
	root.classList.toggle('is-enthusiast', $('#dxb-advanced').checked);
	$("#dxb-advanced").setAttribute("role", "switch");
	$("#dxb-advanced").addEventListener("change", () => {
		root.classList.toggle("is-enthusiast", $("#dxb-advanced").checked);
		try { localStorage.setItem("dxb-enthusiast-mode", $("#dxb-advanced").checked ? "1" : "0"); } catch {}
		if (!$(".dxb-arrival-retry") && !$(".dxb-schedule-state")) renderArrivals();
		if ($("#dxb-advanced").checked) celebrateEnthusiastMode();
		else document.querySelector(".dxb-confetti")?.remove();
	});
	renderMarked();
	const aside = $(".dxb-explorer-aside"),
		main = $(".dxb-explorer-main");
	if (window.ResizeObserver && aside && main && !app) {
		new ResizeObserver(() => {
			aside.style.height = matchMedia("(max-width:700px)").matches
				? "310px"
				: Math.ceil(main.getBoundingClientRect().height) + "px";
		}).observe(main);
	}
	function request(path, signal) {
		if (!signal && inFlightRequests.has(path)) return inFlightRequests.get(path);
		const pending = performRequest(path, signal);
		if (!signal) { inFlightRequests.set(path, pending); pending.finally(() => { if (inFlightRequests.get(path) === pending) inFlightRequests.delete(path); }).catch(() => {}); }
		return pending;
	}
	async function performRequest(path, signal) {
		const response = await fetch(DXB.api + path, {
			signal,
			credentials: "same-origin",
		});
		const data = await response.json();
		if (!response.ok) {
			const error = new Error(
				data.message ||
					"Information is temporarily unavailable. Please try again.",
			);
			error.code = data.code;
			throw error;
		}
		return data;
	}
	function announce(message, error = false) {
		status.textContent = message;
		status.classList.toggle("is-error", error);
	}
	function stopArrivals() {
		lineRequest++;
		clearTimeout(timer);
		clearInterval(retryTicker);
		arrivalsController?.abort();
	}
	function setRouteTabAvailability(profile = current?.profile) {
		const former =
			profile?.badgeType === "former" || current?.serviceType === "former";
		document.body.classList.toggle("dx-route-withdrawn", former);
		root.dataset.routeStatus = former ? "former" : "current";
        if (app) {
            $$('#panel-overview .dxbus-card').forEach(card => { card.hidden = former && !card.classList.contains('dxbus-card--photos'); });
            const badge = $('#dxb-route-number');
            if (badge && !badge.parentElement.classList.contains('dxbus-route-memorial')) {
                const memorial = text('span', '', 'dxbus-route-memorial'); badge.before(memorial); memorial.append(badge);
                const candles = text('span', '', 'dxbus-memorial-candles'); candles.setAttribute('aria-hidden', 'true'); memorial.append(candles);
            }
        }
		const overviewIntro = $("#panel-overview > p");
		if (overviewIntro)
			overviewIntro.textContent = former
				? "Discover photographs, stories and operating history from this former route’s archive."
				: "Explore stops and arrival predictions, or discover photographs and journeys from the archive.";
		["arrivals", "line"].forEach((name) => {
			const button = $(`[data-tab="${name}"]`);
			button.disabled = former;
			button.setAttribute("aria-disabled", String(former));
			if (former) {
				button.tabIndex = -1;
				button.title =
					"Unavailable for a withdrawn route. Explore its overview and archive instead.";
			} else {
				button.removeAttribute("title");
			}
		});
		if (former && ["arrivals", "line"].includes(tab)) activateTab("overview");
	}
	function activateTab(name, historyMode = "push") {
		if (app) name = canonicalTab(name);
		if ($(`[data-tab="${name}"]`)?.disabled) name = "overview";
		tab = name;
		root.dataset.routeTab = name;
		$$("[data-tab]").forEach((button) => {
			const active = button.dataset.tab === name;
			button.setAttribute("aria-selected", String(active));
			button.tabIndex = app ? 0 : active ? 0 : -1;
			if (app) { if (active) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current'); }
		});
		$$("[role=tabpanel]").forEach(
			(panel) => (panel.hidden = panel.id !== `panel-${name}`),
		);
		stopArrivals();
		if (app) {
			root.dataset.view = viewNames[name] || 'overview';
			if (historyMode !== 'none' && current) history[historyMode === 'replace' ? 'replaceState' : 'pushState']({ dxbus: true, view: root.dataset.view }, '', appURL(name));
			if (name === 'overview') { renderRouteMap($('#dxbus-overview-map')); appMaps.forEach(({ map }) => requestAnimationFrame(() => map.invalidateSize())); }
		}
		if (name === "line" && current) loadLine();
		if (name === "news" && current) loadNews();
		if (name === "discussion" && current) loadDiscussion();
		if (name === "arrivals" && $("#dxb-stop").value && current)
			refreshArrivals();
	}
	$$("[data-tab]").forEach((button) => {
		button.addEventListener("click", (event) => { if (app) event.preventDefault(); activateTab(button.dataset.tab); });
		button.addEventListener("keydown", (event) => {
			const buttons = $$("[data-tab]").filter(
				(item) => !item.hidden && !item.disabled,
			);
			const i = buttons.indexOf(button);
			let next;
			if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % buttons.length;
			if (event.key === "ArrowLeft" || event.key === "ArrowUp")
				next = (i + buttons.length - 1) % buttons.length;
			if (event.key === "Home") next = 0;
			if (event.key === "End") next = buttons.length - 1;
			if (next !== undefined) {
				event.preventDefault();
				buttons[next].focus();
				activateTab(buttons[next].dataset.tab);
			}
		});
	});
	let lineRequest = 0;
	async function loadLine() {
		const token = ++lineRequest,
			route = current?.id;
		const host = $("#dxb-line-stops"),
			select = $("#dxb-line-direction");
		if (!route) return;
		const chosen = app ? current.direction :
			select.dataset.route === route ? select.value : current.direction;
		select.dataset.route = route;
		host.replaceChildren(text("p", "Loading route line…", "dxb-small"));
		try {
			const [labels, data, positions] = await Promise.all([
				request("directions/" + encodeURIComponent(route)),
				request(
					`route/${encodeURIComponent(route)}?direction=${chosen || "inbound"}`,
				),
				(app ? Promise.resolve(latestRoutePositions) : request("line-positions/" + encodeURIComponent(route))).catch(
					() => null,
				),
			]);
			if (token !== lineRequest || current?.id !== route) return;
			select.replaceChildren(
				...Object.entries(labels).map(
					([value, label]) => new Option(label, value),
				),
			);
			select.value = data.direction;
			host.replaceChildren();
			const note = text(
				"p",
				positions
					? "Approximate positions from the next predicted stop, not live GPS. Refreshes every 30 seconds."
					: "⚠ Vehicle positions temporarily unavailable. Route stops are shown below.",
				"dxb-small",
			);
			host.append(note);
			const directions = Object.keys(labels);
			const otherData = await Promise.all(
				directions.map((direction) =>
					direction === data.direction
						? Promise.resolve(data)
						: request(
								`route/${encodeURIComponent(route)}?direction=${direction}`,
						  ).catch(() => ({ direction, stops: [] })),
				),
			);
			if (token !== lineRequest || current?.id !== route) return;
			if (app) { appDirections = labels; appRouteSequences = otherData; renderRouteMap($('#dxbus-explorer-map'), otherData.find((row) => row.direction === select.value) || data, positions); applyAppMapMode('explorer', appExplorerMode); }
			const columns = text("div", "", "dxb-line-columns");
			host.append(columns);
			otherData.forEach((data) => {
				const column = text("section", "", "dxb-line-column");
				column.dataset.direction = data.direction;
				column.classList.toggle("is-selected", data.direction === select.value);
				column.append(
					text(
						"h3",
						`${route.toUpperCase()} ${
							labels[data.direction] || data.direction
						}`,
					),
				);
				columns.append(column);
				const list = text("ol", "", "dxb-line-timeline");
				const stops = data.stops || [],
					ids = new Set(stops.map((stop) => stop.id));
				const buses = (positions?.vehicles || []).filter(
					(bus) =>
						ids.has(bus.stopId) &&
						(!bus.direction || bus.direction === data.direction),
				);
				stops.forEach((stop) => {
					const item = text("li", "", "dxb-line-stop");
					if (app) { const stopButton = text('button', stop.name, 'dxb-line-stop-name dxbus-stop-select'); stopButton.type = 'button'; stopButton.addEventListener('click', () => selectAppStop(stop.id, data.direction)); item.append(stopButton); }
					else item.append(text("span", stop.name, "dxb-line-stop-name"));
					buses
						.filter((bus) => bus.stopId === stop.id)
						.forEach((bus) => {
							item.classList.add("has-bus");
							const button = text(
								"button",
								"🚌 " + formatRegistration(bus.registration),
								"dxb-line-bus",
							);
							button.type = "button";
							button.setAttribute(
								"aria-label",
								`${formatRegistration(bus.registration)}, approximately at ${
									stop.name
								}, towards ${bus.destination}. View bus details`,
							);
							getVehicle(bus.registration)
								.then((vehicle) => {
									if (!button.isConnected || token !== lineRequest) return;
									if (vehicle.fleet) {
										button.textContent =
											"🚌 " +
											formatRegistration(bus.registration) +
											" · " +
											vehicle.fleet;
										button.setAttribute(
											"aria-label",
											`${formatRegistration(bus.registration)}, fleet ${
												vehicle.fleet
											}, approximately at ${stop.name}, towards ${
												bus.destination
											}. View bus details`,
										);
									}
								})
								.catch(() => {});
							button.addEventListener("click", async () => {
								button.disabled = true;
								try {
									const vehicle = await getVehicle(bus.registration).catch(() => ({}));
									if (current?.id === route && button.isConnected)
										openFleet(
											"vehicle",
											[{ ...vehicle, ...bus }],
											current.name,
										);
								} finally {
									button.disabled = false;
								}
							});
							item.append(button);
						});
					list.append(item);
				});
				column.append(list);
				if (!buses.length && positions)
					column.prepend(
						text(
							"p",
							"No buses with a matching predicted stop in this direction.",
							"dxb-small",
						),
					);
				if (!stops.length)
					column.append(
						text("p", "Stop information is unavailable for this direction."),
					);
			});
		} catch {
			if (token === lineRequest)
				host.replaceChildren(
					text(
						"p",
						"⚠ Route line temporarily unavailable. Retrying shortly.",
						"dxb-small",
					),
				);
		}
		if (!app && token === lineRequest && tab === "line" && current?.id === route)
			timer = setTimeout(loadLine, 30000);
	}
	$("#dxb-line-direction").addEventListener("change", (event) => {
		if (app) { changeAppDirection(event.target.value); return; }
		document
			.querySelectorAll(".dxb-line-column")
			.forEach((column) =>
				column.classList.toggle(
					"is-selected",
					column.dataset.direction === $("#dxb-line-direction").value,
				),
			);
	});
	async function loadDiscussion() {
		const token = sequence,
			box = $("#dxb-comments");
		box.replaceChildren(text("p", "Loading discussion…", "dxb-small"));
		$("#dxb-comment-form").reset();
		$("#dxb-comment-status").textContent = "";
		try {
			const data = await request(
				"discussion/" + encodeURIComponent(current.name),
			);
			if (token !== sequence) return;
			box.replaceChildren();
			if (!data.items.length)
				box.append(
					text("p", "Start the conversation for this route.", "dxb-small"),
				);
			data.items.forEach((c) => {
				const item = text("article", "", "dxb-comment");
				item.append(
					text("strong", c.name),
					text("small", c.date),
					text("p", c.body),
				);
				box.append(item);
			});
		} catch {
			if (token === sequence)
				box.replaceChildren(
					text("p", "Discussion is temporarily unavailable.", "dxb-small"),
				);
		}
	}
	$("#dxb-comment-form").addEventListener("submit", async (e) => {
		e.preventDefault();
		if (!current) return;
		const form = e.currentTarget,
			button = form.querySelector("button"),
			token = sequence;
		button.disabled = true;
		try {
			const response = await fetch(
				DXB.api + "discussion/" + encodeURIComponent(current.name),
				{
					method: "POST",
					credentials: "same-origin",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(Object.fromEntries(new FormData(form))),
				},
			);
			const data = await response.json();
			if (!response.ok) throw new Error(data.message);
			if (token === sequence) {
				form.reset();
				$("#dxb-comment-status").textContent = data.message;
			}
		} catch (error) {
			if (token === sequence)
				$("#dxb-comment-status").textContent =
					error.message || "Your comment could not be sent.";
		} finally {
			if (token === sequence) button.disabled = false;
		}
	});
	let newsController,
		profileController,
		consultationController,
		consultationData;
	function sourceLink(label, url) {
		const a = text("a", label);
		a.href = url;
		a.target = "_blank";
		a.rel = "noopener noreferrer";
		return a;
	}
	function dateLabel(raw) {
		if (!raw) return "Date to be confirmed";
		const formatted = raw.replace(
			/\b(\d{1,2})[ .-]+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[ .-]+(\d{4}|\d{2})\b/gi,
			(_, d, m, y) => {
				const month = [
					"jan",
					"feb",
					"mar",
					"apr",
					"may",
					"jun",
					"jul",
					"aug",
					"sep",
					"oct",
					"nov",
					"dec",
				].indexOf(m.slice(0, 3).toLowerCase());
				const year = y.length === 2 ? 2000 + Number(y) : Number(y),
					dt = new Date(Date.UTC(year, month, Number(d), 12));
				return new Intl.DateTimeFormat("en-GB", {
					weekday: "long",
					day: "numeric",
					month: "long",
					year: "numeric",
					timeZone: "Europe/London",
				}).format(dt);
			},
		);
		return formatted === raw && /\d/.test(raw) && !/\b\d{4}\b/.test(raw)
			? raw + " · year not supplied"
			: formatted;
	}
	function consultationCards() {
		const box = text("section", "", "dxb-consultations dxb-route-news-pane"),
			body = text("div", "", "dxb-route-news-body");
		box.setAttribute("aria-label", "News and consultations");
		box.append(text("h3", "News & consultations"), body);
		if (!consultationData) {
			body.append(text("p", "Checking the TfL consultation hub…", "dxb-small"));
		} else if (consultationData.error) {
			body.append(
				text(
					"p",
					"The consultation hub is temporarily unavailable.",
					"dxb-small",
				),
			);
		} else if (!consultationData.items.length) {
			body.append(
				text(
					"p",
					"No matching route mentions were found in the current hub listings.",
					"dxb-small",
				),
			);
		} else {
			consultationData.items.forEach((item) => {
				const card = text("article", "", "dxb-news-item");
				card.append(
					text("span", item.status, "dxb-news-badge"),
					text("p", item.title),
					...(item.published && Number.isFinite(Date.parse(item.published))
						? [
								text(
									"small",
									"Published " +
										new Intl.DateTimeFormat("en-GB", {
											weekday: "long",
											day: "numeric",
											month: "long",
											year: "numeric",
											hour: "2-digit",
											minute: "2-digit",
											timeZone: "Europe/London",
											timeZoneName: "short",
										}).format(new Date(item.published)),
								),
						  ]
						: []),
					sourceLink("Read the proposal and check its status ↗", item.url),
				);
				body.append(card);
			});
		}
		if (consultationData?.stale) {
			body.append(
				text("p", "Showing a saved consultation update.", "dxb-small"),
			);
		}
		const sources = text("footer", "", "dxb-pane-sources"),
			line = text("p", "", "dxb-source");
		line.append(
			sourceLink(
				"TfL Have Your Say ↗",
				consultationData?.source ||
					"https://haveyoursay.tfl.gov.uk/hub-page/londons-buses-taxis-and-phvs",
			),
		);
		sources.append(line);
		box.append(sources);
		return box;
	}
	async function loadConsultations(route, token) {
		consultationController?.abort();
		consultationController = new AbortController();
		consultationData = null;
		const notice = $("#dxb-consultation-notice");
		notice.replaceChildren();
		try {
			const data = await request(
				"consultations/" + encodeURIComponent(route),
				consultationController.signal,
			);
			if (token !== sequence) return;
			consultationData = data;
			if (data.items.length) {
				const button = text(
					"button",
					`${data.items.length} related TfL consultation${
						data.items.length === 1 ? "" : "s"
					} · View in News ↗`,
				);
				button.type = "button";
				button.addEventListener("click", () => activateTab("news"));
				notice.append(button);
			}
		} catch (e) {
			if (token !== sequence || e.name === "AbortError") return;
			consultationData = { error: true };
		}
		const old = $("#panel-news .dxb-consultations");
		if (old) old.replaceWith(consultationCards());
		if (app) renderAppOverviewUpdates();
	}
	function displayWorkings(workings) {
		const key = (w) => w.destinations.trim().replace(/\s+/g, " ").toLowerCase();
		const main = new Set(
			workings.filter((w) => w.label === "Main service").map(key),
		);
		const night = new Set(
			workings.filter((w) => w.label === "Night service").map(key),
		);
		const combined = new Set([...main].filter((k) => night.has(k)));
		const seen = new Set();
		return workings.flatMap((w) => {
			const item =
				combined.has(key(w)) &&
				["Main service", "Night service"].includes(w.label)
					? { ...w, label: "Complete service · 24 hours" }
					: w;
			const identity = key(item) + "|" + item.label;
			if (seen.has(identity)) return [];
			seen.add(identity);
			return [item];
		});
	}
	function applyProfile(profile, token) {
		if (token !== sequence || !current) return;
		current.profile = profile;
		if (app) applyAppProfile(profile);
		setRouteTabAvailability(profile);
		if (arrivalRows.length) renderArrivals();
		const box = $("#dxb-route-facts");
		box.replaceChildren();
		const unavailable = profile.error;
		box.append(
			text(
				"p",
				`Operator · ${profile.operators?.join(" / ") || "Not confirmed"}${
					profile.garages?.length ? " – " + profile.garages.join(" / ") : ""
				}`,
				"dxb-overview-only dxb-operator-fact",
			),
			text(
				"p",
				`Vehicles · ${
					(deckType(profile.vehicle)
						? profile.vehicle + " (usually)"
						: profile.vehicle) || "Not confirmed"
				}`,
				"dxb-vehicle-fact",
			),
		);
		if (profile.frequency) {
			const frequency = text("div", "", "dxb-fact-pills dxb-overview-only");
			profile.frequency
				.split(" · ")
				.forEach((value) =>
					frequency.append(text("span", value, "dxb-fact-pill")),
				);
			frequency.setAttribute("aria-label", "Typical frequency");
			box.append(frequency);
		}
		if (profile.garages?.length || profile.frequency) {
			const sources = text("small", "", "dxb-fact-sources dxb-overview-only");
			if (profile.garages?.length)
				sources.append(
					sourceLink(
						"Garage allocations ↗",
						"http://www.londonbusroutes.net/garages.htm",
					),
				);
			if (profile.frequency)
				sources.append(
					sourceLink(
						"Typical frequencies ↗",
						"http://www.londonbusroutes.net/details.htm",
					),
				);
			box.append(sources);
		}
		if (profile.crossBoundary) {
			const badge = sourceLink(
				"Cross-Boundary Route ↗",
				profile.crossBoundarySource,
			);
			badge.className = "dxb-pattern-badge is-boundary";
			box.append(badge);
		}
		if (profile.record) {
			const badge = sourceLink("🏆 " + profile.record, profile.recordSource);
			badge.className = "dxb-pattern-badge is-record";
			badge.title = "Community route records · February 2026 snapshot";
			box.append(badge);
		}
		if (!current.archive && !app) {
			const live = text("p", "", "dxb-live-count dxb-fact-pill");
			const trackingRow = text("div", "", "dxb-tracking-row");
			trackingRow.append(live);
			box.append(trackingRow);
			let liveFailures = 0,
				refreshTimer = 0,
				countdownTimer = 0,
				nextRefreshAt = 0,
				retryLabel = null;
			const isLiveCurrent = () => token === sequence && live.isConnected;
			const clearCountdown = () => {
				clearInterval(countdownTimer);
				countdownTimer = 0;
				retryLabel = null;
			};
			const cleanupLive = () => {
				clearTimeout(refreshTimer);
				clearCountdown();
				document.removeEventListener("visibilitychange", updateRetryCountdown);
			};
			const showLiveStatus = (state, message) => {
				live.removeAttribute("aria-label");
				live.dataset.liveState = state;
				live.setAttribute("aria-busy", state === "fetching" ? "true" : "false");
				const spinner = text("span", "", "dxb-live-spinner"),
					status = text("span", message, "dxb-live-state");
				spinner.setAttribute("aria-hidden", "true");
				status.setAttribute("role", "status");
				status.setAttribute("aria-live", "polite");
				live.replaceChildren(spinner, status);
			};
			function updateRetryCountdown() {
				if (!isLiveCurrent()) {
					cleanupLive();
					return;
				}
				if (!retryLabel) return;
				const seconds = Math.max(
					0,
					Math.ceil((nextRefreshAt - Date.now()) / 1000),
				);
				retryLabel.textContent = document.hidden
					? "Retry resumes when this tab is active."
					: seconds > 0
					? `Retrying automatically in ${seconds}s.`
					: "Retrying automatically now…";
			}
			const scheduleLive = (delay, retrying = false) => {
				clearTimeout(refreshTimer);
				clearCountdown();
				nextRefreshAt = Date.now() + delay;
				// The display and the real retry share one deadline, including backoff.
				refreshTimer = setTimeout(refreshLive, delay);
				if (!retrying) return;
				if (live.dataset.liveState !== "retry") {
					showLiveStatus("retry", "Live bus count temporarily unavailable.");
				}
				live.querySelector(".dxb-live-retry")?.remove();
				retryLabel = text("span", "", "dxb-live-retry");
				// Keep the readable countdown from being announced every second.
				retryLabel.setAttribute("aria-live", "off");
				live.append(retryLabel);
				updateRetryCountdown();
				countdownTimer = setInterval(updateRetryCountdown, 1000);
			};
			function refreshLive() {
				if (!isLiveCurrent()) {
					cleanupLive();
					return;
				}
				if (document.hidden) {
					scheduleLive(30000, liveFailures > 0);
					return;
				}
				clearCountdown();
				if (liveFailures > 0 || !live.hasAttribute("aria-label")) {
					showLiveStatus(
						"fetching",
						liveFailures > 0
							? "Retrying live bus count…"
							: "Checking live tracking…",
					);
				} else {
					live.setAttribute("aria-busy", "true");
				}
				request("running/" + encodeURIComponent(current.name))
					.then((data) => {
						if (!isLiveCurrent()) {
							cleanupLive();
							return;
						}
						delete live.dataset.liveState;
						live.setAttribute("aria-busy", "false");
						live.setAttribute(
							"aria-label",
							data.count === 0
								? "No buses are tracking"
								: data.count === 1
								? "1 bus is tracking"
								: data.count + " buses are tracking",
						);
						const total = text(
								"strong",
								String(data.count),
								"dxb-tracking-number",
							),
							label = text(
								"span",
								data.count === 0
									? "NO BUSES ARE TRACKING"
									: data.count === 1
									? "BUS TRACKING"
									: "BUSES TRACKING",
								"dxb-tracking-label",
							);
						live.replaceChildren(total, label);
						live.append(
							text(
								"small",
								new Date(data.checked).toLocaleTimeString("en-GB", {
									hour: "2-digit",
									minute: "2-digit",
								}) + " · TFL PREDICTIONS",
								"dxb-tracking-source",
							),
						);
						trackingRow.querySelector(".dxb-tracking-breakdown")?.remove();
						trackingBreakdown(data, profile, trackingRow, token);
						liveFailures = 0;
						scheduleLive(60000);
					})
					.catch(() => {
						if (!isLiveCurrent()) {
							cleanupLive();
							return;
						}
						trackingRow.querySelector(".dxb-tracking-breakdown")?.remove();
						scheduleLive(Math.min(120000, 30000 * ++liveFailures), true);
					});
			}
			showLiveStatus("fetching", "Checking live tracking…");
			document.addEventListener("visibilitychange", updateRetryCountdown);
			refreshLive();
		}
		if (profile.source)
			box.append(
				sourceLink(`Route directory · ${profile.updated}`, profile.source),
			);
		if (profile.listingSource && current.archive)
			box.append(sourceLink("Route status source ↗", profile.listingSource));
		if (unavailable)
			box.append(text("small", "Route directory temporarily unavailable."));
		if (profile.circular || profile.serviceNotes?.length) {
			const patterns = text("div", "", "dxb-service-patterns");
			if (profile.circular)
				patterns.append(
					text("span", "↻ Circular route", "dxb-pattern-badge is-circular"),
				);
			if (profile.serviceNotes?.length) {
				patterns.append(
					text("span", "Limited service", "dxb-pattern-badge is-limited"),
				);
				profile.serviceNotes.forEach((note) =>
					patterns.append(text("p", note, "dxb-pattern-note")),
				);
			}
			if (profile.name === "SL6" && profile.serviceNotes?.length)
				patterns.append(
					text(
						"p",
						"Northbound AM · Southbound PM · Weekdays only",
						"dxb-pattern-note",
					),
				);
			box.append(patterns);
		}
		if (profile.badgeType === "former" && profile.history) {
			const h = profile.history,
				history = text("div", "", "dxb-route-history");
			history.append(
				text(
					"strong",
					h.tenure ? "In service · " + h.tenure : "Operating history",
				),
			);
			if (h.start) history.append(text("p", "Introduced · " + h.start));
			if (h.end) history.append(text("p", "Withdrawn · " + h.end));
			if (!h.tenure)
				history.append(
					text(
						"p",
						"Full tenure not confirmed: the introduction date is not available in the linked source.",
						"dxb-muted",
					),
				);
			if (h.source) history.append(sourceLink("Route history ↗", h.source));
			box.append(history);
		}
		const type =
			profile.badgeType === "regular" && current.serviceType === "24hour"
				? "24hour"
				: profile.badgeType || current.serviceType || "regular";
		$("#dxb-route-number").dataset.serviceType = type;
		if (
			(profile.allDay || current.serviceType === "24hour") &&
			!$("#dxb-route-type").textContent.includes("24-hour")
		)
			$("#dxb-route-type").append(" · 24-hour service");
		const labels = {
			mobility: "Mobility route",
			former: "Former route",
			future: "Future route",
			temporary: "Temporary route",
			carnival: "Notting Hill Carnival special",
			shuttle: "Silvertown Tunnel cycle shuttle",
		};
		if (labels[type]) $("#dxb-route-type").textContent = labels[type];
		if (profile.listingNotes && current.archive)
			$("#dxb-route-description").textContent = profile.listingNotes;
		if (profile.workings?.length && !current.archive) {
			const endpoints = $("#dxb-endpoints");
			endpoints.replaceChildren();
			const seen = new Set();
			displayWorkings(profile.workings).forEach((w) => {
				const key = w.destinations + "|" + w.label;
				if (seen.has(key)) return;
				seen.add(key);
				const row = text(
					"div",
					w.circular
						? w.destinations.split(" ↔ ")[0] + " circular"
						: w.oneWay
						? w.destinations.replace(" ↔ ", " → ")
						: w.destinations,
					"dxb-endpoint",
				);
				row.append(
					text(
						"span",
						w.label,
						"dxb-working-badge" +
							(w.label === "School variant" ? " is-school" : ""),
					),
				);
				endpoints.append(row);
			});
			(profile.workingNotes || []).forEach((note) => {
				const row = text("p", note, "dxb-small dxb-muted");
				if (/school/i.test(note))
					row.append(
						text("span", "School variant", "dxb-working-badge is-school"),
					);
				else if (/short working/i.test(note))
					row.append(text("span", "Short working", "dxb-working-badge"));
				endpoints.append(row);
			});
			const pairs = [...new Set(current.branches || [])];
			if (pairs.length > 1) {
				const detail = document.createElement("details");
				detail.className = "dxb-details";
				detail.append(text("summary", "TfL destination pairs"));
				pairs.forEach((pair) => detail.append(text("p", pair, "dxb-small")));
				endpoints.append(detail);
			}
		}
	}
	async function loadProfile(route, token) {
		profileController?.abort();
		profileController = new AbortController();
		$("#dxb-route-facts").replaceChildren(
			text("p", "Checking operator and vehicle details…"),
		);
		try {
			applyProfile(
				current.profile ||
					(await request(
						"profile/" + encodeURIComponent(route),
						profileController.signal,
					)),
				token,
			);
		} catch (e) {
			if (e.name !== "AbortError") applyProfile({ error: true }, token);
		}
	}
	async function loadNews() {
		newsController?.abort();
		newsController = new AbortController();
		const token = sequence,
			panel = app ? $("#dxbus-updates-content") : $("#panel-news"),
			grid = text("div", "", "dxb-route-news-grid"),
			changes = text("section", "", "dxb-route-news-pane");
		changes.setAttribute("aria-label", "Service changes");
		changes.append(
			text("h3", "Service changes"),
			text("p", "Checking route service changes…"),
		);
		// This pane remains independently replaceable as the consultation request completes.
		grid.append(changes, consultationCards());
		panel.replaceChildren(grid);
		try {
			const data = await request(
				"news/" + encodeURIComponent(current.name),
				newsController.signal,
			);
			if (token !== sequence) return;
			changes.replaceChildren(text("h3", "Service changes"));
			changes.append(
				text(
					"p",
					`${data.stale ? "Saved update · " : ""}Source updated ${
						data.updated
					}. Planned changes are provisional.`,
					"dxb-small dxb-muted",
				),
			);
			if (!data.items.length) {
				changes.append(
					text(
						"p",
						"No entries for this route are listed in the current source. This is not a live disruption report.",
					),
				);
			}
			data.items.forEach((item) => {
				const card = text("article", "", "dxb-news-item"),
					meta = text("div", "", "dxb-news-meta");
				meta.append(
					text("span", item.category, "dxb-news-badge"),
					text("small", dateLabel(item.date)),
				);
				card.append(
					meta,
					text("p", item.summary),
					sourceLink("Read the full update ↗", item.url),
				);
				changes.append(card);
			});
			const sources = text("footer", "", "dxb-pane-sources"),
				line = text("p", "", "dxb-source");
			line.append(sourceLink("London Bus Routes ↗", data.source));
			sources.append(
				text(
					"p",
					"Dates are shown as supplied by the source; times are not published for date-only entries.",
					"dxb-small dxb-muted",
				),
				line,
			);
			changes.append(sources);
		} catch (error) {
			if (error.name !== "AbortError" && token === sequence) {
				changes.replaceChildren(
					text("h3", "Service changes"),
					text(
						"p",
						"Service changes are temporarily unavailable. Please try the News tab again shortly.",
					),
				);
				const sources = text("footer", "", "dxb-pane-sources"),
					line = text("p", "", "dxb-source");
				line.append(
					sourceLink(
						"London Bus Routes ↗",
						"http://www.londonbusroutes.net/changes.htm",
					),
				);
				sources.append(line);
				changes.append(sources);
			}
		}
	}

	const hero = $(".dxb-hero-media"),
		baseHero = hero?.querySelector("img");
	const photoShade = text("div", "", "dxb-route-photo-shade");
	photoShade.setAttribute("aria-hidden", "true");
	hero?.append(photoShade);
	const routeLayers = [new Image(), new Image()];
	let activeLayer = 0,
		heroToken = 0,
		heroUrl = "";
	routeLayers.forEach((image) => {
		image.alt = "";
		image.className = "dxb-route-hero-image";
		hero?.append(image);
	});
	function setHero(photo) {
		if (app || !hero) return;
		const token = ++heroToken;
		if (!photo) {
			heroUrl = "";
			root.classList.remove("has-route-photo");
			routeLayers.forEach((image) => image.classList.remove("is-visible"));
			return;
		}
		if (heroUrl === (photo.full || photo.image)) {
			updateScene();
			return;
		}
		const preload = new Image();
		preload.onload = async () => {
			try {
				await preload.decode();
			} catch {}
			if (token !== heroToken) return;
			const next = 1 - activeLayer,
				layer = routeLayers[next];
			layer.classList.remove("is-visible");
			layer.src = preload.src;
			try {
				await layer.decode();
			} catch {}
			if (token !== heroToken) return;
			void layer.offsetWidth;
			requestAnimationFrame(() => {
				if (token !== heroToken) return;
				layer.classList.add("is-visible");
				routeLayers[activeLayer].classList.remove("is-visible");
				activeLayer = next;
				heroUrl = photo.full || photo.image;
				root.classList.add("has-route-photo");
				updateScene();
			});
		};
		preload.onerror = () => {
			if (token === heroToken) setHero(null);
		};
		preload.src = photo.full || photo.image;
	}
	function sizeHero() {
		if (!app && $("#routes")) root.style.setProperty("--hero-fade-height", $("#routes").offsetTop + "px");
	}
	if (!app && $(".dxb-hero") && window.ResizeObserver) new ResizeObserver(sizeHero).observe($(".dxb-hero"));
	window.addEventListener("resize", sizeHero);
	sizeHero();
	function updateScene() {
		if (app || !hero) return;
		const nav = $(".dxb-nav"),
			diary = $("#bus-diary");
		if (nav)
			nav.classList.toggle(
				"is-stuck",
				nav.getBoundingClientRect().top <=
					parseFloat(getComputedStyle(nav).top) + 1,
			);
		const pastDiary =
			diary && diary.getBoundingClientRect().top <= window.innerHeight * 0.5;
		root.classList.toggle("has-route-photo", Boolean(heroUrl) && !pastDiary);
		if (!root.classList.contains("has-route-photo")) return;
		const number = $("#dxb-route-number");
		root.style.setProperty(
			"--route-glow",
			getComputedStyle(number).backgroundColor,
		);
		if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
			hero.style.setProperty(
				"--parallax",
				Math.min(180, Math.max(0, -root.getBoundingClientRect().top) * 0.12) +
					"px",
			);
	}
	new MutationObserver(updateScene).observe($("#dxb-route-number"), {
		attributes: true,
		attributeFilter: ["data-service-type"],
	});
	window.addEventListener("scroll", () => requestAnimationFrame(updateScene), {
		passive: true,
	});
	window.addEventListener("resize", updateScene);
	updateScene();
	function related(route) {
		if (app) return;
		const photos = DXB.photos
			.map((p, i) => ({ ...p, index: i }))
			.filter((p) => p.route.toUpperCase() === route);
		const stories = DXB.journeys.filter((j) => j.route.toUpperCase() === route);
		const panel = $("#panel-photos");
		panel.replaceChildren();
		if (photos.length) {
			const grid = document.createElement("div");
			grid.className = "dxb-route-photos";
			photos.forEach((p) => {
				const button = document.createElement("button");
				button.type = "button";
				button.setAttribute("aria-label", `Open ${p.title}`);
				const img = new Image();
				img.src = p.full || p.image;
				img.loading = "lazy";
				img.decoding = "async";
				img.alt = p.alt;
				button.append(img);
				button.addEventListener("click", () => openPhoto(p.index));
				grid.append(button);
			});
			panel.append(grid);
		} else
			panel.append(
				text(
					"p",
					`No photographs of ${route} in the archive yet.`,
					"dxb-small dxb-muted",
				),
			);
		const storyPanel = $("#panel-stories");
		storyPanel.replaceChildren();
		if (stories.length)
			stories.forEach((j) => {
				const a = document.createElement("a");
				a.href = j.url;
				a.className = "dxb-route-story";
				a.append(
					text("span", `${j.route} · Journey notes ↗`),
					text("small", `${j.start} → ${j.end}`),
				);
				storyPanel.append(a);
			});
		else
			storyPanel.append(
				text(
					"p",
					`This route's story is still to come. Explore the diary below.`,
					"dxb-small dxb-muted",
				),
			);
		const photo = photos[0];
		setHero(photo);
		$("#dxb-route-photo").src = photo ? photo.image : initialPhoto.src;
		$("#dxb-route-photo").alt = photo ? photo.alt : initialPhoto.alt;
		$("#dxb-route-caption").textContent = photo
			? `${photo.title}${photo.date ? " · " + photo.date : ""}`
			: `From the wider archive · ${initialPhoto.caption}`;
	}
	async function search(value, direction = "inbound", preserveTab = false, transition = null) {
		clearTimeout(debounce);
		controller?.abort();
		stopArrivals();
		if (app) stopAppPolling();
		const token = ++sequence,
			route = value.trim().toUpperCase().replace(/\s+/g, "");
		++heroToken;
		$("#dxb-route-state").hidden = true;
		result.hidden = true;
		current = null;
		setRouteTabAvailability();
		$("#dxb-arrivals").replaceChildren(
			text("p", "Choose a stop for live arrival predictions.", "dxb-small"),
		);
		$("#dxb-updated").textContent = "";
		$$("[data-route]").forEach((b) =>
			b.setAttribute("aria-pressed", String(b.dataset.route === route)),
		);
		if (!route) {
			setHero(null);
			announce("Choose a route to explore the London bus network.");
			return;
		}
		if (!/^[A-Z0-9]{1,6}$/.test(route)) {
			setHero(null);
			announce("Enter a route number such as 8, N8 or H32.", true);
			return;
		}
		controller = new AbortController();
		announce(`Finding route ${route}…`);
        if (app && !transition) showAppRouteFeedback("loading", route);
		$("#routes").setAttribute("aria-busy", "true");
		try {
			const data = transition?.data || await request(
				`route/${encodeURIComponent(route)}?direction=${direction}`,
				controller.signal,
			);
			if (token !== sequence) return;
			if (transition) commitAppRoute(transition);
			current = data;
			if (app) { root.dataset.serviceType = data.serviceType || "regular"; root.dataset.routeTheme = data.serviceType === "night" || /^N/i.test(data.name) ? "night" : "day"; }
			setRouteTabAvailability(data.profile);
			input.value = route;
			remember(route);
			arrivalRows = [];
			const directionSelect = $("#dxb-direction");
			directionSelect.replaceChildren(
				new Option("Loading destination…", data.direction),
			);
			if (!data.archive)
				request("directions/" + encodeURIComponent(route), controller.signal)
					.then((labels) => {
						if (token !== sequence) return;
						directionSelect.replaceChildren();
						Object.entries(labels).forEach(([key, label]) =>
							directionSelect.add(
								new Option(label.replace(/^Towards\s+/i, "to "), key),
							),
						);
						directionSelect.value = data.direction;
						directionSelect.disabled = directionSelect.options.length < 2;
						if (app && $('#dxbus-overview-direction')) { $('#dxbus-overview-direction').replaceChildren(...Array.from(directionSelect.options).map((option) => new Option(option.text, option.value))); $('#dxbus-overview-direction').value = data.direction; $('#dxbus-overview-direction').disabled = directionSelect.disabled; }
					})
					.catch(() => {
						if (token === sequence) {
							directionSelect.replaceChildren(
								new Option(
									"to " + (data.stops?.at(-1)?.name || "destination"),
									data.direction,
								),
							);
							directionSelect.disabled = true;
						}
					});
			$("#dxb-route-number").textContent = data.name;
			input.dataset.spacing = routeSpacing(data.name);
			$("#dxb-route-number").dataset.spacing =
				/^(?:[0-9]{1,3}|[A-Z][0-9]|[0-9][A-Z])$/i.test(data.name)
					? "tight"
					: "normal";
			const serviceType =
				data.serviceType ||
				(/^N\d+$/.test(route)
					? "night"
					: /^6\d{2}$/.test(route) && route !== "607"
					? "school"
					: "regular");
			const descriptions = {
				eastlondon: [
					"East London Transit",
					"Connecting communities across east London.",
				],
				superloop: ["Superloop", "Express connections across London."],
				bakerloop: ["Bakerloop", "A connection across south London."],
				night: ["Night bus", "Explore the route after dark."],
				"24hour": ["24-hour bus", "Discover the route, day and night."],
				school: ["School bus", "A route for the school-day journey."],
				regular: ["London bus route", "Another way to see the city."],
			};
			// EL1 keeps the East London Transit identity alongside its all-day service.
			const description =
				route === "EL1"
					? [
							"East London Transit · 24-hour service",
							"Connecting east London, day and night.",
					  ]
					: descriptions[serviceType] || [
							"London bus route",
							"Route directory information.",
					  ];
			$("#dxb-route-type").textContent = description[0];
			$("#dxb-route-description").textContent = description[1];
			const number = $("#dxb-route-number");
			number.dataset.serviceType = "regular";
			input.dataset.serviceType = serviceType;
			const stops = data.stops || [];
			const endpoints = $("#dxb-endpoints");
			endpoints.replaceChildren();
			const branches = [...new Set(data.branches?.filter(Boolean) || [])];
			if (app && $('[data-dxbus-route-title]')) $('[data-dxbus-route-title]').textContent = branches[0] || (stops.length ? `${stops[0].name} ↔ ${stops.at(-1).name}` : `Route ${data.name}`);
			if (!branches.length)
				branches.push(
					stops.length
						? `${stops[0].name} → ${stops[stops.length - 1].name}`
						: "Stop information is not available for this direction.",
				);
			branches.forEach((branch) =>
				endpoints.append(text("div", branch, "dxb-endpoint")),
			);
			$("#dxb-route-detail").textContent = data.archive
				? "Current TfL stop information is not available for this route identifier. See the directory source for its status."
				: `${stops.length} stops returned for the ${data.direction} direction. Select Stops & arrivals to choose a stop.`;
			$("#dxb-direction").value = data.direction;
			$(".dxb-selects").hidden = Boolean(data.archive);
			if (data.archive)
				$("#dxb-arrivals").replaceChildren(
					text(
						"p",
						"Live arrivals are unavailable for this route identifier. See Overview for its listed status.",
						"dxb-small",
					),
				);
			const select = $("#dxb-stop");
			select.replaceChildren(new Option("Choose a stop", ""));
			stops.forEach((s) => select.add(new Option(s.name, s.id)));
			consultationData = null;
			$("#dxb-consultation-notice").replaceChildren();
			loadProfile(route, token);
			loadConsultations(route, token);
			related(route);
			result.hidden = false;
			if (app) {
				renderOverviewStopList();
				const savedStop = new URL(location.href).searchParams.get('stop');
				if (savedStop && [...select.options].some((option) => option.value === savedStop)) select.value = savedStop;
				activateTab(preserveTab ? tab : requestedTab(), 'replace');
				loadAppOverviewUpdates(route, token); startAppPolling();
			} else activateTab(preserveTab ? tab : "overview");
			// Commit the neutral colour before beginning the gradual transition.
			void number.offsetWidth;
			requestAnimationFrame(() => {
				if (token === sequence) number.dataset.serviceType = serviceType;
			});
			announce(
				`Route ${route} · ${
					data.archive
						? data.profile
							? "route directory information"
							: "from the personal archive"
						: "information from TfL"
				}`,
			);
			const url = new URL(location.href);
			if (!app) { url.searchParams.set("route", route); history.replaceState(null, "", url); }
		} catch (error) {
			if (error.name !== "AbortError" && token === sequence) {
				setHero(null);
				announce(error.message, true);
				const state = $("#dxb-route-state");
				state.replaceChildren(
					text(
						"h3",
						error.code === "route_not_found"
							? "Route Not Found"
							: "Route Temporarily Unavailable",
					),
					text("p", error.message),
				);
				state.hidden = false;
			}
		} finally {
			if (token === sequence) { $("#routes").removeAttribute("aria-busy"); if (app) showAppRouteFeedback(""); }
		}
	}
	$("#dxb-search").addEventListener("submit", (event) => {
		if (app) return;
		event.preventDefault();
		search(input.value);
	});
	input.addEventListener("input", () => {
		if (app) return;
		input.dataset.serviceType = "regular";
		clearTimeout(debounce);
		controller?.abort();
		stopArrivals();
		++sequence;
		current = null;
		result.hidden = true;
		$("#routes").removeAttribute("aria-busy");
		announce(
			input.value.trim()
				? "Searching…"
				: "Choose a route to explore the London bus network.",
		);
		debounce = setTimeout(() => search(input.value), 350);
	});

	$("#dxb-direction").addEventListener("change", (event) => {
		if (app) changeAppDirection(event.target.value);
		else if (current) search(current.name, event.target.value, true);
	});
	$("#dxb-stop").addEventListener("change", () => {
		failures = 0;
		arrivalRows = [];
		stopArrivals();
		$("#dxb-arrivals").replaceChildren(
			text("p", "Choose a stop for live arrival predictions.", "dxb-small"),
		);
		$("#dxb-updated").textContent = "";
		if (app && current) history.replaceState({ dxbus: true }, "", appURL());
		if ($("#dxb-stop").value) refreshArrivals();
	});
	async function showScheduledArrival(route, stop, signal) {
		const host = $("#dxb-arrivals"),
			box = text("div", "", "dxb-schedule-state");
		box.append(
			text("strong", "No live arrivals currently showing"),
			text("p", "Checking the published timetable…"),
		);
		host.replaceChildren(box);
		try {
			const data = await request(
				`timetable/${encodeURIComponent(route)}/${encodeURIComponent(stop)}`,
				signal,
			);
			if (
				!box.isConnected ||
				current?.id !== route ||
				$("#dxb-stop").value !== stop
			)
				return;
			box.replaceChildren(text("span", "TIMETABLE", "dxb-schedule-label"));
			if (data.available) {
				box.append(
					text(
						"strong",
						data.ended
							? "Last scheduled departure has passed"
							: "Next scheduled bus",
					),
				);
				if (data.ended)
					box.append(
						text(
							"p",
							`The last bus was timetabled here at ${data.last} today.`,
						),
					);
				box.append(
					text(
						"p",
						(() => {
							const departure = new Date(data.next);
							const day = new Intl.DateTimeFormat("en-CA", {
								timeZone: "Europe/London",
								year: "numeric",
								month: "2-digit",
								day: "2-digit",
							});
							const sameDay = day.format(departure) === day.format(new Date());
							return new Intl.DateTimeFormat("en-GB", {
								timeZone: "Europe/London",
								hour: "2-digit",
								minute: "2-digit",
								...(sameDay
									? {}
									: { weekday: "long", day: "numeric", month: "long" }),
							}).format(departure);
						})(),
						"dxb-schedule-time",
					),
				);
				box.append(
					text(
						"small",
						"Timetabled, not a live prediction. Actual running and special services may differ.",
					),
				);
			} else {
				box.append(
					text("strong", "No live predictions available"),
					text(
						"p",
						"The next scheduled bus could not be confirmed. This does not necessarily mean service has finished.",
					),
				);
			}
			if (data.source) box.append(sourceLink("View timetable ↗", data.source));
		} catch (e) {
			if (e.name !== "AbortError" && box.isConnected)
				box.replaceChildren(
					text("strong", "No live predictions available"),
					text(
						"p",
						"The timetable is temporarily unavailable. Please check again shortly.",
					),
				);
		}
	}
	function arrivalRetryState(delay) {
		const deadline = Date.now() + delay,
			box = text("div", "", "dxb-arrival-retry");
		const icon = text("span", "↻", "dxb-retry-icon");
		icon.setAttribute("aria-hidden", "true");
		const body = text("div", "", "dxb-retry-body");
		body.append(
			text(
				"strong",
				"Arrival predictions temporarily unavailable",
				"dxb-retry-title",
			),
			text("p", "We’ll try again automatically.", "dxb-retry-description"),
		);
		const countdown = text("span", "", "dxb-retry-countdown");
		countdown.setAttribute("role", "timer");
		countdown.setAttribute("aria-live", "off");
		const track = text("div", "", "dxb-retry-track"),
			fill = text("span", "", "dxb-retry-fill");
		track.setAttribute("aria-hidden", "true");
		track.append(fill);
		body.append(countdown, track);
		box.append(icon, body);
		$("#dxb-arrivals").replaceChildren(box);
		function tick() {
			if (!box.isConnected) {
				clearInterval(retryTicker);
				return;
			}
			const remaining = Math.max(0, deadline - Date.now());
			countdown.textContent = remaining
				? "Retrying in " + Math.ceil(remaining / 1000) + "s"
				: "Retrying now…";
			fill.style.width = 100 * (1 - remaining / delay) + "%";
		}
		tick();
		retryTicker = setInterval(tick, 250);
	}
	async function refreshArrivals() {
		stopArrivals();
		if (
			!current ||
			tab !== "arrivals" ||
			document.hidden ||
			!$("#dxb-stop").value
		)
			return;
		const route = current.id,
			stop = $("#dxb-stop").value;
		arrivalsController = new AbortController();
		$("#dxb-updated").textContent = "Updating arrival predictions…";
		const retry = $(".dxb-arrival-retry");
		if (retry) {
			retry.classList.add("is-fetching");
			retry.querySelector(".dxb-retry-title").textContent =
				"Fetching arrival predictions";
			retry.querySelector(".dxb-retry-description").textContent =
				"Connecting to TfL…";
			retry.querySelector(".dxb-retry-countdown").textContent = "Retrying now…";
		}
		try {
			const data = await request(
				`arrivals/${encodeURIComponent(route)}/${encodeURIComponent(stop)}`,
				arrivalsController.signal,
			);
			if (current?.id !== route || $("#dxb-stop").value !== stop) return;
			arrivalRows = data.arrivals.filter(
				(a) =>
					Number.isFinite(Date.parse(a.expected)) &&
					Date.parse(a.expected) >= Date.now() - 15000,
			);
			renderArrivals();
			if (!arrivalRows.length)
				showScheduledArrival(route, stop, arrivalsController.signal);
			$("#dxb-updated").textContent = `Updated ${new Date().toLocaleTimeString(
				"en-GB",
				{ hour: "2-digit", minute: "2-digit", second: "2-digit" },
			)} · TfL predictions · refreshes every 30 seconds`;
			failures = 0;
		} catch (error) {
			if (error.name === "AbortError") return;
			if (
				current?.id !== route ||
				tab !== "arrivals" ||
				$("#dxb-stop").value !== stop
			)
				return;
			$("#dxb-updated").textContent = "";
			failures++;
		}
		if (
			current?.id === route &&
			tab === "arrivals" &&
			$("#dxb-stop").value === stop
		) {
			const delay = Math.min(120000, 30000 * (failures + 1));
			if (failures) arrivalRetryState(delay);
			timer = setTimeout(refreshArrivals, delay);
		}
	}
	document.addEventListener("visibilitychange", () => {
		if (document.hidden) stopArrivals();
		else if (tab === "arrivals") refreshArrivals();
	});
	$("#dxb-share")?.addEventListener("click", async () => {
		const button = $("#dxb-share");
		try {
			await navigator.clipboard.writeText(location.href);
			button.textContent = "Route link copied ✓";
		} catch {
			button.textContent = "Copy the route URL from your address bar";
		}
		setTimeout(() => (button.textContent = "Copy route link ↗"), 4000);
	});
	// The app owns one route-wide refresh loop. View changes never create another.
	let appPollTimer = 0,
		appPollTicker = 0,
		appPollController = null,
		appPollSequence = 0,
		appPollFailures = 0,
		appNextRefresh = 0,
		latestRoutePositions = null,
		latestRunning = null,
		appDirections = {},
		appRouteSequences = [],
		appFleet = { single: [], double: [], unknown: [] },
		appMapMode = 'map',
		appExplorerMode = 'map',
		appOverviewNews = null;
	const appMaps = new Map();
	const routeViews = { overview: 'overview', tracking: 'arrivals', explorer: 'line', pinned: 'pinned', gallery: 'photos', stories: 'stories', updates: 'news', discussion: 'discussion' };
	const viewNames = Object.fromEntries(Object.entries(routeViews).map(([view, name]) => [name, view]));
	const canonicalTab = (name) => routeViews[name] || (viewNames[name] ? name : 'overview');
	const requestedTab = () => { const url = new URL(location.href); const hash = url.hash.replace(/^#(?:panel-|tab-)?/, ''); return canonicalTab(url.searchParams.get('view') || url.searchParams.get('tab') || (viewNames[hash] || routeViews[hash] ? hash : 'overview')); };
	function appURL(name = tab) {
		const url = new URL(location.href);
		url.searchParams.delete('route');
		if (name === 'overview') url.searchParams.delete('view');
		else url.searchParams.set('view', viewNames[name] || 'overview');
		if (current?.direction && current.direction !== 'inbound') url.searchParams.set('direction', current.direction);
		else url.searchParams.delete('direction');
		if (name === 'arrivals' && $('#dxb-stop')?.value) url.searchParams.set('stop', $('#dxb-stop').value);
		else url.searchParams.delete('stop');
		return url;
	}
	// Keep the application instance and its single polling loop. Fetch the canonical
	// document as well as live route data so archive content and fallback links agree.
	let appNavigationController = null, appNavigationSequence = 0;
	function showAppRouteFeedback(state, route = '', message = '') {
        if (!app) return;
        document.getElementById('dxbus-route-feedback')?.remove();
        if (!state) return;
        const box = text('section', '', 'dxbus-route-feedback'); box.id = 'dxbus-route-feedback'; box.dataset.state = state;
        box.setAttribute('role', state === 'loading' ? 'status' : 'alert');
        box.setAttribute('aria-live', state === 'loading' ? 'polite' : 'assertive');
        const art = text('div', '', 'dxbus-route-feedback__art'); art.setAttribute('aria-hidden', 'true');
        art.innerHTML = '<svg viewBox="0 0 100 80" fill="none" stroke="currentColor" stroke-width="2"><rect x="20" y="8" width="60" height="57" rx="5"/><path d="M20 35h60M30 16h40M30 65v8m40-8v8M32 49h7m22 0h7M10 78h80"/></svg>';
        const copy = text('div', '', 'dxbus-route-feedback__copy');
        copy.append(text('span', route ? 'ROUTE ' + route : 'LONDON BUSES', 'dxbus-route-feedback__route'));
        copy.append(text('h2', state === 'loading' ? 'Your next route is arriving…' : state === 'notfound' ? 'That route could not be found.' : 'This route is taking a little longer.'));
        copy.append(text('p', message || (state === 'loading' ? 'Finding the route, photographs and published details.' : 'Check the route number or try again shortly.')));
        if (state !== 'loading') {
            const actions = text('div', '', 'dxbus-route-feedback__actions');
            const dismiss = text('button', 'Return to the route search', 'dxbus-button'); dismiss.type = 'button';
            dismiss.addEventListener('click', () => { box.remove(); input.focus(); input.select(); });
            actions.append(dismiss); copy.append(actions);
        }
        box.append(art, copy); document.body.append(box);
    }
    function cancelAppRouteRequest() {
		appNavigationSequence++;
		appNavigationController?.abort(); appNavigationController = null;
		root.removeAttribute('aria-busy');
        showAppRouteFeedback('');
	}
	function commitAppRoute(transition) {
		const { page, config, url, historyMode } = transition;
		// These slots have no direct event bindings. Photo links use delegated clicks.
		for (const selector of ['#dxbus-overview-photos', '#dxbus-overview-stories', '#dxb-gallery', '#panel-stories']) {
			const target = $(selector), incoming = page.querySelector(selector);
			if (target && incoming) target.replaceChildren(...[...incoming.childNodes].map((node) => document.importNode(node, true)));
		}
		const hero = $('.dxbus-hero'), nextHero = page.querySelector('.dxbus-hero');
		hero?.querySelector('.dxbus-hero__image')?.remove();
		if (nextHero?.querySelector('.dxbus-hero__image')) hero?.prepend(document.importNode(nextHero.querySelector('.dxbus-hero__image'), true));
		hero?.classList.toggle('has-image', nextHero?.classList.contains('has-image') || false);
		for (const selector of ['.dxbus-route-identity .dxbus-eyebrow', '[data-dxbus-route-label]', '[data-dxbus-breadcrumb]', '#dxbus-route-summary', '[data-dxbus-operator]', '[data-dxbus-allocation]']) {
			const target = $(selector), incoming = page.querySelector(selector);
			if (target && incoming) target.textContent = incoming.textContent;
		}
		// Retain established handlers while refreshing every route-specific href.
		const incomingLinks = [...page.querySelectorAll('[data-dxbus-nav]')];
		$$('[data-dxbus-nav]').forEach((link) => {
			const incoming = incomingLinks.find((node) => node.id ? node.id === link.id : !link.id && node.dataset.dxbusNav === link.dataset.dxbusNav);
			if (incoming) link.href = incoming.href;
		});
		const quickLinks = [...page.querySelectorAll('.dxbus-quick-links a')];
		$$('.dxbus-quick-links a').forEach((link, index) => { if (quickLinks[index]) link.href = quickLinks[index].href; });
		const empty = $('#dxb-gallery-empty'), incomingEmpty = page.querySelector('#dxb-gallery-empty');
		if (empty && incomingEmpty) empty.hidden = incomingEmpty.hidden;
		$('#dxb-photo-search').value = '';
		$('#dxb-comments').replaceChildren(text('p', 'Approved comments will appear here.', 'dxbus-empty'));
		$('#dxb-comment-form').reset(); $('#dxb-comment-status').textContent = '';
		$('#dxb-comment-form button').disabled = false;
		$('#dxbus-updates-content')?.replaceChildren();
		$$('dialog[open]').forEach((dialog) => dialog.close());
		root.dataset.route = config.route; root.dataset.serviceType = page.querySelector('.dxbus-app').dataset.serviceType;
		Object.assign(DXB, config); document.title = page.title;
		appMaps.forEach(({ map }) => map.remove()); appMaps.clear();
		latestRoutePositions = null; latestRunning = null; appDirections = {}; appRouteSequences = [];
		appFleet = { single: [], double: [], unknown: [] }; appOverviewNews = null;
		$$('[data-dxbus-stat]').forEach((node) => { node.textContent = '…'; });
		$('#dxbus-overview-arrivals')?.replaceChildren(text('p', 'Checking TfL arrival predictions…', 'dxbus-empty'));
		$('#dxbus-overview-service')?.replaceChildren(text('p', 'Checking current TfL service status…', 'dxbus-empty'));
		if (historyMode !== 'none') history[historyMode === 'replace' ? 'replaceState' : 'pushState']({ dxbus: true }, '', url);
	}
	async function navigateAppRoute(value, options = {}) {
		const route = String(value || '').trim().toUpperCase();
		if (!/^[A-Z0-9]{1,6}$/.test(route)) throw new Error('Enter a route number such as 112, N118 or 18.');
		if (route === String(current?.name || '').toUpperCase()) return true;
		cancelAppRouteRequest();
		const token = appNavigationSequence, navController = new AbortController(); appNavigationController = navController;
		const url = options.url ? new URL(options.url) : appURL();
		if (!options.url) {
			url.pathname = new URL(encodeURIComponent(route.toLowerCase()) + '/', DXB.dashboardBase).pathname;
			url.hash = ''; url.searchParams.delete('stop');
		}
		const direction = url.searchParams.get('direction') === 'outbound' ? 'outbound' : 'inbound';
		root.setAttribute('aria-busy', 'true');
        showAppRouteFeedback('loading', route);
		try {
			const [response, data] = await Promise.all([
				fetch(url.href, { credentials: 'same-origin', signal: navController.signal, headers: { 'X-Requested-With': 'XMLHttpRequest' } }),
				request(`route/${encodeURIComponent(route)}?direction=${direction}`, navController.signal),
			]);
			const html = await response.text();
			if (token !== appNavigationSequence) return false;
			const page = new DOMParser().parseFromString(html, 'text/html');
			const encoded = [...page.scripts].map((script) => script.textContent.match(/\bvar\s+DXB\s*=\s*(\{[^\n]+\});/)).find(Boolean);
			const config = encoded ? JSON.parse(encoded[1]) : null;
			if (!response.ok || !config || config.error || String(config.route).toUpperCase() !== route || !page.querySelector('.dxbus-app')) throw new Error(config?.error || 'This route could not be loaded. Please try again.');
			// No scripts from the fetched document are executed or inserted.
			page.querySelectorAll('script').forEach((script) => script.remove());
			await search(route, direction, true, { page, config, data, url, historyMode: options.historyMode || 'push' });
			if (token === appNavigationSequence && root.classList.contains('is-menu-open')) $('[data-dxbus-menu]')?.click();
			return token === appNavigationSequence;
		} catch (error) {
			if (error.name === 'AbortError' || token !== appNavigationSequence) return false;
            showAppRouteFeedback(error.code === 'route_not_found' ? 'notfound' : 'error', route, error.message);
			throw error;
		} finally { if (token === appNavigationSequence) { appNavigationController = null; root.removeAttribute('aria-busy'); } }
	}
	if (app) { root.dxNavigateRoute = navigateAppRoute; root.dxCancelRouteRequest = cancelAppRouteRequest; }
	function changeAppDirection(direction) {
		if (!current || !['inbound', 'outbound'].includes(direction) || direction === current.direction) return;
		const route = current.name, url = appURL();
		if (direction === 'inbound') url.searchParams.delete('direction');
		else url.searchParams.set('direction', direction);
		url.searchParams.delete('stop');
		history.pushState({ dxbus: true }, '', url);
		search(route, direction, true);
	}
	function updatePinnedCount() {
		$$('[data-dxbus-pinned-count],[data-dxbus-pin-count]').forEach((node) => { node.textContent = String(marked.length); node.hidden = !marked.length; });
	}
	function setAppStat(name, value, state = '') {
		const node = $(`[data-dxbus-stat="${name}"]`);
		if (node) {
            node.textContent = value; node.dataset.state = state;
            const card = node.closest('.dxbus-stat');
            card?.classList.toggle('is-classifying', state === 'loading');
            card?.classList.toggle('is-empty', ['single','double'].includes(name) && value === '0' && !state);
        }
	}
	function setAppStatus(message, state = '') {
		const nodes = new Set([$('#dxbus-refresh-status'), $('[data-dxbus-stat-status]'), $('[data-dxbus-stat-note=total]')]);
		nodes.forEach((node) => { if (node) { node.textContent = message; node.dataset.state = state; } });
	}
	function stopAppPolling() {
		appPollSequence++;
		clearTimeout(appPollTimer); clearInterval(appPollTicker);
		appPollTimer = 0; appPollTicker = 0;
		appPollController?.abort(); appPollController = null;
	}
	function renderRefreshDeadline() {
		if (!app || !current || current.archive) return;
		const seconds = Math.max(0, Math.ceil((appNextRefresh - Date.now()) / 1000));
		setAppStat('refresh', document.hidden ? 'Paused' : seconds ? `${seconds}s` : '…');
		const note = $('[data-dxbus-stat-note=refresh]'); if (note) note.textContent = appPollFailures ? 'Retry countdown' : 'Next prediction refresh';
	}
	function scheduleAppPoll(delay) {
		clearTimeout(appPollTimer); clearInterval(appPollTicker);
		appNextRefresh = Date.now() + delay;
		renderRefreshDeadline();
		appPollTicker = setInterval(renderRefreshDeadline, 1000);
		appPollTimer = setTimeout(refreshAppFeed, delay);
	}
	function getVehicle(reg) {
		reg = String(reg || '').replace(/\s/g, '').toUpperCase();
		if (!vehicleCache.has(reg)) vehicleCache.set(reg, request('vehicle/' + encodeURIComponent(reg)).catch((error) => { vehicleCache.delete(reg); throw error; }));
		return vehicleCache.get(reg);
	}
	async function openAppVehicle(reg, context = {}) {
		const route = current?.name, token = sequence;
		const vehicle = await getVehicle(reg).catch(() => ({ registration: reg, found: false }));
		if (token === sequence && current?.name === route) openFleet('vehicle', [{ ...vehicle, ...context, registration: reg }], route);
	}
	async function updateAppVehicleStats(running, token, poll) {
		const ids = [...new Set(running.vehicles || [])];
		appFleet = { single: [], double: [], unknown: [] };
		setAppStat('total', String(running.count));
		setAppStat('single', ids.length ? '…' : '0', ids.length ? 'loading' : '');
		setAppStat('double', ids.length ? '…' : '0', ids.length ? 'loading' : '');
		let index = 0;
		const nextFleet = { single: [], double: [], unknown: [] };
		await Promise.all(Array.from({ length: Math.min(4, ids.length) }, async () => {
			while (index < ids.length && token === sequence && poll === appPollSequence) {
				const reg = ids[index++], vehicle = await getVehicle(reg).catch(() => ({ registration: reg, found: false }));
				const type = vehicle.found && !vehicle.withdrawn ? deckType(vehicle.type) : null;
				nextFleet[type || 'unknown'].push({ ...vehicle, registration: reg });
			}
		}));
		if (token !== sequence || poll !== appPollSequence) return;
		appFleet = nextFleet;
		setAppStat('single', String(nextFleet.single.length), nextFleet.unknown.length ? 'unconfirmed' : '');
		setAppStat('double', String(nextFleet.double.length), nextFleet.unknown.length ? 'unconfirmed' : '');
		const note = $('[data-dxbus-classification-note]') || $('[data-dxbus-stat-note=single]');
		if (note) note.textContent = nextFleet.unknown.length ? `${nextFleet.unknown.length} type${nextFleet.unknown.length === 1 ? '' : 's'} unconfirmed` : 'Confirmed vehicle types';
		const doubleNote = $('[data-dxbus-stat-note=double]'); if (doubleNote) doubleNote.textContent = 'Fleet source · bustimes.org';
	}
	function selectAppStop(stopId, direction = current?.direction) {
		if (!current || current.archive) return;
		const selectStop = () => {
			const select = $('#dxb-stop');
			if (![...select.options].some((option) => option.value === stopId)) return;
			select.value = stopId; failures = 0; arrivalRows = [];
			activateTab('arrivals');
			select.focus();
		};
		if (direction && direction !== current.direction) {
			search(current.name, direction, true).then(selectStop);
		} else selectStop();
	}
	function renderOverviewArrivals() {
		const host = $('#dxbus-overview-arrivals');
		if (!host) return;
		host.replaceChildren();
		const vehicles = (latestRoutePositions?.vehicles || []).filter((bus) => Date.parse(bus.expected) > Date.now() - 15000).slice(0, 5);
		if (!vehicles.length) { host.append(text('p', latestRoutePositions ? 'No upcoming predictions are currently available for this route.' : 'Live arrival predictions are temporarily unavailable.', 'dxbus-widget-empty')); return; }
		vehicles.forEach((bus) => {
			const row = text('article', '', 'dxbus-arrival-mini');
			const stop = text('button', bus.stop || 'Predicted stop', 'dxbus-stop-select'); stop.type = 'button'; stop.addEventListener('click', () => selectAppStop(bus.stopId, bus.direction));
			const minutes = Math.max(0, Math.ceil((Date.parse(bus.expected) - Date.now()) / 60000));
			row.append(stop, text('strong', minutes < 1 ? 'Due' : `${minutes} min`), text('small', `Towards ${bus.destination || 'destination not supplied'}`));
			const vehicle = text('button', formatRegistration(bus.registration), 'dxbus-vehicle-select'); vehicle.type = 'button'; vehicle.addEventListener('click', () => openAppVehicle(bus.registration, bus)); row.append(vehicle);
			host.append(row);
		});
	}
	function renderServiceStatus(data, failed = false) {
		const host = $('#dxbus-overview-service');
		if (!host) return;
		host.replaceChildren();
		const rows = data?.statuses || [];
		if (failed || !rows.length) host.append(text('p', failed ? 'TfL service status is temporarily unavailable.' : 'TfL has not supplied a service status for this route.', 'dxbus-widget-empty'));
		rows.forEach((row) => {
			const card = text('div', '', 'dxbus-service-state' + (Number(row.severity) === 10 ? ' is-good' : ' is-notice'));
			card.append(text('strong', row.description || 'Service notice'));
			if (row.reason) { const notice = text('details', '', 'dxbus-service-notice'); notice.append(text('summary', 'Read service notice'), text('p', row.reason)); card.append(notice); }
			host.append(card);
		});
		const link = sourceLink('Check TfL service information ↗', data?.source || 'https://tfl.gov.uk/bus/status/'); link.className = 'dxbus-source-note'; host.append(link);
	}
	function renderOverviewStopList(stops = current?.stops || []) {
		const host = $('#dxbus-overview-stop-list');
		if (!host) return;
		host.replaceChildren();
		const list = text('ol', '', 'dxbus-stop-list');
		stops.forEach((stop, index) => {
			const item = text('li', '', 'dxbus-stop-row');
			const button = text('button', stop.name, 'dxbus-stop-select'); button.type = 'button'; button.addEventListener('click', () => selectAppStop(stop.id));
			item.append(text('small', String(index + 1).padStart(2, '0')), button);
			list.append(item);
		});
		host.append(list);
		if (!stops.length) host.append(text('p', 'Published stops are unavailable for this route.', 'dxbus-widget-empty'));
		host.hidden = appMapMode !== 'list';
	}
	let leafletReady;
	function ensureRouteMap() {
		if (window.L) return Promise.resolve(window.L);
		return leafletReady ||= new Promise((resolve, reject) => {
			const existing = document.querySelector('script[src*="leaflet@1.9.4"]');
			const script = existing || document.createElement('script');
			const timeout = setTimeout(() => reject(new Error('The map library could not be loaded.')), 15000);
			script.addEventListener('load', () => { clearTimeout(timeout); window.L ? resolve(window.L) : reject(new Error('The map library is unavailable.')); }, { once: true });
			script.addEventListener('error', () => { clearTimeout(timeout); reject(new Error('The map library could not be loaded.')); }, { once: true });
			if (!existing) {
				if (!document.querySelector('link[href*="leaflet@1.9.4"]')) { const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.append(css); }
				script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; document.head.append(script);
			}
		}).catch((error) => { leafletReady = null; throw error; });
	}
	async function renderRouteMap(host, routeData = current, positions = latestRoutePositions) {
		if (!host || !routeData || host.hidden) return;
		const token = sequence;
		const stops = (routeData.stops || []).filter((stop) => Number.isFinite(Number(stop.lat)) && Number.isFinite(Number(stop.lon)) && stop.lat != null && stop.lon != null);
		if (!stops.length) { if (!appMaps.has(host)) host.replaceChildren(text('p', 'Geographic stop coordinates are unavailable. Use the ordered stop list.', 'dxbus-widget-empty')); return; }
		try {
			const L = await ensureRouteMap();
			if (token !== sequence || !host.isConnected) return;
			let state = appMaps.get(host);
			if (!state) {
				host.replaceChildren();
				host.classList.add('dxbus-map--osm');
				const map = L.map(host, { scrollWheelZoom: false, zoomControl: true });
				L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>' }).addTo(map);
				state = { map, stops: L.layerGroup().addTo(map), buses: L.layerGroup().addTo(map), identity: '' }; appMaps.set(host, state);
			}
			const identity = `${current?.id}:${routeData.direction}:${stops.map((stop) => stop.id).join(',')}`;
			const color = getComputedStyle(root).getPropertyValue('--dxbus-route').trim() || (/^N/i.test(current?.name || '') ? '#c6e8f5' : '#e52d36');
			if (state.identity !== identity) {
				state.stops.clearLayers();
				const points = stops.map((stop) => [Number(stop.lat), Number(stop.lon)]);
				L.polyline(points, { color, weight: 4, opacity: .85 }).addTo(state.stops);
				stops.forEach((stop, i) => {
					const marker = L.circleMarker([Number(stop.lat), Number(stop.lon)], { radius: i === 0 || i === stops.length - 1 ? 6 : 3, color, weight: 2, fillColor: '#101212', fillOpacity: 1 }).addTo(state.stops);
					const popup = text('div', '', 'dxbus-map-popup'); popup.append(text('strong', stop.name));
					const button = text('button', 'View live arrivals', 'dxbus-stop-select'); button.type = 'button'; button.addEventListener('click', () => selectAppStop(stop.id, routeData.direction)); popup.append(button); marker.bindPopup(popup);
				});
				state.map.fitBounds(L.latLngBounds(points), { padding: [22, 22], maxZoom: 13 }); state.identity = identity;
			}
			state.buses.clearLayers();
			(positions?.vehicles || []).forEach((bus) => {
				if (bus.direction && bus.direction !== routeData.direction) return;
				const stop = stops.find((item) => item.id === bus.stopId);
				if (!stop || Date.parse(bus.expected) < Date.now() - 15000) return;
				const marker = L.marker([Number(stop.lat), Number(stop.lon)], { icon: L.divIcon({ className: 'dxbus-map-bus', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="5" y="3" width="14" height="17" rx="3"/><path d="M5 10h14M8 20v2m8-2v2M8 15h1m6 0h1"/></svg>', iconSize: [28, 28], iconAnchor: [14, 14] }), title: `${formatRegistration(bus.registration)} · next predicted stop ${stop.name}, not GPS`, keyboard: true }).addTo(state.buses);
				const tip = text('div', '', 'dxbus-map-bus-tooltip__body');
                const model = text('span', 'Checking make and model…');
                tip.append(text('strong', formatRegistration(bus.registration)), model, text('span', 'Route ' + (bus.route || current.name) + (bus.destination ? ' · ' + bus.destination : '')), text('small', 'Next predicted stop: ' + stop.name + ' · not GPS'));
                marker.bindTooltip(tip, { className: 'dxbus-map-bus-tooltip', direction: 'top', opacity: 1 });
                getVehicle(bus.registration).then(vehicle => {
                    if (token !== sequence || !state.buses.hasLayer(marker)) return;
                    model.textContent = vehicle.model || 'Make and model unconfirmed';
                    marker.getElement()?.setAttribute('aria-label', formatRegistration(bus.registration) + ' · ' + model.textContent + ' · next predicted stop ' + stop.name);
                }).catch(() => { model.textContent = 'Make and model unavailable'; });
                marker.on('click', () => openAppVehicle(bus.registration, bus));
			});
			requestAnimationFrame(() => state.map.invalidateSize());
		} catch { if (!appMaps.has(host)) host.replaceChildren(text('p', 'The map is temporarily unavailable. The stop list and live arrivals remain available.', 'dxbus-widget-empty')); }
	}
	function applyAppMapMode(kind, mode) {
		const overview = kind === 'overview';
		if (overview) appMapMode = mode; else appExplorerMode = mode;
		const map = $(overview ? '#dxbus-overview-map' : '#dxbus-explorer-map');
		const list = $(overview ? '#dxbus-overview-stop-list' : '#dxb-line-stops');
		if (map) map.hidden = mode !== 'map'; if (list) list.hidden = mode !== 'list';
		$$(`[data-dxbus-${kind}-mode]`).forEach((button) => button.setAttribute('aria-pressed', String(button.dataset[overview ? 'dxbusOverviewMode' : 'dxbusExplorerMode'] === mode)));
		if (mode === 'map') renderRouteMap(map, overview ? current : appRouteSequences.find((row) => row.direction === $('#dxb-line-direction')?.value) || current);
	}
	async function refreshAppFeed() {
		if (!app || !current || current.archive || document.hidden) return;
		clearTimeout(appPollTimer); clearInterval(appPollTicker);
		appPollController?.abort(); appPollController = new AbortController();
		const poll = ++appPollSequence, token = sequence, route = current.id;
		setAppStat('refresh', '…'); setAppStatus('Updating TfL predictions…', 'loading');
		const feeds = await Promise.allSettled([
			request('running/' + encodeURIComponent(route), appPollController.signal),
			request('line-positions/' + encodeURIComponent(route), appPollController.signal),
			request('status/' + encodeURIComponent(route), appPollController.signal),
		]);
		if (poll !== appPollSequence || token !== sequence || current?.id !== route) return;
		const [running, positions, service] = feeds;
		let failures = 0;
		if (running.status === 'fulfilled') {
			latestRunning = running.value;
			updateAppVehicleStats(running.value, token, poll);
		} else {
			failures++;
			if (!latestRunning) { ['total', 'single', 'double'].forEach((name) => setAppStat(name, '—', 'error')); }
			else { ['total', 'single', 'double'].forEach((name) => { const node = $(`[data-dxbus-stat="${name}"]`); if (node) node.dataset.state = 'stale'; }); }
		}
		if (positions.status === 'fulfilled') {
			latestRoutePositions = positions.value;
			renderOverviewArrivals();
			renderRouteMap($('#dxbus-overview-map'));
			if (tab === 'line') loadLine();
		} else {
			failures++;
			if (!latestRoutePositions) renderOverviewArrivals();
		}
		renderServiceStatus(service.status === 'fulfilled' ? service.value : null, service.status === 'rejected');
		const stamp = latestRoutePositions?.asOf || latestRunning?.asOf;
		const checked = latestRunning?.checked || latestRoutePositions?.checked || latestRoutePositions?.retrieved;
		const date = new Date(stamp || checked || '');
		const timeLabel = Number.isFinite(date.getTime()) ? date.toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '';
		setAppStatus(failures ? `Live data temporarily unavailable.${timeLabel ? ` Last successful check ${timeLabel}.` : ''} Retrying automatically.` : `${timeLabel ? (stamp ? 'Predictions as of ' : 'Checked ') + timeLabel + ' · ' : ''}TfL predictions`, failures ? 'error' : 'ready');
		const caption = $('#dxbus-overview-arrivals-note');
		if (caption) caption.textContent = positions.status === 'rejected' && latestRoutePositions ? 'Saved predictions from the last successful refresh; arrival times may have changed.' : 'Next predicted stop for each vehicle · not a GPS position';
		appPollFailures = failures ? appPollFailures + 1 : 0;
		scheduleAppPoll(failures ? Math.min(120000, 30000 * (appPollFailures + 1)) : 30000);
	}
	function startAppPolling() {
		stopAppPolling(); latestRoutePositions = null; latestRunning = null; appPollFailures = 0;
		if (!app) return;
		if (current?.archive) { ['total', 'single', 'double', 'refresh'].forEach((name) => setAppStat(name, '—')); setAppStatus('Live predictions are unavailable for this archived route.'); renderOverviewArrivals(); renderServiceStatus(null); return; }
		['total', 'single', 'double'].forEach((name) => setAppStat(name, '…', 'loading'));
		refreshAppFeed();
	}
	function renderAppOverviewUpdates() {
		const host = $('#dxbus-overview-updates'); if (!host) return;
		host.replaceChildren();
		if (!appOverviewNews && !consultationData) { host.append(text('p', 'Checking route update sources…', 'dxbus-widget-empty')); return; }
		(appOverviewNews?.items || []).slice(0, 1).forEach((item) => {
			const article = text('article', '', 'dxbus-update-card'); article.append(text('span', item.category || 'Service change', 'dxb-news-badge'));
			if (item.date) article.append(text('small', dateLabel(item.date)));
			article.append(text('p', item.summary), sourceLink('Read the source update ↗', item.url)); host.append(article);
		});
		(consultationData?.items || []).slice(0, 1).forEach((item) => {
			const article = text('article', '', 'dxbus-update-card'); article.append(text('span', item.status || 'TfL consultation', 'dxb-news-badge'), text('h3', item.title));
			if (item.published && Number.isFinite(Date.parse(item.published))) article.append(text('small', 'Published ' + new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(item.published))));
			article.append(sourceLink('Read the proposal and status ↗', item.url)); host.append(article);
		});
		if (!appOverviewNews?.items?.length && !consultationData?.items?.length) host.append(text('p', appOverviewNews?.error || consultationData?.error ? 'Some update sources are temporarily unavailable. Open Updates to retry or visit the original sources.' : 'No matching service changes or consultations are listed in the current sources.', 'dxbus-widget-empty'));
		if (appOverviewNews?.stale || consultationData?.stale) host.append(text('small', 'Includes a saved source update.', 'dxbus-source-note'));
		if (appOverviewNews?.updated) host.append(text('small', 'Service-change source updated ' + appOverviewNews.updated + '. Planned changes remain provisional.', 'dxbus-source-note'));
	}
	async function loadAppOverviewUpdates(route, token) {
		const host = $('#dxbus-overview-updates'); if (!host) return;
		appOverviewNews = null; renderAppOverviewUpdates();
		try {
			const data = await request('news/' + encodeURIComponent(route)); if (token !== sequence) return;
			appOverviewNews = data;
		} catch { if (token !== sequence) return; appOverviewNews = { error: true }; }
		renderAppOverviewUpdates();
	}
	function renderAppRouteTrivia(profile) {
        if (!app) return;
        let host = $('#dxbus-route-trivia');
        if (!host) { host = text('div', '', 'dxbus-route-trivia'); host.id = 'dxbus-route-trivia'; $('.dxbus-meta')?.after(host); }
        host.replaceChildren();
        const addBadge = (label, source) => { const badge = source ? sourceLink(label, source) : text('span', label); badge.className = 'dxbus-trivia-badge'; host.append(badge); };
        if (profile.crossBoundary) addBadge('Cross-boundary route ↗', profile.crossBoundarySource);
        if (profile.record) addBadge('🏆 ' + profile.record + ' ↗', profile.recordSource);
        if (profile.badgeType === 'former') {
            const h = profile.history || {};
            const tenure = text('p', '', 'dxbus-route-tenure');
            const displayDate = value => {
                const raw = String(value || '');
                if (!/^\d{1,2}\s+[A-Za-z]+\s+\d{4}$/.test(raw)) return raw;
                const date = new Date(raw + ' 12:00:00 GMT');
                return Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', day: '2-digit', month: '2-digit', year: 'numeric' }).format(date) : raw;
            };
            if (h.start && h.end) tenure.append(document.createTextNode(displayDate(h.start) + ' – ' + displayDate(h.end)));
            else if (h.end) tenure.append(document.createTextNode('RAN UNTIL ' + displayDate(h.end)));
            else if (h.tenure) tenure.append(document.createTextNode('IN SERVICE · ' + h.tenure));
            else tenure.append(document.createTextNode('FORMER ROUTE · Operating dates not confirmed'));
            if (h.source) { tenure.append(document.createTextNode(' · ')); tenure.append(sourceLink('Route history ↗', h.source)); }
            host.append(tenure);
        }
    }
    function applyAppProfile(profile) {
        renderAppRouteTrivia(profile);
		root.dataset.serviceType = profile.badgeType || current?.serviceType || 'regular';
		root.dataset.routeTheme = root.dataset.serviceType === 'night' || /^N\d/i.test(current?.name || '') ? 'night' : 'day';
		const operator = $('[data-dxbus-operator]'), allocation = $('[data-dxbus-allocation]'), summary = $('#dxbus-route-summary');
		if (operator) {
			const operators = profile.operators?.length ? profile.operators.join(' / ') : 'Operator not confirmed';
			const garages = Array.isArray(profile.garages) ? profile.garages.filter(Boolean) : [];
			operator.textContent = operators + (garages.length ? ` · ${garages.length === 1 ? 'Garage' : 'Garages'}: ${garages.join(' / ')}` : '');
		}
		if (allocation) allocation.textContent = profile.vehicle ? profile.vehicle + (deckType(profile.vehicle) ? ' (usually)' : '') : 'Vehicle allocation not confirmed';
		if (summary && !summary.textContent.trim()) summary.textContent = profile.listingNotes || `Route ${current?.name || ''} connects ${current?.branches?.[0] || 'the published stops below'}.${profile.operators?.length ? ` Operated by ${profile.operators.join(' / ')}.` : ''}`;
	}
	function initAppControls() {
		if (!app) return;
		root.dataset.appReady = 'true'; updatePinnedCount();
		$$('.dxbus-card--map .dxbus-small').forEach((note) => { note.textContent = 'Lines connect published stops rather than an exact road path. Vehicle markers show the next predicted stop, not live GPS.'; });
		const explorerNote = $('#panel-line .dxbus-view__head p:last-child'); if (explorerNote) explorerNote.textContent = 'Explore published stops in either direction. Map lines connect stops rather than following the exact road path. Vehicle markers show the next predicted stop, not live GPS.';
		if ($('#dxbus-overview-arrivals') && !$('#dxbus-overview-arrivals-note')) { const note = text('p', 'Next predicted stop for each vehicle · not a GPS position', 'dxbus-source-note'); note.id = 'dxbus-overview-arrivals-note'; $('#dxbus-overview-arrivals').after(note); }
		['single','double'].forEach((type) => { const card = $('.dxbus-stat--' + type); if (!card) return; card.setAttribute('role', 'button'); card.tabIndex = 0; card.setAttribute('aria-label', 'View confirmed ' + type + '-decker vehicles'); card.addEventListener('click', () => openFleet(type, appFleet[type], current?.name)); card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); card.click(); } }); });
		$$('[data-dxbus-go]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); activateTab(canonicalTab(link.dataset.dxbusGo)); }));
		$$('[data-dxbus-overview-mode]').forEach((button) => button.addEventListener('click', () => applyAppMapMode('overview', button.dataset.dxbusOverviewMode)));
		$$('[data-dxbus-explorer-mode]').forEach((button) => button.addEventListener('click', () => applyAppMapMode('explorer', button.dataset.dxbusExplorerMode)));
		$$('[data-dxbus-stat-card]').forEach((button) => button.addEventListener('click', () => { const type = button.dataset.dxbusStatCard; if (['single', 'double', 'unknown'].includes(type)) openFleet(type, appFleet[type], current?.name); }));
		$('#dxbus-overview-direction')?.addEventListener('change', (event) => changeAppDirection(event.target.value));
		let menuFocus = null;
		const sidebar = $('.dxbus-sidebar'), toggle = $('[data-dxbus-menu]');
		const closeMenu = (restore = true) => {
			root.classList.remove('is-menu-open'); document.body.classList.remove('dxbus-menu-open'); toggle?.setAttribute('aria-expanded', 'false'); $$('[data-dxbus-close]').forEach((node) => { node.hidden = true; });
			if (restore) menuFocus?.focus();
		};
		toggle?.addEventListener('click', () => {
			if (root.classList.contains('is-menu-open')) { closeMenu(); return; }
			menuFocus = document.activeElement; $$('[data-dxbus-close]').forEach((node) => { node.hidden = false; }); root.classList.add('is-menu-open'); document.body.classList.add('dxbus-menu-open'); toggle.setAttribute('aria-expanded', 'true');
			const focusMenu = () => {
				if (root.classList.contains('is-menu-open') && sidebar && !sidebar.contains(document.activeElement)) sidebar.querySelector('input,button,a')?.focus();
			};
			requestAnimationFrame(focusMenu);
			// Retry after the drawer reveal for browsers that defer focus during visibility transitions.
			setTimeout(focusMenu, 350);
		});
		$$('[data-dxbus-close-menu],[data-dxbus-scrim],[data-dxbus-close]').forEach((button) => button.addEventListener('click', () => closeMenu()));
		root.addEventListener('keydown', (event) => {
			if (!root.classList.contains('is-menu-open')) return;
			if (event.key === 'Escape') { event.preventDefault(); closeMenu(); }
			if (event.key === 'Tab' && sidebar) {
				const focusable = [...sidebar.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex="0"]')].filter((node) => !node.hidden && node.getClientRects().length);
				const first = focusable[0], last = focusable.at(-1);
				if (!sidebar.contains(document.activeElement)) { event.preventDefault(); (event.shiftKey ? last : first)?.focus(); }
				else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
				else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
			}
		});
		$$('[data-tab]').forEach((link) => link.addEventListener('click', () => closeMenu(false)));
		$$('[data-dxbus-nav]:not([data-tab])').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); activateTab(canonicalTab(link.dataset.dxbusNav)); closeMenu(false); }));
		$$('[data-dxbus-switch]').forEach((button) => button.addEventListener('click', () => { if (!matchMedia('(min-width: 992px)').matches && !root.classList.contains('is-menu-open')) toggle?.click(); input.focus(); input.select(); }));
		window.addEventListener('popstate', () => {
			const pathRoute = decodeURIComponent(location.pathname.replace(/\/+$/, '').split('/').at(-1)).toUpperCase();
			if (/^[A-Z0-9]{1,6}$/.test(pathRoute) && pathRoute !== String(current?.name || root.dataset.route).toUpperCase()) {
				const previousTab = tab; tab = requestedTab();
				navigateAppRoute(pathRoute, { url: location.href, historyMode: 'none' }).catch((error) => {
					tab = previousTab;
					const restored = appURL(previousTab);
					restored.pathname = new URL(encodeURIComponent(root.dataset.route.toLowerCase()) + '/', DXB.dashboardBase).pathname;
					history.replaceState({ dxbus: true }, '', restored); announce(error.message, true);
				}); return;
			}
			cancelAppRouteRequest();
			const direction = new URL(location.href).searchParams.get('direction') || 'inbound';
			if (current && direction !== current.direction) { tab = requestedTab(); search(current.name, direction, true); return; }
			activateTab(requestedTab(), 'none');
			const stop = new URL(location.href).searchParams.get('stop');
			if (tab === 'arrivals' && stop && [...$('#dxb-stop').options].some((option) => option.value === stop)) { $('#dxb-stop').value = stop; refreshArrivals(); }
		});
		document.addEventListener('visibilitychange', () => { if (document.hidden) stopAppPolling(); else if (current && !current.archive) refreshAppFeed(); });
		window.addEventListener('pagehide', () => { cancelAppRouteRequest(); stopArrivals(); stopAppPolling(); appMaps.forEach(({ map }) => map.remove()); appMaps.clear(); });
		const media = matchMedia('(min-width: 992px)'); media.addEventListener('change', (event) => { if (event.matches) closeMenu(false); });
	}
	initAppControls();

	const indexReady = request("routes")
		.then((routes) => {
			const list = $("#dxb-route-options");
			routes.forEach((route) =>
				list.append(new Option(route.name, route.name)),
			);
		})
		.catch(() => {});
	const initialRoute = app ? DXB.route || root.dataset.route || "" : new URL(location.href).searchParams.get("route") || "";
	indexReady.finally(() => {
		if (sequence === 0 && initialRoute.trim() && !(app && DXB.error)) search(initialRoute, new URL(location.href).searchParams.get("direction") || "inbound");
	});

	const navLinks = $$(".dxb-nav a");
	let scrollScheduled = false;
	function updateNavigation() {
		let active = "buses-overview";
		["routes", "bus-diary", "news", "bus-models", "photography"].forEach(
			(id) => {
				if (document.getElementById(id)?.getBoundingClientRect().top <= 145)
					active = id;
			},
		);
		navLinks.forEach((a) => {
			if (a.hash === `#${active}`) a.setAttribute("aria-current", "location");
			else a.removeAttribute("aria-current");
		});
		scrollScheduled = false;
	}
	window.addEventListener(
		"scroll",
		() => {
			if (!scrollScheduled) {
				scrollScheduled = true;
				requestAnimationFrame(updateNavigation);
			}
		},
		{ passive: true },
	);
	updateNavigation();
})();

// Stagger the waitlist's content without delaying form availability.
dxOnPageReady(() => {
	if (
		!document.body.classList.contains("page-n118-fitness") ||
		matchMedia("(prefers-reduced-motion: reduce)").matches
	)
		return;
	const items = document.querySelectorAll(
		"#main .headline, #main h2, #main .wp-block-paragraph, #main .mailpoet_form_columns, #main .mailpoet_paragraph.last",
	);
	items.forEach((item, index) =>
		item.animate(
			[
				{ opacity: 0, transform: "translateY(18px)" },
				{ opacity: 1, transform: "translateY(0)" },
			],
			{
				duration: 650,
				delay: Math.min(index * 100, 700),
				easing: "ease-out",
				fill: "backwards",
			},
		),
	);
});

// Editorial motion leaves native document layout and nested scrolling intact.
(() => {
	const init = () => {
		const reduced = matchMedia("(prefers-reduced-motion: reduce)");
		const observer = new IntersectionObserver(
			(entries) =>
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.remove("is-pending");
						entry.target.classList.add("is-visible");
					}
				}),
			{ threshold: 0.12 },
		);
		document.querySelectorAll(".dx-reveal,.dx-service-scene").forEach((el) => {
			if (!reduced.matches && el.classList.contains("dx-reveal"))
				el.classList.add("is-pending");
			observer.observe(el);
		});
	};
	if (document.readyState === "loading") dxOnPageReady(init);
	else init();
})();
(() => {
	const styleActions = () =>
		document
			.querySelectorAll(
				"a.btn,.wp-block-button__link,.service-card-link,.dx-menu__cta",
			)
			.forEach((a) => {
				if (
					!/[↗↘→↓]/.test(a.textContent) &&
					!a.querySelector("svg,i,[class*=arrow]")
				) {
					const arrow = document.createElement("span");
					arrow.className = "dx-cta-arrow";
					arrow.setAttribute("aria-hidden", "true");
					arrow.textContent = "↗";
					a.append(arrow);
				}
			});
	if (document.readyState === "loading") dxOnPageReady(styleActions);
	else styleActions();
})();

// Native document scrolling; explicit navigation may use a bounded smooth scroll.
(() => {
	if (!document.body.classList.contains("is-frontend")) return;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	document
		.querySelector("[data-read-study]")
		?.addEventListener("click", (e) => {
			e.preventDefault();
			document.querySelector(".story-section")?.scrollIntoView({
				behavior: reduced.matches ? "instant" : "smooth",
				block: "start",
			});
		});
	const intro = document.querySelector(".dx-services-intro"),
		visual = document.querySelector(".dx-service-visual img");
	if (intro && visual) {
		const img = visual.cloneNode();
		img.className = "dx-services-hero-art";
		img.alt = "";
		img.setAttribute("aria-hidden", "true");
		intro.prepend(img);
	}
})();

// Shared editorial interactions (formerly immersive.js).
(() => {
	const init = () => {
		const body = document.body;
		if (!body.classList.contains("is-frontend")) return;
		const reduced = matchMedia("(prefers-reduced-motion: reduce)");
		document.addEventListener("dragstart", (e) => {
			if (e.target.closest("img,picture")) e.preventDefault();
		});
		const header = document.querySelector("#header");
		const headerSize = () =>
			document.documentElement.style.setProperty(
				"--dx-header-bottom",
				Math.max(70, header?.getBoundingClientRect().bottom || 100) + "px",
			);
		headerSize();
		if (header) new ResizeObserver(headerSize).observe(header);
		const list = document.querySelector(".dx-menu__list");
		if (list) {
			const links = [...list.querySelectorAll(":scope>li>a")];
			const home = links.find((a) => new URL(a.href).pathname === "/");
			if (home) {
				home.setAttribute("aria-label", "Home");
				home.innerHTML =
					'<svg class="dx-home-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 11 12 3l9 8M5 9v12h5v-7h4v7h5V9"/></svg>';
			}
			const login = links.find((a) => /client login/i.test(a.textContent));
			if (login) {
				const cta = document.querySelector(".dx-menu__cta");
				if (cta) {
					cta.href = login.href;
					cta.querySelector("span").textContent = "Client login";
				}
				login.parentElement.remove();
			}
			const photo = links.find(
					(a) => new URL(a.href).pathname === "/photography/",
				),
				contact = links.find((a) => new URL(a.href).pathname === "/contact/");
			if (photo && contact) photo.parentElement.after(contact.parentElement);
		}
		// Lock the actual page position while retaining independent menu scrolling.
		let savedY = 0,
			locked = false;
		const lock = () => {
			const open = body.classList.contains("nav-open");
			if (open && !locked) {
				savedY = scrollY;
				locked = true;
				body.style.position = "fixed";
				body.style.top = -savedY + "px";
				body.style.width = "100%";
			} else if (!open && locked) {
				locked = false;
				body.style.position = "";
				body.style.top = "";
				body.style.width = "";
				window.scrollTo({ top: savedY, behavior: "instant" });
			}
		};
		new MutationObserver(lock).observe(body, {
			attributes: true,
			attributeFilter: ["class"],
		});
		// Reveal individual photographs only as they approach the viewport.
		const photos = [
			...document.querySelectorAll("#dxb-gallery .dxb-photo-card"),
		];
		if ("IntersectionObserver" in window && !reduced.matches) {
			const io = new IntersectionObserver(
				(entries) =>
					entries.forEach((e) => {
						if (e.isIntersecting) {
							e.target.classList.remove("dx-photo-pending");
							io.unobserve(e.target);
						}
					}),
				{ rootMargin: "0px 0px 60px 0px", threshold: 0.02 },
			);
			photos.forEach((p) => {
				p.classList.add("dx-photo-pending");
				io.observe(p);
			});
		}
		const photoHero = document.querySelector(".dx-photo-hero");
		if (photoHero && photos.length) {
			const sources = photos
				.slice(0, 8)
				.map((p) => p.querySelector("img"))
				.filter(Boolean);
			let index = 0,
				active = 0,
				paused = reduced.matches;
			const layers = [0, 1].map((_, i) => {
				const img = sources[0].cloneNode();
				img.className = "dx-page-hero-art" + (i ? " dx-slide-hidden" : "");
				img.alt = "";
				img.loading = "eager";
				photoHero.prepend(img);
				return img;
			});
			const toggle = document.createElement("button");
			toggle.type = "button";
			toggle.className = "dx-photo-pause";
			const label = () => {
				toggle.textContent = paused ? "Play slideshow" : "Pause slideshow";
			};
			label();
			toggle.addEventListener("click", () => {
				paused = !paused;
				label();
			});
			photoHero.append(toggle);
			setInterval(() => {
				if (
					paused ||
					document.hidden ||
					photoHero.getBoundingClientRect().bottom < 0
				)
					return;
				index = (index + 1) % sources.length;
				const next = layers[1 - active],
					source = sources[index];
				next.src = source.currentSrc || source.src;
				next.removeAttribute("srcset");
				next
					.decode()
					.then(() => {
						next.classList.remove("dx-slide-hidden");
						layers[active].classList.add("dx-slide-hidden");
						active = 1 - active;
					})
					.catch(() => {});
			}, 5500);
			reduced.addEventListener("change", () => {
				paused = reduced.matches;
				label();
			});
		}
		const reel = document.querySelector(".dx-project-reel"),
			track = reel?.querySelector(".dx-project-track");
		if (reel && track) {
			let distance = 0;
			const size = () => {
				distance = Math.max(
					0,
					track.scrollWidth - innerWidth + innerWidth * 0.12,
				);
				reel.style.height = reduced.matches
					? "auto"
					: innerHeight + distance + "px";
				update();
			};
			const update = () => {
				if (reduced.matches) return;
				const progress = Math.min(
					distance,
					Math.max(0, -reel.getBoundingClientRect().top),
				);
				track.style.transform = `translate3d(${-progress}px,0,0)`;
			};
			window.addEventListener("scroll", update, { passive: true });
			window.addEventListener("resize", size);
			reduced.addEventListener("change", size);
			new ResizeObserver(size).observe(track);
			size();
			track.addEventListener("focusin", (e) => {
				const card = e.target.closest(".dx-project-poster");
				if (!card || reduced.matches) return;
				window.scrollTo({
					top:
						scrollY +
						reel.getBoundingClientRect().top +
						Math.min(distance, card.offsetLeft - track.offsetLeft),
					behavior: "smooth",
				});
			});
		}
		// Keep earlier project chapters readable in normal document flow.
		if (body.classList.contains("single-project")) {
			document.querySelectorAll(".story-section").forEach((s) => {
				s.classList.add("dx-editorial-chapter");
			});
			document.querySelectorAll(".story-section img").forEach((img) => {
				img.loading = "lazy";
				img.decoding = "async";
			});
		}
		// Bounded, frame-scheduled background movement; reduced-motion users see a still image.
		const parallax = [];
		const closing = document.querySelector("body.home .start-something");
		if (closing) {
			const img = closing.querySelector("img.wp-block-cover__image-background");
			if (img) {
				closing.classList.add("dx-parallax-section");
				img.classList.add("dx-parallax-art");
				parallax.push([closing, img]);
			}
		}
		document.querySelectorAll(".dx-photo-promo").forEach((section) => {
			const img = section.querySelector(".dx-parallax-art");
			if (img) {
				section.classList.add("dx-parallax-section");
				parallax.push([section, img]);
			}
		});
		let motionFrame = 0;
		const moveBackgrounds = () => {
			motionFrame = 0;
			parallax.forEach(([section, img]) => {
				const rect = section.getBoundingClientRect();
				if (rect.bottom < 0 || rect.top > innerHeight) return;
				img.style.setProperty(
					"--dx-parallax-y",
					reduced.matches
						? "0px"
						: Math.max(
								-45,
								Math.min(
									45,
									(innerHeight / 2 - rect.top - rect.height / 2) * 0.09,
								),
						  ) + "px",
				);
			});
		};
		const scheduleMotion = () => {
			if (!motionFrame) motionFrame = requestAnimationFrame(moveBackgrounds);
		};
		if (parallax.length) {
			addEventListener("scroll", scheduleMotion, { passive: true });
			addEventListener("resize", scheduleMotion);
			reduced.addEventListener("change", scheduleMotion);
			scheduleMotion();
		}
		const enquiry = document.querySelector(".enquiry-form");
		if (enquiry) {
			const delivery = enquiry.querySelector("[name=photography_delivery]");
			if (
				delivery &&
				new URLSearchParams(location.search).get("photo_delivery") === "express"
			)
				delivery.value = "express";
			const syncPhotoBudget = () => {
				const photo =
						enquiry.querySelector("[name=service]:checked")?.value ===
						"photography",
					budget = enquiry.querySelector("[name=budget]");
				if (delivery) delivery.closest(".photo-delivery-field").hidden = !photo;
				if (budget) {
					if (photo)
						budget.value =
							enquiry.querySelector("[name=photography_delivery]")?.value ===
							"express"
								? "£50 photography — 24 hours"
								: "£40 photography";
					else if (
						["£40 photography", "£50 photography — 24 hours"].includes(
							budget.value,
						)
					)
						budget.value = "";
				}
			};
			enquiry.addEventListener("change", (e) => {
				if (["service", "photography_delivery"].includes(e.target.name))
					syncPhotoBudget();
			});
			syncPhotoBudget();
		}

		const fitnessTitle = document.querySelector(".dxf-hero h1");
		if (fitnessTitle && !fitnessTitle.querySelector(".dx-gold"))
			fitnessTitle.innerHTML = fitnessTitle.innerHTML.replace(
				/Raise the bar\./i,
				'<span class="dx-gold">Raise the bar.</span>',
			);
		const cover = body.classList.contains("home")
			? document.querySelector(".hero-background")
			: null;
		if (cover) {
			const glow = document.createElement("div");
			glow.className = "dx-home-glow";
			glow.setAttribute("aria-hidden", "true");
			cover.prepend(glow);
		}
		// Carry the user's own saved estimate into registration without URL personal data.
		if (body.classList.contains("page-template-page-signup")) {
			try {
				const h = JSON.parse(
					sessionStorage.getItem("dxndre-calculator-handoff") || "null",
				);
				if (h && new URLSearchParams(location.search).has("from_calculator")) {
					const form = document.querySelector(".auth-signup form");
					for (const [name, value] of Object.entries({
						company: h.company,
						projectref: h.reference,
					})) {
						const input = form?.elements.namedItem(name);
						if (input && value) input.value = value;
					}
					if (form) {
						const note = document.createElement("p");
						note.className = "dx-account-handoff";
						note.textContent =
							"Your project details are ready" +
							(h.reference ? " · " + h.reference : "") +
							". Choose your account details below.";
						form.prepend(note);
					}
				}
			} catch {}
		}
		document
			.querySelectorAll(".auth form input[placeholder]")
			.forEach((input) => {
				if (!input.hasAttribute("aria-label"))
					input.setAttribute("aria-label", input.placeholder);
			});
	};
	if (document.readyState === "loading") dxOnPageReady(init);
	else init();
})();

dxOnPageReady(() => {
	// Keep permanent accessible names when the visible prompt moves into the field.
	document
		.querySelectorAll("body.page-id-22 .fluentform .ff-el-group")
		.forEach((group) => {
			const field = group.querySelector(
				"input:not([type=checkbox]):not([type=radio]):not([type=hidden]),select,textarea",
			);
			const label = group.querySelector(".ff-el-input--label");
			if (!field || !label) return;
			const text =
				label.textContent.trim().replace(/\s+/g, " ") +
				(label.classList.contains("ff-el-is-required") ? " *" : "");
			if (field.tagName === "SELECT") {
				const option = field.querySelector('option[value=""]');
				if (option) option.textContent = text;
			} else
				field.placeholder =
					field.tagName === "TEXTAREA"
						? text + " — Tell me about your project, timeline and goals."
						: text;
			label.classList.add("dx-placeholder-label");
		});
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const word = document.querySelector(".dxf-hero .dx-gold");
	if (word) {
		const watch = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) {
					word.classList.add("dx-raise");
					watch.disconnect();
				}
			},
			{ threshold: 0.4 },
		);
		watch.observe(word);
	}
	const slides = [...document.querySelectorAll(".dx-service-slides img")],
		toggle = document.querySelector(".dx-slides-toggle");
	if (slides.length && toggle) {
		let index = -1,
			paused = reduced.matches;
		toggle.textContent = paused ? "Play slideshow" : "Pause slideshow";
		toggle.setAttribute("aria-pressed", String(paused));
		toggle.addEventListener("click", () => {
			paused = !paused;
			toggle.textContent = paused ? "Play slideshow" : "Pause slideshow";
			toggle.setAttribute("aria-pressed", String(paused));
		});
		setInterval(() => {
			if (paused || document.hidden) return;
			const next = (index + 1) % (slides.length + 1);
			if (next < slides.length && !slides[next].complete) return;
			slides.forEach((img, i) =>
				img.classList.toggle("is-visible", i === next),
			);
			index = next;
		}, 5500);
		reduced.addEventListener("change", (e) => {
			paused = e.matches;
			toggle.textContent = paused ? "Play slideshow" : "Pause slideshow";
			toggle.setAttribute("aria-pressed", String(paused));
		});
	}
	const lazy = new IntersectionObserver(
		(entries) =>
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				const video = entry.target;
				if (!video.getAttribute("src")) {
					video.src = video.dataset.videoSrc;
					video.load();
				}
				lazy.unobserve(video);
			}),
		{ rootMargin: "250px" },
	);
	document.querySelectorAll("video[data-video-src]").forEach((video, index) => {
		const frame = video.closest(".dxf-media-frame");
		if (!frame) {
			lazy.observe(video);
			return;
		}
		// The custom Play button owns the paused state; native controls assist active playback.
		let nativeFallback = false;
		video.controls = false;
		video.id ||= `fitness-training-video-${index + 1}`;
		const control = document.createElement("button");
		control.type = "button";
		control.className = "dxf-video-toggle";
		control.setAttribute("aria-controls", video.id);
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("viewBox", "0 0 24 24");
		svg.setAttribute("aria-hidden", "true");
		const path = document.createElementNS(svg.namespaceURI, "path");
		svg.append(path);
		control.append(svg);
		frame.append(control);
		const syncControl = () => {
			const playing = !video.paused && !video.ended;
			video.controls = playing || nativeFallback;
			frame.classList.toggle("is-playing", playing);
			control.setAttribute(
				"aria-label",
				playing
					? "Pause training video"
					: video.ended
					? "Replay training video"
					: "Play training video",
			);
			control.setAttribute("aria-pressed", String(playing));
			path.setAttribute(
				"d",
				playing ? "M6 4h4v16H6zM14 4h4v16h-4z" : "M7 4v16l13-8z",
			);
		};
		control.addEventListener("click", async () => {
			if (!video.paused && !video.ended) {
				video.pause();
				return;
			}
			if (!video.getAttribute("src")) {
				video.src = video.dataset.videoSrc;
				video.load();
				lazy.unobserve(video);
			}
			if (video.ended) video.currentTime = 0;
			try {
				await video.play();
			} catch {
				// Failed playback leaves the native controls and central Play button usable.
				nativeFallback = true;
				syncControl();
			}
		});
		["play", "playing", "pause", "ended", "emptied"].forEach((event) =>
			video.addEventListener(event, syncControl),
		);
		video.addEventListener("loadeddata", () => frame.classList.add("is-ready"));
		video.addEventListener("error", () => {
			nativeFallback = true;
			video.controls = true;
			frame.classList.remove("is-playing", "is-ready");
			control.hidden = true;
			const text = frame.querySelector(".dxf-media-loading");
			if (text) text.textContent = "Video unavailable. Please try again later.";
		});
		syncControl();
		lazy.observe(video);
	});
	const dialog = document.querySelector(".dxf-media-dialog");
	if (dialog) {
		document.querySelectorAll("[data-fitness-image]").forEach((button) =>
			button.addEventListener("click", () => {
				const img = dialog.querySelector("img");
				img.src = button.dataset.fitnessImage;
				img.alt = button.querySelector("img").alt;
				dialog.showModal();
			}),
		);
		dialog
			.querySelector("button")
			.addEventListener("click", () => dialog.close());
		dialog.addEventListener("click", (e) => {
			if (e.target === dialog) dialog.close();
		});
	}
});

dxOnPageReady(() => {
	const motion = matchMedia("(prefers-reduced-motion: reduce)");
	const promo = document.querySelector(".dx-photo-promo"),
		config = document.getElementById("dx-promo-images");
	if (promo && config) {
		const urls = JSON.parse(config.textContent).filter(Boolean),
			original = promo.querySelector(".dx-parallax-art");
		if (urls.length > 1 && original) {
			const layers = [0, 1].map(() => {
				const img = document.createElement("img");
				img.className = "dx-promo-slide";
				img.alt = "";
				img.setAttribute("aria-hidden", "true");
				promo.prepend(img);
				return img;
			});
			let queue = [],
				last = original.src,
				active = 0,
				paused = motion.matches,
				busy = false;
			const next = () => {
				if (!queue.length) {
					queue = urls.slice();
					for (let i = queue.length - 1; i > 0; i--) {
						const j = Math.floor(Math.random() * (i + 1));
						[queue[i], queue[j]] = [queue[j], queue[i]];
					}
					if (queue[queue.length - 1] === last) queue.unshift(queue.pop());
				}
				return queue.pop();
			};
			const change = async () => {
				if (paused || document.hidden || busy) return;
				busy = true;
				const url = next(),
					img = layers[active];
				img.src = url;
				try {
					await img.decode();
					if (paused) return;
					img.classList.add("is-active");
					layers[1 - active].classList.remove("is-active");
					original.style.opacity = "0";
					last = url;
					active = 1 - active;
				} catch (e) {
				} finally {
					busy = false;
				}
			};
			const button = document.createElement("button");
			button.type = "button";
			button.className = "dx-promo-pause";
			const label = () => {
				button.textContent = paused ? "Play slideshow" : "Pause slideshow";
				button.setAttribute("aria-pressed", String(paused));
			};
			label();
			button.addEventListener("click", () => {
				paused = !paused;
				label();
				if (!paused) change();
			});
			promo.append(button);
			motion.addEventListener("change", (e) => {
				paused = e.matches;
				label();
			});
			setInterval(change, 5500);
			change();
		}
	}
	const selector =
		".dxb-gallery img,.dxb-gallery video,.dxf-media-grid img,.dxf-media-grid video,.wp-block-gallery img,.wp-block-gallery video,.dxf-media-dialog img,#dxb-lightbox img,#dxb-lightbox video";
	const seen = new WeakSet(),
		visible = new WeakSet();
	const reveal = (media) => {
		const ready =
			media.tagName === "VIDEO"
				? media.readyState >= 2
				: media.complete && media.naturalWidth > 0;
		if (
			!visible.has(media) ||
			!ready ||
			!media.classList.contains("dx-colour-pending")
		)
			return;
		media.classList.remove("dx-colour-pending");
		media.classList.add("dx-colour-ready");
		if (!motion.matches) {
			media.classList.add("dx-colour-reveal");
			media.addEventListener(
				"animationend",
				() => media.classList.remove("dx-colour-reveal"),
				{ once: true },
			);
		}
	};
	const observer = new IntersectionObserver(
		(entries) =>
			entries.forEach((e) => {
				if (e.isIntersecting) {
					visible.add(e.target);
					reveal(e.target);
				} else visible.delete(e.target);
			}),
		{ threshold: 0.08 },
	);
	const attach = (media) => {
		if (seen.has(media)) return;
		seen.add(media);
		media.classList.add("dx-colour-pending");
		observer.observe(media);
		media.addEventListener(
			media.tagName === "VIDEO" ? "loadeddata" : "load",
			() => reveal(media),
		);
	};
	document.querySelectorAll(selector).forEach(attach);
	new MutationObserver((records) =>
		records.forEach((record) => {
			if (record.type === "attributes" && record.target.matches(selector)) {
				const m = record.target;
				m.classList.remove("dx-colour-reveal", "dx-colour-ready");
				m.classList.add("dx-colour-pending");
				reveal(m);
			}
			record.addedNodes.forEach((node) => {
				if (node.nodeType !== 1) return;
				if (node.matches(selector)) attach(node);
				node.querySelectorAll(selector).forEach(attach);
			});
		}),
	).observe(document.querySelector("main") || document.body, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ["src", "srcset"],
	});
});

// One-time entrance for page sections, including dynamically inserted route sections.
dxOnPageReady(() => {
	const motion = matchMedia("(prefers-reduced-motion: reduce)");
	if (motion.matches || !("IntersectionObserver" in window)) return;
	const seen = new WeakSet();
	const show = (section) => {
		section.classList.remove("dx-section-pending");
		section.classList.add("dx-section-enter");
		section.addEventListener(
			"transitionend",
			() => section.classList.remove("dx-section-enter"),
			{ once: true },
		);
	};
	const observer = new IntersectionObserver(
		(entries) =>
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					show(entry.target);
					observer.unobserve(entry.target);
				}
			}),
		{ threshold: 0, rootMargin: "0px 0px -35px 0px" },
	);
	const register = (section) => {
		if (seen.has(section)) return;
		seen.add(section);
		if (section.getBoundingClientRect().top < innerHeight) return;
		section.classList.add("dx-section-pending");
		observer.observe(section);
	};
	document.querySelectorAll("main section").forEach(register);
	new MutationObserver((records) =>
		records.forEach((record) =>
			record.addedNodes.forEach((node) => {
				if (node.nodeType !== 1) return;
				if (node.matches("section")) register(node);
				node.querySelectorAll("section").forEach(register);
			}),
		),
	).observe(document.querySelector("main") || document.body, {
		childList: true,
		subtree: true,
	});
	document.addEventListener("focusin", (event) => {
		const section = event.target.closest(".dx-section-pending");
		if (section) {
			observer.unobserve(section);
			show(section);
		}
	});
	motion.addEventListener("change", (event) => {
		if (event.matches) {
			observer.disconnect();
			document
				.querySelectorAll(".dx-section-pending,.dx-section-enter")
				.forEach((s) =>
					s.classList.remove("dx-section-pending", "dx-section-enter"),
				);
		}
	});
});

// Shared CARTO dark location map for both photo galleries.
window.dxRenderPhotoMap = (() => {
	let previous = null;
	return (container, gps, photo = {}) => {
		if (previous) {
			previous.remove();
			previous = null;
		}
		const lat = Number(gps.lat),
			lon = Number(gps.lon);
		if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
		if (window.L) {
			const canvas = document.createElement("div");
			canvas.className = "dx-photo-carto";
			canvas.setAttribute("aria-label", "Photograph location map");
			container.append(canvas);
			const map = window.L.map(canvas, { scrollWheelZoom: false }).setView(
				[lat, lon],
				15,
			);
			previous = map;
			window.L.tileLayer(
				"https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=cb1_49v4_1_6f4e11cc72c4a39104c6f6c9",
				{
					maxZoom: 20,
					attribution:
						'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
				},
			).addTo(map);
			window.L.circleMarker([lat, lon], {
				radius: 7,
				color: "#f5d78e",
				weight: 2,
				fillColor: "#d7ad57",
				fillOpacity: 1,
			}).addTo(map);
			requestAnimationFrame(() => map.invalidateSize());
		}
		const link = document.createElement("a");
		link.href =
			"https://www.openstreetmap.org/?mlat=" +
			lat +
			"&mlon=" +
			lon +
			"#map=16/" +
			lat +
			"/" +
			lon;
		link.target = "_blank";
		link.rel = "noopener";
		link.textContent = "View photo location ↗";
		container.append(link);
		if (photo.location) {
			const label = document.createElement("p");
			label.className = "dx-photo-location";
			label.textContent = "📍 " + photo.location;
			container.append(label);
		}
	};
})();

dxOnPageReady(() => {
	document.querySelectorAll(".dx-model-carousel").forEach((carousel) => {
		const slides = [...carousel.querySelectorAll("[data-model-slide]")];
		let index = 0,
			moving = false;
		const reduced = matchMedia("(prefers-reduced-motion: reduce)");
		const show = async (direction) => {
			if (moving || slides.length < 2) return;
			const previous = slides[index];
			index = (index + direction + slides.length) % slides.length;
			const next = slides[index];
			next.hidden = false;
			if (!reduced.matches) {
				moving = true;
				previous.inert = true;
				const imageOptions = {
					duration: 1050,
					easing: "cubic-bezier(.22,1,.36,1)",
				};
				const oldImage = previous.querySelector(".dx-model-image"),
					newImage = next.querySelector(".dx-model-image");
				const animations = [];
				if (oldImage)
					animations.push(
						oldImage.animate(
							[
								{ transform: "translateX(0) scale(1.04)", opacity: 1 },
								{
									transform: `translateX(${-direction * 18}%) scale(1.04)`,
									opacity: 0,
								},
							],
							imageOptions,
						),
					);
				if (newImage)
					animations.push(
						newImage.animate(
							[
								{
									transform: `translateX(${direction * 30}%) scale(1.08)`,
									opacity: 0,
								},
								{ transform: "translateX(0) scale(1)", opacity: 1 },
							],
							imageOptions,
						),
					);
				for (const selector of [
					".dx-model-copy",
					".dx-model-specs > .dxb-eyebrow",
					".dx-model-specs > dl",
					".dx-model-specs > a",
				]) {
					const oldPart = previous.querySelector(selector),
						newPart = next.querySelector(selector);
					if (oldPart)
						animations.push(
							oldPart.animate([{ opacity: 1 }, { opacity: 0 }], {
								duration: 220,
								fill: "forwards",
							}),
						);
					if (newPart)
						animations.push(
							newPart.animate([{ opacity: 0 }, { opacity: 1 }], {
								duration: 500,
								delay: 180,
								fill: "both",
								easing: "ease-out",
							}),
						);
				}
				await Promise.allSettled(animations.map((a) => a.finished));
				animations.forEach((a) => a.cancel());
				previous.inert = false;
				moving = false;
			}
			previous.hidden = true;
			carousel.querySelector("[data-model-count]").textContent = `${
				index + 1
			} / ${slides.length}`;
		};
		carousel
			.querySelector("[data-model-prev]")
			?.addEventListener("click", () => show(-1));
		carousel
			.querySelector("[data-model-next]")
			?.addEventListener("click", () => show(1));
		let paused = reduced.matches;
		const pause = document.createElement("button");
		pause.type = "button";
		pause.className = "dx-model-pause";
		const label = () => {
			pause.textContent = paused ? "Play slideshow" : "Pause slideshow";
			pause.setAttribute("aria-pressed", String(paused));
		};
		label();
		pause.addEventListener("click", () => {
			paused = !paused;
			label();
		});
		carousel.append(pause);
		reduced.addEventListener("change", () => {
			paused = reduced.matches;
			label();
		});
		setInterval(() => {
			const r = carousel.getBoundingClientRect();
			if (
				!paused &&
				!document.hidden &&
				!carousel.matches(":hover") &&
				!carousel.contains(document.activeElement) &&
				r.bottom > 0 &&
				r.top < innerHeight
			)
				show(1);
		}, 5500);
	});
});

dxOnPageReady(() => {
	document.querySelectorAll(".is-premium-league").forEach((archive) => {
		const label = archive.querySelector("[data-gyms-state-title]");
		if (!label) return;
		const picker = document.createElement("details");
		picker.className = "league-chain-picker";
		const summary = document.createElement("summary");
		summary.setAttribute("aria-label", "Choose gym chain");
		label.before(picker);
		summary.append(label);
		picker.append(summary);
		const options = document.createElement("div");
		options.className = "league-chain-options";
		picker.append(options);
		archive
			.querySelectorAll(".gym-filter-buttons [data-chain]")
			.forEach((original) => {
				const button = document.createElement("button");
				button.type = "button";
				button.textContent = original.textContent;
				button.addEventListener("click", () => {
					original.click();
					picker.open = false;
					summary.focus();
				});
				options.append(button);
			});
		document.addEventListener("click", (e) => {
			if (!picker.contains(e.target)) picker.open = false;
		});
		picker.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				picker.open = false;
				summary.focus();
			}
		});
	});
});

// Decode before swapping, then soften the transition without showing a blank frame.
window.dxSetPhoto = async (image, photo) => {
	const token = String((Number(image.dataset.swapToken) || 0) + 1);
	image.dataset.swapToken = token;
	const next = new Image();
	next.src = photo.full;
	try {
		await next.decode();
	} catch {}
	if (image.dataset.swapToken !== token) return;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
	if (!reduced && image.src) {
		try {
			await image.animate([{ opacity: 1 }, { opacity: 0 }], {
				duration: 160,
				fill: "forwards",
			}).finished;
		} catch {}
	}
	if (image.dataset.swapToken !== token) return;
	image.getAnimations().forEach((a) => a.cancel());
	image.src = photo.full;
	image.alt = photo.alt || photo.title;
	if (!reduced)
		image.animate(
			[
				{ opacity: 0, transform: "translateX(12px)" },
				{ opacity: 1, transform: "translateX(0)" },
			],
			{ duration: 350, easing: "ease-out" },
		);
};

dxOnPageReady(() => {
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const images = [
		...document.querySelectorAll(
			".story-hero>.dx-project-hero-background,.gym-review-hero__image",
		),
	];
	if (!images.length) return;
	let frame = 0;
	const paint = () => {
		frame = 0;
		images.forEach((image) => {
			const hero = image.closest(".story-hero,.gym-review-hero");
			if (!hero) return;
			const box = hero.getBoundingClientRect();
			if (box.bottom < 0 || box.top > innerHeight) return;
			image.style.setProperty(
				"--dx-hero-shift",
				reduced.matches
					? "0px"
					: Math.max(-65, Math.min(65, -box.top * 0.12)) + "px",
			);
		});
	};
	const schedule = () => {
		if (!frame) frame = requestAnimationFrame(paint);
	};
	addEventListener("scroll", schedule, { passive: true });
	addEventListener("resize", schedule);
	reduced.addEventListener("change", schedule);
	paint();
});
// Post-launch motion is event driven and stops after each entrance.
dxOnPageReady(() => {
	if (!document.body.classList.contains("is-frontend")) return;
	const motion = matchMedia("(prefers-reduced-motion: reduce)");
	const header = document.getElementById("header"),
		brand = header?.querySelector(".navbar-brand");
	if (brand) {
		const full = document.createElement("span");
		full.className = "dx-brand-full";
		while (brand.firstChild) full.append(brand.firstChild);
		brand.append(full);
		const short = document.createElement("span");
		short.className = "dx-brand-short";
		short.textContent = "dx.";
		short.setAttribute("aria-hidden", "true");
		brand.append(short);
		const update = () => {
			if (!document.body.classList.contains("nav-open"))
				header.classList.toggle("dx-header-compact", scrollY > 10);
		};
		addEventListener("scroll", update, { passive: true });
		update();
	}
	const base =
		document
			.querySelector('script[src*="/themes/dxndre/"]')
			?.src.split("/themes/dxndre/")[0] + "/themes/dxndre/";
	const visual = document.querySelector(".dx-menu__visual"),
		bus = visual?.querySelector(".dx-menu__bus");
	if (bus && base) {
		bus.src = location.origin + "/wp-content/uploads/2025/12/92.png";
		const portraits = {
			about: base + "assets/img/portrait-editorial.png",
			fitness: base + "assets/img/fitness-repaired.webp",
		};
		const layers = {};
		Object.entries(portraits).forEach(([key, src]) => {
			const img = new Image();
			img.src = src;
			img.alt = "";
			img.className = "dx-menu__alternate";
			visual.append(img);
			layers[key] = img;
		});
		let requested = "";
		const swap = async (key) => {
			requested = key;
			const layer = layers[key];
			if (layer) {
				try {
					await layer.decode();
				} catch {
					return;
				}
				if (requested !== key) return;
			}
			Object.entries(layers).forEach(([k, img]) =>
				img.classList.toggle("is-active", k === key),
			);
			bus.style.opacity = layer ? "0" : "1";
			visual.classList.toggle("is-colour", key === "buses");
		};
		document.querySelectorAll(".dx-menu__list a").forEach((a) => {
			const key = new URL(a.href).pathname.split("/").filter(Boolean)[0] || "";
			a.addEventListener("pointerenter", () => swap(key));
			a.addEventListener("focus", () => swap(key));
		});
		document
			.querySelector(".dx-menu__list")
			?.addEventListener("pointerleave", () => swap(""));
	}
	const artObserver = new IntersectionObserver(
		(entries) =>
			entries.forEach((e) => {
				if (e.isIntersecting) {
					e.target
						.querySelectorAll(".dx-art-pending")
						.forEach((img) => img.classList.remove("dx-art-pending"));
					artObserver.unobserve(e.target);
				}
			}),
		{ threshold: 0.12 },
	);
	document
		.querySelectorAll("body.home section.text-image")
		.forEach((section) => {
			const img = section.querySelector("figure.enlarge img");
			if (!img) return;
			const fitness = section.classList.contains("dx-fitness-promo");
			if (!fitness && !section.textContent.includes("BUSES")) return;
			if (fitness && base) {
				img.src = base + "assets/img/fitness-repaired.webp";
				img.removeAttribute("srcset");
			}
			img.classList.add("dx-art-reveal");
			if (!fitness) img.classList.add("dx-art-right");
			if (!motion.matches) {
				img.classList.add("dx-art-pending");
				artObserver.observe(section);
			}
		});
	// Animate only the text node, preserving units and accessible final values.
	const counted = new WeakSet();
	const counter = new IntersectionObserver(
		(entries) =>
			entries.forEach((e) => {
				if (!e.isIntersecting) return;
				counter.unobserve(e.target);
				const el = e.target,
					node = [...el.childNodes].find(
						(n) => n.nodeType === 3 && /\d/.test(n.textContent),
					);
				if (!node) return;
				const final = node.textContent;
				el.setAttribute("aria-label", el.textContent);
				if (motion.matches) return;
				const start = performance.now();
				const paint = (now) => {
					if (!el.isConnected) return;
					const t = Math.min(1, (now - start) / 1100),
						ease = 1 - Math.pow(1 - t, 3);
					node.textContent = final.replace(/\d+(?:\.\d+)?/g, (v) =>
						(Number(v) * ease).toFixed(
							v.includes(".") ? v.split(".")[1].length : 0,
						),
					);
					if (t < 1) requestAnimationFrame(paint);
					else node.textContent = final;
				};
				requestAnimationFrame(paint);
			}),
		{ threshold: 0.3 },
	);
	const attachCounters = (root) => {
		root
			.querySelectorAll(
				".league-mosaic-score,.dxf-record-value,.dxf-story-stat .dxf-heading,[data-dx-count]",
			)
			.forEach((el) => {
				if (!counted.has(el)) {
					counted.add(el);
					counter.observe(el);
				}
			});
	};
	attachCounters(document);
	const mosaic = document.querySelector(".league-mosaic");
	if (mosaic)
		new MutationObserver(() => attachCounters(mosaic)).observe(mosaic, {
			childList: true,
		});
	// Text presentation selectors stop Unicode arrows being rendered as emoji.
	const arrows = (root) => {
		const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
			acceptNode: (n) =>
				n.parentElement?.closest("script,style,textarea,input,svg")
					? NodeFilter.FILTER_REJECT
					: NodeFilter.FILTER_ACCEPT,
		});
		const nodes = [];
		while (walker.nextNode()) nodes.push(walker.currentNode);
		nodes.forEach((n) => {
			const text = n.data.replace(
				/([↗↘↙↖⬇⬆↧↓↑→←])[\uFE0E\uFE0F]?/g,
				"$1\uFE0E",
			);
			if (text !== n.data) n.data = text;
		});
	};
	arrows(document.body);
	new MutationObserver((records) => {
		for (const record of records)
			for (const node of record.addedNodes) {
				if (node.nodeType === 1) arrows(node);
			}
	}).observe(document.body, { childList: true, subtree: true });
	document.querySelectorAll(".dxb-bad-photo").forEach((el) => {
		const first = el.firstChild;
		if (first?.nodeType === 3)
			first.textContent = first.textContent.replace(/💩\s*/, "💩 ");
	});
});

// CV download intent: expose a GTM custom event and retain GA4 reporting.
// This records a click, not proof that a browser finished saving the PDF.
document.addEventListener("click", (event) => {
	const link = event.target.closest("a[data-cv-download]");
	if (!link) return;
	if (
		typeof window.cmplz_has_consent === "function" &&
		!window.cmplz_has_consent("statistics")
	)
		return;
	const file = new URL(link.href, location.href);
	const download = {
		file_name: file.pathname.split("/").pop(),
		file_extension: "pdf",
		link_url: file.origin + file.pathname,
	};
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({ event: "cv_pdf_download", ...download });
	if (typeof window.gtag === "function") {
		window.gtag("event", "cv_download", {
			...download,
			transport_type: "beacon",
		});
	}
});

// One document-wheel controller. Native touch, keyboard and nested scrollers remain native.
// The animation stops at rest; it never feeds its own scroll events back into a target.
(() => {
	const reduce = matchMedia("(prefers-reduced-motion: reduce)");
	let frame = 0,
		target = 0,
		lastWritten = 0,
		previousTime = 0;
	const stop = () => {
		cancelAnimationFrame(frame);
		frame = 0;
		previousTime = 0;
	};
	const maximum = () =>
		Math.max(0, document.documentElement.scrollHeight - innerHeight);
	const blocked = () =>
		document.body.classList.contains("nav-open") ||
		document.body.classList.contains("modal-open") ||
		getComputedStyle(document.body).overflowY === "hidden";
	const step = (time) => {
		if (reduce.matches || blocked() || Math.abs(scrollY - lastWritten) > 3) {
			stop();
			return;
		}
		target = Math.max(0, Math.min(maximum(), target));
		const dt = previousTime ? Math.min(time - previousTime, 40) : 16;
		previousTime = time;
		const distance = target - scrollY;
		if (Math.abs(distance) < 1) {
			window.scrollTo({ top: target, behavior: "instant" });
			stop();
			return;
		}
		window.scrollTo({
			top:
				scrollY +
				Math.sign(distance) *
					Math.min(
						Math.abs(distance),
						Math.max(1, Math.abs(distance) * (1 - Math.exp(-dt / 110))),
					),
			behavior: "instant",
		});
		lastWritten = scrollY;
		frame = requestAnimationFrame(step);
	};
	window.addEventListener(
		"wheel",
		(event) => {
			if (
				event.defaultPrevented ||
				event.ctrlKey ||
				event.metaKey ||
				reduce.matches ||
				blocked() ||
				Math.abs(event.deltaX) > Math.abs(event.deltaY)
			) {
				stop();
				return;
			}
			// Let controls, overlays and components that scroll internally own their wheel input.
			for (
				let el = event.target instanceof Element ? event.target : null;
				el && el !== document.body;
				el = el.parentElement
			) {
				if (
					el.matches(
						'input,textarea,select,[role="dialog"],[data-native-scroll]',
					) ||
					(/(auto|scroll)/.test(getComputedStyle(el).overflowY) &&
						el.scrollHeight > el.clientHeight + 1)
				) {
					stop();
					return;
				}
			}
			if (!event.deltaY || !maximum()) return;
			if (!frame) target = scrollY;
			const delta =
				event.deltaY *
				(event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
			target = Math.max(0, Math.min(maximum(), target + delta));
			event.preventDefault();
			if (!frame) {
				lastWritten = scrollY;
				frame = requestAnimationFrame(step);
			}
		},
		{ passive: false },
	);
	["pointerdown", "touchstart", "keydown", "click"].forEach((type) =>
		window.addEventListener(type, stop, { passive: true, capture: true }),
	);
	document.addEventListener("visibilitychange", stop);
	reduce.addEventListener("change", stop);
})();

// Localised visual motion: a finite entrance plus scroll-driven portrait translation.
dxOnPageReady(() => {
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const portrait = document.querySelector(".dx-portfolio-hero > img");
	if (portrait) {
		const hero = portrait.closest(".dx-portfolio-hero");
		let frame = 0;
		const update = () => {
			frame = 0;
			const offset = reduced.matches
				? 0
				: Math.max(
						-100,
						Math.min(150, -hero.getBoundingClientRect().top * 0.16),
				  );
			portrait.style.setProperty("--portrait-parallax", offset + "px");
		};
		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		addEventListener("scroll", schedule, { passive: true });
		addEventListener("resize", schedule);
		reduced.addEventListener("change", schedule);
		update();
	}
	document.querySelectorAll(".league-chain-picker").forEach((picker) => {
		const label = picker.querySelector("[data-gyms-state-title]");
		if (!label) return;
		const animate = () => {
			label.classList.remove("is-underlining");
			requestAnimationFrame(() =>
				requestAnimationFrame(() => label.classList.add("is-underlining")),
			);
		};
		new MutationObserver(animate).observe(label, {
			childList: true,
			characterData: true,
			subtree: true,
		});
		animate();
	});
	const delivery = document.querySelector("[data-photo-express]");
	if (delivery) {
		const step = delivery.closest('[data-step="photography"]');
		const update = () => {
			step.querySelector(".dx-photo-price").textContent = delivery.checked
				? "£50"
				: "£40";
			const link = step.querySelector("[data-photo-book]");
			link.href =
				"/start-a-project/?enquiry_service=photography&photo_delivery=" +
				(delivery.checked ? "express" : "standard");
		};
		delivery.addEventListener("change", update);
		update();
	}
});

dxOnPageReady(() => {
	const accounts = [...document.querySelectorAll(".auth.dx-account-photo")];
	if (!accounts.length) return;
	const dateFormat = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Europe/London",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
	const timeFormat = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Europe/London",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hourCycle: "h23",
		timeZoneName: "shortOffset",
	});
	const sun = window.DX_LONDON_SUN || {};
	const days = new Map(Object.entries(sun.days || {}));
	const pending = new Set();
	// NOAA's daily solar equations provide an offline fallback for an unusually old cached page.
	const fallback = (key) => {
		const midnight = Date.parse(key + "T00:00:00Z"),
			date = new Date(midnight);
		const year = date.getUTCFullYear(),
			start = Date.UTC(year, 0, 1);
		const yearLength = (Date.UTC(year + 1, 0, 1) - start) / 86400000;
		const gamma =
			((2 * Math.PI) / yearLength) * ((midnight - start) / 86400000);
		const equation =
			229.18 *
			(0.000075 +
				0.001868 * Math.cos(gamma) -
				0.032077 * Math.sin(gamma) -
				0.014615 * Math.cos(2 * gamma) -
				0.040849 * Math.sin(2 * gamma));
		const dec =
			0.006918 -
			0.399912 * Math.cos(gamma) +
			0.070257 * Math.sin(gamma) -
			0.006758 * Math.cos(2 * gamma) +
			0.000907 * Math.sin(2 * gamma) -
			0.002697 * Math.cos(3 * gamma) +
			0.00148 * Math.sin(3 * gamma);
		const lat = (51.5074 * Math.PI) / 180;
		const event = (zenith, rising) => {
			const angle =
				(Math.acos(
					(Math.cos((zenith * Math.PI) / 180) - Math.sin(lat) * Math.sin(dec)) /
						(Math.cos(lat) * Math.cos(dec)),
				) *
					180) /
				Math.PI;
			return (
				midnight +
				(720 - 4 * (-0.1278 + (rising ? angle : -angle)) - equation) * 60000
			);
		};
		return {
			dawn: event(96, true),
			sunrise: event(90.833, true),
			sunset: event(90.833, false),
			dusk: event(96, false),
		};
	};
	const refresh = (key) => {
		if (pending.has(key) || !sun.endpoint) return;
		pending.add(key);
		fetch(sun.endpoint + "?date=" + encodeURIComponent(key), {
			credentials: "same-origin",
		})
			.then((r) => {
				if (!r.ok) throw new Error("Solar data unavailable");
				return r.json();
			})
			.then((data) => {
				if (data.date === key && data.events?.sunrise)
					days.set(key, data.events);
			})
			.catch(() => {})
			.finally(() => {
				setTimeout(() => pending.delete(key), 60000);
			});
	};
	accounts.forEach((auth) => {
		const graphic = auth.querySelector(".graphic-content");
		if (!graphic) return;
		const clock = document.createElement("div");
		clock.className = "dx-london-clock";
		clock.innerHTML =
			'<small>London · Current time</small><time><span class="dx-clock-time"></span><span class="dx-clock-zone"></span></time>';
		const conditions = document.createElement("div");
		conditions.className = "dx-london-conditions";
		conditions.append(clock);
		const weather = document.querySelector("#dx-london-weather-template");
		if (weather?.content) conditions.append(weather.content.cloneNode(true));
		graphic.append(conditions);
		const actions = auth.parentElement.querySelector(".auth-actions");
		if (actions) graphic.append(actions);
		graphic.querySelector("img")?.remove();
		const update = () => {
			const now = new Date(),
				parts = dateFormat.formatToParts(now);
			const part = (t) => parts.find((p) => p.type === t)?.value;
			const key = part("year") + "-" + part("month") + "-" + part("day");
			let events = days.get(key);
			if (!events) {
				events = fallback(key);
				refresh(key);
			}
			const stamp = now.getTime();
			auth.dataset.londonPeriod =
				stamp < events.dawn || stamp >= events.dusk
					? "night"
					: stamp < events.sunrise
					? "dawn"
					: stamp < events.sunset
					? "day"
					: "dusk";
			auth.dataset.solarDate = key;
			auth.dataset.solarSunrise = new Date(events.sunrise).toISOString();
			auth.dataset.solarSunset = new Date(events.sunset).toISOString();
			const formatted = timeFormat.formatToParts(now);
			clock.querySelector(".dx-clock-time").textContent = formatted
				.filter((p) => p.type !== "timeZoneName")
				.map((p) => p.value)
				.join("")
				.trim();
			clock.querySelector(".dx-clock-zone").textContent = (
				formatted.find((p) => p.type === "timeZoneName")?.value || "GMT"
			).replace(/^GMT$/, "GMT+0");
			clock.querySelector("time").dateTime = now.toISOString();
		};
		update();
		setInterval(update, 1000);
		document.addEventListener("visibilitychange", () => {
			if (!document.hidden) update();
		});
	});
});

dxOnPageReady(() => {
	const toggle = document.querySelector("[data-proposal-theme]");
	if (!toggle || toggle.dataset.bound) return;
	const apply = (light) => {
		document.body.classList.toggle("is-light", light);
		toggle.textContent = light ? "Dark mode" : "Light mode";
		toggle.setAttribute("aria-pressed", String(light));
	};
	try {
		apply(localStorage.getItem("dx-proposal-theme") === "light");
	} catch {}
	toggle.addEventListener("click", () => {
		const light = !document.body.classList.contains("is-light");
		apply(light);
		try {
			localStorage.setItem("dx-proposal-theme", light ? "light" : "dark");
		} catch {}
	});
});

dxOnPageReady(() => {
	const chapters = document.querySelectorAll(
		".dx-story-experience .story-chapter",
	);
	if (!chapters.length) return;
	const observer = new IntersectionObserver(
		(entries) =>
			entries.forEach((e) => {
				if (e.isIntersecting) {
					e.target.classList.add("is-visible");
					observer.unobserve(e.target);
				}
			}),
		{ threshold: 0.15 },
	);
	chapters.forEach((e) => observer.observe(e));
});

// A compact contents list makes longer diary entries easier to explore.
dxOnPageReady(() => {
	const story = document.querySelector(".dx-story-sample");
	if (!story) return;
	const chapters = [...story.querySelectorAll(".story-chapter")];
	if (!chapters.length) return;
	const nav = document.createElement("nav");
	nav.className = "dx-story-contents";
	nav.setAttribute("aria-label", "Journey chapters");
	chapters.forEach((chapter, i) => {
		chapter.id = "journey-chapter-" + (i + 1);
		const a = document.createElement("a");
		a.href = "#" + chapter.id;
		a.textContent =
			String(i + 1).padStart(2, "0") +
			" / " +
			(chapter.querySelector("h2")?.textContent || "Chapter");
		nav.append(a);
	});
	chapters[0].before(nav);
});

dxOnPageReady(() => {
	const n118 = document.querySelector(".dx-n118");
	if (n118) {
		const portrait = n118.querySelector(".dx-about-portrait img");
		if (portrait) {
			portrait.src =
				"/wp-content/themes/dxndre/assets/img/fitness-repaired.webp";
			portrait.removeAttribute("srcset");
		}
		n118.querySelectorAll(".dx-about-story-copy").forEach((copy) => {
			const children = Array.from(copy.children);
			let card;
			children.forEach((child) => {
				if (child.matches("a")) return;
				if (child.matches("h3") || !card || !copy.querySelector("h3")) {
					card = document.createElement("article");
					card.className = "dx-training-card";
					copy.insertBefore(card, child);
				}
				card.append(child);
			});
		});
		const slides = document.createElement("div");
		slides.className = "dx-n118-slides";
		slides.setAttribute("aria-hidden", "true");
		slides.dataset.galleryExpanded = "true";
		const galleryPhotos = [
			["/wp-content/uploads/2026/10/dxndre-route-n118-2-768x576.jpg", 0.24],
			["/wp-content/uploads/2026/01/on-the-gym-floor.jpeg", 0.24],
			["/wp-content/themes/dxndre/assets/img/n118-gym-mirrors.webp", 0.65],
			["/wp-content/themes/dxndre/assets/img/n118-night-bus.webp", 0.55],
			["/wp-content/themes/dxndre/assets/img/n118-sunset.webp", 0.7],
		];
		slides.style.setProperty(
			"--dx-n118-gallery-duration",
			`${galleryPhotos.length * 6}s`,
		);
		galleryPhotos.forEach(([src, opacity], index) => {
			const img = document.createElement("img");
			img.src = src;
			img.alt = "";
			img.decoding = "async";
			img.style.setProperty("--dx-n118-photo-opacity", opacity);
			img.style.animationDelay = `${index * 6 - 1.2}s`;
			slides.append(img);
		});
		n118.querySelector(".dx-about-hero").prepend(slides);
	}
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const observer = new IntersectionObserver(
		(entries) =>
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					observer.unobserve(entry.target);
				}
			}),
		{ threshold: 0.1 },
	);
	document
		.querySelectorAll(".dx-estimate-next-grid>div,.dx-training-card")
		.forEach((el, i) => {
			if (!reduced.matches) {
				el.classList.add("dx-reveal-ready");
				el.style.transitionDelay = (i % 4) * 90 + "ms";
				observer.observe(el);
			}
		});
	const teaser = document.querySelector("body.home .dx-n118-teaser");
	const photo = document.querySelector("body.home img.wp-image-1877");
	const section = photo?.closest("section");
	if (
		teaser &&
		photo &&
		section &&
		section.parentElement === teaser.parentElement
	) {
		const pair = document.createElement("div");
		pair.className = "dx-fitness-pair";
		section.before(pair);
		pair.append(section, teaser);
		const figure = document.createElement("figure");
		figure.className = "dx-shared-portrait";
		const sharedImage = photo.cloneNode(true);
		sharedImage.className = "";
		sharedImage.removeAttribute("style");
		figure.append(sharedImage);
		pair.append(figure);
		photo.style.visibility = "hidden";
		let frame = 0;
		function update() {
			frame = 0;
			const box = pair.getBoundingClientRect(),
				first = section.getBoundingClientRect(),
				height = figure.getBoundingClientRect().height;
			const start = Math.max(0, first.height - height - 70),
				end = Math.max(start, pair.offsetHeight - height);
			const position = Math.min(
				end,
				Math.max(start, innerHeight - box.top - height),
			);
			figure.style.top = position + "px";
			pair.classList.toggle(
				"is-fitness-colour",
				teaser.getBoundingClientRect().top < innerHeight * 0.65,
			);
		}
		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		addEventListener("scroll", schedule, { passive: true });
		addEventListener("resize", schedule);
		figure.querySelector("img").addEventListener("load", schedule);
		update();
	}
});

dxOnPageReady(() => {
	const teaser = document.querySelector(".dx-n118-teaser");
	if (teaser && !teaser.querySelector(".dx-waitlist-link")) {
		const link = document.createElement("a");
		link.className = "dx-cta dx-cta--outline dx-waitlist-link";
		link.href = "/fitness/n118-fitness/";
		link.textContent = "Join the waitlist ↗";
		teaser.append(link);
	}
	if (teaser && !teaser.querySelector(".dx-n118-actions")) {
		const actions = document.createElement("div");
		actions.className = "dx-n118-actions";
		const buttons = Array.from(teaser.children).filter((el) =>
			el.matches("a.dx-cta"),
		);
		if (buttons.length) {
			buttons[0].before(actions);
			buttons.forEach((button) => actions.append(button));
		}
	}
	const portrait = document.querySelector("body.home img.wp-image-1868");
	if (portrait && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
		portrait.classList.add("dx-personal-enter");
		const reveal = new IntersectionObserver(
			(entries) =>
				entries.forEach((e) => {
					if (e.isIntersecting) {
						portrait.classList.add("is-visible");
						reveal.disconnect();
					}
				}),
			{ threshold: 0.1 },
		);
		reveal.observe(portrait);
	}
});

dxOnPageReady(() => {
	const access = document.getElementById("recruiterAccessModal");
	if (access) document.body.append(access);
	const info = document.querySelector("#dxb-lightbox .dxb-lightbox-info");
	if (info && !info.querySelector(".dxb-lightbox-details")) {
		const details = document.createElement("div");
		details.className = "dxb-lightbox-details";
		Array.from(info.children)
			.filter((el) => !el.classList.contains("dxb-lightbox-nav"))
			.forEach((el) => details.append(el));
		info.prepend(details);
	}
});

dxOnPageReady(() => {
	const subject = new URLSearchParams(location.search).get("subject");
	if (
		location.pathname.replace(/\/$/, "") !== "/contact" ||
		!subject?.startsWith("N118 Fitness")
	)
		return;
	const topic = document.querySelector("#ff_3_dropdown");
	const message = document.querySelector("#ff_3_description");
	if (topic) {
		const fitness = Array.from(topic.options).find(
			(option) => option.textContent.trim() === "Fitness",
		);
		if (fitness) {
			topic.value = fitness.value;
			topic.dispatchEvent(new Event("change", { bubbles: true }));
		}
	}
	if (message && !message.value)
		message.value = subject.includes("waitlist")
			? "Please add me to the N118 Fitness waitlist and let me know when coaching becomes available."
			: "I would like to find out more about N118 Fitness coaching.";
});

// Scroll depth for the calculator frame; relative positioning keeps fixed dialogs in the viewport.
dxOnPageReady(() => {
	const calculator = document.querySelector(".pricing-calculator");
	if (!calculator) return;
	const frame = calculator.querySelector(".calculator-step-container");
	if (!frame) return;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	calculator.classList.add("dx-calculator-parallax");
	let scheduled = false;
	let visible = true;
	const paint = () => {
		scheduled = false;
		if (reduced.matches) {
			calculator.style.setProperty("--dx-calculator-drift", "0px");
			return;
		}
		if (!visible) return;
		const rect = calculator.getBoundingClientRect();
		const narrow = innerWidth < 768;
		const distance = -Math.max(0, scrollY) * (narrow ? 0.08 : 0.14);
		const drift = Math.max(narrow ? -100 : -180, Math.min(0, distance));
		calculator.style.setProperty(
			"--dx-calculator-drift",
			drift.toFixed(1) + "px",
		);
	};
	const schedule = () => {
		if (!scheduled) {
			scheduled = true;
			requestAnimationFrame(paint);
		}
	};
	const observer = new IntersectionObserver(
		(entries) => {
			visible = entries[0].isIntersecting;
			if (visible) schedule();
		},
		{ rootMargin: "150px" },
	);
	observer.observe(calculator);
	addEventListener("scroll", schedule, { passive: true });
	addEventListener("resize", schedule, { passive: true });
	reduced.addEventListener("change", schedule);
	paint();
});

dxOnPageReady(() => {
	initFaqMotion();
	initFooterScrollMotion();
	initN118PortraitMotion();
	initPhotoOrbit();
	initInstagramProfiles();
	initContactCanvas();
	initServicesHover();
	initServiceIndexMotion();
	initFitnessStory();
	initCalculatorExperience();
	initAccountSky();
	initPhotoWatermarks();
});

// October 26: local editorial and browsing refinements, kept in the theme entry.
dxOnPageReady(() => {
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const scoreTone = (value) => {
		if (
			value == null ||
			String(value).trim() === "" ||
			!Number.isFinite(Number(value))
		)
			return "#bbb";
		const n = Number(value) * 10;
		return (
			[
				[85, "#b9eaff"],
				[71, "#6ed9c5"],
				[57, "#82c995"],
				[43, "#e5a653"],
				[29, "#ef8585"],
				[15, "#d85b70"],
				[0, "#8c354b"],
			].find(([threshold]) => n >= threshold)?.[1] || "#bbb"
		);
	};
	const el = (tag, cls = "", text = "") => {
		const n = document.createElement(tag);
		n.className = cls;
		n.textContent = text;
		return n;
	};
	const reveal = new IntersectionObserver(
		(entries) =>
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					reveal.unobserve(entry.target);
				}
			}),
		{ threshold: 0.12 },
	);
	const watchReveal = (n) => {
		if (reduced.matches) n.classList.add("is-visible");
		else reveal.observe(n);
	};

	// Facilities remain readable with shape-based icons as well as status text.
	const icons = {
		gym: "M4 9v6m3-8v10m10-10v10m3-8v6M7 12h10",
		swim: "M3 18q3-3 6 0t6 0t6 0M3 22q3-3 6 0t6 0t6 0M6 13l5-5 4 3 4-1M15 5a2 2 0 1 0 0-.1",
		spa: "M7 13c-4 4 0 8 5 8s9-4 5-8M8 3c-3 4 3 4 0 8m5-8c-3 4 3 4 0 8m5-8c-3 4 3 4 0 8",
		cafe: "M4 8h13v8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Zm13 1h2a3 3 0 0 1 0 6h-2M7 2v3m5-3v3",
		parking: "M5 3h14v18H5Zm5 14V7h3a3 3 0 0 1 0 6h-3",
	};
	document.querySelectorAll(".gym-review-facility").forEach((card) => {
		const name = card.textContent.toLowerCase();
		const key = /swim|wet/.test(name)
			? "swim"
			: /spa|sauna/.test(name)
			? "spa"
			: /caf|club|work/.test(name)
			? "cafe"
			: /park/.test(name)
			? "parking"
			: "gym";
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("viewBox", "0 0 24 24");
		svg.setAttribute("class", "dx-facility-icon");
		svg.setAttribute("aria-hidden", "true");
		const path = document.createElementNS(svg.namespaceURI, "path");
		path.setAttribute("d", icons[key]);
		svg.append(path);
		card.prepend(svg);
	});

	// Table view shares the existing league's matching, sorting and full review links.
	const archive = document.querySelector(".is-premium-league");
	if (archive) {
		const switcher = archive.querySelector(".league-view-switch"),
			mosaic = archive.querySelector(".league-mosaic"),
			cards = [...archive.querySelectorAll("[data-gym-card]")];
		cards.forEach((card) => {
			const a = el("a", "league-row-read", "Read ↗");
			a.href = card.dataset.link;
			a.setAttribute("aria-label", `Read ${card.dataset.branchLabel} review`);
			card.append(a);
		});
		if (switcher && mosaic) {
			const tableButton = el("button", "", "Table");
			tableButton.type = "button";
			tableButton.setAttribute("aria-pressed", "false");
			switcher.append(tableButton);
			const host = el("div", "dx-league-table-scroll");
			host.tabIndex = 0;
			host.hidden = true;
			host.setAttribute("role", "region");
			host.setAttribute("aria-label", "Gym review table");
			mosaic.after(host);
			const tableCategories = [
				{ key: "gym", label: "Gym" },
				{ key: "swim", label: "Swimming & wetside" },
				{ key: "spa", label: "Spa / sauna" },
				{ key: "cafe", label: "Café / clubroom" },
				{ key: "clean", label: "Cleanliness & maintenance" },
				{ key: "parking", label: "Parking" },
			];
			const tableScore = (raw) => {
				if (raw === "unavailable") return { label: "Unavailable", value: null };
				if (raw === null || raw === undefined || (typeof raw === "string" && raw.trim() === "") || !["number", "string"].includes(typeof raw))
					return { label: "Not assessed", value: null };
				const value = Number(raw);
				return Number.isFinite(value) && value >= 0 && value <= 10
					? { label: `${value}/10`, value }
					: { label: "Not assessed", value: null };
			};
			const categoryName = (key, chain) => {
				if (key === "spa") return chain === "gymbox" ? "Sauna facilities" : "Spa retreat";
				if (key === "cafe") return chain === "davidlloyds" ? "Clubroom" : "Café & work area";
				return tableCategories.find((category) => category.key === key).label;
			};
			const renderTable = () => {
				if (!archive.classList.contains("is-table-view")) return;
				const table = el("table", "dx-league-table"),
					caption = el("caption", "", "Gym league — all category scores / current filters and sort order. Scroll across to explore.");
				table.append(caption);
				const head = el("thead"), tr = el("tr");
				["Rank", "Branch", "Chain / location", "Overall", ...tableCategories.map((category) => category.label), "Visited", "Review"].forEach((label) => {
					const th = el("th", "", label);
					th.scope = "col";
					tr.append(th);
				});
				head.append(tr);
				table.append(head);
				const body = el("tbody");
				[...mosaic.querySelectorAll("a.league-mosaic-tile")].forEach((tile) => {
					const card = cards.find((c) => c.dataset.link === tile.getAttribute("href") || c.dataset.link === tile.href);
					if (!card) return;
					const row = el("tr");
					row.append(el("td", "dx-table-rank", card.querySelector(".league-rank")?.textContent || "—"));
					const branch = el("th", "dx-table-branch", card.dataset.branchLabel);
					branch.scope = "row";
					row.append(branch);
					row.append(el("td", "dx-table-location", `${card.dataset.chainLabel} · ${card.querySelector(".dx-gym-card__subtitle")?.textContent.replace("📍", "").trim() || ""}`));
					const overall = el("td", "dx-table-score dx-table-overall", card.dataset.overallLabel);
					overall.style.setProperty("--score-tone", scoreTone(card.dataset.overall));
					row.append(overall);
					let scores = {};
					try { scores = JSON.parse(card.dataset.scoreStates || "{}"); } catch {}
					tableCategories.forEach(({ key }) => {
						const raw = Object.prototype.hasOwnProperty.call(scores, key) ? scores[key] : card.dataset[`${key}Score`];
						const score = tableScore(raw), name = categoryName(key, card.dataset.chain);
						const cell = el("td", score.value === null ? "dx-table-unassessed" : "dx-table-category", score.label);
						cell.setAttribute("aria-label", `${name}: ${score.label}`);
						cell.title = `${name}: ${score.label}`;
						if (score.value !== null) cell.style.setProperty("--score-tone", scoreTone(score.value));
						row.append(cell);
					});
					row.append(el("td", "dx-table-visited", card.dataset.visitedLabel || "—"));
					const td = el("td"), a = el("a", "", "Read ↗");
					a.href = card.dataset.link;
					a.setAttribute("aria-label", `Read ${card.dataset.branchLabel} review`);
					td.append(a);
					row.append(td);
					body.append(row);
				});
				table.append(body);
				host.replaceChildren(table);
			};
			tableButton.addEventListener("click", () => {
				[...switcher.querySelectorAll("button")]
					.find((b) => b.textContent === "Grid")
					?.click();
				archive.classList.add("is-table-view");
				host.hidden = false;
				switcher
					.querySelectorAll("button")
					.forEach((b) =>
						b.setAttribute("aria-pressed", String(b === tableButton)),
					);
				renderTable();
			});
			switcher.addEventListener("click", (event) => {
				const b = event.target.closest("button");
				if (b && b !== tableButton) {
					archive.classList.remove("is-table-view");
					host.hidden = true;
					tableButton.setAttribute("aria-pressed", "false");
				}
			});
			const observeTiles = () => {
				mosaic
					.querySelectorAll(".league-mosaic-tile:not(.dx-grid-reveal)")
					.forEach((n) => {
						n.classList.add("dx-grid-reveal");
						watchReveal(n);
					});
				renderTable();
			};
			new MutationObserver(observeTiles).observe(mosaic, { childList: true });
			observeTiles();
		}
	}

	// A compact swipe deck replaces mobile service disclosures; desktop tabs are preserved.
	const accordion = document.querySelector("body.home #servicesAccordion");
	if (accordion) {
		const wide = matchMedia("(min-width:992px)");
		const mobile = () => {
			accordion.classList.toggle("dx-mobile-services", !wide.matches);
			accordion.querySelectorAll(".accordion-button").forEach((button) => {
				if (!wide.matches) {
					button.setAttribute("aria-expanded", "true");
					button.tabIndex = -1;
				} else button.removeAttribute("tabindex");
			});
		};
		wide.addEventListener("change", mobile);
		mobile();
		accordion.addEventListener(
			"click",
			(event) => {
				if (!wide.matches && event.target.closest(".accordion-button")) {
					event.preventDefault();
					event.stopImmediatePropagation();
				}
			},
			true,
		);
	}
	const personal = [...document.querySelectorAll("body.home h3")].find((n) =>
		/Work Hard/.test(n.textContent),
	);
	if (personal) {
		personal.closest("section")?.classList.add("dx-personal-life");
		personal.closest(".wp-block-column")?.classList.add("dx-personal-copy");
	}
	document.querySelectorAll("h2,h3,.dx-private-gate__intro").forEach((h) => {
		const phrase = "The potential beyond it.";
		if (
			h.textContent.includes(phrase) &&
			!h.querySelector(".dx-gold-underline")
		) {
			const before = h.textContent.split(phrase)[0];
			h.replaceChildren(document.createTextNode(before));
			const span = el("span", "dx-gold-underline", phrase);
			h.append(span);
			watchReveal(span);
		}
	});
	const photoHeading = document.querySelector(".dx-photo-hero h1");
	if (photoHeading) {
		photoHeading.replaceChildren(
			document.createTextNode("Life through the "),
			el("span", "dx-lens-word", "lens."),
		);
	}
	document
		.querySelectorAll(
			".service-detail-form input:not([type=checkbox]):not([type=radio]):not([type=hidden]),.service-detail-form textarea",
		)
		.forEach((input) => {
			const label = input.id
				? document.querySelector(`label[for="${CSS.escape(input.id)}"]`)
				: null;
			if (label) {
				const name = label.textContent.trim().replace(/\s+/g, " ");
				input.placeholder = name;
				input.setAttribute("aria-label", name);
				label.classList.add("dx-placeholder-label");
			}
		});

	// Project photographs sit behind the existing, untouched portrait graphic.
	const portfolio = document.querySelector(".dx-portfolio-hero"),
		slides = window.DX_PROJECT_SLIDES;
	if (portfolio && Array.isArray(slides) && slides.length) {
		const layer = el("div", "dx-project-slides");
		layer.setAttribute("aria-hidden", "true");
		slides.forEach((photo, i) => {
			const image = el("img");
			image.src = photo.src;
			image.alt = "";
			image.decoding = "async";
			image.loading = i ? "lazy" : "eager";
			image.classList.toggle("is-active", i === 0);
			layer.append(image);
		});
		portfolio.prepend(layer);
		let index = 0,
			paused = reduced.matches;
		const toggle = el(
			"button",
			"dx-project-slides-toggle",
			paused ? "Play slideshow" : "Pause slideshow",
		);
		toggle.type = "button";
		toggle.setAttribute("aria-pressed", String(paused));
		toggle.addEventListener("click", () => {
			paused = !paused;
			toggle.textContent = paused ? "Play slideshow" : "Pause slideshow";
			toggle.setAttribute("aria-pressed", String(paused));
		});
		portfolio.append(toggle);
		setInterval(() => {
			if (paused || document.hidden) return;
			layer.children[index].classList.remove("is-active");
			index = (index + 1) % layer.children.length;
			layer.children[index].classList.add("is-active");
		}, 6500);
		reduced.addEventListener("change", () => {
			paused = reduced.matches;
			toggle.textContent = paused ? "Play slideshow" : "Pause slideshow";
			toggle.setAttribute("aria-pressed", String(paused));
		});
	}

	const calculator = document.querySelector(".pricing-calculator");
	if (calculator) {
		const monthly = () =>
			calculator.querySelector('input[name="service"][value="retainer"]')
				?.checked === true;
		const syncMonthly = () => {
			const active = monthly();
			calculator.dataset.monthlyRetainer = String(active);
			calculator
				.querySelectorAll("[data-open-payment]")
				.forEach((b) => (b.hidden = active));
			const dialog = calculator.querySelector(".dx-payment-dialog");
			if (active && dialog?.open) dialog.close();
			if (active) {
				const full = calculator.querySelector(
					'input[name="payment_plan"][value="full"]',
				);
				if (full && !full.checked) {
					full.checked = true;
					full.dispatchEvent(new Event("change", { bubbles: true }));
				}
			}
		};
		calculator.addEventListener("change", syncMonthly);
		calculator.addEventListener(
			"click",
			(event) => {
				if (monthly() && event.target.closest("[data-open-payment]")) {
					event.preventDefault();
					event.stopImmediatePropagation();
				}
			},
			true,
		);
		new MutationObserver(syncMonthly).observe(calculator, {
			attributes: true,
			attributeFilter: ["data-step"],
		});
		syncMonthly();
		const modal = calculator.querySelector(".email-quote-modal");
		if (modal) {
			const name = modal.querySelector("[name=name]"),
				email = modal.querySelector("[name=email]"),
				send = modal.querySelector(".send-email-confirm");
			const valid = () => {
				const okay =
					!!name?.value.trim() && !!email?.value.trim() && email.validity.valid;
				send?.classList.toggle("dx-invalid-details", !okay);
				return okay;
			};
			modal.addEventListener("input", valid);
			send?.addEventListener(
				"click",
				(event) => {
					if (!valid()) {
						event.preventDefault();
						event.stopImmediatePropagation();
						const field = !name.value.trim() ? name : email;
						field.reportValidity();
						field.focus();
					}
				},
				true,
			);
			valid();
		}
		let queued = false;
		const paint = () => {
			queued = false;
			const y = reduced.matches ? 0 : Math.max(0, scrollY);
			document
				.querySelector(".calculator-heading")
				?.style.setProperty(
					"--dx-pricing-drift",
					`${Math.min(180, y * 0.2)}px`,
				);
			const media =
				calculator.querySelector(".calculator-hero-media") ||
				document.querySelector(".calculator-hero-media");
			if (media) media.style.translate = `0 ${Math.min(400, y * 0.48)}px`;
		};
		const schedule = () => {
			if (!queued) {
				queued = true;
				requestAnimationFrame(paint);
			}
		};
		addEventListener("scroll", schedule, { passive: true });
		addEventListener("resize", schedule);
		reduced.addEventListener("change", schedule);
		paint();
	}
});

dxOnPageReady(() => {
	const deck = document.querySelector("#servicesAccordion");
	if (deck) {
		deck.setAttribute("role", "region");
		deck.setAttribute("aria-label", "Browse services");
		deck.querySelectorAll(".accordion-header").forEach((h) => {
			const b = h.querySelector("button");
			if (b && !h.querySelector(".dx-service-card-title")) {
				const title = document.createElement("span");
				title.className = "dx-service-card-title";
				title.textContent = b.textContent.trim();
				h.append(title);
				b.setAttribute("aria-hidden", "true");
			}
		});
		const hint = document.createElement("p");
		hint.className = "dx-services-swipe-hint";
		hint.textContent = "Swipe to explore services →";
		deck.before(hint);
	}
	const calc = document.querySelector(".pricing-calculator");
	if (calc) {
		const styleActions = () =>
			calc.querySelectorAll("button").forEach((b) => {
				if (
					/^(Compare packages|Add personalisation|Edit personalisation)$/i.test(
						b.textContent.trim(),
					)
				)
					b.classList.add("dx-padded-action");
			});
		new MutationObserver(styleActions).observe(calc, {
			childList: true,
			subtree: true,
		});
		styleActions();
	}
});

dxOnPageReady(() => {
	const personal = document.querySelector("body.home .dx-personal-life");
	const ticker = personal?.querySelector(":scope>.footline-ticker");
	if (ticker) personal.after(ticker);
	const bus = [...document.querySelectorAll("body.home h3")].find((h) =>
		h.textContent.includes("// BUSES"),
	);
	bus?.closest("section")?.classList.add("dx-bus-feature");
});

dxOnPageReady(() => {
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const menu = document.querySelector(".dx-menu__content");
	if (menu) {
		const title = menu.querySelector(".dx-menu__title");
		if (title) title.textContent = "Explore.";
		const home = [...menu.querySelectorAll(".dx-menu__list > li > a")].find(
			(a) => new URL(a.href, location.href).pathname === "/",
		);
		if (home) {
            home.setAttribute("aria-label", "Home");
            home.innerHTML = '<svg class="dx-home-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/></svg>';
        }
	}
	const cover = document.querySelector("body.home .cover-content");
	if (cover) {
		if (!cover.querySelector(".dx-cover-fitness")) {
			const line = document.createElement("p");
			line.className = "dx-cover-fitness";
			const link = document.createElement("a");
			link.href = "/n118-fitness/";
			link.textContent = "N118 Fitness / A new chapter in personal growth ↗";
			line.append(link);
			(cover.querySelector(".wp-block-group__inner-container") || cover).append(
				line,
			);
		}
		if (!reduced.matches) {
			const nodes = [
				...new Set(
					cover.querySelectorAll(
						".headline,h2,p,.button-container,.buttons-container,.wp-block-buttons",
					),
				),
			];
			nodes.forEach((node, i) =>
				node.animate(
					[
						{ opacity: 0, transform: "translate3d(0,24px,0)" },
						{ opacity: 1, transform: "translate3d(0,0,0)" },
					],
					{
						duration: 900,
						delay: 120 + i * 105,
						easing: "cubic-bezier(.22,1,.36,1)",
						fill: "both",
					},
				),
			);
		}
	}
	document
		.querySelectorAll('.service-detail-form button[type="submit"]')
		.forEach((button) => {
			if (button.querySelector(".dx-send-icon")) return;
			const ns = "http://www.w3.org/2000/svg",
				svg = document.createElementNS(ns, "svg"),
				path = document.createElementNS(ns, "path");
			svg.classList.add("dx-send-icon");
			svg.setAttribute("viewBox", "0 0 24 24");
			svg.setAttribute("aria-hidden", "true");
			svg.setAttribute("fill", "none");
			svg.setAttribute("stroke", "currentColor");
			svg.setAttribute("stroke-width", "1.5");
			path.setAttribute("d", "m3 10 18-7-7 18-4-7-7-4Zm7 4L21 3");
			svg.append(path);
			button.append(svg);
		});
});

// Review chapters change the full viewport canvas, matching the portfolio story treatment.
dxOnPageReady(() => {
	const review = document.querySelector('body.single-gym-review .gym-review-editorial');
	if (!review || review.dataset.canvasInitialised) return;
	review.dataset.canvasInitialised = 'true';
	const chapters = [...review.querySelectorAll(':scope > [data-gym-scene]')];
	const layers = [...review.querySelectorAll('[data-gym-canvas]')];
	if (!chapters.length || !layers.length) return;
	const nav = document.createElement('nav');
	nav.className = 'gym-review-chapters';
	nav.setAttribute('aria-label', 'Gym review chapters');
	const links = [];
	chapters.forEach((chapter, index) => {
		const label = chapter.dataset.gymChapter;
		if (!label) return;
		if (!chapter.id) chapter.id = `gym-review-chapter-${index + 1}`;
		const link = document.createElement('a');
		link.href = `#${chapter.id}`;
		link.setAttribute('aria-label', label);
		const text = document.createElement('span');
		text.textContent = label;
		link.append(text);
		link.addEventListener('click', (event) => {
			if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
			event.preventDefault();
			chapter.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
			history.replaceState(null, '', link.href);
		});
		nav.append(link);
		links.push({ chapter, link });
	});
	if (links.length) review.querySelector('.gym-review-canvas')?.after(nav);
	let frame = 0;
	let activeScene = '';
	const paint = () => {
		frame = 0;
		const readingLine = innerHeight * .42;
		let active = chapters[0];
		for (const chapter of chapters) {
			if (chapter.getBoundingClientRect().top <= readingLine) active = chapter;
			else break;
		}
		const scene = active.dataset.gymScene;
		if (scene !== activeScene) {
			activeScene = scene;
			layers.forEach((layer) => layer.classList.toggle('is-active', layer.dataset.gymCanvas === scene));
			review.dataset.activeScene = scene;
		}
		links.forEach(({ chapter, link }) => {
			if (chapter === active) link.setAttribute('aria-current', 'location');
			else link.removeAttribute('aria-current');
		});
		const bounds = review.getBoundingClientRect();
		nav.classList.toggle('is-outside-review', bounds.bottom < innerHeight * .25 || bounds.top > innerHeight * .75);
	};
	const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
	addEventListener('scroll', schedule, { passive: true });
	addEventListener('resize', schedule, { passive: true });
	addEventListener('pageshow', schedule);
	paint();
});


// The waterfront is fixed to the viewport and revealed only beside the next steps.
dxOnPageReady(() => {
	const section = document.querySelector("body.proposal .dx-estimate-next");
	if (!section || document.querySelector(".dx-proposal-waterfront")) return;
	const scene = document.createElement("div");
	scene.className = "dx-proposal-waterfront";
	scene.setAttribute("aria-hidden", "true");
	document.body.prepend(scene);
	document.body.classList.add("has-proposal-waterfront");
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	let frame = 0;
	const paint = () => {
		frame = 0;
		const rect = section.getBoundingClientRect();
		const visible = rect.top < innerHeight * 0.9 && rect.bottom > innerHeight * 0.12;
		scene.classList.toggle("is-visible", visible);
		const drift = reduced.matches ? 0 : Math.max(-28, Math.min(28, (innerHeight / 2 - (rect.top + rect.height / 2)) * 0.045));
		scene.style.setProperty("--waterfront-drift", `${drift.toFixed(2)}px`);
	};
	const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
	addEventListener("scroll", schedule, { passive: true });
	addEventListener("resize", schedule, { passive: true });
	addEventListener("pageshow", schedule);
	reduced.addEventListener("change", schedule);
	paint();
});


// Authenticated client workspace: saved colour preference and accessible navigation.
document.addEventListener('DOMContentLoaded', () => {
	const shell = document.querySelector('[data-dxcp-shell]');
	if (!shell) return;
	const root = document.documentElement;
	const colourPreference = matchMedia('(prefers-color-scheme: dark)');
	const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
	const themeButton = shell.querySelector('[data-dxcp-theme]');
	let chosenTheme = null;
	let themeTimer;
	try {
		const savedTheme = localStorage.getItem('dxcp-theme');
		if (savedTheme === 'light' || savedTheme === 'dark') chosenTheme = savedTheme;
	} catch (_) {
		// Cookie-backed preference remains available when browser storage is restricted.
	}
	if (!chosenTheme && ['light', 'dark'].includes(root.dataset.dxcpTheme)) chosenTheme = root.dataset.dxcpTheme;
	const applyTheme = (theme, save = false, animate = false) => {
		if (animate && !reducedMotion.matches) {
			clearTimeout(themeTimer);
			root.classList.add('dxcp-theme-changing');
			themeTimer = setTimeout(() => root.classList.remove('dxcp-theme-changing'), 450);
		}
		root.dataset.dxcpTheme = theme;
		if (themeButton) {
			const dark = theme === 'dark';
			themeButton.setAttribute('aria-pressed', String(dark));
			themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
			const label = themeButton.querySelector('[data-dxcp-theme-label]');
			if (label) label.textContent = `${dark ? 'Light' : 'Dark'} mode`;
		}
		if (!save) return;
		chosenTheme = theme;
		try {
			localStorage.setItem('dxcp-theme', theme);
		} catch (_) {
			// The preference cookie also prevents a colour flash on later requests.
		}
		document.cookie = `dxcp_theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
	};
	applyTheme(chosenTheme || (colourPreference.matches ? 'dark' : 'light'));
	themeButton?.addEventListener('click', () => applyTheme(root.dataset.dxcpTheme === 'dark' ? 'light' : 'dark', true, true));
	colourPreference.addEventListener('change', () => {
		if (!chosenTheme) applyTheme(colourPreference.matches ? 'dark' : 'light', false, true);
	});
	window.addEventListener('storage', (event) => {
		if (event.key !== 'dxcp-theme') return;
		chosenTheme = ['light', 'dark'].includes(event.newValue) ? event.newValue : null;
		applyTheme(chosenTheme || (colourPreference.matches ? 'dark' : 'light'), false, true);
	});

	const toggle = shell.querySelector('[data-dxcp-menu]');
	const sidebar = shell.querySelector('.dxcp-sidebar');
	const portalMobile = matchMedia('(width < 992px)');
	const setMenu = (open) => {
		const mobileOpen = portalMobile.matches && open;
		shell.classList.toggle('is-menu-open', mobileOpen);
		document.body.classList.toggle('dxcp-menu-open', mobileOpen);
		if (sidebar) {
			sidebar.inert = portalMobile.matches && !mobileOpen;
			if (portalMobile.matches) sidebar.setAttribute('aria-hidden', String(!mobileOpen));
			else sidebar.removeAttribute('aria-hidden');
		}
		toggle?.setAttribute('aria-expanded', String(mobileOpen));
		toggle?.setAttribute('aria-label', mobileOpen ? 'Close workspace menu' : 'Open workspace menu');
		if (mobileOpen) sidebar?.querySelector('[aria-current]')?.focus();
	};
	setMenu(false);
	portalMobile.addEventListener('change', () => setMenu(false));
	toggle?.addEventListener('click', () => setMenu(!shell.classList.contains('is-menu-open')));
	shell.querySelector('[data-dxcp-close]')?.addEventListener('click', () => {
		setMenu(false);
		toggle?.focus();
	});
	document.addEventListener('keydown', (event) => {
		if (!shell.classList.contains('is-menu-open') || !sidebar) return;
		if (event.key === 'Escape') {
			setMenu(false);
			toggle?.focus();
		}
		if (event.key === 'Tab') {
			const controls = [...sidebar.querySelectorAll('a[href], button:not([disabled])')].filter((item) => item.getClientRects().length);
			const first = controls[0];
			const last = controls.at(-1);
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last?.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first?.focus();
			}
		}
	});
	const selectView = (section, focus = true) => {
		const view = [...shell.querySelectorAll('[data-dxcp-view]')].find((item) => item.dataset.dxcpView === section);
		if (!view) return false;
		shell.querySelectorAll('.dxcp-notice:not(.dxcp-notice--demo)').forEach((notice) => { notice.hidden = true; });
		shell.querySelectorAll('[data-dxcp-view]').forEach((item) => { item.hidden = item !== view; });
		shell.querySelectorAll('[data-dxcp-nav]').forEach((item) => {
			if (item.dataset.dxcpNav === section) item.setAttribute('aria-current', 'page');
			else item.removeAttribute('aria-current');
		});
		const link = [...shell.querySelectorAll('[data-dxcp-nav]')].find((item) => item.dataset.dxcpNav === section);
		const breadcrumb = shell.querySelector('[data-dxcp-breadcrumb]');
		if (breadcrumb) breadcrumb.textContent = link?.querySelector('span')?.textContent || section;
		const context = shell.querySelector('.dxcp-project-switch input[name="section"]');
		if (context) context.value = section;
		setMenu(false);
		if (!reducedMotion.matches) view.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 250, easing: 'ease-out' });
		if (focus) view.focus({ preventScroll: true });
		return true;
	};
	shell.querySelectorAll('[data-dxcp-nav]').forEach((link) => link.addEventListener('click', (event) => {
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button) return;
		if (![...shell.querySelectorAll('[data-dxcp-view]')].some((view) => view.dataset.dxcpView === link.dataset.dxcpNav)) return;
		event.preventDefault();
		history.pushState({}, '', link.href);
		selectView(link.dataset.dxcpNav);
		window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
	}));
	window.addEventListener('popstate', () => selectView(new URL(location.href).searchParams.get('section') || 'overview'));
	const projectSelect = shell.querySelector('[data-dxcp-project]');
	if (projectSelect) {
		const projectGo = shell.querySelector('.dxcp-project-go');
		if (projectGo) projectGo.hidden = true;
		projectSelect.addEventListener('change', () => projectSelect.form.requestSubmit());
	}
	shell.querySelectorAll('form[method="post"]').forEach((form) => form.addEventListener('submit', (event) => {
		if (event.defaultPrevented) return;
		const button = event.submitter || form.querySelector('button[type="submit"]');
		if (!button) return;
		// Native submission still carries the selected submitter's action and value.
		setTimeout(() => {
			button.disabled = true;
			button.dataset.originalText = button.textContent;
			button.textContent = 'Saving…';
			form.setAttribute('aria-busy', 'true');
		}, 0);
	}));

	const search = shell.querySelector('[data-dxcp-ticket-search]');
	let filter = 'all';
	const applyTicketFilter = () => {
		const query = (search?.value || '').toLowerCase().trim();
		let visible = 0;
		shell.querySelectorAll('[data-dxcp-ticket-status]').forEach((row) => {
			const closed = ['resolved', 'cancelled'].includes(row.dataset.dxcpTicketStatus);
			row.hidden = !(filter === 'all' || (filter === 'closed' ? closed : !closed)) || !(row.dataset.dxcpTicketTitle || '').toLowerCase().includes(query);
			if (!row.hidden) visible++;
		});
		const empty = shell.querySelector('[data-dxcp-ticket-empty]');
		if (empty) empty.hidden = visible > 0;
	};
	search?.addEventListener('input', applyTicketFilter);
	shell.querySelectorAll('[data-dxcp-ticket-filter]').forEach((button) => button.addEventListener('click', () => {
		filter = button.dataset.dxcpTicketFilter;
		shell.querySelectorAll('[data-dxcp-ticket-filter]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
		applyTicketFilter();
	}));
});

window.addEventListener('pageshow', () => {
	document.querySelectorAll('[data-dxcp-shell] button[data-original-text]').forEach((button) => {
		button.disabled = false;
		button.textContent = button.dataset.originalText;
		button.form?.removeAttribute('aria-busy');
	});
});






// London greetings and clocks remain correct across daylight-saving changes.
dxOnPageReady(() => {
	const clocks = [...document.querySelectorAll('[data-dxcp-clock]')];
	const greetings = [...document.querySelectorAll('[data-dxcp-greeting]')];
	const dates = [...document.querySelectorAll('[data-dxcp-today]')];
	if (!clocks.length && !greetings.length && !dates.length) return;
	const time = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
	const hour = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: 'numeric', hourCycle: 'h23' });
	const date = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'long', day: 'numeric', month: 'long' });
	const iso = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' });
	const update = () => {
		const now = new Date();
		const londonHour = Number(hour.format(now));
		const greeting = londonHour < 12 ? 'Good morning' : londonHour < 18 ? 'Good afternoon' : 'Good evening';
		clocks.forEach((clock) => {
			clock.textContent = time.format(now);
			clock.dateTime = now.toISOString();
		});
		greetings.forEach((item) => {
			const name = item.dataset.dxcpName || '';
			item.textContent = `${greeting}${name ? `, ${name}` : ''}.`;
		});
		dates.forEach((item) => {
			item.textContent = date.format(now);
			const parts = iso.formatToParts(now);
			const part = (type) => parts.find((value) => value.type === type)?.value || '';
			item.dateTime = `${part('year')}-${part('month')}-${part('day')}`;
		});
	};
	update();
	setInterval(() => { if (!document.hidden) update(); }, 1000);
	document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
});

// Keep large attachments off the private upload path and offer a clear alternative.
dxOnPageReady(() => {
	document.querySelectorAll('input[type="file"][data-dxcp-max-size]').forEach((input) => {
		if (input.dataset.sizeBound) return;
		input.dataset.sizeBound = 'true';
		input.addEventListener('change', () => {
			const limit = Number(input.dataset.dxcpMaxSize);
			const tooLarge = [...(input.files || [])].some((file) => file.size > limit);
			const message = tooLarge ? 'Please choose a file under 5 MB, or paste a private cloud-storage link in your message.' : '';
			input.setCustomValidity(message);
			let hint = input.parentElement.querySelector('.dxcp-file-hint');
			if (!hint) {
				hint = document.createElement('span');
				hint.className = 'dxcp-file-hint';
				hint.setAttribute('role', 'status');
				input.after(hint);
			}
			hint.textContent = message;
			if (tooLarge) input.reportValidity();
		});
	});
});

// Business line editing enhances the native, server-validated form.
dxOnPageReady(() => {
	document.querySelectorAll('[data-dxbs-lines]').forEach((container) => {
		const form = container.closest('form');
		const template = form?.querySelector('[data-dxbs-line-template]');
		if (!form || !template || container.dataset.linesBound) return;
		container.dataset.linesBound = 'true';
		let nextIndex = 0;
		container.querySelectorAll('[name]').forEach((input) => {
			const indexes = [...input.name.matchAll(/\[(\d+)\]/g)].map((match) => Number(match[1]));
			if (indexes.length) nextIndex = Math.max(nextIndex, ...indexes.map((value) => value + 1));
		});
		form.addEventListener('click', (event) => {
			const add = event.target.closest('[data-dxbs-add-line]');
			const remove = event.target.closest('[data-dxbs-remove-line]');
			if (add) {
				event.preventDefault();
				const fragment = document.createElement('template');
				fragment.innerHTML = template.innerHTML.replaceAll('__INDEX__', String(nextIndex++));
				const firstInput = fragment.content.querySelector('input:not([type="hidden"]),select,textarea');
				container.append(fragment.content);
				firstInput?.focus();
			}
			if (remove) {
				event.preventDefault();
				const row = remove.closest('[data-dxbs-line], .dxbs-line');
				const rows = [...container.querySelectorAll('[data-dxbs-line], .dxbs-line')];
				if (!row || rows.length < 2) return;
				const focusRow = row.nextElementSibling || row.previousElementSibling;
				row.remove();
				focusRow?.querySelector('input:not([type="hidden"]),select,textarea')?.focus();
			}
		});
	});
	document.querySelectorAll('[data-dxbs-copy]').forEach((button) => {
		if (button.dataset.copyBound) return;
		button.dataset.copyBound = 'true';
		button.addEventListener('click', async () => {
			const value = button.dataset.dxbsCopy || button.value || '';
			if (!value) return;
			let status = button.parentElement.querySelector('.dxbs-copy-status');
			if (!status) {
				status = document.createElement('span');
				status.className = 'dxbs-copy-status';
				status.setAttribute('role', 'status');
				button.after(status);
			}
			try {
				if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(value);
				else {
					const copy = document.createElement('textarea');
					copy.value = value;
					copy.setAttribute('aria-label', 'Copy value');
					copy.style.cssText = 'position:fixed;left:-9999px;top:0';
					document.body.append(copy);
					copy.select();
					const copied = document.execCommand('copy');
					copy.remove();
					if (!copied) throw new Error('Copy unavailable');
				}
				status.textContent = 'Copied.';
			} catch (_) {
				status.textContent = 'Copy is unavailable. Select and copy the displayed value.';
			}
		});
	});
});

// The final rating gets a small, one-time reaction using the existing score bands.
dxOnPageReady(() => {
	const final = document.querySelector('.gym-review-final');
	const scoreElement = final?.querySelector('[data-overall-score]');
	if (!final || !scoreElement || final.dataset.reactionBound || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	final.dataset.reactionBound = 'true';
	const score = Number(scoreElement.dataset.overallScore);
	if (!Number.isFinite(score)) return;
	const reaction = score >= 85 ? '🏆' : score >= 71 ? '🔥' : score >= 57 ? '💪' : score >= 43 ? '🤔' : score >= 29 ? '😬' : score >= 15 ? '😖' : '💀';
	const burst = document.createElement('div');
	burst.className = 'gym-review-emoji-burst';
	burst.setAttribute('aria-hidden', 'true');
	for (let i = 0; i < 10; i++) {
		const emoji = document.createElement('span');
		emoji.textContent = reaction;
		const angle = i * Math.PI * .2;
		const distance = 110 + (i % 3) * 55;
		emoji.style.setProperty('--burst-x', `${Math.cos(angle) * distance}px`);
		emoji.style.setProperty('--burst-y', `${Math.sin(angle) * distance - 35}px`);
		emoji.style.setProperty('--burst-turn', `${(i % 2 ? -1 : 1) * (15 + i * 5)}deg`);
		emoji.style.setProperty('--burst-delay', `${i * 35}ms`);
		burst.append(emoji);
	}
	final.append(burst);
	if (!('IntersectionObserver' in window)) return;
	const observer = new IntersectionObserver((entries) => {
		if (!entries.some((entry) => entry.isIntersecting)) return;
		final.classList.add('is-celebrating');
		observer.disconnect();
	}, { threshold: .4 });
	observer.observe(final);
});

// Coaching calendar month navigation keeps native links as the no-JavaScript fallback.
dxOnPageReady(() => {
	document.querySelectorAll('[data-dxcp-calendar]').forEach((calendar) => {
		if (calendar.dataset.calendarBound) return;
		calendar.dataset.calendarBound = 'true';
		const body = calendar.querySelector('[data-dxcp-calendar-body]');
		const status = calendar.querySelector('[data-dxcp-calendar-status]');
		if (!body) return;
		let controller, revision = 0;
		const cancelPending = () => {
			revision++;
			controller?.abort();
			controller = undefined;
			calendar.removeAttribute('aria-busy');
			if (status?.textContent === 'Loading calendar…') status.textContent = '';
		};
		const loadMonth = async (month, href, historyMode = 'push') => {
			if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return;
			controller?.abort();
			controller = new AbortController();
			const token = ++revision;
			const focusLabel = document.activeElement?.getAttribute('aria-label');
			calendar.setAttribute('aria-busy', 'true');
			if (status) status.textContent = 'Loading calendar…';
			try {
				const url = new URL(calendar.dataset.calendarUrl, location.href);
				if (url.origin !== location.origin) throw new Error('Calendar address is unavailable.');
				url.searchParams.set('action', 'dxcp_calendar_month');
				url.searchParams.set('project_id', calendar.dataset.projectId);
				url.searchParams.set('month', month);
				url.searchParams.set('_ajax_nonce', calendar.dataset.calendarNonce);
				const response = await fetch(url, { credentials: 'same-origin', signal: controller.signal, headers: { Accept: 'application/json' } });
				const payload = await response.json();
				if (!response.ok || payload.success === false) throw new Error(payload.data?.message || 'The calendar could not be loaded. Try again.');
				const data = payload.data || payload;
				if (token !== revision) return;
				if (typeof data.html !== 'string' || data.month !== month) throw new Error('The calendar response was incomplete. Try again.');
				body.innerHTML = data.html;
				calendar.dataset.calendarMonth = month;
				if (data.nonce) calendar.dataset.calendarNonce = data.nonce;
				if (status) status.textContent = `${data.label || month} calendar loaded.`;
				const nextURL = new URL(href || location.href, location.href);
				nextURL.searchParams.set('month', month);
				if (historyMode === 'push') history.pushState({ dxcpCalendar: true }, '', nextURL);
				if (focusLabel) [...body.querySelectorAll('[aria-label]')].find((el) => el.getAttribute('aria-label') === focusLabel)?.focus({ preventScroll: true });
			} catch (error) {
				if (error.name !== 'AbortError' && token === revision && status) status.textContent = `${error.message} Your current calendar is still shown.`;
			} finally {
				if (token === revision) calendar.removeAttribute('aria-busy');
			}
		};
		calendar.addEventListener('click', (event) => {
			const link = event.target.closest('a[data-dxcp-calendar-month]');
			if (!link || event.defaultPrevented || event.button > 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
			event.preventDefault();
			loadMonth(link.dataset.dxcpCalendarMonth, link.href);
		});
		window.addEventListener('popstate', () => {
			cancelPending();
			const url = new URL(location.href);
			if (url.searchParams.get('section') !== 'sessions' || url.searchParams.get('project_id') !== calendar.dataset.projectId) return;
			const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit' }).formatToParts(new Date()).map((part) => [part.type, part.value]));
			const month = url.searchParams.get('month') || `${parts.year}-${parts.month}`;
			if (month !== calendar.dataset.calendarMonth) loadMonth(month, url.href, 'none');
		});
		window.addEventListener('pagehide', cancelPending);
	});
});

// Intentional homepage journeys progressively enhance real links.
dxOnPageReady(() => {
	const paths = document.querySelector('[data-home-paths]');
	const reduced = matchMedia('(prefers-reduced-motion: reduce)');
	if (paths) {
		const choose = (focus, update = true) => {
			const panel = paths.querySelector(`[data-home-panel="${focus}"]`);
			if (!panel) return;
			paths.dataset.focus = focus;
			paths.querySelectorAll('[data-home-choice]').forEach(link => {
				if (link.dataset.homeChoice === focus) link.setAttribute('aria-current', 'true');
				else link.removeAttribute('aria-current');
			});
			paths.querySelectorAll('[data-home-panel]').forEach(item => { item.hidden = item !== panel; });
			if (!reduced.matches && update) panel.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 450, easing: 'cubic-bezier(.22,1,.36,1)' });
			if (update) { const url = new URL(location.href); url.searchParams.set('focus', focus); url.hash = 'start-here'; history.replaceState(null, '', url); }
		};
		choose(paths.querySelector('[aria-current]')?.dataset.homeChoice || 'web', false);
		paths.addEventListener('click', event => { const link = event.target.closest('[data-home-choice]'); if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button) return; event.preventDefault(); choose(link.dataset.homeChoice); });
		const cover = document.querySelector('body.home .cover-content');
		if (cover && !cover.querySelector('.dx-home-paths-jump')) {
			const link = document.createElement('a'); link.href = '#start-here'; link.className = 'service-text-link dx-home-paths-jump'; link.textContent = 'Web, fitness or photography? Start here ↓'; (cover.querySelector('.wp-block-group__inner-container') || cover).append(link);
		}
	}
	document.querySelectorAll('.dx-menu__list > li > a').forEach(link => {
		const path = new URL(link.href, location.href).pathname;
		if (/^\/buses(?:\/|$)/.test(path)) link.dataset.menuArea = 'buses';
		if (/^\/(?:fitness|n118-fitness)(?:\/|$)/.test(path)) link.dataset.menuArea = 'fitness';
	});
	const heading = [...document.querySelectorAll('body.home h3')].find(item => item.textContent.includes('Design, Development and Ongoing Support'));
	heading?.classList.add('dx-home-services-heading');
	if (!reduced.matches && 'IntersectionObserver' in window) {
		const steps = [...document.querySelectorAll('.dx-process-card, .process-step, .service-process .service-step, .service-detail-process li')];
		const observer = new IntersectionObserver(entries => entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			const index = [...entry.target.parentElement.children].indexOf(entry.target);
			entry.target.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 800, delay: index * 120, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
			observer.unobserve(entry.target);
		}), { threshold: .2 });
		steps.forEach(step => observer.observe(step));
	}
});
