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
				<h1 class="page-title"><?php printf( esc_html__( 'Search Results for: %s', 'dxndre' ), get_search_query() ); ?></h1>
				<?php
					get_search_form();
				?>
			</div>
		</div>
	</header>
<?php
	get_template_part( 'archive', 'loop' );
else :
?>
	<article id="post-0" class="post no-results not-found">
		<header class="entry-header">
			<div class="container">
				<div class="header-content">
					<pre class="headline">Search Results</pre>
					<h1 class="page-title d-none"><?php printf( esc_html__( 'Search Results for: %s', 'dxndre' ), get_search_query() ); ?></h1>
					<h2><?php esc_html_e( 'We couldn’t find a direct match - but you’re in the right place.', 'dxndre' ); ?></h2>
					<p><?php esc_html_e( 'Try refining your search, or explore my work, services, and case studies below.', 'dxndre' ); ?></p>


					<?php
						get_search_form();
					?>
				</div>
			</div>
		</header><!-- /.entry-header -->
		<div class="no-returned-results">
			<div class="container">
			</div>
		</div>
	</article><!-- /#post-0 -->
<?php
endif;
wp_reset_postdata();

get_footer();
