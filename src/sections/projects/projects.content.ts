export interface Project {
  title: string;
  summary: string;
  description: string;
  stack: string[];
  period?: string;
  highlight?: string;
  url?: string;
  tags?: string[];
  screenshots?: string[];
}

export const projectDetailText = {
  back: '← back to projects',
  visit: 'Visit site ↗',
  noLink: 'Private / client project - no public link.',
} as const;

export const projects: Project[] = [
  {
    title: 'Company Website & CMS',
    summary: 'Company site built solo, frontend to a customized Strapi CMS.',
    description:
      'Single-handedly developed a company website from the ground up, owning the entire frontend and backend CMS integration. Extensively customized Strapi to fit the project’s content structure, then delivered and launched the production-ready site.',
    stack: ['React', 'Next.js', 'Strapi'],
    url: 'https://www.smart-ui.pro/',
    screenshots: [
      '/screenshots/company-website/1.png',
      '/screenshots/company-website/2.png',
      '/screenshots/company-website/3.png',
    ],
  },
  {
    title: 'Form Builder',
    summary: 'Build, publish, and analyze custom forms with real-time response charts.',
    description:
      'Form Builder is a pet project built to provide a complete form-creation platform. The core idea is to allow any registered user to design custom surveys and forms with flexible field types, publish them, and share a public link across various resources to gather the information they need. ' +
      'Once responses start coming in, the system offers built-in analytics - including visual charts and graphs for multiple-choice questions, making it easy to interpret the collected data at a glance. ' +
      'The project is currently at a stable MVP stage with all core features fully functional, and the architecture is designed with future extensibility in mind - ready for additional field types, advanced logic, integrations, and more.',
    stack: ['React', 'NestJS', 'TypeScript'],
    url: 'https://awesome-form-builder.netlify.app/',
    tags: ['pet project'],
  },
  {
    title: 'Duelmasters',
    summary: 'Gaming & tournament platform with real-time UI and account systems.',
    description:
      'Contributed complex UI features to a gaming and tournament platform - interactive tables, modals, and user account systems. Maintained end-to-end tests with Puppeteer to cut regression bugs, and worked with GraphQL and REST APIs to keep data flowing cleanly between services.',
    stack: ['React', 'Next.js', 'TypeScript', 'GraphQL', 'Puppeteer'],
    url: 'https://www.duelmasters.io/',
  },
  {
    title: 'Diamore',
    summary: 'Telegram Mini App that grew past 3.5 million users.',
    description:
      'Key front-end contributor to a Telegram-based game. Engineered quest progression logic and integrated third-party services (MyChips, OnClicka) to boost engagement and monetization. Integrated the TON Connect SDK for wallet functionality and helped manage production releases through rapid scaling.',
    stack: ['React', 'Telegram API', 'TON Connect SDK'],
    highlight: '3.5M+ users',
  },
  {
    title: 'Currency converter',
    summary: 'Demo version of the currency exchanger.',
    description:
      'A demo currency exchange app built for a client, simulating a real app’s flow entirely on the front end - no backend involved. Status transitions run on a fixed 30-second timer, refresh the page to start a new session.',
    stack: ['React', 'Next.js'],
    url: 'https://minicurrencychanger.netlify.app/',
  },
  {
    title: 'Guided Photo Collection App',
    summary: 'Full-stack app for capturing photo sequences, built from scratch.',
    description:
      'Built a full-stack application for a guided selfie collection process, enabling users to capture photos in a specific sequence. Implemented both the front-end guide interface and the back-end API for photo upload, storage, and secure FTP access for the client.',
    stack: ['React', 'Node.js'],
  },
];
