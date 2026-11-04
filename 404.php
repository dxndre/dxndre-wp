<?php
/** The missing-page experience shares the account pages' London sky. */

get_header();

$london_now    = new DateTimeImmutable( 'now', new DateTimeZone( 'Europe/London' ) );
$london_day    = $london_now->format( 'Y-m-d' );
$london_stamp  = $london_now->getTimestamp() * 1000;
$london_period = 'night';
$solar_days    = array();
if ( function_exists( 'dxndre_london_sun_events' ) ) {
	foreach ( array( -1, 0, 1 ) as $offset ) {
		$date = $london_now->modify( sprintf( '%+d day', $offset ) )->format( 'Y-m-d' );
		$solar_days[ $date ] = dxndre_london_sun_events( $date );
	}
	$events = $solar_days[ $london_day ];
	if ( $events ) {
		$london_period = $london_stamp < $events['dawn'] || $london_stamp >= $events['dusk'] ? 'night' : ( $london_stamp < $events['sunrise'] ? 'dawn' : ( $london_stamp < $events['sunset'] ? 'day' : 'dusk' ) );
	}
	// The existing account clock consumes this exact cache and endpoint.
	wp_localize_script( 'dxndre-theme', 'DX_LONDON_SUN', array( 'days' => $solar_days, 'endpoint' => rest_url( 'dxndre/v1/london-sun' ) ) );
}

$back_url = wp_get_referer();
if ( ! $back_url || wp_parse_url( $back_url, PHP_URL_HOST ) !== wp_parse_url( home_url(), PHP_URL_HOST ) ) {
	$back_url = home_url( '/portfolio/' );
}
?>
<?php if ( function_exists( 'dx_london_weather_markup' ) ) : ?>
	<template id="dx-london-weather-template"><?php dx_london_weather_markup(); ?></template>
<?php endif; ?>

<div id="post-0" class="content error404 not-found dx-not-found">
	<section class="dx-404-hero" aria-labelledby="dx-404-title" data-london-period="<?php echo esc_attr( $london_period ); ?>">
		<div class="graphic-content dx-404-sky"></div>
		<div class="dx-404-wrap">
			<p class="dx-eyebrow dx-404-eyebrow">A little off course</p>
			<h1 id="dx-404-title"><span aria-hidden="true">404<span class="dx-404-dot">.</span></span><span class="visually-hidden">Page not found</span></h1>
			<figure class="dx-404-portrait" aria-hidden="true">
				<img src="<?php echo esc_url( get_theme_file_uri( '/assets/img/portrait-editorial.png' ) ); ?>" alt="" width="1122" height="1390" fetchpriority="high" decoding="async">
			</figure>
			<div class="dx-404-copy">
				<h2>Let’s find your<br>way back.</h2>
				<p>This page may have moved, or the link might be a little out of date. There’s plenty more to explore.</p>
				<?php if ( isset( $_GET['reset'] ) && 'sent' === $_GET['reset'] ) : ?>
					<p class="dx-404-notice" role="status">If that email exists, a reset link has been sent.</p>
				<?php endif; ?>
				<div class="dx-404-actions">
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="dx-cta">Back to homepage <span aria-hidden="true">↗</span></a>
					<a href="<?php echo esc_url( $back_url ); ?>" class="dx-cta dx-cta--outline">Take a step back <span aria-hidden="true">↖</span></a>
				</div>
			</div>
			<p class="dx-404-caption" aria-hidden="true">A different direction.<br>The same curiosity.</p>
		</div>
	</section>
</div>

<?php get_footer(); ?>
