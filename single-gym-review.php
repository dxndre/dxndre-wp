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
			'label' => 'Spa Retreat',
			'value' => get_field( 'score_spa', $post_id ),
		],

		'cafe' => [
			'label' => 'Café & Work Area',
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

	if ( $overall_score !== null ) {
		foreach ( $overall_bands as [ $minimum, $label, $color ] ) {
			if ( $overall_score >= $minimum ) {
				$score_label = $label;
				$score_color = $color;
				break;
			}
		}
	}


	// ============================================================
	// AUTO FACILITIES
	//
	// These use the score fields you already have.
	// If a category is marked "unavailable", it is displayed as
	// unavailable without needing another ACF repeater.
	// ============================================================

	$facilities = [

		[
			'name'   => 'Gym',
			'status' => $is_valid_score(
				$score_fields['gym']['value']
			)
				? 'available'
				: 'unavailable',
		],

		[
			'name'   => 'Swimming',
			'status' => $is_valid_score(
				$score_fields['swim']['value']
			)
				? 'available'
				: 'unavailable',
		],

		[
			'name'   => 'Spa Retreat',
			'status' => $is_valid_score(
				$score_fields['spa']['value']
			)
				? 'available'
				: 'unavailable',
		],

		[
			'name'   => 'Café / Work Area',
			'status' => $is_valid_score(
				$score_fields['cafe']['value']
			)
				? 'available'
				: 'unavailable',
		],

		[
			'name'   => 'Parking',
			'status' => $is_valid_score(
				$score_fields['parking']['value']
			)
				? 'available'
				: 'unavailable',
		],

	];

?>


<article <?php post_class( 'gym-review-single' ); ?>>


	<!-- =========================================================
	HERO
	========================================================= -->

	<section class="gym-review-hero">

		<?php if ( has_post_thumbnail() ) : ?>

			<div class="gym-review-hero__media">

				<?php
				the_post_thumbnail(
					'full',
					[
						'class'         => 'gym-review-hero__image',
						'loading'       => 'eager',
						'decoding'      => 'async',
						'fetchpriority' => 'high',
					]
				);
				?>

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


			<div class="gym-review-badges">

				<?php if ( $overall_score >= 85 ) : ?>

					<span class="gym-review-badge">
						Recommended
					</span>

				<?php endif; ?>


				<?php if ( $score_fields['spa']['value'] >= 9 ) : ?>

					<span class="gym-review-badge">
						Excellent Spa
					</span>

				<?php endif; ?>


				<?php if ( $score_fields['gym']['value'] >= 9 ) : ?>

					<span class="gym-review-badge">
						Excellent Gym
					</span>

				<?php endif; ?>

			</div>

		</div>

	</section>



	<!-- =========================================================
	QUICK FACTS
	========================================================= -->

	<section class="gym-review-facts">

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

	<section class="gym-review-overview">

		<div class="container">

			<div class="gym-review-overview__grid">


				<div class="gym-review-verdict">

					<span class="gym-review-kicker">
						The Verdict
					</span>


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


				<?php if ( $location ) : ?>

					<div class="gym-review-location">

						<div class="gym-review-section-heading">

							<span class="gym-review-kicker">
								Location
							</span>

						</div>


						<div
							class="gym-review-map"
							data-location="<?php echo esc_attr( $location ); ?>"
							data-title="<?php echo esc_attr( get_the_title() ); ?>"
						></div>


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

	<section class="gym-review-scores">

		<div class="container">

			<div class="gym-review-section-heading">

				<span class="gym-review-kicker">
					Scores
				</span>


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

					if (
						! $is_valid_score(
							$score['value']
						)
					) {
						continue;
					}


					$value =
						(float) $score['value'];

					?>


					<div
						class="gym-review-score"
						data-score="<?php echo esc_attr( $value ); ?>"
					>

						<div class="gym-review-score__meta">

							<span>
								<?php echo esc_html( $score['label'] ); ?>
							</span>


							<strong class="gym-review-score__value">

								<?php
								echo esc_html(
									number_format(
										$value,
										0
									)
								);
								?>/10

							</strong>

						</div>


						<div class="gym-review-score__track">

							<span class="gym-review-score__fill"></span>

						</div>

					</div>


				<?php endforeach; ?>


			</div>

		</div>

	</section>



	<!-- =========================================================
	LIKES / DISLIKES / FACILITIES
	========================================================= -->

	<section class="gym-review-breakdown">

		<div class="container">

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
										$facility['status']
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

		<section class="gym-review-gallery">

			<div class="container">

				<div class="gym-review-section-heading">

					<span class="gym-review-kicker">
						Photo Gallery
					</span>

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

							$full_image =
								wp_get_attachment_image_url(
									$image_id,
									'full'
								);

							?>


							<figure>

								<?php

								echo wp_get_attachment_image(
									$image_id,
									'large',
									false,
									[
										'loading'   => 'lazy',
										'data-full' => esc_url(
											$full_image
										),
									]
								);

								?>

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

		<section class="gym-review-content">

			<div class="container">

				<div class="gym-review-content__grid">


					<div>

						<span class="gym-review-kicker">
							Full Review
						</span>


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

		<section class="gym-review-final">

			<div class="container">

				<span class="gym-review-kicker">
					Final Verdict
				</span>


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

	<section class="gym-review-navigation">

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