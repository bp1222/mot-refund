import { useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { format, parseISO, differenceInDays } from 'date-fns';
import { useAircraftStore, useAuthStore } from '../../store';
import { DocumentForm } from './DocumentForm';
import type { AircraftDocument, DocumentType } from '../../types';

interface AircraftDocumentsProps {
  aircraftId: string;
}

export function AircraftDocuments({ aircraftId }: AircraftDocumentsProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<AircraftDocument | null>(null);
  
  const { documents, deleteDocument } = useAircraftStore();
  const { canEdit } = useAuthStore();
  
  const aircraftDocuments = documents.filter((d) => d.aircraftId === aircraftId);
  
  const handleAdd = () => {
    setEditingDocument(null);
    setFormOpen(true);
  };
  
  const handleEdit = (doc: AircraftDocument) => {
    setEditingDocument(doc);
    setFormOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteDocument(id);
    }
  };
  
  const handleFormClose = () => {
    setFormOpen(false);
    setEditingDocument(null);
  };
  
  const getDocumentTypeLabel = (type: DocumentType) => {
    const labels: Record<DocumentType, string> = {
      registration: 'Registration',
      airworthiness: 'Airworthiness',
      insurance: 'Insurance',
    };
    return labels[type];
  };
  
  const getStatusChip = (validTo: string) => {
    const today = new Date();
    const expirationDate = parseISO(validTo);
    const daysUntilExpiry = differenceInDays(expirationDate, today);
    
    if (daysUntilExpiry < 0) {
      return <Chip label="Expired" color="error" size="small" />;
    }
    if (daysUntilExpiry <= 30) {
      return (
        <Chip
          label={`Expires in ${daysUntilExpiry} days`}
          color="warning"
          size="small"
        />
      );
    }
    return <Chip label="Valid" color="success" size="small" />;
  };
  
  // Check for missing document types
  const documentTypes: DocumentType[] = ['registration', 'airworthiness', 'insurance'];
  const presentTypes = new Set(aircraftDocuments.map((d) => d.type));
  const missingTypes = documentTypes.filter((t) => !presentTypes.has(t));
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          {missingTypes.length > 0 && (
            <Typography variant="body2" color="error">
              Missing documents: {missingTypes.map(getDocumentTypeLabel).join(', ')}
            </Typography>
          )}
        </Box>
        {canEdit() && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            size="small"
          >
            Add Document
          </Button>
        )}
      </Box>
      
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Document Number</TableCell>
              <TableCell>Valid From</TableCell>
              <TableCell>Valid To</TableCell>
              <TableCell>Status</TableCell>
              {canEdit() && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {aircraftDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <Chip
                    label={getDocumentTypeLabel(doc.type)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{doc.documentNumber || '-'}</TableCell>
                <TableCell>{format(parseISO(doc.validFrom), 'MMM d, yyyy')}</TableCell>
                <TableCell>{format(parseISO(doc.validTo), 'MMM d, yyyy')}</TableCell>
                <TableCell>{getStatusChip(doc.validTo)}</TableCell>
                {canEdit() && (
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEdit(doc)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {aircraftDocuments.length === 0 && (
              <TableRow>
                <TableCell colSpan={canEdit() ? 6 : 5} align="center">
                  <Typography color="text.secondary" sx={{ py: 2 }}>
                    No documents found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Dialog open={formOpen} onClose={handleFormClose} maxWidth="sm" fullWidth>
        <DocumentForm
          aircraftId={aircraftId}
          document={editingDocument}
          onClose={handleFormClose}
        />
      </Dialog>
    </Box>
  );
}
