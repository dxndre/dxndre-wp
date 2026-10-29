<?php
/** Client-facing guidance adapted from client-space-guide.md. */
defined( 'ABSPATH' ) || exit;

function dxcp_support_words( $service = 'digital' ) {
	$uses_tickets = ! in_array( $service, array( 'fitness', 'photography' ), true );
	return array(
		'tickets' => $uses_tickets,
		'singular' => $uses_tickets ? 'ticket' : 'conversation',
		'plural' => $uses_tickets ? 'tickets' : 'conversations',
		'your' => $uses_tickets ? 'Your tickets' : 'Your conversations',
		'new' => $uses_tickets ? 'New ticket' : 'New conversation',
		'start' => $uses_tickets ? 'Submit a ticket' : 'Start a conversation',
		'search' => $uses_tickets ? 'Find a ticket' : 'Find a conversation',
	);
}

function dxcp_render_help( $context ) {
	$project_id = $context['pid'];
	$words = dxcp_support_words( $context['service'] );
	$topics = array(
		'Your workspace' => array(
			'Use the project selector to switch between your assigned projects. Each project has its own journey, to-dos, documents and payment information.',
			'Welcome gives you a quick starting point, with your current projects and actions. Overview brings together your selected project’s next steps and recent activity. Your project partner is one message away through Support.',
		),
		'Quotations and your brief' => array(
			'An estimate generated while you are signed in is connected to your account automatically. You can connect an estimate made in this browser, or use its private key. Knowing a reference alone does not grant access.',
			'Confirming your brief asks D’André to review it. It does not accept a contract or make a payment. A final quotation is issued separately for you to review and explicitly accept.',
			'If a quotation changes, review the new version before accepting it. Connected quotations and PDFs are private to the assigned client and administrators.',
		),
		'Your project journey' => array(
			'For digital projects, follow quotation and brief, design, development, testing and audit, launch, and post-launch care. D’André updates the stage as your project progresses.',
			'Your design file, staging site, feedback board and live website links appear when they are ready to share. A stage update and your recorded quotation acceptance are separate.',
		),
		'Documents and onboarding' => array(
			'Your Drive holds shared project documents and agreements. Uploaded files are kept outside the public website and require an account and ownership check to download.',
			'Complete the onboarding form in Your Drive to share your project goals, audience, content readiness and preferred contact method. These answers stay with the selected project.',
			'Files attached to a to-do or support update stay with that discussion. An external document link may also require permission from its hosting service.',
		),
		'To-dos, comments and files' => array(
			'Open a to-do to read the brief, add a comment and attach an image, document, audio or video file. Each file can be up to 5 MB. For larger files, add a shareable cloud-storage link in your message or ask D’André for a file-sharing link.',
			'Update your progress to To do, In progress or Waiting. Ready for review asks D’André to check your work before marking it complete. You can keep commenting after completion.',
			'Use PDF, text, DOCX, XLSX, PPTX, common image formats or supported audio/video. For passwords and other credentials, ask D’André for a secure sharing method.',
		),
		'Payments and deferrals' => array(
			'Quotations & payments shows your agreed project total, payments received, remaining balance, confirmed due dates and payment agreements. An indicative estimate does not create a payment obligation.',
			'For monthly work, the confirmed payment dates appear individually. If you need some flexibility, request a deferral against an outstanding payment and explain what would help.',
			'A deferral stays pending until reviewed. Your current amount and due date remain in place until a change is agreed. A payment link appears only when one has been supplied.',
		),
		'Support and priorities' => array(
			'Digital-service requests are handled as tickets. Fitness and photography clients can use conversations. Search your requests and filter by All, Open or Closed.',
			'Choose Normal for an ordinary question or request, Urgent when something is blocking your work, or No rush when it can fit around other priorities. The priority flag does not promise a response time.',
			'Add updates and files to the same request so the details stay together. Mark it resolved when everything is sorted, and reopen it if you need to pick it up again.',
		),
		'Fitness coaching' => array(
			'When a fitness coaching project is selected, Coaching sessions shows your calendar, session times, locations, status and any online-session link.',
			'Times are shown in Europe/London, including daylight saving. Calendar entries record agreed sessions; contact your coach through Support if you need to rearrange one.',
		),
		'Account and appearance' => array(
			'Keep your display name, company, phone and website up to date in Your details. Contact D’André for changes to your account email, billing identity or access permissions.',
			'Use the light/dark control at the top of the workspace. Your preference is remembered on this browser. On smaller screens, the menu button opens your workspace navigation.',
			'Clearly labelled test workspaces contain illustrative figures and appointments. No payment is due and no session is booked for those examples.',
		),
	);
	?>
	<div class="dxcp-view-heading">
		<p class="dxcp-eyebrow">A LITTLE CLARITY</p>
		<h1>Your workspace guide</h1>
		<p>Where things live, how they work and what to do next.</p>
	</div>
	<div class="dxcp-help-grid">
		<?php foreach ( $topics as $title => $paragraphs ) : ?>
			<article class="dxcp-card dxcp-help-topic">
				<h2><?php echo esc_html( $title ); ?></h2>
				<?php foreach ( $paragraphs as $paragraph ) : ?>
					<p><?php echo esc_html( $paragraph ); ?></p>
				<?php endforeach; ?>
			</article>
		<?php endforeach; ?>
	</div>
	<?php if ( ! isset( $context['has_client_access'] ) || $context['has_client_access'] ) : ?>
	<article class="dxcp-card">
		<?php dxcp_card_heading( 'YOUR DIRECT LINE', 'Still need a hand?' ); ?>
		<p>Share a question with D’André and keep the answer with your project.</p>
		<a class="dxcp-btn dxcp-btn--dark" href="<?php echo esc_url( dxcp_portal_url( 'support', $project_id, array( 'new_ticket' => 1 ) ) ); ?>"><?php echo esc_html( $words['start'] ); ?> <?php echo dxcp_icon( 'arrow' ); ?></a>
	</article>
	<?php endif; ?>
	<?php if ( dxcp_is_site_owner() ) : ?>
		<article class="dxcp-card">
			<?php dxcp_card_heading( 'FOR YOUR TEAM', 'Managing client work' ); ?>
			<p>Create and assign a Client project in WordPress, set its service and stage, then add real design, staging, audit and launch links. Use Client Drive, Client to-dos, Project payments and Coaching sessions for the records shared with each client.</p>
			<p>Issue a final quotation only after reviewing its exact scope and terms. Record payment dates and amounts after agreement. A deferral approval records the decision; applying its new due date is a separate, explicit action.</p>
			<p>Use the Admin overview to filter projects by client, service and stage, then open a selected workspace for review. Business manager brings together your client directory, quotations, invoices, verified payments, receipts and reporting. A client transfer report is always separate from your confirmation that funds have reached the bank; receipts follow verified funds only.</p>
		</article>
	<?php endif;
}
