import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

// NOTE: We did not use React Components for Icons, because
//  you may one to get the config from the server.

// NOTE: First level elements are groups.

export interface LayoutConfig {
  navItems: NavItemConfig[];
}

export const layoutConfig = {
  navItems: [
    {
      key: 'dashboards',
      title: 'Dashboards',
      items: [
        { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'overview' },
        { key: 'clients', title: 'Clients', href: paths.dashboard.clients, icon: 'clients' },
        // { key: 'notifications', title: 'Notifications', href: paths.dashboard.notifications, icon: 'notifications' },
        { key: 'surveys', title: 'Surveys', href: paths.dashboard.surveys, icon: 'surveys' },
        // { key: 'reports', title: 'Reports', href: paths.dashboard.reports, icon: 'reports' },
        // { key: 'tasks', title: 'Tasks', href: paths.dashboard.tasks, icon: 'tasks' },
      ],
    },
    // {
    //   key: 'settings',
    //   title: 'Settings',
    //   items: [
    //     { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'account' },
    //     { key: 'security', title: 'Security', href: paths.dashboard.security, icon: 'security' },
    //     { key: 'info', title: 'Help Center', href: paths.dashboard.info, icon: 'info' },
    //   ],
    // },
  ],
} satisfies LayoutConfig;
