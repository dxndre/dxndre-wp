/** One state machine coordinates the diary, geography and optional playback. */
(() => {
	const ready = (callback) =>
		document.readyState === "loading"
			? document.addEventListener("DOMContentLoaded", callback, {
					once: true,
			  })
			: callback();
	const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
	const distance = (a, b) => {
		const rad = Math.PI / 180,
			y = Math.sin(((b[0] - a[0]) * rad) / 2),
			x = Math.sin(((b[1] - a[1]) * rad) / 2);
		return (
			12742000 *
			Math.asin(
				Math.min(
					1,
					Math.sqrt(
						y * y +
							Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * x * x,
					),
				),
			)
		);
	};
	const pointValid = (point) =>
		point &&
		point.every(Number.isFinite) &&
		Math.abs(point[0]) <= 90 &&
		Math.abs(point[1]) <= 180;
	const make = (tag, className, content) => {
		const node = document.createElement(tag);
		if (className) node.className = className;
		if (content) node.textContent = content;
		return node;
	};
	ready(() => {
		document.querySelectorAll("[data-dx-journey]").forEach((root) => {
			if (root.dataset.engineBound) return;
			root.dataset.engineBound = "true";
			let data;
			try {
				data = JSON.parse(
					root.querySelector("[data-dxj-data]").textContent,
				);
			} catch (_) {
				return;
			}
			if (!data.chapters?.length) return;
			const $ = (selector) => root.querySelector(selector),
				$$ = (selector) => [...root.querySelectorAll(selector)];
			const chapters = data.chapters,
				steps = $$("[data-dxj-step]"),
				stage = $(".dxj-stage"),
				host = $("[data-dxj-map]");
			const motion = matchMedia("(prefers-reduced-motion: reduce)"),
				mobile = matchMedia("(max-width: 767.98px)");
			const state = {
				index: -1,
				mode: "guided",
				playing: false,
				follow: false,
				passenger: false,
				presenting: false,
				position: 0,
				visited: new Set(),
				photos: new Set(),
			};
			const controlLayer = make("div", "dxj-floating-controls");
			[
				".dxj-map-toolbar",
				".dxj-playback",
				".dxj-filmstrip",
				".dxj-location-sheet",
				".dxj-exit-presentation",
			].forEach((selector) => {
				const node = $(selector);
				if (node) controlLayer.append(node);
			});
			root.append(controlLayer);
			const updateControls = () => {
				const rect = stage.getBoundingClientRect(),
					experience = $(".dxj-experience").getBoundingClientRect();
				const visible =
					state.presenting ||
					(rect.top < innerHeight - 35 &&
						rect.bottom > 0 &&
						experience.bottom > 80);
				controlLayer.classList.toggle("is-visible", visible);
				controlLayer.style.top = `${state.presenting ? 0 : rect.top}px`;
				controlLayer.style.height = `${
					state.presenting ? innerHeight : rect.height
				}px`;
				document.body.classList.toggle("dxj-stage-visible", visible);
			};
			let map,
				L,
				routeLayer,
				completed,
				travelling,
				annotations,
				stopsLayer,
				vehiclesLayer,
				routePaths = [],
				mainPath = [],
				lengths = [],
				total = 0,
				projection = [],
				markers = [];
			let playbackTimer = 0,
				playbackStart = 0,
				mapFrame = 0,
				positionFrame = 0,
				scrollFrame = 0,
				scrollLockUntil = 0,
				busTimer = 0,
				busVersion = 0,
				busesOn = false,
				mapLoading = false,
				destroyed = false,
				previousFocus,
				photoVersion = 0,
				passengerVersion = 0;
			const controllers = new Set(),
				cleanups = [],
				cacheKey = `dx.journey.progress.v1:${data.id}`;
			let saved = null;
			try {
				saved = JSON.parse(localStorage.getItem(cacheKey));
				if (saved?.visited)
					saved.visited
						.filter((id) =>
							chapters.some((chapter) => chapter.id === id),
						)
						.forEach((id) => state.visited.add(id));
				if (saved?.photos)
					saved.photos
						.slice(0, 100)
						.forEach((id) => state.photos.add(id));
			} catch (_) {
				/* Storage is optional. */
			}
			const listen = (node, event, callback, options) => {
				node?.addEventListener(event, callback, options);
				cleanups.push(() =>
					node?.removeEventListener(event, callback, options),
				);
			};
			const save = () => {
				try {
					localStorage.setItem(
						cacheKey,
						JSON.stringify({
							index: chapters[state.index]?.id,
							visited: [...state.visited],
							photos: [...state.photos],
						}),
					);
				} catch (_) {
					/* Private browsing retains session state. */
				}
			};
			const announce = (message) => {
				$("[data-dxj-status]").textContent = message;
			};
			const stopPlayback = () => {
				clearTimeout(playbackTimer);
				playbackTimer = 0;
				state.playing = false;
				$("[data-dxj-play]").textContent = "Play journey";
				$("[data-dxj-play]").setAttribute("aria-pressed", "false");
				$("[data-dxj-exit-play]").hidden = true;
				root.classList.remove("is-playing");
			};
			const api = async (path) => {
				const controller = new AbortController();
				controllers.add(controller);
				const timeout = setTimeout(() => controller.abort(), 18000);
				try {
					const response = await fetch(new URL(path, data.api), {
						credentials: "same-origin",
						signal: controller.signal,
					});
					if (!response.ok)
						throw new Error(
							"Route data is temporarily unavailable.",
						);
					return await response.json();
				} finally {
					clearTimeout(timeout);
					controllers.delete(controller);
				}
			};
			const nearest = (point) => {
				if (!mainPath.length || !pointValid(point)) return null;
				let best = null;
				for (let index = 0; index < mainPath.length - 1; index++) {
					const a = mainPath[index],
						b = mainPath[index + 1],
						scale = Math.cos((point[0] * Math.PI) / 180);
					const dx = (b[1] - a[1]) * scale,
						dy = b[0] - a[0],
						length = dx * dx + dy * dy;
					const fraction = length
						? clamp(
								((point[1] - a[1]) * scale * dx +
									(point[0] - a[0]) * dy) /
									length,
								0,
								1,
						  )
						: 0;
					const candidate = [
							a[0] + (b[0] - a[0]) * fraction,
							a[1] + (b[1] - a[1]) * fraction,
						],
						gap = distance(point, candidate);
					if (!best || gap < best.gap)
						best = {
							point: candidate,
							gap,
							along:
								lengths[index] +
								(lengths[index + 1] - lengths[index]) *
									fraction,
						};
				}
				return best;
			};
			const atDistance = (along) => {
				if (!mainPath.length) return null;
				along = clamp(along, 0, total);
				let index = 1;
				while (index < lengths.length - 1 && lengths[index] < along)
					index++;
				const fraction =
						(along - lengths[index - 1]) /
						(lengths[index] - lengths[index - 1] || 1),
					a = mainPath[index - 1],
					b = mainPath[index];
				return {
					point: [
						a[0] + (b[0] - a[0]) * fraction,
						a[1] + (b[1] - a[1]) * fraction,
					],
					index,
					angle:
						(Math.atan2(
							(b[1] - a[1]) * Math.cos((a[0] * Math.PI) / 180),
							b[0] - a[0],
						) *
							180) /
						Math.PI,
				};
			};
			const svgPath = (points, width, height) => {
				if (!points.length) return "";
				const xs = points.map((point) => point[1]),
					ys = points.map((point) => -point[0]),
					minX = Math.min(...xs),
					minY = Math.min(...ys),
					sx = Math.max(...xs) - minX || 1,
					sy = Math.max(...ys) - minY || 1;
				const scale = Math.min((width - 24) / sx, (height - 24) / sy),
					left = (width - sx * scale) / 2,
					top = (height - sy * scale) / 2;
				return points
					.map(
						(point, index) =>
							`${index ? "L" : "M"}${(
								left +
								(point[1] - minX) * scale
							).toFixed(1)},${(
								top +
								(-point[0] - minY) * scale
							).toFixed(1)}`,
					)
					.join(" ");
			};
			const drawPosition = (along, camera = false) => {
				state.position = along;
				const current = atDistance(along);
				if (!current) return;
				const origin = atDistance(projection[0]?.along || 0);
				if (origin) {
					const lo = Math.min(origin.index, current.index),
						hi = Math.max(origin.index, current.index);
					completed?.setLatLngs([
						origin.point,
						...mainPath.slice(lo, hi),
						current.point,
					]);
				}
				travelling?.setLatLng(current.point);
				const arrow = travelling?.getElement()?.querySelector("svg");
				if (arrow)
					arrow.style.transform = `rotate(${current.angle}deg)`;
				if (
					camera &&
					state.playing &&
					state.follow &&
					state.mode === "guided"
				)
					map?.panTo(current.point, { animate: false });
				host.dataset.routeProgress = total
					? (along / total).toFixed(4)
					: "0";
				root.style.setProperty(
					"--dxj-route-progress",
					`${total ? (along / total) * 100 : 0}%`,
				);
			};
			const movePosition = (target) => {
				cancelAnimationFrame(positionFrame);
				const start = state.position,
					started = performance.now(),
					duration = motion.matches
						? 0
						: Math.min(
								1600,
								chapters[state.index].transition * 1000,
						  );
				const tick = (now) => {
					if (destroyed) return;
					const progress = duration
						? clamp((now - started) / duration, 0, 1)
						: 1;
					drawPosition(
						start + (target - start) * (1 - (1 - progress) ** 3),
					);
					if (progress < 1)
						positionFrame = requestAnimationFrame(tick);
				};
				positionFrame = requestAnimationFrame(tick);
			};
			const overview = () => {
				if (!map || !routePaths.length) return;
				map.stop();
				map.fitBounds(routePaths.flat(), {
					paddingTopLeft: mobile.matches
						? [25, 80]
						: [Math.min(innerWidth * 0.38, 500), 70],
					paddingBottomRight: [35, mobile.matches ? 90 : 170],
					animate: !motion.matches,
					duration: 0.9,
				});
			};
			const moveCamera = () => {
				if (!map || state.mode !== "guided") return;
				const chapter = chapters[state.index],
					point = pointValid([chapter.lat, chapter.lng])
						? [chapter.lat, chapter.lng]
						: projection[state.index]?.point;
				map.stop();
				if (chapter.type === "overview" || !point) {
					overview();
					return;
				}
				const offset = mobile.matches
					? [0, 0]
					: [
							innerWidth *
								(chapter.placement === "right" ? -0.17 : 0.17),
							0,
					  ];
				const zoom = Math.min(chapter.zoom || 14, 18),
					projected = map.project(point, zoom).subtract(offset),
					centre = map.unproject(projected, zoom);
				if (
					map.getCenter().distanceTo(centre) < 15 &&
					Math.abs(map.getZoom() - zoom) < 0.1
				)
					return;
				if (motion.matches) map.setView(centre, zoom);
				else
					map.flyTo(centre, zoom, {
						duration: clamp(chapter.transition, 0.2, 4),
					});
			};
			const renderAnnotations = () => {
				if (!annotations || !map) return;
				annotations.clearLayers();
				const candidates = chapters
					.map((chapter, index) => ({ chapter, index }))
					.filter(
						({ chapter, index }) =>
							chapter.annotation &&
							pointValid([chapter.lat, chapter.lng]) &&
							(state.mode === "explore"
								? map.getZoom() >= 13
								: Math.abs(index - state.index) <= 1),
					)
					.sort((a, b) => b.chapter.priority - a.chapter.priority);
				const occupied = [];
				candidates.slice(0, 10).forEach(({ chapter, index }) => {
					const point = map.latLngToContainerPoint([
						chapter.lat,
						chapter.lng,
					]);
					if (occupied.some((other) => other.distanceTo(point) < 140))
						return;
					occupied.push(point);
					const marker = L.circleMarker([chapter.lat, chapter.lng], {
						radius: 3,
						color: "#d7ad57",
						weight: 1,
					}).addTo(annotations);
					marker.bindTooltip(make("span", "", chapter.annotation), {
						permanent: true,
						direction: "right",
						className: "dxj-annotation",
					});
					marker.on("click", () => go(index));
				});
			};
			const recap = () => {
				const count = state.visited.size,
					complete = count === chapters.length;
				$("[data-dxj-recap-status]").textContent = `${count} of ${
					chapters.length
				} chapters explored${
					complete
						? " · narrative complete"
						: " · your viewed moments"
				}. ${state.photos.size} photographs opened.`;
				root.dataset.narrativeComplete = String(complete);
			};
			const setPassenger = (enabled, chapter = chapters[state.index]) => {
				const version = ++passengerVersion;
				if (
					enabled &&
					state.passenger &&
					chapter?.image &&
					$("[data-dxj-passenger-image]").getAttribute("src") ===
						chapter.image.src
				)
					return;
				state.passenger = false;
				root.classList.remove("is-passenger");
				$(".dxj-passenger").setAttribute("aria-hidden", "true");
				if (!enabled || !chapter?.image) return;
				const image = $("[data-dxj-passenger-image]");
				image.src = chapter.image.src;
				image.srcset = chapter.image.srcset || "";
				image.alt = chapter.image.alt;
				image.style.objectPosition = `50% ${chapter.focal}%`;
				$("[data-dxj-passenger-caption]").textContent = `${
					chapter.location || data.route
				} · ${chapter.title}`;
				const reveal = () => {
					if (version !== passengerVersion || destroyed) return;
					state.passenger = true;
					root.classList.add("is-passenger");
					$(".dxj-passenger").setAttribute("aria-hidden", "false");
				};
				if (image.decode)
					image
						.decode()
						.then(reveal)
						.catch(() => {
							if (version === passengerVersion)
								announce(
									"The photograph is unavailable. The map and story remain available.",
								);
						});
				else if (image.complete && image.naturalWidth) reveal();
				else image.addEventListener("load", reveal, { once: true });
			};
			const render = (source) => {
				const chapter = chapters[state.index];
				if (!chapter) return;
				if (state.playing) {
					state.follow = state.followChoice ?? chapter.follow;
					$("[data-dxj-follow]").setAttribute(
						"aria-pressed",
						String(state.follow),
					);
				}
				root.dataset.activeChapter = chapter.id;
				root.dataset.mode = state.mode;
				root.dataset.environment = chapter.environment;
				const palettes = [
					["#562827", "#1b3540"],
					["#263b50", "#29483e"],
					["#573442", "#483c29"],
					["#2c3b47", "#353951"],
				];
				const environments = {
					morning: ["#63533c", "#284c55"],
					day: ["#494b36", "#2c4a52"],
					golden: ["#713e28", "#492c3d"],
					evening: ["#63342e", "#3a2d4a"],
					night: ["#263455", "#1b2438"],
					overcast: ["#36474d", "#25333b"],
					rain: ["#36474d", "#25333b"],
				};
				const atmosphere =
					environments[chapter.environment] ||
					palettes[state.index % palettes.length];
				root.style.setProperty("--dxj-warm", atmosphere[0]);
				root.style.setProperty("--dxj-cool", atmosphere[1]);
				root.dataset.chapterType = chapter.type;
				steps.forEach((step, index) =>
					step.classList.toggle("is-active", index === state.index),
				);
				$$("[data-dxj-go]").forEach((button) => {
					const index = Number(button.dataset.dxjGo),
						current = index === state.index;
					button.classList.toggle(
						"is-completed",
						state.visited.has(chapters[index]?.id),
					);
					if (current) button.setAttribute("aria-current", "step");
					else button.removeAttribute("aria-current");
				});
				$$("[data-dxj-mode]").forEach((button) =>
					button.setAttribute(
						"aria-pressed",
						String(button.dataset.dxjMode === state.mode),
					),
				);
				$("[data-dxj-counter]").textContent = `${String(
					state.index + 1,
				).padStart(2, "0")} / ${String(chapters.length).padStart(
					2,
					"0",
				)}`;
				$("[data-dxj-prev]").disabled = state.index === 0;
				$("[data-dxj-next]").disabled =
					state.index === chapters.length - 1;
				markers.forEach(({ marker, index }) => {
					const element = marker.getElement();
					element?.classList.toggle(
						"is-active",
						index === state.index,
					);
					element?.classList.toggle(
						"is-completed",
						state.visited.has(chapters[index]?.id),
					);
				});
				setPassenger(
					state.mode === "guided" &&
						(chapter.passenger || chapter.type === "photography") &&
						Boolean(chapter.image),
				);
				if (
					projection[state.index] &&
					!state.playing &&
					state.mode === "guided"
				)
					movePosition(projection[state.index].along);
				if (
					source !== "map" &&
					!(source === "map-ready" && !state.visited.size)
				)
					moveCamera();
				renderAnnotations();
				recap();
				if (!["initial", "map-ready"].includes(source)) save();
				const film = $(`.dxj-filmstrip [data-dxj-go="${state.index}"]`);
				if (film)
					$(".dxj-filmstrip").scrollTo({
						left: Math.max(
							0,
							film.offsetLeft -
								$(".dxj-filmstrip").clientWidth / 2 +
								film.clientWidth / 2,
						),
						behavior: motion.matches ? "auto" : "smooth",
					});
			};
			const activate = (index, source = "scroll") => {
				index = clamp(index, 0, chapters.length - 1);
				if (state.index === index) {
					if (
						source !== "initial" &&
						steps[index].getBoundingClientRect().top < innerHeight
					) {
						const newlyVisited = !state.visited.has(
							chapters[index].id,
						);
						state.visited.add(chapters[index].id);
						if (newlyVisited) render(source);
						recap();
						save();
					}
					return;
				}
				state.index = index;
				if (source !== "initial") state.visited.add(chapters[index].id);
				render(source);
				if (state.playing) schedulePlayback();
			};
			const scrollToChapter = (index) => {
				if (state.presenting) return;
				scrollLockUntil =
					performance.now() + (motion.matches ? 80 : 1200);
				const step = steps[index],
					headerHeight =
						Number.parseFloat(
							getComputedStyle(root).getPropertyValue(
								"--dxj-header",
							),
						) || 0;
				const visibleHeader = Math.max(
					0,
					document.querySelector("#header")?.getBoundingClientRect()
						.bottom || 0,
				);
				const clearance = mobile.matches
					? visibleHeader + stage.clientHeight + 12
					: visibleHeader;
				window.scrollTo({
					top: Math.max(
						0,
						scrollY + step.getBoundingClientRect().top - clearance,
					),
					behavior: motion.matches ? "instant" : "smooth",
				});
			};
			const go = (index, options = {}) => {
				if (!options.playback) stopPlayback();
				if (state.mode === "explore") state.mode = "guided";
				const previousIndex = state.index;
				activate(index, options.source || "navigation");
				if (previousIndex === state.index) {
					render(options.source || "navigation");
					if (state.playing) schedulePlayback();
				}
				scrollToChapter(state.index);
				if (options.history !== false)
					history.pushState(
						{ dxJourney: data.id },
						"",
						`#${encodeURIComponent(chapters[state.index].id)}`,
					);
				if (!options.playback)
					announce(
						`Chapter ${state.index + 1}: ${
							chapters[state.index].title
						}`,
					);
			};
			const setMode = (mode, fit = true) => {
				stopPlayback();
				if (mode === "explore" && state.mode === "guided")
					state.guidedPosition = state.position;
				state.mode = mode === "explore" ? "explore" : "guided";
				if (state.mode === "explore") state.followChoice = false;
				state.follow = false;
				$("[data-dxj-follow]").setAttribute("aria-pressed", "false");
				setPassenger(false);
				render("mode");
				if (state.mode === "explore") {
					if (fit) overview();
					$(".dxj-location-sheet").hidden = true;
				} else {
					if (Number.isFinite(state.guidedPosition)) {
						cancelAnimationFrame(positionFrame);
						drawPosition(state.guidedPosition);
					}
					scrollToChapter(state.index);
				}
			};
			const schedulePlayback = () => {
				clearTimeout(playbackTimer);
				if (!state.playing || destroyed) return;
				playbackStart = performance.now();
				const duration = chapters[state.index].duration * 1000;
				const next = projection[state.index + 1],
					current = projection[state.index];
				if (current && next) {
					cancelAnimationFrame(positionFrame);
					const tick = (now) => {
						if (!state.playing || destroyed) return;
						const fraction = clamp(
							(now - playbackStart) / duration,
							0,
							1,
						);
						drawPosition(
							current.along +
								(next.along - current.along) * fraction,
							true,
						);
						if (fraction < 1)
							positionFrame = requestAnimationFrame(tick);
					};
					positionFrame = requestAnimationFrame(tick);
				}
				playbackTimer = setTimeout(() => {
					if (!state.playing) return;
					if (state.index >= chapters.length - 1) {
						stopPlayback();
						announce(
							"The narrative has finished. Journey Memories is available below.",
						);
						return;
					}
					go(state.index + 1, { playback: true, history: false });
				}, duration);
			};
			const play = () => {
				if (state.playing) {
					stopPlayback();
					cancelAnimationFrame(positionFrame);
					return;
				}
				if (state.mode === "explore") setMode("guided");
				if (state.index === chapters.length - 1)
					go(0, { history: false });
				state.playing = true;
				state.follow =
					state.followChoice ?? chapters[state.index].follow;
				$("[data-dxj-follow]").setAttribute(
					"aria-pressed",
					String(state.follow),
				);
				root.classList.add("is-playing");
				$("[data-dxj-play]").textContent = "Pause journey";
				$("[data-dxj-play]").setAttribute("aria-pressed", "true");
				$("[data-dxj-exit-play]").hidden = false;
				schedulePlayback();
			};
			const locationCard = (index, button = false) => {
				const chapter = chapters[index],
					card = make("div", "dxj-location-card");
				if (chapter.image) {
					const image = make("img");
					image.src = chapter.image.src;
					image.alt = chapter.image.alt;
					image.loading = "lazy";
					card.append(image);
				}
				card.append(
					make(
						"small",
						"",
						chapter.location || `Chapter ${index + 1}`,
					),
					make("strong", "", chapter.title),
					make("p", "", chapter.intro),
				);
				const link = make("button", "dxj-button", "Read this moment");
				link.type = "button";
				link.addEventListener("click", () => {
					$(".dxj-location-sheet").hidden = true;
					map?.closePopup();
					go(index);
				});
				card.append(link);
				if (chapter.stopKnown && chapter.stop) {
					const link = make(
						"a",
						"dxj-button dxj-button-outline",
						"Live Tracking at this stop",
					);
					const target = new URL(
						`${encodeURIComponent(data.routes[0].toLowerCase())}/`,
						data.dashboard,
					);
					target.searchParams.set("view", "tracking");
					target.searchParams.set("stop", chapter.stop);
					target.searchParams.set("direction", data.direction);
					link.href = target.href;
					card.append(link);
				}
				if (button) {
					const close = make("button", "dxj-sheet-close", "Close");
					close.type = "button";
					close.addEventListener("click", () => {
						$(".dxj-location-sheet").hidden = true;
					});
					card.prepend(close);
				}
				return card;
			};
			const showLocation = (index) => {
				stopPlayback();
				if (mobile.matches) {
					const sheet = $(".dxj-location-sheet");
					sheet.replaceChildren(locationCard(index, true));
					sheet.hidden = false;
					sheet
						.querySelector("button")
						?.focus({ preventScroll: true });
				} else
					markers
						.find((item) => item.index === index)
						?.marker.openPopup();
			};
			const refreshBuses = async () => {
				clearTimeout(busTimer);
				const revision = ++busVersion;
				if (!busesOn || document.hidden || !vehiclesLayer) return;
				const results = await Promise.allSettled(
					data.routes.map((route) =>
						api(`line-positions/${encodeURIComponent(route)}`),
					),
				);
				if (revision !== busVersion || !busesOn || destroyed) return;
				vehiclesLayer.clearLayers();
				const seen = new Set(),
					groups = new Map();
				let count = 0;
				results.forEach((result) => {
					if (result.status !== "fulfilled") return;
					(result.value.vehicles || []).forEach((bus) => {
						if (seen.has(bus.registration)) return;
						seen.add(bus.registration);
						const stop = (host.dxjStops || []).find(
							(stop) => stop.id === bus.stopId,
						);
						if (!stop) return;
						if (!groups.has(stop.id))
							groups.set(stop.id, { stop, buses: [] });
						groups.get(stop.id).buses.push(bus);
						count++;
					});
				});
				groups.forEach(({ stop, buses }) => {
					const marker = L.marker([stop.lat, stop.lon], {
						title: `${buses.length} predicted ${
							buses.length === 1 ? "bus" : "buses"
						} at ${stop.name}`,
						icon: L.divIcon({
							className: "dxj-live-bus",
							html:
								'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3" width="12" height="17" rx="2"/><path d="M6 11h12M8 20v2m8-2v2M8 16h1m6 0h1"/></svg>' +
								(buses.length > 1
									? "<span>" + buses.length + "</span>"
									: ""),
							iconSize: [28, 28],
						}),
					}).addTo(vehiclesLayer);
					const tip = make("div", "dxj-bus-tip");
					tip.append(
						make(
							"span",
							"dxj-bus-tip-label",
							"Next predicted stop",
						),
						make(
							"strong",
							"",
							buses.map((bus) => bus.registration).join(", "),
						),
						make("span", "dxj-bus-tip-stop", stop.name),
					);
					marker.bindTooltip(tip, {
						className: "dxj-bus-tooltip",
						direction: "auto",
						offset: [0, -8],
						opacity: 1,
					});
					const tooltip = marker.getTooltip();
					const removeTooltip = tooltip.onRemove;
					tooltip.onRemove = function (ownerMap) {
						const element = this.getElement();
						if (
							element &&
							!motion.matches &&
							ownerMap.getContainer().isConnected
						) {
							const ghost = element.cloneNode(true);
							ghost.classList.add("is-leaving");
							ghost.setAttribute("aria-hidden", "true");
							element.parentNode.append(ghost);
							setTimeout(() => ghost.remove(), 220);
						}
						return removeTooltip.call(this, ownerMap);
					};
				});
				$("[data-dxj-buses]").textContent = count
					? `Hide buses (${count})`
					: "Hide buses";
				$("[data-dxj-buses]").title =
					"Bus markers indicate next predicted stops, not live GPS positions.";
				busTimer = setTimeout(refreshBuses, 30000);
			};
			const initMap = async () => {
				if (map || mapLoading || destroyed) return;
				mapLoading = true;
				if (!window.L) {
					$(".dxj-map-status").textContent =
						"Map unavailable. All chapters and location notes remain available.";
					return;
				}
				L = window.L;
				map = L.map(host, {
					scrollWheelZoom: false,
					dragging: !L.Browser.mobile,
					tap: false,
					zoomControl: true,
				});
				map.setView([51.5074, -0.1278], 11);
				L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
					maxZoom: 19,
					attribution:
						'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
				}).addTo(map);
				map.attributionControl.setPrefix(
					'<a href="https://leafletjs.com">Leaflet</a>',
				);
				routeLayer = L.layerGroup().addTo(map);
				stopsLayer = L.layerGroup().addTo(map);
				vehiclesLayer = L.layerGroup().addTo(map);
				annotations = L.layerGroup().addTo(map);
				completed = L.polyline([], {
					color:
						root.dataset.routeType === "night"
							? "#bfe8f5"
							: "#ed2939",
					weight: 4,
					opacity: 1,
					className: "dxj-route-completed",
					interactive: false,
				}).addTo(map);
				travelling = L.marker([51.5074, -0.1278], {
					title: "Narrative journey position — not a live bus",
					interactive: false,
					icon: L.divIcon({
						className: "dxj-traveller",
						html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 7 17-7-4-7 4z"/></svg>',
						iconSize: [24, 24],
						iconAnchor: [12, 12],
					}),
				});
				const interaction = (event) => {
					if (!event.originalEvent && event.type !== "dragstart")
						return;
					stopPlayback();
					cancelAnimationFrame(positionFrame);
					state.follow = false;
					$("[data-dxj-follow]").setAttribute(
						"aria-pressed",
						"false",
					);
					if (state.mode === "guided") setMode("explore", false);
				};
				map.on("dragstart zoomstart", interaction);
				map.on("moveend zoomend", renderAnnotations);
				const results = await Promise.allSettled(
					data.routes.map((route) =>
						api(
							`route/${encodeURIComponent(route)}?direction=${
								data.direction
							}`,
						),
					),
				);
				if (destroyed) return;
				const allStops = [],
					seenStops = new Set();
				results.forEach((result) => {
					if (result.status !== "fulfilled") return;
					const route = result.value;
					(route.paths || []).forEach((path) => {
						const valid = path.filter(pointValid);
						if (valid.length > 1) routePaths.push(valid);
					});
					(route.stops || []).forEach((stop) => {
						if (
							seenStops.has(stop.id) ||
							!pointValid([stop.lat, stop.lon])
						)
							return;
						seenStops.add(stop.id);
						allStops.push(stop);
						const card = make("div", "dxj-stop-card");
						card.append(make("strong", "", stop.name));
						const link = make(
							"a",
							"dxj-button",
							"Live Tracking at this stop",
						);
						const target = new URL(
							`${encodeURIComponent(route.name.toLowerCase())}/`,
							data.dashboard,
						);
						target.searchParams.set("view", "tracking");
						target.searchParams.set("stop", stop.id);
						target.searchParams.set("direction", data.direction);
						link.href = target.href;
						card.append(link);
						L.circleMarker([stop.lat, stop.lon], {
							radius: 3,
							color: "#bac8cc",
							weight: 1,
							fillColor: "#0d161a",
							fillOpacity: 1,
						})
							.addTo(stopsLayer)
							.bindPopup(card)
							.on("click", () => {
								if (!mobile.matches) return;
								map.closePopup();
								const sheet = $(".dxj-location-sheet"),
									content = card.cloneNode(true),
									close = make(
										"button",
										"dxj-sheet-close",
										"Close",
									);
								close.type = "button";
								close.addEventListener("click", () => {
									sheet.hidden = true;
								});
								content.prepend(close);
								sheet.replaceChildren(content);
								sheet.hidden = false;
								stopPlayback();
								close.focus({ preventScroll: true });
							});
					});
				});
				host.dxjStops = allStops;
				chapters.forEach((chapter) => {
					const stop = allStops.find((stop) =>
						chapter.stop
							? stop.id === chapter.stop
							: chapter.derived &&
							  stop.name.toLowerCase().trim() ===
									(chapter.location || "")
										.toLowerCase()
										.trim(),
					);
					if (!stop) return;
					chapter.stopKnown = true;
					if (!chapter.location) chapter.location = stop.name;
					if (
						chapter.derived ||
						!pointValid([chapter.lat, chapter.lng])
					) {
						chapter.lat = stop.lat;
						chapter.lng = stop.lon;
					}
				});
				if (routePaths.length) {
					mainPath = routePaths.reduce(
						(longest, path) =>
							path.length > longest.length ? path : longest,
						[],
					);
					lengths = [0];
					mainPath
						.slice(1)
						.forEach((point, index) =>
							lengths.push(
								lengths[index] +
									distance(mainPath[index], point),
							),
						);
					total = lengths.at(-1);
					routePaths.forEach((path) =>
						L.polyline(path, {
							color: "#9eacb6",
							weight: 3,
							opacity: 0.38,
							className: "dxj-route-upcoming",
						}).addTo(routeLayer),
					);
					travelling.addTo(map);
					projection = chapters.map((chapter) => {
						const point = nearest([chapter.lat, chapter.lng]);
						return point && point.gap <= 300 ? point : null;
					});
					const preview = $("[data-dxj-route-preview]");
					preview.setAttribute("d", svgPath(mainPath, 400, 80));
					if (!motion.matches) {
						const length = preview.getTotalLength();
						preview.style.strokeDasharray = String(length);
						preview.animate(
							[
								{ strokeDashoffset: length },
								{ strokeDashoffset: 0 },
							],
							{ duration: 1400, easing: "ease-out" },
						);
					}
					$("[data-dxj-recap-path]").setAttribute(
						"d",
						svgPath(mainPath, 600, 200),
					);
					$("[data-dxj-route-facts]").textContent = `${
						allStops.length
					} route stops · ${(total / 1000).toFixed(
						1,
					)} km mapped route`;
					$("[data-dxj-route-facts]").hidden = false;
					$("[data-dxj-recap-distance]").textContent = `${(
						total / 1000
					).toFixed(1)} km of published route geometry · ${
						chapters.filter((chapter) =>
							pointValid([chapter.lat, chapter.lng]),
						).length
					} featured locations`;
					$(".dxj-map-status").textContent =
						"Published route. The journey marker follows the narrative, not a live bus.";
				} else {
					$(".dxj-map-status").textContent =
						"Published route geometry is unavailable. Recorded chapter locations remain selectable; the complete story is readable below.";
					const points = chapters
						.map((chapter) => [chapter.lat, chapter.lng])
						.filter(pointValid);
					if (points.length)
						map.fitBounds(points, {
							padding: [40, 80],
							maxZoom: 14,
						});
				}
				chapters.forEach((chapter, index) => {
					if (!pointValid([chapter.lat, chapter.lng])) return;
					const marker = L.marker([chapter.lat, chapter.lng], {
						title: `${index + 1}. ${chapter.title}`,
						icon: L.divIcon({
							className: "dxj-chapter-marker",
							html: `<span>${index + 1}</span>`,
							iconSize: [28, 28],
							iconAnchor: [14, 14],
						}),
					}).addTo(map);
					if (!mobile.matches)
						marker.bindPopup(locationCard(index), {
							autoPanPaddingTopLeft: [20, 85],
							autoPanPaddingBottomRight: [20, 170],
							className: "dxj-popup",
						});
					marker.on("click", () => showLocation(index));
					markers.push({ marker, index });
				});
				(data.pins || [])
					.filter(
						(pin) =>
							!chapters.some(
								(chapter) =>
									pointValid([chapter.lat, chapter.lng]) &&
									distance(
										[chapter.lat, chapter.lng],
										[pin.lat, pin.lng],
									) < 8,
							),
					)
					.forEach((pin) => {
						const card = make("div", "dxj-location-card");
						card.append(
							make("strong", "", pin.title),
							make("p", "", pin.body || pin.time),
						);
						if (pin.photo) {
							const link = make("a");
							link.href = pin.photo.full;
							link.dataset.dxjPhoto = "";
							link.dataset.photoId = String(pin.photo.id);
							link.dataset.photoCaption = pin.title;
							const photo = make("img");
							photo.src = pin.photo.src;
							photo.alt = pin.photo.alt;
							photo.loading = "lazy";
							link.append(photo);
							card.append(link);
						}
						if (pin.video) {
							const link = make(
								"a",
								"dxj-button dxj-button-outline",
								"View attached video",
							);
							link.href = pin.video;
							link.target = "_blank";
							link.rel = "noopener noreferrer";
							card.append(link);
						}
						L.circleMarker([pin.lat, pin.lng], {
							radius: 5,
							color: "#d7ad57",
							fillColor: "#14212a",
							fillOpacity: 1,
							weight: 2,
						})
							.addTo(map)
							.bindPopup(card);
					});
				host.dataset.mapReady = "true";
				host.dataset.routeStops = String(allStops.length);
				host.dataset.routePaths = String(routePaths.length);
				overview();
				if (state.index >= 0) render("map-ready");
			};
			const updateScroll = () => {
				scrollFrame = 0;
				updateControls();
				root.style.setProperty(
					"--dxj-header-visible",
					`${Math.max(
						0,
						document
							.querySelector("#header")
							?.getBoundingClientRect().bottom || 0,
					)}px`,
				);
				if (
					destroyed ||
					state.mode !== "guided" ||
					state.presenting ||
					performance.now() < scrollLockUntil
				)
					return;
				const line = mobile.matches
					? stage.getBoundingClientRect().bottom + 100
					: innerHeight * 0.5;
				let index = 0;
				steps.forEach((step, current) => {
					if (step.getBoundingClientRect().top <= line)
						index = current;
				});
				if (
					root.getBoundingClientRect().top < innerHeight &&
					root.getBoundingClientRect().bottom > 0
				)
					activate(index);
				if (
					!state.playing &&
					projection[index] &&
					projection[index + 1]
				) {
					const start = steps[index].getBoundingClientRect().top,
						end = steps[index + 1].getBoundingClientRect().top;
					const fraction = clamp(
						(line - start) / Math.max(1, end - start),
						0,
						1,
					);
					cancelAnimationFrame(positionFrame);
					drawPosition(
						projection[index].along +
							(projection[index + 1].along -
								projection[index].along) *
								fraction,
					);
				}
				const bounds = $(".dxj-hero").getBoundingClientRect();
				root.style.setProperty(
					"--dxj-hero-progress",
					String(clamp(-bounds.top / bounds.height, 0, 1)),
				);
			};
			listen(
				window,
				"scroll",
				() => {
					if (!scrollFrame)
						scrollFrame = requestAnimationFrame(updateScroll);
				},
				{ passive: true },
			);
			listen(
				window,
				"wheel",
				() => {
					if (state.playing) {
						stopPlayback();
						cancelAnimationFrame(positionFrame);
					}
				},
				{ passive: true },
			);
			listen(
				window,
				"touchmove",
				() => {
					if (state.playing) {
						stopPlayback();
						cancelAnimationFrame(positionFrame);
					}
				},
				{ passive: true },
			);
			const updateHeader = () => {
				const height =
					document.querySelector("#header")?.getBoundingClientRect()
						.height || 0;
				root.style.setProperty(
					"--dxj-header",
					`${Math.min(height, innerHeight * 0.25)}px`,
				);
				root.style.setProperty(
					"--dxj-header-visible",
					`${Math.max(
						0,
						document
							.querySelector("#header")
							?.getBoundingClientRect().bottom || 0,
					)}px`,
				);
				map?.invalidateSize();
				updateControls();
			};
			listen(window, "resize", updateHeader, { passive: true });
			updateHeader();
			const headerObserver =
				window.ResizeObserver && new ResizeObserver(updateHeader);
			if (headerObserver && document.querySelector("#header"))
				headerObserver.observe(document.querySelector("#header"));
			const setPresentation = (enabled, native = false) => {
				stopPlayback();
				state.presenting = enabled;
				root.classList.toggle("is-presenting", enabled);
				document.body.classList.toggle(
					"dxj-presentation-open",
					enabled,
				);
				$("[data-dxj-exit-present]").hidden = !enabled;
				$("[data-dxj-present]").setAttribute(
					"aria-pressed",
					String(enabled),
				);
				if (enabled) {
					previousFocus = document.activeElement;
					$("[data-dxj-exit-present]").focus({ preventScroll: true });
					if (native) root.requestFullscreen?.().catch(() => {});
				} else {
					if (document.fullscreenElement === root)
						document.exitFullscreen?.().catch(() => {});
					previousFocus?.focus({ preventScroll: true });
				}
				requestAnimationFrame(() => {
					map?.invalidateSize();
					updateControls();
					moveCamera();
				});
			};
			const dialog = $(".dxj-photo-dialog");
			const closePhoto = () => {
				photoVersion++;
				dialog.close();
				previousFocus?.focus({ preventScroll: true });
			};
			listen(root, "click", async (event) => {
				const button = event.target.closest("button,a");
				if (!button) return;
				if (button.hasAttribute("data-dxj-go")) {
					event.preventDefault();
					go(Number(button.dataset.dxjGo));
				} else if (button.hasAttribute("data-dxj-begin")) {
					event.preventDefault();
					setMode("guided");
					go(0);
				} else if (button.hasAttribute("data-dxj-explore")) {
					event.preventDefault();
					setMode("explore");
					stage.scrollIntoView({
						behavior: motion.matches ? "instant" : "smooth",
						block: "start",
					});
					initMap();
				} else if (button.hasAttribute("data-dxj-mode"))
					setMode(button.dataset.dxjMode);
				else if (button.hasAttribute("data-dxj-play")) play();
				else if (button.hasAttribute("data-dxj-exit-play")) {
					stopPlayback();
					cancelAnimationFrame(positionFrame);
				} else if (button.hasAttribute("data-dxj-prev"))
					go(state.index - 1);
				else if (button.hasAttribute("data-dxj-next"))
					go(state.index + 1);
				else if (button.hasAttribute("data-dxj-overview")) {
					stopPlayback();
					state.mode = "explore";
					render("overview");
					overview();
				} else if (button.hasAttribute("data-dxj-follow")) {
					state.follow = !state.follow;
					state.followChoice = state.follow;
					button.setAttribute("aria-pressed", String(state.follow));
				} else if (button.hasAttribute("data-dxj-restart")) {
					state.visited.clear();
					state.photos.clear();
					try {
						localStorage.removeItem(cacheKey);
					} catch (_) {}
					go(0);
				} else if (button.hasAttribute("data-dxj-resume")) {
					const index = chapters.findIndex(
						(chapter) => chapter.id === saved?.index,
					);
					if (index >= 0) go(index);
				} else if (button.hasAttribute("data-dxj-present"))
					setPresentation(!state.presenting);
				else if (button.hasAttribute("data-dxj-fullscreen"))
					setPresentation(true, true);
				else if (button.hasAttribute("data-dxj-exit-present"))
					setPresentation(false);
				else if (button.hasAttribute("data-dxj-return-map")) {
					stopPlayback();
					setPassenger(false);
					moveCamera();
				} else if (button.hasAttribute("data-dxj-perspective")) {
					stopPlayback();
					setPassenger(
						true,
						chapters[Number(button.dataset.dxjPerspective)],
					);
				} else if (button.hasAttribute("data-dxj-buses")) {
					busesOn = !busesOn;
					button.setAttribute("aria-pressed", String(busesOn));
					if (busesOn) {
						await initMap();
						refreshBuses();
					} else {
						busVersion++;
						clearTimeout(busTimer);
						vehiclesLayer?.clearLayers();
						button.textContent = "Show buses";
					}
				} else if (button.hasAttribute("data-dxj-share")) {
					const chapter = chapters[Number(button.dataset.dxjShare)],
						url = `${data.url}#${encodeURIComponent(chapter.id)}`;
					try {
						if (navigator.share)
							await navigator.share({
								title: `${data.title} · ${chapter.title}`,
								url,
							});
						else {
							await navigator.clipboard.writeText(url);
							announce("Chapter link copied.");
						}
					} catch (error) {
						if (error.name !== "AbortError") {
							const input = make("input");
							input.value = url;
							button.after(input);
							input.select();
							announce("Copy the selected chapter link.");
						}
					}
				} else if (button.hasAttribute("data-dxj-photo")) {
					event.preventDefault();
					stopPlayback();
					previousFocus = button;
					const version = ++photoVersion,
						image = dialog.querySelector("img");
					image.hidden = true;
					$("[data-dxj-photo-status]").hidden = false;
					$("[data-dxj-photo-status]").textContent =
						"Loading photograph…";
					dialog.showModal();
					image.src = button.href;
					image.alt = button.querySelector("img")?.alt || "";
					const owner = button.closest("[data-dxj-step]"),
						photoChapter =
							chapters[
								owner
									? Number(owner.dataset.dxjStep)
									: state.index
							];
					$("[data-dxj-photo-caption]").textContent =
						button.dataset.photoCaption ||
						photoChapter.location ||
						photoChapter.title;
					try {
						await image.decode();
						if (version !== photoVersion) return;
						image.hidden = false;
						$("[data-dxj-photo-status]").hidden = true;
						state.photos.add(button.dataset.photoId);
						recap();
						save();
					} catch (_) {
						if (version === photoVersion)
							$("[data-dxj-photo-status]").textContent =
								"This photograph could not load. Close this view to continue the story.";
					}
				} else if (button.hasAttribute("data-dxj-photo-close"))
					closePhoto();
				else if (
					button.hasAttribute("data-journey-focus") ||
					button.hasAttribute("data-journey-point")
				) {
					event.preventDefault();
					const pin = data.pins.find(
						(pin) =>
							pin.id ===
							(button.dataset.journeyFocus ||
								button.dataset.journeyPoint),
					);
					const index = chapters.findIndex(
						(chapter) => chapter.pin === pin?.id,
					);
					if (index >= 0) go(index);
					else if (pin && map) {
						setMode("explore");
						map.setView([pin.lat, pin.lng], 15);
						stage.scrollIntoView({
							behavior: motion.matches ? "auto" : "smooth",
						});
					}
				}
			});
			$$(".dxj-longform").forEach((details) =>
				listen(details, "toggle", () => {
					if (details.open) stopPlayback();
				}),
			);
			$$("video").forEach((video) => listen(video, "play", stopPlayback));
			listen(document, "visibilitychange", () => {
				if (document.hidden) {
					stopPlayback();
					busVersion++;
					clearTimeout(busTimer);
					cancelAnimationFrame(positionFrame);
				} else if (busesOn) refreshBuses();
			});
			listen(document, "keydown", (event) => {
				if (
					state.playing &&
					[
						"PageDown",
						"PageUp",
						"Home",
						"End",
						"ArrowDown",
						"ArrowUp",
						" ",
					].includes(event.key) &&
					!event.target.closest(
						"button,input,textarea,select,summary",
					)
				)
					stopPlayback();
				if (event.key === "Escape") {
					if (dialog.open) {
						event.preventDefault();
						closePhoto();
					} else if (state.presenting) setPresentation(false);
					else if (state.passenger) setPassenger(false);
				}
				if (event.key === "Tab" && state.presenting) {
					const nodes = [
						...root.querySelectorAll("a[href],button,summary"),
					].filter(
						(node) =>
							!node.disabled && node.getClientRects().length,
					);
					const first = nodes[0],
						last = nodes.at(-1);
					if (event.shiftKey && document.activeElement === first) {
						event.preventDefault();
						last?.focus();
					} else if (
						!event.shiftKey &&
						document.activeElement === last
					) {
						event.preventDefault();
						first?.focus();
					}
				}
			});
			listen(document, "fullscreenchange", () => {
				if (!document.fullscreenElement && state.presenting)
					setPresentation(false);
			});
			const fromHash = () => {
				let id;
				try {
					id = decodeURIComponent(location.hash.slice(1));
				} catch (_) {
					return;
				}
				let index = chapters.findIndex((chapter) => chapter.id === id);
				if (index < 0 && /^journey-chapter-\d+$/.test(id))
					index = Number(id.split("-").at(-1)) - 1;
				if (index >= 0 && index < chapters.length)
					go(index, { history: false });
			};
			listen(window, "hashchange", fromHash);
			listen(window, "popstate", fromHash);
			const tools = make("details", "dxj-mobile-tools"),
				summary = make("summary", "", "Tools"),
				toolList = make("div");
			tools.append(summary, toolList);
			$(".dxj-map-toolbar").append(tools);
			const originalTools = $(".dxj-map-toolbar > div:last-of-type");
			const optionalControls = [
				...originalTools.children,
				$("[data-dxj-follow]"),
				$("[data-dxj-restart]"),
				$("[data-dxj-exit-play]"),
			];
			const arrangeTools = () => {
				if (mobile.matches)
					optionalControls.forEach((button) =>
						toolList.append(button),
					);
				else {
					optionalControls
						.slice(0, 4)
						.forEach((button) => originalTools.append(button));
					optionalControls
						.slice(4)
						.forEach((button) => $(".dxj-playback").append(button));
					tools.open = false;
				}
			};
			arrangeTools();
			listen(mobile, "change", arrangeTools);
			listen(mobile, "change", () => {
				map?.closePopup();
				if (map) {
					if (mobile.matches) map.dragging.disable();
					else map.dragging.enable();
				}
				updateHeader();
			});
			listen(host, "pointerdown", (event) => {
				if (event.target.closest(".leaflet-control-zoom")) {
					stopPlayback();
					state.follow = false;
					$("[data-dxj-follow]").setAttribute(
						"aria-pressed",
						"false",
					);
					setMode("explore", false);
				}
				if (event.pointerType === "touch" && state.mode === "explore")
					map?.dragging.enable();
			});
			const mapObserver = new IntersectionObserver(
				(entries) => {
					if (entries.some((entry) => entry.isIntersecting)) {
						initMap();
						mapObserver.disconnect();
					}
				},
				{ rootMargin: "400px" },
			);
			mapObserver.observe(stage);
			root.classList.add("is-enhanced");
			const resumeOffer = $("[data-dxj-resume-offer]");
			if (resumeOffer) $(".dxj-hero-copy").append(resumeOffer);
			updateHeader();
			$$("[data-dxj-enhancement]").forEach((node) => {
				node.hidden = false;
			});
			if (
				saved?.index &&
				chapters.some((chapter) => chapter.id === saved.index)
			)
				$("[data-dxj-resume-offer]").hidden = false;
			activate(0, "initial");
			if (location.hash) requestAnimationFrame(fromHash);
			root.journeyEngine = {
				get state() {
					return {
						...state,
						visited: [...state.visited],
						photos: [...state.photos],
					};
				},
				go,
				setMode,
				play,
				stop: stopPlayback,
				overview,
				initMap,
			};
			listen(window, "pageshow", updateHeader);
			listen(window, "pagehide", (event) => {
				if (event.persisted) {
					stopPlayback();
					clearTimeout(busTimer);
					return;
				}
				destroyed = true;
				stopPlayback();
				cancelAnimationFrame(positionFrame);
				cancelAnimationFrame(scrollFrame);
				cancelAnimationFrame(mapFrame);
				controllers.forEach((controller) => controller.abort());
				clearTimeout(busTimer);
				mapObserver.disconnect();
				headerObserver?.disconnect();
				map?.remove();
				cleanups.forEach((cleanup) => cleanup());
				document.body.classList.remove(
					"dxj-presentation-open",
					"dxj-stage-visible",
				);
			});
		});
	});
})();
