<?php
/** The Gym League: a discovery layer over the existing published review records. */
defined('ABSPATH') || exit;

function dxgym_categories() {
	return [
		'gym' => ['Gym', 'score_gym', 2], 'swim' => ['Wetside', 'score_swim', 1.5],
		'spa' => ['Spa', 'score_spa', 2], 'cafe' => ['Café', 'score_cafe', 1],
		'clean' => ['Cleanliness', 'cleanliness_maintenance', 2.5], 'parking' => ['Parking', 'parking', 1],
	];
}

function dxgym_price_categories() {
	return ['budget' => 'Budget', 'midrange' => 'Mid-Range', 'premium' => 'Premium', 'luxury' => 'Luxury'];
}

function dxgym_facility_options() {
	return [
		'gym' => 'Gym', 'swim' => 'Wetside', 'spa' => 'Spa / sauna',
		'cafe' => 'Café / work', 'parking' => 'Parking', 'padel' => 'Padel Court',
	];
}

function dxgym_padel_status($post_id) {
	$status = get_field('gym_padel_court', $post_id);
	return in_array($status, ['available', 'unavailable'], true) ? $status : '';
}

/** Existing review thresholds, exposed once for the dashboard's explanatory controls. */
function dxgym_thresholds() {
	return [[85,'Outstanding','#b9eaff'],[71,'Excellent','#6ed9c5'],[57,'Positive','#82c995'],[43,'Mixed','#e5a653'],[29,'Poor','#ef8585'],[15,'Bad','#d85b70'],[0,'Diabolical','#8c354b']];
}

/** Match the existing review's percentage bands, including boundary rounding. */
function dxgym_band($percentage) {
	if (!is_numeric($percentage)) return ['label' => 'Not assessed', 'color' => '#a4ada9'];
	foreach (dxgym_thresholds() as $band) {
		if ($percentage >= $band[0]) return ['label' => $band[1], 'color' => $band[2]];
	}
	return ['label' => 'Not assessed', 'color' => '#a4ada9'];
}

function dxgym_url($args = []) {
	return add_query_arg($args, home_url('/fitness/gyms/'));
}

function dxgym_is_dashboard() {
	return (bool) get_query_var('dx_gym_dashboard') || untrailingslashit(wp_parse_url(wp_unslash($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH)) === untrailingslashit(wp_parse_url(home_url('/fitness/gyms/'), PHP_URL_PATH));
}

add_action('init', function () {
	add_rewrite_rule('^fitness/gyms/?$', 'index.php?dx_gym_dashboard=1', 'top');
});
add_filter('query_vars', function ($vars) { $vars[] = 'dx_gym_dashboard'; return $vars; });
add_filter('template_include', function ($template) {
	if (!dxgym_is_dashboard()) return $template;
	status_header(200);
	return get_theme_file_path('templates/gym-dashboard.php');
}, 99);
add_filter('redirect_canonical', function ($redirect) { return dxgym_is_dashboard() ? false : $redirect; });
add_filter('pre_get_document_title', function ($title) { return dxgym_is_dashboard() ? 'The Gym League — DXNDRE Fitness' : $title; });
add_action('wp_enqueue_scripts', function () {
	$dashboard = dxgym_is_dashboard();
	$quick = is_singular() && has_shortcode((string) get_post_field('post_content',get_queried_object_id()),'dx_gym_table');
	if (!$dashboard && !$quick) return;
	if ($dashboard) {
		wp_enqueue_style('dxgym-outfit-thin','https://fonts.googleapis.com/css2?family=Outfit:wght@200&display=swap',[],null);
		wp_enqueue_style('leaflet-css', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', [], '1.9.4');
		wp_enqueue_script('leaflet-js', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', [], '1.9.4', true);
	}
});

/** Optional discovery attributes extend the existing record; blanks are unknown. */
add_action('acf/init', function () {
	if (!function_exists('acf_add_local_field_group')) return;
	acf_add_local_field_group([
		'key' => 'group_dxgym_discovery', 'title' => 'Gym discovery (optional)',
		'fields' => [
			['key'=>'field_dxgym_price','name'=>'gym_price_category','label'=>'Price category','type'=>'select','allow_null'=>1,'choices'=>dxgym_price_categories(),'instructions'=>'Only set a category when confirmed. Leave blank if unknown.'],
			['key'=>'field_dxgym_open','name'=>'gym_open_24_hours','label'=>'Open 24/7','type'=>'select','allow_null'=>1,'choices'=>['yes'=>'Confirmed 24/7','no'=>'Not 24/7'],'instructions'=>'Leave blank if opening hours have not been confirmed.'],
			[
				'key' => 'field_dxgym_padel', 'name' => 'gym_padel_court',
				'label' => dxgym_facility_options()['padel'], 'type' => 'select',
				'allow_null' => 1, 'return_format' => 'value',
				'choices' => ['available' => 'Available', 'unavailable' => 'Unavailable'],
				'instructions' => 'Leave blank if the facility was not confirmed on this visit.',
			],
		],
		'location' => [[['param'=>'post_type','operator'=>'==','value'=>'gym-review']]],
	]);
});

function dxgym_clear_cache($id = 0) {
	if (!$id || in_array(get_post_type($id), ['gym-review','attachment'], true)) delete_transient('dxgym_records_v2');
}
add_action('save_post_gym-review', 'dxgym_clear_cache', 30);
add_action('acf/save_post', 'dxgym_clear_cache', 30);
add_action('before_delete_post', 'dxgym_clear_cache');
add_action('edit_attachment', 'dxgym_clear_cache');
add_action('updated_post_meta', function ($meta_id, $post_id) { if (get_post_type($post_id) === 'gym-review') dxgym_clear_cache($post_id); }, 10, 2);
add_action('added_post_meta', function ($meta_id, $post_id) { if (get_post_type($post_id) === 'gym-review') dxgym_clear_cache($post_id); }, 10, 2);
add_action('deleted_post_meta', function ($meta_id, $post_id) { if (get_post_type($post_id) === 'gym-review') dxgym_clear_cache($post_id); }, 10, 2);

/** Compact summaries only: full editorial content remains at its original URL. */
function dxgym_data() {
	$cached = get_transient('dxgym_records_v2');
	if (is_array($cached)) return $cached;
	$posts = get_posts(['post_type'=>'gym-review','post_status'=>'publish','numberposts'=>-1,'orderby'=>'date','order'=>'DESC']);
	$groups = [];
	foreach ($posts as $post) $groups[dx_gym_visit_root($post->ID)][] = $post;
	$records = []; $reviews = [];
	foreach ($groups as $root => $visits) {
		usort($visits, function ($a, $b) {
			$a_date = strtotime((string) get_field('visited_date', $a->ID)) ?: 0;
			$b_date = strtotime((string) get_field('visited_date', $b->ID)) ?: 0;
			return ($b_date <=> $a_date) ?: (strcmp($b->post_date, $a->post_date) ?: ($b->ID <=> $a->ID));
		});
		foreach ($visits as $index => $post) {
			$id = $post->ID; $scores = [];
			foreach (dxgym_categories() as $key => $category) $scores[$key] = dx_normalise_facility_score(get_field($category[1], $id));
			$overall = dx_calc_overall_score($scores);
			$percentage = $overall === null ? null : round($overall * 10, 1);
			$chain_key = (string) get_field('gym_chain', $id);
			$chain_field = get_field_object('gym_chain', $id);
			$chain = $chain_field['choices'][$chain_key] ?? '';
			$title = html_entity_decode(get_the_title($id), ENT_QUOTES, get_bloginfo('charset'));
			$name = $chain && $chain_key !== 'other' && stripos($title, $chain) === false ? $chain . ' ' . $title : $title;
			$coords = dx_gym_map_coordinates(get_field('google_maps_url', $id));
			$raw_date = (string) get_field('visited_date', $id);
			$visit_time = strtotime($raw_date) ?: 0;
			$thumb = get_post_thumbnail_id($id);
			if (!$thumb) { $gallery = (array) get_field('gym_gallery', $id); $first = reset($gallery); $thumb = is_array($first) ? ($first['ID'] ?? 0) : absint($first); }
			$image = $thumb ? wp_get_attachment_image_url($thumb, 'medium_large') : '';
			$price = (string) get_field('gym_price_category', $id);
			$record = [
				'id'=>$id, 'root'=>(int)$root, 'title'=>$title, 'name'=>$name, 'chain'=>$chain, 'chainKey'=>$chain_key,
				'location'=>(string)get_field('gym_location',$id), 'scores'=>$scores, 'overall'=>$percentage,
				'band'=>dxgym_band($percentage), 'url'=>get_permalink($id), 'image'=>$image ?: '',
				'imageSmall'=>$thumb ? (wp_get_attachment_image_url($thumb, 'thumbnail') ?: $image) : '',
				'date'=>$visit_time ? wp_date('j F Y', $visit_time) : '', 'dateISO'=>$visit_time ? wp_date('Y-m-d',$visit_time) : '',
				'published'=>get_the_date('j F Y',$id), 'publishedISO'=>get_the_date('Y-m-d',$id),
				'excerpt'=>wp_trim_words(wp_strip_all_tags((string)get_field('notes',$id)), 23),
				'lat'=>$coords['lat'], 'lng'=>$coords['lng'], 'visits'=>count($visits),
				'price'=>isset(dxgym_price_categories()[$price]) ? $price : '',
				'open24'=>get_field('gym_open_24_hours',$id) === 'yes',
				'padel'=>dxgym_padel_status($id),
			];
			$reviews[] = $record;
			if ($index === 0) $records[] = $record;
		}
	}
	usort($records, function ($a,$b) { return (($b['overall'] ?? -1) <=> ($a['overall'] ?? -1)) ?: strcasecmp($a['name'],$b['name']); });
	foreach ($records as $index => &$record) $record['rank'] = $index + 1;
	unset($record);
	usort($reviews, function ($a,$b) { return strcmp($b['dateISO'] ?: $b['publishedISO'], $a['dateISO'] ?: $a['publishedISO']) ?: ($b['id'] <=> $a['id']); });
	$data = ['gyms'=>$records,'reviews'=>$reviews,'visits'=>count($posts)];
	set_transient('dxgym_records_v2',$data,HOUR_IN_SECONDS);
	return $data;
}

function dxgym_state($request = null) {
	$get = static function ($key, $fallback='') use ($request) {
		$value = $request ? $request->get_param($key) : ($_GET[$key] ?? $fallback);
		return is_scalar($value) ? sanitize_text_field(wp_unslash((string)$value)) : $fallback;
	};
	$views = ['overview','league','explorer','compare','map','reviews','insights'];
	$view = $get('view','overview'); if (!in_array($view,$views,true)) $view='overview';
	$known_ids = array_fill_keys(array_column(dxgym_data()['gyms'],'id'),true);
	$compare = array_slice(array_values(array_filter(array_unique(array_map('absint',explode(',',$get('compare')))),static function($id)use($known_ids){return isset($known_ids[$id]);})),0,3);
	$sort = $get('sort','overall'); if (!in_array($sort,array_merge(['overall','name','recent'],array_keys(dxgym_categories())),true)) $sort='overall';
	return ['view'=>$view,'q'=>$get('q'),'chain'=>$get('chain'),'location'=>$get('location'),'facility'=>$get('facility'),'price'=>$get('price'),'open24'=>$get('open24'),'sort'=>$sort,'page'=>max(1,absint($get('page','1'))),'compare'=>$compare, 'display'=>$get('display')==='list'?'list':'map'];
}

function dxgym_filtered($records,$state) {
	$results = array_values(array_filter($records, static function ($record) use ($state) {
		if ($state['q'] !== '' && stripos(remove_accents($record['name'].' '.$record['location'].' '.$record['chain']),remove_accents($state['q'])) === false) return false;
		if ($state['chain'] && $record['chainKey'] !== $state['chain']) return false;
		if ($state['location'] && $record['location'] !== $state['location']) return false;
		if ($state['price'] && $record['price'] !== $state['price']) return false;
		if ($state['open24'] && !$record['open24']) return false;
		$facility = $state['facility'];
		if ($facility === 'padel') return $record['padel'] === 'available';
		if ($facility && !is_numeric($record['scores'][$facility] ?? null)) return false;
		return true;
	}));
	$sort = $state['sort'];
	usort($results, static function ($a,$b) use ($sort) {
		if ($sort === 'name') return strcasecmp($a['name'],$b['name']);
		if ($sort === 'recent') return strcmp($b['dateISO'] ?: $b['publishedISO'],$a['dateISO'] ?: $a['publishedISO']);
		$a_value = $sort === 'overall' ? $a['overall'] : $a['scores'][$sort];
		$b_value = $sort === 'overall' ? $b['overall'] : $b['scores'][$sort];
		return ((is_numeric($b_value) ? $b_value : -1) <=> (is_numeric($a_value) ? $a_value : -1)) ?: strcasecmp($a['name'],$b['name']);
	});
	return $results;
}

function dxgym_icon($name) {
	$paths = [
		'overview'=>'<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>',
		'league'=>'<path d="M4 6h16M4 12h16M4 18h16M8 4v4m8 2v4m-5 2v4"/>',
		'explorer'=>'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
		'compare'=>'<rect x="3" y="4" width="7" height="16"/><rect x="14" y="4" width="7" height="16"/>',
		'map'=>'<path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
		'reviews'=>'<path d="m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>',
		'insights'=>'<path d="M4 20V12m5 8V8m5 12V4m5 16V10"/>',
		'arrow'=>'<path d="M5 19 19 5M5 5h14v14"/>',
		'visits'=>'<rect x="3" y="5" width="18" height="16" rx="1"/><path d="M7 3v4m10-4v4M3 10h18m-12 5h6"/>',
		'close'=>'<path d="m5 5 14 14M19 5 5 19"/>',
		'back'=>'<path d="M20 12H4m6-6-6 6 6 6"/>',
		'pause'=>'<path d="M8 5v14M16 5v14"/>',
		'sun'=>'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
		'moon'=>'<path d="M20.5 14a8.7 8.7 0 0 1-10.5-10.5A8.8 8.8 0 1 0 20.5 14Z"/>',
		'share'=>'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.5 6.6-4m-6.6 7 6.6 4"/>',
		'chevron'=>'<path d="m6 9 6 6 6-6"/>',
		'menu'=>'<path d="M4 6h16M4 12h16M4 18h16"/>',
		'play'=>'<path d="m8 4 12 8-12 8Z"/>',
	];
	return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'.($paths[$name]??$paths['overview']).'</svg>';
}
function dxgym_score($score,$overall=false,$animate=false) {
	if (!is_numeric($score)) return '<span class="dxgym-unassessed">'.($score==='unavailable'?'Unavailable':'Not assessed').'</span>';
	$band = dxgym_band($overall ? $score : $score*10);
	$decimals = $overall || $score != floor($score) ? 1 : 0;
	$animation = $animate ? ' data-league-score="'.esc_attr($score).'" data-league-decimals="'.$decimals.'"' : '';
	return '<span class="dxgym-score"'.$animation.' style="--score-color:'.esc_attr($band['color']).'" title="'.esc_attr($band['label']).'">'.esc_html(number_format_i18n((float)$score,$overall?1:($score == floor($score)?0:1))).($overall?'<small>%</small>':'<small>/10</small>').'</span>';
}
function dxgym_image($record,$small=false) {
	if (!$record['image']) return '<span class="dxgym-image-empty" aria-label="No gym photograph recorded"><img class="dxgym-placeholder-art" src="'.esc_url(get_theme_file_uri('assets/img/gym-placeholder.svg')).'" alt="" loading="lazy" decoding="async"></span>';
	return '<img src="'.esc_url($small?$record['imageSmall']:$record['image']).'" alt="'.esc_attr($record['name']).'" loading="lazy" decoding="async">';
}
function dxgym_amenities($record) {
	$html='';
	foreach (['gym'=>'Gym','swim'=>'Wetside','spa'=>'Spa / sauna','cafe'=>'Café / work','parking'=>'Parking'] as $key=>$label) {
		if (is_numeric($record['scores'][$key])) $html.='<span>'.esc_html($label).'</span>';
	}
	if ($record['price']) $html.='<span>'.esc_html((dxgym_price_categories()[$record['price']] ?? $record['price'])).'</span>';
	if ($record['open24']) $html.='<span>24/7</span>';
	return '<div class="dxgym-tags">'.$html.'</div>';
}
function dxgym_compare_link($record,$state) {
	$selected = in_array($record['id'],$state['compare'],true);
	$ids = $selected ? array_diff($state['compare'],[$record['id']]) : array_slice(array_merge($state['compare'],[$record['id']]),0,3);
	return '<a class="dxgym-link dxgym-compare-toggle" data-compare-id="'.esc_attr($record['id']).'" aria-pressed="'.($selected?'true':'false').'" href="'.esc_url(dxgym_url(['view'=>'compare','compare'=>implode(',',$ids)])).'">'.($selected?'Remove comparison −':'Compare +').'</a>';
}
/** Keep the chain as a small headline and the branch as the main name. */
function dxgym_identity_parts($record) {
	$chain = trim((string) ($record['chain'] ?? ''));
	if (($record['chainKey'] ?? '') === 'other') $chain = '';
	$branch = trim((string) ($record['title'] ?? $record['name'] ?? ''));
	if ($chain !== '') {
		$aliases = [$chain];
		// Review titles predate the full chain label in the editor.
		if (($record['chainKey'] ?? '') === 'bodyworks') $aliases[] = 'Bodyworks';
		foreach ($aliases as $alias) {
			$pattern = '/^' . preg_quote($alias, '/') . '(?:[\s\x{00a0}\x{2013}\x{2014}:,\-]+|$)/iu';
			$normalised = preg_replace($pattern, '', $branch, 1, $count);
			if ($count) { $branch = trim($normalised); break; }
		}
	}
	if ($branch === '') $branch = trim((string) ($record['location'] ?? ''));
	return ['chain' => $chain, 'branch' => $branch];
}
function dxgym_identity_markup($record) {
	$identity = dxgym_identity_parts($record);
	$single_name = $identity['chain'] === '' || $identity['branch'] === '';
	return '<span class="dxgym-gym-identity' . ($single_name ? ' is-single-name' : '') . '">'
		. ($identity['chain'] !== '' ? '<small class="dxgym-chain">' . esc_html($identity['chain']) . '</small>' : '')
		. ($identity['branch'] !== '' ? '<span class="dxgym-branch">' . esc_html($identity['branch']) . '</span>' : '')
		. '</span>';
}

function dxgym_card($record,$state,$review=false) {
	ob_start(); ?>
	<article class="dxgym-gym-card"><a class="dxgym-card-photo" href="<?php echo esc_url($record['url']); ?>"><?php echo dxgym_image($record); ?></a><div class="dxgym-gym-card__body"><div class="dxgym-card-heading"><h3><a href="<?php echo esc_url($record['url']); ?>"><?php echo dxgym_identity_markup($record); ?></a></h3><?php echo dxgym_score($record['overall'],true); ?></div><div class="dxgym-card-meta"><p class="dxgym-card-location"><?php echo dxgym_icon('map'); ?><span><?php echo esc_html($record['location'] ?: 'Location not recorded'); ?></span></p><p class="dxgym-card-date"><?php echo dxgym_icon('visits'); ?><time datetime="<?php echo esc_attr($record['dateISO'] ?: $record['publishedISO']); ?>"><?php echo esc_html($record['date'] ?: $record['published']); ?></time><span class="screen-reader-text"><?php echo $record['date']?' visited':' published'; ?></span></p></div>
	<?php if ($review): ?><p><?php echo esc_html($record['excerpt']); ?></p><?php else: echo dxgym_amenities($record); endif; ?>
	<div class="dxgym-card-actions"><a class="dxgym-link" href="<?php echo esc_url($record['url']); ?>"><?php echo $review?'Read review':'View full review'; ?> <?php echo dxgym_icon('arrow'); ?></a><?php echo dxgym_compare_link($record,$state); ?></div></div></article>
	<?php return ob_get_clean();
}
function dxgym_panel_heading($title,$view,$link='View all') {
	return '<header class="dxgym-panel-heading"><h2>'.esc_html($title).'</h2><a data-gym-nav href="'.esc_url(dxgym_url(['view'=>$view])).'">'.esc_html($link).' <span aria-hidden="true">↗</span></a></header>';
}


function dxgym_sort_options() {
	return ['overall'=>'Overall Score','name'=>'Gym Name A–Z','recent'=>'Most Recently Visited','gym'=>'Gym Score','swim'=>'Wetside Score','spa'=>'Spa Score','cafe'=>'Café Score','clean'=>'Cleanliness Score','parking'=>'Parking Score'];
}
/** Both summary values use the same native, keyboard-accessible dropdown. */
function dxgym_listing_summary($total,$state) {
	$data=dxgym_data();
	$unit=$state['view']==='reviews'?'recorded visits':($total===1?'gym':'gyms');
	$filters=[];
	if($state['q'])$filters[]='“'.$state['q'].'”';
	if($state['chain']){foreach($data['gyms']as$gym){if($gym['chainKey']===$state['chain']){$filters[]=$gym['chain'];break;}}}
	if($state['location'])$filters[]=$state['location'];
	if($state['facility'])$filters[]=dxgym_facility_options()[$state['facility']]??$state['facility'];
	if($state['price'])$filters[]=dxgym_price_categories()[$state['price']] ?? $state['price'];
	if($state['open24'])$filters[]='24/7';
	$filter_text=implode(' · ',$filters);
	// Chain counts retain every other active filter and use visits on the Reviews view.
	$without_chain=$state;$without_chain['chain']='';
	$available=dxgym_filtered($state['view']==='reviews'?$data['reviews']:$data['gyms'],$without_chain);
	$chains=[];
	foreach($available as$gym){if(!$gym['chainKey'])continue;$key=$gym['chainKey'];if(!isset($chains[$key]))$chains[$key]=['label'=>$gym['chain'],'count'=>0];$chains[$key]['count']++;}
	uasort($chains,static function($a,$b){return strnatcasecmp($a['label'],$b['label']);});
	if($state['chain']&&!isset($chains[$state['chain']]))$chains[$state['chain']]=['label'=>$state['chain'],'count'=>0];
	ob_start(); ?>
	<p class="dxgym-list-subtitle" data-gym-list-summary data-total="<?php echo esc_attr($total); ?>" data-sort="<?php echo esc_attr($state['sort']); ?>" data-filters="<?php echo esc_attr($filter_text); ?>">Showing
	<label class="dxgym-summary-control dxgym-summary-count"><span class="screen-reader-text">Filter these results by gym chain</span><span class="dxgym-summary-label" data-gym-summary-label aria-hidden="true"><?php echo esc_html(number_format_i18n($total).' '.$unit); ?></span><select data-gym-summary-count>
	<option value="" data-summary-label="<?php echo esc_attr(number_format_i18n(count($available)).' '.($state['view']==='reviews'?'recorded visits':(count($available)===1?'gym':'gyms'))); ?>" <?php selected($state['chain'],''); ?>>All Chains · <?php echo esc_html(count($available).' '.$unit); ?></option>
	<?php foreach($chains as$value=>$chain): ?><option value="<?php echo esc_attr($value); ?>" data-summary-label="<?php echo esc_attr(number_format_i18n($chain['count']).' '.($state['view']==='reviews'?'recorded visits':($chain['count']===1?'gym':'gyms'))); ?>" <?php selected($state['chain'],$value); ?>><?php echo esc_html($chain['label'].' · '.$chain['count'].' '.($state['view']==='reviews'?'recorded visits':($chain['count']===1?'gym':'gyms'))); ?></option><?php endforeach; ?>
	</select><?php echo dxgym_icon('chevron'); ?></label><?php if($filter_text): ?> <span class="dxgym-summary-filter" data-summary-filter>matching <?php echo esc_html($filter_text); ?></span><?php endif; ?>, sorted by
	<label class="dxgym-summary-control dxgym-summary-sort"><span class="screen-reader-text">Sort results</span><span class="dxgym-summary-label" data-gym-summary-label aria-hidden="true"><?php echo esc_html(dxgym_sort_options()[$state['sort']]??'Overall Score'); ?></span><select data-gym-summary-sort><?php foreach(dxgym_sort_options()as$value=>$label): ?><option value="<?php echo esc_attr($value); ?>" <?php selected($state['sort'],$value); ?>><?php echo esc_html($label); ?></option><?php endforeach; ?></select><?php echo dxgym_icon('chevron'); ?></label>.</p>
	<?php return ob_get_clean();
}

/** Actual latest assessed visits exemplify each band; never fabricate a missing example. */
function dxgym_threshold_explorer($gyms) {
	$bands=array_reverse(dxgym_thresholds());
	ob_start(); ?>
	<div class="dxgym-threshold-scroll"><div class="dxgym-threshold-band" role="group" aria-label="Explore the overall score thresholds">
	<?php foreach($bands as$index=>$band):$maximum=$bands[$index+1][0]??101;$range=$maximum===101?'85–100%':$band[0].'–'.number_format_i18n($maximum-.1,1).'%'; ?>
	<button type="button" data-score-band data-band-label="<?php echo esc_attr($band[1]); ?>" data-band-range="<?php echo esc_attr($range); ?>" data-band-color="<?php echo esc_attr($band[2]); ?>" style="--score-color:<?php echo esc_attr($band[2]); ?>;--band-size:<?php echo esc_attr(($maximum===101?100:$maximum)-$band[0]); ?>" aria-pressed="false" aria-controls="dxgym-band-<?php echo esc_attr($index); ?>"><span class="dxgym-threshold-swatch" aria-hidden="true"></span><strong><?php echo esc_html($band[1]); ?></strong><small><?php echo esc_html($range); ?></small></button>
	<?php endforeach; ?></div></div>
	<div class="dxgym-threshold-explanation" data-score-band-status><p data-score-band-prompt>Select a colour band to explore its score range and examples from the league.</p>
	<?php foreach($bands as$index=>$band):$maximum=$bands[$index+1][0]??101;$matches=array_values(array_filter($gyms,static function($gym)use($band,$maximum){return is_numeric($gym['overall'])&&$gym['overall']>=$band[0]&&$gym['overall']<$maximum;}));$examples=array_slice($matches,0,3); ?>
	<section id="dxgym-band-<?php echo esc_attr($index); ?>" data-score-band-panel hidden style="--active-band-color:<?php echo esc_attr($band[2]); ?>"><h3><?php echo esc_html($band[1]); ?> <span><?php echo esc_html($maximum===101?'85–100%':$band[0].'–'.number_format_i18n($maximum-.1,1).'%'); ?></span></h3><p><?php echo $matches?esc_html(count($matches).' '.(count($matches)===1?'gym falls':'gyms fall').' within this band, using each gym’s latest assessed visit.'):esc_html('No assessed gyms fall within this band yet.'); ?></p>
	<?php if($examples): ?><ul class="dxgym-band-examples"><?php foreach($examples as$gym): ?><li><a href="<?php echo esc_url($gym['url']); ?>"><span><?php echo esc_html($gym['name']); ?></span><?php echo dxgym_score($gym['overall'],true); ?><span class="dxgym-band-arrow" aria-hidden="true">↗</span></a></li><?php endforeach; ?></ul><?php endif; ?></section>
	<?php endforeach; ?></div>
	<?php return ob_get_clean();
}

/** Distribution counts stay in their existing five ranges; missing ratings are separate. */
function dxgym_distribution_chart($distribution,$scored_count,$average,$missing=0) {
	$colors=['85–100%'=>dxgym_band(85)['color'],'71–84.9%'=>dxgym_band(71)['color'],'57–70.9%'=>dxgym_band(57)['color'],'43–56.9%'=>dxgym_band(43)['color'],'Below 43%'=>dxgym_band(42.9)['color']];
	$offset=0;
	ob_start(); ?><figure class="dxgym-distribution-chart" data-gym-donut><div class="dxgym-donut-visual"><svg viewBox="0 0 240 240" role="img" aria-label="<?php echo esc_attr('Score distribution across '.$scored_count.' assessed gyms. '.$missing.' gyms not assessed. See the legend for exact counts.'); ?>"><circle class="dxgym-donut-track" cx="120" cy="120" r="86" fill="none" stroke-width="26"/><?php foreach($distribution as$label=>$count):$percent=$scored_count?round($count/$scored_count*100,4):0;if(!$count)continue; ?><circle class="dxgym-donut-segment" data-gym-donut-segment cx="120" cy="120" r="86" fill="none" stroke="<?php echo esc_attr($colors[$label]); ?>" stroke-width="26" pathLength="100" stroke-dasharray="<?php echo esc_attr($percent.' '.(100-$percent)); ?>" stroke-dashoffset="<?php echo esc_attr(-$offset); ?>" transform="rotate(-90 120 120)"/><?php $offset+=$percent; endforeach; ?></svg><div class="dxgym-donut-centre"><strong><?php echo $average!==null?esc_html(number_format_i18n($average,1)).'%':'—'; ?></strong><span>Average Score</span></div></div><figcaption><p><?php echo esc_html($scored_count.' assessed gyms · '.$missing.' not assessed'); ?></p><ul class="dxgym-donut-legend"><?php foreach($distribution as$label=>$count): ?><li><span class="dxgym-donut-swatch" style="--slice-color:<?php echo esc_attr($colors[$label]); ?>" aria-hidden="true"></span><span><?php echo esc_html($label); ?></span><strong><?php echo esc_html($count); ?></strong><small><?php echo $scored_count?esc_html(number_format_i18n($count/$scored_count*100,1)).'%':'—'; ?></small></li><?php endforeach; ?><?php if($missing): ?><li class="dxgym-donut-missing"><span class="dxgym-donut-swatch" aria-hidden="true"></span><span>Not Assessed</span><strong><?php echo esc_html($missing); ?></strong><small>Excluded</small></li><?php endif; ?></ul></figcaption></figure><?php return ob_get_clean();
}

function dxgym_filters($data,$state) {
	$chains=[];$locations=[];$prices=[];$has24=false;
	foreach ($data['gyms'] as $gym) { if($gym['chain'])$chains[$gym['chainKey']]=$gym['chain'];if($gym['location'])$locations[$gym['location']]=$gym['location'];if($gym['price'])$prices[$gym['price']]=dxgym_price_categories()[$gym['price']] ?? $gym['price'];if($gym['open24'])$has24=true; }
	natcasesort($chains);natcasesort($locations);
	ob_start(); ?>
	<form class="dxgym-filters" method="get" action="<?php echo esc_url(dxgym_url()); ?>" data-gym-filters>
	<input type="hidden" name="view" value="<?php echo esc_attr($state['view']); ?>"><input type="hidden" name="compare" value="<?php echo esc_attr(implode(',',$state['compare'])); ?>">
	<label class="dxgym-search"><?php echo dxgym_icon('explorer'); ?><span class="screen-reader-text">Search gyms, locations or chains</span><input type="search" name="q" placeholder="Search gyms, locations or chains…" value="<?php echo esc_attr($state['q']); ?>" autocomplete="off"></label>
	<?php foreach (['chain'=>['All chains',$chains],'location'=>['All locations',$locations],'facility'=>['All facilities',dxgym_facility_options()],'sort'=>['Sort by',['overall'=>'Overall score ↓','name'=>'Gym name A–Z','recent'=>'Most recently visited','gym'=>'Gym score ↓','swim'=>'Wetside score ↓','spa'=>'Spa score ↓','cafe'=>'Café score ↓','clean'=>'Cleanliness score ↓','parking'=>'Parking score ↓']]] as $key=>$config): ?>
	<label><span class="screen-reader-text"><?php echo esc_html($config[0]); ?></span><select name="<?php echo esc_attr($key); ?>"><?php if($key!=='sort'): ?><option value=""><?php echo esc_html($config[0]); ?></option><?php endif; ?><?php foreach($config[1] as $value=>$label): ?><option value="<?php echo esc_attr($value); ?>" <?php selected($state[$key],(string)$value); ?>><?php echo esc_html($label); ?></option><?php endforeach; ?></select></label>
	<?php endforeach; ?>
	<?php if($prices): ?><label><span class="screen-reader-text">Price category</span><select name="price"><option value="">Any price</option><?php foreach($prices as $key=>$label): ?><option value="<?php echo esc_attr($key); ?>" <?php selected($state['price'],$key); ?>><?php echo esc_html($label); ?></option><?php endforeach; ?></select></label><?php endif; ?>
	<?php if($has24): ?><label class="dxgym-checkbox"><input type="checkbox" name="open24" value="1" <?php checked((bool)$state['open24']); ?>>24/7</label><?php endif; ?>
	<button class="dxgym-button" type="submit">Search</button><a class="dxgym-link" data-gym-nav href="<?php echo esc_url(dxgym_url(['view'=>$state['view'],'compare'=>implode(',',$state['compare'])])); ?>">Reset filters</a>
	</form>
	<?php return ob_get_clean();
}
function dxgym_empty($message='No gyms match these filters.') {
	return '<div class="dxgym-empty">'.dxgym_icon('explorer').'<h2>'.esc_html($message).'</h2><p>Try a different gym, chain or location, or reset your filters.</p></div>';
}
function dxgym_pagination($total,$state,$size=9) {
	$pages=(int)ceil($total/$size); if($pages<2)return '';
	$html='<nav class="dxgym-pagination" aria-label="Gym results pages">';
	for($page=1;$page<=$pages;$page++) {
		$args=$state;$args['page']=$page;$args['compare']=implode(',',$state['compare']);
		$html.='<a data-gym-nav href="'.esc_url(dxgym_url($args)).'" '.($page===$state['page']?'aria-current="page"':'').'>'.$page.'</a>';
	}
	return $html.'</nav>';
}

/** A real next-page link remains usable when enhancement or the network fails. */
function dxgym_incremental($total,$state,$size=10) {
	$page = min($state['page'],max(1,(int)ceil($total/$size)));
	if ($page*$size >= $total) return '';
	$args=$state;$args['page']=$page+1;$args['compare']=implode(',',$state['compare']);
	return '<div class="dxgym-incremental" data-gym-incremental data-page="'.esc_attr($page).'" data-start="'.esc_attr(($page-1)*$size+1).'" data-total="'.esc_attr($total).'"><a class="dxgym-button" data-gym-load-more href="'.esc_url(dxgym_url($args)).'">Load More Gyms <span aria-hidden="true">↓</span></a><p data-gym-more-status role="status"></p><span class="dxgym-load-sentinel" data-gym-load-sentinel aria-hidden="true"></span></div>';
}

function dxgym_map($records,$compact=false) {
	$mapped=array_values(array_filter($records,static function($g){return $g['lat']!==''&&$g['lng']!=='';}));
	$markers=array_map(static function($g){return array_intersect_key($g,array_flip(['id','name','url','lat','lng','overall','band','image','imageSmall','location']));},$mapped);
	return '<div class="dxgym-map'.($compact?' dxgym-map--compact':'').'" data-gym-map tabindex="0" aria-label="Reviewed gym locations"><p class="dxgym-map-message">'.($mapped?'Loading gym locations…':'No precise coordinates are recorded for these results. Use the gym list below.').'</p><script type="application/json" class="dxgym-markers">'.wp_json_encode($markers,JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT).'</script></div><p class="dxgym-map-note">'.count($mapped).' of '.count($records).' gyms have confirmed map coordinates. Unlocated gyms remain in the list.</p>';
}
function dxgym_radar($gyms,$focus_record=null) {
	if(!$gyms)return dxgym_empty('No scored gyms yet.');
	$top=$focus_record ?: $gyms[0];$categories=dxgym_categories();$axes=[];$averages=[];$values=[];$dots='';$labels='';$grid='';$index=0;$top_complete=true;$average_complete=true;
	foreach($categories as $key=>$category){
		$angle=deg2rad(-90+$index*60);$x=170+cos($angle)*104;$y=143+sin($angle)*104;$axes[]="$x,$y";
		$scores=array_values(array_filter(array_column(array_column($gyms,'scores'),$key),'is_numeric'));
		$avg=$scores?array_sum($scores)/count($scores):null;
		$average=$avg??0;$has_score=is_numeric($top['scores'][$key]);$score=$has_score?$top['scores'][$key]:0;if(!$has_score)$top_complete=false;if($avg===null)$average_complete=false;
		$averages[]=(170+cos($angle)*104*$average/10).','.(143+sin($angle)*104*$average/10);
		$values[]=(170+cos($angle)*104*$score/10).','.(143+sin($angle)*104*$score/10);
		if($has_score)$dots.='<circle data-gym-radar-point cx="'.(170+cos($angle)*104*$score/10).'" cy="'.(143+sin($angle)*104*$score/10).'" r="3" fill="#edbc59"/>';
		$labels.='<text x="'.(170+cos($angle)*133).'" y="'.(147+sin($angle)*125).'" text-anchor="middle">'.esc_html($category[0]).'</text>';
		$index++;
	}
	for($step=1;$step<=5;$step++){
		$points=[];foreach(range(0,5)as$i){$a=deg2rad(-90+$i*60);$points[]=(170+cos($a)*104*$step/5).','.(143+sin($a)*104*$step/5);}
		$grid.='<polygon points="'.esc_attr(implode(' ',$points)).'"/>';
	}
	ob_start(); ?><div class="dxgym-radar" data-gym-radar><svg viewBox="0 0 340 285" role="img" aria-label="Score breakdown for <?php echo esc_attr($top['name']); ?> compared with league category averages"><g class="dxgym-radar-grid"><?php echo $grid; ?></g><?php if($average_complete): ?><polygon class="dxgym-radar-average" points="<?php echo esc_attr(implode(' ',$averages)); ?>"/><?php endif; if($top_complete): ?><polygon class="dxgym-radar-top" points="<?php echo esc_attr(implode(' ',$values)); ?>"/><?php endif; echo $dots; ?><?php echo $labels; ?></svg><p><span class="dxgym-key dxgym-key--top"></span><?php echo $focus_record?'This visit':'Top gym'; ?> <span class="dxgym-key"></span>League average</p><details><summary>View category values</summary><table><caption><?php echo esc_html($top['name']); ?> — categories out of 10</caption><tbody><?php foreach($categories as$key=>$category):$scores=array_values(array_filter(array_column(array_column($gyms,'scores'),$key),'is_numeric')); ?><tr><th scope="row"><?php echo esc_html($category[0]); ?></th><td><?php echo dxgym_score($top['scores'][$key]); ?></td><td><?php echo $scores?esc_html(number_format_i18n(array_sum($scores)/count($scores),1)).' avg':'No average'; ?></td></tr><?php endforeach; ?></tbody></table></details><small>Unassessed categories are omitted from the plotted series. Category averages exclude missing ratings.</small></div><?php return ob_get_clean();
}

function dxgym_view($data,$state) {
	$gyms=$data['gyms'];$view=$state['view'];
	$hero_photos=[];$seen_photos=[];
	foreach($gyms as$gym){
		$featured=get_post_thumbnail_id($gym['id']);
		if(!$featured || !$gym['image'] || isset($seen_photos[$featured]))continue;
		$seen_photos[$featured]=true;
		$hero_photos[]=['image'=>$gym['image'],'name'=>$gym['name'],'url'=>$gym['url'],'branch'=>$gym['root']];
	}
	$filtered=dxgym_filtered($view==='reviews'?$data['reviews']:$gyms,$state);
	$titles=['overview'=>'The Gym League.','league'=>'League Table.','explorer'=>'Explore Gyms.','compare'=>'Compare Gyms.','map'=>'Gym Locations.','reviews'=>'Every Visit, Reviewed.','insights'=>'Beyond the Score.'];
	$descriptions=['overview'=>'Every gym. Every visit. Ranked.','league'=>'All reviewed gyms, ranked by their latest assessed visit.','explorer'=>'Find your next place to train, recharge or try something different.','compare'=>'One shared scoring system. Up to three gyms, side by side.','map'=>'A personal map of gyms I’ve actually visited.','reviews'=>'The notes, photographs and experiences behind the numbers.','insights'=>'Patterns from the visits recorded in this league.'];
	ob_start(); ?>
	<header class="dxgym-hero <?php echo $view==='overview'?'dxgym-hero--overview':''; ?>">
	<?php if($hero_photos): ?><div class="dxgym-hero-slideshow" data-gym-slideshow aria-hidden="true"><div class="dxgym-hero-slide is-active" style="background-image:url('<?php echo esc_url($hero_photos[0]['image']); ?>')"></div><div class="dxgym-hero-slide"></div><script type="application/json" class="dxgym-slideshow-data"><?php echo wp_json_encode($hero_photos,JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT); ?></script></div><?php endif; ?>
	<p class="dxgym-eyebrow">DXNDRE / Fitness</p><h1 id="dxgym-heading" tabindex="-1"><?php echo esc_html($titles[$view]); ?></h1><p><?php echo esc_html($descriptions[$view]); ?></p>
	<?php if($view==='overview'): ?><span class="dxgym-hero-caption">Different gyms.<br>Same commitment.</span><?php endif; ?>
	<?php if(count($hero_photos)>1): ?><div class="dxgym-slideshow-controls"><button class="dxgym-slideshow-toggle" type="button" data-gym-slide-toggle aria-pressed="false" hidden><span>Pause Slideshow</span><span class="dxgym-pause-icon" aria-hidden="true"><?php echo dxgym_icon('pause'); ?></span><span class="dxgym-play-icon" aria-hidden="true" hidden><?php echo dxgym_icon('play'); ?></span></button><a class="dxgym-slideshow-credit" data-gym-slide-credit href="<?php echo esc_url($hero_photos[0]['url']); ?>">Inside <?php echo esc_html($hero_photos[0]['name']); ?> ↗</a></div><?php endif; ?>
	</header>
	<?php if($view==='overview'):
		$scored=array_values(array_filter($gyms,static function($g){return is_numeric($g['overall']);}));$average=$scored?array_sum(array_column($scored,'overall'))/count($scored):null;
		?>
		<?php $winner = $scored[0] ?? null; $winner_identity = $winner ? dxgym_identity_parts($winner) : null; ?>
		<div class="dxgym-stats"><?php foreach([
			['visits',$data['visits'],'Recorded visits','Each published visit','reviews'],
			['map',count($gyms),'Unique gyms reviewed','Latest visit sets the rating','explorer'],
			['insights',count(dxgym_categories()),'Score categories','Weighted, not a simple average','insights'],
			['reviews',$winner?number_format_i18n($winner['overall'],1).'%':'—','Highest rated','Current recorded score',$winner?$winner['url']:'league'],
		] as $stat_index => $stat): $is_winner = $stat_index === 3 && $winner; $target = $is_winner ? $stat[4] : dxgym_url(['view'=>$stat[4]]); ?>
			<article<?php echo $is_winner?' class="dxgym-stat--winner"':''; ?>>
				<a class="dxgym-stat-link" href="<?php echo esc_url($target); ?>"<?php echo $is_winner?' aria-describedby="dxgym-winner-preview"':' data-gym-nav'; ?>><?php echo dxgym_icon($stat[0]); ?><div><strong><?php echo esc_html($stat[1]); ?></strong><p><?php echo esc_html($stat[2]); ?></p><small><?php echo esc_html($stat[3]); ?></small></div></a>
				<?php if($is_winner): ?>
					<button type="button" class="dxgym-stat-preview-toggle" data-gym-stat-preview-toggle aria-controls="dxgym-winner-preview" aria-expanded="false" aria-label="<?php echo esc_attr('Preview '.$winner['name']); ?>" hidden><?php echo dxgym_icon('explorer'); ?></button>
					<div class="dxgym-stat-preview" id="dxgym-winner-preview" role="tooltip"><?php if($winner['image']): ?><img src="<?php echo esc_url($winner['image']); ?>" alt="" loading="lazy" decoding="async"><?php endif; ?><div><?php if($winner_identity['chain']): ?><span class="dxgym-stat-preview__chain"><?php echo esc_html($winner_identity['chain']); ?></span><?php endif; ?><span class="dxgym-stat-preview__branch"><?php echo esc_html($winner_identity['branch']); ?></span></div></div>
				<?php endif; ?>
			</article>
		<?php endforeach; ?></div>
		<div class="dxgym-overview-grid"><section class="dxgym-panel dxgym-top-three"><?php echo dxgym_panel_heading('Top 5 Gyms','league','Full league table'); ?><div class="dxgym-top-list"><?php foreach(array_slice($gyms,0,5) as$gym): ?><a href="<?php echo esc_url($gym['url']); ?>"><span class="dxgym-rank"><?php echo str_pad($gym['rank'],2,'0',STR_PAD_LEFT); ?></span><?php echo dxgym_image($gym,true); ?><div><h3><?php echo esc_html($gym['name']); ?></h3><p><?php echo esc_html($gym['location']); ?></p></div><?php echo dxgym_score($gym['overall'],true); ?><span aria-hidden="true">↗</span></a><?php endforeach; ?></div></section>
		<section class="dxgym-panel"><?php echo dxgym_panel_heading('Score Breakdown','insights','View insights'); ?><p class="dxgym-muted"><?php echo !empty($gyms[0])?esc_html($gyms[0]['name']):'No gym records yet'; ?></p><?php echo dxgym_radar($gyms); ?></section>
		<section class="dxgym-panel"><?php echo dxgym_panel_heading('Recent Reviews','reviews'); ?><div class="dxgym-recent-list"><?php foreach(array_slice($data['reviews'],0,3)as$gym): ?><a href="<?php echo esc_url($gym['url']); ?>"><?php echo dxgym_image($gym,true); ?><div><h3><?php echo esc_html($gym['name']); ?></h3><time><?php echo esc_html($gym['date']?:$gym['published']); ?></time><p><?php echo esc_html(wp_trim_words($gym['excerpt'],11)); ?></p></div><?php echo dxgym_score($gym['overall'],true); ?></a><?php endforeach; ?></div></section></div>
		<section class="dxgym-panel dxgym-find"><div><p class="dxgym-eyebrow">Your next session starts here</p><h2>Find Your Next Gym.</h2><p>Search the places I’ve trained, with first-hand scores and honest notes.</p></div><form method="get" action="<?php echo esc_url(dxgym_url()); ?>" data-gym-filters><input type="hidden" name="view" value="explorer"><label class="dxgym-search"><?php echo dxgym_icon('explorer'); ?><span class="screen-reader-text">Search gyms</span><input name="q" type="search" placeholder="Gyms, locations or chains…"></label><button class="dxgym-button">Search <?php echo dxgym_icon('arrow'); ?></button></form></section>
		<div class="dxgym-overview-bottom"><section class="dxgym-panel"><?php echo dxgym_panel_heading('Gym Locations','map','Open map'); echo dxgym_map($gyms,true); ?></section><section class="dxgym-panel"><?php echo dxgym_panel_heading('League Insights','insights'); ?><div class="dxgym-insight-list"><p><strong><?php echo $average!==null?esc_html(number_format_i18n($average,1)).'%':'—'; ?></strong><span>Average latest-visit score</span></p><p><strong><?php echo count(array_filter($gyms,static function($g){return is_numeric($g['overall'])&&$g['overall']>=80;})); ?></strong><span>Gyms rated at least 80%</span></p><p><strong><?php echo count(array_filter($gyms,static function($g){return $g['visits']>1;})); ?></strong><span>Gyms with recorded return visits</span></p></div><small>My personal visits, not a representative survey of every gym.</small></section><section class="dxgym-panel dxgym-story-link"><p class="dxgym-eyebrow">From the diary</p><h2>The Journey Behind the Visits.</h2><p>From my first gym visit to N118 Fitness — the progress, setbacks and people behind the league.</p><a class="dxgym-button" href="<?php echo esc_url(home_url('/fitness/#fitness-story')); ?>">Read My Gym Story <?php echo dxgym_icon('arrow'); ?></a></section></div>
	<?php elseif(in_array($view,['league','explorer','reviews','map'],true)):
		echo dxgym_filters($data,$state);
		if($view==='map'): ?>
		<div class="dxgym-view-switch"><a data-gym-nav href="<?php $args=$state;$args['display']='map';$args['compare']=implode(',',$state['compare']);echo esc_url(dxgym_url($args)); ?>" <?php echo $state['display']==='map'?'aria-current="true"':''; ?>>Map</a><a data-gym-nav href="<?php $args['display']='list';echo esc_url(dxgym_url($args)); ?>" <?php echo $state['display']==='list'?'aria-current="true"':''; ?>>List</a></div>
		<?php if($state['display']==='map')echo dxgym_map($filtered); endif;
		$total=count($filtered);$size=$view==='league'?10:9;$max_page=max(1,(int)ceil($total/$size));$state['page']=min($state['page'],$max_page);$page=array_slice($filtered,($state['page']-1)*$size,$size);
		echo '<div class="dxgym-results-heading">' . dxgym_listing_summary($total,$state);
		?><p class="dxgym-results-count" role="status"><?php echo $total?esc_html('Showing '.(($state['page']-1)*$size+1).'–'.min($total,$state['page']*$size).' of '.$total.($view==='reviews'?' recorded visits':' gyms')):'No matching gyms'; ?></p></div>
		<?php if(!$total): echo dxgym_empty(); elseif($view==='league'): ?>
		<?php
		$league_sort_url = static function ($key) use ($state) {
			return dxgym_url(array_merge($state, [
				'sort' => $key,
				'page' => 1,
				'compare' => implode(',', $state['compare']),
			]));
		};
		$league_categories = dxgym_categories();
		?>
		<div class="dxgym-table-scroll">
			<table class="dxgym-table">
				<caption class="screen-reader-text">Gym rankings — category scores out of 10; overall score is a weighted percentage.</caption>
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col"<?php if ($state['sort'] === 'name') echo ' aria-sort="ascending"'; ?>><a data-gym-nav href="<?php echo esc_url($league_sort_url('name')); ?>">Gym</a></th>
						<th scope="col">Location</th>
						<?php foreach ($league_categories as $key => $category) : ?>
							<th scope="col"<?php if ($state['sort'] === $key) echo ' aria-sort="descending"'; ?>>
								<a data-gym-nav href="<?php echo esc_url($league_sort_url($key)); ?>"><?php echo esc_html($category[0]); ?><small>×<?php echo esc_html($category[2]); ?></small></a>
							</th>
						<?php endforeach; ?>
						<th scope="col"<?php if ($state['sort'] === 'overall') echo ' aria-sort="descending"'; ?>><a data-gym-nav href="<?php echo esc_url($league_sort_url('overall')); ?>">Overall</a></th>
						<th scope="col"><span class="screen-reader-text">Compare</span></th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ($page as $index => $gym) : ?>
						<tr>
							<td class="dxgym-table-rank"><?php echo str_pad(($state['page'] - 1) * $size + $index + 1, 2, '0', STR_PAD_LEFT); ?></td>
							<th scope="row"<?php if ($state['sort'] === 'name') echo ' class="is-league-sort-column"'; ?>><a class="dxgym-table-name" href="<?php echo esc_url($gym['url']); ?>"><?php echo dxgym_image($gym, true); ?><?php echo dxgym_identity_markup($gym); ?></a></th>
							<td data-label="Location"><?php echo esc_html($gym['location'] ?: 'Not recorded'); ?></td>
							<?php foreach ($league_categories as $key => $category) : ?>
								<td data-label="<?php echo esc_attr($category[0]); ?>"<?php if ($state['sort'] === $key) echo ' class="is-league-sort-column"'; ?>><?php echo dxgym_score($gym['scores'][$key], false, true); ?></td>
							<?php endforeach; ?>
							<td data-label="Overall"<?php if ($state['sort'] === 'overall') echo ' class="is-league-sort-column"'; ?>><?php echo dxgym_score($gym['overall'], true, true); ?></td>
							<td><?php echo dxgym_compare_link($gym, $state); ?></td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		</div>
		<p class="dxgym-map-note">Latest dated visit per branch. Unassessed and unavailable facilities are excluded from the weighted overall score; a recorded zero is retained. Category order reflects your selected sort.</p>
		<?php else: ?><div class="dxgym-card-grid"><?php foreach($page as$gym)echo dxgym_card($gym,$state,$view==='reviews'); ?></div><?php endif; echo dxgym_incremental($total,$state,$size); echo dxgym_pagination($total,$state,$size); ?>
	<?php elseif($view==='compare'):
		$compare_total=count($filtered);$compare_size=12;$state['page']=min($state['page'],max(1,(int)ceil($compare_total/$compare_size)));
		$selected=array_values(array_filter($gyms,static function($gym)use($state){return in_array($gym['id'],$state['compare'],true);}));usort($selected,static function($a,$b)use($state){return array_search($a['id'],$state['compare'],true)<=>array_search($b['id'],$state['compare'],true);});
		?>
		<div class="dxgym-compare-toolbar"><p><?php echo count($selected); ?> of 3 gyms selected</p><div class="dxgym-comparison-actions"><button class="dxgym-button dxgym-share-comparison" type="button" data-gym-share <?php disabled(!$selected); ?>><?php echo dxgym_icon('share'); ?> Share Comparison</button><a class="dxgym-button dxgym-clear-comparison" data-gym-nav href="<?php echo esc_url(dxgym_url(['view'=>'compare','compare'=>''])); ?>"><?php echo dxgym_icon('close'); ?> Clear Comparison</a></div></div>
		<?php if($selected): ?><div class="dxgym-comparison" style="--compare-count:<?php echo count($selected); ?>"><?php foreach($selected as$gym): ?><article class="dxgym-panel dxgym-compare-card" data-gym-record="<?php echo esc_attr($gym['id']); ?>"><a class="dxgym-compare-visual" href="<?php echo esc_url($gym['url']); ?>"><?php echo dxgym_image($gym); ?><div class="dxgym-compare-visual__caption"><h2><?php echo esc_html($gym['name']); ?></h2><p><?php echo esc_html($gym['location']); ?></p><?php echo dxgym_score($gym['overall'],true); ?></div></a><?php echo dxgym_compare_link($gym,$state); ?><label class="dxgym-replace"><span>Replace gym</span><select data-compare-replace="<?php echo esc_attr($gym['id']); ?>" aria-label="Replace <?php echo esc_attr($gym['name']); ?>"><?php foreach($gyms as$option):if(in_array($option['id'],$state['compare'],true)&&$option['id']!==$gym['id'])continue; ?><option value="<?php echo esc_attr($option['id']); ?>" <?php selected($gym['id'],$option['id']); ?>><?php echo esc_html($option['name']); ?></option><?php endforeach; ?></select></label><dl class="dxgym-compare-scores"><?php foreach(dxgym_categories()as$key=>$category):$numbers=array_filter(array_column(array_column($selected,'scores'),$key),'is_numeric');$value=$gym['scores'][$key];$best=is_numeric($value)&&$numbers&&$value===max($numbers); ?><div<?php echo $best?' class="is-category-best"':''; ?>><dt><?php echo esc_html($category[0]); ?><?php if($best&&count($selected)>1): ?><span class="screen-reader-text"> — joint or highest selected score</span><?php endif; ?></dt><dd><?php echo dxgym_score($value); ?><span class="dxgym-bar" aria-hidden="true"><i data-gym-score-key="<?php echo esc_attr('compare-'.$gym['id'].'-'.$key); ?>" style="width:<?php echo is_numeric($value)?esc_attr($value*10):'0'; ?>%;--score-color:<?php echo esc_attr(dxgym_band(is_numeric($value)?$value*10:null)['color']); ?>"></i></span></dd></div><?php endforeach; ?></dl><?php echo dxgym_amenities($gym); ?><a class="dxgym-button" href="<?php echo esc_url($gym['url']); ?>">View Full Review <?php echo dxgym_icon('arrow'); ?></a></article><?php endforeach; ?></div><?php else: ?><div class="dxgym-empty"><h2>Start With a Gym You Know.</h2><p>Search below, then add up to three gyms to see their recorded scores together.</p></div><?php endif; ?>
		<section class="dxgym-panel"><h2><?php echo count($selected)===3?'Change Your Line-up.':'Add a Gym to Compare.'; ?></h2><form class="dxgym-compare-search" method="get" action="<?php echo esc_url(dxgym_url()); ?>" data-gym-filters><input type="hidden" name="view" value="compare"><input type="hidden" name="sort" value="<?php echo esc_attr($state['sort']); ?>"><input type="hidden" name="compare" value="<?php echo esc_attr(implode(',',$state['compare'])); ?>"><label class="dxgym-search"><?php echo dxgym_icon('explorer'); ?><span class="screen-reader-text">Find a gym to compare</span><input name="q" type="search" value="<?php echo esc_attr($state['q']); ?>" placeholder="Search gym, chain or location…"></label><button class="dxgym-button">Find gyms</button></form><div class="dxgym-results-heading"><?php echo dxgym_listing_summary($compare_total,$state); ?><p class="dxgym-results-count" role="status"><?php echo $compare_total?esc_html('Showing '.(($state['page']-1)*$compare_size+1).'–'.min($compare_total,$state['page']*$compare_size).' of '.$compare_total.' gyms'):'No matching gyms'; ?></p></div><div class="dxgym-compare-options"><?php foreach(array_slice($filtered,($state['page']-1)*$compare_size,$compare_size)as$gym): ?><div><a href="<?php echo esc_url($gym['url']); ?>"><?php echo esc_html($gym['name']); ?></a><?php echo dxgym_score($gym['overall'],true); echo dxgym_compare_link($gym,$state); ?></div><?php endforeach; ?></div><?php if(!$filtered)echo dxgym_empty(); echo dxgym_incremental($compare_total,$state,$compare_size); echo dxgym_pagination($compare_total,$state,$compare_size); ?><p class="dxgym-muted">Category values are out of 10. Overall scores are weighted percentages. Missing ratings remain unassessed.</p></section>
	<?php elseif($view==='insights'):
		$scored=array_values(array_filter($gyms,static function($g){return is_numeric($g['overall']);}));$chains=[];$distribution=['85–100%'=>0,'71–84.9%'=>0,'57–70.9%'=>0,'43–56.9%'=>0,'Below 43%'=>0];
		foreach($gyms as$gym){$key=$gym['chain']?:'Other / unspecified';$chains[$key][]=$gym['overall'];if(!is_numeric($gym['overall']))continue;$score=$gym['overall'];$bucket=$score>=85?'85–100%':($score>=71?'71–84.9%':($score>=57?'57–70.9%':($score>=43?'43–56.9%':'Below 43%')));$distribution[$bucket]++;}
		?>
		<div class="dxgym-insights-grid"><section class="dxgym-panel"><h2>How the League Scores.</h2><?php echo dxgym_distribution_chart($distribution,count($scored),$scored?array_sum(array_column($scored,'overall'))/count($scored):null,count($gyms)-count($scored)); ?></section>
		<section class="dxgym-panel"><h2>Category Averages.</h2><p class="dxgym-muted">Only assessed categories contribute.</p><dl class="dxgym-category-averages"><?php foreach(dxgym_categories()as$key=>$category):$scores=array_filter(array_column(array_column($gyms,'scores'),$key),'is_numeric');$average=$scores?round(array_sum($scores)/count($scores),1):null; ?><div><dt><?php echo esc_html($category[0]); ?><small><?php echo count($scores); ?> assessed</small></dt><dd><?php echo dxgym_score($average); ?><span class="dxgym-bar"><i data-gym-score-key="<?php echo esc_attr('average-'.$key); ?>" style="width:<?php echo $average!==null?esc_attr($average*10):0; ?>%"></i></span></dd></div><?php endforeach; ?></dl></section>
		<section class="dxgym-panel"><h2>Chain by Chain.</h2><p class="dxgym-muted">Sample sizes matter — these are my visits, not a chain-wide verdict.</p><table class="dxgym-chain-table"><thead><tr><th>Chain</th><th>Gyms</th><th>Average</th></tr></thead><tbody><?php uasort($chains,static function($a,$b){return count($b)<=>count($a);});foreach($chains as$chain=>$scores):$numbers=array_filter($scores,'is_numeric'); ?><tr><th scope="row"><?php echo esc_html($chain); ?></th><td><?php echo count($scores); ?></td><td><?php echo dxgym_score($numbers?round(array_sum($numbers)/count($numbers),1):null,true); ?></td></tr><?php endforeach; ?></tbody></table></section>
		<section class="dxgym-panel"><h2>Standouts in Each Category.</h2><div class="dxgym-winners"><?php foreach(dxgym_categories()as$key=>$category):$assessed=array_filter($gyms,static function($g)use($key){return is_numeric($g['scores'][$key]);});usort($assessed,static function($a,$b)use($key){return$b['scores'][$key]<=>$a['scores'][$key];});$winner=$assessed?reset($assessed):null; ?><div><p class="dxgym-eyebrow"><?php echo esc_html($category[0]); ?></p><?php if($winner): ?><a href="<?php echo esc_url($winner['url']); ?>"><?php echo esc_html($winner['name']); ?></a><?php echo dxgym_score($winner['scores'][$key]);$tied=count(array_filter($assessed,static function($g)use($winner,$key){return $g['scores'][$key]===$winner['scores'][$key];}));if($tied>1): ?><small>Joint highest across <?php echo esc_html($tied); ?> gyms</small><?php endif;else: ?><p>Not assessed yet</p><?php endif; ?></div><?php endforeach; ?></div></section></div>
	<?php endif; ?>
	<footer class="dxgym-method"><div class="dxgym-method-heading"><p class="dxgym-eyebrow">The Meaning Behind the Numbers</p><h2>One League. One Scoring System.</h2><p>Gym ×2 · Wetside ×1.5 · Spa ×2 · Café ×1 · Cleanliness ×2.5 · Parking ×1. Overall scores use the existing weighted calculation, rounded consistently with the full reviews. A missing rating is never a zero.</p></div><?php echo dxgym_threshold_explorer($gyms); ?><a href="<?php echo esc_url(home_url('/fitness/')); ?>">Back to DXNDRE Fitness ↗</a></footer>
	<?php return ob_get_clean();
}

add_action('rest_api_init', function () {
	register_rest_route('dxndre/v1','/gym-dashboard',[
		'methods'=>'GET','permission_callback'=>'__return_true',
		'callback'=>static function($request){
			$state=dxgym_state($request);$data=dxgym_data();
			if($request->get_param('mode')==='quick'){
				$records=dxgym_filtered($data['gyms'],$state);
				return rest_ensure_response(['cardsHtml'=>dxgym_quick_cards(array_slice($records,0,3)),'total'=>count($records)]);
			}
			return rest_ensure_response(['html'=>dxgym_view($data,$state),'view'=>$state['view'],'compare'=>$state['compare']]);
		},
	]);
});

/** The normal site keeps an editorial entry point, rather than a second league UI. */
function dxgym_quick_cards($gyms) {
	if(!$gyms) return '<div class="dxgym-quick-empty"><h3>No Gyms Found.</h3><p>Try another gym, location or chain.</p></div>';
	ob_start(); ?><div class="dxgym-quick-grid"><?php foreach($gyms as$index=>$gym): ?><a href="<?php echo esc_url($gym['url']); ?>" class="dxgym-quick-card"><?php echo dxgym_image($gym); ?><span class="dxgym-rank"><?php echo str_pad($gym['rank']??($index+1),2,'0',STR_PAD_LEFT); ?></span><div class="dxgym-quick-card-details"><h3><?php echo esc_html($gym['name']); ?></h3><p><?php echo esc_html($gym['location']); ?></p><?php echo dxgym_score($gym['overall'],true); ?><span class="dxgym-quick-review">Read the Review <span aria-hidden="true">↗</span></span></div></a><?php endforeach; ?></div><?php return ob_get_clean();
}
function dxgym_quick_rankings($atts=[]) {
	$atts=shortcode_atts(['chain'=>''],$atts,'dx_gym_table');$data=dxgym_data();$gyms=$data['gyms'];if($atts['chain'])$gyms=array_values(array_filter($gyms,static function($g)use($atts){return$g['chainKey']===$atts['chain'];}));
	ob_start(); ?><section class="dxgym-quick" aria-label="Quick gym rankings" data-gym-preview data-api="<?php echo esc_url(rest_url('dxndre/v1/gym-dashboard')); ?>" data-chain="<?php echo esc_attr($atts['chain']); ?>"><div class="dxgym-quick-heading"><div><p class="dxgym-eyebrow">Quick Gym Rankings</p><h2>The Gym League.</h2><p>Every gym. Every visit. Ranked.</p></div><a class="dxgym-button" data-gym-full-results href="<?php echo esc_url(dxgym_url(['view'=>'league'])); ?>">Explore Full Rankings <?php echo dxgym_icon('arrow'); ?></a></div><form method="get" action="<?php echo esc_url(dxgym_url()); ?>" data-gym-quick-form><input type="hidden" name="view" value="explorer"><?php if($atts['chain']): ?><input type="hidden" name="chain" value="<?php echo esc_attr($atts['chain']); ?>"><?php endif; ?><label class="dxgym-search"><?php echo dxgym_icon('explorer'); ?><span class="screen-reader-text">Find a reviewed gym</span><input type="search" name="q" autocomplete="off" placeholder="Find a gym, location or chain…"></label><button class="dxgym-button">Find Your Next Gym <?php echo dxgym_icon('arrow'); ?></button></form><p class="dxgym-quick-status" data-gym-quick-status role="status"></p><div data-gym-quick-results><?php echo dxgym_quick_cards(array_slice($gyms,0,3)); ?></div></section><?php return ob_get_clean();
}
add_action('init',function(){add_shortcode('dx_gym_table','dxgym_quick_rankings');},20);
