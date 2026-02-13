import { createFileRoute } from '@tanstack/react-router';
import { FlightList } from '../../../components/flights/FlightList';

export const Route = createFileRoute('/_authenticated/flights/')({
  component: FlightList,
});
