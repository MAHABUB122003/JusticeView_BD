export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  POLICE_OFFICER: 'police_officer',
  COURT_CLERK: 'court_clerk',
  PUBLIC_USER: 'public_user',
};

export const CASE_STATUS = {
  PENDING: 'pending',
  TRIAL: 'trial',
  DISPOSED: 'disposed',
  APPEALED: 'appealed',
};

export const PRIORITY = {
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const BAIL_CONDITIONS = {
  CASH: 'cash',
  GUARANTEE: 'guarantee',
  BOND: 'bond',
  RESTRICTIONS: 'restrictions',
};

export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  trial: 'bg-blue-100 text-blue-800',
  disposed: 'bg-green-100 text-green-800',
  appealed: 'bg-red-100 text-red-800',
};

export const PRIORITY_COLORS = {
  normal: 'bg-gray-100 text-gray-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};
