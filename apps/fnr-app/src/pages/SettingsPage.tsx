import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SettingsSidebar } from '../components/settings/SettingsSidebar';
import { SettingsContent } from '../components/settings/SettingsContent';
import { ROUTES } from '../routes';

// Settings section components
const GeneralSettings = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">General Settings</h2>
    <p>Configure general application settings and preferences.</p>
  </div>
);

const AccountSettings = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
    <p>Manage your account details and preferences.</p>
  </div>
);

const NotificationSettings = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Notification Settings</h2>
    <p>Configure how and when you receive notifications.</p>
  </div>
);

const PrivacySettings = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Privacy Settings</h2>
    <p>Manage your privacy preferences and data settings.</p>
  </div>
);

const KeyboardSettings = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Keyboard Settings</h2>
    <p>Customize keyboard shortcuts and controls.</p>
  </div>
);

export function SettingsPage() {
  return (
    <div className="flex min-h-full p-6">
      <SettingsSidebar />
      <div className="flex-1">
        <Routes>
          {/* Redirect /settings to /settings/general */}
          <Route
            path="/"
            element={<Navigate to={ROUTES.SETTINGS_GENERAL} replace />}
          />
          <Route path="general" element={<GeneralSettings />} />
          <Route path="account" element={<AccountSettings />} />
          <Route path="notifications" element={<NotificationSettings />} />
          <Route path="privacy" element={<PrivacySettings />} />
          <Route path="keyboard" element={<KeyboardSettings />} />
        </Routes>
      </div>
    </div>
  );
}

export default SettingsPage;
