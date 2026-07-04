const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  POLICE_OFFICER: 'police_officer',
  COURT_CLERK: 'court_clerk',
  PUBLIC_USER: 'public_user',
};

const CASE_STATUS = {
  PENDING: 'pending',
  TRIAL: 'trial',
  DISPOSED: 'disposed',
  APPEALED: 'appealed',
};

const PRIORITY = {
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
};

const BAIL_CONDITIONS = {
  CASH: 'cash',
  GUARANTEE: 'guarantee',
  BOND: 'bond',
  RESTRICTIONS: 'restrictions',
};

const COMMENT_TYPE = {
  PUBLIC_COMPLAINT: 'public_complaint',
  INTERNAL_NOTE: 'internal_note',
  INQUIRY: 'inquiry',
};

const COMMENT_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  RESOLVED: 'resolved',
};

const AUDIT_ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  VIEW: 'view',
  LOGIN: 'login',
  LOGOUT: 'logout',
};

const DESIGNATIONS = {
  OC: 'OC',
  SI: 'SI',
  ASI: 'ASI',
  CONSTABLE: 'Constable',
  INSPECTOR: 'Inspector',
  ADDITIONAL_SP: 'Additional SP',
  SP: 'SP',
  DIG: 'DIG',
  IGP: 'IGP',
};

const COURT_TYPES = {
  CMM: 'CMM Court',
  DISTRICT_JUDGE: 'District Judge Court',
  MAGISTRATE: 'Magistrate Court',
  SESSIONS: 'Sessions Court',
};

const JUDGE_DESIGNATIONS = {
  DISTRICT_JUDGE: 'District Judge',
  SESSIONS_JUDGE: 'Sessions Judge',
  MAGISTRATE: 'Magistrate',
  CMM: 'CMM',
};

const PROFESSIONAL_ROLES = {
  POLICE_OFFICER: 'police_officer',
  LAWYER: 'lawyer',
  MAGISTRATE: 'magistrate',
  JUDGE: 'judge',
  COURT_OFFICIAL: 'court_official',
};

const PROFESSIONAL_VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
};

const LAWYER_TYPES = {
  GOVERNMENT: 'government',
  PRIVATE: 'private',
  BOTH: 'both',
};

const MAGISTRATE_TYPES = {
  EXECUTIVE: 'Executive Magistrate',
  JUDICIAL: 'Judicial Magistrate',
  METROPOLITAN: 'Metropolitan Magistrate',
};

const CASE_ROLES = {
  ARRESTING_OFFICER: 'arresting_officer',
  PROSECUTOR: 'prosecutor',
  DEFENSE_LAWYER: 'defense_lawyer',
  JUDGE: 'judge',
  MAGISTRATE: 'magistrate',
};

const CASE_OUTCOMES = {
  BAIL_GRANTED: 'bail_granted',
  BAIL_DENIED: 'bail_denied',
  CONVICTED: 'convicted',
  ACQUITTED: 'acquitted',
  PENDING: 'pending',
  DISPOSED: 'disposed',
};

module.exports = {
  ROLES,
  CASE_STATUS,
  PRIORITY,
  BAIL_CONDITIONS,
  COMMENT_TYPE,
  COMMENT_STATUS,
  AUDIT_ACTIONS,
  DESIGNATIONS,
  COURT_TYPES,
  JUDGE_DESIGNATIONS,
  PROFESSIONAL_ROLES,
  PROFESSIONAL_VERIFICATION_STATUS,
  LAWYER_TYPES,
  MAGISTRATE_TYPES,
  CASE_ROLES,
  CASE_OUTCOMES,
};
