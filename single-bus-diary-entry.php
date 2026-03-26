<?php
get_header();

while (have_posts()) : the_post();

	$primary_route = get_field('primary_route');
	$operator      = get_field('operator');

	$spotify_url   = get_field('spotify_url');

	$spotify_embed_url = '';

	if ($spotify_url) {
		if (strpos($spotify_url, 'open.spotify.com/embed/') !== false) {
			$spotify_embed_url = $spotify_url;
		} elseif (preg_match('#open\.spotify\.com/track/([a-zA-Z0-9]+)#', $spotify_url, $matches)) {
			$spotify_embed_url = 'https://open.spotify.com/embed/track/' . $matches[1];
		}
	}

	$mood = get_field('mood_label');

	$mood_label    = get_field('mood_label');
	$time_of_day   = get_field('time_of_day');

	$start_name    = get_field('journey_start_name');
	$end_name      = get_field('journey_end_name');

	$journey_date  = get_the_date('F Y');

	$operator_labels = [
		'metroline'    => 'Metroline',
		'go-ahead'     => 'Go-Ahead London',
		'first'        => 'First Bus',
		'stagecoach'   => 'Stagecoach',
		'uno'          => 'Uno',
		'arriva'       => 'Arriva London',
		'transport-uk' => 'Transport UK',
		'falcon'       => 'Falcon Coaches',
	];

	$operator_label = $operator_labels[$operator] ?? $operator;
	$route_title    = $primary_route ? 'Route ' . $primary_route : get_the_title();

	$start_lat = get_field('journey_start_lat');
	$start_lng = get_field('journey_start_lng');
	$end_lat   = get_field('journey_end_lat');
	$end_lng   = get_field('journey_end_lng');
?>

<section class="bus-diary-entry viewport-active">
	<div class="wp-block-cover bus-diary-entry__hero hero-background" style="min-height:100vh;">
		<?php if (has_post_thumbnail()) : ?>
			<?php the_post_thumbnail('full', [
				'class' => 'wp-block-cover__image-background',
				'data-object-fit' => 'cover'
			]); ?>
		<?php endif; ?>

		<span aria-hidden="true" class="wp-block-cover__background has-black-background-color has-background-dim-70 has-background-dim"></span>

		<div class="wp-block-cover__inner-container is-layout-constrained">
			<div class="wp-block-group container">
				<div class="bus-diary-entry__hero-inner">
					<pre class="headline">Bus Diary</pre>
					<h1><?php echo esc_html($route_title); ?></h1>

					<div class="bus-diary-entry__hero-subtitle">
						<?php if ($operator_label) : ?>
							<span><?php echo esc_html($operator_label); ?></span>
						<?php endif; ?>

						<?php if ($time_of_day) : ?>
							<span>•</span>
							<span><?php echo esc_html($time_of_day); ?></span>
						<?php endif; ?>

						<?php if ($start_name || $end_name) : ?>
							<span>•</span>
							<span><?php echo esc_html(trim(($start_name ?: 'Unknown') . ' → ' . ($end_name ?: 'Unknown'))); ?></span>
						<?php endif; ?>
					</div>

					<?php if (get_the_excerpt()) : ?>
						<p class="bus-diary-entry__excerpt"><?php echo esc_html(get_the_excerpt()); ?></p>
					<?php endif; ?>

					<div class="bus-diary-entry__hero-actions">
						<?php if ($spotify_url) : ?>
							<a class="btn btn-light" href="<?php echo esc_url($spotify_url); ?>" target="_blank" rel="noopener noreferrer">
								Open Soundtrack
							</a>
						<?php endif; ?>

						<a class="btn btn-outline-light" href="#bus-stage">
							View Journey Experience
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="wp-block-group bus-diary-entry__content">
		<div class="wp-block-group container">


			<div class="bus-stage" id="bus-stage">

				<div class="bus-stage__view is-active" data-view="map">
					<div class="bus-panel bus-panel--map" id="bus-diary-map">
						<pre class="headline">Map Layer</pre>
						<h2>Journey Map</h2>

						<div
							class="bus-map"
							data-bus-map
							data-route="<?php echo esc_attr($primary_route); ?>"
							data-start-name="<?php echo esc_attr($start_name); ?>"
							data-start-lat="<?php echo esc_attr($start_lat); ?>"
							data-start-lng="<?php echo esc_attr($start_lng); ?>"
							data-end-name="<?php echo esc_attr($end_name); ?>"
							data-end-lat="<?php echo esc_attr($end_lat); ?>"
							data-end-lng="<?php echo esc_attr($end_lng); ?>"
						></div>

						<div class="bus-map-meta">
							<?php if ($start_name) : ?>
								<span><strong>Start:</strong> <?php echo esc_html($start_name); ?></span>
							<?php endif; ?>

							<?php if ($end_name) : ?>
								<span><strong>End:</strong> <?php echo esc_html($end_name); ?></span>
							<?php endif; ?>
						</div>
					</div>
				</div>

				<div class="bus-stage__view" data-view="story">
					<div class="bus-panel bus-panel--story">
						<pre class="headline">The Journey</pre>
						<h2>Storyline</h2>

						<div class="bus-diary-entry__body">
							<?php the_content(); ?>
						</div>
					</div>
				</div>

				<?php if ($spotify_embed_url) : ?>
					<div class="bus-stage__view" data-view="mood">
						<div class="bus-panel bus-panel--mood">
							<pre class="headline">Mood Layer</pre>
							<h2>Soundtrack</h2>

							<?php if ($mood_label) : ?>
								<div class="bus-badge-row">
									<span class="bus-badge"><?php echo esc_html($mood_label); ?></span>
								</div>
							<?php endif; ?>

							<div class="bus-spotify-mini">
								<iframe
									style="border-radius:12px"
									src="<?php echo esc_url($spotify_embed_url); ?>"
									width="100%"
									height="152"
									frameborder="0"
									allowfullscreen=""
									allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
									loading="lazy">
								</iframe>
							</div>
						</div>
					</div>
				<?php endif; ?>

			</div>

		</div>
	</div>

	<div class="bus-dock" data-bus-dock>

		<div class="bus-dock__stats">
			<span class="stat">
				<?php echo esc_html($primary_route); ?>
			</span>

			<span class="stat">
				<?php echo esc_html($operator_label); ?>
			</span>

			<span class="stat">
				<?php echo esc_html($time_of_day); ?>
			</span>

			<?php if ($mood) : ?>
				<span class="stat">🎧 <?php echo esc_html($mood); ?></span>
			<?php endif; ?>
		</div>

		<div class="bus-dock__controls">
			<button class="is-active" data-view-toggle="map">🗺</button>
			<button data-view-toggle="story">📖</button>
			<?php if ($spotify_embed_url) : ?>
				<button data-view-toggle="mood">🎧</button>
			<?php endif; ?>
		</div>

	</div>
</section>

<?php
endwhile;

get_footer();