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
import { useAircraftStore, useManagementStore, useAuthStore } from '../../store';
import { ManagementAssignmentForm } from './ManagementAssignmentForm';
import type { AircraftManagement } from '../../types';

interface AircraftManagementHistoryProps {
  aircraftId: string;
}

export function AircraftManagementHistory({ aircraftId }: AircraftManagementHistoryProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingManagement, setEditingManagement] = useState<AircraftManagement | null>(null);
  
  const { managements, deleteManagement } = useAircraftStore();
  const { companies } = useManagementStore();
  const { canEdit } = useAuthStore();
  
  const aircraftManagements = managements
    .filter((m) => m.aircraftId === aircraftId)
    .sort((a, b) => parseISO(b.startDate).getTime() - parseISO(a.startDate).getTime());
  
  const handleAdd = () => {
    setEditingManagement(null);
    setFormOpen(true);
  };
  
  const handleEdit = (management: AircraftManagement) => {
    setEditingManagement(management);
    setFormOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this management record?')) {
      deleteManagement(id);
    }
  };
  
  const handleFormClose = () => {
    setFormOpen(false);
    setEditingManagement(null);
  };
  
  const getCompanyName = (companyId: string) => {
    const company = companies.find((c) => c.id === companyId);
    return company?.name || 'Unknown Company';
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
            Add Management
          </Button>
        )}
      </Box>
      
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Management Company</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              {canEdit() && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {aircraftManagements.map((management) => (
              <TableRow key={management.id}>
                <TableCell>{getCompanyName(management.managementCompanyId)}</TableCell>
                <TableCell>
                  {format(parseISO(management.startDate), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {management.endDate
                    ? format(parseISO(management.endDate), 'MMM d, yyyy')
                    : '-'}
                </TableCell>
                <TableCell>
                  {management.endDate ? (
                    <Chip label="Past" size="small" variant="outlined" />
                  ) : (
                    <Chip label="Current" color="success" size="small" />
                  )}
                </TableCell>
                {canEdit() && (
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEdit(management)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(management.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {aircraftManagements.length === 0 && (
              <TableRow>
                <TableCell colSpan={canEdit() ? 5 : 4} align="center">
                  <Typography color="text.secondary" sx={{ py: 2 }}>
                    No management records found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Dialog open={formOpen} onClose={handleFormClose} maxWidth="sm" fullWidth>
        <ManagementAssignmentForm
          aircraftId={aircraftId}
          management={editingManagement}
          onClose={handleFormClose}
        />
      </Dialog>
    </Box>
  );
}
