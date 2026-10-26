<?php
/** Daily solar boundaries for the fixed London account illustration. */
defined('ABSPATH') || exit;
function dxndre_london_sun_events($date) {
    $day = DateTimeImmutable::createFromFormat('!Y-m-d', $date, new DateTimeZone('UTC'));
    if (!$day || $day->format('Y-m-d') !== $date) return null;
    $solar = date_sun_info($day->setTime(12, 0)->getTimestamp(), 51.5074, -0.1278);
    return [
        'dawn' => $solar['civil_twilight_begin'] * 1000,
        'sunrise' => $solar['sunrise'] * 1000,
        'sunset' => $solar['sunset'] * 1000,
        'dusk' => $solar['civil_twilight_end'] * 1000,
    ];
}
add_action('rest_api_init', function () {
    register_rest_route('dxndre/v1', '/london-sun', [
        'methods' => 'GET', 'permission_callback' => '__return_true',
        'args' => ['date' => ['required' => true, 'validate_callback' => function ($date) {
            return is_string($date) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) && dxndre_london_sun_events($date) !== null;
        }]],
        'callback' => function ($request) {
            $date = $request->get_param('date');
            return ['date' => $date, 'events' => dxndre_london_sun_events($date)];
        },
    ]);
});
add_action('wp_enqueue_scripts', function () {
    if (!is_page(['login', 'signup', 'forgot-password'])) return;
    $today = new DateTimeImmutable('today', new DateTimeZone('Europe/London'));
    $days = [];
    foreach ([-1, 0, 1] as $offset) {
        $date = $today->modify(($offset >= 0 ? '+' : '') . $offset . ' day')->format('Y-m-d');
        $days[$date] = dxndre_london_sun_events($date);
    }
    wp_localize_script('dxndre-theme', 'DX_LONDON_SUN', ['days' => $days, 'endpoint' => rest_url('dxndre/v1/london-sun')]);
}, 35);
