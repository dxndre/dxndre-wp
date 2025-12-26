<?php
/* Template Name: Forgot Password */
get_header();
?>

<section class="auth auth-forgot">
    <h1>Reset password</h1>

    <form method="post">
        <input type="email" name="email" placeholder="Your email" required>
        <?php wp_nonce_field('dx_forgot', 'dx_forgot_nonce'); ?>
        <button type="submit">Send reset link</button>
    </form>
</section>

<?php get_footer(); ?>