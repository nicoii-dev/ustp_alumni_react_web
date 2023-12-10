// component
import Iconify from "../../components/Iconify";
// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const adminNav = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'Freedom Wall',
    path: '/freedom-wall',
    icon: getIcon('ic:outline-message'),
  },
  {
    title: 'Announcements',
    path: '/announcements',
    icon: getIcon('grommet-icons:announce'),
  },
  {
    title: 'Alumni List',
    path: '/alumni-list',
    icon: getIcon('fa-solid:user-graduate'),
  },
  {
    title: 'Job Posting',
    path: '/job-posting',
    icon: getIcon('cib:when-i-work'),
  },
  {
    title: 'Users List',
    path: '/users',
    icon: getIcon('fa-solid:users'),
  },
  // {
  //   title: 'System Settings',
  //   icon: getIcon('ep:tools'),
  //   children: [
  //     {
  //       title: 'Users List',
  //       path: '/users'
  //     },
  //     {
  //       title: 'Reports',
  //       path: '#'
  //     },
  //   ]
  // }
];

export default adminNav;
