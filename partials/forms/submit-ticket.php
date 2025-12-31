<form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="ticket-form">

	<input
		type="text"
		name="ticket_title"
		placeholder="Brief summary of the issue"
		required
	>

	<textarea
		name="ticket_message"
		placeholder="Describe the issue in detail"
		required
	></textarea>

	<input type="hidden" name="action" value="dx_submit_ticket">
	<input type="hidden" name="dx_return" value="<?php echo esc_url(wp_get_referer() ?: home_url('/dashboard/')); ?>">
	<?php wp_nonce_field('dx_submit_ticket', 'dx_ticket_nonce'); ?>

	<button type="submit" class="ticket-submit-btn">Submit ticket</button>

</form>