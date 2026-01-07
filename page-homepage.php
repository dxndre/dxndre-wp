<?php
/**
 * Template Name: Homepage
 * Description: Page template Homepage.
 *
 */

get_header();

the_post();
?>
<div id="post-<?php the_ID(); ?>" <?php post_class( 'content' ); ?>>
	<?php
		the_content();

		wp_link_pages(
			array(
				'before'   => '<nav class="page-links" aria-label="' . esc_attr__( 'Page', 'dxndre' ) . '">',
				'after'    => '</nav>',
				'pagelink' => esc_html__( 'Page %', 'dxndre' ),
			)
		);
		edit_post_link(
			esc_attr__( 'Edit', 'dxndre' ),
			'<span class="edit-link">',
			'</span>'
		);

		$availability = get_field('employer_availability');

		// Employer / recruiter availability
		$employer_availability = get_field('employer_availability');

		// Client availability
		$client_availability = get_field('client_availability');

		$employer_availability_map = [
			'available' => [
				'label' => 'Available to hire',
				'class' => 'is-available',
			],
			'casual' => [
				'label' => 'Open to opportunities',
				'class' => 'is-casual',
			],
			'unavailable' => [
				'label' => 'Not currently looking',
				'class' => 'is-unavailable',
			],
		];

		$client_availability_map = [
			'available' => [
				'label' => 'Available for new projects',
				'class' => 'is-available',
			],
			'backlog' => [
				'label' => 'Booking ahead',
				'class' => 'is-backlog',
			],
			'unavailable' => [
				'label' => 'Not taking client work',
				'class' => 'is-unavailable',
			],
		];

		$cv_file  = get_field('curriculum_vitae');
		$linkedin = get_field('linkedin');
		$github   = get_field('github');
	?>
</div><!-- /#post-<?php the_ID(); ?> -->

<div class="modal fade" id="hireMeModal" tabindex="-1" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered modal-lg">
		<div class="modal-content">

			<div class="modal-shell">

				<div class="modal-content-inner">
					<pre class="headline">Hire Me</pre>

					<div class="modal-header">
						<h5 class="modal-title">Let’s get you to the right place.</h5>
					</div>

					<div class="modal-body">
						<p class="question">What best describes you?</p>

						<div class="button-container">
							<button class="btn btn-primary js-client-path">
								I’m a Client looking for services
							</button>

							<button class="btn btn-outline-secondary js-recruiter-path alternative">
								I’m a Recruiter / Employer
							</button>
						</div>
					</div>
				</div>

				<div class="modal-image">
					<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
					<img
						src="http://dxndre.local/wp-content/themes/dxndre/assets/img/sideshot.jpg"
						alt="Hire Me"
					/>
				</div>

			</div>

		</div>
	</div>
</div>

<div class="modal fade" id="clientModal" tabindex="-1" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered modal-lg">
		<div class="modal-content">

			<div class="modal-shell">

				<div class="modal-content-inner">
					<pre class="headline">Clients</pre>

					<div class="modal-header">
						<h5 class="modal-title">Working with me</h5>
					</div>

					<div class="modal-body">
						<?php if ($client_availability && isset($client_availability_map[$client_availability])) :
							$state = $client_availability_map[$client_availability];
						?>
							<span class="availability-badge <?= esc_attr($state['class']); ?>">
								<span class="dot"></span>
								<?= esc_html($state['label']); ?>
							</span>
						<?php endif; ?>
						<p>
							I work with clients on branding, UX, and WordPress-driven builds —
							from focused landing pages to full platforms.
						</p>

						<div class="button-container">
							<a href="/services/" class="btn btn-primary">
								View Services & Pricing
							</a>
							<a href="/contact/" class="btn btn-primary alternative">
								Start a conversation
							</a>
						</div>

						<button
							class="modal-back"
							type="button"
							data-back-to="#hireMeModal"
						>
							<i class="fa-solid fa-angle-left"></i> Change selection
						</button>
					</div>
				</div>

				<div class="modal-image">
					<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
					<img
						src="http://dxndre.local/wp-content/themes/dxndre/assets/img/sideshot2.jpg"
						alt="Client services"
					/>
				</div>

			</div>

		</div>
	</div>
</div>

<div class="modal fade" id="recruiterModal" tabindex="-1" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered modal-lg">
		<div class="modal-content">

			<div class="modal-shell">

				<div class="modal-content-inner">
					<pre class="headline">Recruiters & Employers</pre>

					<div class="modal-header">
						<h5 class="modal-title">Open to the Right Role</h5>
					</div>

					<div class="modal-body">
						<?php if ($employer_availability && isset($employer_availability_map[$employer_availability])) :
							$state = $employer_availability_map[$employer_availability];
						?>
							<span class="availability-badge <?= esc_attr($state['class']); ?>">
								<span class="dot"></span>
								<?= esc_html($state['label']); ?>
							</span>
						<?php endif; ?>

						<p>
							I’m actively seeking full-time opportunities and available to start immediately.
						</p>

						<p>
							My background spans senior WordPress development, UX, and front-end engineering.
						</p>

						<div class="button-container">

							<?php if ($cv_file && isset($cv_file['url'])) : ?>
								<a
									href="<?= esc_url($cv_file['url']); ?>"
									class="btn btn-primary"
									target="_blank"
									rel="noopener"
								>
									Download CV <i class="fa-solid fa-download"></i>
								</a>
							<?php endif; ?>

							<?php if ($linkedin) : ?>
								<a
									href="<?= esc_url($linkedin); ?>"
									class="btn btn-primary social alternative"
									target="_blank"
									rel="noopener"
									aria-label="LinkedIn profile"
								>
									<i class="fa-brands fa-linkedin"></i>
								</a>
							<?php endif; ?>

							<?php if ($github) : ?>
								<a
									href="<?= esc_url($github); ?>"
									class="btn btn-primary social alternative"
									target="_blank"
									rel="noopener"
									aria-label="GitHub profile"
								>
									<i class="fa-brands fa-github"></i>
								</a>
							<?php endif; ?>

						</div>

						<button
							class="modal-back"
							type="button"
							data-back-to="#hireMeModal"
						>
							<i class="fa-solid fa-angle-left"></i> Change selection
						</button>
					</div>
				</div>

				<div class="modal-image">
					<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
					<img
						src="http://dxndre.local/wp-content/themes/dxndre/assets/img/sideshot3.jpg"
						alt="Recruiter"
					/>
				</div>

			</div>

		</div>
	</div>
</div>

<?php
	// If comments are open or we have at least one comment, load up the comment template.
	if ( comments_open() || get_comments_number() ) {
		comments_template();
	}

get_footer();
