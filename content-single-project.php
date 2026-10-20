<?php
/**
 * The template for displaying content in the single.php template.
 */

?>

<div class="story-backgrounds"><div class="bg is-active" data-bg="chapter-1"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" aria-hidden="true" preserveAspectRatio="none"><defs><radialGradient id="chapter-glow-0" cx="80%" cy="35%" r="85%"><stop stop-color="#29231a"/><stop offset="1" stop-color="#070909"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#chapter-glow-0)"/></svg></div><div class="bg" data-bg="chapter-2"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" aria-hidden="true" preserveAspectRatio="none"><defs><radialGradient id="chapter-glow-1" cx="80%" cy="35%" r="85%"><stop stop-color="#38515d"/><stop offset="1" stop-color="#101a24"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#chapter-glow-1)"/></svg></div><div class="bg" data-bg="chapter-3"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" aria-hidden="true" preserveAspectRatio="none"><defs><radialGradient id="chapter-glow-2" cx="80%" cy="35%" r="85%"><stop stop-color="#664331"/><stop offset="1" stop-color="#191014"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#chapter-glow-2)"/></svg></div><div class="bg" data-bg="chapter-4"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" aria-hidden="true" preserveAspectRatio="none"><defs><radialGradient id="chapter-glow-3" cx="80%" cy="35%" r="85%"><stop stop-color="#33564e"/><stop offset="1" stop-color="#081a17"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#chapter-glow-3)"/></svg></div></div>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<section class="story-hero">
        <?php $hero_image = get_field('header_image');
        if (!empty($hero_image['ID'])) echo wp_get_attachment_image($hero_image['ID'], 'full', false, ['class' => 'dx-project-hero-background', 'alt' => '', 'aria-hidden' => 'true', 'loading' => 'eager', 'fetchpriority' => 'high']); ?>
		<div class="container">
			<header class="entry-header">
				<div class="header-content">

					<a class="back" href="/portfolio/">
						<i class="fa-solid fa-arrow-left"></i>
						<span>Portfolio / All Projects</span>
					</a>

					<pre class="headline">Case Study</pre>

					<h1 class="entry-title">
						<?php the_title(); ?>
					</h1>

					<?php if ( has_excerpt() ) : ?>
						<p class="excerpt">
							<?php echo esc_html( get_the_excerpt() ); ?>
						</p>
					<?php endif; ?>

					<?php
						$site_link = get_field('site_link');
						$services  = get_field('project_type');
						$header_image = get_field('header_image');
						$site_link   = get_field('site_link');
						$site_status = get_field('site_status'); // live | coming_soon | private
					?>

					<?php if ( $site_link && $site_status === 'live' ) : ?>

					<a
						class="visit"
						href="<?php echo esc_url( $site_link ); ?>"
						target="_blank"
						rel="noopener noreferrer"
					>
						View Live Project <i class="fa-solid fa-arrow-up-right-from-square"></i>
					</a>

					<?php elseif ( $site_status === 'private' ) : ?>

					<span class="visit disabled">
						Private project <i class="fa-solid fa-lock"></i>
					</span>

					<?php else : ?>

					<span class="visit disabled">
						Link coming soon <i class="fa-regular fa-clock"></i>
					</span>

					<?php endif; ?>

					<a href="#chapter-1" class="dx-read-study" data-read-study>Read the story <span aria-hidden="true">↓</span></a>
					<?php if ( ! empty( $services ) && is_array( $services ) ) : ?>
						<ul class="project-services">
							<?php foreach ( $services as $service ) : ?>
								<li><?php echo esc_html( $service ); ?></li>
							<?php endforeach; ?>
						</ul>
					<?php endif; ?>

				</div>

			</header>
		</div>
	</section>

	<div class="entry-content">
		<?php

		the_content();

		wp_link_pages(
			array(
				'before' => '<div class="page-link"><span>' . esc_html__( 'Pages:', 'dxndre' ) . '</span>',
				'after'  => '</div>',
			)
		);
		?>
	</div><!-- /.entry-content -->

	<?php
		edit_post_link( __( 'Edit', 'dxndre' ), '<span class="edit-link">', '</span>' );
	?>
<section class="dx-related-projects"><p class="headline">Keep exploring</p><h2>More selected work.</h2><div><?php $related=get_posts(['post_type'=>'project','post_status'=>'publish','numberposts'=>2,'post__not_in'=>[get_the_ID()]]); foreach($related as $project): $image=get_field('header_image',$project->ID); ?><a href="<?php echo esc_url(get_permalink($project)); ?>"><?php if(!empty($image['ID']))echo wp_get_attachment_image($image['ID'],'large');else echo get_the_post_thumbnail($project,'large'); ?><h3><?php echo esc_html($project->post_title); ?> ↗</h3><p><?php echo esc_html(wp_trim_words($project->post_excerpt,22)); ?></p></a><?php endforeach; ?></div></section>
<section class="dx-editorial-contact"><p class="dx-eyebrow">Your idea. Our next chapter.</p><h2>Let’s make<br><em>something matter.</em></h2><a class="dx-cta" href="/contact/">Start a conversation ↗</a></section></article><!-- /#post-<?php the_ID(); ?> -->

<nav class="chapter-selector" aria-label="Case study chapters">
	<ul>
	</ul>
</nav>