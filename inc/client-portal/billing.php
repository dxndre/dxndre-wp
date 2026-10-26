<?php
/**
 * Private project quotations, agreed balances and administrator-confirmed payments.
 * Calculator estimates remain indicative until an administrator issues an exact version.
 */
if (!defined('ABSPATH')) exit;

add_action('init', 'dxcp_register_billing_records');
function dxcp_register_billing_records() {
    $caps = array_fill_keys(['edit_post','read_post','delete_post','edit_posts','edit_others_posts','publish_posts','read_private_posts','delete_posts','delete_private_posts','delete_published_posts','delete_others_posts','edit_private_posts','edit_published_posts','create_posts'], 'manage_options');
    foreach (['dxcp_payment'=>['Project payments','Payment'], 'dxcp_deferral'=>['Payment deferrals','Deferral request']] as $type=>$labels) {
        register_post_type($type, ['labels'=>['name'=>$labels[0], 'singular_name'=>$labels[1]], 'public'=>false, 'publicly_queryable'=>false, 'show_ui'=>true, 'show_in_menu'=>'edit.php?post_type=dxcp_project', 'show_in_rest'=>false, 'supports'=>['title'], 'capabilities'=>$caps, 'map_meta_cap'=>false]);
    }
}

function dxcp_quote_ref($ref) {
    return is_scalar($ref) && preg_match('/\A[A-Za-z0-9][A-Za-z0-9_-]{0,49}\z/D', (string)$ref) ? (string)$ref : '';
}
function dxcp_quote_option($ref) { return 'dxcp_quote_' . hash('sha256', $ref); }
function dxcp_quote_assignment($ref) {
    $data = get_option(dxcp_quote_option($ref), []);
    return is_array($data) ? $data : [];
}
function dxcp_billing_raw_quote($ref) {
    $ref = dxcp_quote_ref($ref);
    if (!$ref || !function_exists('dx_get_quote_by_invoice')) return null;
    $row = dx_get_quote_by_invoice($ref);
    if (!$row || !isset($row->state, $row->total)) return null;
    $state = json_decode($row->state, true);
    if (!is_array($state) || !is_numeric($row->total) || !is_finite((float)$row->total) || (float)$row->total < 0) return null;
    $total = (int)round((float)$row->total * 100);
    if ($total > 100000000) return null;
    return ['row'=>$row, 'state'=>$state, 'total_cents'=>$total, 'version'=>hash('sha256', $row->state . '|' . $total . '|' . ($row->expires_at ?? ''))];
}
function dxcp_billing_project_owner($project_id) {
    return get_post_type($project_id) === 'dxcp_project' ? (int)get_post_meta($project_id, '_dxcp_client_id', true) : 0;
}
function dxcp_billing_https($url) {
    $url = esc_url_raw(is_scalar($url) ? (string)$url : '', ['https']);
    return $url && wp_parse_url($url, PHP_URL_SCHEME) === 'https' && wp_parse_url($url, PHP_URL_HOST) ? $url : '';
}
function dxcp_billing_date($value) {
    if (!is_string($value) || !preg_match('/\A\d{4}-\d{2}-\d{2}\z/D', $value)) return '';
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $value, wp_timezone());
    return $date && $date->format('Y-m-d') === $value ? $value : '';
}
function dxcp_billing_amount_cents($value) {
    if (!is_scalar($value) || !preg_match('/\A\d{1,7}(?:\.\d{1,2})?\z/D', trim((string)$value))) return null;
    $parts = explode('.', trim((string)$value));
    $cents = (int)$parts[0] * 100 + (int)str_pad($parts[1] ?? '', 2, '0');
    return $cents <= 100000000 ? $cents : null;
}

/** Safe public-to-the-theme representation; unassigned estimates require a secret claim. */
function dxcp_quote_data($ref) {
    $ref = dxcp_quote_ref($ref);
    $assignment = $ref ? dxcp_quote_assignment($ref) : [];
    $project_id = (int)($assignment['project_id'] ?? 0);
    if (!$project_id || !function_exists('dxcp_can_access') || !dxcp_can_access($project_id)) return null;
    if ((int)($assignment['client_id'] ?? 0) !== dxcp_billing_project_owner($project_id)) return null;
    $raw = dxcp_billing_raw_quote($ref);
    if (!$raw) return null;
    $version = $raw['version'];
    $final = !empty($assignment['final_ready']) && ($assignment['final_version'] ?? '') === $version;
    $accepted = $final && ($assignment['accepted_version'] ?? '') === $version;
    $confirmed = ($assignment['brief_version'] ?? '') === $version;
    $expires = (string)($raw['row']->expires_at ?? '');
    $expired = $expires !== '' && $expires < current_time('mysql');
    $state = $raw['state'];
    return [
        'ref'=>$ref, 'project_id'=>$project_id, 'total_cents'=>$raw['total_cents'], 'currency'=>'GBP',
        'service'=>sanitize_key($state['service'] ?? ''), 'payment_terms'=>function_exists('dx_payment_terms') ? wp_strip_all_tags(dx_payment_terms($state)) : '',
        'url'=>home_url('/proposal/' . rawurlencode($ref) . '/'), 'created_at'=>(string)($raw['row']->created_at ?? ''), 'expires_at'=>$expires,
        'version'=>$version, 'kind'=>$final ? 'final' : 'indicative', 'status'=>$accepted ? 'accepted' : ($final ? 'final_ready' : ($confirmed ? 'brief_confirmed' : 'indicative')),
        'can_accept'=>$final && !$accepted && !$expired && (int)($assignment['client_id']??0)===get_current_user_id(), 'expired'=>$expired, 'accepted_at'=>$accepted ? ($assignment['accepted_at'] ?? '') : '',
        'brief_confirmed_at'=>$confirmed ? ($assignment['brief_confirmed_at'] ?? '') : '',
        'previous_acceptance'=>!empty($assignment['accepted_version']) && !$accepted,
    ];
}
function dxcp_project_quotes($project_id) {
    if (!dxcp_can_access($project_id) || get_post_type($project_id) !== 'dxcp_project') return [];
    $refs = (array)get_post_meta($project_id, '_dxcp_quote_refs', true);
    $primary = dxcp_quote_ref(get_post_meta($project_id, '_dxcp_quote_ref', true));
    if ($primary) $refs[] = $primary;
    $quotes = [];
    foreach (array_slice(array_unique($refs), 0, 100) as $ref) {
        $q = dxcp_quote_data($ref);
        if ($q && $q['project_id'] === (int)$project_id) $quotes[] = $q;
    }
    usort($quotes, static function($a, $b) { return strcmp($b['created_at'], $a['created_at']); });
    return $quotes;
}

/** Atomic assignment never uses names, email, or a guessable invoice as client proof. */
function dxcp_billing_attach_quote($ref, $project_id, $client_id) {
    $ref = dxcp_quote_ref($ref);
    if (!$ref || !$client_id || dxcp_billing_project_owner($project_id) !== (int)$client_id || !dxcp_billing_raw_quote($ref)) return new WP_Error('invalid_quote', 'The estimate could not be linked.');
    $key = dxcp_quote_option($ref);
    $record = ['project_id'=>(int)$project_id, 'client_id'=>(int)$client_id, 'linked_at'=>current_time('mysql'), 'linked_by'=>get_current_user_id()];
    if (!add_option($key, $record, '', false)) {
        $existing = dxcp_quote_assignment($ref);
        if ((int)($existing['project_id'] ?? 0) !== (int)$project_id || (int)($existing['client_id'] ?? 0) !== (int)$client_id) return new WP_Error('already_linked', 'This estimate is already linked to a project.');
    }
    $refs = array_filter((array)get_post_meta($project_id, '_dxcp_quote_refs', true), 'dxcp_quote_ref');
    $refs[] = $ref;
    update_post_meta($project_id, '_dxcp_quote_refs', array_values(array_unique($refs)));
    if (!get_post_meta($project_id, '_dxcp_quote_ref', true)) update_post_meta($project_id, '_dxcp_quote_ref', $ref);
    return true;
}

function dxcp_billing_invalidate_quote($ref) {
    $assignment = dxcp_quote_assignment($ref);
    $raw = dxcp_billing_raw_quote($ref);
    if (!$assignment || !$raw) return;
    if (!empty($assignment['final_version']) && $assignment['final_version'] !== $raw['version']) {
        $assignment['final_ready'] = false;
        $assignment['revised_at'] = current_time('mysql');
        update_option(dxcp_quote_option($ref), $assignment, false);
    }
}

/** A linked quote is editable only by its assigned client or an administrator. */
function dxcp_billing_may_edit_quote($ref) {
    $assignment = dxcp_quote_assignment($ref);
    return !$assignment || current_user_can('manage_options') || (is_user_logged_in() && (int)($assignment['client_id'] ?? 0) === get_current_user_id() && dxcp_can_access((int)($assignment['project_id']??0)));
}
function dxcp_billing_guest_tokens() {
    $cookie = $_COOKIE['dxcp_estimate_claims'] ?? '';
    if (!is_string($cookie) || strlen($cookie) > 4096) return [];
    $tokens = json_decode(base64_decode(wp_unslash($cookie), true) ?: '', true);
    if (!is_array($tokens)) return [];
    return array_slice($tokens, -8, null, true);
}
function dxcp_claimable_estimates() {
    $refs = [];
    foreach (dxcp_billing_guest_tokens() as $ref=>$token) {
        $ref = dxcp_quote_ref($ref);
        $secret = $ref ? get_transient('dx_estimate_edit_' . $ref) : false;
        if ($ref && is_string($token) && is_string($secret) && hash_equals($secret, $token) && !dxcp_quote_assignment($ref) && dxcp_billing_raw_quote($ref)) $refs[] = $ref;
    }
    return $refs;
}
function dxcp_billing_remember_guest_estimate($ref) {
    if (is_user_logged_in() || headers_sent()) return;
    $token = get_transient('dx_estimate_edit_' . $ref);
    if (!is_string($token) || strlen($token) < 20 || strlen($token) > 100) return;
    $tokens = dxcp_billing_guest_tokens();
    unset($tokens[$ref]);
    $tokens[$ref] = $token;
    $tokens = array_slice($tokens, -8, null, true);
    $value = base64_encode(wp_json_encode($tokens));
    setcookie('dxcp_estimate_claims', $value, ['expires'=>time()+30*DAY_IN_SECONDS, 'path'=>defined('COOKIEPATH') && COOKIEPATH ? COOKIEPATH : '/', 'secure'=>is_ssl(), 'httponly'=>true, 'samesite'=>'Lax']);
    $_COOKIE['dxcp_estimate_claims'] = $value;
}

/** Called only after the calculator has successfully saved its trusted totals. */
add_action('dx_quote_finalized', 'dxcp_billing_quote_finalized', 10, 3);
function dxcp_billing_quote_finalized($ref, $state, $is_new = false) {
    $ref = dxcp_quote_ref($ref);
    if (!$ref) return;
    dxcp_billing_invalidate_quote($ref);
    dxcp_billing_remember_guest_estimate($ref);
    if (!$is_new || !is_user_logged_in() || current_user_can('manage_options') || dxcp_quote_assignment($ref)) return;
    $owner = get_current_user_id();
    $lock = 'dxcp_quote_create_' . hash('sha256', $ref);
    if (!add_option($lock, time(), '', false)) return;
    $source_service = sanitize_key($state['service'] ?? 'digital');
    $service = $source_service === 'photography' ? 'photography' : ($source_service === 'retainer' ? 'support' : 'digital');
    $project = wp_insert_post(['post_type'=>'dxcp_project', 'post_status'=>'private', 'post_author'=>$owner, 'post_title'=>'Project ' . $ref, 'meta_input'=>['_dxcp_client_id'=>$owner, '_dxcp_service'=>$service, '_dxcp_phase'=>'quotation', '_dxcp_quote_ref'=>$ref]], true);
    if (!is_wp_error($project)) {
        $attached = dxcp_billing_attach_quote($ref, $project, $owner);
        if (is_wp_error($attached)) wp_delete_post($project, true);
    }
    delete_option($lock);
}

function dxcp_billing_redirect($section, $notice, $project_id = 0) {
    if (function_exists('dxcp_notice_redirect')) dxcp_notice_redirect($section, $notice, $project_id);
    wp_safe_redirect(add_query_arg(['section'=>$section, 'notice'=>$notice, 'project'=>$project_id], home_url('/dashboard/')));
    exit;
}
function dxcp_billing_require_form($action) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !is_user_logged_in() || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_wpnonce'] ?? '')), $action)) wp_die('Your session expired. Reload the dashboard and try again.', '', ['response'=>403]);
    $id = absint($_POST['project_id'] ?? 0);
    if (!$id || get_post_type($id) !== 'dxcp_project' || !dxcp_can_access($id)) wp_die('This project is unavailable.', '', ['response'=>403]);
    return $id;
}
add_action('admin_post_dxcp_quote_claim', 'dxcp_billing_claim_form');
function dxcp_billing_claim_quote($project_id, $ref, $token = '') {
    $uid = get_current_user_id();
    if (!$uid || !dxcp_can_access($project_id) || dxcp_billing_project_owner($project_id) !== $uid) return new WP_Error('not_owner', 'Only the assigned client can claim an estimate.');
    $ref = dxcp_quote_ref($ref);
    if ($token === '') $token = dxcp_billing_guest_tokens()[$ref] ?? '';
    $secret = $ref ? get_transient('dx_estimate_edit_' . $ref) : false;
    if (!$ref || !is_string($token) || strlen($token) < 20 || strlen($token) > 100 || !is_string($secret) || !hash_equals($secret, $token)) return new WP_Error('invalid_claim', 'The estimate could not be linked.');
    return dxcp_billing_attach_quote($ref, $project_id, $uid);
}
function dxcp_billing_claim_form() {
    if ($_SERVER['REQUEST_METHOD']!=='POST' || !is_user_logged_in() || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_wpnonce']??'')),'dxcp_quote_claim')) wp_die('Please sign in and try again.','Access denied',['response'=>403]);
    $uid=get_current_user_id();
    $project_id=absint($_POST['project_id']??0);
    $attempt_key='dxcp_claim_attempts_'.$uid;
    $attempts=(int)get_transient($attempt_key);
    if($attempts>=10) dxcp_billing_redirect('payments','claim_limited',$project_id);
    set_transient($attempt_key,$attempts+1,15*MINUTE_IN_SECONDS);
    $ref=dxcp_quote_ref(wp_unslash($_POST['quote_ref']??''));
    $token=is_string($_POST['estimate_token']??null)?wp_unslash($_POST['estimate_token']):'';
    if(!$project_id) {
        $created=dxcp_billing_claim_first_project($ref,$token);
        dxcp_billing_redirect('payments',is_wp_error($created)?'claim_invalid':'quote_linked',is_wp_error($created)?0:$created);
    }
    if(!dxcp_project_for_user($project_id) || dxcp_billing_project_owner($project_id)!==$uid) wp_die('Only the assigned client can claim this estimate.','Access denied',['response'=>403]);
    $result=dxcp_billing_claim_quote($project_id,$ref,$token);
    dxcp_billing_redirect('payments',is_wp_error($result)?'claim_invalid':'quote_linked',$project_id);
}

/** Intent is either confirming an indicative brief or accepting an issued final version. */
function dxcp_billing_quote_intent($project_id, $ref, $intent, $version, $confirmed = false) {
    if (!dxcp_can_access($project_id) || dxcp_billing_project_owner($project_id) !== get_current_user_id()) return new WP_Error('not_owner', 'Only the assigned client can confirm a quotation.');
    $quote = dxcp_quote_data($ref);
    if (!$quote || $quote['project_id'] !== (int)$project_id || !hash_equals($quote['version'], (string)$version)) return new WP_Error('stale_quote', 'The estimate has changed. Review the latest version.');
    $assignment = dxcp_quote_assignment($ref);
    $raw = dxcp_billing_raw_quote($ref);
    if ($intent === 'confirm_brief') {
        if (($assignment['brief_version'] ?? '') === $version) return true;
        $assignment['brief_version'] = $version;
        $assignment['brief_confirmed_at'] = current_time('mysql');
        $event = 'brief_confirmed';
    } elseif ($intent === 'accept_final') {
        if (!$confirmed || !$quote['can_accept']) return new WP_Error('not_final', 'Review the issued final quotation and confirm your acceptance.');
        $assignment['accepted_version'] = $version;
        $assignment['accepted_at'] = current_time('mysql');
        $event = 'final_accepted';
    } else return new WP_Error('invalid_intent', 'Choose a valid quotation action.');
    // Append-only evidence remains after revisions; never overwrite an old acceptance snapshot.
    add_post_meta($project_id, '_dxcp_quote_audit', ['event'=>$event, 'ref'=>$ref, 'version'=>$version, 'user_id'=>get_current_user_id(), 'at'=>current_time('mysql'), 'total_cents'=>$raw['total_cents'], 'state'=>$raw['state']], false);
    update_option(dxcp_quote_option($ref), $assignment, false);
    return true;
}
add_action('admin_post_dxcp_quote_action', 'dxcp_billing_quote_action_form');
function dxcp_billing_quote_action_form() {
    $project_id = dxcp_billing_require_form('dxcp_quote_action');
    $result = dxcp_billing_quote_intent($project_id, dxcp_quote_ref(wp_unslash($_POST['quote_ref'] ?? '')), sanitize_key($_POST['intent'] ?? ''), sanitize_text_field(wp_unslash($_POST['version'] ?? '')), ($_POST['confirmation'] ?? '') === '1');
    dxcp_billing_redirect('quotations', is_wp_error($result) ? 'quote_changed' : 'quote_confirmed', $project_id);
}

/** Pending requests do not change balances, agreements or due dates. */
function dxcp_billing_request_deferral($project_id, $payment_id, $date, $reason) {
    if (!dxcp_can_access($project_id) || dxcp_billing_project_owner($project_id) !== get_current_user_id()) return new WP_Error('not_owner', 'The payment is unavailable.');
    if (get_post_type($payment_id) !== 'dxcp_payment' || (int)get_post_meta($payment_id, '_dxcp_project_id', true) !== (int)$project_id || get_post_meta($payment_id, '_dxcp_payment_status', true) !== 'pending') return new WP_Error('invalid_payment', 'Only an outstanding project payment can be reviewed.');
    $date = dxcp_billing_date($date);
    $reason = sanitize_textarea_field($reason);
    $today = wp_date('Y-m-d');
    $limit = wp_date('Y-m-d', strtotime('+1 year'));
    if (!$date || $date <= $today || $date > $limit || strlen($reason) < 10 || strlen($reason) > 2000) return new WP_Error('invalid_request', 'Choose a future date within one year and add a reason of 10–2,000 characters.');
    $existing = get_posts(['post_type'=>'dxcp_deferral', 'post_status'=>['private','publish'], 'numberposts'=>1, 'fields'=>'ids', 'meta_query'=>[['key'=>'_dxcp_payment_id','value'=>$payment_id], ['key'=>'_dxcp_deferral_status','value'=>'pending']]]);
    if ($existing) return new WP_Error('duplicate_request', 'This payment already has a request awaiting review.');
    $lock = 'dxcp_deferral_lock_' . absint($payment_id);
    if (!add_option($lock, time(), '', false)) return new WP_Error('duplicate_request', 'A request is already being saved.');
    $existing = get_posts(['post_type'=>'dxcp_deferral', 'post_status'=>['private','publish'], 'numberposts'=>1, 'fields'=>'ids', 'meta_query'=>[['key'=>'_dxcp_payment_id','value'=>$payment_id], ['key'=>'_dxcp_deferral_status','value'=>'pending']]]);
    if ($existing) { delete_option($lock); return new WP_Error('duplicate_request', 'This payment already has a request awaiting review.'); }
    $id = wp_insert_post(['post_type'=>'dxcp_deferral', 'post_status'=>'private', 'post_author'=>get_current_user_id(), 'post_title'=>'Payment review · ' . get_the_title($project_id), 'meta_input'=>['_dxcp_project_id'=>(int)$project_id, '_dxcp_payment_id'=>(int)$payment_id, '_dxcp_requested_date'=>$date, '_dxcp_deferral_reason'=>$reason, '_dxcp_deferral_status'=>'pending', '_dxcp_requested_at'=>current_time('mysql')]], true);
    delete_option($lock);
    return $id;
}
add_action('admin_post_dxcp_deferral', 'dxcp_billing_deferral_form');
function dxcp_billing_deferral_form() {
    $project_id = dxcp_billing_require_form('dxcp_deferral');
    $result = dxcp_billing_request_deferral($project_id, absint($_POST['payment_id'] ?? 0), sanitize_text_field(wp_unslash($_POST['requested_date'] ?? '')), wp_unslash($_POST['reason'] ?? ''));
    dxcp_billing_redirect('payments', is_wp_error($result) ? 'deferral_invalid' : 'deferral_requested', $project_id);
}

function dxcp_billing_data($project_id) {
    if (get_post_type($project_id) !== 'dxcp_project' || !dxcp_can_access($project_id)) return [];
    $stored = get_post_meta($project_id, '_dxcp_agreed_total_cents', true);
    $total = $stored === '' ? null : max(0, (int)$stored);
    $out = ['currency'=>'GBP', 'agreed_total_cents'=>$total, 'paid_cents'=>0, 'balance_cents'=>null, 'payments'=>[], 'next_due'=>null, 'deferrals'=>[], 'agreement_document_id'=>absint(get_post_meta($project_id, '_dxcp_agreement_document_id', true)), 'agreement_url'=>dxcp_billing_https(get_post_meta($project_id, '_dxcp_agreement_url', true)), 'agreement_title'=>sanitize_text_field(get_post_meta($project_id, '_dxcp_agreement_title', true)), 'payment_url'=>dxcp_billing_https(get_post_meta($project_id, '_dxcp_payment_url', true))];
    $agreement_doc = $out['agreement_document_id'];
    if ($agreement_doc && get_post_type($agreement_doc)==='dxcp_document' && (int)get_post_meta($agreement_doc,'_dxcp_project_id',true)===(int)$project_id) $out['agreement_url'] = dxcp_document_url($agreement_doc) ?: $out['agreement_url'];
    $payments = get_posts(['post_type'=>'dxcp_payment', 'post_status'=>['private','publish'], 'numberposts'=>-1, 'meta_key'=>'_dxcp_project_id', 'meta_value'=>$project_id, 'orderby'=>'date', 'order'=>'ASC']);
    foreach ($payments as $p) {
        $status = get_post_meta($p->ID, '_dxcp_payment_status', true);
        if (!in_array($status, ['paid','pending','cancelled'], true)) continue;
        $row = ['id'=>$p->ID, 'title'=>get_the_title($p), 'amount_cents'=>max(0, (int)get_post_meta($p->ID, '_dxcp_amount_cents', true)), 'due_date'=>dxcp_billing_date(get_post_meta($p->ID, '_dxcp_due_date', true)), 'status'=>$status, 'paid_date'=>dxcp_billing_date(get_post_meta($p->ID, '_dxcp_paid_date', true)), 'recurrence'=>sanitize_text_field(get_post_meta($p->ID, '_dxcp_recurrence', true)), 'payment_url'=>dxcp_billing_https(get_post_meta($p->ID, '_dxcp_payment_url', true))];
        if ($status === 'paid') $out['paid_cents'] += $row['amount_cents'];
        $out['payments'][] = $row;
    }
    usort($out['payments'], static function($a,$b) { return strcmp($a['due_date'] ?: '9999', $b['due_date'] ?: '9999'); });
    foreach ($out['payments'] as $p) if ($p['status'] === 'pending' && $p['due_date']) { $out['next_due'] = $p; break; }
    if ($total !== null) $out['balance_cents'] = max(0, $total - $out['paid_cents']);
    $requests = get_posts(['post_type'=>'dxcp_deferral', 'post_status'=>['private','publish'], 'numberposts'=>100, 'meta_key'=>'_dxcp_project_id', 'meta_value'=>$project_id]);
    foreach ($requests as $d) $out['deferrals'][] = ['id'=>$d->ID, 'payment_id'=>absint(get_post_meta($d->ID, '_dxcp_payment_id', true)), 'requested_date'=>dxcp_billing_date(get_post_meta($d->ID, '_dxcp_requested_date', true)), 'reason'=>sanitize_textarea_field(get_post_meta($d->ID, '_dxcp_deferral_reason', true)), 'status'=>sanitize_key(get_post_meta($d->ID, '_dxcp_deferral_status', true)) ?: 'pending', 'decision_note'=>sanitize_textarea_field(get_post_meta($d->ID, '_dxcp_decision_note', true))];
    return $out;
}

add_action('add_meta_boxes', 'dxcp_billing_metaboxes');
function dxcp_billing_metaboxes() {
    add_meta_box('dxcp-project-billing', 'Quotation & payment agreement', 'dxcp_billing_project_box', 'dxcp_project', 'normal', 'default');
    add_meta_box('dxcp-payment-record', 'Confirmed payment schedule', 'dxcp_billing_payment_box', 'dxcp_payment', 'normal', 'high');
    add_meta_box('dxcp-deferral-review', 'Review payment deferral', 'dxcp_billing_deferral_box', 'dxcp_deferral', 'normal', 'high');
}
function dxcp_billing_admin_field($label, $name, $value, $type = 'text') {
    echo '<p><label><strong>' . esc_html($label) . '</strong><br><input class="widefat" type="' . esc_attr($type) . '" name="' . esc_attr($name) . '" value="' . esc_attr($value) . '"></label></p>';
}
function dxcp_billing_project_box($post) {
    if (!current_user_can('manage_options')) return;
    wp_nonce_field('dxcp_save_billing', '_dxcp_billing_nonce');
    $total = get_post_meta($post->ID, '_dxcp_agreed_total_cents', true);
    dxcp_billing_admin_field('Agreed project total (£); leave blank until agreed', 'dxcp_agreed_total', $total === '' ? '' : number_format((int)$total / 100, 2, '.', ''));
    dxcp_billing_admin_field('Hosted payment URL (HTTPS, optional)', 'dxcp_payment_url', get_post_meta($post->ID, '_dxcp_payment_url', true), 'url');
    dxcp_billing_admin_field('Payment agreement document ID (private Drive document)', 'dxcp_agreement_document_id', get_post_meta($post->ID, '_dxcp_agreement_document_id', true), 'number');
    dxcp_billing_admin_field('Agreement title', 'dxcp_agreement_title', get_post_meta($post->ID, '_dxcp_agreement_title', true));
    dxcp_billing_admin_field('External agreement URL (HTTPS, optional)', 'dxcp_agreement_url', get_post_meta($post->ID, '_dxcp_agreement_url', true), 'url');
    dxcp_billing_admin_field('Link an existing calculator estimate reference', 'dxcp_quote_link', '');
    echo '<p>Only link an estimate after confirming the client assignment. This does not issue a final quotation or create a payment schedule.</p>';
    $quotes = dxcp_project_quotes($post->ID);
    foreach ($quotes as $q) {
        echo '<p><strong>' . esc_html($q['ref']) . '</strong> · £' . esc_html(number_format($q['total_cents']/100,2)) . ' · ' . esc_html(str_replace('_',' ',$q['status'])) . '<br><label><input type="checkbox" name="dxcp_issue_final[]" value="' . esc_attr($q['ref']) . '"> Issue this exact version as the final quotation, with its scope, total and payment terms confirmed.</label></p>';
        if ($q['previous_acceptance']) echo '<p><strong>Revised since an earlier acceptance.</strong> A fresh final issue and client acceptance are required.</p>';
    }
    $audit = get_post_meta($post->ID, '_dxcp_quote_audit', false);
    if ($audit) {
        echo '<details><summary>Quotation audit (' . count($audit) . ' records)</summary><ul>';
        foreach (array_slice(array_reverse($audit),0,30) as $event) echo '<li>' . esc_html(($event['at']??'') . ' · ' . ($event['ref']??'') . ' · ' . str_replace('_',' ', $event['event']??'') . ' · user ' . ($event['user_id']??0) . ' · version ' . substr($event['version']??'',0,12)) . '</li>';
        echo '</ul></details>';
    }
}
function dxcp_billing_payment_box($post) {
    wp_nonce_field('dxcp_save_billing', '_dxcp_billing_nonce');
    dxcp_billing_admin_field('Project ID', 'dxcp_project_id', get_post_meta($post->ID, '_dxcp_project_id', true), 'number');
    $amount = get_post_meta($post->ID, '_dxcp_amount_cents', true);
    dxcp_billing_admin_field('Amount (£)', 'dxcp_amount', $amount === '' ? '' : number_format((int)$amount/100,2,'.',''));
    dxcp_billing_admin_field('Confirmed due date (no automatic recurrence is generated)', 'dxcp_due_date', get_post_meta($post->ID, '_dxcp_due_date', true), 'date');
    echo '<p><label>Status <select name="dxcp_payment_status">';
    foreach (['pending'=>'Pending','paid'=>'Paid — record only after receipt','cancelled'=>'Cancelled'] as $key=>$label) echo '<option value="' . esc_attr($key) . '" ' . selected(get_post_meta($post->ID,'_dxcp_payment_status',true),$key,false) . '>' . esc_html($label) . '</option>';
    echo '</select></label></p>';
    dxcp_billing_admin_field('Payment received date (required for Paid)', 'dxcp_paid_date', get_post_meta($post->ID, '_dxcp_paid_date', true), 'date');
    dxcp_billing_admin_field('Schedule label, e.g. Monthly support — November', 'dxcp_recurrence', get_post_meta($post->ID, '_dxcp_recurrence', true));
    dxcp_billing_admin_field('Payment URL (HTTPS, optional)', 'dxcp_payment_url', get_post_meta($post->ID, '_dxcp_payment_url', true), 'url');
    echo '<p>This is an administrator-maintained ledger. Saving a payment record does not charge a card or send an invoice.</p>';
}
function dxcp_billing_deferral_box($post) {
    wp_nonce_field('dxcp_save_billing', '_dxcp_billing_nonce');
    $pid = absint(get_post_meta($post->ID, '_dxcp_project_id', true));
    $payment = absint(get_post_meta($post->ID, '_dxcp_payment_id', true));
    echo '<p>Project: ' . esc_html(get_the_title($pid)) . ' · payment #' . $payment . '</p><p>Requested date: ' . esc_html(get_post_meta($post->ID, '_dxcp_requested_date', true)) . '</p><p>' . nl2br(esc_html(get_post_meta($post->ID, '_dxcp_deferral_reason', true))) . '</p>';
    echo '<p><label>Decision <select name="dxcp_deferral_status">';
    foreach (['pending'=>'Awaiting review','approved'=>'Approved','declined'=>'Declined'] as $key=>$label) echo '<option value="' . esc_attr($key) . '" ' . selected(get_post_meta($post->ID,'_dxcp_deferral_status',true),$key,false) . '>' . esc_html($label) . '</option>';
    echo '</select></label></p><p><label>Decision note<br><textarea class="widefat" rows="3" name="dxcp_decision_note">' . esc_textarea(get_post_meta($post->ID, '_dxcp_decision_note', true)) . '</textarea></label></p><p><label><input type="checkbox" name="dxcp_apply_deferral_date" value="1"> If approved, explicitly change the outstanding payment’s due date to the requested date.</label></p><p>Approving alone records the decision. It never changes the agreed total or marks a payment as received.</p>';
}
add_action('save_post', 'dxcp_billing_save_admin', 30, 2);
function dxcp_billing_save_admin($post_id, $post) {
    if (!in_array($post->post_type, ['dxcp_project','dxcp_payment','dxcp_deferral'], true) || !current_user_can('manage_options') || wp_is_post_revision($post_id) || (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_dxcp_billing_nonce'] ?? '')), 'dxcp_save_billing')) return;
    if ($post->post_type === 'dxcp_project') {
        $input = trim((string)wp_unslash($_POST['dxcp_agreed_total'] ?? ''));
        $total = dxcp_billing_amount_cents($input);
        if ($input === '') delete_post_meta($post_id, '_dxcp_agreed_total_cents');
        elseif ($total !== null) update_post_meta($post_id, '_dxcp_agreed_total_cents', $total);
        foreach (['payment_url','agreement_url'] as $field) update_post_meta($post_id, '_dxcp_' . $field, dxcp_billing_https(wp_unslash($_POST['dxcp_' . $field] ?? '')));
        update_post_meta($post_id, '_dxcp_agreement_title', sanitize_text_field(wp_unslash($_POST['dxcp_agreement_title'] ?? '')));
        $doc = absint($_POST['dxcp_agreement_document_id'] ?? 0);
        if (!$doc || (int)get_post_meta($doc, '_dxcp_project_id', true) === $post_id) update_post_meta($post_id, '_dxcp_agreement_document_id', $doc);
        $ref = dxcp_quote_ref(wp_unslash($_POST['dxcp_quote_link'] ?? ''));
        if ($ref) dxcp_billing_attach_quote($ref, $post_id, dxcp_billing_project_owner($post_id));
        foreach (array_slice((array)($_POST['dxcp_issue_final'] ?? []),0,100) as $ref) {
            $ref = dxcp_quote_ref(wp_unslash($ref));
            $assignment = $ref ? dxcp_quote_assignment($ref) : [];
            $raw = $ref ? dxcp_billing_raw_quote($ref) : null;
            if (!$raw || (int)($assignment['project_id'] ?? 0) !== $post_id || ($raw['row']->expires_at ?? '') < current_time('mysql')) continue;
            $assignment['final_ready'] = true;
            $assignment['final_version'] = $raw['version'];
            $assignment['final_issued_at'] = current_time('mysql');
            $assignment['final_issued_by'] = get_current_user_id();
            update_option(dxcp_quote_option($ref), $assignment, false);
            add_post_meta($post_id, '_dxcp_quote_audit', ['event'=>'final_issued','ref'=>$ref,'version'=>$raw['version'],'at'=>current_time('mysql'),'user_id'=>get_current_user_id(),'total_cents'=>$raw['total_cents'],'state'=>$raw['state']], false);
        }
    } elseif ($post->post_type === 'dxcp_payment') {
        $pid = absint($_POST['dxcp_project_id'] ?? 0);
        $amount = dxcp_billing_amount_cents(wp_unslash($_POST['dxcp_amount'] ?? ''));
        $status = sanitize_key($_POST['dxcp_payment_status'] ?? 'pending');
        $paid = dxcp_billing_date(wp_unslash($_POST['dxcp_paid_date'] ?? ''));
        if (!dxcp_billing_project_owner($pid) || $amount === null || !in_array($status, ['pending','paid','cancelled'], true) || ($status === 'paid' && !$paid)) return;
        update_post_meta($post_id, '_dxcp_project_id', $pid);
        update_post_meta($post_id, '_dxcp_amount_cents', $amount);
        update_post_meta($post_id, '_dxcp_payment_status', $status);
        update_post_meta($post_id, '_dxcp_due_date', dxcp_billing_date(wp_unslash($_POST['dxcp_due_date'] ?? '')));
        update_post_meta($post_id, '_dxcp_paid_date', $status === 'paid' ? $paid : '');
        update_post_meta($post_id, '_dxcp_recurrence', sanitize_text_field(wp_unslash($_POST['dxcp_recurrence'] ?? '')));
        update_post_meta($post_id, '_dxcp_payment_url', dxcp_billing_https(wp_unslash($_POST['dxcp_payment_url'] ?? '')));
        add_post_meta($post_id, '_dxcp_payment_audit', ['at'=>current_time('mysql'),'by'=>get_current_user_id(),'status'=>$status,'amount_cents'=>$amount,'due_date'=>get_post_meta($post_id,'_dxcp_due_date',true),'paid_date'=>$paid], false);
    } else {
        $status = sanitize_key($_POST['dxcp_deferral_status'] ?? 'pending');
        if (!in_array($status,['pending','approved','declined'],true)) return;
        update_post_meta($post_id, '_dxcp_deferral_status', $status);
        update_post_meta($post_id, '_dxcp_decision_note', sanitize_textarea_field(wp_unslash($_POST['dxcp_decision_note'] ?? '')));
        update_post_meta($post_id, '_dxcp_reviewed_by', get_current_user_id());
        update_post_meta($post_id, '_dxcp_reviewed_at', current_time('mysql'));
        $payment = absint(get_post_meta($post_id, '_dxcp_payment_id', true));
        $pid = absint(get_post_meta($post_id, '_dxcp_project_id', true));
        $date = dxcp_billing_date(get_post_meta($post_id, '_dxcp_requested_date', true));
        if ($status === 'approved' && ($_POST['dxcp_apply_deferral_date'] ?? '') === '1' && $date && get_post_type($payment) === 'dxcp_payment' && (int)get_post_meta($payment, '_dxcp_project_id', true) === $pid && get_post_meta($payment, '_dxcp_payment_status', true) === 'pending') {
            add_post_meta($payment, '_dxcp_payment_audit', ['at'=>current_time('mysql'),'by'=>get_current_user_id(),'event'=>'due_date_deferred','from'=>get_post_meta($payment,'_dxcp_due_date',true),'to'=>$date,'deferral_id'=>$post_id], false);
            update_post_meta($payment, '_dxcp_due_date', $date);
        }
    }
}

// Linked client quotations and their PDFs share the same account boundary as the workspace.
add_action('template_redirect', function () {
    $ref = get_query_var('dx_proposal');
    if (!$ref) return;
    $assignment = dxcp_quote_assignment(dxcp_quote_ref($ref));
    if (!$assignment) return;
    nocache_headers();
    header('Cache-Control: private, no-store, max-age=0');
    header('X-Robots-Tag: noindex, nofollow');
    if (!is_user_logged_in()) {
        wp_safe_redirect(add_query_arg('redirect_to', home_url('/proposal/'.rawurlencode($ref).'/'), home_url('/login/')));
        exit;
    }
    if (!current_user_can('manage_options') && ((int)($assignment['client_id']??0)!==get_current_user_id() || !dxcp_can_access((int)($assignment['project_id'] ?? 0)))) wp_die('This quotation is not available to your account.', 'Access denied', ['response'=>403]);
}, 0);

/** A verified calculator secret can create a client's first project without trusting an invoice alone. */
function dxcp_billing_claim_first_project($ref, $token = '') {
    $uid=get_current_user_id(); $user=wp_get_current_user();
    if (!$uid || !array_intersect(['client','subscriber'],(array)$user->roles)) return new WP_Error('not_client','Please use your client account.');
    $ref=dxcp_quote_ref($ref); if($token==='')$token=dxcp_billing_guest_tokens()[$ref]??'';
    $secret=$ref?get_transient('dx_estimate_edit_'.$ref):false;
    $raw=$ref?dxcp_billing_raw_quote($ref):null;
    if(!$raw || !is_string($token) || !is_string($secret) || strlen($token)<20 || !hash_equals($secret,$token)) return new WP_Error('invalid_claim','The estimate could not be verified.');
    $assigned=dxcp_quote_assignment($ref);
    if($assigned) return (int)($assigned['client_id']??0)===$uid ? (int)$assigned['project_id'] : new WP_Error('already_linked','This estimate is already linked.');
    $lock='dxcp_quote_create_'.hash('sha256',$ref);
    if(!add_option($lock,time(),'',false))return new WP_Error('busy','Please try again.');
    $source=sanitize_key($raw['state']['service']??'digital');$service=$source==='photography'?'photography':($source==='retainer'?'support':'digital');
    $id=wp_insert_post(['post_type'=>'dxcp_project','post_status'=>'private','post_author'=>$uid,'post_title'=>'Project '.$ref,'meta_input'=>['_dxcp_client_id'=>$uid,'_dxcp_service'=>$service,'_dxcp_phase'=>'quotation']],true);
    if(!is_wp_error($id)) { $linked=dxcp_billing_attach_quote($ref,$id,$uid); if(is_wp_error($linked)){wp_delete_post($id,true);$id=$linked;} }
    delete_option($lock);return $id;
}
