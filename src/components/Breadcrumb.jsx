import { Link, useLocation } from 'react-router-dom';
import {
  DASHBOARD_SIDEBAR_LINKS,
  DASHBOARD_SIDEBAR_BOTTOM_LINKS,
} from '@/consts/Navigation';

const allLinks = [...DASHBOARD_SIDEBAR_LINKS, ...DASHBOARD_SIDEBAR_BOTTOM_LINKS];

const getPathlable = (pathNames) =>
  pathNames.filter(Boolean).map(
    (pathName) =>
      allLinks.find((link) => link.path.replace('/', '') === pathName) || {
        label: pathName,
        path: pathName,
      }
  );

const Breadcrumb = () => {
  const location = useLocation();
  const pathNames = location.pathname.split('/');
  const paths = getPathlable(pathNames);

  return (
    <nav className="flex items-center" aria-label="Breadcrumb">
      {paths.map((path, index) => (
        <div key={index} className="flex items-center text-sm">
          {index !== 0 && <span className="text-gray-500 mx-2">/</span>}
          {index === paths.length - 1 ? (
            <span className="text-gray-700">{path.label}</span>
          ) : (
            <Link to={path.path} className="text-blue-600 hover:underline">
              {path.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
