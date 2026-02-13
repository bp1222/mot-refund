import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Visibility as ViewIcon } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { useNavigate } from '@tanstack/react-router';
import { useFlightStore, useClientStore } from '../../store';

interface AircraftFlightHistoryProps {
  aircraftId: string;
}

export function AircraftFlightHistory({ aircraftId }: AircraftFlightHistoryProps) {
  const navigate = useNavigate();
  const { flights, fuelReceipts } = useFlightStore();
  const { clients } = useClientStore();
  
  // Get flights for this aircraft, sorted by date (most recent first)
  const aircraftFlights = flights
    .filter((f) => f.aircraftId === aircraftId)
    .sort((a, b) => parseISO(b.flightDate).getTime() - parseISO(a.flightDate).getTime());
  
  const getClientName = (clientId: string | undefined) => {
    if (!clientId) return '-';
    const client = clients.find((c) => c.id === clientId);
    return client?.name || 'Unknown';
  };
  
  const getFlightFuelData = (flightId: string) => {
    const receipts = fuelReceipts.filter((r) => r.flightId === flightId);
    const totalLiters = receipts.reduce((sum, r) => sum + r.fuelLiters, 0);
    const totalMOT = receipts.reduce((sum, r) => sum + r.motAmountPaid, 0);
    return { totalLiters, totalMOT, receiptCount: receipts.length };
  };
  
  const handleViewFlight = (flightId: string) => {
    navigate({ to: '/flights/$flightId', params: { flightId } });
  };
  
  // Calculate totals
  const totals = aircraftFlights.reduce(
    (acc, flight) => {
      const fuelData = getFlightFuelData(flight.id);
      return {
        flights: acc.flights + 1,
        fuelLiters: acc.fuelLiters + fuelData.totalLiters,
        motPaid: acc.motPaid + fuelData.totalMOT,
      };
    },
    { flights: 0, fuelLiters: 0, motPaid: 0 }
  );
  
  return (
    <Box>
      {/* Summary */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Total Flights
          </Typography>
          <Typography variant="h6">{totals.flights}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Total Fuel (Liters)
          </Typography>
          <Typography variant="h6">{totals.fuelLiters.toLocaleString()}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Total MOT Paid
          </Typography>
          <Typography variant="h6" color="primary">
            ${totals.motPaid.toFixed(2)}
          </Typography>
        </Box>
      </Box>
      
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Client</TableCell>
              <TableCell align="right">Fuel (L)</TableCell>
              <TableCell align="right">MOT Paid</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aircraftFlights.map((flight) => {
              const fuelData = getFlightFuelData(flight.id);
              return (
                <TableRow key={flight.id} hover>
                  <TableCell>
                    {format(parseISO(flight.flightDate), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {flight.departure} → {flight.arrival}
                    </Typography>
                  </TableCell>
                  <TableCell>{getClientName(flight.clientId)}</TableCell>
                  <TableCell align="right">
                    {fuelData.totalLiters > 0 ? (
                      fuelData.totalLiters.toLocaleString()
                    ) : (
                      <Typography color="text.secondary">-</Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {fuelData.totalMOT > 0 ? (
                      <Typography fontWeight="medium">
                        ${fuelData.totalMOT.toFixed(2)}
                      </Typography>
                    ) : (
                      <Typography color="text.secondary">-</Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Flight Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewFlight(flight.id)}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
            {aircraftFlights.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary" sx={{ py: 2 }}>
                    No flights recorded for this aircraft
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
