<?php
/** Shared editorial sign-off for the Photography archive and service page. */
defined('ABSPATH') || exit;

function dx_render_photography_outro() {
    static $rendered = false;
    $is_photography_service = is_singular('service') && get_post_field('post_name', get_queried_object_id()) === 'photography';
    if ($rendered || (!is_page('photography') && !$is_photography_service) || post_password_required()) {
        return;
    }
    $rendered = true;
    ?>
    <nav class="dx-photography-outro" aria-label="Photography page">
        <p>Observe. Capture. Remember.</p>
        <a href="#main">Back to the top <span aria-hidden="true">↗</span></a>
    </nav>
    <?php
}
