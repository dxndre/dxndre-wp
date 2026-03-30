<?php
get_header();

while (have_posts()) : the_post();

	$primary_route = get_field('primary_route');
	$operator      = get_field('operator');
	$spotify_url   = get_field('spotify_url');
	$mood_label    = get_field('mood_label');
	$time_of_day   = get_field('time_of_day');

	$start_name    = get_field('journey_start_name');
	$end_name      = get_field('journey_end_name');

	$start_lat = get_field('journey_start_lat');
	$start_lng = get_field('journey_start_lng');
	$end_lat   = get_field('journey_end_lat');
	$end_lng   = get_field('journey_end_lng');

	$journey_date  = get_the_date('F Y');
	$featured_image_url = get_the_post_thumbnail_url(get_the_ID(), 'full');

	$spotify_embed_url = '';

	if ($spotify_url) {
		if (strpos($spotify_url, 'open.spotify.com/embed/') !== false) {
			$spotify_embed_url = $spotify_url;
		} elseif (preg_match('#open\.spotify\.com/track/([a-zA-Z0-9]+)#', $spotify_url, $matches)) {
			$spotify_embed_url = 'https://open.spotify.com/embed/track/' . $matches[1];
		}
	}

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
?>

<section class="bus-diary-entry viewport-active">
	<div class="wp-block-cover bus-diary-entry__hero hero-background" style="min-height:55vh;">
		<div class="overlay">
			<?php if (has_post_thumbnail()) : ?>
				<?php the_post_thumbnail('full', [
					'class' => 'wp-block-cover__image-background',
					'data-object-fit' => 'cover'
				]); ?>
			<?php endif; ?>
		</div>

		<span aria-hidden="true" class="wp-block-cover__background"></span>

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

					<div class="wp-block-buttons is-layout-flex wp-block-buttons-is-layout-flex bus-diary-entry__hero-actions">
						<div class="wp-block-button primary">
							<a class="wp-block-button__link wp-element-button" href="#bus-stage">
								View Journey Experience
							</a>
						</div>

						<?php if ($spotify_url) : ?>
							<div class="wp-block-button quaternary">
								<a class="wp-block-button__link wp-element-button"
								   href="<?php echo esc_url($spotify_url); ?>"
								   target="_blank"
								   rel="noopener noreferrer">
									<i class="fa-brands fa-spotify"></i> Open Soundtrack
								</a>
							</div>
						<?php endif; ?>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="wp-block-group bus-diary-entry__content">
		<div class="wp-block-group">
			<div class="bus-diary-entry__map-stage" id="bus-stage">
				<div class="bus-panel bus-panel--map bus-panel--map-primary">
					<div class="bus-panel__topbar">
						<div>
							<pre class="headline">Map Layer</pre>
							<h2>Journey Map</h2>
						</div>

						<div class="bus-panel__route-meta">
							<?php if ($primary_route) : ?>
								<span class="bus-pill"><?php echo esc_html($primary_route); ?></span>
							<?php endif; ?>

							<?php if ($operator_label) : ?>
								<span class="bus-pill"><?php echo esc_html($operator_label); ?></span>
							<?php endif; ?>
						</div>
					</div>

					<div class="bus-map-shell">
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

						<div class="bus-map-stage-ui">
							<div class="bus-floating-pane">
								<div class="bus-pane-stage" data-bus-pane-stage>
									<div class="bus-pane-view is-active" data-pane-view="map">
										<?php if ($featured_image_url) : ?>
											<div class="bus-diary-entry__split-image">
												<img src="<?php echo esc_url($featured_image_url); ?>" alt="<?php echo esc_attr($route_title); ?>" />
											</div>
										<?php else : ?>
											<div class="bus-diary-entry__split-image bus-diary-entry__split-image--empty">
												<span>No featured image added yet.</span>
											</div>
										<?php endif; ?>
									</div>

									<div class="bus-pane-view" data-pane-view="story">
										<div class="bus-panel bus-panel--story">
											<pre class="headline">Story Layer</pre>
											<h2>Journey Story</h2>
											<div class="bus-diary-entry__body">
												<?php the_content(); ?>
											</div>
										</div>
									</div>

									<div class="bus-pane-view" data-pane-view="departures">
										<div class="bus-panel bus-panel--departures">
											<pre class="headline">Live Layer</pre>
											<h2>Departures Near You</h2>
											<div class="bus-departures" data-bus-departures>
												<div class="bus-departures__actions">
													<button type="button" class="bus-departures__locate" data-bus-locate>Use My Location</button>
													<div class="bus-departures__status" data-bus-status>Tap the button to find nearby stops.</div>
												</div>
												<div class="bus-departures__grid">
													<div class="bus-departures__stops" data-bus-stops></div>
													<div class="bus-departures__results" data-bus-results></div>
												</div>
											</div>
										</div>
									</div>

									<?php if ($spotify_embed_url) : ?>
										<div class="bus-pane-view" data-pane-view="mood">
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
														height="352"
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

							<div class="bus-map-overlay-card">
								<span class="eyebrow">Journey Summary</span>
								<h3><?php echo esc_html($route_title); ?></h3>

								<ul class="bus-map-overlay-list">
									<li>
										<span>Start</span>
										<strong><?php echo esc_html($start_name ?: 'Unknown'); ?></strong>
									</li>
									<li>
										<span>End</span>
										<strong><?php echo esc_html($end_name ?: 'Unknown'); ?></strong>
									</li>
									<li>
										<span>Time</span>
										<strong><?php echo esc_html($time_of_day ?: '—'); ?></strong>
									</li>
									<li>
										<span>Mood</span>
										<strong><?php echo esc_html($mood_label ?: '—'); ?></strong>
									</li>
								</ul>
							</div>

							<div class="bus-dock" data-bus-dock>
								<div class="bus-dock__stats">
									<?php if ($primary_route) : ?><span class="stat"><?php echo esc_html($primary_route); ?></span><?php endif; ?>
									<?php if ($operator_label) : ?><span class="stat"><?php echo esc_html($operator_label); ?></span><?php endif; ?>
									<?php if ($time_of_day) : ?><span class="stat"><?php echo esc_html($time_of_day); ?></span><?php endif; ?>
									<?php if ($mood_label) : ?><span class="stat">🎧 <?php echo esc_html($mood_label); ?></span><?php endif; ?>
								</div>

								<div class="bus-dock__controls">
									<button class="is-active" data-view-toggle="map" aria-label="Map view">🗺</button>
									<button data-view-toggle="story" aria-label="Story view">📖</button>
									<button data-view-toggle="departures" aria-label="Departures view">🚌</button>
									<?php if ($spotify_embed_url) : ?>
										<button data-view-toggle="mood" aria-label="Mood view">🎧</button>
									<?php endif; ?>
								</div>
							</div>
						</div>
					</div>

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
		</div>
	</div>
</section>

<?php
endwhile;

get_footer();