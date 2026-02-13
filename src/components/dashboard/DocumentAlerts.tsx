import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Box,
  Button,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useNavigate } from '@tanstack/react-router';
import { format, parseISO } from 'date-fns';
import { useAircraftStore, useFlightStore } from '../../store';
import { generateDocumentAlerts } from '../../utils/documentValidation';
import type { DocumentAlert } from '../../types';

export function DocumentAlerts() {
  const navigate = useNavigate();
  const { aircraft, documents } = useAircraftStore();
  const { flights } = useFlightStore();
  
  const alerts = generateDocumentAlerts(aircraft, documents, flights);
  
  // Sort by severity: error first, then warning
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityOrder = { error: 0, warning: 1, info: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
  
  const getIcon = (severity: DocumentAlert['severity']) => {
    switch (severity) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      default:
        return <CheckIcon color="success" />;
    }
  };
  
  const getChipColor = (severity: DocumentAlert['severity']) => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'success';
    }
  };
  
  const handleViewAircraft = (aircraftId: string) => {
    navigate({ to: '/aircraft/$aircraftId', params: { aircraftId } });
  };
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Document Alerts</Typography>
          <Chip
            label={`${alerts.length} ${alerts.length === 1 ? 'Alert' : 'Alerts'}`}
            color={alerts.some((a) => a.severity === 'error') ? 'error' : alerts.length > 0 ? 'warning' : 'success'}
            size="small"
          />
        </Box>
        
        {sortedAlerts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
            <Typography color="text.secondary">
              All aircraft documents are valid and up to date
            </Typography>
          </Box>
        ) : (
          <List dense>
            {sortedAlerts.slice(0, 10).map((alert) => (
              <ListItem
                key={alert.id}
                sx={{
                  backgroundColor: alert.severity === 'error' ? 'error.50' : alert.severity === 'warning' ? 'warning.50' : 'transparent',
                  borderRadius: 1,
                  mb: 0.5,
                }}
                secondaryAction={
                  <Button
                    size="small"
                    onClick={() => handleViewAircraft(alert.aircraftId)}
                  >
                    View
                  </Button>
                }
              >
                <ListItemIcon>{getIcon(alert.severity)}</ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={alert.tailNumber}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={alert.documentType}
                        size="small"
                        color={getChipColor(alert.severity) as any}
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      {alert.message}
                      {alert.expirationDate && (
                        <Typography variant="caption" display="block">
                          Expires: {format(parseISO(alert.expirationDate), 'MMM d, yyyy')}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))}
            {sortedAlerts.length > 10 && (
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary" align="center">
                      And {sortedAlerts.length - 10} more alerts...
                    </Typography>
                  }
                />
              </ListItem>
            )}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
