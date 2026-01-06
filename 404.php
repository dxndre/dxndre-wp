<?php
/**
 * Template Name: Not found
 * Description: Page template 404 Not found.
 *
 */

get_header();

$search_enabled = get_theme_mod( 'search_enabled', '1' ); // Get custom meta-value.
?>
<div id="post-0" class="content error404 not-found">
	<div class="container">
		<section class="error-404">
			<div class="content-404">
				<pre class="headline">Error 404</pre>
				<h1>Yikes, that’s an error.</h1>

				<p>The page you were looking for can’t be found.</p>

				<?php if (isset($_GET['reset']) && $_GET['reset'] === 'sent'): ?>
					<p class="success">If that email exists, a reset link has been sent.</p>
				<?php endif; ?>

				<div class="buttons-container">
					<a
						href="<?php echo esc_url( home_url( '/' ) ); ?>"
						class="btn btn-primary"
					>
						Back to Homepage
					</a>

					<a
						href="<?php echo esc_url(
							! empty( $_SERVER['HTTP_REFERER'] )
								? wp_unslash( $_SERVER['HTTP_REFERER'] )
								: home_url( '/' )
						); ?>"
						class="btn btn-primary alternative"
					>
						<i class="fa-solid fa-arrow-left"></i>
						Back to Previous Page
					</a>

				</div>
			</div>

			<div class="graphic-content">
				<img src="<?php echo get_template_directory_uri(); ?>/assets/img/404.png" alt="Error 404 graphic">
			</div>
		</section>
	</div>
</div><!-- /#post-0 -->
<?php
get_footer();
