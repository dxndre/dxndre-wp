<?php
get_header();
while (have_posts()) : the_post();
	$data=dxj_data(get_the_ID()); $route=$data['route']; $hero=get_post_thumbnail_id();
	$origin=get_post_meta(get_the_ID(),'journey_start_name',true);$destination=get_post_meta(get_the_ID(),'journey_end_name',true);
	$operator=get_post_meta(get_the_ID(),'operator',true);$operator_labels=array('metroline'=>'Metroline','go-ahead'=>'Go-Ahead London','transport-uk'=>'Transport UK','arriva'=>'Arriva London','stagecoach'=>'Stagecoach','first'=>'First Bus','uno'=>'Uno');
	$operator=$operator_labels[$operator]??$operator;
	?>
	<article class="dx-journey" data-dx-journey data-route-type="<?php echo preg_match('/^N\d+/',$route)?'night':'day'; ?>">
		<script type="application/json" data-dxj-data><?php echo wp_json_encode($data,JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT); ?></script>
		<header class="dxj-hero">
			<?php if($hero)echo wp_get_attachment_image($hero,'full',false,array('class'=>'dxj-hero-image','loading'=>'eager','fetchpriority'=>'high')); ?>
			<div class="dxj-hero-copy container">
				<p class="dxj-eyebrow">DX. Buses <span>/ Bus Diary</span></p>
				<h1><?php if($route): ?>Route <strong><?php echo esc_html($route); ?></strong><?php else: the_title(); endif; ?></h1>
				<?php if($route): ?><p class="dxj-entry-title"><?php the_title(); ?></p><?php endif; ?>
				<?php if(has_excerpt()): ?><p class="dxj-hero-intro"><?php echo esc_html(get_the_excerpt()); ?></p><?php endif; ?>
				<div class="dxj-hero-actions"><a class="dxj-button" href="#journey-experience" data-dxj-begin>Begin the Journey <span aria-hidden="true">→︎</span></a><a class="dxj-button dxj-button-outline" href="#journey-experience" data-dxj-explore>Explore the Route <span aria-hidden="true">↗︎</span></a><?php $soundtrack=get_post_meta(get_the_ID(),'spotify_url',true);if($soundtrack): ?><a class="dxj-button dxj-button-outline" href="<?php echo esc_url($soundtrack); ?>" target="_blank" rel="noopener noreferrer">Open soundtrack</a><?php endif; ?></div>
				<svg class="dxj-route-preview" viewBox="0 0 400 80" aria-hidden="true"><path data-dxj-route-preview/></svg>
			</div>
			<div class="dxj-facts container">
				<?php if($origin||$destination): ?><span><?php echo esc_html(trim($origin.' → '.$destination)); ?></span><?php endif; ?>
				<?php if($operator): ?><span><?php echo esc_html($operator); ?></span><?php endif; ?>
				<span><?php echo esc_html(get_the_date('F Y')); ?></span><?php foreach(array('time_of_day','mood_label') as $key):$value=get_post_meta(get_the_ID(),$key,true);if($value):?><span><?php echo esc_html($value); ?></span><?php endif;endforeach;?><span data-dxj-route-facts hidden></span>
				<span><?php echo esc_html(count($data['chapters'])); ?> chapters</span><?php $bus_id=absint(get_post_meta(get_the_ID(),'bus_used',true));if($bus_id && get_post_status($bus_id)==='publish'):?><a href="<?php echo esc_url(get_permalink($bus_id)); ?>"><?php echo esc_html(get_the_title($bus_id)); ?></a><?php endif;?>
			</div>
		</header>
		<section class="dxj-experience" id="journey-experience" aria-label="Interactive journey and chapters">
			<div class="dxj-stage">
				<div class="dxj-map" data-dxj-map role="region" aria-label="<?php echo esc_attr('Route '.$route.' journey map'); ?>"><p class="dxj-map-status" role="status">Preparing the route. The complete story is available below.</p></div>
				<div class="dxj-passenger" aria-hidden="true"><img alt="" data-dxj-passenger-image><div><p class="dxj-eyebrow">Passenger Perspective</p><p data-dxj-passenger-caption></p><button type="button" class="dxj-button" data-dxj-return-map>Return to Map</button></div></div>
				<div class="dxj-map-toolbar" hidden data-dxj-enhancement>
					<div class="dxj-mode-switch" role="group" aria-label="Journey mode"><button type="button" data-dxj-mode="guided" aria-pressed="true">Guided Story</button><button type="button" data-dxj-mode="explore" aria-pressed="false">Explore Freely</button></div>
					<div><button type="button" data-dxj-overview>Whole route</button><button type="button" data-dxj-buses aria-pressed="false">Show buses</button><button type="button" data-dxj-present aria-pressed="false">Presentation</button><button type="button" data-dxj-fullscreen aria-label="Full screen journey"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></svg></button></div>
				</div>
				<div class="dxj-location-sheet" hidden data-dxj-location role="region" aria-label="Selected location"></div>
				<div class="dxj-playback" hidden data-dxj-enhancement>
					<div class="dxj-playback-buttons"><button type="button" data-dxj-prev aria-label="Previous chapter">←︎</button><button type="button" data-dxj-play aria-pressed="false">Play journey</button><button type="button" data-dxj-next aria-label="Next chapter">→︎</button></div>
					<div class="dxj-route-diagram" role="group" aria-label="Narrative journey locations"><?php foreach($data['chapters'] as $index=>$chapter): if(!$chapter['diagram'])continue; ?><button type="button" data-dxj-go="<?php echo esc_attr($index); ?>" aria-label="<?php echo esc_attr('Chapter '.($index+1).': '.$chapter['title']); ?>"><span><?php echo esc_html($index+1); ?></span></button><?php endforeach; ?></div>
					<span class="dxj-counter" data-dxj-counter>01 / <?php echo esc_html(str_pad(count($data['chapters']),2,'0',STR_PAD_LEFT)); ?></span>
					<button type="button" data-dxj-follow aria-pressed="false">Follow camera</button><button type="button" data-dxj-restart>Restart</button><button type="button" data-dxj-exit-play hidden>Exit playback</button>
				</div>
				<nav class="dxj-filmstrip" aria-label="Journey chapters">
				<?php foreach($data['chapters'] as $index=>$chapter): ?>
					<a href="#<?php echo esc_attr($chapter['id']); ?>" data-dxj-go="<?php echo esc_attr($index); ?>"><?php if($chapter['image'])echo wp_get_attachment_image($chapter['image']['id'],'medium',false,array('loading'=>'lazy')); ?><span><small><?php echo esc_html(str_pad($index+1,2,'0',STR_PAD_LEFT)); ?></small><?php echo esc_html($chapter['title']); ?></span></a>
				<?php endforeach; ?>
				</nav>
				<button type="button" class="dxj-exit-presentation" data-dxj-exit-present hidden>Exit presentation <span>Esc</span></button>
			</div>
			<div class="dxj-chapters">
			<?php foreach($data['chapters'] as $index=>$chapter): ?>
				<section class="dxj-step" id="<?php echo esc_attr($chapter['id']); ?>" data-dxj-step="<?php echo esc_attr($index); ?>" data-chapter-type="<?php echo esc_attr($chapter['type']); ?>" data-placement="<?php echo esc_attr($chapter['placement']); ?>">
					<div class="dxj-panel">
						<p class="dxj-eyebrow">Chapter <?php echo esc_html(str_pad($index+1,2,'0',STR_PAD_LEFT)); ?> / <?php echo esc_html(str_pad(count($data['chapters']),2,'0',STR_PAD_LEFT)); ?></p>
						<h2><?php echo esc_html($chapter['title']); ?></h2>
						<?php if($chapter['location']): ?><p class="dxj-location-name"><?php echo esc_html($chapter['location']); ?></p><?php endif; ?>
						<p class="dxj-intro"><?php echo esc_html($chapter['intro']); ?></p>
						<details class="dxj-longform"><summary>Read the chapter</summary><div><?php echo do_shortcode($chapter['body']); ?></div></details>
						<?php if($chapter['quote']): ?><blockquote><?php echo esc_html($chapter['quote']); ?></blockquote><?php endif; ?>
						<?php $images=array_merge($chapter['image']?array($chapter['image']):array(),$chapter['gallery']); if($images): ?><div class="dxj-gallery" aria-label="Chapter photographs"><?php foreach($images as $photo): ?><a href="<?php echo esc_url($photo['full']); ?>" data-dxj-photo data-photo-id="<?php echo esc_attr($photo['id']); ?>"><?php echo wp_get_attachment_image($photo['id'],'medium',false,array('loading'=>'lazy')); ?></a><?php endforeach; ?></div><?php endif; ?>
						<?php if($chapter['video']): ?><div class="dxj-video"><?php if(preg_match('/\.(mp4|webm|og[gv])$/i',(string)wp_parse_url($chapter['video'],PHP_URL_PATH))): ?><video controls preload="none" src="<?php echo esc_url($chapter['video']); ?>" aria-label="<?php echo esc_attr($chapter['title'].' video'); ?>"></video><?php else: ?><a href="<?php echo esc_url($chapter['video']); ?>" target="_blank" rel="noopener noreferrer">Watch the attached video ↗︎</a><?php endif; ?></div><?php endif; ?>
						<div class="dxj-chapter-actions" hidden data-dxj-enhancement><button type="button" data-dxj-share="<?php echo esc_attr($index); ?>">Share this moment</button><?php if($chapter['image']): ?><button type="button" data-dxj-perspective="<?php echo esc_attr($index); ?>">View photograph</button><?php endif; ?></div>
					</div>
				</section>
			<?php endforeach; ?>
			</div>
		</section>
		<section class="dxj-memories container" id="journey-memories">
			<p class="dxj-eyebrow">Journey Memories</p><h2>Every route has a story.</h2><p><?php echo esc_html($origin); ?><?php if($origin&&$destination): ?> <span aria-hidden="true">→︎</span> <?php endif; ?><?php echo esc_html($destination); ?></p>
			<div class="dxj-recap"><svg viewBox="0 0 600 200" role="img" aria-label="Simplified route geometry"><path data-dxj-recap-path/></svg><div><p><?php echo esc_html(count($data['chapters'])); ?> narrative chapters</p><p data-dxj-recap-status>Explore the chapters to build your own journey recap.</p><p data-dxj-recap-distance></p></div></div>
			<div class="dxj-memory-spread"><div class="dxj-contact-sheet"><?php foreach($data['chapters'] as $index=>$chapter): if(!$chapter['recap']||!$chapter['image'])continue; ?><a href="#<?php echo esc_attr($chapter['id']); ?>" data-dxj-go="<?php echo esc_attr($index); ?>"><?php echo wp_get_attachment_image($chapter['image']['id'],'large',false,array('loading'=>'lazy')); ?><span><?php echo esc_html(($index+1).' / '.$chapter['title']); ?></span></a><?php endforeach; ?></div>
			<?php $closing_quote="";foreach($data['chapters'] as $moment){if($moment['quote'])$closing_quote=$moment['quote'];}if($closing_quote):?><blockquote class="dxj-closing-quote"><?php echo esc_html($closing_quote); ?></blockquote><?php endif;?></div><div class="dxj-memory-actions"><button type="button" class="dxj-button" data-dxj-restart hidden data-dxj-enhancement>Replay the journey</button><a class="dxj-button dxj-button-outline" href="#journey-experience" data-dxj-explore>Explore freely</a><?php foreach($data['routes'] as $item): ?><a class="dxj-button dxj-button-outline" href="<?php echo esc_url(home_url('/buses/routes/'.strtolower($item).'/?view=explorer')); ?>"><?php echo esc_html($item); ?> route dashboard ↗︎</a><?php endforeach; ?><a class="dxj-button dxj-button-outline" href="<?php echo esc_url(home_url('/buses/?section=diary')); ?>">Discover another diary</a></div>
			<p hidden data-dxj-resume-offer><button type="button" class="dxj-button dxj-button-outline" data-dxj-resume>Resume your last chapter</button></p>
			<?php $related=new WP_Query(array('post_type'=>'bus-diary-entry','posts_per_page'=>3,'post__not_in'=>array(get_the_ID()),'no_found_rows'=>true));if($related->have_posts()): ?><nav class="dxj-related" aria-label="More bus diaries"><?php while($related->have_posts()):$related->the_post(); ?><a href="<?php the_permalink(); ?>"><?php the_title(); ?> <span aria-hidden="true">↗︎</span></a><?php endwhile;wp_reset_postdata(); ?></nav><?php endif; ?>
			<?php if(function_exists('dx_journey_timeline') && dx_journey_pins($data['id'])):?><details class="dxj-original"><summary>All journey location notes and media</summary><?php dx_journey_timeline($data['id']); ?></details><?php endif;?>
			<?php if(trim(get_post_field('post_content',$data['id']))): ?><details class="dxj-original"><summary>Original diary article</summary><?php $original=apply_filters('the_content',get_post_field('post_content',$data['id']));$original=str_replace(array('dx-story-sample','story-chapter'),array('dxj-source-article','dxj-source-chapter'),$original);$original=preg_replace('/\bid="([^"]+)"/','id="dxj-source-$1"',$original);echo $original; ?></details><?php endif; ?>
		</section>
		<dialog class="dxj-photo-dialog" aria-label="Journey photograph"><button type="button" data-dxj-photo-close aria-label="Close photograph">Close ×</button><p role="status" data-dxj-photo-status>Loading photograph…</p><img alt=""><p data-dxj-photo-caption></p></dialog>
		<p class="screen-reader-text" role="status" aria-live="polite" data-dxj-status></p>
	</article>
<?php endwhile;
get_footer();
