import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
} from '@mui/material';
import { Download as DownloadIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { format, parseISO, isWithinInterval, subDays } from 'date-fns';
import {
  useFlightStore,
  useAircraftStore,
  useOwnerStore,
  useManagementStore,
  useClientStore,
} from '../../store';
import type { ReportRow, ReportSummary } from '../../types';

export function MOTRefundReport() {
  const { flights, fuelReceipts } = useFlightStore();
  const { aircraft, ownerships, managements } = useAircraftStore();
  const { owners } = useOwnerStore();
  const { companies } = useManagementStore();
  const { clients } = useClientStore();
  
  // Filter state
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 90), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedAircraft, setSelectedAircraft] = useState<string[]>([]);
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  
  // Generate report data
  const reportData = useMemo<ReportSummary>(() => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    // Filter flights by date range
    let filteredFlights = flights.filter((flight) => {
      const flightDate = parseISO(flight.flightDate);
      return isWithinInterval(flightDate, { start, end });
    });
    
    // Filter by aircraft
    if (selectedAircraft.length > 0) {
      filteredFlights = filteredFlights.filter((f) =>
        selectedAircraft.includes(f.aircraftId)
      );
    }
    
    // Filter by owner (aircraft ownership at time of flight)
    if (selectedOwners.length > 0) {
      filteredFlights = filteredFlights.filter((f) => {
        const flightDate = parseISO(f.flightDate);
        const ownership = ownerships.find((o) => {
          const ownerStart = parseISO(o.startDate);
          const ownerEnd = o.endDate ? parseISO(o.endDate) : new Date();
          return (
            o.aircraftId === f.aircraftId &&
            isWithinInterval(flightDate, { start: ownerStart, end: ownerEnd })
          );
        });
        return ownership && selectedOwners.includes(ownership.ownerId);
      });
    }
    
    // Filter by management company
    if (selectedCompanies.length > 0) {
      filteredFlights = filteredFlights.filter((f) => {
        const flightDate = parseISO(f.flightDate);
        const management = managements.find((m) => {
          const mgmtStart = parseISO(m.startDate);
          const mgmtEnd = m.endDate ? parseISO(m.endDate) : new Date();
          return (
            m.aircraftId === f.aircraftId &&
            isWithinInterval(flightDate, { start: mgmtStart, end: mgmtEnd })
          );
        });
        return management && selectedCompanies.includes(management.managementCompanyId);
      });
    }
    
    // Filter by client
    if (selectedClients.length > 0) {
      filteredFlights = filteredFlights.filter(
        (f) => f.clientId && selectedClients.includes(f.clientId)
      );
    }
    
    // Build report rows
    const rows: ReportRow[] = filteredFlights.map((flight) => {
      const ac = aircraft.find((a) => a.id === flight.aircraftId);
      const client = flight.clientId
        ? clients.find((c) => c.id === flight.clientId)
        : null;
      
      const flightDate = parseISO(flight.flightDate);
      
      // Find owner at time of flight
      const ownership = ownerships.find((o) => {
        const ownerStart = parseISO(o.startDate);
        const ownerEnd = o.endDate ? parseISO(o.endDate) : new Date();
        return (
          o.aircraftId === flight.aircraftId &&
          isWithinInterval(flightDate, { start: ownerStart, end: ownerEnd })
        );
      });
      const owner = ownership ? owners.find((o) => o.id === ownership.ownerId) : null;
      
      // Find management company at time of flight
      const management = managements.find((m) => {
        const mgmtStart = parseISO(m.startDate);
        const mgmtEnd = m.endDate ? parseISO(m.endDate) : new Date();
        return (
          m.aircraftId === flight.aircraftId &&
          isWithinInterval(flightDate, { start: mgmtStart, end: mgmtEnd })
        );
      });
      const company = management
        ? companies.find((c) => c.id === management.managementCompanyId)
        : null;
      
      // Get fuel receipts for this flight
      const receipts = fuelReceipts.filter((r) => r.flightId === flight.id);
      const fuelLiters = receipts.reduce((sum, r) => sum + r.fuelLiters, 0);
      const motAmountPaid = receipts.reduce((sum, r) => sum + r.motAmountPaid, 0);
      
      return {
        flightId: flight.id,
        flightDate: flight.flightDate,
        aircraftId: flight.aircraftId,
        tailNumber: ac?.tailNumber || 'Unknown',
        departure: flight.departure,
        arrival: flight.arrival,
        clientName: client?.name,
        ownerName: owner?.name,
        managementCompanyName: company?.name,
        fuelLiters,
        motAmountPaid,
      };
    });
    
    // Sort by date
    rows.sort((a, b) => parseISO(b.flightDate).getTime() - parseISO(a.flightDate).getTime());
    
    const totalFlights = rows.length;
    const totalFuelLiters = rows.reduce((sum, r) => sum + r.fuelLiters, 0);
    const totalMotPaid = rows.reduce((sum, r) => sum + r.motAmountPaid, 0);
    
    return {
      totalFlights,
      totalFuelLiters,
      totalMotPaid,
      rows,
    };
  }, [
    flights,
    fuelReceipts,
    aircraft,
    ownerships,
    managements,
    owners,
    companies,
    clients,
    startDate,
    endDate,
    selectedAircraft,
    selectedOwners,
    selectedCompanies,
    selectedClients,
  ]);
  
  const handleExportCSV = () => {
    const headers = [
      'Flight Date',
      'Aircraft',
      'Route',
      'Client',
      'Owner',
      'Management Company',
      'Fuel (Liters)',
      'MOT Paid',
    ];
    
    const csvRows = [
      headers.join(','),
      ...reportData.rows.map((row) =>
        [
          row.flightDate,
          row.tailNumber,
          `${row.departure}-${row.arrival}`,
          row.clientName || '',
          row.ownerName || '',
          row.managementCompanyName || '',
          row.fuelLiters,
          row.motAmountPaid.toFixed(2),
        ].join(',')
      ),
      '',
      `Total Flights,${reportData.totalFlights}`,
      `Total Fuel (Liters),${reportData.totalFuelLiters}`,
      `Total MOT Refund,$${reportData.totalMotPaid.toFixed(2)}`,
    ];
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mot-refund-report-${startDate}-to-${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleClearFilters = () => {
    setSelectedAircraft([]);
    setSelectedOwners([]);
    setSelectedCompanies([]);
    setSelectedClients([]);
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">MOT Refund Report</Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExportCSV}
          disabled={reportData.rows.length === 0}
        >
          Export CSV
        </Button>
      </Box>
      
      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <FilterIcon />
            <Typography variant="h6">Filters</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Button size="small" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Aircraft</InputLabel>
                <Select
                  multiple
                  value={selectedAircraft}
                  onChange={(e) => setSelectedAircraft(e.target.value as string[])}
                  input={<OutlinedInput label="Aircraft" />}
                  renderValue={(selected) =>
                    selected
                      .map((id) => aircraft.find((a) => a.id === id)?.tailNumber)
                      .join(', ')
                  }
                >
                  {aircraft.map((ac) => (
                    <MenuItem key={ac.id} value={ac.id}>
                      <Checkbox checked={selectedAircraft.includes(ac.id)} />
                      <ListItemText primary={ac.tailNumber} secondary={`${ac.make} ${ac.model}`} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Owners</InputLabel>
                <Select
                  multiple
                  value={selectedOwners}
                  onChange={(e) => setSelectedOwners(e.target.value as string[])}
                  input={<OutlinedInput label="Owners" />}
                  renderValue={(selected) =>
                    selected
                      .map((id) => owners.find((o) => o.id === id)?.name)
                      .join(', ')
                  }
                >
                  {owners.map((owner) => (
                    <MenuItem key={owner.id} value={owner.id}>
                      <Checkbox checked={selectedOwners.includes(owner.id)} />
                      <ListItemText primary={owner.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Management Companies</InputLabel>
                <Select
                  multiple
                  value={selectedCompanies}
                  onChange={(e) => setSelectedCompanies(e.target.value as string[])}
                  input={<OutlinedInput label="Management Companies" />}
                  renderValue={(selected) =>
                    selected
                      .map((id) => companies.find((c) => c.id === id)?.name)
                      .join(', ')
                  }
                >
                  {companies.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      <Checkbox checked={selectedCompanies.includes(company.id)} />
                      <ListItemText primary={company.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Clients</InputLabel>
                <Select
                  multiple
                  value={selectedClients}
                  onChange={(e) => setSelectedClients(e.target.value as string[])}
                  input={<OutlinedInput label="Clients" />}
                  renderValue={(selected) =>
                    selected
                      .map((id) => clients.find((c) => c.id === id)?.name)
                      .join(', ')
                  }
                >
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      <Checkbox checked={selectedClients.includes(client.id)} />
                      <ListItemText primary={client.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Total Flights
            </Typography>
            <Typography variant="h4">{reportData.totalFlights}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Total Fuel (Liters)
            </Typography>
            <Typography variant="h4">{reportData.totalFuelLiters.toLocaleString()}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'primary.50' }}>
            <Typography variant="body2" color="text.secondary">
              Total MOT Refund
            </Typography>
            <Typography variant="h4" color="primary.main">
              ${reportData.totalMotPaid.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Data Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Flight Details
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Aircraft</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Mgmt Company</TableCell>
                  <TableCell align="right">Fuel (L)</TableCell>
                  <TableCell align="right">MOT Paid</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.rows.map((row) => (
                  <TableRow key={row.flightId} hover>
                    <TableCell>
                      {format(parseISO(row.flightDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Chip label={row.tailNumber} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      {row.departure} → {row.arrival}
                    </TableCell>
                    <TableCell>{row.clientName || '-'}</TableCell>
                    <TableCell>{row.ownerName || '-'}</TableCell>
                    <TableCell>{row.managementCompanyName || '-'}</TableCell>
                    <TableCell align="right">
                      {row.fuelLiters > 0 ? row.fuelLiters.toLocaleString() : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {row.motAmountPaid > 0 ? (
                        <Typography fontWeight="medium">
                          ${row.motAmountPaid.toFixed(2)}
                        </Typography>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {reportData.rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography color="text.secondary" sx={{ py: 4 }}>
                        No flights found for the selected filters
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
