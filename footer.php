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
			<div class="site-footer__inner">

				<!-- Brand -->
				<div class="site-footer__brand">
				<span class="site-footer__logo">
					<?php echo esc_html( get_bloginfo('name') ); ?>
				</span>
				</div>

				<!-- Footer Columns -->
				<div class="site-footer__columns">

				<!-- Work -->
				<nav class="site-footer__column" aria-label="Work">
					<h4 class="site-footer__heading">Work</h4>
					<?php
					wp_nav_menu([
						'theme_location' => 'footer_work',
						'container'      => false,
						'menu_class'     => 'site-footer__list',
						'fallback_cb'    => false,
					]);
					?>
				</nav>

				<!-- Services -->
				<nav class="site-footer__column" aria-label="Services">
					<h4 class="site-footer__heading">Services</h4>
					<?php
					wp_nav_menu([
						'theme_location' => 'footer_services',
						'container'      => false,
						'menu_class'     => 'site-footer__list',
						'fallback_cb'    => false,
					]);
					?>
				</nav>

				<!-- Personal -->
				<nav class="site-footer__column" aria-label="Personal">
					<h4 class="site-footer__heading">Personal</h4>
					<?php
					wp_nav_menu([
						'theme_location' => 'footer_personal',
						'container'      => false,
						'menu_class'     => 'site-footer__list',
						'fallback_cb'    => false,
					]);
					?>
				</nav>

				<!-- Get In Touch -->
				<nav class="site-footer__column" aria-label="Get in Touch">
				<h4 class="site-footer__heading">Get In Touch</h4>
				<?php
				wp_nav_menu([
					'theme_location' => 'footer_contact',
					'container'      => false,
					'menu_class'     => 'site-footer__list',
						'fallback_cb'    => false,
					]);
					?>
				</nav>

				<!-- Client Portal -->
				<div class="site-footer__column site-footer__column--portal">
					<h4 class="site-footer__heading">Existing Client?</h4>
					<p class="site-footer__text">
					Manage your support tickets here.
					</p>

					<a href="<?php echo esc_url( site_url('/client-portal/') ); ?>"
					class="site-footer__button">
					Client Portal
					</a>

					<div class="site-footer__contact">
					<h5 class="site-footer__subheading">Email</h5>
					<a href="mailto:hello@dxndre.co.uk">
						hello@dxndre.co.uk
					</a>
					</div>
				</div>

				</div>

				<!-- Footer Bottom -->
				<div class="site-footer__bottom">

				<div class="site-footer__legal">
					<a href="<?php echo esc_url( site_url('/privacy-policy/') ); ?>">
					Privacy Policy
					</a>
					<a href="<?php echo esc_url( site_url('/terms-of-service/') ); ?>">
					Terms of Service
					</a>
				</div>

				<div class="site-footer__copyright">
					© <?php echo date('Y'); ?>
					<?php echo esc_html( get_bloginfo('name') ); ?>.
					All Rights Reserved.
				</div>

				<div class="site-footer__social" aria-label="Social links">
					<a href="#" aria-label="Instagram">Instagram</a>
					<a href="#" aria-label="GitHub">GitHub</a>
					<a href="#" aria-label="X">X</a>
					<a href="#" aria-label="LinkedIn">LinkedIn</a>
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
