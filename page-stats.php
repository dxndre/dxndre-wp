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
if ( isset( $metadata['commits'] ) && is_int( $metadata['commits'] ) ) {
	$site_counts['Theme commits at last build'] = $metadata['commits'];
}

?>
<section class="dx-site-stats" aria-labelledby="dx-site-stats-title">
	<div class="dx-site-stats__inner">
		<p class="dx-eyebrow">DXNDRE.CO.UK</p>
		<h1 id="dx-site-stats-title">Stats</h1>
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
				<div><dt><?php echo esc_html( $label ); ?></dt><dd><?php echo esc_html( number_format_i18n( $count ) ); ?></dd></div>
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
