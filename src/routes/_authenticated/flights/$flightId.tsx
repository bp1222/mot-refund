import { createFileRoute } from '@tanstack/react-router';
import { FlightDetail } from '../../../components/flights/FlightDetail';

export const Route = createFileRoute('/_authenticated/flights/$flightId')({
  component: FlightDetail,
});
