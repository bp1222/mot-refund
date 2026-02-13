import { createFileRoute } from '@tanstack/react-router';
import { MOTRefundReport } from '../../../components/reports/MOTRefundReport';

export const Route = createFileRoute('/_authenticated/reports/')({
  component: MOTRefundReport,
});
