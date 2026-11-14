<template>
  <div class="bg-white">
    <section class="bg-slate-950 px-4 py-16 text-white sm:px-6 md:px-16 md:py-20">
      <div class="mx-auto max-w-3xl">
        <p class="text-sm font-semibold uppercase tracking-[0.22em] text-teal-300">Legal</p>
        <h1 class="mt-3 text-4xl font-bold tracking-tight">Privacy policy</h1>
        <p class="mt-4 text-slate-300">Last updated: {{ lastUpdated }}</p>
      </div>
    </section>

    <article class="prose-policy mx-auto max-w-3xl px-4 py-14 text-base leading-7 text-slate-700 sm:px-6">
      <p>
        This policy explains what personal data the IIIT Dharwad Research Park (IDRP) website at
        idrp.in collects, why, and the choices you have. It is written to meet the Digital Personal
        Data Protection Act, 2023 (DPDP Act).
      </p>

      <h2>Who is responsible</h2>
      <p>
        IIIT Dharwad Research Park, Pi Block, Indian Institute of Information Technology Dharwad,
        Karnataka, India, is the data fiduciary for personal data collected through this website.
        Contact: <a href="mailto:enquiry_idrp@iiitdwd.ac.in">enquiry_idrp@iiitdwd.ac.in</a>.
      </p>

      <h2>What we collect</h2>
      <h3>Information you give us in forms</h3>
      <p>
        When you use a form (contact, partnership, programme, course or workshop application, event
        registration, service enquiry, investor or startup matchmaking, or a job application) we
        collect what you enter: typically your name, e-mail address, phone number, organisation and
        your message, plus the form-specific details it asks for, such as startup stage or links to
        a pitch deck or resume. We also record which page the form was on, the time you sent it and
        that you gave consent.
      </p>
      <h3>Analytics, only with your permission</h3>
      <p>
        If you choose <strong>Allow analytics</strong> in the banner, we load Microsoft Clarity,
        which records how pages are used (clicks, scrolling, page views and device type) to help us
        improve the site. It is not loaded if you decline or have not chosen, and never on the admin
        area. You can change your choice at any time using <strong>Cookie settings</strong> in the
        footer.
      </p>
      <h3>Technical data</h3>
      <p>
        Our servers keep short-lived logs (IP address, time and page requested) to keep the service
        secure and to limit abuse, such as repeated form submissions.
      </p>

      <h2>Why we use it</h2>
      <ul>
        <li>To reply to your enquiry or assess your application, registration or request.</li>
        <li>To arrange the programme, event, course or service you asked about.</li>
        <li>To keep the website secure and prevent spam.</li>
        <li>With your consent, to understand and improve how the website is used.</li>
      </ul>
      <p>
        We process form data on the basis of the consent you give when you tick the consent box. We
        do not sell your data or use it for advertising.
      </p>

      <h2>Where it is stored and who can see it</h2>
      <p>
        Form submissions are stored in IDRP's own database and can be seen only by authorised IDRP
        staff through a password-protected admin panel. If our server is briefly unavailable, a
        submission may instead be delivered to the IDRP team by e-mail through Web3Forms, a form
        relay service. Microsoft processes analytics data for Clarity when you allow it.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep enquiries and applications only as long as needed to respond and to keep a record of
        our programmes, after which they are deleted. You can ask us to delete your data sooner.
      </p>

      <h2>Your rights</h2>
      <p>Under the DPDP Act you can:</p>
      <ul>
        <li>ask for a summary of the personal data we hold about you;</li>
        <li>ask us to correct, complete or update it;</li>
        <li>ask us to erase it, or withdraw your consent at any time;</li>
        <li>nominate another person to exercise these rights on your behalf; and</li>
        <li>raise a grievance with us, and then with the Data Protection Board of India.</li>
      </ul>
      <p>
        To use any of these rights, e-mail
        <a href="mailto:enquiry_idrp@iiitdwd.ac.in">enquiry_idrp@iiitdwd.ac.in</a> with the subject
        "Data request". Withdrawing consent does not affect processing that already happened.
      </p>

      <h2>Children</h2>
      <p>
        This website is intended for adults. If you are under 18, please ask a parent or guardian
        before sending us your details.
      </p>

      <h2>Changes</h2>
      <p>
        We will post any changes to this policy on this page and update the date above.
      </p>
    </article>
  </div>
</template>

<script setup lang="ts">
const lastUpdated = '11 November 2026'
</script>

<style scoped>
.prose-policy h2 {
  margin-top: 2.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: rgb(15 23 42);
}
.prose-policy h3 {
  margin-top: 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: rgb(15 23 42);
}
.prose-policy p,
.prose-policy ul {
  margin-top: 0.75rem;
}
.prose-policy ul {
  list-style: disc;
  padding-left: 1.5rem;
}
.prose-policy a {
  color: var(--color-primary);
  text-decoration: underline;
}
</style>
