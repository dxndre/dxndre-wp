<?php
/* Template Name: Dashboard */
get_header();

// 🔐 Auth guard
if (!is_user_logged_in()) {
    wp_redirect(home_url('/login'));
    exit;
}

// 🔐 Role guard
if (!current_user_can('client')) {
    wp_redirect(home_url('/'));
    exit;
}

$current_user = wp_get_current_user();
?>

<section class="dashboard">
    <aside class="dashboard-sidebar">
        <h3>Hello, <?php echo esc_html($current_user->display_name); ?></h3>

        <nav class="dashboard-nav">
            <a href="#">Overview</a>
            <a href="#">My Tickets</a>
            <a href="#">Request Service</a>
            <a href="<?php echo esc_url(wp_logout_url(home_url('/login'))); ?>">
                Log out
            </a>
        </nav>
    </aside>

    <main class="dashboard-content">
        <h1>Dashboard</h1>
        <p>Welcome to your client area.</p>
    </main>
</section>

<?php get_footer(); ?>