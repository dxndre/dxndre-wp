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

	// Initialize Popovers: https://getbootstrap.com/docs/5.0/components/popovers
	var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
	var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
		return new bootstrap.Popover(popoverTriggerEl, {
			trigger: 'focus',
		});
	});

	// Toggle `.scrolled` on `.navbar` when user scrolls more than 10px
	function updateNavbarScrolled() {
		var nav = document.querySelector('.navbar');
		if (!nav) return;
		if (window.scrollY > 10) {
			nav.classList.add('scrolled');
		} else {
			nav.classList.remove('scrolled');
		}
	}

	// Listen for scroll (passive for better performance) and run once on load
	document.addEventListener('scroll', updateNavbarScrolled, { passive: true });
	updateNavbarScrolled();
})();


