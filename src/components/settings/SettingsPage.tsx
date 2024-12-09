import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import BranchSwitcher from '../ui/BranchSwitcher';
import PageHeader from '../shared/PageHeader';

export default function SettingsPage() {
  return (
    <div className="p-8">
      <PageHeader 
        title="Settings" 
        icon={SettingsIcon}
      />

      <div className="mt-8 max-w-2xl">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Branch Settings</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your branch preferences
            </p>
          </div>
          
          <div className="px-6 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Branch
              </label>
              <BranchSwitcher />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}