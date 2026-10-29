<?php
/** Cached London forecast; no visitor location or browser request is used. */
defined( 'ABSPATH' ) || exit;

function dx_london_weather() {
	$cached = get_transient( 'dx_london_weather_v1' );
	$cached = is_array( $cached ) ? $cached : array();
	$now = time();
	if ( empty( $cached['next_check'] ) || (int) $cached['next_check'] <= $now ) {
		$args = array( 'timeout' => 5, 'redirection' => 1, 'headers' => array( 'User-Agent' => 'DXNDRE-LondonWeather/1.0 (+https://dxndre.co.uk/contact/)', 'Accept' => 'application/json' ) );
		if ( ! empty( $cached['last_modified'] ) ) {
			$args['headers']['If-Modified-Since'] = $cached['last_modified'];
		}
		$response = wp_safe_remote_get( 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=51.51&lon=-0.13', $args );
		$code = is_wp_error( $response ) ? 0 : wp_remote_retrieve_response_code( $response );
		$expires = ! is_wp_error( $response ) ? strtotime( wp_remote_retrieve_header( $response, 'expires' ) ?: '' ) : false;
		$next_check = $expires && $expires > $now ? $expires : $now + 20 * MINUTE_IN_SECONDS;
		if ( 200 === $code ) {
			$data = json_decode( wp_remote_retrieve_body( $response ), true );
			$series = $data['properties']['timeseries'] ?? array();
			$points = array();
			foreach ( array_slice( is_array( $series ) ? $series : array(), 0, 48 ) as $row ) {
				$temp = $row['data']['instant']['details']['air_temperature'] ?? null;
				$timestamp = is_string( $row['time'] ?? null ) ? strtotime( $row['time'] ) : false;
				$symbol = $row['data']['next_1_hours']['summary']['symbol_code'] ?? ( $row['data']['next_6_hours']['summary']['symbol_code'] ?? 'cloudy' );
				if ( $timestamp && is_numeric( $temp ) && $temp >= -90 && $temp <= 60 && is_string( $symbol ) && preg_match( '/^[a-z_]+$/D', $symbol ) ) {
					$points[] = array( 'time' => $timestamp, 'temp' => (float) $temp, 'symbol' => $symbol );
				}
			}
			if ( $points ) {
				$cached = array( 'points' => $points, 'updated_at' => $now, 'next_check' => $next_check, 'last_modified' => sanitize_text_field( wp_remote_retrieve_header( $response, 'last-modified' ) ?: '' ) );
			} else {
				$cached['next_check'] = $now + 5 * MINUTE_IN_SECONDS;
			}
		} elseif ( 304 === $code && ! empty( $cached['points'] ) ) {
			$cached['next_check'] = $next_check;
			$cached['updated_at'] = $now;
		} else {
			$cached['next_check'] = $now + 5 * MINUTE_IN_SECONDS;
		}
		set_transient( 'dx_london_weather_v1', $cached, max( DAY_IN_SECONDS, (int) $cached['next_check'] - $now + HOUR_IN_SECONDS ) );
	}
	$empty = array( 'available' => false, 'temp_c' => null, 'label' => 'London weather currently unavailable', 'icon' => 'cloud', 'updated_at' => 0 );
	if ( empty( $cached['points'] ) || $now - (int) ( $cached['updated_at'] ?? 0 ) > 3 * HOUR_IN_SECONDS ) {
		return $empty;
	}
	$points = $cached['points'];
	usort( $points, static fn( $a, $b ) => abs( $a['time'] - $now ) <=> abs( $b['time'] - $now ) );
	$point = $points[0];
	if ( abs( $point['time'] - $now ) > 2 * HOUR_IN_SECONDS ) { return $empty; }
	$symbol = $point['symbol'];
	$icon = str_contains( $symbol, 'thunder' ) ? 'storm' : ( str_contains( $symbol, 'snow' ) || str_contains( $symbol, 'sleet' ) ? 'snow' : ( str_contains( $symbol, 'rain' ) ? 'rain' : ( str_contains( $symbol, 'fog' ) ? 'fog' : ( str_contains( $symbol, 'clearsky' ) ? ( str_contains( $symbol, 'night' ) ? 'moon' : 'sun' ) : ( str_contains( $symbol, 'partlycloudy' ) || str_contains( $symbol, 'fair' ) ? 'partly' : 'cloud' ) ) ) ) );
	$labels = array( 'storm' => 'Thunderstorms', 'snow' => 'Snow or sleet', 'rain' => 'Rain', 'fog' => 'Fog', 'moon' => 'Clear night', 'sun' => 'Clear', 'partly' => 'Partly cloudy', 'cloud' => 'Cloudy' );
	return array( 'available' => true, 'temp_c' => (int) round( $point['temp'] ), 'label' => $labels[ $icon ], 'icon' => $icon, 'updated_at' => (int) $cached['updated_at'] );
}

function dx_london_weather_markup() {
	$weather = dx_london_weather();
	$cloud = '<path d="M5 17h13a4 4 0 0 0 0-8 6 6 0 0 0-11-1 4.5 4.5 0 0 0-2 9Z"/>';
	$icons = array(
		'cloud' => $cloud,
		'rain' => $cloud . '<path d="m8 20-1 2m6-2-1 2m6-2-1 2"/>',
		'snow' => $cloud . '<path d="M7 21h.01M12 21h.01M17 21h.01"/>',
		'fog' => $cloud . '<path d="M4 20h16M7 23h10"/>',
		'storm' => $cloud . '<path d="m13 17-3 4h4l-3 4"/>',
		'sun' => '<circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',
		'moon' => '<path d="M20 15a9 9 0 0 1-11-11 9 9 0 1 0 11 11Z"/>',
		'partly' => '<path d="M5 9a5 5 0 0 1 8-4M5 1v2M1 5l2 1m7-5-1 2"/>' . $cloud,
	);
	$temperature = $weather['available'] ? $weather['temp_c'] . '°' : '—°';
	$description = $weather['available'] ? 'London forecast: ' . $weather['label'] . ', ' . $weather['temp_c'] . ' degrees Celsius. Data from MET Norway.' : $weather['label'] . '. Data from MET Norway.';
	?>
	<span class="dx-london-weather" role="img" aria-label="<?php echo esc_attr( $description ); ?>" title="<?php echo esc_attr( $description ); ?>">
		<span class="dx-london-weather__icon"><svg viewBox="0 0 24 26" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><?php echo $icons[ $weather['icon'] ]; ?></svg></span>
		<span class="dx-london-weather__temperature"><?php echo esc_html( $temperature ); ?></span>
		<span class="visually-hidden">Data from MET Norway · London forecast</span>
	</span>
	<?php
}
