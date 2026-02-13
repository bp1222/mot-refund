// User and Authentication Types
export type UserRole = 'administrator' | 'data-entry' | 'viewer';

export interface User {
  id: string;
  username: string;
  password: string; // In production, this would be hashed
  name: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Aircraft Types
export interface Aircraft {
  id: string;
  tailNumber: string;
  make: string;
  model: string;
  yearOfManufacture: number;
}

export type DocumentType = 'registration' | 'airworthiness' | 'insurance';

export interface AircraftDocument {
  id: string;
  aircraftId: string;
  type: DocumentType;
  validFrom: string; // ISO date string
  validTo: string; // ISO date string
  documentUrl?: string;
  documentNumber?: string;
}

// Owner Types
export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface AircraftOwnership {
  id: string;
  aircraftId: string;
  ownerId: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string, null if current owner
}

// Management Company Types
export interface ManagementCompany {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface AircraftManagement {
  id: string;
  aircraftId: string;
  managementCompanyId: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string, null if currently managed
}

// Client Types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ClientEngagement {
  id: string;
  clientId: string;
  managementCompanyId: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string, null if currently engaged
}

// Flight and Fuel Receipt Types
export interface Flight {
  id: string;
  aircraftId: string;
  clientId?: string;
  flightDate: string; // ISO date string
  departure: string;
  arrival: string;
  notes?: string;
}

export interface FuelReceipt {
  id: string;
  flightId: string;
  receiptDate: string; // ISO date string
  fuelLiters: number;
  motAmountPaid: number; // Actual MOT tax amount paid
  receiptTotal: number; // Total amount on the receipt
  receiptNumber: string;
  vendor?: string;
  receiptImageUrl?: string; // Base64 data URL or external URL for receipt image
}

// Document Alert Types
export type AlertSeverity = 'error' | 'warning' | 'info';

export interface DocumentAlert {
  id: string;
  aircraftId: string;
  tailNumber: string;
  documentType: DocumentType;
  severity: AlertSeverity;
  message: string;
  expirationDate?: string;
}

// Report Types
export interface ReportFilters {
  startDate: string;
  endDate: string;
  aircraftIds?: string[];
  ownerIds?: string[];
  managementCompanyIds?: string[];
  clientIds?: string[];
}

export interface ReportRow {
  flightId: string;
  flightDate: string;
  aircraftId: string;
  tailNumber: string;
  departure: string;
  arrival: string;
  clientName?: string;
  ownerName?: string;
  managementCompanyName?: string;
  fuelLiters: number;
  motAmountPaid: number;
}

export interface ReportSummary {
  totalFlights: number;
  totalFuelLiters: number;
  totalMotPaid: number;
  rows: ReportRow[];
}

// Store State Types
export interface AircraftStore {
  aircraft: Aircraft[];
  documents: AircraftDocument[];
  ownerships: AircraftOwnership[];
  managements: AircraftManagement[];
  
  // Actions
  addAircraft: (aircraft: Aircraft) => void;
  updateAircraft: (id: string, aircraft: Partial<Aircraft>) => void;
  deleteAircraft: (id: string) => void;
  
  addDocument: (document: AircraftDocument) => void;
  updateDocument: (id: string, document: Partial<AircraftDocument>) => void;
  deleteDocument: (id: string) => void;
  
  addOwnership: (ownership: AircraftOwnership) => void;
  updateOwnership: (id: string, ownership: Partial<AircraftOwnership>) => void;
  deleteOwnership: (id: string) => void;
  
  addManagement: (management: AircraftManagement) => void;
  updateManagement: (id: string, management: Partial<AircraftManagement>) => void;
  deleteManagement: (id: string) => void;
  
  setAircraft: (aircraft: Aircraft[]) => void;
  setDocuments: (documents: AircraftDocument[]) => void;
  setOwnerships: (ownerships: AircraftOwnership[]) => void;
  setManagements: (managements: AircraftManagement[]) => void;
}

export interface OwnerStore {
  owners: Owner[];
  
  addOwner: (owner: Owner) => void;
  updateOwner: (id: string, owner: Partial<Owner>) => void;
  deleteOwner: (id: string) => void;
  setOwners: (owners: Owner[]) => void;
}

export interface ManagementCompanyStore {
  companies: ManagementCompany[];
  
  addCompany: (company: ManagementCompany) => void;
  updateCompany: (id: string, company: Partial<ManagementCompany>) => void;
  deleteCompany: (id: string) => void;
  setCompanies: (companies: ManagementCompany[]) => void;
}

export interface ClientStore {
  clients: Client[];
  engagements: ClientEngagement[];
  
  addClient: (client: Client) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  addEngagement: (engagement: ClientEngagement) => void;
  updateEngagement: (id: string, engagement: Partial<ClientEngagement>) => void;
  deleteEngagement: (id: string) => void;
  
  setClients: (clients: Client[]) => void;
  setEngagements: (engagements: ClientEngagement[]) => void;
}

export interface FlightStore {
  flights: Flight[];
  fuelReceipts: FuelReceipt[];
  
  addFlight: (flight: Flight) => void;
  updateFlight: (id: string, flight: Partial<Flight>) => void;
  deleteFlight: (id: string) => void;
  
  addFuelReceipt: (receipt: FuelReceipt) => void;
  updateFuelReceipt: (id: string, receipt: Partial<FuelReceipt>) => void;
  deleteFuelReceipt: (id: string) => void;
  
  setFlights: (flights: Flight[]) => void;
  setFuelReceipts: (receipts: FuelReceipt[]) => void;
}
