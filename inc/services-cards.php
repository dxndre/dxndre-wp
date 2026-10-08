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
    return substr_replace($html, $training, $closing, 0);
});
