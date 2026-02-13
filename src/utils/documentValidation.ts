import { parseISO, isWithinInterval, addDays, isBefore, isAfter } from 'date-fns';
import type {
  Aircraft,
  AircraftDocument,
  DocumentAlert,
  DocumentType,
  Flight,
} from '../types';

const DOCUMENT_TYPES: DocumentType[] = ['registration', 'airworthiness', 'insurance'];
const EXPIRATION_WARNING_DAYS = 30;

/**
 * Check if a document is currently valid
 */
export function isDocumentValid(document: AircraftDocument, referenceDate: Date = new Date()): boolean {
  const validFrom = parseISO(document.validFrom);
  const validTo = parseISO(document.validTo);
  
  return isWithinInterval(referenceDate, { start: validFrom, end: validTo });
}

/**
 * Check if a document is expiring soon (within the warning period)
 */
export function isDocumentExpiringSoon(
  document: AircraftDocument,
  warningDays: number = EXPIRATION_WARNING_DAYS,
  referenceDate: Date = new Date()
): boolean {
  const validTo = parseISO(document.validTo);
  const warningDate = addDays(referenceDate, warningDays);
  
  return isAfter(validTo, referenceDate) && isBefore(validTo, warningDate);
}

/**
 * Check if a document has expired
 */
export function isDocumentExpired(document: AircraftDocument, referenceDate: Date = new Date()): boolean {
  const validTo = parseISO(document.validTo);
  return isBefore(validTo, referenceDate);
}

/**
 * Get the current valid document of a specific type for an aircraft
 */
export function getCurrentDocument(
  documents: AircraftDocument[],
  aircraftId: string,
  type: DocumentType,
  referenceDate: Date = new Date()
): AircraftDocument | undefined {
  return documents.find(
    (doc) =>
      doc.aircraftId === aircraftId &&
      doc.type === type &&
      isDocumentValid(doc, referenceDate)
  );
}

/**
 * Check if an aircraft has valid coverage for a specific date
 */
export function hasValidCoverage(
  documents: AircraftDocument[],
  aircraftId: string,
  date: Date
): { valid: boolean; missingTypes: DocumentType[] } {
  const missingTypes: DocumentType[] = [];
  
  for (const type of DOCUMENT_TYPES) {
    const hasValid = documents.some(
      (doc) =>
        doc.aircraftId === aircraftId &&
        doc.type === type &&
        isDocumentValid(doc, date)
    );
    if (!hasValid) {
      missingTypes.push(type);
    }
  }
  
  return {
    valid: missingTypes.length === 0,
    missingTypes,
  };
}

/**
 * Check if a flight has valid document coverage
 */
export function flightHasValidCoverage(
  documents: AircraftDocument[],
  flight: Flight
): { valid: boolean; missingTypes: DocumentType[] } {
  const flightDate = parseISO(flight.flightDate);
  return hasValidCoverage(documents, flight.aircraftId, flightDate);
}

/**
 * Generate document alerts for all aircraft
 */
export function generateDocumentAlerts(
  aircraft: Aircraft[],
  documents: AircraftDocument[],
  flights: Flight[] = []
): DocumentAlert[] {
  const alerts: DocumentAlert[] = [];
  const today = new Date();
  
  for (const ac of aircraft) {
    // Check for missing documents
    for (const type of DOCUMENT_TYPES) {
      const acDocs = documents.filter(
        (doc) => doc.aircraftId === ac.id && doc.type === type
      );
      
      if (acDocs.length === 0) {
        // No document of this type at all
        alerts.push({
          id: `${ac.id}-${type}-missing`,
          aircraftId: ac.id,
          tailNumber: ac.tailNumber,
          documentType: type,
          severity: 'error',
          message: `Missing ${type} document`,
        });
      } else {
        // Check for valid/expiring documents
        const validDoc = acDocs.find((doc) => isDocumentValid(doc, today));
        
        if (!validDoc) {
          // No valid document
          alerts.push({
            id: `${ac.id}-${type}-expired`,
            aircraftId: ac.id,
            tailNumber: ac.tailNumber,
            documentType: type,
            severity: 'error',
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} document has expired`,
          });
        } else if (isDocumentExpiringSoon(validDoc)) {
          // Document expiring soon
          alerts.push({
            id: `${ac.id}-${type}-expiring`,
            aircraftId: ac.id,
            tailNumber: ac.tailNumber,
            documentType: type,
            severity: 'warning',
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} document expiring soon`,
            expirationDate: validDoc.validTo,
          });
        }
      }
    }
  }
  
  // Check for flights with coverage gaps
  for (const flight of flights) {
    const coverage = flightHasValidCoverage(documents, flight);
    if (!coverage.valid) {
      const ac = aircraft.find((a) => a.id === flight.aircraftId);
      if (ac) {
        alerts.push({
          id: `${flight.id}-coverage-gap`,
          aircraftId: ac.id,
          tailNumber: ac.tailNumber,
          documentType: coverage.missingTypes[0],
          severity: 'warning',
          message: `Flight on ${flight.flightDate} has coverage gap for: ${coverage.missingTypes.join(', ')}`,
        });
      }
    }
  }
  
  return alerts;
}

/**
 * Get document status for an aircraft
 */
export function getAircraftDocumentStatus(
  documents: AircraftDocument[],
  aircraftId: string
): {
  type: DocumentType;
  status: 'valid' | 'expiring' | 'expired' | 'missing';
  document?: AircraftDocument;
}[] {
  const today = new Date();
  
  return DOCUMENT_TYPES.map((type) => {
    const docs = documents.filter(
      (doc) => doc.aircraftId === aircraftId && doc.type === type
    );
    
    if (docs.length === 0) {
      return { type, status: 'missing' as const };
    }
    
    const validDoc = docs.find((doc) => isDocumentValid(doc, today));
    
    if (!validDoc) {
      return { type, status: 'expired' as const, document: docs[0] };
    }
    
    if (isDocumentExpiringSoon(validDoc)) {
      return { type, status: 'expiring' as const, document: validDoc };
    }
    
    return { type, status: 'valid' as const, document: validDoc };
  });
}
