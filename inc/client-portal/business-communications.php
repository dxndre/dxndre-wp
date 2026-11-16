<?php
/** Business HQ inbox and communications preferences. */
defined('ABSPATH') || exit;

function dxcp_business_communications_return($view, $message, $args = []) {
    set_transient('dxcp_communications_notice_' . get_current_user_id(), $message, MINUTE_IN_SECONDS);
    wp_safe_redirect(dxcp_business_url($view, $args));
    exit;
}

function dxcp_business_communications_notice() {
    $key = 'dxcp_communications_notice_' . get_current_user_id();
    $message = get_transient($key);
    if (!$message) return;
    delete_transient($key);
    ?><p class="dxcp-notice" role="status"><?php echo esc_html($message); ?></p><?php
}

function dxcp_business_render_communications() {
    if (!dxbs_is_manager()) return;
    $preferences = dxbs_notification_preferences();
    ?>
    <article class="dxcp-card">
        <?php dxcp_card_heading('Communications', 'Email notifications'); dxcp_business_communications_notice(); ?>
        <p>Choose which categories can send automated updates. Messages you explicitly send remain available.</p>
        <?php if (!dxbs_email_live_transport()) : ?>
            <p class="dxcp-callout">Local delivery is simulated. The activity log records the intended recipient and outcome without contacting an email provider.</p>
        <?php endif; ?>
        <?php dxcp_business_form('dxcp_notifications_save'); ?>
            <fieldset class="dxcp-field">
                <legend>Automated categories</legend>
                <?php foreach (dxbs_notification_categories() as $category => $label) : ?>
                    <label><input type="checkbox" name="enabled[<?php echo esc_attr($category); ?>]" value="1" <?php checked($preferences['enabled'][$category]); ?>> <?php echo esc_html($label); ?></label>
                <?php endforeach; ?>
            </fieldset>
            <details class="dxcp-disclosure">
                <summary>Customise email templates</summary>
                <p class="dxcp-muted">Available placeholders <?php echo esc_html(implode(', ', array_map(static fn($key) => '{' . $key . '}', dxbs_notification_placeholders()))); ?>. Leave a field empty to use its original wording.</p>
                <?php foreach (dxbs_notification_templates() as $event => [$category, $subject, $copy]) :
                    $custom = $preferences['templates'][$event] ?? [];
                    ?>
                    <details class="dxcp-disclosure">
                        <summary><?php echo esc_html($subject); ?></summary>
                        <label class="dxcp-field"><span>Subject</span><input name="templates[<?php echo esc_attr($event); ?>][subject]" type="text" maxlength="200" value="<?php echo esc_attr(($custom['subject'] ?? '') ?: $subject); ?>"></label>
                        <label class="dxcp-field"><span>Message</span><textarea name="templates[<?php echo esc_attr($event); ?>][copy]" rows="3" maxlength="4000"><?php echo esc_textarea(($custom['copy'] ?? '') ?: $copy); ?></textarea></label>
                    </details>
                <?php endforeach; ?>
            </details>
            <button class="dxcp-btn dxcp-btn--dark" type="submit">Save notification settings</button>
        </form>
    </article>
    <?php dxcp_business_render_email_activity(dxbs_email_jobs(['limit' => 50]), 'settings');
}
add_action('admin_post_dxcp_notifications_save', function () {
    if (!dxbs_is_manager()) wp_die('This area is restricted.', '', ['response' => 403]);
    check_admin_referer('dxcp_notifications_save');
    $result = dxbs_save_notification_preferences(wp_unslash($_POST));
    dxcp_business_communications_return('settings', is_wp_error($result) ? $result->get_error_message() : 'Notification settings saved.');
});

function dxcp_business_render_email_activity(array $jobs, $view, $ticket_id = 0) {
    $statuses = ['queued' => 'Queued', 'sent' => 'Sent', 'failed' => 'Failed', 'retry' => 'Retry scheduled', 'held' => 'Held', 'cancelled' => 'Cancelled', 'simulated' => 'Simulated locally', 'sending' => 'Sending'];
    $is_ticket = $ticket_id > 0;
    ?>
    <article class="dxcp-card">
        <?php dxcp_card_heading('Delivery', $is_ticket ? 'Ticket notification history' : 'Email activity'); ?>
        <?php if (!$jobs) : ?>
            <p class="dxcp-muted">No emails have been queued here yet.</p>
        <?php else : ?>
            <div class="dxcp-table-wrap"><table class="dxcp-table">
                <thead><tr><th scope="col">Email</th><th scope="col">Record</th><th scope="col">Delivery</th><th scope="col">History</th></tr></thead>
                <tbody>
                <?php foreach ($jobs as $job) :
                    $state = $statuses[$job['status']] ?? $job['status'];
                    $record = dxbs_type_table($job['entity_type']) ? dxbs_record_raw($job['entity_type'], $job['entity_id']) : null;
                    $reference = $record['number'] ?? ($job['entity_type'] === 'ticket' ? dxcp_ticket_reference($job['entity_id']) : '#' . $job['entity_id']); ?>
                    <tr>
                        <td><strong><?php echo esc_html($job['subject']); ?></strong><small><?php echo esc_html($job['recipient']); ?></small><small><?php echo esc_html(str_replace('_', ' ', $job['template'])); ?></small></td>
                        <td><?php echo esc_html(ucfirst($job['entity_type']) . ' ' . $reference); ?></td>
                        <td><?php dxcp_badge($state, $job['status'] === 'sent' ? 'green' : ''); ?>
                            <small><?php echo esc_html(dxcp_communications_date($job['sent_at'] ?: $job['created_at'])); ?></small>
                            <?php if ($job['last_error']) : ?><small><?php echo esc_html($job['last_error']); ?></small><?php endif; ?>
                            <?php if (in_array($job['status'], ['failed', 'held'], true)) : ?>
                                <?php dxcp_business_form('dxcp_notifications_retry'); ?>
                                    <input type="hidden" name="job_id" value="<?php echo absint($job['id']); ?>">
                                    <input type="hidden" name="return_view" value="<?php echo esc_attr($view); ?>">
                                    <input type="hidden" name="ticket_id" value="<?php echo absint($ticket_id); ?>">
                                    <button type="submit" class="dxcp-btn dxcp-btn--small">Retry email</button>
                                </form>
                            <?php endif; ?>
                        </td>
                        <td><?php if ($job['history']) : ?>
                            <details class="dxcp-disclosure">
                                <summary><?php echo esc_html(sprintf('%d attempt(s)', $job['attempts'])); ?></summary>
                                <ul><?php foreach ($job['history'] as $entry) : ?>
                                    <li><?php echo esc_html(dxcp_communications_date($entry['at']) . ' · ' . ($statuses[$entry['state']] ?? $entry['state'])); ?>
                                        <?php if (!empty($entry['reason'])) : ?><small><?php echo esc_html($entry['reason']); ?></small><?php endif; ?>
                                    </li>
                                <?php endforeach; ?></ul>
                            </details>
                        <?php else : ?><small><?php echo esc_html(sprintf('%d attempt(s)', $job['attempts'])); ?></small><?php endif; ?></td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table></div>
        <?php endif; ?>
    </article>
    <?php
}

function dxcp_communications_date($utc) {
    return wp_date('j M Y · H:i', strtotime($utc . ' UTC'), new DateTimeZone('Europe/London'));
}

add_action('admin_post_dxcp_notifications_retry', function () {
    if (!dxbs_is_manager()) wp_die('This area is restricted.', '', ['response' => 403]);
    check_admin_referer('dxcp_notifications_retry');
    $result = dxbs_retry_email(absint($_POST['job_id'] ?? 0));
    $requested_view = sanitize_key($_POST['return_view'] ?? '');
    $view = in_array($requested_view, ['support', 'reports'], true) ? $requested_view : 'settings';
    $args = $view === 'support' ? ['ticket_id' => absint($_POST['ticket_id'] ?? 0)] : [];
    dxcp_business_communications_return($view, is_wp_error($result) ? $result->get_error_message() : 'Email retry scheduled.', $args);
});

function dxcp_business_support_query($search, $status, $priority, $page) {
    $args = [
        'post_type' => 'ticket', 'post_status' => ['private', 'publish', 'draft', 'pending'],
        'posts_per_page' => 25, 'paged' => $page, 'ignore_sticky_posts' => true,
        'orderby' => ['modified' => 'DESC', 'ID' => 'DESC'], 'meta_query' => [],
    ];
    if (preg_match('/^SUP-0*([1-9][0-9]*)$/iD', $search, $match)) {
        $args['p'] = absint($match[1]);
    } elseif ($search !== '') {
        $args['s'] = $search;
    }
    if (isset(dxcp_ticket_statuses()[$status])) {
        $args['meta_query'][] = $status === 'new'
            ? ['relation' => 'OR', ['key' => 'ticket_status', 'value' => 'new'], ['key' => 'ticket_status', 'compare' => 'NOT EXISTS'], ['key' => 'ticket_status', 'value' => '']]
            : ['key' => 'ticket_status', 'value' => $status];
    }
    if (isset(dxcp_ticket_priorities()[$priority])) {
        $args['meta_query'][] = $priority === 'normal'
            ? ['relation' => 'OR', ['key' => '_dxcp_priority', 'value' => 'normal'], ['key' => '_dxcp_priority', 'compare' => 'NOT EXISTS']]
            : ['key' => '_dxcp_priority', 'value' => $priority];
    }
    return new WP_Query($args);
}

function dxcp_business_render_support() {
    if (!dxbs_is_manager()) return;
    $search = sanitize_text_field(dxcp_business_query('ticket_search'));
    $status = sanitize_key(dxcp_business_query('ticket_status'));
    $priority = sanitize_key(dxcp_business_query('ticket_priority'));
    $page = max(1, absint(dxcp_business_query('ticket_page')));
    $id = absint(dxcp_business_query('ticket_id'));
    $query = dxcp_business_support_query($search, $status, $priority, $page);
    $ticket = $id ? dxcp_collaboration_record($id) : null;
    if ($ticket && $ticket->post_type !== 'ticket') $ticket = null;
    $filters = array_filter(['ticket_search' => $search, 'ticket_status' => $status, 'ticket_priority' => $priority, 'ticket_page' => $page > 1 ? $page : '']);
    ?>
    <div class="dxcp-view-heading"><p class="dxcp-eyebrow">Client conversations</p><h2>Support inbox</h2></div>
    <?php dxcp_business_communications_notice(); ?>
    <div class="dxcp-detail-layout">
        <article class="dxcp-card dxcp-record-list">
            <form class="dxcp-form" action="<?php echo esc_url(home_url('/dashboard/')); ?>" method="get">
                <input type="hidden" name="section" value="business">
                <input type="hidden" name="business_view" value="support">
                <?php dxcp_field('Search by subject, message or reference', 'ticket_search', $search, 'search'); ?>
                <label class="dxcp-field"><span>Status</span><select name="ticket_status">
                    <option value="">All statuses</option>
                    <?php foreach (dxcp_ticket_statuses() as $key => $label) : ?><option value="<?php echo esc_attr($key); ?>" <?php selected($status, $key); ?>><?php echo esc_html($label); ?></option><?php endforeach; ?>
                </select></label>
                <label class="dxcp-field"><span>Priority</span><select name="ticket_priority">
                    <option value="">All priorities</option>
                    <?php foreach (dxcp_ticket_priorities() as $key => $label) : ?><option value="<?php echo esc_attr($key); ?>" <?php selected($priority, $key); ?>><?php echo esc_html($label); ?></option><?php endforeach; ?>
                </select></label>
                <button type="submit" class="dxcp-btn dxcp-btn--small">Filter tickets</button>
                <a href="#dxhq-new-support" class="dxcp-text-link">Open a ticket</a>
            </form>
            <?php if (!$query->posts) : ?><p class="dxcp-muted">No tickets match these filters.</p><?php endif;
            foreach ($query->posts as $row) :
                $row_status = get_post_meta($row->ID, 'ticket_status', true);
                $row_priority = dxcp_ticket_priority(get_post_meta($row->ID, '_dxcp_priority', true));
                $user = get_userdata(dxcp_ticket_client_id($row));
                $unread = $row->ID !== $id && dxcp_ticket_unread($row->ID);
                $last = dxcp_ticket_last_reply($row->ID);
                ?>
                <a class="dxcp-list-row" href="<?php echo esc_url(dxcp_business_url('support', $filters + ['ticket_id' => $row->ID])); ?>" <?php if ($row->ID === $id) echo 'aria-current="page"'; ?>>
                    <span><strong><?php echo esc_html($row->post_title); ?></strong>
                        <small><?php echo esc_html(dxcp_ticket_reference($row->ID) . ' · ' . ($user ? $user->display_name : 'Client unassigned')); ?></small>
                        <small><?php echo esc_html($last ? 'Last reply ' . dxcp_communications_date($last->comment_date_gmt) : 'Opened ' . get_the_date('j M Y', $row)); ?></small>
                    </span>
                    <span><?php if ($unread) dxcp_badge('Unread', 'gold'); dxcp_badge(dxcp_ticket_status_label($row_status)); if ($row_priority === 'urgent') dxcp_badge('Urgent', 'gold'); ?></span>
                </a>
            <?php endforeach; ?>
            <?php if ($query->max_num_pages > 1) : ?>
                <nav class="dxcp-inline" aria-label="Inbox pages">
                    <?php if ($page > 1) : ?><a class="dxcp-text-link" href="<?php echo esc_url(dxcp_business_url('support', array_merge($filters, ['ticket_page' => $page - 1]))); ?>">Previous</a><?php endif; ?>
                    <span><?php echo esc_html($page . ' of ' . $query->max_num_pages); ?></span>
                    <?php if ($page < $query->max_num_pages) : ?><a class="dxcp-text-link" href="<?php echo esc_url(dxcp_business_url('support', array_merge($filters, ['ticket_page' => $page + 1]))); ?>">Next</a><?php endif; ?>
                </nav>
            <?php endif; ?>
        </article>
        <div>
            <?php if ($ticket) :
                dxcp_business_render_ticket_controls($ticket);
                dxcp_render_conversation($ticket, 0, false, true);
                dxcp_business_render_email_activity(dxbs_email_jobs(['type' => 'ticket', 'id' => $id, 'limit' => 30]), 'support', $id);
            else : ?>
                <article class="dxcp-card"><?php dxcp_empty('Choose a support ticket', 'Open a ticket to see its conversation and manage the next step.', 'support'); ?></article>
            <?php endif; ?>
            <?php dxcp_business_render_ticket_create(); ?>
        </div>
    </div>
    <?php
}

function dxcp_business_render_ticket_controls($ticket) {
    $id = (int) $ticket->ID;
    $status = get_post_meta($id, 'ticket_status', true) ?: 'new';
    $priority = dxcp_ticket_priority(get_post_meta($id, '_dxcp_priority', true));
    $assigned = absint(get_post_meta($id, 'ticket_assignee', true));
    $client = get_userdata(dxcp_ticket_client_id($ticket));
    $project = get_post(absint(get_post_meta($id, '_dxcp_project_id', true)));
    ?>
    <article class="dxcp-card">
        <?php dxcp_card_heading(dxcp_ticket_reference($id), 'Ticket details'); ?>
        <p class="dxcp-muted"><?php echo esc_html(($client ? $client->display_name : 'Client unassigned') . ' · ' . ($project ? $project->post_title : 'No linked project')); ?></p>
        <?php dxcp_business_form('dxcp_support_inbox_update'); ?>
            <input type="hidden" name="ticket_id" value="<?php echo $id; ?>">
            <div class="dxcp-form-grid">
                <label class="dxcp-field"><span>Status</span><select name="status">
                    <?php foreach (dxcp_ticket_statuses() as $key => $label) : ?><option value="<?php echo esc_attr($key); ?>" <?php selected($status, $key); ?>><?php echo esc_html($label); ?></option><?php endforeach; ?>
                </select></label>
                <label class="dxcp-field"><span>Priority</span><select name="priority">
                    <?php foreach (dxcp_ticket_priorities() as $key => $label) : ?><option value="<?php echo esc_attr($key); ?>" <?php selected($priority, $key); ?>><?php echo esc_html($label); ?></option><?php endforeach; ?>
                </select></label>
                <label class="dxcp-field"><span>Assigned to</span>
                    <?php wp_dropdown_users(['name' => 'assignee_id', 'selected' => $assigned, 'role' => 'administrator', 'show_option_none' => 'Unassigned', 'option_none_value' => 0]); ?>
                </label>
                <?php dxcp_field('Estimated completion', 'due_date', get_post_meta($id, 'ticket_due_date', true), 'date'); ?>
            </div>
            <button class="dxcp-btn dxcp-btn--small" type="submit">Update ticket</button>
        </form>
    </article>
    <?php
}
add_action('admin_post_dxcp_support_inbox_update', function () {
    if (!dxbs_is_manager()) wp_die('This area is restricted.', '', ['response' => 403]);
    check_admin_referer('dxcp_support_inbox_update');
    $id = absint($_POST['ticket_id'] ?? 0);
    $ticket = dxcp_collaboration_record($id);
    $status = sanitize_key($_POST['status'] ?? '');
    $assignee = absint($_POST['assignee_id'] ?? 0);
    $due = sanitize_text_field(wp_unslash($_POST['due_date'] ?? ''));
    $date = $due !== '' ? DateTimeImmutable::createFromFormat('!Y-m-d', $due) : null;
    $args = ['ticket_id' => $id];
    if (!$ticket || $ticket->post_type !== 'ticket' || !isset(dxcp_ticket_statuses()[$status]) || ($assignee && !user_can($assignee, 'manage_options')) || ($due !== '' && (!$date || $date->format('Y-m-d') !== $due))) {
        dxcp_business_communications_return('support', 'Choose a valid ticket status, assignee and completion date.', $args);
    }
    if (!dxcp_ticket_set_status($ticket, $status)) {
        dxcp_business_communications_return('support', 'The ticket status changed. Reopen the ticket and try again.', $args);
    }
    update_post_meta($id, '_dxcp_priority', dxcp_ticket_priority(sanitize_key($_POST['priority'] ?? '')));
    $previous_assignee = absint(get_post_meta($id, 'ticket_assignee', true));
    if (update_post_meta($id, 'ticket_assignee', $assignee) && $assignee) dxcp_ticket_publish_change($ticket, 'ticket_assigned', $previous_assignee, $assignee);
    if (update_post_meta($id, 'ticket_due_date', $due)) {
        dxcp_ticket_publish_change($ticket, 'ticket_updated', '__changed', $due, $due ? 'Estimated completion ' . wp_date('j M Y', strtotime($due . ' 12:00:00 UTC'), new DateTimeZone('Europe/London')) : 'The estimated completion date has been cleared.');
    }
    dxcp_business_communications_return('support', 'Ticket updated.', $args);
});

function dxcp_business_render_ticket_create() {
    $users = get_users(['role__in' => ['client', 'subscriber'], 'orderby' => 'display_name', 'number' => 300]);
    $users = array_filter($users, static fn($user) => dxcp_is_client_user($user->ID));
    $projects = dxcp_projects();
    ?>
    <article class="dxcp-card" id="dxhq-new-support">
        <?php dxcp_card_heading('New conversation', 'Open a support ticket'); dxcp_form_start('dxcp_new_ticket', 0, 'dxcp_new_ticket', true); ?>
            <input type="hidden" name="dxcp_support_inbox" value="1">
            <label class="dxcp-field"><span>Client account</span><select name="client_user_id" required>
                <option value="">Choose a client</option>
                <?php foreach ($users as $user) : ?><option value="<?php echo absint($user->ID); ?>"><?php echo esc_html($user->display_name . ' (' . $user->user_email . ')'); ?></option><?php endforeach; ?>
            </select></label>
            <label class="dxcp-field"><span>Project (optional)</span><select name="linked_project_id">
                <option value="0">No linked project</option>
                <?php foreach ($projects as $project) : ?><option value="<?php echo absint($project->ID); ?>"><?php echo esc_html($project->post_title); ?></option><?php endforeach; ?>
            </select></label>
            <?php dxcp_field('Subject', 'title', '', 'text', true); ?>
            <label class="dxcp-field"><span>Message</span><textarea name="message" rows="4" required maxlength="12000"></textarea></label>
            <label class="dxcp-field"><span>Priority</span><select name="priority">
                <?php foreach (dxcp_ticket_priorities() as $key => $label) : ?><option value="<?php echo esc_attr($key); ?>"><?php echo esc_html($label); ?></option><?php endforeach; ?>
            </select></label>
            <label class="dxcp-field"><span>Attach a file (optional · 5 MB max)</span><input type="file" name="dxcp_file"></label>
            <button class="dxcp-btn dxcp-btn--dark" type="submit">Open ticket</button>
        </form>
    </article>
    <?php
}

