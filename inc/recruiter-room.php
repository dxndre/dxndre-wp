<?php
/** Password-gated employer portfolio; records are rendered only after the page gate. */
defined('ABSPATH')||exit;
add_action('init',function(){register_post_type('dx_private_project',[
 'label'=>'Private portfolio','public'=>false,'show_ui'=>true,'show_in_rest'=>false,'publicly_queryable'=>false,'exclude_from_search'=>true,'rewrite'=>false,'supports'=>['title','editor','thumbnail','excerpt'],'capability_type'=>'post','map_meta_cap'=>true,
]);});
add_action('template_redirect',function(){if(is_page('recruiter-room')){nocache_headers();header('X-Robots-Tag: noindex, nofollow, noarchive',true);}});
add_shortcode('dx_recruiter_room',function(){
 $page=get_page_by_path('recruiter-room');if(!$page)return '';
 if(!$page->post_password)return '<p>This private collection is not yet open. Please contact me for access.</p>';
 if(post_password_required($page))return get_the_password_form($page);
 $projects=array_merge(get_posts(['post_type'=>'dx_private_project','post_status'=>['publish','draft','pending','private'],'numberposts'=>-1]),get_posts(['post_type'=>'project','post_status'=>['draft','pending','private'],'numberposts'=>-1]));
 ob_start();echo '<div class="dx-private-projects">';
 if(!$projects)echo '<p>Private case studies are being prepared. Please get in touch to discuss work relevant to your role.</p>';
 foreach($projects as $project){echo '<article class="dx-private-project"><p class="dx-eyebrow">Private portfolio</p><h2>'.esc_html($project->post_title).'</h2>'.wpautop(do_shortcode($project->post_content)).'</article>';}
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
 if(is_page('recruiter-room')){$room=get_queried_object();if($room->post_password&&!post_password_required($room)){wp_safe_redirect(home_url('/portfolio/?edition=recruiter'));exit;}}
});
add_filter('body_class',function($c){if(dx_recruiter_edition())$c[]='dx-recruiter-edition';if(is_page('recruiter-room'))$c[]='dx-recruiter-room';return $c;});
add_filter('the_content',function($content){
 if(!dx_recruiter_edition()||!is_main_query()||!in_the_loop())return $content;
 $content=str_replace('<h1>PORTFOLIO.</h1>','<h1>PORTFOLIO.</h1><p class="dx-eyebrow dx-edition-label">RECRUITER / HIRING MANAGER EDITION</p>',$content);
 $intro='<section class="dx-recruiter-intro"><p class="dx-eyebrow">For your consideration</p><h2>The full picture.</h2><p>Alongside my public work, this private collection gives recruiters and hiring managers a closer look at my potential — including unpublished explorations and projects that have paused along the way.</p><p>Please keep this work within the hiring process. Sharing relevant examples with a lead developer for a code review or another colleague involved in the hiring decision is welcome; wider circulation or publication is not.</p></section>';
 $content=str_replace('<div class="wp-block-group portfolio-work"',$intro.'<div class="wp-block-group portfolio-work"',$content);
 return $content.do_shortcode('[dx_recruiter_room]').'<section class="dx-recruiter-cv"><p class="dx-eyebrow">Experience / Skills / Perspective</p><h2>My CV.</h2><p>A closer look at the experience behind the work.</p><a class="dx-cta" href="'.esc_url(home_url('/cv/')).'">Explore my CV ↗</a></section>';
},20);
