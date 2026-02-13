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
} from '@mui/icons-material';
import { useOwnerStore, useAircraftStore, useAuthStore } from '../../store';
import { OwnerForm } from './OwnerForm';
import type { Owner } from '../../types';

export function OwnerList() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  
  const { owners, deleteOwner } = useOwnerStore();
  const { ownerships, aircraft } = useAircraftStore();
  const { canEdit } = useAuthStore();
  
  const handleAdd = () => {
    setEditingOwner(null);
    setFormOpen(true);
  };
  
  const handleEdit = (owner: Owner) => {
    setEditingOwner(owner);
    setFormOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this owner?')) {
      deleteOwner(id);
    }
  };
  
  const handleFormClose = () => {
    setFormOpen(false);
    setEditingOwner(null);
  };
  
  const getOwnedAircraft = (ownerId: string) => {
    const currentOwnerships = ownerships.filter(
      (o) => o.ownerId === ownerId && !o.endDate
    );
    return currentOwnerships.map((o) => {
      const ac = aircraft.find((a) => a.id === o.aircraftId);
      return ac?.tailNumber || 'Unknown';
    });
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Owners</Typography>
        {canEdit() && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Owner
          </Button>
        )}
      </Box>
      
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Current Aircraft</TableCell>
                  {canEdit() && <TableCell align="right">Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {owners.map((owner) => {
                  const ownedAircraft = getOwnedAircraft(owner.id);
                  return (
                    <TableRow key={owner.id} hover>
                      <TableCell>
                        <Typography fontWeight="medium">{owner.name}</Typography>
                      </TableCell>
                      <TableCell>{owner.email}</TableCell>
                      <TableCell>{owner.phone}</TableCell>
                      <TableCell>
                        {ownedAircraft.length > 0 ? (
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {ownedAircraft.map((tail) => (
                              <Chip
                                key={tail}
                                label={tail}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        ) : (
                          <Typography color="text.secondary" variant="body2">
                            None
                          </Typography>
                        )}
                      </TableCell>
                      {canEdit() && (
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleEdit(owner)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(owner.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
                {owners.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={canEdit() ? 5 : 4} align="center">
                      <Typography color="text.secondary" sx={{ py: 4 }}>
                        No owners found. Add your first owner to get started.
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
        <OwnerForm owner={editingOwner} onClose={handleFormClose} />
      </Dialog>
    </Box>
  );
}
