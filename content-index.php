<?php
/**
 * The template for displaying content in the index.php template.
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'col-md-6' ); ?>>
	<div class="card mb-4">
		<header class="card-body">
			<?php
				$post_type      = get_post_type();
				$post_type_obj  = get_post_type_object( $post_type );
				$post_type_name = $post_type_obj ? $post_type_obj->labels->singular_name : '';
			?>

			<?php if ( $post_type_name ) : ?>
				<span class="post-type-pill post-type-<?php echo esc_attr( $post_type ); ?>">
					<?php echo esc_html( $post_type_name ); ?>
				</span>
			<?php endif; ?>

			<h2 class="card-title">
				<a href="<?php the_permalink(); ?>" rel="bookmark">
					<?php the_title(); ?>
				</a>
			</h2>

			<?php if ( 'post' === get_post_type() ) : ?>
				<div class="card-text entry-meta">
					<?php dxndre_article_posted_on(); ?>
				</div>
			<?php endif; ?>

		</header>
		<div class="card-body">
			<div class="card-text entry-content">
				<?php
					if ( has_post_thumbnail() ) {
						echo '<div class="post-thumbnail">' . get_the_post_thumbnail( get_the_ID(), 'large' ) . '</div>';
					}

					if ( is_search() ) {
						the_excerpt();
					} else {
						the_content();
					}
				?>
				<?php wp_link_pages( array( 'before' => '<div class="page-link"><span>' . esc_html__( 'Pages:', 'dxndre' ) . '</span>', 'after' => '</div>' ) ); ?>
			</div><!-- /.card-text -->
			<footer class="entry-meta">
				<a href="<?php the_permalink(); ?>" class="btn btn-outline-secondary"><?php esc_html_e( 'more', 'dxndre' ); ?></a>
			</footer><!-- /.entry-meta -->
		</div><!-- /.card-body -->
	</div><!-- /.col -->
</article><!-- /#post-<?php the_ID(); ?> -->
