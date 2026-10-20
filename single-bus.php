<?php
get_header();the_post();
$id=get_the_ID();$model=get_field('bus_model') ?: get_the_title();$gallery=get_field('bus_gallery') ?: [];
$image=get_the_post_thumbnail_url($id,'full');
if(!$image && $gallery){$first=$gallery[0];$image=is_array($first)?($first['url']??''):wp_get_attachment_image_url($first,'full');}
if(!$image){$journeys=get_posts(['post_type'=>'bus-diary-entry','post_status'=>'publish','numberposts'=>1,'meta_key'=>'bus_used','meta_value'=>$id]);if($journeys)$image=get_the_post_thumbnail_url($journeys[0]->ID,'full');}
?>
<article class="dx-bus-detail">
 <section class="dx-bus-detail-hero" aria-labelledby="bus-title">
 <?php if($image):?><img class="dx-bus-detail-image" src="<?php echo esc_url($image);?>" alt="<?php echo esc_attr($model);?>" fetchpriority="high"><?php endif;?>
 <div class="dx-bus-detail-intro"><a class="dx-bus-back" href="<?php echo esc_url(home_url('/buses/#bus-models'));?>">← All bus models</a><p class="dx-eyebrow"><?php echo esc_html(get_field('manufacturer'));?> / Bus models</p><h1 id="bus-title"><?php echo esc_html($model);?><span>.</span></h1><p class="dx-bus-summary"><?php echo esc_html(implode(' · ',array_filter([get_field('chassis'),get_field('body_type'),get_field('engine_type')])));?></p><a class="dx-bus-spec-link" href="#model-specifications">Explore the specifications ↓</a></div>
 </section>
 <?php if(trim(get_the_content())):?><section class="dx-bus-detail-overview"><p class="dx-eyebrow">A closer look</p><h2>About this model.</h2><?php the_content();?></section><?php endif;?>
 <section id="model-specifications" class="dx-bus-detail-specs"><header><p class="dx-eyebrow">Specification sheet</p><h2>Under the bodywork.</h2></header><dl>
 <?php foreach(['manufacturer'=>'Manufacturer','chassis'=>'Chassis','body_type'=>'Body type','engine_type'=>'Powertrain','capacity'=>'Capacity','top_speed'=>'Top speed','power_output'=>'Power output'] as $field=>$label):$value=get_field($field);if($value===''||$value===null||$value===false)continue;if($field==='top_speed')$value.=' mph';?><div><dt><?php echo esc_html($label);?></dt><dd><?php echo esc_html($value);?></dd></div><?php endforeach;?></dl></section>
 <section class="dx-bus-detail-specs dx-bus-record"><header><p class="dx-eyebrow">From my archive</p><h2>The recorded vehicle.</h2><p>Details of the vehicle in this archive entry.</p></header><dl><?php foreach(['operator'=>'Operator','fleet_number'=>'Fleet number','registration'=>'Registration','year'=>'Year','rarity'=>'Rarity','status'=>'Recorded status','comfort_rating'=>'Comfort rating','performance_rating'=>'Performance rating'] as $field=>$label):$value=get_field($field);if($value===''||$value===null||$value===false)continue;if(str_ends_with($field,'_rating'))$value.=' / 100';?><div><dt><?php echo esc_html($label);?></dt><dd><?php echo esc_html($value);?></dd></div><?php endforeach;?></dl></section>
 <?php if($gallery):?><section class="dx-bus-detail-gallery"><p class="dx-eyebrow">Details &amp; angles</p><h2>In the frame.</h2><div><?php foreach($gallery as $photo){$attachment=is_array($photo)?$photo['ID']:$photo;echo wp_get_attachment_image($attachment,'large',false,['loading'=>'lazy']);}?></div></section><?php endif;?>
</article>
<?php get_footer();?>
