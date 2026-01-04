<?php
/**
 * The template for displaying content in the single.php template.
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<div class="container">
		<header class="entry-header">
			<div class="header-content">

				<a class="back" href="/portfolio/">
					<i class="fa-solid fa-arrow-left"></i>
					<span>Portfolio / All Projects</span>
				</a>

				<pre class="headline">Case Study</pre>

				<h1 class="entry-title">
					<?php the_title(); ?>
				</h1>

				<?php if ( has_excerpt() ) : ?>
					<p class="excerpt">
						<?php echo esc_html( get_the_excerpt() ); ?>
					</p>
				<?php endif; ?>

				<?php
					$site_link = get_field('site_link');
					$services  = get_field('project_type');
				?>

				<?php if ( $site_link ) : ?>
					<a
						class="visit"
						href="<?php echo esc_url( $site_link ); ?>"
						target="_blank"
						rel="noopener noreferrer"
					>
						View Live Project <i class="fa-solid fa-arrow-up-right-from-square"></i>
					</a>
				<?php endif; ?>

				<?php if ( ! empty( $services ) && is_array( $services ) ) : ?>
					<ul class="project-services">
						<?php foreach ( $services as $service ) : ?>
							<li><?php echo esc_html( $service ); ?></li>
						<?php endforeach; ?>
					</ul>
				<?php endif; ?>

			</div>
		</header>
	</div>

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
