import React, { useState } from 'react';
import { MessageSquarePlus, History } from 'lucide-react';
import { format } from 'date-fns';
import ActionForm from './ActionForm';
import ViewActionModal from './ViewActionModal';
import HistoryModal from './HistoryModal';
import { mockActions } from '../../utils/mockData';
import TableContainer from '../shared/TableContainer';
import ActionButtons from '../shared/ActionButtons';

export default function ActionsTable() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [editingAction, setEditingAction] = useState(null);

  const handleDelete = (id: string) => {
    // Implement delete functionality
    console.log('Delete action:', id);
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Condition', accessor: 'condition' },
    { header: 'Survey', accessor: 'includeSurvey', render: (value: boolean) => value ? 'Yes' : 'No' },
    {
      header: 'Created At',
      accessor: 'createdAt',
      render: (value: string) => format(new Date(value), 'MMM d, yyyy HH:mm'),
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (id: string) => (
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setSelectedActionId(id);
              setIsHistoryModalOpen(true);
            }}
            className="text-blue-600 hover:text-blue-900"
            title="View History"
          >
            <History size={20} />
          </button>
          <ActionButtons
            onView={() => {
              setSelectedActionId(id);
              setIsViewModalOpen(true);
            }}
            onEdit={() => {
              const action = mockActions.find(a => a.id === id);
              setEditingAction(action);
              setIsFormOpen(true);
            }}
            onDelete={() => handleDelete(id)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <TableContainer
        title="Messaging Actions"
        columns={columns}
        data={mockActions}
        isLoading={false}
        page={1}
        totalPages={1}
        onPageChange={() => {}}
        onAdd={() => {
          setEditingAction(null);
          setIsFormOpen(true);
        }}
        addButtonLabel="Add Action"
        addButtonIcon={MessageSquarePlus}
      />

      {isFormOpen && (
        <ActionForm
          action={editingAction}
          onClose={() => {
            setIsFormOpen(false);
            setEditingAction(null);
          }}
        />
      )}

      {isViewModalOpen && selectedActionId && (
        <ViewActionModal
          actionId={selectedActionId}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedActionId(null);
          }}
        />
      )}

      {isHistoryModalOpen && selectedActionId && (
        <HistoryModal
          actionId={selectedActionId}
          onClose={() => {
            setIsHistoryModalOpen(false);
            setSelectedActionId(null);
          }}
        />
      )}
    </>
  );
}