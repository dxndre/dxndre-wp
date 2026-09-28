<?php get_header(); ?>

<?php
	$bus_model          = get_field('bus_model');
	$manufacturer       = get_field('manufacturer');
	$operator           = get_field('operator');
	$fleet_number       = get_field('fleet_number');
	$registration       = get_field('registration');
	$year               = get_field('year');
	$capacity           = get_field('capacity');
	$engine_type        = get_field('engine_type');
	$body_type          = get_field('body_type');
	$chassis            = get_field('chassis');
	$rarity             = get_field('rarity');
	$status             = get_field('status');
	$top_speed          = get_field('top_speed');
	$power_output       = get_field('power_output');
	$comfort_rating     = get_field('comfort_rating');
	$performance_rating = get_field('performance_rating');
	$bus_gallery        = get_field('bus_gallery');
?>

<main class="bus-spec-single">

	<section class="bus-spec-hero">
		<div class="bus-spec-hero__media">
			<?php if (has_post_thumbnail()) : ?>
				<?php the_post_thumbnail('full'); ?>
			<?php elseif (!empty($bus_gallery)) : ?>
				<?php echo wp_get_attachment_image($bus_gallery[0]['ID'], 'full'); ?>
			<?php endif; ?>
		</div>

		<div class="bus-spec-hero__content">
			<p class="bus-spec-hero__eyebrow">
				<?php echo esc_html($manufacturer); ?><?php echo $year ? ' · ' . esc_html($year) : ''; ?>
			</p>

			<h1 class="bus-spec-hero__title">
				<?php echo esc_html($bus_model ?: get_the_title()); ?>
			</h1>

			<div class="bus-spec-hero__meta">
				<?php if ($operator) : ?>
					<span><?php echo esc_html($operator); ?></span>
				<?php endif; ?>

				<?php if ($fleet_number) : ?>
					<span>Fleet <?php echo esc_html($fleet_number); ?></span>
				<?php endif; ?>

				<?php if ($registration) : ?>
					<span><?php echo esc_html($registration); ?></span>
				<?php endif; ?>
			</div>

			<div class="bus-spec-hero__stats">
				<?php if ($capacity) : ?>
					<div>
						<span><?php echo esc_html($capacity); ?></span>
						<small>Capacity</small>
					</div>
				<?php endif; ?>

				<?php if ($top_speed) : ?>
					<div>
						<span><?php echo esc_html($top_speed); ?> mph</span>
						<small>Top Speed</small>
					</div>
				<?php endif; ?>

				<?php if ($power_output) : ?>
					<div>
						<span><?php echo esc_html($power_output); ?></span>
						<small>Power Output</small>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</section>

	<section class="bus-spec-overview">
		<div class="bus-spec-overview__inner">
			<h2>Overview</h2>
			<?php the_content(); ?>
		</div>
	</section>

	<section class="bus-spec-grid">
		<div class="bus-spec-grid__heading">
			<p>Specification Sheet</p>
			<h2>Technical Details</h2>
		</div>

		<div class="bus-spec-grid__items">
			<?php
				$specs = [
					'Manufacturer'       => $manufacturer,
					'Operator'           => $operator,
					'Fleet Number'       => $fleet_number,
					'Registration'       => $registration,
					'Year'               => $year,
					'Capacity'           => $capacity,
					'Engine Type'        => $engine_type,
					'Body Type'          => $body_type,
					'Chassis'            => $chassis,
					'Rarity'             => $rarity,
					'Status'             => $status,
					'Top Speed'          => $top_speed ? $top_speed . ' mph' : '',
					'Power Output'       => $power_output,
					'Comfort Rating'     => $comfort_rating ? $comfort_rating . '/10' : '',
					'Performance Rating' => $performance_rating ? $performance_rating . '/10' : '',
				];

				foreach ($specs as $label => $value) :
					if (!$value) {
						continue;
					}
			?>
				<div class="bus-spec-card">
					<span><?php echo esc_html($label); ?></span>
					<strong><?php echo esc_html($value); ?></strong>
				</div>
			<?php endforeach; ?>
		</div>
	</section>

	<?php if (!empty($bus_gallery)) : ?>
		<section class="bus-spec-gallery">
			<div class="bus-spec-gallery__heading">
				<p>Gallery</p>
				<h2>Details & Angles</h2>
			</div>

			<div class="bus-spec-gallery__grid">
				<?php foreach ($bus_gallery as $image) : ?>
					<figure>
						<?php echo wp_get_attachment_image($image['ID'], 'large'); ?>
					</figure>
				<?php endforeach; ?>
			</div>
		</section>
	<?php endif; ?>

</main>

<?php get_footer(); ?>