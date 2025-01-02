'use client';

import { ClaimsProgressChart } from '../components/admin/ClaimsProgressChart';
import { ClaimsThisMonthChart } from '../components/admin/ClaimsThisMonthChart';

export const AdminPortalPage = () => {
  return (
    <main className="flex-1 overflow-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-start max-h-[300px]">
          <ClaimsProgressChart />
          <ClaimsThisMonthChart />
        </div>
      </div>
    </main>
  );
};

export default AdminPortalPage;
