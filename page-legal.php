<?php
/**
 * Template Name: Page (Legal)
 * Description: Page template legal.
 *
 */

// Read the saved presentation preference before the page is painted.
add_action( 'wp_head', function () { dxndre_print_theme_bootstrap( 'legal-views' ); }, 2 );
get_header();

the_post();
$legal_tone = is_page( 'cookie-policy-uk' ) ? 'cookies' : ( is_page( 'terms-of-service' ) ? 'terms' : 'privacy' );
?>
<div id="post-<?php the_ID(); ?>" <?php post_class( 'content dx-legal-page' ); ?> data-legal-tone="<?php echo esc_attr( $legal_tone ); ?>">
	<div class="container">
		<div class="legal-banner dx-services-intro"><p class="dx-eyebrow">The details / Clear &amp; considered</p>
			<h1 class="entry-title"><?php the_title(); ?></h1><p><?php echo is_page('terms-of-service') ? 'Clear terms. Considered collaboration.' : ( is_page('cookie-policy-uk') ? 'Your choices. Clearly explained.' : 'Your information, handled with care.' ); ?></p>
		</div>
		<div class="dx-legal-views" data-legal-views hidden>
			<div class="dx-legal-views__choices" role="group" aria-label="Reading view">
				<button type="button" data-legal-choice="immersive" aria-pressed="true"><span aria-hidden="true">✦</span> Immersive</button>
				<button type="button" data-legal-choice="plain" aria-pressed="false"><span aria-hidden="true">Aa</span> Plain Text</button>
			</div>
			<p data-legal-status role="status" aria-live="polite">Immersive view · Soft background glow</p>
		</div>
		<?php
			echo '<div class="dx-legal-copy">';
			the_content();
			echo '</div>';

			wp_link_pages(
				array(
					'before'   => '<nav class="page-links" aria-label="' . esc_attr__( 'Page', 'dxndre' ) . '">',
					'after'    => '</nav>',
					'pagelink' => esc_html__( 'Page %', 'dxndre' ),
				)
			);
			edit_post_link(
				esc_attr__( 'Edit', 'dxndre' ),
				'<span class="edit-link">',
				'</span>'
			);
		?>
	</div>
	
</div><!-- /#post-<?php the_ID(); ?> -->
<?php
	// If comments are open or we have at least one comment, load up the comment template.
	if ( comments_open() || get_comments_number() ) {
		comments_template();
	}

get_footer();
