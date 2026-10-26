<?php
/** Instagram's public profile embed, placed before the site footer. */
defined('ABSPATH') || exit;

/** Only the About, Fitness and N118 Fitness pages (and N118 descendants). */
function dx_instagram_profile() {
	if (!is_page() || post_password_required()) {
		return null;
	}

	$page = get_queried_object();
	if (!$page instanceof WP_Post) {
		return null;
	}

	if ($page->post_name === 'about') {
		return [
			'username' => 'd.xndre_',
			'eyebrow' => 'A LITTLE MORE / OFF THE CLOCK',
			'heading' => 'Life beyond <em>the screen.</em>',
			'description' => 'The moments, interests and everyday details in between. Follow along on Instagram.',
		];
	}

	$fitness_page = in_array($page->post_name, ['fitness', 'n118-fitness'], true);
	if (!$fitness_page) {
		foreach (get_post_ancestors($page) as $ancestor_id) {
			if (get_post_field('post_name', $ancestor_id) === 'n118-fitness') {
				$fitness_page = true;
				break;
			}
		}
	}

	if (!$fitness_page) {
		return null;
	}

	return [
		'username' => 'N118Fitness',
		'eyebrow' => 'N118 FITNESS / ON INSTAGRAM',
		'heading' => 'Keep showing <em>up.</em>',
		'description' => 'Follow the N118 Fitness journey, from the daily routine to what comes next.',
	];
}

function dx_render_instagram_section() {
	$profile = dx_instagram_profile();
	if (!$profile) {
		return;
	}
	$url = 'https://www.instagram.com/' . strtolower($profile['username']) . '/';
	?>
	<section class="dx-instagram" aria-labelledby="dx-instagram-title" data-instagram-profile="<?php echo esc_attr($profile['username']); ?>">
		<div class="dx-instagram__intro">
			<p class="dx-instagram__eyebrow"><?php echo esc_html($profile['eyebrow']); ?></p>
			<h2 id="dx-instagram-title"><?php echo wp_kses($profile['heading'], ['em' => []]); ?></h2>
			<p class="dx-instagram__description"><?php echo esc_html($profile['description']); ?></p>
			<a class="dx-instagram__profile" href="<?php echo esc_url($url); ?>" target="_blank" rel="noopener noreferrer">
				<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
				<span>@<?php echo esc_html($profile['username']); ?></span><span aria-hidden="true">↗</span>
			</a>
		</div>
		<div class="dx-instagram__feed" data-instagram-feed>
			<p class="dx-instagram__status" data-instagram-status role="status"><span class="dx-instagram__spinner" aria-hidden="true"></span><span data-instagram-message>Latest from Instagram</span></p>
			<div class="dx-instagram__embed" data-instagram-embed>
				<blockquote class="instagram-media" data-instgrm-permalink="<?php echo esc_url($url); ?>" data-instgrm-version="14">
					<a href="<?php echo esc_url($url); ?>" target="_blank" rel="noopener noreferrer">View @<?php echo esc_html($profile['username']); ?> on Instagram <span aria-hidden="true">↗</span></a>
				</blockquote>
			</div>
			<p class="dx-instagram__fallback">More from <a href="<?php echo esc_url($url); ?>" target="_blank" rel="noopener noreferrer">@<?php echo esc_html($profile['username']); ?> on Instagram <span aria-hidden="true">↗</span></a></p>
		</div>
	</section>
	<?php
}
