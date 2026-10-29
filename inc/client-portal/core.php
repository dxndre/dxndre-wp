<?php
/** Private client workspace records and safe, authenticated document delivery. */
if (!defined('ABSPATH')) exit;

function dxcp_is_admin($uid = 0) {
    $uid = $uid ?: get_current_user_id();
    return $uid > 0 && user_can($uid, 'manage_options');
}

/** The comprehensive business/admin workspace belongs to this site owner only. */
function dxcp_is_site_owner($uid = 0) {
    $uid = $uid ?: get_current_user_id();
    $user = $uid ? get_userdata($uid) : null;
    return $user && $user->user_login === 'dxndre' && user_can($uid, 'manage_options');
}

function dxcp_time_greeting($timestamp = null) {
    $hour = (int) wp_date('G', $timestamp, new DateTimeZone('Europe/London'));
    return $hour < 12 ? 'Good morning' : ($hour < 18 ? 'Good afternoon' : 'Good evening');
}

function dxcp_upload_limit() { return 5 * MB_IN_BYTES; }
function dxcp_upload_hint() { return 'Files can be up to 5 MB. For a larger file, add a shareable cloud-storage link in your message or ask your project partner for a file-sharing link.'; }

function dxcp_is_client_user($uid = 0) {
    $uid = $uid ?: get_current_user_id();
    if (!$uid || !($user = get_userdata($uid))) return false;
    if (dxcp_is_admin($uid) || in_array('client', (array) $user->roles, true)) return true;
    if (!in_array('subscriber', (array) $user->roles, true)) return false;
    if (function_exists('dxcp_claimable_estimates') && dxcp_claimable_estimates()) return true;
    return (bool) get_posts([
        'post_type' => 'dxcp_project', 'post_status' => ['publish','private','draft','pending','future'],
        'posts_per_page' => 1, 'fields' => 'ids', 'meta_key' => '_dxcp_client_id', 'meta_value' => $uid,
    ]);
}

/** All front-end record checks flow through this function, including downloads. */
function dxcp_can_access($post_or_id, $uid = 0, $seen = []) {
    $uid = $uid ?: get_current_user_id();
    if (!$uid) return false;
    $post = get_post($post_or_id);
    if (!$post || in_array($post->post_status, ['trash','auto-draft'], true)) return false;
    if (dxcp_is_admin($uid)) return true;
    if (!dxcp_is_client_user($uid) || count($seen) > 8 || in_array((int) $post->ID, $seen, true)) return false;
    $seen[] = (int) $post->ID;
    if ($post->post_type === 'dxcp_project') return (int) get_post_meta($post->ID, '_dxcp_client_id', true) === (int) $uid;
    if ($post->post_type === 'ticket') {
        $client = get_post_meta($post->ID, 'ticket_client', true);
        if (is_array($client)) $client = $client['ID'] ?? reset($client);
        return (int) $post->post_author === (int) $uid || (int) $client === (int) $uid;
    }
    $project_id = absint(get_post_meta($post->ID, '_dxcp_project_id', true));
    if ($project_id) {
        $project = get_post($project_id);
        return $project && $project->post_type === 'dxcp_project' && dxcp_can_access($project, $uid, $seen);
    }
    $parent_id = absint(get_post_meta($post->ID, '_dxcp_parent_id', true));
    if ($parent_id) return dxcp_can_access($parent_id, $uid, $seen);
    return strpos($post->post_type, 'dxcp_') === 0 && (int) get_post_meta($post->ID, '_dxcp_client_id', true) === (int) $uid;
}

function dxcp_project_for_user($id, $uid = 0) {
    $post = get_post(absint($id));
    return $post && $post->post_type === 'dxcp_project' && dxcp_can_access($post, $uid) ? $post : null;
}

function dxcp_projects($uid = 0) {
    $uid = $uid ?: get_current_user_id();
    if (!dxcp_is_client_user($uid)) return [];
    $args = ['post_type'=>'dxcp_project','post_status'=>['publish','private','draft','pending','future'], 'posts_per_page'=>100,'orderby'=>'modified','order'=>'DESC'];
    if (!dxcp_is_admin($uid)) { $args['meta_key'] = '_dxcp_client_id'; $args['meta_value'] = $uid; }
    return get_posts($args);
}

function dxcp_documents($project_id) {
    if (!dxcp_project_for_user($project_id)) return [];
    $docs = get_posts(['post_type'=>'dxcp_document','post_status'=>['private','publish'],'posts_per_page'=>200,'orderby'=>'date','order'=>'DESC','meta_key'=>'_dxcp_project_id','meta_value'=>absint($project_id)]);
    return array_values(array_filter($docs, function($doc) { return !absint(get_post_meta($doc->ID, '_dxcp_parent_id', true)); }));
}

function dxcp_sessions($project_id) {
    if (!dxcp_project_for_user($project_id)) return [];
    return get_posts(['post_type'=>'dxcp_session','post_status'=>['private','publish'],'posts_per_page'=>200,'orderby'=>'meta_value','order'=>'ASC','meta_key'=>'_dxcp_start','meta_query'=>[['key'=>'_dxcp_project_id','value'=>absint($project_id)]]]);
}

function dxcp_money($cents) { return '£' . number_format(((int) $cents) / 100, 2, '.', ','); }

function dxcp_session_timestamp($value) {
    if (!is_string($value) || !preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/D', $value)) return 0;
    $date = DateTimeImmutable::createFromFormat('!Y-m-d\TH:i', $value, new DateTimeZone('Europe/London'));
    $errors = DateTimeImmutable::getLastErrors();
    return $date && (!$errors || (!$errors['warning_count'] && !$errors['error_count'])) && $date->format('Y-m-d\TH:i') === $value ? $date->getTimestamp() : 0;
}

function dxcp_private_dir() { return dirname(untrailingslashit(ABSPATH)) . '/dxndre-private-client-files'; }

function dxcp_upload_mimes() {
    return ['jpg|jpeg|jpe'=>'image/jpeg','png'=>'image/png','gif'=>'image/gif','webp'=>'image/webp','pdf'=>'application/pdf','txt'=>'text/plain','docx'=>'application/vnd.openxmlformats-officedocument.wordprocessingml.document','xlsx'=>'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','pptx'=>'application/vnd.openxmlformats-officedocument.presentationml.presentation','mp4|m4v'=>'video/mp4','mov|qt'=>'video/quicktime','mp3'=>'audio/mpeg','m4a'=>'audio/mp4','ogg|oga'=>'audio/ogg','wav'=>'audio/wav','webm'=>'video/webm'];
}

function dxcp_validate_upload($file) {
    if (is_array($file) && in_array((int)($file['error'] ?? -1), [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)) return new WP_Error('upload_size', dxcp_upload_hint());
    if (!is_array($file) || !isset($file['error']) || (int) $file['error'] !== UPLOAD_ERR_OK) return new WP_Error('upload_failed','The file could not be uploaded. Please choose it again.');
    if (empty($file['tmp_name']) || !is_file($file['tmp_name']) || empty($file['name'])) return new WP_Error('upload_missing','Please select a file.');
    $size = filesize($file['tmp_name']);
    if (!$size || $size > dxcp_upload_limit()) return new WP_Error('upload_size', dxcp_upload_hint());
    $name = sanitize_file_name(wp_basename($file['name']));
    $checked = wp_check_filetype_and_ext($file['tmp_name'], $name, dxcp_upload_mimes());
    if (empty($checked['ext']) || empty($checked['type'])) return new WP_Error('upload_type','Use an image, PDF, Office document, text, audio or video file.');
    // Office documents are ZIP containers; all other types must agree with actual file content.
    $actual = function_exists('finfo_open') ? (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']) : '';
    $office = in_array($checked['ext'], ['docx','xlsx','pptx'], true);
    if ($actual && $actual !== $checked['type'] && !($office && in_array($actual, ['application/zip','application/x-zip','application/x-zip-compressed','application/octet-stream'], true)) && !($checked['type'] === 'audio/wav' && in_array($actual,['audio/x-wav','audio/vnd.wave'],true))) return new WP_Error('upload_type','The file contents do not match its file type.');
    return ['name'=>$name,'mime'=>$checked['type'],'ext'=>$checked['ext'],'size'=>(int) $size];
}

/** The caller validates its form nonce; this helper separately enforces record ownership. */
function dxcp_private_upload($field, $parent_record_id) {
    $record_id = absint($parent_record_id);
    if (!dxcp_can_access($record_id)) return new WP_Error('forbidden','You cannot add files to this record.');
    $file = $_FILES[$field] ?? null;
    $validated = dxcp_validate_upload($file);
    if (is_wp_error($validated)) return $validated;
    if (!is_uploaded_file($file['tmp_name'])) return new WP_Error('upload_invalid','Please select a file through the upload form.');
    $dir = dxcp_private_dir();
    if (!is_dir($dir) && !wp_mkdir_p($dir)) return new WP_Error('storage_unavailable','Private file storage is unavailable. Please try again later.');
    @chmod($dir, 0700);
    $key = $record_id . '-' . bin2hex(random_bytes(20)) . '.' . $validated['ext'];
    $path = $dir . '/' . $key;
    if (!move_uploaded_file($file['tmp_name'], $path)) return new WP_Error('storage_failed','The file could not be saved. Please try again.');
    @chmod($path, 0600);
    $old = get_post_meta($record_id, '_dxcp_private_file', true);
    $data = ['key'=>$key,'name'=>$validated['name'],'mime'=>$validated['mime'],'size'=>$validated['size'],'uploaded_at'=>current_time('mysql', true)];
    update_post_meta($record_id, '_dxcp_private_file', $data);
    if (is_array($old) && !empty($old['key']) && dxcp_private_file_path($old, $record_id)) @unlink(dxcp_private_file_path($old, $record_id));
    return $data;
}

function dxcp_private_file_path($data, $record_id) {
    if (!is_array($data) || empty($data['key']) || !preg_match('/^' . absint($record_id) . '-[a-f0-9]{40}\.[a-z0-9]+$/D', $data['key'])) return '';
    $path = dxcp_private_dir() . '/' . $data['key'];
    if (!is_file($path) || is_link($path)) return '';
    $base = realpath(dxcp_private_dir());
    return $base && strpos(realpath($path), $base . DIRECTORY_SEPARATOR) === 0 ? $path : '';
}

function dxcp_download_url($record_id) {
    $record_id = absint($record_id);
    if (!dxcp_can_access($record_id) || !dxcp_private_file_path(get_post_meta($record_id, '_dxcp_private_file', true), $record_id)) return '';
    return wp_nonce_url(add_query_arg(['action'=>'dxcp_download','record'=>$record_id], admin_url('admin-post.php')), 'dxcp_download_' . $record_id);
}

function dxcp_document_url($record_id) {
    if (!dxcp_can_access($record_id)) return '';
    $file = dxcp_download_url($record_id);
    return $file ?: dxcp_safe_url(get_post_meta($record_id, '_dxcp_link_url', true));
}

function dxcp_download_file() {
    $id = absint($_GET['record'] ?? 0);
    if (!is_user_logged_in() || !dxcp_can_access($id) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_GET['_wpnonce'] ?? '')), 'dxcp_download_' . $id)) wp_die('This private file is not available.', 'Access denied', ['response'=>403]);
    $data = get_post_meta($id, '_dxcp_private_file', true);
    $path = dxcp_private_file_path($data, $id);
    if (!$path) wp_die('This file is no longer available.', 'File unavailable', ['response'=>404]);
    while (ob_get_level()) ob_end_clean();
    nocache_headers();
    $inline = !empty($_GET['inline']) && preg_match('#^(image/(jpeg|png|gif|webp)|audio/(mpeg|mp4|ogg|wav)|video/(mp4|quicktime|webm))$#D', $data['mime'] ?? '');
    header('Content-Type: '.($inline ? $data['mime'] : 'application/octet-stream'));
    header('X-Content-Type-Options: nosniff');
    header('Content-Disposition: '.($inline ? 'inline' : 'attachment').'; filename="' . str_replace(['"',"\r","\n"], '', sanitize_file_name($data['name'])) . '"; filename*=UTF-8\'\'' . rawurlencode($data['name']));
    header('Content-Length: ' . filesize($path));
    header('Cache-Control: private, no-store, max-age=0');
    readfile($path);
    exit;
}
add_action('admin_post_dxcp_download', 'dxcp_download_file');
add_action('admin_post_nopriv_dxcp_download', 'dxcp_download_file');

function dxcp_safe_url($value) {
    $value = esc_url_raw(trim((string) $value), ['http','https']);
    return $value && preg_match('#^https?://#i', $value) ? $value : '';
}

function dxcp_notice_redirect($section, $code, $projectid = 0) {
    $section = $section === 'quotations' ? 'payments' : $section;
    $args = ['section'=>sanitize_key($section),'notice'=>sanitize_key($code)];
    if ($projectid) $args['project_id'] = absint($projectid);
    wp_safe_redirect(add_query_arg($args, home_url('/dashboard/')));
    exit;
}

function dxcp_profile_data($uid = 0) {
    $uid = $uid ?: get_current_user_id();
    if ($uid !== get_current_user_id() && !dxcp_is_admin()) return [];
    $user = get_userdata($uid);
    return ['display_name'=>$user ? $user->display_name : '', 'company'=>(string) (get_user_meta($uid,'_dxcp_company',true) ?: get_user_meta($uid,'company',true)), 'phone'=>(string) get_user_meta($uid,'_dxcp_phone',true), 'website'=>(string) (get_user_meta($uid,'_dxcp_website',true) ?: ($user ? $user->user_url : ''))];
}

function dxcp_onboarding_data($uid = 0, $project_id = 0) {
    $uid = $uid ?: get_current_user_id();
    if ($uid !== get_current_user_id() && !dxcp_is_admin()) return [];
    $data = [];
    if ($project_id && !dxcp_project_for_user($project_id,$uid)) return [];
    foreach (['business_name','project_goals','audience','content_ready','preferred_contact','updated'] as $key) $data[$key] = (string) ($project_id ? get_post_meta($project_id, '_dxcp_onboarding_' . $key, true) : get_user_meta($uid, '_dxcp_onboarding_' . $key, true));
    return $data;
}

function dxcp_save_profile() {
    if (!dxcp_is_client_user() || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['dxcp_nonce'] ?? '')), 'dxcp_profile')) wp_die('Your session has expired. Please return to your dashboard and try again.', 'Invalid request', ['response'=>403]);
    $uid = get_current_user_id();
    $display_name = mb_substr(sanitize_text_field(wp_unslash($_POST['display_name'] ?? '')), 0, 100);
    if ($display_name === '') dxcp_notice_redirect('profile','save_failed');
    $result = wp_update_user(['ID'=>$uid,'display_name'=>$display_name]);
    if (is_wp_error($result)) dxcp_notice_redirect('profile','save_failed');
    update_user_meta($uid, '_dxcp_company', mb_substr(sanitize_text_field(wp_unslash($_POST['company'] ?? '')),0,160));
    update_user_meta($uid, '_dxcp_phone', mb_substr(sanitize_text_field(wp_unslash($_POST['phone'] ?? '')),0,50));
    update_user_meta($uid, '_dxcp_website', dxcp_safe_url(wp_unslash($_POST['website'] ?? '')));
    dxcp_notice_redirect('profile','profile_saved');
}
add_action('admin_post_dxcp_profile','dxcp_save_profile');

function dxcp_save_onboarding() {
    $project = absint($_POST['project_id'] ?? 0);
    if (!dxcp_is_client_user() || !dxcp_project_for_user($project) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['dxcp_nonce'] ?? '')), 'dxcp_onboarding')) wp_die('Your session has expired. Please return to your dashboard and try again.', 'Invalid request', ['response'=>403]);
    $uid = get_current_user_id();
    foreach (['business_name'=>160,'project_goals'=>3000,'audience'=>1500] as $key=>$limit) update_post_meta($project, '_dxcp_onboarding_' . $key, mb_substr(sanitize_textarea_field(wp_unslash($_POST[$key] ?? '')),0,$limit));
    $ready = sanitize_key($_POST['content_ready'] ?? '');
    $contact = sanitize_key($_POST['preferred_contact'] ?? '');
    update_post_meta($project,'_dxcp_onboarding_content_ready',in_array($ready,['yes','in_progress','no'],true) ? $ready : '');
    update_post_meta($project,'_dxcp_onboarding_preferred_contact',in_array($contact,['email','phone'],true) ? $contact : '');
    update_post_meta($project,'_dxcp_onboarding_updated',current_time('mysql',true));
    dxcp_notice_redirect('drive','onboarding_saved',$project);
}
add_action('admin_post_dxcp_onboarding','dxcp_save_onboarding');

add_action('init', function() {
    $caps = array_fill_keys(['edit_post','read_post','delete_post','edit_posts','edit_others_posts','publish_posts','read_private_posts','delete_posts','delete_private_posts','delete_published_posts','delete_others_posts','edit_private_posts','edit_published_posts','create_posts'], 'manage_options');
    foreach (['dxcp_project'=>['Client projects','Client project','dashicons-portfolio'], 'dxcp_document'=>['Client Drive','Client document','dashicons-media-document'], 'dxcp_session'=>['Coaching sessions','Coaching session','dashicons-calendar-alt']] as $type=>$labels) {
        register_post_type($type, ['labels'=>['name'=>$labels[0],'singular_name'=>$labels[1],'add_new_item'=>'Add '.$labels[1],'edit_item'=>'Edit '.$labels[1]],'public'=>false,'publicly_queryable'=>false,'exclude_from_search'=>true,'show_ui'=>true,'show_in_rest'=>false,'show_in_menu'=>$type==='dxcp_project' ? true : 'edit.php?post_type=dxcp_project','menu_icon'=>$labels[2],'rewrite'=>false,'query_var'=>false,'supports'=>['title','editor'],'capabilities'=>$caps,'map_meta_cap'=>false]);
    }
});

add_action('add_meta_boxes', function() {
    if (!current_user_can('manage_options')) return;
    add_meta_box('dxcp-project-details','Client journey & project links','dxcp_project_metabox','dxcp_project','normal','high');
    add_meta_box('dxcp-document-details','Private Drive document','dxcp_document_metabox','dxcp_document','normal','high');
    add_meta_box('dxcp-session-details','Coaching session details','dxcp_session_metabox','dxcp_session','normal','high');
});
add_action('post_edit_form_tag',function($post) { if ($post && $post->post_type==='dxcp_document') echo ' enctype="multipart/form-data"'; });

function dxcp_admin_select($name,$label,$options,$value) {
    echo '<p><label for="'.esc_attr($name).'"><strong>'.esc_html($label).'</strong></label><br><select id="'.esc_attr($name).'" name="'.esc_attr($name).'">';
    foreach ($options as $key=>$text) echo '<option value="'.esc_attr($key).'" '.selected((string)$value,(string)$key,false).'>'.esc_html($text).'</option>';
    echo '</select></p>';
}
function dxcp_admin_input($name,$label,$value,$type='text') {
    echo '<p><label for="'.esc_attr($name).'"><strong>'.esc_html($label).'</strong></label><br><input class="large-text" id="'.esc_attr($name).'" name="'.esc_attr($name).'" type="'.esc_attr($type).'" value="'.esc_attr($value).'" '.($type==='datetime-local'?' step="60"':'').'></p>';
}
function dxcp_admin_project_options() {
    $options = [''=>'Select a client project'];
    foreach (get_posts(['post_type'=>'dxcp_project','post_status'=>['private','publish','draft','pending','future'],'posts_per_page'=>200,'orderby'=>'title','order'=>'ASC']) as $project) {
        $client = get_userdata((int)get_post_meta($project->ID,'_dxcp_client_id',true));
        $options[$project->ID] = $project->post_title . ($client ? ' — '.$client->display_name : '');
    }
    return $options;
}
function dxcp_project_metabox($post) {
    wp_nonce_field('dxcp_record_save','dxcp_record_nonce');
    $clients = [''=>'Assign a client'];
    foreach(get_users(['role__in'=>['client','subscriber','administrator'],'number'=>300,'orderby'=>'display_name']) as $user) $clients[$user->ID] = $user->display_name.' ('.$user->user_login.')';
    dxcp_admin_select('dxcp_client_id','Client account',$clients,get_post_meta($post->ID,'_dxcp_client_id',true));
    dxcp_admin_select('dxcp_service','Service',['digital'=>'Digital project','fitness'=>'Fitness coaching','photography'=>'Photography','support'=>'Ongoing support'],get_post_meta($post->ID,'_dxcp_service',true));
    dxcp_admin_select('dxcp_phase','Journey phase',['quotation'=>'Quotation acceptance','design'=>'Design phase','development'=>'Development phase','testing'=>'Testing & audit','launch'=>'Launch ready','post_launch'=>'Post-launch'],get_post_meta($post->ID,'_dxcp_phase',true));
    dxcp_admin_input('dxcp_quote_ref','Pricing Calculator quotation reference',get_post_meta($post->ID,'_dxcp_quote_ref',true));
    foreach(['design'=>'Figma / design link','staging'=>'Live preview / staging link','testing'=>'Testing board / shared audit link','live'=>'Live website link'] as $key=>$label) dxcp_admin_input('dxcp_'.$key.'_url',$label,get_post_meta($post->ID,'_dxcp_'.$key.'_url',true),'url');
    echo '<p class="description">Only this assigned client and administrators can access this project. Add real dates, documents, payment records and session details as they are agreed. Staging URLs must be reachable by the client; LocalWP Live Links may require separate credentials.</p>';
    $client_id = (int)get_post_meta($post->ID,'_dxcp_client_id',true);
    if ($client_id) {
        $profile = dxcp_profile_data($client_id); $brief = dxcp_onboarding_data($client_id,$post->ID);
        echo '<details><summary><strong>Client details & onboarding</strong></summary><dl>';
        foreach (['display_name'=>'Name','company'=>'Company','phone'=>'Phone','website'=>'Website'] as $key=>$label) echo '<dt>'.esc_html($label).'</dt><dd>'.esc_html($profile[$key]?:'Not supplied').'</dd>';
        foreach (['business_name'=>'Business / project','project_goals'=>'Project goals','audience'=>'Audience','content_ready'=>'Content ready','preferred_contact'=>'Preferred contact','updated'=>'Last updated'] as $key=>$label) echo '<dt>'.esc_html($label).'</dt><dd>'.nl2br(esc_html($brief[$key]?:'Not supplied')).'</dd>';
        echo '</dl></details>';
    }

}
function dxcp_document_metabox($post) {
    wp_nonce_field('dxcp_record_save','dxcp_record_nonce');
    dxcp_admin_select('dxcp_project_id','Client project',dxcp_admin_project_options(),get_post_meta($post->ID,'_dxcp_project_id',true));
    dxcp_admin_select('dxcp_document_type','Document type',['general'=>'General document','onboarding'=>'Client onboarding','agreement'=>'Agreement'],get_post_meta($post->ID,'_dxcp_document_type',true));
    dxcp_admin_input('dxcp_link_url','Secure external document link (optional)',get_post_meta($post->ID,'_dxcp_link_url',true),'url');
    echo '<p><label for="dxcp_private_file"><strong>Private file (up to 5 MB)</strong></label><br><input type="file" id="dxcp_private_file" name="dxcp_private_file" accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.txt,.docx,.xlsx,.pptx,.mp4,.mov,.mp3,.m4a,.ogg,.wav,.webm"></p><p class="description">Files are kept outside the public website and downloaded only after account and ownership checks. Larger files can be shared through an external cloud-storage link. Uploading a replacement removes the old private file.</p>';
    $file = get_post_meta($post->ID,'_dxcp_private_file',true);
    if (is_array($file) && !empty($file['name'])) echo '<p>Current file: <a href="'.esc_url(dxcp_download_url($post->ID)).'">'.esc_html($file['name']).'</a></p>';
}
function dxcp_session_metabox($post) {
    wp_nonce_field('dxcp_record_save','dxcp_record_nonce');
    dxcp_admin_select('dxcp_project_id','Fitness coaching project',dxcp_admin_project_options(),get_post_meta($post->ID,'_dxcp_project_id',true));
    dxcp_admin_input('dxcp_start','Starts (Europe/London)',get_post_meta($post->ID,'_dxcp_start',true),'datetime-local');
    dxcp_admin_input('dxcp_end','Ends (Europe/London)',get_post_meta($post->ID,'_dxcp_end',true),'datetime-local');
    dxcp_admin_input('dxcp_location','Location',get_post_meta($post->ID,'_dxcp_location',true));
    dxcp_admin_input('dxcp_join_url','Online session link',get_post_meta($post->ID,'_dxcp_join_url',true),'url');
    dxcp_admin_select('dxcp_status','Session status',['pending'=>'Awaiting coach review','scheduled'=>'Scheduled','completed'=>'Completed','cancelled'=>'Cancelled'],get_post_meta($post->ID,'_dxcp_status',true));
    echo '<p class="description">Dates use London time, including British Summer Time. Sessions appear only to the assigned client. This records agreed sessions; it does not send invitations or book a third-party calendar.</p>';
}

function dxcp_admin_error($message) { set_transient('dxcp_admin_error_'.get_current_user_id(),$message,60); }
add_action('admin_notices',function(){
    if (!current_user_can('manage_options')) return;
    $key='dxcp_admin_error_'.get_current_user_id(); $error=get_transient($key);
    if($error) { delete_transient($key); echo '<div class="notice notice-error"><p>'.esc_html($error).'</p></div>'; }
});
add_action('save_post', function($id,$post) {
    if (!in_array($post->post_type,['dxcp_project','dxcp_document','dxcp_session'],true) || !current_user_can('manage_options') || wp_is_post_revision($id) || (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['dxcp_record_nonce']??'')),'dxcp_record_save')) return;
    if ($post->post_type==='dxcp_project') {
        $uid=absint($_POST['dxcp_client_id']??0);
        if ($uid && !get_userdata($uid)) { dxcp_admin_error('Choose a valid client account.'); return; }
        update_post_meta($id,'_dxcp_client_id',$uid);
        foreach(['service'=>['digital','fitness','photography','support'],'phase'=>['quotation','design','development','testing','launch','post_launch']] as $key=>$allowed) {
            $value=sanitize_key($_POST['dxcp_'.$key]??''); if (in_array($value,$allowed,true)) update_post_meta($id,'_dxcp_'.$key,$value);
        }
        update_post_meta($id,'_dxcp_quote_ref',mb_substr(sanitize_text_field(wp_unslash($_POST['dxcp_quote_ref']??'')),0,100));
        foreach(['design','staging','testing','live'] as $key) update_post_meta($id,'_dxcp_'.$key.'_url',dxcp_safe_url(wp_unslash($_POST['dxcp_'.$key.'_url']??'')));
        return;
    }
    $project=absint($_POST['dxcp_project_id']??0);
    if (!$project || !($project_post=get_post($project)) || $project_post->post_type!=='dxcp_project') { dxcp_admin_error('Choose a valid client project before adding this record.'); return; }
    if ($post->post_type==='dxcp_session' && get_post_meta($project,'_dxcp_service',true)!=='fitness') { dxcp_admin_error('Coaching sessions must belong to a fitness coaching project.'); return; }
    update_post_meta($id,'_dxcp_project_id',$project);
    if ($post->post_type==='dxcp_document') {
        $type=sanitize_key($_POST['dxcp_document_type']??'general'); update_post_meta($id,'_dxcp_document_type',in_array($type,['general','onboarding','agreement'],true)?$type:'general');
        update_post_meta($id,'_dxcp_link_url',dxcp_safe_url(wp_unslash($_POST['dxcp_link_url']??'')));
        if (!empty($_FILES['dxcp_private_file']['name'])) { $upload=dxcp_private_upload('dxcp_private_file',$id); if(is_wp_error($upload)) dxcp_admin_error($upload->get_error_message()); }
        return;
    }
    $start=sanitize_text_field(wp_unslash($_POST['dxcp_start']??'')); $end=sanitize_text_field(wp_unslash($_POST['dxcp_end']??''));
    if (!dxcp_session_timestamp($start) || !dxcp_session_timestamp($end) || dxcp_session_timestamp($end)<=dxcp_session_timestamp($start)) { dxcp_admin_error('Add valid London start and end times. The end must be after the start. Previous session times were retained.'); return; }
    update_post_meta($id,'_dxcp_start',$start); update_post_meta($id,'_dxcp_end',$end);
    update_post_meta($id,'_dxcp_location',mb_substr(sanitize_text_field(wp_unslash($_POST['dxcp_location']??'')),0,250));
    update_post_meta($id,'_dxcp_join_url',dxcp_safe_url(wp_unslash($_POST['dxcp_join_url']??'')));
    $status=sanitize_key($_POST['dxcp_status']??'scheduled'); update_post_meta($id,'_dxcp_status',in_array($status,['pending','scheduled','completed','cancelled'],true)?$status:'scheduled');
},10,2);

add_action('before_delete_post', function($id) {
    if (get_post_type($id)!=='dxcp_document') return;
    $path=dxcp_private_file_path(get_post_meta($id,'_dxcp_private_file',true),$id);
    if($path) @unlink($path);
});

// Preserve legacy Media IDs while delivering migrated support images privately.
add_filter('wp_get_attachment_url', function($url,$id) {
    $doc=absint(get_post_meta($id,'_dxcp_private_document_id',true));
    return $doc ? dxcp_download_url($doc) : $url;
}, 20, 2);
add_filter('image_downsize', function($result,$id,$size) {
    $doc=absint(get_post_meta($id,'_dxcp_private_document_id',true));
    if(!$doc)return $result;
    $url=dxcp_download_url($doc);if(!$url)return ['',0,0,false];
    $meta=wp_get_attachment_metadata($id);
    return [add_query_arg('inline','1',$url),(int)($meta['width']??0),(int)($meta['height']??0),false];
},20,3);
add_filter('wp_calculate_image_srcset',function($sources,$size,$src,$meta,$id){ return get_post_meta($id,'_dxcp_private_document_id',true) ? false : $sources; },20,5);
add_filter('rest_prepare_attachment',function($response,$post){
    $doc=absint(get_post_meta($post->ID,'_dxcp_private_document_id',true));
    return $doc && !dxcp_can_access($doc) ? new WP_Error('rest_forbidden','This client file is private.',['status'=>403]) : $response;
},20,2);
add_filter('rest_attachment_query',function($args){
    if(!current_user_can('manage_options')) $args['meta_query'][]=['key'=>'_dxcp_private_document_id','compare'=>'NOT EXISTS'];
    return $args;
});
add_action('template_redirect',function(){
    if(!is_attachment())return;
    $doc=absint(get_post_meta(get_queried_object_id(),'_dxcp_private_document_id',true));
    if(!$doc)return;
    if(!dxcp_can_access($doc))wp_die('This client file is private.','Access denied',['response'=>403]);
    wp_safe_redirect(dxcp_download_url($doc));exit;
},0);

// Private coaching calendar transport and progressive month navigation.
require_once __DIR__.'/calendar.php';
