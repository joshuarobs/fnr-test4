import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SettingsSidebar } from '../components/settings/SettingsSidebar';
import { AccountSettings } from '../components/settings/subpages/AccountSettings';
import { AppearanceSettings } from '../components/settings/subpages/AppearanceSettings';
import { ROUTES } from '../routes';

// Common container styles for settings subpages
export const SETTINGS_SUBPAGE_CONTAINER = 'max-w-[800px] mx-8 py-6' as const;

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
