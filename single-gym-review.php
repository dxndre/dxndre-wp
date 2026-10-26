<?php
/**
 * Single Gym Review
 *
 * @package dxndre
 */

get_header();

while ( have_posts() ) :
	the_post();

	$post_id = get_the_ID();


	// ============================================================
	// HELPERS
	// ============================================================

	/**
	 * Return the human-readable ACF select label rather than its value.
	 */
	$get_select_label = static function ( $field_name, $post_id ) {

		$value = get_field( $field_name, $post_id );

		if ( $value === null || $value === '' ) {
			return '';
		}

		$field = get_field_object( $field_name, $post_id );

		if (
			$field &&
			isset( $field['choices'] ) &&
			isset( $field['choices'][ $value ] )
		) {
			return $field['choices'][ $value ];
		}

		return $value;
	};


	/**
	 * Keep review photography on its largest available uploaded source.
	 * WordPress can regenerate srcset even when false is passed to its image helper.
	 */
	$get_review_image = static function ( $attachment_id ) {
		$full = wp_get_attachment_image_src( $attachment_id, 'full' );
		$image = [
			'url'    => $full ? $full[0] : '',
			'width'  => $full ? (int) $full[1] : 0,
			'height' => $full ? (int) $full[2] : 0,
			'alt'    => get_post_meta( $attachment_id, '_wp_attachment_image_alt', true ),
		];
		$original_path = wp_get_original_image_path( $attachment_id );
		if ( $original_path && is_readable( $original_path ) ) {
			$dimensions = wp_getimagesize( $original_path );
			$original_meta = function_exists( 'exif_read_data' ) ? @exif_read_data( $original_path ) : [];
			if ( $dimensions && in_array( (int) ( $original_meta['Orientation'] ?? 0 ), [ 5, 6, 7, 8 ], true ) ) {
				[ $dimensions[0], $dimensions[1] ] = [ $dimensions[1], $dimensions[0] ];
			}
			$original_url = wp_get_original_image_url( $attachment_id );
			if ( $dimensions && $original_url && $dimensions[0] * $dimensions[1] >= $image['width'] * $image['height'] ) {
				$image['url'] = $original_url;
				$image['width'] = (int) $dimensions[0];
				$image['height'] = (int) $dimensions[1];
			}
		}
		return $image;
	};


	/**
	 * Determine whether an ACF score is valid.
	 */
	$is_valid_score = static function ( $score ) {

		return (
			$score !== null &&
			$score !== '' &&
			$score !== 'unavailable' &&
			is_numeric( $score )
		);
	};


	// ============================================================
	// EXISTING ACF FIELDS
	// ============================================================

	$chain_value = get_field( 'gym_chain', $post_id );
	$chain       = $get_select_label( 'gym_chain', $post_id );

	$visited_date_raw = get_field( 'visited_date', $post_id );

	$visit_type_value = get_field( 'visit_type', $post_id );
	$visit_type       = $get_select_label( 'visit_type', $post_id );

	$notes           = get_field( 'notes', $post_id );
	$location        = get_field( 'gym_location', $post_id );
	$google_maps_url = get_field( 'google_maps_url', $post_id );
	$map_details = dx_gym_map_embed( $google_maps_url );


	// ============================================================
	// VISITED DATE
	// ============================================================

	$visited_date = '';

	if ( $visited_date_raw ) {

		$date = DateTime::createFromFormat(
			'Y-m-d',
			$visited_date_raw
		);

		if ( $date ) {
			$visited_date = $date->format( 'F Y' );
		}
	}


	// ============================================================
	// SCORES
	// ============================================================

	$score_fields = [

		'gym' => [
			'label' => 'Gym',
			'value' => get_field( 'score_gym', $post_id ),
		],

		'swim' => [
			'label' => 'Swimming',
			'value' => get_field( 'score_swim', $post_id ),
		],

		'spa' => [
			'label' => $chain_value === 'gymbox' ? 'Sauna Facilities' : 'Spa Retreat',
			'value' => get_field( 'score_spa', $post_id ),
		],

		'cafe' => [
			'label' => $chain_value === 'davidlloyds' ? 'Clubroom' : 'Café & Work Area',
			'value' => get_field( 'score_cafe', $post_id ),
		],

		'cleanliness' => [
			'label' => 'Cleanliness & Maintenance',
			'value' => get_field( 'cleanliness_maintenance', $post_id ),
		],

		'parking' => [
			'label' => 'Parking',
			'value' => get_field( 'parking', $post_id ),
		],

	];


	// ============================================================
	// VALID SCORES / OVERALL
	// ============================================================

	$valid_scores = [];

	foreach ( $score_fields as $key => &$score ) {
		$score['value'] = dx_normalise_facility_score( $score['value'] );
		if ( $is_valid_score( $score['value'] ) ) {
			$valid_scores[ $key === 'cleanliness' ? 'clean' : $key ] = (float) $score['value'];
		}
	}
	unset( $score );

	// Use the league calculation, including its rounding and category weights.
	$weighted_score = dx_calc_overall_score( $valid_scores );
	$overall_score = $weighted_score !== null ? round( $weighted_score * 10, 1 ) : null;
	$score_label = '';
	$score_color = 'inherit';
	$overall_bands = [
		[ 85, 'Outstanding', '#b9eaff' ],
		[ 71, 'Excellent', '#6ed9c5' ],
		[ 57, 'Positive', '#82c995' ],
		[ 43, 'Mixed', '#e5a653' ],
		[ 29, 'Poor', '#ef8585' ],
		[ 15, 'Bad', '#d85b70' ],
		[ 0, 'Diabolical', '#8c354b' ],
	];

	// One threshold map supplies both the weighted rating and each category.
	$get_score_band = static function ( $percentage ) use ( $overall_bands ) {
		if ( ! is_numeric( $percentage ) || $percentage < 0 || $percentage > 100 ) {
			return null;
		}
		foreach ( $overall_bands as [ $minimum, $label, $color ] ) {
			if ( $percentage >= $minimum ) {
				return [ 'label' => $label, 'color' => $color ];
			}
		}
		return null;
	};
	$overall_band = $get_score_band( $overall_score );
	if ( $overall_band ) {
		$score_label = $overall_band['label'];
		$score_color = $overall_band['color'];
	}


	// ============================================================
	// AUTO FACILITIES
	//
	// These use the score fields you already have.
	// If a category is marked "unavailable", it is displayed as
	// unavailable without needing another ACF repeater.
	// ============================================================

	$facilities = [];
	foreach ( $score_fields as $key => $score ) {
		if ( $key === 'cleanliness' ) continue;
		$status = dx_gym_facility_availability( $score['value'] );
		$facilities[] = [
			'name' => $score['label'],
			'status' => $status,
			'notice' => $status === 'unavailable' ? 'Unavailable' : ( $status === 'unknown' ? 'Not assessed' : '' ),
		];
	}


?>


<article <?php post_class( 'gym-review-single gym-review-editorial' ); ?>>
	<div class="gym-review-canvas" aria-hidden="true">
		<div class="gym-review-canvas__layer is-active" data-gym-canvas="ink"></div>
		<div class="gym-review-canvas__layer" data-gym-canvas="brass"></div>
		<div class="gym-review-canvas__layer" data-gym-canvas="sage"></div>
	</div>


	<!-- =========================================================
	HERO
	========================================================= -->

	<section class="gym-review-hero" data-gym-scene="ink">

		<?php if ( has_post_thumbnail() ) : ?>

			<div class="gym-review-hero__media">

				<?php
				$hero_image = $get_review_image( get_post_thumbnail_id() );
				?>
				<img
					class="gym-review-hero__image attachment-full size-full wp-post-image"
					src="<?php echo esc_url( $hero_image['url'] ); ?>"
					width="<?php echo esc_attr( $hero_image['width'] ); ?>"
					height="<?php echo esc_attr( $hero_image['height'] ); ?>"
					alt="<?php echo esc_attr( $hero_image['alt'] ); ?>"
					loading="eager"
					decoding="async"
					fetchpriority="high"
				>

			</div>

		<?php endif; ?>


		<div class="gym-review-hero__overlay"></div>


			<div class="container gym-review-hero__content">

			<?php
			$reviews_url = get_post_type_archive_link( 'gym-review' );

			if ( ! $reviews_url ) {
				$reviews_url = home_url( '/fitness/#gym-table' );
			}
			?>

			<a
				href="<?php echo esc_url( $reviews_url ); ?>"
				class="gym-review-back"
			>
				<span class="gym-review-back__arrow" aria-hidden="true">←</span>
				<span>All Reviews</span>
			</a>


			<div class="gym-review-hero__eyebrow">

				<span>
					Gym Review
				</span>

				<?php if ( $chain ) : ?>

					<strong>
						<?php echo esc_html( $chain ); ?>
					</strong>

				<?php endif; ?>

			</div>


			<h1 class="gym-review-hero__title">
				<?php the_title(); ?>
			</h1>


			<?php if ( $location ) : ?>

				<div class="gym-review-hero__location">

					<span aria-hidden="true">
						●
					</span>

					<?php echo esc_html( $location ); ?>

				</div>

			<?php endif; ?>


			<?php if ( $overall_score !== null ) : ?>

				<div class="gym-review-rating">

					<strong
						class="gym-review-rating__number"
						style="color: <?php echo esc_attr( $score_color ); ?>"
					data-overall-score="<?php echo esc_attr( $overall_score ); ?>"
					>
						<?php
						echo esc_html(
							number_format(
								$overall_score,
								1
							)
						);
						?>%
					</strong>


					<span
						class="gym-review-rating__status"
						style="color: <?php echo esc_attr( $score_color ); ?>"
					data-score-label-source="<?php echo esc_attr( $overall_score ); ?>"
					>
						<?php echo esc_html( $score_label ); ?>
					</span>

				</div>

			<?php endif; ?>


			<?php $review_badges = dx_gym_review_badges( $valid_scores, $weighted_score, $chain_value ); ?>
			<?php if ( $review_badges ) : ?>
				<div class="gym-review-badges">
					<?php foreach ( $review_badges as $badge ) : ?>
						<span class="gym-review-badge" data-badge="<?php echo esc_attr( $badge['key'] ); ?>" title="<?php echo esc_attr( $badge['criterion'] ); ?>"><?php echo esc_html( $badge['label'] ); ?></span>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>

		</div>

	</section>



	<!-- =========================================================
	QUICK FACTS
	========================================================= -->

	<section class="gym-review-facts" data-gym-scene="ink">

		<div class="container">

			<div class="gym-review-facts__grid">


				<div class="gym-review-fact">

					<span>
						Chain
					</span>

					<strong>
						<?php echo esc_html( $chain ?: '—' ); ?>
					</strong>

				</div>


				<div class="gym-review-fact">

					<span>
						Visit Type
					</span>

					<strong>
						<?php echo esc_html( $visit_type ?: '—' ); ?>
					</strong>

				</div>


				<div class="gym-review-fact">

					<span>
						Visited
					</span>

					<strong>
						<?php echo esc_html( $visited_date ?: '—' ); ?>
					</strong>

				</div>


				<div class="gym-review-fact">

					<span>
						Location
					</span>

					<strong>
						<?php echo esc_html( $location ?: '—' ); ?>
					</strong>

				</div>


				<div class="gym-review-fact">

					<span>
						Overall Rating
					</span>

					<strong style="color: <?php echo esc_attr( $score_color ); ?>">

						<?php if ( $overall_score !== null ) : ?>

							<?php
							echo esc_html(
								number_format(
									$overall_score,
									1
								)
							);
							?>%

						<?php else : ?>

							—

						<?php endif; ?>

					</strong>

				</div>


			</div>

		</div>

	</section>



	<!-- =========================================================
	VERDICT + LOCATION
	========================================================= -->

	<section class="gym-review-overview" data-gym-scene="ink">

		<div class="container">

			<div class="gym-review-overview__grid">


				<div class="gym-review-verdict">

					<span class="gym-review-kicker">01 / The verdict</span>
					<h2 class="gym-review-editorial-title">First impressions.<br>Lasting thoughts.</h2>


					<?php if ( $notes ) : ?>

						<div class="gym-review-verdict__lead">

							<?php
							echo wp_kses_post(
								wpautop( $notes )
							);
							?>

						</div>

					<?php else : ?>

						<div class="gym-review-verdict__lead">

							<p>
								Full verdict coming soon.
							</p>

						</div>

					<?php endif; ?>

				</div>


				<?php if ( $location || $google_maps_url ) : ?>

					<div class="gym-review-location">

						<div class="gym-review-section-heading">

							<span class="gym-review-kicker">
								Location
							</span>

						</div>


						<div
							class="gym-review-map"
							data-location="<?php echo esc_attr( $location ); ?>"
							data-title="<?php echo esc_attr( dx_gym_chain_label( $chain_value ) . ' ' . get_the_title() ); ?>"
							data-map-embed="<?php echo esc_url( $map_details['url'] ); ?>"
							data-map-precision="<?php echo esc_attr( $map_details['precision'] ); ?>"
						></div>
						<?php if ( $map_details['precision'] === 'search' ) : ?>
							<p class="gym-review-map__note">Map search for <?php echo esc_html( $map_details['label'] ); ?>.</p>
						<?php endif; ?>


						<div class="gym-review-location__address">

							<div>

								<strong>
									<?php the_title(); ?>
								</strong>

								<span>
									<?php echo esc_html( $location ); ?>
								</span>

							</div>


							<?php if ( $google_maps_url ) : ?>

								<a
									class="gym-review-location__directions"
									href="<?php echo esc_url( $google_maps_url ); ?>"
									data-map-url="<?php echo esc_url( $google_maps_url ); ?>"
									target="_blank"
									rel="noopener noreferrer"
								>
									Get directions
									<span aria-hidden="true">→</span>
								</a>

							<?php endif; ?>

						</div>

					</div>

				<?php endif; ?>


			</div>

		</div>

	</section>



	<!-- =========================================================
	SCORES
	========================================================= -->

	<section class="gym-review-scores" data-gym-scene="brass">

		<div class="container">

			<div class="gym-review-section-heading">

				<div>
					<span class="gym-review-kicker">02 / The scorecard</span>
					<h2 class="gym-review-editorial-title">Every detail.<br>Honestly rated.</h2>
				</div>


				<?php if ( $overall_score !== null ) : ?>

					<small>

						Weighted overall score calculated from

						<?php echo esc_html( count( $valid_scores ) ); ?>

						<?php
						echo count( $valid_scores ) === 1
							? 'category'
							: 'categories';
						?>

					</small>

				<?php endif; ?>

			</div>


			<div class="gym-review-scores__grid">


				<?php foreach ( $score_fields as $score ) : ?>
					<?php
					$is_assessed = $is_valid_score( $score['value'] );
					$value = $is_assessed ? (float) $score['value'] : null;
					$category_band = $is_assessed ? $get_score_band( $value * 10 ) : null;
					$score_notice = $score['value'] === 'unavailable' ? 'Unavailable' : 'Not assessed';
					?>
					<div class="gym-review-score<?php echo $is_assessed ? '' : ' gym-review-score--unassessed'; ?>"
						<?php if ( $is_assessed ) : ?>
							data-score="<?php echo esc_attr( $value ); ?>"
							data-score-band="<?php echo esc_attr( $category_band['label'] ?? '' ); ?>"
							style="--score-colour: <?php echo esc_attr( $category_band['color'] ?? 'currentColor' ); ?>"
						<?php endif; ?>>
						<div class="gym-review-score__meta">
							<span><?php echo esc_html( $score['label'] ); ?></span>
							<?php if ( $is_assessed ) : ?>
								<strong class="gym-review-score__value" aria-label="<?php echo esc_attr( sprintf( '%s out of 10 — %s', $value, $category_band['label'] ?? '' ) ); ?>"><?php echo esc_html( $value ); ?>/10</strong>
							<?php else : ?>
								<strong class="gym-review-score__notice"><?php echo esc_html( $score_notice ); ?></strong>
							<?php endif; ?>
						</div>
						<?php if ( $is_assessed ) : ?><div class="gym-review-score__track"><span class="gym-review-score__fill"></span></div><?php endif; ?>
					</div>
				<?php endforeach; ?>


			</div>

		</div>

	</section>



	<!-- =========================================================
	LIKES / DISLIKES / FACILITIES
	========================================================= -->

	<section class="gym-review-breakdown" data-gym-scene="brass">

		<div class="container">
			<div class="gym-review-section-heading">
				<div>
					<span class="gym-review-kicker">03 / The experience</span>
					<h2 class="gym-review-editorial-title">The good.<br>The room to grow.</h2>
				</div>
			</div>
			<div class="gym-review-breakdown__grid">


				<div class="gym-review-panel gym-review-panel--likes">

					<h2>

						<span aria-hidden="true">
							+
						</span>

						What I Like

					</h2>


					<?php $points = dx_gym_review_points( $post_id, 'likes' ); ?>
					<?php if ( $points ) : ?>
						<ul>
							<?php foreach ( $points as $point ) : ?>
								<li><?php echo esc_html( $point ); ?></li>
							<?php endforeach; ?>
						</ul>
					<?php else : ?>
						<p>No highlights added yet.</p>
					<?php endif; ?>

				</div>



				<div class="gym-review-panel gym-review-panel--dislikes">

					<h2>

						<span aria-hidden="true">
							−
						</span>

						What I Don't Like

					</h2>


					<?php $points = dx_gym_review_points( $post_id, 'dislikes' ); ?>
					<?php if ( $points ) : ?>
						<ul>
							<?php foreach ( $points as $point ) : ?>
								<li><?php echo esc_html( $point ); ?></li>
							<?php endforeach; ?>
						</ul>
					<?php else : ?>
						<p>No negatives added yet.</p>
					<?php endif; ?>

				</div>



				<div class="gym-review-panel gym-review-panel--facilities">

					<h2>
						Facilities
					</h2>


					<div class="gym-review-facilities">

						<?php foreach ( $facilities as $facility ) : ?>

							<div
								class="
									gym-review-facility
									gym-review-facility--<?php
									echo esc_attr(
										$facility['status'] === 'unknown' ? 'unknown gym-review-facility--limited' : $facility['status']
									);
									?>
								"
							>

								<span
									class="gym-review-facility__indicator"
									aria-hidden="true"
								></span>

								<strong>
									<?php echo esc_html( $facility['name'] ); ?>
									<?php if ( $facility['notice'] ) : ?>
										<br><small><?php echo esc_html( $facility['notice'] ); ?></small>
									<?php endif; ?>
								</strong>

							</div>

						<?php endforeach; ?>

					</div>

				</div>


			</div>

		</div>

	</section>



	<!-- =========================================================
	GALLERY
	========================================================= -->

	<?php

	$gallery = get_field(
		'gym_gallery',
		$post_id
	);

	if ( $gallery ) :

	?>

		<section class="gym-review-gallery" data-gym-scene="sage">

			<div class="container">

				<div class="gym-review-section-heading">

					<div>
						<span class="gym-review-kicker">04 / In the frame</span>
						<h2 class="gym-review-editorial-title">A closer look.</h2>
					</div>

					<small>
						<?php
						echo esc_html(
							count( $gallery )
						);
						?>
						photos
					</small>

				</div>


				<div class="gym-review-gallery__viewport">

					<div class="gym-review-gallery__grid">

						<?php foreach ( $gallery as $image ) : ?>

							<?php

							$image_id =
								is_array( $image )
									? $image['ID']
									: $image;

							$gallery_image = $get_review_image( $image_id );
							?>


							<figure>

								<img
									src="<?php echo esc_url( $gallery_image['url'] ); ?>"
									data-full="<?php echo esc_url( $gallery_image['url'] ); ?>"
									width="<?php echo esc_attr( $gallery_image['width'] ); ?>"
									height="<?php echo esc_attr( $gallery_image['height'] ); ?>"
									alt="<?php echo esc_attr( $gallery_image['alt'] ); ?>"
									loading="lazy"
									decoding="async"
								>

							</figure>

						<?php endforeach; ?>

					</div>

				</div>

			</div>

		</section>

	<?php endif; ?>



	<!-- =========================================================
	FULL REVIEW
	========================================================= -->

	<?php if ( trim( get_the_content() ) ) : ?>

		<section class="gym-review-content" data-gym-scene="ink">

			<div class="container">

				<div class="gym-review-content__grid">


					<div>

						<span class="gym-review-kicker">The full review</span>
						<h2 class="gym-review-editorial-title">Beyond the numbers.</h2>


						<div class="gym-review-content__body">

							<?php the_content(); ?>

						</div>

					</div>


					<?php

					$review_image =
						get_field(
							'gym_review_image',
							$post_id
						);

					if ( $review_image ) :

						$review_image_id =
							is_array(
								$review_image
							)
								? $review_image['ID']
								: $review_image;

					?>

						<figure class="gym-review-content__image">

							<?php

							echo wp_get_attachment_image(
								$review_image_id,
								'large'
							);

							?>

						</figure>

					<?php elseif ( has_post_thumbnail() ) : ?>

						<figure class="gym-review-content__image">

							<?php
							the_post_thumbnail(
								'large'
							);
							?>

						</figure>

					<?php endif; ?>


				</div>

			</div>

		</section>

	<?php endif; ?>



	<!-- =========================================================
	FINAL VERDICT
	========================================================= -->

	<?php if ( $overall_score !== null ) : ?>

		<section class="gym-review-final" data-gym-scene="sage">

			<div class="container">

				<span class="gym-review-kicker">The final word</span>
				<h2 class="gym-review-editorial-title">The overall picture.</h2>


				<strong
					class="gym-review-final__score"
					style="color: <?php echo esc_attr( $score_color ); ?>"
					data-overall-score="<?php echo esc_attr( $overall_score ); ?>"
				>
					<?php
					echo esc_html(
						number_format(
							$overall_score,
							1
						)
					);
					?>%
				</strong>


				<span
					class="gym-review-final__label"
					style="color: <?php echo esc_attr( $score_color ); ?>"
					data-score-label-source="<?php echo esc_attr( $overall_score ); ?>"
				>
					<?php echo esc_html( $score_label ); ?>
				</span>

			</div>

		</section>

	<?php endif; ?>



	<!-- =========================================================
	PREV / NEXT
	========================================================= -->

	<section class="gym-review-navigation" data-gym-scene="ink">

		<div class="container">

			<div class="gym-review-navigation__grid">

				<?php

				$previous_post =
					get_previous_post();

				$next_post =
					get_next_post();

				?>


				<?php if ( $previous_post ) : ?>

					<a
						href="<?php echo esc_url(
							get_permalink(
								$previous_post
							)
						); ?>"
					>

						<span>
							Previous Review
						</span>

						<strong>
							<?php echo esc_html(
								get_the_title(
									$previous_post
								)
							); ?>
						</strong>

					</a>

				<?php else : ?>

					<div></div>

				<?php endif; ?>


				<?php if ( $next_post ) : ?>

					<a
						href="<?php echo esc_url(
							get_permalink(
								$next_post
							)
						); ?>"
					>

						<span>
							Next Review
						</span>

						<strong>
							<?php echo esc_html(
								get_the_title(
									$next_post
								)
							); ?>
						</strong>

					</a>

				<?php endif; ?>


			</div>

		</div>

	</section>


</article>


<?php

endwhile;

get_footer();