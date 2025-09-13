import { Breadcrumbs, Typography, Link } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const BreadcrumbsBar = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return isLast ? (
          <Link
            component={RouterLink}
            underline="hover"
            color="text.primary"
            to={to}
            key={to}
            sx={{fontSize: '14px'}}
          >
            {capitalize(value)}
          </Link>
        ) : (
          <Link
            component={RouterLink}
            underline="hover"
            color="inherit"
            to={to}
            key={to}
            sx={{fontSize: '14px'}}
          >
            {capitalize(value)}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbsBar;
