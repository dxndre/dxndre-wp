<?php
/* Template Name: Submit Ticket */
get_header();

if (!is_user_logged_in()) {
	wp_redirect(home_url('/login'));
	exit;
}
?>

<section class="submit-ticket">
	<h1>Submit a support ticket</h1>

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
        <?php wp_nonce_field('dx_submit_ticket', 'dx_ticket_nonce'); ?>

        <button type="submit">Submit ticket</button>

    </form>
</section>

<?php get_footer(); ?>