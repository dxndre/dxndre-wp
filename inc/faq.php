<?php
/** Shared FAQ content for the page and its search metadata. */
defined('ABSPATH') || exit;

function dx_faq_description() {
	return 'Answers about DXNDRE’s design, web development, WordPress, photography and upcoming N118 Fitness coaching, including payment timing and planned coaching locations.';
}

function dx_faq_items() {
	$services_url = esc_url(home_url('/services/'));
	$fitness_url = esc_url(home_url('/n118-fitness/'));
	$calculator_url = esc_url(home_url('/pricing-calculator/'));
	$project_url = esc_url(home_url('/start-a-project/'));

	return [
		[
			'id' => 'services',
			'question' => 'What services do you provide?',
			'answer' => '<p>I work across considered interface design, custom web development and WordPress development. You can bring me in for a complete design and development project, a focused one-time fix, or ongoing support through a monthly retainer.</p> <p>I also offer photography for people, places and brands. Personal coaching through N118 Fitness is coming soon.</p> <p><a href="' . $services_url . '">Explore my services <span aria-hidden="true">↗</span></a> or <a href="' . $fitness_url . '">meet N118 Fitness <span aria-hidden="true">↗</span></a>.</p>',
		],
		[
			'id' => 'payments',
			'question' => 'When are payments due for each service?',
			'answer' => '<p>There is nothing to pay when you send an enquiry, use the calculator or have our initial conversation. I’ll issue a final quotation after our call. You review and accept that quotation before any deposit or payment is required.</p> <ul><li><strong>Design, custom development, WordPress, complete projects and one-time fixes:</strong> a £50 deposit (or the quoted total if lower) is due after acceptance, before work begins, and forms part of your total. With the pay-in-full option, the remaining balance is also due before work begins.</li> <li><strong>Agreed instalment plans:</strong> the available options and dates are confirmed in your final quotation. The calculator offers three instalments at completion of design, completion of development and 30 days after launch, where appropriate to the project. Quotes over £600 can use six monthly instalments with a one-off 5% charge on the full quote; the first is due one month after the deposit. A custom schedule can be discussed during our call.</li> <li><strong>Photography:</strong> a £10 deposit (or the quoted total if lower) is due after the call and acceptance of the final quotation. The remaining quoted balance is due after the shoot.</li> <li><strong>Retainers:</strong> support is quoted monthly. Your payment plan, commitment and billing dates are confirmed in the final quotation before support begins.</li> <li><strong>N118 Fitness coaching:</strong> coaching is coming soon. Pricing and payment arrangements will be confirmed before any booking; registering your interest does not purchase a session.</li></ul> <p>Your accepted quotation sets out the payment schedule for your particular service. <a href="' . $calculator_url . '">Explore an estimate <span aria-hidden="true">↗</span></a> or <a href="' . $project_url . '">tell me about your project <span aria-hidden="true">↗</span></a>.</p>',
		],
		[
			'id' => 'coaching-locations',
			'question' => 'Where will coaching sessions take place?',
			'answer' => '<p>N118 Fitness coaching is coming soon. I plan to offer virtual sessions and in-person coaching, mainly at your home.</p> <p>We can also discuss sessions at your gym with the manager’s or owner’s permission, or at a Tier 2 or below David Lloyd club in London. We’ll agree a suitable location and confirm venue permission, access and availability before booking.</p> <p><a href="' . $fitness_url . '">Explore N118 Fitness <span aria-hidden="true">↗</span></a> and share what you would like support with.</p>',
		],
	];
}
