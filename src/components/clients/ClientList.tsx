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
import { useClientStore, useManagementStore, useFlightStore, useAuthStore } from '../../store';
import { ClientForm } from './ClientForm';
import type { Client } from '../../types';

export function ClientList() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const { clients, engagements, deleteClient } = useClientStore();
  const { companies } = useManagementStore();
  const { flights } = useFlightStore();
  const { canEdit } = useAuthStore();
  
  const handleAdd = () => {
    setEditingClient(null);
    setFormOpen(true);
  };
  
  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteClient(id);
    }
  };
  
  const handleFormClose = () => {
    setFormOpen(false);
    setEditingClient(null);
  };
  
  const getCurrentManagementCompany = (clientId: string) => {
    const engagement = engagements.find(
      (e) => e.clientId === clientId && !e.endDate
    );
    if (engagement) {
      const company = companies.find((c) => c.id === engagement.managementCompanyId);
      return company?.name || 'Unknown';
    }
    return null;
  };
  
  const getFlightCount = (clientId: string) => {
    return flights.filter((f) => f.clientId === clientId).length;
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Clients</Typography>
        {canEdit() && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Client
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
                  <TableCell>Management Company</TableCell>
                  <TableCell>Flights</TableCell>
                  {canEdit() && <TableCell align="right">Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.map((client) => {
                  const managementCompany = getCurrentManagementCompany(client.id);
                  const flightCount = getFlightCount(client.id);
                  return (
                    <TableRow key={client.id} hover>
                      <TableCell>
                        <Typography fontWeight="medium">{client.name}</Typography>
                      </TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>
                        {managementCompany ? (
                          <Chip label={managementCompany} size="small" variant="outlined" />
                        ) : (
                          <Typography color="text.secondary" variant="body2">
                            Not engaged
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={flightCount}
                          size="small"
                          color={flightCount > 0 ? 'primary' : 'default'}
                        />
                      </TableCell>
                      {canEdit() && (
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleEdit(client)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(client.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
                {clients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={canEdit() ? 6 : 5} align="center">
                      <Typography color="text.secondary" sx={{ py: 4 }}>
                        No clients found. Add your first client to get started.
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
        <ClientForm client={editingClient} onClose={handleFormClose} />
      </Dialog>
    </Box>
  );
}
