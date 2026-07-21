/**
 * Section-specific type + data. `Project` is only meaningful inside this
 * section, so it lives here rather than in shared/types.
 */
export interface Project {
  title: string;
  /** one-line summary shown on the card */
  summary: string;
  /** longer copy shown in the detail view */
  description: string;
  stack: string[];
  period?: string;
  /** standout stat shown as a badge, e.g. "3.5M+ users" */
  highlight?: string;
  /** absent → private/client work, rendered without a link. Presence/absence
   * also drives the automatic "public"/"private" card badge. */
  url?: string;
  /** extra badges shown next to the public/private one, e.g. ["pet project"] */
  tags?: string[];
  /** path under /public, absent → placeholder block */
  screenshot?: string;
}

/**
 * Real projects from the résumé. No public URLs yet (client/private work) —
 * add `url`/`screenshot` here once available.
 */
export const projects: Project[] = [
  {
    title: 'Duelmasters',
    summary: 'Gaming & tournament platform with real-time UI and account systems.',
    description:
      'Contributed complex UI features to a gaming and tournament platform - interactive tables, modals, and user account systems. Maintained end-to-end tests with Puppeteer to cut regression bugs, and worked with GraphQL and REST APIs to keep data flowing cleanly between services.',
    stack: ['React', 'Next.js', 'TypeScript', 'GraphQL', 'REST APIs', 'Puppeteer'],
    // period: '2023 – 2025',
    url: 'https://www.duelmasters.io/',
  },
  {
    title: 'Diamore',
    summary: 'Telegram Mini App that grew past 3.5 million users.',
    description:
      'Key front-end contributor to a Telegram-based game. Engineered quest progression logic and integrated third-party services (MyChips, OnClicka) to boost engagement and monetization. Integrated the TON Connect SDK for wallet functionality and helped manage production releases through rapid scaling.',
    stack: ['React', 'Telegram API', 'TON Connect SDK'],
    highlight: '3.5M+ users',
    // period: '2023 – 2025',
  },
  {
    title: 'Guided Photo Collection App',
    summary: 'Full-stack app for capturing photo sequences, built from scratch.',
    description:
      'Built a full-stack application for a guided selfie collection process, enabling users to capture photos in a specific sequence. Implemented both the front-end guide interface and the back-end API for photo upload, storage, and secure FTP access for the client.',
    stack: ['React', 'Node.js'],
    // period: '2023 – 2025',
  },
  {
    title: 'Company Website & CMS',
    summary: 'Company site built solo, frontend to a customized Strapi CMS.',
    description:
      'Single-handedly developed a company website from the ground up, owning the entire frontend and backend CMS integration. Extensively customized Strapi to fit the project’s content structure, then delivered and launched the production-ready site.',
    stack: ['React', 'Next.js', 'Strapi'],
    // period: '2023 – 2025',
    url: 'https://www.smart-ui.pro/',
  },
  {
    title: 'Currency converter',
    summary: 'Demo version of the currency exchanger.',
    description:
      'A demo currency exchange app built for a client, simulating a real app’s flow entirely on the front end - no backend involved. Status transitions run on a fixed 30-second timer, refresh the page to start a new session.',
    stack: ['React', 'Next.js'],
    // period: '2023 – 2025',
    url: 'https://minicurrencychanger.netlify.app/',
  },
];
