<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
get_header(); ?>
<section class="dx-poll-page container viewport-active">
	<a class="dx-journey-video-link" href="<?php echo esc_url( home_url( '/buses/#bus-polls' ) ); ?>">← Back To Buses</a>
	<p class="dx-poll-eyebrow">Around The Network</p><h1>Your View. The Final Word.</h1>
	<p>Open questions and the results of past polls. Voting closes at the time shown on each poll.</p>
	<?php if ( have_posts() ) : ?><div class="dx-polls-grid"><?php while ( have_posts() ) : the_post(); dx_bus_poll_card( get_the_ID() ); endwhile; ?></div><?php the_posts_pagination( array( 'mid_size' => 1, 'prev_text' => '← Previous', 'next_text' => 'Next →' ) ); ?>
	<?php else : ?><div class="dx-poll-empty"><h2>The Next Question Is On Its Way.</h2><p>New questions and their final results will appear here.</p></div><?php endif; ?>
</section>
<?php get_footer();
