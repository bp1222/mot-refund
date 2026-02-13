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
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO } from 'date-fns';
import { useAircraftStore } from '../../store';
import type { AircraftDocument, DocumentType } from '../../types';

interface DocumentFormProps {
  aircraftId: string;
  document: AircraftDocument | null;
  onClose: () => void;
}

export function DocumentForm({ aircraftId, document, onClose }: DocumentFormProps) {
  const { addDocument, updateDocument } = useAircraftStore();
  
  const [formData, setFormData] = useState({
    type: 'registration' as DocumentType,
    documentNumber: '',
    validFrom: format(new Date(), 'yyyy-MM-dd'),
    validTo: format(new Date(), 'yyyy-MM-dd'),
    documentUrl: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (document) {
      setFormData({
        type: document.type,
        documentNumber: document.documentNumber || '',
        validFrom: document.validFrom,
        validTo: document.validTo,
        documentUrl: document.documentUrl || '',
      });
    }
  }, [document]);
  
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.validFrom) {
      newErrors.validFrom = 'Valid from date is required';
    }
    if (!formData.validTo) {
      newErrors.validTo = 'Valid to date is required';
    }
    if (formData.validFrom && formData.validTo) {
      const from = parseISO(formData.validFrom);
      const to = parseISO(formData.validTo);
      if (from > to) {
        newErrors.validTo = 'Valid to date must be after valid from date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const documentData: AircraftDocument = {
      id: document?.id || uuidv4(),
      aircraftId,
      type: formData.type,
      documentNumber: formData.documentNumber || undefined,
      validFrom: formData.validFrom,
      validTo: formData.validTo,
      documentUrl: formData.documentUrl || undefined,
    };
    
    if (document) {
      updateDocument(document.id, documentData);
    } else {
      addDocument(documentData);
    }
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {document ? 'Edit Document' : 'Add Document'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Document Type</InputLabel>
              <Select
                value={formData.type}
                label="Document Type"
                onChange={handleChange('type') as any}
              >
                <MenuItem value="registration">Registration</MenuItem>
                <MenuItem value="airworthiness">Airworthiness Certificate</MenuItem>
                <MenuItem value="insurance">Insurance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Document Number"
              value={formData.documentNumber}
              onChange={handleChange('documentNumber')}
              placeholder="REG-2024-001"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Valid From"
              type="date"
              value={formData.validFrom}
              onChange={handleChange('validFrom')}
              error={!!errors.validFrom}
              helperText={errors.validFrom}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Valid To"
              type="date"
              value={formData.validTo}
              onChange={handleChange('validTo')}
              error={!!errors.validTo}
              helperText={errors.validTo}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Document URL (optional)"
              value={formData.documentUrl}
              onChange={handleChange('documentUrl')}
              placeholder="https://..."
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          {document ? 'Save Changes' : 'Add Document'}
        </Button>
      </DialogActions>
    </form>
  );
}
