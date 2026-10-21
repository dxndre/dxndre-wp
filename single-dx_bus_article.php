
<?php
get_header();
the_post();

// Calculate estimated reading time.
$words = preg_match_all(
	'/[\p{L}\p{N}]+/u',
	wp_strip_all_tags( strip_shortcodes( get_the_content() ) )
);

$minutes = max( 1, (int) ceil( $words / 200 ) );

// Author portrait.
$portrait_url = get_template_directory_uri() . '/assets/img/portrait-editorial.png';
?>

<article class="dx-bus-article">
	<header>
		<p class="dx-eyebrow">News &amp; Views<?php if ( get_post_meta( get_the_ID(), '_dx_sample_article', true ) ) : ?> / Sample Article<?php endif; ?></p>
		<h1><?php the_title(); ?></h1>
		<p><?php echo esc_html( get_the_excerpt() ); ?></p>
		<div class="dx-article-byline">
			<img
				src="<?php echo esc_url( $portrait_url ); ?>"
				alt=""
			>
			<div>
				<strong>
					<?php echo esc_html( get_the_author() ?: 'D’André Phillips' ); ?>
				</strong>
				<span>
					<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>">
						<?php echo esc_html( get_the_date( 'j F Y' ) ); ?>
					</time>
					· <?php echo esc_html( $minutes ); ?> min read
				</span>
			</div>
		</div>
	</header>
	
    <?php
    // Featured image.
    if ( has_post_thumbnail() ) :

        // Main article image.
        the_post_thumbnail(
            'full',
            [
                'class' => 'dx-bus-article-image',
            ]
        );

        // Duplicate image for the glowing backdrop.
        the_post_thumbnail(
            'full',
            [
                'class'       => 'dx-bus-article-image backdrop',
                'alt'         => '',
                'aria-hidden' => 'true',
            ]
        );

    endif;
    ?>

	<div class="dx-bus-article-body">
		<?php the_content(); ?>
		<a
			class="dx-cta dx-cta--outline"
			href="<?php echo esc_url( home_url( '/buses/#news' ) ); ?>"
		>
			Back to News &amp; Views ↗
		</a>
	</div>
	<?php
	// Retrieve related articles.
	$related = get_posts(
		[
			'post_type'    => 'dx_bus_article',
			'post_status'  => 'publish',
			'numberposts'  => 2,
			'post__not_in' => [ get_the_ID() ],
		]
	);
	?>
	<?php if ( $related ) : ?>
		<nav
			class="dx-related-articles"
			aria-label="More articles"
		>
			<p class="dx-eyebrow">Keep reading</p>
			<h2>More from News &amp; Views.</h2>
			<div>
				<?php foreach ( $related as $article ) : ?>
					<a href="<?php echo esc_url( get_permalink( $article ) ); ?>">
						<?php
						echo get_the_post_thumbnail(
							$article,
							'large',
							[
								'loading' => 'lazy',
							]
						);
						?>
						<span>
							<small>
								<?php echo esc_html( get_the_date( 'j F Y', $article ) ); ?>
							</small>
							<h3>
								<?php echo esc_html( $article->post_title ); ?>
							</h3>
							<p>
								<?php echo esc_html( get_the_excerpt( $article ) ); ?>
							</p>
							<strong>Read article ↗</strong>
						</span>
					</a>
				<?php endforeach; ?>
			</div>
		</nav>
	<?php endif; ?>
</article>

<?php get_footer(); ?>
