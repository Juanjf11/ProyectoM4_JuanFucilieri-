import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  subscribeToUserTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
} from '../services/taskService';
import type { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';

export const useTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(user));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const unsubscribe = subscribeToUserTasks(
      user.uid,
      (fetchedTasks) => {
        setTasks(fetchedTasks);
        setLoading(false);
      },
      (err) => {
        setError(`Error al sincronizar tareas: ${err.message}`);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  const handleCreateTask = useCallback(
    async (input: CreateTaskInput): Promise<boolean> => {
      if (!user) {
        setError('Debes iniciar sesión para crear una tarea.');
        return false;
      }

      try {
        setError(null);
        await createTask(user.uid, input);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al crear la tarea.');
        return false;
      }
    },
    [user]
  );

  const handleUpdateTask = useCallback(
    async (taskId: string, input: UpdateTaskInput): Promise<boolean> => {
      try {
        setError(null);
        await updateTask(taskId, input);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al actualizar la tarea.');
        return false;
      }
    },
    []
  );

  const handleToggleTask = useCallback(
    async (taskId: string, currentCompleted: boolean): Promise<boolean> => {
      try {
        setError(null);
        await toggleTask(taskId, currentCompleted);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cambiar estado de la tarea.');
        return false;
      }
    },
    []
  );

  const handleDeleteTask = useCallback(
    async (taskId: string): Promise<boolean> => {
      try {
        setError(null);
        await deleteTask(taskId);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar la tarea.');
        return false;
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    tasks: user ? tasks : [],
    loading: user ? loading : false,
    error,
    clearError,
    handleCreateTask,
    handleUpdateTask,
    handleToggleTask,
    handleDeleteTask,
  };
};

export default useTasks;
