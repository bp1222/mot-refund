import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Flight as FlightIcon,
  RestartAlt as ResetIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore, useSeedStore } from '../../store';

interface NavbarProps {
  onMenuClick: () => void;
  showMenuButton: boolean;
}

export function Navbar({ onMenuClick, showMenuButton }: NavbarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  
  const navigate = useNavigate();
  const { user, logout, canAdmin } = useAuthStore();
  const { resetToSeedData } = useSeedStore();
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate({ to: '/login' });
  };
  
  const handleResetClick = () => {
    handleMenuClose();
    setResetDialogOpen(true);
  };
  
  const handleResetConfirm = () => {
    resetToSeedData();
    setResetDialogOpen(false);
    navigate({ to: '/login' });
  };
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'administrator':
        return 'error';
      case 'data-entry':
        return 'primary';
      case 'viewer':
        return 'default';
      default:
        return 'default';
    }
  };
  
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'administrator':
        return 'Admin';
      case 'data-entry':
        return 'Data Entry';
      case 'viewer':
        return 'Viewer';
      default:
        return role;
    }
  };
  
  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {showMenuButton && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={onMenuClick}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <FlightIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 2 }}>
            MOT Refund System
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {canAdmin() && (
            <Button
              color="inherit"
              startIcon={<ResetIcon />}
              onClick={handleResetClick}
              sx={{ mr: 2 }}
            >
              Reset Data
            </Button>
          )}
          
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip
                label={getRoleLabel(user.role)}
                color={getRoleColor(user.role) as any}
                size="small"
                sx={{ mr: 2 }}
              />
              
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                edge="end"
              >
                <AccountCircle />
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    Signed in as
                  </Typography>
                </MenuItem>
                <MenuItem disabled>
                  <Typography variant="body1" fontWeight="medium">
                    {user.name}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                  Sign Out
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Reset Confirmation Dialog */}
      <Dialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
      >
        <DialogTitle>Reset All Data?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will clear all current data and restore the original seed data.
            You will be logged out and need to sign in again.
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleResetConfirm} color="error" variant="contained">
            Reset Data
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
