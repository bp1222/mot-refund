# MOT Refund System

Aviation Fuel Tax (MOT) Refund Tracking and Management System

## Overview

This system helps track and manage MOT (mineral oil tax) refunds for aviation fuel. It provides comprehensive tracking of:

- **Aircraft** - Track aircraft with tail numbers, make, model, year, and associated documents
- **Owners** - Manage aircraft owners and ownership history
- **Management Companies** - Track companies that manage aircraft operations
- **Clients** - Manage clients who use aircraft through management companies
- **Flights** - Record flight details with departure/arrival information
- **Fuel Receipts** - Track fuel uplift with actual MOT tax amounts paid
- **Reports** - Generate MOT refund reports with filtering capabilities

## Features

- **Document Tracking**: Track registration, airworthiness, and insurance documents with expiration alerts
- **Dashboard**: Overview of system status with document expiration alerts
- **Role-Based Access Control**: Administrator, Data Entry, and Viewer roles
- **MOT Refund Reports**: Filter by aircraft, owner, management company, client, and date range
- **CSV Export**: Export reports for external processing
- **Local Storage Persistence**: Prototype uses browser localStorage with seed data

## Technology Stack

- **React 18** with TypeScript
- **TanStack Router** for type-safe routing
- **TanStack Query** for data fetching (prepared for future backend)
- **Zustand** for state management
- **Material UI (MUI)** for components
- **date-fns** for date handling

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Demo Credentials

The system comes with seed data and three user accounts:

| Role | Username | Password |
|------|----------|----------|
| Administrator | admin | admin123 |
| Data Entry | dataentry | data123 |
| Viewer | viewer | view123 |

## User Roles

- **Administrator**: Full access to all features including data reset
- **Data Entry**: Can create/edit flights, receipts, and lookup entities
- **Viewer**: Read-only access to all data and reports

## Project Structure

```
src/
├── components/          # React components
│   ├── aircraft/       # Aircraft management components
│   ├── auth/           # Authentication components
│   ├── clients/        # Client management components
│   ├── dashboard/      # Dashboard components
│   ├── flights/        # Flight and receipt components
│   ├── layout/         # Layout components (Navbar, Sidebar)
│   ├── management/     # Management company components
│   ├── owners/         # Owner management components
│   └── reports/        # Report components
├── routes/             # TanStack Router route definitions
├── store/              # Zustand stores
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Data Storage

This prototype uses browser localStorage for data persistence. The "Reset Data" button (available to administrators) will clear all data and restore the original seed data.

In a production environment, this would be replaced with a backend API and database.

## License

Private - Internal Use Only
