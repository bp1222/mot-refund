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
  Divider,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { useClientStore, useManagementStore } from '../../store';
import type { Client } from '../../types';

interface ClientFormProps {
  client: Client | null;
  onClose: () => void;
}

export function ClientForm({ client, onClose }: ClientFormProps) {
  const { addClient, updateClient, engagements, addEngagement, updateEngagement } = useClientStore();
  const { companies } = useManagementStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  const [engagementData, setEngagementData] = useState({
    managementCompanyId: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
      });
      
      // Find current engagement
      const currentEngagement = engagements.find(
        (e) => e.clientId === client.id && !e.endDate
      );
      if (currentEngagement) {
        setEngagementData({
          managementCompanyId: currentEngagement.managementCompanyId,
          startDate: currentEngagement.startDate,
        });
      }
    }
  }, [client, engagements]);
  
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };
  
  const handleEngagementChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    setEngagementData((prev) => ({ ...prev, [field]: e.target.value }));
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const clientId = client?.id || uuidv4();
    
    if (client) {
      updateClient(client.id, formData);
      
      // Handle engagement changes
      const currentEngagement = engagements.find(
        (eng) => eng.clientId === client.id && !eng.endDate
      );
      
      if (engagementData.managementCompanyId) {
        if (currentEngagement) {
          if (currentEngagement.managementCompanyId !== engagementData.managementCompanyId) {
            // End old engagement and create new one
            updateEngagement(currentEngagement.id, {
              endDate: format(new Date(), 'yyyy-MM-dd'),
            });
            addEngagement({
              id: uuidv4(),
              clientId: client.id,
              managementCompanyId: engagementData.managementCompanyId,
              startDate: engagementData.startDate,
            });
          }
        } else {
          // Create new engagement
          addEngagement({
            id: uuidv4(),
            clientId: client.id,
            managementCompanyId: engagementData.managementCompanyId,
            startDate: engagementData.startDate,
          });
        }
      }
    } else {
      addClient({
        id: clientId,
        ...formData,
      });
      
      // Create engagement if selected
      if (engagementData.managementCompanyId) {
        addEngagement({
          id: uuidv4(),
          clientId,
          managementCompanyId: engagementData.managementCompanyId,
          startDate: engagementData.startDate,
        });
      }
    }
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>{client ? 'Edit Client' : 'Add Client'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={handleChange('name')}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={handleChange('phone')}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Management Company Engagement (Optional)
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Management Company</InputLabel>
              <Select
                value={engagementData.managementCompanyId}
                label="Management Company"
                onChange={handleEngagementChange('managementCompanyId') as any}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Engagement Start Date"
              type="date"
              value={engagementData.startDate}
              onChange={handleEngagementChange('startDate')}
              InputLabelProps={{ shrink: true }}
              disabled={!engagementData.managementCompanyId}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          {client ? 'Save Changes' : 'Add Client'}
        </Button>
      </DialogActions>
    </form>
  );
}
