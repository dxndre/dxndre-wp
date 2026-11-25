<?php
/** Reusable, ACF Free-compatible geographical diary chapters. */
if (!defined('ABSPATH')) { exit; }

function dxj_image($id) {
	if (!$id || !wp_attachment_is_image($id)) { return null; }
	return array('id' => (int) $id, 'src' => wp_get_attachment_image_url($id, 'large'), 'full' => wp_get_attachment_image_url($id, 'full'), 'srcset' => wp_get_attachment_image_srcset($id, 'large') ?: '', 'alt' => get_post_meta($id, '_wp_attachment_image_alt', true) ?: get_the_title($id));
}
function dxj_sanitize_chapters($rows) {
	if (!is_array($rows) || count($rows) > 60) { return new WP_Error('chapters_limit', 'Use no more than 60 journey chapters. Previous chapters have been kept.'); }
	$result = array(); $ids = array();
	foreach ($rows as $row) {
		if(!is_array($row))return new WP_Error('chapter_shape','Each chapter must be a valid record. Previous chapters have been kept.');
		$title = sanitize_text_field($row['title'] ?? '');
		if (!$title && !trim($row['body'] ?? '')) { continue; }
		if (!$title) { return new WP_Error('chapter_title', 'Each chapter needs a title. Previous chapters have been kept.'); }
		$lat = $row['lat'] ?? ''; $lng = $row['lng'] ?? '';
		if (('' !== $lat || '' !== $lng) && (!is_numeric($lat) || !is_numeric($lng) || abs((float)$lat) > 90 || abs((float)$lng) > 180)) { return new WP_Error('chapter_location', 'Chapter coordinates must be a valid latitude and longitude. Previous chapters have been kept.'); }
		$id = sanitize_key($row['id'] ?? '');
		if (!$id || isset($ids[$id])) { $id = wp_generate_uuid4(); } $ids[$id] = true;
		$type = sanitize_key($row['type'] ?? 'map'); $environment = sanitize_key($row['environment'] ?? 'neutral');
		$result[] = array(
			'id' => $id, 'title' => mb_substr($title, 160), 'intro' => sanitize_textarea_field($row['intro'] ?? ''), 'body' => wp_kses_post($row['body'] ?? ''),
			'type' => in_array($type, array('map','photography','editorial','spotlight','segment','overview'), true) ? $type : 'map',
			'lat' => '' === $lat ? null : (float)$lat, 'lng' => '' === $lng ? null : (float)$lng,
			'zoom' => max(10, min(18, (float)($row['zoom'] ?? 14))), 'transition' => max(0, min(4, (float)($row['transition'] ?? 1.2))),
			'duration' => empty($row['duration']) ? 0 : max(8, min(180, absint($row['duration']))),
			'stop' => sanitize_text_field($row['stop'] ?? ''), 'location' => sanitize_text_field($row['location'] ?? ''),
			'image' => absint($row['image'] ?? 0), 'gallery' => array_slice(array_values(array_filter(array_map('absint', preg_split('/[ ,]+/', (string)($row['gallery'] ?? ''))))), 0, 16),
			'video' => esc_url_raw($row['video'] ?? '', array('http','https')), 'quote' => sanitize_textarea_field($row['quote'] ?? ''),
			'passenger' => !empty($row['passenger']), 'focal' => max(0, min(100, (int)($row['focal'] ?? 50))),
			'environment' => in_array($environment, array('neutral','morning','day','golden','evening','night','overcast','rain'), true) ? $environment : 'neutral',
			'placement' => 'right' === ($row['placement'] ?? '') ? 'right' : 'left', 'follow' => !empty($row['follow']),
			'annotation' => sanitize_textarea_field($row['annotation'] ?? ''), 'priority' => max(0,min(5,(int)($row['priority'] ?? 1))),
			'recap' => !empty($row['recap']), 'diagram' => !empty($row['diagram']),
		);
	}
	return $result;
}
function dxj_chapters($post_id) {
	$custom = get_post_meta($post_id, '_dx_journey_chapters', true);
	if (is_array($custom) && $custom) { return $custom; }
	$content = apply_filters('the_content', get_post_field('post_content', $post_id));
	$pins = function_exists('dx_journey_pins') ? dx_journey_pins($post_id) : array();
	$chapters = array(); $nodes = array();
	if (class_exists('DOMDocument') && trim($content)) {
		$document = new DOMDocument(); $previous = libxml_use_internal_errors(true);
		$document->loadHTML('<!doctype html><html><head><meta charset="utf-8"></head><body>'.$content.'</body></html>');
		libxml_clear_errors(); libxml_use_internal_errors($previous);
		$xpath = new DOMXPath($document);
		foreach ($xpath->query('//*[contains(concat(" ",normalize-space(@class)," ")," story-chapter ")]') as $node) { $nodes[] = $node; }
		foreach ($nodes as $index => $node) {
			$heading = $node->getElementsByTagName('h2')->item(0); $title = $heading ? $heading->textContent : 'Chapter '.($index+1);
			$body = ''; $inner = $node->getElementsByTagName('div')->item(0);
			foreach (($inner ?: $node)->childNodes as $child) { if ($child === $heading || ('span' === $child->nodeName && !$inner)) { continue; } $body .= $document->saveHTML($child); }
			$pin_index = $index;
			if (preg_match('/data-journey-focus="([^"]+)"/', $body, $match)) { foreach ($pins as $i=>$pin) { if ($pin['id'] === $match[1]) { $pin_index = $i; break; } } }
			$pin = $index === count($nodes)-1 ? ($pins ? end($pins) : array()) : ($pins[$pin_index] ?? array());
			$chapters[] = array('id' => 'chapter-'.($index+1), 'title' => $title, 'body' => $body, 'intro' => '', 'type' => $index === count($nodes)-1 ? 'overview' : ($index === 2 ? 'editorial' : 'map'), 'lat' => $pin['lat'] ?? null, 'lng' => $pin['lng'] ?? null, 'image' => $pin['image'] ?? 0, 'location' => $pin['time'] ?? '', 'video' => $pin['video'] ?? '', 'pin' => $pin['id'] ?? '');
		}
	}
	if (!$chapters) {
		$chapters[] = array('id'=>'chapter-1','title'=>get_the_title($post_id),'body'=>$content,'intro'=>'','type'=>'editorial','lat'=>$pins[0]['lat'] ?? get_post_meta($post_id,'journey_start_lat',true),'lng'=>$pins[0]['lng'] ?? get_post_meta($post_id,'journey_start_lng',true),'image'=>get_post_thumbnail_id($post_id),'location'=>get_post_meta($post_id,'journey_start_name',true));
		foreach ($pins as $pin) { $chapters[] = array('id'=>$pin['id'],'title'=>$pin['title'],'body'=>wpautop(esc_html($pin['body'])),'intro'=>'','type'=>'spotlight','lat'=>$pin['lat'],'lng'=>$pin['lng'],'image'=>$pin['image'],'video'=>$pin['video'],'location'=>$pin['time']); }
	}
	return $chapters;
}
function dxj_data($post_id) {
	$chapters = dxj_chapters($post_id); $derived=!get_post_meta($post_id,'_dx_journey_chapters',true);
	foreach ($chapters as $i => &$chapter) {
		$chapter = wp_parse_args($chapter,array('intro'=>'','type'=>'map','lat'=>null,'lng'=>null,'zoom'=>14,'transition'=>1.2,'duration'=>0,'location'=>'','stop'=>'','gallery'=>array(),'video'=>'','quote'=>'','passenger'=>false,'focal'=>50,'environment'=>'neutral','placement'=>'left','follow'=>false,'annotation'=>'','priority'=>1,'recap'=>true,'diagram'=>true,'image'=>0));
		if (!$chapter['intro']) { $intro_body=preg_replace('/<p[^>]*class="[^"]*dx-eyebrow[^"]*"[^>]*>.*?<\/p>/is','',$chapter['body']); $plain = preg_replace('/\s+/u',' ',wp_strip_all_tags(preg_replace('/<[^>]+>/',' ',$intro_body))); $chapter['intro'] = wp_trim_words($plain, 43); }
		if(!$chapter['quote'] && preg_match('/<blockquote[^>]*>(.*?)<\/blockquote>/is',$chapter['body'],$quote))$chapter['quote']=wp_strip_all_tags($quote[1]);
		$chapter['derived']=$derived;
		$chapter['image'] = dxj_image($chapter['image']);
		$chapter['gallery'] = array_values(array_filter(array_map('dxj_image', $chapter['gallery'])));
		if (!$chapter['duration']) { $chapter['duration'] = max(12,min(90,ceil(str_word_count(wp_strip_all_tags($chapter['body'])) / 3.2))); }
		if (null !== $chapter['lat'] && '' !== $chapter['lat'] && null !== $chapter['lng'] && '' !== $chapter['lng']) { $chapter['lat'] = (float)$chapter['lat']; $chapter['lng'] = (float)$chapter['lng']; } else { $chapter['lat'] = null; $chapter['lng'] = null; }
	} unset($chapter);
	$route = strtoupper((string)get_post_meta($post_id,'primary_route',true));
	return array('id'=>$post_id,'title'=>get_the_title($post_id),'route'=>$route,'routes'=>array_values(array_unique(preg_split('/[^A-Z0-9]+/', $route, -1, PREG_SPLIT_NO_EMPTY))),'direction'=>get_post_meta($post_id,'_dx_journey_direction',true) === 'outbound' ? 'outbound' : 'inbound','chapters'=>$chapters,'pins'=>function_exists('dx_journey_pins')?array_map(function($pin){$pin['photo']=dxj_image($pin['image']);return $pin;},dx_journey_pins($post_id)):array(),'api'=>rest_url('dx-buses/v1/'),'dashboard'=>home_url('/buses/routes/'),'url'=>get_permalink($post_id));
}

function dxj_editor_row($index, $row = array()) {
	$defaults = array('id'=>'','title'=>'','intro'=>'','body'=>'','type'=>'map','lat'=>'','lng'=>'','zoom'=>14,'transition'=>1.2,'duration'=>0,'location'=>'','stop'=>'','image'=>0,'gallery'=>array(),'video'=>'','quote'=>'','passenger'=>false,'focal'=>50,'environment'=>'neutral','placement'=>'left','follow'=>false,'annotation'=>'','priority'=>1,'recap'=>true,'diagram'=>true);
	$row = wp_parse_args($row,$defaults); $prefix='dxj_chapters['.$index.']';
	?>
	<details class="dxj-editor-row" open style="border:1px solid #c3c4c7;padding:16px;margin:16px 0">
		<summary><strong>Chapter <span data-dxj-number><?php echo esc_html(is_numeric($index)?$index+1:''); ?></span></strong></summary>
		<input type="hidden" data-dxj-field="id" name="<?php echo esc_attr($prefix); ?>[id]" value="<?php echo esc_attr($row['id']); ?>">
		<?php foreach(array('title'=>'Chapter title','intro'=>'Short introduction','body'=>'Narrative (HTML allowed)','location'=>'Location name','stop'=>'Associated stop ID','quote'=>'Pull quote','annotation'=>'Geographical annotation') as $key=>$label): ?>
		<p><label><?php echo esc_html($label); ?><br><?php if(in_array($key,array('intro','body','quote','annotation'),true)): ?><textarea class="widefat" rows="<?php echo $key==='body'?7:2; ?>" data-dxj-field="<?php echo esc_attr($key); ?>" name="<?php echo esc_attr($prefix.'['.$key.']'); ?>"><?php echo esc_textarea($row[$key]); ?></textarea><?php else: ?><input class="widefat" data-dxj-field="<?php echo esc_attr($key); ?>" name="<?php echo esc_attr($prefix.'['.$key.']'); ?>" value="<?php echo esc_attr($row[$key]); ?>"><?php endif; ?></label></p>
		<?php endforeach; ?>
		<div style="display:flex;flex-wrap:wrap;gap:16px">
		<?php foreach(array('type'=>array('map'=>'Map led','photography'=>'Photography led','editorial'=>'Editorial','spotlight'=>'Location spotlight','segment'=>'Journey segment','overview'=>'Journey overview'),'environment'=>array('neutral'=>'Neutral','morning'=>'Morning','day'=>'Day','golden'=>'Golden hour','evening'=>'Evening','night'=>'Night','overcast'=>'Overcast','rain'=>'Rain (colour treatment only)'),'placement'=>array('left'=>'Panel left','right'=>'Panel right')) as $key=>$options): ?>
		<label><?php echo esc_html(ucfirst($key)); ?><br><select data-dxj-field="<?php echo esc_attr($key); ?>" name="<?php echo esc_attr($prefix.'['.$key.']'); ?>"><?php foreach($options as $value=>$label): ?><option value="<?php echo esc_attr($value); ?>" <?php selected($row[$key],$value); ?>><?php echo esc_html($label); ?></option><?php endforeach; ?></select></label>
		<?php endforeach; ?>
		<?php foreach(array('lat'=>'Latitude','lng'=>'Longitude','zoom'=>'Map zoom (10–18)','transition'=>'Camera seconds (0–4)','duration'=>'Playback seconds (0 = automatic)','focal'=>'Photo focal point % (0–100)','priority'=>'Annotation priority (0–5)') as $key=>$label): ?>
		<label><?php echo esc_html($label); ?><br><input type="number" step="any" data-dxj-field="<?php echo esc_attr($key); ?>" name="<?php echo esc_attr($prefix.'['.$key.']'); ?>" value="<?php echo esc_attr($row[$key]); ?>"></label>
		<?php endforeach; ?></div>
		<p><button type="button" class="button" data-dxj-locate>Pick location on editor map</button></p>
		<p><label>Photo attachment ID <input type="number" data-dxj-field="image" name="<?php echo esc_attr($prefix); ?>[image]" value="<?php echo esc_attr($row['image']); ?>"></label> <button type="button" class="button" data-dxj-media="image">Upload / choose photograph</button></p>
		<p><label>Additional photo IDs (comma separated)<input class="widefat" data-dxj-field="gallery" name="<?php echo esc_attr($prefix); ?>[gallery]" value="<?php echo esc_attr(implode(',',(array)$row['gallery'])); ?>"></label><button type="button" class="button" data-dxj-media="gallery">Choose gallery photographs</button></p>
		<p><label>Video URL<input class="widefat" type="url" data-dxj-field="video" name="<?php echo esc_attr($prefix); ?>[video]" value="<?php echo esc_attr($row['video']); ?>"></label><button type="button" class="button" data-dxj-media="video">Upload / choose video</button></p>
		<?php foreach(array('passenger'=>'Enable Passenger Perspective (requires suitable photograph)','follow'=>'Prefer follow camera during playback','recap'=>'Include photograph in Journey Memories','diagram'=>'Include in miniature route diagram') as $key=>$label): ?>
		<p><label><input type="checkbox" data-dxj-field="<?php echo esc_attr($key); ?>" name="<?php echo esc_attr($prefix.'['.$key.']'); ?>" value="1" <?php checked(!empty($row[$key])); ?>><?php echo esc_html($label); ?></label></p>
		<?php endforeach; ?>
		<button type="button" class="button" data-dxj-move="up">Move up</button> <button type="button" class="button" data-dxj-move="down">Move down</button> <button type="button" class="button-link-delete" data-dxj-remove>Remove chapter</button>
	</details>
	<?php
}
add_action('add_meta_boxes_bus-diary-entry',function(){add_meta_box('dxj-chapters','DX. Journey Engine — chapters',function($post){
	wp_nonce_field('dxj_save','dxj_nonce');
	echo '<p>By default the engine reads your existing article chapters and journey pins. Add chapters here only when you want explicit control. Existing article content is kept. Latitude and longitude are optional; missing locations use an editorial fallback. Leaflet supports positioning and zoom, not pitch or bearing.</p>';
	echo '<p><label>Route direction <select name="dxj_direction"><option value="inbound">Inbound</option><option value="outbound" '.selected(get_post_meta($post->ID,'_dx_journey_direction',true),'outbound',false).'>Outbound</option></select></label></p>';
	echo '<div data-dxj-editor-map data-route="'.esc_attr(get_post_meta($post->ID,'primary_route',true)).'" style="height:320px;background:#11191d"></div><p data-dxj-editor-status role="status">Choose a chapter, then click the map to place it.</p><div data-dxj-editor>';
	foreach((array)get_post_meta($post->ID,'_dx_journey_chapters',true) as $index=>$row){if(is_array($row))dxj_editor_row($index,$row);}
	echo '</div><button type="button" class="button" data-dxj-add>Add chapter</button> <button type="button" class="button" data-dxj-import>Copy existing article chapters into this editor</button><template data-dxj-template>';dxj_editor_row('__INDEX__');echo '</template>';
	echo '<script type="application/json" data-dxj-existing>'.wp_json_encode(dxj_chapters($post->ID),JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT).'</script>';
},'bus-diary-entry','normal','high');});
add_action('save_post_bus-diary-entry',function($post_id){
	if(wp_is_post_revision($post_id)||(defined('DOING_AUTOSAVE')&&DOING_AUTOSAVE)||!current_user_can('edit_post',$post_id)||empty($_POST['dxj_nonce'])||!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['dxj_nonce'])),'dxj_save'))return;
	$rows=dxj_sanitize_chapters(wp_unslash($_POST['dxj_chapters']??array()));
	if(is_wp_error($rows)){set_transient('dx_pin_error_'.get_current_user_id(),$rows->get_error_message(),MINUTE_IN_SECONDS);return;}
	update_post_meta($post_id,'_dx_journey_chapters',$rows);update_post_meta($post_id,'_dx_journey_direction',($_POST['dxj_direction']??'')==='outbound'?'outbound':'inbound');
});
