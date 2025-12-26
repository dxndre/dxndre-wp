<?php
/* Template Name: Login */
get_header();

if (is_user_logged_in()) {
    wp_redirect(home_url('/dashboard'));
    exit;
}
?>

<div class="container">
	<section class="auth auth-login">
		<div class="login-content">
			<pre class="headline">Client Portal Login</pre>
			<h1>Login</h1>

			<?php if (isset($_GET['login']) && $_GET['login'] === 'failed'): ?>
				<p class="error">Invalid credentials.</p>
			<?php endif; ?>

			<form method="post">
				<input type="text" name="username" placeholder="Email or Username" required>
				<input type="password" name="password" placeholder="Password" required>

				<?php wp_nonce_field('dx_login', 'dx_login_nonce'); ?>

				<button class="login" type="submit">Login</button>
			</form>
		</div>
		<div class="graphic-content">
			<img src="<?php echo get_template_directory_uri(); ?>/assets/img/bus.png" alt="">
		</div>
	</section>
	<section class="auth-actions">

		<!-- Forgot password -->
		<div class="auth-action auth-action--forgot">
			<div class="auth-action__content">
				<h3>Forgot Password?</h3>
			</div>

			<div class="auth-action__cta">
				<a href="/reset-password" aria-label="Send password reset email" class="btn">
					Send a Password Reset
				</a>
			</div>
		</div>

		<!-- New client -->
		<div class="auth-action auth-action--signup colourful">
			<div class="auth-action__content">
				<h3>New Client?</h3>
				<p>Get started here.</p>
			</div>

			<div class="auth-action__cta">
				<a href="/sign-up" class="btn">
					New Account
				</a>
			</div>
		</div>

	</section>

</div>

<?php get_footer(); ?>