<?php
/** Editorial portfolio with an editor-selected lead project and the existing archive hooks. */
add_action('add_meta_boxes_page', function ($post) {
    if ($post->post_name !== 'portfolio') return;
    add_meta_box('dxndre-featured-project', 'Portfolio featured project', function ($page) {
        wp_nonce_field('dxndre_featured_project', 'dxndre_featured_project_nonce');
        $selected = (int) get_post_meta($page->ID, '_dxndre_featured_project', true);
        echo '<p>Choose the project that leads the portfolio page.</p><select name="dxndre_featured_project" style="width:100%"><option value="0">Default: Ohme</option>';
        foreach (get_posts(['post_type'=>'project','post_status'=>'publish','numberposts'=>-1,'orderby'=>'title','order'=>'ASC']) as $project) {
            echo '<option value="' . esc_attr($project->ID) . '" ' . selected($selected, $project->ID, false) . '>' . esc_html($project->post_title) . '</option>';
        }
        echo '</select>';
    }, 'page', 'side');
});
add_action('save_post_page', function ($id) {
    if (!isset($_POST['dxndre_featured_project_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['dxndre_featured_project_nonce'])), 'dxndre_featured_project')) return;
    if (wp_is_post_autosave($id) || wp_is_post_revision($id) || !current_user_can('edit_post', $id)) return;
    $project_id = absint($_POST['dxndre_featured_project'] ?? 0);
    if ($project_id && (get_post_type($project_id) !== 'project' || get_post_status($project_id) !== 'publish')) return;
    update_post_meta($id, '_dxndre_featured_project', $project_id);
});
function dxndre_portfolio_project_data($project) {
    $id = $project->ID;
    $field = function ($name) use ($id) { return function_exists('get_field') ? get_field($name, $id) : get_post_meta($id, $name, true); };
    $client = $field('client_type') ?: 'freelance';
    $employer = $field('employer');
    return [
        'title' => $field('project_name_override') ?: get_the_title($id),
        'excerpt' => wp_strip_all_tags(get_the_excerpt($project)),
        'year' => get_the_date('Y', $id),
        'context' => $client,
        'context_label' => $client === 'commercial' && $employer ? 'Commercial — ' . $employer : ucfirst($client),
        'types' => array_values((array) ($field('project_type') ?: [])),
        'status' => $field('site_status'),
        'hover' => $field('header_image'),
    ];
}
function dxndre_portfolio_image($project, $data, $size, $class, $eager = false) {
    $image_id = is_array($data['hover']) ? ($data['hover']['ID'] ?? 0) : (int) $data['hover'];
    $attributes = ['class'=>$class,'loading'=>$eager ? 'eager' : 'lazy'];
    if ($image_id) return wp_get_attachment_image($image_id, $size, false, $attributes);
    return get_the_post_thumbnail($project, $size, $attributes);
}
function dxndre_editorial_projects_archive($atts = []) {
    $projects = get_posts(['post_type'=>'project','post_status'=>'publish','numberposts'=>-1,'orderby'=>'date','order'=>'DESC']);
    if (!$projects) return '<p>No projects found.</p>';
    $featured_id = (int) get_post_meta(get_queried_object_id(), '_dxndre_featured_project', true);
    $featured = $featured_id ? get_post($featured_id) : get_page_by_path('ohme-ev', OBJECT, 'project');
    if (!$featured || $featured->post_type !== 'project' || $featured->post_status !== 'publish') $featured = $projects[0];
    $lead = dxndre_portfolio_project_data($featured);
    ob_start(); ?>
    <div class="portfolio-editorial">
      <div class="portfolio-feature" aria-labelledby="portfolio-feature-title">
        <p class="portfolio-eyebrow">Featured project / 01</p>
        <div class="portfolio-feature-grid">
          <a class="portfolio-feature-image" href="<?php echo esc_url(get_permalink($featured)); ?>" aria-label="<?php echo esc_attr('View ' . $lead['title'] . ' case study'); ?>"><?php echo dxndre_portfolio_image($featured, $lead, 'full', 'portfolio-feature-photo', true); ?></a>
          <div class="portfolio-feature-copy">
            <h2 id="portfolio-feature-title"><?php echo esc_html($lead['title']); ?></h2>
            <p class="portfolio-eyebrow"><?php echo esc_html($lead['year'] . ' / ' . $lead['context_label']); ?></p>
            <p><?php echo esc_html($lead['excerpt']); ?></p>
            <a class="portfolio-outline-link" href="<?php echo esc_url(get_permalink($featured)); ?>">Explore the case study <span aria-hidden="true">↗</span></a>
            <ul class="project-types"><?php foreach ($lead['types'] as $type) : ?><li><?php echo esc_html($type); ?></li><?php endforeach; ?></ul>
          </div>
        </div>
      </div>
      <div class="portfolio-archive" data-projects-archive>
        <div class="portfolio-archive-heading"><h2>Explore the work</h2><p class="portfolio-eyebrow" role="status" aria-live="polite" aria-atomic="true"><span data-projects-count><?php echo count($projects); ?></span> <span data-projects-count-label>projects</span></p></div>
        <div class="filter-inputs">
          <div class="project-search"><span aria-hidden="true">⌕</span><input id="search-box" type="search" placeholder="Search projects…" aria-label="Search projects" data-project-search></div>
          <div class="project-filter-buttons" role="group" aria-label="Filter projects">
            <?php foreach (['all'=>'All','design'=>'Design','development'=>'WordPress','static'=>'Static','shopify'=>'Shopify','freelance'=>'Freelance','commercial'=>'Commercial'] as $value=>$label) : ?>
              <button type="button" <?php echo in_array($value, ['freelance','commercial'], true) ? 'data-context' : 'data-filter'; ?>="<?php echo esc_attr($value); ?>" aria-pressed="<?php echo $value === 'all' ? 'true' : 'false'; ?>" <?php if ($value === 'all') echo 'class="is-active"'; ?>><?php echo esc_html($label); ?></button>
            <?php endforeach; ?>
          </div>
        </div>
        <p class="projects-state-title">Showing <span data-projects-state-title>All</span> projects</p>
        <div class="projects-empty-state" hidden data-projects-empty><h3>No projects found</h3><p>Try adjusting your filters or search terms.</p></div>
        <ul class="projects-grid" data-projects-grid>
        <?php foreach ($projects as $project) : $d = dxndre_portfolio_project_data($project);
          $search = $d['title'] . ' ' . $d['excerpt'] . ' ' . implode(' ', $d['types']) . ' ' . $d['context_label'] . ' ' . $d['year']; ?>
          <li class="project-card" data-type="<?php echo esc_attr(implode(' ', array_map('sanitize_title', $d['types']))); ?>" data-year="<?php echo esc_attr($d['year']); ?>" data-context="<?php echo esc_attr($d['context']); ?>" data-search="<?php echo esc_attr($search); ?>">
            <a href="<?php echo esc_url(get_permalink($project)); ?>" class="project-thumb" aria-label="<?php echo esc_attr('View ' . $d['title'] . ' case study'); ?>">
              <?php echo dxndre_portfolio_image($project, $d, 'large', 'project-image project-image--default'); ?>
            </a>
            <h3 class="project-title"><a href="<?php echo esc_url(get_permalink($project)); ?>"><?php echo esc_html($d['title']); ?></a></h3>
            <div class="project-meta"><span><?php echo esc_html($d['year']); ?></span><span aria-hidden="true">/</span><span><?php echo esc_html($d['context_label']); ?></span><?php if ($d['status']) : ?><span aria-hidden="true">/</span><span><?php echo esc_html(ucwords(str_replace('_', ' ', $d['status']))); ?></span><?php endif; ?></div>
            <div class="project-card-footer"><ul class="project-types"><?php foreach ($d['types'] as $type) : ?><li><?php echo esc_html($type); ?></li><?php endforeach; ?></ul><a class="project-cta" href="<?php echo esc_url(get_permalink($project)); ?>">View case study <span aria-hidden="true">↗</span></a></div>
          </li>
        <?php endforeach; ?>
        </ul>
      </div>
    </div>
    <?php return ob_get_clean();
}
