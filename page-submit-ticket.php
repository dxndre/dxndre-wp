<?php
/** Template Name: Submit Ticket */
wp_safe_redirect(add_query_arg(['section'=>'support','new_ticket'=>1],home_url('/dashboard/'))); exit;
