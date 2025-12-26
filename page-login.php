<?php
/* Template Name: Login */
get_header();

if (is_user_logged_in()) {
    wp_redirect(home_url('/dashboard'));
    exit;
}
?>

<section class="auth auth-login">
    <h1>Log in</h1>

    <?php if (isset($_GET['login']) && $_GET['login'] === 'failed'): ?>
        <p class="error">Invalid credentials.</p>
    <?php endif; ?>

    <form method="post">
        <input type="text" name="username" placeholder="Email or Username" required>
        <input type="password" name="password" placeholder="Password" required>

        <?php wp_nonce_field('dx_login', 'dx_login_nonce'); ?>

        <button type="submit">Log in</button>
    </form>

    <a href="<?php echo esc_url(home_url('/forgot-password')); ?>">
        Forgot password?
    </a>
</section>

<?php get_footer(); ?>