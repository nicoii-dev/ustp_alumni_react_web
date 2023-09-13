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
    title: 'Users',
    path: '/users',
    icon: getIcon('ph:users-three-bold'),
  },
  {
    title: 'Browse',
    path: '/home',
    icon: getIcon('material-symbols:home-pin'),
  },
];

export default adminNav;
