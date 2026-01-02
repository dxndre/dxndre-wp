<?php
/* Template Name: Dashboard */

if (!is_user_logged_in()) {
	wp_safe_redirect(home_url('/login'));
	exit;
}

$current_user = wp_get_current_user();

if (!in_array('client', (array) $current_user->roles, true)) {
	wp_safe_redirect(home_url('/'));
	exit;
}

get_header();

$user_id     = get_current_user_id();
$selected_id = isset($_GET['ticket_id']) ? (int) $_GET['ticket_id'] : 0;

if (!$selected_id && !empty($open_tickets)) {
	$selected_id = $open_tickets[0]->ID;
}

$view = $_GET['view'] ?? 'open';

if (!in_array($view, ['open', 'resolved', 'cancelled'], true)) {
	$view = 'open';
}

/**
 * Fetch tickets for this client
 */
$tickets = get_posts([
	'post_type'      => 'ticket',
	'post_status'    => 'publish',
	'author'         => $user_id,
	'posts_per_page' => -1,
	'orderby'        => 'date',
	'order'          => 'DESC',
]);

$open_tickets      = [];
$resolved_tickets  = [];
$cancelled_tickets = [];

foreach ($tickets as $ticket) {
	$status = get_post_meta($ticket->ID, 'ticket_status', true);

	switch ($status) {
		case 'resolved':
			$resolved_tickets[] = $ticket;
			break;

		case 'cancelled':
			$cancelled_tickets[] = $ticket;
			break;

		default:
			$open_tickets[] = $ticket;
	}
}

$open_count      = count($open_tickets);
$resolved_count  = count($resolved_tickets);
$cancelled_count = count($cancelled_tickets);

$selected_ticket = $selected_id ? get_post($selected_id) : null;

function dx_human_due_date($date) {
	if (!$date) return '—';

	$today     = strtotime('today');
	$tomorrow  = strtotime('tomorrow');
	$target    = strtotime($date);

	if ($target === $today) {
		return 'Today';
	}

	if ($target === $tomorrow) {
		return 'Tomorrow';
	}

	return date('jS M Y', $target);
}

$heading = match ($view) {
    'resolved'  => 'Resolved Tickets',
    'cancelled' => 'Cancelled Tickets',
    default     => 'Open Tickets',
};

$hour = (int) date('H');

if ($hour < 12) {
	$greeting = 'Morning';
} elseif ($hour < 18) {
	$greeting = 'Afternoon';
} else {
	$greeting = 'Evening';
}

?>

<main id="main" class="dashboard">
	<div class="container">

		<section class="dashboard-hero">
			<pre class="headline">Client Portal</pre>
			<h1>
                Good <?php echo esc_html($greeting); ?>,
                <?php echo esc_html($current_user->display_name); ?>.
            </h1>
		</section>

		<section class="dashboard-actions">
            <div class="dashboard-tabs">
                <a href="#"
                class="dashboard-tab tab-primary"
                data-bs-toggle="modal"
                data-bs-target="#submitTicketModal">
                    Submit New Ticket <span>+</span>
                </a>

                <a href="<?php echo esc_url(add_query_arg('view', 'open')); ?>"
                class="dashboard-tab <?php echo $view === 'open' ? 'is-active' : ''; ?>">
                    Open
                    <span class="tab-count"><?php echo esc_html($open_count); ?></span>
                </a>

                <a href="<?php echo esc_url(add_query_arg('view', 'resolved')); ?>"
                class="dashboard-tab <?php echo $view === 'resolved' ? 'is-active' : ''; ?>">
                    Resolved
                    <span class="tab-count"><?php echo esc_html($resolved_count); ?></span>
                </a>

                <a href="<?php echo esc_url(add_query_arg('view', 'cancelled')); ?>"
                class="dashboard-tab <?php echo $view === 'cancelled' ? 'is-active' : ''; ?>">
                    Cancelled
                    <span class="tab-count"><?php echo esc_html($cancelled_count); ?></span>
                </a>
            </div>
        </section>

		<section class="dashboard-content">

			<!-- LEFT: TICKET LIST -->
			<div class="dashboard-tickets">
                <h2><?php echo esc_html($heading); ?></h2>

				<?php if (empty($open_tickets)) : ?>
					<div class="dashboard-empty">
						No open tickets yet.
					</div>
				<?php else : ?>
					<ul class="ticket-list">
						<?php 
                            switch ($view) {
                            case 'resolved':
                                $ticket_list = $resolved_tickets;
                                break;

                            case 'cancelled':
                                $ticket_list = $cancelled_tickets;
                                break;

                            default:
                                $ticket_list = $open_tickets;
                            }
                        ?>

                        <?php foreach ($ticket_list as $ticket) :
							$status = get_post_meta($ticket->ID, 'ticket_status', true);
							$is_active = ($ticket->ID === $selected_id);
							?>
							<li class="ticket <?php echo $is_active ? 'is-active' : ''; ?>" data-status="<?php echo esc_attr($status); ?>" tabindex="0">
								<a class="ticket-link js-ticket-link" href="#" data-ticket-id="<?php echo esc_attr($ticket->ID); ?>">
									<div class="ticket-info">
										<span class="ticket-title">
											<?php echo esc_html($ticket->post_title); ?>
										</span>
										<span class="ticket-date">
											<?php echo esc_html(get_the_date('', $ticket)); ?>
										</span>
									</div>

									<span class="ticket-status <?php echo esc_attr(dx_ticket_status_badge_class($status)); ?>">
                                        <?php echo esc_html(ucwords(str_replace('_', ' ', $status))); ?>
                                    </span>
								</a>
							</li>
						<?php endforeach; ?>
					</ul>
				<?php endif; ?>
			</div>

			<!-- RIGHT: TICKET META -->
			<div class="dashboard-panel">

                <?php if ($selected_ticket && (int) $selected_ticket->post_author === (int) $user_id) : ?>

                    <?php
                    $status         = get_post_meta($selected_ticket->ID, 'ticket_status', true);
                    $acknowledged   = get_post_meta($selected_ticket->ID, 'ticket_acknowledged', true);
                    $due_date_raw   = get_post_meta($selected_ticket->ID, 'ticket_due_date', true);
                    $submitted_date = get_the_date('jS M Y', $selected_ticket);
                    $submitted_time = get_the_date('H:i', $selected_ticket);
                    ?>

                    <h3>Ticket Details</h3>

                    <ul class="ticket-meta">
                        <li>
                            <span>Status</span>
                            <strong><?php echo esc_html(ucwords(str_replace('_', ' ', $status))); ?></strong>
                        </li>

                        <li>
                            <span>Submitted</span>
                            <strong>
                                <?php echo esc_html($submitted_date); ?><br>
                                <small><?php echo esc_html($submitted_time); ?></small>
                            </strong>
                        </li>

                        <li>
                            <span>Acknowledged</span>
                            <strong><?php echo $acknowledged ? 'Yes' : 'No'; ?></strong>
                        </li>

                        <li>
                            <span>Estimated Completion</span>
                            <strong><?php echo esc_html(dx_human_due_date($due_date_raw)); ?></strong>
                        </li>
                    </ul>

                    <a
                        href="<?php echo esc_url(home_url('/dashboard/ticket/' . $selected_ticket->ID)); ?>"
                        class="dashboard-btn outline request-update"
                    >
                        View / Update Ticket
                    </a>

                    <?php if (!in_array($status, ['resolved', 'cancelled'], true)) : ?>
                        <button
                            class="dashboard-btn outline danger js-cancel-ticket"
                            data-ticket-id="<?php echo esc_attr($selected_ticket->ID); ?>"
                            data-bs-toggle="modal"
                            data-bs-target="#cancelTicketModal"
                        >
                            Cancel Ticket
                        </button>
                    <?php endif; ?>

                <?php else : ?>

                    <div class="dashboard-empty">
                        Select a ticket to view details.
                    </div>

                <?php endif; ?>

                </div>
		</section>
	</div>
</main>

<!-- SUBMIT TICKET MODAL -->
<div class="modal fade" id="submitTicketModal" tabindex="-1" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered modal-lg">
		<div class="modal-content">

			<div class="modal-header">
				<h5 class="modal-title">Submit a support ticket</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
			</div>

			<div class="modal-body">
				<?php get_template_part('partials/forms/submit-ticket'); ?>
			</div>

		</div>
	</div>
</div>

<!-- CANCEL TICKET MODAL -->
 <div class="modal fade" id="cancelTicketModal" tabindex="-1" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered modal-md">
		<div class="modal-content">

			<div class="modal-header">
				<h5 class="modal-title">Cancel Ticket</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
			</div>

			<div class="modal-body">
				<p>
					Are you sure you want to cancel this ticket?<br>
					This action cannot be undone.
				</p>
			</div>

			<div class="modal-footer">
                <div class="buttons">
                    <button class="dashboard-btn outline" data-bs-dismiss="modal">
                        Keep Ticket
                    </button>

                    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                        <input type="hidden" name="action" value="dx_cancel_ticket">
                        <input type="hidden" name="ticket_id" id="cancel-ticket-id">
                        <?php wp_nonce_field('dx_cancel_ticket', 'dx_cancel_ticket_nonce'); ?>

                        <button class="dashboard-btn outline danger">
                            Yes, Cancel Ticket
                        </button>
                    </form>
                </div>
			</div>

		</div>
	</div>
</div>

<?php get_footer(); ?>