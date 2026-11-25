# DX. Journey Engine

The individual Bus Diary template now uses one Leaflet map and one chapter state machine. Existing WordPress article content, ACF fields, route relationships, journey pins, media and URLs are retained. No new runtime library, ACF Pro field, database table or external analytics service was introduced.

## Files

- `single-bus-diary-entry.php`: cinematic hero, semantic chapters, persistent map controls, filmstrip, media dialog and Journey Memories.
- `inc/journey-engine.php`: backwards-compatible chapter extraction, native WordPress editor, sanitization and public data model.
- `assets/journey-engine.js`: shared journey state, lazy map, geometry, camera, modes, playback, media, presentation, history and local recap.
- `assets/journey-engine-admin.js`: editor map, chapter order, media selection and article import.
- `assets/_theme-journey-engine.scss`: isolated responsive presentation, using existing Bootstrap breakpoints and fonts.
- `functions.php`: loads the chapter model.
- `assets/main.js`: loads the engine/editor chunks only when their corresponding markup exists.
- `assets/main.scss`: imports the component stylesheet.
- `build/`: generated entry assets, dependency manifest and asynchronous chunks.

## Authoring

Open any Bus Diary entry in WordPress. The **DX. Journey Engine — chapters** box provides a map and chapter editor. No configuration is required for existing entries: article sections with `story-chapter` are automatically extracted, using existing journey pins for their geographical references. Entries without those sections retain their complete article as an editorial chapter, followed by any existing pin records.

Use **Copy existing article chapters into this editor** when explicit control is needed. The original article is not overwritten and always remains accessible in the Original diary article disclosure. All original journey location notes, photographs and video links are also retained in their own disclosure. New chapters can be reordered without changing their stable IDs.

Each chapter supports a title, introduction, full HTML narrative, quote, location, stop ID, coordinates, image, gallery, video link, map zoom, camera duration, playback duration, panel side, presentation type, atmospheric treatment, optional annotation/priority, follow-camera preference and inclusion in the recap/diagram. Passenger Perspective requires a suitable, explicitly chosen documentary photograph. Its focal point is configurable. Existing journey pins remain available for smaller observations and article location references.

The editor supports direct coordinate entry as well as map picking and draggable markers. Media uses the native WordPress media library. Save operations require the normal post-edit capability and a verified nonce. Invalid coordinates or an excessive chapter count preserve the previous saved chapters and show an editor notice.

Route direction is selectable. The existing route, operator, origin, destination, soundtrack, mood, time, date and linked bus fields remain available.

## Behaviour

Guided Story is the default. Normal browser scrolling selects chapters and updates the camera and the highlighted route. Previous/next, the filmstrip and the miniature navigation use the same state. The narrative marker follows cumulative distance along published geometry; it is explicitly not an operational vehicle location. Going backwards reverses progression. Rapid changes cancel previous marker/camera animations.

Explore Freely stops guided camera movement without rebuilding the map. Returning to the story restores the chapter and saved narrative position. Optional predicted buses are grouped by their next predicted stop; they are not represented as GPS positions.

Playback starts only after an explicit action. Reading time defaults to 12–90 seconds from word count, with author overrides of 8–180 seconds. It pauses for manual scrolling, map interaction, keyboard scrolling, media, expanded text, hidden tabs and mode changes. Follow camera is independently controllable. Presentation mode works without fullscreen permission and has an Escape/exit control; native fullscreen is optional.

Chapter IDs are shareable URL fragments. Sharing uses Web Share or clipboard with a selected-link fallback. Browser back/forward reuses the existing engine. Legacy `journey-chapter-N` references are accepted. URL fragments do not change the canonical URL.

Journey Memories reports chapters actually visited and photographs actually opened. Only those IDs and the last chapter are stored locally under `dx.journey.progress.v1:POST_ID`; nothing is transmitted for the recap. Resume is optional, and Restart resets this journey's progress.

## Geographical limits and fallbacks

- Leaflet remains the existing engine. It supports panning/zooming but not a genuine pitched or rotated camera. No simulated bearing/pitch controls are exposed.
- Tiles use the same OpenStreetMap setup as the dashboard; no new provider key is required.
- All available published paths and selected-direction stops are displayed. The living narrative marker uses the longest continuous published path. A chapter more than 300 metres from that path keeps its own geographical camera/marker and readable content, without inventing an on-route connection. Disconnected route branches are not joined with straight lines.
- Displayed distance describes published mapped route geometry, not a fabricated travel time or a claim that the author travelled every metre. Stop counts come from the route response.
- Missing photos fall back to map/editorial presentation. Existing photographs are not relabelled as passenger/interior views automatically.
- Missing geometry, failed API requests, unavailable Leaflet, blocked storage and JavaScript-disabled browsing retain the narrative and available location information.
- Satellite imagery and 3D views are not added because the current provider/engine does not supply them.

## Build and deployment

Run `npm run build` from the theme. Deploy the PHP files and **the complete generated build directory**, including asynchronous chunks and `index.asset.php`. Clear theme/page caches after deployment. No database migration is required. Custom chapter records are ordinary post metadata (`_dx_journey_chapters`, `_dx_journey_direction`) and travel with the relevant WordPress content export/database.

The local storytelling preview remains illustrative editorial copy; the implementation does not fabricate new documentary photographs, timestamps, weather or route statistics.

## Validation

Production build and PHP syntax checks passed. The stylesheet has no lint errors; existing build/style warnings remain. Browser checks covered 320, 375, 390, 430, 768, 1024, 1440 and 1920 pixel widths, landscape, reduced motion, no JavaScript, API/Leaflet/photo failure, chapter navigation/history, guided/free restoration, playback/pause, presentation and photo dialogs. Final checks confirmed one public map, all five preview location pins and the original article/video remain accessible, with no mobile horizontal overflow or page errors.

Controlled fixtures additionally checked timed chapter advance and the native chapter editor's add/reorder/remove/import, coordinate and media-selection callbacks without saving a post or uploading media. Two earlier browser runs passed their assertions but needed process cleanup during browser shutdown; the final visual run exited successfully. Existing dashboard, calculator and gallery regression checks also passed.
