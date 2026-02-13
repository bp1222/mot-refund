import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Flight as FlightIcon,
  AirplanemodeActive as AircraftIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  PersonOutline as ClientIcon,
  Assessment as ReportIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from '@tanstack/react-router';

const DRAWER_WIDTH = 240;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Aircraft', path: '/aircraft', icon: <AircraftIcon /> },
  { label: 'Owners', path: '/owners', icon: <PeopleIcon /> },
  { label: 'Management', path: '/management', icon: <BusinessIcon /> },
  { label: 'Clients', path: '/clients', icon: <ClientIcon /> },
  { label: 'Flights', path: '/flights', icon: <FlightIcon /> },
  { label: 'Reports', path: '/reports', icon: <ReportIcon /> },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant: 'permanent' | 'temporary';
}

export function Sidebar({ open, onClose, variant }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleNavigation = (path: string) => {
    navigate({ to: path });
    if (variant === 'temporary') {
      onClose();
    }
  };
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  const drawerContent = (
    <Box>
      <Toolbar />
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path) ? 'inherit' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  
  if (variant === 'permanent') {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }
  
  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
      sx={{
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
