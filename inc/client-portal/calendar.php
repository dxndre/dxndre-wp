<?php
/** Private coaching calendar, portable calendar files and review-only client imports. */
defined( 'ABSPATH' ) || exit;

function dxcp_calendar_project( $project_id, $uid = 0 ) {
	$uid = $uid ?: get_current_user_id();
	$project = get_post( absint( $project_id ) );
	if ( ! $uid || ! $project || 'dxcp_project' !== $project->post_type || in_array( $project->post_status, array( 'trash', 'auto-draft' ), true ) || 'fitness' !== get_post_meta( $project->ID, '_dxcp_service', true ) ) {
		return null;
	}
	return dxcp_is_site_owner( $uid ) || ( dxcp_is_client_user( $uid ) && (int) get_post_meta( $project->ID, '_dxcp_client_id', true ) === (int) $uid ) ? $project : null;
}

function dxcp_calendar_month( $value ) {
	if ( ! is_string( $value ) || ! preg_match( '/^(19|20|21)\d{2}-(0[1-9]|1[0-2])$/D', $value ) ) {
		return '';
	}
	return $value;
}

function dxcp_calendar_sessions( $project_id, $uid = 0 ) {
	if ( ! dxcp_calendar_project( $project_id, $uid ) ) {
		return array();
	}
	$records = array();
	for ( $page = 1; ; ++$page ) {
		$batch = get_posts( array( 'post_type' => 'dxcp_session', 'post_status' => array( 'private', 'publish' ), 'posts_per_page' => 200, 'paged' => $page, 'orderby' => 'ID', 'order' => 'ASC', 'meta_key' => '_dxcp_project_id', 'meta_value' => absint( $project_id ) ) );
		$records = array_merge( $records, $batch );
		if ( count( $batch ) < 200 ) {
			break;
		}
	}
	usort( $records, static function ( $a, $b ) {
		return dxcp_calendar_session_time( $a, 'start' ) <=> dxcp_calendar_session_time( $b, 'start' );
	} );
	return $records;
}

/** UTC import metadata preserves the two occurrences of London's autumn clock change. */
function dxcp_calendar_session_time( $session, $edge = 'start' ) {
	$id = is_object( $session ) ? $session->ID : absint( $session );
	$edge = 'end' === $edge ? 'end' : 'start';
	$local = get_post_meta( $id, '_dxcp_' . $edge, true );
	$utc = get_post_meta( $id, '_dxcp_' . $edge . '_utc', true );
	if ( is_string( $utc ) && preg_match( '/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/D', $utc ) ) {
		$date = DateTimeImmutable::createFromFormat( '!Y-m-d\TH:i:s\Z', $utc, new DateTimeZone( 'UTC' ) );
		if ( $date && $date->format( 'Y-m-d\TH:i:s\Z' ) === $utc && $date->setTimezone( new DateTimeZone( 'Europe/London' ) )->format( 'Y-m-d\TH:i' ) === $local ) {
			return $date->getTimestamp();
		}
	}
	return dxcp_session_timestamp( $local );
}

function dxcp_calendar_session_status( $session ) {
	$status = get_post_meta( is_object( $session ) ? $session->ID : absint( $session ), '_dxcp_status', true ) ?: 'scheduled';
	return array( 'pending' => 'Awaiting coach review', 'scheduled' => 'Scheduled', 'completed' => 'Completed', 'cancelled' => 'Cancelled' )[ $status ] ?? 'Status to be confirmed';
}

function dxcp_calendar_is_demo( $session, $project_id ) {
	return (bool) get_post_meta( $project_id, '_dxcp_demo', true ) || (bool) get_post_meta( is_object( $session ) ? $session->ID : absint( $session ), '_dxcp_demo', true );
}

function dxcp_calendar_fragment( $project_id, $month, $uid = 0 ) {
	$project = dxcp_calendar_project( $project_id, $uid );
	$month = dxcp_calendar_month( $month );
	if ( ! $project || ! $month ) {
		return '';
	}
	$zone = new DateTimeZone( 'Europe/London' );
	$start = new DateTimeImmutable( $month . '-01T00:00:00', $zone );
	$events = array();
	$visible = array();
	foreach ( dxcp_calendar_sessions( $project_id, $uid ) as $session ) {
		$timestamp = dxcp_calendar_session_time( $session );
		if ( $timestamp && wp_date( 'Y-m', $timestamp, $zone ) === $month ) {
			$events[ wp_date( 'Y-m-d', $timestamp, $zone ) ][] = $session;
			$visible[] = $session;
		}
	}
	ob_start();
	?>
	<article class="dxcp-card dxcp-calendar-card"><div class="dxcp-card__heading"><h2 data-dxcp-calendar-label><?php echo esc_html( $start->format( 'F Y' ) ); ?></h2><div class="dxcp-inline"><?php foreach ( array( '-1 month' => 'Previous month', '+1 month' => 'Next month' ) as $offset => $label ) : $adjacent = $start->modify( $offset )->format( 'Y-m' ); if ( ! dxcp_calendar_month( $adjacent ) ) { continue; } ?><a class="dxcp-btn dxcp-btn--small" data-dxcp-calendar-month="<?php echo esc_attr( $adjacent ); ?>" aria-label="<?php echo esc_attr( $label ); ?>" href="<?php echo esc_url( dxcp_portal_url( 'sessions', $project_id, array( 'month' => $adjacent ) ) ); ?>"><?php echo '-1 month' === $offset ? '←' : '→'; ?></a><?php endforeach; ?></div></div><p class="dxcp-muted">All times are shown in Europe/London, including British Summer Time. Requests awaiting review are not booked sessions.</p><div class="dxcp-calendar" role="group" aria-label="<?php echo esc_attr( $start->format( 'F Y' ) . ' coaching calendar' ); ?>"><?php foreach ( array( 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ) as $day ) : ?><span class="dxcp-calendar__day"><?php echo esc_html( $day ); ?></span><?php endforeach; ?><?php for ( $blank = 1; $blank < (int) $start->format( 'N' ); ++$blank ) : ?><span class="dxcp-calendar__blank" aria-hidden="true"></span><?php endfor; ?><?php for ( $day = 1; $day <= (int) $start->format( 't' ); ++$day ) : $date = $month . '-' . sprintf( '%02d', $day ); ?><div class="dxcp-calendar__cell<?php echo $date === wp_date( 'Y-m-d', null, $zone ) ? ' is-today' : ''; ?>"><span><?php echo (int) $day; ?></span><?php foreach ( $events[ $date ] ?? array() as $session ) : $timestamp = dxcp_calendar_session_time( $session ); $status = get_post_meta( $session->ID, '_dxcp_status', true ); ?><a class="dxcp-calendar__event<?php echo 'pending' === $status ? ' is-pending' : ( 'cancelled' === $status ? ' is-cancelled' : '' ); ?>" href="#dxcp-session-<?php echo absint( $session->ID ); ?>" aria-label="<?php echo esc_attr( $session->post_title . ', ' . wp_date( 'H:i T', $timestamp, $zone ) . ', ' . dxcp_calendar_session_status( $session ) ); ?>"><?php echo esc_html( wp_date( 'H:i', $timestamp, $zone ) . ' ' . $session->post_title ); ?></a><?php endforeach; ?></div><?php endfor; ?></div></article>
	<article class="dxcp-card dxcp-calendar-details"><?php dxcp_card_heading( 'SHOW UP FOR YOURSELF', 'Session details · ' . $start->format( 'F Y' ) ); ?><?php if ( ! $visible ) : ?><?php dxcp_empty( 'Your calendar is clear this month', 'Your coach will add agreed sessions here. You can import individual calendar entries as requests for review.', 'sessions' ); ?><?php endif; ?><?php foreach ( $visible as $session ) : $timestamp = dxcp_calendar_session_time( $session ); $end = dxcp_calendar_session_time( $session, 'end' ); $status = get_post_meta( $session->ID, '_dxcp_status', true ) ?: 'scheduled'; $join = dxcp_safe_url( get_post_meta( $session->ID, '_dxcp_join_url', true ) ); $demo = dxcp_calendar_is_demo( $session, $project_id ); ?><div class="dxcp-session" id="dxcp-session-<?php echo absint( $session->ID ); ?>"><div class="dxcp-session__date"><strong><?php echo esc_html( wp_date( 'd', $timestamp, $zone ) ); ?></strong><span><?php echo esc_html( wp_date( 'M', $timestamp, $zone ) ); ?></span></div><div><h3><?php echo esc_html( $session->post_title ); ?></h3><p><?php echo esc_html( wp_date( 'l j F · H:i T', $timestamp, $zone ) . ( $end ? ' – ' . wp_date( wp_date( 'Y-m-d', $end, $zone ) === wp_date( 'Y-m-d', $timestamp, $zone ) ? 'H:i T' : 'j F H:i T', $end, $zone ) : '' ) ); ?> · <?php echo esc_html( get_post_meta( $session->ID, '_dxcp_location', true ) ?: 'Location to be confirmed' ); ?></p><p><?php echo esc_html( wp_strip_all_tags( $session->post_content ) ); ?></p><?php if ( $demo ) : ?><p class="dxcp-muted">Example session · not booked.</p><?php elseif ( 'pending' === $status ) : ?><p class="dxcp-muted">Imported request · your coach must confirm this time before it is booked.</p><?php endif; ?></div><?php dxcp_badge( dxcp_calendar_session_status( $session ), 'pending' === $status ? 'gold' : ( 'cancelled' === $status ? '' : 'green' ) ); ?><?php if ( $join && 'scheduled' === $status && ! $demo ) : ?><a class="dxcp-btn dxcp-btn--small" href="<?php echo esc_url( $join ); ?>" target="_blank" rel="noopener noreferrer">Join session <?php echo dxcp_icon( 'external' ); ?></a><?php endif; ?></div><?php endforeach; ?></article>
	<?php
	return ob_get_clean();
}

function dxcp_render_calendar_sessions( $context ) {
	$project_id = absint( $context['pid'] ?? 0 );
	?>
	<div class="dxcp-view-heading"><p class="dxcp-eyebrow">MAKE TIME FOR YOURSELF</p><h1>Your coaching calendar</h1><p>Upcoming sessions, locations and everything you need to be ready.</p></div>
	<?php
	if ( ! dxcp_calendar_project( $project_id ) ) {
		dxcp_empty( 'Coaching has its own space', 'Your coaching sessions will appear here when a fitness coaching programme is assigned to your account.', 'sessions' );
		return;
	}
	$raw_month = isset( $_GET['month'] ) && is_string( $_GET['month'] ) ? wp_unslash( $_GET['month'] ) : '';
	$month = dxcp_calendar_month( $raw_month ) ?: wp_date( 'Y-m', null, new DateTimeZone( 'Europe/London' ) );
	$notice_key = 'dxcp_calendar_notice_' . get_current_user_id() . '_' . $project_id;
	$notice = get_transient( $notice_key );
	if ( $notice ) {
		delete_transient( $notice_key );
		echo '<div class="dxcp-notice" role="status">' . esc_html( $notice ) . '</div>';
	}
	?>
	<div data-dxcp-calendar data-project-id="<?php echo $project_id; ?>" data-calendar-month="<?php echo esc_attr( $month ); ?>" data-calendar-nonce="<?php echo esc_attr( wp_create_nonce( 'dxcp_calendar_' . $project_id ) ); ?>" data-calendar-url="<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>"><p class="dxcp-muted" data-dxcp-calendar-status role="status" aria-live="polite"></p><div data-dxcp-calendar-body><?php echo dxcp_calendar_fragment( $project_id, $month ); ?></div></div>
	<article class="dxcp-card dxcp-calendar-transfer"><?php dxcp_card_heading( 'YOUR CALENDAR, CONNECTED', 'Import & export' ); ?><p>Download agreed sessions to Apple Calendar, Google Calendar or Outlook. Pending requests, cancelled sessions and example appointments are excluded.</p><a class="dxcp-btn" href="<?php echo esc_url( wp_nonce_url( add_query_arg( array( 'action' => 'dxcp_calendar_export', 'project_id' => $project_id ), admin_url( 'admin-post.php' ) ), 'dxcp_calendar_export_' . $project_id ) ); ?>">Export agreed sessions (.ics) <?php echo dxcp_icon( 'arrow' ); ?></a><details class="dxcp-disclosure"><summary>Import calendar entries</summary><?php dxcp_form_start( 'dxcp_calendar_import', $project_id, 'dxcp_calendar_import_' . $project_id, true ); ?><p>Import a calendar file containing individual, timed entries. Existing imports stay unchanged. Repeating and all-day entries must be exported as individual timed sessions first.</p><label class="dxcp-field dxcp-field--file"><span>Calendar file (.ics · up to 5 MB)</span><input type="file" name="dxcp_calendar_file" required accept=".ics,text/calendar" data-dxcp-max-size="5242880"></label><?php if ( dxcp_is_site_owner() ) : ?><label class="dxcp-checkbox"><input type="checkbox" name="confirm_booked" value="1"><span>I have agreed these session times with the client. Import them as scheduled sessions.</span></label><p class="dxcp-muted">Leave this unchecked to import as requests awaiting coach review.</p><?php else : ?><p class="dxcp-muted">Imported entries are requests awaiting your coach’s review. Importing does not book or confirm a session.</p><?php endif; ?><button class="dxcp-btn dxcp-btn--dark" type="submit">Import for review <?php echo dxcp_icon( 'arrow' ); ?></button><p class="dxcp-muted">Files above 5 MB cannot be uploaded. Share a public calendar-file link through Support or an online cloud-storage service instead.</p></form></details></article>
	<?php
}

function dxcp_calendar_ajax() {
	if ( 'GET' !== ( $_SERVER['REQUEST_METHOD'] ?? 'GET' ) ) {
		wp_send_json_error( array( 'message' => 'Use a calendar navigation link.' ), 405 );
	}
	$project_id = isset( $_GET['project_id'] ) && is_scalar( $_GET['project_id'] ) ? absint( $_GET['project_id'] ) : 0;
	$nonce = isset( $_GET['_ajax_nonce'] ) && is_string( $_GET['_ajax_nonce'] ) ? wp_unslash( $_GET['_ajax_nonce'] ) : '';
	if ( ! is_user_logged_in() || ! wp_verify_nonce( $nonce, 'dxcp_calendar_' . $project_id ) || ! dxcp_calendar_project( $project_id ) ) {
		wp_send_json_error( array( 'message' => 'This calendar is not available to your account. Reload your client space and try again.' ), 403 );
	}
	$month = isset( $_GET['month'] ) && is_string( $_GET['month'] ) ? dxcp_calendar_month( wp_unslash( $_GET['month'] ) ) : '';
	if ( ! $month ) {
		wp_send_json_error( array( 'message' => 'Choose a valid calendar month.' ), 400 );
	}
	nocache_headers();
	wp_send_json_success( array( 'html' => dxcp_calendar_fragment( $project_id, $month ), 'month' => $month, 'label' => ( new DateTimeImmutable( $month . '-01', new DateTimeZone( 'Europe/London' ) ) )->format( 'F Y' ) ) );
}
add_action( 'wp_ajax_dxcp_calendar_month', 'dxcp_calendar_ajax' );
add_action( 'wp_ajax_nopriv_dxcp_calendar_month', 'dxcp_calendar_ajax' );

function dxcp_calendar_text( $text ) {
	$text = str_replace( '\\', '\\\\', (string) $text );
	$text = str_replace( array( "\r\n", "\r", "\n" ), '\\n', $text );
	return str_replace( array( ';', ',' ), array( '\\;', '\\,' ), $text );
}

function dxcp_calendar_fold( $line ) {
	$parts = array();
	$limit = 75;
	while ( strlen( $line ) > $limit ) {
		$part = mb_strcut( $line, 0, $limit, 'UTF-8' );
		$parts[] = ( $parts ? ' ' : '' ) . $part;
		$line = substr( $line, strlen( $part ) );
		$limit = 74;
	}
	$parts[] = ( $parts ? ' ' : '' ) . $line;
	return implode( "\r\n", $parts );
}

function dxcp_calendar_ics( $project_id, $uid = 0 ) {
	$project = dxcp_calendar_project( $project_id, $uid );
	if ( ! $project ) {
		return new WP_Error( 'calendar_forbidden', 'This calendar is not available to your account.', array( 'status' => 403 ) );
	}
	$host = wp_parse_url( home_url(), PHP_URL_HOST );
	$lines = array( 'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//DXNDRE//Private coaching calendar//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:' . dxcp_calendar_text( $project->post_title . ' · Coaching' ), 'X-WR-TIMEZONE:Europe/London' );
	foreach ( dxcp_calendar_sessions( $project_id, $uid ) as $session ) {
		$status = get_post_meta( $session->ID, '_dxcp_status', true ) ?: 'scheduled';
		$start = dxcp_calendar_session_time( $session );
		$end = dxcp_calendar_session_time( $session, 'end' );
		if ( ! in_array( $status, array( 'scheduled', 'completed' ), true ) || dxcp_calendar_is_demo( $session, $project_id ) || ! $start || $end <= $start ) {
			continue;
		}
		$uid_value = get_post_meta( $session->ID, '_dxcp_calendar_uid', true ) ?: 'dxcp-session-' . $session->ID . '@' . $host;
		$lines = array_merge( $lines, array( 'BEGIN:VEVENT', 'UID:' . dxcp_calendar_text( $uid_value ), 'DTSTAMP:' . gmdate( 'Ymd\THis\Z' ), 'DTSTART:' . gmdate( 'Ymd\THis\Z', $start ), 'DTEND:' . gmdate( 'Ymd\THis\Z', $end ), 'SUMMARY:' . dxcp_calendar_text( $session->post_title ), 'DESCRIPTION:' . dxcp_calendar_text( wp_strip_all_tags( $session->post_content ) ), 'LOCATION:' . dxcp_calendar_text( get_post_meta( $session->ID, '_dxcp_location', true ) ), 'STATUS:CONFIRMED', 'CLASS:PRIVATE', 'TRANSP:OPAQUE' ) );
		$url = dxcp_safe_url( get_post_meta( $session->ID, '_dxcp_join_url', true ) );
		if ( $url ) {
			$lines[] = 'URL:' . $url;
		}
		$lines[] = 'END:VEVENT';
	}
	$lines[] = 'END:VCALENDAR';
	return implode( "\r\n", array_map( 'dxcp_calendar_fold', $lines ) ) . "\r\n";
}

function dxcp_calendar_export() {
	$project_id = isset( $_GET['project_id'] ) && is_scalar( $_GET['project_id'] ) ? absint( $_GET['project_id'] ) : 0;
	$nonce = isset( $_GET['_wpnonce'] ) && is_string( $_GET['_wpnonce'] ) ? wp_unslash( $_GET['_wpnonce'] ) : '';
	if ( ! is_user_logged_in() || ! wp_verify_nonce( $nonce, 'dxcp_calendar_export_' . $project_id ) ) {
		wp_die( 'Your calendar link expired. Return to your client space and try again.', 'Calendar unavailable', array( 'response' => 403 ) );
	}
	$calendar = dxcp_calendar_ics( $project_id );
	if ( is_wp_error( $calendar ) ) {
		wp_die( esc_html( $calendar->get_error_message() ), 'Calendar unavailable', array( 'response' => 403 ) );
	}
	nocache_headers();
	header( 'Content-Type: text/calendar; charset=UTF-8' );
	header( 'Content-Disposition: attachment; filename="dxndre-coaching-' . $project_id . '.ics"' );
	header( 'X-Content-Type-Options: nosniff' );
	header( 'Referrer-Policy: no-referrer' );
	echo $calendar;
	exit;
}
add_action( 'admin_post_dxcp_calendar_export', 'dxcp_calendar_export' );
add_action( 'admin_post_nopriv_dxcp_calendar_export', 'dxcp_calendar_export' );

function dxcp_calendar_unescape( $value ) {
	return preg_replace_callback( '/\\\\([nN,;\\\\])/', static function ( $match ) { return in_array( $match[1], array( 'n', 'N' ), true ) ? "\n" : $match[1]; }, $value );
}

function dxcp_calendar_property( $line ) {
	$quoted = false;
	$split = false;
	for ( $i = 0; $i < strlen( $line ); ++$i ) {
		if ( '"' === $line[ $i ] ) {
			$quoted = ! $quoted;
		} elseif ( ':' === $line[ $i ] && ! $quoted ) {
			$split = $i;
			break;
		}
	}
	if ( false === $split ) {
		return null;
	}
	$parts = explode( ';', substr( $line, 0, $split ) );
	$name = strtoupper( array_shift( $parts ) );
	$params = array();
	foreach ( $parts as $part ) {
		$pair = explode( '=', $part, 2 );
		if ( 2 === count( $pair ) ) {
			$params[ strtoupper( $pair[0] ) ] = trim( $pair[1], '"' );
		}
	}
	return array( 'name' => $name, 'params' => $params, 'value' => substr( $line, $split + 1 ) );
}

function dxcp_calendar_parse_time( $property ) {
	$value = $property['value'] ?? '';
	if ( 'DATE' === ( $property['params']['VALUE'] ?? '' ) || ! preg_match( '/^\d{8}T\d{6}Z?$/D', $value ) ) {
		return new WP_Error( 'calendar_time', 'Use individual timed calendar entries. All-day entries are not coaching session times.' );
	}
	$utc = str_ends_with( $value, 'Z' );
	$local = $utc ? substr( $value, 0, -1 ) : $value;
	try {
		$zone = new DateTimeZone( $utc ? 'UTC' : ( $property['params']['TZID'] ?? 'Europe/London' ) );
	} catch ( Exception $error ) {
		return new WP_Error( 'calendar_timezone', 'This file uses an unsupported timezone. Export it using Europe/London or UTC.' );
	}
	$date = DateTimeImmutable::createFromFormat( '!Ymd\THis', $local, $zone );
	$errors = DateTimeImmutable::getLastErrors();
	if ( ! $date || ( $errors && ( $errors['warning_count'] || $errors['error_count'] ) ) || $date->format( 'Ymd\THis' ) !== $local ) {
		return new WP_Error( 'calendar_time', 'A calendar time is invalid, including a time skipped when the clocks change.' );
	}
	if ( (int) $date->format( 'Y' ) < 1900 || (int) $date->format( 'Y' ) > 2199 ) {
		return new WP_Error( 'calendar_time', 'Calendar entries must fall between 1900 and 2199.' );
	}
	if ( ! $utc ) {
		$wall = DateTimeImmutable::createFromFormat( '!Ymd\THis', $local, new DateTimeZone( 'UTC' ) )->getTimestamp();
		$offsets = array( $zone->getOffset( $date ) );
		foreach ( $zone->getTransitions( $date->getTimestamp() - 10800, $date->getTimestamp() + 10800 ) ?: array() as $transition ) {
			$offsets[] = $transition['offset'];
		}
		$candidates = array();
		foreach ( array_unique( $offsets ) as $offset ) {
			$candidate = ( new DateTimeImmutable( '@' . ( $wall - $offset ) ) )->setTimezone( $zone );
			if ( $candidate->format( 'Ymd\THis' ) === $local ) {
				$candidates[] = $candidate->getTimestamp();
			}
		}
		if ( count( array_unique( $candidates ) ) > 1 ) {
			return new WP_Error( 'calendar_ambiguous', 'A calendar entry falls in the repeated hour when the clocks change. Export that entry in UTC to identify its exact time.' );
		}
	}
	return $date->getTimestamp();
}

function dxcp_calendar_parse_ics( $content ) {
	if ( ! is_string( $content ) || '' === $content || strlen( $content ) > dxcp_upload_limit() ) {
		return new WP_Error( 'calendar_size', 'Choose a calendar file up to 5 MB. Share larger files through a cloud-storage link in Support.' );
	}
	if ( str_contains( $content, "\0" ) || ! mb_check_encoding( $content, 'UTF-8' ) ) {
		return new WP_Error( 'calendar_format', 'Choose a valid UTF-8 .ics calendar file.' );
	}
	$content = preg_replace( '/^\xEF\xBB\xBF/', '', $content );
	$content = str_replace( array( "\r\n", "\r" ), "\n", $content );
	$content = preg_replace( '/\n[ \t]/', '', $content );
	$stack = array();
	$events = array();
	$event = null;
	$calendar_count = 0;
	foreach ( explode( "\n", trim( $content ) ) as $line ) {
		if ( '' === $line ) {
			continue;
		}
		$property = dxcp_calendar_property( $line );
		if ( ! $property ) {
			return new WP_Error( 'calendar_format', 'A calendar line could not be read. Export a new .ics file and try again.' );
		}
		$name = $property['name'];
		$value = $property['value'];
		if ( 'BEGIN' === $name ) {
			$value = strtoupper( $value );
			if ( 'VCALENDAR' === $value ) {
				if ( $stack || ++$calendar_count > 1 ) {
					return new WP_Error( 'calendar_format', 'Use one calendar per import.' );
				}
			} elseif ( ! $stack || ( 'VEVENT' === $value && ( 'VCALENDAR' !== end( $stack ) || null !== $event ) ) ) {
				return new WP_Error( 'calendar_format', 'The calendar structure is invalid.' );
			}
			$stack[] = $value;
			if ( 'VEVENT' === $value ) {
				$event = array();
			}
			continue;
		}
		if ( 'END' === $name ) {
			$value = strtoupper( $value );
			if ( ! $stack || array_pop( $stack ) !== $value ) {
				return new WP_Error( 'calendar_format', 'The calendar structure is incomplete.' );
			}
			if ( 'VEVENT' === $value ) {
				$events[] = $event;
				$event = null;
				if ( count( $events ) > 200 ) {
					return new WP_Error( 'calendar_count', 'Import up to 200 individual entries at a time.' );
				}
			}
			continue;
		}
		if ( ! $stack ) {
			return new WP_Error( 'calendar_format', 'Choose a complete .ics calendar file.' );
		}
		if ( 'VCALENDAR' === end( $stack ) && 'METHOD' === $name && 'CANCEL' === strtoupper( $value ) ) {
			return new WP_Error( 'calendar_cancel', 'Cancellation files cannot change agreed sessions. Contact your coach to cancel or rearrange a session.' );
		}
		if ( 'VEVENT' === end( $stack ) ) {
			if ( in_array( $name, array( 'RRULE', 'RDATE', 'EXDATE', 'RECURRENCE-ID' ), true ) ) {
				return new WP_Error( 'calendar_repeat', 'Repeating entries must be exported as individual timed occurrences before importing.' );
			}
			if ( isset( $event[ $name ] ) && in_array( $name, array( 'DTSTART', 'DTEND', 'DURATION', 'UID' ), true ) ) {
				return new WP_Error( 'calendar_format', 'An entry contains conflicting calendar fields.' );
			}
			$event[ $name ] = $property;
		}
	}
	if ( $stack || 1 !== $calendar_count || ! $events ) {
		return new WP_Error( 'calendar_empty', 'No complete calendar entries were found in this file.' );
	}
	$parsed = array();
	foreach ( $events as $event ) {
		if ( 'CANCELLED' === strtoupper( $event['STATUS']['value'] ?? '' ) ) {
			continue;
		}
		$start = dxcp_calendar_parse_time( $event['DTSTART'] ?? array() );
		if ( is_wp_error( $start ) ) {
			return $start;
		}
		if ( isset( $event['DTEND'] ) ) {
			if ( isset( $event['DURATION'] ) ) {
				return new WP_Error( 'calendar_end', 'Use either an end time or a duration for each calendar entry, rather than both.' );
			}
			$end = dxcp_calendar_parse_time( $event['DTEND'] );
		} elseif ( preg_match( '/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/D', $event['DURATION']['value'] ?? '', $duration ) ) {
			$duration_seconds = (float) ( $duration[1] ?? 0 ) * DAY_IN_SECONDS + (float) ( $duration[2] ?? 0 ) * HOUR_IN_SECONDS + (float) ( $duration[3] ?? 0 ) * MINUTE_IN_SECONDS + (float) ( $duration[4] ?? 0 );
			if ( ! is_finite( $duration_seconds ) || $duration_seconds <= 0 || $duration_seconds > 366 * DAY_IN_SECONDS ) {
				return new WP_Error( 'calendar_end', 'Use a valid, finite duration for each calendar entry.' );
			}
			$start_zone = str_ends_with( $event['DTSTART']['value'], 'Z' ) ? 'UTC' : ( $event['DTSTART']['params']['TZID'] ?? 'Europe/London' );
			$start_date = ( new DateTimeImmutable( '@' . $start ) )->setTimezone( new DateTimeZone( $start_zone ) );
			// RFC 5545 calendar days are nominal days, including DST discontinuities.
			$end = $start_date->add( new DateInterval( 'P' . (int) ( $duration[1] ?? 0 ) . 'D' ) )->getTimestamp() + (int) ( (float) ( $duration[2] ?? 0 ) * HOUR_IN_SECONDS + (float) ( $duration[3] ?? 0 ) * MINUTE_IN_SECONDS + (float) ( $duration[4] ?? 0 ) );
		} else {
			return new WP_Error( 'calendar_end', 'Each calendar entry needs an end time or a fixed duration.' );
		}
		if ( is_wp_error( $end ) ) {
			return $end;
		}
		if ( $end <= $start ) {
			return new WP_Error( 'calendar_end', 'Every session must end after it starts.' );
		}
		$summary = mb_substr( sanitize_text_field( dxcp_calendar_unescape( $event['SUMMARY']['value'] ?? 'Coaching session request' ) ), 0, 200 );
		$parsed[] = array( 'uid' => mb_substr( sanitize_text_field( dxcp_calendar_unescape( $event['UID']['value'] ?? '' ) ), 0, 512 ), 'title' => $summary ?: 'Coaching session request', 'description' => mb_substr( sanitize_textarea_field( dxcp_calendar_unescape( $event['DESCRIPTION']['value'] ?? '' ) ), 0, 12000 ), 'location' => mb_substr( sanitize_text_field( dxcp_calendar_unescape( $event['LOCATION']['value'] ?? '' ) ), 0, 250 ), 'url' => dxcp_safe_url( $event['URL']['value'] ?? '' ), 'start' => $start, 'end' => $end );
	}
	return $parsed;
}

/** Import never overwrites an agreed record, and clients cannot grant confirmed status. */
function dxcp_calendar_import_content( $project_id, $content, $confirm_booked = false, $uid = 0 ) {
	$uid = $uid ?: get_current_user_id();
	if ( ! dxcp_calendar_project( $project_id, $uid ) ) {
		return new WP_Error( 'calendar_forbidden', 'This calendar is not available to your account.', array( 'status' => 403 ) );
	}
	$events = dxcp_calendar_parse_ics( $content );
	if ( is_wp_error( $events ) ) {
		return $events;
	}
	$lock_key = 'dxcp_calendar_import_lock_' . absint( $project_id );
	$old_lock = get_option( $lock_key );
	if ( is_string( $old_lock ) && (int) $old_lock < time() - 120 ) {
		delete_option( $lock_key );
	}
	$lock_value = time() . '|' . wp_generate_password( 24, false );
	if ( ! add_option( $lock_key, $lock_value, '', false ) ) {
		return new WP_Error( 'calendar_busy', 'Another calendar import is already running. Wait a moment and try again.' );
	}
	try {
		$status = $confirm_booked && dxcp_is_site_owner( $uid ) ? 'scheduled' : 'pending';
		$zone = new DateTimeZone( 'Europe/London' );
		$existing = dxcp_calendar_sessions( $project_id, $uid );
		$keys = array();
		foreach ( $existing as $session ) {
			$key = get_post_meta( $session->ID, '_dxcp_calendar_key', true );
			if ( $key ) {
				$keys[ $key ] = true;
			}
			$existing_uid = get_post_meta( $session->ID, '_dxcp_calendar_uid', true ) ?: 'dxcp-session-' . $session->ID . '@' . wp_parse_url( home_url(), PHP_URL_HOST );
			$keys[ hash( 'sha256', 'uid:' . $existing_uid ) ] = true;
		}
		$created = array();
		$skipped = 0;
		foreach ( $events as $event ) {
			$key = hash( 'sha256', $event['uid'] ? 'uid:' . $event['uid'] : wp_json_encode( array( $event['title'], $event['start'], $event['end'], $event['location'] ) ) );
			if ( isset( $keys[ $key ] ) ) {
				++$skipped;
				continue;
			}
			$id = wp_insert_post( array( 'post_type' => 'dxcp_session', 'post_status' => 'private', 'post_author' => $uid, 'post_title' => $event['title'], 'post_content' => $event['description'], 'meta_input' => array( '_dxcp_project_id' => absint( $project_id ), '_dxcp_start' => wp_date( 'Y-m-d\TH:i', $event['start'], $zone ), '_dxcp_end' => wp_date( 'Y-m-d\TH:i', $event['end'], $zone ), '_dxcp_start_utc' => gmdate( 'Y-m-d\TH:i:s\Z', $event['start'] ), '_dxcp_end_utc' => gmdate( 'Y-m-d\TH:i:s\Z', $event['end'] ), '_dxcp_location' => $event['location'], '_dxcp_join_url' => $event['url'], '_dxcp_status' => $status, '_dxcp_calendar_uid' => $event['uid'], '_dxcp_calendar_key' => $key, '_dxcp_calendar_imported_by' => $uid ) ), true );
			if ( is_wp_error( $id ) || ! $id || 'private' !== get_post_status( $id ) || (int) get_post_meta( $id, '_dxcp_project_id', true ) !== (int) $project_id || get_post_meta( $id, '_dxcp_status', true ) !== $status || get_post_meta( $id, '_dxcp_start_utc', true ) !== gmdate( 'Y-m-d\TH:i:s\Z', $event['start'] ) || get_post_meta( $id, '_dxcp_end_utc', true ) !== gmdate( 'Y-m-d\TH:i:s\Z', $event['end'] ) || dxcp_calendar_session_time( $id ) !== $event['start'] || dxcp_calendar_session_time( $id, 'end' ) !== $event['end'] ) {
				if ( ! is_wp_error( $id ) && $id ) {
					$created[] = $id;
				}
				foreach ( $created as $record_id ) {
					wp_delete_post( $record_id, true );
				}
				return new WP_Error( 'calendar_save', 'The import could not be saved. No new entries were kept. Please try again.' );
			}
			$created[] = $id;
			$keys[ $key ] = true;
		}
		return array( 'created' => $created, 'skipped' => $skipped, 'status' => $status );
	} finally {
		if ( get_option( $lock_key ) === $lock_value ) {
			delete_option( $lock_key );
		}
	}
}

function dxcp_calendar_import() {
	$project_id = isset( $_POST['project_id'] ) && is_scalar( $_POST['project_id'] ) ? absint( $_POST['project_id'] ) : 0;
	$nonce = isset( $_POST['_wpnonce'] ) && is_string( $_POST['_wpnonce'] ) ? wp_unslash( $_POST['_wpnonce'] ) : '';
	if ( 'POST' !== ( $_SERVER['REQUEST_METHOD'] ?? '' ) || ! is_user_logged_in() || ! wp_verify_nonce( $nonce, 'dxcp_calendar_import_' . $project_id ) || ! dxcp_calendar_project( $project_id ) ) {
		wp_die( 'Your import was not authorised. Return to your client space and try again.', 'Calendar unavailable', array( 'response' => 403 ) );
	}
	$file = $_FILES['dxcp_calendar_file'] ?? array();
	$error = null;
	if ( ! is_array( $file ) || ! is_scalar( $file['error'] ?? null ) || ! is_string( $file['tmp_name'] ?? null ) || ! is_string( $file['name'] ?? null ) ) {
		$error = new WP_Error( 'calendar_file', 'Choose a valid .ics calendar file.' );
	} elseif ( in_array( (int) ( $file['error'] ?? -1 ), array( UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE ), true ) ) {
		$error = new WP_Error( 'calendar_size', 'Calendar files can be up to 5 MB. Share a larger file through a cloud-storage link in Support.' );
	} elseif ( UPLOAD_ERR_OK !== (int) ( $file['error'] ?? -1 ) || empty( $file['tmp_name'] ) || ! is_uploaded_file( $file['tmp_name'] ) || 'ics' !== strtolower( pathinfo( $file['name'] ?? '', PATHINFO_EXTENSION ) ) ) {
		$error = new WP_Error( 'calendar_file', 'Choose a valid .ics calendar file.' );
	} elseif ( ! filesize( $file['tmp_name'] ) || filesize( $file['tmp_name'] ) > dxcp_upload_limit() ) {
		$error = new WP_Error( 'calendar_size', 'Calendar files can be up to 5 MB. Share a larger file through a cloud-storage link in Support.' );
	}
	$result = $error ?: dxcp_calendar_import_content( $project_id, file_get_contents( $file['tmp_name'] ), isset( $_POST['confirm_booked'] ) && '1' === $_POST['confirm_booked'] );
	$message = is_wp_error( $result ) ? $result->get_error_message() : count( $result['created'] ) . ( 'scheduled' === $result['status'] ? ' agreed sessions imported.' : ' session requests imported for coach review. Nothing has been booked.' ) . ( $result['skipped'] ? ' ' . $result['skipped'] . ' existing entries were left unchanged.' : '' );
	set_transient( 'dxcp_calendar_notice_' . get_current_user_id() . '_' . $project_id, $message, 120 );
	wp_safe_redirect( dxcp_portal_url( 'sessions', $project_id ) );
	exit;
}
add_action( 'admin_post_dxcp_calendar_import', 'dxcp_calendar_import' );
add_action( 'admin_post_nopriv_dxcp_calendar_import', 'dxcp_calendar_import' );

function dxcp_next_fitness_session( $projects, $now = null ) {
	$now = $now ?? time();
	$first_project = null;
	$real = array();
	$demo = array();
	foreach ( $projects as $project ) {
		if ( ! $project instanceof WP_Post || ! dxcp_calendar_project( $project->ID ) ) {
			continue;
		}
		$first_project = $first_project ?: $project;
		foreach ( dxcp_calendar_sessions( $project->ID ) as $session ) {
			$status = get_post_meta( $session->ID, '_dxcp_status', true ) ?: 'scheduled';
			$start = dxcp_calendar_session_time( $session );
			if ( 'scheduled' !== $status || $start < $now ) {
				continue;
			}
			$item = array( 'project' => $project, 'session' => $session, 'start' => $start, 'end' => dxcp_calendar_session_time( $session, 'end' ), 'demo' => dxcp_calendar_is_demo( $session, $project->ID ) );
			if ( $item['demo'] ) {
				$demo[] = $item;
			} else {
				$real[] = $item;
			}
		}
	}
	$choices = $real ?: $demo;
	usort( $choices, static function ( $a, $b ) { return $a['start'] <=> $b['start']; } );
	return $choices[0] ?? ( $first_project ? array( 'project' => $first_project, 'session' => null, 'demo' => (bool) get_post_meta( $first_project->ID, '_dxcp_demo', true ) ) : null );
}

function dxcp_render_next_session( $projects ) {
	$next = dxcp_next_fitness_session( $projects );
	if ( ! $next ) {
		return;
	}
	$zone = new DateTimeZone( 'Europe/London' );
	?>
	<aside class="dxcp-next-session" data-dxcp-next-session><div class="dxcp-next-session__icon" aria-hidden="true"><?php echo dxcp_icon( 'sessions' ); ?></div><div><p class="dxcp-eyebrow"><?php echo $next['demo'] ? 'EXAMPLE SESSION · NOT BOOKED' : 'YOUR NEXT COACHING SESSION'; ?></p><?php if ( $next['session'] ) : ?><h2><?php echo esc_html( wp_date( 'l j F', $next['start'], $zone ) ); ?></h2><p><time datetime="<?php echo esc_attr( gmdate( 'c', $next['start'] ) ); ?>"><?php echo esc_html( wp_date( 'H:i T', $next['start'], $zone ) . ( $next['end'] ? ' – ' . wp_date( 'H:i T', $next['end'], $zone ) : '' ) ); ?></time> · <?php echo esc_html( get_post_meta( $next['session']->ID, '_dxcp_location', true ) ?: 'Location to be confirmed' ); ?></p><small><?php echo esc_html( $next['session']->post_title . ' · ' . $next['project']->post_title ); ?></small><?php else : ?><h2>No confirmed upcoming session.</h2><p>Your coach will share your agreed time and location here. Imported requests are not bookings.</p><?php endif; ?><a class="dxcp-text-link" href="<?php echo esc_url( dxcp_portal_url( 'sessions', $next['project']->ID ) ); ?>">View coaching calendar <?php echo dxcp_icon( 'arrow' ); ?></a></div></aside>
	<?php
}
