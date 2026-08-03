export const formatDate = (date, lang = 'en') => {
  if (!date) return '';
  const d = new Date(date);
  if (lang === 'bn') {
    return d.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export const formatDateTime = (date, lang = 'en') => {
  if (!date) return '';
  const d = new Date(date);
  if (lang === 'bn') {
    return d.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const getStatusLabel = (status, lang = 'en') => {
  const labels = {
    en: { pending: 'Pending', trial: 'Trial', disposed: 'Disposed', appealed: 'Appealed' },
    bn: { pending: 'বিচারাধীন', trial: 'বিচার চলছে', disposed: 'নিষ্পত্তি', appealed: 'আপিল' },
  };
  return labels[lang]?.[status] || status;
};

export const getPriorityLabel = (priority, lang = 'en') => {
  const labels = {
    en: { normal: 'Normal', high: 'High', urgent: 'Urgent' },
    bn: { normal: 'স্বাভাবিক', high: 'উচ্চ', urgent: 'জরুরি' },
  };
  return labels[lang]?.[priority] || priority;
};

export const getRoleLabel = (role, lang = 'en') => {
  const labels = {
    en: {
      super_admin: 'Super Admin',
      admin: 'Admin',
      police_officer: 'Police Officer',
      court_clerk: 'Court Clerk',
      public_user: 'Public User',
    },
    bn: {
      super_admin: 'সুপার অ্যাডমিন',
      admin: 'অ্যাডমিন',
      police_officer: 'পুলিশ অফিসার',
      court_clerk: 'কোর্ট ক্লার্ক',
      public_user: 'সাধারণ ব্যবহারকারী',
    },
  };
  return labels[lang]?.[role] || role;
};

export const getDesignationLabel = (desig, lang = 'en') => {
  const labels = {
    en: {
      OC: 'Officer-in-Charge',
      SI: 'Sub-Inspector',
      ASI: 'Assistant Sub-Inspector',
      Constable: 'Constable',
      Inspector: 'Inspector',
      'Additional SP': 'Additional Superintendent',
      SP: 'Superintendent',
      DIG: 'Deputy Inspector General',
      IGP: 'Inspector General',
    },
    bn: {
      OC: 'অফিসার ইনচার্জ',
      SI: 'সাব-ইন্সপেক্টর',
      ASI: 'সহকারী সাব-ইন্সপেক্টর',
      Constable: 'কনস্টেবল',
      Inspector: 'ইন্সপেক্টর',
      'Additional SP': 'অতিরিক্ত এসপি',
      SP: 'এসপি',
      DIG: 'ডিআইজি',
      IGP: 'আইজিপি',
    },
  };
  return labels[lang]?.[desig] || desig;
};

export const truncate = (str, len = 100) => {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '...' : str;
};
