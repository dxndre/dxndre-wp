<?php
/** Homepage intent selection, progressively enhanced without replacing content. */
defined('ABSPATH') || exit;

add_shortcode('dx_home_paths', function () {
	$journeys = [
		'client' => ['I need a website', '01'],
		'hiring' => ['I’m hiring', '02'],
		'fitness' => ['Fitness & coaching', '03'],
		'exploring' => ['Just exploring', '04'],
	];
	$service = get_page_by_path('comprehensive', OBJECT, 'service');
	$visuals = [
		'client' => ($service ? get_the_post_thumbnail_url($service, 'large') : '') ?: get_theme_file_uri('/assets/img/calculator-copper.webp'),
		'hiring' => get_theme_file_uri('/assets/img/home-intent-hiring-portrait.webp'),
		'exploring' => get_theme_file_uri('/assets/img/home-intent-exploring-lossless.webp'),
		'fitness' => get_theme_file_uri('/assets/img/n118-gym-mirrors.webp'),
	];
	ob_start(); ?>
	<section id="start-here" class="dx-home-paths" aria-labelledby="dx-home-paths-title" data-home-paths data-intent-scene data-intent-entrance>
		<div class="dx-intent-backdrop" aria-hidden="true"><?php foreach ($visuals as $key => $image): ?><div data-intent-art="<?php echo esc_attr($key); ?>" data-intent-src="<?php echo esc_url($image); ?>"></div><?php endforeach; ?></div>
		<div class="dx-home-paths__heading"><div><p class="dx-eyebrow">One person. Different perspectives.</p><h2 id="dx-home-paths-title">What brings you here?</h2></div><p>Start with what matters to you.<br>There’s more to explore along the way.</p></div>
		<nav class="dx-home-paths__choices" aria-label="Choose your starting point">
			<?php foreach ($journeys as $key => $journey): ?>
				<a href="<?php echo esc_url(add_query_arg('journey', $key, home_url('/'))); ?>" data-home-journey="<?php echo esc_attr($key); ?>" data-intent-key="<?php echo esc_attr($key); ?>"><span><?php echo esc_html($journey[1]); ?></span><strong><?php echo esc_html($journey[0]); ?></strong><span aria-hidden="true">↗</span></a>
			<?php endforeach; ?>
		</nav>
		<p class="dx-home-paths__note">The same homepage, with a starting point that suits you. Everything is still here to explore.</p>
		<p class="screen-reader-text" aria-live="polite" aria-atomic="true" data-home-journey-status></p>
		<details class="dx-home-journey-switcher" data-home-switcher hidden>
			<summary><small>Your experience</small><strong data-home-current>Original homepage</strong><span>Change</span></summary>
			<div class="dx-home-journey-switcher__options">
				<nav aria-label="Change your homepage experience">
					<?php foreach ($journeys as $key => $journey): ?>
						<a href="<?php echo esc_url(add_query_arg('journey', $key, home_url('/'))); ?>" data-home-journey="<?php echo esc_attr($key); ?>"><span aria-hidden="true"><?php echo esc_html($journey[1]); ?></span><?php echo esc_html($journey[0]); ?></a>
					<?php endforeach; ?>
				</nav>
				<button type="button" data-home-original>View original homepage <span aria-hidden="true">↶</span></button>
			</div>
		</details>
	</section>
	<?php return ob_get_clean();
});

// Preload the one compiled entry; homepage ordering itself is read from main.js
// and printed immediately after the actual content by page-homepage.php.
add_action('wp_head', function () {
	if (!is_front_page()) return;
	$asset = include get_theme_file_path('build/index.asset.php');
	echo '<link rel="preload" as="script" href="' . esc_url(add_query_arg('ver', $asset['version'], get_theme_file_uri('/build/index.js'))) . '">' . "\n";
}, 3);


// Serve the traced illustrations before rendering, preserving the original media records.
add_filter('the_content', function ($content) {
	if (is_admin() || !is_page('about') || !str_contains($content, 'dx-persona-card') || !class_exists('WP_HTML_Tag_Processor')) return $content;
	$illustrations = [
		'/wp-content/uploads/2025/12/Rectangle-136.png' => 'persona-busman-illustrated.webp',
		'/wp-content/uploads/2025/12/Rectangle-139.png' => 'persona-gymbro-illustrated.webp',
	];
	$tags = new WP_HTML_Tag_Processor($content);
	while ($tags->next_tag(['tag_name' => 'IMG'])) {
		$path = wp_parse_url((string) $tags->get_attribute('src'), PHP_URL_PATH);
		if (!isset($illustrations[$path])) continue;
		$tags->set_attribute('src', get_theme_file_uri('/assets/img/' . $illustrations[$path]));
		$tags->remove_attribute('srcset');
		$tags->remove_attribute('sizes');
		$tags->set_attribute('width', '1132');
		$tags->set_attribute('height', '1260');
	}
	return $tags->get_updated_html();
}, 25);


// Match the booking page's light palette in Calendly's cross-origin frame.
add_filter('render_block', function ($html) {
	if (!is_page('book-a-call') || !str_contains($html, 'calendly-inline-widget')) return $html;

	$tags = new WP_HTML_Tag_Processor($html);
	while ($tags->next_tag(['class_name' => 'calendly-inline-widget'])) {
		$url = $tags->get_attribute('data-url');
		if (!is_string($url) || wp_parse_url($url, PHP_URL_HOST) !== 'calendly.com') continue;

		$tags->set_attribute('data-url', add_query_arg([
			'background_color' => 'ffffff',
			'text_color' => '17252e',
			'primary_color' => '87621c',
		], $url));
	}

	return $tags->get_updated_html();
}, 25);


// Booking remains a real link before JavaScript or the optional widget loads.
add_filter('render_block', function ($html, $block) {
	if (!str_contains($html, 'js-calendly-popup') || !class_exists('WP_HTML_Tag_Processor')) return $html;
	$is_booking_button = ($block['blockName'] ?? '') === 'core/button'
		&& in_array('js-calendly-popup', preg_split('/\s+/', $block['attrs']['className'] ?? ''), true);
	$tags = new WP_HTML_Tag_Processor($html);
	while ($tags->next_tag(['tag_name' => 'A'])) {
		if (!$is_booking_button && !$tags->has_class('js-calendly-popup')) continue;
		$tags->set_attribute('href', 'https://calendly.com/dxndre/30min');
	}
	return $tags->get_updated_html();
}, 25, 2);


// Use the supplied 4K portrait in the homepage foreground, keeping the media record intact.
add_filter('render_block', function ($html, $block) {
	if (is_admin() || !is_front_page() || ($block['blockName'] ?? '') !== 'core/cover'
		|| !in_array('hero-foreground', preg_split('/\s+/', $block['attrs']['className'] ?? ''), true)
		|| !class_exists('WP_HTML_Tag_Processor')) return $html;
	$tags = new WP_HTML_Tag_Processor($html);
	if ($tags->next_tag(['tag_name' => 'IMG'])) {
		$tags->set_attribute('src', get_theme_file_uri('/assets/img/home-hero-portrait-4k.webp'));
		$tags->set_attribute('srcset', get_theme_file_uri('/assets/img/home-hero-portrait-mobile.webp') . ' 1280w, ' . get_theme_file_uri('/assets/img/home-hero-portrait-4k.webp') . ' 3840w');
		$tags->set_attribute('sizes', '100vw');
		$tags->set_attribute('width', '3840');
		$tags->set_attribute('height', '2480');
		$tags->set_attribute('loading', 'eager');
		$tags->set_attribute('fetchpriority', 'high');
	}
	return $tags->get_updated_html();
}, 26, 2);

// Serve responsive WebP covers on the homepage while preserving the media library originals.
add_filter('render_block_core/cover', function ($html) {
	if (!is_front_page() || !class_exists('WP_HTML_Tag_Processor')) return $html;

	$tags = new WP_HTML_Tag_Processor($html);
	if (!$tags->next_tag(['tag_name' => 'IMG', 'class_name' => 'wp-block-cover__image-background'])) return $html;
	$source = wp_parse_url((string) $tags->get_attribute('src'), PHP_URL_PATH);
	$covers = [
		'Rectangle-135-scaled.png' => 'hero',
		'Rectangle-127-scaled.png' => 'portfolio',
		'Rectangle-128.png' => 'fitness',
	];
	$cover = $covers[wp_basename((string) $source)] ?? '';
	if (!$cover) return $html;

	$srcset = [];
	foreach ([768, 1280, $cover === 'fitness' ? 1728 : 2048] as $width) {
		$url = get_theme_file_uri("/assets/img/home-cover-$cover-$width.webp");
		$srcset[] = "$url {$width}w";
	}
	$tags->set_attribute('src', get_theme_file_uri("/assets/img/home-cover-$cover-1280.webp"));
	$tags->set_attribute('srcset', implode(', ', $srcset));
	$tags->set_attribute('sizes', '100vw');
	if ($cover !== 'hero') $tags->set_attribute('loading', 'lazy');
	return $tags->get_updated_html();
});

// Render the hero letters before first paint; the heading keeps one accessible name.
add_filter('render_block', function ($html, $block) {
 if (is_admin() || !is_front_page() || ($block['blockName'] ?? '') !== 'core/heading'
  || strpos(wp_strip_all_tags($html), 'Immersive.') === false) return $html;
 $label = trim(preg_replace('/\s+/u', ' ', wp_strip_all_tags(str_replace('<br>', ' ', $html))));
 $index = 0;
 $html = preg_replace_callback('/(<h2\b[^>]*>)(.*?)(<\/h2>)/s', function ($heading) use (&$index, $label) {
  $parts = preg_split('/(<[^>]+>)/', $heading[2], -1, PREG_SPLIT_DELIM_CAPTURE);
  foreach ($parts as &$part) {
   if ($part === '' || $part[0] === '<') continue;
   $part = preg_replace_callback('/\S+/u', function ($word) use (&$index) {
    $letters = preg_split('//u', html_entity_decode($word[0], ENT_QUOTES, 'UTF-8'), -1, PREG_SPLIT_NO_EMPTY);
    $out = '<em class="dx-hero-word" aria-hidden="true">';
    foreach ($letters as $letter) $out .= '<i class="dx-hero-letter" style="--letter-index:' . $index++ . '">' . esc_html($letter) . '</i>';
    return $out . '</em>';
   }, $part);
  }
  return substr($heading[1], 0, -1) . ' aria-label="' . esc_attr($label) . '">' . implode('', $parts) . $heading[3];
 }, $html);
 return $html;
}, 27, 2);

// Establish the portrait's initial state before paint; decoding starts its single fade.
add_action('wp_head', function () {
 if (!is_front_page()) return;
 wp_print_inline_script_tag("document.documentElement.classList.add('dx-hero-js');setTimeout(function(){document.documentElement.classList.remove('dx-hero-js')},6000);");
}, 1);
