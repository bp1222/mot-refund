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
  Chip,
  Dialog,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useNavigate } from '@tanstack/react-router';
import { useAircraftStore, useOwnerStore, useAuthStore } from '../../store';
import { getAircraftDocumentStatus } from '../../utils/documentValidation';
import { AircraftForm } from './AircraftForm';
import type { Aircraft } from '../../types';

export function AircraftList() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingAircraft, setEditingAircraft] = useState<Aircraft | null>(null);
  
  const navigate = useNavigate();
  const { aircraft, documents, ownerships, deleteAircraft } = useAircraftStore();
  const { owners } = useOwnerStore();
  const { canEdit } = useAuthStore();
  
  const handleAdd = () => {
    setEditingAircraft(null);
    setFormOpen(true);
  };
  
  const handleEdit = (ac: Aircraft) => {
    setEditingAircraft(ac);
    setFormOpen(true);
  };
  
  const handleView = (aircraftId: string) => {
    navigate({ to: '/aircraft/$aircraftId', params: { aircraftId } });
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this aircraft?')) {
      deleteAircraft(id);
    }
  };
  
  const handleFormClose = () => {
    setFormOpen(false);
    setEditingAircraft(null);
  };
  
  const getCurrentOwner = (aircraftId: string) => {
    const ownership = ownerships.find(
      (o) => o.aircraftId === aircraftId && !o.endDate
    );
    if (ownership) {
      const owner = owners.find((o) => o.id === ownership.ownerId);
      return owner?.name || 'Unknown';
    }
    return 'No Owner';
  };
  
  const getDocumentStatusIcon = (aircraftId: string) => {
    const statuses = getAircraftDocumentStatus(documents, aircraftId);
    const hasError = statuses.some((s) => s.status === 'missing' || s.status === 'expired');
    const hasWarning = statuses.some((s) => s.status === 'expiring');
    
    if (hasError) {
      return (
        <Tooltip title="Missing or expired documents">
          <ErrorIcon color="error" fontSize="small" />
        </Tooltip>
      );
    }
    if (hasWarning) {
      return (
        <Tooltip title="Documents expiring soon">
          <WarningIcon color="warning" fontSize="small" />
        </Tooltip>
      );
    }
    return (
      <Tooltip title="All documents valid">
        <CheckIcon color="success" fontSize="small" />
      </Tooltip>
    );
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Aircraft</Typography>
        {canEdit() && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Aircraft
          </Button>
        )}
      </Box>
      
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tail Number</TableCell>
                  <TableCell>Make</TableCell>
                  <TableCell>Model</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Current Owner</TableCell>
                  <TableCell>Documents</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {aircraft.map((ac) => (
                  <TableRow key={ac.id} hover>
                    <TableCell>
                      <Chip
                        label={ac.tailNumber}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{ac.make}</TableCell>
                    <TableCell>{ac.model}</TableCell>
                    <TableCell>{ac.yearOfManufacture}</TableCell>
                    <TableCell>{getCurrentOwner(ac.id)}</TableCell>
                    <TableCell>{getDocumentStatusIcon(ac.id)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleView(ac.id)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      {canEdit() && (
                        <>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(ac)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(ac.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {aircraft.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary" sx={{ py: 4 }}>
                        No aircraft found. Add your first aircraft to get started.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      
      <Dialog
        open={formOpen}
        onClose={handleFormClose}
        maxWidth="sm"
        fullWidth
      >
        <AircraftForm
          aircraft={editingAircraft}
          onClose={handleFormClose}
        />
      </Dialog>
    </Box>
  );
}
