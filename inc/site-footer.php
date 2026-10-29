<?php
/** Shared site footer for conventional pages and standalone workspaces. */
defined( 'ABSPATH' ) || exit;
?>
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

				<nav class="site-footer-column" aria-label="Web & digital"><h4 class="site-footer-heading">Web & digital</h4><ul class="site-footer-list"><li><a href="<?php echo esc_url(home_url('/portfolio/')); ?>">Selected work</a></li><li><a href="<?php echo esc_url(home_url('/services/#digital-services')); ?>">Digital services</a></li><li><a href="<?php echo esc_url(home_url('/pricing-calculator/')); ?>">Pricing calculator</a></li><li><a href="<?php echo esc_url(home_url('/start-a-project/')); ?>">Start a project</a></li></ul></nav>
				<nav class="site-footer-column" aria-label="N118 Fitness"><h4 class="site-footer-heading">N118 Fitness</h4><ul class="site-footer-list"><li><a href="<?php echo esc_url(home_url('/fitness/')); ?>">Fitness & gym reviews</a></li><li><a href="<?php echo esc_url(home_url('/fitness/#fitness-story')); ?>">My fitness story</a></li><li><a href="<?php echo esc_url(home_url('/fitness/n118-fitness/')); ?>">Coaching waitlist</a></li></ul></nav>
				<nav class="site-footer-column" aria-label="Photography"><h4 class="site-footer-heading">Photography</h4><ul class="site-footer-list"><li><a href="<?php echo esc_url(home_url('/photography/')); ?>">Photography archive</a></li><li><a href="<?php echo esc_url(home_url('/service/photography/')); ?>">Photography services</a></li><li><a href="<?php echo esc_url(home_url('/start-a-project/?enquiry_service=photography')); ?>">Discuss a shoot</a></li></ul></nav>
				<nav class="site-footer-column" aria-label="More about me"><h4 class="site-footer-heading">More about me</h4><ul class="site-footer-list"><li><a href="<?php echo esc_url(home_url('/about/')); ?>">About me</a></li><li><a href="<?php echo esc_url(home_url('/buses/')); ?>">London buses</a></li><li><a href="<?php echo esc_url(home_url('/cv/')); ?>">My CV</a></li><li><a href="<?php echo esc_url(home_url('/contact/')); ?>">Contact & enquiries</a></li><li><a href="<?php echo esc_url(home_url('/faq/')); ?>">FAQs</a></li></ul></nav>

				<!-- Client Portal -->
				<div class="site-footer-column site-footer-column--portal">
					<?php
					$footer_client = is_user_logged_in() && function_exists('dxcp_is_client_user') && dxcp_is_client_user();
					$footer_owner = function_exists('dxcp_is_site_owner') && dxcp_is_site_owner();
					$footer_user = $footer_client ? wp_get_current_user() : null;
					$footer_name = $footer_user ? explode(' ',trim($footer_user->first_name ?: $footer_user->display_name))[0] : '';
					?>
					<h4 class="site-footer-heading"><?php echo $footer_client ? esc_html(dxcp_time_greeting().', '.$footer_name.'.') : 'Existing Client?'; ?></h4>
					<p class="site-footer-text"><?php echo $footer_owner ? 'Your clients, projects and business are ready when you are.' : ($footer_client ? 'Your projects, documents and next steps are all in your client space.' : 'Manage your projects and support requests here.'); ?></p>
					<a href="<?php echo esc_url( site_url('/dashboard/') ); ?>" class="site-footer-button"><?php echo $footer_owner ? 'Return to your business' : ($footer_client ? 'Return to your workspace' : 'Client Portal'); ?></a>

					<div class="site-footer-contact">
					<h5 class="site-footer-subheading">Email</h5>
					<a href="mailto:hello@dxndre.co.uk">
						hello@dxndre.co.uk
					</a><a href="mailto:dandrephillips@outlook.com">dandrephillips@outlook.com</a>
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
					<a href="<?php echo esc_url( site_url('/cookie-policy-uk/') ); ?>">
					Cookie Policy (UK)
					</a>
				</div>

				<div class="site-footer-copyright">
					© <?php echo date('Y'); ?>
					<?php echo esc_html( get_bloginfo('name') ); ?>.
					All Rights Reserved.
				</div>

				<div class="site-footer-social" aria-label="Social links">
					<a href="https://www.instagram.com/d.xndre_" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
					<a href="https://github.com/dxndre" target="_blank" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
					<a href="https://x.com/dxndre1" target="_blank" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>
					<a href="https://www.linkedin.com/in/dxndre/" target="_blank" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
				</div>
			</div>
		</div>
		<?php
			$footer_roman_year = static function ( $year ) {
				$roman = '';
				foreach ( [ 1000 => 'M', 900 => 'CM', 500 => 'D', 400 => 'CD', 100 => 'C', 90 => 'XC', 50 => 'L', 40 => 'XL', 10 => 'X', 9 => 'IX', 5 => 'V', 4 => 'IV', 1 => 'I' ] as $value => $numeral ) {
					while ( $year >= $value ) {
						$roman .= $numeral;
						$year -= $value;
					}
				}
				return $roman;
			};
			$footer_wordmark = 'DXNDRE ' . $footer_roman_year( (int) wp_date( 'Y' ) );
		?>
		<div class="dx-footer-wordmark" aria-hidden="true">
			<div class="dx-footer-wordmark-track">
				<?php for ( $footer_repeat = 0; $footer_repeat < 3; $footer_repeat++ ) : ?>
					<span><?php echo esc_html( $footer_wordmark ); ?></span>
				<?php endfor; ?>
			</div>
		</div>
	</footer>
