export const ROLES = {
  CUSTOMER: 'customer',
  TECHNICIAN: 'technician',
  ADMIN: 'admin',
};

export function getRoleHome(role) {
  switch (role) {
    case ROLES.CUSTOMER:
      return '/customer';
    case ROLES.TECHNICIAN:
      return '/technician';
    case ROLES.ADMIN:
      return '/admin';
    default:
      return '/';
  }
}

export function isAuthorized(userRole, requiredRole) {
  if (!userRole) return false;
  if (userRole === ROLES.ADMIN) return true; // Admin has universal access
  return userRole === requiredRole;
}
