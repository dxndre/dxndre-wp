<?php
/**
 * The Template for displaying Search Results pages.
 */

get_header();

if ( have_posts() ) :
?>	
	<header class="page-header">
		<div class="container">
			<div class="header-content">
				<pre class="headline">Search Results</pre>
				<h1 class="page-title">
					<?php printf(
						esc_html__( 'Search Results for: %s', 'dxndre' ),
						get_search_query()
					); ?>
				</h1>
				<?php get_search_form(); ?>
			</div>
		</div>
	</header>

	<?php get_template_part( 'archive', 'loop' ); ?>

<?php else : ?>

	<article id="post-0" class="post no-results not-found">
		<header class="entry-header">
			<div class="container">
				<div class="header-content">

					<pre class="headline">Search Results</pre>

					<h2 class="page-title">
						<?php esc_html_e(
							'We couldn’t find a direct match — but you’re in the right place.',
							'dxndre'
						); ?>
					</h2>

					<p class="search-intro">
						<?php esc_html_e(
							'Try refining your search, or explore areas people usually head to next.',
							'dxndre'
						); ?>
					</p>

					<?php get_search_form(); ?>

					<div class="searched-for">
						<span class="searched-for__label"><?php esc_html_e( 'You searched for:', 'dxndre' ); ?></span>
						<span class="searched-for__query">"<?php echo esc_html( get_search_query() ); ?>"</span>
					</div>

				</div>
			</div>
		</header>

		<div class="no-returned-results">
			<div class="container">

				<?php
				/**
				 * SMART SUGGESTIONS
				 * Priority: Services → Projects → Pages
				 */

				$suggestions = [];

				// 1. Services (highest intent)
				$services = get_posts([
					'post_type'      => 'page',
					'posts_per_page' => 6,
					'meta_query'     => [
						[
							'key'   => '_wp_page_template',
							'value' => 'page-service.php',
						]
					]
				]);

				foreach ( $services as $service ) {
					$suggestions[] = [
						'label' => get_the_title( $service ),
						'url'   => get_permalink( $service ),
						'type'  => 'Service'
					];
				}

				// 2. Projects / Case Studies
				$projects = get_posts([
					'post_type'      => 'project',
					'posts_per_page' => 4,
				]);

				foreach ( $projects as $project ) {
					$suggestions[] = [
						'label' => get_the_title( $project ),
						'url'   => get_permalink( $project ),
						'type'  => 'Case Study'
					];
				}

				// 3. High-value pages fallback
				$pages = get_pages([
					'sort_column' => 'menu_order',
					'parent'      => 0,
				]);

				foreach ( $pages as $page ) {
					if ( count( $suggestions ) >= 10 ) break;

					$suggestions[] = [
						'label' => get_the_title( $page ),
						'url'   => get_permalink( $page ),
						'type'  => 'Page'
					];
				}
				?>

				<?php if ( ! empty( $suggestions ) ) : ?>
					<h3>You could try searching for...</h3>
					<ul class="search-suggestions" data-enhance="true">
						<?php foreach ( $suggestions as $index => $item ) : ?>
							<li style="--delay: <?php echo esc_attr( $index ); ?>">
								<a
									href="<?php echo esc_url( $item['url'] ); ?>"
									class="search-suggestion"
									data-label="<?php echo esc_attr( $item['label'] ); ?>"
									data-type="<?php echo esc_attr( $item['type'] ); ?>"
								>
									<span class="suggestion-type">
										<?php echo esc_html( $item['type'] ); ?>
									</span>

									<div class="suggestion-content">
										<span class="suggestion-label">
											<?php echo esc_html( $item['label'] ); ?>
										</span>

										<span class="suggestion-arrow"><i class="fa-solid fa-chevron-right"></i></span>
									</div>
								</a>
							</li>
						<?php endforeach; ?>
					</ul>
				<?php endif; ?>

				<p class="search-cta">
					<?php esc_html_e( 'Or skip searching entirely —', 'dxndre' ); ?>
					<a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">
						<?php esc_html_e( 'start a conversation', 'dxndre' ); ?>
					</a>.
				</p>

			</div>
		</div>
	</article>

<?php
endif;

wp_reset_postdata();
get_footer();