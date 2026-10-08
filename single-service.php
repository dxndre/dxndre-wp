<?php
/** Individual services: shared presentation, editable WordPress content. */
get_header();
while (have_posts()) :
    the_post();
    get_template_part('content', 'single-service');
    if (comments_open() || get_comments_number()) comments_template();
endwhile;
get_footer();
