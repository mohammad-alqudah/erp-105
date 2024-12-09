import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../../services/api/customerApi';
import { Customer, CreateCustomerData, UpdateCustomerData } from '../../types/customer';
import TableContainer from '../shared/TableContainer';
import CustomerForm from './CustomerForm';
import { handleApiError } from '../../utils/errorHandling';
import ActionButtons from '../shared/ActionButtons';

export default function CustomersTable() {
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formError, setFormError] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: customersData, isLoading } = useQuery(
    ['customers', page],
    () => getCustomers(page),
    {
      keepPreviousData: true,
      onError: (error) => {
        toast.error(handleApiError(error));
      },
    }
  );

  const createMutation = useMutation(
    (data: CreateCustomerData) => createCustomer(data),
    {
      onSuccess: (response) => {
        if (response.status) {
          queryClient.invalidateQueries('customers');
          toast.success('Customer created successfully');
          setIsFormOpen(false);
          setFormError('');
        } else {
          setFormError(response.detail || 'Failed to create customer');
        }
      },
      onError: (error) => {
        setFormError(handleApiError(error));
      },
    }
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: UpdateCustomerData }) => updateCustomer(id, data),
    {
      onSuccess: (response) => {
        if (response.status) {
          queryClient.invalidateQueries('customers');
          toast.success('Customer updated successfully');
          setIsFormOpen(false);
          setEditingCustomer(null);
          setFormError('');
        } else {
          setFormError(response.detail || 'Failed to update customer');
        }
      },
      onError: (error) => {
        setFormError(handleApiError(error));
      },
    }
  );

  const deleteMutation = useMutation(
    (id: string) => deleteCustomer(id),
    {
      onSuccess: (response) => {
        if (response.status) {
          queryClient.invalidateQueries('customers');
          toast.success('Customer deleted successfully');
        } else {
          toast.error(response.detail || 'Failed to delete customer');
        }
      },
      onError: (error) => {
        toast.error(handleApiError(error));
      },
    }
  );

  const columns = [
    { header: 'First Name', accessor: 'first_name' },
    { header: 'Last Name', accessor: 'last_name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone Number', accessor: 'phone_number' },
    {
      header: 'Actions',
      accessor: 'id',
      render: (id: string) => (
        <ActionButtons
          onEdit={() => {
            const customer = customersData?.data.find(c => c.id === id);
            setEditingCustomer(customer || null);
            setIsFormOpen(true);
            setFormError('');
          }}
          onDelete={() => {
            if (window.confirm('Are you sure you want to delete this customer?')) {
              deleteMutation.mutate(id);
            }
          }}
        />
      ),
    },
  ];

  const handleSubmit = (formData: CreateCustomerData | UpdateCustomerData) => {
    if (editingCustomer) {
      updateMutation.mutate({ id: editingCustomer.id, data: formData });
    } else {
      createMutation.mutate(formData as CreateCustomerData);
    }
  };

  return (
    <>
      <TableContainer
        title="Customers Management"
        columns={columns}
        data={customersData?.data || []}
        isLoading={isLoading}
        page={page}
        totalPages={Math.ceil((customersData?.count || 0) / 10)}
        onPageChange={setPage}
        onAdd={() => {
          setEditingCustomer(null);
          setIsFormOpen(true);
          setFormError('');
        }}
        addButtonLabel="Add Customer"
        addButtonIcon={UserPlus}
      />

      {isFormOpen && (
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsFormOpen(false);
            setEditingCustomer(null);
            setFormError('');
          }}
          isLoading={createMutation.isLoading || updateMutation.isLoading}
          error={formError}
        />
      )}
    </>
  );
}