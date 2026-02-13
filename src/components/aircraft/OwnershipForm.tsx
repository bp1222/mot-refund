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
import { format, parseISO } from 'date-fns';
import { useAircraftStore, useOwnerStore } from '../../store';
import type { AircraftOwnership } from '../../types';

interface OwnershipFormProps {
  aircraftId: string;
  ownership: AircraftOwnership | null;
  onClose: () => void;
}

export function OwnershipForm({ aircraftId, ownership, onClose }: OwnershipFormProps) {
  const { addOwnership, updateOwnership } = useAircraftStore();
  const { owners } = useOwnerStore();
  
  const [formData, setFormData] = useState({
    ownerId: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (ownership) {
      setFormData({
        ownerId: ownership.ownerId,
        startDate: ownership.startDate,
        endDate: ownership.endDate || '',
      });
    }
  }, [ownership]);
  
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.ownerId) {
      newErrors.ownerId = 'Owner is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (formData.startDate && formData.endDate) {
      const start = parseISO(formData.startDate);
      const end = parseISO(formData.endDate);
      if (start > end) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const ownershipData: AircraftOwnership = {
      id: ownership?.id || uuidv4(),
      aircraftId,
      ownerId: formData.ownerId,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
    };
    
    if (ownership) {
      updateOwnership(ownership.id, ownershipData);
    } else {
      addOwnership(ownershipData);
    }
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {ownership ? 'Edit Ownership' : 'Add Ownership'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.ownerId}>
              <InputLabel>Owner</InputLabel>
              <Select
                value={formData.ownerId}
                label="Owner"
                onChange={handleChange('ownerId') as any}
              >
                {owners.map((owner) => (
                  <MenuItem key={owner.id} value={owner.id}>
                    {owner.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.ownerId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {errors.ownerId}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={handleChange('startDate')}
              error={!!errors.startDate}
              helperText={errors.startDate}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="End Date (leave blank if current)"
              type="date"
              value={formData.endDate}
              onChange={handleChange('endDate')}
              error={!!errors.endDate}
              helperText={errors.endDate}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          {ownership ? 'Save Changes' : 'Add Ownership'}
        </Button>
      </DialogActions>
    </form>
  );
}
