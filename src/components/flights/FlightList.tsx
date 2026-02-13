import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { useNavigate } from '@tanstack/react-router';
import { useFlightStore, useAircraftStore, useClientStore, useAuthStore } from '../../store';
import { FlightForm } from './FlightForm';
import type { Flight } from '../../types';

export function FlightList() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  
  const navigate = useNavigate();
  const { flights, fuelReceipts, deleteFlight } = useFlightStore();
  const { aircraft } = useAircraftStore();
  const { clients } = useClientStore();
  const { canEdit } = useAuthStore();
  
  const handleAdd = () => {
    setEditingFlight(null);
    setFormOpen(true);
  };
  
  const handleEdit = (flight: Flight) => {
    setEditingFlight(flight);
    setFormOpen(true);
  };
  
  const handleView = (flightId: string) => {
    navigate({ to: '/flights/$flightId', params: { flightId } });
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this flight? This will also delete associated fuel receipts.')) {
      deleteFlight(id);
    }
  };
  
  const handleFormClose = () => {
    setFormOpen(false);
    setEditingFlight(null);
  };
  
  const getAircraftTail = (aircraftId: string) => {
    const ac = aircraft.find((a) => a.id === aircraftId);
    return ac?.tailNumber || 'Unknown';
  };
  
  const getClientName = (clientId: string | undefined) => {
    if (!clientId) return '-';
    const client = clients.find((c) => c.id === clientId);
    return client?.name || 'Unknown';
  };
  
  const getReceiptCount = (flightId: string) => {
    return fuelReceipts.filter((r) => r.flightId === flightId).length;
  };
  
  const getTotalMOT = (flightId: string) => {
    return fuelReceipts
      .filter((r) => r.flightId === flightId)
      .reduce((sum, r) => sum + r.motAmountPaid, 0);
  };
  
  // Sort flights by date, most recent first
  const sortedFlights = [...flights].sort(
    (a, b) => parseISO(b.flightDate).getTime() - parseISO(a.flightDate).getTime()
  );
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Flights</Typography>
        {canEdit() && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Flight
          </Button>
        )}
      </Box>
      
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Aircraft</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Receipts</TableCell>
                  <TableCell>MOT Paid</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedFlights.map((flight) => {
                  const receiptCount = getReceiptCount(flight.id);
                  const totalMOT = getTotalMOT(flight.id);
                  return (
                    <TableRow key={flight.id} hover>
                      <TableCell>
                        {format(parseISO(flight.flightDate), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getAircraftTail(flight.aircraftId)}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {flight.departure} → {flight.arrival}
                        </Typography>
                      </TableCell>
                      <TableCell>{getClientName(flight.clientId)}</TableCell>
                      <TableCell>
                        <Chip
                          icon={<ReceiptIcon />}
                          label={receiptCount}
                          size="small"
                          color={receiptCount > 0 ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        {totalMOT > 0 ? (
                          <Typography fontWeight="medium">
                            ${totalMOT.toFixed(2)}
                          </Typography>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleView(flight.id)}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        {canEdit() && (
                          <>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => handleEdit(flight)}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(flight.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {flights.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary" sx={{ py: 4 }}>
                        No flights found. Add your first flight to get started.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      
      <Dialog open={formOpen} onClose={handleFormClose} maxWidth="sm" fullWidth>
        <FlightForm flight={editingFlight} onClose={handleFormClose} />
      </Dialog>
    </Box>
  );
}
