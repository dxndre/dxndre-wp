<?php
/**
 * Template Name: Page (FAQs)
 * Description: Editorial frequently asked questions with native accessible accordions.
 */
require_once get_theme_file_path('inc/faq.php');
get_header();
$faq_items = dx_faq_items();
?>
<article class="dx-faq-editorial" id="faq-top">
	<section class="dx-faq-hero" aria-labelledby="dx-faq-title">
		<p class="dx-eyebrow">A little clarity / Before the next step</p>
		<h1 id="dx-faq-title">FAQs<span aria-hidden="true">.</span><span class="visually-hidden"> Frequently asked questions</span></h1>
		<div class="dx-faq-hero__portrait" aria-hidden="true"><img src="<?php echo esc_url(get_theme_file_uri('assets/img/portrait-editorial.png')); ?>" alt="" width="1122" height="1390" fetchpriority="high" decoding="async"></div>
		<div class="dx-faq-hero__intro"><p>Good questions.<br>Clear answers.</p><a class="dx-cta dx-cta--outline" href="#faq-answers">Find your answer <span aria-hidden="true">↘</span></a></div>
		<p class="dx-faq-hero__caption">Design · Development · Photography · Fitness</p>
	</section>
	<section class="dx-faq-answers" id="faq-answers" aria-labelledby="dx-faq-answers-title">
		<div class="dx-faq-answers__intro"><p class="dx-eyebrow">The details / Made straightforward</p><h2 id="dx-faq-answers-title">Before we<br><em>get started.</em></h2><p>From choosing a service to planning the next step, here are a few useful things to know.</p><a class="dx-faq-text-link" href="<?php echo esc_url(home_url('/contact/')); ?>">Have another question? <span aria-hidden="true">↗</span></a></div>
		<div class="dx-faq-list">
			<?php foreach ($faq_items as $index => $item) : ?>
			<details class="dx-faq-item" id="faq-<?php echo esc_attr($item['id']); ?>"<?php echo $index === 0 ? ' open' : ''; ?>>
				<summary><span class="dx-faq-number" aria-hidden="true"><?php echo esc_html(str_pad($index + 1, 2, '0', STR_PAD_LEFT)); ?></span><span class="dx-faq-question"><?php echo esc_html($item['question']); ?></span><span class="dx-faq-toggle" aria-hidden="true"></span></summary>
				<div class="dx-faq-answer"><?php echo wp_kses_post($item['answer']); ?></div>
			</details>
			<?php endforeach; ?>
		</div>
	</section>
	<section class="dx-faq-contact" aria-labelledby="dx-faq-contact-title"><div><p class="dx-eyebrow">Still curious?</p><h2 id="dx-faq-contact-title">Let’s talk<br><em>it through.</em></h2></div><div><p>Every brief starts with a conversation. Tell me what you have in mind and we’ll work out the next step together.</p><a class="dx-cta" href="<?php echo esc_url(home_url('/contact/')); ?>">Start a conversation <span aria-hidden="true">↗</span></a></div></section>
</article>
<?php get_footer(); ?>
