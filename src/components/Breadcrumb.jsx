import { IoChevronForward } from 'react-icons/io5';
import { Link, useLocation } from 'react-router-dom';
import {
  DASHBOARD_SIDEBAR_LINKS,
  DASHBOARD_SIDEBAR_BOTTOM_LINKS,
} from '@/consts/Navigation';

const allLinks = [...DASHBOARD_SIDEBAR_LINKS, ...DASHBOARD_SIDEBAR_BOTTOM_LINKS];

const getPaths = (pathNames) => {
  const paths = [];
  pathNames.filter(Boolean).forEach((pathName, index) => {
    const link = allLinks.find((link) => link.path.replace('/', '') === pathName);

    if (link) {
      paths.push({ label: link.label, path: link.path });
    } else {
      const previousLabel = paths[paths.length - 1]?.label || 'Diretório';
      paths.push({
        label: `${previousLabel.slice(0, -1)} ID: ${pathName}`,
        path: `/${pathNames.slice(1, index + 2).join('/')}`,
      });
    }
  });

  return paths;
};

const Breadcrumb = () => {
  const location = useLocation();
  const pathNames = location.pathname.split('/');
  const paths = getPaths(pathNames);

  return (
    <nav className="flex items-center" aria-label="Breadcrumb">
      {paths.map((path, index) => (
        <div key={index} className="flex items-center text-sm">
          {index !== 0 && (
            <span className="text-gray-500 mx-2">
              <IoChevronForward />
            </span>
          )}
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
