import api from './api';
import {
  MOCK_EMPLOYEES,
  DEPARTMENTS,
  BRANCHES,
} from '../data/mockEmployees';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// ---------------------------------------------------------------------------
// Employee Service
// ---------------------------------------------------------------------------
let _employees = [...MOCK_EMPLOYEES]; // mutable in-memory store

export const employeeService = {
  /** GET /employees */
  async getAll(params = {}) {
    await delay(400);
    let list = [..._employees];
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q),
      );
    }
    if (params.department) list = list.filter((e) => e.departmentId === params.department);
    if (params.branch) list = list.filter((e) => e.branchId === params.branch);
    if (params.status) list = list.filter((e) => e.status === params.status);

    const page = parseInt(params.page) || 1;
    const pageSize = parseInt(params.pageSize) || 10;
    const total = list.length;
    const data = list.slice((page - 1) * pageSize, page * pageSize);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  /** GET /employees/:id */
  async getById(id) {
    await delay(300);
    const emp = _employees.find((e) => e.id === id);
    if (!emp) throw new Error('Employee not found.');
    return emp;
  },

  /** POST /employees */
  async create(payload) {
    await delay(600);
    const newId = `EMP-${String(_employees.length + 1).padStart(3, '0')}`;
    const dept = DEPARTMENTS.find((d) => d.id === payload.departmentId);
    const branch = BRANCHES.find((b) => b.id === payload.branchId);
    const newEmp = {
      ...payload,
      id: newId,
      departmentName: dept?.name || '',
      branchName: branch?.name || '',
      fullName: `${payload.firstName} ${payload.lastName}`,
      joiningDate: payload.joiningDate || new Date().toISOString().split('T')[0],
      status: payload.status || 'Active',
    };
    _employees.unshift(newEmp);
    return newEmp;
  },

  /** PUT /employees/:id */
  async update(id, payload) {
    await delay(500);
    const idx = _employees.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Employee not found.');
    const dept = DEPARTMENTS.find((d) => d.id === payload.departmentId);
    const branch = BRANCHES.find((b) => b.id === payload.branchId);
    const updated = {
      ..._employees[idx],
      ...payload,
      departmentName: dept?.name || _employees[idx].departmentName,
      branchName: branch?.name || _employees[idx].branchName,
      fullName: `${payload.firstName || _employees[idx].firstName} ${payload.lastName || _employees[idx].lastName}`,
    };
    _employees[idx] = updated;
    return updated;
  },

  /** DELETE /employees/:id */
  async delete(id) {
    await delay(400);
    _employees = _employees.filter((e) => e.id !== id);
    return { success: true };
  },
};

// ---------------------------------------------------------------------------
// Department Service
// ---------------------------------------------------------------------------
let _departments = [...DEPARTMENTS];

export const departmentService = {
  async getAll() {
    await delay(300);
    return [..._departments];
  },
  async create(payload) {
    await delay(400);
    const newDept = { ...payload, id: `dept-${Date.now()}`, employeeCount: 0 };
    _departments.push(newDept);
    return newDept;
  },
  async update(id, payload) {
    await delay(400);
    const idx = _departments.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error('Department not found.');
    _departments[idx] = { ..._departments[idx], ...payload };
    return _departments[idx];
  },
  async delete(id) {
    await delay(300);
    _departments = _departments.filter((d) => d.id !== id);
    return { success: true };
  },
};

// ---------------------------------------------------------------------------
// Branch Service
// ---------------------------------------------------------------------------
let _branches = [...BRANCHES];

export const branchService = {
  async getAll() {
    await delay(300);
    return [..._branches];
  },
  async create(payload) {
    await delay(400);
    const newBranch = { ...payload, id: `branch-${Date.now()}`, employeeCount: 0 };
    _branches.push(newBranch);
    return newBranch;
  },
  async update(id, payload) {
    await delay(400);
    const idx = _branches.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error('Branch not found.');
    _branches[idx] = { ..._branches[idx], ...payload };
    return _branches[idx];
  },
  async delete(id) {
    await delay(300);
    _branches = _branches.filter((b) => b.id !== id);
    return { success: true };
  },
};

// ---------------------------------------------------------------------------
// Reports Service
// ---------------------------------------------------------------------------
export const reportsService = {
  async getSummary() {
    await delay(400);
    return {
      totalEmployees: _employees.length,
      activeEmployees: _employees.filter((e) => e.status === 'Active').length,
      departments: _departments.length,
      branches: _branches.length,
      newHiresThisMonth: _employees.filter((e) => {
        const d = new Date(e.joiningDate);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length,
      onLeave: _employees.filter((e) => e.status === 'On Leave').length,
    };
  },
};
