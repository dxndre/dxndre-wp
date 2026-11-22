<?php
/**
 * Site-wide command palette and LogItDown introduction.
 */

add_action( 'wp_body_open', function () {
	$items = array();
	$destinations = array(
		array( 'Portfolio', '/portfolio/', 'work case studies projects', 'Explore selected design and development projects.' ),
		array( 'Services', '/services/', 'hire website design development', 'Explore digital, fitness and photography services.' ),
		array( 'Buses', '/buses/', 'transport tfl route tracking london bus', 'Explore London bus routes and live arrivals.' ),
		array( 'Gyms', '/fitness/gyms/', 'fitness league map gym reviews', 'Compare gyms and read individual reviews.' ),
		array( 'Contact', '/contact/', 'hire get in touch enquiry email', 'Start a conversation about your project.' ),
		array( 'Apps', '/apps/', 'app upcoming software', 'A new app is coming soon.' ),
	);
	foreach ( $destinations as list( $title, $path, $keywords, $description ) ) {
		$items[] = array( 'title' => $title, 'url' => home_url( $path ), 'type' => 'Navigate', 'tags' => $keywords, 'description' => $description );
	}

	$types = array_values( array_filter( array( 'project', 'service', 'gym-review', 'dx_bus_article' ), 'is_post_type_viewable' ) );
	$posts = $types ? get_posts( array(
		'post_type' => $types,
		'post_status' => 'publish',
		'has_password' => false,
		'numberposts' => 120,
	) ) : array();
	foreach ( $posts as $post ) {
		$type = get_post_type_object( $post->post_type );
		$terms = wp_get_object_terms( $post->ID, get_object_taxonomies( $post->post_type, 'names' ), array( 'fields' => 'names' ) );
		$items[] = array(
			'title' => wp_strip_all_tags( get_the_title( $post ) ),
			'url' => get_permalink( $post ),
			'type' => $type->labels->singular_name,
			'tags' => is_wp_error( $terms ) ? '' : implode( ' · ', $terms ),
			'similar' => is_wp_error( $terms ) ? '' : ( $terms[0] ?? '' ),
			'description' => wp_trim_words( wp_strip_all_tags( get_the_excerpt( $post ) ), 32 ),
			'image' => get_the_post_thumbnail_url( $post, 'medium_large' ),
			'imageSrcset' => wp_get_attachment_image_srcset( get_post_thumbnail_id( $post ), 'medium_large' ),
			'project' => 'project' === $post->post_type,
		);
	}
	?>
	<button id="dx-command-open" type="button" aria-haspopup="dialog" aria-controls="dx-command" hidden>DX. Command <kbd>⌘ / Ctrl K</kbd></button>
	<dialog id="dx-command" aria-labelledby="dx-command-title">
		<header><h2 id="dx-command-title">DX. Command</h2><button type="button" data-command-close aria-label="Close command palette">×</button></header>
		<label class="visually-hidden" for="dx-command-query">Find a page, project or bus route</label>
		<input id="dx-command-query" placeholder="Find a page, project or bus route" type="search" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls="dx-command-results">
		<div class="dx-command-grid">
			<ul id="dx-command-results" role="listbox" aria-label="Results"></ul>
			<div data-command-preview></div>
		</div>
		<p data-command-status role="status"></p>
	</dialog>
	<script type="application/json" id="dx-command-index"><?php echo wp_json_encode( $items, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT ); ?></script>
	<?php
} );

