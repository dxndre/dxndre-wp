/** DX. Pulse: server-authoritative voting, no optimistic counts. */
function startPulse() {
	const number = new Intl.NumberFormat(document.documentElement.lang || 'en-GB');
	const refreshStats = async () => {
		const hub = document.querySelector('[data-pulse-stats]');
		if (!hub) return;
		try {
			const response = await fetch(hub.dataset.pulseStats, { credentials: 'same-origin', cache: 'no-store' });
			if (!response.ok) return;
			const stats = await response.json();
			hub.querySelectorAll('[data-pulse-stat]').forEach(el => { el.textContent = number.format(stats[el.dataset.pulseStat] || 0); });
		} catch (_) { /* Server-rendered genuine totals remain available. */ }
	};
	refreshStats();
	document.querySelectorAll('.dx-pulse [data-dx-poll]').forEach(card => {
		if (card.dataset.pulseBound) return;
		card.dataset.pulseBound = 'true';
		const form = card.querySelector('[data-poll-form]');
		const submit = form.querySelector('[type=submit]');
		const results = card.querySelector('[data-poll-results]');
		const status = card.querySelector('[data-poll-status]');
		const retry = card.querySelector('[data-poll-retry]');
		let state = null;
		let pending = false;
		let boundaryTimer;
		const updateSubmit = () => {
			submit.disabled = pending || !state || !state.configured || state.closed || state.scheduled || !!state.voted || !form.querySelector(':checked');
		};
		const render = data => {
			state = data;
			const locked = !data.configured || data.closed || data.scheduled || !!data.voted;
			form.hidden = !!data.voted || data.closed || !data.configured || data.scheduled;
			form.querySelectorAll('input').forEach(input => { input.disabled = locked; });
			results.hidden = !data.showResults;
			card.classList.toggle('has-results', data.showResults);
			card.classList.toggle('is-poll-closed', data.closed);
			const badge = card.querySelector('[data-pulse-state]');
			if (badge) { badge.textContent = data.closed ? 'Poll closed' : data.scheduled ? 'Coming soon' : 'Live poll'; badge.classList.toggle('dx-pulse-live', !data.closed && !data.scheduled); badge.classList.toggle('dx-pulse-status', data.closed || data.scheduled); }
			card.querySelector('[data-poll-results-title]').textContent = data.closed ? 'Final results' : 'Results so far';
			const max = Math.max(0, ...data.options.map(option => option.votes || 0));
			data.options.forEach(option => {
				const row = [...card.querySelectorAll('[data-poll-result]')].find(el => el.dataset.pollResult === option.key);
				if (!row) return;
				const selected = data.voted === option.key;
				row.classList.toggle('is-your-vote', selected);
				row.classList.toggle('is-winner', max > 0 && max === option.votes);
				row.querySelector('[data-your-vote]').textContent = selected ? 'Your vote' : '';
				row.querySelector('[data-poll-percent]').textContent = `${option.percent || 0}%`;
				row.querySelector('[data-poll-count]').textContent = `${number.format(option.votes || 0)} votes`;
				const bar = row.querySelector('.dx-pulse-bar span');
				bar.style.setProperty('--share', '0%');
				requestAnimationFrame(() => requestAnimationFrame(() => bar.style.setProperty('--share', `${option.percent || 0}%`)));
			});
			card.querySelector('[data-poll-total]').textContent = `${number.format(data.total)} responses`;
			card.querySelectorAll('[data-pulse-response-count]').forEach(el => { el.textContent = number.format(data.total); });
			status.textContent = data.message || (data.closed ? 'Voting has closed. These are the final results.' : data.scheduled ? `Voting opens ${new Date(data.opensAt).toLocaleString('en-GB', { timeZone: 'Europe/London' })} (UK time).` : !data.configured ? 'This poll is not open for voting yet.' : data.voted ? 'Your vote has already been counted. Thank you.' : 'Select an answer to have your say.');
			clearTimeout(boundaryTimer);
			const boundary = data.scheduled ? data.opensAt : !data.closed ? data.closesAt : '';
			if (boundary) boundaryTimer = setTimeout(() => { if (!document.hidden) request(); }, Math.min(2147483647, Math.max(1000, Date.parse(boundary) - Date.now() + 100)));
		};
		async function request(choice) {
			if (pending) return;
			pending = true;
			retry.hidden = true;
			card.setAttribute('aria-busy', 'true');
			updateSubmit();
			if (choice) { submit.textContent = 'Counting your vote…'; status.textContent = 'Sending your vote…'; }
			try {
				const headers = { Accept: 'application/json' };
				if (card.dataset.restNonce) headers['X-WP-Nonce'] = card.dataset.restNonce;
				if (choice) headers['Content-Type'] = 'application/json';
				const response = await fetch(card.dataset.pollEndpoint, {
					method: choice ? 'POST' : 'GET', credentials: 'same-origin', cache: 'no-store', headers,
					...(choice ? { body: JSON.stringify({ choice, token: state.token }) } : {})
				});
				const data = await response.json();
				if ((!response.ok && response.status !== 409) || !Array.isArray(data.options)) throw new Error(data.message || 'The poll could not be loaded. Please try again.');
				render(data);
				if (choice && data.showResults) { card.querySelector('[data-poll-results-title]').focus({ preventScroll: true }); refreshStats(); }
			} catch (error) {
				status.textContent = error.message || 'The connection was interrupted. Reload the poll to check whether your vote was received.';
				retry.hidden = false;
				// A failed request can still have reached the server. Refresh before resubmitting.
				if (choice) state = null;
			} finally {
				pending = false;
				card.removeAttribute('aria-busy');
				submit.innerHTML = 'Cast your vote <span aria-hidden="true">✓</span>';
				updateSubmit();
			}
		}
		form.addEventListener('change', updateSubmit);
		form.addEventListener('submit', event => {
			event.preventDefault();
			if (!state || pending || !form.reportValidity()) return;
			request(new FormData(form).get('choice'));
		});
		retry.addEventListener('click', () => request());
		document.addEventListener('visibilitychange', () => { if (!document.hidden) request(); });
		request();
	});
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startPulse, { once: true });
else startPulse();
