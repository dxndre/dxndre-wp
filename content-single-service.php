<?php
/** Shared service detail shell. The main sections remain editable post content. */
$slug = get_post_field('post_name', get_the_ID());
$is_fixes = $slug === 'one-time-fixes';
$facts = [
    'one-time-fixes' => ['Targeted technical support', 'Targeted improvements', 'Existing websites', 'One-off engagement', 'Share your issue'],
    'retainer' => ['Ongoing website support', 'Continuous improvements', 'Existing websites', 'Ongoing engagement', 'Discuss your needs'],
    'design' => ['Considered digital design', 'Interface design', 'New & existing websites', 'Design engagement', 'Share your brief'],
    'development' => ['Development beyond WordPress', 'Custom websites & tools', 'New & existing websites', 'Build engagement', 'Share your brief'],
    'wordpress-development' => ['Custom WordPress development', 'Flexible content systems', 'WordPress websites', 'Build engagement', 'Share your brief'],
    'comprehensive' => ['From first idea to launch', 'Design & development', 'New & existing websites', 'End-to-end engagement', 'Discuss your project'],
];
$details = $facts[$slug] ?? ['Digital services', 'Your project goals', 'Your website', 'Tailored engagement', 'Share your brief'];
?>
<article id="post-<?php the_ID(); ?>" <?php post_class(['service-detail', 'service-detail--' . sanitize_html_class($slug)]); ?>>
  <header class="service-detail-hero">
    <?php if (has_post_thumbnail()) : ?>
      <div class="service-detail-art" aria-hidden="true"><?php echo get_the_post_thumbnail(get_the_ID(), 'full', ['alt' => '', 'fetchpriority' => 'high', 'loading' => 'eager']); ?></div>
    <?php endif; ?>
    <div class="service-detail-container service-detail-hero-content">
      <a class="service-back" href="<?php echo esc_url(home_url('/services/')); ?>"><span aria-hidden="true">←</span> All services</a>
      <p class="service-eyebrow"><?php echo esc_html($details[0]); ?></p>
      <h1><?php if ($is_fixes) : ?>One-Time<br>Fixes<?php elseif ($slug === 'wordpress-development') : ?>WordPress<br>Development<?php elseif ($slug === 'development') : ?>Custom Web<br>Development<?php else : the_title(); endif; ?><span aria-hidden="true">.</span></h1>
      <?php if ($is_fixes) : ?>
        <p class="service-lead">Focused fixes for the issues holding your website back.</p>
        <p class="service-hero-description">From broken functionality to slow pages, get a clear path to a working website.</p>
      <?php elseif (has_excerpt()) : ?>
        <p class="service-lead"><?php echo esc_html(get_the_excerpt()); ?></p>
      <?php endif; ?>
      <div class="service-detail-actions">
        <a class="service-outline-button" href="#service-enquiry"><?php echo $is_fixes ? 'Tell me about the issue' : 'Tell me about your project'; ?> <span aria-hidden="true">↗</span></a>
        <a class="service-text-link" href="#service-content">Explore what’s covered <span aria-hidden="true">↓</span></a>
      </div>
    </div>
  </header>
  <div class="service-detail-facts"><dl class="service-detail-container">
    <?php foreach (['Focus', 'Project type', 'Support', 'Next step'] as $index => $label) : ?>
      <div><dt><?php echo esc_html($label); ?></dt><dd><?php echo esc_html($details[$index + 1]); ?></dd></div>
    <?php endforeach; ?>
  </dl></div>
  <div id="service-content" class="service-detail-body">
    <?php the_content(); wp_link_pages(['before' => '<nav class="service-detail-container">', 'after' => '</nav>']); ?>
  </div>
  <section id="service-enquiry" class="service-detail-enquiry service-detail-container" aria-labelledby="service-enquiry-title">
    <div><p class="service-eyebrow"><?php echo $is_fixes ? 'Start with the problem' : 'Let’s work together'; ?></p>
      <h2 id="service-enquiry-title"><?php echo $is_fixes ? 'Let’s get it<br>working.' : 'Let’s build<br>something meaningful.'; ?></h2>
      <p><?php echo $is_fixes ? 'Tell me what’s happening and I’ll help you find the next step.' : 'Share your brief and we can discuss the next step.'; ?></p>
      <p class="service-form-hint">Include your website URL and any useful details in your message.</p>
    </div>
    <div class="service-detail-form">
      <?php
      if (shortcode_exists('fluentform')) {
          // Reuse the existing form and its delivery, validation and spam protection.
          $form = do_shortcode('[fluentform id="3"]');
          $form = str_replace('https://jarvisbrownassociates.co.uk/privacy-policy/', esc_url(home_url('/privacy-policy/')), $form);
          echo $form; // Trusted output from the installed form plugin.
      } else {
          echo '<a class="service-outline-button" href="' . esc_url(home_url('/contact/')) . '">Send an enquiry <span aria-hidden="true">↗</span></a>';
      }
      ?>
    </div>
  </section>
  <?php
  $related = get_posts(['post_type' => 'service', 'post_status' => 'publish', 'numberposts' => 2, 'post__not_in' => [get_the_ID()], 'orderby' => 'menu_order title', 'order' => 'ASC']);
  if ($is_fixes) {
      $preferred = [];
      foreach (['retainer', 'wordpress-development'] as $related_slug) {
          $related_post = get_page_by_path($related_slug, OBJECT, 'service');
          if ($related_post && $related_post->post_status === 'publish') $preferred[] = $related_post;
      }
      if ($preferred) $related = $preferred;
  }
  if ($related) : ?>
    <nav class="service-detail-related service-detail-container" aria-label="Related services">
      <p class="service-eyebrow">Other ways to work together</p><div class="service-related-grid">
      <?php foreach ($related as $service) : ?>
        <a href="<?php echo esc_url(get_permalink($service)); ?>"><h3><?php echo esc_html(get_the_title($service)); ?></h3><p><?php echo esc_html(wp_trim_words(get_the_excerpt($service), 15)); ?></p><span aria-hidden="true">↗</span></a>
      <?php endforeach; ?>
      </div>
    </nav>
  <?php endif; ?>
  <?php edit_post_link('Edit service', '<div class="service-detail-container">', '</div>'); ?>
</article>
