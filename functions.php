<?php

/**
 * Include Theme Customizer.
 *
 * @since v1.0
 */
$theme_customizer = __DIR__ . '/inc/customizer.php';
if ( is_readable( $theme_customizer ) ) {
	require_once $theme_customizer;
}

if ( ! function_exists( 'dxndre_setup_theme' ) ) {
	/**
	 * General Theme Settings.
	 *
	 * @since v1.0
	 *
	 * @return void
	 */
	function dxndre_setup_theme() {
		// Make theme available for translation: Translations can be filed in the /languages/ directory.
		load_theme_textdomain( 'dxndre', __DIR__ . '/languages' );

		/**
		 * Set the content width based on the theme's design and stylesheet.
		 *
		 * @since v1.0
		 */
		global $content_width;
		if ( ! isset( $content_width ) ) {
			$content_width = 800;
		}

		// Theme Support.
		add_theme_support( 'title-tag' );
		add_theme_support( 'automatic-feed-links' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support(
			'html5',
			array(
				'search-form',
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
				'script',
				'style',
				'navigation-widgets',
			)
		);

		// Add support for Block Styles.
		add_theme_support( 'wp-block-styles' );
		// Add support for full and wide alignment.
		add_theme_support( 'align-wide' );
		// Add support for Editor Styles.
		add_theme_support( 'editor-styles' );
		// Enqueue Editor Styles.
		add_editor_style( 'style-editor.css' );

		// Default attachment display settings.
		update_option( 'image_default_align', 'none' );
		update_option( 'image_default_link_type', 'none' );
		update_option( 'image_default_size', 'large' );

		// Custom CSS styles of WorPress gallery.
		add_filter( 'use_default_gallery_style', '__return_false' );
	}
	add_action( 'after_setup_theme', 'dxndre_setup_theme' );

	/**
	 * Enqueue editor stylesheet (for iframed Post Editor):
	 * https://make.wordpress.org/core/2023/07/18/miscellaneous-editor-changes-in-wordpress-6-3/#post-editor-iframed
	 *
	 * @since v3.5.1
	 *
	 * @return void
	 */
	function dxndre_load_editor_styles() {
		if ( is_admin() ) {
			wp_enqueue_style( 'editor-style', get_theme_file_uri( 'style-editor.css' ) );
		}
	}
	add_action( 'enqueue_block_assets', 'dxndre_load_editor_styles' );

	// Disable Block Directory: https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/filters/editor-filters.md#block-directory
	remove_action( 'enqueue_block_editor_assets', 'wp_enqueue_editor_block_directory_assets' );
	remove_action( 'enqueue_block_editor_assets', 'gutenberg_enqueue_block_editor_assets_block_directory' );
}

if ( ! function_exists( 'wp_body_open' ) ) {
	/**
	 * Fire the wp_body_open action.
	 *
	 * Added for backwards compatibility to support pre 5.2.0 WordPress versions.
	 *
	 * @since v2.2
	 *
	 * @return void
	 */
	function wp_body_open() {
		do_action( 'wp_body_open' );
	}
}

if ( ! function_exists( 'dxndre_add_user_fields' ) ) {
	/**
	 * Add new User fields to Userprofile:
	 * get_user_meta( $user->ID, 'facebook_profile', true );
	 *
	 * @since v1.0
	 *
	 * @param array $fields User fields.
	 *
	 * @return array
	 */
	function dxndre_add_user_fields( $fields ) {
		// Add new fields.
		$fields['facebook_profile'] = 'Facebook URL';
		$fields['twitter_profile']  = 'Twitter URL';
		$fields['linkedin_profile'] = 'LinkedIn URL';
		$fields['xing_profile']     = 'Xing URL';
		$fields['github_profile']   = 'GitHub URL';

		return $fields;
	}
	add_filter( 'user_contactmethods', 'dxndre_add_user_fields' );
}

/**
 * Test if a page is a blog page.
 * if ( is_blog() ) { ... }
 *
 * @since v1.0
 *
 * @global WP_Post $post Global post object.
 *
 * @return bool
 */
function is_blog() {
	global $post;
	$posttype = get_post_type( $post );

	return ( ( is_archive() || is_author() || is_category() || is_home() || is_single() || ( is_tag() && ( 'post' === $posttype ) ) ) ? true : false );
}

/**
 * Disable comments for Media (Image-Post, Jetpack-Carousel, etc.)
 *
 * @since v1.0
 *
 * @param bool $open    Comments open/closed.
 * @param int  $post_id Post ID.
 *
 * @return bool
 */
function dxndre_filter_media_comment_status( $open, $post_id = null ) {
	$media_post = get_post( $post_id );

	if ( 'attachment' === $media_post->post_type ) {
		return false;
	}

	return $open;
}
add_filter( 'comments_open', 'dxndre_filter_media_comment_status', 10, 2 );

/**
 * Style Edit buttons as badges: https://getbootstrap.com/docs/5.0/components/badge
 *
 * @since v1.0
 *
 * @param string $link Post Edit Link.
 *
 * @return string
 */
function dxndre_custom_edit_post_link( $link ) {
	return str_replace( 'class="post-edit-link"', 'class="post-edit-link badge bg-secondary"', $link );
}
add_filter( 'edit_post_link', 'dxndre_custom_edit_post_link' );

/**
 * Style Edit buttons as badges: https://getbootstrap.com/docs/5.0/components/badge
 *
 * @since v1.0
 *
 * @param string $link Comment Edit Link.
 */
function dxndre_custom_edit_comment_link( $link ) {
	return str_replace( 'class="comment-edit-link"', 'class="comment-edit-link badge bg-secondary"', $link );
}
add_filter( 'edit_comment_link', 'dxndre_custom_edit_comment_link' );

/**
 * Responsive oEmbed filter: https://getbootstrap.com/docs/5.0/helpers/ratio
 *
 * @since v1.0
 *
 * @param string $html Inner HTML.
 *
 * @return string
 */
function dxndre_oembed_filter( $html ) {
	return '<div class="ratio ratio-16x9">' . $html . '</div>';
}
add_filter( 'embed_oembed_html', 'dxndre_oembed_filter', 10 );

if ( ! function_exists( 'dxndre_content_nav' ) ) {
	/**
	 * Display a navigation to next/previous pages when applicable.
	 *
	 * @since v1.0
	 *
	 * @param string $nav_id Navigation ID.
	 */
	function dxndre_content_nav( $nav_id ) {
		global $wp_query;

		if ( $wp_query->max_num_pages > 1 ) {
			?>
			<div id="<?php echo esc_attr( $nav_id ); ?>" class="d-flex mb-4 justify-content-between">
				<div><?php next_posts_link( '<span aria-hidden="true">&larr;</span> ' . esc_html__( 'Older posts', 'dxndre' ) ); ?></div>
				<div><?php previous_posts_link( esc_html__( 'Newer posts', 'dxndre' ) . ' <span aria-hidden="true">&rarr;</span>' ); ?></div>
			</div><!-- /.d-flex -->
			<?php
		} else {
			echo '<div class="clearfix"></div>';
		}
	}

	/**
	 * Add Class.
	 *
	 * @since v1.0
	 *
	 * @return string
	 */
	function posts_link_attributes() {
		return 'class="btn btn-secondary btn-lg"';
	}
	add_filter( 'next_posts_link_attributes', 'posts_link_attributes' );
	add_filter( 'previous_posts_link_attributes', 'posts_link_attributes' );
}

/**
 * Init Widget areas in Sidebar.
 *
 * @since v1.0
 *
 * @return void
 */
function dxndre_widgets_init() {
	// Area 1.
	register_sidebar(
		array(
			'name'          => 'Primary Widget Area (Sidebar)',
			'id'            => 'primary_widget_area',
			'before_widget' => '',
			'after_widget'  => '',
			'before_title'  => '<h3 class="widget-title">',
			'after_title'   => '</h3>',
		)
	);

	// Area 2.
	register_sidebar(
		array(
			'name'          => 'Secondary Widget Area (Header Navigation)',
			'id'            => 'secondary_widget_area',
			'before_widget' => '',
			'after_widget'  => '',
			'before_title'  => '<h3 class="widget-title">',
			'after_title'   => '</h3>',
		)
	);

	// Area 3.
	register_sidebar(
		array(
			'name'          => 'Third Widget Area (Footer)',
			'id'            => 'third_widget_area',
			'before_widget' => '',
			'after_widget'  => '',
			'before_title'  => '<h3 class="widget-title">',
			'after_title'   => '</h3>',
		)
	);
}
add_action( 'widgets_init', 'dxndre_widgets_init' );

if ( ! function_exists( 'dxndre_article_posted_on' ) ) {
	/**
	 * "Theme posted on" pattern.
	 *
	 * @since v1.0
	 */
	function dxndre_article_posted_on() {
		printf(
			wp_kses_post( __( '<span class="sep">Posted on </span><a href="%1$s" title="%2$s" rel="bookmark"><time class="entry-date" datetime="%3$s">%4$s</time></a><span class="by-author"> <span class="sep"> by </span> <span class="author-meta vcard"><a class="url fn n" href="%5$s" title="%6$s" rel="author">%7$s</a></span></span>', 'dxndre' ) ),
			esc_url( get_permalink() ),
			esc_attr( get_the_date() . ' - ' . get_the_time() ),
			esc_attr( get_the_date( 'c' ) ),
			esc_html( get_the_date() . ' - ' . get_the_time() ),
			esc_url( get_author_posts_url( (int) get_the_author_meta( 'ID' ) ) ),
			sprintf( esc_attr__( 'View all posts by %s', 'dxndre' ), get_the_author() ),
			get_the_author()
		);
	}
}

/**
 * Template for Password protected post form.
 *
 * @since v1.0
 *
 * @global WP_Post $post Global post object.
 *
 * @return string
 */
function dxndre_password_form() {
	global $post;
	$label = 'pwbox-' . ( empty( $post->ID ) ? wp_rand() : $post->ID );

	$output                  = '<div class="row">';
		$output             .= '<form action="' . esc_url( site_url( 'wp-login.php?action=postpass', 'login_post' ) ) . '" method="post">';
		$output             .= '<h4 class="col-md-12 alert alert-warning">' . esc_html__( 'This content is password protected. To view it please enter your password below.', 'dxndre' ) . '</h4>';
			$output         .= '<div class="col-md-6">';
				$output     .= '<div class="input-group">';
					$output .= '<input type="password" name="post_password" id="' . esc_attr( $label ) . '" placeholder="' . esc_attr__( 'Password', 'dxndre' ) . '" class="form-control" />';
					$output .= '<div class="input-group-append"><input type="submit" name="submit" class="btn btn-primary" value="' . esc_attr__( 'Submit', 'dxndre' ) . '" /></div>';
				$output     .= '</div><!-- /.input-group -->';
			$output         .= '</div><!-- /.col -->';
		$output             .= '</form>';
	$output                 .= '</div><!-- /.row -->';

	return $output;
}
add_filter( 'the_password_form', 'dxndre_password_form' );


if ( ! function_exists( 'dxndre_comment' ) ) {
	/**
	 * Style Reply link.
	 *
	 * @since v1.0
	 *
	 * @param string $link Link output.
	 *
	 * @return string
	 */
	function dxndre_replace_reply_link_class( $link ) {
		return str_replace( "class='comment-reply-link", "class='comment-reply-link btn btn-outline-secondary", $link );
	}
	add_filter( 'comment_reply_link', 'dxndre_replace_reply_link_class' );

	/**
	 * Template for comments and pingbacks:
	 * add function to comments.php ... wp_list_comments( array( 'callback' => 'dxndre_comment' ) );
	 *
	 * @since v1.0
	 *
	 * @param object $comment Comment object.
	 * @param array  $args    Comment args.
	 * @param int    $depth   Comment depth.
	 */
	function dxndre_comment( $comment, $args, $depth ) {
		$GLOBALS['comment'] = $comment;
		switch ( $comment->comment_type ) :
			case 'pingback':
			case 'trackback':
				?>
		<li class="post pingback">
			<p>
				<?php
					esc_html_e( 'Pingback:', 'dxndre' );
					comment_author_link();
					edit_comment_link( esc_html__( 'Edit', 'dxndre' ), '<span class="edit-link">', '</span>' );
				?>
			</p>
				<?php
				break;
			default:
				?>
		<li <?php comment_class(); ?> id="li-comment-<?php comment_ID(); ?>">
			<article id="comment-<?php comment_ID(); ?>" class="comment">
				<footer class="comment-meta">
					<div class="comment-author vcard">
						<?php
							$avatar_size = ( '0' !== $comment->comment_parent ? 68 : 136 );
							echo get_avatar( $comment, $avatar_size );

							/* Translators: 1: Comment author, 2: Date and time */
							printf(
								wp_kses_post( __( '%1$s, %2$s', 'dxndre' ) ),
								sprintf( '<span class="fn">%s</span>', get_comment_author_link() ),
								sprintf(
									'<a href="%1$s"><time datetime="%2$s">%3$s</time></a>',
									esc_url( get_comment_link( $comment->comment_ID ) ),
									get_comment_time( 'c' ),
									/* Translators: 1: Date, 2: Time */
									sprintf( esc_html__( '%1$s ago', 'dxndre' ), human_time_diff( (int) get_comment_time( 'U' ), current_time( 'timestamp' ) ) )
								)
							);

							edit_comment_link( esc_html__( 'Edit', 'dxndre' ), '<span class="edit-link">', '</span>' );
						?>
					</div><!-- .comment-author .vcard -->

					<?php if ( '0' === $comment->comment_approved ) { ?>
						<em class="comment-awaiting-moderation">
							<?php esc_html_e( 'Your comment is awaiting moderation.', 'dxndre' ); ?>
						</em>
						<br />
					<?php } ?>
				</footer>

				<div class="comment-content"><?php comment_text(); ?></div>

				<div class="reply">
					<?php
						comment_reply_link(
							array_merge(
								$args,
								array(
									'reply_text' => esc_html__( 'Reply', 'dxndre' ) . ' <span>&darr;</span>',
									'depth'      => $depth,
									'max_depth'  => $args['max_depth'],
								)
							)
						);
					?>
				</div><!-- /.reply -->
			</article><!-- /#comment-## -->
				<?php
				break;
		endswitch;
	}

	/**
	 * Custom Comment form.
	 *
	 * @since v1.0
	 * @since v1.1: Added 'submit_button' and 'submit_field'
	 * @since v2.0.2: Added '$consent' and 'cookies'
	 *
	 * @param array $args    Form args.
	 * @param int   $post_id Post ID.
	 *
	 * @return array
	 */
	function dxndre_custom_commentform( $args = array(), $post_id = null ) {
		if ( null === $post_id ) {
			$post_id = get_the_ID();
		}

		$commenter     = wp_get_current_commenter();
		$user          = wp_get_current_user();
		$user_identity = $user->exists() ? $user->display_name : '';

		$args = wp_parse_args( $args );

		$req      = get_option( 'require_name_email' );
		$aria_req = ( $req ? " aria-required='true' required" : '' );
		$consent  = ( empty( $commenter['comment_author_email'] ) ? '' : ' checked="checked"' );
		$fields   = array(
			'author'  => '<div class="form-floating mb-3">
							<input type="text" id="author" name="author" class="form-control" value="' . esc_attr( $commenter['comment_author'] ) . '" placeholder="' . esc_html__( 'Name', 'dxndre' ) . ( $req ? '*' : '' ) . '"' . $aria_req . ' />
							<label for="author">' . esc_html__( 'Name', 'dxndre' ) . ( $req ? '*' : '' ) . '</label>
						</div>',
			'email'   => '<div class="form-floating mb-3">
							<input type="email" id="email" name="email" class="form-control" value="' . esc_attr( $commenter['comment_author_email'] ) . '" placeholder="' . esc_html__( 'Email', 'dxndre' ) . ( $req ? '*' : '' ) . '"' . $aria_req . ' />
							<label for="email">' . esc_html__( 'Email', 'dxndre' ) . ( $req ? '*' : '' ) . '</label>
						</div>',
			'url'     => '',
			'cookies' => '<p class="form-check mb-3 comment-form-cookies-consent">
							<input id="wp-comment-cookies-consent" name="wp-comment-cookies-consent" class="form-check-input" type="checkbox" value="yes"' . $consent . ' />
							<label class="form-check-label" for="wp-comment-cookies-consent">' . esc_html__( 'Save my name, email, and website in this browser for the next time I comment.', 'dxndre' ) . '</label>
						</p>',
		);

		$defaults = array(
			'fields'               => apply_filters( 'comment_form_default_fields', $fields ),
			'comment_field'        => '<div class="form-floating mb-3">
											<textarea id="comment" name="comment" class="form-control" aria-required="true" required placeholder="' . esc_attr__( 'Comment', 'dxndre' ) . ( $req ? '*' : '' ) . '"></textarea>
											<label for="comment">' . esc_html__( 'Comment', 'dxndre' ) . '</label>
										</div>',
			/** This filter is documented in wp-includes/link-template.php */
			'must_log_in'          => '<p class="must-log-in">' . sprintf( wp_kses_post( __( 'You must be <a href="%s">logged in</a> to post a comment.', 'dxndre' ) ), wp_login_url( esc_url( get_permalink( get_the_ID() ) ) ) ) . '</p>',
			/** This filter is documented in wp-includes/link-template.php */
			'logged_in_as'         => '<p class="logged-in-as">' . sprintf( wp_kses_post( __( 'Logged in as <a href="%1$s">%2$s</a>. <a href="%3$s" title="Log out of this account">Log out?</a>', 'dxndre' ) ), get_edit_user_link(), $user->display_name, wp_logout_url( apply_filters( 'the_permalink', esc_url( get_permalink( get_the_ID() ) ) ) ) ) . '</p>',
			'comment_notes_before' => '<p class="small comment-notes">' . esc_html__( 'Your Email address will not be published.', 'dxndre' ) . '</p>',
			'comment_notes_after'  => '',
			'id_form'              => 'commentform',
			'id_submit'            => 'submit',
			'class_submit'         => 'btn btn-primary',
			'name_submit'          => 'submit',
			'title_reply'          => '',
			'title_reply_to'       => esc_html__( 'Leave a Reply to %s', 'dxndre' ),
			'cancel_reply_link'    => esc_html__( 'Cancel reply', 'dxndre' ),
			'label_submit'         => esc_html__( 'Post Comment', 'dxndre' ),
			'submit_button'        => '<input type="submit" id="%2$s" name="%1$s" class="%3$s" value="%4$s" />',
			'submit_field'         => '<div class="form-submit">%1$s %2$s</div>',
			'format'               => 'html5',
		);

		return $defaults;
	}
	add_filter( 'comment_form_defaults', 'dxndre_custom_commentform' );
}

if ( function_exists( 'register_nav_menus' ) ) {
	/**
	 * Nav menus.
	 *
	 * @since v1.0
	 *
	 * @return void
	 */
	register_nav_menus(
		array(
			'main-menu'   => 'Main Navigation Menu',
			'footer-menu' => 'Footer Menu',
		)
	);
}

// Custom Nav Walker: wp_bootstrap_navwalker().
$custom_walker = __DIR__ . '/inc/wp-bootstrap-navwalker.php';
if ( is_readable( $custom_walker ) ) {
	require_once $custom_walker;
}

$custom_walker_footer = __DIR__ . '/inc/wp-bootstrap-navwalker-footer.php';
if ( is_readable( $custom_walker_footer ) ) {
	require_once $custom_walker_footer;
}

/**
 * Loading All CSS Stylesheets and Javascript Files.
 *
 * @since v1.0
 *
 * @return void
 */
function dxndre_scripts_loader() {
	$theme_version = wp_get_theme()->get( 'Version' );

	// 1. Styles.
	wp_enqueue_style( 'style', get_theme_file_uri( 'style.css' ), array(), $theme_version, 'all' );
	wp_enqueue_style( 'main', get_theme_file_uri( 'build/main.css' ), array(), $theme_version, 'all' ); // main.scss: Compiled Framework source + custom styles.

	if ( is_rtl() ) {
		wp_enqueue_style( 'rtl', get_theme_file_uri( 'build/rtl.css' ), array(), $theme_version, 'all' );
	}

	// 2. Scripts.
	wp_enqueue_script( 'mainjs', get_theme_file_uri( 'build/main.js' ), array(), $theme_version, true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'dxndre_scripts_loader' );

/**
 * Enqueue Google Fonts.
 *
 * @since v1.0
 */
function dxndre_enqueue_google_fonts() {

	$google_fonts_url = 'https://fonts.googleapis.com/css2'
		. '?family=Space+Grotesk:wght@300;400;500;600;700'
		. '&family=Outfit:wght@300;400;500;600;700'
		. '&family=Handlee'
		. '&display=swap';

	wp_enqueue_style(
		'dxndre-google-fonts',
		$google_fonts_url,
		array(),
		null
	);
}
add_action( 'wp_enqueue_scripts', 'dxndre_enqueue_google_fonts' );

// Registering Footer Navigation Menus

register_nav_menus([
  'footer_work'      => __('Footer – Work', 'dxndre'),
  'footer_services'  => __('Footer – Services', 'dxndre'),
  'footer_personal'  => __('Footer – Personal', 'dxndre'),
  'footer_contact'   => __('Footer – Get In Touch', 'dxndre'),
]);

/**
 * Add page slug as a body class.
 *
 * @since v1.0
 *
 * @param array $classes Body classes.
 *
 * @return array
 */
function dxndre_add_page_slug_to_body_class( $classes ) {
	if ( is_page() ) {
		$page_slug = get_post_field( 'post_name', get_the_ID() );
		$classes[] = 'page-' . $page_slug;
	}

	return $classes;
}
add_filter( 'body_class', 'dxndre_add_page_slug_to_body_class' );

// Build process

$asset = include get_theme_file_path('build/index.asset.php');

wp_enqueue_script(
    'dxndre-theme',
    get_theme_file_uri('build/index.js'),
    $asset['dependencies'],
    $asset['version'],
    true
);

wp_enqueue_style(
    'dxndre-theme',
    get_theme_file_uri('build/index.css'),
    [],
    $asset['version']
);

// Frontend body class

add_filter('body_class', function ($classes) {
	if (!is_admin()) {
		$classes[] = 'is-frontend';
	}
	return $classes;
});


// Client User Type

add_action('init', function () {
    if (!get_role('client')) {
        add_role(
            'client',
            'Client',
            [
                'read' => true,
                'edit_posts' => true,
                'delete_posts' => false,
                'upload_files' => false,
            ]
        );
    }
});

// Prevent Clients from accessing wp-admin

add_action('admin_init', function () {

    // Always allow admin-post.php
    if (
        isset($_SERVER['SCRIPT_NAME']) &&
        str_contains($_SERVER['SCRIPT_NAME'], 'admin-post.php')
    ) {
        return;
    }

    if (
        is_user_logged_in() &&
        current_user_can('client') &&
        !wp_doing_ajax()
    ) {
        wp_safe_redirect(home_url('/dashboard'));
        exit;
    }
});

// Clients to use custom login screen 

add_action('template_redirect', function () {
    if (
        is_page('login') &&
        $_SERVER['REQUEST_METHOD'] === 'POST'
    ) {
        if (
            !isset($_POST['dx_login_nonce']) ||
            !wp_verify_nonce($_POST['dx_login_nonce'], 'dx_login')
        ) {
            wp_die('Security check failed');
        }

        $creds = [
            'user_login'    => sanitize_text_field($_POST['username']),
            'user_password' => $_POST['password'],
            'remember'      => true
        ];

        $user = wp_signon($creds, false);

        if (is_wp_error($user)) {
            wp_redirect(add_query_arg('login', 'failed', wp_get_referer()));
            exit;
        }

        wp_redirect(home_url('/dashboard'));
        exit;
    }
});

// Signup logic

add_action('template_redirect', function () {
    if (
        is_page('signup') &&
        $_SERVER['REQUEST_METHOD'] === 'POST'
    ) {
        if (
            !isset($_POST['dx_signup_nonce']) ||
            !wp_verify_nonce($_POST['dx_signup_nonce'], 'dx_signup')
        ) {
            wp_die('Security check failed');
        }

        $email = sanitize_email($_POST['email']);
        $password = $_POST['password'];

        if (email_exists($email)) {
            wp_die('Email already registered');
        }

        $user_id = wp_create_user($email, $password, $email);

        if (is_wp_error($user_id)) {
            wp_die('Could not create user');
        }

        wp_update_user([
            'ID' => $user_id,
            'display_name' => sanitize_text_field($_POST['name']),
            'role' => 'client'
        ]);

        wp_set_current_user($user_id);
        wp_set_auth_cookie($user_id);

        wp_redirect(home_url('/dashboard'));
        exit;
    }
});

// Forgot Password Logic

add_action('template_redirect', function () {
    if (
        is_page('forgot-password') &&
        $_SERVER['REQUEST_METHOD'] === 'POST'
    ) {
        if (
            !isset($_POST['dx_forgot_nonce']) ||
            !wp_verify_nonce($_POST['dx_forgot_nonce'], 'dx_forgot')
        ) {
            wp_die('Security check failed');
        }

        $user = get_user_by('email', sanitize_email($_POST['email']));

        if (!$user) {
            wp_die('No user found');
        }

        retrieve_password($user->user_login);

        wp_redirect(home_url('/login?reset=sent'));
        exit;
    }
});

// Handling Signups and saving ACF data to user profile

add_action('template_redirect', function () {

	if (!isset($_POST['dx_register_nonce'])) {
		return;
	}

	if (!wp_verify_nonce($_POST['dx_register_nonce'], 'dx_register')) {
		return;
	}

	$username   = sanitize_user($_POST['username']);
	$email      = sanitize_email($_POST['email']);
	$password   = $_POST['password'];
	$password_2 = $_POST['password_repeat'];

	$company    = sanitize_text_field($_POST['company'] ?? '');
	$projectref = sanitize_text_field($_POST['projectref'] ?? '');

	// Terms must be accepted
	if (empty($_POST['terms'])) {
		wp_die('You must accept the Terms of Service.');
	}

	// Password match
	if ($password !== $password_2) {
		wp_die('Passwords do not match.');
	}

	// Existing user checks
	if (username_exists($username) || email_exists($email)) {
		wp_die('User already exists.');
	}

	$user_id = wp_create_user($username, $password, $email);

	if (is_wp_error($user_id)) {
		wp_die($user_id->get_error_message());
	}

	// Assign role
	wp_update_user([
		'ID'   => $user_id,
		'role' => 'subscriber' // or "client" if you create a custom role
	]);

	// ✅ Save ACF fields
	if (function_exists('update_field')) {
		update_field('company', $company, 'user_' . $user_id);
		update_field('client_reference', $projectref, 'user_' . $user_id);
	}

	// Redirect on success
	wp_redirect(add_query_arg('register', 'success', wp_get_referer()));
	exit;
});

// Including Client Portal Files

require_once get_template_directory() . '/inc/portal/redirects.php';

error_log('ABOUT TO LOAD TICKETS FILE');
require_once get_template_directory() . '/inc/portal/tickets.php';
error_log('TICKETS FILE REQUIRED');

// Client Portal Submission Handler

error_log('DX HANDLER LOADED');

add_action('admin_post_dx_submit_ticket', 'dx_handle_ticket_submission');
add_action('admin_post_nopriv_dx_submit_ticket', 'dx_handle_ticket_submission');

function dx_handle_ticket_submission() {

	if (!isset($_POST['dx_ticket_nonce']) ||
		!wp_verify_nonce($_POST['dx_ticket_nonce'], 'dx_submit_ticket')) {
		wp_die('Invalid request');
	}

	if (!is_user_logged_in()) {
		wp_die('Not allowed');
	}

	if (empty($_POST['ticket_confirm'])) {
		wp_die('You must confirm ticket details');
	}

	$user_id = get_current_user_id();

	$ticket_id = wp_insert_post([
		'post_type'    => 'ticket',
		'post_title'   => sanitize_text_field($_POST['ticket_title']),
		'post_content' => sanitize_textarea_field($_POST['ticket_message']),
		'post_status'  => 'publish',
		'post_author'  => $user_id,
	]);

	if (is_wp_error($ticket_id)) {
		wp_die('Ticket creation failed');
	}

	// Save extra fields
	update_post_meta($ticket_id, 'project_name',
		sanitize_text_field($_POST['project_name'] ?? '')
	);

	update_post_meta($ticket_id, 'project_url',
		esc_url_raw($_POST['project_url'] ?? '')
	);

	update_post_meta($ticket_id, 'ticket_status', 'open');

	// Handle image uploads

	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/media.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';

	for ($i = 1; $i <= 10; $i++) {

		$key = 'ticket_image_' . $i;

		if (
			empty($_FILES[$key]['name']) ||
			$_FILES[$key]['error'] !== UPLOAD_ERR_OK
		) {
			continue;
		}

		$attachment_id = media_handle_upload($key, $ticket_id);

		if (!is_wp_error($attachment_id)) {
			if (function_exists('update_field')) {
				update_field($key, $attachment_id, $ticket_id);
			} else {
				update_post_meta($ticket_id, $key, $attachment_id);
			}
		}
	}

	if (
		!empty($_FILES['ticket_file']['name']) &&
		$_FILES['ticket_file']['error'] === UPLOAD_ERR_OK
	) {
		$file_id = media_handle_upload('ticket_file', $ticket_id);

		if (!is_wp_error($file_id)) {
			if (function_exists('update_field')) {
				update_field('ticket_file', $file_id, $ticket_id);
			} else {
				update_post_meta($ticket_id, 'ticket_file', $file_id);
			}
		}
	}

	// Redirect to ticket view
	wp_safe_redirect(
		home_url('/dashboard/ticket/' . $ticket_id)
	);
	exit;
}

// Client Ticket update logging

add_action('admin_post_dx_update_ticket', 'dx_handle_ticket_update');

function dx_handle_ticket_update() {

	if (
		!isset($_POST['dx_update_ticket_nonce']) ||
		!wp_verify_nonce($_POST['dx_update_ticket_nonce'], 'dx_update_ticket')
	) {
		wp_die('Invalid request');
	}

	if (!is_user_logged_in()) {
		wp_die('Not logged in');
	}

	$ticket_id = intval($_POST['ticket_id']);
	$message   = sanitize_textarea_field($_POST['update_message']);
	$user_id   = get_current_user_id();

	if (!$ticket_id || !$message) {
		wp_die('Invalid update');
	}

	// Store updates as comments (best approach)
	wp_insert_comment([
		'comment_post_ID' => $ticket_id,
		'comment_content' => $message,
		'user_id'         => $user_id,
		'comment_approved'=> 1,
	]);

	update_post_meta($ticket_id, 'ticket_last_updated', current_time('mysql'));

	// Email notifications
	$client = get_user_by('id', get_post_field('post_author', $ticket_id));

	wp_mail(
		get_option('admin_email'),
		'Ticket Updated #' . $ticket_id,
		$message
	);

	if ($client) {
		wp_mail(
			$client->user_email,
			'Your ticket has been updated',
			$message
		);
	}

	wp_safe_redirect(home_url('/dashboard/ticket/' . $ticket_id));
	exit;
}

// Rewrite rule after ticket submission - client gets redirected to see the ticket they've created

// Ticket single view routing
add_action('init', function () {
	add_rewrite_rule(
		'^dashboard/ticket/([0-9]+)/?$',
		'index.php?pagename=dashboard/ticket&ticket_id=$matches[1]',
		'top'
	);
});

// Allow ticket_id as query var
add_filter('query_vars', function ($vars) {
	$vars[] = 'ticket_id';
	return $vars;
});

// AJAX Handler for the tab switching for the Client Ticket Portal

add_action('wp_ajax_dx_load_ticket_panel', 'dx_load_ticket_panel');

function dx_load_ticket_panel() {

	if (!is_user_logged_in()) {
		wp_send_json_error('Not authorised');
	}

	check_ajax_referer('dx_dashboard', 'nonce');

	$ticket_id = isset($_POST['ticket_id']) ? (int) $_POST['ticket_id'] : 0;

	if (!$ticket_id) {
		wp_send_json_error('Invalid ticket');
	}

	$ticket = get_post($ticket_id);

	if (
		!$ticket ||
		$ticket->post_type !== 'ticket' ||
		(int) $ticket->post_author !== get_current_user_id()
	) {
		wp_send_json_error('Unauthorized');
	}

	// 🔑 Make $ticket available to the partial
	ob_start();
	require get_template_directory() . '/portal/dashboard-ticket-panel.php';
	$html = ob_get_clean();

	wp_send_json_success([
		'html' => $html
	]);
}

// Client Ticket Cancellation

add_action('admin_post_dx_cancel_ticket', function () {
	if (!isset($_POST['dx_cancel_ticket_nonce']) ||
		!wp_verify_nonce($_POST['dx_cancel_ticket_nonce'], 'dx_cancel_ticket')) {
		wp_die('Security check failed');
	}

	$ticket_id = (int) $_POST['ticket_id'];
	$ticket = get_post($ticket_id);

	if (
		!$ticket ||
		(int) $ticket->post_author !== (int) get_current_user_id()
	) {
		wp_die('Unauthorized');
	}

	update_post_meta($ticket_id, 'ticket_status', 'cancelled');

	wp_safe_redirect(home_url('/dashboard'));
	exit;
});

// Expose AjaxURL to frontend 

add_action('wp_enqueue_scripts', function () {

	wp_localize_script('mainjs', 'DX_DASHBOARD', [
		'ajax_url' => admin_url('admin-ajax.php'),
		'nonce'    => wp_create_nonce('dx_dashboard'),
	]);
});

// Login/Logout Menu Item

add_filter('wp_nav_menu_items', 'dxndre_client_login_logout_menu', 10, 2);
function dxndre_client_login_logout_menu($items, $args) {

	// Only affect your main menu
	if ($args->theme_location !== 'main-menu') {
		return $items;
	}

	if (is_user_logged_in()) {
		$user = wp_get_current_user();

		// Logout URL (redirect back to homepage or dashboard)
		$logout_url = wp_logout_url(home_url('/'));

		$items .= '
			<li class="menu-item menu-item-client">
				<a href="' . esc_url($logout_url) . '">
					Log out
				</a>
			</li>';
	} else {
		$items .= '
			<li class="menu-item menu-item-client">
				<a href="' . esc_url(home_url('/login')) . '">
					Client Login
				</a>
			</li>';
	}

	return $items;
}

// Enqueue Lenis Script (for scooth scrolling)

function dx_enqueue_scripts() {

	// Force module type
	add_filter('script_loader_tag', function ($tag, $handle) {
		if ($handle === 'dx-main') {
			return str_replace('<script ', '<script type="module" ', $tag);
		}
		return $tag;
	}, 10, 2);
}
add_action('wp_enqueue_scripts', 'dx_enqueue_scripts');

// Services Tabs Block shortcode

add_shortcode('services_tabs', function () {

  $services = get_posts([
    'post_type'      => 'service',
    'posts_per_page' => -1,
    'orderby'        => 'menu_order',
    'order'          => 'ASC',
  ]);

  if (!$services) return '';

  ob_start();
  ?>
  <section class="services-tabs d-none d-lg-block">
    <div class="row">
      <div class="col-lg-4">
        <ul class="nav nav-pills flex-column services-nav">
          <?php foreach ($services as $i => $service): ?>
            <button
              class="nav-link <?= $i === 0 ? 'active' : '' ?>"
              data-bs-toggle="pill"
              data-bs-target="#service-<?= $service->ID ?>"
            >
              <?= esc_html(
                get_field('service_title_override', $service->ID)
                ?: $service->post_title
              ); ?>
				<span class="label"></span>
				<span class="tab-progress"></span>
            </button>
          <?php endforeach; ?>
        </ul>
      </div>

      <div class="col-lg-8 tab-content">
        <?php foreach ($services as $i => $service): ?>
          <div class="tab-pane fade <?= $i === 0 ? 'show active' : '' ?>"id="service-<?= $service->ID ?>"style=" --service-bg: url('<?= esc_url(get_the_post_thumbnail_url($service, 'full')); ?>');">
			<?php if (has_post_thumbnail($service)): ?>
				<?= get_the_post_thumbnail($service, 'large', ['class' => 'service-image foreground']); ?>
			<?php endif; ?>
            <h3><?= esc_html($service->post_title); ?></h3>
            <p><?= esc_html(get_field('short_description', $service->ID)); ?></p>
            <a href="<?= get_permalink($service); ?>" class="btn btn-outline-light">
              View Service
            </a>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <div class="services-mobile d-lg-none">
		<div class="accordion" id="servicesAccordion">

		<?php foreach ($services as $i => $service): ?>
			<div class="accordion-item">

				<h2 class="accordion-header">
				<button class="accordion-button <?= $i !== 0 ? 'collapsed' : '' ?>" data-bs-toggle="collapse" data-bs-target="#service-collapse-<?= $service->ID ?>">
					<?= esc_html(
					get_field('service_title_override', $service->ID)
					?: $service->post_title
					); ?>
				</button>
				</h2>

				<div id="service-collapse-<?= $service->ID ?>" class="accordion-collapse collapse <?= $i === 0 ? 'show' : '' ?>" >
					<div class="accordion-body">

						<?php if (has_post_thumbnail($service)): ?>
						<?= get_the_post_thumbnail($service, 'large', ['class' => 'service-image']); ?>
						<?php endif; ?>

						<div class="text-container">
							<p><?= esc_html(get_field('short_description', $service->ID)); ?></p>

							<a href="<?= get_permalink($service); ?>" class="btn btn-outline-light cta">
							View service
							</a>
						</div>
					</div>
				</div>

			</div>
		<?php endforeach; ?>

		</div>
	</div>
  <?php

  return ob_get_clean();
});

// Getting Project Meta for the listings

function dx_project_meta_shortcode() {
  if ( ! is_singular() && ! in_the_loop() ) {
    return '';
  }

  $project_type   = get_field('project_type');
  $employer       = get_field('employer');
  $client_company = get_field('client_company');
  $year           = get_the_date('Y');

  if ( ! $project_type ) {
    return '';
  }

  // Prefer employer, fallback to client company
  $organisation = $employer ?: $client_company;

  ob_start();
  ?>
  <div class="project-meta">
    <span class="meta-type">
      <?php echo esc_html( strtoupper( $project_type ) ); ?>
    </span>

    <?php if ( $organisation ) : ?>
      <span class="meta-separator">–</span>
      <span class="meta-org">
        <?php echo esc_html( strtoupper( $organisation ) ); ?>
      </span>
    <?php endif; ?>

    <?php if ( $year ) : ?>
      <span class="meta-separator">•</span>
      <span class="meta-year">
        <?php echo esc_html( $year ); ?>
      </span>
    <?php endif; ?>
  </div>
  <?php
  return ob_get_clean();
}
add_shortcode( 'project_meta', 'dx_project_meta_shortcode' );

// Projects Marquee (For Homepage)
add_shortcode('projects_marquee', function () {

  $projects = get_posts([
    'post_type'      => 'project',
    'posts_per_page' => -1,
    'post_status'    => 'publish',
    'orderby'        => 'date',
    'order'          => 'DESC',
  ]);

  if (empty($projects)) {
    return '';
  }

  ob_start(); ?>

  <section class="projects-marquee">
    <div id="projects-track" class="marquee-track">

      <?php foreach ($projects as $project): ?>

        <?php
          // --- PROJECT TYPE (ACF SAFE HANDLING)
          $type_field = get_field('project_type', $project->ID);

          if (is_array($type_field)) {
            $project_type = $type_field['label'] ?? $type_field['value'] ?? '';
          } else {
            $project_type = $type_field;
          }

          $project_type = strtoupper($project_type ?: 'FREELANCE');

          // --- YEAR (fallback-safe)
          $year = get_the_date('Y', $project->ID);
        ?>

        <article class="project-card">
          <a href="<?= esc_url(get_permalink($project)); ?>" class="project-link">

            <figure class="project-media">
              <?= get_the_post_thumbnail(
                $project->ID,
                'large',
                ['loading' => 'lazy']
              ); ?>
            </figure>

            <div class="project-body">
				<div class="project-body-inner">
					<span class="project-meta headline">
					<?= esc_html($project_type); ?> • <?= esc_html($year); ?>
					</span>

					<h3 class="project-title">
					<?= esc_html(get_the_title($project)); ?>
					</h3>

					<p class="project-excerpt">
					<?= esc_html(get_the_excerpt($project)); ?>
					</p>

					<span class="project-cta">
					View Case Study →
					</span>
				</div>
            </div>
          </a>
        </article>

      <?php endforeach; ?>

    </div>

    <!-- <div class="marquee-progress"></div> -->
  </section>

  <?php
  return ob_get_clean();
});

// Enabling Local JSON

// Save ACF field groups as JSON in the theme
add_filter('acf/settings/save_json', function () {
    return get_stylesheet_directory() . '/acf-json';
});

// Load ACF field groups from the theme
add_filter('acf/settings/load_json', function ($paths) {
    unset($paths[0]);
    $paths[] = get_stylesheet_directory() . '/acf-json';
    return $paths;
});

// Projects Listing (and filktering ) for the Portfolio page

add_shortcode('projects_archive', 'dx_projects_archive_shortcode');

function dx_projects_archive_shortcode($atts) {
	ob_start();

	$args = [
		'post_type'      => 'project',
		'posts_per_page' => -1,
	];

	$query = new WP_Query($args);

	if (!$query->have_posts()) {
		return '<p>No projects found.</p>';
	}
	?>

	<div class="portfolio-archive" data-projects-archive>

		<div class="filter-inputs">
			<div class="project-search">
				<input
					id="search-box"
					type="search"
					placeholder="Search projects…"
					aria-label="Search projects"
					data-project-search
				/>
			</div>

			<div class="project-filter-buttons">
				<button data-filter="all" class="is-active">All</button>
				<button data-filter="design">Design</button>
				<button data-filter="development">WordPress</button>
				<button data-filter="static">Static</button>
				<button data-filter="shopify">Shopify</button>
				<button data-context="freelance">Freelance</button>
				<button data-context="commercial">Commercial</button>
			</div>
		</div>

		<!-- Dynamic state title -->
		<h2 class="projects-state-title">
			Showing <span data-projects-state-title class="label">All</span> Projects
		</h2>

		<!-- Empty state -->
		<div class="projects-empty-state" hidden data-projects-empty>
			<h3>No Projects Found</h3>
			<span>Try adjusting your filters or search terms.</span>
		</div>

		<ul class="projects-grid" data-projects-grid>
			<?php while ($query->have_posts()) : $query->the_post();

				/* ----------------------------
				ACF fields
				---------------------------- */
				$title_override = get_field('project_name_override');
				$header_image   = get_field('header_image');
				$client_type    = get_field('client_type'); // freelance | commercial
				$employer       = get_field('employer');
				$types          = get_field('project_type') ?: [];
				$project_status = get_field('project_status');
				$site_status    = get_field('site_status');

				/* ----------------------------
				Derived values
				---------------------------- */
				$year = (int) get_the_date('Y');

				$context_label = ($client_type === 'commercial' && $employer)
					? 'Commercial — ' . esc_html($employer)
					: ucfirst($client_type ?: 'Freelance');

				$type_attr = implode(' ', array_map('sanitize_title', (array) $types));

				$search_blob = strtolower(
					get_the_title() . ' ' .
					get_the_excerpt() . ' ' .
					implode(' ', $types) . ' ' .
					$context_label . ' ' .
					$year
				);

				$display_title = $title_override ?: get_the_title();

				/* ----------------------------
				Image fallback
				---------------------------- */
			if (!empty($header_image)) {
					$image_html = wp_get_attachment_image($header_image['ID'], 'large');
				} else {
					$image_html = get_the_post_thumbnail(get_the_ID(), 'large');
				}
			?>

			<li
				class="project-card"
				data-type="<?= esc_attr($type_attr); ?>"
				data-year="<?= esc_attr($year); ?>"
				data-context="<?= esc_attr($client_type); ?>"
				data-search="<?= esc_attr($search_blob); ?>"
			>
				<a href="<?php the_permalink(); ?>" class="project-thumb">
					<?php
						// Default featured image
						the_post_thumbnail('large', [
							'class' => 'project-image project-image--default'
						]);

						// ACF hover image (optional)
						if (!empty($header_image)) {
							echo wp_get_attachment_image(
								$header_image['ID'],
								'large',
								false,
								[
									'class' => 'project-image project-image--hover'
								]
							);
						}
					?>
				</a>

				<div class="project-meta">
					<span class="project-year"><?= esc_html($year); ?></span>
					<span class="meta-separator">•</span>
					<span class="project-context"><?= esc_html($context_label); ?></span>

					<?php if ($site_status) : ?>
						<span class="meta-separator">•</span>
						<span class="site-status site-status--<?= esc_attr($site_status); ?>">
							<?= esc_html(ucwords(str_replace('_', ' ', $site_status))); ?>
						</span>
					<?php endif; ?>
				</div>

				<h3 class="project-title">
					<a href="<?php the_permalink(); ?>">
						<?= esc_html($display_title); ?>
					</a>
				</h3>

				<p class="excerpt"><?php the_excerpt(); ?></p>

				<?php if (!empty($types)) : ?>
					<ul class="project-types">
						<?php foreach ($types as $type) : ?>
							<li><?= esc_html($type); ?></li>
						<?php endforeach; ?>
					</ul>
				<?php endif; ?>

				<a href="<?php the_permalink(); ?>" class="project-cta">
					View Case Study →
				</a>
			</li>

			<?php endwhile; wp_reset_postdata(); ?>
		</ul>

	</div>

	<?php
	return ob_get_clean();
}

/**
 * Gym table shortcode: [dx_gym_table]
 * Pulls from CPT: fitness
 * ACF fields expected:
 * - gym_chain (select)
 * - visited_date (date, stored as Y-m-d)
 * - visit_type (select, David Lloyds only)
 * - score_gym, score_swim, score_spa, score_cafe (select)
 * - notes (textarea)
 */

function dx_render_facility_score($value) {
	$value = is_string($value) ? trim($value) : $value;

	// Default blank to "didnt_use"
	if ($value === '' || $value === null) {
		$value = 'didnt_use';
	}

	// Unavailable
	if ($value === 'unavailable') {
		return '<span class="dx-score is-unavailable"><span class="dx-score-emoji">—</span><span class="dx-score-text">Unavailable</span></span>';
	}

	// Didn’t use
	if ($value === 'didnt_use') {
		return '<span class="dx-score is-didnt-use"><span class="dx-score-emoji">—</span><span class="dx-score-text">Didn’t use</span></span>';
	}

	// Numeric score 0–10
	$score = is_numeric($value) ? (int) $value : null;
	if ($score === null || $score < 0 || $score > 10) {
		return '<span class="dx-score is-didnt-use"><span class="dx-score-emoji">—</span><span class="dx-score-text">Didn’t use</span></span>';
	}

	if ($score === 0) {
		$emoji = '🗑️';
	} elseif ($score >= 1 && $score <= 4) {
		$emoji = '👎🏾';
	} elseif ($score === 5) {
		$emoji = '🤷🏾‍♂️';
	} elseif ($score >= 6 && $score <= 9) {
		$emoji = '👍🏾';
	} elseif ($score === 10) {
		$emoji = '💎';
	} else {
		$emoji = '—';
	}

	return sprintf(
		'<span class="dx-score" data-score="%d"><span class="dx-score-emoji">%s</span><span class="dx-score-text">%d/10</span></span>',
		$score,
		$emoji,
		$score
	);
}

function dx_gym_chain_label($value) {
	$map = [
		'davidlloyds'  => 'David Lloyds',
		'puregym'      => 'PureGym',
		'virginactive' => 'Virgin Active',
		'bodyworks'    => 'Bodyworks Gym',
		'thegymgroup'  => 'The Gym Group',
		'other'        => 'Other',
	];
	return $map[$value] ?? ($value ?: '—');
}

function dx_visit_type_label($value) {
	$map = [
		'guest'        => 'Guest',
		'platinum2023' => 'Platinum (Tier 3 Membership)',
		'platinum2025' => 'Platinum (Tier 1 Membership)',
		'diamond'      => 'Diamond (Tier 1 Membership)',
		'didnt_use'    => 'Didn’t use',
	];
	return $map[$value] ?? ($value ?: '—');
}

function dx_shortcode_gym_table($atts) {
	$atts = shortcode_atts([
		'chain' => '',     // optional filter: davidlloyds / puregym etc
		'limit' => -1,     // optional limit
	], $atts, 'dx_gym_table');

	$args = [
		'post_type'      => 'gym-review',
		'posts_per_page' => (int) $atts['limit'],
		'post_status'    => 'publish',
		'orderby'        => 'date',
		'order'          => 'DESC',
	];

	if (!empty($atts['chain'])) {
		$args['meta_query'] = [
			[
				'key'     => 'gym_chain',
				'value'   => sanitize_text_field($atts['chain']),
				'compare' => '=',
			]
		];
	}

	$q = new WP_Query($args);

	ob_start();

	if (!$q->have_posts()) {
		echo '<p>No gym visits yet.</p>';
		return ob_get_clean();
	}

	// Wrapper (Projects-page style)
	echo '<div class="gym-archive" data-gyms-archive>';

	/**
	 * Controls UI (search / filters / sort / view toggle)
	 * You can move this into your page builder if you prefer,
	 * but this gives you a working default.
	 */
	echo '
		<div class="filter-inputs">
			<div class="gym-search">
				<input type="search" placeholder="Search gyms…" aria-label="Search gyms" data-gym-search />
			</div>

			<div class="gym-filter-buttons">
				<button class="is-active" data-chain="all">All</button>
				<button data-chain="davidlloyds">David Lloyd</button>
				<button data-chain="puregym">PureGym</button>
				<button data-chain="virginactive">Virgin Active</button>
				<button data-chain="bodyworks">Bodyworks Gym</button>
				<button data-chain="thegymgroup">The Gym Group</button>
			</div>

			<div class="gym-controls">
				<label class="gym-sort">
					<span class="sr-only">Sort</span>
					<select data-gym-sort aria-label="Sort gyms">
						<option value="overall_desc">Highest rated</option>
						<option value="overall_asc">Lowest rated</option>
						<option value="date_desc">Visit date (newest)</option>
						<option value="date_asc">Visit date (oldest)</option>
						<option value="az">A–Z</option>
						<option value="za">Z–A</option>
					</select>
				</label>

				<div class="gym-view-toggle" role="group" aria-label="View toggle">
					<button type="button" class="is-active" data-gym-view="cards">Cards</button>
					<button type="button" data-gym-view="list">List</button>
				</div>
			</div>
		</div>

		<h2 class="gyms-state-title">
			Showing <span data-gyms-state-title class="label">All</span> Gyms
		</h2>

		<div class="gyms-empty-state" hidden data-gyms-empty>
			<h3>No Gyms Found</h3>
			<span>Try adjusting your filters or search terms.</span>
		</div>
	';

	echo '<div class="dx-gyms-grid" data-gyms-grid>';

	while ($q->have_posts()) {
		$q->the_post();

		$branch     = get_the_title();

		$chain_val  = get_field('gym_chain');
		$chain_lbl  = dx_gym_chain_label($chain_val);

		$date_raw   = get_field('visited_date');
		$visited    = '—';
		$visited_ts = 0;

		if (!empty($date_raw)) {
			$ts = strtotime($date_raw);
			if ($ts) {
				$visited_ts = $ts;
				$visited = date_i18n('F Y', $ts);
			}
		}

		$visit_type_val = get_field('visit_type');
		$visit_type_lbl = dx_visit_type_label($visit_type_val);

		$sGym  = dx_normalise_facility_score(get_field('score_gym'));
		$sSwim = dx_normalise_facility_score(get_field('score_swim'));
		$sSpa  = dx_normalise_facility_score(get_field('score_spa'));
		$sCafe = dx_normalise_facility_score(get_field('score_cafe'));

		$overall = dx_calc_overall_score([$sGym, $sSwim, $sSpa, $sCafe]);
		$overall_score = ($overall === null) ? -1 : (int) $overall;
		$overall_emoji = ($overall === null) ? '—' : dx_score_to_emoji($overall);

		$notes = (string) get_field('notes');

		$location_text = trim((string) get_field('gym_location'));
		$maps_url      = trim((string) get_field('google_maps_url'));

		$location_html = '';

		if ($location_text && $maps_url) {
			$location_html = '
				<span class="dx-badge dx-badge--location">
					<a href="' . esc_url($maps_url) . '" target="_blank" rel="noopener noreferrer">
						📍 ' . esc_html($location_text) . '
					</a>
				</span>';
		} elseif ($location_text) {
			$location_html = '
				<span class="dx-badge dx-badge--location">
					📍 ' . esc_html($location_text) . '
				</span>';
		}

		$search_blob = strtolower(trim($branch . ' ' . $chain_lbl . ' ' . $visited . ' ' . $location_text . ' ' . $notes));

		echo '
			<article
				class="dx-gym-card"
				data-gym-card
				data-chain="'.esc_attr($chain_val ?: 'unknown').'"
				data-search="'.esc_attr($search_blob).'"
				data-branch="'.esc_attr(strtolower($branch)).'"
				data-visited-ts="'.esc_attr($visited_ts).'"
				data-overall="'.esc_attr($overall_score).'"
			>


			<div class="dx-gym-card__header">
				<h3 class="dx-gym-card__branch">
					<a href="'.esc_url(get_permalink()).'">'.esc_html($branch).'</a>
				</h3>
			'.($location_text
				? '<div class="dx-gym-card__subtitle">' .
					($maps_url
						? '📍' . '<a href="'.esc_url($maps_url).'" target="_blank" rel="noopener noreferrer"> '.esc_html($location_text).'</a>'
						: ' '.esc_html($location_text)
					) .
					'</div>'
				: ''
			).'

			<div class="dx-gym-card__meta">
				<span class="dx-badge dx-badge--chain">'.esc_html($chain_lbl).'</span>
				<span class="dx-badge dx-badge--date">'.esc_html($visited).'</span>
					'.(
						$chain_val === 'davidlloyds' && $visit_type_val && $visit_type_val !== 'didnt_use'
						? '<span class="dx-badge dx-badge--membership">'.esc_html($visit_type_lbl).'</span>'
						: ''
					).'

					<span class="dx-badge dx-badge--overall" '.($overall !== null ? 'data-score="'.esc_attr($overall).'"' : 'data-score="na"').'>
						<span class="emoji">'.esc_html($overall_emoji).'</span>
						<span class="text">'.($overall !== null ? esc_html($overall).'/10' : 'No rating').'</span>
					</span>
				</div>
			</div>

			<div class="dx-gym-card__scores">
				'.dx_render_facility_score_block('Gym', get_field('score_gym')).'
				'.dx_render_facility_score_block('Swim', get_field('score_swim')).'
				'.dx_render_facility_score_block('Spa', get_field('score_spa')).'
				'.dx_render_facility_score_block('Café', get_field('score_cafe')).'
			</div>

			<div class="dx-notes">
				<button class="dx-notes__toggle" type="button" data-notes-toggle aria-expanded="false">
					Expand Notes
					<span class="chev" aria-hidden="true">▾</span>
				</button>

				<div class="dx-notes__panel" data-notes-panel>
					'.($notes ? wp_kses_post(nl2br(esc_html($notes))) : '<span class="dx-notes__empty">No notes for this visit.</span>').'
				</div>
			</div>
		</article>';
	}

	echo '</div>'; // grid

	echo '
		<div class="gym-pagination">
			<button type="button" data-gyms-load-more>Load more</button>
		</div>
	';

	echo '</div>'; // archive

	return ob_get_clean();
}
add_shortcode('dx_gym_table', 'dx_shortcode_gym_table');

// Score Block Renderer

function dx_score_to_emoji($score) {
	$score = (int) $score;

	if ($score === 0) return '🗑️';
	if ($score >= 1 && $score <= 4) return '👎🏾';
	if ($score === 5) return '🤷🏾‍♂️';
	if ($score >= 6 && $score <= 9) return '👍🏾';
	if ($score === 10) return '💎';

	return '—';
}

function dx_normalise_facility_score($raw) {
	// supports: '', null, 'didnt_use', 'unavailable', numeric
	if ($raw === null || $raw === '' || $raw === 'didnt_use') return null;
	if ($raw === 'unavailable') return 'unavailable';

	$n = (int) $raw;
	if ($n < 0) $n = 0;
	if ($n > 10) $n = 10;
	return $n;
}

function dx_calc_overall_score($scores) {
	// average only numeric scores (ignore null and 'unavailable')
	$nums = [];
	foreach ($scores as $s) {
		if (is_int($s)) $nums[] = $s;
	}
	if (!count($nums)) return null;

	return (int) round(array_sum($nums) / count($nums));
}

function dx_render_facility_score_block($label, $rawScore) {
	$score = dx_normalise_facility_score($rawScore);

	// Unavailable
	if ($score === 'unavailable') {
		return '
		<div class="dx-score-block is-unavailable">
			<div class="dx-score-top">
				<span class="dx-score-label">'.esc_html($label).'</span>
				<span class="dx-score-value">Unavailable</span>
			</div>
			<div class="dx-score-bar" aria-hidden="true"><span style="--pct:0"></span></div>
		</div>';
	}

	// Didn't use (default state)
	if ($score === null) {
		return '
		<div class="dx-score-block is-didnt-use">
			<div class="dx-score-top">
				<span class="dx-score-label">'.esc_html($label).'</span>
				<span class="dx-score-value">Didn’t use</span>
			</div>
			<div class="dx-score-bar" aria-hidden="true"><span style="--pct:0"></span></div>
		</div>';
	}

	$emoji = dx_score_to_emoji($score);
	$pct   = $score / 10;

	return '
	<div class="dx-score-block" data-score="'.esc_attr($score).'">
		<div class="dx-score-top">
			<span class="dx-score-label">'.esc_html($label).'</span>
			<span class="dx-score-value">'.esc_html($emoji).' '.esc_html($score).'/10</span>
		</div>
		<div class="dx-score-bar" aria-hidden="true"><span style="--pct:'.esc_attr($pct).'"></span></div>
	</div>';
}