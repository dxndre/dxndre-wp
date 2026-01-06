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
	?>
</div><!-- /#post-<?php the_ID(); ?> -->

<div class="modal fade" id="hireMeModal" tabindex="-1" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered modal-lg">
		<div class="modal-content">

			<div class="modal-shell">

				<div class="modal-content-inner">
					<pre class="headline">Hire Me</pre>

					<div class="modal-header">
						<h5 class="modal-title">Let’s get you to the right place</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
					</div>

					<div class="modal-body">
						<p class="question">What best describes you?</p>

						<div class="button-container">
							<button class="btn btn-primary js-client-path">
								I’m a client looking for services
							</button>

							<button class="btn btn-outline-secondary js-recruiter-path">
								I’m a recruiter / employer
							</button>
						</div>
					</div>
				</div>

				<div class="modal-image">
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
						<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
					</div>

					<div class="modal-body">
						<p>
							I work with clients on branding, UX, and WordPress-driven builds —
							from focused landing pages to full platforms.
						</p>

						<div class="button-container">
							<a href="/services/" class="btn btn-primary">
								View Services & Pricing
							</a>
						</div>
					</div>
				</div>

				<div class="modal-image">
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
						<h5 class="modal-title">Career opportunities</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
					</div>

					<div class="modal-body">
						<p>
							I’m actively seeking full-time opportunities and available to start immediately.
						</p>

						<p>
							My background spans senior WordPress development, UX, and front-end engineering.
						</p>

						<div class="button-container">
							<a
								href="/wp-content/uploads/2026/01/DAndre-Phillips-CV.pdf"
								class="btn btn-primary"
								target="_blank"
								rel="noopener"
							>
								Download CV <i class="fa-solid fa-download"></i>
							</a>
						</div>
					</div>
				</div>

				<div class="modal-image">
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
