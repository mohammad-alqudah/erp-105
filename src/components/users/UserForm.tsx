import React from 'react';
import { User } from '../../types/user';
import Modal from '../shared/Modal';
import FormField from '../shared/FormField';
import Button from '../shared/Button';

interface UserFormProps {
  user?: User | null;
  onSubmit: (formData: any) => void;
  onClose: () => void;
  isLoading: boolean;
  error?: string;
}

export default function UserForm({ user, onSubmit, onClose, isLoading, error }: UserFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  return (
    <Modal title={user ? 'Edit User' : 'Add User'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <FormField
          label="Username"
          name="username"
          defaultValue={user?.username}
          required={!user}
          disabled={!!user}
        />

        {!user && (
          <FormField
            label="Password"
            name="password"
            type="password"
            required
          />
        )}

        <FormField
          label="First Name"
          name="first_name"
          defaultValue={user?.first_name}
          required
        />

        <FormField
          label="Last Name"
          name="last_name"
          defaultValue={user?.last_name}
          required
        />

        <FormField
          label="Email"
          name="email"
          type="email"
          defaultValue={user?.email || ''}
        />

        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : user ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}