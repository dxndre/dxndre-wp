<?php
/** HQ operations use the existing client workspace posts and Business directory. */
defined('ABSPATH') || exit;

function dxcp_hq_project_statuses() {
    return ['active' => 'Active', 'on_hold' => 'On hold', 'completed' => 'Completed'];
}

function dxcp_hq_project_status($project) {
    $status = get_post_meta($project->ID, '_dxhq_project_status', true);
    if (isset(dxcp_hq_project_statuses()[$status])) return $status;
    if (get_post_meta($project->ID, '_dxcp_phase', true) === 'post_launch') return 'completed';
    return in_array($project->post_status, ['draft', 'pending', 'future'], true) ? 'on_hold' : 'active';
}

function dxcp_hq_project_stages($service) {
    switch ($service) {
        case 'fitness':
            return [
                'quotation' => ['Coaching plan', 'Agree your goals and coaching arrangements.', ''],
                'design' => ['Assessment', 'Review your starting point and training priorities.', ''],
                'development' => ['Training', 'Follow your programme and prepare for upcoming sessions.', ''],
                'testing' => ['Progress review', 'Review your progress and agree any adjustments.', ''],
                'launch' => ['Next steps', 'Agree the next phase of your training.', ''],
                'post_launch' => ['Coaching complete', 'Review your progress and resources.', ''],
            ];
        case 'photography':
            return [
                'quotation' => ['Shoot brief', 'Agree the purpose, scope and date of the shoot.', ''],
                'design' => ['Planning', 'Confirm the location, shot list and timings.', ''],
                'development' => ['Shoot', 'The agreed photography takes place.', ''],
                'testing' => ['Selection', 'Review selections and provide any agreed feedback.', ''],
                'launch' => ['Delivery', 'Your photographs and usage information are ready.', ''],
                'post_launch' => ['Shoot complete', 'Keep your shared gallery and documents to hand.', ''],
            ];
        default:
            return dxcp_phases();
    }
}

function dxcp_hq_projects_for_client($client) {
    if (!dxbs_is_manager() || empty($client['id'])) return [];
    $conditions = [['key' => '_dxbs_client_id', 'value' => $client['id'], 'type' => 'NUMERIC']];
    if (!empty($client['wp_user_id'])) {
        $conditions[] = [
            'relation' => 'AND',
            ['key' => '_dxcp_client_id', 'value' => $client['wp_user_id'], 'type' => 'NUMERIC'],
            ['relation' => 'OR',
                ['key' => '_dxbs_client_id', 'compare' => 'NOT EXISTS'],
                ['key' => '_dxbs_client_id', 'value' => 0, 'type' => 'NUMERIC'],
            ],
        ];
    }
    return get_posts([
        'post_type' => 'dxcp_project',
        'post_status' => ['private', 'publish', 'draft', 'pending', 'future'],
        'numberposts' => -1,
        'orderby' => 'modified',
        'meta_query' => array_merge(['relation' => 'OR'], $conditions),
    ]);
}

function dxcp_hq_notify_project($id, $event, $event_id, $detail) {
    if (!function_exists('dxbs_notify')) return;
    $user = get_userdata(absint(get_post_meta($id, '_dxcp_client_id', true)));
    if (!$user) return;
    dxbs_notify($event, 'project', $id, (string) $event_id, $user->user_email, [
        'name' => get_the_title($id),
        'detail' => $detail,
        'link' => dxcp_portal_url('overview', $id),
    ]);
}

function dxcp_hq_save_project($input) {
    if (!dxbs_is_manager()) return dxbs_require_manager();
    $id = absint($input['id'] ?? 0);
    $project = $id ? dxcp_project_for_user($id) : null;
    if ($id && !$project) return dxbs_error('project_missing', 'This project is unavailable.');
    $title = trim(sanitize_text_field($input['title'] ?? ''));
    $service = sanitize_key($input['service'] ?? '');
    $stage = sanitize_key($input['stage'] ?? '');
    $status = sanitize_key($input['status'] ?? '');
    $stages = dxcp_hq_project_stages($service);
    $client_id = absint($input['client_id'] ?? 0);
    $client = $client_id ? dxbs_client($client_id) : null;
    $category_id = absint($input['category_id'] ?? 0);
    $category_ids = array_column(dxbs_categories(!$project), 'id');
    $milestone = trim(sanitize_text_field($input['milestone'] ?? ''));
    $milestone_date = trim(sanitize_text_field($input['milestone_date'] ?? ''));
    if (!$title || mb_strlen($title) > 191 || !in_array($service, ['digital', 'fitness', 'photography', 'support'], true) || !isset($stages[$stage], dxcp_hq_project_statuses()[$status]) || ($category_id && !in_array($category_id, $category_ids, true))) {
        return dxbs_error('project_fields', 'Enter a project name and choose a valid service, category, stage and status.');
    }
    if (mb_strlen($milestone) > 191 || ($milestone_date && (!dxbs_date($milestone_date) || !$milestone))) {
        return dxbs_error('milestone', 'Enter a milestone name and a valid date.');
    }
    $owner = $project ? absint(get_post_meta($id, '_dxcp_client_id', true)) : absint($client['wp_user_id'] ?? 0);
    $old_client_id = $project ? absint(get_post_meta($id, '_dxbs_client_id', true)) : 0;
    if ((!$project && (!$client || !in_array($client['status'], ['active', 'prospect'], true)))
        || ($client_id && (!$client || (absint($client['wp_user_id']) !== $owner && $client_id !== $old_client_id)))
        || ($old_client_id && $old_client_id !== $client_id)) {
        return dxbs_error('project_client', 'Choose the matching directory client. Existing project ownership can be reviewed in WordPress.');
    }
    $old_stage = $project ? get_post_meta($id, '_dxcp_phase', true) : '';
    $old_status = $project ? dxcp_hq_project_status($project) : '';
    $old_milestone = $project ? get_post_meta($id, '_dxhq_milestone', true) : '';
    $old_date = $project ? get_post_meta($id, '_dxhq_milestone_date', true) : '';
    $post = [
        'post_type' => 'dxcp_project',
        'post_title' => $title,
        'post_content' => wp_kses_post($input['description'] ?? ''),
        'meta_input' => [
            '_dxbs_client_id' => $client_id,
            '_dxbs_category_id' => $category_id,
            '_dxcp_service' => $service,
            '_dxcp_phase' => $stage,
            '_dxhq_project_status' => $status,
            '_dxhq_milestone' => $milestone,
            '_dxhq_milestone_date' => $milestone_date,
        ],
    ];
    if ($project) {
        $post['ID'] = $id;
        $saved = wp_update_post(wp_slash($post), true);
    } else {
        $post['post_status'] = 'private';
        $post['meta_input']['_dxcp_client_id'] = $owner;
        $saved = wp_insert_post(wp_slash($post), true);
    }
    if (is_wp_error($saved)) return $saved;
    $event = !$project ? 'project_created' : ($old_stage !== $stage ? 'project_stage' : ($old_status !== $status ? 'project_status' : 'project_updated'));
    $logged = dxbs_audit($event, 'project', $saved, ['fields' => array_keys($post['meta_input'])]);
    if ($logged && !empty($input['notify'])) {
        $detail = 'Stage · ' . $stages[$stage][0] . '. Status · ' . dxcp_hq_project_statuses()[$status] . '.';
        if ($milestone) $detail .= ' Next milestone · ' . $milestone . ($milestone_date ? ' (' . $milestone_date . ').' : '.');
        if ($event !== 'project_updated' || $milestone !== $old_milestone || $milestone_date !== $old_date) {
            dxcp_hq_notify_project($saved, $event === 'project_updated' ? 'project_stage' : $event, $GLOBALS['wpdb']->insert_id, $detail);
        }
    }
    return (int) $saved;
}

function dxcp_hq_save_task($input) {
    if (!dxbs_is_manager()) return dxbs_require_manager();
    $id = absint($input['id'] ?? 0);
    $task = $id ? dxcp_collaboration_record($id) : null;
    if ($id && (!$task || $task->post_type !== 'dxcp_task')) return dxbs_error('task_missing', 'This task is unavailable.');
    $pid = absint($input['project_id'] ?? 0);
    $project = dxcp_project_for_user($pid);
    $title = trim(sanitize_text_field($input['title'] ?? ''));
    $description = sanitize_textarea_field($input['description'] ?? '');
    $status = sanitize_key($input['status'] ?? '');
    $priority = sanitize_key($input['priority'] ?? '');
    $due = trim(sanitize_text_field($input['due_date'] ?? ''));
    $internal = ($input['visibility'] ?? '') === 'internal';
    $approval = ($input['kind'] ?? '') === 'approval';
    $priorities = dxcp_hq_task_priorities();
    if (!$project || !$title || mb_strlen($title) > 191 || mb_strlen($description) > 10000 || !isset(dxcp_task_statuses()[$status], $priorities[$priority]) || ($due && !dxbs_date($due))) {
        return dxbs_error('task_fields', 'Choose a project, name, priority and status. Use a valid date if the task has a deadline.');
    }
    if ($task && (int) get_post_meta($id, '_dxcp_project_id', true) !== $pid) {
        return dxbs_error('task_project', 'This task already belongs to another project.');
    }
    $previously_internal = $task && get_post_meta($id, '_dxcp_internal_only', true);
    if ($previously_internal && !$internal) {
        return dxbs_error('task_visibility', 'Create a separate client task to share an update from an internal task.');
    }
    if (!$internal && !get_post_meta($pid, '_dxcp_client_id', true)) {
        return dxbs_error('task_client', 'Link a client account to the project before adding a shared task.');
    }
    $post = [
        'post_type' => 'dxcp_task',
        'post_title' => $title,
        'post_content' => $description,
        'meta_input' => [
            '_dxcp_project_id' => $pid,
            '_dxcp_internal_only' => $internal ? 1 : 0,
            '_dxcp_task_status' => $status,
            '_dxcp_due_date' => $due,
            '_dxhq_priority' => $priority,
            '_dxhq_task_kind' => $approval ? 'approval' : 'task',
        ],
    ];
    if ($task) {
        $post['ID'] = $id;
        $saved = wp_update_post(wp_slash($post), true);
    } else {
        $post['post_status'] = 'private';
        $saved = wp_insert_post(wp_slash($post), true);
    }
    if (is_wp_error($saved)) return $saved;
    if ($status !== 'waiting') delete_post_meta($saved, '_dxcp_completion_requested');
    $event = $task ? 'task_updated' : 'task_created';
    dxbs_audit($event, 'task', $saved);
    if (!$task && !$internal && $status !== 'done' && !empty($input['notify'])) {
        dxcp_hq_notify_project($pid, $approval ? 'project_approval_requested' : 'project_action_required', 'task-' . $saved, $title);
    }
    return (int) $saved;
}

function dxcp_hq_task_priorities() {
    return ['low' => 'Low', 'normal' => 'Normal', 'high' => 'High', 'urgent' => 'Urgent'];
}

foreach (['project' => 'projects', 'task' => 'tasks'] as $record => $view) {
    add_action('admin_post_dxcp_hq_save_' . $record, static function () use ($record, $view) {
        if (!dxbs_is_manager()) wp_die('Permission denied.', '', ['response' => 403]);
        check_admin_referer('dxcp_hq_save_' . $record);
        $input = isset($_POST[$record]) && is_array($_POST[$record]) ? wp_unslash($_POST[$record]) : [];
        $input = array_filter($input, 'is_scalar');
        $result = call_user_func('dxcp_hq_save_' . $record, $input);
        $error = is_wp_error($result);
        set_transient('dxbs_notice_' . get_current_user_id(), [
            'type' => $error ? 'error' : 'success',
            'message' => $error ? $result->get_error_message() : ucfirst($record) . ' saved.',
        ], 5 * MINUTE_IN_SECONDS);
        $args = $error ? (empty($input['id']) ? ['new_' . $record => 1] : [$record === 'project' ? 'workspace_id' : 'task_id' => absint($input['id'])]) : [$record === 'project' ? 'workspace_id' : 'task_id' => $result];
        wp_safe_redirect(dxcp_business_url($view, $args));
        exit;
    });
}

function dxcp_hq_select($label, $name, $options, $value, $required = false) {
    ?>
    <label class="dxcp-field"><span><?php echo esc_html($label); ?></span><select name="<?php echo esc_attr($name); ?>" <?php echo $required ? 'required' : ''; ?>>
        <?php foreach ($options as $key => $caption) : ?>
            <option value="<?php echo esc_attr($key); ?>" <?php selected((string) $value, (string) $key); ?>><?php echo esc_html($caption); ?></option>
        <?php endforeach; ?>
    </select></label>
    <?php
}

function dxcp_hq_project_url($id) {
    return dxcp_business_url('projects', ['workspace_id' => absint($id)]);
}

function dxcp_hq_render_project_form($project = null) {
    $id = $project ? $project->ID : 0;
    $owner = $project ? absint(get_post_meta($id, '_dxcp_client_id', true)) : 0;
    $client_id = $project ? absint(get_post_meta($id, '_dxbs_client_id', true)) : absint(dxcp_business_query('client_id', '0'));
    $clients = ['' => $project ? 'No directory client' : 'Choose a client'];
    foreach (dxbs_clients(['status' => 'all', 'limit' => 200]) as $client) {
        if ($project && $client_id && $client['id'] !== $client_id) continue;
        if ($project && !$client_id && absint($client['wp_user_id']) !== $owner) continue;
        if (!$project && !in_array($client['status'], ['active', 'prospect'], true)) continue;
        $clients[$client['id']] = $client['name'];
    }
    $service = get_post_meta($id, '_dxcp_service', true) ?: 'digital';
    $phase = get_post_meta($id, '_dxcp_phase', true) ?: 'quotation';
    $categories = [0 => 'No category'] + array_column(dxbs_categories(!$project), 'name', 'id');
    $services = ['digital' => 'Digital', 'fitness' => 'Fitness', 'photography' => 'Photography', 'support' => 'Ongoing support'];
    $stages = array_map(static fn($stage) => $stage[0], dxcp_hq_project_stages($service));
    ?>
    <article class="dxcp-card">
        <?php dxcp_card_heading('', $project ? 'Project details' : 'Create a project'); dxcp_business_form('dxcp_hq_save_project'); ?>
        <input type="hidden" name="project[id]" value="<?php echo absint($id); ?>">
        <div class="dxcp-form-grid">
            <?php
            dxcp_field('Project name', 'project[title]', $project->post_title ?? '', 'text', true);
            dxcp_hq_select('Directory client', 'project[client_id]', $clients, $client_id, !$project);
            dxcp_hq_select('Service workflow', 'project[service]', $services, $service);
            dxcp_hq_select('Service category', 'project[category_id]', $categories, get_post_meta($id, '_dxbs_category_id', true));
            dxcp_hq_select('Status', 'project[status]', dxcp_hq_project_statuses(), $project ? dxcp_hq_project_status($project) : 'active');
            if ($project) {
                dxcp_hq_select('Stage', 'project[stage]', $stages, $phase);
            } else {
                echo '<input type="hidden" name="project[stage]" value="quotation">';
            }
            dxcp_field('Next milestone', 'project[milestone]', get_post_meta($id, '_dxhq_milestone', true));
            dxcp_field('Milestone date', 'project[milestone_date]', get_post_meta($id, '_dxhq_milestone_date', true), 'date');
            ?>
        </div>
        <label class="dxcp-field"><span>Project brief</span><textarea name="project[description]" rows="4"><?php echo esc_textarea($project->post_content ?? ''); ?></textarea></label>
        <label class="dxcp-checkbox"><input type="checkbox" name="project[notify]" value="1"><span>Queue an update for the linked client account when the project is created or its stage, status or milestone changes</span></label>
        <button type="submit" class="dxcp-btn dxcp-btn--dark"><?php echo $project ? 'Save project' : 'Create project'; ?></button>
        </form>
    </article>
    <?php
}

function dxcp_hq_render_projects() {
    if (!dxbs_is_manager()) return;
    $id = absint(dxcp_business_query('workspace_id', '0'));
    if ($id) {
        $project = dxcp_project_for_user($id);
        if (!$project) { dxcp_empty('Project unavailable', 'Choose a project from the register.', 'journey'); return; }
        dxcp_hq_render_project_form($project);
        dxcp_hq_render_project_links($project);
        dxcp_hq_render_activity('project', $id);
        return;
    }
    if (isset($_GET['new_project'])) {
        dxcp_hq_render_project_form();
        return;
    }
    $search = sanitize_text_field(dxcp_business_query('q'));
    $status = sanitize_key(dxcp_business_query('project_status'));
    $data = dxcp_admin_data($_GET);
    $projects = $data['projects'] ?? [];
    if (isset(dxcp_hq_project_statuses()[$status])) {
        $projects = array_filter($projects, static fn($project) => dxcp_hq_project_status($project) === $status);
    }
    ?>
    <article class="dxcp-card">
        <?php dxcp_card_heading('', 'Project register', dxcp_business_url('projects', ['new_project' => 1]), 'Create project'); ?>
        <form method="get" class="dxcp-form" action="<?php echo esc_url(home_url('/dashboard/')); ?>">
            <input type="hidden" name="section" value="business"><input type="hidden" name="business_view" value="projects">
            <div class="dxbs-toolbar">
                <?php dxcp_field('Search projects or clients', 'q', $search, 'search');
                dxcp_hq_select('Client account', 'client_id', ['' => 'All clients'] + array_map(static fn($client) => $client->display_name, $data['clients'] ?? []), $data['client_id'] ?? '');
                dxcp_hq_select('Service', 'service', ['' => 'All services', 'digital' => 'Digital', 'fitness' => 'Fitness', 'photography' => 'Photography', 'support' => 'Ongoing support'], $data['service'] ?? '');
                dxcp_hq_select('Stage', 'phase', ['' => 'All stages'] + array_combine(array_keys(dxcp_phases()), array_column(dxcp_phases(), 0)), $data['phase'] ?? '');
                dxcp_hq_select('Project status', 'project_status', ['' => 'All statuses'] + dxcp_hq_project_statuses(), $status); ?>
                <button type="submit" class="dxcp-btn dxcp-btn--small">Filter</button>
            </div>
        </form>
        <?php if (!$projects) : ?><p class="dxcp-muted">No matching projects.</p><?php endif; ?>
        <?php foreach ($projects as $project) : dxcp_hq_project_row($project); endforeach; ?>
    </article>
    <?php
}

function dxcp_hq_project_row($project) {
    $service = get_post_meta($project->ID, '_dxcp_service', true) ?: 'digital';
    $phase = get_post_meta($project->ID, '_dxcp_phase', true) ?: 'quotation';
    $status = dxcp_hq_project_status($project);
    ?>
    <a class="dxcp-list-row" href="<?php echo esc_url(dxcp_hq_project_url($project->ID)); ?>">
        <span><strong><?php echo esc_html($project->post_title); ?></strong><small><?php echo esc_html(ucfirst($service) . ' · ' . (dxcp_hq_project_stages($service)[$phase][0] ?? 'Getting started')); ?></small></span>
        <span><?php if (get_post_meta($project->ID, '_dxcp_demo', true)) dxcp_badge('Test workspace'); dxcp_badge(dxcp_hq_project_statuses()[$status], $status === 'completed' ? 'green' : ''); ?></span>
    </a>
    <?php
}

function dxcp_hq_render_project_links($project) {
    $id = $project->ID;
    $client = dxbs_client(absint(get_post_meta($id, '_dxbs_client_id', true)));
    $owner = absint(get_post_meta($id, '_dxcp_client_id', true));
    $brief = $owner ? dxcp_onboarding_data($owner, $id) : [];
    ?>
    <article class="dxcp-card">
        <?php dxcp_card_heading('', 'Project workspace'); ?>
        <div class="dxcp-actions">
            <a class="dxcp-btn" href="<?php echo esc_url(dxcp_portal_url('overview', $id)); ?>">Open project workspace</a>
            <a class="dxcp-btn" href="<?php echo esc_url(get_edit_post_link($id, 'raw')); ?>">Edit in WordPress</a>
            <a class="dxcp-btn" href="<?php echo esc_url(dxcp_business_url('tasks', ['task_project_id' => $id])); ?>">Project tasks</a>
            <a class="dxcp-btn" href="<?php echo esc_url(dxcp_business_url('documents', ['document_project_id' => $id])); ?>">Project files</a>
            <?php if ($client) : ?><a class="dxcp-btn" href="<?php echo esc_url(dxcp_business_url('clients', ['client_id' => $client['id']])); ?>">Client profile</a><?php endif; ?>
        </div>
        <?php dxcp_hq_render_associations(['project' => $id], [$project]); ?>
        <?php if (!empty($brief['updated'])) : ?>
            <details class="dxcp-disclosure"><summary>Client onboarding</summary><dl>
                <?php foreach (['business_name' => 'Project name', 'project_goals' => 'Goals', 'audience' => 'Preferences', 'content_ready' => 'Content readiness', 'preferred_contact' => 'Preferred contact'] as $key => $label) : ?>
                    <?php if (!empty($brief[$key])) : ?><dt><?php echo esc_html($label); ?></dt><dd><?php echo nl2br(esc_html($brief[$key])); ?></dd><?php endif; ?>
                <?php endforeach; ?>
            </dl></details>
        <?php endif; ?>
    </article>
    <?php
}

function dxcp_hq_tasks() {
    if (!dxbs_is_manager()) return;
    $task_id = absint(dxcp_business_query('task_id', '0'));
    $pid = absint(dxcp_business_query('task_project_id', '0'));
    $task = $task_id ? dxcp_collaboration_record($task_id) : null;
    if ($task_id && (!$task || $task->post_type !== 'dxcp_task')) {
        dxcp_empty('Task unavailable', 'Choose a task from the register.', 'tasks');
        return;
    }
    if ($task || isset($_GET['new_task'])) {
        dxcp_hq_render_task_form($task, $pid);
        if ($task) {
            $task_project = absint(get_post_meta($task->ID, '_dxcp_project_id', true));
            dxcp_render_conversation($task, $task_project, true);
        }
        return;
    }
    $status = sanitize_key(dxcp_business_query('task_status'));
    $search = sanitize_text_field(dxcp_business_query('q'));
    $projects = dxcp_admin_project_options();
    ?>
    <article class="dxcp-card">
        <?php dxcp_card_heading('', 'Task register', dxcp_business_url('tasks', ['new_task' => 1, 'task_project_id' => $pid]), 'Create task'); ?>
        <form method="get" class="dxcp-form" action="<?php echo esc_url(home_url('/dashboard/')); ?>">
            <input type="hidden" name="section" value="business"><input type="hidden" name="business_view" value="tasks">
            <div class="dxbs-toolbar">
                <?php dxcp_field('Search tasks', 'q', $search, 'search');
                dxcp_hq_select('Project', 'task_project_id', ['' => 'All projects'] + $projects, $pid);
                dxcp_hq_select('Status', 'task_status', ['' => 'All statuses'] + dxcp_task_statuses(), $status); ?>
                <button type="submit" class="dxcp-btn dxcp-btn--small">Filter</button>
            </div>
        </form>
        <?php
        $visible = 0;
        foreach (dxcp_tasks($pid) as $item) :
            $state = get_post_meta($item->ID, '_dxcp_task_status', true) ?: 'todo';
            if (($status && $status !== $state) || ($search && mb_stripos($item->post_title, $search) === false)) continue;
            ++$visible;
            $due = get_post_meta($item->ID, '_dxcp_due_date', true);
            $project_name = $projects[absint(get_post_meta($item->ID, '_dxcp_project_id', true))] ?? 'Unassigned';
            $priority = get_post_meta($item->ID, '_dxhq_priority', true) ?: 'normal';
            ?>
            <a class="dxcp-list-row" href="<?php echo esc_url(dxcp_business_url('tasks', ['task_id' => $item->ID])); ?>">
                <span><strong><?php echo esc_html($item->post_title); ?></strong><small><?php echo esc_html($project_name . ($due ? ' · Due ' . $due : '') . ' · ' . (dxcp_hq_task_priorities()[$priority] ?? 'Normal')); ?></small></span>
                <span><?php if (get_post_meta($item->ID, '_dxcp_internal_only', true)) dxcp_badge('Internal'); dxcp_badge(dxcp_task_status_label($state)); ?></span>
            </a>
        <?php endforeach;
        if (!$visible) : ?><p class="dxcp-muted">No matching tasks.</p><?php endif; ?>
    </article>
    <?php
}

function dxcp_hq_render_task_form($task, $pid) {
    $id = $task ? $task->ID : 0;
    $pid = $task ? absint(get_post_meta($id, '_dxcp_project_id', true)) : $pid;
    $internal = $task && get_post_meta($id, '_dxcp_internal_only', true);
    $projects = $task && $pid ? [$pid => get_the_title($pid)] : dxcp_admin_project_options();
    ?>
    <article class="dxcp-card">
        <?php dxcp_card_heading('', $task ? 'Task details' : 'Create a task'); dxcp_business_form('dxcp_hq_save_task'); ?>
        <input type="hidden" name="task[id]" value="<?php echo absint($id); ?>">
        <div class="dxcp-form-grid">
            <?php
            dxcp_field('Task name', 'task[title]', $task->post_title ?? '', 'text', true);
            dxcp_hq_select('Project', 'task[project_id]', $projects, $pid, true);
            dxcp_hq_select('Status', 'task[status]', dxcp_task_statuses(), get_post_meta($id, '_dxcp_task_status', true) ?: 'todo');
            dxcp_hq_select('Priority', 'task[priority]', dxcp_hq_task_priorities(), get_post_meta($id, '_dxhq_priority', true) ?: 'normal');
            dxcp_hq_select('Visibility', 'task[visibility]', $internal ? ['internal' => 'Internal only'] : ['internal' => 'Internal only', 'client' => 'Share with client'], $task && !$internal ? 'client' : 'internal');
            dxcp_hq_select('Type', 'task[kind]', ['task' => 'Task', 'approval' => 'Approval request'], get_post_meta($id, '_dxhq_task_kind', true) ?: 'task');
            dxcp_field('Due date', 'task[due_date]', get_post_meta($id, '_dxcp_due_date', true), 'date');
            ?>
        </div>
        <label class="dxcp-field"><span>Instructions</span><textarea name="task[description]" rows="4" maxlength="10000"><?php echo esc_textarea($task->post_content ?? ''); ?></textarea></label>
        <?php if (!$task) : ?><label class="dxcp-checkbox"><input type="checkbox" name="task[notify]" value="1"><span>Queue a notification if this task is shared with the client</span></label><?php endif; ?>
        <button class="dxcp-btn dxcp-btn--dark" type="submit">Save task</button>
        </form>
    </article>
    <?php
}

function dxcp_hq_render_associations($scope, $projects) {
    $client_id = absint($scope['client'] ?? 0);
    $project_id = absint($scope['project'] ?? 0);
    $client = $client_id ? dxbs_client($client_id) : null;
    $project_ids = array_map(static fn($item) => (int) $item->ID, $projects);
    $tickets = array_filter(dxcp_tickets($project_id), static function ($ticket) use ($client, $project_ids, $project_id) {
        return $project_id || in_array(absint(get_post_meta($ticket->ID, '_dxcp_project_id', true)), $project_ids, true) || (!empty($client['wp_user_id']) && dxcp_ticket_client_id($ticket) === $client['wp_user_id']);
    });
    ?>
    <details class="dxcp-disclosure"><summary>Support tickets (<?php echo count($tickets); ?>)</summary>
        <?php foreach ($tickets as $ticket) : ?>
            <a class="dxcp-list-row" href="<?php echo esc_url(dxcp_business_url('support', ['ticket_id' => $ticket->ID])); ?>"><strong><?php echo esc_html($ticket->post_title); ?></strong><?php dxcp_badge(dxcp_ticket_status_label(get_post_meta($ticket->ID, 'ticket_status', true))); ?></a>
        <?php endforeach; ?>
    </details>
    <details class="dxcp-disclosure"><summary>Project files</summary>
        <?php
        $found = false;
        foreach ($projects as $project) :
            foreach (dxcp_documents($project->ID) as $document) :
                $found = true;
                ?>
                <a class="dxcp-list-row" href="<?php echo esc_url(dxcp_document_url($document->ID)); ?>"><strong><?php echo esc_html($document->post_title); ?></strong><small><?php echo esc_html($project->post_title); ?></small></a>
            <?php endforeach;
        endforeach;
        if (!$found) : ?><p class="dxcp-muted">No project files yet.</p><?php endif; ?>
    </details>
    <?php
    if ($project_id) {
        global $wpdb;
        foreach (['quote' => 'quotations', 'invoice' => 'invoices'] as $type => $view) {
            $table = dxbs_table(dxbs_type_table($type));
            $ids = $wpdb->get_col($wpdb->prepare("SELECT id FROM $table WHERE project_id = %d ORDER BY id DESC LIMIT 25", $project_id));
            $records = array_filter(array_map(static fn($id) => dxbs_document($type, $id), $ids));
            ?>
            <details class="dxcp-disclosure"><summary><?php echo esc_html(ucfirst($view)); ?> (<?php echo count($records); ?>)</summary>
                <?php foreach ($records as $record) : ?>
                    <a class="dxcp-list-row" href="<?php echo esc_url(dxcp_business_url($view, ['document_id' => $record['id']])); ?>"><strong><?php echo esc_html($record['number'] ?: $record['title']); ?></strong><small><?php echo esc_html(dxcp_money($record['total_minor'])); ?></small></a>
                <?php endforeach; ?>
            </details>
            <?php
        }
    }
}

function dxcp_hq_activity_url($row) {
    $id = absint($row['entity_id']);
    if (!$id) return '';
    switch ($row['entity_type']) {
        case 'client': return dxcp_business_url('clients', ['client_id' => $id]);
        case 'project': return dxcp_hq_project_url($id);
        case 'task': return dxcp_business_url('tasks', ['task_id' => $id]);
        case 'ticket': return dxcp_business_url('support', ['ticket_id' => $id]);
        case 'document': return dxcp_document_url($id);
        case 'quote': return dxcp_business_url('quotations', ['document_id' => $id]);
        case 'invoice': return dxcp_business_url('invoices', ['document_id' => $id]);
        case 'receipt': return dxcp_business_url('receipts', ['document_id' => $id]);
        case 'credit': return dxcp_business_url('invoices', ['document_type' => 'credit', 'document_id' => $id]);
        default: return '';
    }
}

function dxcp_hq_render_activity($type, $id) {
    global $wpdb;
    if (!dxbs_is_manager() || !in_array($type, ['client', 'project'], true)) return;
    $audit = dxbs_table('audit');
    $scope = $type === 'client' ? 'client_id' : 'project_id';
    $conditions = [$wpdb->prepare('(a.entity_type = %s AND a.entity_id = %d)', $type, $id)];
    foreach (['quote' => 'quotes', 'invoice' => 'invoices', 'payment' => 'payments', 'receipt' => 'receipts'] as $entity => $table) {
        $table = dxbs_table($table);
        if ($scope === 'project_id' && in_array($entity, ['payment', 'receipt'], true)) {
            $invoices = dxbs_table('invoices');
            $conditions[] = $wpdb->prepare("(a.entity_type = %s AND EXISTS (SELECT 1 FROM $table t INNER JOIN $invoices i ON i.id = t.invoice_id WHERE t.id = a.entity_id AND i.project_id = %d))", $entity, $id);
        } else {
            $conditions[] = $wpdb->prepare("(a.entity_type = %s AND EXISTS (SELECT 1 FROM $table t WHERE t.id = a.entity_id AND t.$scope = %d))", $entity, $id);
        }
    }
    $projects = $type === 'client' ? dxcp_hq_projects_for_client(dxbs_client($id)) : [get_post($id)];
    $project_ids = array_map(static fn($post) => (int) $post->ID, array_filter($projects));
    if ($project_ids) {
        $ids = implode(',', $project_ids);
        $conditions[] = "(a.entity_type = 'project' AND a.entity_id IN ($ids))";
        $conditions[] = "(a.entity_type IN ('task','ticket','document') AND EXISTS (SELECT 1 FROM {$wpdb->postmeta} m WHERE m.post_id = a.entity_id AND m.meta_key = '_dxcp_project_id' AND CAST(m.meta_value AS UNSIGNED) IN ($ids)))";
    }
    $rows = $wpdb->get_results("SELECT a.* FROM $audit a WHERE " . implode(' OR ', $conditions) . ' ORDER BY a.id DESC LIMIT 30', ARRAY_A);
    ?>
    <article class="dxcp-card">
        <?php dxcp_card_heading('', 'Activity history'); ?>
        <?php if (!$rows) : ?><p class="dxcp-muted">Recorded changes will appear here.</p><?php endif; ?>
        <?php foreach ($rows as $row) : $actor = get_userdata((int) $row['actor_id']); $href = dxcp_hq_activity_url($row); ?>
            <div class="dxcp-list-row"><span><strong><?php if ($href) : ?><a class="dxcp-text-link" href="<?php echo esc_url($href); ?>"><?php endif; ?><?php echo esc_html(ucwords(str_replace('_', ' ', $row['event']))); ?><?php if ($href) : ?></a><?php endif; ?></strong><small><?php echo esc_html(($actor ? $actor->display_name : 'System or guest') . ' · ' . ucfirst($row['entity_type']) . ' #' . $row['entity_id']); ?></small></span><time><?php echo esc_html(get_date_from_gmt($row['created_at'], 'j M Y · H:i')); ?></time></div>
        <?php endforeach; ?>
    </article>
    <?php
}

function dxcp_hq_render_documents() {
    if (!dxbs_is_manager()) return;
    $types = ['general' => 'General document', 'onboarding' => 'Brief or onboarding', 'agreement' => 'Agreement', 'deliverable' => 'Deliverable'];
    $project_id = absint(dxcp_business_query('document_project_id', '0'));
    $type = sanitize_key(dxcp_business_query('file_type'));
    $search = sanitize_text_field(dxcp_business_query('file_search'));
    $query = [
        'post_type' => 'dxcp_document',
        'post_status' => ['private', 'publish'],
        'posts_per_page' => 50,
        'paged' => max(1, absint(dxcp_business_query('file_page', '1'))),
        'orderby' => 'date',
        's' => $search,
        'meta_query' => [[
            'relation' => 'OR',
            ['key' => '_dxcp_parent_id', 'compare' => 'NOT EXISTS'],
            ['key' => '_dxcp_parent_id', 'value' => 0, 'type' => 'NUMERIC'],
        ]],
    ];
    if ($project_id) $query['meta_query'][] = ['key' => '_dxcp_project_id', 'value' => $project_id];
    if (isset($types[$type])) $query['meta_query'][] = ['key' => '_dxcp_document_type', 'value' => $type];
    $files = new WP_Query($query);
    $projects = dxcp_admin_project_options();
    ?>
    <article class="dxcp-card">
        <?php dxcp_card_heading('', 'Project documents', dxcp_business_url('documents', ['new_file' => 1, 'document_project_id' => $project_id]), 'Upload document'); ?>
        <form method="get" class="dxcp-form" action="<?php echo esc_url(home_url('/dashboard/')); ?>">
            <input type="hidden" name="section" value="business"><input type="hidden" name="business_view" value="documents">
            <div class="dxbs-toolbar">
                <?php dxcp_field('Search files', 'file_search', $search, 'search');
                dxcp_hq_select('Project', 'document_project_id', ['' => 'All projects'] + $projects, $project_id);
                dxcp_hq_select('Document type', 'file_type', ['' => 'All document types'] + $types, $type); ?>
                <button type="submit" class="dxcp-btn dxcp-btn--small">Filter</button>
            </div>
        </form>
        <?php if (!$files->posts) : ?><p class="dxcp-muted">No documents match these filters.</p><?php endif; ?>
        <?php foreach ($files->posts as $document) :
            $id = $document->ID;
            $pid = absint(get_post_meta($id, '_dxcp_project_id', true));
            $label = $types[get_post_meta($id, '_dxcp_document_type', true)] ?? $types['general'];
            $url = dxcp_document_url($id);
            ?>
            <div class="dxcp-list-row">
                <span><strong><?php echo esc_html($document->post_title); ?></strong><small><?php echo esc_html($label . ' · ' . ($projects[$pid] ?? 'Unassigned')); ?></small></span>
                <span><?php dxcp_badge(get_post_meta($id, '_dxcp_internal_only', true) ? 'Internal' : 'Shared'); ?>
                    <?php if ($url) : ?><a class="dxcp-text-link" href="<?php echo esc_url($url); ?>">Open file <?php echo dxcp_icon('arrow'); ?></a><?php endif; ?>
                </span>
            </div>
        <?php endforeach; ?>
        <?php if ($files->max_num_pages > 1) :
            $args = ['document_project_id' => $project_id, 'file_type' => $type, 'file_search' => $search];
            $page = $query['paged']; ?>
            <div class="dxcp-actions">
                <?php if ($page > 1) : ?><a class="dxcp-btn dxcp-btn--small" href="<?php echo esc_url(dxcp_business_url('documents', $args + ['file_page' => $page - 1])); ?>">Previous page</a><?php endif; ?>
                <?php if ($page < $files->max_num_pages) : ?><a class="dxcp-btn dxcp-btn--small" href="<?php echo esc_url(dxcp_business_url('documents', $args + ['file_page' => $page + 1])); ?>">Next page</a><?php endif; ?>
            </div>
        <?php endif; ?>
    </article>
    <?php if (isset($_GET['new_file'])) : ?>
        <article class="dxcp-card">
            <?php dxcp_card_heading('', 'Upload a private document'); dxcp_form_start('dxcp_hq_upload_document', $project_id, '', true); ?>
            <div class="dxcp-form-grid">
                <?php dxcp_field('Document name', 'file_name', '', 'text', true);
                dxcp_hq_select('Project', 'file_project', $projects, $project_id, true);
                dxcp_hq_select('Document type', 'file_type', $types, 'general');
                dxcp_hq_select('Visibility', 'file_visibility', ['internal' => 'Internal only', 'client' => 'Share with the project client'], 'internal'); ?>
            </div>
            <label class="dxcp-field"><span>Private file</span><input type="file" name="private_file" required><small><?php echo esc_html(dxcp_upload_hint()); ?></small></label>
            <label class="dxcp-checkbox"><input type="checkbox" name="notify" value="1"><span>Queue a notification if this file is shared with the client</span></label>
            <button type="submit" class="dxcp-btn dxcp-btn--dark">Upload file</button>
            </form>
        </article>
    <?php endif;
    dxcp_business_document_archive();
}

add_action('admin_post_dxcp_hq_upload_document', static function () {
    if (!dxbs_is_manager()) wp_die('Permission denied.', '', ['response' => 403]);
    check_admin_referer('dxcp_hq_upload_document');
    $pid = absint($_POST['file_project'] ?? 0);
    $title = sanitize_text_field(wp_unslash($_POST['file_name'] ?? ''));
    $type = sanitize_key($_POST['file_type'] ?? '');
    $internal = ($_POST['file_visibility'] ?? '') !== 'client';
    $project = dxcp_project_for_user($pid);
    if (!$project || !$title || mb_strlen($title) > 191 || !in_array($type, ['general', 'onboarding', 'agreement', 'deliverable'], true)
        || (!$internal && !get_post_meta($pid, '_dxcp_client_id', true))) {
        $result = dxbs_error('file_fields', 'Choose a project and document name. Shared files require a linked client account.');
    } else {
        $result = wp_insert_post(wp_slash([
            'post_type' => 'dxcp_document',
            'post_status' => 'private',
            'post_title' => $title,
            'meta_input' => ['_dxcp_project_id' => $pid, '_dxcp_document_type' => $type, '_dxcp_internal_only' => $internal ? 1 : 0],
        ]), true);
        if (!is_wp_error($result)) {
            $file = dxcp_private_upload('private_file', $result);
            if (is_wp_error($file)) {
                wp_delete_post($result, true);
                $result = $file;
            } else {
                dxbs_audit($internal ? 'document_uploaded' : 'document_shared', 'document', $result);
                if (!$internal && !empty($_POST['notify'])) dxcp_hq_notify_project($pid, 'project_document', $result, $title);
            }
        }
    }
    $error = is_wp_error($result);
    set_transient('dxbs_notice_' . get_current_user_id(), ['type' => $error ? 'error' : 'success', 'message' => $error ? $result->get_error_message() : 'Document uploaded.'], 5 * MINUTE_IN_SECONDS);
    wp_safe_redirect(dxcp_business_url('documents', ['document_project_id' => $pid] + ($error ? ['new_file' => 1] : [])));
    exit;
});
