<?php
/**
 * Template Name: Page (Legal)
 * Description: Page template legal.
 *
 */

get_header();

the_post();
?>
<div id="post-<?php the_ID(); ?>" <?php post_class( 'content' ); ?>>
	<div class="container">
		<div class="legal-banner dx-services-intro"><p class="dx-eyebrow">The details / Clear &amp; considered</p>
			<h1 class="entry-title"><?php the_title(); ?></h1><p><?php echo is_page('terms-of-service') ? 'Clear terms. Considered collaboration.' : 'Your information, handled with care.'; ?></p>
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
