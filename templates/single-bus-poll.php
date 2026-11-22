<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
get_header();
while ( have_posts() ) : the_post(); ?>
<div class="dx-pulse dx-pulse-single"><div class="dx-pulse-wrap"><a class="dx-pulse-back" href="<?php echo esc_url( get_post_type_archive_link( 'dx_bus_poll' ) ); ?>">← Back to DX. Pulse</a><header class="dx-pulse-single-heading"><p class="dx-pulse-eyebrow">DX. Pulse / <?php echo esc_html( dx_pulse_category( get_the_ID() ) ); ?></p><h1><?php echo esc_html( dx_pulse_question( get_the_ID() ) ); ?></h1></header><div id="pulse-voting"><?php dx_pulse_feature( get_the_ID() ); ?></div><?php if ( trim( get_the_content() ) ) : ?><div class="dx-pulse-context"><?php the_content(); ?></div><?php endif; ?><p class="dx-pulse-rules">One vote per account, or per browser for guests. Guest votes are not identity-verified. Clearing cookies or using another browser can bypass the guest limit. Votes cannot be changed.</p></div></div>
<?php endwhile;
get_footer();
