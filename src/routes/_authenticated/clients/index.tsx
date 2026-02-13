import { createFileRoute } from '@tanstack/react-router';
import { ClientList } from '../../../components/clients/ClientList';

export const Route = createFileRoute('/_authenticated/clients/')({
  component: ClientList,
});
