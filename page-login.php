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


<div class="modal fade" id="recruiterAccessModal" tabindex="-1" aria-labelledby="recruiterAccessTitle" aria-hidden="true">
<div class="modal-dialog modal-dialog-centered modal-lg"><div class="modal-content"><div class="modal-shell">
<div class="modal-content-inner"><pre class="headline">Recruiters &amp; Hiring Managers</pre><div class="modal-header"><h2 class="modal-title" id="recruiterAccessTitle">Open to the right role.</h2></div><div class="modal-body"><p>Enter the access password I shared with you to explore my private portfolio.</p>
<form action="<?php echo esc_url(site_url('wp-login.php?action=postpass','login_post')); ?>" method="post"><input type="hidden" name="redirect_to" value="<?php echo esc_url(home_url('/recruiter-room/')); ?>"><label class="visually-hidden" for="recruiter-access-password">Access password</label><input type="password" id="recruiter-access-password" name="post_password" placeholder="Access password" required autocomplete="current-password"><button type="submit" class="dx-cta">Explore private portfolio ↗</button></form><p>Need access? <a href="/contact/">Get in touch ↗</a></p></div></div>
<div class="modal-image"><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button><img src="<?php echo esc_url(get_template_directory_uri().'/assets/img/sideshot3-illustrated.webp'); ?>" alt="D’André, open to the right role"></div>
</div></div></div></div>

<?php get_footer(); ?>