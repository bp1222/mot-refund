import { createFileRoute } from '@tanstack/react-router';
import { AircraftDetail } from '../../../components/aircraft/AircraftDetail';

export const Route = createFileRoute('/_authenticated/aircraft/$aircraftId')({
  component: AircraftDetail,
});
