const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const getPaginationResponse = (total, page, limit) => {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
  };
};

const getSortOptions = (query, defaultSort = '-createdAt') => {
  const { sort } = query;
  if (!sort) return defaultSort;
  const sortFields = sort.split(',').map(f => f.trim()).join(' ');
  return sortFields;
};

const buildSearchRegex = (searchTerm) => {
  if (!searchTerm) return null;
  const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(escaped, 'i');
};

const getLocalizedField = (doc, field, lang) => {
  if (!doc) return '';
  const bnKey = `${field}_bn`;
  if (lang === 'bn' && doc[bnKey]) return doc[bnKey];
  return doc[field] || '';
};

module.exports = {
  getPagination,
  getPaginationResponse,
  getSortOptions,
  buildSearchRegex,
  getLocalizedField,
};
