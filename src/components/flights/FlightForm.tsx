import { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { useFlightStore, useAircraftStore, useClientStore } from '../../store';
import type { Flight } from '../../types';

interface FlightFormProps {
  flight: Flight | null;
  onClose: () => void;
}

export function FlightForm({ flight, onClose }: FlightFormProps) {
  const { addFlight, updateFlight } = useFlightStore();
  const { aircraft } = useAircraftStore();
  const { clients } = useClientStore();
  
  const [formData, setFormData] = useState({
    aircraftId: '',
    clientId: '',
    flightDate: format(new Date(), 'yyyy-MM-dd'),
    departure: '',
    arrival: '',
    notes: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (flight) {
      setFormData({
        aircraftId: flight.aircraftId,
        clientId: flight.clientId || '',
        flightDate: flight.flightDate,
        departure: flight.departure,
        arrival: flight.arrival,
        notes: flight.notes || '',
      });
    }
  }, [flight]);
  
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.aircraftId) {
      newErrors.aircraftId = 'Aircraft is required';
    }
    if (!formData.flightDate) {
      newErrors.flightDate = 'Flight date is required';
    }
    if (!formData.departure.trim()) {
      newErrors.departure = 'Departure is required';
    }
    if (!formData.arrival.trim()) {
      newErrors.arrival = 'Arrival is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const flightData: Flight = {
      id: flight?.id || uuidv4(),
      aircraftId: formData.aircraftId,
      clientId: formData.clientId || undefined,
      flightDate: formData.flightDate,
      departure: formData.departure.toUpperCase(),
      arrival: formData.arrival.toUpperCase(),
      notes: formData.notes || undefined,
    };
    
    if (flight) {
      updateFlight(flight.id, flightData);
    } else {
      addFlight(flightData);
    }
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>{flight ? 'Edit Flight' : 'Add Flight'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.aircraftId}>
              <InputLabel>Aircraft</InputLabel>
              <Select
                value={formData.aircraftId}
                label="Aircraft"
                onChange={handleChange('aircraftId') as any}
              >
                {aircraft.map((ac) => (
                  <MenuItem key={ac.id} value={ac.id}>
                    {ac.tailNumber} - {ac.make} {ac.model}
                  </MenuItem>
                ))}
              </Select>
              {errors.aircraftId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {errors.aircraftId}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Flight Date"
              type="date"
              value={formData.flightDate}
              onChange={handleChange('flightDate')}
              error={!!errors.flightDate}
              helperText={errors.flightDate}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Departure (ICAO Code)"
              value={formData.departure}
              onChange={handleChange('departure')}
              error={!!errors.departure}
              helperText={errors.departure || 'e.g., KJFK'}
              placeholder="KJFK"
              inputProps={{ style: { textTransform: 'uppercase' } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Arrival (ICAO Code)"
              value={formData.arrival}
              onChange={handleChange('arrival')}
              error={!!errors.arrival}
              helperText={errors.arrival || 'e.g., KLAX'}
              placeholder="KLAX"
              inputProps={{ style: { textTransform: 'uppercase' } }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Client (Optional)</InputLabel>
              <Select
                value={formData.clientId}
                label="Client (Optional)"
                onChange={handleChange('clientId') as any}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes (Optional)"
              value={formData.notes}
              onChange={handleChange('notes')}
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          {flight ? 'Save Changes' : 'Add Flight'}
        </Button>
      </DialogActions>
    </form>
  );
}
