<?php
/* Template Name: Sign Up */
get_header();

if (is_user_logged_in()) {
	wp_redirect(home_url('/dashboard'));
	exit;
}
?>

<div class="container">
	<section class="auth auth-signup">
		<div class="login-content">
			<pre class="headline">Client Portal Register</pre>
			<h1>Create Account</h1>

			<?php if (isset($_GET['register']) && $_GET['register'] === 'success'): ?>
				<p class="success">
					Account created. Please check your email to set your password.
				</p>
			<?php endif; ?>

			<form method="post">

                <input type="text" name="username" placeholder="Username" required>

                <input type="email" name="email" placeholder="Email Address" required>

                <input type="text" name="company" placeholder="Company Name">

                <input type="text" name="projectref" placeholder="Client Reference Number">

                <input type="password" name="password" placeholder="Password" required>

                <input type="password" name="password_repeat" placeholder="Repeat Password" required>

                <label class="terms-checkbox">
                    <input type="checkbox" name="terms" required>
                    <span>
                        By selecting this checkbox, I agree to be bound by the
                        <a href="/terms" target="_blank">Terms of Service</a>.
                    </span>
                </label>

                <?php wp_nonce_field('dx_register', 'dx_register_nonce'); ?>

                <button class="login" type="submit">Create Account</button>
            </form>
		</div>

		<div class="graphic-content">
			<img src="<?php echo get_template_directory_uri(); ?>/assets/img/bus.png" alt="">
		</div>
	</section>

	<section class="auth-actions">

		<!-- Existing user -->
		<div class="auth-action auth-action--login">
			<div class="auth-action__content">
				<h3>Existing Client?</h3>
			</div>

			<div class="auth-action__cta">
				<a href="/login" class="btn">
					Login
				</a>
			</div>
		</div>

	</section>
</div>

<?php get_footer(); ?>