<?php
/** Management presentation in the existing workspace; business rules live in DXNDRE Business. */
defined( 'ABSPATH' ) || exit;

function dxcp_business_query( $key, $fallback = '' ) {
	$value = $_GET[ $key ] ?? $fallback;
	return is_string( $value ) ? wp_unslash( $value ) : $fallback;
}

function dxcp_business_url( $view = 'overview', $args = array() ) {
	return dxcp_portal_url( 'business', 0, array_merge( array( 'business_view' => $view ), $args ) );
}

function dxcp_business_form( $action ) {
	?>
	<form class="dxcp-form" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post">
		<input type="hidden" name="action" value="<?php echo esc_attr( $action ); ?>">
		<?php wp_nonce_field( $action );
}

function dxcp_render_business( $context ) {
	if ( ! function_exists( 'dxbs_is_manager' ) || ! dxbs_is_manager() ) {
		return;
	}
	$views = array( 'overview' => 'Overview', 'clients' => 'Clients', 'quotations' => 'Quotations', 'invoices' => 'Invoices', 'payments' => 'Payments', 'receipts' => 'Receipts', 'projects' => 'Projects', 'documents' => 'Documents', 'reports' => 'Reports', 'settings' => 'Settings' );
	$view = sanitize_key( dxcp_business_query( 'business_view', 'overview' ) );
	$view = isset( $views[ $view ] ) ? $view : 'overview';
	?>
	<div class="dxcp-view-heading">
		<p class="dxcp-eyebrow">ONE PLACE FOR YOUR BUSINESS</p>
		<h1>DXNDRE Business</h1>
		<p>Your clients, services and business details. Connected to the workspace you already use.</p>
	</div>
	<nav class="dxbs-subnav" aria-label="Business modules">
		<?php foreach ( $views as $key => $label ) : ?>
			<a href="<?php echo esc_url( dxcp_business_url( $key ) ); ?>" <?php echo $key === $view ? 'aria-current="page"' : ''; ?>><?php echo esc_html( $label ); ?></a>
		<?php endforeach; ?>
	</nav>
	<?php $notice = dxbs_form_notice(); if ( $notice ) : ?>
		<div class="dxcp-notice<?php echo 'error' === $notice['type'] ? ' dxcp-notice--error' : ''; ?>" role="<?php echo 'error' === $notice['type'] ? 'alert' : 'status'; ?>"><?php echo esc_html( $notice['message'] ); ?></div>
	<?php endif;
	switch ( $view ) {
		case 'clients': dxcp_business_clients(); break;
		case 'settings': dxcp_business_settings(); break;
		case 'projects':
		case 'documents': dxcp_business_existing( $view ); break;
		case 'overview': dxcp_business_overview(); break;
		default: dxcp_business_financial( $view );
	}
}

function dxcp_business_overview() {
	$overview = dxbs_overview();
	$cards = array(
		array( 'Clients', (string) $overview['client_count'], 'clients', 'Active directory records' ),
		array( 'Service categories', (string) $overview['category_count'], 'settings', 'Configurable for all your services' ),
		array( 'Revenue received', dxcp_money( $overview['revenue_received_minor'] ), 'payments', 'Verified Business payments only' ),
		array( 'Outstanding', dxcp_money( $overview['outstanding_minor'] ), 'invoices', 'Issued Business invoices only' ),
		array( 'Pending quotations', (string) $overview['pending_quotations'], 'quotations', 'Business quotation records' ),
		array( 'Overdue invoices', (string) $overview['overdue_invoices'], 'invoices', 'Issued and past their due date' ),
	);
	?>
	<div class="dxcp-stats">
		<?php foreach ( $cards as $card ) : ?>
			<a class="dxcp-stat" href="<?php echo esc_url( dxcp_business_url( $card[2] ) ); ?>"><span><small><?php echo esc_html( $card[0] ); ?></small><strong class="dxcp-stat__money"><?php echo esc_html( $card[1] ); ?></strong><small><?php echo esc_html( $card[3] ); ?></small></span><?php echo dxcp_icon( 'arrow' ); ?></a>
		<?php endforeach; ?>
	</div>
	<article class="dxcp-card">
		<?php dxcp_card_heading( 'YOUR BUSINESS AT A GLANCE', 'Clear records. Confident next steps.' ); ?>
		<p>Manage clients, issue quotations and invoices, verify bank payments, and keep receipts and documents together. Your existing project workspaces and private Drive remain connected.</p>
		<p>These figures use stored financial records and bank payments you have explicitly verified. Client transfer reports and illustrative payment schedules are excluded from received revenue.</p>
		<div class="dxcp-inline"><a class="dxcp-btn dxcp-btn--dark" href="<?php echo esc_url( dxcp_business_url( 'clients', array( 'new_client' => 1 ) ) ); ?>">Add a client <?php echo dxcp_icon( 'plus' ); ?></a><a class="dxcp-btn" href="<?php echo esc_url( dxcp_business_url( 'settings' ) ); ?>">Business settings</a></div>
	</article>
	<div class="dxcp-overview-grid">
		<article class="dxcp-card"><?php dxcp_card_heading( 'RECEIVED', 'Recent payments' ); ?>
			<?php if ( ! $overview['recent_payments'] ) { dxcp_empty( 'No verified payments yet', 'Your explicitly verified bank payments will appear here.', 'payments' ); } foreach ( $overview['recent_payments'] as $payment ) : ?><div class="dxcp-list-row"><span><strong><?php echo esc_html( $payment['client_name'] ); ?></strong><small><?php echo esc_html( $payment['invoice_number'] . ' · ' . $payment['category_name'] ); ?></small></span><span><strong><?php echo esc_html( dxcp_money( $payment['amount_minor'] ) ); ?></strong><small><?php echo esc_html( $payment['bank_date'] ); ?></small></span></div><?php endforeach; ?>
		</article>
		<article class="dxcp-card"><?php dxcp_card_heading( 'COMING UP', 'Payment deadlines' ); ?>
			<?php if ( ! $overview['upcoming_deadlines'] ) { dxcp_empty( 'No Business deadlines yet', 'Issued invoices and their confirmed payment dates appear here.', 'sessions' ); } foreach ( $overview['upcoming_deadlines'] as $deadline ) : ?><div class="dxcp-list-row"><span><strong><?php echo esc_html( $deadline['number'] ); ?></strong><small><?php echo esc_html( $deadline['client_name'] . ' · ' . $deadline['due_date'] ); ?></small></span><strong><?php echo esc_html( dxcp_money( $deadline['balance_minor'] ) ); ?></strong></div><?php endforeach; ?>
		</article>
	</div>
	<article class="dxcp-card"><?php dxcp_card_heading( 'ACROSS YOUR SERVICES', 'Revenue by category' ); ?>
		<div class="dxcp-table-wrap"><table class="dxcp-table"><thead><tr><th scope="col">Category</th><th scope="col">Verified revenue received</th></tr></thead><tbody>
		<?php foreach ( $overview['revenue_by_category'] as $category ) : ?><tr><td><?php echo esc_html( $category['name'] ); ?></td><td><?php echo esc_html( dxcp_money( (int) $category['received_minor'] ) ); ?></td></tr><?php endforeach; ?>
		</tbody></table></div>
	</article>
	<article class="dxcp-card"><?php dxcp_card_heading( 'ACCOUNTABILITY', 'Recent Business changes' ); $rows = dxbs_audit_rows( 10 ); if ( ! $rows ) : ?><p class="dxcp-muted">Saved client, category and settings changes will be recorded here.</p><?php endif; foreach ( $rows as $row ) : ?><div class="dxcp-list-row"><span><strong><?php echo esc_html( ucwords( str_replace( '_', ' ', $row['event'] ) ) ); ?></strong><small><?php echo esc_html( $row['entity_type'] . ( $row['entity_id'] ? ' #' . $row['entity_id'] : '' ) ); ?></small></span><time><?php echo esc_html( get_date_from_gmt( $row['created_at'], 'j M Y · H:i' ) ); ?></time></div><?php endforeach; ?></article>
	<?php
}

function dxcp_business_clients() {
	$search = sanitize_text_field( dxcp_business_query( 'business_search' ) );
	$category_id = absint( dxcp_business_query( 'category_id', '0' ) );
	$status = sanitize_key( dxcp_business_query( 'client_status', 'active' ) );
	$status = in_array( $status, array( 'active', 'archived', 'all' ), true ) ? $status : 'active';
	$sort = sanitize_key( dxcp_business_query( 'client_sort', 'name' ) );
	$sort = in_array( $sort, array( 'name', 'created_at', 'updated_at' ), true ) ? $sort : 'name';
	$page = max( 1, absint( dxcp_business_query( 'business_page', '1' ) ) );
	$categories = dxbs_categories( false );
	$clients = dxbs_clients( array( 'search' => $search, 'category_id' => $category_id, 'status' => $status, 'orderby' => $sort, 'order' => 'name' === $sort ? 'ASC' : 'DESC', 'limit' => 26, 'offset' => ( $page - 1 ) * 25 ) );
	$has_more = count( $clients ) > 25;
	$clients = array_slice( $clients, 0, 25 );
	$editing = absint( dxcp_business_query( 'client_id', '0' ) );
	$client = $editing ? dxbs_client( $editing ) : null;
	$prefill = absint( dxcp_business_query( 'prefill_user', '0' ) );
	if ( ! $client && ! $editing && $prefill ) {
		$client = dxbs_client_from_user( $prefill );
	}
	?>
	<article class="dxcp-card">
		<?php dxcp_card_heading( 'YOUR DIRECTORY', 'Clients', dxcp_business_url( 'clients', array( 'new_client' => 1 ) ), 'Add client' ); ?>
		<form class="dxcp-form" method="get" action="<?php echo esc_url( home_url( '/dashboard/' ) ); ?>">
			<input type="hidden" name="section" value="business"><input type="hidden" name="business_view" value="clients">
			<div class="dxbs-toolbar">
				<?php dxcp_field( 'Search clients', 'business_search', $search, 'search' ); ?>
				<label class="dxcp-field"><span>Service category</span><select name="category_id"><option value="0">All categories</option><?php foreach ( $categories as $category ) : ?><option value="<?php echo absint( $category['id'] ); ?>" <?php selected( $category_id, $category['id'] ); ?>><?php echo esc_html( $category['name'] ); ?></option><?php endforeach; ?></select></label>
				<label class="dxcp-field"><span>Status</span><select name="client_status"><?php foreach ( array( 'active' => 'Active', 'archived' => 'Archived', 'all' => 'All' ) as $key => $label ) : ?><option value="<?php echo esc_attr( $key ); ?>" <?php selected( $status, $key ); ?>><?php echo esc_html( $label ); ?></option><?php endforeach; ?></select></label>
				<label class="dxcp-field"><span>Sort by</span><select name="client_sort"><?php foreach ( array( 'name' => 'Name A–Z', 'created_at' => 'Newest first', 'updated_at' => 'Recently updated' ) as $key => $label ) : ?><option value="<?php echo esc_attr( $key ); ?>" <?php selected( $sort, $key ); ?>><?php echo esc_html( $label ); ?></option><?php endforeach; ?></select></label>
				<button class="dxcp-btn dxcp-btn--small" type="submit">Apply filters</button>
			</div>
		</form>
		<?php if ( ! $clients ) : dxcp_empty( 'No matching clients', 'Add a client or adjust your search. Existing WordPress accounts are imported only when you choose and save them.', 'profile' ); else : ?>
			<div class="dxcp-table-wrap"><table class="dxcp-table"><thead><tr><th scope="col">Client</th><th scope="col">Contact</th><th scope="col">Services</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead><tbody>
			<?php foreach ( $clients as $row ) : ?><tr><td><strong><?php echo esc_html( $row['name'] ); ?></strong><small><?php echo esc_html( $row['company'] ); ?></small></td><td><?php echo esc_html( $row['email'] ); ?><small><?php echo esc_html( $row['phone'] ); ?></small></td><td><?php foreach ( $categories as $category ) { if ( in_array( $category['id'], $row['category_ids'], true ) ) { dxcp_badge( $category['name'] ); } } ?></td><td><?php dxcp_badge( ucfirst( $row['status'] ), 'active' === $row['status'] ? 'green' : '' ); ?></td><td><a class="dxcp-text-link" href="<?php echo esc_url( dxcp_business_url( 'clients', array( 'client_id' => $row['id'] ) ) ); ?>">Open client <?php echo dxcp_icon( 'arrow' ); ?></a></td></tr><?php endforeach; ?>
			</tbody></table></div>
		<?php endif; ?>
		<div class="dxcp-inline">
			<?php $filter_args = array( 'business_search' => $search, 'category_id' => $category_id, 'client_status' => $status, 'client_sort' => $sort ); if ( $page > 1 ) : ?><a class="dxcp-btn dxcp-btn--small" href="<?php echo esc_url( dxcp_business_url( 'clients', array_merge( $filter_args, array( 'business_page' => $page - 1 ) ) ) ); ?>">Previous page</a><?php endif; if ( $has_more ) : ?><a class="dxcp-btn dxcp-btn--small" href="<?php echo esc_url( dxcp_business_url( 'clients', array_merge( $filter_args, array( 'business_page' => $page + 1 ) ) ) ); ?>">Next page</a><?php endif; ?>
		</div>
	</article>
	<?php if ( $editing && ! $client ) : ?><div class="dxcp-notice" role="status">This client could not be found.</div><?php return; endif;
	if ( $client || isset( $_GET['new_client'] ) ) {
		dxcp_business_client_form( $client ?: array(), $categories );
	} else {
		?>
		<article class="dxcp-card">
			<?php dxcp_card_heading( 'START WITH WHAT YOU HAVE', 'Use an existing account' ); ?>
			<p>Choose an account to prefill a new directory record. Review the details and save explicitly. This does not create or email an account.</p>
			<form class="dxcp-form" method="get" action="<?php echo esc_url( home_url( '/dashboard/' ) ); ?>"><input type="hidden" name="section" value="business"><input type="hidden" name="business_view" value="clients"><input type="hidden" name="new_client" value="1"><label class="dxcp-field"><span>Existing WordPress account</span><?php wp_dropdown_users( array( 'name' => 'prefill_user', 'show_option_none' => 'Choose an account', 'option_none_value' => 0, 'show' => 'display_name' ) ); ?></label><button class="dxcp-btn dxcp-btn--small" type="submit">Review account details</button></form>
		</article>
		<?php
	}
}

function dxcp_business_client_form( $client, $categories ) {
	?>
	<article class="dxcp-card">
		<?php dxcp_card_heading( 'CLIENT DETAILS', empty( $client['id'] ) ? 'Add a client' : $client['name'] ); dxcp_business_form( 'dxbs_save_client' ); ?>
		<input type="hidden" name="client[id]" value="<?php echo absint( $client['id'] ?? 0 ); ?>"><input type="hidden" name="client[version]" value="<?php echo absint( $client['version'] ?? 0 ); ?>">
		<div class="dxcp-form-grid">
			<?php foreach ( array( 'name' => 'Client or contact name', 'company' => 'Company / business name', 'email' => 'Email', 'phone' => 'Telephone', 'billing_address_1' => 'Billing address', 'billing_address_2' => 'Address line 2', 'billing_city' => 'City', 'billing_region' => 'County / region', 'billing_postcode' => 'Postcode', 'billing_country' => 'Country code (e.g. GB)' ) as $key => $label ) { dxcp_field( $label, 'client[' . $key . ']', $client[ $key ] ?? ( 'billing_country' === $key ? 'GB' : '' ), 'email' === $key ? 'email' : ( 'phone' === $key ? 'tel' : 'text' ), in_array( $key, array( 'name', 'email' ), true ) ); } ?>
			<label class="dxcp-field"><span>Linked WordPress account (optional)</span><?php wp_dropdown_users( array( 'name' => 'client[wp_user_id]', 'selected' => absint( $client['wp_user_id'] ?? 0 ), 'show_option_none' => 'No account linked', 'option_none_value' => 0, 'show' => 'display_name' ) ); ?></label>
			<label class="dxcp-field"><span>Status</span><select name="client[status]"><option value="active" <?php selected( $client['status'] ?? 'active', 'active' ); ?>>Active</option><option value="archived" <?php selected( $client['status'] ?? 'active', 'archived' ); ?>>Archived</option></select></label>
		</div>
		<fieldset><legend>Associated services</legend><div class="dxcp-inline"><?php foreach ( $categories as $category ) : ?><label class="dxcp-checkbox"><input type="checkbox" name="client[category_ids][]" value="<?php echo absint( $category['id'] ); ?>" <?php checked( in_array( $category['id'], $client['category_ids'] ?? array(), true ) ); ?>><span><?php echo esc_html( $category['name'] . ( $category['active'] ? '' : ' (archived)' ) ); ?></span></label><?php endforeach; ?></div></fieldset>
		<label class="dxcp-field"><span>Internal notes · managers only</span><textarea name="client[notes]" rows="4" maxlength="20000"><?php echo esc_textarea( $client['notes'] ?? '' ); ?></textarea></label>
		<p class="dxcp-muted">Saving directory details does not change an account’s email, permissions or historical documents. Archive a client to keep their record and history.</p>
		<button class="dxcp-btn dxcp-btn--dark" type="submit">Save client <?php echo dxcp_icon( 'check' ); ?></button>
		</form>
	</article>
	<?php if ( ! empty( $client['id'] ) ) : ?>
		<article class="dxcp-card"><?php dxcp_card_heading( 'CONNECTED WORK', 'Projects and financial history' ); ?>
			<?php $projects = dxcp_is_admin() ? get_posts( array( 'post_type' => 'dxcp_project', 'post_status' => array( 'private', 'publish', 'draft' ), 'posts_per_page' => 100, 'meta_key' => '_dxbs_client_id', 'meta_value' => $client['id'] ) ) : array(); if ( ! dxcp_is_admin() ) : ?><p>A site administrator manages the private projects linked to this record.</p><?php elseif ( ! $projects ) : ?><p>No projects are linked to this directory record yet. Administrators can connect an existing client project using its Business classification fields.</p><?php endif; foreach ( $projects as $project ) : ?><div class="dxcp-list-row"><strong><?php echo esc_html( $project->post_title ); ?></strong><?php if ( dxcp_is_admin() ) : ?><a class="dxcp-text-link" href="<?php echo esc_url( get_edit_post_link( $project->ID ) ); ?>">Manage project</a><?php endif; ?></div><?php endforeach; ?>
			<div class="dxcp-actions"><?php foreach ( array( 'quotations' => 'Quotations', 'invoices' => 'Invoices & credit notes', 'receipts' => 'Receipts', 'reports' => 'Payment history' ) as $view => $label ) : ?><a class="dxcp-btn dxcp-btn--small" href="<?php echo esc_url( dxcp_business_url( $view, array( 'client_id' => $client['id'] ) ) ); ?>"><?php echo esc_html( $label ); ?> <?php echo dxcp_icon( 'arrow' ); ?></a><?php endforeach; ?></div>
			<p class="dxcp-muted">Open this client’s quotations, invoices, receipts and verified payment history above. Legacy calculator estimates are imported explicitly as reviewed drafts; legacy payments are not treated as verified funds.</p>
		</article>
	<?php endif;
}

function dxcp_business_settings() {
	$settings = dxbs_settings();
	?>
	<article class="dxcp-card">
		<?php dxcp_card_heading( 'YOUR BUSINESS IDENTITY', 'Business settings' ); ?>
		<p>Use your actual legal identity and payment details. These details appear on issued documents and secure payment instructions. Updating settings does not change historical document snapshots.</p>
		<?php dxcp_business_form( 'dxbs_save_settings' ); ?>
		<input type="hidden" name="settings[version]" value="<?php echo absint( $settings['version'] ); ?>">
		<div class="dxcp-form-grid">
			<?php foreach ( array( 'business_name' => 'Trading / business name', 'legal_name' => 'Legal name', 'company_number' => 'Company registration number (if applicable)', 'address_1' => 'Business address', 'address_2' => 'Address line 2', 'city' => 'City', 'region' => 'County / region', 'postcode' => 'Postcode', 'country' => 'Country code', 'email' => 'Business email', 'phone' => 'Business telephone', 'website' => 'Website' ) as $key => $label ) { dxcp_field( $label, 'settings[' . $key . ']', $settings[ $key ], 'email' === $key ? 'email' : ( 'website' === $key ? 'url' : 'text' ), 'business_name' === $key ); } ?>
			<label class="dxcp-field"><span>Business type</span><select name="settings[company_type]"><?php foreach ( array( '' => 'Choose when ready', 'sole_trader' => 'Sole trader', 'limited_company' => 'Limited company', 'partnership' => 'Partnership', 'other' => 'Other' ) as $key => $label ) : ?><option value="<?php echo esc_attr( $key ); ?>" <?php selected( $settings['company_type'], $key ); ?>><?php echo esc_html( $label ); ?></option><?php endforeach; ?></select></label>
		</div>
		<fieldset><legend>VAT (optional)</legend>
			<label class="dxcp-checkbox"><input type="checkbox" name="settings[vat_registered]" value="1" <?php checked( $settings['vat_registered'] ); ?>><span>This business is registered for VAT</span></label>
			<div class="dxcp-form-grid"><?php dxcp_field( 'VAT registration number', 'settings[vat_number]', $settings['vat_number'] ); dxcp_field( 'Default VAT rate in basis points (2000 = 20%)', 'settings[default_vat_basis_points]', $settings['default_vat_basis_points'], 'number' ); ?></div>
			<p class="dxcp-muted">VAT stays off unless you explicitly enable it and provide the registration number. Drafts use the VAT rates you explicitly configure; issued documents preserve their tax calculations.</p>
		</fieldset>
		<fieldset><legend>Bank transfer details</legend>
			<div class="dxcp-form-grid"><?php foreach ( array( 'bank_account_holder' => 'Account-holder name', 'bank_name' => 'Bank name', 'bank_sort_code' => 'Sort code (6 digits)', 'bank_account_number' => 'Account number (8 digits)' ) as $key => $label ) { dxcp_field( $label, 'settings[' . $key . ']', $settings[ $key ] ); } ?></div>
			<p class="dxcp-muted">Leave blank until verified. Bank details are visible only to Business managers. Invoice-specific payment pages display your currently configured bank instructions after an access check.</p>
		</fieldset>
		<fieldset><legend>Payment reminders</legend><label class="dxcp-checkbox"><input type="checkbox" name="settings[reminders_enabled]" value="1" <?php checked( $settings['reminders_enabled'] ?? false ); ?>><span>Authorise automatic reminders for issued, unpaid invoices.</span></label><?php dxcp_field( 'Minimum days between reminders (1–30)', 'settings[reminder_days]', $settings['reminder_days'] ?? 7, 'number' ); ?><p class="dxcp-muted">Reminders stay off until you enable them. Paid, void and draft invoices are excluded; delivery attempts are logged and duplicate messages are prevented.</p></fieldset><p class="dxcp-muted">Currency: GBP · Timezone: Europe/London</p>
		<button class="dxcp-btn dxcp-btn--dark" type="submit">Save business settings <?php echo dxcp_icon( 'check' ); ?></button>
		</form>
	</article>
	<article class="dxcp-card">
		<?php dxcp_card_heading( 'ROOM TO GROW', 'Service categories' ); ?>
		<p>Add or archive categories without changing historical associations. Existing digital, fitness and photography workspace layouts continue to work.</p>
		<?php foreach ( array_merge( dxbs_categories( false ), array( array( 'id' => 0, 'name' => '', 'description' => '', 'accent' => '#d2ad52', 'active' => true, 'sort_order' => 0, 'version' => 0 ) ) ) as $category ) : ?>
			<details class="dxcp-disclosure"><summary><?php echo esc_html( $category['id'] ? $category['name'] . ( $category['active'] ? '' : ' · archived' ) : 'Add a service category' ); ?></summary>
				<?php dxcp_business_form( 'dxbs_save_category' ); ?><input type="hidden" name="category[id]" value="<?php echo absint( $category['id'] ); ?>"><input type="hidden" name="category[version]" value="<?php echo absint( $category['version'] ); ?>"><?php if ( $category['id'] ) : ?><input type="hidden" name="category[slug]" value="<?php echo esc_attr( $category['slug'] ); ?>"><?php endif; ?>
				<div class="dxcp-form-grid"><?php dxcp_field( 'Category name', 'category[name]', $category['name'], 'text', true ); dxcp_field( 'Accent colour', 'category[accent]', $category['accent'], 'color' ); dxcp_field( 'Display order', 'category[sort_order]', $category['sort_order'], 'number' ); ?></div>
				<label class="dxcp-field"><span>Description</span><textarea name="category[description]" rows="2" maxlength="2000"><?php echo esc_textarea( $category['description'] ); ?></textarea></label><label class="dxcp-checkbox"><input type="checkbox" name="category[active]" value="1" <?php checked( $category['active'] ); ?>><span>Active category</span></label><button class="dxcp-btn dxcp-btn--small" type="submit">Save category</button></form>
			</details>
		<?php endforeach; ?>
	</article>
	<?php
}

function dxcp_business_existing( $view ) {
	$is_project = 'projects' === $view;
	if ( ! $is_project && function_exists( 'dxcp_business_document_archive' ) ) { dxcp_business_document_archive(); }
	?>
	<article class="dxcp-card"><?php dxcp_card_heading( 'YOUR EXISTING WORKFLOW', $is_project ? 'Client projects' : 'Private documents' ); ?>
		<p><?php echo $is_project ? 'The existing Client projects remain the source of truth for service layout, client access, stages and shared links. There is no second project system to maintain.' : 'Client Drive remains the home for private documents, onboarding and task attachments. Private uploads continue to require account and ownership checks.'; ?></p>
		<?php if ( dxcp_is_admin() ) : ?><a class="dxcp-btn dxcp-btn--dark" href="<?php echo esc_url( admin_url( 'edit.php?post_type=' . ( $is_project ? 'dxcp_project' : 'dxcp_document' ) ) ); ?>">Manage <?php echo $is_project ? 'projects' : 'documents'; ?> <?php echo dxcp_icon( 'external' ); ?></a><?php else : ?><p class="dxcp-muted">A site administrator manages these project records. A Business role does not automatically grant access to clients’ private project files.</p><?php endif; ?>
	</article>
	<?php
}

function dxcp_business_planned( $view ) {
	$modules = array(
		'quotations' => array( 'Phase 2', 'Quotations', 'Drafts, reviewed calculator imports, line items, deposits and expiry dates; immutable issued snapshots and branded PDFs. Existing calculator estimates remain available in each client’s Quotations & payments workspace.' ),
		'invoices' => array( 'Phase 2', 'Invoices', 'Sequential numbers, deposit and balance invoices, instalments, due dates, partial payments and corrections. No invoice can be issued from this screen yet.' ),
		'payments' => array( 'Phase 3', 'Bank transfer payments', 'Secure invoice-specific instructions, client payment reports and explicit administrator verification. A client reporting payment will never mark an invoice paid or create revenue by itself.' ),
		'receipts' => array( 'Phase 4', 'Receipts', 'Receipts generated from verified received payments and their exact allocations, with controlled PDF generation and email delivery.' ),
		'reports' => array( 'Phase 5', 'Financial reports', 'Searchable reports, category filters, exports and automation based on the verified financial ledger. Legacy demonstration figures will stay separate.' ),
	);
	$module = $modules[ $view ];
	?>
	<article class="dxcp-card"><?php dxcp_card_heading( $module[0] . ' · PLANNED', $module[1] ); dxcp_badge( 'Not enabled yet' ); ?><p><?php echo esc_html( $module[2] ); ?></p><p>Phase 1 establishes the shared client, service and business records these workflows will use.</p><div class="dxcp-inline"><a class="dxcp-btn" href="<?php echo esc_url( dxcp_business_url( 'clients' ) ); ?>">Manage clients</a><a class="dxcp-text-link" href="<?php echo esc_url( dxcp_business_url( 'overview' ) ); ?>">Back to Business overview <?php echo dxcp_icon( 'arrow' ); ?></a></div></article>
	<?php
}

/* Classify existing CMS projects without changing the legacy layout or ownership model. */
add_action( 'add_meta_boxes_dxcp_project', function () {
	if ( function_exists( 'dxbs_is_manager' ) && dxbs_is_manager() && current_user_can( 'manage_options' ) ) {
		add_meta_box( 'dxbs_project_classification', 'DXNDRE Business', 'dxcp_business_project_metabox', 'dxcp_project', 'side' );
	}
} );

function dxcp_business_project_metabox( $post ) {
	wp_nonce_field( 'dxbs_project_' . $post->ID, 'dxbs_project_nonce' );
	$client_id = absint( get_post_meta( $post->ID, '_dxbs_client_id', true ) );
	$category_id = absint( get_post_meta( $post->ID, '_dxbs_category_id', true ) );
	$fallback = dxbs_category_for_service( get_post_meta( $post->ID, '_dxcp_service', true ) ?: 'digital' );
	if ( ! $category_id && $fallback ) {
		$category_id = $fallback['id'];
	}
	$owner = absint( get_post_meta( $post->ID, '_dxcp_client_id', true ) );
	echo '<p><label>Directory client<br><select name="dxbs_project_client"><option value="0">Not linked</option>';
	foreach ( dxbs_clients( array( 'status' => 'all', 'limit' => 200 ) ) as $client ) {
		if ( $client['wp_user_id'] && $client['wp_user_id'] !== $owner ) { continue; }
		printf( '<option value="%d" %s>%s</option>', $client['id'], selected( $client_id, $client['id'], false ), esc_html( $client['name'] ) );
	}
	echo '</select></label></p><p><label>Service category<br><select name="dxbs_project_category"><option value="0">Not classified</option>';
	foreach ( dxbs_categories( false ) as $category ) {
		printf( '<option value="%d" %s>%s</option>', $category['id'], selected( $category_id, $category['id'], false ), esc_html( $category['name'] ) );
	}
	echo '</select></label></p><p>This classification does not change project access or its digital/fitness/photography layout. A linked account must match the project client.</p>';
}

add_action( 'save_post_dxcp_project', function ( $post_id, $post ) {
	if ( ! function_exists( 'dxbs_is_manager' ) || ! dxbs_is_manager() || ! current_user_can( 'manage_options' ) || ! current_user_can( 'edit_post', $post_id ) || wp_is_post_revision( $post_id ) || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || ! isset( $_POST['dxbs_project_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['dxbs_project_nonce'] ) ), 'dxbs_project_' . $post_id ) ) { return; }
	$client_id = absint( $_POST['dxbs_project_client'] ?? 0 );
	$client = $client_id ? dxbs_client( $client_id ) : null;
	$owner = absint( get_post_meta( $post_id, '_dxcp_client_id', true ) );
	if ( ! $client_id || ( $client && ( ! $client['wp_user_id'] || $client['wp_user_id'] === $owner ) ) ) {
		update_post_meta( $post_id, '_dxbs_client_id', $client_id );
	} else {
		// Reassignment must not leave an old directory association behind.
		delete_post_meta( $post_id, '_dxbs_client_id' );
	}
	$category_id = absint( $_POST['dxbs_project_category'] ?? 0 );
	if ( ! $category_id || in_array( $category_id, array_column( dxbs_categories( false ), 'id' ), true ) ) {
		update_post_meta( $post_id, '_dxbs_category_id', $category_id );
	}
}, 50, 2 );

add_action( 'admin_menu', function () {
	if ( function_exists( 'dxbs_is_manager' ) && dxbs_is_manager() ) {
		add_menu_page( 'DXNDRE Business', 'DXNDRE Business', 'manage_dx_business', 'dxndre-business-workspace', function () {
			echo '<div class="wrap"><h1>DXNDRE Business</h1><p>Your business tools use the same private workspace as the client portal.</p><a class="button button-primary" href="' . esc_url( dxcp_business_url() ) . '">Open Business workspace</a></div>';
		}, 'dashicons-chart-area', 28 );
	}
} );
