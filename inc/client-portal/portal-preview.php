<?php
/** Read-only client portal preview. Never changes the authenticated user. */
defined( 'ABSPATH' ) || exit;

if ( ! dxcp_is_site_owner() ) {
	return;
}

$preview_client_id = $pid ? absint( get_post_meta( $pid, '_dxcp_client_id', true ) ) : 0;
$preview_client = $preview_client_id ? get_userdata( $preview_client_id ) : false;
$preview_url = static fn( $section ) => dxcp_portal_url( $section, $pid, array( 'portal_preview' => 1 ) );

if ( 'welcome' === $section ) {
	?>
	<div class="dxcp-view-heading"><h1>My Overview</h1>
		<p><?php echo esc_html( $preview_client ? 'Previewing the workspace for ' . $preview_client->display_name . '.' : 'Choose a client project to review the portal.' ); ?></p>
	</div>
	<?php if ( $project ) : ?>
		<article class="dxcp-card">
			<?php dxcp_card_heading( $service_label, $project->post_title, $preview_url( 'overview' ), 'View project' ); ?>
			<p><?php echo esc_html( dxcp_hq_project_stages($service)[ get_post_meta( $pid, '_dxcp_phase', true ) ][0] ?? 'Getting started' ); ?></p>
		</article>
	<?php endif; ?>
	<div class="dxcp-overview-grid">
		<?php foreach ( array( 'quotations' => 'My Quotations', 'payments' => 'Invoices & Payments', 'drive' => 'Documents & Files', 'support' => 'Support' ) as $key => $label ) : ?>
			<article class="dxcp-card"><?php dxcp_card_heading( '', $label, $preview_url( $key ), 'Open' ); ?></article>
		<?php endforeach; ?>
	</div>
	<?php
	return;
}

if ( in_array( $section, array( 'overview', 'journey' ), true ) ) {
	?>
	<div class="dxcp-view-heading"><h1>My Projects</h1></div>
	<?php if ( $project ) : ?>
		<article class="dxcp-card">
			<?php dxcp_card_heading( $service_label, $project->post_title ); ?>
			<p><?php echo esc_html( wp_strip_all_tags( $project->post_content ) ); ?></p>
			<p><?php echo esc_html( dxcp_hq_project_stages($service)[ get_post_meta( $pid, '_dxcp_phase', true ) ][0] ?? 'Getting started' ); ?></p>
		</article>
		<article class="dxcp-card">
			<?php dxcp_card_heading( '', 'Project journey' ); ?>
			<?php foreach ( dxcp_hq_project_stages($service) as $key => $stage ) : ?>
				<div class="dxcp-list-row"><span><strong><?php echo esc_html( $stage[0] ); ?></strong><small><?php echo esc_html( $stage[1] ); ?></small></span><?php if ( $key === get_post_meta( $pid, '_dxcp_phase', true ) ) { dxcp_badge( 'Current stage', 'gold' ); } ?></div>
			<?php endforeach; ?>
		</article>
	<?php else : ?>
		<?php dxcp_empty( 'No client project selected', 'Choose a project to preview its workspace.', 'journey' ); ?>
	<?php endif;
	return;
}

$rows = array();
if ( $pid && 'tasks' === $section ) {
	foreach ( $tasks as $task ) {
        if ( ! $preview_client || ! dxcp_can_access( $task, $preview_client_id ) ) continue;
		$rows[] = array( $task->post_title, dxcp_task_display_status( $task->ID ) );
	}
} elseif ( $pid && 'drive' === $section ) {
	foreach ( $documents as $document ) {
        if ( ! $preview_client || ! dxcp_can_access( $document, $preview_client_id ) ) continue;
		$rows[] = array( $document->post_title, ucfirst( get_post_meta( $document->ID, '_dxcp_document_type', true ) ?: 'Document' ) );
	}
} elseif ( $pid && 'sessions' === $section ) {
	foreach ( $sessions as $session ) {
		$rows[] = array( $session->post_title, get_post_meta( $session->ID, '_dxcp_start', true ) );
	}
} elseif ( $preview_client && 'support' === $section ) {
	foreach ( dxcp_tickets( 0, $preview_client_id ) as $ticket ) {
		$ticket_project = absint( get_post_meta( $ticket->ID, '_dxcp_project_id', true ) );
		if ( ! $ticket_project || $ticket_project === $pid ) {
			$rows[] = array( $ticket->post_title, dxcp_ticket_status_label( get_post_meta( $ticket->ID, 'ticket_status', true ) ) );
		}
	}
} elseif ( $preview_client && 'profile' === $section ) {
	$rows[] = array( $preview_client->display_name, $preview_client->user_email );
} elseif ( in_array( $section, array( 'quotations', 'payments' ), true ) ) {
	if ( 'quotations' === $section ) {
		foreach ( $quotes as $quote ) {
			$rows[] = array( $quote['ref'], dxcp_money( $quote['total_cents'] ) . ' · ' . ucwords( str_replace( '_', ' ', $quote['status'] ) ) );
		}
	} else {
		foreach ( $billing['payments'] as $payment ) {
			$rows[] = array( $payment['title'], dxcp_money( $payment['amount_cents'] ) . ' · ' . ucfirst( $payment['status'] ) );
		}
	}
	$business_client = $preview_client && function_exists( 'dxbs_account_client_id' ) ? dxbs_account_client_id( $preview_client_id ) : 0;
	if ( $business_client ) {
		$types = 'quotations' === $section ? array( 'quote' ) : array( 'invoice', 'receipt', 'credit' );
		foreach ( $types as $type ) {
			foreach ( dxbs_client_documents( $business_client, $type ) as $record ) {
				if ( ( in_array( $type, array( 'quote', 'invoice' ), true ) && empty( $record['issued_at'] ) ) || ( ! empty( $record['project_id'] ) && (int) $record['project_id'] !== $pid ) ) {
					continue;
				}
				$rows[] = array( $record['number'], ucfirst( $type ) . ' · ' . $record['status_label'] );
			}
		}
	}
}
?>
<div class="dxcp-view-heading"><h1><?php echo esc_html( $sections[ $section ] ); ?></h1></div>
<article class="dxcp-card">
	<?php if ( ! $rows ) : ?><p class="dxcp-muted">There are no records to display in this view.</p><?php endif; ?>
	<?php foreach ( $rows as $row ) : ?><div class="dxcp-list-row"><span><strong><?php echo esc_html( $row[0] ); ?></strong><small><?php echo esc_html( $row[1] ); ?></small></span></div><?php endforeach; ?>
</article>
