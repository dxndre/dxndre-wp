<?php
/** Cross-module search and operational reports for the Business HQ owner. */
defined('ABSPATH') || exit;

function dxcp_hq_search_form() {
    if (!dxbs_is_manager()) return;
    ?>
    <form class="dxcp-form" method="get" action="<?php echo esc_url(home_url('/dashboard/')); ?>" role="search" aria-label="Business records">
        <input type="hidden" name="section" value="business">
        <input type="hidden" name="business_view" value="search">
        <div class="dxbs-toolbar">
            <?php dxcp_field('Search Business HQ', 'business_search', dxcp_business_query('business_search'), 'search', true); ?>
            <button class="dxcp-btn dxcp-btn--small" type="submit">Search</button>
        </div>
    </form>
    <?php
}

function dxcp_hq_search() {
    if (!dxbs_is_manager()) return;
    $term = mb_substr(trim(sanitize_text_field(dxcp_business_query('business_search'))), 0, 100);
    if (!$term) return;
    $groups = [];
    foreach (dxbs_clients(['search' => $term, 'status' => 'all', 'limit' => 8]) as $client) {
        $groups['Clients'][] = [$client['name'], $client['company'], dxcp_business_url('clients', ['client_id' => $client['id']])];
    }
    foreach (['quote' => 'Quotations', 'invoice' => 'Invoices', 'receipt' => 'Receipts'] as $type => $label) {
        foreach (dxbs_financial_documents($type, ['search' => $term, 'limit' => 8]) as $doc) {
            $groups[$label][] = [$doc['number'] ?: ($doc['title'] ?? 'Draft #' . $doc['id']), $doc['client_name'], dxcp_business_url(strtolower($label), ['document_id' => $doc['id']])];
        }
    }
    foreach (dxbs_payment_records(['search' => $term, 'limit' => 8]) as $payment) {
        $groups['Payments'][] = [$payment['invoice_number'] ?: 'Payment #' . $payment['id'], $payment['client_name'], dxcp_business_url('payments', ['invoice_id' => $payment['invoice_id']])];
    }
    foreach (get_posts([
        'post_type' => ['dxcp_project', 'dxcp_document', 'ticket'],
        'post_status' => ['private', 'publish', 'draft', 'pending'],
        'numberposts' => 40,
        's' => $term,
    ]) as $post) {
        switch ($post->post_type) {
            case 'dxcp_project':
                $label = 'Projects';
                $url = dxcp_hq_project_url($post->ID);
                break;
            case 'dxcp_document':
                $label = 'Documents';
                $url = dxcp_document_url($post->ID);
                break;
            default:
                $label = 'Support tickets';
                $url = dxcp_business_url('support', ['ticket_id' => $post->ID]);
        }
        if ($url && count($groups[$label] ?? []) < 8) {
            $groups[$label][] = [$post->post_title, '', $url];
        }
    }
    ?>
    <article class="dxcp-card">
        <?php dxcp_card_heading('', sprintf('Results for “%s”', $term)); ?>
        <?php if (!$groups) : ?><p class="dxcp-muted">No matching records. Try a name, title or reference.</p><?php endif; ?>
        <?php foreach ($groups as $label => $rows) : ?>
            <h3><?php echo esc_html($label); ?></h3>
            <?php foreach ($rows as [$title, $detail, $url]) : ?>
                <a class="dxcp-list-row" href="<?php echo esc_url($url); ?>"><span><strong><?php echo esc_html($title); ?></strong><?php if ($detail) : ?><small><?php echo esc_html($detail); ?></small><?php endif; ?></span><?php echo dxcp_icon('arrow'); ?></a>
            <?php endforeach; ?>
        <?php endforeach; ?>
    </article>
    <?php
}

function dxcp_hq_operational_reports($report, $filters) {
    if (!dxbs_is_manager()) return;
    $projects = empty($filters['client_id']) ? get_posts([
        'post_type' => 'dxcp_project',
        'post_status' => ['private', 'publish', 'draft', 'pending', 'future'],
        'numberposts' => -1,
    ]) : dxcp_hq_projects_for_client(dxbs_client($filters['client_id']));
    $project_counts = array_fill_keys(array_keys(dxcp_hq_project_statuses()), 0);
    $project_ids = [];
    foreach ($projects as $project) {
        if (get_post_meta($project->ID, '_dxcp_demo', true)) continue;
        $category = absint(get_post_meta($project->ID, '_dxbs_category_id', true));
        if (!$category) {
            $category = dxbs_category_for_service(get_post_meta($project->ID, '_dxcp_service', true) ?: 'digital')['id'] ?? 0;
        }
        if (!empty($filters['category_id']) && $category !== $filters['category_id']) continue;
        $project_ids[$project->ID] = true;
        ++$project_counts[dxcp_hq_project_status($project)];
    }
    $tickets = ['open' => 0, 'closed' => 0];
    foreach (dxcp_tickets() as $ticket) {
        $date = substr($ticket->post_date, 0, 10);
        if ((!empty($filters['from']) && $date < $filters['from']) || (!empty($filters['to']) && $date > $filters['to'])) continue;
        $pid = absint(get_post_meta($ticket->ID, '_dxcp_project_id', true));
        if (($pid || !empty($filters['client_id']) || !empty($filters['category_id'])) && !isset($project_ids[$pid])) continue;
        ++$tickets[dxcp_ticket_is_closed(get_post_meta($ticket->ID, 'ticket_status', true)) ? 'closed' : 'open'];
    }
    ?>
    <article class="dxcp-card">
        <?php dxcp_card_heading('', 'Business activity'); ?>
        <p><?php echo esc_html(sprintf('%d accepted quotations converted to invoices · %s%% conversion rate', (int) ($report['quotes_converted'] ?? 0), number_format_i18n($report['conversion_rate'] ?? 0, 1))); ?></p>
        <div class="dxcp-overview-grid">
            <div><h3>Verified revenue by client</h3>
                <?php if (empty($report['clients'])) : ?><p class="dxcp-muted">No verified payments for these filters.</p><?php endif; ?>
                <?php foreach ($report['clients'] ?? [] as $row) : ?>
                    <a class="dxcp-list-row" href="<?php echo esc_url(dxcp_business_url('clients', ['client_id' => $row['client_id']])); ?>"><span><?php echo esc_html($row['name']); ?></span><strong><?php echo esc_html(dxcp_money($row['received_minor'])); ?></strong></a>
                <?php endforeach; ?>
            </div>
            <div><h3>Project status</h3>
                <?php foreach (dxcp_hq_project_statuses() as $status => $label) : ?>
                    <a class="dxcp-list-row" href="<?php echo esc_url(dxcp_business_url('projects', ['project_status' => $status])); ?>"><span><?php echo esc_html($label); ?></span><strong><?php echo (int) $project_counts[$status]; ?></strong></a>
                <?php endforeach; ?>
                <h3>Tickets opened in this period</h3>
                <p><?php echo esc_html(sprintf('%d open · %d closed', $tickets['open'], $tickets['closed'])); ?></p>
            </div>
        </div>
    </article>
    <?php
}
