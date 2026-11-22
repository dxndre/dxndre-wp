<?php
/**
 * Template Name: Site Stats
 */

defined( 'ABSPATH' ) || exit;

add_action( 'wp_head', static function () {
	?>
	<style>
		body.page-template-page-stats #header {
			background: #fffefa !important;
			color: #141824 !important;
		}
		body.page-template-page-stats #header .navbar-brand img {
			filter: brightness(0);
		}
		body.page-template-page-stats #header :is(.navbar-brand, .dx-menu-label, .dx-nav-location) {
			color: #141824 !important;
		}
		body.page-template-page-stats #header #dx-menu-toggle .navbar-toggler-line {
			background: #141824 !important;
		}
		.dx-site-stats {
			background: #fffefa;
			color: #282a32;
			padding: clamp(8rem, 15vw, 13rem) 1.5rem clamp(4rem, 9vw, 8rem);
		}
		.dx-site-stats__inner { max-width: 68rem; margin-inline: auto; }
		.dx-site-stats h1 {
			color: #141824;
			font-size: clamp(3rem, 9vw, 7rem);
			margin-block: .2em;
		}
		.dx-site-stats .dx-eyebrow { color: #725313; }
		.dx-site-stats dl {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
			gap: 1rem;
			margin-block: 2.5rem;
			padding: 0;
			border: 0;
		}
		.dx-site-stats dl > div { padding: 1.5rem; background: #f4f2eb; border-radius: .5rem; }
		.dx-site-stats dt { color: #62636a; font-size: .8rem; font-weight: 500; }
		.dx-site-stats dd { margin: .6rem 0 0; font-size: 1.7rem; line-height: 1.25; font-weight: 600; }
		body.page-template-page-stats #header .dx-brand-short { color: #141824 !important; }
		body.page-template-page-stats #header .dx-brand-short svg { fill: currentColor; }
		body.page-template-page-stats #header:has(.navbar-collapse.show) .dx-menu-label,
		body.page-template-page-stats #header:has(.navbar-collapse.collapsing) .dx-menu-label { color: #f4efe5 !important; }
		body.page-template-page-stats #header:has(.navbar-collapse.show) #dx-menu-toggle .navbar-toggler-line,
		body.page-template-page-stats #header:has(.navbar-collapse.collapsing) #dx-menu-toggle .navbar-toggler-line { background: #f4efe5 !important; }
		body.page-template-page-stats #header.dx-nav-hidden { transform: none !important; }
		body.page-template-page-stats #header.navbar.scrolled { background: #080808 !important; color: #f4efe5 !important; }
		body.page-template-page-stats #header.navbar.scrolled :is(.navbar-brand, .dx-brand-short, .dx-menu-label, .dx-nav-location) { color: #f4efe5 !important; }
		body.page-template-page-stats #header.navbar.scrolled .navbar-brand img { filter: brightness(0) invert(1); }
		body.page-template-page-stats #header.navbar.scrolled #dx-menu-toggle .navbar-toggler-line { background: #f4efe5 !important; }
		.dx-site-stats figure { margin: 0; }
		.dx-site-stats figure img { display: block; max-width: 100%; height: auto; }
		.dx-site-stats figcaption { margin-top: .9rem; color: #515766; }

 body.page-template-page-stats #header { background:#080b0be8 !important; color:#f4efe5 !important; }
 body.page-template-page-stats #header :is(.navbar-brand,.dx-brand-short,.dx-menu-label,.dx-nav-location) { color:#f4efe5 !important; }
 body.page-template-page-stats #header .navbar-brand img { filter:brightness(0) invert(1); }
 body.page-template-page-stats #header #dx-menu-toggle .navbar-toggler-line { background:#f4efe5 !important; }
 .dx-site-stats { position:relative; isolation:isolate; overflow:clip; background:#080b0b; color:#f4efe5; padding:clamp(8rem,12vw,12rem) 6vw 6rem; }
 .dx-site-stats::before { content:''; position:fixed; z-index:-1; inset:0; pointer-events:none; background:radial-gradient(ellipse at 5% 15%,#6a44914d,transparent 36%),radial-gradient(ellipse at 96% 38%,#257d7b45,transparent 40%),radial-gradient(ellipse at 45% 90%,#a5653845,transparent 42%); }
 .dx-site-stats__inner { max-width:80rem; position:relative; }
 .dx-site-stats__hero { position:sticky; top:6rem; z-index:0; padding:0; min-height:clamp(17rem,32vw,32rem); pointer-events:none; }
 .dx-site-stats .dx-eyebrow { color:#d7ad57; }
 .dx-site-stats h1 { font-family:'Space Grotesk',sans-serif; font-size:clamp(6rem,25vw,30rem); font-weight:400; line-height:.85; letter-spacing:-.085em; text-transform:uppercase; color:#f4efe5; margin:.15em 0 0; transform:translateY(var(--stats-title-shift,0px)); }
 .dx-site-stats h1 span { color:#d7ad57; }
 .dx-site-stats dl { position:relative; z-index:2; margin-top:-8vw; gap:1rem; }
 .dx-site-stats dl>div { background:#162023eb; backdrop-filter:blur(16px); border-radius:0; box-shadow:0 16px 45px #0003; padding:clamp(1.3rem,2.5vw,2rem); min-height:10rem; }
 .dx-site-stats dt { color:#c2c8c5; line-height:1.4; }
 .dx-site-stats dd { color:#f4efe5; font-weight:500; font-variant-numeric:tabular-nums; }
 .dx-site-stats figure { position:relative; z-index:2; margin-top:3rem; }
 .dx-site-stats figcaption { color:#c2c8c5; }
 @media(max-width:575.98px) { .dx-site-stats__hero { top:7rem; min-height:12rem; } .dx-site-stats dl { margin-top:-1rem; grid-template-columns:repeat(2,minmax(0,1fr)); } .dx-site-stats dl>div { padding:1rem; min-height:9rem; } .dx-site-stats dd { font-size:1.4rem; overflow-wrap:anywhere; } }
 @media(prefers-reduced-motion:reduce) { .dx-site-stats h1 { transform:none; } }
	</style>
	<?php
}, 20 );

get_header();

$theme = wp_get_theme();
$updated = filemtime( __FILE__ );
$screenshot = $theme->get_screenshot();
$metadata_path = get_theme_file_path( '/build/site-stats.json' );
$metadata = is_readable( $metadata_path ) ? json_decode( file_get_contents( $metadata_path ), true ) : array();
$site_counts = array(
	'Published pages' => (int) wp_count_posts( 'page' )->publish,
	'Published projects' => (int) wp_count_posts( 'project' )->publish,
	'Gym reviews' => (int) wp_count_posts( 'gym-review' )->publish,
);
foreach ( array( 'bus-diary-entry' => 'Bus journeys documented', 'bus' => 'Bus models explored', 'concept' => 'Design concepts', 'dx_bus_poll' => 'Questions for the community' ) as $type => $label ) {
	if ( post_type_exists( $type ) ) { $site_counts[ $label ] = (int) wp_count_posts( $type )->publish; }
}
if ( function_exists( 'dx_pulse_stats' ) ) { $site_counts['Community poll responses'] = dx_pulse_stats()['total']; }
if ( isset( $metadata['commits'] ) && is_int( $metadata['commits'] ) ) {
	$site_counts['Theme commits at last build'] = $metadata['commits'];
}

?>
<section class="dx-site-stats" aria-labelledby="dx-site-stats-title">
	<div class="dx-site-stats__inner">
		<header class="dx-site-stats__hero"><p class="dx-eyebrow">DXNDRE.CO.UK / By the numbers</p>
		<h1 id="dx-site-stats-title">Stats<span aria-hidden="true">.</span></h1></header>
		<dl>
			<div>
				<dt>Theme version</dt>
				<dd><?php echo esc_html( $theme->get( 'Version' ) ); ?></dd>
			</div>
			<?php if ( $updated ) : ?>
				<div>
					<dt>Stats page last updated</dt>
					<dd><time datetime="<?php echo esc_attr( wp_date( 'Y-m-d', $updated ) ); ?>"><?php echo esc_html( wp_date( 'j F Y', $updated ) ); ?></time></dd>
				</div>
			<?php endif; ?>
			<?php foreach ( $site_counts as $label => $count ) : ?>
				<div><dt><?php echo esc_html( $label ); ?></dt><dd data-stat-count="<?php echo esc_attr($count); ?>" aria-label="<?php echo esc_attr(number_format_i18n($count)); ?>"><span aria-hidden="true"><?php echo esc_html( number_format_i18n( $count ) ); ?></span></dd></div>
			<?php endforeach; ?>
			<?php if ( ! empty( $metadata['builtAt'] ) ) : ?>
				<div><dt>Assets last built</dt><dd><time datetime="<?php echo esc_attr( $metadata['builtAt'] ); ?>"><?php echo esc_html( wp_date( 'j F Y', strtotime( $metadata['builtAt'] ) ) ); ?></time></dd></div>
			<?php endif; ?>
		</dl>
		<?php if ( $screenshot ) : ?>
			<figure>
				<img src="<?php echo esc_url( $screenshot ); ?>" alt="Preview of the DXNDRE WordPress theme">
				<figcaption>WordPress theme screenshot</figcaption>
			</figure>
		<?php endif; ?>
	</div>
</section>
<?php get_footer(); ?>
