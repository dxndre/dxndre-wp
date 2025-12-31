<?php
/* Template Name: Dashboard */

if (!is_user_logged_in()) {
	wp_redirect(home_url('/login'));
	exit;
}

$current_user = wp_get_current_user();

if (!in_array('client', (array) $current_user->roles, true)) {
	wp_redirect(home_url('/'));
	exit;
}

get_header();
?>

<main id="main" class="dashboard">
    <div class="container">
        <section class="dashboard-hero">
            <pre class="headline">Client Portal</pre>
            <h1>
                Good <?php echo esc_html(date('H') < 12 ? 'Morning' : 'Afternoon'); ?>,
                <?php echo esc_html($current_user->display_name); ?>.
            </h1>
        </section>

        <?php if (isset($_GET['ticket']) && $_GET['ticket'] === 'created'): ?>
            <p class="notice notice-success">
                Your ticket has been submitted successfully.
            </p>
        <?php endif; ?>

        <section class="dashboard-actions">
            <a href="/submit-ticket/"
            class="dashboard-btn primary"
            data-bs-toggle="modal"
            data-bs-target="#submitTicketModal">
                Submit new ticket +
            </a>

            <div class="dashboard-stat">
                <span>Ticket Updates</span>
                <strong>1</strong>
            </div>

            <div class="dashboard-stat">
                <span>Resolved Tickets</span>
                <strong>3</strong>
            </div>
        </section>

        <section class="dashboard-content">
            <div class="dashboard-tickets">
                <h2>Open Tickets</h2>

                <ul class="ticket-list">
                    <li class="ticket">
                        <span class="ticket-title">Navigation Bar Issue</span>
                        <span class="ticket-status in-progress">In Progress</span>
                    </li>

                    <li class="ticket">
                        <span class="ticket-title">Create New Admin User</span>
                        <span class="ticket-status acknowledged">Acknowledged</span>
                    </li>
                </ul>
            </div>

            <div class="dashboard-panel">
                <ul class="ticket-meta">
                    <li><span>Ticket Submit Date</span><strong>Tuesday 9th December 2025</strong></li>
                    <li><span>Ticket Submit Time</span><strong>04:37</strong></li>
                    <li><span>Ticket Acknowledged</span><strong>Yes</strong></li>
                    <li><span>Estimated Completion</span><strong>Today</strong></li>
                </ul>

                <button class="dashboard-btn outline request-update">
                    Request Update
                </button>
            </div>
        </section>
    </div>
</main>

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

<?php get_footer(); ?>