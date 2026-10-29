<?php
/** Private client and business workspace document shell. */
defined( 'ABSPATH' ) || exit;
$dxcp_theme_cookie = isset( $_COOKIE['dxcp_theme'] ) && is_string( $_COOKIE['dxcp_theme'] ) ? wp_unslash( $_COOKIE['dxcp_theme'] ) : '';
$dxcp_theme = in_array( $dxcp_theme_cookie, array( 'light', 'dark' ), true ) ? $dxcp_theme_cookie : '';
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?><?php if ( $dxcp_theme ) : ?> data-dxcp-theme="<?php echo esc_attr( $dxcp_theme ); ?>"<?php endif; ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="color-scheme" content="light dark">
	<?php wp_head(); ?>
</head>
<body <?php body_class( 'dxcp-page' ); ?>>
	<?php wp_body_open(); ?>
	<a class="dxcp-skip" href="#main">Skip to workspace</a>
	<div id="wrapper">
		<main id="main">
