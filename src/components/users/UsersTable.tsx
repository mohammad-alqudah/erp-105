import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/api/userApi';
import { User, CreateUserData, UpdateUserData } from '../../types/user';
import TableContainer from '../shared/TableContainer';
import ActionButtons from '../shared/ActionButtons';
import UserForm from './UserForm';
import { handleApiError } from '../../utils/errorHandling';

export default function UsersTable() {
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formError, setFormError] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: usersData, isLoading } = useQuery(
    ['users', page],
    () => getUsers(page),
    {
      keepPreviousData: true,
      onError: (error) => {
        toast.error(handleApiError(error));
      },
    }
  );

  const createMutation = useMutation(
    (data: CreateUserData) => createUser(data),
    {
      onSuccess: (response) => {
        if (response.status) {
          queryClient.invalidateQueries('users');
          toast.success('User created successfully');
          setIsFormOpen(false);
          setFormError('');
        } else {
          setFormError(response.detail || 'Failed to create user');
        }
      },
      onError: (error) => {
        setFormError(handleApiError(error));
      },
    }
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: UpdateUserData }) => updateUser(id, data),
    {
      onSuccess: (response) => {
        if (response.status) {
          queryClient.invalidateQueries('users');
          toast.success('User updated successfully');
          setIsFormOpen(false);
          setEditingUser(null);
          setFormError('');
        } else {
          setFormError(response.detail || 'Failed to update user');
        }
      },
      onError: (error) => {
        setFormError(handleApiError(error));
      },
    }
  );

  const deleteMutation = useMutation(
    (id: string) => deleteUser(id),
    {
      onSuccess: (response) => {
        if (response.status) {
          queryClient.invalidateQueries('users');
          toast.success('User deleted successfully');
        } else {
          toast.error(response.detail || 'Failed to delete user');
        }
      },
      onError: (error) => {
        toast.error(handleApiError(error));
      },
    }
  );

  const columns = [
    { header: 'Username', accessor: 'username' },
    { header: 'First Name', accessor: 'first_name' },
    { header: 'Last Name', accessor: 'last_name' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Actions',
      accessor: 'id',
      render: (id: string) => (
        <ActionButtons
          onEdit={() => {
            const user = usersData?.data.find(u => u.id === id);
            setEditingUser(user || null);
            setIsFormOpen(true);
            setFormError('');
          }}
          onDelete={() => {
            if (window.confirm('Are you sure you want to delete this user?')) {
              deleteMutation.mutate(id);
            }
          }}
        />
      ),
    },
  ];

  const handleSubmit = (formData: CreateUserData | UpdateUserData) => {
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data: formData });
    } else {
      createMutation.mutate(formData as CreateUserData);
    }
  };

  return (
    <>
      <TableContainer
        title="Users Management"
        columns={columns}
        data={usersData?.data || []}
        isLoading={isLoading}
        page={page}
        totalPages={Math.ceil((usersData?.count || 0) / 10)}
        onPageChange={setPage}
        onAdd={() => {
          setEditingUser(null);
          setIsFormOpen(true);
          setFormError('');
        }}
        addButtonLabel="Add User"
        addButtonIcon={UserPlus}
      />

      {isFormOpen && (
        <UserForm
          user={editingUser}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsFormOpen(false);
            setEditingUser(null);
            setFormError('');
          }}
          isLoading={createMutation.isLoading || updateMutation.isLoading}
          error={formError}
        />
      )}
    </>
  );
}