<?php
/* Template Name: Signup */
get_header();

if (is_user_logged_in()) {
    wp_redirect(home_url('/dashboard'));
    exit;
}
?>

<section class="auth auth-signup">
    <h1>Create account</h1>

    <form method="post">
        <input type="text" name="name" placeholder="Full name" required>
        <input type="email" name="email" placeholder="Email" required>
        <input type="password" name="password" placeholder="Password" required>

        <?php wp_nonce_field('dx_signup', 'dx_signup_nonce'); ?>

        <button type="submit">Create account</button>
    </form>
</section>

<?php get_footer(); ?>