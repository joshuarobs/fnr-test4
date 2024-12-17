import React from 'react';

// Placeholder content sections for each settings tab
const GeneralSettings = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">General Settings</h2>
    <p>Configure general application settings and preferences.</p>
  </div>
);

const AccountSettings = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
    <p>Manage your account details and preferences.</p>
  </div>
);

const NotificationSettings = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
    <p>Configure how and when you receive notifications.</p>
  </div>
);

const PrivacySettings = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
    <p>Manage your privacy preferences and data settings.</p>
  </div>
);

const KeyboardSettings = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Keyboard Settings</h2>
    <p>Customize keyboard shortcuts and controls.</p>
  </div>
);

// Map of section IDs to their corresponding components
const sectionComponents = {
  general: GeneralSettings,
  account: AccountSettings,
  notifications: NotificationSettings,
  privacy: PrivacySettings,
  keyboard: KeyboardSettings,
} as const;

type SectionId = keyof typeof sectionComponents;

interface SettingsContentProps {
  activeSection?: SectionId;
}

export const SettingsContent: React.FC<SettingsContentProps> = ({
  activeSection = 'general',
}) => {
  const ContentComponent = sectionComponents[activeSection];

  return (
    <div className="p-6">
      <ContentComponent />
    </div>
  );
};
