import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useFlightStore, useAircraftStore, useClientStore, useAuthStore } from '../../store';
import { flightHasValidCoverage } from '../../utils/documentValidation';
import { FlightForm } from './FlightForm';
import { FuelReceiptForm } from './FuelReceiptForm';
import type { FuelReceipt } from '../../types';

export function FlightDetail() {
  const { flightId } = useParams({ from: '/_authenticated/flights/$flightId' });
  const navigate = useNavigate();
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [receiptFormOpen, setReceiptFormOpen] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState<FuelReceipt | null>(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  
  const { flights, fuelReceipts, deleteFuelReceipt } = useFlightStore();
  const { aircraft, documents } = useAircraftStore();
  const { clients } = useClientStore();
  const { canEdit } = useAuthStore();
  
  const flight = flights.find((f) => f.id === flightId);
  
  if (!flight) {
    return (
      <Box>
        <Button startIcon={<BackIcon />} onClick={() => navigate({ to: '/flights' })}>
          Back to Flights
        </Button>
        <Typography variant="h5" sx={{ mt: 2 }}>
          Flight not found
        </Typography>
      </Box>
    );
  }
  
  const ac = aircraft.find((a) => a.id === flight.aircraftId);
  const client = flight.clientId ? clients.find((c) => c.id === flight.clientId) : null;
  const receipts = fuelReceipts.filter((r) => r.flightId === flightId);
  
  const totalFuelLiters = receipts.reduce((sum, r) => sum + r.fuelLiters, 0);
  const totalReceiptAmount = receipts.reduce((sum, r) => sum + (r.receiptTotal || 0), 0);
  const totalMOT = receipts.reduce((sum, r) => sum + r.motAmountPaid, 0);
  
  // Check document coverage
  const coverage = flightHasValidCoverage(documents, flight);
  
  const handleViewImage = (imageUrl: string) => {
    setViewingImage(imageUrl);
    setImageViewerOpen(true);
  };
  
  const handleAddReceipt = () => {
    setEditingReceipt(null);
    setReceiptFormOpen(true);
  };
  
  const handleEditReceipt = (receipt: FuelReceipt) => {
    setEditingReceipt(receipt);
    setReceiptFormOpen(true);
  };
  
  const handleDeleteReceipt = (id: string) => {
    if (window.confirm('Are you sure you want to delete this receipt?')) {
      deleteFuelReceipt(id);
    }
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate({ to: '/flights' })}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Flight Details
        </Typography>
        {canEdit() && (
          <IconButton onClick={() => setEditFormOpen(true)}>
            <EditIcon />
          </IconButton>
        )}
      </Box>
      
      {!coverage.valid && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          This flight has a document coverage gap. Missing documents for: {coverage.missingTypes.join(', ')}
        </Alert>
      )}
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Flight Date
              </Typography>
              <Typography variant="h6">
                {format(parseISO(flight.flightDate), 'MMMM d, yyyy')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Aircraft
              </Typography>
              <Typography variant="h6">
                <Chip label={ac?.tailNumber || 'Unknown'} color="primary" size="small" />
              </Typography>
              {ac && (
                <Typography variant="body2" color="text.secondary">
                  {ac.make} {ac.model}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Route
              </Typography>
              <Typography variant="h6">
                {flight.departure} → {flight.arrival}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Client
              </Typography>
              <Typography variant="h6">
                {client?.name || 'Not specified'}
              </Typography>
            </Grid>
            {flight.notes && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Notes
                </Typography>
                <Typography variant="body1">{flight.notes}</Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Fuel Receipts</Typography>
            {canEdit() && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddReceipt}
                size="small"
              >
                Add Receipt
              </Button>
            )}
          </Box>
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Receipt #</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell align="right">Fuel (Liters)</TableCell>
                  <TableCell align="right">Receipt Total</TableCell>
                  <TableCell align="right">MOT Paid</TableCell>
                  <TableCell align="center">Image</TableCell>
                  {canEdit() && <TableCell align="right">Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {receipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell>
                      <Chip label={receipt.receiptNumber} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      {format(parseISO(receipt.receiptDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{receipt.vendor || '-'}</TableCell>
                    <TableCell align="right">
                      {receipt.fuelLiters.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      {receipt.receiptTotal ? `$${receipt.receiptTotal.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell align="right">
                      ${receipt.motAmountPaid.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      {receipt.receiptImageUrl ? (
                        <Tooltip title="View Receipt Image">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewImage(receipt.receiptImageUrl!)}
                          >
                            <ImageIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Typography color="text.secondary" variant="caption">-</Typography>
                      )}
                    </TableCell>
                    {canEdit() && (
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEditReceipt(receipt)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteReceipt(receipt.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {receipts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={canEdit() ? 8 : 7} align="center">
                      <Typography color="text.secondary" sx={{ py: 2 }}>
                        No fuel receipts found for this flight
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {receipts.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography fontWeight="bold">Total</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="bold">
                        {totalFuelLiters.toLocaleString()} L
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="bold">
                        ${totalReceiptAmount.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="bold" color="primary">
                        ${totalMOT.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell />
                    {canEdit() && <TableCell />}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      
      <Dialog open={editFormOpen} onClose={() => setEditFormOpen(false)} maxWidth="sm" fullWidth>
        <FlightForm flight={flight} onClose={() => setEditFormOpen(false)} />
      </Dialog>
      
      <Dialog open={receiptFormOpen} onClose={() => setReceiptFormOpen(false)} maxWidth="sm" fullWidth>
        <FuelReceiptForm
          flightId={flightId}
          receipt={editingReceipt}
          onClose={() => {
            setReceiptFormOpen(false);
            setEditingReceipt(null);
          }}
        />
      </Dialog>
      
      {/* Image Viewer Dialog */}
      <Dialog
        open={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Receipt Image</DialogTitle>
        <DialogContent>
          {viewingImage && (
            <Box
              component="img"
              src={viewingImage}
              alt="Receipt"
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '70vh',
                objectFit: 'contain',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
