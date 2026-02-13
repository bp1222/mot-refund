import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Dialog,
} from '@mui/material';
import { ArrowBack as BackIcon, Edit as EditIcon } from '@mui/icons-material';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useAircraftStore, useOwnerStore, useManagementStore, useFlightStore, useAuthStore } from '../../store';
import { AircraftDocuments } from './AircraftDocuments';
import { AircraftOwnershipHistory } from './AircraftOwnershipHistory';
import { AircraftManagementHistory } from './AircraftManagementHistory';
import { AircraftFlightHistory } from './AircraftFlightHistory';
import { AircraftForm } from './AircraftForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export function AircraftDetail() {
  const { aircraftId } = useParams({ from: '/_authenticated/aircraft/$aircraftId' });
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [editFormOpen, setEditFormOpen] = useState(false);
  
  const { aircraft, documents, ownerships, managements } = useAircraftStore();
  const { owners } = useOwnerStore();
  const { companies } = useManagementStore();
  const { flights } = useFlightStore();
  const { canEdit } = useAuthStore();
  
  const ac = aircraft.find((a) => a.id === aircraftId);
  
  if (!ac) {
    return (
      <Box>
        <Button startIcon={<BackIcon />} onClick={() => navigate({ to: '/aircraft' })}>
          Back to Aircraft
        </Button>
        <Typography variant="h5" sx={{ mt: 2 }}>
          Aircraft not found
        </Typography>
      </Box>
    );
  }
  
  const currentOwnership = ownerships.find(
    (o) => o.aircraftId === aircraftId && !o.endDate
  );
  const currentOwner = currentOwnership
    ? owners.find((o) => o.id === currentOwnership.ownerId)
    : null;
  
  const currentManagement = managements.find(
    (m) => m.aircraftId === aircraftId && !m.endDate
  );
  const currentCompany = currentManagement
    ? companies.find((c) => c.id === currentManagement.managementCompanyId)
    : null;
  
  const aircraftDocuments = documents.filter((d) => d.aircraftId === aircraftId);
  const aircraftOwnerships = ownerships.filter((o) => o.aircraftId === aircraftId);
  const aircraftManagements = managements.filter((m) => m.aircraftId === aircraftId);
  const aircraftFlights = flights.filter((f) => f.aircraftId === aircraftId);
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate({ to: '/aircraft' })}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Aircraft Details
        </Typography>
        {canEdit() && (
          <IconButton onClick={() => setEditFormOpen(true)}>
            <EditIcon />
          </IconButton>
        )}
      </Box>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Tail Number
              </Typography>
              <Typography variant="h5">
                <Chip label={ac.tailNumber} color="primary" />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Make / Model
              </Typography>
              <Typography variant="h6">
                {ac.make} {ac.model}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Year of Manufacture
              </Typography>
              <Typography variant="h6">{ac.yearOfManufacture}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Current Owner
              </Typography>
              <Typography variant="h6">
                {currentOwner?.name || 'Not assigned'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Management Company
              </Typography>
              <Typography variant="h6">
                {currentCompany?.name || 'Not assigned'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label={`Documents (${aircraftDocuments.length})`} />
            <Tab label={`Ownership History (${aircraftOwnerships.length})`} />
            <Tab label={`Management History (${aircraftManagements.length})`} />
            <Tab label={`Flight History (${aircraftFlights.length})`} />
          </Tabs>
        </Box>
        <CardContent>
          <TabPanel value={tabValue} index={0}>
            <AircraftDocuments aircraftId={aircraftId} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <AircraftOwnershipHistory aircraftId={aircraftId} />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <AircraftManagementHistory aircraftId={aircraftId} />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <AircraftFlightHistory aircraftId={aircraftId} />
          </TabPanel>
        </CardContent>
      </Card>
      
      <Dialog open={editFormOpen} onClose={() => setEditFormOpen(false)} maxWidth="sm" fullWidth>
        <AircraftForm aircraft={ac} onClose={() => setEditFormOpen(false)} />
      </Dialog>
    </Box>
  );
}
