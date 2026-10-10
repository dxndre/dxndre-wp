<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

	<?php wp_head(); ?>
</head>

<?php
	$navbar_scheme   = get_theme_mod( 'navbar_scheme', 'navbar-light bg-light' ); // Get custom meta-value.
	$navbar_position = get_theme_mod( 'navbar_position', 'static' ); // Get custom meta-value.
	$search_enabled  = get_theme_mod( 'search_enabled', '1' ); // Get custom meta-value.
?>

<body <?php body_class(); ?>>

<?php wp_body_open(); ?>

<a href="#main" class="visually-hidden-focusable"><?php esc_html_e( 'Skip to main content', 'dxndre' ); ?></a>

<div id="wrapper">
	<header>
		<nav id="header" class="navbar <?php if ( isset( $navbar_position ) && 'fixed_top' === $navbar_position ) : echo ' fixed-top'; elseif ( isset( $navbar_position ) && 'fixed_bottom' === $navbar_position ) : echo ' fixed-bottom'; endif; if ( is_home() || is_front_page() ) : echo ' home'; endif; ?>">
			<div class="container position-relative">
				<div class="dxndre-nav-left">
					<button id="dxndre-search-toggle" class="header-search" type="button" data-bs-toggle="collapse" data-bs-target="#headerSearch" aria-expanded="false" aria-controls="headerSearch" aria-label="<?php esc_attr_e( 'Toggle search', 'dxndre' ); ?>">
						<!-- Magnifier SVG -->
						<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							<circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
					<div class="header-search-box">
						<div class="collapse collapse-horizontal" id="headerSearch">
							<form class="search-form dxndre-search-box" id="dxndre-search-form" role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
								<div class="input-group">
									<input type="text" name="s" class="form-control search-box" placeholder="<?php esc_attr_e( 'Search', 'dxndre' ); ?>" title="<?php esc_attr_e( 'Search', 'dxndre' ); ?>" />
								</div>
							</form>
						</div>
					</div>
					
				</div>

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
				<div class="dxndre-nav-right">
					<button id="dx-menu-toggle" class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="<?php esc_attr_e( 'Toggle navigation', 'dxndre' ); ?>">
						<span class="navbar-toggler-line"></span>
						<span class="navbar-toggler-line"></span>
						<span class="navbar-toggler-line"></span>
					</button>
				</div>

				<?php
					// Navigation assets.
					$menu_bus = get_template_directory_uri() . '/assets/img/bus.png';

					// Optional social URLs.
					$menu_socials = array(
						'Instagram' => get_theme_mod( 'social_instagram_url', '' ),
						'LinkedIn'  => get_theme_mod( 'social_linkedin_url', '' ),
						'GitHub'    => get_theme_mod( 'social_github_url', '' ),
					);

					// Only display configured social profiles.
					$menu_socials = array_filter( $menu_socials );

					// Portfolio destination.
					$portfolio_page = get_page_by_path( 'portfolio' );

					$portfolio_url = $portfolio_page
						? get_permalink( $portfolio_page )
						: home_url( '/portfolio/' );
				?>

				<div id="navbar" class="navbar-collapse collapse dx-menu" aria-label="<?php esc_attr_e( 'Main navigation', 'dxndre' ); ?>">
					<div class="dx-menu__background" aria-hidden="true">
						<div class="dx-menu__ambient"></div>
						<div class="dx-menu__glow"></div>
					</div>

					<div class="dx-menu__inner container">

						<div class="dx-menu__layout">

							<!-- NAVIGATION CONTENT -->
							<div class="dx-menu__content">

								<div class="dx-menu__heading">
									<span class="dx-menu__eyebrow">
										<?php esc_html_e( 'Navigation', 'dxndre' ); ?>
									</span>
								</div>

								<div class="dx-menu__navigation">

									<?php
										wp_nav_menu(
											array(
												'theme_location' => 'main-menu',
												'menu_class'     => 'navbar-nav dx-menu__list',
												'container'      => false,
												'fallback_cb'    => 'WP_Bootstrap_Navwalker::fallback',
												'walker'         => new WP_Bootstrap_Navwalker(),
												'depth'          => 2,
											)
										);
									?>

								</div>

								<!-- FOOTER -->
								<div class="dx-menu__footer">

									<div class="dx-menu__footer-top">

										<?php if ( ! empty( $menu_socials ) ) : ?>

											<div class="dx-menu__socials">

												<span class="dx-menu__eyebrow">
													<?php esc_html_e( "Let's connect", 'dxndre' ); ?>
												</span>

												<div class="dx-menu__social-links">

													<?php foreach ( $menu_socials as $name => $url ) : ?>

														<a
															href="<?php echo esc_url( $url ); ?>"
															target="_blank"
															rel="noopener noreferrer"
															aria-label="<?php echo esc_attr( $name ); ?>"
														>
															<?php echo esc_html( $name ); ?>
														</a>

													<?php endforeach; ?>

												</div>

											</div>

										<?php endif; ?>

									</div>

									<a
										href="<?php echo esc_url( $portfolio_url ); ?>"
										class="dx-menu__cta"
									>
										<span>
											<?php esc_html_e( 'View my work', 'dxndre' ); ?>
										</span>

										<svg
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="1.5"
											stroke-linecap="round"
											stroke-linejoin="round"
											aria-hidden="true"
										>
											<path d="M7 17L17 7"></path>
											<path d="M8 7h9v9"></path>
										</svg>
									</a>

								</div>

							</div>

							<!-- CINEMATIC BUS VISUAL -->
							<div class="dx-menu__visual" aria-hidden="true">

								<div class="dx-menu__visual-glow"></div>

								<img
									src="<?php echo esc_url( $menu_bus ); ?>"
									alt=""
									class="dx-menu__bus"
									decoding="async"
								>

								<div class="dx-menu__visual-floor"></div>

							</div>

						</div>

					</div>

				</div><!-- /#navbar -->
			</div><!-- /.container -->
		</nav><!-- /#header -->
	</header>

	<main id="main" class=""<?php if ( isset( $navbar_position ) && 'fixed_top' === $navbar_position ) : echo ''; elseif ( isset( $navbar_position ) && 'fixed_bottom' === $navbar_position ) : echo ' style="padding-bottom: 100px;"'; endif; ?>>
		<?php
			// If Single or Archive (Category, Tag, Author or a Date based page).
			if (
				is_single() && get_post_type() === 'post'
				|| is_archive() && ! is_post_type_archive()
			) :
		?>
			<div class="row">
				<div class="col-md-8 col-sm-12">
		<?php
			endif;
		?>
