<?php
if (!defined('ABSPATH')) exit;

add_filter('login_redirect', function ($redirect_to, $request, $user) {
	if (is_wp_error($user) || !$user) return $redirect_to;

	if (isset($user->roles) && in_array('client', (array) $user->roles, true)) {
		return home_url('/dashboard/');
	}

	return $redirect_to;
}, 10, 3);