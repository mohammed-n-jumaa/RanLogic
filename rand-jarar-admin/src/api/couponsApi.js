import apiClient from './apiClient';

const couponsApi = {
    getAll: async () => {
        const res = await apiClient.get('/admin/coupons');
        return res.data;
    },

    create: async (data) => {
        const res = await apiClient.post('/admin/coupons', data);
        return res.data;
    },

    update: async (id, data) => {
        const res = await apiClient.put(`/admin/coupons/${id}`, data);
        return res.data;
    },

    remove: async (id) => {
        const res = await apiClient.delete(`/admin/coupons/${id}`);
        return res.data;
    },

    toggle: async (id) => {
        const res = await apiClient.patch(`/admin/coupons/${id}/toggle`);
        return res.data;
    },
};

export default couponsApi;
