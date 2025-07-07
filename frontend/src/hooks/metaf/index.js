export { default as useCreateMeta } from './useCreateMeta.jsx';
export { default as useGetMetas } from './useGetMetas.jsx';
export { default as useGetMetasByYear } from './useGetMetasByYear.jsx';
export { default as useGetMetasWithFilter } from './useGetMetasWithFilter.jsx';
export { default as useEditMeta } from './useEditMeta.jsx';
export { default as useDeleteMeta } from './useDeleteMeta.jsx';

// Importación directa del servicio para casos específicos
export { getAllMetas, getMeta, getMetasByYear, createMeta, updateMeta, deleteMeta } from '../../services/metaf.service.js'; 