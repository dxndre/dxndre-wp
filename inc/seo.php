<?php
/** Non-visual search metadata. Public content only; private routes never supply snippets. */
defined('ABSPATH') || exit;

function dx_seo_plugin_managed() {
    return defined('WPSEO_VERSION') || defined('RANK_MATH_VERSION') || defined('AIOSEO_VERSION')
        || defined('SEOPRESS_VERSION') || defined('THE_SEO_FRAMEWORK_VERSION')
        || function_exists('aioseo') || function_exists('the_seo_framework');
}

function dx_seo_private_slugs() {
    return ['recruiter-room', 'login', 'sign-up', 'signup', 'reset-password', 'forgot-password',
        'dashboard', 'client-dashboard', 'ticket', 'submit-ticket', 'proposal', 'quote', 'checkout',
        'payment', 'access-restricted', 'prove-you-are-human', 'subscription-success',
        'keep-me-on-board', 'unsubscription-success', 'unsubscribe', 'manage-subscription'];
}

function dx_seo_private_request() {
    if (is_search() || is_404() || is_preview() || get_query_var('dx_proposal') || get_query_var('ticket_id')) return true;
    if (isset($_GET['edition']) && is_string($_GET['edition']) && sanitize_key(wp_unslash($_GET['edition'])) === 'recruiter') return true;
    $object = get_queried_object();
    if ($object instanceof WP_Post) {
        if ($object->post_password !== '' || $object->post_status !== 'publish'
            || in_array($object->post_type, ['ticket', 'dx_private_project', 'mailpoet_page'], true)
            || in_array($object->post_name, dx_seo_private_slugs(), true)) return true;
        if (in_array(get_page_template_slug($object), ['page-login.php', 'page-signup.php', 'page-forgot-password.php',
            'page-dashboard.php', 'page-client-dashboard.php', 'page-submit-ticket.php', 'page-ticket.php'], true)) return true;
        foreach (get_post_ancestors($object) as $ancestor_id) {
            if (in_array(get_post_field('post_name', $ancestor_id), dx_seo_private_slugs(), true)) return true;
        }
    }
    return is_post_type_archive(['ticket', 'dx_private_project', 'mailpoet_page']);
}

function dx_seo_local_preview() {
    return function_exists('wp_get_environment_type') && in_array(wp_get_environment_type(), ['local', 'development', 'staging'], true);
}

add_filter('wp_robots', function ($robots) {
    if (dx_seo_private_request() || dx_seo_local_preview()) {
        unset($robots['index'], $robots['follow']);
        $robots['noindex'] = true;
        $robots['nofollow'] = true;
        $robots['noarchive'] = true;
    }
    return $robots;
}, 99);

// Run before plugin proposal/PDF renderers, which can exit before wp_head.
add_action('template_redirect', function () {
    if (dx_seo_private_request()) {
        nocache_headers();
        header('X-Robots-Tag: noindex, nofollow, noarchive', true);
    } elseif (dx_seo_local_preview()) {
        header('X-Robots-Tag: noindex, nofollow, noarchive', true);
    }
}, 0);

function dx_seo_text($text, $limit = 170) {
    $text = preg_replace('/<(script|style)\b[^>]*>.*?<\/\1>/is', ' ', (string) $text);
    $text = preg_replace('/<\/(p|div|h[1-6]|li|section|article)>/i', ' ', $text);
    $text = html_entity_decode(wp_strip_all_tags(strip_shortcodes($text)), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $text = trim(preg_replace('/\s+/u', ' ', $text));
    if (function_exists('mb_strlen') && mb_strlen($text) > $limit) {
        $short = mb_substr($text, 0, $limit - 1);
        $text = preg_replace('/\s+\S*$/u', '', $short) . '…';
    }
    return $text;
}

function dx_seo_description() {
    if (dx_seo_private_request()) return '';
    if (is_front_page()) return 'D’André Phillips is a London-based WordPress developer and designer creating thoughtful websites, interfaces and digital experiences.';
    $descriptions = [
        'about' => 'Meet D’André Phillips, a London-based designer and WordPress developer. Explore the experience, interests and approach behind DXNDRE.',
        'services' => 'Explore design, custom web development, WordPress development, ongoing support, one-time fixes and photography services from DXNDRE.',
        'portfolio' => 'Explore selected design and development projects by D’André Phillips, with considered ideas and thoughtful digital experiences.',
        'cv' => 'Explore D’André Phillips’s experience, skills and approach to WordPress, front-end development and digital work.',
        'contact' => 'Start a conversation with D’André Phillips about a website, a design project, an improvement or a new opportunity.',
        'start-a-project' => 'Share your project idea, priorities and requirements with DXNDRE. Start a conversation before a final quotation and payment schedule are agreed.',
        'pricing-calculator' => 'Build an initial estimate for your design or development project. Explore services, scope and features before discussing a final quotation.',
        'book-a-call' => 'Book an initial conversation with DXNDRE to discuss your project, priorities and the next step.',
        'n118-fitness' => 'Discover N118 Fitness, D’André’s upcoming personal coaching offering, built around strength, confidence and a routine that fits everyday life.',
        'fitness' => 'Follow D’André’s training journey, explore gym culture and discover the places and progress behind a personal passion for fitness.',
        'buses' => 'Explore D’André’s interest in London buses, with photography, journeys and stories from the network.',
        'photography' => 'Explore D’André Phillips’s photography gallery, with London buses and moments captured through the lens.',
        'privacy-policy' => 'Read how DXNDRE.CO.UK handles personal information, privacy and your data rights.',
        'terms-of-service' => 'Read the terms for using DXNDRE.CO.UK and enquiring about design, development, photography and coaching services.',
        'cookie-policy-uk' => 'Learn how cookies are used on DXNDRE.CO.UK and how to manage your cookie preferences.',
    ];
    $object = get_queried_object();
    if ($object instanceof WP_Post) {
        if ($object->post_name === 'faq' && function_exists('dx_faq_description')) return dx_seo_text(dx_faq_description());
        if (isset($descriptions[$object->post_name])) return $descriptions[$object->post_name];
        $excerpt = $object->post_excerpt;
        if (!$excerpt && $object->post_type === 'service') $excerpt = get_post_meta($object->ID, 'short_description', true);
        return dx_seo_text($excerpt ?: $object->post_content);
    }
    if ($object instanceof WP_Term) return dx_seo_text($object->description);
    return '';
}

function dx_seo_canonical() {
    if (dx_seo_private_request() || is_feed() || is_embed()) return '';
    if (is_singular()) return wp_get_canonical_url();
    if (is_front_page()) return home_url('/');
    if (is_home()) $url = get_option('page_for_posts') ? get_permalink(get_option('page_for_posts')) : home_url('/');
    elseif (is_post_type_archive()) {
        $type = get_queried_object();
        $url = $type instanceof WP_Post_Type ? get_post_type_archive_link($type->name) : '';
    }
    elseif (is_category() || is_tag() || is_tax()) $url = get_term_link(get_queried_object());
    elseif (is_author()) $url = get_author_posts_url(get_queried_object_id());
    elseif (is_day()) $url = get_day_link(get_query_var('year'), get_query_var('monthnum'), get_query_var('day'));
    elseif (is_month()) $url = get_month_link(get_query_var('year'), get_query_var('monthnum'));
    elseif (is_year()) $url = get_year_link(get_query_var('year'));
    else return '';
    if (!$url || is_wp_error($url)) return '';
    $paged = max(1, (int) get_query_var('paged'));
    if ($paged > 1) {
        global $wp_rewrite;
        $url = get_option('permalink_structure')
            ? user_trailingslashit(trailingslashit($url) . $wp_rewrite->pagination_base . '/' . $paged, 'paged')
            : add_query_arg('paged', $paged, $url);
    }
    return $url;
}

add_filter('document_title_parts', function ($parts) {
    if (dx_seo_plugin_managed()) return $parts;
    if (dx_seo_private_request()) {
        $parts['title'] = is_search() ? 'Search' : (is_404() ? 'Page not found' : 'Private access');
    } elseif (is_front_page()) {
        $parts['title'] = 'D’André Phillips | WordPress Developer & Designer in London';
    }
    return $parts;
});

add_action('wp', function () {
    if (!dx_seo_plugin_managed()) remove_action('wp_head', 'rel_canonical');
});

add_action('wp_head', function () {
    if (dx_seo_plugin_managed() || dx_seo_private_request() || is_feed() || is_embed()) return;
    $canonical = dx_seo_canonical();
    if (!$canonical) return;
    $description = dx_seo_description();
    $title = dx_seo_text(wp_get_document_title(), 220);
    echo '<link rel="canonical" href="' . esc_url($canonical) . '">' . "\n";
    if ($description) echo '<meta name="description" content="' . esc_attr($description) . '">' . "\n";
    $social = ['og:type' => 'website', 'og:site_name' => get_bloginfo('name'), 'og:locale' => get_locale(),
        'og:title' => $title, 'og:url' => $canonical, 'og:description' => $description];
    foreach ($social as $property => $content) {
        if ($content !== '') echo '<meta property="' . esc_attr($property) . '" content="' . esc_attr($content) . '">' . "\n";
    }
    $image = is_singular() ? get_the_post_thumbnail_url(get_queried_object_id(), 'large') : false;
    $alt = $image ? get_post_meta(get_post_thumbnail_id(get_queried_object_id()), '_wp_attachment_image_alt', true) : '';
    if ($image) {
        echo '<meta property="og:image" content="' . esc_url($image) . '">' . "\n";
        echo '<meta name="twitter:image" content="' . esc_url($image) . '">' . "\n";
        if ($alt) echo '<meta property="og:image:alt" content="' . esc_attr($alt) . '">' . "\n";
    }
    echo '<meta name="twitter:card" content="' . ($image ? 'summary_large_image' : 'summary') . '">' . "\n";
    echo '<meta name="twitter:title" content="' . esc_attr($title) . '">' . "\n";
    if ($description) echo '<meta name="twitter:description" content="' . esc_attr($description) . '">' . "\n";
    $home = home_url('/');
    $person_id = $home . '#person';
    $website_id = $home . '#website';
    $graph = [
        ['@type' => 'Person', '@id' => $person_id, 'name' => 'D’André Phillips', 'url' => home_url('/about/'),
            'jobTitle' => 'WordPress Developer and Designer', 'sameAs' => ['https://github.com/dxndre', 'https://www.linkedin.com/in/dxndre/']],
        ['@type' => 'WebSite', '@id' => $website_id, 'name' => get_bloginfo('name'), 'url' => $home,
            'publisher' => ['@id' => $person_id], 'inLanguage' => get_bloginfo('language')],
        ['@type' => 'WebPage', '@id' => $canonical . '#webpage', 'url' => $canonical, 'name' => $title,
            'description' => $description, 'isPartOf' => ['@id' => $website_id], 'inLanguage' => get_bloginfo('language')],
    ];
    if (is_singular() && !is_front_page()) {
        $crumbs = [['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $home]];
        foreach (array_reverse(get_post_ancestors(get_queried_object_id())) as $id) {
            $ancestor = get_post($id);
            if (!$ancestor || $ancestor->post_status !== 'publish' || $ancestor->post_password) continue;
            $crumbs[] = ['@type' => 'ListItem', 'position' => count($crumbs) + 1, 'name' => dx_seo_text($ancestor->post_title), 'item' => get_permalink($id)];
        }
        $crumbs[] = ['@type' => 'ListItem', 'position' => count($crumbs) + 1, 'name' => dx_seo_text(get_the_title(get_queried_object_id())), 'item' => $canonical];
        $graph[] = ['@type' => 'BreadcrumbList', '@id' => $canonical . '#breadcrumbs', 'itemListElement' => $crumbs];
        $graph[2]['breadcrumb'] = ['@id' => $canonical . '#breadcrumbs'];
    }
    if (is_singular('service')) {
        $graph[] = ['@type' => 'Service', '@id' => $canonical . '#service', 'name' => dx_seo_text(get_the_title(get_queried_object_id())),
            'url' => $canonical, 'description' => $description, 'provider' => ['@id' => $person_id]];
    }
    echo '<script type="application/ld+json">' . wp_json_encode(['@context' => 'https://schema.org', '@graph' => $graph], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP) . '</script>' . "\n";
}, 5);

function dx_seo_sitemap_exclusions() {
    static $excluded = null;
    if ($excluded !== null) return $excluded;
    $excluded = [];
    foreach (get_posts(['post_type' => 'page', 'post_status' => 'publish', 'numberposts' => -1]) as $page) {
        if (in_array($page->post_name, dx_seo_private_slugs(), true) || $page->post_password !== ''
            || in_array(get_page_template_slug($page), ['page-login.php', 'page-signup.php', 'page-forgot-password.php',
                'page-dashboard.php', 'page-client-dashboard.php', 'page-submit-ticket.php', 'page-ticket.php'], true)) {
            $excluded[] = $page->ID;
            $excluded = array_merge($excluded, get_pages(['child_of' => $page->ID, 'fields' => 'ids']));
        }
    }
    return array_unique(array_map(function ($page) { return $page instanceof WP_Post ? $page->ID : (int) $page; }, $excluded));
}

add_filter('wp_sitemaps_posts_query_args', function ($args, $post_type) {
    $args['has_password'] = false;
    if ($post_type === 'page') $args['post__not_in'] = array_values(array_unique(array_merge($args['post__not_in'] ?? [], dx_seo_sitemap_exclusions())));
    return $args;
}, 10, 2);

add_filter('wp_sitemaps_post_types', function ($types) {
    foreach (['ticket', 'dx_private_project', 'mailpoet_page'] as $type) unset($types[$type]);
    return $types;
});

// The public Person record supplies identity; a user-account archive sitemap is unnecessary.
add_filter('wp_sitemaps_add_provider', function ($provider, $name) { return $name === 'users' ? false : $provider; }, 10, 2);
