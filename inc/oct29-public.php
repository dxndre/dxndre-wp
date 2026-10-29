<?php
/** Intentional starting points for the many sides of DXNDRE. */
defined('ABSPATH') || exit;
add_shortcode('dx_home_paths', function () {
    $paths = [
        'web' => ['Web & digital', 'A website that works<br>as hard as you do.', 'Custom WordPress websites, thoughtful design and practical ongoing support. Explore my work or start shaping your project.', ['Explore digital services' => '/services/#digital-services', 'See selected work' => '/portfolio/', 'Build an estimate' => '/pricing-calculator/'], '01'],
        'fitness' => ['N118 Fitness', 'Your starting point.<br>Your next chapter.', 'My training story, honest gym reviews and the next chapter: N118 Fitness coaching. Find your reason to return.', ['Explore N118 Fitness' => '/fitness/n118-fitness/', 'Read my fitness story' => '/fitness/#fitness-story', 'Explore gym reviews' => '/fitness/#gym-table'], '02'],
        'photography' => ['Photography', 'People. Places.<br>A different perspective.', 'Explore London, its buses and the moments in between, or tell me about the people, place or brand you would like photographed.', ['See the photographs' => '/photography/', 'Photography services' => '/service/photography/', 'Discuss a shoot' => '/start-a-project/?enquiry_service=photography'], '03'],
    ];
    $focus = isset($_GET['focus']) ? sanitize_key(wp_unslash($_GET['focus'])) : 'web';
    if (!isset($paths[$focus])) $focus = 'web';
    ob_start(); ?>
    <section id="start-here" class="dx-home-paths" aria-labelledby="dx-home-paths-title" data-home-paths>
        <div class="dx-home-paths__heading"><div><p class="dx-eyebrow">One person. Different perspectives.</p><h2 id="dx-home-paths-title">What brings you here?</h2></div><p>Start with what matters to you.<br>There’s more to explore along the way.</p></div>
        <nav class="dx-home-paths__choices" aria-label="Choose your starting point">
        <?php foreach ($paths as $key => $path): ?>
            <a href="<?php echo esc_url(add_query_arg('focus', $key, home_url('/')) . '#start-here'); ?>" data-home-choice="<?php echo esc_attr($key); ?>" <?php if ($key === $focus) echo 'aria-current="true"'; ?>><span><?php echo esc_html($path[4]); ?></span><strong><?php echo esc_html($path[0]); ?></strong><span aria-hidden="true">↗</span></a>
        <?php endforeach; ?></nav>
        <div class="dx-home-paths__panels">
        <?php foreach ($paths as $key => $path): ?>
            <article class="dx-home-paths__panel" data-home-panel="<?php echo esc_attr($key); ?>" <?php if ($key !== $focus) echo 'hidden'; ?> aria-label="<?php echo esc_attr($path[0]); ?>">
                <div class="dx-home-paths__art" aria-hidden="true"><span><?php echo esc_html($path[4]); ?></span><i></i><i></i><i></i></div>
                <div class="dx-home-paths__copy"><p class="dx-eyebrow"><?php echo esc_html($path[0]); ?></p><h3><?php echo wp_kses($path[1], ['br' => []]); ?></h3><p><?php echo esc_html($path[2]); ?></p><div class="dx-home-paths__actions"><?php foreach ($path[3] as $label => $url): ?><a href="<?php echo esc_url(home_url($url)); ?>"><?php echo esc_html($label); ?> <span aria-hidden="true">↗</span></a><?php endforeach; ?></div></div>
            </article>
        <?php endforeach; ?></div>
        <p class="dx-home-paths__note">Developer, photographer and fitness enthusiast. The same curiosity, in different forms.</p>
    </section>
    <?php return ob_get_clean();
});
