import { Settings, User, Bell, Shield, Keyboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../routes';

// Menu items for settings navigation
const items = [
  {
    title: 'General',
    icon: Settings,
    to: ROUTES.SETTINGS_GENERAL,
  },
  {
    title: 'Account',
    icon: User,
    to: ROUTES.SETTINGS_ACCOUNT,
  },
  {
    title: 'Notifications',
    icon: Bell,
    to: ROUTES.SETTINGS_NOTIFICATIONS,
  },
  {
    title: 'Privacy',
    icon: Shield,
    to: ROUTES.SETTINGS_PRIVACY,
  },
  {
    title: 'Keyboard',
    icon: Keyboard,
    to: ROUTES.SETTINGS_KEYBOARD,
  },
];

export const SettingsSidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 p-6">
      <h3 className="font-medium mb-4">Settings</h3>
      <nav>
        {items.map((item) => (
          <Link
            key={item.title}
            to={item.to}
            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors hover:bg-gray-100 ${
              location.pathname === item.to
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600'
            }`}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};
