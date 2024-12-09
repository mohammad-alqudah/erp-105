import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Building } from 'lucide-react';
import { getBranches, getBranchPermissions } from '../../services/api/branchApi';
import toast from 'react-hot-toast';

export default function BranchSwitcher() {
  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentBranchId = user.branches?.[0]?.id;

  const { data: branchesResponse } = useQuery('branches', getBranches);

  const switchBranchMutation = useMutation(
    async (branchId: number) => {
      const permissions = await getBranchPermissions(branchId);
      return { branchId, permissions: permissions.data };
    },
    {
      onSuccess: ({ branchId, permissions }) => {
        // Update the user's current branch and permissions in localStorage
        const updatedUser = { ...user };
        const selectedBranch = branchesResponse?.data.find(b => b.id === branchId);
        if (selectedBranch && updatedUser.branches) {
          updatedUser.branches[0] = { 
            id: selectedBranch.id, 
            name: selectedBranch.name,
            permissions
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        
        // Invalidate relevant queries
        queryClient.invalidateQueries('products');
        queryClient.invalidateQueries('customers');
        queryClient.invalidateQueries('users');
        
        toast.success('Branch switched successfully');
        
        // Force reload to apply new permissions
        window.location.reload();
      },
      onError: () => {
        toast.error('Failed to switch branch');
      },
    }
  );

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const branchId = parseInt(e.target.value);
    if (branchId) {
      switchBranchMutation.mutate(branchId);
    }
  };

  if (!branchesResponse?.data.length) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <Building className="w-5 h-5 text-gray-500" />
      <select
        value={currentBranchId}
        onChange={handleBranchChange}
        className="block w-full bg-white border border-gray-300 rounded-md py-1.5 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {branchesResponse.data.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>
    </div>
  );
}