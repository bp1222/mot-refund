import { createFileRoute } from '@tanstack/react-router';
import { AircraftList } from '../../../components/aircraft/AircraftList';

export const Route = createFileRoute('/_authenticated/aircraft/')({
  component: AircraftList,
});
