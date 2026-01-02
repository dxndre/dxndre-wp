<?php
if (!isset($ticket) || !$ticket) {
	return;
}

$status         = get_post_meta($ticket->ID, 'ticket_status', true) ?: 'open';
$acknowledged   = get_post_meta($ticket->ID, 'ticket_acknowledged', true);
$due_date_raw   = get_post_meta($ticket->ID, 'ticket_due_date', true);
$submitted_date = get_the_date('jS M Y', $ticket);
$submitted_time = get_the_date('H:i', $ticket);
?>

<ul class="ticket-meta">
    <h3 class="ticket-panel-title">
        <?php echo esc_html(get_the_title($ticket)); ?>
    </h3>
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
        <strong>
            <?php
            if (empty($due_date_raw)) {
                echo 'Not set';
            } elseif (function_exists('dx_human_due_date')) {
                echo esc_html(dx_human_due_date($due_date_raw));
            } else {
                echo esc_html(date('jS M Y', strtotime($due_date_raw)));
            }
            ?>
        </strong>
    </li>
</ul>

<div class="buttons">
    <a href="<?php echo esc_url(home_url('/dashboard/ticket/' . $ticket->ID)); ?>"class="dashboard-btn outline">View / Update Ticket</a>

    <?php if (!in_array($status, ['resolved', 'cancelled'], true)) : ?>
        <button class="dashboard-btn outline danger js-cancel-ticket" data-bs-toggle="modal" data-bs-target="#cancelTicketModal" data-ticket-id="<?php echo esc_attr($ticket->ID); ?>">Cancel Ticket</button>
    <?php endif; ?>
</div>