<?php
/**
 * Template Name: Access Denied
 * Description: Page template 405 Access Denied.
 *
 */

get_header();

$search_enabled = get_theme_mod( 'search_enabled', '1' ); // Get custom meta-value.
?>
<div id="post-0" class="content error405 not-found">
	<div class="container">
		<section class="error-405">
			<div class="content-405">
				<pre class="headline">Error 405</pre>
				<h1>Access Denied</h1>

				<p>The content you’re trying to access is denied based on your location.</p>
			</div>
		</section>
	</div>
</div><!-- /#post-0 -->
<?php
get_footer();
