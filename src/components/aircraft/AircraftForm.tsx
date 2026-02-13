import { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useAircraftStore } from '../../store';
import type { Aircraft } from '../../types';

interface AircraftFormProps {
  aircraft: Aircraft | null;
  onClose: () => void;
}

export function AircraftForm({ aircraft, onClose }: AircraftFormProps) {
  const { addAircraft, updateAircraft } = useAircraftStore();
  
  const [formData, setFormData] = useState({
    tailNumber: '',
    make: '',
    model: '',
    yearOfManufacture: new Date().getFullYear(),
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (aircraft) {
      setFormData({
        tailNumber: aircraft.tailNumber,
        make: aircraft.make,
        model: aircraft.model,
        yearOfManufacture: aircraft.yearOfManufacture,
      });
    }
  }, [aircraft]);
  
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'yearOfManufacture' ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.tailNumber.trim()) {
      newErrors.tailNumber = 'Tail number is required';
    }
    if (!formData.make.trim()) {
      newErrors.make = 'Make is required';
    }
    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }
    if (formData.yearOfManufacture < 1900 || formData.yearOfManufacture > new Date().getFullYear() + 1) {
      newErrors.yearOfManufacture = 'Invalid year';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    if (aircraft) {
      updateAircraft(aircraft.id, formData);
    } else {
      addAircraft({
        id: uuidv4(),
        ...formData,
      });
    }
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {aircraft ? 'Edit Aircraft' : 'Add Aircraft'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tail Number"
              value={formData.tailNumber}
              onChange={handleChange('tailNumber')}
              error={!!errors.tailNumber}
              helperText={errors.tailNumber}
              placeholder="N123AB"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Year of Manufacture"
              type="number"
              value={formData.yearOfManufacture}
              onChange={handleChange('yearOfManufacture')}
              error={!!errors.yearOfManufacture}
              helperText={errors.yearOfManufacture}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Make"
              value={formData.make}
              onChange={handleChange('make')}
              error={!!errors.make}
              helperText={errors.make}
              placeholder="Cessna"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Model"
              value={formData.model}
              onChange={handleChange('model')}
              error={!!errors.model}
              helperText={errors.model}
              placeholder="Citation CJ3"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          {aircraft ? 'Save Changes' : 'Add Aircraft'}
        </Button>
      </DialogActions>
    </form>
  );
}
