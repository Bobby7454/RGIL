/* ══════════════════════════════════════════════════════
   RGIL ANNOUNCEMENTS — only edit this file for updates
   ══════════════════════════════════════════════════════

   TICKER_ITEMS  → scrolling bar at the top

   item types:
     type: "link"     → clicks go to a page
     type: "download" → clicks download a file/PDF
     type: "text"     → no click, plain announcement

   badges:
     badge: "New"     → shows gold "New" tag
     badge: "Ongoing" → shows gold "Ongoing" tag
     badge: ""        → no tag (just leave it out)
══════════════════════════════════════════════════════ */


/* ── TICKER (scrolling bar) ── */
const TICKER_ITEMS = [
  {
    type: "link",
    text: "Admissions Open for 2025–26 Academic Year — Apply Now",
    href: "admissions.html"
  },
  {
    type: "download",
    text: "National Moot Court Competition — Download Brochure",
    href: "assets/moot-court-brochure.pdf"
  },
  {
    type: "link",
    text: "Legal Aid Camp at Ramanayyapeta — Community Service Initiative",
    href: "events.html#legal-aid"
  },
  {
    type: "download",
    text: "Results for Semester III Declared — Download Results PDF",
    href: "assets/sem3-results.pdf"
  },
  {
    type: "link",
    text: "Guest Lecture by Hon. Justice (Retd.) K. Ramakrishna — 15 May 2025",
    href: "notices.html"
  },
  {
    type: "text",
    text: "College closed on 14 April for Dr. Ambedkar Jayanti"
  },
  {
    type: "text",
    text: "College closed on 1st may for may day"
  }
];
