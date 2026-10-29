<?php
/**
 * Template Name: Page (CV)
 * Description: Editorial career profile and readable curriculum vitae.
 */
get_header();
$cv = json_decode(file_get_contents(get_theme_file_path('inc/cv-content.json')), true);
usort($cv['experience'], fn($a, $b) => (int)str_contains($b['role'], 'Freelance') <=> (int)str_contains($a['role'], 'Freelance'));
$cv_pdf = dxndre_cv_pdf_url();
?>
<article class="cv-experience" id="cv-top">
  <section class="cv-hero" aria-labelledby="cv-name">
    <div class="cv-hero__portrait"><img src="<?php echo esc_url(get_theme_file_uri('assets/img/headshot.webp')); ?>" alt="D’André Phillips" fetchpriority="high" width="2216" height="3936"></div>
    <div class="cv-wrap cv-hero__inner">
      <div class="cv-hero__copy">
        <p class="cv-kicker">Curriculum vitae <span>·</span> London, UK</p>
        <h1 id="cv-name">D’André<br><span>Phillips.</span></h1>
        <?php $status = function_exists('get_field') ? get_field('employer_availability', (int)get_option('page_on_front')) : ''; $labels = ['available'=>'Available to hire', 'casual'=>'Open to opportunities', 'unavailable'=>'Not currently looking']; if(isset($labels[$status])): ?><p class="availability-badge is-<?php echo esc_attr($status); ?>"><?php echo esc_html($labels[$status]); ?></p><?php endif; ?>
<p class="cv-hero__role">Senior Web Developer · WordPress &amp; Modern Front-End Specialist</p>
        <p class="cv-hero__intro">Design-led thinking.<br>Engineering that delivers.</p>
        <p class="cv-hero__summary">Over a decade building thoughtful, high-performance digital experiences — across agencies, in-house teams and independent projects.</p>
        <div class="cv-actions"><a class="cv-button cv-button--solid" href="#cv-experience">Explore my experience <span aria-hidden="true">↓</span></a><a class="cv-button" href="<?php echo esc_url($cv_pdf); ?>" download data-cv-download>Download CV <span aria-hidden="true">↧</span></a></div>
        <div class="cv-hero__links"><a href="mailto:dandrephillips@outlook.com"><i class="fa-regular fa-envelope" aria-hidden="true"></i><span class="visually-hidden">Email me</span></a><a href="https://linkedin.com/in/dxndre" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in" aria-hidden="true"></i></a><a href="<?php echo esc_url(home_url('/portfolio/')); ?>">Selected work ↗</a></div>
      </div>
      <p class="cv-hero__caption">The person behind the pixels.</p>
    </div>
    <div class="cv-hero__foot cv-wrap"><span>WordPress engineering / Front-end development</span><a href="#cv-profile">Scroll to discover <span aria-hidden="true">↓</span></a></div>
  </section>
  <nav class="cv-nav" aria-label="CV sections"><div class="cv-wrap"><a href="#cv-profile">01 <span>Profile</span></a><a href="#cv-experience">02 <span>Experience</span></a><a href="#cv-expertise">03 <span>Expertise</span></a><a href="#cv-education">04 <span>Education</span></a><a href="<?php echo esc_url($cv_pdf); ?>" download data-cv-download class="cv-nav__pdf">PDF <span aria-hidden="true">↧</span></a></div></nav>
  <div class="cv-wrap">
    <section id="cv-profile" class="cv-section cv-profile" aria-labelledby="cv-profile-title">
      <div class="cv-section__label"><p class="cv-kicker">01 / Profile</p><h2 id="cv-profile-title">A developer’s precision.<br>A designer’s eye.</h2></div>
      <div><p class="cv-lead"><?php echo esc_html($cv['summary']); ?></p>
        <dl class="cv-facts"><div><dt>10+</dt><dd>Years of experience</dd></div><div><dt>WordPress</dt><dd>Multi-region platforms &amp; intuitive CMS experiences</dd></div><div><dt>End to end</dt><dd>Discovery, delivery &amp; ongoing optimisation</dd></div></dl>
      </div>
    </section>
    <section id="cv-experience" class="cv-section" aria-labelledby="cv-experience-title">
      <div class="cv-section__label"><p class="cv-kicker">02 / Experience</p><h2 id="cv-experience-title">The work.<br>The progression.</h2><p class="cv-aside-note">Agency, in-house and independent.<br>A career built through delivery.</p><a class="cv-text-link" href="<?php echo esc_url(home_url('/portfolio/')); ?>">See selected projects ↗</a></div>
      <div class="cv-timeline">
        <?php foreach ($cv['experience'] as $i => $job) : ?>
          <article class="cv-role<?php echo $i === 0 ? ' cv-role--lead' : ''; ?>">
            <p class="cv-role__period"><?php echo esc_html($job['period']); ?><?php if ($i === 0) : ?><span>Current independent practice</span><?php endif; ?></p>
            <h3><?php echo esc_html($job['role']); ?></h3><p class="cv-role__company"><?php echo esc_html($job['company']); ?></p>
            <ul><?php foreach ($job['bullets'] as $bullet) : ?><li><?php echo esc_html($bullet); ?></li><?php endforeach; ?></ul>
            <?php if ($job['company'] === 'Ohme EV') : ?><a class="cv-text-link" href="<?php echo esc_url(home_url('/project/ohme-ev/')); ?>">Explore the Ohme project ↗</a><?php endif; ?>
          </article>
        <?php endforeach; ?>
        <div class="cv-earlier"><h3>Earlier roles &amp; foundations</h3><?php foreach ($cv['earlier'] as $job) : ?><article><p class="cv-role__period"><?php echo esc_html($job['period']); ?></p><h4><?php echo esc_html($job['role']); ?></h4><p><?php echo esc_html($job['company']); ?></p></article><?php endforeach; ?><p class="cv-aside-note">Further information on these positions is available on request.</p></div>
        <div class="cv-additional" id="cv-additional"><h3>Additional Non-Industry Experience</h3>
          <?php foreach ($cv['additional'] ?? [] as $job) : ?>
          <article class="cv-role">
            <p class="cv-role__period"><?php echo esc_html($job['period']); ?></p>
            <h3><?php echo esc_html($job['role']); ?></h3>
            <p class="cv-role__company"><?php echo esc_html($job['company']); ?></p>
            <?php if ($job['bullets']) : ?><ul><?php foreach ($job['bullets'] as $bullet) : ?><li><?php echo esc_html($bullet); ?></li><?php endforeach; ?></ul><?php endif; ?>
          </article>
          <?php endforeach; ?>
        </div>

      </div>
    </section>
    <section id="cv-expertise" class="cv-section" aria-labelledby="cv-expertise-title">
      <div class="cv-section__label"><p class="cv-kicker">03 / Expertise</p><h2 id="cv-expertise-title">From the interface<br>to the infrastructure.</h2><p class="cv-aside-note">The tools, systems and practices<br>behind the finished experience.</p></div>
      <div class="cv-skills"><?php foreach ($cv['skills'] as $i => $skill) : ?><article><span class="cv-skill-index" aria-hidden="true"><?php echo esc_html(str_pad($i+1,2,'0',STR_PAD_LEFT)); ?></span><div><h3><?php echo esc_html($skill['title']); ?></h3><p><?php echo esc_html($skill['text']); ?></p></div></article><?php endforeach; ?></div>
    </section>
    <section id="cv-education" class="cv-section" aria-labelledby="cv-education-title">
      <div class="cv-section__label"><p class="cv-kicker">04 / Education</p><h2 id="cv-education-title">Built on<br>strong foundations.</h2></div>
      <div class="cv-education"><?php foreach ($cv['education'] as $study) : ?><article><p class="cv-role__period"><?php echo esc_html($study['period']); ?></p><h3><?php echo esc_html($study['title']); ?></h3><p><?php echo esc_html($study['institution']); ?><?php if ($study['grade']) : ?><span class="cv-grade"><?php echo esc_html($study['grade']); ?></span><?php endif; ?></p></article><?php endforeach; ?></div>
    </section>
    <section class="cv-interests" aria-labelledby="cv-interests-title"><p class="cv-kicker">Beyond the screen</p><h2 id="cv-interests-title">Curiosity doesn’t clock off.</h2><ul><?php foreach ($cv['interests'] as $interest) : ?><li><?php echo esc_html($interest); ?></li><?php endforeach; ?></ul><div class="cv-hero__links"><a href="<?php echo esc_url(home_url('/buses/')); ?>">The bus enthusiast ↗</a><a href="<?php echo esc_url(home_url('/fitness/')); ?>">The fitness journey ↗</a></div></section>
    <section class="cv-contact" aria-labelledby="cv-contact-title">
      <div><p class="cv-kicker">The next chapter</p><h2 id="cv-contact-title">Let’s build<br>something meaningful.</h2></div>
      <div>
        <p>Have a role or a project in mind?<br>I’d love to hear about it.</p>
        <div class="cv-contact__emails">
          <a class="cv-text-link cv-contact__email" href="mailto:hello@dxndre.co.uk">hello@dxndre.co.uk <span aria-hidden="true">↗</span></a>
          <a class="cv-text-link cv-contact__email" href="mailto:dandrephillips@outlook.com">dandrephillips@outlook.com <span aria-hidden="true">↗</span></a>
        </div>
        <div class="cv-actions">
          <a class="cv-button cv-button--solid" href="<?php echo esc_url($cv_pdf); ?>" download data-cv-download>Download CV <svg class="cv-download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M8.5 12h7M8.5 15.5h7"/></svg></a>
          <a class="cv-button" href="https://linkedin.com/in/dxndre" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in" aria-hidden="true"></i></a>
        </div>
      </div>
    </section>
  </div>
</article>
<?php get_footer(); ?>
