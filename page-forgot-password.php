<?php
/* Template Name: Forgot Password */
get_header();

if (is_user_logged_in()) {
	wp_redirect(home_url('/dashboard'));
	exit;
}
?>

<div class="container">
	<section class="auth auth-forgot">
		<div class="login-content">
			<pre class="headline">Client Portal Regain Access</pre>
			<h1>Reset Password</h1>

			<p>Enter your email address and we’ll send you a reset link.</p>

			<?php if (isset($_GET['reset']) && $_GET['reset'] === 'sent'): ?>
				<p class="success">If that email exists, a reset link has been sent.</p>
			<?php endif; ?>

			<form method="post" action="<?php echo esc_url( wp_lostpassword_url() ); ?>">
				<input
					type="email"
					name="user_login"
					placeholder="Email Address"
					required
				>

				<button class="login" type="submit">
					Send Password Reset
				</button>
			</form>
		</div>

		<div class="graphic-content">
			<img src="<?php echo get_template_directory_uri(); ?>/assets/img/bus.png" alt="">
		</div>
	</section>

	<section class="auth-actions">

		<!-- Back to login -->
		<div class="auth-action auth-action--login">
			<div class="auth-action__content">
				<h3>Remembered it?</h3>
			</div>

			<div class="auth-action__cta">
				<a href="/login" class="btn">
					Back to Login
				</a>
			</div>
		</div>

	</section>
</div>

<?php get_footer(); ?>