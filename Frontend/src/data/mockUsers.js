// Demo accounts for frontend development
// Replace with real JWT authentication when backend is available

export const DEMO_ACCOUNTS = [
  {
    id: 'user-admin-01',
    email: 'admin@workforcex.com',
    password: 'Admin@123',
    role: 'Admin',
    fullName: 'Alex Morgan',
    designation: 'System Administrator',
    department: 'Management',
    branch: 'HQ — New York',
    avatar: null,
    employeeId: 'EMP-001',
    permissions: ['read:all', 'write:all', 'delete:all', 'manage:users'],
  },
  {
    id: 'user-hr-01',
    email: 'hr@workforcex.com',
    password: 'Hr@123',
    role: 'HR',
    fullName: 'Sarah Mitchell',
    designation: 'HR Manager',
    department: 'Human Resources',
    branch: 'HQ — New York',
    avatar: null,
    employeeId: 'EMP-012',
    permissions: ['read:employees', 'write:employees', 'read:departments', 'read:branches', 'manage:onboarding'],
  },
  {
    id: 'user-emp-01',
    email: 'employee@workforcex.com',
    password: 'Emp@123',
    role: 'Employee',
    fullName: 'James Anderson',
    designation: 'Senior Software Engineer',
    department: 'Engineering',
    branch: 'London Office',
    avatar: null,
    employeeId: 'EMP-025',
    permissions: ['read:self'],
  },
];
