<?php
/* Template Name: Login */
if (is_user_logged_in()) {
	wp_safe_redirect(home_url('/dashboard/'));
	exit;
}
get_header();
?>

<div class="container">
	<section class="auth dx-account-photo auth-login">
		<div class="login-content">
			<pre class="headline">Account access</pre>
			<h1>Login</h1>

			<?php if (isset($_GET['login']) && $_GET['login'] === 'failed'): ?>
				<p class="error">Invalid credentials.</p>
			<?php endif; ?>

			<form method="post">
				<input type="text" name="username" autocomplete="username" aria-label="Email or Username" placeholder="Email or Username" required>
				<input type="password" name="password" autocomplete="current-password" aria-label="Password" placeholder="Password" required>

				<?php wp_nonce_field('dx_login', 'dx_login_nonce'); ?>

				<button class="login" type="submit">Login</button>
			</form>
<button type="button" class="dx-recruiter-access-link" data-bs-toggle="modal" data-bs-target="#recruiterAccessModal">Recruiter or Hiring Manager?</button>
		</div>
		<div class="graphic-content">
			<img src="<?php echo get_template_directory_uri(); ?>/assets/img/account-night.jpeg" alt="">
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
					<span class="auth-action__label">Send a Password Reset</span>
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
					<span class="auth-action__label">New Account</span>
				</a>
			</div>
		</div>

	</section>

</div>


<?php get_template_part('partials/recruiter-access-modal'); ?>

<?php get_footer(); ?>