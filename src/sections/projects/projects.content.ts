export interface Project {
  title: string;
  summary: string;
  description: string[];
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
    description: [
      'A company’s marketing site, rebuilt from the ground up as part of a full redesign. It introduces the company and its tech stack, showcases their completed work, and gives prospective clients a way to get in touch.',
      'I delivered it solo - the entire front-end plus a Strapi CMS customized around the site’s content structure, so the team can manage pages and case studies on their own. Built, shipped, and launched to production.',
    ],
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
    description: [
      'Form Builder is a pet project built to provide a complete form-creation platform. The core idea is to allow any registered user to design custom surveys and forms with flexible field types, publish them, and share a public link across various resources to gather the information they need.',
      'Once responses start coming in, the system offers built-in analytics - including visual charts and graphs for multiple-choice questions, making it easy to interpret the collected data at a glance.',
      'The project is at a stable stage with all core features fully functional, and the architecture is designed with future extensibility in mind - ready for additional field types, advanced logic, integrations, and more.',
    ],
    stack: ['React', 'NestJS', 'TypeScript'],
    url: 'https://awesome-form-builder.netlify.app/',
    tags: ['pet project'],
  },
  {
    title: 'Duelmasters',
    summary: 'Gaming & tournament platform with real-time UI and account systems.',
    description: [
      'Duelmasters is a creator-driven esports platform where viewers back streamers and streamers monetize their challenges. It hosts live, skill-based events across multiple game titles, with real-time staking on streamer performance, community-verified results, and instant payouts.',
      'I built complex UI features - interactive match tables, modals, and user-account flows - and maintained end-to-end tests with Puppeteer to keep regressions down, working across GraphQL and REST APIs to move data cleanly between services.',
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'GraphQL', 'Puppeteer'],
    url: 'https://www.duelmasters.io/',
  },
  {
    title: 'Diamore',
    summary: 'Telegram Mini App that grew past 3.5 million users.',
    description: [
      'A Telegram mini-app built for a jewelry brand to grow its audience and reach new buyers, launched at the height of the tap-to-earn craze. Users tap to earn in-app diamonds, complete quests - including subscribing to the brand’s official channels - and can buy and stake NFTs for on-chain rewards. It scaled past 3.5 million users.',
      'As a key front-end contributor, I engineered the quest-progression logic and integrated the TON Connect SDK for in-app wallets, along with third-party services (MyChips, OnClicka) for engagement and monetization. Helped manage production releases through that rapid growth.',
    ],
    stack: ['React', 'Telegram API', 'TON Connect SDK'],
    highlight: '3.5M+ users',
  },
  {
    title: 'Currency converter',
    summary: 'Demo version of the currency exchanger.',
    description: [
      'A demo currency exchange app built for a client, simulating a real app’s flow entirely on the front end - no backend involved. Status transitions run on a fixed 30-second timer, refresh the page to start a new session.',
    ],
    stack: ['React', 'Next.js'],
    url: 'https://minicurrencychanger.netlify.app/',
  },
  {
    title: 'Guided Photo Collection App',
    summary: 'Full-stack app for capturing photo sequences, built from scratch.',
    description: [
      'A full-stack app that guides users through capturing a set of selfies in a specific sequence, built for a client. I developed it end to end - the front-end guide interface plus the back-end API for photo upload, storage, and secure FTP access.',
    ],
    stack: ['React', 'Node.js'],
  },
];
