<?php
/** Welcome and owner-only administration within the existing client workspace. */
defined('ABSPATH') || exit;

/** Summary only records in the caller's already-authorised project selection. */
function dxcp_workspace_summary($projects) {
	$allowed = array_values(array_filter($projects, static fn($project) => $project instanceof WP_Post && dxcp_can_access($project)));
	$ids = array_map(static fn($project) => (int)$project->ID, $allowed);
	$out = ['projects'=>$allowed,'active_projects'=>0,'client_ids'=>[],'tasks'=>[],'open_tickets'=>[],'documents'=>0,'sessions'=>[],'pending_quotes'=>0,'due_payments'=>0,'pending_deferrals'=>0,'action_count'=>0];
	$today = wp_date('Y-m-d', null, new DateTimeZone('Europe/London'));
	$legacy_pending = []; $legacy_due = []; $authoritative_projects = [];
	foreach ($allowed as $project) {
		$pid = (int)$project->ID;
		if (get_post_meta($pid, '_dxcp_phase', true) !== 'post_launch') ++$out['active_projects'];
		$client = absint(get_post_meta($pid, '_dxcp_client_id', true));
		if ($client) $out['client_ids'][] = $client;
		foreach (dxcp_tasks($pid) as $task) if (get_post_meta($task->ID, '_dxcp_task_status', true) !== 'done') $out['tasks'][] = $task;
		$out['documents'] += count(dxcp_documents($pid));
		foreach (dxcp_calendar_sessions($pid) as $session) if ((get_post_meta($session->ID,'_dxcp_status',true) ?: 'scheduled') === 'scheduled' && dxcp_calendar_session_time($session,'end') >= time()) $out['sessions'][] = $session;
		foreach (dxcp_project_quotes($pid) as $quote) if ((!empty($quote['can_accept'])) || (dxcp_is_site_owner() && ($quote['status'] ?? '') === 'final_ready')) $legacy_pending[$quote['ref']] = true;
		$billing = dxcp_billing_data($pid);
		foreach (($billing['payments'] ?? []) as $payment) if ($payment['status'] === 'pending' && $payment['due_date'] && $payment['due_date'] <= $today) $legacy_due[$pid] = ($legacy_due[$pid] ?? 0) + 1;
		foreach (($billing['deferrals'] ?? []) as $deferral) if ($deferral['status'] === 'pending') ++$out['pending_deferrals'];
	}
	// Authoritative Business records augment Welcome without duplicating legacy schedules.
	$out['reported_transfers'] = 0;
	if (function_exists('dxbs_financial_documents')) {
		foreach (dxbs_financial_documents('quote', ['limit'=>200]) as $quote) {
			$record_project = (int)($quote['project_id'] ?? 0);
			if ($record_project && !in_array($record_project, $ids, true)) continue;
			if (!empty($quote['issued_at']) && !empty($quote['legacy_reference'])) unset($legacy_pending[$quote['legacy_reference']]);
			if (($quote['status'] ?? '') === 'sent' && empty($quote['accepted_at']) && ($quote['expires_at'] ?? '') >= dxbs_now()) ++$out['pending_quotes'];
		}
		foreach (dxbs_financial_documents('invoice', ['limit'=>200]) as $invoice) {
			$record_project = (int)($invoice['project_id'] ?? 0);
			if ($record_project && !in_array($record_project, $ids, true)) continue;
			if (!empty($invoice['issued_at'])) $authoritative_projects[$record_project] = true;
			if (!empty($invoice['issued_at']) && empty($invoice['voided_at']) && (int)($invoice['balance_minor'] ?? 0) > 0 && !empty($invoice['due_date']) && $invoice['due_date'] <= $today) ++$out['due_payments'];
		}
		if (dxcp_is_site_owner() && function_exists('dxbs_payment_records')) $out['reported_transfers'] = count(dxbs_payment_records(['status'=>'reported','limit'=>200]));
	}
	$out['pending_quotes'] += count($legacy_pending);
	foreach ($legacy_due as $project_id=>$count) if (empty($authoritative_projects[$project_id])) $out['due_payments'] += $count;
	foreach (dxcp_tickets() as $ticket) {
		$pid = absint(get_post_meta($ticket->ID, '_dxcp_project_id', true));
		if (($pid && !in_array($pid, $ids, true)) || in_array(get_post_meta($ticket->ID, 'ticket_status', true), ['resolved','cancelled'], true)) continue;
		$out['open_tickets'][] = $ticket;
	}
	$out['client_ids'] = array_values(array_unique($out['client_ids']));
	$out['action_count'] = dxcp_is_site_owner()
		? count(array_filter($out['tasks'], static fn($task) => get_post_meta($task->ID, '_dxcp_task_status', true) === 'waiting')) + count($out['open_tickets']) + $out['pending_deferrals'] + $out['reported_transfers']
		: count($out['tasks']) + $out['pending_quotes'] + $out['due_payments'];
	return $out;
}

function dxcp_render_welcome($c) {
	extract($c);
	$summary = dxcp_workspace_summary($projects);
	$owner = dxcp_is_site_owner();
	$tz = new DateTimeZone('Europe/London');
	$destination = $owner ? 'admin' : 'overview';
	?>
	<div class="dxcp-welcome-hero">
		<div class="dxcp-welcome-hero__copy">
			<p class="dxcp-eyebrow"><?php echo $owner ? 'DXNDRE BUSINESS · YOUR COMMAND CENTRE' : 'WELCOME TO YOUR CLIENT SPACE'; ?></p>
			<h1><span data-dxcp-greeting data-dxcp-name="<?php echo esc_attr($first_name); ?>"><?php echo esc_html(dxcp_time_greeting().', '.$first_name.'.'); ?></span></h1>
			<p><?php echo $owner ? 'Your clients, projects and business, together in one considered space.' : 'A clear place to see what’s happening, share the details and take your next step.'; ?></p>
			<?php dxcp_render_next_session($projects); ?>
			<div class="dxcp-welcome-actions">
				<a class="dxcp-btn dxcp-btn--dark" href="<?php echo esc_url(dxcp_portal_url($destination,$pid)); ?>"><?php echo $owner ? 'Open Admin overview' : 'Open your project'; ?> <?php echo dxcp_icon('arrow'); ?></a>
				<a class="dxcp-btn" href="<?php echo esc_url(dxcp_portal_url($owner?'business':'tasks',$pid)); ?>"><?php echo $owner ? 'Manage your business' : 'See your next steps'; ?></a>
			</div>
			<div class="dxcp-welcome-clock"><span>London · <time data-dxcp-today datetime="<?php echo esc_attr(wp_date('Y-m-d', null, $tz)); ?>"><?php echo esc_html(wp_date('l, j F', null, $tz)); ?></time></span><time data-dxcp-clock data-timezone="Europe/London"><?php echo esc_html(wp_date('H:i:s', null, $tz)); ?></time></div>
		</div>
		<div class="dxcp-welcome-hero__art" aria-hidden="true">
			<svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">
				<path d="M40 344H480M40 294H480M40 244H480M40 194H480M40 144H480M90 94V344M140 94V344M190 94V344M240 94V344M290 94V344M340 94V344M390 94V344M440 94V344" stroke="currentColor" opacity=".08"/>
				<circle cx="267" cy="218" r="148" stroke="currentColor" opacity=".12" stroke-dasharray="4 10"/>
				<path d="M126 276 222 180 310 244 408 118" stroke="#C9A44D" stroke-width="2"/>
				<path d="m394 118 14-1-1 15" stroke="#C9A44D" stroke-width="2"/>
				<path d="M110 290V168H228V290zM292 272V146H410V272z" fill="var(--dxcp-card, #fff)" stroke="currentColor" stroke-opacity=".3"/>
				<path d="M110 202H228M292 180H410M130 224H192M130 240H207M130 256H177M312 202H375M312 218H389M312 234H361" stroke="currentColor" stroke-opacity=".35"/>
				<path d="M138 184h28M320 162h28" stroke="#C9A44D" stroke-width="3"/>
				<path d="M190 322V224H330V322z" fill="var(--dxcp-card, #fff)" stroke="currentColor" stroke-opacity=".45"/>
				<path d="M213 248H285M213 264H307M213 280H269M213 298H295" stroke="currentColor" stroke-opacity=".35"/>
				<circle cx="260" cy="112" r="28" fill="#C9A44D"/><path d="m248 113 8 8 16-18" stroke="#171A16" stroke-width="2.5"/>
				<path d="M66 130h22M77 119v22M440 318h22M451 307v22" stroke="#C9A44D" stroke-width="2"/>
				<circle cx="106" cy="324" r="5" stroke="currentColor" opacity=".4"/><circle cx="416" cy="88" r="5" stroke="currentColor" opacity=".4"/>
			</svg>
		</div>
	</div>
	<div class="dxcp-stats">
		<a class="dxcp-stat" href="<?php echo esc_url(dxcp_portal_url($destination,$pid)); ?>"><span class="dxcp-stat__icon dxcp-stat__icon--gold"><?php echo dxcp_icon('journey'); ?></span><span>Active projects<strong><?php echo (int)$summary['active_projects']; ?></strong><small><?php echo $owner ? 'Across your client workspaces' : 'Across your assigned workspaces'; ?></small></span><?php echo dxcp_icon('arrow'); ?></a>
		<a class="dxcp-stat" href="<?php echo esc_url(dxcp_portal_url($owner?'admin':'tasks',$pid)); ?>"><span class="dxcp-stat__icon dxcp-stat__icon--blue"><?php echo dxcp_icon('tasks'); ?></span><span><?php echo $owner ? 'Ready for your attention' : 'Your next actions'; ?><strong><?php echo (int)$summary['action_count']; ?></strong><small><?php echo $owner ? 'Reviews, requests & transfer reports' : 'To-dos, quotation reviews & due dates'; ?></small></span><?php echo dxcp_icon('arrow'); ?></a>
		<a class="dxcp-stat" href="<?php echo esc_url(dxcp_portal_url($owner?'business':'drive',$pid)); ?>"><span class="dxcp-stat__icon dxcp-stat__icon--green"><?php echo dxcp_icon($owner?'profile':'drive'); ?></span><span><?php echo $owner ? 'Clients with projects' : 'Shared documents'; ?><strong><?php echo $owner ? count($summary['client_ids']) : (int)$summary['documents']; ?></strong><small><?php echo $owner ? 'Open your business directory' : 'In your private project Drive'; ?></small></span><?php echo dxcp_icon('arrow'); ?></a>
	</div>
	<article class="dxcp-card"><?php dxcp_card_heading('AT A GLANCE', $owner?'Your current client work':'Your projects',dxcp_portal_url($owner?'admin':'overview',$pid),$owner?'See all projects':'Project overview'); ?>
		<?php if (!$projects) : dxcp_empty('Your next chapter is taking shape','When a project is assigned, its updates and next steps will be waiting here.'); else : ?>
			<div class="dxcp-admin-projects"><?php foreach (array_slice($projects,0,6) as $item) : $phase=get_post_meta($item->ID,'_dxcp_phase',true); $client=get_userdata(absint(get_post_meta($item->ID,'_dxcp_client_id',true))); ?>
				<a class="dxcp-list-row" href="<?php echo esc_url(dxcp_portal_url('overview',$item->ID)); ?>"><span><strong><?php echo esc_html($item->post_title); ?></strong><small><?php echo esc_html($owner && $client ? $client->display_name.' · ' : ''); echo esc_html(dxcp_phases()[$phase][0]??'Getting started'); ?></small></span><?php if(get_post_meta($item->ID,'_dxcp_demo',true))dxcp_badge('Test workspace'); echo dxcp_icon('arrow'); ?></a>
			<?php endforeach; ?></div>
		<?php endif; ?>
	</article>
	<?php
}

/** Administrator directory summary. Other accounts never enter this data path. */
function dxcp_admin_data($filters=[]) {
	if (!dxcp_is_site_owner()) return null;
	$all=get_posts(['post_type'=>'dxcp_project','post_status'=>['publish','private','draft','pending','future'],'numberposts'=>-1,'orderby'=>'modified','order'=>'DESC']);
	$clients=[];$services=[];
	foreach($all as$item){$client=get_userdata(absint(get_post_meta($item->ID,'_dxcp_client_id',true)));if($client)$clients[$client->ID]=$client;$service=get_post_meta($item->ID,'_dxcp_service',true)?:'digital';$services[$service]=$service;}
	$client_id=is_scalar($filters['client_id']??null)?absint($filters['client_id']):0;
	$service=is_string($filters['service']??null)?sanitize_key($filters['service']):'';
	$phase=is_string($filters['phase']??null)?sanitize_key($filters['phase']):'';
	$query=is_string($filters['q']??null)?mb_substr(sanitize_text_field(wp_unslash($filters['q'])),0,100):'';
	$filtered=array_values(array_filter($all,static function($project)use($client_id,$service,$phase,$query){$uid=absint(get_post_meta($project->ID,'_dxcp_client_id',true));$client=$uid?get_userdata($uid):null;if($client_id&&$uid!==$client_id)return false;if($service&&get_post_meta($project->ID,'_dxcp_service',true)!==$service)return false;if($phase&&get_post_meta($project->ID,'_dxcp_phase',true)!==$phase)return false;if($query&&mb_stripos($project->post_title.' '.($client?$client->display_name.' '.$client->user_email:''),$query)===false)return false;return true;}));
	return ['projects'=>$filtered,'all_projects'=>$all,'clients'=>$clients,'services'=>$services,'client_id'=>$client_id,'service'=>$service,'phase'=>$phase,'q'=>$query,'summary'=>dxcp_workspace_summary($all)];
}

function dxcp_render_admin($c) {
	if (!dxcp_is_site_owner()) { dxcp_empty('This section is private','Return to your assigned client workspace.'); return; }
	$data=dxcp_admin_data($_GET);$summary=$data['summary'];$labels=['digital'=>'Digital','support'=>'Ongoing digital support','fitness'=>'Fitness','photography'=>'Photography'];
	?>
	<div class="dxcp-view-heading"><p class="dxcp-eyebrow">DXNDRE · ADMINISTRATION</p><h1><span data-dxcp-greeting data-dxcp-name="<?php echo esc_attr($c['first_name']); ?>"><?php echo esc_html(dxcp_time_greeting().', '.$c['first_name'].'.'); ?></span></h1><p>Your client work, priorities and project spaces in one view.</p></div>
	<div class="dxcp-stats"><article class="dxcp-stat"><span>Client accounts<strong><?php echo count($data['clients']); ?></strong><small>With an assigned project</small></span></article><article class="dxcp-stat"><span>Project workspaces<strong><?php echo count($data['all_projects']); ?></strong><small>All services and stages</small></span></article><article class="dxcp-stat"><span>Open support requests<strong><?php echo count($summary['open_tickets']); ?></strong><small>Tickets and conversations</small></span></article></div>
	<article class="dxcp-card">
		<?php dxcp_card_heading('MANAGE YOUR WORK', 'Client and project overview'); ?>
		<form class="dxcp-admin-filters dxcp-form" method="get" action="<?php echo esc_url(home_url('/dashboard/')); ?>"><input type="hidden" name="section" value="admin">
			<label class="dxcp-field"><span>Search projects or clients</span><input type="search" name="q" value="<?php echo esc_attr($data['q']); ?>" placeholder="Project, name or email"></label>
			<label class="dxcp-field"><span>Client</span><select name="client_id"><option value="">All clients</option><?php foreach($data['clients']as$id=>$client):?><option value="<?php echo (int)$id; ?>" <?php selected($data['client_id'],$id); ?>><?php echo esc_html($client->display_name); ?></option><?php endforeach; ?></select></label>
			<label class="dxcp-field"><span>Service</span><select name="service"><option value="">All services</option><?php foreach($data['services']as$key):?><option value="<?php echo esc_attr($key); ?>" <?php selected($data['service'],$key); ?>><?php echo esc_html($labels[$key]??ucwords(str_replace('_',' ',$key))); ?></option><?php endforeach; ?></select></label>
			<label class="dxcp-field"><span>Stage</span><select name="phase"><option value="">All stages</option><?php foreach(dxcp_phases()as$key=>$phase):?><option value="<?php echo esc_attr($key); ?>" <?php selected($data['phase'],$key); ?>><?php echo esc_html($phase[0]); ?></option><?php endforeach; ?></select></label>
			<div class="dxcp-welcome-actions"><button class="dxcp-btn dxcp-btn--dark" type="submit">Filter projects</button><a class="dxcp-text-link" href="<?php echo esc_url(dxcp_portal_url('admin')); ?>">Reset</a></div>
		</form>
		<p class="dxcp-muted"><?php echo count($data['projects']); ?> of <?php echo count($data['all_projects']); ?> workspaces shown. Test workspaces remain clearly labelled.</p>
		<?php if(!$data['projects']):dxcp_empty('No matching projects','Try another client, service or search.');else:?>
		<div class="dxcp-table-wrap dxcp-admin-projects"><table class="dxcp-table"><thead><tr><th>Project / client</th><th>Service</th><th>Stage</th><th>Next steps</th><th>Manage</th></tr></thead><tbody>
		<?php foreach($data['projects']as$item):$client=get_userdata(absint(get_post_meta($item->ID,'_dxcp_client_id',true)));$service=get_post_meta($item->ID,'_dxcp_service',true);$phase=get_post_meta($item->ID,'_dxcp_phase',true);$tasks=dxcp_tasks($item->ID);$pending=count(array_filter($tasks,static fn($task)=>get_post_meta($task->ID,'_dxcp_task_status',true)!=='done'));?>
		<tr><td><strong><?php echo esc_html($item->post_title); ?></strong><small><?php echo esc_html($client?$client->display_name:'Client not assigned'); ?></small><?php if(get_post_meta($item->ID,'_dxcp_demo',true))dxcp_badge('Test workspace'); ?></td><td><?php echo esc_html($labels[$service]??ucwords(str_replace('_',' ',$service))); ?></td><td><?php echo esc_html(dxcp_phases()[$phase][0]??'Getting started'); ?></td><td><?php echo (int)$pending; ?> open to-dos</td><td><a class="dxcp-text-link" href="<?php echo esc_url(dxcp_portal_url('overview',$item->ID)); ?>">Open workspace <?php echo dxcp_icon('arrow'); ?></a><small><a href="<?php echo esc_url(get_edit_post_link($item->ID,'raw')); ?>">Edit project in CMS</a></small></td></tr>
		<?php endforeach; ?></tbody></table></div><?php endif; ?>
	</article>
	<div class="dxcp-help-grid"><article class="dxcp-card"><?php dxcp_card_heading('YOUR BUSINESS','Financial management'); ?><p>Create and review quotations, invoices, payments and documents in your business workspace.</p><a class="dxcp-btn dxcp-btn--dark" href="<?php echo esc_url(dxcp_portal_url('business')); ?>">Open Business manager <?php echo dxcp_icon('arrow'); ?></a></article><article class="dxcp-card"><?php dxcp_card_heading('READY FOR REVIEW','Keep work moving'); ?><p><?php echo (int)count(array_filter($summary['tasks'],static fn($task)=>get_post_meta($task->ID,'_dxcp_task_status',true)==='waiting')); ?> tasks waiting, <?php echo (int)$summary['pending_deferrals']; ?> deferral requests, <?php echo (int)$summary['reported_transfers']; ?> transfer reports awaiting bank review, and <?php echo (int)count($summary['sessions']); ?> upcoming coaching sessions.</p><a class="dxcp-btn" href="<?php echo esc_url(admin_url('edit.php?post_type=dxcp_task')); ?>">Manage client to-dos</a></article></div>
	<?php
}
