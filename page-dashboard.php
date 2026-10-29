<?php
/** Template Name: Client workspace */
defined( 'ABSPATH' ) || exit;

if ( ! is_user_logged_in() ) {
	wp_safe_redirect( add_query_arg( 'redirect_to', home_url( '/dashboard/' ), home_url( '/login/' ) ) );
	exit;
}

$has_client_access = dxcp_is_client_user();
$is_owner = dxcp_is_site_owner();
$is_manager = $is_owner && function_exists( 'dxbs_is_manager' ) && dxbs_is_manager();
if ( ! $has_client_access && ! $is_manager ) {
	wp_die( 'Your account does not have a client workspace yet. Please contact D’André if you’re expecting access.', 'Client workspace', array( 'response' => 403 ) );
}

nocache_headers();
header( 'Cache-Control: private, no-store, max-age=0' );
header( 'X-Robots-Tag: noindex, nofollow' );

$uid = get_current_user_id();
$user = wp_get_current_user();
// A Business manager receives no additional client-record permissions.
$projects = $has_client_access ? ( $is_owner ? get_posts( array( 'post_type'=>'dxcp_project', 'post_status'=>array('publish','private','draft','pending','future'), 'numberposts'=>-1, 'orderby'=>'modified', 'order'=>'DESC' ) ) : array_values( array_filter( dxcp_projects(), static function($item) use ($uid) { return (int)get_post_meta($item->ID,'_dxcp_client_id',true) === (int)$uid; } ) ) ) : array();
$raw_project = $_GET['project_id'] ?? ( $_GET['project'] ?? 0 );
$requested = is_scalar( $raw_project ) ? absint( wp_unslash( $raw_project ) ) : 0;
$project = $has_client_access ? ( $requested ? dxcp_project_for_user( $requested ) : ( $projects[0] ?? null ) ) : null;
if ( $project && ! $is_owner && (int)get_post_meta($project->ID,'_dxcp_client_id',true) !== (int)$uid ) { $project = null; }
if ( $requested && ! $project ) {
	wp_die( 'This project is not available to your account.', 'Access denied', array( 'response' => 403 ) );
}

$pid = $project ? $project->ID : 0;
$service = $pid ? ( get_post_meta( $pid, '_dxcp_service', true ) ?: 'digital' ) : 'digital';
$service_labels = array( 'digital' => 'Digital project', 'fitness' => 'Fitness coaching', 'photography' => 'Photography', 'support' => 'Ongoing support' );
$service_label = $service_labels[ $service ] ?? 'Client';
$support_words = function_exists( 'dxcp_support_words' ) ? dxcp_support_words( $service ) : array( 'tickets' => true, 'singular' => 'ticket', 'start' => 'Submit a ticket' );
$sections = $has_client_access ? array(
	'welcome' => 'Welcome',
	'overview' => $is_owner ? 'Project preview' : 'Overview',
	'journey' => 'Client journey',
	'tasks' => 'Your to-dos',
	'drive' => 'Your Drive',
	'payments' => 'Quotations & payments',
	'support' => $support_words['tickets'] ? 'Support tickets' : 'Support',
	'profile' => 'Your details',
) : array();
if ( $has_client_access && 'fitness' === $service ) {
	$sections = array_slice( $sections, 0, 5, true ) + array( 'sessions' => 'Coaching sessions' ) + array_slice( $sections, 5, null, true );
}
if ( $is_owner ) {
	$sections = array_slice($sections,0,1,true) + array('admin'=>'Admin overview') + array_slice($sections,1,null,true);
}
if ( $is_manager ) {
	$sections['business'] = 'Business manager';
}
$sections['help'] = 'Guide & help';
$home_section = 'welcome';
$raw_section = $_GET['section'] ?? $home_section;
$section = is_string( $raw_section ) ? sanitize_key( wp_unslash( $raw_section ) ) : $home_section;
if ( ! isset( $sections[ $section ] ) ) {
	$section = $home_section;
}

$tasks = $pid ? dxcp_tasks( $pid ) : array();
$tickets = $has_client_access ? array_values( array_filter( dxcp_tickets(), static function ( $ticket ) use ( $pid ) {
	$ticket_project = absint( get_post_meta( $ticket->ID, '_dxcp_project_id', true ) );
	return ! $pid || ! $ticket_project || $ticket_project === (int) $pid;
} ) ) : array();
$documents = $pid ? dxcp_documents( $pid ) : array();
$sessions = $pid ? dxcp_sessions( $pid ) : array();
$quotes = $pid ? dxcp_project_quotes( $pid ) : array();
$billing = $pid ? dxcp_billing_data( $pid ) : array( 'agreed_total_cents' => null, 'paid_cents' => 0, 'balance_cents' => null, 'payments' => array(), 'next_due' => null, 'deferrals' => array(), 'agreement_url' => '' );
$name = $user->first_name ?: $user->display_name;
$first_name = explode( ' ', trim( $name ) )[0];
$context = compact( 'uid', 'user', 'projects', 'project', 'pid', 'service', 'service_label', 'tasks', 'tickets', 'documents', 'sessions', 'quotes', 'billing', 'first_name', 'is_manager', 'has_client_access', 'is_owner' );
$raw_notice = $_GET['notice'] ?? ( $_GET['portal_notice'] ?? '' );
$notice = is_string( $raw_notice ) ? sanitize_key( wp_unslash( $raw_notice ) ) : '';
$notices = array(
	'quote_linked' => 'Your estimate is now connected to this project.',
	'claim_invalid' => 'We could not verify that estimate. Check the reference and private key, or ask D’André to connect it.',
	'claim_limited' => 'Please wait a little before trying to connect another estimate.',
	'quote_changed' => 'This quotation has changed or is not ready to accept. Please review the latest version.',
	'quote_confirmed' => 'Your quotation response has been recorded.',
	'deferral_invalid' => 'We could not save that request. Choose an outstanding payment, a future date and a reason of at least 10 characters.',
	'profile_saved' => 'Your details have been updated.',
	'onboarding_saved' => 'Your onboarding details have been saved.',
	'update_saved' => 'Your update has been saved.',
	'comment_added' => 'Your comment has been added.',
	'comment_saved' => 'Your comment has been added.',
	'task_updated' => 'Your task progress has been updated.',
	'task_review_requested' => 'Your task is ready for D’André to review.',
	'ticket_created' => 'Your ' . $support_words['singular'] . ' has been started.',
	'ticket_updated' => 'Your ' . $support_words['singular'] . ' has been updated.',
	'quote_claimed' => 'Your estimate is now connected to this project.',
	'brief_confirmed' => 'Your brief has been sent for review.',
	'quote_accepted' => 'Your final quotation acceptance has been recorded.',
	'deferral_requested' => 'Your payment deferral request has been sent for review.',
	'invalid_request' => 'We couldn’t save that request. Please check the details and try again.',
	'save_failed' => 'Your update could not be saved. Please try again.',
);
$show_rail = $has_client_access && ! in_array( $section, array('business','admin','welcome'), true );
$nav_icons = array( 'help' => 'support', 'business' => 'payments' );
get_header( 'client-portal' );
?>
<div class="dxcp-shell" data-dxcp-shell>
	<div class="dxcp-sidebar-scrim" data-dxcp-close></div>
	<aside class="dxcp-sidebar" id="dxcp-sidebar" aria-label="Workspace navigation">
		<a class="dxcp-brand" href="<?php echo esc_url( dxcp_portal_url( $home_section, $pid ) ); ?>" aria-label="<?php echo esc_attr( $is_owner ? 'DXNDRE Business' : 'DXNDRE client space' ); ?>">dx<span>.</span><small><?php echo $is_owner ? 'BUSINESS' : 'CLIENT SPACE'; ?></small></a>
		<p class="dxcp-sidebar__label">YOUR WORKSPACE</p>
		<nav aria-label="Workspace sections">
			<?php foreach ( $sections as $key => $label ) : ?>
				<a class="dxcp-nav-link" href="<?php echo esc_url( dxcp_portal_url( $key, $pid ) ); ?>"<?php if ( !in_array($key,array('business','admin','welcome'),true) && !in_array($section,array('business','admin','welcome'),true) ) : ?> data-dxcp-nav="<?php echo esc_attr( $key ); ?>"<?php endif; ?> <?php echo $section === $key ? 'aria-current="page"' : ''; ?>>
					<?php echo dxcp_icon( $nav_icons[ $key ] ?? $key ); ?>
					<span><?php echo esc_html( $label ); ?></span>
					<?php if ( 'tasks' === $key && count( $tasks ) ) : ?>
						<small><?php echo count( array_filter( $tasks, static function ( $task ) { return 'done' !== get_post_meta( $task->ID, '_dxcp_task_status', true ); } ) ); ?></small>
					<?php endif; ?>
				</a>
			<?php endforeach; ?>
		</nav>
		<div class="dxcp-sidebar__bottom">
			<div class="dxcp-help-card"><span>✦</span><h2>A little help?</h2><p>Your guide to this space.</p><a href="<?php echo esc_url( dxcp_portal_url( 'help', $pid ) ); ?>">Explore the guide <?php echo dxcp_icon( 'arrow' ); ?></a></div>
			<a class="dxcp-nav-link" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php echo dxcp_icon( 'external' ); ?> Back to the website</a>
			<a class="dxcp-nav-link" href="<?php echo esc_url( wp_logout_url( home_url( '/login/' ) ) ); ?>"><?php echo dxcp_icon( 'logout' ); ?> Sign out</a>
		</div>
	</aside>
	<div class="dxcp-workspace">
		<header class="dxcp-topbar">
			<div class="dxcp-inline">
				<button class="dxcp-mobile-toggle" type="button" data-dxcp-menu aria-expanded="false" aria-controls="dxcp-sidebar" aria-label="Open workspace menu"><?php echo dxcp_icon( 'menu' ); ?></button>
				<span class="dxcp-breadcrumb">Your workspace <span>/</span> <strong data-dxcp-breadcrumb><?php echo esc_html( $sections[ $section ] ); ?></strong></span>
			</div>
			<div class="dxcp-topbar__account">
				<span class="dxcp-secure"><?php echo dxcp_icon( 'check' ); ?> Private <?php echo $is_owner ? 'business' : 'client'; ?> space</span>
				<button type="button" class="dxcp-theme-toggle" data-dxcp-theme aria-pressed="false" aria-label="Switch to dark mode"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none"/></svg><span data-dxcp-theme-label>Dark mode</span></button>
				<a href="<?php echo esc_url( dxcp_portal_url( $is_owner ? 'admin' : 'profile', $pid ) ); ?>" class="dxcp-avatar" aria-label="<?php echo esc_attr( $is_owner ? 'Your admin overview' : 'Your account details' ); ?>"><?php echo esc_html( mb_strtoupper( mb_substr( $first_name, 0, 1 ) ) ); ?></a>
			</div>
		</header>
		<div class="dxcp-project-switch">
			<span><?php echo dxcp_icon( 'business' === $section ? 'payments' : ( 'fitness' === $service ? 'sessions' : 'journey' ) ); ?> <?php echo esc_html( $is_owner && in_array($section,array('business','admin','welcome'),true) ? 'DXNDRE Business' : ('welcome'===$section ? 'Your client space' : $service_label) ); ?></span>
			<?php if ( $projects && !in_array($section,array('business','admin'),true) ) : ?>
				<form method="get" action="<?php echo esc_url( home_url( '/dashboard/' ) ); ?>">
					<input type="hidden" name="section" value="<?php echo esc_attr( $section ); ?>">
					<label for="dxcp-project">Project</label>
					<select id="dxcp-project" name="project_id" data-dxcp-project>
						<?php foreach ( $projects as $item ) : ?><option value="<?php echo absint( $item->ID ); ?>" <?php selected( $pid, $item->ID ); ?>><?php echo esc_html( $item->post_title ); ?></option><?php endforeach; ?>
					</select>
					<button class="dxcp-btn dxcp-btn--small dxcp-project-go" type="submit">Open</button>
				</form>
			<?php endif; ?>
		</div>
		<?php if ( isset( $notices[ $notice ] ) ) : ?><div class="dxcp-notice" role="status"><?php echo dxcp_icon( 'check' ); ?><?php echo esc_html( $notices[ $notice ] ); ?></div><?php endif; ?>
		<?php if ( $pid && get_post_meta( $pid, '_dxcp_demo', true ) && !in_array($section,array('business','admin','welcome'),true) ) : ?><div class="dxcp-notice dxcp-notice--demo" role="note"><?php echo dxcp_icon( 'check' ); ?>Test workspace · Figures, tasks and sessions here are examples. No payment is due and no session is booked.</div><?php endif; ?>
		<?php if ( $is_owner && !in_array($section,array('business','admin','welcome'),true) ) : ?><div class="dxcp-admin-note">Administrator preview · <a href="<?php echo esc_url( admin_url( 'edit.php?post_type=dxcp_project' ) ); ?>">Manage client projects</a></div><?php endif; ?>
		<div class="dxcp-content-grid<?php echo $show_rail ? '' : ' dxcp-content-grid--business'; ?>">
			<div class="dxcp-content">
				<?php foreach ( $sections as $key => $label ) : ?>
					<section class="dxcp-view" data-dxcp-view="<?php echo esc_attr( $key ); ?>" aria-label="<?php echo esc_attr( $label ); ?>" <?php echo $key !== $section ? 'hidden' : ''; ?> tabindex="-1">
						<?php
						$renderer = 'dxcp_render_' . $key;
						if ( is_callable( $renderer ) && ( !in_array($key,array('business','admin'),true) || $key === $section ) ) {
							call_user_func( $renderer, $context );
						} elseif ( $key === $section ) {
							dxcp_empty( 'This section is being prepared.', 'Please return to your workspace or contact D’André for help.' );
						}
						?>
					</section>
				<?php endforeach; ?>
			</div>
			<?php if ( $show_rail ) { dxcp_render_activity( $context ); } ?>
		</div>
	</div>
</div>
<?php get_footer(); ?>
