			<?php
				// If Single or Archive (Category, Tag, Author or a Date based page).
				if ( is_single() || is_archive() ) :
			?>
					</div><!-- /.col -->

					<?php
						get_sidebar();
					?>

				</div><!-- /.row -->
			<?php
				endif;
			?>
		</main><!-- /#main -->
		<footer class="site-footer" role="contentinfo">
			<div class="container">

				<!-- Brand -->
				<div class="site-footer-brand">
					<a class="navbar-brand dxndre-navbar-brand-centered" href="<?php echo esc_url( home_url() ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home">
						<?php
							$header_logo = get_theme_mod( 'header_logo' ); // Get custom meta-value.

							if ( ! empty( $header_logo ) ) :
						?>
							<img src="<?php echo esc_url( $header_logo ); ?>" alt="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" />
						<?php
							else :
								echo esc_attr( get_bloginfo( 'name', 'display' ) );
							endif;
						?>
					</a>
				</div>

				<!-- Footer Columns -->
				<div class="site-footer-columns">

				<!-- Work -->
				<nav class="site-footer-column" aria-label="Work">
					<h4 class="site-footer-heading">Work</h4>
					<?php
					wp_nav_menu([
						'theme_location' => 'footer_work',
						'container'      => false,
						'menu_class'     => 'site-footer-list',
						'fallback_cb'    => false,
					]);
					?>
				</nav>

				<!-- Services -->
				<nav class="site-footer-column" aria-label="Services">
					<h4 class="site-footer-heading">Services</h4>
					<?php
					wp_nav_menu([
						'theme_location' => 'footer_services',
						'container'      => false,
						'menu_class'     => 'site-footer-list',
						'fallback_cb'    => false,
					]);
					?>
				</nav>

				<!-- Personal -->
				<nav class="site-footer-column" aria-label="Personal">
					<h4 class="site-footer-heading">Personal</h4>
					<?php
					wp_nav_menu([
						'theme_location' => 'footer_personal',
						'container'      => false,
						'menu_class'     => 'site-footer-list',
						'fallback_cb'    => false,
					]);
					?>
				</nav>

				<!-- Get In Touch -->
				<nav class="site-footer-column" aria-label="Get in Touch">
				<h4 class="site-footer-heading">Get In Touch</h4>
				<?php
				wp_nav_menu([
					'theme_location' => 'footer_contact',
					'container'      => false,
					'menu_class'     => 'site-footer-list',
						'fallback_cb'    => false,
					]);
					?>
				</nav>

				<!-- Client Portal -->
				<div class="site-footer-column site-footer-column--portal">
					<h4 class="site-footer-heading">Existing Client?</h4>
					<p class="site-footer-text">
					Manage your support tickets here.
					</p>

					<a href="<?php echo esc_url( site_url('/client-portal/') ); ?>"
					class="site-footer-button">
					Client Portal
					</a>

					<div class="site-footer-contact">
					<h5 class="site-footer-subheading">Email</h5>
					<a href="mailto:hello@dxndre.co.uk">
						hello@dxndre.co.uk
					</a>
					</div>
				</div>

				</div>

				<!-- Footer Bottom -->
				<div class="site-footer-bottom">

				<div class="site-footer-legal">
					<a href="<?php echo esc_url( site_url('/privacy-policy/') ); ?>">
					Privacy Policy
					</a>
					<a href="<?php echo esc_url( site_url('/terms-of-service/') ); ?>">
					Terms of Service
					</a>
				</div>

				<div class="site-footer-copyright">
					© <?php echo date('Y'); ?>
					<?php echo esc_html( get_bloginfo('name') ); ?>.
					All Rights Reserved.
				</div>

				<div class="site-footer-social" aria-label="Social links">
					<a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
					<a href="#" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
					<a href="#" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>
					<a href="#" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
				</div>
			</div>
		</div>
	</footer>
	</div><!-- /#wrapper -->
	<?php
		wp_footer();
	?>
</body>
</html>
