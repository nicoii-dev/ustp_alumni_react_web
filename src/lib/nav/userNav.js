// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={25} height={25} />;

const userNav = [
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
    title: 'Job Posting',
    path: '/job-posting',
    icon: getIcon('cib:when-i-work'),
  },
];

export default userNav;
