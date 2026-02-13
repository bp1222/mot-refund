import { v4 as uuidv4 } from 'uuid';
import { addDays, subDays, format } from 'date-fns';
import type {
  User,
  Aircraft,
  AircraftDocument,
  Owner,
  AircraftOwnership,
  ManagementCompany,
  AircraftManagement,
  Client,
  ClientEngagement,
  Flight,
  FuelReceipt,
} from '../types';

// Helper to format date as ISO string
const toISODate = (date: Date): string => format(date, 'yyyy-MM-dd');

// Generate consistent IDs for relationships
const userIds = {
  admin: uuidv4(),
  dataEntry: uuidv4(),
  viewer: uuidv4(),
};

const aircraftIds = {
  ac1: uuidv4(),
  ac2: uuidv4(),
  ac3: uuidv4(),
  ac4: uuidv4(),
  ac5: uuidv4(),
};

const ownerIds = {
  owner1: uuidv4(),
  owner2: uuidv4(),
  owner3: uuidv4(),
};

const managementCompanyIds = {
  mc1: uuidv4(),
  mc2: uuidv4(),
};

const clientIds = {
  client1: uuidv4(),
  client2: uuidv4(),
  client3: uuidv4(),
  client4: uuidv4(),
};

// Seed Users
export const seedUsers: User[] = [
  {
    id: userIds.admin,
    username: 'admin',
    password: 'admin123',
    name: 'System Administrator',
    role: 'administrator',
  },
  {
    id: userIds.dataEntry,
    username: 'dataentry',
    password: 'data123',
    name: 'Data Entry User',
    role: 'data-entry',
  },
  {
    id: userIds.viewer,
    username: 'viewer',
    password: 'view123',
    name: 'Report Viewer',
    role: 'viewer',
  },
];

// Seed Aircraft
export const seedAircraft: Aircraft[] = [
  {
    id: aircraftIds.ac1,
    tailNumber: 'N123AB',
    make: 'Cessna',
    model: 'Citation CJ3',
    yearOfManufacture: 2018,
  },
  {
    id: aircraftIds.ac2,
    tailNumber: 'N456CD',
    make: 'Gulfstream',
    model: 'G650',
    yearOfManufacture: 2020,
  },
  {
    id: aircraftIds.ac3,
    tailNumber: 'N789EF',
    make: 'Bombardier',
    model: 'Challenger 350',
    yearOfManufacture: 2019,
  },
  {
    id: aircraftIds.ac4,
    tailNumber: 'N321GH',
    make: 'Embraer',
    model: 'Phenom 300',
    yearOfManufacture: 2021,
  },
  {
    id: aircraftIds.ac5,
    tailNumber: 'N654IJ',
    make: 'Dassault',
    model: 'Falcon 900',
    yearOfManufacture: 2017,
  },
];

// Seed Aircraft Documents
const today = new Date();
export const seedDocuments: AircraftDocument[] = [
  // N123AB - All documents valid
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac1,
    type: 'registration',
    validFrom: toISODate(subDays(today, 365)),
    validTo: toISODate(addDays(today, 365)),
    documentNumber: 'REG-2024-001',
  },
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac1,
    type: 'airworthiness',
    validFrom: toISODate(subDays(today, 180)),
    validTo: toISODate(addDays(today, 185)),
    documentNumber: 'AWC-2024-001',
  },
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac1,
    type: 'insurance',
    validFrom: toISODate(subDays(today, 90)),
    validTo: toISODate(addDays(today, 275)),
    documentNumber: 'INS-2024-001',
  },
  
  // N456CD - Insurance expiring soon (within 30 days)
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac2,
    type: 'registration',
    validFrom: toISODate(subDays(today, 400)),
    validTo: toISODate(addDays(today, 330)),
    documentNumber: 'REG-2024-002',
  },
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac2,
    type: 'airworthiness',
    validFrom: toISODate(subDays(today, 200)),
    validTo: toISODate(addDays(today, 165)),
    documentNumber: 'AWC-2024-002',
  },
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac2,
    type: 'insurance',
    validFrom: toISODate(subDays(today, 340)),
    validTo: toISODate(addDays(today, 20)), // Expiring soon!
    documentNumber: 'INS-2024-002',
  },
  
  // N789EF - Missing airworthiness document
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac3,
    type: 'registration',
    validFrom: toISODate(subDays(today, 300)),
    validTo: toISODate(addDays(today, 430)),
    documentNumber: 'REG-2024-003',
  },
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac3,
    type: 'insurance',
    validFrom: toISODate(subDays(today, 60)),
    validTo: toISODate(addDays(today, 305)),
    documentNumber: 'INS-2024-003',
  },
  // No airworthiness for N789EF - will trigger alert
  
  // N321GH - All documents valid
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac4,
    type: 'registration',
    validFrom: toISODate(subDays(today, 150)),
    validTo: toISODate(addDays(today, 215)),
    documentNumber: 'REG-2024-004',
  },
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac4,
    type: 'airworthiness',
    validFrom: toISODate(subDays(today, 120)),
    validTo: toISODate(addDays(today, 245)),
    documentNumber: 'AWC-2024-004',
  },
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac4,
    type: 'insurance',
    validFrom: toISODate(subDays(today, 100)),
    validTo: toISODate(addDays(today, 265)),
    documentNumber: 'INS-2024-004',
  },
  
  // N654IJ - Registration expiring very soon
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac5,
    type: 'registration',
    validFrom: toISODate(subDays(today, 360)),
    validTo: toISODate(addDays(today, 5)), // Expiring very soon!
    documentNumber: 'REG-2024-005',
  },
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac5,
    type: 'airworthiness',
    validFrom: toISODate(subDays(today, 180)),
    validTo: toISODate(addDays(today, 185)),
    documentNumber: 'AWC-2024-005',
  },
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac5,
    type: 'insurance',
    validFrom: toISODate(subDays(today, 270)),
    validTo: toISODate(addDays(today, 95)),
    documentNumber: 'INS-2024-005',
  },
];

// Seed Owners
export const seedOwners: Owner[] = [
  {
    id: ownerIds.owner1,
    name: 'Skyward Holdings LLC',
    email: 'contact@skywardholdings.com',
    phone: '+1-555-0101',
    address: '100 Aviation Blvd, New York, NY 10001',
  },
  {
    id: ownerIds.owner2,
    name: 'Executive Air Partners',
    email: 'info@executiveair.com',
    phone: '+1-555-0102',
    address: '200 Flight Way, Los Angeles, CA 90001',
  },
  {
    id: ownerIds.owner3,
    name: 'Global Jets International',
    email: 'operations@globaljets.com',
    phone: '+1-555-0103',
    address: '300 Runway Drive, Miami, FL 33101',
  },
];

// Seed Aircraft Ownerships
export const seedOwnerships: AircraftOwnership[] = [
  // N123AB owned by Owner 1
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac1,
    ownerId: ownerIds.owner1,
    startDate: toISODate(subDays(today, 730)),
    endDate: undefined, // Current owner
  },
  // N456CD owned by Owner 2
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac2,
    ownerId: ownerIds.owner2,
    startDate: toISODate(subDays(today, 500)),
    endDate: undefined,
  },
  // N789EF - previous owner
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac3,
    ownerId: ownerIds.owner1,
    startDate: toISODate(subDays(today, 1000)),
    endDate: toISODate(subDays(today, 400)),
  },
  // N789EF - current owner
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac3,
    ownerId: ownerIds.owner3,
    startDate: toISODate(subDays(today, 400)),
    endDate: undefined,
  },
  // N321GH owned by Owner 2
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac4,
    ownerId: ownerIds.owner2,
    startDate: toISODate(subDays(today, 300)),
    endDate: undefined,
  },
  // N654IJ owned by Owner 3
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac5,
    ownerId: ownerIds.owner3,
    startDate: toISODate(subDays(today, 600)),
    endDate: undefined,
  },
];

// Seed Management Companies
export const seedManagementCompanies: ManagementCompany[] = [
  {
    id: managementCompanyIds.mc1,
    name: 'Premier Aviation Management',
    email: 'ops@premieraviation.com',
    phone: '+1-555-0201',
    address: '500 Hangar Lane, Chicago, IL 60601',
  },
  {
    id: managementCompanyIds.mc2,
    name: 'Elite Flight Services',
    email: 'dispatch@eliteflights.com',
    phone: '+1-555-0202',
    address: '600 Terminal Road, Dallas, TX 75201',
  },
];

// Seed Aircraft Managements
export const seedAircraftManagements: AircraftManagement[] = [
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac1,
    managementCompanyId: managementCompanyIds.mc1,
    startDate: toISODate(subDays(today, 500)),
    endDate: undefined,
  },
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac2,
    managementCompanyId: managementCompanyIds.mc1,
    startDate: toISODate(subDays(today, 400)),
    endDate: undefined,
  },
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac3,
    managementCompanyId: managementCompanyIds.mc2,
    startDate: toISODate(subDays(today, 350)),
    endDate: undefined,
  },
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac4,
    managementCompanyId: managementCompanyIds.mc2,
    startDate: toISODate(subDays(today, 200)),
    endDate: undefined,
  },
  {
    id: uuidv4(),
    aircraftId: aircraftIds.ac5,
    managementCompanyId: managementCompanyIds.mc1,
    startDate: toISODate(subDays(today, 450)),
    endDate: undefined,
  },
];

// Seed Clients
export const seedClients: Client[] = [
  {
    id: clientIds.client1,
    name: 'Acme Corporation',
    email: 'travel@acme.com',
    phone: '+1-555-0301',
  },
  {
    id: clientIds.client2,
    name: 'Tech Ventures Inc',
    email: 'executive@techventures.com',
    phone: '+1-555-0302',
  },
  {
    id: clientIds.client3,
    name: 'Global Finance Group',
    email: 'aviation@globalfinance.com',
    phone: '+1-555-0303',
  },
  {
    id: clientIds.client4,
    name: 'Sports Entertainment LLC',
    email: 'travel@sportsent.com',
    phone: '+1-555-0304',
  },
];

// Seed Client Engagements
export const seedClientEngagements: ClientEngagement[] = [
  {
    id: uuidv4(),
    clientId: clientIds.client1,
    managementCompanyId: managementCompanyIds.mc1,
    startDate: toISODate(subDays(today, 400)),
    endDate: undefined,
  },
  {
    id: uuidv4(),
    clientId: clientIds.client2,
    managementCompanyId: managementCompanyIds.mc1,
    startDate: toISODate(subDays(today, 300)),
    endDate: undefined,
  },
  {
    id: uuidv4(),
    clientId: clientIds.client3,
    managementCompanyId: managementCompanyIds.mc2,
    startDate: toISODate(subDays(today, 250)),
    endDate: undefined,
  },
  {
    id: uuidv4(),
    clientId: clientIds.client4,
    managementCompanyId: managementCompanyIds.mc2,
    startDate: toISODate(subDays(today, 200)),
    endDate: undefined,
  },
];

// Generate flight IDs for receipts
const flightIds = Array.from({ length: 15 }, () => uuidv4());

// Seed Flights
export const seedFlights: Flight[] = [
  {
    id: flightIds[0],
    aircraftId: aircraftIds.ac1,
    clientId: clientIds.client1,
    flightDate: toISODate(subDays(today, 60)),
    departure: 'KJFK',
    arrival: 'KLAX',
  },
  {
    id: flightIds[1],
    aircraftId: aircraftIds.ac1,
    clientId: clientIds.client1,
    flightDate: toISODate(subDays(today, 55)),
    departure: 'KLAX',
    arrival: 'KORD',
  },
  {
    id: flightIds[2],
    aircraftId: aircraftIds.ac2,
    clientId: clientIds.client2,
    flightDate: toISODate(subDays(today, 50)),
    departure: 'KTEB',
    arrival: 'KMIA',
  },
  {
    id: flightIds[3],
    aircraftId: aircraftIds.ac2,
    clientId: clientIds.client2,
    flightDate: toISODate(subDays(today, 45)),
    departure: 'KMIA',
    arrival: 'KDFW',
  },
  {
    id: flightIds[4],
    aircraftId: aircraftIds.ac3,
    clientId: clientIds.client3,
    flightDate: toISODate(subDays(today, 40)),
    departure: 'KSFO',
    arrival: 'KLAS',
  },
  {
    id: flightIds[5],
    aircraftId: aircraftIds.ac3,
    clientId: clientIds.client3,
    flightDate: toISODate(subDays(today, 35)),
    departure: 'KLAS',
    arrival: 'KDEN',
  },
  {
    id: flightIds[6],
    aircraftId: aircraftIds.ac4,
    clientId: clientIds.client4,
    flightDate: toISODate(subDays(today, 30)),
    departure: 'KATL',
    arrival: 'KBOS',
  },
  {
    id: flightIds[7],
    aircraftId: aircraftIds.ac4,
    clientId: clientIds.client4,
    flightDate: toISODate(subDays(today, 25)),
    departure: 'KBOS',
    arrival: 'KPHL',
  },
  {
    id: flightIds[8],
    aircraftId: aircraftIds.ac5,
    clientId: clientIds.client1,
    flightDate: toISODate(subDays(today, 20)),
    departure: 'KIAD',
    arrival: 'KMSP',
  },
  {
    id: flightIds[9],
    aircraftId: aircraftIds.ac5,
    clientId: clientIds.client2,
    flightDate: toISODate(subDays(today, 15)),
    departure: 'KMSP',
    arrival: 'KSEA',
  },
  {
    id: flightIds[10],
    aircraftId: aircraftIds.ac1,
    clientId: clientIds.client3,
    flightDate: toISODate(subDays(today, 10)),
    departure: 'KORD',
    arrival: 'KJFK',
  },
  {
    id: flightIds[11],
    aircraftId: aircraftIds.ac2,
    clientId: clientIds.client4,
    flightDate: toISODate(subDays(today, 8)),
    departure: 'KDFW',
    arrival: 'KPHX',
  },
  {
    id: flightIds[12],
    aircraftId: aircraftIds.ac3,
    clientId: clientIds.client1,
    flightDate: toISODate(subDays(today, 5)),
    departure: 'KDEN',
    arrival: 'KSAN',
  },
  {
    id: flightIds[13],
    aircraftId: aircraftIds.ac4,
    clientId: clientIds.client2,
    flightDate: toISODate(subDays(today, 3)),
    departure: 'KPHL',
    arrival: 'KDCA',
  },
  {
    id: flightIds[14],
    aircraftId: aircraftIds.ac5,
    clientId: clientIds.client3,
    flightDate: toISODate(subDays(today, 1)),
    departure: 'KSEA',
    arrival: 'KPDX',
  },
];

// Seed Fuel Receipts (receiptTotal = fuelLiters * ~$0.85/L average price + MOT)
export const seedFuelReceipts: FuelReceipt[] = [
  {
    id: uuidv4(),
    flightId: flightIds[0],
    receiptDate: toISODate(subDays(today, 60)),
    fuelLiters: 2500,
    receiptTotal: 2250.50,
    motAmountPaid: 125.50,
    receiptNumber: 'FR-2024-001',
    vendor: 'Atlantic Aviation',
  },
  {
    id: uuidv4(),
    flightId: flightIds[1],
    receiptDate: toISODate(subDays(today, 55)),
    fuelLiters: 2200,
    receiptTotal: 1980.25,
    motAmountPaid: 110.25,
    receiptNumber: 'FR-2024-002',
    vendor: 'Signature Flight Support',
  },
  {
    id: uuidv4(),
    flightId: flightIds[2],
    receiptDate: toISODate(subDays(today, 50)),
    fuelLiters: 4500,
    receiptTotal: 4050.75,
    motAmountPaid: 225.75,
    receiptNumber: 'FR-2024-003',
    vendor: 'Million Air',
  },
  {
    id: uuidv4(),
    flightId: flightIds[3],
    receiptDate: toISODate(subDays(today, 45)),
    fuelLiters: 3800,
    receiptTotal: 3420.00,
    motAmountPaid: 190.00,
    receiptNumber: 'FR-2024-004',
    vendor: 'Jet Aviation',
  },
  {
    id: uuidv4(),
    flightId: flightIds[4],
    receiptDate: toISODate(subDays(today, 40)),
    fuelLiters: 2800,
    receiptTotal: 2520.50,
    motAmountPaid: 140.50,
    receiptNumber: 'FR-2024-005',
    vendor: 'Landmark Aviation',
  },
  {
    id: uuidv4(),
    flightId: flightIds[5],
    receiptDate: toISODate(subDays(today, 35)),
    fuelLiters: 2100,
    receiptTotal: 1890.25,
    motAmountPaid: 105.25,
    receiptNumber: 'FR-2024-006',
    vendor: 'Atlantic Aviation',
  },
  {
    id: uuidv4(),
    flightId: flightIds[6],
    receiptDate: toISODate(subDays(today, 30)),
    fuelLiters: 1800,
    receiptTotal: 1620.00,
    motAmountPaid: 90.00,
    receiptNumber: 'FR-2024-007',
    vendor: 'Signature Flight Support',
  },
  {
    id: uuidv4(),
    flightId: flightIds[7],
    receiptDate: toISODate(subDays(today, 25)),
    fuelLiters: 1500,
    receiptTotal: 1350.50,
    motAmountPaid: 75.50,
    receiptNumber: 'FR-2024-008',
    vendor: 'Million Air',
  },
  {
    id: uuidv4(),
    flightId: flightIds[8],
    receiptDate: toISODate(subDays(today, 20)),
    fuelLiters: 3200,
    receiptTotal: 2880.00,
    motAmountPaid: 160.00,
    receiptNumber: 'FR-2024-009',
    vendor: 'Jet Aviation',
  },
  {
    id: uuidv4(),
    flightId: flightIds[9],
    receiptDate: toISODate(subDays(today, 15)),
    fuelLiters: 2900,
    receiptTotal: 2610.75,
    motAmountPaid: 145.75,
    receiptNumber: 'FR-2024-010',
    vendor: 'Landmark Aviation',
  },
  {
    id: uuidv4(),
    flightId: flightIds[10],
    receiptDate: toISODate(subDays(today, 10)),
    fuelLiters: 2400,
    receiptTotal: 2160.00,
    motAmountPaid: 120.00,
    receiptNumber: 'FR-2024-011',
    vendor: 'Atlantic Aviation',
  },
  {
    id: uuidv4(),
    flightId: flightIds[11],
    receiptDate: toISODate(subDays(today, 8)),
    fuelLiters: 3500,
    receiptTotal: 3150.25,
    motAmountPaid: 175.25,
    receiptNumber: 'FR-2024-012',
    vendor: 'Signature Flight Support',
  },
  {
    id: uuidv4(),
    flightId: flightIds[12],
    receiptDate: toISODate(subDays(today, 5)),
    fuelLiters: 2000,
    receiptTotal: 1800.50,
    motAmountPaid: 100.50,
    receiptNumber: 'FR-2024-013',
    vendor: 'Million Air',
  },
  {
    id: uuidv4(),
    flightId: flightIds[13],
    receiptDate: toISODate(subDays(today, 3)),
    fuelLiters: 1200,
    receiptTotal: 1080.00,
    motAmountPaid: 60.00,
    receiptNumber: 'FR-2024-014',
    vendor: 'Jet Aviation',
  },
  {
    id: uuidv4(),
    flightId: flightIds[14],
    receiptDate: toISODate(subDays(today, 1)),
    fuelLiters: 1600,
    receiptTotal: 1440.25,
    motAmountPaid: 80.25,
    receiptNumber: 'FR-2024-015',
    vendor: 'Landmark Aviation',
  },
];

// Export all seed data as a single object
export const allSeedData = {
  users: seedUsers,
  aircraft: seedAircraft,
  documents: seedDocuments,
  owners: seedOwners,
  ownerships: seedOwnerships,
  managementCompanies: seedManagementCompanies,
  aircraftManagements: seedAircraftManagements,
  clients: seedClients,
  clientEngagements: seedClientEngagements,
  flights: seedFlights,
  fuelReceipts: seedFuelReceipts,
};
