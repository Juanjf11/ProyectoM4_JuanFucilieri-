import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';

const TASKS_COLLECTION = 'tasks';

export const createTask = async (
  userId: string,
  input: CreateTaskInput
): Promise<string> => {
  const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
    title: input.title.trim(),
    description: input.description.trim(),
    completed: false,
    userId,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateTask = async (
  taskId: string,
  input: UpdateTaskInput
): Promise<void> => {
  const docRef = doc(db, TASKS_COLLECTION, taskId);
  const dataToUpdate: Record<string, unknown> = {};

  if (input.title !== undefined) {
    dataToUpdate.title = input.title.trim();
  }
  if (input.description !== undefined) {
    dataToUpdate.description = input.description.trim();
  }
  if (input.completed !== undefined) {
    dataToUpdate.completed = input.completed;
  }

  await updateDoc(docRef, dataToUpdate);
};

export const toggleTask = async (
  taskId: string,
  currentCompleted: boolean
): Promise<void> => {
  const docRef = doc(db, TASKS_COLLECTION, taskId);
  await updateDoc(docRef, {
    completed: !currentCompleted,
  });
};

export const deleteTask = async (taskId: string): Promise<void> => {
  const docRef = doc(db, TASKS_COLLECTION, taskId);
  await deleteDoc(docRef);
};

export const subscribeToUserTasks = (
  userId: string,
  onUpdate: (tasks: Task[]) => void,
  onError: (error: Error) => void
): Unsubscribe => {
  const q = query(
    collection(db, TASKS_COLLECTION),
    where('userId', '==', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const tasks: Task[] = snapshot.docs.map((document) => {
        const data = document.data();
        return {
          id: document.id,
          title: (data.title as string) ?? '',
          description: (data.description as string) ?? '',
          completed: Boolean(data.completed),
          userId: (data.userId as string) ?? '',
          createdAt: data.createdAt ?? null,
        };
      });

      // Ordenar por createdAt en el cliente (más recientes primero)
      // sin orderBy en la consulta para no requerir índice compuesto en Firestore
      tasks.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Date.now();
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Date.now();
        return timeB - timeA;
      });

      onUpdate(tasks);
    },
    (error) => {
      onError(error);
    }
  );
};
