<?php
function dx_portal_greeting() {
	$hour = (int) current_time('H');
	return $hour < 12 ? 'Morning' : ($hour < 18 ? 'Afternoon' : 'Evening');
}

function dx_is_client() {
	$user = wp_get_current_user();
	return in_array('client', (array) $user->roles, true);
}