<?php
/** Financial views in the existing dashboard. All validation and state changes live in the plugin. */
defined( 'ABSPATH' ) || exit;

function dxcp_finance_hidden( $name, $value ) {
	echo '<input type="hidden" name="' . esc_attr( $name ) . '" value="' . esc_attr( $value ) . '">';
}

function dxcp_finance_action( $action, $fields, $label, $confirmation = '', $class = '' ) {
	dxcp_business_form( $action );
	foreach ( $fields as $name => $value ) { dxcp_finance_hidden( $name, $value ); }
	if ( $confirmation ) : ?><label class="dxcp-checkbox"><input type="checkbox" name="<?php echo esc_attr( $confirmation[0] ); ?>" value="1" required><span><?php echo esc_html( $confirmation[1] ); ?></span></label><?php endif; ?>
	<button type="submit" class="dxcp-btn dxcp-btn--small <?php echo esc_attr( $class ); ?>"><?php echo esc_html( $label ); ?></button></form>
	<?php
}

function dxcp_finance_filters( $view ) {
	$filters = array(
		'search' => sanitize_text_field( dxcp_business_query( 'search' ) ),
		'status' => sanitize_key( dxcp_business_query( 'status' ) ),
		'client_id' => absint( dxcp_business_query( 'client_id', '0' ) ),
		'category_id' => absint( dxcp_business_query( 'category_id', '0' ) ),
		'from' => sanitize_text_field( dxcp_business_query( 'from' ) ),
		'to' => sanitize_text_field( dxcp_business_query( 'to' ) ),
		'orderby' => sanitize_key( dxcp_business_query( 'orderby', 'date' ) ),
		'order' => 'DESC',
		'limit' => 100,
	);
	?>
	<form class="dxcp-form" action="<?php echo esc_url( home_url( '/dashboard/' ) ); ?>" method="get">
		<?php dxcp_finance_hidden( 'section', 'business' ); dxcp_finance_hidden( 'business_view', $view ); ?>
		<div class="dxbs-toolbar">
			<?php dxcp_field( 'Search references or clients', 'search', $filters['search'], 'search' ); ?><label class="dxcp-field"><span>Client</span><select name="client_id"><option value="0">All clients</option><?php foreach ( dxbs_clients( array( 'status' => 'all', 'limit' => 200 ) ) as $client ) : ?><option value="<?php echo (int) $client['id']; ?>" <?php selected( $filters['client_id'], $client['id'] ); ?>><?php echo esc_html( $client['name'] ); ?></option><?php endforeach; ?></select></label>
			<label class="dxcp-field"><span>Service</span><select name="category_id"><option value="0">All services</option><?php foreach ( dxbs_categories( false ) as $category ) : ?><option value="<?php echo (int) $category['id']; ?>" <?php selected( $filters['category_id'], $category['id'] ); ?>><?php echo esc_html( $category['name'] ); ?></option><?php endforeach; ?></select></label>
			<label class="dxcp-field"><span>Status</span><select name="status"><option value="">All statuses</option><?php foreach ( array( 'draft', 'issued', 'sent', 'accepted', 'awaiting_payment', 'partially_paid', 'paid', 'overdue', 'void' ) as $status ) : ?><option value="<?php echo esc_attr( $status ); ?>" <?php selected( $filters['status'], $status ); ?>><?php echo esc_html( ucwords( str_replace( '_', ' ', $status ) ) ); ?></option><?php endforeach; ?></select></label>
			<?php dxcp_field( 'From', 'from', $filters['from'], 'date' ); dxcp_field( 'To', 'to', $filters['to'], 'date' ); ?>
			<label class="dxcp-field"><span>Sort by</span><select name="orderby"><?php foreach ( array( 'date' => 'Most recent', 'number' => 'Reference', 'total' => 'Highest value' ) as $key => $label ) : ?><option value="<?php echo esc_attr( $key ); ?>" <?php selected( $filters['orderby'], $key ); ?>><?php echo esc_html( $label ); ?></option><?php endforeach; ?></select></label>
			<button type="submit" class="dxcp-btn dxcp-btn--small">Apply filters</button>
		</div>
	</form>
	<?php return $filters;
}

function dxcp_business_financial( $view ) {
	if ( ! function_exists( 'dxbs_financial_documents' ) ) { dxcp_empty( 'Financial tools are being prepared', 'Please refresh once the local update is complete.' ); return; }
	if ( 'payments' === $view ) { dxcp_business_payment_management(); return; }
	if ( 'reports' === $view ) { dxcp_business_reports(); return; }
	$type = 'quotations' === $view ? 'quote' : ( 'receipts' === $view ? 'receipt' : 'invoice' );
	if ( 'invoices' === $view && 'credit' === dxcp_business_query( 'document_type' ) ) { $type = 'credit'; }
	$id = absint( dxcp_business_query( 'document_id', '0' ) );
	if ( $id ) {
		$record = dxbs_document( $type, $id );
		if ( ! $record ) { dxcp_empty( 'Document unavailable', 'Return to the document list and choose an available record.' ); return; }
		if ( isset( $_GET['edit_document'] ) && 'draft' === $record['status'] && 'receipt' !== $type ) { dxcp_business_document_editor( $type, $record ); }
		else { dxcp_business_document_detail( $type, $record ); }
		return;
	}
	if ( isset( $_GET['new_document'] ) && in_array( $type, array( 'quote', 'invoice' ), true ) ) { dxcp_business_document_editor( $type ); return; }
	?>
	<article class="dxcp-card">
		<?php dxcp_card_heading( 'CLEAR RECORDS', ucfirst( $view ), 'receipt' === $type ? '' : dxcp_business_url( $view, array( 'new_document' => 1 ) ), 'New ' . ( 'quote' === $type ? 'quotation' : 'invoice' ) ); ?>
		<?php $filters = dxcp_finance_filters( $view ); $records = dxbs_financial_documents( $type, $filters ); dxcp_business_document_table( $type, $records ); ?>
	</article>
	<?php if ( 'invoices' === $view ) : ?><article class="dxcp-card"><?php dxcp_card_heading( 'LINKED CORRECTIONS', 'Credit notes' ); dxcp_business_document_table( 'credit', dxbs_financial_documents( 'credit', $filters ) ); ?></article><?php endif; ?>
	<?php if ( 'quote' === $type ) : ?>
		<article class="dxcp-card"><?php dxcp_card_heading( 'FROM YOUR CALCULATOR', 'Review an existing estimate' ); ?>
			<p>Import an indicative estimate as a draft, then review its lines, scope and price before issuing it. The calculator reference stays linked to its original record.</p>
			<?php dxcp_business_form( 'dxbs_import_quote' ); ?>
			<div class="dxcp-form-grid"><?php dxcp_field( 'Calculator estimate reference', 'reference', '', 'text', true ); dxcp_business_party_fields( array(), false ); ?></div>
			<label class="dxcp-checkbox"><input type="checkbox" name="reviewed" value="1" required><span>I will review the imported scope and pricing before issuing the quotation.</span></label><button type="submit" class="dxcp-btn dxcp-btn--small">Import as a draft</button></form>
		</article>
	<?php endif;
}

function dxcp_business_document_table( $type, $records ) {
	if ( ! $records ) { dxcp_empty( 'No matching documents', 'Your saved and issued documents will appear here. Try another filter or create a draft.', 'payments' ); return; }
	$view = array( 'quote' => 'quotations', 'invoice' => 'invoices', 'credit' => 'invoices', 'receipt' => 'receipts' )[ $type ];
	?>
	<div class="dxcp-table-wrap"><table class="dxcp-table"><thead><tr><th scope="col">Reference / title</th><th scope="col">Client / service</th><th scope="col">Total</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead><tbody>
	<?php foreach ( $records as $record ) : ?><tr>
		<td><strong><?php echo esc_html( $record['number'] ?: 'Draft #' . $record['id'] ); ?></strong><small><?php echo esc_html( $record['title'] ?? '' ); ?></small></td>
		<td><?php echo esc_html( $record['client_name'] ?? '' ); ?><small><?php echo esc_html( $record['category_name'] ?? '' ); ?></small></td>
		<td><?php echo esc_html( dxcp_money( $record['total_minor'] ?? $record['amount_minor'] ?? 0 ) ); ?><?php if ( isset( $record['balance_minor'] ) ) : ?><small><?php echo esc_html( dxcp_money( $record['balance_minor'] ) ); ?> outstanding</small><?php endif; ?></td>
		<td><?php dxcp_badge( $record['status_label'] ?? ucfirst( $record['status'] ?? 'Issued' ), in_array( $record['status'] ?? '', array( 'paid', 'accepted', 'verified' ), true ) ? 'green' : '' ); ?></td>
		<td><a class="dxcp-text-link" href="<?php echo esc_url( dxcp_business_url( $view, array( 'document_id' => $record['id'], 'document_type' => $type ) ) ); ?>">Open <?php echo dxcp_icon( 'arrow' ); ?></a></td>
	</tr><?php endforeach; ?>
	</tbody></table></div>
	<?php
}

function dxcp_business_party_fields( $data, $nested = true ) {
	$prefix = $nested ? 'document[' : '';
	$suffix = $nested ? ']' : '';
	?>
	<label class="dxcp-field"><span>Client</span><select name="<?php echo esc_attr( $prefix . 'client_id' . $suffix ); ?>" required><option value="">Choose a client</option><?php foreach ( dxbs_clients( array( 'limit' => 200 ) ) as $client ) : ?><option value="<?php echo (int) $client['id']; ?>" <?php selected( $data['client_id'] ?? 0, $client['id'] ); ?>><?php echo esc_html( $client['name'] . ( $client['company'] ? ' · ' . $client['company'] : '' ) ); ?></option><?php endforeach; ?></select></label>
	<label class="dxcp-field"><span>Service category</span><select name="<?php echo esc_attr( $prefix . 'category_id' . $suffix ); ?>" required><option value="">Choose a service</option><?php foreach ( dxbs_categories() as $category ) : ?><option value="<?php echo (int) $category['id']; ?>" <?php selected( $data['category_id'] ?? 0, $category['id'] ); ?>><?php echo esc_html( $category['name'] ); ?></option><?php endforeach; ?></select></label>
	<label class="dxcp-field"><span>Related project (optional)</span><select name="<?php echo esc_attr( $prefix . 'project_id' . $suffix ); ?>"><option value="0">No project linked</option><?php foreach ( dxcp_projects() as $project ) : ?><option value="<?php echo (int) $project->ID; ?>" <?php selected( $data['project_id'] ?? 0, $project->ID ); ?>><?php echo esc_html( $project->post_title ); ?></option><?php endforeach; ?></select></label>
	<?php
}

function dxcp_business_line_fields( $index, $line = array() ) {
	$prefix = 'document[lines][' . $index . ']';
	?>
	<div class="dxbs-line" data-dxbs-line>
		<label class="dxcp-field"><span>Description</span><textarea name="<?php echo esc_attr( $prefix . '[description]' ); ?>" rows="2" maxlength="2000"><?php echo esc_textarea( $line['description'] ?? '' ); ?></textarea></label>
		<?php dxcp_field( 'Quantity', $prefix . '[quantity]', $line['quantity'] ?? '1' ); dxcp_field( 'Unit price (£)', $prefix . '[unit_price]', $line['unit_price'] ?? '' ); dxcp_field( 'VAT basis points (2000 = 20%)', $prefix . '[tax_basis_points]', $line['tax_basis_points'] ?? '0', 'number' ); ?>
		<button type="button" class="dxcp-btn dxcp-btn--small" data-dxbs-remove-line aria-label="Remove line item">Remove</button>
	</div>
	<?php
}

function dxcp_business_document_editor( $type, $record = array() ) {
	$view = 'quote' === $type ? 'quotations' : 'invoices';
	$draft = $record['draft'] ?? array();
	$lines = $draft['lines'] ?? ( $record['lines'] ?? array() );
	$inputs = array_map( 'dxbs_line_to_input', $lines );
	while ( count( $inputs ) < 3 ) { $inputs[] = array(); }
	?>
	<article class="dxcp-card">
		<?php dxcp_card_heading( 'DRAFT · NOTHING SENT', ( $record ? 'Edit ' : 'New ' ) . ( 'quote' === $type ? 'quotation' : 'invoice' ), dxcp_business_url( $view ), 'Back to documents' ); ?>
		<p>Save and review the complete document before issuing it. Issued documents preserve their client, business, scope, amounts and terms.</p>
		<?php dxcp_business_form( 'quote' === $type ? 'dxbs_save_quote' : 'dxbs_save_invoice' ); dxcp_finance_hidden( 'document[id]', $record['id'] ?? 0 ); dxcp_finance_hidden( 'document[version]', $record['version'] ?? 0 ); ?>
		<div class="dxcp-form-grid">
			<?php dxcp_field( 'Document title', 'document[title]', $record['title'] ?? '', 'text', true ); dxcp_business_party_fields( $record ); dxcp_field( 'Supply / proposed service date', 'document[supply_date]', $record['supply_date'] ?? wp_date( 'Y-m-d' ), 'date', true ); dxcp_field( 'quote' === $type ? 'Quotation expiry date' : 'Payment due date', 'document[' . ( 'quote' === $type ? 'expires_at' : 'due_date' ) . ']', substr( $record[ 'quote' === $type ? 'expires_at' : 'due_date' ] ?? '', 0, 10 ), 'date', true ); ?>
		</div>
		<fieldset><legend>Line items</legend>
			<p class="dxcp-muted">Leave unused rows empty. Quantities support three decimal places; prices use pounds and pence. VAT requires a VAT-registered business setting.</p>
			<div data-dxbs-lines><?php foreach ( $inputs as $index => $line ) { dxcp_business_line_fields( $index, $line ); } ?></div>
			<template data-dxbs-line-template><?php dxcp_business_line_fields( '__INDEX__' ); ?></template><button type="button" class="dxcp-btn dxcp-btn--small" data-dxbs-add-line>Add line item <?php echo dxcp_icon( 'plus' ); ?></button>
		</fieldset>
		<div class="dxcp-form-grid">
			<label class="dxcp-field"><span>Discount</span><select name="document[discount_type]"><?php foreach ( array( 'none' => 'No discount', 'fixed' => 'Fixed amount (£)', 'percent' => 'Percentage (%)' ) as $key => $label ) : ?><option value="<?php echo esc_attr( $key ); ?>" <?php selected( $draft['discount_type'] ?? 'none', $key ); ?>><?php echo esc_html( $label ); ?></option><?php endforeach; ?></select></label><?php dxcp_field( 'Discount value', 'document[discount_value]', $draft['discount_value'] ?? '0' ); ?>
			<?php if ( 'quote' === $type ) : ?><label class="dxcp-field"><span>Deposit requirement</span><select name="document[deposit_type]"><?php foreach ( array( 'none' => 'No deposit', 'fixed' => 'Fixed amount (£)', 'percent' => 'Percentage (%)' ) as $key => $label ) : ?><option value="<?php echo esc_attr( $key ); ?>" <?php selected( $draft['deposit_type'] ?? 'none', $key ); ?>><?php echo esc_html( $label ); ?></option><?php endforeach; ?></select></label><?php dxcp_field( 'Deposit value', 'document[deposit_value]', $draft['deposit_value'] ?? '0' ); ?><?php endif; ?>
		</div>
		<label class="dxcp-field"><span>Payment and project terms</span><textarea name="document[terms]" rows="5" maxlength="12000"><?php echo esc_textarea( $draft['terms'] ?? '' ); ?></textarea></label><label class="dxcp-field"><span>Document notes</span><textarea name="document[notes]" rows="4" maxlength="12000"><?php echo esc_textarea( $draft['notes'] ?? '' ); ?></textarea></label>
		<button type="submit" class="dxcp-btn dxcp-btn--dark">Save draft for review <?php echo dxcp_icon( 'check' ); ?></button></form>
	</article>
	<?php
}

function dxcp_business_document_summary( $type, $record ) {
	?>
	<div class="dxcp-inline"><?php dxcp_badge( $record['status_label'] ?? ucfirst( $record['status'] ?? 'Issued' ) ); ?><strong><?php echo esc_html( $record['number'] ?: 'Draft #' . $record['id'] ); ?></strong><span><?php echo esc_html( $record['client_name'] ?? '' ); ?> · <?php echo esc_html( $record['category_name'] ?? '' ); ?></span></div>
	<?php if ( ! empty( $record['lines'] ) ) : ?>
		<div class="dxcp-table-wrap"><table class="dxcp-table"><thead><tr><th scope="col">Description</th><th scope="col">Quantity</th><th scope="col">Unit price</th><th scope="col">VAT rate</th><th scope="col">Line total</th></tr></thead><tbody>
		<?php foreach ( $record['lines'] as $line ) : ?><tr><td><?php echo nl2br( esc_html( $line['description'] ) ); ?></td><td><?php echo esc_html( rtrim( rtrim( number_format( (int) ( $line['quantity_millis'] ?? 1000 ) / 1000, 3, '.', '' ), '0' ), '.' ) ); ?></td><td><?php echo esc_html( dxcp_money( $line['unit_minor'] ?? 0 ) ); ?></td><td><?php echo esc_html( number_format( (int) ( $line['tax_basis_points'] ?? 0 ) / 100, 2 ) ); ?>%</td><td><?php echo esc_html( dxcp_money( $line['total_minor'] ?? 0 ) ); ?></td></tr><?php endforeach; ?>
		</tbody></table></div>
	<?php endif; ?>
	<div class="dxcp-stats">
		<?php $totals = array( 'Subtotal' => $record['subtotal_minor'] ?? null, 'Discount' => $record['discount_minor'] ?? null, 'VAT' => $record['tax_minor'] ?? null, 'Total' => $record['total_minor'] ?? $record['amount_minor'] ?? 0 ); if ( isset( $record['balance_minor'] ) ) { $totals['Outstanding'] = $record['balance_minor']; } if ( ! empty( $record['deposit_minor'] ) ) { $totals['Required deposit'] = $record['deposit_minor']; } foreach ( $totals as $label => $amount ) : if ( null === $amount ) { continue; } ?><div class="dxcp-stat"><span><small><?php echo esc_html( $label ); ?></small><strong class="dxcp-stat__money"><?php echo esc_html( dxcp_money( $amount ) ); ?></strong></span></div><?php endforeach; ?>
	</div>
	<?php $content = ! empty( $record['snapshot'] ) ? $record['snapshot'] : ( $record['draft'] ?? array() ); foreach ( array( 'terms' => 'Terms', 'notes' => 'Notes' ) as $key => $label ) : $value = $content[ $key ] ?? ( $content['document'][ $key ] ?? '' ); if ( $value ) : ?><h3><?php echo esc_html( $label ); ?></h3><p><?php echo nl2br( esc_html( $value ) ); ?></p><?php endif; endforeach; ?>
	<?php
}

function dxcp_business_document_detail( $type, $record ) {
	$view = array( 'quote' => 'quotations', 'invoice' => 'invoices', 'credit' => 'invoices', 'receipt' => 'receipts' )[ $type ];
	$id = $record['id'];
	?>
	<article class="dxcp-card"><?php dxcp_card_heading( strtoupper( $type ), $record['title'] ?? ucfirst( $type ), dxcp_business_url( $view ), 'Back to documents' ); dxcp_business_document_summary( $type, $record ); ?>
		<div class="dxcp-inline"><a class="dxcp-btn" href="<?php echo esc_url( $record['document_url'] ); ?>" target="_blank" rel="noopener noreferrer"><?php echo empty( $record['issued_at'] ) && ! in_array( $type, array( 'receipt', 'credit' ), true ) ? 'Preview draft PDF' : 'Download PDF'; ?> <?php echo dxcp_icon( 'external' ); ?></a>
		<?php if ( 'draft' === ( $record['status'] ?? '' ) && in_array( $type, array( 'quote', 'invoice' ), true ) ) : ?><a class="dxcp-btn" href="<?php echo esc_url( dxcp_business_url( $view, array( 'document_id' => $id, 'edit_document' => 1 ) ) ); ?>">Edit draft</a><?php endif; ?></div>
		<?php if ( 'quote' === $type ) { dxcp_finance_action( 'dxbs_duplicate_quote', array( 'id' => $id ), 'Duplicate into a new draft' ); } ?>
	</article>
	<?php if ( 'draft' === ( $record['status'] ?? '' ) && in_array( $type, array( 'quote', 'invoice' ), true ) ) : ?>
		<article class="dxcp-card"><?php dxcp_card_heading( 'REVIEW BEFORE ISSUING', 'Make this document official' ); ?><p>Check the client’s billing identity, service date, line items, price and terms. Issuing assigns the next document number and preserves this version. Complete your legal business details in Settings first.</p>
			<?php dxcp_business_form( 'dxbs_issue_document' ); foreach ( array( 'type' => $type, 'id' => $id, 'version' => $record['version'] ) as $key => $value ) { dxcp_finance_hidden( $key, $value ); } ?>
			<label class="dxcp-checkbox"><input type="checkbox" name="confirm_issue" value="1" required><span>I have reviewed this exact document and authorise it to be issued.</span></label><label class="dxcp-checkbox"><input type="checkbox" name="send_email" value="1"><span>Email this document to the client after issuing.</span></label><button type="submit" class="dxcp-btn dxcp-btn--dark">Issue <?php echo 'quote' === $type ? 'quotation' : 'invoice'; ?></button></form>
		</article>
	<?php else : ?>
		<article class="dxcp-card"><?php dxcp_card_heading( 'DELIVERY', 'Send a document copy' ); ?><p>Send the issued PDF to the client address saved on this document. Delivery attempts and failures are recorded; duplicate sends are prevented.</p><?php dxcp_finance_action( 'dxbs_send_document', array( 'type' => $type, 'id' => $id ), 'Email document', array( 'confirm_send', 'Send this document to its saved client email address.' ) ); ?></article>
	<?php endif;
	if ( 'quote' === $type && 'accepted' === ( $record['status'] ?? '' ) ) : ?>
		<article class="dxcp-card"><?php dxcp_card_heading( 'ACCEPTED SCOPE', 'Create the invoice plan' ); ?><p>Create linked draft invoices for the accepted total. A deposit and final balance share the same project and cannot exceed the agreed value. Review and issue each invoice separately.</p>
			<?php dxcp_business_form( 'dxbs_convert_quote' ); dxcp_finance_hidden( 'id', $id ); dxcp_finance_hidden( 'version', $record['version'] ); ?>
			<div class="dxcp-form-grid"><label class="dxcp-field"><span>Payment plan</span><select name="plan"><option value="full">Full amount</option><option value="deposit_final">Agreed deposit + final balance</option><option value="instalments">Equal instalments</option></select></label><?php dxcp_field( 'Instalment count (if selected)', 'count', '3', 'number' ); dxcp_field( 'First payment due', 'first_due_date', wp_date( 'Y-m-d' ), 'date', true ); ?></div><button type="submit" class="dxcp-btn dxcp-btn--dark">Create draft invoices</button></form>
		</article>
	<?php endif;
	if ( 'invoice' === $type && ! empty( $record['issued_at'] ) && ! in_array( $record['status'], array( 'void', 'cancelled' ), true ) ) : ?>
		<article class="dxcp-card"><?php dxcp_card_heading( 'BANK TRANSFER', 'Payment instructions' ); ?>
			<?php $link = dxbs_invoice_payment_url( $id ); if ( $link && ! is_wp_error( $link ) ) : ?><a class="dxcp-btn" href="<?php echo esc_url( $link ); ?>" target="_blank" rel="noopener noreferrer">View payment instructions <?php echo dxcp_icon( 'external' ); ?></a><?php endif; ?>
			<p>Create a private link when you want to share this invoice’s transfer instructions. Replacing the link revokes the previous one.</p>
			<?php $share = dxbs_latest_payment_link(); $share_args = array(); if ( is_string( $share ) ) { parse_str( wp_parse_url( $share, PHP_URL_QUERY ) ?: '', $share_args ); } if ( $share && (int) ( $share_args['dxbs_transfer'] ?? 0 ) === (int) $id ) : ?><div class="dxcp-inline"><a class="dxcp-btn" href="<?php echo esc_url( $share ); ?>" target="_blank" rel="noopener noreferrer">Open latest private link</a><button class="dxcp-btn" type="button" data-dxbs-copy="<?php echo esc_attr( $share ); ?>">Copy latest private link</button></div><?php endif; ?>
			<?php dxcp_finance_action( 'dxbs_rotate_payment_link', array( 'invoice_id' => $id ), 'Create or replace private link', array( 'confirm_rotate', 'Create a new link and revoke any previous payment link for this invoice.' ) ); ?>
		</article>
		<article class="dxcp-card"><?php dxcp_card_heading( 'CORRECTIONS', 'Keep the financial history clear' ); ?>
			<details class="dxcp-disclosure"><summary>Create a credit note</summary><p>Credits reduce the amount owed and remain linked to the issued invoice. A credit note does not refund money through your bank.</p><?php dxcp_business_form( 'dxbs_credit_invoice' ); dxcp_finance_hidden( 'id', $id ); dxcp_field( 'Credit amount (£)', 'amount', '', 'text', true ); dxcp_field( 'Supply / correction date', 'supply_date', wp_date( 'Y-m-d' ), 'date', true ); ?><label class="dxcp-field"><span>Reason</span><textarea name="reason" required rows="3" maxlength="4000"></textarea></label><label class="dxcp-checkbox"><input type="checkbox" name="confirm_credit" value="1" required><span>I authorise this credit against the issued invoice.</span></label><button class="dxcp-btn dxcp-btn--small" type="submit">Create credit note</button></form></details>
			<details class="dxcp-disclosure"><summary>Void this invoice</summary><?php dxcp_business_form( 'dxbs_void_invoice' ); dxcp_finance_hidden( 'id', $id ); ?><label class="dxcp-field"><span>Reason for voiding</span><textarea name="reason" rows="3" required maxlength="4000"></textarea></label><label class="dxcp-checkbox"><input type="checkbox" name="confirm_void" value="1" required><span>Void this invoice while preserving its record and verified payment history.</span></label><button class="dxcp-btn dxcp-btn--small" type="submit">Void invoice</button></form></details>
		</article>
	<?php endif;
}

function dxcp_business_payment_management() {
	$review = dxbs_payment_review();
	if ( $review ) : ?>
		<article class="dxcp-card"><?php dxcp_card_heading( 'STEP 2 OF 2 · BANK VERIFICATION', 'Confirm the funds have arrived' ); ?><p>Invoice <?php echo esc_html( $review['invoice_number'] ); ?> · <?php echo esc_html( dxcp_money( $review['amount_minor'] ) ); ?> received on <?php echo esc_html( $review['bank_date'] ); ?>.</p><p>Bank reference: <?php echo esc_html( $review['bank_reference'] ?: 'Not supplied' ); ?>. Receipt delivery: <?php echo 'send' === $review['receipt_delivery'] ? 'Generate and email after confirmation' : 'Generate and hold for manual delivery'; ?>.</p>
			<?php dxcp_business_form( 'dxbs_verify_payment' ); dxcp_finance_hidden( 'token', $review['token'] ); ?><label class="dxcp-checkbox"><input type="checkbox" name="verified_bank" value="1" required><span>I have checked my actual bank account and verified that these funds have arrived.</span></label><button class="dxcp-btn dxcp-btn--dark" type="submit">Confirm verified payment</button></form>
		</article>
	<?php endif; ?>
	<article class="dxcp-card"><?php dxcp_card_heading( 'STEP 1 OF 2', 'Record a bank payment' ); ?><p>A client’s transfer report is a request for you to check your bank. It never marks an invoice paid or authorises a receipt.</p>
		<?php dxcp_business_form( 'dxbs_prepare_payment' ); ?><div class="dxcp-form-grid"><label class="dxcp-field"><span>Invoice</span><select name="invoice_id" required><option value="">Choose an outstanding invoice</option><?php foreach ( dxbs_financial_documents( 'invoice', array( 'limit' => 200 ) ) as $invoice ) : if ( empty( $invoice['issued_at'] ) || (int) $invoice['balance_minor'] <= 0 || in_array( $invoice['status'], array( 'void', 'cancelled' ), true ) ) { continue; } ?><option value="<?php echo (int) $invoice['id']; ?>"><?php echo esc_html( $invoice['number'] . ' · ' . $invoice['client_name'] . ' · ' . dxcp_money( $invoice['balance_minor'] ) . ' outstanding' ); ?></option><?php endforeach; ?></select></label><?php dxcp_field( 'Amount actually received (£)', 'amount', '', 'text', true ); dxcp_field( 'Bank payment date', 'bank_date', wp_date( 'Y-m-d' ), 'date', true ); dxcp_field( 'Bank transaction reference (optional)', 'bank_reference' ); ?><label class="dxcp-field"><span>Receipt after verification</span><select name="receipt_delivery"><option value="hold">Generate receipt and hold email</option><option value="send">Generate and email after I confirm</option></select></label></div><label class="dxcp-checkbox"><input type="checkbox" name="allow_duplicate" value="1"><span>If this matches an earlier entry, I confirm it is a separate transfer I can identify in my bank account.</span></label><button class="dxcp-btn dxcp-btn--dark" type="submit">Review payment details</button></form>
	</article>
	<article class="dxcp-card"><?php dxcp_card_heading( 'ACTUAL RECORDS', 'Payment activity' ); $filters = dxcp_finance_filters( 'payments' ); $payments = dxbs_payment_records( $filters ); if ( ! $payments ) { dxcp_empty( 'No matching payment activity', 'Reported transfers and verified payments will appear here.', 'payments' ); } foreach ( $payments as $payment ) : ?>
		<div class="dxcp-list-row"><span><strong><?php echo esc_html( $payment['invoice_number'] ?? 'Invoice #' . $payment['invoice_id'] ); ?></strong><small><?php echo esc_html( $payment['client_name'] ?? '' ); ?> · <?php echo esc_html( $payment['bank_date'] ?: 'Reported transfer' ); ?></small></span><strong><?php echo esc_html( dxcp_money( $payment['amount_minor'] ) ); ?></strong><?php dxcp_badge( ! empty( $payment['reversed_at'] ) ? 'Reversed' : ucfirst( $payment['status'] ), 'verified' === $payment['status'] && empty( $payment['reversed_at'] ) ? 'green' : '' ); ?></div>
		<?php if ( 'verified' === $payment['status'] && empty( $payment['reversed_at'] ) ) : ?>
			<details class="dxcp-disclosure"><summary>Receipt and correction options</summary><?php dxcp_business_form( 'dxbs_receipt' ); dxcp_finance_hidden( 'payment_id', $payment['id'] ); ?><label class="dxcp-field"><span>Receipt delivery</span><select name="delivery"><option value="hold">Generate and hold</option><option value="send">Generate and email</option></select></label><button type="submit" class="dxcp-btn dxcp-btn--small">Prepare receipt</button></form>
			<?php dxcp_business_form( 'dxbs_reverse_payment' ); dxcp_finance_hidden( 'payment_id', $payment['id'] ); ?><label class="dxcp-field"><span>Reason for reversing this payment record</span><textarea name="reason" required rows="2" maxlength="4000"></textarea></label><label class="dxcp-checkbox"><input type="checkbox" name="verified_bank" value="1" required><span>I have checked the bank record and authorise this reversal. This does not move money through the bank.</span></label><button type="submit" class="dxcp-btn dxcp-btn--small">Reverse payment record</button></form></details>
		<?php endif; endforeach; ?>
	</article>
	<?php
}

function dxcp_business_reports() {
	?>
	<article class="dxcp-card"><?php dxcp_card_heading( 'YOUR ACTUAL RECORDS', 'Business reports' ); $filters = dxcp_finance_filters( 'reports' ); $report = dxbs_reports( $filters ); ?>
		<div class="dxcp-stats"><?php foreach ( array( 'Verified revenue' => 'revenue_received_minor', 'Outstanding invoices' => 'outstanding_minor', 'Overdue balance' => 'overdue_minor', 'Deposit funds received' => 'deposit_received_minor', 'Unpaid final balances' => 'unpaid_final_minor' ) as $label => $key ) : ?><div class="dxcp-stat"><span><small><?php echo esc_html( $label ); ?></small><strong class="dxcp-stat__money"><?php echo esc_html( dxcp_money( $report[ $key ] ?? 0 ) ); ?></strong></span></div><?php endforeach; ?></div>
		<p><?php echo (int) ( $report['quotes_issued'] ?? 0 ); ?> quotations issued · <?php echo (int) ( $report['quotes_accepted'] ?? 0 ); ?> accepted · <?php echo esc_html( number_format( $report['acceptance_rate'] ?? 0, 1 ) ); ?>% acceptance rate.</p>
		<div class="dxcp-overview-grid"><div><h3>Received by month</h3><?php if ( empty( $report['monthly'] ) ) : ?><p class="dxcp-muted">No verified funds in this period.</p><?php endif; foreach ( $report['monthly'] ?? array() as $row ) : ?><div class="dxcp-list-row"><span><?php echo esc_html( $row['month'] ); ?></span><strong><?php echo esc_html( dxcp_money( $row['received_minor'] ) ); ?></strong></div><?php endforeach; ?></div><div><h3>Received by service</h3><?php foreach ( $report['categories'] ?? array() as $row ) : ?><div class="dxcp-list-row"><span><?php echo esc_html( $row['name'] ); ?></span><strong><?php echo esc_html( dxcp_money( $row['received_minor'] ) ); ?></strong></div><?php endforeach; ?></div></div>
		<details class="dxcp-disclosure"><summary>Export records for bookkeeping</summary><?php dxcp_business_form( 'dxbs_export' ); foreach ( array( 'from', 'to', 'category_id', 'client_id' ) as $key ) { dxcp_finance_hidden( $key, $filters[ $key ] ?? '' ); } ?><label class="dxcp-field"><span>Export</span><select name="report"><option value="payments">Payment history</option><option value="invoices">Invoices</option><option value="quotes">Quotations</option><option value="clients">Client directory</option></select></label><button class="dxcp-btn dxcp-btn--small" type="submit">Download CSV</button></form></details>
	</article>
	<article class="dxcp-card"><?php dxcp_card_heading( 'DELIVERY HISTORY', 'Email activity' ); $jobs = dxbs_email_jobs( array( 'limit' => 50 ) ); if ( ! $jobs ) : ?><p class="dxcp-muted">No email activity yet. Documents are sent only when authorised.</p><?php endif; foreach ( $jobs as $job ) : ?><div class="dxcp-list-row"><span><strong><?php echo esc_html( ucwords( str_replace( '_', ' ', $job['template'] ) ) ); ?></strong><small><?php echo esc_html( $job['entity_type'] . ' #' . $job['entity_id'] . ' · ' . $job['created_at'] ); ?></small><?php if ( ! empty( $job['last_error'] ) ) : ?><small><?php echo esc_html( $job['last_error'] ); ?></small><?php endif; ?></span><?php dxcp_badge( ucfirst( $job['status'] ), 'sent' === $job['status'] ? 'green' : '' ); ?></div><?php if ( in_array( $job['status'], array( 'failed', 'held' ), true ) ) { dxcp_finance_action( 'dxbs_retry_email', array( 'job_id' => $job['id'] ), 'Retry authorised delivery', array( 'confirm_send', 'Send this previously authorised email.' ) ); } endforeach; ?>
	</article>
	<?php
}

function dxcp_business_document_archive() {
	if ( ! function_exists( 'dxbs_financial_documents' ) || ! dxbs_is_manager() ) { return; }
	?>
	<article class="dxcp-card"><?php dxcp_card_heading( 'YOUR DOCUMENT ARCHIVE', 'Issued financial documents' ); ?><p>Issued PDFs are preserved privately with their original document snapshots. Drafts are marked clearly and remain editable until issued.</p>
		<?php $filters = dxcp_finance_filters( 'documents' ); foreach ( array( 'quote' => 'Quotations', 'invoice' => 'Invoices', 'receipt' => 'Receipts', 'credit' => 'Credit notes' ) as $type => $label ) : ?><h3><?php echo esc_html( $label ); ?></h3><?php dxcp_business_document_table( $type, dxbs_financial_documents( $type, $filters ) ); endforeach; ?>
		<a class="dxcp-text-link" href="<?php echo esc_url( dxcp_business_url( 'reports' ) ); ?>">View reports and email delivery history <?php echo dxcp_icon( 'arrow' ); ?></a>
	</article>
	<?php
}

function dxcp_business_client_records( $c ) {
	if ( ! function_exists( 'dxbs_account_client_id' ) || dxbs_is_manager() ) { return array(); }
	$client_id = dxbs_account_client_id();
	if ( ! $client_id ) { return array(); }
	$records = array();
	foreach ( array( 'quote', 'invoice', 'receipt', 'credit' ) as $type ) {
		foreach ( dxbs_client_documents( $client_id, $type ) as $record ) {
			if ( ! empty( $record['project_id'] ) && ! empty( $c['pid'] ) && (int) $record['project_id'] !== (int) $c['pid'] ) { continue; }
			$record['document_type'] = $type;
			$records[] = $record;
		}
	}
	return $records;
}

function dxcp_render_business_client_drive( $c ) {
	$records = dxcp_business_client_records( $c );
	if ( ! $records ) { return; }
	?>
	<article class="dxcp-card"><?php dxcp_card_heading( 'KEPT TOGETHER', 'Your financial documents' ); ?><div class="dxcp-document-grid">
		<?php foreach ( $records as $record ) : ?><a class="dxcp-document" href="<?php echo esc_url( $record['document_url'] ); ?>" target="_blank" rel="noopener noreferrer"><span class="dxcp-document__icon"><?php echo dxcp_icon( 'drive' ); ?></span><?php dxcp_badge( ucfirst( $record['document_type'] ) ); ?><h3><?php echo esc_html( $record['number'] ); ?></h3><p><?php echo esc_html( $record['title'] ?? 'Your issued document' ); ?></p><small>Open your private PDF <?php echo dxcp_icon( 'external' ); ?></small></a><?php endforeach; ?>
	</div></article>
	<?php
}

/** Issued financial records are displayed only through the plugin's current client ownership gate. */
function dxcp_render_business_client_payments( $c ) {
	if ( ! function_exists( 'dxbs_account_client_id' ) || dxbs_is_manager() ) { return; }
	$client_id = dxbs_account_client_id();
	if ( ! $client_id ) { return; }
	$types = array( 'quote' => 'Quotations', 'invoice' => 'Invoices', 'receipt' => 'Receipts', 'credit' => 'Credit notes' );
	?>
	<article class="dxcp-card"><?php dxcp_card_heading( 'YOUR AGREED DOCUMENTS', 'Quotations, invoices & receipts' ); ?>
		<?php foreach ( $types as $type => $label ) : $records = dxbs_client_documents( $client_id, $type ); $records = array_values( array_filter( $records, static fn( $record ) => empty( $record['project_id'] ) || empty( $c['pid'] ) || (int) $record['project_id'] === (int) $c['pid'] ) ); if ( ! $records ) { continue; } ?><h3><?php echo esc_html( $label ); ?></h3><?php foreach ( $records as $record ) : ?>
			<div class="dxcp-quotation"><div class="dxcp-inline"><strong><?php echo esc_html( $record['number'] ); ?></strong><?php dxcp_badge( $record['status_label'] ); ?><span><?php echo esc_html( dxcp_money( $record['total_minor'] ?? $record['amount_minor'] ?? 0 ) ); ?></span><a class="dxcp-text-link" href="<?php echo esc_url( $record['document_url'] ); ?>" target="_blank" rel="noopener noreferrer">Review document <?php echo dxcp_icon( 'external' ); ?></a></div>
				<?php if ( 'quote' === $type && in_array( $record['status'], array( 'issued', 'sent', 'awaiting_acceptance' ), true ) ) : dxcp_form_start( 'dxbs_accept_quote' ); dxcp_finance_hidden( 'id', $record['id'] ); dxcp_finance_hidden( 'version', $record['version'] ); ?><label class="dxcp-checkbox"><input type="checkbox" name="confirmation" value="1" required><span>I have reviewed this exact quotation, including its scope and payment terms, and I accept it.</span></label><button class="dxcp-btn dxcp-btn--dark" type="submit">Accept quotation</button></form><?php endif; ?>
				<?php if ( 'invoice' === $type ) : ?><p>Outstanding balance: <strong><?php echo esc_html( dxcp_money( $record['balance_minor'] ) ); ?></strong></p><?php if ( (int) $record['balance_minor'] > 0 && function_exists( 'dxbs_invoice_payment_url' ) ) : $url = dxbs_invoice_payment_url( $record['id'] ); if ( $url && ! is_wp_error( $url ) ) : ?><a class="dxcp-btn dxcp-btn--small" href="<?php echo esc_url( $url ); ?>">Bank transfer instructions <?php echo dxcp_icon( 'arrow' ); ?></a><?php endif; endif; endif; ?>
			</div>
		<?php endforeach; endforeach; ?>
	</article>
	<?php
}

/** Plugin may use this renderer for an invoice-scoped token; it must validate/revoke the token first. */
function dxcp_business_render_transfer( $invoice, $token ) {
	add_filter( 'body_class', static function ( $classes ) { $classes[] = 'dxcp-transfer-page'; return $classes; } );
	get_header( 'client-portal' );
	$bank = $invoice['bank_details'] ?? array();
	?>
	<div class="dxcp-shell dxcp-shell--payment"><div class="dxcp-workspace"><article class="dxcp-card">
		<?php dxcp_card_heading( 'DXNDRE · BANK TRANSFER', 'Your next step, clearly.' ); ?>
		<p>Invoice <strong><?php echo esc_html( $invoice['number'] ); ?></strong> · <?php echo esc_html( $invoice['client_name'] ?? $invoice['snapshot']['client']['name'] ?? '' ); ?></p><h1><?php echo esc_html( dxcp_money( $invoice['balance_minor'] ) ); ?></h1><p>Outstanding for <?php echo esc_html( $invoice['title'] ); ?>.</p>
		<div class="dxcp-stats"><?php foreach ( array( 'Project value' => $invoice['project_total_minor'] ?? $invoice['total_minor'], 'Invoice amount' => $invoice['total_minor'], 'Verified payments' => $invoice['paid_minor'] ?? 0 ) as $label => $value ) : ?><div class="dxcp-stat"><span><small><?php echo esc_html( $label ); ?></small><strong class="dxcp-stat__money"><?php echo esc_html( dxcp_money( $value ) ); ?></strong></span></div><?php endforeach; ?></div>
		<?php dxcp_badge( ucwords( str_replace( '_', ' ', $invoice['status'] ?? 'Awaiting payment' ) ) ); ?>
		<?php if ( ! empty( $invoice['bank_ready'] ) && (int) $invoice['balance_minor'] > 0 ) : ?>
		<?php foreach ( array( 'bank_account_holder' => 'Account holder', 'bank_name' => 'Bank', 'bank_sort_code' => 'Sort code', 'bank_account_number' => 'Account number' ) as $key => $label ) : ?><div class="dxcp-list-row"><span><small><?php echo esc_html( $label ); ?></small><strong><?php echo esc_html( $bank[ $key ] ?? '' ); ?></strong></span><button class="dxcp-btn dxcp-btn--small" type="button" data-dxbs-copy="<?php echo esc_attr( $bank[ $key ] ?? '' ); ?>">Copy</button></div><?php endforeach; ?>
		<div class="dxcp-list-row"><span><small>Payment reference</small><strong><?php echo esc_html( $invoice['number'] ); ?></strong></span><button class="dxcp-btn dxcp-btn--small" type="button" data-dxbs-copy="<?php echo esc_attr( $invoice['number'] ); ?>">Copy reference</button></div>
		<p>Use this exact reference so your transfer can be matched. Your invoice is updated after D’André checks that the funds have arrived.</p>
		<?php if ( ! empty( $invoice['reported'] ) ) : ?><div class="dxcp-notice" role="status">Your transfer report has been received. D’André will check the bank and update your invoice after verification.</div><?php elseif ( (int) $invoice['balance_minor'] > 0 ) : ?><form class="dxcp-form" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post"><?php dxcp_finance_hidden( 'action', 'dxbs_report_transfer' ); dxcp_finance_hidden( '_wpnonce', $invoice['report_nonce'] ?? wp_create_nonce( 'dxbs_report_transfer_' . $invoice['id'] . '_' . $token ) ); dxcp_finance_hidden( 'invoice_id', $invoice['id'] ); dxcp_finance_hidden( 'token', $token ); ?><button class="dxcp-btn dxcp-btn--dark" type="submit">I’ve made the transfer <?php echo dxcp_icon( 'check' ); ?></button><p class="dxcp-muted">This lets D’André know to check the bank. It does not mark your invoice paid or issue a receipt.</p></form><?php else : dxcp_badge( 'Settled · no payment due', 'green' ); endif; ?>
		<?php elseif ( empty( $invoice['bank_ready'] ) ) : ?><div class="dxcp-notice">Payment instructions are not configured yet. Please contact D’André before making a transfer.</div><?php else : dxcp_badge( 'Settled · no payment due', 'green' ); endif; ?>
		<a class="dxcp-text-link" href="<?php echo esc_url( home_url( '/dashboard/?section=payments' ) ); ?>">Return to your workspace <?php echo dxcp_icon( 'arrow' ); ?></a>
	</article></div></div>
	<?php get_footer();
}
