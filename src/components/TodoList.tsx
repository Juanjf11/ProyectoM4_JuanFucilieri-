import type { Task, UpdateTaskInput } from '../types/task';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  tasks: Task[];
  onToggle: (taskId: string, currentCompleted: boolean) => Promise<boolean>;
  onUpdate: (taskId: string, input: UpdateTaskInput) => Promise<boolean>;
  onDelete: (taskId: string) => Promise<boolean>;
}

export const TodoList = ({
  tasks,
  onToggle,
  onUpdate,
  onDelete,
}: TodoListProps) => {
  const completedCount = tasks.filter((t) => t.completed).length;

  if (tasks.length === 0) {
    return (
      <div
        style={{
          backgroundColor: '#1e293b',
          border: '1px dashed #475569',
          borderRadius: '12px',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          color: '#94a3b8',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📝</div>
        <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', margin: '0 0 0.5rem 0' }}>
          No tienes tareas pendientes
        </h3>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          Utiliza el formulario superior para agregar tu primera tarea.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          fontSize: '0.9rem',
          color: '#94a3b8',
        }}
      >
        <span>
          Total de tareas: <strong style={{ color: '#f8fafc' }}>{tasks.length}</strong>
        </span>
        <span>
          Completadas:{' '}
          <strong style={{ color: '#10b981' }}>
            {completedCount} de {tasks.length}
          </strong>
        </span>
      </div>

      <ul style={{ padding: 0, margin: 0 }}>
        {tasks.map((task) => (
          <TodoItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
