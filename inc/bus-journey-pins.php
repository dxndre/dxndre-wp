<?php
/** Editable diary waypoints: one record drives the map and its timeline. */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function dx_journey_pin_sanitize( $rows ) {
	if ( ! is_array( $rows ) || count( $rows ) > 80 ) {
		return new WP_Error( 'pin_limit', 'Please use no more than 80 journey pins.' );
	}
	$pins = array();
	$seen = array();
	foreach ( $rows as $row ) {
		if ( ! is_array( $row ) ) { continue; }
		$title = mb_substr( sanitize_text_field( $row['title'] ?? '' ), 0, 160 );
		$has_content = $title || trim( (string) ( $row['lat'] ?? '' ) ) || trim( (string) ( $row['lng'] ?? '' ) ) || trim( (string) ( $row['body'] ?? '' ) ) || trim( (string) ( $row['time'] ?? '' ) ) || trim( (string) ( $row['video'] ?? '' ) ) || absint( $row['image'] ?? 0 );
		if ( ! $has_content ) { continue; }
		$lat = $row['lat'] ?? '';
		$lng = $row['lng'] ?? '';
		if ( '' === $title || ! is_numeric( $lat ) || ! is_numeric( $lng ) || abs( (float) $lat ) > 90 || abs( (float) $lng ) > 180 ) {
			return new WP_Error( 'invalid_pin', 'Every journey pin needs a title and valid latitude (−90 to 90) and longitude (−180 to 180). Your previous pins have been kept.' );
		}
		$id = sanitize_key( $row['id'] ?? '' );
		if ( ! $id || isset( $seen[ $id ] ) ) { $id = wp_generate_uuid4(); }
		$seen[ $id ] = true;
		$image = absint( $row['image'] ?? 0 );
		if ( $image && ! wp_attachment_is_image( $image ) ) { $image = 0; }
		$pins[] = array(
			'id' => $id, 'title' => $title,
			'lat' => round( (float) $lat, 7 ), 'lng' => round( (float) $lng, 7 ),
			'time' => mb_substr( sanitize_text_field( $row['time'] ?? '' ), 0, 60 ),
			'body' => mb_substr( sanitize_textarea_field( $row['body'] ?? '' ), 0, 5000 ),
			'image' => $image,
			'video' => esc_url_raw( $row['video'] ?? '', array( 'http', 'https' ) ),
		);
	}
	return $pins;
}

function dx_journey_pins( $post_id ) {
	$stored = get_post_meta( $post_id, '_dx_journey_pins', true );
	if ( ! is_array( $stored ) ) { return array(); }
	$pins = dx_journey_pin_sanitize( $stored );
	return is_wp_error( $pins ) ? array() : $pins;
}

function dx_journey_pin_row( $index, $pin = array() ) {
	$prefix = 'dx_journey_pins[' . $index . ']';
	?>
	<fieldset class="dx-pin-editor-row" style="border:1px solid #c3c4c7;padding:16px;margin:16px 0">
		<legend><strong>Journey pin <span data-pin-number><?php echo esc_html( is_numeric( $index ) ? $index + 1 : '' ); ?></span></strong></legend>
		<input type="hidden" data-pin-field="id" name="<?php echo esc_attr( $prefix ); ?>[id]" value="<?php echo esc_attr( $pin['id'] ?? '' ); ?>">
		<p><label>Title<br><input class="widefat" data-pin-field="title" name="<?php echo esc_attr( $prefix ); ?>[title]" maxlength="160" value="<?php echo esc_attr( $pin['title'] ?? '' ); ?>"></label></p>
		<div style="display:flex;gap:16px;flex-wrap:wrap">
			<?php foreach ( array( 'lat' => 'Latitude', 'lng' => 'Longitude' ) as $key => $label ) : ?>
			<label><?php echo esc_html( $label ); ?><br><input data-pin-field="<?php echo esc_attr( $key ); ?>" type="number" step="any" min="<?php echo 'lat' === $key ? '-90' : '-180'; ?>" max="<?php echo 'lat' === $key ? '90' : '180'; ?>" name="<?php echo esc_attr( $prefix . '[' . $key . ']' ); ?>" value="<?php echo esc_attr( $pin[ $key ] ?? '' ); ?>"></label>
			<?php endforeach; ?>
			<label>Time / short caption (optional)<br><input data-pin-field="time" name="<?php echo esc_attr( $prefix ); ?>[time]" maxlength="60" value="<?php echo esc_attr( $pin['time'] ?? '' ); ?>"></label>
		</div>
		<p><button class="button" type="button" data-pin-locate>Pick coordinates on the map</button></p>
		<p><label>What happened here?<br><textarea class="widefat" data-pin-field="body" name="<?php echo esc_attr( $prefix ); ?>[body]" rows="4" maxlength="5000"><?php echo esc_textarea( $pin['body'] ?? '' ); ?></textarea></label></p>
		<p><label>Photograph attachment ID<br><input type="number" min="0" data-pin-field="image" name="<?php echo esc_attr( $prefix ); ?>[image]" value="<?php echo esc_attr( $pin['image'] ?? 0 ); ?>"></label> <button class="button" type="button" data-pin-image>Choose photograph</button></p>
		<p><label>Video URL (optional)<br><input class="widefat" type="url" data-pin-field="video" name="<?php echo esc_attr( $prefix ); ?>[video]" value="<?php echo esc_attr( $pin['video'] ?? '' ); ?>" placeholder="https://…"></label><span class="description">MP4, WebM and Ogg files play in the timeline. Other public video links open their original page.</span></p>
		<p><button class="button" type="button" data-pin-move="up">Move up</button> <button class="button" type="button" data-pin-move="down">Move down</button> <button class="button-link-delete" type="button" data-pin-remove>Remove pin</button></p>
	</fieldset>
	<?php
}

add_action( 'add_meta_boxes_bus-diary-entry', function () {
	add_meta_box( 'dx-journey-pins', 'Journey map & timeline pins', function ( $post ) {
		wp_nonce_field( 'dx_journey_pins_save', 'dx_journey_pins_nonce' );
		echo '<p>Add places you actually visited, in journey order. Each pin appears on the map and in the Timeline view; photographs and videos are optional. Choose a pin’s “Pick coordinates” button, then click the map or drag its marker. Decimal coordinate fields provide a keyboard-accessible alternative. The connecting line is a journey outline, not turn-by-turn routing.</p>';
		echo '<div data-pin-admin-map data-start-lat="' . esc_attr( get_post_meta( $post->ID, 'journey_start_lat', true ) ) . '" data-start-lng="' . esc_attr( get_post_meta( $post->ID, 'journey_start_lng', true ) ) . '" style="height:320px;max-width:100%;background:#11191d" aria-label="Choose journey pin locations"></div><p role="status" data-pin-map-status>Choose a pin below to place it on this map.</p><div data-pin-editor>';
		foreach ( dx_journey_pins( $post->ID ) as $index => $pin ) { dx_journey_pin_row( $index, $pin ); }
		echo '</div><button type="button" class="button button-secondary" data-pin-add>Add journey pin</button><p role="status" data-pin-editor-status></p><template data-pin-template>';
		dx_journey_pin_row( '__INDEX__' );
		echo '</template>';
	}, 'bus-diary-entry', 'normal', 'default' );
} );

add_action( 'admin_enqueue_scripts', function () {
	$screen = get_current_screen();
	if ( ! $screen || 'bus-diary-entry' !== $screen->post_type || 'post' !== $screen->base ) { return; }
	wp_enqueue_media();
	wp_enqueue_style( 'dx-journey-pins-leaflet', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', array(), '1.9.4' );
	wp_enqueue_script( 'dx-journey-pins-leaflet', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', array(), '1.9.4', true );
	$asset = include get_theme_file_path( 'build/index.asset.php' );
	wp_enqueue_script( 'dxndre-theme-admin', get_theme_file_uri( 'build/index.js' ), array_values( array_unique( array_merge( $asset['dependencies'], array( 'media-editor', 'dx-journey-pins-leaflet' ) ) ) ), $asset['version'], true );
} );

add_action( 'save_post_bus-diary-entry', function ( $post_id ) {
	if ( wp_is_post_revision( $post_id ) || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || ! current_user_can( 'edit_post', $post_id ) || empty( $_POST['dx_journey_pins_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['dx_journey_pins_nonce'] ) ), 'dx_journey_pins_save' ) ) { return; }
	$pins = dx_journey_pin_sanitize( wp_unslash( $_POST['dx_journey_pins'] ?? array() ) );
	if ( is_wp_error( $pins ) ) {
		set_transient( 'dx_pin_error_' . get_current_user_id(), $pins->get_error_message(), MINUTE_IN_SECONDS );
		return;
	}
	update_post_meta( $post_id, '_dx_journey_pins', $pins );
} );

add_action( 'admin_notices', function () {
	$error = get_transient( 'dx_pin_error_' . get_current_user_id() );
	if ( $error ) {
		delete_transient( 'dx_pin_error_' . get_current_user_id() );
		echo '<div class="notice notice-error"><p>' . esc_html( $error ) . '</p></div>';
	}
} );

function dx_journey_pins_json( $post_id ) {
	echo '<script type="application/json" data-journey-pins>' . wp_json_encode( dx_journey_pins( $post_id ), JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT ) . '</script>';
}

function dx_journey_timeline( $post_id ) {
	$pins = dx_journey_pins( $post_id );
	?>
	<div class="bus-panel bus-panel--timeline">
		<pre class="headline">Stop by stop</pre><h2>Journey Timeline</h2>
		<?php if ( ! $pins ) : ?>
			<p class="dx-journey-empty">No annotated stops have been added to this journey yet. Explore the story and photograph in the meantime.</p>
		<?php else : ?>
			<ol class="dx-journey-timeline">
				<?php foreach ( $pins as $index => $pin ) : ?>
				<li id="journey-pin-<?php echo esc_attr( $pin['id'] ); ?>" data-journey-pin="<?php echo esc_attr( $pin['id'] ); ?>">
					<button type="button" class="dx-journey-point" data-journey-point="<?php echo esc_attr( $pin['id'] ); ?>" aria-label="<?php echo esc_attr( 'Show ' . $pin['title'] . ' on the map' ); ?>"><span aria-hidden="true"><?php echo esc_html( str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></span><strong><?php echo esc_html( $pin['title'] ); ?></strong></button>
					<?php if ( $pin['time'] ) : ?><p class="dx-journey-time"><?php echo esc_html( $pin['time'] ); ?></p><?php endif; ?>
					<?php if ( $pin['image'] ) { echo wp_get_attachment_image( $pin['image'], 'medium_large', false, array( 'loading' => 'lazy' ) ); } ?>
					<?php if ( $pin['body'] ) : ?><div class="dx-journey-copy"><?php echo wpautop( esc_html( $pin['body'] ) ); ?></div><?php endif; ?>
					<?php if ( $pin['video'] ) : ?>
						<?php if ( preg_match( '/\.(mp4|webm|og[gv])$/i', (string) wp_parse_url( $pin['video'], PHP_URL_PATH ) ) ) : ?><video controls preload="none" aria-label="<?php echo esc_attr( $pin['title'] . ' video' ); ?>" src="<?php echo esc_url( $pin['video'] ); ?>"></video><?php else : ?><a class="dx-journey-video-link" href="<?php echo esc_url( $pin['video'] ); ?>" target="_blank" rel="noopener noreferrer">Watch video <span aria-hidden="true">↗</span><span class="screen-reader-text"> (opens a new tab)</span></a><?php endif; ?>
					<?php endif; ?>
				</li>
				<?php endforeach; ?>
			</ol>
		<?php endif; ?>
	</div>
	<?php
}
