require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');

const Role = require('../models/Role');
const Permission = require('../models/Permission');
const RolePermission = require('../models/RolePermission');

const roles = [
  { name: 'Admin', description: 'Full portal and Zoho access, manages users/roles' },
  { name: 'HR', description: 'Access to Zoho People' },
  { name: 'Sales', description: 'Access to Zoho CRM' },
  { name: 'Support', description: 'Access to Zoho Desk' },
  { name: 'Finance', description: 'Access to Zoho Books' }
];

const permissions = [
  { name: 'access:zoho_people', description: 'View/use Zoho People' },
  { name: 'access:zoho_crm', description: 'View/use Zoho CRM' },
  { name: 'access:zoho_desk', description: 'View/use Zoho Desk' },
  { name: 'access:zoho_books', description: 'View/use Zoho Books' },
  { name: 'manage:users', description: 'Create/edit/delete users and roles' },
  { name: 'view:audit_logs', description: 'View system audit logs' }
];

// which permissions each role gets, by name
const roleToPermissions = {
  Admin: ['access:zoho_people', 'access:zoho_crm', 'access:zoho_desk', 'access:zoho_books', 'manage:users', 'view:audit_logs'],
  HR: ['access:zoho_people'],
  Sales: ['access:zoho_crm'],
  Support: ['access:zoho_desk'],
  Finance: ['access:zoho_books']
};

const seed = async () => {
  await connectDB();

  // Clear existing data so this script is safely re-runnable
  await Role.deleteMany({});
  await Permission.deleteMany({});
  await RolePermission.deleteMany({});

  const createdRoles = await Role.insertMany(roles);
  const createdPermissions = await Permission.insertMany(permissions);

  const roleMap = Object.fromEntries(createdRoles.map(r => [r.name, r._id]));
  const permMap = Object.fromEntries(createdPermissions.map(p => [p.name, p._id]));

  const rolePermissionDocs = [];
  for (const [roleName, permNames] of Object.entries(roleToPermissions)) {
    for (const permName of permNames) {
      rolePermissionDocs.push({ role: roleMap[roleName], permission: permMap[permName] });
    }
  }
  await RolePermission.insertMany(rolePermissionDocs);

  console.log('Seed complete: Roles, Permissions, RolePermissions created.');
  mongoose.connection.close();
};

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});