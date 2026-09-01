import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

export const useCategoriesQuery = () => {
    const axiosSecure = useAxiosSecure();
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/categories');
            return data;
        },
    });
};

export const useCreateCategory = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await axiosSecure.post('/categories', payload);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    });
};

export const useUpdateCategory = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...payload }) => {
            const { data } = await axiosSecure.put(`/categories/${id}`, payload);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    });
};

export const useDeleteCategory = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await axiosSecure.delete(`/categories/${id}`);
            return id;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    });
};