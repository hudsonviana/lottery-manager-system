import {
  DASHBOARD_SIDEBAR_LINKS,
  DASHBOARD_SIDEBAR_BOTTOM_LINKS,
} from '@/consts/Navigation';

const allLinks = [...DASHBOARD_SIDEBAR_LINKS, ...DASHBOARD_SIDEBAR_BOTTOM_LINKS];

const getPaths = (pathname) => {
  const paths = [];
  const pathNames = pathname.split('/').filter(Boolean);

  pathNames.forEach((pathName, index) => {
    const link = allLinks.find((link) => link.path.replace('/', '') === pathName);

    if (link) {
      paths.push({ label: link.label, path: link.path });
    } else {
      const previousLabel = paths[paths.length - 1]?.label || 'Diretório';
      paths.push({
        label: `${previousLabel.slice(0, -1)} ID: ${pathName}`,
        path: `/${pathNames.slice(0, index + 1).join('/')}`,
      });
    }
  });

  return paths;
};

export const breadcrumbLoader = ({ request }) => {
  const url = new URL(request.url); // Obtém o URL atual da requisição
  const pathname = url.pathname; // Extrai o pathname
  return getPaths(pathname); // Calcula os breadcrumbs
};
