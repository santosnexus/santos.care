import { SessionUser } from "@/lib/auth";
import { Role } from "@prisma/client";

type Permission = string;

type PermissionsMap = Record<Role, Permission[]>;

export { Role };

export const ALL_ROLES = [
  Role.SUPER_ADMIN,
  Role.ADMIN,
  Role.MANAGER,
  Role.SALES,
  Role.COORDINATOR,
  Role.FINANCE,
  Role.MARKETING,
  Role.STAKEHOLDER,
  Role.VIEWER,
];

export const PERMISSIONS: PermissionsMap = {
  [Role.SUPER_ADMIN]: [
    // All permissions (full access)
    "*",
  ],
  [Role.ADMIN]: [
    // All patients, leads, invoices, payments, quotes, messages, tasks, partners, documents,
    "patient:*",
    "lead:*",
    "invoice:*",
    "payment:*",
    "quote:*",
    "message:*",
    "task:*",
    "partner:*",
    "document:*",
    "user:read",
    "user:invite",
    "settings:*",
    "audit:read",
  ],
  [Role.MANAGER]: [
    // Can read and create own team, but not manage system
    "patient:read", "patient:create", "patient:update",
    "lead:read", "lead:create", "lead:update",
    "invoice:read", "invoice:create", "invoice:update",
    "payment:read", "payment:create",
    "message:*", "task:*", "partner:read", "document:read",
  ],
  [Role.SALES]: [
    // Can manage leads and convert to patients
    "lead:read", "lead:create", "lead:update", "lead:delete",
    "patient:read",
    "message:*",
  ],
  [Role.COORDINATOR]: [
    // Can manage patient pipeline, assigned tasks
    "patient:read", "patient:create", "patient:update",
    "task:*",
    "message:*",
    "document:read",
  ],
  [Role.FINANCE]: [
    // Can manage all money-related operations
    "invoice:*", "payment:*", "document:read",
  ],
  [Role.MARKETING]: [
    // Can manage campaigns and communications
    "lead:read", "lead:create",
    "message:*",
    "analytics:read",
  ],
  [Role.STAKEHOLDER]: [
    // Limited read access
    "patient:read", "lead:read", "invoice:read",
    "message:read",
  ],
  [Role.VIEWER]: [
    // Read-only access across modules
    "patient:read",
    "lead:read",
    "task:read",
    "document:read",
    "partner:read",
    "analytics:read",
  ],
};

export function can(user: SessionUser | null, action: string, resource?: any): boolean {
  if (!user) return false;

  const userPermissions = PERMISSIONS[user.role];
  if (!userPermissions) return false;

  // Check if user has "*" (super admin)
  if (userPermissions.includes("*")) return true;

  // Exact permission match
  if (userPermissions.includes(action)) return true;

  // Resource-type wildcard (e.g., "patient:*" matches "patient:create", "patient:update")
  const [resourceType] = action.split(":");
  if (userPermissions.includes(`${resourceType}:*`)) return true;

  return false;
}

export function canAccessModule(user: SessionUser | null, module: string): boolean {
  if (!user) return false;

  const moduleActions = [
    "create", "read", "update", "delete", "execute",
  ];

  return moduleActions.some((action) => can(user, `${module}:${action}`, {}));
}

export function getUserPermissions(user: SessionUser | null): string[] {
  if (!user) return [];
  return PERMISSIONS[user.role] || [];
}

export function hasPermission(user: SessionUser | null, ...requiredPermissions: string[]): boolean {
  if (!user) return false;

  return requiredPermissions.every((permission) => can(user, permission));
}

export function isSuperAdmin(user: SessionUser | null): boolean {
  return user?.role === Role.SUPER_ADMIN;
}

export function isAdminOrHigher(user: SessionUser | null): boolean {
  if (!user) return false;
  return (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN);
}
