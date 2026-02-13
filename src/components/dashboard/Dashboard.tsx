import { Box, Typography, Grid } from '@mui/material';
import { SummaryCards } from './SummaryCards';
import { DocumentAlerts } from './DocumentAlerts';
import { RecentFlights } from './RecentFlights';
import { useAuthStore } from '../../store';

export function Dashboard() {
  const { user } = useAuthStore();
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user?.name}
        </Typography>
      </Box>
      
      <SummaryCards />
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} lg={6}>
          <DocumentAlerts />
        </Grid>
        <Grid item xs={12} lg={6}>
          <RecentFlights />
        </Grid>
      </Grid>
    </Box>
  );
}
