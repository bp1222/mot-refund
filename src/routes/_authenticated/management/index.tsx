import { createFileRoute } from '@tanstack/react-router';
import { ManagementCompanyList } from '../../../components/management/ManagementCompanyList';

export const Route = createFileRoute('/_authenticated/management/')({
  component: ManagementCompanyList,
});
