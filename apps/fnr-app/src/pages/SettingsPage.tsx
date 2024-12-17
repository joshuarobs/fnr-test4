import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SettingsSidebar } from '../components/settings/SettingsSidebar';
import { ROUTES } from '../routes';

const SETTINGS_SUBPAGE_CONTAINER = 'max-w-[800px] mx-8 py-6' as const;

// Settings section components
const AccountSettings = () => (
  <div className={SETTINGS_SUBPAGE_CONTAINER}>
    <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
    <p>Manage your account details and preferences.</p>
  </div>
);

const AppearanceSettings = () => (
  <div className={SETTINGS_SUBPAGE_CONTAINER}>
    <h2 className="text-2xl font-semibold mb-4">Appearance Settings</h2>
    <p>Customize the look and feel of the application.</p>
  </div>
);

export function SettingsPage() {
  return (
    <div className="w-full min-h-full flex justify-center">
      <div className="max-w-[1200px] w-full flex">
        <SettingsSidebar />
        <div className="flex-1">
          <Routes>
            {/* Redirect /settings to /settings/account */}
            <Route
              path="/"
              element={<Navigate to={ROUTES.SETTINGS_ACCOUNT} replace />}
            />
            <Route path="account" element={<AccountSettings />} />
            <Route path="appearance" element={<AppearanceSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
