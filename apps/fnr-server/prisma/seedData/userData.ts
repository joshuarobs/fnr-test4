import { UserRole } from '@prisma/client';

// Admin user data
export const admin = {
  user: {
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
  },
  staff: {
    department: 'Administration',
    employeeId: 'ADM001',
    position: 'System Administrator',
    permissions: ['ALL'],
  },
};

// Staff members data
export const staffMembers = [
  {
    user: {
      email: 'claims@example.com',
      password: 'staff123',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: UserRole.STAFF,
    },
    staff: {
      department: 'Claims',
      employeeId: 'STF001',
      position: 'Claims Handler',
      permissions: ['CREATE_CLAIM', 'UPDATE_CLAIM', 'VIEW_CLAIM'],
    },
  },
  {
    user: {
      email: 'valuations@example.com',
      password: 'staff123',
      firstName: 'Mike',
      lastName: 'Williams',
      role: UserRole.STAFF,
    },
    staff: {
      department: 'Claims',
      employeeId: 'STF002',
      position: 'Claims Handler',
      permissions: ['CREATE_CLAIM', 'UPDATE_CLAIM', 'VIEW_CLAIM'],
    },
  },
  {
    user: {
      email: 'claims2@example.com',
      password: 'staff123',
      firstName: 'David',
      lastName: 'Thompson',
      role: UserRole.STAFF,
    },
    staff: {
      department: 'Claims',
      employeeId: 'STF003',
      position: 'Claims Handler',
      permissions: ['CREATE_CLAIM', 'UPDATE_CLAIM', 'VIEW_CLAIM'],
    },
  },
  {
    user: {
      email: 'claims3@example.com',
      password: 'staff123',
      firstName: 'Lisa',
      lastName: 'Anderson',
      role: UserRole.STAFF,
    },
    staff: {
      department: 'Claims',
      employeeId: 'STF004',
      position: 'Claims Handler',
      permissions: ['CREATE_CLAIM', 'UPDATE_CLAIM', 'VIEW_CLAIM'],
    },
  },
];

// Suppliers data
export const suppliers = [
  {
    user: {
      email: 'electronics@supplier.com',
      password: 'supplier123',
      firstName: 'Tech',
      lastName: 'Solutions',
      role: UserRole.SUPPLIER,
    },
    supplier: {
      company: 'Tech Solutions Ltd',
      serviceType: ['Electronics', 'Computers', 'Phones'],
      areas: ['North', 'South', 'East', 'West'],
      ratings: 4.5,
    },
  },
  {
    user: {
      email: 'appliances@supplier.com',
      password: 'supplier123',
      firstName: 'Home',
      lastName: 'Appliances',
      role: UserRole.SUPPLIER,
    },
    supplier: {
      company: 'Home Appliances Co',
      serviceType: ['Appliances', 'White Goods', 'Kitchen'],
      areas: ['North', 'South', 'East', 'West'],
      ratings: 4.5,
    },
  },
];

// Insureds data
export const insureds = [
  {
    user: {
      email: 'john@example.com',
      password: 'insured123',
      firstName: 'John',
      lastName: 'Smith',
      role: UserRole.INSURED,
    },
    insured: {
      address: '123 Main Street, City',
    },
  },
  {
    user: {
      email: 'jane@example.com',
      password: 'insured123',
      firstName: 'Jane',
      lastName: 'Brown',
      role: UserRole.INSURED,
    },
    insured: {
      address: '223 Main Street, City',
    },
  },
  {
    user: {
      email: 'robert@example.com',
      password: 'insured123',
      firstName: 'Robert',
      lastName: 'Wilson',
      role: UserRole.INSURED,
    },
    insured: {
      address: '456 Oak Avenue, City',
    },
  },
  {
    user: {
      email: 'emma@example.com',
      password: 'insured123',
      firstName: 'Emma',
      lastName: 'Davis',
      role: UserRole.INSURED,
    },
    insured: {
      address: '789 Pine Road, City',
    },
  },
];
