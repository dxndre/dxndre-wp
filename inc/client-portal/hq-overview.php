<?php
/** Business HQ dashboard. Financial totals come from the verified ledger. */
defined( 'ABSPATH' ) || exit;

$today = dxbs_today();
$filters = array();
foreach ( array( 'from', 'to' ) as $date_key ) {
	$date = dxbs_date( dxcp_business_query( $date_key ) );
	if ( $date ) {
		$filters[ $date_key ] = $date;
	}
}
$invalid_range = isset( $filters['from'], $filters['to'] ) && $filters['from'] > $filters['to'];
$report = dxbs_reports( $invalid_range ? array() : $filters );

$projects = array_filter(
	get_posts( array(
		'post_type' => 'dxcp_project',
		'post_status' => array( 'publish', 'private', 'draft', 'pending', 'future' ),
		'numberposts' => -1,
		'orderby' => 'modified',
	) ),
	static fn( $project ) => ! get_post_meta( $project->ID, '_dxcp_demo', true )
);
$project_ids = array_fill_keys( wp_list_pluck( $projects, 'ID' ), true );
$project_counts = array( 'active' => 0, 'on_hold' => 0, 'completed' => 0 );
$attention = array();
$add_attention = static function ( $type, $title, $detail, $url, $action ) use ( &$attention ) {
	$attention[] = compact( 'type', 'title', 'detail', 'url', 'action' );
};

foreach ( dxbs_financial_documents( 'invoice', $filters + array( 'status' => 'overdue', 'limit' => 4 ) ) as $invoice ) {
	$add_attention( 'Overdue invoice', $invoice['number'], dxcp_money( $invoice['balance_minor'] ) . ' outstanding · due ' . $invoice['due_date'], dxcp_business_url( 'invoices', array( 'document_id' => $invoice['id'] ) ), 'Review invoice' );
}

$pending_quotes = dxbs_financial_documents( 'quote', $filters + array( 'status' => 'sent', 'limit' => 4 ) );
foreach ( $pending_quotes as $quote ) {
	$add_attention( 'Quotation awaiting approval', $quote['number'], $quote['client_name'], dxcp_business_url( 'quotations', array( 'document_id' => $quote['id'] ) ), 'Review quotation' );
}

foreach ( dxbs_payment_records( array( 'status' => 'reported', 'limit' => 4 ) ) as $payment ) {
	$invoice_label = $payment['invoice_number'] ?: 'Invoice #' . $payment['invoice_id'];
	$add_attention( 'Transfer reported', $invoice_label, $payment['client_name'], dxcp_business_url( 'payments', array( 'invoice_id' => $payment['invoice_id'], 'report_id' => $payment['id'] ) ), 'Check bank payment' );
}

$open_tickets = 0;
$reply_count = 0;
foreach ( dxcp_tickets() as $ticket ) {
	$project_id = absint( get_post_meta( $ticket->ID, '_dxcp_project_id', true ) );
	$status = get_post_meta( $ticket->ID, 'ticket_status', true ) ?: 'new';
	if ( ( $project_id && ! isset( $project_ids[ $project_id ] ) ) || dxcp_ticket_is_closed( $status ) ) {
		continue;
	}
	++$open_tickets;
	// Waiting means a client reply is expected. The inbox retains every open conversation.
	if ( in_array( $status, array( 'new', 'open', 'reopened' ), true ) && ++$reply_count <= 4 ) {
		$add_attention( 'Support reply', $ticket->post_title, dxcp_ticket_status_label( $status ), dxcp_business_url( 'support', array( 'ticket_id' => $ticket->ID ) ), 'Open conversation' );
	}
}

$task_count = 0;
foreach ( dxcp_tasks() as $task ) {
	$project_id = absint( get_post_meta( $task->ID, '_dxcp_project_id', true ) );
	$status = get_post_meta( $task->ID, '_dxcp_task_status', true ) ?: 'todo';
	$due = dxbs_date( get_post_meta( $task->ID, '_dxcp_due_date', true ) );
	if ( ! isset( $project_ids[ $project_id ] ) || 'done' === $status ) {
		continue;
	}
	if ( ( ( $due && $due < $today ) || 'waiting' === $status ) && ++$task_count <= 4 ) {
		$add_attention( $due && $due < $today ? 'Overdue task' : 'Task awaiting review', $task->post_title, $due ? 'Due ' . $due : '', dxcp_business_url( 'tasks', array( 'task_id' => $task->ID ) ), 'Review task' );
	}
}

$milestones = array();
foreach ( $projects as $project ) {
	$status = dxcp_hq_project_status( $project );
	++$project_counts[ $status ];
	$date = dxbs_date( get_post_meta( $project->ID, '_dxhq_milestone_date', true ) );
	if ( $date && $date >= $today && 'active' === $status ) {
		$milestones[] = array(
			'id' => $project->ID,
			'title' => get_post_meta( $project->ID, '_dxhq_milestone', true ) ?: $project->post_title,
			'project' => $project->post_title,
			'date' => $date,
		);
	}
}
usort( $milestones, static fn( $a, $b ) => strcmp( $a['date'], $b['date'] ) );
foreach ( array_slice( $milestones, 0, 4 ) as $milestone ) {
	$add_attention( 'Upcoming milestone', $milestone['title'], $milestone['project'] . ' · ' . $milestone['date'], dxcp_hq_project_url( $milestone['id'] ), 'Open project' );
}

$cards = array(
	array( 'Outstanding invoices', dxcp_money( $report['outstanding_minor'] ?? 0 ), 'invoices', 'payments', 'Issued balance remaining' ),
	array( 'Quotations awaiting approval', number_format_i18n( $report['pending_quotation_count'] ?? dxbs_overview()['pending_quotations'] ), 'quotations', 'journey', 'Current and unanswered' ),
	array( 'Active projects', number_format_i18n( $project_counts['active'] ), 'projects', 'drive', 'Current workspaces' ),
	array( 'Open support tickets', number_format_i18n( $open_tickets ), 'support', 'support', 'Unresolved conversations' ),
	array( 'Verified revenue', dxcp_money( $report['revenue_received_minor'] ?? 0 ), 'payments', 'check', 'Funds confirmed in the bank' ),
	array( 'Overdue invoices', number_format_i18n( $report['overdue_invoice_count'] ?? 0 ), 'invoices', 'sessions', dxcp_money( $report['overdue_minor'] ?? 0 ) . ' past due', array( 'status' => 'overdue' ) ),
);
$actions = array(
	'Create quotation' => dxcp_business_url( 'quotations', array( 'new_document' => 1 ) ),
	'Generate invoice' => dxcp_business_url( 'invoices', array( 'new_document' => 1 ) ),
	'Record payment' => dxcp_business_url( 'payments' ),
	'Add client' => dxcp_business_url( 'clients', array( 'new_client' => 1 ) ),
	'Create project' => dxcp_business_url( 'projects', array( 'new_project' => 1 ) ),
	'Open support ticket' => dxcp_business_url( 'support' ) . '#dxhq-new-support',
	'Create task' => dxcp_business_url( 'tasks', array( 'new_task' => 1 ) ),
);
$money_rows = static function ( $values ) {
	if ( ! $values ) {
		echo '<p class="dxcp-muted">No verified funds in this period.</p>';
		return;
	}
	$maximum = max( 1, max( $values ) );
	foreach ( $values as $label => $amount ) : ?>
		<div class="dxhq-chart-row">
			<div><span><?php echo esc_html( $label ); ?></span><strong><?php echo esc_html( dxcp_money( $amount ) ); ?></strong></div>
			<meter value="<?php echo esc_attr( max( 0, $amount ) ); ?>" max="<?php echo esc_attr( $maximum ); ?>" aria-hidden="true"></meter>
		</div>
	<?php endforeach;
};
$monthly = array();
foreach ( array_slice( $report['monthly'] ?? array(), -12 ) as $month ) {
	$date = DateTimeImmutable::createFromFormat( '!Y-m', $month['month'] );
	$monthly[ $date ? $date->format( 'M Y' ) : $month['month'] ] = (int) $month['received_minor'];
}
$categories = array_column( $report['categories'] ?? array(), 'received_minor', 'name' );
$invoice_labels = array(
	'awaiting_payment' => 'Awaiting payment',
	'partially_paid' => 'Partially paid',
	'paid' => 'Paid',
	'credited' => 'Credited',
	'overdue' => 'Overdue',
);
?>
<div class="dxcp-view-heading dxhq-overview-heading">
	<div><h1>DX Business HQ</h1><p><?php echo esc_html( dxcp_time_greeting() . ', ' . $first_name . '.' ); ?></p></div>
	<time datetime="<?php echo esc_attr( $today ); ?>"><?php echo esc_html( wp_date( 'l, j F Y' ) ); ?></time>
</div>
<div class="dxhq-kpis" aria-label="Business metrics">
	<?php foreach ( $cards as $card ) : ?>
		<a class="dxhq-kpi" href="<?php echo esc_url( dxcp_business_url( $card[2], ( $card[5] ?? array() ) + ( in_array( $card[2], array( 'invoices', 'quotations', 'payments' ), true ) && ! $invalid_range ? $filters : array() ) ) ); ?>">
			<span class="dxhq-kpi__icon"><?php echo dxcp_icon( $card[3] ); ?></span>
			<span><?php echo esc_html( $card[0] ); ?></span>
			<strong><?php echo esc_html( $card[1] ); ?></strong>
			<small><?php echo esc_html( $card[4] ); ?></small>
		</a>
	<?php endforeach; ?>
</div>

<div class="dxhq-grid">
	<section class="dxcp-card dxhq-panel" aria-labelledby="dxhq-attention">
		<h2 id="dxhq-attention">Requires your attention</h2>
		<?php if ( ! $attention ) : ?><p class="dxcp-muted">You’re all caught up. Pending records will appear here as they need your attention.</p><?php endif; ?>
		<?php foreach ( $attention as $item ) : ?>
			<a class="dxcp-list-row dxhq-attention" href="<?php echo esc_url( $item['url'] ); ?>">
				<span><small><?php echo esc_html( $item['type'] ); ?></small><strong><?php echo esc_html( $item['title'] ); ?></strong><?php if ( $item['detail'] ) : ?><small><?php echo esc_html( $item['detail'] ); ?></small><?php endif; ?></span>
				<span class="dxhq-attention__action"><?php echo esc_html( $item['action'] ); ?><?php echo dxcp_icon( 'arrow' ); ?></span>
			</a>
		<?php endforeach; ?>
	</section>
	<section class="dxcp-card dxhq-panel" aria-labelledby="dxhq-quick-actions">
		<h2 id="dxhq-quick-actions">Quick actions</h2>
		<div class="dxhq-quick-actions">
			<?php foreach ( $actions as $label => $url ) : ?>
				<a href="<?php echo esc_url( $url ); ?>"><?php echo dxcp_icon( 'plus' ); ?><?php echo esc_html( $label ); ?></a>
			<?php endforeach; ?>
		</div>
	</section>
</div>

<section class="dxcp-card dxhq-panel" aria-labelledby="dxhq-analytics">
	<header class="dxhq-analytics-heading">
		<h2 id="dxhq-analytics">Business analytics</h2>
		<a class="dxcp-text-link" href="<?php echo esc_url( dxcp_business_url( 'reports', $invalid_range ? array() : $filters ) ); ?>">View reports <?php echo dxcp_icon( 'arrow' ); ?></a>
	</header>
	<form class="dxcp-form dxhq-date-range" action="<?php echo esc_url( home_url( '/dashboard/' ) . '#dxhq-analytics' ); ?>" method="get">
		<input type="hidden" name="section" value="business">
		<input type="hidden" name="business_view" value="overview">
		<?php dxcp_field( 'From', 'from', $filters['from'] ?? '', 'date' ); ?>
		<?php dxcp_field( 'To', 'to', $filters['to'] ?? '', 'date' ); ?>
		<button type="submit" class="dxcp-btn dxcp-btn--small">Apply dates</button>
		<?php if ( $filters ) : ?><a class="dxcp-text-link" href="<?php echo esc_url( dxcp_business_url() . '#dxhq-analytics' ); ?>">Clear dates</a><?php endif; ?>
	</form>
	<?php if ( $invalid_range ) : ?><p class="dxcp-notice dxcp-notice--error" role="alert">Choose an end date on or after the start date. The figures below include all dates.</p><?php endif; ?>
	<div class="dxhq-analytics-grid">
		<div><h3>Verified revenue by month</h3><?php $money_rows( $monthly ); ?></div>
		<div><h3>Verified revenue by service</h3><?php $money_rows( $categories ); ?></div>
		<div><h3>Received and outstanding</h3><?php $money_rows( array( 'Received' => (int) ( $report['revenue_received_minor'] ?? 0 ), 'Outstanding' => (int) ( $report['outstanding_minor'] ?? 0 ) ) ); ?><p class="dxcp-muted">Received uses the bank date. Outstanding uses the invoice issue date.</p></div>
		<div><h3>Invoice status</h3>
			<?php foreach ( $invoice_labels as $status => $label ) : ?><div class="dxcp-list-row"><span><?php echo esc_html( $label ); ?></span><strong><?php echo esc_html( number_format_i18n( $report['invoice_status_counts'][ $status ] ?? 0 ) ); ?></strong></div><?php endforeach; ?>
		</div>
		<div><h3>Project status</h3>
			<?php foreach ( array( 'active' => 'Active', 'on_hold' => 'On hold', 'completed' => 'Completed' ) as $status => $label ) : ?><div class="dxcp-list-row"><span><?php echo esc_html( $label ); ?></span><strong><?php echo esc_html( number_format_i18n( $project_counts[ $status ] ) ); ?></strong></div><?php endforeach; ?>
		</div>
	</div>
</section>

<section class="dxcp-card dxhq-panel" aria-labelledby="dxhq-activity">
	<h2 id="dxhq-activity">Recent business activity</h2>
	<?php $activity = dxbs_audit_rows( 8 ); if ( ! $activity ) : ?><p class="dxcp-muted">Changes to your business records will appear here.</p><?php endif; ?>
	<?php foreach ( $activity as $item ) : $href = dxcp_hq_activity_url( $item ); ?>
		<div class="dxcp-list-row">
			<span><strong><?php if ( $href ) : ?><a class="dxcp-text-link" href="<?php echo esc_url( $href ); ?>"><?php endif; ?><?php echo esc_html( ucwords( str_replace( '_', ' ', $item['event'] ) ) ); ?><?php if ( $href ) : ?></a><?php endif; ?></strong><small><?php echo esc_html( ucwords( str_replace( '_', ' ', $item['entity_type'] ) ) . ( $item['entity_id'] ? ' #' . $item['entity_id'] : '' ) ); ?></small></span>
			<time><?php echo esc_html( get_date_from_gmt( $item['created_at'], 'j M Y · H:i' ) ); ?></time>
		</div>
	<?php endforeach; ?>
</section>
