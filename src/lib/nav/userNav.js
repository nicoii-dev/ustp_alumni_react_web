// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={25} height={25} />;

const userNav = [
  {
    title: 'Freedom Wall',
    path: '/freedom-wall',
    icon: getIcon('majesticons:home'),
  },
  {
    title: 'Announcements',
    path: '/announcements',
    icon: getIcon('mingcute:announcement-fill'),
  },
  {
    title: 'Job Posting',
    path: '/job-posting',
    icon: getIcon('mdi:work'),
  },
];

export default userNav;
