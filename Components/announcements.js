/* ══════════════════════════════════════════════════════
   RGIL ANNOUNCEMENTS — only edit this file for updates
   ══════════════════════════════════════════════════════

   TICKER_ITEMS  → scrolling bar at the top
   NOTICE_ITEMS  → "Notices & Circulars" panel
   EVENT_ITEMS   → "Events & Activities" panel

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


/* ── NOTICES & CIRCULARS (left panel) ── */
const NOTICE_ITEMS = [
  {
    date: "May 15",
    text: "Guest Lecture by Hon. Justice (Retd.) K. Ramakrishna on Constitutional Law",
    badge: "New",
    type: "link",
    href: "notices.html"
  },
  {
    date: "May 10",
    text: "Semester III Examination Results Declared — Check Portals",
    badge: "",
    type: "download",
    href: "assets/sem3-results.pdf"
  },
  {
    date: "May 05",
    text: "Moot Court National Competition — Team Selection on May 8",
    badge: "",
    type: "link",
    href: "notices.html"
  },
  {
    date: "Apr 28",
    text: "Legal Aid Camp at Ramanayyapeta — Volunteer Registrations Open",
    badge: "Ongoing",
    type: "text"
  },
  {
    date: "Apr 20",
    text: "Annual Sports Day — Schedule Released",
    badge: "",
    type: "download",
    href: "assets/sports-day-schedule.pdf"
  },
  {
    date: "june 20",
    text: "new formation line",
    type:"link",
    href:"notices.html"
  }
];


/* ── EVENTS & ACTIVITIES (right panel) ── */
const EVENT_ITEMS = [
  {
    date: "Jun 01",
    text: "Admissions Commence — 2025–26 Batch",
    badge: "New",
    type: "link",
    href: "admissions.html"
  },
  {
    date: "May 20",
    text: "HRC Visit — High Court of Andhra Pradesh, Amaravati",
    badge: "",
    type: "text"
  },
  {
    date: "May 18",
    text: "NSS Camp — Village Adoption Programme, Kakinada Rural",
    badge: "",
    type: "text"
  },
  {
    date: "May 12",
    text: "Central Prison Visit — Criminal Justice Field Study",
    badge: "",
    type: "text"
  },
  {
    date: "May 02",
    text: "Inter-Collegiate Debate Competition — Results Announced",
    badge: "",
    type: "download",
    href: "assets/debate-results.pdf"
  },
  

];