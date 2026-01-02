<form method="post"
      action="<?php echo esc_url(admin_url('admin-post.php')); ?>"
      class="ticket-form"
      enctype="multipart/form-data">

	<input
		type="text"
		name="ticket_title"
		placeholder="Brief summary of the issue"
		required
	>

	<input
		type="text"
		name="project_name"
		placeholder="Project name (optional)"
	>

	<input
		type="url"
		name="project_url"
		placeholder="Project URL (optional)"
	>

	<textarea
		name="ticket_message"
		placeholder="Describe the issue in detail"
		required
	></textarea>

	<!-- Screenshot uploads -->
	<div class="ticket-screenshots">
		<label>Screenshots (optional)</label>

		<?php for ($i = 1; $i <= 10; $i++) : ?>
            <input
                type="file"
                name="ticket_image_<?php echo $i; ?>"
                accept="image/*"
                class="ticket-image-field <?php echo $i > 1 ? 'is-hidden' : ''; ?>"
            >
        <?php endfor; ?>

		<button type="button" class="add-image-btn">
			Add another image <i class="fa-solid fa-image"></i>
		</button>
	</div>

    <input
        type="file"
        name="ticket_file"
        accept=".pdf,.zip,.doc,.docx,.xlsx,.txt,.mp4,.mov"
    >

	<label class="ticket-confirm">
		<input type="checkbox" name="ticket_confirm" required>
		<span>All details provided are accurate to the best of my knowledge</span>
	</label>

	<input type="hidden" name="action" value="dx_submit_ticket">
	<input type="hidden" name="dx_return" value="<?php echo esc_url(wp_get_referer() ?: home_url('/dashboard/')); ?>">
	<?php wp_nonce_field('dx_submit_ticket', 'dx_ticket_nonce'); ?>

	<button type="submit" class="ticket-submit-btn">
		Submit ticket <i class="fa-solid fa-ticket"></i>
	</button>
</form>