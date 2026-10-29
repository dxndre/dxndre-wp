<?php
/** Template Name: Signed out */
defined( 'ABSPATH' ) || exit;
nocache_headers();
$dx_logout_signed_in = is_user_logged_in();
get_header();
?>
<div class="container">
	<section class="auth dx-account-photo auth-login auth-logout" aria-labelledby="dx-logout-title">
		<div class="login-content">
			<pre class="headline">Account access</pre>
			<h1 id="dx-logout-title"><?php echo $dx_logout_signed_in ? 'Sign out' : 'Signed out.'; ?></h1>
			<p class="dx-logout-message"><?php echo $dx_logout_signed_in ? 'Ready to step away? Your client space will be here when you return.' : 'You’re safely signed out. Your next chapter will be here when you’re ready.'; ?></p>
			<div class="dx-logout-actions">
				<?php if ( $dx_logout_signed_in ) : ?>
					<a class="dx-cta" href="<?php echo esc_url( wp_logout_url( home_url( '/logout/' ) ) ); ?>">Sign out <span aria-hidden="true">↗</span></a>
					<a class="dx-cta dx-cta--outline" href="<?php echo esc_url( home_url( '/dashboard/' ) ); ?>">Back to your workspace <span aria-hidden="true">↗</span></a>
				<?php else : ?>
					<a class="dx-cta" href="<?php echo esc_url( home_url( '/login/' ) ); ?>">Sign in again <span aria-hidden="true">↗</span></a>
					<a class="dx-cta dx-cta--outline" href="<?php echo esc_url( home_url( '/' ) ); ?>">Back to the website <span aria-hidden="true">↗</span></a>
				<?php endif; ?>
			</div>
		</div>
		<div class="graphic-content" aria-label="The London sky"></div>
	</section>
</div>
<?php get_footer(); ?>
