<?php
/** Search-only presentation and main-query behaviour. */
add_action('wp_enqueue_scripts', function () {
    if (!is_search()) return;
    foreach (['css', 'js'] as $extension) {
        $file = 'assets/search-experience.' . $extension;
        if ($extension === 'css') {
            wp_enqueue_style('dxndre-search', get_theme_file_uri($file), ['dxndre-theme'], filemtime(get_theme_file_path($file)));
        } else {
            wp_enqueue_script('dxndre-search', get_theme_file_uri($file), [], filemtime(get_theme_file_path($file)), true);
        }
    }
}, 30);

add_action('pre_get_posts', function ($query) {
    if (is_admin() || !$query->is_main_query() || !$query->is_search()) return;
    $query->set('orderby', 'relevance');
    // An empty search is a navigation starting point, not an archive of every post.
    if (trim((string) $query->get('s')) === '') $query->set('post__in', [0]);
});

function dxndre_search_summary($post) {
    if (post_password_required($post)) return __('This content is password protected.', 'dxndre');
    // Editor-written excerpts always take priority. Give key destinations useful defaults.
    $summary = trim($post->post_excerpt);
    $defaults = [
        'buses' => 'A lifelong interest in London buses. Explore the personal side of DXNDRE.',
        'cv' => 'My background, experience and interests, in one place.',
        'about' => 'The designer, developer and bus enthusiast behind the work.',
    ];
    if (!$summary && $post->post_type === 'page') {
        $summary = $defaults[$post->post_name] ?? '';
        if (!$summary && $post->ID === (int) get_option('page_on_front')) {
            $summary = 'Design, development and life outside the screen. Start exploring here.';
        }
    }
    if (!$summary) {
        // Read stored prose only; never execute dynamic blocks or shortcodes in a result.
        $content = strip_shortcodes($post->post_content);
        if (preg_match('/<p\b[^>]*>(.*?)<\/p>/is', $content, $paragraph)) $content = $paragraph[1];
        $summary = $content;
    }
    $summary = preg_replace('/\s+/u', ' ', wp_strip_all_tags($summary, true));
    return $summary ? wp_trim_words($summary, 28, '…') : __('Explore this page for more details.', 'dxndre');
}
