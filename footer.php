			<?php
				// If Single or Archive (Category, Tag, Author or a Date based page).
				if (
					is_single() && get_post_type() === 'post'
					|| is_archive() && ! is_post_type_archive()
				) :
			?>
					</div><!-- /.col -->

					<?php
						get_sidebar();
					?>

				</div><!-- /.row -->
			<?php
				endif;
			?>
		<?php dx_render_photography_outro(); dx_render_instagram_section(); ?>
		</main><!-- /#main -->
		<?php get_template_part( 'inc/site-footer' ); ?>
	</div><!-- /#wrapper -->
	<?php
		get_template_part('inc/hire-modals');
		wp_footer();
	?>
</body>
</html>
