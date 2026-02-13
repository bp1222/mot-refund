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
import { useManagementStore, useAircraftStore, useClientStore, useAuthStore } from '../../store';
import { ManagementCompanyForm } from './ManagementCompanyForm';
import type { ManagementCompany } from '../../types';

export function ManagementCompanyList() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<ManagementCompany | null>(null);
  
  const { companies, deleteCompany } = useManagementStore();
  const { managements, aircraft } = useAircraftStore();
  const { engagements } = useClientStore();
  const { canEdit } = useAuthStore();
  
  const handleAdd = () => {
    setEditingCompany(null);
    setFormOpen(true);
  };
  
  const handleEdit = (company: ManagementCompany) => {
    setEditingCompany(company);
    setFormOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this management company?')) {
      deleteCompany(id);
    }
  };
  
  const handleFormClose = () => {
    setFormOpen(false);
    setEditingCompany(null);
  };
  
  const getManagedAircraft = (companyId: string) => {
    const currentManagements = managements.filter(
      (m) => m.managementCompanyId === companyId && !m.endDate
    );
    return currentManagements.map((m) => {
      const ac = aircraft.find((a) => a.id === m.aircraftId);
      return ac?.tailNumber || 'Unknown';
    });
  };
  
  const getClientCount = (companyId: string) => {
    return engagements.filter(
      (e) => e.managementCompanyId === companyId && !e.endDate
    ).length;
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Management Companies</Typography>
        {canEdit() && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Company
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
                  <TableCell>Managed Aircraft</TableCell>
                  <TableCell>Active Clients</TableCell>
                  {canEdit() && <TableCell align="right">Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.map((company) => {
                  const managedAircraft = getManagedAircraft(company.id);
                  const clientCount = getClientCount(company.id);
                  return (
                    <TableRow key={company.id} hover>
                      <TableCell>
                        <Typography fontWeight="medium">{company.name}</Typography>
                      </TableCell>
                      <TableCell>{company.email}</TableCell>
                      <TableCell>{company.phone}</TableCell>
                      <TableCell>
                        {managedAircraft.length > 0 ? (
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {managedAircraft.map((tail) => (
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
                      <TableCell>
                        <Chip
                          label={clientCount}
                          size="small"
                          color={clientCount > 0 ? 'success' : 'default'}
                        />
                      </TableCell>
                      {canEdit() && (
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleEdit(company)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(company.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
                {companies.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={canEdit() ? 6 : 5} align="center">
                      <Typography color="text.secondary" sx={{ py: 4 }}>
                        No management companies found.
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
        <ManagementCompanyForm company={editingCompany} onClose={handleFormClose} />
      </Dialog>
    </Box>
  );
}
