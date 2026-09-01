import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

const selectTaskData = (task) => ({
    ...task,
    category: task.category?._id || task.category || null,
});

export const useTasksQuery = (params = {}) => {
    const axiosSecure = useAxiosSecure();
    return useQuery({
        queryKey: ['tasks', params],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/tasks', { params });
            // Backend returns { tasks, pagination } when paginated; fall back to plain array.
            const tasks = Array.isArray(data) ? data : data.tasks;
            return {
                tasks: tasks.map(selectTaskData),
                pagination: Array.isArray(data) ? null : data.pagination,
            };
        },
    });
};

export const useCreateTask = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await axiosSecure.post('/tasks', payload);
            return selectTaskData(data);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    });
};

export const useUpdateTask = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...payload }) => {
            const { data } = await axiosSecure.put(`/tasks/${id}`, payload);
            return selectTaskData(data);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    });
};

export const useDeleteTask = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await axiosSecure.delete(`/tasks/${id}`);
            return id;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    });
};

export const useToggleTask = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosSecure.patch(`/tasks/${id}/toggle`);
            return selectTaskData(data);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    });
};