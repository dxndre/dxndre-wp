<?php
$tickets = get_query_var('dx_portal_tickets', []);
$selected_id = (int) get_query_var('dx_portal_selected_id', 0);
?>

<section class="portal-panel">
	<h2>Open Tickets</h2>

	<?php if (empty($tickets)) : ?>
		<div class="dashboard-empty">No tickets yet. Click “Submit New Ticket” to get started.</div>
	<?php else : ?>
		<ul class="ticket-list">
			<?php foreach ($tickets as $t) :
				$ticket_id = (int) $t->ID;
				$status = dx_portal_get_ticket_status($ticket_id);
				$is_open = ($status !== 'resolved');
				if (!$is_open) continue;

				$url = add_query_arg(
                    ['ticket_id' => $ticket_id],
                    home_url('/ticket/')
                );
				$is_active = ($ticket_id === $selected_id);
			?>
				<li class="ticket <?php echo $is_active ? 'is-active' : ''; ?>">
					<a class="ticket-link" href="<?php echo esc_url($url); ?>">
						<span class="ticket-title"><?php echo esc_html(get_the_title($ticket_id)); ?></span>
						<em class="status <?php echo esc_attr(dx_portal_ticket_status_class($status)); ?>">
							<?php echo esc_html(dx_portal_ticket_status_label($status)); ?>
						</em>
					</a>
				</li>
			<?php endforeach; ?>
		</ul>
	<?php endif; ?>
</section>