<?php
		$availability = get_field('employer_availability', (int) get_option('page_on_front'));

		// Employer / recruiter availability
		$employer_availability = get_field('employer_availability', (int) get_option('page_on_front'));

		// Client availability
		$client_availability = get_field('client_availability', (int) get_option('page_on_front'));

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

		$cv_file  = get_field('curriculum_vitae', (int) get_option('page_on_front'));
		$linkedin = get_field('linkedin', (int) get_option('page_on_front'));
		$github   = get_field('github', (int) get_option('page_on_front'));
?>
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
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close dialog"></button>
					<img
						src="<?= esc_url( get_template_directory_uri() . '/assets/img/sideshot-illustrated.webp' ); ?>"
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
							I build websites and digital experiences, photograph people, places and brands,
							and I’m developing N118 Fitness coaching. Choose a service or tell me what you have in mind.
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
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close dialog"></button>
					<img
						src="<?= esc_url( get_template_directory_uri() . '/assets/img/sideshot2-illustrated.webp' ); ?>"
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

						<div class="button-container recruiter-actions">

							<a href="<?php echo esc_url(home_url('/cv/')); ?>" class="btn btn-primary">Explore my CV <span aria-hidden="true">↗</span></a>
                            <a href="<?php echo esc_url(home_url('/recruiter-room/')); ?>" class="btn btn-secondary">Private portfolio <span aria-hidden="true">↗</span></a>

							<?php if ($linkedin || $github) : ?>
								<div class="recruiter-socials" aria-label="Professional profiles">
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
							<?php endif; ?>

						</div>

						<p class="cv-modal-download">Prefer a document? <a href="<?php echo esc_url(dxndre_cv_pdf_url()); ?>" download data-cv-download>Download CV (PDF) <span aria-hidden="true">↧</span></a></p>

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
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close dialog"></button>
					<img
						src="<?= esc_url( get_template_directory_uri() . '/assets/img/sideshot3-illustrated.webp' ); ?>"
						alt="Recruiter"
					/>
				</div>

			</div>

		</div>
	</div>
</div>
