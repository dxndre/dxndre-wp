<?php
/** Search: best match, compact results and navigation shortcuts. */
get_header();
global $wp_query;
$search_term = trim(get_search_query(false));
$result_count = (int) $wp_query->found_posts;
$current_page = max(1, (int) get_query_var('paged'));
?>
<section class="dx-search" aria-labelledby="dx-search-title" data-dx-search>
  <div class="container">
    <header class="dx-search__intro">
      <p class="dx-search__eyebrow">A little of everything I do</p>
      <h1 id="dx-search-title">What brings you here?</h1>
      <form class="dx-search__form" role="search" method="get" action="<?php echo esc_url(home_url('/')); ?>">
        <label class="visually-hidden" for="dx-search-query">Search the site</label>
        <svg class="dx-search__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="1.5"/><path d="m16 16 5 5" stroke="currentColor" stroke-width="1.5"/></svg>
        <input id="dx-search-query" name="s" type="search" value="<?php echo esc_attr($search_term); ?>" placeholder="Search the site…" autocomplete="off" enterkeyhint="search">
        <button class="dx-search__clear" type="button" aria-label="Clear search" hidden><span aria-hidden="true">×</span></button>
        <button class="dx-search__submit" type="submit">Search</button>
      </form>
    </header>
    <div class="dx-search__meta">
      <p><?php if ($search_term !== '') : ?>
        <?php echo esc_html(sprintf(_n('%s result', '%s results', $result_count, 'dxndre'), number_format_i18n($result_count))); ?> for <strong>“<?php echo esc_html($search_term); ?>”</strong>
      <?php else : ?>Explore the site<?php endif; ?></p>
      <?php if ($result_count) : ?><p>Most relevant first<?php if ($current_page > 1) echo esc_html(' · Page ' . $current_page); ?></p><?php endif; ?>
    </div>
    <div class="dx-search__layout">
      <div class="dx-search__results">
        <?php if (have_posts() && $search_term !== '') : ?>
          <?php $result_index = 0; while (have_posts()) : the_post();
            $result = get_post();
            $title = get_the_title() ?: __('Untitled', 'dxndre');
            $post_type = get_post_type_object(get_post_type());
            $type_label = $post_type ? $post_type->labels->singular_name : __('Page', 'dxndre');
            $exact = strcasecmp(trim(html_entity_decode(wp_strip_all_tags($title), ENT_QUOTES, 'UTF-8')), $search_term) === 0;
            $featured = $current_page === 1 && $result_index === 0 && $exact;
            $result_index++;
          ?>
            <article class="dx-search__result<?php echo $featured ? ' dx-search__result--featured' : ''; ?>">
              <a class="dx-search__result-link" href="<?php the_permalink(); ?>" aria-labelledby="dx-search-result-<?php the_ID(); ?>">
                <?php if ($featured) : ?><p class="dx-search__eyebrow">Best match <span aria-hidden="true">·</span> <?php echo esc_html($type_label); ?></p><?php endif; ?>
                <div class="dx-search__result-copy">
                  <h2 id="dx-search-result-<?php the_ID(); ?>"><?php echo esc_html($title); ?></h2>
                  <p><?php echo esc_html(dxndre_search_summary($result)); ?></p>
                </div>
                <?php if ($featured) : ?><span class="dx-search__explore">Explore <?php echo esc_html($title); ?> <span aria-hidden="true">↗</span></span>
                <?php else : ?><span class="dx-search__type"><?php echo esc_html($type_label); ?> <span aria-hidden="true">↗</span></span><?php endif; ?>
              </a>
            </article>
          <?php endwhile; ?>
          <?php if ($wp_query->max_num_pages > 1) : ?>
            <nav class="dx-search__pagination" aria-label="Search result pages"><?php echo paginate_links([
                'current' => $current_page, 'total' => $wp_query->max_num_pages,
                'prev_text' => '← Previous', 'next_text' => 'Next →', 'type' => 'list',
            ]); ?></nav>
          <?php endif; ?>
        <?php else : ?>
          <div class="dx-search__empty">
            <h2><?php echo $search_term === '' ? 'Where would you like to go?' : 'Nothing here just yet.'; ?></h2>
            <p><?php echo $search_term === '' ? 'Search by a topic, page or interest. Try “Buses”, “About” or “WordPress”.' : 'Try a broader term, check your spelling, or head straight to one of the links alongside.'; ?></p>
            <a href="<?php echo esc_url(home_url('/contact/')); ?>">Need a hand? Get in touch <span aria-hidden="true">↗</span></a>
          </div>
        <?php endif; ?>
      </div>
      <aside class="dx-search__aside" aria-labelledby="dx-search-shortcuts">
        <h2 id="dx-search-shortcuts">Or go straight to</h2>
        <nav aria-label="Search shortcuts">
          <?php foreach (['/portfolio/' => 'Selected work', '/service/development/' => 'Development', '/about/' => 'About me', '/contact/' => 'Get in touch'] as $path => $label) : ?>
            <a href="<?php echo esc_url(home_url($path)); ?>"><?php echo esc_html($label); ?> <span aria-hidden="true">↗</span></a>
          <?php endforeach; ?>
        </nav>
        <p>Design, development<br>and life outside the screen.</p>
      </aside>
    </div>
  </div>
</section>
<?php wp_reset_postdata(); get_footer(); ?>
