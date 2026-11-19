<?php
/** Password-gated employer portfolio; records are rendered only after the page gate. */
defined('ABSPATH')||exit;
add_action('init',function(){register_post_type('dx_private_project',[
 'label'=>'Private portfolio','public'=>false,'show_ui'=>true,'show_in_rest'=>false,'publicly_queryable'=>false,'exclude_from_search'=>true,'rewrite'=>false,'supports'=>['title','editor','thumbnail','excerpt'],'capability_type'=>'post','map_meta_cap'=>true,
]);});
add_action('template_redirect',function(){if(is_page('recruiter-room')){nocache_headers();header('X-Robots-Tag: noindex, nofollow, noarchive',true);}});
function dx_recruiter_projects() {
 $page = get_page_by_path('recruiter-room');
 if (!$page || !$page->post_password || post_password_required($page)) return [];
 return array_merge(get_posts(['post_type'=>'dx_private_project','post_status'=>['publish','draft','pending','private'],'numberposts'=>-1]),get_posts(['post_type'=>'project','post_status'=>['draft','pending','private'],'numberposts'=>-1]));
}
function dx_recruiter_project_anchor($project) {
 return 'private-project-' . $project->ID;
}
add_shortcode('dx_recruiter_room',function(){
 $page=get_page_by_path('recruiter-room');if(!$page)return '';
 if(!$page->post_password)return '<p>This private collection is not yet open. Please contact me for access.</p>';
 if(post_password_required($page))return get_the_password_form($page);
 $projects = dx_recruiter_projects();
 ob_start();echo '<div class="dx-private-projects" id="private-projects">';
 if(!$projects)echo '<p>Private case studies are being prepared. Please get in touch to discuss work relevant to your role.</p>';
 if ($projects) {
  echo '<nav class="dx-private-chapters" aria-labelledby="dx-private-chapters-title"><p class="dx-private-chapters-title" id="dx-private-chapters-title">Private projects</p>';
  foreach ($projects as $index => $project) {
   printf('<a href="#%s"><span aria-hidden="true">%02d</span> %s</a>', esc_attr(dx_recruiter_project_anchor($project)), $index + 1, esc_html(get_the_title($project)));
  }
  echo '</nav>';
 }
 foreach($projects as $project){echo '<article class="dx-private-project" id="'.esc_attr(dx_recruiter_project_anchor($project)).'"><p class="dx-eyebrow">Private portfolio</p><h2>'.esc_html($project->post_title).'</h2>'.wpautop(do_shortcode($project->post_content)).'</article>';}
 echo '</div>';return ob_get_clean();
});

add_filter('the_password_form', function ($form, $post, $invalid_password = '') {
 if (!$post || $post->post_name !== 'recruiter-room') return $form;
 $field_id = 'dx-recruiter-password-' . $post->ID;
 $help_id = $field_id . '-help';
 $error_id = $field_id . '-error';
 $description = $help_id . ($invalid_password ? ' ' . $error_id : '');
 ob_start();
 ?>
 <section class="dx-private-gate" aria-labelledby="dx-private-gate-title">
  <div class="dx-private-gate__art" aria-hidden="true">
   <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/sideshot3-illustrated.webp'); ?>" alt="" width="941" height="1672" fetchpriority="high" decoding="async">
  </div>
  <div class="dx-private-gate__inner">
   <div class="dx-private-gate__copy">
    <p class="dx-eyebrow">Recruiters &amp; hiring managers</p>
    <h1 id="dx-private-gate-title">A closer<br>look<span>.</span></h1>
    <p class="dx-private-gate__intro">The thinking behind the work. The potential beyond it.</p>
    <p id="<?php echo esc_attr($help_id); ?>" class="dx-private-gate__help">Explore selected projects, private case studies and work in progress. Enter the access password I shared with you.</p>
    <form action="<?php echo esc_url(site_url('wp-login.php?action=postpass', 'login_post')); ?>" class="post-password-form dx-private-gate__form" method="post">
     <input type="hidden" name="redirect_to" value="<?php echo esc_url(home_url('/recruiter-room/')); ?>">
     <label for="<?php echo esc_attr($field_id); ?>">Access password</label>
     <?php if ($invalid_password) : ?>
      <p id="<?php echo esc_attr($error_id); ?>" class="dx-private-gate__error" role="alert"><?php echo esc_html($invalid_password); ?> Please try again or get in touch for access.</p>
     <?php endif; ?>
     <input type="password" name="post_password" id="<?php echo esc_attr($field_id); ?>" autocomplete="current-password" maxlength="255" spellcheck="false" required aria-describedby="<?php echo esc_attr($description); ?>"<?php if ($invalid_password) echo ' aria-invalid="true"'; ?> placeholder="Enter your access password">
     <button type="submit" class="dx-cta dx-private-gate__submit">Explore private portfolio <span aria-hidden="true">↗</span></button>
    </form>
    <p class="dx-private-gate__contact">Need access? <a href="<?php echo esc_url(home_url('/contact/')); ?>">Start a conversation <span aria-hidden="true">↗</span></a></p>
    <p class="dx-private-gate__note"><span aria-hidden="true"></span>Shared privately. Open to the right role.</p>
   </div>
  </div>
 </section>
 <?php
 return preg_replace('/>\s+</', '><', trim(ob_get_clean()));
}, 20, 3);

function dx_recruiter_edition(){
 $room=get_page_by_path('recruiter-room');
 return is_page('portfolio') && isset($_GET['edition']) && $_GET['edition']==='recruiter' && $room && $room->post_password && !post_password_required($room);
}
add_action('template_redirect',function(){
 if(is_page('portfolio')&&isset($_GET['edition'])&&$_GET['edition']==='recruiter'){
  nocache_headers();header('X-Robots-Tag: noindex, nofollow, noarchive',true);
  if(!dx_recruiter_edition()){wp_safe_redirect(home_url('/recruiter-room/'));exit;}
 }
 if(is_page('recruiter-room')){$room=get_queried_object();if($room->post_password&&!post_password_required($room)){wp_safe_redirect(home_url('/portfolio/?edition=recruiter&welcome=1'));exit;}}
});
add_action('wp_body_open', function () {
 if (!dx_recruiter_edition() || ($_GET['welcome'] ?? '') !== '1') return;
 echo '<div class="dx-recruiter-welcome" aria-hidden="true" hidden><span>Recruiter mode</span><span>Private portfolio</span></div>';
});
add_filter('body_class',function($c){if(dx_recruiter_edition())$c[]='dx-recruiter-edition';if(is_page('recruiter-room'))$c[]='dx-recruiter-room';return $c;});
add_filter('the_content',function($content){
 if(!dx_recruiter_edition()||!is_main_query()||!in_the_loop())return $content;
 $content=str_replace('<h1>PORTFOLIO.</h1>','<h1>PORTFOLIO.</h1><p class="dx-eyebrow dx-edition-label">RECRUITER / HIRING MANAGER EDITION</p>',$content);
 $intro='<section class="dx-recruiter-intro"><p class="dx-eyebrow">For your consideration</p><h2>The full picture.</h2><p>Alongside my public work, this private collection gives recruiters and hiring managers a closer look at my potential — including unpublished explorations and projects that have paused along the way.</p><p>Please keep this work within the hiring process. Sharing relevant examples with a lead developer for a code review or another colleague involved in the hiring decision is welcome; wider circulation or publication is not.</p><a class="dx-cta dx-cta--outline" href="#private-projects">Explore private projects <span aria-hidden="true">↓</span></a></section>';
 $content=str_replace('<div class="wp-block-group portfolio-work"',$intro.do_shortcode('[dx_recruiter_room]').'<div class="wp-block-group portfolio-work"',$content);
 return $content.'<section class="dx-recruiter-cv"><p class="dx-eyebrow">Experience / Skills / Perspective</p><h2>My CV.</h2><p>A closer look at the experience behind the work.</p><a class="dx-cta" href="'.esc_url(home_url('/cv/')).'">Explore my CV ↗</a></section>';
},20);

add_filter('the_content', function ($content) {
 if (!is_page('portfolio') || !is_main_query() || !in_the_loop() || dx_recruiter_edition()) return $content;
 $cta = '<a class="dx-cta" href="#projects">Explore my work ↓</a>';
 $recruiter = '<a class="dx-cta dx-cta--outline" href="' . esc_url(home_url('/recruiter-room/')) . '" data-bs-toggle="modal" data-bs-target="#recruiterAccessModal" aria-haspopup="dialog">Recruiter?</a>';
 return str_replace($cta, '<div class="dx-portfolio-hero-actions">' . $cta . $recruiter . '</div>', $content);
}, 21);

add_action('wp_footer', function () {
 if (is_page('portfolio') && !dx_recruiter_edition()) get_template_part('partials/recruiter-access-modal');
});
