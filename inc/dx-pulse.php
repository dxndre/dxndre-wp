<?php
/** DX. Pulse presentation. Polls and votes remain owned by bus-polls.php. */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function dx_pulse_status( $id ) {
	$ends = (int) get_post_meta( $id, '_dx_poll_closes', true );
	if ( ! $ends || count( dx_bus_poll_options( $id ) ) < 2 ) { return 'unavailable'; }
	if ( $ends <= time() ) { return 'closed'; }
	return (int) get_post_meta( $id, '_dx_poll_opens', true ) > time() ? 'scheduled' : 'active';
}

function dx_pulse_polls() {
	static $polls;
	if ( null === $polls ) { $polls = get_posts( array( 'post_type' => 'dx_bus_poll', 'post_status' => 'publish', 'numberposts' => -1, 'orderby' => 'date', 'order' => 'DESC' ) ); }
	return $polls;
}

function dx_pulse_stats() {
	global $wpdb;
	$active = 0; $closed = 0;
	foreach ( dx_pulse_polls() as $poll ) { $status = dx_pulse_status( $poll->ID ); $active += 'active' === $status; $closed += 'closed' === $status; }
	$total = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}dx_bus_poll_votes v INNER JOIN {$wpdb->posts} p ON p.ID=v.poll_id WHERE p.post_type='dx_bus_poll' AND p.post_status='publish'" );
	return array( 'active' => $active, 'closed' => $closed, 'total' => $total );
}

add_action( 'rest_api_init', function () {
	register_rest_route( 'dx-buses/v1', '/pulse', array( 'methods' => 'GET', 'permission_callback' => '__return_true', 'callback' => function () { return dx_bus_poll_response( dx_pulse_stats() ); } ) );
} );
add_filter( 'rest_post_dispatch', function ( $response, $server, $request ) {
	if ( 0 === strpos( $request->get_route(), '/dx-buses/v1/' ) ) { $response->header( 'Cache-Control', 'no-store, private, max-age=0' ); }
	return $response;
}, 10, 3 );
add_action( 'template_redirect', function () {
	if ( is_post_type_archive( 'dx_bus_poll' ) || is_singular( 'dx_bus_poll' ) ) { nocache_headers(); }
} );

function dx_pulse_image( $id = 0, $context = 'card' ) {
	if ( $id && has_post_thumbnail( $id ) ) { echo get_the_post_thumbnail( $id, 'large', array( 'loading' => 'hero' === $context ? 'eager' : 'lazy', 'sizes' => '(min-width: 992px) 45vw, 100vw', 'alt' => '' ) ); return; }
	// Existing, locally owned bus photography; never imply it depicts Oxford Street.
	$file = 'hero' === $context ? 'pulse-hero' : 'pulse-network';
	echo '<img src="' . esc_url( get_theme_file_uri( 'assets/img/' . $file . '-1200.webp' ) ) . '" srcset="' . esc_url( get_theme_file_uri( 'assets/img/' . $file . '-640.webp' ) ) . ' 640w, ' . esc_url( get_theme_file_uri( 'assets/img/' . $file . '-1200.webp' ) ) . ' 1200w" sizes="(min-width: 992px) 45vw, 100vw" alt="" width="1200" height="900" loading="' . ( 'hero' === $context ? 'eager' : 'lazy' ) . '">';
}

function dx_pulse_question( $id ) {
	$title = get_the_title( $id );
	$existing = array( 'Would You Support A Pedestrian-Only Oxford Street?' => 'Would you support a pedestrian-only Oxford Street?', 'What Matters Most On Your Everyday Bus Journey?' => 'What matters most on your everyday bus journey?', 'Where Would You Prioritise More Night Buses?' => 'Where would you prioritise more night buses?' );
	return $existing[ $title ] ?? $title;
}

function dx_pulse_category( $id ) {
	$terms = get_the_terms( $id, 'dx_poll_category' );
	return $terms && ! is_wp_error( $terms ) ? $terms[0]->name : 'Around the network';
}

function dx_pulse_icon( $name ) {
	$paths = array(
		'people' => '<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M21 21v-3a6 6 0 0 0-3-5"/>',
		'clock' => '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
		'bars' => '<path d="M5 20v-7M12 20V4M19 20V9"/>',
		'archive' => '<path d="M5 3h11l4 4v14H5zM16 3v5h4M9 12h7M9 16h7"/>',
	);
	return '<svg class="dx-pulse-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . ( $paths[ $name ] ?? $paths['clock'] ) . '</svg>';
}

function dx_pulse_query_value( $key ) {
	$value = $_GET[ $key ] ?? '';
	return is_scalar( $value ) ? (string) wp_unslash( $value ) : '';
}

function dx_pulse_meta( $id ) {
	$status = dx_pulse_status( $id );
	$time = (int) get_post_meta( $id, 'scheduled' === $status ? '_dx_poll_opens' : '_dx_poll_closes', true ); ?>
	<div class="dx-pulse-meta"><span><?php echo dx_pulse_icon( 'people' ); ?> <span data-pulse-response-count><?php echo esc_html( number_format_i18n( dx_bus_poll_total( $id ) ) ); ?></span> responses</span><span><?php echo dx_pulse_icon( 'clock' ); ?> <?php echo 'closed' === $status ? 'Closed' : ( 'scheduled' === $status ? 'Opens' : 'Closes' ); ?> <?php if ( $time ) : ?><time datetime="<?php echo esc_attr( gmdate( 'c', $time ) ); ?>"><?php echo esc_html( wp_date( 'j M Y, H:i T', $time ) ); ?></time><?php else : ?>Date to be confirmed<?php endif; ?></span></div>
	<?php
}

function dx_pulse_feature( $id ) {
	$record = dx_bus_poll_record( $id, dx_bus_poll_identity() );
	if ( is_wp_error( $record ) ) { return; }
	$status = dx_pulse_status( $id ); ?>
	<article class="dx-pulse-feature" data-dx-poll data-poll-endpoint="<?php echo esc_url( rest_url( 'dx-buses/v1/poll/' . $id ) ); ?>" data-rest-nonce="<?php echo is_user_logged_in() ? esc_attr( wp_create_nonce( 'wp_rest' ) ) : ''; ?>" aria-labelledby="pulse-question-<?php echo (int) $id; ?>">
		<div class="dx-pulse-feature-copy">
			<div class="dx-pulse-feature-image"><?php dx_pulse_image( $id ); ?></div>
			<div class="dx-pulse-editorial-content"><div class="dx-pulse-badges"><span class="dx-pulse-feature-badge">ϟ Featured debate</span><span class="dx-pulse-live" data-pulse-state><?php echo 'active' === $status ? 'Live poll' : esc_html( ucfirst( $status ) . ' poll' ); ?></span></div>
			<h2 id="pulse-question-<?php echo (int) $id; ?>"><?php echo esc_html( dx_pulse_question( $id ) ); ?></h2>
			<p><?php echo esc_html( wp_trim_words( get_the_excerpt( $id ), 42 ) ); ?></p>
			<?php dx_pulse_meta( $id ); ?></div>
		</div>
		<div class="dx-pulse-voting">
			<form data-poll-form <?php echo $record['closed'] || $record['scheduled'] ? 'hidden' : ''; ?>><fieldset><legend class="screen-reader-text"><?php echo esc_html( dx_pulse_question( $id ) ); ?></legend>
			<?php foreach ( $record['options'] as $option ) : ?><label class="dx-pulse-choice"><input type="radio" name="choice" value="<?php echo esc_attr( $option['key'] ); ?>" required disabled><span><?php echo esc_html( $option['label'] ); ?></span></label><?php endforeach; ?>
			</fieldset><button class="dx-pulse-button" type="submit" disabled><span data-pulse-submit>Cast your vote</span><span aria-hidden="true">✓</span></button></form>
			<div class="dx-pulse-results" data-poll-results <?php echo $record['showResults'] ? '' : 'hidden'; ?>><h3 tabindex="-1" data-poll-results-title><?php echo $record['closed'] ? 'Final results' : 'Results so far'; ?></h3>
			<?php foreach ( $record['options'] as $option ) : $percent = $option['percent'] ?? 0; ?><div class="dx-pulse-result<?php echo $record['voted'] === $option['key'] ? ' is-your-vote' : ''; ?>" data-poll-result="<?php echo esc_attr( $option['key'] ); ?>"><div><span><?php echo esc_html( $option['label'] ); ?> <small data-your-vote><?php echo $record['voted'] === $option['key'] ? 'Your vote' : ''; ?></small></span><strong data-poll-percent><?php echo esc_html( $percent ); ?>%</strong></div><div class="dx-pulse-bar" aria-hidden="true"><span style="--share:<?php echo esc_attr( $percent ); ?>%"></span></div><small data-poll-count><?php echo esc_html( number_format_i18n( $option['votes'] ?? 0 ) ); ?> votes</small></div><?php endforeach; ?>
			<p data-poll-total><?php echo esc_html( number_format_i18n( $record['total'] ) ); ?> responses</p></div>
			<a class="dx-pulse-button dx-pulse-button-outline" href="<?php echo esc_url( get_permalink( $id ) ); ?>#pulse-voting">View full poll &amp; results <span aria-hidden="true">↗</span></a>
			<p class="dx-pulse-feedback" role="status" aria-live="polite" data-poll-status><?php echo $record['closed'] ? 'Voting has closed. These are the final results.' : 'Loading poll…'; ?></p><button class="dx-pulse-retry" type="button" data-poll-retry hidden>Reload poll ↻</button>
			<noscript><p>Enable JavaScript to vote. Closed poll results are available without JavaScript.</p></noscript>
		</div>
	</article>
	<?php
}

function dx_pulse_card( $id, $results = false ) {
	$record = dx_bus_poll_record( $id );
	$status = dx_pulse_status( $id ); ?>
	<article class="dx-pulse-card<?php echo $results ? ' dx-pulse-closed-card' : ''; ?>">
		<?php if ( ! $results ) : ?><a class="dx-pulse-thumbnail" tabindex="-1" aria-hidden="true" href="<?php echo esc_url( get_permalink( $id ) ); ?>"><?php dx_pulse_image( $id ); ?></a><?php endif; ?>
		<div class="dx-pulse-card-content"><div class="dx-pulse-badges"><span class="<?php echo 'active' === $status ? 'dx-pulse-live' : 'dx-pulse-status'; ?>"><?php echo esc_html( 'active' === $status ? 'Live poll' : ucfirst( $status ) . ' poll' ); ?></span><?php if ( ! $results ) : ?><span class="dx-pulse-category"><?php echo esc_html( dx_pulse_category( $id ) ); ?></span><?php endif; ?></div>
		<h3><a href="<?php echo esc_url( get_permalink( $id ) ); ?>"><?php echo esc_html( dx_pulse_question( $id ) ); ?></a></h3>
		<?php if ( $results ) : $max = $record['options'] ? max( array_column( $record['options'], 'votes' ) ?: array( 0 ) ) : 0; foreach ( $record['options'] as $option ) : ?><div class="dx-pulse-mini-result<?php echo $max > 0 && $max === $option['votes'] ? ' is-winner' : ''; ?>"><div><span><?php echo esc_html( $option['label'] ); ?><?php echo $max > 0 && $max === $option['votes'] ? ' · Leading response' : ''; ?></span><strong><?php echo esc_html( $option['percent'] ); ?>%</strong></div><div class="dx-pulse-bar" aria-hidden="true"><span style="--share:<?php echo esc_attr( $option['percent'] ); ?>%"></span></div></div><?php endforeach; else : ?><p><?php echo esc_html( wp_trim_words( get_the_excerpt( $id ), 22 ) ); ?></p><?php endif; ?>
		<?php dx_pulse_meta( $id ); ?><a class="dx-pulse-card-action" href="<?php echo esc_url( get_permalink( $id ) ); ?>"><span class="screen-reader-text"><?php echo esc_html( $results ? 'Full results: ' : 'Open poll: ' ); ?><?php echo esc_html( dx_pulse_question( $id ) ); ?></span><span aria-hidden="true">↗</span></a></div>
	</article>
	<?php
}

function dx_pulse_nav() { ?>
	<nav class="dx-pulse-nav" aria-label="Buses"><a href="<?php echo esc_url( home_url( '/buses/' ) ); ?>">Overview</a><?php foreach ( array( 'routes' => 'Routes', 'bus-diary' => 'Bus Diary', 'news' => 'News & Views' ) as $anchor => $label ) : ?><a href="<?php echo esc_url( home_url( '/buses/#' . $anchor ) ); ?>"><?php echo esc_html( $label ); ?></a><?php endforeach; ?><a aria-current="page" href="<?php echo esc_url( get_post_type_archive_link( 'dx_bus_poll' ) ); ?>">Polls</a><a href="<?php echo esc_url( home_url( '/buses/#bus-models' ) ); ?>">Bus Models</a><a href="<?php echo esc_url( home_url( '/buses/#photography' ) ); ?>">Photography</a></nav>
<?php }

function dx_pulse_archive() {
	$status = sanitize_key( dx_pulse_query_value( 'pulse_status' ) ?: 'all' );
	if ( ! in_array( $status, array( 'all', 'active', 'closed', 'scheduled' ), true ) ) { $status = 'all'; }
	$category = sanitize_title( dx_pulse_query_value( 'pulse_category' ) );
	$search = sanitize_text_field( dx_pulse_query_value( 'pulse_search' ) );
	$page = max( 1, absint( dx_pulse_query_value( 'pulse_page' ) ) );
	$polls = array_values( array_filter( dx_pulse_polls(), function ( $poll ) use ( $status, $category, $search ) {
		return ( 'all' === $status || dx_pulse_status( $poll->ID ) === $status ) && ( ! $category || has_term( $category, 'dx_poll_category', $poll ) ) && ( ! $search || false !== mb_stripos( $poll->post_title, $search ) );
	} ) );
	$pages = (int) ceil( count( $polls ) / 6 );
	$page = min( $page, max( 1, $pages ) ); ?>
	<section class="viewport-active dx-pulse-section dx-pulse-archive" id="pulse-archive" aria-labelledby="pulse-archive-title"><header class="viewport-active dx-pulse-section-heading"><div><p class="dx-pulse-eyebrow">Every question. Every opinion.</p><h2 id="pulse-archive-title">The polls archive</h2><p>Find a conversation, have your say or explore the final results.</p></div></header>
	<form class="dx-pulse-filters" method="get" action="<?php echo esc_url( get_post_type_archive_link( 'dx_bus_poll' ) . '#pulse-archive' ); ?>"><label>Status<select name="pulse_status"><?php foreach ( array( 'all' => 'All polls', 'active' => 'Active polls', 'closed' => 'Closed polls', 'scheduled' => 'Coming soon' ) as $value => $label ) : ?><option value="<?php echo esc_attr( $value ); ?>" <?php selected( $status, $value ); ?>><?php echo esc_html( $label ); ?></option><?php endforeach; ?></select></label><label>Category<select name="pulse_category"><option value="">All categories</option><?php foreach ( get_terms( array( 'taxonomy' => 'dx_poll_category', 'hide_empty' => true ) ) as $term ) : ?><option value="<?php echo esc_attr( $term->slug ); ?>" <?php selected( $category, $term->slug ); ?>><?php echo esc_html( $term->name ); ?></option><?php endforeach; ?></select></label><label>Search questions<input type="search" name="pulse_search" value="<?php echo esc_attr( $search ); ?>" placeholder="What’s on your mind?"></label><button class="dx-pulse-button" type="submit">Find polls ↗</button></form>
	<div data-pulse-archive-results><p class="dx-pulse-archive-count" role="status" aria-live="polite"><?php echo esc_html( sprintf( _n( '%s poll found', '%s polls found', count( $polls ), 'dxndre' ), number_format_i18n( count( $polls ) ) ) ); ?></p><div class="dx-pulse-active-grid"><?php foreach ( array_slice( $polls, ( $page - 1 ) * 6, 6 ) as $poll ) { dx_pulse_card( $poll->ID, 'closed' === dx_pulse_status( $poll->ID ) ); } ?></div>
	<?php if ( ! $polls ) : ?><div class="dx-pulse-empty"><h3>No polls match those filters.</h3><p>Try a different question or <a href="<?php echo esc_url( get_post_type_archive_link( 'dx_bus_poll' ) . '#pulse-archive' ); ?>">clear the filters</a>.</p></div><?php endif; ?>
	<?php if ( $pages > 1 ) : ?><nav class="dx-pulse-pagination" aria-label="Poll archive pages"><?php for ( $n = 1; $n <= $pages; $n++ ) : ?><a <?php echo $page === $n ? 'aria-current="page"' : ''; ?> href="<?php echo esc_url( add_query_arg( array( 'pulse_status' => $status, 'pulse_category' => $category, 'pulse_search' => $search, 'pulse_page' => $n ), get_post_type_archive_link( 'dx_bus_poll' ) ) . '#pulse-archive' ); ?>"><?php echo (int) $n; ?></a><?php endfor; ?></nav><?php endif; ?></div></section>
	<?php
}

function dx_pulse_hub() {
	$stats = dx_pulse_stats();
	$active = array_values( array_filter( dx_pulse_polls(), function ( $p ) { return 'active' === dx_pulse_status( $p->ID ); } ) );
	$closed = array_values( array_filter( dx_pulse_polls(), function ( $p ) { return 'closed' === dx_pulse_status( $p->ID ); } ) );
	$featured = null;
	foreach ( $active as $poll ) { if ( '1' === get_post_meta( $poll->ID, '_dx_poll_featured', true ) ) { $featured = $poll; break; } }
	if ( ! $featured ) { foreach ( $active as $poll ) { if ( false !== stripos( $poll->post_title, 'Oxford Street' ) ) { $featured = $poll; break; } } }
	if ( ! $featured && $active ) { $featured = $active[0]; } ?>
	<div class="dx-pulse" data-pulse-stats="<?php echo esc_url( rest_url( 'dx-buses/v1/pulse' ) ); ?>">
	<header class="dx-pulse-hero"><div class="dx-pulse-hero-image"><?php dx_pulse_image( 0, 'hero' ); ?></div><div class="dx-pulse-wrap"><p class="dx-pulse-eyebrow">DX. Pulse <span>/</span> Around the network</p><h1>What’s your take?</h1><p>Your voice on London’s buses, routes and the future of transport.</p><div class="dx-pulse-stats"><a href="#pulse-active"><?php echo dx_pulse_icon( 'bars' ); ?><strong data-pulse-stat="active"><?php echo (int) $stats['active']; ?></strong> Active polls</a><a href="#pulse-archive"><?php echo dx_pulse_icon( 'clock' ); ?><strong data-pulse-stat="total"><?php echo esc_html( number_format_i18n( $stats['total'] ) ); ?></strong> Total responses</a><a href="<?php echo esc_url( add_query_arg( 'pulse_status', 'closed', get_post_type_archive_link( 'dx_bus_poll' ) ) . '#pulse-archive' ); ?>"><?php echo dx_pulse_icon( 'archive' ); ?> Results archive</a></div></div></header>
	<div class="dx-pulse-wrap dx-pulse-content"><?php if ( $featured ) { dx_pulse_feature( $featured->ID ); } else { ?><div class="dx-pulse-empty"><h2>The next question is on its way.</h2><p>There are no open polls right now. Explore the archive below.</p></div><?php } ?>
	<section class="viewport-active dx-pulse-section" id="pulse-active" aria-labelledby="pulse-active-title"><header class="viewport-active dx-pulse-section-heading"><div><h2 id="pulse-active-title">Active polls</h2><p>More questions, more opinions. Have your say across the network.</p></div><a class="dx-pulse-text-link" href="<?php echo esc_url( add_query_arg( 'pulse_status', 'active', get_post_type_archive_link( 'dx_bus_poll' ) ) . '#pulse-archive' ); ?>">Browse all active polls ↗</a></header><div class="dx-pulse-active-grid"><?php foreach ( array_slice( $active, 0, 5 ) as $poll ) { if ( ! $featured || $poll->ID !== $featured->ID ) { dx_pulse_card( $poll->ID ); } } ?></div><?php if ( count( $active ) <= ( $featured ? 1 : 0 ) ) : ?><p class="dx-pulse-empty">You’re up to date. More questions will appear here when they open.</p><?php endif; ?></section>
	<section class="viewport-active dx-pulse-section" aria-labelledby="pulse-closed-title"><header class="viewport-active dx-pulse-section-heading"><div><h2 id="pulse-closed-title">The Network Has Spoken</h2><p>Past polls, real results. See what the community thinks.</p></div><a class="dx-pulse-text-link" href="<?php echo esc_url( add_query_arg( 'pulse_status', 'closed', get_post_type_archive_link( 'dx_bus_poll' ) ) . '#pulse-archive' ); ?>">View results archive ↗</a></header><div class="dx-pulse-closed-grid"><?php foreach ( array_slice( $closed, 0, 3 ) as $poll ) { dx_pulse_card( $poll->ID, true ); } ?></div><?php if ( ! $closed ) : ?><div class="dx-pulse-empty"><span class="dx-pulse-eyebrow">The conversation is still open</span><h3>Today’s opinions. Tomorrow’s results.</h3><p>Once a poll closes, its final breakdown will appear here. No forecasts, just your votes.</p></div><?php endif; ?></section>
	<?php dx_pulse_archive(); ?><p class="dx-pulse-rules">One vote per signed-in account, or per browser for guests. Guest votes are not identity-verified: clearing cookies or changing browser can bypass this limit. Votes cannot be changed.</p></div></div>
	<?php
}

function dx_pulse_teaser() {
	$stats = dx_pulse_stats();
	$active = array_values( array_filter( dx_pulse_polls(), function ( $poll ) { return 'active' === dx_pulse_status( $poll->ID ); } ) );
	$featured = $active[0] ?? null;
	foreach ( $active as $poll ) { if ( '1' === get_post_meta( $poll->ID, '_dx_poll_featured', true ) ) { $featured = $poll; break; } }
	ob_start(); ?>
	<section id="bus-polls" class="dx-pulse dx-pulse-teaser" aria-labelledby="pulse-teaser-title">
		<div class="dx-pulse-teaser-art" aria-hidden="true"><?php dx_pulse_image( 0, 'hero' ); ?></div>
		<div class="dx-pulse-wrap"><header class="dx-pulse-teaser-heading"><p class="dx-pulse-eyebrow">DX. Pulse / Around the network</p><h2 id="pulse-teaser-title">What’s your take?</h2><p>Your voice on London’s buses, routes and the future of transport.</p></header>
		<?php if ( $featured ) { dx_pulse_feature( $featured->ID ); } else { ?><p>The next question is on its way.</p><?php } ?>
		<div class="dx-pulse-teaser-invite"><p>One question is just the beginning. Explore every conversation on DX. Pulse.</p><a class="dx-pulse-button" href="<?php echo esc_url( get_post_type_archive_link( 'dx_bus_poll' ) ); ?>">Explore more polls <span aria-hidden="true">↗</span></a></div></div>
	</section>
	<?php return ob_get_clean();
}
