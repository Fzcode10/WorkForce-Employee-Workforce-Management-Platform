export const DEPARTMENTS = [
  { id: 'dept-01', name: 'Engineering', head: 'EMP-001', employeeCount: 24, budget: 1200000 },
  { id: 'dept-02', name: 'Human Resources', head: 'EMP-012', employeeCount: 8, budget: 400000 },
  { id: 'dept-03', name: 'Finance', head: 'EMP-020', employeeCount: 12, budget: 600000 },
  { id: 'dept-04', name: 'Marketing', head: 'EMP-031', employeeCount: 10, budget: 500000 },
  { id: 'dept-05', name: 'Operations', head: 'EMP-040', employeeCount: 18, budget: 800000 },
  { id: 'dept-06', name: 'Sales', head: 'EMP-055', employeeCount: 20, budget: 900000 },
  { id: 'dept-07', name: 'Customer Support', head: 'EMP-070', employeeCount: 15, budget: 550000 },
  { id: 'dept-08', name: 'Legal', head: 'EMP-082', employeeCount: 6, budget: 350000 },
];

export const BRANCHES = [
  { id: 'branch-01', name: 'HQ — New York', location: 'New York, USA', employeeCount: 56, manager: 'EMP-001' },
  { id: 'branch-02', name: 'London Office', location: 'London, UK', employeeCount: 32, manager: 'EMP-015' },
  { id: 'branch-03', name: 'Dubai Office', location: 'Dubai, UAE', employeeCount: 18, manager: 'EMP-030' },
  { id: 'branch-04', name: 'Singapore Office', location: 'Singapore', employeeCount: 14, manager: 'EMP-045' },
  { id: 'branch-05', name: 'Karachi Office', location: 'Karachi, Pakistan', employeeCount: 22, manager: 'EMP-058' },
];

export const DESIGNATIONS = [
  'Software Engineer', 'Senior Software Engineer', 'Lead Engineer', 'Engineering Manager',
  'HR Manager', 'HR Executive', 'HR Coordinator', 'Finance Manager', 'Senior Accountant',
  'Accountant', 'Marketing Manager', 'Marketing Specialist', 'Operations Manager',
  'Operations Executive', 'Sales Manager', 'Sales Executive', 'Customer Support Lead',
  'Support Agent', 'Legal Counsel', 'Director', 'Vice President', 'Chief Technology Officer',
  'Chief Financial Officer', 'Chief Executive Officer', 'Product Manager', 'UX Designer',
  'Data Analyst', 'DevOps Engineer', 'QA Engineer',
];

export const EMPLOYMENT_STATUSES = ['Active', 'Inactive', 'On Leave', 'Probation', 'Terminated'];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (start, end) => {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().split('T')[0];
};

const firstNames = ['James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia',
  'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Charlotte', 'Alexander',
  'Amelia', 'Mason', 'Harper', 'Ethan', 'Evelyn', 'Daniel', 'Abigail', 'Michael',
  'Emily', 'Jackson', 'Elizabeth', 'Sebastian', 'Sofia', 'Jack', 'Avery',
  'Owen', 'Ella', 'Samuel', 'Madison', 'Ryan', 'Scarlett', 'Nathan', 'Victoria',
  'Carter', 'Aria', 'Caleb', 'Grace', 'Luke', 'Chloe', 'Isaiah', 'Penelope'];

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson',
  'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez',
  'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'];

function generateEmployees(count = 60) {
  const employees = [];
  for (let i = 1; i <= count; i++) {
    const fn = randomFrom(firstNames);
    const ln = randomFrom(lastNames);
    const dept = randomFrom(DEPARTMENTS);
    const branch = randomFrom(BRANCHES);
    const status = i <= 50 ? 'Active' : randomFrom(EMPLOYMENT_STATUSES);
    employees.push({
      id: `EMP-${String(i).padStart(3, '0')}`,
      firstName: fn,
      lastName: ln,
      fullName: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@workforcex.com`,
      phone: `+1-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000000 + Math.random() * 9000000)}`,
      departmentId: dept.id,
      departmentName: dept.name,
      branchId: branch.id,
      branchName: branch.name,
      designation: randomFrom(DESIGNATIONS),
      status,
      joiningDate: randomDate(new Date(2018, 0, 1), new Date(2025, 9, 1)),
      salary: Math.floor(40000 + Math.random() * 120000),
      avatar: null,
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      address: `${Math.floor(100 + Math.random() * 900)} ${randomFrom(['Main St', 'Oak Ave', 'Park Blvd', 'Elm Rd'])}, ${branch.location}`,
      nationalId: `NID-${Math.floor(100000 + Math.random() * 900000)}`,
      emergencyContact: `+1-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000000 + Math.random() * 9000000)}`,
      manager: i > 5 ? `EMP-${String(Math.floor(1 + Math.random() * 5)).padStart(3, '0')}` : null,
      role: i <= 2 ? 'Admin' : i <= 5 ? 'HR' : 'Employee',
    });
  }
  return employees;
}

export const MOCK_EMPLOYEES = generateEmployees(60);

export const MOCK_STATS = {
  totalEmployees: 60,
  activeEmployees: 50,
  departments: DEPARTMENTS.length,
  branches: BRANCHES.length,
  newHiresThisMonth: 4,
  onLeave: 3,
  attritionRate: '4.2%',
  avgTenure: '2.8 years',
};

export const MONTHLY_HEADCOUNT = [
  { month: 'Jan', count: 48 },
  { month: 'Feb', count: 50 },
  { month: 'Mar', count: 51 },
  { month: 'Apr', count: 53 },
  { month: 'May', count: 54 },
  { month: 'Jun', count: 53 },
  { month: 'Jul', count: 55 },
  { month: 'Aug', count: 57 },
  { month: 'Sep', count: 58 },
  { month: 'Oct', count: 60 },
];

export const DEPT_HEADCOUNT = DEPARTMENTS.map((d) => ({
  name: d.name.replace(' ', '\n'),
  shortName: d.name.split(' ')[0],
  count: d.employeeCount,
}));

export const STATUS_DISTRIBUTION = [
  { name: 'Active', value: 50, color: '#22c55e' },
  { name: 'On Leave', value: 3, color: '#f59e0b' },
  { name: 'Probation', value: 4, color: '#3b82f6' },
  { name: 'Inactive', value: 2, color: '#94a3b8' },
  { name: 'Terminated', value: 1, color: '#ef4444' },
];

export const ATTENDANCE_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  present: Math.floor(45 + Math.random() * 10),
  absent: Math.floor(1 + Math.random() * 5),
  late: Math.floor(1 + Math.random() * 4),
}));
