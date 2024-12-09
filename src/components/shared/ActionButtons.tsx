import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

export default function ActionButtons({ onEdit, onDelete, onView }: ActionButtonsProps) {
  return (
    <div className="flex space-x-3">
      <button
        onClick={onView}
        className="text-blue-600 hover:text-blue-900"
        title="View Details"
      >
        <Eye size={20} />
      </button>
      <button
        onClick={onEdit}
        className="text-indigo-600 hover:text-indigo-900"
        title="Edit"
      >
        <Edit size={20} />
      </button>
      <button
        onClick={onDelete}
        className="text-red-600 hover:text-red-900"
        title="Delete"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}