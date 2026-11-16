<?php
/** Template Name: Apps */
get_header();
?>
<section class="dx-app-teaser" aria-labelledby="dx-app-title">
	<div class="dx-app-teaser__copy">
		<p class="dx-app-teaser__label">Apps</p>
		<h1 id="dx-app-title">Coming soon</h1>
		<p>A new app is taking shape. More details when it’s ready.</p>
		<a href="<?php echo esc_url( home_url( '/portfolio/' ) ); ?>">Explore the portfolio <span aria-hidden="true">↗</span></a>
	</div>
	<div class="dx-app-teaser__art" aria-hidden="true">
		<span></span><span></span><span></span>
	</div>
</section>
<?php get_footer(); ?>
