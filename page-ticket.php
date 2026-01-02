<?php
/**
 * Template Name: Ticket View
 */

if (!is_user_logged_in()) {
    wp_safe_redirect(home_url('/login'));
    exit;
}

get_header();

$ticket_id = (int) get_query_var('ticket_id');

if (!$ticket_id) {
    wp_die('Invalid ticket.');
}

$ticket = get_post($ticket_id);

if (!$ticket || $ticket->post_type !== 'ticket') {
    wp_die('Invalid ticket.');
}

$current_user_id = get_current_user_id();

// Ticket owner (client)
$is_owner = ((int) $ticket->post_author === $current_user_id);

// Assigned agent (you)
$assignee_id = function_exists('get_field')
    ? (int) get_field('ticket_assignee', $ticket_id)
    : (int) get_post_meta($ticket_id, 'ticket_assignee', true);

$is_assignee = ($assignee_id === $current_user_id);

// Admin override
$is_admin = current_user_can('manage_options');

if (!$is_owner && !$is_assignee && !$is_admin) {
    wp_die('You do not have permission to view this ticket.');
}

// Only allow clients to see THEIR OWN tickets
if (current_user_can('client') && !$is_owner) {
    wp_die('You do not have permission to view this ticket.');
}

?>

<div class="container">
    <section class="ticket-view">
        <h1><?php echo esc_html($ticket->post_title); ?></h1>

        <div class="ticket-meta">
            <p>Status: <strong><?php echo esc_html(get_post_meta($ticket_id, 'ticket_status', true)); ?></strong></p>
            <p>Created: <?php echo get_the_date('', $ticket); ?></p>
        </div>

        <div class="ticket-message">
            <?php echo wpautop(esc_html($ticket->post_content)); ?>
        </div>

        <hr>

        <h2>Post an update</h2>

        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
            <?php wp_nonce_field('dx_update_ticket', 'dx_update_ticket_nonce'); ?>
            <input type="hidden" name="action" value="dx_update_ticket">
            <input type="hidden" name="ticket_id" value="<?php echo esc_attr($ticket_id); ?>">

            <textarea name="update_message" required></textarea>

            <button type="submit">Submit update</button>
        </form>

        <div class="ticket-thread">

            <div class="ticket-message agent">
                <div class="bubble">
                    <p>Hi! I’ve received your ticket and I’m looking into it.</p>
                    <span class="meta">DXNDRE · 10:42</span>
                </div>
            </div>

            <div class="ticket-message client">
                <div class="bubble">
                    <p>Thanks! Let me know if you need anything.</p>
                    <span class="meta">You · 10:45</span>
                </div>
            </div>

        </div>

    </section>
</div>


<?php get_footer(); ?>