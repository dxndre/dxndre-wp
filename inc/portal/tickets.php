<?php
if (!defined('ABSPATH')) exit;

/**
 * Fetch tickets for a client + helpers for templates.
 * Assumes CPT: ticket
 * Assumes ACF fields (optional): ticket_status, ticket_client, ticket_assignee, ticket_last_updated
 */

function dx_portal_get_client_tickets(int $user_id, array $args = []): array {
	$defaults = [
		'post_type'      => 'ticket',
		'post_status'    => ['publish', 'private'],
		'posts_per_page' => 50,
		'orderby'        => 'date',
		'order'          => 'DESC',
		'meta_query'     => [
			[
				'key'     => 'ticket_client',
				'value'   => $user_id,
				'compare' => '=',
			]
		],
	];

	$q = new WP_Query(wp_parse_args($args, $defaults));
	return $q->posts ?: [];
}

function dx_portal_ticket_status_label(string $status): string {
	$map = [
		'new'          => 'New',
		'acknowledged' => 'Acknowledged',
		'in_progress'  => 'In Progress',
		'resolved'     => 'Resolved',
	];
	return $map[$status] ?? ucfirst(str_replace('_', ' ', $status));
}

function dx_portal_ticket_status_class(string $status): string {
	$allowed = ['new', 'acknowledged', 'in_progress', 'resolved'];
	return in_array($status, $allowed, true) ? $status : 'new';
}

function dx_portal_get_ticket_status(int $ticket_id): string {
	$status = get_post_meta($ticket_id, 'ticket_status', true);
	return $status ? (string) $status : 'new';
}

function dx_portal_get_selected_ticket_id(array $tickets): int {
	if (!empty($_GET['ticket_id'])) {
		return absint($_GET['ticket_id']);
	}

	if (!empty($_GET['ticket']) && $_GET['ticket'] === 'created' && !empty($_GET['created_id'])) {
		return absint($_GET['created_id']);
	}

	return !empty($tickets[0]) ? (int) $tickets[0]->ID : 0;
}

function dx_portal_is_ticket_owned_by_user(int $ticket_id, int $user_id): bool {
	$client = (int) get_post_meta($ticket_id, 'ticket_client', true);
	return $client === $user_id;
}

function dx_portal_count_tickets(array $tickets, string $status): int {
	$count = 0;
	foreach ($tickets as $t) {
		if (dx_portal_get_ticket_status((int) $t->ID) === $status) $count++;
	}
	return $count;
}

function dx_portal_count_updates(array $tickets): int {
	// Simple “updates” metric: anything not resolved
	$count = 0;
	foreach ($tickets as $t) {
		$s = dx_portal_get_ticket_status((int) $t->ID);
		if ($s !== 'resolved') $count++;
	}
	return $count;
}

/**
 * Returns CSS class for ticket status badge
 */
function dx_ticket_status_badge_class($status) {
    switch ($status) {
        case 'acknowledged':
            return 'badge-ack';
        case 'in_progress':
            return 'badge-progress';
        case 'resolved':
            return 'badge-resolved';
        case 'cancelled':
            return 'badge-cancelled';
        default:
            return 'badge-default';
    }
}