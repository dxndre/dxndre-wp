<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
get_header();
while ( have_posts() ) : the_post(); ?>
<section class="dx-poll-page container viewport-active">
	<a class="dx-journey-video-link" href="<?php echo esc_url( home_url( '/buses/#bus-polls' ) ); ?>">← Back To Buses</a>
	<p class="dx-poll-eyebrow">The Network Has A Say</p>
	<h1><?php the_title(); ?></h1>
	<div class="dx-poll-context"><?php the_content(); ?></div>
	<?php dx_bus_poll_card( get_the_ID() ); ?>
</section>
<?php endwhile;
get_footer();
