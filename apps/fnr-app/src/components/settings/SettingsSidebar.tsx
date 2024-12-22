import { User, Palette } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../routes';

// Menu items for settings navigation
const items = [
  {
    title: 'Account',
    icon: User,
    to: ROUTES.SETTINGS_ACCOUNT,
  },
  {
    title: 'Appearance',
    icon: Palette,
    to: ROUTES.SETTINGS_APPEARANCE,
  },
];

export const SettingsSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-[224px] min-w-[224px] py-6">
      <div className="w-[200px] mx-auto">
        <h3 className="font-medium mb-4">Settings</h3>
        <nav>
          {items.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors hover:bg-gray-100 select-none ${
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
    </aside>
  );
};
