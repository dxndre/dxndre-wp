<?php
/**
 * The template for displaying content in the single.php template.
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<?php
		$hero_image = get_field('hero_image');
		$style = '';
		if ( $hero_image ) {
			$style = 'style="background-image: url(\'' . esc_url( $hero_image['url'] ) . '\');"';
		}
	?>
	<header class="entry-header hero" <?php echo $style; ?>>
		<div class="container">
			<div class="header-content">

				<a class="back" href="/services/">
					<i class="fa-solid fa-arrow-left"></i>
					<span>All Services</span>
				</a>

				<pre class="headline">Service</pre>

				<h1 class="entry-title">
					<?php the_title(); ?>
				</h1>

				<?php if ( has_excerpt() ) : ?>
					<p class="excerpt">
						<?php echo esc_html( get_the_excerpt() ); ?>
					</p>
				<?php endif; ?>

			</div>
		</div>
	</header>

	<div class="entry-content">
		<?php

		the_content();

		wp_link_pages(
			array(
				'before' => '<div class="page-link"><span>' . esc_html__( 'Pages:', 'dxndre' ) . '</span>',
				'after'  => '</div>',
			)
		);
		?>
	</div><!-- /.entry-content -->

	<?php
		edit_post_link( __( 'Edit', 'dxndre' ), '<span class="edit-link">', '</span>' );
	?>
</article><!-- /#post-<?php the_ID(); ?> -->
