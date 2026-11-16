<?php
/** Administrator workspace. Business operations remain in their existing modules. */
defined( 'ABSPATH' ) || exit;

if ( ! dxcp_is_site_owner() || ! dxbs_is_manager() ) {
	wp_die( 'This workspace is available to the site owner.', 'Access denied', array( 'response' => 403 ) );
}

$hq_groups = array(
	'Work' => array(
		'clients' => array( 'Clients & CRM', 'profile' ),
		'projects' => array( 'Projects', 'journey' ),
		'support' => array( 'Support Tickets', 'support' ),
		'tasks' => array( 'Tasks & To-dos', 'tasks' ),
		'documents' => array( 'Documents', 'drive' ),
	),
	'Finance' => array(
		'quotations' => array( 'Quotations', 'journey' ),
		'invoices' => array( 'Invoices', 'drive' ),
		'payments' => array( 'Payments', 'payments' ),
		'receipts' => array( 'Receipts', 'tasks' ),
		'reports' => array( 'Reports & Analytics', 'admin' ),
	),
);
$hq_sections = array( 'overview' => array( 'Dashboard', 'overview' ) ) + $hq_groups['Work'] + $hq_groups['Finance'] + array( 'settings' => array( 'Settings', 'admin' ) );
$view = sanitize_key( dxcp_business_query( 'business_view', 'overview' ) );
if ( 'admin' === $section && array_intersect( array( 'q', 'client_id', 'service', 'phase' ), array_keys( $_GET ) ) ) {
	$view = 'projects';
}
$view = 'search' === $view ? 'search' : ( isset( $hq_sections[ $view ] ) ? $view : 'overview' );
$view_label = $hq_sections[ $view ][0] ?? 'Search';
$preview_url = dxcp_portal_url( 'overview', 0, array( 'portal_preview' => 1 ) );
$first_name = $user->first_name ?: $user->display_name;
$initial = mb_strtoupper( mb_substr( $first_name, 0, 1 ) );
$render_nav_link = static function ( $key, $section ) use ( $view ) {
	?>
	<a class="dxcp-nav-link" href="<?php echo esc_url( dxcp_business_url( $key ) ); ?>" <?php if ( $key === $view ) { echo 'aria-current="page"'; } ?>>
		<?php echo dxcp_icon( $section[1] ); ?><span><?php echo esc_html( $section[0] ); ?></span>
	</a>
	<?php
};

get_header( 'client-portal' );
?>
<div class="dxcp-shell dxhq-shell" data-dxcp-shell>
	<div class="dxcp-sidebar-scrim" data-dxcp-close></div>
	<aside class="dxcp-sidebar" id="dxcp-sidebar" aria-label="Business navigation">
		<a class="dxcp-brand" href="<?php echo esc_url( dxcp_business_url() ); ?>" aria-label="DX Business HQ home">dx<span>.</span><small>BUSINESS HQ</small></a>
		<nav aria-label="Business modules">
			<?php $render_nav_link( 'overview', $hq_sections['overview'] ); ?>
			<?php foreach ( $hq_groups as $label => $items ) : ?>
				<details class="dxhq-nav-group" <?php if ( 'overview' === $view || isset( $items[ $view ] ) || 'settings' === $view ) { echo 'open'; } ?>>
					<summary><?php echo esc_html( $label ); ?></summary>
					<?php foreach ( $items as $key => $item ) { $render_nav_link( $key, $item ); } ?>
				</details>
			<?php endforeach; ?>
			<?php $render_nav_link( 'settings', $hq_sections['settings'] ); ?>
		</nav>
		<div class="dxcp-sidebar__bottom">
			<a class="dxcp-nav-link" href="<?php echo esc_url( $preview_url ); ?>"><?php echo dxcp_icon( 'external' ); ?> Preview client portal</a>
			<a class="dxcp-nav-link" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php echo dxcp_icon( 'external' ); ?> Back to the website</a>
			<a class="dxcp-nav-link" href="<?php echo esc_url( wp_logout_url( home_url( '/login/' ) ) ); ?>"><?php echo dxcp_icon( 'logout' ); ?> Sign out</a>
		</div>
	</aside>
	<div class="dxcp-workspace">
		<header class="dxcp-topbar">
			<nav class="dxcp-breadcrumb" aria-label="Breadcrumb">
				<a href="<?php echo esc_url( dxcp_business_url() ); ?>">DX Business HQ</a> <span aria-hidden="true">/</span>
				<strong aria-current="page"><?php echo esc_html( $view_label ); ?></strong>
			</nav>
			<div class="dxcp-topbar__account">
				<button type="button" class="dxcp-theme-toggle" data-dxcp-theme aria-pressed="false" aria-label="Switch to dark mode"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none"/></svg><span data-dxcp-theme-label>Dark mode</span></button>
				<a href="<?php echo esc_url( dxcp_business_url( 'settings' ) ); ?>" class="dxcp-avatar" aria-label="Business settings"><?php echo esc_html( $initial ); ?></a>
				<button class="dxcp-mobile-toggle" type="button" data-dxcp-menu aria-expanded="false" aria-controls="dxcp-sidebar" aria-label="Open workspace menu"><?php echo dxcp_icon( 'menu' ); ?></button>
			</div>
		</header>
		<div class="dxcp-content-grid dxcp-content-grid--business">
			<div class="dxcp-content">
				<?php if ( in_array( $view, array( 'overview', 'search' ), true ) ) : dxcp_hq_search_form(); endif; ?>
				<?php if ( 'overview' !== $view ) : ?>
					<div class="dxcp-view-heading dxhq-module-heading">
						<h1><?php echo esc_html( $view_label ); ?></h1>
					</div>
				<?php endif; ?>
				<?php $notice = dxbs_form_notice(); if ( $notice ) : ?>
					<div class="dxcp-notice<?php echo 'error' === $notice['type'] ? ' dxcp-notice--error' : ''; ?>" role="<?php echo 'error' === $notice['type'] ? 'alert' : 'status'; ?>"><?php echo esc_html( $notice['message'] ); ?></div>
				<?php endif; ?>
				<?php
				switch ( $view ) {
					case 'overview':
						require __DIR__ . '/hq-overview.php';
						break;
					case 'search':
						dxcp_hq_search();
						break;
					case 'clients':
						dxcp_business_clients();
						break;
					case 'projects':
					case 'documents':
						dxcp_business_existing( $view );
						break;
					case 'support':
						if ( function_exists( 'dxcp_business_render_support' ) ) {
							dxcp_business_render_support();
						} else {
							printf( '<a class="dxcp-btn" href="%s">Manage support tickets</a>', esc_url( admin_url( 'edit.php?post_type=ticket' ) ) );
						}
						break;
					case 'tasks':
						if ( function_exists( 'dxcp_hq_tasks' ) ) {
							dxcp_hq_tasks();
						} else {
							printf( '<a class="dxcp-btn" href="%s">Manage client to-dos</a>', esc_url( admin_url( 'edit.php?post_type=dxcp_task' ) ) );
						}
						break;
					case 'settings':
						dxcp_business_settings();
						break;
					default:
						dxcp_business_financial( $view );
				}
				?>
			</div>
		</div>
	</div>
</div>
<?php get_footer(); ?>
