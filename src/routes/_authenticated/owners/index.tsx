import { createFileRoute } from '@tanstack/react-router';
import { OwnerList } from '../../../components/owners/OwnerList';

export const Route = createFileRoute('/_authenticated/owners/')({
  component: OwnerList,
});
