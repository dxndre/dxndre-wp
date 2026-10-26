<?php
/** Post-launch presentation and private administration tools. */
defined('ABSPATH') || exit;

// One lightweight transition per tab, with a shared page-animation release point.
add_action('wp_body_open', function () {
 if(is_admin())return;
 ?>
 <style>.dx-splash{position:fixed;inset:0;z-index:999999;display:grid;place-items:center;background:#000;color:#fff;pointer-events:auto;transition:transform .95s cubic-bezier(.76,0,.24,1);}.dx-splash.is-leaving{opacity:1;transform:translateY(-100%)}.dx-splash__counter{position:absolute;font:300 clamp(100px,27vw,420px)/1 Arial,sans-serif;letter-spacing:-.07em;color:transparent;-webkit-text-stroke:1px #333}.dx-splash__brand{position:relative;font:400 clamp(22px,3vw,48px)/1 Arial,sans-serif;letter-spacing:-.03em}.dx-splash-active body{overflow:hidden}.dx-splash-active body>*:not(.dx-splash),.dx-splash-active body>*:not(.dx-splash) *{animation-play-state:paused!important}@media(prefers-reduced-motion:reduce){.dx-splash{transition:none}}</style>
 <script>
 window.dxPageReady=new Promise(resolve=>{
 let seen=false;try{seen=!!sessionStorage.getItem('dx-splash-seen');sessionStorage.setItem('dx-splash-seen','1');}catch{seen=true;}
 if(seen){resolve();return;}
 document.documentElement.classList.add('dx-splash-active');
 const splash=document.createElement('div');splash.className='dx-splash';splash.setAttribute('aria-hidden','true');splash.innerHTML='<span class="dx-splash__counter">0%</span><span class="dx-splash__brand"><b>dxndre</b>.co.uk</span>';document.body.append(splash);
 const count=splash.firstChild,start=performance.now(),reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;let loaded=document.readyState==='complete',done=false;
 addEventListener('load',()=>loaded=true,{once:true});
 function finish(){if(done)return;done=true;count.textContent='100%';requestAnimationFrame(()=>{splash.classList.add('is-leaving');setTimeout(()=>{splash.remove();document.documentElement.classList.remove('dx-splash-active');resolve();},reduced?0:980);});}
 function tick(now){const elapsed=now-start;if((loaded&&elapsed>450)||elapsed>2200||reduced){finish();return;}count.textContent=Math.min(96,Math.floor(96*(1-Math.exp(-elapsed/600))))+'%';requestAnimationFrame(tick);}requestAnimationFrame(tick);
 });
 </script>
 <?php
});

// Add choices at runtime too, including installations whose ACF fields live in the database.
add_filter('acf/load_field/name=manufacturer', function ($field) {
 $field['choices']['mcv']='MCV'; $field['choices']['irizar']='Irizar'; return $field;
});

add_action('admin_menu', function () {
 add_menu_page('Generated quotations','Quotations','manage_options','dx-quotations','dx_postlaunch_quotes','dashicons-media-spreadsheet',26);
});
function dx_postlaunch_quotes() {
 if(!current_user_can('manage_options'))return;
 global $wpdb;
 $page=max(1,absint($_GET['paged']??1));$offset=($page-1)*25;
 $search=sanitize_text_field(wp_unslash($_GET['s']??''));
 $where=$search!==''?$wpdb->prepare(' WHERE invoice LIKE %s OR state LIKE %s','%'.$wpdb->esc_like($search).'%','%'.$wpdb->esc_like($search).'%'):'';
 $table=$wpdb->prefix.'dx_quotes';
 $count=(int)$wpdb->get_var("SELECT COUNT(*) FROM $table $where");
 $rows=$wpdb->get_results($wpdb->prepare("SELECT * FROM $table $where ORDER BY id DESC LIMIT %d OFFSET %d",25,$offset));
 echo '<div class="wrap"><h1>Generated quotations</h1><p>Saved estimates, including their selections and prices at the time they were generated.</p><form method="get"><input type="hidden" name="page" value="dx-quotations"><input name="s" aria-label="Search quotations" value="'.esc_attr($search).'"> <button class="button">Search</button></form><p>'.esc_html($count).' quotations</p><table class="widefat striped"><thead><tr><th>Reference</th><th>Created</th><th>Client</th><th>Total</th><th>Selections</th></tr></thead><tbody>';
 foreach($rows as $row){$state=json_decode($row->state,true)?:[];echo '<tr><td><strong>'.esc_html($row->invoice).'</strong></td><td>'.esc_html($row->created_at).'</td><td>'.esc_html(trim(($state['client_name']??'').' '.($state['client_company']??''))?:'Not supplied').'</td><td>£'.esc_html(number_format((float)$row->total,2)).(($state['service']??'')==='retainer'?' / month':'').'</td><td><details><summary>View breakdown</summary><table class="widefat">';if(function_exists('dx_estimate_breakdown_html'))echo dx_estimate_breakdown_html($state,3);echo '</table></details></td></tr>';}
 if(!$rows)echo '<tr><td colspan="5">No saved quotations found.</td></tr>';
 echo '</tbody></table><p>'.wp_kses_post(paginate_links(['base'=>add_query_arg('paged','%#%'),'format'=>'','current'=>$page,'total'=>ceil($count/25)])).'</p></div>';
}


// Repair this specific homepage illustration at render time, preserving editable blocks.
add_filter('render_block_core/image', function ($html, $block) {
 if (!is_front_page() || (int)($block['attrs']['id'] ?? 0) !== 1877) return $html;
 $image = new WP_HTML_Tag_Processor($html);
 if ($image->next_tag('IMG')) {
  $image->set_attribute('src', get_theme_file_uri('assets/img/fitness-repaired.webp'));
  $image->remove_attribute('srcset');
  $image->remove_attribute('sizes');
 }
 return $image->get_updated_html();
}, 10, 2);

// A direct visit has no challenge session; MailPoet replaces the token first on real verification visits.
add_filter('the_content',function($content){if(is_page('prove-you-are-human'))return str_replace('[mailpoet_page]','<p>Open this page from your subscription form to begin verification. <a href="'.esc_url(home_url('/n118-fitness/')).'">Return to the waitlist</a>.</p>',$content);return $content;},99);
