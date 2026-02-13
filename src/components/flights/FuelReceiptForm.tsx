import { useState, useEffect, useRef } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  InputAdornment,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { CloudUpload as UploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { useFlightStore } from '../../store';
import type { FuelReceipt } from '../../types';

interface FuelReceiptFormProps {
  flightId: string;
  receipt: FuelReceipt | null;
  onClose: () => void;
}

export function FuelReceiptForm({ flightId, receipt, onClose }: FuelReceiptFormProps) {
  const { addFuelReceipt, updateFuelReceipt } = useFlightStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    receiptNumber: '',
    receiptDate: format(new Date(), 'yyyy-MM-dd'),
    fuelLiters: '',
    motAmountPaid: '',
    receiptTotal: '',
    vendor: '',
    receiptImageUrl: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (receipt) {
      setFormData({
        receiptNumber: receipt.receiptNumber,
        receiptDate: receipt.receiptDate,
        fuelLiters: receipt.fuelLiters.toString(),
        motAmountPaid: receipt.motAmountPaid.toString(),
        receiptTotal: receipt.receiptTotal?.toString() || '',
        vendor: receipt.vendor || '',
        receiptImageUrl: receipt.receiptImageUrl || '',
      });
    }
  }, [receipt]);
  
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 2MB for localStorage)
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, receiptImage: 'Image must be less than 2MB' }));
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, receiptImageUrl: reader.result as string }));
        setErrors((prev) => ({ ...prev, receiptImage: '' }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, receiptImageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.receiptNumber.trim()) {
      newErrors.receiptNumber = 'Receipt number is required';
    }
    if (!formData.receiptDate) {
      newErrors.receiptDate = 'Receipt date is required';
    }
    if (!formData.fuelLiters || parseFloat(formData.fuelLiters) <= 0) {
      newErrors.fuelLiters = 'Valid fuel amount is required';
    }
    if (!formData.receiptTotal || parseFloat(formData.receiptTotal) <= 0) {
      newErrors.receiptTotal = 'Valid receipt total is required';
    }
    if (!formData.motAmountPaid || parseFloat(formData.motAmountPaid) < 0) {
      newErrors.motAmountPaid = 'Valid MOT amount is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const receiptData: FuelReceipt = {
      id: receipt?.id || uuidv4(),
      flightId,
      receiptNumber: formData.receiptNumber,
      receiptDate: formData.receiptDate,
      fuelLiters: parseFloat(formData.fuelLiters),
      motAmountPaid: parseFloat(formData.motAmountPaid),
      receiptTotal: parseFloat(formData.receiptTotal),
      vendor: formData.vendor || undefined,
      receiptImageUrl: formData.receiptImageUrl || undefined,
    };
    
    if (receipt) {
      updateFuelReceipt(receipt.id, receiptData);
    } else {
      addFuelReceipt(receiptData);
    }
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>{receipt ? 'Edit Fuel Receipt' : 'Add Fuel Receipt'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Receipt Number"
              value={formData.receiptNumber}
              onChange={handleChange('receiptNumber')}
              error={!!errors.receiptNumber}
              helperText={errors.receiptNumber}
              placeholder="FR-2024-001"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Receipt Date"
              type="date"
              value={formData.receiptDate}
              onChange={handleChange('receiptDate')}
              error={!!errors.receiptDate}
              helperText={errors.receiptDate}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fuel Amount"
              type="number"
              value={formData.fuelLiters}
              onChange={handleChange('fuelLiters')}
              error={!!errors.fuelLiters}
              helperText={errors.fuelLiters}
              InputProps={{
                endAdornment: <InputAdornment position="end">Liters</InputAdornment>,
              }}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Receipt Total"
              type="number"
              value={formData.receiptTotal}
              onChange={handleChange('receiptTotal')}
              error={!!errors.receiptTotal}
              helperText={errors.receiptTotal || 'Total amount on receipt'}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="MOT Amount Paid"
              type="number"
              value={formData.motAmountPaid}
              onChange={handleChange('motAmountPaid')}
              error={!!errors.motAmountPaid}
              helperText={errors.motAmountPaid || 'Tax amount included in total'}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Vendor (Optional)"
              value={formData.vendor}
              onChange={handleChange('vendor')}
              placeholder="e.g., Atlantic Aviation"
            />
          </Grid>
          
          {/* Receipt Image Upload */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Receipt Image (Optional)
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
              id="receipt-image-upload"
            />
            
            {formData.receiptImageUrl ? (
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Box
                  component="img"
                  src={formData.receiptImageUrl}
                  alt="Receipt"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 200,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={handleRemoveImage}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'background.paper',
                    '&:hover': { backgroundColor: 'error.light', color: 'white' },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={() => fileInputRef.current?.click()}
                sx={{ mt: 1 }}
              >
                Upload Receipt Image
              </Button>
            )}
            {errors.receiptImage && (
              <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                {errors.receiptImage}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
              Max file size: 2MB. Supported formats: JPG, PNG, GIF
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          {receipt ? 'Save Changes' : 'Add Receipt'}
        </Button>
      </DialogActions>
    </form>
  );
}
