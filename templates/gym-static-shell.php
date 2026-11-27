<?php
/** Standalone Fitness discovery workspace. Individual reviews retain their own template. */
defined('ABSPATH') || exit;
$state=['view'=>'overview','compare'=>[]];
$gym_theme='dark';
$navigation = ['overview'=>'Overview','league'=>'League Table','explorer'=>'Gym Explorer','compare'=>'Compare Gyms','finder'=>'Find My Gym','map'=>'Map View','reviews'=>'Reviews','insights'=>'Insights'];
?>
<!doctype html>
<html lang="en-GB" data-dxgym-theme="<?php echo esc_attr($gym_theme); ?>">
<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="color-scheme" content="<?php echo esc_attr($gym_theme); ?>">
	<title>The Gym League — DXNDRE Fitness</title>
	<link rel="canonical" href="<?php echo esc_url(dxgym_url()); ?>">
	<meta name="description" content="First-hand gym visits, honest scores and a shared scoring system. Explore the Gym League.">
	<link rel="stylesheet" href="<?php echo esc_url(get_theme_file_uri('build/index.css').'?ver='.$data['assetVersion']); ?>">
	<?php dxndre_print_theme_bootstrap('gym-theme'); ?>
</head>
<body class="dxgym-page is-frontend">
<?php if(function_exists('dx_public_command_markup'))dx_public_command_markup(); ?>
<a class="dxgym-skip" href="#dxgym-content">Skip to gym workspace</a>
<div class="dxgym-app" id="dxgym-app" data-manifest="<?php echo esc_url($manifestURL); ?>" data-engine-client="<?php echo esc_url(plugins_url('../Frontend/gyms.js',WP_PLUGIN_DIR.'/dx-data-engine/Core/Engine.php')); ?>" data-base="<?php echo esc_url(dxgym_url()); ?>" data-selected="<?php echo esc_attr(implode(',',$state['compare'])); ?>">
	<button class="dxgym-drawer-shade" type="button" aria-label="Close gym navigation" hidden></button>
	<aside class="dxgym-sidebar" id="dxgym-sidebar" aria-label="Gym League navigation">
		<a class="dxgym-brand" href="<?php echo esc_url(home_url('/fitness/')); ?>" aria-label="DXNDRE Fitness — back to fitness"><span>dx<i>.</i></span><strong>Fitness</strong></a>
		<form class="dxgym-sidebar-search" action="<?php echo esc_url(dxgym_url()); ?>" method="get" data-gym-filters><input type="hidden" name="view" value="explorer"><label class="dxgym-search"><?php echo dxgym_icon('explorer'); ?><span class="screen-reader-text">Search gyms</span><input type="search" name="q" placeholder="Search gyms…" autocomplete="off"></label><button type="submit" class="screen-reader-text">Search</button></form>
		<p class="dxgym-eyebrow">The Gym League</p>
		<nav><?php foreach($navigation as$key=>$label): ?><a data-gym-nav data-gym-view="<?php echo esc_attr($key); ?>" href="<?php echo esc_url(dxgym_url().'#view='.$key); ?>" <?php echo $state['view']===$key?'aria-current="page"':''; ?>><?php echo dxgym_icon($key); ?><span><?php echo esc_html($label); ?></span><?php if($key==='compare'): ?><span data-compare-count class="dxgym-compare-count"><?php echo count($state['compare']); ?></span><?php endif; ?></a><?php endforeach; ?></nav>
		<div class="dxgym-sidebar-bottom"><div><p class="dxgym-eyebrow">Train. Explore. Compare.</p><p>A personal journey through gyms, one visit at a time.</p><span><?php echo esc_html($data['visits']); ?> recorded visits</span></div><a href="<?php echo esc_url(home_url('/fitness/')); ?>"><?php echo dxgym_icon('back'); ?>Back to Fitness</a><a href="<?php echo esc_url(home_url('/')); ?>">Visit dxndre.co.uk <?php echo dxgym_icon('arrow'); ?></a></div>
	</aside>
	<main class="dxgym-workspace" id="dxgym-main">
		<div class="dxgym-topbar"><div class="dxgym-breadcrumb"><a href="<?php echo esc_url(home_url('/fitness/')); ?>">Fitness</a><span aria-hidden="true">/</span><span data-gym-current><?php echo esc_html($navigation[$state['view']]); ?></span></div><div><span class="dxgym-topbar-note">First-hand visits. Honest scores.</span><button class="dxgym-theme-toggle" type="button" data-gym-theme-toggle aria-label="<?php echo $gym_theme==='dark'?'Switch to light mode':'Switch to dark mode'; ?>"><span class="dxgym-theme-sun"><?php echo dxgym_icon('sun'); ?></span><span class="dxgym-theme-moon" hidden><?php echo dxgym_icon('moon'); ?></span><span data-gym-theme-label><?php echo $gym_theme==='dark'?'Light Mode':'Dark Mode'; ?></span></button><button class="dxgym-menu-toggle" type="button" aria-expanded="false" aria-controls="dxgym-sidebar" aria-label="Open gym menu"><?php echo dxgym_icon('menu'); ?></button></div></div>
		<div class="dxgym-loading" role="status" hidden><span></span>Finding your next gym…</div>
		<p class="dxgym-notice" role="status" hidden></p>
		<div class="dxgym-content" id="dxgym-content" data-gym-content><?php echo $data['views']['overview']; ?></div>
	</main>
	<dialog class="dxgym-share-dialog" data-gym-share-dialog aria-labelledby="dxgym-share-title"><button class="dxgym-share-close" type="button" data-gym-share-close aria-label="Close comparison sharing"><?php echo dxgym_icon('close'); ?></button><p class="dxgym-eyebrow">Good Things Are Worth Sharing</p><h2 id="dxgym-share-title">Share Your Line-up.</h2><p data-gym-share-summary></p><label for="dxgym-share-url">Comparison Link</label><div class="dxgym-share-url-row"><input id="dxgym-share-url" data-gym-share-url type="url" readonly spellcheck="false"><button class="dxgym-button" type="button" data-gym-share-copy>Copy Link <?php echo dxgym_icon('share'); ?></button></div><p class="dxgym-share-copy-status" data-gym-share-status role="status"></p><p class="dxgym-muted">The link opens these selected gyms together. Their latest recorded scores always come from the original reviews.</p></dialog>
	<nav class="dxgym-mobile-nav" aria-label="Quick gym navigation"><?php foreach(['overview'=>'Overview','league'=>'League','explorer'=>'Explore','compare'=>'Compare','finder'=>'Find My Gym','map'=>'Map']as$key=>$label): ?><a data-gym-nav data-gym-view="<?php echo esc_attr($key); ?>" href="<?php echo esc_url(dxgym_url().'#view='.$key); ?>" <?php echo $state['view']===$key?'aria-current="page"':''; ?>><?php echo dxgym_icon($key); ?><span><?php echo esc_html($label); ?></span></a><?php endforeach; ?></nav>
</div>
<div class="dxgym-site-footer"><?php $GLOBALS['dx_public_static_shell']=true;try{get_template_part('inc/site-footer');}finally{unset($GLOBALS['dx_public_static_shell']);} ?></div>
<noscript><section class="dxgym-panel"><h2>All reviewed gyms</h2><p>Enable JavaScript for filters, comparisons and maps. Individual reviews remain available below.</p><ul><?php foreach($data['gyms'] as $gym): ?><li><a href="<?php echo esc_url($gym['url']); ?>"><?php echo esc_html($gym['name']); ?></a></li><?php endforeach; ?></ul></section></noscript>
<script defer src="<?php echo esc_url(get_theme_file_uri('build/index.js').'?ver='.$data['assetVersion']); ?>"></script>
</body>
</html>
