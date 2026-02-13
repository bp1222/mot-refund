import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Box,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { useNavigate } from '@tanstack/react-router';
import { useFlightStore, useAircraftStore } from '../../store';

export function RecentFlights() {
  const navigate = useNavigate();
  const { flights, fuelReceipts } = useFlightStore();
  const { aircraft } = useAircraftStore();
  
  // Get the 5 most recent flights
  const recentFlights = [...flights]
    .sort((a, b) => parseISO(b.flightDate).getTime() - parseISO(a.flightDate).getTime())
    .slice(0, 5);
  
  const getAircraftTail = (aircraftId: string) => {
    const ac = aircraft.find((a) => a.id === aircraftId);
    return ac?.tailNumber || 'Unknown';
  };
  
  const getTotalMOT = (flightId: string) => {
    return fuelReceipts
      .filter((r) => r.flightId === flightId)
      .reduce((sum, r) => sum + r.motAmountPaid, 0);
  };
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Recent Flights</Typography>
          <Button size="small" onClick={() => navigate({ to: '/flights' })}>
            View All
          </Button>
        </Box>
        
        {recentFlights.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No flights recorded yet
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Aircraft</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell align="right">MOT</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentFlights.map((flight) => {
                  const mot = getTotalMOT(flight.id);
                  return (
                    <TableRow
                      key={flight.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate({ to: '/flights/$flightId', params: { flightId: flight.id } })}
                    >
                      <TableCell>
                        {format(parseISO(flight.flightDate), 'MMM d')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getAircraftTail(flight.aircraftId)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {flight.departure} → {flight.arrival}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {mot > 0 ? (
                          <Typography fontWeight="medium" color="primary">
                            ${mot.toFixed(2)}
                          </Typography>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}
