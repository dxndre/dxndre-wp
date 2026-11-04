<?php
/** Bus community polls. Votes use an atomic unique record, never editable counters. */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function dx_bus_polls_install() {
	if ( '1' === get_option( 'dx_bus_polls_schema' ) ) { return; }
	global $wpdb;
	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	$table = $wpdb->prefix . 'dx_bus_poll_votes';
	dbDelta( "CREATE TABLE $table (
		id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
		poll_id bigint(20) unsigned NOT NULL,
		option_key varchar(64) NOT NULL,
		voter_hash char(64) NOT NULL,
		created_at datetime NOT NULL,
		PRIMARY KEY  (id),
		UNIQUE KEY poll_voter (poll_id,voter_hash),
		KEY poll_option (poll_id,option_key)
	) " . $wpdb->get_charset_collate() . ';' );
	if ( $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $wpdb->esc_like( $table ) ) ) === $table ) { update_option( 'dx_bus_polls_schema', '1', false ); }
}

add_action( 'init', function () {
	register_post_type( 'dx_bus_poll', array(
		'labels' => array( 'name' => 'Bus polls', 'singular_name' => 'Bus poll', 'add_new_item' => 'Add bus poll', 'edit_item' => 'Edit bus poll' ),
		'public' => true, 'show_ui' => true, 'show_in_rest' => false,
		'menu_icon' => 'dashicons-chart-bar', 'supports' => array( 'title', 'editor', 'excerpt', 'thumbnail', 'revisions' ),
		'has_archive' => 'buses/polls', 'rewrite' => array( 'slug' => 'buses/polls', 'with_front' => false ),
		'capability_type' => 'post', 'map_meta_cap' => true,
	) );
	dx_bus_polls_install();
} );

function dx_bus_poll_total( $post_id ) {
	global $wpdb;
	return (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$wpdb->prefix}dx_bus_poll_votes WHERE poll_id=%d", $post_id ) );
}

function dx_bus_poll_options( $post_id ) {
	$value = get_post_meta( $post_id, '_dx_poll_options', true );
	return is_array( $value ) ? $value : array();
}

function dx_bus_poll_close_time( $local ) {
	if ( ! is_string( $local ) || ! preg_match( '/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/', $local ) ) { return 0; }
	$date = DateTimeImmutable::createFromFormat( '!Y-m-d\TH:i', $local, wp_timezone() );
	return $date && $date->format( 'Y-m-d\TH:i' ) === $local ? $date->getTimestamp() : 0;
}

add_action( 'add_meta_boxes_dx_bus_poll', function () {
	add_meta_box( 'dx-poll-options', 'Voting & closing time', function ( $post ) {
		wp_nonce_field( 'dx_poll_save', 'dx_poll_nonce' );
		$options = dx_bus_poll_options( $post->ID );
		$total = dx_bus_poll_total( $post->ID );
		$ends = (int) get_post_meta( $post->ID, '_dx_poll_closes', true );
		echo '<p>Use the title for the question and the editor for context. Published polls appear on the Buses page automatically. Voting closes at the exact time below and the final results remain available.</p>';
		echo '<p><label><strong>Answer choices</strong> (2–8, one per line)<br><textarea class="widefat" name="dx_poll_options" rows="8" ' . ( $total ? 'readonly' : '' ) . '>' . esc_textarea( implode( "\n", array_column( $options, 'label' ) ) ) . '</textarea></label></p>';
		if ( $total ) { echo '<p><strong>' . esc_html( $total ) . ' votes recorded.</strong> Answer choices are locked once voting begins so earlier votes keep their meaning.</p>'; }
		echo '<p><label><strong>Closes</strong> (' . esc_html( wp_timezone_string() ) . ')<br><input type="datetime-local" name="dx_poll_closes" required value="' . esc_attr( $ends ? wp_date( 'Y-m-d\TH:i', $ends ) : '' ) . '"></label></p>';
		echo '<p class="description">A closing time and at least two distinct choices are required for voting. One vote per signed-in account, or per browser for guests. Guest votes are not identity-verified; clearing cookies or using another browser can bypass that limit. No names, email addresses or raw IP addresses are stored with votes.</p>';
	}, 'dx_bus_poll', 'normal', 'high' );
} );

add_action( 'save_post_dx_bus_poll', function ( $post_id ) {
	if ( wp_is_post_revision( $post_id ) || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || ! current_user_can( 'edit_post', $post_id ) || empty( $_POST['dx_poll_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['dx_poll_nonce'] ) ), 'dx_poll_save' ) ) { return; }
	$ends = dx_bus_poll_close_time( sanitize_text_field( wp_unslash( $_POST['dx_poll_closes'] ?? '' ) ) );
	$labels = array_values( array_filter( array_map( function ( $line ) { return mb_substr( sanitize_text_field( $line ), 0, 180 ); }, preg_split( '/\R/', (string) wp_unslash( $_POST['dx_poll_options'] ?? '' ) ) ) ) );
	$distinct = array_unique( array_map( 'mb_strtolower', $labels ) );
	if ( ! $ends || count( $labels ) < 2 || count( $labels ) > 8 || count( $distinct ) !== count( $labels ) ) {
		set_transient( 'dx_poll_error_' . get_current_user_id(), 'The poll needs a valid closing date/time and 2–8 different answer choices. Existing voting settings have been kept.', MINUTE_IN_SECONDS );
		return;
	}
	if ( ! dx_bus_poll_total( $post_id ) ) {
		$existing = dx_bus_poll_options( $post_id );
		$options = array();
		foreach ( $labels as $index => $label ) {
			$options[] = array( 'key' => $existing[ $index ]['key'] ?? wp_generate_uuid4(), 'label' => $label );
		}
		update_post_meta( $post_id, '_dx_poll_options', $options );
	}
	update_post_meta( $post_id, '_dx_poll_closes', $ends );
} );

add_action( 'admin_notices', function () {
	$error = get_transient( 'dx_poll_error_' . get_current_user_id() );
	if ( $error ) { delete_transient( 'dx_poll_error_' . get_current_user_id() ); echo '<div class="notice notice-error"><p>' . esc_html( $error ) . '</p></div>'; }
} );

add_filter( 'manage_dx_bus_poll_posts_columns', function ( $columns ) {
	$columns['dx_poll_closes'] = 'Voting closes'; $columns['dx_poll_votes'] = 'Votes'; return $columns;
} );
add_action( 'manage_dx_bus_poll_posts_custom_column', function ( $column, $post_id ) {
	if ( 'dx_poll_votes' === $column ) { echo esc_html( dx_bus_poll_total( $post_id ) ); }
	if ( 'dx_poll_closes' === $column ) { $ends = (int) get_post_meta( $post_id, '_dx_poll_closes', true ); echo esc_html( $ends ? wp_date( 'j M Y, H:i', $ends ) . ( $ends <= time() ? ' · Closed' : '' ) : 'Not configured' ); }
}, 10, 2 );

/** No direct identifier is written to the votes table. The opaque guest token is HttpOnly. */
function dx_bus_poll_identity( $create = false ) {
	if ( is_user_logged_in() ) { return hash_hmac( 'sha256', 'user:' . get_current_user_id(), wp_salt( 'auth' ) ); }
	$cookie = isset( $_COOKIE['dx_bus_voter'] ) ? sanitize_text_field( wp_unslash( $_COOKIE['dx_bus_voter'] ) ) : '';
	if ( ! preg_match( '/^[a-f0-9]{64}$/', $cookie ) ) {
		if ( ! $create ) { return ''; }
		$cookie = bin2hex( random_bytes( 32 ) );
		if ( ! headers_sent() ) {
			setcookie( 'dx_bus_voter', $cookie, array( 'expires' => time() + YEAR_IN_SECONDS, 'path' => COOKIEPATH ?: '/', 'secure' => is_ssl(), 'httponly' => true, 'samesite' => 'Lax' ) );
		}
		$_COOKIE['dx_bus_voter'] = $cookie;
	}
	return hash_hmac( 'sha256', 'guest:' . $cookie, wp_salt( 'auth' ) );
}

function dx_bus_poll_record( $post_id, $identity = '' ) {
	$post = get_post( $post_id );
	if ( ! $post || 'dx_bus_poll' !== $post->post_type || 'publish' !== $post->post_status ) { return new WP_Error( 'poll_missing', 'This poll is not available.', array( 'status' => 404 ) ); }
	$ends = (int) get_post_meta( $post_id, '_dx_poll_closes', true );
	$options = dx_bus_poll_options( $post_id );
	$configured = $ends > 0 && count( $options ) >= 2 && count( $options ) <= 8;
	$closed = $configured && $ends <= time();
	global $wpdb;
	$table = $wpdb->prefix . 'dx_bus_poll_votes';
	$voted = $identity ? (string) $wpdb->get_var( $wpdb->prepare( "SELECT option_key FROM $table WHERE poll_id=%d AND voter_hash=%s", $post_id, $identity ) ) : '';
	$counts = $wpdb->get_results( $wpdb->prepare( "SELECT option_key, COUNT(*) AS count FROM $table WHERE poll_id=%d GROUP BY option_key", $post_id ), OBJECT_K );
	$total = array_sum( array_map( function ( $row ) { return (int) $row->count; }, $counts ) );
	foreach ( $options as &$option ) {
		$count = isset( $counts[ $option['key'] ] ) ? (int) $counts[ $option['key'] ]->count : 0;
		$option['votes'] = $count; $option['percent'] = $total ? round( $count / $total * 100, 1 ) : 0;
	}
	unset( $option );
	return array( 'id' => (int) $post_id, 'question' => get_the_title( $post_id ), 'configured' => $configured, 'closed' => $closed, 'closesAt' => $ends ? gmdate( 'c', $ends ) : '', 'total' => $total, 'voted' => $voted, 'options' => $options, 'showResults' => $closed || (bool) $voted, 'token' => $identity ? wp_create_nonce( 'dx_poll_vote_' . $post_id . '_' . $identity ) : '' );
}

function dx_bus_poll_response( $data, $status = 200 ) {
	$response = new WP_REST_Response( $data, $status );
	$response->header( 'Cache-Control', 'no-store, private, max-age=0' );
	return $response;
}

function dx_bus_poll_vote( WP_REST_Request $request ) {
	$id = absint( $request['id'] );
	$identity = dx_bus_poll_identity();
	$token = sanitize_text_field( (string) $request->get_param( 'token' ) );
	if ( ! $identity || ! wp_verify_nonce( $token, 'dx_poll_vote_' . $id . '_' . $identity ) ) { return new WP_Error( 'poll_token', 'Please reload the poll before voting.', array( 'status' => 403 ) ); }
	$origin = $request->get_header( 'origin' );
	if ( $origin && ( wp_parse_url( $origin, PHP_URL_HOST ) !== wp_parse_url( home_url(), PHP_URL_HOST ) || wp_parse_url( $origin, PHP_URL_PORT ) !== wp_parse_url( home_url(), PHP_URL_PORT ) ) ) { return new WP_Error( 'poll_origin', 'Please vote from the original website.', array( 'status' => 403 ) ); }
	$record = dx_bus_poll_record( $id, $identity );
	if ( is_wp_error( $record ) ) { return $record; }
	if ( ! $record['configured'] ) { return new WP_Error( 'poll_not_ready', 'Voting is not open for this poll.', array( 'status' => 409 ) ); }
	if ( $record['closed'] ) { return dx_bus_poll_response( array_merge( $record, array( 'message' => 'Voting has closed. These are the final results.' ) ), 409 ); }
	if ( $record['voted'] ) { return dx_bus_poll_response( array_merge( $record, array( 'message' => 'Your vote has already been counted.' ) ), 409 ); }
	$choice = sanitize_key( (string) $request->get_param( 'choice' ) );
	if ( ! in_array( $choice, array_column( $record['options'], 'key' ), true ) ) { return new WP_Error( 'poll_choice', 'Please choose one of the available answers.', array( 'status' => 400 ) ); }
	$rate_key = 'dx_poll_rate_' . hash_hmac( 'sha256', (string) ( $_SERVER['REMOTE_ADDR'] ?? '' ) . '|' . gmdate( 'Y-m-d-H' ), wp_salt( 'nonce' ) );
	$rate = (int) get_transient( $rate_key );
	if ( $rate >= 20 ) { return new WP_Error( 'poll_rate', 'Too many votes have been sent from this connection. Please try again later.', array( 'status' => 429 ) ); }
	global $wpdb;
	$table = $wpdb->prefix . 'dx_bus_poll_votes';
	$inserted = $wpdb->query( $wpdb->prepare( "INSERT IGNORE INTO $table (poll_id,option_key,voter_hash,created_at) SELECT %d,%s,%s,UTC_TIMESTAMP() WHERE %d > UNIX_TIMESTAMP()", $id, $choice, $identity, (int) get_post_meta( $id, '_dx_poll_closes', true ) ) );
	if ( false === $inserted ) { return new WP_Error( 'poll_unavailable', 'Your vote could not be saved. Please try again.', array( 'status' => 503 ) ); }
	if ( $inserted ) { set_transient( $rate_key, $rate + 1, HOUR_IN_SECONDS ); }
	$record = dx_bus_poll_record( $id, $identity );
	return dx_bus_poll_response( array_merge( $record, array( 'message' => $inserted ? 'Your vote is counted. Thank you.' : ( $record['closed'] ? 'Voting has closed. These are the final results.' : 'Your vote has already been counted.' ) ) ), $inserted ? 200 : 409 );
}

add_action( 'rest_api_init', function () {
	register_rest_route( 'dx-buses/v1', '/poll/(?P<id>\d+)', array(
		array( 'methods' => WP_REST_Server::READABLE, 'permission_callback' => '__return_true', 'callback' => function ( $request ) {
			$data = dx_bus_poll_record( absint( $request['id'] ), dx_bus_poll_identity( true ) );
			return is_wp_error( $data ) ? $data : dx_bus_poll_response( $data );
		} ),
		array( 'methods' => WP_REST_Server::CREATABLE, 'permission_callback' => '__return_true', 'callback' => 'dx_bus_poll_vote' ),
	) );
} );

function dx_bus_poll_results( $record ) {
	?>
	<div class="dx-poll-results" <?php echo $record['showResults'] ? '' : 'hidden'; ?> data-poll-results>
		<h4 tabindex="-1" data-poll-results-title><?php echo $record['closed'] ? 'Final Results' : 'Results So Far'; ?></h4>
		<?php foreach ( $record['options'] as $option ) : ?>
		<div class="dx-poll-result" data-poll-result="<?php echo esc_attr( $option['key'] ); ?>">
			<div><span><?php echo esc_html( $option['label'] ); ?></span><strong data-poll-percent><?php echo esc_html( $option['percent'] ); ?>%</strong></div>
			<div class="dx-poll-bar" aria-hidden="true"><span style="--vote-share:<?php echo esc_attr( $option['percent'] ); ?>%"></span></div>
			<small data-poll-count><?php echo esc_html( sprintf( _n( '%s vote', '%s votes', $option['votes'], 'dxndre' ), number_format_i18n( $option['votes'] ) ) ); ?></small>
		</div>
		<?php endforeach; ?>
		<p class="dx-poll-total" data-poll-total><?php echo esc_html( sprintf( _n( '%s vote in total', '%s votes in total', $record['total'], 'dxndre' ), number_format_i18n( $record['total'] ) ) ); ?></p>
	</div>
	<?php
}

function dx_bus_poll_card( $post_id ) {
	$record = dx_bus_poll_record( $post_id );
	if ( is_wp_error( $record ) ) { return; }
	$ends = (int) get_post_meta( $post_id, '_dx_poll_closes', true );
	?>
	<article class="dx-poll-card" data-dx-poll data-poll-endpoint="<?php echo esc_url( rest_url( 'dx-buses/v1/poll/' . $post_id ) ); ?>" data-rest-nonce="<?php echo is_user_logged_in() ? esc_attr( wp_create_nonce( 'wp_rest' ) ) : ''; ?>" aria-labelledby="dx-poll-question-<?php echo (int) $post_id; ?>">
		<?php if ( get_post_meta( $post_id, '_dx_poll_sample', true ) ) : ?><p class="dx-poll-sample"><span aria-hidden="true">✦</span> Sample Poll · For Testing</p><?php endif; ?>
		<p class="dx-poll-eyebrow"><span data-poll-state><?php echo $record['closed'] ? 'The Final Word' : 'Your View'; ?></span><span aria-hidden="true">↗</span></p>
		<h3 id="dx-poll-question-<?php echo (int) $post_id; ?>"><a href="<?php echo esc_url( get_permalink( $post_id ) ); ?>"><?php echo esc_html( $record['question'] ); ?></a></h3>
		<?php $excerpt = get_the_excerpt( $post_id ); if ( $excerpt && ! is_singular( 'dx_bus_poll' ) ) : ?><p><?php echo esc_html( wp_trim_words( $excerpt, 35 ) ); ?></p><?php endif; ?>
		<p class="dx-poll-deadline"><span data-poll-deadline-label><?php echo $record['closed'] ? 'Voting Closed' : 'Voting Closes'; ?></span> <?php if ( $ends ) : ?><time datetime="<?php echo esc_attr( gmdate( 'c', $ends ) ); ?>"><?php echo esc_html( wp_date( 'j F Y · H:i T', $ends ) ); ?></time><?php else : ?>To be confirmed<?php endif; ?></p>
		<form data-poll-form <?php echo $record['closed'] ? 'hidden' : ''; ?>>
			<fieldset><legend class="screen-reader-text"><?php echo esc_html( $record['question'] ); ?></legend>
			<?php foreach ( $record['options'] as $option ) : ?><label class="dx-poll-choice"><input type="radio" name="choice" value="<?php echo esc_attr( $option['key'] ); ?>" required disabled><span><?php echo esc_html( $option['label'] ); ?></span><span aria-hidden="true">✓</span></label><?php endforeach; ?>
			</fieldset><button type="submit" disabled>Cast Your Vote <span aria-hidden="true">↗</span></button>
		</form>
		<?php dx_bus_poll_results( $record ); ?>
		<p class="dx-poll-status" role="status" aria-live="polite" data-poll-status><?php echo $record['closed'] ? 'Voting has closed. Final results are shown above.' : ( $record['configured'] ? 'Loading voting…' : 'Voting will open when this poll is ready.' ); ?></p>
		<button type="button" class="dx-poll-retry" data-poll-retry hidden>Try Again ↻</button>
		<noscript><p>Enable JavaScript to vote. Final results remain readable here after voting closes.</p></noscript>
	</article>
	<?php
}

function dx_bus_polls_section() {
	$polls = get_posts( array( 'post_type' => 'dx_bus_poll', 'post_status' => 'publish', 'numberposts' => 6, 'orderby' => 'date', 'order' => 'DESC' ) );
	ob_start(); ?>
	<section id="bus-polls" class="dxb-section dx-polls" aria-labelledby="dx-polls-heading">
		<header class="dxb-section-heading"><div><p class="dxb-eyebrow">Around the network</p><h2 id="dx-polls-heading">What Do You Think?</h2><p>A place for your view. Vote before the deadline; the final results stay here afterwards.</p></div><?php if ( $polls ) : ?><a href="<?php echo esc_url( get_post_type_archive_link( 'dx_bus_poll' ) ); ?>">All Polls &amp; Results <span aria-hidden="true">↗</span></a><?php endif; ?></header>
		<?php if ( $polls ) : ?><div class="dx-polls-grid"><?php foreach ( $polls as $poll ) { dx_bus_poll_card( $poll->ID ); } ?></div><?php else : ?><div class="dx-poll-empty"><span aria-hidden="true">↗</span><h3>The Next Question Is On Its Way.</h3><p>New polls and their closing times will appear here. There are no open polls yet.</p></div><?php endif; ?>
	</section>
	<?php return ob_get_clean();
}
add_shortcode( 'dx_bus_polls', 'dx_bus_polls_section' );

add_filter( 'single_template', function ( $template ) {
	if ( is_singular( 'dx_bus_poll' ) ) { return get_template_directory() . '/templates/single-bus-poll.php'; }
	return $template;
} );

add_filter( 'archive_template', function ( $template ) {
	return is_post_type_archive( 'dx_bus_poll' ) ? get_template_directory() . '/templates/archive-bus-polls.php' : $template;
} );
add_action( 'pre_get_posts', function ( $query ) {
	if ( ! is_admin() && $query->is_main_query() && $query->is_post_type_archive( 'dx_bus_poll' ) ) { $query->set( 'posts_per_page', 8 ); }
} );

add_action( 'before_delete_post', function ( $post_id ) {
	if ( 'dx_bus_poll' !== get_post_type( $post_id ) ) { return; }
	global $wpdb;
	$wpdb->delete( $wpdb->prefix . 'dx_bus_poll_votes', array( 'poll_id' => $post_id ), array( '%d' ) );
} );
