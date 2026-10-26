<?php
/** Template Name: Client Ticket */
if (!is_user_logged_in()) { wp_safe_redirect(add_query_arg('redirect_to',home_url($_SERVER['REQUEST_URI']??'/dashboard/'),home_url('/login/'))); exit; }
$id=absint(get_query_var('ticket_id') ?: ($_GET['ticket_id']??0));
if (!$id || get_post_type($id)!=='ticket' || !dxcp_can_access($id)) wp_die('This conversation is not available.','Access denied',['response'=>403]);
wp_safe_redirect(dxcp_record_url($id)); exit;
