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
					<button class="btn btn-primary header-search" type="button" data-bs-toggle="collapse" data-bs-target="#headerSearch" aria-expanded="false" aria-controls="headerSearch">
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
					<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="<?php esc_attr_e( 'Toggle navigation', 'dxndre' ); ?>">
						<span class="navbar-toggler-line"></span>
						<span class="navbar-toggler-line"></span>
						<span class="navbar-toggler-line"></span>
					</button>
				</div>

				<div id="navbar" class="navbar-collapse">
					
					<div class="menu-content">
						<span class="headline">Navigation</span>
						<h3>Menu</h3>

						<?php
						// Loading WordPress Custom Menu (theme_location).
						wp_nav_menu(
							array(
								'menu_class'     => 'navbar-nav me-auto',
								'container'      => '',
								'fallback_cb'    => 'WP_Bootstrap_Navwalker::fallback',
								'walker'         => new WP_Bootstrap_Navwalker(),
								'theme_location' => 'main-menu',
							)
						);

						if ( '1' === $search_enabled ) :
					?>
							<!-- <form class="search-form my-2 my-lg-0" role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
								<div class="input-group">
									<input type="text" name="s" class="form-control" placeholder="<?php esc_attr_e( 'Search', 'dxndre' ); ?>" title="<?php esc_attr_e( 'Search', 'dxndre' ); ?>" />
									<button type="submit" name="submit" class="btn btn-outline-secondary"><?php esc_html_e( 'Search', 'dxndre' ); ?></button>
								</div>
							</form> -->
					<?php
						endif;
					?>
					</div>
				</div><!-- /.navbar-collapse -->
			</div><!-- /.container -->
				<script>
					(function(){
						var btn = document.getElementById('dxndre-search-toggle');
						var box = document.getElementById('dxndre-search-form');
						btn && btn.addEventListener('click', function(e){
							e.preventDefault();
							box.classList.toggle('open');
							if(box.classList.contains('open')){ var input = box.querySelector('input[name="s"]'); input && input.focus(); }
						});
						// Close on outside click
						document.addEventListener('click', function(e){
							if(!box.contains(e.target) && !btn.contains(e.target)) box.classList.remove('open');
						});
					})();
				</script>
		</nav><!-- /#header -->
	</header>

	<main id="main" class=""<?php if ( isset( $navbar_position ) && 'fixed_top' === $navbar_position ) : echo ''; elseif ( isset( $navbar_position ) && 'fixed_bottom' === $navbar_position ) : echo ' style="padding-bottom: 100px;"'; endif; ?>>
		<?php
			// If Single or Archive (Category, Tag, Author or a Date based page).
			if ( is_single() || is_archive() ) :
		?>
			<div class="row">
				<div class="col-md-8 col-sm-12">
		<?php
			endif;
		?>
