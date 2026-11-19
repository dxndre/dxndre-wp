<?php
/** Enhancements for the Services page's existing Gutenberg query cards. */
function dxndre_services_card_details($post_id) {
    $labels = [
        'design' => ['01', 'Design'],
        'development' => ['02', 'Build'],
        'wordpress-development' => ['03', 'WordPress'],
        'comprehensive' => ['04', 'End-to-end'],
        'retainer' => ['05', 'Ongoing support'],
        'one-time-fixes' => ['06', 'Targeted help'],
    ];
    return $labels[get_post_field('post_name', $post_id)] ?? null;
}
add_filter('render_block_core/post-title', function($html, $block, $instance) {
    if (!is_page('services')) return $html;
    $id = (int) ($instance->context['postId'] ?? 0);
    if (get_post_type($id) !== 'service') return $html;
    $details = dxndre_services_card_details($id);
    if (!$details) return $html;
    return '<p class="service-card-category"><span>' . esc_html($details[1]) . '</span><span aria-hidden="true">' . esc_html($details[0]) . '</span></p>' . $html;
}, 10, 3);
add_filter('render_block_core/post-excerpt', function($html, $block, $instance) {
    if (!is_page('services')) return $html;
    $id = (int) ($instance->context['postId'] ?? 0);
    if (get_post_type($id) !== 'service') return $html;
    return $html . '<a class="service-card-link" href="' . esc_url(get_permalink($id)) . '" aria-label="Explore ' . esc_attr(get_the_title($id)) . '"><span>Explore service</span><span aria-hidden="true">↗</span></a>';
}, 10, 3);
add_filter('render_block_core/post-template', function($html) {
    if (!is_page('services') || strpos($html, 'type-service') === false) return $html;
    $closing = strrpos($html, '</ul>');
    if ($closing === false) return $html;
    $image = get_theme_file_uri('/assets/img/services/personal-training.webp');
    $training = '<li class="service-training-card">'
        . '<figure><img src="' . esc_url($image) . '" width="1200" height="800" loading="lazy" decoding="async" alt="Dumbbells in a warmly lit gym"></figure>'
        . '<div class="service-training-content"><div class="service-training-heading"><p class="service-card-category">Beyond digital</p><span class="service-coming-soon">Coming soon</span></div>'
        . '<h3>Personal Training</h3><p>A new service focused on training, discipline and progress. Details will be announced soon.</p>'
        . '<a class="service-card-link" href="' . esc_url(home_url('/contact/?service=personal-training')) . '"><span>Enquire about training</span><span aria-hidden="true">↗</span></a></div></li>';
    $additional = '';
    foreach ([
        ['Photography', 'A different perspective', 'Photography with an eye for atmosphere, detail and the moments worth keeping. Tell me what you have in mind and we can shape the brief together.', 'mailto:hello@dxndre.co.uk?subject=Photography%20enquiry', 'Enquire about photography'],
    ] as $service) {
        $additional .= '<li class="service-training-card service-personal-card"><div class="service-training-content"><p class="service-card-category">' . esc_html($service[1]) . '</p><h3>' . esc_html($service[0]) . '</h3><p>' . esc_html($service[2]) . '</p><a class="service-card-link" href="' . esc_url(strpos($service[3], 'mailto:') === 0 ? $service[3] : home_url($service[3])) . '"><span>' . esc_html($service[4]) . '</span><span aria-hidden="true">↗</span></a></div></li>';
    }
    return substr_replace($html, $training . $additional, $closing, 0);
});

/** Add current calculator rates to the editorial Services layout. */
add_filter('the_content', function ($html) {
    if (!is_page('services') || !in_the_loop() || !is_main_query() || !function_exists('dx_calculator_services')) {
        return $html;
    }
    $prices = array_column(dx_calculator_services(), null, 'key');
    $service_links = [
        'design' => 'design',
        'development' => 'development',
        'wordpress-development' => 'wp_development',
        'comprehensive' => 'comprehensive',
        'retainer' => 'retainer',
        'one-time-fixes' => 'one_off',
    ];
    $price_label = static function ($price, $monthly = false) {
        $decimals = floor($price) === (float) $price ? 0 : 2;
        return '<p class="dx-service-starting-price"><small>STARTING FROM</small> £' . esc_html(number_format_i18n($price, $decimals))
            . ($monthly ? '/month' : '') . '</p>';
    };
    $html = preg_replace_callback('~(<div class="dx-service-actions">\s*<a\b[^>]*href="[^"]*/service/([a-z-]+)/?")~', static function ($matches) use ($prices, $service_links, $price_label) {
        $rate = $prices[$service_links[$matches[2]] ?? ''] ?? null;
        return $rate ? $price_label($rate['price'], $rate['monthly']) . $matches[1] : $matches[1];
    }, $html);
    $html = preg_replace_callback('~(<a\b[^>]*href="[^"]*/service/([a-z-]+)/?"[^>]*>.*?</a>)~s', static function ($matches) use ($service_links, $prices) {
        $slug = $matches[2];
        $label = $slug === 'photography' ? 'Photography' : ($prices[$service_links[$slug] ?? '']['title'] ?? '');
        if (!$label || stripos($matches[1], 'Explore photography') !== false) return $matches[1];
        return '<div class="dx-service-cta-pair">' . $matches[1] . '<button type="button" class="dx-cta dx-cta--outline" data-basket-service="' . esc_attr($slug) . '" data-basket-label="' . esc_attr($label) . '">Add to cart <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 3h3l3 13h11l3-9H6 M9 21h.01 M18 21h.01"/></svg></button></div>';
    }, $html);
    return preg_replace('~(<div class="dx-service-cta-pair">)(?=<a\b[^>]*href="[^"]*/service/photography/?"[^>]*>)~', $price_label(40) . '$1', $html, 1);
}, 20);
