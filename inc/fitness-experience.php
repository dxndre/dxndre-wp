<?php
/** Fitness page presentation; all editorial content remains in the page editor. */
if (!defined('ABSPATH')) { exit; }
// Presentation is bundled in assets/main.scss and assets/main.js.

/** Curated mixed-media gallery. Edit attachment IDs in the page shortcode. */
add_shortcode('dx_fitness_gallery', function($atts) {
    $atts=shortcode_atts(['ids'=>'870,876','poster'=>'870'], $atts);
    $ids=array_filter(array_map('absint', explode(',', $atts['ids'])));
    $poster=wp_get_attachment_image_url(absint($atts['poster']), 'large');
    ob_start(); ?>
    <section id="fitness-gallery" class="dxf-section"><p class="dxf-eyebrow">Training / In the frame</p><h2 class="dxf-heading">Life on the gym floor.</h2><p>Moments from training, in pictures and motion.</p><div class="dxf-media-grid">
    <?php foreach($ids as $id): $mime=get_post_mime_type($id); $video=str_starts_with((string)$mime,'video/'); if(!$video&&!wp_attachment_is_image($id))continue; $url=wp_get_attachment_url($id); $caption=wp_get_attachment_caption($id); $video_poster=get_the_post_thumbnail_url($id,'large') ?: $poster; $alt=get_post_meta($id,'_wp_attachment_image_alt',true) ?: 'Gym training'; ?>
    <figure class="dxf-media-card<?php echo $video ? ' is-video' : ''; ?>"><div class="dxf-media-frame">
    <?php if($video): ?><video controls playsinline preload="none" data-video-src="<?php echo esc_url($url); ?>" poster="<?php echo esc_url($video_poster); ?>" aria-label="<?php echo esc_attr($caption ?: 'Gym training video'); ?>"></video><span class="dxf-media-loading">Loading training video…</span><noscript><a href="<?php echo esc_url($url); ?>">Watch training video</a></noscript>
    <?php else: ?><button type="button" data-fitness-image="<?php echo esc_url($url); ?>" aria-label="Enlarge gym photograph"><?php echo wp_get_attachment_image($id,'large',false,['alt'=>$alt,'loading'=>'lazy']); ?></button><?php endif; ?>
    </div><figcaption><?php echo esc_html($caption ?: ($video ? 'Training / Watch' : 'Training / Enlarge')); ?></figcaption></figure>
    <?php endforeach; ?></div><dialog class="dxf-media-dialog" aria-label="Gym photograph"><button type="button" aria-label="Close photograph">Close ×</button><img alt=""></dialog></section>
    <?php return ob_get_clean();
});
