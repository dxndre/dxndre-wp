<?php
/** Template Name: Client workspace */
if (!defined('ABSPATH')) exit;
if (!is_user_logged_in()) { wp_safe_redirect(add_query_arg('redirect_to',home_url('/dashboard/'),home_url('/login/'))); exit; }
if (!dxcp_is_client_user()) { wp_die('Your account does not have a client workspace yet. Please contact D’André if you’re expecting access.','Client workspace',['response'=>403]); }
nocache_headers();
header('Cache-Control: private, no-store, max-age=0');
header('X-Robots-Tag: noindex, nofollow');
$uid=get_current_user_id(); $user=wp_get_current_user(); $projects=dxcp_projects();
$requested=absint($_GET['project_id']??($_GET['project']??0));
$project=$requested?dxcp_project_for_user($requested):($projects[0]??null);
if ($requested && !$project) wp_die('This project is not available to your account.','Access denied',['response'=>403]);
$pid=$project?$project->ID:0;
$service=$pid?(get_post_meta($pid,'_dxcp_service',true)?:'digital'):'digital';
$service_label=['digital'=>'Digital project','fitness'=>'Fitness coaching','photography'=>'Photography','support'=>'Ongoing support'][$service]??'Client';
$sections=['overview'=>'Overview','journey'=>'Client journey','tasks'=>'Your to-dos','drive'=>'Your Drive','payments'=>'Quotations & payments','sessions'=>'Coaching sessions','support'=>'Support','profile'=>'Your details'];
$section=sanitize_key($_GET['section']??'overview'); if(!isset($sections[$section]) || ($section==='sessions' && $service!=='fitness'))$section='overview';
$tasks=$pid?dxcp_tasks($pid):[]; $tickets=array_values(array_filter(dxcp_tickets(),fn($t)=>!$pid || !absint(get_post_meta($t->ID,'_dxcp_project_id',true)) || absint(get_post_meta($t->ID,'_dxcp_project_id',true))===$pid)); $documents=$pid?dxcp_documents($pid):[]; $sessions=$pid?dxcp_sessions($pid):[]; $quotes=$pid?dxcp_project_quotes($pid):[];
$billing=$pid?dxcp_billing_data($pid):['agreed_total_cents'=>null,'paid_cents'=>0,'balance_cents'=>null,'payments'=>[],'next_due'=>null,'deferrals'=>[],'agreement_url'=>''];
$name=$user->first_name?:$user->display_name; $first_name=explode(' ',trim($name))[0];
$context=compact('uid','user','projects','project','pid','service','service_label','tasks','tickets','documents','sessions','quotes','billing','first_name');
$notice=sanitize_key($_GET['notice']??($_GET['portal_notice']??''));
$notices=['quote_linked'=>'Your estimate is now connected to this project.','claim_invalid'=>'We could not verify that estimate. Check the reference and private key, or ask D’André to connect it.','claim_limited'=>'Please wait a little before trying to connect another estimate.','quote_changed'=>'This quotation has changed or is not ready to accept. Please review the latest version.','quote_confirmed'=>'Your quotation response has been recorded.','deferral_invalid'=>'We could not save that request. Choose an outstanding payment, a future date and a reason of at least 10 characters.','profile_saved'=>'Your details have been updated.','onboarding_saved'=>'Your onboarding details have been saved.','update_saved'=>'Your update has been saved.','comment_added'=>'Your comment has been added.','comment_saved'=>'Your comment has been added.','task_updated'=>'Your task progress has been updated.','task_review_requested'=>'Your task is ready for D’André to review.','ticket_created'=>'Your conversation has been started.','ticket_updated'=>'Your conversation has been updated.','quote_claimed'=>'Your estimate is now connected to this project.','brief_confirmed'=>'Your brief has been sent for review.','quote_accepted'=>'Your final quotation acceptance has been recorded.','deferral_requested'=>'Your payment deferral request has been sent for review.','invalid_request'=>'We couldn’t save that request. Please check the details and try again.','save_failed'=>'Your update could not be saved. Please try again.'];
get_header('client-portal');
?>
<div class="dxcp-shell" data-dxcp-shell>
    <div class="dxcp-sidebar-scrim" data-dxcp-close></div>
    <aside class="dxcp-sidebar" id="dxcp-sidebar" aria-label="Client workspace navigation">
        <a class="dxcp-brand" href="<?php echo esc_url(dxcp_portal_url('overview',$pid)); ?>" aria-label="DXNDRE client space">dx<span>.</span><small>CLIENT SPACE</small></a>
        <p class="dxcp-sidebar__label">YOUR WORKSPACE</p>
        <nav><?php foreach($sections as $key=>$label) : if($key==='sessions' && $service!=='fitness')continue; ?><a class="dxcp-nav-link" href="<?php echo esc_url(dxcp_portal_url($key,$pid)); ?>" data-dxcp-nav="<?php echo esc_attr($key); ?>" <?php echo $section===$key?'aria-current="page"':''; ?>><?php echo dxcp_icon($key); ?><span><?php echo esc_html($label); ?></span><?php if($key==='tasks' && count($tasks)) : ?><small><?php echo count(array_filter($tasks,fn($task)=>get_post_meta($task->ID,'_dxcp_task_status',true)!=='done')); ?></small><?php endif; ?></a><?php endforeach; ?></nav>
        <div class="dxcp-sidebar__bottom"><div class="dxcp-help-card"><span>✦</span><h2>A little help?</h2><p>Pick up where we left off.</p><a href="<?php echo esc_url(dxcp_portal_url('support',$pid,['new_ticket'=>1])); ?>">Start a conversation <?php echo dxcp_icon('arrow'); ?></a></div><a class="dxcp-nav-link" href="<?php echo esc_url(home_url('/')); ?>"><?php echo dxcp_icon('external'); ?> Back to the website</a><a class="dxcp-nav-link" href="<?php echo esc_url(wp_logout_url(home_url('/login/'))); ?>"><?php echo dxcp_icon('logout'); ?> Sign out</a></div>
    </aside>
    <div class="dxcp-workspace"><header class="dxcp-topbar"><div class="dxcp-inline"><button class="dxcp-mobile-toggle" type="button" data-dxcp-menu aria-expanded="false" aria-controls="dxcp-sidebar" aria-label="Open workspace menu"><?php echo dxcp_icon('menu'); ?></button><span class="dxcp-breadcrumb">Your workspace <span>/</span> <strong data-dxcp-breadcrumb><?php echo esc_html($sections[$section]); ?></strong></span></div><div class="dxcp-topbar__account"><span class="dxcp-secure"><?php echo dxcp_icon('check'); ?> Private client space</span><a href="<?php echo esc_url(dxcp_portal_url('profile',$pid)); ?>" class="dxcp-avatar" aria-label="Your account details"><?php echo esc_html(mb_strtoupper(mb_substr($first_name,0,1))); ?></a></div></header>
    <div class="dxcp-project-switch"><span><?php echo dxcp_icon($service==='fitness'?'sessions':'journey'); ?> <?php echo esc_html($service_label); ?></span><?php if($projects) : ?><form method="get" action="<?php echo esc_url(home_url('/dashboard/')); ?>"><input type="hidden" name="section" value="<?php echo esc_attr($section); ?>"><label for="dxcp-project">Project</label><select id="dxcp-project" name="project_id" data-dxcp-project><?php foreach($projects as $item) : ?><option value="<?php echo absint($item->ID); ?>" <?php selected($pid,$item->ID); ?>><?php echo esc_html($item->post_title); ?></option><?php endforeach; ?></select><button class="dxcp-btn dxcp-btn--small dxcp-project-go" type="submit">Open</button></form><?php endif; ?></div>
    <?php if(isset($notices[$notice])) : ?><div class="dxcp-notice" role="status"><?php echo dxcp_icon('check'); echo esc_html($notices[$notice]); ?></div><?php endif; ?>
    <?php if($pid && get_post_meta($pid,'_dxcp_demo',true)) : ?><div class="dxcp-notice dxcp-notice--demo" role="note"><?php echo dxcp_icon('check'); ?>Test workspace · Figures, tasks and sessions here are examples. No payment is due and no session is booked.</div><?php endif; ?>
    <?php if(dxcp_is_admin()) : ?><div class="dxcp-admin-note">Administrator preview · <a href="<?php echo esc_url(admin_url('edit.php?post_type=dxcp_project')); ?>">Manage client projects</a></div><?php endif; ?>
    <div class="dxcp-content-grid"><div class="dxcp-content"><?php foreach($sections as $key=>$label) : ?><section class="dxcp-view" data-dxcp-view="<?php echo esc_attr($key); ?>" aria-label="<?php echo esc_attr($label); ?>" <?php echo $key!==$section?'hidden':''; ?> tabindex="-1"><?php call_user_func('dxcp_render_'.$key,$context); ?></section><?php endforeach; ?></div><?php dxcp_render_activity($context); ?></div>
    <footer class="dxcp-footer"><span>Made with clarity. Built around you.</span><a href="<?php echo esc_url(home_url('/privacy-policy/')); ?>">Privacy policy</a><span>© <?php echo esc_html(wp_date('Y')); ?> DXNDRE</span></footer>
    </div>
</div>
<?php get_footer('client-portal'); ?>
