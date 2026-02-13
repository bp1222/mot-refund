import { useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { useAircraftStore, useOwnerStore, useAuthStore } from '../../store';
import { OwnershipForm } from './OwnershipForm';
import type { AircraftOwnership } from '../../types';

interface AircraftOwnershipHistoryProps {
  aircraftId: string;
}

export function AircraftOwnershipHistory({ aircraftId }: AircraftOwnershipHistoryProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingOwnership, setEditingOwnership] = useState<AircraftOwnership | null>(null);
  
  const { ownerships, deleteOwnership } = useAircraftStore();
  const { owners } = useOwnerStore();
  const { canEdit } = useAuthStore();
  
  const aircraftOwnerships = ownerships
    .filter((o) => o.aircraftId === aircraftId)
    .sort((a, b) => parseISO(b.startDate).getTime() - parseISO(a.startDate).getTime());
  
  const handleAdd = () => {
    setEditingOwnership(null);
    setFormOpen(true);
  };
  
  const handleEdit = (ownership: AircraftOwnership) => {
    setEditingOwnership(ownership);
    setFormOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this ownership record?')) {
      deleteOwnership(id);
    }
  };
  
  const handleFormClose = () => {
    setFormOpen(false);
    setEditingOwnership(null);
  };
  
  const getOwnerName = (ownerId: string) => {
    const owner = owners.find((o) => o.id === ownerId);
    return owner?.name || 'Unknown Owner';
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        {canEdit() && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            size="small"
          >
            Add Ownership
          </Button>
        )}
      </Box>
      
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Owner</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              {canEdit() && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {aircraftOwnerships.map((ownership) => (
              <TableRow key={ownership.id}>
                <TableCell>{getOwnerName(ownership.ownerId)}</TableCell>
                <TableCell>
                  {format(parseISO(ownership.startDate), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {ownership.endDate
                    ? format(parseISO(ownership.endDate), 'MMM d, yyyy')
                    : '-'}
                </TableCell>
                <TableCell>
                  {ownership.endDate ? (
                    <Chip label="Past" size="small" variant="outlined" />
                  ) : (
                    <Chip label="Current" color="success" size="small" />
                  )}
                </TableCell>
                {canEdit() && (
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEdit(ownership)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(ownership.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {aircraftOwnerships.length === 0 && (
              <TableRow>
                <TableCell colSpan={canEdit() ? 5 : 4} align="center">
                  <Typography color="text.secondary" sx={{ py: 2 }}>
                    No ownership records found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Dialog open={formOpen} onClose={handleFormClose} maxWidth="sm" fullWidth>
        <OwnershipForm
          aircraftId={aircraftId}
          ownership={editingOwnership}
          onClose={handleFormClose}
        />
      </Dialog>
    </Box>
  );
}
