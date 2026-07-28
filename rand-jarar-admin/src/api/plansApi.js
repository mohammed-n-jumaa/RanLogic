import apiClient from './apiClient';

const plansApi = {
    getAll: async () => {
        const res = await apiClient.get('/admin/plans');
        return res.data;
    },

    update: async (id, data) => {
        const res = await apiClient.put(`/admin/plans/${id}`, data);
        return res.data;
    },

    bulkUpdate: async (plans) => {
        const res = await apiClient.post('/admin/plans/bulk-update', { plans });
        return res.data;
    },
};

export default plansApi;
