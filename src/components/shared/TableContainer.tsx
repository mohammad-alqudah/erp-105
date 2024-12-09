import React from 'react';
import Table from './Table';
import PageHeader from './PageHeader';
import Button from './Button';
import { LucideIcon } from 'lucide-react';

interface TableContainerProps {
  title: string;
  columns: Array<{
    header: string;
    accessor: string;
    render?: (value: any) => React.ReactNode;
  }>;
  data: any[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onAdd?: () => void;
  addButtonLabel?: string;
  addButtonIcon?: LucideIcon;
}

export default function TableContainer({
  title,
  columns,
  data,
  isLoading,
  page,
  totalPages,
  onPageChange,
  onAdd,
  addButtonLabel,
  addButtonIcon: Icon,
}: TableContainerProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <PageHeader
        title={title}
        action={
          onAdd && (
            <Button
              variant="primary"
              icon={Icon}
              onClick={onAdd}
            >
              {addButtonLabel}
            </Button>
          )
        }
      />

      <Table columns={columns} data={data} />

      <div className="mt-4 flex justify-between items-center">
        <Button
          variant="secondary"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages || 1}
        </span>
        <Button
          variant="secondary"
          onClick={() => onPageChange(page + 1)}
          disabled={!totalPages || page >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}