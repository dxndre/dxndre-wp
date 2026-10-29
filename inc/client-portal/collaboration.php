<?php
/**
 * Private project tasks and support conversations.
 * Presentation stays in the portal renderer and the theme's main assets.
 */
if (!defined('ABSPATH')) exit;

function dxcp_task_statuses() {
    return ['todo' => 'To do', 'in_progress' => 'In progress', 'waiting' => 'Waiting', 'done' => 'Complete'];
}

/** One shared whitelist for client forms, saved records and the support CMS. */
function dxcp_ticket_priorities() {
    return ['normal' => 'Normal — a question or request', 'urgent' => 'Urgent — something is blocking my work', 'no_rush' => 'No rush — whenever there’s room'];
}

function dxcp_ticket_priority($priority) {
    return is_string($priority) && array_key_exists($priority, dxcp_ticket_priorities()) ? $priority : 'normal';
}

/** Existing unassigned requests keep the digital ticket treatment. */
function dxcp_ticket_service($record_id) {
    $project_id = absint(get_post_meta($record_id, '_dxcp_project_id', true));
    if (!$project_id || get_post_type($project_id) !== 'dxcp_project') return 'digital';
    return sanitize_key(get_post_meta($project_id, '_dxcp_service', true)) ?: 'digital';
}

function dxcp_ticket_statuses() {
    return ['new' => 'New', 'open' => 'Open', 'acknowledged' => 'Acknowledged', 'in_progress' => 'In progress', 'waiting' => 'Waiting for you', 'resolved' => 'Resolved', 'cancelled' => 'Cancelled'];
}

function dxcp_task_status_label($status) {
    return dxcp_task_statuses()[(string) $status] ?? 'To do';
}

function dxcp_ticket_status_label($status) {
    return dxcp_ticket_statuses()[(string) $status] ?? 'Open';
}

add_action('init', function () {
    register_post_type('dxcp_task', [
        'labels' => ['name' => 'Client to-dos', 'singular_name' => 'Client to-do', 'add_new_item' => 'Add client to-do', 'edit_item' => 'Edit client to-do'],
        'public' => false, 'publicly_queryable' => false, 'exclude_from_search' => true,
        'show_ui' => true, 'show_in_rest' => false, 'rewrite' => false, 'query_var' => false,
        'menu_icon' => 'dashicons-yes-alt', 'supports' => ['title', 'editor', 'comments'],
        'capability_type' => 'post', 'map_meta_cap' => true,
        'capabilities' => ['create_posts' => 'manage_options', 'edit_posts' => 'manage_options', 'edit_others_posts' => 'manage_options', 'publish_posts' => 'manage_options', 'read_private_posts' => 'manage_options', 'delete_posts' => 'manage_options'],
    ]);
}, 20);

/* CPT UI previously published support tickets and their comments publicly. */
add_filter('register_post_type_args', function ($args, $type) {
    if ($type !== 'ticket') return $args;
    return array_merge($args, [
        'public' => false, 'publicly_queryable' => false, 'exclude_from_search' => true,
        'show_ui' => true, 'show_in_rest' => false, 'has_archive' => false,
        'rewrite' => false, 'query_var' => false,
    ]);
}, 100, 2);

function dxcp_collaboration_record($id) {
    $post = get_post(absint($id));
    return $post && in_array($post->post_type, ['ticket', 'dxcp_task'], true) && !in_array($post->post_status, ['trash', 'auto-draft'], true) ? $post : null;
}

function dxcp_record_url($id) {
    $post = dxcp_collaboration_record($id);
    if (!$post) return home_url('/dashboard/');
    return add_query_arg(['section' => $post->post_type === 'ticket' ? 'support' : 'tasks', 'project_id' => absint(get_post_meta($post->ID, '_dxcp_project_id', true)), 'record_id' => $post->ID], home_url('/dashboard/'));
}

function dxcp_collaboration_records($type, $project_id = 0, $uid = 0) {
    $uid = $uid ? absint($uid) : get_current_user_id();
    if (!$uid) return [];
    $project_id = absint($project_id);
    if ($project_id && !dxcp_can_access($project_id, $uid)) return [];
    $args = ['post_type' => $type, 'post_status' => ['publish', 'private', 'draft', 'pending'], 'posts_per_page' => -1, 'orderby' => 'date', 'order' => 'DESC', 'suppress_filters' => false];
    if ($project_id) $args['meta_query'] = [['key' => '_dxcp_project_id', 'value' => $project_id, 'compare' => '=', 'type' => 'NUMERIC']];
    $records = get_posts($args);
    return array_values(array_filter($records, function ($post) use ($uid) { return dxcp_can_access($post, $uid); }));
}

function dxcp_tasks($project_id = 0, $uid = 0) {
    return dxcp_collaboration_records('dxcp_task', $project_id, $uid);
}

function dxcp_tickets($project_id = 0, $uid = 0) {
    return dxcp_collaboration_records('ticket', $project_id, $uid);
}

function dxcp_attachment_data($id, $parent_id) {
    $post = get_post(absint($id));
    if (!$post || $post->post_type !== 'dxcp_document' || absint(get_post_meta($post->ID, '_dxcp_parent_id', true)) !== absint($parent_id) || !dxcp_can_access($parent_id) || !dxcp_can_access($post)) return null;
    $file = get_post_meta($post->ID, '_dxcp_private_file', true);
    if (!is_array($file) || !$file) return null;
    return ['id' => $post->ID, 'title' => get_the_title($post), 'url' => dxcp_download_url($post->ID), 'mime' => sanitize_mime_type($file['mime'] ?? $file['type'] ?? 'application/octet-stream')];
}

function dxcp_record_attachments($record_id) {
    $post = dxcp_collaboration_record($record_id);
    if (!$post || !dxcp_can_access($post)) return [];
    $ids = get_posts(['post_type' => 'dxcp_document', 'post_status' => ['private', 'publish'], 'posts_per_page' => -1, 'fields' => 'ids', 'orderby' => 'date', 'order' => 'ASC', 'meta_query' => [['key' => '_dxcp_parent_id', 'value' => $post->ID, 'compare' => '=', 'type' => 'NUMERIC'], ['key' => '_dxcp_comment_id', 'compare' => 'NOT EXISTS']]]);
    return array_values(array_filter(array_map(function ($id) use ($post) { return dxcp_attachment_data($id, $post->ID); }, $ids)));
}

function dxcp_comments($record_id) {
    $post = dxcp_collaboration_record($record_id);
    if (!$post || !dxcp_can_access($post)) return [];
    $comments = get_comments(['post_id' => $post->ID, 'status' => 'approve', 'orderby' => 'comment_date_gmt', 'order' => 'ASC', 'number' => 0, 'type__in' => ['comment', 'dxcp_note', '']]);
    $result = [];
    foreach ($comments as $comment) {
        $author = $comment->user_id ? get_userdata($comment->user_id) : false;
        $ids = get_comment_meta($comment->comment_ID, '_dxcp_attachment_ids', true);
        $attachments = [];
        foreach (is_array($ids) ? $ids : [] as $id) {
            if (absint(get_post_meta($id, '_dxcp_comment_id', true)) !== (int) $comment->comment_ID) continue;
            $data = dxcp_attachment_data($id, $post->ID);
            if ($data) $attachments[] = $data;
        }
        $result[] = [
            'id' => (int) $comment->comment_ID,
            'author' => sanitize_text_field($author ? $author->display_name : ($comment->comment_author ?: 'Client')),
            'date' => $comment->comment_date,
            'content' => wp_kses_post($comment->comment_content),
            'own' => (int) $comment->user_id === get_current_user_id(),
            'is_staff' => $author ? user_can($author, 'manage_options') : false,
            'attachments' => $attachments,
        ];
    }
    return $result;
}

function dxcp_collaboration_error($code, $message, $status = 400) {
    return new WP_Error($code, $message, ['status' => $status]);
}

function dxcp_collaboration_require($record_id) {
    $post = dxcp_collaboration_record($record_id);
    if (!$post || !is_user_logged_in() || !dxcp_can_access($post)) return dxcp_collaboration_error('forbidden', 'You do not have access to this request.', 403);
    return $post;
}

function dxcp_collaboration_project($project_id) {
    $project = get_post(absint($project_id));
    if (!$project || $project->post_type !== 'dxcp_project' || !dxcp_can_access($project)) return dxcp_collaboration_error('forbidden', 'Please choose one of your projects.', 403);
    return $project;
}

function dxcp_collaboration_file($field, $record_id, $comment_id = 0) {
    if (empty($_FILES[$field]['name'])) return 0;
    $record = dxcp_collaboration_require($record_id);
    if (is_wp_error($record)) return $record;
    if (is_array($_FILES[$field]['name'])) return dxcp_collaboration_error('invalid_file', 'Choose one file per update.');
    $document_id = wp_insert_post(['post_type' => 'dxcp_document', 'post_status' => 'private', 'post_author' => get_current_user_id(), 'post_title' => sanitize_file_name(wp_unslash($_FILES[$field]['name']))], true);
    if (is_wp_error($document_id)) return $document_id;
    update_post_meta($document_id, '_dxcp_parent_id', $record->ID);
    update_post_meta($document_id, '_dxcp_project_id', absint(get_post_meta($record->ID, '_dxcp_project_id', true)));
    $client_id = absint(get_post_meta($record->ID, 'ticket_client', true)) ?: absint(get_post_meta($record->ID, '_dxcp_client_id', true)) ?: absint($record->post_author);
    update_post_meta($document_id, '_dxcp_client_id', $client_id);
    if ($comment_id) update_post_meta($document_id, '_dxcp_comment_id', absint($comment_id));
    $upload = dxcp_private_upload($field, $document_id);
    if (is_wp_error($upload)) {
        wp_delete_post($document_id, true);
        return $upload;
    }
    return $document_id;
}

/**
 * Mutation helpers return a value/WP_Error so authorization can be tested without HTTP exits.
 */
function dxcp_add_comment($record_id, $message, $file_field = 'dxcp_file') {
    $post = dxcp_collaboration_require($record_id);
    if (is_wp_error($post)) return $post;
    $message = sanitize_textarea_field((string) $message);
    if (strlen($message) > 20000) return dxcp_collaboration_error('message_too_long', 'Please keep each update below 20,000 characters.');
    if ($message === '' && empty($_FILES[$file_field]['name'])) return dxcp_collaboration_error('empty_message', 'Write an update or attach a file.');
    $file_id = dxcp_collaboration_file($file_field, $post->ID);
    if (is_wp_error($file_id)) return $file_id;
    $user = wp_get_current_user();
    $comment_id = wp_insert_comment(['comment_post_ID' => $post->ID, 'comment_content' => $message, 'user_id' => $user->ID, 'comment_author' => $user->display_name, 'comment_author_email' => '', 'comment_approved' => 1, 'comment_type' => 'dxcp_note']);
    if (!$comment_id) {
        if ($file_id) wp_delete_post($file_id, true);
        return dxcp_collaboration_error('comment_failed', 'The update could not be saved. Please try again.');
    }
    if ($file_id) {
        update_post_meta($file_id, '_dxcp_comment_id', $comment_id);
        update_comment_meta($comment_id, '_dxcp_attachment_ids', [$file_id]);
    }
    update_post_meta($post->ID, '_dxcp_last_updated', current_time('mysql'));
    if ($post->post_type === 'ticket') update_post_meta($post->ID, 'ticket_last_updated', current_time('mysql'));
    return $comment_id;
}

function dxcp_set_task_status($record_id, $status) {
    $post = dxcp_collaboration_require($record_id);
    if (is_wp_error($post)) return $post;
    if ($post->post_type !== 'dxcp_task' || !array_key_exists($status, dxcp_task_statuses())) return dxcp_collaboration_error('invalid_status', 'Choose a valid to-do status.');
    $current = get_post_meta($post->ID, '_dxcp_task_status', true) ?: 'todo';
    $is_admin = current_user_can('manage_options');
    if (!$is_admin && $current === 'done') return dxcp_collaboration_error('task_complete', 'This to-do has been completed. Add a comment if anything else is needed.', 403);
    $review_requested = !$is_admin && $status === 'done';
    update_post_meta($post->ID, '_dxcp_task_status', $review_requested ? 'waiting' : $status);
    if ($review_requested) update_post_meta($post->ID, '_dxcp_completion_requested', 1);
    else delete_post_meta($post->ID, '_dxcp_completion_requested');
    update_post_meta($post->ID, '_dxcp_last_updated', current_time('mysql'));
    return $review_requested ? 'task_review_requested' : 'task_updated';
}

function dxcp_set_ticket_status($record_id, $status) {
    $post = dxcp_collaboration_require($record_id);
    if (is_wp_error($post)) return $post;
    if ($post->post_type !== 'ticket' || !array_key_exists($status, dxcp_ticket_statuses())) return dxcp_collaboration_error('invalid_status', 'Choose a valid support status.');
    $current = get_post_meta($post->ID, 'ticket_status', true) ?: 'new';
    if (!current_user_can('manage_options')) {
        $allowed = in_array($status, ['cancelled','resolved'], true) && !in_array($current, ['resolved', 'cancelled'], true);
        $allowed = $allowed || ($status === 'open' && in_array($current, ['resolved', 'cancelled', 'waiting'], true));
        if (!$allowed) return dxcp_collaboration_error('invalid_transition', 'You can cancel an active request or reopen a closed request.', 403);
    }
    update_post_meta($post->ID, 'ticket_status', $status);
    update_post_meta($post->ID, 'ticket_last_updated', current_time('mysql'));
    return 'ticket_updated';
}

function dxcp_create_ticket($project_id, $title, $message, $priority = 'normal', $file_field = 'dxcp_file') {
    if (!is_user_logged_in()) return dxcp_collaboration_error('forbidden', 'Please sign in to send a support request.', 403);
    $project_id = absint($project_id);
    if ($project_id) {
        $project = dxcp_collaboration_project($project_id);
        if (is_wp_error($project)) return $project;
    }
    $title = sanitize_text_field((string) $title);
    $message = sanitize_textarea_field((string) $message);
    if ($title === '' || $message === '' || strlen($title) > 250 || strlen($message) > 20000) return dxcp_collaboration_error('invalid_message', 'Add a short subject and explain how I can help.');
    $client_id = $project_id ? absint(get_post_meta($project_id, '_dxcp_client_id', true)) : get_current_user_id();
    $ticket_id = wp_insert_post(['post_type' => 'ticket', 'post_status' => 'private', 'post_author' => $client_id, 'post_title' => $title, 'post_content' => $message, 'comment_status' => 'closed'], true);
    if (is_wp_error($ticket_id)) return $ticket_id;
    update_post_meta($ticket_id, 'ticket_client', $client_id);
    update_post_meta($ticket_id, '_dxcp_project_id', $project_id);
    update_post_meta($ticket_id, 'ticket_status', 'new');
    update_post_meta($ticket_id, '_dxcp_priority', dxcp_ticket_priority($priority));
    update_post_meta($ticket_id, 'ticket_last_updated', current_time('mysql'));
    $file_id = dxcp_collaboration_file($file_field, $ticket_id);
    if (is_wp_error($file_id)) {
        wp_delete_post($ticket_id, true);
        return $file_id;
    }
    return $ticket_id;
}

function dxcp_collaboration_nonce($action, $field = '_wpnonce') {
    if (!is_user_logged_in() || !isset($_POST[$field]) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST[$field])), $action)) {
        wp_die('Please sign in and try again.', 'Request not authorised', ['response' => 403]);
    }
}

function dxcp_collaboration_response($result, $record_id = 0, $section = 'support') {
    if (is_wp_error($result)) wp_die(esc_html($result->get_error_message()), 'Unable to save', ['response' => $result->get_error_data()['status'] ?? 400, 'back_link' => true]);
    $url = $record_id ? dxcp_record_url($record_id) : add_query_arg('section', $section, home_url('/dashboard/'));
    wp_safe_redirect(add_query_arg('portal_notice', is_string($result) ? sanitize_key($result) : 'update_saved', $url));
    exit;
}

function dxcp_handle_comment() {
    $id = absint($_POST['record_id'] ?? 0);
    dxcp_collaboration_nonce('dxcp_comment_' . $id);
    $requested_project = absint($_POST['project_id'] ?? 0);
    if ($requested_project && $requested_project !== absint(get_post_meta($id, '_dxcp_project_id', true))) wp_die('This support request does not belong to this project.', '', ['response' => 403]);
    dxcp_collaboration_response(dxcp_add_comment($id, wp_unslash($_POST['message'] ?? '')), $id);
}

function dxcp_handle_task_status() {
    $id = absint($_POST['record_id'] ?? 0);
    dxcp_collaboration_nonce('dxcp_task_status_' . $id);
    dxcp_collaboration_response(dxcp_set_task_status($id, sanitize_key($_POST['status'] ?? '')), $id, 'tasks');
}

function dxcp_handle_ticket_status() {
    $id = absint($_POST['record_id'] ?? $_POST['ticket_id'] ?? 0);
    dxcp_collaboration_nonce('dxcp_ticket_status_' . $id);
    dxcp_collaboration_response(dxcp_set_ticket_status($id, sanitize_key($_POST['status'] ?? '')), $id);
}

function dxcp_handle_new_ticket() {
    dxcp_collaboration_nonce('dxcp_new_ticket');
    $result = dxcp_create_ticket(absint($_POST['project_id'] ?? 0), wp_unslash($_POST['title'] ?? ''), wp_unslash($_POST['message'] ?? ''), sanitize_key($_POST['priority'] ?? 'normal'));
    dxcp_collaboration_response(is_wp_error($result) ? $result : 'ticket_created', is_wp_error($result) ? 0 : $result);
}

foreach (['dxcp_comment' => 'dxcp_handle_comment', 'dxcp_task_status' => 'dxcp_handle_task_status', 'dxcp_ticket_status' => 'dxcp_handle_ticket_status', 'dxcp_new_ticket' => 'dxcp_handle_new_ticket'] as $action => $callback) {
    add_action('admin_post_' . $action, $callback);
    add_action('admin_post_nopriv_' . $action, function () { wp_die('Please sign in to use your client space.', '', ['response' => 403]); });
}

/* Old bookmarks/forms remain functional, using the same ownership rules and private storage. */
function dxcp_legacy_submit_ticket() {
    dxcp_collaboration_nonce('dx_submit_ticket', 'dx_ticket_nonce');
    if (empty($_POST['ticket_confirm'])) wp_die('Please confirm the request details.', '', ['response' => 400]);
    $result = dxcp_create_ticket(absint($_POST['project_id'] ?? 0), wp_unslash($_POST['ticket_title'] ?? ''), wp_unslash($_POST['ticket_message'] ?? ''), 'normal', 'ticket_file');
    if (!is_wp_error($result)) {
        update_post_meta($result, 'project_name', sanitize_text_field(wp_unslash($_POST['project_name'] ?? '')));
        update_post_meta($result, 'project_url', esc_url_raw(wp_unslash($_POST['project_url'] ?? '')));
        for ($i = 1; $i <= 10; $i++) {
            $upload = dxcp_collaboration_file('ticket_image_' . $i, $result);
            if (is_wp_error($upload)) dxcp_collaboration_response($upload, $result);
        }
    }
    dxcp_collaboration_response(is_wp_error($result) ? $result : 'ticket_created', is_wp_error($result) ? 0 : $result);
}

function dxcp_legacy_update_ticket() {
    dxcp_collaboration_nonce('dx_update_ticket', 'dx_update_ticket_nonce');
    $id = absint($_POST['ticket_id'] ?? 0);
    $post = dxcp_collaboration_record($id);
    if (!$post || $post->post_type !== 'ticket') wp_die('This support request was not found.', '', ['response' => 404]);
    dxcp_collaboration_response(dxcp_add_comment($id, wp_unslash($_POST['update_message'] ?? '')), $id);
}

function dxcp_legacy_cancel_ticket() {
    dxcp_collaboration_nonce('dx_cancel_ticket', 'dx_cancel_ticket_nonce');
    $id = absint($_POST['ticket_id'] ?? 0);
    dxcp_collaboration_response(dxcp_set_ticket_status($id, 'cancelled'), $id);
}

add_action('after_setup_theme', function () {
    remove_action('admin_post_dx_submit_ticket', 'dx_handle_ticket_submission');
    remove_action('admin_post_nopriv_dx_submit_ticket', 'dx_handle_ticket_submission');
    remove_action('admin_post_dx_update_ticket', 'dx_handle_ticket_update');
    remove_all_actions('admin_post_dx_cancel_ticket');
    add_action('admin_post_dx_submit_ticket', 'dxcp_legacy_submit_ticket');
    add_action('admin_post_nopriv_dx_submit_ticket', 'dxcp_legacy_submit_ticket');
    add_action('admin_post_dx_update_ticket', 'dxcp_legacy_update_ticket');
    add_action('admin_post_dx_cancel_ticket', 'dxcp_legacy_cancel_ticket');
}, 100);

/* There is no public commenting route for client conversations. */
add_filter('preprocess_comment', function ($data) {
    $post = get_post(absint($data['comment_post_ID'] ?? 0));
    if ($post && in_array($post->post_type, ['ticket', 'dxcp_task', 'dxcp_document', 'dxcp_project'], true)) wp_die('Please use the discussion in your client space.', '', ['response' => 403]);
    return $data;
}, 1);

add_filter('rest_pre_dispatch', function ($result, $server, $request) {
    $route = $request->get_route();
    if (!preg_match('#^/wp/v2/comments(?:/(\d+))?/?$#', $route, $match)) return $result;
    $id = isset($match[1]) ? absint($match[1]) : 0;
    $comment = $id ? get_comment($id) : null;
    $post_ids = array_map('absint', (array) $request->get_param('post'));
    if ($comment) $post_ids[] = (int) $comment->comment_post_ID;
    foreach ($post_ids as $post_id) {
        if (in_array(get_post_type($post_id), ['ticket', 'dxcp_task', 'dxcp_document', 'dxcp_project'], true)) return new WP_Error('rest_forbidden', 'Client discussions are available in the client space.', ['status' => 403]);
    }
    return $result;
}, 10, 3);

add_filter('rest_comment_query', function ($args) {
    $args['post_type'] = array_values(array_diff(get_post_types(['public' => true]), ['ticket', 'dxcp_task', 'dxcp_document', 'dxcp_project']));
    return $args;
}, 10);

add_action('pre_get_comments', function ($query) {
    if (is_admin() || (is_user_logged_in() && !is_feed() && !defined('REST_REQUEST'))) return;
    $query->query_vars['post_type'] = array_values(array_diff(get_post_types(['public' => true]), ['ticket', 'dxcp_task', 'dxcp_document', 'dxcp_project']));
});

add_filter('wp_sitemaps_post_types', function ($types) {
    foreach (['ticket', 'dxcp_task'] as $type) unset($types[$type]);
    return $types;
});

add_action('add_meta_boxes', function () {
    add_meta_box('dxcp-task-details', 'Client to-do details', 'dxcp_task_metabox', 'dxcp_task', 'normal', 'high');
    add_meta_box('dxcp-ticket-details', 'Client support details', 'dxcp_ticket_metabox', 'ticket', 'side', 'high');
});

function dxcp_admin_project_select($post) {
    $selected = absint(get_post_meta($post->ID, '_dxcp_project_id', true));
    $projects = get_posts(['post_type' => 'dxcp_project', 'post_status' => ['private', 'publish', 'draft'], 'posts_per_page' => -1, 'orderby' => 'title', 'order' => 'ASC']);
    echo '<p><label for="dxcp_project_id">Project</label><br><select id="dxcp_project_id" name="dxcp_project_id"><option value="0">Select project</option>';
    foreach ($projects as $project) printf('<option value="%d" %s>%s</option>', $project->ID, selected($selected, $project->ID, false), esc_html($project->post_title));
    echo '</select></p>';
}

function dxcp_task_metabox($post) {
    wp_nonce_field('dxcp_admin_collaboration_' . $post->ID, 'dxcp_admin_collaboration_nonce');
    dxcp_admin_project_select($post);
    $status = get_post_meta($post->ID, '_dxcp_task_status', true) ?: 'todo';
    echo '<p><label for="dxcp_task_status">Status</label><br><select id="dxcp_task_status" name="dxcp_task_status">';
    foreach (dxcp_task_statuses() as $key => $label) printf('<option value="%s" %s>%s</option>', esc_attr($key), selected($status, $key, false), esc_html($label));
    echo '</select></p>';
    if (get_post_meta($post->ID, '_dxcp_completion_requested', true)) echo '<p><strong>The client has asked you to review this to-do.</strong> Set the status to Complete after review.</p>';
    printf('<p><label for="dxcp_due_date">Due date</label><br><input id="dxcp_due_date" name="dxcp_due_date" type="date" value="%s"></p>', esc_attr(get_post_meta($post->ID, '_dxcp_due_date', true)));
    wp_dropdown_users(['name' => 'dxcp_assignee_id', 'selected' => absint(get_post_meta($post->ID, '_dxcp_assignee_id', true)), 'show_option_none' => 'Client / unassigned', 'option_none_value' => 0]);
    echo '<p>To-dos are visible only to the project client and administrators. The client can comment, attach files and ask for completion review.</p>';
}

function dxcp_ticket_metabox($post) {
    wp_nonce_field('dxcp_admin_collaboration_' . $post->ID, 'dxcp_admin_collaboration_nonce');
    dxcp_admin_project_select($post);
    echo '<p><label for="dxcp_ticket_client">Client</label><br>';
    wp_dropdown_users(['name' => 'dxcp_ticket_client', 'id' => 'dxcp_ticket_client', 'selected' => absint(get_post_meta($post->ID, 'ticket_client', true)) ?: absint($post->post_author), 'show_option_none' => 'Select client', 'option_none_value' => 0]);
    echo '</p><p><label for="dxcp_ticket_status">Status</label><br><select id="dxcp_ticket_status" name="dxcp_ticket_status">';
    $status = get_post_meta($post->ID, 'ticket_status', true) ?: 'new';
    foreach (dxcp_ticket_statuses() as $key => $label) printf('<option value="%s" %s>%s</option>', esc_attr($key), selected($status, $key, false), esc_html($label));
    echo '</select></p><p><label for="dxcp_ticket_priority">Priority</label><br><select id="dxcp_ticket_priority" name="dxcp_ticket_priority">';
    $priority = dxcp_ticket_priority(get_post_meta($post->ID, '_dxcp_priority', true));
    foreach (dxcp_ticket_priorities() as $key => $label) printf('<option value="%s" %s>%s</option>', esc_attr($key), selected($priority, $key, false), esc_html($label));
    echo '</select></p><p><label>Assigned to</label><br>';
    wp_dropdown_users(['name' => 'dxcp_ticket_assignee', 'selected' => absint(get_post_meta($post->ID, 'ticket_assignee', true)), 'role__in' => ['administrator'], 'show_option_none' => 'Unassigned', 'option_none_value' => 0]);
    printf('</p><p><label for="dxcp_ticket_due_date">Estimated completion</label><br><input id="dxcp_ticket_due_date" name="dxcp_ticket_due_date" type="date" value="%s"></p>', esc_attr(get_post_meta($post->ID, 'ticket_due_date', true)));
    $words = dxcp_support_words(dxcp_ticket_service($post->ID));
    printf('<p>Use the %s in the client space to reply with private files. Status, assignment and estimated completion remain compatible with existing ticket fields.</p>', esc_html($words['singular']));
    printf('<p><a href="%s">Open %s</a></p>', esc_url(dxcp_record_url($post->ID)), esc_html($words['singular']));
}

add_action('save_post', function ($post_id, $post) {
    if (!in_array($post->post_type, ['ticket', 'dxcp_task'], true) || wp_is_post_revision($post_id) || (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) || !current_user_can('manage_options') || !isset($_POST['dxcp_admin_collaboration_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['dxcp_admin_collaboration_nonce'])), 'dxcp_admin_collaboration_' . $post_id)) return;
    $project_id = absint($_POST['dxcp_project_id'] ?? 0);
    $project = $project_id ? get_post($project_id) : null;
    if ($project_id && (!$project || $project->post_type !== 'dxcp_project')) return;
    if ($post->post_type === 'dxcp_task' && !$project_id) return;
    update_post_meta($post_id, '_dxcp_project_id', $project_id);
    if ($post->post_type === 'dxcp_task') {
        $status = sanitize_key($_POST['dxcp_task_status'] ?? 'todo');
        if (array_key_exists($status, dxcp_task_statuses())) {
            update_post_meta($post_id, '_dxcp_task_status', $status);
            if ($status !== 'waiting') delete_post_meta($post_id, '_dxcp_completion_requested');
        }
        $date = sanitize_text_field(wp_unslash($_POST['dxcp_due_date'] ?? ''));
        update_post_meta($post_id, '_dxcp_due_date', preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) ? $date : '');
        update_post_meta($post_id, '_dxcp_assignee_id', absint($_POST['dxcp_assignee_id'] ?? 0));
    } else {
        $client_id = $project ? absint(get_post_meta($project_id, '_dxcp_client_id', true)) : absint($_POST['dxcp_ticket_client'] ?? 0);
        if ($client_id && get_userdata($client_id)) update_post_meta($post_id, 'ticket_client', $client_id);
        $status = sanitize_key($_POST['dxcp_ticket_status'] ?? 'new');
        if (array_key_exists($status, dxcp_ticket_statuses())) update_post_meta($post_id, 'ticket_status', $status);
        if (isset($_POST['dxcp_ticket_priority'])) update_post_meta($post_id, '_dxcp_priority', dxcp_ticket_priority(sanitize_key(wp_unslash($_POST['dxcp_ticket_priority']))));
        $assignee_id = absint($_POST['dxcp_ticket_assignee'] ?? 0);
        update_post_meta($post_id, 'ticket_assignee', $assignee_id && user_can($assignee_id, 'manage_options') ? $assignee_id : 0);
        $date = sanitize_text_field(wp_unslash($_POST['dxcp_ticket_due_date'] ?? ''));
        update_post_meta($post_id, 'ticket_due_date', preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) ? $date : '');
        update_post_meta($post_id, 'ticket_last_updated', current_time('mysql'));
    }
}, 30, 2);
