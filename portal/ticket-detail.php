<?php
$selected_id = (int) get_query_var('dx_portal_selected_id', 0);

if (!$selected_id) : ?>
	<section class="portal-panel ticket-detail">
		<div class="dashboard-empty">Select a ticket to see details.</div>
	</section>
<?php return; endif;

$status = dx_portal_get_ticket_status($selected_id);
$created_ts = get_post_time('U', true, $selected_id);
$created_date = date_i18n('l jS F Y', $created_ts);
$created_time = date_i18n('H:i', $created_ts);

// Optional fields (if you add them later)
$ack = ($status !== 'new') ? 'Yes' : 'No';
$eta = get_post_meta($selected_id, 'ticket_eta', true); // optional
$eta = $eta ? (string) $eta : '—';
?>

<section class="portal-panel ticket-detail">
	<ul class="ticket-meta">
		<li><span>Ticket</span><strong>#<?php echo (int) $selected_id; ?></strong></li>
		<li><span>Ticket Submit Date</span><strong><?php echo esc_html($created_date); ?></strong></li>
		<li><span>Ticket Submit Time</span><strong><?php echo esc_html($created_time); ?></strong></li>
		<li><span>Status</span><strong><?php echo esc_html(dx_portal_ticket_status_label($status)); ?></strong></li>
		<li><span>Ticket Acknowledged</span><strong><?php echo esc_html($ack); ?></strong></li>
		<li><span>Estimated Completion</span><strong><?php echo esc_html($eta); ?></strong></li>
	</ul>

	<button class="btn ghost request-update" type="button" data-ticket-id="<?php echo (int) $selected_id; ?>">
		Request Update
	</button>
</section>