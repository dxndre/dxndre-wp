<?php
/**
 * Template Name: Client Dashboard
 */

get_header();

if (!is_user_logged_in()) {
	wp_safe_redirect(wp_login_url());
	exit;
}

$user = wp_get_current_user();

if (!in_array('client', (array) $user->roles, true)) {
	wp_safe_redirect(home_url('/'));
	exit;
}

$tickets = dx_portal_get_client_tickets((int) $user->ID);
$selected_id = dx_portal_get_selected_ticket_id($tickets);

// Safety: don't allow viewing other peoples tickets via URL
if ($selected_id && !dx_portal_is_ticket_owned_by_user($selected_id, (int) $user->ID)) {
	$selected_id = 0;
}
?>

<main class="client-portal">

	<?php get_template_part('portal/header'); ?>

	<section class="portal-hero">
		<span class="portal-eyebrow">Client Portal</span>
		<h1>Good <?php echo esc_html(dx_time_greeting()); ?>, <?php echo esc_html($user->display_name); ?>.</h1>

		<div class="portal-actions">
			<button class="btn primary" type="button" data-bs-toggle="modal" data-bs-target="#newTicketModal">
				Submit New Ticket <span>+</span>
			</button>

			<div class="portal-metric">Ticket Updates <strong><?php echo (int) dx_portal_count_updates($tickets); ?></strong></div>
			<div class="portal-metric">Resolved Tickets <strong><?php echo (int) dx_portal_count_tickets($tickets, 'resolved'); ?></strong></div>
		</div>

		<noscript>
			<p style="margin-top:1rem;opacity:.75;">
				JavaScript is disabled — use the fallback page to submit a ticket:
				<a href="<?php echo esc_url(home_url('/submit-ticket/')); ?>">Submit ticket</a>
			</p>
		</noscript>
	</section>

	<section class="portal-content">
		<?php
		set_query_var('dx_portal_tickets', $tickets);
		set_query_var('dx_portal_selected_id', $selected_id);

		get_template_part('portal/open-tickets');
		get_template_part('portal/ticket-detail');
		?>
	</section>

	<div class="modal fade" id="newTicketModal" tabindex="-1" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Submit a support ticket</h5>
					<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>

				<div class="modal-body">
					<?php get_template_part('partials/forms/submit-ticket'); ?>
					<p class="modal-fallback">
						If this doesn’t work, use the fallback page:
						<a href="<?php echo esc_url(home_url('/submit-ticket/')); ?>">Submit ticket</a>
					</p>
				</div>
			</div>
		</div>
	</div>

</main>

<?php get_footer(); ?>