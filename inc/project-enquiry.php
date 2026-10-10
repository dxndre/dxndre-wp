<?php
/** Guided project enquiries, stored privately before email notification. */
add_action('init', function () {
 register_post_type('project-enquiry', ['label' => 'Project enquiries', 'public' => false, 'show_ui' => true, 'show_in_rest' => false, 'supports' => ['title', 'editor'], 'capability_type' => 'post', 'map_meta_cap' => true, 'capabilities' => ['create_posts' => 'do_not_allow'], 'menu_icon' => 'dashicons-email-alt']);
});
function dxndre_enquiry_services() {
 return ['design-build' => ['Design & build', 'A complete website, from first idea to launch.'], 'wordpress' => ['WordPress development', 'A custom WordPress site built around your needs.'], 'custom-web' => ['Custom web development', 'A website or application beyond WordPress.'], 'fixes' => ['One-time fixes', 'Resolve an issue or improve an existing website.'], 'support' => ['Ongoing support', 'Reliable care and improvements over time.'], 'unsure' => ['Help me decide', 'Let’s find the right approach together.']];
}
add_shortcode('dx_project_enquiry', function () {
 wp_enqueue_script('dx-project-enquiry', get_template_directory_uri() . '/assets/project-enquiry.js', [], filemtime(__DIR__ . '/../assets/project-enquiry.js'), true);
 wp_localize_script('dx-project-enquiry', 'DX_ENQUIRY', ['url' => admin_url('admin-ajax.php'), 'nonce' => wp_create_nonce('dx_project_enquiry')]);
 ob_start(); ?>
<section class="project-enquiry" aria-labelledby="enquiry-title">
 <a class="enquiry-back-site" href="<?php echo esc_url(home_url('/portfolio/')); ?>">← Back to the work</a>
 <header class="enquiry-heading"><p class="enquiry-eyebrow">Let’s work together</p><h1 id="enquiry-title">Your next chapter<br>starts here.</h1><p>Tell me what you have in mind. It’s fine if you’re still figuring it out.</p></header>
 <noscript><p>This guided form needs JavaScript. Please <a href="<?php echo esc_url(home_url('/contact/')); ?>">use the contact page</a> instead.</p></noscript>
 <form class="enquiry-form" method="post" novalidate>
 <ol class="enquiry-progress" aria-label="Enquiry progress"><li aria-current="step"><span>01</span> Your service</li><li><span>02</span> Your project</li><li><span>03</span> Your details</li></ol>
 <p class="enquiry-error" role="alert" hidden></p>
 <fieldset data-step="0"><legend>What can I help you with?</legend><p class="enquiry-hint">Choose the closest fit. We can work out the details together.</p><div class="enquiry-services">
 <?php foreach (dxndre_enquiry_services() as $key => $service) : ?><label class="enquiry-service"><input type="radio" name="service" value="<?php echo esc_attr($key); ?>" required><span><strong><?php echo esc_html($service[0]); ?></strong><small><?php echo esc_html($service[1]); ?></small></span></label><?php endforeach; ?>
 </div></fieldset>
 <fieldset data-step="1" hidden><legend>Tell me about your project.</legend><label class="enquiry-field"><span data-brief-label>What would you like to create?</span><textarea name="brief" rows="5" maxlength="5000" required placeholder="Your goals, ideas, or what needs attention…"></textarea></label><label class="enquiry-field"><span>Existing website <small>(optional)</small></span><input name="website" type="url" maxlength="500" placeholder="https://"></label><div class="enquiry-field-grid"><label class="enquiry-field"><span>Budget range</span><select name="budget" required><option value="">Choose a range</option><option>Under £1,000</option><option>£1,000–£3,000</option><option>£3,000–£5,000</option><option>£5,000–£10,000</option><option>£10,000+</option><option>Not sure yet</option></select></label><label class="enquiry-field"><span>Preferred timing</span><select name="timing" required><option value="">Choose a timeframe</option><option>As soon as possible</option><option>Within 1–3 months</option><option>Within 3–6 months</option><option>Just exploring</option><option>Not sure yet</option></select></label></div></fieldset>
 <fieldset data-step="2" hidden><legend>How can I reach you?</legend><div class="enquiry-field-grid"><label class="enquiry-field"><span>Your name</span><input name="name" autocomplete="name" maxlength="150" required></label><label class="enquiry-field"><span>Email address</span><input name="email" type="email" autocomplete="email" maxlength="254" required></label></div><label class="enquiry-field"><span>Company <small>(optional)</small></span><input name="company" autocomplete="organization" maxlength="150"></label><section class="enquiry-review" aria-label="Review your enquiry"><h2>Your enquiry</h2><div data-review></div><button type="button" class="enquiry-edit" data-edit="0">Edit service</button><button type="button" class="enquiry-edit" data-edit="1">Edit project</button></section><p class="enquiry-privacy">I’ll use your details to respond to this enquiry. <a href="<?php echo esc_url(home_url('/privacy-policy/')); ?>">Privacy policy</a></p></fieldset>
 <div class="enquiry-trap" aria-hidden="true"><label>Leave this field empty<input name="company_url" tabindex="-1" autocomplete="off"></label></div>
 <div class="enquiry-actions"><button type="button" data-back hidden>← Back</button><button type="button" data-next>Continue ↗</button><button type="submit" hidden>Send project enquiry ↗</button></div>
 <p class="enquiry-status" role="status" aria-live="polite"></p>
 </form><section class="enquiry-success" tabindex="-1" hidden><p class="enquiry-eyebrow">Enquiry received</p><h2>Thanks. Let’s make<br>something great.</h2><p>Your enquiry has been saved. I’ll review it and get back to you using the email address you provided.</p><a href="<?php echo esc_url(home_url('/portfolio/')); ?>">Explore the work ↗</a></section>
 <p class="enquiry-alternative">Prefer to talk it through? <a href="<?php echo esc_url(home_url('/book-a-call/')); ?>">Book a call ↗</a></p>
</section>
<?php return ob_get_clean();
});
function dxndre_receive_project_enquiry() {
 if (!check_ajax_referer('dx_project_enquiry', 'nonce', false)) wp_send_json_error(['message' => 'Please refresh this page and try again. Your answers are still here.'], 403);
 if (!empty($_POST['company_url'])) wp_send_json_error(['message' => 'Please leave the extra field empty.'], 400);
 $services = dxndre_enquiry_services();
 $data = [];
 foreach (['service','brief','website','budget','timing','name','email','company'] as $key) $data[$key] = isset($_POST[$key]) && is_scalar($_POST[$key]) ? sanitize_textarea_field(wp_unslash($_POST[$key])) : '';
 $budgets = ['Under £1,000','£1,000–£3,000','£3,000–£5,000','£5,000–£10,000','£10,000+','Not sure yet'];
 $timings = ['As soon as possible','Within 1–3 months','Within 3–6 months','Just exploring','Not sure yet'];
 if (!isset($services[$data['service']]) || !trim($data['brief']) || strlen($data['brief']) > 20000 || !trim($data['name']) || strlen($data['name']) > 600 || !is_email($data['email']) || !in_array($data['budget'], $budgets, true) || !in_array($data['timing'], $timings, true)) wp_send_json_error(['message' => 'Please check your service, project details and email address.'], 422);
 if ($data['website'] && (!filter_var($data['website'], FILTER_VALIDATE_URL) || !in_array(wp_parse_url($data['website'], PHP_URL_SCHEME), ['http','https'], true))) wp_send_json_error(['message' => 'Please use a complete website address beginning with https://.'], 422);
 $rate_key = 'dx_enquiry_' . hash_hmac('sha256', $_SERVER['REMOTE_ADDR'] ?? '', wp_salt());
 if ((int) get_transient($rate_key) >= 5) wp_send_json_error(['message' => 'Several enquiries have just been received. Please try again later.'], 429);
 $body = 'Service: ' . $services[$data['service']][0] . "\n\n";
 foreach (['name','email','company','website','budget','timing','brief'] as $key) $body .= ucfirst($key) . ': ' . $data[$key] . "\n\n";
 $id = wp_insert_post(['post_type' => 'project-enquiry', 'post_status' => 'private', 'post_title' => $data['name'] . ' — ' . $services[$data['service']][0], 'post_content' => $body], true);
 if (is_wp_error($id)) wp_send_json_error(['message' => 'Your enquiry could not be saved. Please try again.'], 500);
 set_transient($rate_key, (int) get_transient($rate_key) + 1, HOUR_IN_SECONDS);
 $sent = wp_mail(get_option('admin_email'), 'New project enquiry #' . $id, $body, ['Reply-To: ' . sanitize_email($data['email'])]);
 update_post_meta($id, '_notification_sent', $sent ? 'yes' : 'no');
 wp_send_json_success(['message' => 'Your enquiry has been received.']);
}
add_action('wp_ajax_dx_project_enquiry', 'dxndre_receive_project_enquiry');
add_action('wp_ajax_nopriv_dx_project_enquiry', 'dxndre_receive_project_enquiry');
