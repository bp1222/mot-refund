import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import {
  AirplanemodeActive as AircraftIcon,
  Flight as FlightIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useAircraftStore, useOwnerStore, useManagementStore, useClientStore, useFlightStore } from '../../store';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function SummaryCard({ title, value, icon, color }: SummaryCardProps) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ color }}>{icon}</Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export function SummaryCards() {
  const { aircraft } = useAircraftStore();
  const { owners } = useOwnerStore();
  const { companies } = useManagementStore();
  const { clients } = useClientStore();
  const { flights, fuelReceipts } = useFlightStore();
  
  const totalMOT = fuelReceipts.reduce((sum, r) => sum + r.motAmountPaid, 0);
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <SummaryCard
          title="Aircraft"
          value={aircraft.length}
          icon={<AircraftIcon />}
          color="#1976d2"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <SummaryCard
          title="Owners"
          value={owners.length}
          icon={<PeopleIcon />}
          color="#9c27b0"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <SummaryCard
          title="Management Co."
          value={companies.length}
          icon={<BusinessIcon />}
          color="#ed6c02"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <SummaryCard
          title="Clients"
          value={clients.length}
          icon={<PeopleIcon />}
          color="#0288d1"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <SummaryCard
          title="Flights"
          value={flights.length}
          icon={<FlightIcon />}
          color="#2e7d32"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <SummaryCard
          title="Total MOT"
          value={`$${totalMOT.toFixed(2)}`}
          icon={<MoneyIcon />}
          color="#d32f2f"
        />
      </Grid>
    </Grid>
  );
}
