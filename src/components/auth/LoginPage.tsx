import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  Container,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Flight as FlightIcon,
  AdminPanelSettings as AdminIcon,
  Edit as EditIcon,
  Visibility as ViewerIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../store';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate network delay for UX
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const success = login(username, password);
    
    if (success) {
      navigate({ to: '/' });
    } else {
      setError('Invalid username or password');
    }
    
    setIsLoading(false);
  };
  
  const handleQuickLogin = async (user: string, pass: string) => {
    setError('');
    setIsLoading(true);
    
    const success = login(user, pass);
    
    if (success) {
      navigate({ to: '/' });
    } else {
      setError('Login failed. Try resetting the browser localStorage.');
    }
    
    setIsLoading(false);
  };
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={8}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <FlightIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="h1" fontWeight="bold">
                MOT Refund System
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Aviation Fuel Tax Tracking & Refund Management
              </Typography>
            </Box>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {/* Quick Demo Login Buttons */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom align="center">
                Quick Demo Login
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center">
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<AdminIcon />}
                  onClick={() => handleQuickLogin('admin', 'admin123')}
                  disabled={isLoading}
                  size="small"
                >
                  Admin
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => handleQuickLogin('dataentry', 'data123')}
                  disabled={isLoading}
                  size="small"
                >
                  Data Entry
                </Button>
                <Button
                  variant="contained"
                  color="inherit"
                  startIcon={<ViewerIcon />}
                  onClick={() => handleQuickLogin('viewer', 'view123')}
                  disabled={isLoading}
                  size="small"
                >
                  Viewer
                </Button>
              </Stack>
            </Box>
            
            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" color="text.secondary">
                or sign in manually
              </Typography>
            </Divider>
            
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                required
                autoComplete="username"
              />
              
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="outlined"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
