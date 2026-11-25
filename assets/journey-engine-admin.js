/** Native WordPress chapter editor: no repeater or ACF Pro dependency. */
(() => {
	const start = () => {
		const editor = document.querySelector("[data-dxj-editor]");
		if (!editor) return;
		const template = document.querySelector("[data-dxj-template]"),
			host = document.querySelector("[data-dxj-editor-map]"),
			status = document.querySelector("[data-dxj-editor-status]");
		let selected = null,
			map;
		const markers = new Map();
		const field = (row, key) =>
			row.querySelector(`[data-dxj-field="${key}"]`);
		const renumber = () =>
			[...editor.children].forEach((row, index) => {
				row.querySelector("[data-dxj-number]").textContent = index + 1;
				row.querySelectorAll("[data-dxj-field]").forEach((input) => {
					input.name = `dxj_chapters[${index}][${input.dataset.dxjField}]`;
				});
			});
		const sync = () => {
			if (!map) return;
			markers.forEach((marker, row) => {
				if (!editor.contains(row)) {
					marker.remove();
					markers.delete(row);
				}
			});
			[...editor.children].forEach((row) => {
				const lat = field(row, "lat").value,
					lng = field(row, "lng").value;
				if (!lat || !lng) return;
				const point = [Number(lat), Number(lng)];
				if (!point.every(Number.isFinite)) return;
				if (markers.has(row)) markers.get(row).setLatLng(point);
				else {
					const marker = L.marker(point, { draggable: true }).addTo(
						map,
					);
					markers.set(row, marker);
					marker.on("click", () => {
						selected = row;
						status.textContent =
							"Chapter selected. Click the map or drag the marker to adjust its location.";
					});
					marker.on("dragend", () => {
						const point = marker.getLatLng();
						field(row, "lat").value = point.lat.toFixed(7);
						field(row, "lng").value = point.lng.toFixed(7);
					});
				}
			});
		};
		if (host && window.L) {
			map = L.map(host, { scrollWheelZoom: false }).setView(
				[51.5074, -0.1278],
				11,
			);
			L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
				maxZoom: 19,
				attribution: "&copy; OpenStreetMap contributors",
			}).addTo(map);
			map.on("click", (event) => {
				if (!selected || !editor.contains(selected)) {
					status.textContent =
						"Choose a chapter’s location button first.";
					return;
				}
				field(selected, "lat").value = event.latlng.lat.toFixed(7);
				field(selected, "lng").value = event.latlng.lng.toFixed(7);
				sync();
				status.textContent =
					"Chapter location updated. Update the post to save.";
			});
			if (host.dataset.route)
				fetch(
					`/wp-json/dx-buses/v1/route/${encodeURIComponent(
						host.dataset.route,
					)}?direction=inbound`,
					{ credentials: "same-origin" },
				)
					.then((response) =>
						response.ok ? response.json() : Promise.reject(),
					)
					.then((data) => {
						const bounds = [];
						(data.paths || []).forEach((path) => {
							L.polyline(path, {
								color: "#ed2939",
								weight: 3,
							}).addTo(map);
							bounds.push(...path);
						});
						(data.stops || []).forEach((stop) =>
							L.circleMarker([stop.lat, stop.lon], {
								radius: 3,
								color: "#a97828",
							})
								.addTo(map)
								.bindTooltip(stop.name),
						);
						if (bounds.length)
							map.fitBounds(bounds, { padding: [25, 25] });
					})
					.catch(() => {
						status.textContent =
							"Route preview unavailable. Coordinates and chapter editing still work.";
					});
			sync();
		}
		const add = (values) => {
			if (editor.children.length >= 60) {
				status.textContent = "The limit is 60 chapters.";
				return;
			}
			editor.append(template.content.cloneNode(true));
			const row = editor.lastElementChild;
			if (values)
				Object.entries(values).forEach(([key, value]) => {
					const input = field(row, key);
					if (!input) return;
					if (input.type === "checkbox")
						input.checked = Boolean(value);
					else
						input.value = Array.isArray(value)
							? value.join(",")
							: value ?? "";
				});
			renumber();
			sync();
			return row;
		};
		document
			.querySelector("[data-dxj-add]")
			.addEventListener("click", () => {
				const row = add();
				field(row, "title").focus();
			});
		document
			.querySelector("[data-dxj-import]")
			.addEventListener("click", () => {
				if (editor.children.length) {
					status.textContent =
						"The editor already contains chapters. Existing chapters have been kept.";
					return;
				}
				try {
					JSON.parse(
						document.querySelector("[data-dxj-existing]")
							.textContent,
					).forEach(add);
					status.textContent =
						"Existing article chapters copied. The original article is unchanged. Update the post to save.";
				} catch (_) {
					status.textContent =
						"The article chapters could not be copied.";
				}
			});
		editor.addEventListener("change", sync);
		editor.addEventListener("click", (event) => {
			const row = event.target.closest(".dxj-editor-row");
			if (!row) return;
			if (event.target.closest("[data-dxj-remove]")) {
				row.remove();
				renumber();
				sync();
				return;
			}
			const move = event.target.closest("[data-dxj-move]");
			if (move) {
				if (move.dataset.dxjMove === "up" && row.previousElementSibling)
					editor.insertBefore(row, row.previousElementSibling);
				if (move.dataset.dxjMove === "down" && row.nextElementSibling)
					editor.insertBefore(row.nextElementSibling, row);
				renumber();
			}
			if (event.target.closest("[data-dxj-locate]")) {
				selected = row;
				host.scrollIntoView({ block: "center", behavior: "smooth" });
				status.textContent =
					"Click the map to set this chapter’s location.";
			}
			const mediaButton = event.target.closest("[data-dxj-media]");
			if (!mediaButton || !window.wp?.media) return;
			const kind = mediaButton.dataset.dxjMedia,
				picker = wp.media({
					title: "Choose chapter media",
					library: { type: kind === "video" ? "video" : "image" },
					multiple: kind === "gallery",
				});
			picker.on("select", () => {
				const selection = picker.state().get("selection");
				field(row, kind).value =
					kind === "gallery"
						? selection.map((item) => item.id).join(",")
						: kind === "video"
						? selection.first().get("url")
						: selection.first().id;
			});
			picker.open();
		});
	};
	if (document.readyState === "loading")
		document.addEventListener("DOMContentLoaded", start, { once: true });
	else start();
})();
