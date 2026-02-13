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
import { useAircraftStore, useManagementStore } from '../../store';
import type { AircraftManagement } from '../../types';

interface ManagementAssignmentFormProps {
  aircraftId: string;
  management: AircraftManagement | null;
  onClose: () => void;
}

export function ManagementAssignmentForm({ aircraftId, management, onClose }: ManagementAssignmentFormProps) {
  const { addManagement, updateManagement } = useAircraftStore();
  const { companies } = useManagementStore();
  
  const [formData, setFormData] = useState({
    managementCompanyId: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (management) {
      setFormData({
        managementCompanyId: management.managementCompanyId,
        startDate: management.startDate,
        endDate: management.endDate || '',
      });
    }
  }, [management]);
  
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.managementCompanyId) {
      newErrors.managementCompanyId = 'Management company is required';
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
    
    const managementData: AircraftManagement = {
      id: management?.id || uuidv4(),
      aircraftId,
      managementCompanyId: formData.managementCompanyId,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
    };
    
    if (management) {
      updateManagement(management.id, managementData);
    } else {
      addManagement(managementData);
    }
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {management ? 'Edit Management Assignment' : 'Add Management Assignment'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.managementCompanyId}>
              <InputLabel>Management Company</InputLabel>
              <Select
                value={formData.managementCompanyId}
                label="Management Company"
                onChange={handleChange('managementCompanyId') as any}
              >
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.managementCompanyId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {errors.managementCompanyId}
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
          {management ? 'Save Changes' : 'Add Assignment'}
        </Button>
      </DialogActions>
    </form>
  );
}
